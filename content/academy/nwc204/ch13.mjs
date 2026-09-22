/**
 * NWC204 · Chapter 13 — The Transport Layer (Cisco Module 14).
 * FLM buổi 41–42. LO: CLO1, CLO4, CLO9.
 *
 * ⭐ Người học ĐẶT HÀNG ĐÍCH DANH chương này — xem mục 0 của `_HOP-DONG-NWC204.md`:
 *    "để hiểu toàn bộ mạng để có thể ssh, deploy, cổng mạng trường học, và all
 *    liên quan đến cổng mạng". Đây là chương về SỐ HIỆU CỔNG.
 *
 * Slide: scripts/slides-src/nwc204-ch13.mjs → deck 'nwc204-ch13', 22 ảnh.
 *
 * ⚠️ Thứ tự slide KHÔNG theo đúng thứ tự mục của FLM: mục 13.4 Port Numbers được
 *    đẩy lên sớm (slide 5–7) vì đó là phần thực dụng nhất và là lý do người học
 *    đặt hàng chương này. Nội dung vẫn phủ đủ cả hai buổi, chỉ đổi thứ tự trình
 *    bày — đã nói rõ trong bài.
 *
 * ★ = phần cuongthai.com bổ sung, ĐO THẬT trên VPS sản xuất:
 *   - `ss -tlnp` ra ba kiểu bind trên CÙNG một máy: 0.0.0.0:3001 (cả Internet),
 *     127.0.0.1:3300 (chỉ trong máy), 172.18.0.1:8888 (chỉ mạng Docker)
 *   - `docker ps`: frontend ghi `3000/tcp` (EXPOSE, KHÔNG publish) còn backend
 *     ghi `0.0.0.0:3001->3001/tcp` (publish thật) ⇒ -p KHÁC EXPOSE
 *   - đếm trạng thái: 104 LISTEN · 7 SYN-RECV · 3 ESTAB
 *   - chuỗi `DOCKER-USER` có luật DROP bắt-tất-cả nằm TRÊN ba luật ACCEPT ⇒ ba
 *     luật dưới là mã chết. Cùng họ với bẫy thứ tự drop-in của sshd.
 *
 * ⚠️ Bất thường của bảng gốc, đã nêu trong bài, KHÔNG tự sửa:
 *   - Buổi 41 mang CQ14.2 "How to test network connectivity using ICMP?" → mục
 *     12.2, tức CHƯƠNG 12.
 *   - Buổi 42 mang CQ14.3 "...How does it works(Do lab 7)?" → cũng là mục 12.2,
 *     và cụm **"Do lab 7" KHÔNG TỒN TẠI** trong kế hoạch 60 buổi (môn chỉ có
 *     Lab 1.1–1.4 và Lab 2.1–2.3). Nêu ra, đừng đoán nó là lab nào.
 *   - Ngược lại, CQ15.1/15.2/15.3 (buổi 43–45) khớp ĐÚNG nội dung chương này
 *     nhưng buổi 43–45 lại là buổi ĐỒ ÁN. Độ trôi đảo chiều.
 *
 * ⚠️ Mỗi khối content PHẢI kết thúc bằng `].join('\n'),`.
 */
import { registerDeck, walk, walkHead, bi, cq } from './_slides.mjs';

const D = registerDeck('nwc204-ch13', {
  code: 'NWC204',
  en: 'The Transport Layer',
  vi: 'Tầng giao vận',
  total: 22,
});

/* ──────────────────────── Lesson 13.1 — session 41 ─────────────────────── */

