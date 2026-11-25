/**
 * 15.7 — Kiểm tra Chương 15 (soạn 24/11/2026, agent lgz). 10 câu; đáp số dựa trên output thật OUT['s15/*'].
 * Phân bố đáp án: A ×2 (4, 9) · B ×3 (1, 6, 10) · C ×3 (2, 5, 8) · D ×2 (3, 7).
 */
export default {
  title: '15.7 — Chapter 15 quiz|||15.7 — Kiểm tra Chương 15',
  slug: 'log-15-7-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu: log đã gửi đi sống sót khi máy bị xoá journal, agent đệm khi kho sập, nhãn ít nội dung nhiều, quên "by" sau | json, auth.log lệch 7 giờ trong Kibana, KQL ra 0 vì sai tên trường hoặc dấu cách, use_incoming_timestamp, noDataState mặc định, cảnh báo im lặng cần nguồn luôn có log, giới hạn connector của Kibana Basic.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Quiz</span>
<h2>Centralised logging and alerting</h2>
<p class="lead">Ten questions built on the real output of this chapter. For each one, ask: is this about where logs travel, how they are stored and labelled, how you query them, or when they should wake someone?</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain why a central copy survives <code>journalctl --vacuum-time=1s</code>.</li>
<li>I know where Alloy keeps unsent lines and what happens on restart.</li>
<li>I keep Loki labels bounded and aggregate <code>by</code> after <code>| json</code>.</li>
<li>I compare one raw line with what Kibana/Grafana shows before trusting a timeline.</li>
<li>I check field values before writing a rule.</li>
<li>I can write the three Lab 15 alerts and say which noData setting each needs.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Kiểm tra</span>
<h2>Gom log tập trung và cảnh báo</h2>
<p class="lead">Mười câu dựa trên output thật của chương. Với mỗi câu, tự hỏi: nó nói về đường đi của log, cách lưu và gắn nhãn, cách truy vấn, hay lúc nào log phải đánh thức ai đó?</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được vì sao bản ở trung tâm sống sót sau <code>journalctl --vacuum-time=1s</code>.</li>
<li>Tôi biết Alloy giữ các dòng chưa gửi ở đâu và chuyện gì xảy ra khi khởi động lại.</li>
<li>Tôi giữ nhãn Loki có giới hạn và tổng hợp <code>by</code> sau <code>| json</code>.</li>
<li>Tôi so một dòng gốc với thứ Kibana/Grafana hiện trước khi tin một dòng thời gian.</li>
<li>Tôi xem giá trị của trường trước khi viết luật.</li>
<li>Tôi viết được ba cảnh báo của Lab 15 và nói mỗi cái cần đặt noData thế nào.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'An intruder with root runs `journalctl --rotate; journalctl --vacuum-time=1s` on a server whose journal is shipped by Alloy to Loki. What do you find in Loki?|||Kẻ đột nhập có root chạy `journalctl --rotate; journalctl --vacuum-time=1s` trên một máy chủ có journal được Alloy gửi về Loki. Trong Loki bạn thấy gì?',
        options: [
          'Nothing: Loki mirrors the journal and deletes the lines too|||Không còn gì: Loki phản chiếu journal và cũng xoá theo',
          'The lines shipped before the deletion are still there; only lines written after the agent was stopped would be missing|||Các dòng đã gửi trước lúc xoá vẫn còn; chỉ những dòng ghi sau khi agent bị tắt mới thiếu',
          'Only the lines of the last minute|||Chỉ các dòng của phút cuối',
          'The lines are there but marked as deleted|||Các dòng còn nhưng bị đánh dấu đã xoá',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: In 15.1 the local count went to 0 and Loki still returned the 4 failed SSH lines. Deleting the source does not touch what was already shipped; an attacker must stop the agent first, which creates silence (alert on it).|||VI: Ở 15.1 số dòng trên máy về 0 mà Loki vẫn trả 4 dòng SSH thất bại. Xoá nguồn không đụng tới thứ đã gửi; kẻ tấn công phải tắt agent trước, và việc đó tạo ra im lặng (hãy cảnh báo trên nó).',
      },
      {
        question: 'Loki was stopped for about a minute while the API kept logging. After Loki came back, all 30 lines were there and `loki_write_dropped_entries_total` was 0. What made that possible, and what would break it?|||Loki bị tắt khoảng một phút trong lúc API vẫn ghi log. Khi Loki trở lại, đủ 30 dòng và `loki_write_dropped_entries_total` bằng 0. Điều gì giúp được vậy, và điều gì sẽ làm hỏng nó?',
        options: [
          'Loki pulls missing lines from Docker; nothing can break it|||Loki tự kéo các dòng thiếu từ Docker; không gì làm hỏng được',
          'Docker buffers logs for Loki; restarting Docker would break it|||Docker đệm log cho Loki; khởi động lại Docker sẽ làm hỏng',
          'Alloy kept the batches in memory and retried with backoff; restarting Alloy during the outage (without its WAL) or an outage longer than all retries would lose lines|||Alloy giữ các lô trong bộ nhớ và thử lại với thời gian chờ tăng dần; khởi động lại Alloy giữa lúc sập (không bật WAL) hoặc sập lâu hơn mọi lần thử sẽ mất dòng',
          'Grafana caches the lines|||Grafana lưu tạm các dòng',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Logs are pushed. Alloy\'s loki.write retries (default 500 ms → 5 min, 10 attempts) from an in-memory queue — the metrics showed status_code -1 and 500 and growing batch_retries_total. After the last retry it drops the batch and increments dropped_entries.|||VI: Log được đẩy. loki.write của Alloy thử lại (mặc định 500 ms → 5 phút, 10 lần) từ một hàng đợi trong bộ nhớ — metric cho thấy status_code -1 và 500, batch_retries_total tăng. Sau lần thử cuối nó bỏ lô và tăng dropped_entries.',
      },
      {
        question: 'A teammate wants to add `rid` (the request id) and `user_id` as Loki labels "so queries are faster". Your answer?|||Đồng nghiệp muốn thêm `rid` (request id) và `user_id` làm nhãn Loki "cho truy vấn nhanh hơn". Bạn trả lời sao?',
        options: [
          'Good idea: more labels always mean faster queries|||Ý hay: càng nhiều nhãn càng nhanh',
          'Only add rid, user_id is fine in the line|||Chỉ thêm rid, user_id để trong dòng là được',
          'Labels are ignored by Loki anyway|||Đằng nào Loki cũng bỏ qua nhãn',
          'No: each unique label set is a stream; ids create one stream per request/user and blow up the index — keep them in the line and use | json | rid="…"|||Không: mỗi bộ nhãn duy nhất là một luồng; id tạo ra mỗi request/người dùng một luồng và làm nổ chỉ mục — để trong dòng và dùng | json | rid="…"',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: The lab had 10 streams with at most 4 values per label (logcli series --analyze-labels). Labels say where a line comes from; content stays in the line and is extracted at query time.|||VI: Lab có 10 luồng, mỗi nhãn tối đa 4 giá trị (logcli series --analyze-labels). Nhãn nói dòng đến từ đâu; nội dung để trong dòng và được trích lúc truy vấn.',
      },
      {
        question: '`quantile_over_time(0.95, {container="lgz-c15-api"} | json | path="/api/orders" | unwrap ms [5m])` returned 40 series. Why, and how do you get one p95?|||`quantile_over_time(0.95, {container="lgz-c15-api"} | json | path="/api/orders" | unwrap ms [5m])` trả về 40 chuỗi. Vì sao, và làm sao lấy một giá trị p95?',
        options: [
          '| json made labels unique per line (rid, time…) and the aggregation kept them; add by (path) or | keep path|||| json tạo nhãn khác nhau ở mỗi dòng (rid, time…) và phép tổng hợp giữ chúng; thêm by (path) hoặc | keep path',
          'Loki returns one series per minute; use [1h]|||Loki trả mỗi phút một chuỗi; dùng [1h]',
          'unwrap does not work on JSON; use regexp|||unwrap không chạy với JSON; dùng regexp',
          'There were 40 containers|||Có 40 container',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: 40 orders = 40 series, each a single value. With by (path) the lab returned one series, /api/orders ≈ 47 ms.|||VI: 40 đơn hàng = 40 chuỗi, mỗi chuỗi một giá trị. Có by (path), lab trả về một chuỗi, /api/orders ≈ 47 ms.',
      },
      {
        question: 'The server\'s auth.log says `Nov 20 02:14:09 … Failed password … from 198.51.100.23`. After loading a copy with Filebeat on your laptop (a container in UTC), Kibana shows 09:14:09. What happened?|||auth.log trên máy chủ ghi `Nov 20 02:14:09 … Failed password … from 198.51.100.23`. Sau khi nạp một bản sao bằng Filebeat trên laptop (container chạy UTC), Kibana hiện 09:14:09. Chuyện gì đã xảy ra?',
        options: [
          'The server clock was wrong by 7 hours|||Đồng hồ máy chủ sai 7 tiếng',
          'Kibana always adds 7 hours for Vietnam|||Kibana luôn cộng 7 tiếng cho Việt Nam',
          'The syslog line has no time zone; Filebeat stamped the zone of its own machine (+00:00), Kibana then displayed it in the browser zone (+07:00) — set TZ of the source for Filebeat|||Dòng syslog không có múi giờ; Filebeat đóng dấu múi giờ của chính máy nó (+00:00), rồi Kibana hiện theo múi của trình duyệt (+07:00) — đặt TZ của nguồn cho Filebeat',
          'Elasticsearch stores only UTC and cannot be fixed|||Elasticsearch chỉ lưu UTC và không sửa được',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: 15.3: event.timezone "+00:00" before, "+07:00" after setting TZ=Asia/Ho_Chi_Minh on the Filebeat container; Kibana then showed 02:14:09 like the server. var.timezone does not exist in that module and was silently ignored.|||VI: 15.3: event.timezone "+00:00" lúc đầu, "+07:00" sau khi đặt TZ=Asia/Ho_Chi_Minh cho container Filebeat; Kibana khi đó hiện 02:14:09 giống máy chủ. var.timezone không tồn tại trong module đó và bị lờ đi không báo.',
      },
      {
        question: 'In Kibana, `user.name : "git"` returns 0 results, but you can see "Failed password for invalid user git" in the raw lines. What is the most useful next step?|||Trong Kibana, `user.name : "git"` ra 0 kết quả, nhưng bạn thấy "Failed password for invalid user git" trong dòng gốc. Bước tiếp theo có ích nhất là gì?',
        options: [
          'Search event.original instead|||Tìm trên event.original',
          'Look at the actual values of user.name (terms aggregation or ES|QL STATS … BY user.name) — in the lab they had a leading space|||Xem giá trị thật của user.name (terms aggregation hoặc ES|QL STATS … BY user.name) — trong lab chúng có dấu cách ở đầu',
          'Restart Elasticsearch|||Khởi động lại Elasticsearch',
          'Use Lucene syntax instead of KQL|||Dùng cú pháp Lucene thay KQL',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: ES|QL showed LENGTH(user.name) = 5 for " test"; " git" matched 20 events. event.original is not indexed (index: false), so searching it fails. Check field values before writing a rule on them.|||VI: ES|QL cho LENGTH(user.name) = 5 với " test"; " git" khớp 20 sự kiện. event.original không được chỉ mục (index: false), nên tìm trên nó báo lỗi. Xem giá trị trường trước khi viết luật trên nó.',
      },
      {
        question: 'You configure Alloy on Windows with `loki.source.windowsevent` and leave the defaults. What is the timeline risk?|||Bạn cấu hình Alloy trên Windows với `loki.source.windowsevent` và để mặc định. Rủi ro gì với dòng thời gian?',
        options: [
          'Events are sent twice|||Sự kiện bị gửi hai lần',
          'Events are sent in UTC|||Sự kiện được gửi theo UTC',
          'The Security log is not readable|||Không đọc được log Security',
          'use_incoming_timestamp defaults to false: events get the time Alloy read them, so a backlog or replay is stamped "now"|||use_incoming_timestamp mặc định false: sự kiện nhận giờ lúc Alloy đọc, nên phần tồn đọng hay phần đọc lại bị đóng dấu "bây giờ"',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: The Alloy documentation: "When false, assigns the current timestamp to the log." Set it to true; the bookmark prevents duplicates on restart.|||VI: Tài liệu Alloy: "Khi false, gán thời điểm hiện tại cho log." Đặt true; bookmark chống trùng khi khởi động lại.',
      },
      {
        question: 'A Grafana rule counts "Failed password" lines over 5 minutes with threshold > 10. On a quiet night nobody fails, and the query returns no series at all. With Grafana\'s default noDataState, what happens?|||Một luật Grafana đếm dòng "Failed password" trong 5 phút với ngưỡng > 10. Đêm yên tĩnh không ai sai mật khẩu, truy vấn không trả chuỗi nào. Với noDataState mặc định của Grafana, chuyện gì xảy ra?',
        options: [
          'Nothing, the rule stays Normal|||Không có gì, luật vẫn Normal',
          'The rule is deleted|||Luật bị xoá',
          'The rule goes to NoData and sends a "DatasourceNoData" notification — a false alarm every quiet night; set noDataState: OK for count rules|||Luật chuyển sang NoData và gửi thông báo "DatasourceNoData" — báo nhầm mỗi đêm yên tĩnh; đặt noDataState: OK cho luật đếm',
          'Grafana retries until data arrives|||Grafana thử lại tới khi có dữ liệu',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lab 15 loaded a copy of the SSH rule with the default (NoData): with no SSH failures it fired a DatasourceNoData alert to the phone while the real rule (noDataState: OK) stayed quiet.|||VI: Lab 15 nạp một bản sao luật SSH để mặc định (NoData): không có lần SSH thất bại nào mà nó vẫn bắn cảnh báo DatasourceNoData về điện thoại, trong khi luật thật (noDataState: OK) im lặng.',
      },
      {
        question: 'The absence alert `absent_over_time({container="lgz-c15-api"}[2m])` fired although the API was healthy. What was missing?|||Cảnh báo im lặng `absent_over_time({container="lgz-c15-api"}[2m])` kêu dù API vẫn khoẻ. Thiếu gì?',
        options: [
          'A source of lines that always exists — the API only logged on requests; a health check every 15 s (like a load balancer) fixed it|||Một nguồn dòng luôn có — API chỉ ghi log khi có request; healthcheck mỗi 15 giây (như bộ cân bằng tải) đã sửa được',
          'A longer for: duration|||Một thời gian for: dài hơn',
          'TLS between Alloy and Loki|||TLS giữa Alloy và Loki',
          'A second Grafana|||Một Grafana thứ hai',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Silence only means "broken" if the source normally talks. When building the lab, the first version fired within 2 minutes on an idle API; after adding /healthz and a Docker healthcheck, it fired only when the container was really stopped.|||VI: Im lặng chỉ có nghĩa "hỏng" khi nguồn bình thường vẫn nói. Lúc dựng lab, bản đầu kêu sau 2 phút vì API không có ai gọi; thêm /healthz và healthcheck của Docker thì nó chỉ kêu khi container thật sự bị dừng.',
      },
      {
        question: 'Your customer runs Elasticsearch/Kibana on the free Basic license and wants log alerts in their Slack. What does Kibana itself allow?|||Khách hàng chạy Elasticsearch/Kibana bản Basic miễn phí và muốn cảnh báo log vào Slack. Bản thân Kibana cho phép gì?',
        options: [
          'Slack, Teams and webhooks are all free|||Slack, Teams và webhook đều miễn phí',
          'Rules (Elasticsearch query, Log threshold) are Basic, but connectors except Index and Server log need Gold or higher — use an index + a small forwarder, or Grafana/ElastAlert on top|||Luật (Elasticsearch query, Log threshold) có ở Basic, nhưng connector trừ Index và Server log cần Gold trở lên — dùng index + một bộ chuyển tiếp nhỏ, hoặc Grafana/ElastAlert bên trên',
          'No alerting at all on Basic|||Basic không có cảnh báo gì',
          'Only email|||Chỉ có email',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: From the real Kibana 9.5.7 API in 15.5: .index and .server-log are basic; .email, .slack, .webhook, .teams, .pagerduty are gold. Rule types es-query and logs.alert.document.count are basic.|||VI: Từ API Kibana 9.5.7 thật ở 15.5: .index và .server-log là basic; .email, .slack, .webhook, .teams, .pagerduty là gold. Loại luật es-query và logs.alert.document.count là basic.',
      },
    ],
  },
};
