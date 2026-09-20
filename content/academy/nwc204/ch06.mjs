/**
 * NWC204 · Chapter 6 — Ethernet Switching (Cisco Module 7).
 * FLM buổi 17–18 (lý thuyết) + buổi 19–20 (Lab 1.4).
 *
 * Slide: scripts/slides-src/nwc204-ch06.mjs → deck 'nwc204-ch06', 26 ảnh.
 *
 * ★ = phần cuongthai.com bổ sung ngoài Module 7: bit I/G và U/L đọc trên máy
 *     thật, tấn công làm tràn bảng MAC + port-security, và cách làm lại toàn bộ
 *     Lab 1.4 trên Linux/Docker mà không cần Packet Tracer.
 *
 * ⚠️ Bất thường của bảng gốc, đã nêu trong bài: FLM gán CQ7.1 và CQ7.2 cho buổi
 * 19–20 (vốn là Lab 1.4 của CHƯƠNG 6), rồi CQ7.3 "How does Ethernet works in a
 * switched network?" cho buổi 21 (vốn đã là chương 7 — Network Layer). Ba câu
 * mang số 7 nhưng nội dung thuộc chương 6. Trả lời tại đây, không sửa bảng gốc.
 *
 * ⚠️ File này CHỈ chứa chương 6. Đừng sửa NWC204.mjs ở đây.
 */
import { registerDeck, walk, walkHead, bi, cq } from './_slides.mjs';

const D = registerDeck('nwc204-ch06', {
  code: 'NWC204',
  en: 'Ethernet Switching',
  vi: 'Chuyển mạch Ethernet',
  total: 26,
});

/* ──────────────────────── Lesson 6.1 — session 17 ──────────────────────── */

