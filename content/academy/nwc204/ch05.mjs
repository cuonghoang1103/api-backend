/**
 * NWC204 · Chapter 5 — The Data Link Layer (Cisco Module 6).
 * FLM buổi 15 (5.1) + buổi 16 (5.2 Topologies, 5.3 Data Link Frame, 5.4 AI tools).
 *
 * Slide: scripts/slides-src/nwc204-ch05.mjs → deck 'nwc204-ch05', 27 ảnh.
 * Slide viết hoàn toàn bằng tiếng Anh; phần giảng song ngữ nằm dưới mỗi ảnh.
 *
 * ★ = phần cuongthai.com BỔ SUNG, không có trong Module 6 của Cisco:
 *   duplex mismatch đọc bằng ethtool · 802.1Q · MTU/MSS · lệnh tầng 2 trên Linux ·
 *   Docker bridge. Người học yêu cầu đánh dấu rõ phần bổ sung để biết đâu là
 *   giáo trình của trường, đâu là phần thêm để dùng được trong công việc.
 *
 * ⚠️ Bảng cauHoiKienTao của FLM BỎ TRỐNG buổi 15 và 16 (nhảy từ CQ5.2 ở buổi 14
 * sang CQ6.1 ở buổi 17). Vì vậy chương này KHÔNG gọi cq() — thay vào đó có mục
 * câu hỏi thảo luận do ta tự soạn, đánh dấu ★.
 *
 * ⚠️ File này CHỈ chứa chương 5. Đừng sửa NWC204.mjs ở đây.
 */
import { registerDeck, walk, walkHead, bi } from './_slides.mjs';

const D = registerDeck('nwc204-ch05', {
  code: 'NWC204',
  en: 'The Data Link Layer',
  vi: 'Tầng liên kết dữ liệu',
  total: 27,
});

/* ──────────────────────── Lesson 5.1 — session 15 ──────────────────────── */

