/**
 * NWC204 · Chapter 12 — ICMP (Cisco Module 13).
 * FLM buổi 37–38 (lý thuyết) + buổi 39–40 (Lab 2.3).
 * LO: CLO6 ("use diagnostic tools ... including ICMP utilities") + CLO9.
 *
 * Slide: scripts/slides-src/nwc204-ch12.mjs → deck 'nwc204-ch12', 23 ảnh.
 *
 * ★ = phần cuongthai.com bổ sung ngoài Module 13, ĐO THẬT trên VPS sản xuất:
 *   - ping tới 172.17.99.99 (địa chỉ trống trong chính subnet docker0) → 100% mất
 *     gói, IM LẶNG, KHÔNG có "host unreachable"
 *   - Path MTU: `-M do -s 1472` (=1500) đi lọt; `-s 1473` trả nguyên văn
 *     `ping: local error: message too long, mtu=1500`
 *   - tracepath thật: hop 1 "no reply" mà hop 2..10 vẫn trả lời, kèm nhãn `asymm`
 *   - TTL gói trả lời: 1.1.1.1 → ttl=55 (9 chặng), 8.8.8.8 → ttl=118 (10 chặng)
 *   - ping6 ff02::1%eth0 → chỉ CHÍNH MÁY đó đáp, 0,055 ms
 *   - exit code đo thật: 0 khi tới được, 1 khi không
 *
 * ⚠️ Bất thường của bảng gốc, đã nêu trong bài, KHÔNG tự sửa bảng gốc:
 *   - Buổi 37 mang CQ13.1 "What happens do we use IPv4 in nowadays?" → mục 11.2
 *   - Buổi 38 mang CQ13.2 "Compare types of IPv6 network addresses" → mục 11.4
 *   - Buổi 39 mang CQ13.3 "How to configure IPv6 address on Cisco devices?" → 11.5
 *     ⇒ CẢ BA đều là nội dung CHƯƠNG 11, đã trả lời đủ ở bài 11.1 và 11.2.
 *   - Buổi 40 mang CQ14.1 "What is ICMP?" — câu ĐẦU TIÊN khớp đúng chương, nhưng
 *     rơi vào buổi Lab 2.3 (continue) chứ không phải buổi 37 nơi dạy 12.1.
 *
 * ⚠️ File này CHỈ chứa chương 12. Đừng sửa NWC204.mjs ở đây.
 * ⚠️ Mỗi khối content PHẢI kết thúc bằng `].join('\n'),` — nếu không thì
 *    lesson.content là ARRAY và academy-ra-soat.mjs đổ ở dòng 52.
 */
import { registerDeck, walk, walkHead, bi, cq } from './_slides.mjs';

const D = registerDeck('nwc204-ch12', {
  code: 'NWC204',
  en: 'ICMP',
  vi: 'Giao thức ICMP',
  total: 23,
});

/* ──────────────────────── Lesson 12.1 — session 37 ─────────────────────── */

