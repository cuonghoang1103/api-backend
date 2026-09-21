/**
 * NWC204 · Chapter 9 — Basic Router Configuration (Cisco Module 10).
 * FLM buổi 26–27 (lý thuyết) + buổi 28–29 (Lab 2.1).
 *
 * Slide: scripts/slides-src/nwc204-ch09.mjs → deck 'nwc204-ch09', 26 ảnh.
 *
 * ★ = phần cuongthai.com bổ sung ngoài Module 10: làm đúng những việc ấy trên
 *     Linux (ip addr / ip link / ip route / ip_forward), khiến cấu hình sống
 *     sót sau khởi động lại, siết SSH trên VPS thật, và dựng lại Lab 2.1 bằng
 *     network namespace của Linux mà không cần Packet Tracer.
 *
 * ⚠️ Bất thường của bảng gốc, đã nêu trong bài, KHÔNG tự sửa bảng gốc:
 *   - Buổi 27 liệt kê "9.2 Configure Interfaces" rồi nhảy thẳng sang
 *     "9.4 Configure the Default Gateway" — KHÔNG có 9.3 ở đâu cả.
 *   - Buổi 26 mang CQ9.2 "How does Neighbor Discovery operate on a network?"
 *     và buổi 27 mang CQ9.3 "Compare the roles of the ARP address and the IP
 *     address" — cả hai đều là nội dung chương 8, đã trả lời ở bài 8.2/8.1.
 *   - Buổi 28 mang CQ10.1 và buổi 29 mang CQ10.2, nội dung khớp Lab 2.1.
 *
 * ⚠️ File này CHỈ chứa chương 9. Đừng sửa NWC204.mjs ở đây.
 */
import { registerDeck, walk, walkHead, bi, cq } from './_slides.mjs';

const D = registerDeck('nwc204-ch09', {
  code: 'NWC204',
  en: 'Basic Router Configuration',
  vi: 'Cấu hình router cơ bản',
  total: 26,
});

/* ──────────────────────── Lesson 9.1 — session 26 ──────────────────────── */