const L1 = {
  title: '5.1 — Purpose of the Data Link Layer (FLM session 15)|||5.1 — Tầng liên kết dữ liệu làm gì (buổi 15 của FLM)',
  slug: 'nwc204-5-1-muc-dich-tang-lien-ket-du-lieu',
  type: 'DOCUMENT',
  description: 'Buổi 15: tầng 2 làm đúng bốn việc, hai tầng con LLC và MAC, vì sao địa chỉ MAC không bao giờ rời khỏi đường link của nó, một gói tin đi qua ba loại khung khác nhau, các tổ chức chuẩn hoá, và cách đọc tầng 2 trên máy thật bằng ip link / ip neigh.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 5 · Lesson 5.1 · FLM session 15 of 60 · CLO2, CLO4, CLO9 · Cisco Module 6</span>
<h2>The layer that only ever thinks about the next device</h2>
<p class="lead">Layer 3 plans the whole journey. Layer 2 does not know there is a journey. It knows one link, the machines on that link, and nothing else — and that narrowness is exactly what makes the internet possible.</p>
<p><strong>Opening question:</strong> on your server, <code>ip neigh</code> shows <code>192.168.1.77 FAILED</code> — a machine on your own subnet that will not answer. At the same moment <code>ping 8.8.8.8</code> works perfectly, and 8.8.8.8 is on the other side of the planet. How can the far address be reachable while the near one is not?</p>
<p class="note">★ Throughout this chapter, a <strong>★</strong> marks material added by cuongthai.com that is <em>not</em> in Cisco Module 6 — duplex diagnosis, 802.1Q, MTU, the Linux commands and Docker networking. The school's syllabus is covered in full first; the ★ sections are what you will actually need on a server.</p>`,
      `<span class="eyebrow">NWC204 · Chương 5 · Bài 5.1 · Buổi 15/60 của FLM · CLO2, CLO4, CLO9 · Cisco Module 6</span>
<h2>Tầng chỉ biết nghĩ tới thiết bị kế bên</h2>
<p class="lead">Tầng 3 vạch ra cả hành trình. Tầng 2 thì không biết là có hành trình nào cả. Nó chỉ biết một đường link, những máy nằm trên đường link đó, và không biết gì thêm — chính cái hẹp hòi ấy lại là thứ làm cho internet chạy được.</p>
<p><strong>Câu hỏi mở đầu:</strong> trên máy chủ của bạn, <code>ip neigh</code> hiện <code>192.168.1.77 FAILED</code> — một máy nằm ngay trong dải mạng của bạn mà không chịu trả lời. Cùng lúc đó <code>ping 8.8.8.8</code> chạy ngon lành, mà 8.8.8.8 thì ở tận nửa vòng trái đất. Vì sao địa chỉ xa lại tới được còn địa chỉ gần thì không?</p>
<p class="note">★ Trong cả chương này, dấu <strong>★</strong> đánh dấu phần do cuongthai.com bổ sung, <em>không</em> có trong Module 6 của Cisco — chẩn đoán duplex, 802.1Q, MTU, các lệnh Linux và mạng Docker. Giáo trình của trường được phủ đủ trước; phần ★ là thứ bạn sẽ thật sự cần khi ngồi trước một máy chủ.</p>`,
    ),

    walkHead('nwc204-ch05', 1, 7,
      'Slides 1–7 cover FLM session 15: 5.1 Purpose of the Data Link Layer — the four jobs, the LLC and MAC sublayers, local addressing, and who writes the standards.',
      'Slide 1–7 là buổi 15 của FLM: 5.1 Purpose of the Data Link Layer — bốn việc của tầng 2, hai tầng con LLC và MAC, địa chỉ cục bộ, và ai là người đặt ra chuẩn.'),

    walk('nwc204-ch05', [
      [1, 'Cover — Chapter 5, the Data Link Layer',
        `<p>Chapter 5 of the course is <strong>Cisco Module 6</strong>, and FPT gives it two sessions.</p>
<ul>
<li>Session 15 — 5.1 Purpose of the Data Link Layer.</li>
<li>Session 16 — 5.2 Topologies, 5.3 Data Link Frame, 5.4 Integrate AI Tools for Explaining Concepts (self-learning).</li>
<li>Outcomes: <strong>CLO2</strong> (Ethernet and switching), <strong>CLO4</strong> (how the layers interact), <strong>CLO9</strong> (use AI tools to explain and troubleshoot).</li>
</ul>
<p>Two sessions is thin for this much material, which is one reason this chapter goes further than the slide list: everything you configure later — switches, VLANs, routers, containers — rests on the frame described here.</p>`,
        `<p>Chương 5 của môn chính là <strong>Module 6 của Cisco</strong>, và trường xếp cho nó hai buổi.</p>
<ul>
<li>Buổi 15 — 5.1 Purpose of the Data Link Layer.</li>
<li>Buổi 16 — 5.2 Topologies, 5.3 Data Link Frame, 5.4 Integrate AI Tools for Explaining Concepts (tự học).</li>
<li>Chuẩn đầu ra: <strong>CLO2</strong> (Ethernet và chuyển mạch), <strong>CLO4</strong> (các tầng phối hợp với nhau ra sao), <strong>CLO9</strong> (dùng công cụ AI để giải thích và xử lý sự cố).</li>
</ul>
<p>Hai buổi là ít so với lượng kiến thức này, và đó là một lý do chương này đi xa hơn danh sách slide của trường: mọi thứ bạn cấu hình về sau — switch, VLAN, router, container — đều đứng trên cái khung được mô tả ở đây.</p>`],

      [2, 'Where the frame lives',
        `<p>Chapter 4 ended with a finished frame being turned into signals. This chapter asks the previous question: <strong>who built that frame?</strong></p>
<ul>
<li>Layer 3 hands down a <strong>packet</strong> — source and destination IP, valid from end to end.</li>
<li>Layer 2 wraps it in a <strong>frame</strong> — source and destination MAC, valid for <em>one hop only</em>, plus a checksum.</li>
<li>Layer 1 turns the frame into bits.</li>
</ul>
<p>Keep one sentence: <strong>layer 2 moves a packet across one link, and no further.</strong> Every confusing thing about MAC addresses follows from it.</p>`,
        `<p>Chương 4 kết thúc ở chỗ một cái khung hoàn chỉnh được biến thành tín hiệu. Chương này hỏi câu đứng trước đó: <strong>ai đã dựng nên cái khung ấy?</strong></p>
<ul>
<li>Tầng 3 đưa xuống một <strong>gói tin (packet)</strong> — IP nguồn và IP đích, có giá trị từ đầu này tới đầu kia.</li>
<li>Tầng 2 bọc nó vào một <strong>khung (frame)</strong> — MAC nguồn và MAC đích, chỉ có giá trị <em>trong đúng một chặng</em>, cộng thêm một mã kiểm tra.</li>
<li>Tầng 1 biến khung thành bit.</li>
</ul>
<p>Hãy nhớ đúng một câu: <strong>tầng 2 chuyển một gói tin qua một đường link, và không đi xa hơn.</strong> Mọi thứ khó hiểu về địa chỉ MAC đều suy ra từ câu đó.</p>`],

      [3, 'Four jobs, and nothing else',
        `<p>The data link layer has exactly four responsibilities. If you can name them, you can place almost any layer-2 fact.</p>
<ol>
<li><strong>Encapsulation</strong> — take the packet, add a header and a trailer, produce a frame.</li>
<li><strong>Local addressing</strong> — write the MAC of the sender on this link and of the receiver on this link.</li>
<li><strong>Media access control</strong> — decide who may transmit and when, so that two stations do not talk over each other.</li>
<li><strong>Error detection</strong> — compute a Frame Check Sequence so the receiver can tell a damaged frame from a good one.</li>
</ol>
<p>Note what is <em>not</em> on the list: no routing, no retransmission, no flow control worth the name on Ethernet. A frame that fails its checksum is discarded in silence.</p>`,
        `<p>Tầng liên kết dữ liệu có đúng bốn trách nhiệm. Nhớ được bốn cái tên này thì gần như dữ kiện tầng 2 nào bạn cũng biết xếp vào đâu.</p>
<ol>
<li><strong>Đóng gói</strong> — nhận gói tin, thêm phần đầu và phần đuôi, tạo ra một cái khung.</li>
<li><strong>Đánh địa chỉ cục bộ</strong> — ghi MAC của bên gửi trên link này và MAC của bên nhận trên link này.</li>
<li><strong>Điều khiển truy cập môi trường</strong> — quyết định ai được phát và phát lúc nào, để hai trạm không nói chồng lên nhau.</li>
<li><strong>Phát hiện lỗi</strong> — tính mã kiểm khung (FCS) để bên nhận phân biệt được khung hỏng với khung lành.</li>
</ol>
<p>Hãy để ý thứ <em>không</em> nằm trong danh sách: không định tuyến, không gửi lại, và trên Ethernet thì cũng không có điều khiển luồng nào đáng kể. Khung sai mã kiểm bị vứt đi trong im lặng.</p>`],

      [4, 'Two sublayers: LLC and MAC',
        `<p>IEEE splits layer 2 into two halves, and the split is not bureaucratic — it is what let IP be written once instead of once per cable type.</p>
<ul>
<li><strong>LLC — IEEE 802.2</strong>, the upper half. It faces the software above and answers "which layer-3 protocol is inside this frame?". It is the same code whether the medium is copper, fibre or radio.</li>
<li><strong>MAC — IEEE 802.3 (Ethernet), 802.11 (Wi-Fi)</strong>, the lower half. It faces the hardware and does the real work: framing, the MAC addresses, the FCS, and the media access rules.</li>
</ul>
<p>In practice, modern Ethernet II frames skip the LLC header and put a 2-byte <strong>EtherType</strong> in its place, which does the same job in less space. The LLC concept survives; the LLC header mostly does not.</p>`,
        `<p>IEEE chẻ tầng 2 làm hai nửa, và cách chẻ này không phải thủ tục hành chính — nó chính là thứ cho phép IP được viết một lần thay vì viết lại cho từng loại cáp.</p>
<ul>
<li><strong>LLC — IEEE 802.2</strong>, nửa trên. Nó quay mặt lên phần mềm và trả lời câu "bên trong khung này là giao thức tầng 3 nào?". Mã của nó giống hệt nhau dù môi trường là cáp đồng, cáp quang hay sóng.</li>
<li><strong>MAC — IEEE 802.3 (Ethernet), 802.11 (Wi-Fi)</strong>, nửa dưới. Nó quay mặt xuống phần cứng và làm phần việc thật: dựng khung, ghi địa chỉ MAC, tính FCS, và áp luật truy cập môi trường.</li>
</ul>
<p>Trên thực tế, khung Ethernet II hiện đại bỏ qua phần đầu LLC và thay bằng 2 byte <strong>EtherType</strong>, làm đúng việc đó mà tốn ít chỗ hơn. Khái niệm LLC vẫn còn; phần đầu LLC thì phần lớn đã biến mất.</p>`],

      [5, 'One packet, three different frames',
        `<p>This is the single most important picture in the chapter. A packet leaves PC-A for PC-B and crosses three different kinds of link.</p>
<ul>
<li><strong>Frame #1</strong> — Ethernet, from PC-A's MAC to R1's MAC.</li>
<li><strong>Frame #2</strong> — PPP across the WAN link. PPP has <em>no addresses at all</em>: there are only two ends, so "who is this for" has one possible answer.</li>
<li><strong>Frame #3</strong> — 802.11, from R2's MAC to PC-B's MAC.</li>
</ul>
<p>The IP packet inside never changes. Each router strips the incoming frame, looks at the packet, decides the next hop, and builds a <strong>brand new frame</strong> appropriate to the outgoing link. That is, in one sentence, what a router is.</p>`,
        `<p>Đây là bức hình quan trọng nhất của cả chương. Một gói tin rời PC-A đi tới PC-B và đi qua ba loại link khác nhau.</p>
<ul>
<li><strong>Khung #1</strong> — Ethernet, từ MAC của PC-A tới MAC của R1.</li>
<li><strong>Khung #2</strong> — PPP trên đường WAN. PPP <em>không có địa chỉ nào cả</em>: đường này chỉ có hai đầu, nên câu "cái này gửi cho ai" chỉ có một đáp án duy nhất.</li>
<li><strong>Khung #3</strong> — 802.11, từ MAC của R2 tới MAC của PC-B.</li>
</ul>
<p>Gói tin IP bên trong không hề đổi. Mỗi router lột bỏ khung vừa nhận, nhìn vào gói tin, quyết định chặng kế tiếp, rồi dựng một <strong>cái khung hoàn toàn mới</strong> hợp với đường link sắp đi ra. Đó, gói gọn trong một câu, chính là định nghĩa của router.</p>`],

      [6, 'A MAC address never leaves its link',
        `<p>Follow the two address pairs down a path and the rule becomes obvious.</p>
<ul>
<li>The <strong>IP pair</strong> — 192.168.1.10 to 8.8.8.8 — is written once and never touched again.</li>
<li>The <strong>MAC pair</strong> is rewritten at every single hop, because each hop is a different link with different neighbours.</li>
</ul>
<p>Three consequences you will use constantly:</p>
<ul>
<li>You cannot route to a MAC address, and there is no such command as <code>ping &lt;mac&gt;</code>.</li>
<li>If a device is not on your link, you will never learn its MAC — and you do not need to.</li>
<li>A MAC address in your ARP table is therefore always a <em>neighbour</em>: either the target itself, or the router standing in for everything beyond.</li>
</ul>`,
        `<p>Cứ bám theo hai cặp địa chỉ dọc đường đi là luật hiện ra ngay.</p>
<ul>
<li><strong>Cặp IP</strong> — 192.168.1.10 tới 8.8.8.8 — được ghi một lần rồi không ai đụng vào nữa.</li>
<li><strong>Cặp MAC</strong> bị ghi lại ở từng chặng một, vì mỗi chặng là một đường link khác, với những người hàng xóm khác.</li>
</ul>
<p>Ba hệ quả bạn sẽ dùng suốt:</p>
<ul>
<li>Không định tuyến tới địa chỉ MAC được, và cũng không tồn tại lệnh <code>ping &lt;mac&gt;</code> nào cả.</li>
<li>Nếu một thiết bị không nằm trên link của bạn thì bạn sẽ không bao giờ biết MAC của nó — và cũng không cần biết.</li>
<li>Vì thế một địa chỉ MAC nằm trong bảng ARP của bạn luôn luôn là một <em>người hàng xóm</em>: hoặc chính là đích, hoặc là cái router đứng ra nhận thay cho tất cả những gì ở xa hơn.</li>
</ul>`],

      [7, 'Who writes these rules',
        `<p>Layer 2 is the layer with the most standards bodies, because it touches physical equipment that must interoperate between vendors.</p>
<ul>
<li><strong>IEEE</strong> — the one that matters: 802.2 (LLC), 802.3 (Ethernet), 802.11 (Wi-Fi), 802.1Q (VLAN tagging).</li>
<li><strong>ITU-T</strong> — telecom heritage: G.992 (ADSL), Q.922 (Frame Relay).</li>
<li><strong>ISO</strong> — ISO 13239 (HDLC) and ISO 7498, the seven-layer model itself.</li>
<li><strong>ANSI</strong> — X3T9.5 (FDDI), now historical.</li>
</ul>
<p>Worth memorising three numbers: <strong>802.3</strong> is the cable, <strong>802.11</strong> is the air, <strong>802.1Q</strong> is the VLAN tag. Those three cover nearly everything you will touch in a data centre or an office.</p>`,
        `<p>Tầng 2 là tầng có nhiều tổ chức chuẩn hoá nhất, vì nó chạm vào thiết bị vật lý mà các hãng khác nhau bắt buộc phải hiểu nhau.</p>
<ul>
<li><strong>IEEE</strong> — tổ chức quan trọng nhất: 802.2 (LLC), 802.3 (Ethernet), 802.11 (Wi-Fi), 802.1Q (gắn thẻ VLAN).</li>
<li><strong>ITU-T</strong> — gốc viễn thông: G.992 (ADSL), Q.922 (Frame Relay).</li>
<li><strong>ISO</strong> — ISO 13239 (HDLC) và ISO 7498, tức chính cái mô hình bảy tầng.</li>
<li><strong>ANSI</strong> — X3T9.5 (FDDI), nay chỉ còn giá trị lịch sử.</li>
</ul>
<p>Đáng học thuộc ba con số: <strong>802.3</strong> là dây, <strong>802.11</strong> là sóng, <strong>802.1Q</strong> là thẻ VLAN. Ba cái đó phủ gần hết những gì bạn sẽ gặp trong một trung tâm dữ liệu hay một văn phòng.</p>`],
    ]),

    bi(
      `<h3>🧠 Why it was designed this way</h3>
<p>A fair question: why not give every machine one address and be done with it? The answer is a cost argument, and it is worth seeing properly.</p>
<p><strong>If there were only MAC addresses</strong> — flat, factory-assigned, unrelated to location — then every router on Earth would need a routing entry for every network card on Earth. There are billions. No table can hold that, and no protocol could keep it current.</p>
<p><strong>If there were only IP addresses</strong> — no layer 2 — then every link technology would have to implement IP addressing itself, and a machine could not be reached before it had an IP at all. DHCP would be impossible: the client has no address yet, so how does the offer get back to it? (It gets back by MAC.)</p>
<p>So the split is: <strong>IP is hierarchical and global, MAC is flat and local.</strong> Hierarchy makes routing tables small; flatness makes hardware cheap and plug-and-play. Each covers the other's weakness, and ARP is the twenty-line protocol that joins them.</p>`,
      `<h3>🧠 Vì sao lại thiết kế như vậy</h3>
<p>Một câu hỏi công bằng: sao không cho mỗi máy đúng một địa chỉ cho xong? Câu trả lời là một bài toán chi phí, và nên nhìn cho rõ.</p>
<p><strong>Nếu chỉ có địa chỉ MAC</strong> — phẳng, do nhà máy gán, chẳng liên quan gì tới vị trí — thì mọi router trên Trái Đất phải giữ một dòng định tuyến cho từng cái card mạng trên Trái Đất. Con số đó là hàng tỉ. Không bảng nào chứa nổi, và không giao thức nào cập nhật kịp.</p>
<p><strong>Nếu chỉ có địa chỉ IP</strong> — không có tầng 2 — thì mọi công nghệ đường truyền đều phải tự cài đặt lấy việc đánh địa chỉ IP, và một cái máy sẽ không thể liên lạc được khi nó chưa có IP. DHCP lúc đó là bất khả thi: máy con chưa có địa chỉ, vậy gói trả lời quay về bằng đường nào? (Nó quay về bằng MAC.)</p>
<p>Nên cách chia là: <strong>IP thì phân cấp và toàn cầu, MAC thì phẳng và cục bộ.</strong> Phân cấp làm bảng định tuyến nhỏ lại; phẳng làm phần cứng rẻ và cắm vào là chạy. Mỗi bên bù đúng điểm yếu của bên kia, và ARP là cái giao thức hai mươi dòng nối chúng lại.</p>`,
    ),

    bi(
      `<h3>🗺️ The same idea as a diagram</h3>
<pre><code class="language-mermaid">graph LR
  A["PC-A<br/>IP 192.168.1.10"] -->|"frame 1<br/>Ethernet"| R1["R1"]
  R1 -->|"frame 2<br/>PPP"| R2["R2"]
  R2 -->|"frame 3<br/>802.11"| B["PC-B<br/>IP 10.0.0.5"]
  classDef host fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef rt fill:#fff5d6,stroke:#b4690e,stroke-width:2px,color:#7a4708
  class A,B host
  class R1,R2 rt</code></pre>
<p>Blue boxes keep their IP addresses for the whole trip. The labels on the arrows are three <em>different frames</em>, each built and destroyed inside one hop.</p>`,
      `<h3>🗺️ Vẫn ý đó, vẽ ra sơ đồ</h3>
<pre><code class="language-mermaid">graph LR
  A["PC-A<br/>IP 192.168.1.10"] -->|"khung 1<br/>Ethernet"| R1["R1"]
  R1 -->|"khung 2<br/>PPP"| R2["R2"]
  R2 -->|"khung 3<br/>802.11"| B["PC-B<br/>IP 10.0.0.5"]
  classDef host fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef rt fill:#fff5d6,stroke:#b4690e,stroke-width:2px,color:#7a4708
  class A,B host
  class R1,R2 rt</code></pre>
<p>Hai hộp xanh giữ nguyên địa chỉ IP suốt chuyến đi. Nhãn trên các mũi tên là ba <em>cái khung khác nhau</em>, mỗi cái sinh ra rồi mất đi gọn trong một chặng.</p>`,
    ),

    bi(
      `<h3>🔎 How to check this yourself</h3>
<p>Three commands, on the machine you actually care about. Run them now, on your own server — the output is the lesson.</p>
<pre><code class="language-bash"># 1. What layer-2 interfaces exist, and what is their state and MAC?
ip -br link                       # Linux, one line per interface
ifconfig -a | grep -E 'flags|ether'   # macOS

# 2. Which neighbours has this machine actually spoken to at layer 2?
ip neigh                          # Linux: the ARP / neighbour cache
arp -an                           # macOS and older Linux

# 3. Prove the rule: the MAC for a far address is the ROUTER's MAC
ip route get 8.8.8.8              # which interface and which gateway?
ip neigh show 192.168.1.1         # the gateway's MAC — this is who really receives your frame</code></pre>
<p>How to read it:</p>
<pre><code class="language-plaintext">eth0  UP  52:54:00:a1:b2:c3          -> the interface exists and has carrier
lo    UNKNOWN 00:00:00:00:00:00      -> loopback has no real MAC; it never puts a frame on a wire
192.168.1.1 lladdr 00:1a:.. REACHABLE-> the neighbour answered ARP recently
192.168.1.77 FAILED                  -> ARP was sent and nobody replied: that host is off,
                                        firewalled, or not on this link at all
8.8.8.8 via 192.168.1.1 dev eth0     -> the frame carrying this packet is addressed to the
                                        GATEWAY's MAC, never to Google's</code></pre>
<p>That answers the opening question. 8.8.8.8 works because your machine never needs its MAC — it addresses the frame to the gateway and lets routing do the rest. 192.168.1.77 fails because it is on your own link, so the only way to reach it is a MAC address, and ARP got no reply. <strong>Near failures are layer 2; far successes are layer 3.</strong></p>`,
      `<h3>🔎 Cách tự kiểm</h3>
<p>Ba lệnh, chạy trên đúng cái máy bạn quan tâm. Hãy gõ ngay bây giờ trên máy chủ của bạn — kết xuất chính là bài học.</p>
<pre><code class="language-bash"># 1. Máy có những giao diện tầng 2 nào, trạng thái và MAC ra sao?
ip -br link                       # Linux, mỗi giao diện một dòng
ifconfig -a | grep -E 'flags|ether'   # macOS

# 2. Máy này đã thật sự nói chuyện với những hàng xóm nào ở tầng 2?
ip neigh                          # Linux: bộ nhớ đệm ARP / neighbour
arp -an                           # macOS và Linux đời cũ

# 3. Chứng minh cái luật: MAC ứng với một địa chỉ ở xa chính là MAC của ROUTER
ip route get 8.8.8.8              # đi ra giao diện nào, qua cổng ra nào?
ip neigh show 192.168.1.1         # MAC của cổng ra — đây mới là kẻ thật sự nhận khung của bạn</code></pre>
<p>Cách đọc:</p>
<pre><code class="language-plaintext">eth0  UP  52:54:00:a1:b2:c3          -> giao diện có thật và đang có sóng mang
lo    UNKNOWN 00:00:00:00:00:00      -> loopback không có MAC thật; nó không đặt khung lên dây bao giờ
192.168.1.1 lladdr 00:1a:.. REACHABLE-> hàng xóm này vừa trả lời ARP gần đây
192.168.1.77 FAILED                  -> đã gửi ARP mà không ai đáp: máy đó tắt, bị chặn,
                                        hoặc không hề nằm trên link này
8.8.8.8 via 192.168.1.1 dev eth0     -> khung chở gói tin này được đề địa chỉ tới MAC của
                                        CỔNG RA, không bao giờ tới MAC của Google</code></pre>
<p>Đó là đáp án cho câu hỏi mở đầu. 8.8.8.8 chạy được vì máy bạn chưa bao giờ cần biết MAC của nó — nó đề khung cho cổng ra rồi để việc định tuyến lo phần còn lại. Còn 192.168.1.77 thất bại vì nó nằm ngay trên link của bạn, nên cách duy nhất tới được nó là bằng địa chỉ MAC, mà ARP thì không ai đáp. <strong>Hỏng ở gần là chuyện tầng 2; chạy được ở xa là chuyện tầng 3.</strong></p>`,
    ),

    bi(
      `<h3>⚠️ Traps people actually fall into</h3>
<ol>
<li><strong>Expecting to see the destination's MAC in a capture.</strong> <em>Symptom:</em> you open Wireshark, ping a website, and the destination MAC belongs to your own router — you conclude the traffic is being hijacked. It is not. Every frame leaving your machine for the outside world is addressed to the gateway. That is normal and universal.</li>
<li><strong>Reading a FAILED neighbour entry as "the network is down".</strong> <em>Symptom:</em> one dead entry in <code>ip neigh</code> causes a panic. A FAILED entry is about <em>one host on one link</em>. If the default gateway is REACHABLE, your link is fine.</li>
<li><strong>Assuming a MAC address is unforgeable.</strong> <em>Symptom:</em> a security rule that trusts MAC addresses. <code>ip link set dev eth0 address 02:11:22:33:44:55</code> changes it in one command, without a reboot. MAC addresses identify hardware for convenience, never for security.</li>
<li><strong>Thinking the two sublayers are two pieces of software you can see.</strong> <em>Symptom:</em> looking for an "LLC service" on Linux. LLC and MAC are a conceptual division inside the driver and the NIC. What you can observe is the result: an EtherType field, MAC addresses, and an FCS the hardware checks before the kernel ever sees the frame.</li>
</ol>`,
      `<h3>⚠️ Bẫy hay mắc</h3>
<ol>
<li><strong>Mong nhìn thấy MAC của máy đích trong bản bắt gói.</strong> <em>Triệu chứng:</em> mở Wireshark, ping một trang web, thấy MAC đích lại là router nhà mình, rồi kết luận là lưu lượng bị cướp đường. Không phải. Mọi khung rời máy bạn đi ra ngoài đều đề địa chỉ cho cổng ra. Đó là chuyện bình thường và phổ quát.</li>
<li><strong>Đọc một dòng neighbour FAILED thành "mạng sập".</strong> <em>Triệu chứng:</em> một dòng chết trong <code>ip neigh</code> gây hoảng loạn. Dòng FAILED chỉ nói về <em>một máy trên một link</em>. Nếu cổng ra mặc định vẫn REACHABLE thì link của bạn vẫn lành.</li>
<li><strong>Tưởng địa chỉ MAC là thứ không giả được.</strong> <em>Triệu chứng:</em> đặt một luật bảo mật tin vào địa chỉ MAC. Lệnh <code>ip link set dev eth0 address 02:11:22:33:44:55</code> đổi nó trong một dòng, không cần khởi động lại. MAC nhận diện phần cứng cho tiện, không bao giờ để làm bảo mật.</li>
<li><strong>Nghĩ hai tầng con là hai phần mềm nhìn thấy được.</strong> <em>Triệu chứng:</em> đi tìm một "dịch vụ LLC" trên Linux. LLC và MAC là cách chia về mặt khái niệm bên trong trình điều khiển và con chip mạng. Thứ bạn quan sát được là kết quả: một trường EtherType, các địa chỉ MAC, và một FCS mà phần cứng đã kiểm xong trước khi nhân hệ điều hành kịp nhìn thấy cái khung.</li>
</ol>`,
    ),

    bi(
      `<h3>✍️ Exercises — with full answers</h3>
<p><strong>1.</strong> A packet travels PC → switch → router → router → server, five devices, four links. How many times is the IP header rewritten, and how many times is a frame built?</p>
<p><strong>2.</strong> Your laptop's ARP table contains exactly two entries: the gateway, and a printer. You have been browsing the web all morning. Why are there not hundreds of entries?</p>
<p><strong>3.</strong> PPP carries no address field at all. Name one thing that becomes impossible on a PPP link because of it, and explain why that does not matter.</p>
<details><summary>Answers</summary>
<p><strong>1.</strong> The IP source and destination are written <strong>once</strong> and never rewritten (TTL and the checksum do change at each router, but the addresses do not). A frame is built and destroyed <strong>four times</strong>, once per link. Note the switch does not count as a frame rebuild: a switch forwards the frame unchanged, it does not re-encapsulate — only routers do.</p>
<p><strong>2.</strong> Because ARP only ever resolves addresses <em>on your own link</em>. Every website you visited was reached by sending frames to the gateway's MAC, so no website ever needed an ARP entry. The size of an ARP table tells you how many neighbours you have, not how much you browsed.</p>
<p><strong>3.</strong> You cannot address a specific station: you cannot broadcast to "everyone except me", and there is no equivalent of a MAC-based filter. It does not matter because a PPP link has exactly two ends — anything you transmit can only arrive at one place. This is the cleanest evidence that layer-2 addressing exists purely to pick one neighbour out of several.</p>
</details>`,
      `<h3>✍️ Bài tập — có lời giải đầy đủ</h3>
<p><strong>1.</strong> Một gói tin đi PC → switch → router → router → server, năm thiết bị, bốn đường link. Phần đầu IP bị ghi lại mấy lần, và có bao nhiêu lần một cái khung được dựng lên?</p>
<p><strong>2.</strong> Bảng ARP trên laptop của bạn chỉ có đúng hai dòng: cổng ra và một cái máy in. Vậy mà bạn đã lướt web cả buổi sáng. Vì sao không có hàng trăm dòng?</p>
<p><strong>3.</strong> PPP không có trường địa chỉ nào cả. Hãy nêu một việc trở thành bất khả thi trên đường PPP vì lý do đó, và giải thích vì sao điều đó không quan trọng.</p>
<details><summary>Lời giải</summary>
<p><strong>1.</strong> IP nguồn và IP đích được ghi <strong>một lần</strong> và không bị ghi lại (TTL và mã kiểm tra có đổi ở mỗi router, nhưng địa chỉ thì không). Khung được dựng lên rồi phá đi <strong>bốn lần</strong>, mỗi link một lần. Lưu ý cái switch không tính là một lần dựng khung: switch chuyển tiếp nguyên cái khung, nó không đóng gói lại — chỉ router mới làm việc đó.</p>
<p><strong>2.</strong> Vì ARP chỉ phân giải địa chỉ <em>nằm trên chính link của bạn</em>. Mọi trang web bạn vào đều được với tới bằng cách gửi khung tới MAC của cổng ra, nên không trang nào cần một dòng ARP cả. Kích thước bảng ARP cho biết bạn có bao nhiêu hàng xóm, không cho biết bạn lướt web nhiều hay ít.</p>
<p><strong>3.</strong> Bạn không thể đề địa chỉ cho một trạm cụ thể: không thể phát tới "tất cả trừ tôi", và cũng không có thứ gì tương đương bộ lọc theo MAC. Điều đó không quan trọng vì đường PPP có đúng hai đầu — thứ gì bạn phát ra cũng chỉ có một nơi để tới. Đây là bằng chứng sạch nhất cho thấy việc đánh địa chỉ ở tầng 2 tồn tại thuần tuý để chọn ra một hàng xóm trong số nhiều hàng xóm.</p>
</details>`,
    ),

    bi(
      `<h3>💬 ★ Discussion questions for session 15</h3>
<p><strong>Note on the source table:</strong> FLM's Constructive Questions table jumps from <strong>CQ5.2 (session 14)</strong> straight to <strong>CQ6.1 (session 17)</strong> — sessions 15 and 16 are left blank, along with sessions 6, 9, 22, 30, 36 and 56. Reported, not corrected. The questions below are therefore <strong>written for this site</strong>, in the same style, so the session is not left without one.</p>
<ul>
<li><strong>★ Q1</strong> — A switch does not rebuild the frame; a router does. State the consequence of that difference for a network administrator in one sentence.</li>
<li><strong>★ Q2</strong> — Why can a machine with no IP address still receive a DHCP offer? Which layer solves it, and with which field?</li>
<li><strong>★ Q3</strong> — Two hosts have the same MAC address by accident (a cloned virtual machine). Describe what the network does, and why the symptom is intermittent rather than constant.</li>
</ul>`,
      `<h3>💬 ★ Câu hỏi thảo luận cho buổi 15</h3>
<p><strong>Ghi chú về bảng gốc:</strong> bảng Constructive Questions của FLM nhảy thẳng từ <strong>CQ5.2 (buổi 14)</strong> sang <strong>CQ6.1 (buổi 17)</strong> — buổi 15 và 16 bị bỏ trống, cùng với các buổi 6, 9, 22, 30, 36 và 56. Chỉ nêu, không tự sửa bảng gốc. Vì vậy các câu dưới đây <strong>do trang này soạn</strong>, viết theo đúng lối ấy, để buổi học không bị trống câu hỏi.</p>
<ul>
<li><strong>★ Câu 1</strong> — Switch không dựng lại khung, còn router thì có. Hãy nêu hệ quả của khác biệt đó đối với người quản trị mạng, gói trong một câu.</li>
<li><strong>★ Câu 2</strong> — Vì sao một cái máy chưa có địa chỉ IP nào vẫn nhận được gói DHCP offer? Tầng nào giải quyết chuyện đó, và bằng trường nào?</li>
<li><strong>★ Câu 3</strong> — Hai máy vô tình mang cùng một địa chỉ MAC (một máy ảo bị nhân bản). Hãy mô tả mạng sẽ xử sự ra sao, và vì sao triệu chứng lại chập chờn chứ không đứt hẳn.</li>
</ul>`,
    ),
  ].join('\n'),
};

