/**
 * 15.6 — Lab 15: một bảng theo dõi cho máy Windows, máy Linux và một ứng dụng Docker, kèm ba cảnh báo (soạn 24/11/2026, agent lgz).
 * Lab: ./_demo/s15/loki (compose + Alloy + Grafana provisioning) + ./_demo/s15/lab15/bay-nodata.yaml (luật bẫy). Phần Windows: ./_demo/s15/windows/config.alloy (bài 15.4).
 * Đáp án chạy thật: OUT['s15/canh-bao'] (ba cảnh báo) + OUT['s15/lab15'] (lưu lượng bình thường + luật bẫy noData). Phần Windows chạy trên máy người học (máy soạn là Linux).
 */
import { lenh, ma, kv } from '../_chung.mjs';

export default {
  title: 'Lab 15 — One dashboard for your Windows PC, your Linux VM and a Docker app, with three alerts|||Lab 15 — Một bảng theo dõi cho máy Windows, máy ảo Linux và một app Docker, kèm ba cảnh báo',
  slug: 'log-15-6-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dựng bộ Loki + Alloy + Grafana cho ba nguồn (máy Linux có sshd, API trong Docker, và máy Windows của bạn), viết ba cảnh báo về điện thoại — SSH thất bại tăng vọt, API trả 5xx, một nguồn im lặng — rồi tự gây ra từng tình huống và chứng minh không báo nhầm khi lưu lượng bình thường. Luật bẫy để noDataState mặc định bắn "DatasourceNoData" giữa đêm yên tĩnh. Đáp án chạy thật, báo cáo 5 dòng, câu hỏi phỏng vấn, mốc dự án.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lab 15</span>
<h2>Your own little SOC: three sources, one Grafana, three alerts that are right</h2>
<p class="lead">Friday, 17:30. Your team lead: "Before the customer demo next week I want to be told — on my phone — if someone is brute-forcing the VM, if the API starts throwing 5xx, or if any machine stops sending logs. And I do not want to be woken up for nothing." You have the lab stack from lessons 15.1–15.5. Make it true, prove it, and write the five-line note.</p>

<h3>Rules</h3>
<ul>
<li>Only your own machines and the lab containers. Brute force means wrong passwords <em>to your own lab VM</em>.</li>
<li>Every rule is in a provisioning file, not clicked in the UI — the file goes into Git.</li>
<li>For each alert you must cause it on purpose and record when you caused it and when the phone buzzed.</li>
<li>"Not woken for nothing" is part of the grade: run normal traffic and show that nothing fires.</li>
</ul>

<h3>Setup (15 min)</h3>
<ol>
<li>Copy <code>_demo/s15/loki</code> to your machine, put the course log pack's <code>linux/auth.log</code> into <code>mau/linux/</code>, build the Linux image (<code>docker build -t lgz-c15-vm:1 vm</code>), <code>docker compose up -d</code>.</li>
<li>On your phone: install ntfy, subscribe to your topic. Change the contact point URL in <code>grafana/alerting/lab15.yaml</code> to your ntfy (self-hosted, or <code>https://ntfy.sh/&lt;long-random-topic&gt;</code> for a test — anyone who guesses the topic can read it).</li>
<li>Optional but recommended: on your Windows PC, install Alloy with the configuration of lesson 15.4 pointing at this Loki (open the port only on your LAN, or use the TLS setup).</li>
</ol>

<h3>The questions</h3>
<ol>
<li>List every stream in Loki and say which machine/source each one is. Are there labels with many values?</li>
<li>Write the three rules. For each: query, threshold, <code>for</code>, <code>noDataState</code>, <code>execErrState</code>, and the "next step" text.</li>
<li>Cause each alert. Table: what you did, time, rule state changes, time of the phone notification.</li>
<li>Run normal traffic (orders and payments that succeed) for at least 5 minutes (the real goal is one hour). Show that nothing fires.</li>
<li>Load the trap rule <code>lab15/bay-nodata.yaml</code> (a copy of the SSH rule with the default <code>noDataState</code>) during that quiet period. What reaches the phone, and why?</li>
<li>Stop Alloy (not the API) for 3 minutes. Which alert fires? What does that tell you about "source silent" alerts?</li>
<li>(Windows) Create a 4625 on your PC and find it in Grafana. Then stop the Alloy service: does the silence rule catch it? If not, write the rule that would.</li>
</ol>

<h3>Hints (open one at a time)</h3>
<details><summary>Hint for 1</summary><p><code>logcli series --analyze-labels '{job=~".+"}'</code> (lesson 15.2). Streams from the journal have <code>host</code> and <code>unit</code>; from Docker <code>container</code>; from the old file <code>filename</code>.</p></details>
<details><summary>Hint for 2 and 5</summary><p>Lesson 15.5 shows the file. A count query that matches nothing returns <em>no series</em>, not 0 — decide what "no data" means for each rule.</p></details>
<details><summary>Hint for 6 and 7</summary><p>Which label does the silence rule select on? It watches <code>{container="lgz-c15-api"}</code>, so it fires whether the API or the agent stopped — it cannot tell which. A per-machine silence rule needs a selector per host: <code>absent_over_time({job="windows", host="PC-…"}[15m])</code>. Then check Alloy's own health.</p></details>

<h3>Answer key (run for real — open after you finish)</h3>
<details><summary>Show the three alerts being triggered</summary>
${lenh('s15/canh-bao', 0)}
${lenh('s15/canh-bao', 2)}
${lenh('s15/canh-bao', 3)}
${lenh('s15/canh-bao', 4)}
${lenh('s15/canh-bao', 6)}
${lenh('s15/canh-bao', 7)}
${lenh('s15/canh-bao', 8)}
${lenh('s15/canh-bao', 9)}
${lenh('s15/canh-bao', 10)}
${lenh('s15/canh-bao', 11)}
</details>
<details><summary>Show the quiet period and the trap rule</summary>
${ma('yaml', 's15/lab15/bay-nodata.yaml')}
${lenh('s15/lab15', 0)}
${lenh('s15/lab15', 1)}
${lenh('s15/lab15', 2)}
${lenh('s15/lab15', 3)}
${lenh('s15/lab15', 4)}
${lenh('s15/lab15', 5)}
${lenh('s15/lab15', 6)}
</details>

<h3>Reading the answers</h3>
<details><summary>Show the explanation</summary>
<ul>
<li><strong>Q3.</strong> SSH: about half a minute of wrong passwords, firing at the next evaluation, phone a few seconds later. 5xx: <em>Pending</em> first, firing one minute later (<code>for: 1m</code>). Silence: about the length of the window (2 min in the lab; use 15 min in production so a slow night does not page you).</li>
<li><strong>Q4.</strong> With successful orders and payments every 2 s, the three real rules stayed <em>inactive</em>: no SSH failures, no 5xx, and the API logged continuously. That is the "not woken for nothing" evidence. One hour is the real test; five minutes only shows the idea.</li>
<li><strong>Q5.</strong> The trap rule found no "Failed password" line in 5 minutes, so its query returned no series; with <code>noDataState: NoData</code> Grafana turned that into an alert named <code>DatasourceNoData</code> and sent it to the phone — on a quiet, perfectly healthy night. The real rule, identical except <code>noDataState: OK</code>, stayed silent. This is the most common reason people stop trusting log alerts.</li>
<li><strong>Q6.</strong> Stopping Alloy makes <em>every</em> source silent at once — the API silence rule fires although the API is fine. Correct, but the message is misleading: add the next step "check Alloy" (it is in the rule) and, better, an alert on Alloy itself (its <code>/-/ready</code> or its metrics via Prometheus).</li>
<li><strong>Q7.</strong> A rule only watches the selectors it names. A Windows PC needs its own <code>absent_over_time({job="windows", host="…"}[15m])</code>, and with many PCs a rule grouped by host over a list of expected hosts (or a heartbeat metric).</li>
</ul>
</details>

<h3>Write the report (5 lines)</h3>
<div class="callout"><p>Example:<br>
1. Sources: VM lab15 (journal: ssh, systemd), shop-api (Docker), PC-… (Security/System/Sysmon via Alloy) — 10 streams, no label over 4 values.<br>
2. Alerts: SSH &gt; 10/5 min (for 0 s), API 5xx &gt; 5/5 min (for 1 m), API silent 2 min (15 min in prod); all with noData=OK, error=Error; to ntfy.<br>
3. Tested: SSH buzzed within seconds, 5xx after the 1-minute <code>for</code>, silence ~2 min after stop; resolved message when back.<br>
4. Quiet period: 5 min normal traffic, 0 alerts; trap rule with default noData sent DatasourceNoData ⇒ default is unsafe.<br>
5. Gap: silence rule cannot tell API down from agent down ⇒ add an Alloy health alert; Windows silence rule per host still to do.</p></div>

<h3>Windows part (recommended, 30 min)</h3>
<p>Lesson 15.4 has the configuration. Do Q7 with your own PC: one real 4625, and stop/start the Alloy service. If you have no Windows, use the Event Viewer on a lab VM (Windows 11 evaluation) or skip and say so in line 5 of the report.</p>

<h3>🎤 Interviewers will ask</h3>
<ul>
<li><em>Why centralise logs at all?</em> — Evidence survives an intruder deleting local logs, one search over many machines and disposable containers, correlation by request id, and alerting. Show the 0-local / 4-central result of lesson 15.1.</li>
<li><em>Loki or Elasticsearch?</em> — Loki indexes labels only: cheap, easy, fine for "everything from service X now"; Elasticsearch parses and indexes every field: fast needle-in-haystack and analytics, more RAM and care. Name the customer constraint (existing stack, license, team).</li>
<li><em>What is a high-cardinality label and why does it hurt?</em> — A label with many values (user id, request id, IP); each label set is a stream, so the index and the number of tiny chunks explode. Keep ids in the line.</li>
<li><em>How do you know your logging is not silently broken?</em> — Alert on silence per source, on agent errors and dropped lines, on query errors; compare one raw line with the UI after every change (time zone, parsing).</li>
<li><em>An alert fires every night and nobody acts. What do you do?</em> — Find what it measures, set the threshold from data, add <code>for</code>, fix <code>noDataState</code>, route it to a channel instead of a phone — or delete it and write down why.</li>
</ul>

<h3>🛠 Project milestone</h3>
<p>In your capstone (or the course project): add Loki + Alloy + Grafana to the Docker Compose, with retention 7–14 days, the three alerts of this lab as provisioning files in Git, and ntfy (or Telegram) to your phone. Put one screenshot of Explore and one of a phone notification in the README, with the five-line report. When the lecturer asks "how do you know it works in production?", this is the answer.</p>

<h3>Done when</h3>
<div class="callout ok"><p>All three alerts reached your phone after you caused them, each with a time table; five minutes (ideally one hour) of normal traffic produced no alert; you can explain the DatasourceNoData from the trap rule and why <code>noDataState: OK</code> is right for count rules; the report fits in one chat message; the rule files are committed. Clean up with <code>docker compose down -v</code>.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['DatasourceNoData', 'Alert Grafana creates when a rule\'s query returns no data and noDataState is NoData.'],
  ['DatasourceError', 'Alert created when the query fails (store down) and execErrState is Error.'],
  ['Quiet-period test', 'Run normal traffic and prove that no alert fires — the false-positive check.'],
  ['Provisioning', 'Rules, contact points and policies loaded from files at startup (versioned in Git).'],
])}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Lab 15</span>
<h2>Một SOC tí hon của riêng bạn: ba nguồn, một Grafana, ba cảnh báo đúng</h2>
<p class="lead">Thứ sáu, 17:30. Trưởng nhóm nhắn: "Trước buổi demo với khách tuần sau, anh muốn được báo — trên điện thoại — nếu có ai dò mật khẩu vào máy ảo, nếu API bắt đầu trả 5xx, hoặc nếu máy nào ngừng gửi log. Và anh không muốn bị đánh thức vô cớ." Bạn có bộ lab của bài 15.1–15.5. Biến lời đó thành sự thật, chứng minh nó, và viết ghi chú năm dòng.</p>