const L1 = {
  title: '13.1 — Layer 4 and port numbers: getting data to the right program (FLM session 41)|||13.1 — Tầng 4 và số hiệu cổng: đưa dữ liệu tới đúng chương trình (buổi 41 của FLM)',
  slug: 'nwc204-13-1-tang-giao-van-va-so-hieu-cong',
  type: 'DOCUMENT',
  description: 'Buổi 41 cùng mục 13.4: vì sao IP đưa gói tới đúng MÁY còn tầng 4 mới đưa tới đúng CHƯƠNG TRÌNH, bốn việc của tầng giao vận và hai trong số đó là TUỲ CHỌN, một kết nối được nhận diện bằng BỐN con số chứ không phải một nên một cổng phục vụ được hàng nghìn khách, ba dải cổng và vì sao cổng dưới 1024 cần quyền root, bảng cổng thông dụng phải thuộc, và TCP so với UDP như một cuộc đánh đổi giữa độ trễ và độ chắc chắn chứ không phải hơn kém.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 13 · Lesson 13.1 · FLM session 41 of 60 · CLO1, CLO4, CLO9 · Cisco Module 14</span>
<h2>Getting data to the right program, not just the right machine</h2>
<p class="lead">After this lesson you can say what a port number is for, name a connection by its four identifying numbers, explain why one port serves thousands of clients at once, and choose between TCP and UDP as a trade rather than as a ranking.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 41 — "13. Transport Layer · 13.1 Transportation of Data · 13.2 TCP Overview · 13.3 UDP Overview"; và mục 13.4 Port Numbers của buổi 42</p>
<p><strong>Opening question.</strong> Your server has one public IP address. Right now it is serving a website on 443, accepting SSH on 22, and running a database that must never be reachable from outside. All three arrive at the same address, carried by the same IP protocol you learned in Chapter 7. What decides which program gets which packet — and what decides that the third one is unreachable while the first two are not?</p>
<div class="callout"><strong>⭐ Chương bạn đặt hàng.</strong> Yêu cầu nguyên văn của chủ trang web này, ghi ở mục 0 của hợp đồng môn: <em>"để hiểu toàn bộ mạng để có thể ssh, deploy, cổng mạng trường học, và all liên quan đến cổng mạng"</em>. Chương này là chương về cổng. Phần ★ vì thế dày hơn mọi chương trước, và mọi số liệu đều đo trên máy chủ thật.</div>
<div class="callout warn"><strong>Một thay đổi về thứ tự trình bày.</strong> Bảng của trường xếp <strong>13.4 Port Numbers</strong> vào buổi 42. Trang này đưa nó lên ngay bài đầu, vì mọi thứ còn lại của chương — bắt tay, tin cậy, kiểm soát luồng — đều dễ hiểu hơn khi đã biết cổng là gì. Nội dung vẫn phủ đủ cả hai buổi, chỉ đổi thứ tự.</div>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 14, đo trên máy chủ sản xuất chứ không phải trích lại.</p>`,
      `<span class="eyebrow">NWC204 · Chương 13 · Bài 13.1 · Buổi 41/60 của FLM · CLO1, CLO4, CLO9 · Cisco Module 14</span>
<h2>Đưa dữ liệu tới đúng chương trình, không chỉ tới đúng máy</h2>
<p class="lead">Học xong bài này bạn nói được số hiệu cổng dùng để làm gì, gọi tên một kết nối bằng bốn con số nhận diện của nó, giải thích được vì sao một cổng phục vụ được hàng nghìn khách cùng lúc, và chọn giữa TCP với UDP như một cuộc đánh đổi chứ không phải một bảng xếp hạng.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 41 — "13. Transport Layer · 13.1 Transportation of Data · 13.2 TCP Overview · 13.3 UDP Overview"; và mục 13.4 Port Numbers của buổi 42</p>
<p><strong>Câu hỏi mở đầu.</strong> Máy chủ của bạn có một địa chỉ IP công cộng. Ngay lúc này nó đang phục vụ một trang web ở cổng 443, nhận SSH ở cổng 22, và chạy một cơ sở dữ liệu tuyệt đối không được để bên ngoài tới được. Cả ba đều đi tới cùng một địa chỉ, do cùng một giao thức IP mà bạn đã học ở Chương 7 chuyên chở. Cái gì quyết định gói nào về tay chương trình nào — và cái gì quyết định rằng cái thứ ba không tới được trong khi hai cái đầu thì tới được?</p>
<div class="callout"><strong>⭐ Chương bạn đặt hàng.</strong> Yêu cầu nguyên văn của chủ trang web này, ghi ở mục 0 của hợp đồng môn: <em>"để hiểu toàn bộ mạng để có thể ssh, deploy, cổng mạng trường học, và all liên quan đến cổng mạng"</em>. Chương này là chương về cổng. Phần ★ vì thế dày hơn mọi chương trước, và mọi số liệu đều đo trên máy chủ thật.</div>
<div class="callout warn"><strong>Một thay đổi về thứ tự trình bày.</strong> Bảng của trường xếp <strong>13.4 Port Numbers</strong> vào buổi 42. Trang này đưa nó lên ngay bài đầu, vì mọi thứ còn lại của chương — bắt tay, tính tin cậy, kiểm soát luồng — đều dễ hiểu hơn khi đã biết cổng là gì. Nội dung vẫn phủ đủ cả hai buổi, chỉ đổi thứ tự.</div>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 14, đo trên máy chủ sản xuất chứ không phải trích lại.</p>`,
    ),

    walkHead('nwc204-ch13', 1, 9,
      'Slides 1–9 cover FLM session 41 (13.1 to 13.3) plus section 13.4 Port Numbers, brought forward.',
      'Slide 1–9 là buổi 41 của FLM (13.1 đến 13.3) cộng mục 13.4 Số hiệu cổng, được đưa lên trước.'),

    walk('nwc204-ch13', [
      [1, 'Cover — Chapter 13, The Transport Layer',
        `<p>Chapter 13 is <strong>Cisco Module 14</strong>, and FPT gives it two sessions.</p>
<ul>
<li>Session 41 — 13.1 Transportation of Data, 13.2 TCP Overview, 13.3 UDP Overview.</li>
<li>Session 42 — <strong>13.4 Port Numbers</strong>, 13.5 TCP Communication Process, 13.6 Reliability and Flow Control, 13.7 UDP Communication, 13.8 AI tools.</li>
<li>Outcomes: <strong>CLO1</strong> ("explain how layered protocols enable communication and support end-user applications"), <strong>CLO4</strong> ("explain how physical, data link, network, and transport layers interact to enable reliable and structured data communication"), CLO9.</li>
</ul>
<p>Two sessions for the layer that explains most of day-to-day server work. Everything you do when you publish a port, open a firewall, or debug a connection that refuses lives here.</p>`,
        `<p>Chương 13 là <strong>Module 14 của Cisco</strong>, và trường xếp cho nó hai buổi.</p>
<ul>
<li>Buổi 41 — 13.1 Vận chuyển dữ liệu, 13.2 Tổng quan TCP, 13.3 Tổng quan UDP.</li>
<li>Buổi 42 — <strong>13.4 Số hiệu cổng</strong>, 13.5 Quá trình giao tiếp của TCP, 13.6 Tính tin cậy và kiểm soát luồng, 13.7 Giao tiếp UDP, 13.8 công cụ AI.</li>
<li>Chuẩn đầu ra: <strong>CLO1</strong> ("giải thích cách các giao thức phân tầng cho phép truyền thông và hỗ trợ ứng dụng của người dùng cuối"), <strong>CLO4</strong> ("giải thích các tầng vật lý, liên kết dữ liệu, mạng và giao vận tương tác ra sao để có truyền thông tin cậy và có cấu trúc"), CLO9.</li>
</ul>
<p>Hai buổi cho cái tầng giải thích phần lớn công việc máy chủ hằng ngày. Mọi thứ bạn làm khi công bố một cổng, mở một luật tường lửa, hay gỡ một kết nối bị từ chối, đều nằm ở đây.</p>`],

      [2, 'Two sessions, and why this one is the useful one',
        `<p>Read CLO4 carefully: <em>"explain how physical, data link, network, and transport layers interact"</em>. It names four layers and asks how they <strong>interact</strong>. That is the shape of this chapter — not a new isolated topic, but the piece that makes the previous nine chapters add up to a working service.</p>
<p><strong>The sentence this chapter explains.</strong> "The server is up but the site is down" sounds like a contradiction and is not. Ping answers, so layers 1 to 3 work — the machine is reachable. Port 443 refuses, so layer 4 has nobody listening — nginx is stopped. Both statements are true at the same time because they are statements about different layers.</p>
<p>Chapter 12 taught you that ping never touches layer 4. This chapter is that layer.</p>`,
        `<p>Hãy đọc kỹ CLO4: <em>"giải thích các tầng vật lý, liên kết dữ liệu, mạng và giao vận tương tác ra sao"</em>. Nó gọi tên bốn tầng và hỏi chúng <strong>tương tác</strong> thế nào. Đó chính là hình dạng của chương này — không phải một chủ đề mới đứng riêng, mà là mảnh ghép làm cho chín chương trước cộng lại thành một dịch vụ chạy được.</p>
<p><strong>Câu nói mà chương này giải thích.</strong> "Máy chủ sống mà trang web chết" nghe như mâu thuẫn, mà không phải. Ping đáp, nên tầng 1 tới 3 chạy — máy tới được. Cổng 443 từ chối, nên ở tầng 4 không có ai nghe — nginx đã dừng. Cả hai câu đều đúng cùng lúc, bởi vì chúng là hai phát biểu về hai tầng khác nhau.</p>
<p>Chương 12 đã dạy rằng ping không bao giờ đụng tới tầng 4. Chương này chính là cái tầng đó.</p>`],

      [3, '13.1 What the transport layer adds',
        `<p>IP delivers a packet to an <em>address</em>. An address identifies a machine. But a machine runs many programs, and IP has no field that says which one the data is for.</p>
<p><strong>The transport layer adds that field: the port number.</strong> Sixteen bits, so 65,535 usable values per address, and that single number is what lets one server offer a hundred services at once.</p>
<p><strong>The consequence worth stating plainly.</strong> Without ports, a machine could offer exactly one service, and every website would need its own IP address. The entire shape of the modern Internet — shared hosting, reverse proxies, containers, one VPS running nine things — rests on a 16-bit number in the transport header.</p>
<p>Everything else in this chapter is also layer 4: the handshake, retransmission, flow control. They are all services the transport layer offers on top of IP's best effort.</p>`,
        `<p>IP giao một gói tới một <em>địa chỉ</em>. Một địa chỉ định danh một cái máy. Nhưng một cái máy chạy nhiều chương trình, mà IP không có trường nào nói dữ liệu này dành cho chương trình nào.</p>
<p><strong>Tầng giao vận thêm vào đúng cái trường đó: số hiệu cổng.</strong> Mười sáu bit, tức 65.535 giá trị dùng được cho mỗi địa chỉ, và đúng một con số đó là thứ cho phép một máy chủ cung cấp cả trăm dịch vụ cùng lúc.</p>
<p><strong>Hệ quả đáng nói thẳng.</strong> Không có cổng thì một cái máy chỉ cung cấp được đúng một dịch vụ, và mỗi trang web sẽ cần một địa chỉ IP riêng. Toàn bộ hình dạng của Internet hiện đại — hosting dùng chung, reverse proxy, container, một con VPS chạy chín thứ — đều dựa trên một con số 16 bit trong tiêu đề tầng giao vận.</p>
<p>Mọi thứ còn lại trong chương này cũng là tầng 4: bắt tay, gửi lại, kiểm soát luồng. Tất cả đều là dịch vụ mà tầng giao vận cung cấp thêm lên trên cái nỗ-lực-tối-đa của IP.</p>`],

      [4, '13.1 The four jobs, and which two are optional',
        `<p>The transport layer does four things, and the distinction between them matters more than the list.</p>
<ul>
<li><strong>Multiplexing</strong> — many conversations over one address, kept apart by port numbers. Both TCP and UDP do this.</li>
<li><strong>Segmentation</strong> — split a stream into pieces that fit the path MTU from Chapter 12. Both do this.</li>
<li><strong>Reliability</strong> — detect loss and retransmit. <strong>Optional.</strong></li>
<li><strong>Flow control</strong> — stop a fast sender drowning a slow receiver. <strong>Optional.</strong></li>
</ul>
<p><strong>Why "optional" is the word to notice.</strong> Layers 1 to 3 have no choice about what they do — a cable carries signal, a switch forwards frames, a router forwards packets. Layer 4 is the first layer where the <em>application</em> picks a protocol with different guarantees. Choosing TCP or UDP is a design decision, and it is the only place in the stack where a programmer makes one.</p>`,
        `<p>Tầng giao vận làm bốn việc, và chỗ phân biệt giữa chúng còn quan trọng hơn bản thân cái danh sách.</p>
<ul>
<li><strong>Ghép kênh</strong> — nhiều cuộc trò chuyện trên một địa chỉ, tách nhau bằng số hiệu cổng. Cả TCP lẫn UDP đều làm.</li>
<li><strong>Phân đoạn</strong> — cắt một dòng dữ liệu thành những mảnh vừa với path MTU của Chương 12. Cả hai đều làm.</li>
<li><strong>Tính tin cậy</strong> — phát hiện mất gói và gửi lại. <strong>Tuỳ chọn.</strong></li>
<li><strong>Kiểm soát luồng</strong> — chặn một bên gửi nhanh làm ngộp một bên nhận chậm. <strong>Tuỳ chọn.</strong></li>
</ul>
<p><strong>Vì sao "tuỳ chọn" là từ đáng để ý.</strong> Tầng 1 tới 3 không có lựa chọn nào về việc chúng làm — sợi cáp chở tín hiệu, con switch chuyển khung, con router chuyển gói. Tầng 4 là tầng đầu tiên mà <em>ứng dụng</em> được chọn một giao thức với những bảo đảm khác nhau. Chọn TCP hay UDP là một quyết định thiết kế, và đó là chỗ duy nhất trong cả chồng giao thức mà một lập trình viên phải đưa ra quyết định ấy.</p>`],

      [5, '13.4 A connection is four numbers, not one',
        `<p>Here is the fact that makes ports work at scale, and it is the one people miss.</p>
<p>A connection is not identified by a port. It is identified by a <strong>four-tuple</strong>: source IP, source port, destination IP, destination port. All four together.</p>
<p><strong>So how does one web server handle a thousand simultaneous visitors on port 443?</strong> Because each visitor's connection differs in at least one of the four numbers. Even two tabs from the <em>same</em> computer to the <em>same</em> site differ, because the operating system gives each one a different <strong>source port</strong>.</p>
<p><strong>The client's port is ephemeral.</strong> You never choose it; the kernel picks a free one from a range — on Linux, 32768 to 60999 by default, which you can read with <code>sysctl net.ipv4.ip_local_port_range</code>. That is why a client needs no configuration at all to make a connection, while a server must be told which port to listen on.</p>`,
        `<p>Đây là sự thật làm cho cổng hoạt động được ở quy mô lớn, và là chỗ người ta hay bỏ sót.</p>
<p>Một kết nối KHÔNG được định danh bằng một cái cổng. Nó được định danh bằng một <strong>bộ bốn</strong>: IP nguồn, cổng nguồn, IP đích, cổng đích. Cả bốn cùng lúc.</p>
<p><strong>Vậy làm sao một máy chủ web phục vụ được một nghìn khách cùng lúc trên cổng 443?</strong> Bởi vì kết nối của mỗi khách khác nhau ở ít nhất một trong bốn con số. Ngay cả hai tab từ <em>cùng</em> một máy tính tới <em>cùng</em> một trang web cũng khác nhau, vì hệ điều hành cấp cho mỗi tab một <strong>cổng nguồn</strong> khác.</p>
<p><strong>Cổng của phía khách là cổng tạm.</strong> Bạn không bao giờ chọn nó; nhân hệ điều hành lấy một cổng trống trong một dải — trên Linux mặc định là 32768 đến 60999, đọc được bằng <code>sysctl net.ipv4.ip_local_port_range</code>. Đó là lý do một máy khách hoàn toàn không cần cấu hình gì để mở kết nối, trong khi một máy chủ thì phải được bảo là nghe ở cổng nào.</p>`],

      [6, '13.4 The three port ranges',
        `<p>The 65,535 ports are divided into three ranges, and the first division has a real consequence.</p>
<ul>
<li><strong>0 to 1023 — well-known.</strong> Standard services. <strong>On Linux, binding one requires root</strong> (or an explicit capability).</li>
<li><strong>1024 to 49151 — registered.</strong> Vendor services: 3306 MySQL, 5432 PostgreSQL, 6379 Redis, 8080 alternate HTTP.</li>
<li><strong>49152 to 65535 — dynamic.</strong> The ephemeral range, for the client end of connections.</li>
</ul>
<p>★ <strong>The under-1024 rule is why a hardened container cannot serve port 80.</strong> Running a container as a non-root user is good practice, and the price is that the process inside is refused the bind. The standard arrangement is to listen on 8080 inside the container and publish it as 80 on the host — which is exactly what a reverse proxy in front of an application does anyway.</p>
<p class="ghi-chu">Note that Linux's actual ephemeral range starts at 32768, not 49152. The standard says one thing and the kernel does another; check rather than assume.</p>`,
        `<p>65.535 cổng được chia thành ba dải, và chỗ chia đầu tiên có một hệ quả thật.</p>
<ul>
<li><strong>0 đến 1023 — cổng thông dụng.</strong> Các dịch vụ tiêu chuẩn. <strong>Trên Linux, gắn vào một cổng loại này cần quyền root</strong> (hoặc một capability khai tường minh).</li>
<li><strong>1024 đến 49151 — cổng đã đăng ký.</strong> Dịch vụ của các hãng: 3306 MySQL, 5432 PostgreSQL, 6379 Redis, 8080 HTTP thay thế.</li>
<li><strong>49152 đến 65535 — cổng động.</strong> Dải cổng tạm, dành cho đầu khách của các kết nối.</li>
</ul>
<p>★ <strong>Quy tắc dưới-1024 là lý do một container đã siết chặt không phục vụ được cổng 80.</strong> Chạy container bằng người dùng không phải root là thói quen tốt, và cái giá là tiến trình bên trong bị từ chối khi gắn cổng. Cách bố trí tiêu chuẩn là nghe ở 8080 bên trong container rồi công bố nó thành 80 ở máy chủ — mà đó cũng đúng là việc một reverse proxy đứng trước ứng dụng vẫn làm.</p>
<p class="ghi-chu">Để ý rằng dải cổng tạm thật của Linux bắt đầu từ 32768 chứ không phải 49152. Tiêu chuẩn nói một đằng mà nhân hệ điều hành làm một nẻo; hãy kiểm chứ đừng giả định.</p>`],

      [7, '13.4 The well-known ports worth memorising',
        `<p>Six numbers cover most of what you will meet, and three of them matter for a reason that is not academic.</p>
<ul>
<li><strong>22 — SSH (TCP).</strong> How you reach a server at all.</li>
<li><strong>25 / 587 — SMTP (TCP).</strong> 25 is server-to-server; <strong>587</strong> is what a mail client uses to submit.</li>
<li><strong>53 — DNS (TCP <em>and</em> UDP).</strong> UDP for ordinary queries, TCP when the answer is too large for one packet.</li>
<li><strong>80 / 443 — HTTP / HTTPS (TCP).</strong></li>
<li><strong>67 / 68 — DHCP (UDP).</strong> Chapter 10 explained why: a host with no address yet cannot unicast.</li>
<li><strong>993 — IMAPS (TCP).</strong> Reading mail over TLS.</li>
</ul>
<p>★ <strong>Why 80, 443, 587 and 993 are worth remembering together.</strong> A campus or corporate network that permits only those four outbound lets you browse the web and use email normally, while silently blocking SSH on 22. A laptop that worked yesterday suddenly cannot reach its own server, nothing is broken, and the cause is a filter on a number. The fix is to have the server listen on a permitted port as well; the diagnosis is this list.</p>`,
        `<p>Sáu con số phủ gần hết những gì bạn sẽ gặp, và ba trong số đó quan trọng vì một lý do không hề hàn lâm.</p>
<ul>
<li><strong>22 — SSH (TCP).</strong> Cách bạn vào được máy chủ, nói chung.</li>
<li><strong>25 / 587 — SMTP (TCP).</strong> 25 là giữa máy chủ với máy chủ; <strong>587</strong> là cổng mà phần mềm thư của người dùng dùng để gửi đi.</li>
<li><strong>53 — DNS (cả TCP <em>và</em> UDP).</strong> UDP cho truy vấn thường, TCP khi câu trả lời quá lớn so với một gói.</li>
<li><strong>80 / 443 — HTTP / HTTPS (TCP).</strong></li>
<li><strong>67 / 68 — DHCP (UDP).</strong> Chương 10 đã giải thích vì sao: một host chưa có địa chỉ thì không unicast được.</li>
<li><strong>993 — IMAPS (TCP).</strong> Đọc thư qua TLS.</li>
</ul>
<p>★ <strong>Vì sao 80, 443, 587 và 993 đáng nhớ chung một chỗ.</strong> Một mạng trường học hay công ty chỉ cho bốn cổng đó đi ra sẽ cho bạn duyệt web và dùng thư bình thường, trong khi lặng lẽ chặn SSH ở cổng 22. Một cái laptop hôm qua còn chạy bỗng không vào được máy chủ của chính mình, không có gì hỏng cả, và nguyên nhân là một bộ lọc theo con số. Cách sửa là cho máy chủ nghe thêm ở một cổng được phép; còn cách chẩn đoán chính là cái danh sách này.</p>`],

      [8, '13.2 and 13.3 — TCP and UDP side by side',
        `<p>The comparison is usually taught as a ranking, and it is not one. Both protocols trade the same two things in opposite directions.</p>
<p><strong>TCP</strong> sets up a connection before sending, numbers every byte, retransmits what is lost, delivers in order, and slows down when the receiver or the network says so. Header: 20 bytes minimum.</p>
<p><strong>UDP</strong> sends immediately, numbers nothing, retransmits nothing, delivers whatever arrives in whatever order, and never slows down on its own. Header: 8 bytes.</p>
<p><strong>The trade is latency against certainty.</strong> A file transfer must be perfect and can afford to wait, so TCP. A voice packet that arrives 200 ms late is worse than useless — the conversation has moved on — so UDP. Retransmitting late audio would actively make the call worse, and that is the whole argument.</p>
<p>The right question is never "which is better" but "what does this application lose if a packet is lost, and what does it lose if it waits".</p>`,
        `<p>Phép so sánh này thường được dạy như một bảng xếp hạng, mà nó không phải. Cả hai giao thức đánh đổi cùng hai thứ, theo hai chiều ngược nhau.</p>
<p><strong>TCP</strong> thiết lập kết nối trước khi gửi, đánh số từng byte, gửi lại thứ bị mất, giao đúng thứ tự, và chậm lại khi bên nhận hoặc mạng bảo thế. Tiêu đề: tối thiểu 20 byte.</p>
<p><strong>UDP</strong> gửi ngay, không đánh số gì, không gửi lại gì, giao bất cứ thứ gì tới nơi theo bất cứ thứ tự nào, và không bao giờ tự chậm lại. Tiêu đề: 8 byte.</p>
<p><strong>Cuộc đánh đổi là độ trễ lấy độ chắc chắn.</strong> Một cú truyền file phải hoàn hảo và chờ được, nên dùng TCP. Một gói thoại tới trễ 200 ms thì còn tệ hơn vô dụng — cuộc nói chuyện đã đi tiếp rồi — nên dùng UDP. Gửi lại đoạn âm thanh đã trễ sẽ làm cuộc gọi tệ đi chứ không tốt lên, và đó là toàn bộ lập luận.</p>
<p>Câu hỏi đúng không bao giờ là "cái nào tốt hơn" mà là "ứng dụng này mất gì nếu một gói bị mất, và mất gì nếu nó phải chờ".</p>`],

      [9, '13.2 The TCP header — the fields that do the work',
        `<p>Five fields carry almost all the meaning.</p>
<ul>
<li><strong>Source and destination port</strong> — two of the four numbers that name the connection.</li>
<li><strong>Sequence number</strong> — the byte number of the first byte in this segment. This is how order is restored after packets arrive out of order.</li>
<li><strong>Acknowledgement number</strong> — "I have everything up to here." This is how loss is detected.</li>
<li><strong>Flags</strong> — SYN opens, FIN closes politely, <strong>RST</strong> closes abruptly, ACK confirms.</li>
<li><strong>Window</strong> — how much buffer the receiver still has. This is flow control.</li>
</ul>
<p>★ <strong>RST is the flag you meet every day as "connection refused".</strong> When nothing is listening on a port, the kernel does not leave you hanging — it answers immediately with RST. So <strong>refused is fast and means "the packet reached the machine and nobody was home"</strong>, while <strong>a timeout is slow and means "something silently ate the packet"</strong>, which is almost always a firewall. That one distinction resolves a large share of connection problems, and it is the subject of a ★ slide later in this chapter.</p>`,
        `<p>Năm trường mang gần như toàn bộ ý nghĩa.</p>
<ul>
<li><strong>Cổng nguồn và cổng đích</strong> — hai trong bốn con số đặt tên cho kết nối.</li>
<li><strong>Số thứ tự (sequence)</strong> — số byte của byte đầu tiên trong đoạn này. Đây là cách thứ tự được khôi phục sau khi các gói tới nơi lộn xộn.</li>
<li><strong>Số báo nhận (acknowledgement)</strong> — "tôi đã có đủ tới đây". Đây là cách mất gói được phát hiện.</li>
<li><strong>Các cờ</strong> — SYN mở, FIN đóng một cách lịch sự, <strong>RST</strong> đóng phũ phàng, ACK xác nhận.</li>
<li><strong>Cửa sổ (window)</strong> — bên nhận còn bao nhiêu bộ đệm. Đây là kiểm soát luồng.</li>
</ul>
<p>★ <strong>RST là cái cờ bạn gặp hằng ngày dưới cái tên "connection refused".</strong> Khi không có gì nghe ở một cổng, nhân hệ điều hành không để bạn treo — nó đáp lại ngay lập tức bằng RST. Vậy nên <strong>"bị từ chối" thì nhanh và có nghĩa "gói đã tới được máy và không có ai ở nhà"</strong>, còn <strong>"hết giờ" thì chậm và có nghĩa "có thứ gì đó đã lặng lẽ nuốt mất gói"</strong>, mà thứ đó gần như luôn là một tường lửa. Đúng một chỗ phân biệt ấy giải quyết một phần lớn các sự cố kết nối, và nó là chủ đề của một slide ★ ở phần sau chương này.</p>`],
    ]),

    bi(
      `<h3>🗺️ Which layer is the fault on</h3>
<pre><code class="language-mermaid">graph TD
  A["A service cannot be reached"] --> B{"Does ping answer?"}
  B -->|"no"| C["Layers 1-3<br/>Chapters 7 to 12 — or ICMP is filtered"]
  B -->|"yes"| D{"Connect to the port:<br/>refused or timeout?"}
  D -->|"refused, instantly"| E["Reached the machine, RST came back<br/>NOTHING IS LISTENING — start the service"]
  D -->|"timeout, slow"| F["A filter ate the packet<br/>look at the firewall, not the service"]
  D -->|"connects"| G["Layer 4 is fine<br/>the fault is layer 7 — the application"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class B,D ask
  class A,C,F act
  class E,G ok</code></pre>
<p>The middle branch is this chapter's contribution to troubleshooting, and it is worth more than it looks. <strong>Refused and timeout are not two words for failure — they are two different diagnoses</strong>, and they point at different halves of the problem. People restart perfectly healthy services because they did not read which one they got.</p>`,
      `<h3>🗺️ Cái hỏng nằm ở tầng nào</h3>
<pre><code class="language-mermaid">graph TD
  A["Một dịch vụ không tới được"] --> B{"Ping có đáp không?"}
  B -->|"không"| C["Tầng 1-3<br/>Chương 7 tới 12 — hoặc ICMP bị lọc"]
  B -->|"có"| D{"Nối vào cổng đó:<br/>bị từ chối hay hết giờ?"}
  D -->|"từ chối, ngay lập tức"| E["Đã tới máy, có RST trả về<br/>KHÔNG CÓ AI NGHE — hãy khởi động dịch vụ"]
  D -->|"hết giờ, chậm"| F["Một bộ lọc đã nuốt gói<br/>nhìn tường lửa, đừng nhìn dịch vụ"]
  D -->|"nối được"| G["Tầng 4 ổn<br/>cái hỏng ở tầng 7 — chính ứng dụng"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class B,D ask
  class A,C,F act
  class E,G ok</code></pre>
<p>Nhánh ở giữa là phần đóng góp của chương này cho việc gỡ lỗi, và nó đáng giá hơn vẻ ngoài. <strong>"Từ chối" và "hết giờ" không phải hai cách nói về cùng một cái hỏng — chúng là hai chẩn đoán khác nhau</strong>, và chúng chỉ vào hai nửa khác nhau của vấn đề. Người ta khởi động lại những dịch vụ hoàn toàn khoẻ mạnh chỉ vì không đọc xem mình nhận được cái nào.</p>`,
    ),

    bi(
      `<h3>🔍 Cách tự kiểm — measure it on a machine you own</h3>
<pre><code class="language-bash">ss -tlnp                                  # what is listening, and on which address
sysctl net.ipv4.ip_local_port_range       # your kernel's real ephemeral range
ss -tan | awk 'NR>1{print $1}' | sort | uniq -c | sort -rn
nc -vz localhost 443                      # refused or connected — read which
nc -vz localhost 9999                     # a port with nothing on it, for contrast</code></pre>
<p>Real output from a production VPS, trimmed:</p>
<pre><code class="language-plaintext">LISTEN  0.0.0.0:3001       docker-proxy     # the whole Internet
LISTEN  127.0.0.1:3300     docker-proxy     # this machine only
LISTEN  172.18.0.1:8888    docker-proxy     # Docker bridge only

    104 LISTEN
      7 SYN-RECV
      3 ESTAB</code></pre>
<div class="callout ok"><strong>What each result means.</strong> The three LISTEN lines have the same <em>kind</em> of port and three completely different exposures — read the address, not just the number. <code>SYN-RECV</code> in small numbers is background noise from scanners that never finish the handshake; thousands of them would be a SYN flood. And the two <code>nc</code> commands give you the refused-versus-timeout contrast on your own machine in four seconds.</div>`,
      `<h3>🔍 Cách tự kiểm — đo trên một cái máy của bạn</h3>
<pre><code class="language-bash">ss -tlnp                                  # cái gì đang nghe, và nghe ở địa chỉ nào
sysctl net.ipv4.ip_local_port_range       # dải cổng tạm THẬT của nhân hệ điều hành
ss -tan | awk 'NR>1{print $1}' | sort | uniq -c | sort -rn
nc -vz localhost 443                      # bị từ chối hay nối được — đọc xem cái nào
nc -vz localhost 9999                     # một cổng không có gì, để đối chiếu</code></pre>
<p>Kết xuất thật từ một VPS sản xuất, đã cắt bớt:</p>
<pre><code class="language-plaintext">LISTEN  0.0.0.0:3001       docker-proxy     # cả Internet
LISTEN  127.0.0.1:3300     docker-proxy     # chỉ máy này
LISTEN  172.18.0.1:8888    docker-proxy     # chỉ cầu Docker

    104 LISTEN
      7 SYN-RECV
      3 ESTAB</code></pre>
<div class="callout ok"><strong>Mỗi kết quả nghĩa là gì.</strong> Ba dòng LISTEN có cùng một <em>loại</em> cổng mà ba mức phơi bày hoàn toàn khác nhau — hãy đọc địa chỉ, đừng chỉ đọc con số. <code>SYN-RECV</code> với số lượng nhỏ là tiếng ồn nền từ các máy quét không bao giờ hoàn tất bắt tay; hàng nghìn cái mới là một đợt SYN flood. Và hai câu lệnh <code>nc</code> cho bạn thấy khác biệt giữa "bị từ chối" và "hết giờ" ngay trên máy mình, trong bốn giây.</div>`,
    ),

    bi(
      `<div class="pitfall co-tieu-de"><strong>Trap 1 — saying "port 3001 is open".</strong> The sentence has dropped the part that mattered. <code>0.0.0.0:3001</code> is reachable from the Internet; <code>127.0.0.1:3001</code> is reachable from nowhere but the machine itself. <b>Symptom:</b> a security review that misses the one service that really was exposed.</div>
<div class="pitfall co-tieu-de"><strong>Trap 2 — treating refused and timeout as the same failure.</strong> <b>Symptom:</b> restarting a service that was never the problem. Refused means the packet arrived and nothing was listening; timeout means a filter dropped it. Different halves of the stack, different fixes.</div>
<div class="pitfall co-tieu-de"><strong>Trap 3 — thinking a port can only serve one client.</strong> A connection is four numbers, not one. <b>Symptom:</b> the belief that a busy server needs many ports, and confusion about why <code>ss</code> shows hundreds of connections to 443.</div>
<div class="pitfall co-tieu-de"><strong>Trap 4 — "UDP is unreliable, so it is worse".</strong> DNS, DHCP and every voice call choose it deliberately. <b>Symptom:</b> an exam answer that ranks the protocols instead of naming the trade, and a design that puts TCP where latency mattered more than certainty.</div>
<div class="pitfall co-tieu-de"><strong>Trap 5 — assuming the ephemeral range starts at 49152.</strong> The standard says so; Linux uses 32768–60999. <b>Symptom:</b> a firewall rule that allows the wrong range and silently blocks half your outbound connections.</div>`,
      `<div class="pitfall co-tieu-de"><strong>Bẫy 1 — nói "cổng 3001 đang mở".</strong> Câu nói ấy đã đánh rơi mất phần quan trọng. <code>0.0.0.0:3001</code> thì cả Internet tới được; <code>127.0.0.1:3001</code> thì không đâu tới được ngoài chính cái máy đó. <b>Triệu chứng:</b> một đợt rà soát an ninh bỏ sót đúng cái dịch vụ thật sự bị phơi ra.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 2 — coi "từ chối" và "hết giờ" là cùng một cái hỏng.</strong> <b>Triệu chứng:</b> khởi động lại một dịch vụ vốn chưa bao giờ là vấn đề. Từ chối nghĩa là gói đã tới nơi và không có ai nghe; hết giờ nghĩa là một bộ lọc đã vứt nó. Hai nửa khác nhau của chồng giao thức, hai cách sửa khác nhau.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 3 — tưởng một cổng chỉ phục vụ được một khách.</strong> Một kết nối là bốn con số, không phải một. <b>Triệu chứng:</b> niềm tin rằng máy chủ bận thì cần nhiều cổng, và bối rối không hiểu vì sao <code>ss</code> hiện ra hàng trăm kết nối tới 443.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 4 — "UDP không tin cậy nên nó tệ hơn".</strong> DNS, DHCP và mọi cuộc gọi thoại đều chọn nó một cách có chủ ý. <b>Triệu chứng:</b> một câu trả lời thi xếp hạng hai giao thức thay vì gọi tên cuộc đánh đổi, và một thiết kế đặt TCP vào chỗ mà độ trễ quan trọng hơn độ chắc chắn.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 5 — mặc định dải cổng tạm bắt đầu từ 49152.</strong> Tiêu chuẩn nói vậy; Linux dùng 32768–60999. <b>Triệu chứng:</b> một luật tường lửa cho phép sai dải và lặng lẽ chặn mất một nửa số kết nối đi ra của bạn.</div>`,
    ),

    bi(
      `<h3>Exercises</h3>
<p><b>E1.</b> A server shows these three lines. For each, say who can reach it and what would have to change for that to be different.</p>
<pre><code class="language-plaintext">LISTEN  0.0.0.0:3001
LISTEN  127.0.0.1:3300
LISTEN  172.18.0.1:8888</code></pre>
<div class="dap-an"><ul>
<li><b>0.0.0.0:3001</b> — every interface, so <b>anyone who can route to this machine</b>, which on a public VPS means the whole Internet. The only thing standing between this port and the world is a firewall. To narrow it, bind to a specific address instead, or publish it as <code>127.0.0.1:3001</code> in Docker.</li>
<li><b>127.0.0.1:3300</b> — <b>only processes on this machine.</b> A remote client cannot reach it no matter what the firewall says, because no packet from outside can have 127.0.0.1 as a destination. To expose it you would have to change the bind address, not the firewall.</li>
<li><b>172.18.0.1:8888</b> — only whatever can route to that Docker bridge, i.e. <b>containers on that network</b>, plus the host itself. From Chapter 10: 172.18.0.0/16 is RFC 1918 space that no Internet router carries.</li>
</ul>
<p>The general point: <b>two of these three are scoped by the ADDRESS, not by a rule.</b> Scoping by address cannot be accidentally deleted the way a firewall rule can, which is why it is the stronger control.</p></div>

<p><b>E2.</b> You run <code>nc -vz server 5432</code> from your laptop. Compare what you should conclude from each of these two results, and give your next command in each case.</p>
<pre><code class="language-plaintext">A)  nc: connect to server port 5432 (tcp) failed: Connection refused
B)  nc: connect to server port 5432 (tcp) failed: Operation timed out</code></pre>
<div class="dap-an"><p><b>A) Refused, and it came back instantly.</b> Your packet <b>reached the machine</b>. Routing works, no firewall dropped it, the host is up and its IP stack answered. The kernel sent an RST because nothing was listening on 5432 — or because it was listening on <code>127.0.0.1</code> only, which from your laptop looks identical.</p>
<p><b>Next command:</b> on the server, <code>ss -tlnp | grep 5432</code>. Either nothing is there (start the service) or it is bound to 127.0.0.1 (change the bind address).</p>
<p><b>B) Timeout, and it took many seconds.</b> Your packet got <b>no answer at all</b>. Something dropped it silently — a firewall on the server, a security group at the provider, or a filter on your own network. The service may be running perfectly.</p>
<p><b>Next command:</b> from the server itself, <code>nc -vz localhost 5432</code>. If that connects, the service is fine and the fault is purely filtering — go and read the firewall rules.</p>
<p class="ghi-chu">The reason this matters: result A rules out the entire network path, and result B rules out nothing about the service. Reading which one you got saves the wrong half of the investigation.</p></div>

<p><b>E3.</b> Choose TCP or UDP for each, and defend the choice in one sentence: (a) transferring a 2 GB database backup; (b) a live video call; (c) a DNS lookup; (d) collecting log lines from 500 servers into one collector.</p>
<div class="dap-an"><ul>
<li><b>(a) TCP.</b> A backup with one corrupted byte is worthless, and nobody cares whether it finishes in 40 seconds or 44. Certainty is free here and loss is fatal.</li>
<li><b>(b) UDP.</b> A video frame that arrives late cannot be shown — the call has moved on — so retransmitting it wastes bandwidth and adds delay to the frames that still matter.</li>
<li><b>(c) UDP.</b> The query and answer are one small packet each; a TCP handshake would cost a round trip <em>before</em> the question is even asked, to protect data that is cheap to simply ask for again. DNS falls back to TCP only when the answer is too large for one packet.</li>
<li><b>(d) Either, and the choice reveals what you value.</b> Syslog traditionally uses UDP because losing a few lines under load is better than letting the logging system slow the application down. If the logs are for audit or billing, use TCP — there, a missing line is the failure.</li>
</ul>
<p>The point of (d) is that <b>the same workload can justify either protocol</b> depending on what a lost packet costs. That is why the question is never "which is better".</p></div>`,
      `<h3>Bài tập</h3>
<p><b>E1.</b> Một máy chủ hiện ba dòng sau. Với mỗi dòng, hãy nói ai tới được nó và phải đổi gì thì điều đó mới khác đi.</p>
<pre><code class="language-plaintext">LISTEN  0.0.0.0:3001
LISTEN  127.0.0.1:3300
LISTEN  172.18.0.1:8888</code></pre>
<div class="dap-an"><ul>
<li><b>0.0.0.0:3001</b> — mọi cổng mạng, nên <b>bất kỳ ai định tuyến tới được máy này</b>, mà trên một VPS công cộng thì nghĩa là cả Internet. Thứ duy nhất đứng giữa cổng này và thế giới là một tường lửa. Muốn thu hẹp thì gắn vào một địa chỉ cụ thể, hoặc công bố nó thành <code>127.0.0.1:3001</code> trong Docker.</li>
<li><b>127.0.0.1:3300</b> — <b>chỉ các tiến trình trên chính máy này.</b> Một máy khách ở xa không tới được bất kể tường lửa nói gì, bởi vì không gói nào từ bên ngoài có thể mang đích là 127.0.0.1. Muốn phơi nó ra thì phải đổi địa chỉ gắn, chứ không phải đổi tường lửa.</li>
<li><b>172.18.0.1:8888</b> — chỉ những gì định tuyến tới được cái cầu Docker đó, tức <b>các container trên mạng ấy</b>, cộng với chính máy chủ. Theo Chương 10: 172.18.0.0/16 là không gian RFC 1918 mà không router Internet nào mang.</li>
</ul>
<p>Ý chung: <b>hai trong ba cái này được thu hẹp bằng ĐỊA CHỈ, không phải bằng một luật.</b> Thu hẹp bằng địa chỉ thì không thể bị xoá nhầm theo cách một luật tường lửa có thể bị xoá, và đó là lý do nó là biện pháp mạnh hơn.</p></div>

<p><b>E2.</b> Bạn chạy <code>nc -vz server 5432</code> từ laptop. Hãy so sánh xem nên kết luận gì từ mỗi kết quả sau, và câu lệnh kế tiếp của bạn trong từng trường hợp.</p>
<pre><code class="language-plaintext">A)  nc: connect to server port 5432 (tcp) failed: Connection refused
B)  nc: connect to server port 5432 (tcp) failed: Operation timed out</code></pre>
<div class="dap-an"><p><b>A) Bị từ chối, và nó về ngay lập tức.</b> Gói của bạn <b>đã tới được máy</b>. Định tuyến chạy, không tường lửa nào vứt nó, máy đang bật và ngăn xếp IP của nó đã trả lời. Nhân hệ điều hành gửi RST vì không có gì nghe ở 5432 — hoặc vì nó chỉ nghe ở <code>127.0.0.1</code>, mà nhìn từ laptop thì hai chuyện đó giống hệt nhau.</p>
<p><b>Câu lệnh kế tiếp:</b> trên máy chủ, chạy <code>ss -tlnp | grep 5432</code>. Hoặc là không có gì ở đó (hãy khởi động dịch vụ), hoặc nó đang gắn vào 127.0.0.1 (hãy đổi địa chỉ gắn).</p>
<p><b>B) Hết giờ, và nó mất nhiều giây.</b> Gói của bạn <b>hoàn toàn không nhận được câu trả lời</b>. Có thứ gì đó đã lặng lẽ vứt nó — một tường lửa trên máy chủ, một security group ở nhà cung cấp, hoặc một bộ lọc trên chính mạng của bạn. Dịch vụ có thể đang chạy hoàn hảo.</p>
<p><b>Câu lệnh kế tiếp:</b> từ chính máy chủ, chạy <code>nc -vz localhost 5432</code>. Nếu cái đó nối được thì dịch vụ ổn và cái hỏng thuần tuý là chuyện lọc — hãy đi đọc luật tường lửa.</p>
<p class="ghi-chu">Vì sao chuyện này quan trọng: kết quả A loại trừ toàn bộ đường mạng, còn kết quả B không loại trừ được gì về dịch vụ. Đọc xem mình nhận được cái nào là tiết kiệm được đúng nửa cuộc điều tra không cần làm.</p></div>

<p><b>E3.</b> Chọn TCP hay UDP cho từng trường hợp, và biện hộ bằng một câu: (a) truyền một bản sao lưu cơ sở dữ liệu 2 GB; (b) một cuộc gọi video trực tiếp; (c) một lần tra cứu DNS; (d) gom dòng log từ 500 máy chủ về một chỗ.</p>
<div class="dap-an"><ul>
<li><b>(a) TCP.</b> Một bản sao lưu sai một byte là vô giá trị, và không ai quan tâm nó xong trong 40 giây hay 44 giây. Ở đây độ chắc chắn gần như miễn phí còn mất gói thì chí mạng.</li>
<li><b>(b) UDP.</b> Một khung hình tới trễ thì không hiển thị được nữa — cuộc gọi đã đi tiếp — nên gửi lại nó vừa phí băng thông vừa làm trễ thêm những khung hình còn có ý nghĩa.</li>
<li><b>(c) UDP.</b> Câu hỏi và câu trả lời mỗi cái một gói nhỏ; một cú bắt tay TCP sẽ tốn một vòng khứ hồi <em>trước khi</em> câu hỏi kịp được hỏi, để bảo vệ một thứ dữ liệu mà hỏi lại thì rẻ. DNS chỉ lùi về TCP khi câu trả lời quá lớn so với một gói.</li>
<li><b>(d) Cái nào cũng được, và lựa chọn của bạn để lộ bạn coi trọng cái gì.</b> Syslog theo truyền thống dùng UDP vì mất vài dòng lúc tải cao còn hơn để hệ thống ghi log làm chậm ứng dụng. Nếu log dùng để kiểm toán hay tính tiền thì dùng TCP — ở đó, một dòng bị mất chính là cái hỏng.</li>
</ul>
<p>Điểm đáng nói của câu (d) là <b>cùng một loại công việc vẫn biện hộ được cho cả hai giao thức</b>, tuỳ vào chuyện mất một gói tốn cái gì. Đó là lý do câu hỏi không bao giờ là "cái nào tốt hơn".</p></div>`,
    ),

    cq(41, [
      ['CQ14.2', 'How to test network connectivity using ICMP? <em>— content belongs to Chapter 12; answered in full in Lesson 12.2 (the five-step ping ladder, reading TTL and jitter, traceroute via the TTL trick, and what a failed ping does and does not prove).</em>',
        'How to test network connectivity using ICMP? <em>— nội dung thuộc Chương 12; đã trả lời đầy đủ ở bài 12.2 (thang ping năm bậc, đọc TTL và độ giật, traceroute bằng mẹo TTL, và một cú ping hỏng chứng minh được gì và không chứng minh được gì).</em>'],
    ]),
  ].join('\n'),
};

