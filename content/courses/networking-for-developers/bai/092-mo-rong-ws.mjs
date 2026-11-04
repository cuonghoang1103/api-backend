/**
 * Chương 9 · 9.3 — Mở rộng kết nối sống lâu (slug khung netdev-9-3-mo-rong-ws).
 * Output thật: lab/out/c93-*.out.txt (dựng lại: bash lab/code/dung-output-ch9.sh) — trần fd, đếm kết nối, lùi dần + nhiễu.
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import G from '../giang/nfd-09-3.mjs';

const L = card;
const IO = { mon: 'Socket.IO', khoa: 'socket-io' };

export default {
  title: '9.3 — Scaling long-lived connections|||9.3 — Mở rộng kết nối sống lâu',
  slug: 'netdev-9-3-mo-rong-ws',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Kết nối sống lâu (WebSocket/SSE) đổi luật mở rộng: mỗi kết nối là một file descriptor (trần ulimit -n), nên đo bằng SỐ KẾT NỐI ĐỒNG THỜI chứ không phải req/s; sticky session ghim một socket có trạng thái vào một server (và chia sẻ trạng thái qua Redis để server nào cũng chạy); nối lại CÓ LÙI DẦN + nhiễu để tránh bầy đàn sau khởi động lại; và deploy bằng drain + cuốn để chỉ là một lần nối lại ngắn. Đo thật fd, đếm kết nối, lịch backoff.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Scaling long-lived connections</h2>
<p class="lead">Everything you know about scaling HTTP quietly stops applying when the connections stay open. A web server that handles 10,000 requests per second may fall over at 10,000 <em>concurrent connections</em>, because those are different resources entirely. A real-time service is sized by how many sockets it can hold open, routed so each stateful connection reaches the same place, and built so a restart is a blip rather than an outage. This lesson covers the four things that break a naive WebSocket/SSE service at scale — and measures the first one on the lab.</p>

<h3>Every connection is a file descriptor</h3>
<p>A normal HTTP request opens a socket and frees it in milliseconds. A WebSocket or SSE connection holds its socket for hours — and every open socket is a <strong>file descriptor</strong>, of which a process has a hard cap:</p>
${run('c93-scale', 'ulimit', 1)}
<p>Reach that cap and new connections fail with <em>too many open files</em> — not a CPU error, a bookkeeping one. The consequence reframes capacity: 50,000 idle WebSockets cost almost no CPU but a lot of RAM and 50,000 file descriptors. You plan capacity as <strong>fd limit × memory per connection × number of processes</strong>, and you raise <code>ulimit -n</code> (and the systemd/container limit) deliberately.</p>

<h3>Count what actually matters</h3>
<p>The metric to watch is not requests per second but <strong>concurrent open connections</strong>. Open five SSE streams and count the live sockets:</p>
${run('c93-scale', 'for i', 2)}
<p>Five clients, five sockets in <code>ESTABLISHED</code>, five file descriptors on the server. Multiply by your real audience and you have your sizing. This single number — concurrent connections — is the one to graph and alert on for any real-time system.</p>

<h3>Sticky sessions: state lives on one server</h3>
<p>A long-lived connection carries <strong>state</strong> — who you are, which room you joined. A load balancer must deliver every frame of that connection to the <strong>same</strong> backend (a <strong>sticky session</strong>), or the server on the other end has no context for your messages. An L4 load balancer is naturally sticky per connection (one TCP flow → one backend), but stickiness can break across a <em>reconnect</em>, where the new socket may land on a different server. The robust answer is not to lean on stickiness but to <strong>share the state</strong>: keep room membership and messages in something like Redis pub/sub, so any server can serve any client and a reconnect anywhere just works.</p>
${cauNoi('en', { ...IO, bai: 'io-5-1-vi-sao', so: '5.1', ten: 'Why a Redis adapter: cross-worker broadcast', giong: 'sharing real-time state across processes/servers so any one can serve any client', khac: 'the Socket.IO course wires the Redis adapter and its four cross-worker methods concretely', them: 'why you need it at the connection level — file-descriptor limits, sticky sessions and reconnects measured here' })}

<h3>Reconnect with backoff and jitter</h3>
<p>When a server restarts, <strong>all</strong> of its clients drop simultaneously. If every one of them reconnects immediately, that is a <strong>thundering herd</strong> — thousands of connections arriving in the same millisecond — which can knock the freshly-restarted server straight back down. The fix is to reconnect on an <strong>exponential backoff with jitter</strong>:</p>
${run('c93-scale', 'node', 1)}
<p>The base delay doubles (1s, 2s, 4s…) up to a cap, and a random <strong>jitter</strong> is added so clients do not all return on the same tick. Without jitter, 10,000 clients that dropped together would reconnect together; with it, they spread smoothly across the window. SSE's <code>EventSource</code> does basic backoff for you; for WebSocket you implement it in the client.</p>

<div class="pitfall co-tieu-de">
<p><strong>A deploy drops every long-lived connection at once — design for the reconnect, or it is an outage.</strong> Restarting the process to ship new code severs every WebSocket and SSE simultaneously. If clients reconnect instantly and all at once, your deploy becomes a self-inflicted thundering herd. Make it graceful: <strong>drain</strong> (stop accepting new connections, let in-flight work finish), <strong>roll</strong> instances one at a time, give clients <strong>backoff + jitter</strong> so they trickle back, and keep room state in <strong>Redis</strong> so a reconnect resumes instead of starting over. Done right, a deploy is a brief reconnect nobody notices; done wrong, every deploy is a small outage.</p>
</div>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a WebSocket service handles 500 req/s fine in tests but falls over in production at a few thousand users. Explain and plan the fix.</p>
<ol>
<li>On the lab, read <code>ulimit -n</code>, then open 5 SSE connections and count the <code>ESTABLISHED</code> sockets. Explain why concurrent connections, not req/s, is the limit here.</li>
<li>Run the backoff schedule and explain why the jitter column matters after a restart.</li>
<li>Sketch how room state in Redis removes the need for strict stickiness.</li>
<li>Write a 3-step graceful-deploy plan (drain, roll, reconnect).</li>
</ol>
<p><strong>Done when:</strong> you can say the service is bounded by file descriptors/RAM per connection (so raise <code>ulimit</code> and add processes), that backoff + jitter prevents a reconnect storm, that shared Redis state makes any server able to serve any client, and that a graceful deploy drains and rolls so clients reconnect rather than error.</p>
<details><summary>Solution</summary>
<p>Each user holds an open socket = one fd + RAM, so the ceiling is <code>ulimit -n</code> × memory, not req/s; raise the limit and run more processes. After a restart all clients drop together, so without jitter they reconnect in one spike (thundering herd) — exponential backoff + jitter spreads them. Keeping room membership/messages in Redis means any server can serve any client, so stickiness is a convenience, not a requirement. A graceful deploy drains (stop new, finish in-flight), rolls instances one at a time, and relies on client reconnect + Redis state, so it is a brief reconnect, not an outage.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['File descriptor', 'A per-process handle for an open socket; capped by ulimit -n.'],
  ['Concurrent connections', 'The real scaling metric for real-time, not requests/second.'],
  ['Sticky session', 'Routing every frame of one connection to the same backend.'],
  ['Exponential backoff', 'Reconnect delays that double (1s, 2s, 4s…) up to a cap.'],
  ['Jitter', 'Random delay added so clients do not all reconnect on the same tick.'],
  ['Thundering herd', 'A reconnect storm after everyone dropped at once.'],
  ['Drain', 'Stop accepting new connections and let in-flight ones finish before stopping.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Every open connection is a <strong>file descriptor</strong>; a process has a hard cap (<code>ulimit -n</code>).</li>
<li>Scale by <strong>concurrent connections</strong>, not requests/s: fd limits × RAM × processes.</li>
<li>Long-lived connections carry state → <strong>sticky sessions</strong>, and share room state (Redis) so any server works.</li>
<li>Reconnect with <strong>exponential backoff + jitter</strong> to avoid a thundering herd after a restart.</li>
<li>Deploy by <strong>draining</strong> and rolling; a deploy should be a brief reconnect, not an outage.</li>
</ul>
${L('https://hpbn.co/websocket/', '📘', 'High Performance Browser Networking — WebSocket', 'Keeping connections efficient, and the cost of many open sockets.', 'Open')}
${L('https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/', '📘', 'AWS — Exponential backoff and jitter', 'Why jitter matters, with the math behind the reconnect storm.', 'Open')}
${L('https://man7.org/linux/man-pages/man2/getrlimit.2.html', '📄', 'man 2 getrlimit — RLIMIT_NOFILE', 'The open-file-descriptor limit behind ulimit -n, from the kernel side.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Mở rộng kết nối sống lâu</h2>
<p class="lead">Mọi thứ bạn biết về mở rộng HTTP âm thầm thôi áp dụng khi kết nối cứ mở. Một web server xử lý 10.000 yêu cầu mỗi giây có thể sập ở 10.000 <em>kết nối đồng thời</em>, vì đó là những tài nguyên hoàn toàn khác. Một dịch vụ thời gian thực được đo theo bao nhiêu socket nó giữ mở, định tuyến sao cho mỗi kết nối có trạng thái tới cùng một chỗ, và dựng sao cho một lần khởi động lại là một cái chớp chứ không phải một sự cố. Bài này nói về bốn thứ phá một dịch vụ WebSocket/SSE ngây thơ ở quy mô — và đo cái đầu tiên trên lab.</p>

<h3>Mỗi kết nối là một file descriptor</h3>
<p>Một yêu cầu HTTP bình thường mở một socket và giải phóng nó trong mili-giây. Một kết nối WebSocket hay SSE giữ socket của nó hàng giờ — và mỗi socket mở là một <strong>file descriptor</strong>, mà một tiến trình có một trần cứng:</p>
${run('c93-scale', 'ulimit', 1)}
<p>Đụng trần đó và kết nối mới hỏng với <em>quá nhiều tệp mở</em> — không phải lỗi CPU, mà lỗi sổ sách. Hệ quả định hình lại dung lượng: 50.000 WebSocket im tốn gần như không CPU nhưng nhiều RAM và 50.000 file descriptor. Bạn hoạch định dung lượng là <strong>trần fd × bộ nhớ mỗi kết nối × số tiến trình</strong>, và bạn nâng <code>ulimit -n</code> (cùng giới hạn systemd/container) có chủ đích.</p>

<h3>Đếm thứ thật sự quan trọng</h3>
<p>Chỉ số để canh không phải yêu cầu mỗi giây mà <strong>kết nối mở đồng thời</strong>. Mở năm dòng SSE và đếm các socket sống:</p>
${run('c93-scale', 'for i', 2)}
<p>Năm client, năm socket ở <code>ESTABLISHED</code>, năm file descriptor trên server. Nhân với lượng khán giả thật của bạn và bạn có kích cỡ. Con số duy nhất này — kết nối đồng thời — là cái để vẽ biểu đồ và báo động cho bất kỳ hệ thống thời gian thực nào.</p>

<h3>Sticky session: trạng thái sống trên một server</h3>
<p>Một kết nối sống lâu mang <strong>trạng thái</strong> — bạn là ai, bạn vào phòng nào. Một cân bằng tải phải giao mọi khung của kết nối đó tới <strong>cùng</strong> một backend (một <strong>sticky session</strong>), không thì server ở đầu kia không có bối cảnh cho tin nhắn của bạn. Một cân bằng tải L4 tự nhiên dính theo kết nối (một luồng TCP → một backend), nhưng tính dính có thể vỡ qua một <em>lần nối lại</em>, nơi socket mới có thể rơi vào một server khác. Câu trả lời chắc chắn không phải dựa vào tính dính mà <strong>chia sẻ trạng thái</strong>: giữ thành viên phòng và tin nhắn trong thứ như Redis pub/sub, để bất kỳ server nào phục vụ được bất kỳ client nào và một lần nối lại ở đâu cũng chạy.</p>
${cauNoi('vi', { ...IO, bai: 'io-5-1-vi-sao', so: '5.1', ten: 'Vì sao Redis adapter: broadcast qua worker', giong: 'chia sẻ trạng thái thời gian thực qua các tiến trình/server để cái nào cũng phục vụ được client nào', khac: 'khoá Socket.IO cắm Redis adapter và bốn method xuyên worker của nó cụ thể', them: 'vì sao bạn cần nó ở mức kết nối — trần file descriptor, sticky session và các lần nối lại đo ở đây' })}

<h3>Nối lại với lùi dần và nhiễu</h3>
<p>Khi một server khởi động lại, <strong>tất cả</strong> client của nó rớt đồng thời. Nếu mỗi cái nối lại ngay, đó là một <strong>bầy đàn</strong> — hàng nghìn kết nối đến trong cùng một mili-giây — có thể quật server vừa khởi động lại thẳng xuống lần nữa. Cách sửa là nối lại theo <strong>lùi dần cấp số nhân có nhiễu</strong>:</p>
${run('c93-scale', 'node', 1)}
<p>Độ trễ nền gấp đôi (1s, 2s, 4s…) tới một trần, và một <strong>nhiễu</strong> ngẫu nhiên được thêm để client không cùng về một nhịp. Không có nhiễu, 10.000 client rớt cùng nhau sẽ nối lại cùng nhau; có nó, chúng rải mượt qua cửa sổ. <code>EventSource</code> của SSE làm lùi dần cơ bản cho bạn; với WebSocket bạn hiện thực nó ở client.</p>

<div class="pitfall co-tieu-de">
<p><strong>Một deploy rớt mọi kết nối sống lâu cùng lúc — thiết kế cho lần nối lại, không thì nó là một sự cố.</strong> Khởi động lại tiến trình để ship mã mới cắt đứt mọi WebSocket và SSE đồng thời. Nếu client nối lại tức thì và cùng một lúc, deploy của bạn thành một bầy đàn tự gây. Làm nó êm: <strong>drain</strong> (ngừng nhận kết nối mới, để việc đang bay hoàn tất), <strong>cuốn</strong> các thực thể lần lượt, cho client <strong>backoff + nhiễu</strong> để chúng về nhỏ giọt, và giữ trạng thái phòng trong <strong>Redis</strong> để một lần nối lại tiếp chứ không bắt đầu lại. Làm đúng, một deploy là một lần nối lại ngắn không ai để ý; làm sai, mỗi deploy là một sự cố nhỏ.</p>
</div>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một dịch vụ WebSocket xử lý 500 req/s ổn trong test nhưng sập trên production ở vài nghìn người dùng. Giải thích và lập kế hoạch sửa.</p>
<ol>
<li>Trên lab, đọc <code>ulimit -n</code>, rồi mở 5 kết nối SSE và đếm các socket <code>ESTABLISHED</code>. Giải thích vì sao kết nối đồng thời, không phải req/s, là giới hạn ở đây.</li>
<li>Chạy lịch backoff và giải thích vì sao cột nhiễu quan trọng sau một lần khởi động lại.</li>
<li>Phác cách trạng thái phòng trong Redis gỡ nhu cầu dính nghiêm ngặt.</li>
<li>Viết một kế hoạch deploy êm 3 bước (drain, cuốn, nối lại).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được dịch vụ bị chặn bởi file descriptor/RAM mỗi kết nối (nên nâng <code>ulimit</code> và thêm tiến trình), rằng backoff + nhiễu ngăn một cơn bão nối lại, rằng trạng thái Redis dùng chung làm server nào cũng phục vụ được client nào, và rằng một deploy êm drain và cuốn để client nối lại chứ không báo lỗi.</p>
<details><summary>Lời giải</summary>
<p>Mỗi người dùng giữ một socket mở = một fd + RAM, nên trần là <code>ulimit -n</code> × bộ nhớ, không phải req/s; nâng giới hạn và chạy nhiều tiến trình hơn. Sau một lần khởi động lại tất cả client rớt cùng nhau, nên không có nhiễu chúng nối lại trong một đỉnh (bầy đàn) — lùi dần cấp số nhân + nhiễu rải chúng. Giữ thành viên/tin nhắn phòng trong Redis nghĩa là server nào cũng phục vụ được client nào, nên tính dính là một tiện lợi, không phải yêu cầu. Một deploy êm drain (ngừng mới, xong việc đang bay), cuốn thực thể lần lượt, và dựa vào client nối lại + trạng thái Redis, nên nó là một lần nối lại ngắn, không phải một sự cố.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['File descriptor', 'Một tay cầm mỗi-tiến-trình cho một socket mở; chặn bởi ulimit -n.'],
  ['Kết nối đồng thời', 'Chỉ số mở rộng thật cho thời gian thực, không phải yêu cầu/giây.'],
  ['Sticky session', 'Định tuyến mọi khung của một kết nối tới cùng một backend.'],
  ['Lùi dần cấp số nhân', 'Độ trễ nối lại gấp đôi (1s, 2s, 4s…) tới một trần.'],
  ['Nhiễu (jitter)', 'Độ trễ ngẫu nhiên thêm để client không cùng nối lại một nhịp.'],
  ['Bầy đàn (thundering herd)', 'Một cơn bão nối lại sau khi tất cả rớt cùng lúc.'],
  ['Drain (rút êm)', 'Ngừng nhận kết nối mới và để các kết nối đang bay xong trước khi dừng.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mỗi kết nối mở là một <strong>file descriptor</strong>; một tiến trình có một trần cứng (<code>ulimit -n</code>).</li>
<li>Mở rộng theo <strong>kết nối đồng thời</strong>, không phải req/s: trần fd × RAM × tiến trình.</li>
<li>Kết nối sống lâu mang trạng thái → <strong>sticky session</strong>, và chia sẻ trạng thái phòng (Redis) để server nào cũng chạy.</li>
<li>Nối lại với <strong>lùi dần cấp số nhân + nhiễu</strong> để tránh một bầy đàn sau một lần khởi động lại.</li>
<li>Deploy bằng <strong>drain</strong> và cuốn; một deploy nên là một lần nối lại ngắn, không phải một sự cố.</li>
</ul>
${L('https://hpbn.co/websocket/', '📘', 'High Performance Browser Networking — WebSocket', 'Giữ kết nối hiệu quả, và chi phí của nhiều socket mở.', 'Mở')}
${L('https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/', '📘', 'AWS — Lùi dần cấp số nhân và nhiễu', 'Vì sao nhiễu quan trọng, kèm toán học sau cơn bão nối lại.', 'Mở')}
${L('https://man7.org/linux/man-pages/man2/getrlimit.2.html', '📄', 'man 2 getrlimit — RLIMIT_NOFILE', 'Giới hạn file descriptor mở sau ulimit -n, từ phía nhân.', 'Mở')}
</div>
`,
};
