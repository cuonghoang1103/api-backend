/**
 * NWC204 · Chapter 16 — Build a Small Network (Cisco Module 17).
 * FLM buổi 54–55. LO: CLO8, CLO9. ⭐ ĐÂY LÀ CHƯƠNG CUỐI của môn.
 *
 * Slide: scripts/slides-src/nwc204-ch16.mjs → deck 'nwc204-ch16', 25 ảnh.
 *   bài 16.1 = buổi 54 = slide 1–11 · bài 16.2 = buổi 55 = slide 12–25
 *
 * ⚠️ Bất thường của bảng gốc, đã NÊU trong bài, KHÔNG tự sửa:
 *   - buổi 54 mang CQ18.3 ("Which component is designed to protect against
 *     unauthorized communications to and from a computer?" = tường lửa) →
 *     nội dung CHƯƠNG 15, đã trả lời đầy đủ ở bài 15.2.
 *   - buổi 55 mang CQ19.1 ("Which type of network threat is intended to prevent
 *     authorized users from accessing resources?" = DoS) → cũng CHƯƠNG 15.
 *   - Ngược lại, ba câu KHỚP ĐÚNG chương này lại nằm ở buổi khác:
 *       CQ19.2 ở buổi 57 (buổi ĐỒ ÁN)   → mục 16.3, tài liệu hoá hai sơ đồ
 *       CQ20.1 ở buổi 58 (buổi ÔN TẬP)  → mục 16.3, dự phòng đường ra ISP
 *       CQ20.2 ở buổi 59 (buổi ÔN TẬP)  → mục 16.2, QoS cho luồng thời gian thực
 *     ⇒ trả lời đủ ba câu trong một note-ct ở cuối bài 16.2.
 *   - Buổi 60 ghi LO là "CLO1-CLO11" mà môn chỉ có 10 CLO (đã có trong
 *     ghiChuKiemChung của JSON, nhắc lại ở đây vì đây là chương cuối).
 *   - Buổi 53 "Review Modules 8-15", buổi 58/59/60 "Review": không có tài liệu
 *     riêng, nên chúng được nói tới trong bài 16.2 chứ không thành bài riêng.
 *
 * ★ = phần cuongthai.com bổ sung. ⚠️ Soạn chương này KHÔNG có quyền SSH vào
 *    VPS ⇒ mọi kết xuất lệnh trong bài là DẠNG CHUẨN của lệnh đó, đã ghi rõ,
 *    KHÔNG phải bản ghi đo được. Và KHÔNG in địa chỉ IP công khai thật nào:
 *    chỉ dùng dải tài liệu RFC 5737 (198.51.100.x / 203.0.113.x), dải riêng
 *    RFC 1918, và 8.8.8.8 — bộ phân giải công cộng mà Chương 12 đã dùng suốt.
 *
 * ⚠️ Mỗi khối content PHẢI kết thúc bằng `].join('\n'),`.
 */
import { registerDeck, walk, walkHead, bi, cq } from './_slides.mjs';

const D = registerDeck('nwc204-ch16', {
  code: 'NWC204',
  en: 'Build a Small Network',
  vi: 'Dựng một mạng nhỏ',
  total: 25,
});

/* ──────────────────────── Lesson 16.1 — session 54 ─────────────────────── */