const L1 = {
  title: '9.1 — Initial router settings: modes, passwords and SSH (FLM session 26)|||9.1 — Cấu hình khởi đầu cho router: chế độ, mật khẩu và SSH (buổi 26 của FLM)',
  slug: 'nwc204-9-1-cau-hinh-khoi-dau-router',
  type: 'DOCUMENT',
  description: 'Buổi 26: router lúc mới bóc hộp có gì, bốn chế độ của IOS và cách đọc dấu nhắc, danh sách việc cấu hình khởi đầu theo đúng thứ tự, hostname và banner pháp lý, enable secret so với enable password cùng sự thật về mã hoá loại 7, dòng console và VTY, năm điều kiện bắt buộc để bật SSH, running-config so với startup-config, và phần ★ siết SSH trên VPS Linux thật.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 9 · Lesson 9.1 · FLM session 26 of 60 · CLO3, CLO8, CLO9 · Cisco Module 10</span>
<h2>From a box with no name to a device you can trust</h2>
<p class="lead">Every chapter so far has been about understanding what happens. This one is about making it happen — and it is the first chapter where a mistake has consequences you cannot undo with a reload, because one of the things you are configuring is your own way back in.</p>
<p><strong>Opening question:</strong> you configure a router perfectly over the console, test everything, and it all works. Two weeks later there is a power cut, the router comes back up, and every setting is gone — hostname, addresses, passwords, all of it. Nothing was damaged and nobody touched it. What did you forget, and what is the one command that would have prevented it?</p>
<p class="note">★ marks material added by cuongthai.com beyond Cisco Module 10. The school's syllabus is covered in full first.</p>`,
      `<span class="eyebrow">NWC204 · Chương 9 · Bài 9.1 · Buổi 26/60 của FLM · CLO3, CLO8, CLO9 · Cisco Module 10</span>
<h2>Từ một cái hộp chưa có tên thành một thiết bị tin được</h2>
<p class="lead">Mọi chương tới giờ đều nói về việc hiểu chuyện gì đang xảy ra. Chương này nói về việc LÀM cho nó xảy ra — và nó là chương đầu tiên mà một sai lầm để lại hậu quả không gỡ được bằng lệnh reload, bởi vì một trong những thứ bạn đang cấu hình chính là đường bạn quay vào.</p>
<p><strong>Câu hỏi mở đầu:</strong> bạn cấu hình một con router hoàn hảo qua cổng console, kiểm tra đủ mọi thứ, và tất cả đều chạy. Hai tuần sau mất điện, router bật lại, và mọi thiết lập biến sạch — tên máy, địa chỉ, mật khẩu, tất cả. Không có gì hỏng và không ai đụng vào. Bạn đã quên gì, và lệnh duy nhất nào đã ngăn được chuyện đó?</p>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 10. Giáo trình của trường được phủ đủ trước.</p>`,
    ),

    walkHead('nwc204-ch09', 1, 10,
      'Slides 1–10 cover FLM session 26: 9.1 Configure Initial Router Settings.',
      'Slide 1–10 là buổi 26 của FLM: 9.1 Configure Initial Router Settings.'),

    walk('nwc204-ch09', [
      [1, 'Cover — Chapter 9, Basic Router Configuration',
        `<p>Chapter 9 is <strong>Cisco Module 10</strong>, and FPT gives it four sessions — two of theory and two of hands-on lab.</p>
<ul>
<li>Session 26 — 9.1 Configure Initial Router Settings.</li>
<li>Session 27 — 9.2 Configure Interfaces, 9.4 Configure the Default Gateway, 9.5 AI tools.</li>
<li>Sessions 28–29 — Lab 2.1: Build a Switch and Router Network.</li>
<li>Outcomes: <strong>CLO3</strong> (configure devices for basic connectivity), <strong>CLO8</strong> (design and implement a small topology), <strong>CLO9</strong>.</li>
</ul>
<p><strong>A note on the numbering.</strong> Session 27 lists 9.2 and then jumps straight to 9.4. There is no 9.3 anywhere in the published plan — the same kind of gap as session 27 of the question table. We cover what is listed and say so rather than inventing a section to fill the hole.</p>`,
        `<p>Chương 9 là <strong>Module 10 của Cisco</strong>, và trường xếp bốn buổi — hai buổi lý thuyết và hai buổi thực hành.</p>
<ul>
<li>Buổi 26 — 9.1 Configure Initial Router Settings.</li>
<li>Buổi 27 — 9.2 Configure Interfaces, 9.4 Configure the Default Gateway, 9.5 công cụ AI.</li>
<li>Buổi 28–29 — Lab 2.1: Build a Switch and Router Network.</li>
<li>Chuẩn đầu ra: <strong>CLO3</strong> (cấu hình thiết bị để có kết nối cơ bản), <strong>CLO8</strong> (thiết kế và dựng một tô-pô nhỏ), <strong>CLO9</strong>.</li>
</ul>
<p><strong>Một ghi chú về cách đánh số.</strong> Buổi 27 liệt kê 9.2 rồi nhảy thẳng sang 9.4. Không có mục 9.3 nào trong kế hoạch đã công bố — đúng kiểu khoảng trống như ở bảng câu hỏi. Chúng tôi dạy đúng những gì được liệt kê và nói rõ điều đó, thay vì bịa ra một mục để lấp chỗ trống.</p>`],

      [2, 'What a router is, straight out of the box',
        `<p>A factory-fresh router is deliberately useless, and every part of that is a decision.</p>
<ul>
<li><strong>Hostname is "Router".</strong> Identical on every unit ever shipped — which is exactly how someone ends up configuring the wrong device in a rack of six.</li>
<li><strong>Every interface is administratively down.</strong> Nothing forwards until a human says so.</li>
<li><strong>No passwords.</strong> Console access is open to anyone holding a cable.</li>
<li><strong>No IP addresses, empty routing table, not even a default route.</strong></li>
<li><strong>SSH is impossible.</strong> There is no crypto key and no domain name yet, so the command to generate one is refused.</li>
</ul>
<p><strong>Why interfaces ship shut.</strong> This is the one that surprises people, and it is a safety decision. A router plugged into a live network with a factory configuration could otherwise start forwarding traffic, or form a loop, before any human had reviewed what it would do. Defaulting to silent is the conservative choice, and it is the reason "I forgot <code>no shutdown</code>" is the most common beginner fault in this entire course.</p>`,
        `<p>Một con router mới cứng từ nhà máy là thứ vô dụng có chủ ý, và mọi phần của điều đó đều là một quyết định.</p>
<ul>
<li><strong>Tên máy là "Router".</strong> Giống hệt nhau trên mọi cái từng xuất xưởng — và đó chính là cách người ta cấu hình nhầm thiết bị trong một tủ rack có sáu con.</li>
<li><strong>Mọi cổng đều administratively down.</strong> Không có gì được chuyển tiếp cho tới khi có người cho phép.</li>
<li><strong>Không có mật khẩu nào.</strong> Ai cầm sợi cáp cũng vào được cổng console.</li>
<li><strong>Không có địa chỉ IP, bảng định tuyến rỗng, không có cả tuyến mặc định.</strong></li>
<li><strong>SSH là bất khả.</strong> Chưa có khoá mã và chưa có tên miền, nên lệnh sinh khoá sẽ bị từ chối.</li>
</ul>
<p><strong>Vì sao các cổng xuất xưởng ở trạng thái tắt.</strong> Đây là điểm làm người ta bất ngờ, và nó là một quyết định an toàn. Nếu không thì một con router cắm vào mạng đang chạy với cấu hình nhà máy có thể bắt đầu chuyển tiếp lưu lượng, hoặc tạo ra một vòng lặp, trước khi có người nào kịp xem nó sẽ làm gì. Mặc định im lặng là lựa chọn thận trọng, và đó là lý do "tôi quên <code>no shutdown</code>" là lỗi người mới hay mắc nhất trong cả môn này.</p>`],

      [3, 'The prompt tells you which mode you are in',
        `<p>IOS has modes, and the prompt is not decoration — it is the single most useful piece of information on the screen.</p>
<ul>
<li><code>Router&gt;</code> <strong>user EXEC.</strong> Look, do not touch. A handful of basic show commands and <code>ping</code>.</li>
<li><code>Router#</code> <strong>privileged EXEC.</strong> Every show command, <code>reload</code>, <code>copy</code>, <code>debug</code>. Reached with <code>enable</code>.</li>
<li><code>Router(config)#</code> <strong>global configuration.</strong> Changes that affect the whole device. Reached with <code>configure terminal</code>.</li>
<li><code>Router(config-if)#</code> <strong>interface configuration.</strong> Changes that affect one interface. There are many such sub-modes: <code>config-line</code>, <code>config-router</code>, <code>config-vlan</code>.</li>
</ul>
<p><strong>The practical consequence.</strong> A command that IOS rejects is usually the right command typed in the wrong mode, not a wrong command. Before re-reading the syntax, read the prompt. <code>exit</code> goes up one level, <code>end</code> or <kbd>Ctrl-Z</kbd> jumps straight back to privileged EXEC, and the <code>do</code> prefix lets you run an EXEC command without leaving config mode — <code>do show ip interface brief</code> saves a great deal of typing.</p>`,
        `<p>IOS có các chế độ, và dấu nhắc không phải đồ trang trí — nó là mẩu thông tin hữu ích nhất trên màn hình.</p>
<ul>
<li><code>Router&gt;</code> <strong>user EXEC.</strong> Nhìn, đừng đụng. Một nhúm lệnh show cơ bản và <code>ping</code>.</li>
<li><code>Router#</code> <strong>privileged EXEC.</strong> Mọi lệnh show, <code>reload</code>, <code>copy</code>, <code>debug</code>. Vào bằng <code>enable</code>.</li>
<li><code>Router(config)#</code> <strong>cấu hình toàn cục.</strong> Những thay đổi tác động lên cả thiết bị. Vào bằng <code>configure terminal</code>.</li>
<li><code>Router(config-if)#</code> <strong>cấu hình cổng.</strong> Những thay đổi chỉ tác động lên một cổng. Có nhiều chế độ con như vậy: <code>config-line</code>, <code>config-router</code>, <code>config-vlan</code>.</li>
</ul>
<p><strong>Hệ quả thực tế.</strong> Một lệnh bị IOS từ chối thường là lệnh ĐÚNG gõ ở chế độ SAI, chứ không phải lệnh sai. Trước khi đi đọc lại cú pháp, hãy đọc dấu nhắc. <code>exit</code> lùi lên một cấp, <code>end</code> hoặc <kbd>Ctrl-Z</kbd> nhảy thẳng về privileged EXEC, và tiền tố <code>do</code> cho phép chạy một lệnh EXEC mà không cần rời chế độ cấu hình — <code>do show ip interface brief</code> tiết kiệm rất nhiều thao tác gõ.</p>`],

      [4, 'The initial-settings checklist, in order',
        `<p>Six steps, and the order is not arbitrary.</p>
<ol>
<li><strong>Name the device.</strong> Do it first, because every prompt, log line and screenshot afterwards carries it. It is free context that costs one command.</li>
<li><strong>Secure privileged EXEC</strong> with <code>enable secret</code>.</li>
<li><strong>Secure the lines</strong> — console and VTY, each needing a password <em>and</em> the word <code>login</code>.</li>
<li><strong>Encrypt the plaintext leftovers</strong> with <code>service password-encryption</code>.</li>
<li><strong>Legal banner.</strong></li>
<li><strong>Save</strong> with <code>copy running-config startup-config</code>.</li>
</ol>
<p><strong>Why order matters:</strong> step 3 is the step that can lock you out of your own device. Configure access methods carefully, keep your existing session open, and test the new one from a second window <em>before</em> you disconnect. This applies identically on Cisco and on a Linux server, and the number of people who have locked themselves out of a remote machine by editing SSH configuration and immediately disconnecting is very large.</p>`,
        `<p>Sáu bước, và thứ tự không phải tuỳ tiện.</p>
<ol>
<li><strong>Đặt tên thiết bị.</strong> Làm đầu tiên, vì mọi dấu nhắc, mọi dòng log và mọi ảnh chụp màn hình sau đó đều mang nó theo. Đó là ngữ cảnh miễn phí đổi lấy một câu lệnh.</li>
<li><strong>Khoá privileged EXEC</strong> bằng <code>enable secret</code>.</li>
<li><strong>Khoá các dòng truy cập</strong> — console và VTY, mỗi cái cần một mật khẩu <em>và</em> chữ <code>login</code>.</li>
<li><strong>Mã hoá phần còn sót dạng chữ thường</strong> bằng <code>service password-encryption</code>.</li>
<li><strong>Banner pháp lý.</strong></li>
<li><strong>Lưu lại</strong> bằng <code>copy running-config startup-config</code>.</li>
</ol>
<p><strong>Vì sao thứ tự quan trọng:</strong> bước 3 là bước có thể khoá bạn ra khỏi chính thiết bị của bạn. Hãy cấu hình các đường truy cập một cách cẩn thận, giữ nguyên phiên đang mở, và thử đường mới từ một cửa sổ thứ hai <em>trước khi</em> ngắt kết nối. Điều này đúng y hệt trên Cisco lẫn trên một máy chủ Linux, và số người đã tự khoá mình ra khỏi một máy ở xa bằng cách sửa cấu hình SSH rồi ngắt luôn là rất lớn.</p>`],

      [5, 'Hostname and banner',
        `<p>Two commands, and the second one is more serious than it looks.</p>
<p><strong>The hostname changes the prompt immediately</strong>, which is the point: from that moment on, every line of output tells you which device you are talking to. In a lab with two consoles open this is the difference between a working exercise and forty minutes of confusion.</p>
<p><strong>The banner is a legal notice, not decoration.</strong> The <code>#</code> in the command is a delimiter that <em>you</em> choose — everything up to the next <code>#</code> is the banner text. Pick a character that does not appear in your message, or the banner will end early and the remainder will be interpreted as commands.</p>
<p><strong>Never write "Welcome".</strong> In several jurisdictions a banner that welcomes visitors has been argued as an invitation to connect, weakening a prosecution for unauthorised access. "Authorised access only. Activity is logged." states the opposite. This is one of the very few places where the exact wording of a configuration line has legal weight.</p>`,
        `<p>Hai câu lệnh, và câu thứ hai nghiêm túc hơn vẻ ngoài của nó.</p>
<p><strong>Tên máy làm dấu nhắc đổi ngay lập tức</strong>, và đó chính là mục đích: từ giây phút đó, mọi dòng kết xuất đều cho bạn biết bạn đang nói chuyện với thiết bị nào. Trong một bài lab mở hai cửa sổ console thì đây là khác biệt giữa một bài làm trôi chảy và bốn mươi phút rối loạn.</p>
<p><strong>Banner là một thông báo pháp lý, không phải trang trí.</strong> Dấu <code>#</code> trong lệnh là một dấu phân cách do <em>bạn</em> chọn — mọi thứ cho tới dấu <code>#</code> kế tiếp là nội dung banner. Hãy chọn một ký tự không xuất hiện trong thông điệp của bạn, không thì banner sẽ kết thúc sớm và phần còn lại bị hiểu thành câu lệnh.</p>
<p><strong>Đừng bao giờ viết "Welcome".</strong> Ở một số nơi, một banner chào đón khách đã bị lập luận là lời mời kết nối, làm yếu đi việc truy tố hành vi truy cập trái phép. Câu "Authorised access only. Activity is logged." nói điều ngược lại. Đây là một trong rất ít chỗ mà chữ nghĩa chính xác của một dòng cấu hình có sức nặng pháp lý.</p>`],

      [6, 'enable secret, never enable password',
        `<p>Two commands that look interchangeable and are not.</p>
<p><strong><code>enable password</code> stores the password in plaintext</strong>, or as Cisco "type 7" if <code>service password-encryption</code> is on. Type 7 is a <em>reversible</em> Vigenère cipher whose key has been public for decades — any online tool decodes it in under a second. It is obfuscation, not encryption.</p>
<p><strong><code>enable secret</code> stores a one-way hash</strong> — MD5 (type 5) on older IOS, scrypt (type 9) on modern releases. It cannot be reversed, only guessed by brute force.</p>
<p><strong>If both are configured, <code>enable secret</code> wins and <code>enable password</code> is ignored entirely.</strong> That makes the weaker one a dangerous decoy sitting in your configuration: someone reading the file may believe they have found the real password, and someone auditing it will count it as a finding. Remove it with <code>no enable password</code>.</p>
<p><strong>What <code>service password-encryption</code> is actually for.</strong> It hides the line passwords from someone reading over your shoulder or looking at a screenshot. That is a real and useful threat to defend against. It is <em>not</em> protection against anyone who obtains the configuration file, and describing it that way in an exam answer will cost you the mark.</p>`,
        `<p>Hai câu lệnh trông có vẻ thay thế nhau được, và thật ra thì không.</p>
<p><strong><code>enable password</code> lưu mật khẩu dạng chữ thường</strong>, hoặc dạng "loại 7" của Cisco nếu có bật <code>service password-encryption</code>. Loại 7 là một phép mã Vigenère <em>đảo ngược được</em> mà khoá của nó đã công khai hàng chục năm — công cụ trực tuyến nào cũng giải trong chưa tới một giây. Đó là che mắt, không phải mã hoá.</p>
<p><strong><code>enable secret</code> lưu một giá trị băm một chiều</strong> — MD5 (loại 5) trên IOS đời cũ, scrypt (loại 9) trên bản mới. Không đảo ngược được, chỉ đoán được bằng cách thử vét cạn.</p>
<p><strong>Nếu cấu hình cả hai thì <code>enable secret</code> thắng và <code>enable password</code> bị bỏ qua hoàn toàn.</strong> Điều đó biến cái yếu hơn thành một con mồi nhử nguy hiểm nằm trong cấu hình của bạn: người đọc file có thể tưởng mình vừa tìm được mật khẩu thật, còn người đi kiểm toán sẽ ghi nó vào danh sách lỗi. Hãy gỡ nó bằng <code>no enable password</code>.</p>
<p><strong>Vậy <code>service password-encryption</code> thật ra để làm gì.</strong> Nó che mật khẩu của các dòng truy cập khỏi người đứng sau lưng nhìn trộm hoặc khỏi một ảnh chụp màn hình. Đó là một mối đe doạ có thật và đáng phòng. Nó <em>không</em> bảo vệ được trước người đã lấy được file cấu hình, và mô tả nó như vậy trong bài thi sẽ làm bạn mất điểm.</p>`],

      [7, 'Console and VTY lines',
        `<p>Two kinds of access, configured almost identically, with one word that decides whether any of it works.</p>
<p><strong>The word is <code>login</code>.</strong> Setting a password without it means the password is stored and <em>never asked for</em>. There is no error, no warning — the line simply lets anyone in. It is a silent, total failure, and it is on every exam.</p>
<ul>
<li><strong><code>line console 0</code></strong> — physical access through the blue cable. There is exactly one.</li>
<li><strong><code>line vty 0 4</code></strong> — the five virtual terminal lines a router uses for telnet and SSH. A switch has sixteen, <code>vty 0 15</code>.</li>
<li><strong><code>transport input ssh</code></strong> — the one line that makes remote access safe. The default on older IOS is <code>all</code>, which includes telnet, which sends your password across the network in clear text.</li>
<li><strong><code>logging synchronous</code></strong> — a small comfort with a large effect: without it, a log message can appear in the middle of the command you are typing, and you cannot tell what you have actually entered.</li>
<li><strong><code>exec-timeout</code></strong> — log out an idle session. <code>exec-timeout 0 0</code> means never, which is convenient in a lab and unacceptable in production.</li>
</ul>`,
        `<p>Hai kiểu truy cập, cấu hình gần như giống hệt nhau, với đúng một chữ quyết định xem tất cả những thứ kia có tác dụng hay không.</p>
<p><strong>Chữ đó là <code>login</code>.</strong> Đặt mật khẩu mà không có nó nghĩa là mật khẩu được lưu lại và <em>không bao giờ được hỏi tới</em>. Không có lỗi, không có cảnh báo — cái dòng đó chỉ đơn giản là cho ai cũng vào. Đó là một thất bại lặng lẽ và toàn diện, và nó có mặt trong mọi đề thi.</p>
<ul>
<li><strong><code>line console 0</code></strong> — truy cập vật lý qua sợi cáp xanh. Có đúng một cái.</li>
<li><strong><code>line vty 0 4</code></strong> — năm dòng terminal ảo mà router dùng cho telnet và SSH. Switch thì có mười sáu, <code>vty 0 15</code>.</li>
<li><strong><code>transport input ssh</code></strong> — dòng duy nhất làm cho truy cập từ xa trở nên an toàn. Mặc định trên IOS đời cũ là <code>all</code>, bao gồm cả telnet, thứ gửi mật khẩu của bạn qua mạng dưới dạng chữ thường.</li>
<li><strong><code>logging synchronous</code></strong> — một tiện nghi nhỏ với hiệu quả lớn: không có nó, một dòng log có thể nhảy vào giữa câu lệnh bạn đang gõ, và bạn không còn biết mình đã gõ được những gì.</li>
<li><strong><code>exec-timeout</code></strong> — tự thoát một phiên đang rảnh. <code>exec-timeout 0 0</code> nghĩa là không bao giờ, tiện trong phòng lab và không chấp nhận được trên hệ thống thật.</li>
</ul>`],

      [8, 'SSH properly — five prerequisites, all mandatory',
        `<p>SSH on IOS needs five things, and missing any one of them produces a different confusing error.</p>
<ol>
<li><strong>A hostname that is not "Router".</strong></li>
<li><strong>A domain name</strong> — <code>ip domain-name lab.local</code>.</li>
<li><strong>An RSA key</strong> — <code>crypto key generate rsa modulus 2048</code>. Use 2048 or more; 512 is still accepted and is worthless.</li>
<li><strong>Version 2 only</strong> — <code>ip ssh version 2</code>. Version 1 has known breaks.</li>
<li><strong>A username</strong> — <code>username admin secret …</code>. SSH authenticates a <em>user</em>, not just a line.</li>
</ol>
<p><strong>Why the first two come before the key.</strong> The RSA key is named after the fully qualified domain name of the device — <code>R1.lab.local</code>. With the defaults in place, IOS has nothing sensible to name the key after and refuses the command outright. Students who have not been told this spend a long time re-typing a command that is correct.</p>
<p><strong>And the line that ties it together:</strong> <code>login local</code> on the VTY lines, not plain <code>login</code>. Plain <code>login</code> uses the line password; <code>login local</code> uses the username database, which is what SSH requires.</p>`,
        `<p>SSH trên IOS cần năm thứ, và thiếu bất cứ thứ nào cũng đẻ ra một thông báo lỗi khó hiểu khác nhau.</p>
<ol>
<li><strong>Một tên máy không phải "Router".</strong></li>
<li><strong>Một tên miền</strong> — <code>ip domain-name lab.local</code>.</li>
<li><strong>Một khoá RSA</strong> — <code>crypto key generate rsa modulus 2048</code>. Dùng 2048 trở lên; 512 vẫn được chấp nhận và vô giá trị.</li>
<li><strong>Chỉ dùng phiên bản 2</strong> — <code>ip ssh version 2</code>. Phiên bản 1 có lỗ hổng đã biết.</li>
<li><strong>Một tên người dùng</strong> — <code>username admin secret …</code>. SSH xác thực một <em>người dùng</em>, không phải chỉ một dòng truy cập.</li>
</ol>
<p><strong>Vì sao hai thứ đầu phải có trước cái khoá.</strong> Khoá RSA được đặt tên theo tên miền đầy đủ của thiết bị — <code>R1.lab.local</code>. Với cấu hình mặc định, IOS không có gì hợp lý để đặt tên cho khoá nên nó từ chối thẳng câu lệnh. Sinh viên không được báo trước điều này sẽ mất rất nhiều thời gian gõ lại một câu lệnh vốn đã đúng.</p>
<p><strong>Và câu lệnh buộc tất cả lại với nhau:</strong> <code>login local</code> trên các dòng VTY, chứ không phải <code>login</code> trơn. <code>login</code> trơn dùng mật khẩu của dòng; <code>login local</code> dùng cơ sở dữ liệu tên người dùng, và đó là thứ SSH đòi hỏi.</p>`],

      [9, '★ The same hardening, on your own Linux server',
        `<p>Everything on the previous slide has a direct Linux equivalent, and if you run a VPS this is the version you will actually use.</p>
<p><strong>The parallel is exact.</strong> Cisco's <code>transport input ssh</code> — refuse the insecure method — becomes Linux's <code>PasswordAuthentication no</code>. Cisco's <code>username … secret</code> becomes an SSH <em>key</em>, which is strictly better, because there is no password to guess at all.</p>
<p><strong>Install and test the key first.</strong> <code>ssh-copy-id</code> then log in with it, in a second window, before you disable passwords. This is the same rule as keeping your console session open.</p>
<p><strong>★ Two details that cost people hours.</strong></p>
<ul>
<li><strong>The <code>01-</code> prefix in the filename is load-bearing.</strong> sshd reads <code>*.conf</code> in alphabetical order and takes the <em>first</em> value it finds for each keyword. A file named <code>70-no-password.conf</code> loses to a pre-existing <code>50-cloud-init.conf</code> that says the opposite, and your change does nothing at all while every command reports success.</li>
<li><strong>Verify with <code>sshd -T</code>, not with <code>cat</code>.</strong> <code>sshd -T</code> prints the <em>effective</em> configuration after all files are merged. "I wrote it to the file" and "it is in effect" are two different claims, and only the second one matters.</li>
</ul>`,
        `<p>Mọi thứ ở slide trước đều có bản tương đương trực tiếp trên Linux, và nếu bạn có một con VPS thì đây mới là bản bạn thật sự dùng.</p>
<p><strong>Sự tương ứng là chính xác.</strong> Lệnh <code>transport input ssh</code> của Cisco — từ chối phương thức không an toàn — trở thành <code>PasswordAuthentication no</code> của Linux. Lệnh <code>username … secret</code> của Cisco trở thành một <em>khoá</em> SSH, thứ hơn hẳn, vì không còn mật khẩu nào để mà đoán.</p>
<p><strong>Cài và thử khoá TRƯỚC.</strong> Chạy <code>ssh-copy-id</code> rồi đăng nhập bằng nó, ở một cửa sổ thứ hai, trước khi tắt mật khẩu. Đây đúng là cái luật giữ nguyên phiên console đang mở.</p>
<p><strong>★ Hai chi tiết đã ngốn của người ta hàng giờ.</strong></p>
<ul>
<li><strong>Tiền tố <code>01-</code> trong tên file là thứ chịu lực.</strong> sshd đọc <code>*.conf</code> theo thứ tự chữ cái và lấy giá trị <em>ĐẦU TIÊN</em> nó thấy cho mỗi từ khoá. Một file tên <code>70-no-password.conf</code> sẽ thua một file <code>50-cloud-init.conf</code> có sẵn nói ngược lại, và thay đổi của bạn hoàn toàn không có tác dụng trong khi mọi câu lệnh đều báo thành công.</li>
<li><strong>Nghiệm thu bằng <code>sshd -T</code>, không phải bằng <code>cat</code>.</strong> <code>sshd -T</code> in ra cấu hình <em>đang có hiệu lực</em> sau khi mọi file đã gộp lại. "Tôi đã ghi vào file" và "nó đang có hiệu lực" là hai khẳng định khác nhau, và chỉ cái thứ hai mới đáng kể.</li>
</ul>`],

      [10, 'running-config and startup-config',
        `<p>This is the answer to the opening question, and it is the mistake every single person makes at least once.</p>
<p><strong>Two configurations exist simultaneously.</strong> <code>running-config</code> lives in RAM and is what the device is doing right now — every command you type lands there immediately. <code>startup-config</code> lives in NVRAM and is what will be loaded at the next boot. They are completely independent until you copy one over the other.</p>
<p><strong>So a device can be configured perfectly, work perfectly, and lose everything at the next power cut</strong>, with no damage and nobody at fault except the person who forgot <code>copy running-config startup-config</code>. Abbreviated, that is <code>copy run start</code>, or on many platforms simply <code>write memory</code> — one command, and it is the last line of every configuration session.</p>
<p><strong>The same property is your safety net.</strong> Type something catastrophic — shut down the interface you are connected through, apply an access list that blocks yourself — and as long as you have <em>not</em> saved, <code>reload</code> throws it all away and the device comes back exactly as it was. Experienced engineers use this deliberately: make risky changes, test them, and only save once you are certain.</p>
<p>★ Linux has the identical trap and no equivalent safety net. <code>ip addr add</code> lasts until reboot; the permanent version lives in netplan or NetworkManager. Slide 19 covers it.</p>`,
        `<p>Đây là lời đáp cho câu hỏi mở đầu, và nó là sai lầm mà ai cũng mắc ít nhất một lần.</p>
<p><strong>Hai cấu hình tồn tại cùng lúc.</strong> <code>running-config</code> nằm trong RAM và là thứ thiết bị đang làm ngay lúc này — mọi câu lệnh bạn gõ đều rơi vào đó ngay lập tức. <code>startup-config</code> nằm trong NVRAM và là thứ sẽ được nạp ở lần khởi động tới. Hai cái hoàn toàn độc lập cho tới khi bạn chép cái này đè lên cái kia.</p>
<p><strong>Nên một thiết bị có thể được cấu hình hoàn hảo, chạy hoàn hảo, rồi mất sạch ở lần mất điện kế tiếp</strong>, không hỏng hóc gì và không ai có lỗi ngoài người đã quên <code>copy running-config startup-config</code>. Viết tắt là <code>copy run start</code>, hoặc trên nhiều nền tảng thì đơn giản là <code>write memory</code> — một câu lệnh, và nó là dòng cuối cùng của mọi phiên cấu hình.</p>
<p><strong>Cũng chính tính chất đó là lưới an toàn của bạn.</strong> Gõ một thứ tai hại — tắt đúng cái cổng bạn đang kết nối qua, áp một danh sách truy cập chặn chính mình — và chừng nào bạn <em>chưa</em> lưu, lệnh <code>reload</code> sẽ vứt hết đi và thiết bị quay lại đúng như cũ. Kỹ sư có kinh nghiệm dùng điều này một cách có chủ ý: thực hiện thay đổi mạo hiểm, kiểm thử, và chỉ lưu khi đã chắc chắn.</p>
<p>★ Linux có đúng cái bẫy đó và không có lưới an toàn tương đương. <code>ip addr add</code> chỉ sống tới lúc khởi động lại; bản vĩnh viễn nằm trong netplan hoặc NetworkManager. Slide 19 nói về chuyện này.</p>`],
    ]),

    bi(
      `<h3>🔍 How to check this yourself</h3>
<p>In Packet Tracer, on a real router, or on your own Linux server — every claim above is checkable.</p>
<pre><code class="language-bash">! On IOS
show running-config              ! what is active right now
show startup-config              ! what will load at next boot
show version                     ! IOS version, uptime, and the configuration register
show ip ssh                      ! is SSH enabled, and which version
show crypto key mypubkey rsa     ! does the key exist, and what size
show users                       ! who is connected right now, on which line</code></pre>
<pre><code class="language-bash"># On Linux, the equivalent verification
sudo sshd -T | grep -E '^(passwordauthentication|permitrootlogin|port)'
systemctl is-enabled ssh.socket  # on Ubuntu 24.04, socket activation may own the port
who                              # who is logged in
last -n 5                        # recent logins</code></pre>
<h4>Reading the results</h4>
<ul>
<li>If <code>show running-config</code> and <code>show startup-config</code> differ, <strong>you have unsaved changes</strong>. That may be deliberate — you are testing — or it may be the outage you will have next month.</li>
<li><code>show ip ssh</code> reporting <em>SSH Disabled</em> means one of the five prerequisites is missing. Check for the RSA key first; it is the usual one.</li>
<li>On Linux, <code>sshd -T</code> is the only honest answer. Reading the file you just wrote tells you what you intended, not what is in effect — <strong>and those differ whenever another drop-in file sorts before yours.</strong></li>
<li><code>show users</code> before a reload is a courtesy that occasionally saves a colleague's afternoon.</li>
</ul>`,
      `<h3>🔍 Cách tự kiểm</h3>
<p>Trong Packet Tracer, trên router thật, hay trên chính máy chủ Linux của bạn — mọi khẳng định ở trên đều kiểm được.</p>
<pre><code class="language-bash">! Trên IOS
show running-config              ! thứ đang có hiệu lực ngay lúc này
show startup-config              ! thứ sẽ được nạp ở lần khởi động tới
show version                     ! phiên bản IOS, thời gian chạy, và thanh ghi cấu hình
show ip ssh                      ! SSH đã bật chưa, và phiên bản nào
show crypto key mypubkey rsa     ! khoá có tồn tại không, và dài bao nhiêu
show users                       ! ai đang kết nối lúc này, trên dòng nào</code></pre>
<pre><code class="language-bash"># Trên Linux, phần nghiệm thu tương đương
sudo sshd -T | grep -E '^(passwordauthentication|permitrootlogin|port)'
systemctl is-enabled ssh.socket  # trên Ubuntu 24.04, socket activation có thể đang giữ cổng
who                              # ai đang đăng nhập
last -n 5                        # các lần đăng nhập gần đây</code></pre>
<h4>Đọc kết quả</h4>
<ul>
<li>Nếu <code>show running-config</code> và <code>show startup-config</code> khác nhau thì <strong>bạn đang có thay đổi chưa lưu</strong>. Điều đó có thể là cố ý — bạn đang thử nghiệm — hoặc có thể là sự cố bạn sẽ gặp vào tháng sau.</li>
<li><code>show ip ssh</code> báo <em>SSH Disabled</em> nghĩa là thiếu một trong năm điều kiện. Kiểm cái khoá RSA trước; nó là thủ phạm thường gặp.</li>
<li>Trên Linux, <code>sshd -T</code> là câu trả lời thành thật duy nhất. Đọc cái file bạn vừa ghi chỉ cho biết bạn định làm gì, không cho biết cái gì đang có hiệu lực — <strong>và hai thứ đó khác nhau mỗi khi có một file drop-in khác sắp xếp trước file của bạn.</strong></li>
<li>Chạy <code>show users</code> trước khi reload là một phép lịch sự thỉnh thoảng cứu được cả buổi chiều của đồng nghiệp.</li>
</ul>`,
    ),

    bi(
      `<h3>⚠️ Mistakes people actually make</h3>
<ol>
<li><strong>Forgetting <code>copy run start</code>.</strong> Everything works, then a power cut erases it. <em>Symptom:</em> a device that mysteriously reverts to factory settings, and a long argument about whether somebody reset it.</li>
<li><strong>Setting a line password without <code>login</code>.</strong> The password is stored and never requested. <em>Symptom:</em> no symptom at all until an audit or an intruder finds it — which is what makes it the worst one on this list.</li>
<li><strong>Using <code>enable password</code> and thinking it is secured.</strong> Type 7 is reversible in a second. <em>Symptom:</em> a security finding, or a compromise.</li>
<li><strong>Trying to generate an RSA key before setting hostname and domain name.</strong> The command is refused with a message about the fully qualified domain name. <em>Symptom:</em> re-typing a correct command repeatedly.</li>
<li><strong>Configuring <code>transport input ssh</code> but leaving plain <code>login</code>.</strong> SSH needs a username; <code>login</code> only knows the line password. <em>Symptom:</em> connection refused or immediate authentication failure.</li>
<li><strong>Locking yourself out.</strong> Applying an access restriction over the very session you are using, then disconnecting to test it. <em>Symptom:</em> a drive to the data centre, or on a VPS, a support ticket. Always keep a second session open.</li>
<li><strong>★ On Linux: writing an sshd drop-in with a high-numbered filename.</strong> Alphabetical order decides, and first value wins. <em>Symptom:</em> <code>sshd -t</code> passes, <code>reload</code> succeeds, exit code 0, and the setting is not in effect.</li>
</ol>`,
      `<h3>⚠️ Bẫy hay mắc</h3>
<ol>
<li><strong>Quên <code>copy run start</code>.</strong> Mọi thứ chạy, rồi một lần mất điện xoá sạch. <em>Triệu chứng:</em> một thiết bị bí ẩn quay về cấu hình nhà máy, và một cuộc tranh cãi dài về việc có ai reset nó không.</li>
<li><strong>Đặt mật khẩu cho dòng truy cập mà không có <code>login</code>.</strong> Mật khẩu được lưu và không bao giờ được hỏi. <em>Triệu chứng:</em> hoàn toàn không có triệu chứng nào cho tới khi một cuộc kiểm toán hoặc một kẻ xâm nhập tìm ra — và chính điều đó làm nó thành cái tệ nhất trong danh sách này.</li>
<li><strong>Dùng <code>enable password</code> rồi tưởng là đã khoá.</strong> Loại 7 đảo ngược được trong một giây. <em>Triệu chứng:</em> một lỗi bảo mật bị ghi nhận, hoặc một vụ xâm nhập.</li>
<li><strong>Cố sinh khoá RSA trước khi đặt tên máy và tên miền.</strong> Câu lệnh bị từ chối kèm thông báo về tên miền đầy đủ. <em>Triệu chứng:</em> gõ đi gõ lại một câu lệnh vốn đã đúng.</li>
<li><strong>Cấu hình <code>transport input ssh</code> mà vẫn để <code>login</code> trơn.</strong> SSH cần tên người dùng; <code>login</code> chỉ biết mật khẩu của dòng. <em>Triệu chứng:</em> kết nối bị từ chối hoặc xác thực hỏng ngay.</li>
<li><strong>Tự khoá mình ở ngoài.</strong> Áp một hạn chế truy cập lên đúng cái phiên bạn đang dùng, rồi ngắt kết nối để thử. <em>Triệu chứng:</em> một chuyến đi tới trung tâm dữ liệu, hoặc với VPS thì là một cái ticket hỗ trợ. Luôn giữ một phiên thứ hai đang mở.</li>
<li><strong>★ Trên Linux: viết một file drop-in cho sshd với số thứ tự cao.</strong> Thứ tự chữ cái quyết định, và giá trị đầu tiên thắng. <em>Triệu chứng:</em> <code>sshd -t</code> xanh, <code>reload</code> thành công, mã thoát 0, và thiết lập không hề có hiệu lực.</li>
</ol>`,
    ),

    bi(
      `<h3>✍️ Exercises — with full worked answers</h3>
<p><strong>1.</strong> You type <code>ip address 192.168.1.1 255.255.255.0</code> at the <code>R1(config)#</code> prompt and IOS rejects it. What is wrong?</p>
<p><strong>2.</strong> A configuration has both <code>enable password cisco</code> and <code>enable secret class</code>. Which one must you type at the prompt, and what should you do about the other?</p>
<p><strong>3.</strong> Someone configured <code>line vty 0 4</code>, <code>password letmein</code>, and nothing else. What happens when a user connects?</p>
<p><strong>4.</strong> <code>crypto key generate rsa</code> is refused. Give the two most likely reasons, in order.</p>
<p><strong>5.</strong> You need to test a risky access-list change on a remote router. Describe a procedure that cannot lock you out permanently.</p>
<hr>
<h4>Answers</h4>
<p><strong>1. Wrong mode.</strong> <code>ip address</code> belongs to interface configuration, not global configuration. The command is correct; the prompt is not. Enter <code>interface g0/0</code> first, and the prompt becomes <code>R1(config-if)#</code>. Reading the prompt before re-reading the syntax would have found this in one second — this is the single most common cause of "the command does not work".</p>
<p><strong>2. You type <code>class</code>.</strong> When both exist, <code>enable secret</code> takes precedence and <code>enable password</code> is completely ignored. You should remove the weaker one with <code>no enable password</code>: it is a decoy that misleads anyone reading the configuration, and it is a finding in any audit. It also encourages the dangerous belief that <code>service password-encryption</code> makes type 7 safe, which it does not.</p>
<p><strong>3. The user gets straight in with no password prompt at all.</strong> Without the <code>login</code> keyword, the configured password is never checked. This is the silent failure: there is no error message, the configuration <em>looks</em> secure to a quick reader, and the line is wide open. Add <code>login</code> — or better, <code>login local</code> with a username, and <code>transport input ssh</code>.</p>
<p><strong>4.</strong> <strong>(a)</strong> The hostname is still the default <code>Router</code>, or no domain name has been set — the key is named after the fully qualified domain name, so IOS has nothing to name it after. Fix with <code>hostname R1</code> and <code>ip domain-name lab.local</code>. <strong>(b)</strong> The IOS image does not include cryptographic features; some older or restricted images simply do not have the command. <code>show version</code> tells you which image is running.</p>
<p><strong>5.</strong> Three layers of protection, any one of which is enough: <strong>(a)</strong> keep a second session open and never close it until the change is verified from a <em>third</em> one; <strong>(b)</strong> do <strong>not</strong> save — if you lock yourself out, the device is one power cycle away from the last saved configuration; <strong>(c)</strong> best of all, schedule the undo before you make the change: <code>reload in 10</code> arms an automatic reboot in ten minutes, which you cancel with <code>reload cancel</code> once you have confirmed you still have access. That converts a permanent lockout into a ten-minute outage.</p>`,
      `<h3>✍️ Bài tập — có lời giải đầy đủ</h3>
<p><strong>1.</strong> Bạn gõ <code>ip address 192.168.1.1 255.255.255.0</code> ở dấu nhắc <code>R1(config)#</code> và IOS từ chối. Sai ở đâu?</p>
<p><strong>2.</strong> Một cấu hình có cả <code>enable password cisco</code> lẫn <code>enable secret class</code>. Bạn phải gõ cái nào ở dấu nhắc, và nên làm gì với cái còn lại?</p>
<p><strong>3.</strong> Có người cấu hình <code>line vty 0 4</code>, <code>password letmein</code>, và không gì khác. Chuyện gì xảy ra khi một người dùng kết nối vào?</p>
<p><strong>4.</strong> Lệnh <code>crypto key generate rsa</code> bị từ chối. Nêu hai lý do nhiều khả năng nhất, theo thứ tự.</p>
<p><strong>5.</strong> Bạn cần thử một thay đổi access-list mạo hiểm trên một router ở xa. Hãy mô tả một quy trình không thể khoá bạn ở ngoài vĩnh viễn.</p>
<hr>
<h4>Lời giải</h4>
<p><strong>1. Sai chế độ.</strong> <code>ip address</code> thuộc chế độ cấu hình cổng, không phải cấu hình toàn cục. Câu lệnh thì đúng; dấu nhắc thì sai. Hãy vào <code>interface g0/0</code> trước, và dấu nhắc sẽ thành <code>R1(config-if)#</code>. Đọc dấu nhắc trước khi đi đọc lại cú pháp thì đã tìm ra chuyện này trong một giây — đây là nguyên nhân phổ biến nhất của câu "cái lệnh này không chạy".</p>
<p><strong>2. Bạn gõ <code>class</code>.</strong> Khi cả hai cùng tồn tại, <code>enable secret</code> được ưu tiên và <code>enable password</code> bị bỏ qua hoàn toàn. Bạn nên gỡ cái yếu hơn bằng <code>no enable password</code>: nó là con mồi nhử làm người đọc cấu hình hiểu sai, và nó là một lỗi trong mọi cuộc kiểm toán. Nó còn nuôi dưỡng niềm tin nguy hiểm rằng <code>service password-encryption</code> làm cho loại 7 trở nên an toàn, điều hoàn toàn không đúng.</p>
<p><strong>3. Người dùng vào thẳng, không bị hỏi mật khẩu gì cả.</strong> Không có từ khoá <code>login</code> thì mật khẩu đã cấu hình không bao giờ được kiểm. Đây chính là thất bại lặng lẽ: không có thông báo lỗi nào, cấu hình <em>trông</em> có vẻ an toàn với người đọc lướt, và cái dòng đó thì mở toang. Hãy thêm <code>login</code> — hoặc tốt hơn là <code>login local</code> kèm một tên người dùng, và <code>transport input ssh</code>.</p>
<p><strong>4.</strong> <strong>(a)</strong> Tên máy vẫn là mặc định <code>Router</code>, hoặc chưa đặt tên miền — khoá được đặt tên theo tên miền đầy đủ, nên IOS không có gì để đặt tên cho nó. Sửa bằng <code>hostname R1</code> và <code>ip domain-name lab.local</code>. <strong>(b)</strong> Bản IOS đang chạy không có tính năng mã hoá; một số bản cũ hoặc bản bị giới hạn đơn giản là không có câu lệnh đó. <code>show version</code> cho biết đang chạy bản nào.</p>
<p><strong>5.</strong> Ba lớp bảo vệ, chỉ cần một lớp là đủ: <strong>(a)</strong> giữ một phiên thứ hai đang mở và đừng đóng nó cho tới khi đã kiểm chứng thay đổi từ một phiên <em>thứ ba</em>; <strong>(b)</strong> <strong>đừng</strong> lưu — nếu bạn tự khoá mình ở ngoài thì thiết bị chỉ cách một lần tắt bật nguồn là quay về cấu hình đã lưu lần cuối; <strong>(c)</strong> hay nhất là hẹn sẵn lệnh hoàn tác trước khi thay đổi: <code>reload in 10</code> hẹn khởi động lại sau mười phút, và bạn huỷ nó bằng <code>reload cancel</code> khi đã xác nhận mình vẫn vào được. Cách đó biến một vụ khoá vĩnh viễn thành một lần gián đoạn mười phút.</p>`,
    ),

    bi(
      `<h3>📋 A note on the school's question for this session</h3>
<p>FLM assigns session 26 the question <strong>CQ9.2 — "How does Neighbor Discovery operate on a network?"</strong>. Neighbor Discovery is Chapter 8, and it was covered in full in <strong>Lesson 8.2</strong>: Neighbor Solicitation (ICMPv6 135) to a solicited-node multicast group, Neighbor Advertisement (136) in reply, Router Solicitation and Advertisement (133/134) for finding the gateway, and mandatory Duplicate Address Detection.</p>
<p>The question numbering continues to run about one chapter behind the session plan, exactly as noted in Chapters 7 and 8. We quote the table as published and point to where each question was answered.</p>`,
      `<h3>📋 Ghi chú về câu hỏi của trường cho buổi này</h3>
<p>FLM gán cho buổi 26 câu hỏi <strong>CQ9.2 — "How does Neighbor Discovery operate on a network?"</strong>. Neighbor Discovery là chương 8, và nó đã được phủ đầy đủ ở <strong>bài 8.2</strong>: Neighbor Solicitation (ICMPv6 135) gửi tới nhóm multicast solicited-node, Neighbor Advertisement (136) đáp lại, Router Solicitation và Advertisement (133/134) để tìm cổng ra, và Duplicate Address Detection bắt buộc.</p>
<p>Cách đánh số câu hỏi vẫn chạy chậm hơn kế hoạch buổi học khoảng một chương, đúng như đã nêu ở chương 7 và 8. Chúng tôi trích bảng đúng như đã công bố và chỉ ra chỗ từng câu đã được trả lời.</p>`,
    ),

    cq(26, [
      ['CQ9.2', 'How does Neighbor Discovery operate on a network? <em>— content belongs to Chapter 8; answered in full in Lesson 8.2 (NS/NA over ICMPv6, solicited-node multicast, RS/RA and SLAAC, mandatory DAD).</em>',
        'How does Neighbor Discovery operate on a network? <em>— nội dung thuộc chương 8; đã trả lời đầy đủ ở bài 8.2 (NS/NA qua ICMPv6, multicast solicited-node, RS/RA và SLAAC, DAD bắt buộc).</em>'],
    ]),
  ].join('\n'),
};