const L1 = {
  title: '6.1 — The Ethernet frame and the MAC address (FLM session 17)|||6.1 — Khung Ethernet và địa chỉ MAC (buổi 17 của FLM)',
  slug: 'nwc204-6-1-khung-ethernet-va-dia-chi-mac',
  type: 'DOCUMENT',
  description: 'Buổi 17: Ethernet là cả tầng 1 lẫn tầng 2, khung Ethernet theo từng byte, runt và giant, cấu tạo 48 bit của địa chỉ MAC, hai bit cờ I/G và U/L, ba loại địa chỉ đích unicast/broadcast/multicast, và card mạng quyết định nhận hay bỏ một khung như thế nào.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 6 · Lesson 6.1 · FLM session 17 of 60 · CLO2, CLO4, CLO9 · Cisco Module 7</span>
<h2>The one LAN protocol left standing</h2>
<p class="lead">Token Ring, FDDI, ATM to the desktop, ARCNET — all gone. Ethernet won every fight, and the frame you are about to read byte by byte is on every wired link you will ever touch.</p>
<p><strong>Opening question:</strong> two virtual machines on your server have MAC addresses starting <code>52:54:00</code> and <code>02:42:ac</code>. No vendor bought either of those prefixes from the IEEE, yet both addresses are perfectly legal and work fine. One bit makes them legal. Which bit, and where is it?</p>
<p class="note">★ As in Chapter 5, a <strong>★</strong> marks material added by cuongthai.com beyond Cisco Module 7.</p>`,
      `<span class="eyebrow">NWC204 · Chương 6 · Bài 6.1 · Buổi 17/60 của FLM · CLO2, CLO4, CLO9 · Cisco Module 7</span>
<h2>Giao thức LAN duy nhất còn đứng vững</h2>
<p class="lead">Token Ring, FDDI, ATM xuống tận bàn làm việc, ARCNET — chết cả rồi. Ethernet thắng mọi cuộc, và cái khung bạn sắp đọc từng byte có mặt trên mọi đường dây bạn sẽ đụng tới trong đời.</p>
<p><strong>Câu hỏi mở đầu:</strong> hai máy ảo trên máy chủ của bạn có địa chỉ MAC bắt đầu bằng <code>52:54:00</code> và <code>02:42:ac</code>. Không hãng nào mua hai tiền tố đó của IEEE cả, vậy mà cả hai địa chỉ đều hoàn toàn hợp lệ và chạy bình thường. Có đúng một bit làm cho chúng hợp lệ. Bit nào, và nó nằm ở đâu?</p>
<p class="note">★ Như chương 5, dấu <strong>★</strong> đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 7.</p>`,
    ),

    walkHead('nwc204-ch06', 1, 8,
      'Slides 1–8 cover FLM session 17: 6.1 Ethernet Frame and 6.2 Ethernet MAC Address.',
      'Slide 1–8 là buổi 17 của FLM: 6.1 Ethernet Frame và 6.2 Ethernet MAC Address.'),

    walk('nwc204-ch06', [
      [1, 'Cover — Chapter 6, Ethernet Switching',
        `<p>Chapter 6 is <strong>Cisco Module 7</strong>, and FPT gives it four sessions.</p>
<ul>
<li>Session 17 — 6.1 Ethernet Frame, 6.2 Ethernet MAC Address.</li>
<li>Session 18 — 6.3 The MAC Address Table, 6.4 Switch Speeds and Forwarding Methods, 6.5 AI tools (self-learning).</li>
<li>Sessions 19–20 — Lab 1.4: Wireshark on Ethernet frames, device MAC addresses, the switch MAC table, and AI tools for analysing captures.</li>
<li>Outcomes: <strong>CLO2</strong> (apply Ethernet and switching concepts), <strong>CLO4</strong>, <strong>CLO9</strong>.</li>
</ul>
<p>This is the first chapter where you configure something that behaves like real equipment, and the first where a wrong answer has a visible symptom on a live network.</p>`,
        `<p>Chương 6 là <strong>Module 7 của Cisco</strong>, và trường xếp bốn buổi.</p>
<ul>
<li>Buổi 17 — 6.1 Ethernet Frame, 6.2 Ethernet MAC Address.</li>
<li>Buổi 18 — 6.3 The MAC Address Table, 6.4 Switch Speeds and Forwarding Methods, 6.5 công cụ AI (tự học).</li>
<li>Buổi 19–20 — Lab 1.4: dùng Wireshark soi khung Ethernet, xem MAC của thiết bị, xem bảng MAC của switch, và dùng AI phân tích gói đã bắt.</li>
<li>Chuẩn đầu ra: <strong>CLO2</strong> (vận dụng khái niệm Ethernet và chuyển mạch), <strong>CLO4</strong>, <strong>CLO9</strong>.</li>
</ul>
<p>Đây là chương đầu tiên bạn cấu hình một thứ xử sự như thiết bị thật, và cũng là chương đầu tiên mà trả lời sai sẽ để lại một triệu chứng nhìn thấy được trên mạng đang chạy.</p>`],

      [2, 'Ethernet is layer 1 and layer 2 together',
        `<p>An unusual thing about IEEE 802.3: it defines <strong>two layers at once</strong>.</p>
<ul>
<li>The <strong>physical</strong> half — voltages, connectors, the 100 m limit, 1000BASE-T. That was Chapter 4.</li>
<li>The <strong>MAC sublayer</strong> — framing, addressing, the FCS, media access. That is this chapter.</li>
<li>The <strong>LLC sublayer</strong> (802.2) sits above, and on modern Ethernet it has been reduced to the 2-byte EtherType field.</li>
</ul>
<p>This is why Ethernet standards are named after the medium rather than the protocol: <em>1000BASE-T</em> means 1000 Mbps, baseband, twisted pair. The frame format is identical across all of them — only the physical half changes.</p>`,
        `<p>Một điểm khác thường của IEEE 802.3: nó định nghĩa <strong>hai tầng cùng một lúc</strong>.</p>
<ul>
<li>Nửa <strong>vật lý</strong> — điện áp, đầu nối, giới hạn 100 m, 1000BASE-T. Đó là chương 4.</li>
<li>Tầng con <strong>MAC</strong> — dựng khung, đánh địa chỉ, tính FCS, điều khiển truy cập. Đó là chương này.</li>
<li>Tầng con <strong>LLC</strong> (802.2) nằm trên, và trên Ethernet hiện đại nó đã teo lại thành đúng 2 byte EtherType.</li>
</ul>
<p>Đó là lý do các chuẩn Ethernet được đặt tên theo môi trường truyền chứ không theo giao thức: <em>1000BASE-T</em> nghĩa là 1000 Mbps, băng tần cơ sở, cáp xoắn đôi. Định dạng khung giống hệt nhau ở tất cả — chỉ nửa vật lý là đổi.</p>`],

      [3, 'The Ethernet frame, byte by byte',
        `<p>Seven fields. Learn the byte counts; exam questions and real captures both depend on them.</p>
<ul>
<li><strong>Preamble 7 B + SFD 1 B</strong> — the pattern 10101010 repeated, then 10101011. It wakes the receiver's clock and marks where the frame begins. It is <em>not</em> counted as part of the frame.</li>
<li><strong>Destination MAC 6 B, Source MAC 6 B</strong> — destination first, because a switch can start deciding before it has read the rest.</li>
<li><strong>Type / Length 2 B</strong> — if the value is <strong>0x0600 or higher</strong> it is an EtherType naming the protocol inside; if it is <em>lower</em>, it is the payload length, which is the original 802.3 format and now rare.</li>
<li><strong>Data 46–1500 B</strong> — padded by the NIC if the payload is shorter than 46.</li>
<li><strong>FCS 4 B</strong> — the CRC-32 from Chapter 5.</li>
</ul>
<p>Destination before source is a design detail worth noticing: it exists so that a cut-through switch can begin forwarding after only six bytes.</p>`,
        `<p>Bảy trường. Hãy thuộc số byte; cả câu hỏi thi lẫn bản bắt gói thật đều dựa vào chúng.</p>
<ul>
<li><strong>Preamble 7 B + SFD 1 B</strong> — mẫu 10101010 lặp lại, rồi 10101011. Nó đánh thức đồng hồ của bên nhận và đánh dấu chỗ khung bắt đầu. Nó <em>không</em> được tính là một phần của khung.</li>
<li><strong>MAC đích 6 B, MAC nguồn 6 B</strong> — đích đứng trước, để switch có thể bắt đầu quyết định trước khi đọc xong phần còn lại.</li>
<li><strong>Type / Length 2 B</strong> — nếu giá trị <strong>từ 0x0600 trở lên</strong> thì đó là EtherType gọi tên giao thức bên trong; nếu <em>nhỏ hơn</em> thì đó là độ dài phần tải, tức định dạng 802.3 nguyên thuỷ, nay hiếm gặp.</li>
<li><strong>Dữ liệu 46–1500 B</strong> — card mạng chèn thêm nếu phần tải ngắn hơn 46.</li>
<li><strong>FCS 4 B</strong> — chính là CRC-32 của chương 5.</li>
</ul>
<p>Chuyện đích đứng trước nguồn là một chi tiết thiết kế đáng để ý: nó tồn tại để switch kiểu cut-through có thể bắt đầu chuyển tiếp chỉ sau sáu byte.</p>`],

      [4, 'Runts, giants and everything legal between',
        `<p>Four size bands, four different behaviours, and two of them are silent.</p>
<ul>
<li><strong>Under 64 bytes — a runt.</strong> Dropped. Historically a collision remnant; today usually a failing NIC or a bad cable.</li>
<li><strong>64 to 1518 bytes — legal.</strong> Processed normally.</li>
<li><strong>1519 to 1522 — a baby giant.</strong> Legal only if the switch understands 802.1Q tags. Old gear drops these the day somebody enables trunking.</li>
<li><strong>Above 1522 — a giant.</strong> Dropped unless jumbo frames are enabled on <em>every</em> device along the path.</li>
</ul>
<p>Both ends of that range fail quietly: nothing is logged, only a counter moves. On IOS that is <code>show interfaces</code>; on Linux, <code>ip -s link</code>.</p>`,
        `<p>Bốn khoảng kích thước, bốn cách xử sự khác nhau, và hai trong số đó im lặng.</p>
<ul>
<li><strong>Dưới 64 byte — runt.</strong> Bị vứt. Ngày xưa là mảnh vụn của một vụ xung đột; ngày nay thường là card mạng sắp hỏng hoặc cáp lỗi.</li>
<li><strong>64 tới 1518 byte — hợp lệ.</strong> Xử lý bình thường.</li>
<li><strong>1519 tới 1522 — baby giant.</strong> Chỉ hợp lệ nếu switch hiểu thẻ 802.1Q. Thiết bị đời cũ sẽ vứt chúng đúng cái ngày có người bật trunking.</li>
<li><strong>Trên 1522 — giant.</strong> Bị vứt, trừ khi khung khổng lồ được bật trên <em>mọi</em> thiết bị dọc đường đi.</li>
</ul>
<p>Cả hai đầu của khoảng đó đều hỏng trong im lặng: không ghi log gì, chỉ một bộ đếm nhích lên. Trên IOS là <code>show interfaces</code>; trên Linux là <code>ip -s link</code>.</p>`],

      [5, 'What a MAC address is made of',
        `<p>Forty-eight bits, split exactly in half.</p>
<ul>
<li>The first 24 bits are the <strong>OUI</strong> — Organizationally Unique Identifier — bought from the IEEE by the manufacturer. <code>00:1A:2B</code> identifies a vendor, and you can look it up.</li>
<li>The last 24 bits are assigned by that vendor: 16.7 million addresses per OUI.</li>
<li>Written three ways — <code>00:1A:2B:3C:4D:5E</code>, <code>00-1A-2B-3C-4D-5E</code>, and Cisco's <code>001A.2B3C.4D5E</code>. Same address, three notations; Cisco's grouping of four is the one that trips people up.</li>
</ul>
<p>"Burned in" is only half true. The address is in the NIC's ROM, and every operating system can override it: <code>ip link set dev eth0 address ...</code>, one command, no reboot.</p>`,
        `<p>Bốn mươi tám bit, chia đôi đúng chính giữa.</p>
<ul>
<li>24 bit đầu là <strong>OUI</strong> — Organizationally Unique Identifier — do nhà sản xuất mua của IEEE. <code>00:1A:2B</code> chỉ đích danh một hãng, và bạn tra được.</li>
<li>24 bit cuối do chính hãng đó gán: 16,7 triệu địa chỉ cho mỗi OUI.</li>
<li>Viết được ba kiểu — <code>00:1A:2B:3C:4D:5E</code>, <code>00-1A-2B-3C-4D-5E</code>, và kiểu Cisco <code>001A.2B3C.4D5E</code>. Cùng một địa chỉ, ba lối viết; kiểu gộp bốn chữ số của Cisco là cái hay làm người ta rối.</li>
</ul>
<p>"Khắc cứng vào phần cứng" chỉ đúng một nửa. Địa chỉ nằm trong ROM của card, và hệ điều hành nào cũng ghi đè được: <code>ip link set dev eth0 address ...</code>, một lệnh, không cần khởi động lại.</p>`],

      [6, 'Two flag bits hiding in the first byte',
        `<p>The first byte of every MAC address carries two flags, and this is the answer to the opening question.</p>
<ul>
<li><strong>I/G bit</strong> — the <em>last</em> bit of the first byte. 0 means unicast, one recipient. 1 means multicast or broadcast. That is why <code>FF:FF:FF:FF:FF:FF</code> and <code>01:00:5E:...</code> both have an odd first byte.</li>
<li><strong>★ U/L bit</strong> — the bit just before it. 0 means the address came from an IEEE-assigned OUI. <strong>1 means locally administered</strong>: software invented it, and no registry is involved.</li>
</ul>
<p>Now look at <code>02:42:ac:11:00:02</code>, a Docker container. Hex 02 is binary 0000 00<strong>1</strong>0 — the U/L bit is set. Docker invented that address, legally, and the bit says so. The same is true of <code>52:54:00</code> (QEMU/KVM: hex 52 = 0101 00<strong>1</strong>0) and of every bonded or bridged interface you will ever create.</p>`,
        `<p>Byte đầu tiên của mọi địa chỉ MAC mang hai cái cờ, và đây chính là đáp án cho câu hỏi mở đầu.</p>
<ul>
<li><strong>Bit I/G</strong> — bit <em>cuối cùng</em> của byte đầu. Bằng 0 là unicast, một người nhận. Bằng 1 là multicast hoặc broadcast. Đó là lý do <code>FF:FF:FF:FF:FF:FF</code> và <code>01:00:5E:...</code> đều có byte đầu là số lẻ.</li>
<li><strong>★ Bit U/L</strong> — bit ngay trước nó. Bằng 0 nghĩa là địa chỉ đến từ một OUI do IEEE cấp. <strong>Bằng 1 nghĩa là do cục bộ tự đặt</strong>: phần mềm bịa ra nó, không sổ sách nào dính vào.</li>
</ul>
<p>Giờ nhìn <code>02:42:ac:11:00:02</code>, một container Docker. Hex 02 là nhị phân 0000 00<strong>1</strong>0 — bit U/L đang bật. Docker tự bịa ra địa chỉ đó, một cách hợp lệ, và cái bit nói ra điều ấy. Tương tự với <code>52:54:00</code> (QEMU/KVM: hex 52 = 0101 00<strong>1</strong>0) và với mọi giao diện bond hay bridge mà bạn sẽ tạo ra.</p>`],

      [7, 'Three kinds of destination',
        `<p>The destination MAC field answers "how many machines should read this?" — and there are exactly three answers.</p>
<ul>
<li><strong>Unicast</strong> — one specific address. The switch sends it out one port.</li>
<li><strong>Broadcast</strong> — <code>FF:FF:FF:FF:FF:FF</code>. Every host on the LAN must process it, and the switch floods it out every port. ARP is a broadcast, which is why a large flat LAN becomes slow: every ARP request interrupts every machine on it.</li>
<li><strong>Multicast</strong> — only the hosts that joined a group. IPv4 multicast maps to <code>01:00:5E</code> plus the last 23 bits of the IP address; IPv6 uses <code>33:33</code> plus the last 32 bits.</li>
</ul>
<p>The multicast mapping is worth knowing because it is lossy: several IPv4 multicast groups can map onto the same MAC, so a host may receive traffic for a group it never joined and must discard it in software.</p>`,
        `<p>Trường MAC đích trả lời câu "bao nhiêu máy nên đọc cái này?" — và chỉ có đúng ba đáp án.</p>
<ul>
<li><strong>Unicast</strong> — một địa chỉ cụ thể. Switch đẩy ra đúng một cổng.</li>
<li><strong>Broadcast</strong> — <code>FF:FF:FF:FF:FF:FF</code>. Mọi máy trên LAN đều phải xử lý, và switch tràn nó ra mọi cổng. ARP là broadcast, và đó là lý do một mạng LAN phẳng mà lớn thì chậm: mỗi lời hỏi ARP làm phiền mọi cái máy trong đó.</li>
<li><strong>Multicast</strong> — chỉ những máy đã tham gia một nhóm. Multicast IPv4 ánh xạ thành <code>01:00:5E</code> cộng 23 bit cuối của địa chỉ IP; IPv6 dùng <code>33:33</code> cộng 32 bit cuối.</li>
</ul>
<p>Phép ánh xạ multicast đáng biết vì nó làm mất thông tin: nhiều nhóm multicast IPv4 khác nhau có thể ánh xạ về cùng một MAC, nên một máy có thể nhận lưu lượng của nhóm nó chưa từng tham gia và phải tự vứt bỏ bằng phần mềm.</p>`],

      [8, 'A frame arrives: what the NIC decides',
        `<p>Before the operating system sees anything, the NIC has already made a decision, in hardware, in nanoseconds.</p>
<ol>
<li>Is the destination MAC <strong>mine</strong>? → accept, pass up to layer 3.</li>
<li>Is it a <strong>broadcast</strong>, or a multicast group I joined? → accept.</li>
<li>Otherwise → <strong>discard</strong>, silently. The CPU is never interrupted.</li>
</ol>
<p>The exception is <strong>promiscuous mode</strong>, where the NIC accepts everything. That is precisely what Wireshark enables in Lab 1.4 — and it also explains why a capture on a switched network shows you so little: promiscuous mode makes your NIC accept every frame that <em>reaches</em> it, and a switch only sends you your own. To capture other people's traffic you also need a monitor/SPAN port, which is a switch configuration, not a software setting.</p>`,
        `<p>Trước khi hệ điều hành kịp thấy gì, card mạng đã quyết định xong rồi, bằng phần cứng, trong vài nano giây.</p>
<ol>
<li>MAC đích có phải <strong>của tôi</strong> không? → nhận, đẩy lên tầng 3.</li>
<li>Có phải <strong>broadcast</strong>, hay một nhóm multicast tôi đã tham gia? → nhận.</li>
<li>Còn lại → <strong>vứt</strong>, lặng lẽ. CPU không hề bị làm phiền.</li>
</ol>
<p>Ngoại lệ là <strong>chế độ hỗn tạp (promiscuous)</strong>, khi card nhận tất. Đó đúng là thứ Wireshark bật lên trong Lab 1.4 — và nó cũng giải thích vì sao bắt gói trên mạng dùng switch lại thấy ít đến thế: chế độ hỗn tạp làm card bạn nhận mọi khung <em>tới được</em> nó, mà switch thì chỉ gửi cho bạn khung của chính bạn. Muốn bắt lưu lượng của người khác thì còn cần một cổng giám sát (SPAN), tức là một cấu hình trên switch, không phải một thiết lập phần mềm.</p>`],
    ]),

    bi(
      `<h3>🧠 Why it was designed this way</h3>
<p>Why does a MAC address have a flat, vendor-assigned structure while an IP address is hierarchical and location-based? Because they are solving opposite problems.</p>
<p>An IP address must be <strong>aggregatable</strong>: a router should be able to say "everything starting 203.0.113 goes that way" in one table entry. That requires the address to encode <em>where</em> you are, which means it must change when you move.</p>
<p>A MAC address must be <strong>unique without coordination</strong>: a factory in Shenzhen has to stamp addresses into NICs that will never collide with a factory in Taiwan, with no central runtime authority. The IEEE solves that by selling each vendor a 24-bit prefix once, and letting them manage the rest. The price of that scheme is that MAC addresses cannot be aggregated at all — which is exactly why a switch must learn every single address individually, and why a MAC table is finite and fills up.</p>
<p>So the two address systems are not redundant. They are the two halves of a deliberate trade: <em>global uniqueness without coordination</em> at layer 2, <em>global routability with small tables</em> at layer 3.</p>`,
      `<h3>🧠 Vì sao lại thiết kế như vậy</h3>
<p>Vì sao địa chỉ MAC lại có cấu trúc phẳng do hãng gán, còn địa chỉ IP thì phân cấp theo vị trí? Vì chúng giải hai bài toán ngược nhau.</p>
<p>Địa chỉ IP phải <strong>gộp lại được</strong>: một router cần nói được "mọi thứ bắt đầu bằng 203.0.113 thì đi lối này" chỉ trong một dòng bảng. Muốn vậy thì địa chỉ phải mã hoá <em>bạn đang ở đâu</em>, nghĩa là nó phải đổi khi bạn di chuyển.</p>
<p>Địa chỉ MAC thì phải <strong>duy nhất mà không cần bàn bạc với ai</strong>: một nhà máy ở Thâm Quyến phải dập địa chỉ vào card mạng sao cho không bao giờ trùng với nhà máy ở Đài Loan, mà không có cơ quan nào điều phối lúc chạy. IEEE giải bài đó bằng cách bán cho mỗi hãng một tiền tố 24 bit đúng một lần, rồi để họ tự lo phần còn lại. Cái giá của cách ấy là địa chỉ MAC hoàn toàn không gộp được — và đó chính là lý do switch buộc phải học từng địa chỉ một, và là lý do bảng MAC có giới hạn và có thể đầy.</p>
<p>Nên hai hệ địa chỉ này không hề thừa. Chúng là hai nửa của một cuộc đánh đổi có chủ ý: <em>duy nhất toàn cầu mà không cần điều phối</em> ở tầng 2, <em>định tuyến được toàn cầu với bảng nhỏ</em> ở tầng 3.</p>`,
    ),

    bi(
      `<h3>🔎 How to check this yourself</h3>
<p>Read the two flag bits on your own machine. This takes one minute and makes slide 6 permanent.</p>
<pre><code class="language-bash"># 1. List every MAC on this host, including the virtual ones
ip -br link
docker network inspect bridge --format '{{range .Containers}}{{.MacAddress}} {{end}}'  # if Docker is running

# 2. Decode the first byte of one of them
printf '%08d\\n' "$(echo "obase=2; ibase=16; 02" | bc)"     # 02 -> 00000010
printf '%08d\\n' "$(echo "obase=2; ibase=16; FF" | bc)"     # FF -> 11111111

# 3. Watch the NIC's own filter at work
ip maddr show dev eth0        # which multicast MACs this interface accepts</code></pre>
<p>How to read it:</p>
<pre><code class="language-plaintext">first byte 00000010 (hex 02)  -> last bit 0 = unicast
                                 second-last bit 1 = LOCALLY ADMINISTERED
                                 => software invented this address: a container or a VM
first byte 01010010 (hex 52)  -> same two bits: unicast, locally administered (QEMU/KVM)
first byte 11111111 (hex FF)  -> last bit 1 = broadcast; every host must read it
first byte 00000001 (hex 01)  -> last bit 1 = multicast (01:00:5E = IPv4 multicast)
first byte 00000000 (hex 00)  -> both 0: a real, IEEE-registered vendor address</code></pre>
<p>That answers the opening question. <strong>The U/L bit — the second-least-significant bit of the first byte.</strong> When it is 1 the address is locally administered, so no OUI purchase is required and no collision with a real vendor is possible, because the IEEE never issues an OUI with that bit set. Docker's <code>02:</code> and KVM's <code>52:</code> both have it.</p>`,
      `<h3>🔎 Cách tự kiểm</h3>
<p>Hãy đọc hai bit cờ đó trên chính máy bạn. Mất một phút và nó làm slide 6 dính vào đầu vĩnh viễn.</p>
<pre><code class="language-bash"># 1. Liệt kê mọi MAC trên máy này, kể cả MAC ảo
ip -br link
docker network inspect bridge --format '{{range .Containers}}{{.MacAddress}} {{end}}'  # nếu có Docker

# 2. Giải mã byte đầu của một trong số đó
printf '%08d\\n' "$(echo "obase=2; ibase=16; 02" | bc)"     # 02 -> 00000010
printf '%08d\\n' "$(echo "obase=2; ibase=16; FF" | bc)"     # FF -> 11111111

# 3. Nhìn bộ lọc của chính card mạng đang làm việc
ip maddr show dev eth0        # giao diện này đang nhận những MAC multicast nào</code></pre>
<p>Cách đọc:</p>
<pre><code class="language-plaintext">byte đầu 00000010 (hex 02)  -> bit cuối = 0 -> unicast
                               bit áp chót = 1 -> DO CỤC BỘ TỰ ĐẶT
                               => phần mềm bịa ra địa chỉ này: container hoặc máy ảo
byte đầu 01010010 (hex 52)  -> vẫn hai bit đó: unicast, cục bộ tự đặt (QEMU/KVM)
byte đầu 11111111 (hex FF)  -> bit cuối = 1 -> broadcast; mọi máy phải đọc
byte đầu 00000001 (hex 01)  -> bit cuối = 1 -> multicast (01:00:5E = multicast IPv4)
byte đầu 00000000 (hex 00)  -> cả hai bit = 0: địa chỉ thật của một hãng có đăng ký IEEE</code></pre>
<p>Đó là đáp án câu hỏi mở đầu. <strong>Bit U/L — bit áp chót của byte đầu tiên.</strong> Khi nó bằng 1 thì địa chỉ là do cục bộ tự đặt, nên không cần mua OUI và cũng không thể trùng với hãng thật, bởi IEEE không bao giờ cấp OUI có bit đó bật. Docker với <code>02:</code> và KVM với <code>52:</code> đều có nó.</p>`,
    ),

    bi(
      `<h3>⚠️ Traps people actually fall into</h3>
<ol>
<li><strong>Trusting a MAC address to identify a machine.</strong> <em>Symptom:</em> a licence, an access rule or an audit log keyed on MAC. One command changes it, and every virtual machine invents its own anyway. MAC identifies an interface <em>for convenience</em>, never for security or accounting.</li>
<li><strong>Reading Cisco's four-digit grouping as a different address.</strong> <em>Symptom:</em> "the switch shows 001a.2b3c.4d5e but the PC shows 00:1A:2B:3C:4D:5E — they do not match". They are identical. Cisco groups in fours, everyone else in twos.</li>
<li><strong>Counting the preamble as part of the frame.</strong> <em>Symptom:</em> answers that are 8 bytes too large. The preamble and SFD are physical-layer synchronisation, outside the frame and outside the FCS.</li>
<li><strong>Expecting Wireshark to show other people's traffic on a switch.</strong> <em>Symptom:</em> "promiscuous mode is on but I only see my own packets". Correct — the switch is doing its job. You need a SPAN/monitor port on the switch, or you are on a hub, which no longer exists.</li>
<li><strong>Thinking a padded frame contains your data.</strong> <em>Symptom:</em> confusion when a 20-byte payload appears as 46 bytes in a capture. The NIC padded it with zeros to meet the minimum; the padding is not sent by any application and carries nothing.</li>
</ol>`,
      `<h3>⚠️ Bẫy hay mắc</h3>
<ol>
<li><strong>Tin địa chỉ MAC để nhận diện một cái máy.</strong> <em>Triệu chứng:</em> một cái giấy phép, một luật truy cập hay một sổ kiểm toán lấy MAC làm khoá. Một câu lệnh là đổi được, mà máy ảo thì cái nào cũng tự bịa ra MAC của nó. MAC nhận diện một giao diện <em>cho tiện</em>, không bao giờ để làm bảo mật hay tính sổ.</li>
<li><strong>Đọc lối gộp bốn chữ số của Cisco thành một địa chỉ khác.</strong> <em>Triệu chứng:</em> "switch hiện 001a.2b3c.4d5e mà máy tính hiện 00:1A:2B:3C:4D:5E — hai cái không khớp". Chúng giống hệt nhau. Cisco gộp bốn, còn mọi nơi khác gộp hai.</li>
<li><strong>Tính preamble vào cái khung.</strong> <em>Triệu chứng:</em> đáp án thừa ra 8 byte. Preamble và SFD là phần đồng bộ của tầng vật lý, nằm ngoài khung và nằm ngoài FCS.</li>
<li><strong>Mong Wireshark cho xem lưu lượng của người khác trên mạng switch.</strong> <em>Triệu chứng:</em> "bật chế độ hỗn tạp rồi mà chỉ thấy gói của mình". Đúng vậy — switch đang làm đúng việc của nó. Bạn cần một cổng SPAN trên switch, hoặc bạn đang ngồi trên hub, thứ đã tuyệt chủng.</li>
<li><strong>Tưởng phần chèn thêm cũng là dữ liệu của mình.</strong> <em>Triệu chứng:</em> bối rối khi thấy phần tải 20 byte lại hiện thành 46 byte trong bản bắt gói. Card mạng đã chèn số 0 cho đủ mức tối thiểu; phần chèn đó không do ứng dụng nào gửi và không mang gì cả.</li>
</ol>`,
    ),

    bi(
      `<h3>✍️ Exercises — with full answers</h3>
<p><strong>1.</strong> Classify each destination MAC and say how a switch treats it: (a) <code>FF:FF:FF:FF:FF:FF</code>, (b) <code>01:00:5E:00:00:FB</code>, (c) <code>00:1A:2B:3C:4D:5E</code>, (d) <code>02:42:AC:11:00:02</code>.</p>
<p><strong>2.</strong> A capture shows a frame with Type = <code>0x0806</code> and a payload of 46 bytes, 18 of which are zeros at the end. What protocol is it, and why are those zeros there?</p>
<p><strong>3.</strong> Why does the Ethernet header put the destination address before the source address, when every other protocol you have met does the opposite?</p>
<p><strong>4. ★</strong> You need 300 unique MAC addresses for a test lab, and you cannot buy an OUI. How do you generate them safely, and which bit guarantees you will not collide with a real device?</p>
<details><summary>Answers</summary>
<p><strong>1.</strong> (a) Broadcast — flooded out every port except the source. (b) Multicast, and specifically mDNS (IPv4 group 224.0.0.251) — flooded like a broadcast unless the switch does IGMP snooping. (c) Unicast, globally unique (both flag bits 0) — forwarded out one port, or flooded once if not yet learned. (d) Unicast, <em>locally administered</em> (hex 02 = 0000 0010, U/L = 1) — treated exactly like (c) by the switch; the U/L bit changes nothing about forwarding, it only tells you a human or a program chose the address.</p>
<p><strong>2.</strong> Type 0x0806 is <strong>ARP</strong>. An ARP packet is only 28 bytes, which is below the 46-byte minimum payload, so the NIC padded it with 18 zero bytes to make the frame reach the 64-byte floor. This is the most common padded frame you will ever see.</p>
<p><strong>3.</strong> So that a switch can start making its forwarding decision after reading only the first six bytes of the frame, instead of waiting for twelve. That is the whole basis of cut-through switching — and it survives even on store-and-forward hardware because the lookup can begin while the rest of the frame is still arriving.</p>
<p><strong>4. ★</strong> Generate random addresses with the <strong>U/L bit set to 1</strong> and the I/G bit set to 0 — in practice, make the first byte <code>02</code>, <code>06</code>, <code>0A</code> or <code>0E</code>, then randomise the remaining five bytes. The U/L bit is the guarantee: the IEEE never issues an OUI with that bit set, so a locally administered address cannot collide with any manufactured device, only with another locally administered one. This is exactly what Docker and KVM do.</p>
</details>`,
      `<h3>✍️ Bài tập — có lời giải đầy đủ</h3>
<p><strong>1.</strong> Phân loại từng MAC đích và nói switch xử sự thế nào với nó: (a) <code>FF:FF:FF:FF:FF:FF</code>, (b) <code>01:00:5E:00:00:FB</code>, (c) <code>00:1A:2B:3C:4D:5E</code>, (d) <code>02:42:AC:11:00:02</code>.</p>
<p><strong>2.</strong> Bản bắt gói cho thấy một khung có Type = <code>0x0806</code> và phần tải 46 byte, trong đó 18 byte cuối là số 0. Đó là giao thức gì, và mấy con số 0 kia ở đâu ra?</p>
<p><strong>3.</strong> Vì sao phần đầu Ethernet đặt địa chỉ đích trước địa chỉ nguồn, trong khi mọi giao thức khác bạn từng gặp đều làm ngược lại?</p>
<p><strong>4. ★</strong> Bạn cần 300 địa chỉ MAC không trùng nhau cho một phòng thí nghiệm thử nghiệm, và bạn không thể mua OUI. Sinh chúng ra thế nào cho an toàn, và bit nào bảo đảm bạn không đụng phải thiết bị thật?</p>
<details><summary>Lời giải</summary>
<p><strong>1.</strong> (a) Broadcast — tràn ra mọi cổng trừ cổng nhận. (b) Multicast, cụ thể là mDNS (nhóm IPv4 224.0.0.251) — bị tràn như broadcast, trừ khi switch có bật IGMP snooping. (c) Unicast, duy nhất toàn cầu (cả hai bit cờ bằng 0) — chuyển ra một cổng, hoặc tràn đúng một lần nếu chưa học được. (d) Unicast, <em>do cục bộ tự đặt</em> (hex 02 = 0000 0010, U/L = 1) — switch xử sự y hệt câu (c); bit U/L không đổi gì về việc chuyển tiếp, nó chỉ cho bạn biết địa chỉ này do người hoặc phần mềm chọn.</p>
<p><strong>2.</strong> Type 0x0806 là <strong>ARP</strong>. Một gói ARP chỉ 28 byte, dưới mức tải tối thiểu 46 byte, nên card mạng chèn thêm 18 byte số 0 cho khung đạt sàn 64 byte. Đây là cái khung có phần chèn mà bạn sẽ gặp nhiều nhất.</p>
<p><strong>3.</strong> Để switch có thể bắt đầu ra quyết định chuyển tiếp ngay sau khi đọc sáu byte đầu, thay vì phải chờ mười hai byte. Đó là toàn bộ cơ sở của chuyển mạch cut-through — và nó vẫn có ích trên phần cứng store-and-forward, vì việc tra bảng có thể bắt đầu trong lúc phần còn lại của khung vẫn đang tới.</p>
<p><strong>4. ★</strong> Sinh địa chỉ ngẫu nhiên với <strong>bit U/L bằng 1</strong> và bit I/G bằng 0 — trên thực tế là đặt byte đầu là <code>02</code>, <code>06</code>, <code>0A</code> hoặc <code>0E</code>, rồi random năm byte còn lại. Bit U/L chính là lời bảo đảm: IEEE không bao giờ cấp OUI có bit đó bật, nên một địa chỉ cục bộ tự đặt không thể trùng với thiết bị sản xuất nào, chỉ có thể trùng với một địa chỉ cục bộ khác. Docker và KVM làm đúng như vậy.</p>
</details>`,
    ),

    cq(17, [
      ['CQ6.1', 'How does MAC protocol in the data link layer supports communication across networks?',
       'Giao thức MAC ở tầng liên kết dữ liệu hỗ trợ việc liên lạc xuyên qua các mạng như thế nào?'],
    ]),

    bi(
      `<h3>💡 A way into CQ6.1</h3>
<p>The question contains a deliberate tension: MAC addressing is <em>local</em>, yet the question asks how it supports communication <em>across</em> networks. Both halves are true, and the answer is the hand-off.</p>
<ul>
<li>Within one network, MAC addressing delivers the frame to the right neighbour, and media access control decides when it may be sent.</li>
<li>Across networks, MAC does not travel — it <strong>terminates at the router</strong>. The router strips the frame, reads the packet, and builds a new frame with new MAC addresses for the next link.</li>
<li>So MAC supports communication across networks precisely by <em>not</em> attempting it: it delivers each hop reliably to the next router, and hands the routing decision to layer 3. Without that division, every router on Earth would need a table of every NIC on Earth.</li>
</ul>`,
      `<h3>💡 Một lối vào cho CQ6.1</h3>
<p>Câu hỏi có một mâu thuẫn cố ý: đánh địa chỉ MAC là chuyện <em>cục bộ</em>, vậy mà câu hỏi lại hỏi nó hỗ trợ liên lạc <em>xuyên qua</em> các mạng ra sao. Cả hai vế đều đúng, và câu trả lời nằm ở chỗ bàn giao.</p>
<ul>
<li>Trong một mạng, đánh địa chỉ MAC đưa khung tới đúng người hàng xóm, còn điều khiển truy cập môi trường quyết định lúc nào được gửi.</li>
<li>Xuyên qua các mạng thì MAC không đi theo — nó <strong>dừng lại ở router</strong>. Router lột khung ra, đọc gói tin, rồi dựng một cái khung mới với cặp MAC mới cho đường link kế tiếp.</li>
<li>Vậy nên MAC hỗ trợ liên lạc xuyên mạng chính bằng cách <em>không</em> cố làm việc đó: nó giao trọn từng chặng tới router kế tiếp, và trao quyết định định tuyến cho tầng 3. Không có cách chia việc đó thì mọi router trên Trái Đất phải giữ bảng của mọi card mạng trên Trái Đất.</li>
</ul>`,
    ),
  ].join('\n'),
};