const L1 = {
  title: '16.1 — Devices, protocols and scaling a small network (FLM session 54)|||16.1 — Thiết bị, giao thức và mở rộng một mạng nhỏ (buổi 54 của FLM)',
  slug: 'nwc204-16-1-thiet-bi-giao-thuc-va-mo-rong-mang-nho',
  type: 'DOCUMENT',
  description: 'Buổi 54: một mạng nhỏ gồm những gì, bốn yếu tố chọn thiết bị và vì sao giá với số cổng đánh nhau, những thứ bản thiết kế phải chốt trước khi cắm sợi cáp đầu tiên, các giao thức một mạng nhỏ thật sự chạy và cái duy nhất không chịu được chờ, QoS là quyết định AI PHẢI CHỜ chứ không phải thêm băng thông, mở rộng bắt đầu từ tài liệu chứ không từ hoá đơn, và vì sao MỘT router ra ISP là một điểm hỏng đơn lẻ. Kèm phần ★: một ngăn xếp docker compose chính là một mạng nhỏ có thật, và cùng câu hỏi điểm-hỏng-đơn-lẻ ở tầng ứng dụng.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 16 · Lesson 16.1 · FLM session 54 of 60 · CLO8, CLO9 · Cisco Module 17</span>
<h2>Designing a network small enough that one person can hold it in their head</h2>
<p class="lead">After this lesson you can choose the devices for a small site and defend each choice, say what a design must settle before any cable is plugged in, name the protocols such a network runs and which one cannot tolerate waiting, and explain why one router to the ISP is a decision and not an accident.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 54 — "16. Build a Small Network · 16.1 Devices in a Small Network · 16.2 Small Network Applications and Protocols · 16.3 Scale to Larger Networks"</p>
<p><strong>Opening question.</strong> A twelve-person office asks you to set up their network. Somebody has already bought an eight-port switch because it was cheap. In two years there will be twenty-five people, a printer, three IP phones and a camera at the door, and a single broadband line that goes down for about half a day twice a year. Which of those facts changes what you buy today, and which of them is a risk you are going to write down and accept?</p>
<div class="callout"><strong>This is the last chapter of the course.</strong> It is also the only one with no new layer in it. Chapters 4 to 14 each took one layer apart; Chapter 15 asked who might attack it. This one asks the question all of them were preparation for: <em>given all that, what would you actually build?</em></div>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 17. ⚠️ Mọi kết xuất lệnh trong chương này là <strong>dạng chuẩn</strong> của lệnh đó, không phải bản ghi đo trên một thiết bị đang chạy — và mọi địa chỉ công cộng xuất hiện đều là địa chỉ tài liệu RFC 5737, không phải máy chủ của ai.</p>`,
      `<span class="eyebrow">NWC204 · Chương 16 · Bài 16.1 · Buổi 54/60 của FLM · CLO8, CLO9 · Cisco Module 17</span>
<h2>Thiết kế một mạng đủ nhỏ để một người ôm hết được trong đầu</h2>
<p class="lead">Học xong bài này bạn chọn được thiết bị cho một cơ sở nhỏ và biện hộ được từng lựa chọn, nói được bản thiết kế phải chốt những gì trước khi cắm sợi cáp đầu tiên, gọi tên được các giao thức mà một mạng như vậy chạy và cái duy nhất không chịu được chờ, và giải thích được vì sao một router duy nhất ra ISP là một quyết định chứ không phải một tai nạn.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 54 — "16. Build a Small Network · 16.1 Devices in a Small Network · 16.2 Small Network Applications and Protocols · 16.3 Scale to Larger Networks"</p>
<p><strong>Câu hỏi mở đầu.</strong> Một văn phòng mười hai người nhờ bạn dựng mạng. Ai đó đã trót mua một con switch tám cổng vì nó rẻ. Hai năm nữa chỗ đó sẽ có hai mươi lăm người, một máy in, ba máy điện thoại IP và một camera ở cửa, cộng một đường truyền duy nhất mỗi năm chết chừng nửa ngày, hai lần. Trong những dữ kiện đó, cái nào làm thay đổi thứ bạn mua hôm nay, và cái nào là một rủi ro mà bạn sẽ ghi ra giấy rồi chấp nhận?</p>
<div class="callout"><strong>Đây là chương cuối của môn.</strong> Nó cũng là chương duy nhất không có tầng nào mới. Chương 4 tới 14 mỗi chương mổ một tầng; Chương 15 hỏi ai có thể tấn công nó. Chương này hỏi đúng cái câu mà tất cả những chương kia là bước chuẩn bị: <em>biết từng ấy rồi, thì bạn sẽ dựng cái gì?</em></div>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 17. ⚠️ Mọi kết xuất lệnh trong chương này là <strong>dạng chuẩn</strong> của lệnh đó, không phải bản ghi đo trên một thiết bị đang chạy — và mọi địa chỉ công cộng xuất hiện đều là địa chỉ tài liệu RFC 5737, không phải máy chủ của ai.</p>`,
    ),

    walkHead('nwc204-ch16', 1, 11,
      'Slides 1–11 cover FLM session 54: 16.1 devices, 16.2 applications and protocols, and 16.3 scaling and redundancy.',
      'Slide 1–11 là buổi 54 của FLM: 16.1 thiết bị, 16.2 ứng dụng và giao thức, 16.3 mở rộng và dự phòng.'),

    walk('nwc204-ch16', [
      [1, 'Cover — Chapter 16, Build a Small Network',
        `<p>Chapter 16 is <strong>Cisco Module 17</strong>, and FPT gives it two sessions — the last two teaching sessions of the whole course.</p>
<ul>
<li>Session 54 — 16.1 Devices in a Small Network, 16.2 Small Network Applications and Protocols, 16.3 Scale to Larger Networks.</li>
<li>Session 55 — 16.4 Verify Connectivity, 16.5 Host and IOS Commands, 16.6 Troubleshooting Methodologies, 16.7 Troubleshooting Scenarios, 16.8 AI tools.</li>
<li>Outcomes: <strong>CLO8</strong> and <strong>CLO9</strong> only.</li>
</ul>
<p>Around these two sessions there is nothing but revision and project work: session 53 is "Review Modules 8-15", sessions 56 and 57 are the group project, and sessions 58, 59 and 60 are marked simply "Review". So <strong>this chapter is the last new material the syllabus contains</strong>.</p>`,
        `<p>Chương 16 là <strong>Module 17 của Cisco</strong>, và trường xếp cho nó hai buổi — hai buổi dạy cuối cùng của cả môn.</p>
<ul>
<li>Buổi 54 — 16.1 Thiết bị trong một mạng nhỏ, 16.2 Ứng dụng và giao thức của mạng nhỏ, 16.3 Mở rộng lên mạng lớn hơn.</li>
<li>Buổi 55 — 16.4 Kiểm chứng kết nối, 16.5 Lệnh trên máy trạm và trên IOS, 16.6 Các phương pháp gỡ lỗi, 16.7 Các tình huống gỡ lỗi, 16.8 công cụ AI.</li>
<li>Chuẩn đầu ra: chỉ <strong>CLO8</strong> và <strong>CLO9</strong>.</li>
</ul>
<p>Xung quanh hai buổi này không còn gì ngoài ôn tập và đồ án: buổi 53 là "Review Modules 8-15", buổi 56 và 57 là đồ án nhóm, còn buổi 58, 59, 60 chỉ ghi vỏn vẹn "Review". Nghĩa là <strong>chương này là phần kiến thức mới cuối cùng mà syllabus có</strong>.</p>`],

      [2, 'Two sessions, and the two outcomes they are measured by',
        `<p>Only two outcomes are attached to this chapter, and both are worth quoting in full.</p>
<p><strong>CLO8</strong> — <em>"Design and implement a small network topology with routers, switches, and end devices, considering performance and scalability."</em></p>
<p><strong>CLO9</strong> — <em>"Utilize AI tools to analyze, configure, monitor, and troubleshoot networks, enhancing learning, efficiency, and network management capabilities."</em></p>
<p><strong>Read the two verbs in CLO8: design AND implement.</strong> Every other chapter asked you to explain something. This one asks you to produce a design and then stand behind it, judged on <em>performance</em> and <em>scalability</em> — two words that mean "it works now" and "it will still work when there are twice as many people".</p>
<p>That is why this chapter is last. It has no content of its own; its content is the other fifteen chapters, assembled.</p>`,
        `<p>Chương này chỉ gắn với hai chuẩn đầu ra, và cả hai đều đáng trích đủ.</p>
<p><strong>CLO8</strong> — <em>"Design and implement a small network topology with routers, switches, and end devices, considering performance and scalability."</em> (Thiết kế và triển khai một sơ đồ mạng nhỏ với router, switch và thiết bị đầu cuối, có tính tới hiệu năng và khả năng mở rộng.)</p>
<p><strong>CLO9</strong> — <em>"Utilize AI tools to analyze, configure, monitor, and troubleshoot networks, enhancing learning, efficiency, and network management capabilities."</em> (Dùng công cụ AI để phân tích, cấu hình, giám sát và gỡ lỗi mạng.)</p>
<p><strong>Hãy đọc hai động từ trong CLO8: thiết kế VÀ triển khai.</strong> Mọi chương khác chỉ yêu cầu bạn giải thích một thứ. Chương này yêu cầu bạn đưa ra một bản thiết kế rồi đứng ra bảo vệ nó, và bị chấm theo <em>hiệu năng</em> với <em>khả năng mở rộng</em> — hai chữ nghĩa là "chạy được bây giờ" và "vẫn chạy được khi số người gấp đôi".</p>
<p>Đó là lý do chương này nằm cuối. Nó không có nội dung riêng; nội dung của nó chính là mười lăm chương kia, ghép lại.</p>`],

      [3, '16.1 What a small network is made of',
        `<p>Cisco calls a network "small" when it serves one site, usually under 200 users, with one router at the edge and one or two switches behind it. The definition matters less than its consequence.</p>
<p><strong>The consequence is who maintains it.</strong> A small network is run by one or two people who also do everything else in the company. There is no night shift, no second engineer, no change-review board. So <strong>simplicity is not a preference here, it is a requirement</strong>: a design you cannot reconstruct from memory at two in the morning is a design that will eventually stay broken until business hours.</p>
<p>What is shared on it is predictable: file and print, mail, a website, DNS and DHCP, and — increasingly — voice and video, which is the part that changes the design.</p>
<p><strong>The router is the edge.</strong> It is the only device between everyone inside and everything outside, which means it is simultaneously the default gateway, the NAT device, the firewall and the single point of failure. Four jobs, one box, and Chapter 15 already explained why that box is also the most attacked one.</p>`,
        `<p>Cisco gọi một mạng là "nhỏ" khi nó phục vụ một cơ sở, thường dưới 200 người dùng, với một router ở biên và một hoặc hai con switch phía sau. Bản thân định nghĩa không quan trọng bằng hệ quả của nó.</p>
<p><strong>Hệ quả là chuyện ai duy trì nó.</strong> Một mạng nhỏ do một hai người trông, mà họ còn làm mọi việc khác trong công ty. Không có ca đêm, không có kỹ sư thứ hai, không có hội đồng duyệt thay đổi. Nên <strong>tính đơn giản ở đây không phải sở thích mà là yêu cầu bắt buộc</strong>: một thiết kế mà bạn không dựng lại được từ trí nhớ lúc hai giờ sáng là một thiết kế rồi sẽ nằm hỏng tới giờ hành chính.</p>
<p>Thứ được chia sẻ trên đó thì đoán được: file và máy in, thư, một trang web, DNS và DHCP, và — ngày càng nhiều — thoại với video, mà đó mới là phần làm thay đổi bản thiết kế.</p>
<p><strong>Router chính là biên.</strong> Nó là thiết bị duy nhất nằm giữa tất cả người bên trong và tất cả những gì bên ngoài, nghĩa là nó đồng thời là cổng mặc định, là thiết bị NAT, là tường lửa, và là điểm hỏng đơn lẻ. Bốn việc, một cái hộp — và Chương 15 đã giải thích vì sao cái hộp đó cũng là cái bị tấn công nhiều nhất.</p>`],

      [4, '16.1 Choosing devices: the four factors',
        `<p>Module 17 lists four factors for choosing a switch or a router, and the interesting part is that two of them pull against each other.</p>
<ul>
<li><strong>Cost</strong> — what the budget buys, including the support contract nobody remembers to price.</li>
<li><strong>Ports and speed</strong> — how many devices, at what link rate, and what the uplink carries.</li>
<li><strong>Expandability</strong> — fixed-configuration boxes are cheaper; modular ones take extra cards later.</li>
<li><strong>Operating system features</strong> — does this image actually support routing, QoS, ACLs, SSH?</li>
</ul>
<p><strong>Cost versus ports is the whole exercise.</strong> The eight-port switch in the opening question is cheap and correct for twelve people — right up to the day there are fourteen, and then somebody daisy-chains a second cheap switch, and now every packet between the two halves of the office crosses one uplink. Count ports for the headcount you expect, not the one you have.</p>
<p>The fourth factor is the one that produces the most unpleasant surprise, because it is invisible until you need it: a device can be the right size, the right speed and the right price, and still refuse to do the one thing you bought it for, because that feature is not in its image licence.</p>`,
        `<p>Module 17 liệt kê bốn yếu tố để chọn một con switch hay router, và chỗ thú vị là hai trong số đó kéo ngược nhau.</p>
<ul>
<li><strong>Giá</strong> — ngân sách mua được gì, kể cả hợp đồng bảo hành mà chẳng ai nhớ tính vào.</li>
<li><strong>Số cổng và tốc độ</strong> — bao nhiêu thiết bị, ở tốc độ nào, và đường uplink phải chở bao nhiêu.</li>
<li><strong>Khả năng mở rộng</strong> — loại cố định thì rẻ hơn; loại mô-đun thì cắm thêm card được về sau.</li>
<li><strong>Tính năng của hệ điều hành</strong> — bản image này có thật sự làm được định tuyến, QoS, ACL, SSH không?</li>
</ul>
<p><strong>Giá đấu với số cổng chính là toàn bộ bài toán.</strong> Con switch tám cổng trong câu hỏi mở đầu vừa rẻ vừa đúng cho mười hai người — cho tới cái ngày có mười bốn người, rồi ai đó nối thêm một con switch rẻ nữa, và từ đó mọi gói tin đi giữa hai nửa văn phòng đều phải chui qua đúng một đường uplink. Hãy đếm cổng theo số người bạn dự kiến, đừng đếm theo số người đang có.</p>
<p>Yếu tố thứ tư mới là cái gây bất ngờ khó chịu nhất, vì nó vô hình cho tới lúc bạn cần: một thiết bị có thể đúng cỡ, đúng tốc độ, đúng giá, mà vẫn từ chối làm đúng cái việc bạn mua nó về để làm — vì tính năng đó không nằm trong giấy phép của bản image.</p>`],

      [5, '16.1 What the design must settle before any cable is plugged',
        `<p>Five decisions belong on paper before anyone touches hardware.</p>
<ul>
<li><strong>Addressing</strong> — one planned scheme: which subnet, which gateway, how much room to grow.</li>
<li><strong>Static or DHCP</strong> — servers, printers and network devices get static addresses; user devices get DHCP. The rule is "anything another machine must find by address is static".</li>
<li><strong>Redundancy</strong> — where a second path exists, and where you have knowingly accepted a single point of failure.</li>
<li><strong>Traffic types</strong> — which traffic is real-time and therefore must not sit in a queue.</li>
<li><strong>Security</strong> — Chapter 15: harden the devices first, then filter at the edge.</li>
</ul>
<p><strong>The third one is the one people get wrong, and not in the way you would expect.</strong> Accepting a single point of failure is a perfectly legitimate design decision — a second internet line costs real money every month, and a twelve-person office may rationally decide that half a day of downtime twice a year is cheaper. What is <em>not</em> legitimate is having one without knowing it. Written down, it is a managed risk with a plan attached. Undiscovered, it is the outage that surprises everybody.</p>`,
        `<p>Năm quyết định phải nằm trên giấy trước khi có ai đụng vào phần cứng.</p>
<ul>
<li><strong>Địa chỉ</strong> — một sơ đồ đã hoạch định: subnet nào, cổng mặc định nào, chừa chỗ lớn bao nhiêu.</li>
<li><strong>Tĩnh hay DHCP</strong> — máy chủ, máy in và thiết bị mạng dùng địa chỉ tĩnh; máy người dùng dùng DHCP. Luật là "thứ gì mà máy khác phải tìm tới theo địa chỉ thì để tĩnh".</li>
<li><strong>Dự phòng</strong> — chỗ nào có đường thứ hai, và chỗ nào bạn đã biết rõ mà vẫn chấp nhận một điểm hỏng đơn lẻ.</li>
<li><strong>Loại lưu lượng</strong> — lưu lượng nào là thời gian thực và vì thế không được nằm xếp hàng.</li>
<li><strong>An ninh</strong> — Chương 15: làm cứng thiết bị trước, rồi mới lọc ở biên.</li>
</ul>
<p><strong>Cái thứ ba là chỗ người ta hay sai, mà sai không theo kiểu bạn tưởng.</strong> Chấp nhận một điểm hỏng đơn lẻ là một quyết định thiết kế hoàn toàn chính đáng — một đường internet thứ hai tốn tiền thật mỗi tháng, và một văn phòng mười hai người có thể tính rất tỉnh rằng mỗi năm chết nửa ngày hai lần thì vẫn rẻ hơn. Cái <em>không</em> chính đáng là có một điểm hỏng như thế mà không biết. Ghi ra giấy thì nó là một rủi ro được quản lý, kèm một phương án. Không ai phát hiện ra thì nó là cú sập làm cả công ty ngỡ ngàng.</p>`],

      [6, '★ You already run a small network',
        `<p>★ This slide is not in Cisco Module 17. It is here because the person taking this course already administers a network that matches the module almost line for line, and it is easier to design a thing you have already met.</p>
<p>A <code>docker compose</code> stack on one server is a small network in every sense the module uses:</p>
<ul>
<li><strong>nginx is the edge device</strong> — the only thing published to the outside, doing exactly the router-plus-firewall job of slide 3.</li>
<li><strong>The bridge network is the LAN</strong> — <code>172.18.0.0/16</code> is RFC 1918 private space, the same kind of range as the <code>192.168.x.x</code> behind any office router.</li>
<li><strong>The containers are the internal hosts</strong> — frontend, backend, database, cache: each with an address on that network, reachable by name from inside, unreachable from outside.</li>
<li><strong>Names are resolved internally</strong> — a service reaches <code>postgres</code> by name, which is a private DNS, which is 16.2.</li>
</ul>
<p><strong>Why this is worth stating.</strong> Every design question in this chapter has a container-sized twin: which device sits at the edge, who is allowed to talk to whom, what gets published and what stays inside, and what happens when one piece stops. The scale is different; the questions are identical.</p>`,
        `<p>★ Slide này không có trong Module 17 của Cisco. Nó ở đây vì người học môn này đã đang quản trị một mạng khớp với module gần như từng dòng, mà thiết kế một thứ mình đã gặp rồi thì dễ hơn nhiều.</p>
<p>Một ngăn xếp <code>docker compose</code> trên một máy chủ là một mạng nhỏ theo đúng mọi nghĩa mà module dùng:</p>
<ul>
<li><strong>nginx là thiết bị biên</strong> — thứ duy nhất công bố ra ngoài, làm đúng cái việc router-kiêm-tường-lửa ở slide 3.</li>
<li><strong>Mạng bridge chính là LAN</strong> — <code>172.18.0.0/16</code> là không gian riêng RFC 1918, cùng loại dải với <code>192.168.x.x</code> nằm sau bất kỳ router văn phòng nào.</li>
<li><strong>Các container là host nội bộ</strong> — frontend, backend, cơ sở dữ liệu, bộ nhớ đệm: mỗi cái một địa chỉ trên mạng đó, gọi nhau bằng tên từ bên trong, không ai từ ngoài tới được.</li>
<li><strong>Tên được phân giải nội bộ</strong> — một dịch vụ tìm tới <code>postgres</code> bằng tên, tức là một DNS riêng, tức là mục 16.2.</li>
</ul>
<p><strong>Vì sao điều này đáng nói.</strong> Mọi câu hỏi thiết kế trong chương này đều có một phiên bản cỡ-container: thiết bị nào ngồi ở biên, ai được phép nói chuyện với ai, cái gì công bố ra ngoài và cái gì ở lại bên trong, và chuyện gì xảy ra khi một mảnh dừng lại. Quy mô thì khác; các câu hỏi thì y hệt.</p>`],

      [7, '16.2 The protocols a small network actually runs',
        `<p>The service list of a small network is short and you have already met all of it.</p>
<ul>
<li><strong>DNS</strong> on 53 — names to addresses. Chapter 14.</li>
<li><strong>DHCP</strong> on 67/68 — addresses to hosts that have none. Chapters 10 and 14.</li>
<li><strong>HTTP / HTTPS</strong> on 80 and 443. Chapters 13 and 14.</li>
<li><strong>SMTP / IMAP</strong> on 25, 587, 143, 993 — sending and reading mail. Chapter 14.</li>
<li><strong>SSH</strong> on 22 — remote administration. Chapters 2 and 15.</li>
<li><strong>RTP over UDP</strong> on dynamic ports — voice and video. New in this chapter.</li>
</ul>
<p><strong>Only the last one is new, and it is new for a reason.</strong> Everything above it survives a lost packet by asking again: a web page re-requests, a mail transfer retries, a DNS query repeats. Real-time audio cannot. A voice packet that arrives 300 ms late has missed its moment — the conversation has already moved past it — so retransmitting it is worse than dropping it, because the retransmission steals capacity from packets that are still useful.</p>
<p>That single property is why voice changes a network design, and nothing else on the list does.</p>`,
        `<p>Danh sách dịch vụ của một mạng nhỏ thì ngắn, và bạn đã gặp hết rồi.</p>
<ul>
<li><strong>DNS</strong> ở cổng 53 — tên thành địa chỉ. Chương 14.</li>
<li><strong>DHCP</strong> ở 67/68 — cấp địa chỉ cho host chưa có. Chương 10 và 14.</li>
<li><strong>HTTP / HTTPS</strong> ở 80 và 443. Chương 13 và 14.</li>
<li><strong>SMTP / IMAP</strong> ở 25, 587, 143, 993 — gửi và đọc thư. Chương 14.</li>
<li><strong>SSH</strong> ở 22 — quản trị từ xa. Chương 2 và 15.</li>
<li><strong>RTP trên UDP</strong> ở các cổng động — thoại và video. Mới, ở chương này.</li>
</ul>
<p><strong>Chỉ cái cuối cùng là mới, và nó mới vì một lý do.</strong> Mọi thứ phía trên nó sống sót qua một gói mất bằng cách hỏi lại: trang web xin lại, cú chuyển thư thử lại, truy vấn DNS lặp lại. Âm thanh thời gian thực thì không. Một gói thoại tới trễ 300 ms là đã lỡ mất khoảnh khắc của nó — cuộc nói chuyện đã đi qua chỗ đó rồi — nên gửi lại nó còn tệ hơn vứt nó đi, vì lần gửi lại ấy cướp mất dung lượng của những gói còn dùng được.</p>
<p>Đúng một tính chất ấy là lý do thoại làm thay đổi thiết kế mạng, còn mọi thứ khác trong danh sách thì không.</p>`],

      [8, '16.2 Real-time traffic, and the answer named QoS',
        `<p>A queue on a link is first-in-first-out. That is fair and it is exactly the problem: a voice packet that arrives behind a chunk of a 2 GB backup waits for the backup, and no amount of fairness makes the call audible.</p>
<p><strong>Quality of Service</strong> is the mechanism that breaks the queue into classes: classify traffic, then serve the delay-sensitive class first at every point where a queue can form.</p>
<p><strong>This is the answer to CQ20.2</strong> — <em>"What mechanism can be implemented in a small network to help minimize network latency for real-time streaming applications?"</em> Answer: QoS, meaning classification plus priority queuing, applied on the congested links.</p>
<p><strong>The sentence that stops most of the confusion: QoS does not create bandwidth. It decides who waits.</strong> On a link that is not congested it changes nothing measurable, which is why "we turned on QoS and nothing got better" almost always means the link was never the bottleneck. Measure where the queue actually forms — usually the uplink or the WAN line, never the whole network — and apply it there.</p>`,
        `<p>Một hàng đợi trên đường truyền là vào-trước-ra-trước. Điều đó công bằng, và nó chính là vấn đề: một gói thoại tới sau một mẩu của bản sao lưu 2 GB sẽ phải chờ bản sao lưu, mà sự công bằng thì chẳng làm cuộc gọi nghe rõ hơn được chút nào.</p>
<p><strong>Chất lượng dịch vụ (QoS)</strong> là cơ chế bẻ hàng đợi thành nhiều lớp: phân loại lưu lượng, rồi phục vụ lớp nhạy-cảm-với-độ-trễ trước, ở mọi chỗ có thể hình thành hàng đợi.</p>
<p><strong>Đây chính là đáp án của CQ20.2</strong> — <em>"What mechanism can be implemented in a small network to help minimize network latency for real-time streaming applications?"</em> Đáp án: QoS, tức phân loại cộng với xếp hàng theo ưu tiên, áp lên đúng những đường đang tắc.</p>
<p><strong>Câu nói dẹp được phần lớn hiểu lầm: QoS không tạo ra băng thông. Nó quyết định AI PHẢI CHỜ.</strong> Trên một đường không tắc thì nó chẳng thay đổi gì đo được, và đó là lý do câu "bọn tôi bật QoS rồi mà chẳng khá hơn" gần như luôn có nghĩa là đường truyền chưa bao giờ là nút thắt. Hãy đo xem hàng đợi thật sự hình thành ở đâu — thường là đường uplink hoặc đường WAN, không bao giờ là cả mạng — rồi áp vào đúng chỗ đó.</p>`],

      [9, '16.3 Scaling starts with a document, not a purchase',
        `<p>Module 17 lists what you need before you can scale, and it is striking that none of it is equipment.</p>
<ol>
<li><strong>The physical topology</strong> — where each device is, which cable runs where, which port is which.</li>
<li><strong>The logical topology</strong> — subnets, VLANs, addresses, routes: who can reach whom, and by what path.</li>
<li><strong>An inventory</strong> — device, model, image version, purpose, owner.</li>
<li><strong>Budget and traffic analysis</strong> — what is being spent, and what the links actually carry.</li>
</ol>
<p><strong>This is the answer to CQ19.2</strong> — <em>"Which element of scaling a network involves identifying the physical and logical topologies?"</em> It is the network documentation step, and it comes first because every later decision is an argument about a diagram. Without the diagrams, scaling is guesswork with invoices attached.</p>
<p><strong>Why two topologies and not one.</strong> They fail differently. A cable unplugged breaks the physical topology while the logical one still reads as correct on paper; a wrong subnet mask breaks the logical topology while every cable is seated perfectly. Troubleshooting mostly consists of working out which of the two diagrams is lying.</p>`,
        `<p>Module 17 liệt kê những thứ bạn cần có trước khi mở rộng được, và điều đáng chú ý là không cái nào trong đó là thiết bị.</p>
<ol>
<li><strong>Sơ đồ vật lý</strong> — thiết bị nào ở đâu, sợi cáp nào chạy tới đâu, cổng nào là cổng nào.</li>
<li><strong>Sơ đồ luận lý</strong> — subnet, VLAN, địa chỉ, tuyến: ai tới được ai, và đi đường nào.</li>
<li><strong>Bảng kiểm kê</strong> — thiết bị, đời máy, phiên bản image, dùng để làm gì, ai chịu trách nhiệm.</li>
<li><strong>Phân tích ngân sách và lưu lượng</strong> — đang tiêu bao nhiêu, và các đường truyền thật sự chở gì.</li>
</ol>
<p><strong>Đây chính là đáp án của CQ19.2</strong> — <em>"Which element of scaling a network involves identifying the physical and logical topologies?"</em> Đó là bước tài liệu hoá mạng, và nó đứng đầu vì mọi quyết định về sau đều là một cuộc tranh luận trên một cái sơ đồ. Không có sơ đồ thì mở rộng là đoán mò kèm hoá đơn.</p>
<p><strong>Vì sao phải hai sơ đồ chứ không phải một.</strong> Chúng hỏng theo hai kiểu khác nhau. Một sợi cáp tuột thì sơ đồ vật lý sai trong khi sơ đồ luận lý trên giấy vẫn đọc lên hoàn toàn đúng; một cái mặt nạ mạng gõ sai thì sơ đồ luận lý sai trong khi mọi sợi cáp đều cắm chuẩn. Gỡ lỗi, phần lớn, chính là việc tìm ra trong hai cái sơ đồ ấy thì cái nào đang nói dối.</p>`],

      [10, '16.3 Redundancy — one exit point is one failure',
        `<p><strong>CQ20.1</strong> asks it directly: <em>"A small company has only one router as the exit point to its ISP. Which solution could be adopted to maintain connectivity if the router itself, or its connection to the ISP, fails?"</em></p>
<p>The answer is <strong>redundancy</strong>: a second, independent path out — a second router, a second ISP link, or ideally both, with a routing protocol or a failover mechanism choosing between them.</p>
<p><strong>The word that does the work is "independent".</strong> Two routers sharing one ISP line survive a dead router and not a cut cable. Two lines from the same provider survive a cut cable and not the provider's own outage. Each step up costs more and removes one more shared failure, and the design question is always "which failures am I buying protection from, and at what monthly price".</p>
<p><strong>And the honest small-network answer is often "none of them".</strong> That is allowed. Redundancy is a cost, not a virtue. What the question really tests is whether you can name the single point of failure and say what it would take to remove it — because a company that knows it has one can at least keep a mobile hotspot in a drawer.</p>`,
        `<p><strong>CQ20.1</strong> hỏi thẳng: <em>"A small company has only one router as the exit point to its ISP. Which solution could be adopted to maintain connectivity if the router itself, or its connection to the ISP, fails?"</em></p>
<p>Đáp án là <strong>dự phòng</strong>: một đường ra thứ hai, độc lập — một router thứ hai, một đường ISP thứ hai, hoặc lý tưởng là cả hai, cộng với một giao thức định tuyến hay một cơ chế chuyển dự phòng để chọn giữa chúng.</p>
<p><strong>Chữ làm nên tất cả ở đây là "độc lập".</strong> Hai con router dùng chung một đường ISP thì sống sót qua cú chết của một router, chứ không sống sót qua một sợi cáp bị cắt. Hai đường của cùng một nhà mạng thì sống sót qua sợi cáp bị cắt, chứ không sống sót qua sự cố của chính nhà mạng đó. Mỗi bậc nâng lên tốn thêm tiền và loại bỏ thêm một cái hỏng dùng chung, và câu hỏi thiết kế luôn luôn là "tôi đang mua sự bảo vệ trước những cú hỏng nào, với giá bao nhiêu một tháng".</p>
<p><strong>Và câu trả lời trung thực của một mạng nhỏ thường là "chẳng cái nào cả".</strong> Thế cũng được. Dự phòng là một khoản chi phí, không phải một đức tính. Thứ mà câu hỏi thật sự kiểm tra là bạn có gọi tên được cái điểm hỏng đơn lẻ ấy và nói được cần gì để bỏ nó đi hay không — vì một công ty biết mình có một điểm như vậy thì ít nhất cũng để sẵn một cục phát Wi-Fi 4G trong ngăn kéo.</p>`],

      [11, '★ The same single point of failure, one layer up',
        `<p>★ Module 17 asks the redundancy question about routers. The question does not stop at layer 3, and asking it at every layer is a habit worth leaving this course with.</p>
<ul>
<li><strong>One server.</strong> Web, API, database and cache on one machine: a single reboot takes all four down at once, and so does a full disk.</li>
<li><strong>One container versus one database.</strong> A stateless service is cheap to duplicate — run two, put a proxy in front. A database is not, because it holds state, and two copies of state need a plan for which one is right.</li>
<li><strong>One provider.</strong> Two machines at one hosting company still share one power event and one network outage.</li>
</ul>
<p><strong>The habit: for every component, ask "if this one thing stops, what else stops with it?"</strong> For most small setups the honest answer is "everything", and that is survivable — provided it is written down next to a restore procedure that somebody has actually run, at least once, on purpose.</p>
<p>A backup you have never restored is not a backup. It is a belief about a file.</p>`,
        `<p>★ Module 17 hỏi câu dự phòng cho router. Câu hỏi ấy không dừng lại ở tầng 3, và tự hỏi nó ở mọi tầng là một thói quen đáng mang ra khỏi môn học này.</p>
<ul>
<li><strong>Một máy chủ.</strong> Web, API, cơ sở dữ liệu và bộ nhớ đệm trên cùng một cái máy: một lần khởi động lại làm cả bốn cùng chết, mà một cái đĩa đầy cũng thế.</li>
<li><strong>Một container so với một cơ sở dữ liệu.</strong> Một dịch vụ không giữ trạng thái thì nhân đôi rất rẻ — chạy hai bản, đặt một proxy phía trước. Cơ sở dữ liệu thì không, vì nó giữ trạng thái, mà hai bản trạng thái thì cần một phương án trả lời "bản nào mới đúng".</li>
<li><strong>Một nhà cung cấp.</strong> Hai cái máy ở cùng một nơi thuê vẫn dùng chung một sự cố điện và một sự cố mạng.</li>
</ul>
<p><strong>Thói quen cần có: với mỗi thành phần, hãy hỏi "nếu đúng cái này dừng lại, thì còn cái gì dừng theo?"</strong> Với phần lớn hệ thống nhỏ, câu trả lời trung thực là "tất cả", và điều đó vẫn sống được — miễn là nó được ghi ra giấy, ngay cạnh một quy trình khôi phục mà đã có người thật sự chạy thử, ít nhất một lần, một cách có chủ ý.</p>
<p>Một bản sao lưu chưa bao giờ được khôi phục thử thì không phải bản sao lưu. Nó là một niềm tin về một cái file.</p>`],
    ]),

    bi(
      `<h3>The design, as one picture</h3>
<pre><code class="language-mermaid">flowchart TD
  A["Small network design"] --&gt; B["Count devices · now and in two years"]
  B --&gt; C["Choose devices · cost · ports · expandability · OS features"]
  C --&gt; D["Plan addressing · static for servers · DHCP for users"]
  D --&gt; E["Decide redundancy · second path, or a risk written down"]
  E --&gt; F["Document BOTH topologies · physical and logical"]
  classDef plan fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef risk fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef done fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14603f
  class A,B,C plan
  class D,E risk
  class F done</code></pre>
<p>Nothing here is a purchase until step three, and the last step is the one that makes the next engineer able to work on it. That ordering is the content of 16.1 to 16.3.</p>`,
      `<h3>Bản thiết kế, gói trong một hình</h3>
<pre><code class="language-mermaid">flowchart TD
  A["Thiết kế một mạng nhỏ"] --&gt; B["Đếm thiết bị · bây giờ và hai năm nữa"]
  B --&gt; C["Chọn thiết bị · giá · số cổng · mở rộng · tính năng OS"]
  C --&gt; D["Hoạch định địa chỉ · tĩnh cho máy chủ · DHCP cho người dùng"]
  D --&gt; E["Chốt dự phòng · đường thứ hai, hoặc một rủi ro ghi ra giấy"]
  E --&gt; F["Tài liệu hoá CẢ HAI sơ đồ · vật lý và luận lý"]
  classDef plan fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef risk fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef done fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14603f
  class A,B,C plan
  class D,E risk
  class F done</code></pre>
<p>Không có bước nào là mua sắm cho tới bước thứ ba, còn bước cuối là bước làm cho người kỹ sư kế tiếp có thể làm việc trên đó. Đúng cái thứ tự ấy là nội dung của 16.1 đến 16.3.</p>`,
    ),

    bi(
      `<h3>🔍 Cách tự kiểm — read your own small network before you design somebody else's</h3>
<p>You do not need lab hardware for this. Any machine on any network will answer all of it.</p>
<p><strong>1. Find the edge device of the network you are sitting on.</strong></p>
<pre><code class="language-bash">ip route | head -1            # Linux / macOS
route print | findstr 0.0.0.0 # Windows</code></pre>
<p>The address after <code>default via</code> (or the 0.0.0.0 gateway) is your edge router. Everything that leaves this network goes through it, which means it is also this network's single point of failure.</p>
<p><strong>2. Find out whether your address is static or from DHCP.</strong></p>
<pre><code class="language-bash">ip addr show          # look for "dynamic" on the inet line
ipconfig /all         # Windows: "DHCP Enabled" and "Lease Obtained"</code></pre>
<p>Now apply the rule from slide 5: is this a machine another machine needs to find by address? If yes and it is on DHCP, you have found a design flaw, not a setting.</p>
<p><strong>3. If you run containers, list your own small network.</strong></p>
<pre><code class="language-bash">docker network ls
docker network inspect &lt;name&gt; --format '{{range .IPAM.Config}}{{.Subnet}}{{end}}'</code></pre>
<p>Expect an RFC 1918 range such as <code>172.18.0.0/16</code>. That is the LAN from slide 6, and the containers on it are the internal hosts.</p>
<p><strong>What each result means.</strong> A default route present and a gateway that answers means layers 1 to 3 are fine to the edge. A private subnet that overlaps a range your company already uses elsewhere is a real future incident, and it is much cheaper to find now, on paper, than later, at 2am.</p>`,
      `<h3>🔍 Cách tự kiểm — đọc chính cái mạng nhỏ của bạn trước khi thiết kế cho người khác</h3>
<p>Phần này không cần phần cứng phòng lab. Bất kỳ cái máy nào trên bất kỳ mạng nào cũng trả lời được hết.</p>
<p><strong>1. Tìm thiết bị biên của cái mạng bạn đang ngồi trong.</strong></p>
<pre><code class="language-bash">ip route | head -1            # Linux / macOS
route print | findstr 0.0.0.0 # Windows</code></pre>
<p>Địa chỉ đứng sau <code>default via</code> (hoặc gateway của 0.0.0.0) chính là router biên của bạn. Mọi thứ rời khỏi mạng này đều đi qua nó, nghĩa là nó cũng là điểm hỏng đơn lẻ của mạng này.</p>
<p><strong>2. Xem địa chỉ của bạn là tĩnh hay do DHCP cấp.</strong></p>
<pre><code class="language-bash">ip addr show          # tìm chữ "dynamic" trên dòng inet
ipconfig /all         # Windows: "DHCP Enabled" và "Lease Obtained"</code></pre>
<p>Giờ áp luật ở slide 5: đây có phải cái máy mà máy khác cần tìm tới theo địa chỉ không? Nếu đúng mà nó lại đang dùng DHCP thì bạn vừa tìm ra một lỗi thiết kế, không phải một tuỳ chọn.</p>
<p><strong>3. Nếu bạn chạy container, hãy liệt kê cái mạng nhỏ của chính mình.</strong></p>
<pre><code class="language-bash">docker network ls
docker network inspect &lt;ten&gt; --format '{{range .IPAM.Config}}{{.Subnet}}{{end}}'</code></pre>
<p>Kỳ vọng thấy một dải riêng RFC 1918 kiểu <code>172.18.0.0/16</code>. Đó chính là cái LAN ở slide 6, và các container trên đó là các host nội bộ.</p>
<p><strong>Mỗi kết quả nghĩa là gì.</strong> Có tuyến mặc định và cổng mặc định đáp lại thì tầng 1 tới 3 chạy tốt tới tận biên. Còn một subnet riêng trùng lên một dải mà công ty bạn đã dùng ở chỗ khác chính là một sự cố tương lai có thật, mà tìm ra bây giờ trên giấy thì rẻ hơn nhiều so với tìm ra lúc hai giờ sáng.</p>`,
    ),

    bi(
      `<div class="pitfall co-tieu-de"><strong>Trap 1 — buying for the headcount you have.</strong> <b>Symptom:</b> eighteen months later a second cheap switch is daisy-chained onto the first, and every packet between the two halves of the office squeezes through one uplink. Users report that "the network is slow in the afternoon", which is when everyone is on it. Count ports for the growth you expect.</div>
<div class="pitfall co-tieu-de"><strong>Trap 2 — an undocumented single point of failure.</strong> <b>Symptom:</b> the day the one router dies, nobody knows whether a spare exists, who the ISP contact is, or what the configuration was. Accepting the risk is fine; not writing it down is what turns a four-hour outage into a two-day one.</div>
<div class="pitfall co-tieu-de"><strong>Trap 3 — thinking QoS adds bandwidth.</strong> <b>Symptom:</b> QoS is configured, nothing measurable improves, and the team concludes the feature is broken. On an uncongested link QoS changes nothing by design. Find where the queue forms first; prioritise second.</div>
<div class="pitfall co-tieu-de"><strong>Trap 4 — putting servers and printers on DHCP.</strong> <b>Symptom:</b> printing works for weeks and then stops after a power cut, because the printer came back with a different address and everybody's driver points at the old one. Anything other machines find by address must be static or DHCP-reserved.</div>
<div class="pitfall co-tieu-de"><strong>Trap 5 — one topology diagram instead of two.</strong> <b>Symptom:</b> an outage where the cabling diagram is perfect and nothing works, because the fault is a subnet mask. The physical and logical topologies fail independently, so they have to be documented independently.</div>`,
      `<div class="pitfall co-tieu-de"><strong>Bẫy 1 — mua theo số người đang có.</strong> <b>Triệu chứng:</b> mười tám tháng sau, một con switch rẻ thứ hai được nối vào con thứ nhất, và mọi gói tin đi giữa hai nửa văn phòng phải chen qua đúng một đường uplink. Người dùng phản ánh "mạng buổi chiều chậm", mà buổi chiều là lúc đông người nhất. Hãy đếm cổng theo mức tăng trưởng bạn dự kiến.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 2 — một điểm hỏng đơn lẻ không ai ghi lại.</strong> <b>Triệu chứng:</b> đúng cái ngày con router duy nhất chết, không ai biết có máy dự phòng không, liên hệ với ai bên ISP, và cấu hình cũ là gì. Chấp nhận rủi ro thì không sao; không ghi nó ra mới là thứ biến một cú sập bốn tiếng thành hai ngày.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 3 — tưởng QoS thêm băng thông.</strong> <b>Triệu chứng:</b> QoS đã cấu hình, không có gì đo được khá lên, và cả nhóm kết luận tính năng đó hỏng. Trên một đường không tắc thì QoS không thay đổi gì, theo đúng thiết kế của nó. Hãy tìm chỗ hàng đợi hình thành trước; ưu tiên hoá sau.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 4 — để máy chủ và máy in chạy DHCP.</strong> <b>Triệu chứng:</b> in ấn chạy êm mấy tuần rồi tắt hẳn sau một lần mất điện, vì máy in quay lại với một địa chỉ khác còn driver của mọi người vẫn trỏ vào địa chỉ cũ. Thứ gì mà máy khác tìm tới theo địa chỉ thì phải để tĩnh, hoặc đặt chỗ cố định trong DHCP.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 5 — chỉ vẽ một sơ đồ thay vì hai.</strong> <b>Triệu chứng:</b> một sự cố mà sơ đồ đi dây thì hoàn hảo còn chẳng cái gì chạy, vì lỗi nằm ở một cái mặt nạ mạng. Sơ đồ vật lý và sơ đồ luận lý hỏng độc lập với nhau, nên phải được ghi chép độc lập với nhau.</div>`,
    ),

    bi(
      `<h3>Exercises</h3>
<p><b>E1.</b> The office in the opening question: twelve people today, twenty-five expected in two years, plus a printer, three IP phones and a door camera. Somebody already bought an eight-port switch. What do you recommend, and what do you say about the switch that was already bought?</p>
<div class="dap-an"><p><b>Count the ports first, because that is the decision the rest depends on.</b> Twenty-five users plus a printer plus three phones plus a camera plus an uplink to the router is 31 ports — and IP phones usually pass a PC through, so the real figure may be nearer 27. Either way it is well past 24, so the honest answer is <b>one 48-port switch, or two 24-port switches with a proper uplink between them</b>.</p>
<p><b>On the switch already bought:</b> it is not wasted, but it is not the core either. Keep it for a separate corner of the office if that saves cabling, and never let it become the box everything else hangs off. The failure mode you are avoiding is the daisy chain in Trap 1: two cheap switches connected to each other turn one link into the bottleneck for everything crossing between them.</p>
<p><b>The phones change one more thing:</b> voice is the real-time traffic from 16.2, so the switch must support QoS, and ideally PoE so the phones do not each need a power brick. That is the fourth factor — OS features — and it is the one that cannot be fixed later without buying the switch again.</p></div>
<p><b>E2.</b> Write down the five design decisions from slide 5 for this same office, making a defensible choice for each one. Do not leave any as "to be decided".</p>
<div class="dap-an"><ul>
<li><b>Addressing:</b> one subnet, <code>192.168.20.0/24</code>, gateway <code>192.168.20.1</code>. 254 usable addresses for an office reaching 31 devices is deliberate headroom, and a single subnet keeps it simple enough to hold in your head — which slide 3 said was a requirement, not a preference.</li>
<li><b>Static or DHCP:</b> <code>.1</code> to <code>.20</code> reserved for infrastructure and set statically — router, switches, printer, camera, phones. <code>.100</code> to <code>.200</code> as the DHCP pool for laptops. The gap between them exists so that growth in either group does not collide.</li>
<li><b>Redundancy:</b> none at the internet edge, <b>accepted deliberately</b>, because a second line costs money every month and this office has decided half a day twice a year is cheaper. Written down, with a 4G hotspot in a drawer as the manual fallback and the ISP contact number beside it.</li>
<li><b>Traffic types:</b> voice from the three phones is real-time; everything else is elastic. QoS on the switch and on the router uplink, prioritising the voice class only.</li>
<li><b>Security:</b> Chapter 15 — no default passwords, SSH only for management, the router's administration interface not reachable from the internet, and the camera on its own VLAN if the switch supports one, because cameras are the least maintained device in any small office.</li>
</ul>
<p>The point of the exercise is the third bullet. <b>"None, and here is why" is a complete answer; "we will think about it later" is not.</b></p></div>
<p><b>E3.</b> ★ Take the small network you actually run — a docker compose stack, a home LAN, anything — and answer the CQ20.1 question about it: if the single exit point failed, what would you do? Then answer the harder version: what would you do if the single <em>machine</em> failed?</p>
<div class="dap-an"><p><b>Exit point.</b> For a compose stack the exit point is nginx. If it stops, everything behind it is unreachable even though every service is healthy, because nothing else is published. The equivalent of the second router is a second reverse proxy with something in front choosing between them — and for a single-server setup that is usually not worth it, so the real answer is "restart it fast", which means the restart policy and the health check matter more than a second copy would.</p>
<p><b>The machine.</b> This is the harder question and the honest answer for most small setups is that everything stops: web, API, database and cache are all on it. Removing that means a second machine and a decision about the database, because state cannot simply be duplicated — two copies need a rule for which one is authoritative.</p>
<p><b>What makes the answer good rather than gloomy:</b> naming it. "One machine, no redundancy, restore from last night's backup, tested on 15 August, takes about 40 minutes" is a managed risk. "It should be fine" is not an answer, it is a hope — and a backup nobody has ever restored is not a backup, it is a belief about a file.</p></div>`,
      `<h3>Bài tập</h3>
<p><b>E1.</b> Văn phòng trong câu hỏi mở đầu: mười hai người hôm nay, dự kiến hai mươi lăm sau hai năm, cộng một máy in, ba điện thoại IP và một camera cửa. Ai đó đã trót mua một con switch tám cổng. Bạn khuyến nghị gì, và bạn nói gì về con switch đã mua?</p>
<div class="dap-an"><p><b>Đếm cổng trước, vì mọi thứ còn lại phụ thuộc vào quyết định đó.</b> Hai mươi lăm người cộng một máy in cộng ba điện thoại cộng một camera cộng một đường lên router là 31 cổng — mà điện thoại IP thường cho máy tính cắm xuyên qua, nên con số thật có thể gần 27 hơn. Đằng nào cũng vượt xa 24, nên câu trả lời trung thực là <b>một con switch 48 cổng, hoặc hai con 24 cổng với một đường uplink tử tế giữa chúng</b>.</p>
<p><b>Về con switch đã mua:</b> nó không phí, nhưng nó cũng không phải lõi. Giữ nó cho một góc riêng của văn phòng nếu việc đó tiết kiệm được dây, và tuyệt đối đừng để nó thành cái hộp mà mọi thứ khác treo vào. Cái hỏng bạn đang tránh chính là kiểu nối dây chuyền ở Bẫy 1: hai con switch rẻ nối vào nhau biến một sợi dây thành nút thắt cho mọi thứ đi qua lại giữa chúng.</p>
<p><b>Mấy cái điện thoại còn làm thay đổi một điều nữa:</b> thoại chính là lưu lượng thời gian thực ở mục 16.2, nên con switch phải hỗ trợ QoS, và tốt nhất là có PoE để ba cái điện thoại không cần ba cục nguồn. Đó là yếu tố thứ tư — tính năng của hệ điều hành — và nó là yếu tố không sửa lại được về sau nếu không mua lại switch.</p></div>
<p><b>E2.</b> Hãy viết ra năm quyết định thiết kế ở slide 5 cho đúng cái văn phòng này, mỗi cái một lựa chọn biện hộ được. Không được để cái nào là "tính sau".</p>
<div class="dap-an"><ul>
<li><b>Địa chỉ:</b> một subnet, <code>192.168.20.0/24</code>, cổng mặc định <code>192.168.20.1</code>. 254 địa chỉ dùng được cho một văn phòng tiến tới 31 thiết bị là chỗ chừa có chủ ý, và một subnet duy nhất giữ cho mọi thứ đủ đơn giản để ôm trong đầu — mà slide 3 đã nói đó là yêu cầu bắt buộc chứ không phải sở thích.</li>
<li><b>Tĩnh hay DHCP:</b> <code>.1</code> tới <code>.20</code> dành cho hạ tầng và đặt tĩnh — router, switch, máy in, camera, điện thoại. <code>.100</code> tới <code>.200</code> làm dải DHCP cho laptop. Khoảng trống ở giữa tồn tại để hai nhóm có lớn lên cũng không đụng nhau.</li>
<li><b>Dự phòng:</b> không có gì ở biên internet, <b>chấp nhận một cách có chủ ý</b>, vì đường thứ hai tốn tiền mỗi tháng còn văn phòng này đã tính rằng mỗi năm chết nửa ngày hai lần thì rẻ hơn. Ghi ra giấy, kèm một cục phát Wi-Fi 4G trong ngăn kéo làm phương án tay và số điện thoại của ISP nằm ngay bên cạnh.</li>
<li><b>Loại lưu lượng:</b> thoại từ ba cái điện thoại là thời gian thực; mọi thứ khác co giãn được. Bật QoS trên switch và trên đường uplink của router, chỉ ưu tiên lớp thoại.</li>
<li><b>An ninh:</b> Chương 15 — không mật khẩu mặc định, quản trị chỉ bằng SSH, giao diện quản trị của router không tới được từ internet, và camera để ở VLAN riêng nếu con switch hỗ trợ, vì camera là thiết bị ít được bảo trì nhất trong mọi văn phòng nhỏ.</li>
</ul>
<p>Điểm mấu chốt của bài tập nằm ở gạch đầu dòng thứ ba. <b>"Không có, và đây là lý do" là một câu trả lời trọn vẹn; "để tính sau" thì không.</b></p></div>
<p><b>E3.</b> ★ Lấy chính cái mạng nhỏ bạn đang chạy — một ngăn xếp docker compose, một mạng nhà, gì cũng được — và trả lời câu CQ20.1 cho nó: nếu cái đường ra duy nhất hỏng thì bạn làm gì? Rồi trả lời phiên bản khó hơn: nếu chính cái <em>máy</em> đó hỏng thì bạn làm gì?</p>
<div class="dap-an"><p><b>Đường ra.</b> Với một ngăn xếp compose thì đường ra là nginx. Nó dừng thì mọi thứ phía sau không ai tới được, dù từng dịch vụ đều khoẻ mạnh, vì không có cái nào khác được công bố. Cái tương đương với "router thứ hai" là một reverse proxy thứ hai cộng một thứ đứng trước để chọn giữa hai bản — mà với một máy chủ đơn thì thường không đáng, nên câu trả lời thật là "khởi động lại thật nhanh", nghĩa là chính sách restart và cái health check quan trọng hơn một bản sao thứ hai.</p>
<p><b>Cái máy.</b> Đây mới là câu khó, và câu trả lời trung thực cho phần lớn hệ thống nhỏ là mọi thứ dừng: web, API, cơ sở dữ liệu và bộ đệm đều nằm trên đó. Bỏ được điều đó thì cần một cái máy thứ hai cộng một quyết định về cơ sở dữ liệu, vì trạng thái không nhân đôi đơn giản như vậy được — hai bản thì cần một luật nói bản nào mới là bản chính.</p>
<p><b>Thứ làm câu trả lời trở nên tốt chứ không bi quan:</b> gọi tên nó ra. "Một máy, không dự phòng, khôi phục từ bản sao lưu tối qua, đã thử khôi phục thật ngày 15 tháng 8, mất khoảng 40 phút" là một rủi ro được quản lý. "Chắc không sao đâu" không phải câu trả lời, đó là một hy vọng — và một bản sao lưu chưa ai từng khôi phục thử thì không phải bản sao lưu, nó là một niềm tin về một cái file.</p></div>`,
    ),

    cq(54, [
      ['CQ18.3', 'Which component is designed to protect against unauthorized communications to and from a computer? <em>— content belongs to Chapter 15; the answer is the FIREWALL, and it is answered in full in Lesson 15.2, including the half people forget: the words "to and from" mean outbound filtering as well as inbound.</em>',
        'Which component is designed to protect against unauthorized communications to and from a computer? <em>— nội dung thuộc Chương 15; đáp án là TƯỜNG LỬA, và đã trả lời đầy đủ ở bài 15.2, kể cả cái nửa mà người ta hay quên: chữ "to and from" nghĩa là lọc cả chiều đi ra chứ không chỉ chiều đi vào.</em>'],
    ]),

    bi(
      `<div class="note-ct"><h3>💬 Why this session's question is about the previous chapter</h3>
<p>Session 54 teaches Chapter 16, but the question table files <strong>CQ18.3</strong> — a firewall question — against it. The firewall belongs to section 15.3, taught in session 50. This is the same one-chapter drift the course has been noting since session 19; it is quoted exactly as published and not corrected here.</p>
<p>The three questions that <em>do</em> match this chapter are printed against sessions 57, 58 and 59 — a project session and two revision sessions. All three are quoted and answered at the end of Lesson 16.2.</p></div>`,
      `<div class="note-ct"><h3>💬 Vì sao câu hỏi của buổi này lại nói về chương trước</h3>
<p>Buổi 54 dạy Chương 16, nhưng bảng câu hỏi lại xếp <strong>CQ18.3</strong> — một câu về tường lửa — vào đây. Tường lửa thuộc mục 15.3, dạy ở buổi 50. Đây vẫn là độ trôi một chương mà môn học đã ghi nhận từ buổi 19; bảng gốc được trích nguyên văn và không bị sửa ở đây.</p>
<p>Ba câu <em>thật sự</em> khớp với chương này lại được in vào buổi 57, 58 và 59 — một buổi đồ án và hai buổi ôn tập. Cả ba đều được trích và trả lời ở cuối bài 16.2.</p></div>`,
    ),
  ].join('\n'),
};

/* ──────────────────────── Lesson 16.2 — session 55 ─────────────────────── */

const L2 = {
  title: '16.2 — Verify, command and troubleshoot a small network (FLM session 55)|||16.2 — Kiểm chứng, ra lệnh và gỡ lỗi một mạng nhỏ (buổi 55 của FLM)',
  slug: 'nwc204-16-2-kiem-chung-ra-lenh-va-go-loi-mang-nho',
  type: 'DOCUMENT',
  description: 'Buổi 55 và là bài cuối của môn: thang kiểm chứng kết nối, bảng lệnh máy trạm trên Windows so với Linux, các lệnh show của IOS và vì sao hai cột Status với Protocol là hai tầng, ba phương pháp gỡ lỗi và cái nào giả định điều gì, ba tình huống gỡ lỗi giải từng bước, công cụ AI. Kèm phần ★: cả môn đã đi bottom-up từ đầu, một tình huống gỡ lỗi kiểu deploy phân biệt 404 với 401 với hết giờ, và một bản đồ nối mười sáu chương thành một đường đi từ tầng 1 lên tầng 7. Cuối bài trả lời đủ CQ19.2, CQ20.1, CQ20.2 và nêu chỗ buổi 60 ghi CLO1-CLO11 trong khi môn chỉ có 10 CLO.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 16 · Lesson 16.2 · FLM session 55 of 60 · CLO8, CLO9 · Cisco Module 17</span>
<h2>Proving a network works, and finding out where it stopped</h2>
<p class="lead">After this lesson you can verify connectivity one layer at a time, reach for the right host or IOS command without guessing, name the three troubleshooting methods and say what each one assumes, and work a fault from a symptom to a cause without re-testing anything you have already proven.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 55 — "16.4 Verify Connectivity · 16.5 Host and IOS Commands · 16.6 Troubleshooting Methodologies · 16.7 Troubleshooting Scenarios · 16.8 Integrate AI Tools for Explaining Concepts (Self Learning)"</p>
<p><strong>Opening question.</strong> A user says "the internet is down". You are three metres away and could start touching things immediately. Before you touch anything, you can ask that person exactly one question. Which question removes the most possibilities — and why is "is your cable plugged in" not it?</p>
<div class="callout"><strong>This is the last teaching session of the course.</strong> Sessions 56 and 57 are the group project; 58, 59 and 60 are revision. Everything after this lesson is you applying what is already here.</div>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 17. ⚠️ Mọi kết xuất lệnh dưới đây là <strong>dạng chuẩn</strong> của lệnh đó, không phải bản ghi đo trên một thiết bị đang chạy.</p>`,
      `<span class="eyebrow">NWC204 · Chương 16 · Bài 16.2 · Buổi 55/60 của FLM · CLO8, CLO9 · Cisco Module 17</span>
<h2>Chứng minh một mạng chạy được, và tìm ra chỗ nó dừng lại</h2>
<p class="lead">Học xong bài này bạn kiểm chứng được kết nối theo từng tầng một, với tay đúng lệnh trên máy trạm hoặc trên IOS mà không phải đoán, gọi tên được ba phương pháp gỡ lỗi và nói được mỗi cái giả định điều gì, và đi từ triệu chứng tới nguyên nhân mà không thử lại thứ mình đã chứng minh rồi.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 55 — "16.4 Verify Connectivity · 16.5 Host and IOS Commands · 16.6 Troubleshooting Methodologies · 16.7 Troubleshooting Scenarios · 16.8 Integrate AI Tools for Explaining Concepts (Self Learning)"</p>
<p><strong>Câu hỏi mở đầu.</strong> Một người dùng bảo "mạng chết rồi". Bạn đang đứng cách đó ba mét và hoàn toàn có thể bắt tay vào sờ mó ngay. Nhưng trước khi đụng vào cái gì, bạn được hỏi người đó đúng một câu. Câu nào loại trừ được nhiều khả năng nhất — và vì sao "dây mạng của bạn có cắm không" lại không phải câu đó?</p>
<div class="callout"><strong>Đây là buổi dạy cuối cùng của môn.</strong> Buổi 56 và 57 là đồ án nhóm; buổi 58, 59, 60 là ôn tập. Mọi thứ sau bài này là bạn đem những gì đã có ra dùng.</div>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 17. ⚠️ Mọi kết xuất lệnh dưới đây là <strong>dạng chuẩn</strong> của lệnh đó, không phải bản ghi đo trên một thiết bị đang chạy.</p>`,
    ),

    walkHead('nwc204-ch16', 12, 25,
      'Slides 12–25 cover FLM session 55: verification, host and IOS commands, the three methodologies, two scenarios, AI tools — plus the ★ material and the map that closes the course.',
      'Slide 12–25 là buổi 55 của FLM: kiểm chứng, lệnh máy trạm và IOS, ba phương pháp, hai tình huống, công cụ AI — cộng phần ★ và tấm bản đồ khép lại cả môn.'),

    walk('nwc204-ch16', [
      [12, '16.4 Verify connectivity — the ladder, one rung at a time',
        `<p>Chapter 12 built this ladder out of ICMP. This chapter uses it as the opening move of a method.</p>
<ol>
<li><code>ping 127.0.0.1</code> — is my own TCP/IP stack alive?</li>
<li><code>ping</code> my own address — is my interface configured and up?</li>
<li><code>ping</code> the default gateway — can I reach anything on my own LAN?</li>
<li><code>ping 8.8.8.8</code> — does routing off-site work, with DNS taken out of the picture?</li>
<li><code>ping example.com</code> — and only now, does name resolution work?</li>
</ol>
<p><strong>Rungs 4 and 5 are the pair that repays the effort.</strong> If the address answers and the name does not, the network is fine and DNS is broken. Those two rungs are one step apart and lead to completely different repairs — one is a routing or filtering problem, the other is a resolver configuration.</p>
<p><strong>And the answer to this lesson's opening question is rung 5 in human form:</strong> ask "can you reach anything at all, or just that one site?" Anything else — cable, restart, "try again" — tests one possibility. That question splits the entire space in half.</p>`,
        `<p>Chương 12 đã dựng cái thang này bằng ICMP. Chương này dùng nó làm nước đi mở đầu của một phương pháp.</p>
<ol>
<li><code>ping 127.0.0.1</code> — ngăn xếp TCP/IP của chính tôi còn sống không?</li>
<li><code>ping</code> địa chỉ của chính mình — cổng mạng của tôi đã cấu hình và đã lên chưa?</li>
<li><code>ping</code> cổng mặc định — tôi có với tới được cái gì trong LAN của mình không?</li>
<li><code>ping 8.8.8.8</code> — định tuyến ra ngoài có chạy không, khi đã gạt DNS sang một bên?</li>
<li><code>ping example.com</code> — và tới giờ mới hỏi: phân giải tên có chạy không?</li>
</ol>
<p><strong>Bậc 4 và bậc 5 là cặp đáng công nhất.</strong> Nếu địa chỉ đáp mà cái tên thì không, thì mạng vẫn tốt và DNS mới là cái hỏng. Hai bậc ấy cách nhau đúng một nấc mà dẫn tới hai cách sửa hoàn toàn khác nhau — một bên là chuyện định tuyến hoặc lọc, bên kia là chuyện cấu hình bộ phân giải.</p>
<p><strong>Và đáp án cho câu hỏi mở đầu của bài này chính là bậc 5 nói bằng tiếng người:</strong> hãy hỏi "bạn không vào được cái gì hết, hay chỉ không vào được đúng trang đó?" Mọi câu khác — dây mạng, khởi động lại, "thử lại xem" — chỉ thử đúng một khả năng. Câu đó chẻ đôi toàn bộ không gian khả năng.</p>`],

      [13, '16.5 Host commands you will actually type',
        `<p>The same six questions, on two families of operating system. Knowing the pairs matters because the user in front of you is rarely on the system you prefer.</p>
<ul>
<li><strong>What is my address?</strong> <code>ipconfig /all</code> · <code>ip addr</code></li>
<li><strong>Where do packets go?</strong> <code>route print</code> · <code>ip route</code></li>
<li><strong>Can I reach it?</strong> <code>ping</code> on both</li>
<li><strong>Which path?</strong> <code>tracert</code> · <code>traceroute</code> or <code>mtr</code></li>
<li><strong>What is listening?</strong> <code>netstat -ano</code> · <code>ss -tlnp</code></li>
<li><strong>Who resolves the name?</strong> <code>nslookup</code> · <code>dig</code></li>
</ul>
<p><strong>The fifth line is the one that separates two questions people merge.</strong> "The machine is reachable" and "the service is there" are different claims, and Chapter 13 explained why: ping never touches layer 4, so a host can answer every ping perfectly and still have nothing listening on the port you need. When a ping succeeds and the application still fails, that line is the next command, not a restart.</p>`,
        `<p>Vẫn sáu câu hỏi ấy, trên hai họ hệ điều hành. Biết cả cặp là quan trọng, vì người dùng ngồi trước mặt bạn hiếm khi dùng đúng cái hệ bạn thích.</p>
<ul>
<li><strong>Địa chỉ của tôi là gì?</strong> <code>ipconfig /all</code> · <code>ip addr</code></li>
<li><strong>Gói tin đi đâu?</strong> <code>route print</code> · <code>ip route</code></li>
<li><strong>Tôi tới được nó không?</strong> <code>ping</code>, cả hai bên</li>
<li><strong>Đi đường nào?</strong> <code>tracert</code> · <code>traceroute</code> hoặc <code>mtr</code></li>
<li><strong>Cái gì đang nghe?</strong> <code>netstat -ano</code> · <code>ss -tlnp</code></li>
<li><strong>Ai phân giải cái tên?</strong> <code>nslookup</code> · <code>dig</code></li>
</ul>
<p><strong>Dòng thứ năm là dòng tách được hai câu hỏi mà người ta hay gộp làm một.</strong> "Cái máy tới được" và "dịch vụ có ở đó" là hai lời khẳng định khác nhau, và Chương 13 đã giải thích vì sao: ping không bao giờ đụng tới tầng 4, nên một cái máy có thể đáp mọi cú ping hoàn hảo mà vẫn chẳng có gì nghe ở cái cổng bạn cần. Khi ping thông mà ứng dụng vẫn hỏng thì dòng đó là câu lệnh kế tiếp, chứ không phải một lần khởi động lại.</p>`],

      [14, '16.5 IOS commands — what is up, before what is configured',
        `<p><code>show ip interface brief</code> is the first command on any Cisco device, and the reason is that it answers two layers in two adjacent columns.</p>
<ul>
<li><strong>Status</strong> is layer 1: is there a signal on the wire?</li>
<li><strong>Protocol</strong> is layer 2: is the link usable once the signal is there?</li>
</ul>
<p><strong>The pair is the diagnosis, and reading them as one word throws away half the information.</strong></p>
<ul>
<li><strong>up / up</strong> — healthy. Move up the stack.</li>
<li><strong>up / down</strong> — the cable carries a signal but layer 2 cannot agree. Encapsulation mismatch, missing clock rate on a serial link, no keepalive from the far end.</li>
<li><strong>down / down</strong> — no signal. Cable, port, or the device at the other end is off.</li>
<li><strong>administratively down / down</strong> — nobody typed <code>no shutdown</code>. Not a fault at all.</li>
</ul>
<p>That last one matters on every fresh configuration: Cisco interfaces ship disabled, so a brand-new link that has never worked once is far more likely to be a missing command than a bad cable.</p>`,
        `<p><code>show ip interface brief</code> là lệnh đầu tiên trên mọi thiết bị Cisco, và lý do là nó trả lời hai tầng bằng hai cột nằm cạnh nhau.</p>
<ul>
<li><strong>Status</strong> là tầng 1: trên sợi dây có tín hiệu không?</li>
<li><strong>Protocol</strong> là tầng 2: khi đã có tín hiệu rồi thì đường liên kết có dùng được không?</li>
</ul>
<p><strong>Cặp hai cột ấy chính là chẩn đoán, và đọc chúng thành một chữ là vứt đi một nửa thông tin.</strong></p>
<ul>
<li><strong>up / up</strong> — khoẻ. Đi lên tầng trên.</li>
<li><strong>up / down</strong> — sợi cáp có tín hiệu nhưng tầng 2 không thoả thuận được. Sai kiểu đóng gói, thiếu clock rate trên đường serial, đầu kia không gửi keepalive.</li>
<li><strong>down / down</strong> — không có tín hiệu. Cáp, cổng, hoặc thiết bị đầu kia đang tắt.</li>
<li><strong>administratively down / down</strong> — không ai gõ <code>no shutdown</code>. Hoàn toàn không phải một cái hỏng.</li>
</ul>
<p>Cái cuối cùng quan trọng với mọi cấu hình mới: cổng của Cisco xuất xưởng ở trạng thái tắt, nên một đường liên kết vừa dựng mà chưa từng chạy lần nào thì khả năng thiếu một câu lệnh cao hơn nhiều so với khả năng hỏng cáp.</p>`],

      [15, '16.5 IOS — neighbours, versions, and saving the work',
        `<p>Six commands cover almost every "what is actually going on here" question on a Cisco device.</p>
<ul>
<li><code>show cdp neighbors detail</code> — who is on the other end of each cable, and on which port. This is how you rebuild a physical topology diagram you were never given.</li>
<li><code>show ip route</code> — what this router believes about the world.</li>
<li><code>show version</code> — image, uptime, configuration register.</li>
<li><code>show running-config</code> — what is active right now, in RAM.</li>
<li><code>show startup-config</code> — what will come back after a reload.</li>
<li><code>copy running-config startup-config</code> — the step everyone forgets.</li>
</ul>
<p><strong>The last three are one lesson.</strong> Running and startup are two different files, and only one of them survives a power cut. A change that works perfectly and is never copied looks like a hardware fault the next morning: the device came back and undid your work.</p>
<p>★ And then verify with <code>show startup-config</code>, not by remembering that you typed the copy command. That is the same habit as Chapter 15's <code>sshd -T</code>: check the effective state, never the file you just wrote.</p>`,
        `<p>Sáu câu lệnh phủ gần hết mọi câu hỏi "ở đây đang thật sự diễn ra cái gì" trên một thiết bị Cisco.</p>
<ul>
<li><code>show cdp neighbors detail</code> — ai nằm ở đầu kia mỗi sợi cáp, và ở cổng nào. Đây là cách bạn dựng lại một sơ đồ vật lý mà chưa ai đưa cho bạn.</li>
<li><code>show ip route</code> — con router này đang tin gì về thế giới.</li>
<li><code>show version</code> — bản image, thời gian chạy, thanh ghi cấu hình.</li>
<li><code>show running-config</code> — thứ đang hiệu lực ngay lúc này, trong RAM.</li>
<li><code>show startup-config</code> — thứ sẽ quay lại sau một lần khởi động.</li>
<li><code>copy running-config startup-config</code> — bước mà ai cũng quên.</li>
</ul>
<p><strong>Ba dòng cuối là chung một bài học.</strong> running và startup là hai file khác nhau, và chỉ một trong hai sống sót qua một lần mất điện. Một thay đổi chạy hoàn hảo mà không được chép lại thì sáng hôm sau trông y hệt một cú hỏng phần cứng: thiết bị quay lại và xoá sạch việc bạn làm.</p>
<p>★ Và hãy nghiệm thu bằng <code>show startup-config</code>, đừng nghiệm thu bằng việc nhớ rằng mình đã gõ lệnh copy. Đó đúng là thói quen của <code>sshd -T</code> ở Chương 15: kiểm trạng thái đang hiệu lực, không bao giờ kiểm cái file mình vừa ghi.</p>`],

      [16, '16.6 Three troubleshooting methods',
        `<p>All three methods walk the same stack and test one layer at a time. The only difference is <strong>where you start</strong>.</p>
<ul>
<li><strong>Bottom-up</strong> — begin at layer 1 and climb: cable, link, IP, port, application.</li>
<li><strong>Top-down</strong> — begin at layer 7 and descend: application, port, IP, link, cable.</li>
<li><strong>Divide-and-conquer</strong> — begin in the middle, usually layer 3: ping the gateway, and let the result send you up or down.</li>
</ul>
<p><strong>Choosing one is a bet about where the fault is.</strong> A wrong bet costs a little time; having no method at all costs far more, because without one you test whatever comes to mind, and you test some things twice.</p>
<p><strong>The rule that makes any of them work: prove a layer, write it down, and do not go back.</strong> Most of the wasted time in real incidents is spent re-testing something that was already proven fine — usually because three people each proved it separately and nobody said so out loud.</p>`,
        `<p>Cả ba phương pháp đều đi dọc cùng một chồng tầng và kiểm từng tầng một. Khác biệt duy nhất là <strong>bạn bắt đầu từ đâu</strong>.</p>
<ul>
<li><strong>Từ dưới lên (bottom-up)</strong> — bắt đầu ở tầng 1 rồi trèo lên: cáp, liên kết, IP, cổng, ứng dụng.</li>
<li><strong>Từ trên xuống (top-down)</strong> — bắt đầu ở tầng 7 rồi đi xuống: ứng dụng, cổng, IP, liên kết, cáp.</li>
<li><strong>Chia đôi (divide-and-conquer)</strong> — bắt đầu ở giữa, thường là tầng 3: ping cổng mặc định, rồi để kết quả đẩy bạn lên hay xuống.</li>
</ul>
<p><strong>Chọn một cái là đặt cược về chỗ cái hỏng đang nằm.</strong> Cược sai thì mất một ít thời gian; không có phương pháp nào thì mất nhiều hơn hẳn, vì không có phương pháp thì bạn thử bất cứ thứ gì nảy ra trong đầu, và có thứ bạn thử tới hai lần.</p>
<p><strong>Luật làm cho cả ba cái đều chạy được: chứng minh xong một tầng thì ghi lại, và không quay lại nữa.</strong> Phần lớn thời gian bị phí trong các sự cố thật là thời gian thử lại một thứ đã được chứng minh là ổn — thường vì ba người mỗi người tự chứng minh riêng mà không ai nói ra thành lời.</p>`],

      [17, '16.6 Choosing a method, and what each one assumes',
        `<p>Each method is fastest in one situation and slowest in another, and the pattern is easy to remember.</p>
<ul>
<li><strong>Bottom-up</strong> — best when a whole site is down or the cabling is new. Wasteful when everything is plainly up and one application is broken.</li>
<li><strong>Top-down</strong> — best when one application fails while everything else on the same machine works. Wasteful when the cable is out and you spend twenty minutes reading application logs.</li>
<li><strong>Divide-and-conquer</strong> — best when you have a strong, informed hunch. Worst when the hunch is wrong, because then you have to search in both directions.</li>
</ul>
<p><strong>Divide-and-conquer is the fastest when it is right and the slowest when it is wrong.</strong> That is why experience changes which method is correct for the same fault: a hunch is only worth acting on if it comes from having seen this failure before.</p>
<p>Bottom-up is the safe default precisely because it assumes nothing. If you have no information at all, start at the bottom — it is never the fastest route, and it is never a dead end either.</p>`,
        `<p>Mỗi phương pháp nhanh nhất trong một tình huống và chậm nhất trong một tình huống khác, và quy luật thì dễ nhớ.</p>
<ul>
<li><strong>Từ dưới lên</strong> — tốt nhất khi cả một cơ sở cùng chết, hoặc khi hệ thống cáp còn mới. Phí công khi mọi thứ rõ ràng đang lên mà chỉ một ứng dụng hỏng.</li>
<li><strong>Từ trên xuống</strong> — tốt nhất khi một ứng dụng hỏng trong lúc mọi thứ khác trên cùng cái máy vẫn chạy. Phí công khi sợi cáp tuột mà bạn ngồi đọc log ứng dụng hai mươi phút.</li>
<li><strong>Chia đôi</strong> — tốt nhất khi bạn có một linh cảm mạnh và có cơ sở. Tệ nhất khi linh cảm đó sai, vì lúc ấy bạn phải đi tìm theo cả hai hướng.</li>
</ul>
<p><strong>Chia đôi là cái nhanh nhất khi nó đúng và chậm nhất khi nó sai.</strong> Đó là lý do kinh nghiệm làm thay đổi việc phương pháp nào là đúng cho cùng một cái hỏng: một linh cảm chỉ đáng hành động theo nếu nó đến từ việc đã từng gặp đúng cú hỏng đó.</p>
<p>Từ dưới lên là lựa chọn mặc định an toàn chính vì nó không giả định gì cả. Nếu bạn hoàn toàn không có thông tin nào thì hãy bắt đầu từ đáy — nó không bao giờ là đường nhanh nhất, mà cũng không bao giờ là ngõ cụt.</p>`],

      [18, '★ This course has been bottom-up the whole time',
        `<p>★ Section 16.6 gives a name to something you have already been doing for fifteen chapters.</p>
<ul>
<li><strong>Chapter 12, the ping ladder</strong> — loopback, own address, gateway, remote address, then the name. That is bottom-up, rung by rung.</li>
<li><strong>Chapter 13, refused versus timeout</strong> — establish first that the packet reached the machine, and only then ask what was listening. Layer 3 proven before layer 4 is questioned.</li>
<li><strong>Chapter 13, the five-step sequence</strong> — is anything listening, on which address, refused or timeout, reachable locally, and only then the firewall.</li>
<li><strong>Chapter 15, hardening</strong> — the device first, then the service, then the filter at the edge.</li>
</ul>
<p><strong>Being able to name the method matters more than it sounds.</strong> Once you can say "I am going bottom-up and rungs 1 to 3 are proven", you can hand the problem to somebody else without them starting over. That sentence is the difference between one investigation and three overlapping ones.</p>`,
        `<p>★ Mục 16.6 chỉ đang đặt tên cho một thứ bạn đã làm suốt mười lăm chương.</p>
<ul>
<li><strong>Chương 12, cái thang ping</strong> — loopback, địa chỉ của chính mình, cổng mặc định, địa chỉ từ xa, rồi mới tới cái tên. Đó là từ dưới lên, từng bậc một.</li>
<li><strong>Chương 13, "từ chối" so với "hết giờ"</strong> — xác lập trước đã rằng gói tin tới được máy, rồi mới hỏi cái gì đang nghe. Tầng 3 được chứng minh trước khi đụng tới tầng 4.</li>
<li><strong>Chương 13, trình tự năm bước</strong> — có gì đang nghe không, nghe ở địa chỉ nào, bị từ chối hay hết giờ, từ chính máy đó có tới được không, và chỉ tới lúc ấy mới xem tường lửa.</li>
<li><strong>Chương 15, làm cứng</strong> — thiết bị trước, rồi dịch vụ, rồi mới tới bộ lọc ở biên.</li>
</ul>
<p><strong>Gọi tên được phương pháp quan trọng hơn nghe tưởng.</strong> Một khi bạn nói được "tôi đang đi từ dưới lên và bậc 1 tới 3 đã chứng minh xong", bạn bàn giao được vấn đề cho người khác mà họ không phải làm lại từ đầu. Đúng một câu nói ấy là khác biệt giữa một cuộc điều tra và ba cuộc điều tra chồng lên nhau.</p>`],

      [19, '16.7 Scenario — the interface that is up but not up',
        `<p><strong>Symptom.</strong> A newly cabled link does not pass traffic. Somebody has already checked the cable twice and reports that "the port is up, so it must be the server".</p>
<p><strong>What the device says.</strong> <code>show ip interface brief</code> gives <code>up / down</code> on that interface, and <code>show interfaces</code> adds "line protocol is down", zero packets input, keepalive set.</p>
<p><strong>What that means.</strong> Status up is real: there is a signal, so the cable and both physical ports are fine. Protocol down is also real: nothing usable comes back over that signal. The fault is at layer 2, and the usual causes are an encapsulation mismatch, a missing clock rate on a serial link, or a neighbour that is administratively down.</p>
<p><strong>The conclusion that saves the time.</strong> The evidence points at the <em>other</em> device, not this one. "Up so it must be the server" was half right and drew exactly the wrong next step: the next command is on the neighbour, and <code>show cdp neighbors detail</code> will say which neighbour that is even if nobody documented the cabling.</p>`,
        `<p><strong>Triệu chứng.</strong> Một đường liên kết vừa đi dây xong nhưng không cho lưu lượng chạy qua. Có người đã kiểm sợi cáp hai lần và báo rằng "cổng đang up, nên chắc là do máy chủ".</p>
<p><strong>Thiết bị nói gì.</strong> <code>show ip interface brief</code> cho <code>up / down</code> ở cổng đó, còn <code>show interfaces</code> thêm dòng "line protocol is down", số gói vào bằng 0, keepalive đang bật.</p>
<p><strong>Điều đó nghĩa là gì.</strong> Status up là thật: có tín hiệu, nên sợi cáp và cả hai cổng vật lý đều ổn. Protocol down cũng là thật: không có gì dùng được quay về trên cái tín hiệu ấy. Lỗi nằm ở tầng 2, và nguyên nhân thường gặp là sai kiểu đóng gói, thiếu clock rate trên đường serial, hoặc thiết bị đầu kia đang bị tắt bằng lệnh.</p>
<p><strong>Kết luận tiết kiệm được thời gian.</strong> Bằng chứng chỉ vào thiết bị <em>đầu kia</em>, không phải thiết bị này. Câu "up rồi nên chắc do máy chủ" đúng một nửa và kéo người ta tới đúng bước kế tiếp sai: lệnh tiếp theo phải gõ ở thiết bị hàng xóm, và <code>show cdp neighbors detail</code> sẽ nói cho bạn hàng xóm đó là ai, kể cả khi chẳng ai ghi lại sơ đồ đi dây.</p>`],

      [20, '16.7 Scenario — right cable, wrong gateway',
        `<p><strong>Symptom.</strong> One laptop cannot reach anything outside the office. Everyone else is fine.</p>
<p><strong>Working the ladder.</strong> <code>ping 127.0.0.1</code> works and <code>ping 192.168.10.25</code> — its own address — works, so the stack and the interface are proven. <code>ping 192.168.10.1</code>, the gateway, fails.</p>
<p><strong>The cause.</strong> <code>ipconfig /all</code> shows a default gateway of <code>192.168.11.1</code>. One digit wrong, and it names a subnet that does not exist here, so the host has no usable route off its own network.</p>
<p><strong>The part that turns a fix into a repair.</strong> Everyone else works, so DHCP is handing out the correct gateway — which means this host was configured by hand at some point. Correcting the address fixes today. <strong>Asking why this one host is static fixes the next three incidents</strong>, because manual exceptions are where small networks rot: somebody set it during an outage two years ago, nobody wrote it down, and it has been quietly wrong ever since.</p>
<p>The better repair is usually to return the host to DHCP, so that the same mistake cannot be made again by hand.</p>`,
        `<p><strong>Triệu chứng.</strong> Một cái laptop không với tới được gì ngoài văn phòng. Mọi người khác vẫn bình thường.</p>
<p><strong>Đi theo cái thang.</strong> <code>ping 127.0.0.1</code> thông và <code>ping 192.168.10.25</code> — địa chỉ của chính nó — cũng thông, nên ngăn xếp và cổng mạng đã được chứng minh. <code>ping 192.168.10.1</code>, tức cổng mặc định, thì hỏng.</p>
<p><strong>Nguyên nhân.</strong> <code>ipconfig /all</code> cho thấy cổng mặc định là <code>192.168.11.1</code>. Sai đúng một chữ số, và nó trỏ vào một subnet không tồn tại ở đây, nên cái máy này không có tuyến nào dùng được để ra khỏi mạng của chính nó.</p>
<p><strong>Phần biến một cú vá thành một cú sửa.</strong> Mọi người khác đều chạy, nghĩa là DHCP đang cấp đúng cổng mặc định — nghĩa là cái máy này đã bị ai đó đặt tay vào một lúc nào đó. Sửa lại địa chỉ thì xong hôm nay. <strong>Hỏi cho ra vì sao đúng cái máy này lại để tĩnh thì xong luôn ba sự cố kế tiếp</strong>, bởi vì những ngoại lệ đặt tay chính là chỗ một mạng nhỏ mục ruỗng: ai đó đã đặt nó trong một lần sự cố hai năm trước, không ai ghi lại, và nó đã sai lặng lẽ từ bấy tới giờ.</p>
<p>Cú sửa tốt hơn thường là trả cái máy đó về DHCP, để đúng cái lỗi ấy không thể bị gõ lại bằng tay lần nữa.</p>`],

      [21, '★ Scenario — a service that answers, and one that is not there',
        `<p>★ A scenario in the shape you will actually meet if you run a server rather than a lab.</p>
<p><strong>Symptom.</strong> A feature stops working after a deployment. The site loads, other pages are fine, and the browser shows a generic error.</p>
<p><strong>Ask the server, not the browser.</strong> An unauthenticated request to the route, reading only the status code, distinguishes three completely different situations:</p>
<ul>
<li><strong>200</strong> — the route exists and is public. Working.</li>
<li><strong>401</strong> — the route exists and wants credentials. <strong>Also good news:</strong> it proves the whole path works and the code is mounted.</li>
<li><strong>404</strong> — nothing is mounted at that path. For a route you know you wrote, that means the running build is not the build you think it is.</li>
<li><strong>No answer at all</strong> — something filtered it, and you have learned nothing about the service. Go back to the ladder.</li>
</ul>
<p><strong>404 and 401 look equally like failure in a browser and mean opposite things.</strong> This is top-down troubleshooting: start at layer 7, and let the status code tell you whether you need to go any lower. It is the right method here precisely because one thing is broken while everything else on the same host answers.</p>`,
        `<p>★ Một tình huống theo đúng hình dạng bạn sẽ gặp thật, nếu bạn vận hành một máy chủ chứ không phải một phòng lab.</p>
<p><strong>Triệu chứng.</strong> Một tính năng ngừng chạy sau một lần deploy. Trang vẫn tải, các trang khác vẫn ổn, trình duyệt hiện một lỗi chung chung.</p>
<p><strong>Hãy hỏi máy chủ, đừng hỏi trình duyệt.</strong> Một yêu cầu không kèm đăng nhập tới đúng tuyến đó, chỉ đọc mã trạng thái, phân biệt được ba tình huống khác hẳn nhau:</p>
<ul>
<li><strong>200</strong> — tuyến có tồn tại và là công khai. Đang chạy.</li>
<li><strong>401</strong> — tuyến có tồn tại và đòi đăng nhập. <strong>Cũng là tin tốt:</strong> nó chứng minh cả đường đi đều thông và mã đã được nạp.</li>
<li><strong>404</strong> — không có gì nạp ở đường dẫn đó. Với một tuyến mà bạn biết chắc mình đã viết, điều đó nghĩa là bản đang chạy không phải bản bạn tưởng.</li>
<li><strong>Không có câu trả lời nào</strong> — có thứ gì đó đã lọc nó, và bạn chưa học được gì về dịch vụ cả. Quay lại cái thang.</li>
</ul>
<p><strong>404 và 401 nhìn trong trình duyệt thì giống hệt nhau — đều là hỏng — mà ý nghĩa thì ngược nhau.</strong> Đây là gỡ lỗi từ trên xuống: bắt đầu ở tầng 7, rồi để mã trạng thái nói cho bạn biết có cần đi xuống thấp hơn không. Đó là phương pháp đúng ở đây chính vì chỉ một thứ hỏng trong khi mọi thứ khác trên cùng cái máy vẫn đáp.</p>`],

      [22, '16.8 AI tools — the question shape that works',
        `<p>Section 16.8 is the self-learning item, and CLO9 is measured on it. The useful distinction is not between good and bad tools but between two shapes of question.</p>
<p><strong>Questions a model answers well</strong> — the ones about text you can show it:</p>
<ul>
<li>"Explain the difference between up/down and administratively down."</li>
<li>"Review this running-config and list any ACL lines that can never be reached."</li>
<li>"Draft a checklist for a bottom-up walk of a small LAN."</li>
</ul>
<p><strong>Questions it answers badly</strong> — the ones about state it cannot see: "my network is down, fix it". It has not seen your cabling, your addresses, your interface states or your firewall.</p>
<p><strong>The pattern has held for the whole course.</strong> A model reasons well about a config, an output or a rule chain, because those are properties of the text itself. It cannot observe your machine. Paste the evidence and you gain a second pair of eyes; withhold it and you get confident guessing, which is worse than no answer because it sounds the same as a right one.</p>
<p>The rule, unchanged since Chapter 1: <strong>a model proposes, a command decides.</strong></p>`,
        `<p>Mục 16.8 là phần tự học, và CLO9 được chấm trên đó. Chỗ phân biệt hữu ích không phải giữa công cụ tốt và công cụ tệ, mà giữa hai <em>hình dạng</em> câu hỏi.</p>
<p><strong>Câu hỏi mà mô hình trả lời tốt</strong> — những câu về văn bản mà bạn đưa cho nó xem được:</p>
<ul>
<li>"Giải thích khác biệt giữa up/down và administratively down."</li>
<li>"Đọc cái running-config này và liệt kê những dòng ACL không bao giờ tới lượt."</li>
<li>"Soạn cho tôi một bảng kiểm để đi từ dưới lên trên một LAN nhỏ."</li>
</ul>
<p><strong>Câu hỏi nó trả lời tệ</strong> — những câu về trạng thái nó không nhìn thấy: "mạng nhà tôi chết rồi, sửa đi". Nó chưa từng thấy hệ thống cáp, địa chỉ, trạng thái cổng hay tường lửa của bạn.</p>
<p><strong>Quy luật này đã đúng suốt cả môn.</strong> Một mô hình lập luận tốt về một file cấu hình, một kết xuất, một chuỗi luật, vì đó đều là tính chất của chính đoạn văn bản. Nó không quan sát được cái máy của bạn. Dán bằng chứng vào thì bạn có thêm một cặp mắt; giấu bằng chứng đi thì bạn nhận được sự đoán mò đầy tự tin, mà thứ đó còn tệ hơn không có câu trả lời, vì nghe nó giống hệt một câu trả lời đúng.</p>
<p>Luật không đổi từ Chương 1: <strong>mô hình đề xuất, câu lệnh mới quyết định.</strong></p>`],

      [23, 'The question table is at its most scrambled here',
        `<p>This chapter is where the drift in the school's constructive-question table is easiest to see, because it runs in both directions at once.</p>
<ul>
<li><strong>Session 54 → CQ18.3</strong> — the component protecting communications to and from a computer. That is the <strong>firewall</strong>, Chapter 15, answered in Lesson 15.2.</li>
<li><strong>Session 55 → CQ19.1</strong> — the threat that stops authorized users reaching resources. That is <strong>denial of service</strong>, Chapter 15.</li>
<li><strong>Session 57 → CQ19.2</strong> — identifying physical and logical topologies. That is <strong>16.3</strong>, taught in session 54. Session 57 is a project session.</li>
<li><strong>Session 58 → CQ20.1</strong> — one router to the ISP fails. That is <strong>16.3 redundancy</strong>. Session 58 is revision.</li>
<li><strong>Session 59 → CQ20.2</strong> — minimise latency for real-time streams. That is <strong>16.2 QoS</strong>. Session 59 is revision.</li>
</ul>
<p><strong>Both questions printed against this chapter belong to the previous one, and all three questions that belong here are printed against a project session and two revision sessions.</strong> The table is quoted exactly as published and is not corrected. Answer by topic, never by the session number printed beside the question.</p>`,
        `<p>Chương này là chỗ dễ thấy nhất độ trôi của bảng câu hỏi kiến tạo, vì ở đây nó trôi theo cả hai chiều cùng lúc.</p>
<ul>
<li><strong>Buổi 54 → CQ18.3</strong> — thành phần bảo vệ giao tiếp vào và ra khỏi một máy tính. Đó là <strong>tường lửa</strong>, Chương 15, đã trả lời ở bài 15.2.</li>
<li><strong>Buổi 55 → CQ19.1</strong> — mối đe doạ ngăn người dùng hợp lệ truy cập tài nguyên. Đó là <strong>từ chối dịch vụ</strong>, Chương 15.</li>
<li><strong>Buổi 57 → CQ19.2</strong> — xác định sơ đồ vật lý và sơ đồ luận lý. Đó là <strong>16.3</strong>, dạy ở buổi 54. Mà buổi 57 là buổi đồ án.</li>
<li><strong>Buổi 58 → CQ20.1</strong> — một router ra ISP bị hỏng. Đó là <strong>16.3 dự phòng</strong>. Mà buổi 58 là buổi ôn tập.</li>
<li><strong>Buổi 59 → CQ20.2</strong> — giảm độ trễ cho luồng thời gian thực. Đó là <strong>16.2 QoS</strong>. Mà buổi 59 cũng là buổi ôn tập.</li>
</ul>
<p><strong>Cả hai câu in vào chương này đều thuộc chương trước, còn cả ba câu thuộc về chương này thì bị in vào một buổi đồ án và hai buổi ôn tập.</strong> Bảng gốc được trích nguyên văn và không bị sửa. Hãy trả lời theo chủ đề, tuyệt đối đừng theo số buổi in bên cạnh câu hỏi.</p>`],

      [24, '★ Sixteen chapters, one path from layer 1 to layer 7',
        `<p>★ This is the map the course has been drawing one piece at a time.</p>
<ul>
<li><strong>L1 Physical</strong> — Chapter 4 (media, signals, bandwidth) and Chapter 4B, the added chapter on binary and hexadecimal that the school schedules no session for.</li>
<li><strong>L2 Data link</strong> — Chapter 5 (framing and MAC addresses) and Chapter 6 (Ethernet switching and the MAC address table).</li>
<li><strong>L3 Network</strong> — Chapter 7 routing, Chapter 8 ARP, Chapter 9 router configuration, Chapter 10 IPv4, Chapter 11 IPv6, Chapter 12 ICMP.</li>
<li><strong>L4 Transport</strong> — Chapter 13: ports, sockets, the handshake, UDP, flow control.</li>
<li><strong>L7 Application</strong> — Chapter 14: HTTP, DNS, DHCP, email, peer-to-peer.</li>
<li><strong>Across all of it</strong> — Chapter 1 networking today, Chapter 2 device configuration, Chapter 3 the models themselves, Chapter 15 security, and Chapter 16 assembly.</li>
</ul>
<p><strong>Design reads this table downwards; troubleshooting reads it upwards.</strong> Same table, two directions — which is exactly what section 16.6 has just given names to. That symmetry is the single most useful thing this course has to hand over.</p>`,
        `<p>★ Đây là tấm bản đồ mà cả môn học đã vẽ dần từng mảnh.</p>
<ul>
<li><strong>Tầng 1 Vật lý</strong> — Chương 4 (môi trường, tín hiệu, băng thông) và Chương 4B, chương bổ sung về nhị phân và thập lục phân mà trường không xếp buổi nào.</li>
<li><strong>Tầng 2 Liên kết dữ liệu</strong> — Chương 5 (đóng khung và địa chỉ MAC) và Chương 6 (chuyển mạch Ethernet và bảng địa chỉ MAC).</li>
<li><strong>Tầng 3 Mạng</strong> — Chương 7 định tuyến, Chương 8 ARP, Chương 9 cấu hình router, Chương 10 IPv4, Chương 11 IPv6, Chương 12 ICMP.</li>
<li><strong>Tầng 4 Giao vận</strong> — Chương 13: cổng, socket, bắt tay, UDP, kiểm soát luồng.</li>
<li><strong>Tầng 7 Ứng dụng</strong> — Chương 14: HTTP, DNS, DHCP, thư điện tử, ngang hàng.</li>
<li><strong>Cắt ngang tất cả</strong> — Chương 1 mạng hôm nay, Chương 2 cấu hình thiết bị, Chương 3 chính các mô hình, Chương 15 an ninh, và Chương 16 ghép lại.</li>
</ul>
<p><strong>Thiết kế thì đọc bảng này từ trên xuống; gỡ lỗi thì đọc từ dưới lên.</strong> Cùng một cái bảng, hai chiều đọc — mà đó đúng là thứ mục 16.6 vừa đặt tên cho. Chính cái đối xứng ấy là thứ hữu ích nhất mà môn học này bàn giao lại cho bạn.</p>`],

      [25, 'What you can do now — and what is left of the course',
        `<p>If the chapter worked, all of this is now a habit rather than a lookup.</p>
<ul>
<li>Design a small network, choosing devices by cost, ports and speed, expandability and OS features.</li>
<li>Plan addressing, decide what is static, and state where redundancy exists and where it deliberately does not.</li>
<li>Name the protocol behind each service, and say which one cannot tolerate waiting.</li>
<li>Argue for QoS as prioritisation rather than as extra bandwidth.</li>
<li>Verify with the ping ladder, then host commands, then <code>show ip interface brief</code>.</li>
<li>Choose bottom-up, top-down or divide-and-conquer, and say what each assumes.</li>
<li>★ Apply all of it to the small network you already run on a server.</li>
</ul>
<p><strong>What is left of the syllabus:</strong> sessions 56 and 57 are the group project, and 53, 58, 59 and 60 are revision. <strong>There is no Chapter 17.</strong> What remains is to take the design you can now defend and build it — in Packet Tracer for the project, and on a real machine for everything after that.</p>`,
        `<p>Nếu chương này có tác dụng thì giờ tất cả những điều dưới đây đã thành thói quen chứ không còn là tra cứu.</p>
<ul>
<li>Thiết kế một mạng nhỏ, chọn thiết bị theo giá, số cổng và tốc độ, khả năng mở rộng, tính năng hệ điều hành.</li>
<li>Hoạch định địa chỉ, chốt cái gì để tĩnh, và nói rõ chỗ nào có dự phòng, chỗ nào cố ý không có.</li>
<li>Gọi tên giao thức đứng sau mỗi dịch vụ, và nói được cái nào không chịu được chờ.</li>
<li>Biện hộ cho QoS như một việc ưu tiên hoá chứ không phải như thêm băng thông.</li>
<li>Kiểm chứng bằng cái thang ping, rồi lệnh máy trạm, rồi <code>show ip interface brief</code>.</li>
<li>Chọn từ dưới lên, từ trên xuống hay chia đôi, và nói được mỗi cái giả định điều gì.</li>
<li>★ Đem tất cả những thứ đó áp vào chính cái mạng nhỏ bạn đang chạy trên một máy chủ.</li>
</ul>
<p><strong>Phần còn lại của syllabus:</strong> buổi 56 và 57 là đồ án nhóm, còn buổi 53, 58, 59 và 60 là ôn tập. <strong>Không có Chương 17.</strong> Việc còn lại là đem cái bản thiết kế mà giờ bạn bảo vệ được ra dựng thật — trong Packet Tracer cho đồ án, và trên một cái máy thật cho mọi thứ sau đó.</p>`],
    ]),

    bi(
      `<h3>Choosing a method, as one picture</h3>
<pre><code class="language-mermaid">flowchart TD
  A["A fault is reported"] --&gt; B{"How much is broken?"}
  B --&gt;|"everything, one whole site"| C["Bottom-up · start at layer 1"]
  B --&gt;|"one app, the rest works"| D["Top-down · start at layer 7"]
  B --&gt;|"a strong informed hunch"| E["Divide-and-conquer · start at layer 3"]
  C --&gt; F["Prove one layer · write it down · never re-test it"]
  D --&gt; F
  E --&gt; F
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef end2 fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14603f
  class B ask
  class A,C,D,E act
  class F end2</code></pre>
<p>Every path ends at the same box, and that box is the part that actually saves time. The choice at the top only decides how quickly you get there.</p>`,
      `<h3>Chọn phương pháp, gói trong một hình</h3>
<pre><code class="language-mermaid">flowchart TD
  A["Có người báo hỏng"] --&gt; B{"Hỏng tới mức nào?"}
  B --&gt;|"tất cả, cả một cơ sở"| C["Từ dưới lên · bắt đầu ở tầng 1"]
  B --&gt;|"một ứng dụng, còn lại chạy"| D["Từ trên xuống · bắt đầu ở tầng 7"]
  B --&gt;|"có linh cảm mạnh, có cơ sở"| E["Chia đôi · bắt đầu ở tầng 3"]
  C --&gt; F["Chứng minh một tầng · ghi lại · không thử lại nữa"]
  D --&gt; F
  E --&gt; F
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef end2 fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14603f
  class B ask
  class A,C,D,E act
  class F end2</code></pre>
<p>Mọi nhánh đều kết thúc ở cùng một ô, và chính cái ô đó mới là thứ tiết kiệm thời gian thật. Lựa chọn ở trên chỉ quyết định bạn tới đó nhanh chậm ra sao.</p>`,
    ),

    bi(
      `<h3>🔍 Cách tự kiểm — walk the ladder on a machine you own, and time it</h3>
<p><strong>1. Walk all five rungs and record which is the first to fail.</strong></p>
<pre><code class="language-bash">ping -c 2 127.0.0.1
ping -c 2 $(ip route | awk '/default/ {print $3}')   # your gateway
ping -c 2 8.8.8.8
ping -c 2 example.com</code></pre>
<p><strong>Reading it.</strong> All four succeed: layers 1 to 3 and DNS are all proven, so any remaining fault is at layer 4 or above. The fourth fails alone: the network is fine and DNS is broken. The second fails: you cannot leave your own LAN, and the next thing to check is the gateway address itself.</p>
<p><strong>2. Prove the layer-4 distinction Chapter 13 taught, without leaving the machine.</strong></p>
<pre><code class="language-bash">nc -vz 127.0.0.1 22      # something is usually listening here
nc -vz 127.0.0.1 9        # nothing listens on 9</code></pre>
<p>The first connects. The second comes back <em>refused, instantly</em> — the machine answered, and nothing was there. Neither of these is a timeout, and that is the point: on loopback there is no firewall to swallow a packet, so you can see what "refused" really means before you meet it on a real network.</p>
<p><strong>3. ★ Ask a route whether it is really live, and read only the number.</strong></p>
<pre><code class="language-bash">curl -s -o /dev/null -w "%{http_code}\\n" https://example.com/</code></pre>
<p class="ghi-chu">Read the number alone: 200 or 401 both prove the path works; 404 means nothing is mounted there; no answer at all means something filtered it and you have learned nothing yet.</p>
<p><strong>What the whole exercise proves.</strong> You can now say which layer a fault is at before touching a single cable, and you can say it from the machine you are already sitting at.</p>`,
      `<h3>🔍 Cách tự kiểm — đi hết cái thang trên một máy của bạn, và bấm giờ</h3>
<p><strong>1. Đi cả năm bậc và ghi lại bậc nào hỏng trước tiên.</strong></p>
<pre><code class="language-bash">ping -c 2 127.0.0.1
ping -c 2 $(ip route | awk '/default/ {print $3}')   # cổng mặc định của bạn
ping -c 2 8.8.8.8
ping -c 2 example.com</code></pre>
<p><strong>Cách đọc.</strong> Cả bốn đều thông: tầng 1 tới 3 và DNS đều đã được chứng minh, nên cái hỏng còn lại nằm ở tầng 4 trở lên. Chỉ cái thứ tư hỏng: mạng vẫn tốt, DNS mới hỏng. Cái thứ hai hỏng: bạn không ra khỏi được LAN của mình, và thứ cần kiểm tiếp là chính địa chỉ cổng mặc định.</p>
<p><strong>2. Chứng minh lại chỗ phân biệt ở tầng 4 mà Chương 13 đã dạy, không cần rời khỏi máy.</strong></p>
<pre><code class="language-bash">nc -vz 127.0.0.1 22      # thường có thứ gì đó đang nghe ở đây
nc -vz 127.0.0.1 9        # không có gì nghe ở cổng 9</code></pre>
<p>Cái đầu nối được. Cái sau trả về <em>từ chối, ngay lập tức</em> — cái máy đã đáp, và không có gì ở đó. Không cái nào là "hết giờ" cả, và đó mới là điểm mấu chốt: trên loopback không có tường lửa nào nuốt gói, nên bạn thấy được "từ chối" thật sự nghĩa là gì trước khi gặp nó trên một mạng thật.</p>
<p><strong>3. ★ Hỏi một tuyến xem nó có thật sự sống không, và chỉ đọc mỗi con số.</strong></p>
<pre><code class="language-bash">curl -s -o /dev/null -w "%{http_code}\\n" https://example.com/</code></pre>
<p class="ghi-chu">Chỉ đọc con số: 200 hay 401 đều chứng minh đường đi thông; 404 nghĩa là không có gì nạp ở đó; hoàn toàn không có câu trả lời nghĩa là có thứ gì đó đã lọc nó và bạn chưa học được gì cả.</p>
<p><strong>Toàn bộ bài tự kiểm chứng minh điều gì.</strong> Giờ bạn nói được cái hỏng nằm ở tầng nào trước khi đụng vào bất kỳ sợi cáp nào, và nói được ngay từ chính cái máy bạn đang ngồi.</p>`,
    ),

    bi(
      `<div class="pitfall co-tieu-de"><strong>Trap 1 — reading Status and Protocol as one word.</strong> <b>Symptom:</b> somebody reports "the port is up" and everyone starts looking at the server, while <code>up / down</code> was already saying the fault is at layer 2 on the neighbouring device. Two columns, two layers, and the pair is the diagnosis.</div>
<div class="pitfall co-tieu-de"><strong>Trap 2 — changing a config and never copying it.</strong> <b>Symptom:</b> the fix works all afternoon and is gone the next morning after a power cut, looking exactly like a hardware fault. running-config is RAM; startup-config is what comes back. Copy, then verify with <code>show startup-config</code>.</div>
<div class="pitfall co-tieu-de"><strong>Trap 3 — no method, so the same test runs three times.</strong> <b>Symptom:</b> an hour into an incident, three people have each pinged the gateway and nobody knows what has already been ruled out. Naming the method and writing down each proven layer is what stops this, not working faster.</div>
<div class="pitfall co-tieu-de"><strong>Trap 4 — treating 404 and a timeout as the same failure.</strong> <b>Symptom:</b> time spent redeploying when the request never arrived, or time spent on firewalls when the route simply was not mounted. 404 means the server answered; a timeout means nothing did. Opposite next steps.</div>
<div class="pitfall co-tieu-de"><strong>Trap 5 — fixing the host instead of the reason.</strong> <b>Symptom:</b> the same laptop breaks again in six months. Correcting one hand-typed gateway fixes today; asking why that host was static at all is what stops the next three incidents. Manual exceptions are where small networks rot.</div>`,
      `<div class="pitfall co-tieu-de"><strong>Bẫy 1 — đọc Status và Protocol thành một chữ.</strong> <b>Triệu chứng:</b> có người báo "cổng đang up" và cả nhóm quay sang soi máy chủ, trong khi <code>up / down</code> đã nói sẵn rằng lỗi nằm ở tầng 2 trên thiết bị hàng xóm. Hai cột, hai tầng, và cặp đôi ấy mới là chẩn đoán.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 2 — sửa cấu hình xong mà không chép lại.</strong> <b>Triệu chứng:</b> cú sửa chạy ngon cả buổi chiều rồi biến mất sáng hôm sau sau một lần mất điện, trông y hệt một cú hỏng phần cứng. running-config nằm trong RAM; startup-config mới là thứ quay lại. Hãy copy, rồi nghiệm thu bằng <code>show startup-config</code>.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 3 — không có phương pháp, nên cùng một phép thử chạy ba lần.</strong> <b>Triệu chứng:</b> một tiếng sau khi sự cố bắt đầu, ba người mỗi người đã tự ping cổng mặc định và không ai biết cái gì đã được loại trừ. Gọi tên phương pháp và ghi lại từng tầng đã chứng minh mới là thứ chặn được chuyện này, chứ không phải làm nhanh hơn.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 4 — coi 404 và "hết giờ" là cùng một cái hỏng.</strong> <b>Triệu chứng:</b> mất thời gian deploy lại trong khi yêu cầu chưa bao giờ tới nơi, hoặc mất thời gian với tường lửa trong khi tuyến đơn giản là chưa được nạp. 404 nghĩa là máy chủ đã đáp; hết giờ nghĩa là chẳng có gì đáp. Hai bước kế tiếp ngược nhau.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 5 — sửa cái máy thay vì sửa cái lý do.</strong> <b>Triệu chứng:</b> đúng cái laptop ấy lại hỏng sau sáu tháng. Sửa một cái cổng mặc định gõ tay thì xong hôm nay; hỏi cho ra vì sao cái máy đó lại để tĩnh mới là thứ chặn được ba sự cố kế tiếp. Những ngoại lệ đặt tay chính là chỗ một mạng nhỏ mục ruỗng.</div>`,
    ),

    bi(
      `<h3>Exercises</h3>
<p><b>E1.</b> A router interface shows <code>up / down</code>. List everything that state has already <em>ruled out</em>, then give the next two commands and say where you would type them.</p>
<div class="dap-an"><p><b>Ruled out by Status = up:</b> the cable itself, both physical ports, and the transceiver. There is a signal on the wire, so layer 1 is proven — which means every minute spent reseating that cable is a minute spent re-testing something already known.</p>
<p><b>What remains:</b> layer 2 only. Encapsulation mismatch between the two ends, a missing clock rate on a serial link, no keepalive coming back, or a neighbour that is administratively down.</p>
<p><b>Next two commands:</b> first <code>show interfaces</code> on this device, to read the error counters and confirm nothing is being received. Then <code>show cdp neighbors detail</code> to find out which device is at the other end and on which port — and the second command you type is on <em>that</em> device, not this one. The evidence points across the cable, not along it.</p></div>
<p><b>E2.</b> One laptop reaches nothing outside the office; everyone else is fine. Which method do you choose, and why is the other two wrong here?</p>
<div class="dap-an"><p><b>Choose divide-and-conquer, starting at layer 3.</b> Ping the default gateway first. One machine broken while every other machine on the same switch works is strong evidence that layer 1 and layer 2 are fine — if the cabling or the switch were at fault, the failure would not be confined to one host.</p>
<p><b>Why not bottom-up:</b> it is not wrong, only slow. You would spend the first ten minutes proving a cable that the surrounding evidence has already proven.</p>
<p><b>Why not top-down:</b> the symptom is "nothing outside the office", which is not one application failing. Top-down suits one app broken while the rest of the machine works; here the whole off-site direction is dead, which is a layer-3 shape.</p>
<p><b>What you expect to find:</b> the gateway ping fails, <code>ipconfig /all</code> shows an address or gateway that does not belong to this subnet, and the host turns out to be statically configured while everyone else is on DHCP.</p></div>
<p><b>E3.</b> ★ Write your own five-step runbook for the small network you actually run, in the order you would execute it, and make step 1 something that costs nothing.</p>
<div class="dap-an"><p>A defensible answer for a single-server container stack, written bottom-up because it assumes nothing:</p>
<ol>
<li><b>Is the machine reachable at all?</b> One ping from outside. Costs nothing, and a failure here means the rest of the list is irrelevant.</li>
<li><b>Is the edge service listening, and on which address?</b> <code>ss -tlnp</code>. Chapter 13: the address matters as much as the port.</li>
<li><b>Does the route answer, and with which number?</b> An unauthenticated request reading only the status code. 401 or 200 prove the path; 404 means the running build is not the one you think; no answer means filtering.</li>
<li><b>Are the internal services up and talking to each other?</b> Container status, then one query straight to the database from inside the network.</li>
<li><b>Only now, logs.</b> Logs explain <em>why</em> something failed; they are a poor way to find out <em>whether</em> it failed, and reading them first is how an hour disappears.</li>
</ol>
<p><b>Why step 1 must be free.</b> A first step that costs nothing gets actually run, every time, including at 2am — and it is the step that most often ends the investigation immediately. The rest of the list only exists because step 1 succeeded.</p>
<p class="ghi-chu">Write it down and keep it where you will find it under pressure. A runbook you remember having written is not a runbook.</p></div>`,
      `<h3>Bài tập</h3>
<p><b>E1.</b> Một cổng router hiện <code>up / down</code>. Hãy liệt kê mọi thứ mà trạng thái đó đã <em>loại trừ</em> giúp bạn, rồi đưa ra hai câu lệnh kế tiếp và nói bạn sẽ gõ chúng ở đâu.</p>
<div class="dap-an"><p><b>Status = up đã loại trừ:</b> chính sợi cáp, cả hai cổng vật lý, và bộ thu phát. Trên dây có tín hiệu, nên tầng 1 đã được chứng minh — nghĩa là mỗi phút bỏ ra cắm đi cắm lại sợi cáp đó là một phút thử lại thứ đã biết rồi.</p>
<p><b>Thứ còn lại:</b> chỉ tầng 2. Sai kiểu đóng gói giữa hai đầu, thiếu clock rate trên đường serial, không có keepalive quay về, hoặc thiết bị hàng xóm đang bị tắt bằng lệnh.</p>
<p><b>Hai lệnh kế tiếp:</b> trước hết <code>show interfaces</code> ngay trên thiết bị này, để đọc các bộ đếm lỗi và xác nhận rằng không nhận được gì. Rồi <code>show cdp neighbors detail</code> để biết thiết bị nào nằm ở đầu kia và ở cổng nào — và câu lệnh thứ hai bạn gõ là trên <em>thiết bị đó</em>, không phải thiết bị này. Bằng chứng chỉ sang bên kia sợi cáp, chứ không chỉ dọc theo nó.</p></div>
<p><b>E2.</b> Một cái laptop không với tới được gì ngoài văn phòng; mọi người khác vẫn ổn. Bạn chọn phương pháp nào, và vì sao hai cái còn lại sai ở đây?</p>
<div class="dap-an"><p><b>Chọn chia đôi, bắt đầu ở tầng 3.</b> Ping cổng mặc định trước. Một cái máy hỏng trong khi mọi máy khác trên cùng con switch đều chạy là bằng chứng mạnh rằng tầng 1 và tầng 2 đều ổn — nếu hệ thống cáp hay con switch có lỗi thì cú hỏng đã không gói gọn trong đúng một máy.</p>
<p><b>Vì sao không dùng từ dưới lên:</b> nó không sai, chỉ chậm. Bạn sẽ tiêu mười phút đầu để chứng minh một sợi cáp mà bối cảnh xung quanh đã chứng minh hộ rồi.</p>
<p><b>Vì sao không dùng từ trên xuống:</b> triệu chứng là "không với tới được gì ngoài văn phòng", mà đó không phải một ứng dụng hỏng. Từ trên xuống hợp với tình huống một ứng dụng hỏng còn phần còn lại của máy vẫn chạy; ở đây cả hướng ra ngoài chết hẳn, và đó là hình dạng của một lỗi tầng 3.</p>
<p><b>Bạn kỳ vọng tìm thấy gì:</b> ping cổng mặc định hỏng, <code>ipconfig /all</code> hiện ra một địa chỉ hoặc một cổng mặc định không thuộc subnet này, và hoá ra cái máy đó được đặt tĩnh trong khi mọi người khác đều dùng DHCP.</p></div>
<p><b>E3.</b> ★ Hãy viết bản quy trình năm bước của riêng bạn cho cái mạng nhỏ bạn đang chạy, theo đúng thứ tự bạn sẽ thực hiện, và làm sao cho bước 1 không tốn gì cả.</p>
<div class="dap-an"><p>Một câu trả lời biện hộ được cho một ngăn xếp container trên một máy chủ đơn, viết theo lối từ dưới lên vì nó không giả định gì:</p>
<ol>
<li><b>Cái máy có tới được không, nói chung?</b> Một cú ping từ ngoài. Không tốn gì, và nếu bước này hỏng thì cả danh sách còn lại là vô nghĩa.</li>
<li><b>Dịch vụ ở biên có đang nghe không, và nghe ở địa chỉ nào?</b> <code>ss -tlnp</code>. Chương 13: địa chỉ quan trọng ngang với cổng.</li>
<li><b>Tuyến có đáp không, và đáp bằng con số nào?</b> Một yêu cầu không kèm đăng nhập, chỉ đọc mã trạng thái. 401 hay 200 đều chứng minh đường đi thông; 404 nghĩa là bản đang chạy không phải bản bạn tưởng; không có câu trả lời nghĩa là đang bị lọc.</li>
<li><b>Các dịch vụ nội bộ có sống và có nói chuyện được với nhau không?</b> Trạng thái container, rồi một truy vấn thẳng vào cơ sở dữ liệu từ bên trong mạng.</li>
<li><b>Tới giờ mới đọc log.</b> Log giải thích <em>vì sao</em> một thứ hỏng; nó là cách tồi để biết một thứ <em>có</em> hỏng hay không, và đọc log trước là cách một tiếng đồng hồ biến mất.</li>
</ol>
<p><b>Vì sao bước 1 phải miễn phí.</b> Một bước đầu tiên không tốn gì thì mới thật sự được chạy, mọi lần, kể cả lúc hai giờ sáng — và nó là bước hay kết thúc cuộc điều tra ngay lập tức nhất. Cả danh sách còn lại chỉ tồn tại vì bước 1 đã thành công.</p>
<p class="ghi-chu">Hãy viết nó ra và để ở chỗ bạn tìm thấy được lúc đang căng. Một quy trình mà bạn chỉ nhớ là mình đã từng viết thì không phải quy trình.</p></div>`,
    ),

    cq(55, [
      ['CQ19.1', 'Which type of network threat is intended to prevent authorized users from accessing resources? <em>— content belongs to Chapter 15; the answer is DENIAL OF SERVICE, answered in full in Lesson 15.1, including why it is the one attack class that succeeds without anyone getting in.</em>',
        'Which type of network threat is intended to prevent authorized users from accessing resources? <em>— nội dung thuộc Chương 15; đáp án là TỪ CHỐI DỊCH VỤ, đã trả lời đầy đủ ở bài 15.1, kể cả lý do vì sao đó là lớp tấn công duy nhất thành công mà không cần ai vào được bên trong.</em>'],
    ]),

    bi(
      `<div class="note-ct"><h3>💬 The three questions that DO belong to this chapter — quoted and answered</h3>
<p>The school files these against sessions 57, 58 and 59 — one project session and two revision sessions — but all three are Chapter 16 content. They are quoted exactly as published; the table is not corrected.</p>
<p><strong>CQ19.2 (printed at session 57)</strong> — <em>"Which element of scaling a network involves identifying the physical and logical topologies?"</em><br>
<strong>Answer: network documentation.</strong> Before a network can be scaled you need the physical topology (where each device is and which cable runs where) and the logical topology (subnets, addresses, routes, who reaches whom), plus an inventory and a traffic analysis. Documentation comes first because every later decision is an argument about a diagram — and the two topologies are kept separately because they fail separately: an unplugged cable breaks one while the other still reads as correct. See section 16.3, slide 9.</p>
<p><strong>CQ20.1 (printed at session 58)</strong> — <em>"A small company has only one router as the exit point to its ISP. Which solution could be adopted to maintain connectivity if the router itself, or its connection to the ISP, fails?"</em><br>
<strong>Answer: redundancy — a second, independent path out.</strong> A second router protects against the router dying; a second ISP link protects against the line being cut; a second provider protects against the provider's own outage. The word doing the work is <em>independent</em>: two routers sharing one line still share one failure. And for a genuinely small company, "none of these, accepted deliberately and written down, with a mobile hotspot as the manual fallback" is also a defensible answer — provided the single point of failure is named rather than discovered. See section 16.3, slide 10.</p>
<p><strong>CQ20.2 (printed at session 59)</strong> — <em>"What mechanism can be implemented in a small network to help minimize network latency for real-time streaming applications?"</em><br>
<strong>Answer: Quality of Service (QoS)</strong> — classify traffic and serve the delay-sensitive class first at every point where a queue forms. Real-time audio and video are the only traffic on a small network that cannot be repaired by retrying, because a late packet has already missed its moment. Note what QoS does not do: it creates no bandwidth, it only decides who waits, so on an uncongested link it changes nothing. See section 16.2, slide 8.</p></div>`,
      `<div class="note-ct"><h3>💬 Ba câu THẬT SỰ thuộc chương này — trích nguyên văn và trả lời</h3>
<p>Trường xếp ba câu này vào buổi 57, 58 và 59 — một buổi đồ án và hai buổi ôn tập — nhưng cả ba đều là nội dung Chương 16. Chúng được trích đúng nguyên văn; bảng gốc không bị sửa.</p>
<p><strong>CQ19.2 (in ở buổi 57)</strong> — <em>"Which element of scaling a network involves identifying the physical and logical topologies?"</em><br>
<strong>Đáp án: tài liệu hoá mạng.</strong> Trước khi mở rộng được một mạng, bạn cần sơ đồ vật lý (thiết bị nào ở đâu, sợi cáp nào chạy tới đâu) và sơ đồ luận lý (subnet, địa chỉ, tuyến, ai tới được ai), cộng một bảng kiểm kê và một phân tích lưu lượng. Tài liệu đứng đầu vì mọi quyết định về sau đều là một cuộc tranh luận trên một cái sơ đồ — và hai sơ đồ được giữ riêng vì chúng hỏng riêng: một sợi cáp tuột làm hỏng cái này trong khi cái kia đọc lên vẫn hoàn toàn đúng. Xem mục 16.3, slide 9.</p>
<p><strong>CQ20.1 (in ở buổi 58)</strong> — <em>"A small company has only one router as the exit point to its ISP. Which solution could be adopted to maintain connectivity if the router itself, or its connection to the ISP, fails?"</em><br>
<strong>Đáp án: dự phòng — một đường ra thứ hai, độc lập.</strong> Router thứ hai chống được cú chết của router; đường ISP thứ hai chống được sợi cáp bị cắt; nhà cung cấp thứ hai chống được sự cố của chính nhà cung cấp. Chữ làm nên tất cả là <em>độc lập</em>: hai router dùng chung một đường thì vẫn chung một cái hỏng. Và với một công ty thật sự nhỏ thì "không làm gì cả, chấp nhận có chủ ý và ghi ra giấy, kèm một cục phát Wi-Fi 4G làm phương án tay" cũng là một câu trả lời biện hộ được — miễn là điểm hỏng đơn lẻ ấy được gọi tên chứ không phải được phát hiện. Xem mục 16.3, slide 10.</p>
<p><strong>CQ20.2 (in ở buổi 59)</strong> — <em>"What mechanism can be implemented in a small network to help minimize network latency for real-time streaming applications?"</em><br>
<strong>Đáp án: chất lượng dịch vụ (QoS)</strong> — phân loại lưu lượng rồi phục vụ lớp nhạy-cảm-với-độ-trễ trước, ở mọi chỗ hình thành hàng đợi. Thoại và video thời gian thực là lưu lượng duy nhất trong một mạng nhỏ không thể vá bằng cách thử lại, vì một gói tới trễ là đã lỡ mất khoảnh khắc của nó. Nhớ luôn cái QoS KHÔNG làm: nó không tạo ra băng thông, nó chỉ quyết định ai phải chờ, nên trên một đường không tắc thì nó chẳng thay đổi gì. Xem mục 16.2, slide 8.</p></div>`,
    ),

    bi(
      `<div class="note-ct"><h3>⚠️ One more discrepancy in the original table, at the very last session</h3>
<p>Sessions 58 and 59 are marked <code>CLO1-CLO10</code>, which is correct — the course has ten outcomes. <strong>Session 60 is marked <code>CLO1-CLO11</code>, and CLO11 does not exist.</strong> The CLO table in Syllabus 14520 lists exactly ten, CLO1 to CLO10.</p>
<p>It is almost certainly a typing slip rather than a missing outcome, but it is quoted here unchanged for the same reason as everything else in this course: <strong>the published table is the record, and a reader who meets it should be told it is inconsistent rather than left to wonder whether they have missed a syllabus item.</strong> If a lecturer asks about CLO11, the correct answer is that the CLO table does not define one.</p>
<p>This is one of the discrepancies already listed in the verification notes for this syllabus, alongside the missing Cisco Module 5, the session 27 jump from 9.2 to 9.4, and the grading table that reads as 150% because "Final exam 50%" is a parent row of its two children.</p></div>`,
      `<div class="note-ct"><h3>⚠️ Thêm một chỗ chưa khớp trong bảng gốc, ngay ở buổi cuối cùng</h3>
<p>Buổi 58 và 59 ghi <code>CLO1-CLO10</code>, và như vậy là đúng — môn có mười chuẩn đầu ra. <strong>Buổi 60 lại ghi <code>CLO1-CLO11</code>, mà CLO11 thì không tồn tại.</strong> Bảng CLO trong Syllabus 14520 liệt kê đúng mười cái, từ CLO1 tới CLO10.</p>
<p>Gần như chắc chắn đó là một lỗi gõ chứ không phải một chuẩn đầu ra bị thiếu, nhưng ở đây nó vẫn được trích nguyên xi, vì cùng một lý do với mọi thứ khác trong môn này: <strong>bảng đã công bố mới là hồ sơ, và người đọc gặp phải nó thì nên được nói thẳng rằng chỗ đó chưa khớp, chứ đừng để họ tự hỏi có phải mình đã bỏ sót một mục nào của syllabus hay không.</strong> Nếu có thầy cô hỏi về CLO11, câu trả lời đúng là bảng CLO không định nghĩa cái nào như vậy.</p>
<p>Đây là một trong những chỗ chưa khớp đã được ghi trong phần kiểm chứng của syllabus này, cùng với việc bỏ hẳn Cisco Module 5, buổi 27 nhảy từ 9.2 sang 9.4, và bảng điểm đọc thẳng ra 150% vì dòng "Final exam 50%" là dòng cha của hai dòng con.</p></div>`,
    ),

    bi(
      `<div class="callout ok"><h3>End of the course</h3>
<p>Sessions 56 and 57 are the group project; 53, 58, 59 and 60 are revision. <strong>There is no Chapter 17.</strong></p>
<p>What you have is a map: layer 1 in Chapter 4, layer 2 in Chapters 5 and 6, layer 3 across Chapters 7 to 12, layer 4 in Chapter 13, layer 7 in Chapter 14, security in Chapter 15 — and this chapter, which is the only one whose subject is the other fifteen assembled into something that runs.</p>
<p><strong>Design reads that map downwards. Troubleshooting reads it upwards.</strong> Everything else is practice.</p></div>`,
      `<div class="callout ok"><h3>Kết thúc môn học</h3>
<p>Buổi 56 và 57 là đồ án nhóm; buổi 53, 58, 59 và 60 là ôn tập. <strong>Không có Chương 17.</strong></p>
<p>Thứ bạn có trong tay là một tấm bản đồ: tầng 1 ở Chương 4, tầng 2 ở Chương 5 và 6, tầng 3 trải suốt Chương 7 tới 12, tầng 4 ở Chương 13, tầng 7 ở Chương 14, an ninh ở Chương 15 — và chương này, chương duy nhất mà chủ đề của nó chính là mười lăm chương kia ghép lại thành một thứ chạy được.</p>
<p><strong>Thiết kế thì đọc tấm bản đồ ấy từ trên xuống. Gỡ lỗi thì đọc từ dưới lên.</strong> Mọi thứ còn lại là luyện tập.</p></div>`,
    ),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz ─────────────────────────────────── */

