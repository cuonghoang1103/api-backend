/**
 * NWC204 · Chapter 3 — Protocols and Models (Cisco Module 3).
 * FLM buổi 7–8 (lý thuyết) + buổi 9–10 (Lab 1.2).
 *
 * Slide: scripts/slides-src/nwc204-ch03.mjs → deck 'nwc204-ch03', 23 ảnh.
 * Slide viết hoàn toàn bằng tiếng Anh; phần giảng song ngữ nằm dưới mỗi ảnh.
 *
 * ⚠️ File này CHỈ chứa chương 3. Người điều phối gom vào NWC204.mjs — đừng sửa
 * NWC204.mjs ở đây.
 */
import { registerDeck, walk, walkHead, bi, cq } from './_slides.mjs';

const D = registerDeck('nwc204-ch03', {
  code: 'NWC204',
  en: 'Protocols and Models',
  vi: 'Giao thức và các mô hình',
  total: 23,
});

/* ───────────────────────── Lesson 3.1 — session 7 ───────────────────────── */

const L1 = {
  title: '3.1 — The rules, protocols and protocol suites (FLM session 7)|||3.1 — Luật chơi, giao thức và bộ giao thức (buổi 7 của FLM)',
  slug: 'nwc204-3-1-luat-giao-thuc-va-bo-giao-thuc',
  type: 'DOCUMENT',
  description: 'Buổi 7: vì sao truyền thông cần luật, sáu điều mọi giao thức phải quy định, các chức năng giao thức cung cấp, bộ giao thức TCP/IP và các tổ chức chuẩn hoá — kèm cách tự kiểm bằng lệnh thật và 3 bẫy hay mắc.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 3 · Lesson 3.1 · FLM session 7 of 60 · CLO1, CLO9 · Cisco Module 3</span>
<h2>Why two machines on one cable can still fail to talk</h2>
<p class="lead">You plug a laptop into a switch. The link light is green, the cable tester is happy, and nothing works. Nothing is broken. What is missing is an <strong>agreement</strong>, and this lesson is about what that agreement has to contain.</p>
<p><strong>Opening question, answer it before you read on:</strong> you run <code>curl http://localhost:3000</code> on your own server and it returns a page. You run the same command from your laptop and it hangs forever. The cable is fine, the server process is up. Name three different agreements that could be missing.</p>`,
      `<span class="eyebrow">NWC204 · Chương 3 · Bài 3.1 · Buổi 7/60 của FLM · CLO1, CLO9 · Cisco Module 3</span>
<h2>Vì sao hai máy chung một sợi cáp vẫn có thể không nói chuyện được</h2>
<p class="lead">Bạn cắm laptop vào switch. Đèn link xanh, máy đo cáp báo tốt, và không có gì chạy. Không có gì hỏng cả. Thứ đang thiếu là một <strong>thoả thuận</strong>, và bài này nói về việc thoả thuận đó phải gồm những gì.</p>
<p><strong>Câu hỏi mở đầu, hãy tự trả lời trước khi đọc tiếp:</strong> bạn gõ <code>curl http://localhost:3000</code> ngay trên máy chủ thì ra trang web. Gõ đúng câu đó từ laptop thì treo mãi. Cáp vẫn tốt, tiến trình máy chủ vẫn sống. Hãy kể ra ba thoả thuận khác nhau có thể đang thiếu.</p>`,
    ),

    walkHead('nwc204-ch03', 1, 10,
      'Slides 1–10 cover FLM session 7: 3.1 The Rules, 3.2 Protocols, 3.3 Protocol Suites and 3.4 Standards Organizations.',
      'Slide 1–10 là buổi 7 của FLM: 3.1 The Rules, 3.2 Protocols, 3.3 Protocol Suites và 3.4 Standards Organizations.'),

    walk('nwc204-ch03', [
      [1, 'Cover — Chapter 3, Protocols and Models',
        `<p>Chapter 3 of the course is <strong>Cisco Module 3</strong>, and FPT gives it four sessions: 7 and 8 for theory, 9 and 10 for Lab 1.2.</p>
<ul>
<li>Session 7 — 3.1 The Rules, 3.2 Protocols, 3.3 Protocol Suites, 3.4 Standards Organizations.</li>
<li>Session 8 — 3.5 Reference Models, 3.6 Data Encapsulation, 3.7 Data Access.</li>
<li>Sessions 9–10 — Lab 1.2: design a communications system, research standards, install Wireshark.</li>
<li>Learning outcomes: <strong>CLO1</strong> (layered protocols enable communication) and <strong>CLO9</strong> (use AI tools to explain concepts).</li>
</ul>
<p>This is the most theoretical chapter of the whole course and also the most reused one: every later chapter is "which layer solves which problem".</p>`,
        `<p>Chương 3 của môn chính là <strong>Module 3 của Cisco</strong>, và trường xếp bốn buổi: buổi 7 và 8 học lý thuyết, buổi 9 và 10 làm Lab 1.2.</p>
<ul>
<li>Buổi 7 — 3.1 The Rules, 3.2 Protocols, 3.3 Protocol Suites, 3.4 Standards Organizations.</li>
<li>Buổi 8 — 3.5 Reference Models, 3.6 Data Encapsulation, 3.7 Data Access.</li>
<li>Buổi 9–10 — Lab 1.2: thiết kế một hệ truyền thông, tra cứu chuẩn, cài Wireshark.</li>
<li>Chuẩn đầu ra: <strong>CLO1</strong> (giao thức phân tầng giúp truyền thông) và <strong>CLO9</strong> (dùng công cụ AI để giải thích khái niệm).</li>
</ul>
<p>Đây là chương lý thuyết nhất của cả môn, và cũng là chương được dùng lại nhiều nhất: mọi chương sau đều là câu hỏi "tầng nào giải quyết vấn đề nào".</p>`],

      [2, 'A protocol is an agreement, not a cable',
        `<p>A <strong>protocol</strong> is a set of rules that both sides follow so that a stream of bits carries meaning. It is not hardware, not software — it is the contract that the hardware and software implement.</p>
<ul>
<li>The first two arrows on the slide succeed because both ends run the same contract.</li>
<li>The third arrow is the important one: the electrical signal arrived <em>perfectly</em> and the conversation still failed.</li>
<li>That third case is what produces the worst bugs, because every lamp you can see is green.</li>
<li>Humans do this too: the same sentence in a language the listener does not speak is noise, not a message.</li>
</ul>
<p>Keep this distinction for the whole course: <strong>signal delivered</strong> and <strong>message understood</strong> are two different successes, and they fail separately.</p>`,
        `<p><strong>Giao thức</strong> (protocol) là tập luật mà cả hai bên cùng tuân theo, nhờ đó một dòng bit mới mang được ý nghĩa. Nó không phải phần cứng, cũng không phải phần mềm — nó là bản hợp đồng mà phần cứng và phần mềm đem ra thực thi.</p>
<ul>
<li>Hai mũi tên đầu trên slide thành công vì hai đầu chạy cùng một hợp đồng.</li>
<li>Mũi tên thứ ba mới là chỗ quan trọng: tín hiệu điện đã tới nơi <em>hoàn hảo</em> mà cuộc trò chuyện vẫn hỏng.</li>
<li>Chính trường hợp thứ ba sinh ra những lỗi khó nhất, vì mọi đèn bạn nhìn thấy đều xanh.</li>
<li>Con người cũng vậy: một câu nói đúng ngữ pháp nhưng bằng thứ tiếng người nghe không biết thì chỉ là tiếng ồn, không phải thông điệp.</li>
</ul>
<p>Hãy giữ sự phân biệt này suốt cả môn: <strong>tín hiệu đã tới</strong> và <strong>thông điệp được hiểu</strong> là hai thành công khác nhau, và chúng hỏng độc lập với nhau.</p>`],

      [3, 'Every message needs three things',
        `<p>Cisco reduces all communication to three elements: a <strong>source</strong>, a <strong>destination</strong> and a <strong>channel</strong> (the medium plus the transmitter that drives it).</p>
<ul>
<li><strong>Encoding</strong> turns meaning into a signal: a byte becomes voltage levels, light pulses or a radio phase.</li>
<li><strong>Decoding</strong> turns the signal back into meaning at the far end.</li>
<li>The channel always has a limit: distance, bandwidth, and noise tolerance. Chapter 4 is entirely about those limits.</li>
<li>If the two ends encode differently, the destination receives a valid signal and derives the wrong bytes — with no error anywhere.</li>
</ul>
<p>When you debug, always ask which of the three you have actually proved. A green link proves the channel; it proves nothing about encoding.</p>`,
        `<p>Cisco rút gọn mọi cuộc truyền thông về ba thành phần: <strong>nguồn</strong> (source), <strong>đích</strong> (destination) và <strong>kênh truyền</strong> (channel — môi trường cộng với bộ phát đẩy tín hiệu lên đó).</p>
<ul>
<li><strong>Mã hoá</strong> (encoding) biến ý nghĩa thành tín hiệu: một byte thành mức điện áp, xung ánh sáng hay pha sóng vô tuyến.</li>
<li><strong>Giải mã</strong> (decoding) biến tín hiệu trở lại thành ý nghĩa ở đầu kia.</li>
<li>Kênh truyền luôn có giới hạn: khoảng cách, băng thông và mức chịu nhiễu. Cả chương 4 chỉ nói về các giới hạn đó.</li>
<li>Nếu hai đầu mã hoá khác nhau, đích nhận được tín hiệu hợp lệ rồi suy ra sai byte — mà không nơi nào báo lỗi.</li>
</ul>
<p>Khi gỡ lỗi, hãy luôn tự hỏi bạn đã chứng minh được cái nào trong ba cái đó. Đèn link xanh chứng minh kênh truyền; nó không chứng minh gì về mã hoá.</p>`],

      [4, 'What every protocol must define — the six rules',
        `<p>This table is the checklist for Lab 1.2, where you have to invent your own protocol. Every real protocol answers all six questions.</p>
<ul>
<li><strong>Message encoding</strong> — how meaning becomes signals.</li>
<li><strong>Message formatting and encapsulation</strong> — where each field begins and ends, and what wraps around the data.</li>
<li><strong>Message size</strong> — Ethernet caps the payload at 1500 bytes (the MTU), so anything larger must be split.</li>
<li><strong>Message timing</strong> — flow control, response timeout, access method (next slide).</li>
<li><strong>Delivery options</strong> — unicast, multicast, broadcast.</li>
</ul>
<p>Break any single row and the link still reports "up". That is why a checklist beats intuition: you test the six, not the cable.</p>`,
        `<p>Bảng này chính là danh sách kiểm cho Lab 1.2, nơi bạn phải tự nghĩ ra một giao thức. Mọi giao thức thật đều trả lời đủ sáu câu hỏi này.</p>
<ul>
<li><strong>Mã hoá thông điệp</strong> — ý nghĩa trở thành tín hiệu bằng cách nào.</li>
<li><strong>Định dạng và đóng gói</strong> — mỗi trường bắt đầu và kết thúc ở đâu, cái gì bọc quanh dữ liệu.</li>
<li><strong>Kích thước thông điệp</strong> — Ethernet giới hạn phần tải 1500 byte (MTU), nên cái gì lớn hơn phải cắt nhỏ.</li>
<li><strong>Thời điểm</strong> — điều khiển luồng, thời gian chờ trả lời, phương thức truy nhập (slide kế).</li>
<li><strong>Cách gửi</strong> — unicast, multicast, broadcast.</li>
</ul>
<p>Hỏng bất kỳ dòng nào thì đường truyền vẫn báo "up". Vì thế danh sách kiểm thắng trực giác: bạn kiểm sáu điều đó, không phải kiểm sợi cáp.</p>`],

      [5, 'Timing: three separate rules, three separate failures',
        `<p>Timing is where most real outages live, because it is the only rule that depends on <em>both</em> ends at the same time.</p>
<ul>
<li><strong>Flow control</strong> — the receiver tells the sender how much it can absorb. TCP does this with the window size; without it a fast sender simply overruns a slow receiver and the data is dropped, not queued.</li>
<li><strong>Response timeout</strong> — how long to wait before deciding the reply is lost. Too short and you flood the network with duplicates; too long and the user gives up first.</li>
<li><strong>Access method</strong> — when may I use a shared medium? Ethernet on a hub used CSMA/CD; Wi-Fi uses CSMA/CA; a switched full-duplex port needs neither.</li>
</ul>
<p>The symptom of a timing bug is almost always <em>intermittent</em>: fine when idle, broken under load. That signature should send you here first.</p>`,
        `<p>Thời điểm là chỗ phần lớn sự cố thật xảy ra, vì đây là luật duy nhất phụ thuộc vào <em>cả hai</em> đầu cùng lúc.</p>
<ul>
<li><strong>Điều khiển luồng</strong> — bên nhận báo cho bên gửi biết nó nuốt được bao nhiêu. TCP làm việc này bằng kích thước cửa sổ; không có nó thì bên gửi nhanh sẽ tràn bên nhận chậm và dữ liệu bị <em>vứt</em>, chứ không phải xếp hàng chờ.</li>
<li><strong>Thời gian chờ trả lời</strong> — chờ bao lâu mới kết luận là mất gói. Chờ quá ngắn thì bạn làm ngập mạng bằng bản sao; chờ quá dài thì người dùng bỏ đi trước.</li>
<li><strong>Phương thức truy nhập</strong> — khi nào tôi được dùng môi trường dùng chung? Ethernet thời hub dùng CSMA/CD; Wi-Fi dùng CSMA/CA; cổng switch song công thì không cần cái nào.</li>
</ul>
<p>Triệu chứng của lỗi thời điểm gần như luôn là <em>chập chờn</em>: rỗi thì tốt, tải nặng thì hỏng. Thấy dấu hiệu đó thì hãy tới đây tìm trước.</p>`],

      [6, 'Delivery options: unicast, multicast, broadcast',
        `<p>Three ways to address a message, and they cost the network very different amounts.</p>
<ul>
<li><strong>Unicast</strong> — one sender, one named receiver. Almost all of your traffic.</li>
<li><strong>Multicast</strong> — one sender, a group address. Only the hosts that joined the group process it. IPTV and routing protocols use it.</li>
<li><strong>Broadcast</strong> — every host on the local network must receive, decode and decide to discard it. Even the printer that will never care pays CPU time for it.</li>
<li><strong>IPv6 has no broadcast at all.</strong> Everything that used to be a broadcast is now a multicast to a well-chosen group — a direct fix for the cost above.</li>
</ul>
<p>This is the first concrete reason to split a big flat network into subnets: broadcast does not cross a router, so a smaller subnet is a smaller broadcast domain.</p>`,
        `<p>Ba cách đánh địa chỉ cho một thông điệp, và chúng khiến mạng tốn rất khác nhau.</p>
<ul>
<li><strong>Unicast</strong> — một người gửi, một người nhận có tên. Gần như toàn bộ lưu lượng của bạn.</li>
<li><strong>Multicast</strong> — một người gửi, một địa chỉ nhóm. Chỉ những máy đã gia nhập nhóm mới xử lý. IPTV và các giao thức định tuyến dùng kiểu này.</li>
<li><strong>Broadcast</strong> — mọi máy trong mạng nội bộ đều phải nhận, giải mã rồi mới quyết định vứt đi. Kể cả cái máy in không bao giờ quan tâm cũng phải trả bằng thời gian CPU.</li>
<li><strong>IPv6 không có broadcast.</strong> Mọi thứ trước đây là broadcast nay là multicast tới một nhóm chọn sẵn — chính là lời sửa cho cái giá ở trên.</li>
</ul>
<p>Đây là lý do cụ thể đầu tiên để chia một mạng phẳng lớn thành nhiều subnet: broadcast không qua được router, nên subnet nhỏ hơn nghĩa là miền quảng bá nhỏ hơn.</p>`],

      [7, 'What a protocol actually provides',
        `<p>Each row is a service a protocol may offer. No single protocol offers all of them, and that is deliberate.</p>
<ul>
<li><strong>Addressing</strong> — identify sender and receiver. Ethernet does it with MAC, IP with logical addresses.</li>
<li><strong>Reliability</strong> — detect loss and resend. TCP only.</li>
<li><strong>Flow control</strong> and <strong>sequencing</strong> — TCP again.</li>
<li><strong>Error detection</strong> — Ethernet's FCS, and checksums in IPv4, TCP and UDP. Detection is not correction: a corrupt frame is discarded, not repaired.</li>
<li><strong>Application interface</strong> — HTTP, DNS, DHCP let two programs, not two machines, talk.</li>
</ul>
<p><strong>UDP leaves out reliability, sequencing and flow control on purpose.</strong> For voice and video, a late packet is worse than a missing one — so paying for retransmission would make the product worse, not better.</p>`,
        `<p>Mỗi dòng là một dịch vụ mà giao thức <em>có thể</em> cung cấp. Không giao thức nào cung cấp tất cả, và đó là chủ ý.</p>
<ul>
<li><strong>Đánh địa chỉ</strong> — xác định ai gửi, ai nhận. Ethernet dùng MAC, IP dùng địa chỉ luận lý.</li>
<li><strong>Tin cậy</strong> — phát hiện mất và gửi lại. Chỉ TCP làm.</li>
<li><strong>Điều khiển luồng</strong> và <strong>sắp thứ tự</strong> — cũng là TCP.</li>
<li><strong>Phát hiện lỗi</strong> — FCS của Ethernet, và checksum trong IPv4, TCP, UDP. Phát hiện không phải sửa: khung hỏng bị vứt đi, không được vá.</li>
<li><strong>Giao diện cho ứng dụng</strong> — HTTP, DNS, DHCP cho phép hai <em>chương trình</em> nói chuyện, chứ không phải hai cái máy.</li>
</ul>
<p><strong>UDP cố tình bỏ tin cậy, thứ tự và điều khiển luồng.</strong> Với thoại và video, một gói tới muộn còn tệ hơn một gói mất hẳn — nên trả giá để gửi lại sẽ làm sản phẩm xấu đi, không tốt lên.</p>`],

      [8, 'Four families of protocol, all in one SSH session',
        `<p>Cisco groups protocols by purpose: communications, security, routing, service discovery. The point of the slide is that you use all four at once, every day.</p>
<ul>
<li>You type <code>ssh vps</code>. <strong>DNS</strong> (service discovery) turns the name into an address.</li>
<li><strong>DHCP</strong> had already given your laptop its own address, mask and gateway.</li>
<li><strong>ARP</strong> found the MAC of the gateway so the first frame had somewhere to go.</li>
<li><strong>IP</strong> carried the packet, <strong>BGP</strong> chose the path between providers, <strong>Ethernet</strong> and <strong>802.11</strong> carried each hop.</li>
<li><strong>TCP</strong> made it a reliable stream and <strong>SSH</strong> encrypted what TCP carried.</li>
</ul>
<p>Nine protocols before the password prompt. When SSH "does not work", any one of the nine can be the one that failed — which is exactly why you need the layered model on the next slides.</p>`,
        `<p>Cisco nhóm giao thức theo mục đích: truyền thông, an ninh, định tuyến, khám phá dịch vụ. Ý của slide là mỗi ngày bạn dùng cả bốn nhóm cùng một lúc.</p>
<ul>
<li>Bạn gõ <code>ssh vps</code>. <strong>DNS</strong> (khám phá dịch vụ) đổi cái tên thành địa chỉ.</li>
<li><strong>DHCP</strong> trước đó đã cấp cho laptop địa chỉ, mặt nạ và cổng ra.</li>
<li><strong>ARP</strong> tìm ra MAC của cổng ra để khung đầu tiên có chỗ mà đi.</li>
<li><strong>IP</strong> chở gói tin, <strong>BGP</strong> chọn đường giữa các nhà mạng, <strong>Ethernet</strong> và <strong>802.11</strong> chở từng chặng.</li>
<li><strong>TCP</strong> biến nó thành dòng tin cậy và <strong>SSH</strong> mã hoá thứ TCP đang chở.</li>
</ul>
<p>Chín giao thức trước khi hiện dấu nhắc mật khẩu. Khi SSH "không vào được", bất kỳ cái nào trong chín cái đó có thể là thủ phạm — chính vì vậy bạn cần mô hình phân tầng ở các slide sau.</p>`],

      [9, 'The TCP/IP protocol suite',
        `<p>A <strong>protocol suite</strong> is a group of protocols designed to work together as a stack. TCP/IP has four layers, and each layer only talks to the one directly above and below it.</p>
<ul>
<li><strong>Application</strong> — HTTP, HTTPS, DNS, DHCP, SMTP, POP3, IMAP, FTP, TFTP, SSH.</li>
<li><strong>Transport</strong> — TCP and UDP, identified by port numbers.</li>
<li><strong>Internet</strong> — IPv4, IPv6, ICMP, plus ARP and NDP for address resolution.</li>
<li><strong>Network Access</strong> — Ethernet, WLAN, PPP: the frame and the physical signalling.</li>
</ul>
<p>TCP/IP is an <strong>open standard</strong>: the documents are public and free to implement. AppleTalk and Novell NetWare were proprietary suites, technically fine, and both are gone. Openness, not elegance, decided the winner.</p>`,
        `<p><strong>Bộ giao thức</strong> (protocol suite) là một nhóm giao thức được thiết kế để làm việc cùng nhau thành một chồng tầng. TCP/IP có bốn tầng, và mỗi tầng chỉ nói chuyện với tầng ngay trên và ngay dưới nó.</p>
<ul>
<li><strong>Application</strong> — HTTP, HTTPS, DNS, DHCP, SMTP, POP3, IMAP, FTP, TFTP, SSH.</li>
<li><strong>Transport</strong> — TCP và UDP, nhận diện nhau bằng số hiệu cổng.</li>
<li><strong>Internet</strong> — IPv4, IPv6, ICMP, thêm ARP và NDP để phân giải địa chỉ.</li>
<li><strong>Network Access</strong> — Ethernet, WLAN, PPP: phần khung và phần tín hiệu vật lý.</li>
</ul>
<p>TCP/IP là <strong>chuẩn mở</strong>: tài liệu công khai và ai cũng được cài đặt miễn phí. AppleTalk và Novell NetWare là bộ giao thức độc quyền, kỹ thuật không tệ, và cả hai đều đã chết. Tính mở, chứ không phải sự tinh xảo, mới quyết định kẻ thắng.</p>`],

      [10, 'Who writes the rules — the standards bodies',
        `<p>Standards are what let a Cisco switch talk to a Dell server through a cable made by a third company.</p>
<ul>
<li><strong>IETF</strong> publishes the RFCs. RFC 791 is IPv4, RFC 793 is TCP. An RFC number is a citable fact, not an opinion.</li>
<li><strong>IANA / ICANN</strong> hand out addresses, domain names and the well-known port numbers — "port 22 is SSH" is an IANA registry entry.</li>
<li><strong>IEEE</strong> owns 802.3 (Ethernet) and 802.11 (Wi-Fi), so it owns the frame and the radio.</li>
<li><strong>ISO</strong> published the OSI model itself (ISO 7498).</li>
<li><strong>ITU-T</strong> covers telecom and optical fibre; <strong>TIA/EIA</strong> covers cabling — TIA-568 defines T568A and T568B, which you will meet in chapter 4.</li>
</ul>
<p>Lab 1.2 asks you to research one of these bodies and name a real document. Practise citing the number, not the organisation's slogan.</p>`,
        `<p>Chuẩn là thứ khiến một switch Cisco nói chuyện được với máy chủ Dell qua sợi cáp của một hãng thứ ba.</p>
<ul>
<li><strong>IETF</strong> xuất bản các RFC. RFC 791 là IPv4, RFC 793 là TCP. Số hiệu RFC là một dữ kiện trích dẫn được, không phải ý kiến.</li>
<li><strong>IANA / ICANN</strong> cấp phát địa chỉ, tên miền và số hiệu cổng thông dụng — "cổng 22 là SSH" là một dòng trong sổ đăng ký của IANA.</li>
<li><strong>IEEE</strong> giữ 802.3 (Ethernet) và 802.11 (Wi-Fi), tức là giữ phần khung và phần sóng.</li>
<li><strong>ISO</strong> chính là nơi xuất bản mô hình OSI (ISO 7498).</li>
<li><strong>ITU-T</strong> lo viễn thông và cáp quang; <strong>TIA/EIA</strong> lo cáp — TIA-568 định nghĩa T568A và T568B mà bạn sẽ gặp ở chương 4.</li>
</ul>
<p>Lab 1.2 yêu cầu bạn tra cứu một tổ chức và nêu một tài liệu thật. Hãy tập trích số hiệu tài liệu, đừng chép khẩu hiệu của tổ chức.</p>`],
    ]),

    cq(7, [['CQ3.1',
      'Explain why protocols are necessary in network communication.',
      'Giải thích vì sao giao thức là cần thiết trong truyền thông mạng.']]),

    bi(
      `<h3>🔎 How to check this yourself</h3>
<p>Every claim above is visible from one terminal. Run these, then read what they prove.</p>
<pre><code class="language-bash">ip -br addr                 # Linux: which interface is up, and its address
ipconfig /all               # Windows equivalent
ping -c 4 1.1.1.1           # is the channel usable at all?
ping -c 4 example.com       # same test, but it needs DNS first
ss -tlnp                    # which programs are listening, on which ports
sudo tcpdump -i any -c 10 -n port 22   # watch the SSH agreement in action</code></pre>
<p>How to read the result:</p>
<pre><code class="language-plaintext">ping 1.1.1.1 works, ping example.com fails  -> the channel is fine, DNS is the missing agreement
ping works, curl to port 3000 hangs         -> the channel is fine, nothing is listening or a firewall drops it
ss -tlnp shows 127.0.0.1:3000               -> the server bound to loopback only; no remote machine can ever reach it
ss -tlnp shows 0.0.0.0:3000                 -> it listens everywhere; if it still hangs, suspect the firewall</code></pre>
<p>That fourth line is the answer to the opening question. <code>curl localhost:3000</code> worked and the remote one hung because the process agreed to talk only to itself.</p>`,
      `<h3>🔎 Cách tự kiểm</h3>
<p>Mọi khẳng định ở trên đều nhìn thấy được từ một cửa sổ dòng lệnh. Gõ các lệnh này, rồi đọc xem chúng chứng minh điều gì.</p>
<pre><code class="language-bash">ip -br addr                 # Linux: giao diện nào đang bật, địa chỉ là gì
ipconfig /all               # lệnh tương đương trên Windows
ping -c 4 1.1.1.1           # kênh truyền có dùng được không
ping -c 4 example.com       # cùng phép thử, nhưng phải qua DNS trước
ss -tlnp                    # chương trình nào đang nghe, ở cổng nào
sudo tcpdump -i any -c 10 -n port 22   # xem thoả thuận SSH diễn ra</code></pre>
<p>Cách đọc kết quả:</p>
<pre><code class="language-plaintext">ping 1.1.1.1 được, ping example.com hỏng  -> kênh truyền tốt, thứ đang thiếu là DNS
ping được, curl vào cổng 3000 treo         -> kênh tốt, hoặc không ai nghe, hoặc tường lửa chặn
ss -tlnp hiện 127.0.0.1:3000               -> tiến trình chỉ gắn vào loopback; không máy nào ngoài vào được
ss -tlnp hiện 0.0.0.0:3000                 -> nó nghe mọi nơi; vẫn treo thì nghi tường lửa</code></pre>
<p>Dòng thứ tư chính là đáp án của câu hỏi mở đầu. <code>curl localhost:3000</code> chạy được còn từ xa thì treo, vì tiến trình chỉ đồng ý nói chuyện với chính nó.</p>`,
    ),

    bi(
      `<h3>⚠️ Traps people actually fall into</h3>
<ol>
<li><strong>"The link light is green, so the network is fine."</strong> <em>Symptom:</em> ping to the gateway works, everything else times out. Green means the physical channel carries a signal — exactly one of the six rules. Prove each of the other five separately before you touch a cable.</li>
<li><strong>Reading "broadcast" as "free".</strong> <em>Symptom:</em> a flat office LAN of 400 hosts feels slow at 09:00 and fine at 13:00, with no single machine to blame. Every host is decoding everybody's ARP and DHCP broadcasts. The fix is subnetting (sessions 30–33), not a faster switch.</li>
<li><strong>Assuming UDP is "the broken one".</strong> <em>Symptom:</em> you replace UDP with TCP in a voice or game service and latency gets worse, not better. TCP's retransmission delivers a packet that is already useless. Choose the protocol by what the application needs, not by which one sounds safer.</li>
<li><strong>Mixing up a standards body with a product.</strong> <em>Symptom:</em> a Lab 1.2 report that says "IEEE makes Wi-Fi routers". IEEE publishes 802.11; vendors build the radios. In the exam the distinction is worth marks.</li>
</ol>`,
      `<h3>⚠️ Bẫy hay mắc</h3>
<ol>
<li><strong>"Đèn link xanh nên mạng ổn."</strong> <em>Triệu chứng:</em> ping tới cổng ra thì được, mọi thứ khác hết giờ. Xanh chỉ nghĩa là kênh vật lý có tín hiệu — đúng một trong sáu luật. Hãy chứng minh riêng năm luật còn lại trước khi động tới sợi cáp.</li>
<li><strong>Hiểu "broadcast" là "miễn phí".</strong> <em>Triệu chứng:</em> mạng văn phòng phẳng 400 máy thấy chậm lúc 9 giờ sáng, 13 giờ lại bình thường, mà không quy được cho máy nào. Mọi máy đang phải giải mã ARP và DHCP quảng bá của tất cả mọi người. Cách sửa là chia subnet (buổi 30–33), không phải mua switch nhanh hơn.</li>
<li><strong>Tưởng UDP là "loại hỏng".</strong> <em>Triệu chứng:</em> bạn đổi UDP sang TCP cho dịch vụ thoại hay game, và độ trễ tệ đi chứ không tốt lên. Việc gửi lại của TCP mang tới một gói tin đã vô dụng. Chọn giao thức theo nhu cầu của ứng dụng, đừng chọn theo cái nghe có vẻ an toàn hơn.</li>
<li><strong>Nhầm tổ chức chuẩn với nhà sản xuất.</strong> <em>Triệu chứng:</em> báo cáo Lab 1.2 viết "IEEE sản xuất router Wi-Fi". IEEE xuất bản 802.11; các hãng mới làm ra thiết bị. Trong đề thi, chỗ phân biệt này có điểm.</li>
</ol>`,
    ),

    bi(
      `<h3>✍️ Exercises — with full answers</h3>
<p><strong>1.</strong> A sensor sends the single line <code>T=27.4</code> to a collector once a minute. Write down its six rules.</p>
<p><strong>2.</strong> Which of the six rules is violated in each case?<br>
(a) The sender transmits 9000-byte frames, the switch discards them.<br>
(b) The client gives up after 100 ms; the server always answers in 300 ms.<br>
(c) The client sends UTF-8, the server reads it as Latin-1.</p>
<p><strong>3.</strong> Name the delivery option each of these uses: an ARP request · a DNS reply · an OSPF hello.</p>
<details><summary>Answers</summary>
<p><strong>1.</strong> <em>Encoding</em> — ASCII text. <em>Formatting</em> — one line, <code>KEY=VALUE</code>, terminated by a newline. <em>Encapsulation</em> — inside a UDP datagram, inside an IP packet, inside an Ethernet frame. <em>Size</em> — under 20 bytes, so well below the 1500-byte MTU; no fragmentation. <em>Timing</em> — one message per 60 s, no reply expected, so no timeout is needed. <em>Delivery</em> — unicast to the collector's address.</p>
<p><strong>2.</strong> (a) message size — 9000 bytes exceeds the standard 1500-byte MTU unless jumbo frames are enabled on every device in the path. (b) timing, specifically the response timeout — the client's timeout is shorter than the server's honest response time. (c) message encoding — both sides transmitted and received the same bytes; only the agreed meaning of those bytes differed.</p>
<p><strong>3.</strong> ARP request — <em>broadcast</em> (it must reach a host whose MAC is unknown). DNS reply — <em>unicast</em> (it is addressed back to the client that asked). OSPF hello — <em>multicast</em> (224.0.0.5, only OSPF routers listen).</p>
</details>`,
      `<h3>✍️ Bài tập — có lời giải đầy đủ</h3>
<p><strong>1.</strong> Một cảm biến gửi đúng một dòng <code>T=27.4</code> tới máy thu mỗi phút một lần. Hãy viết ra sáu luật của nó.</p>
<p><strong>2.</strong> Mỗi trường hợp sau vi phạm luật nào trong sáu luật?<br>
(a) Bên gửi phát khung 9000 byte, switch vứt hết.<br>
(b) Máy khách bỏ cuộc sau 100 ms; máy chủ luôn trả lời sau 300 ms.<br>
(c) Máy khách gửi UTF-8, máy chủ đọc thành Latin-1.</p>
<p><strong>3.</strong> Mỗi thứ sau dùng cách gửi nào: một gói ARP request · một câu trả lời DNS · một gói OSPF hello?</p>
<details><summary>Lời giải</summary>
<p><strong>1.</strong> <em>Mã hoá</em> — văn bản ASCII. <em>Định dạng</em> — một dòng, dạng <code>KHOÁ=GIÁ TRỊ</code>, kết thúc bằng ký tự xuống dòng. <em>Đóng gói</em> — nằm trong một datagram UDP, trong gói IP, trong khung Ethernet. <em>Kích thước</em> — dưới 20 byte, thấp hơn nhiều so với MTU 1500 byte; không phải phân mảnh. <em>Thời điểm</em> — 60 giây một thông điệp, không chờ trả lời, nên không cần thời gian chờ. <em>Cách gửi</em> — unicast tới địa chỉ của máy thu.</p>
<p><strong>2.</strong> (a) kích thước thông điệp — 9000 byte vượt MTU chuẩn 1500 byte, trừ khi bật jumbo frame trên MỌI thiết bị trên đường đi. (b) thời điểm, cụ thể là thời gian chờ trả lời — máy khách đặt thời gian chờ ngắn hơn thời gian trả lời thật của máy chủ. (c) mã hoá thông điệp — hai bên phát và nhận đúng những byte giống nhau, chỉ khác nhau ở ý nghĩa đã thoả thuận của các byte đó.</p>
<p><strong>3.</strong> ARP request — <em>broadcast</em> (nó phải tới được một máy mà ta chưa biết MAC). Trả lời DNS — <em>unicast</em> (gửi thẳng về máy đã hỏi). OSPF hello — <em>multicast</em> (224.0.0.5, chỉ router chạy OSPF mới nghe).</p>
</details>`,
    ),
  ].join('\n'),
};