/* ──────────────────────── Lesson 9.2 — session 27 ──────────────────────── */

const L2 = {
  title: '9.2 — Configuring interfaces and the default gateway (FLM session 27)|||9.2 — Cấu hình cổng mạng và cổng ra mặc định (buổi 27 của FLM)',
  slug: 'nwc204-9-2-cau-hinh-cong-va-default-gateway',
  type: 'DOCUMENT',
  description: 'Buổi 27: ba lệnh cấu hình một cổng và vì sao lệnh thứ ba hay bị quên, vì sao cổng router xuất xưởng ở trạng thái tắt, đọc cột Status và Protocol như tầng 1 và tầng 2, cổng serial cùng clock rate, cổng ra mặc định trên switch khác tuyến mặc định trên router ra sao, và phần ★ làm đúng ba bước đó trên Linux cùng cách khiến chúng sống sót sau khởi động lại. Bảng gốc của trường nhảy qua mục 9.3.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 9 · Lesson 9.2 · FLM session 27 of 60 · CLO3, CLO8, CLO9 · Cisco Module 10</span>
<h2>Three commands, and the one everybody forgets</h2>
<p class="lead">Configuring an interface is short enough to memorise in a minute. Getting it wrong is also short: there are about five distinct ways, each with a recognisable symptom, and this lesson is mostly about learning to read those symptoms instead of guessing.</p>
<p><strong>Opening question:</strong> <code>show ip interface brief</code> reports an interface as <strong>up / up</strong>. The address column shows a correct address. And yet <code>show ip route</code> lists no connected route for that network, and nothing on that segment is reachable. How is that possible, and which of the two commands is lying to you?</p>
<p class="note">★ marks material added by cuongthai.com beyond Cisco Module 10.</p>
<p class="note">⚠️ The published session plan lists <strong>9.2</strong> and then jumps to <strong>9.4</strong>. There is no 9.3 anywhere in the FLM table. We cover what is listed.</p>`,
      `<span class="eyebrow">NWC204 · Chương 9 · Bài 9.2 · Buổi 27/60 của FLM · CLO3, CLO8, CLO9 · Cisco Module 10</span>
<h2>Ba câu lệnh, và cái mà ai cũng quên</h2>
<p class="lead">Cấu hình một cổng mạng ngắn tới mức học thuộc trong một phút. Làm sai nó cũng ngắn: có khoảng năm cách sai khác nhau, mỗi cách một triệu chứng nhận ra được, và bài này chủ yếu là học cách đọc những triệu chứng ấy thay vì ngồi đoán.</p>
<p><strong>Câu hỏi mở đầu:</strong> <code>show ip interface brief</code> báo một cổng ở trạng thái <strong>up / up</strong>. Cột địa chỉ hiện một địa chỉ đúng. Vậy mà <code>show ip route</code> không liệt kê tuyến kết nối nào cho mạng đó, và không có gì trên đoạn mạng ấy tới được. Chuyện đó xảy ra bằng cách nào, và trong hai câu lệnh thì cái nào đang nói dối bạn?</p>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 10.</p>
<p class="note">⚠️ Kế hoạch buổi học đã công bố liệt kê <strong>9.2</strong> rồi nhảy sang <strong>9.4</strong>. Không có mục 9.3 nào trong bảng của FLM. Chúng tôi dạy đúng những gì được liệt kê.</p>`,
    ),

    walkHead('nwc204-ch09', 11, 19,
      'Slides 11–19 cover FLM session 27: 9.2 Configure Interfaces and 9.4 Configure the Default Gateway.',
      'Slide 11–19 là buổi 27 của FLM: 9.2 Configure Interfaces và 9.4 Configure the Default Gateway.'),

    walk('nwc204-ch09', [
      [11, '9.2 Configure interfaces — three commands, every time',
        `<p>Every interface block has the same shape, and it is worth typing it the same way every single time so that the missing line is obvious.</p>
<ul>
<li><strong><code>description</code></strong> — optional, and the first thing you will wish you had written six months later when you are looking at someone else's configuration at two in the morning. It costs nothing and appears in <code>show interfaces description</code>.</li>
<li><strong><code>ip address &lt;address&gt; &lt;mask&gt;</code></strong> — IOS wants dotted decimal, not slash notation. <code>255.255.255.0</code>, not <code>/24</code>.</li>
<li><strong><code>no shutdown</code></strong> — the one everybody forgets, and the reason the next two slides exist.</li>
</ul>
<p><strong>Note the /30 on the WAN link.</strong> <code>255.255.255.252</code> gives four addresses: one network, one broadcast, and exactly two usable — which is precisely what a point-to-point link between two routers needs. Using a /24 there would waste 252 addresses on a link that can never hold more than two devices. You will do this arithmetic properly in Chapter 10.</p>`,
        `<p>Mọi khối cấu hình cổng đều có cùng một dáng, và đáng để gõ nó theo đúng một cách mọi lần, để cái dòng bị thiếu lộ ra ngay.</p>
<ul>
<li><strong><code>description</code></strong> — tuỳ chọn, và là thứ đầu tiên bạn sẽ ước mình đã viết, sáu tháng sau, lúc hai giờ sáng đang nhìn vào cấu hình của người khác. Nó không tốn gì và hiện ra trong <code>show interfaces description</code>.</li>
<li><strong><code>ip address &lt;địa chỉ&gt; &lt;mặt nạ&gt;</code></strong> — IOS muốn dạng bốn số, không phải dạng gạch chéo. <code>255.255.255.0</code>, không phải <code>/24</code>.</li>
<li><strong><code>no shutdown</code></strong> — cái mà ai cũng quên, và là lý do hai slide tiếp theo tồn tại.</li>
</ul>
<p><strong>Để ý cái /30 trên đường link WAN.</strong> <code>255.255.255.252</code> cho bốn địa chỉ: một địa chỉ mạng, một địa chỉ quảng bá, và đúng hai cái dùng được — đúng bằng thứ mà một đường link điểm-tới-điểm giữa hai router cần. Dùng /24 ở đó là phí 252 địa chỉ cho một đường link không bao giờ chứa nổi quá hai thiết bị. Bạn sẽ làm phép tính này cho đến nơi đến chốn ở chương 10.</p>`],

      [12, 'Why interfaces ship shut, and what it costs you',
        `<p>Router interfaces default to <strong>administratively down</strong>. Switch ports default to <strong>enabled</strong>. The asymmetry is deliberate and it is worth understanding rather than memorising.</p>
<p><strong>The reason.</strong> A switch port that comes up does very little harm — at worst it learns some MAC addresses. A router interface that comes up starts <em>forwarding between networks</em>, which is a policy decision nobody has made yet, and in the wrong topology it can form a loop that takes down a link. Defaulting to silent means a router can be racked, cabled and powered on safely before anyone has decided what it should do.</p>
<p><strong>The cost.</strong> It is the single most common beginner fault in this course: address configured correctly, mask correct, cable in the right port, and nothing works. The symptom in <code>show ip interface brief</code> is <strong>administratively down / down</strong>, and the fix is one command.</p>
<p><strong>Build the habit now:</strong> every interface block you type ends with <code>no shutdown</code>, even when you are sure it is already up. The command is idempotent — typing it on an interface that is already enabled does nothing at all — so there is no cost to always including it, and a real cost to sometimes forgetting.</p>`,
        `<p>Cổng router mặc định là <strong>administratively down</strong>. Cổng switch mặc định là <strong>đang bật</strong>. Sự bất đối xứng này là có chủ ý và đáng hiểu chứ đừng học vẹt.</p>
<p><strong>Lý do.</strong> Một cổng switch bật lên thì hại rất ít — cùng lắm là nó học được vài địa chỉ MAC. Một cổng router bật lên thì bắt đầu <em>chuyển tiếp giữa các mạng</em>, mà đó là một quyết định chính sách chưa ai đưa ra, và trong một tô-pô sai nó có thể tạo ra một vòng lặp kéo sập cả đường link. Mặc định im lặng nghĩa là một con router có thể được lắp vào rack, cắm dây và bật nguồn một cách an toàn trước khi có người quyết định nó phải làm gì.</p>
<p><strong>Cái giá.</strong> Đây là lỗi người mới hay mắc nhất trong cả môn: địa chỉ đặt đúng, mặt nạ đúng, dây cắm đúng cổng, và không có gì chạy. Triệu chứng trong <code>show ip interface brief</code> là <strong>administratively down / down</strong>, và cách sửa là một câu lệnh.</p>
<p><strong>Hãy tạo thói quen ngay bây giờ:</strong> mọi khối cấu hình cổng bạn gõ đều kết thúc bằng <code>no shutdown</code>, kể cả khi bạn chắc chắn nó đã bật rồi. Câu lệnh này bất biến — gõ nó lên một cổng đang bật thì hoàn toàn không có tác dụng gì — nên luôn gõ nó thì không tốn gì, còn thỉnh thoảng quên thì tốn thật.</p>`],

      [13, 'Reading show ip interface brief',
        `<p>Two columns, two layers, and reading them in the right order turns a vague fault into a named one.</p>
<p><strong>Column 1, Status, is layer 1.</strong> Is there a physical signal? <strong>Column 2, Protocol, is layer 2.</strong> Is the data link working?</p>
<ul>
<li><strong>up / up</strong> — both layers fine. If something still does not work, the fault is at layer 3 or above, and you should stop looking at the cable.</li>
<li><strong>up / down</strong> — the cable is fine, the data link is not. On a serial link this is almost always a missing <code>clock rate</code> on the DCE end, or mismatched encapsulation between the two ends. On Ethernet it is rare and usually means a keepalive problem.</li>
<li><strong>down / down</strong> — no signal at all. Cable, wrong port, far end powered off, or a dead transceiver.</li>
<li><strong>administratively down / down</strong> — somebody typed <code>shutdown</code>, or nobody ever typed <code>no shutdown</code>. <strong>This is never a fault</strong>, it is a state, and the fix is one command.</li>
</ul>
<p><strong>And note what cannot appear: there is no "down / up".</strong> Layer 2 cannot operate while layer 1 is dead. If you ever think you have seen it, you have misread the columns — which is itself a useful sanity check on your reading.</p>`,
        `<p>Hai cột, hai tầng, và đọc chúng theo đúng thứ tự sẽ biến một lỗi mơ hồ thành một lỗi có tên.</p>
<p><strong>Cột 1, Status, là tầng 1.</strong> Có tín hiệu vật lý không? <strong>Cột 2, Protocol, là tầng 2.</strong> Liên kết dữ liệu có chạy không?</p>
<ul>
<li><strong>up / up</strong> — cả hai tầng đều ổn. Nếu vẫn có gì đó không chạy thì lỗi nằm ở tầng 3 trở lên, và bạn nên thôi nhìn vào sợi dây.</li>
<li><strong>up / down</strong> — sợi dây thì ổn, liên kết dữ liệu thì không. Trên đường serial thì gần như luôn là thiếu <code>clock rate</code> ở đầu DCE, hoặc hai đầu lệch cách đóng gói. Trên Ethernet thì hiếm và thường là chuyện keepalive.</li>
<li><strong>down / down</strong> — hoàn toàn không có tín hiệu. Dây, nhầm cổng, đầu kia tắt nguồn, hoặc một bộ thu phát chết.</li>
<li><strong>administratively down / down</strong> — có người gõ <code>shutdown</code>, hoặc chưa ai từng gõ <code>no shutdown</code>. <strong>Đây không bao giờ là lỗi</strong>, nó là một trạng thái, và cách sửa là một câu lệnh.</li>
</ul>
<p><strong>Và để ý thứ không thể xuất hiện: không có "down / up".</strong> Tầng 2 không thể hoạt động khi tầng 1 đã chết. Nếu bạn tưởng mình thấy nó thì bạn đã đọc nhầm hai cột — và bản thân điều đó là một phép kiểm tỉnh táo hữu ích cho cách đọc của bạn.</p>`],

      [14, 'What the verification actually looks like',
        `<p>Three interfaces, three different states, and the second command is the one that answers this lesson's opening question.</p>
<p><code>show ip interface brief</code> tells you about layers 1 and 2. It does <em>not</em> tell you whether the router will route for that network. For that you need <code>show ip route connected</code>, and the rule is simple: <strong>an interface produces a connected route only when it is up/up AND has an address.</strong></p>
<p><strong>So the answer to the opening question is that neither command is lying.</strong> An interface can be genuinely up/up — cable fine, link fine — and still have no usable address, for instance because the address was typed in the wrong interface sub-mode and landed on a different interface, or because a later command overwrote it. The interface is healthy at layers 1 and 2 and invisible at layer 3.</p>
<p><strong>This is why the connected-route check belongs in your routine</strong>, not just the brief. A router routes only for networks it can see, and <code>show ip route</code> is the only place that tells you what it can see.</p>`,
        `<p>Ba cổng, ba trạng thái khác nhau, và câu lệnh thứ hai chính là thứ trả lời câu hỏi mở đầu của bài này.</p>
<p><code>show ip interface brief</code> cho bạn biết về tầng 1 và tầng 2. Nó <em>không</em> cho biết router có định tuyến cho cái mạng đó hay không. Muốn biết điều đó thì cần <code>show ip route connected</code>, và luật thì đơn giản: <strong>một cổng chỉ sinh ra tuyến kết nối khi nó up/up VÀ có địa chỉ.</strong></p>
<p><strong>Nên lời đáp cho câu hỏi mở đầu là: không câu lệnh nào nói dối cả.</strong> Một cổng có thể thật sự up/up — dây ổn, link ổn — mà vẫn không có địa chỉ dùng được, ví dụ vì địa chỉ bị gõ nhầm vào chế độ con của một cổng khác nên rơi sang cổng đó, hoặc vì một câu lệnh sau đã ghi đè lên nó. Cổng ấy khoẻ mạnh ở tầng 1 và 2 và vô hình ở tầng 3.</p>
<p><strong>Đó là lý do phép kiểm tuyến kết nối phải nằm trong quy trình của bạn</strong>, chứ không chỉ mỗi lệnh brief. Một router chỉ định tuyến cho những mạng nó nhìn thấy, và <code>show ip route</code> là chỗ duy nhất cho biết nó nhìn thấy những gì.</p>`],

      [15, 'Serial and WAN interfaces — the one extra command',
        `<p>Serial links need one thing Ethernet does not: somebody has to supply the clock.</p>
<p>On a serial connection one end is the <strong>DCE</strong> (data communications equipment) and the other is the <strong>DTE</strong>. In the real world the DCE is the telecommunications provider's equipment and it supplies timing. In a lab, a back-to-back cable means one end is physically marked DCE, and <em>that</em> end must be given a <code>clock rate</code>.</p>
<p><strong>Find out which end you have</strong> with <code>show controllers Serial0/0/0</code> — it prints DCE or DTE near the top. Guessing wastes time; the command takes two seconds.</p>
<p><strong>The symptom of a missing clock rate is <code>up / down</code></strong>: layer 1 has a signal, layer 2 cannot synchronise. That single pairing is one of the most reliably examined facts in CCNA, precisely because it forces you to reason about which layer is broken rather than reaching for the cable.</p>
<p>★ In production networks serial is nearly extinct — it has been replaced by Ethernet handoffs and MPLS. It remains on every exam and in every Packet Tracer lab, so learn the symptom even though you may never see the hardware.</p>`,
        `<p>Đường serial cần một thứ mà Ethernet không cần: phải có ai đó cấp nhịp đồng hồ.</p>
<p>Trên một kết nối serial, một đầu là <strong>DCE</strong> (thiết bị truyền thông dữ liệu) và đầu kia là <strong>DTE</strong>. Ngoài đời thực thì DCE là thiết bị của nhà mạng và nó cấp nhịp. Trong phòng lab, một sợi cáp nối lưng-với-lưng có một đầu được đánh dấu vật lý là DCE, và <em>chính</em> đầu đó phải được đặt <code>clock rate</code>.</p>
<p><strong>Tìm xem bạn đang cầm đầu nào</strong> bằng <code>show controllers Serial0/0/0</code> — nó in ra chữ DCE hoặc DTE gần đầu kết xuất. Đoán thì mất thời gian; câu lệnh thì mất hai giây.</p>
<p><strong>Triệu chứng của việc thiếu clock rate là <code>up / down</code></strong>: tầng 1 có tín hiệu, tầng 2 không đồng bộ được. Đúng cái cặp đó là một trong những sự thật được ra đề đều đặn nhất trong CCNA, chính vì nó buộc bạn phải suy luận xem tầng nào hỏng thay vì chồm tay vào sợi dây.</p>
<p>★ Trong mạng sản xuất thì serial gần như tuyệt chủng — nó đã bị thay bằng bàn giao Ethernet và MPLS. Nó vẫn có mặt trong mọi đề thi và mọi bài Packet Tracer, nên hãy học lấy cái triệu chứng dù có thể bạn sẽ không bao giờ nhìn thấy phần cứng đó.</p>`],

      [16, '9.4 The default gateway — and who actually needs one',
        `<p>This is the distinction that catches people, and it is one command in the wrong place.</p>
<ul>
<li><strong>A router does not need a default gateway.</strong> It <em>has</em> a routing table — that is its job. What it needs is a default <em>route</em>: <code>ip route 0.0.0.0 0.0.0.0 &lt;next-hop&gt;</code>.</li>
<li><strong>A layer-2 switch does.</strong> At layer 3 a switch is an end device, exactly like a PC: one management address, one default gateway, no routing table.</li>
<li><strong>A PC does</strong>, for the same reason.</li>
</ul>
<p><strong>The trap:</strong> typing <code>ip default-gateway</code> on a router is accepted without error and does nothing at all while IP routing is enabled — which it always is on a router. IOS only honours that command when <code>no ip routing</code> is in effect, which is a configuration you will essentially never use. So the command appears to work, the configuration looks right, and the traffic goes nowhere. A great deal of lab time is lost to this.</p>
<p><strong>The way to remember it:</strong> ask "does this device have a routing table?" If yes, give it a route. If no, give it a gateway.</p>`,
        `<p>Đây là chỗ phân biệt hay bẫy người ta, và nó là một câu lệnh đặt nhầm chỗ.</p>
<ul>
<li><strong>Router không cần cổng ra mặc định.</strong> Nó <em>có</em> bảng định tuyến — đó là công việc của nó. Thứ nó cần là một <em>tuyến</em> mặc định: <code>ip route 0.0.0.0 0.0.0.0 &lt;chặng kế tiếp&gt;</code>.</li>
<li><strong>Switch tầng 2 thì cần.</strong> Xét ở tầng 3, một con switch là thiết bị đầu cuối, y hệt một cái PC: một địa chỉ quản trị, một cổng ra mặc định, không có bảng định tuyến.</li>
<li><strong>PC thì cần</strong>, cũng vì lý do đó.</li>
</ul>
<p><strong>Cái bẫy:</strong> gõ <code>ip default-gateway</code> trên một con router thì được chấp nhận, không báo lỗi, và hoàn toàn không có tác dụng gì chừng nào định tuyến IP còn bật — mà trên router thì nó luôn bật. IOS chỉ tôn trọng câu lệnh đó khi <code>no ip routing</code> đang có hiệu lực, một cấu hình mà về cơ bản bạn sẽ không bao giờ dùng. Nên câu lệnh trông có vẻ chạy, cấu hình trông có vẻ đúng, và lưu lượng thì chẳng đi đâu. Rất nhiều giờ lab đã mất vì chuyện này.</p>
<p><strong>Cách nhớ:</strong> hãy hỏi "thiết bị này có bảng định tuyến không?". Có thì cho nó một tuyến. Không thì cho nó một cổng ra.</p>`],

      [17, 'Configuring management access on a switch',
        `<p>A switch needs a layer-3 presence for exactly one purpose: so that <em>you</em> can reach it — SSH, SNMP, syslog, NTP. It does not need one to switch frames, and a switch with no IP address at all will happily forward traffic forever.</p>
<p><strong>The SVI</strong> — switch virtual interface — is a virtual layer-3 interface attached to a VLAN. <code>interface vlan 1</code> gives the switch an address inside VLAN 1. It carries management traffic only; user traffic is switched at layer 2 and never touches it.</p>
<p><strong>The default gateway is a global command</strong>, <code>ip default-gateway 192.168.10.1</code>, not something you put under the interface. Without it the switch is reachable from its own VLAN and from absolutely nowhere else — which is a fault that hides perfectly during a lab where everyone is on the same subnet, and appears the moment you try to manage the switch from the office.</p>
<p><strong>Why move management off VLAN 1.</strong> VLAN 1 is the default on every Cisco switch ever made, so it is where an attacker plugging into an unconfigured port lands. Putting management on VLAN 99 and leaving VLAN 1 unused is standard practice and costs two extra commands.</p>`,
        `<p>Một con switch cần có mặt ở tầng 3 vì đúng một mục đích: để <em>bạn</em> tới được nó — SSH, SNMP, syslog, NTP. Nó không cần điều đó để chuyển mạch khung, và một con switch hoàn toàn không có địa chỉ IP vẫn vui vẻ chuyển tiếp lưu lượng mãi mãi.</p>
<p><strong>SVI</strong> — switch virtual interface — là một cổng tầng 3 ảo gắn với một VLAN. Lệnh <code>interface vlan 1</code> cho con switch một địa chỉ bên trong VLAN 1. Nó chỉ chở lưu lượng quản trị; lưu lượng người dùng được chuyển mạch ở tầng 2 và không bao giờ đụng tới nó.</p>
<p><strong>Cổng ra mặc định là một lệnh toàn cục</strong>, <code>ip default-gateway 192.168.10.1</code>, không phải thứ bạn đặt dưới cổng. Không có nó thì con switch chỉ tới được từ chính VLAN của nó và tuyệt đối không từ đâu khác — một cái lỗi ẩn mình hoàn hảo trong giờ lab nơi mọi người cùng một subnet, rồi hiện ra đúng lúc bạn định quản trị con switch từ văn phòng.</p>
<p><strong>Vì sao nên dời quản trị khỏi VLAN 1.</strong> VLAN 1 là mặc định trên mọi con switch Cisco từng được làm ra, nên đó là chỗ kẻ tấn công cắm vào một cổng chưa cấu hình sẽ rơi vào. Đặt quản trị ở VLAN 99 và để VLAN 1 không dùng là thực hành tiêu chuẩn và tốn thêm hai câu lệnh.</p>`],

      [18, '★ The identical three steps, on Linux',
        `<p>The point of this slide is not to teach Linux — it is to show that the CCNA material is not Cisco trivia. It is the same three ideas everywhere.</p>
<ul>
<li><code>ip address 192.168.10.5 255.255.255.0</code> becomes <code>ip addr add 192.168.10.5/24 dev eth0</code>.</li>
<li><code>no shutdown</code> becomes <code>ip link set eth0 up</code>. Literally the same operation, and the same thing to forget.</li>
<li><code>ip default-gateway 192.168.10.1</code> becomes <code>ip route add default via 192.168.10.1</code>.</li>
<li><code>show ip interface brief</code> becomes <code>ip -br addr</code>.</li>
</ul>
<p><strong>And the step that makes a machine a router rather than a host:</strong> <code>sysctl -w net.ipv4.ip_forward=1</code>. That single value is the difference between "this machine receives packets addressed to it" and "this machine forwards packets addressed to others". Docker sets it on your server without telling you, which is exactly why containers reach the Internet — and why Chapter 7 said your server is already a router whether you meant it to be or not.</p>
<p>Once you see that <code>ip link set up</code> <em>is</em> <code>no shutdown</code>, the exam material stops being something to memorise and starts being something you already use.</p>`,
        `<p>Mục đích của slide này không phải dạy Linux — mà là cho thấy phần kiến thức CCNA không phải mấy chuyện vặt riêng của Cisco. Ở đâu cũng là ba ý đó.</p>
<ul>
<li><code>ip address 192.168.10.5 255.255.255.0</code> thành <code>ip addr add 192.168.10.5/24 dev eth0</code>.</li>
<li><code>no shutdown</code> thành <code>ip link set eth0 up</code>. Đúng nghĩa là cùng một thao tác, và cũng là cùng một thứ hay bị quên.</li>
<li><code>ip default-gateway 192.168.10.1</code> thành <code>ip route add default via 192.168.10.1</code>.</li>
<li><code>show ip interface brief</code> thành <code>ip -br addr</code>.</li>
</ul>
<p><strong>Và bước biến một cỗ máy thành router thay vì một máy trạm:</strong> <code>sysctl -w net.ipv4.ip_forward=1</code>. Đúng một giá trị đó là khác biệt giữa "cỗ máy này nhận những gói đề tên nó" và "cỗ máy này chuyển tiếp những gói đề tên người khác". Docker bật nó trên máy chủ của bạn mà không báo, và đó chính là lý do container ra được Internet — cũng là lý do chương 7 nói rằng máy chủ của bạn vốn đã là một router, dù bạn có định thế hay không.</p>
<p>Một khi bạn thấy rằng <code>ip link set up</code> <em>chính là</em> <code>no shutdown</code>, phần kiến thức thi cử thôi là thứ phải học thuộc và trở thành thứ bạn vốn đang dùng.</p>`],

      [19, '★ Making it survive a reboot — the config, not the command',
        `<p>Both platforms have the same trap, and only one of them has a safety net.</p>
<p><strong>On Cisco</strong>, a command lands in running-config (RAM). <code>copy running-config startup-config</code> writes it to NVRAM. Skip that and the next reload erases everything.</p>
<p><strong>On Linux, exactly the same.</strong> <code>ip addr add</code> and <code>ip route add</code> last until reboot and no further. The permanent version lives in a file: netplan (<code>/etc/netplan/*.yaml</code>, applied with <code>netplan apply</code>) or NetworkManager (<code>nmcli con mod</code>). <code>sysctl -w</code> is temporary too; the permanent form is a line in <code>/etc/sysctl.d/99-router.conf</code>.</p>
<p><strong>The shared lesson is worth stating plainly: "it works now" and "it will work after a reboot" are two different claims,</strong> and only the second one matters at three in the morning when a machine restarts by itself. Verifying the first tells you nothing about the second.</p>
<p><strong>The Cisco version has a silver lining Linux lacks.</strong> Because the running configuration is deliberately volatile, you can type something catastrophic, refuse to save, <code>reload</code>, and the mistake never existed. Learn to use that on purpose: make risky changes, prove they work, and save only then.</p>`,
        `<p>Cả hai nền tảng đều có cùng cái bẫy, và chỉ một trong hai có lưới an toàn.</p>
<p><strong>Trên Cisco</strong>, một câu lệnh rơi vào running-config (RAM). Lệnh <code>copy running-config startup-config</code> ghi nó vào NVRAM. Bỏ qua bước đó là lần khởi động sau xoá sạch tất cả.</p>
<p><strong>Trên Linux thì y hệt.</strong> <code>ip addr add</code> và <code>ip route add</code> sống tới lúc khởi động lại là hết. Bản vĩnh viễn nằm trong một file: netplan (<code>/etc/netplan/*.yaml</code>, áp dụng bằng <code>netplan apply</code>) hoặc NetworkManager (<code>nmcli con mod</code>). <code>sysctl -w</code> cũng tạm thời; dạng vĩnh viễn là một dòng trong <code>/etc/sysctl.d/99-router.conf</code>.</p>
<p><strong>Bài học chung đáng nói thẳng ra: "nó đang chạy" và "nó sẽ chạy sau khi khởi động lại" là hai khẳng định khác nhau,</strong> và chỉ cái thứ hai mới đáng kể lúc ba giờ sáng khi một cỗ máy tự khởi động lại. Kiểm chứng cái thứ nhất không nói gì về cái thứ hai.</p>
<p><strong>Bản Cisco có một điểm sáng mà Linux không có.</strong> Vì cấu hình đang chạy cố ý dễ bay hơi, bạn có thể gõ một thứ tai hại, từ chối lưu, gõ <code>reload</code>, và cái sai đó chưa từng tồn tại. Hãy học cách dùng điều đó một cách có chủ ý: thực hiện thay đổi mạo hiểm, chứng minh nó chạy, rồi mới lưu.</p>`],
    ]),

    bi(
      `<h3>🗺️ Troubleshooting an interface, drawn</h3>
<pre><code class="language-mermaid">graph TD
  A["Something on this segment<br/>is unreachable"] --> B{"show ip int brief<br/>Status column?"}
  B -->|"administratively down"| C["no shutdown"]
  B -->|"down"| D["LAYER 1 — cable, port,<br/>far end powered off"]
  B -->|"up"| E{"Protocol column?"}
  E -->|"down"| F["LAYER 2 — serial clock rate,<br/>encapsulation mismatch"]
  E -->|"up"| G["show ip route connected<br/>no route = no address applied"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class B,E ask
  class A,D,F act
  class C,G ok</code></pre>
<p>Work top to bottom and stop at the first branch that matches. Checking layer 3 while the Status column says <em>down</em> is wasted effort, every time.</p>`,
      `<h3>🗺️ Gỡ lỗi một cổng mạng, vẽ ra</h3>
<pre><code class="language-mermaid">graph TD
  A["Có thứ gì đó trên đoạn mạng này<br/>không tới được"] --> B{"show ip int brief<br/>cột Status?"}
  B -->|"administratively down"| C["no shutdown"]
  B -->|"down"| D["TẦNG 1 — dây, cổng,<br/>đầu kia tắt nguồn"]
  B -->|"up"| E{"cột Protocol?"}
  E -->|"down"| F["TẦNG 2 — clock rate của serial,<br/>lệch cách đóng gói"]
  E -->|"up"| G["show ip route connected<br/>không có tuyến = chưa áp địa chỉ"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  class B,E ask
  class A,D,F act
  class C,G ok</code></pre>
<p>Đi từ trên xuống và dừng ở nhánh khớp đầu tiên. Đi kiểm tầng 3 trong khi cột Status ghi <em>down</em> là phí công, lần nào cũng vậy.</p>`,
    ),

    bi(
      `<h3>🤖 9.5 Integrate AI tools for explaining concepts (CLO9)</h3>
<p>Session 27 lists this as self-learning, and configuration is the area where AI is <em>most</em> useful and <em>most</em> dangerous at the same time.</p>
<h4>Genuinely useful here</h4>
<ul>
<li><strong>Explaining an error message.</strong> IOS error text is terse and often misleading. Pasting the exact message and the command that produced it usually gets a correct diagnosis, and you can verify it immediately by trying the fix.</li>
<li><strong>Reviewing a configuration you wrote.</strong> "Here is my running-config; what is missing for SSH to work?" is a checkable question with a checkable answer.</li>
<li><strong>Translating between platforms.</strong> "What is the Linux equivalent of <code>ip default-gateway</code>?" is exactly the kind of mapping a model does well, and slide 18 is that mapping.</li>
</ul>
<h4>Dangerous here specifically</h4>
<ul>
<li><strong>Generated configurations that look right.</strong> A model will produce IOS syntax that is plausible, version-specific, and occasionally wrong. <strong>Run it in Packet Tracer before you type it on hardware.</strong> Configuration mistakes on a live router are not theoretical — they take networks down.</li>
<li><strong>Invented <code>show</code> output.</strong> Never accept generated output as evidence about your own device.</li>
<li><strong>Confident advice about state.</strong> "Is my interface up?" cannot be answered by a model. Only <code>show ip interface brief</code> can answer it.</li>
</ul>
<p><strong>The rule, unchanged since Chapter 7:</strong> AI forms the hypothesis, a command tests it. On this chapter add one more: <em>a lab tests it before production does.</em></p>`,
      `<h3>🤖 9.5 Dùng công cụ AI để giải thích khái niệm (CLO9)</h3>
<p>Buổi 27 xếp mục này là phần tự học, và cấu hình là lĩnh vực mà AI vừa hữu ích <em>nhất</em> vừa nguy hiểm <em>nhất</em> cùng lúc.</p>
<h4>Thật sự hữu ích ở đây</h4>
<ul>
<li><strong>Giải thích một thông báo lỗi.</strong> Chữ báo lỗi của IOS cộc lốc và thường gây hiểu lầm. Dán nguyên văn thông báo kèm câu lệnh sinh ra nó thì thường nhận được chẩn đoán đúng, và bạn kiểm chứng được ngay bằng cách thử cách sửa.</li>
<li><strong>Rà lại một cấu hình bạn vừa viết.</strong> "Đây là running-config của tôi; còn thiếu gì để SSH chạy?" là câu hỏi kiểm được với câu trả lời kiểm được.</li>
<li><strong>Dịch qua lại giữa hai nền tảng.</strong> "Bên Linux thì tương đương với <code>ip default-gateway</code> là gì?" đúng là kiểu ánh xạ mà mô hình làm tốt, và slide 18 chính là cái ánh xạ đó.</li>
</ul>
<h4>Nguy hiểm riêng ở chương này</h4>
<ul>
<li><strong>Cấu hình do AI sinh ra trông có vẻ đúng.</strong> Mô hình sẽ đẻ ra cú pháp IOS nghe hợp lý, phụ thuộc phiên bản, và thỉnh thoảng sai. <strong>Chạy thử trong Packet Tracer trước khi gõ lên thiết bị thật.</strong> Sai cấu hình trên một con router đang chạy không phải chuyện lý thuyết — nó kéo sập mạng.</li>
<li><strong>Kết xuất <code>show</code> bịa ra.</strong> Đừng bao giờ nhận kết xuất do AI sinh ra làm bằng chứng về thiết bị của chính bạn.</li>
<li><strong>Lời khuyên chắc nịch về trạng thái.</strong> "Cổng của tôi có đang bật không?" là câu mô hình không trả lời được. Chỉ <code>show ip interface brief</code> mới trả lời được.</li>
</ul>
<p><strong>Nguyên tắc, không đổi từ chương 7:</strong> AI dựng giả thuyết, một câu lệnh kiểm chứng. Ở chương này thêm một vế nữa: <em>phòng lab kiểm chứng trước khi hệ thống thật phải chịu.</em></p>`,
    ),

    bi(
      `<h3>🔍 How to check this yourself</h3>
<pre><code class="language-bash">! IOS — the verification routine, in this order
show ip interface brief          ! layers 1 and 2, every interface at a glance
show ip route connected          ! did each interface actually produce a route?
show interfaces g0/0             ! counters, duplex, speed, MTU, errors
show interfaces description      ! the descriptions you were glad you wrote
show controllers Serial0/0/0     ! DCE or DTE, before you look for clock rate</code></pre>
<pre><code class="language-bash"># Linux — the same five questions
ip -br addr                      # address and state, one line per interface
ip -br link                      # UP / DOWN / LOWER_UP per interface
ip route                         # including the default route
ip -s link show eth0             # counters and errors
cat /proc/sys/net/ipv4/ip_forward   # am I a host or a router?</code></pre>
<h4>Reading the results</h4>
<ul>
<li><strong>Read Status then Protocol, in that order</strong> — layer 1 then layer 2. Diagnosing layer 3 while Status says <em>down</em> is always wasted effort.</li>
<li><strong>up/up with no connected route means no address is applied.</strong> This is the case that fools people, because the brief output looks healthy.</li>
<li>On Linux, <code>LOWER_UP</code> in <code>ip -br link</code> is the true equivalent of Cisco's Status column: it means the physical carrier is present. <code>UP</code> without <code>LOWER_UP</code> means you enabled the interface and nothing is plugged in.</li>
<li><code>ip_forward</code> reading <strong>1</strong> on a machine you did not configure as a router means something enabled it — usually Docker. That is Chapter 7's point arriving in Chapter 9.</li>
</ul>`,
      `<h3>🔍 Cách tự kiểm</h3>
<pre><code class="language-bash">! IOS — quy trình nghiệm thu, theo đúng thứ tự này
show ip interface brief          ! tầng 1 và 2, mọi cổng trong một cái nhìn
show ip route connected          ! từng cổng có thật sự sinh ra tuyến không?
show interfaces g0/0             ! bộ đếm, duplex, tốc độ, MTU, lỗi
show interfaces description      ! những dòng mô tả mà bạn mừng là đã viết
show controllers Serial0/0/0     ! DCE hay DTE, trước khi đi tìm clock rate</code></pre>
<pre><code class="language-bash"># Linux — cùng năm câu hỏi đó
ip -br addr                      # địa chỉ và trạng thái, mỗi cổng một dòng
ip -br link                      # UP / DOWN / LOWER_UP theo từng cổng
ip route                         # kể cả tuyến mặc định
ip -s link show eth0             # bộ đếm và lỗi
cat /proc/sys/net/ipv4/ip_forward   # tôi là máy trạm hay router?</code></pre>
<h4>Đọc kết quả</h4>
<ul>
<li><strong>Đọc Status rồi mới tới Protocol, đúng thứ tự đó</strong> — tầng 1 rồi tầng 2. Chẩn đoán tầng 3 trong khi Status ghi <em>down</em> luôn luôn là phí công.</li>
<li><strong>up/up mà không có tuyến kết nối nghĩa là chưa áp địa chỉ nào.</strong> Đây là trường hợp đánh lừa người ta, vì kết xuất brief nhìn rất khoẻ mạnh.</li>
<li>Trên Linux, chữ <code>LOWER_UP</code> trong <code>ip -br link</code> mới là bản tương đương thật của cột Status bên Cisco: nó nghĩa là có sóng mang vật lý. Có <code>UP</code> mà không có <code>LOWER_UP</code> nghĩa là bạn đã bật cổng và chưa cắm gì vào.</li>
<li><code>ip_forward</code> đọc ra <strong>1</strong> trên một cỗ máy bạn không hề cấu hình thành router nghĩa là có thứ gì đó đã bật nó — thường là Docker. Đó là ý của chương 7 quay lại ở chương 9.</li>
</ul>`,
    ),

    bi(
      `<h3>⚠️ Mistakes people actually make</h3>
<ol>
<li><strong>Forgetting <code>no shutdown</code>.</strong> The most common fault in the course. <em>Symptom:</em> <em>administratively down / down</em>, and everything else configured perfectly.</li>
<li><strong>Typing <code>ip default-gateway</code> on a router.</strong> Accepted, ignored, no error. <em>Symptom:</em> the configuration reads correctly and traffic still goes nowhere.</li>
<li><strong>Configuring the SVI but forgetting the switch's default gateway.</strong> <em>Symptom:</em> the switch is reachable from its own VLAN and from nowhere else — invisible during a lab, obvious in production.</li>
<li><strong>Checking only <code>show ip interface brief</code>.</strong> It covers layers 1 and 2 and says nothing about whether a route exists. <em>Symptom:</em> up/up and unreachable.</li>
<li><strong>Setting <code>clock rate</code> on the DTE end of a serial link.</strong> It is accepted and has no effect. <em>Symptom:</em> up/down that survives every attempt to fix it, because the fix is being applied to the wrong router.</li>
<li><strong>Entering the address in the wrong interface sub-mode.</strong> You typed <code>interface g0/0</code>, then later <code>interface g0/1</code>, and lost track. <em>Symptom:</em> an address on an interface that should not have one, and none on the interface that should.</li>
<li><strong>★ Configuring Linux with <code>ip addr add</code> and calling it done.</strong> <em>Symptom:</em> works perfectly, then vanishes at the next reboot — the same fault as forgetting <code>copy run start</code>, with no reload to rescue you.</li>
</ol>`,
      `<h3>⚠️ Bẫy hay mắc</h3>
<ol>
<li><strong>Quên <code>no shutdown</code>.</strong> Lỗi phổ biến nhất trong cả môn. <em>Triệu chứng:</em> <em>administratively down / down</em>, trong khi mọi thứ khác cấu hình hoàn hảo.</li>
<li><strong>Gõ <code>ip default-gateway</code> lên một con router.</strong> Được chấp nhận, bị bỏ qua, không báo lỗi. <em>Triệu chứng:</em> cấu hình đọc lên thì đúng mà lưu lượng vẫn chẳng đi đâu.</li>
<li><strong>Cấu hình SVI mà quên cổng ra mặc định của switch.</strong> <em>Triệu chứng:</em> con switch chỉ tới được từ chính VLAN của nó và không từ đâu khác — vô hình trong giờ lab, lộ rõ trên hệ thống thật.</li>
<li><strong>Chỉ kiểm mỗi <code>show ip interface brief</code>.</strong> Nó phủ tầng 1 và 2 và không nói gì về việc có tuyến hay không. <em>Triệu chứng:</em> up/up mà không ai tới được.</li>
<li><strong>Đặt <code>clock rate</code> ở đầu DTE của đường serial.</strong> Nó được chấp nhận và không có tác dụng. <em>Triệu chứng:</em> up/down sống sót qua mọi nỗ lực sửa, vì cách sửa đang được áp lên nhầm con router.</li>
<li><strong>Nhập địa chỉ ở nhầm chế độ con của cổng.</strong> Bạn gõ <code>interface g0/0</code>, rồi sau đó <code>interface g0/1</code>, và mất dấu. <em>Triệu chứng:</em> có địa chỉ trên một cổng lẽ ra không nên có, và không có trên cổng lẽ ra phải có.</li>
<li><strong>★ Cấu hình Linux bằng <code>ip addr add</code> rồi coi là xong.</strong> <em>Triệu chứng:</em> chạy hoàn hảo, rồi biến mất ở lần khởi động sau — đúng cái lỗi quên <code>copy run start</code>, mà lại không có lệnh reload nào cứu bạn.</li>
</ol>`,
    ),

    bi(
      `<h3>✍️ Exercises — with full worked answers</h3>
<p><strong>1.</strong> An interface reads <code>up / down</code>. Which layer is broken, and give two likely causes.</p>
<p><strong>2.</strong> An interface reads <code>up / up</code> with a correct address, but <code>show ip route</code> shows no connected route for it. What happened?</p>
<p><strong>3.</strong> Why does a layer-2 switch need <code>ip default-gateway</code> while a router does not?</p>
<p><strong>4.</strong> Give the Linux equivalent of these three IOS commands: <code>ip address 10.0.0.5 255.255.255.0</code>, <code>no shutdown</code>, <code>ip default-gateway 10.0.0.1</code>.</p>
<p><strong>5.</strong> A colleague says "I configured it and tested it, it definitely works." What single question do you ask?</p>
<hr>
<h4>Answers</h4>
<p><strong>1. Layer 2.</strong> Status is layer 1 and it says <em>up</em>, so there is a physical signal and the cable is fine. Protocol is layer 2 and it says <em>down</em>, so the data link is not coming up. On a serial link the two likely causes are a missing <code>clock rate</code> on the DCE end and an encapsulation mismatch between the two routers. On Ethernet it is uncommon and usually indicates a keepalive problem. Notice what you should <em>not</em> do: replace the cable. Layer 1 has already told you it is fine.</p>
<p><strong>2. No address is actually applied to that interface.</strong> <code>show ip interface brief</code> reports layers 1 and 2 and can show a healthy interface that is invisible to routing. The most common cause is that the <code>ip address</code> command was entered while the prompt was in a <em>different</em> interface's sub-mode, so the address landed on the wrong interface. <code>show run interface g0/0</code> settles it in one command. A router routes only for networks it can see, and <code>show ip route</code> is the only place that shows what it can see.</p>
<p><strong>3.</strong> Because at layer 3 a switch is an <em>end device</em>: it has one management address and no routing table, exactly like a PC, so it needs somewhere to send anything that is not on its own subnet. A router <em>is</em> the thing that has a routing table, so the equivalent concept for it is a default <em>route</em>, <code>ip route 0.0.0.0 0.0.0.0 &lt;next-hop&gt;</code>. Typing <code>ip default-gateway</code> on a router is accepted and silently ignored while IP routing is enabled, which wastes a lot of time because nothing warns you.</p>
<p><strong>4.</strong> <code>sudo ip addr add 10.0.0.5/24 dev eth0</code> · <code>sudo ip link set eth0 up</code> · <code>sudo ip route add default via 10.0.0.1</code>. And the crucial footnote: all three are temporary. The permanent versions go in netplan or NetworkManager, which is Linux's <code>copy run start</code>.</p>
<p><strong>5. "Did you save it?"</strong> — or on Linux, "will it survive a reboot?". "I tested it" proves the running configuration is correct and proves nothing at all about the startup configuration. The two claims are independent, and the gap between them is discovered at the worst possible moment: a power cut, or an unattended restart at three in the morning.</p>`,
      `<h3>✍️ Bài tập — có lời giải đầy đủ</h3>
<p><strong>1.</strong> Một cổng đọc ra <code>up / down</code>. Tầng nào hỏng, và nêu hai nguyên nhân có khả năng.</p>
<p><strong>2.</strong> Một cổng đọc ra <code>up / up</code> với địa chỉ đúng, nhưng <code>show ip route</code> không có tuyến kết nối nào cho nó. Chuyện gì đã xảy ra?</p>
<p><strong>3.</strong> Vì sao switch tầng 2 cần <code>ip default-gateway</code> còn router thì không?</p>
<p><strong>4.</strong> Cho biết bản tương đương trên Linux của ba lệnh IOS sau: <code>ip address 10.0.0.5 255.255.255.0</code>, <code>no shutdown</code>, <code>ip default-gateway 10.0.0.1</code>.</p>
<p><strong>5.</strong> Một đồng nghiệp nói "tôi cấu hình rồi, kiểm tra rồi, chắc chắn chạy". Bạn hỏi lại đúng một câu nào?</p>
<hr>
<h4>Lời giải</h4>
<p><strong>1. Tầng 2.</strong> Status là tầng 1 và nó ghi <em>up</em>, nên có tín hiệu vật lý và sợi dây thì ổn. Protocol là tầng 2 và nó ghi <em>down</em>, nên liên kết dữ liệu không lên được. Trên đường serial thì hai nguyên nhân khả dĩ là thiếu <code>clock rate</code> ở đầu DCE và lệch cách đóng gói giữa hai router. Trên Ethernet thì hiếm và thường là chuyện keepalive. Để ý thứ bạn <em>không</em> nên làm: thay dây. Tầng 1 đã báo với bạn là nó ổn rồi.</p>
<p><strong>2. Thật ra chưa có địa chỉ nào được áp lên cái cổng đó.</strong> <code>show ip interface brief</code> báo cáo tầng 1 và 2 và có thể hiện ra một cổng khoẻ mạnh mà vô hình với việc định tuyến. Nguyên nhân phổ biến nhất là câu lệnh <code>ip address</code> được nhập trong lúc dấu nhắc đang ở chế độ con của một cổng <em>khác</em>, nên địa chỉ rơi sang cổng đó. Lệnh <code>show run interface g0/0</code> giải quyết chuyện này trong một câu. Một router chỉ định tuyến cho những mạng nó nhìn thấy, và <code>show ip route</code> là chỗ duy nhất cho biết nó nhìn thấy gì.</p>
<p><strong>3.</strong> Vì xét ở tầng 3 thì switch là một <em>thiết bị đầu cuối</em>: nó có một địa chỉ quản trị và không có bảng định tuyến, y hệt một cái PC, nên nó cần một chỗ để gửi mọi thứ không thuộc subnet của nó. Còn router thì <em>chính là</em> cái thứ có bảng định tuyến, nên khái niệm tương đương với nó là một <em>tuyến</em> mặc định, <code>ip route 0.0.0.0 0.0.0.0 &lt;chặng kế tiếp&gt;</code>. Gõ <code>ip default-gateway</code> lên router thì được chấp nhận rồi bị bỏ qua lặng lẽ chừng nào định tuyến IP còn bật, và chuyện đó ngốn rất nhiều thời gian vì không có gì cảnh báo bạn.</p>
<p><strong>4.</strong> <code>sudo ip addr add 10.0.0.5/24 dev eth0</code> · <code>sudo ip link set eth0 up</code> · <code>sudo ip route add default via 10.0.0.1</code>. Và cái chú thích sống còn: cả ba đều tạm thời. Bản vĩnh viễn nằm trong netplan hoặc NetworkManager, tức là <code>copy run start</code> phiên bản Linux.</p>
<p><strong>5. "Cậu lưu chưa?"</strong> — hoặc trên Linux là "nó có sống qua khởi động lại không?". Câu "tôi kiểm tra rồi" chứng minh cấu hình đang chạy thì đúng, và hoàn toàn không chứng minh gì về cấu hình khởi động. Hai khẳng định đó độc lập với nhau, và khoảng cách giữa chúng bị phát hiện vào đúng thời điểm tệ nhất: một lần mất điện, hoặc một lần tự khởi động lại lúc ba giờ sáng.</p>`,
    ),

    cq(27, [
      ['CQ9.3', 'Compare the roles of the ARP address and the IP address. <em>— content belongs to Chapter 8; answered in Lessons 8.1 and 8.2. In short: an "ARP address" is a MAC address, valid on one link only and rewritten at every hop; an IP address is globally meaningful and survives the whole journey. ARP is the bridge between the two.</em>',
        'Compare the roles of the ARP address and the IP address. <em>— nội dung thuộc chương 8; đã trả lời ở bài 8.1 và 8.2. Nói gọn: "địa chỉ ARP" chính là địa chỉ MAC, chỉ có giá trị trên một đường link và bị viết lại ở mọi chặng; còn địa chỉ IP có nghĩa toàn cầu và sống nguyên vẹn suốt hành trình. ARP là cây cầu nối giữa hai thứ đó.</em>'],
    ]),
  ].join('\n'),
};

/* ──────────────────── Lesson 9.3 — sessions 28–29 (Lab 2.1) ──────────────────── */

const L3 = {
  title: '9.3 — Lab 2.1: Build a Switch and Router Network (FLM sessions 28–29)|||9.3 — Lab 2.1: Dựng mạng có switch và router (buổi 28–29 của FLM)',
  slug: 'nwc204-9-3-lab-2-1-dung-mang-switch-router',
  type: 'DOCUMENT',
  description: 'Buổi 28–29: dựng trọn vẹn Lab 2.1 — tô-pô, cấu hình đầy đủ cho R1 và cho S1 từ phím đầu tiên, trình tự nghiệm thu tám bước theo lối từ dưới lên, bảng triệu chứng và nguyên nhân, cùng phần ★ dựng lại đúng bài lab đó trên một máy Linux bằng network namespace mà không cần Packet Tracer.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 9 · Lesson 9.3 · FLM sessions 28–29 of 60 · CLO3, CLO8, CLO9 · Lab 2.1</span>
<h2>Everything so far, on one desk</h2>
<p class="lead">Lab 2.1 is the first time the whole course comes together in one exercise. A PC, a switch and a router on one subnet — and to make it work you need Chapter 6 (the switch table), Chapter 7 (local versus remote), Chapter 8 (ARP) and Chapter 9 (the commands). Nothing new is introduced. That is the point.</p>
<p><strong>How to use this lesson.</strong> Build it in Packet Tracer alongside the text. Type the configurations rather than copying them, because the muscle memory is a large part of what the practical exam measures. Then break it deliberately, one fault at a time, and check that the symptom matches the table near the end.</p>
<p class="note">★ The last section rebuilds the same lab on a single Linux machine, for when you do not have Packet Tracer in front of you.</p>`,
      `<span class="eyebrow">NWC204 · Chương 9 · Bài 9.3 · Buổi 28–29/60 của FLM · CLO3, CLO8, CLO9 · Lab 2.1</span>
<h2>Mọi thứ từ đầu tới giờ, gói trên một cái bàn</h2>
<p class="lead">Lab 2.1 là lần đầu tiên cả môn học tụ lại trong một bài tập. Một cái PC, một con switch và một con router trên cùng một subnet — và để nó chạy được bạn cần chương 6 (bảng của switch), chương 7 (cục bộ hay ở xa), chương 8 (ARP) và chương 9 (các câu lệnh). Không có gì mới được giới thiệu. Đó chính là mục đích.</p>
<p><strong>Cách dùng bài này.</strong> Hãy dựng nó trong Packet Tracer song song với việc đọc. Hãy GÕ các cấu hình chứ đừng chép, vì trí nhớ của ngón tay chiếm phần lớn thứ mà bài thi thực hành đo. Rồi cố tình làm nó hỏng, mỗi lần một lỗi, và đối chiếu xem triệu chứng có khớp cái bảng ở gần cuối không.</p>
<p class="note">★ Mục cuối dựng lại đúng bài lab đó trên một máy Linux duy nhất, dành cho lúc bạn không có Packet Tracer trước mặt.</p>`,
    ),

    walkHead('nwc204-ch09', 20, 26,
      'Slides 20–26 cover FLM sessions 28–29: Lab 2.1, Build a Switch and Router Network.',
      'Slide 20–26 là buổi 28–29 của FLM: Lab 2.1, Build a Switch and Router Network.'),

    walk('nwc204-ch09', [
      [20, 'Lab 2.1 — the topology you are building',
        `<p>Three devices, one subnet, and a very specific definition of success.</p>
<ul>
<li><strong>R1</strong>, interface G0/0/0, address <strong>192.168.10.1/24</strong>. This is the default gateway for everyone on the LAN.</li>
<li><strong>S1</strong>, VLAN 1 SVI, address <strong>192.168.10.2/24</strong>, plus <code>ip default-gateway 192.168.10.1</code>. Management only.</li>
<li><strong>PC-A</strong>, address <strong>192.168.10.3</strong>, mask 255.255.255.0, gateway 192.168.10.1.</li>
</ul>
<p><strong>Success means all of the following, and you should check all of them:</strong> PC-A pings both devices; both devices are reachable by SSH; <code>show ip route</code> on R1 lists the connected network; and everything still works after a reload, which is the one people skip.</p>
<p><strong>Note what is not here.</strong> There is no second network and no routing between networks. R1 is doing almost nothing — it is a gateway with nowhere to forward to yet. That comes in Chapter 10 with subnetting. Right now the exercise is about configuring correctly and verifying methodically.</p>`,
        `<p>Ba thiết bị, một subnet, và một định nghĩa rất cụ thể về thế nào là thành công.</p>
<ul>
<li><strong>R1</strong>, cổng G0/0/0, địa chỉ <strong>192.168.10.1/24</strong>. Đây là cổng ra mặc định cho mọi người trên mạng LAN.</li>
<li><strong>S1</strong>, SVI của VLAN 1, địa chỉ <strong>192.168.10.2/24</strong>, cộng thêm <code>ip default-gateway 192.168.10.1</code>. Chỉ để quản trị.</li>
<li><strong>PC-A</strong>, địa chỉ <strong>192.168.10.3</strong>, mặt nạ 255.255.255.0, cổng ra 192.168.10.1.</li>
</ul>
<p><strong>Thành công nghĩa là tất cả những điều sau, và bạn nên kiểm hết:</strong> PC-A ping được cả hai thiết bị; cả hai thiết bị vào được bằng SSH; <code>show ip route</code> trên R1 có liệt kê mạng kết nối; và mọi thứ vẫn chạy sau một lần reload, tức là cái mà người ta hay bỏ qua.</p>
<p><strong>Để ý thứ KHÔNG có ở đây.</strong> Không có mạng thứ hai và không có việc định tuyến giữa các mạng. R1 gần như chẳng làm gì cả — nó là một cổng ra chưa có chỗ nào để chuyển tiếp tới. Chuyện đó tới ở chương 10 với phần chia subnet. Lúc này bài tập là về việc cấu hình cho đúng và nghiệm thu cho có phương pháp.</p>`],

      [21, 'Lab 2.1 — R1, from the first keystroke',
        `<p>The whole configuration, in the order you should type it.</p>
<p><strong><code>no ip domain-lookup</code> deserves a note</strong> because it is not about security or addressing — it is about your sanity. Without it, any typo at the EXEC prompt is interpreted as a hostname to resolve, and IOS spends about thirty seconds trying to look it up before giving up. With it, a typo is an instant error. In a lab where you will make dozens of typos, this single command saves more time than any other.</p>
<p><strong>The interface block is the same shape as always:</strong> description, address and mask, <code>no shutdown</code>. Type it that way every time and the missing line will stand out.</p>
<p><strong>And the last line is the one that matters after the lab ends.</strong> <code>copy running-config startup-config</code>. If the marker reloads your device, everything above disappears without it.</p>`,
        `<p>Toàn bộ cấu hình, theo đúng thứ tự bạn nên gõ.</p>
<p><strong><code>no ip domain-lookup</code> đáng có một ghi chú</strong> vì nó không liên quan tới bảo mật hay địa chỉ — nó liên quan tới sự tỉnh táo của bạn. Không có nó, mọi lỗi gõ nhầm ở dấu nhắc EXEC đều bị hiểu là một tên máy cần phân giải, và IOS ngồi khoảng ba mươi giây để tra cứu trước khi chịu bỏ cuộc. Có nó thì một lỗi gõ nhầm là một thông báo lỗi tức thì. Trong một bài lab mà bạn sẽ gõ nhầm hàng chục lần, đúng câu lệnh này tiết kiệm nhiều thời gian hơn mọi câu lệnh khác.</p>
<p><strong>Khối cấu hình cổng vẫn cùng một dáng như mọi khi:</strong> mô tả, địa chỉ kèm mặt nạ, <code>no shutdown</code>. Cứ gõ theo đúng kiểu đó mọi lần thì dòng bị thiếu sẽ lộ ra ngay.</p>
<p><strong>Và dòng cuối cùng mới là dòng có ý nghĩa sau khi buổi lab kết thúc.</strong> <code>copy running-config startup-config</code>. Nếu người chấm reload thiết bị của bạn, mọi thứ phía trên sẽ biến mất nếu thiếu nó.</p>`],

      [22, 'Lab 2.1 — S1, and the one line that differs',
        `<p>Compare the two configurations side by side and the lesson of the whole chapter appears: <strong>they are almost identical.</strong></p>
<p>Hostname, <code>no ip domain-lookup</code>, <code>enable secret</code>, console line, VTY lines, <code>service password-encryption</code> — all the same commands in the same order. Configuring a switch and configuring a router are the same skill.</p>
<p><strong>Three differences, and only three:</strong></p>
<ul>
<li><strong><code>line vty 0 15</code></strong> instead of <code>0 4</code>. A switch has sixteen virtual terminal lines, a router five. Nothing deep — just a number to remember.</li>
<li><strong>The address goes on <code>interface vlan 1</code></strong>, a virtual interface, not on a physical port. A layer-2 switch has no layer-3 physical interfaces at all.</li>
<li><strong><code>ip default-gateway</code></strong>, a global command. This is the line that makes S1 reachable from outside its own subnet, and forgetting it produces a fault that is completely invisible during a lab where everyone is on 192.168.10.0/24.</li>
</ul>`,
        `<p>Đặt hai cấu hình cạnh nhau là bài học của cả chương hiện ra: <strong>chúng gần như giống hệt nhau.</strong></p>
<p>Tên máy, <code>no ip domain-lookup</code>, <code>enable secret</code>, dòng console, các dòng VTY, <code>service password-encryption</code> — cùng những câu lệnh ấy theo cùng thứ tự ấy. Cấu hình một con switch và cấu hình một con router là cùng một kỹ năng.</p>
<p><strong>Ba khác biệt, và chỉ ba:</strong></p>
<ul>
<li><strong><code>line vty 0 15</code></strong> thay vì <code>0 4</code>. Switch có mười sáu dòng terminal ảo, router có năm. Không có gì sâu xa — chỉ là một con số cần nhớ.</li>
<li><strong>Địa chỉ đặt lên <code>interface vlan 1</code></strong>, một cổng ảo, không phải lên một cổng vật lý. Một con switch tầng 2 hoàn toàn không có cổng vật lý nào ở tầng 3.</li>
<li><strong><code>ip default-gateway</code></strong>, một lệnh toàn cục. Đây là dòng làm cho S1 tới được từ bên ngoài subnet của nó, và quên nó sẽ đẻ ra một cái lỗi hoàn toàn vô hình trong một buổi lab nơi ai cũng nằm trong 192.168.10.0/24.</li>
</ul>`],

      [23, 'Lab 2.1 — verify in this order, and stop at the first failure',
        `<p>Eight steps, bottom-up. The order is the method, and skipping around is why troubleshooting takes people so long.</p>
<p><strong>Bottom-up means: if step 1 fails, steps 2 through 8 tell you nothing.</strong> An interface that is administratively down will produce no route, answer no ping and appear in no ARP table, and all three of those observations are the same single fact reported three times. Fix the lowest failing layer, then move up.</p>
<p><strong>Step 2 is the one people skip</strong>, and it is the one that catches the subtle fault from Lesson 9.2: up/up with no connected route means no address was applied.</p>
<p><strong>Step 8 is the one that ties the chapters together.</strong> <code>arp -a</code> on the PC should show an entry for 192.168.10.1 with the router's MAC address. If it does not, layer 2 never completed — and everything above it is irrelevant until it does. Chapter 8 was not a detour; it is the layer this lab runs on.</p>`,
        `<p>Tám bước, đi từ dưới lên. Thứ tự chính là phương pháp, và nhảy loạn xạ là lý do người ta gỡ lỗi mất nhiều thời gian như vậy.</p>
<p><strong>Từ dưới lên nghĩa là: nếu bước 1 hỏng thì bước 2 tới 8 không nói lên điều gì.</strong> Một cổng đang administratively down sẽ không sinh ra tuyến nào, không đáp ping nào và không xuất hiện trong bảng ARP nào, mà cả ba quan sát đó chỉ là cùng một sự thật được báo lại ba lần. Hãy sửa tầng thấp nhất đang hỏng, rồi mới đi lên.</p>
<p><strong>Bước 2 là bước người ta hay bỏ qua</strong>, và nó là bước bắt được cái lỗi tinh vi ở bài 9.2: up/up mà không có tuyến kết nối nghĩa là chưa có địa chỉ nào được áp.</p>
<p><strong>Bước 8 là bước buộc các chương lại với nhau.</strong> Lệnh <code>arp -a</code> trên PC phải hiện một dòng cho 192.168.10.1 kèm địa chỉ MAC của router. Nếu không có thì tầng 2 chưa bao giờ hoàn tất — và mọi thứ phía trên nó đều vô nghĩa cho tới khi nó hoàn tất. Chương 8 không phải một đoạn đi vòng; nó là cái tầng mà bài lab này chạy trên đó.</p>`],

      [24, 'Lab 2.1 — what goes wrong, and what it looks like',
        `<p>Six faults, six distinct symptoms. Learn the mapping and most lab problems become a lookup rather than an investigation.</p>
<p>The first five are all layer-1 to layer-3 faults with an obvious fix once you have read the symptom correctly. Notice that each symptom is <em>specific</em>: "administratively down" and "up/up with no route" and "reachable only on-LAN" are three different sentences pointing at three different missing commands.</p>
<p><strong>The last row is different, and it is highlighted for a reason.</strong> "Everything correct, dead after reload" has no symptom at all while you are working — the lab passes, the demonstration succeeds, and the fault appears only when the device restarts. There is nothing to notice and nothing to diagnose. The only defence is habit: <code>copy running-config startup-config</code> as the last line, every time, without thinking about it.</p>
<p>★ This is also the pattern to carry to Linux and to everything else you administer: <strong>a configuration that has not survived a restart has not been tested.</strong></p>`,
        `<p>Sáu lỗi, sáu triệu chứng khác nhau. Học lấy cái ánh xạ này thì phần lớn sự cố trong phòng lab trở thành việc tra bảng chứ không phải việc điều tra.</p>
<p>Năm cái đầu đều là lỗi từ tầng 1 tới tầng 3 với cách sửa hiển nhiên một khi bạn đã đọc đúng triệu chứng. Để ý là mỗi triệu chứng đều <em>cụ thể</em>: "administratively down", "up/up mà không có tuyến", và "chỉ tới được trong LAN" là ba câu khác nhau trỏ vào ba câu lệnh còn thiếu khác nhau.</p>
<p><strong>Hàng cuối thì khác, và nó được tô đậm vì một lý do.</strong> "Mọi thứ đúng hết, chết sau khi reload" hoàn toàn không có triệu chứng nào trong lúc bạn đang làm — bài lab đạt, buổi trình bày thành công, và cái lỗi chỉ hiện ra khi thiết bị khởi động lại. Không có gì để nhận ra và không có gì để chẩn đoán. Cách phòng vệ duy nhất là thói quen: <code>copy running-config startup-config</code> làm dòng cuối, mọi lần, không cần nghĩ.</p>
<p>★ Đây cũng là cái mẫu cần mang sang Linux và sang mọi thứ khác bạn vận hành: <strong>một cấu hình chưa sống sót qua một lần khởi động lại là một cấu hình chưa được kiểm thử.</strong></p>`],

      [25, '★ Lab 2.1 without Packet Tracer, on one Linux machine',
        `<p>You can build the same topology on any Linux box, using the kernel's real networking stack rather than a simulator. It takes about two minutes and nothing is emulated.</p>
<ul>
<li>A <strong>network namespace</strong> is an isolated copy of the network stack — its own interfaces, its own routing table, its own ARP cache. It is what a container uses, and here it plays the part of PC-A.</li>
<li>A <strong>veth pair</strong> is a virtual cable: two ends, whatever goes in one comes out the other. One end goes into the namespace, the other into the bridge.</li>
<li>A <strong>bridge</strong> is a software switch. It learns MAC addresses and floods unknown unicast, exactly as Chapter 6 described.</li>
<li>The <strong>host</strong> plays R1, with the bridge's IP address as the gateway.</li>
</ul>
<p><strong>The three commands inside the namespace are the same three from slide 18:</strong> add an address, bring the interface up, add a default route. Then ping the gateway — and this time the ARP exchange, the switch learning and the routing decision are all happening in real kernel code, so <code>ip neigh</code> and <code>tcpdump</code> show you real output.</p>
<p><strong>Clean up afterwards</strong> with <code>sudo ip netns del pca</code> and <code>sudo ip link del br-lab</code>. Namespaces and bridges persist until deleted or until reboot.</p>`,
        `<p>Bạn dựng được đúng tô-pô đó trên bất cứ máy Linux nào, dùng ngăn xếp mạng thật của nhân chứ không phải một trình mô phỏng. Mất khoảng hai phút và không có gì bị giả lập.</p>
<ul>
<li>Một <strong>network namespace</strong> là một bản sao biệt lập của ngăn xếp mạng — cổng riêng, bảng định tuyến riêng, bộ đệm ARP riêng. Đó là thứ container dùng, và ở đây nó đóng vai PC-A.</li>
<li>Một <strong>cặp veth</strong> là một sợi cáp ảo: hai đầu, thứ gì vào đầu này thì ra đầu kia. Một đầu cắm vào namespace, đầu kia cắm vào cầu.</li>
<li>Một <strong>bridge</strong> là một con switch bằng phần mềm. Nó học địa chỉ MAC và tràn unicast chưa biết, đúng như chương 6 đã mô tả.</li>
<li><strong>Máy chủ</strong> đóng vai R1, với địa chỉ IP của cầu làm cổng ra.</li>
</ul>
<p><strong>Ba câu lệnh bên trong namespace chính là ba câu của slide 18:</strong> thêm địa chỉ, bật cổng lên, thêm tuyến mặc định. Rồi ping cổng ra — và lần này cuộc trao đổi ARP, việc switch học địa chỉ và quyết định định tuyến đều đang diễn ra trong mã thật của nhân, nên <code>ip neigh</code> và <code>tcpdump</code> cho bạn kết xuất thật.</p>
<p><strong>Dọn dẹp sau khi xong</strong> bằng <code>sudo ip netns del pca</code> và <code>sudo ip link del br-lab</code>. Namespace và bridge tồn tại cho tới khi bị xoá hoặc tới khi khởi động lại máy.</p>`],

      [26, 'Chapter 9 — what you must be able to do',
        `<p>Nine abilities, and unlike earlier chapters most of them are things you <em>do</em> rather than things you explain. The practical exam measures exactly this list.</p>
<p><strong>A self-test worth doing before session 30.</strong> Open Packet Tracer, place one router and one switch, and configure both from an empty console in under ten minutes, from memory, ending with <code>copy run start</code> on each. Then reload both and confirm nothing was lost. If you have to look anything up, that is the section to reread — and it is much better to discover that now than in the exam.</p>
<p>★ And if you have a VPS, do the Linux version too. The three ideas transfer completely, and the habit of asking "will this survive a reboot?" is worth more than any single command in this chapter.</p>`,
        `<p>Chín năng lực, và khác với các chương trước, phần lớn chúng là những thứ bạn <em>làm</em> chứ không phải những thứ bạn giải thích. Bài thi thực hành đo đúng cái danh sách này.</p>
<p><strong>Một phép tự kiểm đáng làm trước buổi 30.</strong> Mở Packet Tracer, đặt một con router và một con switch, rồi cấu hình cả hai từ một cửa sổ console trống trong vòng dưới mười phút, làm từ trí nhớ, kết thúc bằng <code>copy run start</code> trên mỗi con. Rồi reload cả hai và xác nhận không mất gì. Nếu bạn phải tra cứu thứ gì thì đó là mục cần đọc lại — và phát hiện ra điều đó bây giờ thì tốt hơn nhiều so với phát hiện trong phòng thi.</p>
<p>★ Và nếu bạn có một con VPS thì làm luôn bản Linux. Ba cái ý chuyển giao hoàn toàn, và thói quen tự hỏi "cái này có sống qua khởi động lại không?" đáng giá hơn bất cứ câu lệnh riêng lẻ nào trong chương này.</p>`],
    ]),

    bi(
      `<h3>🧪 Break it on purpose — six experiments</h3>
<p>Building the lab teaches you the commands. Breaking it teaches you to diagnose, which is the part the exam and the job both measure. Do each of these in turn, predict the symptom <em>before</em> you look, then verify.</p>
<ol>
<li><strong>Shut the router interface.</strong> <code>interface g0/0/0</code> then <code>shutdown</code>. Predict what PC-A sees, what <code>show ip route</code> shows, and what is in the PC's ARP table.</li>
<li><strong>Remove the switch's default gateway.</strong> <code>no ip default-gateway 192.168.10.1</code>. Then ask: what still works? Everything on this subnet does, which is why this fault hides.</li>
<li><strong>Give PC-A the wrong mask</strong> — 255.255.0.0 instead of 255.255.255.0. Predict which direction breaks first, and why the failure is asymmetric.</li>
<li><strong>Give PC-A a gateway outside its subnet</strong> — 192.168.11.1. Predict what the ARP table looks like afterwards.</li>
<li><strong>Configure the VTY password but omit <code>login</code>.</strong> Try to connect. Notice that nothing warns you.</li>
<li><strong>Configure everything correctly, do not save, and reload.</strong> This is the one to do last, and the one to remember.</li>
</ol>
<p>Each experiment takes under a minute and each one produces a symptom you will meet again on real equipment. Predicting before looking is the part that matters — an experiment you did not predict teaches you much less.</p>`,
      `<h3>🧪 Cố tình làm hỏng — sáu thí nghiệm</h3>
<p>Dựng bài lab dạy bạn các câu lệnh. Làm hỏng nó mới dạy bạn chẩn đoán, và đó là phần mà cả bài thi lẫn công việc đều đo. Hãy làm lần lượt từng cái, dự đoán triệu chứng <em>trước khi</em> nhìn, rồi kiểm chứng.</p>
<ol>
<li><strong>Tắt cổng của router.</strong> Vào <code>interface g0/0/0</code> rồi gõ <code>shutdown</code>. Dự đoán PC-A thấy gì, <code>show ip route</code> hiện gì, và trong bảng ARP của PC có gì.</li>
<li><strong>Gỡ cổng ra mặc định của switch.</strong> <code>no ip default-gateway 192.168.10.1</code>. Rồi tự hỏi: cái gì vẫn chạy? Mọi thứ trong subnet này vẫn chạy, và đó là lý do cái lỗi này ẩn mình.</li>
<li><strong>Cho PC-A một mặt nạ sai</strong> — 255.255.0.0 thay vì 255.255.255.0. Dự đoán chiều nào hỏng trước, và vì sao cái hỏng lại lệch một bên.</li>
<li><strong>Cho PC-A một cổng ra nằm ngoài subnet</strong> — 192.168.11.1. Dự đoán bảng ARP sau đó trông thế nào.</li>
<li><strong>Cấu hình mật khẩu VTY nhưng bỏ chữ <code>login</code>.</strong> Thử kết nối vào. Để ý là không có gì cảnh báo bạn cả.</li>
<li><strong>Cấu hình mọi thứ cho đúng, đừng lưu, rồi reload.</strong> Đây là cái nên làm cuối cùng, và là cái nên nhớ.</li>
</ol>
<p>Mỗi thí nghiệm mất chưa tới một phút và mỗi cái đẻ ra một triệu chứng bạn sẽ gặp lại trên thiết bị thật. Việc dự đoán trước khi nhìn mới là phần có ý nghĩa — một thí nghiệm bạn không dự đoán trước thì dạy bạn ít hơn nhiều.</p>`,
    ),

    bi(
      `<h3>🔍 The verification routine, written out</h3>
<pre><code class="language-bash">! On R1
show ip interface brief
show ip route connected
show run | section line vty
show ip ssh
ping 192.168.10.2

! On S1
show ip interface brief
show run | include default-gateway
ping 192.168.10.1</code></pre>
<pre><code class="language-plaintext">REM On PC-A (the Packet Tracer command prompt)
ipconfig            REM address, mask AND gateway — check all three
ping 192.168.10.1   REM the gateway
ping 192.168.10.2   REM the switch
arp -a               REM Chapter 8: is the gateway's MAC cached?</code></pre>
<h4>Reading the results</h4>
<ul>
<li><strong><code>show run | section line vty</code></strong> is the fastest way to catch the missing <code>login</code>, because the section is four lines long and the word is either there or it is not.</li>
<li><strong><code>show run | include default-gateway</code></strong> on S1 either prints the line or prints nothing. Nothing means the switch is unreachable from off-subnet, and that is invisible until somebody tries.</li>
<li><strong><code>ipconfig</code> on the PC</strong> — check all three values. A missing gateway is the most common PC-side fault and produces "I can ping the switch but not the Internet".</li>
<li><strong><code>arp -a</code></strong> showing the gateway's MAC proves layers 1, 2 and the local part of layer 3 are all working. If ping still fails after that, the problem is above ARP.</li>
</ul>`,
      `<h3>🔍 Quy trình nghiệm thu, viết ra đầy đủ</h3>
<pre><code class="language-bash">! Trên R1
show ip interface brief
show ip route connected
show run | section line vty
show ip ssh
ping 192.168.10.2

! Trên S1
show ip interface brief
show run | include default-gateway
ping 192.168.10.1</code></pre>
<pre><code class="language-plaintext">REM Trên PC-A (dấu nhắc lệnh của Packet Tracer)
ipconfig            REM địa chỉ, mặt nạ VÀ cổng ra — kiểm cả ba
ping 192.168.10.1   REM cổng ra
ping 192.168.10.2   REM con switch
arp -a               REM chương 8: MAC của cổng ra đã nằm trong bộ đệm chưa?</code></pre>
<h4>Đọc kết quả</h4>
<ul>
<li><strong><code>show run | section line vty</code></strong> là cách nhanh nhất để bắt cái <code>login</code> bị thiếu, vì cả khối chỉ dài bốn dòng và cái chữ đó hoặc có hoặc không.</li>
<li><strong><code>show run | include default-gateway</code></strong> trên S1 hoặc in ra cái dòng đó hoặc không in gì. Không in gì nghĩa là con switch không tới được từ ngoài subnet, và điều đó vô hình cho tới khi có người thử.</li>
<li><strong><code>ipconfig</code> trên PC</strong> — kiểm đủ cả ba giá trị. Thiếu cổng ra là lỗi phía PC phổ biến nhất và nó đẻ ra câu "tôi ping được con switch mà không ra được Internet".</li>
<li><strong><code>arp -a</code></strong> hiện ra MAC của cổng ra là bằng chứng rằng tầng 1, tầng 2 và phần cục bộ của tầng 3 đều đang chạy. Nếu sau đó ping vẫn hỏng thì vấn đề nằm phía trên ARP.</li>
</ul>`,
    ),

    bi(
      `<h3>✍️ Lab exercises — with full worked answers</h3>
<p><strong>1.</strong> You shut R1's G0/0/0. Predict exactly three observations: what PC-A sees when it pings the gateway, what <code>show ip route</code> on R1 shows for 192.168.10.0/24, and what the PC's ARP table contains afterwards.</p>
<p><strong>2.</strong> You remove <code>ip default-gateway</code> from S1. List everything that still works and everything that does not.</p>
<p><strong>3.</strong> PC-A is given mask 255.255.0.0 while everything else uses /24. Does PC-A still reach R1? Explain using the AND test.</p>
<p><strong>4.</strong> PC-A is given gateway 192.168.11.1. Describe what happens when it tries to reach 8.8.8.8, step by step.</p>
<p><strong>5.</strong> How do you prove, without rebooting anything, that the lab will survive a reload?</p>
<hr>
<h4>Answers</h4>
<p><strong>1.</strong> <strong>(a)</strong> PC-A gets <em>Request timed out</em>, or on some stacks <em>Destination host unreachable</em> generated by its own stack after ARP fails. <strong>(b)</strong> <code>show ip route</code> shows <em>nothing at all</em> for 192.168.10.0/24 — both the C and the L entry disappear, because a shut interface contributes no routes. This is the cleanest demonstration that connected routes come from live interfaces, not from configuration. <strong>(c)</strong> The PC's ARP table has <em>no entry</em> for 192.168.10.1, or an entry that ages out and is never refreshed, because nothing is answering the ARP request any more.</p>
<p><strong>2. Everything on 192.168.10.0/24 still works</strong> — PC-A pings S1, S1 pings PC-A and R1, SSH from any machine on the subnet succeeds. <strong>Only off-subnet management breaks:</strong> a machine on another network cannot reach S1's SVI, and S1 cannot send syslog, SNMP traps or NTP requests to any server outside its own subnet. This is precisely why the fault survives a lab: everyone doing the exercise is on the same subnet, so nothing appears wrong until the switch is deployed and somebody tries to manage it from the office.</p>
<p><strong>3. Yes, PC-A still reaches R1.</strong> 192.168.10.3 AND 255.255.0.0 gives 192.168.0.0; 192.168.10.1 AND 255.255.0.0 also gives 192.168.0.0. Same network, so PC-A ARPs for R1 directly and it works. The mask is wrong but harmless <em>for this destination</em>. It breaks the moment PC-A tries to reach something in 192.168.x.y that is genuinely on another subnet — PC-A will believe it is local, ARP for it, get no answer, and never consult the gateway. Meanwhile the other machine, with a correct /24, will route correctly towards PC-A. That is the one-way failure signature of a mask mismatch.</p>
<p><strong>4.</strong> Step by step: PC-A ANDs 8.8.8.8 with its mask, finds it is remote, and looks up its default gateway — 192.168.11.1. It then ANDs <em>that</em> with its own mask and discovers the gateway is <em>also</em> remote. So to send a packet to its gateway it would need a gateway. There is no way out of that loop, so no frame is ever built. Depending on the stack you get an immediate error or a silent failure; in Packet Tracer, <code>ping 8.8.8.8</code> fails instantly rather than timing out. The ARP table will contain nothing for 192.168.11.1, because the PC never even sends the request.</p>
<p><strong>5.</strong> Compare the two configurations directly: <code>show running-config</code> and <code>show startup-config</code>, and confirm they match — or on many IOS versions, <code>show archive config differences</code>. A simpler habit that gives the same guarantee: run <code>copy run start</code> and then check that <code>show startup-config</code> contains the lines you just added. Note that "I tested it and it works" proves nothing here; it is a statement about running-config only, and the two are independent.</p>`,
      `<h3>✍️ Bài tập lab — có lời giải đầy đủ</h3>
<p><strong>1.</strong> Bạn tắt cổng G0/0/0 của R1. Hãy dự đoán chính xác ba quan sát: PC-A thấy gì khi ping cổng ra, <code>show ip route</code> trên R1 hiện gì cho 192.168.10.0/24, và bảng ARP của PC sau đó chứa gì.</p>
<p><strong>2.</strong> Bạn gỡ <code>ip default-gateway</code> khỏi S1. Liệt kê mọi thứ vẫn chạy và mọi thứ không chạy.</p>
<p><strong>3.</strong> PC-A được đặt mặt nạ 255.255.0.0 trong khi mọi thứ khác dùng /24. PC-A còn tới được R1 không? Giải thích bằng phép AND.</p>
<p><strong>4.</strong> PC-A được đặt cổng ra 192.168.11.1. Mô tả chuyện gì xảy ra khi nó cố tới 8.8.8.8, từng bước một.</p>
<p><strong>5.</strong> Làm sao chứng minh, mà không khởi động lại thứ gì, rằng bài lab sẽ sống sót qua một lần reload?</p>
<hr>
<h4>Lời giải</h4>
<p><strong>1.</strong> <strong>(a)</strong> PC-A nhận <em>Request timed out</em>, hoặc trên một số ngăn xếp là <em>Destination host unreachable</em> do chính ngăn xếp của nó sinh ra sau khi ARP thất bại. <strong>(b)</strong> <code>show ip route</code> <em>hoàn toàn không hiện gì</em> cho 192.168.10.0/24 — cả dòng C lẫn dòng L đều biến mất, vì một cổng đang tắt không đóng góp tuyến nào. Đây là minh hoạ sạch sẽ nhất cho việc tuyến kết nối đến từ cổng đang sống chứ không đến từ cấu hình. <strong>(c)</strong> Bảng ARP của PC <em>không có dòng nào</em> cho 192.168.10.1, hoặc có một dòng rồi hết hạn và không bao giờ được làm mới, vì không còn ai trả lời lời hỏi ARP nữa.</p>
<p><strong>2. Mọi thứ trong 192.168.10.0/24 vẫn chạy</strong> — PC-A ping được S1, S1 ping được PC-A và R1, SSH từ bất cứ máy nào trong subnet đều vào được. <strong>Chỉ có việc quản trị từ ngoài subnet là hỏng:</strong> một máy ở mạng khác không tới được SVI của S1, và S1 không gửi được syslog, bẫy SNMP hay yêu cầu NTP tới bất cứ máy chủ nào ngoài subnet của nó. Chính vì thế mà cái lỗi này sống sót qua buổi lab: ai làm bài cũng nằm trong cùng một subnet, nên không có gì trông có vẻ sai cho tới khi con switch được triển khai và có người định quản trị nó từ văn phòng.</p>
<p><strong>3. Có, PC-A vẫn tới được R1.</strong> 192.168.10.3 AND 255.255.0.0 ra 192.168.0.0; 192.168.10.1 AND 255.255.0.0 cũng ra 192.168.0.0. Cùng mạng, nên PC-A ARP hỏi thẳng R1 và chạy được. Mặt nạ thì sai nhưng vô hại <em>với cái đích này</em>. Nó hỏng ngay khi PC-A cố tới một thứ nào đó trong 192.168.x.y mà thật sự nằm ở subnet khác — PC-A sẽ tin rằng nó là cục bộ, đi ARP hỏi nó, không nhận được đáp, và không bao giờ tra tới cổng ra. Trong khi đó cái máy kia, với /24 đúng, sẽ định tuyến đúng về phía PC-A. Đó là dấu vân tay hỏng-một-chiều của lệch mặt nạ.</p>
<p><strong>4.</strong> Từng bước: PC-A đem 8.8.8.8 AND với mặt nạ của nó, thấy nó ở xa, rồi tra tới cổng ra mặc định — 192.168.11.1. Nó lại đem <em>cái đó</em> AND với mặt nạ của chính mình và phát hiện cổng ra <em>cũng</em> ở xa. Vậy là để gửi một gói tới cổng ra của mình thì nó lại cần một cổng ra. Không có lối nào thoát khỏi cái vòng đó, nên không có cái khung nào được dựng lên cả. Tuỳ ngăn xếp mà bạn nhận lỗi ngay hoặc nhận một thất bại lặng lẽ; trong Packet Tracer thì <code>ping 8.8.8.8</code> hỏng tức thì chứ không chờ hết giờ. Bảng ARP sẽ không có gì cho 192.168.11.1, vì PC thậm chí không gửi lời hỏi.</p>
<p><strong>5.</strong> Đem hai cấu hình ra so trực tiếp: <code>show running-config</code> và <code>show startup-config</code>, rồi xác nhận chúng khớp nhau — hoặc trên nhiều bản IOS thì dùng <code>show archive config differences</code>. Một thói quen đơn giản hơn cho cùng bảo đảm đó: chạy <code>copy run start</code> rồi kiểm xem <code>show startup-config</code> có chứa những dòng bạn vừa thêm không. Lưu ý rằng câu "tôi thử rồi, nó chạy" ở đây không chứng minh gì; nó là một phát biểu chỉ về running-config, và hai thứ đó độc lập với nhau.</p>`,
    ),

    bi(
      `<h3>📋 The school's questions for these two sessions</h3>
<p>Sessions 28 and 29 carry <strong>CQ10.1</strong> and <strong>CQ10.2</strong>. Unlike the previous few, both of these match the material, and both are answerable directly from this lab plus Chapters 7 and 8.</p>
<p><strong>CQ10.1 — "How do two computers connect over the outside network?"</strong> Answer with the full chain: the sender ANDs the destination with its own mask and finds it remote; it resolves the <em>gateway's</em> MAC by ARP; it builds a frame addressed to the router carrying an IP header addressed to the far machine; each router rewrites the frame, decrements TTL and forwards by longest prefix match; the destination de-encapsulates and hands the segment to layer 4. Name the layer at each step and the answer is complete.</p>
<p><strong>CQ10.2 — "How does the way of the router device forward packets?"</strong> Answer with the forwarding algorithm from Lesson 7.2: strip the layer-2 frame, decrement TTL and drop with ICMP Time Exceeded if it reaches zero, find <em>every</em> matching route and keep the longest prefix, use administrative distance only to break ties of equal prefix length, then build a completely new layer-2 frame for the chosen next hop. Mention that the IP addresses never change and the MAC addresses always do.</p>`,
      `<h3>📋 Câu hỏi của trường cho hai buổi này</h3>
<p>Buổi 28 và 29 mang <strong>CQ10.1</strong> và <strong>CQ10.2</strong>. Khác với vài câu trước đó, cả hai câu này đều khớp nội dung, và cả hai đều trả lời thẳng được từ bài lab này cộng với chương 7 và 8.</p>
<p><strong>CQ10.1 — "How do two computers connect over the outside network?"</strong> Hãy trả lời bằng cả chuỗi: bên gửi đem địa chỉ đích AND với mặt nạ của chính mình và thấy nó ở xa; nó phân giải MAC của <em>cổng ra</em> bằng ARP; nó dựng một cái khung đề địa chỉ router nhưng mang phần đầu IP đề địa chỉ máy ở xa; mỗi router viết lại cái khung, hạ TTL và chuyển tiếp theo phép khớp tiền tố dài nhất; máy đích tháo gói và đưa đoạn tin lên tầng 4. Gọi tên tầng ở từng bước là câu trả lời trọn vẹn.</p>
<p><strong>CQ10.2 — "How does the way of the router device forward packets?"</strong> Hãy trả lời bằng thuật toán chuyển tiếp của bài 7.2: bóc khung tầng 2, hạ TTL và vứt gói kèm ICMP Time Exceeded nếu nó về 0, tìm <em>mọi</em> tuyến khớp rồi giữ tiền tố dài nhất, chỉ dùng khoảng cách quản trị để phân định khi hai tuyến cùng độ dài tiền tố, rồi dựng một cái khung tầng 2 hoàn toàn mới cho chặng kế tiếp vừa chọn. Nhớ nêu rằng địa chỉ IP không bao giờ đổi còn địa chỉ MAC thì luôn đổi.</p>`,
    ),

    cq(28, [
      ['CQ10.1', 'How do two computers connect over the outside network?',
        'How do two computers connect over the outside network? <em>— Hai máy tính kết nối với nhau qua mạng bên ngoài bằng cách nào?</em>'],
      ['CQ10.2', 'How does the way of the router device forward packets? <em>(FLM lists this for session 29)</em>',
        'How does the way of the router device forward packets? <em>— Router chuyển tiếp gói tin theo cách nào? (FLM xếp câu này cho buổi 29)</em>'],
    ]),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz ──────────────────────────────── */