const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

const QUIZ = {
  title: 'Quiz Chapter 16 — Build a Small Network|||Quiz Chương 16 — Dựng một mạng nhỏ',
  slug: 'nwc204-ch16-quiz',
  type: 'QUIZ',
  description: '12 câu song ngữ cho chương 16: bốn yếu tố chọn thiết bị, tĩnh hay DHCP, QoS quyết định ai chờ chứ không thêm băng thông, hai sơ đồ phải tài liệu hoá, dự phòng là đường THỨ HAI ĐỘC LẬP, thang kiểm chứng và chỗ tách DNS ra khỏi định tuyến, hai cột Status với Protocol là hai tầng, running-config khác startup-config, ba phương pháp gỡ lỗi và cái nào giả định gì, cùng phần ★ 404 khác 401 khác hết giờ và điểm hỏng đơn lẻ ở tầng ứng dụng.',
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      q('Which pair of device-selection factors pull hardest against each other in a small network?|||Cặp yếu tố chọn thiết bị nào kéo ngược nhau mạnh nhất trong một mạng nhỏ?',
        ['Cost and port count / speed|||Giá và số cổng / tốc độ', 'Expandability and colour|||Khả năng mở rộng và màu sắc', 'OS features and rack height|||Tính năng hệ điều hành và chiều cao rack', 'Warranty and weight|||Bảo hành và cân nặng'],
        0,
        'The four factors are cost, port count and speed, expandability, and OS features. Cost pushes you toward the smallest box that fits today; port count and growth push the other way. Buying for the current headcount is how a second cheap switch ends up daisy-chained onto the first, turning one uplink into the bottleneck for every packet crossing between the two halves of the office.|||Bốn yếu tố là giá, số cổng và tốc độ, khả năng mở rộng, và tính năng hệ điều hành. Giá đẩy bạn về phía cái hộp nhỏ nhất vừa đủ cho hôm nay; số cổng và mức tăng trưởng thì đẩy ngược lại. Mua theo số người hiện có chính là cách một con switch rẻ thứ hai bị nối dây chuyền vào con thứ nhất, biến một đường uplink thành nút thắt cho mọi gói tin đi qua lại giữa hai nửa văn phòng.'),

      q('Which devices should get a static address rather than DHCP?|||Thiết bị nào nên đặt địa chỉ tĩnh thay vì dùng DHCP?',
        ['Laptops, because users move them|||Laptop, vì người dùng hay di chuyển chúng', 'Anything other machines must find by address: servers, printers, network devices|||Thứ gì mà máy khác phải tìm tới theo địa chỉ: máy chủ, máy in, thiết bị mạng', 'Every device, for consistency|||Mọi thiết bị, cho nhất quán', 'Only the router|||Chỉ mỗi con router'],
        1,
        'The rule is functional, not about importance: if another machine reaches this one by address, that address must not change. Servers, printers, cameras and network devices qualify; user laptops do not. The classic symptom of getting it wrong is printing that works for weeks and dies after a power cut, because the printer came back with a different address while every driver still points at the old one.|||Luật ở đây là theo chức năng chứ không theo mức quan trọng: nếu máy khác tìm tới cái máy này bằng địa chỉ thì địa chỉ đó không được đổi. Máy chủ, máy in, camera và thiết bị mạng thuộc nhóm đó; laptop người dùng thì không. Triệu chứng kinh điển của việc làm sai là in ấn chạy êm mấy tuần rồi chết sau một lần mất điện, vì máy in quay lại với địa chỉ khác trong khi mọi driver vẫn trỏ vào địa chỉ cũ.'),

      q('What does QoS actually do on a congested link?|||QoS thật sự làm gì trên một đường truyền đang tắc?',
        ['It increases the available bandwidth|||Nó làm tăng băng thông khả dụng', 'It decides who waits, by serving the delay-sensitive class first|||Nó quyết định ai phải chờ, bằng cách phục vụ lớp nhạy cảm với độ trễ trước', 'It compresses packets so more fit|||Nó nén gói tin để chứa được nhiều hơn', 'It drops the largest packets|||Nó vứt những gói to nhất'],
        1,
        'QoS classifies traffic and prioritises the delay-sensitive class at every point where a queue can form. It creates no capacity at all — on an uncongested link it changes nothing measurable, which is why "we enabled QoS and nothing improved" usually means the link was never the bottleneck. Measure where the queue forms first, then prioritise there. This is the answer to CQ20.2.|||QoS phân loại lưu lượng rồi ưu tiên lớp nhạy cảm với độ trễ ở mọi chỗ có thể hình thành hàng đợi. Nó không tạo ra dung lượng nào cả — trên một đường không tắc thì nó chẳng thay đổi gì đo được, và đó là lý do câu "bật QoS rồi mà chẳng khá hơn" thường có nghĩa là đường truyền chưa bao giờ là nút thắt. Hãy đo xem hàng đợi hình thành ở đâu trước, rồi ưu tiên đúng chỗ đó. Đây là đáp án của CQ20.2.'),

      q('Why is real-time voice the only traffic on the list that changes a network design?|||Vì sao thoại thời gian thực là lưu lượng duy nhất trong danh sách làm thay đổi thiết kế mạng?',
        ['It uses more bandwidth than anything else|||Nó dùng nhiều băng thông hơn mọi thứ khác', 'It cannot be repaired by retrying — a late packet has already missed its moment|||Nó không vá được bằng cách thử lại — một gói tới trễ là đã lỡ mất khoảnh khắc của nó', 'It uses TCP while everything else uses UDP|||Nó dùng TCP trong khi mọi thứ khác dùng UDP', 'It needs a separate physical cable|||Nó cần một sợi cáp vật lý riêng'],
        1,
        'Web pages re-request, mail retries, DNS repeats the query — every other service on a small network survives loss by asking again. Audio cannot: the conversation has already moved past a packet that arrives 300 ms late, so retransmitting it is worse than dropping it, because the retransmission steals capacity from packets that are still useful. That single property is why voice forces QoS into the design.|||Trang web xin lại, thư thử lại, DNS lặp lại truy vấn — mọi dịch vụ khác trong một mạng nhỏ đều sống sót qua mất gói bằng cách hỏi lại. Âm thanh thì không: cuộc nói chuyện đã đi qua chỗ của một gói tới trễ 300 ms rồi, nên gửi lại nó còn tệ hơn vứt đi, vì lần gửi lại đó cướp mất dung lượng của những gói còn dùng được. Đúng tính chất ấy là lý do thoại ép QoS vào bản thiết kế.'),

      q('CQ19.2: which element of scaling a network involves identifying the physical and logical topologies?|||CQ19.2: yếu tố nào của việc mở rộng mạng liên quan tới xác định sơ đồ vật lý và sơ đồ luận lý?',
        ['Buying modular switches|||Mua switch dạng mô-đun', 'Network documentation|||Tài liệu hoá mạng', 'Enabling a routing protocol|||Bật một giao thức định tuyến', 'Upgrading the ISP link|||Nâng cấp đường truyền ISP'],
        1,
        'Documentation comes first, before any purchase, because every later decision is an argument about a diagram. You need the physical topology (device locations and cabling), the logical topology (subnets, addresses, routes), an inventory, and a traffic analysis. The two topologies are kept separate because they fail separately: an unplugged cable breaks one while the other still reads as perfectly correct on paper.|||Tài liệu hoá đứng đầu, trước mọi khoản mua sắm, vì mọi quyết định về sau đều là một cuộc tranh luận trên một cái sơ đồ. Bạn cần sơ đồ vật lý (vị trí thiết bị và đi dây), sơ đồ luận lý (subnet, địa chỉ, tuyến), một bảng kiểm kê, và một phân tích lưu lượng. Hai sơ đồ được giữ riêng vì chúng hỏng riêng: một sợi cáp tuột làm hỏng cái này trong khi cái kia đọc trên giấy vẫn hoàn toàn đúng.'),

      q('CQ20.1: a company has one router as its only exit to the ISP. What is the solution?|||CQ20.1: một công ty chỉ có một router làm đường ra duy nhất tới ISP. Giải pháp là gì?',
        ['A faster router|||Một con router nhanh hơn', 'Redundancy: a second, INDEPENDENT path out|||Dự phòng: một đường ra thứ hai, ĐỘC LẬP', 'More RAM in the existing router|||Thêm RAM cho con router đang có', 'A larger DHCP pool|||Một dải DHCP lớn hơn'],
        1,
        'The word doing the work is independent. A second router protects against the router dying; a second ISP line protects against a cut cable; a second provider protects against the provider own outage. Two routers sharing one line still share one failure. And for a genuinely small company, "none of these, accepted deliberately and written down, with a mobile hotspot as fallback" is also defensible — provided the single point of failure is named rather than discovered during the outage.|||Chữ làm nên tất cả ở đây là "độc lập". Router thứ hai chống được cú chết của router; đường ISP thứ hai chống được sợi cáp bị cắt; nhà cung cấp thứ hai chống được sự cố của chính nhà cung cấp. Hai router dùng chung một đường thì vẫn chung một cái hỏng. Và với một công ty thật sự nhỏ thì "không làm gì cả, chấp nhận có chủ ý và ghi ra giấy, kèm một cục phát 4G làm phương án lùi" cũng biện hộ được — miễn là điểm hỏng đơn lẻ ấy được gọi tên chứ không phải được phát hiện ngay trong lúc sập.'),

      q('On the verification ladder, ping 8.8.8.8 works but ping example.com fails. What is broken?|||Trên thang kiểm chứng, ping 8.8.8.8 thông nhưng ping example.com hỏng. Cái gì đang hỏng?',
        ['The default gateway|||Cổng mặc định', 'Name resolution — DNS. The network itself is fine|||Phân giải tên — DNS. Bản thân mạng thì vẫn tốt', 'The physical cable|||Sợi cáp vật lý', 'The TCP/IP stack on this host|||Ngăn xếp TCP/IP trên máy này'],
        1,
        'Those two rungs are one step apart and split the problem completely. Reaching an address proves layers 1 to 3 and routing off-site all work. Failing on a name proves only that the resolver is not answering, or is the wrong one. The repairs are unrelated: one is routing or filtering, the other is a resolver setting. This pair is also the human version of the best first question to ask a user: everything, or just that one site?|||Hai bậc đó cách nhau đúng một nấc mà chẻ đôi trọn vẹn vấn đề. Tới được một địa chỉ chứng minh tầng 1 tới 3 và định tuyến ra ngoài đều chạy. Hỏng ở cái tên chỉ chứng minh rằng bộ phân giải không trả lời, hoặc đang trỏ nhầm. Hai cách sửa chẳng liên quan gì tới nhau: một bên là định tuyến hay lọc, bên kia là một tuỳ chọn của bộ phân giải. Cặp bậc này cũng chính là phiên bản nói bằng tiếng người của câu hỏi đầu tiên nên hỏi người dùng: không vào được gì hết, hay chỉ mỗi trang đó?'),

      q('An interface shows up / down. What has that ALREADY ruled out?|||Một cổng hiện up / down. Điều đó ĐÃ loại trừ được gì?',
        ['Nothing useful|||Không gì hữu ích', 'The cable, both physical ports and the transceiver — layer 1 is proven|||Sợi cáp, cả hai cổng vật lý và bộ thu phát — tầng 1 đã được chứng minh', 'The routing table|||Bảng định tuyến', 'The far end device is definitely powered off|||Thiết bị đầu kia chắc chắn đã tắt nguồn'],
        1,
        'Status is layer 1 and Protocol is layer 2; reading them as one word throws away half the information. Status up means there is a signal, so the cable and ports are fine and reseating them is re-testing something already known. Protocol down means nothing usable comes back: encapsulation mismatch, missing clock rate, or a neighbour administratively down. The evidence points ACROSS the cable, so the next command belongs on the other device.|||Status là tầng 1 còn Protocol là tầng 2; đọc chúng thành một chữ là vứt đi một nửa thông tin. Status up nghĩa là có tín hiệu, nên cáp và cổng đều ổn và việc cắm đi cắm lại chỉ là thử lại thứ đã biết. Protocol down nghĩa là không có gì dùng được quay về: sai kiểu đóng gói, thiếu clock rate, hoặc thiết bị hàng xóm bị tắt bằng lệnh. Bằng chứng chỉ SANG BÊN KIA sợi cáp, nên câu lệnh kế tiếp thuộc về thiết bị đầu kia.'),

      q('A Cisco configuration change works all afternoon, then vanishes after a power cut. Why?|||Một thay đổi cấu hình Cisco chạy ngon cả buổi chiều rồi biến mất sau một lần mất điện. Vì sao?',
        ['The image is corrupted|||Bản image bị hỏng', 'It was only in running-config (RAM) and never copied to startup-config|||Nó chỉ nằm trong running-config (RAM) và chưa từng được chép sang startup-config', 'The configuration register is wrong|||Thanh ghi cấu hình bị sai', 'Another engineer reverted it|||Một kỹ sư khác đã hoàn tác nó'],
        1,
        'running-config is what is active right now, in RAM. startup-config is what comes back after a reload. They are two different files, and copy running-config startup-config is the step everyone forgets — after which the device looks like a hardware fault the next morning because it came back and undid your work. Verify with show startup-config, not by remembering that you typed the copy. Same habit as sshd -T: check the effective state, not the file you wrote.|||running-config là thứ đang hiệu lực ngay lúc này, trong RAM. startup-config là thứ quay lại sau một lần khởi động. Đó là hai file khác nhau, và copy running-config startup-config là bước ai cũng quên — sau đó thiết bị trông y hệt một cú hỏng phần cứng vào sáng hôm sau, vì nó quay lại và xoá sạch việc bạn làm. Hãy nghiệm thu bằng show startup-config, đừng nghiệm thu bằng việc nhớ rằng mình đã gõ lệnh copy. Cùng thói quen với sshd -T: kiểm trạng thái đang hiệu lực, không kiểm cái file mình vừa ghi.'),

      q('One application fails while everything else on the same host works. Which method fits best?|||Một ứng dụng hỏng trong khi mọi thứ khác trên cùng cái máy vẫn chạy. Phương pháp nào hợp nhất?',
        ['Bottom-up, starting at layer 1|||Từ dưới lên, bắt đầu ở tầng 1', 'Top-down, starting at layer 7|||Từ trên xuống, bắt đầu ở tầng 7', 'Restart everything and see|||Khởi động lại tất cả rồi xem sao', 'Replace the cable first|||Thay sợi cáp trước đã'],
        1,
        'If the rest of the host answers, layers 1 to 3 are already proven by the surrounding evidence, so starting at layer 1 spends the first ten minutes re-proving a working cable. Top-down starts where the fault must be. Bottom-up is not wrong, only slow here; divide-and-conquer is for when you have an informed hunch, and it is the fastest method when right and the slowest when wrong, because a wrong start means searching in both directions.|||Nếu phần còn lại của máy vẫn đáp thì tầng 1 tới 3 đã được bối cảnh xung quanh chứng minh hộ, nên bắt đầu ở tầng 1 là tiêu mười phút đầu để chứng minh lại một sợi cáp đang chạy tốt. Từ trên xuống bắt đầu ngay chỗ cái hỏng buộc phải nằm. Từ dưới lên không sai, chỉ chậm trong tình huống này; chia đôi dành cho lúc bạn có linh cảm có cơ sở, và nó là phương pháp nhanh nhất khi đúng, chậm nhất khi sai, vì cược sai nghĩa là phải tìm theo cả hai hướng.'),

      q('★ A route you wrote returns 404, and another returns 401. What do those tell you?|||★ Một tuyến bạn đã viết trả về 404, một tuyến khác trả về 401. Hai cái đó nói gì?',
        ['Both are failures and mean the same thing|||Cả hai đều hỏng và cùng nghĩa như nhau', '401 proves the path works and the code is mounted; 404 means nothing is mounted there|||401 chứng minh đường đi thông và mã đã được nạp; 404 nghĩa là không có gì nạp ở đó', '404 means the server is down|||404 nghĩa là máy chủ đã chết', '401 means the network is filtered|||401 nghĩa là mạng đang bị lọc'],
        1,
        'In a browser both look like failure and they mean opposite things. 401 is good news: the request reached the server, the route exists, and it simply wants credentials — the whole path is proven. 404 from a route you know you wrote means the running build is not the build you think it is. And no answer at all means something filtered the packet, which tells you nothing about the service — go back to the ladder. The status code is the diagnosis.|||Trong trình duyệt thì cả hai trông đều là hỏng, mà ý nghĩa thì ngược nhau. 401 là tin tốt: yêu cầu đã tới máy chủ, tuyến có tồn tại, và nó chỉ đang đòi đăng nhập — cả đường đi đã được chứng minh. 404 từ một tuyến mà bạn biết chắc mình đã viết thì nghĩa là bản đang chạy không phải bản bạn tưởng. Còn hoàn toàn không có câu trả lời nghĩa là có thứ gì đó đã lọc mất gói, và điều đó chẳng nói gì về dịch vụ — hãy quay lại cái thang. Mã trạng thái chính là chẩn đoán.'),

      q('★ Why is a stateless service easy to duplicate while a database is not?|||★ Vì sao một dịch vụ không giữ trạng thái thì dễ nhân đôi còn cơ sở dữ liệu thì không?',
        ['Databases use more CPU|||Cơ sở dữ liệu tốn CPU hơn', 'A database holds state, so two copies need a rule for which one is authoritative|||Cơ sở dữ liệu giữ trạng thái, nên hai bản cần một luật nói bản nào là bản chính', 'Databases cannot run in containers|||Cơ sở dữ liệu không chạy được trong container', 'Stateless services do not need networking|||Dịch vụ không trạng thái thì không cần mạng'],
        1,
        'Run two copies of a stateless service and a proxy in front, and either copy answers correctly — there is nothing to reconcile. State changes that: two databases accepting writes immediately disagree, so duplication requires replication, a primary, and a rule for failover. This is the layer-7 version of the CQ20.1 question, and the honest answer for most small setups is one machine with an accepted single point of failure plus a restore procedure someone has actually run.|||Chạy hai bản của một dịch vụ không trạng thái cộng một proxy đứng trước thì bản nào đáp cũng đúng — chẳng có gì phải dung hoà. Trạng thái làm thay đổi điều đó: hai cơ sở dữ liệu cùng nhận ghi là lệch nhau ngay lập tức, nên nhân đôi thì phải có sao chép, có bản chính, và có luật chuyển dự phòng. Đây là phiên bản tầng 7 của câu CQ20.1, và câu trả lời trung thực cho phần lớn hệ thống nhỏ là một cái máy với một điểm hỏng đơn lẻ được chấp nhận, cộng một quy trình khôi phục đã có người thật sự chạy thử.'),
    ],
  },
};

