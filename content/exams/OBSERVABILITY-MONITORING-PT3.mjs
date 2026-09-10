/**
 * Observability & Monitoring — Progress Test 3 (chương s09–s12).
 *
 * 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi. Đề GIỮA KỲ,
 * dễ hơn FE một bậc.
 *
 * ┌── MÁY ĐO ────────────────────────────────────────────────────────────────┐
 * │ Node v22.21.0 · darwin-arm64 (macOS 25.6, Apple silicon)                 │
 * │ Prometheus                          v3.5.0 (container, Docker 29.5.3)   │
 * └──────────────────────────────────────────────────────────────────────────┘
 * Container Prometheus đã `docker rm -f` sau khi đo xong.
 *
 * ═══ NHỮNG CHỖ MÁY KHÁC GIÁO TRÌNH — ĐỀ THEO MÁY ═══
 *
 *  1. **Bài 9.3 nói NGƯỢC về công dụng của cửa sổ NGẮN.** Nguyên văn phát hiện
 *     số 2 của bài: "cửa sổ ngắn là thứ ngăn cảnh báo tới muộn — riêng cửa sổ
 *     1 giờ phải mất ~20 phút mới vượt ngưỡng trong một cú sập toàn phần, còn
 *     đòi thêm cửa sổ 5 phút thì nó kêu sau khoảng 5 phút." Điều đó không thể
 *     đúng: luật là `burn(1h) >= 14,4 VÀ burn(5m) >= 14,4`, mà một phép VÀ thì
 *     không bao giờ đúng sớm hơn vế đúng muộn hơn.
 *
 *     Mô phỏng thật (chính là đáp án mẫu câu 31, chạy được trong bộ kiểm) trên
 *     một dòng thời gian 120 phút — nền 0,1%, sự cố 3% từ phút 30 tới 59, sạch
 *     từ phút 60 — với SLO 99,9%:
 *
 *         chỉ cửa sổ 60 phút : kêu từ phút 55 tới phút 90
 *         cả hai cửa sổ      : kêu từ phút 55 tới phút 61
 *
 *     Hai luật BẮT ĐẦU KÊU CÙNG MỘT PHÚT. Cái mà vế ngắn thật sự mua là TẮT
 *     NHANH: sự cố hết ở phút 59, luật hai-cửa-sổ im sau 2 phút còn luật một-
 *     cửa-sổ kêu thêm 31 phút nữa vào lúc chẳng còn gì hỏng. Đó đúng là lý do
 *     sách SRE của Google thêm vế ngắn, và phát hiện số 3 của chính bài 9.3
 *     ("vế cửa sổ dài là thứ ngăn báo động giả") thì lại đúng. Câu 31 bắt học
 *     viên tự tính ra chỗ này thay vì tin vào bài.
 *
 *  2. **Ngữ nghĩa `for:` — đo thật trên Prometheus v3.5.0.** Hai luật cùng một
 *     biểu thức `up{job="lab"} == 0`, `scrape_interval` và `evaluation_interval`
 *     đều 5 giây. Ngắt mục tiêu lúc 21:09:19 rồi hỏi `/api/v1/rules` mỗi 5 giây:
 *
 *         không có `for:`   -> firing ngay ở lần đánh giá đầu (21:09:24, ~5 giây)
 *         `for: 30s`        -> pending liên tục tới 21:09:49, firing ở 21:09:54
 *
 *     Tức là ~35 giây: một lần đánh giá để vào pending, cộng đúng 30 giây của
 *     `for`. Câu 3 dùng nguyên văn phép đo này.
 *
 * ═══ NHỮNG CHỖ CHỈ SUY THEO TÀI LIỆU, KHÔNG ĐO ĐƯỢC ═══
 *   • **Alertmanager (chương 9.4)**: `group_by`, `group_wait`, `repeat_interval`
 *     và `inhibit_rules` — mức tài liệu, KHÔNG dựng Alertmanager.
 *   • **Grafana (chương 10)**: mọi câu về trục y tự co, `$__rate_interval`, các
 *     phép tính chú giải (Mean/Max/Last), exemplar và derived field đều theo
 *     tài liệu Grafana. **Suy luận theo tài liệu, chưa chạy được.** Riêng phần
 *     SỐ HỌC của "đồ thị nói dối khi thu nhỏ" thì câu 32 tính thật bằng đúng
 *     thuật toán `histogram_quantile` đã đối chiếu với Prometheus v3.5.0 ở đề
 *     PT1, nên phần đó là tính toán chứ không phải suy đoán.
 *   • **`predict_linear`, `quantile_over_time`**: mức tài liệu.
 *   • **Sentry, GlitchTip, Slack**: không đụng dịch vụ thật nào, không DSN,
 *     không đọc `.env`, không đụng cơ sở dữ liệu.
 *   • **Bốn sự cố thật của kho này (chương 11.3)**: lấy nguyên văn phần ghi
 *     chép của dự án, KHÔNG dựng lại.
 *   • **Mọi con số nano giây và mọi số đo độ trễ tuyệt đối**: KHÔNG đo lại, và
 *     không câu nào trong đề hỏi chúng.
 *
 * ═══ PHÂN BỐ CÂU THEO CHƯƠNG (30 câu trắc nghiệm) ═══
 *   Ch. 9  · tầng cảnh báo, ngưỡng, SLO, mệt mỏi ..............  8  (q1–q8)
 *   Ch. 10 · khán giả, sáu cách đồ thị nói dối, ba cú bấm .....  7  (q9–q15)
 *   Ch. 11 · năm phút đầu, bảy hình dạng, bốn sự cố, bản ghi ...  8  (q16–q23)
 *   Ch. 12 · mọi con số đã đo, dựng cái gì trước ..............  7  (q24–q30)
 *   + 2 câu lập trình (5 điểm mỗi câu): q31 chương 9, q32 chương 10 + 4.
 *
 * Điểm thô 30 + 10 = 40, khai `totalPoints: 10`.
 *
 * Ba câu ghi "chọn HAI": q8, q15 và q23.
 * Phân bố vị trí đáp án (đếm mọi phần tử của correctIndexes, 33 đáp án trên 30
 * câu vì có ba câu "chọn HAI"): A 8 · B 8 · C 8 · D 9.
 *   node -e "import('./content/exams/OBSERVABILITY-MONITORING-PT3.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>q.kind==='MCQ').forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Kiểm: node scripts/exam-check.mjs content/exams/OBSERVABILITY-MONITORING-PT3.mjs
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/OBSERVABILITY-MONITORING-PT3.mjs --apply
 */
import { B, EX, code, c, sim, ptInstructions, mcq, codeQ } from './_lib/observability-exam-kit.mjs';