/* ──────────────────────── Lesson 13.2 — session 42 ─────────────────────── */

const L2 = {
  title: '13.2 — Handshake, reliability, UDP, and reading a real server (FLM session 42)|||13.2 — Bắt tay, tính tin cậy, UDP, và đọc một máy chủ thật (buổi 42 của FLM)',
  slug: 'nwc204-13-2-bat-tay-tin-cay-va-doc-may-chu-that',
  type: 'DOCUMENT',
  description: 'Buổi 42: vì sao bắt tay cần BA thông điệp chứ không phải hai và đóng cần BỐN, tính tin cậy dựng từ việc lặp lại một lời khẳng định chứ không phải từ thông báo lỗi, cửa sổ trượt và chỗ phân biệt với kiểm soát tắc nghẽn, UDP và vì sao DNS chọn nó một cách có chủ ý, công cụ AI. Kèm phần ★ đo trên máy chủ thật: ba kiểu bind, -p khác EXPOSE, đếm trạng thái kết nối, trình tự chẩn đoán một kết nối bị từ chối, và một chuỗi luật tường lửa mà thứ tự làm cho một nửa số luật thành mã chết.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 13 · Lesson 13.2 · FLM session 42 of 60 · CLO1, CLO4, CLO9 · Cisco Module 14</span>
<h2>How a connection is built, kept honest, and read off a running machine</h2>
<p class="lead">After this lesson you can explain why the handshake needs exactly three messages, describe how TCP detects loss without anyone ever sending an error, tell flow control apart from congestion control, and read <code>ss -tlnp</code> on a server and say what every line exposes and to whom.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 42 — "13.4 Port Numbers · 13.5 TCP Communication Process · 13.6 Reliability and Flow Control . 13.7 UDP Communication · 13.8 Integrate AI Tools for Explaining Concepts (Self Learning)"</p>
<p><strong>Opening question.</strong> A colleague reports that a service is down. You run one command from your laptop and get <code>Connection refused</code>, instantly. A second colleague runs the same command from a different network and waits nine seconds for <code>Operation timed out</code>. Both of you tried the same port on the same server at the same moment. Neither of you is wrong. What is the difference telling you, and which of you learned more?</p>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 14, đo trên máy chủ sản xuất.</p>`,
      `<span class="eyebrow">NWC204 · Chương 13 · Bài 13.2 · Buổi 42/60 của FLM · CLO1, CLO4, CLO9 · Cisco Module 14</span>
<h2>Một kết nối được dựng lên, giữ cho trung thực, và đọc ra từ một cái máy đang chạy</h2>
<p class="lead">Học xong bài này bạn giải thích được vì sao bắt tay cần đúng ba thông điệp, mô tả được TCP phát hiện mất gói ra sao mà không ai từng gửi một thông báo lỗi nào, phân biệt được kiểm soát luồng với kiểm soát tắc nghẽn, và đọc <code>ss -tlnp</code> trên một máy chủ rồi nói được mỗi dòng phơi ra cái gì cho ai.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 42 — "13.4 Port Numbers · 13.5 TCP Communication Process · 13.6 Reliability and Flow Control . 13.7 UDP Communication · 13.8 Integrate AI Tools for Explaining Concepts (Self Learning)"</p>
<p><strong>Câu hỏi mở đầu.</strong> Một đồng nghiệp báo rằng một dịch vụ đã chết. Bạn chạy một câu lệnh từ laptop và nhận <code>Connection refused</code> ngay lập tức. Một đồng nghiệp thứ hai chạy đúng câu lệnh đó từ một mạng khác và chờ chín giây để nhận <code>Operation timed out</code>. Cả hai cùng thử một cổng, trên cùng một máy chủ, vào cùng một thời điểm. Không ai sai cả. Sự khác biệt đó đang nói cho bạn điều gì, và trong hai người thì ai vừa học được nhiều hơn?</p>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 14, đo trên máy chủ sản xuất.</p>`,
    ),

    walkHead('nwc204-ch13', 10, 22,
      'Slides 10–22 cover FLM session 42: 13.5 the TCP process, 13.6 reliability and flow control, 13.7 UDP, 13.8 AI tools, plus the ★ material measured on a real server.',
      'Slide 10–22 là buổi 42 của FLM: 13.5 quá trình TCP, 13.6 tính tin cậy và kiểm soát luồng, 13.7 UDP, 13.8 công cụ AI, kèm phần ★ đo trên máy chủ thật.'),

    walk('nwc204-ch13', [
      [10, '13.5 The three-way handshake',
        `<p>Before TCP sends any data it exchanges three messages, and the number three is not arbitrary.</p>
<p>Each side keeps a <strong>sequence number</strong> — the byte counter that makes ordering and loss detection possible. Each side must (a) tell the other its starting number, and (b) find out that the other side received it. Two messages cannot do both.</p>
<ol>
<li><strong>SYN, seq=x.</strong> Client says "my numbering starts at x".</li>
<li><strong>SYN-ACK, seq=y, ack=x+1.</strong> Server says "got yours; mine starts at y".</li>
<li><strong>ACK, ack=y+1.</strong> Client says "got yours too".</li>
</ol>
<p><strong>Stop after two and the server does not know whether its own number arrived.</strong> It would have to start sending data on a numbering the client may never have seen. Three is the minimum that leaves both sides certain, which is why it is three and not two or four.</p>
<p><strong>Closing takes four</strong> — FIN, ACK, FIN, ACK — because each direction is shut down independently. One side can stop sending while still receiving, which is a real state and not an edge case.</p>`,
        `<p>Trước khi gửi bất kỳ dữ liệu nào, TCP trao đổi ba thông điệp, và con số ba không phải tuỳ tiện.</p>
<p>Mỗi bên giữ một <strong>số thứ tự</strong> — cái bộ đếm byte làm cho việc sắp thứ tự và phát hiện mất gói trở nên khả thi. Mỗi bên phải (a) nói cho bên kia biết số khởi đầu của mình, và (b) biết được là bên kia đã nhận. Hai thông điệp không làm được cả hai việc.</p>
<ol>
<li><strong>SYN, seq=x.</strong> Máy khách nói "cách đánh số của tôi bắt đầu từ x".</li>
<li><strong>SYN-ACK, seq=y, ack=x+1.</strong> Máy chủ nói "nhận được của anh rồi; của tôi bắt đầu từ y".</li>
<li><strong>ACK, ack=y+1.</strong> Máy khách nói "tôi cũng nhận được của anh rồi".</li>
</ol>
<p><strong>Dừng sau hai thông điệp thì máy chủ không biết số của chính nó có tới nơi không.</strong> Nó sẽ phải bắt đầu gửi dữ liệu theo một cách đánh số mà máy khách có thể chưa từng thấy. Ba là số tối thiểu để cả hai bên đều chắc chắn, và đó là lý do nó là ba chứ không phải hai hay bốn.</p>
<p><strong>Đóng thì cần bốn</strong> — FIN, ACK, FIN, ACK — bởi vì mỗi chiều được tắt một cách độc lập. Một bên có thể thôi gửi mà vẫn còn nhận, đó là một trạng thái thật chứ không phải trường hợp hi hữu.</p>`],

      [11, '13.6 Reliability — built from repetition, not from errors',
        `<p>Here is the part that surprises people. <strong>The receiver never sends an error message.</strong> It never says "resend segment 1500". TCP has no such message.</p>
<p>What the receiver does instead is keep repeating the last acknowledgement it can honestly give. If bytes 1000–1499 arrived and 1500–1999 did not, it says <code>ack=1500</code>. When 2000–2499 arrives out of order, it still says <code>ack=1500</code>, because that is still the highest point it has everything up to.</p>
<p><strong>The sender reads three duplicate ACKs as "the segment starting at 1500 never arrived"</strong> and retransmits it. Nobody ever reported a failure; the sender inferred it from a positive statement repeated.</p>
<p><strong>Why the design is built this way.</strong> An error message can itself be lost — Chapter 12 made exactly that point about ICMP. A mechanism built on repeated positive acknowledgement keeps working when the network is dropping packets in <em>both</em> directions, which is precisely when you need it.</p>`,
        `<p>Đây là phần làm người ta bất ngờ. <strong>Bên nhận không bao giờ gửi một thông báo lỗi nào.</strong> Nó không bao giờ nói "gửi lại đoạn 1500". TCP không có thông điệp như vậy.</p>
<p>Thay vào đó, bên nhận cứ lặp lại cái báo nhận cuối cùng mà nó nói được một cách trung thực. Nếu byte 1000–1499 đã tới còn 1500–1999 thì chưa, nó nói <code>ack=1500</code>. Khi 2000–2499 tới nơi lộn thứ tự, nó vẫn nói <code>ack=1500</code>, bởi vì đó vẫn là mốc cao nhất mà nó có đủ mọi thứ tính tới đó.</p>
<p><strong>Bên gửi đọc ba cái ACK trùng nhau thành "đoạn bắt đầu từ 1500 chưa bao giờ tới nơi"</strong> rồi gửi lại nó. Không ai từng báo cáo một thất bại nào cả; bên gửi suy ra điều đó từ một lời khẳng định được lặp lại.</p>
<p><strong>Vì sao thiết kế lại làm theo lối này.</strong> Một thông báo lỗi thì bản thân nó cũng mất được — Chương 12 đã nói đúng điều đó về ICMP. Một cơ chế dựng trên việc lặp lại lời báo nhận vẫn chạy được khi mạng đang rơi gói ở <em>cả hai</em> chiều, mà đó đúng là lúc bạn cần tới nó.</p>`],

      [12, '13.6 Flow control — and what it is not',
        `<p>In every acknowledgement, the receiver also states its <strong>window</strong>: how much buffer space it still has. The sender may never have more unacknowledged data in flight than that.</p>
<p>If the receiving application is slow to read, the buffer fills and the window shrinks. At <strong>window = 0</strong> the sender must stop entirely and probe periodically until the receiver reopens it.</p>
<p><strong>The distinction that matters: flow control is not congestion control.</strong></p>
<ul>
<li><strong>Flow control</strong> protects the <em>receiver</em> from a sender that is too fast for it. The receiver asks for it explicitly, in the window field.</li>
<li><strong>Congestion control</strong> protects the <em>network</em> from everyone. Nobody asks for it; the sender infers congestion from loss and slows itself down.</li>
</ul>
<p>Both work by slowing the sender, which is why they are confused — and confusing them makes performance problems impossible to reason about. <strong>A window that keeps hitting zero points at the receiving application, not at the network.</strong> Restarting a router will not fix an application that is not reading its socket.</p>`,
        `<p>Trong mỗi gói báo nhận, bên nhận cũng khai <strong>cửa sổ</strong> của nó: còn bao nhiêu chỗ đệm. Bên gửi không bao giờ được để lượng dữ liệu chưa được báo nhận đang bay trên đường vượt quá con số đó.</p>
<p>Nếu ứng dụng phía nhận đọc chậm thì bộ đệm đầy lên và cửa sổ co lại. Ở <strong>cửa sổ bằng 0</strong> thì bên gửi phải dừng hẳn và thăm dò định kỳ cho tới khi bên nhận mở lại.</p>
<p><strong>Chỗ phân biệt đáng kể: kiểm soát luồng KHÔNG phải kiểm soát tắc nghẽn.</strong></p>
<ul>
<li><strong>Kiểm soát luồng</strong> bảo vệ <em>bên nhận</em> khỏi một bên gửi quá nhanh so với nó. Bên nhận xin điều đó một cách tường minh, trong trường cửa sổ.</li>
<li><strong>Kiểm soát tắc nghẽn</strong> bảo vệ <em>mạng</em> khỏi tất cả mọi người. Không ai xin cả; bên gửi suy ra tắc nghẽn từ việc mất gói rồi tự chậm lại.</li>
</ul>
<p>Cả hai đều hoạt động bằng cách làm chậm bên gửi, và đó là lý do chúng bị nhầm lẫn — mà nhầm hai thứ đó thì không tài nào suy luận nổi về các vấn đề hiệu năng. <strong>Một cửa sổ cứ chạm 0 là chỉ vào ứng dụng phía nhận, không phải vào mạng.</strong> Khởi động lại con router sẽ không sửa được một ứng dụng không chịu đọc socket của nó.</p>`],

      [13, '13.7 UDP — and why "unreliable" is a design choice',
        `<p>UDP's header is eight bytes: source port, destination port, length, checksum. That is the entire protocol.</p>
<p>No handshake, so the first packet already carries data. No sequence numbers, so no ordering. No acknowledgements, so no retransmission and no flow control. A lost packet stays lost, and the <em>application</em> decides whether that matters.</p>
<p>★ <strong>DNS is the clearest example of why this is a choice and not a shortcoming.</strong> A DNS query and its answer are one small packet each. Opening a TCP connection would cost a full round trip <em>before the question is even asked</em>, in order to protect data that is cheap to simply ask for again. So DNS uses UDP by default, and falls back to TCP only when the answer is too large for one packet.</p>
<p>The protocol traded certainty for latency, deliberately, because a retry is cheaper than a handshake. Voice, video and game state make the same trade for the same reason. <strong>"UDP is unreliable" is a description, not a criticism.</strong></p>`,
        `<p>Tiêu đề của UDP là tám byte: cổng nguồn, cổng đích, độ dài, checksum. Đó là toàn bộ giao thức.</p>
<p>Không bắt tay, nên gói đầu tiên đã mang dữ liệu. Không số thứ tự, nên không có sắp thứ tự. Không báo nhận, nên không gửi lại và không kiểm soát luồng. Một gói mất là mất luôn, và <em>ứng dụng</em> quyết định xem chuyện đó có quan trọng không.</p>
<p>★ <strong>DNS là ví dụ rõ nhất cho thấy đây là một LỰA CHỌN chứ không phải một khiếm khuyết.</strong> Một truy vấn DNS và câu trả lời của nó mỗi cái một gói nhỏ. Mở một kết nối TCP sẽ tốn trọn một vòng khứ hồi <em>trước khi câu hỏi kịp được hỏi</em>, chỉ để bảo vệ một thứ dữ liệu mà hỏi lại thì rẻ. Nên DNS mặc định dùng UDP, và chỉ lùi về TCP khi câu trả lời quá lớn so với một gói.</p>
<p>Giao thức đã đổi độ chắc chắn lấy độ trễ, một cách có chủ ý, bởi vì thử lại rẻ hơn bắt tay. Thoại, video và trạng thái game cũng đánh đổi y như vậy vì đúng lý do đó. <strong>"UDP không tin cậy" là một mô tả, không phải một lời chê.</strong></p>`],

      [14, '★ Three ways to bind, on one real server',
        `<p>This is the single most useful idea in the chapter for anyone who runs a server, and all three lines are real, read from one production VPS at the same moment.</p>
<ul>
<li><code>0.0.0.0:3001</code> — <strong>every interface.</strong> Reachable from anywhere that can route to this machine, which on a public VPS means the Internet. The only thing between this port and the world is a firewall rule.</li>
<li><code>172.18.0.1:8888</code> — <strong>one Docker bridge.</strong> Reachable from containers on that network, and nowhere else.</li>
<li><code>127.0.0.1:3300</code> — <strong>loopback only.</strong> Reachable from this machine, full stop. No packet from outside can even carry 127.0.0.1 as a destination.</li>
</ul>
<p><strong>The port number is the same kind of thing in all three.</strong> Only the address in front of the colon differs, and that address is what decides the exposure.</p>
<p>★ <strong>So "port 3001 is open" is not a statement about risk.</strong> It has dropped the part that mattered. And most accidental exposures are exactly this: a service bound to 0.0.0.0 that somebody meant to keep local.</p>`,
        `<p>Đây là ý hữu dụng nhất của cả chương với bất kỳ ai vận hành máy chủ, và cả ba dòng đều là thật, đọc từ một VPS sản xuất vào cùng một thời điểm.</p>
<ul>
<li><code>0.0.0.0:3001</code> — <strong>mọi cổng mạng.</strong> Tới được từ bất cứ đâu định tuyến tới được máy này, mà trên một VPS công cộng thì nghĩa là cả Internet. Thứ duy nhất nằm giữa cổng này và thế giới là một luật tường lửa.</li>
<li><code>172.18.0.1:8888</code> — <strong>một cầu Docker.</strong> Tới được từ các container trên mạng đó, và không từ đâu khác.</li>
<li><code>127.0.0.1:3300</code> — <strong>chỉ loopback.</strong> Tới được từ chính máy này, hết. Không gói nào từ bên ngoài thậm chí có thể mang 127.0.0.1 làm đích.</li>
</ul>
<p><strong>Số hiệu cổng trong cả ba trường hợp đều là cùng một loại thứ.</strong> Chỉ cái địa chỉ đứng trước dấu hai chấm là khác, và chính cái địa chỉ ấy quyết định mức phơi bày.</p>
<p>★ <strong>Nên câu "cổng 3001 đang mở" không phải một phát biểu về rủi ro.</strong> Nó đã đánh rơi mất phần quan trọng. Và phần lớn các vụ phơi bày ngoài ý muốn đúng là chuyện này: một dịch vụ gắn vào 0.0.0.0 mà ai đó đã định giữ nó ở cục bộ.</p>`],

      [15, '★ Reading ss -tlnp',
        `<p>One command answers "what is this machine offering, and to whom" completely. It is the first thing to run on a server you did not set up.</p>
<ul>
<li><code>-t</code> — TCP only. Use <code>-u</code> for UDP; they are separate namespaces, and TCP 53 and UDP 53 are different sockets.</li>
<li><code>-l</code> — listening sockets only, not established connections.</li>
<li><code>-n</code> — numeric. Without it, 443 becomes "https" and you lose the number you were looking for.</li>
<li><code>-p</code> — which process owns the socket. Needs root to show anything useful.</li>
</ul>
<p><strong>Read the Local Address column, not the port column.</strong> That is where the exposure is. On the VPS measured for this chapter, <code>turnserver</code> appears bound to <code>127.0.0.1:3478</code> — correctly scoped — while several docker-proxy entries sit on <code>0.0.0.0</code>, which is what a published container port looks like.</p>
<p>The UDP counterpart, <code>ss -ulnp</code>, is worth running too. A service can be invisible in the TCP listing and wide open on UDP.</p>`,
        `<p>Một câu lệnh trả lời trọn vẹn câu "cái máy này đang cung cấp gì, và cho ai". Đây là thứ đầu tiên nên chạy trên một máy chủ không phải bạn dựng.</p>
<ul>
<li><code>-t</code> — chỉ TCP. Dùng <code>-u</code> cho UDP; chúng là hai không gian tên riêng, và TCP 53 với UDP 53 là hai socket khác nhau.</li>
<li><code>-l</code> — chỉ các socket đang nghe, không phải các kết nối đã thiết lập.</li>
<li><code>-n</code> — để dạng số. Thiếu nó thì 443 biến thành "https" và bạn mất đúng con số mình đang tìm.</li>
<li><code>-p</code> — tiến trình nào sở hữu socket. Cần quyền root mới hiện ra thứ đáng xem.</li>
</ul>
<p><strong>Hãy đọc cột Local Address, đừng chỉ đọc cột cổng.</strong> Mức phơi bày nằm ở đó. Trên con VPS đo cho chương này, <code>turnserver</code> hiện ra gắn vào <code>127.0.0.1:3478</code> — thu hẹp đúng cách — trong khi vài mục docker-proxy thì nằm ở <code>0.0.0.0</code>, và đó chính là hình dạng của một cổng container đã được công bố.</p>
<p>Người anh em phía UDP, <code>ss -ulnp</code>, cũng đáng chạy. Một dịch vụ có thể vô hình trong danh sách TCP mà mở toang trên UDP.</p>`],

      [16, '★ -p is not EXPOSE, and the difference is everything',
        `<p>Four containers on one host, and the Ports column tells four different stories:</p>
<ul>
<li><code>frontend → 3000/tcp</code> — no address at all. This is <strong>EXPOSE</strong> from the Dockerfile: documentation saying "this image listens here". <strong>Nothing is published.</strong> No traffic from outside can reach it.</li>
<li><code>backend → 0.0.0.0:3001-&gt;3001/tcp</code> — published to every interface.</li>
<li><code>newapi → 127.0.0.1:3300-&gt;3000/tcp</code> — published to loopback only. Correctly scoped.</li>
<li><code>nginx → 0.0.0.0:443-&gt;443/tcp</code> — public, and deliberately so.</li>
</ul>
<p><strong>The frontend line is the proof.</strong> That container listens on 3000 and is completely unreachable from outside — and the site still works, because nginx reaches it over the Docker network instead. Exposure and function are separate things.</p>
<p>★ <strong>The skill is reading the left of the arrow:</strong> no address means not published, <code>127.0.0.1</code> means local, <code>0.0.0.0</code> means the Internet. Three glances and you know a host's whole attack surface.</p>`,
        `<p>Bốn container trên một máy chủ, và cột Ports kể bốn câu chuyện khác nhau:</p>
<ul>
<li><code>frontend → 3000/tcp</code> — hoàn toàn không có địa chỉ. Đây là <strong>EXPOSE</strong> trong Dockerfile: một dòng tài liệu nói "ảnh này nghe ở đây". <strong>Không có gì được công bố cả.</strong> Không lưu lượng nào từ bên ngoài tới được nó.</li>
<li><code>backend → 0.0.0.0:3001-&gt;3001/tcp</code> — công bố ra mọi cổng mạng.</li>
<li><code>newapi → 127.0.0.1:3300-&gt;3000/tcp</code> — chỉ công bố ra loopback. Thu hẹp đúng cách.</li>
<li><code>nginx → 0.0.0.0:443-&gt;443/tcp</code> — công khai, và cố ý như vậy.</li>
</ul>
<p><strong>Dòng frontend là bằng chứng.</strong> Container đó nghe ở 3000 và hoàn toàn không tới được từ bên ngoài — mà trang web vẫn chạy, bởi vì nginx tới nó qua mạng Docker. Mức phơi bày và chức năng là hai chuyện tách rời.</p>
<p>★ <strong>Kỹ năng nằm ở việc đọc phần bên trái mũi tên:</strong> không có địa chỉ nghĩa là chưa công bố, <code>127.0.0.1</code> nghĩa là cục bộ, <code>0.0.0.0</code> nghĩa là cả Internet. Ba cái liếc là bạn biết toàn bộ bề mặt tấn công của một máy chủ.</p>`],

      [17, '★ Connection states, and what the numbers mean',
        `<p>Counting states is a fast health check. On the VPS measured for this chapter: <strong>104 LISTEN, 7 SYN-RECV, 3 ESTAB</strong>.</p>
<ul>
<li><strong>LISTEN</strong> — a socket waiting for connections. 104 looks alarming and is not: Docker runs one <code>docker-proxy</code> per published port per address family, so the number inflates quickly.</li>
<li><strong>ESTAB</strong> — an actual live conversation. Three is a quiet moment.</li>
<li><strong>SYN-RECV</strong> — half-open. A SYN arrived, the SYN-ACK went out, and the final ACK never came back.</li>
<li><strong>TIME-WAIT</strong> — recently closed, held for a while so that late packets from the old connection cannot be mistaken for a new one.</li>
</ul>
<p>★ <strong>Seven SYN-RECV on a public server is normal background noise.</strong> Scanners knock constantly and never complete the handshake. <em>Thousands</em> would be a SYN flood. The number is the signal, not the presence — and the same is true of TIME-WAIT, where a large count usually means connections are being closed properly, not that something is leaking.</p>`,
        `<p>Đếm trạng thái là một phép kiểm sức khoẻ nhanh. Trên con VPS đo cho chương này: <strong>104 LISTEN, 7 SYN-RECV, 3 ESTAB</strong>.</p>
<ul>
<li><strong>LISTEN</strong> — một socket đang chờ kết nối. Con số 104 nhìn thì đáng lo mà không phải: Docker chạy một <code>docker-proxy</code> cho mỗi cổng đã công bố trên mỗi họ địa chỉ, nên con số phình lên rất nhanh.</li>
<li><strong>ESTAB</strong> — một cuộc trò chuyện đang sống thật. Ba là một thời điểm vắng.</li>
<li><strong>SYN-RECV</strong> — nửa mở. Một gói SYN đã tới, gói SYN-ACK đã đi ra, và gói ACK cuối cùng không bao giờ quay về.</li>
<li><strong>TIME-WAIT</strong> — vừa đóng, được giữ lại một lúc để những gói đến muộn của kết nối cũ không bị nhầm thành kết nối mới.</li>
</ul>
<p>★ <strong>Bảy cái SYN-RECV trên một máy chủ công cộng là tiếng ồn nền bình thường.</strong> Máy quét gõ cửa liên tục và không bao giờ hoàn tất bắt tay. <em>Hàng nghìn</em> cái mới là một đợt SYN flood. Con số mới là tín hiệu, không phải sự có mặt — và TIME-WAIT cũng vậy, số lượng lớn thường có nghĩa là các kết nối đang được đóng đúng cách chứ không phải có thứ gì đang rò.</p>`],

      [18, '★ Diagnosing a refused connection, in order',
        `<p>Now the opening question has its answer. The two colleagues got different results because they were on different networks, and <strong>the one who got "refused" learned more</strong>.</p>
<p><strong>Refused</strong> means the packet reached the machine and the kernel sent back an RST. Routing works, no firewall dropped it, the host is alive — and nothing was listening on that port, or it was listening on <code>127.0.0.1</code> only. That single word eliminates the entire network path.</p>
<p><strong>Timeout</strong> means no answer at all. Something dropped it silently, and you have learned nothing about whether the service is running.</p>
<p><strong>The order that saves the most time:</strong></p>
<ol>
<li>Is anything listening? <code>ss -tlnp | grep :5432</code></li>
<li>On which <em>address</em>? <code>127.0.0.1</code> will never answer a remote client.</li>
<li>Refused or timeout from the client? That splits the problem in half.</li>
<li>Does it work from the machine itself? <code>nc -vz localhost 5432</code> separates service from network.</li>
<li><strong>Only now</strong> look at the firewall.</li>
</ol>`,
        `<p>Giờ thì câu hỏi mở đầu đã có lời giải. Hai đồng nghiệp nhận kết quả khác nhau vì họ ở hai mạng khác nhau, và <strong>người nhận được "từ chối" mới là người học được nhiều hơn</strong>.</p>
<p><strong>Bị từ chối</strong> nghĩa là gói đã tới được máy và nhân hệ điều hành đã gửi trả một gói RST. Định tuyến chạy, không tường lửa nào vứt nó, máy còn sống — và không có gì nghe ở cổng đó, hoặc nó chỉ nghe ở <code>127.0.0.1</code>. Đúng một từ ấy loại trừ trọn cả đường mạng.</p>
<p><strong>Hết giờ</strong> nghĩa là hoàn toàn không có câu trả lời. Có thứ gì đó đã vứt nó lặng lẽ, và bạn chẳng học được gì về chuyện dịch vụ có đang chạy hay không.</p>
<p><strong>Trình tự tiết kiệm nhiều thời gian nhất:</strong></p>
<ol>
<li>Có cái gì đang nghe không? <code>ss -tlnp | grep :5432</code></li>
<li>Nghe ở <em>địa chỉ</em> nào? <code>127.0.0.1</code> sẽ không bao giờ đáp một máy khách ở xa.</li>
<li>Từ phía máy khách thì bị từ chối hay hết giờ? Câu đó chẻ đôi vấn đề.</li>
<li>Từ chính cái máy đó thì có chạy không? <code>nc -vz localhost 5432</code> tách dịch vụ khỏi mạng.</li>
<li><strong>Chỉ tới lúc này</strong> mới nhìn tường lửa.</li>
</ol>`],

      [19, '★ A firewall chain whose order makes half of it dead',
        `<p>This is real output from the VPS measured for this chapter, and it is the most instructive thing on it.</p>
<p>The intent is obvious: block the Internet from reaching Redis, but let the local networks through. The effect is not what the author intended, because <strong>iptables takes the first rule that matches</strong>:</p>
<ol>
<li><code>DROP tcp 0.0.0.0/0 dpt:6379</code> — matches <em>every</em> source address.</li>
<li><code>ACCEPT tcp 192.168.0.0/16 dpt:6379</code> — never reached.</li>
<li><code>ACCEPT tcp 172.16.0.0/12 dpt:6379</code> — never reached.</li>
<li><code>ACCEPT tcp 127.0.0.0/8 dpt:6379</code> — never reached.</li>
</ol>
<p>Rule 1 already matches anything rules 2 to 4 could match. They are dead text that <em>reads</em> as protection.</p>
<p>★ <strong>This is the same shape as a trap this course has met before.</strong> An <code>sshd_config</code> drop-in named <code>70-</code> saying the opposite of <code>50-cloud-init.conf</code> is silently ignored, because sshd also takes the first value it reads. <strong>Whenever order decides meaning, put the specific rule ABOVE the general one</strong> — and verify the effective state (<code>iptables -L -n --line-numbers</code>, <code>sshd -T</code>), never the file you just wrote.</p>`,
        `<p>Đây là kết xuất thật từ con VPS đo cho chương này, và nó là thứ đáng học nhất trên đó.</p>
<p>Ý định thì rõ ràng: chặn Internet tới được Redis, nhưng cho các mạng cục bộ đi qua. Hiệu lực thật lại không phải điều người viết muốn, bởi vì <strong>iptables lấy luật ĐẦU TIÊN khớp</strong>:</p>
<ol>
<li><code>DROP tcp 0.0.0.0/0 dpt:6379</code> — khớp với <em>mọi</em> địa chỉ nguồn.</li>
<li><code>ACCEPT tcp 192.168.0.0/16 dpt:6379</code> — không bao giờ tới lượt.</li>
<li><code>ACCEPT tcp 172.16.0.0/12 dpt:6379</code> — không bao giờ tới lượt.</li>
<li><code>ACCEPT tcp 127.0.0.0/8 dpt:6379</code> — không bao giờ tới lượt.</li>
</ol>
<p>Luật 1 đã khớp sẵn mọi thứ mà luật 2 tới 4 có thể khớp. Chúng là chữ chết mà <em>đọc lên</em> thì như đang bảo vệ.</p>
<p>★ <strong>Đây đúng là hình dạng của một cái bẫy mà môn này đã gặp.</strong> Một file drop-in của <code>sshd_config</code> đặt tên <code>70-</code> nói ngược lại <code>50-cloud-init.conf</code> thì bị bỏ qua lặng lẽ, bởi vì sshd cũng lấy giá trị đọc được đầu tiên. <strong>Hễ thứ tự quyết định ý nghĩa thì đặt luật CỤ THỂ LÊN TRÊN luật tổng quát</strong> — và nghiệm thu bằng trạng thái đang hiệu lực (<code>iptables -L -n --line-numbers</code>, <code>sshd -T</code>), chứ không bằng cái file bạn vừa ghi.</p>`],

      [20, '13.8 AI tools — and the one question worth asking',
        `<p>The syllabus lists AI tools as a self-learning item for this session, so here is where a model genuinely helps and where it cannot.</p>
<p><strong>Where it helps.</strong> Explaining what SYN-RECV means. Explaining refused versus timeout. And — the interesting one — <strong>reviewing a rule chain for unreachable rules</strong>. The iptables bug on the previous slide is a property of the <em>text itself</em>: a catch-all above a specific rule. A model can spot that with no knowledge of your network at all, and it is exactly the kind of thing a human skims past.</p>
<p><strong>Where it cannot help.</strong> "Why can't I connect?" Every useful fact — the bind address, the firewall, which network you are on — is on your machine, and none of it is in the question. It will produce a confident, plausible list of causes that fits many networks and may not fit yours.</p>
<p><strong>The rule that has held all course:</strong> a model proposes, a command decides. Ask it what to test and why; run the test yourself; believe the output.</p>`,
        `<p>Syllabus liệt kê công cụ AI như một mục tự học cho buổi này, nên đây là chỗ một mô hình thật sự giúp được và chỗ nó không giúp được.</p>
<p><strong>Chỗ nó giúp được.</strong> Giải thích SYN-RECV nghĩa là gì. Giải thích "từ chối" khác "hết giờ" ra sao. Và — cái thú vị nhất — <strong>rà một chuỗi luật xem có luật nào không bao giờ tới lượt</strong>. Con bọ iptables ở slide trước là một tính chất của <em>chính đoạn văn bản</em>: một luật bắt-tất-cả nằm trên một luật cụ thể. Một mô hình phát hiện được chuyện đó mà hoàn toàn không cần biết gì về mạng của bạn, và nó đúng là loại chuyện mà con người đọc lướt qua.</p>
<p><strong>Chỗ nó không giúp được.</strong> "Vì sao tôi không kết nối được?" Mọi dữ kiện hữu ích — địa chỉ gắn, tường lửa, bạn đang ở mạng nào — đều nằm trên máy bạn, và không cái nào nằm trong câu hỏi. Nó sẽ sinh ra một danh sách nguyên nhân tự tin và hợp lý, khớp với nhiều mạng và có thể không khớp với mạng của bạn.</p>
<p><strong>Quy tắc đã đúng suốt cả môn:</strong> mô hình đề xuất, câu lệnh quyết định. Hỏi nó nên thử gì và vì sao; tự tay chạy phép thử; tin vào kết quả.</p>`],

      [21, 'The five mistakes that cost the most marks',
        `<p>Five errors account for most of the lost marks here, and four of them are sentences that have dropped a word.</p>
<ul>
<li><strong>"A port is open."</strong> Meaningless without the address. <code>0.0.0.0:3001</code> and <code>127.0.0.1:3001</code> differ completely.</li>
<li><strong>Confusing refused with timeout.</strong> Refused = RST = reached the machine. Timeout = filtered. Different halves of the stack.</li>
<li><strong>Thinking EXPOSE publishes a port.</strong> It documents. Only <code>-p</code> creates the host mapping.</li>
<li><strong>"UDP is unreliable so it is worse."</strong> DNS and voice choose it deliberately; the trade is latency against certainty.</li>
<li><strong>Saying the handshake could be two messages.</strong> Three is the minimum for <em>both</em> sides to know their sequence number arrived.</li>
</ul>
<p><strong>One habit covers four of the five:</strong> when you state a fact about a port, state the address and the protocol too. "TCP <code>0.0.0.0:5432</code> is listening" is something you can act on. "5432 is open" has lost the part that mattered.</p>`,
        `<p>Năm lỗi chiếm phần lớn số điểm bị mất ở đây, và bốn trong số đó là những câu nói đã đánh rơi mất một chữ.</p>
<ul>
<li><strong>"Một cổng đang mở."</strong> Vô nghĩa nếu không kèm địa chỉ. <code>0.0.0.0:3001</code> và <code>127.0.0.1:3001</code> khác nhau hoàn toàn.</li>
<li><strong>Nhầm "từ chối" với "hết giờ".</strong> Từ chối = RST = đã tới được máy. Hết giờ = bị lọc. Hai nửa khác nhau của chồng giao thức.</li>
<li><strong>Tưởng EXPOSE công bố một cổng.</strong> Nó chỉ ghi chú. Chỉ <code>-p</code> mới tạo ra ánh xạ ở máy chủ.</li>
<li><strong>"UDP không tin cậy nên nó tệ hơn."</strong> DNS và thoại chọn nó một cách có chủ ý; cuộc đánh đổi là độ trễ lấy độ chắc chắn.</li>
<li><strong>Nói rằng bắt tay hai thông điệp là đủ.</strong> Ba là tối thiểu để <em>cả hai</em> bên biết số thứ tự của mình đã tới nơi.</li>
</ul>
<p><strong>Một thói quen phủ được bốn trong năm:</strong> khi phát biểu một sự thật về một cổng, hãy nói cả địa chỉ và giao thức. "TCP <code>0.0.0.0:5432</code> đang nghe" là thứ bạn hành động được. "5432 đang mở" thì đã mất phần quan trọng.</p>`],

      [22, 'What you can do now, and what comes next',
        `<p>If the chapter worked, all of this is now routine.</p>
<ul>
<li>Explain what layer 4 adds to layer 3, and why a port number makes shared hosting possible at all.</li>
<li>Name a connection by its four numbers, and say why one port serves thousands of clients.</li>
<li>Say why the handshake needs three messages and the close needs four.</li>
<li>Explain how TCP detects loss without anyone sending an error.</li>
<li>Tell flow control apart from congestion control, and say which one a zero window points at.</li>
<li>Choose TCP or UDP and defend it as a trade rather than a ranking.</li>
<li>★ Read <code>ss -tlnp</code> and say what each line exposes and to whom.</li>
<li>★ Distinguish EXPOSE from <code>-p</code>, and refused from timeout.</li>
<li>★ Spot a firewall rule made dead by a catch-all above it.</li>
</ul>
<p><strong>Next: Chapter 14 — the Application Layer</strong> (sessions 45–46, Cisco Module 15). HTTP, DNS, DHCP and email: the protocols that live on the ports this chapter just explained.</p>`,
        `<p>Nếu chương này có tác dụng thì giờ mọi thứ dưới đây đã thành thói quen.</p>
<ul>
<li>Giải thích tầng 4 thêm gì vào tầng 3, và vì sao số hiệu cổng là thứ làm cho hosting dùng chung trở nên khả thi.</li>
<li>Gọi tên một kết nối bằng bốn con số của nó, và nói được vì sao một cổng phục vụ được hàng nghìn khách.</li>
<li>Nói được vì sao bắt tay cần ba thông điệp còn đóng cần bốn.</li>
<li>Giải thích TCP phát hiện mất gói ra sao mà không ai gửi một thông báo lỗi nào.</li>
<li>Phân biệt kiểm soát luồng với kiểm soát tắc nghẽn, và nói được cửa sổ bằng 0 chỉ vào cái gì.</li>
<li>Chọn TCP hay UDP và biện hộ cho nó như một cuộc đánh đổi chứ không phải một bảng xếp hạng.</li>
<li>★ Đọc <code>ss -tlnp</code> và nói được mỗi dòng phơi ra cái gì cho ai.</li>
<li>★ Phân biệt EXPOSE với <code>-p</code>, và "từ chối" với "hết giờ".</li>
<li>★ Phát hiện một luật tường lửa bị một luật bắt-tất-cả ở trên làm cho chết.</li>
</ul>
<p><strong>Tiếp theo: Chương 14 — Tầng ứng dụng</strong> (buổi 45–46, Module 15 của Cisco). HTTP, DNS, DHCP và thư điện tử: những giao thức sống trên đúng các cổng mà chương này vừa giải thích.</p>`],
    ]),

    bi(
      `<h3>🔍 Cách tự kiểm — the refused-versus-timeout experiment</h3>
<p>Do this once on your own machine and the distinction will stick permanently.</p>
<pre><code class="language-bash">nc -vz localhost 22       # something IS listening
nc -vz localhost 9999     # nothing is listening — note how FAST it fails
sudo ss -tlnp             # confirm what you just proved
ss -ulnp                  # the UDP side — a different namespace entirely</code></pre>
<p>Then compare a filtered port, which needs a remote host:</p>
<pre><code class="language-bash">nc -vz &lt;a host that drops packets&gt; 5432    # note how LONG it takes to fail</code></pre>
<div class="callout ok"><strong>What each result proves.</strong> An instant "refused" proves the packet reached a live IP stack and got an RST — routing and filtering are fine, and only the service is missing. A slow "timed out" proves nothing about the service; something ate the packet in silence. <strong>The speed of the failure is the diagnosis</strong>, and it is free.</div>
<div class="callout warn"><strong>Kiểm bộ kiểm.</strong> Before trusting any port check you write, run it against a port you <em>know</em> is closed and one you <em>know</em> is open. A checker that reports success for both is worse than no checker. This chapter's own byte-comparison of slide uploads failed exactly that way once: a short timeout truncated the download, so every file looked like a mismatch when nothing was wrong.</div>`,
      `<h3>🔍 Cách tự kiểm — thí nghiệm "từ chối" so với "hết giờ"</h3>
<p>Làm một lần trên máy của bạn là chỗ phân biệt này dính lại vĩnh viễn.</p>
<pre><code class="language-bash">nc -vz localhost 22       # có thứ gì đó ĐANG nghe
nc -vz localhost 9999     # không có gì nghe — để ý nó hỏng NHANH thế nào
sudo ss -tlnp             # xác nhận lại thứ bạn vừa chứng minh
ss -ulnp                  # phía UDP — một không gian tên hoàn toàn khác</code></pre>
<p>Rồi so với một cổng bị lọc, cái này cần một máy ở xa:</p>
<pre><code class="language-bash">nc -vz &lt;một máy đang vứt gói&gt; 5432    # để ý nó hỏng LÂU thế nào</code></pre>
<div class="callout ok"><strong>Mỗi kết quả chứng minh điều gì.</strong> Một cú "refused" tức thì chứng minh gói đã tới một ngăn xếp IP đang sống và nhận được RST — định tuyến và lọc đều ổn, chỉ thiếu mỗi cái dịch vụ. Một cú "timed out" chậm chạp thì không chứng minh gì về dịch vụ cả; có thứ gì đó đã nuốt gói trong im lặng. <strong>Tốc độ của cú hỏng chính là chẩn đoán</strong>, và nó miễn phí.</div>
<div class="callout warn"><strong>Kiểm bộ kiểm.</strong> Trước khi tin bất kỳ phép kiểm cổng nào bạn viết, hãy chạy nó với một cổng bạn <em>biết chắc</em> là đóng và một cổng bạn <em>biết chắc</em> là mở. Một bộ kiểm báo thành công cho cả hai thì còn tệ hơn không có bộ kiểm. Chính phép so byte ảnh slide của chương này đã hỏng đúng kiểu đó một lần: một trần thời gian quá ngắn cắt ngang lượt tải, nên file nào cũng trông như lệch trong khi chẳng có gì sai.</div>`,
    ),

    bi(
      `<div class="pitfall co-tieu-de"><strong>Trap 1 — restarting a service on a timeout.</strong> <b>Symptom:</b> the restart changes nothing, because a timeout means the packet never arrived. You have just restarted a healthy service and lost its in-flight connections for no reason.</div>
<div class="pitfall co-tieu-de"><strong>Trap 2 — reading 104 LISTEN as an attack surface of 104 ports.</strong> <b>Symptom:</b> alarm at a normal Docker host. Docker runs one proxy per published port per address family; count distinct <em>addresses and ports</em>, not sockets.</div>
<div class="pitfall co-tieu-de"><strong>Trap 3 — writing a firewall ACCEPT below a catch-all DROP.</strong> <b>Symptom:</b> none, until the day traffic actually takes that path and is blocked. The chain reads as if it permits the local networks and does not. Check with <code>--line-numbers</code> and read top-down.</div>
<div class="pitfall co-tieu-de"><strong>Trap 4 — checking only TCP.</strong> <b>Symptom:</b> a service that looks closed in <code>ss -tlnp</code> and is wide open on UDP. DNS, DHCP and syslog all live there. Run <code>ss -ulnp</code> too.</div>
<div class="pitfall co-tieu-de"><strong>Trap 5 — believing a zero window is a network problem.</strong> <b>Symptom:</b> time spent on bandwidth and routing when the receiving application simply is not reading its socket fast enough. Flow control is about the receiver; congestion control is about the path.</div>`,
      `<div class="pitfall co-tieu-de"><strong>Bẫy 1 — khởi động lại dịch vụ khi gặp "hết giờ".</strong> <b>Triệu chứng:</b> khởi động lại chẳng thay đổi gì, vì hết giờ nghĩa là gói chưa bao giờ tới nơi. Bạn vừa khởi động lại một dịch vụ khoẻ mạnh và làm đứt các kết nối đang chạy của nó mà chẳng vì lý do gì.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 2 — đọc 104 LISTEN thành một bề mặt tấn công 104 cổng.</strong> <b>Triệu chứng:</b> hoảng hốt trước một máy chủ Docker bình thường. Docker chạy một proxy cho mỗi cổng đã công bố trên mỗi họ địa chỉ; hãy đếm số <em>địa chỉ và cổng</em> khác nhau, đừng đếm socket.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 3 — viết một luật ACCEPT nằm dưới một luật DROP bắt-tất-cả.</strong> <b>Triệu chứng:</b> không có triệu chứng nào, cho tới cái ngày lưu lượng thật sự đi theo đường đó và bị chặn. Chuỗi luật đọc lên thì như đang cho các mạng cục bộ qua, mà không phải vậy. Hãy kiểm bằng <code>--line-numbers</code> và đọc từ trên xuống.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 4 — chỉ kiểm TCP.</strong> <b>Triệu chứng:</b> một dịch vụ nhìn trong <code>ss -tlnp</code> thì như đã đóng mà lại mở toang trên UDP. DNS, DHCP và syslog đều sống ở đó. Hãy chạy cả <code>ss -ulnp</code>.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 5 — tin rằng cửa sổ bằng 0 là vấn đề của mạng.</strong> <b>Triệu chứng:</b> mất thời gian với băng thông và định tuyến trong khi ứng dụng phía nhận đơn giản là không đọc socket đủ nhanh. Kiểm soát luồng là chuyện của bên nhận; kiểm soát tắc nghẽn mới là chuyện của đường truyền.</div>`,
    ),

    bi(
      `<h3>Exercises</h3>
<p><b>E1.</b> Explain in your own words why a two-message handshake is not enough, and then say what would actually go wrong if TCP used one.</p>
<div class="dap-an"><p><b>Why two is not enough.</b> Each side has a sequence number that the other must know in order to detect loss and restore order. After message 1 (SYN) the server knows the client's number. After message 2 (SYN-ACK) the client knows the server's number <em>and</em> knows the server got its own. But <b>the server still does not know whether its SYN-ACK arrived</b> — it has sent a number and heard nothing back about it.</p>
<p><b>What goes wrong with two.</b> The server would have to start sending data numbered from a sequence the client may never have received. If the SYN-ACK was lost, the client would receive data with sequence numbers it cannot interpret, and would have no way to ask for the missing context — because it does not even know a connection was established.</p>
<p><b>Message 3 is the server's confirmation.</b> It carries no data and exists purely so that both sides are certain. That is why three is the minimum, not a convention.</p>
<p class="ghi-chu">The same reasoning explains why closing takes four rather than three: each direction must be shut down and confirmed separately, because a half-closed connection (one side done sending, still receiving) is a legitimate state.</p></div>

<p><b>E2.</b> ★ You are handed a server you have never seen. Write the three commands you would run first to understand its network exposure, and say what each one rules out.</p>
<div class="dap-an"><pre><code class="language-bash">ss -tlnp        # 1
ss -ulnp        # 2
docker ps --format '{{.Names}}\\t{{.Ports}}'   # 3</code></pre>
<ul>
<li><b>1 — <code>ss -tlnp</code>.</b> Every TCP socket accepting connections, with its bind address and owning process. This rules out "I do not know what this machine offers". Read the <b>address</b> column: <code>127.0.0.1</code> is local, <code>0.0.0.0</code> is everything.</li>
<li><b>2 — <code>ss -ulnp</code>.</b> The UDP side. Rules out the blind spot in step 1 — DNS, DHCP, syslog and anything else on UDP is invisible to <code>-t</code>.</li>
<li><b>3 — <code>docker ps</code> ports.</b> Rules out the confusion between a container listening and a container <em>published</em>. A line with no address before the port is EXPOSE only and reaches nothing from outside.</li>
</ul>
<p><b>What is still not ruled out:</b> whether a firewall further restricts what those bindings imply. That is the fourth command, and it comes last on purpose — reading the firewall before you know what is listening tells you very little.</p></div>

<p><b>E3.</b> ★ Review this chain and say what it actually does, what it was meant to do, and how to fix it.</p>
<pre><code class="language-plaintext">1  DROP    tcp  0.0.0.0/0       dpt:5432
2  ACCEPT  tcp  172.16.0.0/12   dpt:5432
3  ACCEPT  tcp  127.0.0.0/8     dpt:5432</code></pre>
<div class="dap-an"><p><b>What it was meant to do.</b> Block the Internet from reaching PostgreSQL, while letting the Docker networks (172.16.0.0/12 covers 172.18.x from Chapter 10) and the host itself connect.</p>
<p><b>What it actually does.</b> <b>Drops everything.</b> iptables evaluates top-down and takes the first match. Rule 1 matches <code>0.0.0.0/0</code>, which includes 172.18.0.5 and 127.0.0.1. Rules 2 and 3 are unreachable — dead text that reads as permission.</p>
<p><b>Why it may still appear to work.</b> Traffic between two containers on the same Docker bridge may not traverse this chain at all, depending on whether bridge netfilter is active. So the database keeps working and nobody notices the rules are wrong — until a configuration change routes that traffic through the chain, and the application loses its database with no explanation.</p>
<p><b>The fix — put the specific rules above the general one:</b></p>
<pre><code class="language-plaintext">1  ACCEPT  tcp  127.0.0.0/8     dpt:5432
2  ACCEPT  tcp  172.16.0.0/12   dpt:5432
3  DROP    tcp  0.0.0.0/0       dpt:5432</code></pre>
<p><b>And verify the effective state</b> with <code>iptables -L -n --line-numbers</code>, reading top to bottom — not by reading the script that wrote the rules. This is the same lesson as the sshd drop-in ordering trap: <b>"I wrote it" and "the command returned 0" both fail to mean "it takes effect".</b></p></div>`,
      `<h3>Bài tập</h3>
<p><b>E1.</b> Hãy giải thích bằng lời của bạn vì sao bắt tay hai thông điệp là không đủ, rồi nói xem thực tế sẽ hỏng chuyện gì nếu TCP chỉ dùng hai.</p>
<div class="dap-an"><p><b>Vì sao hai là không đủ.</b> Mỗi bên có một số thứ tự mà bên kia phải biết thì mới phát hiện được mất gói và khôi phục được thứ tự. Sau thông điệp 1 (SYN) thì máy chủ biết số của máy khách. Sau thông điệp 2 (SYN-ACK) thì máy khách biết số của máy chủ <em>và</em> biết máy chủ đã nhận được số của mình. Nhưng <b>máy chủ vẫn chưa biết gói SYN-ACK của nó có tới nơi không</b> — nó đã gửi một con số đi và chưa nghe được gì phản hồi về con số ấy.</p>
<p><b>Chuyện gì hỏng nếu chỉ có hai.</b> Máy chủ sẽ phải bắt đầu gửi dữ liệu đánh số theo một chuỗi mà máy khách có thể chưa bao giờ nhận được. Nếu gói SYN-ACK bị mất thì máy khách sẽ nhận được dữ liệu mang những số thứ tự nó không diễn giải nổi, và không có cách nào hỏi lại phần ngữ cảnh còn thiếu — bởi vì nó thậm chí không biết là đã có một kết nối được thiết lập.</p>
<p><b>Thông điệp 3 là lời xác nhận của máy chủ.</b> Nó không mang dữ liệu nào và tồn tại thuần tuý để cả hai bên đều chắc chắn. Đó là lý do ba là con số tối thiểu, chứ không phải một quy ước.</p>
<p class="ghi-chu">Cùng lối suy luận đó giải thích vì sao đóng lại cần bốn chứ không phải ba: mỗi chiều phải được tắt và xác nhận riêng, bởi vì một kết nối đóng-một-nửa (một bên thôi gửi nhưng vẫn nhận) là một trạng thái hợp lệ.</p></div>

<p><b>E2.</b> ★ Bạn được giao một máy chủ chưa từng thấy. Hãy viết ba câu lệnh bạn sẽ chạy đầu tiên để hiểu mức phơi bày mạng của nó, và nói mỗi câu loại trừ được điều gì.</p>
<div class="dap-an"><pre><code class="language-bash">ss -tlnp        # 1
ss -ulnp        # 2
docker ps --format '{{.Names}}\\t{{.Ports}}'   # 3</code></pre>
<ul>
<li><b>1 — <code>ss -tlnp</code>.</b> Mọi socket TCP đang nhận kết nối, kèm địa chỉ gắn và tiến trình sở hữu. Câu này loại trừ chuyện "tôi không biết cái máy này cung cấp gì". Hãy đọc cột <b>địa chỉ</b>: <code>127.0.0.1</code> là cục bộ, <code>0.0.0.0</code> là mọi thứ.</li>
<li><b>2 — <code>ss -ulnp</code>.</b> Phía UDP. Loại trừ điểm mù của bước 1 — DNS, DHCP, syslog và mọi thứ khác trên UDP đều vô hình với cờ <code>-t</code>.</li>
<li><b>3 — cột ports của <code>docker ps</code>.</b> Loại trừ chỗ nhầm lẫn giữa một container đang nghe với một container đã được <em>công bố</em>. Một dòng không có địa chỉ trước cổng thì chỉ là EXPOSE và không tới được từ bên ngoài.</li>
</ul>
<p><b>Thứ vẫn chưa được loại trừ:</b> liệu một tường lửa có siết thêm những gì các chỗ gắn ấy hàm ý hay không. Đó là câu lệnh thứ tư, và nó đứng cuối là có chủ ý — đọc tường lửa trước khi biết cái gì đang nghe thì nói lên rất ít.</p></div>

<p><b>E3.</b> ★ Hãy rà chuỗi luật này rồi nói nó thực sự làm gì, nó được định làm gì, và sửa thế nào.</p>
<pre><code class="language-plaintext">1  DROP    tcp  0.0.0.0/0       dpt:5432
2  ACCEPT  tcp  172.16.0.0/12   dpt:5432
3  ACCEPT  tcp  127.0.0.0/8     dpt:5432</code></pre>
<div class="dap-an"><p><b>Nó được định làm gì.</b> Chặn Internet tới được PostgreSQL, trong khi vẫn cho các mạng Docker (172.16.0.0/12 phủ 172.18.x của Chương 10) và chính máy chủ kết nối vào.</p>
<p><b>Nó thực sự làm gì.</b> <b>Vứt tất cả.</b> iptables duyệt từ trên xuống và lấy luật khớp đầu tiên. Luật 1 khớp <code>0.0.0.0/0</code>, mà dải đó bao gồm cả 172.18.0.5 lẫn 127.0.0.1. Luật 2 và 3 không bao giờ tới lượt — chữ chết mà đọc lên thì như đang cho phép.</p>
<p><b>Vì sao nhìn thì vẫn như đang chạy tốt.</b> Lưu lượng giữa hai container trên cùng một cầu Docker có thể hoàn toàn không đi qua chuỗi luật này, tuỳ vào chuyện bridge netfilter có đang bật hay không. Nên cơ sở dữ liệu vẫn chạy và không ai để ý là mấy cái luật sai — cho tới khi một thay đổi cấu hình nào đó đẩy lưu lượng ấy qua chuỗi luật, và ứng dụng mất cơ sở dữ liệu mà không có lời giải thích nào.</p>
<p><b>Cách sửa — đặt các luật cụ thể lên TRÊN luật tổng quát:</b></p>
<pre><code class="language-plaintext">1  ACCEPT  tcp  127.0.0.0/8     dpt:5432
2  ACCEPT  tcp  172.16.0.0/12   dpt:5432
3  DROP    tcp  0.0.0.0/0       dpt:5432</code></pre>
<p><b>Và nghiệm thu bằng trạng thái đang hiệu lực</b> với <code>iptables -L -n --line-numbers</code>, đọc từ trên xuống — chứ không phải bằng cách đọc cái script đã ghi ra mấy luật ấy. Đây đúng là bài học của cái bẫy thứ tự drop-in sshd: <b>"tôi đã ghi rồi" và "lệnh trả về 0" đều không có nghĩa là "nó đã có hiệu lực".</b></p></div>`,
    ),

    cq(42, [
      ['CQ14.3', 'Which other tools can we use to test network connectivity? How does it works(Do lab 7)? <em>— content belongs to Chapter 12; answered in full in Lesson 12.2. Note that <strong>"lab 7" does not exist</strong> in the published 60-session plan: the course lists Lab 1.1 to 1.4 and Lab 2.1 to 2.3, and no lab is numbered 7.</em>',
        'Which other tools can we use to test network connectivity? How does it works(Do lab 7)? <em>— nội dung thuộc Chương 12; đã trả lời đầy đủ ở bài 12.2. Lưu ý rằng <strong>"lab 7" KHÔNG TỒN TẠI</strong> trong kế hoạch 60 buổi đã công bố: môn liệt kê Lab 1.1 tới 1.4 và Lab 2.1 tới 2.3, và không có lab nào đánh số 7.</em>'],
    ]),

    bi(
      `<div class="note-ct"><h3>💬 About this chapter's constructive questions — the drift reverses</h3>
<p>Both questions assigned to sessions 41 and 42 belong to <strong>Chapter 12</strong>:</p>
<ul>
<li><strong>CQ14.2</strong> (session 41) — testing connectivity with ICMP. That is section 12.2.</li>
<li><strong>CQ14.3</strong> (session 42) — other connectivity tools, "<em>Do lab 7</em>". Also section 12.2 — and <strong>lab 7 does not exist</strong>. The course has Lab 1.1–1.4 and Lab 2.1–2.3. We report the instruction as published and do not guess which lab was meant.</li>
</ul>
<p><strong>But here the pattern inverts, which is worth seeing.</strong> The questions that <em>do</em> match this chapter — <strong>CQ15.1</strong> ("What characteristics are there in the Transport Layer?"), <strong>CQ15.2</strong> ("Compare between TCP and UDP? Which protocol do you like to implement?") and <strong>CQ15.3</strong> ("How does TCP session establishment and termination processes facilitate reliable communication?") — are assigned to sessions 43, 44 and 45, which are <strong>project sessions and the first session of Chapter 14</strong>.</p>
<p>So the questions for this chapter exist, are well written, and land one to three sessions after the material is taught. All three are answered in full above: the four jobs of layer 4 in lesson 13.1, the TCP/UDP trade in lesson 13.1, and the handshake and close in this lesson.</p></div>`,
      `<div class="note-ct"><h3>💬 Về các câu hỏi kiến tạo của chương này — độ trôi đảo chiều</h3>
<p>Cả hai câu gán cho buổi 41 và 42 đều thuộc về <strong>Chương 12</strong>:</p>
<ul>
<li><strong>CQ14.2</strong> (buổi 41) — kiểm tra kết nối bằng ICMP. Đó là mục 12.2.</li>
<li><strong>CQ14.3</strong> (buổi 42) — các công cụ kiểm tra kết nối khác, "<em>Do lab 7</em>". Cũng là mục 12.2 — và <strong>lab 7 không tồn tại</strong>. Môn này có Lab 1.1–1.4 và Lab 2.1–2.3. Chúng tôi nêu đúng câu chữ đã công bố và không đoán xem nó định nói lab nào.</li>
</ul>
<p><strong>Nhưng ở đây quy luật đảo chiều, và điều đó đáng nhìn ra.</strong> Những câu <em>đúng là</em> của chương này — <strong>CQ15.1</strong> ("Tầng giao vận có những đặc tính gì?"), <strong>CQ15.2</strong> ("So sánh TCP và UDP? Bạn thích triển khai giao thức nào?") và <strong>CQ15.3</strong> ("Quá trình thiết lập và kết thúc phiên TCP tạo điều kiện cho truyền thông tin cậy ra sao?") — lại được gán cho buổi 43, 44 và 45, tức <strong>các buổi đồ án và buổi đầu của Chương 14</strong>.</p>
<p>Vậy là câu hỏi cho chương này có tồn tại, được viết tử tế, và rơi xuống sau chỗ dạy nội dung từ một tới ba buổi. Cả ba đều đã được trả lời đầy đủ ở trên: bốn việc của tầng 4 ở bài 13.1, cuộc đánh đổi TCP/UDP ở bài 13.1, và phần bắt tay với kết thúc ở chính bài này.</p></div>`,
    ),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz ─────────────────────────────────── */