const L1 = {
  title: '12.1 — ICMP messages: how a network reports its own problems (FLM session 37)|||12.1 — Thông điệp ICMP: mạng báo lỗi của chính nó ra sao (buổi 37 của FLM)',
  slug: 'nwc204-12-1-thong-diep-icmp',
  type: 'DOCUMENT',
  description: 'Buổi 37: ICMP là kênh phản hồi mà IP không có, nó nằm TRONG IP nên bản thân nó cũng có thể bị rơi, ba nhóm thông điệp phải thuộc là Echo, Time Exceeded và Destination Unreachable cùng các mã của nó, trường TTL và nghĩa vụ báo lại khi TTL về 0, và vì sao ICMPv6 là bắt buộc chứ không phải tiện nghi — chặn nó là làm hỏng hẳn IPv6. Kèm phần ★ đo thật: ping tới địa chỉ trống trong chính subnet của mình thì IM LẶNG chứ không báo host unreachable, và TTL trong gói trả lời đếm ra số chặng.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 12 · Lesson 12.1 · FLM session 37 of 60 · CLO6, CLO9 · Cisco Module 13</span>
<h2>The protocol whose only job is to complain</h2>
<p class="lead">After this lesson you can name what ICMP is for and what it deliberately does not do, identify the three message types that every diagnostic tool is built on, and explain why a firewall rule saying "drop all ICMP" is harmless advice on IPv4 and a catastrophe on IPv6.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 37 — "12. ICMP · 12.1 ICMP Messages"; LO: CLO6, CLO9; ITU: T; tài liệu "Module 13: ICMP"</p>
<p><strong>Opening question.</strong> From a real server, <code>ping 172.17.99.99</code> — an address inside the machine's own docker0 subnet with nothing at it — produces this and nothing else:</p>
<pre><code class="language-plaintext">2 packets transmitted, 0 received, 100% packet loss, time 1018ms</code></pre>
<p>No "host unreachable", no error, just silence. But the textbook says ICMP has a Destination Unreachable message with a code specifically meaning "host unreachable". Why did nobody send it, and what does that tell you about how much you can trust a failed ping?</p>
<div class="callout"><strong>This chapter is where CLO6 lives.</strong> Read it: <em>"Use diagnostic tools and techniques to test and troubleshoot network connectivity, including ICMP utilities and AI-assisted methods."</em> Most outcomes describe a skill; this one names a protocol. That is a signal about the assessment — you are expected to <strong>use</strong> the tools and defend what their output means, not recite a table of message types.</div>
<p class="note">★ marks material added by cuongthai.com beyond Cisco Module 13, measured on a production server rather than quoted.</p>`,
      `<span class="eyebrow">NWC204 · Chương 12 · Bài 12.1 · Buổi 37/60 của FLM · CLO6, CLO9 · Cisco Module 13</span>
<h2>Giao thức có mỗi một việc là than phiền</h2>
<p class="lead">Học xong bài này bạn gọi tên được ICMP dùng để làm gì và cố ý KHÔNG làm gì, nhận ra ba nhóm thông điệp mà mọi công cụ chẩn đoán đều dựng trên đó, và giải thích được vì sao một luật tường lửa "chặn hết ICMP" là lời khuyên vô hại với IPv4 mà là tai hoạ với IPv6.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 37 — "12. ICMP · 12.1 ICMP Messages"; LO: CLO6, CLO9; ITU: T; tài liệu "Module 13: ICMP"</p>
<p><strong>Câu hỏi mở đầu.</strong> Từ một máy chủ thật, <code>ping 172.17.99.99</code> — một địa chỉ nằm trong chính subnet docker0 của máy đó và không có gì ở đấy — cho ra đúng chừng này và không gì hơn:</p>
<pre><code class="language-plaintext">2 packets transmitted, 0 received, 100% packet loss, time 1018ms</code></pre>
<p>Không có "host unreachable", không có lỗi nào, chỉ im lặng. Nhưng sách thì nói ICMP có thông điệp Destination Unreachable, với hẳn một mã nghĩa là "host unreachable". Vì sao không ai gửi nó, và điều đó nói gì về mức độ đáng tin của một cú ping hỏng?</p>
<div class="callout"><strong>Chương này là chỗ CLO6 nằm.</strong> Đọc lại nó: <em>"Use diagnostic tools and techniques to test and troubleshoot network connectivity, including ICMP utilities and AI-assisted methods."</em> Phần lớn chuẩn đầu ra mô tả một kỹ năng; riêng cái này gọi đích danh một giao thức. Đó là tín hiệu về cách chấm — bạn được yêu cầu <strong>DÙNG</strong> công cụ và biện hộ được cho ý nghĩa của kết quả, chứ không phải đọc thuộc một bảng các loại thông điệp.</div>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 13, đo trên máy chủ sản xuất chứ không phải trích lại.</p>`,
    ),

    walkHead('nwc204-ch12', 1, 9,
      'Slides 1–9 cover FLM session 37: 12.1 ICMP Messages.',
      'Slide 1–9 là buổi 37 của FLM: 12.1 Các thông điệp ICMP.'),

    walk('nwc204-ch12', [
      [1, 'Cover — Chapter 12, ICMP',
        `<p>Chapter 12 is <strong>Cisco Module 13</strong>, and FPT gives it four sessions: two of theory and two of hands-on lab.</p>
<ul>
<li>Session 37 — 12.1 ICMP Messages.</li>
<li>Session 38 — 12.2 Ping and Traceroute Testing, 12.3 AI tools (self learning).</li>
<li>Sessions 39–40 — <strong>Lab 2.3</strong>: use ping and traceroute to test connectivity, and use AI tools for configuration and troubleshooting.</li>
<li>Outcomes: <strong>CLO6</strong> and <strong>CLO9</strong>.</li>
</ul>
<p><strong>Why this chapter is worth more than its size suggests.</strong> Everything before it explained how a network works when it works. This is the first chapter about finding out why one does not — and the tools are small enough to learn in an afternoon and useful for the rest of your career.</p>`,
        `<p>Chương 12 là <strong>Module 13 của Cisco</strong>, và trường xếp cho nó bốn buổi: hai buổi lý thuyết và hai buổi thực hành.</p>
<ul>
<li>Buổi 37 — 12.1 Các thông điệp ICMP.</li>
<li>Buổi 38 — 12.2 Kiểm tra bằng ping và traceroute, 12.3 công cụ AI (tự học).</li>
<li>Buổi 39–40 — <strong>Lab 2.3</strong>: dùng ping và traceroute để kiểm tra kết nối, và dùng công cụ AI cho việc cấu hình và gỡ lỗi.</li>
<li>Chuẩn đầu ra: <strong>CLO6</strong> và <strong>CLO9</strong>.</li>
</ul>
<p><strong>Vì sao chương này đáng giá hơn vẻ ngoài của nó.</strong> Mọi thứ trước đây giải thích mạng chạy ra sao khi nó chạy. Đây là chương đầu tiên nói về việc tìm ra vì sao nó KHÔNG chạy — và bộ công cụ thì đủ nhỏ để học trong một buổi chiều mà dùng được cả đời.</p>`],

      [2, 'Four sessions, and the outcome they serve',
        `<p>CLO6 names ICMP explicitly, which is unusual. Most learning outcomes describe a capability — "design", "explain", "configure". This one says <em>including ICMP utilities</em>, and that specificity tells you how the lab is marked.</p>
<p><strong>What that means in practice.</strong> Producing a screenshot of a successful ping is not the deliverable. The deliverable is being able to say, for each test: <em>what does a pass rule out, and what does a failure rule out?</em> A ping that fails is a fact. A ping that fails while its own gateway answers is a diagnosis, and only the second one is worth marks.</p>
<p><strong>The anomaly for this chapter, reported up front.</strong> The school's constructive-question table assigns CQ13.1, CQ13.2 and CQ13.3 to sessions 37, 38 and 39 — and all three ask about <strong>Chapter 11</strong> material: IPv4 issues, IPv6 address types, and configuring IPv6 on Cisco devices. The first question that actually matches this chapter, CQ14.1 "What is ICMP?", is assigned to session 40, which is the second half of the lab. We quote the table as published and point to where each was answered.</p>`,
        `<p>CLO6 gọi đích danh ICMP, và đó là chuyện bất thường. Phần lớn chuẩn đầu ra mô tả một năng lực — "thiết kế", "giải thích", "cấu hình". Riêng cái này ghi <em>including ICMP utilities</em>, và sự cụ thể ấy cho bạn biết bài lab được chấm thế nào.</p>
<p><strong>Trên thực tế nghĩa là gì.</strong> Chụp màn hình một cú ping thành công không phải là sản phẩm phải nộp. Sản phẩm là việc bạn nói được, với từng phép thử: <em>một kết quả đạt loại trừ được điều gì, và một kết quả hỏng loại trừ được điều gì?</em> Một cú ping hỏng là một sự kiện. Một cú ping hỏng trong khi cổng ra của chính nó vẫn đáp là một chẩn đoán, và chỉ cái thứ hai mới đáng điểm.</p>
<p><strong>Chỗ bất thường của chương này, nêu ngay từ đầu.</strong> Bảng câu hỏi kiến tạo của trường gán CQ13.1, CQ13.2 và CQ13.3 cho buổi 37, 38 và 39 — và cả ba đều hỏi nội dung của <strong>Chương 11</strong>: vấn đề của IPv4, các loại địa chỉ IPv6, và cấu hình IPv6 trên thiết bị Cisco. Câu đầu tiên thật sự khớp chương này, CQ14.1 "What is ICMP?", lại được gán cho buổi 40, tức nửa sau của bài lab. Chúng tôi trích bảng đúng như đã công bố và chỉ ra chỗ từng câu đã được trả lời.</p>`],

      [3, '12.1 What ICMP is for',
        `<p>IP is <strong>best effort</strong>. It tries to deliver a packet and, if it cannot, it discards it. There is nothing in the IP header for saying "I could not deliver this and here is why" — so without help, a dropped packet is simply gone and the sender never finds out.</p>
<p><strong>ICMP is that missing channel.</strong> When a router discards a packet, or a host cannot accept one, ICMP is how the bad news travels back to the sender.</p>
<p><strong>The distinction that matters most.</strong> ICMP does <em>not</em> make IP reliable. Nothing is retransmitted, nothing is guaranteed, no delivery is repaired. It makes IP <strong>diagnosable</strong>. Reliability is the transport layer's job — TCP, in Chapter 13 — and confusing the two leads to the belief that a successful ping means a working service.</p>
<p>Everything in this chapter is ICMP being read by a tool. Ping reads Echo Reply. Traceroute reads Time Exceeded. Path MTU discovery reads Fragmentation Needed. There is no separate "traceroute protocol" — there is one feedback protocol and several clever ways of listening to it.</p>`,
        `<p>IP là giao thức <strong>nỗ lực tối đa</strong>. Nó cố giao một gói tin, và nếu không giao được thì vứt đi. Trong tiêu đề IP không có chỗ nào để nói "tôi không giao được cái này và đây là lý do" — nên nếu không có ai giúp thì một gói bị rơi đơn giản là biến mất và người gửi không bao giờ biết.</p>
<p><strong>ICMP chính là cái kênh còn thiếu ấy.</strong> Khi một router vứt một gói đi, hoặc một host không nhận được gói, ICMP là cách tin xấu quay về với người gửi.</p>
<p><strong>Chỗ phân biệt quan trọng nhất.</strong> ICMP <em>không</em> làm cho IP trở nên tin cậy. Không có gì được gửi lại, không có gì được bảo đảm, không có cuộc giao nào được sửa chữa. Nó làm cho IP <strong>chẩn đoán được</strong>. Tính tin cậy là việc của tầng giao vận — TCP, ở Chương 13 — và lẫn lộn hai thứ đó dẫn tới niềm tin rằng ping được nghĩa là dịch vụ chạy.</p>
<p>Mọi thứ trong chương này đều là ICMP đang được một công cụ nào đó đọc. Ping đọc Echo Reply. Traceroute đọc Time Exceeded. Path MTU discovery đọc Fragmentation Needed. Không có "giao thức traceroute" riêng nào cả — chỉ có một giao thức phản hồi và vài cách nghe nó một cách khéo léo.</p>`],

      [4, 'ICMP travels inside IP, and that has consequences',
        `<p>An ICMP message is not a separate layer. It is the payload of an IP packet, marked with <strong>protocol number 1</strong> for ICMPv4 and <strong>58</strong> for ICMPv6.</p>
<p><strong>It is not a transport protocol.</strong> There is no port number, which is why a firewall rule cannot say "allow ICMP on port 80" — the concept does not exist. Rules for ICMP are written by <em>type</em> and <em>code</em> instead, and that difference catches people writing their first firewall.</p>
<p><strong>The consequence people miss:</strong> an ICMP error is an <em>unreliable message about an unreliable protocol</em>. If a router sends "fragmentation needed" and that reply is itself dropped — by congestion, or by a firewall — the original sender learns nothing and simply keeps failing in the same way.</p>
<p>Path MTU discovery depends entirely on a message that has no guarantee of arriving. That single fact explains most of the strange, intermittent faults that this chapter teaches you to recognise, and it is why "just block ICMP" is such an expensive piece of advice.</p>`,
        `<p>Một thông điệp ICMP không phải một tầng riêng. Nó là phần tải của một gói IP, đánh dấu bằng <strong>số hiệu giao thức 1</strong> cho ICMPv4 và <strong>58</strong> cho ICMPv6.</p>
<p><strong>Nó không phải giao thức tầng giao vận.</strong> Không có số hiệu cổng, và đó là lý do một luật tường lửa không thể nói "cho ICMP qua cổng 80" — khái niệm đó không tồn tại. Luật cho ICMP viết theo <em>type</em> và <em>code</em>, và khác biệt ấy bẫy chân những người viết luật tường lửa lần đầu.</p>
<p><strong>Hệ quả người ta hay bỏ qua:</strong> một thông báo lỗi ICMP là <em>một thông điệp không tin cậy nói về một giao thức không tin cậy</em>. Nếu một router gửi "fragmentation needed" mà chính gói trả lời đó bị rơi — do nghẽn, hoặc do tường lửa — thì người gửi ban đầu chẳng học được gì và cứ tiếp tục hỏng đúng kiểu cũ.</p>
<p>Path MTU discovery phụ thuộc hoàn toàn vào một thông điệp không có gì bảo đảm là sẽ tới nơi. Đúng một sự thật đó giải thích phần lớn những cái hỏng kỳ quặc, chập chờn mà chương này dạy bạn nhận ra, và nó là lý do câu "cứ chặn ICMP đi" là một lời khuyên đắt đỏ.</p>`],

      [5, '12.1 The messages worth knowing by heart',
        `<p>There are dozens of ICMP types. Five matter, and each one is the foundation of a tool you will use.</p>
<ul>
<li><strong>Type 8 / Type 0 — Echo Request and Echo Reply.</strong> "Are you there?" and "yes". This is <code>ping</code>, entirely.</li>
<li><strong>Type 11 — Time Exceeded.</strong> A router decremented TTL to zero. This is <code>traceroute</code>, entirely.</li>
<li><strong>Type 3 — Destination Unreachable.</strong> Could not be delivered, with a <em>code</em> saying why.</li>
<li><strong>Type 3 code 4 — Fragmentation Needed.</strong> Too big, and the Don't Fragment bit was set. It carries the correct MTU, which makes path MTU discovery possible.</li>
<li><strong>Type 5 — Redirect.</strong> "There is a better first hop than me for that destination."</li>
</ul>
<p><strong>ICMPv6 renumbers all of them.</strong> Echo is 128 and 129; types 133 to 137 are Neighbor Discovery, covered in Chapter 11. This matters for firewalls more than for exams: a rule written for ICMPv4 type 8 does <em>nothing at all</em> to IPv6 traffic, so an IPv4-only ICMP policy leaves IPv6 entirely unfiltered, or an IPv6 block written by analogy breaks address resolution.</p>`,
        `<p>ICMP có hàng chục loại. Năm loại là đáng kể, và mỗi loại là nền của một công cụ bạn sẽ dùng.</p>
<ul>
<li><strong>Type 8 / Type 0 — Echo Request và Echo Reply.</strong> "Có đó không?" và "có". Đó chính là <code>ping</code>, trọn vẹn.</li>
<li><strong>Type 11 — Time Exceeded.</strong> Một router đã giảm TTL về 0. Đó chính là <code>traceroute</code>, trọn vẹn.</li>
<li><strong>Type 3 — Destination Unreachable.</strong> Không giao được, kèm một <em>code</em> nói vì sao.</li>
<li><strong>Type 3 code 4 — Fragmentation Needed.</strong> Quá lớn, mà bit Don't Fragment lại được bật. Nó mang theo giá trị MTU đúng, và chính điều đó làm cho path MTU discovery khả thi.</li>
<li><strong>Type 5 — Redirect.</strong> "Có một chặng đầu tốt hơn tôi cho cái đích đó."</li>
</ul>
<p><strong>ICMPv6 đánh số lại tất cả.</strong> Echo là 128 và 129; các type 133 tới 137 là Neighbor Discovery, đã học ở Chương 11. Chuyện này quan trọng với tường lửa hơn là với đề thi: một luật viết cho ICMPv4 type 8 <em>hoàn toàn không tác động gì</em> tới lưu lượng IPv6, nên một chính sách ICMP chỉ viết cho IPv4 để IPv6 trần trụi không lọc, còn một luật chặn IPv6 viết theo lối suy diễn thì làm hỏng việc phân giải địa chỉ.</p>`],

      [6, 'Destination Unreachable — the codes mean different things',
        `<p>Type 3 is one message with many meanings, and the code is where the meaning lives.</p>
<ul>
<li><strong>code 0 — net unreachable.</strong> A router has no route to that network at all.</li>
<li><strong>code 1 — host unreachable.</strong> The network was reached; the host did not answer ARP or Neighbor Discovery.</li>
<li><strong>code 3 — port unreachable.</strong> The host is there, and nothing is listening on that UDP port. This is how <code>traceroute</code> knows it arrived.</li>
<li><strong>code 4 — fragmentation needed.</strong> Too big with DF set. Carries the MTU.</li>
<li><strong>code 13 — administratively prohibited.</strong> A firewall said no, and admitted it.</li>
</ul>
<p>★ <strong>Now the opening question.</strong> Code 1 is the one that is usually <em>absent</em> when you expect it. Pinging 172.17.99.99 — an empty address inside the server's own docker0 subnet — produced 100% loss and no message at all. The host doing the sending is the one that would have to report "host unreachable", and it does not, because from its point of view nothing failed: it sent an ARP request and nobody answered, which is a timeout rather than an error. Silence is the normal outcome of asking about an address that does not exist.</p>
<p><strong>The lesson to carry:</strong> a failed ping is far more often silence than an error message, and silence carries almost no information.</p>`,
        `<p>Type 3 là một thông điệp mang nhiều nghĩa, và nghĩa nằm ở phần code.</p>
<ul>
<li><strong>code 0 — net unreachable.</strong> Một router hoàn toàn không có tuyến nào tới mạng đó.</li>
<li><strong>code 1 — host unreachable.</strong> Đã tới được mạng; nhưng host không trả lời ARP hay Neighbor Discovery.</li>
<li><strong>code 3 — port unreachable.</strong> Host có đó, và không có gì nghe ở cổng UDP ấy. Đây là cách <code>traceroute</code> biết là nó đã tới nơi.</li>
<li><strong>code 4 — fragmentation needed.</strong> Quá lớn mà bit DF được bật. Mang theo giá trị MTU.</li>
<li><strong>code 13 — administratively prohibited.</strong> Một tường lửa đã nói không, và thừa nhận điều đó.</li>
</ul>
<p>★ <strong>Giờ tới câu hỏi mở đầu.</strong> Code 1 chính là cái thường <em>vắng mặt</em> đúng lúc bạn mong đợi nó. Ping tới 172.17.99.99 — một địa chỉ trống trong chính subnet docker0 của máy chủ — cho ra 100% mất gói và không một thông điệp nào. Chính cái máy đang gửi mới là bên phải báo "host unreachable", mà nó không báo, bởi vì xét từ góc nhìn của nó thì chẳng có gì hỏng cả: nó gửi một yêu cầu ARP và không ai đáp, đó là hết giờ chứ không phải lỗi. Im lặng là kết cục bình thường khi hỏi về một địa chỉ không tồn tại.</p>
<p><strong>Bài học mang theo:</strong> một cú ping hỏng thường là im lặng chứ hiếm khi là một thông báo lỗi, và im lặng thì hầu như không mang thông tin gì.</p>`],

      [7, '12.1 Time Exceeded, and the field that makes it happen',
        `<p><strong>TTL</strong> — Time To Live — is an 8-bit counter in the IPv4 header. IPv6 renamed it <strong>Hop Limit</strong>, which describes it more honestly: it counts hops, not time.</p>
<p>Every router decrements it by one before forwarding. When it reaches zero the packet is discarded, and the router that discarded it <strong>must</strong> send a Time Exceeded message back to the source.</p>
<p><strong>Why the field exists at all.</strong> Without it, a routing loop would circulate a packet forever, and enough such packets would saturate the loop permanently. TTL guarantees that every packet eventually dies. It is a safety device, and traceroute is a clever misuse of it.</p>
<p>★ <strong>The received TTL tells you the hop count, for free.</strong> Typical starting values are 64 (Linux, macOS), 128 (Windows) and 255 (network equipment). Measured from a real VPS: a reply from 1.1.1.1 arrived with <code>ttl=55</code> and one from 8.8.8.8 with <code>ttl=118</code>. Subtract from the nearest starting value above: 64 − 55 = <strong>9 hops</strong>, 128 − 118 = <strong>10 hops</strong>. One packet, and you know the distance.</p>`,
        `<p><strong>TTL</strong> — Time To Live — là một bộ đếm 8 bit trong tiêu đề IPv4. IPv6 đổi tên nó thành <strong>Hop Limit</strong>, và cái tên đó mô tả trung thực hơn: nó đếm chặng, không đếm thời gian.</p>
<p>Mỗi router giảm nó đi một trước khi chuyển tiếp. Khi nó về 0 thì gói tin bị vứt bỏ, và cái router vứt nó <strong>bắt buộc</strong> phải gửi một thông điệp Time Exceeded về nguồn.</p>
<p><strong>Vì sao cái trường đó tồn tại.</strong> Nếu không có nó, một vòng lặp định tuyến sẽ cho gói tin chạy vòng mãi mãi, và đủ nhiều gói như vậy là cái vòng đó nghẽn vĩnh viễn. TTL bảo đảm rằng mọi gói rồi cũng chết. Nó là một thiết bị an toàn, còn traceroute là một cách lạm dụng khéo léo cái thiết bị ấy.</p>
<p>★ <strong>TTL trong gói trả lời cho bạn biết số chặng, miễn phí.</strong> Các giá trị khởi đầu thường gặp là 64 (Linux, macOS), 128 (Windows) và 255 (thiết bị mạng). Đo từ một VPS thật: gói trả lời từ 1.1.1.1 về với <code>ttl=55</code> và từ 8.8.8.8 về với <code>ttl=118</code>. Trừ đi từ giá trị khởi đầu gần nhất ở trên: 64 − 55 = <strong>9 chặng</strong>, 128 − 118 = <strong>10 chặng</strong>. Một gói tin, và bạn biết khoảng cách.</p>`],

      [8, '★ ICMPv6 is not optional',
        `<p>This is the single most consequential difference between the two versions, and it is a security decision as much as a networking one.</p>
<p><strong>ICMPv4 is a convenience.</strong> Block most of it and the network still mostly works. You lose ping and traceroute and path MTU discovery, which is bad, but connectivity survives.</p>
<p><strong>ICMPv6 is structural.</strong> Core functions are built on it:</p>
<ul>
<li><strong>Types 135 and 136</strong> — Neighbor Solicitation and Advertisement. This <em>is</em> the ARP replacement. Block it and hosts cannot find each other on their own LAN.</li>
<li><strong>Types 133 and 134</strong> — Router Solicitation and Advertisement. This is how a host learns its prefix. Block it and nothing gets a global address.</li>
<li><strong>Type 2 — Packet Too Big.</strong> IPv6 routers never fragment, by design. This message is the <em>only</em> mechanism for discovering the path MTU.</li>
</ul>
<p><strong>The result of "drop all ICMP" on IPv6</strong> is a network where hosts cannot resolve neighbours, cannot get addresses, and cannot size their packets. It looks exactly like "IPv6 does not work here", and the cause is a firewall rule that seemed prudent. RFC 4890 exists specifically to list which types must be permitted — it is worth reading once before writing any IPv6 firewall.</p>`,
        `<p>Đây là khác biệt có hậu quả lớn nhất giữa hai phiên bản, và nó là một quyết định về an ninh không kém gì về mạng.</p>
<p><strong>ICMPv4 là một tiện nghi.</strong> Chặn gần hết nó thì mạng vẫn chạy gần như bình thường. Bạn mất ping, traceroute và path MTU discovery, như vậy là tệ, nhưng kết nối thì vẫn sống.</p>
<p><strong>ICMPv6 là cấu trúc.</strong> Các chức năng lõi được dựng trên nó:</p>
<ul>
<li><strong>Type 135 và 136</strong> — Neighbor Solicitation và Advertisement. Đây <em>chính là</em> thứ thay thế ARP. Chặn nó là các host không tìm được nhau ngay trên mạng LAN của mình.</li>
<li><strong>Type 133 và 134</strong> — Router Solicitation và Advertisement. Đây là cách một host học được tiền tố của nó. Chặn nó là không gì lấy được địa chỉ toàn cục.</li>
<li><strong>Type 2 — Packet Too Big.</strong> Router IPv6 không bao giờ phân mảnh, theo thiết kế. Thông điệp này là cơ chế <em>duy nhất</em> để tìm ra path MTU.</li>
</ul>
<p><strong>Kết quả của "chặn hết ICMP" trên IPv6</strong> là một mạng mà host không phân giải được láng giềng, không lấy được địa chỉ, và không định cỡ được gói tin. Nó trông y hệt câu "IPv6 ở đây không chạy", mà nguyên nhân lại là một luật tường lửa nghe có vẻ cẩn trọng. RFC 4890 tồn tại đúng để liệt kê những type bắt buộc phải cho qua — đáng đọc một lần trước khi viết bất kỳ luật tường lửa IPv6 nào.</p>`],

      [9, '12.2 How ping works',
        `<p>Ping sends an <strong>Echo Request</strong> (type 8) and waits for an <strong>Echo Reply</strong> (type 0). That is the whole protocol. Two fields turn it from a message into a measurement.</p>
<ul>
<li><strong>Sequence number.</strong> Incremented per packet. Missing sequence numbers in the output are packets that never came back — this is how loss becomes visible rather than merely suspected.</li>
<li><strong>Identifier.</strong> Lets several ping processes on one machine tell their own replies apart from each other's.</li>
</ul>
<p><strong>The round trip time is measured by the sender</strong>, by noting when the request left and when the reply arrived. Nothing in the packet carries a timestamp that the far end fills in, which is why the number is a round trip and never a one-way latency. Halving it gives a rough one-way estimate, and only a rough one — the two directions can take different paths of different lengths, as the traceroute section will show.</p>`,
        `<p>Ping gửi một gói <strong>Echo Request</strong> (type 8) rồi chờ một gói <strong>Echo Reply</strong> (type 0). Đó là toàn bộ giao thức. Hai trường biến nó từ một thông điệp thành một phép đo.</p>
<ul>
<li><strong>Số thứ tự.</strong> Tăng dần theo từng gói. Những số thứ tự thiếu trong kết xuất là các gói không bao giờ quay về — đây là cách mất gói trở nên nhìn thấy được chứ không chỉ là nghi ngờ.</li>
<li><strong>Định danh.</strong> Cho phép nhiều tiến trình ping trên cùng một máy phân biệt gói trả lời của mình với của nhau.</li>
</ul>
<p><strong>Thời gian khứ hồi do bên gửi đo</strong>, bằng cách ghi lại lúc gói yêu cầu đi và lúc gói trả lời về. Không có gì trong gói tin mang một dấu thời gian để đầu kia điền vào, và đó là lý do con số ấy là thời gian khứ hồi chứ không bao giờ là độ trễ một chiều. Chia đôi thì được một ước lượng một chiều, và chỉ là ước lượng thô — hai chiều có thể đi hai đường khác nhau với số chặng khác nhau, như phần traceroute sẽ cho thấy.</p>`],
    ]),

    bi(
      `<h3>🗺️ Which ICMP message answers which question</h3>
<pre><code class="language-mermaid">graph TD
  A["A packet did not arrive"] --> B{"Why?"}
  B -->|"TTL hit zero in transit"| C["Type 11 Time Exceeded<br/>read by TRACEROUTE"]
  B -->|"no route to that network"| D["Type 3 code 0<br/>net unreachable"]
  B -->|"host did not answer ARP"| E["usually SILENCE<br/>not an ICMP message at all"]
  B -->|"too big, DF was set"| F["Type 3 code 4<br/>carries the correct MTU"]
  B -->|"a firewall refused it"| G["Type 3 code 13, or silence<br/>depending on policy"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class B ask
  class A,D,E,G act
  class C,F ok</code></pre>
<p>Two of the six outcomes are <strong>silence</strong>. That is the shape of the problem this chapter teaches: the absence of a message is the most common response, and it is the one that carries the least information.</p>`,
      `<h3>🗺️ Thông điệp ICMP nào trả lời câu hỏi nào</h3>
<pre><code class="language-mermaid">graph TD
  A["Một gói tin không tới nơi"] --> B{"Vì sao?"}
  B -->|"TTL về 0 giữa đường"| C["Type 11 Time Exceeded<br/>TRACEROUTE đọc cái này"]
  B -->|"không có tuyến tới mạng đó"| D["Type 3 code 0<br/>net unreachable"]
  B -->|"host không trả lời ARP"| E["thường là IM LẶNG<br/>không có thông điệp ICMP nào cả"]
  B -->|"quá lớn, bit DF được bật"| F["Type 3 code 4<br/>mang theo giá trị MTU đúng"]
  B -->|"tường lửa từ chối"| G["Type 3 code 13, hoặc im lặng<br/>tuỳ chính sách"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class B ask
  class A,D,E,G act
  class C,F ok</code></pre>
<p>Hai trong sáu kết cục là <strong>im lặng</strong>. Đó chính là hình dạng của vấn đề mà chương này dạy: sự vắng mặt của một thông điệp mới là phản hồi thường gặp nhất, và nó là thứ mang ít thông tin nhất.</p>`,
    ),

    bi(
      `<h3>🔍 Cách tự kiểm — measure it rather than believe it</h3>
<p>Every claim on the previous slides can be checked in one line on a machine you can log into.</p>
<pre><code class="language-bash">ping -c 3 1.1.1.1                    # basic reachability, and read the TTL
ping -c 2 -W 2 172.17.99.99          # an address in your own subnet with nothing at it
sysctl net.ipv4.icmp_echo_ignore_all # is this host configured to ignore pings?</code></pre>
<pre><code class="language-plaintext">64 bytes from 1.1.1.1: icmp_seq=3 ttl=55 time=26.6 ms
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 26.640/27.497/28.579/0.807 ms</code></pre>
<p>Then the empty address in the same subnet:</p>
<pre><code class="language-plaintext">2 packets transmitted, 0 received, 100% packet loss, time 1018ms</code></pre>
<div class="callout ok"><strong>What each result proves.</strong> <code>ttl=55</code> means nine routers stood between the reply and you — subtract from 64. <code>mdev</code> is jitter: a high value with low loss is congestion, not a break. And the second command produces <strong>no error message at all</strong>, which is the point: the textbook's "host unreachable" is a message that often is not sent. Treat a silent failure as "no information yet", not as "the host is down".</div>`,
      `<h3>🔍 Cách tự kiểm — hãy đo thay vì tin</h3>
<p>Mọi khẳng định ở các slide trên đều kiểm được bằng một dòng lệnh trên một cái máy bạn đăng nhập được.</p>
<pre><code class="language-bash">ping -c 3 1.1.1.1                    # kiểm tới được không, và đọc giá trị TTL
ping -c 2 -W 2 172.17.99.99          # một địa chỉ trong subnet của bạn mà không có gì ở đó
sysctl net.ipv4.icmp_echo_ignore_all # máy này có được cấu hình để bỏ qua ping không?</code></pre>
<pre><code class="language-plaintext">64 bytes from 1.1.1.1: icmp_seq=3 ttl=55 time=26.6 ms
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 26.640/27.497/28.579/0.807 ms</code></pre>
<p>Rồi tới cái địa chỉ trống trong cùng subnet:</p>
<pre><code class="language-plaintext">2 packets transmitted, 0 received, 100% packet loss, time 1018ms</code></pre>
<div class="callout ok"><strong>Mỗi kết quả chứng minh điều gì.</strong> <code>ttl=55</code> nghĩa là có chín router đứng giữa gói trả lời và bạn — lấy 64 trừ đi. <code>mdev</code> là độ giật: giá trị cao mà mất gói thấp là nghẽn chứ không phải đứt. Và câu lệnh thứ hai cho ra <strong>hoàn toàn không một thông báo lỗi nào</strong>, và đó chính là điều đáng nói: cái "host unreachable" trong sách là một thông điệp thường không được gửi. Hãy coi một cú hỏng im lặng là "chưa có thông tin gì", chứ không phải "máy đó chết rồi".</div>`,
    ),

    bi(
      `<div class="pitfall co-tieu-de"><strong>Trap 1 — expecting an error message when a ping fails.</strong> <b>Symptom:</b> 100% packet loss and no explanation, which people read as "something is badly broken". Measured on a real server: an empty address in your own subnet produces exactly that. Silence is the normal case.</div>
<div class="pitfall co-tieu-de"><strong>Trap 2 — thinking ICMP makes IP reliable.</strong> It reports; it does not repair. <b>Symptom:</b> the belief that a successful ping means the service is up, which is the single most common wrong conclusion in network support.</div>
<div class="pitfall co-tieu-de"><strong>Trap 3 — writing an ICMP firewall rule by type number without checking the version.</strong> Type 8 is echo in ICMPv4 and something else entirely in ICMPv6. <b>Symptom:</b> a rule that appears to work and silently applies to only half your traffic.</div>
<div class="pitfall co-tieu-de"><strong>Trap 4 — blocking all ICMPv6.</strong> <b>Symptom:</b> hosts cannot resolve neighbours, cannot obtain addresses, and cannot discover the path MTU. It presents as "IPv6 is not supported here" and the cause is one firewall line.</div>
<div class="pitfall co-tieu-de"><strong>Trap 5 — reading TTL as a time.</strong> It is a hop counter and always has been; IPv6 renamed it Hop Limit for exactly that reason. <b>Symptom:</b> confusion about why a fast link and a slow link decrement it identically.</div>`,
      `<div class="pitfall co-tieu-de"><strong>Bẫy 1 — trông chờ một thông báo lỗi khi ping hỏng.</strong> <b>Triệu chứng:</b> mất 100% gói và không có lời giải thích nào, và người ta đọc thành "có gì đó hỏng nặng". Đo trên máy chủ thật: một địa chỉ trống trong chính subnet của bạn cho ra đúng như vậy. Im lặng mới là trường hợp bình thường.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 2 — tưởng ICMP làm IP trở nên tin cậy.</strong> Nó báo cáo; nó không sửa chữa. <b>Triệu chứng:</b> niềm tin rằng ping được nghĩa là dịch vụ đang sống, và đó là kết luận sai hay gặp nhất trong nghề hỗ trợ mạng.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 3 — viết luật tường lửa ICMP theo số type mà không kiểm phiên bản.</strong> Type 8 là echo trong ICMPv4 và là một thứ hoàn toàn khác trong ICMPv6. <b>Triệu chứng:</b> một luật nhìn như đang chạy mà lặng lẽ chỉ áp lên một nửa lưu lượng.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 4 — chặn toàn bộ ICMPv6.</strong> <b>Triệu chứng:</b> host không phân giải được láng giềng, không lấy được địa chỉ, và không tìm ra được path MTU. Nó hiện ra thành "ở đây không hỗ trợ IPv6" mà nguyên nhân là một dòng tường lửa.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 5 — đọc TTL như một khoảng thời gian.</strong> Nó là bộ đếm chặng và luôn luôn là vậy; IPv6 đổi tên thành Hop Limit đúng vì lẽ đó. <b>Triệu chứng:</b> lúng túng không hiểu vì sao một đường nhanh và một đường chậm lại giảm nó như nhau.</div>`,
    ),

    bi(
      `<h3>Exercises</h3>
<p><b>E1.</b> A reply arrives with <code>ttl=250</code>. Another arrives with <code>ttl=52</code>. What can you say about each, and what can you not?</p>
<div class="dap-an"><p><b>ttl=250.</b> The nearest standard starting value above 250 is <b>255</b>, used by network equipment such as routers and switches. So the reply crossed <b>5 hops</b>, and the responder is most likely a network device rather than a general-purpose host.</p>
<p><b>ttl=52.</b> The nearest starting value above is <b>64</b> (Linux, macOS, most Unix). So <b>12 hops</b>.</p>
<p><b>What you cannot say.</b> The starting value is a convention, not a rule — a host can be configured with any initial TTL, and some load balancers and middleboxes rewrite it. So "255 means network gear" is a strong hint, never proof. And this counts hops on the <b>return</b> path only; the forward path may be a different length entirely.</p></div>

<p><b>E2.</b> A colleague says: "The server must be down — it does not respond to ping." List three separate reasons this conclusion may be wrong, and give one command that would distinguish between them.</p>
<div class="dap-an"><ol>
<li><b>ICMP is filtered.</b> A firewall or the host itself may drop echo requests by policy. Very common on public servers. The host is fine and the service works.</li>
<li><b>Only the return path is broken.</b> Your request arrived and the reply did not — routing is not symmetric, so one direction can fail alone.</li>
<li><b>The host ignores pings by configuration.</b> On Linux, <code>net.ipv4.icmp_echo_ignore_all=1</code> makes a perfectly healthy machine silent.</li>
</ol>
<p><b>The command that distinguishes them:</b></p>
<pre><code class="language-bash">curl -fsS -o /dev/null -w "%{http_code}\\n" https://the-server/health</code></pre>
<p>If that returns 200, the server is emphatically not down and the ping result was noise. Testing the <b>actual service</b> is always more informative than testing ICMP, because it exercises every layer including the one you care about.</p>
<p class="ghi-chu">The general principle: ping tests layers 1 to 3. If your question is about layer 7, ask layer 7.</p></div>

<p><b>E3.</b> ★ A web application behind a VPN works for small pages and hangs forever on large ones. The TCP handshake succeeds. Explain the most likely cause and the two commands that would confirm it.</p>
<div class="dap-an"><p><b>A path MTU black hole.</b> The VPN adds encapsulation overhead, lowering the real MTU below 1500. Large responses are sent as full-size packets with DF set, a router on the path must drop them, and the ICMP "Fragmentation Needed" message that would report this is being blocked by a firewall. The sender never learns, never reduces its packet size, and retransmits the same oversized packets forever.</p>
<p><b>Why the handshake succeeds.</b> SYN, SYN-ACK and ACK are tiny. So is a small page. Only responses large enough to fill a packet hit the limit — which is exactly why the symptom looks like "some pages work and some do not".</p>
<p><b>Confirming it:</b></p>
<pre><code class="language-bash">ping -M do -s 1472 &lt;server&gt;    # 1472 + 28 = 1500 — does a full-size packet get through?
ping -M do -s 1372 &lt;server&gt;    # 1372 + 28 = 1400 — does a smaller one?</code></pre>
<p>If the first fails and the second succeeds, the path MTU is below 1500 and you have found it. On a real server the boundary produced this exact message:</p>
<pre><code class="language-plaintext">ping: local error: message too long, mtu=1500</code></pre>
<p><b>The fix</b> is either to permit ICMP type 3 code 4, or to clamp the TCP MSS on the tunnel so that the sender never builds a packet too large in the first place.</p></div>`,
      `<h3>Bài tập</h3>
<p><b>E1.</b> Một gói trả lời về với <code>ttl=250</code>. Một gói khác về với <code>ttl=52</code>. Bạn nói được gì về mỗi cái, và không nói được gì?</p>
<div class="dap-an"><p><b>ttl=250.</b> Giá trị khởi đầu chuẩn gần nhất ở trên 250 là <b>255</b>, vốn dùng cho thiết bị mạng như router và switch. Vậy gói trả lời đi qua <b>5 chặng</b>, và bên trả lời nhiều khả năng là một thiết bị mạng chứ không phải một máy tính thông thường.</p>
<p><b>ttl=52.</b> Giá trị khởi đầu gần nhất ở trên là <b>64</b> (Linux, macOS, phần lớn Unix). Vậy là <b>12 chặng</b>.</p>
<p><b>Thứ bạn không nói được.</b> Giá trị khởi đầu là quy ước chứ không phải luật — một máy có thể được cấu hình TTL ban đầu tuỳ ý, và một số bộ cân bằng tải hay thiết bị trung gian viết lại nó. Nên "255 nghĩa là thiết bị mạng" là một gợi ý mạnh, không bao giờ là bằng chứng. Và con số này chỉ đếm chặng trên đường <b>về</b>; đường đi có thể dài hoàn toàn khác.</p></div>

<p><b>E2.</b> Một đồng nghiệp nói: "Máy chủ chết rồi — nó không đáp ping." Hãy liệt kê ba lý do riêng biệt khiến kết luận đó có thể sai, và cho một câu lệnh phân biệt được chúng.</p>
<div class="dap-an"><ol>
<li><b>ICMP bị lọc.</b> Một tường lửa, hoặc chính cái host, có thể vứt gói echo request theo chính sách. Rất phổ biến trên máy chủ công cộng. Máy vẫn khoẻ và dịch vụ vẫn chạy.</li>
<li><b>Chỉ đường về hỏng.</b> Gói yêu cầu của bạn tới nơi còn gói trả lời thì không — định tuyến không đối xứng, nên một chiều có thể hỏng riêng.</li>
<li><b>Host bỏ qua ping do cấu hình.</b> Trên Linux, <code>net.ipv4.icmp_echo_ignore_all=1</code> làm một cái máy hoàn toàn khoẻ mạnh trở nên im lặng.</li>
</ol>
<p><b>Câu lệnh phân biệt được chúng:</b></p>
<pre><code class="language-bash">curl -fsS -o /dev/null -w "%{http_code}\\n" https://the-server/health</code></pre>
<p>Nếu nó trả về 200 thì máy chủ dứt khoát không chết và kết quả ping chỉ là nhiễu. Thử <b>chính cái dịch vụ</b> luôn luôn cho nhiều thông tin hơn là thử ICMP, bởi nó vận hành mọi tầng, kể cả cái tầng bạn quan tâm.</p>
<p class="ghi-chu">Nguyên tắc chung: ping kiểm tầng 1 tới 3. Nếu câu hỏi của bạn là về tầng 7 thì hãy hỏi tầng 7.</p></div>

<p><b>E3.</b> ★ Một ứng dụng web đứng sau VPN chạy tốt với trang nhỏ và treo vĩnh viễn với trang lớn. Bắt tay TCP thì thành công. Hãy giải thích nguyên nhân nhiều khả năng nhất và hai câu lệnh xác nhận nó.</p>
<div class="dap-an"><p><b>Một hố đen path MTU.</b> VPN thêm phần bọc nên MTU thật tụt xuống dưới 1500. Các gói trả lời lớn được gửi ở kích thước tối đa kèm bit DF, một router trên đường buộc phải vứt chúng, và thông điệp ICMP "Fragmentation Needed" đáng lẽ báo chuyện này thì đang bị một tường lửa chặn. Bên gửi không bao giờ biết, không bao giờ giảm kích thước gói, và cứ gửi lại đúng những gói quá khổ ấy mãi mãi.</p>
<p><b>Vì sao bắt tay lại thành công.</b> SYN, SYN-ACK và ACK đều bé tí. Trang nhỏ cũng vậy. Chỉ những gói trả lời đủ lớn để lấp đầy một gói tin mới chạm ngưỡng — và đó đúng là lý do triệu chứng trông như "trang này được trang kia không".</p>
<p><b>Xác nhận:</b></p>
<pre><code class="language-bash">ping -M do -s 1472 &lt;may-chu&gt;    # 1472 + 28 = 1500 — gói cỡ tối đa có lọt không?
ping -M do -s 1372 &lt;may-chu&gt;    # 1372 + 28 = 1400 — gói nhỏ hơn thì sao?</code></pre>
<p>Nếu cái đầu hỏng và cái sau chạy thì path MTU nằm dưới 1500 và bạn đã tìm ra nó. Trên một máy chủ thật, cái ngưỡng đó sinh ra đúng thông báo này:</p>
<pre><code class="language-plaintext">ping: local error: message too long, mtu=1500</code></pre>
<p><b>Cách sửa</b> là hoặc cho ICMP type 3 code 4 đi qua, hoặc kẹp giá trị MSS của TCP trên đường hầm để bên gửi ngay từ đầu không dựng ra gói quá lớn.</p></div>`,
    ),

    cq(37, [
      ['CQ13.1', 'What happens do we use IPv4 in nowadays? <em>— content belongs to Chapter 11; answered in full in Lesson 11.1 (IPv4 exhaustion in 2011, NAT and CGNAT as patches, and the end-to-end connectivity they cost).</em>',
        'What happens do we use IPv4 in nowadays? <em>— nội dung thuộc Chương 11; đã trả lời đầy đủ ở bài 11.1 (IPv4 cạn năm 2011, NAT và CGNAT là hai bản vá, và cái giá về kết nối đầu-cuối mà chúng phải trả).</em>'],
    ]),

    bi(
      `<div class="note-ct"><p><strong>About this question.</strong> Quoted exactly as published, including the grammar. It asks about <strong>section 11.2, IPv4 Issues</strong> — Chapter 11, session 35 — and has nothing to do with ICMP.</p>
<p>This is the same drift reported since session 19: the question numbering runs about one chapter behind the session plan. The full answer is in lesson 11.1. In summary: 2^32 is 4,294,967,296 addresses for 8 billion people; IANA allocated the last blocks in 2011; NAT and then CGNAT bought two decades of time at the cost of end-to-end connectivity, so that behind CGNAT no inbound connection is possible at all because there is no public address to forward from.</p></div>`,
      `<div class="note-ct"><p><strong>Về câu hỏi này.</strong> Trích nguyên văn như đã công bố, kể cả chỗ sai ngữ pháp. Nó hỏi về <strong>mục 11.2, IPv4 Issues</strong> — Chương 11, buổi 35 — và không liên quan gì tới ICMP.</p>
<p>Đây vẫn là độ trôi đã nêu từ buổi 19: cách đánh số câu hỏi chạy chậm hơn kế hoạch buổi học khoảng một chương. Câu trả lời đầy đủ nằm ở bài 11.1. Tóm tắt: 2^32 là 4.294.967.296 địa chỉ cho 8 tỷ người; IANA cấp phát những khối cuối cùng năm 2011; NAT rồi tới CGNAT mua thêm hai thập kỷ với cái giá là kết nối đầu-cuối, đến mức đứng sau CGNAT thì hoàn toàn không có kết nối vào nào là khả thi, vì không có địa chỉ công cộng nào để mà chuyển tiếp từ đó.</p></div>`,
    ),
  ].join('\n'),
};