export default {
  course: { slug: 'observability-monitoring' },
  exams: [
    {
      kind: 'FE',
      code: 'PT3',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B(
        'Progress Test 3 — Chapters 9–12 (alerting, dashboards, diagnosis, what to build first)',
        'Kiểm tra tiến độ 3 — Chương 9–12 (cảnh báo, bảng theo dõi, chẩn đoán, dựng cái gì trước)',
      ),
      description: B(
        'The last third of the Observability course: when it is right to interrupt a person, how a chart drawn from correct data leads to the wrong conclusion, the first five minutes of an incident, and the order in which to build any of it. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba cuối của khoá Quan trắc: khi nào thì được phép cắt ngang một con người, làm sao một đồ thị vẽ từ dữ liệu ĐÚNG lại dẫn tới kết luận SAI, năm phút đầu của một sự cố, và thứ tự dựng tất cả những thứ đó. 30 câu trắc nghiệm cộng 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(3, '9–12'),
      questions: [
        // ── Chương 9 — cảnh báo ──────────────────────────────────────────
        mcq({
          prompt: B(
            'You have twelve alerts that ring a phone. A colleague suggests tuning their thresholds. What is the more useful move for a project maintained by one person, and why?',
            'Bạn có mười hai cảnh báo làm điện thoại reo. Một đồng nghiệp đề nghị chỉnh lại ngưỡng của chúng. Với một dự án do MỘT người duy trì thì nước đi hữu ích hơn là gì, và vì sao?',
          ),
          options: [
            B(
              'Route them all to a single channel with a digest at the top of each hour, so twelve notifications become one interruption; the alerts stay and the interruption count drops, which is what fatigue is actually about',
              'Định tuyến hết vào một kênh duy nhất kèm một bản tóm tắt đầu mỗi giờ, để mười hai thông báo thành một lần bị cắt ngang; các cảnh báo vẫn giữ nguyên còn số lần bị cắt ngang thì giảm, và đó mới là bản chất của sự mệt mỏi',
            ),
            B(
              'Raise every threshold by a fixed factor derived from the last quarter\'s firing rate, so the total number of pages lands near a target you choose; tuning by a single global factor is faster than deriving twelve numbers separately',
              'Nâng mọi ngưỡng lên một hệ số cố định suy ra từ tần suất kêu của quý vừa rồi, để tổng số lần gọi rơi gần một mục tiêu bạn chọn; chỉnh bằng một hệ số chung thì nhanh hơn suy ra mười hai con số riêng lẻ',
            ),
            B(
              'MINIMISE rather than tune. There are three tiers and only one of them wakes anybody: PAGE (users are affected AND it is getting worse AND there is a nameable action), TICKET (the condition is real, the urgency is not) and DASHBOARD (nothing is sent; you look when you look). A team of five can afford twenty page-level alerts; a team of one can afford at most three, because the fourth displaces attention from the first three. If you have twelve, you have zero',
              'GIẢM XUỐNG TỐI THIỂU chứ đừng chỉnh. Có ba tầng và chỉ một tầng đánh thức người: GỌI (người dùng đang bị ảnh hưởng VÀ nó đang xấu đi VÀ có một hành động gọi được tên), PHIẾU (điều kiện là có thật, còn tính cấp bách thì không) và BẢNG THEO DÕI (không gửi gì cả; bạn nhìn khi bạn nhìn). Một nhóm năm người kham được hai mươi cảnh báo mức gọi; một nhóm một người kham được nhiều nhất là BA, vì cái thứ tư sẽ lấy mất sự chú ý của ba cái đầu. Có mười hai thì tức là có KHÔNG cái nào',
            ),
            B(
              'Add a suppression window around every deploy and every cron schedule, since predictable events are the largest single source of pages; once the predictable ones are silenced the remaining twelve become manageable without changing any threshold',
              'Thêm một cửa sổ dập tiếng quanh mọi lần deploy và mọi lịch cron, vì các sự kiện đoán trước được là nguồn gọi lớn nhất; khi đã dập được phần đoán trước được thì mười hai cái còn lại trở nên kham nổi mà không cần đổi ngưỡng nào',
            ),
          ],
          correct: 2,
          explanation: EX(
            'For this repository the whole page list is three: the site is unreachable from outside, the error budget is burning fast enough to matter, and Postgres is unreachable from the backend. Everything else — event-loop lag, memory, GC, pool waits, disk, certificate expiry — is a ticket or a dashboard, because none of them is both user-affecting and urgent at the moment it crosses a line. Option D is genuinely good advice and belongs in the same review; it just does not fix having twelve.',
            'Với kho này thì cả danh sách mức gọi chỉ có ba: trang không với tới được từ bên ngoài, ngân sách lỗi đang bị đốt đủ nhanh để đáng bận tâm, và Postgres không với tới được từ backend. Mọi thứ khác — độ trễ vòng lặp, bộ nhớ, thu gom rác, chờ bể kết nối, đĩa, hạn chứng chỉ — đều là phiếu hoặc bảng theo dõi, vì không cái nào vừa ảnh hưởng người dùng vừa cấp bách ngay tại khoảnh khắc nó vượt một cái vạch. Lựa chọn D là lời khuyên tốt thật và thuộc về cùng buổi rà soát ấy; nó chỉ không sửa được việc bạn đang có mười hai cái.',
          ),
        }),

        mcq({
          prompt: B(
            'Every alert you have fires when a number goes UP. Which alert is missing, and why is the business version of it better than the traffic version?',
            'Mọi cảnh báo bạn có đều kêu khi một con số ĐI LÊN. Cảnh báo nào đang thiếu, và vì sao bản NGHIỆP VỤ của nó tốt hơn bản theo lưu lượng?',
          ),
          options: [
            B(
              'An alert on latency going DOWN, because p99 improving during an outage is the classic signature of requests failing fast instead of succeeding slowly; the business version is better because it is not affected by which routes are still answering, and the same reasoning applies to any latency panel',
              'Một cảnh báo khi độ trễ ĐI XUỐNG, vì p99 tốt lên trong lúc có sự cố là dấu hiệu kinh điển của việc các request đang hỏng NHANH thay vì thành công CHẬM; bản nghiệp vụ tốt hơn vì nó không bị ảnh hưởng bởi việc route nào còn trả lời được, và cùng lối lập luận ấy áp cho mọi khung độ trễ',
            ),
            B(
              'An alert on the ratio of p99 to p50 falling, because a narrowing gap means the slow tail has stopped being served at all; the business version is better because a ratio has no units and therefore needs no threshold review, which is why the ratio belongs next to the raw lines',
              'Một cảnh báo khi tỉ số p99 trên p50 GIẢM, vì khoảng cách thu hẹp nghĩa là cái đuôi chậm đã hoàn toàn không còn được phục vụ; bản nghiệp vụ tốt hơn vì một tỉ số thì không có đơn vị nên không cần rà lại ngưỡng, và đó là lý do cái tỉ số nên nằm cạnh hai đường thô',
            ),
            B(
              'An alert on the scrape target disappearing, because <code>up</code> going to zero is the only signal that survives your own metrics stack failing; the business version is better because it is computed at the edge rather than inside the process being measured, so one expression covers both the metrics stack and the service',
              'Một cảnh báo khi mục tiêu lấy mẫu biến mất, vì <code>up</code> về 0 là tín hiệu duy nhất sống sót khi chính hệ chỉ số của bạn hỏng; bản nghiệp vụ tốt hơn vì nó được tính ở biên chứ không phải bên trong cái tiến trình đang bị đo, nên một biểu thức phủ được cả hệ chỉ số lẫn dịch vụ',
            ),
            B(
              'An alert that fires when a number goes to ZERO — because zero is exactly what a broken frontend, a DNS misconfiguration, an expired certificate and a Cloudflare origin failure all look like from inside your backend. ' + c('sum(rate(http_requests_total[5m])) < 0.1') + ' is the traffic version, and the login version ' + c('sum(rate(logins_total{outcome="success"}[15m])) == 0') + ' is better because a genuine quiet period at 4am trips the first one and not the second: fifteen minutes with zero successful logins is a real signal at any hour',
              'Một cảnh báo kêu khi một con số về KHÔNG — vì con số không đúng là thứ mà một frontend hỏng, một cấu hình DNS sai, một chứng chỉ hết hạn và một cú Cloudflare đánh dấu nguồn là chết đều trông giống hệt nhau khi nhìn từ bên trong backend của bạn. ' + c('sum(rate(http_requests_total[5m])) < 0.1') + ' là bản theo lưu lượng, còn bản theo lượt đăng nhập ' + c('sum(rate(logins_total{outcome="success"}[15m])) == 0') + ' tốt hơn vì một quãng vắng THẬT lúc 4 giờ sáng sẽ làm cái thứ nhất kêu mà không làm cái thứ hai kêu: mười lăm phút không có lượt đăng nhập thành công nào là một tín hiệu thật ở bất kỳ giờ nào',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Option A describes something real and is a property of the latency panel rather than an alert: p99 improving during an outage is why the error rate must sit on the same panel as latency, since neither number means anything without the other. The zero alert is the one that catches the failure where every system metric goes green — the deploy that breaks the login form URL, where request rate drops 90%, errors are zero, latency is excellent, the loop is idle and memory is low.',
            'Lựa chọn A mô tả một thứ có thật và nó là một thuộc tính của cái bảng độ trễ chứ không phải một cảnh báo: p99 TỐT LÊN trong lúc có sự cố chính là lý do tỉ lệ lỗi phải nằm trên cùng một khung với độ trễ, vì không con số nào trong hai cái có nghĩa nếu thiếu cái kia. Cảnh báo-về-không mới là cái bắt được kiểu hỏng mà mọi chỉ số hệ thống đều xanh — lần deploy làm hỏng URL của biểu mẫu đăng nhập, khi tốc độ request giảm 90%, lỗi bằng 0, độ trễ xuất sắc, vòng lặp nhàn rỗi và bộ nhớ thấp.',
          ),
        }),

        mcq({
          prompt: B(
            'Real measurement on Prometheus v3.5.0. Two rules with the identical expression <code>up{job="lab"} == 0</code>, scrape and evaluation intervals both 5s. The target was killed at 21:09:19 and <code>/api/v1/rules</code> was polled every 5 seconds:' + code(
              'no `for:`     21:09:24  firing\n' +
              '\n' +
              '`for: 30s`    21:09:24  pending\n' +
              '              21:09:29  pending\n' +
              '              ...\n' +
              '              21:09:49  pending\n' +
              '              21:09:54  firing',
            ) + 'What does <code>for:</code> cost you, and what does it buy?',
            'Đo thật trên Prometheus v3.5.0. Hai luật với biểu thức giống hệt nhau <code>up{job="lab"} == 0</code>, chu kỳ lấy mẫu và chu kỳ đánh giá đều 5 giây. Mục tiêu bị ngắt lúc 21:09:19 và <code>/api/v1/rules</code> được hỏi mỗi 5 giây:' + code(
              'không có `for:`   21:09:24  firing\n' +
              '\n' +
              '`for: 30s`        21:09:24  pending\n' +
              '                  21:09:29  pending\n' +
              '                  ...\n' +
              '                  21:09:49  pending\n' +
              '                  21:09:54  firing',
            ) + '<code>for:</code> làm bạn tốn gì, và mua được gì?',
          ),
          options: [
            B(
              'It costs the <code>for</code> duration plus one evaluation — about 35 seconds here against about 5 without it — and it buys the filtering of transients: the condition has to hold across EVERY evaluation in the window, so a single scrape that catches a deploy restart never reaches <code>firing</code>. One false evaluation resets the pending state and the clock starts again',
              'Nó tốn đúng khoảng <code>for</code> cộng một lần đánh giá — cỡ 35 giây ở đây so với cỡ 5 giây nếu không có — và nó mua cho bạn khả năng lọc các cú thoáng qua: điều kiện phải đúng ở MỌI lần đánh giá trong cửa sổ đó, nên một lượt lấy mẫu đơn lẻ vô tình chộp trúng một lần khởi động lại khi deploy sẽ không bao giờ tới được trạng thái <code>firing</code>. Một lần đánh giá SAI là đặt lại trạng thái pending và đồng hồ chạy lại từ đầu',
            ),
            B(
              'It costs nothing in detection time — <code>pending</code> is already delivered to Alertmanager, which applies its own <code>group_wait</code> before notifying — and it buys a cleaner rule list, since an alert that is pending rather than firing does not appear on the alerts page',
              'Nó không tốn gì về thời gian phát hiện — trạng thái <code>pending</code> đã được gửi tới Alertmanager rồi, và Alertmanager áp <code>group_wait</code> của chính nó trước khi báo — và nó mua cho bạn một danh sách luật gọn hơn, vì một cảnh báo đang pending chứ chưa firing thì không hiện trên trang cảnh báo',
            ),
            B(
              'It costs the <code>for</code> duration and it buys nothing that a longer range selector would not: <code>rate(...[30s])</code> smooths the same transients at the same delay, so <code>for:</code> is a convenience rather than a distinct mechanism',
              'Nó tốn đúng khoảng <code>for</code> và không mua được gì mà một bộ chọn khoảng dài hơn không mua được: <code>rate(...[30s])</code> làm mượt đúng những cú thoáng qua ấy với đúng độ trễ ấy, nên <code>for:</code> là một thứ tiện tay chứ không phải một cơ chế riêng',
            ),
            B(
              'It costs one evaluation interval regardless of the duration you write, because Prometheus evaluates the <code>for</code> window retroactively against samples it already has; it buys the guarantee that the condition was true for the whole window even before the rule existed',
              'Nó tốn đúng một chu kỳ đánh giá bất kể bạn ghi khoảng bao lâu, vì Prometheus xét cửa sổ <code>for</code> HỒI TỐ trên những mẫu nó đã có sẵn; nó mua cho bạn bảo đảm rằng điều kiện đã đúng trong suốt cửa sổ, kể cả trước khi luật đó tồn tại',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The trade is explicit and worth stating in the annotation next to the rule: you are buying quiet at the price of that many seconds of detection delay. For a page-level alert on a total outage, thirty seconds is cheap; for an alert whose whole purpose is to catch a two-minute blip, a <code>for:</code> longer than the blip means the alert can never fire at all — which is a failure mode that produces no error and no evidence, just an alert that has been silent for a year.',
            'Cái đánh đổi là tường minh và đáng ghi ngay vào phần chú thích cạnh luật: bạn đang mua sự yên tĩnh bằng đúng chừng ấy giây chậm phát hiện. Với một cảnh báo mức gọi cho một cú sập toàn phần thì ba mươi giây là rẻ; còn với một cảnh báo mà cả mục đích là bắt một cú chớp hai phút thì một <code>for:</code> dài hơn cú chớp ấy nghĩa là cảnh báo KHÔNG BAO GIỜ kêu được — một kiểu hỏng không sinh ra lỗi nào và bằng chứng nào, chỉ có một cảnh báo im lặng suốt một năm.',
          ),
        }),

        mcq({
          prompt: B(
            'RSS climbing is normal, so "RSS above 400 MB" is meaningless without knowing the limit and the history. Which alert shape works, and what are its three properties?',
            'RSS leo lên là chuyện bình thường, nên "RSS trên 400 MB" là vô nghĩa nếu không biết giới hạn và lịch sử. Hình dạng cảnh báo nào chạy được, và ba thuộc tính của nó là gì?',
          ),
          options: [
            B(
              'Alert on the DERIVATIVE crossing zero — <code>deriv(process_resident_memory_bytes[1h]) &gt; 0</code> — because any sustained positive slope is by definition a leak; it works without a limit, without a history and without a threshold, which is what makes it the only shape that needs no tuning',
              'Cảnh báo khi ĐẠO HÀM vượt 0 — <code>deriv(process_resident_memory_bytes[1h]) &gt; 0</code> — vì mọi độ dốc dương kéo dài theo định nghĩa là một chỗ rò; nó chạy mà không cần giới hạn, không cần lịch sử và không cần ngưỡng, và chính vì thế nó là hình dạng duy nhất không phải chỉnh',
            ),
            B(
              'Alert on the TREND reaching the wall: <code>predict_linear(process_resident_memory_bytes[1h], 4*3600) &gt; container_memory_limit_bytes</code>. Three properties: it fires BEFORE the wall rather than at it, so four hours of warning is enough to restart deliberately instead of being OOM-killed mid-request; it works without knowing what "normal" is, because the threshold is the limit, which you already know; and it does not fire on a healthy sawtooth, whose slope over an hour is near zero',
              'Cảnh báo khi XU HƯỚNG chạm tường: <code>predict_linear(process_resident_memory_bytes[1h], 4*3600) &gt; container_memory_limit_bytes</code>. Ba thuộc tính: nó kêu TRƯỚC bức tường chứ không phải ngay tại tường, nên bốn tiếng báo trước là đủ để khởi động lại một cách có chủ ý thay vì bị giết giữa một request; nó chạy được mà không cần biết "bình thường" là bao nhiêu, vì ngưỡng chính là cái giới hạn mà bạn vốn đã biết; và nó không kêu vì một hình răng cưa khoẻ mạnh, thứ có độ dốc gần 0 trên một giờ',
            ),
            B(
              'Alert on the ratio to the previous day at the same hour, which removes both the limit and the trend from the expression; it works without a limit, compares like with like across the daily cycle, and its threshold is a percentage that never needs revisiting as traffic grows',
              'Cảnh báo theo tỉ số so với cùng giờ ngày hôm trước, cách này bỏ được cả cái giới hạn lẫn cái xu hướng ra khỏi biểu thức; nó chạy mà không cần giới hạn, so cùng loại với cùng loại theo chu kỳ ngày, và ngưỡng của nó là một phần trăm chẳng bao giờ phải xem lại khi lưu lượng tăng',
            ),
            B(
              'Alert on <code>heapUsed</code> measured at the daily MINIMUM rather than on RSS, since the bottom of the sawtooth is the live set; three properties: it ignores allocation churn, it needs no container limit, and it is the only expression that distinguishes a JavaScript leak from a native one',
              'Cảnh báo trên <code>heapUsed</code> đo tại ĐÁY của ngày thay vì trên RSS, vì đáy hình răng cưa mới là tập đối tượng còn sống; ba thuộc tính: nó bỏ qua phần cấp phát lên xuống thường ngày, nó không cần giới hạn container, và nó là biểu thức duy nhất phân biệt được rò rỉ JavaScript với rò rỉ phía native',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Option D is a real and recommended alert, and it answers a different question — "is the live set growing" — on a much longer timescale. The trend alert is what buys you a chosen restart instead of an OOM kill. Note the disk version of the same expression: <code>predict_linear(node_filesystem_avail_bytes{mountpoint="/"}[6h], 24*3600) &lt; 0</code> would have caught the deploy that died with "no space left on device" the previous evening. <b>Suy luận theo tài liệu Prometheus, chưa chạy được</b> — no <code>predict_linear</code> query was executed for this exam.',
            'Lựa chọn D là một cảnh báo có thật và được khuyến nghị, và nó trả lời một câu hỏi KHÁC — "tập đối tượng còn sống có đang phình không" — trên một thang thời gian dài hơn nhiều. Cảnh báo theo xu hướng mới là thứ mua cho bạn một lần khởi động lại DO BẠN CHỌN thay vì một cú bị giết vì hết bộ nhớ. Để ý bản dành cho đĩa của cùng biểu thức ấy: <code>predict_linear(node_filesystem_avail_bytes{mountpoint="/"}[6h], 24*3600) &lt; 0</code> lẽ ra đã bắt được cái lần deploy chết với "no space left on device" từ tối hôm trước. <b>Suy luận theo tài liệu Prometheus, chưa chạy được</b> — không có truy vấn <code>predict_linear</code> nào được chạy cho đề này.',
          ),
        }),

        mcq({
          prompt: B(
            'Your alert is ' + c('error_rate > 1%') + '. It is silent on a busy afternoon and it fires at 4am. Why, and what does a correct expression add?',
            'Cảnh báo của bạn là ' + c('error_rate > 1%') + '. Nó im lặng suốt một buổi chiều bận rộn và lại kêu lúc 4 giờ sáng. Vì sao, và một biểu thức ĐÚNG thì thêm cái gì?',
          ),
          options: [
            B(
              'Because the ratio is computed over a fixed 5-minute window, and at 4am fewer samples land in it, so the estimate is noisier; widening the window at low traffic — a range selector scaled by <code>$__rate_interval</code> — stabilises it without adding a second clause',
              'Vì tỉ số được tính trên một cửa sổ 5 phút cố định, mà lúc 4 giờ sáng thì ít mẫu rơi vào đó nên ước lượng nhiễu hơn; nới cửa sổ khi lưu lượng thấp — một bộ chọn khoảng co theo <code>$__rate_interval</code> — sẽ ổn định nó mà không cần thêm mệnh đề thứ hai',
            ),
            B(
              'Because a percentage compares errors to the traffic that happened to arrive, and overnight batch jobs count as traffic while the daytime web requests do not; excluding the job routes from both the numerator and the denominator restores the daytime sensitivity',
              'Vì một tỉ lệ phần trăm so lỗi với lượng lưu lượng tình cờ tới, mà các việc chạy nền ban đêm được tính là lưu lượng còn các request web ban ngày thì không; loại các route của việc chạy nền khỏi cả tử số lẫn mẫu số là khôi phục được độ nhạy ban ngày',
            ),
            B(
              'Because 1% is the wrong number for this service and should be derived rather than copied: two weeks of history give you the worst NORMAL value, and one and a half times that is the threshold; the expression itself is fine and only the constant is wrong',
              'Vì 1% là con số sai với dịch vụ này và phải được SUY RA chứ không phải chép về: hai tuần lịch sử cho bạn giá trị BÌNH THƯỜNG tệ nhất, và một phẩy năm lần con số đó là cái ngưỡng; bản thân biểu thức thì ổn và chỉ có hằng số là sai',
            ),
            B(
              'Because the same percentage means opposite things at different volumes: at 500 requests per second it is 5 failures per second and serious, at 0.5 requests per second it is ONE request that failed and nothing. A correct expression requires BOTH a rate and a COUNT — the ratio above 1% AND ' + c('sum(rate(http_requests_total{code=~"5.."}[5m])) > 0.1') + ', which means at least six failures a minute. Below that the percentage is noise regardless of how large it looks',
              'Vì cùng một tỉ lệ phần trăm mang ý nghĩa NGƯỢC NHAU ở hai mức lưu lượng: ở 500 request mỗi giây thì đó là 5 cú hỏng mỗi giây và rất nghiêm trọng, ở 0,5 request mỗi giây thì đó là MỘT request hỏng và chẳng là gì. Một biểu thức đúng đòi CẢ một tỉ lệ VÀ một SỐ ĐẾM — tỉ số trên 1% VÀ ' + c('sum(rate(http_requests_total{code=~"5.."}[5m])) > 0.1') + ', tức là ít nhất sáu cú hỏng mỗi phút. Dưới mức đó thì tỉ lệ phần trăm chỉ là nhiễu, bất kể nó trông to tới đâu',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The low-traffic case is the one that does the damage, because it fires constantly at exactly the hour when nobody should be woken for one request — and a page that is wrong at 4am is how a person learns to reach for the mute button. Option C is good advice about a different failure (a copied threshold), and it does not fix this one: deriving 1% from history still leaves the expression blind to volume.',
            'Ca lưu lượng thấp mới là ca gây hại, vì nó kêu liên tục đúng vào cái giờ mà không ai nên bị đánh thức vì một cái request — và một cú gọi SAI lúc 4 giờ sáng chính là cách một con người học được thói quen với tay tới nút tắt tiếng. Lựa chọn C là lời khuyên tốt về một kiểu hỏng KHÁC (một cái ngưỡng chép về), và nó không sửa được cái này: suy ra con số 1% từ lịch sử thì biểu thức vẫn mù trước khối lượng.',
          ),
        }),

        mcq({
          prompt: B(
            'You derive a latency threshold the recommended way: query the worst hourly p99 over the last fourteen days, then set the alert at one and a half times it. What is the failure mode of that method, and when should you use the other one?',
            'Bạn suy ra một ngưỡng độ trễ theo đúng cách được khuyến nghị: hỏi giá trị p99 theo giờ tệ nhất trong mười bốn ngày qua, rồi đặt cảnh báo ở một phẩy năm lần con số đó. Kiểu hỏng của phương pháp ấy là gì, và khi nào thì nên dùng phương pháp kia?',
          ),
          options: [
            B(
              'It encodes whatever was BROKEN during those two weeks. The query is honest about what the system did, not about what it should do — so if a slow query was live for that fortnight, the "worst normal" already includes it, the threshold is set above it, and the alert will now never fire for that class of problem again. The failure is self-sealing: the worse your service was during the sampling window, the more permissive the alert you derive, and the derivation looks equally rigorous either way. Look at the graph over the same window and ask whether you would have been happy with it; if not, derive from a REQUIREMENT instead',
              'Nó đóng gói luôn bất cứ thứ gì đang HỎNG trong hai tuần ấy. Truy vấn kia trung thực về việc hệ thống ĐÃ làm gì, chứ không phải về việc nó NÊN làm gì — nên nếu một truy vấn chậm sống suốt nửa tháng đó thì cái "bình thường tệ nhất" đã bao gồm nó, ngưỡng được đặt cao hơn nó, và cảnh báo từ nay sẽ không bao giờ kêu cho lớp vấn đề ấy nữa. Kiểu hỏng này TỰ BỊT MIỆNG: dịch vụ của bạn càng tệ trong cửa sổ lấy mẫu thì cảnh báo bạn suy ra càng dễ dãi, mà phép suy ra thì nhìn nghiêm túc như nhau ở cả hai đằng. Hãy nhìn đồ thị trên đúng cửa sổ ấy và tự hỏi bạn có hài lòng với nó không; nếu không thì hãy suy từ một YÊU CẦU',
            ),
            B(
              'It assumes the distribution is stationary, and latency is not: traffic patterns shift weekly, so a threshold derived on a fortnight that included a public holiday is biased low and will fire on the first ordinary Monday; deriving from a full quarter removes the seasonality, after which the same query can be re-run without changing the expression at all',
              'Nó giả định phân bố là dừng, mà độ trễ thì không: khuôn lưu lượng dịch chuyển theo tuần, nên một ngưỡng suy ra từ nửa tháng có chứa một ngày lễ sẽ bị lệch xuống thấp và sẽ kêu vào ngày thứ Hai bình thường đầu tiên; suy ra từ trọn một quý là hết tính mùa vụ, sau đó vẫn truy vấn ấy chạy lại được mà không phải đổi biểu thức chút nào',
            ),
            B(
              'It uses a percentile of a percentile, which is not a well-defined statistic: <code>quantile_over_time</code> over a series of <code>histogram_quantile</code> values compounds the interpolation error of both, so the number can be off by a factor that nothing reports, and the compounded error is what makes the number unusable as an alert threshold',
              'Nó dùng một phân vị CỦA một phân vị, thứ không phải một đại lượng thống kê được định nghĩa rõ: <code>quantile_over_time</code> trên một chuỗi các giá trị <code>histogram_quantile</code> chồng sai số nội suy của cả hai, nên con số có thể lệch một hệ số mà chẳng có gì báo lại, và cái sai số chồng lên nhau ấy làm cho con số không dùng nổi làm ngưỡng cảnh báo',
            ),
            B(
              'It cannot see a regression that is slower than the sampling window: a service that degrades by 2% a week stays inside one and a half times the worst hour for months, so the alert never fires while the service becomes twice as slow; a rate-of-change expression is the other method, so the threshold has to be re-derived on a schedule rather than set once and left',
              'Nó không nhìn thấy được một cú thoái lui chậm hơn cửa sổ lấy mẫu: một dịch vụ xấu đi 2% mỗi tuần sẽ nằm trong một phẩy năm lần giờ tệ nhất suốt nhiều tháng, nên cảnh báo không bao giờ kêu trong khi dịch vụ chậm đi gấp đôi; một biểu thức theo TỐC ĐỘ THAY ĐỔI mới là phương pháp kia, nên cái ngưỡng phải được suy lại theo lịch chứ không phải đặt một lần rồi để đó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The two methods answer different questions and the difference is worth naming out loud: "from data" means "alert me when this CHANGES", and "from users" means "alert me when this is WRONG". Use the second wherever you can state the requirement — "a note must save in under one second, or people type over the top of a save that has not landed" gives you a threshold of one second regardless of what p99 is today, and the fact that today\'s p99 is 989 ms then tells you something you needed to know.',
            'Hai phương pháp trả lời hai câu hỏi khác nhau và khác biệt ấy đáng gọi thành lời: "suy từ dữ liệu" nghĩa là "báo tôi khi cái này ĐỔI", còn "suy từ người dùng" nghĩa là "báo tôi khi cái này SAI". Hãy dùng cái thứ hai ở bất cứ đâu bạn phát biểu được cái yêu cầu — "một ghi chú phải lưu xong dưới một giây, nếu không người ta sẽ gõ đè lên một lần lưu chưa kịp tới nơi" cho bạn một ngưỡng một giây bất kể hôm nay p99 là bao nhiêu, và việc p99 hôm nay là 989 ms khi ấy lại nói cho bạn một điều bạn cần biết.',
          ),
        }),

        mcq({
          prompt: B(
            'Your error budget has been untouched for four months running: the SLO is met comfortably every month with room to spare. Your colleague calls it a success. What else could it mean?',
            'Ngân sách lỗi của bạn không hề bị đụng tới suốt bốn tháng liền: SLO tháng nào cũng đạt thoải mái và còn dư. Đồng nghiệp của bạn gọi đó là một thành công. Nó CÒN có thể nghĩa là gì?',
          ),
          options: [
            B(
              'That the SLI is measuring the wrong thing: an availability ratio that includes health-check traffic is dominated by requests that always succeed instantly, so the number describes your monitoring rather than your users and would look excellent through a real outage',
              'Rằng SLI đang đo nhầm thứ: một tỉ lệ khả dụng có tính cả lưu lượng thăm dò sức khoẻ sẽ bị lấn át bởi những request luôn thành công tức thì, nên con số ấy mô tả hệ giám sát của bạn chứ không phải người dùng, và nó vẫn đẹp xuyên qua một cú sập thật',
            ),
            B(
              'That the window is too long: a 30-day rolling window absorbs a bad day so thoroughly that a single incident never shows, so a shorter window would reveal spending that the monthly figure hides',
              'Rằng cửa sổ quá dài: một cửa sổ trượt 30 ngày hấp thụ một ngày tồi kỹ tới mức một sự cố đơn lẻ không bao giờ lộ ra, nên một cửa sổ ngắn hơn sẽ phơi ra phần chi tiêu mà con số theo tháng đang che',
            ),
            B(
              'That the SLO is too LOOSE, or that you are being too conservative and could ship faster. An error budget you never spend is not a triumph — it is capacity you paid for and did not use. The point of a budget is to make "how much risk can we take" a NUMBER instead of an argument: with 38 of 43 minutes left you ship the risky refactor because you can afford a rollback, and with 4 left you freeze. Both of those are decisions the number makes for you, and neither is visible without it',
              'Rằng SLO đang quá LỎNG, hoặc rằng bạn đang quá dè dặt và lẽ ra ship được nhanh hơn. Một ngân sách lỗi không bao giờ tiêu tới không phải một chiến thắng — nó là năng lực bạn đã trả tiền mà không dùng. Mục đích của một ngân sách là biến câu "chúng ta gánh được bao nhiêu rủi ro" thành một CON SỐ thay vì một cuộc tranh cãi: còn 38 trên 43 phút thì bạn ship cái tái cấu trúc mạo hiểm vì bạn kham nổi một lần quay lui, còn 4 phút thì bạn đóng băng. Cả hai đều là quyết định mà con số ấy làm hộ bạn, và không cái nào nhìn thấy được nếu thiếu nó',
            ),
            B(
              'That the burn-rate alerts are misconfigured: if the two-window rule never fires then either the thresholds are above anything the service can produce, or the recording rules feeding them stopped updating and the budget graph is being drawn from stale data',
              'Rằng các cảnh báo theo hệ số đốt bị cấu hình sai: nếu luật hai-cửa-sổ không bao giờ kêu thì hoặc là ngưỡng nằm trên mọi thứ dịch vụ có thể sinh ra, hoặc là các luật ghi nuôi chúng đã ngừng cập nhật và đồ thị ngân sách đang được vẽ từ dữ liệu cũ',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the case people miss, and it is the reason an SLO is a decision rather than a measurement. Note also the honest sizing for this repository: 99.9% is 43 minutes a month, and one bad deploy needing a ten-minute rollback spends nearly a quarter of that, so 99.5% (3.6 hours) is defensible for a one-VPS manual-deploy project and 99.99% (4 minutes, total, including every deploy and every Postgres restart) is decoration. An SLO you routinely miss tells you nothing when you miss it.',
            'Đây là ca người ta hay bỏ sót, và nó là lý do một SLO là một QUYẾT ĐỊNH chứ không phải một phép đo. Cũng để ý cách chọn cỡ trung thực cho kho này: 99,9% là 43 phút mỗi tháng, và một lần deploy tồi cần quay lui mười phút đã tiêu gần một phần tư chỗ đó, nên 99,5% (3,6 giờ) là bảo vệ được với một dự án một-VPS deploy-bằng-tay, còn 99,99% (4 phút, tổng cộng, tính cả mọi lần deploy và mọi lần khởi động lại Postgres) chỉ là đồ trang trí. Một SLO mà bạn trượt đều đều thì lúc bạn trượt nó chẳng nói được gì.',
          ),
        }),

        mcq({
          prompt: B(
            'During a real outage everything breaks at once, so an un-inhibited Alertmanager sends its largest burst of notifications at exactly the moment you need to concentrate. Choose the TWO mechanisms that turn eleven notifications into one. (choose TWO)',
            'Trong một cú sập thật thì mọi thứ hỏng cùng lúc, nên một Alertmanager chưa cấu hình dập chéo sẽ gửi chùm thông báo lớn nhất của nó đúng vào lúc bạn cần tập trung nhất. Chọn HAI cơ chế biến mười một thông báo thành một. (chọn HAI)',
          ),
          options: [
            B(
              'A shorter <code>evaluation_interval</code> on the rule group, so related alerts are evaluated in the same pass and Prometheus emits them as one notification rather than as separate ones',
              'Một <code>evaluation_interval</code> ngắn hơn cho nhóm luật, để các cảnh báo liên quan được đánh giá trong cùng một lượt và Prometheus phát chúng ra thành một thông báo duy nhất thay vì nhiều cái riêng lẻ',
            ),
            B(
              '<code>group_by</code> with <code>group_wait</code>, which collects related alerts for a short period before sending, so the same condition across six routes arrives as ONE notification with six entries',
              '<code>group_by</code> kèm <code>group_wait</code>, thứ gom các cảnh báo liên quan trong một khoảng ngắn trước khi gửi, để cùng một điều kiện xảy ra trên sáu route tới nơi thành MỘT thông báo có sáu mục',
            ),
            B(
              '<code>repeat_interval</code> set to zero, which stops Alertmanager re-sending anything at all while an alert is firing and therefore removes every duplicate notification for the duration of the incident',
              '<code>repeat_interval</code> đặt về 0, thứ chặn Alertmanager gửi lại bất cứ thứ gì trong lúc một cảnh báo đang kêu và do đó bỏ được mọi thông báo trùng suốt thời gian sự cố',
            ),
            B(
              '<code>inhibit_rules</code>, so that when the whole site is unreachable, the latency, pool-wait and error-rate pages are SUPPRESSED — one incident, one page, and the other ten stay visible on the dashboard when you look',
              '<code>inhibit_rules</code>, để khi cả trang không với tới được thì các cú gọi về độ trễ, chờ bể kết nối và tỉ lệ lỗi bị DẬP đi — một sự cố, một cú gọi, còn mười cái kia vẫn hiện trên bảng theo dõi khi bạn nhìn tới',
            ),
          ],
          correct: [1, 3],
          explanation: EX(
            'Inhibition is the one people skip and then most need, because it addresses the specific shape of a real outage: alerting on CAUSES rather than symptoms means Postgres slowing down produces a pool-wait page, a latency page, an error-rate page, a memory page and an event-loop page — five pages, one problem. Alert on the symptom users feel and keep the rest as dashboard context. <b>Suy luận theo tài liệu Alertmanager, chưa dựng.</b>',
            'Dập chéo là thứ người ta hay bỏ qua rồi lại cần nhất, vì nó nhắm đúng hình dạng của một cú sập thật: cảnh báo theo NGUYÊN NHÂN thay vì theo triệu chứng nghĩa là Postgres chậm đi sẽ sinh ra một cú gọi về chờ bể kết nối, một cú về độ trễ, một cú về tỉ lệ lỗi, một cú về bộ nhớ và một cú về vòng lặp sự kiện — năm cú gọi, một vấn đề. Hãy cảnh báo theo triệu chứng mà người dùng cảm thấy và giữ phần còn lại làm ngữ cảnh trên bảng theo dõi. <b>Suy luận theo tài liệu Alertmanager, chưa dựng.</b>',
          ),
        }),
        // ── Chương 10 — bảng theo dõi ────────────────────────────────────
        mcq({
          prompt: B(
            'A dashboard goes from six useful panels to forty unread ones over nine months, and nothing was done wrong at any step. What is the mechanism, and what is the fix?',
            'Một bảng theo dõi đi từ sáu khung hữu ích tới bốn mươi khung chẳng ai đọc trong chín tháng, mà không bước nào làm sai cả. Cơ chế là gì, và cách sửa là gì?',
          ),
          options: [
            B(
              'Panels are added faster than metrics are retired, so the ratio of panels to live series drifts; the fix is a quarterly audit that removes any panel whose query returns no data, which reliably clears about half of them, so a quarterly pass keeps the panel count from ever exceeding what one screen holds',
              'Khung được thêm nhanh hơn tốc độ các chỉ số bị nghỉ hưu, nên tỉ lệ khung trên số chuỗi còn sống trôi dần; cách sửa là một buổi rà soát hằng quý gỡ bỏ mọi khung mà truy vấn của nó không trả về dữ liệu, và cách đó gạt được đều đặn khoảng một nửa, nên một lượt rà mỗi quý giữ cho số khung không bao giờ vượt quá cái mà một màn hình chứa được',
            ),
            B(
              'Every panel is added by someone solving a real problem and nobody ever deletes one, so it dies of CORRECT decisions, one at a time. The fix is not discipline but SCOPE: one audience, one question, and one TIME RANGE per dashboard. The time range is the test that separates them — the 3am dashboard is read at one hour, the investigation dashboard at six hours, the planning dashboard at thirty days — and a dashboard that tries to serve all three shows a 30-day view during an incident, where a four-second spike is one pixel wide and invisible',
              'Mỗi cái khung đều do một người đang giải một vấn đề có thật thêm vào, và chẳng ai bao giờ xoá cái nào, nên nó chết vì những quyết định ĐÚNG, từng cái một. Cách sửa không phải kỷ luật mà là PHẠM VI: một khán giả, một câu hỏi, và một KHOẢNG THỜI GIAN cho mỗi bảng. Chính khoảng thời gian là phép thử tách chúng ra — bảng 3-giờ-sáng đọc ở mức một giờ, bảng điều tra ở mức sáu giờ, bảng lập kế hoạch ở mức ba mươi ngày — và một cái bảng cố phục vụ cả ba sẽ hiện ra khung nhìn 30 ngày ngay giữa một sự cố, nơi một cú vọt bốn giây rộng đúng một điểm ảnh và vô hình',
            ),
            B(
              'People add panels without understanding the metric behind them, so the dashboard accumulates numbers nobody can interpret; the fix is to require a written description on every panel before it can be saved, which forces the author to state what it is for, and the description then doubles as the panel title when the layout is exported',
              'Người ta thêm khung mà không hiểu cái chỉ số đằng sau, nên bảng theo dõi tích lại những con số chẳng ai diễn giải nổi; cách sửa là bắt buộc mỗi khung phải có một mô tả bằng chữ trước khi lưu được, để buộc tác giả nói rõ nó dùng làm gì, và phần mô tả ấy khi xuất bố cục ra thì kiêm luôn vai trò tiêu đề khung',
            ),
            B(
              'The panels are fine and the layout is the problem: forty panels across three screens means the two you use are below the fold, so the fix is ordering — symptoms at the top, causes below — and no panel needs to be removed at all, so the same forty panels become readable without anyone having to agree on what to delete',
              'Các khung thì ổn và bố cục mới là vấn đề: bốn mươi khung trải trên ba màn hình nghĩa là hai cái bạn hay dùng nằm dưới tầm nhìn, nên cách sửa là THỨ TỰ — triệu chứng lên trên, nguyên nhân xuống dưới — và không cần gỡ khung nào cả, nên vẫn bốn mươi khung ấy trở nên đọc được mà không ai phải thống nhất xem nên xoá cái nào',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The investigation dashboard is the one with the most structure, and its layout IS the diagnostic order: row 1 symptoms (request rate, error rate by code, p50/p95/p99), row 2 this process (event-loop lag p99, RSS against the limit, major GC rate), row 3 dependencies (pool busy/idle/WAITING, db query p99, outbound by host), row 4 context (deploy annotations, uptime, log error rate). You read top to bottom and each row narrows the previous one — whether something is wrong, whether it is this process, whether it is something it waits on, whether you caused it.',
            'Bảng điều tra là cái có cấu trúc nhất, và bố cục của nó CHÍNH LÀ thứ tự chẩn đoán: hàng 1 triệu chứng (tốc độ request, tỉ lệ lỗi theo mã, p50/p95/p99), hàng 2 chính tiến trình này (độ trễ vòng lặp p99, RSS so với giới hạn, tần suất thu gom rác lớn), hàng 3 các phụ thuộc (bể kết nối busy/idle/ĐANG CHỜ, p99 truy vấn, gọi ra ngoài theo host), hàng 4 ngữ cảnh (chú thích deploy, thời gian chạy, tỉ lệ lỗi trong log). Bạn đọc từ trên xuống và mỗi hàng thu hẹp hàng trước — có gì sai không, có phải tiến trình này không, có phải thứ nó đang chờ không, có phải bạn gây ra không.',
          ),
        }),

        mcq({
          prompt: B(
            'The 3am dashboard has four panels: is it up, error rate, p99 latency, budget remaining. It has NO graphs — just big numbers with colour thresholds. Why is that the right choice for that audience?',
            'Bảng 3-giờ-sáng có bốn khung: còn sống không, tỉ lệ lỗi, độ trễ p99, ngân sách còn lại. Nó KHÔNG có đồ thị nào — chỉ là những con số to kèm ngưỡng màu. Vì sao đó là lựa chọn đúng cho khán giả ấy?',
          ),
          options: [
            B(
              'Because a graph requires a range query, which is slower to render on a phone over a mobile connection than four instant queries; the four-panel layout is chosen for load time and the absence of graphs is a consequence of that rather than a design decision',
              'Vì một đồ thị đòi một truy vấn theo khoảng, thứ dựng chậm hơn trên điện thoại qua kết nối di động so với bốn truy vấn tức thời; bố cục bốn khung được chọn vì thời gian tải và việc vắng đồ thị là hệ quả của điều đó chứ không phải một quyết định thiết kế',
            ),
            B(
              'Because a graph invites you to start investigating, and the 3am dashboard exists to prevent that: it must be readable without waking up fully, so any element that rewards attention is removed on purpose and re-added on the investigation dashboard',
              'Vì một cái đồ thị mời gọi bạn bắt đầu điều tra, mà bảng 3-giờ-sáng tồn tại để NGĂN chuyện đó: nó phải đọc được mà không cần tỉnh hẳn, nên mọi thành phần nào tưởng thưởng cho sự chú ý đều bị bỏ đi có chủ ý và được thêm lại ở bảng điều tra',
            ),
            B(
              'Because a colour threshold can be evaluated by a machine and a graph cannot, so the four panels double as the alert definitions themselves; keeping them free of graphs is what lets one artefact serve both purposes without drifting apart',
              'Vì một ngưỡng màu thì máy đánh giá được còn một cái đồ thị thì không, nên bốn khung ấy kiêm luôn vai trò định nghĩa cảnh báo; giữ chúng không có đồ thị chính là thứ cho phép một hiện vật phục vụ cả hai mục đích mà không trôi lệch khỏi nhau',
            ),
            B(
              'Because it answers exactly one question — do I need to get out of bed? — read in ten seconds, on a phone, half awake. At 3am a sparkline conveys LESS than a number and a colour, and this is the one dashboard where a red number beats an exact one. Save the graphs for the moment you have decided to actually investigate, which is a different dashboard read at a different time range',
              'Vì nó trả lời đúng MỘT câu hỏi — tôi có cần ra khỏi giường không? — đọc trong mười giây, trên điện thoại, lúc còn nửa tỉnh nửa mê. Lúc 3 giờ sáng thì một đường sparkline truyền tải ÍT hơn một con số kèm một cái màu, và đây là cái bảng duy nhất mà một con số ĐỎ hơn hẳn một con số CHÍNH XÁC. Hãy để dành các đồ thị cho khoảnh khắc bạn đã quyết định thật sự đi điều tra, và đó là một cái bảng khác đọc ở một khoảng thời gian khác',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The test that separates the three dashboards is what time range each is read at. A panel that is useful at all three ranges is rare, and the whole reason to split them is that the same graph cannot serve a ten-second glance and a thirty-day trend. Note that "budget remaining" is on the 3am board deliberately: it converts "is this bad" into "how much of the month does this cost", which is the question that decides whether to act now or in the morning.',
            'Phép thử tách ba cái bảng ra là mỗi cái được đọc ở KHOẢNG THỜI GIAN nào. Một cái khung hữu ích ở cả ba khoảng thì hiếm, và toàn bộ lý do phải tách chúng ra là vì cùng một cái đồ thị không thể phục vụ được cả một cái liếc mười giây lẫn một xu hướng ba mươi ngày. Để ý rằng "ngân sách còn lại" nằm trên bảng 3-giờ-sáng là có chủ ý: nó biến câu "cái này có tệ không" thành câu "cái này tốn bao nhiêu phần của tháng", và đó mới là câu hỏi quyết định nên hành động ngay hay đợi tới sáng.',
          ),
        }),

        mcq({
          prompt: B(
            'Grafana auto-scales the y-axis to fit the data. The error-rate panel is drawn from 0.40 to 0.44 and shows a dramatic peak. The same series on an axis from 0 to 100 is a flat line at 0.4%. When is auto-scale the right setting?',
            'Grafana tự co trục y cho vừa dữ liệu. Khung tỉ lệ lỗi được vẽ từ 0,40 tới 0,44 và hiện ra một cái đỉnh dữ dội. Vẫn chuỗi ấy trên một trục từ 0 tới 100 là một đường phẳng ở 0,4%. Khi nào thì tự-co-trục là thiết lập ĐÚNG?',
          ),
          options: [
            B(
              'When you reason about the series as a SHAPE rather than as a magnitude — latency during an incident, where what matters is whether the curve is climbing, spiking or flat. For anything you reason about as a magnitude — error rates, percentages, counts — set an explicit minimum of zero, because otherwise the panel makes whatever variation exists fill the whole frame, and there is always some variation',
              'Khi bạn suy nghĩ về chuỗi ấy như một HÌNH DẠNG chứ không phải như một độ lớn — độ trễ trong lúc có sự cố, khi thứ đáng kể là đường cong đang leo lên, đang vọt hay đang phẳng. Còn với bất cứ thứ gì bạn suy nghĩ như một ĐỘ LỚN — tỉ lệ lỗi, phần trăm, số đếm — hãy đặt cận dưới tường minh bằng 0, vì nếu không thì cái khung sẽ làm cho phần dao động dù nhỏ tới đâu cũng lấp đầy cả khuôn hình, mà dao động thì lúc nào cũng có',
            ),
            B(
              'When the series has a known upper bound, because the axis can then be pinned to that bound and auto-scale becomes equivalent to a fixed axis; for unbounded series the automatic behaviour is the only one that keeps the line on screen',
              'Khi chuỗi ấy có một cận trên đã biết, vì khi đó trục có thể ghim vào cận ấy và tự-co-trục trở thành tương đương với một trục cố định; còn với các chuỗi không có chặn thì hành vi tự động là cái duy nhất giữ được đường vẽ trong màn hình',
            ),
            B(
              'When the panel is on the 3am dashboard, where exaggerating small variation is a feature rather than a bug: a half-awake reader needs the change to be visible, and the exact magnitude is available from the alert that woke them',
              'Khi cái khung nằm trên bảng 3-giờ-sáng, nơi phóng đại dao động nhỏ là một TÍNH NĂNG chứ không phải một lỗi: một người đọc nửa tỉnh cần thấy được sự thay đổi, còn độ lớn chính xác thì đã có sẵn trong cái cảnh báo đánh thức họ',
            ),
            B(
              'Never on a shared dashboard: auto-scale is a per-viewer convenience because the range depends on what happens to be in view, so two people looking at the same panel at slightly different times reason from two different pictures and reach two different conclusions',
              'Không bao giờ trên một bảng dùng chung: tự-co-trục là một tiện lợi cho từng người xem vì cái tầm ấy phụ thuộc vào thứ tình cờ đang nằm trong khung nhìn, nên hai người nhìn cùng một khung ở hai thời điểm hơi lệch nhau sẽ suy luận từ hai bức tranh khác nhau và đi tới hai kết luận khác nhau',
            ),
          ],
          correct: 0,
          explanation: EX(
            'What makes this whole family of charts dangerous is that every one of them is drawn from correct data by correctly-written software. There is no bug to find, and the wrong conclusion feels like a discovery. Option D is a real objection and it is not the rule: auto-scale genuinely is right for latency during an incident, where a fixed axis chosen for normal operation flattens the very spike you opened the panel to see.',
            'Thứ làm cho cả họ đồ thị này nguy hiểm là mỗi cái trong số chúng đều được vẽ từ dữ liệu ĐÚNG bởi phần mềm viết ĐÚNG. Chẳng có lỗi nào để tìm, và cái kết luận sai thì cho cảm giác như một phát hiện. Lựa chọn D là một phản đối có thật và nó không phải cái luật: tự-co-trục thật sự đúng cho độ trễ trong lúc có sự cố, khi mà một trục cố định chọn theo lúc bình thường sẽ làm phẳng đúng cái đỉnh mà bạn mở khung ấy ra để nhìn.',
          ),
        }),

        mcq({
          prompt: B(
            'A panel shows a line that only ever rises — a smooth, beautiful upward curve that never comes back down. What is it, and what is the tell?',
            'Một cái khung hiện ra một đường chỉ đi lên — một đường cong mượt, đẹp, đi lên và không bao giờ quay xuống. Nó là gì, và dấu hiệu nhận ra là gì?',
          ),
          options: [
            B(
              'A gauge with a stale <code>collect()</code> callback: the value was written once and never refreshed, so Prometheus carries the last sample forward and the line rises only because the axis is cumulative time; the tell is that <code>up</code> is 1 while the series has a single sample',
              'Một gauge có callback <code>collect()</code> đã ôi: giá trị chỉ được ghi một lần rồi không bao giờ làm mới, nên Prometheus kéo mẫu cuối cùng đi tiếp và đường ấy đi lên chỉ vì trục là thời gian tích luỹ; dấu hiệu là <code>up</code> bằng 1 trong khi chuỗi chỉ có đúng một mẫu',
            ),
            B(
              'A histogram\'s <code>_sum</code> series plotted directly, which is the most common version of this mistake because <code>_sum</code> looks like a duration and is actually an accumulator; the tell is that the units on the axis are seconds and the value is in the thousands',
              'Chuỗi <code>_sum</code> của một histogram được vẽ thẳng, phiên bản thường gặp nhất của lỗi này vì <code>_sum</code> TRÔNG như một thời lượng mà thực chất là một bộ tích luỹ; dấu hiệu là đơn vị trên trục là giây còn giá trị thì lên tới hàng nghìn',
            ),
            B(
              'A COUNTER drawn raw. It only ever goes up by definition, so the graph shows the same monotonic line whether traffic doubled or halved — the SLOPE is the information, and your eye is bad at slopes. The tell is exactly that: any graph that never comes back down is a counter someone forgot to wrap in <code>rate()</code>',
              'Một COUNTER vẽ thô. Theo định nghĩa nó chỉ đi lên, nên đồ thị hiện ra vẫn đúng cái đường đơn điệu ấy dù lưu lượng tăng gấp đôi hay giảm một nửa — ĐỘ DỐC mới là thông tin, mà mắt người thì đọc độ dốc rất tệ. Dấu hiệu chính là như vậy: bất kỳ đồ thị nào không bao giờ quay xuống đều là một counter mà ai đó quên bọc trong <code>rate()</code>',
            ),
            B(
              'An <code>increase()</code> over a range longer than the panel\'s time window, which accumulates across the whole selected period rather than per step; the tell is that zooming out makes the final value larger while the shape stays identical',
              'Một phép <code>increase()</code> trên một khoảng dài hơn cửa sổ thời gian của khung, thứ tích luỹ trên cả quãng đã chọn thay vì theo từng bước; dấu hiệu là thu nhỏ khung nhìn thì giá trị cuối lớn hơn trong khi hình dạng vẫn y hệt',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A counter\'s raw value means nothing on its own — it is "since this process started", and it resets when the process does. You never read a counter; you read its rate, and <code>rate()</code> knows that a decrease means a restart and handles it. That is why "counters only go up" is a rule rather than a suggestion: break it with a <code>dec()</code> and <code>rate()</code> reads your decrement as a restart and adds the pre-reset value back, growing spikes on your graph that never happened.',
            'Giá trị thô của một counter tự nó chẳng nghĩa gì — nó là "kể từ lúc tiến trình này khởi động", và nó về 0 khi tiến trình khởi động lại. Bạn không bao giờ ĐỌC một counter; bạn đọc TỐC ĐỘ của nó, và <code>rate()</code> biết rằng một lần giảm nghĩa là một lần khởi động lại và xử lý được chuyện đó. Đó là lý do "counter chỉ đi lên" là một LUẬT chứ không phải một gợi ý: phá nó bằng một lời gọi <code>dec()</code> thì <code>rate()</code> đọc phép giảm của bạn thành một lần khởi động lại rồi cộng ngược giá trị trước đó vào, mọc lên trên đồ thị của bạn những cái đỉnh chưa từng xảy ra.',
          ),
        }),

        mcq({
          prompt: B(
            'The request-rate panel has a gap: the line stops, then resumes several minutes later. Which panel do you check first, and what do its two possible readings mean?',
            'Khung tốc độ request có một chỗ thủng: đường vẽ dừng lại rồi vài phút sau tiếp tục. Bạn kiểm khung nào trước, và hai cách đọc có thể của nó nghĩa là gì?',
          ),
          options: [
            B(
              'The deploy annotations, because a gap that lines up with a deploy is a container restart before the first scrape and needs no further investigation; a gap with no annotation is the one worth chasing, and that check is one glance',
              'Các chú thích deploy, vì một chỗ thủng trùng với một lần deploy là một lần container khởi động lại trước lượt lấy mẫu đầu và không cần điều tra thêm; một chỗ thủng KHÔNG có chú thích mới là cái đáng đuổi theo, và phép kiểm ấy chỉ tốn một cái liếc',
            ),
            B(
              '<code>up{job="backend"}</code>. A gap far more often means you stopped RECEIVING data than that traffic stopped: a scrape timeout puts a gap in EVERY metric including the healthy ones, a container restart leaves one before its first scrape, and Prometheus itself may have been down. <code>up = 0</code> means the gap is YOURS; <code>up = 1</code> with a flat zero means traffic really stopped. It is the panel that tells you whether to trust the other fourteen',
              '<code>up{job="backend"}</code>. Một chỗ thủng thường có nghĩa là bạn ngừng NHẬN dữ liệu hơn là lưu lượng ngừng chảy: một lượt lấy mẫu hết giờ để lại một chỗ thủng trên MỌI chỉ số, kể cả những cái đang khoẻ, một lần container khởi động lại để lại một chỗ thủng trước lượt lấy mẫu đầu của nó, và bản thân Prometheus cũng có thể đã chết. <code>up = 0</code> nghĩa là chỗ thủng ấy là CỦA BẠN; <code>up = 1</code> kèm một đường phẳng bằng 0 nghĩa là lưu lượng ngừng thật. Nó là cái khung nói cho bạn biết có nên tin mười bốn khung kia hay không',
            ),
            B(
              'The error-rate panel, because a genuine traffic stop and a scrape failure differ in exactly one way — the first is preceded by a spike in errors and the second is not; reading the two panels together is what disambiguates them',
              'Khung tỉ lệ lỗi, vì một lần lưu lượng ngừng thật và một lần lấy mẫu hỏng khác nhau đúng ở một chỗ — cái thứ nhất có một cú vọt lỗi ngay trước, cái thứ hai thì không; đọc hai khung cùng nhau là phân biệt được',
            ),
            B(
              'Nothing: a gap in a rate panel is always an artefact of the range selector being shorter than the scrape interval, so the fix is to use <code>$__rate_interval</code> and the gap disappears without telling you anything about the service',
              'Chẳng cần kiểm gì: một chỗ thủng trên khung tốc độ luôn là hiện vật của việc bộ chọn khoảng ngắn hơn chu kỳ lấy mẫu, nên cách sửa là dùng <code>$__rate_interval</code> và chỗ thủng biến mất mà chẳng nói cho bạn điều gì về dịch vụ',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The reason this one is worth a dedicated panel is that a gap looks exactly like the most alarming thing on the board — traffic went to zero — while usually meaning something much more boring and entirely about your monitoring. Getting that backwards during an incident sends you to investigate an outage that is not happening. <b>Suy luận theo tài liệu Prometheus và Grafana, chưa dựng lại</b> — the <code>up</code> series is generated by Prometheus itself, which is what makes it available even when the target is not.',
            'Lý do cái này đáng dành hẳn một khung là vì một chỗ thủng trông y hệt thứ đáng báo động nhất trên cả cái bảng — lưu lượng về 0 — trong khi nó thường mang nghĩa buồn tẻ hơn nhiều và hoàn toàn nói về hệ giám sát của bạn. Đọc ngược chuyện đó trong lúc có sự cố sẽ đẩy bạn đi điều tra một cú sập không hề xảy ra. <b>Suy luận theo tài liệu Prometheus và Grafana, chưa dựng lại</b> — chuỗi <code>up</code> do chính Prometheus sinh ra, và đó là điều làm cho nó vẫn có mặt ngay cả khi mục tiêu thì không.',
          ),
        }),

        mcq({
          prompt: B(
            'A latency panel draws the p99 line correctly and shows a single number underneath it from the legend calculation. The default legend calculation is Mean. What is wrong, and what should it be set to?',
            'Một khung độ trễ vẽ đúng đường p99 và hiện một con số duy nhất bên dưới, lấy từ phép tính chú giải. Phép tính chú giải mặc định là Mean (trung bình). Sai ở đâu, và nên đặt nó thành gì?',
          ),
          options: [
            B(
              'The mean of a p99 series is a valid summary of the panel\'s own window, so nothing is wrong statistically; the setting to change is the DECIMAL PLACES, because a latency figure rendered to six digits reads as precision the histogram does not have',
              'Trung bình của một chuỗi p99 là một tóm tắt hợp lệ cho cửa sổ của chính cái khung ấy, nên về mặt thống kê chẳng có gì sai; thứ cần đổi là SỐ CHỮ SỐ THẬP PHÂN, vì một con số độ trễ hiện tới sáu chữ số đọc ra thành một độ chính xác mà histogram không hề có',
            ),
            B(
              'The mean is computed across all series in the panel rather than along the time axis, so with p50, p95 and p99 all drawn it silently averages three different percentiles together; splitting them into three panels is the fix',
              'Phép trung bình được tính trên TẤT CẢ các chuỗi trong khung chứ không phải dọc theo trục thời gian, nên khi vẽ cả p50, p95 và p99 thì nó âm thầm lấy trung bình của ba phân vị khác nhau; tách chúng ra ba khung là cách sửa',
            ),
            B(
              'The mean discards the units, because a legend calculation is applied to the raw sample values before the panel\'s unit formatting; the number under a seconds-based latency line is therefore a bare float and should be set to Last, which preserves formatting',
              'Phép trung bình làm mất đơn vị, vì một phép tính chú giải được áp lên các giá trị mẫu THÔ trước khi khung định dạng đơn vị; nên con số dưới một đường độ trễ tính bằng giây là một số thực trần trụi và nên đặt thành Last để giữ được định dạng',
            ),
            B(
              'The LINE is honest and the NUMBER under it is not, and people read the number. An average of a percentile series is the same mistake as the average this course started with — measured at 39.5 ms against a p50 of 15.2 and a p99 of 989, a number that described nobody. Set legend calculations to Max and Last on any latency or error panel: if a single number must appear, it should be the WORST one in view, because that is the number a reader will act on',
              'ĐƯỜNG VẼ thì trung thực còn CON SỐ bên dưới thì không, mà người ta lại đọc con số. Lấy trung bình của một chuỗi phân vị chính là cái sai lầm mà khoá học này mở đầu bằng nó — đo được 39,5 ms trong khi p50 là 15,2 và p99 là 989, một con số chẳng mô tả được ai. Hãy đặt phép tính chú giải thành Max và Last trên mọi khung độ trễ hay tỉ lệ lỗi: nếu buộc phải hiện một con số duy nhất thì nó phải là con số TỆ NHẤT trong tầm nhìn, vì đó mới là con số mà người đọc sẽ hành động theo',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is the subtlest of the family because both halves of the panel are drawn from the same correct series and only one of them lies. It is also the version of the averaging problem that survives after you have fixed the more famous one — computing the quantile last so that zooming out does not shrink an incident — because the legend is a separate setting that nobody thinks to change. <b>Suy luận theo tài liệu Grafana, chưa dựng.</b>',
            'Đây là cái tinh vi nhất trong cả họ, vì cả hai nửa của cái khung đều vẽ ra từ cùng một chuỗi ĐÚNG và chỉ một nửa nói dối. Nó cũng là phiên bản của vấn đề lấy-trung-bình còn sống sót sau khi bạn đã sửa cái nổi tiếng hơn — tính phân vị SAU CÙNG để thu nhỏ khung nhìn không làm co lại một sự cố — vì phần chú giải là một thiết lập riêng mà chẳng ai nghĩ tới việc đổi. <b>Suy luận theo tài liệu Grafana, chưa dựng.</b>',
          ),
        }),

        mcq({
          prompt: B(
            'You are wiring the four links that turn separate tools into one path: ids in every log line, alert annotations carrying a dashboard link, derived fields turning ids into links, and exemplars turning a point on a latency graph into a trace. Choose the TWO correct statements about the order. (choose TWO)',
            'Bạn đang nối bốn đường liên kết biến các công cụ rời rạc thành một con đường: id trong mọi dòng log, chú thích cảnh báo mang theo link tới bảng theo dõi, derived field biến id thành link, và exemplar biến một điểm trên đồ thị độ trễ thành một trace. Chọn HAI phát biểu ĐÚNG về thứ tự. (chọn HAI)',
          ),
          options: [
            B(
              'Build the ids in the log lines FIRST — one line in <code>emit()</code> — because every other jump becomes possible after that even if you do it by copy-paste, and nothing else works without it',
              'Hãy dựng phần id trong các dòng log TRƯỚC TIÊN — một dòng trong <code>emit()</code> — vì sau đó mọi bước nhảy khác đều KHẢ THI kể cả khi bạn làm bằng cách chép-dán, và không có nó thì chẳng thứ nào chạy',
            ),
            B(
              'Build exemplars first, because they save the most clicks and everything downstream of a trace is reachable from the trace view; the ids then only formalise a path the exemplar already opens',
              'Hãy dựng exemplar trước, vì chúng tiết kiệm được nhiều cú bấm nhất và mọi thứ phía sau một trace đều với tới được từ giao diện trace; phần id sau đó chỉ chính thức hoá một con đường mà exemplar vốn đã mở ra',
            ),
            B(
              'Most projects build exemplars first because it is the impressive one, and never do the ids — which is why theirs open traces whose logs cannot be found',
              'Phần lớn dự án dựng exemplar trước vì đó là cái gây ấn tượng, rồi không bao giờ làm phần id — và đó là lý do exemplar của họ mở ra những cái trace mà không tìm được log nào',
            ),
            B(
              'Order does not matter because each link is independent; what matters is that all four exist before the next incident, since a partially wired chain is what produces the plausible wrong data described in the chapter',
              'Thứ tự không quan trọng vì mỗi đường liên kết là độc lập; thứ quan trọng là cả bốn phải tồn tại trước sự cố tiếp theo, vì một chuỗi nối dở dang mới là thứ sinh ra loại dữ liệu SAI MÀ HỢP LÝ được mô tả trong chương',
            ),
          ],
          correct: [0, 2],
          explanation: EX(
            'Each link is worth building alone, which is why the ordering is by dependency rather than by impact. And every link in the chain breaks SILENTLY, in the direction of showing you plausible wrong data: traces kept 24 hours against metrics kept 30 days means every exemplar older than a day opens an empty trace view — not an error, just nothing, which reads as "the trace was not sampled" rather than "this link has been dead for weeks". The whole chain is a system with no tests, used only during incidents. Once a month, take a random exemplar older than a day and walk all three clicks.',
            'Mỗi đường liên kết đều đáng dựng ngay cả khi đứng một mình, nên thứ tự ở đây là theo PHỤ THUỘC chứ không theo mức tác động. Và mọi mắt xích trong chuỗi đều đứt trong IM LẶNG, theo hướng cho bạn xem dữ liệu sai mà hợp lý: trace giữ 24 giờ trong khi chỉ số giữ 30 ngày nghĩa là mọi exemplar cũ hơn một ngày đều mở ra một giao diện trace RỖNG — không phải một lỗi, chỉ là không có gì, thứ đọc ra thành "cái trace ấy không được lấy mẫu" chứ không phải "cái link này đã chết từ mấy tuần trước". Cả chuỗi ấy là một hệ thống KHÔNG có phép kiểm nào, chỉ được dùng trong lúc có sự cố. Mỗi tháng một lần, hãy lấy một exemplar bất kỳ cũ hơn một ngày và đi hết cả ba cú bấm.',
          ),
        }),
        // ── Chương 11 — chẩn đoán ────────────────────────────────────────
        mcq({
          prompt: B(
            'The first rule of incident response is "change nothing in the first five minutes". Why?',
            'Luật đầu tiên của việc ứng phó sự cố là "đừng đổi gì trong năm phút đầu". Vì sao?',
          ),
          options: [
            B(
              'Because a change made before you understand the failure makes the failure HARDER to understand: after an untested rollback you can no longer tell whether the current state is the original problem or something the rollback caused. Read first — the precise start time is worth more than any action taken in minute one, because it converts "what is wrong" into "what happened at 14:03"',
              'Vì một thay đổi thực hiện TRƯỚC khi bạn hiểu cú hỏng sẽ làm cú hỏng ấy KHÓ HIỂU HƠN: sau một lần quay lui chưa được kiểm chứng, bạn không còn phân biệt được trạng thái hiện tại là vấn đề ban đầu hay là thứ do chính lần quay lui gây ra. Hãy ĐỌC trước — thời điểm bắt đầu chính xác đáng giá hơn mọi hành động ở phút thứ nhất, vì nó biến câu "cái gì đang sai" thành câu "lúc 14:03 đã xảy ra chuyện gì"',
            ),
            B(
              'Because most incidents resolve themselves within five minutes, so acting early means you cannot tell whether your change helped or whether the condition simply cleared; waiting out the window is the only way to attribute the recovery correctly',
              'Vì phần lớn sự cố tự khỏi trong vòng năm phút, nên hành động sớm nghĩa là bạn không biết được thay đổi của mình có giúp gì không hay điều kiện đơn giản là tự hết; chờ hết cửa sổ ấy là cách duy nhất quy công đúng cho sự hồi phục',
            ),
            B(
              'Because the metrics are unreliable in the first five minutes: a scrape interval of 15 seconds plus a rate window of 5 minutes means the graphs are still filling in, and a change made against a half-drawn graph is a change made against noise',
              'Vì các chỉ số không đáng tin trong năm phút đầu: chu kỳ lấy mẫu 15 giây cộng cửa sổ tốc độ 5 phút nghĩa là các đồ thị vẫn đang được điền dần, và một thay đổi thực hiện dựa trên một đồ thị vẽ dở là một thay đổi thực hiện dựa trên nhiễu',
            ),
            B(
              'Because a change during an active incident cannot be reviewed, and an unreviewed production change is the largest single source of second incidents; the five-minute rule is really a rule about getting a second pair of eyes before touching anything',
              'Vì một thay đổi thực hiện giữa lúc sự cố đang diễn ra thì không rà soát được, mà một thay đổi production chưa rà soát là nguồn lớn nhất sinh ra sự cố THỨ HAI; luật năm phút thật ra là một luật về việc có thêm một cặp mắt nữa trước khi đụng vào bất cứ thứ gì',
            ),
          ],
          correct: 0,
          explanation: EX(
            'What happens without a fixed procedure is measurable: page at 0:00, "I deployed an hour ago" at 0:10, read the diff until 2:00, start a rollback at 3:00, rollback done at 6:00 and still broken, and only at 7:00 start looking at data — having changed the system underneath yourself. The rollback was not unreasonable; it was untested against any evidence. Your reasoning is measurably worse during the first minutes: adrenaline narrows attention, you jump to the most recent thing you touched, and you start typing before you have read anything. The defence is a checklist you wrote when you were calm.',
            'Chuyện xảy ra khi không có một quy trình cố định là đo được: cú gọi lúc 0:00, "một tiếng trước mình vừa deploy" lúc 0:10, đọc diff tới 2:00, bắt đầu quay lui lúc 3:00, quay lui xong lúc 6:00 mà vẫn hỏng, và mãi tới 7:00 mới bắt đầu nhìn dữ liệu — sau khi đã tự tay đổi cái hệ thống dưới chân mình. Lần quay lui ấy không phải vô lý; nó chỉ là chưa được đối chiếu với bằng chứng nào. Khả năng suy luận của bạn tệ đi ĐO ĐƯỢC trong những phút đầu: adrenaline làm hẹp sự chú ý, bạn nhảy ngay tới thứ mình vừa động vào gần nhất, và bạn bắt đầu gõ trước khi đọc bất cứ thứ gì. Cái chống đỡ là một bảng kiểm bạn viết ra lúc còn bình tĩnh.',
          ),
        }),

        mcq({
          prompt: B(
            'Four commands, pasted in under a minute at the start of an incident:' + code(
              '1  the layered curl from lesson 8.5, against the public hostname\n' +
              "2  curl -s -o /dev/null -w '%{http_code}\\n' https://cuongthai.com/api/v1/notes\n" +
              '3  curl -s https://cuongthai.com/health/live  ;  curl -s https://cuongthai.com/health\n' +
              "4  docker ps --format '{{.Names}}\\t{{.Status}}'",
            ) + 'What is the value of running all four before forming a hypothesis?',
            'Bốn câu lệnh, dán chạy trong chưa tới một phút ở đầu một sự cố:' + code(
              '1  the layered curl from lesson 8.5, against the public hostname\n' +
              "2  curl -s -o /dev/null -w '%{http_code}\\n' https://cuongthai.com/api/v1/notes\n" +
              '3  curl -s https://cuongthai.com/health/live  ;  curl -s https://cuongthai.com/health\n' +
              "4  docker ps --format '{{.Names}}\\t{{.Status}}'",
            ) + 'Giá trị của việc chạy cả bốn TRƯỚC khi hình thành một giả thuyết là gì?',
          ),
          options: [
            B(
              'They warm the caches and the connection pools before you start measuring, so the numbers you read afterwards are not distorted by cold-start effects; running them first is a measurement hygiene step rather than a diagnostic one, and the effect is largest on the first request after a quiet period, which is exactly when an incident tends to be noticed',
              'Chúng làm nóng các bộ đệm và các bể kết nối trước khi bạn bắt đầu đo, để các con số bạn đọc sau đó không bị méo bởi hiệu ứng khởi động nguội; chạy chúng trước là một bước vệ sinh phép đo chứ không phải một bước chẩn đoán, và hiệu ứng ấy lớn nhất ở request đầu tiên sau một quãng vắng, đúng vào lúc người ta hay nhận ra một sự cố',
            ),
            B(
              'They produce a timestamped record you can paste into the incident note, which is what makes the post-incident timeline a copy-paste rather than a reconstruction; the diagnostic value is secondary to the record they leave, and the same record is what lets a second person join the investigation without repeating any of the steps already taken',
              'Chúng tạo ra một bản ghi có dấu thời gian để bạn dán vào ghi chú sự cố, và đó là thứ biến dòng thời gian sau sự cố thành một thao tác chép-dán thay vì một cuộc dựng lại; giá trị chẩn đoán chỉ là thứ yếu so với cái bản ghi chúng để lại, và cũng chính bản ghi ấy cho phép một người thứ hai nhập cuộc điều tra mà không phải lặp lại bước nào đã làm',
            ),
            B(
              'They exercise every layer in order, so the first one that fails is by construction the layer at fault; that ordering is what makes the sequence faster than reading a dashboard, where the panels are arranged by data source rather than by layer, and a dashboard cannot offer that ordering because its panels are grouped by data source rather than by network layer',
              'Chúng gõ vào từng tầng theo thứ tự, nên tầng đầu tiên trượt chính là tầng có lỗi theo cấu tạo; đúng thứ tự đó là thứ làm cho chuỗi lệnh này nhanh hơn đọc một bảng theo dõi, nơi các khung được xếp theo nguồn dữ liệu chứ không theo tầng, và một bảng theo dõi không đưa ra được thứ tự ấy vì các khung của nó nhóm theo nguồn dữ liệu chứ không theo tầng mạng',
            ),
            B(
              'Each one ELIMINATES an entire category rather than confirming a guess. A TLS failure means the certificate, not your code. A 404 means a stale build, not your logic. A 502 means nginx reached something that did not answer. <code>/health/live</code> passing while <code>/health</code> returns 503 means Postgres and an application that is fine and waiting. Uptime resetting every 30–45 seconds means a restart loop — and the restart may be CAUSING the database problem rather than reacting to it. Four commands tell you which of the previous ten chapters you are about to need',
              'Mỗi lệnh LOẠI BỎ hẳn một phạm trù chứ không phải xác nhận một phỏng đoán. Trượt ở TLS nghĩa là chứng chỉ, không phải mã của bạn. Một mã 404 nghĩa là một bản dựng cũ, không phải logic của bạn. Một mã 502 nghĩa là nginx tới được một thứ mà thứ đó không trả lời. <code>/health/live</code> đậu trong khi <code>/health</code> trả 503 nghĩa là Postgres, còn ứng dụng thì vẫn ổn và đang chờ. Thời gian chạy cứ 30–45 giây lại về 0 nghĩa là một vòng lặp khởi động lại — và chính việc khởi động lại có thể đang GÂY RA vấn đề cơ sở dữ liệu chứ không phải phản ứng lại nó. Bốn câu lệnh nói cho bạn biết bạn sắp cần tới chương nào trong mười chương trước',
            ),
          ],
          correct: 3,
          explanation: EX(
            'That is worth more than any single graph, because it tells you which body of knowledge to open. And the discipline it enforces is the antidote to the strongest bias of the first five minutes: the first thing you check is whatever you most recently touched, and a diff always contains something that could plausibly be the cause — enough to consume twenty minutes even when the real cause is a certificate that expired on its own schedule. Get the precise start time BEFORE forming the hypothesis: if the failure began at 14:03 and the deploy landed at 09:12, the diff is eliminated in one second by arithmetic.',
            'Thứ đó đáng giá hơn bất kỳ đồ thị đơn lẻ nào, vì nó nói cho bạn biết phải mở khối kiến thức nào ra. Và cái kỷ luật nó áp đặt chính là thuốc giải cho thiên kiến mạnh nhất của năm phút đầu: thứ đầu tiên bạn đi kiểm luôn là thứ bạn vừa động vào gần nhất, mà một cái diff thì lúc nào cũng có một chỗ nghe có vẻ đúng là nguyên nhân — đủ để ngốn hai mươi phút ngay cả khi nguyên nhân thật là một chứng chỉ hết hạn theo đúng lịch của nó. Hãy lấy thời điểm bắt đầu chính xác TRƯỚC khi hình thành giả thuyết: nếu cú hỏng bắt đầu lúc 14:03 mà lần deploy đáp xuống lúc 09:12 thì cái diff bị loại trong một giây bằng phép trừ.',
          ),
        }),

        mcq({
          prompt: B(
            'Latency has been degrading slowly and steadily over the last three hours — a ramp, not a cliff. What does that shape mean, and what is the next move?',
            'Độ trễ xấu đi chậm và đều suốt ba tiếng qua — một cái DỐC, không phải một cái VÁCH. Hình dạng đó nghĩa là gì, và nước đi tiếp theo là gì?',
          ),
          options: [
            B(
              'It means load is rising, because a ramp is the shape of a resource being consumed proportionally to traffic; plot errors against request rate and if the ratio is constant you have confirmed it in ten seconds',
              'Nó nghĩa là tải đang tăng, vì một cái dốc là hình dạng của một tài nguyên bị tiêu thụ tỉ lệ với lưu lượng; hãy vẽ lỗi theo tốc độ request, và nếu tỉ số là hằng số thì bạn đã xác nhận được trong mười giây',
            ),
            B(
              'It means an automatic loop is fighting the failure — a restart or an OOM cycle — because a ramp is what a sawtooth looks like when the panel resolution is too coarse to show the teeth; zooming in to a one-minute step reveals the period',
              'Nó nghĩa là một vòng lặp tự động đang vật lộn với cú hỏng — một chu kỳ khởi động lại hay một chu kỳ hết bộ nhớ — vì một cái dốc chính là hình dạng của một cái răng cưa khi độ phân giải của khung quá thô để hiện ra các cái răng; phóng to về bước một phút là lộ ra chu kỳ',
            ),
            B(
              'It means something is ACCUMULATING — memory, connections that are not being released, a queue growing faster than it drains, a table growing past an index\'s usefulness. The next move is to extend the time range until the ramp STARTS, because a ramp has a beginning and that beginning is a cliff, which puts you back in the discrete-event shape with a far better timestamp',
              'Nó nghĩa là có thứ gì đó đang TÍCH LẠI — bộ nhớ, các kết nối không được trả về, một hàng đợi phình nhanh hơn tốc độ rút, một cái bảng lớn quá mức hữu dụng của một chỉ mục. Nước đi tiếp theo là NỚI khoảng thời gian ra cho tới khi thấy cái dốc BẮT ĐẦU, vì một cái dốc thì có điểm khởi đầu và điểm khởi đầu ấy là một cái VÁCH, thứ đưa bạn về lại hình dạng sự-kiện-rời-rạc với một dấu thời gian tốt hơn hẳn',
            ),
            B(
              'It means the measurement is drifting rather than the service: a histogram whose buckets were changed mid-window computes from different boundaries on each side, which bends a flat line into a ramp; check the deploy annotations for a metrics change before investigating the service at all',
              'Nó nghĩa là PHÉP ĐO đang trôi chứ không phải dịch vụ: một histogram bị đổi bộ ô giữa chừng cửa sổ sẽ tính từ hai bộ ranh giới khác nhau ở hai bên, thứ bẻ một đường phẳng thành một cái dốc; hãy kiểm các chú thích deploy xem có thay đổi nào về chỉ số không trước khi điều tra dịch vụ',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The move from a ramp to its own cliff is the most reliable step in the whole pattern library, because a start time is the single most valuable fact in an incident and a ramp hides it by construction. Note the mirror-image reasoning for the other shapes: a cliff never has a gradual cause, so anything that ramps up — load, memory, a leak — is eliminated the moment you see a vertical edge.',
            'Bước đi từ một cái dốc về cái vách của chính nó là bước đáng tin nhất trong cả thư viện hình dạng, vì một thời điểm bắt đầu là dữ kiện quý nhất trong một sự cố, mà một cái dốc thì theo cấu tạo là giấu nó đi. Để ý lối suy luận soi gương cho các hình dạng khác: một cái vách không bao giờ có nguyên nhân từ từ, nên mọi thứ dâng dần — tải, bộ nhớ, một chỗ rò — đều bị loại ngay khoảnh khắc bạn thấy một cạnh dựng đứng.',
          ),
        }),

        mcq({
          prompt: B(
            'Latency spikes briefly and sharply, then returns to normal — every five minutes, exactly. What is the first thing to do with that number?',
            'Độ trễ vọt lên ngắn và gắt rồi trở lại bình thường — cứ mỗi năm phút một lần, chính xác. Việc đầu tiên phải làm với con số đó là gì?',
          ),
          options: [
            B(
              'Correlate it with the request-rate panel, because a regular spike in latency with no matching spike in traffic is a capacity effect and one with a matching spike is a scheduling effect; the two need completely different fixes',
              'Đối chiếu nó với khung tốc độ request, vì một cú vọt độ trễ đều đặn mà không có cú vọt lưu lượng tương ứng là một hiệu ứng công suất, còn cái có cú vọt tương ứng là một hiệu ứng lịch trình; hai thứ cần hai cách sửa hoàn toàn khác nhau',
            ),
            B(
              'MATCH THE INTERVAL against your crontab and your <code>scrape_interval</code>. Brief, sharp, regular, normal in between is a scheduled job: cron, a cache expiring in unison so every request misses at once, or Prometheus scraping something expensive — a <code>collect()</code> callback that does real work on every scrape is exactly this shape. If the interval matches, it is not an incident, it is a SCHEDULE, and it should never have paged you',
              'ĐỐI CHIẾU CHU KỲ ấy với crontab của bạn và với <code>scrape_interval</code>. Ngắn, gắt, đều, bình thường ở giữa là dấu hiệu của một việc chạy theo lịch: cron, một bộ đệm hết hạn đồng loạt khiến mọi request cùng lúc trượt đệm, hoặc Prometheus đang lấy mẫu một thứ đắt đỏ — một callback <code>collect()</code> làm việc thật ở mỗi lượt lấy mẫu chính là hình dạng này. Nếu chu kỳ khớp thì đó không phải một sự cố, đó là một LỊCH, và lẽ ra nó không bao giờ được phép gọi bạn dậy',
            ),
            B(
              'Measure the WIDTH of each spike rather than the interval, because the duration tells you which subsystem is responsible: milliseconds is garbage collection, seconds is a query, tens of seconds is an external call; the period only tells you it is periodic',
              'Hãy đo BỀ RỘNG của mỗi cú vọt thay vì chu kỳ, vì thời lượng nói cho bạn hệ con nào chịu trách nhiệm: cỡ mili-giây là thu gom rác, cỡ giây là một truy vấn, cỡ hàng chục giây là một lời gọi ra ngoài; còn chu kỳ chỉ nói cho bạn rằng nó có tính chu kỳ',
            ),
            B(
              'Check whether the spikes align with the boundaries of the rate window, because <code>rate()</code> over a 5-minute range produces exactly this artefact when the range and the panel step are equal; changing to <code>$__rate_interval</code> usually makes the spikes disappear entirely',
              'Kiểm xem các cú vọt có trùng với biên của cửa sổ tốc độ không, vì <code>rate()</code> trên khoảng 5 phút tạo ra đúng hiện vật này khi khoảng và bước của khung bằng nhau; đổi sang <code>$__rate_interval</code> thường làm các cú vọt biến mất hoàn toàn',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A regular period is machine-driven and identifies the machine — which is the same reasoning that names the 30-to-45-second sawtooth as this repo\'s healthcheck (interval 15s × 3 retries) rather than as a database problem. An IRREGULAR period means it is load-driven, not a loop, and you are really looking at the load-correlation shape instead. Option A is a good second step once the interval does not match anything you scheduled.',
            'Một chu kỳ ĐỀU thì do máy móc điều khiển và nó gọi tên luôn cái máy móc ấy — cũng chính lối suy luận đó đặt tên cho cái răng cưa 30–45 giây là healthcheck của kho này (chu kỳ 15 giây × 3 lần thử) chứ không phải một vấn đề cơ sở dữ liệu. Một chu kỳ KHÔNG ĐỀU nghĩa là nó do tải điều khiển chứ không phải một vòng lặp, và thật ra bạn đang nhìn hình dạng tương-quan-với-tải. Lựa chọn A là một bước thứ hai tốt, sau khi cái chu kỳ không khớp với thứ gì bạn đã đặt lịch.',
          ),
        }),

        mcq({
          prompt: B(
            'One route returns 100% errors. Every other route is clean, so the overall error rate reads about 3%. What is the shape, what is the next step, and which earlier decision made this visible at all?',
            'Một route trả về 100% lỗi. Mọi route khác đều sạch, nên tỉ lệ lỗi tổng thể đọc ra khoảng 3%. Đây là hình dạng gì, bước tiếp theo là gì, và quyết định nào từ trước đã làm cho chuyện này nhìn thấy được?',
          ),
          options: [
            B(
              'A cliff scoped to one route; the next step is to compare the route\'s deploy annotation against the others, since a partial rollout is the only mechanism that can affect one route and not its neighbours; what made it visible is the deploy annotation being drawn on every panel',
              'Một cái vách thu hẹp trong một route; bước tiếp theo là so chú thích deploy của route ấy với các route khác, vì một lần triển khai từng phần là cơ chế duy nhất ảnh hưởng được một route mà không ảnh hưởng hàng xóm của nó; thứ làm nó nhìn thấy được là chú thích deploy được vẽ trên mọi khung',
            ),
            B(
              'A load correlation confined to one route; the next step is to plot that route\'s error ratio against its own request rate, because a route that is 100% broken and a route that is at capacity look identical in the aggregate; what made it visible is the histogram, which separates slow from failed',
              'Một sự tương quan với tải giới hạn trong một route; bước tiếp theo là vẽ tỉ số lỗi của route ấy theo chính tốc độ request của nó, vì một route hỏng 100% và một route đã hết công suất trông giống hệt nhau khi gộp lại; thứ làm nó nhìn thấy được là cái histogram, thứ tách được "chậm" khỏi "hỏng"',
            ),
            B(
              'A silence, because a route returning 100% errors contributes no successful requests and therefore drops out of every ratio computed over successes; the next step is <code>up</code>, and what made it visible is that the error counter is incremented before the route label is resolved',
              'Một sự IM LẶNG, vì một route trả 100% lỗi thì không đóng góp request thành công nào nên rơi ra khỏi mọi tỉ số tính trên phần thành công; bước tiếp theo là <code>up</code>, và thứ làm nó nhìn thấy được là bộ đếm lỗi được tăng TRƯỚC khi nhãn route được phân giải',
            ),
            B(
              'The PARTIAL. The next step is to find the SMALLEST slice that fails: one user means the failure is data-shaped, one route means that route\'s dependencies, one container out of several means that container. And what made it visible is the route LABEL from chapter 4 — without it a 100% failure on one route looks like a 3% failure overall, which is inside normal variation and pages nobody',
              'Hình dạng PHẦN. Bước tiếp theo là tìm ra LÁT CẮT NHỎ NHẤT bị hỏng: một người dùng nghĩa là cú hỏng mang hình dạng dữ liệu, một route nghĩa là các phụ thuộc của route ấy, một container trong nhiều container nghĩa là chính cái container đó. Còn thứ làm nó nhìn thấy được là cái NHÃN route từ chương 4 — không có nó thì một cú hỏng 100% trên một route trông như một cú hỏng 3% toàn cục, thứ nằm trong khoảng dao động bình thường và chẳng gọi ai dậy cả',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This shape is the strongest argument in the course for a bounded route label — and it is the same label that, done wrong with <code>req.path</code> instead of <code>req.route?.path</code>, lets anyone on the internet add permanent series to your Prometheus. Both facts are about the same line of middleware, which is why chapter 12 puts the metrics middleware in week one and the label choice in a warning next to it.',
            'Hình dạng này là lý lẽ mạnh nhất trong cả khoá cho việc gắn một cái nhãn route CÓ CHẶN — và cũng chính cái nhãn đó, làm sai bằng <code>req.path</code> thay vì <code>req.route?.path</code>, sẽ cho phép bất kỳ ai trên internet thêm chuỗi vĩnh viễn vào Prometheus của bạn. Cả hai dữ kiện đều nói về cùng một dòng middleware, và đó là lý do chương 12 xếp middleware chỉ số vào tuần đầu tiên và đặt phần chọn nhãn thành một cảnh báo ngay cạnh nó.',
          ),
        }),

        mcq({
          prompt: B(
            'A deploy at 14:03 introduces a memory leak. The resulting graph is a step followed by a slow climb, which matches no pattern cleanly. What is the move?',
            'Một lần deploy lúc 14:03 làm lọt vào một chỗ rò bộ nhớ. Đồ thị thu được là một bậc thang rồi tới một đoạn leo chậm, thứ không khớp gọn với khuôn mẫu nào. Nước đi là gì?',
          ),
          options: [
            B(
              'Discard the pattern library for this incident and reason from first principles, because a compound shape means the library has been exceeded; the shapes are a shortcut for simple cases and reaching for them on a mixed graph is what produces confident wrong answers',
              'Bỏ thư viện hình dạng cho sự cố này và suy luận từ nguyên lý gốc, vì một hình dạng phức hợp nghĩa là thư viện đã bị vượt quá; các hình dạng là lối tắt cho những ca đơn giản, và cố dùng chúng trên một đồ thị pha trộn chính là thứ sinh ra những câu trả lời SAI mà TỰ TIN',
            ),
            B(
              'Look for the single cause that explains both halves, because a step plus a climb is the canonical signature of a configuration change that also altered an allocation path; identifying that one change resolves the whole graph at once',
              'Đi tìm cái nguyên nhân DUY NHẤT giải thích được cả hai nửa, vì một bậc thang cộng một đoạn leo là dấu hiệu kinh điển của một thay đổi cấu hình đồng thời làm đổi một đường cấp phát; xác định được cái thay đổi ấy là giải quyết cả đồ thị cùng lúc',
            ),
            B(
              'SEPARATE THEM BY TIME rather than by cause: identify the shape of the FIRST five minutes and treat everything after as possibly a consequence. Most compound incidents are one trigger plus one automatic reaction, and the reaction is almost always the more VISIBLE half — which is exactly why it steals the investigation. Here the trigger is a cliff at a deploy and the reaction is a ramp, and only the first has a diff attached to it',
              'TÁCH CHÚNG RA THEO THỜI GIAN chứ không theo nguyên nhân: xác định hình dạng của NĂM PHÚT ĐẦU và coi mọi thứ sau đó có thể là hệ quả. Phần lớn sự cố phức hợp là một cú kích hoạt cộng một phản ứng tự động, và cái phản ứng gần như luôn là nửa DỄ THẤY hơn — và đúng vì thế nó cướp mất cuộc điều tra. Ở đây cú kích hoạt là một cái vách ngay tại một lần deploy còn phản ứng là một cái dốc, và chỉ cái thứ nhất mới có một cái diff gắn kèm',
            ),
            B(
              'Split the panel by version label, because the info-metric from chapter 5 lets you draw the same series once per app version; the step then resolves into two flat lines at different levels and the climb belongs to only one of them',
              'Tách cái khung theo nhãn phiên bản, vì info-metric ở chương 5 cho phép bạn vẽ cùng một chuỗi tách theo từng phiên bản ứng dụng; khi đó cái bậc thang tách ra thành hai đường phẳng ở hai mức khác nhau và đoạn leo chỉ thuộc về một trong hai',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The same compounding happens when a real incident triggers an automatic response: an OOM loop layered on top of a load correlation gives you a sawtooth whose period tracks traffic, which looks like nothing at all. Option D is a genuinely useful technique and it works here because a deploy is involved; it does not generalise to the case where the reaction is an orchestrator loop with no version change behind it.',
            'Đúng kiểu chồng lớp ấy cũng xảy ra khi một sự cố thật kích hoạt một phản ứng tự động: một vòng lặp hết-bộ-nhớ chồng lên một sự tương quan với tải sẽ cho bạn một hình răng cưa mà chu kỳ của nó bám theo lưu lượng, thứ trông chẳng giống hình dạng nào. Lựa chọn D là một kỹ thuật thật sự hữu ích và nó chạy được ở đây vì có một lần deploy dính vào; nó không tổng quát cho trường hợp mà cái phản ứng là một vòng lặp của bộ điều phối, phía sau chẳng có thay đổi phiên bản nào.',
          ),
        }),

        mcq({
          prompt: B(
            'From this repository\'s own incident log: a page was stuck on its loading screen with NO error of any kind, for two sessions. The root cause was that Next.js fixes the list of files in <code>public/</code> at SERVER START, so a rebuild changed the bundle\'s content-hashed name and the running server returned 404 for a file that existed on disk. What is the most transferable lesson?',
            'Từ chính nhật ký sự cố của kho này: một trang kẹt ở màn hình tải, KHÔNG có lỗi nào cả, suốt hai phiên làm việc. Nguyên nhân gốc là Next.js chốt danh sách file trong <code>public/</code> ngay lúc MÁY CHỦ KHỞI ĐỘNG, nên một lần dựng lại làm đổi cái tên có mã băm nội dung của gói JS và máy chủ đang chạy trả 404 cho một file CÓ THẬT trên đĩa. Bài học chuyển giao được nhất là gì?',
          ),
          options: [
            B(
              'Kill by PORT, never by process name: <code>lsof -ti:3000 | xargs -r kill -9</code>. Both <code>pkill -f "next start"</code> and <code>pkill -f "standalone/server.js"</code> MISSED, because Node renames the process to <code>next-server</code> — so the new server died with EADDRINUSE while the old one kept serving, and the bug looked unfixable. A tool that reports success while matching nothing is the same failure as a green check that measures nothing',
              'Hãy diệt theo CỔNG, đừng bao giờ theo tên tiến trình: <code>lsof -ti:3000 | xargs -r kill -9</code>. Cả <code>pkill -f "next start"</code> lẫn <code>pkill -f "standalone/server.js"</code> đều TRƯỢT, vì Node đổi tên tiến trình thành <code>next-server</code> — nên máy chủ mới chết vì EADDRINUSE trong khi máy chủ cũ vẫn phục vụ, và cái bug trông như bất trị. Một công cụ báo thành công trong khi chẳng khớp với cái gì cũng chính là kiểu hỏng của một phép kiểm xanh mà chẳng đo gì',
            ),
            B(
              'Content-hashed filenames must be disabled for anything served from a directory the server enumerates at start-up, because a hash that changes on every build guarantees a mismatch between the manifest in memory and the files on disk',
              'Phải tắt tên file có mã băm nội dung cho mọi thứ phục vụ từ một thư mục mà máy chủ liệt kê lúc khởi động, vì một mã băm đổi ở mọi lần dựng thì bảo đảm sẽ có một chỗ lệch giữa bản kê trong bộ nhớ và các file trên đĩa',
            ),
            B(
              'A loading screen must always have a timeout that renders an error state, because a spinner with no failure path converts every kind of breakage into the same symptom and removes the information a user could have reported',
              'Một màn hình tải bắt buộc phải có một thời gian chờ để dựng ra một trạng thái lỗi, vì một vòng xoay không có đường thất bại sẽ biến mọi kiểu hỏng thành cùng một triệu chứng và xoá mất phần thông tin mà một người dùng lẽ ra đã báo lại được',
            ),
            B(
              'Production was never affected, so the transferable lesson is about the development environment only: the Dockerfile copies the source and then builds, and every deploy is a fresh container, which is why the class of bug cannot occur there and why local-only failures deserve less investigation time',
              'Production chưa bao giờ bị ảnh hưởng, nên bài học chuyển giao được chỉ nói về môi trường phát triển: Dockerfile chép mã nguồn rồi mới dựng, và mỗi lần deploy là một container mới tinh, nên lớp bug này không xảy ra được ở đó, và vì thế các cú hỏng chỉ-có-ở-máy đáng được dành ít thời gian điều tra hơn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Both halves of the incident are worth carrying: restart Next after changing anything in <code>public/</code>, and kill by port. But the second is the one that generalises, and note the shape it shares with the rest of the chapter — the <code>.ktx</code> preload requests still returned 200 because their names had not changed, so the Network tab looked healthy, which is worse than looking broken. Option C describes a real product improvement and would have changed the symptom without changing the diagnosis time.',
            'Cả hai nửa của sự cố đều đáng mang theo: khởi động lại Next sau khi đổi bất cứ thứ gì trong <code>public/</code>, và diệt theo cổng. Nhưng cái thứ hai mới là cái tổng quát được, và để ý nó chung hình dạng với cả phần còn lại của chương — các lượt tải trước file <code>.ktx</code> vẫn trả về 200 vì tên chúng không đổi, nên tab Network nhìn KHOẺ MẠNH, thứ còn tệ hơn là nhìn thấy hỏng. Lựa chọn C mô tả một cải tiến sản phẩm có thật và nó sẽ đổi được TRIỆU CHỨNG mà không đổi được THỜI GIAN CHẨN ĐOÁN.',
          ),
        }),

        mcq({
          prompt: B(
            'An incident write-up records: first 5xx at 14:03 (from metrics), user reported it at 14:07, you looked at 14:12, cause identified at 14:31, mitigated at 14:38. Choose the TWO correct readings of those timestamps. (choose TWO)',
            'Một bản ghi sự cố chép lại: lỗi 5xx đầu tiên lúc 14:03 (lấy từ chỉ số), người dùng báo lúc 14:07, bạn nhìn vào lúc 14:12, xác định nguyên nhân lúc 14:31, giảm thiểu xong lúc 14:38. Chọn HAI cách đọc ĐÚNG các mốc thời gian đó. (chọn HAI)',
          ),
          options: [
            B(
              'The nine minutes from 14:03 to 14:12 measure how long the mitigation took to design, which is the number a runbook improves; a longer runbook shortens it and that is the cheapest change available after any incident',
              'Chín phút từ 14:03 tới 14:12 đo thời gian thiết kế ra phương án giảm thiểu, con số mà một cuốn sổ tay vận hành cải thiện được; sổ tay dài hơn thì rút ngắn nó, và đó là thay đổi rẻ nhất có sau bất kỳ sự cố nào',
            ),
            B(
              'TIME TO DETECT is 14:03 to 14:12, nine minutes — and a USER found it before any alert did, which is an ALERTING gap and a completely different fix from anything about the bug',
              'THỜI GIAN PHÁT HIỆN là 14:03 tới 14:12, chín phút — và một NGƯỜI DÙNG tìm ra nó trước mọi cảnh báo, đó là một lỗ hổng CẢNH BÁO và là một cách sửa hoàn toàn khác với mọi thứ liên quan tới cái bug',
            ),
            B(
              'The gap from 14:07 to 14:12 is the only one worth optimising, because the other two are bounded by human attention rather than by tooling; five minutes from report to acknowledgement is the metric an on-call rotation exists to reduce',
              'Khoảng từ 14:07 tới 14:12 là khoảng duy nhất đáng tối ưu, vì hai khoảng kia bị chặn bởi sự chú ý của con người chứ không phải bởi công cụ; năm phút từ lúc được báo tới lúc xác nhận là chỉ số mà một ca trực tồn tại để giảm',
            ),
            B(
              'TIME TO DIAGNOSE is 14:12 to 14:31, nineteen minutes — an OBSERVABILITY gap, and the question to ask is which single signal would have collapsed it',
              'THỜI GIAN CHẨN ĐOÁN là 14:12 tới 14:31, mười chín phút — một lỗ hổng QUAN TRẮC, và câu hỏi cần đặt ra là TÍN HIỆU DUY NHẤT nào lẽ ra đã làm nó sụp xuống còn vài phút',
            ),
          ],
          correct: [1, 3],
          explanation: EX(
            'Most write-ups record only the cause, which means they improve the code and never the ability to SEE — so over a year you get a codebase with fewer bugs and no better instrumentation, and the next NEW bug takes just as long. And "blameless" is about accuracy rather than politeness: "I forgot to add <code>-f</code> to the docker build command" is true and explains nothing, and it guarantees the only action item is "be more careful", which has never worked for anyone. The version that names a MISSING CHECK can be built.',
            'Phần lớn bản ghi sự cố chỉ chép lại NGUYÊN NHÂN, nghĩa là chúng cải thiện phần MÃ mà không bao giờ cải thiện khả năng NHÌN — nên sau một năm bạn có một kho mã ít bug hơn và không hề đo đạc tốt hơn, và cái bug MỚI tiếp theo vẫn tốn đúng chừng ấy thời gian. Còn "không đổ lỗi" là chuyện CHÍNH XÁC chứ không phải chuyện lịch sự: "tôi quên thêm <code>-f</code> vào lệnh docker build" là đúng và chẳng giải thích gì, và nó bảo đảm rằng hạng mục hành động duy nhất sẽ là "cẩn thận hơn", thứ chưa từng hiệu quả với ai. Bản viết gọi tên một PHÉP KIỂM CÒN THIẾU thì dựng được thành công cụ.',
          ),
        }),
        // ── Chương 12 — tổng kết ─────────────────────────────────────────
        mcq({
          prompt: B(
            'Week one of the recommended plan is: the HTTP middleware plus <code>collectDefaultMetrics</code>, histogram buckets, an external uptime check, and ONE alert. Which two details in that list are the ones most often skipped, and what does skipping each cost?',
            'Tuần đầu tiên của kế hoạch được khuyến nghị gồm: middleware HTTP cộng <code>collectDefaultMetrics</code>, các ô của histogram, một phép kiểm sống-chết từ bên ngoài, và MỘT cảnh báo. Hai chi tiết nào trong danh sách ấy hay bị bỏ qua nhất, và bỏ mỗi cái tốn gì?',
          ),
          options: [
            B(
              'The external check and the alert. Skipping the check leaves you blind to the four network layers below your process, and skipping the alert means the check is a dashboard nobody opens; both are cheap and both are usually postponed to month two',
              'Phép kiểm bên ngoài và cái cảnh báo. Bỏ phép kiểm là để mù trước bốn tầng mạng nằm dưới tiến trình của bạn, còn bỏ cảnh báo nghĩa là phép kiểm ấy chỉ là một bảng theo dõi chẳng ai mở; cả hai đều rẻ và cả hai thường bị đẩy sang tháng thứ hai',
            ),
            B(
              'Choosing the buckets from YOUR data rather than accepting the defaults, and using <code>req.route?.path</code> rather than <code>req.path</code> for the route label. Skipping the first is the measured 69% error on an ordinary bimodal latency distribution — a p95 that reads 46.6 ms when the truth is 27.6 — and it is silent. Skipping the second lets anyone on the internet add permanent series to your Prometheus by requesting URLs that do not exist',
              'Chọn các ô theo dữ liệu CỦA BẠN thay vì nhận bộ mặc định, và dùng <code>req.route?.path</code> chứ không phải <code>req.path</code> cho nhãn route. Bỏ cái thứ nhất là nhận sai số 69% đã đo được trên một phân bố độ trễ hai đỉnh bình thường — một p95 đọc ra 46,6 ms trong khi sự thật là 27,6 — và nó IM LẶNG. Bỏ cái thứ hai là để bất kỳ ai trên internet cũng thêm được chuỗi vĩnh viễn vào Prometheus của bạn chỉ bằng cách gọi tới những URL không tồn tại',
            ),
            B(
              'Binding <code>/metrics</code> to the internal network, and setting a scrape timeout below the scrape interval. Skipping the first publishes an inventory of your system; skipping the second means a slow scrape overlaps the next one and both time out, so every metric goes stale at once',
              'Buộc <code>/metrics</code> vào mạng nội bộ, và đặt thời gian chờ lấy mẫu thấp hơn chu kỳ lấy mẫu. Bỏ cái thứ nhất là công bố một bản kiểm kê hệ thống của bạn; bỏ cái thứ hai nghĩa là một lượt lấy mẫu chậm chồng lên lượt kế tiếp và cả hai cùng hết giờ, nên mọi chỉ số cùng lúc trở nên cũ',
            ),
            B(
              'The two business counters. Skipping them means every metric you have measures the SYSTEM and none measures whether it does its job, which is the failure where a broken login URL leaves every system metric green — several of them the greenest they have ever been',
              'Hai cái counter nghiệp vụ. Bỏ chúng nghĩa là mọi chỉ số bạn có đều đo HỆ THỐNG và không cái nào đo xem nó có làm được việc của nó không, chính là kiểu hỏng mà một URL đăng nhập gãy để lại mọi chỉ số hệ thống đều xanh — vài cái còn xanh nhất từ trước tới nay',
            ),
          ],
          correct: 1,
          explanation: EX(
            'All four options describe real items from the plan, and the two in the answer are the ones that are invisible when skipped. That is the pattern worth carrying out of the chapter: the mistakes that survive are the ones with no error attached. Note the ordering logic of week one as a whole — you can only choose buckets from your data because day one already gave you a request-completion line with <code>ms</code> in it, so one expensive log query, run once, produces the boundaries.',
            'Cả bốn lựa chọn đều mô tả những hạng mục có thật trong kế hoạch, và hai cái trong đáp án là hai cái VÔ HÌNH khi bị bỏ. Đó là khuôn mẫu đáng mang ra khỏi chương này: những sai lầm sống sót là những sai lầm không có lỗi nào gắn kèm. Để ý luôn logic thứ tự của cả tuần đầu — bạn chọn được các ô từ dữ liệu của mình chỉ vì ngày đầu tiên đã cho bạn một dòng log hoàn tất request có <code>ms</code> trong đó, nên một truy vấn log đắt tiền, chạy đúng một lần, là sinh ra được các ranh giới.',
          ),
        }),

        mcq({
          prompt: B(
            'You have a 6 GB VPS already running Postgres, Redis, the backend, the frontend, a TTS container, coturn and nginx. Someone proposes self-hosting the error tracker and the log store on it to avoid vendor bills. What is the objection?',
            'Bạn có một VPS 6 GB đang chạy sẵn Postgres, Redis, backend, frontend, một container TTS, coturn và nginx. Có người đề nghị tự dựng bộ theo dõi lỗi và kho log ngay trên đó để né hoá đơn của nhà cung cấp. Phản đối là gì?',
          ),
          options: [
            B(
              'That the free tiers are large enough to make the comparison moot: with the "5xx only" rule this repository would use a fraction of a typical monthly event allowance, so the cost being avoided is close to zero and the RAM is the only real number in the comparison',
              'Rằng các gói miễn phí đủ lớn tới mức phép so sánh trở nên vô nghĩa: với luật "chỉ 5xx", kho này chỉ dùng một phần nhỏ hạn mức sự kiện hằng tháng thông thường, nên khoản chi phí né được gần bằng 0 và phần RAM là con số thật duy nhất trong phép so sánh',
            ),
            B(
              'That a self-hosted store needs its own database, its own backups and its own migrations, so the operational surface roughly doubles; the RAM is affordable and the maintenance is what actually makes it a bad trade on a one-person project',
              'Rằng một kho tự dựng cần cơ sở dữ liệu riêng, bản sao lưu riêng và các lần migration riêng, nên bề mặt vận hành gần như tăng gấp đôi; phần RAM thì kham được và chính phần bảo trì mới làm cho đây là một cuộc đổi chác tồi với một dự án một người',
            ),
            B(
              'That the ingest path competes with the request path for the event loop, since both run on the same host: a burst of errors during an incident is exactly when the tracker is busiest, so self-hosting couples your error volume to your request latency',
              'Rằng đường nạp dữ liệu tranh vòng lặp sự kiện với đường request, vì cả hai chạy trên cùng một máy: một trận lũ lỗi trong lúc có sự cố đúng là lúc bộ theo dõi bận nhất, nên tự dựng là ghép lượng lỗi của bạn vào độ trễ request của bạn',
            ),
            B(
              'That your MONITORING dies during the incident that fills its disk. About a gigabyte of RAM across two containers, a second Postgres to back up and migrate, and event storage on the SAME disk that already had a disk-full outage — the one a weekly cleanup job exists to prevent. It is exactly when you need the tracker that it is most likely to be down. Self-host when data residency is non-negotiable, when volume makes a hosted plan genuinely expensive, or when it runs on DIFFERENT hardware from the thing it watches',
              'Rằng HỆ GIÁM SÁT của bạn sẽ chết trong đúng cái sự cố làm đầy đĩa của nó. Cỡ một gigabyte RAM cho hai container, một Postgres thứ hai phải sao lưu và migration, và chỗ lưu sự kiện nằm trên CHÍNH cái đĩa đã từng có một cú sập vì hết chỗ — cái đĩa mà một việc dọn dẹp hằng tuần tồn tại để bảo vệ. Đúng vào lúc bạn cần bộ theo dõi ấy nhất thì nó lại nhiều khả năng chết nhất. Chỉ tự dựng khi việc dữ liệu phải nằm trong lãnh thổ là điều không thương lượng được, khi khối lượng làm cho một gói có người vận hành đắt thật, hoặc khi nó chạy trên PHẦN CỨNG KHÁC với thứ nó canh chừng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The rule about not running your monitoring on the machine it monitors is not a preference — it is the one property that decides whether the tool is there when it matters. Options A and B are both true and both secondary; they argue about cost and maintenance, and the failure mode above is about availability at the exact moment of need. The same reasoning is why the external uptime check runs on GitHub\'s infrastructure rather than on the VPS.',
            'Cái luật không chạy hệ giám sát trên chính cái máy nó giám sát không phải một sở thích — nó là thuộc tính DUY NHẤT quyết định công cụ ấy có mặt hay không vào lúc cần. Lựa chọn A và B đều đúng và đều thứ yếu; chúng bàn về chi phí và bảo trì, còn kiểu hỏng ở trên là chuyện CÓ MẶT vào đúng khoảnh khắc cần. Cùng lối suy luận ấy là lý do phép kiểm sống-chết từ bên ngoài chạy trên hạ tầng của GitHub chứ không chạy trên VPS.',
          ),
        }),

        mcq({
          prompt: B(
            'The recommended ordering is: fix four defects in hour one, see one request end to end on day one, metrics and one alert in week one, ship the logs and pick an SLO in month one. What property does that ordering deliberately have?',
            'Thứ tự được khuyến nghị là: sửa bốn khiếm khuyết trong giờ đầu, nhìn được một request từ đầu tới cuối trong ngày đầu, chỉ số và một cảnh báo trong tuần đầu, đẩy log ra ngoài và chọn một SLO trong tháng đầu. Thứ tự ấy có chủ ý mang thuộc tính gì?',
          ),
          options: [
            B(
              'EACH STAGE IS USEFUL ALONE. A project abandoned at week two should leave you better off than not starting, and this ordering guarantees that — whereas an ordering that goes collector, then tracing, then dashboards, and eventually correlation leaves you with infrastructure and no answers',
              'MỖI GIAI ĐOẠN TỰ NÓ ĐÃ CÓ ÍCH. Một dự án bỏ dở ở tuần thứ hai vẫn phải để bạn ở trạng thái tốt hơn là không bắt đầu, và thứ tự này bảo đảm được điều đó — trong khi một thứ tự đi theo lối bộ thu gom, rồi trace, rồi bảng theo dõi, rồi mãi sau mới tới việc nối ngữ cảnh sẽ để lại cho bạn một đống hạ tầng mà không có câu trả lời nào',
            ),
            B(
              'It front-loads the cheapest items so the total cost is spread evenly, which is what makes it possible to schedule against feature work; the ordering is a budgeting device rather than a technical dependency chain',
              'Nó dồn các hạng mục rẻ nhất lên trước để tổng chi phí được trải đều, và chính điều đó cho phép xếp lịch song song với việc làm tính năng; thứ tự này là một công cụ phân bổ ngân sách chứ không phải một chuỗi phụ thuộc kỹ thuật',
            ),
            B(
              'It matches the order in which the chapters were written, so each stage can be completed by re-reading exactly one chapter; the pedagogical alignment is what keeps the plan followable without a second reference document',
              'Nó khớp với thứ tự các chương được viết ra, nên mỗi giai đoạn hoàn thành được chỉ bằng cách đọc lại đúng một chương; sự khớp về mặt sư phạm ấy là thứ giữ cho kế hoạch đi theo được mà không cần một tài liệu tham chiếu thứ hai',
            ),
            B(
              'It defers every decision that requires data until data exists, so no stage can be started before its inputs are available; the ordering is derived mechanically from the dependency graph rather than chosen',
              'Nó hoãn mọi quyết định cần dữ liệu lại cho tới khi dữ liệu tồn tại, nên không giai đoạn nào bắt đầu được trước khi có đầu vào của nó; thứ tự này được suy ra một cách máy móc từ đồ thị phụ thuộc chứ không phải được chọn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Option D is true of one specific step — you cannot choose histogram buckets before you have a day of durations in the logs — and it is not the property being described. The stronger claim is about abandonment, which is the realistic failure mode for observability work: it competes with features and loses, so the ordering has to make a partial result valuable. Note that the four hour-one items are not features at all; they are bugs with names and line numbers.',
            'Lựa chọn D đúng với một bước cụ thể — bạn không chọn được các ô của histogram trước khi có một ngày dữ liệu thời lượng trong log — và nó không phải cái thuộc tính đang được mô tả. Khẳng định mạnh hơn nói về việc BỎ DỞ, kiểu hỏng thực tế của công việc quan trắc: nó cạnh tranh với việc làm tính năng và thua, nên thứ tự phải làm cho một kết quả DỞ DANG vẫn có giá trị. Để ý rằng bốn hạng mục của giờ đầu tiên hoàn toàn không phải tính năng; chúng là những cái bug có tên và có số dòng.',
          ),
        }),

        mcq({
          prompt: B(
            'A team adopts OpenTelemetry before adding request ids to their log lines. What do they end up with?',
            'Một nhóm áp dụng OpenTelemetry trước khi thêm request id vào các dòng log của họ. Cuối cùng họ có được gì?',
          ),
          options: [
            B(
              'A duplicated correlation mechanism, because the SDK generates its own trace id per request and the log lines will eventually carry a second one; the two ids then have to be reconciled, which is more work than adding the log field would have been',
              'Một cơ chế nối ngữ cảnh bị trùng lặp, vì SDK tự sinh trace id riêng cho mỗi request và các dòng log rồi cũng sẽ mang thêm một cái thứ hai; hai cái id sau đó phải được hoà giải với nhau, tốn công hơn là thêm cái trường log ngay từ đầu',
            ),
            B(
              'A working system with a gap only at the queue boundary, because auto-instrumentation covers HTTP and the database but cannot follow a job that outlives its request; that gap is the one thing log ids would have covered and everything else works',
              'Một hệ thống chạy được với đúng một chỗ hổng ở ranh giới hàng đợi, vì đo tự động phủ được HTTP và cơ sở dữ liệu nhưng không theo nổi một việc sống lâu hơn cái request sinh ra nó; chỗ hổng ấy là thứ duy nhất mà id trong log lẽ ra đã phủ, còn mọi thứ khác đều chạy',
            ),
            B(
              'A waterfall with no explanation attached. A trace tells you WHICH span was slow; it cannot tell you what that span was doing, because that is in the logs — and without an id in the log line there is no query that finds them. You need all three pillars and in a specific order: a metric says something is wrong and how often, a trace says WHERE, a log says WHY',
              'Một biểu đồ thác không kèm lời giải thích nào. Một trace nói cho bạn span NÀO chậm; nó không nói được span ấy đang LÀM GÌ, vì điều đó nằm trong log — và không có id trong dòng log thì chẳng có truy vấn nào tìm ra chúng. Bạn cần cả ba trụ cột và theo một thứ tự cụ thể: một chỉ số nói rằng có gì đó sai và sai bao lâu một lần, một trace nói SAI Ở ĐÂU, một dòng log nói VÌ SAO',
            ),
            B(
              'A more expensive but otherwise equivalent system, since a trace already carries the timing and the attributes that a structured log line would have carried; the log ids are a convenience for people who prefer text, and the real cost of skipping them is only ergonomic',
              'Một hệ thống đắt hơn nhưng ngoài ra thì tương đương, vì một trace vốn đã mang theo phần thời gian và các thuộc tính mà một dòng log có cấu trúc lẽ ra mang; các id trong log là một tiện lợi cho những người thích đọc chữ, và cái giá thật của việc bỏ chúng chỉ là về mặt tiện dụng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is why "tracing before correlation" is on the do-not-build list, and it is the same failure the cross-tool link ordering warns about: build the ids first, because every other jump becomes possible afterwards even by copy-paste, and nothing else works without them. Option B is wrong on a detail worth knowing — the queue boundary is handled in tracing by a span LINK rather than a parent, because the work is caused-by but not contained-in the request.',
            'Đây là lý do "trace trước khi nối ngữ cảnh" nằm trong danh sách ĐỪNG DỰNG, và nó cũng chính là kiểu hỏng mà phần thứ tự nối các công cụ đã cảnh báo: hãy dựng các id trước, vì sau đó mọi bước nhảy khác đều khả thi kể cả bằng chép-dán, và không có chúng thì chẳng thứ nào chạy. Lựa chọn B sai ở một chi tiết đáng biết — ranh giới hàng đợi trong tracing được xử lý bằng một span LINK chứ không phải một quan hệ cha-con, vì phần việc ấy được GÂY RA BỞI request chứ không NẰM TRONG request.',
          ),
        }),

        mcq({
          prompt: B(
            'The four hour-one fixes take under two hours together. A colleague frames the work as "quality versus speed" and schedules it after the current feature. What is the accurate framing, and why does the quality framing fail in a specific way?',
            'Bốn khiếm khuyết cần sửa trong giờ đầu cộng lại tốn chưa tới hai tiếng. Một đồng nghiệp đóng khung việc đó thành "chất lượng đối lại tốc độ" rồi xếp nó sau tính năng đang làm. Cách đóng khung CHÍNH XÁC là gì, và vì sao cách đóng khung theo chất lượng lại hỏng theo một kiểu rất cụ thể?',
          ),
          options: [
            B(
              'The accurate framing is that these are BUGS with names and line numbers, each removing a specific failure that has already happened to this repository or is one Postgres hiccup away — and the measured difference on one incident was six steps and about twenty-five minutes against one query and about forty seconds. The quality framing fails specifically: it invites the work to lose to the next feature permanently, and then it only gets prioritised AFTER an incident, when it is done under pressure, badly, and only for the thing that just broke',
              'Cách đóng khung chính xác là: đây là những cái BUG có tên và có số dòng, mỗi cái gỡ bỏ một cú hỏng cụ thể đã từng xảy ra với kho này hoặc chỉ cách một cú nấc của Postgres — và chênh lệch đo được trên MỘT sự cố là sáu bước và cỡ hai mươi lăm phút so với một truy vấn và cỡ bốn mươi giây. Cách đóng khung theo chất lượng hỏng rất cụ thể: nó mời gọi phần việc ấy thua tính năng kế tiếp một cách VĨNH VIỄN, rồi nó chỉ được ưu tiên SAU một sự cố, lúc bị làm dưới áp lực, làm ẩu, và chỉ làm cho đúng cái vừa hỏng',
            ),
            B(
              'The accurate framing is risk transfer: two hours now buys down the probability of a long outage later, so the decision is an expected-value calculation and should be made with the same arithmetic as any insurance purchase rather than as a values statement',
              'Cách đóng khung chính xác là chuyển giao rủi ro: hai tiếng bây giờ mua rẻ đi xác suất một cú sập dài về sau, nên quyết định này là một phép tính kỳ vọng và nên được ra bằng đúng thứ số học của một hợp đồng bảo hiểm chứ không phải bằng một tuyên bố về giá trị',
            ),
            B(
              'The accurate framing is that the four fixes are prerequisites for the rest of the plan, so scheduling them later does not defer two hours, it defers every stage that depends on them; the quality framing fails because it treats a dependency as a preference',
              'Cách đóng khung chính xác là bốn cái sửa ấy là điều kiện tiên quyết cho phần còn lại của kế hoạch, nên xếp chúng ra sau không phải hoãn hai tiếng mà là hoãn MỌI giai đoạn phụ thuộc vào chúng; cách đóng khung theo chất lượng hỏng vì nó coi một quan hệ phụ thuộc như một sở thích',
            ),
            B(
              'The accurate framing is that three of the four are one-line changes and the fourth is twelve lines, so the comparison is not with the current feature at all but with a coffee break; the quality framing fails because it implies a trade-off where the cost is too small to trade',
              'Cách đóng khung chính xác là ba trong bốn cái chỉ là thay đổi một dòng còn cái thứ tư là mười hai dòng, nên phép so sánh không phải với tính năng đang làm mà là với một lần nghỉ uống cà phê; cách đóng khung theo chất lượng hỏng vì nó ngụ ý một cuộc đánh đổi trong khi chi phí quá nhỏ để đem ra đổi',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Two hours of work pays back on the third incident, and there will be a third incident. The four items are worth naming again because none of them is speculative: point the compose healthcheck at <code>/health/live</code> so a twenty-second Postgres stall stops restarting healthy containers; forward and log nginx\'s <code>$request_id</code>; read the request context inside <code>emit()</code> so all 370 existing logger calls gain an id without being touched; and set <code>max-size</code> and <code>max-file</code> on all seven services, on the disk that holds Postgres.',
            'Hai tiếng làm việc hoàn vốn ở sự cố thứ ba, và sẽ có một sự cố thứ ba. Bốn hạng mục ấy đáng gọi tên lại vì không cái nào là suy đoán: trỏ healthcheck trong compose vào <code>/health/live</code> để một cú đứng hai mươi giây của Postgres thôi khởi động lại những container khoẻ mạnh; chuyển tiếp và ghi log <code>$request_id</code> của nginx; đọc ngữ cảnh request ngay bên trong <code>emit()</code> để cả 370 lời gọi logger đang có đều có id mà không phải sửa cái nào; và đặt <code>max-size</code> cùng <code>max-file</code> cho cả bảy dịch vụ, trên chính cái đĩa đang chứa Postgres.',
          ),
        }),

        mcq({
          prompt: B(
            'Month one is the log pipeline. Which pair of configuration decisions is right, and what does each one prevent?',
            'Tháng đầu tiên là đường ống log. Cặp quyết định cấu hình nào là ĐÚNG, và mỗi cái ngăn được điều gì?',
          ),
          options: [
            B(
              'Filter to the backend container at ingest and promote <code>msg</code> to a label. The first keeps the ingest bill proportional to the service you care about; the second makes the most common query — find every occurrence of one event — an index lookup rather than a scan',
              'Lọc về riêng container backend ngay lúc nạp và nâng <code>msg</code> lên thành một nhãn. Cái thứ nhất giữ hoá đơn nạp dữ liệu tỉ lệ với đúng cái dịch vụ bạn quan tâm; cái thứ hai biến truy vấn thường gặp nhất — tìm mọi lần xảy ra của một sự kiện — thành một phép tra chỉ mục thay vì một phép quét',
            ),
            B(
              'Ship EVERY container and filter at QUERY time, and do NOT promote <code>msg</code> to a label. The first prevents the blind spot where nginx returns 502, the backend log is clean because the backend never received the request, and the only evidence lives in the container the shipper was told to ignore. The second prevents 325 distinct message values turning 28 streams into 9,100 — a 325× increase that lands within 10% of the default active-stream limit before a single new log statement is written',
              'Đẩy MỌI container ra ngoài và lọc lúc TRUY VẤN, và ĐỪNG nâng <code>msg</code> lên thành nhãn. Cái thứ nhất ngăn được điểm mù mà nginx trả 502, log backend thì sạch bong vì backend chưa từng nhận được request ấy, và bằng chứng duy nhất nằm trong đúng cái container mà trình thu gom được bảo là hãy bỏ qua. Cái thứ hai ngăn 325 giá trị thông điệp riêng biệt biến 28 luồng thành 9.100 — tăng 325 lần và chạm tới trong vòng 10% của trần luồng-đang-hoạt-động mặc định trước khi có thêm một câu lệnh log mới nào',
            ),
            B(
              'Ship every container but promote <code>level</code> and <code>msg</code> together, because the pair is what makes an error-rate graph possible without parsing; the cardinality cost is bounded by the number of distinct messages that ever appear at error level, which is small',
              'Đẩy mọi container ra ngoài nhưng nâng CẢ <code>level</code> lẫn <code>msg</code> lên thành nhãn, vì chính cặp đó làm cho một đồ thị tỉ lệ lỗi khả thi mà không cần phân giải; chi phí lực lượng bị chặn bởi số thông điệp riêng biệt từng xuất hiện ở mức error, và con số đó thì nhỏ',
            ),
            B(
              'Filter at ingest and tighten rotation at the same time, because the two changes are what let the local disk and the retention window stop fighting; promoting labels is a separate question that only matters once you exceed the free tier of the store',
              'Lọc lúc nạp và siết xoay vòng cùng lúc, vì hai thay đổi đó là thứ làm cho đĩa cục bộ và cửa sổ giữ log thôi đánh nhau; chuyện nâng nhãn là một câu hỏi riêng và chỉ đáng bận tâm khi bạn vượt quá gói miễn phí của cái kho',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A filtered pipeline is invisible by construction: it looks perfectly healthy, because everything it does collect arrives fine. That is what makes ingest-time filtering the more dangerous of the two mistakes — a wrong filter at QUERY time costs you one re-run, and a wrong filter at ingest costs you the evidence itself. Note also the ordering inside month one: tighten <code>max-size</code> to something small only AFTER shipping exists, because until then <code>docker logs</code> IS your history.',
            'Một đường ống có lọc thì vô hình theo cấu tạo: nó nhìn hoàn toàn khoẻ mạnh, vì mọi thứ nó CÓ thu thì đều tới nơi ổn thoả. Chính điều đó làm cho việc lọc ngay lúc NẠP là cái nguy hiểm hơn trong hai sai lầm — một bộ lọc sai lúc TRUY VẤN tốn của bạn một lần chạy lại, còn một bộ lọc sai lúc nạp tốn của bạn chính cái bằng chứng. Cũng để ý thứ tự bên trong tháng đầu: chỉ siết <code>max-size</code> xuống nhỏ SAU KHI đã có trình thu gom, vì trước đó thì <code>docker logs</code> CHÍNH LÀ lịch sử của bạn.',
          ),
        }),

        mcq({
          prompt: B(
            'You are a one-person project. Your realistic response time to a night-time page is "next morning". Which SLO can you honestly hold, and what does the response time do to the choice?',
            'Bạn là một dự án một người. Thời gian phản hồi thực tế của bạn với một cú gọi ban đêm là "sáng hôm sau". SLO nào bạn giữ được một cách trung thực, và thời gian phản hồi ấy tác động thế nào tới lựa chọn?',
          ),
          options: [
            B(
              '99.9%, because the SLO measures the SERVICE rather than the responder: an outage that self-heals in four minutes spends four minutes of budget whether you were awake or not, and most night-time failures are transient by nature, and a self-healing outage is by far the most common kind on a service of this size',
              '99,9%, vì SLO đo DỊCH VỤ chứ không đo người trực: một cú sập tự khỏi trong bốn phút thì tiêu bốn phút ngân sách bất kể bạn có thức hay không, và phần lớn các cú hỏng ban đêm vốn dĩ là thoáng qua, và một cú sập tự khỏi là kiểu phổ biến nhất trên một dịch vụ cỡ này',
            ),
            B(
              '99.99%, provided the three page-level alerts are wired to something that rings, because the arithmetic that matters is the DETECTION time rather than the repair time; a four-minute budget is achievable as long as nothing goes unnoticed, so the budget is spent by the repair rather than by the wait, which is a different constraint entirely',
              '99,99%, miễn là ba cảnh báo mức gọi được nối vào một thứ biết reo, vì phần số học đáng kể là thời gian PHÁT HIỆN chứ không phải thời gian sửa; một ngân sách bốn phút vẫn đạt được miễn là không có gì bị bỏ sót, nên ngân sách bị tiêu bởi việc SỬA chứ không phải bởi việc CHỜ, một ràng buộc hoàn toàn khác',
            ),
            B(
              '99.5% — 3.6 hours a month — is defensible for a one-VPS manual-deploy project, and 99.9% is ambitious. And the response time settles it arithmetically: 99.9% is 43 minutes a month, which an eight-hour response time cannot meet. Either route the three page-level alerts to something that rings against Do Not Disturb, or state the response time plainly and set the SLO to match. Routing them to Slack and calling it paging produces the specific belief that the review records "we were alerted at 02:14" when a message was WRITTEN at 02:14 and READ at 09:30',
              '99,5% — 3,6 giờ mỗi tháng — là bảo vệ được với một dự án một-VPS deploy-bằng-tay, còn 99,9% là tham vọng. Và thời gian phản hồi giải quyết chuyện này bằng số học: 99,9% là 43 phút mỗi tháng, thứ mà một thời gian phản hồi tám tiếng không thể đáp ứng. Hoặc là nối ba cảnh báo mức gọi vào một thứ reo được xuyên qua chế độ Không Làm Phiền, hoặc là nói thẳng thời gian phản hồi ra và đặt SLO cho khớp. Định tuyến chúng vào Slack rồi gọi đó là "gọi trực" sẽ sinh ra đúng cái niềm tin mà bản rà soát chép lại thành "chúng ta được báo lúc 02:14", trong khi thật ra một tin nhắn được VIẾT lúc 02:14 và được ĐỌC lúc 09:30',
            ),
            B(
              '99%, 7.2 hours a month, because that is the only tier whose budget survives a single overnight outage; anything tighter is decoration on a project with no rotation, and the response time is the only input that should decide the number, and every tighter tier then has to be justified by an actual user requirement rather than by ambition',
              '99%, 7,2 giờ mỗi tháng, vì đó là bậc duy nhất mà ngân sách của nó sống sót qua MỘT cú sập qua đêm; chặt hơn thế là đồ trang trí với một dự án không có ca trực, và thời gian phản hồi là đầu vào DUY NHẤT nên quyết định con số ấy, và mọi bậc chặt hơn sau đó phải được biện minh bằng một yêu cầu thật của người dùng chứ không phải bằng tham vọng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The gap between "notified" and "noticed" is invisible in every tool, and it is the entire difference between having paging and thinking you do. Being honest about it is not defeatism — it is what makes the SLO a number you can hold, and an SLO you routinely miss tells you nothing when you miss it. Note also what "on-call" can honestly mean for a team of one: you are not on-call, you are REACHABLE sometimes, and everything that is not one of the three pages becomes a morning queue — a single daily digest saying what fired overnight and what recovered on its own.',
            'Khoảng cách giữa "được báo" và "nhận ra" thì vô hình trong mọi công cụ, và nó chính là toàn bộ khác biệt giữa việc CÓ hệ thống gọi trực và việc TƯỞNG rằng mình có. Trung thực về chuyện đó không phải là bi quan — nó là thứ làm cho cái SLO trở thành một con số bạn giữ được, còn một SLO bạn trượt đều đều thì lúc trượt nó chẳng nói được gì. Cũng để ý "trực" có thể mang nghĩa trung thực nào với một nhóm một người: bạn không trực, bạn chỉ LIÊN LẠC ĐƯỢC đôi lúc, và mọi thứ không nằm trong ba cú gọi ấy đều trở thành một hàng đợi buổi sáng — một bản tóm tắt mỗi ngày nói cái gì đã kêu trong đêm và cái gì đã tự khỏi.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Error budget, burn rate, and a claim from the lesson you should check (chapter 9).</b> <code>PHUT</code> is a 120-minute timeline of <code>{ total, errors }</code>: a 0.1% baseline for thirty minutes, a 3% incident from minute 30 to 59, and clean traffic from minute 60. The SLO is 99.9%. Implement four functions.</p>' +
            '<ul>' +
            '<li><code>nganSach(slo, ngay)</code> — the budget as a fraction of requests and as MINUTES over the window, rounded to one decimal.</li>' +
            '<li><code>tyLeLoi(rows, tu, den)</code> — the error ratio over an inclusive minute range, clamped at the start of the array.</li>' +
            '<li><code>heSoDot(rows, m, cuaSoPhut, slo)</code> — the burn rate over the trailing window ending at minute <code>m</code>: the error ratio divided by the budget fraction. A burn rate of 1 spends the budget exactly evenly over the window; 1000 spends it in 43 minutes.</li>' +
            '<li><code>danhGia(rows, slo, nguong)</code> — at every minute, evaluate the 60-minute burn rate and the 5-minute burn rate, and report both the LONG-WINDOW-ONLY rule and the rule that requires BOTH. Return the first and last minute each rule holds.</li>' +
            '</ul>' +
            '<p><b>Read the two ranges against each other before you accept what lesson 9.3 says about them.</b> The lesson claims the short window is what prevents a late alert. An <code>AND</code> of two conditions cannot become true before the later of them does — so compute it, and let the two ranges tell you what the short window actually buys.</p>' +
            '<p>Keep the given data and the printing block exactly as they are.</p>',

            '<p><b>Câu 31 — Ngân sách lỗi, hệ số đốt, và một khẳng định của bài học mà bạn nên kiểm lại (chương 9).</b> <code>PHUT</code> là một dòng thời gian 120 phút gồm <code>{ total, errors }</code>: nền 0,1% trong ba mươi phút, một sự cố 3% từ phút 30 tới 59, và lưu lượng sạch từ phút 60. SLO là 99,9%. Hãy cài đặt bốn hàm.</p>' +
            '<ul>' +
            '<li><code>nganSach(slo, ngay)</code> — ngân sách dưới dạng một phân số của số request và dưới dạng SỐ PHÚT trên cả cửa sổ, làm tròn một chữ số thập phân.</li>' +
            '<li><code>tyLeLoi(rows, tu, den)</code> — tỉ lệ lỗi trên một khoảng phút bao gồm hai đầu, kẹp lại ở đầu mảng.</li>' +
            '<li><code>heSoDot(rows, m, cuaSoPhut, slo)</code> — hệ số đốt trên cửa sổ lùi kết thúc ở phút <code>m</code>: tỉ lệ lỗi chia cho phân số ngân sách. Hệ số đốt bằng 1 nghĩa là tiêu ngân sách đều tăm tắp trên cả cửa sổ; bằng 1000 là tiêu hết trong 43 phút.</li>' +
            '<li><code>danhGia(rows, slo, nguong)</code> — ở mỗi phút, tính hệ số đốt cửa sổ 60 phút và cửa sổ 5 phút, rồi báo cả luật CHỈ-DÙNG-CỬA-SỔ-DÀI lẫn luật đòi CẢ HAI. Trả về phút đầu tiên và phút cuối cùng mà mỗi luật còn đúng.</li>' +
            '</ul>' +
            '<p><b>Hãy đọc hai khoảng đó đối chiếu nhau TRƯỚC khi chấp nhận điều bài 9.3 nói về chúng.</b> Bài học khẳng định rằng cửa sổ ngắn là thứ ngăn cảnh báo tới muộn. Một phép <code>VÀ</code> của hai điều kiện thì không thể đúng trước khi cái đúng-muộn-hơn đúng — nên hãy TÍNH nó ra, và để hai cái khoảng tự nói cho bạn biết cửa sổ ngắn thật sự mua được gì.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const SLO = 0.999;                 // 99,9% trong cửa sổ 30 ngày\n' +
            'const PHUT = [];                   // 120 phút: {total, errors}\n' +
            'for (let m = 0; m < 120; m++) {\n' +
            '  if (m < 30)      PHUT.push({ m, total: 6000, errors: 6 });     // nền 0,1%\n' +
            '  else if (m < 60) PHUT.push({ m, total: 6000, errors: 180 });   // sự cố 3%\n' +
            '  else             PHUT.push({ m, total: 6000, errors: 0 });     // đã sửa\n' +
            '}\n' +
            'const NGUONG = 14.4;\n' +
            '\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            '\n' +
            '  // TODO\n' +
            '\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const ns = nganSach(SLO);\n' +
            'console.log(\'ngan sach: \' + (ns.phanSo * 100).toFixed(1) + \'% request = \' + ns.phut + \' phut / 30 ngay\');\n' +
            'const d = danhGia(PHUT, SLO, NGUONG);\n' +
            'console.log(\'phut | he so dot 60p | he so dot 5p | chi-60p | ca-hai\');\n' +
            'for (const m of [0, 29, 30, 34, 40, 50, 54, 55, 59, 60, 61, 64, 65, 90, 119]) {\n' +
            '  const x = d.kq[m];\n' +
            '  console.log(String(x.m).padStart(4) + \' | \' + x.dai.toFixed(2).padStart(13) + \' | \' + x.ngan.toFixed(2).padStart(12) +\n' +
            '    \' | \' + (x.chiDai ? \'BAN  \' : \'.    \').padStart(7) + \' | \' + (x.ca ? \'BAN\' : \'.\'));\n' +
            '}\n' +
            'console.log(\'chi 60p : ban tu phut \' + d.batDauChiDai + \' den phut \' + d.ketThucChiDai);\n' +
            'console.log(\'ca hai  : ban tu phut \' + d.batDauCa + \' den phut \' + d.ketThucCa);\n' +
            'console.log(\'ngan sach da tieu trong 120 phut nay = \' + daTieu(PHUT, SLO) + \' phut\');\n',
          expectedOutput:
            'ngan sach: 0.1% request = 43.2 phut / 30 ngay\n' +
            'phut | he so dot 60p | he so dot 5p | chi-60p | ca-hai\n' +
            '   0 |          1.00 |         1.00 |   .     | .\n' +
            '  29 |          1.00 |         1.00 |   .     | .\n' +
            '  30 |          1.94 |         6.80 |   .     | .\n' +
            '  34 |          5.14 |        30.00 |   .     | .\n' +
            '  40 |          8.78 |        30.00 |   .     | .\n' +
            '  50 |         12.94 |        30.00 |   .     | .\n' +
            '  54 |         14.18 |        30.00 |   .     | .\n' +
            '  55 |         14.46 |        30.00 |   BAN   | BAN\n' +
            '  59 |         15.50 |        30.00 |   BAN   | BAN\n' +
            '  60 |         15.48 |        24.00 |   BAN   | BAN\n' +
            '  61 |         15.47 |        18.00 |   BAN   | BAN\n' +
            '  64 |         15.42 |         0.00 |   BAN   | .\n' +
            '  65 |         15.40 |         0.00 |   BAN   | .\n' +
            '  90 |         14.50 |         0.00 |   BAN   | .\n' +
            ' 119 |          0.00 |         0.00 |   .     | .\n' +
            'chi 60p : ban tu phut 55 den phut 90\n' +
            'ca hai  : ban tu phut 55 den phut 61\n' +
            'ngan sach da tieu trong 120 phut nay = 0.93 phut\n',
          sampleSolution:
            'function nganSach(slo, ngay = 30) {\n' +
            '  const phanTram = 1 - slo;\n' +
            '  return { phanSo: phanTram, phut: Math.round(ngay * 24 * 60 * phanTram * 10) / 10 };\n' +
            '}\n' +
            '\n' +
            'function tyLeLoi(rows, tu, den) {\n' +
            '  let t = 0, e = 0;\n' +
            '  for (let i = Math.max(0, tu); i <= den && i < rows.length; i++) { t += rows[i].total; e += rows[i].errors; }\n' +
            '  return t === 0 ? 0 : e / t;\n' +
            '}\n' +
            '\n' +
            'function heSoDot(rows, m, cuaSoPhut, slo) {\n' +
            '  return tyLeLoi(rows, m - cuaSoPhut + 1, m) / (1 - slo);\n' +
            '}\n' +
            '\n' +
            'function danhGia(rows, slo, nguong) {\n' +
            '  const kq = [];\n' +
            '  for (const r of rows) {\n' +
            '    const dai = heSoDot(rows, r.m, 60, slo);\n' +
            '    const ngan = heSoDot(rows, r.m, 5, slo);\n' +
            '    kq.push({ m: r.m, dai, ngan, chiDai: dai >= nguong, ca: dai >= nguong && ngan >= nguong });\n' +
            '  }\n' +
            '  const dau = (f) => { const x = kq.find(f); return x ? x.m : null; };\n' +
            '  const cuoi = (f) => { const xs = kq.filter(f); return xs.length ? xs[xs.length - 1].m : null; };\n' +
            '  return {\n' +
            '    kq,\n' +
            '    batDauChiDai: dau((x) => x.chiDai),\n' +
            '    ketThucChiDai: cuoi((x) => x.chiDai),\n' +
            '    batDauCa: dau((x) => x.ca),\n' +
            '    ketThucCa: cuoi((x) => x.ca),\n' +
            '  };\n' +
            '}\n' +
            '\n' +
            'function daTieu(rows, slo) {\n' +
            '  const loi = rows.reduce((s, r) => s + r.errors, 0);\n' +
            '  const tong = rows.reduce((s, r) => s + r.total, 0);\n' +
            '  const phutDaTieu = (loi / tong) / (1 - slo) * (rows.length / (30 * 24 * 60)) * nganSach(slo).phut;\n' +
            '  return Math.round(phutDaTieu * 100) / 100;\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Make the zoom lie, then measure how big the lie is (chapters 10 and 4).</b> <code>PHUT</code> holds 60 minutes of latency observations as PER-BUCKET counts — how many observations fell INTO each bucket, not cumulative — against the boundaries in <code>LE</code>. Four of those minutes are an incident. Implement four functions.</p>' +
            '<ul>' +
            '<li><code>congDon(dem)</code> — turn per-bucket counts into the CUMULATIVE form Prometheus exposes.</li>' +
            '<li><code>phanVi(cum, q)</code> — the quantile, exactly as Prometheus computes it: linear interpolation inside the bucket that holds the target rank, the lower edge of the FIRST bucket is 0, a rank that falls in <code>+Inf</code> returns the largest finite boundary, and no observations means <code>NaN</code>.</li>' +
            '<li><code>theoTungPhut(rows, q)</code> — one quantile per minute, which is what a one-hour zoom draws.</li>' +
            '<li><code>gopRoiTinh(rows, q)</code> — sum the buckets across ALL the minutes FIRST, then compute the quantile ONCE. This is the correct order, and it is the whole fix.</li>' +
            '</ul>' +
            '<p>The printing block compares the mean of the per-minute quantiles — the naive combination a wide zoom performs — against the aggregate-then-quantile answer, and prints the ratio. That ratio is how much a bad hour SHRINKS when you widen the time range, which is why an incident can look calm on a seven-day view of the week it happened in.</p>' +
            '<p>Keep the given data and the printing block exactly as they are.</p>',

            '<p><b>Câu 32 — Bắt cái đồ thị nói dối khi thu nhỏ, rồi ĐO xem lời nói dối to cỡ nào (chương 10 và 4).</b> <code>PHUT</code> chứa 60 phút quan sát độ trễ dưới dạng số đếm THEO TỪNG Ô — bao nhiêu quan sát rơi VÀO mỗi ô, KHÔNG cộng dồn — ứng với các ranh giới trong <code>LE</code>. Bốn phút trong số đó là một sự cố. Hãy cài đặt bốn hàm.</p>' +
            '<ul>' +
            '<li><code>congDon(dem)</code> — biến số đếm theo từng ô thành dạng CỘNG DỒN mà Prometheus phơi ra.</li>' +
            '<li><code>phanVi(cum, q)</code> — phân vị, đúng theo cách Prometheus tính: nội suy tuyến tính bên trong cái ô chứa thứ hạng cần tìm, mép dưới của ô ĐẦU TIÊN là 0, một thứ hạng rơi vào <code>+Inf</code> thì trả về ranh giới hữu hạn lớn nhất, và không có quan sát nào thì trả <code>NaN</code>.</li>' +
            '<li><code>theoTungPhut(rows, q)</code> — một phân vị cho mỗi phút, đúng thứ mà một khung nhìn một giờ vẽ ra.</li>' +
            '<li><code>gopRoiTinh(rows, q)</code> — CỘNG các ô trên TẤT CẢ các phút TRƯỚC, rồi tính phân vị ĐÚNG MỘT LẦN. Đây mới là thứ tự đúng, và nó chính là toàn bộ cách sửa.</li>' +
            '</ul>' +
            '<p>Khối in kết quả so trung bình của các phân vị theo từng phút — phép gộp ngây thơ mà một khung nhìn rộng thực hiện — với đáp số gộp-ô-rồi-mới-tính, rồi in ra tỉ số. Tỉ số đó chính là mức mà một giờ tồi bị CO LẠI khi bạn nới khoảng thời gian ra, và đó là lý do một sự cố có thể trông êm ả trên khung nhìn bảy ngày của đúng cái tuần nó xảy ra.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const LE = [0.01, 0.025, 0.05, 0.1, 0.5, 1, 2.5, 5, Infinity];\n' +
            '// Mỗi phút: số quan sát RƠI VÀO từng ô (KHÔNG cộng dồn), theo đúng thứ tự LE.\n' +
            'const PHUT = [];\n' +
            'for (let m = 0; m < 60; m++) {\n' +
            '  if (m >= 20 && m <= 23) PHUT.push({ m, dem: [0, 3000, 0, 0, 0, 0, 0, 3000, 0] });\n' +
            '  else                    PHUT.push({ m, dem: [0, 5940, 0,  60, 0, 0, 0,    0, 0] });\n' +
            '}\n' +
            '\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            '\n' +
            '  // TODO\n' +
            '\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const ms = (v) => (Number.isNaN(v) ? \'NaN\' : (v * 1000).toFixed(1) + \'ms\');\n' +
            'const tung = theoTungPhut(PHUT, 0.99);\n' +
            'const tbNaive = tung.reduce((a, b) => a + b, 0) / tung.length;\n' +
            'console.log(\'p99 phut 0  (binh thuong) = \' + ms(tung[0]));\n' +
            'console.log(\'p99 phut 20 (su co)       = \' + ms(tung[20]));\n' +
            'console.log(\'cao nhat trong 60 phut    = \' + ms(Math.max(...tung)));\n' +
            'console.log(\'TRUNG BINH cac p99 (zoom 7 ngay, SAI)   = \' + ms(tbNaive));\n' +
            'console.log(\'GOP O ROI TINH (dung)                   = \' + ms(gopRoiTinh(PHUT, 0.99)));\n' +
            'console.log(\'he so co lai = \' + (gopRoiTinh(PHUT, 0.99) / tbNaive).toFixed(2) + \'x\');\n' +
            'console.log(\'p50 gop = \' + ms(gopRoiTinh(PHUT, 0.5)) + \'  p90 gop = \' + ms(gopRoiTinh(PHUT, 0.9)));\n',
          expectedOutput:
            'p99 phut 0  (binh thuong) = 25.0ms\n' +
            'p99 phut 20 (su co)       = 4950.0ms\n' +
            'cao nhat trong 60 phut    = 4950.0ms\n' +
            'TRUNG BINH cac p99 (zoom 7 ngay, SAI)   = 353.3ms\n' +
            'GOP O ROI TINH (dung)                   = 4250.0ms\n' +
            'he so co lai = 12.03x\n' +
            'p50 gop = 17.8ms  p90 gop = 24.1ms\n',
          sampleSolution:
            'function congDon(dem) {\n' +
            '  const out = []; let s = 0;\n' +
            '  for (let i = 0; i < dem.length; i++) { s += dem[i]; out.push(s); }\n' +
            '  return out;\n' +
            '}\n' +
            '\n' +
            'function phanVi(cum, q) {\n' +
            '  const tong = cum[cum.length - 1];\n' +
            '  if (!(tong > 0)) return NaN;\n' +
            '  const rank = q * tong;\n' +
            '  let i = 0;\n' +
            '  while (i < cum.length && cum[i] < rank) i++;\n' +
            '  if (i === cum.length - 1) return LE[LE.length - 2];      // rơi vào +Inf\n' +
            '  const tren = LE[i];\n' +
            '  const duoi = i === 0 ? 0 : LE[i - 1];\n' +
            '  const truoc = i === 0 ? 0 : cum[i - 1];\n' +
            '  const trong = cum[i] - truoc;\n' +
            '  if (trong <= 0) return NaN;\n' +
            '  return duoi + (tren - duoi) * ((rank - truoc) / trong);\n' +
            '}\n' +
            '\n' +
            'function theoTungPhut(rows, q) {\n' +
            '  return rows.map((r) => phanVi(congDon(r.dem), q));\n' +
            '}\n' +
            '\n' +
            'function gopRoiTinh(rows, q) {\n' +
            '  const tong = new Array(LE.length).fill(0);\n' +
            '  for (const r of rows) for (let i = 0; i < LE.length; i++) tong[i] += r.dem[i];\n' +
            '  return phanVi(congDon(tong), q);\n' +
            '}\n',
        }),
      ],
    },
  ],
};
