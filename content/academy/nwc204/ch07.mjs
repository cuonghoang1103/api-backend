/**
 * NWC204 · Chapter 7 — The Network Layer (Cisco Module 8).
 * FLM buổi 21–22 (lý thuyết) + buổi 23 (Review Modules 1–7).
 *
 * Slide: scripts/slides-src/nwc204-ch07.mjs → deck 'nwc204-ch07', 31 ảnh.
 *
 * ★ = phần cuongthai.com bổ sung ngoài Module 8: Path MTU Discovery và lỗ đen
 *     MTU, cờ DF cùng MSS clamping, `ip route get`, nhiều bảng định tuyến của
 *     Linux với `ip rule`, và các tuyến Docker tự cắm vào máy chủ.
 *
 * ⚠️ Bất thường của bảng gốc, đã nêu trong bài, KHÔNG tự sửa bảng gốc:
 *   - Buổi 21 mang CQ7.3 "How does Ethernet works in a switched network?" —
 *     nội dung thuộc chương 6, đã trả lời ở bài 6.3.
 *   - Buổi 22 BỎ TRỐNG, không có câu hỏi kiến tạo nào.
 *   - Buổi 23 mang CQ8.1 "Why do we need use IP protocol for reliable
 *     communications?" — IP vốn KHÔNG tin cậy; câu hỏi tự mâu thuẫn, phải nói rõ.
 *
 * ⚠️ File này CHỈ chứa chương 7. Đừng sửa NWC204.mjs ở đây.
 */
import { registerDeck, walk, walkHead, bi, cq } from './_slides.mjs';

const D = registerDeck('nwc204-ch07', {
  code: 'NWC204',
  en: 'The Network Layer',
  vi: 'Tầng mạng',
  total: 31,
});

/* ──────────────────────── Lesson 7.1 — session 21 ──────────────────────── */

