/**
 * NWC204 · Chapter 14 — Application Layer (Cisco Module 15).
 * FLM buổi 45 + 46, LO cả hai buổi: CLO1, CLO4, CLO9 · ITU: T.
 *
 * Slide: scripts/slides-src/nwc204-ch14.mjs → deck 'nwc204-ch14', 26 ảnh.
 *   bài 14.1 = buổi 45 = slide 1–10 · bài 14.2 = buổi 46 = slide 11–26.
 *
 * ★ = phần cuongthai.com bổ sung ngoài Module 15, ĐO THẬT 22/09/2026:
 *   - curl -v tới cuongthai.com: ALPN chào h2 + http/1.1, máy chủ chọn h2;
 *     TLS 1.3 AEAD-CHACHA20-POLY1305; chứng chỉ Let's Encrypt CN=YE1
 *   - HTTP/2 thay tiêu đề Host bằng giả-tiêu-đề :authority
 *   - một IP 198.51.100.208 phục vụ BA server_name; đổi Host là đổi trang
 *   - dig +trace @1.1.1.1: root → i.gtld-servers.net → kyrie.ns.cloudflare.com
 *     → A 198.51.100.208 TTL 300, trong khi bản đệm còn 50 giây
 *   - dig +trace qua bộ phân giải nhà 192.168.1.1 CHẾT ngay bước 1 (nhận 17 byte)
 *   - TXT của cuongthai.com có HAI bản ghi v=spf1 — sai theo RFC 7208 §3.2
 *   - SMTP 587 Gmail: banner 220, EHLO trả SIZE/STARTTLS/PIPELINING/SMTPUTF8
 *   - ipconfig getpacket en0: DHCP ACK thật, lease_time 0x1c20 = 7200 giây
 *   - api.cuongthai.com/api/v1/notes trả 401 (đã gắn), đường không có trả 404
 *
 * ⚠️ Bất thường của bảng gốc, đã nêu trong bài, KHÔNG tự sửa bảng gốc:
 *   - Buổi 45 mang CQ15.3 "How does TCP session establishment and termination
 *     processes facilitate reliable communication?" → đó là CHƯƠNG 13
 *     (buổi 41–42, Cisco Module 14), không phải tầng ứng dụng.
 *   - Buổi 46 mang CQ16.1 "What is the functions of the Application Layer to
 *     provide network services to end users?" → KHỚP ĐÚNG chương này.
 *   Độ trôi ~1 chương của bảng câu hỏi, nêu lần đầu ở buổi 19, vẫn nguyên.
 *
 * ⚠️ File này CHỈ chứa chương 14. Đừng sửa NWC204.mjs ở đây.
 * ⚠️ Mỗi khối content PHẢI kết thúc bằng  ].join('\n'),  — nếu không thì
 *    lesson.content là ARRAY và academy-ra-soat.mjs đổ ở dòng 52.
 */
import { registerDeck, walk, walkHead, bi, cq } from './_slides.mjs';

const D = registerDeck('nwc204-ch14', {
  code: 'NWC204',
  en: 'Application Layer',
  vi: 'Tầng ứng dụng',
  total: 26,
});

/* ──────────────────────── Lesson 14.1 — session 45 ─────────────────────── */