const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

const QUIZ = {
  title: 'Quiz Chapter 13 — The Transport Layer|||Quiz Chương 13 — Tầng giao vận',
  slug: 'nwc204-ch13-quiz',
  type: 'QUIZ',
  description: '12 câu song ngữ cho chương 13: tầng 4 thêm gì vào tầng 3, một kết nối là bốn con số, ba dải cổng và quy tắc dưới 1024, bảng cổng thông dụng, TCP so với UDP như một cuộc đánh đổi, vì sao bắt tay cần ba thông điệp, tính tin cậy dựng từ ACK trùng chứ không từ thông báo lỗi, kiểm soát luồng khác kiểm soát tắc nghẽn, và phần ★ đo thật: địa chỉ gắn quyết định mức phơi bày, -p khác EXPOSE, "từ chối" khác "hết giờ", và một chuỗi luật tường lửa sai thứ tự.',
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      q('What does the transport layer add that IP does not have?|||Tầng giao vận thêm vào cái gì mà IP không có?',
        ['A longer address|||Một địa chỉ dài hơn', 'A port number, so data reaches the right PROGRAM not just the right machine|||Số hiệu cổng, để dữ liệu tới đúng CHƯƠNG TRÌNH chứ không chỉ tới đúng máy', 'Encryption of the payload|||Mã hoá phần tải', 'A hop counter|||Một bộ đếm chặng'],
        1,
        'IP delivers to an address, and an address identifies a machine. But a machine runs many programs and IP has no field saying which one. The 16-bit port number is that field, which is why one server can offer a hundred services on one IP. Without ports, every website would need its own address and shared hosting, reverse proxies and containers would all be impossible.|||IP giao tới một địa chỉ, mà địa chỉ thì định danh một cái máy. Nhưng một cái máy chạy nhiều chương trình và IP không có trường nào nói là chương trình nào. Số hiệu cổng 16 bit chính là cái trường đó, và đó là lý do một máy chủ cung cấp được cả trăm dịch vụ trên một IP. Không có cổng thì mỗi trang web cần một địa chỉ riêng, và hosting dùng chung, reverse proxy, container đều là bất khả.'),

      q('How can one web server handle a thousand clients all on port 443?|||Làm sao một máy chủ web phục vụ được một nghìn khách cùng trên cổng 443?',
        ['It opens a new port for each client|||Nó mở một cổng mới cho mỗi khách', 'A connection is identified by FOUR numbers, and each client has a different source port|||Một kết nối được định danh bằng BỐN con số, và mỗi khách có một cổng nguồn khác nhau', 'It queues them and serves one at a time|||Nó xếp hàng rồi phục vụ từng cái một', 'Port 443 supports multiple channels|||Cổng 443 hỗ trợ nhiều kênh'],
        1,
        'A connection is a four-tuple: source IP, source port, destination IP, destination port. Every client differs in at least one. Even two tabs from the same computer to the same site differ, because the kernel assigns each a different ephemeral source port — on Linux from 32768 to 60999 by default, not 49152 as the standard suggests. The server never opens extra ports.|||Một kết nối là một bộ bốn: IP nguồn, cổng nguồn, IP đích, cổng đích. Mỗi khách khác nhau ở ít nhất một con số. Ngay cả hai tab từ cùng một máy tới cùng một trang cũng khác, vì nhân hệ điều hành cấp cho mỗi tab một cổng nguồn tạm khác — trên Linux mặc định từ 32768 tới 60999, chứ không phải 49152 như tiêu chuẩn gợi ý. Máy chủ không bao giờ mở thêm cổng nào.'),

      q('Why can a container running as a non-root user not bind port 80?|||Vì sao một container chạy bằng người dùng không phải root lại không gắn được vào cổng 80?',
        ['Port 80 is reserved for nginx|||Cổng 80 dành riêng cho nginx', 'Ports below 1024 need root or an explicit capability on Linux|||Cổng dưới 1024 cần quyền root hoặc một capability khai tường minh trên Linux', 'Docker blocks it|||Docker chặn nó', 'Port 80 is already in use by the kernel|||Cổng 80 đã bị nhân hệ điều hành dùng'],
        1,
        'Ports 0 to 1023 are the well-known range and binding one requires root, or CAP_NET_BIND_SERVICE granted explicitly. Running a container as non-root is good practice, so the standard arrangement is to listen on 8080 inside the container and publish it as 80 on the host — which is what a reverse proxy in front of an application does anyway.|||Cổng 0 tới 1023 là dải thông dụng và gắn vào một cổng loại đó cần quyền root, hoặc CAP_NET_BIND_SERVICE được cấp tường minh. Chạy container bằng người dùng không phải root là thói quen tốt, nên cách bố trí tiêu chuẩn là nghe ở 8080 bên trong container rồi công bố thành 80 ở máy chủ — mà đó cũng là việc một reverse proxy đứng trước ứng dụng vẫn làm.'),

      q('Which two services listen on BOTH TCP and UDP on the same port number?|||Dịch vụ nào nghe trên CẢ TCP lẫn UDP ở cùng một số hiệu cổng?',
        ['HTTP on 80|||HTTP ở cổng 80', 'DNS on 53|||DNS ở cổng 53', 'SSH on 22|||SSH ở cổng 22', 'IMAPS on 993|||IMAPS ở cổng 993'],
        1,
        'DNS uses UDP 53 for ordinary queries because a query and its answer are one small packet each, and falls back to TCP 53 when the answer is too large for one packet or for a zone transfer. TCP 53 and UDP 53 are separate sockets in separate namespaces — which is why a security review that only runs ss -tlnp misses the UDP side entirely. Always run ss -ulnp too.|||DNS dùng UDP cổng 53 cho truy vấn thường vì một truy vấn và câu trả lời mỗi cái một gói nhỏ, rồi lùi về TCP cổng 53 khi câu trả lời quá lớn so với một gói hoặc khi chuyển vùng. TCP 53 và UDP 53 là hai socket riêng trong hai không gian tên riêng — và đó là lý do một đợt rà soát an ninh chỉ chạy ss -tlnp sẽ bỏ sót hoàn toàn phía UDP. Luôn chạy thêm ss -ulnp.'),

      q('Why does the TCP handshake need THREE messages rather than two?|||Vì sao bắt tay TCP cần BA thông điệp chứ không phải hai?',
        ['To measure round trip time|||Để đo thời gian khứ hồi', 'So that BOTH sides know their own sequence number arrived|||Để CẢ HAI bên đều biết số thứ tự của mình đã tới nơi', 'To negotiate encryption|||Để thương lượng việc mã hoá', 'Because one message could be lost|||Vì một thông điệp có thể bị mất'],
        1,
        'After SYN the server knows the client number. After SYN-ACK the client knows the server number and knows its own arrived. But the server still does not know whether its SYN-ACK got through — it would have to start sending data numbered from a sequence the client may never have seen. The third message is the server confirmation, carries no data, and exists purely so both sides are certain. Closing needs four because each direction shuts down separately.|||Sau gói SYN thì máy chủ biết số của máy khách. Sau SYN-ACK thì máy khách biết số của máy chủ và biết số của mình đã tới. Nhưng máy chủ vẫn chưa biết gói SYN-ACK của nó có lọt không — nó sẽ phải bắt đầu gửi dữ liệu đánh số theo một chuỗi mà máy khách có thể chưa từng thấy. Thông điệp thứ ba là lời xác nhận của máy chủ, không mang dữ liệu, và tồn tại thuần tuý để cả hai bên đều chắc chắn. Đóng cần bốn vì mỗi chiều tắt riêng.'),

      q('How does a TCP sender learn that a segment was lost?|||Bên gửi TCP biết một đoạn bị mất bằng cách nào?',
        ['The receiver sends an error message|||Bên nhận gửi một thông báo lỗi', 'The receiver keeps repeating the same acknowledgement number|||Bên nhận cứ lặp lại cùng một số báo nhận', 'A router sends ICMP Destination Unreachable|||Một router gửi ICMP Destination Unreachable', 'A timer on the receiver expires|||Một bộ đếm giờ ở bên nhận hết hạn'],
        1,
        'TCP has no "resend this" message. The receiver simply repeats the highest acknowledgement it can honestly give: if 1500-1999 is missing it keeps saying ack=1500 even as later data arrives. The sender reads three duplicate ACKs as loss and retransmits. Reliability is built from repeating a POSITIVE statement, not from an error — which matters because an error message can itself be lost, exactly as Chapter 12 said about ICMP.|||TCP không có thông điệp "gửi lại cái này". Bên nhận đơn giản lặp lại cái báo nhận cao nhất mà nó nói được một cách trung thực: nếu thiếu 1500-1999 thì nó cứ nói ack=1500 kể cả khi dữ liệu sau đó vẫn tới. Bên gửi đọc ba ACK trùng nhau thành mất gói rồi gửi lại. Tính tin cậy dựng từ việc lặp lại một lời khẳng định DƯƠNG, không phải từ một thông báo lỗi — chuyện đó quan trọng vì bản thân thông báo lỗi cũng mất được, đúng như Chương 12 đã nói về ICMP.'),

      q('A TCP window keeps hitting zero. What does that point at?|||Cửa sổ TCP cứ chạm 0. Điều đó chỉ vào cái gì?',
        ['Network congestion|||Mạng bị tắc nghẽn', 'The receiving application is not reading its socket fast enough|||Ứng dụng phía nhận đọc socket không đủ nhanh', 'A routing loop|||Một vòng lặp định tuyến', 'Packet loss on the path|||Mất gói trên đường truyền'],
        1,
        'The window is flow control, and flow control protects the RECEIVER. The receiver states in every ACK how much buffer it still has; when the application above is slow to read, the buffer fills and the window shrinks to zero. Congestion control is a different mechanism that protects the NETWORK and is inferred from loss, not requested. Both slow the sender, which is why they get confused — but restarting a router will not fix an application that is not reading.|||Cửa sổ là kiểm soát luồng, mà kiểm soát luồng bảo vệ BÊN NHẬN. Bên nhận khai trong mỗi gói ACK là nó còn bao nhiêu bộ đệm; khi ứng dụng bên trên đọc chậm thì bộ đệm đầy và cửa sổ co về 0. Kiểm soát tắc nghẽn là cơ chế khác, bảo vệ MẠNG, và được suy ra từ việc mất gói chứ không phải do ai xin. Cả hai đều làm chậm bên gửi nên hay bị nhầm — nhưng khởi động lại router sẽ không sửa được một ứng dụng không chịu đọc.'),

      q('Why does DNS use UDP rather than TCP for ordinary queries?|||Vì sao DNS dùng UDP chứ không phải TCP cho các truy vấn thường?',
        ['UDP is faster at transferring large files|||UDP truyền file lớn nhanh hơn', 'A TCP handshake would cost a round trip before the question is even asked|||Bắt tay TCP sẽ tốn một vòng khứ hồi trước khi câu hỏi kịp được hỏi', 'DNS data is not important|||Dữ liệu DNS không quan trọng', 'TCP cannot carry DNS records|||TCP không chở được bản ghi DNS'],
        1,
        'A query and its answer are one small packet each. Setting up TCP would spend a full round trip on a handshake BEFORE the question is asked, to protect data that is cheap to simply ask for again. So DNS trades certainty for latency deliberately, and falls back to TCP only when the answer is too large for one packet. "UDP is unreliable" is a description of the trade, not a criticism.|||Một truy vấn và câu trả lời mỗi cái một gói nhỏ. Thiết lập TCP sẽ tiêu trọn một vòng khứ hồi cho việc bắt tay TRƯỚC KHI câu hỏi được hỏi, chỉ để bảo vệ một thứ dữ liệu mà hỏi lại thì rẻ. Nên DNS đổi độ chắc chắn lấy độ trễ một cách có chủ ý, và chỉ lùi về TCP khi câu trả lời quá lớn so với một gói. "UDP không tin cậy" là mô tả cuộc đánh đổi, không phải một lời chê.'),

      q('★ Which of these is reachable from the Internet?|||★ Cái nào trong số này tới được từ Internet?',
        ['LISTEN 127.0.0.1:3300', 'LISTEN 0.0.0.0:3001', 'LISTEN 172.18.0.1:8888', 'a container line showing only 3000/tcp|||một dòng container chỉ ghi 3000/tcp'],
        1,
        '0.0.0.0 means every interface, so anything that can route to the machine can reach it — on a public VPS, the Internet. 127.0.0.1 is loopback and no packet from outside can even carry it as a destination. 172.18.0.1 is a Docker bridge in RFC 1918 space that no Internet router carries. A bare 3000/tcp is EXPOSE only and publishes nothing. All four are real lines from one production server: read the ADDRESS, not the port.|||0.0.0.0 nghĩa là mọi cổng mạng, nên bất cứ thứ gì định tuyến tới được máy đều tới được nó — trên một VPS công cộng thì đó là Internet. 127.0.0.1 là loopback và không gói nào từ ngoài thậm chí mang nó làm đích được. 172.18.0.1 là một cầu Docker trong không gian RFC 1918 mà không router Internet nào mang. Dòng chỉ ghi 3000/tcp là EXPOSE và không công bố gì. Cả bốn đều là dòng thật từ một máy chủ sản xuất: hãy đọc ĐỊA CHỈ, đừng đọc cổng.'),

      q('★ What is the difference between EXPOSE in a Dockerfile and -p when running?|||★ Khác biệt giữa EXPOSE trong Dockerfile và cờ -p khi chạy là gì?',
        ['They are two names for the same thing|||Hai cái tên cho cùng một thứ', 'EXPOSE only documents; only -p creates the host port mapping|||EXPOSE chỉ ghi chú; chỉ -p mới tạo ra ánh xạ cổng ở máy chủ', 'EXPOSE is for TCP and -p is for UDP|||EXPOSE dành cho TCP còn -p dành cho UDP', 'EXPOSE publishes to localhost and -p publishes publicly|||EXPOSE công bố ra localhost còn -p công bố ra công cộng'],
        1,
        'EXPOSE is a note in the image saying "this listens here". It publishes nothing and no outside traffic can reach it. Only -p, or a compose ports: entry, creates the mapping. Measured on a real host: the frontend container shows a bare 3000/tcp and is unreachable from outside, yet the site works — because nginx reaches it over the Docker network. Exposure and function are separate things.|||EXPOSE là một dòng ghi chú trong ảnh nói "cái này nghe ở đây". Nó không công bố gì và không lưu lượng bên ngoài nào tới được. Chỉ có -p, hoặc mục ports: trong compose, mới tạo ra ánh xạ. Đo trên máy thật: container frontend hiện ra chỉ mỗi 3000/tcp và không tới được từ ngoài, mà trang web vẫn chạy — vì nginx tới nó qua mạng Docker. Mức phơi bày và chức năng là hai chuyện tách rời.'),

      q('★ You get "Connection refused" instantly. What has that ALREADY proved?|||★ Bạn nhận "Connection refused" ngay lập tức. Điều đó ĐÃ chứng minh được gì?',
        ['Nothing useful|||Không gì hữu ích', 'The packet reached the machine: routing works and no firewall dropped it|||Gói đã tới được máy: định tuyến chạy và không tường lửa nào vứt nó', 'The server is down|||Máy chủ đã chết', 'The service crashed just now|||Dịch vụ vừa mới sập'],
        1,
        'Refused means the kernel sent back an RST, which it can only do if the packet arrived. So routing, the host and its IP stack are all fine — the whole network path is eliminated in one word. What remains is that nothing was listening on that port, or it was listening on 127.0.0.1 only. A TIMEOUT is the opposite: no answer at all, something filtered it, and you have learned nothing about the service. The speed of the failure is the diagnosis.|||"Từ chối" nghĩa là nhân hệ điều hành đã gửi trả một gói RST, mà nó chỉ làm được vậy nếu gói đã tới nơi. Vậy định tuyến, máy chủ và ngăn xếp IP của nó đều ổn — cả đường mạng bị loại trừ bằng đúng một từ. Thứ còn lại là không có gì nghe ở cổng đó, hoặc nó chỉ nghe ở 127.0.0.1. "Hết giờ" thì ngược lại: hoàn toàn không có câu trả lời, có thứ gì đó đã lọc nó, và bạn chẳng học được gì về dịch vụ. Tốc độ của cú hỏng chính là chẩn đoán.'),

      q('★ A firewall chain has DROP 0.0.0.0/0 on line 1 and ACCEPT 172.16.0.0/12 on line 3. What happens?|||★ Một chuỗi tường lửa có DROP 0.0.0.0/0 ở dòng 1 và ACCEPT 172.16.0.0/12 ở dòng 3. Chuyện gì xảy ra?',
        ['The ACCEPT wins because it is more specific|||Luật ACCEPT thắng vì nó cụ thể hơn', 'Everything is dropped — line 1 matches all sources, so line 3 is never reached|||Tất cả đều bị vứt — dòng 1 khớp mọi nguồn, nên dòng 3 không bao giờ tới lượt', 'Traffic from 172.16.0.0/12 is allowed and the rest dropped|||Lưu lượng từ 172.16.0.0/12 được cho qua, còn lại bị vứt', 'iptables reports a configuration error|||iptables báo lỗi cấu hình'],
        1,
        'iptables evaluates top-down and takes the FIRST rule that matches. 0.0.0.0/0 matches every source address including 172.18.0.5, so the ACCEPT below is dead text that reads as protection. No error is reported. This is the same shape as the sshd drop-in trap: sshd_config takes the first value it reads, so a 70- file contradicting 50-cloud-init.conf is silently ignored. Whenever order decides meaning, put the SPECIFIC rule above the general one, and verify the effective state rather than the file you wrote.|||iptables duyệt từ trên xuống và lấy luật ĐẦU TIÊN khớp. 0.0.0.0/0 khớp mọi địa chỉ nguồn kể cả 172.18.0.5, nên luật ACCEPT bên dưới là chữ chết mà đọc lên thì như đang bảo vệ. Không có lỗi nào được báo. Đây đúng hình dạng của cái bẫy drop-in sshd: sshd_config lấy giá trị đọc được đầu tiên, nên một file 70- nói ngược lại 50-cloud-init.conf thì bị bỏ qua lặng lẽ. Hễ thứ tự quyết định ý nghĩa thì đặt luật CỤ THỂ lên trên luật tổng quát, và nghiệm thu bằng trạng thái đang hiệu lực chứ không bằng cái file bạn vừa ghi.'),
    ],
  },
};

