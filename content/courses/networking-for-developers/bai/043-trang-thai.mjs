/**
 * Chương 4 · 4.4 — Trạng thái kết nối, TIME_WAIT và cạn cổng (slug khung netdev-4-4-trang-thai).
 * Output thật: lab/out/c44-*.out.txt (dựng lại: bash lab/code/dung-output-ch4.sh).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-04-4.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };

export default {
  title: '4.4 — Connection states, TIME_WAIT and port exhaustion|||4.4 — Trạng thái kết nối, TIME_WAIT và cạn cổng',
  slug: 'netdev-4-4-trang-thai',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Máy trạng thái TCP đọc bằng ss -tan/ss -s; TIME_WAIT rơi vào bên đóng trước và vì sao nó tồn tại (2×MSL, chống gói cũ lạc); dựng lại cạn cổng tạm (ép 3 cổng, cái thứ 4 exit 45) và cách sửa đúng là keep-alive/pool chứ không phải nới cổng; hàng đợi accept (backlog, Send-Q, somaxconn) âm thầm vứt kết nối khi tải cao.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Connection states, TIME_WAIT and port exhaustion</h2>
<p class="lead">When a service “gets stuck under load”, the answer is almost always visible in one command: <code>ss</code>. A TCP connection is a small state machine, and every socket on the machine is sitting in exactly one of its states. This lesson reads those states, explains the most misunderstood one — TIME_WAIT — reproduces the classic “we ran out of ports” failure, and shows the accept queue that quietly drops connections when your app cannot keep up.</p>

<h3>A connection is a state machine</h3>
<p>From the kernel’s point of view a connection moves through states: <code>LISTEN</code> (a server waiting), <code>SYN-SENT</code>/<code>SYN-RECV</code> (mid-handshake), <code>ESTABLISHED</code> (open), <code>FIN-WAIT</code>/<code>CLOSE-WAIT</code> (one side closing), and <code>TIME-WAIT</code> (the side that closed first, waiting before the ports are free). <code>ss -tan</code> prints the current state of every TCP socket. Hold two connections open, close a few, and look:</p>
${run('c44-states', "ss -tan", 1, { max: 9 })}
<p>Two <code>ESTAB</code>, several <code>TIME-WAIT</code>. For a quick census across the whole machine, <code>ss -s</code>:</p>
${run('c44-states', 'ss -s', 1, { max: 3 })}
<p>That one line — how many established, closed, orphaned, timewait — is the first thing to run when someone says “the server feels stuck.” It turns a vague complaint into a number.</p>
${net('socket', 'ephemeral', 'en', 'Watch the kernel pick an ephemeral source port for each new connection — and run out when they are not reused.', { tour: 'socket-bind' })}

<h3>Whoever closes first gets TIME_WAIT</h3>
<p>Make 20 short requests that the client opens and closes, then count:</p>
${run('c44-timewait', 'echo "TIME-WAIT', 1)}
<p>The <strong>client</strong> is holding the TIME-WAIT sockets, because the client did the <strong>active close</strong> each time. If the server had closed instead (for example by sending <code>Connection: close</code>), they would pile up on the <em>server</em>. This matters in practice: a reverse proxy or API gateway that closes upstream connections accumulates TIME-WAIT on itself, not on the backend.</p>

<h3>Why TIME_WAIT is there</h3>
<p>TIME_WAIT is the most “let me just disable this” state, and that instinct is wrong. After a connection closes, a packet from it — delayed, duplicated by a flaky router — might still be wandering the network. If the exact same 4-tuple (source IP:port, destination IP:port) were reused immediately, that stray packet could be accepted as data on the <em>new</em> connection. So the active closer holds the 4-tuple for <strong>2 × MSL</strong> (maximum segment lifetime), about 60 s on Linux, until any such packet must have died. Two knobs bound it:</p>
${run('c44-timewait', 'sysctl net.ipv4.tcp_fin_timeout', 1)}
${run('c44-timewait', 'cat /proc/sys/net/ipv4/tcp_max_tw_buckets', 1)}
<p><code>tcp_max_tw_buckets</code> caps how many TIME_WAIT sockets the kernel keeps (32768 here); beyond that it drops them, with a kernel log line. TIME_WAIT is a feature — the bug it prevents is a real, data-corrupting one.</p>

<h3>Port exhaustion: the classic client-side outage</h3>
<p>A client opening a connection picks a free <strong>ephemeral port</strong> as its source. There is a finite range (usually ~32768–60999). If you churn short connections to one destination and leave each in TIME_WAIT, you run out. Force the range down to three ports to see it in seconds:</p>
${run('c44-exhaust', 'for i', 1)}
<p>The first three connections get ports 50010–50012; the <strong>fourth cannot bind one</strong> and <code>curl</code> fails with <strong>exit 45</strong> (“couldn’t bind local address”). In production this shows up as <code>EADDRNOTAVAIL</code> / “cannot assign requested address” on a service that makes thousands of short HTTP calls — a payment gateway, a webhook fan-out — to a single upstream.</p>

<div class="pitfall co-tieu-de">
<p><strong>“Cannot assign requested address” is a port problem, not a DNS or firewall problem.</strong> It means the client ran out of ephemeral ports to a given destination — almost always because it opens a fresh connection per request instead of pooling. The fix is a keep-alive connection pool in the HTTP client (lesson 4.5), optionally with a wider <code>ip_local_port_range</code>. Shrinking <code>tcp_fin_timeout</code> or enabling <code>tcp_tw_reuse</code> for outbound connections buys headroom, but pooling removes the problem.</p>
</div>

<h3>The accept queue: where finished handshakes wait</h3>
<p>A listening socket does not hand every connection to your code instantly. The kernel completes the handshake and puts the connection in an <strong>accept queue</strong>; your app drains it by calling <code>accept()</code>. <code>ss -ltn</code> shows the queue on each listener:</p>
${run('c44-backlog', 'ss -ltn', 1, { max: 4 })}
<p>For a <code>LISTEN</code> socket, <strong>Send-Q</strong> is the queue’s capacity (nginx’s 511 here) and <strong>Recv-Q</strong> is how many are waiting right now. The real cap is <code>min(listen backlog, net.core.somaxconn)</code>:</p>
${run('c44-backlog', 'sysctl net.core.somaxconn', 1)}
<p>Under a burst, the kernel keeps completing handshakes, but if your app is too slow to <code>accept()</code> them the queue fills — and then new SYNs are dropped, so clients time out even though the server process is alive and the port is open. Raising <code>somaxconn</code> alone does nothing if the app still passes a small <code>listen(backlog)</code>; both must be raised, and <code>accept()</code> must be fast. The half-open (SYN) queue is guarded separately by <code>tcp_max_syn_backlog</code> and SYN cookies, which blunt SYN-flood attacks.</p>

<div class="pitfall co-tieu-de">
<p><strong>“The server is up but connections time out under load” is often the accept queue, not CPU.</strong> If <code>ss -ltn</code> shows <code>Recv-Q</code> sitting at the <code>Send-Q</code> cap, your app is accepting too slowly or the backlog is too small. Check <code>nstat</code> for <code>ListenOverflows</code> / <code>ListenDrops</code>; raise both <code>somaxconn</code> and the framework’s backlog, and look at why <code>accept()</code> is slow (a blocked event loop, a thread-pool starved by slow handlers).</p>
</div>

<h3>Where this lives in the computer</h3>
<ul>
<li>The <strong>state</strong> is a field in the kernel’s socket struct; <code>ss -tan</code> and <code>/proc/net/tcp</code> expose it. No userspace library tracks it — the kernel owns the state machine.</li>
<li><strong>TIME_WAIT</strong> is the active closer holding the 4-tuple for ~60 s; bounded by <code>tcp_fin_timeout</code> and <code>tcp_max_tw_buckets</code>.</li>
<li><strong>Ephemeral ports</strong> come from <code>ip_local_port_range</code>; a connection is unique by its 4-tuple, so you only exhaust ports <em>per destination</em>.</li>
<li>The <strong>accept queue</strong> is per listening socket, capped by <code>min(backlog, somaxconn)</code>; the SYN queue is separate.</li>
</ul>
${cauNoi('en', { ...NWC, bai: 'nwc204-13-1-tang-giao-van-va-so-hieu-cong', so: '13.1', ten: 'Layer 4 and port numbers: getting data to the right program', giong: 'ports identify which program a connection belongs to; the 4-tuple makes each connection unique', khac: 'NWC204 covers port numbers and well-known ports from the curriculum', them: 'the live TCP state machine in ss, why TIME_WAIT exists, a reproduced port-exhaustion outage, and the accept queue that drops connections under load' })}

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a batch job that calls an internal API “thousands of times a minute” starts failing with <em>cannot assign requested address</em> after a few minutes, then recovers. Reproduce the mechanism and write the fix.</p>
<ol>
<li>From <code>nfd-client</code>, run a loop of 20 short <code>curl http://10.10.2.10/</code> (new connection each), then <code>ss -tan '( dport = :80 )' | grep -c TIME-WAIT</code>. Watch TIME-WAIT accumulate.</li>
<li>Force exhaustion directly: <code>for i in 1 2 3 4; do curl --local-port 50010-50012 http://10.10.2.10/; done</code> and read the exit code of the 4th.</li>
<li>Now fix it: make the same 4 requests with one <code>curl http://10.10.2.10/ http://10.10.2.10/ http://10.10.2.10/ http://10.10.2.10/</code> (keep-alive) and confirm it uses one connection (<code>-w '%{num_connects}'</code>).</li>
<li>Write the diagnosis and the one-line fix for the batch job.</li>
</ol>
<p><strong>Done when:</strong> you have shown TIME-WAIT building up, reproduced exit 45 on the 4th forced-port request, and shown keep-alive doing all four requests on one connection — and your fix names a pooled, keep-alive client (not a timer tweak).</p>
<details><summary>Solution</summary>
<p>The loop leaves ~20 TIME-WAIT sockets on the client. Forcing three ports, the 4th <code>curl</code> exits 45 (“couldn’t bind local address”) because all three are in TIME_WAIT. With keep-alive, <code>num_connects=1</code> then <code>0,0,0</code> — one connection for all four. Fix: “The job opens a new connection per call and churns ephemeral ports until they are all in TIME_WAIT (EADDRNOTAVAIL), then recovers as they expire. Use a keep-alive connection pool in the HTTP client so the calls reuse a handful of connections; port/timer tuning is only a stopgap.”</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['ESTABLISHED (đã thiết lập)', 'An open connection where data can flow in both directions.'],
  ['TIME_WAIT (chờ tàn)', 'The ~60 s wait on the side that closed first, so stray old packets cannot be mistaken for new data.'],
  ['active close (đóng chủ động)', 'The side that sends the first FIN — the one that ends up in TIME_WAIT.'],
  ['ephemeral port (cổng tạm)', 'A short-lived source port the client picks from ~32768–60999 for each outbound connection.'],
  ['4-tuple (bộ bốn)', 'src IP:port + dst IP:port — what makes each connection unique; ports exhaust per destination.'],
  ['port exhaustion (cạn cổng)', 'Running out of ephemeral ports to a destination; seen as EADDRNOTAVAIL.'],
  ['accept queue / backlog (hàng đợi accept)', 'Finished handshakes waiting for accept(); capped by min(backlog, somaxconn).'],
  ['somaxconn', 'The kernel ceiling on the accept queue; caps the app’s listen backlog.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Every socket is in one TCP state; read them with <code>ss -tan</code> and census the machine with <code>ss -s</code>.</li>
<li>TIME_WAIT lands on the active closer and exists so stray old packets cannot poison a reused 4-tuple; bounded by <code>tcp_fin_timeout</code> and <code>tcp_max_tw_buckets</code>.</li>
<li>Port exhaustion hits a client that churns short connections — the 4th of 3 forced ports failed with exit 45.</li>
<li>The fix is keep-alive / pooling; widening ports or shrinking timers only buys headroom.</li>
<li>The accept queue (Send-Q, capped by <code>somaxconn</code>) silently drops connections when the app accepts too slowly.</li>
</ul>
${L('https://man7.org/linux/man-pages/man8/ss.8.html', '📄', 'man 8 ss', 'Every state and filter you will use to read TCP sockets.', 'Open')}
${L('https://vincent.bernat.ch/en/blog/2014-tcp-time-wait-state-linux', '📝', 'Coping with the TCP TIME-WAIT state on Linux', 'Why TIME_WAIT exists and what the knobs really do — before you disable it.', 'Open')}
${L('https://blog.cloudflare.com/syn-packet-handling-in-the-wild/', '📝', 'Cloudflare — SYN packet handling in the wild', 'The SYN and accept queues, overflows, and SYN cookies, measured.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc9293', '📄', 'RFC 9293 — TCP', 'The state diagram these states come from.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Trạng thái kết nối, TIME_WAIT và cạn cổng</h2>
<p class="lead">Khi một dịch vụ “kẹt khi tải cao”, câu trả lời gần như luôn hiện ra trong một lệnh: <code>ss</code>. Một kết nối TCP là một máy trạng thái nhỏ, và mọi socket trên máy đang nằm ở đúng một trong các trạng thái của nó. Bài này đọc các trạng thái đó, giải thích cái bị hiểu lầm nhiều nhất — TIME_WAIT — dựng lại kiểu hỏng kinh điển “hết cổng”, và chỉ ra hàng đợi accept âm thầm vứt kết nối khi ứng dụng của bạn không theo kịp.</p>

<h3>Một kết nối là một máy trạng thái</h3>
<p>Từ góc nhìn của nhân, một kết nối đi qua các trạng thái: <code>LISTEN</code> (một máy chủ đang chờ), <code>SYN-SENT</code>/<code>SYN-RECV</code> (giữa cú bắt tay), <code>ESTABLISHED</code> (mở), <code>FIN-WAIT</code>/<code>CLOSE-WAIT</code> (một bên đang đóng), và <code>TIME-WAIT</code> (bên đóng trước, chờ trước khi các cổng được giải phóng). <code>ss -tan</code> in trạng thái hiện tại của mọi socket TCP. Giữ hai kết nối mở, đóng vài cái, rồi nhìn:</p>
${run('c44-states', "ss -tan", 1, { max: 9 })}
<p>Hai <code>ESTAB</code>, vài <code>TIME-WAIT</code>. Để điểm danh nhanh toàn máy, <code>ss -s</code>:</p>
${run('c44-states', 'ss -s', 1, { max: 3 })}
<p>Một dòng đó — bao nhiêu established, closed, orphaned, timewait — là thứ đầu tiên nên chạy khi ai đó nói “máy chủ thấy kẹt.” Nó biến một lời than mơ hồ thành một con số.</p>
${net('socket', 'ephemeral', 'vi', 'Xem nhân chọn một cổng nguồn tạm cho mỗi kết nối mới — và hết khi chúng không được dùng lại.', { tour: 'socket-bind' })}

<h3>Ai đóng trước thì ôm TIME_WAIT</h3>
<p>Làm 20 yêu cầu ngắn mà client mở rồi đóng, rồi đếm:</p>
${run('c44-timewait', 'echo "TIME-WAIT', 1)}
<p><strong>Client</strong> đang giữ các socket TIME-WAIT, vì client làm <strong>cú đóng chủ động</strong> mỗi lần. Nếu máy chủ đóng thay (ví dụ gửi <code>Connection: close</code>), chúng sẽ dồn ở <em>máy chủ</em>. Điều này quan trọng thực tế: một reverse proxy hay API gateway đóng kết nối upstream sẽ tích TIME-WAIT trên chính nó, không phải trên backend.</p>

<h3>Vì sao TIME_WAIT có mặt</h3>
<p>TIME_WAIT là trạng thái bị “để tôi tắt nó đi” nhiều nhất, và bản năng đó sai. Sau khi một kết nối đóng, một gói của nó — bị trễ, bị một router chập chờn nhân đôi — có thể vẫn đang lang thang trong mạng. Nếu đúng cùng bộ-4 (IP:cổng nguồn, IP:cổng đích) được dùng lại ngay, gói lạc đó có thể bị nhận làm dữ liệu trên kết nối <em>mới</em>. Nên bên đóng chủ động giữ bộ-4 trong <strong>2 × MSL</strong> (maximum segment lifetime — thời gian sống tối đa của một đoạn), khoảng 60 s trên Linux, tới khi gói như vậy chắc chắn đã chết. Hai núm chặn nó:</p>
${run('c44-timewait', 'sysctl net.ipv4.tcp_fin_timeout', 1)}
${run('c44-timewait', 'cat /proc/sys/net/ipv4/tcp_max_tw_buckets', 1)}
<p><code>tcp_max_tw_buckets</code> chặn số socket TIME_WAIT nhân giữ (32768 ở đây); quá đó nó vứt bớt, kèm một dòng log của nhân. TIME_WAIT là một tính năng — lỗi nó ngăn là một lỗi thật, làm hỏng dữ liệu.</p>

<h3>Cạn cổng: sự cố kinh điển phía client</h3>
<p>Một client mở kết nối chọn một <strong>cổng tạm (ephemeral port)</strong> trống làm cổng nguồn. Dải này hữu hạn (thường ~32768–60999). Nếu bạn xoay vòng kết nối ngắn tới một đích và để mỗi cái trong TIME_WAIT, bạn sẽ hết. Ép dải xuống ba cổng để thấy nó trong vài giây:</p>
${run('c44-exhaust', 'for i', 1)}
<p>Ba kết nối đầu lấy cổng 50010–50012; <strong>cái thứ tư không bind được</strong> và <code>curl</code> hỏng với <strong>exit 45</strong> (“couldn’t bind local address”). Trong sản xuất điều này hiện ra là <code>EADDRNOTAVAIL</code> / “cannot assign requested address” trên một dịch vụ gọi hàng nghìn lần HTTP ngắn — một cổng thanh toán, một đợt bắn webhook — tới một upstream duy nhất.</p>

<div class="pitfall co-tieu-de">
<p><strong>“Cannot assign requested address” là vấn đề cổng, không phải DNS hay tường lửa.</strong> Nó nghĩa là client hết cổng tạm tới một đích — gần như luôn vì nó mở kết nối mới mỗi yêu cầu thay vì pool. Cách sửa là một pool kết nối keep-alive trong HTTP client (bài 4.5), có thể kèm nới <code>ip_local_port_range</code>. Giảm <code>tcp_fin_timeout</code> hay bật <code>tcp_tw_reuse</code> cho kết nối đi ra mua thêm khoảng trống, nhưng pool mới gỡ bỏ vấn đề.</p>
</div>

<h3>Hàng đợi accept: nơi cú bắt tay xong chờ</h3>
<p>Một socket đang nghe không trao mọi kết nối cho code của bạn tức thì. Nhân hoàn tất cú bắt tay và đặt kết nối vào một <strong>hàng đợi accept</strong>; ứng dụng của bạn rút nó ra bằng cách gọi <code>accept()</code>. <code>ss -ltn</code> cho thấy hàng đợi trên mỗi listener:</p>
${run('c44-backlog', 'ss -ltn', 1, { max: 4 })}
<p>Với một socket <code>LISTEN</code>, <strong>Send-Q</strong> là sức chứa hàng đợi (511 của nginx ở đây) và <strong>Recv-Q</strong> là bao nhiêu đang chờ ngay lúc này. Giới hạn thật là <code>min(backlog của listen, net.core.somaxconn)</code>:</p>
${run('c44-backlog', 'sysctl net.core.somaxconn', 1)}
<p>Trong một đợt dồn, nhân cứ hoàn tất các cú bắt tay, nhưng nếu ứng dụng của bạn quá chậm để <code>accept()</code> thì hàng đợi đầy — và rồi các SYN mới bị vứt, nên client hết giờ dù tiến trình máy chủ còn sống và cổng còn mở. Nâng một mình <code>somaxconn</code> chẳng làm gì nếu ứng dụng vẫn truyền một <code>listen(backlog)</code> nhỏ; phải nâng cả hai, và <code>accept()</code> phải nhanh. Hàng đợi nửa-mở (SYN) được bảo vệ riêng bằng <code>tcp_max_syn_backlog</code> và SYN cookies, thứ làm nhụt tấn công SYN flood.</p>

<div class="pitfall co-tieu-de">
<p><strong>“Máy chủ còn chạy mà kết nối hết giờ khi tải cao” thường là hàng đợi accept, không phải CPU.</strong> Nếu <code>ss -ltn</code> cho thấy <code>Recv-Q</code> ngồi ở trần <code>Send-Q</code>, ứng dụng của bạn accept quá chậm hoặc backlog quá nhỏ. Kiểm <code>nstat</code> tìm <code>ListenOverflows</code> / <code>ListenDrops</code>; nâng cả <code>somaxconn</code> lẫn backlog của framework, và xem vì sao <code>accept()</code> chậm (vòng lặp sự kiện bị chặn, một thread-pool cạn vì các handler chậm).</p>
</div>

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li><strong>Trạng thái</strong> là một trường trong cấu trúc socket của nhân; <code>ss -tan</code> và <code>/proc/net/tcp</code> phơi nó ra. Không thư viện userspace nào theo dõi nó — nhân sở hữu máy trạng thái.</li>
<li><strong>TIME_WAIT</strong> là bên đóng chủ động giữ bộ-4 ~60 s; bị chặn bởi <code>tcp_fin_timeout</code> và <code>tcp_max_tw_buckets</code>.</li>
<li><strong>Cổng tạm</strong> đến từ <code>ip_local_port_range</code>; một kết nối là duy nhất theo bộ-4, nên bạn chỉ cạn cổng <em>theo từng đích</em>.</li>
<li><strong>Hàng đợi accept</strong> là theo từng socket nghe, bị chặn bởi <code>min(backlog, somaxconn)</code>; hàng đợi SYN là riêng.</li>
</ul>
${cauNoi('vi', { ...NWC, bai: 'nwc204-13-1-tang-giao-van-va-so-hieu-cong', so: '13.1', ten: 'Tầng 4 và số hiệu cổng: đưa dữ liệu tới đúng chương trình', giong: 'cổng xác định kết nối thuộc chương trình nào; bộ-4 làm mỗi kết nối là duy nhất', khac: 'NWC204 dạy số hiệu cổng và các cổng nổi tiếng theo giáo trình', them: 'máy trạng thái TCP sống trong ss, vì sao TIME_WAIT tồn tại, một sự cố cạn cổng dựng lại, và hàng đợi accept vứt kết nối khi tải cao' })}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một việc chạy theo lô gọi một API nội bộ “hàng nghìn lần một phút” bắt đầu hỏng với <em>cannot assign requested address</em> sau vài phút, rồi tự khỏi. Hãy dựng lại cơ chế và viết cách sửa.</p>
<ol>
<li>Từ <code>nfd-client</code>, chạy một vòng 20 <code>curl http://10.10.2.10/</code> ngắn (kết nối mới mỗi lần), rồi <code>ss -tan '( dport = :80 )' | grep -c TIME-WAIT</code>. Xem TIME-WAIT dồn lên.</li>
<li>Ép cạn trực tiếp: <code>for i in 1 2 3 4; do curl --local-port 50010-50012 http://10.10.2.10/; done</code> và đọc mã thoát của cái thứ 4.</li>
<li>Giờ sửa: làm cùng 4 yêu cầu bằng một <code>curl http://10.10.2.10/ http://10.10.2.10/ http://10.10.2.10/ http://10.10.2.10/</code> (keep-alive) và xác nhận nó dùng một kết nối (<code>-w '%{num_connects}'</code>).</li>
<li>Viết chẩn đoán và cách sửa một dòng cho việc chạy lô.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã cho thấy TIME-WAIT dồn lên, dựng lại exit 45 ở yêu cầu ép-cổng thứ 4, và cho thấy keep-alive làm cả bốn yêu cầu trên một kết nối — và cách sửa của bạn gọi tên một client có pool, keep-alive (không phải chỉnh bộ đếm).</p>
<details><summary>Lời giải</summary>
<p>Vòng lặp để lại ~20 socket TIME-WAIT trên client. Ép ba cổng, <code>curl</code> thứ 4 exit 45 (“couldn’t bind local address”) vì cả ba đang trong TIME_WAIT. Với keep-alive, <code>num_connects=1</code> rồi <code>0,0,0</code> — một kết nối cho cả bốn. Sửa: “Việc này mở kết nối mới mỗi lần gọi và xoay vòng cổng tạm tới khi tất cả vào TIME_WAIT (EADDRNOTAVAIL), rồi tự khỏi khi chúng hết hạn. Dùng một pool kết nối keep-alive trong HTTP client để các lời gọi dùng lại vài kết nối; chỉnh cổng/bộ đếm chỉ là vá tạm.”</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['ESTABLISHED (đã thiết lập)', 'Một kết nối mở nơi dữ liệu chảy được cả hai chiều.'],
  ['TIME_WAIT (chờ tàn)', 'Khoảng chờ ~60 s ở bên đóng trước, để gói cũ lạc không bị nhầm thành dữ liệu mới.'],
  ['active close (đóng chủ động)', 'Bên gửi FIN đầu tiên — bên rốt cuộc nằm trong TIME_WAIT.'],
  ['ephemeral port (cổng tạm)', 'Một cổng nguồn sống ngắn client chọn từ ~32768–60999 cho mỗi kết nối đi ra.'],
  ['4-tuple (bộ bốn)', 'IP:cổng nguồn + IP:cổng đích — thứ làm mỗi kết nối là duy nhất; cổng cạn theo từng đích.'],
  ['port exhaustion (cạn cổng)', 'Hết cổng tạm tới một đích; hiện ra là EADDRNOTAVAIL.'],
  ['accept queue / backlog (hàng đợi accept)', 'Các cú bắt tay xong chờ accept(); bị chặn bởi min(backlog, somaxconn).'],
  ['somaxconn', 'Trần của nhân cho hàng đợi accept; chặn backlog của listen trong ứng dụng.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mỗi socket ở một trạng thái TCP; đọc bằng <code>ss -tan</code> và điểm danh máy bằng <code>ss -s</code>.</li>
<li>TIME_WAIT rơi vào bên đóng chủ động và tồn tại để gói cũ lạc không đầu độc một bộ-4 dùng lại; bị chặn bởi <code>tcp_fin_timeout</code> và <code>tcp_max_tw_buckets</code>.</li>
<li>Cạn cổng đánh vào một client xoay vòng kết nối ngắn — cái thứ 4 trong 3 cổng ép hỏng với exit 45.</li>
<li>Cách sửa là keep-alive / pool; nới cổng hay giảm bộ đếm chỉ mua thêm khoảng trống.</li>
<li>Hàng đợi accept (Send-Q, bị chặn bởi <code>somaxconn</code>) âm thầm vứt kết nối khi ứng dụng accept quá chậm.</li>
</ul>
${L('https://man7.org/linux/man-pages/man8/ss.8.html', '📄', 'man 8 ss', 'Mọi trạng thái và bộ lọc bạn sẽ dùng để đọc socket TCP.', 'Mở')}
${L('https://vincent.bernat.ch/en/blog/2014-tcp-time-wait-state-linux', '📝', 'Sống chung với trạng thái TCP TIME-WAIT trên Linux', 'Vì sao TIME_WAIT tồn tại và các núm thật sự làm gì — trước khi bạn tắt nó.', 'Mở')}
${L('https://blog.cloudflare.com/syn-packet-handling-in-the-wild/', '📝', 'Cloudflare — Xử lý gói SYN ngoài đời', 'Hàng đợi SYN và accept, tràn hàng, và SYN cookies, đo thật.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc9293', '📄', 'RFC 9293 — TCP', 'Sơ đồ trạng thái các trạng thái này đến từ đó.', 'Mở')}
</div>
`,
};
