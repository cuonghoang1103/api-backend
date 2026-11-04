/**
 * Chương 4 · 4.2 — Độ tin cậy: số thứ tự, ACK và truyền lại (slug khung netdev-4-2-tin-cay).
 * Output thật: lab/out/c42-*.out.txt (dựng lại: bash lab/code/dung-output-ch4.sh).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-04-2.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };

export default {
  title: '4.2 — Reliability: sequence numbers, ACKs and retransmission|||4.2 — Độ tin cậy: số thứ tự, ACK và truyền lại',
  slug: 'netdev-4-2-tin-cay',
  type: 'LESSON',
  isFreePreview: true,
  description: 'TCP biến một mạng hay mất gói thành luồng byte có thứ tự, đáng tin: cắt luồng thành segment và đánh số từng byte, ACK tích luỹ gọi tên byte còn thiếu, truyền lại khi mất (đo dưới 3% mất gói bằng iperf3 Retr), dup ACK + truyền lại nhanh + SACK (đọc bằng tshark), và nghẽn đầu hàng ở tầng TCP — cái mà QUIC/HTTP3 sinh ra để sửa.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Reliability: sequence numbers, ACKs and retransmission</h2>
<p class="lead">The network underneath you is not reliable: packets are dropped, reordered and sometimes duplicated. Yet when your code reads from a socket, the bytes arrive in order and complete, every time. That illusion is built by TCP out of three simple parts — numbering every byte, acknowledging what arrived, and resending what did not. This lesson reads those parts off a real transfer, then runs one under 3% packet loss to watch TCP repair it while your application notices nothing but a little less speed.</p>

<h3>A stream cut into numbered segments</h3>
<p>Your program calls <code>write()</code> with a blob of bytes. TCP does not send it as one lump; it cuts it into <strong>segments</strong>, each at most one <strong>MSS</strong> (maximum segment size, 1448 bytes on this link after the TCP/IP headers). Every byte of the stream has a <strong>sequence number</strong>, and the receiver sends back an <strong>ACK</strong> naming the next byte it expects. Watch one download of <code>/big</code>:</p>
${run('c42-seq', 'tcpdump', 1, { max: 8, cut: 120 })}
<ul>
<li>The <code>GET /big</code> is 77 bytes: the client’s sequence goes <code>…836 → …913</code>, and the server acks <code>…913</code> — “I have your request, send more”.</li>
<li>The server’s first data segment is <strong>2896 bytes</strong> (two MSS coalesced): its sequence runs <code>…390 → …286</code>, a jump of exactly 2896. A sequence number counts <em>bytes</em>, not packets.</li>
<li><code>wscale 10</code> in the handshake is <strong>window scaling</strong>: the 16-bit window field is shifted left 10 bits, so the advertised window can be far larger than the old 64 KB limit (lesson 4.3).</li>
</ul>
${net('encap', 'mtu', 'en', 'Watch a payload too big for one segment get split by MSS — the segmentation this lesson reads on the wire.', { tour: 'encap-mtu' })}

<h3>The ACK is cumulative</h3>
<p>One ACK number covers <em>everything</em> before it. If the receiver holds bytes 1–2896 it acks <code>2897</code>. If a later chunk arrives but there is a gap in the middle, the ACK stays frozen at <code>2897</code> — even though more data is sitting in the receiver’s buffer — because the ACK can only name the first <em>missing</em> byte. When the gap is finally filled, the ACK leaps forward past everything now contiguous. That frozen ACK is not a bug; it is the signal that drives both fast retransmit and (its dark side) head-of-line blocking below.</p>

<h3>Loss happens, and TCP just fixes it</h3>
<p>Add 3% packet loss to the router and push a bulk transfer with <code>iperf3</code>. The <code>Retr</code> column counts retransmitted segments:</p>
${run('c42-loss', 'iperf3', 1, { max: 9 })}
<p>Some segments are lost and resent (<code>Retr</code> is non-zero in the first second), yet the transfer finishes correct and keeps a high rate. Your application never sees a missing or corrupt byte — it only sees the transfer take slightly longer. <strong>TCP trades speed for correctness, silently.</strong> That is the deal: you cannot ask TCP to “just give me what arrived”; if you want that, you want UDP (Chapter 5).</p>

<h3>Recovering without waiting: duplicate ACKs, fast retransmit, SACK</h3>
<p>Read the same lossy transfer with <code>tshark</code>, which labels what TCP is doing:</p>
${run('c42-sack', 'tshark', 1, { max: 9, cut: 120 })}
<ul>
<li>When a segment is lost, every later segment that arrives makes the receiver repeat the <strong>same</strong> ACK — a <strong>duplicate ACK</strong> (<code>TCP Dup ACK</code>). It is the receiver shouting “I’m still stuck at this byte”.</li>
<li>The <code>SLE</code>/<code>SRE</code> fields are <strong>selective ACK (SACK)</strong> edges: “I am missing from here, but I <em>do</em> have bytes 111534–117326.” The holes are named exactly.</li>
<li>After <strong>three duplicate ACKs</strong>, the sender does a <strong>fast retransmit</strong> (<code>TCP Fast Retransmission</code>): it resends the missing segment immediately, about one round trip, instead of waiting for the slow retransmit timer.</li>
</ul>
<p>Without SACK (the <code>sackOK</code> option both sides set in the handshake), a sender that sees a gap might resend <em>everything</em> after it. SACK lets the receiver list exactly what it already has, so only the true holes go back on the wire — a big win on long, lossy links.</p>

<div class="pitfall co-tieu-de">
<p><strong>“Retransmissions in Wireshark” is not automatically a bug.</strong> A few retransmits on a busy or long link are normal — TCP is doing its job. What matters is the <em>rate</em> and the <em>pattern</em>: a steady trickle under load is fine; a burst of timeouts (not fast retransmits) that collapse throughput points at real loss or an overloaded middlebox. Compare <code>nstat</code>’s <code>TcpRetransSegs</code> against <code>TcpOutSegs</code> for a ratio, and prefer fast retransmits (RTT-fast) over RTO timeouts (≥ 200 ms, window-crushing).</p>
</div>

<h3>Head-of-line blocking: data that arrived but cannot be read</h3>
<p>Because TCP must hand your application the stream <strong>in order</strong>, a single lost segment holds up everything behind it — even segments that already arrived and are sitting in the receiver’s kernel buffer. If segment 2 is lost but 3 and 4 arrive, the kernel keeps 3 and 4 and will not give them to your <code>read()</code> until the retransmit of 2 fills the gap. One lost packet stalls bytes that are physically in memory.</p>
<p>This is <strong>head-of-line (HoL) blocking at the TCP layer</strong>, and it has a famous consequence: HTTP/2 multiplexes many requests over one TCP connection, so one lost packet stalls <em>all</em> of them, not just the one whose data was lost (Chapter 7). It is the exact problem QUIC and HTTP/3 were designed to remove by giving each stream its own ordering (Chapter 5).</p>

<div class="pitfall co-tieu-de">
<p><strong>A fast network can still feel slow because of one lossy hop.</strong> If a single link on the path drops ~1% of packets, a big download over one TCP connection spends much of its time in recovery and HoL stalls, even though every other hop is perfect. The fix is rarely “more bandwidth”; it is finding the lossy hop (<code>mtr</code>, Chapter 11), or moving to a transport that does not share one ordering across streams (HTTP/3).</p>
</div>

<h3>Where this lives in the computer</h3>
<ul>
<li><strong>Segmentation</strong>: the kernel splits each <code>write()</code> into ≤ MSS segments; modern NICs even do it in hardware (TSO). You never size segments yourself.</li>
<li><strong>The retransmit buffer</strong>: the sender keeps every byte it has sent but not yet seen acked, in kernel RAM, ready to resend. A receiver that stops acking (a stalled reader) makes this buffer — and memory — grow.</li>
<li><strong>The reorder queue</strong>: the receiver’s kernel holds out-of-order segments until the gap is filled; that is where HoL-blocked data waits.</li>
<li><code>ss -ti</code> shows <code>retrans</code>, <code>reordering</code> and SACK state per connection; <code>nstat</code> gives the kernel-wide counters.</li>
</ul>
${cauNoi('en', { ...NWC, bai: 'nwc204-13-2-bat-tay-tin-cay-va-doc-may-chu-that', so: '13.2', ten: 'Handshake, reliability, UDP, and reading a real server', giong: 'TCP gives an ordered, reliable stream using sequence numbers and acknowledgements, unlike UDP', khac: 'NWC204 presents it from the curriculum at a conceptual level', them: 'sequence/ACK read off a real capture, a transfer measured under 3% loss, SACK and fast retransmit in tshark, and TCP-layer head-of-line blocking that sets up QUIC and HTTP/3' })}

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a download that is instant in the office takes minutes from a branch site, “even though the speed test there says 200 Mbps.” You suspect a lossy link. Prove, in the lab, what loss does to a single TCP stream.</p>
<ol>
<li>With the base lab up, add <code>tc qdisc add dev eth0 root netem delay 25ms</code> on the router. From <code>nfd-client</code>, run <code>iperf3 -c 10.10.2.10 -t 6 -i 1</code> and note the rate and the <code>Retr</code> column.</li>
<li>Change to <code>netem delay 25ms loss 3%</code> and run the same. Compare the rate and <code>Retr</code>.</li>
<li>Capture a lossy transfer (<code>tcpdump -w /tmp/l.pcap</code>) and open it with <code>tshark -Y 'tcp.analysis.retransmission || tcp.analysis.duplicate_ack'</code>. Find a fast retransmit and the SACK edges that triggered it.</li>
<li>Write two sentences: one on why the branch feels slow, one on what would help (and why “more bandwidth” might not).</li>
</ol>
<p><strong>Done when:</strong> your numbers show loss cutting throughput while the transfer still completes correctly, your tshark view shows dup ACKs leading to a fast retransmit with SACK edges, and your sentences name loss (not bandwidth) as the cause.</p>
<details><summary>Solution</summary>
<p>Loss raises <code>Retr</code> and lowers the sustained rate; the transfer still finishes with correct data. In tshark you see repeated <code>[TCP Dup ACK]</code> lines with growing <code>SLE/SRE</code> ranges, then a <code>[TCP Fast Retransmission]</code>. Sentences: “The branch is slow because a hop on its path drops packets; a single TCP stream spends its time retransmitting and head-of-line-blocked, so throughput collapses even at 200 Mbps link speed. More bandwidth will not help a loss problem — we need to find the lossy hop with <code>mtr</code>, or split the work across connections / use HTTP/3.”</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['segment (đoạn)', 'A piece of the TCP stream, at most one MSS; TCP cuts your write into these.'],
  ['MSS — maximum segment size (cỡ đoạn tối đa)', 'The largest payload one TCP segment carries; 1448 bytes here (MTU 1500 − IP/TCP headers).'],
  ['cumulative ACK (báo nhận tích luỹ)', 'An ACK names the first byte still missing, covering everything before it.'],
  ['retransmission (truyền lại)', 'Resending a segment the sender believes was lost.'],
  ['duplicate ACK (ACK trùng)', 'The receiver repeating the same ACK because it is stuck behind a gap; three of them trigger fast retransmit.'],
  ['SACK — selective ACK (báo nhận chọn lọc)', 'The receiver lists the ranges it has, so only the real holes are resent (RFC 2018).'],
  ['head-of-line blocking (nghẽn đầu hàng)', 'In-order delivery holds data that arrived until an earlier lost segment is recovered.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>TCP numbers every byte; the ACK is cumulative and names the next byte expected.</li>
<li>Lost segments are retransmitted; your application always sees an ordered, correct stream (under 3% loss the transfer still completed).</li>
<li>Three duplicate ACKs → fast retransmit (one RTT); SACK names the exact holes so only they are resent.</li>
<li>Head-of-line blocking holds already-arrived data until an earlier gap is filled — the problem HTTP/3 fixes.</li>
<li>Read it with <code>tshark</code> (Retransmission, Dup ACK, SACK) and <code>ss -ti</code> / <code>nstat</code> (retrans, reordering).</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc9293', '📄', 'RFC 9293 — TCP (2022)', 'Sections on sequence numbers, acknowledgement and retransmission.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc2018', '📄', 'RFC 2018 — TCP Selective Acknowledgment (SACK)', 'How the receiver names the ranges it already has.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc5681', '📄', 'RFC 5681 — TCP Congestion Control', 'Fast retransmit and fast recovery (used again in lesson 4.3).', 'Open')}
${L('https://blog.cloudflare.com/head-of-line-blocking-in-quic-and-http-3-the-details/', '📝', 'Cloudflare — Head-of-line blocking in QUIC and HTTP/3', 'The TCP-layer problem this lesson shows, and how HTTP/3 removes it.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Độ tin cậy: số thứ tự, ACK và truyền lại</h2>
<p class="lead">Mạng bên dưới bạn không đáng tin: gói bị vứt, bị đảo thứ tự, đôi khi bị nhân đôi. Vậy mà khi code của bạn đọc từ một socket, các byte tới có thứ tự và đầy đủ, mọi lần. Ảo giác đó được TCP dựng từ ba phần đơn giản — đánh số từng byte, báo nhận cái đã tới, và gửi lại cái chưa tới. Bài này đọc các phần đó từ một lần truyền thật, rồi chạy một lần dưới mức mất gói 3% để xem TCP sửa chữa trong khi ứng dụng của bạn chẳng thấy gì ngoài chậm hơn một chút.</p>

<h3>Một luồng cắt thành các đoạn có đánh số</h3>
<p>Chương trình của bạn gọi <code>write()</code> với một khối byte. TCP không gửi nó thành một cục; nó cắt thành các <strong>đoạn (segment)</strong>, mỗi cái tối đa một <strong>MSS</strong> (maximum segment size — cỡ đoạn tối đa, 1448 byte trên đường này sau khi trừ header TCP/IP). Mỗi byte của luồng có một <strong>số thứ tự (sequence number)</strong>, và bên nhận gửi lại một <strong>ACK</strong> gọi tên byte kế tiếp nó mong. Xem một lần tải <code>/big</code>:</p>
${run('c42-seq', 'tcpdump', 1, { max: 8, cut: 120 })}
<ul>
<li><code>GET /big</code> là 77 byte: số thứ tự của client đi <code>…836 → …913</code>, và máy chủ báo nhận <code>…913</code> — “tôi có yêu cầu của anh, gửi tiếp đi”.</li>
<li>Đoạn dữ liệu đầu của máy chủ là <strong>2896 byte</strong> (hai MSS gộp lại): số thứ tự chạy <code>…390 → …286</code>, nhảy đúng 2896. Số thứ tự đếm <em>byte</em>, không đếm gói.</li>
<li><code>wscale 10</code> trong cú bắt tay là <strong>window scaling (co giãn cửa sổ)</strong>: trường cửa sổ 16-bit được dịch trái 10 bit, nên cửa sổ công bố có thể lớn hơn nhiều giới hạn 64 KB cũ (bài 4.3).</li>
</ul>
${net('encap', 'mtu', 'vi', 'Xem một tải quá lớn cho một đoạn bị cắt theo MSS — chính việc cắt đoạn bài này đọc trên dây.', { tour: 'encap-mtu' })}

<h3>ACK là tích luỹ</h3>
<p>Một số ACK bao <em>mọi thứ</em> trước nó. Nếu bên nhận giữ byte 1–2896 thì nó báo nhận <code>2897</code>. Nếu một khúc sau tới nhưng có lỗ hổng ở giữa, ACK đứng yên ở <code>2897</code> — dù có thêm dữ liệu đang nằm trong vùng đệm của bên nhận — vì ACK chỉ gọi tên được byte <em>thiếu</em> đầu tiên. Khi lỗ hổng cuối cùng được lấp, ACK nhảy vọt qua mọi thứ giờ đã liền mạch. Cái ACK đứng yên đó không phải lỗi; nó là tín hiệu điều khiển cả truyền lại nhanh lẫn (mặt tối của nó) nghẽn đầu hàng ở dưới.</p>

<h3>Mất gói, và TCP cứ thế sửa</h3>
<p>Thêm 3% mất gói vào router rồi đẩy một lần truyền lớn bằng <code>iperf3</code>. Cột <code>Retr</code> đếm số đoạn truyền lại:</p>
${run('c42-loss', 'iperf3', 1, { max: 9 })}
<p>Một số đoạn bị mất và gửi lại (<code>Retr</code> khác 0 ở giây đầu), vậy mà lần truyền kết thúc đúng và giữ tốc độ cao. Ứng dụng của bạn không hề thấy một byte thiếu hay sai — nó chỉ thấy lần truyền lâu hơn chút. <strong>TCP đánh đổi tốc độ lấy sự đúng đắn, âm thầm.</strong> Đó là giao kèo: bạn không thể bảo TCP “cứ đưa tôi cái gì đã tới”; muốn vậy thì bạn muốn UDP (Chương 5).</p>

<h3>Phục hồi mà không phải chờ: dup ACK, truyền lại nhanh, SACK</h3>
<p>Đọc chính lần truyền có mất gói đó bằng <code>tshark</code>, nó dán nhãn TCP đang làm gì:</p>
${run('c42-sack', 'tshark', 1, { max: 9, cut: 120 })}
<ul>
<li>Khi một đoạn mất, mỗi đoạn sau tới làm bên nhận lặp lại <strong>cùng một</strong> ACK — một <strong>ACK trùng (duplicate ACK)</strong> (<code>TCP Dup ACK</code>). Đó là bên nhận kêu lên “tôi vẫn kẹt ở byte này”.</li>
<li>Trường <code>SLE</code>/<code>SRE</code> là mép của <strong>báo nhận chọn lọc (SACK)</strong>: “tôi thiếu từ đây, nhưng tôi <em>có</em> byte 111534–117326.” Các lỗ hổng được gọi tên chính xác.</li>
<li>Sau <strong>ba ACK trùng</strong>, bên gửi làm một lần <strong>truyền lại nhanh (fast retransmit)</strong> (<code>TCP Fast Retransmission</code>): gửi lại ngay đoạn thiếu, khoảng một vòng khứ hồi, thay vì chờ bộ đếm truyền lại chậm.</li>
</ul>
<p>Thiếu SACK (tuỳ chọn <code>sackOK</code> cả hai bên đặt trong cú bắt tay), một bên gửi thấy lỗ hổng có thể gửi lại <em>mọi thứ</em> sau nó. SACK cho bên nhận liệt kê đúng cái nó đã có, nên chỉ lỗ hổng thật quay lại trên dây — một thắng lợi lớn trên đường dài, hay mất gói.</p>

<div class="pitfall co-tieu-de">
<p><strong>“Có truyền lại trong Wireshark” không tự động là lỗi.</strong> Một ít truyền lại trên đường bận hay đường dài là bình thường — TCP đang làm việc của nó. Cái đáng quan tâm là <em>tỷ lệ</em> và <em>dạng</em>: một dòng rỉ đều khi tải là ổn; một loạt timeout (không phải truyền lại nhanh) làm sụp thông lượng mới chỉ ra mất gói thật hoặc một middlebox quá tải. So <code>TcpRetransSegs</code> với <code>TcpOutSegs</code> của <code>nstat</code> để lấy tỷ lệ, và ưu tiên truyền lại nhanh (nhanh bằng RTT) hơn timeout RTO (≥ 200 ms, nghiền nát cửa sổ).</p>
</div>

<h3>Nghẽn đầu hàng: dữ liệu đã tới mà không đọc được</h3>
<p>Vì TCP phải trao luồng cho ứng dụng của bạn <strong>đúng thứ tự</strong>, một đoạn mất giữ lại mọi thứ phía sau — kể cả các đoạn đã tới và đang nằm trong vùng đệm nhân của bên nhận. Nếu đoạn 2 mất nhưng 3 và 4 tới, nhân giữ 3 và 4 và sẽ không đưa chúng cho <code>read()</code> của bạn tới khi truyền lại của 2 lấp lỗ hổng. Một gói mất làm kẹt những byte đang nằm vật lý trong bộ nhớ.</p>
<p>Đây là <strong>nghẽn đầu hàng (head-of-line blocking) ở tầng TCP</strong>, và nó có một hệ quả nổi tiếng: HTTP/2 ghép nhiều yêu cầu trên một kết nối TCP, nên một gói mất làm kẹt <em>tất cả</em> chúng, không chỉ cái có dữ liệu bị mất (Chương 7). Nó đúng là vấn đề QUIC và HTTP/3 được thiết kế để gỡ bỏ bằng cách cho mỗi luồng (stream) thứ tự riêng (Chương 5).</p>

<div class="pitfall co-tieu-de">
<p><strong>Một mạng nhanh vẫn có thể thấy chậm vì một chặng hay mất gói.</strong> Nếu một đường trên lối đi vứt ~1% gói, một lần tải lớn trên một kết nối TCP dành phần lớn thời gian phục hồi và kẹt đầu hàng, dù mọi chặng khác đều hoàn hảo. Cách sửa hiếm khi là “thêm băng thông”; nó là tìm ra chặng hay mất (<code>mtr</code>, Chương 11), hoặc chuyển sang một tầng vận chuyển không chia chung một thứ tự cho mọi luồng (HTTP/3).</p>
</div>

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li><strong>Cắt đoạn</strong>: nhân chia mỗi <code>write()</code> thành các đoạn ≤ MSS; NIC hiện đại còn làm trong phần cứng (TSO). Bạn không bao giờ tự định cỡ đoạn.</li>
<li><strong>Vùng đệm truyền lại</strong>: bên gửi giữ mọi byte đã gửi nhưng chưa thấy báo nhận, trong RAM của nhân, sẵn sàng gửi lại. Một bên nhận ngừng báo nhận (bên đọc bị kẹt) làm vùng đệm này — và bộ nhớ — phình to.</li>
<li><strong>Hàng đợi sắp lại</strong>: nhân bên nhận giữ các đoạn sai thứ tự tới khi lỗ hổng được lấp; đó là nơi dữ liệu bị kẹt đầu hàng chờ.</li>
<li><code>ss -ti</code> cho thấy <code>retrans</code>, <code>reordering</code> và trạng thái SACK theo từng kết nối; <code>nstat</code> cho các bộ đếm toàn nhân.</li>
</ul>
${cauNoi('vi', { ...NWC, bai: 'nwc204-13-2-bat-tay-tin-cay-va-doc-may-chu-that', so: '13.2', ten: 'Bắt tay, tính tin cậy, UDP, và đọc một máy chủ thật', giong: 'TCP cho một luồng có thứ tự, đáng tin nhờ số thứ tự và báo nhận, khác UDP', khac: 'NWC204 trình bày theo giáo trình ở mức khái niệm', them: 'số thứ tự/ACK đọc từ bản bắt gói thật, một lần truyền đo dưới 3% mất gói, SACK và truyền lại nhanh trong tshark, và nghẽn đầu hàng tầng TCP dẫn vào QUIC với HTTP/3' })}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một lần tải tức thì ở văn phòng nhưng mất vài phút từ một chi nhánh, “dù đo tốc độ ở đó báo 200 Mbps.” Bạn nghi một đường hay mất gói. Hãy chứng minh trong lab mất gói làm gì một luồng TCP.</p>
<ol>
<li>Lab cơ bản đang chạy, thêm <code>tc qdisc add dev eth0 root netem delay 25ms</code> trên router. Từ <code>nfd-client</code>, chạy <code>iperf3 -c 10.10.2.10 -t 6 -i 1</code> và ghi tốc độ cùng cột <code>Retr</code>.</li>
<li>Đổi thành <code>netem delay 25ms loss 3%</code> và chạy lại. So tốc độ và <code>Retr</code>.</li>
<li>Bắt một lần truyền có mất gói (<code>tcpdump -w /tmp/l.pcap</code>) và mở bằng <code>tshark -Y 'tcp.analysis.retransmission || tcp.analysis.duplicate_ack'</code>. Tìm một lần truyền lại nhanh và các mép SACK đã kích hoạt nó.</li>
<li>Viết hai câu: một về vì sao chi nhánh thấy chậm, một về cái gì sẽ giúp (và vì sao “thêm băng thông” có thể không).</li>
</ol>
<p><strong>Đạt khi:</strong> số của bạn cho thấy mất gói cắt thông lượng trong khi lần truyền vẫn hoàn tất đúng, khung tshark cho thấy dup ACK dẫn tới truyền lại nhanh kèm mép SACK, và hai câu của bạn gọi tên mất gói (không phải băng thông) là nguyên nhân.</p>
<details><summary>Lời giải</summary>
<p>Mất gói nâng <code>Retr</code> và hạ tốc độ duy trì; lần truyền vẫn kết thúc đúng dữ liệu. Trong tshark bạn thấy các dòng <code>[TCP Dup ACK]</code> lặp lại với khoảng <code>SLE/SRE</code> lớn dần, rồi một <code>[TCP Fast Retransmission]</code>. Hai câu: “Chi nhánh chậm vì một chặng trên lối đi của nó vứt gói; một luồng TCP đơn dành thời gian truyền lại và kẹt đầu hàng, nên thông lượng sụp dù đường 200 Mbps. Thêm băng thông không chữa được vấn đề mất gói — ta cần tìm chặng hay mất bằng <code>mtr</code>, hoặc chia việc ra nhiều kết nối / dùng HTTP/3.”</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['segment (đoạn)', 'Một mẩu của luồng TCP, tối đa một MSS; TCP cắt lệnh write của bạn thành các mẩu này.'],
  ['MSS — maximum segment size (cỡ đoạn tối đa)', 'Tải lớn nhất một đoạn TCP mang; 1448 byte ở đây (MTU 1500 − header IP/TCP).'],
  ['cumulative ACK (báo nhận tích luỹ)', 'Một ACK gọi tên byte đầu tiên còn thiếu, bao mọi thứ trước nó.'],
  ['retransmission (truyền lại)', 'Gửi lại một đoạn mà bên gửi tin là đã mất.'],
  ['duplicate ACK (ACK trùng)', 'Bên nhận lặp lại cùng một ACK vì kẹt sau một lỗ hổng; ba cái kích hoạt truyền lại nhanh.'],
  ['SACK — selective ACK (báo nhận chọn lọc)', 'Bên nhận liệt kê các khoảng nó có, để chỉ lỗ hổng thật được gửi lại (RFC 2018).'],
  ['head-of-line blocking (nghẽn đầu hàng)', 'Giao đúng thứ tự giữ dữ liệu đã tới tới khi một đoạn mất trước đó được phục hồi.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>TCP đánh số từng byte; ACK là tích luỹ và gọi tên byte kế tiếp được mong.</li>
<li>Đoạn mất được truyền lại; ứng dụng của bạn luôn thấy một luồng có thứ tự, đúng đắn (dưới 3% mất gói lần truyền vẫn hoàn tất).</li>
<li>Ba ACK trùng → truyền lại nhanh (một RTT); SACK gọi tên đúng lỗ hổng để chỉ chúng được gửi lại.</li>
<li>Nghẽn đầu hàng giữ dữ liệu đã tới tới khi một lỗ hổng trước được lấp — vấn đề HTTP/3 sửa.</li>
<li>Đọc bằng <code>tshark</code> (Retransmission, Dup ACK, SACK) và <code>ss -ti</code> / <code>nstat</code> (retrans, reordering).</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc9293', '📄', 'RFC 9293 — TCP (2022)', 'Các mục về số thứ tự, báo nhận và truyền lại.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc2018', '📄', 'RFC 2018 — Báo nhận chọn lọc của TCP (SACK)', 'Cách bên nhận gọi tên các khoảng nó đã có.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc5681', '📄', 'RFC 5681 — Kiểm soát tắc nghẽn TCP', 'Truyền lại nhanh và phục hồi nhanh (dùng lại ở bài 4.3).', 'Mở')}
${L('https://blog.cloudflare.com/head-of-line-blocking-in-quic-and-http-3-the-details/', '📝', 'Cloudflare — Nghẽn đầu hàng trong QUIC và HTTP/3', 'Vấn đề tầng TCP bài này chỉ ra, và cách HTTP/3 gỡ bỏ nó.', 'Mở')}
</div>
`,
};
