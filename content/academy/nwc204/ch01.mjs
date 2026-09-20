/**
 * NWC204 · Chương 1 — Networking Today (Cisco Module 1, FLM buổi 1–2).
 *
 * Nguồn: content/academy/_syllabus-flm/NWC204.json — buổi 1 và buổi 2, cùng bảng
 * cauHoiKienTao (CQ1.1, CQ1.2 ở buổi 1; CQ1.3 ở buổi 2).
 *
 * Slide: scripts/slides-src/nwc204-ch01.mjs → 18 ảnh, deck `nwc204-ch01`.
 *   bài 1.1 = slide 1–8 · bài 1.2 = slide 9–13 · bài 1.3 = slide 14–18.
 * Slide do cuongthai.com tự dựng (FLM không đăng slide nào cho NWC204, và bộ
 * CCNA gốc là tài liệu bản quyền của Cisco trên netacad).
 *
 * ⚠️ File này KHÔNG được gom vào NWC204.mjs bởi chính nó — người điều phối gom.
 * ⚠️ lesson.content là String; KHÔNG backtick lồng, KHÔNG ${ } trong chuỗi.
 */
import { registerDeck, walk, walkHead, bi, cq } from './_slides.mjs';

const D = registerDeck('nwc204-ch01', {
  code: 'NWC204 Ch.1',
  en: 'Networking Today',
  vi: 'Mạng máy tính hôm nay',
  total: 18,
});

/* ════════════════════════════════════════════════════════════════════════════
   Bài 1.1 — buổi 1: 1.1 Networks Affect Our Lives … 1.4 Common Types of Networks
   ════════════════════════════════════════════════════════════════════════════ */