/* ────────────── Lesson 12.2 — session 38 + Lab 2.3 (39–40) ─────────────── */

const L2 = {
  title: '12.2 — Ping, traceroute and Lab 2.3 (FLM sessions 38-40)|||12.2 — Ping, traceroute và Lab 2.3 (buổi 38-40 của FLM)',
  slug: 'nwc204-12-2-ping-traceroute-va-lab-2-3',
  type: 'DOCUMENT',
  description: 'Buổi 38 và Lab 2.3: đọc từng trường trong kết xuất ping và trường nào chứng minh điều gì, traceroute hoạt động bằng mẹo TTL chứ không có giao thức riêng, đọc một bản trace thật với "no reply" và nhãn asymm mà không kết luận sai, path MTU discovery đo bằng cờ -M do, hố đen path MTU khi ICMP bị chặn, thang ping năm bậc tách được lỗi mạng khỏi lỗi DNS, ping trong script với exit code và các cờ -c -W, và ranh giới thật của ping: nó không bao giờ chạm tới tầng 4. Mọi số liệu đo trên máy chủ thật.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 12 · Lesson 12.2 · FLM sessions 38, 39, 40 of 60 · CLO6, CLO9 · Cisco Module 13</span>
<h2>Two tools, and knowing exactly what each one proves</h2>
<p class="lead">After this lesson you can read a ping line and extract loss, latency, jitter and hop count from it; explain how traceroute works with no special protocol; recognise the two things in a trace that look like faults and are not; and find a path MTU black hole with two commands.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 38 — "12.2 Ping and Traceroute Testing · 12.3 Integrate AI Tools for Explaining Concepts (Self Learning)"; buổi 39-40 — "Lab 2.3: Use Ping and Traceroute to Test Network Connectivity · Use AI Tools for Configuration and Troubleshooting"; tài liệu "13.3.2 Lab Manual (or 13.2.7 Packet Tracer, 13.3.1 Packet Tracer)"; ITU: U</p>
<p><strong>Opening question.</strong> Here is a real trace, run from a production server:</p>
<pre><code class="language-plaintext"> 1:  no reply
 2:  10.132.133.186      1.147ms
 3:  113.171.33.198      1.067ms asymm  5
 4:  113.171.31.249     28.094ms asymm  8</code></pre>
<p>Hop 1 did not answer, but hops 2, 3 and 4 answered perfectly. Three of the lines carry a note saying <code>asymm</code> with a number. Which of these is a fault, and what does <code>asymm 5</code> mean?</p>
<div class="callout"><strong>Sessions 39 and 40 are type U</strong> — Use. The lab is marked on doing, and on explaining what each result rules in and rules out. A screenshot of a successful ping is not a deliverable; a sentence saying what that success proves is.</div>
<p class="note">★ marks material added by cuongthai.com beyond Cisco Module 13, measured rather than quoted.</p>`,
      `<span class="eyebrow">NWC204 · Chương 12 · Bài 12.2 · Buổi 38, 39, 40/60 của FLM · CLO6, CLO9 · Cisco Module 13</span>
<h2>Hai công cụ, và biết chính xác mỗi cái chứng minh được gì</h2>
<p class="lead">Học xong bài này bạn đọc một dòng ping là rút ra được tỷ lệ mất gói, độ trễ, độ giật và số chặng; giải thích được traceroute chạy bằng gì mà không cần giao thức riêng; nhận ra hai thứ trong một bản trace trông như lỗi mà không phải; và tìm ra một hố đen path MTU bằng hai câu lệnh.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 38 — "12.2 Ping and Traceroute Testing · 12.3 Integrate AI Tools for Explaining Concepts (Self Learning)"; buổi 39-40 — "Lab 2.3: Use Ping and Traceroute to Test Network Connectivity · Use AI Tools for Configuration and Troubleshooting"; tài liệu "13.3.2 Lab Manual (or 13.2.7 Packet Tracer, 13.3.1 Packet Tracer)"; ITU: U</p>
<p><strong>Câu hỏi mở đầu.</strong> Đây là một bản trace thật, chạy từ một máy chủ sản xuất:</p>
<pre><code class="language-plaintext"> 1:  no reply
 2:  10.132.133.186      1.147ms
 3:  113.171.33.198      1.067ms asymm  5
 4:  113.171.31.249     28.094ms asymm  8</code></pre>
<p>Chặng 1 không trả lời, nhưng chặng 2, 3 và 4 trả lời hoàn hảo. Ba trong số các dòng có kèm ghi chú <code>asymm</code> và một con số. Cái nào trong số này là lỗi, và <code>asymm 5</code> nghĩa là gì?</p>
<div class="callout"><strong>Buổi 39 và 40 là loại U</strong> — Use, tức Dùng. Bài lab chấm theo việc bạn LÀM, và theo việc bạn giải thích được mỗi kết quả loại trừ được điều gì. Một ảnh chụp cú ping thành công không phải sản phẩm; một câu nói được cú thành công ấy chứng minh điều gì thì mới là.</div>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 13, đo thật chứ không trích lại.</p>`,
    ),

    walkHead('nwc204-ch12', 10, 23,
      'Slides 10–23 cover FLM session 38 (12.2 and 12.3) and Lab 2.3 in sessions 39–40, plus the ★ material measured on a real server.',
      'Slide 10–23 là buổi 38 của FLM (12.2 và 12.3) và Lab 2.3 ở buổi 39–40, kèm phần ★ đo trên máy chủ thật.'),

    walk('nwc204-ch12', [
      [10, 'Reading ping output line by line',
        `<p>Every field in a ping line answers a different question, and using only the first one wastes most of the tool.</p>
<ul>
<li><strong>64 bytes</strong> — the payload size, not the packet size. Add 8 bytes of ICMP header and 20 of IP to get what actually went on the wire.</li>
<li><strong>icmp_seq</strong> — the sequence number. <strong>Gaps here are lost packets.</strong> This is the only place loss becomes visible per-packet rather than as a percentage at the end.</li>
<li><strong>ttl=55</strong> — ★ hop count, for free: 64 − 55 = nine routers between the replying host and you.</li>
<li><strong>time=26.6 ms</strong> — round trip, measured by the sender. Not a one-way latency.</li>
<li><strong>mdev = 0.807</strong> — mean deviation, which is <strong>jitter</strong>.</li>
</ul>
<p><strong>The field people ignore is mdev, and it is the diagnostic one.</strong> Low loss with a high mdev means the path is congested — packets are arriving, but their timing is erratic. Low loss with a low mdev means the path is healthy and slow, which is a different problem with a different fix. Loss without jitter usually means a policer dropping a fixed proportion, not congestion at all.</p>`,
        `<p>Mỗi trường trong một dòng ping trả lời một câu hỏi khác nhau, và chỉ dùng trường đầu tiên là phí gần hết công cụ.</p>
<ul>
<li><strong>64 bytes</strong> — kích thước phần tải, không phải kích thước gói tin. Cộng thêm 8 byte tiêu đề ICMP và 20 byte tiêu đề IP mới ra thứ thật sự đi trên dây.</li>
<li><strong>icmp_seq</strong> — số thứ tự. <strong>Chỗ khuyết ở đây là gói bị mất.</strong> Đây là chỗ duy nhất mà mất gói hiện ra theo từng gói chứ không phải một tỷ lệ phần trăm ở cuối.</li>
<li><strong>ttl=55</strong> — ★ số chặng, miễn phí: 64 − 55 = chín router giữa máy trả lời và bạn.</li>
<li><strong>time=26.6 ms</strong> — thời gian khứ hồi, do bên gửi đo. Không phải độ trễ một chiều.</li>
<li><strong>mdev = 0.807</strong> — độ lệch trung bình, tức <strong>độ giật (jitter)</strong>.</li>
</ul>
<p><strong>Trường người ta hay bỏ qua là mdev, mà nó lại là trường có tính chẩn đoán.</strong> Mất gói thấp mà mdev cao nghĩa là đường đang nghẽn — gói vẫn tới, nhưng thời điểm tới thất thường. Mất gói thấp mà mdev thấp nghĩa là đường khoẻ mạnh và chậm, đó là một vấn đề khác với cách sửa khác. Mất gói mà không giật thì thường là có một bộ khống chế đang vứt một tỷ lệ cố định, chứ không phải nghẽn.</p>`],

      [11, '12.2 How traceroute works — the TTL trick',
        `<p>Traceroute has no protocol of its own. It abuses the TTL field, one hop at a time, and the whole tool rests on an obligation from Chapter 12.1: <strong>a router that decrements TTL to zero must report it</strong>.</p>
<ol>
<li>Send a packet with <strong>TTL=1</strong>. The first router decrements it to zero, discards it, and sends Time Exceeded. Its source address is hop 1.</li>
<li>Send another with <strong>TTL=2</strong>. It dies at the second router, which identifies itself the same way.</li>
<li>Continue until a packet survives all the way. The destination replies differently — with a port-unreachable or an echo reply, depending on the implementation — and that difference is how the trace knows to stop.</li>
</ol>
<p><strong>The crucial limitation.</strong> Traceroute maps the <strong>forward</strong> path only. Each Time Exceeded message finds its own way home, by whatever route the network chooses at that moment. So the list of hops you see is the path out, and you learn nothing at all about the path back — which matters more than it sounds, as the next slide shows.</p>`,
        `<p>Traceroute không có giao thức riêng nào cả. Nó lạm dụng trường TTL, mỗi lần một chặng, và toàn bộ công cụ dựa trên một nghĩa vụ đã nêu ở bài 12.1: <strong>router nào giảm TTL về 0 thì phải báo lại</strong>.</p>
<ol>
<li>Gửi một gói với <strong>TTL=1</strong>. Router đầu tiên giảm nó về 0, vứt đi, rồi gửi Time Exceeded. Địa chỉ nguồn của gói đó chính là chặng 1.</li>
<li>Gửi gói nữa với <strong>TTL=2</strong>. Nó chết ở router thứ hai, và router đó tự giới thiệu theo đúng cách ấy.</li>
<li>Cứ tiếp tục cho tới khi một gói sống sót tới đích. Đích trả lời theo kiểu khác — port-unreachable hoặc echo reply, tuỳ cách cài đặt — và chính sự khác biệt đó cho traceroute biết là dừng được rồi.</li>
</ol>
<p><strong>Giới hạn then chốt.</strong> Traceroute chỉ vẽ ra đường <strong>đi</strong>. Mỗi gói Time Exceeded tự tìm đường về nhà, theo bất kỳ tuyến nào mà mạng chọn vào thời điểm đó. Nên danh sách các chặng bạn thấy là đường ra, và bạn hoàn toàn không biết gì về đường về — chuyện này quan trọng hơn vẻ ngoài của nó, như slide sau cho thấy.</p>`],

      [12, '★ A real trace, and the two things that confuse people',
        `<p>This is the answer to the opening question, and both notes in that output mean something precise.</p>
<p><strong>"no reply" at hop 1, with hops 2 to 10 answering.</strong> Nothing is broken. That router simply does not generate Time Exceeded messages — many do not, by policy, because generating them costs CPU and reveals topology. <strong>A missing hop in the middle of a working trace is almost never the fault.</strong> The proof is the hops after it: if hop 4 answers, packets are reaching hop 4, which means they passed through hop 1.</p>
<p><strong><code>asymm 5</code>.</strong> <code>tracepath</code> is telling you that the reply from that hop came back over a path with a <em>different number of hops</em> than the one going out. The return route is not the mirror of the forward route. This is completely normal on the public Internet, where each network chooses its own outbound policy independently.</p>
<p>★ <strong>Both facts together in the real measurement.</strong> <code>tracepath</code> reached hop 10 without arriving at 1.1.1.1, while a direct <code>ping</code> to the same address returned <code>ttl=55</code>, implying nine hops on the way back. Forward ten or more, backward nine. Both numbers are true, and <code>asymm</code> is the tool saying so out loud.</p>`,
        `<p>Đây là lời giải cho câu hỏi mở đầu, và cả hai ghi chú trong kết xuất đó đều có nghĩa chính xác.</p>
<p><strong>"no reply" ở chặng 1, trong khi chặng 2 tới 10 vẫn trả lời.</strong> Không có gì hỏng cả. Router đó đơn giản là không sinh ra thông điệp Time Exceeded — nhiều router không sinh, theo chính sách, vì sinh ra chúng tốn CPU và để lộ cấu trúc mạng. <strong>Một chặng khuyết ở giữa một bản trace đang chạy tốt gần như không bao giờ là cái hỏng.</strong> Bằng chứng là các chặng sau nó: nếu chặng 4 trả lời thì gói tin đang tới được chặng 4, nghĩa là chúng đã đi qua chặng 1.</p>
<p><strong><code>asymm 5</code>.</strong> <code>tracepath</code> đang nói với bạn rằng gói trả lời từ chặng đó quay về theo một đường có <em>số chặng khác</em> với đường đi ra. Tuyến về không phải là ảnh gương của tuyến đi. Chuyện này hoàn toàn bình thường trên Internet công cộng, nơi mỗi mạng tự chọn chính sách đi ra của mình một cách độc lập.</p>
<p>★ <strong>Cả hai sự thật cùng lúc trong phép đo thật.</strong> <code>tracepath</code> đi tới chặng 10 mà vẫn chưa tới 1.1.1.1, trong khi một cú <code>ping</code> thẳng tới cùng địa chỉ đó trả về <code>ttl=55</code>, tức chín chặng trên đường về. Đi mười chặng trở lên, về chín chặng. Cả hai con số đều đúng, và <code>asymm</code> là công cụ đang nói to điều đó ra.</p>`],

      [13, 'Two more things that look like faults and are not',
        `<p>Beyond "no reply" and <code>asymm</code>, two more patterns produce false alarms.</p>
<p><strong>Response times that rise then fall.</strong> A hop showing 80 ms followed by a hop showing 25 ms looks impossible — how can a further router be closer? It is not closer. ICMP replies are <strong>low priority</strong> work for a router: its job is forwarding, and generating an error message happens when there is time to spare. A busy router answers slowly while forwarding your traffic perfectly. The time in a traceroute line measures how quickly <em>that router replied</em>, not how long your traffic takes to cross it.</p>
<p><strong>The trace never reaches the target.</strong> Many hosts, and most public-facing services, drop ICMP entirely. A trace that stops three hops short may have reached the destination's network and been ignored. It says nothing about whether the service is working — which is the subject of the next slide.</p>
<p><strong>The general rule:</strong> in traceroute output, only the <em>last</em> hop that answers tells you something definite, and a gap before it tells you nothing at all.</p>`,
        `<p>Ngoài "no reply" và <code>asymm</code>, có hai kiểu nữa gây báo động giả.</p>
<p><strong>Thời gian đáp tăng lên rồi lại giảm xuống.</strong> Một chặng hiện 80 ms rồi chặng sau hiện 25 ms thì nhìn như bất khả — sao một router xa hơn lại gần hơn được? Nó không gần hơn. Gói trả lời ICMP là việc <strong>ưu tiên thấp</strong> đối với một router: việc chính của nó là chuyển tiếp, còn sinh ra một thông báo lỗi thì làm khi rảnh. Một router bận sẽ đáp chậm trong lúc vẫn chuyển tiếp lưu lượng của bạn hoàn hảo. Con số thời gian trong một dòng traceroute đo xem <em>router đó trả lời nhanh thế nào</em>, chứ không đo lưu lượng của bạn mất bao lâu để đi qua nó.</p>
<p><strong>Bản trace không bao giờ tới được đích.</strong> Nhiều máy, và phần lớn dịch vụ hướng ra công cộng, vứt bỏ ICMP hoàn toàn. Một bản trace dừng trước đích ba chặng có thể đã tới được mạng của đích rồi bị lờ đi. Nó không nói gì về chuyện dịch vụ có chạy hay không — đó là chủ đề của slide sau.</p>
<p><strong>Quy tắc chung:</strong> trong kết xuất traceroute, chỉ có chặng <em>cuối cùng</em> có trả lời là nói được điều gì chắc chắn, còn một chỗ khuyết trước nó thì không nói lên gì cả.</p>`],

      [14, '★ Path MTU discovery, measured',
        `<p>The <strong>MTU</strong> is the largest packet a link will carry — 1500 bytes on ordinary Ethernet. The <strong>path MTU</strong> is the smallest MTU along an entire route, and it is what actually limits you. Finding it takes two flags.</p>
<ul>
<li><code>-M do</code> sets the <strong>Don't Fragment</strong> bit: deliver this whole or report back.</li>
<li><code>-s N</code> sets the payload size. Add 8 (ICMP header) and 20 (IP header) to get the packet size.</li>
</ul>
<p>★ <strong>Measured on a real server.</strong> <code>-s 1472</code> gives 1472 + 28 = exactly 1500, and it went through: 0% loss. <code>-s 1473</code> gives 1501, one byte over, and produced:</p>
<pre><code class="language-plaintext">ping: local error: message too long, mtu=1500</code></pre>
<p><strong>The method.</strong> Increase <code>-s</code> until it breaks; the last size that worked, plus 28, is the path MTU. This is genuinely useful when a VPN or a tunnel has quietly lowered the MTU below 1500, because every symptom of that is indirect and confusing — which is the next slide.</p>`,
        `<p><strong>MTU</strong> là gói tin lớn nhất mà một đường truyền chịu chở — 1500 byte trên Ethernet thông thường. <strong>Path MTU</strong> là giá trị MTU nhỏ nhất dọc theo cả tuyến đường, và đó mới là thứ thật sự giới hạn bạn. Tìm ra nó cần hai cái cờ.</p>
<ul>
<li><code>-M do</code> bật bit <strong>Don't Fragment</strong>: giao nguyên cái này, hoặc báo lại.</li>
<li><code>-s N</code> đặt kích thước phần tải. Cộng 8 (tiêu đề ICMP) và 20 (tiêu đề IP) để ra kích thước gói.</li>
</ul>
<p>★ <strong>Đo trên máy chủ thật.</strong> <code>-s 1472</code> cho 1472 + 28 = đúng 1500, và nó đi lọt: mất 0% gói. <code>-s 1473</code> cho 1501, hơn đúng một byte, và sinh ra:</p>
<pre><code class="language-plaintext">ping: local error: message too long, mtu=1500</code></pre>
<p><strong>Phương pháp.</strong> Tăng <code>-s</code> cho tới khi hỏng; kích thước cuối cùng còn chạy, cộng 28, chính là path MTU. Cách này thật sự hữu ích khi một đường VPN hay một đường hầm đã lặng lẽ hạ MTU xuống dưới 1500, bởi vì mọi triệu chứng của chuyện đó đều gián tiếp và khó hiểu — và đó là slide tiếp theo.</p>`],

      [15, '★ When ICMP is blocked, PMTUD becomes a black hole',
        `<p>This is the most valuable thing in the chapter for anyone who runs a server, and it is a direct consequence of two facts already established: ICMP is how "too big" gets reported, and an ICMP message can itself be dropped.</p>
<p><strong>With ICMP allowed.</strong> The sender emits a 1500-byte packet with DF set. A router on a 1400-byte link cannot forward it, so it sends back ICMP type 3 code 4 carrying the number 1400. The sender retries at 1400. Everything works, and nobody notices anything happened.</p>
<p><strong>With ICMP blocked by a firewall.</strong> The router still cannot forward the packet, and still drops it. The message that would explain this never arrives. The sender has no idea, so it retransmits the same oversized packet, forever.</p>
<p><strong>The symptom is the part worth memorising.</strong> The TCP handshake succeeds, because SYN and ACK are tiny. Small requests work. Large responses hang forever. In a browser this looks like "some pages load and some never finish", which sounds like an application bug and is not one.</p>
<p>★ Treat "some pages load, some never finish" as a path MTU black hole until proven otherwise. Two <code>ping -M do</code> commands settle it in ten seconds.</p>`,
        `<p>Đây là thứ giá trị nhất trong chương này với bất kỳ ai vận hành một máy chủ, và nó là hệ quả trực tiếp của hai sự thật đã nêu: ICMP là cách mà chuyện "quá lớn" được báo cáo, và bản thân một thông điệp ICMP cũng có thể bị rơi.</p>
<p><strong>Khi ICMP được cho qua.</strong> Bên gửi phát một gói 1500 byte có bật bit DF. Một router trên đường truyền 1400 byte không chuyển tiếp được, nên nó gửi trả một gói ICMP type 3 code 4 mang theo con số 1400. Bên gửi gửi lại ở kích thước 1400. Mọi thứ chạy, và không ai để ý là vừa có chuyện gì.</p>
<p><strong>Khi ICMP bị một tường lửa chặn.</strong> Router vẫn không chuyển tiếp được gói đó, và vẫn vứt nó đi. Thông điệp lẽ ra giải thích chuyện này thì không bao giờ tới nơi. Bên gửi chẳng biết gì cả, nên nó gửi lại đúng cái gói quá khổ ấy, mãi mãi.</p>
<p><strong>Triệu chứng mới là phần đáng thuộc lòng.</strong> Bắt tay TCP thành công, vì SYN và ACK đều bé tí. Các yêu cầu nhỏ thì chạy. Các gói trả lời lớn thì treo vĩnh viễn. Nhìn từ trình duyệt thì nó trông như "trang này tải được, trang kia không bao giờ xong", nghe như một con bọ của ứng dụng mà không phải.</p>
<p>★ Hãy coi "trang này tải được, trang kia không bao giờ xong" là một hố đen path MTU cho tới khi chứng minh được điều ngược lại. Hai câu lệnh <code>ping -M do</code> giải quyết chuyện đó trong mười giây.</p>`],

      [16, 'What ping proves, and what it does not',
        `<p><strong>A successful ping proves four things,</strong> and they are worth naming precisely because people usually claim more.</p>
<ul>
<li>Layer 1: a physical path exists in both directions.</li>
<li>Layer 2: frames are being delivered on each segment.</li>
<li>Layer 3: IP routing works <em>both ways</em> — the request got there and the reply got back.</li>
<li>The host is powered on and has a working IP stack.</li>
</ul>
<p><strong>What it never proves</strong> is that the application works. Ping does not touch layer 4 or above. A server can answer every echo request perfectly while nginx is stopped and port 443 refuses every connection.</p>
<p><strong>A failed ping proves almost nothing at all.</strong> It does not prove the host is down, that routing is broken, or that the service is unavailable — because many hosts and most public services drop ICMP by policy, and because the return path can fail alone.</p>
<p>"It does not ping" is a starting point. It is never a diagnosis, and presenting it as one is the most common mistake in network support.</p>`,
        `<p><strong>Một cú ping thành công chứng minh bốn điều,</strong> và đáng gọi tên chúng cho chính xác bởi vì người ta thường tuyên bố nhiều hơn thế.</p>
<ul>
<li>Tầng 1: có một đường vật lý, theo cả hai chiều.</li>
<li>Tầng 2: khung đang được giao trên từng đoạn mạng.</li>
<li>Tầng 3: định tuyến IP chạy <em>theo cả hai chiều</em> — gói yêu cầu tới được đó và gói trả lời về được đây.</li>
<li>Máy đó đang bật và có một ngăn xếp IP hoạt động.</li>
</ul>
<p><strong>Thứ nó không bao giờ chứng minh</strong> là ứng dụng có chạy hay không. Ping không đụng tới tầng 4 trở lên. Một máy chủ có thể đáp mọi gói echo request hoàn hảo trong khi nginx đã dừng và cổng 443 từ chối mọi kết nối.</p>
<p><strong>Một cú ping hỏng thì gần như không chứng minh gì cả.</strong> Nó không chứng minh máy chết, không chứng minh định tuyến hỏng, cũng không chứng minh dịch vụ không dùng được — bởi vì nhiều máy và phần lớn dịch vụ công cộng vứt ICMP theo chính sách, và bởi vì đường về có thể hỏng riêng.</p>
<p>"Nó không ping được" là một điểm xuất phát. Nó không bao giờ là một chẩn đoán, và trình bày nó như một chẩn đoán là lỗi hay gặp nhất trong nghề hỗ trợ mạng.</p>`],

      [17, '12.3 AI tools for troubleshooting — and their limit',
        `<p>The syllabus lists AI tools twice for this chapter: as self-learning in 12.3, and inside Lab 2.3 for "Configuration and Troubleshooting". Both are worth doing properly.</p>
<p><strong>What a model is genuinely good at here.</strong> Explaining what a message type means. Telling you what <code>asymm</code> is. Producing a checklist for a symptom. Turning "large responses hang" into a list of candidate causes to test. All of these are explanation, and you can verify each one with a command.</p>
<p><strong>Where it fails, and why it matters more here than anywhere else in the course.</strong> A model has not seen your network. It will produce a confident, plausible explanation of your symptom that fits many networks and may not fit yours — and troubleshooting is precisely the activity where a plausible wrong answer costs the most, because you act on it and spend an hour at the wrong layer.</p>
<p><strong>The rule that has held all course:</strong> a model proposes, a command decides. Ask it what to test and why; run the test yourself; believe the output.</p>`,
        `<p>Syllabus liệt kê công cụ AI hai lần cho chương này: dưới dạng tự học ở mục 12.3, và bên trong Lab 2.3 cho phần "Configuration and Troubleshooting". Cả hai đều đáng làm cho tử tế.</p>
<p><strong>Thứ mà một mô hình thật sự giỏi ở đây.</strong> Giải thích một loại thông điệp nghĩa là gì. Nói cho bạn biết <code>asymm</code> là gì. Sinh ra một danh sách kiểm cho một triệu chứng. Biến câu "gói trả lời lớn thì treo" thành một danh sách các nguyên nhân khả dĩ để thử. Tất cả những thứ đó đều là giải thích, và bạn kiểm chứng được từng cái bằng một câu lệnh.</p>
<p><strong>Chỗ nó hỏng, và vì sao chuyện đó ở đây quan trọng hơn mọi chỗ khác trong môn.</strong> Mô hình chưa từng nhìn thấy mạng của bạn. Nó sẽ sinh ra một lời giải thích tự tin, hợp lý cho triệu chứng của bạn, một lời giải thích khớp với nhiều mạng và có thể không khớp với mạng của bạn — mà gỡ lỗi đúng là hoạt động mà một đáp án sai trông hợp lý gây thiệt hại nhiều nhất, bởi vì bạn hành động theo nó và mất một tiếng ở sai tầng.</p>
<p><strong>Quy tắc đã đúng suốt cả môn:</strong> mô hình đề xuất, câu lệnh quyết định. Hỏi nó nên thử gì và vì sao; tự tay chạy phép thử; tin vào kết quả.</p>`],

      [18, 'Lab 2.3 — what sessions 39 and 40 ask for',
        `<p>Two deliverables, and the second is the one that separates marks.</p>
<ol>
<li><strong>Use ping and traceroute to test network connectivity.</strong></li>
<li><strong>Use AI tools for configuration and troubleshooting</strong> — and show how you checked what came back.</li>
</ol>
<p>Materials: <strong>13.3.2 Lab Manual</strong>, or the Packet Tracer activities <strong>13.2.7</strong> and <strong>13.3.1</strong>. ITU type <strong>U</strong> — you do it, not watch it.</p>
<p><strong>What actually earns the mark.</strong> Not "ping worked". For each test you run, be able to state <em>what a pass rules out and what a failure rules out</em>. A ping that fails is a fact. A ping that fails while its own gateway answers is a diagnosis — it places the fault beyond the local subnet, which is a real narrowing.</p>
<p><strong>Prepare three sentences</strong> before the assessment: why you tested in the order you did, what the one surprising result was, and what you would test next if you had more time. Those three cover most of what a dialogue-based assessment asks.</p>`,
        `<p>Hai sản phẩm phải nộp, và cái thứ hai mới là chỗ phân hoá điểm.</p>
<ol>
<li><strong>Dùng ping và traceroute để kiểm tra kết nối mạng.</strong></li>
<li><strong>Dùng công cụ AI cho việc cấu hình và gỡ lỗi</strong> — và trình bày cách bạn đã kiểm lại thứ nó trả về.</li>
</ol>
<p>Tài liệu: <strong>13.3.2 Lab Manual</strong>, hoặc hai bài Packet Tracer <strong>13.2.7</strong> và <strong>13.3.1</strong>. ITU loại <strong>U</strong> — bạn LÀM chứ không ngồi xem.</p>
<p><strong>Thứ thật sự được điểm.</strong> Không phải câu "ping chạy". Với mỗi phép thử bạn chạy, hãy nói được <em>một kết quả đạt loại trừ điều gì và một kết quả hỏng loại trừ điều gì</em>. Một cú ping hỏng là một sự kiện. Một cú ping hỏng trong khi cổng ra của chính nó vẫn đáp là một chẩn đoán — nó đặt cái hỏng ra ngoài subnet cục bộ, và đó là một sự thu hẹp thật.</p>
<p><strong>Chuẩn bị sẵn ba câu</strong> trước buổi chấm: vì sao bạn thử theo thứ tự đó, kết quả bất ngờ duy nhất là gì, và bạn sẽ thử gì tiếp nếu có thêm thời gian. Ba câu đó phủ gần hết những gì một buổi chấm vấn đáp hỏi.</p>`],

      [19, 'The ping ladder — test in this order, stop at the first failure',
        `<p>Five steps, bottom up. Each one eliminates everything below it, so stopping at the first failure saves the rest of the session.</p>
<ol>
<li><code>ping 127.0.0.1</code> — is this host's own IP stack alive? If this fails, nothing else is worth testing.</li>
<li><code>ping &lt;my own address&gt;</code> — is the interface configured and up?</li>
<li><code>ping &lt;default gateway&gt;</code> — layers 1 to 3 on my own subnet.</li>
<li><code>ping &lt;a host on another subnet&gt;</code> — routing works.</li>
<li><code>ping 8.8.8.8</code> then <code>ping google.com</code>.</li>
</ol>
<p><strong>Step 5 is the one that saves the most time in real life,</strong> and it is worth doing in exactly that order. If <strong>8.8.8.8 answers and google.com does not, the network is fine and DNS is broken.</strong> Two commands, and you have moved the problem from "the Internet is down" to one specific service.</p>
<p>That single comparison ends more arguments than any other test in this course, and it costs four seconds.</p>`,
        `<p>Năm bước, từ dưới lên. Mỗi bước loại trừ mọi thứ bên dưới nó, nên dừng ở bước hỏng đầu tiên là tiết kiệm được phần còn lại của buổi làm.</p>
<ol>
<li><code>ping 127.0.0.1</code> — ngăn xếp IP của chính máy này còn sống không? Hỏng ở đây thì không có gì khác đáng thử.</li>
<li><code>ping &lt;địa chỉ của chính mình&gt;</code> — cổng mạng đã cấu hình và đã lên chưa?</li>
<li><code>ping &lt;cổng ra mặc định&gt;</code> — tầng 1 tới 3 trên subnet của mình.</li>
<li><code>ping &lt;một host ở subnet khác&gt;</code> — định tuyến chạy.</li>
<li><code>ping 8.8.8.8</code> rồi <code>ping google.com</code>.</li>
</ol>
<p><strong>Bước 5 là bước tiết kiệm nhiều thời gian nhất ngoài đời thật,</strong> và đáng làm đúng theo thứ tự đó. Nếu <strong>8.8.8.8 đáp mà google.com không đáp thì mạng ổn và DNS hỏng.</strong> Hai câu lệnh, và bạn đã dời vấn đề từ "Internet chết rồi" về đúng một dịch vụ cụ thể.</p>
<p>Đúng một phép so sánh đó kết thúc nhiều cuộc tranh cãi hơn bất kỳ phép thử nào khác trong môn này, và nó tốn bốn giây.</p>`],

      [20, '★ ping in scripts — the flags that matter',
        `<p>Using ping inside a script needs two flags that are optional interactively and mandatory in automation.</p>
<ul>
<li><code>-c 1</code> — <strong>count.</strong> Without it, ping runs until interrupted. In a script that is a hang, not a test.</li>
<li><code>-W 2</code> — <strong>wait</strong>, in seconds, for a reply. The default can be tens of seconds, which turns a health check into a timeout.</li>
</ul>
<p>★ <strong>Exit codes, measured on a real server:</strong> <code>0</code> when a reply came back, <code>1</code> when none did. That makes <code>ping -c 1 -W 2 host &amp;&amp; echo up || echo down</code> a valid one-line check.</p>
<p><strong>But think about what that check tests.</strong> It tests that the host answers ICMP. It does not test your application at all — the service can be dead while the check passes, which is the failure mode of every ping-based monitor ever written.</p>
<p>For a web service, <code>curl -fsS -o /dev/null https://host/health</code> is the check that fails when the thing you care about fails. Ping belongs in a health check only when the thing you are checking is genuinely "is this machine reachable".</p>`,
        `<p>Dùng ping bên trong một script cần hai cái cờ, vốn là tuỳ chọn khi gõ tay và bắt buộc khi tự động hoá.</p>
<ul>
<li><code>-c 1</code> — <strong>số lượng.</strong> Thiếu nó thì ping chạy tới khi bị ngắt. Trong một script thì đó là treo, không phải một phép thử.</li>
<li><code>-W 2</code> — <strong>chờ</strong>, tính bằng giây, để có gói trả lời. Mặc định có thể là hàng chục giây, và điều đó biến một phép kiểm sức khoẻ thành một cú hết giờ.</li>
</ul>
<p>★ <strong>Mã thoát, đo trên máy chủ thật:</strong> <code>0</code> khi có gói trả lời, <code>1</code> khi không. Nhờ vậy <code>ping -c 1 -W 2 host &amp;&amp; echo up || echo down</code> là một phép kiểm một dòng hợp lệ.</p>
<p><strong>Nhưng hãy nghĩ xem phép kiểm đó kiểm cái gì.</strong> Nó kiểm rằng máy đó đáp ICMP. Nó hoàn toàn không kiểm ứng dụng của bạn — dịch vụ có thể đã chết trong khi phép kiểm vẫn đạt, và đó là kiểu hỏng của mọi bộ giám sát dựa trên ping từng được viết ra.</p>
<p>Với một dịch vụ web thì <code>curl -fsS -o /dev/null https://host/health</code> mới là phép kiểm hỏng đúng lúc cái bạn quan tâm hỏng. Ping chỉ thuộc về một phép kiểm sức khoẻ khi thứ bạn đang kiểm thật sự là "cái máy này có tới được không".</p>`],

      [21, '★ Diagnosing on the machine you actually run',
        `<p>Six commands, in the order you would actually use them on a server you administer.</p>
<ul>
<li><code>ping -c 3 1.1.1.1</code> — is the Internet reachable at all, and what is the TTL.</li>
<li><code>ping -c 3 &lt;gateway&gt;</code> — is my own subnet healthy.</li>
<li><code>ping -c 3 &lt;container IP&gt;</code> — can the host reach the container network. Chapter 10 explained why that is a separate network.</li>
<li><code>tracepath -n 1.1.1.1</code> — where does it stop, and does it stop for everything or just for one destination.</li>
<li><code>ping -6 -c 2 ff02::1%eth0</code> — who else is on this link, over IPv6.</li>
<li><code>ping -M do -s 1472 &lt;host&gt;</code> — is the path MTU really 1500.</li>
</ul>
<p>★ <strong>One measured result worth keeping.</strong> <code>ping -6 ff02::1%eth0</code> on a production VPS returned exactly one answer — from the machine itself, in <strong>0.055 ms</strong>. The upstream router did not reply to a multicast ping, which is common and not a fault. All-nodes multicast tells you who is <em>willing</em> to answer, not who is there. Same lesson as unicast ping, one layer down.</p>`,
        `<p>Sáu câu lệnh, theo đúng thứ tự bạn sẽ dùng thật trên một máy chủ mình quản trị.</p>
<ul>
<li><code>ping -c 3 1.1.1.1</code> — Internet có tới được không, và TTL là bao nhiêu.</li>
<li><code>ping -c 3 &lt;cổng ra&gt;</code> — subnet của chính mình có khoẻ không.</li>
<li><code>ping -c 3 &lt;IP container&gt;</code> — máy chủ có tới được mạng container không. Chương 10 đã giải thích vì sao đó là một mạng riêng.</li>
<li><code>tracepath -n 1.1.1.1</code> — nó dừng ở đâu, và nó dừng với mọi đích hay chỉ với một đích.</li>
<li><code>ping -6 -c 2 ff02::1%eth0</code> — còn ai khác trên link này, qua IPv6.</li>
<li><code>ping -M do -s 1472 &lt;máy&gt;</code> — path MTU có thật sự là 1500 không.</li>
</ul>
<p>★ <strong>Một kết quả đo được đáng giữ lại.</strong> <code>ping -6 ff02::1%eth0</code> trên một VPS sản xuất trả về đúng một câu trả lời — từ chính cái máy đó, trong <strong>0,055 ms</strong>. Router thượng nguồn không đáp lại một cú ping multicast, chuyện đó phổ biến và không phải lỗi. Multicast tới mọi node cho bạn biết ai <em>sẵn lòng</em> trả lời, chứ không phải ai đang có mặt. Đúng bài học của ping unicast, lùi xuống một tầng.</p>`],

      [22, 'The five mistakes that cost the most marks',
        `<p>Five errors account for most of the lost marks in this chapter, and all five are conclusions drawn too fast.</p>
<ul>
<li><strong>"It does not ping, so it is down."</strong> Many hosts drop ICMP by policy. Failure proves nothing on its own.</li>
<li><strong>"It pings, so the service works."</strong> Ping never touches layer 4. nginx can be stopped and ping still answers.</li>
<li><strong>Reading <code>* * *</code> as a fault.</strong> That router does not send Time Exceeded. Later hops answering proves the path is fine.</li>
<li><strong>Blocking all ICMP for "security".</strong> It kills path MTU discovery on IPv4 and kills IPv6 outright.</li>
<li><strong>Skipping the DNS test.</strong> <code>ping 8.8.8.8</code> then <code>ping google.com</code>. The difference between those two results names the failing layer in four seconds.</li>
</ul>
<p><strong>One habit covers most of it.</strong> Before running a test, say out loud what a pass and a fail would each rule out. If the answer is "nothing either way", the test is not worth running — and a surprising amount of troubleshooting consists of running exactly those tests.</p>`,
        `<p>Năm lỗi chiếm phần lớn số điểm bị mất ở chương này, và cả năm đều là kết luận rút ra quá nhanh.</p>
<ul>
<li><strong>"Nó không ping được nên nó chết rồi."</strong> Nhiều máy vứt ICMP theo chính sách. Tự thân một cú hỏng không chứng minh gì.</li>
<li><strong>"Nó ping được nên dịch vụ chạy."</strong> Ping không bao giờ đụng tới tầng 4. nginx có thể đã dừng mà ping vẫn đáp.</li>
<li><strong>Đọc <code>* * *</code> như một cái hỏng.</strong> Router đó không gửi Time Exceeded. Các chặng sau vẫn trả lời là bằng chứng rằng đường đi vẫn ổn.</li>
<li><strong>Chặn hết ICMP cho "an toàn".</strong> Nó giết path MTU discovery trên IPv4 và giết thẳng IPv6.</li>
<li><strong>Bỏ qua phép thử DNS.</strong> <code>ping 8.8.8.8</code> rồi <code>ping google.com</code>. Khác biệt giữa hai kết quả đó gọi tên được tầng đang hỏng trong bốn giây.</li>
</ul>
<p><strong>Một thói quen phủ gần hết.</strong> Trước khi chạy một phép thử, hãy nói to xem một kết quả đạt và một kết quả hỏng mỗi cái loại trừ được điều gì. Nếu câu trả lời là "chẳng loại trừ được gì cả" thì phép thử đó không đáng chạy — và một lượng đáng ngạc nhiên công việc gỡ lỗi lại chính là chạy đúng những phép thử như vậy.</p>`],

      [23, 'What you can do now, and what comes next',
        `<p>If the chapter worked, all of this is now routine.</p>
<ul>
<li>Explain what ICMP is for, and why it does not make IP reliable.</li>
<li>Name echo, time exceeded and destination unreachable, and say what generates each.</li>
<li>Read a ping line and extract loss, latency, jitter and ★ hop count from the TTL.</li>
<li>Explain how traceroute works from the TTL field alone, with no special protocol.</li>
<li>★ Recognise "no reply" and <code>asymm</code> as normal rather than as faults.</li>
<li>★ Diagnose a path MTU black hole, and say why it presents as a slow application.</li>
<li>Say why ICMPv6 must not be blocked, naming the types that would break.</li>
</ul>
<p><strong>Next: Chapter 13 — the Transport Layer</strong>, sessions 41–42, Cisco Module 14. TCP, UDP and <strong>port numbers</strong> — the layer where "the server is up but the site is down" finally gets a precise explanation, and the chapter the course owner asked for by name.</p>`,
        `<p>Nếu chương này có tác dụng thì giờ mọi thứ dưới đây đã thành thói quen.</p>
<ul>
<li>Giải thích ICMP dùng để làm gì, và vì sao nó không làm IP trở nên tin cậy.</li>
<li>Gọi tên echo, time exceeded và destination unreachable, và nói được cái gì sinh ra mỗi loại.</li>
<li>Đọc một dòng ping và rút ra tỷ lệ mất gói, độ trễ, độ giật và ★ số chặng từ giá trị TTL.</li>
<li>Giải thích traceroute chạy bằng gì, chỉ từ trường TTL, không cần giao thức riêng nào.</li>
<li>★ Nhận ra "no reply" và <code>asymm</code> là bình thường chứ không phải lỗi.</li>
<li>★ Chẩn đoán một hố đen path MTU, và nói được vì sao nó hiện ra thành một ứng dụng chậm.</li>
<li>Nói được vì sao không được chặn ICMPv6, kể tên những type sẽ hỏng.</li>
</ul>
<p><strong>Tiếp theo: Chương 13 — Tầng giao vận</strong>, buổi 41–42, Module 14 của Cisco. TCP, UDP và <strong>số hiệu cổng</strong> — cái tầng mà câu "máy chủ sống mà trang web chết" cuối cùng cũng có lời giải thích chính xác, và là chương mà chủ trang này đã đặt hàng đích danh.</p>`],
    ]),

    bi(
      `<h3>🗺️ The ping ladder, drawn</h3>
<pre><code class="language-mermaid">graph TD
  A["Something cannot be reached"] --> B{"ping 127.0.0.1"}
  B -->|"fails"| C["The host's own IP stack<br/>is broken. Nothing else matters."]
  B -->|"works"| D{"ping my default gateway"}
  D -->|"fails"| E["Fault is on MY subnet<br/>cable, mask, gateway address, VLAN"]
  D -->|"works"| F{"ping 8.8.8.8"}
  F -->|"fails"| G["Routing or the upstream link<br/>run tracepath to see where"]
  F -->|"works"| H{"ping google.com"}
  H -->|"fails"| I["Network is FINE — DNS is broken"]
  H -->|"works"| J["Addressing and DNS are fine<br/>test the SERVICE, not ICMP"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class B,D,F,H ask
  class A,C,E,G act
  class I,J ok</code></pre>
<p>The last two branches are the payoff. <strong>If 8.8.8.8 answers and google.com does not, you have proved the network works and DNS does not</strong> — a complete diagnosis from two commands. And if both work, stop testing ICMP: the remaining fault is at layer 4 or above, where ping cannot see.</p>`,
      `<h3>🗺️ Thang ping, vẽ ra</h3>
<pre><code class="language-mermaid">graph TD
  A["Có thứ gì đó không tới được"] --> B{"ping 127.0.0.1"}
  B -->|"hỏng"| C["Ngăn xếp IP của chính máy này hỏng.<br/>Mọi thứ khác không còn ý nghĩa."]
  B -->|"chạy"| D{"ping cổng ra mặc định của mình"}
  D -->|"hỏng"| E["Lỗi nằm trên SUBNET CỦA TÔI<br/>dây, mặt nạ, địa chỉ cổng ra, VLAN"]
  D -->|"chạy"| F{"ping 8.8.8.8"}
  F -->|"hỏng"| G["Định tuyến hoặc đường lên thượng nguồn<br/>chạy tracepath để xem ở đâu"]
  F -->|"chạy"| H{"ping google.com"}
  H -->|"hỏng"| I["Mạng thì ỔN — DNS mới hỏng"]
  H -->|"chạy"| J["Địa chỉ và DNS đều ổn<br/>hãy thử chính DỊCH VỤ, đừng thử ICMP"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class B,D,F,H ask
  class A,C,E,G act
  class I,J ok</code></pre>
<p>Hai nhánh cuối là phần thưởng. <strong>Nếu 8.8.8.8 đáp mà google.com không đáp thì bạn đã chứng minh được mạng chạy còn DNS thì không</strong> — một chẩn đoán hoàn chỉnh từ hai câu lệnh. Còn nếu cả hai đều chạy thì hãy thôi thử ICMP: cái hỏng còn lại nằm ở tầng 4 trở lên, chỗ mà ping không nhìn thấy.</p>`,
    ),

    bi(
      `<h3>🔍 Cách tự kiểm — the full sequence on a machine you own</h3>
<pre><code class="language-bash">ping -c 3 1.1.1.1                   # reachability + TTL
ping -c 3 8.8.8.8 && ping -c 3 google.com   # separates routing from DNS
tracepath -n 1.1.1.1                # where the forward path goes
ping -M do -s 1472 1.1.1.1          # full-size packet: does 1500 fit?
ping -M do -s 1473 1.1.1.1          # one byte more
ping -c 1 -W 2 1.1.1.1 >/dev/null; echo "exit=$?"</code></pre>
<p>Real output from the last three, on a production server:</p>
<pre><code class="language-plaintext">2 packets transmitted, 2 received, 0% packet loss       # -s 1472 went through
ping: local error: message too long, mtu=1500           # -s 1473 did not
exit=0                                                   # reachable
</code></pre>
<div class="callout ok"><strong>What each result means.</strong> The pair of MTU tests brackets the path MTU exactly: the last size that worked plus 28 is the answer. The exit code makes ping scriptable — 0 reachable, 1 not. And if <code>8.8.8.8</code> succeeds while <code>google.com</code> fails, stop looking at the network: you have already found the layer.</div>
<div class="callout warn"><strong>Kiểm bộ kiểm.</strong> Before trusting <code>tracepath</code> output, note which hops answered <em>after</em> a gap. A gap followed by answers proves the gap is silence, not a break. A gap followed by nothing at all is the only pattern that narrows anything — and even then, the destination may simply drop ICMP.</div>`,
      `<h3>🔍 Cách tự kiểm — chạy trọn bộ trên một máy của bạn</h3>
<pre><code class="language-bash">ping -c 3 1.1.1.1                   # tới được không + TTL
ping -c 3 8.8.8.8 && ping -c 3 google.com   # tách định tuyến khỏi DNS
tracepath -n 1.1.1.1                # đường đi ra chạy tới đâu
ping -M do -s 1472 1.1.1.1          # gói cỡ tối đa: 1500 có vừa không?
ping -M do -s 1473 1.1.1.1          # hơn một byte
ping -c 1 -W 2 1.1.1.1 >/dev/null; echo "exit=$?"</code></pre>
<p>Kết xuất thật của ba lệnh cuối, trên một máy chủ sản xuất:</p>
<pre><code class="language-plaintext">2 packets transmitted, 2 received, 0% packet loss       # -s 1472 đi lọt
ping: local error: message too long, mtu=1500           # -s 1473 thì không
exit=0                                                   # tới được
</code></pre>
<div class="callout ok"><strong>Mỗi kết quả nghĩa là gì.</strong> Cặp phép thử MTU kẹp chính xác giá trị path MTU: kích thước cuối cùng còn chạy cộng 28 là đáp án. Mã thoát làm cho ping dùng được trong script — 0 là tới được, 1 là không. Và nếu <code>8.8.8.8</code> chạy trong khi <code>google.com</code> hỏng thì thôi nhìn vào mạng nữa: bạn đã tìm ra tầng rồi.</div>
<div class="callout warn"><strong>Kiểm bộ kiểm.</strong> Trước khi tin kết xuất của <code>tracepath</code>, hãy để ý những chặng trả lời <em>sau</em> một chỗ khuyết. Một chỗ khuyết mà sau đó vẫn có trả lời là bằng chứng rằng chỗ khuyết ấy là im lặng chứ không phải đứt. Một chỗ khuyết mà sau đó không còn gì nữa mới là kiểu duy nhất thu hẹp được điều gì — và kể cả thế thì cái đích vẫn có thể chỉ đơn giản là vứt ICMP.</div>`,
    ),

    bi(
      `<div class="pitfall co-tieu-de"><strong>Trap 1 — treating a traceroute gap as the fault.</strong> <b>Symptom:</b> hours spent chasing a router that never answers and never mattered. Measured on a real server: hop 1 said "no reply" while hops 2 to 10 answered fine. If a later hop replies, the earlier one is forwarding correctly.</div>
<div class="pitfall co-tieu-de"><strong>Trap 2 — reading traceroute times as path latency.</strong> They measure how fast each router chose to <em>reply</em>, which is low-priority work. <b>Symptom:</b> a hop showing 80 ms followed by one showing 25 ms, read as an impossible result rather than as a busy router.</div>
<div class="pitfall co-tieu-de"><strong>Trap 3 — assuming the return path mirrors the forward path.</strong> <b>Symptom:</b> a one-way fault misread as a total outage. The <code>asymm</code> markers in real tracepath output exist precisely because routing is not symmetric.</div>
<div class="pitfall co-tieu-de"><strong>Trap 4 — running ping without <code>-c</code> in a script.</strong> <b>Symptom:</b> a health check or deploy step that never returns, and a pipeline that hangs until someone notices. Always <code>-c 1 -W 2</code>.</div>
<div class="pitfall co-tieu-de"><strong>Trap 5 — monitoring a web service with ping.</strong> <b>Symptom:</b> a green dashboard while the site returns 502. Ping proves the machine answers ICMP; only a request to the actual service proves the service works.</div>`,
      `<div class="pitfall co-tieu-de"><strong>Bẫy 1 — coi một chỗ khuyết trong traceroute là cái hỏng.</strong> <b>Triệu chứng:</b> hàng giờ đuổi theo một con router chưa bao giờ trả lời và chưa bao giờ quan trọng. Đo trên máy chủ thật: chặng 1 ghi "no reply" trong khi chặng 2 tới 10 trả lời bình thường. Nếu một chặng sau có đáp thì chặng trước đang chuyển tiếp đúng.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 2 — đọc thời gian trong traceroute như độ trễ của đường truyền.</strong> Chúng đo xem mỗi router chọn <em>trả lời</em> nhanh thế nào, mà đó là việc ưu tiên thấp. <b>Triệu chứng:</b> một chặng hiện 80 ms rồi chặng sau hiện 25 ms, bị đọc thành một kết quả bất khả thay vì thành một router đang bận.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 3 — mặc định đường về là ảnh gương của đường đi.</strong> <b>Triệu chứng:</b> một cái hỏng một chiều bị đọc thành mất kết nối hoàn toàn. Mấy nhãn <code>asymm</code> trong kết xuất tracepath thật tồn tại đúng vì định tuyến không đối xứng.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 4 — chạy ping mà không có <code>-c</code> trong script.</strong> <b>Triệu chứng:</b> một phép kiểm sức khoẻ hay một bước deploy không bao giờ trả về, và cả dây chuyền treo cho tới khi có người để ý. Luôn dùng <code>-c 1 -W 2</code>.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 5 — giám sát một dịch vụ web bằng ping.</strong> <b>Triệu chứng:</b> bảng điều khiển xanh lè trong khi trang web trả 502. Ping chứng minh cái máy đáp ICMP; chỉ một yêu cầu tới chính dịch vụ mới chứng minh dịch vụ chạy.</div>`,
    ),

    bi(
      `<h3>Exercises</h3>
<p><b>E1.</b> Interpret this ping summary. What is healthy, what is not, and what would you check next?</p>
<pre><code class="language-plaintext">20 packets transmitted, 20 received, 0% packet loss, time 19030ms
rtt min/avg/max/mdev = 12.1/94.7/380.2/98.4 ms</code></pre>
<div class="dap-an"><p><b>Zero loss</b> — every packet arrived. The path is not dropping traffic, so this is not a broken link or an overloaded policer.</p>
<p><b>But mdev is 98.4 ms against an average of 94.7 ms</b> — the jitter is as large as the latency itself. And min 12.1 against max 380.2 is a factor of thirty. Packets are arriving, but their timing is wildly erratic.</p>
<p><b>That pattern means congestion</b>, specifically a queue somewhere that fills and drains. Packets wait in it for varying lengths of time, which is exactly what produces high jitter with no loss — the queue is deep enough to absorb the bursts rather than drop them.</p>
<p><b>What to check next:</b> run <code>tracepath</code> to find which hop the latency appears at, and check whether the pattern correlates with time of day. For an application, high jitter with no loss is worse than modest steady latency — anything real-time degrades badly, while a bulk download barely notices.</p>
<p class="ghi-chu">Contrast: 5% loss with mdev of 2 ms is a different fault entirely — something is dropping a fixed proportion, which points at a policer or a faulty interface rather than congestion.</p></div>

<p><b>E2.</b> ★ A trace shows hops 1 to 6 answering, hops 7 to 30 all showing <code>no reply</code>, and the destination never reached. But <code>curl https://the-destination/</code> returns 200. Explain.</p>
<div class="dap-an"><p><b>Nothing is broken.</b> The trace stopped producing output at hop 7, but traffic is clearly reaching the destination — <code>curl</code> proves it, end to end, at layer 7.</p>
<p><b>Two things can produce this,</b> and they are hard to tell apart from the trace alone:</p>
<ol>
<li><b>The routers from hop 7 onward do not generate Time Exceeded messages.</b> Common inside a provider's core network and inside cloud providers, where it is both a CPU saving and a deliberate reduction in topology disclosure.</li>
<li><b>The Time Exceeded messages are generated but filtered on the way back.</b> A firewall between you and them drops ICMP inbound.</li>
</ol>
<p><b>The important conclusion is the same either way:</b> traceroute failing to complete says something about ICMP handling along the path, and nothing whatever about whether traffic flows. The <code>curl</code> result outranks the trace, because it exercises every layer including the one that matters.</p>
<p><b>What the trace is still good for:</b> hops 1 to 6 are real, and if you have a baseline from a working day, comparing those six is still useful.</p></div>

<p><b>E3.</b> A monitoring system reports a web server as "up" continuously while users report the site is down. The check is <code>ping -c 1 server &amp;&amp; echo up</code>. Explain the flaw and write a better check.</p>
<div class="dap-an"><p><b>The flaw.</b> Ping proves layers 1 to 3 and the presence of a working IP stack. It does not touch layer 4 or above. The machine can be answering every echo request perfectly while nginx has crashed, the TLS certificate has expired, the application is returning 502, or the disk is full and every request fails.</p>
<p>The monitor is truthfully reporting what it measures. It is measuring the wrong thing.</p>
<p><b>A better check:</b></p>
<pre><code class="language-bash">curl -fsS --max-time 5 -o /dev/null -w "%{http_code}" https://server/health</code></pre>
<ul>
<li><code>-f</code> makes curl exit non-zero on an HTTP error status, so a 502 fails the check instead of passing it.</li>
<li><code>--max-time 5</code> bounds it, so a hanging server fails rather than stalling the monitor.</li>
<li><code>-o /dev/null</code> discards the body; you want the status, not the page.</li>
<li>Pointing it at a real <code>/health</code> endpoint exercises the application, and ideally its database connection too.</li>
</ul>
<p><b>The principle:</b> check the thing you care about, at the layer you care about. Ping belongs in a health check only when the question genuinely is "is this machine reachable at all" — for instance when deciding whether to even attempt an SSH connection.</p></div>`,
      `<h3>Bài tập</h3>
<p><b>E1.</b> Hãy diễn giải bản tóm tắt ping này. Cái gì khoẻ, cái gì không, và bạn sẽ kiểm gì tiếp theo?</p>
<pre><code class="language-plaintext">20 packets transmitted, 20 received, 0% packet loss, time 19030ms
rtt min/avg/max/mdev = 12.1/94.7/380.2/98.4 ms</code></pre>
<div class="dap-an"><p><b>Mất 0% gói</b> — mọi gói đều tới nơi. Đường truyền không vứt lưu lượng, nên đây không phải một đường đứt hay một bộ khống chế bị quá tải.</p>
<p><b>Nhưng mdev là 98,4 ms so với trung bình 94,7 ms</b> — độ giật lớn ngang chính độ trễ. Và min 12,1 so với max 380,2 là chênh nhau ba mươi lần. Gói vẫn tới, nhưng thời điểm tới thì loạn xạ.</p>
<p><b>Kiểu đó nghĩa là nghẽn</b>, cụ thể là có một hàng đợi ở đâu đó cứ đầy lên rồi lại vơi. Gói tin nằm chờ trong đó với thời gian khác nhau, và đó đúng là thứ sinh ra độ giật cao mà không mất gói — cái hàng đợi đủ sâu để hấp thụ các đợt dồn thay vì vứt chúng đi.</p>
<p><b>Kiểm gì tiếp:</b> chạy <code>tracepath</code> để tìm xem độ trễ xuất hiện ở chặng nào, và xem quy luật đó có tương quan với thời điểm trong ngày không. Với một ứng dụng thì độ giật cao mà không mất gói còn tệ hơn độ trễ cao mà đều — mọi thứ thời gian thực đều xuống cấp nặng, trong khi một cú tải file lớn thì gần như không để ý.</p>
<p class="ghi-chu">Đối chiếu: mất 5% gói với mdev 2 ms là một cái hỏng hoàn toàn khác — có thứ gì đó đang vứt một tỷ lệ cố định, và điều đó trỏ tới một bộ khống chế hoặc một cổng mạng lỗi chứ không phải nghẽn.</p></div>

<p><b>E2.</b> ★ Một bản trace hiện chặng 1 tới 6 có trả lời, chặng 7 tới 30 đều ghi <code>no reply</code>, và không bao giờ tới được đích. Nhưng <code>curl https://the-destination/</code> lại trả về 200. Hãy giải thích.</p>
<div class="dap-an"><p><b>Không có gì hỏng cả.</b> Bản trace ngừng cho ra kết quả từ chặng 7, nhưng lưu lượng rõ ràng đang tới được đích — <code>curl</code> chứng minh điều đó, đầu-cuối, ở tầng 7.</p>
<p><b>Hai chuyện có thể sinh ra cảnh này,</b> và chỉ nhìn bản trace thì khó phân biệt:</p>
<ol>
<li><b>Các router từ chặng 7 trở đi không sinh ra thông điệp Time Exceeded.</b> Chuyện phổ biến bên trong mạng lõi của nhà cung cấp và bên trong các nhà cung cấp đám mây, vừa để tiết kiệm CPU vừa là chủ ý giảm việc để lộ cấu trúc mạng.</li>
<li><b>Các thông điệp Time Exceeded có được sinh ra nhưng bị lọc trên đường về.</b> Một tường lửa giữa bạn và họ vứt ICMP đi vào.</li>
</ol>
<p><b>Kết luận quan trọng thì giống nhau ở cả hai đường:</b> traceroute không chạy tới đích nói lên điều gì đó về cách ICMP được xử lý dọc đường, và hoàn toàn không nói gì về chuyện lưu lượng có chảy hay không. Kết quả <code>curl</code> có trọng lượng lớn hơn bản trace, vì nó vận hành mọi tầng, kể cả cái tầng đáng quan tâm.</p>
<p><b>Bản trace vẫn còn ích gì:</b> chặng 1 tới 6 là thật, và nếu bạn có một bản chuẩn từ một ngày mạng chạy tốt thì so sáu chặng đó vẫn có ích.</p></div>

<p><b>E3.</b> Một hệ thống giám sát liên tục báo máy chủ web "up" trong khi người dùng báo là trang chết. Phép kiểm là <code>ping -c 1 server &amp;&amp; echo up</code>. Hãy chỉ ra chỗ sai và viết một phép kiểm tốt hơn.</p>
<div class="dap-an"><p><b>Chỗ sai.</b> Ping chứng minh tầng 1 tới 3 và sự có mặt của một ngăn xếp IP hoạt động. Nó không đụng tới tầng 4 trở lên. Cái máy có thể đang đáp mọi gói echo request hoàn hảo trong khi nginx đã sập, chứng chỉ TLS đã hết hạn, ứng dụng đang trả 502, hoặc đĩa đầy và mọi yêu cầu đều hỏng.</p>
<p>Bộ giám sát đang báo cáo trung thực thứ nó đo. Nó chỉ đang đo nhầm thứ.</p>
<p><b>Một phép kiểm tốt hơn:</b></p>
<pre><code class="language-bash">curl -fsS --max-time 5 -o /dev/null -w "%{http_code}" https://server/health</code></pre>
<ul>
<li><code>-f</code> làm curl thoát với mã khác 0 khi gặp mã lỗi HTTP, nên một cú 502 làm phép kiểm hỏng thay vì cho qua.</li>
<li><code>--max-time 5</code> chặn trần thời gian, nên một máy chủ đang treo sẽ hỏng phép kiểm chứ không làm nghẽn bộ giám sát.</li>
<li><code>-o /dev/null</code> vứt phần thân đi; bạn cần mã trạng thái, không cần trang.</li>
<li>Trỏ nó vào một endpoint <code>/health</code> thật sẽ vận hành cả ứng dụng, và lý tưởng thì vận hành cả kết nối cơ sở dữ liệu của nó.</li>
</ul>
<p><b>Nguyên tắc:</b> hãy kiểm đúng thứ bạn quan tâm, ở đúng tầng bạn quan tâm. Ping chỉ thuộc về một phép kiểm sức khoẻ khi câu hỏi thật sự là "cái máy này có tới được không" — ví dụ khi quyết định có nên thử mở kết nối SSH hay không.</p></div>`,
    ),

    cq(38, [
      ['CQ13.2', 'Compare types of IPv6 network addresses <em>— content belongs to Chapter 11; answered in full in Lesson 11.1 (unicast GUA/LLA/ULA, multicast, anycast, and why IPv6 has no broadcast).</em>',
        'Compare types of IPv6 network addresses <em>— nội dung thuộc Chương 11; đã trả lời đầy đủ ở bài 11.1 (unicast GUA/LLA/ULA, multicast, anycast, và vì sao IPv6 không có broadcast).</em>'],
    ]),

    cq(39, [
      ['CQ13.3', 'How to configure IPv6 address on Cisco devices? <em>— content belongs to Chapter 11; answered in full in Lesson 11.2 (ipv6 unicast-routing, ipv6 address with a /64, an explicit link-local, and verification with show ipv6 interface).</em>',
        'How to configure IPv6 address on Cisco devices? <em>— nội dung thuộc Chương 11; đã trả lời đầy đủ ở bài 11.2 (ipv6 unicast-routing, lệnh ipv6 address với /64, đặt link-local tường minh, và nghiệm thu bằng show ipv6 interface).</em>'],
    ]),

    cq(40, [
      ['CQ14.1', 'What is ICMP?',
        'ICMP là gì?'],
    ]),

    bi(
      `<div class="note-ct"><h3>💬 About this chapter's constructive questions</h3>
<p>Four questions fall inside sessions 37 to 40, and the pattern is worth stating plainly.</p>
<ul>
<li><strong>CQ13.1</strong> (session 37) asks about IPv4 exhaustion — section 11.2, <strong>Chapter 11</strong>.</li>
<li><strong>CQ13.2</strong> (session 38) asks about IPv6 address types — section 11.4, <strong>Chapter 11</strong>.</li>
<li><strong>CQ13.3</strong> (session 39) asks about configuring IPv6 on Cisco devices — section 11.5, <strong>Chapter 11</strong>.</li>
<li><strong>CQ14.1</strong> (session 40) asks <em>"What is ICMP?"</em> — section 12.1, <strong>this chapter</strong>.</li>
</ul>
<p>So three of the four belong to the previous chapter, and the one that does belong here lands on session 40, which is the second half of the lab rather than session 37 where 12.1 is taught. The drift of roughly one chapter, first noted at session 19, is unchanged.</p>
<p><strong>CQ14.1 answered.</strong> ICMP is the feedback channel that IP lacks. IP is best-effort and has no way to report a failure, so when a router discards a packet or a host cannot accept one, ICMP carries the reason back to the sender. It does <em>not</em> make IP reliable — nothing is retransmitted — it makes IP diagnosable. It rides inside IP as protocol 1 (58 for ICMPv6), has no port numbers, and can itself be lost. Three message families carry almost all the value: Echo Request and Reply, which is ping; Time Exceeded, which is traceroute; and Destination Unreachable, whose code says why delivery failed. In IPv6 it is not optional at all — Neighbor Discovery, Router Advertisement and Packet Too Big are all ICMPv6, so blocking it breaks the protocol itself.</p></div>`,
      `<div class="note-ct"><h3>💬 Về các câu hỏi kiến tạo của chương này</h3>
<p>Có bốn câu rơi vào buổi 37 tới 40, và quy luật thì đáng nói thẳng ra.</p>
<ul>
<li><strong>CQ13.1</strong> (buổi 37) hỏi về chuyện IPv4 cạn — mục 11.2, <strong>Chương 11</strong>.</li>
<li><strong>CQ13.2</strong> (buổi 38) hỏi về các loại địa chỉ IPv6 — mục 11.4, <strong>Chương 11</strong>.</li>
<li><strong>CQ13.3</strong> (buổi 39) hỏi về cấu hình IPv6 trên thiết bị Cisco — mục 11.5, <strong>Chương 11</strong>.</li>
<li><strong>CQ14.1</strong> (buổi 40) hỏi <em>"What is ICMP?"</em> — mục 12.1, <strong>chính chương này</strong>.</li>
</ul>
<p>Vậy ba trong bốn câu thuộc về chương trước, còn câu duy nhất thuộc về đây thì lại rơi vào buổi 40, tức nửa sau của bài lab, chứ không phải buổi 37 nơi dạy mục 12.1. Độ trôi khoảng một chương, nêu lần đầu ở buổi 19, vẫn nguyên như cũ.</p>
<p><strong>Trả lời CQ14.1.</strong> ICMP là cái kênh phản hồi mà IP không có. IP là giao thức nỗ lực tối đa và không có cách nào báo một thất bại, nên khi một router vứt một gói đi hoặc một host không nhận được gói thì ICMP mang lý do quay về với người gửi. Nó <em>không</em> làm IP trở nên tin cậy — không có gì được gửi lại — nó làm IP chẩn đoán được. Nó đi bên trong IP với số hiệu giao thức 1 (58 cho ICMPv6), không có số hiệu cổng, và bản thân nó cũng có thể bị mất. Ba nhóm thông điệp mang gần hết giá trị: Echo Request và Reply, tức ping; Time Exceeded, tức traceroute; và Destination Unreachable, mà phần code nói vì sao việc giao hỏng. Trong IPv6 thì nó hoàn toàn không phải tuỳ chọn — Neighbor Discovery, Router Advertisement và Packet Too Big đều là ICMPv6, nên chặn nó là làm hỏng chính giao thức.</p></div>`,
    ),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz ─────────────────────────────────── */