/* ──────────────────────── Lesson 6.2 — session 18 ──────────────────────── */

const L2 = {
  title: '6.2 — The MAC address table, switch speeds and forwarding (FLM session 18)|||6.2 — Bảng địa chỉ MAC, tốc độ switch và cách chuyển tiếp (buổi 18 của FLM)',
  slug: 'nwc204-6-2-bang-mac-va-cach-switch-chuyen-tiep',
  type: 'DOCUMENT',
  description: 'Buổi 18: switch học từ địa chỉ nguồn và quyết định theo địa chỉ đích, bảng MAC đầy lên từng khung một, ba hành vi forward/flood/filter, thời gian lão hoá 300 giây, miền xung đột khác miền quảng bá, store-and-forward so với cut-through, bộ đệm, tốc độ/duplex/auto-MDIX, và tấn công làm tràn bảng MAC.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 6 · Lesson 6.2 · FLM session 18 of 60 · CLO2, CLO4, CLO9 · Cisco Module 7</span>
<h2>How a switch knows anything at all</h2>
<p class="lead">Nobody configures a switch's MAC address table. It arrives empty and learns everything by watching traffic go past. This lesson is that learning process, and the three decisions it enables.</p>
<p><strong>Opening question:</strong> you unplug a laptop from port Fa0/3 and plug it into Fa0/7. If the user immediately opens a web page, everything works within a second. If the laptop sits silent, traffic sent to it can keep failing for up to <strong>five minutes</strong>. Where does that five minutes come from, and why does sending something fix it instantly?</p>`,
      `<span class="eyebrow">NWC204 · Chương 6 · Bài 6.2 · Buổi 18/60 của FLM · CLO2, CLO4, CLO9 · Cisco Module 7</span>
<h2>Vì sao switch biết được bất cứ điều gì</h2>
<p class="lead">Không ai đi cấu hình bảng địa chỉ MAC của switch cả. Nó sinh ra là rỗng và học hết mọi thứ bằng cách ngồi nhìn lưu lượng chạy qua. Bài này chính là quá trình học đó, và ba quyết định mà nó cho phép.</p>
<p><strong>Câu hỏi mở đầu:</strong> bạn rút laptop khỏi cổng Fa0/3 và cắm sang Fa0/7. Nếu người dùng mở ngay một trang web thì mọi thứ chạy lại trong vòng một giây. Còn nếu cái laptop nằm im không nói gì, lưu lượng gửi tới nó có thể hỏng tiếp tới <strong>năm phút</strong>. Con số năm phút đó ở đâu ra, và vì sao chỉ cần gửi đi một thứ gì đó là hết ngay?</p>`,
    ),

    walkHead('nwc204-ch06', 9, 18,
      'Slides 9–18 cover FLM session 18: 6.3 The MAC Address Table and 6.4 Switch Speeds and Forwarding Methods, plus one ★ slide on what happens when the table is deliberately filled.',
      'Slide 9–18 là buổi 18 của FLM: 6.3 The MAC Address Table và 6.4 Switch Speeds and Forwarding Methods, cộng một slide ★ về chuyện gì xảy ra khi bảng bị cố tình làm cho đầy.'),

    walk('nwc204-ch06', [
      [9, 'How a switch learns, in one rule',
        `<p>Four steps, and the whole of switching is inside them.</p>
<ol>
<li>A frame arrives on port Fa0/1 with <strong>source</strong> MAC aa:aa.</li>
<li>The switch writes <strong>aa:aa → Fa0/1</strong> into its table. It has just learned where aa:aa lives.</li>
<li>It then looks up the <strong>destination</strong> MAC in that same table.</li>
<li>Found → send out that one port. Not found → send out every port except the one it arrived on.</li>
</ol>
<p>Say the key sentence out loud until it sticks: <strong>a switch learns from the source address and decides on the destination address</strong>. Two different fields of the same frame, two entirely different jobs. Almost every switching question you will be asked is testing whether you have those two straight.</p>`,
        `<p>Bốn bước, và toàn bộ chuyện chuyển mạch nằm gọn trong đó.</p>
<ol>
<li>Một khung tới cổng Fa0/1 với MAC <strong>nguồn</strong> là aa:aa.</li>
<li>Switch ghi <strong>aa:aa → Fa0/1</strong> vào bảng của nó. Nó vừa học được aa:aa ở đâu.</li>
<li>Rồi nó tra MAC <strong>đích</strong> trong chính cái bảng đó.</li>
<li>Tìm thấy → đẩy ra đúng cổng ấy. Không thấy → đẩy ra mọi cổng trừ cổng vừa nhận.</li>
</ol>
<p>Hãy đọc to câu chìa khoá này tới khi nó dính vào đầu: <strong>switch học từ địa chỉ nguồn và quyết định theo địa chỉ đích</strong>. Hai trường khác nhau của cùng một cái khung, hai công việc hoàn toàn khác nhau. Gần như mọi câu hỏi về chuyển mạch mà bạn sẽ gặp đều đang kiểm tra xem bạn có phân biệt rành hai cái đó không.</p>`],

      [10, 'The table filling up, frame by frame',
        `<p>Follow one conversation from an empty table. PC-A (aa:aa) is on Fa0/1, PC-B (bb:bb) is on Fa0/2.</p>
<ul>
<li><strong>A sends the first frame to B.</strong> The switch learns aa:aa → Fa0/1, then looks up bb:bb, finds nothing, and <strong>floods</strong> the frame out every other port. Every machine on the LAN receives it; all except B discard it in hardware.</li>
<li><strong>B replies.</strong> Now the switch learns bb:bb → Fa0/2, looks up aa:aa, finds it, and <strong>forwards</strong> to Fa0/1 only.</li>
<li><strong>Everything after that</strong> goes port-to-port. No other machine sees any of it.</li>
</ul>
<p>So exactly <em>one</em> frame per conversation is ever flooded, and only in one direction. This is the entire difference between a switch and a hub, and it is why a switched LAN scales.</p>`,
        `<p>Hãy theo dõi một cuộc trò chuyện, bắt đầu từ bảng rỗng. PC-A (aa:aa) ở Fa0/1, PC-B (bb:bb) ở Fa0/2.</p>
<ul>
<li><strong>A gửi khung đầu tiên cho B.</strong> Switch học aa:aa → Fa0/1, rồi tra bb:bb, không thấy gì, và <strong>tràn</strong> cái khung ra mọi cổng còn lại. Mọi máy trong LAN đều nhận được; tất cả trừ B đều vứt nó đi bằng phần cứng.</li>
<li><strong>B trả lời.</strong> Lúc này switch học bb:bb → Fa0/2, tra aa:aa, thấy rồi, và <strong>chuyển tiếp</strong> chỉ tới Fa0/1.</li>
<li><strong>Mọi thứ sau đó</strong> đi thẳng cổng sang cổng. Không máy nào khác nhìn thấy gì nữa.</li>
</ul>
<p>Vậy là đúng <em>một</em> khung mỗi cuộc trò chuyện bị tràn, và chỉ theo một chiều. Đây là toàn bộ khác biệt giữa switch và hub, và là lý do mạng LAN dùng switch mở rộng được.</p>`],

      [11, 'Forward, flood, filter',
        `<p>Three verbs, and a switch does nothing else.</p>
<ul>
<li><strong>FORWARD</strong> — the destination is in the table, on a different port. Send it out that port alone.</li>
<li><strong>FLOOD</strong> — the destination is a broadcast, a multicast, or an unknown unicast. Send it out every port except the source. Note that the switch cannot tell an unknown unicast from a broadcast: both mean "I do not know who wants this", and both get the same treatment.</li>
<li><strong>FILTER</strong> — the destination is in the table on the <em>same</em> port the frame arrived on. Drop it: both machines are on that side already, and they heard each other directly.</li>
</ul>
<p>Filtering is the quiet one, and it is what lets you chain switches together without every conversation being copied across the uplink.</p>`,
        `<p>Ba động từ, và switch không làm gì khác ngoài chúng.</p>
<ul>
<li><strong>FORWARD — chuyển tiếp</strong> — đích có trong bảng, ở một cổng khác. Đẩy ra đúng mỗi cổng đó.</li>
<li><strong>FLOOD — tràn</strong> — đích là broadcast, multicast, hoặc unicast chưa biết. Đẩy ra mọi cổng trừ cổng nguồn. Chú ý switch không phân biệt được unicast chưa biết với broadcast: cả hai đều nghĩa là "tôi không biết ai cần cái này", và cả hai bị xử như nhau.</li>
<li><strong>FILTER — lọc bỏ</strong> — đích có trong bảng nhưng lại ở <em>đúng</em> cái cổng mà khung vừa tới. Vứt đi: hai máy đó đã ở cùng một phía rồi, chúng nghe thấy nhau trực tiếp.</li>
</ul>
<p>Lọc bỏ là động tác thầm lặng nhất, và nó là thứ cho phép bạn nối switch nọ vào switch kia mà không phải chép mọi cuộc trò chuyện qua đường uplink.</p>`],

      [12, 'Aging: the table forgets on purpose',
        `<p><code>show mac address-table</code> is the single most useful command on a switch. Read the output carefully:</p>
<ul>
<li><strong>Vlan</strong> — the table is per-VLAN, which matters from Chapter 6 onwards.</li>
<li><strong>DYNAMIC</strong> — learned from traffic, and subject to aging.</li>
<li><strong>STATIC</strong> — configured by hand or created by port-security. Never ages out.</li>
<li><strong>Aging time: 300 seconds</strong> — a dynamic entry that has seen no traffic for five minutes is deleted.</li>
</ul>
<p>Why forget at all? Because devices move. If entries were permanent, unplugging a laptop and moving it to another port would break it until a human intervened. Forgetting after five minutes makes the network self-correcting — at the cost of a little flooding whenever a quiet device is addressed after a long silence.</p>`,
        `<p><code>show mac address-table</code> là câu lệnh hữu dụng nhất trên một con switch. Hãy đọc kỹ kết xuất:</p>
<ul>
<li><strong>Vlan</strong> — bảng này tính theo từng VLAN, điều sẽ quan trọng từ chương 6 trở đi.</li>
<li><strong>DYNAMIC</strong> — học được từ lưu lượng, và chịu sự lão hoá.</li>
<li><strong>STATIC</strong> — do người đặt tay hoặc do port-security tạo ra. Không bao giờ hết hạn.</li>
<li><strong>Aging time: 300 giây</strong> — một dòng động mà năm phút không thấy lưu lượng nào là bị xoá.</li>
</ul>
<p>Sao lại phải quên? Vì thiết bị có di chuyển. Nếu các dòng là vĩnh viễn thì rút laptop cắm sang cổng khác sẽ làm nó chết cho tới khi có người can thiệp. Quên sau năm phút làm cho mạng tự sửa được — đổi lại là hơi bị tràn một chút mỗi khi có ai gọi tới một thiết bị vừa im lặng lâu.</p>`],

      [13, 'Collision domain is not broadcast domain',
        `<p>Two terms that sound similar, mean different things, and are worth more exam marks than almost anything else in this chapter.</p>
<ul>
<li><strong>Collision domain</strong> — a set of devices whose transmissions could collide. On a switch, <em>every port is its own collision domain</em>. A 24-port switch has 24 of them, each full duplex, so collisions simply never occur.</li>
<li><strong>Broadcast domain</strong> — a set of devices that receive each other's broadcasts. That is one per VLAN, and it spans <em>every switch you cable together</em>.</li>
</ul>
<p><strong>Only a router splits a broadcast domain.</strong> A switch multiplies collision domains and does absolutely nothing to broadcasts — it floods them by design. So three switches chained together is <em>one</em> broadcast domain with 72 collision domains, and adding a fourth switch does not help the broadcast problem at all.</p>`,
        `<p>Hai thuật ngữ nghe na ná nhau, nghĩa khác hẳn nhau, và đáng điểm thi hơn gần như mọi thứ khác trong chương này.</p>
<ul>
<li><strong>Miền xung đột</strong> — tập các thiết bị mà tín hiệu của chúng có thể đụng nhau. Trên switch, <em>mỗi cổng là một miền xung đột riêng</em>. Switch 24 cổng có 24 miền, mỗi miền song công đầy đủ, nên xung đột đơn giản là không xảy ra.</li>
<li><strong>Miền quảng bá</strong> — tập các thiết bị nhận được broadcast của nhau. Cái này tính theo từng VLAN, và nó trải khắp <em>mọi con switch bạn nối dây với nhau</em>.</li>
</ul>
<p><strong>Chỉ router mới chia được miền quảng bá.</strong> Switch nhân miền xung đột lên và hoàn toàn không làm gì với broadcast — nó tràn broadcast là do thiết kế. Nên ba con switch nối với nhau là <em>một</em> miền quảng bá với 72 miền xung đột, và cắm thêm con thứ tư chẳng giúp gì cho vấn đề broadcast cả.</p>`],

      [14, 'Two ways to forward a frame',
        `<p>The choice is when to start sending: after the whole frame, or after just enough of it.</p>
<ul>
<li><strong>Store-and-forward</strong> — receive all 1518 bytes, verify the FCS, then forward. Latency grows with frame size, and a corrupt frame <em>stops here</em>. Required whenever the two ports run at different speeds, and required for QoS, because you cannot prioritise what you have not read.</li>
<li><strong>Cut-through (fast-forward)</strong> — read the 6-byte destination MAC and start forwarding immediately, while the rest of the frame is still arriving. Lowest possible latency, and a corrupt frame is passed straight on, because nobody checked the FCS.</li>
<li><strong>Fragment-free</strong> — a compromise: wait for the first 64 bytes, the collision window, then forward. It catches runts but nothing else.</li>
</ul>
<p>Cisco Catalyst switches today are store-and-forward only. Cut-through survives in specialist fabrics where a few microseconds are worth real money.</p>`,
        `<p>Lựa chọn nằm ở chỗ bắt đầu gửi lúc nào: sau khi có cả khung, hay chỉ sau khi có vừa đủ.</p>
<ul>
<li><strong>Store-and-forward — chứa rồi chuyển</strong> — nhận đủ cả 1518 byte, kiểm FCS, rồi mới chuyển. Độ trễ tăng theo cỡ khung, và khung hỏng thì <em>dừng lại ở đây</em>. Bắt buộc phải dùng khi hai cổng chạy khác tốc độ, và bắt buộc khi có QoS, vì bạn không thể ưu tiên thứ mình chưa đọc.</li>
<li><strong>Cut-through (fast-forward) — cắt ngang</strong> — đọc 6 byte MAC đích rồi chuyển tiếp ngay, trong lúc phần còn lại của khung vẫn đang tới. Độ trễ thấp nhất có thể, và khung hỏng thì được chuyển thẳng đi, vì chẳng ai kiểm FCS cả.</li>
<li><strong>Fragment-free</strong> — dung hoà: chờ 64 byte đầu, tức hết cửa sổ xung đột, rồi chuyển. Nó bắt được runt và không bắt được gì khác.</li>
</ul>
<p>Switch Catalyst của Cisco ngày nay chỉ có store-and-forward. Cut-through còn sống trong các hệ chuyên dụng, nơi vài micro giây đáng tiền thật.</p>`],

      [15, 'Which method, and what it costs',
        `<p>The table is the whole trade-off on one page. Two rows deserve attention.</p>
<ul>
<li><strong>"Checks the FCS"</strong> — this is the real difference. Store-and-forward stops corruption at the switch; cut-through propagates it to every downstream device, which then discards it. On a clean network that costs nothing; on a network with a failing cable, cut-through spreads the damage.</li>
<li><strong>"Any speed change between ports"</strong> — if a 1 Gbps port feeds a 100 Mbps port, cut-through is physically impossible: the bits arrive faster than they can leave, so they must be buffered. This is why any switch with mixed port speeds is store-and-forward whether it wants to be or not.</li>
</ul>
<p>So the modern answer is: <strong>store-and-forward, unless you have a specific reason measured in microseconds</strong>.</p>`,
        `<p>Cái bảng này là toàn bộ cuộc đánh đổi gói trong một trang. Hai dòng đáng để ý.</p>
<ul>
<li><strong>"Có kiểm FCS không"</strong> — đây mới là khác biệt thật. Store-and-forward chặn hỏng hóc ngay tại switch; cut-through lan nó xuống mọi thiết bị phía sau, rồi chúng mới vứt đi. Trên mạng sạch thì điều đó không tốn gì; trên mạng có một sợi cáp sắp hỏng thì cut-through làm thiệt hại lan ra.</li>
<li><strong>"Hai cổng khác tốc độ"</strong> — nếu cổng 1 Gbps đổ vào cổng 100 Mbps thì cut-through là bất khả thi về mặt vật lý: bit tới nhanh hơn tốc độ đi ra, nên buộc phải chứa tạm. Vì thế bất kỳ switch nào có nhiều tốc độ cổng khác nhau đều là store-and-forward, dù nó có muốn hay không.</li>
</ul>
<p>Nên câu trả lời thời nay là: <strong>store-and-forward, trừ khi bạn có một lý do cụ thể đo bằng micro giây</strong>.</p>`],

      [16, 'Memory buffering: where a frame waits',
        `<p>A frame that cannot leave immediately has to be stored somewhere, and there are two designs.</p>
<ul>
<li><strong>Port-based memory</strong> — each port owns a queue. Simple, and it suffers <em>head-of-line blocking</em>: if the frame at the front of a queue is waiting for a congested destination port, everything behind it waits too, even frames destined for idle ports.</li>
<li><strong>Shared memory</strong> — one common pool. A frame is stored once and linked to whichever port needs it. Better for mixed speeds, and it is what almost all modern switches use.</li>
</ul>
<p>Buffering exists because speeds differ and because two sources can target one destination at once. When the buffer fills, frames are dropped — and this is the commonest cause of packet loss inside a LAN that looks entirely healthy: every link is up, no errors anywhere, and yet TCP is retransmitting.</p>`,
        `<p>Một cái khung chưa đi ra được ngay thì phải chứa ở đâu đó, và có hai cách thiết kế.</p>
<ul>
<li><strong>Bộ đệm theo cổng</strong> — mỗi cổng có hàng đợi riêng. Đơn giản, và nó dính <em>nghẽn đầu hàng</em>: nếu cái khung đứng đầu hàng đang chờ một cổng đích đang tắc thì mọi khung phía sau cũng phải chờ, kể cả khung đi tới cổng đang rỗi.</li>
<li><strong>Bộ đệm dùng chung</strong> — một kho chung. Khung được chứa một lần rồi liên kết tới cổng nào cần nó. Tốt hơn khi tốc độ hỗn hợp, và gần như mọi switch hiện đại đều dùng cách này.</li>
</ul>
<p>Bộ đệm tồn tại vì tốc độ khác nhau và vì hai nguồn có thể cùng nhắm vào một đích. Khi bộ đệm đầy thì khung bị vứt — và đây là nguyên nhân mất gói phổ biến nhất bên trong một mạng LAN nhìn hoàn toàn khoẻ mạnh: link nào cũng up, không lỗi ở đâu, vậy mà TCP vẫn cứ gửi lại.</p>`],

      [17, 'Speed, duplex and auto-MDIX',
        `<p>Three interface settings, and the advice for all three is the same: <strong>leave them on auto</strong>.</p>
<ul>
<li><code>speed auto</code> and <code>duplex auto</code> are the defaults. In <code>show interfaces status</code>, the values appear as <strong>a-full</strong> and <strong>a-1000</strong> — the "a-" prefix means auto-negotiated. If you see <code>full</code> and <code>1000</code> without it, somebody forced them by hand, and you should find out why.</li>
<li><code>mdix auto</code> lets the port detect whether the cable is straight-through or crossover and rewire itself internally. It is the reason nobody carries crossover cables any more.</li>
</ul>
<p>Chapter 5 already showed what happens when one end is forced and the other is not: the negotiating end falls back to half duplex, late collisions appear, throughput collapses, and the link stays UP the whole time. Forcing one end is how that fault is created.</p>`,
        `<p>Ba thiết lập của giao diện, và lời khuyên cho cả ba là như nhau: <strong>để nguyên ở chế độ auto</strong>.</p>
<ul>
<li><code>speed auto</code> và <code>duplex auto</code> là mặc định. Trong <code>show interfaces status</code>, giá trị hiện ra là <strong>a-full</strong> và <strong>a-1000</strong> — tiền tố "a-" nghĩa là đã tự thương lượng. Nếu thấy <code>full</code> và <code>1000</code> mà không có nó thì có người đã ép tay, và bạn nên tìm hiểu vì sao.</li>
<li><code>mdix auto</code> cho phép cổng tự nhận biết dây là straight-through hay crossover rồi tự đấu lại bên trong. Đó là lý do không ai còn mang theo dây crossover nữa.</li>
</ul>
<p>Chương 5 đã cho thấy chuyện gì xảy ra khi một đầu bị ép còn đầu kia thì không: đầu đang thương lượng tụt về bán song công, late collision xuất hiện, thông lượng sập, mà đường link thì vẫn UP suốt. Ép cứng một đầu chính là cách tạo ra cái lỗi đó.</p>`],

      [18, '★ Filling the table on purpose: MAC flooding',
        `<p>★ Beyond Module 7, but it is the reason a MAC table has a documented maximum size, and the reason <code>switchport port-security</code> exists.</p>
<p><strong>The attack:</strong> a machine sends thousands of frames, each with a different invented source MAC. The switch dutifully learns every one. Once the table is full it can learn nothing new — and every destination it does not know gets <strong>flooded</strong>. The switch has been reduced to a hub, and the attacker now receives traffic meant for other people.</p>
<p><strong>The defence</strong> is to cap how many addresses a port may learn:</p>
<ul>
<li><code>switchport port-security maximum 2</code> — an access port normally needs one MAC, or two if there is an IP phone.</li>
<li><code>violation restrict</code> drops the offending frames and logs; <code>shutdown</code> disables the port entirely; <code>protect</code> drops silently.</li>
</ul>
<p>Note that this is the same mechanism as learning — you are not adding a new feature, you are putting a limit on the one the switch already had.</p>`,
        `<p>★ Ngoài Module 7, nhưng đây là lý do bảng MAC có một kích thước tối đa được ghi rõ trong tài liệu, và là lý do <code>switchport port-security</code> tồn tại.</p>
<p><strong>Cách tấn công:</strong> một cái máy gửi hàng nghìn khung, mỗi khung một MAC nguồn bịa ra khác nhau. Switch ngoan ngoãn học hết. Khi bảng đầy thì nó không học thêm được gì nữa — và mọi đích nó không biết đều bị <strong>tràn</strong>. Con switch đã bị hạ cấp thành cái hub, và kẻ tấn công giờ nhận được lưu lượng của người khác.</p>
<p><strong>Cách chống</strong> là chặn số địa chỉ mà một cổng được phép học:</p>
<ul>
<li><code>switchport port-security maximum 2</code> — một cổng truy cập bình thường cần một MAC, hoặc hai nếu có điện thoại IP.</li>
<li><code>violation restrict</code> vứt khung vi phạm và ghi log; <code>shutdown</code> tắt hẳn cổng; <code>protect</code> vứt trong im lặng.</li>
</ul>
<p>Để ý rằng đây vẫn là đúng cái cơ chế học đó — bạn không thêm tính năng mới nào, bạn chỉ đặt một giới hạn lên thứ switch vốn đã có.</p>`],
    ]),

    bi(
      `<h3>🗺️ The three decisions, as a diagram</h3>
<pre><code class="language-mermaid">graph TD
  F["Frame arrives<br/>on port X"] --> L["LEARN<br/>source MAC to port X"]
  L --> Q{"Destination MAC<br/>in the table?"}
  Q -->|"no, or broadcast"| FL["FLOOD<br/>all ports except X"]
  Q -->|"yes, another port"| FW["FORWARD<br/>that one port"]
  Q -->|"yes, port X itself"| FI["FILTER<br/>drop it"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class Q ask
  class F,L act
  class FW,FI ok
  class FL act</code></pre>
<p>Learning happens on <strong>every</strong> frame, before any decision. That is why sending anything at all from a moved device fixes the table instantly.</p>`,
      `<h3>🗺️ Ba quyết định, vẽ thành sơ đồ</h3>
<pre><code class="language-mermaid">graph TD
  F["Khung tới<br/>ở cổng X"] --> L["HỌC<br/>MAC nguồn gắn với cổng X"]
  L --> Q{"MAC đích có<br/>trong bảng không?"}
  Q -->|"không, hoặc broadcast"| FL["TRÀN<br/>mọi cổng trừ X"]
  Q -->|"có, ở cổng khác"| FW["CHUYỂN TIẾP<br/>đúng cổng đó"]
  Q -->|"có, chính cổng X"| FI["LỌC BỎ<br/>vứt đi"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class Q ask
  class F,L act
  class FW,FI ok
  class FL act</code></pre>
<p>Việc học diễn ra ở <strong>mọi</strong> khung, trước mọi quyết định. Đó là lý do chỉ cần thiết bị vừa chuyển chỗ gửi đi bất cứ thứ gì là bảng được sửa ngay lập tức.</p>`,
    ),

    bi(
      `<h3>🔎 How to check this yourself</h3>
<p>On Cisco IOS or Packet Tracer:</p>
<pre><code class="language-bash">show mac address-table                  # the whole table
show mac address-table dynamic          # learned entries only
show mac address-table aging-time       # 300 by default
show mac address-table count            # how full is it?
clear mac address-table dynamic         # empty it, then watch it refill
show interfaces status                  # a-full / a-1000 = negotiated
show interfaces Fa0/1 | include error|CRC|runt|giant</code></pre>
<p>On your own Linux server, where <code>docker0</code> is a real bridge:</p>
<pre><code class="language-bash">bridge fdb show br docker0              # the same table
bridge -s fdb show br docker0           # with the ageing timer per entry
cat /sys/class/net/docker0/bridge/ageing_time   # in hundredths of a second: 30000 = 300 s
sudo ip link set docker0 type bridge ageing_time 6000   # 60 s, for an experiment</code></pre>
<p>How to read it:</p>
<pre><code class="language-plaintext">one MAC per access port                 -> normal
MANY MACs on one port                   -> that port is an UPLINK to another switch
                                           or to a hypervisor. Not a fault.
a MAC appearing on two ports, flapping  -> a loop, or a duplicated MAC. This is a fault.
count near the platform maximum         -> investigate: either a very large VLAN,
                                           or somebody is flooding the table
aging_time 30000                        -> 300 seconds, the same default as Cisco</code></pre>
<p>That answers the opening question. The <strong>300-second aging timer</strong> is the five minutes: until it expires, the switch still believes the laptop is on Fa0/3 and keeps sending its traffic there, into nothing. The moment the laptop transmits anything at all — one ARP, one DNS query — the switch learns its source MAC on Fa0/7 and rewrites the entry immediately. Learning is instant; forgetting takes five minutes.</p>`,
      `<h3>🔎 Cách tự kiểm</h3>
<p>Trên Cisco IOS hoặc Packet Tracer:</p>
<pre><code class="language-bash">show mac address-table                  # cả bảng
show mac address-table dynamic          # chỉ những dòng học được
show mac address-table aging-time       # mặc định 300
show mac address-table count            # bảng đã đầy tới đâu?
clear mac address-table dynamic         # xoá sạch, rồi ngồi nhìn nó đầy lại
show interfaces status                  # a-full / a-1000 = đã thương lượng
show interfaces Fa0/1 | include error|CRC|runt|giant</code></pre>
<p>Trên chính máy chủ Linux của bạn, nơi <code>docker0</code> là một cái bridge thật:</p>
<pre><code class="language-bash">bridge fdb show br docker0              # vẫn là cái bảng đó
bridge -s fdb show br docker0           # kèm đồng hồ lão hoá của từng dòng
cat /sys/class/net/docker0/bridge/ageing_time   # đơn vị 1/100 giây: 30000 = 300 s
sudo ip link set docker0 type bridge ageing_time 6000   # 60 s, để thử nghiệm</code></pre>
<p>Cách đọc:</p>
<pre><code class="language-plaintext">mỗi cổng truy cập một MAC               -> bình thường
NHIỀU MAC trên cùng một cổng            -> cổng đó là đường UPLINK sang switch khác
                                           hoặc sang một máy chủ ảo hoá. Không phải lỗi.
một MAC nhảy qua nhảy lại hai cổng      -> có vòng lặp, hoặc MAC bị trùng. Đây LÀ lỗi.
count gần chạm trần của thiết bị        -> phải soi: hoặc VLAN quá lớn thật,
                                           hoặc có kẻ đang làm tràn bảng
ageing_time 30000                       -> 300 giây, đúng bằng mặc định của Cisco</code></pre>
<p>Đó là đáp án câu hỏi mở đầu. <strong>Đồng hồ lão hoá 300 giây</strong> chính là năm phút đó: chừng nào nó chưa hết, switch vẫn tin cái laptop nằm ở Fa0/3 và cứ đẩy lưu lượng của nó về đấy, vào hư không. Ngay giây phút cái laptop phát đi bất cứ thứ gì — một gói ARP, một câu hỏi DNS — switch học được MAC nguồn của nó ở Fa0/7 và ghi đè dòng cũ ngay lập tức. Học thì tức thì; quên thì mất năm phút.</p>`,
    ),

    bi(
      `<h3>⚠️ Traps people actually fall into</h3>
<ol>
<li><strong>Believing a switch "knows" the network.</strong> <em>Symptom:</em> expecting a MAC table to list every device. A switch only knows what has <em>spoken</em> in the last five minutes. A powered-on machine that has sent nothing is invisible to it.</li>
<li><strong>Reading many MACs on one port as a fault.</strong> <em>Symptom:</em> panic at forty addresses on Gi0/1. That is an uplink to another switch, or a hypervisor with forty virtual machines. The table says <em>which direction</em>, never <em>how far</em>.</li>
<li><strong>Thinking a switch reduces broadcasts.</strong> <em>Symptom:</em> "we added switches and the broadcast storm is still there". Switches flood broadcasts by design. Only a router — or VLANs, which are routed between — divides a broadcast domain.</li>
<li><strong>Configuring static MAC entries to "make it faster".</strong> <em>Symptom:</em> a device stops working after it is moved or its NIC is replaced, and nobody remembers why. Dynamic learning is not slow; it costs one flooded frame per conversation.</li>
<li><strong>★ Enabling port-security with maximum 1 on a port with an IP phone.</strong> <em>Symptom:</em> the port shuts down the moment the PC behind the phone sends anything. A phone plus a PC is two MACs, sometimes three with a hypervisor; count before you set the limit.</li>
</ol>`,
      `<h3>⚠️ Bẫy hay mắc</h3>
<ol>
<li><strong>Tin rằng switch "biết" cả mạng.</strong> <em>Triệu chứng:</em> mong bảng MAC liệt kê mọi thiết bị. Switch chỉ biết những ai đã <em>lên tiếng</em> trong năm phút vừa rồi. Một cái máy đang bật mà chưa gửi gì thì nó không nhìn thấy.</li>
<li><strong>Coi việc nhiều MAC trên một cổng là lỗi.</strong> <em>Triệu chứng:</em> hoảng khi thấy bốn chục địa chỉ trên Gi0/1. Đó là đường uplink sang switch khác, hoặc một máy chủ ảo hoá có bốn chục máy ảo. Cái bảng nói <em>đi hướng nào</em>, không bao giờ nói <em>xa bao nhiêu</em>.</li>
<li><strong>Nghĩ switch làm giảm broadcast.</strong> <em>Triệu chứng:</em> "cắm thêm switch rồi mà bão broadcast vẫn còn". Switch tràn broadcast là do thiết kế. Chỉ router — hoặc VLAN, thứ phải định tuyến giữa các VLAN — mới chia được miền quảng bá.</li>
<li><strong>Đặt dòng MAC tĩnh cho "nó nhanh hơn".</strong> <em>Triệu chứng:</em> một thiết bị chết sau khi bị chuyển chỗ hoặc thay card mạng, và không ai còn nhớ vì sao. Học động không hề chậm; nó tốn đúng một khung bị tràn cho mỗi cuộc trò chuyện.</li>
<li><strong>★ Bật port-security với maximum 1 trên cổng có điện thoại IP.</strong> <em>Triệu chứng:</em> cổng tắt ngóm ngay khi cái PC nối sau điện thoại gửi gì đó. Điện thoại cộng PC là hai MAC, đôi khi ba nếu có máy ảo; hãy đếm trước khi đặt giới hạn.</li>
</ol>`,
    ),

    bi(
      `<h3>✍️ Exercises — with full answers</h3>
<p><strong>1.</strong> A switch's table is empty. PC-A (Fa0/1) pings PC-C (Fa0/3). Describe every frame that crosses the switch, in order, and say for each whether it was forwarded or flooded. Assume ARP is needed first.</p>
<p><strong>2.</strong> How many collision domains and how many broadcast domains are there in: two 24-port switches connected to each other by one cable, with a router on one port of switch 1?</p>
<p><strong>3.</strong> A switch port shows 40 dynamic MAC addresses while every other port shows one. Is this a fault? What single additional piece of information would settle it?</p>
<p><strong>4. ★</strong> Your Docker host runs 12 containers on one bridge. Predict what <code>bridge fdb show br docker0</code> will contain, and explain what would happen to container-to-container traffic if you set the bridge's ageing time to 1 second.</p>
<details><summary>Answers</summary>
<p><strong>1.</strong> (i) <em>ARP request</em> from A, destination FF:FF:FF:FF:FF:FF — the switch learns A → Fa0/1 and <strong>floods</strong> it, because it is a broadcast. (ii) <em>ARP reply</em> from C, unicast to A — the switch learns C → Fa0/3, finds A in the table, and <strong>forwards</strong> to Fa0/1 only. (iii) <em>ICMP echo request</em> A → C — <strong>forwarded</strong> to Fa0/3. (iv) <em>ICMP echo reply</em> C → A — <strong>forwarded</strong> to Fa0/1. So exactly one frame was flooded, and it was the ARP broadcast, not the unknown unicast — because ARP resolved the address before any unicast was sent.</p>
<p><strong>2.</strong> <strong>48 collision domains</strong> — one per port, and both ends of the inter-switch link are ports, as is the router port. <strong>One broadcast domain</strong> — assuming a single VLAN, the two switches form one flat LAN; the router is the boundary, and what lies beyond it is a different broadcast domain.</p>
<p><strong>3.</strong> Almost certainly <strong>not</strong> a fault: that port is an uplink. The one piece of information that settles it is <em>what is plugged into that port</em> — <code>show cdp neighbors</code> (or <code>lldp</code>) will name a switch, a router or a hypervisor. If it names nothing and the port is supposed to be an access port with one PC, then you have a rogue switch or a flooding attack, and that is the moment to look at port-security.</p>
<p><strong>4. ★</strong> It will contain roughly 12 dynamic entries with <code>02:42:ac:11:xx:xx</code> addresses, each on its own <code>veth</code> interface, plus the permanent entries for the bridge and the veths themselves. With an ageing time of 1 second, any container that pauses for more than a second is forgotten, so the next frame addressed to it is <strong>flooded to every other container</strong>. Nothing breaks — flooding still delivers — but every container now sees traffic meant for its neighbours, and CPU use rises. It is a neat demonstration that ageing is a performance and privacy setting, not a correctness one.</p>
</details>`,
      `<h3>✍️ Bài tập — có lời giải đầy đủ</h3>
<p><strong>1.</strong> Bảng của switch đang rỗng. PC-A (Fa0/1) ping PC-C (Fa0/3). Hãy mô tả từng cái khung đi qua switch, theo thứ tự, và với mỗi khung nói rõ nó được chuyển tiếp hay bị tràn. Giả sử phải hỏi ARP trước.</p>
<p><strong>2.</strong> Có bao nhiêu miền xung đột và bao nhiêu miền quảng bá trong trường hợp: hai switch 24 cổng nối với nhau bằng một sợi dây, và một router cắm vào một cổng của switch thứ nhất?</p>
<p><strong>3.</strong> Một cổng switch hiện 40 địa chỉ MAC động trong khi mọi cổng khác chỉ có một. Đây có phải lỗi không? Cần thêm đúng một thông tin nào để kết luận?</p>
<p><strong>4. ★</strong> Máy chủ Docker của bạn chạy 12 container trên một bridge. Hãy dự đoán <code>bridge fdb show br docker0</code> sẽ có gì, và giải thích chuyện gì xảy ra với lưu lượng giữa các container nếu bạn đặt thời gian lão hoá của bridge xuống 1 giây.</p>
<details><summary>Lời giải</summary>
<p><strong>1.</strong> (i) <em>ARP request</em> từ A, đích FF:FF:FF:FF:FF:FF — switch học A → Fa0/1 rồi <strong>tràn</strong>, vì đó là broadcast. (ii) <em>ARP reply</em> từ C, unicast gửi A — switch học C → Fa0/3, tìm thấy A trong bảng, và <strong>chuyển tiếp</strong> chỉ tới Fa0/1. (iii) <em>ICMP echo request</em> A → C — <strong>chuyển tiếp</strong> tới Fa0/3. (iv) <em>ICMP echo reply</em> C → A — <strong>chuyển tiếp</strong> tới Fa0/1. Vậy đúng một khung bị tràn, và đó là gói broadcast ARP chứ không phải một unicast chưa biết — vì ARP đã phân giải xong địa chỉ trước khi có unicast nào được gửi.</p>
<p><strong>2.</strong> <strong>48 miền xung đột</strong> — mỗi cổng một miền, và hai đầu của sợi dây nối hai switch cũng là cổng, cổng router cũng vậy. <strong>Một miền quảng bá</strong> — giả sử chỉ có một VLAN, hai con switch tạo thành một mạng LAN phẳng; router là ranh giới, và phía bên kia nó là một miền quảng bá khác.</p>
<p><strong>3.</strong> Gần như chắc chắn <strong>không</strong> phải lỗi: cổng đó là đường uplink. Thông tin duy nhất cần để kết luận là <em>cái gì đang cắm vào cổng đó</em> — <code>show cdp neighbors</code> (hoặc <code>lldp</code>) sẽ gọi tên một con switch, một router hay một máy chủ ảo hoá. Nếu nó không gọi được tên gì mà cổng đó lẽ ra là cổng truy cập chỉ có một PC, thì bạn đang có một con switch lạ hoặc một vụ tấn công làm tràn bảng, và đó là lúc phải nhìn tới port-security.</p>
<p><strong>4. ★</strong> Nó sẽ có khoảng 12 dòng động với địa chỉ dạng <code>02:42:ac:11:xx:xx</code>, mỗi dòng trên một giao diện <code>veth</code> riêng, cộng thêm các dòng vĩnh viễn của chính cái bridge và của các veth. Với thời gian lão hoá 1 giây, container nào ngừng nói quá một giây là bị quên, nên khung kế tiếp gửi tới nó sẽ bị <strong>tràn ra mọi container khác</strong>. Không có gì hỏng — tràn thì vẫn giao được — nhưng giờ container nào cũng nhìn thấy lưu lượng của hàng xóm, và CPU tăng lên. Đây là minh hoạ gọn gàng rằng lão hoá là một thiết lập về hiệu năng và riêng tư, không phải về tính đúng đắn.</p>
</details>`,
    ),

    cq(18, [
      ['CQ6.2', 'Compare and constrast the characteristics of media access control methods on WAN and LAN technologies',
       'So sánh và đối chiếu đặc điểm của các phương pháp điều khiển truy cập môi trường trên công nghệ WAN và LAN'],
    ]),

    bi(
      `<h3>💡 A way into CQ6.2</h3>
<p>Structure the answer around <em>how many devices share the medium</em>, because that is what decides everything else.</p>
<ul>
<li><strong>LAN, shared medium</strong> (legacy coax, any Wi-Fi): many devices, one channel ⇒ contention is unavoidable ⇒ CSMA/CD on wire, CSMA/CA on radio.</li>
<li><strong>LAN, switched</strong> (everything modern): one device per port, full duplex ⇒ <em>no access method at all</em>. This is the point most answers miss.</li>
<li><strong>WAN, point-to-point</strong> (PPP, HDLC, leased line): exactly two ends ⇒ no contention possible, and no addressing needed either.</li>
<li><strong>WAN, multi-access</strong> (legacy Frame Relay, some satellite): several sites on one circuit ⇒ controlled access by the provider, or virtual circuits that give each pair its own logical channel.</li>
</ul>
<p>Then close on the trade-off: contention optimises the average case and degrades under load; controlled access optimises the worst case and wastes capacity when quiet. LAN technology chose contention and then engineered the contention away with switching; WAN technology mostly chose point-to-point and never had the problem.</p>`,
      `<h3>💡 Một lối vào cho CQ6.2</h3>
<p>Hãy bố cục câu trả lời quanh chuyện <em>có bao nhiêu thiết bị dùng chung môi trường</em>, vì đó là thứ quyết định mọi thứ còn lại.</p>
<ul>
<li><strong>LAN dùng chung môi trường</strong> (cáp đồng trục đời cũ, mọi loại Wi-Fi): nhiều thiết bị, một kênh ⇒ tranh chấp là không tránh khỏi ⇒ CSMA/CD trên dây, CSMA/CA trên sóng.</li>
<li><strong>LAN dùng switch</strong> (mọi thứ hiện đại): mỗi cổng một thiết bị, song công đầy đủ ⇒ <em>không có phương pháp truy cập nào cả</em>. Đây là ý mà phần lớn bài làm bỏ sót.</li>
<li><strong>WAN điểm-tới-điểm</strong> (PPP, HDLC, đường thuê riêng): đúng hai đầu ⇒ không thể tranh chấp, và cũng chẳng cần đánh địa chỉ.</li>
<li><strong>WAN đa truy cập</strong> (Frame Relay đời cũ, một số đường vệ tinh): nhiều điểm trên một mạch ⇒ nhà cung cấp điều khiển truy cập, hoặc dùng mạch ảo để mỗi cặp có một kênh logic riêng.</li>
</ul>
<p>Rồi khép lại bằng cuộc đánh đổi: tranh chấp tối ưu cho trường hợp trung bình và xuống cấp khi tải nặng; truy cập có điều khiển tối ưu cho trường hợp xấu nhất và phí năng lực khi vắng. Công nghệ LAN chọn tranh chấp rồi dùng chuyển mạch để triệt tiêu luôn sự tranh chấp; công nghệ WAN thì phần lớn chọn điểm-tới-điểm và chưa từng có vấn đề đó.</p>`,
    ),
  ].join('\n'),
};

/* ─────────────────── Lesson 6.3 — Lab 1.4, sessions 19–20 ──────────────── */

const L3 = {
  title: '6.3 — Lab 1.4: Wireshark, device MACs and the switch table (FLM sessions 19–20)|||6.3 — Lab 1.4: Wireshark, MAC thiết bị và bảng MAC của switch (buổi 19–20 của FLM)',
  slug: 'nwc204-6-3-lab-1-4-wireshark-va-bang-mac',
  type: 'DOCUMENT',
  description: 'Buổi 19–20, Lab 1.4: bắt khung Ethernet bằng Wireshark/tshark và đọc từng trường, tìm địa chỉ MAC trên Windows/Linux/macOS/IOS, đọc và xoá bảng MAC của switch, làm lại toàn bộ bài lab trên Linux và Docker mà không cần Packet Tracer, và dùng AI phân tích gói đã bắt theo CLO9.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 6 · Lesson 6.3 · FLM sessions 19–20 of 60 · CLO2, CLO4, CLO9 · Lab 1.4</span>
<h2>Seeing it happen, instead of being told</h2>
<p class="lead">Two sessions of lab, and one purpose: to make the last two lessons visible. Everything below can be done on the school's Packet Tracer, and — as the ★ sections show — every part of it can also be done on a plain Linux machine you already own.</p>
<p><strong>Opening question:</strong> <code>show mac address-table</code> on a 24-port switch shows <strong>forty different MAC addresses on port Gi0/1</strong>, while every other port shows exactly one. Nothing is misconfigured and nobody is attacking you. What is plugged into Gi0/1, and what does that tell you about what a MAC table entry actually means?</p>`,
      `<span class="eyebrow">NWC204 · Chương 6 · Bài 6.3 · Buổi 19–20/60 của FLM · CLO2, CLO4, CLO9 · Lab 1.4</span>
<h2>Nhìn tận mắt, thay vì nghe kể</h2>
<p class="lead">Hai buổi thực hành, một mục đích: làm cho hai bài vừa rồi hiện ra nhìn thấy được. Mọi thứ bên dưới đều làm được trên Packet Tracer của trường, và — như các mục ★ chỉ ra — từng phần một cũng làm được trên một máy Linux bình thường mà bạn đã có sẵn.</p>
<p><strong>Câu hỏi mở đầu:</strong> <code>show mac address-table</code> trên một switch 24 cổng hiện ra <strong>bốn mươi địa chỉ MAC khác nhau ở cổng Gi0/1</strong>, trong khi mọi cổng khác chỉ có đúng một. Không có gì cấu hình sai và cũng không ai tấn công bạn. Cái gì đang cắm vào Gi0/1, và điều đó nói lên rằng một dòng trong bảng MAC thật ra có nghĩa là gì?</p>`,
    ),

    walkHead('nwc204-ch06', 19, 26,
      'Slides 19–23 walk through the three parts of Lab 1.4 as FLM sets it. Slides 24–26 are the ★ additions: the same lab on Linux and Docker, and what carries forward into Chapter 7.',
      'Slide 19–23 đi qua ba phần của Lab 1.4 đúng như FLM giao. Slide 24–26 là phần ★ bổ sung: vẫn bài lab đó trên Linux và Docker, và những gì mang sang chương 7.'),

    walk('nwc204-ch06', [
      [19, 'Lab 1.4 — the three things to look at',
        `<p>FLM lists the lab as three tasks plus one AI task. They build on each other.</p>
<ol>
<li><strong>Use Wireshark to examine Ethernet frames</strong> — capture a ping and read the header: source MAC, destination MAC, EtherType.</li>
<li><strong>View network device MAC addresses</strong> — find those same addresses on the PCs and the router, from each operating system's own command line.</li>
<li><strong>View the switch MAC address table</strong> — see the switch's own version of who is where.</li>
<li><strong>Use AI tools for analysing captured packets</strong> — CLO9. Paste a decoded frame into an AI assistant and ask it to explain each field; then check its answer against the standard.</li>
</ol>
<p>The single comparison the lab exists for: <strong>the destination MAC in your capture must belong to a machine on your own link</strong>. Ping something on the internet and the destination MAC is your router — never the far server. Reading that with your own eyes is worth more than any diagram.</p>`,
        `<p>FLM ghi bài lab này thành ba việc cộng một việc AI. Chúng xây lên nhau.</p>
<ol>
<li><strong>Dùng Wireshark soi khung Ethernet</strong> — bắt một lượt ping và đọc phần đầu: MAC nguồn, MAC đích, EtherType.</li>
<li><strong>Xem địa chỉ MAC của thiết bị mạng</strong> — tìm đúng những địa chỉ đó trên các PC và trên router, bằng dòng lệnh của từng hệ điều hành.</li>
<li><strong>Xem bảng địa chỉ MAC của switch</strong> — nhìn phiên bản của chính switch về chuyện ai đang ở đâu.</li>
<li><strong>Dùng công cụ AI phân tích gói đã bắt</strong> — CLO9. Dán một cái khung đã giải mã vào trợ lý AI rồi bảo nó giải thích từng trường; sau đó đối chiếu câu trả lời của nó với chuẩn.</li>
</ol>
<p>Phép so sánh duy nhất mà bài lab này tồn tại vì nó: <strong>MAC đích trong bản bắt gói của bạn phải là một cái máy nằm trên chính đường link của bạn</strong>. Ping một thứ gì đó trên internet thì MAC đích là router nhà bạn — không bao giờ là máy chủ ở xa. Nhìn thấy điều đó bằng mắt mình đáng giá hơn mọi sơ đồ.</p>`],

      [20, 'Lab 1.4 · step 1 — read the frame',
        `<p>In Wireshark, click a packet and expand <strong>Ethernet II</strong>. In a terminal, <code>tshark -V</code> prints the same thing. Four things to find:</p>
<ul>
<li><strong>Src</strong> — your own NIC's MAC. Confirm it against <code>ip -br link</code> in step 2.</li>
<li><strong>Dst</strong> — for anything off your LAN, this is the <em>router</em>. This is the whole lesson.</li>
<li><strong>Type: IPv4 (0x0800)</strong> — the EtherType from slide 3, in the wild.</li>
<li>The decoded <strong>I/G and U/L bits</strong>, which Wireshark shows as indented lines under the address — slide 6's theory printed on a real packet.</li>
</ul>
<p>Filters worth knowing: <code>eth.addr == 00:1a:2b:3c:4d:5e</code> to follow one machine, <code>eth.dst == ff:ff:ff:ff:ff:ff</code> to see only broadcasts, and <code>arp</code> to watch address resolution, which is Chapter 8.</p>`,
        `<p>Trong Wireshark, bấm vào một gói rồi mở rộng mục <strong>Ethernet II</strong>. Ở terminal thì <code>tshark -V</code> in ra đúng thứ đó. Bốn thứ cần tìm:</p>
<ul>
<li><strong>Src</strong> — MAC của chính card mạng bạn. Hãy đối chiếu với <code>ip -br link</code> ở bước 2.</li>
<li><strong>Dst</strong> — với bất cứ thứ gì nằm ngoài LAN của bạn, đây là <em>router</em>. Đây chính là toàn bộ bài học.</li>
<li><strong>Type: IPv4 (0x0800)</strong> — trường EtherType của slide 3, ngoài đời thật.</li>
<li>Hai bit <strong>I/G và U/L</strong> đã được giải mã, Wireshark hiện chúng thành mấy dòng thụt vào dưới địa chỉ — lý thuyết slide 6 in trên một gói tin thật.</li>
</ul>
<p>Mấy bộ lọc đáng biết: <code>eth.addr == 00:1a:2b:3c:4d:5e</code> để bám theo một cái máy, <code>eth.dst == ff:ff:ff:ff:ff:ff</code> để chỉ xem broadcast, và <code>arp</code> để xem quá trình phân giải địa chỉ, tức chương 8.</p>`],

      [21, 'Lab 1.4 · step 2 — find the MACs on the devices',
        `<p>The same address, five different commands. Memorising the table is genuinely useful: you will be asked for a MAC on a machine whose operating system you did not choose.</p>
<ul>
<li>Windows — <code>ipconfig /all</code>, read "Physical Address".</li>
<li>Linux — <code>ip -br link</code>, or <code>cat /sys/class/net/eth0/address</code> for exactly one line.</li>
<li>macOS — <code>ifconfig en0 | grep ether</code>.</li>
<li>Cisco IOS — <code>show interfaces</code>, and look for <strong>bia</strong>, the burned-in address. If the line reads <code>address is X (bia Y)</code> with X ≠ Y, the address has been overridden in software.</li>
<li>A neighbour's MAC — <code>ip neigh</code> or <code>arp -a</code>: what <em>your</em> machine learned about someone else.</li>
</ul>
<p>Now compare with the capture. They must match exactly. If they do not, you are looking at a different interface — a VPN tunnel, a bridge, or a virtual adapter — and that mismatch is itself a useful discovery.</p>`,
        `<p>Cùng một địa chỉ, năm câu lệnh khác nhau. Thuộc cái bảng này thật sự có ích: sẽ có lúc người ta hỏi bạn MAC trên một cái máy chạy hệ điều hành không do bạn chọn.</p>
<ul>
<li>Windows — <code>ipconfig /all</code>, đọc dòng "Physical Address".</li>
<li>Linux — <code>ip -br link</code>, hoặc <code>cat /sys/class/net/eth0/address</code> nếu muốn đúng một dòng.</li>
<li>macOS — <code>ifconfig en0 | grep ether</code>.</li>
<li>Cisco IOS — <code>show interfaces</code>, tìm chữ <strong>bia</strong>, tức địa chỉ khắc sẵn. Nếu dòng đó ghi <code>address is X (bia Y)</code> mà X ≠ Y thì địa chỉ đã bị phần mềm ghi đè.</li>
<li>MAC của hàng xóm — <code>ip neigh</code> hoặc <code>arp -a</code>: thứ mà <em>máy bạn</em> học được về người khác.</li>
</ul>
<p>Giờ hãy đem so với bản bắt gói. Chúng phải khớp chính xác. Nếu không khớp thì bạn đang nhìn một giao diện khác — một đường hầm VPN, một cầu nối, hay một card ảo — và chính chỗ lệch đó cũng là một phát hiện có ích.</p>`],

      [22, 'Lab 1.4 · step 3 — the switch\'s own view',
        `<p>Now the third viewpoint. You have seen the frame on the wire and the address on the host; this is what the switch made of it.</p>
<ul>
<li><code>show mac address-table dynamic</code> lists what has been learned. Each PC appears on its own access port.</li>
<li>The <strong>router</strong> appears on the uplink — and if you ping the internet, that is the MAC your capture showed as the destination. Three views, one address: this is the moment the chapter closes.</li>
</ul>
<p>The demonstration worth doing twice: <code>clear mac address-table dynamic</code>, confirm the table is empty, then ping once from one PC and watch a single entry appear. Nothing was configured. The table is <strong>learned</strong>, always, and it is learned from source addresses in passing traffic.</p>`,
        `<p>Giờ tới góc nhìn thứ ba. Bạn đã thấy cái khung trên dây và địa chỉ trên máy trạm; đây là thứ switch hiểu được từ chúng.</p>
<ul>
<li><code>show mac address-table dynamic</code> liệt kê những gì đã học được. Mỗi PC hiện trên đúng cổng truy cập của nó.</li>
<li><strong>Router</strong> thì hiện ở cổng uplink — và nếu bạn ping ra internet, đó chính là cái MAC mà bản bắt gói của bạn hiện ra ở ô đích. Ba góc nhìn, một địa chỉ: đây là khoảnh khắc chương này khép lại.</li>
</ul>
<p>Màn minh hoạ đáng làm hai lần: gõ <code>clear mac address-table dynamic</code>, xác nhận bảng đã rỗng, rồi ping một phát từ một cái PC và nhìn đúng một dòng hiện ra. Không ai cấu hình gì cả. Cái bảng đó là thứ <strong>học được</strong>, luôn luôn vậy, và học từ địa chỉ nguồn của lưu lượng đi ngang qua.</p>`],

      [23, '★ The same lab without Packet Tracer',
        `<p>★ Every task in Lab 1.4 has an exact equivalent on a plain Linux box. No simulator, no licence, and the output is from real hardware.</p>
<ul>
<li><strong>Step 1, Wireshark</strong> → <code>tshark</code> is Wireshark's command-line form, same decoder, same filters. <code>sudo tshark -i eth0 -e eth.src -e eth.dst -e eth.type -T fields</code> prints just the three fields you care about.</li>
<li><strong>Step 2, device MACs</strong> → <code>ip -br link</code> and <code>ip neigh</code>.</li>
<li><strong>Step 3, the switch table</strong> → <code>bridge fdb show br docker0</code>. A Linux bridge <em>is</em> a switch: it learns source MACs, forwards on destination, ages entries out, and floods what it does not know.</li>
</ul>
<p>Filter out the <code>permanent</code> entries — those are the bridge's own ports, the equivalent of a switch's internal interfaces — and what remains is a learned MAC address table, from your own machine.</p>`,
        `<p>★ Mọi phần việc trong Lab 1.4 đều có thứ tương đương chính xác trên một máy Linux bình thường. Không cần trình mô phỏng, không cần giấy phép, và kết xuất là của phần cứng thật.</p>
<ul>
<li><strong>Bước 1, Wireshark</strong> → <code>tshark</code> chính là Wireshark dạng dòng lệnh, cùng bộ giải mã, cùng bộ lọc. <code>sudo tshark -i eth0 -e eth.src -e eth.dst -e eth.type -T fields</code> in ra đúng ba trường bạn quan tâm.</li>
<li><strong>Bước 2, MAC của thiết bị</strong> → <code>ip -br link</code> và <code>ip neigh</code>.</li>
<li><strong>Bước 3, bảng của switch</strong> → <code>bridge fdb show br docker0</code>. Một cái bridge của Linux <em>chính là</em> một con switch: nó học MAC nguồn, chuyển tiếp theo đích, để các dòng lão hoá rồi xoá, và tràn thứ nó không biết.</li>
</ul>
<p>Hãy lọc bỏ các dòng <code>permanent</code> — đó là các cổng của chính cái bridge, tương đương giao diện nội bộ của switch — và phần còn lại chính là một bảng địa chỉ MAC học được, trên máy của bạn.</p>`],

      [24, '★ Why your containers can see each other',
        `<p>★ The closing observation of this chapter, and the one most relevant to your own work.</p>
<ul>
<li>Every container's MAC starts <code>02:42:</code>. Hex 02 has the <strong>U/L bit set</strong> — Docker invented the address, exactly as slide 6 described.</li>
<li><code>docker0</code> learns those addresses from source and forwards on destination. It is running the algorithm from slide 9, in software, on your VPS, right now.</li>
<li>One Docker bridge is <strong>one broadcast domain</strong>. Every container on it hears every broadcast on it, and nothing else does.</li>
<li>So <code>docker network create</code> is the container world's version of creating a VLAN — and it is the correct answer when you want two groups of containers not to see each other's broadcasts.</li>
</ul>
<p>This is why Chapter 6 is not theory for you: your deployment already contains a switch, a MAC table and a broadcast domain, and now you can read all three.</p>`,
        `<p>★ Nhận xét khép lại chương này, và cũng là nhận xét liên quan nhất tới công việc của bạn.</p>
<ul>
<li>MAC của mọi container đều bắt đầu bằng <code>02:42:</code>. Hex 02 có <strong>bit U/L đang bật</strong> — Docker tự bịa ra địa chỉ đó, đúng như slide 6 mô tả.</li>
<li><code>docker0</code> học các địa chỉ ấy từ trường nguồn và chuyển tiếp theo trường đích. Nó đang chạy đúng thuật toán của slide 9, bằng phần mềm, trên VPS của bạn, ngay lúc này.</li>
<li>Một cái bridge Docker là <strong>một miền quảng bá</strong>. Mọi container trên đó nghe thấy mọi broadcast trên đó, và không ai khác nghe thấy.</li>
<li>Nên <code>docker network create</code> chính là phiên bản VLAN của thế giới container — và đó là câu trả lời đúng khi bạn muốn hai nhóm container không nhìn thấy broadcast của nhau.</li>
</ul>
<p>Đây là lý do chương 6 không phải lý thuyết suông với bạn: hệ thống bạn đang triển khai vốn đã có một con switch, một bảng MAC và một miền quảng bá, và giờ bạn đọc được cả ba.</p>`],

      [25, 'Self-check — switching',
        `<p>Five commands that answer five different questions. Run them in this order when a LAN misbehaves.</p>
<ul>
<li><code>show mac address-table</code> — is the device where the switch thinks it is? A wrong port means the device moved, or somebody is spoofing.</li>
<li><code>show interfaces status</code> — <strong>a-full / a-1000</strong> means negotiated. A missing "a-" means forced by hand, and Chapter 5 explained the consequence.</li>
<li><code>show interfaces Fa0/1</code> — runts, giants, CRC. Rising CRC is a cable story; rising giants means somebody enabled tagging on a switch that does not expect it.</li>
<li><code>bridge fdb show</code> — the same table on Linux.</li>
<li><code>tshark -e eth.src -e eth.dst</code> — the two addresses that are actually on the wire, which settles any argument about what is being sent where.</li>
</ul>
<p>As in Chapter 5: work bottom-up, and write down what you saw before you change anything.</p>`,
        `<p>Năm câu lệnh trả lời năm câu hỏi khác nhau. Hãy chạy chúng theo đúng thứ tự này khi một mạng LAN giở chứng.</p>
<ul>
<li><code>show mac address-table</code> — thiết bị có đang ở chỗ switch nghĩ nó ở không? Sai cổng nghĩa là thiết bị đã chuyển chỗ, hoặc có kẻ đang giả mạo.</li>
<li><code>show interfaces status</code> — <strong>a-full / a-1000</strong> nghĩa là đã thương lượng. Thiếu chữ "a-" nghĩa là bị ép tay, và chương 5 đã nói hậu quả.</li>
<li><code>show interfaces Fa0/1</code> — runt, giant, CRC. CRC tăng là chuyện cáp; giant tăng nghĩa là có người bật gắn thẻ trên một con switch không chờ đợi điều đó.</li>
<li><code>bridge fdb show</code> — vẫn cái bảng đó, trên Linux.</li>
<li><code>tshark -e eth.src -e eth.dst</code> — hai địa chỉ thật sự đang nằm trên dây, thứ chấm dứt mọi tranh cãi về việc cái gì đang được gửi đi đâu.</li>
</ul>
<p>Như chương 5: làm từ dưới lên, và ghi lại thứ bạn nhìn thấy trước khi đụng vào bất cứ thứ gì.</p>`],

      [26, 'What Chapter 7 needs from this one',
        `<p>Three things to carry forward, and each one is a sentence you should be able to say without looking.</p>
<ul>
<li><strong>A switch never changes a frame; a router always builds a new one.</strong> That single difference is the boundary between Chapter 6 and Chapter 7.</li>
<li><strong>A switch multiplies collision domains and cannot split a broadcast domain.</strong> Only a router can — which is precisely why the next chapter exists.</li>
<li><strong>The destination MAC of anything leaving your LAN is the router.</strong> Chapter 8 (ARP) will explain how your machine discovered that address in the first place.</li>
</ul>
<p>Chapter 7 is the Network Layer: the IPv4 packet, and how a device decides whether a destination is local — answerable at layer 2 — or remote, and therefore the router's problem.</p>`,
        `<p>Ba thứ mang sang chương sau, và mỗi thứ là một câu bạn nên nói ra được mà không cần nhìn lại.</p>
<ul>
<li><strong>Switch không bao giờ đổi cái khung; router thì luôn dựng một cái khung mới.</strong> Đúng một khác biệt đó là ranh giới giữa chương 6 và chương 7.</li>
<li><strong>Switch nhân miền xung đột lên và không chia được miền quảng bá.</strong> Chỉ router mới làm được — và đó chính là lý do chương kế tiếp tồn tại.</li>
<li><strong>MAC đích của mọi thứ rời khỏi LAN của bạn đều là router.</strong> Chương 8 (ARP) sẽ giải thích ngay từ đầu máy bạn tìm ra địa chỉ đó bằng cách nào.</li>
</ul>
<p>Chương 7 là Tầng mạng: gói tin IPv4, và cách một thiết bị quyết định xem đích đến là cục bộ — trả lời được ở tầng 2 — hay ở xa, và do đó là việc của router.</p>`],
    ]),

    bi(
      `<h3>🔎 Lab 1.4 — the full run, as commands</h3>
<p>Do this on your own machine. It takes about ten minutes and it is the whole lab.</p>
<pre><code class="language-bash"># --- step 1: capture one ping and read the Ethernet header ---
sudo tshark -i eth0 -c 2 -f "icmp" -T fields \
  -e frame.number -e eth.src -e eth.dst -e eth.type -e ip.dst
# in another terminal, while that runs:
ping -c 1 8.8.8.8

# --- step 2: the same MACs, from the host ---
ip -br link                      # your own
ip neigh                         # the neighbours you have spoken to
ip route get 8.8.8.8             # which gateway that ping used

# --- step 3: a MAC address table ---
bridge fdb show br docker0 | grep -v permanent
sudo ip -s link set docker0 type bridge          # bridge settings, incl. ageing</code></pre>
<p>What you should see, and why it proves the chapter:</p>
<pre><code class="language-plaintext">eth.src  = 52:54:00:a1:b2:c3    -> matches "ip -br link" exactly
eth.dst  = 00:1a:2b:3c:4d:5e    -> matches "ip neigh" for the GATEWAY
ip.dst   = 8.8.8.8              -> but the frame was addressed to the gateway
eth.type = 0x0800               -> IPv4, the EtherType from slide 3

=> one packet, two destinations: 8.8.8.8 at layer 3, your router at layer 2.
   That is Chapter 5's "a MAC address never leaves its link", measured.</code></pre>
<p><strong>The AI task (CLO9), done properly:</strong> paste one decoded frame into an AI assistant and ask it to name every field and its length. Then check three specific claims against this chapter — the byte counts of the header, whether the preamble is included, and what the EtherType value means. Treat the answer as a draft to verify, not as a source. That checking step <em>is</em> the learning outcome; accepting the answer is not.</p>
<p>And the opening question: <strong>Gi0/1 is an uplink</strong> — to another switch, or to a virtualisation host running forty VMs. A MAC table entry means <em>"to reach this address, send out this port"</em>. It says <strong>which direction</strong>, never <strong>how far</strong>. Forty addresses behind one port is exactly what a correctly working uplink looks like.</p>`,
      `<h3>🔎 Lab 1.4 — chạy trọn bộ, bằng câu lệnh</h3>
<p>Hãy làm trên máy của chính bạn. Mất khoảng mười phút và đó là cả bài lab.</p>
<pre><code class="language-bash"># --- bước 1: bắt một lượt ping và đọc phần đầu Ethernet ---
sudo tshark -i eth0 -c 2 -f "icmp" -T fields \
  -e frame.number -e eth.src -e eth.dst -e eth.type -e ip.dst
# ở một cửa sổ terminal khác, trong lúc lệnh trên đang chạy:
ping -c 1 8.8.8.8

# --- bước 2: vẫn những MAC đó, nhìn từ máy trạm ---
ip -br link                      # của chính bạn
ip neigh                         # những hàng xóm bạn đã nói chuyện
ip route get 8.8.8.8             # lượt ping vừa rồi đi qua cổng ra nào

# --- bước 3: một bảng địa chỉ MAC ---
bridge fdb show br docker0 | grep -v permanent
sudo ip -s link set docker0 type bridge          # thiết lập của bridge, có cả lão hoá</code></pre>
<p>Bạn phải thấy gì, và vì sao nó chứng minh cả chương:</p>
<pre><code class="language-plaintext">eth.src  = 52:54:00:a1:b2:c3    -> khớp chính xác với "ip -br link"
eth.dst  = 00:1a:2b:3c:4d:5e    -> khớp với "ip neigh" của CỔNG RA
ip.dst   = 8.8.8.8              -> nhưng cái khung lại đề địa chỉ cho cổng ra
eth.type = 0x0800               -> IPv4, đúng trường EtherType của slide 3

=> một gói tin, hai cái đích: 8.8.8.8 ở tầng 3, router nhà bạn ở tầng 2.
   Đó chính là câu "MAC không bao giờ rời khỏi link của nó" của chương 5, đo được.</code></pre>
<p><strong>Phần việc AI (CLO9), làm cho đúng cách:</strong> dán một cái khung đã giải mã vào trợ lý AI và bảo nó gọi tên từng trường cùng độ dài. Rồi đem đối chiếu ba khẳng định cụ thể với chương này — số byte của phần đầu, preamble có được tính vào không, và giá trị EtherType nghĩa là gì. Hãy coi câu trả lời là một bản nháp cần kiểm, không phải một nguồn. Chính cái bước đối chiếu đó <em>mới là</em> chuẩn đầu ra; còn tin luôn câu trả lời thì không.</p>
<p>Và câu hỏi mở đầu: <strong>Gi0/1 là một đường uplink</strong> — sang một con switch khác, hoặc sang một máy chủ ảo hoá đang chạy bốn mươi máy ảo. Một dòng trong bảng MAC có nghĩa là <em>"muốn tới địa chỉ này thì đẩy ra cổng này"</em>. Nó nói <strong>đi hướng nào</strong>, không bao giờ nói <strong>xa bao nhiêu</strong>. Bốn mươi địa chỉ sau một cổng chính là dáng vẻ của một đường uplink đang chạy đúng.</p>`,
    ),

    bi(
      `<h3>⚠️ Traps people actually fall into</h3>
<ol>
<li><strong>Capturing on the wrong interface.</strong> <em>Symptom:</em> an empty capture, or MAC addresses that match nothing. On a machine with a VPN, a bridge and a physical NIC, <code>any</code> and <code>eth0</code> and <code>wg0</code> show three different worlds. Check with <code>ip -br link</code> first.</li>
<li><strong>Expecting the far server's MAC in the capture.</strong> <em>Symptom:</em> "Wireshark is showing the wrong destination". It is showing the router. This lab exists to make that permanent.</li>
<li><strong>Believing an empty MAC table means the switch is broken.</strong> <em>Symptom:</em> panic after <code>clear mac address-table</code>. Send one ping and the entries return. An empty table costs a little flooding, nothing more.</li>
<li><strong>Taking the AI's field-by-field explanation on trust.</strong> <em>Symptom:</em> an answer that says the preamble is part of the frame, or that the FCS covers the preamble. Both are plausible-sounding and both are wrong. CLO9 asks you to <em>use</em> AI tools; using them well means checking them.</li>
<li><strong>★ Running tshark without sudo and concluding the interface is dead.</strong> <em>Symptom:</em> "no interfaces available". Packet capture needs privileges, or membership of the <code>wireshark</code> group. It is a permission error wearing the costume of a network fault.</li>
</ol>`,
      `<h3>⚠️ Bẫy hay mắc</h3>
<ol>
<li><strong>Bắt gói nhầm giao diện.</strong> <em>Triệu chứng:</em> bản bắt rỗng, hoặc địa chỉ MAC không khớp với cái gì cả. Trên một máy có VPN, có bridge và có card mạng thật, ba thứ <code>any</code>, <code>eth0</code> và <code>wg0</code> cho ba thế giới khác nhau. Hãy kiểm bằng <code>ip -br link</code> trước.</li>
<li><strong>Mong thấy MAC của máy chủ ở xa trong bản bắt gói.</strong> <em>Triệu chứng:</em> "Wireshark hiện sai đích rồi". Nó đang hiện router. Bài lab này tồn tại để chuyện đó dính vào đầu vĩnh viễn.</li>
<li><strong>Tưởng bảng MAC rỗng nghĩa là switch hỏng.</strong> <em>Triệu chứng:</em> hoảng sau khi gõ <code>clear mac address-table</code>. Gửi một lượt ping là các dòng quay lại. Bảng rỗng chỉ tốn thêm chút tràn, không gì hơn.</li>
<li><strong>Tin luôn lời AI giải thích từng trường.</strong> <em>Triệu chứng:</em> một câu trả lời nói preamble là một phần của khung, hoặc nói FCS phủ cả preamble. Cả hai nghe đều hợp lý và cả hai đều sai. CLO9 yêu cầu bạn <em>dùng</em> công cụ AI; dùng cho giỏi nghĩa là phải kiểm lại nó.</li>
<li><strong>★ Chạy tshark mà không sudo rồi kết luận card mạng chết.</strong> <em>Triệu chứng:</em> "no interfaces available". Bắt gói cần quyền, hoặc phải nằm trong nhóm <code>wireshark</code>. Đó là lỗi phân quyền khoác áo lỗi mạng.</li>
</ol>`,
    ),

    bi(
      `<h3>✍️ Exercises — with full answers</h3>
<p><strong>1.</strong> You capture a ping to a printer on your own LAN and a ping to 8.8.8.8, back to back. Predict the source and destination MAC of each, and say which fields differ.</p>
<p><strong>2.</strong> Your capture shows a frame with <code>eth.dst == ff:ff:ff:ff:ff:ff</code> and <code>eth.type == 0x0806</code>, sent by a machine you have never heard of. Is this suspicious? What is it doing?</p>
<p><strong>3. ★</strong> On a Docker host, <code>bridge fdb show br docker0</code> lists a MAC with the flag <code>permanent</code> and several without it. What is the difference, and which of them would disappear if you stopped all containers?</p>
<p><strong>4.</strong> Write the three Wireshark display filters you would use to: follow one machine's traffic, see only broadcasts, and see only IPv6 frames.</p>
<details><summary>Answers</summary>
<p><strong>1.</strong> Ping to the printer: <code>src</code> = your MAC, <code>dst</code> = <strong>the printer's MAC</strong> — it is on your link, so layer 2 can address it directly. Ping to 8.8.8.8: <code>src</code> = your MAC, <code>dst</code> = <strong>the router's MAC</strong>. The source is identical in both; only the destination differs, and it differs because of <em>where the target is</em>, not because of what it is. The IP destination, meanwhile, is the real target in both cases.</p>
<p><strong>2.</strong> Not suspicious at all — EtherType 0x0806 is <strong>ARP</strong>, and an ARP request is always a broadcast. Some machine is asking "who has this IP?". You have never heard of it because you have never exchanged traffic with it; broadcasts reach you regardless. This is Chapter 8's subject, seen early.</p>
<p><strong>3. ★</strong> <code>permanent</code> entries are the bridge's own ports — the local MAC addresses of the veth interfaces and of <code>docker0</code> itself. They are configured, not learned, and they do not age. The entries <em>without</em> the flag are <strong>learned</strong> from container traffic, exactly like a switch. Stopping all containers removes both, because the veth devices are deleted with the containers — but if you merely left the containers idle, only the learned entries would disappear, after the ageing time.</p>
<p><strong>4.</strong> <code>eth.addr == aa:bb:cc:dd:ee:ff</code> (matches source or destination), <code>eth.dst == ff:ff:ff:ff:ff:ff</code>, and <code>eth.type == 0x86dd</code>. Note the third one filters on the <em>EtherType</em>, not on <code>ipv6</code> — both work, but the EtherType version is the layer-2 answer and is what this chapter is about.</p>
</details>`,
      `<h3>✍️ Bài tập — có lời giải đầy đủ</h3>
<p><strong>1.</strong> Bạn bắt gói một lượt ping tới cái máy in trong LAN nhà bạn và một lượt ping tới 8.8.8.8, ngay sau nhau. Hãy dự đoán MAC nguồn và MAC đích của từng lượt, và nói trường nào khác nhau.</p>
<p><strong>2.</strong> Bản bắt gói cho thấy một khung có <code>eth.dst == ff:ff:ff:ff:ff:ff</code> và <code>eth.type == 0x0806</code>, gửi bởi một cái máy bạn chưa từng nghe tên. Có đáng ngờ không? Nó đang làm gì?</p>
<p><strong>3. ★</strong> Trên một máy chủ Docker, <code>bridge fdb show br docker0</code> liệt kê một MAC có cờ <code>permanent</code> và vài MAC không có. Khác nhau chỗ nào, và cái nào sẽ biến mất nếu bạn dừng hết container?</p>
<p><strong>4.</strong> Hãy viết ba bộ lọc hiển thị của Wireshark để: bám theo lưu lượng của một cái máy, chỉ xem broadcast, và chỉ xem khung IPv6.</p>
<details><summary>Lời giải</summary>
<p><strong>1.</strong> Ping tới máy in: <code>src</code> = MAC của bạn, <code>dst</code> = <strong>MAC của máy in</strong> — nó nằm trên link của bạn nên tầng 2 đề địa chỉ thẳng cho nó được. Ping tới 8.8.8.8: <code>src</code> = MAC của bạn, <code>dst</code> = <strong>MAC của router</strong>. Trường nguồn giống hệt nhau ở cả hai; chỉ trường đích là khác, và nó khác vì <em>đích nằm ở đâu</em>, không phải vì đích là cái gì. Trong khi đó IP đích thì ở cả hai trường hợp đều là đích thật.</p>
<p><strong>2.</strong> Chẳng có gì đáng ngờ — EtherType 0x0806 là <strong>ARP</strong>, và lời hỏi ARP luôn là broadcast. Một cái máy nào đó đang hỏi "IP này là của ai?". Bạn chưa từng nghe tên nó vì bạn chưa từng trao đổi lưu lượng với nó; broadcast thì vẫn tới bạn bất kể vậy. Đây là chủ đề của chương 8, gặp sớm.</p>
<p><strong>3. ★</strong> Các dòng <code>permanent</code> là cổng của chính cái bridge — địa chỉ MAC cục bộ của các giao diện veth và của bản thân <code>docker0</code>. Chúng do cấu hình mà có, không phải học được, và không lão hoá. Còn các dòng <em>không có</em> cờ đó là <strong>học được</strong> từ lưu lượng của container, y hệt một con switch. Dừng hết container thì mất cả hai loại, vì thiết bị veth bị xoá cùng container — nhưng nếu bạn chỉ để container nằm im thì chỉ các dòng học được biến mất, sau khi hết thời gian lão hoá.</p>
<p><strong>4.</strong> <code>eth.addr == aa:bb:cc:dd:ee:ff</code> (khớp cả nguồn lẫn đích), <code>eth.dst == ff:ff:ff:ff:ff:ff</code>, và <code>eth.type == 0x86dd</code>. Để ý bộ lọc thứ ba lọc theo <em>EtherType</em> chứ không phải theo <code>ipv6</code> — cả hai đều chạy, nhưng bản EtherType mới là câu trả lời ở tầng 2 và đúng là thứ chương này nói tới.</p>
</details>`,
    ),

    cq(19, [
      ['CQ7.1', 'What is the Frame?', 'Khung (frame) là gì?'],
      ['CQ7.2', 'How to detect and fix when receive an error frame on transmission?',
       'Làm thế nào để phát hiện và xử lý khi nhận được một khung lỗi trong lúc truyền?'],
    ]),

    bi(
      `<h3>⚠️ A numbering oddity in the source table, and how to read it</h3>
<p>FLM's Constructive Questions table numbers these <strong>CQ7.1</strong> and <strong>CQ7.2</strong> and attaches them to sessions 19 and 20 — which are Lab 1.4, part of <em>Chapter 6</em>. It then puts <strong>CQ7.3</strong>, "How does Ethernet works in a switched network?", on session 21, which is already Chapter 7, the Network Layer. So three questions carry a chapter-7 number while all three are about chapter-6 material.</p>
<p>Reported, not corrected — the questions are quoted exactly as the school wrote them, and answered where the content actually belongs, which is here. Short answers, so the session is not left open:</p>
<ul>
<li><strong>CQ7.1 — What is the frame?</strong> The layer-2 protocol data unit: a header (start delimiter, destination and source MAC, type), the layer-3 packet as payload, and a trailer holding the FCS. It is valid for exactly one link and is rebuilt at every router.</li>
<li><strong>CQ7.2 — How to detect and fix an error frame?</strong> Detect: the receiver recomputes the CRC-32 and compares it with the FCS. Fix: at layer 2, <em>you do not</em> — the frame is discarded silently, and recovery is TCP's job at layer 4. What the administrator fixes is the <em>cause</em>: rising <code>rx_crc_errors</code> or <code>show interfaces</code> CRC counters point at a cable, a connector or interference, in that order.</li>
<li><strong>CQ7.3 (listed on session 21) — How does Ethernet work in a switched network?</strong> Lesson 6.2 answers it in full: learn from the source, decide on the destination, and forward, flood or filter.</li>
</ul>`,
      `<h3>⚠️ Một chỗ đánh số lạ trong bảng gốc, và cách đọc nó</h3>
<p>Bảng Constructive Questions của FLM đánh số hai câu này là <strong>CQ7.1</strong> và <strong>CQ7.2</strong> rồi gắn vào buổi 19 và 20 — vốn là Lab 1.4, thuộc <em>chương 6</em>. Sau đó nó đặt <strong>CQ7.3</strong>, "How does Ethernet works in a switched network?", vào buổi 21, vốn đã là chương 7 — Tầng mạng. Vậy là ba câu mang số của chương 7 trong khi cả ba đều nói về nội dung chương 6.</p>
<p>Chỉ nêu, không tự sửa — các câu hỏi được trích nguyên văn đúng như trường viết, và được trả lời ở nơi nội dung thật sự thuộc về, tức là ở đây. Trả lời ngắn, để buổi học không bị bỏ ngỏ:</p>
<ul>
<li><strong>CQ7.1 — Khung là gì?</strong> Là đơn vị dữ liệu của tầng 2: một phần đầu (dấu bắt đầu, MAC đích và MAC nguồn, trường kiểu), gói tin tầng 3 nằm trong phần tải, và một phần đuôi chứa FCS. Nó chỉ có giá trị trong đúng một đường link và bị dựng lại ở mỗi router.</li>
<li><strong>CQ7.2 — Phát hiện và xử lý khung lỗi thế nào?</strong> Phát hiện: bên nhận tính lại CRC-32 rồi đem so với FCS. Xử lý: ở tầng 2 thì <em>không xử lý gì cả</em> — khung bị vứt trong im lặng, và việc khôi phục là của TCP ở tầng 4. Thứ người quản trị sửa là <em>nguyên nhân</em>: bộ đếm <code>rx_crc_errors</code> hay CRC trong <code>show interfaces</code> đang tăng thì chỉ vào cáp, đầu nối, hoặc nhiễu — theo đúng thứ tự đó.</li>
<li><strong>CQ7.3 (ghi ở buổi 21) — Ethernet hoạt động thế nào trong mạng dùng switch?</strong> Bài 6.2 trả lời trọn vẹn: học từ nguồn, quyết định theo đích, rồi chuyển tiếp, tràn hoặc lọc bỏ.</li>
</ul>`,
    ),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz ──────────────────────────────── */

const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

const QUIZ = {
  title: 'Quiz Chapter 6 — Ethernet Switching|||Quiz Chương 6 — Chuyển mạch Ethernet',
  slug: 'nwc204-ch6-quiz',
  type: 'QUIZ',
  description: '12 câu song ngữ cho chương 6: khung Ethernet theo byte, runt và giant, cấu tạo MAC, bit I/G và U/L, ba loại địa chỉ đích, switch học và quyết định ra sao, forward/flood/filter, lão hoá 300 giây, miền xung đột và miền quảng bá, store-and-forward so với cut-through, port-security, và cách đọc bảng MAC. Mỗi câu có giải thích.',
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      q('Which field does a switch LEARN from, and which does it DECIDE on?|||Switch HỌC từ trường nào, và QUYẾT ĐỊNH theo trường nào?',
        ['Learns from destination, decides on source|||Học từ đích, quyết định theo nguồn', 'Learns from source, decides on destination|||Học từ nguồn, quyết định theo đích', 'Learns and decides on the EtherType|||Học và quyết định đều theo EtherType', 'Learns from the FCS, decides on the VLAN|||Học từ FCS, quyết định theo VLAN'],
        1,
        'The source MAC tells the switch where that device is, so it is written into the table against the arrival port. The destination MAC is then looked up in that table to decide where to send the frame. Two different fields of the same frame, two different jobs.|||MAC nguồn cho switch biết thiết bị đó ở đâu, nên nó được ghi vào bảng gắn với cổng vừa nhận. MAC đích sau đó được tra trong chính bảng ấy để quyết định đẩy khung đi đâu. Hai trường khác nhau của cùng một khung, hai công việc khác nhau.'),

      q('What is the minimum and maximum size of an untagged Ethernet frame, excluding the preamble?|||Kích thước nhỏ nhất và lớn nhất của một khung Ethernet không gắn thẻ, không tính preamble?',
        ['46 and 1500 bytes|||46 và 1500 byte', '64 and 1518 bytes|||64 và 1518 byte', '64 and 1522 bytes|||64 và 1522 byte', '72 and 1526 bytes|||72 và 1526 byte'],
        1,
        '14 bytes of header + 46 to 1500 bytes of payload + 4 bytes of FCS = 64 to 1518. The 8-byte preamble and SFD are physical-layer synchronisation and are not counted; 1522 is the maximum only once a 4-byte 802.1Q tag is inserted.|||14 byte phần đầu + 46 tới 1500 byte tải + 4 byte FCS = 64 tới 1518. Tám byte preamble và SFD là phần đồng bộ của tầng vật lý, không tính vào; còn 1522 chỉ là mức tối đa khi đã chèn thẻ 802.1Q 4 byte.'),

      q('Which bit tells you a MAC address was invented by software rather than assigned by a vendor?|||Bit nào cho biết một địa chỉ MAC do phần mềm bịa ra chứ không phải hãng gán?',
        ['The I/G bit, the last bit of the first byte|||Bit I/G, bit cuối của byte đầu', 'The U/L bit, the second-last bit of the first byte|||Bit U/L, bit áp chót của byte đầu', 'The first bit of the last byte|||Bit đầu của byte cuối', 'There is no such bit|||Không có bit nào như vậy'],
        1,
        'The U/L bit set to 1 means locally administered: the address was chosen by software and no IEEE registration exists. Docker uses 02: and KVM uses 52:, and both have that bit set. The I/G bit is the other flag and distinguishes unicast from multicast.|||Bit U/L bằng 1 nghĩa là do cục bộ tự đặt: địa chỉ do phần mềm chọn và không có đăng ký nào ở IEEE. Docker dùng 02: còn KVM dùng 52:, cả hai đều bật bit đó. Bit I/G là cái cờ còn lại, dùng phân biệt unicast với multicast.'),

      q('A switch receives a frame for a destination MAC that is not in its table. What does it do?|||Switch nhận một khung có MAC đích không có trong bảng. Nó làm gì?',
        ['Drops it and sends an error to the source|||Vứt đi và báo lỗi về cho bên gửi', 'Floods it out every port except the one it arrived on|||Tràn nó ra mọi cổng trừ cổng vừa nhận', 'Holds it until the destination is learned|||Giữ lại cho tới khi học được đích', 'Sends it to the default gateway|||Gửi tới cổng ra mặc định'],
        1,
        'An unknown unicast is flooded, exactly like a broadcast — the switch cannot tell them apart, because both mean "I do not know who wants this". The reply from the real destination is what teaches the switch, and from then on the conversation is forwarded port to port.|||Một unicast chưa biết sẽ bị tràn, y hệt broadcast — switch không phân biệt được hai thứ đó, vì cả hai đều nghĩa là "tôi không biết ai cần cái này". Chính gói trả lời từ đích thật mới dạy cho switch, và từ đó trở đi cuộc trò chuyện được chuyển thẳng cổng sang cổng.'),

      q('You move a laptop to a different switch port and it stays silent. How long can traffic to it keep failing?|||Bạn chuyển laptop sang cổng switch khác và nó nằm im. Lưu lượng gửi tới nó có thể hỏng trong bao lâu?',
        ['Until the switch is rebooted|||Cho tới khi khởi động lại switch', 'Up to 300 seconds, the default aging time|||Tối đa 300 giây, thời gian lão hoá mặc định', 'Exactly 30 seconds|||Đúng 30 giây', 'It never fails — switches detect port changes instantly|||Không bao giờ hỏng — switch nhận ra đổi cổng ngay lập tức'],
        1,
        'The old entry survives until the 300-second aging timer expires, and until then the switch keeps sending that traffic to the old port. The instant the laptop transmits anything, the switch learns its source MAC on the new port and rewrites the entry — learning is immediate, forgetting takes five minutes.|||Dòng cũ còn sống cho tới khi đồng hồ lão hoá 300 giây hết hạn, và trước lúc đó switch vẫn đẩy lưu lượng về cổng cũ. Ngay khi laptop phát đi bất cứ thứ gì, switch học được MAC nguồn của nó ở cổng mới và ghi đè dòng cũ — học thì tức thì, quên thì mất năm phút.'),

      q('How many broadcast domains do three switches chained together form, with no router?|||Ba con switch nối liền nhau, không có router, tạo thành bao nhiêu miền quảng bá?',
        ['One|||Một', 'Three|||Ba', 'One per port|||Mỗi cổng một miền', 'None|||Không có miền nào'],
        0,
        'A switch floods broadcasts by design and cannot divide a broadcast domain — only a router can, or VLANs, which are routed between. Those same three switches do create one collision domain per port, which is the distinction the question is testing.|||Switch tràn broadcast là do thiết kế và không chia được miền quảng bá — chỉ router mới làm được, hoặc VLAN, thứ phải định tuyến giữa các VLAN. Cũng ba con switch đó lại tạo ra mỗi cổng một miền xung đột, và đó chính là chỗ phân biệt mà câu hỏi đang kiểm.'),

      q('Which forwarding method checks the FCS before sending the frame on?|||Cách chuyển tiếp nào kiểm FCS trước khi đẩy khung đi tiếp?',
        ['Cut-through (fast-forward)', 'Fragment-free', 'Store-and-forward', 'All of them|||Cả ba'],
        2,
        'Only store-and-forward receives the entire frame, so only it can verify the CRC before forwarding — a corrupt frame stops there. Cut-through starts sending after 6 bytes and fragment-free after 64, and neither has read the FCS by then, so both pass corruption downstream.|||Chỉ store-and-forward mới nhận trọn cái khung, nên chỉ nó mới kiểm được CRC trước khi chuyển tiếp — khung hỏng dừng lại ở đó. Cut-through bắt đầu gửi sau 6 byte còn fragment-free sau 64 byte, cả hai lúc đó chưa đọc tới FCS nên đều chuyển tiếp cả phần hỏng xuống dưới.'),

      q('Why is cut-through impossible when a 1 Gbps port forwards to a 100 Mbps port?|||Vì sao cut-through là bất khả thi khi một cổng 1 Gbps chuyển sang cổng 100 Mbps?',
        ['The FCS would be wrong|||FCS sẽ bị sai', 'Bits arrive faster than they can leave, so they must be buffered|||Bit tới nhanh hơn tốc độ đi ra, nên buộc phải chứa tạm', 'The MAC addresses would not match|||Địa chỉ MAC sẽ không khớp', 'Cisco disabled it in software|||Cisco tắt nó bằng phần mềm'],
        1,
        'Cut-through means forwarding while still receiving, which only works if the output can keep up with the input. With a speed mismatch the switch has to store the frame and drain it slowly, which is store-and-forward by definition. This is why any switch with mixed port speeds behaves this way.|||Cut-through nghĩa là vừa nhận vừa chuyển, và điều đó chỉ chạy được khi đầu ra theo kịp đầu vào. Khi hai tốc độ lệch nhau thì switch buộc phải chứa cái khung lại rồi xả ra từ từ, mà như thế chính là store-and-forward. Đó là lý do mọi switch có nhiều tốc độ cổng khác nhau đều xử sự như vậy.'),

      q('In show interfaces status, what does the "a-" in "a-full" mean?|||Trong show interfaces status, chữ "a-" trong "a-full" nghĩa là gì?',
        ['Asynchronous|||Không đồng bộ', 'Auto-negotiated|||Đã tự thương lượng', 'Active|||Đang hoạt động', 'Aggregated|||Đã gộp kênh'],
        1,
        'The "a-" prefix means the value was auto-negotiated with the far end. Seeing full or 1000 without it means somebody forced the setting by hand, which is how the duplex mismatch of Chapter 5 gets created in the first place.|||Tiền tố "a-" nghĩa là giá trị đó được tự thương lượng với đầu bên kia. Thấy full hay 1000 mà không có nó nghĩa là có người ép tay, và đó chính là cách người ta tạo ra cái lỗi lệch duplex của chương 5.'),

      q('A MAC flooding attack turns a switch into what, and why?|||Tấn công làm tràn bảng MAC biến switch thành cái gì, và vì sao?',
        ['A router, because it starts routing|||Thành router, vì nó bắt đầu định tuyến', 'A hub, because a full table means every unknown destination is flooded|||Thành hub, vì bảng đầy nghĩa là mọi đích chưa biết đều bị tràn', 'A firewall, because it blocks traffic|||Thành tường lửa, vì nó chặn lưu lượng', 'Nothing — switches ignore invalid MACs|||Không thành gì — switch bỏ qua MAC không hợp lệ'],
        1,
        'Thousands of invented source addresses fill the table, after which nothing new can be learned and every unknown destination is flooded out all ports — which is exactly what a hub does, and lets the attacker read other people\'s traffic. The defence is switchport port-security, capping how many addresses a port may learn.|||Hàng nghìn địa chỉ nguồn bịa ra làm bảng đầy lên, sau đó không học thêm được gì nữa và mọi đích chưa biết đều bị tràn ra mọi cổng — đúng như hub làm, và cho kẻ tấn công đọc được lưu lượng của người khác. Cách chống là switchport port-security, chặn số địa chỉ mà một cổng được phép học.'),

      q('You ping 8.8.8.8 and capture the frame. What is the destination MAC?|||Bạn ping 8.8.8.8 và bắt gói. MAC đích là của ai?',
        ['Google\'s server MAC|||MAC của máy chủ Google', 'FF:FF:FF:FF:FF:FF', 'Your default gateway\'s MAC|||MAC của cổng ra mặc định', 'Your own MAC|||MAC của chính bạn'],
        2,
        'A MAC address is only valid on one link, so your machine can only address a neighbour. For anything off the LAN that neighbour is the router, and the frame is addressed to it while the IP header still names 8.8.8.8. Seeing those two different destinations in one packet is the point of Lab 1.4.|||Địa chỉ MAC chỉ có giá trị trên một đường link, nên máy bạn chỉ đề địa chỉ được cho một người hàng xóm. Với mọi thứ nằm ngoài LAN thì người hàng xóm đó là router, và cái khung được đề cho nó trong khi phần đầu IP vẫn ghi 8.8.8.8. Nhìn thấy hai cái đích khác nhau trong cùng một gói chính là mục đích của Lab 1.4.'),

      q('Port Gi0/1 shows 40 dynamic MAC addresses while every other port shows one. What is it?|||Cổng Gi0/1 hiện 40 địa chỉ MAC động trong khi mọi cổng khác chỉ có một. Đó là gì?',
        ['A broken port|||Một cổng hỏng', 'An uplink to another switch or a virtualisation host|||Đường uplink sang switch khác hoặc sang máy chủ ảo hoá', 'Always a MAC flooding attack|||Chắc chắn là tấn công làm tràn bảng MAC', 'A port with port-security disabled|||Một cổng bị tắt port-security'],
        1,
        'A MAC table entry means "to reach this address, send out this port" — it records direction, never distance. Forty addresses behind one port is what a correctly working uplink looks like. It would only be suspicious if that port were supposed to be an access port with a single PC on it.|||Một dòng trong bảng MAC nghĩa là "muốn tới địa chỉ này thì đẩy ra cổng này" — nó ghi lại hướng đi, không bao giờ ghi khoảng cách. Bốn mươi địa chỉ sau một cổng chính là dáng vẻ của một đường uplink chạy đúng. Chỉ đáng ngờ nếu cổng đó lẽ ra là cổng truy cập chỉ có một cái PC.'),
    ],
  },
};

export default [
  {
    title: 'Chapter 6 — Ethernet Switching (FLM sessions 17–20)|||Chương 6 — Chuyển mạch Ethernet (buổi 17–20 của FLM)',
    slug: 'nwc204-chuong-6-chuyen-mach-ethernet',
    description: 'Cisco Module 7 theo đúng buổi 17–20 của FLM: khung Ethernet theo từng byte, runt và giant, cấu tạo 48 bit của địa chỉ MAC cùng hai bit cờ I/G và U/L, ba loại địa chỉ đích, cách switch học và ra quyết định, forward/flood/filter, lão hoá 300 giây, miền xung đột so với miền quảng bá, store-and-forward so với cut-through, bộ đệm, tốc độ/duplex/auto-MDIX, và Lab 1.4 với Wireshark. Kèm phần ★ bổ sung: tấn công làm tràn bảng MAC với port-security, và làm lại toàn bộ Lab 1.4 trên Linux/Docker. Slide tiếng Anh do cuongthai.com dựng, giảng song ngữ.',
    lessons: [L1, L2, L3, QUIZ],
  },
];