const L1 = {
  title: '7.1 — Network layer characteristics and the IPv4 packet (FLM session 21)|||7.1 — Đặc tính tầng mạng và gói tin IPv4 (buổi 21 của FLM)',
  slug: 'nwc204-7-1-dac-tinh-tang-mang-va-goi-ipv4',
  type: 'DOCUMENT',
  description: 'Buổi 21: bốn việc của tầng mạng, ba đặc tính của IP (không kết nối, nỗ lực tối đa, độc lập môi trường truyền), toàn bộ 12 trường của phần đầu IPv4 theo từng byte, TTL và cách traceroute lợi dụng nó, trường Protocol, phân mảnh IPv4, và phần ★ về lỗ đen MTU cùng cách chứng minh bằng ping -M do.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 7 · Lesson 7.1 · FLM session 21 of 60 · CLO4, CLO9 · Cisco Module 8</span>
<h2>The layer that makes "anywhere" possible</h2>
<p class="lead">Chapters 5 and 6 got a frame from one machine to its neighbour on the same wire. That is where layer 2 stops, permanently. A MAC address means nothing one hop away. Layer 3 is what lets a packet leave the building.</p>
<p><strong>Opening question:</strong> your VPS can ping the machine next to it but cannot reach the Internet. <code>ip route</code> prints exactly one line: <code>10.0.0.0/24 dev eth0 scope link src 10.0.0.42</code>. Nothing is broken, no cable is loose, no firewall rule exists. Which single line is missing, and why does the LAN keep working perfectly without it?</p>
<p class="note">★ A <strong>★</strong> marks material added by cuongthai.com beyond Cisco Module 8. The school's syllabus is covered in full first; the ★ parts are what you will actually need on your own server.</p>`,
      `<span class="eyebrow">NWC204 · Chương 7 · Bài 7.1 · Buổi 21/60 của FLM · CLO4, CLO9 · Cisco Module 8</span>
<h2>Tầng làm cho hai chữ "ở đâu cũng được" thành sự thật</h2>
<p class="lead">Chương 5 và 6 đưa được một cái khung từ máy này sang máy hàng xóm trên cùng sợi dây. Tầng 2 dừng lại ở đó, vĩnh viễn. Một địa chỉ MAC không còn nghĩa lý gì khi cách một chặng. Tầng 3 mới là thứ cho phép gói tin rời khỏi toà nhà.</p>
<p><strong>Câu hỏi mở đầu:</strong> VPS của bạn ping được máy bên cạnh nhưng không ra được Internet. <code>ip route</code> in ra đúng một dòng: <code>10.0.0.0/24 dev eth0 scope link src 10.0.0.42</code>. Không có gì hỏng, không tuột dây, không có luật tường lửa nào. Thiếu đúng một dòng nào, và vì sao mạng LAN vẫn chạy hoàn hảo dù thiếu nó?</p>
<p class="note">★ Dấu <strong>★</strong> đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 8. Giáo trình của trường được phủ đủ trước; phần ★ là thứ bạn sẽ thật sự cần trên máy chủ của mình.</p>`,
    ),

    walkHead('nwc204-ch07', 1, 14,
      'Slides 1–14 cover FLM session 21: 7.1 Network Layer Characteristics and 7.2 IPv4 Packet.',
      'Slide 1–14 là buổi 21 của FLM: 7.1 Network Layer Characteristics và 7.2 IPv4 Packet.'),

    walk('nwc204-ch07', [
      [1, 'Cover — Chapter 7, The Network Layer',
        `<p>Chapter 7 is <strong>Cisco Module 8</strong>, and FPT gives it three sessions.</p>
<ul>
<li>Session 21 — 7.1 Network Layer Characteristics, 7.2 IPv4 Packet.</li>
<li>Session 22 — 7.3 IPv6 Packet, 7.4 How a Host Routes, 7.5 Router Routing Tables, 7.6 AI tools (self-learning).</li>
<li>Session 23 — Review of Modules 1 to 7, before the second half of the course.</li>
<li>Outcomes: <strong>CLO4</strong> (explain how the layers interact), <strong>CLO9</strong> (use AI tools).</li>
</ul>
<p>This is the chapter that turns "my computer talks to the switch" into "my computer talks to a server in another country". Everything after it — ARP, router configuration, subnetting, ICMP — is detail hung on the frame this chapter builds.</p>`,
        `<p>Chương 7 là <strong>Module 8 của Cisco</strong>, và trường xếp ba buổi.</p>
<ul>
<li>Buổi 21 — 7.1 Network Layer Characteristics, 7.2 IPv4 Packet.</li>
<li>Buổi 22 — 7.3 IPv6 Packet, 7.4 How a Host Routes, 7.5 Router Routing Tables, 7.6 công cụ AI (tự học).</li>
<li>Buổi 23 — Ôn tập Module 1 tới 7, trước khi vào nửa sau của môn.</li>
<li>Chuẩn đầu ra: <strong>CLO4</strong> (giải thích các tầng phối hợp ra sao), <strong>CLO9</strong> (dùng công cụ AI).</li>
</ul>
<p>Đây là chương biến "máy tôi nói chuyện với con switch" thành "máy tôi nói chuyện với một máy chủ ở nước khác". Mọi thứ sau nó — ARP, cấu hình router, chia subnet, ICMP — chỉ là chi tiết treo lên cái khung mà chương này dựng.</p>`],

      [2, 'Layer 3 is where "anywhere" begins',
        `<p>Put the two addressing layers side by side and the division of labour is obvious.</p>
<ul>
<li><strong>Layer 2 — MAC.</strong> Valid on exactly one link. It is rewritten at every single hop, and it answers "which device on this wire?".</li>
<li><strong>Layer 3 — IP.</strong> Valid everywhere. It survives the entire journey untouched, and it answers "which machine on Earth?".</li>
</ul>
<p>That is why a packet carries <em>two</em> destination addresses at once and they usually point at different machines. The MAC says "give this to the router in the rack"; the IP says "this is ultimately for 93.184.216.34". Chapter 8 is about how the machine learns the first one.</p>
<p>Nothing above layer 3 is ever read by a router. It does not know or care whether the payload is HTTP, SSH or a video call — and that indifference is precisely why the Internet could grow.</p>`,
        `<p>Đặt hai tầng có đánh địa chỉ cạnh nhau là thấy ngay ai làm việc gì.</p>
<ul>
<li><strong>Tầng 2 — MAC.</strong> Chỉ có giá trị trên đúng một đường link. Nó bị viết lại ở từng chặng một, và nó trả lời câu "thiết bị nào trên sợi dây này?".</li>
<li><strong>Tầng 3 — IP.</strong> Có giá trị ở khắp nơi. Nó sống nguyên vẹn suốt cả hành trình, và nó trả lời câu "máy nào trên Trái Đất?".</li>
</ul>
<p>Đó là lý do một gói tin mang <em>hai</em> địa chỉ đích cùng lúc, và thường thì hai cái đó trỏ vào hai máy khác nhau. MAC nói "đưa cái này cho con router trong tủ rack"; IP nói "rốt cuộc cái này là của 93.184.216.34". Chương 8 nói về việc máy học được cái thứ nhất bằng cách nào.</p>
<p>Không có gì trên tầng 3 được router đọc tới. Nó không biết và không cần biết phần tải là HTTP, SSH hay một cuộc gọi video — và chính sự dửng dưng đó là lý do Internet lớn lên được.</p>`],

      [3, 'Four operations, and only four',
        `<p>Cisco lists four jobs for the network layer, and the list is worth memorising because <strong>what is missing from it matters more than what is on it</strong>.</p>
<ol>
<li><strong>Addressing end devices.</strong> Every host gets an IP so it can be named from anywhere.</li>
<li><strong>Encapsulation.</strong> The transport segment receives an IP header with source and destination IP. It is now a <em>packet</em>.</li>
<li><strong>Routing.</strong> Each router chooses a next hop, builds a brand-new layer-2 frame for that link, and sends it.</li>
<li><strong>De-encapsulation.</strong> The destination strips the IP header and passes the segment to layer 4.</li>
</ol>
<p>Not on the list: retransmission, ordering, duplicate removal, flow control, congestion control, encryption. IP does none of them. Ask "who does?" and the answer is always either layer 4 or the application — never the network.</p>`,
        `<p>Cisco liệt kê bốn việc cho tầng mạng, và cái danh sách này đáng thuộc lòng vì <strong>thứ VẮNG MẶT trong đó còn quan trọng hơn thứ có mặt</strong>.</p>
<ol>
<li><strong>Đánh địa chỉ thiết bị đầu cuối.</strong> Mỗi máy có một IP để có thể được gọi tên từ bất cứ đâu.</li>
<li><strong>Đóng gói.</strong> Đoạn tin của tầng giao vận được gắn thêm phần đầu IP có IP nguồn và IP đích. Giờ nó là một <em>gói tin</em>.</li>
<li><strong>Định tuyến.</strong> Mỗi router chọn chặng kế tiếp, dựng một cái khung tầng 2 hoàn toàn mới cho đường link đó, rồi gửi đi.</li>
<li><strong>Tháo gói.</strong> Máy đích bóc phần đầu IP ra và đưa đoạn tin lên tầng 4.</li>
</ol>
<p>Không có trong danh sách: gửi lại, sắp thứ tự, loại bản trùng, điều khiển luồng, điều khiển tắc nghẽn, mã hoá. IP không làm cái nào cả. Hỏi "vậy ai làm?" thì câu trả lời luôn là tầng 4 hoặc ứng dụng — không bao giờ là mạng.</p>`],

      [4, 'Encapsulation — what L3 adds, and what it never reads',
        `<p>Read the nesting from the outside in and you can name exactly who is allowed to touch each layer.</p>
<ul>
<li><strong>Ethernet frame</strong> — rewritten completely by <em>every</em> router. New source MAC, new destination MAC, new FCS, every single hop.</li>
<li><strong>IPv4 packet</strong> — the source and destination IP are never changed by a router. TTL goes down by one, and the header checksum is recomputed because of it. Nothing else moves.</li>
<li><strong>TCP segment</strong> — no router ever opens it. Ports, sequence numbers and the payload are between the two end machines only.</li>
</ul>
<p>The one honest exception is <strong>NAT</strong>, which does rewrite the IP header and often the port too. NAT is a deliberate violation of this model, and almost every strange networking problem you will meet on a home or office connection comes from it.</p>`,
        `<p>Đọc cái vỏ lồng nhau từ ngoài vào trong là gọi được tên chính xác ai được phép đụng vào tầng nào.</p>
<ul>
<li><strong>Khung Ethernet</strong> — bị <em>mọi</em> router viết lại hoàn toàn. MAC nguồn mới, MAC đích mới, FCS mới, ở từng chặng một.</li>
<li><strong>Gói IPv4</strong> — IP nguồn và IP đích không bao giờ bị router đổi. TTL giảm đi một, và checksum của phần đầu được tính lại vì thế. Ngoài ra không có gì nhúc nhích.</li>
<li><strong>Đoạn tin TCP</strong> — không router nào mở nó ra. Cổng, số thứ tự và phần tải là chuyện riêng của hai máy ở hai đầu.</li>
</ul>
<p>Ngoại lệ thành thật duy nhất là <strong>NAT</strong>, thứ có viết lại phần đầu IP và thường viết lại cả cổng. NAT là một sự vi phạm mô hình có chủ ý, và gần như mọi vấn đề mạng kỳ quặc bạn gặp ở nhà hay ở văn phòng đều sinh ra từ nó.</p>`],

      [5, 'Characteristic 1 — IP is CONNECTIONLESS',
        `<p>IP never asks permission. There is no handshake, no session, no state stored anywhere along the path. The sender simply writes an address on a packet and lets it go.</p>
<p>Compare with the TCP handshake on the left of the slide: three messages before a single byte of data moves. That is layer 4. At layer 3 there is only the one arrow.</p>
<p><strong>Why it was designed this way.</strong> State costs memory, and memory in the middle of the network has to be paid for by every router on every path. If a router had to remember every conversation crossing it, a core router would need to track hundreds of millions of sessions — and would lose all of them the moment it rebooted. Keeping the middle stateless means a router can reboot, or a path can change mid-conversation, and the packets simply take the new road.</p>
<p><strong>The cost you pay for it:</strong> the sender never finds out that a packet was lost. Something above IP has to notice.</p>`,
        `<p>IP không bao giờ xin phép. Không có bắt tay, không có phiên, không có trạng thái nào được lưu ở bất cứ đâu dọc đường. Bên gửi chỉ việc ghi địa chỉ lên gói tin rồi thả nó đi.</p>
<p>So với cái bắt tay TCP ở bên trái slide: ba thông điệp trước khi một byte dữ liệu nào nhúc nhích. Đó là tầng 4. Ở tầng 3 chỉ có đúng một mũi tên.</p>
<p><strong>Vì sao lại thiết kế như vậy.</strong> Trạng thái tốn bộ nhớ, và bộ nhớ ở giữa mạng thì mọi router trên mọi đường đi đều phải trả. Nếu một router phải nhớ từng cuộc trò chuyện đi qua nó, một router lõi sẽ phải theo dõi hàng trăm triệu phiên — và mất sạch chúng ngay lúc khởi động lại. Giữ cho phần giữa không có trạng thái nghĩa là router khởi động lại được, hoặc đường đi đổi giữa chừng được, mà gói tin chỉ việc đi theo con đường mới.</p>
<p><strong>Cái giá bạn trả:</strong> bên gửi không bao giờ biết là có gói bị mất. Phải có thứ gì đó ở trên IP nhận ra điều đó.</p>`],

      [6, 'Characteristic 2 — IP is BEST-EFFORT',
        `<p>"Best-effort" is a polite way of saying <strong>unreliable</strong>. IP promises to try, and nothing more. A packet may be dropped by a full queue, discarded when TTL hits zero, arrive out of order, or arrive twice.</p>
<p><strong>Why it was designed this way — the end-to-end argument.</strong> If the network guaranteed delivery, it would have to buffer every packet until it was acknowledged, at every hop. That is expensive, and it is also <em>useless</em> for the applications that do not want it: a voice call would rather lose a 20 ms sample than wait 300 ms for it to be resent. So reliability was pushed to the two ends, where the application can choose. TCP chooses reliability; UDP chooses speed.</p>
<p><strong>The trap FLM sets you.</strong> The school's own constructive question for session 23 reads "Why do we need use IP protocol for <em>reliable</em> communications?". The premise is wrong, and saying so is the correct answer — then explain that IP provides the addressing and forwarding that a reliable protocol is built <em>on top of</em>.</p>`,
        `<p>"Nỗ lực tối đa" là cách nói lịch sự của chữ <strong>không tin cậy</strong>. IP hứa là sẽ cố, chấm hết. Một gói tin có thể bị vứt vì hàng đợi đầy, bị huỷ khi TTL về 0, tới sai thứ tự, hoặc tới hai lần.</p>
<p><strong>Vì sao lại thiết kế như vậy — lập luận đầu-cuối.</strong> Nếu mạng bảo đảm chuyển tới nơi, nó sẽ phải giữ tạm mọi gói tin cho tới khi có xác nhận, ở từng chặng. Việc đó vừa đắt, vừa <em>vô ích</em> với những ứng dụng không cần: một cuộc gọi thoại thà mất một mẩu 20 ms còn hơn chờ 300 ms để nó được gửi lại. Nên tính tin cậy bị đẩy về hai đầu, nơi ứng dụng được quyền chọn. TCP chọn tin cậy; UDP chọn nhanh.</p>
<p><strong>Cái bẫy FLM giăng cho bạn.</strong> Câu hỏi kiến tạo của chính trường cho buổi 23 viết "Vì sao chúng ta cần giao thức IP cho truyền thông <em>tin cậy</em>?". Tiền đề của câu đó sai, và nói thẳng ra điều đó mới là trả lời đúng — rồi giải thích rằng IP cung cấp phần đánh địa chỉ và chuyển tiếp mà một giao thức tin cậy được xây <em>ở trên</em>.</p>`],

      [7, 'Characteristic 3 — IP is MEDIA INDEPENDENT',
        `<p>The same IP packet crosses copper, fibre, Wi-Fi, 4G and a VPN tunnel without a single field changing. Layer 3 was designed to know nothing about the wire — which is why IP survived the death of Token Ring, the arrival of Wi-Fi and the arrival of 5G without a new version.</p>
<p>There is exactly <strong>one</strong> property of the medium that layer 3 cannot ignore: the <strong>MTU</strong>, the largest payload that link will carry. Ethernet is 1500 bytes. PPPoE, used by many home fibre connections, is 1492. A WireGuard tunnel is typically 1420.</p>
<ul>
<li><strong>IPv4:</strong> a packet too big for the next link is <em>fragmented by the router</em>, silently.</li>
<li><strong>IPv6:</strong> the router refuses. It drops the packet and sends back ICMPv6 Packet Too Big, and the sender must resize.</li>
</ul>
<p>Hold on to the numbers 1500, 1492 and 1420 — they are behind the ★ fault two slides from now.</p>`,
        `<p>Cùng một gói IP đi qua đồng, quang, Wi-Fi, 4G và một đường hầm VPN mà không đổi một trường nào. Tầng 3 được thiết kế để không biết gì về sợi dây — và đó là lý do IP sống sót qua cái chết của Token Ring, qua sự xuất hiện của Wi-Fi và của 5G mà không cần một phiên bản mới nào.</p>
<p>Có đúng <strong>một</strong> tính chất của môi trường truyền mà tầng 3 không thể làm ngơ: <strong>MTU</strong>, phần tải lớn nhất mà đường link đó chở được. Ethernet là 1500 byte. PPPoE, thứ nhiều đường cáp quang gia đình dùng, là 1492. Một đường hầm WireGuard thường là 1420.</p>
<ul>
<li><strong>IPv4:</strong> gói quá to so với chặng kế tiếp sẽ <em>bị router cắt nhỏ</em>, lặng lẽ.</li>
<li><strong>IPv6:</strong> router từ chối. Nó vứt gói đi và gửi về ICMPv6 Packet Too Big, bên gửi phải tự chỉnh lại kích thước.</li>
</ul>
<p>Nhớ kỹ ba con số 1500, 1492 và 1420 — chúng đứng sau cái lỗi ★ ở hai slide nữa.</p>`],

      [8, 'The IPv4 header — all twelve fields',
        `<p>Twenty bytes, five rows of four. Learn the layout as a picture, not a list — in Wireshark you will be counting bytes from the start of the header, and the picture is what makes that fast.</p>
<ul>
<li><strong>Row 1</strong> — Version, IHL, DSCP, ECN, Total Length. Who I am and how big I am.</li>
<li><strong>Row 2</strong> — Identification, Flags, Fragment Offset. Everything about fragmentation lives here, and nowhere else.</li>
<li><strong>Row 3</strong> — TTL, Protocol, Header Checksum. The two most useful fields for diagnosis sit next to each other.</li>
<li><strong>Rows 4 and 5</strong> — source and destination IPv4 address, 32 bits each.</li>
</ul>
<p>Two-thirds of the header does something you can observe with a command you already have. The rest matters on exams and in packet captures.</p>`,
        `<p>Hai mươi byte, năm hàng bốn byte. Hãy học cái bố cục này như một BỨC TRANH chứ đừng học như một danh sách — trong Wireshark bạn sẽ phải đếm byte từ đầu phần đầu gói, và chính bức tranh mới làm việc đó nhanh.</p>
<ul>
<li><strong>Hàng 1</strong> — Version, IHL, DSCP, ECN, Total Length. Tôi là ai và tôi to bao nhiêu.</li>
<li><strong>Hàng 2</strong> — Identification, Flags, Fragment Offset. Mọi thứ về phân mảnh nằm ở đây, và không ở đâu khác.</li>
<li><strong>Hàng 3</strong> — TTL, Protocol, Header Checksum. Hai trường hữu ích nhất cho việc chẩn đoán nằm ngay cạnh nhau.</li>
<li><strong>Hàng 4 và 5</strong> — địa chỉ IPv4 nguồn và đích, mỗi cái 32 bit.</li>
</ul>
<p>Hai phần ba phần đầu này làm một việc mà bạn quan sát được bằng lệnh đã có sẵn trong máy. Phần còn lại thì quan trọng lúc thi và lúc soi gói tin.</p>`],

      [9, 'Version, IHL, DSCP and ECN — the first four bytes',
        `<p>Four fields crammed into the first four bytes, and two of them are worth real money on a network you own.</p>
<ul>
<li><strong>Version</strong> is how the receiver knows which parser to run. A 4 here and the rest of this slide applies; a 6 and the header is a completely different shape.</li>
<li><strong>IHL</strong> counts 4-byte words. IHL = 5 means a plain 20-byte header, which is what you will see 99% of the time. Options push it up to 60 bytes and are frequently dropped by firewalls, so nobody relies on them.</li>
<li><strong>Total Length</strong> is 16 bits, so <strong>no IP packet can ever exceed 65 535 bytes</strong>. That is a hard ceiling in the protocol, not a configuration.</li>
<li><strong>DSCP</strong> is quality of service: 46 (EF) for voice, 0 for everything ordinary.</li>
<li><strong>ECN</strong> lets a congested router mark a packet instead of dropping it, so TCP slows down without anyone losing data.</li>
</ul>
<p>DSCP only works if every device along the path is configured to honour it. Across the public Internet it is usually rewritten to zero, so spend effort on it only inside networks you control.</p>`,
        `<p>Bốn trường nhét vào bốn byte đầu, và hai trong số đó đáng tiền thật trên một mạng do bạn làm chủ.</p>
<ul>
<li><strong>Version</strong> là cách bên nhận biết phải chạy bộ đọc nào. Ghi 4 thì cả slide này đúng; ghi 6 thì phần đầu có hình dạng hoàn toàn khác.</li>
<li><strong>IHL</strong> đếm theo từ 4 byte. IHL = 5 nghĩa là phần đầu trơn 20 byte, và đó là thứ bạn gặp 99% số lần. Options đẩy nó lên tới 60 byte và thường bị tường lửa vứt, nên không ai dựa vào nó.</li>
<li><strong>Total Length</strong> rộng 16 bit, nên <strong>không gói IP nào vượt quá 65 535 byte được</strong>. Đó là trần cứng nằm trong giao thức, không phải một tuỳ chỉnh.</li>
<li><strong>DSCP</strong> là chất lượng dịch vụ: 46 (EF) cho thoại, 0 cho mọi thứ thường.</li>
<li><strong>ECN</strong> cho phép một router đang tắc đánh dấu gói thay vì vứt nó, để TCP chậm lại mà không ai mất dữ liệu.</li>
</ul>
<p>DSCP chỉ có tác dụng nếu mọi thiết bị dọc đường đều được cấu hình để tôn trọng nó. Ra Internet công cộng thì nó thường bị ghi đè về 0, nên chỉ đổ công vào nó trong mạng bạn kiểm soát được.</p>`],

      [10, 'TTL — the loop brake that became a diagnostic tool',
        `<p>TTL is eight bits, and it does exactly one thing: <strong>every router that forwards the packet subtracts one</strong>. When it reaches zero, that router discards the packet and sends back an ICMP Time Exceeded (type 11).</p>
<p><strong>Why it exists.</strong> Routing tables can disagree with each other for a few seconds after a change. During that window R1 can believe the way to a network is via R2, while R2 believes it is via R1. Without TTL the packet would bounce between them until one of them ran out of memory, and the loop would take the whole link down. TTL puts a hard limit on that: at most 64 wrong decisions, then the packet dies quietly.</p>
<p><strong>How traceroute turns the brake into a map.</strong> Send a packet with TTL = 1 and the first router is forced to reply with Time Exceeded — revealing its address. Send TTL = 2 and the second router replies. Repeat. Every hop on the path identifies itself, one round at a time, using a mechanism designed to prevent loops.</p>
<p>The initial value also fingerprints the sender: Linux and macOS start at 64, Windows at 128, Cisco IOS at 255. A reply arriving with TTL 57 came from a Linux machine seven hops away.</p>`,
        `<p>TTL rộng tám bit, và nó làm đúng một việc: <strong>mọi router chuyển tiếp gói đều trừ đi một</strong>. Khi về 0, router đó vứt gói đi và gửi trả về một ICMP Time Exceeded (loại 11).</p>
<p><strong>Vì sao nó tồn tại.</strong> Các bảng định tuyến có thể mâu thuẫn với nhau trong vài giây sau một thay đổi. Trong cái khe đó R1 có thể tin rằng đường tới một mạng là qua R2, còn R2 lại tin là qua R1. Không có TTL thì gói tin sẽ nảy qua nảy lại giữa hai đứa cho tới khi một đứa hết bộ nhớ, và vòng lặp đó kéo sập cả đường link. TTL đặt một giới hạn cứng lên chuyện đó: nhiều nhất 64 quyết định sai, rồi gói tin chết lặng lẽ.</p>
<p><strong>Traceroute biến cái phanh thành tấm bản đồ ra sao.</strong> Gửi một gói TTL = 1 thì router đầu tiên buộc phải trả lời Time Exceeded — để lộ địa chỉ của nó. Gửi TTL = 2 thì router thứ hai trả lời. Cứ thế. Mọi chặng trên đường tự khai tên, mỗi lượt một chặng, bằng đúng cái cơ chế sinh ra để chống vòng lặp.</p>
<p>Giá trị khởi đầu còn nhận diện được bên gửi: Linux và macOS bắt đầu ở 64, Windows ở 128, Cisco IOS ở 255. Một gói trả lời về với TTL 57 là từ một máy Linux cách bảy chặng.</p>`],

      [11, 'Protocol — the field that says what is inside',
        `<p>One byte, and it decides which piece of code on the destination machine receives the payload. Six values cover nearly everything you will ever see.</p>
<ul>
<li><strong>1 — ICMP.</strong> ping, traceroute, "destination unreachable", "fragmentation needed". Not a layer-4 protocol at all; it rides directly in IP.</li>
<li><strong>6 — TCP</strong> and <strong>17 — UDP.</strong> The two you will meet constantly.</li>
<li><strong>41 — IPv6 in IPv4</strong>, <strong>47 — GRE</strong>, <strong>50 — ESP</strong> (IPsec). Tunnels.</li>
<li><strong>89 — OSPF.</strong> Routers talking to each other.</li>
</ul>
<p><strong>The practical consequence, and it bites people constantly:</strong> a firewall rule that only talks about <em>ports</em> cannot see ICMP, GRE or ESP at all, because those protocols have no ports. "Allow TCP 443 and UDP 53, deny everything else" silently blocks ping, traceroute, Path MTU Discovery and every IPsec VPN. That is how the ★ fault two slides from now gets created.</p>`,
        `<p>Một byte, và nó quyết định đoạn mã nào trên máy đích nhận phần tải. Sáu giá trị phủ gần hết những thứ bạn sẽ gặp trong đời.</p>
<ul>
<li><strong>1 — ICMP.</strong> ping, traceroute, "destination unreachable", "fragmentation needed". Nó không phải giao thức tầng 4, nó đi thẳng trong IP.</li>
<li><strong>6 — TCP</strong> và <strong>17 — UDP.</strong> Hai đứa bạn sẽ gặp liên tục.</li>
<li><strong>41 — IPv6 trong IPv4</strong>, <strong>47 — GRE</strong>, <strong>50 — ESP</strong> (IPsec). Các loại đường hầm.</li>
<li><strong>89 — OSPF.</strong> Router nói chuyện với nhau.</li>
</ul>
<p><strong>Hệ quả thực tế, và nó cắn người ta liên tục:</strong> một luật tường lửa chỉ nói về <em>cổng</em> thì hoàn toàn không nhìn thấy ICMP, GRE hay ESP, vì mấy giao thức đó không có cổng. "Cho TCP 443 và UDP 53, chặn hết phần còn lại" sẽ âm thầm chặn luôn ping, traceroute, Path MTU Discovery và mọi VPN IPsec. Đó chính là cách người ta tạo ra cái lỗi ★ ở hai slide nữa.</p>`],

      [12, 'Fragmentation — how IPv4 survives a small link',
        `<p>A 4000-byte packet meets a link with MTU 1500. The <strong>router</strong> splits it into three fragments, and the sender is never told.</p>
<ul>
<li>All three carry the <strong>same Identification</strong> (0x4A1F here) so the destination can group them.</li>
<li><strong>MF (More Fragments) = 1</strong> on all but the last, which carries 0.</li>
<li><strong>Fragment Offset</strong> counts in units of <strong>8 bytes</strong>: the second fragment starts at byte 1480, so its offset field says 1480 / 8 = 185.</li>
</ul>
<p><strong>Only the destination reassembles</strong> — never an intermediate router, because the three fragments may legitimately take three different paths. That creates the real danger: lose <em>one</em> fragment of three and the entire 4000-byte packet is lost, so a 1% link loss rate becomes roughly a 3% packet loss rate for fragmented traffic.</p>
<p>IPv6 removed router fragmentation entirely for exactly this reason. The source has to get the size right, and the network tells it when it did not.</p>`,
        `<p>Một gói 4000 byte gặp đường link có MTU 1500. <strong>Router</strong> cắt nó thành ba mảnh, và bên gửi không hề được báo.</p>
<ul>
<li>Cả ba mảnh mang <strong>cùng một Identification</strong> (ở đây là 0x4A1F) để máy đích gom chúng lại.</li>
<li><strong>MF (More Fragments) = 1</strong> ở mọi mảnh trừ mảnh cuối, mảnh cuối ghi 0.</li>
<li><strong>Fragment Offset</strong> đếm theo đơn vị <strong>8 byte</strong>: mảnh thứ hai bắt đầu ở byte 1480, nên trường offset của nó ghi 1480 / 8 = 185.</li>
</ul>
<p><strong>Chỉ máy đích mới ghép lại</strong> — không bao giờ là router ở giữa, vì ba mảnh hoàn toàn có quyền đi ba đường khác nhau. Điều đó tạo ra mối nguy thật: mất <em>một</em> mảnh trong ba là mất trọn gói 4000 byte, nên một đường link mất 1% sẽ thành mất khoảng 3% gói với lưu lượng bị phân mảnh.</p>
<p>IPv6 bỏ hẳn việc router phân mảnh chính vì lý do đó. Bên gửi phải chọn đúng kích thước, và mạng sẽ báo cho nó biết khi nó chọn sai.</p>`],

      [13, '★ The MTU black hole — a fault that looks like magic',
        `<p>This is the single most useful thing in the chapter for someone who runs their own server, and it is not in Module 8.</p>
<p><strong>The symptom.</strong> The connection <em>opens</em> perfectly. SSH logs you in, then freezes the instant you run a command with long output. A web page starts loading and hangs forever. <code>ping</code> works. Small things work; big things die.</p>
<p><strong>The mechanism.</strong> TCP sets the DF (Don't Fragment) bit on modern connections, so a router that cannot fit the packet must <em>drop</em> it and send back ICMP type 3 code 4, "fragmentation needed". That message is how the sender learns to send smaller — the mechanism is called Path MTU Discovery. Block that one ICMP message "for security" and the sender never learns. It keeps sending 1500-byte packets into a 1420-byte tunnel forever, and they keep vanishing.</p>
<p>The handshake survives because SYN packets are tiny. The request survives because a GET is tiny. Only the <em>response</em>, which fills packets to the MTU, dies. That asymmetry is exactly what makes the fault look supernatural.</p>`,
        `<p>Đây là thứ hữu ích nhất trong cả chương với người tự vận hành máy chủ, và nó không có trong Module 8.</p>
<p><strong>Triệu chứng.</strong> Kết nối <em>mở</em> hoàn hảo. SSH vào được, rồi đơ cứng ngay khi bạn chạy một lệnh có kết xuất dài. Trang web bắt đầu tải rồi treo mãi mãi. <code>ping</code> thì chạy. Thứ nhỏ chạy được; thứ lớn thì chết.</p>
<p><strong>Cơ chế.</strong> TCP bật cờ DF (Don't Fragment) trên kết nối hiện đại, nên một router không nhét vừa gói tin buộc phải <em>vứt</em> nó và gửi trả về ICMP loại 3 mã 4, "cần phân mảnh". Chính thông điệp đó là cách bên gửi học được là phải gửi nhỏ lại — cơ chế này tên là Path MTU Discovery. Chặn đúng cái thông điệp ICMP ấy "cho an toàn" là bên gửi không bao giờ học được. Nó cứ gửi gói 1500 byte vào một đường hầm 1420 byte mãi mãi, và chúng cứ biến mất.</p>
<p>Cái bắt tay sống sót vì gói SYN bé xíu. Lời yêu cầu sống sót vì một câu GET bé xíu. Chỉ có <em>phần trả lời</em>, thứ nhồi gói đầy tới MTU, là chết. Chính sự lệch đó làm cho cái lỗi này trông như có ma.</p>`],

      [14, '★ Proving and fixing an MTU black hole',
        `<p>Never guess at this — measure it. <code>ping -M do</code> sets the DF bit, so the packet is either delivered whole or refused.</p>
<p><strong>Read the arithmetic carefully:</strong> the <code>-s</code> value is the ICMP payload. Add 8 bytes of ICMP header and 20 bytes of IP header to get the real packet size. So <code>-s 1472</code> is exactly 1500 on the wire, and that is why 1472 is the magic number for a plain Ethernet path.</p>
<p><strong>The method.</strong> Start at 1472. If it passes, your path is 1500 and there is no black hole. If it fails, binary-search downwards: 1372, then 1422, then 1392 — each success moves the floor up, each failure moves the ceiling down. Whatever value last succeeds, add 28, and that is your real path MTU.</p>
<p><strong>The fix.</strong> Either stop blocking ICMP type 3 (it is a control message, not an attack surface), or clamp the TCP MSS so the two ends never negotiate a size that cannot fit. On a Linux gateway that is one nftables rule; on a Cisco router it is <code>ip tcp adjust-mss 1380</code> on the tunnel interface.</p>`,
        `<p>Đừng bao giờ đoán chuyện này — hãy đo. <code>ping -M do</code> bật cờ DF, nên gói tin hoặc tới nơi nguyên vẹn hoặc bị từ chối.</p>
<p><strong>Đọc kỹ phép tính:</strong> giá trị <code>-s</code> là phần tải ICMP. Cộng thêm 8 byte phần đầu ICMP và 20 byte phần đầu IP mới ra kích thước gói thật. Nên <code>-s 1472</code> chính là 1500 trên dây, và đó là lý do 1472 là con số thần chú cho một đường Ethernet trơn.</p>
<p><strong>Cách làm.</strong> Bắt đầu ở 1472. Qua được thì đường của bạn là 1500 và không có lỗ đen nào. Hỏng thì tìm nhị phân đi xuống: 1372, rồi 1422, rồi 1392 — mỗi lần qua được thì nâng sàn lên, mỗi lần hỏng thì hạ trần xuống. Giá trị cuối cùng qua được, cộng 28, chính là MTU thật của đường đi.</p>
<p><strong>Cách sửa.</strong> Hoặc thôi chặn ICMP loại 3 (nó là thông điệp điều khiển, không phải bề mặt tấn công), hoặc ghim TCP MSS để hai đầu không bao giờ thoả thuận ra một kích thước không nhét vừa. Trên một cổng ra Linux thì đó là một luật nftables; trên router Cisco thì là <code>ip tcp adjust-mss 1380</code> đặt trên cổng của đường hầm.</p>`],
    ]),

    bi(
      `<h3>🧮 The one calculation layer 3 does on every single packet</h3>
<p>Everything in this chapter rests on one operation: <strong>bitwise AND between an address and a mask</strong>. That is how a host decides local or remote, and how a router matches a route. Do it once by hand and it will never confuse you again.</p>
<p>Your machine is <strong>192.168.10.42/24</strong>. You want to reach <strong>192.168.10.200</strong>.</p>
<pre><code class="language-plaintext">My address   192.168.10.42    11000000.10101000.00001010.00101010
My mask      255.255.255.0    11111111.11111111.11111111.00000000
AND          ---------------------------------------------------
My network   192.168.10.0     11000000.10101000.00001010.00000000

Target       192.168.10.200   11000000.10101000.00001010.11001000
Same mask    255.255.255.0    11111111.11111111.11111111.00000000
AND          ---------------------------------------------------
Its network  192.168.10.0     11000000.10101000.00001010.00000000

192.168.10.0 == 192.168.10.0   ->  SAME NETWORK  ->  deliver directly</code></pre>
<p>Now the same target from <strong>192.168.11.42/24</strong>:</p>
<pre><code class="language-plaintext">My network   192.168.11.0
Its network  192.168.10.0
Different    ->  REMOTE  ->  send the frame to the default gateway instead</code></pre>
<p><strong>The critical subtlety:</strong> the host applies <em>its own</em> mask to the destination. It has no idea what mask the destination uses. This is why a wrong mask on one machine produces a fault that looks like it is on the other machine.</p>`,
      `<h3>🧮 Phép tính duy nhất tầng 3 làm với từng gói một</h3>
<p>Mọi thứ trong chương này dựa trên một phép toán: <strong>AND theo bit giữa địa chỉ và mặt nạ</strong>. Đó là cách một máy quyết định cục bộ hay ở xa, và là cách router khớp một tuyến. Làm bằng tay một lần thôi là nó không bao giờ làm bạn rối nữa.</p>
<p>Máy bạn là <strong>192.168.10.42/24</strong>. Bạn muốn tới <strong>192.168.10.200</strong>.</p>
<pre><code class="language-plaintext">Địa chỉ tôi   192.168.10.42    11000000.10101000.00001010.00101010
Mặt nạ tôi    255.255.255.0    11111111.11111111.11111111.00000000
AND           ---------------------------------------------------
Mạng của tôi  192.168.10.0     11000000.10101000.00001010.00000000

Đích          192.168.10.200   11000000.10101000.00001010.11001000
Cùng mặt nạ   255.255.255.0    11111111.11111111.11111111.00000000
AND           ---------------------------------------------------
Mạng của nó   192.168.10.0     11000000.10101000.00001010.00000000

192.168.10.0 == 192.168.10.0   ->  CÙNG MẠNG  ->  gửi thẳng</code></pre>
<p>Giờ cũng cái đích đó, nhưng từ <strong>192.168.11.42/24</strong>:</p>
<pre><code class="language-plaintext">Mạng của tôi  192.168.11.0
Mạng của nó   192.168.10.0
Khác nhau     ->  Ở XA  ->  đẩy khung cho cổng ra mặc định thay vì gửi thẳng</code></pre>
<p><strong>Điểm tinh tế sống còn:</strong> máy áp <em>mặt nạ của chính nó</em> lên địa chỉ đích. Nó hoàn toàn không biết máy đích dùng mặt nạ nào. Đó là lý do một mặt nạ sai trên máy này lại đẻ ra một lỗi trông như nằm ở máy kia.</p>`,
    ),

    bi(
      `<h3>🗺️ The journey of one packet, drawn</h3>
<pre><code class="language-mermaid">graph TD
  A["App writes data<br/>to a socket"] --> B["L4 adds ports<br/>= segment"]
  B --> C["L3 adds src IP + dst IP<br/>TTL 64 · Protocol 6<br/>= PACKET"]
  C --> D{"dst AND my mask<br/>= my network?"}
  D -->|"yes"| E["dst MAC = the target itself"]
  D -->|"no"| F["dst MAC = default gateway<br/>dst IP unchanged"]
  E --> G["L2 frame on the wire<br/>rebuilt at EVERY hop"]
  F --> G
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class D ask
  class A,B,C act
  class E,F,G ok</code></pre>
<p>The whole of layer 3 is in that diamond. Everything above it is encapsulation; everything below it is Chapter 6.</p>`,
      `<h3>🗺️ Hành trình của một gói tin, vẽ ra</h3>
<pre><code class="language-mermaid">graph TD
  A["Ứng dụng ghi dữ liệu<br/>vào socket"] --> B["L4 gắn số cổng<br/>= đoạn tin"]
  B --> C["L3 gắn IP nguồn + IP đích<br/>TTL 64 · Protocol 6<br/>= GÓI TIN"]
  C --> D{"đích AND mặt nạ của tôi<br/>= mạng của tôi?"}
  D -->|"đúng"| E["MAC đích = chính máy kia"]
  D -->|"không"| F["MAC đích = cổng ra mặc định<br/>IP đích giữ nguyên"]
  E --> G["Khung L2 trên dây<br/>dựng lại ở MỌI chặng"]
  F --> G
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class D ask
  class A,B,C act
  class E,F,G ok</code></pre>
<p>Toàn bộ tầng 3 nằm trong cái hình thoi đó. Mọi thứ phía trên nó là đóng gói; mọi thứ phía dưới nó là chương 6.</p>`,
    ),

    bi(
      `<h3>🔍 How to check this yourself</h3>
<p>Run these on any Linux machine — your VPS, a container, WSL. Each one proves a claim made above.</p>
<pre><code class="language-bash"># 1. Read your own layer-3 configuration: address, mask, and the network it implies
ip -brief addr show

# 2. What the kernel would REALLY do with a packet for that destination
ip route get 8.8.8.8
ip route get 10.0.0.99

# 3. Watch TTL come down, one hop per line
traceroute -n 1.1.1.1

# 4. Read TTL on the way back and count the hops
ping -c 1 1.1.1.1

# 5. Find the true path MTU with the DF bit set
ping -M do -s 1472 -c 2 1.1.1.1

# 6. See the header fields themselves
sudo tcpdump -n -v -c 3 icmp</code></pre>
<h4>Reading the results</h4>
<ul>
<li><code>ip route get</code> printing <strong>via &lt;address&gt;</strong> means REMOTE — the packet goes to a router. No <code>via</code> means LOCAL — direct delivery on this link.</li>
<li><code>ttl=57</code> in a ping reply from a Linux server means <strong>64 − 57 = 7 hops</strong>. A reply with <code>ttl=119</code> came from Windows, 9 hops away.</li>
<li>Every line of <code>traceroute</code> is one ICMP Time Exceeded, i.e. one router admitting it dropped your packet. Three stars <code>* * *</code> mean that hop is configured not to answer — <strong>not</strong> that the path is broken.</li>
<li><code>ping -M do -s 1472</code> succeeding proves the path carries full 1500-byte packets. Failing with <em>message too long</em> from your own machine is your NIC refusing; failing with <em>silence</em> is the black hole.</li>
<li>In <code>tcpdump -v</code> you will literally see <code>ttl 64, id 12345, offset 0, flags [DF], proto ICMP (1), length 84</code> — every field from slide 8, in order.</li>
</ul>`,
      `<h3>🔍 Cách tự kiểm</h3>
<p>Chạy mấy lệnh này trên bất cứ máy Linux nào — VPS của bạn, một container, hay WSL. Mỗi lệnh chứng minh một khẳng định ở trên.</p>
<pre><code class="language-bash"># 1. Đọc cấu hình tầng 3 của chính mình: địa chỉ, mặt nạ, và mạng suy ra từ đó
ip -brief addr show

# 2. Nhân THẬT SỰ sẽ làm gì với một gói gửi tới đích đó
ip route get 8.8.8.8
ip route get 10.0.0.99

# 3. Xem TTL đi xuống, mỗi chặng một dòng
traceroute -n 1.1.1.1

# 4. Đọc TTL ở chiều về và đếm số chặng
ping -c 1 1.1.1.1

# 5. Tìm MTU thật của đường đi, có bật cờ DF
ping -M do -s 1472 -c 2 1.1.1.1

# 6. Nhìn thẳng vào các trường của phần đầu gói
sudo tcpdump -n -v -c 3 icmp</code></pre>
<h4>Đọc kết quả</h4>
<ul>
<li><code>ip route get</code> in ra <strong>via &lt;địa chỉ&gt;</strong> nghĩa là Ở XA — gói đi qua một router. Không có chữ <code>via</code> nghĩa là CỤC BỘ — gửi thẳng trên đường link này.</li>
<li><code>ttl=57</code> trong gói ping trả về từ một máy chủ Linux nghĩa là <strong>64 − 57 = 7 chặng</strong>. Gói về với <code>ttl=119</code> là từ Windows, cách 9 chặng.</li>
<li>Mỗi dòng của <code>traceroute</code> là một ICMP Time Exceeded, tức là một router thú nhận nó đã vứt gói của bạn. Ba dấu sao <code>* * *</code> nghĩa là chặng đó được cấu hình không trả lời — <strong>không</strong> có nghĩa là đường đi hỏng.</li>
<li><code>ping -M do -s 1472</code> chạy được là bằng chứng đường đi chở được gói 1500 byte đầy đủ. Hỏng với chữ <em>message too long</em> từ chính máy bạn là card mạng của bạn từ chối; hỏng bằng cách <em>im lặng</em> mới là lỗ đen.</li>
<li>Trong <code>tcpdump -v</code> bạn sẽ thấy đúng chữ <code>ttl 64, id 12345, offset 0, flags [DF], proto ICMP (1), length 84</code> — đủ mọi trường của slide 8, đúng thứ tự.</li>
</ul>`,
    ),

    bi(
      `<h3>⚠️ Mistakes people actually make</h3>
<ol>
<li><strong>"ping works so the network is fine".</strong> ping is ICMP, 84 bytes, no ports, no MTU pressure. It proves layer 3 reachability and <em>nothing else</em>. A path with a blocked ICMP type 3 will ping perfectly and still break every large HTTP response. <em>Symptom:</em> "ping is fine but the site hangs."</li>
<li><strong>Blocking all ICMP "for security".</strong> ICMP is not one thing. Type 8/0 is ping, type 11 is what traceroute needs, and <strong>type 3 code 4 is what Path MTU Discovery needs to survive at all</strong>. Blocking the whole protocol to stop ping breaks the network's own signalling. <em>Symptom:</em> intermittent hangs on large transfers, which come and go depending on the path.</li>
<li><strong>Setting a default gateway outside your own subnet.</strong> The gateway must be an address you can ARP for, which means it must be on your subnet. <code>10.0.0.42/24</code> with a gateway of <code>10.0.1.1</code> looks reasonable and can never work. <em>Symptom:</em> local machines reachable, everything else dead, and no error anywhere.</li>
<li><strong>Getting the mask wrong on one machine only.</strong> A host with /16 where everyone else has /24 will try to deliver directly to addresses that need a router. <em>Symptom:</em> machine A reaches B, but B cannot reach A — a one-way failure, which is the fingerprint of a mask mismatch.</li>
<li><strong>Thinking the source IP changes at each hop.</strong> It does not. Only NAT changes it, and NAT is a specific box doing a specific job. If you see the source IP change where there is no NAT, you have found a misconfiguration, not normal behaviour.</li>
<li><strong>Reading a <code>* * *</code> line in traceroute as a fault.</strong> Many routers are deliberately configured not to send Time Exceeded. The path is fine as long as later hops answer.</li>
</ol>`,
      `<h3>⚠️ Bẫy hay mắc</h3>
<ol>
<li><strong>"ping được nên mạng ổn".</strong> ping là ICMP, 84 byte, không có cổng, không gây áp lực MTU. Nó chứng minh tầng 3 tới được, và <em>không chứng minh gì thêm</em>. Một đường đi bị chặn ICMP loại 3 sẽ ping ngon lành mà vẫn làm hỏng mọi phản hồi HTTP lớn. <em>Triệu chứng:</em> "ping ổn mà trang web treo".</li>
<li><strong>Chặn sạch ICMP "cho an toàn".</strong> ICMP không phải một thứ duy nhất. Loại 8/0 là ping, loại 11 là thứ traceroute cần, và <strong>loại 3 mã 4 là thứ Path MTU Discovery cần để sống</strong>. Chặn cả giao thức chỉ để cấm ping là phá luôn hệ thống báo hiệu của chính mạng. <em>Triệu chứng:</em> treo chập chờn khi truyền file lớn, lúc có lúc không tuỳ đường đi.</li>
<li><strong>Đặt cổng ra mặc định nằm ngoài subnet của mình.</strong> Cổng ra phải là địa chỉ mà bạn ARP được, tức là nó phải nằm trong subnet của bạn. <code>10.0.0.42/24</code> mà đặt gateway <code>10.0.1.1</code> nhìn thì hợp lý và vĩnh viễn không chạy. <em>Triệu chứng:</em> máy trong mạng thì tới được, còn lại chết hết, và không có thông báo lỗi ở đâu cả.</li>
<li><strong>Đặt sai mặt nạ trên đúng một máy.</strong> Một máy để /16 trong khi cả mạng để /24 sẽ cố gửi thẳng tới những địa chỉ lẽ ra phải qua router. <em>Triệu chứng:</em> máy A tới được B, nhưng B không tới được A — hỏng một chiều, và đó là dấu vân tay của lệch mặt nạ.</li>
<li><strong>Tưởng IP nguồn đổi ở mỗi chặng.</strong> Không đổi. Chỉ NAT mới đổi nó, và NAT là một cái hộp cụ thể làm một việc cụ thể. Thấy IP nguồn đổi ở chỗ không có NAT thì bạn vừa tìm ra một lỗi cấu hình, không phải chuyện bình thường.</li>
<li><strong>Đọc dòng <code>* * *</code> trong traceroute là lỗi.</strong> Nhiều router được cố ý cấu hình không gửi Time Exceeded. Đường đi vẫn tốt miễn là các chặng phía sau có trả lời.</li>
</ol>`,
    ),

    bi(
      `<h3>✍️ Exercises — with full worked answers</h3>
<p><strong>1.</strong> A host is <code>172.20.5.100/22</code>. Is <code>172.20.7.9</code> local or remote?</p>
<p><strong>2.</strong> A ping reply comes back with <code>ttl=250</code>. What sent it, and how far away is it?</p>
<p><strong>3.</strong> A 5000-byte IPv4 packet crosses a link with MTU 1500. How many fragments, and what is the offset field of the last one?</p>
<p><strong>4.</strong> <code>ping -M do -s 1400</code> succeeds and <code>-s 1412</code> fails, with no reply at all. What is the path MTU, and what is the likely cause?</p>
<p><strong>5.</strong> Why does an IPv6 router never fragment, and what replaces fragmentation?</p>
<hr>
<h4>Answers</h4>
<p><strong>1. REMOTE.</strong> /22 means the mask is 255.255.252.0, so the third octet is masked with 11111100 — it keeps the top 6 bits. 5 in binary is 00000101; AND with 11111100 gives 00000100 = 4, so my network is 172.20.4.0/22. Now the target: 7 is 00000111; AND with 11111100 gives 00000100 = 4 as well — so 172.20.7.9 is <em>also</em> in 172.20.4.0/22. It is <strong>LOCAL</strong>. This is the trap: a /22 spans 172.20.4.0 through 172.20.7.255, four third-octet values at once. If you answered "remote" you applied /24 by habit.</p>
<p><strong>2.</strong> Initial TTL 255 is <strong>Cisco IOS</strong>, so it is a router or switch, and 255 − 250 = <strong>5 hops</strong> away. If you assumed 64, you would have computed a negative distance, which is the signal that your assumption about the initial value was wrong.</p>
<p><strong>3. Four fragments.</strong> Payload is 5000 − 20 = 4980 bytes. Each fragment carries at most 1500 − 20 = 1480 bytes, and that must be a multiple of 8 — 1480 is, so no rounding is needed. 1480 × 3 = 4440, leaving 4980 − 4440 = 540 bytes for the fourth. Offsets are 0, 185, 370 and <strong>555</strong> (4440 / 8). The first three carry MF = 1; the last carries MF = 0.</p>
<p><strong>4. Path MTU is 1428</strong> (1400 + 28). The silence on failure is the diagnosis: a refusal from your own kernel prints <em>message too long</em>, so silence means a router on the path dropped the packet and its ICMP "fragmentation needed" never got back to you. Likely cause: a tunnel (VPN, PPPoE, GRE) plus a firewall dropping ICMP type 3. Fix by clamping MSS to 1428 − 40 = 1388, or by allowing ICMP type 3.</p>
<p><strong>5.</strong> Fragmentation at the router forces every router to do extra work on a packet it should merely forward, and it multiplies loss, because losing one fragment destroys the whole packet. IPv6 replaced it with <strong>mandatory Path MTU Discovery</strong>: the router drops the packet and returns ICMPv6 Packet Too Big, and the source resends at the right size. The consequence is that blocking ICMPv6 breaks IPv6 far more severely than blocking ICMP breaks IPv4 — there is no fallback left.</p>`,
      `<h3>✍️ Bài tập — có lời giải đầy đủ</h3>
<p><strong>1.</strong> Một máy là <code>172.20.5.100/22</code>. Địa chỉ <code>172.20.7.9</code> là cục bộ hay ở xa?</p>
<p><strong>2.</strong> Một gói ping trả về với <code>ttl=250</code>. Cái gì gửi nó, và nó cách bao xa?</p>
<p><strong>3.</strong> Một gói IPv4 5000 byte đi qua đường link MTU 1500. Bao nhiêu mảnh, và trường offset của mảnh cuối là bao nhiêu?</p>
<p><strong>4.</strong> <code>ping -M do -s 1400</code> chạy được còn <code>-s 1412</code> hỏng, không có phản hồi nào cả. MTU của đường đi là bao nhiêu, và nguyên nhân nhiều khả năng là gì?</p>
<p><strong>5.</strong> Vì sao router IPv6 không bao giờ phân mảnh, và cái gì thay thế việc phân mảnh?</p>
<hr>
<h4>Lời giải</h4>
<p><strong>1. CỤC BỘ.</strong> /22 nghĩa là mặt nạ 255.255.252.0, nên octet thứ ba bị AND với 11111100 — giữ lại 6 bit cao. Số 5 nhị phân là 00000101; AND với 11111100 ra 00000100 = 4, nên mạng của tôi là 172.20.4.0/22. Giờ tới đích: 7 là 00000111; AND với 11111100 cũng ra 00000100 = 4 — nên 172.20.7.9 <em>cũng</em> nằm trong 172.20.4.0/22. Nó <strong>CỤC BỘ</strong>. Đây chính là cái bẫy: một /22 trải từ 172.20.4.0 tới 172.20.7.255, gồm bốn giá trị octet thứ ba cùng lúc. Nếu bạn trả lời "ở xa" thì bạn đã áp /24 theo thói quen.</p>
<p><strong>2.</strong> TTL khởi đầu 255 là <strong>Cisco IOS</strong>, nên đó là một router hoặc switch, và 255 − 250 = <strong>5 chặng</strong>. Nếu bạn giả định 64 thì sẽ ra khoảng cách âm, và đó chính là tín hiệu cho biết giả định về giá trị khởi đầu đã sai.</p>
<p><strong>3. Bốn mảnh.</strong> Phần tải là 5000 − 20 = 4980 byte. Mỗi mảnh chở nhiều nhất 1500 − 20 = 1480 byte, và con số đó phải chia hết cho 8 — 1480 thì chia hết, nên không phải làm tròn. 1480 × 3 = 4440, còn lại 4980 − 4440 = 540 byte cho mảnh thứ tư. Offset lần lượt là 0, 185, 370 và <strong>555</strong> (4440 / 8). Ba mảnh đầu mang MF = 1; mảnh cuối mang MF = 0.</p>
<p><strong>4. MTU đường đi là 1428</strong> (1400 + 28). Chính sự im lặng lúc hỏng mới là chẩn đoán: nếu nhân của chính máy bạn từ chối thì nó in ra <em>message too long</em>, nên im lặng nghĩa là một router dọc đường đã vứt gói và cái ICMP "cần phân mảnh" của nó không về được tới bạn. Nguyên nhân nhiều khả năng: một đường hầm (VPN, PPPoE, GRE) cộng với một tường lửa vứt ICMP loại 3. Sửa bằng cách ghim MSS về 1428 − 40 = 1388, hoặc cho ICMP loại 3 đi qua.</p>
<p><strong>5.</strong> Phân mảnh ở router buộc mọi router phải làm thêm việc với một gói mà lẽ ra nó chỉ cần chuyển tiếp, và nó nhân tỉ lệ mất gói lên, vì mất một mảnh là hỏng cả gói. IPv6 thay bằng <strong>Path MTU Discovery bắt buộc</strong>: router vứt gói và trả về ICMPv6 Packet Too Big, bên gửi gửi lại với kích thước đúng. Hệ quả là chặn ICMPv6 phá IPv6 nặng hơn hẳn chặn ICMP phá IPv4 — vì không còn đường lùi nào nữa.</p>`,
    ),

    bi(
      `<h3>📋 A note on the school's question table for this session</h3>
<p>FLM assigns session 21 the constructive question <strong>CQ7.3 — "How does Ethernet works in a switched network?"</strong>. That question belongs to Chapter 6, not to the network layer, and it was already answered in full in <strong>Lesson 6.3</strong>. It is part of a wider drift in the question table: CQ7.1 and CQ7.2 sit on sessions 19–20, which are Lab 1.4 of Chapter 6, and CQ8.1 lands on session 23, the review session. The numbering runs roughly one chapter behind the session plan from here on.</p>
<p>We quote the school's table exactly as published and do not renumber it. Where a question's content belongs to a chapter you have already studied, we say where it was answered instead of repeating it.</p>`,
      `<h3>📋 Ghi chú về bảng câu hỏi của trường cho buổi này</h3>
<p>FLM gán cho buổi 21 câu hỏi kiến tạo <strong>CQ7.3 — "How does Ethernet works in a switched network?"</strong>. Câu đó thuộc chương 6 chứ không thuộc tầng mạng, và nó đã được trả lời đầy đủ ở <strong>bài 6.3</strong>. Nó là một phần của sự trôi dạt rộng hơn trong bảng câu hỏi: CQ7.1 và CQ7.2 nằm ở buổi 19–20, vốn là Lab 1.4 của chương 6, còn CQ8.1 rơi vào buổi 23, buổi ôn tập. Từ đây trở đi cách đánh số chạy chậm hơn kế hoạch buổi học khoảng một chương.</p>
<p>Chúng tôi trích bảng của trường đúng nguyên văn và không đánh số lại. Chỗ nào nội dung câu hỏi thuộc một chương bạn đã học rồi thì chúng tôi chỉ ra nó đã được trả lời ở đâu, thay vì nhắc lại.</p>`,
    ),

    cq(21, [
      ['CQ7.3', 'How does Ethernet works in a switched network? <em>— content belongs to Chapter 6; answered in full in Lesson 6.3 (learn from source MAC, decide on destination MAC, then forward / flood / filter).</em>',
        'How does Ethernet works in a switched network? <em>— nội dung thuộc chương 6; đã trả lời đầy đủ ở bài 6.3 (học theo MAC nguồn, quyết định theo MAC đích, rồi chuyển tiếp / tràn / lọc bỏ).</em>'],
    ]),
  ].join('\n'),
};