const L11 = {
  title: '1.1 — What a network is: components, topologies, types|||1.1 — Mạng là gì: thành phần, tô-pô, các loại mạng',
  slug: 'nwc204-1-1-mang-la-gi-thanh-phan-to-po',
  type: 'VIDEO',
  description: 'FLM buổi 1 (CLO1, CLO9): mạng là một thoả thuận chứ không phải sợi cáp; ba loại thành phần; NIC/port/interface/link; client-server vs P2P; tô-pô vật lý vs logic; SOHO/LAN/WAN/Internet. Kèm cách tự kiểm bằng lệnh thật và 4 bẫy hay mắc.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 1 · Lesson 1.1 · FLM session 1 · CLO1, CLO9</span>
<h2>What a network is — components, topologies, types</h2>
<p class="lead">After this lesson you can point at any box on a network diagram and say what it is for, tell a <strong>physical</strong> topology from a <strong>logical</strong> one, and decide from a single terminal whether two machines are even supposed to be able to talk.</p>
<p class="nhan">Source: FLM · Syllabus 14520 · session 1 — "Course overview. 1. Networking Today. 1.1 Networks Affect Our Lives. 1.2 Network Components. 1.3 Network Representations and Topologies. 1.4 Common Types of Networks"</p>

<div class="callout"><span class="badge">Opening question</span>
<p>You plug your laptop into the socket on the wall of a classroom. The link light comes on. You can reach the printer in the room, but not the one in the room next door — and not the internet. <strong>Nothing is broken.</strong> Why?</p>
<p>By the end of this lesson you will be able to give three different answers, and to say which one it is <em>without asking anybody</em>.</p></div>

<h3>Every term, from zero</h3>
<ul>
<li><strong>Network</strong> — two or more devices that have agreed on a way to exchange data over shared infrastructure. The agreement, not the cable, is the network.</li>
<li><strong>End device</strong> (host) — where data starts or ends: PC, phone, printer, server, camera, sensor.</li>
<li><strong>Intermediary device</strong> — moves data and decides where it goes: switch, router, wireless access point, firewall.</li>
<li><strong>Media</strong> — what carries the signal: copper (electricity), fibre (light), wireless (radio).</li>
<li><strong>NIC</strong> — network interface card, the adapter inside an end device. It owns the MAC address.</li>
<li><strong>Port</strong> — the physical hole. <strong>Interface</strong> — the same port as software sees it. Configuration happens on the interface.</li>
<li><strong>Topology</strong> — the shape of the network. <em>Physical</em> = where the cables run. <em>Logical</em> = which addresses may talk to which.</li>
</ul>

<h3>The same picture, as a diagram</h3>
<pre class="mermaid">
flowchart LR
  A["PC-A&lt;br&gt;192.168.1.10/24"] --- S["Switch S1&lt;br&gt;Layer 2 - MAC"]
  B["PC-B&lt;br&gt;192.168.1.20/24"] --- S
  S --- R(["Router R1&lt;br&gt;Layer 3 - IP&lt;br&gt;default gateway"])
  R --- I(["Internet"])
</pre>
<p>PC-A reaches PC-B through the switch alone, because they are in the same network. Anything outside 192.168.1.0/24 must go through R1 first. That single sentence is the whole of layer 2 versus layer 3.</p>

<h3>Why the design is like this</h3>
<p>You could imagine a network where every device is wired to every other device. Ten devices would need 45 cables; a hundred devices would need 4,950. That is why <strong>intermediary devices</strong> exist: one switch turns N cables into N-1 fewer problems, and the cost of adding a device becomes one cable instead of N.</p>
<p>The price of that choice is that a switch can now be wrong — it can be full, misconfigured, or simply unplugged. Every following module is about reading the state of those intermediary devices instead of guessing.</p>`,

      `<span class="eyebrow">NWC204 · Chương 1 · Bài 1.1 · FLM buổi 1 · CLO1, CLO9</span>
<h2>Mạng là gì — thành phần, tô-pô, các loại mạng</h2>
<p class="lead">Học xong bài này bạn chỉ được vào bất kỳ ô nào trên sơ đồ mạng và nói nó để làm gì, phân biệt được tô-pô <strong>vật lý</strong> với tô-pô <strong>logic</strong>, và chỉ bằng một cửa sổ terminal là biết hai máy có được phép nói chuyện với nhau hay không.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 1 — "Course overview. 1. Networking Today. 1.1 Networks Affect Our Lives. 1.2 Network Components. 1.3 Network Representations and Topologies. 1.4 Common Types of Networks"</p>

<div class="callout"><span class="badge">Câu hỏi mở đầu</span>
<p>Bạn cắm laptop vào ổ mạng trên tường một phòng học. Đèn link sáng. Bạn in được ra máy in trong phòng, nhưng KHÔNG in được ra máy in phòng bên, và cũng không vào được internet. <strong>Không có gì hỏng cả.</strong> Vì sao?</p>
<p>Hết bài này bạn sẽ đưa ra được ba câu trả lời khác nhau, và nói được nó là cái nào — <em>mà không phải hỏi ai</em>.</p></div>

<h3>Mọi thuật ngữ, từ số 0</h3>
<ul>
<li><strong>Mạng (network)</strong> — hai thiết bị trở lên đã thống nhất một cách trao đổi dữ liệu trên hạ tầng dùng chung. Cái <em>thoả thuận</em> mới là mạng, không phải sợi cáp.</li>
<li><strong>Thiết bị đầu cuối (end device, host)</strong> — nơi dữ liệu bắt đầu hoặc kết thúc: PC, điện thoại, máy in, máy chủ, camera, cảm biến.</li>
<li><strong>Thiết bị trung gian (intermediary device)</strong> — chuyển dữ liệu và quyết định đường đi: switch, router, access point Wi-Fi, tường lửa.</li>
<li><strong>Môi trường truyền (media)</strong> — thứ mang tín hiệu: đồng (điện), quang (ánh sáng), không dây (sóng vô tuyến).</li>
<li><strong>NIC</strong> — card mạng bên trong thiết bị đầu cuối. Nó giữ địa chỉ MAC.</li>
<li><strong>Port (cổng vật lý)</strong> — cái lỗ để cắm cáp. <strong>Interface</strong> — chính cổng đó dưới con mắt phần mềm. Cấu hình luôn diễn ra trên interface.</li>
<li><strong>Tô-pô (topology)</strong> — hình dạng mạng. <em>Vật lý</em> = cáp chạy ở đâu. <em>Logic</em> = địa chỉ nào được phép nói với địa chỉ nào.</li>
</ul>

<h3>Vẫn bức tranh đó, vẽ thành sơ đồ</h3>
<pre class="mermaid">
flowchart LR
  A["PC-A&lt;br&gt;192.168.1.10/24"] --- S["Switch S1&lt;br&gt;Tang 2 - MAC"]
  B["PC-B&lt;br&gt;192.168.1.20/24"] --- S
  S --- R(["Router R1&lt;br&gt;Tang 3 - IP&lt;br&gt;default gateway"])
  R --- I(["Internet"])
</pre>
<p>PC-A tới được PC-B chỉ nhờ cái switch, vì chúng cùng một mạng. Bất cứ thứ gì ngoài 192.168.1.0/24 đều phải đi qua R1 trước. Đúng một câu đó là toàn bộ khác biệt giữa tầng 2 và tầng 3.</p>

<h3>Vì sao thiết kế như vậy</h3>
<p>Có thể hình dung một mạng mà máy nào cũng nối thẳng tới mọi máy khác. Mười máy cần 45 sợi cáp; một trăm máy cần 4.950 sợi. Đó chính là lý do có <strong>thiết bị trung gian</strong>: một cái switch biến N sợi cáp thành ít hơn hẳn số vấn đề, và cái giá của việc thêm một máy chỉ còn là một sợi cáp thay vì N sợi.</p>
<p>Cái giá phải trả: từ nay switch có thể SAI — đầy bảng, cấu hình sai, hoặc đơn giản là rút phích. Mọi module sau của môn này đều xoay quanh việc <strong>đọc trạng thái</strong> của các thiết bị trung gian đó thay vì đoán.</p>`,
    ),

    walkHead(D, 1, 8,
      'Slides 1–8 follow session 1 of the FLM plan in its own order: 1.1 Networks Affect Our Lives, 1.2 Network Components, 1.3 Network Representations and Topologies, 1.4 Common Types of Networks.',
      'Slide 1–8 bám đúng thứ tự buổi 1 của kế hoạch FLM: 1.1 Networks Affect Our Lives, 1.2 Network Components, 1.3 Network Representations and Topologies, 1.4 Common Types of Networks.'),

    walk(D, [
      [1, 'Cover — Networking Today, sessions 1–2',
        `<p class="y-chinh">🎯 The whole of Cisco Module 1 is compressed into two FLM sessions, and both are marked CLO1 and CLO9.</p>
<p class="nhan">What the cover tells you</p>
<ul>
<li><strong>Sessions 1–2 of 60</strong> — this module gets 2 of the 60 contact sessions, about 3% of the course.</li>
<li><strong>CLO1</strong> — describe the evolution of network technologies and explain how layered protocols enable communication.</li>
<li><strong>CLO9</strong> — use AI tools to analyse, configure, monitor and troubleshoot networks.</li>
<li>Session 1 covers sub-topics 1.1 to 1.4; session 2 covers 1.5 to 1.10.</li>
<li>There is <strong>no lab</strong> in this module — the first lab is Lab 1.1 in sessions 5–6.</li>
<li>Everything here is vocabulary and judgement. Nothing here is graded by itself, and all of it is assumed from Chapter 2 on.</li>
</ul>`,
        `<p class="y-chinh">🎯 Cả Cisco Module 1 được nén vào hai buổi của FLM, và cả hai buổi đều gắn CLO1 và CLO9.</p>
<p class="nhan">Slide bìa nói gì</p>
<ul>
<li><strong>Buổi 1–2 trong 60 buổi</strong> — module này được 2/60 buổi trên lớp, khoảng 3% môn học.</li>
<li><strong>CLO1</strong> — mô tả sự tiến hoá của công nghệ mạng và giải thích giao thức phân tầng giúp truyền thông thế nào.</li>
<li><strong>CLO9</strong> — dùng công cụ AI để phân tích, cấu hình, giám sát và xử lý sự cố mạng.</li>
<li>Buổi 1 đi các mục 1.1 đến 1.4; buổi 2 đi từ 1.5 đến 1.10.</li>
<li>Module này <strong>không có lab</strong> — lab đầu tiên là Lab 1.1 ở buổi 5–6.</li>
<li>Toàn bộ ở đây là từ vựng và cách phán đoán. Không có đầu điểm riêng, nhưng từ Chương 2 trở đi người ta mặc định bạn đã biết hết.</li>
</ul>`],

      [2, '1.1 — What the network actually changed',
        `<p class="y-chinh">🎯 Read the third column, not the first two: each row turns a human habit into a <em>technical requirement</em>.</p>
<p class="nhan">The four rows, and what each demands</p>
<ul>
<li><strong>Video calls</strong> need low and <em>steady</em> delay. A link that is fast on average but jittery is useless here — you will meet this again as QoS.</li>
<li><strong>Cloud documents</strong> need availability. Data you cannot reach is data you do not have; that is why fault tolerance is a design goal, not a bonus.</li>
<li><strong>Online payment</strong> needs confidentiality and proof of identity. That is encryption plus authentication — Module 16.</li>
<li><strong>Work from anywhere</strong> needs remote access that is not also open to attackers. That single sentence is why SSH exists and why Telnet must not be used.</li>
</ul>
<p>Cisco calls this section "Networks Affect Our Lives". The exam version of the idea is simply: <strong>every network requirement comes from a human expectation</strong>.</p>`,
        `<p class="y-chinh">🎯 Hãy đọc cột thứ BA, đừng đọc hai cột đầu: mỗi dòng biến một thói quen của con người thành một <em>yêu cầu kỹ thuật</em>.</p>
<p class="nhan">Bốn dòng, và mỗi dòng đòi hỏi gì</p>
<ul>
<li><strong>Gọi video</strong> cần độ trễ thấp và <em>ổn định</em>. Một đường trung bình thì nhanh nhưng giật cục là vô dụng ở đây — bạn sẽ gặp lại nó dưới tên QoS.</li>
<li><strong>Tài liệu trên cloud</strong> cần tính sẵn sàng. Dữ liệu không với tới được là dữ liệu bạn không có; vì thế chịu lỗi (fault tolerance) là mục tiêu thiết kế, không phải phần thưởng thêm.</li>
<li><strong>Thanh toán trực tuyến</strong> cần bí mật và bằng chứng danh tính. Tức là mã hoá cộng với xác thực — Module 16.</li>
<li><strong>Làm việc từ bất cứ đâu</strong> cần truy cập từ xa mà không đồng thời mở cửa cho kẻ tấn công. Đúng một câu đó là lý do SSH tồn tại và Telnet không được dùng.</li>
</ul>
<p>Cisco gọi phần này là "Networks Affect Our Lives". Bản để đi thi của ý đó chỉ là: <strong>mọi yêu cầu kỹ thuật của mạng đều sinh ra từ một kỳ vọng của con người</strong>.</p>`],

      [3, 'What is a network, really?',
        `<p class="y-chinh">🎯 Four boxes and three links. Remove any one box and the conversation stops — but each stops it for a different reason.</p>
<p class="nhan">Reading the diagram left to right</p>
<ul>
<li><strong>PC-A 192.168.1.10</strong> — an end device. It has an address so that something can be sent <em>to</em> it.</li>
<li><strong>Switch S1</strong> — Layer 2. It keeps a table of which MAC address is on which port, and forwards only where needed.</li>
<li><strong>Router R1</strong>, drawn as a circle — Layer 3, and the <em>default gateway</em> of PC-A. It is the only box that knows how to leave this network.</li>
<li><strong>Server 203.0.113.5</strong> — an end device somewhere else, in a different network.</li>
<li>The three links are labelled with their medium and the port they land on: copper into Fa0/1, copper into Fa0/24, fibre to the ISP.</li>
</ul>
<p class="ghi-chu">Convention used on every Cisco diagram: switches are rectangles, routers are circles. It is not decoration — it tells you which device thinks in MAC and which thinks in IP.</p>`,
        `<p class="y-chinh">🎯 Bốn cái ô và ba đường nối. Bỏ bất kỳ ô nào là cuộc trò chuyện dừng — nhưng mỗi ô dừng nó vì một lý do khác nhau.</p>
<p class="nhan">Đọc sơ đồ từ trái sang phải</p>
<ul>
<li><strong>PC-A 192.168.1.10</strong> — thiết bị đầu cuối. Nó có địa chỉ để người khác gửi được <em>tới</em> nó.</li>
<li><strong>Switch S1</strong> — tầng 2. Nó giữ một bảng ghi MAC nào nằm ở cổng nào, và chỉ chuyển frame tới nơi cần.</li>
<li><strong>Router R1</strong>, vẽ hình tròn — tầng 3, và là <em>default gateway</em> của PC-A. Nó là ô DUY NHẤT biết cách đi ra khỏi mạng này.</li>
<li><strong>Server 203.0.113.5</strong> — một thiết bị đầu cuối ở chỗ khác, thuộc mạng khác.</li>
<li>Ba đường nối đều ghi rõ môi trường truyền và cổng nó cắm vào: cáp đồng vào Fa0/1, cáp đồng vào Fa0/24, cáp quang đi ISP.</li>
</ul>
<p class="ghi-chu">Quy ước trên mọi sơ đồ Cisco: switch là hình chữ nhật, router là hình tròn. Đây không phải trang trí — nó cho bạn biết thiết bị nào tư duy bằng MAC và thiết bị nào tư duy bằng IP.</p>`],

      [4, '1.2 — Three kinds of component',
        `<p class="y-chinh">🎯 Every device on any network is exactly one of three things, and the three cards say what each one owes the network.</p>
<p class="nhan">The three categories</p>
<ul>
<li><strong>End devices</strong> — create or consume data. If you can name what it is <em>for</em> (printing, browsing, storing), it is an end device.</li>
<li><strong>Intermediary devices</strong> — move data and decide its path. They produce no data of their own; their whole job is other people's traffic.</li>
<li><strong>Network media</strong> — carry the signal and impose the limits: distance, bandwidth, interference.</li>
</ul>
<p class="nhan">The rule under each card</p>
<ul>
<li>Every end device <strong>has an address</strong>, so it can be reached.</li>
<li>Every intermediary <strong>keeps a table</strong>, so it can forward. The MAC address table and the routing table are the two tables of this course.</li>
<li>Every medium <strong>has a limit</strong> — copper 100 m for Ethernet, fibre much further, wireless shared with everyone nearby.</li>
</ul>`,
        `<p class="y-chinh">🎯 Mọi thiết bị trên mọi mạng đều thuộc đúng một trong ba loại, và ba tấm thẻ nói rõ mỗi loại nợ mạng cái gì.</p>
<p class="nhan">Ba nhóm</p>
<ul>
<li><strong>Thiết bị đầu cuối</strong> — sinh ra hoặc tiêu thụ dữ liệu. Nếu bạn gọi tên được nó dùng <em>để làm gì</em> (in, lướt web, lưu trữ), đó là thiết bị đầu cuối.</li>
<li><strong>Thiết bị trung gian</strong> — chuyển dữ liệu và quyết định đường đi. Chúng không tự sinh ra dữ liệu nào; toàn bộ công việc của chúng là lưu lượng của người khác.</li>
<li><strong>Môi trường truyền</strong> — mang tín hiệu và áp đặt giới hạn: khoảng cách, băng thông, nhiễu.</li>
</ul>
<p class="nhan">Quy tắc nằm dưới ba thẻ</p>
<ul>
<li>Mọi thiết bị đầu cuối <strong>đều có địa chỉ</strong>, để người khác tới được nó.</li>
<li>Mọi thiết bị trung gian <strong>đều giữ một cái bảng</strong>, để chuyển tiếp được. Bảng MAC và bảng định tuyến là hai cái bảng của cả môn này.</li>
<li>Mọi môi trường truyền <strong>đều có giới hạn</strong> — cáp đồng 100 m với Ethernet, cáp quang xa hơn nhiều, không dây thì chia chung với mọi người xung quanh.</li>
</ul>`],

      [5, 'The words on every network diagram',
        `<p class="y-chinh">🎯 Four words that people use interchangeably and the exam does not: NIC, port, interface, link.</p>
<p class="nhan">Say them precisely</p>
<ul>
<li><strong>NIC</strong> — the card inside the end device. It owns a MAC address burned in at the factory.</li>
<li><strong>Physical port</strong> — the hole. On the slide it is Fa0/1 on the switch, and there are 24 of them.</li>
<li><strong>Interface</strong> — the same port as software sees it. You type <em>interface fa0/1</em>, not <em>port fa0/1</em>, and every show command reports interfaces.</li>
<li><strong>Link</strong> — the medium between two ports. It has a speed and a maximum length, and it is the only thing in the list you can trip over.</li>
</ul>
<p class="nhan">Naming you will see all year</p>
<ul>
<li><strong>Fa0/1</strong> = FastEthernet, module 0, port 1 — 100 Mbps.</li>
<li><strong>Gi0/0</strong> = GigabitEthernet — 1000 Mbps. A router with two of these is the usual lab router.</li>
</ul>`,
        `<p class="y-chinh">🎯 Bốn chữ mà người ta hay dùng lẫn lộn còn đề thi thì không: NIC, port, interface, link.</p>
<p class="nhan">Nói cho chính xác</p>
<ul>
<li><strong>NIC</strong> — cái card bên trong thiết bị đầu cuối. Nó giữ địa chỉ MAC được nung sẵn từ nhà máy.</li>
<li><strong>Cổng vật lý (port)</strong> — cái lỗ. Trên slide là Fa0/1 của switch, và switch này có 24 cái.</li>
<li><strong>Interface</strong> — chính cổng đó dưới con mắt phần mềm. Bạn gõ <em>interface fa0/1</em> chứ không gõ <em>port fa0/1</em>, và mọi lệnh show đều báo cáo theo interface.</li>
<li><strong>Link</strong> — môi trường truyền giữa hai cổng. Nó có tốc độ và chiều dài tối đa, và là thứ duy nhất trong danh sách này mà bạn có thể vấp phải.</li>
</ul>
<p class="nhan">Cách đặt tên bạn sẽ gặp suốt cả năm</p>
<ul>
<li><strong>Fa0/1</strong> = FastEthernet, module 0, cổng 1 — 100 Mbps.</li>
<li><strong>Gi0/0</strong> = GigabitEthernet — 1000 Mbps. Router lab thường có hai cổng loại này.</li>
</ul>`],

      [6, '1.3 — Client-server and peer-to-peer',
        `<p class="y-chinh">🎯 Two ways to arrange the same two machines. The cable does not change; the responsibility does.</p>
<p class="nhan">Client-server</p>
<ul>
<li>One machine holds the data and takes on the <em>duty of being up</em>. The other only asks.</li>
<li>Good: one place to enforce a password, one place to back up, one place to log.</li>
<li>Bad: that one place is also the single thing whose failure stops everybody.</li>
</ul>
<p class="nhan">Peer-to-peer</p>
<ul>
<li>Every host is client <em>and</em> server at once. Nothing dedicated to buy.</li>
<li>Bad: no central place to enforce a password or take a backup, and performance depends on a machine somebody may switch off.</li>
</ul>
<p>The printer example on the slide is the one to remember: <strong>the same printer is peer-to-peer from a desktop and client-server behind a print server</strong>. Architecture is a decision, not a property of the hardware.</p>`,
        `<p class="y-chinh">🎯 Hai cách sắp xếp đúng hai cái máy đó. Sợi cáp không đổi; trách nhiệm mới đổi.</p>
<p class="nhan">Client-server (khách - chủ)</p>
<ul>
<li>Một máy giữ dữ liệu và nhận lấy <em>nghĩa vụ phải luôn bật</em>. Máy kia chỉ hỏi.</li>
<li>Được: một chỗ duy nhất để đặt mật khẩu, một chỗ để sao lưu, một chỗ để ghi log.</li>
<li>Mất: cái "một chỗ" đó cũng là thứ duy nhất mà hỏng là cả nhà đứng.</li>
</ul>
<p class="nhan">Peer-to-peer (ngang hàng)</p>
<ul>
<li>Máy nào cũng vừa là khách vừa là chủ. Không phải mua thiết bị chuyên dụng nào.</li>
<li>Mất: không có chỗ trung tâm nào để ép mật khẩu hay sao lưu, và hiệu năng phụ thuộc vào một cái máy mà ai đó có thể tắt bất cứ lúc nào.</li>
</ul>
<p>Ví dụ máy in trên slide là thứ đáng nhớ nhất: <strong>vẫn cái máy in đó, chia sẻ từ một desktop thì là P2P, đặt sau một print server thì là client-server</strong>. Kiến trúc là một QUYẾT ĐỊNH, không phải tính chất của phần cứng.</p>`],

      [7, 'Physical vs logical topology',
        `<p class="y-chinh">🎯 The most useful distinction in the whole module, and the answer to this lesson's opening question.</p>
<p class="nhan">Physical topology</p>
<ul>
<li>Where the boxes and cables actually are. It answers: <em>which port is this plugged into?</em></li>
<li>You discover it by walking the room, reading labels, following a cable.</li>
</ul>
<p class="nhan">Logical topology</p>
<ul>
<li>Which addresses talk to which, and how they are grouped. It answers: <em>same network or different?</em></li>
<li>On the slide, 192.168.1.10 and 192.168.1.20 both have a /24 mask, so they are in the same network — no router needed.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>The point of the warning box.</strong> Two devices can be one cable apart and still unable to talk, because logically they sit in different networks — different subnets, or different VLANs. The link light tells you about the physical topology and says <em>nothing</em> about the logical one.</div>`,
        `<p class="y-chinh">🎯 Phân biệt hữu ích nhất trong cả module này, và cũng chính là lời giải cho câu hỏi mở đầu bài.</p>
<p class="nhan">Tô-pô vật lý</p>
<ul>
<li>Các ô và các sợi cáp thật sự nằm ở đâu. Nó trả lời: <em>cái này cắm vào cổng nào?</em></li>
<li>Bạn tìm ra nó bằng cách đi quanh phòng, đọc nhãn, lần theo sợi cáp.</li>
</ul>
<p class="nhan">Tô-pô logic</p>
<ul>
<li>Địa chỉ nào nói chuyện với địa chỉ nào, và chúng được gom nhóm ra sao. Nó trả lời: <em>cùng mạng hay khác mạng?</em></li>
<li>Trên slide, 192.168.1.10 và 192.168.1.20 cùng mặt nạ /24 nên cùng một mạng — không cần router.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Ý của ô cảnh báo.</strong> Hai thiết bị cách nhau đúng một sợi cáp vẫn có thể không nói chuyện được, vì về mặt logic chúng ở hai mạng khác nhau — khác subnet, hoặc khác VLAN. Đèn link chỉ nói về tô-pô VẬT LÝ và <em>không nói gì</em> về tô-pô logic.</div>`],

      [8, '1.4 — Network types by scale',
        `<p class="y-chinh">🎯 Four scales, and the row that matters is the last one: the Internet is a different <em>kind</em> of thing, not a bigger LAN.</p>
<p class="nhan">Reading the table</p>
<ul>
<li><strong>SOHO</strong> — home or small office, one combined box that is router, switch and access point at once. You own it.</li>
<li><strong>LAN</strong> — one building or campus, owned by one organisation, built from switched Ethernet and Wi-Fi.</li>
<li><strong>WAN</strong> — city, country or global, owned by a service provider. You rent capacity; you do not own the fibre.</li>
<li><strong>Internet</strong> — worldwide, owned by nobody, made of many WANs that agreed to hand traffic to each other.</li>
</ul>
<p class="nhan">What makes the Internet possible</p>
<ul>
<li>One addressing scheme everybody accepts: <strong>IP</strong>.</li>
<li>One way of handing traffic between organisations: <strong>BGP</strong>. You will not configure BGP in this course, but knowing the name stops you thinking the Internet is magic.</li>
</ul>`,
        `<p class="y-chinh">🎯 Bốn quy mô, và dòng đáng chú ý nhất là dòng cuối: Internet là một LOẠI khác, không phải một cái LAN to hơn.</p>
<p class="nhan">Đọc bảng</p>
<ul>
<li><strong>SOHO</strong> — nhà hoặc văn phòng nhỏ, một cục gộp cả router, switch và access point. Bạn sở hữu nó.</li>
<li><strong>LAN</strong> — một toà nhà hoặc một campus, do một tổ chức sở hữu, dựng bằng Ethernet có switch và Wi-Fi.</li>
<li><strong>WAN</strong> — thành phố, quốc gia hoặc toàn cầu, do nhà cung cấp dịch vụ sở hữu. Bạn thuê dung lượng, không sở hữu sợi quang.</li>
<li><strong>Internet</strong> — toàn cầu, không của riêng ai, ghép từ nhiều WAN đã đồng ý chuyển lưu lượng cho nhau.</li>
</ul>
<p class="nhan">Thứ gì làm cho Internet tồn tại được</p>
<ul>
<li>Một cách đánh địa chỉ mà tất cả chấp nhận: <strong>IP</strong>.</li>
<li>Một cách trao lưu lượng giữa các tổ chức: <strong>BGP</strong>. Môn này bạn không cấu hình BGP, nhưng biết cái tên đó là đủ để thôi nghĩ Internet là phép màu.</li>
</ul>`],
    ]),

    bi(
      `<h3>A worked example with real numbers</h3>
<p>Two laptops, one switch, one cable each. Laptop A is 192.168.1.10 with mask 255.255.255.0; laptop B is 192.168.2.20 with the same mask. Both link lights are green. Can A ping B?</p>
<pre><code class="language-plaintext">A: 192.168.1.10 / 255.255.255.0  -> network 192.168.1.0
B: 192.168.2.20 / 255.255.255.0  -> network 192.168.2.0
                                     ^ different third octet, so DIFFERENT networks</code></pre>
<p>No. A looks at its own mask, sees that B is not in 192.168.1.0, and decides to send the packet to its default gateway. There is no gateway configured, so the packet is dropped before it ever reaches the cable. <strong>The switch is innocent and the cable is fine.</strong> This is the "one cable apart, still cannot talk" case from slide 7.</p>

<h3>Commands you will actually type</h3>
<pre><code class="language-bash"># Linux / macOS — who am I, and which way out?
ip addr show
ip route show
# Windows — all four values at once
ipconfig /all</code></pre>
<p>And the output you are reading it for:</p>
<pre><code class="language-plaintext">inet 192.168.1.10/24 brd 192.168.1.255 scope global eth0
default via 192.168.1.1 dev eth0</code></pre>

<div class="callout ok"><strong>🔍 How to check it yourself</strong>
<ul>
<li><code>ip addr show</code> — you want a line containing <code>inet</code> and a <code>/24</code> style prefix. <strong>Right:</strong> an address in the range you expected. <strong>Wrong:</strong> an address starting <code>169.254.</code> means DHCP never answered and the machine invented one; <strong>no</strong> inet line at all means the interface is down, which is a cable or driver problem, not an addressing one.</li>
<li><code>ip route show</code> — you want a line beginning <code>default via</code>. <strong>Right:</strong> the gateway is in the same network as your own address. <strong>Wrong:</strong> no default line means everything outside your own subnet will fail while the LAN still works perfectly.</li>
<li><code>ping</code> the other host, then <code>ping</code> the gateway. If the gateway answers and the host does not, the problem is at the far end. If the gateway does not answer, the problem is on your side of it.</li>
</ul></div>

<div class="pitfall co-tieu-de"><strong>Trap 1 — "the link light is on, so the network works".</strong> Symptom: green light, full signal bars, and every single ping times out. The light only proves layer 1. Check the address and mask before touching anything else.
<p><strong>Trap 2 — reading only the address and ignoring the mask.</strong> Symptom: you can reach some machines on your floor and not others, apparently at random, and the ones that work change when someone reconnects. A wrong mask makes the host misjudge which destinations are local.</p>
<p><strong>Trap 3 — confusing port with interface.</strong> Symptom: you type <em>port fa0/1</em> and get <code>% Invalid input detected</code>, then conclude the switch is broken. IOS has no command called port.</p>
<p><strong>Trap 4 — assuming a switch connects you to the Internet.</strong> Symptom: the whole room can print and share files but nobody can browse, and people blame the ISP. A switch has no idea what "outside" means; only a router does.</p></div>

<h3>Exercise</h3>
<p><strong>(a)</strong> Room 301 has 12 PCs, one switch and one router. PC-1 is 10.0.3.11/24, PC-2 is 10.0.3.12/24, the router is 10.0.3.1/24. A new PC is set to 10.0.4.11/24 by mistake. List exactly what that PC can and cannot reach, and why.</p>
<p><strong>(b)</strong> Classify each of these as end device, intermediary device or media: an IP camera, a patch cable, a wireless access point, a network printer, a fibre run between two buildings, a firewall.</p>

<div class="dap-an"><strong>Solution (a).</strong> The new PC believes its own network is 10.0.4.0/24. Everything it wants to send to 10.0.3.x is judged "not local", so it is handed to the default gateway — which the PC either does not have, or has set to 10.0.4.1, an address nobody answers. Result: <strong>it can reach nothing at all</strong> — not the other PCs, not the router, not the Internet — while its link light stays green and the switch forwards its frames perfectly. The other 12 PCs are unaffected and keep working, which is exactly why the fault looks like "one broken PC".
<p><strong>Solution (b).</strong> End devices: IP camera, network printer. Intermediary devices: wireless access point, firewall. Media: patch cable, fibre run. Note that the firewall is intermediary even though it also runs software of its own — the test is whether its job is <em>other people's</em> traffic.</p></div>`,

      `<h3>Ví dụ có số thật, giải từng bước</h3>
<p>Hai laptop, một switch, mỗi máy một sợi cáp. Laptop A là 192.168.1.10 mặt nạ 255.255.255.0; laptop B là 192.168.2.20 cùng mặt nạ. Cả hai đèn link đều xanh. A có ping được B không?</p>
<pre><code class="language-plaintext">A: 192.168.1.10 / 255.255.255.0  -> mang 192.168.1.0
B: 192.168.2.20 / 255.255.255.0  -> mang 192.168.2.0
                                     ^ octet thu ba khac nhau => KHAC mang</code></pre>
<p>Không. A nhìn mặt nạ của chính mình, thấy B không nằm trong 192.168.1.0, nên quyết định gửi gói cho default gateway. Máy không có gateway nào, nên gói bị bỏ trước cả khi ra tới sợi cáp. <strong>Switch vô tội và sợi cáp hoàn toàn tốt.</strong> Đây đúng là tình huống "cách nhau một sợi cáp mà vẫn không nói được" ở slide 7.</p>

<h3>Lệnh bạn sẽ gõ thật</h3>
<pre><code class="language-bash"># Linux / macOS — tôi là ai, và lối ra nằm ở đâu?
ip addr show
ip route show
# Windows — bốn giá trị cùng lúc
ipconfig /all</code></pre>
<p>Và đây là phần kết xuất mà bạn gõ lệnh để đọc:</p>
<pre><code class="language-plaintext">inet 192.168.1.10/24 brd 192.168.1.255 scope global eth0
default via 192.168.1.1 dev eth0</code></pre>

<div class="callout ok"><strong>🔍 Cách tự kiểm</strong>
<ul>
<li><code>ip addr show</code> — bạn cần một dòng có chữ <code>inet</code> kèm tiền tố dạng <code>/24</code>. <strong>Đúng:</strong> địa chỉ nằm trong dải bạn mong đợi. <strong>Sai:</strong> địa chỉ bắt đầu bằng <code>169.254.</code> nghĩa là DHCP không trả lời và máy tự bịa ra một cái; <strong>không có</strong> dòng inet nào nghĩa là interface đang down — đó là chuyện cáp hoặc driver, không phải chuyện địa chỉ.</li>
<li><code>ip route show</code> — bạn cần một dòng bắt đầu bằng <code>default via</code>. <strong>Đúng:</strong> gateway nằm cùng mạng với địa chỉ của bạn. <strong>Sai:</strong> không có dòng default nghĩa là mọi thứ ngoài subnet của bạn sẽ hỏng trong khi LAN vẫn chạy ngon lành.</li>
<li><code>ping</code> máy kia, rồi <code>ping</code> gateway. Nếu gateway trả lời mà máy kia không, sự cố nằm ở đầu bên kia. Nếu gateway không trả lời, sự cố nằm ở phía bạn.</li>
</ul></div>

<div class="pitfall co-tieu-de"><strong>Bẫy 1 — "đèn link sáng nghĩa là mạng chạy".</strong> Triệu chứng: đèn xanh, sóng Wi-Fi đầy vạch, mà ping cái gì cũng timeout. Đèn chỉ chứng minh tầng 1. Hãy kiểm địa chỉ và mặt nạ trước khi đụng vào bất cứ thứ gì khác.
<p><strong>Bẫy 2 — chỉ đọc địa chỉ mà bỏ qua mặt nạ.</strong> Triệu chứng: bạn tới được vài máy trong tầng còn vài máy khác thì không, có vẻ ngẫu nhiên, và danh sách máy chạy được lại đổi khi có người cắm lại dây. Mặt nạ sai làm máy phán đoán sai đích nào là nội bộ.</p>
<p><strong>Bẫy 3 — lẫn port với interface.</strong> Triệu chứng: bạn gõ <em>port fa0/1</em>, nhận <code>% Invalid input detected</code>, rồi kết luận switch hỏng. IOS không có lệnh nào tên là port.</p>
<p><strong>Bẫy 4 — tưởng switch nối bạn ra Internet.</strong> Triệu chứng: cả phòng in được và chia sẻ file được nhưng không ai vào web được, và mọi người đổ lỗi cho nhà mạng. Switch không hề biết "bên ngoài" nghĩa là gì; chỉ router mới biết.</p></div>

<h3>Bài tập</h3>
<p><strong>(a)</strong> Phòng 301 có 12 PC, một switch và một router. PC-1 là 10.0.3.11/24, PC-2 là 10.0.3.12/24, router là 10.0.3.1/24. Một PC mới bị đặt nhầm thành 10.0.4.11/24. Hãy liệt kê chính xác máy đó tới được gì và không tới được gì, và vì sao.</p>
<p><strong>(b)</strong> Xếp loại từng thứ sau là thiết bị đầu cuối, thiết bị trung gian hay môi trường truyền: camera IP, dây patch, access point Wi-Fi, máy in mạng, tuyến cáp quang giữa hai toà nhà, tường lửa.</p>

<div class="dap-an"><strong>Lời giải (a).</strong> Máy mới tin rằng mạng của chính nó là 10.0.4.0/24. Mọi thứ nó muốn gửi tới 10.0.3.x đều bị phán là "không nội bộ" nên được giao cho default gateway — mà gateway thì máy hoặc không có, hoặc đặt là 10.0.4.1, một địa chỉ không ai trả lời. Kết quả: <strong>nó không tới được thứ gì cả</strong> — không tới PC khác, không tới router, không ra Internet — trong khi đèn link vẫn xanh và switch vẫn chuyển frame của nó hoàn hảo. 12 PC còn lại không hề bị ảnh hưởng và vẫn chạy bình thường, đó chính là lý do sự cố này trông giống "một cái PC hỏng".
<p><strong>Lời giải (b).</strong> Thiết bị đầu cuối: camera IP, máy in mạng. Thiết bị trung gian: access point Wi-Fi, tường lửa. Môi trường truyền: dây patch, tuyến cáp quang. Lưu ý tường lửa vẫn là thiết bị trung gian dù nó cũng chạy phần mềm riêng — tiêu chí phân loại là công việc của nó có phải là lưu lượng <em>của người khác</em> hay không.</p></div>`,
    ),

    cq(1, [
      ['CQ1.1', 'What is the Internet?', 'Internet là gì?'],
      ['CQ1.2', 'How can computers in network talk together?', 'Các máy tính trong mạng nói chuyện với nhau bằng cách nào?'],
    ]),

    bi(
      `<div class="note-ct"><strong>How to answer them well.</strong>
<p><strong>CQ1.1.</strong> Not "a big network" — say <em>a network of networks</em>: many independently owned WANs and LANs that agreed on one addressing scheme (IP) and one way to hand traffic to each other (BGP). Nobody owns it, which is why nobody can switch it off and why nobody can guarantee it either.</p>
<p><strong>CQ1.2.</strong> Three things, all required: each machine has an <em>address</em>, they share a <em>medium</em>, and they follow an agreed set of <em>rules</em> (protocols). Take away any one and communication stops — which is exactly the structure of Module 3.</p></div>`,
      `<div class="note-ct"><strong>Cách trả lời cho ra tấm ra món.</strong>
<p><strong>CQ1.1.</strong> Đừng nói "một mạng to" — hãy nói <em>mạng của các mạng</em>: rất nhiều WAN và LAN thuộc sở hữu độc lập đã thống nhất một cách đánh địa chỉ (IP) và một cách trao lưu lượng cho nhau (BGP). Không ai sở hữu nó, vì thế không ai tắt được nó và cũng không ai bảo đảm được nó.</p>
<p><strong>CQ1.2.</strong> Ba thứ, thiếu một là hỏng: mỗi máy có một <em>địa chỉ</em>, chúng dùng chung một <em>môi trường truyền</em>, và chúng tuân theo một bộ <em>quy tắc</em> đã thống nhất (giao thức). Bỏ đi bất kỳ thứ nào là truyền thông dừng — và đó đúng là bố cục của Module 3.</p></div>`,
    ),
  ].join('\n'),
};