/* ───────────────────────── Lesson 3.2 — session 8 ───────────────────────── */

const L2 = {
  title: '3.2 — Reference models, encapsulation and data access (FLM session 8)|||3.2 — Mô hình tham chiếu, đóng gói dữ liệu và truy cập dữ liệu (buổi 8 của FLM)',
  slug: 'nwc204-3-2-mo-hinh-tham-chieu-va-dong-goi',
  type: 'DOCUMENT',
  description: 'Buổi 8: OSI 7 tầng cạnh TCP/IP 4 tầng, PDU đổi tên theo tầng, đóng gói và bóc gói từng lớp, khung Ethernet, ba loại địa chỉ ở ba tầng và cách host quyết định cùng mạng hay khác mạng — kèm cách đọc Wireshark và 4 bẫy hay mắc.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 3 · Lesson 3.2 · FLM session 8 of 60 · CLO1, CLO9 · Cisco Module 3</span>
<h2>The four headers wrapped around every request you make</h2>
<p class="lead">This lesson is the one you will come back to for the rest of the course. Once you can name the four headers and say which device reads which one, every later failure becomes a question with a short answer.</p>
<p><strong>Opening question:</strong> you deploy a container, and the site answers from the server itself but returns nothing from outside. Somebody says "it is a network problem". Which <em>layer</em> would you ask them to prove that at, and what single command would settle it?</p>`,
      `<span class="eyebrow">NWC204 · Chương 3 · Bài 3.2 · Buổi 8/60 của FLM · CLO1, CLO9 · Cisco Module 3</span>
<h2>Bốn lớp tiêu đề bọc quanh mỗi yêu cầu bạn gửi đi</h2>
<p class="lead">Đây là bài bạn sẽ quay lại suốt phần còn lại của môn. Khi đã gọi tên được bốn lớp tiêu đề và nói được thiết bị nào đọc lớp nào, mọi sự cố về sau đều trở thành một câu hỏi có câu trả lời ngắn.</p>
<p><strong>Câu hỏi mở đầu:</strong> bạn triển khai một container, trang web trả lời ngay trên máy chủ nhưng từ ngoài vào thì không có gì. Có người bảo "lỗi mạng". Bạn sẽ yêu cầu họ chứng minh điều đó ở <em>tầng</em> nào, và một lệnh duy nhất nào sẽ kết thúc tranh cãi?</p>`,
    ),

    walkHead('nwc204-ch03', 11, 21,
      'Slides 11–21 cover FLM session 8: 3.5 Reference Models, 3.6 Data Encapsulation and 3.7 Data Access.',
      'Slide 11–21 là buổi 8 của FLM: 3.5 Reference Models, 3.6 Data Encapsulation và 3.7 Data Access.'),

    walk('nwc204-ch03', [
      [11, 'Two reference models, one stack of ideas',
        `<p>A <strong>reference model</strong> is a way of splitting one enormous problem into layers that can be designed, taught and debugged separately.</p>
<ul>
<li><strong>OSI</strong> has seven layers. It was published by ISO as a teaching and design framework, and it is the vocabulary the whole industry argues in.</li>
<li><strong>TCP/IP</strong> has four layers. It is the stack actually installed on your laptop and on the VPS.</li>
<li>Neither model is "more correct". OSI names things more finely; TCP/IP describes what really runs.</li>
<li>The mapping is not mysterious: OSI 7+6+5 collapse into TCP/IP Application, OSI 2+1 collapse into Network Access.</li>
</ul>
<p>Why layers at all? Because they let you replace copper with fibre without touching HTTP, and replace HTTP/1.1 with HTTP/2 without touching the cable. That independence is the entire payoff.</p>`,
        `<p><strong>Mô hình tham chiếu</strong> là cách chẻ một bài toán khổng lồ thành các tầng có thể thiết kế, dạy và gỡ lỗi riêng rẽ.</p>
<ul>
<li><strong>OSI</strong> có bảy tầng. ISO xuất bản nó như một khung để dạy và thiết kế, và nó là ngôn ngữ chung mà cả ngành dùng để tranh luận.</li>
<li><strong>TCP/IP</strong> có bốn tầng. Đây mới là chồng tầng thật sự đang cài trên laptop và trên VPS của bạn.</li>
<li>Không mô hình nào "đúng hơn". OSI đặt tên chi li hơn; TCP/IP mô tả thứ đang thật sự chạy.</li>
<li>Cách ánh xạ không có gì bí ẩn: OSI 7+6+5 gộp lại thành Application của TCP/IP, OSI 2+1 gộp thành Network Access.</li>
</ul>
<p>Vì sao phải phân tầng? Vì nhờ nó bạn thay cáp đồng bằng cáp quang mà không phải đụng tới HTTP, và đổi HTTP/1.1 sang HTTP/2 mà không phải đụng tới sợi cáp. Chính sự độc lập đó là toàn bộ cái lợi.</p>`],

      [12, 'OSI upper layers — what the program sees',
        `<p>Layers 7, 6 and 5 are the half that belongs to the application, and in practice they are hard to separate.</p>
<ul>
<li><strong>Layer 7 Application</strong> — the protocol your program speaks: HTTP, SSH, DNS, SMTP. Note: this is not the program itself. Chrome is not layer 7; HTTP is.</li>
<li><strong>Layer 6 Presentation</strong> — common format, compression and encryption: JPEG, GIF, TLS records.</li>
<li><strong>Layer 5 Session</strong> — starting, keeping and ending one conversation, including restart after interruption.</li>
<li>TCP/IP merges all three, which is honest: HTTP does its own formatting, TLS runs its own sessions, and no separate layer-5 software exists on your machine.</li>
</ul>
<p>In the exam, "which OSI layer does TLS belong to" has the expected answer <em>Presentation (6)</em>, even though in real code TLS sits between TCP and HTTP.</p>`,
        `<p>Tầng 7, 6 và 5 là nửa thuộc về ứng dụng, và trong thực tế rất khó tách rời nhau.</p>
<ul>
<li><strong>Tầng 7 Application</strong> — giao thức mà chương trình của bạn nói: HTTP, SSH, DNS, SMTP. Lưu ý: đây không phải bản thân chương trình. Chrome không phải tầng 7; HTTP mới là.</li>
<li><strong>Tầng 6 Presentation</strong> — định dạng chung, nén và mã hoá: JPEG, GIF, bản ghi TLS.</li>
<li><strong>Tầng 5 Session</strong> — mở, giữ và đóng một cuộc trò chuyện, kể cả khôi phục sau khi đứt.</li>
<li>TCP/IP gộp cả ba lại, và đó là cách nói thật thà: HTTP tự lo định dạng, TLS tự lo phiên, và trên máy bạn không có phần mềm "tầng 5" riêng nào cả.</li>
</ul>
<p>Trong đề thi, câu "TLS thuộc tầng OSI nào" có đáp án được chờ đợi là <em>Presentation (6)</em>, dù trong mã thật TLS nằm giữa TCP và HTTP.</p>`],

      [13, 'OSI lower layers — what the network does',
        `<p>Layers 4 to 1 are the half that belongs to the network, and they are where you will spend your working life.</p>
<ul>
<li><strong>Layer 4 Transport</strong> — port numbers and, for TCP, end-to-end reliability, sequencing and flow control.</li>
<li><strong>Layer 3 Network</strong> — logical addresses and choosing a path across many networks. This is the layer a router works at.</li>
<li><strong>Layer 2 Data Link</strong> — framing on one link, MAC addresses, and error detection with the FCS. This is the layer a switch works at.</li>
<li><strong>Layer 1 Physical</strong> — voltages, light, radio, connectors and pinouts. Chapter 4 is entirely about this layer.</li>
</ul>
<p>The sentence to memorise: layers 1–2 get you across <strong>one link</strong>; layer 3 gets you across <strong>many</strong>; layer 4 makes many packets into <strong>one conversation</strong>.</p>`,
        `<p>Tầng 4 xuống tầng 1 là nửa thuộc về mạng, và đây là chỗ bạn sẽ dành cả đời làm nghề.</p>
<ul>
<li><strong>Tầng 4 Transport</strong> — số hiệu cổng, và với TCP thì thêm tin cậy đầu-cuối, sắp thứ tự và điều khiển luồng.</li>
<li><strong>Tầng 3 Network</strong> — địa chỉ luận lý và chọn đường đi qua nhiều mạng. Router làm việc ở tầng này.</li>
<li><strong>Tầng 2 Data Link</strong> — đóng khung trên một chặng, địa chỉ MAC, và phát hiện lỗi bằng FCS. Switch làm việc ở tầng này.</li>
<li><strong>Tầng 1 Physical</strong> — điện áp, ánh sáng, sóng, đầu nối và sơ đồ chân. Cả chương 4 chỉ nói về tầng này.</li>
</ul>
<p>Câu cần thuộc: tầng 1–2 đưa bạn qua <strong>một chặng</strong>; tầng 3 đưa bạn qua <strong>nhiều chặng</strong>; tầng 4 biến nhiều gói tin thành <strong>một cuộc trò chuyện</strong>.</p>`],

      [14, 'Mapping OSI to TCP/IP',
        `<p>Read this table as a translation dictionary. An exam question will give you one column and ask for the other.</p>
<ul>
<li>OSI 7, 6, 5 → TCP/IP <strong>Application</strong>. Addressed by name and URL.</li>
<li>OSI 4 → TCP/IP <strong>Transport</strong>. Addressed by <strong>port number</strong>.</li>
<li>OSI 3 → TCP/IP <strong>Internet</strong>. Addressed by <strong>IP address</strong>.</li>
<li>OSI 2 and 1 → TCP/IP <strong>Network Access</strong>. Addressed by <strong>MAC address</strong>; layer 1 has no address at all, only bits.</li>
</ul>
<p>The last column is the useful one. Three layers, three kinds of address, and each is looked up by a different device: the switch reads MAC, the router reads IP, the operating system reads the port.</p>`,
        `<p>Hãy đọc bảng này như một cuốn từ điển đối chiếu. Đề thi sẽ cho bạn một cột và hỏi cột kia.</p>
<ul>
<li>OSI 7, 6, 5 → <strong>Application</strong> của TCP/IP. Đánh địa chỉ bằng tên và URL.</li>
<li>OSI 4 → <strong>Transport</strong>. Đánh địa chỉ bằng <strong>số hiệu cổng</strong>.</li>
<li>OSI 3 → <strong>Internet</strong>. Đánh địa chỉ bằng <strong>địa chỉ IP</strong>.</li>
<li>OSI 2 và 1 → <strong>Network Access</strong>. Đánh địa chỉ bằng <strong>địa chỉ MAC</strong>; riêng tầng 1 không có địa chỉ nào, chỉ có bit.</li>
</ul>
<p>Cột cuối mới là cột hữu dụng. Ba tầng, ba loại địa chỉ, và mỗi loại do một thiết bị khác nhau tra: switch đọc MAC, router đọc IP, hệ điều hành đọc cổng.</p>`],

      [15, 'The PDU changes name at every layer',
        `<p><strong>PDU</strong> stands for Protocol Data Unit: the name for "the thing being handed down" at each layer.</p>
<ul>
<li><strong>Data</strong> — what the application produced, for example an HTTP GET.</li>
<li><strong>Segment</strong> — Transport added ports and a sequence number. A <strong>UDP</strong> PDU is called a <em>datagram</em>, not a segment; exams test this.</li>
<li><strong>Packet</strong> — the Internet layer added source and destination IP addresses.</li>
<li><strong>Frame</strong> — Network Access added MAC addresses and the FCS.</li>
<li><strong>Bits</strong> — Physical put the frame on the medium as signals.</li>
</ul>
<p>The name does not describe different bytes. The same payload carries all five names on its way down; the name only tells you <em>which header is currently outermost</em>.</p>`,
        `<p><strong>PDU</strong> là viết tắt của Protocol Data Unit: tên gọi của "thứ đang được chuyển xuống" ở mỗi tầng.</p>
<ul>
<li><strong>Data</strong> — thứ ứng dụng tạo ra, ví dụ một câu HTTP GET.</li>
<li><strong>Segment</strong> — tầng Transport đã thêm cổng và số thứ tự. PDU của <strong>UDP</strong> gọi là <em>datagram</em>, không gọi là segment; đề thi hay hỏi chỗ này.</li>
<li><strong>Packet</strong> — tầng Internet đã thêm địa chỉ IP nguồn và đích.</li>
<li><strong>Frame</strong> — tầng Network Access đã thêm địa chỉ MAC và FCS.</li>
<li><strong>Bits</strong> — tầng Physical đưa khung lên môi trường dưới dạng tín hiệu.</li>
</ul>
<p>Cái tên không mô tả những byte khác nhau. Cùng một phần tải mang cả năm cái tên trên đường đi xuống; cái tên chỉ cho biết <em>tiêu đề nào hiện đang nằm ngoài cùng</em>.</p>`],

      [16, 'Encapsulation — the sender wraps',
        `<p>Encapsulation is the act of adding a header (and for Ethernet, a trailer) as the data passes down the stack.</p>
<ul>
<li>HTTP data goes into a TCP segment: source port 51544, destination port 80.</li>
<li>The segment goes into an IP packet: source 192.168.10.10, destination 203.0.113.5.</li>
<li>The packet goes into an Ethernet frame: source and destination MAC, plus the FCS trailer.</li>
<li>Each layer treats everything above it as <strong>opaque payload</strong> — it never inspects it.</li>
</ul>
<p>This is why a switch can forward traffic for a protocol invented after the switch was built, and why a router does not need to understand HTTPS to route it. Encapsulation is what makes the Internet extensible.</p>`,
        `<p>Đóng gói (encapsulation) là việc thêm một tiêu đề (và với Ethernet là cả phần đuôi) khi dữ liệu đi xuống các tầng.</p>
<ul>
<li>Dữ liệu HTTP nằm vào một segment TCP: cổng nguồn 51544, cổng đích 80.</li>
<li>Segment đó nằm vào một gói IP: nguồn 192.168.10.10, đích 203.0.113.5.</li>
<li>Gói IP nằm vào một khung Ethernet: MAC nguồn, MAC đích, cộng phần đuôi FCS.</li>
<li>Mỗi tầng coi mọi thứ ở trên nó là <strong>phần tải mờ đục</strong> — nó không bao giờ mở ra xem.</li>
</ul>
<p>Nhờ vậy một switch mới chuyển tiếp được lưu lượng của giao thức được phát minh sau khi nó xuất xưởng, và router không cần hiểu HTTPS vẫn định tuyến được. Đóng gói chính là thứ khiến Internet mở rộng được.</p>`],

      [17, 'De-encapsulation — the receiver unwraps',
        `<p>Going up the stack, every layer strips its own header, but only after asking a question that can answer "no".</p>
<ul>
<li><strong>Physical</strong> — recover a bit stream from the signal.</li>
<li><strong>Data Link</strong> — recompute the FCS. If it does not match, the frame is <em>silently discarded</em> and an error counter increments. Then: is the destination MAC mine (or broadcast/multicast I joined)?</li>
<li><strong>Internet</strong> — is the destination IP mine? If not, and I am a router, forward it; if not, and I am a host, drop it.</li>
<li><strong>Transport</strong> — which port? If nothing is listening, TCP replies RST and UDP replies ICMP port unreachable.</li>
<li><strong>Application</strong> — hand the request to the web server.</li>
</ul>
<p>Four different "no" answers, four different silent failures, four different fixes. Knowing <em>which</em> one said no is the whole skill.</p>`,
        `<p>Đi ngược lên, mỗi tầng bóc tiêu đề của chính nó, nhưng chỉ sau khi hỏi một câu có thể trả lời "không".</p>
<ul>
<li><strong>Physical</strong> — dựng lại dòng bit từ tín hiệu.</li>
<li><strong>Data Link</strong> — tính lại FCS. Không khớp thì khung bị <em>vứt trong im lặng</em> và một bộ đếm lỗi tăng lên. Rồi mới hỏi: MAC đích có phải của tôi không (hoặc broadcast/multicast mà tôi đã tham gia)?</li>
<li><strong>Internet</strong> — IP đích có phải của tôi không? Nếu không và tôi là router thì chuyển tiếp; nếu không và tôi là máy trạm thì vứt.</li>
<li><strong>Transport</strong> — cổng nào? Không ai nghe thì TCP trả về RST, còn UDP trả về ICMP port unreachable.</li>
<li><strong>Application</strong> — giao yêu cầu cho máy chủ web.</li>
</ul>
<p>Bốn câu "không" khác nhau, bốn kiểu hỏng câm khác nhau, bốn cách sửa khác nhau. Biết <em>cái nào</em> đã nói không chính là toàn bộ kỹ năng.</p>`],

      [18, 'The Ethernet frame on the wire',
        `<p>This is the outermost wrapper, and the one a switch reads. Learn the field sizes — they appear in exams as numbers.</p>
<ul>
<li><strong>Preamble + SFD, 8 bytes</strong> — an alternating pattern so the receiver can lock onto the bit boundaries. It is not counted as part of the frame length.</li>
<li><strong>Destination MAC, 6 bytes</strong> and <strong>Source MAC, 6 bytes</strong>.</li>
<li><strong>Type, 2 bytes</strong> — 0x0800 means IPv4 is inside, 0x86DD means IPv6, 0x0806 means ARP.</li>
<li><strong>Payload, 46–1500 bytes</strong> — the minimum of 46 exists so the whole frame reaches 64 bytes, the smallest size collision detection could work with.</li>
<li><strong>FCS, 4 bytes</strong> — a CRC over the frame. Mismatch means discard, never repair.</li>
</ul>
<p>A frame shorter than 64 bytes is a <em>runt</em>; longer than 1518 is a <em>giant</em>. Both show up as interface counters in chapter 4's commands.</p>`,
        `<p>Đây là lớp vỏ ngoài cùng, cũng là lớp mà switch đọc. Hãy thuộc kích thước từng trường — đề thi hỏi bằng con số.</p>
<ul>
<li><strong>Preamble + SFD, 8 byte</strong> — một mẫu bit xen kẽ để bên nhận bắt được ranh giới bit. Nó không tính vào độ dài khung.</li>
<li><strong>MAC đích, 6 byte</strong> và <strong>MAC nguồn, 6 byte</strong>.</li>
<li><strong>Type, 2 byte</strong> — 0x0800 nghĩa là bên trong là IPv4, 0x86DD là IPv6, 0x0806 là ARP.</li>
<li><strong>Payload, 46–1500 byte</strong> — mức tối thiểu 46 tồn tại để cả khung đạt 64 byte, kích thước nhỏ nhất mà cơ chế phát hiện xung đột còn làm việc được.</li>
<li><strong>FCS, 4 byte</strong> — một mã CRC trên toàn khung. Lệch thì vứt, không bao giờ vá.</li>
</ul>
<p>Khung ngắn hơn 64 byte gọi là <em>runt</em>; dài hơn 1518 byte gọi là <em>giant</em>. Cả hai đều hiện ra ở bộ đếm giao diện trong các lệnh của chương 4.</p>`],

      [19, 'Three addresses, three different jobs',
        `<p>The single most useful table in this chapter. The key column is the last one.</p>
<ul>
<li><strong>Port</strong> — which program on the host. Does not change on the way.</li>
<li><strong>IP address</strong> — end to end across every router. Does not change either, except where NAT deliberately rewrites it.</li>
<li><strong>MAC address</strong> — valid on <em>one link only</em>. It is rewritten at <em>every</em> router hop.</li>
</ul>
<p>Follow the flow diagram: on link 1 the frame carries PC → R1 as MACs; on link 2 it carries R1 → R2. The IP addresses in the packet inside are identical the whole way.</p>
<p>This is why you can never "ping a MAC address" across the Internet, and why the MAC in your ARP table is always the gateway's, not the remote server's.</p>`,
        `<p>Đây là bảng hữu dụng nhất của chương. Cột đáng giá nhất là cột cuối.</p>
<ul>
<li><strong>Cổng</strong> — chương trình nào trên máy. Không đổi trên đường đi.</li>
<li><strong>Địa chỉ IP</strong> — đầu-cuối, xuyên qua mọi router. Cũng không đổi, trừ chỗ NAT cố tình viết lại.</li>
<li><strong>Địa chỉ MAC</strong> — chỉ có giá trị trên <em>một chặng</em>. Nó bị viết lại ở <em>mỗi</em> router.</li>
</ul>
<p>Hãy đi theo sơ đồ luồng: chặng 1 khung mang MAC PC → R1; chặng 2 mang MAC R1 → R2. Còn địa chỉ IP trong gói tin bên trong thì giống hệt nhau suốt cả đường.</p>
<p>Đó là lý do bạn không bao giờ "ping được một địa chỉ MAC" qua Internet, và lý do MAC trong bảng ARP của bạn luôn là của cổng ra, không phải của máy chủ ở xa.</p>`],

      [20, 'Same network or different? The host decides first',
        `<p>Before it can build a frame, the sending host must answer one question: is the destination on my own network?</p>
<ul>
<li><strong>Same network</strong> — put the destination host's own MAC in the frame and send it directly. ARP finds that MAC.</li>
<li><strong>Different network</strong> — put the <strong>default gateway's</strong> MAC in the frame, while leaving the destination IP untouched.</li>
<li>The decision is made with a <strong>bitwise AND</strong> of both addresses against the host's own subnet mask — that is chapter 4B, and it is the reason chapter 4B exists.</li>
<li>Note what this means: the mask is a purely <em>local</em> decision. Your neighbour's wrong mask never affects your machine.</li>
</ul>
<p>A wrong mask breaks nothing physical. It makes the host send local traffic to a router that will not route it back onto the same segment, or send remote traffic to a neighbour that is not a router at all.</p>`,
        `<p>Trước khi dựng được khung, máy gửi phải trả lời một câu: đích có nằm trong mạng của chính tôi không?</p>
<ul>
<li><strong>Cùng mạng</strong> — đặt MAC của chính máy đích vào khung rồi gửi thẳng. ARP là thứ đi tìm cái MAC đó.</li>
<li><strong>Khác mạng</strong> — đặt MAC của <strong>cổng ra mặc định</strong> vào khung, còn địa chỉ IP đích thì để nguyên.</li>
<li>Quyết định này được đưa ra bằng phép <strong>AND theo bit</strong> giữa hai địa chỉ với mặt nạ của chính máy — đó là chương 4B, và cũng là lý do chương 4B tồn tại.</li>
<li>Để ý điều này nghĩa là gì: mặt nạ là quyết định hoàn toàn <em>cục bộ</em>. Máy bên cạnh đặt sai mặt nạ không bao giờ ảnh hưởng tới máy bạn.</li>
</ul>
<p>Mặt nạ sai không làm hỏng thứ gì về vật lý. Nó khiến máy gửi lưu lượng nội bộ tới một router sẽ không định tuyến ngược lại cùng đoạn mạng, hoặc gửi lưu lượng đi xa tới một máy hàng xóm vốn không phải router.</p>`],

      [21, 'Wireshark shows all four headers at once',
        `<p>Wireshark is where this chapter stops being abstract. Its indentation <em>is</em> the encapsulation diagram.</p>
<ul>
<li><strong>Frame</strong> — the capture metadata: number, size, timestamp.</li>
<li><strong>Ethernet II</strong> — source MAC, destination MAC, Type 0x0800.</li>
<li><strong>Internet Protocol Version 4</strong> — source and destination IP.</li>
<li><strong>Transmission Control Protocol</strong> — source port, destination port, sequence number.</li>
<li><strong>Hypertext Transfer Protocol</strong> — at last, the GET line you actually asked for.</li>
</ul>
<p>Practical habit: when someone tells you traffic "is not arriving", capture on <em>both</em> ends. Seeing the frame leave and not arrive tells you the fault is between them; seeing it arrive and get no answer tells you the fault is inside the receiver.</p>`,
        `<p>Wireshark là chỗ chương này thôi trừu tượng. Cách nó thụt lề <em>chính là</em> sơ đồ đóng gói.</p>
<ul>
<li><strong>Frame</strong> — thông tin của lần bắt gói: số thứ tự, kích thước, mốc thời gian.</li>
<li><strong>Ethernet II</strong> — MAC nguồn, MAC đích, Type 0x0800.</li>
<li><strong>Internet Protocol Version 4</strong> — IP nguồn và IP đích.</li>
<li><strong>Transmission Control Protocol</strong> — cổng nguồn, cổng đích, số thứ tự.</li>
<li><strong>Hypertext Transfer Protocol</strong> — cuối cùng mới tới dòng GET mà bạn thật sự muốn xem.</li>
</ul>
<p>Thói quen thực dụng: khi ai đó bảo lưu lượng "không tới", hãy bắt gói ở <em>cả hai</em> đầu. Thấy khung đi ra mà không tới nơi nghĩa là lỗi nằm giữa đường; thấy nó tới nơi mà không ai trả lời nghĩa là lỗi nằm trong chính máy nhận.</p>`],
    ]),

    bi(
      `<h3>🧭 The same journey as a diagram</h3>
<pre><code class="language-mermaid">
flowchart TD
  A["HTTP GET /index.html<br/>(data)"] --> B["+ TCP header<br/>src 51544 → dst 80<br/>(segment)"]
  B --> C["+ IP header<br/>192.168.10.10 → 203.0.113.5<br/>(packet)"]
  C --> D["+ Ethernet header and FCS<br/>MAC PC → MAC R1<br/>(frame)"]
  D --> E["signals on the medium<br/>(bits)"]
  E --> F["receiver: check FCS,<br/>is this MAC mine?"]
  F --> G["is this IP mine?"]
  G --> H["which port is listening?"]
  H --> I["web server reads the GET"]
</code></pre>`,
      `<h3>🧭 Cùng hành trình đó, vẽ thành sơ đồ</h3>
<pre><code class="language-mermaid">
flowchart TD
  A["HTTP GET /index.html<br/>(data)"] --> B["+ tiêu đề TCP<br/>nguồn 51544 → đích 80<br/>(segment)"]
  B --> C["+ tiêu đề IP<br/>192.168.10.10 → 203.0.113.5<br/>(packet)"]
  C --> D["+ tiêu đề Ethernet và FCS<br/>MAC PC → MAC R1<br/>(frame)"]
  D --> E["tín hiệu trên môi trường<br/>(bits)"]
  E --> F["bên nhận: kiểm FCS,<br/>MAC này của tôi chứ?"]
  F --> G["IP này của tôi chứ?"]
  G --> H["cổng nào đang nghe?"]
  H --> I["máy chủ web đọc câu GET"]
</code></pre>`,
    ),

    cq(8, [['CQ3.2',
      'Explain how the TCP/IP model and the OSI model are used to facilitate standardization in the communication process.',
      'Giải thích mô hình TCP/IP và mô hình OSI được dùng như thế nào để hỗ trợ việc chuẩn hoá trong quá trình truyền thông.']]),

    bi(
      `<h3>🔎 How to check this yourself — find the four headers on your own machine</h3>
<p>Install Wireshark (that is Lab 1.2, next lesson) or use <code>tcpdump</code>, which is already on macOS and most Linux systems.</p>
<pre><code class="language-bash"># Capture ten packets of your own web traffic, with full decoding
sudo tcpdump -i any -c 10 -n -v 'tcp port 80 or tcp port 443'

# Write a capture file you can open in Wireshark later
sudo tcpdump -i any -c 200 -w /tmp/capture.pcap

# Prove the MAC changes per hop but the IP does not
arp -an                  # the gateway MAC your frames are addressed to
traceroute -n 1.1.1.1    # each line is one router; the destination IP never changes</code></pre>
<p>In Wireshark, click one HTTP packet and expand the tree. You must be able to point at all four lines: Ethernet II, Internet Protocol, Transmission Control Protocol, Hypertext Transfer Protocol. If you cannot, you have not done this lesson yet.</p>
<p>Answering the opening question: ask them to prove it at <strong>layer 4</strong>, with one command.</p>
<pre><code class="language-bash">ss -tlnp | grep 3000</code></pre>
<pre><code class="language-plaintext">LISTEN 0 511 127.0.0.1:3000   -> not a network problem: the process refuses everyone but itself
LISTEN 0 511 0.0.0.0:3000     -> it does listen publicly; now suspect the firewall or the container port mapping</code></pre>`,
      `<h3>🔎 Cách tự kiểm — tự tìm bốn lớp tiêu đề trên máy của bạn</h3>
<p>Cài Wireshark (chính là Lab 1.2, bài kế tiếp) hoặc dùng <code>tcpdump</code>, vốn có sẵn trên macOS và hầu hết Linux.</p>
<pre><code class="language-bash"># Bắt mười gói lưu lượng web của chính bạn, giải mã đầy đủ
sudo tcpdump -i any -c 10 -n -v 'tcp port 80 or tcp port 443'

# Ghi ra file để mở bằng Wireshark sau
sudo tcpdump -i any -c 200 -w /tmp/capture.pcap

# Chứng minh MAC đổi theo từng chặng còn IP thì không
arp -an                  # MAC của cổng ra, nơi khung của bạn được gửi tới
traceroute -n 1.1.1.1    # mỗi dòng là một router; IP đích không hề đổi</code></pre>
<p>Trong Wireshark, bấm vào một gói HTTP rồi mở cây ra. Bạn phải chỉ được đủ bốn dòng: Ethernet II, Internet Protocol, Transmission Control Protocol, Hypertext Transfer Protocol. Chưa chỉ được thì coi như chưa học xong bài này.</p>
<p>Trả lời câu hỏi mở đầu: hãy yêu cầu chứng minh ở <strong>tầng 4</strong>, bằng một lệnh.</p>
<pre><code class="language-bash">ss -tlnp | grep 3000</code></pre>
<pre><code class="language-plaintext">LISTEN 0 511 127.0.0.1:3000   -> không phải lỗi mạng: tiến trình từ chối mọi người trừ chính nó
LISTEN 0 511 0.0.0.0:3000     -> nó có nghe công khai; giờ mới nghi tường lửa hoặc ánh xạ cổng của container</code></pre>`,
    ),

    bi(
      `<h3>⚠️ Traps people actually fall into</h3>
<ol>
<li><strong>Calling everything "a network problem".</strong> <em>Symptom:</em> hours lost while two people argue. The layered model turns the argument into a test: <code>ping</code> proves layer 3, <code>ss -tlnp</code> proves layer 4, <code>curl -v</code> proves layer 7. Whoever refuses to name a layer is guessing.</li>
<li><strong>Expecting the MAC address of a remote server.</strong> <em>Symptom:</em> a student captures traffic to a website and reports the "server MAC" — which is really the router's. MAC addresses only exist on one link. Anything beyond your gateway has no MAC you can see.</li>
<li><strong>Thinking a bad FCS produces an error message.</strong> <em>Symptom:</em> "there are no errors in the log" while a link loses 2% of frames. A corrupt frame is discarded silently and counted; nothing is logged. You must read interface counters (<code>ip -s link</code>) to see it — the commands are in chapter 4.</li>
<li><strong>Confusing encapsulation with encryption.</strong> <em>Symptom:</em> "the data is wrapped in headers, so it is protected". Headers hide nothing at all — anyone on the path reads your HTTP. Only TLS (layer 6 in OSI terms) makes it unreadable.</li>
</ol>`,
      `<h3>⚠️ Bẫy hay mắc</h3>
<ol>
<li><strong>Gọi mọi thứ là "lỗi mạng".</strong> <em>Triệu chứng:</em> mất hàng giờ vì hai người cãi nhau. Mô hình phân tầng biến cuộc cãi thành phép thử: <code>ping</code> chứng minh tầng 3, <code>ss -tlnp</code> chứng minh tầng 4, <code>curl -v</code> chứng minh tầng 7. Ai không chịu nêu tên tầng thì người đó đang đoán.</li>
<li><strong>Đòi xem địa chỉ MAC của máy chủ ở xa.</strong> <em>Triệu chứng:</em> sinh viên bắt gói tới một trang web rồi báo cáo "MAC của máy chủ" — thực ra là MAC của router. Địa chỉ MAC chỉ tồn tại trên một chặng. Mọi thứ nằm sau cổng ra đều không có MAC nào bạn nhìn thấy được.</li>
<li><strong>Tưởng FCS sai sẽ sinh ra thông báo lỗi.</strong> <em>Triệu chứng:</em> "log không có lỗi gì" trong khi đường truyền mất 2% số khung. Khung hỏng bị vứt trong im lặng và chỉ được đếm; không có dòng log nào. Phải đọc bộ đếm giao diện (<code>ip -s link</code>) mới thấy — các lệnh nằm ở chương 4.</li>
<li><strong>Nhầm đóng gói với mã hoá.</strong> <em>Triệu chứng:</em> "dữ liệu đã được bọc trong tiêu đề nên an toàn rồi". Tiêu đề không che giấu gì cả — bất cứ ai trên đường đi đều đọc được HTTP của bạn. Chỉ có TLS (theo OSI là tầng 6) mới làm nó không đọc được.</li>
</ol>`,
    ),

    bi(
      `<h3>✍️ Exercises — with full answers</h3>
<p><strong>1.</strong> Name the PDU and the address used at each TCP/IP layer for one HTTPS request.</p>
<p><strong>2.</strong> A packet crosses three routers between you and a server. How many times does the source MAC change? How many times does the source IP change (assume no NAT)?</p>
<p><strong>3.</strong> Which layer does each failure belong to?<br>
(a) <code>ping 8.8.8.8</code> works, <code>ping google.com</code> fails.<br>
(b) <code>curl</code> returns "connection refused" instantly.<br>
(c) The interface shows 40 000 RX errors and the link keeps flapping.<br>
(d) The page loads but every image is corrupted the same way.</p>
<details><summary>Answers</summary>
<p><strong>1.</strong> Application — <em>data</em>, addressed by host name/URL. Transport — <em>segment</em>, addressed by port (443). Internet — <em>packet</em>, addressed by IP. Network Access — <em>frame</em>, addressed by MAC; on the medium it is simply <em>bits</em>, with no address.</p>
<p><strong>2.</strong> Four links means the source MAC is set <strong>four times</strong> (your NIC, then each of the three routers as it forwards). The source IP is set <strong>once</strong> and never changes, because there is no NAT in this scenario.</p>
<p><strong>3.</strong> (a) Application layer — name resolution, DNS; layer 3 already proved fine. (b) Transport — an instant refusal is a TCP RST, meaning the packet arrived and nothing was listening on that port. A firewall drop would hang instead. (c) Physical/Data Link — errors and flapping are cable, connector or duplex problems. (d) Presentation in OSI terms — the bytes arrived intact (TCP verified them), so the fault is in how they are being interpreted or transcoded, not in transport.</p>
</details>`,
      `<h3>✍️ Bài tập — có lời giải đầy đủ</h3>
<p><strong>1.</strong> Nêu tên PDU và loại địa chỉ được dùng ở từng tầng TCP/IP cho một yêu cầu HTTPS.</p>
<p><strong>2.</strong> Một gói tin đi qua ba router giữa bạn và máy chủ. MAC nguồn bị đặt lại bao nhiêu lần? IP nguồn đổi bao nhiêu lần (giả sử không có NAT)?</p>
<p><strong>3.</strong> Mỗi sự cố sau thuộc tầng nào?<br>
(a) <code>ping 8.8.8.8</code> được, <code>ping google.com</code> hỏng.<br>
(b) <code>curl</code> trả về "connection refused" ngay lập tức.<br>
(c) Giao diện báo 40 000 lỗi RX và đường truyền cứ lên xuống.<br>
(d) Trang tải được nhưng mọi ảnh đều hỏng theo cùng một kiểu.</p>
<details><summary>Lời giải</summary>
<p><strong>1.</strong> Application — <em>data</em>, đánh địa chỉ bằng tên máy/URL. Transport — <em>segment</em>, đánh địa chỉ bằng cổng (443). Internet — <em>packet</em>, đánh địa chỉ bằng IP. Network Access — <em>frame</em>, đánh địa chỉ bằng MAC; trên môi trường thì chỉ còn là <em>bits</em>, không có địa chỉ nào.</p>
<p><strong>2.</strong> Bốn chặng nghĩa là MAC nguồn được đặt <strong>bốn lần</strong> (card mạng của bạn, rồi từng router trong ba router khi chuyển tiếp). IP nguồn được đặt <strong>một lần</strong> và không bao giờ đổi, vì tình huống này không có NAT.</p>
<p><strong>3.</strong> (a) Tầng Application — phân giải tên, tức DNS; tầng 3 đã được chứng minh là tốt. (b) Transport — bị từ chối tức thì là một gói TCP RST, nghĩa là gói đã tới nơi và không ai nghe ở cổng đó. Nếu tường lửa vứt gói thì sẽ treo chứ không trả lời ngay. (c) Physical/Data Link — lỗi và nhấp nháy là chuyện cáp, đầu nối hoặc duplex. (d) Theo OSI là tầng Presentation — các byte đã tới nguyên vẹn (TCP đã kiểm), nên lỗi nằm ở cách diễn giải hoặc chuyển mã, không phải ở khâu vận chuyển.</p>
</details>`,
    ),
  ].join('\n'),
};