/* ──────────────────────── Lesson 7.2 — session 22 ──────────────────────── */

const L2 = {
  title: '7.2 — The IPv6 packet, how a host routes, and routing tables (FLM session 22)|||7.2 — Gói tin IPv6, máy trạm định tuyến ra sao, và bảng định tuyến (buổi 22 của FLM)',
  slug: 'nwc204-7-2-goi-ipv6-va-bang-dinh-tuyen',
  type: 'DOCUMENT',
  description: 'Buổi 22: phần đầu IPv6 40 byte và những gì IPv6 đã xoá bỏ, phần đầu mở rộng, ba quyết định của máy trạm (cục bộ / ở xa / loopback), bảng định tuyến trên Linux, Windows và Cisco IOS, khoảng cách quản trị, khớp tiền tố dài nhất, tĩnh so với động, và phần ★ về ip route get, ip rule nhiều bảng, và các tuyến Docker tự cắm vào máy chủ.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 7 · Lesson 7.2 · FLM session 22 of 60 · CLO4, CLO9 · Cisco Module 8</span>
<h2>Reading the table that decides where everything goes</h2>
<p class="lead">Lesson 7.1 built the packet. This lesson answers the only question that remains: <em>out of which interface, and to whom?</em> Every machine on Earth — your laptop, your VPS, a container, a core router — answers it with the same three-step rule.</p>
<p><strong>Opening question:</strong> a container on your server suddenly cannot reach your office network at 172.18.4.0/24, although the server itself reaches it perfectly. Nothing was changed on the server. The only thing that happened is that somebody started a new <code>docker compose</code> project. Why did that break it, and which single command shows you the cause in one line?</p>
<p class="note">★ marks material added by cuongthai.com beyond Cisco Module 8. The school's content is covered first.</p>`,
      `<span class="eyebrow">NWC204 · Chương 7 · Bài 7.2 · Buổi 22/60 của FLM · CLO4, CLO9 · Cisco Module 8</span>
<h2>Đọc cái bảng quyết định mọi thứ đi đâu</h2>
<p class="lead">Bài 7.1 dựng nên gói tin. Bài này trả lời câu duy nhất còn lại: <em>ra bằng cổng nào, và giao cho ai?</em> Mọi cỗ máy trên Trái Đất — laptop của bạn, VPS của bạn, một container, một router lõi — đều trả lời câu đó bằng cùng một luật ba bước.</p>
<p><strong>Câu hỏi mở đầu:</strong> một container trên máy chủ của bạn đột nhiên không tới được mạng văn phòng ở 172.18.4.0/24, dù chính máy chủ thì tới hoàn hảo. Không ai đổi gì trên máy chủ cả. Việc duy nhất vừa xảy ra là có người khởi động một dự án <code>docker compose</code> mới. Vì sao chuyện đó làm hỏng, và lệnh duy nhất nào chỉ ra nguyên nhân trong một dòng?</p>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 8. Nội dung của trường được phủ trước.</p>`,
    ),

    walkHead('nwc204-ch07', 15, 28,
      'Slides 15–28 cover FLM session 22: 7.3 IPv6 Packet, 7.4 How a Host Routes, 7.5 Router Routing Tables, 7.6 AI tools.',
      'Slide 15–28 là buổi 22 của FLM: 7.3 IPv6 Packet, 7.4 How a Host Routes, 7.5 Router Routing Tables, 7.6 công cụ AI.'),

    walk('nwc204-ch07', [
      [15, 'The IPv6 header — fewer fields, bigger addresses',
        `<p>IPv6 has a <strong>bigger</strong> header than IPv4 — 40 bytes instead of 20 — and a <strong>simpler</strong> one. Both statements are true at once, and the reason is arithmetic: 32 of those 40 bytes are just the two 128-bit addresses. Everything else shrank from 12 fields to 6.</p>
<ul>
<li><strong>Version</strong> (4 bits) — always 6.</li>
<li><strong>Traffic Class</strong> (8 bits) — the DSCP and ECN of IPv4, merged into one field.</li>
<li><strong>Flow Label</strong> (20 bits) — new: marks packets belonging to one stream so routers can keep them on one path without reading the transport header.</li>
<li><strong>Payload Length</strong> (16 bits) — note it excludes the 40-byte header, unlike IPv4's Total Length which includes it.</li>
<li><strong>Next Header</strong> (8 bits) — does the job of IPv4's Protocol, and also chains extension headers.</li>
<li><strong>Hop Limit</strong> (8 bits) — TTL, honestly renamed.</li>
</ul>
<p>The header is <em>always</em> exactly 40 bytes, so there is no IHL field and a router never has to parse to find the payload. It can jump there by arithmetic, which is why IPv6 forwarding is cheaper per packet despite the larger addresses.</p>`,
        `<p>IPv6 có phần đầu <strong>TO HƠN</strong> IPv4 — 40 byte thay vì 20 — và <strong>ĐƠN GIẢN HƠN</strong>. Hai câu đó cùng đúng một lúc, và lý do là số học: 32 trong 40 byte đó chỉ là hai địa chỉ 128 bit. Mọi thứ còn lại co từ 12 trường xuống 6.</p>
<ul>
<li><strong>Version</strong> (4 bit) — luôn là 6.</li>
<li><strong>Traffic Class</strong> (8 bit) — DSCP và ECN của IPv4 gộp lại thành một trường.</li>
<li><strong>Flow Label</strong> (20 bit) — mới: đánh dấu các gói cùng một luồng để router giữ chúng trên một đường mà không cần đọc phần đầu tầng giao vận.</li>
<li><strong>Payload Length</strong> (16 bit) — lưu ý nó KHÔNG tính 40 byte phần đầu, khác với Total Length của IPv4 vốn tính cả.</li>
<li><strong>Next Header</strong> (8 bit) — làm việc của trường Protocol bên IPv4, và còn nối chuỗi các phần đầu mở rộng.</li>
<li><strong>Hop Limit</strong> (8 bit) — chính là TTL, đổi tên cho thành thật.</li>
</ul>
<p>Phần đầu <em>luôn luôn</em> đúng 40 byte, nên không cần trường IHL và router không bao giờ phải phân tích để tìm phần tải. Nó nhảy tới đó bằng phép cộng, và đó là lý do chuyển tiếp IPv6 rẻ hơn tính trên mỗi gói, bất chấp địa chỉ dài hơn.</p>`],

      [16, 'What IPv6 deleted, and why',
        `<p>Four deletions, each with a reason you can state in one sentence.</p>
<ul>
<li><strong>Header Checksum — gone.</strong> Ethernet already checks the whole frame with the FCS, and TCP and UDP check again with their own checksums. Three checks for one packet was waste, and IPv4's checksum had to be <em>recomputed at every hop</em> because TTL changed. Removing it removes work from every router on Earth.</li>
<li><strong>Identification, Flags, Fragment Offset — gone from the main header.</strong> Routers never fragment IPv6. A packet too large is dropped, and ICMPv6 Packet Too Big goes back to the source.</li>
<li><strong>IHL and Options — gone.</strong> Fixed 40 bytes. Options moved into extension headers, which most routers can skip entirely.</li>
<li><strong>TTL renamed to Hop Limit.</strong> The original name promised seconds and delivered hops; the new one tells the truth.</li>
</ul>
<p><strong>The consequence you will actually meet:</strong> because there is no fragmentation fallback, blocking ICMPv6 does not degrade IPv6 — it breaks it. Any firewall policy that says "drop all ICMP" and is applied to IPv6 will produce hangs that look exactly like the MTU black hole of Lesson 7.1, but with no workaround.</p>`,
        `<p>Bốn thứ bị xoá, mỗi thứ có một lý do nói gọn trong một câu.</p>
<ul>
<li><strong>Header Checksum — bỏ.</strong> Ethernet đã kiểm cả khung bằng FCS, còn TCP và UDP lại kiểm lần nữa bằng checksum riêng. Ba lần kiểm cho một gói là lãng phí, mà checksum của IPv4 lại còn phải <em>tính lại ở mọi chặng</em> vì TTL đổi. Bỏ nó đi là bỏ bớt việc cho mọi router trên Trái Đất.</li>
<li><strong>Identification, Flags, Fragment Offset — bỏ khỏi phần đầu chính.</strong> Router không bao giờ phân mảnh IPv6. Gói quá to thì bị vứt, và ICMPv6 Packet Too Big quay về cho bên gửi.</li>
<li><strong>IHL và Options — bỏ.</strong> Cố định 40 byte. Options dời vào các phần đầu mở rộng, thứ mà đa số router bỏ qua được hoàn toàn.</li>
<li><strong>TTL đổi tên thành Hop Limit.</strong> Cái tên cũ hứa hẹn số giây mà giao ra số chặng; cái tên mới nói thật.</li>
</ul>
<p><strong>Hệ quả bạn sẽ gặp thật:</strong> vì không còn đường lùi phân mảnh, chặn ICMPv6 không làm IPv6 kém đi — nó làm IPv6 HỎNG. Bất cứ chính sách tường lửa nào ghi "vứt hết ICMP" mà đem áp cho IPv6 sẽ đẻ ra những cú treo giống hệt lỗ đen MTU ở bài 7.1, nhưng không có cách chữa tạm nào.</p>`],

      [17, 'Extension headers — options that routers can skip',
        `<p>IPv6 moved everything optional out of the main header into a <strong>chain</strong>. Each header names the next one in its Next Header field, and the last link in the chain names the transport protocol: 6 for TCP, 17 for UDP, 58 for ICMPv6.</p>
<p><strong>Why the chain is faster than IPv4 options.</strong> An IPv4 router with options present must parse variable-length data before it can even find the payload, so options became something routers dreaded and firewalls dropped. In IPv6 a router reads the fixed 40 bytes, gets the destination, and forwards. It only walks the chain if it must — and for most extension headers, it must not.</p>
<p>The one exception is the <strong>Hop-by-Hop Options</strong> header, which by definition every router must examine. That is why it is required to come first in the chain, and why it is used very sparingly.</p>
<p>★ In practice, firewalls and some middleboxes drop packets with long extension-header chains, so anything you design should keep them short. This is one of the places where the standard and the deployed Internet disagree.</p>`,
        `<p>IPv6 dời mọi thứ tuỳ chọn ra khỏi phần đầu chính, vào một <strong>chuỗi</strong>. Mỗi phần đầu gọi tên phần kế tiếp trong trường Next Header của nó, và mắt xích cuối cùng gọi tên giao thức tầng giao vận: 6 cho TCP, 17 cho UDP, 58 cho ICMPv6.</p>
<p><strong>Vì sao chuỗi này nhanh hơn Options của IPv4.</strong> Một router IPv4 khi gặp options phải phân tích dữ liệu dài ngắn bất định trước khi tìm nổi phần tải, nên options thành thứ router sợ và tường lửa vứt. Ở IPv6 router đọc 40 byte cố định, lấy được địa chỉ đích, rồi chuyển tiếp. Nó chỉ đi dọc chuỗi khi buộc phải — và với hầu hết phần đầu mở rộng thì nó không được phép.</p>
<p>Ngoại lệ duy nhất là phần đầu <strong>Hop-by-Hop Options</strong>, thứ mà theo định nghĩa mọi router đều phải xem. Đó là lý do nó bắt buộc đứng đầu chuỗi, và là lý do người ta dùng nó rất dè sẻn.</p>
<p>★ Trên thực tế, tường lửa và một số thiết bị trung gian vứt luôn gói có chuỗi phần đầu mở rộng dài, nên thứ gì bạn thiết kế cũng nên giữ chuỗi ngắn. Đây là một trong những chỗ mà tiêu chuẩn và Internet đang chạy không đồng ý với nhau.</p>`],

      [18, 'How a host routes — three destinations, one test',
        `<p>Every packet a host creates is sorted into exactly one of three buckets, and the sorting uses the AND calculation from Lesson 7.1.</p>
<ol>
<li><strong>Itself</strong> — 127.0.0.1, or any address configured on its own interfaces. The packet never reaches a cable; the kernel loops it straight back.</li>
<li><strong>Local</strong> — destination AND my mask equals my own network. The host ARPs for <em>the destination itself</em> and sends the frame directly to it. No router involved.</li>
<li><strong>Remote</strong> — the AND does not match. The host ARPs for <em>the default gateway</em>, and builds a frame addressed to the router — while the IP header still names the real destination.</li>
</ol>
<p>That third case is where students lose marks, so say it out loud: <strong>the destination MAC and the destination IP point at different machines</strong>. The MAC says "give this to the router"; the IP says "this is for 8.8.8.8". The router then strips the frame, builds a new one for the next link, and does the same thing again.</p>`,
        `<p>Mỗi gói tin một máy trạm tạo ra đều bị xếp vào đúng một trong ba giỏ, và việc xếp giỏ dùng đúng phép AND của bài 7.1.</p>
<ol>
<li><strong>Chính nó</strong> — 127.0.0.1, hoặc bất cứ địa chỉ nào cấu hình trên cổng của chính nó. Gói tin không bao giờ ra tới dây; nhân vòng nó về ngay.</li>
<li><strong>Cục bộ</strong> — đích AND mặt nạ của tôi bằng đúng mạng của tôi. Máy ARP hỏi <em>chính máy đích</em> rồi gửi khung thẳng cho nó. Không dính router nào.</li>
<li><strong>Ở xa</strong> — phép AND không khớp. Máy ARP hỏi <em>cổng ra mặc định</em>, rồi dựng một cái khung đề địa chỉ router — trong khi phần đầu IP vẫn ghi tên máy đích thật.</li>
</ol>
<p>Trường hợp thứ ba là chỗ sinh viên hay mất điểm, nên hãy nói thành lời: <strong>MAC đích và IP đích trỏ vào hai máy khác nhau</strong>. MAC nói "đưa cái này cho router"; IP nói "cái này là của 8.8.8.8". Router sau đó bóc khung ra, dựng khung mới cho chặng kế tiếp, rồi làm lại đúng việc đó.</p>`],

      [19, 'The host routing table on Linux',
        `<p>Three lines is what a healthy server looks like. Read each column and the whole model is visible.</p>
<ul>
<li><strong>default via 10.0.0.1</strong> — the catch-all. Anything not matched by a more specific line goes here. This is the line missing in the opening question of Lesson 7.1.</li>
<li><strong>10.0.0.0/24 … scope link</strong> — "this network is directly attached; no router needed". The kernel added it automatically when the address was configured, which is what <code>proto kernel</code> means.</li>
<li><strong>src 10.0.0.42</strong> — which of my addresses gets written into the source field of packets using this route. On a machine with several addresses, this is what decides which one the far end sees.</li>
<li><strong>metric</strong> — a tie-breaker when two routes are equally specific. Lower wins.</li>
<li><strong>172.17.0.0/16 dev docker0</strong> — Docker added this. Nobody typed it.</li>
</ul>
<p>Notice what is <em>not</em> here: nothing says what the destination's mask is. A routing table only ever describes <strong>directions from here</strong>.</p>`,
        `<p>Ba dòng là dáng vẻ của một máy chủ khoẻ mạnh. Đọc từng cột là thấy được cả mô hình.</p>
<ul>
<li><strong>default via 10.0.0.1</strong> — dòng vơ vét. Thứ gì không khớp một dòng cụ thể hơn thì đi lối này. Đây chính là dòng bị thiếu trong câu hỏi mở đầu của bài 7.1.</li>
<li><strong>10.0.0.0/24 … scope link</strong> — "mạng này gắn trực tiếp; không cần router". Nhân tự thêm dòng này khi địa chỉ được cấu hình, và đó là ý nghĩa của chữ <code>proto kernel</code>.</li>
<li><strong>src 10.0.0.42</strong> — địa chỉ nào của tôi sẽ được ghi vào trường nguồn của các gói đi theo tuyến này. Trên máy có nhiều địa chỉ, chính nó quyết định đầu kia nhìn thấy địa chỉ nào.</li>
<li><strong>metric</strong> — trọng tài khi hai tuyến cụ thể ngang nhau. Nhỏ hơn thì thắng.</li>
<li><strong>172.17.0.0/16 dev docker0</strong> — Docker thêm vào. Không ai gõ cả.</li>
</ul>
<p>Để ý thứ <em>không</em> có ở đây: không dòng nào nói mặt nạ của máy đích là gì. Một bảng định tuyến chỉ bao giờ mô tả <strong>hướng đi tính từ chỗ này</strong>.</p>`],

      [20, 'The same table on Windows and on Cisco IOS',
        `<p>Three operating systems print the same information in three layouts. Learn the <em>idea</em> and every one of them becomes readable.</p>
<ul>
<li><strong>Windows</strong> spells the mask out in dotted decimal instead of using a slash, and writes <code>On-link</code> where Linux writes <code>scope link</code>. <code>0.0.0.0 / 0.0.0.0</code> is the default route.</li>
<li><strong>Cisco IOS on a switch</strong> is the odd one out, and the reason is worth noticing: a layer-2 switch is an <em>end device</em> at layer 3. It has one management address and one default gateway, exactly like a PC. It has no routing table because it does not route.</li>
</ul>
<p>On a <em>router</em>, the same <code>show ip route</code> prints the full table you will see on slide 23. The same command giving two very different outputs is a useful reminder that the device's role, not the command, decides what layer 3 work it does.</p>`,
        `<p>Ba hệ điều hành in cùng một thông tin theo ba kiểu bố cục. Học lấy cái <em>ý</em> thì cái nào cũng đọc được.</p>
<ul>
<li><strong>Windows</strong> viết mặt nạ đầy đủ dạng bốn số thay vì dùng dấu gạch chéo, và ghi <code>On-link</code> ở chỗ Linux ghi <code>scope link</code>. <code>0.0.0.0 / 0.0.0.0</code> chính là tuyến mặc định.</li>
<li><strong>Cisco IOS trên một con switch</strong> là đứa khác biệt, và lý do đáng để ý: một switch tầng 2 là <em>thiết bị đầu cuối</em> xét ở tầng 3. Nó có một địa chỉ quản trị và một cổng ra mặc định, y hệt một cái PC. Nó không có bảng định tuyến vì nó không định tuyến.</li>
</ul>
<p>Trên một con <em>router</em>, cũng lệnh <code>show ip route</code> ấy in ra bảng đầy đủ mà bạn sẽ thấy ở slide 23. Cùng một lệnh cho hai kết quả khác hẳn nhau là một lời nhắc hữu ích: vai trò của thiết bị, chứ không phải cái lệnh, mới quyết định nó làm việc gì ở tầng 3.</p>`],

      [21, '★ Stop guessing — ask the kernel which route it would use',
        `<p><code>ip route get</code> is the single most useful networking command on Linux and almost nobody teaches it. It does not show you the table; it <strong>runs the decision</strong> and tells you the answer.</p>
<ul>
<li>Output containing <code>via 10.0.0.1</code> means the destination is <strong>remote</strong> and this is the gateway that will be used.</li>
<li>Output with no <code>via</code> means <strong>local</strong> — direct delivery on that link.</li>
<li><code>dev eth0</code> is the interface the packet will leave by, and <code>src 10.0.0.42</code> is the source address that will be written into the header.</li>
</ul>
<p><strong>Why it beats reading the table.</strong> Reading <code>ip route</code> and working out the answer means doing longest-prefix match in your head, over every line, correctly — and it silently ignores policy rules (slide 26), which can send the packet to a completely different table before <code>main</code> is ever consulted. <code>ip route get</code> applies all of it. When your reasoning and this command disagree, <strong>the command is right</strong>.</p>`,
        `<p><code>ip route get</code> là lệnh mạng hữu ích nhất trên Linux và gần như không ai dạy nó. Nó không cho bạn xem cái bảng; nó <strong>chạy luôn cái quyết định</strong> rồi báo kết quả.</p>
<ul>
<li>Kết quả có chữ <code>via 10.0.0.1</code> nghĩa là đích <strong>ở xa</strong> và đây là cổng ra sẽ được dùng.</li>
<li>Kết quả không có chữ <code>via</code> nghĩa là <strong>cục bộ</strong> — gửi thẳng trên đường link đó.</li>
<li><code>dev eth0</code> là cổng gói tin sẽ đi ra, còn <code>src 10.0.0.42</code> là địa chỉ nguồn sẽ được ghi vào phần đầu.</li>
</ul>
<p><strong>Vì sao nó hơn việc đọc bảng.</strong> Đọc <code>ip route</code> rồi tự suy ra đáp án nghĩa là bạn phải làm phép khớp tiền tố dài nhất trong đầu, trên từng dòng, và phải đúng — mà nó lại âm thầm bỏ qua các luật chính sách (slide 26), thứ có thể đẩy gói tin sang một bảng hoàn toàn khác trước khi bảng <code>main</code> kịp được đọc. <code>ip route get</code> áp dụng tất cả. Khi suy luận của bạn và cái lệnh này bất đồng, <strong>cái lệnh mới đúng</strong>.</p>`],

      [22, 'The default gateway is just a neighbour with a job',
        `<p>There is nothing special about a default gateway. It is an ordinary IP address on your own subnet that you have nominated as the place to send anything you do not recognise.</p>
<p><strong>Two rules follow from that, and both are exam favourites.</strong></p>
<ul>
<li><strong>The gateway must be on your subnet.</strong> To send it a frame you must ARP for it, and you can only ARP on your own link. A gateway of 10.0.1.1 on a host that is 10.0.0.42/24 can never be reached — the host would classify the gateway itself as remote, and try to send it to the gateway, which is a loop with no exit.</li>
<li><strong>Missing gateway breaks nothing local.</strong> Every machine on your own subnet is still reachable, because those packets never consult the default route. The fault is therefore invisible until you try to leave.</li>
</ul>
<p>And once more, the detail that makes the rest of the course click: the frame leaving your PC carries <strong>the router's MAC and the server's IP</strong>. Two destinations, two layers, one packet.</p>`,
        `<p>Không có gì đặc biệt ở một cổng ra mặc định. Nó là một địa chỉ IP bình thường nằm trong subnet của bạn, mà bạn chỉ định làm nơi gửi mọi thứ bạn không nhận ra.</p>
<p><strong>Hai luật suy ra từ đó, và cả hai đều là món khoái khẩu của đề thi.</strong></p>
<ul>
<li><strong>Cổng ra phải nằm trong subnet của bạn.</strong> Muốn gửi khung cho nó thì phải ARP hỏi nó, mà bạn chỉ ARP được trên đường link của mình. Một gateway 10.0.1.1 trên máy 10.0.0.42/24 thì vĩnh viễn không tới được — máy sẽ xếp chính cái gateway đó là ở xa, rồi tìm cách gửi nó qua gateway, thành một vòng lặp không lối ra.</li>
<li><strong>Thiếu gateway không làm hỏng gì trong mạng nội bộ.</strong> Mọi máy trong subnet của bạn vẫn tới được, vì mấy gói đó không bao giờ tra tới tuyến mặc định. Vì vậy cái lỗi này vô hình cho tới lúc bạn định đi ra ngoài.</li>
</ul>
<p>Và một lần nữa, cái chi tiết làm phần còn lại của môn học sáng ra: cái khung rời khỏi PC của bạn mang <strong>MAC của router và IP của máy chủ</strong>. Hai cái đích, hai tầng, một gói tin.</p>`],

      [23, 'A router table, read line by line',
        `<p>Now the full table, on a real router. Six lines, and every code means something specific.</p>
<ul>
<li><strong>C — connected.</strong> The network on that interface. The router can see it directly.</li>
<li><strong>L — local.</strong> The router's <em>own</em> address on that interface, and it is always a /32. Cisco splits C and L so the router can answer packets addressed to itself without confusing them with transit traffic.</li>
<li><strong>S — static.</strong> Typed by a human.</li>
<li><strong>O — OSPF.</strong> Learned from a neighbour, with an age (<code>00:14:22</code>) showing how long it has been stable.</li>
<li><strong>S* 0.0.0.0/0</strong> — the default route, marked with an asterisk as the <em>gateway of last resort</em>. It matches every destination and has the worst possible prefix length, so it only wins when nothing else matches.</li>
</ul>
<p>The two numbers in brackets, <code>[110/2]</code>, are <strong>administrative distance / metric</strong>. The first says how much the router trusts the source of the route; the second says how good that particular path is. Slide 24 separates them properly.</p>`,
        `<p>Giờ tới cái bảng đầy đủ, trên một con router thật. Sáu dòng, và mỗi ký hiệu đều có nghĩa cụ thể.</p>
<ul>
<li><strong>C — connected.</strong> Mạng nằm trên cổng đó. Router nhìn thấy trực tiếp.</li>
<li><strong>L — local.</strong> Địa chỉ của <em>chính</em> router trên cổng đó, và nó luôn là /32. Cisco tách C với L để router trả lời được những gói gửi đích danh nó mà không lẫn với lưu lượng đi ngang.</li>
<li><strong>S — static.</strong> Do người gõ vào.</li>
<li><strong>O — OSPF.</strong> Học từ hàng xóm, kèm tuổi (<code>00:14:22</code>) cho biết nó đã ổn định bao lâu.</li>
<li><strong>S* 0.0.0.0/0</strong> — tuyến mặc định, đánh dấu sao vì nó là <em>cổng ra cuối cùng còn lại</em>. Nó khớp mọi đích và có độ dài tiền tố tệ nhất có thể, nên nó chỉ thắng khi không còn gì khớp.</li>
</ul>
<p>Hai con số trong ngoặc vuông, <code>[110/2]</code>, là <strong>khoảng cách quản trị / trọng số</strong>. Số đầu nói router tin cái nguồn của tuyến đó tới mức nào; số sau nói đường cụ thể đó tốt tới đâu. Slide 24 tách bạch hai thứ này.</p>`],

      [24, 'Where routes come from, and who is believed',
        `<p><strong>Administrative distance answers "who do I believe?"</strong> It is consulted when two <em>different sources</em> offer a route to the same prefix. Connected (0) beats static (1) beats EIGRP (90) beats OSPF (110) beats RIP (120). Lower is more trusted.</p>
<p><strong>Metric answers "which way is better?"</strong> It is used <em>inside</em> one protocol, when that protocol knows two paths to the same place. Lower is better here too.</p>
<p>The two are frequently confused, so hold on to this: administrative distance never compares two OSPF routes, and metric never compares an OSPF route with a static route.</p>
<p><strong>The trap in static routing.</strong> A static route has AD 1, which means it is trusted almost absolutely — and it never notices a failure. If the link it points at goes down, the route stays in the table and packets keep marching into a hole. A dynamic protocol would have withdrawn the route in seconds. That is the real trade, and it is why static routes belong on stub links, not in the middle of a network.</p>`,
        `<p><strong>Khoảng cách quản trị trả lời câu "tôi tin ai?"</strong> Nó được tra khi hai <em>nguồn khác nhau</em> cùng đưa ra một tuyến tới cùng một tiền tố. Connected (0) thắng static (1) thắng EIGRP (90) thắng OSPF (110) thắng RIP (120). Nhỏ hơn thì được tin hơn.</p>
<p><strong>Trọng số trả lời câu "đường nào tốt hơn?"</strong> Nó được dùng <em>bên trong</em> một giao thức, khi giao thức đó biết hai đường tới cùng một chỗ. Ở đây nhỏ hơn cũng là tốt hơn.</p>
<p>Hai thứ này hay bị lẫn, nên nhớ lấy: khoảng cách quản trị không bao giờ đem so hai tuyến OSPF với nhau, và trọng số không bao giờ đem so một tuyến OSPF với một tuyến tĩnh.</p>
<p><strong>Cái bẫy của định tuyến tĩnh.</strong> Tuyến tĩnh có AD 1, tức là gần như được tin tuyệt đối — và nó không bao giờ nhận ra sự cố. Nếu đường link nó trỏ tới chết, cái tuyến vẫn nằm nguyên trong bảng và gói tin cứ đều bước đi vào hố. Một giao thức động sẽ rút tuyến đó đi sau vài giây. Đó mới là sự đánh đổi thật, và là lý do tuyến tĩnh thuộc về các nhánh cụt, không thuộc về giữa lòng một mạng.</p>`],

      [25, 'Longest prefix match — the only rule that decides',
        `<p>When a packet for 172.16.5.10 arrives, the router does not read the table top to bottom and take the first hit. It finds <em>every</em> line that matches and then keeps the one with the <strong>most 1-bits in its mask</strong>.</p>
<ul>
<li>0.0.0.0/0 matches — prefix length 0.</li>
<li>172.16.0.0/16 matches — prefix length 16.</li>
<li>172.16.5.0/24 matches — prefix length 24. <strong>This one wins.</strong></li>
<li>172.16.6.0/24 does not match at all, so its prefix length is irrelevant.</li>
</ul>
<p>Administrative distance is only consulted when two routes have the <em>same</em> prefix length and come from different sources. Prefix length is checked first, always.</p>
<p><strong>Why this rule and not another.</strong> A longer prefix describes a smaller, more specific piece of the address space, so whoever installed it knew more about that particular destination. "More specific knowledge wins" is the whole principle, and it is what lets a default route coexist safely with thousands of exceptions.</p>
<p>The practical corollary: a <strong>/32 host route</strong> is the longest prefix possible and therefore overrides absolutely everything. That is extremely useful for pinning one address down a special path, and extremely dangerous if you forget you left one in place.</p>`,
        `<p>Khi một gói tới cho 172.16.5.10, router không đọc bảng từ trên xuống rồi lấy dòng khớp đầu tiên. Nó tìm <em>mọi</em> dòng khớp rồi giữ lại dòng có <strong>nhiều bit 1 nhất trong mặt nạ</strong>.</p>
<ul>
<li>0.0.0.0/0 khớp — độ dài tiền tố 0.</li>
<li>172.16.0.0/16 khớp — độ dài tiền tố 16.</li>
<li>172.16.5.0/24 khớp — độ dài tiền tố 24. <strong>Dòng này thắng.</strong></li>
<li>172.16.6.0/24 hoàn toàn không khớp, nên độ dài tiền tố của nó không liên quan.</li>
</ul>
<p>Khoảng cách quản trị chỉ được tra khi hai tuyến có <em>cùng</em> độ dài tiền tố và đến từ hai nguồn khác nhau. Độ dài tiền tố luôn được xét trước.</p>
<p><strong>Vì sao lại là luật này mà không phải luật khác.</strong> Tiền tố dài hơn mô tả một mẩu không gian địa chỉ nhỏ hơn, cụ thể hơn, nên ai cài nó vào là người biết rõ hơn về đúng cái đích đó. "Hiểu biết cụ thể hơn thì thắng" là toàn bộ nguyên lý, và đó là thứ cho phép một tuyến mặc định sống chung an toàn với hàng nghìn ngoại lệ.</p>
<p>Hệ quả thực tế: một <strong>tuyến /32 cho một máy</strong> là tiền tố dài nhất có thể nên nó đè lên tuyệt đối mọi thứ. Việc đó cực kỳ hữu ích khi cần ghim một địa chỉ đi theo đường đặc biệt, và cực kỳ nguy hiểm nếu bạn quên mất mình đã để lại một cái.</p>`],

      [26, '★ Linux has many routing tables, not one',
        `<p>What <code>ip route</code> shows you is one table, called <code>main</code>. Linux consults a list of <strong>rules</strong> first, and each rule points at a table.</p>
<ul>
<li>Priority 0 — <code>local</code>: the machine's own addresses and broadcasts. Checked before anything else, which is why you cannot route around your own IP.</li>
<li>Priority 32766 — <code>main</code>: the table everyone knows.</li>
<li>Priority 32767 — <code>default</code>: usually empty.</li>
</ul>
<p>A VPN, a second ISP or a container runtime can add a rule with a lower number, and that rule is consulted <em>first</em>. The commands on the slide create a table 200 and a rule saying "packets whose source is 203.0.113.50 use table 200" — the standard way to run two uplinks without the replies going out of the wrong one.</p>
<p><strong>The symptom this explains:</strong> <code>ip route</code> looks perfectly correct, and traffic still goes somewhere else. Before you doubt your own eyes, run <code>ip rule</code>. And remember that <code>ip route get</code> follows the rules for you, which is exactly why it is the command to trust.</p>`,
        `<p>Thứ <code>ip route</code> cho bạn xem chỉ là một bảng, tên là <code>main</code>. Linux tra một danh sách <strong>luật</strong> trước đã, và mỗi luật trỏ vào một bảng.</p>
<ul>
<li>Ưu tiên 0 — <code>local</code>: các địa chỉ của chính máy và địa chỉ quảng bá. Được xét trước mọi thứ, và đó là lý do bạn không thể định tuyến vòng qua IP của chính mình.</li>
<li>Ưu tiên 32766 — <code>main</code>: cái bảng ai cũng biết.</li>
<li>Ưu tiên 32767 — <code>default</code>: thường rỗng.</li>
</ul>
<p>Một VPN, một đường mạng thứ hai, hay một bộ chạy container đều có thể thêm một luật mang số nhỏ hơn, và luật đó được tra <em>trước</em>. Mấy lệnh trên slide tạo ra bảng 200 và một luật nói "gói nào có nguồn là 203.0.113.50 thì dùng bảng 200" — cách chuẩn để chạy hai đường lên mà gói trả lời không đi nhầm đường.</p>
<p><strong>Triệu chứng mà điều này giải thích:</strong> <code>ip route</code> nhìn đúng hoàn hảo, mà lưu lượng vẫn đi đường khác. Trước khi nghi ngờ mắt mình, hãy chạy <code>ip rule</code>. Và nhớ rằng <code>ip route get</code> đi theo các luật đó hộ bạn, và đó đúng là lý do nên tin nó.</p>`],

      [27, '★ Docker writes routes into your server too',
        `<p>This is the answer to the opening question of this lesson, and it is pure layer 3 — no Docker magic involved.</p>
<p>Every <code>docker compose</code> project creates its own bridge network and takes a <strong>/16</strong> out of the private range 172.16.0.0 – 172.31.255.255, in order. The first is 172.17.0.0/16 on <code>docker0</code>, then 172.18.0.0/16, 172.19.0.0/16 and so on. Each one is written into your server's routing table as a connected route.</p>
<p><strong>The collision.</strong> If your office network happens to be 172.18.4.0/24 and Docker takes 172.18.0.0/16, then <em>inside a container</em> the longest prefix match now points 172.18.4.x at the local bridge instead of out through the gateway. The host itself is unaffected, because on the host the office route may be more specific. That asymmetry — works on the server, broken in the container — is the fingerprint.</p>
<p><strong>The fix</strong> is to pin the pool before it collides, in <code>/etc/docker/daemon.json</code> with <code>default-address-pools</code>, choosing a range your organisation does not use.</p>`,
        `<p>Đây là lời đáp cho câu hỏi mở đầu của bài này, và nó thuần tuý là tầng 3 — không có phép màu Docker nào cả.</p>
<p>Mỗi dự án <code>docker compose</code> tạo ra một mạng cầu riêng và lấy một dải <strong>/16</strong> trong khoảng riêng 172.16.0.0 – 172.31.255.255, theo thứ tự. Cái đầu tiên là 172.17.0.0/16 trên <code>docker0</code>, rồi 172.18.0.0/16, 172.19.0.0/16 và cứ thế. Mỗi cái được ghi vào bảng định tuyến của máy chủ bạn như một tuyến kết nối trực tiếp.</p>
<p><strong>Cú va chạm.</strong> Nếu mạng văn phòng của bạn tình cờ là 172.18.4.0/24 mà Docker lại lấy 172.18.0.0/16, thì <em>bên trong container</em> phép khớp tiền tố dài nhất giờ trỏ 172.18.4.x về cái cầu nội bộ thay vì ra qua cổng ra. Bản thân máy chủ không bị ảnh hưởng, vì trên máy chủ tuyến tới văn phòng có thể cụ thể hơn. Chính sự lệch đó — chạy được trên máy chủ, hỏng trong container — là dấu vân tay.</p>
<p><strong>Cách sửa</strong> là ghim sẵn dải trước khi nó đụng, trong <code>/etc/docker/daemon.json</code> bằng <code>default-address-pools</code>, chọn một khoảng mà tổ chức của bạn không dùng.</p>`],

      [28, 'Static or dynamic — and when each is right',
        `<p>Both kinds of route end up in the same table and are chosen by the same rule. The <em>source</em> of a route changes nothing about how it is used — only how it got there and what happens when the network changes.</p>
<ul>
<li><strong>Static:</strong> zero CPU, zero bandwidth, completely predictable, and completely blind to failure.</li>
<li><strong>Dynamic:</strong> reacts to a dead link in seconds, at the cost of CPU, bandwidth, configuration and a security surface (routing protocols must be authenticated, or someone can inject routes).</li>
</ul>
<p><strong>The honest rule of thumb.</strong> If there is only one way out, a static default route is not a compromise — it is the correct answer, and a dynamic protocol would be pure overhead. Your VPS has exactly one uplink, so its single <code>default via</code> line is a static route and should stay one. Dynamic routing earns its cost the moment there is a second path worth failing over to.</p>`,
        `<p>Cả hai loại tuyến đều đổ vào cùng một cái bảng và được chọn bằng cùng một luật. <em>Nguồn gốc</em> của một tuyến không đổi cách nó được dùng — nó chỉ đổi cách nó vào được đó và chuyện gì xảy ra khi mạng thay đổi.</p>
<ul>
<li><strong>Tĩnh:</strong> không tốn CPU, không tốn băng thông, đoán trước được hoàn toàn, và mù tịt hoàn toàn trước sự cố.</li>
<li><strong>Động:</strong> phản ứng với một đường link chết trong vài giây, đổi lại là CPU, băng thông, công cấu hình và một bề mặt bảo mật (giao thức định tuyến phải có xác thực, không thì người ta tiêm tuyến vào được).</li>
</ul>
<p><strong>Nguyên tắc thành thật.</strong> Nếu chỉ có một đường ra, thì tuyến mặc định tĩnh không phải một sự nhân nhượng — nó là câu trả lời đúng, và một giao thức động sẽ chỉ là gánh nặng thừa. VPS của bạn có đúng một đường lên, nên cái dòng <code>default via</code> duy nhất của nó là tuyến tĩnh và nên giữ nguyên như vậy. Định tuyến động bắt đầu đáng đồng tiền ngay khi có con đường thứ hai đáng để chuyển sang lúc sự cố.</p>`],
    ]),

    bi(
      `<h3>🗺️ What a router does with every packet, drawn</h3>
<pre><code class="language-mermaid">graph TD
  A["Packet arrives<br/>dst 172.16.5.10"] --> B["Strip the L2 frame"]
  B --> C{"TTL - 1 &gt; 0 ?"}
  C -->|"no"| X["DROP<br/>send ICMP Time Exceeded"]
  C -->|"yes"| D["Find EVERY matching route<br/>keep the LONGEST prefix"]
  D --> E{"A match?"}
  E -->|"no, and no default"| Y["DROP<br/>send ICMP Net Unreachable"]
  E -->|"yes"| F["Build a NEW L2 frame<br/>for the next link · send"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef bad fill:#fdeeee,stroke:#d94b4b,stroke-width:2px,color:#8f2c2c
  class C,E ask
  class A,B,D act
  class F act
  class X,Y bad</code></pre>
<p>Notice that a router <strong>drops and reports</strong> rather than dropping silently. Every one of those ICMP messages is a diagnostic gift — and every one of them disappears the moment somebody blocks ICMP wholesale.</p>`,
      `<h3>🗺️ Router làm gì với mỗi gói tin, vẽ ra</h3>
<pre><code class="language-mermaid">graph TD
  A["Gói tới<br/>đích 172.16.5.10"] --> B["Bóc khung L2"]
  B --> C{"TTL - 1 &gt; 0 ?"}
  C -->|"không"| X["VỨT<br/>gửi ICMP Time Exceeded"]
  C -->|"có"| D["Tìm MỌI tuyến khớp<br/>giữ tiền tố DÀI NHẤT"]
  D --> E{"Có tuyến nào khớp?"}
  E -->|"không, cũng không có mặc định"| Y["VỨT<br/>gửi ICMP Net Unreachable"]
  E -->|"có"| F["Dựng khung L2 MỚI<br/>cho chặng kế tiếp · gửi"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef bad fill:#fdeeee,stroke:#d94b4b,stroke-width:2px,color:#8f2c2c
  class C,E ask
  class A,B,D act
  class F act
  class X,Y bad</code></pre>
<p>Để ý là router <strong>vứt rồi báo lại</strong> chứ không vứt lặng lẽ. Mỗi cái thông điệp ICMP đó là một món quà cho việc chẩn đoán — và mỗi cái trong số đó biến mất ngay khi có người chặn sạch ICMP.</p>`,
    ),

    bi(
      `<h3>🤖 7.6 Integrate AI tools for explaining concepts (CLO9)</h3>
<p>The syllabus makes this a self-learning item in session 22, and it is worth doing properly rather than treating it as filler. AI is genuinely good at <em>one</em> networking task and genuinely dangerous at another.</p>
<h4>Where it helps</h4>
<ul>
<li><strong>Explaining output you already have.</strong> Paste a real <code>show ip route</code> or <code>ip route</code> and ask "which line will a packet for X match, and why". You can verify the answer yourself with <code>ip route get</code>, so a wrong answer costs you nothing.</li>
<li><strong>Turning a symptom into a list of candidates.</strong> "SSH connects then freezes on long output, ping works" is exactly the kind of description an AI will map to MTU, and that saves an hour of guessing.</li>
<li><strong>Checking your arithmetic.</strong> Fragment offsets, prefix lengths, AND operations — ask it to redo your calculation independently and compare.</li>
</ul>
<h4>Where it is dangerous</h4>
<ul>
<li><strong>Inventing plausible command output.</strong> An AI will happily produce a <code>show ip route</code> that looks perfect and describes a router that does not exist. Never accept generated output as evidence about <em>your</em> network.</li>
<li><strong>Confident wrong syntax.</strong> IOS commands differ across platforms and versions. Run it in Packet Tracer before you type it on hardware.</li>
<li><strong>Answering questions about state.</strong> "Is my gateway reachable?" is not a question an AI can answer — only your machine can. Ask the machine.</li>
</ul>
<p><strong>The rule worth keeping for the rest of the course:</strong> use AI to form a hypothesis, use a command to test it. Never the other way round.</p>`,
      `<h3>🤖 7.6 Dùng công cụ AI để giải thích khái niệm (CLO9)</h3>
<p>Syllabus xếp mục này là phần tự học ở buổi 22, và nó đáng làm đàng hoàng chứ đừng coi là mục cho có. AI thật sự giỏi ở <em>một</em> việc trong ngành mạng và thật sự nguy hiểm ở một việc khác.</p>
<h4>Chỗ nó giúp được</h4>
<ul>
<li><strong>Giải thích kết xuất bạn đã có sẵn.</strong> Dán một bản <code>show ip route</code> hay <code>ip route</code> thật vào rồi hỏi "gói tới X sẽ khớp dòng nào, vì sao". Bạn tự kiểm lại được bằng <code>ip route get</code>, nên một câu trả lời sai chẳng tốn gì của bạn.</li>
<li><strong>Biến một triệu chứng thành danh sách nghi phạm.</strong> "SSH vào được rồi đơ khi kết xuất dài, ping thì chạy" đúng là kiểu mô tả mà AI sẽ quy về MTU, và điều đó tiết kiệm một giờ mò mẫm.</li>
<li><strong>Kiểm lại phép tính.</strong> Offset mảnh, độ dài tiền tố, phép AND — bảo nó làm lại phép tính của bạn một cách độc lập rồi đối chiếu.</li>
</ul>
<h4>Chỗ nó nguy hiểm</h4>
<ul>
<li><strong>Bịa ra kết xuất lệnh nghe rất hợp lý.</strong> AI sẽ vui vẻ đẻ ra một bản <code>show ip route</code> trông hoàn hảo và mô tả một con router không tồn tại. Đừng bao giờ nhận kết xuất do AI sinh ra làm bằng chứng về mạng <em>của bạn</em>.</li>
<li><strong>Cú pháp sai mà nói chắc nịch.</strong> Lệnh IOS khác nhau giữa các dòng máy và các phiên bản. Chạy thử trong Packet Tracer trước khi gõ lên thiết bị thật.</li>
<li><strong>Trả lời câu hỏi về trạng thái.</strong> "Cổng ra của tôi có tới được không?" không phải câu AI trả lời được — chỉ máy của bạn trả lời được. Hãy hỏi cái máy.</li>
</ul>
<p><strong>Nguyên tắc đáng giữ cho cả phần còn lại của môn:</strong> dùng AI để dựng giả thuyết, dùng lệnh để kiểm chứng. Đừng bao giờ làm ngược lại.</p>`,
    ),

    bi(
      `<h3>🔍 How to check this yourself</h3>
<pre><code class="language-bash"># 1. The three tables Linux consults, in priority order
ip rule show

# 2. The one everybody means when they say "the routing table"
ip route show
ip -6 route show

# 3. The decision itself, with rules and longest-prefix already applied
ip route get 8.8.8.8
ip route get 2606:4700:4700::1111

# 4. Which routes did Docker add without being asked
ip route | grep -E 'docker|br-'
cat /proc/sys/net/ipv4/ip_forward

# 5. Prove longest prefix match: add a more specific route and watch it win
sudo ip route add 8.8.8.8/32 dev lo
ip route get 8.8.8.8          # now says "dev lo" — the /32 beat the default
sudo ip route del 8.8.8.8/32  # CLEAN UP, or you have just black-holed 8.8.8.8</code></pre>
<h4>Reading the results</h4>
<ul>
<li><code>ip rule</code> showing anything other than the three defaults means some software installed policy routing. That is your first suspect whenever the table looks right but traffic goes wrong.</li>
<li><code>ip -6 route</code> with no <code>default</code> line means the machine has IPv6 addresses but no IPv6 path off-link — which produces slow connections, because programs try IPv6 first and wait for it to fail.</li>
<li><code>ip_forward = 1</code> means your machine is acting as a router. On a plain server that is Docker's doing; if you did not install Docker, find out who turned it on.</li>
<li>Step 5 is the whole chapter in three commands: add a /32, watch it override a /0, remove it. <strong>Do run the delete.</strong></li>
</ul>`,
      `<h3>🔍 Cách tự kiểm</h3>
<pre><code class="language-bash"># 1. Ba cái bảng Linux tra, theo thứ tự ưu tiên
ip rule show

# 2. Cái bảng mà ai cũng ngụ ý khi nói "bảng định tuyến"
ip route show
ip -6 route show

# 3. Chính cái quyết định, đã áp luật và khớp tiền tố dài nhất sẵn
ip route get 8.8.8.8
ip route get 2606:4700:4700::1111

# 4. Docker đã tự thêm những tuyến nào mà không ai bảo
ip route | grep -E 'docker|br-'
cat /proc/sys/net/ipv4/ip_forward

# 5. Chứng minh khớp tiền tố dài nhất: thêm một tuyến cụ thể hơn rồi xem nó thắng
sudo ip route add 8.8.8.8/32 dev lo
ip route get 8.8.8.8          # giờ ghi "dev lo" — cái /32 vừa thắng tuyến mặc định
sudo ip route del 8.8.8.8/32  # DỌN ĐI, không thì bạn vừa chôn sống 8.8.8.8</code></pre>
<h4>Đọc kết quả</h4>
<ul>
<li><code>ip rule</code> hiện ra thứ gì khác ba dòng mặc định nghĩa là có phần mềm nào đó đã cài định tuyến theo chính sách. Đó là nghi phạm số một mỗi khi cái bảng nhìn đúng mà lưu lượng đi sai.</li>
<li><code>ip -6 route</code> không có dòng <code>default</code> nghĩa là máy có địa chỉ IPv6 nhưng không có đường IPv6 nào ra khỏi link — và điều đó làm kết nối chậm, vì chương trình thử IPv6 trước rồi ngồi chờ nó hỏng.</li>
<li><code>ip_forward = 1</code> nghĩa là máy bạn đang đóng vai router. Trên một máy chủ trơn thì đó là do Docker; nếu bạn không cài Docker thì hãy đi tìm xem ai bật nó.</li>
<li>Bước 5 là cả chương gói trong ba lệnh: thêm một /32, xem nó đè lên /0, rồi xoá đi. <strong>Nhớ chạy lệnh xoá.</strong></li>
</ul>`,
    ),

    bi(
      `<h3>⚠️ Mistakes people actually make</h3>
<ol>
<li><strong>Reading the routing table top to bottom and taking the first match.</strong> That is not how it works, and on a table where the default route happens to be printed first it gives the wrong answer every time. Find all matches, keep the longest prefix. <em>Symptom:</em> your prediction and the machine's behaviour disagree, repeatedly.</li>
<li><strong>Trusting <code>ip route</code> when policy routing is in play.</strong> <code>ip rule</code> can divert traffic to another table entirely. <em>Symptom:</em> the table is provably correct and traffic still leaves by the wrong interface.</li>
<li><strong>Confusing administrative distance with metric.</strong> AD compares <em>sources</em>; metric compares <em>paths inside one source</em>. <em>Symptom:</em> exam marks lost, and in real life, an inability to explain why a static route beat a working OSPF route and black-holed traffic.</li>
<li><strong>Leaving a /32 host route behind after debugging.</strong> It is the longest possible prefix, so it wins over everything, forever, silently. <em>Symptom:</em> one single destination is unreachable and nothing in the config explains it.</li>
<li><strong>Assuming a switch has a routing table.</strong> A layer-2 switch is an end device at layer 3: one management IP, one default gateway, no table. <em>Symptom:</em> hunting for a routing problem on a device that does no routing.</li>
<li><strong>Letting Docker choose its address pool on a machine that reaches a 172.16–172.31 network.</strong> <em>Symptom:</em> the host reaches the office, the container does not, and nobody changed anything on the host.</li>
<li><strong>Assuming IPv6 is off because you never configured it.</strong> Most systems autoconfigure it. If <code>ip -6 route</code> shows addresses but no default route, connections get slow — the program tries IPv6, waits, then falls back to IPv4.</li>
</ol>`,
      `<h3>⚠️ Bẫy hay mắc</h3>
<ol>
<li><strong>Đọc bảng định tuyến từ trên xuống rồi lấy dòng khớp đầu tiên.</strong> Nó không chạy như thế, và trên một cái bảng mà tuyến mặc định tình cờ được in trước thì cách đó sai mọi lần. Tìm hết các dòng khớp, giữ tiền tố dài nhất. <em>Triệu chứng:</em> dự đoán của bạn và hành vi của máy cứ đá nhau, lặp đi lặp lại.</li>
<li><strong>Tin <code>ip route</code> trong khi có định tuyến theo chính sách.</strong> <code>ip rule</code> có thể lái lưu lượng sang một bảng hoàn toàn khác. <em>Triệu chứng:</em> cái bảng chứng minh được là đúng mà lưu lượng vẫn ra sai cổng.</li>
<li><strong>Lẫn khoảng cách quản trị với trọng số.</strong> AD so <em>nguồn</em>; trọng số so <em>các đường bên trong một nguồn</em>. <em>Triệu chứng:</em> mất điểm thi, và ngoài đời thì không giải thích nổi vì sao một tuyến tĩnh lại thắng một tuyến OSPF đang chạy tốt rồi chôn sống lưu lượng.</li>
<li><strong>Để sót một tuyến /32 sau khi gỡ lỗi.</strong> Nó là tiền tố dài nhất có thể, nên nó thắng mọi thứ, mãi mãi, và lặng lẽ. <em>Triệu chứng:</em> đúng một cái đích không tới được mà không có gì trong cấu hình giải thích nổi.</li>
<li><strong>Tưởng switch có bảng định tuyến.</strong> Switch tầng 2 là thiết bị đầu cuối xét ở tầng 3: một IP quản trị, một cổng ra mặc định, không có bảng. <em>Triệu chứng:</em> đi săn lỗi định tuyến trên một thiết bị không hề định tuyến.</li>
<li><strong>Để Docker tự chọn dải địa chỉ trên một máy có kết nối tới mạng 172.16–172.31.</strong> <em>Triệu chứng:</em> máy chủ tới được văn phòng, container thì không, mà không ai đổi gì trên máy chủ cả.</li>
<li><strong>Tưởng IPv6 đang tắt vì bạn chưa cấu hình nó bao giờ.</strong> Đa số hệ thống tự cấu hình nó. Nếu <code>ip -6 route</code> có địa chỉ mà không có tuyến mặc định, kết nối sẽ chậm — chương trình thử IPv6, ngồi chờ, rồi mới lùi về IPv4.</li>
</ol>`,
    ),

    bi(
      `<h3>✍️ Exercises — with full worked answers</h3>
<p>Use this table for questions 1 to 3.</p>
<pre><code class="language-plaintext">S*   0.0.0.0/0        [1/0]   via 203.0.113.1
O    10.0.0.0/8       [110/3] via 192.168.1.2
S    10.20.0.0/16     [1/0]   via 192.168.1.9
C    192.168.1.0/24   directly connected, Gi0/1
L    192.168.1.1/32   directly connected, Gi0/1</code></pre>
<p><strong>1.</strong> Where does a packet for 10.20.5.7 go?</p>
<p><strong>2.</strong> Where does a packet for 10.99.0.4 go?</p>
<p><strong>3.</strong> OSPF now also advertises 10.20.0.0/16 with metric 2. Which route is used, and why?</p>
<p><strong>4.</strong> Why does a host with a default gateway outside its own subnet fail completely, while a host with no gateway at all still reaches its neighbours?</p>
<p><strong>5.</strong> A container cannot reach 172.18.4.10; the host can. Name the one command that identifies the cause and say what you expect to see.</p>
<hr>
<h4>Answers</h4>
<p><strong>1. Via 192.168.1.9.</strong> Both 10.0.0.0/8 and 10.20.0.0/16 match. Longest prefix wins, 16 beats 8, so the static route is used. The administrative distances (1 and 110) are never compared here, because prefix length already decided it.</p>
<p><strong>2. Via 192.168.1.2.</strong> 10.99.0.4 matches 10.0.0.0/8 but not 10.20.0.0/16. Of the two remaining matches, /8 beats /0, so the OSPF route wins over the default.</p>
<p><strong>3. The static route, via 192.168.1.9.</strong> Now the prefix lengths are equal (both /16), so and only so does administrative distance come into play: static is 1, OSPF is 110, and lower is more trusted. Note the metric of 2 is irrelevant — metrics are never compared across protocols. This is also the classic way to black-hole traffic: if 192.168.1.9 goes down, the static route stays in the table and the perfectly good OSPF route is still suppressed.</p>
<p><strong>4.</strong> Local traffic never consults the default route at all — the AND test classifies it as local and the host ARPs for the target directly. So a missing gateway is invisible on the LAN. A gateway <em>outside</em> the subnet is worse than missing: the host classifies the gateway itself as remote, so it would need a gateway to reach its gateway. It cannot ARP for it, no frame can be built, and everything off-link fails with no error message.</p>
<p><strong>5. <code>ip route get 172.18.4.10</code>, run inside the container.</strong> Expect it to print <code>dev eth0</code> pointing at the container bridge rather than <code>via</code> the gateway — meaning a Docker /16 has swallowed the office prefix, and longest prefix match is correctly sending it to the bridge. Confirm on the host with <code>ip route | grep 172.18</code>. Fix with <code>default-address-pools</code> in <code>/etc/docker/daemon.json</code>.</p>`,
      `<h3>✍️ Bài tập — có lời giải đầy đủ</h3>
<p>Dùng bảng này cho câu 1 tới 3.</p>
<pre><code class="language-plaintext">S*   0.0.0.0/0        [1/0]   via 203.0.113.1
O    10.0.0.0/8       [110/3] via 192.168.1.2
S    10.20.0.0/16     [1/0]   via 192.168.1.9
C    192.168.1.0/24   directly connected, Gi0/1
L    192.168.1.1/32   directly connected, Gi0/1</code></pre>
<p><strong>1.</strong> Gói gửi tới 10.20.5.7 đi đâu?</p>
<p><strong>2.</strong> Gói gửi tới 10.99.0.4 đi đâu?</p>
<p><strong>3.</strong> Giờ OSPF cũng quảng bá 10.20.0.0/16 với trọng số 2. Tuyến nào được dùng, và vì sao?</p>
<p><strong>4.</strong> Vì sao một máy có cổng ra mặc định nằm ngoài subnet của nó thì hỏng hoàn toàn, trong khi một máy không có cổng ra nào cả vẫn tới được hàng xóm?</p>
<p><strong>5.</strong> Một container không tới được 172.18.4.10; máy chủ thì tới được. Gọi tên đúng một lệnh chỉ ra nguyên nhân và nói bạn mong thấy gì.</p>
<hr>
<h4>Lời giải</h4>
<p><strong>1. Qua 192.168.1.9.</strong> Cả 10.0.0.0/8 lẫn 10.20.0.0/16 đều khớp. Tiền tố dài nhất thắng, 16 hơn 8, nên tuyến tĩnh được dùng. Hai khoảng cách quản trị (1 và 110) không hề được đem so ở đây, vì độ dài tiền tố đã quyết xong.</p>
<p><strong>2. Qua 192.168.1.2.</strong> 10.99.0.4 khớp 10.0.0.0/8 nhưng không khớp 10.20.0.0/16. Trong hai dòng còn khớp, /8 thắng /0, nên tuyến OSPF thắng tuyến mặc định.</p>
<p><strong>3. Tuyến tĩnh, qua 192.168.1.9.</strong> Giờ hai độ dài tiền tố bằng nhau (đều /16), và chỉ khi đó khoảng cách quản trị mới vào cuộc: tĩnh là 1, OSPF là 110, nhỏ hơn thì được tin hơn. Lưu ý trọng số 2 không liên quan — trọng số không bao giờ được so giữa hai giao thức khác nhau. Đây cũng là cách kinh điển để chôn sống lưu lượng: nếu 192.168.1.9 chết, tuyến tĩnh vẫn nằm trong bảng và tuyến OSPF hoàn toàn tốt vẫn bị dìm.</p>
<p><strong>4.</strong> Lưu lượng nội bộ không bao giờ tra tới tuyến mặc định — phép AND xếp nó là cục bộ và máy ARP hỏi thẳng máy đích. Nên thiếu cổng ra là chuyện vô hình trong LAN. Còn cổng ra nằm <em>ngoài</em> subnet thì còn tệ hơn là thiếu: máy xếp chính cái cổng ra đó là ở xa, tức là nó cần một cổng ra để tới được cổng ra của nó. Nó không ARP được, không dựng nổi khung nào, và mọi thứ ngoài link đều hỏng mà không có một thông báo lỗi nào.</p>
<p><strong>5. <code>ip route get 172.18.4.10</code>, chạy BÊN TRONG container.</strong> Mong thấy nó in <code>dev eth0</code> trỏ vào cầu của container chứ không phải <code>via</code> cổng ra — nghĩa là một dải /16 của Docker đã nuốt mất tiền tố của văn phòng, và phép khớp tiền tố dài nhất đang đẩy nó về cầu một cách hoàn toàn đúng luật. Xác nhận trên máy chủ bằng <code>ip route | grep 172.18</code>. Sửa bằng <code>default-address-pools</code> trong <code>/etc/docker/daemon.json</code>.</p>`,
    ),

    bi(
      `<h3>📋 Session 22 has no constructive question</h3>
<p>FLM's question table jumps straight from <strong>CQ7.3</strong> on session 21 to <strong>CQ8.1</strong> on session 23. Session 22 is left blank, as are sessions 6, 9, 15, 16, 30, 36 and 56. This is a gap in the published table, not an omission on our side, and we do not invent a question number to fill it.</p>
<p>Two discussion questions of our own for this session, marked ★:</p>
<ul>
<li>★ Your server has two routes to the same network: a static one via a link you control, and an OSPF one via a partner's router. The static link goes down. Predict exactly what happens to traffic, and say what you would have configured differently.</li>
<li>★ Explain to someone who has never used Linux why <code>ip route get 8.8.8.8</code> is a better answer to "where does this packet go?" than reading <code>ip route</code>. Use the word "rule" in your answer.</li>
</ul>`,
      `<h3>📋 Buổi 22 không có câu hỏi kiến tạo nào</h3>
<p>Bảng câu hỏi của FLM nhảy thẳng từ <strong>CQ7.3</strong> ở buổi 21 sang <strong>CQ8.1</strong> ở buổi 23. Buổi 22 bị bỏ trống, cũng như các buổi 6, 9, 15, 16, 30, 36 và 56. Đây là khoảng trống trong bảng đã công bố, không phải chúng tôi bỏ sót, và chúng tôi không bịa ra một số hiệu câu hỏi để lấp vào.</p>
<p>Hai câu thảo luận của riêng chúng tôi cho buổi này, đánh dấu ★:</p>
<ul>
<li>★ Máy chủ của bạn có hai tuyến tới cùng một mạng: một tuyến tĩnh qua đường link bạn kiểm soát, và một tuyến OSPF qua router của đối tác. Đường link tĩnh chết. Hãy dự đoán chính xác chuyện gì xảy ra với lưu lượng, và nói bạn lẽ ra nên cấu hình khác đi thế nào.</li>
<li>★ Giải thích cho một người chưa từng dùng Linux vì sao <code>ip route get 8.8.8.8</code> là câu trả lời tốt hơn cho câu hỏi "gói này đi đâu?" so với việc đọc <code>ip route</code>. Trong câu trả lời phải dùng chữ "luật".</li>
</ul>`,
    ),
  ].join('\n'),
};