export default [
  {
    title: 'Chapter 16 — Build a Small Network (FLM sessions 54-55)|||Chương 16 — Dựng một mạng nhỏ (buổi 54-55 của FLM)',
    slug: 'nwc204-chuong-16-dung-mot-mang-nho',
    description: 'Cisco Module 17 theo đúng buổi 54-55 của FLM, và là CHƯƠNG CUỐI của môn — chương duy nhất không có tầng nào mới, vì chủ đề của nó chính là mười lăm chương kia ghép lại: một mạng nhỏ gồm những gì và ai duy trì nó, bốn yếu tố chọn thiết bị với cặp giá-đấu-số-cổng, năm quyết định phải chốt trước khi cắm cáp, các giao thức của mạng nhỏ và vì sao thoại thời gian thực là cái duy nhất không vá được bằng thử lại, QoS quyết định AI PHẢI CHỜ chứ không thêm băng thông, mở rộng bắt đầu từ hai sơ đồ chứ không từ hoá đơn, và dự phòng là một đường THỨ HAI ĐỘC LẬP. Buổi 55: thang kiểm chứng kết nối, bảng lệnh Windows so với Linux, lệnh show của IOS với hai cột Status và Protocol là hai tầng, running-config khác startup-config, ba phương pháp gỡ lỗi và điều mỗi cái giả định, ba tình huống giải từng bước, công cụ AI. Kèm phần ★: một ngăn xếp docker compose là một mạng nhỏ có thật, điểm hỏng đơn lẻ ở tầng ứng dụng, cả môn đã đi bottom-up từ đầu, 404 khác 401 khác hết giờ, và một bản đồ nối mười sáu chương thành một đường đi từ tầng 1 lên tầng 7. Ba câu hỏi kiến tạo bị xếp nhầm buổi (CQ19.2, CQ20.1, CQ20.2) được trích và trả lời đủ; chỗ buổi 60 ghi CLO1-CLO11 trong khi môn chỉ có 10 CLO cũng được nêu. Slide tiếng Anh do cuongthai.com dựng, giảng song ngữ.',
    lessons: [L1, L2, QUIZ],
  },
];