/* ════════════════════════════════════════════════════════════════════════════
   Bài 1.2 — buổi 2: 1.5 Internet Connections … 1.8 Network Security
   ════════════════════════════════════════════════════════════════════════════ */
const L12 = {
  title: '1.2 — Internet connections, reliability, trends and threats|||1.2 — Kết nối Internet, độ tin cậy, xu hướng và mối đe doạ',
  slug: 'nwc204-1-2-ket-noi-do-tin-cay-de-doa',
  type: 'VIDEO',
  description: 'FLM buổi 2 (CLO1, CLO9): các kiểu kết nối Internet và cái giá của chúng; băng thông khác độ trễ; bốn tính chất của mạng tin cậy; BYOD/cloud/video; mối đe doạ và lớp phòng thủ. Kèm cách tự kiểm bằng ping/traceroute và 4 bẫy hay mắc.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 1 · Lesson 1.2 · FLM session 2 · CLO1, CLO9</span>
<h2>Internet connections, reliability, trends and threats</h2>
<p class="lead">After this lesson you can explain why a "fast" connection can still feel terrible, name the four properties that make a network reliable, and read a <code>traceroute</code> well enough to say <em>whose</em> problem an outage is.</p>
<p class="nhan">Source: FLM · Syllabus 14520 · session 2 — "1.5 Internet Connections. 1.6 Reliable Networks. 1.7 Network Trends. 1.8 Network Security. 1.9 The IT Professional. 1.10 Integrate AI Tools for Explaining Concepts"</p>

<div class="callout"><span class="badge">Opening question</span>
<p>Your home connection is advertised as 1 Gbps. A video call still freezes every evening, while downloading a large file is as fast as ever. Your neighbour has a 100 Mbps fibre line and his calls are perfect.</p>
<p><strong>Which number is the problem, and how do you prove it in thirty seconds?</strong></p></div>

<h3>Every term, from zero</h3>
<ul>
<li><strong>Bandwidth</strong> — the capacity a link is <em>rated</em> for, in bits per second. It is a contract, not a measurement.</li>
<li><strong>Throughput</strong> — what you actually get right now. Always less than bandwidth.</li>
<li><strong>Goodput</strong> — throughput minus headers and retransmissions: the part that is your actual data.</li>
<li><strong>Latency</strong> — how long one bit takes to arrive, in milliseconds. Independent of bandwidth.</li>
<li><strong>Jitter</strong> — how much latency varies. A steady 80 ms is fine for a call; 40 ms that jumps to 400 ms is not.</li>
<li><strong>Fault tolerance</strong>, <strong>scalability</strong>, <strong>quality of service</strong>, <strong>security</strong> — the four properties Cisco uses to define a reliable network.</li>
<li><strong>Defence in depth</strong> — the principle that no single control is enough, so controls are layered.</li>
</ul>

<h3>Why the design is like this</h3>
<p>Bandwidth and latency are independent because they measure different physics. Bandwidth is how <em>wide</em> the pipe is; latency is how <em>long</em> it is. Widening a pipe from Vietnam to Europe does not shorten it — light in fibre needs about 5 ms per 1,000 km whatever you pay.</p>
<p>That is why a satellite link can offer 100 Mbps and still be unusable for a conversation: the signal has to climb 36,000 km and come back, which costs roughly 500 ms before anything else goes wrong. Understanding this stops you buying bandwidth to fix a latency problem — an expensive and very common mistake.</p>`,

      `<span class="eyebrow">NWC204 · Chương 1 · Bài 1.2 · FLM buổi 2 · CLO1, CLO9</span>
<h2>Kết nối Internet, độ tin cậy, xu hướng và mối đe doạ</h2>
<p class="lead">Học xong bài này bạn giải thích được vì sao một đường truyền "nhanh" vẫn có thể dùng rất tệ, kể được bốn tính chất làm nên một mạng tin cậy, và đọc được <code>traceroute</code> đủ để nói sự cố là của <em>ai</em>.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 2 — "1.5 Internet Connections. 1.6 Reliable Networks. 1.7 Network Trends. 1.8 Network Security. 1.9 The IT Professional. 1.10 Integrate AI Tools for Explaining Concepts"</p>

<div class="callout"><span class="badge">Câu hỏi mở đầu</span>
<p>Đường mạng nhà bạn quảng cáo 1 Gbps. Gọi video vẫn cứ đứng hình mỗi buổi tối, trong khi tải một file lớn vẫn nhanh như thường. Nhà hàng xóm chỉ có cáp quang 100 Mbps mà gọi video mượt hoàn hảo.</p>
<p><strong>Con số nào mới là vấn đề, và làm sao chứng minh trong ba mươi giây?</strong></p></div>

<h3>Mọi thuật ngữ, từ số 0</h3>
<ul>
<li><strong>Băng thông (bandwidth)</strong> — dung lượng mà một đường truyền được <em>định mức</em>, tính bằng bit/giây. Đó là hợp đồng, không phải phép đo.</li>
<li><strong>Thông lượng (throughput)</strong> — cái bạn thật sự nhận được lúc này. Luôn nhỏ hơn băng thông.</li>
<li><strong>Goodput</strong> — thông lượng trừ đi header và phần gửi lại: phần thật sự là dữ liệu của bạn.</li>
<li><strong>Độ trễ (latency)</strong> — một bit mất bao lâu để tới nơi, tính bằng mili giây. Độc lập với băng thông.</li>
<li><strong>Jitter</strong> — độ trễ dao động bao nhiêu. Đều đặn 80 ms thì gọi thoại vẫn ổn; 40 ms mà thỉnh thoảng vọt lên 400 ms thì không.</li>
<li><strong>Chịu lỗi</strong>, <strong>mở rộng được</strong>, <strong>chất lượng dịch vụ</strong>, <strong>an toàn</strong> — bốn tính chất Cisco dùng để định nghĩa một mạng tin cậy.</li>
<li><strong>Phòng thủ nhiều lớp (defence in depth)</strong> — nguyên tắc rằng không một biện pháp đơn lẻ nào là đủ, nên phải xếp lớp.</li>
</ul>

<h3>Vì sao thiết kế như vậy</h3>
<p>Băng thông và độ trễ độc lập với nhau vì chúng đo hai thứ vật lý khác nhau. Băng thông là cái ống <em>rộng</em> bao nhiêu; độ trễ là cái ống <em>dài</em> bao nhiêu. Nới rộng ống từ Việt Nam đi châu Âu không làm nó ngắn lại — ánh sáng trong sợi quang cần khoảng 5 ms cho mỗi 1.000 km, trả bao nhiêu tiền cũng vậy.</p>
<p>Vì thế một đường vệ tinh có thể cho 100 Mbps mà vẫn không dùng để nói chuyện được: tín hiệu phải leo 36.000 km rồi quay về, tốn khoảng 500 ms trước khi có bất cứ trục trặc nào khác. Hiểu điều này giúp bạn thôi mua thêm băng thông để chữa một sự cố độ trễ — một sai lầm tốn kém và cực kỳ phổ biến.</p>`,
    ),

    walkHead(D, 9, 13,
      'Slides 9–13 follow session 2 of the FLM plan: 1.5 Internet Connections, 1.6 Reliable Networks, 1.7 Network Trends, 1.8 Network Security.',
      'Slide 9–13 bám đúng buổi 2 của kế hoạch FLM: 1.5 Internet Connections, 1.6 Reliable Networks, 1.7 Network Trends, 1.8 Network Security.'),

    walk(D, [
      [9, '1.5 — How a home or office reaches the Internet',
        `<p class="y-chinh">🎯 Six ways in, and the column that decides how they feel in practice is "shared with neighbours".</p>
<p class="nhan">The six connections</p>
<ul>
<li><strong>DSL</strong> — over telephone copper, not shared, legacy in most cities but still the only option in some.</li>
<li><strong>Cable</strong> — over coaxial, <em>shared</em> with the neighbourhood, so the speed you get drops in the evening.</li>
<li><strong>Fibre to the home</strong> — optical fibre, not shared at the last mile, the current default.</li>
<li><strong>Cellular</strong> — radio, shared, excellent as a backup link precisely because it fails for different reasons than a fixed line.</li>
<li><strong>Satellite</strong> — radio, shared, and the only choice where nothing else reaches. Its latency is its defining property.</li>
<li><strong>Dedicated leased line</strong> — fibre reserved for you, for businesses and data centres.</li>
</ul>
<p>The note at the bottom is the part people miss: a business link costs more not for raw speed but for the <strong>guarantee</strong> — symmetric upload, a fixed public address, and a contracted repair time.</p>`,
        `<p class="y-chinh">🎯 Sáu cách vào mạng, và cột quyết định cảm giác dùng thực tế là cột "chia chung với hàng xóm".</p>
<p class="nhan">Sáu kiểu kết nối</p>
<ul>
<li><strong>DSL</strong> — trên cáp đồng điện thoại, không chia chung, ở đa số thành phố đã cũ nhưng vài nơi vẫn là lựa chọn duy nhất.</li>
<li><strong>Cable</strong> — trên cáp đồng trục, <em>chia chung</em> cả khu, nên tốc độ tụt vào buổi tối.</li>
<li><strong>Cáp quang tới nhà</strong> — sợi quang, không chia chung ở chặng cuối, là mặc định hiện nay.</li>
<li><strong>Di động (cellular)</strong> — sóng vô tuyến, chia chung, rất hợp làm đường dự phòng chính vì nó hỏng theo những nguyên nhân khác với đường cố định.</li>
<li><strong>Vệ tinh</strong> — sóng vô tuyến, chia chung, và là lựa chọn duy nhất ở nơi không gì khác vươn tới. Độ trễ là đặc tính định danh của nó.</li>
<li><strong>Đường thuê riêng</strong> — sợi quang dành riêng cho bạn, dùng cho doanh nghiệp và trung tâm dữ liệu.</li>
</ul>
<p>Dòng ghi chú cuối slide mới là chỗ nhiều người bỏ sót: đường doanh nghiệp đắt hơn không phải vì tốc độ thô mà vì <strong>cam kết</strong> — upload cân bằng với download, địa chỉ công khai cố định, và thời gian sửa chữa có hợp đồng.</p>`],

      [10, 'Bandwidth, throughput, latency',
        `<p class="y-chinh">🎯 Four numbers that are constantly confused, and the reason your 1 Gbps line can be worse than a 100 Mbps one.</p>
<p class="nhan">The four rows</p>
<ul>
<li><strong>Bandwidth</strong> — the rating. It comes from the contract or the interface, and you never measure it.</li>
<li><strong>Throughput</strong> — the measurement. A speed test gives you this.</li>
<li><strong>Goodput</strong> — throughput minus overhead. Always the lowest number, and the only one that is your data.</li>
<li><strong>Latency</strong> — milliseconds, measured by ping. Completely independent of the other three.</li>
</ul>
<p class="nhan">The warning box, in one sentence</p>
<ul>
<li>A 1 Gbps link with 300 ms latency feels broken for a video call and perfect for a backup.</li>
<li>Different applications care about different columns: file copy wants throughput, conversation wants low and steady latency, streaming video wants both but tolerates a start-up delay.</li>
</ul>`,
        `<p class="y-chinh">🎯 Bốn con số hay bị lẫn nhất, và là lý do đường 1 Gbps của bạn có thể tệ hơn đường 100 Mbps.</p>
<p class="nhan">Bốn dòng</p>
<ul>
<li><strong>Băng thông</strong> — mức định danh. Nó đến từ hợp đồng hoặc từ interface, và bạn không bao giờ đo nó.</li>
<li><strong>Thông lượng</strong> — phép đo. Một lần speed test cho bạn con số này.</li>
<li><strong>Goodput</strong> — thông lượng trừ phần bọc. Luôn là số nhỏ nhất, và là số duy nhất thật sự là dữ liệu của bạn.</li>
<li><strong>Độ trễ</strong> — mili giây, đo bằng ping. Hoàn toàn độc lập với ba số kia.</li>
</ul>
<p class="nhan">Ô cảnh báo, gói trong một câu</p>
<ul>
<li>Đường 1 Gbps mà độ trễ 300 ms thì gọi video như hỏng, còn sao lưu thì hoàn hảo.</li>
<li>Ứng dụng khác nhau quan tâm cột khác nhau: copy file cần thông lượng, nói chuyện cần độ trễ thấp và đều, xem video cần cả hai nhưng chịu được một chút chờ lúc khởi động.</li>
</ul>`],

      [11, '1.6 — What makes a network reliable',
        `<p class="y-chinh">🎯 Four properties, and the arrow diagram shows the first one actually happening.</p>
<p class="nhan">The four properties</p>
<ul>
<li><strong>Fault tolerance</strong> — multiple paths. One link dies and traffic re-routes, ideally without anybody noticing.</li>
<li><strong>Scalability</strong> — you can add users without redesigning what already works. This is why networks are built in layers.</li>
<li><strong>Quality of Service</strong> — voice and video get priority over a file copy, because a file copy does not care about a 200 ms delay and a conversation does.</li>
<li><strong>Security</strong> — two separate jobs: protect the <em>infrastructure</em> (the devices) and protect the <em>data</em> on it.</li>
</ul>
<p class="nhan">The flow at the bottom</p>
<ul>
<li>First arrow: a packet takes path 1, the normal case.</li>
<li>Second arrow: path 1 is down, so the same packet takes path 2. That re-route is fault tolerance doing its job, and it costs you nothing at the time you need it only if you paid for the second path in advance.</li>
</ul>`,
        `<p class="y-chinh">🎯 Bốn tính chất, và sơ đồ mũi tên cho thấy tính chất đầu tiên đang thật sự diễn ra.</p>
<p class="nhan">Bốn tính chất</p>
<ul>
<li><strong>Chịu lỗi</strong> — có nhiều đường. Một đường chết thì lưu lượng tự đi đường khác, lý tưởng là không ai nhận ra.</li>
<li><strong>Mở rộng được</strong> — thêm người dùng mà không phải thiết kế lại phần đang chạy. Đó là lý do mạng được dựng theo tầng.</li>
<li><strong>Chất lượng dịch vụ (QoS)</strong> — thoại và video được ưu tiên hơn việc copy file, vì copy file không quan tâm trễ 200 ms còn cuộc nói chuyện thì có.</li>
<li><strong>An toàn</strong> — hai việc tách bạch: bảo vệ <em>hạ tầng</em> (các thiết bị) và bảo vệ <em>dữ liệu</em> chạy trên đó.</li>
</ul>
<p class="nhan">Sơ đồ luồng phía dưới</p>
<ul>
<li>Mũi tên thứ nhất: gói đi theo đường 1, trường hợp bình thường.</li>
<li>Mũi tên thứ hai: đường 1 chết, chính gói đó đi đường 2. Cú chuyển đường ấy là chịu lỗi đang làm việc, và nó chỉ không tốn gì vào đúng lúc bạn cần nếu bạn đã trả tiền cho đường thứ hai TỪ TRƯỚC.</li>
</ul>`],

      [12, '1.7 — Trends that shape today’s networks',
        `<p class="y-chinh">🎯 Six trends, all pushing the same way: the security boundary keeps moving further from the building.</p>
<p class="nhan">The six</p>
<ul>
<li><strong>BYOD</strong> — any device, any owner, any place. The network can no longer assume it owns the endpoint, which breaks every control that relied on that.</li>
<li><strong>Online collaboration</strong> — meetings and documents live on the network, so an outage stops work, not just browsing.</li>
<li><strong>Video</strong> — bandwidth and latency both matter, and neither substitutes for the other.</li>
<li><strong>Cloud computing</strong> — the server you administer may be in another country. Public, private, hybrid and community are the four models Cisco names.</li>
<li><strong>Smart home and powerline</strong> — networking over wiring never designed for data.</li>
<li><strong>Wireless ISP</strong> — broadband by radio where cable never arrived.</li>
</ul>
<p>The box is the exam-worthy sentence: each trend moves the security boundary further away from the building, which is why Module 16 gets two whole sessions.</p>`,
        `<p class="y-chinh">🎯 Sáu xu hướng, tất cả đều đẩy về cùng một phía: ranh giới an ninh ngày càng rời xa toà nhà.</p>
<p class="nhan">Sáu xu hướng</p>
<ul>
<li><strong>BYOD</strong> — thiết bị nào cũng được, của ai cũng được, ở đâu cũng được. Mạng không còn giả định được là nó sở hữu thiết bị đầu cuối, và điều đó phá vỡ mọi biện pháp từng dựa vào giả định ấy.</li>
<li><strong>Cộng tác trực tuyến</strong> — cuộc họp và tài liệu sống trên mạng, nên mất mạng là dừng việc, không chỉ là không lướt web được.</li>
<li><strong>Video</strong> — cả băng thông lẫn độ trễ đều quan trọng, và không cái nào thay được cái nào.</li>
<li><strong>Điện toán đám mây</strong> — máy chủ bạn quản trị có thể nằm ở nước khác. Public, private, hybrid và community là bốn mô hình Cisco nêu tên.</li>
<li><strong>Nhà thông minh và powerline</strong> — chạy mạng trên hệ dây điện vốn không hề được thiết kế cho dữ liệu.</li>
<li><strong>ISP không dây</strong> — băng rộng bằng sóng vô tuyến ở nơi cáp chưa bao giờ tới.</li>
</ul>
<p>Ô ghi chú là câu đáng thuộc để đi thi: mỗi xu hướng đều đẩy ranh giới an ninh ra xa toà nhà thêm một chút, và đó là lý do Module 16 được hẳn hai buổi.</p>`],

      [13, '1.8 — Threats and the answers to them',
        `<p class="y-chinh">🎯 Two columns that line up: six external threats on the left, six layered answers on the right.</p>
<p class="nhan">The threats</p>
<ul>
<li><strong>Viruses, worms, trojans</strong> — malicious code running on hosts.</li>
<li><strong>Spyware and adware</strong> — silent data collection.</li>
<li><strong>Zero-day attacks</strong> — exploits for which no patch exists yet, so patching alone cannot save you.</li>
<li><strong>Denial of service</strong> — the service is drowned in traffic rather than broken into.</li>
<li><strong>Data interception and theft</strong> — traffic read on the way. This is exactly what Telnet makes trivial.</li>
<li><strong>Identity theft</strong> — credentials reused somewhere else.</li>
</ul>
<p class="nhan">The answers, and why there are six of them</p>
<ul>
<li>Antivirus on hosts, firewall filtering at the edge, dedicated firewall systems, access control lists, intrusion prevention, and VPNs across untrusted paths.</li>
<li>No single control covers all six threats. That mismatch <em>is</em> defence in depth — the note under the columns.</li>
</ul>`,
        `<p class="y-chinh">🎯 Hai cột khớp nhau: sáu mối đe doạ từ bên ngoài bên trái, sáu lớp phòng thủ bên phải.</p>
<p class="nhan">Các mối đe doạ</p>
<ul>
<li><strong>Virus, worm, trojan</strong> — mã độc chạy trên máy trạm.</li>
<li><strong>Spyware, adware</strong> — âm thầm thu thập dữ liệu.</li>
<li><strong>Tấn công zero-day</strong> — khai thác lỗ hổng chưa có bản vá, nên chỉ vá thôi không cứu được bạn.</li>
<li><strong>Từ chối dịch vụ (DoS)</strong> — dịch vụ bị dìm chết trong lưu lượng chứ không bị đột nhập.</li>
<li><strong>Chặn bắt và đánh cắp dữ liệu</strong> — lưu lượng bị đọc trên đường. Đây đúng là thứ mà Telnet làm cho trở nên dễ như trở bàn tay.</li>
<li><strong>Đánh cắp danh tính</strong> — thông tin đăng nhập bị dùng lại ở chỗ khác.</li>
</ul>
<p class="nhan">Các lời đáp, và vì sao lại có tận sáu</p>
<ul>
<li>Antivirus trên máy trạm, lọc tường lửa ở biên, hệ thống tường lửa chuyên dụng, danh sách kiểm soát truy cập, ngăn chặn xâm nhập, và VPN khi đi qua đường không tin được.</li>
<li>Không biện pháp đơn lẻ nào phủ hết sáu mối đe doạ. Chính sự không khớp đó <em>là</em> phòng thủ nhiều lớp — đúng như dòng ghi chú dưới hai cột.</li>
</ul>`],
    ]),

    bi(
      `<h3>A worked example with real numbers</h3>
<p>Back to the opening question. Run this on the machine that has the problem:</p>
<pre><code class="language-bash">ping -c 20 1.1.1.1
traceroute 1.1.1.1</code></pre>
<p>A healthy fixed line looks like this:</p>
<pre><code class="language-plaintext">20 packets transmitted, 20 received, 0% packet loss
rtt min/avg/max/mdev = 8.1/9.0/11.4/0.8 ms</code></pre>
<p>The evening problem looks like this:</p>
<pre><code class="language-plaintext">20 packets transmitted, 17 received, 15% packet loss
rtt min/avg/max/mdev = 9.0/143.0/612.0/181.0 ms</code></pre>
<p>Read the last two numbers. <strong>max 612 ms and mdev 181 ms</strong> means the delay is swinging wildly — that is jitter, and jitter is what destroys a call while leaving a file download untouched, because a download simply waits. Bandwidth is not the problem, and buying more of it changes nothing.</p>

<div class="callout ok"><strong>🔍 How to check it yourself</strong>
<ul>
<li><code>ping -c 20 &lt;target&gt;</code> — <strong>right:</strong> 0% loss and an <em>mdev</em> (jitter) under about 20 ms. <strong>Wrong:</strong> loss above 1% means packets are being dropped somewhere; a large <em>mdev</em> with a small <em>min</em> means a queue is filling up, usually on the busiest link of the path.</li>
<li><code>traceroute &lt;target&gt;</code> — read it as a list of routers. <strong>Right:</strong> latency grows gently hop by hop. <strong>Wrong:</strong> latency jumps at one hop <em>and stays high after it</em> — that hop is where the problem starts. If it jumps at one hop and returns to normal afterwards, that router is simply slow at answering and is <em>not</em> your problem.</li>
<li>Test both ways round: ping your gateway first. <strong>If the gateway is already jittery, the fault is inside your building.</strong> If the gateway is perfect and the internet is not, the fault is on the ISP side, and you now have the evidence to say so.</li>
<li><code>ping 1.1.1.1</code> works but <code>ping google.com</code> fails — the network is fine and <strong>DNS</strong> is broken. Different problem, different team.</li>
</ul></div>

<div class="pitfall co-tieu-de"><strong>Trap 1 — "buy more bandwidth" as the answer to everything.</strong> Symptom: the plan is upgraded from 100 Mbps to 1 Gbps, the bill doubles, and the calls freeze exactly as before. Latency and jitter did not change because they never depended on the plan.
<p><strong>Trap 2 — reading only the average ping.</strong> Symptom: "average 143 ms, that is acceptable" — while the max is 612 ms and users say the call is unusable. Look at max and mdev, not avg.</p>
<p><strong>Trap 3 — blaming a slow hop in the middle of a traceroute.</strong> Symptom: you point at hop 5 showing 90 ms while hops 6 to 10 show 20 ms, and report a fault that does not exist. Routers de-prioritise answering traceroute; only a rise that <em>persists to the end</em> is real.</p>
<p><strong>Trap 4 — treating security as one product.</strong> Symptom: "we have a firewall, so we are secure", followed by a malware infection carried in on a personal laptop. The firewall guards the edge; BYOD walks straight past it. That is the whole reason the right-hand column of slide 13 has six entries.</p></div>

<h3>Exercise</h3>
<p><strong>(a)</strong> A branch office has a 50 Mbps cable link and a 20 Mbps cellular backup. The manager wants to know why voice quality is worse in the evening on a link that is never above 60% utilised. Give the technical explanation and one measurement that proves it.</p>
<p><strong>(b)</strong> For each of these, name which of the four reliability properties is missing: (i) a switch failure took down a whole floor; (ii) adding 30 new staff required re-addressing every PC; (iii) a large backup job makes phones unusable every night; (iv) a contractor plugged into a free socket and reached the finance server.</p>

<div class="dap-an"><strong>Solution (a).</strong> Cable is a <em>shared</em> medium (slide 9): the neighbourhood shares the same coaxial segment, so in the evening the provider's upstream queues fill even though <em>your</em> 50 Mbps is only 60% used. Full queues mean variable delay, and variable delay — jitter — is what voice cannot tolerate. The measurement: <code>ping -c 100</code> to the provider's first hop at 20:00 and at 03:00 and compare <strong>mdev</strong>, not throughput. A speed test would show 50 Mbps at both times and prove nothing.
<p><strong>Solution (b).</strong> (i) fault tolerance — there was only one path; (ii) scalability — the design could not absorb growth without redesign; (iii) quality of service — the backup was not de-prioritised below voice; (iv) security, specifically infrastructure security — an unused port was live and unrestricted, which is why Chapter 2 tells you to shut unused ports.</p></div>`,

      `<h3>Ví dụ có số thật, giải từng bước</h3>
<p>Quay lại câu hỏi mở đầu. Chạy đúng hai lệnh này trên chính máy đang gặp sự cố:</p>
<pre><code class="language-bash">ping -c 20 1.1.1.1
traceroute 1.1.1.1</code></pre>
<p>Một đường cố định khoẻ mạnh trông như sau:</p>
<pre><code class="language-plaintext">20 packets transmitted, 20 received, 0% packet loss
rtt min/avg/max/mdev = 8.1/9.0/11.4/0.8 ms</code></pre>
<p>Còn sự cố buổi tối trông như sau:</p>
<pre><code class="language-plaintext">20 packets transmitted, 17 received, 15% packet loss
rtt min/avg/max/mdev = 9.0/143.0/612.0/181.0 ms</code></pre>
<p>Hãy đọc hai con số cuối. <strong>max 612 ms và mdev 181 ms</strong> nghĩa là độ trễ đang dao động dữ dội — đó là jitter, và jitter chính là thứ phá nát cuộc gọi trong khi không đụng gì tới việc tải file, vì tải file thì chỉ cần chờ. Băng thông không phải vấn đề, và mua thêm băng thông không thay đổi được gì.</p>

<div class="callout ok"><strong>🔍 Cách tự kiểm</strong>
<ul>
<li><code>ping -c 20 &lt;đích&gt;</code> — <strong>đúng:</strong> 0% mất gói và <em>mdev</em> (jitter) dưới khoảng 20 ms. <strong>Sai:</strong> mất gói trên 1% nghĩa là có chỗ nào đó đang vứt gói; <em>mdev</em> lớn trong khi <em>min</em> nhỏ nghĩa là có một hàng đợi đang đầy dần, thường ở chặng bận nhất trên đường đi.</li>
<li><code>traceroute &lt;đích&gt;</code> — đọc nó như một danh sách router. <strong>Đúng:</strong> độ trễ tăng dần đều qua từng chặng. <strong>Sai:</strong> độ trễ vọt lên ở một chặng <em>và giữ cao mãi sau đó</em> — chặng đó là nơi sự cố bắt đầu. Nếu vọt lên một chặng rồi lại bình thường, router đó chỉ chậm trả lời và <em>không phải</em> vấn đề của bạn.</li>
<li>Kiểm theo hai hướng: ping gateway của chính bạn trước. <strong>Nếu gateway đã jitter rồi thì lỗi nằm trong toà nhà của bạn.</strong> Nếu gateway hoàn hảo mà internet thì không, lỗi nằm phía nhà mạng — và giờ bạn có bằng chứng để nói điều đó.</li>
<li><code>ping 1.1.1.1</code> chạy nhưng <code>ping google.com</code> hỏng — mạng vẫn tốt, <strong>DNS</strong> mới hỏng. Vấn đề khác, người chịu trách nhiệm khác.</li>
</ul></div>

<div class="pitfall co-tieu-de"><strong>Bẫy 1 — lấy "mua thêm băng thông" làm câu trả lời cho mọi thứ.</strong> Triệu chứng: nâng gói từ 100 Mbps lên 1 Gbps, hoá đơn tăng gấp đôi, và cuộc gọi vẫn đứng hình y như cũ. Độ trễ và jitter không đổi, vì chúng chưa bao giờ phụ thuộc vào gói cước.
<p><strong>Bẫy 2 — chỉ đọc ping trung bình.</strong> Triệu chứng: "trung bình 143 ms, chấp nhận được" — trong khi max là 612 ms và người dùng nói cuộc gọi không xài nổi. Hãy nhìn max và mdev, đừng nhìn avg.</p>
<p><strong>Bẫy 3 — đổ lỗi cho một chặng chậm ở giữa traceroute.</strong> Triệu chứng: bạn chỉ vào chặng 5 đang 90 ms trong khi chặng 6 đến 10 chỉ 20 ms, rồi báo một sự cố không tồn tại. Router cố tình ưu tiên thấp việc trả lời traceroute; chỉ mức tăng <em>kéo dài đến tận cuối</em> mới là thật.</p>
<p><strong>Bẫy 4 — coi an ninh là MỘT sản phẩm.</strong> Triệu chứng: "công ty có tường lửa rồi nên an toàn", rồi dính mã độc mang vào bằng laptop cá nhân. Tường lửa canh ở biên; BYOD đi thẳng qua cửa đó. Đó đúng là lý do cột bên phải của slide 13 có tới sáu mục.</p></div>

<h3>Bài tập</h3>
<p><strong>(a)</strong> Một chi nhánh có đường cable 50 Mbps và đường dự phòng di động 20 Mbps. Trưởng chi nhánh muốn biết vì sao chất lượng thoại tệ đi vào buổi tối trên một đường chưa bao giờ dùng quá 60%. Hãy đưa ra lời giải thích kỹ thuật và MỘT phép đo chứng minh được điều đó.</p>
<p><strong>(b)</strong> Với mỗi tình huống sau, hãy nêu tính chất nào trong bốn tính chất của mạng tin cậy đang thiếu: (i) một switch hỏng làm chết cả một tầng; (ii) thêm 30 nhân sự mới là phải đánh lại địa chỉ toàn bộ PC; (iii) một job sao lưu lớn làm điện thoại không dùng được mỗi đêm; (iv) một nhà thầu cắm vào ổ mạng trống và vào được máy chủ tài chính.</p>

<div class="dap-an"><strong>Lời giải (a).</strong> Cable là môi trường <em>chia chung</em> (slide 9): cả khu dùng chung một đoạn cáp đồng trục, nên buổi tối hàng đợi phía nhà mạng đầy lên dù <em>đường 50 Mbps của bạn</em> mới dùng 60%. Hàng đợi đầy nghĩa là độ trễ biến thiên, và độ trễ biến thiên — jitter — chính là thứ thoại không chịu nổi. Phép đo: <code>ping -c 100</code> tới chặng đầu tiên của nhà mạng lúc 20:00 và lúc 03:00 rồi so <strong>mdev</strong>, đừng so thông lượng. Một lần speed test sẽ cho 50 Mbps ở cả hai thời điểm và không chứng minh được gì.
<p><strong>Lời giải (b).</strong> (i) chịu lỗi — chỉ có một đường duy nhất; (ii) mở rộng được — thiết kế không hấp thụ nổi sự tăng trưởng nếu không làm lại; (iii) chất lượng dịch vụ — job sao lưu không bị hạ ưu tiên xuống dưới thoại; (iv) an toàn, cụ thể là an toàn hạ tầng — một cổng không dùng vẫn sống và không bị hạn chế, đó chính là lý do Chương 2 dặn phải tắt các cổng không dùng.</p></div>`,
    ),

    cq(2, [
      ['CQ1.3', 'Why do we need a reliable networks?', 'Vì sao chúng ta cần một mạng tin cậy?'],
    ]),

    bi(
      `<div class="note-ct"><strong>How to answer it well — and a note on the wording.</strong>
<p>CQ1.3 is quoted exactly as the syllabus writes it, grammar included ("a reliable networks"). Do not correct it in an exam answer; just answer it.</p>
<p>The answer is the four properties of slide 11, each tied to a way networks fail: <em>fault tolerance</em> for a broken link, <em>scalability</em> for growth, <em>QoS</em> for congestion, <em>security</em> for attack. A good answer names a symptom for each, because an examiner can tell the difference between a memorised list and an understood one.</p>
<p class="ghi-chu">The syllabus has no constructive question for session 6 at all, and none for sessions 9, 15, 16, 22, 30, 36 and 56 either — 8 of the 60 sessions are blank in that table while the numbering still runs to CQ20.2. Reported, not corrected here.</p></div>`,
      `<div class="note-ct"><strong>Cách trả lời cho tốt — và một ghi chú về câu chữ.</strong>
<p>CQ1.3 được trích nguyên văn theo syllabus, giữ nguyên cả lỗi ngữ pháp ("a reliable networks"). Đừng sửa nó trong bài thi; cứ trả lời thôi.</p>
<p>Câu trả lời chính là bốn tính chất ở slide 11, mỗi cái gắn với một kiểu mạng hỏng: <em>chịu lỗi</em> cho đường đứt, <em>mở rộng được</em> cho tăng trưởng, <em>QoS</em> cho nghẽn, <em>an toàn</em> cho tấn công. Một câu trả lời tốt nêu kèm triệu chứng cho từng cái, vì người chấm phân biệt được đâu là danh sách học thuộc và đâu là thứ đã hiểu.</p>
<p class="ghi-chu">Syllabus KHÔNG có câu hỏi kiến tạo nào cho buổi 6, và cũng không có cho buổi 9, 15, 16, 22, 30, 36, 56 — 8 trong 60 buổi bỏ trống ở bảng đó trong khi mã số vẫn đánh tới CQ20.2. Nêu ra chứ không sửa bảng gốc.</p></div>`,
    ),
  ].join('\n'),
};

/* ════════════════════════════════════════════════════════════════════════════
   Bài 1.3 — buổi 2 (phần cuối): 1.9 The IT Professional · 1.10 Integrate AI Tools
   ════════════════════════════════════════════════════════════════════════════ */
const L13 = {
  title: '1.3 — The IT professional, AI tools, and checking your own network|||1.3 — Nghề IT, công cụ AI, và tự kiểm mạng của chính mình',
  slug: 'nwc204-1-3-nghe-it-cong-cu-ai-va-tu-kiem',
  type: 'VIDEO',
  description: 'FLM buổi 2 phần cuối (CLO1, CLO9): bốn vai trò nghề mạng và yêu cầu netacad 75% của trường; quy trình 5 bước dùng AI mà không bị nó dắt mũi; bộ lệnh tự chẩn đoán trên máy của chính bạn; bản đồ Chương 1 và chỗ nối sang Chương 2.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 1 · Lesson 1.3 · FLM session 2 · CLO1, CLO9</span>
<h2>The IT professional, AI tools, and checking your own network</h2>
<p class="lead">This lesson closes Module 1 with the two sub-topics the 2026 syllabus added — 1.9 The IT Professional and 1.10 Integrate AI Tools — and turns them into something you can use tonight: a fixed order of commands that tells you where a fault is before you ask anybody.</p>
<p class="nhan">Source: FLM · Syllabus 14520 · session 2 — "1.9 The IT Professional. 1.10 Integrate AI Tools for Explaining Concepts"</p>

<div class="callout"><span class="badge">Opening question</span>
<p>Something on your network stops working. You have no colleague to ask and no ticket system to hide behind. You are allowed exactly <strong>four commands</strong> before you must say where the fault is.</p>
<p>Which four, and in what order? Getting the order right is worth more than knowing a hundred commands.</p></div>

<h3>Every term, from zero</h3>
<ul>
<li><strong>CLO9 and CLO10</strong> — two of the ten course learning outcomes are about using AI tools. That is new in the 2026 syllabus and it is assessed, not decorative.</li>
<li><strong>netacad.com</strong> — Cisco Networking Academy. FPT requires every assignment there to reach at least 75% before you may sit the final exam.</li>
<li><strong>Hallucination</strong> — when a language model states something confidently that is not true. In networking it usually appears as an invented command or an invented interface name.</li>
<li><strong>Verification</strong> — running a command on the real device and comparing the output with what you predicted. This is the only step that produces knowledge.</li>
<li><strong>Bottom-up troubleshooting</strong> — start at layer 1 (cable, link) and work up. Most faults are found in the first two layers.</li>
</ul>

<h3>Why the design is like this</h3>
<p>An AI assistant is fast at producing plausible configuration and has no way of knowing whether your switch exists. The device, by contrast, is slow but never lies. Putting them in that order — assistant proposes, device decides — is the only arrangement where the speed of one does not become the error rate of the other.</p>
<p>The same logic explains the command order below. Each command removes a whole class of possible causes, so the fastest diagnosis is the one that removes the largest class first.</p>`,

      `<span class="eyebrow">NWC204 · Chương 1 · Bài 1.3 · FLM buổi 2 · CLO1, CLO9</span>
<h2>Nghề IT, công cụ AI, và tự kiểm mạng của chính mình</h2>
<p class="lead">Bài này khép lại Module 1 bằng hai mục mà syllabus 2026 mới thêm — 1.9 The IT Professional và 1.10 Integrate AI Tools — và biến chúng thành thứ dùng được ngay tối nay: một thứ tự lệnh cố định cho bạn biết sự cố nằm ở đâu trước khi phải hỏi ai.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 2 — "1.9 The IT Professional. 1.10 Integrate AI Tools for Explaining Concepts"</p>

<div class="callout"><span class="badge">Câu hỏi mở đầu</span>
<p>Một thứ gì đó trên mạng của bạn ngừng hoạt động. Không có đồng nghiệp để hỏi, không có hệ thống ticket để núp sau. Bạn được phép gõ đúng <strong>bốn lệnh</strong> rồi phải nói ra sự cố nằm ở đâu.</p>
<p>Bốn lệnh nào, và theo thứ tự nào? Biết đúng THỨ TỰ còn giá trị hơn thuộc một trăm cái lệnh.</p></div>

<h3>Mọi thuật ngữ, từ số 0</h3>
<ul>
<li><strong>CLO9 và CLO10</strong> — hai trong mười chuẩn đầu ra của môn nói về việc dùng công cụ AI. Đây là điểm mới của syllabus 2026 và nó ĐƯỢC CHẤM, không phải trang trí.</li>
<li><strong>netacad.com</strong> — Cisco Networking Academy. Trường yêu cầu mọi bài trên đó phải đạt tối thiểu 75% thì mới được thi cuối kỳ.</li>
<li><strong>Ảo giác (hallucination)</strong> — khi một mô hình ngôn ngữ nói chắc nịch một điều không đúng. Trong ngành mạng nó thường xuất hiện dưới dạng một câu lệnh bịa hoặc một tên interface bịa.</li>
<li><strong>Nghiệm thu (verification)</strong> — chạy lệnh trên thiết bị thật rồi so kết xuất với thứ bạn đã dự đoán. Đây là bước DUY NHẤT tạo ra tri thức.</li>
<li><strong>Chẩn đoán từ dưới lên</strong> — bắt đầu từ tầng 1 (cáp, link) rồi đi lên. Phần lớn sự cố nằm ở hai tầng đầu tiên.</li>
</ul>

<h3>Vì sao thiết kế như vậy</h3>
<p>Trợ lý AI rất nhanh trong việc sinh ra cấu hình nghe hợp lý, và hoàn toàn không có cách nào biết cái switch của bạn có tồn tại hay không. Ngược lại, thiết bị thì chậm nhưng không bao giờ nói dối. Xếp chúng theo đúng thứ tự đó — trợ lý đề xuất, thiết bị phán quyết — là cách sắp xếp duy nhất mà tốc độ của bên này không biến thành tỉ lệ sai của bên kia.</p>
<p>Cùng logic ấy giải thích thứ tự lệnh phía dưới. Mỗi lệnh loại bỏ được nguyên một nhóm nguyên nhân, nên chẩn đoán nhanh nhất là chẩn đoán loại bỏ nhóm lớn nhất trước.</p>`,
    ),

    walkHead(D, 14, 18,
      'Slides 14–18 close session 2: 1.9 The IT Professional, 1.10 Integrate AI Tools, the self-check commands, the school’s questions for sessions 1–2, and the map of what comes next.',
      'Slide 14–18 khép lại buổi 2: 1.9 The IT Professional, 1.10 Integrate AI Tools, bộ lệnh tự kiểm, các câu hỏi kiến tạo của buổi 1–2, và bản đồ chặng đường phía trước.'),

    walk(D, [
      [14, '1.9 — The IT professional: who does what',
        `<p class="y-chinh">🎯 Four roles, one starting certification, and one sentence from the syllabus that decides whether you can sit the exam.</p>
<p class="nhan">The four roles</p>
<ul>
<li><strong>Network technician</strong> — patch cables, replace a faulty port, run the first checks. This is where the lab skills of Chapter 2 are used every day.</li>
<li><strong>Network administrator</strong> — owns the addressing plan, device configuration, backups and monitoring.</li>
<li><strong>Network engineer</strong> — design, capacity, routing policy, review of other people's changes.</li>
<li><strong>Security analyst</strong> — logs, alerts, hardening, incident response.</li>
</ul>
<p class="nhan">The two things worth writing down</p>
<ul>
<li>All four start from the same place: <strong>CCNA</strong>, which is what this course is the first part of.</li>
<li>FPT requires every Networking Academy assignment on <strong>netacad.com</strong> to reach at least <strong>75%</strong> before the final exam. That is in StudentTasks in the syllabus, next to the 80% attendance rule.</li>
</ul>`,
        `<p class="y-chinh">🎯 Bốn vai trò, một chứng chỉ khởi điểm, và một câu trong syllabus quyết định bạn có được thi hay không.</p>
<p class="nhan">Bốn vai trò</p>
<ul>
<li><strong>Kỹ thuật viên mạng</strong> — bấm cáp, thay cổng hỏng, chạy các phép kiểm đầu tiên. Đây là nơi kỹ năng lab của Chương 2 được dùng hằng ngày.</li>
<li><strong>Quản trị mạng</strong> — sở hữu sơ đồ địa chỉ, cấu hình thiết bị, sao lưu và giám sát.</li>
<li><strong>Kỹ sư mạng</strong> — thiết kế, tính dung lượng, chính sách định tuyến, duyệt thay đổi của người khác.</li>
<li><strong>Chuyên viên an ninh</strong> — log, cảnh báo, làm cứng thiết bị, ứng phó sự cố.</li>
</ul>
<p class="nhan">Hai điều đáng ghi lại</p>
<ul>
<li>Cả bốn đều xuất phát từ cùng một chỗ: <strong>CCNA</strong>, mà môn này chính là phần đầu tiên.</li>
<li>Trường yêu cầu mọi bài trên <strong>netacad.com</strong> đạt tối thiểu <strong>75%</strong> trước kỳ thi cuối. Điều này nằm ở mục StudentTasks của syllabus, ngay cạnh quy định dự ít nhất 80% số buổi.</li>
</ul>`],

      [15, '1.10 — Using AI tools without being misled',
        `<p class="y-chinh">🎯 Five steps, and step 5 is the one that turns an AI answer into knowledge.</p>
<p class="nhan">The five steps</p>
<ul>
<li><strong>1. Give the topology, not just the question.</strong> Addresses, masks, interface names, what you already tried. "My switch does not work" cannot be answered by anybody, human or not.</li>
<li><strong>2. Ask for the reasoning, then the command.</strong> A command you cannot explain is a command you cannot debug at 2 a.m.</li>
<li><strong>3. Predict the output before you run it.</strong> Write down what the <em>show</em> command should say if the answer is right.</li>
<li><strong>4. Run it on Packet Tracer or a lab switch</strong> — never first on something people are using.</li>
<li><strong>5. Compare with the real output.</strong> The mismatch is the finding. That is the whole exercise.</li>
</ul>
<p class="nhan">The failure modes named in the warning box</p>
<ul>
<li>Invented interface names, invented IOS commands that never existed, and subnet boundaries that are off by one.</li>
<li>CLO9 asks you to <em>use</em> AI. Step 5 is what makes using it safe — and it is also what the dialogue-based assessments are testing.</li>
</ul>`,
        `<p class="y-chinh">🎯 Năm bước, và bước 5 mới là bước biến một câu trả lời của AI thành tri thức.</p>
<p class="nhan">Năm bước</p>
<ul>
<li><strong>1. Đưa cả sơ đồ, đừng chỉ đưa câu hỏi.</strong> Địa chỉ, mặt nạ, tên interface, những gì bạn đã thử. "Switch của tôi không chạy" thì không ai trả lời được, người hay máy cũng vậy.</li>
<li><strong>2. Hỏi lý lẽ trước, hỏi câu lệnh sau.</strong> Một câu lệnh bạn không giải thích nổi là câu lệnh bạn không gỡ nổi lúc 2 giờ sáng.</li>
<li><strong>3. Dự đoán kết xuất TRƯỚC khi chạy.</strong> Ghi ra giấy lệnh <em>show</em> phải in ra cái gì nếu câu trả lời đúng.</li>
<li><strong>4. Chạy trên Packet Tracer hoặc switch lab</strong> — tuyệt đối đừng chạy đầu tiên trên thứ đang có người dùng.</li>
<li><strong>5. So với kết xuất thật.</strong> Chỗ lệch chính là phát hiện. Đó là toàn bộ bài tập.</li>
</ul>
<p class="nhan">Các kiểu hỏng được nêu trong ô cảnh báo</p>
<ul>
<li>Bịa tên interface, bịa lệnh IOS chưa từng tồn tại, và nói sai ranh giới subnet lệch một đơn vị.</li>
<li>CLO9 yêu cầu bạn <em>dùng</em> AI. Bước 5 là thứ làm cho việc dùng đó an toàn — và cũng chính là thứ mà các buổi đánh giá qua đối thoại đang kiểm tra.</li>
</ul>`],

      [16, 'Verify it yourself, on your own machine',
        `<p class="y-chinh">🎯 Five commands that make everything in this module visible, in the order that narrows a fault fastest.</p>
<p class="nhan">Reading the terminal block</p>
<ul>
<li><strong>ip addr show</strong> — your own address and mask. Answers "do I exist on this network at all?"</li>
<li><strong>ip route show</strong> — the default gateway, which is your exit. Answers "can anything leave?"</li>
<li><strong>ipconfig /all</strong> — the Windows equivalent of both at once, plus DNS.</li>
<li><strong>ping -c 4 1.1.1.1</strong> — is a known-good address on the Internet reachable? Deliberately an address, not a name.</li>
<li><strong>traceroute 1.1.1.1</strong> — every line is one router on the path, so you can say <em>where</em> it stops.</li>
</ul>
<div class="callout ok"><strong>The green box is the most valuable sentence in Module 1.</strong> If <code>ping 1.1.1.1</code> works but a domain name fails, the network is fine and DNS is the problem. That single distinction separates two completely different teams and saves hours; it returns in Module 15.</div>`,
        `<p class="y-chinh">🎯 Năm câu lệnh làm hiện ra mọi thứ trong module này, xếp theo thứ tự thu hẹp sự cố nhanh nhất.</p>
<p class="nhan">Đọc khối terminal</p>
<ul>
<li><strong>ip addr show</strong> — địa chỉ và mặt nạ của chính bạn. Trả lời "tôi có tồn tại trên mạng này không?"</li>
<li><strong>ip route show</strong> — default gateway, tức lối ra của bạn. Trả lời "có gì ra ngoài được không?"</li>
<li><strong>ipconfig /all</strong> — bản Windows gộp cả hai lệnh trên, kèm cả DNS.</li>
<li><strong>ping -c 4 1.1.1.1</strong> — một địa chỉ Internet chắc chắn sống có tới được không? Cố ý dùng ĐỊA CHỈ chứ không dùng tên.</li>
<li><strong>traceroute 1.1.1.1</strong> — mỗi dòng là một router trên đường đi, nhờ vậy bạn nói được nó tắc ở ĐÂU.</li>
</ul>
<div class="callout ok"><strong>Ô xanh là câu giá trị nhất của cả Module 1.</strong> Nếu <code>ping 1.1.1.1</code> chạy mà tên miền thì hỏng, mạng vẫn tốt và DNS mới là vấn đề. Chỉ một phân biệt đó thôi đã tách ra hai đội hoàn toàn khác nhau và tiết kiệm hàng giờ; nó quay lại ở Module 15.</div>`],

      [17, 'Sessions 1–2: the school’s own questions',
        `<p class="y-chinh">🎯 The three constructive questions FPT lists for sessions 1 and 2, quoted exactly, with the shape of a good answer beside each.</p>
<p class="nhan">The three</p>
<ul>
<li><strong>CQ1.1 — What is the Internet?</strong> A network <em>of networks</em> that agreed on IP addressing and on how to hand traffic over. Not one big LAN.</li>
<li><strong>CQ1.2 — How can computers in network talk together?</strong> An address each, a shared medium, and an agreed set of rules.</li>
<li><strong>CQ1.3 — Why do we need a reliable networks?</strong> Fault tolerance, scalability, QoS, security — each answering a different way a network fails.</li>
</ul>
<p class="nhan">What the note at the bottom reports</p>
<ul>
<li>CQ1.3 is reproduced with the syllabus's own grammar. It is quoted, not corrected.</li>
<li>The syllabus lists no constructive question for session 6 at all — one of eight blank sessions in a table that otherwise numbers up to CQ20.2.</li>
</ul>`,
        `<p class="y-chinh">🎯 Ba câu hỏi kiến tạo mà FPT ghi cho buổi 1 và buổi 2, trích nguyên văn, kèm hình dạng của một câu trả lời tốt.</p>
<p class="nhan">Ba câu</p>
<ul>
<li><strong>CQ1.1 — What is the Internet?</strong> Một mạng <em>của các mạng</em> đã thống nhất cách đánh địa chỉ IP và cách trao lưu lượng cho nhau. Không phải một cái LAN to.</li>
<li><strong>CQ1.2 — How can computers in network talk together?</strong> Mỗi máy một địa chỉ, dùng chung môi trường truyền, và theo một bộ quy tắc đã thống nhất.</li>
<li><strong>CQ1.3 — Why do we need a reliable networks?</strong> Chịu lỗi, mở rộng được, QoS, an toàn — mỗi cái trả lời cho một kiểu mạng hỏng khác nhau.</li>
</ul>
<p class="nhan">Dòng ghi chú cuối slide nêu điều gì</p>
<ul>
<li>CQ1.3 giữ nguyên ngữ pháp của chính syllabus. Đây là trích dẫn, không phải bản sửa.</li>
<li>Syllabus không ghi câu hỏi kiến tạo nào cho buổi 6 — một trong tám buổi bỏ trống, trong khi bảng vẫn đánh số tới CQ20.2.</li>
</ul>`],

      [18, 'Where Chapter 1 sits, and what comes next',
        `<p class="y-chinh">🎯 The map of the first 22 sessions, with Chapter 1 highlighted so you always know where you are.</p>
<p class="nhan">The five rows</p>
<ul>
<li><strong>1 — Networking Today</strong>, sessions 1–2: components, topologies, types, trends, threats. Highlighted: you are here.</li>
<li><strong>2 — Switch and end-device configuration</strong>, sessions 3–6: get into a device and configure it, plus Lab 1.1.</li>
<li><strong>3 — Protocols and models</strong>, sessions 7–10: OSI, TCP/IP, encapsulation.</li>
<li><strong>4 — Physical layer</strong>, sessions 11–14: copper, fibre, wireless.</li>
<li><strong>5 and beyond — Data link, Ethernet, network layer</strong>, sessions 15–22: frames, MAC, IP packets.</li>
</ul>
<div class="note-ct"><strong>One gap to be aware of now.</strong> The school's chapter numbers run one behind Cisco's module numbers from Chapter 5 on, and <strong>Cisco Module 5 (Number Systems) gets no session at all</strong> — yet sessions 30–33 on subnetting cannot be done without binary. A supplementary chapter on this site covers it before IPv4 Addressing.</div>`,
        `<p class="y-chinh">🎯 Bản đồ 22 buổi đầu, có tô sáng Chương 1 để bạn luôn biết mình đang ở đâu.</p>
<p class="nhan">Năm dòng</p>
<ul>
<li><strong>1 — Networking Today</strong>, buổi 1–2: thành phần, tô-pô, các loại mạng, xu hướng, mối đe doạ. Được tô sáng: bạn đang ở đây.</li>
<li><strong>2 — Cấu hình switch và thiết bị đầu cuối</strong>, buổi 3–6: vào được thiết bị và cấu hình nó, kèm Lab 1.1.</li>
<li><strong>3 — Giao thức và mô hình</strong>, buổi 7–10: OSI, TCP/IP, đóng gói.</li>
<li><strong>4 — Tầng vật lý</strong>, buổi 11–14: cáp đồng, cáp quang, không dây.</li>
<li><strong>5 trở đi — Tầng liên kết dữ liệu, Ethernet, tầng mạng</strong>, buổi 15–22: frame, MAC, gói IP.</li>
</ul>
<div class="note-ct"><strong>Một lỗ hổng cần biết ngay từ bây giờ.</strong> Số chương của trường lệch một đơn vị so với số module của Cisco kể từ Chương 5, và <strong>Cisco Module 5 (Number Systems) không được xếp buổi nào cả</strong> — trong khi buổi 30–33 dạy chia subnet thì không thể làm nếu không đọc được nhị phân. Trên web này có một chương bổ sung dạy phần đó, đặt trước chương IPv4 Addressing.</div>`],
    ]),

    bi(
      `<h3>A worked example: the four commands, in order</h3>
<p>The answer to the opening question. Each command removes a whole class of causes, so the order matters more than the commands.</p>
<pre><code class="language-bash">ip addr show          # 1. do I have an address, and is it the one I expect?
ip route show         # 2. do I have a way out, and is the gateway local to me?
ping 192.168.1.1      # 3. can I reach the gateway? (layer 1-2-3 inside my own network)
ping 1.1.1.1          # 4. can I reach the outside by ADDRESS? (routing beyond my network)</code></pre>
<p>Then, and only then, a fifth if all four passed:</p>
<pre><code class="language-bash">ping google.com       # 5. by NAME. If 4 worked and 5 fails, it is DNS.</code></pre>

<div class="callout ok"><strong>🔍 How to check it yourself — the decision table</strong>
<ul>
<li><strong>1 fails</strong> (no inet line, or a <code>169.254.</code> address): the fault is local — cable, interface down, or DHCP never answered. Nothing beyond this point is worth testing yet.</li>
<li><strong>1 passes, 2 fails</strong> (no <code>default via</code> line): your LAN will work and everything outside will not. This is the classic "the internet is down" that is actually one missing setting on one machine.</li>
<li><strong>2 passes, 3 fails</strong>: you and the gateway cannot talk. Suspect the wrong gateway address, the wrong mask, a VLAN mismatch, or the switch port.</li>
<li><strong>3 passes, 4 fails</strong>: your side is healthy and the problem is upstream. <code>traceroute</code> now tells you which hop, and you have the evidence to escalate.</li>
<li><strong>4 passes, 5 fails</strong>: the network is fine. It is <strong>DNS</strong>. Check the DNS server your machine was given.</li>
<li><strong>All five pass but the application still fails</strong>: the network has done its job; the problem is the application or a firewall rule on a specific port. That is Module 14 territory.</li>
</ul></div>

<div class="pitfall co-tieu-de"><strong>Trap 1 — starting at step 5.</strong> Symptom: you ping a website name, it fails, and you spend twenty minutes on DNS while the real cause is an unplugged cable. Always start at 1.
<p><strong>Trap 2 — accepting an AI answer that you did not predict.</strong> Symptom: you paste a configuration, it "works", and a week later you cannot explain to anybody why a port is shut. Step 3 of slide 15 exists to prevent exactly this.</p>
<p><strong>Trap 3 — testing a fix on the live device.</strong> Symptom: you try a suggested command on the switch everybody is using, it drops every session, and now you are troubleshooting two problems instead of one. Packet Tracer is free and costs nothing when it goes wrong.</p>
<p><strong>Trap 4 — believing netacad progress is optional.</strong> Symptom: the term ends, every class was attended, and the student is refused the final exam because assignments on netacad.com are below 75%. It is a hard requirement in the syllabus, not a suggestion.</p></div>

<h3>Exercise</h3>
<p><strong>(a)</strong> A user says "the internet is down". You run the four commands and get: address 192.168.1.47/24, <code>default via 192.168.1.1</code>, ping to 192.168.1.1 succeeds, ping to 1.1.1.1 gives 100% loss. Name the two most likely causes and the one extra command that separates them.</p>
<p><strong>(b)</strong> An AI assistant tells you to type <code>interface vlan1/0</code> on a Catalyst 2960 to set a management address. Without touching a device, give two reasons to doubt it, then give the command that settles the question on the device itself.</p>

<div class="dap-an"><strong>Solution (a).</strong> Everything inside the LAN is healthy, so the fault is at or beyond the gateway. The two likely causes are (i) the router's own uplink to the ISP is down, and (ii) the router is up but has no route or its NAT is broken. The extra command is <code>traceroute 1.1.1.1</code>: if it shows <em>one</em> hop (your gateway) and then stars, the router received the packet and could not forward it — cause (ii), inside your control. If it shows several hops and then stars, the packet left your building and died upstream — cause (i), the ISP. One command, two completely different phone calls.
<p><strong>Solution (b).</strong> Two reasons to doubt it: first, Cisco interface naming uses <em>slot/port</em> for physical interfaces and a plain number for an SVI, so a management interface is <code>interface vlan 1</code> — <code>vlan1/0</code> mixes the two conventions and belongs to neither; second, a Layer 2 Catalyst has exactly one active SVI by default and it is VLAN 1, so a second number would need the VLAN to exist first. The command that settles it: <code>interface vlan ?</code> in global configuration mode — IOS prints the range it will accept, and no assistant can argue with that.</p></div>

<h3>Chapter 1 checklist — tick these before Chapter 2</h3>
<ul>
<li>I can classify any device as end device, intermediary or media.</li>
<li>I can say what a mask does and why two hosts on one switch can be unable to talk.</li>
<li>I can name the four properties of a reliable network and a symptom for each.</li>
<li>I can run four commands in order and say where a fault is.</li>
<li>I can explain why <code>ping 1.1.1.1</code> succeeding while a name fails means DNS.</li>
</ul>`,

      `<h3>Ví dụ đi hết: bốn câu lệnh, theo đúng thứ tự</h3>
<p>Đây là lời giải cho câu hỏi mở đầu. Mỗi lệnh loại bỏ nguyên một nhóm nguyên nhân, nên thứ tự quan trọng hơn bản thân các lệnh.</p>
<pre><code class="language-bash">ip addr show          # 1. tôi có địa chỉ chưa, và có đúng cái tôi mong đợi không?
ip route show         # 2. tôi có lối ra chưa, và gateway có cùng mạng với tôi không?
ping 192.168.1.1      # 3. tôi tới được gateway không? (tầng 1-2-3 trong mạng của tôi)
ping 1.1.1.1          # 4. tôi ra ngoài bằng ĐỊA CHỈ được không? (định tuyến ra khỏi mạng)</code></pre>
<p>Và chỉ khi cả bốn bước trên đều đạt mới tới lệnh thứ năm:</p>
<pre><code class="language-bash">ping google.com       # 5. bang TEN. Neu 4 chay ma 5 hong thi do la DNS.</code></pre>

<div class="callout ok"><strong>🔍 Cách tự kiểm — bảng ra quyết định</strong>
<ul>
<li><strong>Bước 1 hỏng</strong> (không có dòng inet, hoặc địa chỉ <code>169.254.</code>): sự cố nằm tại chỗ — cáp, interface down, hoặc DHCP không trả lời. Mọi thứ sau đó chưa đáng kiểm.</li>
<li><strong>1 đạt, 2 hỏng</strong> (không có dòng <code>default via</code>): LAN của bạn chạy và mọi thứ bên ngoài thì không. Đây đúng là cái "mất internet" kinh điển mà thực ra chỉ là thiếu một thiết lập trên một cái máy.</li>
<li><strong>2 đạt, 3 hỏng</strong>: bạn và gateway không nói chuyện được. Nghi ngờ sai địa chỉ gateway, sai mặt nạ, lệch VLAN, hoặc cổng switch.</li>
<li><strong>3 đạt, 4 hỏng</strong>: phía bạn khoẻ mạnh và sự cố nằm ở thượng nguồn. Lúc này <code>traceroute</code> chỉ ra chặng nào, và bạn có bằng chứng để báo lên.</li>
<li><strong>4 đạt, 5 hỏng</strong>: mạng hoàn toàn tốt. Đó là <strong>DNS</strong>. Hãy kiểm máy chủ DNS mà máy bạn được cấp.</li>
<li><strong>Cả năm đều đạt mà ứng dụng vẫn hỏng</strong>: mạng đã làm xong phần việc của nó; vấn đề nằm ở ứng dụng hoặc một luật tường lửa trên một cổng cụ thể. Đó là địa hạt của Module 14.</li>
</ul></div>

<div class="pitfall co-tieu-de"><strong>Bẫy 1 — bắt đầu từ bước 5.</strong> Triệu chứng: bạn ping tên một website, hỏng, rồi ngồi hai mươi phút với DNS trong khi nguyên nhân thật là một sợi cáp tuột. Luôn luôn bắt đầu từ bước 1.
<p><strong>Bẫy 2 — chấp nhận câu trả lời của AI mà bạn không hề dự đoán trước.</strong> Triệu chứng: bạn dán một đoạn cấu hình, nó "chạy", và một tuần sau bạn không giải thích nổi cho ai vì sao một cổng đang bị tắt. Bước 3 của slide 15 sinh ra đúng để chặn chuyện này.</p>
<p><strong>Bẫy 3 — thử bản vá ngay trên thiết bị đang chạy.</strong> Triệu chứng: bạn thử một lệnh được gợi ý trên cái switch cả nhà đang dùng, nó rớt hết mọi phiên, và bây giờ bạn phải xử lý hai sự cố thay vì một. Packet Tracer miễn phí và hỏng thì chẳng mất gì.</p>
<p><strong>Bẫy 4 — tưởng tiến độ netacad là tuỳ chọn.</strong> Triệu chứng: hết kỳ, đi học đủ mọi buổi, rồi bị từ chối thi cuối kỳ vì bài trên netacad.com chưa đạt 75%. Đây là điều kiện cứng trong syllabus, không phải lời khuyên.</p></div>

<h3>Bài tập</h3>
<p><strong>(a)</strong> Một người dùng báo "mất internet". Bạn chạy bốn lệnh và nhận được: địa chỉ 192.168.1.47/24, có <code>default via 192.168.1.1</code>, ping 192.168.1.1 thành công, ping 1.1.1.1 mất 100% gói. Hãy nêu hai nguyên nhân khả dĩ nhất và MỘT lệnh phụ để tách hai nguyên nhân đó ra.</p>
<p><strong>(b)</strong> Một trợ lý AI bảo bạn gõ <code>interface vlan1/0</code> trên Catalyst 2960 để đặt địa chỉ quản trị. Chưa đụng vào thiết bị, hãy nêu hai lý do để nghi ngờ, rồi nêu câu lệnh phân xử dứt điểm ngay trên chính thiết bị.</p>

<div class="dap-an"><strong>Lời giải (a).</strong> Mọi thứ bên trong LAN đều khoẻ, nên sự cố nằm TẠI gateway hoặc XA hơn. Hai nguyên nhân khả dĩ là (i) đường lên ISP của router đang chết, và (ii) router vẫn sống nhưng thiếu route hoặc NAT hỏng. Lệnh phụ là <code>traceroute 1.1.1.1</code>: nếu nó hiện <em>một</em> chặng (chính gateway của bạn) rồi toàn dấu sao, thì router đã NHẬN được gói mà không chuyển tiếp nổi — nguyên nhân (ii), nằm trong tầm tay bạn. Nếu nó hiện vài chặng rồi mới toàn dấu sao, gói đã rời khỏi toà nhà và chết ở thượng nguồn — nguyên nhân (i), thuộc về nhà mạng. Một câu lệnh, hai cuộc điện thoại hoàn toàn khác nhau.
<p><strong>Lời giải (b).</strong> Hai lý do để nghi ngờ: thứ nhất, cách đặt tên interface của Cisco dùng <em>slot/port</em> cho interface vật lý và một con số trần cho SVI, nên interface quản trị phải là <code>interface vlan 1</code> — <code>vlan1/0</code> trộn hai quy ước và không thuộc về quy ước nào; thứ hai, một Catalyst tầng 2 mặc định chỉ có đúng một SVI hoạt động và đó là VLAN 1, nên muốn có số thứ hai thì VLAN đó phải tồn tại trước đã. Câu lệnh phân xử: gõ <code>interface vlan ?</code> ở chế độ global config — IOS in ra đúng dải nó chấp nhận, và không trợ lý nào cãi lại được điều đó.</p></div>

<h3>Danh sách tự chấm Chương 1 — tích đủ rồi hãy sang Chương 2</h3>
<ul>
<li>Tôi xếp loại được mọi thiết bị là đầu cuối, trung gian hay môi trường truyền.</li>
<li>Tôi nói được mặt nạ làm gì và vì sao hai máy cắm chung một switch vẫn có thể không nói chuyện được.</li>
<li>Tôi kể được bốn tính chất của mạng tin cậy kèm một triệu chứng cho từng cái.</li>
<li>Tôi chạy được bốn lệnh theo đúng thứ tự và nói được sự cố nằm ở đâu.</li>
<li>Tôi giải thích được vì sao <code>ping 1.1.1.1</code> chạy mà ping tên hỏng thì đó là DNS.</li>
</ul>`,
    ),
  ].join('\n'),
};