/* ──────────────────────── Lesson 7.3 — session 23 ──────────────────────── */

const L3 = {
  title: '7.3 — Review of Modules 1 to 7, and the trap in CQ8.1 (FLM session 23)|||7.3 — Ôn tập Module 1 tới 7, và cái bẫy trong CQ8.1 (buổi 23 của FLM)',
  slug: 'nwc204-7-3-on-tap-module-1-den-7',
  type: 'DOCUMENT',
  description: 'Buổi 23: ôn tập có hệ thống Module 1–7, mỗi module ba điều phải nhớ và một phép tự kiểm; lần theo trọn vẹn một gói tin qua cả bảy module; chỗ Module 5 bị bỏ khỏi kế hoạch 60 buổi và vì sao phải học bù trước buổi 30; và câu hỏi kiến tạo CQ8.1 của trường vốn có tiền đề sai về tính tin cậy của IP.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 7 · Lesson 7.3 · FLM session 23 of 60 · CLO1–CLO4 · Review</span>
<h2>Halfway. Time to make sure the foundation holds</h2>
<p class="lead">Session 23 is a review of Modules 1 to 7, placed deliberately: everything after it — ARP, router configuration, subnetting, ICMP, transport — assumes you can trace a packet through the stack without hesitating. This lesson is a checklist, not new material.</p>
<p><strong>Use it like this:</strong> read each module's three claims and try to justify each one out loud <em>before</em> reading the justification. Anything you cannot say in your own words is a gap, and the "prove it" command next to it tells you where to go and look.</p>`,
      `<span class="eyebrow">NWC204 · Chương 7 · Bài 7.3 · Buổi 23/60 của FLM · CLO1–CLO4 · Ôn tập</span>
<h2>Nửa chặng đường. Đến lúc chắc chắn cái nền còn vững</h2>
<p class="lead">Buổi 23 là buổi ôn Module 1 tới 7, và nó được đặt ở đây có chủ ý: mọi thứ sau nó — ARP, cấu hình router, chia subnet, ICMP, tầng giao vận — đều giả định bạn lần được một gói tin qua cả chồng tầng mà không vấp. Bài này là một bản kiểm kê, không phải bài mới.</p>
<p><strong>Hãy dùng nó như thế này:</strong> đọc ba khẳng định của mỗi module rồi thử tự nói thành lời lý do <em>trước khi</em> đọc phần giải thích. Chỗ nào bạn không diễn đạt được bằng lời của mình là một lỗ hổng, và lệnh "chứng minh đi" bên cạnh sẽ chỉ chỗ cho bạn đi kiểm.</p>`,
    ),

    walkHead('nwc204-ch07', 29, 31,
      'Slides 29–31 cover FLM session 23: the review of Modules 1 to 7.',
      'Slide 29–31 là buổi 23 của FLM: ôn tập Module 1 tới 7.'),

    walk('nwc204-ch07', [
      [29, 'Session 23 — Review of Modules 1 to 7',
        `<p>Five blocks of material, and the last three are the ones the second half of the course is built on.</p>
<ul>
<li><strong>Modules 1–3</strong> — what a network is made of, topologies, the Cisco IOS command line, and why layered models exist at all.</li>
<li><strong>Module 4</strong> — the physical layer: copper, fibre, wireless, encoding, and the difference between bandwidth and throughput.</li>
<li><strong>Module 6</strong> — the data link layer: framing, MAC versus LLC, and error <em>detection</em> with the FCS.</li>
<li><strong>Module 7</strong> — Ethernet: the frame byte by byte, MAC addresses, the switch table, forwarding methods.</li>
<li><strong>Module 8</strong> — this chapter: IP characteristics, both headers, host and router routing.</li>
</ul>
<p><strong>The number missing from that list is 5.</strong> Cisco's Module 5 is Number Systems — binary and hexadecimal — and FPT's 60-session plan does not schedule it anywhere. Sessions 30 to 34 are IPv4 addressing, subnetting, VLSM and the midterm, and none of that is possible without binary. That is why this site adds a make-up chapter on number systems before IPv4 Addressing. If you skipped it, go back now; session 30 is two sessions away.</p>`,
        `<p>Năm khối kiến thức, và ba khối cuối là nền cho cả nửa sau của môn.</p>
<ul>
<li><strong>Module 1–3</strong> — mạng gồm những gì, các kiểu tô-pô, dòng lệnh Cisco IOS, và vì sao lại cần mô hình phân tầng.</li>
<li><strong>Module 4</strong> — tầng vật lý: đồng, quang, không dây, mã hoá đường truyền, và khác biệt giữa băng thông với thông lượng.</li>
<li><strong>Module 6</strong> — tầng liên kết dữ liệu: dựng khung, MAC so với LLC, và <em>phát hiện</em> lỗi bằng FCS.</li>
<li><strong>Module 7</strong> — Ethernet: khung theo từng byte, địa chỉ MAC, bảng của switch, các cách chuyển tiếp.</li>
<li><strong>Module 8</strong> — chính chương này: đặc tính của IP, cả hai phần đầu gói, máy trạm và router định tuyến ra sao.</li>
</ul>
<p><strong>Con số vắng mặt trong danh sách đó là 5.</strong> Module 5 của Cisco là Number Systems — nhị phân và thập lục phân — và kế hoạch 60 buổi của trường không xếp nó vào đâu cả. Buổi 30 tới 34 là địa chỉ IPv4, chia subnet, VLSM và thi giữa kỳ, mà không có cái nào làm được nếu không có nhị phân. Đó là lý do trang này thêm một chương bù về hệ đếm, đặt trước chương IPv4 Addressing. Nếu bạn đã bỏ qua nó thì quay lại ngay bây giờ; buổi 30 chỉ còn cách hai buổi.</p>`],

      [30, 'One packet, all seven modules at once',
        `<p>The fastest way to test whether the foundation holds is to narrate a single HTTP request and name the module responsible for each step.</p>
<ol>
<li><strong>DNS query, UDP port 53</strong> — Module 3: protocols and the layered model. Also the first thing to check when "the Internet is down" but ping to an IP works.</li>
<li><strong>ARP: who has 10.0.0.1?</strong> — Module 7 territory, and the subject of Chapter 8. The host has already decided the destination is remote, using the AND test from this chapter.</li>
<li><strong>The frame goes out</strong> with destination MAC = the router and destination IP = the server. Modules 7 and 8 in one line, and the single most important sentence in the first half of this course.</li>
<li><strong>R1 receives it</strong>, strips the frame, decrements TTL 64 → 63, looks up the longest prefix, builds a completely new frame for the next link. Module 8.</li>
<li><strong>The reply arrives with TTL 57</strong> — seven hops, and a Linux sender. Module 8 again, now used as a diagnostic.</li>
</ol>
<p>If you can say those five lines from memory, naming which device rewrote which field, you are ready for what comes next.</p>`,
        `<p>Cách nhanh nhất để thử xem cái nền còn vững không là kể lại một lời yêu cầu HTTP duy nhất và gọi tên module chịu trách nhiệm cho từng bước.</p>
<ol>
<li><strong>Truy vấn DNS, UDP cổng 53</strong> — Module 3: giao thức và mô hình phân tầng. Đây cũng là thứ đầu tiên phải kiểm khi "mất mạng" mà ping tới một địa chỉ IP thì vẫn được.</li>
<li><strong>ARP: ai giữ 10.0.0.1?</strong> — thuộc địa phận Module 7, và là chủ đề của chương 8. Máy trạm đã quyết xong rằng đích ở xa, bằng chính phép AND của chương này.</li>
<li><strong>Cái khung đi ra</strong> với MAC đích = router và IP đích = máy chủ. Module 7 và 8 gói trong một dòng, và là câu quan trọng nhất trong cả nửa đầu môn học.</li>
<li><strong>R1 nhận được</strong>, bóc khung, hạ TTL 64 → 63, tra tiền tố dài nhất, dựng một cái khung hoàn toàn mới cho chặng kế tiếp. Module 8.</li>
<li><strong>Gói trả lời về với TTL 57</strong> — bảy chặng, và bên gửi là Linux. Lại Module 8, lần này dùng để chẩn đoán.</li>
</ol>
<p>Nếu bạn nói được năm dòng đó từ trí nhớ, gọi tên được thiết bị nào viết lại trường nào, thì bạn sẵn sàng cho phần tiếp theo.</p>`],

      [31, 'Chapter 7 — what you must be able to do',
        `<p>Nine concrete abilities. Tick them honestly; each one is testable in a single command or a single sentence.</p>
<p>The first seven come straight from Cisco Module 8 and will appear in the midterm. The last two are the ★ additions of this site, and they are the ones you will use on your own server next week.</p>
<p><strong>A self-test that takes two minutes.</strong> Open a terminal on any Linux machine and answer these four without looking anything up: what is my mask, is 8.8.8.8 local or remote, how many hops away is 1.1.1.1, and does this path carry 1500-byte packets? Four commands, four answers. If any of them makes you hesitate, that is the section to reread.</p>`,
        `<p>Chín năng lực cụ thể. Hãy tự chấm cho thật, mỗi cái đều kiểm được bằng đúng một lệnh hoặc một câu nói.</p>
<p>Bảy cái đầu lấy thẳng từ Module 8 của Cisco và sẽ xuất hiện trong bài giữa kỳ. Hai cái cuối là phần ★ trang này bổ sung, và đó là hai thứ bạn sẽ dùng trên máy chủ của mình ngay tuần sau.</p>
<p><strong>Một phép tự kiểm mất hai phút.</strong> Mở terminal trên bất cứ máy Linux nào và trả lời bốn câu này mà không tra cứu gì: mặt nạ của tôi là gì, 8.8.8.8 là cục bộ hay ở xa, 1.1.1.1 cách mấy chặng, và đường này có chở nổi gói 1500 byte không? Bốn lệnh, bốn câu trả lời. Câu nào làm bạn ngập ngừng thì đó là mục cần đọc lại.</p>`],
    ]),

    bi(
      `<h3>📚 Module-by-module checklist</h3>
<p>Three claims per module, and one command or calculation that proves each block. Cover the right-hand column and try to state the claims first.</p>
<h4>Modules 1–3 — foundations, IOS, models</h4>
<ul>
<li>A protocol is an <strong>agreement</strong>, not software: format, timing, meaning, error handling. Two implementations by different vendors interoperate because they obey the same agreement.</li>
<li>OSI has 7 layers and is a <em>teaching and troubleshooting</em> model; TCP/IP has 4 and is what is actually implemented. Layers 5–7 of OSI collapse into TCP/IP's Application layer.</li>
<li>IOS has modes, and the prompt tells you which one: <code>&gt;</code> user EXEC, <code>#</code> privileged EXEC, <code>(config)#</code> global configuration. Typing a configuration command at <code>#</code> fails not because the command is wrong but because the mode is.</li>
<li><em>Prove it:</em> name the layer at which each of these lives — a port number, a MAC address, a fibre wavelength, an IP address.</li>
</ul>
<h4>Module 4 — the physical layer</h4>
<ul>
<li><strong>Bandwidth is capacity; throughput is what you actually get.</strong> Throughput is reduced by latency, congestion, overhead and the slowest link on the path.</li>
<li>Copper is limited to 100 m by attenuation, not by the connector. Fibre is immune to electromagnetic interference because it carries light, not current.</li>
<li>Twisted pair defeats interference by <em>symmetry</em>: both wires pick up the same noise, and the receiver subtracts.</li>
<li><em>Prove it:</em> explain why a 1 Gbps link gives 940 Mbps at best, and where the missing 60 Mbps went.</li>
</ul>
<h4>Module 6 — the data link layer</h4>
<ul>
<li>The FCS <strong>detects</strong> errors; it does not correct them. A frame that fails the CRC is dropped silently and only a counter moves.</li>
<li>MAC is the lower sublayer (framing, addressing, access control); LLC is the upper one, reduced on modern Ethernet to the EtherType field.</li>
<li>A duplex mismatch produces a link that is <em>up</em> and slow, not down — half-duplex on one side reports collisions, full-duplex on the other reports FCS errors.</li>
<li><em>Prove it:</em> <code>ip -s link show eth0</code>, and name which counter rises for each of those two faults.</li>
</ul>
<h4>Module 7 — Ethernet switching</h4>
<ul>
<li>A switch <strong>learns from the source MAC</strong> and <strong>decides on the destination MAC</strong>. Two fields of the same frame, two different jobs.</li>
<li>Unknown unicast is flooded exactly like broadcast, because the switch cannot tell "I do not know this address" apart from "everybody".</li>
<li>A switch creates one collision domain per port and <strong>cannot divide a broadcast domain</strong>. Only a router can.</li>
<li><em>Prove it:</em> a laptop moved to a new port is unreachable for up to 300 seconds — say exactly why, and what makes it recover instantly.</li>
</ul>
<h4>Module 8 — the network layer (this chapter)</h4>
<ul>
<li>IP is connectionless, best-effort and media-independent — all three on purpose, and all three with a named cost.</li>
<li>Local or remote is decided by <strong>the host's own mask</strong>, ANDed with the destination. Nothing else takes part.</li>
<li>Routing is <strong>longest prefix first</strong>, then administrative distance for ties. Never the other way round.</li>
<li><em>Prove it:</em> <code>ip route get</code> for one local and one remote destination, and explain the presence or absence of <code>via</code>.</li>
</ul>`,
      `<h3>📚 Bản kiểm kê theo từng module</h3>
<p>Mỗi module ba khẳng định, và một lệnh hoặc một phép tính chứng minh cả khối. Che cột bên phải lại và thử tự phát biểu các khẳng định trước.</p>
<h4>Module 1–3 — nền tảng, IOS, mô hình</h4>
<ul>
<li>Giao thức là một <strong>thoả thuận</strong>, không phải phần mềm: định dạng, nhịp thời gian, ý nghĩa, cách xử lý lỗi. Hai bản cài của hai hãng khác nhau nói chuyện được với nhau vì cùng tuân theo một thoả thuận.</li>
<li>OSI có 7 tầng và là mô hình để <em>dạy học và gỡ lỗi</em>; TCP/IP có 4 tầng và là thứ thật sự được cài đặt. Tầng 5–7 của OSI gộp lại thành tầng Ứng dụng của TCP/IP.</li>
<li>IOS có các chế độ, và dấu nhắc cho biết bạn đang ở chế độ nào: <code>&gt;</code> user EXEC, <code>#</code> privileged EXEC, <code>(config)#</code> cấu hình toàn cục. Gõ một lệnh cấu hình ở dấu <code>#</code> mà hỏng thì không phải vì lệnh sai, mà vì chế độ sai.</li>
<li><em>Chứng minh đi:</em> gọi tên tầng của từng thứ sau — một số hiệu cổng, một địa chỉ MAC, một bước sóng ánh sáng trong sợi quang, một địa chỉ IP.</li>
</ul>
<h4>Module 4 — tầng vật lý</h4>
<ul>
<li><strong>Băng thông là sức chứa; thông lượng là thứ bạn thật sự nhận được.</strong> Thông lượng bị giảm bởi độ trễ, tắc nghẽn, phần bao gói, và bởi đường link chậm nhất trên đường đi.</li>
<li>Cáp đồng bị giới hạn 100 m vì suy hao, không phải vì cái đầu nối. Sợi quang miễn nhiễm với nhiễu điện từ vì nó chở ánh sáng chứ không chở dòng điện.</li>
<li>Cáp xoắn đôi triệt nhiễu bằng <em>sự đối xứng</em>: cả hai sợi hứng cùng một nhiễu, và bên nhận đem trừ đi.</li>
<li><em>Chứng minh đi:</em> giải thích vì sao một đường link 1 Gbps giỏi lắm cho 940 Mbps, và 60 Mbps còn lại đi đâu.</li>
</ul>
<h4>Module 6 — tầng liên kết dữ liệu</h4>
<ul>
<li>FCS <strong>phát hiện</strong> lỗi; nó không sửa lỗi. Một khung trượt CRC bị vứt lặng lẽ và chỉ có một bộ đếm nhúc nhích.</li>
<li>MAC là tầng con dưới (dựng khung, đánh địa chỉ, điều khiển truy cập); LLC là tầng con trên, trên Ethernet hiện đại đã teo lại còn trường EtherType.</li>
<li>Lệch duplex đẻ ra một đường link <em>đang lên</em> và chậm, chứ không phải đứt — bên bán song công báo xung đột, bên song công toàn phần báo lỗi FCS.</li>
<li><em>Chứng minh đi:</em> <code>ip -s link show eth0</code>, và gọi tên bộ đếm nào tăng ứng với từng lỗi trong hai lỗi đó.</li>
</ul>
<h4>Module 7 — chuyển mạch Ethernet</h4>
<ul>
<li>Switch <strong>học theo MAC nguồn</strong> và <strong>quyết định theo MAC đích</strong>. Hai trường của cùng một khung, hai công việc khác nhau.</li>
<li>Unicast chưa biết bị tràn y hệt broadcast, vì switch không phân biệt được "tôi không biết địa chỉ này" với "gửi cho tất cả".</li>
<li>Switch tạo ra mỗi cổng một miền xung đột và <strong>không chia được miền quảng bá</strong>. Chỉ router mới làm được.</li>
<li><em>Chứng minh đi:</em> một cái laptop chuyển sang cổng mới thì không ai tới được trong tối đa 300 giây — nói chính xác vì sao, và cái gì làm nó hồi phục tức thì.</li>
</ul>
<h4>Module 8 — tầng mạng (chính chương này)</h4>
<ul>
<li>IP không kết nối, nỗ lực tối đa và độc lập môi trường truyền — cả ba đều có chủ ý, và cả ba đều có một cái giá gọi tên được.</li>
<li>Cục bộ hay ở xa là do <strong>mặt nạ của chính máy trạm</strong> quyết, đem AND với địa chỉ đích. Không có gì khác tham gia.</li>
<li>Định tuyến là <strong>tiền tố dài nhất trước</strong>, rồi mới tới khoảng cách quản trị khi hoà. Không bao giờ ngược lại.</li>
<li><em>Chứng minh đi:</em> chạy <code>ip route get</code> cho một đích cục bộ và một đích ở xa, rồi giải thích vì sao có hay không có chữ <code>via</code>.</li>
</ul>`,
    ),

    bi(
      `<h3>🧪 One end-to-end trace, written out in full</h3>
<p>Your laptop is <strong>10.0.0.42/24</strong>, gateway <strong>10.0.0.1</strong>. You run <code>curl https://example.com</code>. Here is every layer-3 decision, in order.</p>
<pre><code class="language-plaintext">1. DNS: example.com -> 93.184.216.34
   UDP 53 to the resolver. If the resolver is remote, steps 2-4 happen for it first.

2. Local or remote?
   93.184.216.34 AND 255.255.255.0 = 93.184.216.0
   10.0.0.42     AND 255.255.255.0 = 10.0.0.0
   different  ->  REMOTE

3. Which route?
   default via 10.0.0.1 dev eth0 src 10.0.0.42     (the only match)

4. Which MAC?
   ARP for 10.0.0.1  (the GATEWAY, not the server)  ->  aa:bb:cc:dd:ee:ff

5. The frame that leaves eth0:
   dst MAC  aa:bb:cc:dd:ee:ff   <- the router
   src MAC  my own NIC
   dst IP   93.184.216.34       <- the server, unchanged for the whole trip
   src IP   10.0.0.42
   TTL      64
   Protocol 6 (TCP)

6. R1: strip frame, TTL 64->63, longest prefix match, build a NEW frame.
   Repeat at every hop. The IP header keeps its two addresses throughout.

7. Reply arrives: ttl=57  ->  64 - 57 = 7 hops, sender is Linux or macOS.</code></pre>
<p>If a step in that list is not obvious to you, the module that owns it is named in the checklist above.</p>`,
      `<h3>🧪 Một lần lần theo trọn vẹn từ đầu tới cuối</h3>
<p>Laptop của bạn là <strong>10.0.0.42/24</strong>, cổng ra <strong>10.0.0.1</strong>. Bạn chạy <code>curl https://example.com</code>. Đây là mọi quyết định tầng 3, theo đúng thứ tự.</p>
<pre><code class="language-plaintext">1. DNS: example.com -> 93.184.216.34
   UDP 53 gửi tới máy phân giải. Nếu máy đó ở xa thì bước 2-4 xảy ra cho nó trước.

2. Cục bộ hay ở xa?
   93.184.216.34 AND 255.255.255.0 = 93.184.216.0
   10.0.0.42     AND 255.255.255.0 = 10.0.0.0
   khác nhau  ->  Ở XA

3. Tuyến nào?
   default via 10.0.0.1 dev eth0 src 10.0.0.42     (dòng khớp duy nhất)

4. MAC nào?
   ARP hỏi 10.0.0.1  (CỔNG RA, không phải máy chủ)  ->  aa:bb:cc:dd:ee:ff

5. Cái khung rời khỏi eth0:
   MAC đích  aa:bb:cc:dd:ee:ff   <- con router
   MAC nguồn card mạng của tôi
   IP đích   93.184.216.34       <- máy chủ, không đổi suốt cả chuyến đi
   IP nguồn  10.0.0.42
   TTL       64
   Protocol  6 (TCP)

6. R1: bóc khung, TTL 64->63, khớp tiền tố dài nhất, dựng khung MỚI.
   Lặp lại ở mọi chặng. Phần đầu IP giữ nguyên hai địa chỉ suốt chặng đường.

7. Gói trả lời về: ttl=57  ->  64 - 57 = 7 chặng, bên gửi là Linux hoặc macOS.</code></pre>
<p>Bước nào trong danh sách đó chưa hiển nhiên với bạn thì module phụ trách nó đã được gọi tên trong bản kiểm kê ở trên.</p>`,
    ),

    bi(
      `<h3>🎯 The trap in the school's question for this session</h3>
<p>FLM assigns session 23 the question <strong>CQ8.1 — "Why do we need use IP protocol for reliable communications?"</strong></p>
<p><strong>The premise is false, and saying so is the answer.</strong> IP is explicitly and deliberately <em>unreliable</em>: best-effort, connectionless, with no acknowledgement, no retransmission, no ordering and no duplicate suppression. Anyone who answers "because IP guarantees delivery" has the model backwards.</p>
<p><strong>A good answer has three parts.</strong></p>
<ol>
<li><strong>Correct the premise.</strong> IP does not provide reliability. It provides universal addressing and hop-by-hop forwarding, and it makes no promise about any individual packet.</li>
<li><strong>Explain why that is the right design.</strong> Reliability requires state, and state in the middle of the network scales badly and is lost on every reboot. The end-to-end argument says: put it at the ends, where the application can choose whether it wants it. TCP wants it; a voice call does not.</li>
<li><strong>Say what IP <em>does</em> contribute to reliable communication.</strong> A reliable protocol needs something underneath that can carry a packet to any machine on Earth and tell the difference between "delivered to the wrong place" and "not delivered at all". IP provides the addressing, the forwarding, the TTL that stops loops, and the ICMP messages that report failures. Reliability is built <em>on</em> IP, not <em>by</em> it.</li>
</ol>
<p>This is also good exam technique in general: when a question contains a false premise, name it, then answer the question the examiner meant to ask.</p>`,
      `<h3>🎯 Cái bẫy trong câu hỏi của trường cho buổi này</h3>
<p>FLM gán cho buổi 23 câu hỏi <strong>CQ8.1 — "Why do we need use IP protocol for reliable communications?"</strong></p>
<p><strong>Tiền đề của câu đó sai, và nói thẳng ra điều đó chính là câu trả lời.</strong> IP rõ ràng và cố ý <em>không tin cậy</em>: nỗ lực tối đa, không kết nối, không xác nhận, không gửi lại, không sắp thứ tự và không loại bản trùng. Ai trả lời "vì IP bảo đảm chuyển tới nơi" là hiểu ngược mô hình.</p>
<p><strong>Một câu trả lời tốt có ba phần.</strong></p>
<ol>
<li><strong>Đính chính tiền đề.</strong> IP không cung cấp tính tin cậy. Nó cung cấp cách đánh địa chỉ toàn cầu và cách chuyển tiếp từng chặng, và nó không hứa gì về bất cứ gói tin riêng lẻ nào.</li>
<li><strong>Giải thích vì sao đó mới là thiết kế đúng.</strong> Tin cậy đòi hỏi trạng thái, mà trạng thái ở giữa mạng thì khó mở rộng và mất sạch sau mỗi lần khởi động lại. Lập luận đầu-cuối nói: đặt nó ở hai đầu, nơi ứng dụng được quyền chọn có cần hay không. TCP thì cần; một cuộc gọi thoại thì không.</li>
<li><strong>Nói xem IP <em>có</em> đóng góp gì cho truyền thông tin cậy.</strong> Một giao thức tin cậy cần một thứ bên dưới có khả năng chở gói tin tới bất cứ máy nào trên Trái Đất và phân biệt được "giao nhầm chỗ" với "không giao được". IP cung cấp cách đánh địa chỉ, cách chuyển tiếp, cái TTL chặn vòng lặp, và những thông điệp ICMP báo cáo sự cố. Tính tin cậy được xây <em>trên</em> IP, chứ không phải <em>bởi</em> IP.</li>
</ol>
<p>Đây cũng là kỹ thuật làm bài tốt nói chung: khi một câu hỏi chứa tiền đề sai, hãy gọi tên nó, rồi trả lời câu hỏi mà người ra đề thật sự muốn hỏi.</p>`,
    ),

    bi(
      `<h3>✍️ Review exercises — mixed, all seven modules</h3>
<p><strong>1.</strong> A frame arrives at a switch with destination MAC <code>FF:FF:FF:FF:FF:FF</code> and destination IP <code>10.0.0.7</code>. Is that legal? What is it?</p>
<p><strong>2.</strong> Your link is 1 Gbps and iperf reports 940 Mbps. Is anything wrong?</p>
<p><strong>3.</strong> Which devices on the path rewrite the source MAC, and which rewrite the source IP?</p>
<p><strong>4.</strong> A host is <code>192.168.4.10/26</code>. How many usable addresses are on its subnet, and what is its broadcast address?</p>
<p><strong>5.</strong> Why can a switch not divide a broadcast domain, and what does that imply for a flat network with 500 machines?</p>
<hr>
<h4>Answers</h4>
<p><strong>1. Legal, and extremely common — it is an ARP request.</strong> ARP asks "who has 10.0.0.7?" and, since the asker does not yet know that machine's MAC, it must broadcast. The switch floods it out every port; only the machine owning that IP replies, and it replies <em>unicast</em>. Chapter 8 is entirely about this exchange.</p>
<p><strong>2. Nothing is wrong; 940 Mbps is the expected figure.</strong> Ethernet adds 38 bytes of overhead per frame (preamble 8 + header 14 + FCS 4 + interframe gap 12), and TCP/IP adds 40 more. For 1500-byte frames that is roughly 5–6% lost to framing, which is exactly the gap between 1000 and 940. Bandwidth is capacity; throughput is what is left after the protocol takes its share.</p>
<p><strong>3.</strong> <strong>Every router rewrites the source MAC</strong> — the frame is rebuilt from scratch on each link, so the source MAC is always the outgoing interface of the device that just forwarded it. <strong>Nothing rewrites the source IP except NAT</strong>, which is a specific function on a specific device. If you observe the source IP changing anywhere else, you have found a misconfiguration.</p>
<p><strong>4. 62 usable addresses; broadcast is 192.168.4.63.</strong> /26 leaves 6 host bits, so the block size is 2^6 = 64. The subnets are 192.168.4.0, .64, .128, .192 — and .10 falls in the first, 192.168.4.0/26. Network address .0, broadcast .63, usable .1 through .62, which is 64 − 2 = 62.</p>
<p><strong>5.</strong> A switch floods broadcasts by design: that is how ARP, DHCP discovery and neighbour discovery work at all. It has no mechanism to stop one, because stopping broadcasts would break the protocols that depend on them. Only a router, or a VLAN boundary, terminates a broadcast domain. For 500 machines on one flat network the consequence is that every ARP request from any of them is processed by all 500 NICs, and broadcast traffic grows with the square of the population — which is the practical reason to segment with VLANs long before you run out of addresses.</p>`,
      `<h3>✍️ Bài tập ôn — trộn lẫn, cả bảy module</h3>
<p><strong>1.</strong> Một khung tới switch với MAC đích <code>FF:FF:FF:FF:FF:FF</code> và IP đích <code>10.0.0.7</code>. Như vậy có hợp lệ không? Đó là cái gì?</p>
<p><strong>2.</strong> Đường link của bạn 1 Gbps và iperf báo 940 Mbps. Có gì hỏng không?</p>
<p><strong>3.</strong> Những thiết bị nào trên đường đi viết lại MAC nguồn, và những thiết bị nào viết lại IP nguồn?</p>
<p><strong>4.</strong> Một máy là <code>192.168.4.10/26</code>. Subnet của nó có bao nhiêu địa chỉ dùng được, và địa chỉ quảng bá là gì?</p>
<p><strong>5.</strong> Vì sao switch không chia được miền quảng bá, và điều đó kéo theo gì cho một mạng phẳng 500 máy?</p>
<hr>
<h4>Lời giải</h4>
<p><strong>1. Hợp lệ, và cực kỳ phổ biến — đó là một lời hỏi ARP.</strong> ARP hỏi "ai giữ 10.0.0.7?" và vì bên hỏi chưa biết MAC của máy đó nên buộc phải quảng bá. Switch tràn nó ra mọi cổng; chỉ máy sở hữu địa chỉ IP đó trả lời, và nó trả lời <em>unicast</em>. Cả chương 8 nói về đúng cuộc trao đổi này.</p>
<p><strong>2. Không có gì hỏng; 940 Mbps là con số đúng như dự kiến.</strong> Ethernet cộng thêm 38 byte bao gói cho mỗi khung (preamble 8 + phần đầu 14 + FCS 4 + khe giữa hai khung 12), và TCP/IP cộng thêm 40 nữa. Với khung 1500 byte thì mất khoảng 5–6% cho phần bao gói, và đó đúng bằng khoảng cách giữa 1000 với 940. Băng thông là sức chứa; thông lượng là phần còn lại sau khi giao thức lấy phần của nó.</p>
<p><strong>3.</strong> <strong>Mọi router đều viết lại MAC nguồn</strong> — cái khung được dựng lại từ đầu trên từng đường link, nên MAC nguồn luôn là cổng đi ra của thiết bị vừa chuyển tiếp nó. <strong>Không gì viết lại IP nguồn trừ NAT</strong>, vốn là một chức năng cụ thể trên một thiết bị cụ thể. Nếu bạn thấy IP nguồn đổi ở chỗ nào khác thì bạn vừa tìm ra một lỗi cấu hình.</p>
<p><strong>4. 62 địa chỉ dùng được; quảng bá là 192.168.4.63.</strong> /26 chừa 6 bit cho máy, nên kích thước khối là 2^6 = 64. Các subnet là 192.168.4.0, .64, .128, .192 — và .10 rơi vào cái đầu tiên, 192.168.4.0/26. Địa chỉ mạng .0, quảng bá .63, dùng được từ .1 tới .62, tức là 64 − 2 = 62.</p>
<p><strong>5.</strong> Switch tràn broadcast là do thiết kế: đó là cách ARP, DHCP discovery và neighbour discovery hoạt động được. Nó không có cơ chế nào chặn broadcast cả, vì chặn broadcast là phá luôn những giao thức dựa vào chúng. Chỉ router, hoặc một ranh giới VLAN, mới kết thúc một miền quảng bá. Với 500 máy trên một mạng phẳng thì hệ quả là mọi lời hỏi ARP của bất cứ máy nào cũng bị cả 500 card mạng xử lý, và lưu lượng quảng bá tăng theo bình phương số máy — và đó chính là lý do thực tế để chia VLAN từ rất lâu trước khi bạn hết địa chỉ.</p>`,
    ),

    cq(23, [
      ['CQ8.1', 'Why do we need use IP protocol for reliable communications? <em>— note: the premise is false. IP is deliberately unreliable; see the three-part answer above.</em>',
        'Why do we need use IP protocol for reliable communications? <em>— lưu ý: tiền đề của câu này sai. IP cố ý KHÔNG tin cậy; xem câu trả lời ba phần ở trên.</em>'],
    ]),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz ──────────────────────────────── */

