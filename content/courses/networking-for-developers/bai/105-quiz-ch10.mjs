/** Chương 10 · Quiz — 10 câu tình huống, đáp án rải đều (A×3 · B×2 · C×3 · D×2), dữ liệu từ output thật của lab cân bằng tải. */
const q = (en, vi) => `${en}|||${vi}`;
const o = (pairs) => pairs.map(([en, vi]) => q(en, vi));
const ex = (en, vi) => `EN: ${en}|||VI: ${vi}`;

export default {
  title: 'Quiz — Chapter 10: Load balancing and proxies|||Quiz — Chương 10: Cân bằng tải và proxy',
  slug: 'netdev-10-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: L4 vs L7, X-Forwarded-For, round robin, least connections, consistent hashing, kiểm sức khoẻ bị động/chủ động, draining, reverse/forward proxy, tunnel, và mã 502/503/504/524.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>Quiz — Load balancing and proxies</h2>
<p class="lead">Ten situations from the chapter's load-balancer lab. Most can be answered by reading what a backend saw, a distribution, or a status code the way the lessons taught.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can tell L4 from L7 and say what each can and cannot do.</li>
<li>I can choose round robin, least connections or consistent hashing.</li>
<li>I can explain passive vs active health checks and draining.</li>
<li>I can classify a reverse proxy, a forward proxy and a tunnel.</li>
<li>I can read 502, 503, 504 and 524 and name the backend cause.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Quiz</span>
<h2>Quiz — Cân bằng tải và proxy</h2>
<p class="lead">Mười tình huống từ phòng lab cân bằng tải của chương. Phần lớn trả lời được bằng cách đọc cái một backend thấy, một phân phối, hay một mã trạng thái theo đúng cách các bài đã dạy.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi phân biệt được L4 với L7 và nói mỗi cái làm được và không làm được gì.</li>
<li>Tôi chọn được round robin, least connections hay consistent hashing.</li>
<li>Tôi giải thích được kiểm sức khoẻ bị động so với chủ động và draining.</li>
<li>Tôi phân loại được một reverse proxy, một forward proxy và một tunnel.</li>
<li>Tôi đọc được 502, 503, 504 và 524 và gọi tên nguyên nhân backend.</li>
</ul>
</div>`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: q('Through an L7 proxy the backend sees <code>X-Forwarded-For: 10.10.1.10</code>; through an L4 proxy it sees <code>forwardedFor: null</code>. Why?', 'Qua một proxy L7 backend thấy <code>X-Forwarded-For: 10.10.1.10</code>; qua một proxy L4 nó thấy <code>forwardedFor: null</code>. Vì sao?'),
        options: o([['L7 parses the HTTP request and can add headers; L4 only forwards TCP bytes', 'L7 phân tích yêu cầu HTTP và thêm được header; L4 chỉ chuyển byte TCP'], ['L4 is faster', 'L4 nhanh hơn'], ['The backend is misconfigured', 'Backend cấu hình sai'], ['L7 encrypts the IP', 'L7 mã hoá IP']]),
        correctIndex: 0, points: 1,
        explanation: ex('An L7 proxy reads the HTTP request, so it can insert X-Forwarded-For with the real client IP. An L4 proxy only forwards TCP/UDP bytes and never looks inside, so no header is added and the backend sees the proxy’s IP. Speed, backend config and encryption are not the reason.', 'Một proxy L7 đọc yêu cầu HTTP, nên nó chèn được X-Forwarded-For với IP client thật. Một proxy L4 chỉ chuyển byte TCP/UDP và không nhìn vào trong, nên không header nào được thêm và backend thấy IP của proxy. Tốc độ, cấu hình backend và mã hoá không phải lý do.'),
      },
      {
        question: q('You need the load balancer to route <code>/api</code> to one pool and <code>/static</code> to another. Which layer must it be?', 'Bạn cần bộ cân bằng tải định tuyến <code>/api</code> tới một dàn và <code>/static</code> tới một dàn khác. Nó phải ở tầng nào?'),
        options: o([['L4', 'L4'], ['L7 — only it reads the URL path', 'L7 — chỉ nó đọc path của URL'], ['Either works', 'Cái nào cũng được'], ['Neither can do path routing', 'Không cái nào định tuyến theo path được']]),
        correctIndex: 1, points: 1,
        explanation: ex('Routing by URL path requires reading the HTTP request, which only an L7 proxy does. An L4 proxy forwards raw connections and is blind to the path, so it cannot split /api from /static. L7 is required.', 'Định tuyến theo path của URL cần đọc yêu cầu HTTP, điều chỉ một proxy L7 làm. Một proxy L4 chuyển tiếp kết nối thô và mù với path, nên nó không tách /api khỏi /static được. L7 là bắt buộc.'),
      },
      {
        question: q('A per-user cache has a low hit rate behind a round-robin LB. Which algorithm helps?', 'Một cache theo người dùng có tỷ lệ trúng thấp sau một LB round-robin. Thuật toán nào giúp?'),
        options: o([['Least connections', 'Least connections'], ['Weighted', 'Weighted'], ['Consistent hashing on the user — the same user sticks to the same backend', 'Consistent hashing theo user — cùng người dùng dính cùng backend'], ['Random', 'Ngẫu nhiên']]),
        correctIndex: 2, points: 1,
        explanation: ex('Consistent hashing on the user sends each user’s requests to the same backend, so they keep hitting the cache that already holds their data — raising the hit rate. Round robin scatters a user across backends, so each backend’s cache misses. Least connections, weighted and random do not create stickiness.', 'Consistent hashing theo user gửi yêu cầu của mỗi người dùng tới cùng một backend, nên họ tiếp tục đụng cache đã giữ dữ liệu của họ — tăng tỷ lệ trúng. Round robin rải một người dùng qua các backend, nên cache mỗi backend trượt. Least connections, weighted và random không tạo tính dính.'),
      },
      {
        question: q('On the lab, after a backend is killed it is removed from rotation and the request still succeeds. What made the request succeed?', 'Trên lab, sau khi một backend bị giết nó bị gỡ khỏi vòng xoay và yêu cầu vẫn thành công. Cái gì làm yêu cầu thành công?'),
        options: o([['Nothing — it failed', 'Không gì — nó hỏng'], ['The browser retried', 'Trình duyệt thử lại'], ['DNS failover', 'DNS failover'], ['nginx retried the failed request on a healthy backend (proxy_next_upstream) and marked the dead one down', 'nginx thử lại yêu cầu lỗi trên một backend khoẻ (proxy_next_upstream) và đánh dấu cái chết down']]),
        correctIndex: 3, points: 1,
        explanation: ex('nginx’s passive health check retried the request on a healthy backend via proxy_next_upstream and marked the dead backend down (max_fails) so later requests skip it — the user never saw the failure. It was not a client retry, DNS, or a real failure.', 'Kiểm bị động của nginx thử lại yêu cầu trên một backend khoẻ qua proxy_next_upstream và đánh dấu backend chết down (max_fails) để yêu cầu sau bỏ qua nó — người dùng không bao giờ thấy lỗi. Không phải client thử lại, DNS, hay một lỗi thật.'),
      },
      {
        question: q('What is the difference between a passive and an active health check?', 'Khác biệt giữa một kiểm sức khoẻ bị động và một chủ động là gì?'),
        options: o([['Passive notices failures in real traffic; active probes a /health endpoint independently', 'Bị động nhận ra lỗi trong lưu lượng thật; chủ động dò một điểm cuối /health độc lập'], ['Passive is more accurate', 'Bị động chính xác hơn'], ['Active is only for L4', 'Chủ động chỉ cho L4'], ['They are the same', 'Chúng giống nhau']]),
        correctIndex: 0, points: 1,
        explanation: ex('Passive health checks watch real user traffic and mark a backend down after failures (free, but only after a user is affected). Active health checks periodically probe a /health endpoint independent of user traffic, catching a sick backend before a user does. Accuracy, L4-only and sameness are wrong.', 'Kiểm bị động canh lưu lượng người dùng thật và đánh dấu một backend down sau các lỗi (miễn phí, nhưng chỉ sau khi một người dùng bị ảnh hưởng). Kiểm chủ động định kỳ dò một điểm cuối /health độc lập với lưu lượng, bắt một backend bệnh trước khi một người dùng bắt. Chính xác, chỉ-L4 và giống nhau đều sai.'),
      },
      {
        question: q('A corporate proxy that all employee traffic goes through, so the destination sees the proxy not the employee, is a…', 'Một proxy công ty mà mọi lưu lượng nhân viên đi qua, nên đích thấy proxy không phải nhân viên, là một…'),
        options: o([['Reverse proxy', 'Reverse proxy'], ['Load balancer', 'Load balancer'], ['Forward proxy — it fronts the clients', 'Forward proxy — nó đứng trước client'], ['CDN', 'CDN']]),
        correctIndex: 2, points: 1,
        explanation: ex('A forward proxy fronts the clients and makes their outbound requests, so the destination sees the proxy. A reverse proxy (and a CDN/LB) fronts the servers instead. The distinction is which side the proxy stands in front of.', 'Một forward proxy đứng trước client và ra các yêu cầu đi ra của chúng, nên đích thấy proxy. Một reverse proxy (và một CDN/LB) đứng trước máy chủ thay vào. Sự phân biệt là proxy đứng trước phía nào.'),
      },
      {
        question: q('A school firewall blocks port 22, killing SSH. Adding <code>Port 993</code> to sshd_config and reloading did nothing (Ubuntu 24.04). What actually works?', 'Một tường lửa trường chặn cổng 22, giết SSH. Thêm <code>Port 993</code> vào sshd_config và reload không làm gì (Ubuntu 24.04). Cái gì thật sự chạy?'),
        options: o([['Rebooting the server', 'Khởi động lại máy chủ'], ['A second, independent SSH listener on an allowed port (e.g. ssh993.service on 993)', 'Một listener SSH thứ hai, độc lập trên một cổng được phép (vd ssh993.service trên 993)'], ['Disabling the firewall', 'Tắt tường lửa'], ['Changing the client', 'Đổi client']]),
        correctIndex: 1, points: 1,
        explanation: ex('On Ubuntu 24.04 socket activation owns the port, so a sshd_config Port change needs daemon-reload + restart ssh.socket, and Port 993 alone replaces 22. Safer and non-disruptive: run a second independent listener (ssh993.service) on an allowed port, leaving 22 untouched. A protocol can ride any port that is open. Rebooting, disabling the firewall or changing the client are not it.', 'Trên Ubuntu 24.04 socket activation sở hữu cổng, nên đổi Port trong sshd_config cần daemon-reload + restart ssh.socket, và Port 993 một mình thay 22. An toàn và không gián đoạn hơn: chạy một listener thứ hai độc lập (ssh993.service) trên một cổng được phép, để 22 nguyên vẹn. Một giao thức đi được trên bất kỳ cổng nào mở. Khởi động lại, tắt tường lửa hay đổi client đều không phải.'),
      },
      {
        question: q('A page returns a steady 502 for minutes. Where do you look first?', 'Một trang trả một 502 đều đặn suốt nhiều phút. Bạn nhìn đâu trước?'),
        options: o([['The DNS records', 'Bản ghi DNS'], ['The TLS certificate', 'Chứng chỉ TLS'], ['The browser cache', 'Cache trình duyệt'], ['The backend — is it up and listening? (a 502 means the proxy got a bad/no reply from it)', 'Backend — nó có đang chạy và nghe không? (một 502 nghĩa là proxy nhận một trả lời tồi/không từ nó)']]),
        correctIndex: 3, points: 1,
        explanation: ex('502 means the proxy reached the backend but got a broken or no reply, so the backend is the place to look — is the process up and listening? The real cuongthai outage was a backend crash loop (Exited 137) while the proxy was fine. DNS, the certificate and the browser cache are not what a 502 points at.', '502 nghĩa là proxy tới được backend nhưng nhận một trả lời hỏng hay không, nên backend là chỗ nhìn — tiến trình có đang chạy và nghe không? Sự cố cuongthai thật là một vòng lặp sập backend (Exited 137) trong khi proxy ổn. DNS, chứng chỉ và cache trình duyệt không phải cái một 502 chỉ tới.'),
      },
      {
        question: q('Which status means "the backend is up but did not answer within the proxy\'s read timeout"?', 'Mã nào nghĩa "backend đang chạy nhưng không trả lời trong timeout đọc của proxy"?'),
        options: o([['502', '502'], ['500', '500'], ['504', '504'], ['503', '503']]),
        correctIndex: 2, points: 1,
        explanation: ex('504 Gateway Timeout is the backend being too slow — up, but past the read timeout. 502 is a broken/empty reply, 503 is no healthy backend, and 500 is your own app throwing. Only 504 is the timeout-from-upstream.', '504 Gateway Timeout là backend quá chậm — đang chạy, nhưng quá timeout đọc. 502 là một trả lời hỏng/rỗng, 503 là không backend khoẻ, và 500 là app của chính bạn ném. Chỉ 504 là timeout-từ-upstream.'),
      },
      {
        question: q('To deploy new code to a backend without returning errors to users mid-request, you should first…', 'Để deploy mã mới cho một backend mà không trả lỗi cho người dùng giữa chừng yêu cầu, bạn nên trước tiên…'),
        options: o([['Drain it: stop new requests, let in-flight finish, then stop it', 'Rút êm nó: ngừng yêu cầu mới, để việc đang bay xong, rồi dừng nó'], ['Kill the process immediately', 'Giết tiến trình ngay'], ['Lower the TTL', 'Hạ TTL'], ['Switch to L4', 'Chuyển sang L4']]),
        correctIndex: 0, points: 1,
        explanation: ex('Connection draining stops new requests to the backend and lets the in-flight ones finish before you stop it, so no user gets a 502 mid-request; then you update and return it, one backend at a time (rolling deploy). Killing it mid-request errors users; TTL and L4 are unrelated.', 'Rút kết nối ngừng yêu cầu mới tới backend và để các cái đang bay xong trước khi bạn dừng nó, nên không người dùng nào nhận một 502 giữa chừng; rồi bạn cập nhật và trả nó về, một backend một lần (rolling deploy). Giết nó giữa chừng gây lỗi cho người dùng; TTL và L4 không liên quan.'),
      },
    ],
  },
};