/* ════════════════════════════════════════════════════════════════════════════
   Quiz Chương 1 — 10 câu song ngữ, có explanation
   ════════════════════════════════════════════════════════════════════════════ */
const QUIZ1 = {
  title: 'Quiz — Chapter 1: Networking Today|||Quiz — Chương 1: Mạng máy tính hôm nay',
  slug: 'nwc204-ch1-quiz',
  type: 'QUIZ',
  description: '10 câu song ngữ cho buổi 1–2: thành phần, tô-pô vật lý/logic, loại mạng, kết nối Internet, băng thông vs độ trễ, bốn tính chất mạng tin cậy, mối đe doạ, và cách tự chẩn đoán. Mỗi câu có giải thích.',
  quiz: {
    timeLimitSeconds: 600,
    questions: [
      {
        id: 'q1',
        question: 'A switch and a router are both intermediary devices. What is the one difference that matters?|||Switch và router đều là thiết bị trung gian. Khác biệt DUY NHẤT thật sự quan trọng là gì?',
        options: [
          'A switch is faster than a router|||Switch nhanh hơn router',
          'A switch forwards using MAC addresses inside one network; a router forwards using IP between different networks|||Switch chuyển tiếp theo MAC bên trong một mạng; router chuyển tiếp theo IP giữa các mạng khác nhau',
          'A router has more ports|||Router có nhiều cổng hơn',
          'A switch needs an IP address to forward frames|||Switch cần có địa chỉ IP thì mới chuyển được frame',
        ],
        correctIndex: 1,
        explanation: 'Slide 3 and 8: the switch is Layer 2 and keeps a MAC address table for one network; the router is Layer 3 and is the only device that knows how to leave it. Speed and port count vary by model and prove nothing, and a Layer 2 switch forwards frames perfectly well with no IP address at all — it only needs one to be managed.|||Slide 3 và 8: switch ở tầng 2 và giữ bảng MAC cho MỘT mạng; router ở tầng 3 và là thiết bị duy nhất biết cách đi ra khỏi mạng đó. Tốc độ và số cổng tuỳ model nên không chứng minh gì, còn switch tầng 2 chuyển frame ngon lành mà không cần IP nào — nó chỉ cần IP để được QUẢN TRỊ.',
      },
      {
        id: 'q2',
        question: 'Two PCs are plugged into the same switch. PC-A is 192.168.1.10/24 and PC-B is 192.168.2.10/24. Both link lights are green. What happens when A pings B?|||Hai PC cắm chung một switch. PC-A là 192.168.1.10/24 và PC-B là 192.168.2.10/24. Cả hai đèn link đều xanh. Chuyện gì xảy ra khi A ping B?',
        options: [
          'It works, because they share a switch|||Chạy được, vì chúng chung một switch',
          'It works, but slowly|||Chạy được, nhưng chậm',
          'It fails: A decides B is not local and hands the packet to a default gateway it does not have|||Hỏng: A phán B không nội bộ nên giao gói cho default gateway mà nó không có',
          'The switch converts between the two networks automatically|||Switch tự động chuyển đổi giữa hai mạng',
        ],
        correctIndex: 2,
        explanation: 'This is the worked example of lesson 1.1. With a /24 mask the third octet decides the network, so 192.168.1.0 and 192.168.2.0 are different networks. A never puts the packet on the wire because it has no gateway. A switch has no concept of networks and converts nothing — that is a router job.|||Đây đúng là ví dụ đã giải ở bài 1.1. Với mặt nạ /24 thì octet thứ ba quyết định mạng, nên 192.168.1.0 và 192.168.2.0 là hai mạng khác nhau. A thậm chí không đẩy gói ra dây vì nó không có gateway. Switch không có khái niệm "mạng" và không chuyển đổi gì cả — đó là việc của router.',
      },
      {
        id: 'q3',
        question: 'Which statement about physical and logical topology is TRUE?|||Câu nào về tô-pô vật lý và tô-pô logic là ĐÚNG?',
        options: [
          'They are two names for the same diagram|||Hai tên gọi của cùng một sơ đồ',
          'The physical topology tells you which addresses can talk|||Tô-pô vật lý cho biết địa chỉ nào nói chuyện được với địa chỉ nào',
          'Two devices can be one cable apart physically and still be in different logical networks|||Hai thiết bị cách nhau đúng một sợi cáp về mặt vật lý vẫn có thể nằm ở hai mạng logic khác nhau',
          'The logical topology changes when you move a cable|||Tô-pô logic thay đổi khi bạn cắm lại một sợi cáp',
        ],
        correctIndex: 2,
        explanation: 'Slide 7, the warning box. Physical answers "which port is this plugged into", logical answers "same network or different". Moving a cable changes the physical topology; the logical one changes when addresses, masks or VLANs change.|||Slide 7, ô cảnh báo. Tô-pô vật lý trả lời "cái này cắm vào cổng nào", tô-pô logic trả lời "cùng mạng hay khác mạng". Cắm lại cáp là đổi tô-pô VẬT LÝ; tô-pô logic chỉ đổi khi địa chỉ, mặt nạ hoặc VLAN đổi.',
      },
      {
        id: 'q4',
        question: 'Why is the Internet not simply "a very large LAN"?|||Vì sao Internet không đơn giản là "một cái LAN rất to"?',
        options: [
          'Because it uses fibre instead of copper|||Vì nó dùng cáp quang thay cho cáp đồng',
          'Because it is a network of independently owned networks that agreed on IP addressing and on how to hand traffic over|||Vì nó là mạng của các mạng thuộc sở hữu độc lập, đã thống nhất cách đánh địa chỉ IP và cách trao lưu lượng cho nhau',
          'Because it has no switches|||Vì nó không có switch nào',
          'Because a LAN cannot have more than 254 hosts|||Vì một LAN không thể có quá 254 host',
        ],
        correctIndex: 1,
        explanation: 'Slide 8 and CQ1.1. Ownership is the point: a LAN has one owner, the Internet has none, so it is held together by agreement (IP, and BGP between organisations) rather than by administration. Media type is irrelevant, the Internet is full of switches, and a LAN can be far larger than 254 hosts.|||Slide 8 và CQ1.1. Quyền sở hữu mới là mấu chốt: LAN có MỘT chủ, Internet không có chủ nào, nên nó gắn với nhau bằng THOẢ THUẬN (IP, và BGP giữa các tổ chức) chứ không bằng quản trị. Loại cáp không liên quan, Internet đầy switch, và một LAN hoàn toàn có thể lớn hơn 254 host.',
      },
      {
        id: 'q5',
        question: 'A user has a 1 Gbps link. File downloads are fast, but video calls freeze. Which measurement will show the cause?|||Người dùng có đường 1 Gbps. Tải file thì nhanh, nhưng gọi video cứ đứng hình. Phép đo nào cho thấy nguyên nhân?',
        options: [
          'A speed test measuring throughput|||Một lần speed test đo thông lượng',
          'The bandwidth written in the contract|||Băng thông ghi trong hợp đồng',
          'The max and mdev (jitter) values of a long ping|||Giá trị max và mdev (jitter) của một lần ping dài',
          'The number of hops in traceroute|||Số chặng trong traceroute',
        ],
        correctIndex: 2,
        explanation: 'Slide 10 and the worked example of lesson 1.2. Downloads are fine, so throughput is fine, and a speed test would just confirm the contract. A conversation is destroyed by variable delay, which only shows up as a large max and a large mdev. Hop count says nothing about jitter.|||Slide 10 và ví dụ đã giải ở bài 1.2. Tải file vẫn tốt nghĩa là thông lượng vẫn tốt, và speed test chỉ xác nhận lại hợp đồng. Cuộc nói chuyện bị phá bởi độ trễ BIẾN THIÊN, thứ chỉ lộ ra ở max lớn và mdev lớn. Số chặng không nói gì về jitter.',
      },
      {
        id: 'q6',
        question: 'A backup job every night makes the phone system unusable. Which property of a reliable network is missing?|||Một job sao lưu chạy mỗi đêm làm hệ thống điện thoại không dùng được. Mạng đang thiếu tính chất nào của một mạng tin cậy?',
        options: [
          'Fault tolerance|||Chịu lỗi',
          'Scalability|||Khả năng mở rộng',
          'Quality of Service|||Chất lượng dịch vụ (QoS)',
          'Security|||An toàn',
        ],
        correctIndex: 2,
        explanation: 'Slide 11. QoS is exactly the property that gives voice and video priority over a file copy, because a copy does not care about delay and a conversation does. Nothing has failed (so not fault tolerance), nothing has grown (not scalability) and nobody is attacking (not security).|||Slide 11. QoS đúng là tính chất cho thoại và video được ưu tiên hơn việc copy file, vì copy file không quan tâm độ trễ còn cuộc nói chuyện thì có. Không có gì hỏng (nên không phải chịu lỗi), không có gì phình to (không phải mở rộng) và không ai tấn công (không phải an toàn).',
      },
      {
        id: 'q7',
        question: 'Why does a cable (coaxial) Internet connection slow down in the evening while fibre to the home usually does not?|||Vì sao kết nối Internet qua cáp đồng trục chậm lại vào buổi tối còn cáp quang tới nhà thì thường không?',
        options: [
          'Coaxial cable is affected by temperature|||Cáp đồng trục bị ảnh hưởng bởi nhiệt độ',
          'The last mile of cable is shared with the neighbourhood, so queues fill when everyone is home|||Chặng cuối của cable chia chung với cả khu, nên hàng đợi đầy lên khi mọi người đều ở nhà',
          'Fibre has unlimited bandwidth|||Cáp quang có băng thông vô hạn',
          'Cable providers throttle customers at night|||Nhà mạng cable bóp băng thông khách hàng vào ban đêm',
        ],
        correctIndex: 1,
        explanation: 'Slide 9 marks cable as shared and fibre as not shared at the last mile. Sharing is a design property, not throttling or a fault, and fibre bandwidth is large but certainly not unlimited. This is also the answer to exercise (a) in lesson 1.2.|||Slide 9 đánh dấu cable là chia chung còn cáp quang thì không chia chung ở chặng cuối. Chia chung là một đặc tính THIẾT KẾ, không phải bóp băng thông hay sự cố, và băng thông cáp quang lớn chứ chắc chắn không vô hạn. Đây cũng là đáp án bài tập (a) của bài 1.2.',
      },
      {
        id: 'q8',
        question: 'Why is "we have a firewall, so we are secure" wrong?|||Vì sao câu "công ty có tường lửa rồi nên an toàn" là sai?',
        options: [
          'Firewalls are obsolete|||Tường lửa đã lỗi thời',
          'A firewall guards the edge, so threats that arrive inside it (BYOD laptops, zero-days, stolen credentials) walk past it — no single control covers every threat|||Tường lửa canh ở BIÊN, nên mối đe doạ đi vào từ bên trong (laptop BYOD, zero-day, mật khẩu bị trộm) đi thẳng qua nó — không biện pháp đơn lẻ nào phủ hết mọi mối đe doạ',
          'Firewalls only work on wireless networks|||Tường lửa chỉ hoạt động trên mạng không dây',
          'A firewall must be replaced by a VPN|||Tường lửa phải được thay bằng VPN',
        ],
        correctIndex: 1,
        explanation: 'Slide 13 pairs six threats with six layered answers, and the note names the principle: defence in depth. The point is not that firewalls are bad but that the threat list is longer than what any one control can cover — BYOD in particular (slide 12) arrives already inside the perimeter.|||Slide 13 ghép sáu mối đe doạ với sáu lớp phòng thủ, và dòng ghi chú gọi tên nguyên tắc: phòng thủ nhiều lớp. Ý không phải tường lửa dở, mà là danh sách mối đe doạ dài hơn khả năng phủ của bất kỳ biện pháp đơn lẻ nào — riêng BYOD (slide 12) đi vào khi đã ở sẵn bên trong vành đai.',
      },
      {
        id: 'q9',
        question: 'ping 1.1.1.1 succeeds but ping google.com fails. What is broken?|||ping 1.1.1.1 thành công nhưng ping google.com hỏng. Cái gì đang hỏng?',
        options: [
          'The cable|||Sợi cáp',
          'The default gateway|||Default gateway',
          'Name resolution — DNS. The network itself is working|||Phân giải tên — DNS. Bản thân mạng vẫn đang chạy tốt',
          'The subnet mask|||Mặt nạ mạng',
        ],
        correctIndex: 2,
        explanation: 'Slide 16, the green box. Reaching an address proves layers 1 to 3 and the routing beyond your network all work; only the name-to-address step is left, and that is DNS. If the cable, gateway or mask were wrong, the ping by address would have failed too.|||Slide 16, ô xanh. Tới được một ĐỊA CHỈ đã chứng minh tầng 1 đến 3 và cả phần định tuyến ra ngoài mạng đều chạy; chỉ còn bước đổi tên thành địa chỉ, và đó là DNS. Nếu cáp, gateway hay mặt nạ sai thì ping bằng địa chỉ cũng đã hỏng rồi.',
      },
      {
        id: 'q10',
        question: 'An AI assistant proposes a configuration. According to the five-step method on slide 15, what must you do BEFORE running it?|||Một trợ lý AI đề xuất một đoạn cấu hình. Theo quy trình năm bước ở slide 15, bạn phải làm gì TRƯỚC khi chạy nó?',
        options: [
          'Nothing — run it and see|||Không cần gì — cứ chạy rồi xem',
          'Write down what the show command should print if the answer is right, then run it on Packet Tracer or a lab device first|||Ghi ra trước là lệnh show phải in ra cái gì nếu câu trả lời đúng, rồi chạy thử trên Packet Tracer hoặc thiết bị lab trước',
          'Ask a second AI for a second opinion|||Hỏi thêm một AI khác để lấy ý kiến thứ hai',
          'Save the running configuration first, then run it on production|||Lưu cấu hình đang chạy rồi chạy thẳng trên hệ thống thật',
        ],
        correctIndex: 1,
        explanation: 'Steps 3 and 4 of slide 15. Predicting the output is what turns the test into a real check: without a prediction you will accept whatever appears. A second AI adds a second opinion but no evidence, and saving the configuration does not undo an outage you caused on a live device.|||Bước 3 và 4 của slide 15. Dự đoán kết xuất mới là thứ biến phép thử thành phép KIỂM thật: không có dự đoán thì bạn sẽ chấp nhận bất cứ thứ gì hiện ra. Hỏi thêm một AI nữa chỉ thêm một ý kiến chứ không thêm bằng chứng, còn lưu cấu hình thì không gỡ lại được sự cố bạn vừa gây ra trên thiết bị đang chạy.',
      },
    ],
  },
};

export default [
  {
    title: 'Chapter 1 — Networking Today (sessions 1–2)|||Chương 1 — Mạng máy tính hôm nay (buổi 1–2)',
    slug: 'nwc204-chuong-1-networking-today',
    description: 'Cisco Module 1 theo đúng buổi 1–2 của FLM: mạng là gì và gồm những gì, tô-pô vật lý vs logic, SOHO/LAN/WAN/Internet, các kiểu kết nối Internet, băng thông vs độ trễ, bốn tính chất mạng tin cậy, xu hướng và mối đe doạ, nghề IT, dùng AI có kiểm chứng. Học theo từng slide, kèm cách tự kiểm bằng lệnh thật.',
    lessons: [L11, L12, L13, QUIZ1],
  },
];