const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

const QUIZ = {
  title: 'Quiz Chapter 9 — Basic Router Configuration|||Quiz Chương 9 — Cấu hình router cơ bản',
  slug: 'nwc204-ch9-quiz',
  type: 'QUIZ',
  description: '12 câu song ngữ cho chương 9: các chế độ của IOS và dấu nhắc, enable secret so với enable password, từ khoá login, năm điều kiện của SSH, running-config so với startup-config, no shutdown, đọc cột Status và Protocol, clock rate của serial, cổng ra mặc định trên switch so với tuyến mặc định trên router, SVI, và các bản tương đương trên Linux. Mỗi câu có giải thích.',
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      q('You type ip address 10.0.0.1 255.255.255.0 at the R1(config)# prompt and it is rejected. Why?|||Bạn gõ ip address 10.0.0.1 255.255.255.0 ở dấu nhắc R1(config)# và bị từ chối. Vì sao?',
        ['The mask is invalid|||Mặt nạ không hợp lệ', 'Wrong mode — that command belongs in interface configuration|||Sai chế độ — lệnh đó thuộc chế độ cấu hình cổng', 'The address is already in use|||Địa chỉ đã bị dùng rồi', 'IOS requires slash notation|||IOS đòi dạng gạch chéo'],
        1,
        'The command is correct; the prompt is not. Enter interface g0/0 first and the prompt becomes R1(config-if)#. A rejected command in IOS is usually the right command in the wrong mode, so reading the prompt before re-reading the syntax finds this in one second.|||Câu lệnh thì đúng; dấu nhắc thì sai. Hãy vào interface g0/0 trước rồi dấu nhắc sẽ thành R1(config-if)#. Một câu lệnh bị IOS từ chối thường là lệnh đúng ở chế độ sai, nên đọc dấu nhắc trước khi đọc lại cú pháp sẽ tìm ra chuyện này trong một giây.'),

      q('A configuration has both enable password cisco and enable secret class. Which do you type?|||Một cấu hình có cả enable password cisco lẫn enable secret class. Bạn gõ cái nào?',
        ['cisco', 'class', 'Either works|||Cái nào cũng được', 'Both, in order|||Cả hai, theo thứ tự'],
        1,
        'enable secret takes precedence and enable password is ignored entirely. The weaker one should be removed with no enable password: it is a decoy that misleads anyone reading the config, and a finding in any audit. Remember that type 7 encryption is a reversible cipher, decoded by any online tool in under a second.|||enable secret được ưu tiên và enable password bị bỏ qua hoàn toàn. Cái yếu hơn nên được gỡ bằng no enable password: nó là mồi nhử làm người đọc cấu hình hiểu sai, và là một lỗi trong mọi cuộc kiểm toán. Nhớ rằng mã hoá loại 7 là một phép mã đảo ngược được, công cụ trực tuyến nào cũng giải trong chưa tới một giây.'),

      q('line vty 0 4 is configured with a password but no login keyword. What happens?|||line vty 0 4 được đặt mật khẩu nhưng không có từ khoá login. Chuyện gì xảy ra?',
        ['Connections are refused|||Kết nối bị từ chối', 'The user gets in with no password prompt at all|||Người dùng vào thẳng, không bị hỏi mật khẩu gì cả', 'The default password cisco is used|||Mật khẩu mặc định cisco được dùng', 'IOS rejects the configuration|||IOS từ chối cấu hình đó'],
        1,
        'Without the login keyword the configured password is never checked. There is no error, no warning, and the configuration LOOKS secure to a quick reader — which makes this the most dangerous item in the chapter, because there is no symptom until an audit or an intruder finds it.|||Không có từ khoá login thì mật khẩu đã cấu hình không bao giờ được kiểm. Không có lỗi, không có cảnh báo, và cấu hình TRÔNG có vẻ an toàn với người đọc lướt — điều đó làm nó thành mục nguy hiểm nhất trong chương, vì không có triệu chứng nào cho tới khi một cuộc kiểm toán hoặc một kẻ xâm nhập tìm ra.'),

      q('crypto key generate rsa is refused. What is the most likely reason?|||Lệnh crypto key generate rsa bị từ chối. Lý do nhiều khả năng nhất là gì?',
        ['The modulus is too large|||Độ dài khoá quá lớn', 'The hostname is still Router, or no domain name is set|||Tên máy vẫn là Router, hoặc chưa đặt tên miền', 'SSH version 2 is not enabled|||Chưa bật SSH phiên bản 2', 'There is no username configured|||Chưa cấu hình tên người dùng'],
        1,
        'The RSA key is named after the fully qualified domain name, so both a non-default hostname and ip domain-name must exist first. Version 2 and the username are also required for SSH to work, but they do not block key generation — this specific refusal is always about the name.|||Khoá RSA được đặt tên theo tên miền đầy đủ, nên phải có sẵn cả một tên máy khác mặc định lẫn ip domain-name. Phiên bản 2 và tên người dùng cũng bắt buộc để SSH chạy, nhưng chúng không chặn việc sinh khoá — đúng cái lời từ chối này thì luôn là chuyện cái tên.'),

      q('A router is configured perfectly, works, then loses everything after a power cut. What was forgotten?|||Một router được cấu hình hoàn hảo, chạy tốt, rồi mất sạch sau một lần mất điện. Đã quên gì?',
        ['no shutdown', 'copy running-config startup-config', 'service password-encryption', 'ip domain-name'],
        1,
        'running-config lives in RAM and is what the device is doing now; startup-config lives in NVRAM and is what loads at boot. They are independent until you copy one over the other. The same volatility is your safety net: type something catastrophic, do NOT save, reload, and the mistake never existed.|||running-config nằm trong RAM và là thứ thiết bị đang làm lúc này; startup-config nằm trong NVRAM và là thứ được nạp lúc khởi động. Hai cái độc lập cho tới khi bạn chép cái này đè lên cái kia. Cũng chính tính dễ bay hơi đó là lưới an toàn: gõ một thứ tai hại, ĐỪNG lưu, reload, và cái sai đó chưa từng tồn tại.'),

      q('An interface shows administratively down / down. What does that mean?|||Một cổng hiện administratively down / down. Nghĩa là gì?',
        ['The cable is faulty|||Dây bị lỗi', 'Nobody has typed no shutdown — it is the factory default|||Chưa ai gõ no shutdown — đó là mặc định nhà máy', 'The far end is powered off|||Đầu kia đang tắt nguồn', 'There is an encapsulation mismatch|||Hai đầu lệch cách đóng gói'],
        1,
        'Router interfaces ship shut on purpose, so that a router racked and cabled with a factory config cannot start forwarding or form a loop before a human reviews it. It is a state, not a fault, and the fix is one idempotent command. Switch ports are the opposite — they default to enabled.|||Cổng router xuất xưởng ở trạng thái tắt là có chủ ý, để một con router đã lắp rack và cắm dây với cấu hình nhà máy không thể bắt đầu chuyển tiếp hay tạo vòng lặp trước khi có người xem lại. Đó là một trạng thái, không phải một lỗi, và cách sửa là một câu lệnh bất biến. Cổng switch thì ngược lại — chúng mặc định bật.'),

      q('An interface shows up / down. Which layer is broken?|||Một cổng hiện up / down. Tầng nào hỏng?',
        ['Layer 1 — the cable|||Tầng 1 — sợi dây', 'Layer 2 — often a missing serial clock rate or an encapsulation mismatch|||Tầng 2 — thường là thiếu clock rate của serial hoặc lệch cách đóng gói', 'Layer 3 — the IP address|||Tầng 3 — địa chỉ IP', 'Layer 4 — the ports|||Tầng 4 — số cổng'],
        1,
        'Status is layer 1 and reads up, so the physical signal is present and the cable is fine — do not replace it. Protocol is layer 2 and reads down, so the data link is not coming up. On serial links this is almost always a missing clock rate on the DCE end. Note that there is no "down / up": layer 2 cannot work while layer 1 is dead.|||Status là tầng 1 và nó ghi up, nên có tín hiệu vật lý và sợi dây thì ổn — đừng đi thay nó. Protocol là tầng 2 và nó ghi down, nên liên kết dữ liệu không lên được. Trên đường serial thì gần như luôn là thiếu clock rate ở đầu DCE. Lưu ý là không có trạng thái "down / up": tầng 2 không thể chạy khi tầng 1 đã chết.'),

      q('An interface is up/up with an address, but show ip route lists no connected route for it. Why?|||Một cổng up/up và có địa chỉ, nhưng show ip route không liệt kê tuyến kết nối nào cho nó. Vì sao?',
        ['Connected routes take time to appear|||Tuyến kết nối cần thời gian mới hiện ra', 'No address is actually applied — most often it landed on a different interface|||Thật ra chưa có địa chỉ nào được áp — thường là nó rơi nhầm sang cổng khác', 'The routing protocol is not running|||Giao thức định tuyến chưa chạy', 'The route is hidden by the default route|||Tuyến đó bị tuyến mặc định che mất'],
        1,
        'show ip interface brief reports layers 1 and 2 only, so it can show a perfectly healthy interface that is invisible to routing. The usual cause is that ip address was typed while the prompt was in a different interface sub-mode. show run interface g0/0 settles it, and a router routes only for networks it can see.|||show ip interface brief chỉ báo cáo tầng 1 và 2, nên nó có thể hiện ra một cổng hoàn toàn khoẻ mạnh mà vô hình với việc định tuyến. Nguyên nhân thường gặp là lệnh ip address được gõ trong lúc dấu nhắc đang ở chế độ con của một cổng khác. Lệnh show run interface g0/0 giải quyết chuyện đó, và một router chỉ định tuyến cho những mạng nó nhìn thấy.'),

      q('Which device needs ip default-gateway?|||Thiết bị nào cần ip default-gateway?',
        ['A router|||Một con router', 'A layer-2 switch, because at layer 3 it is an end device|||Một con switch tầng 2, vì xét ở tầng 3 nó là thiết bị đầu cuối', 'Both equally|||Cả hai như nhau', 'Neither — it is obsolete|||Không cái nào — lệnh đó lỗi thời rồi'],
        1,
        'A switch has one management address and no routing table, exactly like a PC, so it needs somewhere to send anything off its own subnet. A router IS the thing with a routing table, so its equivalent is a default route: ip route 0.0.0.0 0.0.0.0. Typing ip default-gateway on a router is accepted and silently ignored while IP routing is enabled, which wastes a lot of lab time because nothing warns you.|||Switch có một địa chỉ quản trị và không có bảng định tuyến, y hệt một cái PC, nên nó cần một chỗ để gửi mọi thứ ngoài subnet của nó. Router thì CHÍNH LÀ cái thứ có bảng định tuyến, nên thứ tương đương của nó là một tuyến mặc định: ip route 0.0.0.0 0.0.0.0. Gõ ip default-gateway lên router thì được chấp nhận rồi bị bỏ qua lặng lẽ chừng nào định tuyến IP còn bật, và chuyện đó ngốn nhiều giờ lab vì không có gì cảnh báo bạn.'),

      q('You remove ip default-gateway from a switch. What breaks?|||Bạn gỡ ip default-gateway khỏi một con switch. Cái gì hỏng?',
        ['All switching stops|||Việc chuyển mạch dừng hẳn', 'Only management from outside its own subnet|||Chỉ việc quản trị từ ngoài subnet của nó', 'The SVI goes down|||SVI tắt đi', 'Nothing at all|||Hoàn toàn không có gì'],
        1,
        'Frame switching is a layer-2 function and does not involve IP at all — a switch with no address whatsoever still forwards traffic perfectly. Only the switch own management traffic is affected: it becomes reachable from its own VLAN and nowhere else, and it can no longer send syslog or SNMP off-subnet. This is exactly why the fault is invisible in a lab where everyone shares one subnet.|||Chuyển mạch khung là chức năng tầng 2 và hoàn toàn không dính tới IP — một con switch không có địa chỉ nào vẫn chuyển tiếp lưu lượng hoàn hảo. Chỉ lưu lượng quản trị của chính con switch bị ảnh hưởng: nó chỉ còn tới được từ VLAN của nó và không từ đâu khác, và nó không gửi được syslog hay SNMP ra ngoài subnet nữa. Chính vì thế mà cái lỗi này vô hình trong một buổi lab nơi ai cũng chung một subnet.'),

      q('What is the Linux equivalent of the IOS command no shutdown?|||Bản tương đương trên Linux của lệnh IOS no shutdown là gì?',
        ['systemctl restart network', 'ip link set eth0 up', 'ifconfig eth0 enable', 'sysctl net.ipv4.ip_forward=1'],
        1,
        'ip link set eth0 up is literally the same operation: enable the interface administratively. The full mapping is ip addr add for the address, ip link set up for no shutdown, and ip route add default via for the gateway. ip_forward=1 is a different thing entirely — it is what turns a host INTO a router, which is why Docker sets it on your server.|||ip link set eth0 up đúng nghĩa là cùng một thao tác: bật cổng lên về mặt quản trị. Ánh xạ đầy đủ là ip addr add cho địa chỉ, ip link set up cho no shutdown, và ip route add default via cho cổng ra. Còn ip_forward=1 là chuyện hoàn toàn khác — nó là thứ biến một máy trạm THÀNH router, và đó là lý do Docker bật nó trên máy chủ của bạn.'),

      q('A colleague says "I configured it and tested it, it definitely works." What is the one question to ask?|||Đồng nghiệp nói "tôi cấu hình rồi, thử rồi, chắc chắn chạy". Câu hỏi duy nhất nên hỏi là gì?',
        ['Which IOS version?|||Bản IOS nào?', 'Did you save it — will it survive a reboot?|||Cậu lưu chưa — nó có sống qua khởi động lại không?', 'Which cable did you use?|||Cậu dùng dây nào?', 'Did you document it?|||Cậu ghi tài liệu chưa?'],
        1,
        '"I tested it" is a statement about running-config only and proves nothing about startup-config; the two are independent. The same trap exists on Linux, where ip addr add lasts until reboot and the permanent form lives in netplan or NetworkManager. A configuration that has not survived a restart has not been tested — and the gap is discovered at the worst possible moment.|||Câu "tôi thử rồi" chỉ là phát biểu về running-config và không chứng minh gì về startup-config; hai thứ đó độc lập. Cái bẫy y hệt tồn tại trên Linux, nơi ip addr add chỉ sống tới lúc khởi động lại còn bản vĩnh viễn nằm trong netplan hoặc NetworkManager. Một cấu hình chưa sống sót qua một lần khởi động lại là một cấu hình chưa được kiểm thử — và khoảng cách đó bị phát hiện vào đúng thời điểm tệ nhất.'),
    ],
  },
};