const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

const QUIZ = {
  title: 'Quiz Chapter 7 — The Network Layer|||Quiz Chương 7 — Tầng mạng',
  slug: 'nwc204-ch7-quiz',
  type: 'QUIZ',
  description: '12 câu song ngữ cho chương 7: ba đặc tính của IP, các trường của phần đầu IPv4, TTL và traceroute, trường Protocol, phân mảnh và offset, lỗ đen MTU, những gì IPv6 đã xoá, quyết định cục bộ hay ở xa, khớp tiền tố dài nhất, khoảng cách quản trị so với trọng số, cổng ra mặc định, và ip route get. Mỗi câu có giải thích.',
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      q('Which statement about IP is TRUE?|||Câu nào về IP là ĐÚNG?',
        ['IP guarantees delivery but not order|||IP bảo đảm chuyển tới nơi nhưng không bảo đảm thứ tự', 'IP is connectionless and best-effort — it guarantees nothing|||IP không kết nối và nỗ lực tối đa — nó không bảo đảm gì cả', 'IP retransmits lost packets after a timeout|||IP gửi lại gói bị mất sau khi hết giờ chờ', 'IP guarantees order but not delivery|||IP bảo đảm thứ tự nhưng không bảo đảm tới nơi'],
        1,
        'IP makes no promise at all: a packet may be dropped, duplicated, or arrive out of order, and the sender is never told. Reliability was deliberately pushed to the ends, where the application can choose it — TCP takes it, UDP declines it. The exam trap is the school\'s own CQ8.1, which asks why IP is needed for "reliable" communications; the correct answer starts by correcting the premise.|||IP không hứa hẹn gì hết: một gói có thể bị vứt, bị nhân đôi, hoặc tới sai thứ tự, và bên gửi không bao giờ được báo. Tính tin cậy bị đẩy về hai đầu một cách có chủ ý, nơi ứng dụng được quyền chọn — TCP thì lấy, UDP thì từ chối. Cái bẫy trong đề là chính câu CQ8.1 của trường, hỏi vì sao cần IP cho truyền thông "tin cậy"; câu trả lời đúng bắt đầu bằng việc đính chính tiền đề.'),

      q('How many bytes is an IPv4 header with no options, and an IPv6 header?|||Phần đầu IPv4 không có options và phần đầu IPv6 dài bao nhiêu byte?',
        ['20 and 20|||20 và 20', '20 and 40|||20 và 40', '40 and 20|||40 và 20', '24 and 48|||24 và 48'],
        1,
        'IPv4 is 20 bytes minimum, stretching to 60 with options, which is why it needs the IHL field. IPv6 is always exactly 40 bytes — bigger, because 32 of those are the two 128-bit addresses, but simpler, with 6 fields instead of 12 and no length field needed at all.|||IPv4 tối thiểu 20 byte, giãn tới 60 khi có options, và đó là lý do nó cần trường IHL. IPv6 luôn đúng 40 byte — to hơn, vì 32 trong số đó là hai địa chỉ 128 bit, nhưng đơn giản hơn, chỉ 6 trường thay vì 12 và hoàn toàn không cần trường độ dài.'),

      q('A ping reply arrives with ttl=57. What does that tell you?|||Một gói ping trả về với ttl=57. Điều đó cho bạn biết gì?',
        ['The packet took 57 seconds|||Gói tin mất 57 giây', 'The sender is 57 hops away|||Bên gửi cách 57 chặng', 'The sender started at 64 and it crossed 7 routers|||Bên gửi bắt đầu ở 64 và nó đi qua 7 router', 'The connection quality is 57 out of 100|||Chất lượng kết nối là 57 trên 100'],
        2,
        'TTL was never seconds despite its name; every router that forwards subtracts exactly 1. Linux and macOS start at 64, so 64 - 57 = 7 hops. Windows starts at 128 and Cisco IOS at 255, so the initial value also fingerprints the sender\'s operating system — and if your subtraction gives a negative number, you guessed the wrong starting value.|||TTL chưa bao giờ là số giây dù mang cái tên đó; mọi router chuyển tiếp đều trừ đúng 1. Linux và macOS bắt đầu ở 64, nên 64 - 57 = 7 chặng. Windows bắt đầu ở 128 còn Cisco IOS ở 255, nên giá trị khởi đầu còn nhận diện được hệ điều hành của bên gửi — và nếu phép trừ ra số âm thì bạn đã đoán sai giá trị khởi đầu.'),

      q('Why does traceroute work at all?|||Vì sao traceroute lại chạy được?',
        ['It asks each router politely for its address|||Nó lịch sự hỏi từng router địa chỉ của nó', 'It sends packets with TTL 1, 2, 3 … and each router that discards one reports back|||Nó gửi gói với TTL 1, 2, 3 … và mỗi router vứt một gói đều báo về', 'It reads the routing tables of every router on the path|||Nó đọc bảng định tuyến của mọi router trên đường', 'It uses a special TRACE protocol|||Nó dùng một giao thức TRACE riêng'],
        1,
        'It abuses the loop brake. A packet with TTL 1 dies at the first router, which is obliged to send back ICMP Time Exceeded and thereby reveals its address. TTL 2 exposes the second, and so on. A "* * *" line means that hop is configured not to answer — the path is still fine, and later hops replying proves it.|||Nó lợi dụng cái phanh chống vòng lặp. Một gói TTL 1 chết ở router đầu tiên, và router đó buộc phải gửi về ICMP Time Exceeded, qua đó để lộ địa chỉ của mình. TTL 2 lộ ra con thứ hai, và cứ thế. Dòng "* * *" nghĩa là chặng đó được cấu hình không trả lời — đường đi vẫn tốt, và việc các chặng sau có trả lời chứng minh điều đó.'),

      q('SSH connects, then freezes the moment a command produces long output. ping works. What is the most likely cause?|||SSH vào được, rồi đơ ngay khi một lệnh cho ra kết xuất dài. ping thì chạy. Nguyên nhân nhiều khả năng nhất là gì?',
        ['The SSH server is overloaded|||Máy chủ SSH quá tải', 'An MTU black hole — ICMP "fragmentation needed" is being blocked|||Lỗ đen MTU — thông điệp ICMP "cần phân mảnh" đang bị chặn', 'The password expired|||Mật khẩu hết hạn', 'DNS is broken|||DNS hỏng'],
        1,
        'Small packets get through, so the handshake and the command both succeed; only the large response packets die. That asymmetry is the signature of Path MTU Discovery being broken by a firewall that drops ICMP type 3 code 4. Prove it with ping -M do -s 1472, and fix it by allowing that ICMP message or by clamping TCP MSS.|||Gói nhỏ đi lọt nên cái bắt tay lẫn câu lệnh đều thành công; chỉ có gói phản hồi lớn là chết. Chính sự lệch đó là dấu vân tay của việc Path MTU Discovery bị một tường lửa vứt ICMP loại 3 mã 4 làm hỏng. Chứng minh bằng ping -M do -s 1472, và sửa bằng cách cho thông điệp ICMP đó đi qua hoặc ghim TCP MSS.'),

      q('A 4000-byte IPv4 packet crosses a 1500-byte link. What is the Fragment Offset of the second fragment?|||Một gói IPv4 4000 byte đi qua đường link 1500 byte. Fragment Offset của mảnh thứ hai là bao nhiêu?',
        ['1480', '185', '2', '1500'],
        1,
        'Each fragment carries at most 1500 - 20 = 1480 bytes of data, so the second one begins at byte 1480 of the original payload. The offset field counts in units of 8 bytes, so it stores 1480 / 8 = 185. All fragments share the same Identification, MF is 1 on all but the last, and only the destination reassembles — lose one fragment and the whole packet is gone.|||Mỗi mảnh chở tối đa 1500 - 20 = 1480 byte dữ liệu, nên mảnh thứ hai bắt đầu ở byte 1480 của phần tải gốc. Trường offset đếm theo đơn vị 8 byte, nên nó lưu 1480 / 8 = 185. Mọi mảnh dùng chung một Identification, MF bằng 1 ở mọi mảnh trừ mảnh cuối, và chỉ máy đích mới ghép lại — mất một mảnh là mất cả gói.'),

      q('What did IPv6 remove from the main header, and why?|||IPv6 đã bỏ gì khỏi phần đầu chính, và vì sao?',
        ['The addresses, to save space|||Bỏ địa chỉ, để tiết kiệm chỗ', 'The header checksum and the fragmentation fields|||Bỏ header checksum và các trường phân mảnh', 'The Hop Limit, because loops no longer happen|||Bỏ Hop Limit, vì không còn vòng lặp nữa', 'Nothing — IPv6 only added fields|||Không bỏ gì — IPv6 chỉ thêm trường'],
        1,
        'The checksum went because Ethernet and TCP/UDP already check, and IPv4 had to recompute it at every hop. The fragmentation fields went because IPv6 routers never fragment: too big means drop plus ICMPv6 Packet Too Big, and the source must resize. The consequence is practical — blocking ICMPv6 breaks IPv6 outright, because there is no fragmentation fallback left.|||Checksum bị bỏ vì Ethernet và TCP/UDP đã kiểm rồi, mà IPv4 lại phải tính lại nó ở mọi chặng. Các trường phân mảnh bị bỏ vì router IPv6 không bao giờ phân mảnh: quá to nghĩa là vứt kèm ICMPv6 Packet Too Big, và bên gửi phải tự chỉnh kích thước. Hệ quả rất thực tế — chặn ICMPv6 là làm hỏng hẳn IPv6, vì không còn đường lùi phân mảnh nào.'),

      q('A host is 172.20.5.100/22. Is 172.20.7.9 local or remote?|||Một máy là 172.20.5.100/22. Địa chỉ 172.20.7.9 là cục bộ hay ở xa?',
        ['Remote — the third octet differs|||Ở xa — octet thứ ba khác nhau', 'Local — /22 spans 172.20.4.0 to 172.20.7.255|||Cục bộ — /22 trải từ 172.20.4.0 tới 172.20.7.255', 'Remote — it needs the default gateway|||Ở xa — phải qua cổng ra mặc định', 'Impossible to say without the gateway address|||Không nói được nếu chưa biết địa chỉ cổng ra'],
        1,
        'A /22 masks the third octet with 11111100, keeping the top six bits, so both 5 and 7 reduce to 4: the network is 172.20.4.0/22 and it covers four third-octet values at once. Answering "remote" means applying /24 out of habit. The host decides using its OWN mask and nothing else — which is also why a wrong mask on one machine creates a one-way fault.|||Một /22 che octet thứ ba bằng 11111100, giữ lại sáu bit cao, nên cả 5 lẫn 7 đều rút về 4: mạng là 172.20.4.0/22 và nó phủ bốn giá trị octet thứ ba cùng lúc. Trả lời "ở xa" nghĩa là đã áp /24 theo thói quen. Máy trạm quyết định bằng mặt nạ CỦA CHÍNH NÓ và không dùng gì khác — và đó cũng là lý do một mặt nạ sai trên một máy đẻ ra lỗi một chiều.'),

      q('A packet for 172.16.5.10 matches 0.0.0.0/0, 172.16.0.0/16 and 172.16.5.0/24. Which is used?|||Một gói tới 172.16.5.10 khớp cả 0.0.0.0/0, 172.16.0.0/16 và 172.16.5.0/24. Tuyến nào được dùng?',
        ['0.0.0.0/0, because default routes are checked first|||0.0.0.0/0, vì tuyến mặc định được xét trước', '172.16.5.0/24, the longest prefix|||172.16.5.0/24, tiền tố dài nhất', 'Whichever appears first in the table|||Cái nào xuất hiện trước trong bảng', 'The one with the lowest administrative distance|||Cái có khoảng cách quản trị nhỏ nhất'],
        1,
        'The router finds every matching route and keeps the one with the most 1-bits in its mask, because a longer prefix means more specific knowledge of that destination. Table order is irrelevant, and administrative distance is only consulted when two routes have the SAME prefix length. This is also why a leftover /32 debug route silently overrides everything.|||Router tìm mọi tuyến khớp rồi giữ tuyến có nhiều bit 1 nhất trong mặt nạ, vì tiền tố dài hơn nghĩa là hiểu biết cụ thể hơn về cái đích đó. Thứ tự trong bảng không liên quan, và khoảng cách quản trị chỉ được tra khi hai tuyến có CÙNG độ dài tiền tố. Đây cũng là lý do một tuyến /32 để sót lúc gỡ lỗi sẽ âm thầm đè lên mọi thứ.'),

      q('A static route and an OSPF route both offer 10.20.0.0/16. Which wins, and on what basis?|||Một tuyến tĩnh và một tuyến OSPF cùng đưa ra 10.20.0.0/16. Cái nào thắng, và dựa trên cơ sở nào?',
        ['OSPF, because it is dynamic and adapts|||OSPF, vì nó động và biết thích nghi', 'The static route, because administrative distance 1 beats 110|||Tuyến tĩnh, vì khoảng cách quản trị 1 thắng 110', 'Whichever has the lower metric|||Cái nào có trọng số nhỏ hơn', 'Both are installed and traffic is load-balanced|||Cả hai được cài và lưu lượng chia tải'],
        1,
        'The prefix lengths are equal, so and only so does administrative distance decide: static is 1, OSPF is 110, and lower means more trusted. Metrics are never compared across protocols. The danger is that a static route never notices a failure — if its next hop dies, it stays in the table and keeps suppressing a perfectly good OSPF route, which is a classic self-inflicted black hole.|||Hai độ dài tiền tố bằng nhau, và chỉ khi đó khoảng cách quản trị mới quyết: tĩnh là 1, OSPF là 110, nhỏ hơn nghĩa là được tin hơn. Trọng số không bao giờ được đem so giữa hai giao thức. Mối nguy là tuyến tĩnh không bao giờ nhận ra sự cố — nếu chặng kế tiếp của nó chết, nó vẫn nằm trong bảng và tiếp tục dìm một tuyến OSPF hoàn toàn tốt, một cái hố tự đào kinh điển.'),

      q('Why can a default gateway never be outside your own subnet?|||Vì sao cổng ra mặc định không bao giờ được nằm ngoài subnet của chính bạn?',
        ['Cisco forbids it in software|||Cisco cấm điều đó bằng phần mềm', 'You must be able to ARP for it, and ARP only works on your own link|||Bạn phải ARP hỏi được nó, mà ARP chỉ chạy trên đường link của bạn', 'It would be too slow|||Nó sẽ quá chậm', 'It can be, as long as a static route exists|||Hoàn toàn được, miễn là có một tuyến tĩnh'],
        1,
        'To send anything to the gateway you need its MAC address, and you can only ARP within your own broadcast domain. A gateway outside the subnet would itself be classified as remote, so the host would need a gateway in order to reach its gateway — a loop with no exit. The fault is silent: the LAN keeps working perfectly, because local traffic never consults the default route.|||Muốn gửi bất cứ thứ gì cho cổng ra thì phải có MAC của nó, mà bạn chỉ ARP được trong miền quảng bá của chính mình. Một cổng ra nằm ngoài subnet sẽ tự bị xếp là ở xa, nên máy sẽ cần một cổng ra để tới được cổng ra của nó — một vòng lặp không lối thoát. Lỗi này im lặng: mạng LAN vẫn chạy hoàn hảo, vì lưu lượng nội bộ không bao giờ tra tới tuyến mặc định.'),

      q('ip route looks correct but traffic leaves by the wrong interface. What should you check first?|||ip route nhìn đúng mà lưu lượng vẫn ra sai cổng. Bạn nên kiểm gì trước tiên?',
        ['Restart the network service|||Khởi động lại dịch vụ mạng', 'ip rule — a policy rule may send the packet to another table|||ip rule — một luật chính sách có thể đẩy gói sang bảng khác', 'The cable|||Sợi dây mạng', 'The DNS configuration|||Cấu hình DNS'],
        1,
        'Linux consults a list of rules before any table, and "main" — what ip route prints — is only priority 32766. A VPN, a second uplink or a container runtime can install a rule with a lower number that diverts the packet entirely. ip route get is the command that settles it, because it applies the rules and longest-prefix match for you and reports the real decision.|||Linux tra một danh sách luật trước mọi bảng, và bảng "main" — thứ ip route in ra — chỉ có ưu tiên 32766. Một VPN, một đường lên thứ hai hay một bộ chạy container đều có thể cài một luật mang số nhỏ hơn và lái gói đi hẳn nơi khác. ip route get là lệnh dứt điểm chuyện này, vì nó áp cả luật lẫn phép khớp tiền tố dài nhất hộ bạn rồi báo lại quyết định thật.'),
    ],
  },
};

export default [
  {
    title: 'Chapter 7 — The Network Layer (FLM sessions 21–23)|||Chương 7 — Tầng mạng (buổi 21–23 của FLM)',
    slug: 'nwc204-chuong-7-tang-mang',
    description: 'Cisco Module 8 theo đúng buổi 21–23 của FLM: bốn việc của tầng mạng, ba đặc tính của IP và cái giá của từng cái, toàn bộ 12 trường phần đầu IPv4, TTL cùng cơ chế traceroute, trường Protocol, phân mảnh và offset, phần đầu IPv6 40 byte và những gì đã bị xoá, phần đầu mở rộng, ba quyết định của máy trạm, bảng định tuyến trên Linux/Windows/IOS, khoảng cách quản trị so với trọng số, khớp tiền tố dài nhất, tĩnh so với động, và buổi ôn Module 1–7. Kèm phần ★ bổ sung: lỗ đen MTU cùng cách chứng minh bằng ping -M do, ip route get, nhiều bảng định tuyến với ip rule, và các tuyến Docker tự cắm vào máy chủ. Slide tiếng Anh do cuongthai.com dựng, giảng song ngữ.',
    lessons: [L1, L2, L3, QUIZ],
  },
];
