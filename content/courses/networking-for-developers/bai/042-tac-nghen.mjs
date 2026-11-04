/**
 * Chương 4 · 4.3 — Kiểm soát luồng và kiểm soát tắc nghẽn (slug khung netdev-4-3-tac-nghen).
 * Output thật: lab/out/c43-*.out.txt (dựng lại: bash lab/code/dung-output-ch4.sh).
 */
import { run, card, kv, cauNoi, cmd } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-04-3.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };
const W = { boLenh: true, cut: 132 };

export default {
  title: '4.3 — Flow control and congestion control (Reno, CUBIC, BBR)|||4.3 — Kiểm soát luồng và kiểm soát tắc nghẽn (Reno, CUBIC, BBR)',
  slug: 'netdev-4-3-tac-nghen',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Hai giới hạn khác nhau: cửa sổ nhận (kiểm soát luồng) và cửa sổ tắc nghẽn (kiểm soát tắc nghẽn); slow start làm cwnd gấp đôi mỗi RTT (đo bằng ss -ti: 10→133→1086) nên tải lớn tăng tốc dần; Reno/CUBIC phản ứng với mất gói còn BBR mô hình hoá băng thông+độ trễ; tích băng thông–độ trễ (BDP) và vì sao đường nhanh-xa cần cửa sổ lớn.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Flow control and congestion control (Reno, CUBIC, BBR)</h2>
<p class="lead">Start a big download and the speed climbs for a second or two before it levels off. That ramp is not your connection “warming up” in some vague way — it is TCP probing a path whose capacity it does not know, growing a <em>congestion window</em> round trip by round trip. This lesson separates the two limits on how fast TCP will send — one set by the receiver, one by the network — watches the congestion window grow in real <code>ss</code> output, and explains what Reno, CUBIC and BBR actually change.</p>

<h3>Two windows, two different jobs</h3>
<p>At any instant a TCP sender may have only so many bytes <strong>in flight</strong> (sent but not yet acknowledged). Two separate limits cap that number, and the smaller one wins:</p>
<ul>
<li>The <strong>receive window (rwnd)</strong> is set by the <em>receiver</em> and advertised in every ACK: “I have this much free buffer; don’t send more than this.” This is <strong>flow control</strong> — it stops a fast sender from drowning a slow reader.</li>
<li>The <strong>congestion window (cwnd)</strong> is kept by the <em>sender</em> and never travels on the wire. It is the sender’s guess at how much the <em>network path</em> can take without dropping. This is <strong>congestion control</strong>.</li>
</ul>
<p>Bytes in flight ≤ <code>min(rwnd, cwnd)</code>. Flow control answers “is the other program keeping up?”; congestion control answers “is the path keeping up?”. This lesson is mostly the second.</p>

<h3>Slow start: the congestion window doubles each round trip</h3>
<p>Run a bulk transfer across a bottleneck (20 Mbit/s, 40 ms) and sample the socket with <code>ss -ti</code> while it runs:</p>
${cmd('docker exec nfd-router tc qdisc add dev eth0 root netem rate 20mbit delay 40ms', 'docker exec nfd-client bash -c "iperf3 -c 10.10.2.10 -t 6 -i 1 & sleep 0.2; ss -tin dst 10.10.2.10"')}
${run('c43-win', 'sleep 0.2', 1, W)}
${run('c43-win', 'sleep 2.0', 1, W)}
<p>The congestion window — <code>cwnd</code>, counted in segments — grows from <strong>10 → 133 → 1086</strong> over a few round trips, roughly doubling each time. That is <strong>slow start</strong>: begin with a small window (10 segments by default) and double it every RTT, probing exponentially for capacity, until the first loss or the slow-start threshold (<code>ssthresh</code>, which appears in the later snapshot). The same growth, seen as throughput:</p>
${run('c43-win', 'wait', 1, { max: 11 })}
<p>The transfer starts at <strong>16.7 Mbit/s</strong> and climbs toward <strong>700 Mbit/s</strong> as the window opens. A <em>short</em> request — a small JSON API response — finishes while still in slow start and never reaches full speed. This is why ten small files can be slower than one big file of the same total size, and part of why a warm, reused connection (lesson 4.5) feels faster: it is already past slow start.</p>
${net('waterfall', 'far', 'en', 'A far server (high RTT) has to grow its window through several round trips before it reaches speed — walk the phases.', { tour: 'waterfall-phases' })}

<h3>Which algorithm, and what it changes</h3>
<p>The sender chooses a <strong>congestion-control algorithm</strong> that decides how cwnd grows and how it reacts to loss:</p>
${run('c43-cc', 'sysctl net.ipv4.tcp_congestion_control', 2)}
<ul>
<li><strong>Reno</strong> (1990): <em>additive increase, multiplicative decrease</em> (AIMD) — add one segment per RTT in congestion avoidance, and <em>halve</em> cwnd on loss. Simple, and the model everyone still reasons with.</li>
<li><strong>CUBIC</strong> (the Linux default): after a loss it climbs back toward the last good window along a cubic curve — aggressive far from the old ceiling, gentle near it. It fills big, far links much faster than Reno.</li>
<li><strong>BBR</strong> (Google, 2016): instead of treating loss as the signal, it <em>measures</em> the bottleneck bandwidth and the round-trip time and paces to them. On links that drop a few packets without being congested (some Wi-Fi, some mobile), loss-based algorithms back off needlessly; BBR does not.</li>
</ul>
<p>This lab kernel offers only <code>reno</code> and <code>cubic</code>; <code>BBR</code> must be loaded with <code>modprobe tcp_bbr</code> on a real Linux host, so we cannot run it here. On a long, lossy link the difference between CUBIC and BBR can be large — but on a short, fast link like this one, Reno and CUBIC finish within a couple of percent of each other, so measuring the difference needs a real WAN. <!-- CHAY-O-MAY: so sánh định lượng CUBIC↔BBR trên đường "long-fat lossy" cần nhân có module tcp_bbr + một đường WAN thật; lab Docker Desktop không có BBR và cầu nội bộ quá nhanh/ít mất để phân biệt (đã đo: reno 348 Mbit vs cubic 354 Mbit, chênh ~2%). --></p>

<div class="pitfall co-tieu-de">
<p><strong>“The server has 1 Gbps but the download is 5 MB/s” is often the window, not the bandwidth.</strong> Over a long path, throughput is capped by <code>window ÷ RTT</code>, not by the link rate. If the receive window is small (an app that reads slowly, or a tuned-down buffer) or the connection is still in slow start, you fill only a fraction of the pipe. Check <code>ss -ti</code>: a small, flat <code>cwnd</code> with a large <code>rtt</code> means you are window-limited, and more bandwidth will not help.</p>
</div>

<h3>AIMD and the sawtooth</h3>
<p>After slow start ends (at <code>ssthresh</code>), classic TCP enters <strong>congestion avoidance</strong>: it adds about one segment per RTT — a slow, linear climb. On loss it does a <strong>multiplicative decrease</strong> (Reno halves cwnd), then climbs again. Plotted over time this is a <strong>sawtooth</strong>: gentle climb, sharp cut, climb again. The beauty of AIMD is that many independent flows sharing one link, none of them coordinating, converge to a roughly fair split — because the flow using more loses more when a drop happens.</p>

<h3>The bandwidth-delay product: why the window must be big</h3>
<p>To keep a pipe full, the amount in flight must equal <strong>bandwidth × RTT</strong> — the <strong>bandwidth-delay product (BDP)</strong>. A 1 Gbit/s link with 80 ms RTT needs <strong>10 MB</strong> in flight. If the window is smaller than the BDP, the sender runs out of “allowance”, waits for ACKs, and the pipe sits half empty no matter the link rate. This is exactly why:</p>
<ul>
<li><strong>Window scaling</strong> was added (you saw <code>wscale 10</code> in lesson 4.2): the old 16-bit window maxed at 64 KB, far below the BDP of any fast, far link.</li>
<li>A server on another continent can feel slow at high bandwidth — the window must grow through slow start before it reaches the BDP.</li>
<li>Keeping connections <strong>warm</strong> and using fewer of them (lesson 4.5) matters: a reused connection is already at a large window.</li>
</ul>

<h3>Where this lives in the computer</h3>
<ul>
<li><strong>rwnd</strong> is the receiver’s free socket buffer, advertised in the <code>win</code> field of every ACK (multiplied by the window scale). A slow <code>read()</code> shrinks it; the sender sees a smaller window.</li>
<li><strong>cwnd / ssthresh</strong> are sender-side kernel state in the socket struct; <code>ss -ti</code> prints them, along with <code>pacing_rate</code> and <code>delivery_rate</code> estimates.</li>
<li>The <strong>algorithm</strong> is a kernel module (<code>tcp_cubic</code>, <code>tcp_bbr</code>, …). One is the host default (<code>net.ipv4.tcp_congestion_control</code>); an app can also pick per-socket with <code>setsockopt(TCP_CONGESTION)</code>.</li>
</ul>
${cauNoi('en', { ...NWC, bai: 'nwc204-13-1-tang-giao-van-va-so-hieu-cong', so: '13.1', ten: 'Layer 4 and port numbers: getting data to the right program', giong: 'the transport layer gives reliable delivery and controls the flow of data', khac: 'NWC204 introduces windowing at a conceptual level in the Cisco curriculum', them: 'the congestion window measured growing in ss -ti, slow start as a visible ramp in iperf3, the Reno/CUBIC/BBR difference, and the bandwidth-delay product that explains window scaling' })}

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> uploads to your storage bucket “only hit 40 Mbps” from a region far from the bucket, though the office link is 1 Gbps. Show, in the lab, that the limit is the window growing over a high-RTT path, not the bandwidth.</p>
<ol>
<li>With the base lab up, put a bottleneck on the router: <code>tc qdisc add dev eth0 root netem rate 50mbit delay 10ms</code>. Run <code>iperf3 -c 10.10.2.10 -t 6 -i 1</code> and note how fast it reaches the 50 Mbit cap.</li>
<li>Now raise the delay: <code>netem rate 50mbit delay 150ms</code>. Run the same. Watch how many seconds it takes to ramp, and sample <code>ss -tin dst 10.10.2.10</code> during it to see <code>cwnd</code> and <code>rtt</code>.</li>
<li>Read the algorithm with <code>sysctl net.ipv4.tcp_congestion_control</code> and the available ones with <code>...tcp_available_congestion_control</code>.</li>
<li>Write two sentences: why high RTT slows the ramp, and whether “more bandwidth” would fix the far-region upload.</li>
</ol>
<p><strong>Done when:</strong> your two runs show the same 50 Mbit cap but a much longer ramp at 150 ms, your <code>ss</code> snapshot shows cwnd climbing against a large rtt, and your sentences explain that throughput ≈ window ÷ RTT, so the fix is keeping connections warm / parallel uploads, not more bandwidth.</p>
<details><summary>Solution</summary>
<p>At 10 ms the transfer reaches the 50 Mbit cap almost immediately; at 150 ms it takes several seconds, because each doubling of cwnd takes a full (now long) round trip. <code>ss -ti</code> shows <code>cwnd</code> climbing with <code>rtt ≈ 150 ms</code>. Sentences: “High RTT slows the ramp because slow start doubles the window only once per round trip, so a far path needs many seconds to reach a window big enough to fill the pipe (throughput ≈ window ÷ RTT). More bandwidth will not help a far, short-lived upload — keeping the connection warm, uploading in parallel, or a nearer endpoint will.”</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['flow control (kiểm soát luồng)', 'The receiver’s limit (rwnd) so a fast sender does not overflow a slow reader.'],
  ['congestion control (kiểm soát tắc nghẽn)', 'The sender’s limit (cwnd) so it does not overload the network path.'],
  ['receive window / rwnd (cửa sổ nhận)', 'Free receiver buffer, advertised in every ACK × the window scale.'],
  ['congestion window / cwnd (cửa sổ tắc nghẽn)', 'Sender-side guess at path capacity; grown by slow start, cut on loss.'],
  ['slow start (khởi động chậm)', 'cwnd doubles each RTT from a small value until loss or ssthresh.'],
  ['AIMD (tăng cộng giảm nhân)', 'Add one per RTT, halve on loss — the sawtooth that shares a link fairly (Reno).'],
  ['CUBIC / BBR', 'Linux’s default (cubic recovery curve) and Google’s bandwidth-and-delay model.'],
  ['BDP — bandwidth-delay product (tích băng thông–độ trễ)', 'bandwidth × RTT: the bytes that must be in flight to fill a pipe.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Two windows cap bytes in flight: rwnd (flow control, receiver) and cwnd (congestion control, network); the smaller wins.</li>
<li>Slow start doubles cwnd each RTT — measured 10 → 133 → 1086 — so transfers ramp up and short requests finish before full speed.</li>
<li>Reno (AIMD) and CUBIC react to loss; BBR models bandwidth and delay. The lab kernel has reno/cubic only; BBR needs <code>modprobe tcp_bbr</code>.</li>
<li>Throughput over a long path ≈ window ÷ RTT; a window below the BDP leaves the pipe half empty regardless of bandwidth.</li>
<li>Read it all with <code>ss -ti</code>: cwnd, ssthresh, rtt, pacing_rate, and the algorithm name.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc5681', '📄', 'RFC 5681 — TCP Congestion Control', 'Slow start, congestion avoidance, fast retransmit and fast recovery.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc9438', '📄', 'RFC 9438 — CUBIC for TCP', 'The Linux default algorithm, specified.', 'Open')}
${L('https://queue.acm.org/detail.cfm?id=3022184', '📝', 'BBR: Congestion-Based Congestion Control (ACM Queue)', 'The Google paper on modelling bandwidth and RTT instead of reacting to loss.', 'Open')}
${L('https://hpbn.co/building-blocks-of-tcp/', '📘', 'High Performance Browser Networking — Building Blocks of TCP', 'Slow start, the congestion window and the bandwidth-delay product for developers.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Kiểm soát luồng và kiểm soát tắc nghẽn (Reno, CUBIC, BBR)</h2>
<p class="lead">Bắt đầu một lần tải lớn và tốc độ trèo lên một hai giây trước khi bằng phẳng. Cú trèo đó không phải kết nối “làm nóng” một cách mơ hồ — nó là TCP đang dò một đường mà nó không biết sức chứa, làm lớn một <em>cửa sổ tắc nghẽn</em> theo từng vòng khứ hồi. Bài này tách hai giới hạn cho tốc độ gửi của TCP — một do bên nhận đặt, một do mạng — xem cửa sổ tắc nghẽn lớn lên trong output <code>ss</code> thật, và giải thích Reno, CUBIC, BBR thật sự đổi điều gì.</p>

<h3>Hai cửa sổ, hai việc khác nhau</h3>
<p>Tại mỗi thời điểm một bên gửi TCP chỉ được để một lượng byte nhất định <strong>đang bay</strong> (đã gửi nhưng chưa được báo nhận). Hai giới hạn riêng chặn con số đó, và cái nhỏ hơn thắng:</p>
<ul>
<li><strong>Cửa sổ nhận (rwnd)</strong> do <em>bên nhận</em> đặt và công bố trong mỗi ACK: “tôi còn ngần này đệm trống; đừng gửi quá.” Đây là <strong>kiểm soát luồng (flow control)</strong> — nó ngăn một bên gửi nhanh làm tràn một bên đọc chậm.</li>
<li><strong>Cửa sổ tắc nghẽn (cwnd)</strong> do <em>bên gửi</em> giữ và không bao giờ đi trên dây. Nó là phỏng đoán của bên gửi về lượng mà <em>đường mạng</em> chịu được mà không vứt gói. Đây là <strong>kiểm soát tắc nghẽn (congestion control)</strong>.</li>
</ul>
<p>Byte đang bay ≤ <code>min(rwnd, cwnd)</code>. Kiểm soát luồng trả lời “chương trình bên kia có theo kịp không?”; kiểm soát tắc nghẽn trả lời “đường đi có theo kịp không?”. Bài này chủ yếu là cái thứ hai.</p>

<h3>Khởi động chậm: cửa sổ tắc nghẽn gấp đôi mỗi vòng khứ hồi</h3>
<p>Chạy một lần truyền lớn qua một nút cổ chai (20 Mbit/s, 40 ms) và chụp socket bằng <code>ss -ti</code> trong lúc nó chạy:</p>
${cmd('docker exec nfd-router tc qdisc add dev eth0 root netem rate 20mbit delay 40ms', 'docker exec nfd-client bash -c "iperf3 -c 10.10.2.10 -t 6 -i 1 & sleep 0.2; ss -tin dst 10.10.2.10"')}
${run('c43-win', 'sleep 0.2', 1, W)}
${run('c43-win', 'sleep 2.0', 1, W)}
<p>Cửa sổ tắc nghẽn — <code>cwnd</code>, đếm theo đoạn — lớn từ <strong>10 → 133 → 1086</strong> qua vài vòng khứ hồi, gần như gấp đôi mỗi lần. Đó là <strong>khởi động chậm (slow start)</strong>: bắt đầu bằng một cửa sổ nhỏ (mặc định 10 đoạn) và gấp đôi mỗi RTT, dò theo hàm mũ để tìm sức chứa, tới lần mất gói đầu tiên hoặc tới ngưỡng khởi động chậm (<code>ssthresh</code>, hiện ở lần chụp sau). Cùng sự tăng đó, nhìn dưới dạng thông lượng:</p>
${run('c43-win', 'wait', 1, { max: 11 })}
<p>Lần truyền bắt đầu ở <strong>16,7 Mbit/s</strong> và trèo về <strong>700 Mbit/s</strong> khi cửa sổ mở. Một yêu cầu <em>ngắn</em> — một câu trả lời API JSON nhỏ — kết thúc khi vẫn đang khởi động chậm và không bao giờ đạt tốc độ tối đa. Đây là lý do mười tệp nhỏ có thể chậm hơn một tệp lớn cùng tổng cỡ, và một phần vì sao một kết nối ấm, dùng lại (bài 4.5) thấy nhanh hơn: nó đã qua khởi động chậm.</p>
${net('waterfall', 'far', 'vi', 'Một máy chủ xa (RTT cao) phải làm lớn cửa sổ qua vài vòng khứ hồi trước khi đạt tốc độ — đi qua các pha.', { tour: 'waterfall-phases' })}

<h3>Thuật toán nào, và nó đổi gì</h3>
<p>Bên gửi chọn một <strong>thuật toán kiểm soát tắc nghẽn</strong> quyết định cwnd lớn thế nào và phản ứng với mất gói ra sao:</p>
${run('c43-cc', 'sysctl net.ipv4.tcp_congestion_control', 2)}
<ul>
<li><strong>Reno</strong> (1990): <em>tăng cộng, giảm nhân</em> (AIMD) — cộng một đoạn mỗi RTT khi tránh tắc nghẽn, và <em>giảm nửa</em> cwnd khi mất. Đơn giản, và là mô hình ai cũng còn dùng để suy nghĩ.</li>
<li><strong>CUBIC</strong> (mặc định của Linux): sau một lần mất nó trèo về cửa sổ tốt gần nhất theo một đường cong bậc ba — mạnh khi còn xa trần cũ, nhẹ khi gần nó. Nó lấp đường lớn, xa nhanh hơn Reno nhiều.</li>
<li><strong>BBR</strong> (Google, 2016): thay vì coi mất gói là tín hiệu, nó <em>đo</em> băng thông nút cổ chai và thời gian khứ hồi rồi gửi theo nhịp đó. Trên đường vứt vài gói mà không nghẽn (một số Wi-Fi, một số di động), thuật toán theo mất gói lùi vô ích; BBR thì không.</li>
</ul>
<p>Nhân lab này chỉ có <code>reno</code> và <code>cubic</code>; <code>BBR</code> phải nạp bằng <code>modprobe tcp_bbr</code> trên một máy chủ Linux thật, nên ta không chạy được ở đây. Trên một đường dài, hay mất gói, khác biệt giữa CUBIC và BBR có thể lớn — nhưng trên một đường ngắn, nhanh như cái này, Reno và CUBIC kết thúc chênh nhau vài phần trăm, nên đo khác biệt cần một WAN thật. <!-- CHAY-O-MAY: so sánh định lượng CUBIC↔BBR trên đường "long-fat lossy" cần nhân có module tcp_bbr + đường WAN thật; lab Docker Desktop không có BBR và cầu nội bộ quá nhanh/ít mất để phân biệt. --></p>

<div class="pitfall co-tieu-de">
<p><strong>“Máy chủ có 1 Gbps mà tải chỉ 5 MB/s” thường là cửa sổ, không phải băng thông.</strong> Trên một đường dài, thông lượng bị chặn bởi <code>cửa sổ ÷ RTT</code>, không phải tốc độ đường. Nếu cửa sổ nhận nhỏ (một app đọc chậm, hoặc đệm bị chỉnh nhỏ) hoặc kết nối vẫn đang khởi động chậm, bạn chỉ lấp một phần ống. Kiểm <code>ss -ti</code>: một <code>cwnd</code> nhỏ, bằng phẳng với <code>rtt</code> lớn nghĩa là bạn bị giới hạn bởi cửa sổ, và thêm băng thông sẽ không giúp.</p>
</div>

<h3>AIMD và cái răng cưa</h3>
<p>Sau khi khởi động chậm kết thúc (ở <code>ssthresh</code>), TCP cổ điển vào <strong>tránh tắc nghẽn (congestion avoidance)</strong>: cộng khoảng một đoạn mỗi RTT — một cú trèo chậm, tuyến tính. Khi mất gói nó làm một <strong>giảm nhân</strong> (Reno giảm nửa cwnd), rồi lại trèo. Vẽ theo thời gian đây là một <strong>răng cưa</strong>: trèo nhẹ, cắt mạnh, lại trèo. Vẻ đẹp của AIMD là nhiều luồng độc lập chia chung một đường, không cái nào phối hợp, hội tụ về một cách chia tạm công bằng — vì luồng dùng nhiều hơn mất nhiều hơn khi có một cú vứt gói.</p>

<h3>Tích băng thông–độ trễ: vì sao cửa sổ phải lớn</h3>
<p>Để giữ một ống đầy, lượng đang bay phải bằng <strong>băng thông × RTT</strong> — <strong>tích băng thông–độ trễ (BDP)</strong>. Một đường 1 Gbit/s với 80 ms RTT cần <strong>10 MB</strong> đang bay. Nếu cửa sổ nhỏ hơn BDP, bên gửi hết “hạn mức”, chờ ACK, và ống nằm vơi một nửa bất kể tốc độ đường. Đây đúng là lý do:</p>
<ul>
<li><strong>Co giãn cửa sổ (window scaling)</strong> được thêm (bạn thấy <code>wscale 10</code> ở bài 4.2): cửa sổ 16-bit cũ tối đa 64 KB, thấp hơn nhiều BDP của bất kỳ đường nhanh, xa nào.</li>
<li>Một máy chủ ở châu lục khác có thể thấy chậm ở băng thông cao — cửa sổ phải lớn qua khởi động chậm trước khi đạt BDP.</li>
<li>Giữ kết nối <strong>ấm</strong> và dùng ít kết nối hơn (bài 4.5) quan trọng: một kết nối dùng lại đã ở một cửa sổ lớn.</li>
</ul>

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li><strong>rwnd</strong> là đệm socket trống của bên nhận, công bố trong trường <code>win</code> của mỗi ACK (nhân với hệ số co giãn). Một <code>read()</code> chậm làm nó nhỏ lại; bên gửi thấy một cửa sổ nhỏ hơn.</li>
<li><strong>cwnd / ssthresh</strong> là trạng thái phía gửi trong cấu trúc socket của nhân; <code>ss -ti</code> in chúng, cùng ước lượng <code>pacing_rate</code> và <code>delivery_rate</code>.</li>
<li><strong>Thuật toán</strong> là một module nhân (<code>tcp_cubic</code>, <code>tcp_bbr</code>, …). Một cái là mặc định của máy (<code>net.ipv4.tcp_congestion_control</code>); một app cũng chọn được theo socket bằng <code>setsockopt(TCP_CONGESTION)</code>.</li>
</ul>
${cauNoi('vi', { ...NWC, bai: 'nwc204-13-1-tang-giao-van-va-so-hieu-cong', so: '13.1', ten: 'Tầng 4 và số hiệu cổng: đưa dữ liệu tới đúng chương trình', giong: 'tầng giao vận cho giao hàng đáng tin và điều khiển luồng dữ liệu', khac: 'NWC204 giới thiệu cửa sổ ở mức khái niệm theo giáo trình Cisco', them: 'cửa sổ tắc nghẽn đo được lớn lên trong ss -ti, khởi động chậm là một cú trèo thấy được trong iperf3, khác biệt Reno/CUBIC/BBR, và tích băng thông–độ trễ giải thích co giãn cửa sổ' })}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> upload lên bucket lưu trữ “chỉ đạt 40 Mbps” từ một vùng xa bucket, dù đường văn phòng là 1 Gbps. Hãy chứng minh trong lab rằng giới hạn là cửa sổ lớn lên trên một đường RTT cao, không phải băng thông.</p>
<ol>
<li>Lab cơ bản đang chạy, đặt một nút cổ chai trên router: <code>tc qdisc add dev eth0 root netem rate 50mbit delay 10ms</code>. Chạy <code>iperf3 -c 10.10.2.10 -t 6 -i 1</code> và ghi nó đạt trần 50 Mbit nhanh thế nào.</li>
<li>Giờ nâng trễ: <code>netem rate 50mbit delay 150ms</code>. Chạy lại. Xem mất mấy giây để trèo, và chụp <code>ss -tin dst 10.10.2.10</code> trong lúc đó để thấy <code>cwnd</code> và <code>rtt</code>.</li>
<li>Đọc thuật toán bằng <code>sysctl net.ipv4.tcp_congestion_control</code> và các cái sẵn có bằng <code>...tcp_available_congestion_control</code>.</li>
<li>Viết hai câu: vì sao RTT cao làm chậm cú trèo, và “thêm băng thông” có sửa được upload vùng xa không.</li>
</ol>
<p><strong>Đạt khi:</strong> hai lần chạy cho thấy cùng trần 50 Mbit nhưng cú trèo lâu hơn nhiều ở 150 ms, lần chụp <code>ss</code> cho thấy cwnd trèo so với rtt lớn, và hai câu giải thích thông lượng ≈ cửa sổ ÷ RTT, nên cách sửa là giữ kết nối ấm / upload song song, không phải thêm băng thông.</p>
<details><summary>Lời giải</summary>
<p>Ở 10 ms lần truyền đạt trần 50 Mbit gần như ngay; ở 150 ms mất vài giây, vì mỗi lần gấp đôi cwnd tốn trọn một vòng (giờ dài). <code>ss -ti</code> cho thấy <code>cwnd</code> trèo với <code>rtt ≈ 150 ms</code>. Hai câu: “RTT cao làm chậm cú trèo vì khởi động chậm chỉ gấp đôi cửa sổ một lần mỗi vòng khứ hồi, nên một đường xa cần nhiều giây để đạt cửa sổ đủ lớn lấp ống (thông lượng ≈ cửa sổ ÷ RTT). Thêm băng thông không giúp một upload xa, ngắn — giữ kết nối ấm, upload song song, hoặc một điểm cuối gần hơn mới giúp.”</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['flow control (kiểm soát luồng)', 'Giới hạn của bên nhận (rwnd) để bên gửi nhanh không làm tràn bên đọc chậm.'],
  ['congestion control (kiểm soát tắc nghẽn)', 'Giới hạn của bên gửi (cwnd) để không làm quá tải đường mạng.'],
  ['receive window / rwnd (cửa sổ nhận)', 'Đệm trống của bên nhận, công bố trong mỗi ACK × hệ số co giãn.'],
  ['congestion window / cwnd (cửa sổ tắc nghẽn)', 'Phỏng đoán phía gửi về sức chứa đường; lớn bởi khởi động chậm, cắt khi mất.'],
  ['slow start (khởi động chậm)', 'cwnd gấp đôi mỗi RTT từ một giá trị nhỏ tới khi mất gói hoặc tới ssthresh.'],
  ['AIMD (tăng cộng giảm nhân)', 'Cộng một mỗi RTT, giảm nửa khi mất — cái răng cưa chia đường công bằng (Reno).'],
  ['CUBIC / BBR', 'Mặc định của Linux (đường cong phục hồi bậc ba) và mô hình băng thông–độ trễ của Google.'],
  ['BDP — bandwidth-delay product (tích băng thông–độ trễ)', 'băng thông × RTT: số byte phải đang bay để lấp một ống.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hai cửa sổ chặn byte đang bay: rwnd (kiểm soát luồng, bên nhận) và cwnd (kiểm soát tắc nghẽn, mạng); cái nhỏ hơn thắng.</li>
<li>Khởi động chậm gấp đôi cwnd mỗi RTT — đo được 10 → 133 → 1086 — nên lần truyền trèo dần và yêu cầu ngắn kết thúc trước tốc độ tối đa.</li>
<li>Reno (AIMD) và CUBIC phản ứng với mất gói; BBR mô hình hoá băng thông và độ trễ. Nhân lab chỉ có reno/cubic; BBR cần <code>modprobe tcp_bbr</code>.</li>
<li>Thông lượng trên đường dài ≈ cửa sổ ÷ RTT; cửa sổ dưới BDP để ống vơi một nửa bất kể băng thông.</li>
<li>Đọc tất cả bằng <code>ss -ti</code>: cwnd, ssthresh, rtt, pacing_rate, và tên thuật toán.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc5681', '📄', 'RFC 5681 — Kiểm soát tắc nghẽn TCP', 'Khởi động chậm, tránh tắc nghẽn, truyền lại nhanh và phục hồi nhanh.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc9438', '📄', 'RFC 9438 — CUBIC cho TCP', 'Thuật toán mặc định của Linux, đặc tả.', 'Mở')}
${L('https://queue.acm.org/detail.cfm?id=3022184', '📝', 'BBR: Congestion-Based Congestion Control (ACM Queue)', 'Bài của Google về mô hình băng thông và RTT thay vì phản ứng với mất gói.', 'Mở')}
${L('https://hpbn.co/building-blocks-of-tcp/', '📘', 'High Performance Browser Networking — Nền tảng của TCP', 'Khởi động chậm, cửa sổ tắc nghẽn và tích băng thông–độ trễ cho lập trình viên.', 'Mở')}
</div>
`,
};
