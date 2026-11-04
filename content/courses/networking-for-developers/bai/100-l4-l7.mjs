/**
 * Chương 10 · 10.1 — Cân bằng tải L4 và L7 (slug khung netdev-10-1-l4-l7). Bài MỞ CHƯƠNG 10 (có khối 🎯).
 * Output thật: lab/out/c101-*.out.txt (dựng lại: bash lab/code/dung-output-ch10.sh).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import G from '../giang/nfd-10-1.mjs';

const L = card;
const NGINX = { mon: 'Nginx', khoa: 'nginx' };

export default {
  title: '10.1 — L4 vs L7 load balancing|||10.1 — Cân bằng tải L4 và L7',
  slug: 'netdev-10-1-l4-l7',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một bộ cân bằng tải đặt một địa chỉ trước nhiều backend giống nhau (mở rộng ngang, sống sót khi sập, deploy không gián đoạn). Lựa chọn sâu nhất: L7 (nginx) HIỂU HTTP — thêm X-Forwarded-For, định tuyến theo path/host, retry, cache, nhưng phải giữ chứng chỉ TLS; L4 (socat) chỉ CHUYỂN byte — nhanh, không phụ thuộc giao thức, cho TLS đi qua, nhưng không thấy gì. Đo thật L7 vs L4 + round robin. TLS kết thúc ở đâu là quyết định L4/L7 lớn nhất.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>L4 vs L7 load balancing</h2>
<p class="lead">Behind almost every busy website is a quiet truth: the single address you typed is not one server. A <strong>load balancer</strong> stands at that address and spreads your request across a pool of identical machines, pulling out any that fail. This chapter is about that layer — how it chooses a backend, where it sits, and the errors it returns. It opens with the deepest design question of all: does the load balancer merely forward your <em>connection</em> (L4), or does it read your <em>HTTP request</em> (L7)? You will see the difference on the wire in a single line.</p>

<div class="callout info">
<p><strong>🎯 Chapter 10 at a glance — what you will be able to do after it</strong></p>
<ul>
<li><strong>Tell L4 from L7</strong> load balancing: forwarding a raw connection vs understanding the HTTP request, and what each can and cannot do.</li>
<li><strong>Choose an algorithm and health-check backends</strong>: round robin, least connections, consistent hashing; active vs passive health checks; connection draining.</li>
<li><strong>Place proxies correctly</strong>: reverse proxy, forward proxy, and tunnels (SSH, Cloudflare Tunnel) — who sits in front of whom.</li>
<li><strong>Read gateway errors</strong>: who emits <code>502</code>, <code>503</code>, <code>504</code>, <code>524</code>, and the real backend-restart outage behind a 7-minute 502.</li>
<li>Know where <strong>TLS terminates</strong> and why the real client IP must travel in <code>X-Forwarded-For</code>.</li>
</ul>
<p><strong>Why a developer needs this:</strong> "one server is overloaded", "a deploy took the site down", "the rate limiter sees one IP", "we get random 502s", "the LB can't read the Host header" are all load-balancer questions. Everything is measured on the base lab with nginx (L7) and socat (L4) in front of three backends.</p>
</div>

<h3>One address, many servers</h3>
<p>A single public address cannot be one machine forever — it runs out of CPU, and one crash takes the whole site down. A load balancer fixes both: it spreads requests across a pool of identical backends and stops routing to a sick one. The client still sees one address. This buys three things:</p>
<ul>
<li><strong>Scale horizontally</strong> — add backends instead of a bigger box.</li>
<li><strong>Survive a crash</strong> — the LB removes a failed backend from the pool.</li>
<li><strong>Deploy without downtime</strong> — drain one backend, update it, return it, repeat.</li>
</ul>

<h3>L7 understands HTTP; L4 just forwards bytes</h3>
<p>Send the same request through an L7 proxy (nginx, <code>:8080</code>) and an L4 proxy (socat, <code>:9090</code>), and ask each backend what it saw:</p>
${run('c101-l4l7', 'curl', 2)}
<p>Through L7, <code>forwardedFor</code> is the <strong>real client IP</strong> (<code>10.10.1.10</code>): nginx parsed the HTTP request and added <code>X-Forwarded-For</code>. Through L4, <code>forwardedFor</code> is <strong><code>null</code></strong>: socat only forwarded TCP bytes, never looked inside, and the backend sees the proxy's IP. That one difference captures the whole distinction:</p>
${kv([
  ['L7 (application)', 'Parses HTTP: route by path/host, add X-Forwarded-For, retry 5xx, cache. Must hold the TLS cert.'],
  ['L4 (transport)', 'Forwards TCP/UDP bytes: fast, protocol-agnostic, can pass TLS through. Sees nothing inside.'],
])}

<h3>Round robin across the pool</h3>
<p>With three backends behind nginx, the same URL lands on a different one each time:</p>
${run('c101-rr', 'for i', 1)}
<p>That is <strong>round robin</strong> — the default, simplest way to share load. The client never sees it; it requests one address and nginx rotates <code>be1 → be2 → be3 → be1…</code>. (The backend id here is a lab echo; in production you'd read it from a response header or a distributed trace, not the body.) The next lesson covers smarter algorithms and health checks.</p>

<div class="pitfall co-tieu-de">
<p><strong>Where TLS terminates is the biggest L4-vs-L7 decision — and it determines who can read the request.</strong> An L7 load balancer must <em>decrypt</em> TLS to read the HTTP, so it has to hold the certificate; the usual setup is "TLS terminates at the edge, plain HTTP inside the trusted network." An L4 load balancer can do <strong>TLS passthrough</strong> — forward the encrypted bytes untouched so only the backend holds the cert — but then it cannot route by path, add <code>X-Forwarded-For</code>, or retry a 5xx, because it never sees the request. Teams pick L4 passthrough for secrecy or speed and then wonder why the LB "can't read the Host header" or "won't do path routing": it is L4 by design, blind on purpose. Decide what the layer must <em>see</em>, then pick L4 or L7.</p>
</div>
${cauNoi('en', { ...NGINX, bai: 'nginx-9-1-khoi-upstream', so: '9.1', ten: 'The upstream block and four ways to choose', giong: 'nginx as an L7 load balancer spreading requests across a pool', khac: 'the Nginx course configures the upstream block and the four balancing methods in detail', them: 'the L4-vs-L7 distinction beneath it — what a proxy can see, X-Forwarded-For on the wire, and where TLS terminates' })}

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> you are asked whether to put the new service behind an L4 or an L7 load balancer, and to prove the difference.</p>
<ol>
<li>Bring up the lab: <code>bash lab/code/dung-output-ch10.sh</code> starts three backends, nginx (L7, <code>:8080</code>) and socat (L4, <code>:9090</code>).</li>
<li>Request through <code>:8080</code> and <code>:9090</code> and compare <code>forwardedFor</code>. Explain why one is the client IP and the other is <code>null</code>.</li>
<li>Request <code>:8080</code> six times and watch the backend rotate; name the algorithm.</li>
<li>Decide: for a feature that routes by URL path, which layer must you use, and why?</li>
</ol>
<p><strong>Done when:</strong> you can state that L7 added <code>X-Forwarded-For</code> because it parsed HTTP while L4 forwarded bytes blindly, that <code>:8080</code> round-robins three backends, and that path routing requires L7 (only L7 reads the request).</p>
<details><summary>Solution</summary>
<p>Through nginx (L7) the backend sees <code>forwardedFor: "10.10.1.10"</code> — nginx read the HTTP and added the header; through socat (L4) it sees <code>null</code> — socat only forwarded TCP, and the backend sees the proxy's IP. <code>:8080</code> rotates <code>be1/be2/be3</code> round robin. Routing by path needs L7, because only an L7 proxy decrypts/parses the request to see the path; an L4 proxy is blind to it.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Load balancer', 'One address in front of a pool of identical backends.'],
  ['L4 (transport)', 'Forwards TCP/UDP connections without reading the payload.'],
  ['L7 (application)', 'Parses HTTP: routes, adds headers, retries, caches.'],
  ['X-Forwarded-For', 'Header an L7 proxy adds to carry the real client IP.'],
  ['Round robin', 'Send each request to the next backend in turn.'],
  ['TLS termination', 'Where TLS is decrypted — at the LB (L7) or passed through (L4).'],
  ['Reverse proxy', 'A server that fronts backends and forwards client requests to them.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A <strong>load balancer</strong> puts one address in front of many identical backends — scale, survive crashes, zero-downtime deploys.</li>
<li><strong>L7</strong> parses HTTP: adds <code>X-Forwarded-For</code>, routes by path/host, retries, caches — but must hold the TLS cert.</li>
<li><strong>L4</strong> forwards TCP/UDP bytes: faster, protocol-agnostic, can pass TLS through — but sees nothing inside.</li>
<li><strong>Round robin</strong> rotates requests across the pool; the client sees one address.</li>
<li>nginx / HAProxy / Envoy / cloud LBs differ in features, not the core idea — ask what the layer must <strong>see</strong>.</li>
</ul>
${L('https://www.cloudflare.com/learning/performance/what-is-load-balancing/', '📘', 'Cloudflare — What is load balancing?', 'The pool, health checks, and L4 vs L7 in plain terms.', 'Open')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Forwarded-For', '📘', 'MDN — X-Forwarded-For', 'How a proxy carries the client IP, and the trust question.', 'Open')}
${L('https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/', '📘', 'nginx — HTTP load balancing', 'upstream, methods and health checks in an L7 proxy.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Cân bằng tải L4 và L7</h2>
<p class="lead">Sau gần như mọi website đông khách là một sự thật lặng lẽ: địa chỉ duy nhất bạn gõ không phải một máy chủ. Một <strong>bộ cân bằng tải</strong> đứng ở địa chỉ đó và chia yêu cầu của bạn qua một dàn máy giống nhau, rút ra bất kỳ cái nào hỏng. Chương này về tầng đó — nó chọn backend thế nào, nó ngồi ở đâu, và các lỗi nó trả. Nó mở đầu với câu hỏi thiết kế sâu nhất: bộ cân bằng tải chỉ chuyển tiếp <em>kết nối</em> của bạn (L4), hay nó đọc <em>yêu cầu HTTP</em> của bạn (L7)? Bạn sẽ thấy khác biệt trên dây trong một dòng.</p>

<div class="callout info">
<p><strong>🎯 Chương 10 trong một khung — học xong bạn làm được gì</strong></p>
<ul>
<li><strong>Phân biệt L4 với L7</strong>: chuyển tiếp một kết nối thô so với hiểu yêu cầu HTTP, và mỗi cái làm được và không làm được gì.</li>
<li><strong>Chọn thuật toán và kiểm sức khoẻ backend</strong>: xoay vòng, ít kết nối nhất, băm nhất quán; kiểm chủ động so với bị động; rút kết nối êm.</li>
<li><strong>Đặt proxy cho đúng</strong>: reverse proxy, forward proxy, và đường hầm (SSH, Cloudflare Tunnel) — ai đứng trước ai.</li>
<li><strong>Đọc lỗi cổng</strong>: ai phát <code>502</code>, <code>503</code>, <code>504</code>, <code>524</code>, và sự cố backend-khởi-động-lại thật sau một 502 bảy phút.</li>
<li>Biết <strong>TLS kết thúc ở đâu</strong> và vì sao IP client thật phải đi trong <code>X-Forwarded-For</code>.</li>
</ul>
<p><strong>Vì sao lập trình viên cần:</strong> "một máy chủ quá tải", "một deploy làm site chết", "bộ giới hạn thấy một IP", "chúng ta bị 502 ngẫu nhiên", "LB không đọc được header Host" đều là câu hỏi cân bằng tải. Mọi thứ đo trên lab cơ bản với nginx (L7) và socat (L4) trước ba backend.</p>
</div>

<h3>Một địa chỉ, nhiều máy chủ</h3>
<p>Một địa chỉ công cộng không thể mãi là một máy — nó hết CPU, và một lần sập làm cả site chết. Một bộ cân bằng tải sửa cả hai: nó chia yêu cầu qua một dàn backend giống nhau và ngừng định tuyến tới một cái bị bệnh. Client vẫn thấy một địa chỉ. Điều này mua ba thứ:</p>
<ul>
<li><strong>Mở rộng ngang</strong> — thêm backend thay vì một hộp lớn hơn.</li>
<li><strong>Sống sót khi sập</strong> — LB gỡ một backend hỏng khỏi dàn.</li>
<li><strong>Deploy không gián đoạn</strong> — rút êm một backend, cập nhật, trả về, lặp lại.</li>
</ul>

<h3>L7 hiểu HTTP; L4 chỉ chuyển byte</h3>
<p>Gửi cùng một yêu cầu qua một proxy L7 (nginx, <code>:8080</code>) và một proxy L4 (socat, <code>:9090</code>), và hỏi mỗi backend nó thấy gì:</p>
${run('c101-l4l7', 'curl', 2)}
<p>Qua L7, <code>forwardedFor</code> là <strong>IP client thật</strong> (<code>10.10.1.10</code>): nginx đã phân tích yêu cầu HTTP và thêm <code>X-Forwarded-For</code>. Qua L4, <code>forwardedFor</code> là <strong><code>null</code></strong>: socat chỉ chuyển tiếp byte TCP, không bao giờ nhìn vào trong, và backend thấy IP của proxy. Khác biệt duy nhất đó gói trọn cả sự phân biệt:</p>
${kv([
  ['L7 (ứng dụng)', 'Phân tích HTTP: định tuyến theo path/host, thêm X-Forwarded-For, retry 5xx, cache. Phải giữ chứng chỉ TLS.'],
  ['L4 (giao vận)', 'Chuyển tiếp byte TCP/UDP: nhanh, không phụ thuộc giao thức, cho TLS đi qua. Không thấy gì bên trong.'],
])}

<h3>Xoay vòng qua dàn máy</h3>
<p>Với ba backend sau nginx, cùng một URL rơi vào một cái khác mỗi lần:</p>
${run('c101-rr', 'for i', 1)}
<p>Đó là <strong>round robin</strong> — mặc định, cách chia tải đơn giản nhất. Client không bao giờ thấy nó; nó hỏi một địa chỉ và nginx xoay <code>be1 → be2 → be3 → be1…</code>. (Mã backend ở đây là một tiếng vọng của lab; trên production bạn đọc nó từ một header câu trả lời hay một trace phân tán, không phải thân.) Bài sau nói về các thuật toán khôn hơn và kiểm sức khoẻ.</p>

<div class="pitfall co-tieu-de">
<p><strong>TLS kết thúc ở đâu là quyết định L4-so-với-L7 lớn nhất — và nó định ai đọc được yêu cầu.</strong> Một bộ cân bằng tải L7 phải <em>giải mã</em> TLS để đọc HTTP, nên nó phải giữ chứng chỉ; thiết lập thường là "TLS kết thúc ở biên, HTTP thường bên trong mạng tin cậy." Một bộ cân bằng tải L4 có thể làm <strong>TLS passthrough</strong> — chuyển tiếp byte đã mã hoá nguyên vẹn để chỉ backend giữ chứng chỉ — nhưng rồi nó không định tuyến theo path được, không thêm <code>X-Forwarded-For</code>, không retry một 5xx, vì nó không bao giờ thấy yêu cầu. Đội nhóm chọn L4 passthrough vì bí mật hay tốc độ rồi thắc mắc vì sao LB "không đọc được header Host" hay "không định tuyến theo path": nó là L4 theo thiết kế, mù có chủ đích. Quyết tầng này phải <em>thấy</em> gì, rồi chọn L4 hay L7.</p>
</div>
${cauNoi('vi', { ...NGINX, bai: 'nginx-9-1-khoi-upstream', so: '9.1', ten: 'Khối upstream và bốn cách chọn máy', giong: 'nginx như một bộ cân bằng tải L7 chia yêu cầu qua một dàn máy', khac: 'khoá Nginx cấu hình khối upstream và bốn phương pháp cân bằng chi tiết', them: 'sự phân biệt L4-so-với-L7 bên dưới nó — một proxy thấy được gì, X-Forwarded-For trên dây, và TLS kết thúc ở đâu' })}

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bạn được hỏi nên đặt dịch vụ mới sau một bộ cân bằng tải L4 hay L7, và chứng minh khác biệt.</p>
<ol>
<li>Dựng lab: <code>bash lab/code/dung-output-ch10.sh</code> khởi động ba backend, nginx (L7, <code>:8080</code>) và socat (L4, <code>:9090</code>).</li>
<li>Hỏi qua <code>:8080</code> và <code>:9090</code> và so <code>forwardedFor</code>. Giải thích vì sao một cái là IP client và cái kia là <code>null</code>.</li>
<li>Hỏi <code>:8080</code> sáu lần và nhìn backend xoay; kể tên thuật toán.</li>
<li>Quyết: cho một tính năng định tuyến theo path của URL, bạn phải dùng tầng nào, và vì sao?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được L7 đã thêm <code>X-Forwarded-For</code> vì nó phân tích HTTP còn L4 chuyển byte mù, rằng <code>:8080</code> xoay vòng ba backend, và rằng định tuyến theo path cần L7 (chỉ L7 đọc yêu cầu).</p>
<details><summary>Lời giải</summary>
<p>Qua nginx (L7) backend thấy <code>forwardedFor: "10.10.1.10"</code> — nginx đọc HTTP và thêm header; qua socat (L4) nó thấy <code>null</code> — socat chỉ chuyển tiếp TCP, và backend thấy IP của proxy. <code>:8080</code> xoay <code>be1/be2/be3</code> round robin. Định tuyến theo path cần L7, vì chỉ một proxy L7 giải mã/phân tích yêu cầu để thấy path; một proxy L4 mù với nó.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Bộ cân bằng tải', 'Một địa chỉ trước một dàn backend giống nhau.'],
  ['L4 (giao vận)', 'Chuyển tiếp kết nối TCP/UDP không đọc payload.'],
  ['L7 (ứng dụng)', 'Phân tích HTTP: định tuyến, thêm header, retry, cache.'],
  ['X-Forwarded-For', 'Header một proxy L7 thêm để mang IP client thật.'],
  ['Round robin', 'Gửi mỗi yêu cầu tới backend kế tiếp lần lượt.'],
  ['Kết thúc TLS', 'Nơi TLS được giải mã — ở LB (L7) hay cho đi qua (L4).'],
  ['Reverse proxy', 'Một máy chủ đứng trước backend và chuyển yêu cầu client tới chúng.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một <strong>bộ cân bằng tải</strong> đặt một địa chỉ trước nhiều backend giống nhau — mở rộng, sống sót khi sập, deploy không gián đoạn.</li>
<li><strong>L7</strong> phân tích HTTP: thêm <code>X-Forwarded-For</code>, định tuyến theo path/host, retry, cache — nhưng phải giữ chứng chỉ TLS.</li>
<li><strong>L4</strong> chuyển tiếp byte TCP/UDP: nhanh hơn, không phụ thuộc giao thức, cho TLS đi qua — nhưng không thấy gì bên trong.</li>
<li><strong>Round robin</strong> xoay yêu cầu qua dàn máy; client thấy một địa chỉ.</li>
<li>nginx / HAProxy / Envoy / LB đám mây khác về tính năng, không về ý tưởng cốt lõi — hỏi tầng này phải <strong>thấy</strong> gì.</li>
</ul>
${L('https://www.cloudflare.com/learning/performance/what-is-load-balancing/', '📘', 'Cloudflare — Cân bằng tải là gì?', 'Dàn máy, kiểm sức khoẻ, và L4 so với L7 bằng lời đơn giản.', 'Mở')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Forwarded-For', '📘', 'MDN — X-Forwarded-For', 'Cách một proxy mang IP client, và câu hỏi tin cậy.', 'Mở')}
${L('https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/', '📘', 'nginx — Cân bằng tải HTTP', 'upstream, các phương pháp và kiểm sức khoẻ trong một proxy L7.', 'Mở')}
</div>
`,
};