<h3>Luật chơi</h3>
<ul>
<li>Chỉ máy của bạn và các container lab. Dò mật khẩu nghĩa là nhập sai mật khẩu <em>vào máy ảo lab của chính bạn</em>.</li>
<li>Mọi luật nằm trong tệp provisioning, không bấm tay trên giao diện — tệp đó vào Git.</li>
<li>Với mỗi cảnh báo, bạn phải cố ý gây ra nó và ghi lại lúc gây ra và lúc điện thoại rung.</li>
<li>"Không bị đánh thức vô cớ" là một phần của điểm: chạy lưu lượng bình thường và cho thấy không có gì kêu.</li>
</ul>

<h3>Chuẩn bị (15 phút)</h3>
<ol>
<li>Chép <code>_demo/s15/loki</code> về máy, đặt <code>linux/auth.log</code> của gói log khoá vào <code>mau/linux/</code>, dựng ảnh máy Linux (<code>docker build -t lgz-c15-vm:1 vm</code>), <code>docker compose up -d</code>.</li>
<li>Trên điện thoại: cài ntfy, theo dõi chủ đề của bạn. Đổi URL contact point trong <code>grafana/alerting/lab15.yaml</code> về ntfy của bạn (tự dựng, hoặc <code>https://ntfy.sh/&lt;chủ-đề-ngẫu-nhiên-dài&gt;</code> để thử — ai đoán được tên chủ đề là đọc được).</li>
<li>Không bắt buộc nhưng nên làm: trên máy Windows, cài Alloy với cấu hình bài 15.4 trỏ về Loki này (chỉ mở cổng trong mạng LAN, hoặc dùng cấu hình TLS).</li>
</ol>

<h3>Các câu hỏi</h3>
<ol>
<li>Liệt kê mọi luồng trong Loki và nói mỗi luồng là máy/nguồn nào. Có nhãn nào nhiều giá trị không?</li>
<li>Viết ba luật. Với mỗi luật: truy vấn, ngưỡng, <code>for</code>, <code>noDataState</code>, <code>execErrState</code>, và nội dung "việc cần làm".</li>
<li>Gây ra từng cảnh báo. Bảng: bạn làm gì, lúc nào, trạng thái luật đổi ra sao, lúc nào điện thoại nhận tin.</li>
<li>Chạy lưu lượng bình thường (đơn hàng và thanh toán thành công) ít nhất 5 phút (mục tiêu thật là một giờ). Cho thấy không có gì kêu.</li>
<li>Nạp luật bẫy <code>lab15/bay-nodata.yaml</code> (bản sao luật SSH để <code>noDataState</code> mặc định) trong lúc yên tĩnh đó. Điện thoại nhận gì, và vì sao?</li>
<li>Dừng Alloy (không dừng API) 3 phút. Cảnh báo nào kêu? Điều đó nói gì về cảnh báo "nguồn im lặng"?</li>
<li>(Windows) Tạo một 4625 trên máy và tìm nó trong Grafana. Rồi dừng dịch vụ Alloy: luật im lặng có bắt được không? Nếu không, viết luật bắt được.</li>
</ol>

<h3>Gợi ý (mở từng cái một)</h3>
<details><summary>Gợi ý câu 1</summary><p><code>logcli series --analyze-labels '{job=~".+"}'</code> (bài 15.2). Luồng từ journal có <code>host</code> và <code>unit</code>; từ Docker có <code>container</code>; từ tệp cũ có <code>filename</code>.</p></details>
<details><summary>Gợi ý câu 2 và 5</summary><p>Bài 15.5 có tệp mẫu. Một truy vấn đếm không khớp gì sẽ trả về <em>không có chuỗi nào</em>, không phải số 0 — quyết định "không có dữ liệu" nghĩa là gì với từng luật.</p></details>
<details><summary>Gợi ý câu 6 và 7</summary><p>Luật im lặng chọn theo nhãn nào? Nó canh <code>{container="lgz-c15-api"}</code>, nên nó kêu dù API hay agent dừng — nó không phân biệt được. Luật im lặng theo từng máy cần bộ chọn theo từng host: <code>absent_over_time({job="windows", host="PC-…"}[15m])</code>. Rồi kiểm tình trạng của chính Alloy.</p></details>

<h3>Đáp án (chạy thật — mở sau khi làm xong)</h3>
<details><summary>Xem ba cảnh báo được gây ra</summary>
${lenh('s15/canh-bao', 0)}
${lenh('s15/canh-bao', 2)}
${lenh('s15/canh-bao', 3)}
${lenh('s15/canh-bao', 4)}
${lenh('s15/canh-bao', 6)}
${lenh('s15/canh-bao', 7)}
${lenh('s15/canh-bao', 8)}
${lenh('s15/canh-bao', 9)}
${lenh('s15/canh-bao', 10)}
${lenh('s15/canh-bao', 11)}
</details>
<details><summary>Xem lúc yên tĩnh và luật bẫy</summary>
${ma('yaml', 's15/lab15/bay-nodata.yaml')}
${lenh('s15/lab15', 0)}
${lenh('s15/lab15', 1)}
${lenh('s15/lab15', 2)}
${lenh('s15/lab15', 3)}
${lenh('s15/lab15', 4)}
${lenh('s15/lab15', 5)}
${lenh('s15/lab15', 6)}
</details>

<h3>Đọc đáp án</h3>
<details><summary>Xem lời giải thích</summary>
<ul>
<li><strong>Câu 3.</strong> SSH: khoảng nửa phút nhập sai mật khẩu, báo ở lần tính kế tiếp, điện thoại nhận vài giây sau. 5xx: <em>Pending</em> trước, báo sau một phút (<code>for: 1m</code>). Im lặng: khoảng bằng độ dài khung (2 phút trong lab; production dùng 15 phút để một đêm vắng khách không gọi bạn dậy).</li>
<li><strong>Câu 4.</strong> Với đơn hàng và thanh toán thành công mỗi 2 giây, ba luật thật vẫn <em>inactive</em>: không có SSH thất bại, không 5xx, và API ghi log liên tục. Đó là bằng chứng "không đánh thức vô cớ". Một giờ mới là phép thử thật; năm phút chỉ cho thấy ý tưởng.</li>
<li><strong>Câu 5.</strong> Luật bẫy không thấy dòng "Failed password" nào trong 5 phút, nên truy vấn trả về không có chuỗi nào; với <code>noDataState: NoData</code>, Grafana biến chuyện đó thành một cảnh báo tên <code>DatasourceNoData</code> và gửi về điện thoại — trong một đêm yên tĩnh, hoàn toàn khoẻ mạnh. Luật thật, giống hệt chỉ khác <code>noDataState: OK</code>, vẫn im. Đây là lý do phổ biến nhất khiến người ta thôi tin cảnh báo từ log.</li>
<li><strong>Câu 6.</strong> Dừng Alloy làm <em>mọi</em> nguồn cùng im lặng — luật im lặng của API kêu dù API vẫn ổn. Đúng, nhưng thông điệp gây hiểu lầm: thêm việc cần làm "kiểm Alloy" (đã có trong luật) và tốt hơn là một cảnh báo cho chính Alloy (<code>/-/ready</code> hoặc metric của nó qua Prometheus).</li>
<li><strong>Câu 7.</strong> Một luật chỉ canh những bộ chọn nó nêu tên. Máy Windows cần <code>absent_over_time({job="windows", host="…"}[15m])</code> riêng, và khi có nhiều máy thì cần một luật gom theo host trên danh sách các máy phải có (hoặc một metric nhịp tim).</li>
</ul>
</details>

<h3>Viết báo cáo (5 dòng)</h3>
<div class="callout"><p>Ví dụ:<br>
1. Nguồn: máy ảo lab15 (journal: ssh, systemd), shop-api (Docker), PC-… (Security/System/Sysmon qua Alloy) — 10 luồng, không nhãn nào quá 4 giá trị.<br>
2. Cảnh báo: SSH &gt; 10/5 phút (for 0 s), API 5xx &gt; 5/5 phút (for 1 phút), API im lặng 2 phút (production 15 phút); đều noData=OK, error=Error; về ntfy.<br>
3. Đã thử: SSH rung trong vài giây, 5xx sau <code>for</code> một phút, im lặng ~2 phút sau khi dừng; có tin resolved khi trở lại.<br>
4. Lúc yên tĩnh: 5 phút lưu lượng bình thường, 0 cảnh báo; luật bẫy để noData mặc định gửi DatasourceNoData ⇒ mặc định không an toàn.<br>
5. Lỗ hổng: luật im lặng không phân biệt API sập với agent sập ⇒ thêm cảnh báo sức khoẻ Alloy; luật im lặng cho từng máy Windows còn phải làm.</p></div>

<h3>Phần Windows (nên làm, 30 phút)</h3>
<p>Bài 15.4 có cấu hình. Làm câu 7 với máy của bạn: một sự kiện 4625 thật, và dừng/bật dịch vụ Alloy. Không có Windows thì dùng Event Viewer trên một máy ảo lab (Windows 11 bản đánh giá) hoặc bỏ qua và ghi rõ ở dòng 5 của báo cáo.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><em>Vì sao phải gom log tập trung?</em> — Bằng chứng sống sót khi kẻ đột nhập xoá log trên máy, một lần tìm cho nhiều máy và cho container dùng một lần, tương quan qua request id, và cảnh báo. Đưa ra kết quả 0 trên máy / 4 ở trung tâm của bài 15.1.</li>
<li><em>Loki hay Elasticsearch?</em> — Loki chỉ chỉ mục nhãn: rẻ, dễ, hợp cho "mọi thứ của dịch vụ X lúc này"; Elasticsearch cắt và chỉ mục mọi trường: mò kim đáy bể và phân tích nhanh, tốn RAM và công chăm hơn. Nêu ràng buộc của khách (hệ đang có, giấy phép, đội ngũ).</li>
<li><em>Nhãn cardinality cao là gì và vì sao có hại?</em> — Nhãn có rất nhiều giá trị (user id, request id, IP); mỗi bộ nhãn là một luồng, nên chỉ mục và số chunk tí hon bùng nổ. Để id trong dòng.</li>
<li><em>Làm sao biết hệ log của bạn không âm thầm hỏng?</em> — Cảnh báo im lặng theo từng nguồn, cảnh báo khi agent lỗi và khi dòng bị bỏ, khi truy vấn lỗi; sau mỗi thay đổi (múi giờ, cắt trường) so một dòng gốc với giao diện.</li>
<li><em>Một cảnh báo kêu mỗi đêm mà không ai xử lý. Bạn làm gì?</em> — Tìm xem nó đo gì, đặt ngưỡng từ dữ liệu, thêm <code>for</code>, sửa <code>noDataState</code>, chuyển nó về kênh chat thay vì điện thoại — hoặc xoá và ghi lại lý do.</li>
</ul>

<h3>🛠 Mốc dự án</h3>
<p>Trong đồ án (hoặc dự án của khoá): thêm Loki + Alloy + Grafana vào Docker Compose, thời gian lưu 7–14 ngày, ba cảnh báo của lab này dưới dạng tệp provisioning trong Git, và ntfy (hoặc Telegram) về điện thoại. Đặt một ảnh chụp Explore và một ảnh thông báo trên điện thoại vào README, kèm báo cáo năm dòng. Khi giảng viên hỏi "làm sao em biết nó chạy được trên production?", đây là câu trả lời.</p>

<h3>Đạt khi</h3>
<div class="callout ok"><p>Cả ba cảnh báo tới điện thoại sau khi bạn gây ra, mỗi cái có bảng thời gian; năm phút (lý tưởng là một giờ) lưu lượng bình thường không gây cảnh báo nào; bạn giải thích được DatasourceNoData của luật bẫy và vì sao <code>noDataState: OK</code> đúng cho luật đếm; báo cáo gói trong một tin nhắn; các tệp luật đã được commit. Dọn bằng <code>docker compose down -v</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['DatasourceNoData', 'Cảnh báo Grafana tạo ra khi truy vấn của luật không có dữ liệu và noDataState là NoData.'],
  ['DatasourceError', 'Cảnh báo tạo ra khi truy vấn thất bại (kho sập) và execErrState là Error.'],
  ['Phép thử yên tĩnh', 'Chạy lưu lượng bình thường và chứng minh không cảnh báo nào kêu — kiểm báo nhầm.'],
  ['Provisioning', 'Luật, contact point và policy nạp từ tệp lúc khởi động (quản lý phiên bản trong Git).'],
])}
</div>
`,
};