/* ──────────────────── Lesson 3.3 — Lab 1.2, sessions 9–10 ──────────────────── */

const L3 = {
  title: '3.3 — Lab 1.2: design a communications system, research standards, install Wireshark (FLM sessions 9–10)|||3.3 — Lab 1.2: thiết kế hệ truyền thông, tra cứu chuẩn, cài Wireshark (buổi 9–10 của FLM)',
  slug: 'nwc204-3-3-lab-1-2-wireshark',
  type: 'DOCUMENT',
  description: 'Buổi 9–10: ba việc của Lab 1.2 (3.0.3 thiết kế giao thức, 3.4.4 tra cứu chuẩn, 3.7.9 và 3.7.10 cài và dùng Wireshark), cách làm từng bước trên máy thật, và cách nói lại được — vì trường đánh lab này là Dialogue-based Assessment.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 3 · Lesson 3.3 · FLM sessions 9–10 of 60 · CLO1, CLO9 · Lab 1.2</span>
<h2>Lab 1.2 — the first time you look at real packets</h2>
<p class="lead">FLM marks Lab 1.2 as <strong>"Dialogue-based Assessment &amp; Self Learning"</strong>. That means a screenshot is not the deliverable: you must be able to explain the capture out loud while someone points at a line of it.</p>
<p><strong>Opening question:</strong> before you install anything — if you capture traffic on your own laptop while loading a website over HTTPS, which of the four headers will you still be able to read, and which one will be encrypted?</p>`,
      `<span class="eyebrow">NWC204 · Chương 3 · Bài 3.3 · Buổi 9–10/60 của FLM · CLO1, CLO9 · Lab 1.2</span>
<h2>Lab 1.2 — lần đầu bạn nhìn thấy gói tin thật</h2>
<p class="lead">FLM đánh Lab 1.2 là <strong>"Dialogue-based Assessment &amp; Self Learning"</strong>. Nghĩa là sản phẩm nộp không phải ảnh chụp màn hình: bạn phải nói lại được nội dung bản bắt gói khi có người chỉ vào một dòng bất kỳ trong đó.</p>
<p><strong>Câu hỏi mở đầu:</strong> trước khi cài gì — nếu bạn bắt gói ngay trên laptop trong lúc mở một trang web bằng HTTPS, bạn vẫn đọc được lớp tiêu đề nào trong bốn lớp, và lớp nào sẽ bị mã hoá?</p>`,
    ),

    walkHead('nwc204-ch03', 22, 23,
      'Slides 22–23 are the lab brief and the self-check for FLM sessions 9–10.',
      'Slide 22–23 là phần giao việc của lab và phần tự kiểm cho buổi 9–10 của FLM.'),

    walk('nwc204-ch03', [
      [22, 'Lab 1.2 — three tasks',
        `<p>FLM lists four lab-manual items for sessions 9 and 10: 3.0.3, 3.4.4, 3.7.9 and 3.7.10.</p>
<ul>
<li><strong>3.0.3 Design a communications system.</strong> Invent a protocol for a simple message and write down all six rules from lesson 3.1. This is a paper exercise, and the six-row checklist is the marking scheme.</li>
<li><strong>3.4.4 Research networking standards.</strong> Pick one body, find one real document, and say in one sentence what it standardises. Cite the number: RFC 791, IEEE 802.3, TIA-568.</li>
<li><strong>3.7.9 Install Wireshark</strong> and <strong>3.7.10 Use Wireshark to view network traffic.</strong> Capture your own traffic and locate the four headers you learned in lesson 3.2.</li>
</ul>
<p>Sessions 9 and 10 are the same lab: session 10 is marked "(continue)". Budget the paper tasks for session 9 and the capture for session 10.</p>`,
        `<p>FLM liệt kê bốn mục lab manual cho buổi 9 và 10: 3.0.3, 3.4.4, 3.7.9 và 3.7.10.</p>
<ul>
<li><strong>3.0.3 Thiết kế một hệ truyền thông.</strong> Tự nghĩ ra một giao thức cho một thông điệp đơn giản và viết đủ sáu luật ở bài 3.1. Đây là bài trên giấy, và danh sách sáu dòng chính là thang chấm.</li>
<li><strong>3.4.4 Tra cứu chuẩn mạng.</strong> Chọn một tổ chức, tìm một tài liệu thật, và nói trong một câu nó chuẩn hoá cái gì. Nhớ trích số hiệu: RFC 791, IEEE 802.3, TIA-568.</li>
<li><strong>3.7.9 Cài Wireshark</strong> và <strong>3.7.10 Dùng Wireshark xem lưu lượng mạng.</strong> Bắt lưu lượng của chính bạn và chỉ ra bốn lớp tiêu đề đã học ở bài 3.2.</li>
</ul>
<p>Buổi 9 và 10 là cùng một lab: buổi 10 ghi "(continue)". Hãy dành buổi 9 cho hai việc trên giấy và buổi 10 cho việc bắt gói.</p>`],

      [23, 'Verify it yourself, before the next chapter',
        `<p>The commands on the slide are the minimum you should be able to run without looking them up.</p>
<ul>
<li><code>ip -br addr</code> tells you which interface actually carries your traffic — capture on the wrong one and you will see nothing and blame the tool.</li>
<li><code>sudo tcpdump -i en0 -c 20 -n</code> gives you twenty packets with no name resolution, so the output stays readable.</li>
<li><code>arp -an</code> shows the gateway MAC that every outbound frame is addressed to.</li>
<li><code>traceroute -n 1.1.1.1</code> lists the routers on the path; each line is one link where the MAC pair changed and the IP pair did not.</li>
</ul>
<p>If frames leave and nothing returns, the failure is above layer 1 — the cable is doing its job, and chapter 4 will tell you how to prove that properly with interface counters.</p>`,
        `<p>Các lệnh trên slide là mức tối thiểu bạn phải gõ được mà không cần tra.</p>
<ul>
<li><code>ip -br addr</code> cho biết giao diện nào đang thật sự chở lưu lượng của bạn — bắt nhầm giao diện thì không thấy gì và lại đổ lỗi cho công cụ.</li>
<li><code>sudo tcpdump -i en0 -c 20 -n</code> cho bạn hai mươi gói, không phân giải tên, nên kết xuất còn đọc được.</li>
<li><code>arp -an</code> hiện MAC của cổng ra, nơi mọi khung đi ra được gửi tới.</li>
<li><code>traceroute -n 1.1.1.1</code> liệt kê các router trên đường; mỗi dòng là một chặng mà cặp MAC đã đổi còn cặp IP thì không.</li>
</ul>
<p>Nếu khung đi ra mà không có gì trở về, sự cố nằm trên tầng 1 — sợi cáp đang làm đúng việc của nó, và chương 4 sẽ chỉ bạn cách chứng minh chuyện đó đàng hoàng bằng bộ đếm giao diện.</p>`],
    ]),

    bi(
      `<h3>🧪 Doing the lab, step by step</h3>
<h4>Task 1 — design a communications system (3.0.3)</h4>
<p>Use a real example so the six rules have something to bite on. Take a door sensor reporting to a server:</p>
<pre><code class="language-plaintext">Encoding      ASCII text, one message per event
Formatting    SENSOR=<id>;STATE=OPEN|CLOSED;TS=<unix seconds>\\n
Encapsulation UDP datagram -> IP packet -> Ethernet frame
Size          under 64 bytes; never fragmented
Timing        send on change, plus one heartbeat every 60 s;
              no reply expected, so no response timeout is defined
Delivery      unicast to the collector's IP address</code></pre>
<h4>Task 2 — research networking standards (3.4.4)</h4>
<pre><code class="language-plaintext">IETF   RFC 791   Internet Protocol version 4 — packet format and addressing
IEEE   802.3     Ethernet — frame format, MAC, physical signalling
IEEE   802.11    Wireless LAN — radio access to the same Ethernet service
TIA    TIA-568   Commercial building cabling — categories and the T568A/B pinout
ISO    ISO 7498  The seven-layer OSI reference model</code></pre>
<h4>Task 3 — install Wireshark and capture (3.7.9, 3.7.10)</h4>
<pre><code class="language-bash"># macOS
brew install --cask wireshark

# Debian / Ubuntu — the prompt about non-root capture: answer Yes
sudo apt update &amp;&amp; sudo apt install -y wireshark
sudo usermod -aG wireshark "$USER"      # then log out and back in

# Confirm it is installed and can list interfaces
tshark -D</code></pre>
<p>Then capture, filter and read:</p>
<pre><code class="language-plaintext">1. Start a capture on the interface that ip -br addr showed as UP with your address.
2. In the display filter box type:  http
3. Load any plain-http page, for example http://example.com
4. Click one GET packet and expand the tree. Point at all four:
     Ethernet II ......... source MAC, destination MAC, Type 0x0800
     Internet Protocol ... source IP, destination IP, TTL
     Transmission Control  source port, destination port, flags
     Hypertext Transfer .. GET /  Host: example.com</code></pre>`,
      `<h3>🧪 Làm lab, từng bước</h3>
<h4>Việc 1 — thiết kế một hệ truyền thông (3.0.3)</h4>
<p>Hãy lấy một ví dụ thật để sáu luật có chỗ bám. Ví dụ một cảm biến cửa báo về máy chủ:</p>
<pre><code class="language-plaintext">Mã hoá        văn bản ASCII, mỗi sự kiện một thông điệp
Định dạng     SENSOR=<id>;STATE=OPEN|CLOSED;TS=<giây unix>\\n
Đóng gói      datagram UDP -> gói IP -> khung Ethernet
Kích thước    dưới 64 byte; không bao giờ phải phân mảnh
Thời điểm     gửi khi trạng thái đổi, cộng một nhịp báo sống mỗi 60 giây;
              không chờ trả lời, nên không định nghĩa thời gian chờ
Cách gửi      unicast tới địa chỉ IP của máy thu</code></pre>
<h4>Việc 2 — tra cứu chuẩn mạng (3.4.4)</h4>
<pre><code class="language-plaintext">IETF   RFC 791   Giao thức IP bản 4 — định dạng gói và cách đánh địa chỉ
IEEE   802.3     Ethernet — định dạng khung, MAC, tín hiệu vật lý
IEEE   802.11    Mạng LAN không dây — truy nhập bằng sóng vào cùng dịch vụ Ethernet
TIA    TIA-568   Cáp cho toà nhà thương mại — phân loại cáp và sơ đồ chân T568A/B
ISO    ISO 7498  Mô hình tham chiếu OSI bảy tầng</code></pre>
<h4>Việc 3 — cài Wireshark và bắt gói (3.7.9, 3.7.10)</h4>
<pre><code class="language-bash"># macOS
brew install --cask wireshark

# Debian / Ubuntu — câu hỏi về bắt gói không cần root: chọn Yes
sudo apt update &amp;&amp; sudo apt install -y wireshark
sudo usermod -aG wireshark "$USER"      # rồi đăng xuất và đăng nhập lại

# Xác nhận đã cài và liệt kê được giao diện
tshark -D</code></pre>
<p>Rồi bắt, lọc và đọc:</p>
<pre><code class="language-plaintext">1. Bắt trên đúng giao diện mà ip -br addr báo là UP và có địa chỉ của bạn.
2. Gõ vào ô display filter:  http
3. Mở một trang http thuần, ví dụ http://example.com
4. Bấm vào một gói GET rồi mở cây ra. Chỉ đủ bốn dòng:
     Ethernet II ......... MAC nguồn, MAC đích, Type 0x0800
     Internet Protocol ... IP nguồn, IP đích, TTL
     Transmission Control  cổng nguồn, cổng đích, cờ
     Hypertext Transfer .. GET /  Host: example.com</code></pre>`,
    ),

    bi(
      `<h3>🔎 How to check this yourself</h3>
<pre><code class="language-bash"># Prove Wireshark can actually capture (not just start)
tshark -i en0 -c 5

# The same four headers, without the GUI
sudo tcpdump -i en0 -c 5 -n -e -vv 'tcp port 80'
#   -e prints the Ethernet header, which tcpdump hides by default</code></pre>
<pre><code class="language-plaintext">tshark -D lists nothing            -> permissions: you are not in the wireshark group (Linux)
                                      or ChmodBPF was not installed (macOS)
capture runs but shows 0 packets   -> wrong interface, or you filtered before any traffic happened
you see TLS but no HTTP            -> the site is HTTPS; only headers 1-3 are readable, header 4 is encrypted
you see your own traffic only      -> correct: a switch does not send you other people's unicast frames</code></pre>
<p>That last line answers the opening question. Over HTTPS you still read <strong>Ethernet, IP and TCP</strong> — MACs, addresses, ports, packet sizes and timing. Only the <strong>application payload</strong> is encrypted. That is exactly why "we use HTTPS" is not the same as "nobody can see what we do".</p>`,
      `<h3>🔎 Cách tự kiểm</h3>
<pre><code class="language-bash"># Chứng minh Wireshark bắt gói được thật (không chỉ mở lên được)
tshark -i en0 -c 5

# Vẫn bốn lớp tiêu đề đó, nhưng không cần giao diện đồ hoạ
sudo tcpdump -i en0 -c 5 -n -e -vv 'tcp port 80'
#   -e in ra tiêu đề Ethernet, thứ mà tcpdump mặc định giấu đi</code></pre>
<pre><code class="language-plaintext">tshark -D không liệt kê gì         -> quyền: bạn chưa nằm trong nhóm wireshark (Linux)
                                      hoặc chưa cài ChmodBPF (macOS)
bắt được nhưng 0 gói               -> sai giao diện, hoặc đã lọc trước khi có lưu lượng nào
thấy TLS mà không thấy HTTP        -> trang chạy HTTPS; chỉ đọc được tiêu đề 1-3, tiêu đề 4 đã mã hoá
chỉ thấy lưu lượng của chính mình  -> đúng: switch không gửi cho bạn khung unicast của người khác</code></pre>
<p>Dòng cuối chính là đáp án câu hỏi mở đầu. Qua HTTPS bạn vẫn đọc được <strong>Ethernet, IP và TCP</strong> — địa chỉ MAC, địa chỉ IP, cổng, kích thước gói và thời điểm. Chỉ <strong>phần tải của ứng dụng</strong> là bị mã hoá. Chính vì vậy "chúng tôi dùng HTTPS" không đồng nghĩa với "không ai thấy chúng tôi làm gì".</p>`,
    ),

    bi(
      `<h3>⚠️ Traps people actually fall into</h3>
<ol>
<li><strong>Capturing on the wrong interface.</strong> <em>Symptom:</em> the capture runs for a minute and shows zero packets, and the student concludes Wireshark is broken. On a laptop with Wi-Fi and Ethernet and a VPN and Docker, there are five or six interfaces. Check <code>ip -br addr</code> first and capture on the one that is UP with your address.</li>
<li><strong>Expecting to read HTTPS.</strong> <em>Symptom:</em> "Wireshark shows only TLS, my install is wrong". Nothing is wrong — the payload is encrypted by design. For the lab, use a plain <code>http://</code> site, which is exactly why Cisco's lab specifies one.</li>
<li><strong>Expecting to see the whole network.</strong> <em>Symptom:</em> "I cannot see my classmate's traffic". A switch forwards unicast only to the port that owns the MAC. You see your own traffic, broadcasts and multicasts. Seeing everything needs a hub, a SPAN port, or a compromise — and, outside a lab, usually permission.</li>
<li><strong>Treating a screenshot as the deliverable.</strong> <em>Symptom:</em> full marks expected, low marks received. FLM marks this lab as dialogue-based: you are assessed on explaining what the capture shows, layer by layer. Practise saying it out loud before the session.</li>
</ol>`,
      `<h3>⚠️ Bẫy hay mắc</h3>
<ol>
<li><strong>Bắt nhầm giao diện.</strong> <em>Triệu chứng:</em> chạy cả phút mà không có gói nào, rồi kết luận Wireshark hỏng. Một chiếc laptop có Wi-Fi, Ethernet, VPN và Docker thì có tới năm sáu giao diện. Hãy xem <code>ip -br addr</code> trước và bắt trên cái đang UP và mang địa chỉ của bạn.</li>
<li><strong>Đòi đọc nội dung HTTPS.</strong> <em>Triệu chứng:</em> "Wireshark chỉ hiện TLS, chắc tôi cài sai". Không sai gì cả — phần tải được mã hoá theo thiết kế. Làm lab thì hãy dùng một trang <code>http://</code> thuần, và đó đúng là lý do lab của Cisco chỉ định như vậy.</li>
<li><strong>Tưởng sẽ thấy cả mạng.</strong> <em>Triệu chứng:</em> "tôi không thấy lưu lượng của bạn cùng lớp". Switch chỉ chuyển khung unicast tới đúng cổng sở hữu MAC đó. Bạn thấy lưu lượng của chính mình, cộng broadcast và multicast. Muốn thấy hết thì cần hub, cổng SPAN, hoặc một cuộc tấn công — và ngoài phòng lab thì thường còn cần cả sự cho phép.</li>
<li><strong>Coi ảnh chụp màn hình là sản phẩm nộp.</strong> <em>Triệu chứng:</em> tưởng được điểm tối đa, nhận điểm thấp. FLM đánh lab này là dialogue-based: bạn được chấm ở khả năng giải thích bản bắt gói theo từng tầng. Hãy tập nói thành lời trước buổi học.</li>
</ol>`,
    ),

    bi(
      `<h3>📋 Notes on the original syllabus — reported, not corrected</h3>
<ul>
<li><strong>Session 9 has no constructive question.</strong> The FLM table leaves sessions 6, 9, 15, 16, 22, 30, 36 and 56 blank, so there is nothing to quote for session 9.</li>
<li><strong>Session 10 is listed with CQ4.1</strong> — "What are the purpose and functions of the physical layer in the network?" — but session 10 is Lab 1.2 (continue), which belongs to chapter 3. The question is answered in chapter 4, lesson 4.1, where it actually fits.</li>
<li><strong>The S-Download and URL columns are empty for all 60 sessions</strong>, so there is no official file to download for this lab. Everything here was rebuilt from the topic list.</li>
</ul>`,
      `<h3>📋 Ghi chú về syllabus gốc — chỉ nêu, không tự sửa</h3>
<ul>
<li><strong>Buổi 9 không có câu hỏi kiến tạo.</strong> Bảng của FLM bỏ trống các buổi 6, 9, 15, 16, 22, 30, 36 và 56, nên không có gì để trích cho buổi 9.</li>
<li><strong>Buổi 10 lại được gán CQ4.1</strong> — "What are the purpose and functions of the physical layer in the network?" — trong khi buổi 10 là Lab 1.2 (continue), thuộc chương 3. Câu hỏi đó được trả lời ở chương 4, bài 4.1, nơi nó thật sự thuộc về.</li>
<li><strong>Cột S-Download và URLs trống cho cả 60 buổi</strong>, nên không có file chính thức nào để tải cho lab này. Toàn bộ nội dung ở đây được dựng lại từ danh mục chủ đề.</li>
</ul>`,
    ),

    bi(
      `<h3>✍️ Exercises — with full answers</h3>
<p><strong>1.</strong> Write the six rules for a protocol that sends a chat message between two users, including one rule that HTTP-style protocols usually get wrong at first.</p>
<p><strong>2.</strong> You capture on <code>en0</code> and see only ARP and mDNS, never your own web traffic. Give two plausible causes.</p>
<p><strong>3.</strong> In a capture of a plain HTTP request, which fields would you read to answer: (a) which physical port on the switch is this host plugged into? (b) which program on the server will get this? (c) how many routers has this packet already crossed?</p>
<details><summary>Answers</summary>
<p><strong>1.</strong> Encoding — UTF-8 (the rule people get wrong: forgetting to state the character set, which is exactly how you get question marks instead of accented letters). Formatting — a length-prefixed or newline-terminated frame so the receiver knows where one message ends. Encapsulation — TCP for reliability, since a lost chat line is unacceptable. Size — cap the message, and define what happens beyond it, rather than discovering the MTU by accident. Timing — an acknowledgement and a retry policy with a bounded number of attempts. Delivery — unicast per recipient, or multicast for a group channel.</p>
<p><strong>2.</strong> (a) Your traffic is going over a different interface — Wi-Fi <code>en1</code>, a VPN <code>utun0</code>, or a Docker bridge — while <code>en0</code> only carries local discovery. (b) A display filter or capture filter is excluding it, or the site is HTTPS and you are looking for <code>http</code> in the filter box.</p>
<p><strong>3.</strong> (a) None of them. The frame contains no port number of the switch; you must read the switch's MAC address table (chapter 6) and map the source MAC to a port. (b) The TCP destination port, in the Transmission Control Protocol header. (c) Read the IP <strong>TTL</strong> and subtract it from the sender's usual initial value (64 on Linux/macOS, 128 on Windows); the difference is the hop count — an estimate, not a guarantee, because the initial value is a convention.</p>
</details>`,
      `<h3>✍️ Bài tập — có lời giải đầy đủ</h3>
<p><strong>1.</strong> Viết sáu luật cho một giao thức gửi tin nhắn chat giữa hai người dùng, trong đó có một luật mà các giao thức kiểu HTTP thường làm sai lúc đầu.</p>
<p><strong>2.</strong> Bạn bắt gói trên <code>en0</code> và chỉ thấy ARP với mDNS, không bao giờ thấy lưu lượng web của mình. Nêu hai nguyên nhân hợp lý.</p>
<p><strong>3.</strong> Trong một bản bắt gói HTTP thuần, bạn sẽ đọc trường nào để trả lời: (a) máy này cắm vào cổng vật lý nào của switch? (b) chương trình nào trên máy chủ sẽ nhận cái này? (c) gói tin này đã qua bao nhiêu router?</p>
<details><summary>Lời giải</summary>
<p><strong>1.</strong> Mã hoá — UTF-8 (đây chính là luật người ta hay làm sai: quên khai bộ ký tự, và đó đúng là cách bạn nhận được dấu hỏi thay cho chữ có dấu). Định dạng — khung có tiền tố độ dài hoặc kết thúc bằng ký tự xuống dòng để bên nhận biết một thông điệp kết thúc ở đâu. Đóng gói — dùng TCP cho tin cậy, vì mất một dòng chat là không chấp nhận được. Kích thước — đặt trần cho thông điệp và định nghĩa rõ chuyện gì xảy ra khi vượt trần, thay vì tình cờ phát hiện ra MTU. Thời điểm — có báo nhận và chính sách gửi lại với số lần thử có giới hạn. Cách gửi — unicast cho từng người nhận, hoặc multicast cho một kênh nhóm.</p>
<p><strong>2.</strong> (a) Lưu lượng của bạn đang đi qua giao diện khác — Wi-Fi <code>en1</code>, VPN <code>utun0</code>, hay cầu nối Docker — còn <code>en0</code> chỉ chở các gói khám phá cục bộ. (b) Một bộ lọc hiển thị hoặc bộ lọc bắt gói đang loại nó ra, hoặc trang web chạy HTTPS mà bạn lại gõ <code>http</code> trong ô lọc.</p>
<p><strong>3.</strong> (a) Không trường nào cả. Khung không chứa số hiệu cổng của switch; bạn phải đọc bảng địa chỉ MAC của switch (chương 6) rồi ánh xạ MAC nguồn sang cổng. (b) Cổng đích của TCP, nằm trong tiêu đề Transmission Control Protocol. (c) Đọc trường <strong>TTL</strong> của IP rồi lấy giá trị khởi tạo thông thường của bên gửi trừ đi (64 trên Linux/macOS, 128 trên Windows); hiệu số là số chặng đã đi — chỉ là ước lượng, không phải bảo đảm, vì giá trị khởi tạo chỉ là quy ước.</p>
</details>`,
    ),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz ──────────────────────────────── */

const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

const QUIZ = {
  title: 'Quiz Chapter 3 — Protocols and Models|||Quiz Chương 3 — Giao thức và các mô hình',
  slug: 'nwc204-ch3-quiz',
  type: 'QUIZ',
  description: '10 câu song ngữ cho chương 3: sáu luật của giao thức, OSI so với TCP/IP, PDU, đóng gói và bóc gói, khung Ethernet, ba loại địa chỉ và Wireshark. Mỗi câu có giải thích.',
  quiz: {
    timeLimitSeconds: 720,
    questions: [
      q('Which of the six protocol rules is violated when a client gives up after 100 ms but the server always answers in 300 ms?|||Sáu luật của giao thức, luật nào bị vi phạm khi máy khách bỏ cuộc sau 100 ms còn máy chủ luôn trả lời sau 300 ms?',
        ['Message encoding|||Mã hoá thông điệp', 'Message size|||Kích thước thông điệp', 'Message timing — the response timeout|||Thời điểm — thời gian chờ trả lời', 'Delivery options|||Cách gửi'],
        2,
        'The bytes, the size and the addressing are all fine; only the agreed waiting time is wrong. A response timeout shorter than the honest response time makes every request look lost, and the classic symptom is a service that works when idle and fails under load.|||Byte, kích thước và cách đánh địa chỉ đều đúng; chỉ có thời gian chờ đã thoả thuận là sai. Thời gian chờ ngắn hơn thời gian trả lời thật khiến mọi yêu cầu trông như bị mất, và triệu chứng kinh điển là dịch vụ chạy tốt lúc rỗi và hỏng khi tải nặng.'),

      q('How many layers does the OSI model have, and how many does TCP/IP have?|||Mô hình OSI có mấy tầng, và TCP/IP có mấy tầng?',
        ['OSI 4, TCP/IP 7', 'OSI 7, TCP/IP 4', 'OSI 5, TCP/IP 5', 'Both have 7|||Cả hai đều có 7'],
        1,
        'OSI has seven layers (Physical, Data Link, Network, Transport, Session, Presentation, Application) and TCP/IP has four (Network Access, Internet, Transport, Application). OSI 7+6+5 map onto the TCP/IP Application layer and OSI 2+1 map onto Network Access.|||OSI có bảy tầng (Physical, Data Link, Network, Transport, Session, Presentation, Application) còn TCP/IP có bốn (Network Access, Internet, Transport, Application). OSI 7+6+5 ánh xạ vào tầng Application của TCP/IP, còn OSI 2+1 ánh xạ vào Network Access.'),

      q('What is the correct order of PDU names as data moves DOWN the sending stack?|||Thứ tự đúng của tên PDU khi dữ liệu đi XUỐNG chồng tầng ở bên gửi là gì?',
        ['bits, frame, packet, segment, data', 'data, segment, packet, frame, bits', 'data, packet, segment, frame, bits', 'segment, data, packet, bits, frame'],
        1,
        'Data becomes a segment at Transport (ports added), a packet at the Internet layer (IP addresses added), a frame at Network Access (MAC addresses and FCS added) and finally bits on the medium. A UDP PDU is called a datagram rather than a segment.|||Data thành segment ở tầng Transport (thêm cổng), thành packet ở tầng Internet (thêm địa chỉ IP), thành frame ở Network Access (thêm địa chỉ MAC và FCS), và cuối cùng là bits trên môi trường truyền. PDU của UDP gọi là datagram chứ không gọi là segment.'),

      q('A packet crosses three routers. Which addresses change on the way?|||Một gói tin đi qua ba router. Địa chỉ nào thay đổi trên đường?',
        ['The IP addresses, at every hop|||Địa chỉ IP, ở mỗi chặng', 'The MAC addresses, at every hop|||Địa chỉ MAC, ở mỗi chặng', 'Both IP and MAC|||Cả IP và MAC', 'Neither|||Không cái nào'],
        1,
        'MAC addresses are valid on one link only, so each router rewrites the source and destination MAC before forwarding. The IP addresses are end to end and stay the same the whole way, unless NAT deliberately rewrites them. This is why your ARP table holds the gateway MAC, never the remote server MAC.|||Địa chỉ MAC chỉ có giá trị trên một chặng, nên mỗi router viết lại MAC nguồn và MAC đích trước khi chuyển tiếp. Địa chỉ IP là đầu-cuối và giữ nguyên suốt đường, trừ khi NAT cố tình viết lại. Vì vậy bảng ARP của bạn giữ MAC của cổng ra, không bao giờ là MAC của máy chủ ở xa.'),

      q('An Ethernet frame arrives with a bad FCS. What happens?|||Một khung Ethernet tới nơi với FCS sai. Chuyện gì xảy ra?',
        ['The receiver repairs it using the FCS|||Bên nhận dùng FCS để sửa lại khung', 'The receiver discards it silently and increments an error counter|||Bên nhận vứt nó trong im lặng và tăng một bộ đếm lỗi', 'The receiver sends a NAK to the sender|||Bên nhận gửi NAK về cho bên gửi', 'The router recalculates it and forwards it|||Router tính lại FCS rồi chuyển tiếp'],
        1,
        'The FCS is a CRC: it detects corruption but cannot correct it, and Ethernet has no negative acknowledgement. The frame is dropped and counted, with no log entry — which is why a link can lose 2% of frames while the log stays clean. You must read interface counters to see it.|||FCS là một mã CRC: nó phát hiện hỏng chứ không sửa được, và Ethernet không có cơ chế báo nhận phủ định. Khung bị vứt và được đếm, không có dòng log nào — vì vậy một đường truyền có thể mất 2% số khung mà log vẫn sạch. Phải đọc bộ đếm giao diện mới thấy.'),

      q('What is the minimum payload of an Ethernet frame, and why does that minimum exist?|||Phần tải tối thiểu của khung Ethernet là bao nhiêu, và vì sao có mức tối thiểu đó?',
        ['18 bytes, to fit the header|||18 byte, để vừa phần tiêu đề', '46 bytes, so the whole frame reaches 64 bytes for collision detection|||46 byte, để cả khung đạt 64 byte cho việc phát hiện xung đột', '64 bytes, because that is the MTU|||64 byte, vì đó là MTU', '1500 bytes, the standard MTU|||1500 byte, tức MTU chuẩn'],
        1,
        'The payload runs from 46 to 1500 bytes. With the 14-byte header and the 4-byte FCS, a 46-byte payload gives a 64-byte frame — the smallest size for which the original collision-detection timing worked. 1500 bytes is the maximum, not the minimum, and it is the MTU.|||Phần tải chạy từ 46 tới 1500 byte. Cộng 14 byte tiêu đề và 4 byte FCS, phần tải 46 byte cho ra khung 64 byte — kích thước nhỏ nhất mà cơ chế phát hiện xung đột ban đầu còn hoạt động đúng. 1500 byte là mức tối đa chứ không phải tối thiểu, và đó chính là MTU.'),

      q('Which body publishes the RFC documents that define IPv4 and TCP?|||Tổ chức nào xuất bản các tài liệu RFC định nghĩa IPv4 và TCP?',
        ['IEEE', 'ISO', 'IETF', 'TIA/EIA'],
        2,
        'The IETF publishes RFCs; RFC 791 is IPv4 and RFC 793 is TCP. IEEE owns 802.3 Ethernet and 802.11 Wi-Fi, ISO published the OSI model (ISO 7498), and TIA/EIA publishes the cabling standard TIA-568 with the T568A and T568B pinouts.|||IETF xuất bản các RFC; RFC 791 là IPv4 và RFC 793 là TCP. IEEE giữ 802.3 Ethernet và 802.11 Wi-Fi, ISO xuất bản mô hình OSI (ISO 7498), còn TIA/EIA xuất bản chuẩn cáp TIA-568 với sơ đồ chân T568A và T568B.'),

      q('A host wants to reach an address on a different network. What goes in the destination MAC of the frame?|||Một máy muốn tới một địa chỉ ở mạng khác. MAC đích của khung sẽ là gì?',
        ['The MAC of the remote server|||MAC của máy chủ ở xa', 'The MAC of the default gateway|||MAC của cổng ra mặc định', 'The broadcast MAC ff:ff:ff:ff:ff:ff', 'No MAC is used for remote traffic|||Lưu lượng đi xa không dùng MAC'],
        1,
        'The host ANDs both addresses with its own subnet mask, sees that the destination is on another network, and therefore addresses the frame to the default gateway while leaving the destination IP untouched. The remote server has no MAC that is visible to you — MAC addresses exist only on one link.|||Máy gửi lấy cả hai địa chỉ AND với mặt nạ của chính nó, thấy đích nằm ở mạng khác, nên gửi khung tới cổng ra mặc định còn địa chỉ IP đích thì để nguyên. Máy chủ ở xa không có MAC nào bạn nhìn thấy được — địa chỉ MAC chỉ tồn tại trên một chặng.'),

      q('In Wireshark you capture an HTTPS session. Which header can you NOT read?|||Bạn bắt một phiên HTTPS bằng Wireshark. Lớp tiêu đề nào bạn KHÔNG đọc được?',
        ['Ethernet', 'IP', 'TCP', 'The application payload|||Phần tải của ứng dụng'],
        3,
        'TLS encrypts only the application payload. MAC addresses, IP addresses, port numbers, packet sizes and timing all stay in clear text, which is why HTTPS hides what you send but not who you talked to, when, or how much. For the Lab 1.2 capture use a plain http:// site.|||TLS chỉ mã hoá phần tải của ứng dụng. Địa chỉ MAC, địa chỉ IP, số hiệu cổng, kích thước gói và thời điểm đều vẫn ở dạng rõ, nên HTTPS giấu được nội dung bạn gửi chứ không giấu được bạn đã nói chuyện với ai, lúc nào và bao nhiêu. Khi làm Lab 1.2 hãy bắt trên một trang http:// thuần.'),

      q('Which statement about encapsulation is correct?|||Phát biểu nào về đóng gói (encapsulation) là đúng?',
        ['Each layer inspects the payload of the layer above it|||Mỗi tầng đều mở phần tải của tầng trên ra xem', 'Each layer treats the layer above as opaque payload|||Mỗi tầng coi tầng trên là phần tải mờ đục', 'Encapsulation encrypts the data|||Đóng gói có mã hoá dữ liệu', 'Only the Transport layer adds a header|||Chỉ tầng Transport thêm tiêu đề'],
        1,
        'Every layer adds its own header and treats everything above as an opaque block. That is exactly what lets a switch forward a protocol invented after it was built, and a router route HTTPS without understanding it. Encapsulation adds headers; it hides nothing, and only TLS provides confidentiality.|||Mỗi tầng thêm tiêu đề của riêng nó và coi mọi thứ ở trên là một khối mờ đục. Chính điều đó cho phép switch chuyển tiếp một giao thức ra đời sau khi nó xuất xưởng, và router định tuyến HTTPS mà không cần hiểu nó. Đóng gói chỉ thêm tiêu đề; nó không giấu gì cả, và chỉ TLS mới cho tính bí mật.'),
    ],
  },
};

export default [
  {
    title: 'Chapter 3 — Protocols and Models (FLM sessions 7–10)|||Chương 3 — Giao thức và các mô hình (buổi 7–10 của FLM)',
    slug: 'nwc204-chuong-3-giao-thuc-va-mo-hinh',
    description: 'Cisco Module 3 theo đúng buổi 7–10 của FLM: sáu luật của giao thức, bộ giao thức TCP/IP, các tổ chức chuẩn hoá, OSI cạnh TCP/IP, PDU, đóng gói và bóc gói, khung Ethernet, ba loại địa chỉ, và Lab 1.2 với Wireshark. Slide tiếng Anh do cuongthai.com dựng, giảng song ngữ.',
    lessons: [L1, L2, L3, QUIZ],
  },
];