const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

const QUIZ = {
  title: 'Quiz Chapter 12 — ICMP|||Quiz Chương 12 — Giao thức ICMP',
  slug: 'nwc204-ch12-quiz',
  type: 'QUIZ',
  description: '12 câu song ngữ cho chương 12: ICMP báo cáo chứ không sửa chữa, nó nằm trong IP nên cũng mất được, ping hỏng thường là im lặng chứ không phải thông báo lỗi, TTL đếm ra số chặng, traceroute chạy bằng mẹo TTL, "no reply" và asymm không phải lỗi, path MTU discovery và hố đen khi ICMP bị chặn, ping chứng minh tới tầng 3 chứ không tới tầng 4, thang ping tách mạng khỏi DNS, exit code và cờ -c -W trong script, và vì sao ICMPv6 là bắt buộc. Mọi số liệu đo trên máy chủ thật.',
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      q('What does ICMP do for IP?|||ICMP làm gì cho IP?',
        ['It retransmits lost packets|||Nó gửi lại những gói bị mất', 'It reports problems back to the sender, without fixing them|||Nó báo vấn đề về cho người gửi, mà không sửa chúng', 'It guarantees delivery order|||Nó bảo đảm thứ tự giao gói', 'It encrypts the payload|||Nó mã hoá phần tải'],
        1,
        'IP is best effort and has no field for saying "I could not deliver this and here is why". ICMP is that missing channel: it carries the reason back. It does NOT make IP reliable — nothing is retransmitted and nothing is repaired. It makes IP DIAGNOSABLE. Reliability is the transport layer job, TCP in Chapter 13, and confusing the two leads to believing a successful ping means a working service.|||IP là giao thức nỗ lực tối đa và không có trường nào để nói "tôi không giao được cái này và đây là lý do". ICMP chính là cái kênh còn thiếu đó: nó mang lý do quay về. Nó KHÔNG làm IP trở nên tin cậy — không gì được gửi lại và không gì được sửa. Nó làm IP CHẨN ĐOÁN ĐƯỢC. Tính tin cậy là việc của tầng giao vận, tức TCP ở Chương 13, và lẫn lộn hai thứ dẫn tới niềm tin rằng ping được nghĩa là dịch vụ chạy.'),

      q('You ping an address in your own subnet that has nothing at it. What do you most likely get?|||Bạn ping một địa chỉ trong chính subnet của mình mà không có gì ở đó. Nhiều khả năng bạn nhận được gì?',
        ['ICMP host unreachable, code 1|||Gói ICMP host unreachable, code 1', 'Silence — 100% packet loss and no message at all|||Im lặng — mất 100% gói và không có thông điệp nào cả', 'ICMP network unreachable, code 0|||Gói ICMP network unreachable, code 0', 'An immediate connection refused|||Một lời từ chối kết nối ngay lập tức'],
        1,
        'Measured on a real server: pinging 172.17.99.99, an empty address inside its own docker0 subnet, gave 2 packets transmitted, 0 received, 100% packet loss and nothing else. Your own host would be the one to report host unreachable, and it does not, because from its point of view nothing failed — it sent an ARP request and nobody answered, which is a timeout rather than an error. A failed ping is far more often silence than an error message, and silence carries almost no information.|||Đo trên máy chủ thật: ping tới 172.17.99.99, một địa chỉ trống trong chính subnet docker0 của nó, cho ra 2 gói gửi đi, 0 gói nhận về, mất 100% gói và không gì khác. Chính cái máy của bạn mới là bên phải báo host unreachable, mà nó không báo, vì xét từ góc nhìn của nó thì chẳng có gì hỏng — nó gửi một yêu cầu ARP và không ai đáp, đó là hết giờ chứ không phải lỗi. Một cú ping hỏng thường là im lặng chứ hiếm khi là một thông báo lỗi, và im lặng thì hầu như không mang thông tin gì.'),

      q('A ping reply arrives with ttl=55. What does that tell you?|||Một gói ping trả lời về với ttl=55. Điều đó cho bạn biết gì?',
        ['The reply took 55 milliseconds|||Gói trả lời mất 55 mili giây', 'About 9 routers stood between the responder and you|||Có khoảng 9 router đứng giữa bên trả lời và bạn', 'The connection will expire in 55 seconds|||Kết nối sẽ hết hạn sau 55 giây', 'The packet was 55 bytes|||Gói tin dài 55 byte'],
        1,
        'TTL is a hop counter, not a time — IPv6 renamed it Hop Limit for exactly that reason. Common starting values are 64 on Linux and macOS, 128 on Windows, 255 on network gear. Subtract from the nearest value above: 64 − 55 = 9 hops. Measured from a real VPS: 1.1.1.1 replied with ttl=55 and 8.8.8.8 with ttl=118, giving 9 and 10 hops. Note this counts the RETURN path only; the forward path can be a different length.|||TTL là bộ đếm chặng chứ không phải thời gian — IPv6 đổi tên nó thành Hop Limit đúng vì lẽ đó. Các giá trị khởi đầu thường gặp là 64 trên Linux và macOS, 128 trên Windows, 255 trên thiết bị mạng. Lấy giá trị gần nhất ở trên trừ đi: 64 − 55 = 9 chặng. Đo từ một VPS thật: 1.1.1.1 trả lời với ttl=55 và 8.8.8.8 với ttl=118, ra 9 và 10 chặng. Lưu ý con số này chỉ đếm đường VỀ; đường đi có thể dài khác.'),

      q('How does traceroute discover each hop?|||Traceroute tìm ra từng chặng bằng cách nào?',
        ['It uses a dedicated traceroute protocol|||Nó dùng một giao thức traceroute riêng', 'It sends packets with TTL=1, then 2, then 3, and reads the Time Exceeded replies|||Nó gửi gói với TTL=1, rồi 2, rồi 3, và đọc các gói Time Exceeded trả về', 'It queries each router by SNMP|||Nó hỏi từng router bằng SNMP', 'It reads the routing table of the first hop|||Nó đọc bảng định tuyến của chặng đầu tiên'],
        1,
        'There is no traceroute protocol. It abuses the TTL field: a packet with TTL=1 dies at the first router, which must send Time Exceeded and thereby identifies itself. TTL=2 dies at the second, and so on until a packet survives to the destination, which replies differently and ends the trace. That obligation — every router that decrements TTL to zero MUST report it — is the entire tool. Note it maps the FORWARD path only; each reply finds its own way back.|||Không có giao thức traceroute nào cả. Nó lạm dụng trường TTL: một gói có TTL=1 chết ở router đầu tiên, và router đó buộc phải gửi Time Exceeded, qua đó tự giới thiệu mình. TTL=2 chết ở router thứ hai, và cứ thế cho tới khi một gói sống sót tới đích, đích trả lời theo kiểu khác và bản trace kết thúc. Chính cái nghĩa vụ đó — router nào giảm TTL về 0 thì PHẢI báo lại — là toàn bộ công cụ. Lưu ý nó chỉ vẽ ra đường ĐI; mỗi gói trả lời tự tìm đường về.'),

      q('A trace shows "no reply" at hop 1, but hops 2 through 10 all answer. What is wrong?|||Một bản trace hiện "no reply" ở chặng 1, nhưng chặng 2 tới 10 đều trả lời. Hỏng ở đâu?',
        ['Hop 1 is down|||Chặng 1 đã chết', 'Nothing — that router simply does not send Time Exceeded messages|||Không có gì — router đó đơn giản là không gửi thông điệp Time Exceeded', 'The trace ran in the wrong order|||Bản trace chạy sai thứ tự', 'The cable to hop 1 is faulty|||Dây tới chặng 1 bị lỗi'],
        1,
        'Measured on a real server: hop 1 said "no reply" while hops 2 to 10 answered perfectly. If hop 4 replies, packets are reaching hop 4, which means they passed through hop 1 — so hop 1 is forwarding correctly and merely declines to generate Time Exceeded. Many routers do, by policy: generating those messages costs CPU and discloses topology. A missing hop in the middle of a working trace is almost never the fault.|||Đo trên máy chủ thật: chặng 1 ghi "no reply" trong khi chặng 2 tới 10 trả lời hoàn hảo. Nếu chặng 4 có đáp thì gói tin đang tới được chặng 4, nghĩa là chúng đã đi qua chặng 1 — vậy chặng 1 đang chuyển tiếp đúng và chỉ là không chịu sinh ra gói Time Exceeded. Nhiều router làm vậy theo chính sách: sinh ra mấy thông điệp đó tốn CPU và để lộ cấu trúc mạng. Một chặng khuyết ở giữa một bản trace đang chạy tốt gần như không bao giờ là cái hỏng.'),

      q('In tracepath output, what does "asymm 5" mean?|||Trong kết xuất tracepath, "asymm 5" nghĩa là gì?',
        ['5 packets were lost|||Mất 5 gói', 'The reply came back over a path with a different number of hops|||Gói trả lời quay về theo một đường có số chặng khác', 'The latency varied by 5 ms|||Độ trễ dao động 5 ms', 'There are 5 routers left to reach the target|||Còn 5 router nữa mới tới đích'],
        1,
        'Routing is not symmetric: each network chooses its own outbound policy independently, so the path out and the path back can differ in length and in the routers they cross. tracepath detects this and labels it. On a real measurement, tracepath reached hop 10 without arriving at 1.1.1.1 while a direct ping returned ttl=55, implying 9 hops back — forward ten or more, backward nine. Both numbers are true, and asymm is the tool saying so.|||Định tuyến không đối xứng: mỗi mạng tự chọn chính sách đi ra của mình một cách độc lập, nên đường ra và đường về có thể khác nhau về số chặng lẫn về các router đi qua. tracepath phát hiện chuyện đó và dán nhãn. Trong một phép đo thật, tracepath đi tới chặng 10 mà vẫn chưa tới 1.1.1.1 trong khi một cú ping thẳng trả về ttl=55, tức 9 chặng đường về — đi mười chặng trở lên, về chín chặng. Cả hai con số đều đúng, và asymm là công cụ đang nói ra điều đó.'),

      q('ping -M do -s 1472 works, but -s 1473 gives "message too long, mtu=1500". Why?|||ping -M do -s 1472 thì chạy, còn -s 1473 trả "message too long, mtu=1500". Vì sao?',
        ['1473 is not a valid size|||1473 không phải kích thước hợp lệ', '1472 + 28 bytes of header = exactly 1500, the MTU; one byte more will not fit|||1472 + 28 byte tiêu đề = đúng 1500, tức MTU; thêm một byte là không vừa', 'The -M do flag limits the size to 1472|||Cờ -M do giới hạn kích thước ở 1472', 'The server refuses packets over 1472 bytes|||Máy chủ từ chối gói lớn hơn 1472 byte'],
        1,
        '-s sets the PAYLOAD. Add 8 bytes of ICMP header and 20 of IP header: 1472 + 28 = 1500, which is exactly the Ethernet MTU. 1473 + 28 = 1501, one byte over, and -M do sets the Do Not Fragment bit so it cannot be split. That pair of commands brackets the path MTU exactly: the last size that worked plus 28 is the answer. Genuinely useful when a VPN or tunnel has quietly lowered the MTU below 1500.|||Cờ -s đặt phần TẢI. Cộng thêm 8 byte tiêu đề ICMP và 20 byte tiêu đề IP: 1472 + 28 = 1500, đúng bằng MTU của Ethernet. 1473 + 28 = 1501, hơn một byte, mà cờ -M do bật bit Do Not Fragment nên nó không được cắt nhỏ. Cặp lệnh đó kẹp chính xác giá trị path MTU: kích thước cuối cùng còn chạy cộng 28 là đáp án. Thật sự hữu ích khi một đường VPN hay đường hầm đã lặng lẽ hạ MTU xuống dưới 1500.'),

      q('A site behind a VPN: the TCP handshake succeeds, small pages load, large responses hang forever. Most likely cause?|||Một trang web sau VPN: bắt tay TCP thành công, trang nhỏ tải được, gói trả lời lớn treo vĩnh viễn. Nguyên nhân nhiều khả năng nhất?',
        ['The server is overloaded|||Máy chủ quá tải', 'A path MTU black hole — oversized packets are dropped and the ICMP that would report it is blocked|||Một hố đen path MTU — gói quá khổ bị vứt và gói ICMP lẽ ra báo chuyện đó thì bị chặn', 'DNS is resolving slowly|||DNS phân giải chậm', 'The TLS certificate has expired|||Chứng chỉ TLS đã hết hạn'],
        1,
        'The VPN adds encapsulation overhead so the real MTU is below 1500. Large responses go out at full size with DF set, a router must drop them, and the ICMP type 3 code 4 that would report the correct MTU is blocked by a firewall. The sender never learns and retransmits the same oversized packets forever. The handshake succeeds because SYN and ACK are tiny — which is exactly why the symptom looks like an application bug. Confirm with ping -M do at two sizes.|||VPN thêm phần bọc nên MTU thật tụt xuống dưới 1500. Gói trả lời lớn đi ra ở kích thước tối đa kèm bit DF, một router buộc phải vứt chúng, và gói ICMP type 3 code 4 lẽ ra báo giá trị MTU đúng thì bị tường lửa chặn. Bên gửi không bao giờ biết và cứ gửi lại đúng những gói quá khổ ấy mãi mãi. Bắt tay thành công vì SYN và ACK đều bé tí — và đó đúng là lý do triệu chứng trông như một con bọ của ứng dụng. Xác nhận bằng ping -M do ở hai kích thước.'),

      q('A server answers every ping perfectly. What does that NOT prove?|||Một máy chủ đáp mọi cú ping hoàn hảo. Điều đó KHÔNG chứng minh được gì?',
        ['That a physical path exists|||Rằng có một đường vật lý', 'That the application is working|||Rằng ứng dụng đang chạy', 'That IP routing works both ways|||Rằng định tuyến IP chạy cả hai chiều', 'That the host has a working IP stack|||Rằng máy đó có một ngăn xếp IP hoạt động'],
        1,
        'Ping exercises layers 1 to 3 only — it never touches layer 4 or above. A machine can answer every echo request while nginx has crashed, the certificate has expired, or the application returns 502 on every request. This is the failure mode of every ping-based monitor ever written: a green dashboard while the site is down. For a web service, curl -fsS against a real endpoint is the check that fails when the thing you care about fails.|||Ping chỉ vận hành tầng 1 tới 3 — nó không bao giờ đụng tới tầng 4 trở lên. Một cái máy có thể đáp mọi gói echo request trong khi nginx đã sập, chứng chỉ đã hết hạn, hoặc ứng dụng trả 502 cho mọi yêu cầu. Đây là kiểu hỏng của mọi bộ giám sát dựa trên ping từng được viết ra: bảng điều khiển xanh lè trong khi trang web chết. Với một dịch vụ web thì curl -fsS tới một endpoint thật mới là phép kiểm hỏng đúng lúc cái bạn quan tâm hỏng.'),

      q('ping 8.8.8.8 succeeds but ping google.com fails. What have you proved?|||ping 8.8.8.8 thì được mà ping google.com thì hỏng. Bạn đã chứng minh được gì?',
        ['The Internet is down|||Internet chết rồi', 'The network works and DNS is broken|||Mạng chạy và DNS hỏng', 'Google is blocking you|||Google đang chặn bạn', 'Your default gateway is misconfigured|||Cổng ra mặc định của bạn cấu hình sai'],
        1,
        'Pinging an IP address needs no name resolution; pinging a hostname needs DNS first. If the numeric address answers, everything from your IP stack through routing to the far side works. If the name does not, the only step that differs is the lookup. Two commands, four seconds, and the problem moves from "the Internet is down" to one specific service. This single comparison ends more arguments than any other test in the course.|||Ping một địa chỉ IP thì không cần phân giải tên; ping một tên máy thì cần DNS trước. Nếu địa chỉ dạng số có đáp thì mọi thứ từ ngăn xếp IP của bạn qua định tuyến tới đầu kia đều chạy. Nếu cái tên không đáp thì bước duy nhất khác biệt là việc tra cứu. Hai câu lệnh, bốn giây, và vấn đề dời từ "Internet chết rồi" về đúng một dịch vụ cụ thể. Đúng một phép so sánh đó kết thúc nhiều cuộc tranh cãi hơn bất kỳ phép thử nào khác trong môn này.'),

      q('Why must ping have -c in a script?|||Vì sao trong script thì ping bắt buộc phải có cờ -c?',
        ['To make the output shorter|||Để kết xuất ngắn hơn', 'Without it ping runs until interrupted, so the script hangs instead of testing|||Thiếu nó thì ping chạy tới khi bị ngắt, nên script treo thay vì thử được gì', 'It is required for the exit code to be set|||Nó bắt buộc để mã thoát được đặt', 'It enables the TTL field|||Nó bật trường TTL'],
        1,
        '-c sets the count. Without it, ping on Linux sends packets forever, so a health check or deploy step never returns and the pipeline hangs until somebody notices. Pair it with -W, which bounds how long to wait for a reply — the default can be tens of seconds. Measured on a real server, the exit code is 0 when a reply came back and 1 when none did, which makes ping -c 1 -W 2 host a valid one-line check of reachability, though not of any service.|||Cờ -c đặt số lượng gói. Thiếu nó thì trên Linux ping gửi gói mãi mãi, nên một phép kiểm sức khoẻ hay một bước deploy không bao giờ trả về và cả dây chuyền treo cho tới khi có người để ý. Hãy dùng kèm -W, cờ chặn trần thời gian chờ gói trả lời — mặc định có thể là hàng chục giây. Đo trên máy chủ thật, mã thoát là 0 khi có gói trả lời và 1 khi không, nhờ vậy ping -c 1 -W 2 host là một phép kiểm một dòng hợp lệ về khả năng tới được, dù không kiểm được dịch vụ nào.'),

      q('Why is blocking all ICMPv6 far worse than blocking all ICMPv4?|||Vì sao chặn toàn bộ ICMPv6 lại tệ hơn nhiều so với chặn toàn bộ ICMPv4?',
        ['ICMPv6 packets are larger|||Gói ICMPv6 lớn hơn', 'Neighbor Discovery, Router Advertisement and Packet Too Big are all ICMPv6|||Neighbor Discovery, Router Advertisement và Packet Too Big đều là ICMPv6', 'ICMPv6 cannot be filtered by a firewall|||Tường lửa không lọc được ICMPv6', 'IPv6 has no other diagnostic protocol|||IPv6 không có giao thức chẩn đoán nào khác'],
        1,
        'ICMPv4 is a convenience: block most of it and you lose ping, traceroute and path MTU discovery, but connectivity survives. ICMPv6 is structural. Types 135 and 136 ARE the ARP replacement, so hosts cannot find each other. Types 133 and 134 carry the prefix, so nothing gets a global address. Type 2 Packet Too Big is the ONLY path MTU mechanism, because IPv6 routers never fragment. The result presents as "IPv6 does not work here" and the cause is one firewall line. RFC 4890 exists to list what must be permitted.|||ICMPv4 là một tiện nghi: chặn gần hết nó thì bạn mất ping, traceroute và path MTU discovery, nhưng kết nối vẫn sống. ICMPv6 là cấu trúc. Type 135 và 136 CHÍNH LÀ thứ thay thế ARP, nên host không tìm được nhau. Type 133 và 134 mang theo tiền tố, nên không gì lấy được địa chỉ toàn cục. Type 2 Packet Too Big là cơ chế path MTU DUY NHẤT, bởi router IPv6 không bao giờ phân mảnh. Kết quả hiện ra thành "ở đây IPv6 không chạy" mà nguyên nhân là một dòng tường lửa. RFC 4890 tồn tại để liệt kê những gì bắt buộc phải cho qua.'),
    ],
  },
};