const L1 = {
  title: '14.1 — Application, Presentation and Session, and Peer-to-Peer (FLM session 45)|||14.1 — Tầng Ứng dụng, Trình diễn và Phiên, và mô hình ngang hàng (buổi 45 của FLM)',
  slug: 'nwc204-14-1-tang-ung-dung-va-ngang-hang',
  type: 'DOCUMENT',
  description: 'Buổi 45: ba tầng trên cùng của OSI và vì sao TCP/IP gộp chúng làm một, mỗi tầng trả lời câu hỏi nào và hỏng thì triệu chứng ra sao, mô hình khách-chủ nói cho chính xác, rồi phân biệt MẠNG ngang hàng với ỨNG DỤNG ngang hàng và vì sao dùng tracker để tìm nhau không làm mất tính ngang hàng của phiên truyền. Kèm phần ★ đo thật: một lệnh curl -v cho thấy đủ cả ba tầng theo đúng thứ tự, và ghi rõ câu hỏi kiến tạo của buổi 45 thật ra thuộc Chương 13.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 14 · Lesson 14.1 · FLM session 45 of 60 · CLO1, CLO4, CLO9 · Cisco Module 15</span>
<h2>The layer everything you use actually lives in</h2>
<p class="lead">After this lesson you can say what the application, presentation and session layers each answer, explain why TCP/IP collapses all three into one, describe the client-server model precisely enough to say where it stops scaling, and tell a peer-to-peer network apart from a peer-to-peer application.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 45 — "14. Application Layer · 14.1 Application, Presentation, and Session · 14.2 Peer-to-Peer"; LO: CLO1, CLO4, CLO9; ITU: T; tài liệu "Module 15: Application Layer"</p>
<p><strong>Opening question.</strong> You open a browser and type one address. Before a single pixel appears, your machine has already spoken at least four protocols. Here is a real capture of the moment, trimmed:</p>
<pre><code class="language-plaintext">* Host cuongthai.com:443 was resolved.
* IPv4: 198.51.100.208
* Connected to cuongthai.com (198.51.100.208) port 443
* SSL connection using TLSv1.3 / AEAD-CHACHA20-POLY1305-SHA256
* ALPN: server accepted h2
&gt; GET /academy HTTP/2
&lt; HTTP/2 200</code></pre>
<p>Resolution, connection, encryption, negotiation, request, response. <strong>Which of those belong to the application layer, and which only look like they do?</strong> That question is the whole of section 14.1, and the answer changes how you read every error message for the rest of your career.</p>
<div class="callout"><strong>Where this chapter sits.</strong> Chapters 5 to 13 moved bytes: frames, addresses, routes, ports, reliability. This is the first chapter about what the bytes were <em>for</em>. It is also the last protocol chapter of NWC204 — session 49 turns to security.</div>
<p class="note">★ marks material added by cuongthai.com beyond Cisco Module 15, measured on 22 September 2026 rather than quoted.</p>`,
      `<span class="eyebrow">NWC204 · Chương 14 · Bài 14.1 · Buổi 45/60 của FLM · CLO1, CLO4, CLO9 · Cisco Module 15</span>
<h2>Cái tầng mà mọi thứ bạn dùng thật sự nằm ở đó</h2>
<p class="lead">Học xong bài này bạn nói được tầng Ứng dụng, tầng Trình diễn và tầng Phiên mỗi tầng trả lời câu hỏi gì, giải thích được vì sao TCP/IP gộp cả ba làm một, mô tả mô hình khách-chủ đủ chính xác để chỉ ra chỗ nó hết mở rộng được, và phân biệt được một MẠNG ngang hàng với một ỨNG DỤNG ngang hàng.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 45 — "14. Application Layer · 14.1 Application, Presentation, and Session · 14.2 Peer-to-Peer"; LO: CLO1, CLO4, CLO9; ITU: T; tài liệu "Module 15: Application Layer"</p>
<p><strong>Câu hỏi mở đầu.</strong> Bạn mở trình duyệt và gõ một địa chỉ. Trước khi có một điểm ảnh nào hiện ra, máy bạn đã nói ít nhất bốn giao thức rồi. Đây là bản ghi thật của khoảnh khắc đó, đã cắt bớt:</p>
<pre><code class="language-plaintext">* Host cuongthai.com:443 was resolved.
* IPv4: 198.51.100.208
* Connected to cuongthai.com (198.51.100.208) port 443
* SSL connection using TLSv1.3 / AEAD-CHACHA20-POLY1305-SHA256
* ALPN: server accepted h2
&gt; GET /academy HTTP/2
&lt; HTTP/2 200</code></pre>
<p>Phân giải tên, mở kết nối, mã hoá, thương lượng, gửi yêu cầu, nhận trả lời. <strong>Trong đó cái nào thuộc tầng ứng dụng, và cái nào chỉ trông như thế?</strong> Câu hỏi đó chính là toàn bộ mục 14.1, và câu trả lời thay đổi cách bạn đọc mọi thông báo lỗi trong suốt phần đời làm nghề còn lại.</p>
<div class="callout"><strong>Chương này nằm ở đâu.</strong> Chương 5 tới 13 lo việc chuyển byte: khung, địa chỉ, tuyến, cổng, độ tin cậy. Đây là chương đầu tiên nói về việc những byte ấy <em>để làm gì</em>. Nó cũng là chương giao thức cuối cùng của NWC204 — buổi 49 chuyển sang an ninh mạng.</div>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 15, đo thật ngày 22/09/2026 chứ không phải trích lại.</p>`,
    ),

    walkHead('nwc204-ch14', 1, 10,
      'Slides 1–10 cover FLM session 45: 14.1 Application, Presentation and Session, and 14.2 Peer-to-Peer.',
      'Slide 1–10 là buổi 45 của FLM: 14.1 Tầng Ứng dụng, Trình diễn và Phiên, và 14.2 Mô hình ngang hàng.'),

    walk('nwc204-ch14', [
      [1, 'Cover — Chapter 14, Application Layer',
        `<p>Chapter 14 is <strong>Cisco Module 15</strong>, and FPT gives it two sessions, both theory.</p>
<ul>
<li>Session 45 — 14.1 Application, Presentation and Session; 14.2 Peer-to-Peer.</li>
<li>Session 46 — 14.3 Web and Email Protocols; 14.4 IP Addressing Services; 14.5 File Sharing Services; 14.6 Integrate AI Tools for Explaining Concepts (self learning).</li>
<li>Outcomes for both: <strong>CLO1</strong>, <strong>CLO4</strong>, <strong>CLO9</strong>. Type <strong>T</strong> — taught, not lab.</li>
</ul>
<p>Two sessions is not much for six sub-sections, so the sensible way to use them is to treat 14.1 and 14.2 as the vocabulary and 14.3 to 14.5 as a tour of protocols you will type commands against for the rest of the course.</p>`,
        `<p>Chương 14 là <strong>Module 15 của Cisco</strong>, và trường xếp cho nó hai buổi, cả hai đều là lý thuyết.</p>
<ul>
<li>Buổi 45 — 14.1 Tầng Ứng dụng, Trình diễn và Phiên; 14.2 Mô hình ngang hàng.</li>
<li>Buổi 46 — 14.3 Giao thức web và email; 14.4 Dịch vụ địa chỉ IP; 14.5 Dịch vụ chia sẻ tệp; 14.6 Dùng công cụ AI để giải thích khái niệm (tự học).</li>
<li>Chuẩn đầu ra của cả hai buổi: <strong>CLO1</strong>, <strong>CLO4</strong>, <strong>CLO9</strong>. Loại <strong>T</strong> — dạy lý thuyết, không phải lab.</li>
</ul>
<p>Hai buổi cho sáu mục con là ít, nên cách dùng hợp lý là coi 14.1 và 14.2 là phần từ vựng, còn 14.3 tới 14.5 là một vòng dạo qua những giao thức mà bạn sẽ gõ lệnh vào suốt phần còn lại của môn.</p>`],

      [2, 'Two sessions, and the outcome they serve',
        `<p><strong>CLO1</strong> is the outcome that names this chapter directly: <em>"Describe the evolution of network technologies and explain how layered protocols enable communication and <strong>support end-user applications</strong>."</em> The last four words are section 14.1.</p>
<p><strong>CLO4</strong> — how the physical, data link, network and transport layers interact — is why this chapter keeps pointing backwards. Almost every fault at layer 7 turns out to be a fault at a lower layer wearing a layer-7 error message.</p>
<p><strong>CLO9</strong> is the AI-tools outcome, which section 14.6 serves.</p>
<div class="callout"><strong>What to expect in an exam.</strong> FLM publishes no question bank for NWC204, so nobody can promise a format. What the outcome wording supports is: name the layer a given protocol belongs to, name the port, and explain what a given symptom rules in or out.</div>`,
        `<p><strong>CLO1</strong> là chuẩn đầu ra gọi tên chương này rõ nhất: <em>"Describe the evolution of network technologies and explain how layered protocols enable communication and <strong>support end-user applications</strong>."</em> Bốn chữ cuối chính là mục 14.1.</p>
<p><strong>CLO4</strong> — các tầng vật lý, liên kết dữ liệu, mạng và giao vận tương tác với nhau ra sao — là lý do chương này cứ chỉ ngược về phía sau. Gần như mọi lỗi ở tầng 7 hoá ra là lỗi ở tầng dưới đang khoác lên mình một thông báo lỗi của tầng 7.</p>
<p><strong>CLO9</strong> là chuẩn đầu ra về công cụ AI, và mục 14.6 phục vụ nó.</p>
<div class="callout"><strong>Thi thì hỏi gì.</strong> FLM không công bố ngân hàng câu hỏi cho NWC204, nên không ai hứa được dạng đề. Thứ mà lời văn chuẩn đầu ra chống đỡ được là: gọi tên tầng của một giao thức cho trước, gọi tên số cổng, và giải thích một triệu chứng cho trước loại trừ được cái gì.</div>`],

      [3, 'Where the top three layers sit',
        `<p>OSI splits the top into three. TCP/IP does not, and the reason is worth understanding rather than memorising.</p>
<ul>
<li><strong>Layer 7 Application</strong> — the protocol a program speaks: HTTP, DNS, DHCP, SMTP, IMAP, FTP.</li>
<li><strong>Layer 6 Presentation</strong> — the form the bytes take: character encoding, compression, encryption.</li>
<li><strong>Layer 5 Session</strong> — starting, keeping and closing a dialogue between two ends.</li>
</ul>
<p><strong>Why TCP/IP merges them.</strong> There is no separate piece of software living at layer 6 or 5. HTTP negotiates its own encoding with <code>Accept-Encoding</code>, and manages its own connection reuse with <code>Connection: keep-alive</code>. The three OSI layers describe three <em>concerns</em>, and in real protocols one program handles all three. The layers are still a good checklist for diagnosis — they are just not three programs.</p>`,
        `<p>OSI chia phần trên cùng thành ba tầng. TCP/IP thì không, và lý do đáng hiểu chứ không đáng học thuộc.</p>
<ul>
<li><strong>Tầng 7 Ứng dụng</strong> — giao thức mà một chương trình nói: HTTP, DNS, DHCP, SMTP, IMAP, FTP.</li>
<li><strong>Tầng 6 Trình diễn</strong> — hình dạng mà các byte mang: bảng mã ký tự, nén, mã hoá.</li>
<li><strong>Tầng 5 Phiên</strong> — mở, giữ và đóng một cuộc đối thoại giữa hai đầu.</li>
</ul>
<p><strong>Vì sao TCP/IP gộp lại.</strong> Không có mẩu phần mềm riêng nào sống ở tầng 6 hay tầng 5 cả. HTTP tự thương lượng cách mã hoá nội dung bằng <code>Accept-Encoding</code>, và tự quản việc dùng lại kết nối bằng <code>Connection: keep-alive</code>. Ba tầng OSI mô tả ba <em>mối bận tâm</em>, mà trong giao thức thật thì một chương trình lo cả ba. Các tầng vẫn là bảng kiểm tốt để chẩn đoán — chỉ là chúng không phải ba chương trình.</p>`],

      [4, 'What each of the three actually does',
        `<p>The useful way to hold these three is not as definitions but as three questions, each with its own failure signature.</p>
<ul>
<li><strong>Layer 7 — what does this message MEAN?</strong> Get it wrong and the other side understands you and refuses: HTTP 405 Method Not Allowed, SMTP 550.</li>
<li><strong>Layer 6 — in what FORM are the bytes?</strong> Get it wrong and the data arrives intact and unreadable: mojibake from the wrong charset, a gzip body a client cannot decompress, a TLS handshake failure.</li>
<li><strong>Layer 5 — is this exchange still OPEN?</strong> Get it wrong and everything works except that you keep being logged out, or a long upload dies at the same point every time.</li>
</ul>
<div class="callout ok"><strong>The diagnostic habit.</strong> When something breaks, ask which of the three questions the symptom belongs to. "The page is garbled" is never layer 7. "I am logged out again" is never layer 6.</div>`,
        `<p>Cách nắm ba tầng này có ích không phải là ba định nghĩa, mà là ba câu hỏi, mỗi câu có một kiểu hỏng đặc trưng riêng.</p>
<ul>
<li><strong>Tầng 7 — thông điệp này NGHĨA LÀ gì?</strong> Sai chỗ này thì đầu kia hiểu bạn và từ chối: HTTP 405 Method Not Allowed, SMTP 550.</li>
<li><strong>Tầng 6 — các byte đang ở DẠNG nào?</strong> Sai chỗ này thì dữ liệu về nguyên vẹn mà không đọc được: chữ loạn vì sai bảng mã, một thân nén gzip mà máy khách không giải nén nổi, một cú bắt tay TLS thất bại.</li>
<li><strong>Tầng 5 — cuộc trao đổi này còn MỞ không?</strong> Sai chỗ này thì mọi thứ chạy, trừ việc bạn cứ bị đăng xuất, hoặc một lần tải lên dài cứ chết đúng một chỗ.</li>
</ul>
<div class="callout ok"><strong>Thói quen chẩn đoán.</strong> Khi có gì hỏng, hãy hỏi triệu chứng đó thuộc về câu hỏi nào trong ba câu. "Trang hiện chữ loạn" không bao giờ là tầng 7. "Tôi lại bị đăng xuất" không bao giờ là tầng 6.</div>`],

      [5, '★ All three layers in one command',
        `<p>One <code>curl -v</code> shows the whole stack above layer 4, in the order it happens. This is a real run against this site on 22 September 2026.</p>
<ul>
<li><code>Connected to ... port 443</code> — layer 4 finished. TCP is up.</li>
<li><code>SSL connection using TLSv1.3</code> — <strong>presentation</strong>. From here the bytes are encrypted.</li>
<li><code>issuer: Let's Encrypt CN=YE1</code> — who vouched for the certificate. Presentation again, still not the application.</li>
<li><code>ALPN: server accepted h2</code> — the two ends agreed which application protocol to speak. This is the negotiation OSI would call <strong>session</strong>.</li>
<li><code>&gt; GET /academy HTTP/2</code> and <code>&lt; HTTP/2 200</code> — <strong>application</strong>, at last.</li>
</ul>
<div class="callout ok"><strong>Reading key.</strong> In <code>curl -v</code>, a line starting <code>*</code> is curl narrating, <code>&gt;</code> is what was sent, <code>&lt;</code> is what came back. Four characters that make the output readable.</div>`,
        `<p>Một lệnh <code>curl -v</code> cho thấy trọn ngăn xếp phía trên tầng 4, theo đúng thứ tự nó xảy ra. Đây là một lần chạy thật vào chính trang này ngày 22/09/2026.</p>
<ul>
<li><code>Connected to ... port 443</code> — tầng 4 xong. TCP đã dựng.</li>
<li><code>SSL connection using TLSv1.3</code> — <strong>tầng trình diễn</strong>. Từ đây trở đi các byte đã được mã hoá.</li>
<li><code>issuer: Let's Encrypt CN=YE1</code> — ai đứng ra bảo chứng cho chứng chỉ. Vẫn là trình diễn, vẫn chưa phải ứng dụng.</li>
<li><code>ALPN: server accepted h2</code> — hai đầu thống nhất sẽ nói giao thức ứng dụng nào. Đây đúng là thứ mà OSI gọi là <strong>tầng phiên</strong>.</li>
<li><code>&gt; GET /academy HTTP/2</code> và <code>&lt; HTTP/2 200</code> — <strong>tầng ứng dụng</strong>, cuối cùng cũng tới.</li>
</ul>
<div class="callout ok"><strong>Chìa khoá đọc.</strong> Trong <code>curl -v</code>, dòng bắt đầu bằng <code>*</code> là curl đang thuật lại, <code>&gt;</code> là thứ đã gửi đi, <code>&lt;</code> là thứ nhận về. Bốn ký tự làm cho kết xuất đọc được.</div>`],

      [6, 'The client-server model, stated precisely',
        `<p>Three properties, and every consequence follows from them.</p>
<ul>
<li><strong>The client initiates.</strong> It must already know the server address and port. That is why DNS exists, and why "well-known ports" exist.</li>
<li><strong>The server is passive.</strong> It listens and waits. It cannot start a conversation, which is exactly why a web server cannot push you a notification without a trick such as a WebSocket or a long-lived stream.</li>
<li><strong>Every byte crosses the server.</strong> Load grows with the number of clients, and so does the blast radius when it fails.</li>
</ul>
<p><strong>Why we use it anyway.</strong> One place to secure, one place to update, one source of truth, one set of logs. Those four are worth a great deal, and they are precisely what P2P gives up.</p>`,
        `<p>Ba tính chất, và mọi hệ quả đều rút ra từ đó.</p>
<ul>
<li><strong>Máy khách là bên khởi xướng.</strong> Nó phải biết trước địa chỉ và cổng của máy chủ. Đó là lý do DNS tồn tại, và lý do có khái niệm "cổng thông dụng".</li>
<li><strong>Máy chủ bị động.</strong> Nó lắng nghe và chờ. Nó không mở được cuộc trò chuyện, và đó đúng là lý do một máy chủ web không tự đẩy thông báo cho bạn được nếu không có mẹo như WebSocket hay một luồng mở lâu.</li>
<li><strong>Mọi byte đều đi qua máy chủ.</strong> Tải tăng theo số máy khách, và bán kính thiệt hại khi nó chết cũng vậy.</li>
</ul>
<p><strong>Vậy vì sao vẫn dùng.</strong> Một chỗ để bảo vệ, một chỗ để cập nhật, một nguồn sự thật, một bộ nhật ký. Bốn thứ đó đáng giá rất nhiều, và chúng chính là những thứ mà mô hình ngang hàng đánh đổi đi.</p>`],

      [7, '14.2 Two different things are both called P2P',
        `<p>Module 15 makes a distinction that is easy to skim past and is exactly what a question will target.</p>
<ul>
<li>A <strong>peer-to-peer network</strong> is an arrangement of machines: two PCs sharing a printer and a folder over a switch, with no dedicated server anywhere. It needs no special software, and it stops being manageable at about a dozen machines because every machine holds its own accounts and its own permissions.</li>
<li>A <strong>peer-to-peer application</strong> is a piece of software in which every instance acts as both client and server. BitTorrent is the classic example; a WebRTC voice call is a modern one.</li>
</ul>
<p><strong>The trap.</strong> A P2P application often uses a server — a tracker, a signalling server, a bootstrap node — to help two peers <em>find</em> each other. That does not make the transfer client-server. Discovery and transfer are different jobs, and only the transfer decides the label.</p>`,
        `<p>Module 15 đưa ra một phân biệt rất dễ đọc lướt qua, và nó đúng là chỗ một câu hỏi sẽ nhắm vào.</p>
<ul>
<li><strong>Mạng ngang hàng</strong> là một cách bố trí máy móc: hai máy tính dùng chung một máy in và một thư mục qua một switch, không có máy chủ chuyên dụng nào cả. Nó không cần phần mềm đặc biệt, và nó hết quản nổi ở khoảng chục máy, vì mỗi máy tự giữ tài khoản và quyền của riêng nó.</li>
<li><strong>Ứng dụng ngang hàng</strong> là một phần mềm mà mỗi bản chạy vừa là khách vừa là chủ. BitTorrent là ví dụ kinh điển; một cuộc gọi thoại qua WebRTC là ví dụ hiện đại.</li>
</ul>
<p><strong>Cái bẫy.</strong> Một ứng dụng ngang hàng thường vẫn dùng một máy chủ — tracker, máy chủ báo hiệu, nút mồi — để giúp hai bên <em>tìm ra</em> nhau. Điều đó không biến phiên truyền thành khách-chủ. Tìm nhau và truyền dữ liệu là hai việc khác nhau, và chỉ việc truyền mới quyết định cái nhãn.</p>`],

      [8, 'Why a swarm gets faster as it grows',
        `<p>In client-server, the hundredth client is pure cost: it adds load and adds nothing. In a swarm, the hundredth peer arrives, downloads its first piece, and immediately becomes a source of that piece for everyone else.</p>
<ul>
<li>The file is cut into fixed-size <strong>pieces</strong>, each with its own hash, so a peer can verify a piece without trusting who sent it.</li>
<li>A peer holding any piece can serve it. There is no need to have the whole file — that is what makes the inversion work.</li>
<li>A peer that keeps uploading after it finishes is a <strong>seed</strong>. A swarm with no seeds slowly dies, which is why old torrents stop working.</li>
</ul>
<p><strong>The honest limit.</strong> Total capacity still has to come from somewhere; it comes from the uplinks of many small machines instead of one big one. That is an advantage only when those uplinks exist and are willing.</p>`,
        `<p>Trong mô hình khách-chủ, máy khách thứ một trăm là chi phí thuần: nó thêm tải và không thêm gì cả. Trong một bầy ngang hàng, máy thứ một trăm vào, tải xong mẩu đầu tiên, và lập tức trở thành nguồn của mẩu đó cho mọi người khác.</p>
<ul>
<li>Tệp bị cắt thành các <strong>mẩu</strong> cố định kích thước, mỗi mẩu có mã băm riêng, nên một bên có thể kiểm tra mẩu vừa nhận mà không cần tin người gửi.</li>
<li>Bên nào giữ mẩu nào là phục vụ được mẩu đó. Không cần có cả tệp — chính điều này làm cho sự đảo chiều kia chạy được.</li>
<li>Bên nào tải xong mà vẫn tiếp tục cho tải lên thì gọi là <strong>seed</strong>. Một bầy không còn seed nào sẽ chết dần, và đó là lý do các torrent cũ ngừng chạy.</li>
</ul>
<p><strong>Giới hạn nói cho sòng phẳng.</strong> Tổng năng lực vẫn phải đến từ đâu đó; nó đến từ đường lên của nhiều máy nhỏ thay vì một máy lớn. Đó chỉ là lợi thế khi những đường lên ấy có thật và sẵn lòng.</p>`],

      [9, 'What P2P buys, and what it costs',
        `<p><strong>Buys:</strong> no central cost, no single point of failure, capacity that rises with demand, and it works where there is no infrastructure at all.</p>
<p><strong>Costs:</strong> no single place to secure or audit, no guarantee that anything stays available, and every peer needs to be reachable from outside.</p>
<p><strong>That last cost is the practical one.</strong> A peer behind NAT has no address the outside world can dial, so two NATed peers cannot simply connect — they need a rendezvous server, hole punching, or a relay. This is the same trade-off Chapter 9 introduced: NAT bought time on IPv4 exhaustion by breaking the assumption that any host can be reached by any other. P2P is where that bill arrives.</p>
<div class="callout"><strong>Where you meet P2P without noticing.</strong> WebRTC voice and video, blockchain gossip, and mesh VPNs such as Tailscale and WireGuard, which try direct peer connections first and fall back to a relay when NAT wins.</div>`,
        `<p><strong>Được:</strong> không có chi phí tập trung, không có điểm chết đơn lẻ, năng lực tăng theo nhu cầu, và nó chạy được cả ở nơi không có hạ tầng nào.</p>
<p><strong>Mất:</strong> không có một chỗ duy nhất để bảo vệ hay soát xét, không ai bảo đảm thứ gì còn ở đó, và mỗi bên đều cần bên ngoài với tới được.</p>
<p><strong>Cái mất cuối cùng mới là cái thực tế.</strong> Một máy nằm sau NAT thì không có địa chỉ nào để thế giới bên ngoài gọi vào, nên hai máy cùng sau NAT không thể nối thẳng — chúng cần một máy chủ hẹn gặp, cần kỹ thuật đục lỗ, hoặc cần một máy tiếp sức. Đây đúng là sự đánh đổi mà Chương 9 đã nêu: NAT mua thêm thời gian cho IPv4 bằng cách phá vỡ giả định rằng máy nào cũng gọi tới được máy nào. P2P là chỗ hoá đơn đó được gửi tới.</p>
<div class="callout"><strong>Bạn gặp P2P mà không để ý.</strong> Thoại và video qua WebRTC, việc lan tin của blockchain, và các VPN dạng lưới như Tailscale hay WireGuard — chúng thử nối thẳng trước, và chỉ lùi về máy tiếp sức khi NAT thắng.</div>`],

      [10, '⚠ Session 45 constructive question belongs to Chapter 13',
        `<p>FLM lists exactly one constructive question for session 45, and it is not about this chapter.</p>
<ul>
<li><strong>CQ15.3</strong> — <em>"How does TCP session establishment and termination processes facilitate reliable communication?"</em></li>
</ul>
<p>That is TCP: the three-way handshake and the four-way close. It belongs to <strong>Chapter 13, the Transport Layer</strong>, which FLM teaches in sessions 41 and 42 from Cisco Module 14. Session 45 teaches 14.1 and 14.2, neither of which mentions TCP session setup.</p>
<p><strong>The table is quoted as published and is not corrected here.</strong> The drift of roughly one chapter between the constructive-question table and the session plan was first noted at session 19 and is unchanged. Session 46 gets <strong>CQ16.1</strong>, which fits this chapter exactly — so the drift is visible within a single chapter.</p>`,
        `<p>FLM ghi đúng một câu hỏi kiến tạo cho buổi 45, và nó không nói về chương này.</p>
<ul>
<li><strong>CQ15.3</strong> — <em>"How does TCP session establishment and termination processes facilitate reliable communication?"</em></li>
</ul>
<p>Đó là chuyện của TCP: bắt tay ba bước và đóng bốn bước. Nó thuộc <strong>Chương 13, tầng Giao vận</strong>, mà FLM dạy ở buổi 41 và 42 theo Cisco Module 14. Buổi 45 dạy mục 14.1 và 14.2, và không mục nào nhắc tới việc thiết lập phiên TCP.</p>
<p><strong>Bảng gốc được trích nguyên văn và KHÔNG bị sửa ở đây.</strong> Độ trôi khoảng một chương giữa bảng câu hỏi kiến tạo và kế hoạch buổi học đã được nêu lần đầu ở buổi 19 và tới nay vẫn thế. Buổi 46 nhận <strong>CQ16.1</strong>, câu khớp đúng chương này — nên độ trôi ấy nhìn thấy được ngay trong phạm vi một chương.</p>`],
    ]),

    bi(
      `<h3>🗺️ Which of the three layers does a symptom belong to</h3>
<pre><code class="language-mermaid">graph TD
  A["Something is wrong"] --> B{"What do you SEE?"}
  B -->|"server understood and refused"| C["Layer 7 Application<br/>405, 550, 403"]
  B -->|"data arrives unreadable"| D["Layer 6 Presentation<br/>charset, gzip, TLS"]
  B -->|"works, then logs you out"| E["Layer 5 Session<br/>cookie, keep-alive, idle timeout"]
  B -->|"nothing arrives at all"| F["Not up here<br/>go back to Chapters 10 to 13"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef low fill:#fdeeee,stroke:#d94b4b,stroke-width:2px,color:#8f2c2c
  class B ask
  class A,C,D,E act
  class F low</code></pre>
<p>The fourth branch is the one that saves time. <strong>Most "application" faults are not application faults</strong>, and the fastest way to find out is to check whether anything arrives at all before reasoning about what it means.</p>`,
      `<h3>🗺️ Một triệu chứng thuộc về tầng nào trong ba tầng</h3>
<pre><code class="language-mermaid">graph TD
  A["Có gì đó hỏng"] --> B{"Bạn THẤY gì?"}
  B -->|"máy chủ hiểu và từ chối"| C["Tầng 7 Ứng dụng<br/>405, 550, 403"]
  B -->|"dữ liệu về mà không đọc nổi"| D["Tầng 6 Trình diễn<br/>bảng mã, gzip, TLS"]
  B -->|"chạy được rồi bị đăng xuất"| E["Tầng 5 Phiên<br/>cookie, keep-alive, hết hạn chờ"]
  B -->|"không có gì về cả"| F["Không nằm ở trên này<br/>quay lại Chương 10 tới 13"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef low fill:#fdeeee,stroke:#d94b4b,stroke-width:2px,color:#8f2c2c
  class B ask
  class A,C,D,E act
  class F low</code></pre>
<p>Nhánh thứ tư mới là nhánh tiết kiệm thời gian. <strong>Phần lớn lỗi "ứng dụng" không phải lỗi ứng dụng</strong>, và cách nhanh nhất để biết là kiểm xem có gì về hay không, trước khi ngồi luận xem nó nghĩa là gì.</p>`,
    ),

    bi(
      `<h3>🔍 Cách tự kiểm — see the three layers yourself</h3>
<p>Run these against any site you control. Three commands, under ten seconds.</p>
<pre><code class="language-bash">curl -v https://your-site/ 2&gt;&amp;1 | head -30   # the whole stack above layer 4
curl -sI https://your-site/                     # headers only — layer 7 alone
curl -s -o /dev/null -w "%{http_version} %{http_code}\\n" https://your-site/</code></pre>
<p>The third one prints two facts and nothing else:</p>
<pre><code class="language-plaintext">2 200</code></pre>
<div class="callout ok"><strong>What each result proves.</strong> <code>http_version=2</code> means ALPN negotiated HTTP/2 — a <em>session</em>-layer outcome, decided during the TLS handshake before any request was sent. <code>200</code> is the <em>application</em> answer. If the first command stops after <code>Connected to ...</code> with no TLS lines, the fault is in the handshake and no amount of reading HTTP headers will help, because there are none yet.</div>
<div class="callout warn"><strong>What it does not prove.</strong> A 200 says the server produced a response. It says nothing about whether the response is the right one — a login page returned with status 200 is a very common way for a health check to pass while the site is broken.</div>`,
      `<h3>🔍 Cách tự kiểm — tự nhìn thấy ba tầng</h3>
<p>Chạy mấy lệnh này vào bất kỳ trang nào bạn làm chủ. Ba lệnh, chưa tới mười giây.</p>
<pre><code class="language-bash">curl -v https://trang-cua-ban/ 2&gt;&amp;1 | head -30   # trọn ngăn xếp trên tầng 4
curl -sI https://trang-cua-ban/                      # chỉ tiêu đề — riêng tầng 7
curl -s -o /dev/null -w "%{http_version} %{http_code}\\n" https://trang-cua-ban/</code></pre>
<p>Lệnh thứ ba in đúng hai sự thật và không gì khác:</p>
<pre><code class="language-plaintext">2 200</code></pre>
<div class="callout ok"><strong>Mỗi kết quả chứng minh điều gì.</strong> <code>http_version=2</code> nghĩa là ALPN đã chốt HTTP/2 — đó là kết quả của tầng <em>phiên</em>, được quyết trong lúc bắt tay TLS, trước khi gửi bất cứ yêu cầu nào. <code>200</code> là câu trả lời của tầng <em>ứng dụng</em>. Nếu lệnh đầu dừng sau dòng <code>Connected to ...</code> mà không có dòng TLS nào thì lỗi nằm ở cú bắt tay, và đọc tiêu đề HTTP bao nhiêu cũng vô ích, vì chưa có tiêu đề nào cả.</div>
<div class="callout warn"><strong>Nó KHÔNG chứng minh gì.</strong> Mã 200 nói máy chủ đã sinh ra một câu trả lời. Nó không nói câu trả lời đó có đúng không — một trang đăng nhập trả về với mã 200 là cách rất hay gặp để một phép kiểm sức khoẻ báo xanh trong khi trang đã hỏng.</div>`,
    ),

    bi(
      `<div class="pitfall co-tieu-de"><strong>Trap 1 — believing layers 5 and 6 are separate programs.</strong> <b>Symptom:</b> looking for "the session layer" in a packet capture and not finding it, then concluding the model is wrong. They are concerns, not processes. TLS and HTTP each handle several layers at once.</div>
<div class="pitfall co-tieu-de"><strong>Trap 2 — calling a P2P application client-server because it uses a tracker.</strong> <b>Symptom:</b> losing the mark on the one question in this section that is actually discriminating. Discovery is not transfer.</div>
<div class="pitfall co-tieu-de"><strong>Trap 3 — expecting two NATed peers to connect directly.</strong> <b>Symptom:</b> a video call that works on one network and silently falls back to a relay on another, with worse latency and no error shown. Both peers are reachable outbound and neither is reachable inbound.</div>
<div class="pitfall co-tieu-de"><strong>Trap 4 — reading an application error as an application fault.</strong> <b>Symptom:</b> hours spent in the app logs because the browser said "could not load", when nothing ever reached layer 7. Check with curl before reading code.</div>
<div class="pitfall co-tieu-de"><strong>Trap 5 — thinking a peer-to-peer network is fine at scale because P2P applications scale.</strong> <b>Symptom:</b> a fifteen-machine office where every machine holds its own accounts, and removing one employee means fifteen separate changes. The application scales; the network arrangement does not.</div>`,
      `<div class="pitfall co-tieu-de"><strong>Bẫy 1 — tưởng tầng 5 và 6 là những chương trình riêng.</strong> <b>Triệu chứng:</b> đi tìm "tầng phiên" trong một bản bắt gói mà không thấy, rồi kết luận mô hình sai. Chúng là mối bận tâm, không phải tiến trình. TLS và HTTP mỗi thứ lo vài tầng cùng lúc.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 2 — gọi một ứng dụng ngang hàng là khách-chủ chỉ vì nó dùng tracker.</strong> <b>Triệu chứng:</b> mất điểm đúng câu duy nhất trong mục này thật sự phân loại được. Tìm nhau không phải là truyền dữ liệu.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 3 — trông chờ hai máy cùng sau NAT nối thẳng được với nhau.</strong> <b>Triệu chứng:</b> một cuộc gọi video chạy tốt ở mạng này, sang mạng khác thì lặng lẽ lùi về máy tiếp sức, trễ hơn hẳn mà không báo lỗi gì. Cả hai bên đều ra được và không bên nào vào được.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 4 — đọc một lỗi của ứng dụng thành lỗi ở ứng dụng.</strong> <b>Triệu chứng:</b> ngồi hàng giờ trong nhật ký ứng dụng vì trình duyệt báo "không tải được", trong khi chưa có gì tới được tầng 7. Kiểm bằng curl trước khi đọc mã.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 5 — tưởng mạng ngang hàng cũng mở rộng tốt vì ứng dụng ngang hàng mở rộng tốt.</strong> <b>Triệu chứng:</b> một văn phòng mười lăm máy mà máy nào cũng tự giữ tài khoản riêng, và cho một nhân viên nghỉ việc nghĩa là sửa mười lăm chỗ. Ứng dụng thì mở rộng được; cách bố trí mạng thì không.</div>`,
    ),

    bi(
      `<h3>Exercises</h3>
<p><b>E1.</b> For each symptom, name the layer — application, presentation or session — and say what you would check first. (a) The page renders but every Vietnamese accent is a box. (b) The upload bar reaches 100% and then the app says "please log in again". (c) The API answers <code>405 Method Not Allowed</code>.</p>
<div class="dap-an"><p><b>(a) Presentation.</b> The bytes arrived intact; their interpretation is wrong. Check the <code>Content-Type</code> header for a <code>charset</code>, and check what encoding the file is actually stored in. A missing <code>charset=utf-8</code> makes the browser guess, and it guesses badly.</p>
<p><b>(b) Session.</b> Everything transferred, so layers 1 to 7 all worked; what expired was the state that said who you are. Check the cookie lifetime against the token lifetime — a long upload can outlive a short token. This exact failure is worth remembering: it looks like an upload bug and it is an authentication lifetime bug.</p>
<p><b>(c) Application.</b> The server understood you completely and refused. 405 means the path exists but not for that method. Check whether you sent POST to a GET-only route, or the reverse.</p>
<p class="ghi-chu">The pattern: garbled means presentation, logged-out means session, refused means application.</p></div>

<p><b>E2.</b> A colleague says BitTorrent is not really peer-to-peer because it needs a tracker. Write the two-sentence answer that settles it, then name one protocol where the same argument would be wrong to dismiss.</p>
<div class="dap-an"><p><b>The answer.</b> A tracker does discovery: it tells a joining peer which other peers hold the file. The file itself then moves directly between peers, and no byte of it crosses the tracker — so the transfer, which is what the label describes, is peer-to-peer.</p>
<p><b>Where the argument is not wrong.</b> In a <strong>relayed</strong> WebRTC call. WebRTC tries a direct peer connection first, but when both ends are behind restrictive NAT it falls back to a TURN relay, and then every byte of media really does cross a server. At that moment the call is, in the strict sense, no longer peer-to-peer — which is why relayed calls cost the operator bandwidth and direct ones do not.</p>
<p><b>The general rule:</b> ask where the DATA flows, not where the control messages flow.</p></div>

<p><b>E3.</b> ★ You run <code>curl -v https://example.com</code> and the output stops after <code>* Connected to example.com (93.184.x.x) port 443</code>, with no TLS lines and no response. Name three possible causes, and give the command that distinguishes an application fault from everything else.</p>
<div class="dap-an"><ol>
<li><strong>Nothing is listening for TLS on 443.</strong> The TCP connection was accepted by something, but no TLS handshake started. Can happen when a proxy accepts connections while the upstream is down.</li>
<li><strong>A middlebox is intercepting.</strong> A captive portal or inspecting firewall can complete the TCP handshake and then stall.</li>
<li><strong>The server is alive but overloaded</strong> and has not got round to the handshake. The connection sits in the accept queue.</li>
</ol>
<p><b>The distinguishing command:</b></p>
<pre><code class="language-bash">openssl s_client -connect example.com:443 -servername example.com &lt;/dev/null</code></pre>
<p>This does the handshake and nothing else. If it prints a certificate chain, TLS is fine and the fault is above it — go and look at HTTP. If it hangs or returns a handshake error, the fault is at or below presentation, and reading application logs is wasted time.</p>
<p><b>Why this is the right test.</b> It isolates exactly one layer. That is the property that makes a test worth running: before you run it, you can say what a pass rules out and what a fail rules out.</p></div>`,
      `<h3>Bài tập</h3>
<p><b>E1.</b> Với mỗi triệu chứng, hãy gọi tên tầng — ứng dụng, trình diễn hay phiên — và nói bạn sẽ kiểm gì trước. (a) Trang hiện ra nhưng mọi dấu tiếng Việt thành ô vuông. (b) Thanh tải lên chạy tới 100% rồi ứng dụng báo "vui lòng đăng nhập lại". (c) API trả <code>405 Method Not Allowed</code>.</p>
<div class="dap-an"><p><b>(a) Tầng trình diễn.</b> Các byte về nguyên vẹn; cách diễn giải chúng mới sai. Kiểm tiêu đề <code>Content-Type</code> xem có <code>charset</code> không, và kiểm tệp thật ra đang lưu ở bảng mã nào. Thiếu <code>charset=utf-8</code> thì trình duyệt phải đoán, và nó đoán dở.</p>
<p><b>(b) Tầng phiên.</b> Mọi thứ đã truyền xong, tức tầng 1 tới 7 đều chạy; thứ hết hạn là cái trạng thái nói bạn là ai. Đối chiếu thời hạn cookie với thời hạn token — một lần tải lên dài có thể sống lâu hơn một token ngắn. Kiểu hỏng này rất đáng nhớ: nó trông như lỗi tải lên mà là lỗi thời hạn xác thực.</p>
<p><b>(c) Tầng ứng dụng.</b> Máy chủ hiểu bạn trọn vẹn và từ chối. Mã 405 nghĩa là đường dẫn có tồn tại nhưng không dành cho phương thức đó. Kiểm xem bạn có gửi POST vào một tuyến chỉ nhận GET không, hoặc ngược lại.</p>
<p class="ghi-chu">Quy luật: chữ loạn là trình diễn, bị đăng xuất là phiên, bị từ chối là ứng dụng.</p></div>

<p><b>E2.</b> Một người bạn nói BitTorrent không thật sự là ngang hàng vì nó cần tracker. Hãy viết câu trả lời hai câu chốt lại việc này, rồi nêu một giao thức mà chính lập luận ấy lại KHÔNG sai.</p>
<div class="dap-an"><p><b>Câu trả lời.</b> Tracker làm việc tìm nhau: nó cho một bên mới vào biết những bên nào đang giữ tệp. Sau đó chính tệp đi thẳng giữa các bên, và không một byte nào của nó đi qua tracker — nên phiên truyền, thứ mà cái nhãn đang mô tả, là ngang hàng.</p>
<p><b>Chỗ mà lập luận đó không sai.</b> Một cuộc gọi WebRTC bị <strong>tiếp sức</strong>. WebRTC thử nối thẳng trước, nhưng khi cả hai đầu đều nằm sau NAT khắt khe thì nó lùi về một máy tiếp sức TURN, và lúc ấy mọi byte tiếng và hình thật sự đi qua một máy chủ. Ở khoảnh khắc đó, hiểu theo nghĩa chặt, cuộc gọi không còn là ngang hàng nữa — và đó là lý do các cuộc gọi bị tiếp sức tốn băng thông của nhà vận hành còn gọi thẳng thì không.</p>
<p><b>Quy tắc chung:</b> hỏi DỮ LIỆU chảy ở đâu, chứ không phải các thông điệp điều khiển chảy ở đâu.</p></div>

<p><b>E3.</b> ★ Bạn chạy <code>curl -v https://example.com</code> và kết xuất dừng ngay sau dòng <code>* Connected to example.com (93.184.x.x) port 443</code>, không có dòng TLS nào và không có câu trả lời. Hãy nêu ba nguyên nhân có thể, và đưa ra câu lệnh phân biệt lỗi ứng dụng với mọi thứ còn lại.</p>
<div class="dap-an"><ol>
<li><strong>Không có gì đang nghe TLS ở cổng 443.</strong> Kết nối TCP được một thứ gì đó chấp nhận, nhưng không có cú bắt tay TLS nào bắt đầu. Hay gặp khi một proxy nhận kết nối trong lúc máy phía sau đã chết.</li>
<li><strong>Có thiết bị giữa đường chen vào.</strong> Một cổng đăng nhập Wi-Fi công cộng hay một tường lửa soi nội dung có thể hoàn tất bắt tay TCP rồi đứng im.</li>
<li><strong>Máy chủ còn sống nhưng quá tải</strong> và chưa kịp xử lý cú bắt tay. Kết nối nằm chờ trong hàng đợi accept.</li>
</ol>
<p><b>Câu lệnh phân biệt:</b></p>
<pre><code class="language-bash">openssl s_client -connect example.com:443 -servername example.com &lt;/dev/null</code></pre>
<p>Lệnh này làm đúng cú bắt tay và không làm gì khác. Nếu nó in ra chuỗi chứng chỉ thì TLS ổn và lỗi nằm phía trên — hãy đi xem HTTP. Nếu nó treo hoặc báo lỗi bắt tay thì lỗi nằm ở tầng trình diễn trở xuống, và đọc nhật ký ứng dụng là phí thời gian.</p>
<p><b>Vì sao đây là phép thử đúng.</b> Nó cô lập đúng một tầng. Đó chính là tính chất làm cho một phép thử đáng chạy: trước khi chạy, bạn nói được đạt thì loại trừ cái gì và hỏng thì loại trừ cái gì.</p></div>`,
    ),

    cq(45, [
      ['CQ15.3', 'How does TCP session establishment and termination processes facilitate reliable communication? <em>— this is the Transport Layer, Chapter 13 (FLM sessions 41–42, Cisco Module 14), not the Application Layer. Answer it there: the three-way handshake (SYN, SYN-ACK, ACK) synchronises initial sequence numbers in both directions and proves both ends can send and receive, which is what makes ordered delivery and retransmission possible at all; the four-way close (FIN, ACK, FIN, ACK) shuts each direction down independently, so a half-closed connection can still deliver what was already in flight.</em>',
        'How does TCP session establishment and termination processes facilitate reliable communication? <em>— đây là tầng Giao vận, tức Chương 13 (buổi 41–42 của FLM, Cisco Module 14), không phải tầng Ứng dụng. Hãy trả lời ở đó: bắt tay ba bước (SYN, SYN-ACK, ACK) đồng bộ số thứ tự khởi đầu cho cả hai chiều và chứng minh hai đầu đều gửi và nhận được, và chính điều đó mới làm cho việc giao đúng thứ tự và việc gửi lại trở nên khả thi; còn đóng bốn bước (FIN, ACK, FIN, ACK) tắt từng chiều một cách độc lập, nên một kết nối đã đóng nửa chiều vẫn giao nốt được phần đang trên đường.</em>'],
    ]),
  ].join('\n'),
};

/* ──────────────────────── Lesson 14.2 — session 46 ─────────────────────── */

const L2 = {
  title: '14.2 — Web, email, DNS, DHCP and file sharing protocols (FLM session 46)|||14.2 — Giao thức web, email, DNS, DHCP và chia sẻ tệp (buổi 46 của FLM)',
  slug: 'nwc204-14-2-web-email-dns-dhcp-chia-se-tep',
  type: 'DOCUMENT',
  description: 'Buổi 46: cấu trúc một lượt trao đổi HTTP đọc từng dòng, phương thức và họ mã trạng thái, ba giao thức email cùng số cổng của chúng, DNS phân giải theo cấp và các loại bản ghi, bốn bước DORA của DHCP và vì sao broadcast buộc máy chủ phải cùng subnet, rồi FTP so với SFTP và SMB. Kèm phần ★ đo thật: một IP phục vụ ba tên miền nhờ tiêu đề Host, HTTP/2 đổi Host thành :authority, dig +trace chết ở router nhà, TXT có HAI bản ghi SPF sai chuẩn, và một gói DHCP ACK đọc thẳng từ máy đang chạy. Trả lời đầy đủ CQ16.1 của trường.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 14 · Lesson 14.2 · FLM session 46 of 60 · CLO1, CLO4, CLO9 · Cisco Module 15</span>
<h2>Five services you will run yourself</h2>
<p class="lead">After this lesson you can read an HTTP exchange line by line, name the port of every mail protocol and say why 587 exists, walk a DNS resolution from the root, explain the four DHCP steps and why they force the server onto your subnet, and choose between FTP, SFTP and SMB for a real transfer.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 46 — "14.3 Web and Email Protocols · 14.4 IP Addressing Services · 14.5 File Sharing Services · 14.6 Integrate AI Tools for Explaining Concepts (Self Learning)"; LO: CLO1, CLO4, CLO9; ITU: T; tài liệu "Module 15: Application Layer"</p>
<p><strong>Opening question.</strong> Three different names resolve to the same address:</p>
<pre><code class="language-plaintext">cuongthai.com.       50  IN  A  198.51.100.208
www.cuongthai.com.  300  IN  A  198.51.100.208
api.cuongthai.com.      IN  A  198.51.100.208</code></pre>
<p>One machine, one IP, one port 443. Yet <code>https://www.cuongthai.com/</code> returns a web page and <code>https://api.cuongthai.com/api/v1/notes</code> returns <code>401</code>. <strong>Nothing at layer 3 or layer 4 can tell those two requests apart</strong> — the packets are identical in every field those layers can see. So what does?</p>
<div class="callout"><strong>Also worth noticing in that output.</strong> The first record says 50 and the second says 300, for the same data on the same day. That is not a misconfiguration; it is the single most misunderstood number in DNS, and it is explained later in this lesson.</div>
<p class="note">★ marks material added by cuongthai.com beyond Cisco Module 15, measured on 22 September 2026.</p>`,
      `<span class="eyebrow">NWC204 · Chương 14 · Bài 14.2 · Buổi 46/60 của FLM · CLO1, CLO4, CLO9 · Cisco Module 15</span>
<h2>Năm dịch vụ mà chính bạn sẽ vận hành</h2>
<p class="lead">Học xong bài này bạn đọc được một lượt trao đổi HTTP từng dòng, gọi tên được số cổng của mọi giao thức thư và nói được vì sao có cổng 587, đi được trọn một lượt phân giải DNS từ gốc, giải thích được bốn bước của DHCP và vì sao chúng buộc máy chủ phải nằm cùng subnet với bạn, và chọn được giữa FTP, SFTP và SMB cho một việc truyền tệp thật.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 46 — "14.3 Web and Email Protocols · 14.4 IP Addressing Services · 14.5 File Sharing Services · 14.6 Integrate AI Tools for Explaining Concepts (Self Learning)"; LO: CLO1, CLO4, CLO9; ITU: T; tài liệu "Module 15: Application Layer"</p>
<p><strong>Câu hỏi mở đầu.</strong> Ba cái tên khác nhau phân giải về cùng một địa chỉ:</p>
<pre><code class="language-plaintext">cuongthai.com.       50  IN  A  198.51.100.208
www.cuongthai.com.  300  IN  A  198.51.100.208
api.cuongthai.com.      IN  A  198.51.100.208</code></pre>
<p>Một cái máy, một địa chỉ IP, một cổng 443. Vậy mà <code>https://www.cuongthai.com/</code> trả về một trang web còn <code>https://api.cuongthai.com/api/v1/notes</code> trả về <code>401</code>. <strong>Không có gì ở tầng 3 hay tầng 4 phân biệt nổi hai yêu cầu đó</strong> — các gói tin giống hệt nhau ở mọi trường mà mấy tầng ấy nhìn thấy. Thế thì cái gì phân biệt?</p>
<div class="callout"><strong>Còn một chi tiết nữa trong kết xuất đó.</strong> Bản ghi thứ nhất ghi 50 còn bản thứ hai ghi 300, cho cùng một dữ liệu trong cùng một ngày. Đó không phải cấu hình sai; đó là con số bị hiểu nhầm nhiều nhất trong DNS, và nó được giải thích ở phần sau của bài này.</div>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 15, đo thật ngày 22/09/2026.</p>`,
    ),

    walkHead('nwc204-ch14', 11, 26,
      'Slides 11–26 cover FLM session 46: 14.3 Web and Email, 14.4 IP Addressing Services, 14.5 File Sharing, 14.6 AI tools.',
      'Slide 11–26 là buổi 46 của FLM: 14.3 Web và Email, 14.4 Dịch vụ địa chỉ IP, 14.5 Chia sẻ tệp, 14.6 Công cụ AI.'),

    walk('nwc204-ch14', [
      [11, 'Session 46 — four families of service',
        `<p>Session 46 carries four sub-sections, and it helps to see what they have in common: each one is a service that <strong>something else depends on silently</strong>.</p>
<ul>
<li><strong>14.3 Web</strong> — HTTP and HTTPS.</li>
<li><strong>14.3 Email</strong> — SMTP to send, POP3 or IMAP to read.</li>
<li><strong>14.4 IP addressing services</strong> — DNS turns names into addresses; DHCP gives hosts their addresses. Both are invisible until they break, and both then look like "the Internet is down".</li>
<li><strong>14.5 File sharing</strong> — FTP, SFTP, SMB.</li>
</ul>
<p>The syllabus calls DNS and DHCP "IP addressing services", which is a better name than most textbooks use: neither carries your data. They arrange the conditions under which your data can move.</p>`,
        `<p>Buổi 46 gánh bốn mục con, và nên nhìn ra điểm chung của chúng: mỗi mục là một dịch vụ mà <strong>thứ khác lặng lẽ phụ thuộc vào</strong>.</p>
<ul>
<li><strong>14.3 Web</strong> — HTTP và HTTPS.</li>
<li><strong>14.3 Email</strong> — SMTP để gửi, POP3 hoặc IMAP để đọc.</li>
<li><strong>14.4 Dịch vụ địa chỉ IP</strong> — DNS biến tên thành địa chỉ; DHCP cấp địa chỉ cho máy. Cả hai đều vô hình cho tới khi hỏng, và lúc hỏng thì cả hai đều trông giống hệt "mất mạng".</li>
<li><strong>14.5 Chia sẻ tệp</strong> — FTP, SFTP, SMB.</li>
</ul>
<p>Syllabus gọi DNS và DHCP là "dịch vụ địa chỉ IP", và đó là cái tên hay hơn phần lớn sách giáo khoa: không cái nào chở dữ liệu của bạn cả. Chúng sắp đặt điều kiện để dữ liệu của bạn đi được.</p>`],

      [12, '14.3 Anatomy of one HTTP exchange',
        `<p>An HTTP message is <strong>text lines, then one blank line, then the body</strong>. That is the entire format, and knowing it means you can read any HTTP problem directly.</p>
<ul>
<li><strong>Request line</strong> — method, path, version: <code>GET /academy HTTP/1.1</code>.</li>
<li><strong>Headers</strong> — one per line, <code>Name: value</code>. <code>Host</code> is the one that is mandatory in HTTP/1.1, and the opening question of this lesson is about it.</li>
<li><strong>Blank line</strong> — the end of the headers. Anything after it is body.</li>
<li><strong>Response</strong> — same shape: status line, headers, blank line, body.</li>
</ul>
<p><strong>A header is a claim, not a fact.</strong> <code>server: nginx/1.27.5</code> is what that server chose to say. It can be changed, removed or faked. Read headers as evidence, not as proof.</p>`,
        `<p>Một thông điệp HTTP là <strong>các dòng chữ, rồi một dòng trống, rồi phần thân</strong>. Đó là toàn bộ định dạng, và biết nó nghĩa là bạn đọc thẳng được mọi trục trặc HTTP.</p>
<ul>
<li><strong>Dòng yêu cầu</strong> — phương thức, đường dẫn, phiên bản: <code>GET /academy HTTP/1.1</code>.</li>
<li><strong>Các tiêu đề</strong> — mỗi dòng một cái, dạng <code>Tên: giá trị</code>. <code>Host</code> là tiêu đề bắt buộc trong HTTP/1.1, và câu hỏi mở đầu bài này nói về chính nó.</li>
<li><strong>Dòng trống</strong> — dấu chấm hết của khối tiêu đề. Mọi thứ sau đó là thân.</li>
<li><strong>Câu trả lời</strong> — cùng hình dạng: dòng trạng thái, các tiêu đề, dòng trống, phần thân.</li>
</ul>
<p><strong>Một tiêu đề là một lời khai, không phải một sự thật.</strong> <code>server: nginx/1.27.5</code> là thứ máy chủ đó chọn để nói ra. Nó sửa được, xoá được, giả được. Hãy đọc tiêu đề như bằng chứng, đừng đọc như chứng minh.</p>`],

      [13, '14.3 Methods and status families',
        `<p>Five methods and four status families cover almost everything you will meet.</p>
<ul>
<li><strong>GET</strong> gives you something and changes nothing. <strong>POST</strong> sends data and does something. <strong>PUT</strong> replaces, <strong>PATCH</strong> amends, <strong>DELETE</strong> removes, <strong>HEAD</strong> returns headers with no body.</li>
<li><strong>2xx</strong> it worked. <strong>3xx</strong> it is somewhere else. <strong>4xx</strong> <em>you</em> got it wrong. <strong>5xx</strong> <em>the server</em> got it wrong.</li>
</ul>
<p><strong>★ The 401-versus-404 test is a working tool, not trivia.</strong> Send an unauthenticated GET to a route. <strong>401 means the route is mounted</strong> and simply requires authentication. <strong>404 means it is not mounted at all</strong> — which, right after a deploy, almost always means the container is running an old image. Measured today: <code>/api/v1/notes</code> returned 401, a path that does not exist returned 404.</p>`,
        `<p>Năm phương thức và bốn họ mã trạng thái phủ gần hết những gì bạn sẽ gặp.</p>
<ul>
<li><strong>GET</strong> lấy về một thứ và không thay đổi gì. <strong>POST</strong> gửi dữ liệu lên và làm một việc gì đó. <strong>PUT</strong> thay thế, <strong>PATCH</strong> sửa một phần, <strong>DELETE</strong> xoá, <strong>HEAD</strong> trả tiêu đề mà không có thân.</li>
<li><strong>2xx</strong> xong việc. <strong>3xx</strong> nó nằm chỗ khác. <strong>4xx</strong> <em>bạn</em> sai. <strong>5xx</strong> <em>máy chủ</em> sai.</li>
</ul>
<p><strong>★ Phép thử 401 so với 404 là một công cụ dùng được, không phải chuyện vặt.</strong> Gửi một yêu cầu GET không kèm xác thực vào một tuyến. <strong>401 nghĩa là tuyến ĐÃ được gắn</strong> và chỉ đang đòi xác thực. <strong>404 nghĩa là nó chưa được gắn</strong> — mà ngay sau một lần deploy thì điều đó gần như luôn nghĩa là container đang chạy ảnh cũ. Đo hôm nay: <code>/api/v1/notes</code> trả 401, còn một đường dẫn không tồn tại trả 404.</p>`],

      [14, '★ One IP, three sites — the Host header decides',
        `<p>This answers the opening question. The client puts the site name in a header, and the server reads it.</p>
<ul>
<li>In HTTP/1.1 that header is <code>Host:</code> and it is <strong>mandatory</strong> — a request without it is malformed.</li>
<li>nginx matches it against <code>server_name</code> to pick which <code>server</code> block handles the request. This site has three names on one block set: <code>cuongthai.com</code>, <code>www.cuongthai.com</code>, <code>api.cuongthai.com</code>.</li>
<li>Measured: the same IP and port returned <strong>200</strong> for the www name and <strong>401</strong> for the api name on an API path. Only the Host differed.</li>
</ul>
<p><strong>Why a reverse proxy must forward it.</strong> A proxy opens its own connection to the upstream, and that connection needs its own Host header. <code>proxy_set_header Host $host;</code> copies the original. Leave it out and the upstream sees the proxy's idea of its own name — which breaks absolute redirects, cookie domains and multi-tenant routing, all at once and all confusingly.</p>`,
        `<p>Đây là câu trả lời cho câu hỏi mở đầu. Máy khách đặt tên trang vào một tiêu đề, và máy chủ đọc tiêu đề đó.</p>
<ul>
<li>Trong HTTP/1.1, tiêu đề đó là <code>Host:</code> và nó <strong>bắt buộc</strong> — một yêu cầu thiếu nó là yêu cầu sai định dạng.</li>
<li>nginx đối chiếu nó với <code>server_name</code> để chọn khối <code>server</code> nào xử lý. Trang này có ba tên trên cùng một bộ khối: <code>cuongthai.com</code>, <code>www.cuongthai.com</code>, <code>api.cuongthai.com</code>.</li>
<li>Đo thật: cùng một IP và cùng một cổng trả <strong>200</strong> với tên www và trả <strong>401</strong> với tên api trên một đường dẫn API. Chỉ khác nhau mỗi tiêu đề Host.</li>
</ul>
<p><strong>Vì sao proxy ngược bắt buộc phải chuyển tiếp nó.</strong> Proxy mở một kết nối riêng của nó tới máy phía sau, và kết nối đó cần tiêu đề Host của riêng nó. Dòng <code>proxy_set_header Host $host;</code> chép lại cái ban đầu. Bỏ dòng đó thì máy phía sau nhìn thấy tên mà proxy tự nghĩ về mình — và thế là chuyển hướng tuyệt đối, miền của cookie và việc định tuyến nhiều khách thuê cùng hỏng một lúc, theo kiểu rất khó lần.</p>`],

      [15, '★ HTTP/1.1 keep-alive vs HTTP/2 multiplexing',
        `<p>Both reuse one TCP connection. The difference is what they allow on it.</p>
<ul>
<li><strong>HTTP/1.1 keep-alive</strong> sends requests one after another on the same connection. Request two waits for response one. One slow response holds the line — that is <strong>head-of-line blocking</strong>, and it is why browsers historically opened six connections per host.</li>
<li><strong>HTTP/2</strong> is binary and splits each exchange into a <strong>stream</strong>. Streams interleave frames on one connection, so a slow response blocks nobody.</li>
</ul>
<p>★ Which one gets used is decided by <strong>ALPN during the TLS handshake</strong>, before any HTTP is spoken. Measured: curl offered <code>h2,http/1.1</code> and the server accepted <code>h2</code>.</p>
<p>★ And one thing that surprises people in a packet capture: <strong>HTTP/2 has no readable Host line.</strong> The name moves into a pseudo-header, <code>:authority</code>, alongside <code>:method</code>, <code>:scheme</code> and <code>:path</code>. Same job, different wire format. Do not conclude the Host is missing.</p>`,
        `<p>Cả hai đều dùng lại một kết nối TCP. Khác nhau ở chỗ chúng cho phép làm gì trên kết nối đó.</p>
<ul>
<li><strong>HTTP/1.1 keep-alive</strong> gửi các yêu cầu nối đuôi nhau trên cùng một kết nối. Yêu cầu thứ hai phải chờ câu trả lời thứ nhất. Một câu trả lời chậm giữ cả đường — đó là <strong>nghẽn đầu hàng</strong>, và đó là lý do trình duyệt ngày xưa mở sáu kết nối cho mỗi tên miền.</li>
<li><strong>HTTP/2</strong> là nhị phân và tách mỗi lượt trao đổi thành một <strong>luồng</strong>. Các luồng đan khung với nhau trên cùng một kết nối, nên một câu trả lời chậm không chặn ai cả.</li>
</ul>
<p>★ Việc dùng cái nào được quyết bởi <strong>ALPN trong lúc bắt tay TLS</strong>, trước khi nói một chữ HTTP nào. Đo thật: curl chào <code>h2,http/1.1</code> và máy chủ nhận <code>h2</code>.</p>
<p>★ Và một điều làm người ta bất ngờ khi bắt gói: <strong>HTTP/2 không có dòng Host đọc được.</strong> Cái tên dời vào một giả-tiêu-đề là <code>:authority</code>, đi cùng <code>:method</code>, <code>:scheme</code> và <code>:path</code>. Cùng một việc, khác định dạng trên đường truyền. Đừng kết luận là thiếu Host.</p>`],

      [16, '14.3 Email: three protocols, three jobs',
        `<p>Email is three protocols, and confusing them is the most common email support mistake.</p>
<ul>
<li><strong>SMTP</strong> — <em>sending</em>. Port <strong>25</strong> is server-to-server relay; port <strong>587</strong> is a user <em>submitting</em> a message, and it requires authentication. Port 465 is the implicit-TLS variant.</li>
<li><strong>POP3</strong> — <em>reading</em>, by downloading and, by default, deleting from the server. Port 110, or <strong>995</strong> over TLS.</li>
<li><strong>IMAP</strong> — <em>reading</em>, keeping the mail on the server so folders stay in sync across devices. Port 143, or <strong>993</strong> over TLS.</li>
</ul>
<p><strong>Why 25 and 587 are different ports.</strong> They are different activities with different rules: relay between servers, versus a human submitting mail and proving who they are. Most consumer ISPs block outbound 25 to suppress spam, which is precisely why 587 exists.</p>
<p>★ A network that permits only 80, 443, 587 and 993 outbound — which is the shape of many school and corporate networks — still lets you send and read mail. That is not a coincidence; those two ports were chosen as the user-facing ones.</p>`,
        `<p>Email là ba giao thức, và nhầm lẫn giữa chúng là lỗi hỗ trợ email hay gặp nhất.</p>
<ul>
<li><strong>SMTP</strong> — <em>gửi</em>. Cổng <strong>25</strong> là chuyển tiếp giữa máy chủ với máy chủ; cổng <strong>587</strong> là người dùng <em>nộp</em> một lá thư, và nó đòi xác thực. Cổng 465 là biến thể TLS ngầm.</li>
<li><strong>POP3</strong> — <em>đọc</em>, bằng cách tải về và, theo mặc định, xoá khỏi máy chủ. Cổng 110, hoặc <strong>995</strong> khi qua TLS.</li>
<li><strong>IMAP</strong> — <em>đọc</em>, giữ thư lại trên máy chủ nên các thư mục đồng bộ giữa nhiều thiết bị. Cổng 143, hoặc <strong>993</strong> khi qua TLS.</li>
</ul>
<p><strong>Vì sao 25 và 587 là hai cổng khác nhau.</strong> Chúng là hai hoạt động khác nhau với luật khác nhau: chuyển tiếp giữa các máy chủ, so với một con người nộp thư và phải chứng minh mình là ai. Phần lớn nhà mạng dân dụng chặn cổng 25 đi ra để hạn chế thư rác, và đó đúng là lý do cổng 587 tồn tại.</p>
<p>★ Một mạng chỉ mở 80, 443, 587 và 993 đi ra — đúng hình dạng của nhiều mạng trường học và công ty — thì vẫn gửi và đọc thư được. Đó không phải tình cờ; hai cổng ấy được chọn làm cổng dành cho người dùng.</p>`],

      [17, '★ A real SMTP conversation, typed by hand',
        `<p>SMTP is old enough to be typed by a human, and doing so once teaches more than any diagram. This is a real session against Gmail on 22 September 2026.</p>
<ul>
<li><strong>The server speaks first</strong> with <code>220</code>. This is unlike HTTP, where the client always opens. If you connect and nothing appears, the port is wrong or something is filtering.</li>
<li><code>EHLO</code> asks the server to introduce itself, and it replies with a <strong>list of capabilities</strong>: <code>SIZE</code>, <code>STARTTLS</code>, <code>PIPELINING</code>, <code>SMTPUTF8</code>. That list is how a client knows whether it can upgrade to TLS.</li>
<li>The greeting <strong>told us our own public IP address</strong> — which is how mail servers apply reputation, and also a free way to find your outbound address.</li>
<li>Every reply is a <strong>three-digit code</strong>, in the same 2xx / 4xx / 5xx spirit as HTTP. <code>221</code> is a clean goodbye.</li>
</ul>
<div class="callout warn">You cannot do this on port 993 or 465 — those start with TLS immediately, so a plain <code>nc</code> sees encrypted bytes. Use <code>openssl s_client -connect host:993</code> instead, which does the handshake and then hands you the same plain-text conversation.</div>`,
        `<p>SMTP đủ cổ để một con người gõ tay được, và gõ một lần dạy được nhiều hơn mọi sơ đồ. Đây là một phiên thật với Gmail ngày 22/09/2026.</p>
<ul>
<li><strong>Máy chủ nói trước</strong> bằng mã <code>220</code>. Chỗ này khác HTTP, nơi máy khách luôn là bên mở lời. Nếu bạn kết nối mà không thấy gì hiện ra thì sai cổng hoặc có thứ gì đó đang lọc.</li>
<li>Lệnh <code>EHLO</code> yêu cầu máy chủ tự giới thiệu, và nó đáp lại bằng một <strong>danh sách năng lực</strong>: <code>SIZE</code>, <code>STARTTLS</code>, <code>PIPELINING</code>, <code>SMTPUTF8</code>. Danh sách đó chính là cách máy khách biết có nâng cấp lên TLS được không.</li>
<li>Lời chào ấy <strong>nói cho chúng ta biết địa chỉ IP công khai của chính mình</strong> — đó là cách máy chủ thư áp dụng uy tín người gửi, và cũng là một cách miễn phí để biết địa chỉ đi ra của bạn.</li>
<li>Mọi câu trả lời đều là một <strong>mã ba chữ số</strong>, theo đúng tinh thần 2xx / 4xx / 5xx như HTTP. Mã <code>221</code> là lời tạm biệt sạch sẽ.</li>
</ul>
<div class="callout warn">Bạn không làm được việc này trên cổng 993 hay 465 — những cổng đó vào TLS ngay lập tức, nên một lệnh <code>nc</code> trơn chỉ thấy byte đã mã hoá. Hãy dùng <code>openssl s_client -connect host:993</code>, nó bắt tay xong rồi trao lại cho bạn đúng cuộc trò chuyện chữ thường ấy.</div>`],

      [18, '14.4 DNS — a walk down the hierarchy',
        `<p>No server knows every name. Each one knows only who to ask next, and a resolution is a walk down that chain.</p>
<ul>
<li>You ask a <strong>recursive resolver</strong> (your ISP, your router, or 1.1.1.1). It does the walking for you.</li>
<li>It asks a <strong>root server</strong>, which does not know your domain but returns a <strong>referral</strong>: ".com is handled by these thirteen nameservers".</li>
<li>It asks a <strong>.com TLD server</strong>, which returns another referral: "cuongthai.com is served by kyrie and meilani.ns.cloudflare.com".</li>
<li>It asks one of those <strong>authoritative nameservers</strong>, which finally answers: A 198.51.100.208, cacheable for 300 seconds.</li>
</ul>
<p><strong>Three referrals, one answer.</strong> Then the resolver caches it, and the next thousand people to ask get the cached copy without any of that walking. The whole system is built to make the second query cheap.</p>`,
        `<p>Không máy chủ nào biết hết mọi cái tên. Mỗi máy chỉ biết phải hỏi ai tiếp, và một lượt phân giải là một lượt đi dọc chuỗi đó.</p>
<ul>
<li>Bạn hỏi một <strong>bộ phân giải đệ quy</strong> (của nhà mạng, của router nhà bạn, hoặc 1.1.1.1). Nó đi bộ thay bạn.</li>
<li>Nó hỏi một <strong>máy chủ gốc</strong>, máy này không biết tên miền của bạn nhưng trả về một <strong>lời chỉ đường</strong>: ".com do mười ba máy chủ tên này phụ trách".</li>
<li>Nó hỏi một <strong>máy chủ TLD .com</strong>, máy này trả về lời chỉ đường tiếp: "cuongthai.com do kyrie và meilani.ns.cloudflare.com phục vụ".</li>
<li>Nó hỏi một trong những <strong>máy chủ tên có thẩm quyền</strong> đó, và máy này mới trả lời thật: A 198.51.100.208, được phép đệm 300 giây.</li>
</ul>
<p><strong>Ba lời chỉ đường, một câu trả lời.</strong> Rồi bộ phân giải đệm lại, và một nghìn người hỏi tiếp theo nhận bản đệm mà không phải đi lại đoạn đường ấy. Cả hệ thống được dựng lên để làm cho lần hỏi thứ hai trở nên rẻ.</p>`],

      [19, '14.4 The record types you will actually meet',
        `<p>Six types cover nearly all day-to-day work. Measured on this site today:</p>
<ul>
<li><strong>A</strong> — a name to an IPv4 address. <code>cuongthai.com</code> to <code>198.51.100.208</code>.</li>
<li><strong>AAAA</strong> — a name to an IPv6 address. ★ This domain has <strong>none</strong>; the site is IPv4 only today. Worth knowing, because "IPv6 does not work" for a site with no AAAA record is not a fault, it is an absence.</li>
<li><strong>CNAME</strong> — a name to another <em>name</em>, not to an address. It cannot coexist with other records at the same name, which is why a zone apex usually cannot be a CNAME.</li>
<li><strong>MX</strong> — which server accepts mail, with a priority. Here: <code>10 cuongthai.com</code>, <code>20 fwd2.porkbun.com</code>. Lower number is tried first.</li>
<li><strong>NS</strong> — the authoritative nameservers for the zone.</li>
<li><strong>TXT</strong> — free text, used for SPF and for domain verification.</li>
</ul>
<div class="callout warn">★ <strong>A real finding.</strong> This domain publishes <strong>two</strong> <code>v=spf1</code> TXT records. RFC 7208 section 3.2 requires at most one; two is a permanent error and a receiver may fail the check outright. It was found by reading <code>dig TXT</code> output, not by reasoning — which is the point of running the command.</div>`,
        `<p>Sáu loại bản ghi phủ gần hết công việc hằng ngày. Đo trên chính trang này hôm nay:</p>
<ul>
<li><strong>A</strong> — một cái tên trỏ tới một địa chỉ IPv4. <code>cuongthai.com</code> tới <code>198.51.100.208</code>.</li>
<li><strong>AAAA</strong> — một cái tên trỏ tới một địa chỉ IPv6. ★ Tên miền này <strong>không có</strong> bản ghi nào loại đó; trang hiện chỉ chạy IPv4. Đáng biết, vì "IPv6 không chạy" với một trang không có bản ghi AAAA thì không phải lỗi, mà là một sự vắng mặt.</li>
<li><strong>CNAME</strong> — một cái tên trỏ tới một <em>cái tên</em> khác, chứ không tới địa chỉ. Nó không sống chung được với bản ghi khác cùng tên, và đó là lý do gốc của một vùng thường không làm CNAME được.</li>
<li><strong>MX</strong> — máy chủ nào nhận thư, kèm mức ưu tiên. Ở đây: <code>10 cuongthai.com</code>, <code>20 fwd2.porkbun.com</code>. Số nhỏ hơn được thử trước.</li>
<li><strong>NS</strong> — các máy chủ tên có thẩm quyền của vùng.</li>
<li><strong>TXT</strong> — chữ tự do, dùng cho SPF và cho việc xác minh quyền sở hữu tên miền.</li>
</ul>
<div class="callout warn">★ <strong>Một phát hiện thật.</strong> Tên miền này đang công bố <strong>hai</strong> bản ghi TXT <code>v=spf1</code>. RFC 7208 mục 3.2 yêu cầu nhiều nhất một; hai là lỗi vĩnh viễn và bên nhận có thể cho hỏng luôn phép kiểm. Nó được tìm ra bằng cách đọc kết xuất <code>dig TXT</code>, không phải bằng suy luận — và đó chính là lý do phải chạy lệnh.</div>`],

      [20, '★ dig +trace, and the day it fails on you',
        `<p><code>dig +trace</code> makes the resolver walk visible: it queries each level itself instead of asking a recursive resolver for the final answer. Measured through 1.1.1.1, it produced exactly the four steps of the previous slide.</p>
<p><strong>Then the same command without <code>@1.1.1.1</code> died immediately:</strong></p>
<ul>
<li>It received <strong>17 bytes</strong> from the home router at 192.168.1.1 and stopped. No error text, no explanation, no trace.</li>
<li>The reason: <code>+trace</code> must first ask for the <strong>root nameservers</strong>, then query them <em>directly</em>. Many home routers and ISP resolvers do not allow that, and some block outbound DNS to anything but themselves.</li>
</ul>
<p><strong>★ The lesson generalises.</strong> A tool failing at step one is not evidence about the thing you were investigating. Add <code>@1.1.1.1</code> and try again before concluding DNS is broken — the second run took 46, 71 and 221 ms per step and worked perfectly.</p>`,
        `<p>Lệnh <code>dig +trace</code> làm cho lượt đi của bộ phân giải hiện ra: nó tự hỏi từng cấp thay vì nhờ một bộ phân giải đệ quy trả lời luôn. Đo qua 1.1.1.1, nó cho ra đúng bốn bước ở slide trước.</p>
<p><strong>Rồi cũng lệnh đó mà bỏ <code>@1.1.1.1</code> thì chết ngay lập tức:</strong></p>
<ul>
<li>Nó nhận <strong>17 byte</strong> từ router nhà ở 192.168.1.1 rồi dừng. Không có dòng lỗi nào, không lời giải thích, không có bản trace nào.</li>
<li>Lý do: <code>+trace</code> trước hết phải hỏi danh sách <strong>máy chủ gốc</strong>, rồi hỏi thẳng vào chúng. Nhiều router gia đình và bộ phân giải của nhà mạng không cho phép việc đó, và một số còn chặn mọi truy vấn DNS đi ra ngoài trừ tới chính nó.</li>
</ul>
<p><strong>★ Bài học rộng hơn.</strong> Một công cụ chết ở bước một thì không phải bằng chứng gì về cái bạn đang điều tra. Hãy thêm <code>@1.1.1.1</code> và thử lại trước khi kết luận DNS hỏng — lần chạy thứ hai mất 46, 71 và 221 ms cho từng bước và chạy hoàn hảo.</p>`],

      [21, '14.4 DHCP — the four steps, and why they are broadcast',
        `<p>DORA: Discover, Offer, Request, Acknowledge.</p>
<ul>
<li><strong>DISCOVER</strong> — the client has no address and knows no server, so it <strong>broadcasts</strong>: "is there a DHCP server?"</li>
<li><strong>OFFER</strong> — a server replies with an address it is willing to give.</li>
<li><strong>REQUEST</strong> — the client <strong>broadcasts again</strong>, naming the offer it accepts. The second broadcast is deliberate: it tells every <em>other</em> DHCP server to withdraw its offer.</li>
<li><strong>ACK</strong> — the chosen server confirms, and sends the mask, gateway, DNS servers and a lease time.</li>
</ul>
<p><strong>Why it must be broadcast, and what that costs.</strong> A host with no address cannot use unicast, and it has nowhere to send a unicast anyway. But Chapter 10 established that <strong>routers do not forward broadcasts</strong> — so the DHCP server must be on the same subnet, or a router must be told to relay with <code>ip helper-address</code>. "Machines on the new VLAN get no address" is this, nearly every time.</p>`,
        `<p>DORA: Discover, Offer, Request, Acknowledge.</p>
<ul>
<li><strong>DISCOVER</strong> — máy khách chưa có địa chỉ và không biết máy chủ nào, nên nó <strong>phát quảng bá</strong>: "có máy chủ DHCP nào không?"</li>
<li><strong>OFFER</strong> — một máy chủ đáp lại bằng một địa chỉ mà nó sẵn sàng cấp.</li>
<li><strong>REQUEST</strong> — máy khách <strong>lại phát quảng bá</strong>, gọi tên lời mời mà nó nhận. Lần quảng bá thứ hai là cố ý: nó báo cho mọi máy chủ DHCP <em>khác</em> rút lời mời của họ về.</li>
<li><strong>ACK</strong> — máy chủ được chọn xác nhận, và gửi kèm mặt nạ mạng, cổng ra mặc định, máy chủ DNS và thời hạn thuê.</li>
</ul>
<p><strong>Vì sao bắt buộc phải quảng bá, và cái giá của nó.</strong> Một máy chưa có địa chỉ thì không dùng unicast được, mà cũng chẳng biết gửi unicast tới đâu. Nhưng Chương 10 đã nêu rằng <strong>router không chuyển tiếp gói quảng bá</strong> — nên máy chủ DHCP phải nằm cùng subnet, hoặc phải bảo router tiếp sức bằng <code>ip helper-address</code>. "Máy ở VLAN mới không xin được địa chỉ" gần như lần nào cũng là chuyện này.</p>`],

      [22, '★ A real DHCP lease, read off a working machine',
        `<p>A real ACK packet, read from a laptop on an ordinary home network on 22 September 2026.</p>
<ul>
<li><code>yiaddr = 192.168.1.101</code> — "your address", the one being handed out. The field name is from BOOTP, which DHCP extended.</li>
<li><code>dhcp_message_type: ACK</code> — this is step 4 of DORA, captured after the fact.</li>
<li><code>lease_time: 0x1c20</code> — <strong>7200 seconds, two hours</strong>. The client will try to renew at half of that.</li>
<li><code>subnet_mask</code>, <code>router</code>, <code>domain_name_server</code> — the three things that come <em>with</em> the address.</li>
</ul>
<p><strong>★ The thing worth taking away:</strong> DHCP hands out <strong>four</strong> things, not one. A host with an address but no gateway can reach its own subnet and nothing else; a host with no DNS server can reach 8.8.8.8 but no name. Both present as "the Internet is broken", and both are DHCP faults.</p>
<p class="ghi-chu">On Linux the same information is in <code>/var/lib/dhcp/dhclient.leases</code> or from <code>networkctl status</code>; on Windows, <code>ipconfig /all</code>.</p>`,
        `<p>Một gói ACK thật, đọc từ một máy tính xách tay trên một mạng gia đình bình thường ngày 22/09/2026.</p>
<ul>
<li><code>yiaddr = 192.168.1.101</code> — "địa chỉ của bạn", cái đang được cấp. Tên trường này có từ BOOTP, thứ mà DHCP mở rộng ra.</li>
<li><code>dhcp_message_type: ACK</code> — đây là bước 4 của DORA, bắt lại được sau khi mọi việc đã xong.</li>
<li><code>lease_time: 0x1c20</code> — <strong>7200 giây, tức hai giờ</strong>. Máy khách sẽ xin gia hạn ở nửa thời gian đó.</li>
<li><code>subnet_mask</code>, <code>router</code>, <code>domain_name_server</code> — ba thứ đi <em>kèm</em> với địa chỉ.</li>
</ul>
<p><strong>★ Điều đáng mang đi:</strong> DHCP cấp <strong>bốn</strong> thứ chứ không phải một. Một máy có địa chỉ mà không có cổng ra thì tới được subnet của chính nó và không tới được gì khác; một máy không có máy chủ DNS thì tới được 8.8.8.8 mà không tới được cái tên nào. Cả hai hiện ra thành "mạng hỏng rồi", và cả hai đều là lỗi DHCP.</p>
<p class="ghi-chu">Trên Linux thì thông tin đó nằm ở <code>/var/lib/dhcp/dhclient.leases</code> hoặc lấy bằng <code>networkctl status</code>; trên Windows thì dùng <code>ipconfig /all</code>.</p>`],

      [23, '14.5 File sharing — and what replaced most of it',
        `<p>Five protocols, and in practice one of them wins almost every time.</p>
<ul>
<li><strong>FTP</strong> — ports 21 (control) and 20 (data). <strong>No encryption</strong>: username and password cross the network in clear text. Legacy only.</li>
<li><strong>FTPS</strong> — FTP wrapped in TLS. Use when a partner insists on FTP.</li>
<li><strong>SFTP and SCP</strong> — <strong>port 22, because they are SSH</strong>. One connection, encrypted, authenticated by the same keys you already use.</li>
<li><strong>SMB / CIFS</strong> — port 445. Windows file and printer sharing.</li>
<li><strong>TFTP</strong> — port 69 over UDP, no authentication at all. Its one honest use is pushing firmware images to network devices on a trusted segment.</li>
</ul>
<p><strong>Why FTP is painful.</strong> It uses <strong>two</strong> connections, and in active mode the <em>server</em> opens the data connection back to the client — which NAT and firewalls block, because that is exactly what they exist to stop. Passive mode was invented to work around it. SFTP has none of this: one connection, port 22, done.</p>`,
        `<p>Năm giao thức, và trên thực tế gần như lần nào cũng có một cái thắng.</p>
<ul>
<li><strong>FTP</strong> — cổng 21 (điều khiển) và 20 (dữ liệu). <strong>Không mã hoá</strong>: tên đăng nhập và mật khẩu đi qua mạng ở dạng chữ thường. Chỉ dùng khi buộc phải tương thích cái cũ.</li>
<li><strong>FTPS</strong> — FTP bọc trong TLS. Dùng khi đối tác khăng khăng đòi FTP.</li>
<li><strong>SFTP và SCP</strong> — <strong>cổng 22, vì chúng CHÍNH LÀ SSH</strong>. Một kết nối, có mã hoá, xác thực bằng đúng những khoá bạn đang dùng sẵn.</li>
<li><strong>SMB / CIFS</strong> — cổng 445. Chia sẻ tệp và máy in của Windows.</li>
<li><strong>TFTP</strong> — cổng 69 trên UDP, hoàn toàn không có xác thực. Công dụng tử tế duy nhất của nó là đẩy ảnh firmware vào thiết bị mạng trong một phân đoạn tin cậy.</li>
</ul>
<p><strong>Vì sao FTP gây khổ.</strong> Nó dùng <strong>hai</strong> kết nối, và ở chế độ chủ động thì chính <em>máy chủ</em> mở kết nối dữ liệu ngược về máy khách — mà NAT và tường lửa chặn đúng việc đó, vì chúng sinh ra để chặn đúng việc đó. Chế độ bị động được phát minh ra để lách. SFTP thì không dính gì trong số này: một kết nối, cổng 22, xong.</p>`],

      [24, '★ The file transfer you already use every deploy',
        `<p>Three of the four commands on this slide are SSH wearing different names, which is why opening port 22 is the only firewall change they need between them.</p>
<ul>
<li><code>rsync -az --delete</code> over SSH — copies only what differs, which is why a deploy script uses it instead of re-uploading everything.</li>
<li><code>scp</code> and <code>sftp</code> — the same transport, different interfaces.</li>
<li>Object storage such as S3 or Cloudflare R2 — <strong>this one is not a file-sharing protocol at all.</strong> It is an HTTP API on port 443. It looks like file sharing and is governed by web rules: URLs, status codes, and headers such as <code>cache-control</code>.</li>
</ul>
<p>★ That last distinction has a practical edge. Measured today: an image served from the media host returned <code>cache-control: public, max-age=31536000, immutable</code>, while the application host returned <code>no-cache, no-store, must-revalidate</code> for its pages. Same protocol, opposite policies, both deliberate — and you can only tell which one is in force by asking with <code>curl -I</code>.</p>`,
        `<p>Ba trong bốn lệnh ở slide này là SSH khoác tên khác, và đó là lý do mở cổng 22 là thay đổi tường lửa duy nhất mà cả ba cần.</p>
<ul>
<li><code>rsync -az --delete</code> qua SSH — chỉ chép phần khác biệt, và đó là lý do một kịch bản deploy dùng nó thay vì tải lại toàn bộ.</li>
<li><code>scp</code> và <code>sftp</code> — cùng một đường truyền, khác giao diện.</li>
<li>Kho đối tượng như S3 hay Cloudflare R2 — <strong>cái này hoàn toàn không phải giao thức chia sẻ tệp.</strong> Nó là một API HTTP trên cổng 443. Nó trông như chia sẻ tệp và bị chi phối bởi luật của web: đường dẫn URL, mã trạng thái, và các tiêu đề như <code>cache-control</code>.</li>
</ul>
<p>★ Phân biệt cuối cùng đó có cạnh sắc thực tế. Đo hôm nay: một tấm ảnh phục vụ từ máy chủ media trả <code>cache-control: public, max-age=31536000, immutable</code>, trong khi máy chủ ứng dụng trả <code>no-cache, no-store, must-revalidate</code> cho các trang của nó. Cùng giao thức, chính sách trái ngược, và cả hai đều cố ý — mà bạn chỉ biết cái nào đang hiệu lực bằng cách hỏi bằng <code>curl -I</code>.</p>`],

      [25, '14.6 AI tools for explaining concepts — and their limit',
        `<p>Section 14.6 is listed as self-learning, and the honest framing is this: a model is very good at explaining a protocol and structurally incapable of observing your network.</p>
<ul>
<li><strong>Good use.</strong> "Explain what <code>:authority</code> is in HTTP/2." "What does <code>250-STARTTLS</code> mean in an EHLO reply?" "Give me a checklist for a host that has an address but no gateway."</li>
<li><strong>Bad use.</strong> Asking what a domain's DNS records are and believing the answer. The model has not queried anything; it will produce plausible values, and plausible is the dangerous kind of wrong.</li>
</ul>
<p><strong>The example that proves it.</strong> The duplicate SPF record found earlier in this lesson could not have been produced by reasoning. It is a fact about one zone on one day, and only <code>dig</code> knew it.</p>
<p class="ghi-chu">The rule that has held all course: a model proposes, a command decides.</p>`,
        `<p>Mục 14.6 được xếp là tự học, và cách nói sòng phẳng là thế này: một mô hình rất giỏi giải thích một giao thức và về mặt cấu trúc thì không có khả năng quan sát mạng của bạn.</p>
<ul>
<li><strong>Dùng đúng.</strong> "Giải thích <code>:authority</code> trong HTTP/2 là gì." "Dòng <code>250-STARTTLS</code> trong câu trả lời EHLO nghĩa là gì?" "Cho tôi bảng kiểm cho một máy có địa chỉ mà không có cổng ra."</li>
<li><strong>Dùng sai.</strong> Hỏi các bản ghi DNS của một tên miền là gì rồi tin câu trả lời. Mô hình chưa truy vấn gì cả; nó sẽ sinh ra những giá trị nghe hợp lý, mà nghe hợp lý là kiểu sai nguy hiểm.</li>
</ul>
<p><strong>Ví dụ chứng minh điều đó.</strong> Bản ghi SPF trùng lặp tìm ra ở phần trước bài này không thể được sinh ra bằng suy luận. Nó là một sự thật về một vùng DNS trong một ngày, và chỉ <code>dig</code> biết nó.</p>
<p class="ghi-chu">Quy tắc đã đúng suốt cả môn: mô hình đề xuất, câu lệnh phán quyết.</p>`],

      [26, 'What you can do now, and what comes next',
        `<p>The checklist for this chapter, stated as things you can do rather than things you have read.</p>
<ul>
<li>Say what the application, presentation and session layers each answer, and match a symptom to one of them.</li>
<li>Tell a P2P network from a P2P application, and explain why a tracker does not break the label.</li>
<li>Read an HTTP request and response line by line, and name the layer each line belongs to.</li>
<li>★ Use 401 versus 404 on an unauthenticated GET to separate "needs auth" from "not deployed".</li>
<li>★ Walk a DNS resolution with <code>dig +trace</code>, and know why it fails through a home router.</li>
<li>Explain DORA, and why a broadcast forces the DHCP server onto the same subnet.</li>
<li>Name the ports: 80 and 443, 25 and 587, 110 and 995, 143 and 993, 21 and 20, 22, 445, 53, 69.</li>
</ul>
<p><strong>What comes next in the FLM plan.</strong> Sessions 47 and 48 are project work on the small-network design. Chapter 15, session 49, is network security fundamentals — where the ports you have just learned become the surface you have to defend.</p>`,
        `<p>Bảng kiểm của chương này, viết thành những việc bạn LÀM ĐƯỢC chứ không phải những thứ bạn đã đọc.</p>
<ul>
<li>Nói được tầng Ứng dụng, Trình diễn và Phiên mỗi tầng trả lời câu hỏi gì, và ghép một triệu chứng vào đúng một tầng.</li>
<li>Phân biệt mạng ngang hàng với ứng dụng ngang hàng, và giải thích vì sao tracker không làm mất cái nhãn đó.</li>
<li>Đọc một yêu cầu và một câu trả lời HTTP từng dòng, và gọi tên tầng của từng dòng.</li>
<li>★ Dùng 401 so với 404 trên một yêu cầu GET không xác thực để tách "cần đăng nhập" khỏi "chưa được deploy".</li>
<li>★ Đi trọn một lượt phân giải DNS bằng <code>dig +trace</code>, và biết vì sao nó chết khi đi qua router nhà.</li>
<li>Giải thích DORA, và vì sao việc quảng bá buộc máy chủ DHCP phải nằm cùng subnet.</li>
<li>Thuộc các cổng: 80 và 443, 25 và 587, 110 và 995, 143 và 993, 21 và 20, 22, 445, 53, 69.</li>
</ul>
<p><strong>Kế hoạch FLM tiếp theo là gì.</strong> Buổi 47 và 48 là làm đồ án thiết kế mạng nhỏ. Chương 15, tức buổi 49, là nền tảng an ninh mạng — nơi những số cổng bạn vừa học trở thành bề mặt mà bạn phải bảo vệ.</p>`],
    ]),

    bi(
      `<h3>🗺️ What one typed address actually sets off</h3>
<pre><code class="language-mermaid">graph TD
  A["You type https://cuongthai.com/academy"] --> B["DNS: name to 198.51.100.208<br/>UDP port 53"]
  B --> C["TCP handshake to port 443<br/>Chapter 13"]
  C --> D["TLS handshake + ALPN picks h2<br/>presentation and session"]
  D --> E["HTTP request and response<br/>application"]
  classDef svc fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef low fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef app fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class A,B svc
  class C,D low
  class E app</code></pre>
<p><strong>Four protocols before one byte of page arrives.</strong> When a page "does not load", the useful first question is which of these four boxes never completed — and each one has a command that answers it: <code>dig</code>, <code>nc -z</code>, <code>openssl s_client</code>, <code>curl -I</code>.</p>`,
      `<h3>🗺️ Một địa chỉ bạn gõ ra thật sự châm ngòi cho những gì</h3>
<pre><code class="language-mermaid">graph TD
  A["Bạn gõ https://cuongthai.com/academy"] --> B["DNS: tên thành 198.51.100.208<br/>UDP cổng 53"]
  B --> C["Bắt tay TCP tới cổng 443<br/>Chương 13"]
  C --> D["Bắt tay TLS + ALPN chọn h2<br/>trình diễn và phiên"]
  D --> E["Yêu cầu và trả lời HTTP<br/>ứng dụng"]
  classDef svc fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef low fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef app fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class A,B svc
  class C,D low
  class E app</code></pre>
<p><strong>Bốn giao thức trước khi có một byte trang nào về tới.</strong> Khi một trang "không tải được", câu hỏi đầu tiên có ích là ô nào trong bốn ô này chưa bao giờ hoàn tất — và mỗi ô có một câu lệnh trả lời được: <code>dig</code>, <code>nc -z</code>, <code>openssl s_client</code>, <code>curl -I</code>.</p>`,
    ),

    bi(
      `<h3>🗺️ DHCP DORA as a sequence</h3>
<pre><code class="language-mermaid">graph TD
  A["1 DISCOVER<br/>client broadcasts to 255.255.255.255"] --> B["2 OFFER<br/>server: here is 192.168.1.101"]
  B --> C["3 REQUEST<br/>client broadcasts AGAIN: I accept that one"]
  C --> D["4 ACK<br/>mask + gateway + DNS + lease 7200s"]
  C --> E["other DHCP servers hear it<br/>and return their offers to the pool"]
  classDef cl fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef sv fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class A,C cl
  class B,E sv
  class D ok</code></pre>
<p>The second broadcast is the step people forget. It is not a duplicate of the first: <strong>it is addressed to every DHCP server on the segment at once</strong>, so that the servers whose offers were not accepted can put their addresses back in the pool. Without it, a network with two DHCP servers would leak addresses on every lease.</p>`,
      `<h3>🗺️ Bốn bước DORA của DHCP theo trình tự</h3>
<pre><code class="language-mermaid">graph TD
  A["1 DISCOVER<br/>máy khách quảng bá tới 255.255.255.255"] --> B["2 OFFER<br/>máy chủ: đây, 192.168.1.101"]
  B --> C["3 REQUEST<br/>máy khách quảng bá LẠI: tôi nhận cái đó"]
  C --> D["4 ACK<br/>mặt nạ + cổng ra + DNS + thuê 7200 giây"]
  C --> E["các máy chủ DHCP khác nghe thấy<br/>và trả địa chỉ của họ về kho"]
  classDef cl fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef sv fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class A,C cl
  class B,E sv
  class D ok</code></pre>
<p>Lần quảng bá thứ hai là bước người ta hay quên. Nó không phải bản sao của lần đầu: <strong>nó nói cùng lúc với mọi máy chủ DHCP trên phân đoạn</strong>, để những máy có lời mời không được nhận trả địa chỉ về lại kho. Thiếu nó thì một mạng có hai máy chủ DHCP sẽ rò rỉ địa chỉ mỗi lần cấp thuê.</p>`,
    ),

    bi(
      `<h3>🔍 Cách tự kiểm — one command per service</h3>
<p>Five services, five commands. Run them against something you own.</p>
<pre><code class="language-bash">dig +short A your-domain            # DNS: does the name resolve, and to what
dig TXT your-domain                 # DNS: how many v=spf1 records are there
curl -sI https://your-domain/       # HTTP: status, server, cache policy
nc -z -w 3 smtp.gmail.com 587       # mail: is submission reachable from here
ipconfig getpacket en0              # DHCP lease (macOS)</code></pre>
<p>A healthy run of the first two looks like this:</p>
<pre><code class="language-plaintext">198.51.100.208
"v=spf1 include:_spf.porkbun.com ~all"
"google-site-verification=..."</code></pre>
<div class="callout ok"><strong>What each result proves.</strong> One address from <code>dig +short</code> means the zone and the resolver both work. <strong>Exactly one</strong> <code>v=spf1</code> line means SPF is valid; two or more is a permanent error under RFC 7208 §3.2 — and this site currently has two, found this way. <code>curl -sI</code> returning a status line means everything from DNS through TLS to HTTP worked; no output at all means the failure is below HTTP.</div>
<div class="callout warn"><strong>What it does not prove.</strong> <code>nc -z</code> proves a TCP connection opened. It does not prove a mail server is on the other end, and it certainly does not prove you can authenticate. To go further, speak the protocol: <code>openssl s_client -starttls smtp -connect host:587</code>.</div>`,
      `<h3>🔍 Cách tự kiểm — mỗi dịch vụ một câu lệnh</h3>
<p>Năm dịch vụ, năm câu lệnh. Hãy chạy vào thứ bạn làm chủ.</p>
<pre><code class="language-bash">dig +short A ten-mien-cua-ban       # DNS: cái tên có phân giải không, và ra cái gì
dig TXT ten-mien-cua-ban            # DNS: có mấy bản ghi v=spf1
curl -sI https://ten-mien-cua-ban/  # HTTP: mã trạng thái, máy chủ, chính sách đệm
nc -z -w 3 smtp.gmail.com 587       # thư: từ đây có với tới cổng nộp thư không
ipconfig getpacket en0              # gói thuê DHCP (macOS)</code></pre>
<p>Một lần chạy khoẻ mạnh của hai lệnh đầu trông như thế này:</p>
<pre><code class="language-plaintext">198.51.100.208
"v=spf1 include:_spf.porkbun.com ~all"
"google-site-verification=..."</code></pre>
<div class="callout ok"><strong>Mỗi kết quả chứng minh điều gì.</strong> Một địa chỉ từ <code>dig +short</code> nghĩa là cả vùng DNS lẫn bộ phân giải đều chạy. <strong>Đúng một</strong> dòng <code>v=spf1</code> nghĩa là SPF hợp lệ; từ hai trở lên là lỗi vĩnh viễn theo RFC 7208 §3.2 — và trang này hiện có hai, tìm ra đúng bằng cách này. Lệnh <code>curl -sI</code> trả về một dòng trạng thái nghĩa là mọi thứ từ DNS qua TLS tới HTTP đều chạy; không ra gì cả nghĩa là chỗ hỏng nằm dưới HTTP.</div>
<div class="callout warn"><strong>Nó KHÔNG chứng minh gì.</strong> Lệnh <code>nc -z</code> chứng minh một kết nối TCP đã mở. Nó không chứng minh đầu kia là một máy chủ thư, và càng không chứng minh bạn xác thực được. Muốn đi xa hơn thì phải nói đúng giao thức: <code>openssl s_client -starttls smtp -connect host:587</code>.</div>`,
    ),

    bi(
      `<div class="pitfall co-tieu-de"><strong>Trap 1 — assuming an IP address identifies a website.</strong> <b>Symptom:</b> pointing <code>curl</code> at the IP and getting the wrong site, or a redirect, and concluding the server is misconfigured. Measured here: one IP serves three names. <b>The Host header decides</b>, and <code>--resolve</code> is how you test a specific one.</div>
<div class="pitfall co-tieu-de"><strong>Trap 2 — expecting a DNS change to take effect immediately.</strong> <b>Symptom:</b> "I updated the record, it works on my phone and not on my laptop." Resolvers hold the old answer for up to one full TTL. Flushing your own cache does not touch theirs. Lower the TTL a day before a migration, not during it.</div>
<div class="pitfall co-tieu-de"><strong>Trap 3 — concluding DNS is broken because <code>dig +trace</code> failed.</strong> <b>Symptom:</b> a trace that stops at step one with no error, measured here as 17 bytes back from the home router. <code>+trace</code> needs to query the roots directly and many resolvers forbid it. Retry with <code>@1.1.1.1</code>.</div>
<div class="pitfall co-tieu-de"><strong>Trap 4 — putting the DHCP server on a different subnet.</strong> <b>Symptom:</b> every host on the new VLAN gets a 169.254.x.x self-assigned address and nothing works, while the old VLAN is fine. DISCOVER is a broadcast and routers do not forward broadcasts; you need <code>ip helper-address</code>.</div>
<div class="pitfall co-tieu-de"><strong>Trap 5 — using FTP because "it is the file transfer protocol".</strong> <b>Symptom:</b> the login works, the directory listing hangs, and the transfer times out — the control connection succeeded and the data connection was blocked. Also, the password crossed the network in clear text. Use <code>sftp</code>, which is one SSH connection on port 22.</div>`,
      `<div class="pitfall co-tieu-de"><strong>Bẫy 1 — tưởng một địa chỉ IP định danh một trang web.</strong> <b>Triệu chứng:</b> chĩa <code>curl</code> vào địa chỉ IP rồi nhận về trang khác, hoặc nhận một lệnh chuyển hướng, rồi kết luận máy chủ cấu hình sai. Đo ở đây: một IP phục vụ ba cái tên. <b>Tiêu đề Host mới là thứ quyết định</b>, và <code>--resolve</code> là cách thử đúng một tên cụ thể.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 2 — trông chờ một thay đổi DNS có hiệu lực ngay.</strong> <b>Triệu chứng:</b> "tôi sửa bản ghi rồi, điện thoại vào được mà máy tính thì không". Các bộ phân giải giữ câu trả lời cũ tới hết một vòng TTL. Xoá bộ đệm của bạn không đụng được tới bộ đệm của họ. Hãy hạ TTL từ một ngày trước khi chuyển, chứ không phải lúc đang chuyển.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 3 — kết luận DNS hỏng vì <code>dig +trace</code> thất bại.</strong> <b>Triệu chứng:</b> một bản trace dừng ở bước một mà không có lỗi nào, đo ở đây là nhận về 17 byte từ router nhà. Lệnh <code>+trace</code> cần hỏi thẳng máy chủ gốc mà nhiều bộ phân giải cấm việc đó. Hãy thử lại với <code>@1.1.1.1</code>.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 4 — đặt máy chủ DHCP ở subnet khác.</strong> <b>Triệu chứng:</b> mọi máy trên VLAN mới nhận một địa chỉ tự gán 169.254.x.x và không làm được gì, trong khi VLAN cũ vẫn tốt. Gói DISCOVER là quảng bá mà router không chuyển tiếp quảng bá; bạn cần <code>ip helper-address</code>.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 5 — dùng FTP vì "nó là giao thức truyền tệp mà".</strong> <b>Triệu chứng:</b> đăng nhập được, liệt kê thư mục thì treo, truyền tệp thì hết giờ — kết nối điều khiển đã thành công còn kết nối dữ liệu bị chặn. Thêm nữa, mật khẩu vừa đi qua mạng ở dạng chữ thường. Hãy dùng <code>sftp</code>, một kết nối SSH duy nhất trên cổng 22.</div>`,
    ),

    bi(
      `<h3>Exercises</h3>
<p><b>E1.</b> A user reports: "the website is down". You run three commands and get: <code>dig +short site.com</code> returns an address; <code>nc -z -w 3 site.com 443</code> succeeds; <code>curl -sI https://site.com/</code> prints <code>HTTP/2 502</code>. What is broken, what is fine, and what do you do next?</p>
<div class="dap-an"><p><b>Fine:</b> DNS resolves, so the zone and the resolver work. TCP opens on 443, so routing, firewall and the listening process are all healthy. TLS completed, because curl got as far as an HTTP status line.</p>
<p><b>Broken:</b> layer 7, and specifically <em>behind</em> the front-end. <code>502 Bad Gateway</code> is a reverse proxy saying "I am alive, and the thing I proxy to is not answering me properly".</p>
<p><b>Next:</b> stop looking at the network entirely. Check whether the upstream application container is running, whether it is listening on the port the proxy expects, and what the proxy error log says. The three commands above have already ruled out every network cause, which is their whole value.</p>
<p class="ghi-chu">Contrast: a <code>504</code> would say the upstream accepted the connection and then did not answer in time — a slow application rather than a dead one.</p></div>

<p><b>E2.</b> ★ You move a site to a new server and change the A record. Some users see the new server immediately, some still see the old one four hours later, and clearing your own DNS cache changes nothing for them. Explain precisely why, and describe the procedure that would have avoided it.</p>
<div class="dap-an"><p><b>Why.</b> Every recursive resolver that asked before your change cached the old answer, and it is entitled to serve that cached answer until the TTL expires. Measured on this domain: the zone publishes a TTL of <b>300</b> seconds while a cached copy in the same minute showed <b>50</b> seconds remaining — the number counts down. If the TTL had been 14400, a resolver could legitimately serve the old address for four hours.</p>
<p><b>Why flushing your cache does nothing.</b> You flushed <em>your</em> resolver. Your users are on theirs. There is no mechanism in DNS to invalidate a cached record early — caching without an invalidation channel is the design.</p>
<p><b>The procedure.</b></p>
<ol>
<li>At least one full old-TTL before the move, lower the record TTL to 60 seconds and publish it.</li>
<li>Wait out the old TTL, so every resolver now holds the 60-second version.</li>
<li>Do the migration and change the A record. The world converges in about a minute.</li>
<li>Once it is stable, raise the TTL again — long TTLs are cheaper and more resilient.</li>
</ol>
<p><b>The general principle:</b> a TTL is a promise you already made to strangers. You cannot take it back, so shorten it before you need it, not when you need it.</p></div>

<p><b>E3.</b> ★ A laptop joins a new VLAN and reports an address of <code>169.254.13.44</code>. Nothing works. The same laptop on the old VLAN is fine, and a desktop already on the new VLAN with a static address works perfectly. Diagnose it, and name the configuration that fixes it.</p>
<div class="dap-an"><p><b>Read the address first.</b> <code>169.254.0.0/16</code> is link-local self-assignment: the host gave up on DHCP and picked an address itself. So this is not a cabling fault, not a switch-port fault, and not a routing fault — <b>the DHCP exchange never completed</b>.</p>
<p><b>What the other evidence tells you.</b> The static desktop works, so the VLAN itself carries traffic and the uplink is fine. That rules out physical and data-link problems, and leaves exactly one candidate: the DISCOVER never reached a DHCP server.</p>
<p><b>Why.</b> DISCOVER is a broadcast to 255.255.255.255. Chapter 10 established that a router does not forward broadcasts — that is the definition of a broadcast domain. The DHCP server sits on a different VLAN, so its subnet never hears the request.</p>
<p><b>The fix,</b> on the router interface serving the new VLAN:</p>
<pre><code class="language-bash">enable
configure terminal
interface GigabitEthernet0/0.20        ! the sub-interface for VLAN 20
 ip helper-address 192.168.1.10        ! unicast DHCP broadcasts to the real server
 exit
end
write memory</code></pre>
<p><code>ip helper-address</code> tells the router to convert the broadcast into a unicast aimed at the named server, and to put its own interface address in the request so the server knows which pool to allocate from. <b>That second part is why the server can serve many subnets from one place.</b></p>
<p><b>How to verify:</b> release and renew on the laptop, then confirm it now has an address in the VLAN 20 range together with a gateway and a DNS server — all four fields, not just the address.</p></div>`,
      `<h3>Bài tập</h3>
<p><b>E1.</b> Một người dùng báo: "trang web chết rồi". Bạn chạy ba lệnh và nhận được: <code>dig +short site.com</code> trả về một địa chỉ; <code>nc -z -w 3 site.com 443</code> thành công; <code>curl -sI https://site.com/</code> in ra <code>HTTP/2 502</code>. Hỏng ở đâu, còn tốt ở đâu, và bạn làm gì tiếp?</p>
<div class="dap-an"><p><b>Còn tốt:</b> DNS phân giải được, tức vùng DNS và bộ phân giải đều chạy. TCP mở được ở cổng 443, tức định tuyến, tường lửa và tiến trình đang lắng nghe đều khoẻ. TLS hoàn tất, vì curl đã đi được tới một dòng trạng thái HTTP.</p>
<p><b>Hỏng:</b> tầng 7, và cụ thể là <em>phía sau</em> lớp tiền tiêu. Mã <code>502 Bad Gateway</code> là lời của một proxy ngược nói rằng "tôi còn sống, và cái thứ tôi chuyển tiếp tới thì không trả lời tôi cho tử tế".</p>
<p><b>Tiếp theo:</b> thôi hẳn việc nhìn vào mạng. Hãy kiểm container ứng dụng phía sau có chạy không, nó có nghe đúng cổng mà proxy trông đợi không, và nhật ký lỗi của proxy nói gì. Ba lệnh ở trên đã loại trừ xong mọi nguyên nhân thuộc về mạng, và đó là toàn bộ giá trị của chúng.</p>
<p class="ghi-chu">Đối chiếu: mã <code>504</code> sẽ nói rằng phía sau đã nhận kết nối rồi không trả lời kịp — tức một ứng dụng chậm chứ không phải một ứng dụng chết.</p></div>

<p><b>E2.</b> ★ Bạn chuyển một trang sang máy chủ mới và đổi bản ghi A. Một số người thấy máy mới ngay, một số vẫn thấy máy cũ sau bốn tiếng, và việc bạn xoá bộ đệm DNS của mình không làm gì thay đổi với họ. Hãy giải thích thật chính xác vì sao, và mô tả quy trình lẽ ra đã tránh được chuyện đó.</p>
<div class="dap-an"><p><b>Vì sao.</b> Mọi bộ phân giải đệ quy từng hỏi trước lúc bạn đổi đều đã đệm câu trả lời cũ, và nó có quyền phục vụ bản đệm đó cho tới khi TTL hết. Đo trên chính tên miền này: vùng công bố TTL <b>300</b> giây trong khi một bản đệm cùng phút đó hiện còn <b>50</b> giây — con số này đang đếm ngược. Nếu TTL là 14400 thì một bộ phân giải hoàn toàn có quyền phục vụ địa chỉ cũ suốt bốn tiếng.</p>
<p><b>Vì sao xoá bộ đệm của bạn chẳng để làm gì.</b> Bạn xoá bộ phân giải <em>của bạn</em>. Người dùng của bạn đang ở bộ phân giải của họ. Trong DNS không có cơ chế nào để huỷ hiệu lực một bản ghi đã đệm sớm hơn hạn — đệm mà không có kênh huỷ hiệu lực chính là thiết kế của nó.</p>
<p><b>Quy trình đúng.</b></p>
<ol>
<li>Ít nhất một vòng TTL cũ trước khi chuyển, hạ TTL của bản ghi xuống 60 giây và công bố.</li>
<li>Chờ hết vòng TTL cũ, để mọi bộ phân giải giờ đều đang giữ bản 60 giây.</li>
<li>Chuyển máy và đổi bản ghi A. Cả thế giới hội tụ trong khoảng một phút.</li>
<li>Khi đã ổn định thì nâng TTL lên lại — TTL dài thì rẻ hơn và chịu lỗi tốt hơn.</li>
</ol>
<p><b>Nguyên tắc chung:</b> một TTL là lời hứa bạn đã trót hứa với người lạ. Bạn không rút lại được, nên hãy rút ngắn nó TRƯỚC khi cần, chứ không phải lúc đang cần.</p></div>

<p><b>E3.</b> ★ Một máy tính xách tay vào VLAN mới và báo địa chỉ <code>169.254.13.44</code>. Không làm được gì cả. Cũng máy đó ở VLAN cũ thì tốt, và một máy để bàn đã ở VLAN mới với địa chỉ tĩnh thì chạy hoàn hảo. Hãy chẩn đoán, và gọi tên cấu hình sửa được nó.</p>
<div class="dap-an"><p><b>Đọc cái địa chỉ trước đã.</b> Dải <code>169.254.0.0/16</code> là địa chỉ tự gán cục bộ đường liên kết: máy đã bỏ cuộc với DHCP và tự chọn một địa chỉ. Vậy đây không phải lỗi dây, không phải lỗi cổng switch, không phải lỗi định tuyến — <b>cuộc trao đổi DHCP chưa bao giờ hoàn tất</b>.</p>
<p><b>Bằng chứng còn lại nói gì.</b> Máy để bàn đặt tĩnh vẫn chạy, nên bản thân VLAN có chở được lưu lượng và đường lên vẫn tốt. Điều đó loại trừ các vấn đề tầng vật lý và tầng liên kết dữ liệu, chỉ còn đúng một ứng viên: gói DISCOVER không bao giờ tới được máy chủ DHCP nào.</p>
<p><b>Vì sao.</b> DISCOVER là gói quảng bá tới 255.255.255.255. Chương 10 đã nêu rằng router không chuyển tiếp quảng bá — đó chính là định nghĩa của miền quảng bá. Máy chủ DHCP nằm ở VLAN khác, nên subnet của nó không bao giờ nghe thấy lời hỏi.</p>
<p><b>Cách sửa,</b> đặt trên giao diện router phục vụ VLAN mới:</p>
<pre><code class="language-bash">enable
configure terminal
interface GigabitEthernet0/0.20        ! giao dien con cho VLAN 20
 ip helper-address 192.168.1.10        ! doi quang ba DHCP thanh unicast toi may chu that
 exit
end
write memory</code></pre>
<p>Lệnh <code>ip helper-address</code> bảo router biến gói quảng bá thành gói unicast nhắm vào máy chủ được nêu tên, và điền địa chỉ giao diện của chính nó vào yêu cầu để máy chủ biết phải cấp từ kho địa chỉ nào. <b>Chính phần thứ hai đó mới là lý do một máy chủ phục vụ được nhiều subnet từ một chỗ.</b></p>
<p><b>Nghiệm thu:</b> release rồi renew trên máy xách tay, sau đó xác nhận nó đã có địa chỉ trong dải của VLAN 20 kèm cả cổng ra và máy chủ DNS — đủ bốn trường, chứ không chỉ mỗi địa chỉ.</p></div>`,
    ),

    cq(46, [
      ['CQ16.1', 'What is the functions of the Application Layer to provide network services to end users?',
        'Tầng Ứng dụng có những chức năng gì để cung cấp dịch vụ mạng cho người dùng cuối?'],
    ]),

    bi(
      `<div class="note-ct"><h3>💬 CQ16.1 answered, and a note on the question table</h3>
<p><strong>The answer.</strong> The application layer is the only layer an end user ever meets, and it does four things.</p>
<ol>
<li><strong>It defines the vocabulary two programs share.</strong> HTTP, SMTP, DNS and DHCP are each an agreed set of messages and replies. Without that agreement, two correctly connected machines have nothing to say to each other.</li>
<li><strong>It provides the services that other services depend on.</strong> DNS turns names into addresses so nobody has to memorise 198.51.100.208; DHCP hands a joining host its address, mask, gateway and DNS server. Neither carries user data — they arrange the conditions under which user data can move.</li>
<li><strong>It expresses intent and reports outcome.</strong> A method says what the user wants (GET, POST, DELETE); a status code says what happened, and whose fault it was — 4xx the client, 5xx the server. Lower layers can only report whether bytes arrived.</li>
<li><strong>It negotiates form and continuity</strong> — which is where the presentation and session concerns live. Content type and encoding decide how the bytes are read; keep-alive, cookies and ALPN decide whether an exchange continues and in what protocol.</li>
</ol>
<p><strong>What it deliberately does not do:</strong> it does not move bytes, retransmit losses, find routes or address hosts. Those belong to layers 4, 3 and 2. That separation is exactly why one application protocol runs unchanged over Ethernet, Wi-Fi, fibre and 5G.</p>
<h3>💬 About the constructive-question table</h3>
<ul>
<li><strong>Session 45</strong> is given <strong>CQ15.3</strong>, about TCP session establishment and termination — that is <strong>Chapter 13</strong>, the Transport Layer, sessions 41–42.</li>
<li><strong>Session 46</strong> is given <strong>CQ16.1</strong>, quoted above — which fits <strong>this chapter</strong> exactly.</li>
</ul>
<p>So within one chapter you can see both the drift and its correction. The pattern was first noted at session 19 and is quoted as published, not corrected.</p></div>`,
      `<div class="note-ct"><h3>💬 Trả lời CQ16.1, và một ghi chú về bảng câu hỏi</h3>
<p><strong>Trả lời.</strong> Tầng Ứng dụng là tầng duy nhất mà người dùng cuối gặp mặt, và nó làm bốn việc.</p>
<ol>
<li><strong>Nó định nghĩa bộ từ vựng chung của hai chương trình.</strong> HTTP, SMTP, DNS và DHCP mỗi thứ là một bộ thông điệp và câu trả lời đã thoả thuận. Không có thoả thuận đó thì hai cái máy nối đúng với nhau vẫn chẳng có gì để nói với nhau.</li>
<li><strong>Nó cung cấp những dịch vụ mà các dịch vụ khác phụ thuộc vào.</strong> DNS biến tên thành địa chỉ để không ai phải nhớ 198.51.100.208; DHCP trao cho một máy vừa vào mạng địa chỉ, mặt nạ, cổng ra và máy chủ DNS. Không cái nào chở dữ liệu người dùng — chúng sắp đặt điều kiện để dữ liệu người dùng đi được.</li>
<li><strong>Nó diễn đạt ý muốn và báo lại kết quả.</strong> Phương thức nói người dùng muốn gì (GET, POST, DELETE); mã trạng thái nói việc gì đã xảy ra, và lỗi của ai — 4xx là máy khách, 5xx là máy chủ. Các tầng dưới chỉ báo được là byte có tới hay không.</li>
<li><strong>Nó thương lượng hình thức và sự liên tục</strong> — và đây là chỗ mối bận tâm của tầng trình diễn và tầng phiên nằm. Kiểu nội dung và cách mã hoá quyết định các byte được đọc ra sao; keep-alive, cookie và ALPN quyết định cuộc trao đổi có tiếp tục không và tiếp tục bằng giao thức nào.</li>
</ol>
<p><strong>Thứ nó cố ý KHÔNG làm:</strong> nó không chuyển byte, không gửi lại gói mất, không tìm tuyến, không đánh địa chỉ cho máy. Những việc ấy thuộc tầng 4, 3 và 2. Chính sự tách bạch đó là lý do một giao thức ứng dụng chạy y nguyên trên Ethernet, Wi-Fi, cáp quang và 5G.</p>
<h3>💬 Về bảng câu hỏi kiến tạo</h3>
<ul>
<li><strong>Buổi 45</strong> được gán <strong>CQ15.3</strong>, hỏi về thiết lập và kết thúc phiên TCP — đó là <strong>Chương 13</strong>, tầng Giao vận, buổi 41–42.</li>
<li><strong>Buổi 46</strong> được gán <strong>CQ16.1</strong>, trích ở trên — và nó khớp đúng <strong>chương này</strong>.</li>
</ul>
<p>Vậy là trong phạm vi một chương bạn nhìn thấy cả độ trôi lẫn chỗ nó tự chỉnh lại. Quy luật này được nêu lần đầu ở buổi 19 và ở đây được trích nguyên văn, không sửa.</p></div>`,
    ),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz ─────────────────────────────────── */

const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

const QUIZ = {
  title: 'Quiz Chapter 14 — Application Layer|||Quiz Chương 14 — Tầng ứng dụng',
  slug: 'nwc204-ch14-quiz',
  type: 'QUIZ',
  description: '12 câu song ngữ cho chương 14: ba tầng trên cùng và triệu chứng đặc trưng của từng tầng, vì sao TCP/IP gộp chúng, mạng ngang hàng so với ứng dụng ngang hàng, tiêu đề Host và việc một IP phục vụ nhiều trang, :authority của HTTP/2, 401 so với 404, cổng 587 và 993, TTL của DNS, dig +trace chết ở router nhà, bốn bước DORA và ip helper-address, bốn thứ DHCP cấp, và vì sao SFTP thay FTP. Mọi số liệu đều đo trên hạ tầng thật.',
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      q('Three names resolve to the same IP and the same port 443, yet return different sites. What distinguishes them?|||Ba cái tên phân giải về cùng một IP và cùng cổng 443, vậy mà trả về những trang khác nhau. Cái gì phân biệt chúng?',
        ['The source port of the client|||Cổng nguồn của máy khách', 'The Host header, which nginx matches against server_name|||Tiêu đề Host, thứ mà nginx đối chiếu với server_name', 'The TTL of the DNS record|||Giá trị TTL của bản ghi DNS', 'The MAC address of the client|||Địa chỉ MAC của máy khách'],
        1,
        'Nothing at layer 3 or 4 can tell the requests apart: same destination IP, same port, identical in every field those layers see. The site name travels in an application-layer header, Host in HTTP/1.1, and the server uses it to pick which virtual host answers. Measured on one real IP serving three names: the www name returned 200 and the api name returned 401 on an API path, with only the Host differing. This is also why a reverse proxy must pass proxy_set_header Host.|||Không có gì ở tầng 3 hay tầng 4 phân biệt nổi các yêu cầu đó: cùng IP đích, cùng cổng, giống hệt nhau ở mọi trường mà mấy tầng ấy nhìn thấy. Tên trang đi trong một tiêu đề của tầng ứng dụng, là Host trong HTTP/1.1, và máy chủ dùng nó để chọn máy chủ ảo nào trả lời. Đo trên một IP thật phục vụ ba tên: tên www trả 200 còn tên api trả 401 trên một đường dẫn API, chỉ khác nhau mỗi Host. Đây cũng là lý do proxy ngược bắt buộc phải chuyển tiếp proxy_set_header Host.'),

      q('Why does the TCP/IP model merge OSI layers 5, 6 and 7 into one?|||Vì sao mô hình TCP/IP gộp tầng 5, 6 và 7 của OSI thành một?',
        ['Because sessions and encoding are unimportant|||Vì phiên và mã hoá không quan trọng', 'Because no separate program lives at layer 6 or 5 — one protocol handles all three concerns|||Vì không có chương trình riêng nào sống ở tầng 6 hay 5 — một giao thức lo cả ba mối bận tâm', 'Because TCP/IP predates OSI|||Vì TCP/IP có trước OSI', 'Because they all use the same port numbers|||Vì chúng dùng chung số cổng'],
        1,
        'The three OSI layers describe three concerns: what the message means, what form the bytes are in, and whether the exchange is still open. In real protocols one program handles all three — HTTP negotiates its own encoding with Accept-Encoding and manages its own connection reuse with keep-alive. The layers remain a good diagnostic checklist; they are simply not three separate pieces of software, which is why you will never find the session layer in a packet capture.|||Ba tầng OSI mô tả ba mối bận tâm: thông điệp nghĩa là gì, các byte ở dạng nào, và cuộc trao đổi còn mở không. Trong giao thức thật thì một chương trình lo cả ba — HTTP tự thương lượng cách mã hoá bằng Accept-Encoding và tự quản việc dùng lại kết nối bằng keep-alive. Các tầng vẫn là bảng kiểm chẩn đoán tốt; chúng chỉ đơn giản không phải ba mẩu phần mềm riêng, và đó là lý do bạn sẽ không bao giờ tìm thấy tầng phiên trong một bản bắt gói.'),

      q('A page renders but every Vietnamese accent is a box. Which layer, and what do you check?|||Trang hiện ra nhưng mọi dấu tiếng Việt thành ô vuông. Tầng nào, và bạn kiểm gì?',
        ['Application — check the HTTP method|||Ứng dụng — kiểm phương thức HTTP', 'Presentation — check the charset in Content-Type|||Trình diễn — kiểm charset trong Content-Type', 'Session — check the cookie lifetime|||Phiên — kiểm thời hạn cookie', 'Network — check the routing table|||Mạng — kiểm bảng định tuyến'],
        1,
        'The bytes arrived intact; only their interpretation is wrong, which is the exact signature of a presentation-layer fault. Check whether Content-Type carries charset=utf-8 and what encoding the file is really stored in. Without a declared charset the browser must guess, and it guesses badly. Keep the three signatures apart: garbled means presentation, logged-out means session, refused means application.|||Các byte về nguyên vẹn; chỉ cách diễn giải chúng là sai, và đó đúng là dấu hiệu đặc trưng của lỗi tầng trình diễn. Hãy kiểm xem Content-Type có kèm charset=utf-8 không và tệp thật ra đang lưu ở bảng mã nào. Không khai charset thì trình duyệt phải đoán, và nó đoán dở. Hãy nhớ tách ba dấu hiệu: chữ loạn là trình diễn, bị đăng xuất là phiên, bị từ chối là ứng dụng.'),

      q('Does using a tracker make BitTorrent client-server rather than peer-to-peer?|||Việc dùng tracker có làm BitTorrent thành khách-chủ thay vì ngang hàng không?',
        ['Yes, any use of a server makes it client-server|||Có, hễ dùng máy chủ là thành khách-chủ', 'No — the tracker only does discovery; the file moves directly between peers|||Không — tracker chỉ làm việc tìm nhau; tệp đi thẳng giữa các bên', 'Yes, because the tracker stores the file|||Có, vì tracker lưu tệp', 'No, because BitTorrent has no tracker|||Không, vì BitTorrent không có tracker'],
        1,
        'Discovery and transfer are different jobs and only the transfer decides the label. A tracker tells a joining peer which peers hold the file; not one byte of the file crosses it. The contrast worth knowing is a relayed WebRTC call: when both ends sit behind restrictive NAT, media falls back to a TURN relay and then every byte really does cross a server — at that point the call genuinely is no longer peer-to-peer. The rule: ask where the DATA flows, not where the control messages flow.|||Tìm nhau và truyền dữ liệu là hai việc khác nhau, và chỉ việc truyền mới quyết định cái nhãn. Tracker cho một bên mới vào biết những bên nào đang giữ tệp; không một byte nào của tệp đi qua nó. Chỗ đối chiếu đáng biết là một cuộc gọi WebRTC bị tiếp sức: khi cả hai đầu nằm sau NAT khắt khe, tiếng và hình lùi về máy tiếp sức TURN và lúc đó mọi byte thật sự đi qua một máy chủ — ở khoảnh khắc ấy cuộc gọi đúng là không còn ngang hàng nữa. Quy tắc: hỏi DỮ LIỆU chảy ở đâu, chứ không phải các thông điệp điều khiển chảy ở đâu.'),

      q('An unauthenticated GET to /api/v1/notes returns 401, and to /api/v1/xyz returns 404. What have you learned?|||Một GET không xác thực tới /api/v1/notes trả 401, còn tới /api/v1/xyz trả 404. Bạn biết được gì?',
        ['Both routes are broken|||Cả hai tuyến đều hỏng', 'The first route is mounted and needs auth; the second is not mounted at all|||Tuyến thứ nhất đã được gắn và đang đòi xác thực; tuyến thứ hai chưa được gắn', 'The server is running an old TLS version|||Máy chủ đang chạy phiên bản TLS cũ', 'The first route requires POST|||Tuyến thứ nhất đòi phương thức POST'],
        1,
        '401 means the server found a handler and that handler demanded credentials — so the route exists in the running build. 404 means nothing matched the path at all. Right after a deploy, a 404 on a route you just added is the classic signature of a stale image: the code is on disk but the container is running the previous build. Measured today on a real API: /api/v1/notes returned 401 and a nonexistent path returned 404.|||Mã 401 nghĩa là máy chủ đã tìm thấy một bộ xử lý và bộ đó đòi thông tin đăng nhập — tức tuyến có tồn tại trong bản đang chạy. Mã 404 nghĩa là không có gì khớp đường dẫn đó cả. Ngay sau một lần deploy, một mã 404 ở tuyến bạn vừa thêm là dấu hiệu kinh điển của ảnh cũ: mã nguồn nằm trên đĩa còn container thì đang chạy bản dựng trước. Đo hôm nay trên một API thật: /api/v1/notes trả 401 còn một đường dẫn không tồn tại trả 404.'),

      q('Where did the Host header go in HTTP/2?|||Tiêu đề Host đi đâu mất trong HTTP/2?',
        ['It was removed; HTTP/2 does not need it|||Nó bị bỏ; HTTP/2 không cần nó', 'It became the pseudo-header :authority|||Nó trở thành giả-tiêu-đề :authority', 'It moved into the TLS certificate|||Nó dời vào trong chứng chỉ TLS', 'It is sent as a separate TCP segment|||Nó được gửi trong một phân đoạn TCP riêng'],
        1,
        'HTTP/2 is binary and carries four pseudo-headers: :method, :scheme, :authority and :path. :authority is Host, renamed — same job, different wire format. This matters in a packet capture: there is no readable Host: line, and concluding the header is missing would be wrong. Measured with curl -v, which shows both forms: the pseudo-headers it actually sent, and a Host: line it prints for readability.|||HTTP/2 là nhị phân và mang bốn giả-tiêu-đề: :method, :scheme, :authority và :path. Trong đó :authority chính là Host được đổi tên — cùng một việc, khác định dạng trên đường truyền. Điều này quan trọng khi bắt gói: không có dòng Host: nào đọc được, và kết luận rằng thiếu tiêu đề là sai. Đo bằng curl -v, lệnh này hiện cả hai dạng: các giả-tiêu-đề nó thật sự gửi, và một dòng Host: nó in ra cho dễ đọc.'),

      q('Why does mail submission use port 587 instead of 25?|||Vì sao việc nộp thư dùng cổng 587 chứ không phải 25?',
        ['587 is faster|||587 nhanh hơn', 'They are different activities: 25 is server-to-server relay, 587 is an authenticated user submitting mail|||Đó là hai hoạt động khác nhau: 25 là chuyển tiếp giữa các máy chủ, 587 là người dùng đã xác thực nộp thư', '25 only works with IPv6|||25 chỉ chạy với IPv6', '587 does not require TLS|||587 không cần TLS'],
        1,
        'Port 25 is relay between mail servers and accepts unauthenticated connections by design. Port 587 is submission: a human sending a message, and it requires authentication. Most consumer ISPs block outbound 25 to suppress spam, which is precisely why 587 exists. This is also why a restrictive network that permits only 80, 443, 587 and 993 outbound still lets you send and read mail — those two were chosen as the user-facing ports.|||Cổng 25 là chuyển tiếp giữa các máy chủ thư và theo thiết kế thì nhận cả kết nối không xác thực. Cổng 587 là cổng nộp thư: một con người gửi một lá thư, và nó đòi xác thực. Phần lớn nhà mạng dân dụng chặn cổng 25 đi ra để hạn chế thư rác, và đó đúng là lý do cổng 587 tồn tại. Đây cũng là lý do một mạng khắt khe chỉ mở 80, 443, 587 và 993 đi ra thì vẫn gửi và đọc thư được — hai cổng ấy được chọn làm cổng dành cho người dùng.'),

      q('dig shows TTL 50 for a record whose zone publishes 300. Why?|||dig hiện TTL 50 cho một bản ghi mà vùng của nó công bố 300. Vì sao?',
        ['The zone was misconfigured|||Vùng DNS bị cấu hình sai', 'The TTL is a countdown — 50 seconds are left of the cached copy|||TTL là một bộ đếm ngược — bản đệm còn lại 50 giây', 'The record is being deleted|||Bản ghi đang bị xoá', 'The resolver is overloaded|||Bộ phân giải đang quá tải'],
        1,
        'The authoritative answer carries the full TTL, 300 here. A recursive resolver caches it and, on each subsequent answer, reports how much of that lifetime is left. Measured on the same domain in the same minute: the cached copy showed 50 while the authoritative answer showed 300. The consequence is the practical one: after you change a record, resolvers may legitimately serve the old value for up to one full TTL, and flushing your own cache does nothing about theirs.|||Câu trả lời có thẩm quyền mang theo TTL đầy đủ, ở đây là 300. Một bộ phân giải đệ quy đệm nó lại và, ở mỗi câu trả lời sau đó, báo xem còn bao nhiêu trong khoảng sống ấy. Đo trên cùng tên miền trong cùng một phút: bản đệm hiện 50 còn câu trả lời có thẩm quyền hiện 300. Hệ quả mới là cái thực tế: sau khi bạn đổi một bản ghi, các bộ phân giải hoàn toàn có quyền phục vụ giá trị cũ tới hết một vòng TTL, và xoá bộ đệm của bạn không giải quyết được bộ đệm của họ.'),

      q('dig +trace stops after "Received 17 bytes from 192.168.1.1". What does that prove about DNS?|||dig +trace dừng lại sau dòng "Received 17 bytes from 192.168.1.1". Điều đó chứng minh gì về DNS?',
        ['DNS is completely broken|||DNS hỏng hoàn toàn', 'Almost nothing — +trace needs to query the root servers directly and the home resolver refused|||Gần như không gì cả — +trace cần hỏi thẳng máy chủ gốc mà bộ phân giải nhà từ chối', 'The domain does not exist|||Tên miền không tồn tại', 'The root servers are down|||Các máy chủ gốc đang chết'],
        1,
        'Measured both ways on the same machine. Through the home router the trace died at step one with no error text. Through 1.1.1.1 the same command walked root, then .com, then the authoritative nameservers, then the answer, in 46, 71 and 221 ms. +trace must fetch the root nameserver list and then query those servers directly; many home routers and ISP resolvers refuse that, and some block outbound DNS to anything but themselves. A tool failing at step one is not evidence about what you were investigating.|||Đo cả hai cách trên cùng một máy. Qua router nhà thì bản trace chết ở bước một mà không có dòng lỗi nào. Qua 1.1.1.1 thì cũng câu lệnh đó đi qua gốc, rồi .com, rồi các máy chủ tên có thẩm quyền, rồi tới câu trả lời, trong 46, 71 và 221 ms. Lệnh +trace phải lấy danh sách máy chủ gốc rồi hỏi thẳng vào chúng; nhiều router gia đình và bộ phân giải nhà mạng từ chối việc đó, và một số chặn mọi truy vấn DNS đi ra ngoài trừ tới chính nó. Một công cụ chết ở bước một thì không phải bằng chứng gì về cái bạn đang điều tra.'),

      q('Hosts on a new VLAN all end up with 169.254.x.x addresses. A static host on the same VLAN works. Cause?|||Mọi máy trên một VLAN mới đều nhận địa chỉ 169.254.x.x. Một máy đặt tĩnh trên cùng VLAN thì chạy. Nguyên nhân?',
        ['The switch port is faulty|||Cổng switch bị lỗi', 'The DHCP server is on another subnet and the router does not forward broadcasts|||Máy chủ DHCP nằm ở subnet khác và router không chuyển tiếp quảng bá', 'The cable is too long|||Dây mạng quá dài', 'DNS is misconfigured|||DNS cấu hình sai'],
        1,
        '169.254.0.0/16 is link-local self-assignment: the host gave up on DHCP and chose an address itself, so the DHCP exchange never completed. The working static host proves the VLAN carries traffic, which rules out physical and data-link faults. DISCOVER is a broadcast to 255.255.255.255, and a router does not forward broadcasts — that is the definition of a broadcast domain, from Chapter 10. The fix is ip helper-address on the router sub-interface, which converts the broadcast to a unicast aimed at the real server.|||Dải 169.254.0.0/16 là địa chỉ tự gán cục bộ đường liên kết: máy đã bỏ cuộc với DHCP và tự chọn một địa chỉ, tức cuộc trao đổi DHCP chưa bao giờ hoàn tất. Cái máy đặt tĩnh vẫn chạy chứng minh VLAN có chở được lưu lượng, loại trừ lỗi tầng vật lý và tầng liên kết dữ liệu. Gói DISCOVER là quảng bá tới 255.255.255.255, mà router không chuyển tiếp quảng bá — đó chính là định nghĩa của miền quảng bá, từ Chương 10. Cách sửa là đặt ip helper-address trên giao diện con của router, nó biến gói quảng bá thành unicast nhắm vào máy chủ thật.'),

      q('A host receives a DHCP address but can only reach its own subnet. What is most likely missing?|||Một máy nhận được địa chỉ DHCP nhưng chỉ tới được subnet của chính nó. Nhiều khả năng thiếu gì?',
        ['The subnet mask|||Mặt nạ mạng con', 'The default gateway option|||Tuỳ chọn cổng ra mặc định', 'The lease time|||Thời hạn thuê', 'The MAC address|||Địa chỉ MAC'],
        1,
        'DHCP hands out four things, not one: address, subnet mask, default gateway and DNS server. A real ACK packet read from a working machine showed exactly that set, with lease_time 0x1c20 = 7200 seconds. Without a gateway the host can reach everything inside its own subnet and nothing outside it, because it has nowhere to send off-subnet traffic. Without a DNS server it can reach 8.8.8.8 but no name. Both present to the user as "the Internet is broken" and both are DHCP faults.|||DHCP cấp bốn thứ chứ không phải một: địa chỉ, mặt nạ mạng con, cổng ra mặc định và máy chủ DNS. Một gói ACK thật đọc từ một máy đang chạy cho thấy đúng bộ đó, với lease_time 0x1c20 = 7200 giây. Không có cổng ra thì máy tới được mọi thứ trong subnet của nó và không tới được gì bên ngoài, vì nó không biết gửi lưu lượng ra ngoài subnet đi đâu. Không có máy chủ DNS thì nó tới được 8.8.8.8 mà không tới được cái tên nào. Với người dùng thì cả hai đều hiện ra thành "mạng hỏng rồi", và cả hai đều là lỗi DHCP.'),

      q('Why is sftp usually preferred over FTP?|||Vì sao người ta thường chuộng sftp hơn FTP?',
        ['FTP is slower|||FTP chậm hơn', 'sftp is one encrypted SSH connection on port 22; FTP uses two connections and sends the password in clear text|||sftp là một kết nối SSH có mã hoá trên cổng 22; còn FTP dùng hai kết nối và gửi mật khẩu ở dạng chữ thường', 'FTP cannot transfer binary files|||FTP không truyền được tệp nhị phân', 'sftp needs no authentication|||sftp không cần xác thực'],
        1,
        'FTP uses a control connection on 21 and a separate data connection, and in active mode the server opens that data connection back to the client — which NAT and firewalls block, because that is what they exist to do. Passive mode was invented to work around it. FTP also sends credentials unencrypted. sftp and scp ride a single SSH connection on port 22, encrypted, authenticated with keys you already have, and need exactly one firewall rule. The symptom of the FTP problem is characteristic: login succeeds, the directory listing hangs.|||FTP dùng một kết nối điều khiển ở cổng 21 và một kết nối dữ liệu riêng, và ở chế độ chủ động thì máy chủ mở kết nối dữ liệu ngược về máy khách — mà NAT và tường lửa chặn đúng việc đó, vì chúng sinh ra để làm đúng việc đó. Chế độ bị động được phát minh để lách. FTP còn gửi thông tin đăng nhập không mã hoá. sftp và scp đi trên một kết nối SSH duy nhất ở cổng 22, có mã hoá, xác thực bằng khoá bạn đã có sẵn, và chỉ cần đúng một luật tường lửa. Triệu chứng của trục trặc FTP rất đặc trưng: đăng nhập thì được, liệt kê thư mục thì treo.'),
    ],
  },
};

