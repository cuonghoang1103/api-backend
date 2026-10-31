/**
 * Mục 0 · 0.2 — Chuyện gì xảy ra khi bạn gõ một địa chỉ rồi Enter (slug khung netdev-0-2-go-dia-chi).
 * Output thật: lab/out/c00-internet.out.txt (Internet thật), c00-url-lab.out.txt (trong lab).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-00-2.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };

export default {
  title: '0.2 — What happens when you type a URL and press Enter|||0.2 — Chuyện gì xảy ra khi bạn gõ một địa chỉ rồi Enter',
  slug: 'netdev-0-2-go-dia-chi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bảy chặng của một lần tải trang (URL → DNS → TCP → TLS → HTTP → máy chủ → tải và hiển thị), đọc curl -v, bấm giờ từng chặng bằng curl -w (giá trị cộng dồn!), vòng đi-về và vì sao khoảng cách quyết định tốc độ.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>What happens when you type a URL and press Enter</h2>
<p class="lead">You type <code>cuongthai.com</code>, press Enter, and about a tenth of a second later the page is there. In that tenth of a second at least four different protocols ran, on at least three different machines, and every one of them can fail in its own way. This lesson walks through the stages in order, names each one, and times each one on the real site — so that for the rest of the course you always know where in this journey you are.</p>

<h3>The seven stages</h3>
<ol>
<li><strong>Parse the URL.</strong> <code>https://cuongthai.com/</code> has a <em>scheme</em> (https — so port 443 unless another is written), a <em>host</em> (cuongthai.com) and a <em>path</em> (<code>/</code>). The browser also checks its own caches: maybe it already has the page, or already knows this site must always be HTTPS.</li>
<li><strong>DNS — find the address.</strong> The operating system asks: what IP address does cuongthai.com have? If the answer is not cached, it sends a small question (usually over UDP) to a <em>resolver</em> — your home router, your ISP's server, or a public one such as 1.1.1.1 — which finds the answer for you (Chapter 3 follows it all the way to the root servers).</li>
<li><strong>TCP — open a connection.</strong> Your kernel and the server's kernel exchange three packets (SYN, SYN-ACK, ACK) to agree they are talking. After this, both sides can send bytes that will arrive complete and in order (Chapter 4).</li>
<li><strong>TLS — make it private.</strong> Over that connection, the browser and server agree on encryption keys, and the browser checks the server's certificate: is this really cuongthai.com? (Chapter 7.)</li>
<li><strong>HTTP request.</strong> Now the actual question is sent: <code>GET / HTTP/2</code> with headers such as <code>Host: cuongthai.com</code> (Chapter 8).</li>
<li><strong>Server work.</strong> On the server, nginx receives the request and passes it to the application, which may query a database; then the response begins (Chapter 10).</li>
<li><strong>Download and render.</strong> The browser receives the HTML, which lists stylesheets, scripts, fonts and images — each one another request, often on the same connection.</li>
</ol>
<p>Here is the same journey as a timeline you can play. It uses a real measurement taken the same day from a laptop in Hanoi; the runs printed further down come from the lab container, so the milliseconds differ a little — networks never give the same number twice:</p>
${net('waterfall', 'cold', 'en', 'Every stage of one request to cuongthai.com, to scale — step through it, then compare the "warm" and "far" presets.', { tour: 'waterfall-phases' })}

<h3>Who does each stage, and where in the computer</h3>
<table>
<thead><tr><th>Stage</th><th>Which machine</th><th>Where inside it</th></tr></thead>
<tbody>
<tr><td>Parse URL, build HTTP</td><td>your laptop</td><td>the browser or curl process — an ordinary program running on a CPU core</td></tr>
<tr><td>DNS</td><td>laptop → resolver</td><td>a cache in the operating system first; then a question over the network</td></tr>
<tr><td>TCP</td><td>laptop ⇄ server</td><td>the <strong>kernel</strong> (operating system core) of both machines; packets leave through the network chip and the cable or Wi-Fi radio</td></tr>
<tr><td>TLS</td><td>laptop ⇄ server</td><td>a crypto library inside the application (OpenSSL in curl, BoringSSL in Chrome) — pure CPU work plus one round trip</td></tr>
<tr><td>Server work</td><td>the server, its database</td><td>nginx and the application processes; RAM and disk of the database</td></tr>
<tr><td>Render</td><td>your laptop</td><td>the browser's layout and JavaScript engines</td></tr>
</tbody>
</table>
<p>Keep this split in mind. When something is slow or broken, the first question is always: <em>which stage, on which machine?</em></p>

<h3>curl -v: the journey, narrated</h3>
<p><code>curl -v</code> (verbose) prints a line for each stage. We filter it to the interesting lines:</p>
${run('c00-internet', 'curl -sv -o /dev/null')}
<ul>
<li><code>Host cuongthai.com:443 was resolved</code> and the <code>IPv4</code> line — DNS done: the address is 160.187.1.208.</li>
<li><code>Trying 160.187.1.208:443...</code> — the TCP connection is being opened to port 443.</li>
<li><code>TLS handshake, Client hello</code> / <code>Server hello</code> and <code>SSL connection using TLSv1.3</code> — TLS agreed; the cipher and key-exchange algorithm are named.</li>
<li><code>ALPN: server accepted h2</code> — inside the TLS handshake both sides also agreed to speak HTTP/2.</li>
<li>Lines starting with <code>&gt;</code> were sent by curl; lines starting with <code>&lt;</code> came back. <code>HTTP/2 200</code>, served by nginx.</li>
</ul>

<h3>curl -w: a stopwatch for every stage</h3>
<p><code>curl -w</code> ("write out") prints variables after the transfer. Five of them mark the stages:</p>
${run('c00-internet', 'for i in 1 2 3')}
<p><strong>Each value is a moment measured from the start — not the length of a stage.</strong> To get the length of each stage, subtract the previous value. For the first run:</p>
<table>
<thead><tr><th>Stage</th><th>Calculation</th><th>Duration</th></tr></thead>
<tbody>
<tr><td>DNS</td><td>time_namelookup</td><td>3.3 ms</td></tr>
<tr><td>TCP connect</td><td>11.9 − 3.3</td><td>8.7 ms</td></tr>
<tr><td>TLS handshake</td><td>26.0 − 11.9</td><td>14.1 ms</td></tr>
<tr><td>Request + server work (to first byte)</td><td>69.5 − 26.0</td><td>43.5 ms</td></tr>
<tr><td>Download the body</td><td>102.7 − 69.5</td><td>33.2 ms</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de">
<p><strong>Reading <code>time_appconnect</code> as "TLS took 26 ms".</strong> It did not — TLS <em>ended</em> 26 ms after the start, and it actually took 14 ms. Dashboards and blog posts make this mistake constantly, and it leads people to optimise the wrong stage. Always subtract. (curl documents each variable as "the time, in seconds, it took from the start until…".)</p>
</div>

<h3>What a round trip is, and why it explains the numbers</h3>
<p>A <strong>round trip time (RTT)</strong> is how long a packet takes to reach the other machine and an answer to come back. <code>ping</code> measures exactly that:</p>
${run('c00-internet', 'ping -c 3')}
<p>About 7–10 ms to the server. Now look again at the stages: TCP took 8.7 ms — <strong>one round trip</strong>, which is what a SYN → SYN-ACK exchange costs (the third packet, ACK, travels together with the first request). TLS 1.3 took 14.1 ms — one round trip plus the cryptography on both CPUs. The server needed 43.5 ms to build the page (nginx in front of a Next.js application), and the 130 KB page took 33 ms to arrive.</p>
<p>Compare the same measurement inside the lab, where both containers are on the same computer and there is no DNS and no TLS:</p>
${run('c00-url-lab', 'for i in 1 2 3')}
<p>Under 2 ms in total, TCP in a fraction of a millisecond. The first run is slower (9.6 ms) because nginx and Node had to warm up — a reason to measure more than once.</p>

<h3>A reused connection skips three stages</h3>
<p>Give curl two URLs on the same host and it reuses the connection it already opened:</p>
${run('c00-internet', 'curl -s -o /dev/null -o /dev/null')}
<p>For the second URL, DNS, TCP and TLS are all <strong>zero</strong>. That is <strong>keep-alive</strong>: the connection stays open after a response so the next request can use it. In your code it appears as <em>connection pooling</em> — an HTTP client or database driver that keeps a few connections open and reuses them. Forgetting it (creating a new client for every call) silently adds a TCP and TLS handshake to every request; in Chapter 4 we measure exactly how much.</p>

<h3>Distance changes everything</h3>
<p>Now a site that is farther away:</p>
${run('c00-internet', 'curl -s -o /dev/null -w', 1)}
<p>Subtract: DNS 45.9 ms (not cached this time), TCP 27.1 ms, TLS 59.2 ms, first byte 54.0 ms later. Every network stage got longer because every round trip is longer. A faster CPU does not help — light in fibre covers roughly 200 km per millisecond, and the path is never a straight line. A rough model you can use in your head:</p>
<p style="text-align:center"><strong>time to first byte ≈ DNS + 1 RTT (TCP) + 1 RTT (TLS 1.3) + 1 RTT + server time</strong></p>
<p>With an 8 ms round trip the setup is about 24 ms; with a 180 ms round trip (a typical Asia–US figure) it is more than half a second before the server even starts. Later chapters are largely about removing round trips: reusing connections (Chapter 4), TLS resumption (Chapter 7), HTTP/3 (Chapter 8) and serving from a nearby CDN (Chapter 8).</p>

<h3>A browser does this dozens of times per page</h3>
<p>The HTML of a modern page lists dozens of other files. Requests to the same host reuse the open connection — with HTTP/2 many of them share it at the same instant. Requests to another host (a CDN for images, an API on a subdomain, fonts from a third party) pay DNS, TCP and TLS again. Open your browser's DevTools → Network tab → click any request → <strong>Timing</strong>: you will see the same stages as curl, per request.</p>
${cauNoi('en', { ...NWC, bai: 'nwc204-14-2-web-email-dns-dhcp-chia-se-tep', so: '14.2', ten: 'Web, email, DNS, DHCP and file sharing protocols', giong: 'HTTP and DNS as application-layer protocols', khac: 'NWC204 describes each protocol separately, at the end of the course', them: 'the whole journey of one request in order, with each stage timed on a real site and the cumulative curl -w trap' })}

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your team lead asks: "our site feels slow from your place — is it the network or the server?" Answer with numbers.</p>
<ol>
<li>From your own machine run <code>curl -s -o /dev/null -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}\\n' https://cuongthai.com/</code> three times.</li>
<li>For the median run, compute the duration of each stage (subtract!).</li>
<li>Run <code>ping -c 5 cuongthai.com</code>. Is TCP ≈ 1 RTT? Is TLS ≈ 1 RTT plus a little?</li>
<li>Repeat steps 1–2 for a site hosted far away (for example <code>https://example.com/</code>). Which stages grew the most?</li>
<li>Write one sentence: "From my place, the setup costs X ms and the server Y ms, so the slow part is …".</li>
</ol>
<p><strong>Done when:</strong> you have a table of five stage durations for each site and a one-sentence diagnosis that names a stage.</p>
<details><summary>Solution (with the lab’s numbers)</summary>
<p>cuongthai.com: DNS 3.3, TCP 8.7, TLS 14.1, server 43.5, body 33.2 ms — RTT 7–10 ms, so TCP ≈ 1 RTT and TLS ≈ 1.5 RTT. The network setup (26 ms) is smaller than the server work (43.5 ms): "the slow part is the server building the page". example.com: DNS 45.9, TCP 27.1, TLS 59.2, server 54.0 ms — here the setup (132 ms) dominates: "the slow part is distance".</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
    ['URL — scheme / host / path', 'https · cuongthai.com · / — how to talk, to whom, and what to ask for.'],
    ['resolver (máy phân giải)', 'The server that turns names into addresses for you and caches the answers.'],
    ['handshake (bắt tay)', 'The packets two sides exchange before real data: TCP to connect, TLS to agree on keys.'],
    ['RTT — round trip time (thời gian đi-về)', 'How long a packet takes to go there and an answer to come back.'],
    ['TTFB — time to first byte', 'From the start until the first byte of the response arrives.'],
    ['keep-alive / connection pooling', 'Keeping a connection open and reusing it, so later requests skip DNS, TCP and TLS.'],
    ['ALPN', 'The part of the TLS handshake where both sides pick the HTTP version (h2 = HTTP/2).'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>One page load = parse → DNS → TCP → TLS → request → server work → download — then many more requests for the page's files.</li>
<li><code>curl -v</code> narrates the stages; <code>curl -w</code> times them, <strong>cumulatively</strong> — subtract to get durations.</li>
<li>TCP and TLS 1.3 each cost about one round trip; distance multiplies every network stage, CPUs do not help.</li>
<li>A reused connection makes DNS, TCP and TLS free — keep-alive and pooling are the cheapest speed-up you have.</li>
</ul>
${L('https://everything.curl.dev/usingcurl/verbose/writeout.html', '⏱️', 'Everything curl — write out (-w)', 'Every timing variable and what it measures.', 'Open')}
${L('https://github.com/alex/what-happens-when', '🧭', 'What happens when… (GitHub)', 'The classic long answer to the interview question, down to the keyboard.', 'Open')}
${L('https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview', '📘', 'MDN — An overview of HTTP', 'Requests, responses and connections from the browser’s side.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Chuyện gì xảy ra khi bạn gõ một địa chỉ rồi Enter</h2>
<p class="lead">Bạn gõ <code>cuongthai.com</code>, bấm Enter, và khoảng một phần mười giây sau trang hiện ra. Trong một phần mười giây đó có ít nhất bốn giao thức khác nhau đã chạy, trên ít nhất ba máy khác nhau, và giao thức nào cũng có thể hỏng theo kiểu riêng của nó. Bài này đi qua các chặng theo đúng thứ tự, gọi tên từng chặng, và bấm giờ từng chặng trên trang thật — để suốt phần còn lại của khoá bạn luôn biết mình đang ở đâu trên hành trình này.</p>

<h3>Bảy chặng</h3>
<ol>
<li><strong>Phân tích URL.</strong> <code>https://cuongthai.com/</code> có <em>scheme</em> (https — nên là cổng 443 nếu không ghi cổng khác), <em>host</em> (cuongthai.com) và <em>đường dẫn</em> (<code>/</code>). Trình duyệt còn kiểm các bộ nhớ đệm của chính nó: có thể nó đã có sẵn trang, hoặc đã biết trang này bắt buộc dùng HTTPS.</li>
<li><strong>DNS — tìm địa chỉ.</strong> Hệ điều hành hỏi: cuongthai.com có địa chỉ IP nào? Nếu chưa có trong cache, nó gửi một câu hỏi nhỏ (thường qua UDP) tới một <em>resolver</em> — router nhà bạn, máy chủ của nhà mạng, hoặc một resolver công cộng như 1.1.1.1 — để resolver đi tìm câu trả lời giúp (Chương 3 lần theo tới tận máy chủ gốc).</li>
<li><strong>TCP — mở kết nối.</strong> Nhân hệ điều hành của bạn và của máy chủ trao đổi ba gói (SYN, SYN-ACK, ACK) để thống nhất là đang nói chuyện với nhau. Sau đó hai bên gửi được các byte sẽ tới nơi đầy đủ và đúng thứ tự (Chương 4).</li>
<li><strong>TLS — làm cho riêng tư.</strong> Trên kết nối đó, trình duyệt và máy chủ thống nhất khoá mã hoá, và trình duyệt kiểm chứng chỉ của máy chủ: có đúng là cuongthai.com không? (Chương 7.)</li>
<li><strong>Request HTTP.</strong> Giờ câu hỏi thật mới được gửi: <code>GET / HTTP/2</code> kèm các header như <code>Host: cuongthai.com</code> (Chương 8).</li>
<li><strong>Máy chủ xử lý.</strong> Trên máy chủ, nginx nhận request và chuyển cho ứng dụng, ứng dụng có thể truy vấn cơ sở dữ liệu; rồi câu trả lời bắt đầu được gửi về (Chương 10).</li>
<li><strong>Tải về và hiển thị.</strong> Trình duyệt nhận HTML, trong đó liệt kê stylesheet, script, font, ảnh — mỗi thứ lại là một request, thường đi trên cùng kết nối.</li>
</ol>
<p>Đây là cùng hành trình đó dưới dạng dòng thời gian bấm được. Nó dùng một số đo thật lấy cùng ngày từ một laptop ở Hà Nội; các lần đo in phía dưới thì chạy từ container của lab, nên số mili giây lệch nhau một chút — mạng chẳng bao giờ cho hai lần cùng một con số:</p>
${net('waterfall', 'cold', 'vi', 'Từng chặng của một request tới cuongthai.com, đúng tỉ lệ — đi từng bước, rồi so với chế độ "warm" và "far".', { tour: 'waterfall-phases' })}

<h3>Ai làm chặng nào, và ở đâu trong máy</h3>
<table>
<thead><tr><th>Chặng</th><th>Máy nào</th><th>Ở đâu bên trong</th></tr></thead>
<tbody>
<tr><td>Phân tích URL, dựng HTTP</td><td>laptop của bạn</td><td>tiến trình trình duyệt hoặc curl — một chương trình bình thường chạy trên một lõi CPU</td></tr>
<tr><td>DNS</td><td>laptop → resolver</td><td>bộ nhớ đệm trong hệ điều hành trước; rồi một câu hỏi gửi qua mạng</td></tr>
<tr><td>TCP</td><td>laptop ⇄ máy chủ</td><td><strong>nhân</strong> (lõi hệ điều hành) của cả hai máy; gói rời máy qua chip mạng và dây cáp hoặc sóng Wi-Fi</td></tr>
<tr><td>TLS</td><td>laptop ⇄ máy chủ</td><td>một thư viện mật mã bên trong ứng dụng (OpenSSL trong curl, BoringSSL trong Chrome) — thuần việc của CPU cộng một vòng đi-về</td></tr>
<tr><td>Máy chủ xử lý</td><td>máy chủ, cơ sở dữ liệu</td><td>các tiến trình nginx và ứng dụng; RAM và ổ đĩa của cơ sở dữ liệu</td></tr>
<tr><td>Hiển thị</td><td>laptop của bạn</td><td>bộ dàn trang và bộ máy JavaScript của trình duyệt</td></tr>
</tbody>
</table>
<p>Giữ cách chia này trong đầu. Khi có gì chậm hay hỏng, câu hỏi đầu tiên luôn là: <em>chặng nào, trên máy nào?</em></p>

<h3>curl -v: hành trình được kể lại</h3>
<p><code>curl -v</code> (verbose — chi tiết) in một dòng cho mỗi chặng. Ta lọc lấy những dòng đáng xem:</p>
${run('c00-internet', 'curl -sv -o /dev/null')}
<ul>
<li><code>Host cuongthai.com:443 was resolved</code> và dòng <code>IPv4</code> — DNS xong: địa chỉ là 160.187.1.208.</li>
<li><code>Trying 160.187.1.208:443...</code> — kết nối TCP đang được mở tới cổng 443.</li>
<li><code>TLS handshake, Client hello</code> / <code>Server hello</code> và <code>SSL connection using TLSv1.3</code> — TLS đã thống nhất; thuật toán mã hoá và trao đổi khoá được ghi rõ.</li>
<li><code>ALPN: server accepted h2</code> — ngay trong lúc bắt tay TLS, hai bên còn thống nhất nói HTTP/2.</li>
<li>Dòng bắt đầu bằng <code>&gt;</code> là curl gửi đi; dòng bắt đầu bằng <code>&lt;</code> là nhận về. <code>HTTP/2 200</code>, do nginx phục vụ.</li>
</ul>

<h3>curl -w: đồng hồ bấm giờ cho từng chặng</h3>
<p><code>curl -w</code> ("write out") in các biến sau khi truyền xong. Năm biến đánh dấu các chặng:</p>
${run('c00-internet', 'for i in 1 2 3')}
<p><strong>Mỗi giá trị là một thời điểm tính từ lúc bắt đầu — không phải độ dài của một chặng.</strong> Muốn có độ dài từng chặng, lấy giá trị đó trừ giá trị trước. Với lần chạy đầu:</p>
<table>
<thead><tr><th>Chặng</th><th>Phép tính</th><th>Độ dài</th></tr></thead>
<tbody>
<tr><td>DNS</td><td>time_namelookup</td><td>3,3 ms</td></tr>
<tr><td>Kết nối TCP</td><td>11,9 − 3,3</td><td>8,7 ms</td></tr>
<tr><td>Bắt tay TLS</td><td>26,0 − 11,9</td><td>14,1 ms</td></tr>
<tr><td>Request + máy chủ xử lý (tới byte đầu)</td><td>69,5 − 26,0</td><td>43,5 ms</td></tr>
<tr><td>Tải phần thân</td><td>102,7 − 69,5</td><td>33,2 ms</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de">
<p><strong>Đọc <code>time_appconnect</code> thành "TLS mất 26 ms".</strong> Sai — TLS <em>kết thúc</em> ở mốc 26 ms tính từ đầu, còn nó thật sự mất 14 ms. Bảng theo dõi và bài blog mắc lỗi này liên tục, khiến người ta đi tối ưu nhầm chặng. Luôn luôn trừ. (curl mô tả từng biến là "thời gian, tính bằng giây, từ lúc bắt đầu cho tới khi…".)</p>
</div>

<h3>Vòng đi-về là gì, và vì sao nó giải thích các con số</h3>
<p><strong>Thời gian đi-về (round trip time — RTT)</strong> là thời gian một gói đi tới máy kia và một câu trả lời quay về. <code>ping</code> đo đúng thứ đó:</p>
${run('c00-internet', 'ping -c 3')}
<p>Khoảng 7–10 ms tới máy chủ. Giờ nhìn lại các chặng: TCP mất 8,7 ms — <strong>một vòng đi-về</strong>, đúng cái giá của lượt trao đổi SYN → SYN-ACK (gói thứ ba, ACK, đi cùng request đầu tiên). TLS 1.3 mất 14,1 ms — một vòng đi-về cộng phần tính toán mật mã trên CPU hai bên. Máy chủ cần 43,5 ms để dựng trang (nginx đứng trước một ứng dụng Next.js), và trang 130 KB mất 33 ms để về tới.</p>
<p>So với cùng phép đo trong lab, nơi hai container nằm trên cùng một máy tính, không có DNS cũng không có TLS:</p>
${run('c00-url-lab', 'for i in 1 2 3')}
<p>Tổng chưa tới 2 ms, TCP chưa tới một mili giây. Lần đầu chậm hơn (9,6 ms) vì nginx và Node phải "khởi động máy" — thêm một lý do để luôn đo nhiều hơn một lần.</p>

<h3>Kết nối được dùng lại thì bỏ qua ba chặng</h3>
<p>Đưa curl hai URL cùng một host, nó dùng lại kết nối đã mở:</p>
${run('c00-internet', 'curl -s -o /dev/null -o /dev/null')}
<p>Với URL thứ hai, DNS, TCP và TLS đều bằng <strong>không</strong>. Đó là <strong>keep-alive</strong>: kết nối được giữ mở sau một câu trả lời để request sau dùng tiếp. Trong code của bạn nó xuất hiện dưới tên <em>connection pooling</em> (pool kết nối) — một HTTP client hoặc driver cơ sở dữ liệu giữ sẵn vài kết nối và dùng lại chúng. Quên điều này (tạo client mới cho mỗi lần gọi) âm thầm cộng một lần bắt tay TCP và TLS vào mọi request; Chương 4 đo chính xác nó tốn bao nhiêu.</p>

<h3>Khoảng cách thay đổi tất cả</h3>
<p>Giờ tới một trang ở xa hơn:</p>
${run('c00-internet', 'curl -s -o /dev/null -w', 1)}
<p>Trừ ra: DNS 45,9 ms (lần này chưa có trong cache), TCP 27,1 ms, TLS 59,2 ms, byte đầu tới sau thêm 54,0 ms. Mọi chặng mạng đều dài ra vì mỗi vòng đi-về dài hơn. CPU nhanh hơn chẳng giúp gì — ánh sáng trong cáp quang đi được khoảng 200 km mỗi mili giây, và đường đi chẳng bao giờ thẳng. Một mô hình thô để tính nhẩm:</p>
<p style="text-align:center"><strong>thời gian tới byte đầu ≈ DNS + 1 RTT (TCP) + 1 RTT (TLS 1.3) + 1 RTT + thời gian máy chủ</strong></p>
<p>Với vòng đi-về 8 ms, phần thiết lập khoảng 24 ms; với vòng đi-về 180 ms (con số điển hình giữa châu Á và Mỹ) thì đã hơn nửa giây trước khi máy chủ kịp bắt đầu. Các chương sau phần lớn là chuyện bớt vòng đi-về: dùng lại kết nối (Chương 4), nối lại phiên TLS (Chương 7), HTTP/3 (Chương 8) và phục vụ từ một CDN gần người dùng (Chương 8).</p>

<h3>Trình duyệt làm việc này hàng chục lần cho mỗi trang</h3>
<p>HTML của một trang hiện đại liệt kê hàng chục file khác. Request tới cùng host dùng lại kết nối đang mở — với HTTP/2 nhiều request dùng chung nó cùng một lúc. Request tới host khác (CDN cho ảnh, API ở tên miền con, font của bên thứ ba) lại trả DNS, TCP và TLS từ đầu. Mở DevTools của trình duyệt → tab Network → bấm vào một request bất kỳ → <strong>Timing</strong>: bạn thấy đúng các chặng như curl, cho từng request.</p>
${cauNoi('vi', { ...NWC, bai: 'nwc204-14-2-web-email-dns-dhcp-chia-se-tep', so: '14.2', ten: 'Web, email, DNS, DHCP và giao thức chia sẻ tệp', giong: 'HTTP và DNS là giao thức tầng ứng dụng', khac: 'NWC204 mô tả riêng từng giao thức, ở cuối môn', them: 'toàn bộ hành trình của một request theo đúng thứ tự, mỗi chặng bấm giờ trên trang thật, và cái bẫy cộng dồn của curl -w' })}

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> trưởng nhóm hỏi: "Ở chỗ em vào web thấy chậm — do mạng hay do máy chủ?" Trả lời bằng con số.</p>
<ol>
<li>Từ máy bạn chạy <code>curl -s -o /dev/null -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}\\n' https://cuongthai.com/</code> ba lần.</li>
<li>Với lần chạy ở giữa (trung vị), tính độ dài từng chặng (nhớ trừ!).</li>
<li>Chạy <code>ping -c 5 cuongthai.com</code>. TCP có ≈ 1 RTT không? TLS có ≈ 1 RTT cộng một chút không?</li>
<li>Lặp bước 1–2 với một trang đặt ở xa (ví dụ <code>https://example.com/</code>). Chặng nào tăng nhiều nhất?</li>
<li>Viết một câu: "Từ chỗ em, phần thiết lập tốn X ms và máy chủ Y ms, nên phần chậm là …".</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có bảng năm độ dài chặng cho mỗi trang và một câu chẩn đoán gọi tên được một chặng.</p>
<details><summary>Lời giải (với số của phòng lab)</summary>
<p>cuongthai.com: DNS 3,3, TCP 8,7, TLS 14,1, máy chủ 43,5, thân 33,2 ms — RTT 7–10 ms, nên TCP ≈ 1 RTT và TLS ≈ 1,5 RTT. Phần thiết lập mạng (26 ms) nhỏ hơn phần máy chủ (43,5 ms): "phần chậm là máy chủ dựng trang". example.com: DNS 45,9, TCP 27,1, TLS 59,2, máy chủ 54,0 ms — ở đây phần thiết lập (132 ms) áp đảo: "phần chậm là khoảng cách".</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['URL — scheme / host / path', 'https · cuongthai.com · / — nói chuyện kiểu gì, với ai, và xin cái gì.'],
    ['resolver (máy phân giải)', 'Máy chủ đổi tên thành địa chỉ giúp bạn và cache câu trả lời.'],
    ['handshake (bắt tay)', 'Các gói hai bên trao đổi trước dữ liệu thật: TCP để kết nối, TLS để thống nhất khoá.'],
    ['RTT — round trip time (thời gian đi-về)', 'Thời gian một gói đi tới nơi và một câu trả lời quay về.'],
    ['TTFB — time to first byte (thời gian tới byte đầu)', 'Từ lúc bắt đầu tới khi byte đầu tiên của câu trả lời về tới.'],
    ['keep-alive / connection pooling', 'Giữ kết nối mở và dùng lại, để request sau bỏ qua DNS, TCP và TLS.'],
    ['ALPN', 'Phần của bắt tay TLS nơi hai bên chọn phiên bản HTTP (h2 = HTTP/2).'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một lần tải trang = phân tích URL → DNS → TCP → TLS → request → máy chủ xử lý → tải về — rồi còn nhiều request nữa cho các file của trang.</li>
<li><code>curl -v</code> kể lại các chặng; <code>curl -w</code> bấm giờ chúng theo kiểu <strong>cộng dồn</strong> — trừ ra mới có độ dài.</li>
<li>TCP và TLS 1.3 mỗi cái tốn khoảng một vòng đi-về; khoảng cách nhân mọi chặng mạng lên, CPU không giúp được.</li>
<li>Kết nối được dùng lại thì DNS, TCP và TLS miễn phí — keep-alive và pool là cách tăng tốc rẻ nhất bạn có.</li>
</ul>
${L('https://everything.curl.dev/usingcurl/verbose/writeout.html', '⏱️', 'Everything curl — write out (-w)', 'Mọi biến thời gian và nó đo cái gì.', 'Mở')}
${L('https://github.com/alex/what-happens-when', '🧭', 'What happens when… (GitHub)', 'Câu trả lời dài kinh điển cho câu hỏi phỏng vấn, xuống tới tận bàn phím.', 'Mở')}
${L('https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview', '📘', 'MDN — Tổng quan về HTTP', 'Request, response và kết nối nhìn từ phía trình duyệt.', 'Mở')}
</div>
`,
};