/* ─────────────────── Lesson 5.2 — session 16, part 1 ──────────────────── */

const L2 = {
  title: '5.2 — Topologies and media access control (FLM session 16)|||5.2 — Tô-pô mạng và điều khiển truy cập môi trường (buổi 16 của FLM)',
  slug: 'nwc204-5-2-topo-mang-va-dieu-khien-truy-cap',
  type: 'DOCUMENT',
  description: 'Buổi 16 phần 1: tô-pô vật lý khác tô-pô logic, ba tô-pô WAN và bốn tô-pô LAN, bán song công so với song công đầy đủ, chẩn đoán lệch duplex bằng ethtool, và ba phương pháp truy cập môi trường CSMA/CD, CSMA/CA, chuyền thẻ bài.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 5 · Lesson 5.2 · FLM session 16 of 60 · CLO2, CLO4, CLO9 · Cisco Module 6</span>
<h2>Who is allowed to talk, and when</h2>
<p class="lead">Lesson 5.1 said layer 2 controls access to the medium. This lesson is that sentence unfolded: which shapes a network can take, which of those shapes force stations to share, and the three ways of sharing that were ever invented.</p>
<p><strong>Opening question:</strong> your router reports the laptop is connected at <strong>866 Mbps</strong>. You run a speed test against a machine on the same LAN and get <strong>about 400 Mbps</strong>, with nobody else using the Wi-Fi. Nothing is broken. Where did the other half go, and why is roughly half the expected answer?</p>`,
      `<span class="eyebrow">NWC204 · Chương 5 · Bài 5.2 · Buổi 16/60 của FLM · CLO2, CLO4, CLO9 · Cisco Module 6</span>
<h2>Ai được nói, và nói lúc nào</h2>
<p class="lead">Bài 5.1 nói tầng 2 điều khiển việc truy cập môi trường truyền. Bài này chính là câu đó mở ra: mạng có thể mang những hình dạng nào, hình dạng nào buộc các trạm phải dùng chung, và ba cách dùng chung mà loài người từng nghĩ ra.</p>
<p><strong>Câu hỏi mở đầu:</strong> router báo laptop đang nối ở <strong>866 Mbps</strong>. Bạn đo tốc độ với một máy khác trong cùng mạng LAN và chỉ được <strong>khoảng 400 Mbps</strong>, trong khi không có ai khác dùng Wi-Fi. Không có gì hỏng cả. Nửa còn lại đi đâu, và vì sao "khoảng một nửa" lại là đáp án đúng?</p>`,
    ),

    walkHead('nwc204-ch05', 8, 16,
      'Slides 8–16 cover the first half of FLM session 16: 5.2 Topologies — physical versus logical, WAN and LAN shapes, duplex, and the three media access control methods.',
      'Slide 8–16 là nửa đầu buổi 16 của FLM: 5.2 Topologies — vật lý so với logic, các hình dạng WAN và LAN, duplex, và ba phương pháp điều khiển truy cập môi trường.'),

    walk('nwc204-ch05', [
      [8, 'Physical topology vs logical topology',
        `<p>Two different questions, asked about the same cables.</p>
<ul>
<li><strong>Physical topology</strong> — where the cables physically run and what is plugged into what. You can photograph it.</li>
<li><strong>Logical topology</strong> — how frames actually reach one another, which is what the protocol has to cope with.</li>
</ul>
<p>They are allowed to disagree, and usually do:</p>
<ul>
<li>A VPN is <em>physically</em> a path across dozens of routers and <em>logically</em> a single point-to-point link.</li>
<li>A Wi-Fi cell is <em>physically</em> a star around the access point and <em>logically</em> a shared bus, because every station shares one channel.</li>
<li>Old coaxial Ethernet was physically a bus; a modern switch is physically a star and logically point-to-point per port.</li>
</ul>
<p>When you are troubleshooting, the logical topology is the one that explains the behaviour. When you are cabling, the physical one is the one that hurts.</p>`,
        `<p>Hai câu hỏi khác nhau, hỏi về cùng một mớ dây.</p>
<ul>
<li><strong>Tô-pô vật lý</strong> — dây chạy ở đâu và cái gì cắm vào cái gì. Cái này chụp ảnh được.</li>
<li><strong>Tô-pô logic</strong> — khung tin thật sự tới được nhau bằng cách nào, và đây mới là thứ giao thức phải xoay xở.</li>
</ul>
<p>Hai cái được phép khác nhau, và thường là khác nhau thật:</p>
<ul>
<li>Một đường VPN <em>về vật lý</em> là một lối đi xuyên qua hàng chục router, mà <em>về logic</em> lại là một đường điểm-tới-điểm duy nhất.</li>
<li>Một ô Wi-Fi <em>về vật lý</em> là hình sao quanh điểm truy cập, mà <em>về logic</em> lại là một cái bus dùng chung, vì mọi trạm xài chung một kênh sóng.</li>
<li>Ethernet cáp đồng trục ngày xưa về vật lý là bus; switch ngày nay về vật lý là sao và về logic là điểm-tới-điểm trên từng cổng.</li>
</ul>
<p>Lúc đi tìm lỗi thì tô-pô logic mới là cái giải thích được hiện tượng. Lúc đi kéo dây thì tô-pô vật lý mới là cái làm bạn khổ.</p>`],

      [9, 'WAN topologies',
        `<p>Three shapes, and the whole choice is a cost-versus-survival argument.</p>
<ul>
<li><strong>Point-to-point</strong> — two nodes, one link. The simplest thing that exists, and the only topology with no media-access question at all.</li>
<li><strong>Hub and spoke</strong> — one central site, many branches. Cheap, easy to manage, and the centre is a single point of failure for everybody.</li>
<li><strong>Mesh</strong> — every site to every site. Survives any single failure, and costs <strong>n(n−1)/2</strong> links.</li>
</ul>
<p>Read the table as a budget: five sites full mesh is 10 links, ten sites is 45. Doubling the sites more than quadruples the cost, which is why real networks are usually hub-and-spoke with a <em>partial</em> mesh between the two or three sites that must never be isolated.</p>`,
        `<p>Ba hình dạng, và toàn bộ lựa chọn chỉ là bài toán cân giữa chi phí và khả năng sống sót.</p>
<ul>
<li><strong>Điểm-tới-điểm</strong> — hai nút, một đường. Thứ đơn giản nhất có thể có, và là tô-pô duy nhất không phải đặt câu hỏi truy cập môi trường nào cả.</li>
<li><strong>Trục và nan hoa (hub and spoke)</strong> — một điểm trung tâm, nhiều chi nhánh. Rẻ, dễ quản, và cái trung tâm là điểm chết chung của tất cả.</li>
<li><strong>Lưới (mesh)</strong> — điểm nào cũng nối tới mọi điểm. Sống sót qua bất kỳ sự cố đơn lẻ nào, và tốn <strong>n(n−1)/2</strong> đường.</li>
</ul>
<p>Hãy đọc cái bảng như đọc một bản dự toán: năm điểm nối lưới đầy đủ là 10 đường, mười điểm là 45 đường. Nhân đôi số điểm thì chi phí tăng hơn bốn lần, và đó là lý do mạng thật thường là trục–nan hoa cộng thêm <em>một phần</em> lưới giữa hai ba điểm không được phép bị cô lập.</p>`],

      [10, 'LAN topologies',
        `<p>Inside a building the choice has already been made for you: <strong>star</strong>, and extended star for anything bigger than one floor.</p>
<ul>
<li><strong>Star</strong> — every host to a central switch. One failed cable removes one host.</li>
<li><strong>Extended star</strong> — access switches on each floor, uplinked to a distribution switch. This is what every office and every data centre is.</li>
<li><strong>Bus</strong> — one shared coaxial cable with a terminator at each end. One break killed the whole segment. Gone, but you must understand it to understand CSMA/CD.</li>
<li><strong>Ring</strong> — a closed loop, each station passing frames on. Gone commercially, but its idea (token passing) is still alive in industrial buses.</li>
</ul>
<p>Star won because of what happens at the switch: <strong>each port becomes its own collision domain</strong>. The entire contention problem the next slides describe simply stops existing.</p>`,
        `<p>Trong một toà nhà thì lựa chọn đã được quyết sẵn cho bạn rồi: <strong>hình sao</strong>, và sao mở rộng cho bất cứ thứ gì lớn hơn một tầng lầu.</p>
<ul>
<li><strong>Sao</strong> — mọi máy nối về một switch trung tâm. Đứt một sợi dây thì mất một máy.</li>
<li><strong>Sao mở rộng</strong> — switch truy cập ở từng tầng, đấu lên switch phân phối. Mọi văn phòng và mọi trung tâm dữ liệu đều là hình này.</li>
<li><strong>Bus</strong> — một sợi cáp đồng trục dùng chung, hai đầu gắn điện trở kết cuối. Đứt một chỗ là chết cả đoạn mạng. Đã tuyệt chủng, nhưng phải hiểu nó thì mới hiểu được CSMA/CD.</li>
<li><strong>Vòng</strong> — một vòng khép kín, mỗi trạm chuyền khung đi tiếp. Đã hết thương mại, nhưng ý tưởng của nó (chuyền thẻ bài) vẫn sống trong các bus công nghiệp.</li>
</ul>
<p>Hình sao thắng là nhờ thứ xảy ra bên trong switch: <strong>mỗi cổng trở thành một miền xung đột riêng</strong>. Toàn bộ bài toán tranh chấp mà mấy slide tới mô tả đơn giản là không còn tồn tại nữa.</p>`],

      [11, 'Half duplex and full duplex',
        `<p>Read the two timelines. They are the same two stations, under two different rules.</p>
<ul>
<li><strong>Half duplex</strong> — one station may transmit at a time. If both start, the signals add up on the wire and both frames are destroyed: a <em>collision</em>. Required on any shared medium — a hub, old coax, and every radio.</li>
<li><strong>Full duplex</strong> — transmit and receive use separate paths (separate pairs on copper, separate strands on fibre), so both directions run at once. There is no collision domain, and collision detection is switched off entirely.</li>
</ul>
<p>Every switch port you will ever configure is full duplex. Half duplex on a switched port in 2026 is not a design choice, it is a fault — which is what the next slide is about.</p>`,
        `<p>Hãy đọc hai dải thời gian. Vẫn hai trạm đó, dưới hai luật chơi khác nhau.</p>
<ul>
<li><strong>Bán song công (half duplex)</strong> — mỗi lúc chỉ một trạm được phát. Nếu cả hai cùng bắt đầu, tín hiệu cộng lên nhau trên dây và cả hai khung đều hỏng: một vụ <em>xung đột</em>. Bắt buộc phải có trên mọi môi trường dùng chung — hub, cáp đồng trục cũ, và mọi loại sóng.</li>
<li><strong>Song công đầy đủ (full duplex)</strong> — phát và nhận đi trên hai đường riêng (đôi dây riêng trên cáp đồng, sợi riêng trên cáp quang), nên hai chiều chạy cùng lúc. Không còn miền xung đột, và cơ chế phát hiện xung đột bị tắt hẳn.</li>
</ul>
<p>Mọi cổng switch bạn sẽ cấu hình đều là song công đầy đủ. Bán song công trên một cổng switch vào năm 2026 không phải là lựa chọn thiết kế, nó là một lỗi — và đó chính là nội dung slide kế tiếp.</p>`],

      [12, '★ Duplex mismatch: the 3 MB/s ghost',
        `<p>★ Not in Module 6, but it is one of the two or three faults you are most likely to meet on real equipment, and the symptom is famously misleading.</p>
<p><strong>How it happens:</strong> one end was configured by hand (<code>speed 100 / duplex full</code>), the other was left on auto-negotiation. Auto-negotiation needs a partner; when it does not get one it falls back to half duplex. Now one end believes it may transmit at any time and the other believes it must wait.</p>
<p><strong>What you see:</strong> the link is UP. Ping succeeds, because ping is tiny and rarely collides. A large transfer collapses to a few MB/s, and <code>late collisions</code> climb on the half-duplex side. No log message anywhere says "duplex mismatch".</p>
<p><strong>The rule:</strong> auto-negotiate on both ends, or force both ends. Never one of each.</p>`,
        `<p>★ Không có trong Module 6, nhưng đây là một trong hai ba lỗi bạn dễ gặp nhất trên thiết bị thật, và triệu chứng của nó nổi tiếng là đánh lừa người ta.</p>
<p><strong>Nó xảy ra thế nào:</strong> một đầu bị cấu hình tay (<code>speed 100 / duplex full</code>), đầu kia để tự thương lượng. Mà tự thương lượng thì cần có bạn nhảy; không có ai đáp thì nó tụt về bán song công. Thế là một đầu tin rằng mình muốn phát lúc nào cũng được, còn đầu kia tin rằng mình phải chờ.</p>
<p><strong>Thứ bạn nhìn thấy:</strong> đường link vẫn UP. Ping vẫn thông, vì gói ping bé tí và ít khi đụng. Còn chép một file lớn thì tụt xuống vài MB/s, và bộ đếm <code>late collisions</code> ở phía bán song công cứ tăng. Không dòng log nào ở đâu nói chữ "duplex mismatch" cả.</p>
<p><strong>Luật:</strong> để tự thương lượng ở cả hai đầu, hoặc ép cứng cả hai đầu. Tuyệt đối không mỗi bên một kiểu.</p>`],

      [13, 'Media access control: one question',
        `<p>Everything about access methods reduces to one question: <strong>is the medium shared?</strong></p>
<ul>
<li><strong>No</strong> — a switched, full-duplex port, or a point-to-point WAN link. Then just transmit. No method is needed, and none is used.</li>
<li><strong>Yes</strong> — then you need a rule, and there are exactly two families of rule.</li>
</ul>
<p><strong>Contention-based</strong> (CSMA/CD, CSMA/CA): anybody may try; sort out the crashes afterwards. Efficient when the network is quiet, degrades badly as it fills.</p>
<p><strong>Controlled</strong> (token passing, polling): wait your turn, always. Predictable under any load, and wasteful when quiet because a station with nothing to say still costs a turn.</p>
<p>Ethernet chose contention and won — because switching removed the contention entirely, which is a better answer than managing it.</p>`,
        `<p>Mọi thứ về phương pháp truy cập rút lại thành một câu hỏi: <strong>môi trường có bị dùng chung không?</strong></p>
<ul>
<li><strong>Không</strong> — một cổng switch song công đầy đủ, hoặc một đường WAN điểm-tới-điểm. Vậy thì cứ phát. Không cần phương pháp nào, và cũng chẳng dùng phương pháp nào.</li>
<li><strong>Có</strong> — thì phải có luật, và luật chỉ thuộc đúng hai họ.</li>
</ul>
<p><strong>Dựa trên tranh chấp</strong> (CSMA/CD, CSMA/CA): ai muốn thử cũng được; đụng nhau thì xử lý sau. Hiệu quả khi mạng vắng, xuống cấp rất nhanh khi mạng đông.</p>
<p><strong>Có điều khiển</strong> (chuyền thẻ bài, hỏi vòng): luôn luôn phải chờ tới lượt. Ổn định dưới mọi mức tải, và phí phạm khi vắng vì một trạm không có gì để nói vẫn tốn một lượt.</p>
<p>Ethernet chọn tranh chấp và thắng — bởi vì chuyển mạch đã xoá bỏ luôn sự tranh chấp, mà xoá bỏ thì hay hơn là quản lý.</p>`],

      [14, 'CSMA/CD — detect the crash',
        `<p>Carrier Sense Multiple Access with Collision Detection, the rule of shared Ethernet. Five steps:</p>
<ol>
<li><strong>Carrier sense</strong> — listen to the wire. Busy? wait until it is quiet.</li>
<li><strong>Transmit</strong> — and keep listening to your own signal while you do.</li>
<li><strong>Collision detected</strong> — the voltage on the wire is not what you put there, so somebody else started too.</li>
<li><strong>Jam signal</strong> — send 32 bits of noise so every station is certain a collision happened.</li>
<li><strong>Random backoff</strong> — wait k × 51.2 µs where k is random in 0…2ⁿ−1 and n is the attempt number. Retry; give up after 16 attempts.</li>
</ol>
<p>The randomness is the clever part: if both stations waited the same time they would collide again forever. Doubling the range each attempt is called <em>truncated binary exponential backoff</em>, and the same idea is used by TCP and by every sane API client.</p>`,
        `<p>Carrier Sense Multiple Access with Collision Detection — luật của Ethernet dùng chung. Năm bước:</p>
<ol>
<li><strong>Nghe sóng mang</strong> — lắng nghe trên dây. Đang bận? chờ tới lúc im.</li>
<li><strong>Phát</strong> — và vừa phát vừa tiếp tục nghe chính tín hiệu của mình.</li>
<li><strong>Phát hiện xung đột</strong> — điện áp trên dây không phải thứ mình vừa đặt lên, tức là có kẻ khác cũng bắt đầu.</li>
<li><strong>Tín hiệu nhiễu (jam)</strong> — phát 32 bit nhiễu để mọi trạm đều chắc chắn là vừa có xung đột.</li>
<li><strong>Lùi ngẫu nhiên</strong> — chờ k × 51,2 µs, với k ngẫu nhiên trong 0…2ⁿ−1 và n là lần thử thứ mấy. Thử lại; quá 16 lần thì bỏ cuộc.</li>
</ol>
<p>Cái khôn nằm ở chỗ ngẫu nhiên: nếu hai trạm chờ đúng bằng nhau thì chúng sẽ đụng nhau mãi mãi. Nhân đôi khoảng chờ sau mỗi lần thử gọi là <em>lùi theo hàm mũ nhị phân có chặn</em>, và đúng ý tưởng đó được TCP dùng, và được mọi client gọi API tử tế dùng.</p>`],

      [15, 'CSMA/CA — avoid it instead',
        `<p>Wi-Fi cannot do the "CD" part at all. A radio transmitting at full power cannot hear a distant station at the same moment on the same channel — its own transmitter drowns everything. So 802.11 replaces detection with <strong>avoidance plus acknowledgement</strong>.</p>
<ol>
<li>Listen until the air has been idle for a fixed interval (DIFS), then wait a random backoff on top.</li>
<li>Optionally send <strong>RTS</strong> ("request to send, I have 1500 bytes").</li>
<li>The access point replies <strong>CTS</strong> ("clear to send") — which every other station also hears, and which tells them all to stay quiet for that duration.</li>
<li>Send the data frame.</li>
<li>The receiver sends an <strong>ACK</strong>. No ACK means the frame was lost, and the sender retransmits.</li>
</ol>
<p>That ACK is compulsory for every single unicast frame, and it costs air time. Together with the half-duplex channel and the inter-frame gaps, it is why measured Wi-Fi throughput lands near half the advertised rate.</p>`,
        `<p>Wi-Fi hoàn toàn không làm được phần "CD". Một cái đài đang phát hết công suất thì không thể cùng lúc nghe được một trạm ở xa trên cùng kênh — bộ phát của chính nó át hết. Nên 802.11 thay việc phát hiện bằng <strong>tránh né cộng với báo nhận</strong>.</p>
<ol>
<li>Nghe cho tới khi không trung im lặng đủ một khoảng cố định (DIFS), rồi chờ thêm một quãng lùi ngẫu nhiên nữa.</li>
<li>Có thể gửi <strong>RTS</strong> ("xin phép phát, tôi có 1500 byte").</li>
<li>Điểm truy cập đáp <strong>CTS</strong> ("được phép phát") — mà mọi trạm khác cũng nghe thấy, và câu đó bảo tất cả bọn họ im lặng trong đúng khoảng thời gian ấy.</li>
<li>Gửi khung dữ liệu.</li>
<li>Bên nhận gửi <strong>ACK</strong>. Không có ACK nghĩa là khung đã mất, và bên gửi phát lại.</li>
</ol>
<p>Cái ACK đó là bắt buộc với từng khung unicast một, và nó ngốn thời lượng sóng. Cộng với kênh bán song công và các khoảng trống giữa khung, đó là lý do tốc độ Wi-Fi đo được luôn rơi vào khoảng một nửa con số quảng cáo.</p>`],

      [16, 'Controlled access: token passing',
        `<p>The other family. A special frame — the <strong>token</strong> — circulates, and only the station holding it may transmit. When it finishes, it passes the token on.</p>
<ul>
<li><strong>Good:</strong> zero collisions by construction, and a worst-case delay you can calculate exactly — with n stations, you wait at most n turns.</li>
<li><strong>Bad:</strong> a station with nothing to send still costs a turn, so a quiet network wastes most of its capacity.</li>
<li><strong>Where it went:</strong> Token Ring (IEEE 802.5) and FDDI lost commercially to Ethernet on price and cabling, not on merit.</li>
<li><strong>Where it survives:</strong> industrial fieldbuses, avionics and some real-time control networks — anywhere "predictable" is worth more than "fast".</li>
</ul>
<p>The trade-off is worth carrying with you: contention optimises the average case, control optimises the worst case. That choice recurs far outside networking.</p>`,
        `<p>Họ còn lại. Một khung đặc biệt — <strong>thẻ bài (token)</strong> — chạy vòng quanh, và chỉ trạm nào đang giữ nó mới được phát. Phát xong thì chuyền thẻ đi tiếp.</p>
<ul>
<li><strong>Hay:</strong> không xung đột, do chính cách thiết kế, và độ trễ xấu nhất tính ra được chính xác — có n trạm thì chờ nhiều nhất n lượt.</li>
<li><strong>Dở:</strong> trạm không có gì để gửi vẫn tốn một lượt, nên mạng vắng thì phí gần hết năng lực.</li>
<li><strong>Nó đi đâu mất:</strong> Token Ring (IEEE 802.5) và FDDI thua Ethernet trên thương trường vì giá và vì dây, chứ không phải vì dở.</li>
<li><strong>Nó còn sống ở đâu:</strong> các bus công nghiệp, hàng không và vài mạng điều khiển thời gian thực — chỗ nào mà "đoán trước được" đáng giá hơn "nhanh".</li>
</ul>
<p>Cái đánh đổi này đáng mang theo suốt đời: tranh chấp thì tối ưu cho trường hợp trung bình, điều khiển thì tối ưu cho trường hợp xấu nhất. Lựa chọn đó lặp lại ở rất nhiều nơi ngoài ngành mạng.</p>`],
    ]),

    bi(
      `<h3>🗺️ Choosing an access method, as a decision</h3>
<pre><code class="language-mermaid">graph TD
  Q{"Is the medium<br/>shared?"} -->|no| S["Just transmit<br/>switched, full duplex"]
  Q -->|"yes, wired"| CD["CSMA/CD<br/>detect and back off"]
  Q -->|"yes, radio"| CA["CSMA/CA<br/>avoid, then ACK"]
  Q -->|"yes, deterministic"| TK["Token passing<br/>wait your turn"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  classDef m fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  class Q ask
  class S ok
  class CD,CA,TK m</code></pre>
<p>Only the green branch describes a modern wired LAN. The three blue branches are what you fall back into the moment a medium becomes shared — and Wi-Fi is always shared.</p>`,
      `<h3>🗺️ Chọn phương pháp truy cập, vẽ thành quyết định</h3>
<pre><code class="language-mermaid">graph TD
  Q{"Môi trường có<br/>dùng chung không?"} -->|không| S["Cứ phát<br/>switch, song công đầy đủ"]
  Q -->|"có, có dây"| CD["CSMA/CD<br/>phát hiện rồi lùi"]
  Q -->|"có, sóng"| CA["CSMA/CA<br/>tránh né, rồi ACK"]
  Q -->|"có, cần đoán trước"| TK["Chuyền thẻ bài<br/>chờ tới lượt"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  classDef m fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  class Q ask
  class S ok
  class CD,CA,TK m</code></pre>
<p>Chỉ nhánh màu xanh lá mới mô tả một mạng LAN có dây thời nay. Ba nhánh xanh dương là thứ bạn rơi vào ngay khi môi trường trở thành dùng chung — mà Wi-Fi thì lúc nào cũng dùng chung.</p>`,
    ),

    bi(
      `<h3>🔎 How to check this yourself</h3>
<p>The whole of this lesson is observable on your own machines in about two minutes.</p>
<pre><code class="language-bash"># 1. Duplex and speed — the fault from slide 12
ethtool eth0 | grep -E 'Speed|Duplex|Auto-negotiation'   # Linux
ifconfig en0 | grep media                                 # macOS

# 2. Are there collisions at all? On a switched port there must be none.
ip -s link show eth0          # read it twice, 60 seconds apart
netstat -i                    # portable, shows Coll column on some systems

# 3. Wi-Fi: what rate is actually negotiated, and on which channel width?
iw dev wlan0 link                                        # Linux
system_profiler SPAirPortDataType | grep -A4 'Current'   # macOS

# 4. Logical topology of your own host: which interfaces share a bridge?
bridge link                   # every port attached to a Linux bridge
ip -br link show type bridge</code></pre>
<p>How to read it:</p>
<pre><code class="language-plaintext">Speed: 1000Mb/s Duplex: Full  Auto-negotiation: on   -> healthy switched port
Speed: 100Mb/s  Duplex: Half                         -> mismatch or a dying cable: investigate
collisions: 0                                        -> as it must be on full duplex
collisions rising on a switch port                   -> one end is half duplex. This is the fault.
tx bitrate: 866.7 MBit/s   (Wi-Fi)                   -> PHY rate, NOT throughput
measured ~400 Mbit/s over that link                  -> normal: about half, by design</code></pre>
<p>That answers the opening question. 866 Mbps is the <strong>PHY rate</strong> — the speed of the bits while a frame is in the air. Between frames the channel is idle for DIFS, a random backoff, and an ACK from the receiver; the channel is half duplex, so none of that overlaps with data. Roughly half the air time is therefore not carrying your payload. Measuring 400–450 Mbps on an 866 Mbps link is a <em>healthy</em> result, not a fault.</p>`,
      `<h3>🔎 Cách tự kiểm</h3>
<p>Toàn bộ bài này quan sát được trên chính máy của bạn trong khoảng hai phút.</p>
<pre><code class="language-bash"># 1. Duplex và tốc độ — đúng cái lỗi ở slide 12
ethtool eth0 | grep -E 'Speed|Duplex|Auto-negotiation'   # Linux
ifconfig en0 | grep media                                 # macOS

# 2. Có xung đột nào không? Trên cổng switch thì phải bằng không.
ip -s link show eth0          # đọc hai lần, cách nhau 60 giây
netstat -i                    # chạy được nhiều nơi, vài hệ có cột Coll

# 3. Wi-Fi: tốc độ thương lượng thật là bao nhiêu, độ rộng kênh nào?
iw dev wlan0 link                                        # Linux
system_profiler SPAirPortDataType | grep -A4 'Current'   # macOS

# 4. Tô-pô logic của chính máy bạn: những giao diện nào đang chung một cầu nối?
bridge link                   # mọi cổng đang cắm vào một bridge của Linux
ip -br link show type bridge</code></pre>
<p>Cách đọc:</p>
<pre><code class="language-plaintext">Speed: 1000Mb/s Duplex: Full  Auto-negotiation: on   -> cổng switch khoẻ mạnh
Speed: 100Mb/s  Duplex: Half                         -> lệch duplex hoặc cáp sắp chết: phải soi
collisions: 0                                        -> đúng như bắt buộc với song công đầy đủ
collisions tăng trên cổng switch                     -> một đầu đang bán song công. Chính là lỗi.
tx bitrate: 866.7 MBit/s   (Wi-Fi)                   -> tốc độ lớp vật lý, KHÔNG phải thông lượng
đo thật được ~400 Mbit/s trên đường đó               -> bình thường: khoảng một nửa, do thiết kế</code></pre>
<p>Đó là đáp án câu hỏi mở đầu. 866 Mbps là <strong>tốc độ lớp vật lý</strong> — tốc độ của các bit trong lúc một cái khung đang bay trên không. Giữa hai khung, kênh sóng phải im trong khoảng DIFS, thêm một quãng lùi ngẫu nhiên, rồi một cái ACK từ bên nhận; kênh lại là bán song công nên không việc nào trong số đó chồng lên dữ liệu được. Vì vậy khoảng một nửa thời lượng sóng không chở dữ liệu của bạn. Đo được 400–450 Mbps trên đường 866 Mbps là kết quả <em>khoẻ mạnh</em>, không phải lỗi.</p>`,
    ),

    bi(
      `<h3>⚠️ Traps people actually fall into</h3>
<ol>
<li><strong>Quoting the PHY rate as the speed.</strong> <em>Symptom:</em> "we pay for Wi-Fi 6 and only get half". Every wireless rate ever printed on a box is the on-air bit rate of a single frame. Usable TCP throughput of roughly half is the expected result, and on a busy channel it is less.</li>
<li><strong>Forcing speed and duplex to "make it stable".</strong> <em>Symptom:</em> an engineer hard-codes one end, the problem gets worse. Forcing one end <em>causes</em> the mismatch it was meant to cure, because the far end's auto-negotiation then fails and falls back to half duplex.</li>
<li><strong>Looking for collisions on a full-duplex port and panicking when the counter is zero.</strong> Zero is correct. On full duplex the collision counter is meaningless; the counters that matter there are errors, drops and CRC.</li>
<li><strong>Confusing a hub with a switch because both have ports.</strong> <em>Symptom:</em> "why does the network slow down when everyone copies files?" A hub repeats every bit to every port: one shared collision domain. A switch forwards per destination: one collision domain per port. If you ever meet a hub in production, the fix is to replace it, not to tune it.</li>
<li><strong>Assuming a VPN behaves like a LAN because it "looks" like one.</strong> <em>Symptom:</em> broadcast-based discovery (printers, mDNS) silently fails over the tunnel. A routed VPN is logically point-to-point: it carries no broadcasts, so anything that relies on them stops.</li>
</ol>`,
      `<h3>⚠️ Bẫy hay mắc</h3>
<ol>
<li><strong>Đem tốc độ lớp vật lý ra nói như tốc độ thật.</strong> <em>Triệu chứng:</em> "trả tiền Wi-Fi 6 mà chỉ được một nửa". Mọi con số tốc độ không dây in trên vỏ hộp đều là tốc độ bit trên sóng của một cái khung. Thông lượng TCP dùng được vào khoảng một nửa là kết quả đúng như dự kiến, và kênh đông thì còn thấp hơn.</li>
<li><strong>Ép cứng tốc độ với duplex cho "nó ổn định".</strong> <em>Triệu chứng:</em> kỹ sư ép cứng một đầu, sự cố nặng thêm. Ép một đầu chính là thứ <em>gây ra</em> cái lệch duplex mà nó định chữa, vì đầu kia thương lượng không có bạn nên tụt về bán song công.</li>
<li><strong>Đi tìm xung đột trên cổng song công đầy đủ rồi hoảng khi thấy số không.</strong> Số không mới là đúng. Trên song công đầy đủ thì bộ đếm xung đột vô nghĩa; bộ đếm cần nhìn ở đó là lỗi, rớt gói và CRC.</li>
<li><strong>Lẫn hub với switch vì cả hai đều có nhiều cổng.</strong> <em>Triệu chứng:</em> "sao cứ ai cũng chép file là mạng chậm?" Hub lặp lại từng bit ra mọi cổng: một miền xung đột dùng chung. Switch chuyển tiếp theo đích: mỗi cổng một miền xung đột. Nếu còn gặp hub trong hệ thống đang chạy thì cách sửa là thay nó, không phải tinh chỉnh nó.</li>
<li><strong>Tưởng VPN xử sự như LAN vì nó "trông giống" LAN.</strong> <em>Triệu chứng:</em> các cơ chế dò tìm bằng broadcast (máy in, mDNS) chết câm qua đường hầm. Một VPN định tuyến về logic là điểm-tới-điểm: nó không chở broadcast, nên thứ gì dựa vào broadcast là ngừng hoạt động.</li>
</ol>`,
    ),

    bi(
      `<h3>✍️ Exercises — with full answers</h3>
<p><strong>1.</strong> A company has 8 branch offices. Compare the number of WAN links needed for hub-and-spoke versus full mesh, and state one failure each design survives that the other does not.</p>
<p><strong>2.</strong> A 24-port switch replaces a 24-port hub. How many collision domains were there before, and how many after? What happens to the need for CSMA/CD?</p>
<p><strong>3.</strong> Two stations on a half-duplex segment collide. Station A picks a backoff of k=0 and station B picks k=3. Using 51.2 µs slots, how long does each wait, and what happens next?</p>
<p><strong>4. ★</strong> You are told "the link is fine, ping works". Name three measurements that could all be true at once while the link is still faulty.</p>
<details><summary>Answers</summary>
<p><strong>1.</strong> Hub-and-spoke with 8 branches plus one centre: <strong>8 links</strong>. Full mesh of 9 sites: 9 × 8 ÷ 2 = <strong>36 links</strong>. Full mesh survives the loss of the central site, which would isolate everybody in hub-and-spoke; hub-and-spoke survives a tight budget, which full mesh does not.</p>
<p><strong>2.</strong> Before: <strong>one</strong> collision domain shared by all 24 ports. After: <strong>24</strong> collision domains, one per port. Since each port is also full duplex, CSMA/CD is disabled entirely — the algorithm still exists in the standard, and is never invoked.</p>
<p><strong>3.</strong> A waits 0 × 51.2 = <strong>0 µs</strong> and retransmits immediately; B waits 3 × 51.2 = <strong>153.6 µs</strong>. A therefore captures the medium and finishes; B senses the carrier is busy and continues to wait, then transmits cleanly. The randomness is what breaks the tie — had both chosen the same k, they would have collided again.</p>
<p><strong>4. ★</strong> (a) <code>ip -br link</code> shows UP — carrier only, says nothing about quality. (b) ping succeeds — 64-byte packets, too small to trigger an MTU problem or to lose a collision race. (c) the interface has an IP and a route — layer 3 is configured. All three can be true while duplex is mismatched, CRC errors are climbing, or the MTU is wrong. "Up" is the weakest claim a network can make.</p>
</details>`,
      `<h3>✍️ Bài tập — có lời giải đầy đủ</h3>
<p><strong>1.</strong> Một công ty có 8 chi nhánh. Hãy so số đường WAN cần cho trục–nan hoa với lưới đầy đủ, và nêu một sự cố mà mỗi thiết kế chịu được còn thiết kế kia thì không.</p>
<p><strong>2.</strong> Một switch 24 cổng thay cho một hub 24 cổng. Trước đó có bao nhiêu miền xung đột, sau đó bao nhiêu? Nhu cầu dùng CSMA/CD thay đổi ra sao?</p>
<p><strong>3.</strong> Hai trạm trên một đoạn mạng bán song công đụng nhau. Trạm A bốc được k=0 còn trạm B bốc được k=3. Với ô thời gian 51,2 µs, mỗi trạm chờ bao lâu, và sau đó chuyện gì xảy ra?</p>
<p><strong>4. ★</strong> Có người bảo bạn "đường mạng ổn mà, ping thông". Hãy nêu ba phép đo có thể cùng đúng một lúc trong khi đường mạng vẫn đang hỏng.</p>
<details><summary>Lời giải</summary>
<p><strong>1.</strong> Trục–nan hoa với 8 chi nhánh cộng một trung tâm: <strong>8 đường</strong>. Lưới đầy đủ 9 điểm: 9 × 8 ÷ 2 = <strong>36 đường</strong>. Lưới đầy đủ sống sót khi mất điểm trung tâm, thứ sẽ cô lập tất cả trong mô hình trục–nan hoa; còn trục–nan hoa thì sống sót được với một cái ví mỏng, thứ mà lưới đầy đủ không chịu nổi.</p>
<p><strong>2.</strong> Trước: <strong>một</strong> miền xung đột dùng chung cho cả 24 cổng. Sau: <strong>24</strong> miền xung đột, mỗi cổng một cái. Và vì mỗi cổng còn là song công đầy đủ nên CSMA/CD bị tắt hẳn — thuật toán vẫn nằm trong chuẩn, và không bao giờ được gọi tới.</p>
<p><strong>3.</strong> A chờ 0 × 51,2 = <strong>0 µs</strong> và phát lại ngay; B chờ 3 × 51,2 = <strong>153,6 µs</strong>. Nhờ vậy A chiếm được đường truyền và phát xong; B nghe thấy sóng mang đang bận nên chờ tiếp, rồi phát trót lọt. Chính cái ngẫu nhiên đã phá thế hoà — nếu cả hai bốc trúng cùng một k thì chúng lại đụng nhau lần nữa.</p>
<p><strong>4. ★</strong> (a) <code>ip -br link</code> báo UP — chỉ nói có sóng mang, không nói gì về chất lượng. (b) ping thông — gói 64 byte, quá nhỏ để kích hoạt lỗi MTU hay để thua một cuộc đua xung đột. (c) giao diện có IP và có route — tầng 3 đã cấu hình xong. Cả ba có thể cùng đúng trong khi duplex đang lệch, lỗi CRC đang tăng, hoặc MTU đang sai. "Up" là lời khẳng định yếu nhất mà một mạng có thể đưa ra.</p>
</details>`,
    ),
  ].join('\n'),
};

/* ─────────────────── Lesson 5.3 — session 16, part 2 ──────────────────── */

const L3 = {
  title: '5.3 — The data link frame, and layer 2 on a real server (FLM session 16)|||5.3 — Khung dữ liệu, và tầng 2 trên máy chủ thật (buổi 16 của FLM)',
  slug: 'nwc204-5-3-khung-du-lieu-va-tang-2-tren-may-that',
  type: 'DOCUMENT',
  description: 'Buổi 16 phần 2: cấu trúc một khung, từng trường một, FCS và CRC-32, khung Ethernet II theo đúng số byte, thẻ 802.1Q, so sánh PPP/HDLC/802.11; và phần bổ sung ★ — MTU/MSS, sự cố ping thông mà ssh treo, các lệnh đọc tầng 2 trên Linux, cầu nối Docker.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 5 · Lesson 5.3 · FLM session 16 of 60 · CLO2, CLO4, CLO9 · Cisco Module 6</span>
<h2>The envelope, field by field</h2>
<p class="lead">A frame is an envelope with a checksum on the back. Once you can name every field and say what question it answers, packet captures stop being noise and become readable.</p>
<p><strong>Opening question:</strong> you <code>ssh</code> into your VPS through a VPN. The banner <code>SSH-2.0-OpenSSH_9.6</code> appears instantly — and then nothing, forever. <code>ping</code> works. Port 22 is open. The server's logs show the connection arriving. What is broken, and which single number will you change to fix it?</p>`,
      `<span class="eyebrow">NWC204 · Chương 5 · Bài 5.3 · Buổi 16/60 của FLM · CLO2, CLO4, CLO9 · Cisco Module 6</span>
<h2>Cái phong bì, xét từng trường một</h2>
<p class="lead">Một cái khung là một phong bì có dán mã kiểm tra ở mặt sau. Khi bạn gọi được tên từng trường và nói được nó trả lời câu hỏi gì, thì bản bắt gói thôi là một mớ nhiễu và bắt đầu đọc được.</p>
<p><strong>Câu hỏi mở đầu:</strong> bạn <code>ssh</code> vào VPS qua một đường VPN. Dòng chào <code>SSH-2.0-OpenSSH_9.6</code> hiện ra ngay lập tức — rồi đứng im mãi mãi. <code>ping</code> vẫn thông. Cổng 22 vẫn mở. Log trên máy chủ cho thấy kết nối đã tới nơi. Hỏng ở đâu, và bạn sẽ đổi đúng một con số nào để sửa?</p>`,
    ),

    walkHead('nwc204-ch05', 17, 27,
      'Slides 17–24 cover the second half of FLM session 16: 5.3 Data Link Frame. Slides 25–27 are the ★ additions: what layer 2 looks like on a Linux server, why a Docker bridge is a switch, and a self-check table.',
      'Slide 17–24 là nửa sau buổi 16 của FLM: 5.3 Data Link Frame. Slide 25–27 là phần ★ bổ sung: tầng 2 trông thế nào trên một máy chủ Linux, vì sao cầu nối Docker chính là một cái switch, và bảng tự kiểm.'),

    walk('nwc204-ch05', [
      [17, 'The generic frame',
        `<p>Every layer-2 protocol ever designed has the same three parts, whatever it calls them.</p>
<ul>
<li><strong>Header</strong> — start indicator, addressing, type, control.</li>
<li><strong>Data</strong> — the layer-3 packet, which layer 2 never looks inside.</li>
<li><strong>Trailer</strong> — the error check, and sometimes a stop indicator.</li>
</ul>
<p>Notice why the checksum is in a <em>trailer</em> rather than the header: it is computed <strong>from</strong> the data, so it cannot be written until the data has been sent. Putting it at the end lets the sender transmit continuously and compute the CRC as the bits go out, instead of buffering the whole frame first. A small detail with a large effect on hardware cost.</p>`,
        `<p>Mọi giao thức tầng 2 từng được thiết kế đều có cùng ba phần, dù nó gọi tên là gì.</p>
<ul>
<li><strong>Phần đầu (header)</strong> — dấu bắt đầu, địa chỉ, kiểu, điều khiển.</li>
<li><strong>Phần dữ liệu</strong> — gói tin tầng 3, thứ mà tầng 2 không bao giờ ngó vào bên trong.</li>
<li><strong>Phần đuôi (trailer)</strong> — mã kiểm lỗi, đôi khi thêm dấu kết thúc.</li>
</ul>
<p>Hãy để ý vì sao mã kiểm tra nằm ở <em>đuôi</em> chứ không nằm ở đầu: nó được tính <strong>từ</strong> dữ liệu, nên chưa gửi hết dữ liệu thì chưa viết ra được. Đặt nó ở cuối cho phép bên gửi phát liên tục và vừa phát vừa tính CRC, thay vì phải chứa tạm cả cái khung rồi mới gửi. Một chi tiết nhỏ mà ảnh hưởng lớn tới giá thành phần cứng.</p>`],

      [18, 'Frame fields, one by one',
        `<p>Six fields, six questions. Learn them as questions and you will never need to memorise a diagram.</p>
<ul>
<li><strong>Frame start / stop</strong> — where does this frame begin and end inside a continuous stream of bits?</li>
<li><strong>Addressing</strong> — which node on <em>this link</em> sent it, and which node on this link should read it?</li>
<li><strong>Type</strong> — which layer-3 protocol is inside: IPv4, IPv6, ARP?</li>
<li><strong>Control</strong> — quality of service, flow control. Defined on many protocols, largely unused on Ethernet.</li>
<li><strong>Data</strong> — the packet.</li>
<li><strong>Error detection</strong> — did any bit change on the way?</li>
</ul>
<p>Not every protocol has all six. PPP drops addressing entirely. That is not an omission — it is the protocol telling you it only ever has one possible recipient.</p>`,
        `<p>Sáu trường, sáu câu hỏi. Học chúng dưới dạng câu hỏi thì bạn sẽ không bao giờ phải học thuộc lòng cái sơ đồ.</p>
<ul>
<li><strong>Dấu bắt đầu / kết thúc khung</strong> — cái khung này bắt đầu và kết thúc ở đâu trong một dòng bit chảy liên tục?</li>
<li><strong>Địa chỉ</strong> — nút nào trên <em>đường link này</em> đã gửi, và nút nào trên đường link này nên đọc?</li>
<li><strong>Kiểu</strong> — bên trong là giao thức tầng 3 nào: IPv4, IPv6 hay ARP?</li>
<li><strong>Điều khiển</strong> — chất lượng dịch vụ, điều khiển luồng. Nhiều giao thức có định nghĩa, riêng Ethernet gần như không dùng.</li>
<li><strong>Dữ liệu</strong> — gói tin.</li>
<li><strong>Phát hiện lỗi</strong> — có bit nào bị đổi trên đường không?</li>
</ul>
<p>Không phải giao thức nào cũng có đủ sáu trường. PPP bỏ hẳn phần địa chỉ. Đó không phải là thiếu sót — đó là giao thức đang nói cho bạn biết nó chỉ có đúng một người nhận khả dĩ.</p>`],

      [19, 'FCS — what it checks, and what it does not',
        `<p>The Frame Check Sequence is a <strong>CRC-32</strong> computed over everything from the destination MAC to the end of the payload. The preamble is excluded (it is not part of the frame) and the FCS obviously cannot include itself.</p>
<ul>
<li>The sender computes it and writes it into the trailer.</li>
<li>The receiver recomputes it from the bits it actually received and compares.</li>
<li><strong>Match</strong> → strip the frame, hand the packet up to layer 3.</li>
<li><strong>Mismatch</strong> → discard the frame. No error message, no retransmission request, nothing sent back. TCP will notice the gap, four layers up, and resend.</li>
</ul>
<p>CRC-32 catches every single-bit and double-bit error, every burst of up to 32 consecutive bad bits, and every error affecting an odd number of bits. Beyond that it is probabilistic — roughly one undetected error in 4 billion. This is detection, never correction.</p>`,
        `<p>Mã kiểm khung (FCS) là một <strong>CRC-32</strong> tính trên toàn bộ phần từ MAC đích cho tới hết phần tải. Phần mở đầu (preamble) không tính vào (nó không thuộc về cái khung), và hiển nhiên FCS không thể tính cả chính nó.</p>
<ul>
<li>Bên gửi tính ra rồi ghi vào phần đuôi.</li>
<li>Bên nhận tính lại từ đúng những bit nó nhận được rồi đem so.</li>
<li><strong>Khớp</strong> → lột khung ra, đưa gói tin lên tầng 3.</li>
<li><strong>Lệch</strong> → vứt khung đi. Không báo lỗi, không xin gửi lại, không gửi ngược cái gì cả. TCP ở tận bốn tầng trên sẽ nhận ra chỗ thiếu và gửi lại.</li>
</ul>
<p>CRC-32 bắt được mọi lỗi một bit và hai bit, mọi chùm lỗi dài tới 32 bit liên tiếp, và mọi lỗi tác động lên một số lẻ bit. Ngoài các trường hợp đó thì nó mang tính xác suất — cỡ một lỗi lọt lưới trên 4 tỉ. Đây là phát hiện lỗi, không bao giờ là sửa lỗi.</p>`],

      [20, 'The Ethernet II frame, in real bytes',
        `<p>The numbers you should be able to recite.</p>
<ul>
<li><strong>Preamble + SFD, 8 bytes</strong> — a clock-sync pattern. Not counted in the frame length.</li>
<li><strong>Destination MAC 6 · Source MAC 6 · EtherType 2</strong> — a 14-byte header.</li>
<li><strong>Payload 46 to 1500 bytes</strong> — shorter payloads are padded up to 46.</li>
<li><strong>FCS 4 bytes.</strong></li>
</ul>
<p>So a frame is <strong>64 bytes minimum, 1518 bytes maximum</strong>. The 64-byte floor is not arbitrary: on the original shared Ethernet a station had to still be transmitting when a collision from the far end of the maximum cable run got back to it, otherwise it would never notice. Slot time, cable length and minimum frame size are three faces of the same constraint.</p>
<p>EtherType values worth knowing: <strong>0x0800</strong> IPv4, <strong>0x86DD</strong> IPv6, <strong>0x0806</strong> ARP, <strong>0x8100</strong> a VLAN tag follows.</p>`,
        `<p>Những con số bạn nên đọc thuộc.</p>
<ul>
<li><strong>Preamble + SFD, 8 byte</strong> — mẫu bit để đồng bộ đồng hồ. Không tính vào độ dài khung.</li>
<li><strong>MAC đích 6 · MAC nguồn 6 · EtherType 2</strong> — phần đầu 14 byte.</li>
<li><strong>Tải 46 tới 1500 byte</strong> — tải ngắn hơn thì được chèn thêm cho đủ 46.</li>
<li><strong>FCS 4 byte.</strong></li>
</ul>
<p>Vậy một cái khung là <strong>tối thiểu 64 byte, tối đa 1518 byte</strong>. Cái sàn 64 byte không phải tự nhiên mà có: trên Ethernet dùng chung thời đầu, một trạm phải còn đang phát vào lúc vụ xung đột từ đầu xa nhất của sợi cáp dài nhất dội về tới nó, nếu không thì nó sẽ không bao giờ biết. Ô thời gian, chiều dài cáp và cỡ khung tối thiểu là ba mặt của cùng một ràng buộc.</p>
<p>Các giá trị EtherType đáng nhớ: <strong>0x0800</strong> IPv4, <strong>0x86DD</strong> IPv6, <strong>0x0806</strong> ARP, <strong>0x8100</strong> phía sau có một thẻ VLAN.</p>`],

      [21, '★ 802.1Q — where the VLAN tag goes',
        `<p>★ VLANs belong to Chapter 6, but the tag lives in <em>this</em> frame, so this is where it can be understood.</p>
<ul>
<li>The tag is <strong>4 bytes inserted after the source MAC</strong>, before the EtherType.</li>
<li>The first 2 bytes are <strong>TPID = 0x8100</strong>, which sits exactly where the EtherType would be and warns the receiver "a tag follows, do not read this as the type".</li>
<li>The other 2 bytes are the TCI: 3 bits of priority, 1 drop-eligible bit, and a <strong>12-bit VLAN ID</strong>.</li>
</ul>
<p>Twelve bits is why VLAN numbers stop at 4094 — 4096 minus the two reserved values. And because the frame grew by 4 bytes, the maximum becomes <strong>1522</strong>. Equipment that was never told about tags rejects those as oversized and logs them as "baby giants", which is a fault you meet on older switches the day somebody enables trunking.</p>`,
        `<p>★ VLAN thuộc về chương 6, nhưng cái thẻ thì nằm trong <em>chính</em> cái khung này, nên đây mới là chỗ hiểu được nó.</p>
<ul>
<li>Thẻ là <strong>4 byte chèn vào ngay sau MAC nguồn</strong>, trước trường EtherType.</li>
<li>Hai byte đầu là <strong>TPID = 0x8100</strong>, nằm đúng vào chỗ lẽ ra là EtherType và báo cho bên nhận "phía sau có một cái thẻ, đừng đọc chỗ này như kiểu giao thức".</li>
<li>Hai byte còn lại là TCI: 3 bit mức ưu tiên, 1 bit đánh dấu được phép loại bỏ, và <strong>12 bit số hiệu VLAN</strong>.</li>
</ul>
<p>Mười hai bit chính là lý do số hiệu VLAN dừng ở 4094 — 4096 trừ đi hai giá trị dành riêng. Và vì cái khung dài thêm 4 byte nên mức tối đa thành <strong>1522</strong>. Thiết bị chưa từng được dạy về thẻ sẽ coi đó là khung quá khổ và ghi log là "baby giant" — một lỗi bạn sẽ gặp trên switch đời cũ đúng cái ngày có người bật trunking.</p>`],

      [22, 'Same idea, different fields',
        `<p>Four protocols, one shape, different answers to "who is this for".</p>
<ul>
<li><strong>Ethernet 802.3</strong> — two 48-bit MAC addresses. What you meet almost always.</li>
<li><strong>802.11</strong> — up to <em>four</em> address fields, because a wireless frame may need the sender, the receiver, the access point and, on a mesh link, the original source.</li>
<li><strong>PPP</strong> — no address field at all.</li>
<li><strong>HDLC</strong> — a single address byte; Cisco's default encapsulation on serial interfaces.</li>
</ul>
<p>PPP is the clearest teaching case in the whole chapter. On a link with exactly two ends, "who is this for" has one possible answer, so the field is dropped and nothing is lost. Layer-2 addressing exists <strong>only</strong> to pick one neighbour out of several — nothing more mystical than that.</p>`,
        `<p>Bốn giao thức, cùng một hình dạng, khác nhau ở cách trả lời câu "cái này gửi cho ai".</p>
<ul>
<li><strong>Ethernet 802.3</strong> — hai địa chỉ MAC 48 bit. Thứ bạn gặp gần như mọi lúc.</li>
<li><strong>802.11</strong> — tới <em>bốn</em> trường địa chỉ, vì một khung không dây có thể cần cả bên gửi, bên nhận, điểm truy cập, và trên đường mesh thì thêm cả nguồn gốc ban đầu.</li>
<li><strong>PPP</strong> — không có trường địa chỉ nào.</li>
<li><strong>HDLC</strong> — một byte địa chỉ; đây là kiểu đóng gói mặc định của Cisco trên giao diện serial.</li>
</ul>
<p>PPP là ví dụ dạy học sạch nhất của cả chương. Trên một đường chỉ có hai đầu, câu "gửi cho ai" chỉ có một đáp án, nên người ta bỏ luôn cái trường đó mà chẳng mất gì. Việc đánh địa chỉ ở tầng 2 tồn tại <strong>chỉ để</strong> chọn ra một hàng xóm trong nhiều hàng xóm — không có gì huyền bí hơn thế.</p>`],

      [23, '★ MTU — the ceiling on the payload',
        `<p>★ Module 6 says a frame has a maximum size. This slide says what that maximum costs you in practice.</p>
<ul>
<li><strong>MTU 1500</strong> — the largest payload a standard Ethernet frame carries. It is a property of the <em>interface</em>, and you can read and change it.</li>
<li><strong>MSS 1460</strong> — 1500 minus the 20-byte IP header minus the 20-byte TCP header. This is the number TCP announces to the other end during the handshake.</li>
<li><strong>Jumbo frames, 9000</strong> — used on storage and backup networks. Every device along the path must agree; one that does not silently drops the oversized frames.</li>
<li><strong>Tunnels reduce it</strong> — WireGuard's <code>wg-quick</code> defaults the inner MTU to <strong>1420</strong>, leaving 80 bytes for the worst-case outer headers.</li>
</ul>
<p>The rule to remember: <strong>anything that wraps your packet in another packet must lower the MTU inside.</strong> VPNs, GRE, VXLAN, PPPoE — all of them.</p>`,
        `<p>★ Module 6 nói một cái khung có kích thước tối đa. Slide này nói cái tối đa ấy khiến bạn trả giá gì trong thực tế.</p>
<ul>
<li><strong>MTU 1500</strong> — phần tải lớn nhất mà một khung Ethernet chuẩn chở được. Đây là thuộc tính của <em>giao diện mạng</em>, đọc được và sửa được.</li>
<li><strong>MSS 1460</strong> — 1500 trừ 20 byte đầu IP trừ 20 byte đầu TCP. Đây là con số TCP khai báo cho đầu kia trong lúc bắt tay.</li>
<li><strong>Khung khổng lồ (jumbo), 9000</strong> — dùng trong mạng lưu trữ và sao lưu. Mọi thiết bị trên đường đi phải cùng đồng ý; thiết bị nào không biết sẽ lặng lẽ vứt bỏ khung quá khổ.</li>
<li><strong>Đường hầm làm nó nhỏ lại</strong> — <code>wg-quick</code> của WireGuard đặt MTU bên trong mặc định là <strong>1420</strong>, chừa 80 byte cho phần đầu bên ngoài ở trường hợp xấu nhất.</li>
</ul>
<p>Luật cần nhớ: <strong>thứ gì bọc gói tin của bạn vào trong một gói tin khác thì đều phải hạ MTU bên trong xuống.</strong> VPN, GRE, VXLAN, PPPoE — tất cả.</p>`],

      [24, '★ Wrong MTU: ping works, ssh hangs',
        `<p>★ This is the single most valuable diagnostic in the chapter, because every symptom points at the wrong place.</p>
<ol>
<li><code>ping</code> sends 64-byte packets. They fit under any MTU, so they always succeed — which is why "ping works" proves almost nothing.</li>
<li><code>ping -M do -s 1472</code> sets the do-not-fragment bit and a payload of exactly 1472, which with 8 bytes of ICMP and 20 of IP makes exactly 1500. If that fails with <em>message too long</em>, an MTU ceiling exists and the error names it.</li>
<li>SSH shows its banner because the banner is tiny. The moment key exchange sends a full-size packet, that packet is too large, the router that must drop it replies with ICMP "fragmentation needed" — and a firewall eats the ICMP. Neither end ever learns. The session hangs forever rather than failing.</li>
<li><code>ip link set dev wg0 mtu 1420</code> fixes it.</li>
</ol>
<p>Learn the shape of this fault: <strong>small things work, large things hang</strong>. That sentence is an MTU problem until proven otherwise.</p>`,
        `<p>★ Đây là phép chẩn đoán đáng giá nhất của cả chương, bởi vì mọi triệu chứng của nó đều chỉ sai chỗ.</p>
<ol>
<li><code>ping</code> gửi gói 64 byte. Chúng lọt qua mọi mức MTU nên lúc nào cũng thông — và đó là lý do câu "ping thông mà" gần như không chứng minh được gì.</li>
<li><code>ping -M do -s 1472</code> bật cờ cấm phân mảnh và đặt tải đúng 1472 byte, cộng 8 byte ICMP và 20 byte IP là vừa tròn 1500. Nếu lệnh này báo <em>message too long</em> thì đúng là có một trần MTU, và thông báo lỗi nói luôn con số.</li>
<li>SSH hiện được dòng chào vì dòng chào bé tí. Ngay khi bước trao khoá gửi một gói đầy cỡ, gói đó quá khổ, cái router buộc phải vứt nó đi có gửi lại ICMP "cần phân mảnh" — và một cái tường lửa nuốt mất gói ICMP ấy. Không đầu nào biết được. Thế là phiên làm việc treo mãi thay vì báo lỗi.</li>
<li><code>ip link set dev wg0 mtu 1420</code> là sửa xong.</li>
</ol>
<p>Hãy nhớ lấy hình dáng của lỗi này: <strong>thứ nhỏ thì chạy, thứ lớn thì treo</strong>. Câu đó là lỗi MTU cho tới khi chứng minh được điều ngược lại.</p>`],

      [25, '★ Layer 2 on your own Linux server',
        `<p>★ Cisco teaches this on IOS. These four commands are the same theory on the machine you pay for every month.</p>
<ul>
<li><code>ip -br link</code> — one line per interface: state, MAC address, MTU. This is the frame-building layer, listed.</li>
<li><code>ip neigh</code> — the neighbour cache: which IP on this link maps to which MAC, and whether it is REACHABLE, STALE or FAILED.</li>
<li><code>ethtool -S eth0 | grep -i crc</code> — the FCS failures from slide 19, counted. Anything above zero is a physical story.</li>
<li><code>ip -s link show eth0</code> — errors, drops, collisions, read twice a minute apart to see whether they are <em>growing</em>.</li>
</ul>
<p>A counter that is non-zero but static is history. A counter that is climbing is a fault happening now. Always read twice.</p>`,
        `<p>★ Cisco dạy phần này trên IOS. Bốn lệnh dưới đây là đúng lý thuyết ấy, trên cái máy mà tháng nào bạn cũng trả tiền.</p>
<ul>
<li><code>ip -br link</code> — mỗi giao diện một dòng: trạng thái, địa chỉ MAC, MTU. Đây chính là tầng dựng khung, liệt kê ra.</li>
<li><code>ip neigh</code> — bộ nhớ hàng xóm: IP nào trên link này ứng với MAC nào, và đang REACHABLE, STALE hay FAILED.</li>
<li><code>ethtool -S eth0 | grep -i crc</code> — đếm đúng những lần hỏng FCS ở slide 19. Lớn hơn không là chuyện của vật lý.</li>
<li><code>ip -s link show eth0</code> — lỗi, rớt, xung đột; đọc hai lần cách nhau một phút để biết chúng có đang <em>tăng</em> hay không.</li>
</ul>
<p>Một bộ đếm khác không mà đứng yên là chuyện quá khứ. Một bộ đếm đang leo là sự cố đang diễn ra ngay lúc này. Luôn luôn đọc hai lần.</p>`],

      [26, '★ A Docker bridge is a switch in software',
        `<p>★ The reason this chapter is not abstract for you: your own VPS is running a layer-2 switch right now.</p>
<ul>
<li>Each container gets an <code>eth0</code>, which is one end of a <strong>veth pair</strong> — a virtual cable with a plug at each end.</li>
<li>The other end is attached to <code>docker0</code>, a <strong>Linux bridge</strong>. A bridge learns MAC addresses and forwards frames by destination: that is the definition of a switch.</li>
<li><code>bridge fdb show br docker0</code> prints its MAC address table — the same table Chapter 6 will teach you to read on a Cisco switch.</li>
<li>Traffic leaving for the internet is then translated by iptables, which is layer 3 and a different story.</li>
</ul>
<p>So every container you deploy is a host on a tiny Ethernet LAN living inside one machine. When two containers on the same host talk, the frames never touch a physical wire — and everything in this chapter still applies to them.</p>`,
        `<p>★ Lý do chương này không hề trừu tượng với bạn: chính cái VPS của bạn đang chạy một con switch tầng 2 ngay lúc này.</p>
<ul>
<li>Mỗi container được cấp một <code>eth0</code>, và đó là một đầu của một <strong>cặp veth</strong> — một sợi cáp ảo có phích cắm ở hai đầu.</li>
<li>Đầu kia cắm vào <code>docker0</code>, một <strong>bridge của Linux</strong>. Bridge học địa chỉ MAC rồi chuyển tiếp khung theo đích: đó chính là định nghĩa của switch.</li>
<li><code>bridge fdb show br docker0</code> in ra bảng địa chỉ MAC của nó — đúng cái bảng mà chương 6 sẽ dạy bạn đọc trên một con switch Cisco.</li>
<li>Lưu lượng đi ra internet sau đó được iptables dịch địa chỉ, nhưng đó là tầng 3 và là chuyện khác.</li>
</ul>
<p>Nên mỗi container bạn triển khai là một máy trạm trong một mạng LAN Ethernet tí hon sống bên trong một cái máy. Khi hai container trên cùng một máy chủ nói chuyện, khung tin không hề chạm vào sợi dây vật lý nào — và mọi thứ trong chương này vẫn áp dụng y nguyên cho chúng.</p>`],

      [27, 'Self-check — what to run, what it proves',
        `<p>Keep this table. It turns the whole chapter into five commands and ten conclusions.</p>
<ul>
<li>Work <strong>bottom-up</strong>: link state, then speed and duplex, then error counters, then neighbours, then MTU. Each step assumes the one below it passed.</li>
<li>Every row has a healthy reading and a suspicious one. Write down what you saw before you change anything — otherwise you will not know whether your fix worked.</li>
<li>If all five rows are healthy and the problem persists, layer 2 is exonerated: go up to layer 3 and start again with <code>ip route</code> and <code>traceroute</code>.</li>
</ul>
<p>That discipline — prove a layer innocent before climbing — is the whole method this course is teaching. The commands change per platform; the order never does.</p>`,
        `<p>Hãy giữ lại cái bảng này. Nó gói cả chương thành năm lệnh và mười kết luận.</p>
<ul>
<li>Làm <strong>từ dưới lên</strong>: trạng thái link, rồi tốc độ và duplex, rồi bộ đếm lỗi, rồi hàng xóm, rồi MTU. Mỗi bước đều giả định bước dưới nó đã đạt.</li>
<li>Mỗi dòng có một cách đọc khoẻ mạnh và một cách đọc đáng ngờ. Hãy ghi lại thứ bạn nhìn thấy TRƯỚC khi đụng vào bất cứ thứ gì — nếu không thì bạn sẽ không biết bản sửa của mình có tác dụng hay không.</li>
<li>Nếu cả năm dòng đều khoẻ mà sự cố vẫn còn thì tầng 2 được minh oan: leo lên tầng 3 và bắt đầu lại với <code>ip route</code> và <code>traceroute</code>.</li>
</ul>
<p>Cái kỷ luật ấy — chứng minh một tầng vô tội rồi mới leo lên — chính là phương pháp mà cả môn học này đang dạy. Lệnh thì đổi theo hệ điều hành; thứ tự thì không bao giờ đổi.</p>`],
    ]),

    bi(
      `<h3>🗺️ The "small works, large hangs" decision</h3>
<pre><code class="language-mermaid">graph TD
  S["ping works<br/>but ssh hangs"] --> T{"ping -M do -s 1472<br/>succeeds?"}
  T -->|yes| L3["MTU is fine<br/>look at layer 3 or the app"]
  T -->|"message too long"| M["An MTU ceiling exists<br/>the error names it"]
  M --> F["Lower the interface MTU<br/>or clamp the TCP MSS"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef bad fill:#fdecec,stroke:#d94b4b,stroke-width:2px,color:#7a1f1f
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class T ask
  class S,M bad
  class L3,F ok</code></pre>
<p>Two commands separate an MTU fault from everything else. Run them before you read a single application log.</p>`,
      `<h3>🗺️ Quyết định cho kiểu lỗi "nhỏ thì chạy, lớn thì treo"</h3>
<pre><code class="language-mermaid">graph TD
  S["ping thông<br/>nhưng ssh treo"] --> T{"ping -M do -s 1472<br/>có chạy không?"}
  T -->|có| L3["MTU không sao<br/>đi soi tầng 3 hoặc ứng dụng"]
  T -->|"message too long"| M["Có một trần MTU<br/>thông báo lỗi nói luôn con số"]
  M --> F["Hạ MTU của giao diện<br/>hoặc kẹp MSS của TCP"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef bad fill:#fdecec,stroke:#d94b4b,stroke-width:2px,color:#7a1f1f
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class T ask
  class S,M bad
  class L3,F ok</code></pre>
<p>Hai câu lệnh là đủ tách lỗi MTU ra khỏi mọi thứ khác. Hãy chạy chúng trước khi đọc một dòng log ứng dụng nào.</p>`,
    ),

    bi(
      `<h3>🔎 How to check this yourself</h3>
<p>Read a real frame on your own machine. This is the moment the diagrams above stop being diagrams.</p>
<pre><code class="language-bash"># 1. Print the LINK-LAYER header of live traffic: -e is the flag that shows it
sudo tcpdump -i eth0 -e -n -c 5 icmp

# 2. The MTU of every interface, including tunnels and bridges
ip -br link                      # the third column
cat /sys/class/net/eth0/mtu

# 3. Find the real MTU of a path, without guessing
ping -M do -s 1472 <dich>        # 1472 + 8 + 20 = 1500
ping -M do -s 1392 <dich>        # 1392 + 28 = 1420, the WireGuard default
tracepath <dich>                 # prints "pmtu" when it changes along the way

# 4. FCS errors — the counter that names its own cause
ethtool -S eth0 | grep -iE 'crc|error'

# 5. The MAC address table of the switch inside your own server
bridge fdb show br docker0 | head</code></pre>
<p>How to read the tcpdump line:</p>
<pre><code class="language-plaintext">12:04:31.884 52:54:00:a1:b2:c3 > 00:1a:2b:3c:4d:5e, ethertype IPv4 (0x0800),
             length 98: 192.168.1.10 > 8.8.8.8: ICMP echo request
             ^^^^^^^^ src MAC    ^^^^^^^^ dst MAC = THE GATEWAY, not Google
             ethertype 0x0800 -> the payload is an IPv4 packet (slide 20)
             length 98        -> 14 header + 84 payload; the FCS was already
                                 checked and stripped by the NIC, so you never see it</code></pre>
<p>That last detail is worth noticing: <strong>you will never capture a bad frame</strong>. The hardware discards it before the kernel is involved, which is exactly why <code>ethtool -S</code> exists — the counter is the only evidence left.</p>
<p>And the opening question: the banner is a handful of bytes and arrives; key exchange sends a full-size packet, which exceeds the tunnel's MTU; the ICMP that should have reported it was filtered, so both ends wait forever. <code>ping -M do -s 1472</code> fails with <em>message too long, mtu=1420</em>, and <code>ip link set dev wg0 mtu 1420</code> — one number — fixes it.</p>`,
      `<h3>🔎 Cách tự kiểm</h3>
<p>Hãy đọc một cái khung thật trên máy của chính bạn. Đây là lúc mấy cái sơ đồ bên trên thôi làm sơ đồ.</p>
<pre><code class="language-bash"># 1. In ra phần đầu TẦNG LIÊN KẾT của lưu lượng đang chạy: -e chính là cờ hiện nó
sudo tcpdump -i eth0 -e -n -c 5 icmp

# 2. MTU của mọi giao diện, kể cả đường hầm và cầu nối
ip -br link                      # đọc cột thứ ba
cat /sys/class/net/eth0/mtu

# 3. Tìm MTU thật của cả tuyến đường, không đoán mò
ping -M do -s 1472 <dich>        # 1472 + 8 + 20 = 1500
ping -M do -s 1392 <dich>        # 1392 + 28 = 1420, mặc định của WireGuard
tracepath <dich>                 # in ra "pmtu" ở chỗ nó thay đổi dọc đường

# 4. Lỗi FCS — bộ đếm tự nói ra nguyên nhân của chính nó
ethtool -S eth0 | grep -iE 'crc|error'

# 5. Bảng địa chỉ MAC của con switch nằm ngay trong máy chủ của bạn
bridge fdb show br docker0 | head</code></pre>
<p>Cách đọc dòng tcpdump:</p>
<pre><code class="language-plaintext">12:04:31.884 52:54:00:a1:b2:c3 > 00:1a:2b:3c:4d:5e, ethertype IPv4 (0x0800),
             length 98: 192.168.1.10 > 8.8.8.8: ICMP echo request
             ^^^^^^^^ MAC nguồn  ^^^^^^^^ MAC đích = CỔNG RA, không phải Google
             ethertype 0x0800 -> phần tải là một gói IPv4 (slide 20)
             length 98        -> 14 byte đầu + 84 byte tải; FCS thì card mạng đã
                                 kiểm và cắt bỏ rồi, nên bạn không bao giờ thấy nó</code></pre>
<p>Chi tiết cuối đáng để ý: <strong>bạn sẽ không bao giờ bắt được một cái khung hỏng</strong>. Phần cứng vứt nó đi trước khi nhân hệ điều hành kịp dính vào, và đó đúng là lý do <code>ethtool -S</code> tồn tại — bộ đếm là bằng chứng duy nhất còn sót lại.</p>
<p>Và câu hỏi mở đầu: dòng chào chỉ vài chục byte nên tới nơi; bước trao khoá gửi một gói đầy cỡ, gói đó vượt MTU của đường hầm; cái ICMP lẽ ra phải báo điều đó thì bị lọc mất, nên hai đầu chờ nhau mãi mãi. Lệnh <code>ping -M do -s 1472</code> sẽ báo <em>message too long, mtu=1420</em>, và <code>ip link set dev wg0 mtu 1420</code> — đúng một con số — là xong.</p>`,
    ),

    bi(
      `<h3>⚠️ Traps people actually fall into</h3>
<ol>
<li><strong>Believing "ping works" means the path is healthy.</strong> <em>Symptom:</em> hours spent in application logs for what is an MTU fault. Ping sends 64 bytes; the failure needs 1500. Always test with <code>-M do -s 1472</code> before you trust a path.</li>
<li><strong>Expecting an error when a frame is corrupted.</strong> <em>Symptom:</em> "there is nothing in the logs, so the cable is fine". A bad FCS produces no log entry anywhere — only a counter. <code>ethtool -S</code> is the only witness.</li>
<li><strong>Forgetting the FCS and preamble when counting bytes.</strong> <em>Symptom:</em> exam answers that are 4, 8 or 12 bytes out. Frame = 14 header + payload + 4 FCS; the 8-byte preamble is <em>not</em> part of the frame.</li>
<li><strong>Lowering the MTU on one side only.</strong> <em>Symptom:</em> downloads work and uploads hang, or the reverse. MTU is per-interface and per-direction in effect; both ends of the tunnel need it, or you must clamp the TCP MSS on the router instead.</li>
<li><strong>★ Treating container networking as something new.</strong> <em>Symptom:</em> reading Docker documentation for a problem that is a bridge, a MAC table and an MTU. <code>docker0</code> is a switch; a veth pair is a cable; an overlay network is a tunnel with a smaller MTU. Everything in this chapter applies.</li>
</ol>`,
      `<h3>⚠️ Bẫy hay mắc</h3>
<ol>
<li><strong>Tin rằng "ping thông" nghĩa là đường đi khoẻ.</strong> <em>Triệu chứng:</em> ngồi lục log ứng dụng hàng giờ cho một lỗi MTU. Ping gửi 64 byte; còn lỗi thì cần tới 1500 byte mới lộ. Luôn thử bằng <code>-M do -s 1472</code> trước khi tin một tuyến đường.</li>
<li><strong>Mong có thông báo lỗi khi một cái khung bị hỏng.</strong> <em>Triệu chứng:</em> "log không có gì nên cáp không sao đâu". Một khung sai FCS không sinh ra dòng log nào ở đâu cả — chỉ có một bộ đếm. <code>ethtool -S</code> là nhân chứng duy nhất.</li>
<li><strong>Quên FCS và preamble khi đếm byte.</strong> <em>Triệu chứng:</em> đáp án bài thi lệch 4, 8 hoặc 12 byte. Khung = 14 byte đầu + tải + 4 byte FCS; còn 8 byte preamble thì <em>không</em> thuộc về cái khung.</li>
<li><strong>Chỉ hạ MTU ở một phía.</strong> <em>Triệu chứng:</em> tải xuống thì được mà tải lên thì treo, hoặc ngược lại. MTU là thuộc tính của từng giao diện và trên thực tế tác động theo từng chiều; cả hai đầu đường hầm đều phải chỉnh, nếu không thì phải kẹp MSS của TCP ở router.</li>
<li><strong>★ Coi mạng container là một thứ gì đó mới mẻ.</strong> <em>Triệu chứng:</em> đi đọc tài liệu Docker cho một sự cố vốn chỉ là chuyện bridge, bảng MAC và MTU. <code>docker0</code> là một cái switch; cặp veth là một sợi cáp; mạng overlay là một đường hầm có MTU nhỏ hơn. Mọi thứ trong chương này đều áp dụng được.</li>
</ol>`,
    ),

    bi(
      `<h3>✍️ Exercises — with full answers</h3>
<p><strong>1.</strong> An application sends 10 bytes of data over TCP on Ethernet. How large is the frame that leaves the NIC, and why?</p>
<p><strong>2.</strong> A capture shows a frame of 1522 bytes. Is it valid? What does its size tell you about the link it came from?</p>
<p><strong>3.</strong> A switch port reports 4,318 CRC errors, unchanged over ten minutes, and 0 new errors while you watch. Do you replace the cable? Justify.</p>
<p><strong>4. ★</strong> A GRE tunnel adds 24 bytes of headers on top of IP. Compute the inner MTU and the resulting TCP MSS, and name the symptom users will report if you forget to set it.</p>
<details><summary>Answers</summary>
<p><strong>1.</strong> 10 bytes of data + 20 TCP + 20 IP = 50 bytes of payload, which is above the 46-byte minimum, so no padding is needed. Frame = 14 header + 50 + 4 FCS = <strong>68 bytes</strong> on the wire, plus an 8-byte preamble that is not counted. Had the application sent 1 byte, the payload would be 41 and the NIC would pad it to 46, giving the 64-byte minimum frame.</p>
<p><strong>2.</strong> Yes — 1522 is exactly 1518 plus a 4-byte 802.1Q tag, so the frame came from a <strong>trunk link carrying VLAN-tagged traffic</strong>. On a switch that does not understand tagging, the same frame would be counted as a "baby giant" and dropped.</p>
<p><strong>3.</strong> <strong>No.</strong> A static counter is history — it may date from a re-cabling months ago. What matters is the <em>rate</em>. Read it twice, minutes apart; only a climbing counter means a fault happening now. Replacing hardware on a static counter is how you spend a morning and change nothing.</p>
<p><strong>4. ★</strong> GRE adds 24 bytes (20-byte outer IP + 4-byte GRE), so the inner MTU is 1500 − 24 = <strong>1476</strong>, and the MSS is 1476 − 40 = <strong>1436</strong>. If you forget: small packets and the TCP handshake succeed, so connections <em>establish</em>; the first full-size packet is dropped and, if ICMP is filtered, the session hangs. Users will report "it connects and then freezes" — which is the same shape as slide 24.</p>
</details>`,
      `<h3>✍️ Bài tập — có lời giải đầy đủ</h3>
<p><strong>1.</strong> Một ứng dụng gửi 10 byte dữ liệu qua TCP trên Ethernet. Cái khung rời khỏi card mạng lớn bao nhiêu, và vì sao?</p>
<p><strong>2.</strong> Bản bắt gói cho thấy một khung 1522 byte. Nó có hợp lệ không? Kích thước đó cho biết gì về đường link mà nó đi ra?</p>
<p><strong>3.</strong> Một cổng switch báo 4.318 lỗi CRC, suốt mười phút không đổi, và trong lúc bạn ngồi nhìn thì không thêm lỗi nào. Bạn có thay cáp không? Hãy lập luận.</p>
<p><strong>4. ★</strong> Một đường hầm GRE thêm 24 byte phần đầu chồng lên IP. Hãy tính MTU bên trong và MSS của TCP tương ứng, rồi gọi tên triệu chứng người dùng sẽ báo nếu bạn quên đặt nó.</p>
<details><summary>Lời giải</summary>
<p><strong>1.</strong> 10 byte dữ liệu + 20 byte TCP + 20 byte IP = 50 byte tải, đã vượt mức tối thiểu 46 byte nên không cần chèn thêm. Khung = 14 byte đầu + 50 + 4 byte FCS = <strong>68 byte</strong> trên dây, cộng 8 byte preamble không tính vào. Nếu ứng dụng chỉ gửi 1 byte thì tải là 41 và card mạng sẽ chèn cho đủ 46, ra đúng cái khung tối thiểu 64 byte.</p>
<p><strong>2.</strong> Có — 1522 đúng bằng 1518 cộng thêm thẻ 802.1Q 4 byte, nên cái khung này đến từ một <strong>đường trunk đang chở lưu lượng có gắn thẻ VLAN</strong>. Trên một con switch không hiểu chuyện gắn thẻ, đúng cái khung đó sẽ bị tính là "baby giant" và bị vứt bỏ.</p>
<p><strong>3.</strong> <strong>Không.</strong> Một bộ đếm đứng yên là chuyện quá khứ — nó có thể có từ lần đi lại dây mấy tháng trước. Thứ có ý nghĩa là <em>tốc độ tăng</em>. Hãy đọc hai lần, cách nhau vài phút; chỉ bộ đếm đang leo mới nghĩa là sự cố đang diễn ra. Thay phần cứng vì một bộ đếm đứng yên là cách tiêu hết một buổi sáng mà không đổi được gì.</p>
<p><strong>4. ★</strong> GRE thêm 24 byte (20 byte IP bên ngoài + 4 byte GRE), nên MTU bên trong là 1500 − 24 = <strong>1476</strong>, và MSS là 1476 − 40 = <strong>1436</strong>. Nếu quên: gói nhỏ và bước bắt tay TCP đều trót lọt nên kết nối <em>thiết lập được</em>; gói đầy cỡ đầu tiên bị vứt, và nếu ICMP bị lọc thì phiên treo cứng. Người dùng sẽ báo "nó kết nối được rồi đứng hình" — đúng hình dáng của slide 24.</p>
</details>`,
    ),

    bi(
      `<h3>💬 ★ Discussion questions for session 16</h3>
<p><strong>Note on the source table:</strong> as in session 15, FLM lists <strong>no constructive question</strong> for session 16 — the table skips from CQ5.2 to CQ6.1. Reported, not corrected. The questions below are written for this site.</p>
<ul>
<li><strong>★ Q1</strong> — Explain, without using the word "collision", why a switch made CSMA/CD obsolete.</li>
<li><strong>★ Q2</strong> — The FCS lets a receiver detect a damaged frame but never repair it, and nothing is sent back to the sender. Argue why that is the right design for Ethernet, and name the layer that pays for it.</li>
<li><strong>★ Q3</strong> — Two containers on the same host exchange a 1 GB file and no frame ever reaches a cable. Which parts of this chapter still apply to that transfer, and which stop applying?</li>
<li><strong>★ Q4</strong> — A colleague proposes identifying company laptops by MAC address so that only known machines get network access. Give the technical reason this fails, and name what layer-2 mechanism would be used instead.</li>
</ul>`,
      `<h3>💬 ★ Câu hỏi thảo luận cho buổi 16</h3>
<p><strong>Ghi chú về bảng gốc:</strong> giống buổi 15, FLM <strong>không ghi câu hỏi kiến tạo nào</strong> cho buổi 16 — bảng nhảy từ CQ5.2 sang CQ6.1. Chỉ nêu, không tự sửa bảng gốc. Các câu dưới đây do trang này soạn.</p>
<ul>
<li><strong>★ Câu 1</strong> — Hãy giải thích vì sao switch làm CSMA/CD trở nên thừa, mà không được dùng từ "xung đột".</li>
<li><strong>★ Câu 2</strong> — FCS cho bên nhận phát hiện được khung hỏng nhưng không bao giờ vá được nó, và cũng chẳng gửi ngược lại cho bên gửi cái gì. Hãy lập luận vì sao đó là thiết kế đúng cho Ethernet, và gọi tên cái tầng phải trả giá cho nó.</li>
<li><strong>★ Câu 3</strong> — Hai container trên cùng một máy chủ trao nhau một file 1 GB mà không khung nào chạm tới sợi cáp nào. Những phần nào của chương này vẫn áp dụng cho lần truyền đó, và phần nào thì hết áp dụng?</li>
<li><strong>★ Câu 4</strong> — Một đồng nghiệp đề xuất nhận diện laptop của công ty bằng địa chỉ MAC để chỉ máy quen mới được vào mạng. Hãy nêu lý do kỹ thuật khiến cách đó thất bại, và gọi tên cơ chế tầng 2 sẽ được dùng để thay thế.</li>
</ul>`,
    ),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz ──────────────────────────────── */

const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

const QUIZ = {
  title: 'Quiz Chapter 5 — The Data Link Layer|||Quiz Chương 5 — Tầng liên kết dữ liệu',
  slug: 'nwc204-ch5-quiz',
  type: 'QUIZ',
  description: '12 câu song ngữ cho chương 5: bốn việc của tầng 2, LLC và MAC, địa chỉ cục bộ, tô-pô vật lý và logic, duplex, CSMA/CD và CSMA/CA, chuyền thẻ bài, cấu trúc khung, FCS, số byte của khung Ethernet, thẻ 802.1Q và MTU. Mỗi câu có giải thích.',
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      q('How far does a MAC address remain valid?|||Một địa chỉ MAC còn giá trị tới đâu?',
        ['From the source host to the destination host, end to end|||Từ máy nguồn tới máy đích, suốt cả chặng đường', 'Across one link only — it is rewritten at every router|||Chỉ trong một đường link — nó bị ghi lại ở mỗi router', 'Until the TTL reaches zero|||Cho tới khi TTL về không', 'For the lifetime of the TCP connection|||Suốt vòng đời của kết nối TCP'],
        1,
        'Layer 2 moves a packet across one link. Each router strips the incoming frame and builds a new one for the outgoing link, so the MAC pair changes at every hop while the IP pair stays the same from end to end.|||Tầng 2 chuyển gói tin qua đúng một đường link. Mỗi router lột bỏ khung vừa nhận rồi dựng một khung mới cho đường sắp ra, nên cặp MAC đổi ở từng chặng trong khi cặp IP giữ nguyên từ đầu này tới đầu kia.'),

      q('Which sublayer identifies the layer-3 protocol carried inside the frame?|||Tầng con nào cho biết bên trong khung là giao thức tầng 3 nào?',
        ['MAC (IEEE 802.3)', 'LLC (IEEE 802.2)', 'PHY (IEEE 802.1)', 'FCS'],
        1,
        'LLC is the upper sublayer and faces the software above: its job is to say which layer-3 protocol is inside. MAC is the lower sublayer and handles framing, addressing, the FCS and media access. On Ethernet II the 2-byte EtherType does the LLC job in less space.|||LLC là tầng con phía trên, quay mặt lên phần mềm: việc của nó là nói bên trong là giao thức tầng 3 nào. MAC là tầng con phía dưới, lo dựng khung, đánh địa chỉ, tính FCS và điều khiển truy cập. Trên Ethernet II thì 2 byte EtherType làm đúng việc của LLC mà tốn ít chỗ hơn.'),

      q('Which of these is NOT a job of the data link layer?|||Việc nào sau đây KHÔNG phải của tầng liên kết dữ liệu?',
        ['Encapsulating the packet into a frame|||Đóng gói gói tin thành khung', 'Controlling which station may transmit|||Điều khiển trạm nào được phát', 'Choosing the best path to a remote network|||Chọn đường tốt nhất tới một mạng ở xa', 'Detecting a damaged frame|||Phát hiện khung bị hỏng'],
        2,
        'Path selection is layer 3, the network layer. Layer 2 has exactly four jobs: encapsulation, local addressing, media access control and error detection. It knows one link and nothing beyond it.|||Chọn đường là việc của tầng 3, tầng mạng. Tầng 2 có đúng bốn việc: đóng gói, đánh địa chỉ cục bộ, điều khiển truy cập môi trường và phát hiện lỗi. Nó chỉ biết một đường link và không biết gì xa hơn.'),

      q('A Wi-Fi cell is physically a star around the access point. What is it logically?|||Một ô Wi-Fi về vật lý là hình sao quanh điểm truy cập. Về logic nó là gì?',
        ['A star as well|||Cũng là hình sao', 'A shared bus — every station shares one channel|||Một cái bus dùng chung — mọi trạm xài chung một kênh', 'A full mesh|||Một mạng lưới đầy đủ', 'A point-to-point link|||Một đường điểm-tới-điểm'],
        1,
        'All stations transmit on the same radio channel, so logically they share one medium exactly as old coaxial Ethernet did. That is why 802.11 needs a media access method at all, and why its throughput falls as more stations join.|||Mọi trạm đều phát trên cùng một kênh sóng, nên về logic chúng dùng chung một môi trường y hệt Ethernet cáp đồng trục ngày xưa. Đó là lý do 802.11 buộc phải có phương pháp truy cập môi trường, và là lý do thông lượng của nó tụt xuống khi thêm trạm.'),

      q('Why can Wi-Fi not use CSMA/CD?|||Vì sao Wi-Fi không dùng được CSMA/CD?',
        ['The standard forbids it to save battery|||Chuẩn cấm để tiết kiệm pin', 'A transmitting radio cannot hear another station on the same channel at the same time|||Một máy phát đang phát thì không nghe được trạm khác trên cùng kênh cùng lúc', 'Radio frames are too short to collide|||Khung sóng quá ngắn nên không đụng nhau được', 'Collisions are impossible on radio|||Sóng thì không thể có xung đột'],
        1,
        'Collision DETECTION requires listening while transmitting, and a radio drowns out everything else on its channel while its transmitter is on. So 802.11 avoids collisions instead (CSMA/CA) and confirms each unicast frame with an ACK.|||PHÁT HIỆN xung đột đòi hỏi vừa phát vừa nghe, mà một cái đài đang phát thì át hết mọi thứ khác trên kênh của nó. Nên 802.11 chuyển sang tránh xung đột (CSMA/CA) và xác nhận từng khung unicast bằng một cái ACK.'),

      q('An Ethernet link shows Speed 100Mb/s, Duplex Half on a switch port, and rising late collisions. What is it?|||Một đường Ethernet trên cổng switch báo Speed 100Mb/s, Duplex Half, và late collision đang tăng. Đó là gì?',
        ['Normal behaviour for a switch|||Hành vi bình thường của switch', 'A duplex mismatch — one end forced, the other auto-negotiating|||Lệch duplex — một đầu bị ép cứng, đầu kia tự thương lượng', 'A failing power supply|||Bộ nguồn sắp hỏng', 'A VLAN misconfiguration|||Cấu hình VLAN sai'],
        1,
        'A switch port should always negotiate full duplex. Half duplex plus late collisions is the signature of a mismatch: forcing one end makes auto-negotiation fail on the other, which falls back to half. Throughput collapses while the link stays UP and no log mentions it.|||Cổng switch lẽ ra luôn thương lượng ra song công đầy đủ. Bán song công kèm late collision là chữ ký của một vụ lệch duplex: ép cứng một đầu làm đầu kia thương lượng thất bại và tụt về bán song công. Thông lượng sập trong khi đường link vẫn UP và không log nào nhắc tới.'),

      q('What is the minimum and maximum size of a standard Ethernet frame, excluding the preamble?|||Kích thước nhỏ nhất và lớn nhất của một khung Ethernet chuẩn, không tính preamble, là bao nhiêu?',
        ['46 and 1500 bytes|||46 và 1500 byte', '64 and 1518 bytes|||64 và 1518 byte', '64 and 1522 bytes|||64 và 1522 byte', '72 and 1526 bytes|||72 và 1526 byte'],
        1,
        '14 bytes of header + 46 to 1500 bytes of payload + 4 bytes of FCS gives 64 to 1518. The 8-byte preamble is not part of the frame, and 1522 is the tagged maximum once a 4-byte 802.1Q tag is inserted.|||14 byte phần đầu + 46 tới 1500 byte tải + 4 byte FCS ra 64 tới 1518. Tám byte preamble không thuộc về cái khung, còn 1522 là mức tối đa khi đã chèn thêm thẻ 802.1Q 4 byte.'),

      q('What does a receiver do with a frame whose FCS does not match?|||Bên nhận làm gì với một cái khung có FCS không khớp?',
        ['Asks the sender to retransmit it|||Yêu cầu bên gửi phát lại', 'Repairs it using the CRC|||Vá lại nó bằng CRC', 'Discards it silently and sends nothing back|||Lặng lẽ vứt đi, không gửi lại gì cả', 'Passes it up to IP with an error flag|||Đẩy lên cho IP kèm một cờ báo lỗi'],
        2,
        'Ethernet detects, never corrects. The frame is dropped with no message and no request to resend; a counter is incremented and that is the only trace. TCP notices the missing bytes four layers up and retransmits.|||Ethernet phát hiện lỗi chứ không bao giờ sửa lỗi. Khung bị vứt, không thông báo, không xin gửi lại; chỉ một bộ đếm tăng lên và đó là dấu vết duy nhất. TCP ở tận bốn tầng trên nhận ra chỗ thiếu rồi gửi lại.'),

      q('Where is the 802.1Q VLAN tag inserted in the frame?|||Thẻ VLAN 802.1Q được chèn vào chỗ nào trong khung?',
        ['Before the destination MAC|||Trước MAC đích', 'After the source MAC, before the EtherType|||Sau MAC nguồn, trước trường EtherType', 'Inside the payload|||Bên trong phần tải', 'After the FCS|||Sau FCS'],
        1,
        'The 4-byte tag sits after the source MAC. Its first 2 bytes, TPID = 0x8100, occupy the position where the EtherType would be, warning the receiver that a tag follows. Its 12-bit VLAN ID is why VLAN numbers stop at 4094.|||Thẻ 4 byte nằm ngay sau MAC nguồn. Hai byte đầu của nó, TPID = 0x8100, chiếm đúng vị trí lẽ ra là EtherType, để báo cho bên nhận biết phía sau có một cái thẻ. Trường số hiệu VLAN 12 bit của nó chính là lý do số VLAN dừng ở 4094.'),

      q('Which layer-2 protocol carries no address field at all, and why?|||Giao thức tầng 2 nào không có trường địa chỉ nào cả, và vì sao?',
        ['802.11, because the AP handles addressing|||802.11, vì điểm truy cập lo phần địa chỉ', 'PPP, because a point-to-point link has only one possible receiver|||PPP, vì đường điểm-tới-điểm chỉ có một người nhận khả dĩ', 'Ethernet, because switches learn addresses|||Ethernet, vì switch tự học địa chỉ', 'HDLC, because it is a Cisco protocol|||HDLC, vì nó là giao thức của Cisco'],
        1,
        'On a link with exactly two ends, "who is this for" has one answer, so the field is dropped. This is the clearest evidence that layer-2 addressing exists only to select one neighbour out of several. 802.11 needs up to four addresses; Ethernet needs two; HDLC keeps one byte.|||Trên một đường chỉ có hai đầu, câu "gửi cho ai" chỉ có một đáp án, nên người ta bỏ hẳn trường đó. Đây là bằng chứng rõ nhất rằng việc đánh địa chỉ tầng 2 tồn tại chỉ để chọn một hàng xóm trong nhiều hàng xóm. 802.11 cần tới bốn địa chỉ; Ethernet cần hai; HDLC giữ một byte.'),

      q('ping succeeds but ssh shows its banner and then hangs. What do you test first?|||ping thông nhưng ssh hiện dòng chào rồi treo. Bạn kiểm cái gì trước tiên?',
        ['Restart the SSH daemon|||Khởi động lại dịch vụ SSH', 'ping -M do -s 1472 to find an MTU ceiling|||ping -M do -s 1472 để tìm trần MTU', 'Check the firewall rules for port 22|||Soi luật tường lửa cho cổng 22', 'Regenerate the host keys|||Sinh lại khoá máy chủ'],
        1,
        '"Small things work, large things hang" is an MTU fault until proven otherwise. Ping sends 64 bytes and always fits; the banner is tiny; key exchange sends a full-size packet that is dropped, and the ICMP that would report it is usually filtered. The -M do test names the real MTU in one line.|||"Nhỏ thì chạy, lớn thì treo" là lỗi MTU cho tới khi chứng minh được điều ngược lại. Ping gửi 64 byte nên lúc nào cũng lọt; dòng chào bé tí; bước trao khoá gửi một gói đầy cỡ và gói đó bị vứt, còn cái ICMP lẽ ra báo lỗi thì thường bị lọc mất. Phép thử -M do nói ra MTU thật chỉ trong một dòng.'),

      q('Why is a Docker bridge (docker0) a layer-2 device?|||Vì sao cầu nối Docker (docker0) là một thiết bị tầng 2?',
        ['Because it assigns IP addresses to containers|||Vì nó cấp địa chỉ IP cho container', 'Because it learns MAC addresses and forwards frames by destination|||Vì nó học địa chỉ MAC và chuyển tiếp khung theo đích', 'Because it runs iptables NAT|||Vì nó chạy NAT bằng iptables', 'Because it has an IP address on the host|||Vì nó có một địa chỉ IP trên máy chủ'],
        1,
        'Learning MAC addresses and forwarding frames by destination is the definition of a switch, and bridge fdb show prints the resulting MAC table. Handing out IPs is DHCP and NAT is layer 3 — both are separate services that happen to run on the same host.|||Học địa chỉ MAC rồi chuyển tiếp khung theo đích chính là định nghĩa của switch, và lệnh bridge fdb show in ra đúng cái bảng MAC đó. Cấp phát IP là việc của DHCP còn NAT là tầng 3 — cả hai là dịch vụ riêng, chỉ tình cờ chạy trên cùng một máy.'),
    ],
  },
};

export default [
  {
    title: 'Chapter 5 — The Data Link Layer (FLM sessions 15–16)|||Chương 5 — Tầng liên kết dữ liệu (buổi 15–16 của FLM)',
    slug: 'nwc204-chuong-5-tang-lien-ket-du-lieu',
    description: 'Cisco Module 6 theo đúng buổi 15–16 của FLM: bốn việc của tầng 2, hai tầng con LLC và MAC, vì sao địa chỉ MAC chỉ sống trong một chặng, tô-pô vật lý và logic, duplex, ba phương pháp truy cập môi trường, cấu trúc khung và FCS, khung Ethernet II theo từng byte. Kèm phần ★ bổ sung ngoài giáo trình: lệch duplex, 802.1Q, MTU/MSS, lệnh tầng 2 trên Linux và cầu nối Docker. Slide tiếng Anh do cuongthai.com dựng, giảng song ngữ.',
    lessons: [L1, L2, L3, QUIZ],
  },
];