export default [
  {
    title: 'Chapter 14 — Application Layer (FLM sessions 45-46)|||Chương 14 — Tầng ứng dụng (buổi 45-46 của FLM)',
    slug: 'nwc204-chuong-14-tang-ung-dung',
    description: 'Cisco Module 15 theo đúng buổi 45-46 của FLM, chương giao thức cuối cùng của môn: ba tầng trên cùng của OSI và vì sao TCP/IP gộp làm một, mỗi tầng trả lời câu hỏi nào và hỏng thì triệu chứng ra sao, mô hình khách-chủ nói cho chính xác, mạng ngang hàng so với ứng dụng ngang hàng và vì sao tracker không phá tính ngang hàng; rồi cấu trúc một lượt trao đổi HTTP đọc từng dòng, phương thức và họ mã trạng thái, ba giao thức email với cổng 25/587/995/993, DNS phân giải theo cấp cùng các loại bản ghi A/AAAA/CNAME/MX/NS/TXT, bốn bước DORA của DHCP và vì sao broadcast buộc máy chủ nằm cùng subnet, FTP so với SFTP và SMB, và công cụ AI dùng đúng chỗ. Kèm phần ★ đo thật trên hạ tầng đang chạy: một IP phục vụ ba tên miền nhờ tiêu đề Host, HTTP/2 đổi Host thành :authority, 401 so với 404 để bắt bản dựng cũ, dig +trace chết ở router nhà mà chạy qua 1.1.1.1, TXT có HAI bản ghi SPF sai RFC 7208, một phiên SMTP 587 gõ tay, và một gói DHCP ACK thật với lease 7200 giây. Slide tiếng Anh do cuongthai.com dựng, giảng song ngữ.',
    lessons: [L1, L2, QUIZ],
  },
];