export default [
  {
    title: 'Chapter 13 — The Transport Layer (FLM sessions 41-42)|||Chương 13 — Tầng giao vận (buổi 41-42 của FLM)',
    slug: 'nwc204-chuong-13-tang-giao-van',
    description: 'Cisco Module 14 theo đúng buổi 41-42 của FLM, chương thực dụng nhất của môn: vì sao IP đưa gói tới đúng MÁY còn tầng 4 mới đưa tới đúng CHƯƠNG TRÌNH, bốn việc của tầng giao vận và hai trong số đó là tuỳ chọn, một kết nối là BỐN con số nên một cổng phục vụ được hàng nghìn khách, ba dải cổng và vì sao cổng dưới 1024 cần root, bảng cổng thông dụng gồm 22 và 587 và 993, TCP so với UDP như cuộc đánh đổi độ trễ lấy độ chắc chắn, vì sao bắt tay cần ba thông điệp và đóng cần bốn, tính tin cậy dựng từ ACK trùng chứ không từ thông báo lỗi, cửa sổ trượt và chỗ khác kiểm soát tắc nghẽn, và vì sao DNS chọn UDP có chủ ý. Kèm phần ★ đo trên máy chủ thật: ba kiểu bind cho ba mức phơi bày khác hẳn nhau, -p khác EXPOSE, đếm trạng thái kết nối, "từ chối" khác "hết giờ" và cái nào dạy ta nhiều hơn, trình tự chẩn đoán năm bước, và một chuỗi luật tường lửa mà thứ tự làm cho một nửa số luật thành mã chết. Slide tiếng Anh do cuongthai.com dựng, giảng song ngữ.',
    lessons: [L1, L2, QUIZ],
  },
];