export default [
  {
    title: 'Chapter 9 — Basic Router Configuration (FLM sessions 26–29)|||Chương 9 — Cấu hình router cơ bản (buổi 26–29 của FLM)',
    slug: 'nwc204-chuong-9-cau-hinh-router-co-ban',
    description: 'Cisco Module 10 theo đúng buổi 26–29 của FLM: router lúc mới bóc hộp, bốn chế độ của IOS và cách đọc dấu nhắc, danh sách cấu hình khởi đầu theo thứ tự, enable secret so với enable password và sự thật về mã hoá loại 7, dòng console và VTY cùng từ khoá login, năm điều kiện bắt buộc của SSH, running-config so với startup-config, ba lệnh cấu hình một cổng và cái no shutdown hay bị quên, đọc cột Status và Protocol như tầng 1 và tầng 2, clock rate của serial, cổng ra mặc định trên switch khác tuyến mặc định trên router, và trọn vẹn Lab 2.1 với trình tự nghiệm thu tám bước. Kèm phần ★ bổ sung: làm đúng những việc đó trên Linux, siết SSH trên VPS thật, khiến cấu hình sống sót sau khởi động lại, và dựng lại Lab 2.1 bằng network namespace. Slide tiếng Anh do cuongthai.com dựng, giảng song ngữ.',
    lessons: [L1, L2, L3, QUIZ],
  },
];