export default [
  {
    title: 'Chapter 12 — ICMP (FLM sessions 37-40)|||Chương 12 — Giao thức ICMP (buổi 37-40 của FLM)',
    slug: 'nwc204-chuong-12-icmp',
    description: 'Cisco Module 13 theo đúng buổi 37-40 của FLM, chương đầu tiên nói về việc TÌM RA vì sao mạng không chạy: ICMP là kênh phản hồi mà IP không có và nó báo cáo chứ không sửa chữa, nó nằm trong IP nên bản thân nó cũng mất được, ba nhóm thông điệp Echo và Time Exceeded và Destination Unreachable cùng các mã của nó, trường TTL và nghĩa vụ báo lại, vì sao ICMPv6 là bắt buộc chứ không phải tiện nghi; rồi đọc kết xuất ping từng trường, traceroute chạy bằng mẹo TTL chứ không có giao thức riêng, hai thứ trong bản trace trông như lỗi mà không phải, path MTU discovery và hố đen khi ICMP bị chặn, ranh giới thật của ping, thang ping năm bậc tách mạng khỏi DNS, và trọn Lab 2.3. Kèm phần ★ bổ sung đo trên máy chủ thật: ping tới địa chỉ trống thì IM LẶNG chứ không báo lỗi, TTL đếm ra số chặng, tracepath thật có no reply và asymm, ranh giới MTU 1472 so với 1473, và exit code dùng được trong script. Slide tiếng Anh do cuongthai.com dựng, giảng song ngữ.',
    lessons: [L1, L2, QUIZ],
  },
];
