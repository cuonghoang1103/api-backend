/**
 * NWC204 · Chương 2 — Basic Switch and End Device Configuration
 * (Cisco Module 2 + Lab 1.1, FLM buổi 3–6).
 *
 * Nguồn: content/academy/_syllabus-flm/NWC204.json — buổi 3, 4, 5, 6, cùng bảng
 * cauHoiKienTao (CQ1.4 buổi 3, CQ2.1 buổi 4, CQ2.2 buổi 5; buổi 6 BỎ TRỐNG).
 *
 * Slide: scripts/slides-src/nwc204-ch02.mjs → 26 ảnh, deck `nwc204-ch02`.
 *   bài 2.1 = slide 1–8 · 2.2 = 9–14 · 2.3 = 15–18 · 2.4 = 19–22 · 2.5 = 23–26.
 * Slide do cuongthai.com tự dựng (FLM không đăng slide nào cho NWC204).
 *
 * ⚠️ File này KHÔNG tự gom vào NWC204.mjs — người điều phối gom.
 * ⚠️ lesson.content là String; KHÔNG backtick lồng, KHÔNG ${ } trong chuỗi.
 */
import { registerDeck, walk, walkHead, bi, cq } from './_slides.mjs';

const D = registerDeck('nwc204-ch02', {
  code: 'NWC204 Ch.2',
  en: 'Basic Switch and End Device Configuration',
  vi: 'Cấu hình switch và thiết bị đầu cuối',
  total: 26,
});

/* ════════════════════════════════════════════════════════════════════════════
   Bài 2.1 — buổi 3: 2.1 Cisco IOS Access · 2.2 IOS Navigation
   ════════════════════════════════════════════════════════════════════════════ */
const L21 = {
  title: '2.1 — Getting into a Cisco device: console, SSH, Telnet, and the IOS modes|||2.1 — Vào được thiết bị Cisco: console, SSH, Telnet và các chế độ IOS',
  slug: 'nwc204-2-1-vao-thiet-bi-console-ssh-va-che-do-ios',
  type: 'VIDEO',
  description: 'FLM buổi 3 (CLO2, CLO3, CLO9): ba đường vào thiết bị và vì sao console là đường duy nhất khi chưa có IP; SSH mã hoá còn Telnet gửi mật khẩu dạng chữ thô; cây chế độ IOS và dấu nhắc đổi ra sao; exit vs end vs Ctrl-Z. Kèm cách tự kiểm và 4 bẫy hay mắc.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 2 · Lesson 2.1 · FLM session 3 · CLO2, CLO3, CLO9</span>
<h2>Getting into a Cisco device — and knowing where you are once inside</h2>
<p class="lead">After this lesson you can open a session on a switch that has never been configured, recognise which IOS mode you are in from the prompt alone, and move between modes without guessing.</p>
<p class="nhan">Source: FLM · Syllabus 14520 · session 3 — "2. Basic Switch and End Device Configuration. 2.1 Cisco IOS Access. 2.2 IOS Navigation. 2.3 The Command Structure. 2.4 Basic Device Configuration"</p>

<div class="callout"><span class="badge">Opening question</span>
<p>A switch arrives in a box. It has no IP address, no password, no hostname. You have a laptop and a bag of cables, and no network to reach it over.</p>
<p><strong>How do you talk to it at all?</strong> And once you are in, how do you know whether the command you are about to type is even allowed?</p></div>

<h3>Every term, from zero</h3>
<ul>
<li><strong>IOS</strong> — Internetwork Operating System, the software running on Cisco switches and routers. It has no graphical interface; you type commands.</li>
<li><strong>Console port</strong> — a management socket on the device itself. It carries no user data and needs no IP address.</li>
<li><strong>Rollover cable</strong> — the light-blue cable whose wires are reversed end to end. It connects a laptop serial port to a console port and is used for nothing else.</li>
<li><strong>Terminal emulator</strong> — the program on your laptop that turns keystrokes into serial characters: Tera Term, PuTTY, or <code>screen</code>.</li>
<li><strong>Telnet</strong> — remote CLI access over TCP port 23, with no encryption of any kind.</li>
<li><strong>SSH</strong> — remote CLI access over TCP port 22, encrypted after a key exchange.</li>
<li><strong>User EXEC / privileged EXEC / global configuration</strong> — the three main IOS modes, each with its own prompt and its own list of allowed commands.</li>
<li><strong>Prompt</strong> — the text before your cursor. It names the device and the mode, and it is the only reliable way to know where you are.</li>
</ul>

<h3>The three doors, as a diagram</h3>
<pre><code class="language-mermaid">
flowchart LR
  L["Admin laptop"] -- "rollover cable&lt;br&gt;no IP needed" --> C["Console port"]
  L -- "TCP 22 - encrypted" --> V["vty lines&lt;br&gt;needs an IP"]
  L -. "TCP 23 - plaintext&lt;br&gt;do not use" .-> V
  C --> U["user EXEC &gt;"]
  V --> U
  U -- "enable secret" --> P["privileged EXEC #"]
</code></pre>
<p>Read the two arrows into <code>user EXEC</code>: every way in ends at the same place, so the password that matters is the one after it, not the ones before it.</p>

<h3>Why the design is like this</h3>
<p>Remote management is a chicken-and-egg problem: you cannot SSH to a device to give it an IP address, because SSH needs the IP address to already exist. The console port solves it by being physically separate from the network — it works on a device with no configuration at all, and it keeps working when the network is broken. That is why it is the first thing in Module 2 and the first thing in Lab 1.1.</p>
<p>The mode tree exists for a different reason: to make destructive commands harder to reach by accident. A visitor who finds an open console lands in user EXEC, where the worst they can do is look. Everything that changes the device sits behind <code>enable</code>, and everything that changes it <em>permanently</em> sits behind a second step again.</p>`,

      `<span class="eyebrow">NWC204 · Chương 2 · Bài 2.1 · FLM buổi 3 · CLO2, CLO3, CLO9</span>
<h2>Vào được thiết bị Cisco — và biết mình đang đứng ở đâu khi đã vào</h2>
<p class="lead">Học xong bài này bạn mở được phiên làm việc trên một cái switch chưa từng được cấu hình, nhìn dấu nhắc là biết mình đang ở chế độ IOS nào, và di chuyển giữa các chế độ mà không phải đoán.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 3 — "2. Basic Switch and End Device Configuration. 2.1 Cisco IOS Access. 2.2 IOS Navigation. 2.3 The Command Structure. 2.4 Basic Device Configuration"</p>

<div class="callout"><span class="badge">Câu hỏi mở đầu</span>
<p>Một cái switch vừa được bóc khỏi thùng. Nó không có địa chỉ IP, không mật khẩu, không tên. Bạn có một cái laptop và một túi cáp, và không có mạng nào để với tới nó.</p>
<p><strong>Làm sao nói chuyện được với nó?</strong> Và khi đã vào được rồi, làm sao biết câu lệnh sắp gõ có được phép hay không?</p></div>

<h3>Mọi thuật ngữ, từ số 0</h3>
<ul>
<li><strong>IOS</strong> — Internetwork Operating System, phần mềm chạy trên switch và router Cisco. Nó không có giao diện đồ hoạ; bạn gõ lệnh.</li>
<li><strong>Cổng console</strong> — một ổ cắm quản trị nằm trên chính thiết bị. Nó không mang dữ liệu người dùng và không cần địa chỉ IP.</li>
<li><strong>Cáp rollover</strong> — sợi cáp màu xanh nhạt có các sợi dây đảo ngược hai đầu. Nó nối cổng serial của laptop với cổng console, và không dùng cho việc gì khác.</li>
<li><strong>Phần mềm giả lập terminal</strong> — chương trình trên laptop biến phím bạn gõ thành ký tự serial: Tera Term, PuTTY, hoặc <code>screen</code>.</li>
<li><strong>Telnet</strong> — truy cập CLI từ xa qua cổng TCP 23, KHÔNG mã hoá bất cứ thứ gì.</li>
<li><strong>SSH</strong> — truy cập CLI từ xa qua cổng TCP 22, mã hoá sau khi trao đổi khoá.</li>
<li><strong>User EXEC / privileged EXEC / global configuration</strong> — ba chế độ chính của IOS, mỗi chế độ có dấu nhắc riêng và danh sách lệnh được phép riêng.</li>
<li><strong>Dấu nhắc (prompt)</strong> — đoạn chữ đứng trước con trỏ. Nó ghi tên thiết bị và chế độ, và là cách ĐÁNG TIN DUY NHẤT để biết bạn đang ở đâu.</li>
</ul>

<h3>Ba cánh cửa, vẽ thành sơ đồ</h3>
<pre><code class="language-mermaid">
flowchart LR
  L["Laptop quan tri"] -- "cap rollover&lt;br&gt;khong can IP" --> C["Cong console"]
  L -- "TCP 22 - ma hoa" --> V["Cac duong vty&lt;br&gt;can co IP"]
  L -. "TCP 23 - chu tho&lt;br&gt;dung dung" .-> V
  C --> U["user EXEC &gt;"]
  V --> U
  U -- "enable secret" --> P["privileged EXEC #"]
</code></pre>
<p>Hãy đọc hai mũi tên cùng đổ vào <code>user EXEC</code>: mọi lối vào đều kết thúc ở cùng một chỗ, nên mật khẩu đáng kể là mật khẩu đứng SAU nó, không phải mấy cái đứng trước.</p>

<h3>Vì sao thiết kế như vậy</h3>
<p>Quản trị từ xa là bài toán con gà - quả trứng: bạn không thể SSH vào thiết bị để đặt IP cho nó, vì SSH cần cái IP đó có sẵn rồi. Cổng console giải bài toán ấy bằng cách nằm TÁCH RỜI mạng về mặt vật lý — nó chạy trên thiết bị hoàn toàn chưa cấu hình, và vẫn chạy khi mạng đã hỏng. Đó là lý do nó là thứ đầu tiên của Module 2 và cũng là thứ đầu tiên của Lab 1.1.</p>
<p>Cây chế độ thì tồn tại vì một lý do khác: làm cho các lệnh phá hoại khó chạm tới một cách vô tình. Một người khách bắt gặp một phiên console đang mở sẽ rơi vào user EXEC, nơi điều tệ nhất họ làm được là NHÌN. Mọi thứ thay đổi thiết bị đều nằm sau <code>enable</code>, và mọi thứ thay đổi nó <em>vĩnh viễn</em> lại nằm sau thêm một bước nữa.</p>`,
    ),

    walkHead(D, 1, 8,
      'Slides 1–8 cover 2.1 Cisco IOS Access and 2.2 IOS Navigation, the first half of session 3.',
      'Slide 1–8 đi hết 2.1 Cisco IOS Access và 2.2 IOS Navigation, tức nửa đầu buổi 3.'),

    walk(D, [
      [1, 'Cover — Chapter 2, sessions 3–6',
        `<p class="y-chinh">🎯 Four sessions, and unlike Module 1 this one ends with a graded lab.</p>
<p class="nhan">What the cover tells you</p>
<ul>
<li><strong>Sessions 3–6 of 60</strong> — two theory sessions and two lab sessions.</li>
<li><strong>CLO2</strong> — apply Ethernet and switching concepts. <strong>CLO3</strong> — configure switches, routers and end devices with IP addressing and security settings.</li>
<li><strong>CLO9</strong> — use AI tools to configure, monitor and troubleshoot.</li>
<li>Session 3: 2.1 IOS Access, 2.2 IOS Navigation, 2.3 Command Structure, 2.4 Basic Device Configuration.</li>
<li>Session 4: 2.5 Save Configurations, 2.6 Ports and Addresses, 2.7 Configure IP Addressing, 2.8 Verify Connectivity.</li>
<li>Sessions 5–6: <strong>Lab 1.1</strong>, using Tera Term over a console connection. The Lab category is worth 20% of the course.</li>
</ul>`,
        `<p class="y-chinh">🎯 Bốn buổi, và khác Module 1, module này kết thúc bằng một bài lab có tính điểm.</p>
<p class="nhan">Slide bìa nói gì</p>
<ul>
<li><strong>Buổi 3–6 trong 60 buổi</strong> — hai buổi lý thuyết và hai buổi lab.</li>
<li><strong>CLO2</strong> — vận dụng khái niệm Ethernet và chuyển mạch. <strong>CLO3</strong> — cấu hình switch, router và thiết bị đầu cuối với địa chỉ IP và thiết lập bảo mật.</li>
<li><strong>CLO9</strong> — dùng công cụ AI để cấu hình, giám sát và xử lý sự cố.</li>
<li>Buổi 3: 2.1 IOS Access, 2.2 IOS Navigation, 2.3 Command Structure, 2.4 Basic Device Configuration.</li>
<li>Buổi 4: 2.5 Save Configurations, 2.6 Ports and Addresses, 2.7 Configure IP Addressing, 2.8 Verify Connectivity.</li>
<li>Buổi 5–6: <strong>Lab 1.1</strong>, dùng Tera Term qua kết nối console. Đầu điểm Lab chiếm 20% cả môn.</li>
</ul>`],

      [2, 'A switch out of the box already works — so why configure it?',
        `<p class="y-chinh">🎯 The diagram shows two PCs already pinging each other through an unconfigured switch. Everything that is missing is management, not forwarding.</p>
<p class="nhan">The four rows under the diagram</p>
<ul>
<li><strong>It works with zero configuration</strong> — a switch forwards frames by default. Nobody has to tell it anything.</li>
<li><strong>But you cannot reach the switch</strong> — no IP address means no SSH, no Telnet, no monitoring, no log collection.</li>
<li><strong>Anyone who can plug in gets full control</strong> through the console port, because no password is set.</li>
<li><strong>Nothing is named</strong> — twelve identical prompts saying <em>Switch&gt;</em> is exactly how people configure the wrong device.</li>
</ul>
<p>The closing box is the sentence to carry into the lab: configuration is not what makes a switch forward; it is what makes the switch <strong>manageable, identifiable and safe</strong>.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ cho thấy hai PC đã ping được nhau qua một cái switch chưa cấu hình gì. Mọi thứ đang thiếu đều thuộc về QUẢN TRỊ, không phải chuyển tiếp.</p>
<p class="nhan">Bốn dòng dưới sơ đồ</p>
<ul>
<li><strong>Không cấu hình gì nó vẫn chạy</strong> — switch mặc định đã chuyển frame. Không ai phải bảo nó điều gì.</li>
<li><strong>Nhưng bạn không với tới được cái switch</strong> — không có IP nghĩa là không SSH, không Telnet, không giám sát, không thu log.</li>
<li><strong>Ai cắm được cáp là có toàn quyền</strong> qua cổng console, vì chưa đặt mật khẩu nào.</li>
<li><strong>Không cái nào có tên</strong> — mười hai dấu nhắc giống hệt nhau cùng ghi <em>Switch&gt;</em> chính là cách người ta cấu hình nhầm thiết bị.</li>
</ul>
<p>Ô kết là câu cần mang theo vào lab: cấu hình không phải thứ làm switch chuyển frame được; nó là thứ làm switch <strong>quản trị được, nhận diện được và an toàn</strong>.</p>`],

      [3, '2.1 — Three ways into a Cisco device',
        `<p class="y-chinh">🎯 Two diagrams and a table. The highlighted row is the one that saves you when everything else has failed.</p>
<p class="nhan">Console — needs no network</p>
<ul>
<li>Laptop to console port, over a rollover or USB console cable. There is no IP address anywhere in this picture.</li>
<li>Use it for the first-ever setup, and any time the network itself is the thing that is broken.</li>
</ul>
<p class="nhan">SSH and Telnet — need a network</p>
<ul>
<li>Both go over the IP network to an address the device must already have. SSH is TCP 22 and encrypted; Telnet is TCP 23 and is not.</li>
<li>SSH is what you use every day. Telnet appears in labs and in exam questions as the wrong answer.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>The chicken-and-egg point.</strong> You cannot use SSH to give a device its first IP address. That is not a rule someone invented — it is arithmetic, and it is why the console port still exists on hardware sold today.</div>`,
        `<p class="y-chinh">🎯 Hai sơ đồ và một cái bảng. Dòng được tô sáng chính là dòng cứu bạn khi mọi thứ khác đã hỏng.</p>
<p class="nhan">Console — không cần mạng</p>
<ul>
<li>Laptop nối thẳng vào cổng console, bằng cáp rollover hoặc cáp USB console. Trong bức tranh này không có địa chỉ IP ở bất cứ đâu.</li>
<li>Dùng nó cho lần cấu hình đầu tiên, và bất cứ khi nào chính cái mạng mới là thứ đang hỏng.</li>
</ul>
<p class="nhan">SSH và Telnet — cần có mạng</p>
<ul>
<li>Cả hai đều đi qua mạng IP tới một địa chỉ mà thiết bị PHẢI có sẵn. SSH là TCP 22 và có mã hoá; Telnet là TCP 23 và không.</li>
<li>SSH là thứ bạn dùng hằng ngày. Telnet chỉ xuất hiện trong lab và trong đề thi với vai trò đáp án SAI.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Ý con gà - quả trứng.</strong> Bạn KHÔNG thể dùng SSH để cấp địa chỉ IP đầu tiên cho một thiết bị. Đây không phải quy định ai đó nghĩ ra — đó là số học, và là lý do cổng console vẫn còn trên phần cứng bán ra hôm nay.</div>`],

      [4, 'The console connection, in detail',
        `<p class="y-chinh">🎯 Four settings you must memorise, and a terminal block proving you need no special software on macOS or Linux.</p>
<p class="nhan">What the four rows say</p>
<ul>
<li><strong>Cable</strong> — light-blue rollover into a DB-9 serial adapter, or a single USB console cable.</li>
<li><strong>On the laptop</strong> — it appears as a COM port on Windows, or <code>/dev/tty.usbserial*</code> on macOS and Linux.</li>
<li><strong>Software</strong> — Tera Term (the one the FLM lab names), PuTTY, or <code>screen</code>.</li>
<li><strong>Settings</strong> — <strong>9600</strong> baud, <strong>8</strong> data bits, <strong>no</strong> parity, <strong>1</strong> stop bit, <strong>no</strong> flow control. Written "9600 8N1".</li>
</ul>
<p class="nhan">The two failure symptoms in the warning box</p>
<ul>
<li>Wrong baud rate gives <strong>garbage characters</strong>, not an error message. The session is connected; you just cannot read it.</li>
<li>A silent black screen usually means everything is fine and you have not pressed Enter — the switch only echoes when it has something to say.</li>
</ul>`,
        `<p class="y-chinh">🎯 Bốn thông số phải thuộc lòng, và một khối terminal chứng minh trên macOS hay Linux bạn không cần phần mềm đặc biệt nào.</p>
<p class="nhan">Bốn dòng nói gì</p>
<ul>
<li><strong>Cáp</strong> — rollover xanh nhạt cắm vào đầu chuyển DB-9, hoặc một sợi cáp USB console duy nhất.</li>
<li><strong>Trên laptop</strong> — nó hiện ra là một cổng COM trên Windows, hoặc <code>/dev/tty.usbserial*</code> trên macOS và Linux.</li>
<li><strong>Phần mềm</strong> — Tera Term (đúng cái mà lab của FLM nêu tên), PuTTY, hoặc <code>screen</code>.</li>
<li><strong>Thông số</strong> — <strong>9600</strong> baud, <strong>8</strong> bit dữ liệu, <strong>không</strong> chẵn lẻ, <strong>1</strong> bit dừng, <strong>không</strong> điều khiển luồng. Viết tắt là "9600 8N1".</li>
</ul>
<p class="nhan">Hai triệu chứng hỏng trong ô cảnh báo</p>
<ul>
<li>Sai tốc độ baud cho ra <strong>ký tự rác</strong>, không có thông báo lỗi nào. Phiên vẫn kết nối; chỉ là bạn không đọc được.</li>
<li>Màn hình đen im lặng thường nghĩa là mọi thứ vẫn tốt và bạn chưa bấm Enter — switch chỉ trả chữ về khi nó có gì để nói.</li>
</ul>`],

      [5, 'SSH and Telnet, as seen on the wire',
        `<p class="y-chinh">🎯 The same login, drawn twice. On the left every character is readable; on the right nothing is.</p>
<p class="nhan">Telnet, TCP 23</p>
<ul>
<li>The username travels as readable text. So does the password, on the very next line.</li>
<li>Anyone on a shared segment, or on a mirrored switch port, reads both in Wireshark with no effort and no tools beyond the free ones.</li>
</ul>
<p class="nhan">SSH, TCP 22</p>
<ul>
<li>A key exchange happens first and agrees a session key.</li>
<li>Everything after that is ciphertext. An observer sees that a session exists and nothing about its contents.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>The instruction in the warning box is stronger than a preference.</strong> Telnet does not "hide" the password badly — it never encrypts anything at all. Configure SSH and then <em>remove</em> Telnet with <code>transport input ssh</code>. Leaving Telnet enabled "just in case" means the weakest door is still open.</div>`,
        `<p class="y-chinh">🎯 Cùng một lần đăng nhập, vẽ hai lần. Bên trái mọi ký tự đều đọc được; bên phải thì không có gì đọc được.</p>
<p class="nhan">Telnet, TCP 23</p>
<ul>
<li>Tên đăng nhập đi trên đường dưới dạng chữ đọc được. Mật khẩu cũng vậy, ngay dòng kế tiếp.</li>
<li>Bất kỳ ai trên cùng đoạn mạng dùng chung, hoặc trên một cổng switch được mirror, đều đọc được cả hai bằng Wireshark, không tốn công và không cần công cụ nào ngoài đồ miễn phí.</li>
</ul>
<p class="nhan">SSH, TCP 22</p>
<ul>
<li>Việc trao đổi khoá diễn ra trước và thống nhất một khoá phiên.</li>
<li>Mọi thứ sau đó là bản mã. Người quan sát chỉ thấy có một phiên đang tồn tại và không thấy gì về nội dung.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Chỉ dẫn trong ô cảnh báo mạnh hơn một lời khuyên chọn lựa.</strong> Telnet không phải "giấu mật khẩu dở" — nó KHÔNG hề mã hoá bất cứ thứ gì. Hãy cấu hình SSH rồi <em>gỡ</em> Telnet bằng <code>transport input ssh</code>. Để Telnet bật "phòng khi cần" nghĩa là cánh cửa yếu nhất vẫn đang mở.</div>`],

      [6, '2.2 — The IOS mode tree: position decides permission',
        `<p class="y-chinh">🎯 Five rows, top to bottom, from "can only look" to "changing one interface".</p>
<p class="nhan">The five modes</p>
<ul>
<li><strong>User EXEC — Switch&gt;</strong> — look, do not touch. ping, telnet, a few show commands. No configuration is possible.</li>
<li><strong>Privileged EXEC — Switch#</strong> — all show commands, copy, reload, debug. Still no configuration, but everything needed to inspect and to save.</li>
<li><strong>Global config — Switch(config)#</strong> — changes affecting the whole device: hostname, enable secret, banner.</li>
<li><strong>Line config — Switch(config-line)#</strong> — one access line at a time: console 0, or vty 0 15.</li>
<li><strong>Interface config — Switch(config-if)#</strong> — one interface at a time: Vlan1, Fa0/1, Gi0/1.</li>
</ul>
<p class="nhan">Moving between them</p>
<ul>
<li>Down: <code>enable</code>, then <code>configure terminal</code>, then <code>line console 0</code> or <code>interface vlan 1</code>.</li>
<li>Up one step: <code>exit</code>. Straight to <strong>#</strong>: <code>end</code> or Ctrl-Z. Back to <strong>&gt;</strong>: <code>disable</code>.</li>
</ul>`,
        `<p class="y-chinh">🎯 Năm dòng, từ trên xuống dưới, từ "chỉ được nhìn" tới "đang sửa đúng một interface".</p>
<p class="nhan">Năm chế độ</p>
<ul>
<li><strong>User EXEC — Switch&gt;</strong> — nhìn thôi, đừng đụng. ping, telnet, một vài lệnh show. Không cấu hình được gì.</li>
<li><strong>Privileged EXEC — Switch#</strong> — mọi lệnh show, copy, reload, debug. Vẫn chưa cấu hình được, nhưng đã đủ mọi thứ để soi và để lưu.</li>
<li><strong>Global config — Switch(config)#</strong> — các thay đổi ảnh hưởng toàn thiết bị: hostname, enable secret, banner.</li>
<li><strong>Line config — Switch(config-line)#</strong> — mỗi lần một đường truy cập: console 0, hoặc vty 0 15.</li>
<li><strong>Interface config — Switch(config-if)#</strong> — mỗi lần một interface: Vlan1, Fa0/1, Gi0/1.</li>
</ul>
<p class="nhan">Cách di chuyển</p>
<ul>
<li>Đi xuống: <code>enable</code>, rồi <code>configure terminal</code>, rồi <code>line console 0</code> hoặc <code>interface vlan 1</code>.</li>
<li>Lên một bậc: <code>exit</code>. Nhảy thẳng về <strong>#</strong>: <code>end</code> hoặc Ctrl-Z. Quay về <strong>&gt;</strong>: <code>disable</code>.</li>
</ul>`],

      [7, 'The prompt is your position indicator',
        `<p class="y-chinh">🎯 One transcript showing every prompt change in order. This is the single most useful slide in the chapter for a beginner.</p>
<p class="nhan">Follow the prompts down the page</p>
<ul>
<li><code>Switch&gt;</code> — user EXEC. The <strong>&gt;</strong> means you can look and nothing else.</li>
<li><code>Switch#</code> after <code>enable</code> — the <strong>#</strong> is the power. Everything dangerous lives behind it.</li>
<li><code>Switch(config)#</code> after <code>configure terminal</code> — you are now changing the device.</li>
<li><code>S1(config)#</code> — the hostname applies the instant you press Enter, and the prompt proves it.</li>
<li><code>S1(config-line)#</code> — you are inside ONE line, not the whole device.</li>
<li><code>S1(config-if)#</code> — you are inside ONE interface.</li>
<li><code>S1#</code> after <code>end</code> — all the way out in one step, where <code>exit</code> would have gone up only one.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>The symptom to recognise.</strong> <code>% Invalid input detected</code> on a command you have spelled correctly almost always means the wrong mode, not a wrong command. Read the prompt before you retype.</div>`,
        `<p class="y-chinh">🎯 Một bản ghi phiên làm việc cho thấy mọi lần dấu nhắc đổi, theo đúng thứ tự. Với người mới, đây là slide hữu ích nhất cả chương.</p>
<p class="nhan">Lần theo dấu nhắc từ trên xuống</p>
<ul>
<li><code>Switch&gt;</code> — user EXEC. Dấu <strong>&gt;</strong> nghĩa là bạn chỉ được nhìn, không gì hơn.</li>
<li><code>Switch#</code> sau khi gõ <code>enable</code> — dấu <strong>#</strong> chính là quyền lực. Mọi thứ nguy hiểm đều nằm sau nó.</li>
<li><code>Switch(config)#</code> sau <code>configure terminal</code> — từ đây bạn đang THAY ĐỔI thiết bị.</li>
<li><code>S1(config)#</code> — hostname có hiệu lực ngay khoảnh khắc bạn bấm Enter, và dấu nhắc chứng minh điều đó.</li>
<li><code>S1(config-line)#</code> — bạn đang ở bên trong MỘT đường, không phải cả thiết bị.</li>
<li><code>S1(config-if)#</code> — bạn đang ở bên trong MỘT interface.</li>
<li><code>S1#</code> sau <code>end</code> — ra thẳng một phát, trong khi <code>exit</code> chỉ lên được một bậc.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Triệu chứng cần nhận ra.</strong> <code>% Invalid input detected</code> trên một câu lệnh bạn gõ đúng chính tả thì gần như luôn nghĩa là SAI CHẾ ĐỘ, chứ không phải sai lệnh. Hãy đọc dấu nhắc trước khi gõ lại.</div>`],

      [8, 'Getting back out — exit, end, Ctrl-Z, Ctrl-C',
        `<p class="y-chinh">🎯 Four ways out, and they do four different things. Knowing which one you want is what makes configuring several interfaces fast.</p>
<p class="nhan">From (config-if)# you land in</p>
<ul>
<li><strong>exit</strong> → <code>(config)#</code>, one level up. This is what you want when you finish one interface and start the next.</li>
<li><strong>end</strong> → <code>#</code>, straight to privileged EXEC. Use it when configuration is done and you want to run show commands.</li>
<li><strong>Ctrl-Z</strong> → the same as <code>end</code>, in one keystroke.</li>
<li><strong>Ctrl-C</strong> → stays exactly where it is and abandons the half-typed line.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>The trap in the closing box.</strong> In user or privileged EXEC, <code>exit</code> does not mean "go up" — it means <strong>log out</strong>. On a console session that just drops you back to <code>Switch&gt;</code>; over SSH it closes the connection, and if you are the one who just broke the network, that is a long walk to the server room.</div>`,
        `<p class="y-chinh">🎯 Bốn cách đi ra, và chúng làm bốn việc khác nhau. Biết mình cần cái nào chính là thứ làm cho việc cấu hình nhiều interface trở nên nhanh.</p>
<p class="nhan">Từ (config-if)# bạn rơi vào</p>
<ul>
<li><strong>exit</strong> → <code>(config)#</code>, lên một bậc. Đây là thứ bạn cần khi vừa xong một interface và bắt đầu cái tiếp theo.</li>
<li><strong>end</strong> → <code>#</code>, nhảy thẳng về privileged EXEC. Dùng khi đã cấu hình xong và muốn chạy các lệnh show.</li>
<li><strong>Ctrl-Z</strong> → y hệt <code>end</code>, gọn trong một phím.</li>
<li><strong>Ctrl-C</strong> → đứng nguyên tại chỗ và vứt bỏ dòng đang gõ dở.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Cái bẫy trong ô kết.</strong> Ở user hoặc privileged EXEC, <code>exit</code> KHÔNG có nghĩa "đi lên" — nó có nghĩa <strong>đăng xuất</strong>. Trên phiên console thì nó chỉ trả bạn về <code>Switch&gt;</code>; qua SSH thì nó đóng kết nối, và nếu bạn vừa là người làm hỏng mạng thì đó là một quãng đường dài đi bộ xuống phòng máy chủ.</div>`],
    ]),

    bi(
      `<h3>A worked example: from a cold switch to a named prompt</h3>
<pre><code class="language-bash">screen /dev/tty.usbserial-0001 9600     # macOS / Linux; Tera Term does the same on Windows</code></pre>
<p>Press Enter once. The device answers, and every line after this is the device talking, not you:</p>
<pre><code class="language-plaintext">Would you like to enter the initial configuration dialog? [yes/no]: no
Switch&gt;</code></pre>
<p>Now walk the modes and read the prompt after each step:</p>
<pre><code class="language-bash">enable                 ! Switch&gt; becomes Switch#
configure terminal     ! Switch# becomes Switch(config)#
hostname S1            ! Switch(config)# becomes S1(config)# immediately
line console 0         ! S1(config)# becomes S1(config-line)#
exit                   ! back up one step to S1(config)#
end                    ! all the way out to S1#</code></pre>

<div class="callout ok"><strong>🔍 How to check it yourself</strong>
<ul>
<li><strong>The prompt itself is the check.</strong> After <code>enable</code> you must see <code>#</code>. If you still see <code>&gt;</code>, the enable secret was wrong or you typed nothing — no error is printed for an empty password.</li>
<li><code>show version</code> in privileged EXEC — <strong>right:</strong> it prints the IOS version, the model, the uptime and the configuration register. <strong>Wrong:</strong> <code>% Invalid input detected</code> here means you are still in user EXEC on some platforms, or you mistyped.</li>
<li><code>show running-config</code> — <strong>right:</strong> pages of configuration, ending in <code>end</code>. <strong>Wrong:</strong> this command does not exist in user EXEC at all, which is itself a useful test of which mode you are in.</li>
<li><strong>Garbage on screen instead of a prompt:</strong> the baud rate is wrong. Close the session, reopen at 9600, and do not touch the cable.</li>
<li><strong>Completely blank screen:</strong> press Enter. If still blank, check the COM port number, then the cable, in that order.</li>
</ul></div>

<div class="pitfall co-tieu-de"><strong>Trap 1 — plugging the console cable into an Ethernet port.</strong> Symptom: the terminal window opens, stays black, and never responds to Enter. A console port is usually labelled CONSOLE and often light blue; an RJ-45 console cable fits an Ethernet port perfectly and produces no error at all.
<p><strong>Trap 2 — typing configuration commands in privileged EXEC.</strong> Symptom: <code>hostname S1</code> at the <code>#</code> prompt returns <code>% Invalid input detected</code>, and the student concludes the command is wrong. It is the right command in the wrong mode; you need <code>configure terminal</code> first.</p>
<p><strong>Trap 3 — using exit when you meant end.</strong> Symptom: you type <code>exit</code> four times to get out of interface configuration, and the fourth one logs you out of the session entirely. From <code>(config-if)#</code>, <code>end</code> is one keystroke and cannot overshoot.</p>
<p><strong>Trap 4 — believing Telnet is acceptable on a lab device "because it is only a lab".</strong> Symptom: the habit survives into production, and a year later a password is captured on a shared segment. The lab is where habits are formed; use <code>transport input ssh</code> even when nobody is watching.</p></div>

<h3>Exercise</h3>
<p><strong>(a)</strong> You are at <code>S1(config-if)#</code> and you need to run <code>show ip interface brief</code>. Give the shortest correct sequence of keystrokes, and explain why <code>exit</code> alone is not enough.</p>
<p><strong>(b)</strong> A colleague says "just Telnet in, it is faster than SSH". Give two technical reasons to refuse, and name the one line of configuration that makes the refusal permanent.</p>

<div class="dap-an"><strong>Solution (a).</strong> <code>end</code> (or Ctrl-Z), then the show command. <code>exit</code> from <code>(config-if)#</code> lands in <code>(config)#</code>, which is still a configuration mode — and <code>show ip interface brief</code> is an EXEC command, so you would need a second <code>exit</code> after it. Two commands where one will do, and the second <code>exit</code> from <code>(config)#</code> is the one people accidentally follow with a third, which logs them out.
<p><strong>Solution (b).</strong> First, Telnet sends the username and password as readable text, so anyone able to capture traffic on the path obtains working credentials — the speed difference is irrelevant next to that. Second, the speed claim is false in practice: the SSH key exchange costs milliseconds once per session, and after that both protocols carry the same characters. The configuration line that settles it, under <code>line vty 0 15</code>, is <code>transport input ssh</code> — which does not merely prefer SSH, it refuses Telnet.</p></div>`,

      `<h3>Ví dụ đi hết: từ một cái switch nguội tới một dấu nhắc có tên</h3>
<pre><code class="language-bash">screen /dev/tty.usbserial-0001 9600     # macOS / Linux; Tera Term làm y hệt trên Windows</code></pre>
<p>Bấm Enter một cái. Thiết bị trả lời, và mọi dòng từ đây là thiết bị nói, không phải bạn:</p>
<pre><code class="language-plaintext">Would you like to enter the initial configuration dialog? [yes/no]: no
Switch&gt;</code></pre>
<p>Giờ đi một vòng qua các chế độ và đọc dấu nhắc sau mỗi bước:</p>
<pre><code class="language-bash">enable                 ! Switch&gt; đổi thành Switch#
configure terminal     ! Switch# đổi thành Switch(config)#
hostname S1            ! Switch(config)# đổi thành S1(config)# ngay lập tức
line console 0         ! S1(config)# đổi thành S1(config-line)#
exit                   ! lùi một bậc về S1(config)#
end                    ! ra thẳng tới S1#</code></pre>

<div class="callout ok"><strong>🔍 Cách tự kiểm</strong>
<ul>
<li><strong>Chính dấu nhắc là phép kiểm.</strong> Sau <code>enable</code> bạn PHẢI thấy dấu <code>#</code>. Nếu vẫn thấy <code>&gt;</code> thì enable secret sai hoặc bạn chưa gõ gì — mật khẩu rỗng KHÔNG in ra lỗi nào.</li>
<li><code>show version</code> ở privileged EXEC — <strong>đúng:</strong> nó in phiên bản IOS, model, thời gian chạy và configuration register. <strong>Sai:</strong> nhận <code>% Invalid input detected</code> ở đây nghĩa là trên vài nền tảng bạn vẫn đang ở user EXEC, hoặc gõ nhầm.</li>
<li><code>show running-config</code> — <strong>đúng:</strong> ra vài trang cấu hình, kết thúc bằng chữ <code>end</code>. <strong>Sai:</strong> lệnh này hoàn toàn không tồn tại ở user EXEC, và chính điều đó là một phép thử tiện lợi để biết mình đang ở chế độ nào.</li>
<li><strong>Màn hình toàn ký tự rác thay vì dấu nhắc:</strong> sai tốc độ baud. Đóng phiên, mở lại ở 9600, và đừng đụng vào sợi cáp.</li>
<li><strong>Màn hình trắng trơn hoàn toàn:</strong> bấm Enter. Vẫn trắng thì kiểm số hiệu cổng COM, rồi mới tới sợi cáp, theo đúng thứ tự đó.</li>
</ul></div>

<div class="pitfall co-tieu-de"><strong>Bẫy 1 — cắm cáp console vào cổng Ethernet.</strong> Triệu chứng: cửa sổ terminal mở ra, đen thui, bấm Enter không phản ứng gì. Cổng console thường có nhãn CONSOLE và hay có màu xanh nhạt; sợi cáp console đầu RJ-45 cắm vừa khít cổng Ethernet và không báo lỗi gì hết.
<p><strong>Bẫy 2 — gõ lệnh cấu hình ở privileged EXEC.</strong> Triệu chứng: gõ <code>hostname S1</code> ở dấu nhắc <code>#</code> thì nhận <code>% Invalid input detected</code>, rồi sinh viên kết luận là sai lệnh. Đó là lệnh ĐÚNG ở chế độ SAI; phải <code>configure terminal</code> trước đã.</p>
<p><strong>Bẫy 3 — dùng exit trong khi ý định là end.</strong> Triệu chứng: bạn gõ <code>exit</code> bốn lần để thoát khỏi cấu hình interface, và lần thứ tư đá bạn ra khỏi phiên luôn. Từ <code>(config-if)#</code>, <code>end</code> chỉ tốn một phím và không thể đi quá đà.</p>
<p><strong>Bẫy 4 — tin rằng Telnet chấp nhận được trên thiết bị lab "vì đây chỉ là lab".</strong> Triệu chứng: thói quen đó sống sót sang môi trường thật, và một năm sau một mật khẩu bị bắt trên đoạn mạng dùng chung. Lab chính là nơi thói quen được hình thành; hãy dùng <code>transport input ssh</code> ngay cả khi không ai nhìn.</p></div>

<h3>Bài tập</h3>
<p><strong>(a)</strong> Bạn đang ở <code>S1(config-if)#</code> và cần chạy <code>show ip interface brief</code>. Hãy nêu chuỗi thao tác đúng và NGẮN nhất, và giải thích vì sao chỉ gõ <code>exit</code> thì không đủ.</p>
<p><strong>(b)</strong> Một đồng nghiệp nói "cứ Telnet vào cho nhanh, SSH chậm lắm". Hãy nêu hai lý do kỹ thuật để từ chối, và nêu MỘT dòng cấu hình biến lời từ chối đó thành vĩnh viễn.</p>

<div class="dap-an"><strong>Lời giải (a).</strong> Gõ <code>end</code> (hoặc Ctrl-Z), rồi gõ lệnh show. <code>exit</code> từ <code>(config-if)#</code> chỉ rơi về <code>(config)#</code>, vốn VẪN là một chế độ cấu hình — mà <code>show ip interface brief</code> là lệnh EXEC, nên bạn sẽ cần thêm một <code>exit</code> nữa. Hai lệnh cho việc một lệnh làm được, và chính cái <code>exit</code> thứ hai từ <code>(config)#</code> là cái mà người ta hay lỡ tay gõ thêm lần thứ ba, và bị đăng xuất.
<p><strong>Lời giải (b).</strong> Thứ nhất, Telnet gửi tên đăng nhập và mật khẩu dưới dạng chữ đọc được, nên bất kỳ ai bắt được lưu lượng trên đường đi đều có ngay bộ thông tin đăng nhập dùng được — so với điều đó thì chênh lệch tốc độ hoàn toàn không đáng kể. Thứ hai, lời tuyên bố về tốc độ trên thực tế là sai: việc trao đổi khoá của SSH tốn vài mili giây MỘT LẦN cho cả phiên, sau đó hai giao thức chở đúng những ký tự như nhau. Dòng cấu hình chốt hạ, đặt dưới <code>line vty 0 15</code>, là <code>transport input ssh</code> — nó không chỉ ƯU TIÊN SSH, nó TỪ CHỐI Telnet.</p></div>`,
    ),

    cq(3, [
      ['CQ1.4', 'What is the Cisco IOS?', 'Cisco IOS là gì?'],
    ]),

    bi(
      `<div class="note-ct"><strong>How to answer CQ1.4 well.</strong>
<p>"An operating system" is true but earns nothing. Say what kind: a command-line operating system for network devices, reached through a <em>console</em> port or through <em>SSH</em>, organised into <em>modes</em> whose prompt tells you what you are allowed to do, and holding two copies of its settings — the <em>running</em> configuration in RAM and the <em>startup</em> configuration in NVRAM.</p>
<p>Every underlined word there is a whole section of Module 2, so an answer built from them shows the examiner you have the map, not just the label.</p></div>`,
      `<div class="note-ct"><strong>Cách trả lời CQ1.4 cho tốt.</strong>
<p>Nói "một hệ điều hành" thì đúng nhưng không được điểm nào. Hãy nói rõ là loại nào: một hệ điều hành dòng lệnh dành cho thiết bị mạng, vào được qua cổng <em>console</em> hoặc qua <em>SSH</em>, tổ chức thành các <em>chế độ</em> mà dấu nhắc cho biết bạn được phép làm gì, và giữ HAI bản thiết lập — cấu hình <em>running</em> trong RAM và cấu hình <em>startup</em> trong NVRAM.</p>
<p>Mỗi từ được nhấn mạnh ở trên là nguyên một mục của Module 2, nên một câu trả lời dựng từ chúng cho người chấm thấy bạn có cả tấm bản đồ, chứ không chỉ thuộc cái nhãn.</p></div>`,
    ),
  ].join('\n'),
};

/* ════════════════════════════════════════════════════════════════════════════
   Bài 2.2 — buổi 3: 2.3 The Command Structure · 2.4 Basic Device Configuration
   ════════════════════════════════════════════════════════════════════════════ */
const L22 = {
  title: '2.2 — Command structure, built-in help, and hardening a device|||2.2 — Cấu trúc câu lệnh, trợ giúp có sẵn, và làm cứng thiết bị',
  slug: 'nwc204-2-2-cau-truc-lenh-tro-giup-va-lam-cung',
  type: 'VIDEO',
  description: 'FLM buổi 3 nửa sau (CLO2, CLO3, CLO9): keyword vs argument, ba thông báo lỗi của IOS và ý nghĩa khác nhau của chúng, dấu ? và Tab, phím tắt, hostname, và khối làm cứng đầy đủ — mật khẩu nào canh cửa nào. Kèm cách tự kiểm và 4 bẫy hay mắc.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 2 · Lesson 2.2 · FLM session 3 · CLO2, CLO3, CLO9</span>
<h2>Command structure, built-in help, and hardening a device</h2>
<p class="lead">After this lesson you can read any IOS command and say which part you may abbreviate and which part you must supply, tell the three IOS error messages apart, and type a complete hardening block from <code>enable</code> without notes.</p>
<p class="nhan">Source: FLM · Syllabus 14520 · session 3 — "2.3 The Command Structure. 2.4 Basic Device Configuration"</p>

<div class="callout"><span class="badge">Opening question</span>
<p>You type a command. IOS answers with one of three things: <code>% Ambiguous command</code>, <code>% Incomplete command</code>, or <code>% Invalid input detected</code>.</p>
<p><strong>Each one means something different and each has a different fix.</strong> Guessing which is why beginners retype the same wrong command five times. Which is which?</p></div>

<h3>Every term, from zero</h3>
<ul>
<li><strong>Keyword</strong> — a fixed word IOS defines, such as <code>ip</code> or <code>address</code>. You cannot invent one, and you may abbreviate it while it stays unambiguous.</li>
<li><strong>Argument</strong> — a value you supply, such as <code>192.168.1.2</code>. IOS cannot guess it and will not abbreviate it.</li>
<li><strong>Context-sensitive help</strong> — the <code>?</code> character, which lists what is valid at the exact point where you typed it.</li>
<li><strong>enable secret</strong> — the password guarding privileged EXEC. Stored hashed, not reversible.</li>
<li><strong>enable password</strong> — the obsolete version, stored in plain text. Never use it.</li>
<li><strong>line console 0</strong> — the configuration of the physical console line. <strong>line vty 0 15</strong> — the sixteen remote sessions.</li>
<li><strong>login</strong> — the command that makes IOS actually ask for the line password. Without it the password is configured and never used.</li>
<li><strong>service password-encryption</strong> — obscures the plain-text line passwords in the configuration file. Weak (type 7) and reversible, so it defends against a glance over the shoulder, not against an attacker.</li>
<li><strong>banner motd</strong> — the message shown before login. It is a legal notice, not decoration.</li>
</ul>

<h3>Why the design is like this</h3>
<p>IOS abbreviates keywords but never arguments, and the reason is that it can prove one and cannot prove the other. <code>conf t</code> is unambiguous because no other keyword in that mode starts with "conf", so IOS can expand it safely. An address has no such property: <code>192.168.1</code> is not a shortened address, it is a different, wrong one.</p>
<p>The password layout has the same kind of logic. Console and vty passwords guard <em>doors</em>; <code>enable secret</code> guards the <em>power</em>. Every door leads to the same place, so protecting the doors without protecting the power is protecting nothing — which is exactly what the warning box on slide 13 says.</p>`,

      `<span class="eyebrow">NWC204 · Chương 2 · Bài 2.2 · FLM buổi 3 · CLO2, CLO3, CLO9</span>
<h2>Cấu trúc câu lệnh, trợ giúp có sẵn, và làm cứng thiết bị</h2>
<p class="lead">Học xong bài này bạn đọc được bất kỳ câu lệnh IOS nào và nói ngay phần nào được viết tắt, phần nào bắt buộc phải tự điền; phân biệt được ba thông báo lỗi của IOS; và gõ được nguyên khối làm cứng từ <code>enable</code> mà không cần nhìn giấy.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 3 — "2.3 The Command Structure. 2.4 Basic Device Configuration"</p>

<div class="callout"><span class="badge">Câu hỏi mở đầu</span>
<p>Bạn gõ một câu lệnh. IOS đáp lại bằng một trong ba thứ: <code>% Ambiguous command</code>, <code>% Incomplete command</code>, hoặc <code>% Invalid input detected</code>.</p>
<p><strong>Mỗi thông báo mang một ý nghĩa khác nhau và có một cách sửa khác nhau.</strong> Đoán mò chính là lý do người mới gõ lại đúng một câu lệnh sai năm lần. Cái nào là cái nào?</p></div>

<h3>Mọi thuật ngữ, từ số 0</h3>
<ul>
<li><strong>Keyword (từ khoá)</strong> — một từ cố định do IOS định nghĩa, ví dụ <code>ip</code> hay <code>address</code>. Bạn không bịa ra được, và được viết tắt chừng nào nó còn chưa mơ hồ.</li>
<li><strong>Argument (tham số)</strong> — một giá trị do bạn cung cấp, ví dụ <code>192.168.1.2</code>. IOS không đoán được và không viết tắt được.</li>
<li><strong>Trợ giúp theo ngữ cảnh</strong> — ký tự <code>?</code>, liệt kê những gì hợp lệ tại đúng vị trí bạn vừa gõ nó.</li>
<li><strong>enable secret</strong> — mật khẩu canh privileged EXEC. Lưu dạng băm, không đảo ngược được.</li>
<li><strong>enable password</strong> — bản cũ đã lỗi thời, lưu dạng chữ thô. Đừng bao giờ dùng.</li>
<li><strong>line console 0</strong> — phần cấu hình của đường console vật lý. <strong>line vty 0 15</strong> — mười sáu phiên từ xa.</li>
<li><strong>login</strong> — lệnh làm IOS THẬT SỰ hỏi mật khẩu của đường đó. Không có nó thì mật khẩu được đặt mà chẳng bao giờ được dùng.</li>
<li><strong>service password-encryption</strong> — che các mật khẩu chữ thô trong file cấu hình. Yếu (type 7) và đảo ngược được, nên nó chống được cái liếc mắt qua vai chứ không chống được kẻ tấn công.</li>
<li><strong>banner motd</strong> — dòng chữ hiện ra trước khi đăng nhập. Đó là một thông báo pháp lý, không phải trang trí.</li>
</ul>

<h3>Vì sao thiết kế như vậy</h3>
<p>IOS viết tắt được keyword nhưng không bao giờ viết tắt argument, và lý do là nó CHỨNG MINH được cái này mà không chứng minh được cái kia. <code>conf t</code> là không mơ hồ vì trong chế độ đó không keyword nào khác bắt đầu bằng "conf", nên IOS bung ra an toàn. Một địa chỉ thì không có tính chất ấy: <code>192.168.1</code> không phải địa chỉ viết tắt, nó là một địa chỉ KHÁC và sai.</p>
<p>Cách bố trí mật khẩu cũng theo logic đó. Mật khẩu console và vty canh các <em>cánh cửa</em>; <code>enable secret</code> canh <em>quyền lực</em>. Mọi cánh cửa đều dẫn về cùng một chỗ, nên bảo vệ cửa mà không bảo vệ quyền lực là không bảo vệ gì cả — đúng như ô cảnh báo ở slide 13 viết.</p>`,
    ),

    walkHead(D, 9, 14,
      'Slides 9–14 cover 2.3 The Command Structure and 2.4 Basic Device Configuration, the second half of session 3.',
      'Slide 9–14 đi hết 2.3 The Command Structure và 2.4 Basic Device Configuration, tức nửa sau buổi 3.'),

    walk(D, [
      [9, '2.3 — Anatomy of one IOS command',
        `<p class="y-chinh">🎯 One command broken into coloured boxes: the prompt, two keywords, and two arguments.</p>
<p class="nhan">Reading the boxes left to right</p>
<ul>
<li><strong>S1(config-if)#</strong> — the prompt. Not part of the command; it tells you the mode the command is valid in.</li>
<li><strong>ip</strong> and <strong>address</strong>, shaded yellow — keywords. Fixed words IOS defines, abbreviable while unambiguous.</li>
<li><strong>192.168.1.2</strong> and <strong>255.255.255.0</strong>, shaded green — arguments. Values you choose, never abbreviable.</li>
</ul>
<p class="nhan">The documentation conventions</p>
<ul>
<li><strong>boldface</strong> means type it exactly as shown; <em>italics</em> means replace it with your own value.</li>
<li><code>[x]</code> optional, <code>{a | b}</code> a required choice, <code>[x {a | b}]</code> an optional choice.</li>
</ul>
<p>The closing note explains a real error: <code>ip addr 192.168.1.2</code> fails twice over — the mask argument is missing, and <code>addr</code> stops being accepted once another keyword shares the prefix.</p>`,
        `<p class="y-chinh">🎯 Một câu lệnh được xẻ thành các ô màu: dấu nhắc, hai keyword, và hai argument.</p>
<p class="nhan">Đọc các ô từ trái sang phải</p>
<ul>
<li><strong>S1(config-if)#</strong> — dấu nhắc. Không thuộc câu lệnh; nó cho biết câu lệnh này hợp lệ ở chế độ nào.</li>
<li><strong>ip</strong> và <strong>address</strong>, nền vàng — keyword. Từ cố định do IOS định nghĩa, viết tắt được chừng nào chưa mơ hồ.</li>
<li><strong>192.168.1.2</strong> và <strong>255.255.255.0</strong>, nền xanh — argument. Giá trị do bạn chọn, không bao giờ viết tắt được.</li>
</ul>
<p class="nhan">Quy ước trong tài liệu</p>
<ul>
<li><strong>Chữ đậm</strong> nghĩa là gõ y hệt như in; <em>chữ nghiêng</em> nghĩa là thay bằng giá trị của bạn.</li>
<li><code>[x]</code> tuỳ chọn, <code>{a | b}</code> bắt buộc chọn một, <code>[x {a | b}]</code> tuỳ chọn nhưng nếu chọn thì phải chọn một.</li>
</ul>
<p>Dòng ghi chú cuối giải thích một lỗi có thật: <code>ip addr 192.168.1.2</code> sai tới hai lần — thiếu argument mặt nạ, và <code>addr</code> hết được chấp nhận ngay khi có keyword khác chia chung tiền tố.</p>`],

      [10, 'The help that is already inside the device',
        `<p class="y-chinh">🎯 Two tools and three error messages. Learning to read the three messages is worth more than memorising commands.</p>
<p class="nhan">The two tools</p>
<ul>
<li><code>?</code> on its own lists every command available <em>in this mode</em>. <code>sh?</code> lists commands beginning with "sh". <code>show ?</code> — note the space — lists what may follow <code>show</code>.</li>
<li><strong>Tab</strong> completes an unambiguous word, which means you never have to spell <code>interface</code> correctly again.</li>
</ul>
<p class="nhan">The three error messages, and what each demands</p>
<ul>
<li><code>% Ambiguous command</code> — you typed too <em>few</em> letters and several commands match. Fix: add letters.</li>
<li><code>% Incomplete command</code> — the command is right but an argument is missing. Fix: add the argument, and use <code>?</code> to find out which.</li>
<li><code>% Invalid input detected at '^' marker</code> — wrong word, wrong mode, or a typo. The <code>^</code> points at the first bad character, which tells you exactly where to look.</li>
</ul>`,
        `<p class="y-chinh">🎯 Hai công cụ và ba thông báo lỗi. Học đọc ba thông báo đó còn giá trị hơn học thuộc câu lệnh.</p>
<p class="nhan">Hai công cụ</p>
<ul>
<li><code>?</code> đứng một mình liệt kê mọi lệnh dùng được <em>ở chế độ này</em>. <code>sh?</code> liệt kê các lệnh bắt đầu bằng "sh". <code>show ?</code> — để ý dấu cách — liệt kê những gì được phép đi sau <code>show</code>.</li>
<li><strong>Tab</strong> hoàn tất một từ chưa mơ hồ, nghĩa là bạn không bao giờ phải gõ đúng chính tả chữ <code>interface</code> nữa.</li>
</ul>
<p class="nhan">Ba thông báo lỗi, và mỗi cái đòi hỏi gì</p>
<ul>
<li><code>% Ambiguous command</code> — bạn gõ QUÁ ÍT chữ nên nhiều lệnh cùng khớp. Cách sửa: gõ thêm chữ.</li>
<li><code>% Incomplete command</code> — lệnh đúng rồi nhưng thiếu argument. Cách sửa: thêm argument, và dùng <code>?</code> để biết thiếu cái nào.</li>
<li><code>% Invalid input detected at '^' marker</code> — sai từ, sai chế độ, hoặc gõ nhầm. Dấu <code>^</code> chỉ vào ký tự SAI ĐẦU TIÊN, nên nó nói cho bạn chính xác chỗ cần nhìn.</li>
</ul>`],

      [11, 'Hot keys worth memorising before the Practical Exam',
        `<p class="y-chinh">🎯 Six shortcuts. The highlighted row is the one that gets students stuck in the exam room.</p>
<p class="nhan">The six</p>
<ul>
<li><strong>Tab</strong> — complete the current word, so no typos in long keywords.</li>
<li><strong>Up arrow</strong> or Ctrl-P — previous command, which is how you re-run a <code>show</code> after every change.</li>
<li><strong>Ctrl-A</strong> and <strong>Ctrl-E</strong> — jump to the start and the end of the line.</li>
<li><strong>Ctrl-W</strong> and <strong>Ctrl-U</strong> — delete the previous word, or the whole line.</li>
<li><strong>Ctrl-Shift-6</strong> — abort a running ping or traceroute. A long ping will not stop on its own, and in a timed exam that matters.</li>
<li><strong>Space, Enter, or any key</strong> at the <code>--More--</code> prompt — next page, next line, or stop.</li>
</ul>
<p class="ghi-chu">Ctrl-Shift-6 is also the escape from the freeze caused by a mistyped command being resolved as a hostname, which is why <code>no ip domain-lookup</code> appears on the next slide.</p>`,
        `<p class="y-chinh">🎯 Sáu phím tắt. Dòng được tô sáng chính là thứ làm sinh viên mắc kẹt trong phòng thi.</p>
<p class="nhan">Sáu phím</p>
<ul>
<li><strong>Tab</strong> — hoàn tất từ đang gõ, nên không còn gõ sai chính tả các keyword dài.</li>
<li><strong>Mũi tên lên</strong> hoặc Ctrl-P — lệnh trước đó, là cách bạn chạy lại một lệnh <code>show</code> sau mỗi lần thay đổi.</li>
<li><strong>Ctrl-A</strong> và <strong>Ctrl-E</strong> — nhảy về đầu dòng và cuối dòng.</li>
<li><strong>Ctrl-W</strong> và <strong>Ctrl-U</strong> — xoá từ liền trước, hoặc xoá cả dòng.</li>
<li><strong>Ctrl-Shift-6</strong> — ngắt một lệnh ping hay traceroute đang chạy. Một lệnh ping dài sẽ không tự dừng, và trong phòng thi tính giờ thì điều đó rất đáng kể.</li>
<li><strong>Space, Enter, hoặc phím bất kỳ</strong> ở dấu nhắc <code>--More--</code> — trang tiếp, dòng tiếp, hoặc dừng.</li>
</ul>
<p class="ghi-chu">Ctrl-Shift-6 cũng chính là lối thoát khỏi cú treo do một lệnh gõ nhầm bị đem đi phân giải như tên miền, đó là lý do <code>no ip domain-lookup</code> xuất hiện ở slide kế tiếp.</p>`],

      [12, '2.4 — The first three commands on any new device',
        `<p class="y-chinh">🎯 Five lines, and two of them exist purely to stop a problem you have not met yet.</p>
<p class="nhan">The five lines</p>
<ul>
<li><code>enable</code> — user EXEC to privileged EXEC.</li>
<li><code>configure terminal</code> — privileged EXEC to global config.</li>
<li><code>hostname S1</code> — name it NOW, before anything else.</li>
<li><code>no ip domain-lookup</code> — stop IOS treating a typo as a DNS name to resolve.</li>
<li><code>end</code> — back to <code>S1#</code>.</li>
</ul>
<p class="nhan">Why hostname first</p>
<ul>
<li>Every later command, every screenshot and every log line carries that name. Configuring the wrong device is a real accident, and it happens on prompts that all read <code>Switch&gt;</code>.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>The symptom the warning box describes.</strong> Without <code>no ip domain-lookup</code>, a typo such as <code>shwo</code> makes IOS try to resolve it as a hostname and freeze your session for several seconds. Beginners conclude the switch has crashed. It has not — press Ctrl-Shift-6.</div>`,
        `<p class="y-chinh">🎯 Năm dòng, và hai trong số đó tồn tại thuần tuý để chặn một sự cố bạn còn chưa gặp.</p>
<p class="nhan">Năm dòng</p>
<ul>
<li><code>enable</code> — từ user EXEC sang privileged EXEC.</li>
<li><code>configure terminal</code> — từ privileged EXEC sang global config.</li>
<li><code>hostname S1</code> — đặt tên NGAY, trước mọi thứ khác.</li>
<li><code>no ip domain-lookup</code> — ngăn IOS đem một lỗi gõ nhầm đi phân giải như tên miền.</li>
<li><code>end</code> — quay về <code>S1#</code>.</li>
</ul>
<p class="nhan">Vì sao hostname phải làm đầu tiên</p>
<ul>
<li>Mọi lệnh sau đó, mọi ảnh chụp màn hình và mọi dòng log đều mang cái tên ấy. Cấu hình nhầm thiết bị là tai nạn CÓ THẬT, và nó xảy ra trên những dấu nhắc đều ghi <code>Switch&gt;</code>.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Triệu chứng mà ô cảnh báo mô tả.</strong> Không có <code>no ip domain-lookup</code>, một lỗi gõ nhầm như <code>shwo</code> khiến IOS cố phân giải nó thành tên miền và làm ĐƠ phiên của bạn vài giây. Người mới kết luận switch treo rồi. Không phải đâu — bấm Ctrl-Shift-6.</div>`],

      [13, 'Which password guards which door',
        `<p class="y-chinh">🎯 Two little maps showing that every entrance leads to the same place, and only one password guards that place.</p>
<p class="nhan">The two paths in</p>
<ul>
<li>Console cable → <code>line console 0</code> password → user EXEC → <code>enable secret</code> → privileged EXEC.</li>
<li>SSH client → <code>line vty 0 15</code> password → the <em>same</em> user EXEC.</li>
</ul>
<p class="nhan">What each command actually protects</p>
<ul>
<li><code>line console 0</code> + password — guards the physical console only.</li>
<li><code>line vty 0 15</code> + password — guards remote sessions only.</li>
<li><strong>enable secret</strong> — guards privileged EXEC, where every route ends. This is the one that matters.</li>
<li><code>service password-encryption</code> — hides the two plain-text passwords above from a glance. Type 7, reversible, so it is not real protection.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>The warning box, restated.</strong> Set a console password and forget <code>enable secret</code>, and anybody who gets past the front door owns the device completely. <code>enable secret</code> is not optional.</div>`,
        `<p class="y-chinh">🎯 Hai sơ đồ nhỏ cho thấy mọi lối vào đều dẫn về CÙNG một chỗ, và chỉ có một mật khẩu canh cái chỗ đó.</p>
<p class="nhan">Hai đường vào</p>
<ul>
<li>Cáp console → mật khẩu <code>line console 0</code> → user EXEC → <code>enable secret</code> → privileged EXEC.</li>
<li>Client SSH → mật khẩu <code>line vty 0 15</code> → CHÍNH cái user EXEC đó.</li>
</ul>
<p class="nhan">Mỗi lệnh thật sự bảo vệ cái gì</p>
<ul>
<li><code>line console 0</code> + password — chỉ canh cổng console vật lý.</li>
<li><code>line vty 0 15</code> + password — chỉ canh các phiên từ xa.</li>
<li><strong>enable secret</strong> — canh privileged EXEC, nơi mọi con đường kết thúc. Đây mới là cái đáng kể.</li>
<li><code>service password-encryption</code> — che hai mật khẩu chữ thô ở trên khỏi cái liếc mắt. Type 7, đảo ngược được, nên không phải là bảo vệ thật.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Ô cảnh báo, nói lại cho rõ.</strong> Đặt mật khẩu console mà quên <code>enable secret</code> thì ai qua được cửa trước là sở hữu trọn vẹn thiết bị. <code>enable secret</code> KHÔNG phải tuỳ chọn.</div>`],

      [14, 'The whole hardening block, from enable',
        `<p class="y-chinh">🎯 Eighteen lines that take a device from "anyone can do anything" to "named, protected, logged and saved".</p>
<p class="nhan">Walking the block</p>
<ul>
<li><code>enable secret Cl4ss!2026</code> — hashed. Note the comment: <em>not</em> <code>enable password</code>, which stores plain text.</li>
<li><code>line console 0</code> with <code>password</code>, <code>login</code> and <code>exec-timeout 5 0</code> — a password, the command that makes IOS ask for it, and an idle logout after five minutes.</li>
<li><code>line vty 0 15</code> with <code>password</code>, <code>login</code> and <code>transport input ssh</code> — the same, plus refusing Telnet outright.</li>
<li><code>service password-encryption</code> — obscures the two line passwords in the file.</li>
<li><code>banner motd</code> — the legal notice shown before login.</li>
<li><code>copy running-config startup-config</code> — the last line, and the comment says why: <strong>nothing above survives a reload until this runs</strong>.</li>
</ul>
<p class="ghi-chu">The <code>login</code> line is the one people leave out. Without it the password is configured, stored, encrypted — and never requested.</p>`,
        `<p class="y-chinh">🎯 Mười tám dòng đưa một thiết bị từ "ai muốn làm gì thì làm" sang "có tên, được bảo vệ, có ghi nhận và đã lưu".</p>
<p class="nhan">Đi qua từng khối</p>
<ul>
<li><code>enable secret Cl4ss!2026</code> — dạng băm. Để ý dòng chú thích: <em>không phải</em> <code>enable password</code>, cái đó lưu chữ thô.</li>
<li><code>line console 0</code> kèm <code>password</code>, <code>login</code> và <code>exec-timeout 5 0</code> — một mật khẩu, câu lệnh bắt IOS phải hỏi nó, và tự đăng xuất sau năm phút không dùng.</li>
<li><code>line vty 0 15</code> kèm <code>password</code>, <code>login</code> và <code>transport input ssh</code> — y như trên, cộng thêm việc từ chối thẳng Telnet.</li>
<li><code>service password-encryption</code> — che hai mật khẩu đường truyền trong file cấu hình.</li>
<li><code>banner motd</code> — thông báo pháp lý hiện ra trước khi đăng nhập.</li>
<li><code>copy running-config startup-config</code> — dòng cuối, và chú thích nói rõ vì sao: <strong>mọi thứ ở trên KHÔNG sống sót qua một lần khởi động lại cho tới khi dòng này chạy</strong>.</li>
</ul>
<p class="ghi-chu">Dòng <code>login</code> là dòng người ta hay bỏ sót nhất. Không có nó thì mật khẩu được đặt, được lưu, được mã hoá — và không bao giờ được hỏi tới.</p>`],
    ]),

    bi(
      `<h3>A worked example: the same command, four ways</h3>
<pre><code class="language-bash">S1(config-if)# ip address 192.168.1.2 255.255.255.0   ! correct, in full
S1(config-if)# ip add 192.168.1.2 255.255.255.0       ! correct: "add" is still unambiguous
S1(config-if)# ip address 192.168.1.2                 ! % Incomplete command  -> mask missing
S1(config-if)# ip addres 192.168.1.2 255.255.255.0    ! % Invalid input       -> typo</code></pre>
<p>And the hardening block, typed for real, with the output IOS gives back:</p>
<pre><code class="language-bash">enable
configure terminal
enable secret Cl4ss!2026
line console 0
 password C0nsole!2026
 login
 exit
end
show running-config | include secret|password|login</code></pre>
<pre><code class="language-plaintext">enable secret 5 $1$mERr$9cTjUIEqNGurQiFU.ZeCi1
 password 7 08701E1D5D4C53
 login</code></pre>

<div class="callout ok"><strong>🔍 How to check it yourself</strong>
<ul>
<li><code>show running-config | include secret</code> — <strong>right:</strong> a line reading <code>enable secret 5 $1$...</code> or <code>enable secret 9 $9$...</code>; the number is the hash type. <strong>Wrong:</strong> a line reading <code>enable password Cl4ss!2026</code> in readable text means you used the obsolete command and the password is in the file for anyone to read.</li>
<li><code>show running-config | begin line con</code> — <strong>right:</strong> you see <code>password</code> and <code>login</code> together. <strong>Wrong:</strong> <code>password</code> without <code>login</code> means IOS will never ask for it, and the device is unprotected while looking configured.</li>
<li><code>show running-config | begin line vty</code> — <strong>right:</strong> <code>transport input ssh</code> is present. <strong>Wrong:</strong> no transport line at all means Telnet is still accepted, which on most IOS versions is the default.</li>
<li><strong>Test it from the other side.</strong> Log out and log back in. If you are not asked for a password, the configuration is not doing what you think it is — and this is the only test that proves it.</li>
<li><code>?</code> at any point — if IOS lists nothing useful, you are in the wrong mode. Use the prompt, then <code>?</code> again.</li>
</ul></div>

<div class="pitfall co-tieu-de"><strong>Trap 1 — password without login.</strong> Symptom: the configuration shows a console password, the student believes the device is protected, and anyone who plugs in a cable gets straight to <code>Switch&gt;</code> with no prompt at all. IOS gives no warning for this.
<p><strong>Trap 2 — using enable password instead of enable secret.</strong> Symptom: <code>show running-config</code> displays the privileged-mode password in readable text, and on many IOS versions the secret silently wins anyway, so the password you typed is not even the one that works.</p>
<p><strong>Trap 3 — trusting service password-encryption.</strong> Symptom: a configuration file is emailed around because "the passwords are encrypted". Type 7 is reversible in seconds by any of a dozen free tools. It stops a glance, nothing more.</p>
<p><strong>Trap 4 — retyping a command instead of reading the error.</strong> Symptom: five identical attempts at <code>clock set</code>, five identical <code>% Incomplete command</code> replies, and growing frustration. That message means the command is right and an argument is missing; <code>clock set ?</code> answers it in one step.</p></div>

<h3>Exercise</h3>
<p><strong>(a)</strong> A device has this configuration. Name every security problem, in order of severity, and give the command that fixes each.</p>
<pre><code class="language-ini">hostname SW
enable password cisco
line console 0
 password cisco
line vty 0 4
 password cisco
 login
 transport input all</code></pre>
<p><strong>(b)</strong> Explain, in terms of keywords and arguments, why <code>int vl 1</code> is accepted but <code>ip add 192.168.1</code> is not.</p>

<div class="dap-an"><strong>Solution (a).</strong> In order:
<ol>
<li><strong>The console line has a password but no <code>login</code></strong> — so it is never asked for. Anyone with physical access walks straight in. Fix: <code>line console 0</code> then <code>login</code>.</li>
<li><strong><code>enable password</code> instead of <code>enable secret</code></strong> — the privileged-mode password is stored in readable text. Fix: <code>no enable password</code> then <code>enable secret &lt;strong value&gt;</code>.</li>
<li><strong><code>transport input all</code></strong> — Telnet is accepted, so credentials cross the network in the clear. Fix: <code>line vty 0 15</code> then <code>transport input ssh</code>.</li>
<li><strong>Only vty 0 4 configured</strong> — on a device with sixteen vty lines, lines 5 to 15 are left unconfigured. Fix: use <code>line vty 0 15</code>.</li>
<li><strong>The password is "cisco" in three places</strong> and there is no <code>service password-encryption</code> and no banner. Fix: distinct strong passwords, plus <code>service password-encryption</code> and <code>banner motd</code>.</li>
</ol>
<p><strong>Solution (b).</strong> <code>int</code> and <code>vl</code> are <em>keywords</em>: IOS holds a finite list of them, so it can check that exactly one keyword in this mode starts with "int" and exactly one with "vl", and expand both safely. <code>192.168.1</code> is an <em>argument</em>: IOS has no list of valid addresses to match against, so it cannot tell whether you meant 192.168.1.2 or 192.168.1.200 — and guessing an address would be far worse than refusing. It therefore rejects it rather than completing it.</p></div>`,

      `<h3>Ví dụ đi hết: cùng một câu lệnh, bốn kiểu</h3>
<pre><code class="language-bash">S1(config-if)# ip address 192.168.1.2 255.255.255.0   ! đúng, viết đầy đủ
S1(config-if)# ip add 192.168.1.2 255.255.255.0       ! đúng: "add" vẫn chưa mơ hồ
S1(config-if)# ip address 192.168.1.2                 ! % Incomplete command  -> thiếu mặt nạ
S1(config-if)# ip addres 192.168.1.2 255.255.255.0    ! % Invalid input       -> gõ nhầm</code></pre>
<p>Và khối làm cứng, gõ thật, kèm phần kết xuất IOS trả về:</p>
<pre><code class="language-bash">enable
configure terminal
enable secret Cl4ss!2026
line console 0
 password C0nsole!2026
 login
 exit
end
show running-config | include secret|password|login</code></pre>
<pre><code class="language-plaintext">enable secret 5 $1$mERr$9cTjUIEqNGurQiFU.ZeCi1
 password 7 08701E1D5D4C53
 login</code></pre>

<div class="callout ok"><strong>🔍 Cách tự kiểm</strong>
<ul>
<li><code>show running-config | include secret</code> — <strong>đúng:</strong> một dòng ghi <code>enable secret 5 $1$...</code> hoặc <code>enable secret 9 $9$...</code>; con số là kiểu băm. <strong>Sai:</strong> một dòng ghi <code>enable password Cl4ss!2026</code> bằng chữ đọc được nghĩa là bạn đã dùng lệnh lỗi thời và mật khẩu nằm sờ sờ trong file cho bất cứ ai đọc.</li>
<li><code>show running-config | begin line con</code> — <strong>đúng:</strong> bạn thấy <code>password</code> và <code>login</code> đi cùng nhau. <strong>Sai:</strong> có <code>password</code> mà không có <code>login</code> nghĩa là IOS sẽ KHÔNG BAO GIỜ hỏi tới nó, và thiết bị không được bảo vệ trong khi trông vẫn như đã cấu hình.</li>
<li><code>show running-config | begin line vty</code> — <strong>đúng:</strong> có dòng <code>transport input ssh</code>. <strong>Sai:</strong> không có dòng transport nào nghĩa là Telnet vẫn được chấp nhận, và trên phần lớn bản IOS thì đó là mặc định.</li>
<li><strong>Kiểm từ phía bên kia.</strong> Đăng xuất rồi đăng nhập lại. Nếu nó KHÔNG hỏi mật khẩu thì cấu hình không làm cái việc bạn tưởng — và đây là phép thử DUY NHẤT chứng minh được điều đó.</li>
<li><code>?</code> ở bất kỳ vị trí nào — nếu IOS không liệt kê thứ gì có ích, bạn đang sai chế độ. Nhìn dấu nhắc, rồi <code>?</code> lại.</li>
</ul></div>

<div class="pitfall co-tieu-de"><strong>Bẫy 1 — có password mà không có login.</strong> Triệu chứng: cấu hình hiện rõ một mật khẩu console, sinh viên tin thiết bị đã được bảo vệ, và ai cắm cáp vào cũng nhảy thẳng tới <code>Switch&gt;</code> không bị hỏi gì. IOS không hề cảnh báo chuyện này.
<p><strong>Bẫy 2 — dùng enable password thay vì enable secret.</strong> Triệu chứng: <code>show running-config</code> in ra mật khẩu chế độ đặc quyền bằng chữ đọc được, và trên nhiều bản IOS thì secret vẫn âm thầm thắng, nên mật khẩu bạn vừa gõ thậm chí không phải mật khẩu có tác dụng.</p>
<p><strong>Bẫy 3 — tin vào service password-encryption.</strong> Triệu chứng: một file cấu hình được gửi email lòng vòng vì "mật khẩu đã mã hoá rồi mà". Type 7 bị giải ngược trong vài giây bởi cả tá công cụ miễn phí. Nó chặn được cái liếc mắt, không hơn.</p>
<p><strong>Bẫy 4 — gõ lại câu lệnh thay vì đọc thông báo lỗi.</strong> Triệu chứng: năm lần gõ y hệt <code>clock set</code>, năm lần nhận y hệt <code>% Incomplete command</code>, và càng lúc càng bực. Thông báo đó nghĩa là lệnh ĐÚNG và đang thiếu argument; <code>clock set ?</code> trả lời trong một bước.</p></div>

<h3>Bài tập</h3>
<p><strong>(a)</strong> Một thiết bị có cấu hình như dưới. Hãy nêu MỌI vấn đề an ninh, xếp theo mức nghiêm trọng, và cho biết câu lệnh sửa từng cái.</p>
<pre><code class="language-ini">hostname SW
enable password cisco
line console 0
 password cisco
line vty 0 4
 password cisco
 login
 transport input all</code></pre>
<p><strong>(b)</strong> Dùng khái niệm keyword và argument, giải thích vì sao <code>int vl 1</code> được chấp nhận còn <code>ip add 192.168.1</code> thì không.</p>

<div class="dap-an"><strong>Lời giải (a).</strong> Theo thứ tự:
<ol>
<li><strong>Đường console có password nhưng KHÔNG có <code>login</code></strong> — nên nó không bao giờ bị hỏi tới. Ai tiếp cận được vật lý là đi thẳng vào. Sửa: <code>line console 0</code> rồi <code>login</code>.</li>
<li><strong>Dùng <code>enable password</code> thay vì <code>enable secret</code></strong> — mật khẩu chế độ đặc quyền lưu bằng chữ đọc được. Sửa: <code>no enable password</code> rồi <code>enable secret &lt;giá trị mạnh&gt;</code>.</li>
<li><strong><code>transport input all</code></strong> — Telnet được chấp nhận, nên thông tin đăng nhập băng qua mạng dưới dạng chữ thô. Sửa: <code>line vty 0 15</code> rồi <code>transport input ssh</code>.</li>
<li><strong>Chỉ cấu hình vty 0 4</strong> — trên thiết bị có mười sáu đường vty, các đường 5 đến 15 bị bỏ trống không cấu hình. Sửa: dùng <code>line vty 0 15</code>.</li>
<li><strong>Mật khẩu là "cisco" ở cả ba chỗ</strong>, lại không có <code>service password-encryption</code> và không có banner. Sửa: đặt mật khẩu mạnh và khác nhau, thêm <code>service password-encryption</code> và <code>banner motd</code>.</li>
</ol>
<p><strong>Lời giải (b).</strong> <code>int</code> và <code>vl</code> là <em>keyword</em>: IOS giữ một danh sách HỮU HẠN các keyword, nên nó kiểm được rằng trong chế độ này có đúng một keyword bắt đầu bằng "int" và đúng một keyword bắt đầu bằng "vl", rồi bung cả hai ra một cách an toàn. <code>192.168.1</code> là một <em>argument</em>: IOS không có danh sách địa chỉ hợp lệ nào để đối chiếu, nên nó không thể biết bạn định nói 192.168.1.2 hay 192.168.1.200 — và đoán mò một địa chỉ thì tệ hơn nhiều so với từ chối. Vì vậy nó từ chối chứ không hoàn tất.</p></div>`,
    ),
  ].join('\n'),
};

/* ════════════════════════════════════════════════════════════════════════════
   Bài 2.3 — buổi 4: 2.5 Save Configurations · 2.6 Ports and Addresses
   ════════════════════════════════════════════════════════════════════════════ */
const L23 = {
  title: '2.3 — running-config vs startup-config, and what an end device needs|||2.3 — running-config vs startup-config, và thiết bị đầu cuối cần những gì',
  slug: 'nwc204-2-3-luu-cau-hinh-va-cong-dia-chi',
  type: 'VIDEO',
  description: 'FLM buổi 4 nửa đầu (CLO2, CLO3, CLO9): RAM vs NVRAM và vì sao quên copy là mất hết sau khi khởi động lại; lưu, huỷ bỏ, xoá trắng; bốn thiết lập một host phải có và cái nào hỏng thì hỏng kiểu gì; vì sao switch cần IP dù không cần IP để chuyển frame.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 2 · Lesson 2.3 · FLM session 4 · CLO2, CLO3, CLO9</span>
<h2>Saving configuration, and what an end device needs to talk</h2>
<p class="lead">After this lesson you can say exactly what happens to your work when a device loses power, discard a bad change without undoing it line by line, and name which of the four host settings is broken from the symptom alone.</p>
<p class="nhan">Source: FLM · Syllabus 14520 · session 4 — "2.5 Save Configurations. 2.6 Ports and Addresses. 2.7 Configure IP Addressing. 2.8 Verify Connectivity. 2.9 Integrate AI Tools for Explaining Concepts (Self Learning)"</p>

<div class="callout"><span class="badge">Opening question</span>
<p>You spend two hours configuring a switch. Everything works. That evening the building loses power for a second. The next morning the switch answers to <code>Switch&gt;</code> and nothing you configured exists.</p>
<p><strong>No error was ever printed, at any point.</strong> What did you miss, and what is the one command that would have prevented it?</p></div>

<h3>Every term, from zero</h3>
<ul>
<li><strong>RAM</strong> — volatile memory. Its contents disappear when power is removed.</li>
<li><strong>NVRAM</strong> — non-volatile RAM. Small, slow, and it survives power loss. This is the only reason your configuration comes back.</li>
<li><strong>running-config</strong> — the configuration the device is using <em>right now</em>, held in RAM. It changes the instant you press Enter.</li>
<li><strong>startup-config</strong> — the configuration held in NVRAM and loaded into RAM at boot. It changes only when you copy to it.</li>
<li><strong>copy running-config startup-config</strong> — the save. Abbreviated <code>copy run start</code>, or written <code>write memory</code> on older habits.</li>
<li><strong>erase startup-config</strong> — empty NVRAM, so the next reload comes up factory-fresh.</li>
<li><strong>Default gateway</strong> — the address a host sends packets to when the destination is not on its own network.</li>
<li><strong>SVI</strong> — switch virtual interface, normally <code>interface vlan 1</code>. It is where a Layer 2 switch keeps its own IP address.</li>
<li><strong>DHCP</strong> — a server that hands a host its address, mask, gateway and DNS automatically.</li>
</ul>

<h3>Why the design is like this</h3>
<p>Two copies look like duplication but they are what makes configuration safe to experiment with. Because the running configuration is in RAM and nothing writes it back on its own, a change that breaks the device can be undone by a power cycle — you lose the work, not the device. A system that saved every keystroke immediately would have no undo at all.</p>
<p>The price is the opening question: the same property that lets you throw away a mistake also throws away a success. IOS cannot tell the two apart, which is why it will never save for you and why <code>copy running-config startup-config</code> is the last line of every configuration block in this course.</p>`,

      `<span class="eyebrow">NWC204 · Chương 2 · Bài 2.3 · FLM buổi 4 · CLO2, CLO3, CLO9</span>
<h2>Lưu cấu hình, và thiết bị đầu cuối cần gì mới nói chuyện được</h2>
<p class="lead">Học xong bài này bạn nói được chính xác chuyện gì xảy ra với công sức của mình khi thiết bị mất điện, huỷ bỏ được một thay đổi hỏng mà không phải gỡ từng dòng, và chỉ nhìn triệu chứng là gọi tên được thiết lập nào trong bốn thiết lập của host đang sai.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 4 — "2.5 Save Configurations. 2.6 Ports and Addresses. 2.7 Configure IP Addressing. 2.8 Verify Connectivity. 2.9 Integrate AI Tools for Explaining Concepts (Self Learning)"</p>

<div class="callout"><span class="badge">Câu hỏi mở đầu</span>
<p>Bạn ngồi hai tiếng cấu hình một cái switch. Mọi thứ chạy ngon. Tối đó toà nhà mất điện một giây. Sáng hôm sau cái switch trả lời bằng <code>Switch&gt;</code> và mọi thứ bạn cấu hình đều không còn.</p>
<p><strong>Không có thông báo lỗi nào được in ra, ở bất kỳ thời điểm nào.</strong> Bạn đã bỏ sót điều gì, và MỘT câu lệnh nào đã có thể ngăn chuyện đó?</p></div>

<h3>Mọi thuật ngữ, từ số 0</h3>
<ul>
<li><strong>RAM</strong> — bộ nhớ bay hơi. Nội dung biến mất khi mất điện.</li>
<li><strong>NVRAM</strong> — RAM không bay hơi. Nhỏ, chậm, và sống sót qua mất điện. Đây là lý do DUY NHẤT cấu hình của bạn quay trở lại.</li>
<li><strong>running-config</strong> — cấu hình thiết bị đang dùng <em>ngay lúc này</em>, nằm trong RAM. Nó đổi ngay khoảnh khắc bạn bấm Enter.</li>
<li><strong>startup-config</strong> — cấu hình nằm trong NVRAM và được nạp vào RAM lúc khởi động. Nó chỉ đổi khi bạn copy sang.</li>
<li><strong>copy running-config startup-config</strong> — thao tác lưu. Viết tắt <code>copy run start</code>, hoặc theo thói quen cũ là <code>write memory</code>.</li>
<li><strong>erase startup-config</strong> — dọn sạch NVRAM, để lần khởi động sau máy lên như mới xuất xưởng.</li>
<li><strong>Default gateway</strong> — địa chỉ mà host gửi gói tới khi đích không nằm trong mạng của chính nó.</li>
<li><strong>SVI</strong> — switch virtual interface, thường là <code>interface vlan 1</code>. Đây là nơi switch tầng 2 giữ địa chỉ IP của chính nó.</li>
<li><strong>DHCP</strong> — một máy chủ cấp tự động cho host địa chỉ, mặt nạ, gateway và DNS.</li>
</ul>

<h3>Vì sao thiết kế như vậy</h3>
<p>Hai bản cấu hình trông như thừa, nhưng chính chúng làm cho việc cấu hình trở nên AN TOÀN để thử nghiệm. Vì cấu hình đang chạy nằm trong RAM và không có gì tự ghi nó ngược lại, một thay đổi làm hỏng thiết bị có thể gỡ bằng cách tắt bật nguồn — bạn mất công sức, không mất thiết bị. Một hệ thống ghi lại mọi phím ngay lập tức thì sẽ chẳng có nút hoàn tác nào cả.</p>
<p>Cái giá phải trả chính là câu hỏi mở đầu: đúng cái tính chất cho phép bạn vứt đi một sai lầm cũng vứt luôn một thành công. IOS không phân biệt được hai thứ đó, nên nó sẽ không bao giờ lưu giùm bạn, và vì thế <code>copy running-config startup-config</code> là dòng cuối cùng của mọi khối cấu hình trong môn này.</p>`,
    ),

    walkHead(D, 15, 18,
      'Slides 15–18 cover 2.5 Save Configurations and 2.6 Ports and Addresses, the first half of session 4.',
      'Slide 15–18 đi hết 2.5 Save Configurations và 2.6 Ports and Addresses, tức nửa đầu buổi 4.'),

    walk(D, [
      [15, '2.5 — running-config vs startup-config',
        `<p class="y-chinh">🎯 Two panels and two arrows. The arrows are the whole lesson: one is a command you type, the other happens by itself.</p>
<p class="nhan">Left panel — running-config, in RAM</p>
<ul>
<li>Volatile. Changes the instant you press Enter. Read it with <code>show running-config</code>.</li>
<li>After a power cut: <strong>gone</strong>, with no warning and no record.</li>
</ul>
<p class="nhan">Right panel — startup-config, in NVRAM</p>
<ul>
<li>Survives power loss. Changes only when you copy to it. Read it with <code>show startup-config</code>.</li>
<li>After a reload: <strong>this</strong> is what gets loaded into RAM.</li>
</ul>
<p class="nhan">The two arrows</p>
<ul>
<li>Left to right: <code>copy running-config startup-config</code> — you save, and now it survives.</li>
<li>Right to left: <code>reload</code> — boot copies NVRAM back into RAM, which is also how you discard everything unsaved.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>The warning box is the answer to the opening question.</strong> Forget the copy and two hours of work disappear at the next power cut with <em>no error message at any point</em>. The switch simply comes back as <code>Switch&gt;</code>.</div>`,
        `<p class="y-chinh">🎯 Hai ô và hai mũi tên. Hai mũi tên đó chính là toàn bộ bài học: một cái là lệnh bạn gõ, cái kia tự xảy ra.</p>
<p class="nhan">Ô trái — running-config, nằm trong RAM</p>
<ul>
<li>Bay hơi. Đổi ngay khoảnh khắc bạn bấm Enter. Đọc bằng <code>show running-config</code>.</li>
<li>Sau khi mất điện: <strong>mất sạch</strong>, không cảnh báo và không để lại dấu vết.</li>
</ul>
<p class="nhan">Ô phải — startup-config, nằm trong NVRAM</p>
<ul>
<li>Sống sót qua mất điện. Chỉ đổi khi bạn copy sang. Đọc bằng <code>show startup-config</code>.</li>
<li>Sau khi reload: <strong>chính nó</strong> được nạp vào RAM.</li>
</ul>
<p class="nhan">Hai mũi tên</p>
<ul>
<li>Trái sang phải: <code>copy running-config startup-config</code> — bạn lưu, và từ giờ nó sống sót.</li>
<li>Phải sang trái: <code>reload</code> — khởi động chép NVRAM ngược vào RAM, và đó cũng là cách bạn vứt bỏ mọi thứ chưa lưu.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Ô cảnh báo chính là lời giải cho câu hỏi mở đầu.</strong> Quên copy thì hai tiếng làm việc bay mất ở lần mất điện kế tiếp, <em>không có một thông báo lỗi nào ở bất cứ thời điểm nào</em>. Switch đơn giản là quay lại thành <code>Switch&gt;</code>.</div>`],

      [16, 'Saving, discarding, and starting over',
        `<p class="y-chinh">🎯 Four operations, and the table below rates the danger of each.</p>
<p class="nhan">The four steps</p>
<ul>
<li><strong>Save</strong> — <code>copy running-config startup-config</code> or <code>write memory</code>. IOS asks for a destination filename; press Enter to accept.</li>
<li><strong>Throw away unsaved changes</strong> — <code>reload</code> and answer <em>no</em> when asked to save. RAM is refilled from NVRAM.</li>
<li><strong>Factory-fresh</strong> — <code>erase startup-config</code> then <code>reload</code>. NVRAM is emptied first, so nothing comes back.</li>
<li><strong>Keep a copy off the device</strong> — <code>show running-config</code> captured to a text file, or <code>copy running-config tftp:</code>.</li>
</ul>
<p class="nhan">The danger column</p>
<ul>
<li>Saving is never dangerous.</li>
<li><code>reload</code> also drops every session and takes the link down for about a minute — fine in a lab, an outage in production.</li>
<li><code>erase startup-config</code> is irreversible unless you saved a text copy first. That is why step 4 exists.</li>
</ul>`,
        `<p class="y-chinh">🎯 Bốn thao tác, và cái bảng phía dưới chấm mức nguy hiểm của từng cái.</p>
<p class="nhan">Bốn bước</p>
<ul>
<li><strong>Lưu</strong> — <code>copy running-config startup-config</code> hoặc <code>write memory</code>. IOS hỏi tên file đích; bấm Enter để chấp nhận.</li>
<li><strong>Vứt bỏ thay đổi chưa lưu</strong> — <code>reload</code> rồi trả lời <em>no</em> khi nó hỏi có lưu không. RAM được nạp lại từ NVRAM.</li>
<li><strong>Về như mới xuất xưởng</strong> — <code>erase startup-config</code> rồi <code>reload</code>. NVRAM được dọn trước nên không có gì quay lại.</li>
<li><strong>Giữ một bản ngoài thiết bị</strong> — <code>show running-config</code> rồi hứng ra file văn bản, hoặc <code>copy running-config tftp:</code>.</li>
</ul>
<p class="nhan">Cột nguy hiểm</p>
<ul>
<li>Lưu thì không bao giờ nguy hiểm.</li>
<li><code>reload</code> đồng thời rớt mọi phiên và làm đường truyền chết khoảng một phút — trong lab thì không sao, trên hệ thống thật thì đó là một sự cố.</li>
<li><code>erase startup-config</code> là không thể đảo ngược trừ khi bạn đã lưu một bản văn bản từ trước. Đó chính là lý do bước 4 tồn tại.</li>
</ul>`],

      [17, '2.6 — What an end device needs before it can talk',
        `<p class="y-chinh">🎯 Four settings, and the highlighted row is the one that produces the complaint everybody misdiagnoses.</p>
<p class="nhan">The four rows</p>
<ul>
<li><strong>IP address</strong> — without it nothing can reach you at all.</li>
<li><strong>Subnet mask</strong> — without the right one, the host cannot tell local from remote, so it sends things the wrong way.</li>
<li><strong>Default gateway</strong> — without it, off-network traffic fails while the LAN still works perfectly.</li>
<li><strong>DNS server</strong> — without it, addresses work and names do not.</li>
</ul>
<p class="nhan">The two boxes underneath</p>
<ul>
<li>Only the gateway row produces the classic <em>"the internet is down"</em>: the LAN works, so users blame the ISP while the fault is one missing line on their own machine.</li>
<li><strong>Static</strong> means you type all four — for servers, routers and switch management. <strong>DHCP</strong> means a server hands out all four — for user PCs and phones.</li>
</ul>`,
        `<p class="y-chinh">🎯 Bốn thiết lập, và dòng được tô sáng chính là dòng sinh ra lời than phiền mà ai cũng chẩn đoán nhầm.</p>
<p class="nhan">Bốn dòng</p>
<ul>
<li><strong>Địa chỉ IP</strong> — không có nó thì không gì tới được bạn cả.</li>
<li><strong>Mặt nạ mạng</strong> — không có cái đúng thì host không phân biệt được nội bộ với ở xa, nên nó gửi sai hướng.</li>
<li><strong>Default gateway</strong> — không có nó thì lưu lượng ra ngoài mạng hỏng trong khi LAN vẫn chạy hoàn hảo.</li>
<li><strong>Máy chủ DNS</strong> — không có nó thì địa chỉ chạy được còn tên thì không.</li>
</ul>
<p class="nhan">Hai ô phía dưới</p>
<ul>
<li>Chỉ dòng gateway mới sinh ra câu kinh điển <em>"mất mạng rồi"</em>: LAN vẫn chạy, nên người dùng đổ lỗi cho nhà mạng trong khi lỗi là một dòng thiếu trên chính máy họ.</li>
<li><strong>Tĩnh</strong> nghĩa là bạn tự gõ cả bốn — cho máy chủ, router và phần quản trị switch. <strong>DHCP</strong> nghĩa là một máy chủ cấp cả bốn — cho PC người dùng và điện thoại.</li>
</ul>`],

      [18, 'Why a switch needs an IP address at all',
        `<p class="y-chinh">🎯 The apparent contradiction of the chapter, resolved in four rows: forwarding needs no IP, management does.</p>
<p class="nhan">The four rows</p>
<ul>
<li><strong>Forwarding frames</strong> needs <em>no</em> IP — the switch reads MAC addresses only, which is why slide 2 showed two PCs already pinging each other.</li>
<li><strong>Being managed</strong> needs an IP — SSH, Telnet, SNMP and syslog are all IP traffic and have to arrive somewhere.</li>
<li><strong>Where that IP lives</strong> — on a switch virtual interface, normally <code>interface vlan 1</code>. Not on a physical port.</li>
<li><strong>Reaching the switch from another subnet</strong> also needs <code>ip default-gateway</code> on the switch itself.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>The closing box is a test you should actually run.</strong> A Layer 2 switch port has no IP address. Type <code>interface fa0/1</code> then <code>ip address ...</code> and IOS rejects it — and that rejection is the lesson, because it proves the switch really does forward without one.</div>`,
        `<p class="y-chinh">🎯 Mâu thuẫn bề ngoài của cả chương, được giải trong bốn dòng: chuyển frame thì không cần IP, quản trị thì cần.</p>
<p class="nhan">Bốn dòng</p>
<ul>
<li><strong>Chuyển frame</strong> <em>không</em> cần IP — switch chỉ đọc địa chỉ MAC, đó là lý do slide 2 cho thấy hai PC đã ping được nhau.</li>
<li><strong>Được quản trị</strong> thì cần IP — SSH, Telnet, SNMP và syslog đều là lưu lượng IP và phải tới được một địa chỉ nào đó.</li>
<li><strong>Cái IP đó nằm ở đâu</strong> — trên một switch virtual interface, thường là <code>interface vlan 1</code>. Không nằm trên cổng vật lý.</li>
<li><strong>Quản trị switch từ subnet khác</strong> còn cần thêm <code>ip default-gateway</code> ngay trên chính switch.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Ô kết là một phép thử bạn nên chạy thật.</strong> Cổng của switch tầng 2 không có địa chỉ IP. Gõ <code>interface fa0/1</code> rồi <code>ip address ...</code> và IOS sẽ từ chối — chính cú từ chối đó là bài học, vì nó chứng minh switch thật sự chuyển frame mà không cần IP nào.</div>`],
    ]),

    bi(
      `<h3>A worked example: proving the two configurations are different</h3>
<p>Change something, then compare the two copies before saving:</p>
<pre><code class="language-bash">configure terminal
hostname S1-TEST
end
show running-config | include hostname
show startup-config | include hostname</code></pre>
<pre><code class="language-plaintext">hostname S1-TEST      &lt;- running-config, already changed
hostname S1           &lt;- startup-config, still the old name</code></pre>
<p>The two disagree, which is exactly the state that loses your work. Now save and compare again:</p>
<pre><code class="language-bash">copy running-config startup-config</code></pre>
<pre><code class="language-plaintext">Destination filename [startup-config]?
Building configuration...
[OK]</code></pre>

<div class="callout ok"><strong>🔍 How to check it yourself</strong>
<ul>
<li><code>show startup-config</code> — <strong>right:</strong> the configuration you expect. <strong>Wrong:</strong> <code>startup-config is not present</code> means NVRAM is empty and a reload will come up factory-fresh, losing everything.</li>
<li><strong>The real test:</strong> compare <code>show running-config</code> with <code>show startup-config</code>. If they differ, you have unsaved work. Do this before you leave any device.</li>
<li><code>show ip interface brief</code> on a switch — <strong>right:</strong> a <code>Vlan1</code> line with your management address, up/up. <strong>Wrong:</strong> <code>Vlan1 unassigned administratively down</code> means the SVI exists but has no address and is shut.</li>
<li>On a host, <code>ipconfig /all</code> or <code>ip route show</code> — <strong>right:</strong> address, mask, gateway and DNS all present and consistent. <strong>Wrong:</strong> gateway missing, or a gateway that is not inside your own subnet, which is the same failure wearing a different hat.</li>
<li><strong>After any reload, check again.</strong> A device that came back different from how you left it is a device whose configuration was never saved.</li>
</ul></div>

<div class="pitfall co-tieu-de"><strong>Trap 1 — assuming IOS saves automatically.</strong> Symptom: everything works all afternoon, and after a power cut the device is blank. No prompt, no warning, no log entry — and no way to recover the work.
<p><strong>Trap 2 — copying in the wrong direction.</strong> Symptom: you type <code>copy startup-config running-config</code> meaning to save, and instead merge the OLD configuration on top of your new one. Your changes are not removed but old lines come back, producing a configuration that matches neither.</p>
<p><strong>Trap 3 — giving a Layer 2 switch port an IP address.</strong> Symptom: <code>ip address</code> under <code>interface fa0/1</code> is rejected, and the student concludes the switch is faulty. The address belongs on <code>interface vlan 1</code>.</p>
<p><strong>Trap 4 — a default gateway outside the host's own subnet.</strong> Symptom: the LAN works, the internet does not, and <code>ipconfig</code> looks "full" so nobody suspects it. A host at 192.168.1.10/24 with gateway 192.168.2.1 cannot reach its own gateway, because by its own mask that address is not local.</p></div>

<h3>Exercise</h3>
<p><strong>(a)</strong> A colleague reports: "I configured the switch yesterday, it worked, today nothing is there". Give the two commands that confirm the diagnosis in under ten seconds, and the command that would have prevented it.</p>
<p><strong>(b)</strong> A PC is set to 10.10.5.40, mask 255.255.255.0, gateway 10.10.6.1, DNS 8.8.8.8. Predict exactly which of these work and which fail: ping 10.10.5.1, ping 10.10.6.1, ping 8.8.8.8, ping google.com.</p>

<div class="dap-an"><strong>Solution (a).</strong> <code>show startup-config</code> and <code>show running-config</code>. If the startup configuration is the old one (or reports <em>startup-config is not present</em>) while the running one is the default, the work was never copied to NVRAM and the device reloaded at some point overnight. The preventive command is <code>copy running-config startup-config</code> — and the habit that makes it automatic is running it as the last line of every configuration block, which is why slide 14 ends with it.
<p><strong>Solution (b).</strong> With a /24 mask the PC's own network is 10.10.5.0. <strong>ping 10.10.5.1 works</strong> if that host exists — it is local, so no gateway is involved. <strong>ping 10.10.6.1 fails</strong>: 10.10.6.1 is not local, so the PC hands the packet to its default gateway, which is 10.10.6.1 itself — an address it cannot reach without a gateway. The request is never sent. <strong>ping 8.8.8.8 fails</strong> for the same reason: every off-network packet needs a reachable gateway and there is none. <strong>ping google.com fails</strong> too, and worse, it fails at the DNS step first, because reaching 8.8.8.8 requires the same broken gateway. One wrong octet in the gateway breaks three of the four tests, and the LAN keeps working — which is precisely why this fault is reported as "the internet is down".</p></div>`,

      `<h3>Ví dụ đi hết: chứng minh hai bản cấu hình đang khác nhau</h3>
<p>Thay đổi một thứ, rồi so hai bản TRƯỚC khi lưu:</p>
<pre><code class="language-bash">configure terminal
hostname S1-TEST
end
show running-config | include hostname
show startup-config | include hostname</code></pre>
<pre><code class="language-plaintext">hostname S1-TEST      &lt;- running-config, da doi roi
hostname S1           &lt;- startup-config, van ten cu</code></pre>
<p>Hai bản đang lệch nhau, và đó đúng là trạng thái làm mất công sức của bạn. Giờ lưu lại và so lần nữa:</p>
<pre><code class="language-bash">copy running-config startup-config</code></pre>
<pre><code class="language-plaintext">Destination filename [startup-config]?
Building configuration...
[OK]</code></pre>

<div class="callout ok"><strong>🔍 Cách tự kiểm</strong>
<ul>
<li><code>show startup-config</code> — <strong>đúng:</strong> ra đúng cấu hình bạn mong đợi. <strong>Sai:</strong> dòng <code>startup-config is not present</code> nghĩa là NVRAM đang rỗng và một lần reload sẽ đưa máy về như mới xuất xưởng, mất sạch.</li>
<li><strong>Phép thử thật:</strong> so <code>show running-config</code> với <code>show startup-config</code>. Lệch nhau nghĩa là bạn đang có công việc chưa lưu. Hãy làm điều này trước khi rời khỏi bất kỳ thiết bị nào.</li>
<li><code>show ip interface brief</code> trên switch — <strong>đúng:</strong> có dòng <code>Vlan1</code> mang địa chỉ quản trị, trạng thái up/up. <strong>Sai:</strong> <code>Vlan1 unassigned administratively down</code> nghĩa là SVI có tồn tại nhưng chưa có địa chỉ và đang bị tắt.</li>
<li>Trên host, <code>ipconfig /all</code> hoặc <code>ip route show</code> — <strong>đúng:</strong> đủ địa chỉ, mặt nạ, gateway và DNS, và chúng nhất quán với nhau. <strong>Sai:</strong> thiếu gateway, hoặc gateway không nằm trong subnet của chính bạn — cùng một lỗi đội cái mũ khác.</li>
<li><strong>Sau mỗi lần reload, kiểm lại.</strong> Một thiết bị quay lại khác với lúc bạn rời đi là thiết bị chưa từng được lưu cấu hình.</li>
</ul></div>

<div class="pitfall co-tieu-de"><strong>Bẫy 1 — tưởng IOS tự lưu.</strong> Triệu chứng: cả buổi chiều mọi thứ chạy, rồi sau một lần mất điện thiết bị trắng trơn. Không dấu nhắc, không cảnh báo, không dòng log nào — và không cách nào lấy lại công sức.
<p><strong>Bẫy 2 — copy ngược chiều.</strong> Triệu chứng: bạn gõ <code>copy startup-config running-config</code> với ý định lưu, và thay vào đó trộn cấu hình CŨ đè lên cấu hình mới. Thay đổi của bạn không bị xoá nhưng các dòng cũ quay lại, tạo ra một cấu hình không giống bản nào cả.</p>
<p><strong>Bẫy 3 — gán địa chỉ IP cho cổng của switch tầng 2.</strong> Triệu chứng: <code>ip address</code> dưới <code>interface fa0/1</code> bị từ chối, và sinh viên kết luận switch hỏng. Địa chỉ đó thuộc về <code>interface vlan 1</code>.</p>
<p><strong>Bẫy 4 — default gateway nằm ngoài subnet của chính host.</strong> Triệu chứng: LAN chạy, internet thì không, và <code>ipconfig</code> nhìn "đầy đủ" nên không ai nghi ngờ. Một host 192.168.1.10/24 với gateway 192.168.2.1 không thể với tới chính cái gateway của nó, vì theo mặt nạ của nó thì địa chỉ đó không nội bộ.</p></div>

<h3>Bài tập</h3>
<p><strong>(a)</strong> Một đồng nghiệp báo: "hôm qua tôi cấu hình switch, chạy ngon, hôm nay chẳng còn gì". Hãy nêu HAI câu lệnh xác nhận chẩn đoán trong chưa tới mười giây, và câu lệnh lẽ ra đã ngăn được chuyện đó.</p>
<p><strong>(b)</strong> Một PC được đặt 10.10.5.40, mặt nạ 255.255.255.0, gateway 10.10.6.1, DNS 8.8.8.8. Hãy dự đoán chính xác cái nào chạy và cái nào hỏng: ping 10.10.5.1, ping 10.10.6.1, ping 8.8.8.8, ping google.com.</p>

<div class="dap-an"><strong>Lời giải (a).</strong> <code>show startup-config</code> và <code>show running-config</code>. Nếu bản startup là bản cũ (hoặc báo <em>startup-config is not present</em>) trong khi bản running là cấu hình mặc định, thì công sức chưa bao giờ được chép vào NVRAM và thiết bị đã reload ở đâu đó trong đêm. Câu lệnh phòng ngừa là <code>copy running-config startup-config</code> — và thói quen biến nó thành tự động là chạy nó ở dòng cuối cùng của MỌI khối cấu hình, đó chính là lý do slide 14 kết thúc bằng nó.
<p><strong>Lời giải (b).</strong> Với mặt nạ /24 thì mạng của chính PC là 10.10.5.0. <strong>ping 10.10.5.1 chạy</strong> nếu máy đó tồn tại — nó nội bộ, nên không dính dáng gì tới gateway. <strong>ping 10.10.6.1 hỏng</strong>: 10.10.6.1 không nội bộ, nên PC giao gói cho default gateway, mà default gateway chính là 10.10.6.1 — một địa chỉ nó không với tới được nếu không có gateway. Gói thậm chí không bao giờ được gửi đi. <strong>ping 8.8.8.8 hỏng</strong> vì cùng lý do: mọi gói ra ngoài mạng đều cần một gateway với tới được, mà ở đây không có. <strong>ping google.com cũng hỏng</strong>, và còn hỏng sớm hơn ở bước DNS, vì với tới 8.8.8.8 lại cần đúng cái gateway hỏng đó. Sai MỘT octet trong gateway làm hỏng ba trên bốn phép thử, trong khi LAN vẫn chạy — và đó chính xác là lý do sự cố này luôn được báo lên thành "mất mạng".</p></div>`,
    ),

    cq(4, [
      ['CQ2.1', 'How to write the correct command in Cisco IOS?', 'Viết một câu lệnh Cisco IOS cho đúng thì làm thế nào?'],
    ]),

    bi(
      `<div class="note-ct"><strong>How to answer CQ2.1 well.</strong>
<p>A complete answer has four parts, in this order. <strong>First, be in the right mode</strong> — the prompt tells you, and most "invalid input" errors are a mode error, not a spelling error. <strong>Second, get the structure right</strong> — keywords, which IOS defines and will abbreviate, then arguments, which you supply and it will not. <strong>Third, use the device's own help</strong> — <code>?</code> at the point of doubt, and Tab to complete. <strong>Fourth, read the error you actually got</strong> — Ambiguous means add letters, Incomplete means add an argument, Invalid input means look at where the <code>^</code> points.</p>
<p>An answer that stops at "use the right syntax" is not wrong, but it does not show any of the four.</p></div>`,
      `<div class="note-ct"><strong>Cách trả lời CQ2.1 cho tốt.</strong>
<p>Một câu trả lời trọn vẹn có bốn phần, theo đúng thứ tự này. <strong>Một, đứng đúng chế độ</strong> — dấu nhắc nói cho bạn biết, và phần lớn lỗi "invalid input" là lỗi CHẾ ĐỘ chứ không phải lỗi chính tả. <strong>Hai, đúng cấu trúc</strong> — keyword, thứ do IOS định nghĩa và cho viết tắt, rồi tới argument, thứ bạn tự điền và nó không viết tắt. <strong>Ba, dùng chính trợ giúp của thiết bị</strong> — gõ <code>?</code> ngay chỗ đang phân vân, và Tab để hoàn tất. <strong>Bốn, đọc đúng cái lỗi bạn vừa nhận</strong> — Ambiguous là thêm chữ, Incomplete là thêm argument, Invalid input là nhìn vào chỗ dấu <code>^</code> đang chỉ.</p>
<p>Một câu trả lời dừng ở "dùng đúng cú pháp" thì không sai, nhưng nó không thể hiện được phần nào trong bốn phần đó.</p></div>`,
    ),
  ].join('\n'),
};

/* ════════════════════════════════════════════════════════════════════════════
   Bài 2.4 — buổi 4: 2.7 Configure IP Addressing · 2.8 Verify Connectivity
   ════════════════════════════════════════════════════════════════════════════ */
const L24 = {
  title: '2.4 — Configuring IP addressing and verifying connectivity|||2.4 — Cấu hình địa chỉ IP và kiểm tra kết nối',
  slug: 'nwc204-2-4-cau-hinh-ip-va-kiem-tra-ket-noi',
  type: 'VIDEO',
  description: 'FLM buổi 4 nửa sau (CLO2, CLO3, CLO9): đặt địa chỉ quản trị cho SVI Vlan1; đặt IP trên Windows/Linux/macOS; đọc cột Status và Protocol của show ip interface brief — administratively down khác down ra sao; đọc từng ký tự của ping.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 2 · Lesson 2.4 · FLM session 4 · CLO2, CLO3, CLO9</span>
<h2>Configuring IP addressing and verifying connectivity</h2>
<p class="lead">After this lesson you can give a switch a management address, set the same four values on any host operating system, and read <code>show ip interface brief</code> and <code>ping</code> precisely enough to name the layer a fault is on.</p>
<p class="nhan">Source: FLM · Syllabus 14520 · session 4 — "2.7 Configure IP Addressing. 2.8 Verify Connectivity"</p>

<div class="callout"><span class="badge">Opening question</span>
<p>Two ports on a switch both look dead to the user. <code>show ip interface brief</code> says one is <code>down</code> and the other is <code>administratively down</code>.</p>
<p><strong>They are completely different problems and one of them is your own fault.</strong> Which is which, and what do you do about each?</p></div>

<h3>Every term, from zero</h3>
<ul>
<li><strong>Status</strong> — the first of the two columns, reporting layer 1: is there a signal on the wire?</li>
<li><strong>Protocol</strong> — the second column, reporting layer 2: do both ends agree on how to frame the data?</li>
<li><strong>administratively down</strong> — a third state that is neither: somebody typed <code>shutdown</code>, so the interface is switched off by configuration.</li>
<li><strong>no shutdown</strong> — the command that switches it back on. An SVI is administratively down until you type it.</li>
<li><strong>ICMP echo</strong> — what <code>ping</code> sends. A reply proves the destination received it <em>and</em> that the return path works.</li>
<li><strong>ARP</strong> — the step where a host learns the MAC address behind an IP address. Its cost is the first lost ping in <code>.!!!!</code>.</li>
<li><strong>Destination unreachable</strong> — shown as <code>U</code> in IOS ping output. It means a router answered, which is very different from silence.</li>
</ul>

<h3>Why the design is like this</h3>
<p>The two columns exist because two independent things must be true before a link works, and separating them halves the search space. Status up with protocol down means the electricity arrived and the agreement did not — a configuration mismatch. Both down means nothing arrived at all — a cable, a port, or the other end. One reading, two entirely different investigations.</p>
<p>The <code>administratively down</code> state is separate on purpose. If a shut interface merely showed <code>down</code>, you could spend an hour testing cables on a port that a colleague deliberately switched off last month. IOS tells you it was a decision, not a failure — and that distinction is the answer to the opening question.</p>`,

      `<span class="eyebrow">NWC204 · Chương 2 · Bài 2.4 · FLM buổi 4 · CLO2, CLO3, CLO9</span>
<h2>Cấu hình địa chỉ IP và kiểm tra kết nối</h2>
<p class="lead">Học xong bài này bạn cấp được địa chỉ quản trị cho switch, đặt được đúng bốn giá trị đó trên mọi hệ điều hành host, và đọc <code>show ip interface brief</code> cùng <code>ping</code> đủ chính xác để gọi tên TẦNG mà sự cố đang nằm.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 4 — "2.7 Configure IP Addressing. 2.8 Verify Connectivity"</p>

<div class="callout"><span class="badge">Câu hỏi mở đầu</span>
<p>Hai cổng trên một switch, với người dùng thì cả hai đều chết như nhau. <code>show ip interface brief</code> báo một cổng là <code>down</code> còn cổng kia là <code>administratively down</code>.</p>
<p><strong>Đó là hai sự cố hoàn toàn khác nhau và một trong hai là lỗi của chính bạn.</strong> Cái nào là cái nào, và mỗi cái thì làm gì?</p></div>

<h3>Mọi thuật ngữ, từ số 0</h3>
<ul>
<li><strong>Status</strong> — cột thứ nhất trong hai cột, báo cáo tầng 1: trên sợi dây có tín hiệu không?</li>
<li><strong>Protocol</strong> — cột thứ hai, báo cáo tầng 2: hai đầu có thống nhất cách đóng khung dữ liệu không?</li>
<li><strong>administratively down</strong> — một trạng thái thứ ba không thuộc hai cái trên: có người đã gõ <code>shutdown</code>, nên interface bị tắt bằng cấu hình.</li>
<li><strong>no shutdown</strong> — câu lệnh bật nó lại. Một SVI luôn ở trạng thái administratively down cho tới khi bạn gõ lệnh này.</li>
<li><strong>ICMP echo</strong> — thứ mà <code>ping</code> gửi đi. Có hồi đáp nghĩa là đích ĐÃ nhận được <em>và</em> đường về cũng chạy.</li>
<li><strong>ARP</strong> — bước mà host học được địa chỉ MAC nằm sau một địa chỉ IP. Cái giá của nó chính là gói ping đầu tiên bị mất trong chuỗi <code>.!!!!</code>.</li>
<li><strong>Destination unreachable</strong> — hiện ra là chữ <code>U</code> trong kết xuất ping của IOS. Nó nghĩa là CÓ một router trả lời, khác hẳn với sự im lặng.</li>
</ul>

<h3>Vì sao thiết kế như vậy</h3>
<p>Hai cột tồn tại vì phải có HAI điều độc lập cùng đúng thì một đường truyền mới chạy, và tách chúng ra làm không gian tìm kiếm giảm một nửa. Status up mà protocol down nghĩa là điện đã tới còn thoả thuận thì chưa — lệch cấu hình. Cả hai cùng down nghĩa là chẳng có gì tới cả — cáp, cổng, hoặc đầu bên kia. Một lần đọc, hai cuộc điều tra hoàn toàn khác nhau.</p>
<p>Trạng thái <code>administratively down</code> được tách riêng là CÓ CHỦ ĐÍCH. Nếu một cổng bị tắt chỉ hiện <code>down</code>, bạn có thể ngồi cả tiếng thử cáp trên một cổng mà đồng nghiệp đã cố ý tắt từ tháng trước. IOS nói cho bạn biết đó là một QUYẾT ĐỊNH chứ không phải một sự cố — và chính phân biệt ấy là lời giải cho câu hỏi mở đầu.</p>`,
    ),

    walkHead(D, 19, 22,
      'Slides 19–22 cover 2.7 Configure IP Addressing and 2.8 Verify Connectivity, the second half of session 4.',
      'Slide 19–22 đi hết 2.7 Configure IP Addressing và 2.8 Verify Connectivity, tức nửa sau buổi 4.'),

    walk(D, [
      [19, '2.7 — Give the switch its management address',
        `<p class="y-chinh">🎯 Seven lines of configuration and the show command that proves each one worked.</p>
<p class="nhan">Walking the configuration</p>
<ul>
<li><code>interface vlan 1</code> — the SVI: the switch's own presence on the network, not a physical port.</li>
<li><code>ip address 192.168.1.2 255.255.255.0</code> — the address and mask, both arguments, neither abbreviable.</li>
<li><code>no shutdown</code> — an SVI is administratively down until you say this. Miss it and everything else looks correct while nothing works.</li>
<li><code>ip default-gateway 192.168.1.1</code> — only needed to manage the switch from another subnet.</li>
<li><code>copy running-config startup-config</code> — the habit from lesson 2.3.</li>
</ul>
<p class="nhan">Reading the output</p>
<ul>
<li><strong>Vlan1 ... up up</strong>, in green — the goal.</li>
<li><strong>Fa0/2 down down</strong> — nothing is plugged in.</li>
<li><strong>Fa0/3 administratively down</strong> — somebody typed <code>shutdown</code>. Two very different problems that look alike from a user's desk.</li>
</ul>`,
        `<p class="y-chinh">🎯 Bảy dòng cấu hình và câu lệnh show chứng minh từng dòng đã có tác dụng.</p>
<p class="nhan">Đi qua từng dòng cấu hình</p>
<ul>
<li><code>interface vlan 1</code> — chính là SVI: sự hiện diện của bản thân switch trên mạng, không phải một cổng vật lý.</li>
<li><code>ip address 192.168.1.2 255.255.255.0</code> — địa chỉ và mặt nạ, cả hai đều là argument, không cái nào viết tắt được.</li>
<li><code>no shutdown</code> — một SVI luôn administratively down cho tới khi bạn gõ câu này. Bỏ sót nó thì mọi thứ khác nhìn đều đúng trong khi chẳng có gì chạy.</li>
<li><code>ip default-gateway 192.168.1.1</code> — chỉ cần khi muốn quản trị switch từ subnet khác.</li>
<li><code>copy running-config startup-config</code> — thói quen từ bài 2.3.</li>
</ul>
<p class="nhan">Đọc kết xuất</p>
<ul>
<li><strong>Vlan1 ... up up</strong>, màu xanh — đây là mục tiêu.</li>
<li><strong>Fa0/2 down down</strong> — không có gì cắm vào.</li>
<li><strong>Fa0/3 administratively down</strong> — có người đã gõ <code>shutdown</code>. Hai sự cố rất khác nhau mà nhìn từ bàn làm việc của người dùng thì giống hệt.</li>
</ul>`],

      [20, 'The same four settings, on the three host operating systems',
        `<p class="y-chinh">🎯 The same four values as slide 17, expressed three ways, plus three symptoms you will meet on real machines.</p>
<p class="nhan">The commands</p>
<ul>
<li><strong>Linux</strong> — <code>ip addr show</code> for address and mask, <code>ip route show</code> for the gateway, <code>resolvectl status</code> for DNS. Permanent changes go in netplan or NetworkManager, not in these commands.</li>
<li><strong>macOS</strong> — <code>ipconfig getifaddr en0</code>, and <code>netstat -rn | grep default</code>.</li>
<li><strong>Windows</strong> — <code>ipconfig /all</code> shows all four at once; <code>ipconfig /release</code> and <code>/renew</code> ask DHCP again.</li>
</ul>
<p class="nhan">The three symptoms underneath</p>
<ul>
<li><strong>169.254.x.x on Windows</strong> — DHCP never answered and the PC invented a link-local address. Check the cable and the DHCP server, not the PC.</li>
<li><strong>No default route</strong> — ping works inside the LAN and nothing else does.</li>
<li><strong>Right address, wrong mask</strong> — the host misjudges who is local, so some destinations work and some do not, apparently at random.</li>
</ul>`,
        `<p class="y-chinh">🎯 Vẫn bốn giá trị của slide 17, diễn đạt theo ba cách, kèm ba triệu chứng bạn sẽ gặp trên máy thật.</p>
<p class="nhan">Các câu lệnh</p>
<ul>
<li><strong>Linux</strong> — <code>ip addr show</code> cho địa chỉ và mặt nạ, <code>ip route show</code> cho gateway, <code>resolvectl status</code> cho DNS. Muốn đổi vĩnh viễn thì phải sửa netplan hoặc NetworkManager, không phải bằng mấy lệnh này.</li>
<li><strong>macOS</strong> — <code>ipconfig getifaddr en0</code>, và <code>netstat -rn | grep default</code>.</li>
<li><strong>Windows</strong> — <code>ipconfig /all</code> hiện cả bốn cùng lúc; <code>ipconfig /release</code> và <code>/renew</code> để xin DHCP lại.</li>
</ul>
<p class="nhan">Ba triệu chứng phía dưới</p>
<ul>
<li><strong>169.254.x.x trên Windows</strong> — DHCP không hề trả lời và PC tự bịa ra một địa chỉ link-local. Hãy kiểm sợi cáp và máy chủ DHCP, đừng kiểm cái PC.</li>
<li><strong>Không có default route</strong> — ping trong LAN thì chạy, mọi thứ khác thì không.</li>
<li><strong>Địa chỉ đúng, mặt nạ sai</strong> — host phán đoán sai ai là nội bộ, nên vài đích chạy vài đích không, nhìn như ngẫu nhiên.</li>
</ul>`],

      [21, '2.8 — The four states of Status / Protocol',
        `<p class="y-chinh">🎯 The most useful table in the chapter, and the answer to this lesson's opening question.</p>
<p class="nhan">The four states</p>
<ul>
<li><strong>up / up</strong> — layers 1 and 2 both healthy. Nothing to do.</li>
<li><strong>up / down</strong> — signal present, no protocol agreement. Compare the configuration of both ends; on serial links this is an encapsulation or clock-rate mismatch.</li>
<li><strong>down / down</strong> — layer 1 fails. No cable, wrong cable, dead port, or the other end is shut. Check cable, then port, then the other device.</li>
<li><strong>administratively down</strong> — somebody typed <code>shutdown</code>. Fix: <code>no shutdown</code> on that interface.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>The warning box, and the reason this table exists.</strong> <em>down</em> and <em>administratively down</em> look identical to a user — "the port is dead" — but one is a cable and one is a command. Reading that difference is the whole value of the table, and it is the difference between a two-second fix and an hour with a cable tester.</div>`,
        `<p class="y-chinh">🎯 Cái bảng hữu ích nhất của cả chương, và là lời giải cho câu hỏi mở đầu bài này.</p>
<p class="nhan">Bốn trạng thái</p>
<ul>
<li><strong>up / up</strong> — cả tầng 1 và tầng 2 đều khoẻ. Không phải làm gì.</li>
<li><strong>up / down</strong> — có tín hiệu, chưa có thoả thuận giao thức. Hãy so cấu hình hai đầu; trên đường serial thì đây là lệch encapsulation hoặc lệch clock rate.</li>
<li><strong>down / down</strong> — tầng 1 hỏng. Không cáp, sai cáp, cổng chết, hoặc đầu bên kia đang bị tắt. Kiểm cáp, rồi cổng, rồi thiết bị đầu kia.</li>
<li><strong>administratively down</strong> — có người đã gõ <code>shutdown</code>. Cách sửa: <code>no shutdown</code> trên chính interface đó.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Ô cảnh báo, và lý do cái bảng này tồn tại.</strong> <em>down</em> và <em>administratively down</em> nhìn từ phía người dùng thì giống hệt nhau — "cổng chết rồi" — nhưng một cái là sợi cáp và một cái là câu lệnh. Đọc ra được khác biệt đó chính là toàn bộ giá trị của cái bảng, và nó là khác biệt giữa hai giây sửa xong với một tiếng ngồi với máy đo cáp.</div>`],

      [22, 'Reading a ping, character by character',
        `<p class="y-chinh">🎯 A real IOS ping and a table of the characters it can print. The highlighted row is the one people report as a fault when it is not.</p>
<p class="nhan">The transcript</p>
<ul>
<li>IOS sends five 100-byte echoes with a two-second timeout and prints one character per packet.</li>
<li><code>.!!!!</code> gives "Success rate is 80 percent (4/5)" — which looks like a failure and is not.</li>
</ul>
<p class="nhan">The characters</p>
<ul>
<li><code>!!!!!</code> — five replies, success.</li>
<li><code>.!!!!</code> — the first packet was lost while ARP resolved the destination MAC; the rest are fine. <strong>Normal, not a fault.</strong></li>
<li><code>.....</code> — timed out. It could be the forward path, the return path, or a firewall; ping cannot tell you which, and this is its main limitation.</li>
<li><code>U.U.U</code> — a router replied "destination unreachable". Something on the path <em>answered</em>, so this is routing or a gateway, not a cable.</li>
</ul>`,
        `<p class="y-chinh">🎯 Một lần ping thật trên IOS và bảng các ký tự nó có thể in ra. Dòng được tô sáng là thứ người ta hay báo là sự cố trong khi nó không phải.</p>
<p class="nhan">Bản ghi</p>
<ul>
<li>IOS gửi năm gói echo 100 byte với timeout hai giây và in ra một ký tự cho mỗi gói.</li>
<li><code>.!!!!</code> cho ra dòng "Success rate is 80 percent (4/5)" — nhìn như hỏng mà thật ra không hỏng.</li>
</ul>
<p class="nhan">Các ký tự</p>
<ul>
<li><code>!!!!!</code> — năm hồi đáp, thành công.</li>
<li><code>.!!!!</code> — gói đầu tiên mất trong lúc ARP đi hỏi địa chỉ MAC của đích; các gói sau đều ổn. <strong>Bình thường, không phải sự cố.</strong></li>
<li><code>.....</code> — hết giờ. Có thể là đường đi, đường về, hoặc một tường lửa; ping không nói được là cái nào, và đây là giới hạn lớn nhất của nó.</li>
<li><code>U.U.U</code> — một router đã trả lời "destination unreachable". Có thứ gì đó trên đường đi ĐÃ đáp, nên đây là chuyện định tuyến hoặc gateway, không phải sợi cáp.</li>
</ul>`],
    ]),

    bi(
      `<h3>A worked example: three interfaces, three diagnoses</h3>
<pre><code class="language-bash">S1# show ip interface brief</code></pre>
<pre><code class="language-plaintext">Interface   IP-Address    OK? Method Status                Protocol
Vlan1       192.168.1.2   YES manual up                    up
Fa0/2       unassigned    YES unset  down                  down
Fa0/3       unassigned    YES unset  administratively down down</code></pre>
<p>Three lines, three different jobs. Vlan1 is finished. Fa0/2 needs a cable or a working device at the far end. Fa0/3 needs one command:</p>
<pre><code class="language-bash">configure terminal
interface fa0/3
 no shutdown
end
show ip interface brief | include Fa0/3</code></pre>
<pre><code class="language-plaintext">Fa0/3       unassigned    YES unset  up                    up</code></pre>

<div class="callout ok"><strong>🔍 How to check it yourself</strong>
<ul>
<li><code>show ip interface brief</code> — <strong>right:</strong> the interface you care about reads <code>up up</code>. <strong>Wrong, and what each means:</strong> <code>administratively down</code> is a command somebody typed, fix with <code>no shutdown</code>; <code>down down</code> is layer 1, check cable then port then the far device; <code>up down</code> is layer 2, compare the two ends' configuration.</li>
<li><code>ping</code> your own SVI address from the switch itself — <strong>right:</strong> <code>!!!!!</code>. This proves the address is configured and the interface is up, with no network involved at all.</li>
<li><code>ping</code> the switch from the PC — <strong>right:</strong> <code>.!!!!</code> or <code>!!!!!</code>. A leading dot is ARP and is normal. <strong>Wrong:</strong> all dots means the request or the reply is not getting through; check that both are in the same subnet before blaming anything else.</li>
<li><strong>Always ping in both directions.</strong> A one-way success is a real and common state: it proves the forward path works and says nothing about the return path.</li>
<li><code>show version</code> — <strong>right:</strong> IOS version, model, uptime. Use the uptime line to answer "did this device reboot?" before you assume somebody changed something.</li>
</ul></div>

<div class="pitfall co-tieu-de"><strong>Trap 1 — forgetting no shutdown on the SVI.</strong> Symptom: the address is right, the mask is right, <code>show running-config</code> shows exactly what you typed, and nothing answers. <code>show ip interface brief</code> says <code>administratively down</code> and has said so all along.
<p><strong>Trap 2 — reporting <code>.!!!!</code> as packet loss.</strong> Symptom: a lab report claims "20% loss on the link" when the single lost packet was ARP, once, at the start. Run the ping twice: the second run gives <code>!!!!!</code> because the ARP entry is now cached, and that is the proof.</p>
<p><strong>Trap 3 — reading a ping timeout as "the destination is off".</strong> Symptom: a machine is declared dead when in fact its replies are being dropped on the way back, or a host firewall is discarding ICMP. Silence means "no reply arrived", not "nothing received it" — which is exactly why <code>U</code> is a more informative result than a dot.</p>
<p><strong>Trap 4 — putting the management address on a physical port.</strong> Symptom: <code>ip address</code> under <code>interface fa0/1</code> is rejected on a Layer 2 switch, and the student tries three more ports before asking why. The address belongs on <code>interface vlan 1</code>, which is the whole point of slide 18.</p></div>

<h3>Exercise</h3>
<p><strong>(a)</strong> PC-A (192.168.1.10/24) cannot ping S1 (Vlan1 192.168.1.2/24). <code>show ip interface brief</code> on S1 shows <code>Vlan1 192.168.1.2 YES manual administratively down down</code> and <code>Fa0/6 unassigned YES unset up up</code>. Explain why the port being up does not help, and give the fix with its verification command.</p>
<p><strong>(b)</strong> From a switch, <code>ping 10.0.0.50</code> returns <code>U.U.U</code>. From the same switch, <code>ping 10.0.0.1</code> returns <code>!!!!!</code>. What has this ruled out, and what is the single most likely cause?</p>

<div class="dap-an"><strong>Solution (a).</strong> Fa0/6 being up proves only that a cable is connected and the link negotiated — layer 1 and 2 are fine, and frames from PC-A are reaching the switch and being forwarded normally. But the ping is addressed to the <em>switch itself</em>, and the switch answers from its SVI. An administratively down SVI has no active IP presence, so the echo request is received by the hardware and answered by nobody. Fix: <code>configure terminal</code>, <code>interface vlan 1</code>, <code>no shutdown</code>, <code>end</code>. Verify with <code>show ip interface brief | include Vlan1</code>, which must read <code>up up</code>, then ping again from PC-A and expect <code>.!!!!</code> the first time.
<p><strong>Solution (b).</strong> <code>!!!!!</code> to 10.0.0.1 proves the switch's own address, mask, interface and local path all work, so everything on the switch side is ruled out — and <code>U</code> rather than silence proves a router received the packet and answered, so the path to the router works too. What remains is that the router has no route to 10.0.0.50, or that 10.0.0.50 is in a subnet the router does not know about. The single most likely cause is a missing or wrong route on the gateway; the next command to run is <code>show ip route</code> on that router, not another ping.</p></div>`,

      `<h3>Ví dụ đi hết: ba interface, ba chẩn đoán</h3>
<pre><code class="language-bash">S1# show ip interface brief</code></pre>
<pre><code class="language-plaintext">Interface   IP-Address    OK? Method Status                Protocol
Vlan1       192.168.1.2   YES manual up                    up
Fa0/2       unassigned    YES unset  down                  down
Fa0/3       unassigned    YES unset  administratively down down</code></pre>
<p>Ba dòng, ba việc phải làm khác nhau. Vlan1 đã xong. Fa0/2 cần một sợi cáp hoặc một thiết bị còn sống ở đầu kia. Fa0/3 chỉ cần một câu lệnh:</p>
<pre><code class="language-bash">configure terminal
interface fa0/3
 no shutdown
end
show ip interface brief | include Fa0/3</code></pre>
<pre><code class="language-plaintext">Fa0/3       unassigned    YES unset  up                    up</code></pre>

<div class="callout ok"><strong>🔍 Cách tự kiểm</strong>
<ul>
<li><code>show ip interface brief</code> — <strong>đúng:</strong> interface bạn quan tâm hiện <code>up up</code>. <strong>Sai, và mỗi kiểu nghĩa là gì:</strong> <code>administratively down</code> là câu lệnh ai đó đã gõ, sửa bằng <code>no shutdown</code>; <code>down down</code> là tầng 1, kiểm cáp rồi cổng rồi thiết bị đầu kia; <code>up down</code> là tầng 2, so cấu hình hai đầu.</li>
<li><code>ping</code> chính địa chỉ SVI của mình, gõ từ trên switch — <strong>đúng:</strong> <code>!!!!!</code>. Điều này chứng minh địa chỉ đã cấu hình và interface đã lên, hoàn toàn không dính dáng tới mạng.</li>
<li><code>ping</code> switch từ PC — <strong>đúng:</strong> <code>.!!!!</code> hoặc <code>!!!!!</code>. Một dấu chấm ở đầu là ARP và là bình thường. <strong>Sai:</strong> toàn dấu chấm nghĩa là yêu cầu hoặc hồi đáp không đi qua được; hãy kiểm hai bên có cùng subnet không trước khi đổ lỗi cho thứ gì khác.</li>
<li><strong>Luôn ping theo CẢ HAI chiều.</strong> Thành công một chiều là một trạng thái có thật và rất hay gặp: nó chứng minh đường đi chạy và không nói gì về đường về.</li>
<li><code>show version</code> — <strong>đúng:</strong> phiên bản IOS, model, thời gian chạy. Hãy dùng dòng uptime để trả lời "thiết bị này có khởi động lại không?" trước khi giả định là có ai đó đổi gì.</li>
</ul></div>

<div class="pitfall co-tieu-de"><strong>Bẫy 1 — quên no shutdown trên SVI.</strong> Triệu chứng: địa chỉ đúng, mặt nạ đúng, <code>show running-config</code> hiện chính xác những gì bạn gõ, mà không có gì trả lời. <code>show ip interface brief</code> báo <code>administratively down</code>, và nó đã báo như vậy ngay từ đầu.
<p><strong>Bẫy 2 — báo cáo <code>.!!!!</code> thành mất gói.</strong> Triệu chứng: một báo cáo lab khẳng định "đường truyền mất 20% gói" trong khi gói duy nhất bị mất là ARP, đúng một lần, lúc bắt đầu. Hãy ping lần thứ hai: lần này ra <code>!!!!!</code> vì bản ghi ARP đã nằm trong bộ đệm, và đó là bằng chứng.</p>
<p><strong>Bẫy 3 — đọc ping timeout thành "máy đích đang tắt".</strong> Triệu chứng: một cái máy bị tuyên bố là chết trong khi thực ra hồi đáp của nó bị vứt trên đường về, hoặc tường lửa trên host đang chặn ICMP. Im lặng nghĩa là "không có hồi đáp nào tới", không phải "không ai nhận được" — và đó đúng là lý do chữ <code>U</code> mang nhiều thông tin hơn một dấu chấm.</p>
<p><strong>Bẫy 4 — đặt địa chỉ quản trị lên cổng vật lý.</strong> Triệu chứng: <code>ip address</code> dưới <code>interface fa0/1</code> bị từ chối trên switch tầng 2, và sinh viên thử thêm ba cổng nữa rồi mới hỏi vì sao. Địa chỉ đó thuộc về <code>interface vlan 1</code>, và đó là toàn bộ ý của slide 18.</p></div>

<h3>Bài tập</h3>
<p><strong>(a)</strong> PC-A (192.168.1.10/24) không ping được S1 (Vlan1 192.168.1.2/24). <code>show ip interface brief</code> trên S1 hiện <code>Vlan1 192.168.1.2 YES manual administratively down down</code> và <code>Fa0/6 unassigned YES unset up up</code>. Hãy giải thích vì sao cổng đang up cũng không giúp được gì, và nêu cách sửa kèm câu lệnh nghiệm thu.</p>
<p><strong>(b)</strong> Từ một switch, <code>ping 10.0.0.50</code> trả về <code>U.U.U</code>. Cũng từ switch đó, <code>ping 10.0.0.1</code> trả về <code>!!!!!</code>. Kết quả này đã LOẠI TRỪ được những gì, và nguyên nhân khả dĩ nhất là gì?</p>

<div class="dap-an"><strong>Lời giải (a).</strong> Fa0/6 đang up chỉ chứng minh có cáp cắm vào và đường truyền đã thương lượng xong — tầng 1 và tầng 2 đều tốt, và frame từ PC-A vẫn tới switch và vẫn được chuyển tiếp bình thường. Nhưng gói ping này gửi tới <em>chính cái switch</em>, mà switch trả lời bằng SVI của nó. Một SVI đang administratively down thì không có sự hiện diện IP nào đang hoạt động, nên yêu cầu echo được phần cứng nhận và không ai trả lời. Sửa: <code>configure terminal</code>, <code>interface vlan 1</code>, <code>no shutdown</code>, <code>end</code>. Nghiệm thu bằng <code>show ip interface brief | include Vlan1</code>, dòng đó phải đọc ra <code>up up</code>, rồi ping lại từ PC-A và chờ đợi <code>.!!!!</code> ở lần đầu tiên.
<p><strong>Lời giải (b).</strong> Kết quả <code>!!!!!</code> tới 10.0.0.1 chứng minh địa chỉ, mặt nạ, interface và đường nội bộ của chính switch đều chạy, nên mọi thứ ở phía switch bị loại trừ — và chữ <code>U</code> thay vì im lặng chứng minh có một router ĐÃ nhận gói và ĐÃ trả lời, nên đường tới router cũng chạy. Cái còn lại là router không có route nào tới 10.0.0.50, hoặc 10.0.0.50 nằm trong một subnet mà router không biết. Nguyên nhân khả dĩ nhất là thiếu hoặc sai route trên gateway; câu lệnh tiếp theo cần chạy là <code>show ip route</code> trên chính router đó, chứ không phải ping thêm lần nữa.</p></div>`,
    ),
  ].join('\n'),
};

/* ════════════════════════════════════════════════════════════════════════════
   Bài 2.5 — buổi 5–6: Lab 1.1 (Tera Term console · cấu hình cơ bản · AI)
   ════════════════════════════════════════════════════════════════════════════ */
const L25 = {
  title: '2.5 — Lab 1.1: Tera Term console, switch and end device, AI troubleshooting|||2.5 — Lab 1.1: console qua Tera Term, cấu hình switch và máy trạm, dùng AI xử lý sự cố',
  slug: 'nwc204-2-5-lab-1-1-tera-term-va-cau-hinh-co-ban',
  type: 'VIDEO',
  description: 'FLM buổi 5–6 (CLO2, CLO3, CLO9): toàn bộ Lab 1.1 — sơ đồ và bảng địa chỉ, bảy bước theo đúng thứ tự, cấu hình đầy đủ cho S1 và PC-A, nghiệm thu hai chiều, lưu cấu hình, và cách dùng AI để xử lý sự cố mà vẫn tự kiểm được.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 2 · Lesson 2.5 · FLM sessions 5–6 · CLO2, CLO3, CLO9</span>
<h2>Lab 1.1 — from a cold switch to a saved, verified configuration</h2>
<p class="lead">This is the first graded lab of the course and the rehearsal for the Practical Exam. By the end you can take a switch out of a box, reach it over a console cable, configure and secure it, address a PC, prove both directions work, and save — in one pass, without notes.</p>
<p class="nhan">Source: FLM · Syllabus 14520 · sessions 5–6 — "Lab 1.1: Basic Switch and End Device Configuration - Navigate the IOS by Using Tera Term for Console Connectivity - Basic Switch and End Device Configuration - Use AI Tools for Configuration and Troubleshooting". Materials: 2.3.8 Lab Manual (or 2.3.7 Packet Tracer), 2.9.2 Lab Manual (or 2.9.1 Packet Tracer).</p>

<div class="callout"><span class="badge">Opening question</span>
<p>Your lab partner did every step correctly, the pings all returned <code>!!!!!</code>, and the score is zero.</p>
<p><strong>What single omission does that every single time</strong> — and why does nothing on screen warn you about it?</p></div>

<h3>What the lab actually asks for</h3>
<ul>
<li><strong>Part 1 — navigate the IOS</strong> using Tera Term over a console connection: move between user EXEC, privileged EXEC, global configuration, line and interface modes, and back.</li>
<li><strong>Part 2 — basic configuration</strong>: hostname, passwords on console and vty, banner, the management address on the SVI, and the same four settings on the PC.</li>
<li><strong>Part 3 — verification</strong>: <code>show ip interface brief</code>, <code>show running-config</code>, and ping in both directions.</li>
<li><strong>Part 4 — use AI tools</strong> for configuration and troubleshooting, and be able to say what you checked rather than what you were told.</li>
</ul>

<h3>Why the order of operations matters more than the commands</h3>
<p>Every step in this lab removes a dependency for the next one. Cabling before configuring means you can watch a change take effect. Erasing before starting means you are not fighting somebody else's leftover configuration, which is the single most common cause of "it works for them and not for me" in a shared lab room. Configuring before addressing means the device has a name in every screenshot you take. Verifying before saving means you never save a broken configuration into NVRAM.</p>
<p>And saving last, always, is the answer to the opening question. IOS prints nothing when you walk away without saving; the next person reloads the switch and your work has never existed.</p>`,

      `<span class="eyebrow">NWC204 · Chương 2 · Bài 2.5 · FLM buổi 5–6 · CLO2, CLO3, CLO9</span>
<h2>Lab 1.1 — từ một cái switch nguội tới một cấu hình đã nghiệm thu và đã lưu</h2>
<p class="lead">Đây là bài lab tính điểm đầu tiên của môn và là buổi tổng duyệt cho kỳ thi thực hành. Học xong bạn lấy được một cái switch từ trong thùng, vào được nó bằng cáp console, cấu hình và làm cứng nó, đặt địa chỉ cho PC, chứng minh cả hai chiều đều chạy, và lưu lại — trong một lượt, không cần nhìn giấy.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 5–6 — "Lab 1.1: Basic Switch and End Device Configuration - Navigate the IOS by Using Tera Term for Console Connectivity - Basic Switch and End Device Configuration - Use AI Tools for Configuration and Troubleshooting". Tài liệu: 2.3.8 Lab Manual (hoặc 2.3.7 Packet Tracer), 2.9.2 Lab Manual (hoặc 2.9.1 Packet Tracer).</p>

<div class="callout"><span class="badge">Câu hỏi mở đầu</span>
<p>Bạn cùng nhóm của bạn làm đúng từng bước, mọi lệnh ping đều trả về <code>!!!!!</code>, và điểm là không.</p>
<p><strong>MỘT thiếu sót duy nhất nào gây ra chuyện đó, lần nào cũng vậy</strong> — và vì sao trên màn hình không có gì cảnh báo bạn cả?</p></div>

<h3>Bài lab thật sự yêu cầu gì</h3>
<ul>
<li><strong>Phần 1 — đi lại trong IOS</strong> bằng Tera Term qua kết nối console: di chuyển giữa user EXEC, privileged EXEC, global configuration, chế độ line và chế độ interface, rồi quay ra.</li>
<li><strong>Phần 2 — cấu hình cơ bản</strong>: hostname, mật khẩu cho console và vty, banner, địa chỉ quản trị trên SVI, và đúng bốn thiết lập đó trên PC.</li>
<li><strong>Phần 3 — nghiệm thu</strong>: <code>show ip interface brief</code>, <code>show running-config</code>, và ping theo cả hai chiều.</li>
<li><strong>Phần 4 — dùng công cụ AI</strong> để cấu hình và xử lý sự cố, và phải nói được bạn đã KIỂM cái gì chứ không phải bạn được BẢO cái gì.</li>
</ul>

<h3>Vì sao thứ tự thao tác quan trọng hơn bản thân các câu lệnh</h3>
<p>Mỗi bước trong bài lab này đều gỡ bỏ một phụ thuộc cho bước sau. Cắm cáp trước khi cấu hình nghĩa là bạn nhìn thấy được thay đổi có hiệu lực. Xoá trắng trước khi bắt đầu nghĩa là bạn không phải vật lộn với cấu hình thừa của người khác — nguyên nhân phổ biến nhất của chuyện "họ làm được mà tôi thì không" trong một phòng lab dùng chung. Cấu hình trước khi đặt địa chỉ nghĩa là thiết bị đã có tên trong mọi ảnh chụp màn hình bạn nộp. Nghiệm thu trước khi lưu nghĩa là bạn không bao giờ lưu một cấu hình hỏng vào NVRAM.</p>
<p>Và lưu sau cùng, luôn luôn, chính là lời giải cho câu hỏi mở đầu. IOS không in ra gì khi bạn bỏ đi mà chưa lưu; người kế tiếp reload cái switch và công sức của bạn chưa từng tồn tại.</p>`,
    ),

    walkHead(D, 23, 26,
      'Slides 23–26 are Lab 1.1 itself: the topology and addressing table, the order of operations, the AI workflow, and the session 3–6 questions with a self-check.',
      'Slide 23–26 chính là Lab 1.1: sơ đồ và bảng địa chỉ, thứ tự thao tác, quy trình dùng AI, và các câu hỏi kiến tạo buổi 3–6 kèm bảng tự chấm.'),

    walk(D, [
      [23, 'Lab 1.1 — the topology and the addressing table',
        `<p class="y-chinh">🎯 One PC, one switch, and <em>two</em> cables — which is the detail that catches everybody on their first lab.</p>
<p class="nhan">The two cables</p>
<ul>
<li>A <strong>rollover</strong> cable from the PC serial or USB port to the switch <em>console</em> port. This carries your commands.</li>
<li>A <strong>straight-through</strong> UTP cable from the PC NIC to <em>Fa0/6</em>. This carries the data you will later ping over.</li>
</ul>
<p class="nhan">The addressing table</p>
<ul>
<li><strong>S1, VLAN 1</strong> — 192.168.1.2, mask 255.255.255.0, no gateway needed in this lab.</li>
<li><strong>PC-A, NIC</strong> — 192.168.1.10, mask 255.255.255.0, no gateway needed.</li>
<li>Both are in 192.168.1.0/24, so they are local to each other and no router appears anywhere.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>The closing box names the classic first-lab mistake.</strong> The console cable plugged into Fa0/6 gives <em>no error at all</em> — it fits perfectly and produces a dead terminal. If your terminal is black and the link light is on, check which hole the blue cable is in before anything else.</div>`,
        `<p class="y-chinh">🎯 Một PC, một switch, và <em>hai</em> sợi cáp — đúng cái chi tiết làm ai cũng vấp trong buổi lab đầu tiên.</p>
<p class="nhan">Hai sợi cáp</p>
<ul>
<li>Cáp <strong>rollover</strong> từ cổng serial hoặc USB của PC tới cổng <em>console</em> của switch. Sợi này chở các câu lệnh của bạn.</li>
<li>Cáp UTP <strong>thẳng (straight-through)</strong> từ card mạng PC tới <em>Fa0/6</em>. Sợi này chở dữ liệu mà lát nữa bạn sẽ ping qua.</li>
</ul>
<p class="nhan">Bảng địa chỉ</p>
<ul>
<li><strong>S1, VLAN 1</strong> — 192.168.1.2, mặt nạ 255.255.255.0, bài lab này không cần gateway.</li>
<li><strong>PC-A, NIC</strong> — 192.168.1.10, mặt nạ 255.255.255.0, cũng không cần gateway.</li>
<li>Cả hai đều nằm trong 192.168.1.0/24, nên chúng nội bộ với nhau và không có router nào xuất hiện ở đâu cả.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Ô kết gọi tên đúng cái lỗi kinh điển của buổi lab đầu.</strong> Cáp console cắm nhầm vào Fa0/6 thì <em>không báo lỗi gì hết</em> — nó vừa khít và cho ra một cái terminal chết. Nếu terminal đen thui mà đèn link vẫn sáng, hãy kiểm sợi cáp xanh đang nằm ở lỗ nào, trước mọi thứ khác.</div>`],

      [24, 'Lab 1.1 — the order of operations',
        `<p class="y-chinh">🎯 Seven steps. Doing them out of order is what turns a twenty-minute lab into a two-hour one.</p>
<p class="nhan">The seven</p>
<ul>
<li><strong>1. Cable and open the console</strong> — Tera Term, Serial, the COM port, 9600 8N1. Press Enter until a prompt appears.</li>
<li><strong>2. Start clean</strong> — <code>erase startup-config</code>, <code>reload</code>, decline the initial configuration dialog. You are now on known ground.</li>
<li><strong>3. Navigate the modes</strong> — this is Part 1 of the lab, and it is graded: <code>enable</code>, <code>configure terminal</code>, <code>line</code>, <code>interface</code>, and back with <code>exit</code> and <code>end</code>.</li>
<li><strong>4. Configure</strong> — hostname, enable secret, console and vty passwords, banner, then the Vlan1 address.</li>
<li><strong>5. Configure PC-A</strong> with a static address in the same subnet.</li>
<li><strong>6. Verify</strong> — <code>show ip interface brief</code>, then ping in <strong>both</strong> directions.</li>
<li><strong>7. Save</strong> — <code>copy running-config startup-config</code>, and capture the configuration to a text file.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>The warning box is the answer to this lesson's opening question.</strong> Do step 6 before step 7, but never skip step 7. A lab that pings perfectly and was never saved scores the same as one that never worked.</div>`,
        `<p class="y-chinh">🎯 Bảy bước. Làm sai thứ tự chính là thứ biến một bài lab hai mươi phút thành hai tiếng.</p>
<p class="nhan">Bảy bước</p>
<ul>
<li><strong>1. Cắm cáp và mở console</strong> — Tera Term, chọn Serial, chọn cổng COM, đặt 9600 8N1. Bấm Enter tới khi có dấu nhắc.</li>
<li><strong>2. Bắt đầu từ nền sạch</strong> — <code>erase startup-config</code>, <code>reload</code>, từ chối hộp thoại cấu hình ban đầu. Từ giờ bạn đứng trên nền đã biết.</li>
<li><strong>3. Đi lại giữa các chế độ</strong> — đây là Phần 1 của bài lab và nó CÓ CHẤM ĐIỂM: <code>enable</code>, <code>configure terminal</code>, <code>line</code>, <code>interface</code>, rồi quay ra bằng <code>exit</code> và <code>end</code>.</li>
<li><strong>4. Cấu hình</strong> — hostname, enable secret, mật khẩu console và vty, banner, rồi địa chỉ Vlan1.</li>
<li><strong>5. Cấu hình PC-A</strong> với một địa chỉ tĩnh cùng subnet.</li>
<li><strong>6. Nghiệm thu</strong> — <code>show ip interface brief</code>, rồi ping theo <strong>cả hai</strong> chiều.</li>
<li><strong>7. Lưu</strong> — <code>copy running-config startup-config</code>, và hứng cấu hình ra một file văn bản.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Ô cảnh báo chính là lời giải cho câu hỏi mở đầu bài này.</strong> Hãy làm bước 6 trước bước 7, nhưng đừng bao giờ bỏ bước 7. Một bài lab ping hoàn hảo mà chưa lưu thì điểm bằng đúng một bài chưa bao giờ chạy.</div>`],

      [25, 'Lab 1.1 — using AI tools for configuration and troubleshooting',
        `<p class="y-chinh">🎯 Four arrows between you and the assistant, and the direction of the last two is what the grade depends on.</p>
<p class="nhan">The exchange</p>
<ul>
<li>You send the topology, the addressing table and the <em>exact</em> error text — the facts, not "it does not work".</li>
<li>It returns suggested commands and reasoning. That is a <strong>draft</strong>, nothing more.</li>
<li>You ask "which show command proves this?" — forcing a claim that can be checked.</li>
<li>It returns the expected output. You write that down <em>before</em> you run anything.</li>
</ul>
<p class="nhan">Good prompt vs bad prompt</p>
<ul>
<li><strong>Good:</strong> "S1 Vlan1 is 192.168.1.2/24, PC-A is 192.168.1.10/24, ping fails, show ip int brief says Vlan1 administratively down. What is wrong and which command proves the fix?"</li>
<li><strong>Bad:</strong> "my switch does not ping".</li>
<li><strong>The rule:</strong> the device is the authority; the assistant is a hypothesis generator.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>The failure modes in the warning box are measured, not theoretical.</strong> Invented interface names such as <code>interface vlan1/0</code>, commands from a different platform, and confidently wrong subnet boundaries. CLO9 and CLO10 ask you to <em>use</em> AI — the grade comes from verifying it.</div>`,
        `<p class="y-chinh">🎯 Bốn mũi tên giữa bạn và trợ lý, và chiều của hai mũi tên cuối mới là thứ quyết định điểm số.</p>
<p class="nhan">Cuộc trao đổi</p>
<ul>
<li>Bạn gửi sơ đồ, bảng địa chỉ và <em>nguyên văn</em> đoạn báo lỗi — dữ kiện, chứ không phải "nó không chạy".</li>
<li>Nó trả về các câu lệnh gợi ý kèm lý lẽ. Đó là một <strong>bản nháp</strong>, không hơn.</li>
<li>Bạn hỏi tiếp "lệnh show nào chứng minh được điều này?" — ép nó đưa ra một khẳng định KIỂM ĐƯỢC.</li>
<li>Nó trả về kết xuất mong đợi. Bạn ghi cái đó ra giấy <em>trước</em> khi chạy bất cứ thứ gì.</li>
</ul>
<p class="nhan">Câu hỏi tốt và câu hỏi tồi</p>
<ul>
<li><strong>Tốt:</strong> "S1 Vlan1 là 192.168.1.2/24, PC-A là 192.168.1.10/24, ping hỏng, show ip int brief báo Vlan1 administratively down. Sai ở đâu và lệnh nào chứng minh đã sửa đúng?"</li>
<li><strong>Tồi:</strong> "switch của tôi không ping được".</li>
<li><strong>Quy tắc:</strong> thiết bị là người phán quyết; trợ lý chỉ là cái máy sinh giả thuyết.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Các kiểu hỏng trong ô cảnh báo là ĐO ĐƯỢC, không phải lý thuyết.</strong> Bịa tên interface kiểu <code>interface vlan1/0</code>, lệnh của nền tảng khác, và nói sai ranh giới subnet một cách rất tự tin. CLO9 và CLO10 yêu cầu bạn <em>dùng</em> AI — điểm số đến từ việc bạn NGHIỆM THU nó.</div>`],

      [26, 'Sessions 3–6: the school’s questions, and your self-check',
        `<p class="y-chinh">🎯 The three constructive questions for this chapter, and the one self-check that predicts your Practical Exam result.</p>
<p class="nhan">The three questions</p>
<ul>
<li><strong>CQ1.4</strong> (session 3) — What is the Cisco IOS? The operating system of the device: a CLI with modes, a running configuration in RAM and a saved one in NVRAM.</li>
<li><strong>CQ2.1</strong> (session 4) — How to write the correct command in Cisco IOS? prompt plus keywords plus arguments, in the right mode, with <code>?</code> and Tab to confirm.</li>
<li><strong>CQ2.2</strong> (session 5) — What should we do when implement basic network with switches and end devices? Name it, secure it, address it, verify it, save it — in that order.</li>
</ul>
<p class="nhan">What the note reports</p>
<ul>
<li>Session 6 is a full session of Lab 1.1 and the syllabus lists <strong>no</strong> question for it — one of eight sessions left blank in that table.</li>
</ul>
<div class="callout ok"><strong>The self-check.</strong> From a cold switch, can you reach <code>S1#</code>, set a secret, address Vlan1, ping a PC and save — without notes? That sequence is the first task group of the Practical Exam.</div>`,
        `<p class="y-chinh">🎯 Ba câu hỏi kiến tạo của chương này, và một phép tự chấm dự báo được kết quả thi thực hành của bạn.</p>
<p class="nhan">Ba câu hỏi</p>
<ul>
<li><strong>CQ1.4</strong> (buổi 3) — Cisco IOS là gì? Hệ điều hành của thiết bị: một giao diện dòng lệnh có các chế độ, một cấu hình đang chạy trong RAM và một cấu hình đã lưu trong NVRAM.</li>
<li><strong>CQ2.1</strong> (buổi 4) — Viết câu lệnh Cisco IOS cho đúng thì làm thế nào? dấu nhắc cộng keyword cộng argument, ở đúng chế độ, dùng <code>?</code> và Tab để xác nhận.</li>
<li><strong>CQ2.2</strong> (buổi 5) — Khi triển khai một mạng cơ bản với switch và thiết bị đầu cuối thì nên làm gì? Đặt tên, làm cứng, đặt địa chỉ, nghiệm thu, lưu lại — theo đúng thứ tự đó.</li>
</ul>
<p class="nhan">Dòng ghi chú nêu điều gì</p>
<ul>
<li>Buổi 6 là nguyên một buổi Lab 1.1 mà syllabus <strong>không</strong> ghi câu hỏi nào cho nó — một trong tám buổi bị bỏ trống ở bảng đó.</li>
</ul>
<div class="callout ok"><strong>Phép tự chấm.</strong> Từ một cái switch nguội, bạn có vào được <code>S1#</code>, đặt secret, đặt địa chỉ Vlan1, ping được một cái PC và lưu lại — mà không cần nhìn giấy không? Đúng chuỗi đó là nhóm nhiệm vụ đầu tiên của kỳ thi thực hành.</div>`],
    ]),

    bi(
      `<h3>The complete lab, typed out</h3>
<p><strong>Step 2 — start clean.</strong> On the switch, over the console:</p>
<pre><code class="language-bash">enable
erase startup-config
reload
! answer "no" to saving, and "no" to the initial configuration dialog</code></pre>
<p><strong>Steps 3 and 4 — navigate and configure.</strong> Everything from <code>enable</code>, as the contract requires:</p>
<pre><code class="language-bash">enable
configure terminal
hostname S1                          ! name it first: every later screenshot carries it
no ip domain-lookup                  ! a typo no longer freezes the session
enable secret Cl4ss!2026             ! guards privileged EXEC - the one that matters
line console 0
 password C0nsole!2026
 login                               ! without this the password is never asked for
 logging synchronous                 ! console messages stop cutting your typing in half
 exit
line vty 0 15
 password Vty!2026
 login
 transport input ssh                 ! refuse Telnet outright
 exit
service password-encryption          ! obscure the two line passwords in the file
banner motd ^Authorised access only. Sessions are logged.^
interface vlan 1                     ! the SVI: the switch's own presence on the network
 ip address 192.168.1.2 255.255.255.0
 no shutdown                         ! an SVI is administratively down until this line
 exit
end</code></pre>
<p><strong>Step 5 — PC-A.</strong> Static address in the same subnet:</p>
<pre><code class="language-bash"># Windows, from an elevated prompt
netsh interface ip set address "Ethernet" static 192.168.1.10 255.255.255.0
ipconfig /all                       # confirm address and mask</code></pre>
<p><strong>Step 6 — verify.</strong> On the switch, then on the PC:</p>
<pre><code class="language-bash">show ip interface brief
ping 192.168.1.10</code></pre>
<pre><code class="language-plaintext">Interface   IP-Address    OK? Method Status  Protocol
Vlan1       192.168.1.2   YES manual up      up
Fa0/6       unassigned    YES unset  up      up

Sending 5, 100-byte ICMP Echos to 192.168.1.10, timeout is 2 seconds:
.!!!!
Success rate is 80 percent (4/5), round-trip min/avg/max = 1/2/8 ms</code></pre>
<p><strong>Step 7 — save.</strong> The step that carries the marks:</p>
<pre><code class="language-bash">copy running-config startup-config
show startup-config | include hostname     ! must now read: hostname S1</code></pre>

<div class="callout ok"><strong>🔍 How to check it yourself — the lab acceptance list</strong>
<ul>
<li><strong>Console works:</strong> pressing Enter produces a prompt. Garbage characters = wrong baud rate; total silence with a green link light = the blue cable is in an Ethernet port.</li>
<li><strong>Hostname applied:</strong> the prompt itself reads <code>S1#</code>. No separate check needed — this is why hostname goes first.</li>
<li><strong>Passwords actually work:</strong> type <code>exit</code> at the console and log back in. <strong>Right:</strong> you are asked for the console password, then for the enable secret. <strong>Wrong:</strong> you are let straight in, which means <code>login</code> is missing.</li>
<li><strong>Telnet really is refused:</strong> <code>show running-config | begin line vty</code> must contain <code>transport input ssh</code>. Its absence means Telnet is still accepted.</li>
<li><strong>SVI up:</strong> <code>show ip interface brief | include Vlan1</code> must read <code>up up</code>. <code>administratively down</code> means the <code>no shutdown</code> was never typed.</li>
<li><strong>Both directions:</strong> ping PC from switch <em>and</em> switch from PC. One-way success is a real state and does not pass.</li>
<li><strong>Saved:</strong> <code>show startup-config</code> and <code>show running-config</code> must agree. This is the only check that protects the marks.</li>
</ul></div>

<div class="pitfall co-tieu-de"><strong>Trap 1 — skipping erase startup-config.</strong> Symptom: commands behave strangely, an old hostname reappears after a reload, or an IP address you never typed is already there. A shared lab switch carries the previous group's work, and nothing announces it.
<p><strong>Trap 2 — configuring the SVI but not typing no shutdown.</strong> Symptom: <code>show running-config</code> shows exactly the address you meant, and nothing answers. This is the single most common reason a correct-looking Lab 1.1 fails.</p>
<p><strong>Trap 3 — pinging in one direction only.</strong> Symptom: the report says "connectivity verified" on the strength of one successful ping from the switch, while the PC firewall silently discards incoming ICMP and the PC cannot be reached. Both directions, every time.</p>
<p><strong>Trap 4 — walking away without saving.</strong> Symptom: everything worked, the demonstration was fine, and the next group reloads the switch. There is no warning, no dialogue and no recovery — and the opening question of this lesson has exactly this answer.</p></div>

<h3>Exercise</h3>
<p><strong>(a)</strong> You reach step 6 and ping from PC-A to 192.168.1.2 fails. <code>show ip interface brief</code> shows <code>Vlan1 192.168.1.2 YES manual up up</code> and <code>Fa0/6 up up</code>. Give three possible causes that are all consistent with this output, and the command or check that separates them.</p>
<p><strong>(b)</strong> Write the shortest sequence of commands that proves, to an examiner, that the console password, the enable secret and the saved configuration are all in place. You may not use <code>show running-config</code> on its own.</p>

<div class="dap-an"><strong>Solution (a).</strong> The switch side is healthy — the SVI is up with the right address and the port is up — so the fault is on the PC or between the layers.
<ol>
<li><strong>Wrong address or mask on PC-A</strong>, for example 192.168.2.10 or a /16 mask. Check: <code>ipconfig /all</code> on the PC; the address must be in 192.168.1.0/24.</li>
<li><strong>The PC firewall is discarding ICMP</strong>, in or out. Check: ping <em>from</em> the switch <em>to</em> the PC. If the switch cannot reach the PC but the PC can reach the switch, the firewall is filtering inbound echo requests.</li>
<li><strong>The PC is plugged into a different port</strong> from the one that reads up, or into the wrong switch entirely in a shared rack. Check: <code>show mac address-table</code> on S1 and look for the PC's MAC on Fa0/6 — if it is not there, its frames are not arriving at this switch.</li>
</ol>
<p><strong>Solution (b).</strong> Three commands, in this order:</p>
<pre><code class="language-bash">exit                                        ! log out of the console session
! log back in: being asked for a password proves console password + login
show running-config | include enable secret ! must show "enable secret 5 $1$..." or "9 $9$..."
show startup-config | include hostname      ! must show "hostname S1", proving it was saved</code></pre>
<p>The logout is the part people leave out, and it is the only one of the three that tests behaviour rather than text. A configuration file can contain a password that is never requested; a login prompt cannot.</p></div>`,

      `<h3>Toàn bộ bài lab, gõ ra đầy đủ</h3>
<p><strong>Bước 2 — bắt đầu từ nền sạch.</strong> Trên switch, qua console:</p>
<pre><code class="language-bash">enable
erase startup-config
reload
! trả lời "no" cho câu hỏi có lưu không, và "no" cho hộp thoại cấu hình ban đầu</code></pre>
<p><strong>Bước 3 và 4 — đi lại và cấu hình.</strong> Viết đủ từ <code>enable</code> trở đi, đúng như hợp đồng soạn bài yêu cầu:</p>
<pre><code class="language-bash">enable
configure terminal
hostname S1                          ! đặt tên trước: mọi ảnh chụp sau đó đều mang cái tên này
no ip domain-lookup                  ! gõ nhầm không còn làm đơ phiên nữa
enable secret Cl4ss!2026             ! canh privileged EXEC - cái đáng kể nhất
line console 0
 password C0nsole!2026
 login                               ! thiếu dòng này là mật khẩu không bao giờ bị hỏi tới
 logging synchronous                 ! thông báo của console thôi cắt ngang dòng bạn đang gõ
 exit
line vty 0 15
 password Vty!2026
 login
 transport input ssh                 ! từ chối thẳng Telnet
 exit
service password-encryption          ! che hai mật khẩu đường truyền trong file
banner motd ^Authorised access only. Sessions are logged.^
interface vlan 1                     ! SVI: sự hiện diện của chính switch trên mạng
 ip address 192.168.1.2 255.255.255.0
 no shutdown                         ! SVI luôn administratively down cho tới dòng này
 exit
end</code></pre>
<p><strong>Bước 5 — PC-A.</strong> Địa chỉ tĩnh cùng subnet:</p>
<pre><code class="language-bash"># Windows, chạy trong cửa sổ có quyền quản trị
netsh interface ip set address "Ethernet" static 192.168.1.10 255.255.255.0
ipconfig /all                       # xác nhận địa chỉ và mặt nạ</code></pre>
<p><strong>Bước 6 — nghiệm thu.</strong> Trên switch, rồi trên PC:</p>
<pre><code class="language-bash">show ip interface brief
ping 192.168.1.10</code></pre>
<pre><code class="language-plaintext">Interface   IP-Address    OK? Method Status  Protocol
Vlan1       192.168.1.2   YES manual up      up
Fa0/6       unassigned    YES unset  up      up

Sending 5, 100-byte ICMP Echos to 192.168.1.10, timeout is 2 seconds:
.!!!!
Success rate is 80 percent (4/5), round-trip min/avg/max = 1/2/8 ms</code></pre>
<p><strong>Bước 7 — lưu.</strong> Bước mang điểm về:</p>
<pre><code class="language-bash">copy running-config startup-config
show startup-config | include hostname     ! giờ phải đọc ra: hostname S1</code></pre>

<div class="callout ok"><strong>🔍 Cách tự kiểm — danh sách nghiệm thu bài lab</strong>
<ul>
<li><strong>Console chạy:</strong> bấm Enter là ra dấu nhắc. Ký tự rác = sai tốc độ baud; im lặng hoàn toàn trong khi đèn link vẫn xanh = sợi cáp xanh đang cắm vào cổng Ethernet.</li>
<li><strong>Hostname đã áp dụng:</strong> chính dấu nhắc đọc ra <code>S1#</code>. Không cần phép kiểm riêng — đó là lý do hostname làm đầu tiên.</li>
<li><strong>Mật khẩu THẬT SỰ có tác dụng:</strong> gõ <code>exit</code> ở console rồi đăng nhập lại. <strong>Đúng:</strong> nó hỏi mật khẩu console, rồi hỏi enable secret. <strong>Sai:</strong> nó cho vào thẳng, nghĩa là thiếu <code>login</code>.</li>
<li><strong>Telnet thật sự bị từ chối:</strong> <code>show running-config | begin line vty</code> phải có <code>transport input ssh</code>. Thiếu nó nghĩa là Telnet vẫn được chấp nhận.</li>
<li><strong>SVI đã lên:</strong> <code>show ip interface brief | include Vlan1</code> phải đọc ra <code>up up</code>. Nếu là <code>administratively down</code> thì câu <code>no shutdown</code> chưa từng được gõ.</li>
<li><strong>Cả hai chiều:</strong> ping PC từ switch <em>và</em> ping switch từ PC. Thành công một chiều là một trạng thái CÓ THẬT và không được tính đạt.</li>
<li><strong>Đã lưu:</strong> <code>show startup-config</code> và <code>show running-config</code> phải khớp nhau. Đây là phép kiểm duy nhất giữ được điểm.</li>
</ul></div>

<div class="pitfall co-tieu-de"><strong>Bẫy 1 — bỏ qua erase startup-config.</strong> Triệu chứng: các câu lệnh hành xử kỳ lạ, một hostname cũ hiện lại sau khi reload, hoặc một địa chỉ IP bạn chưa từng gõ đã nằm sẵn ở đó. Cái switch lab dùng chung đang mang cấu hình của nhóm trước, và không có gì thông báo chuyện đó.
<p><strong>Bẫy 2 — cấu hình SVI mà không gõ no shutdown.</strong> Triệu chứng: <code>show running-config</code> hiện đúng chính xác địa chỉ bạn định đặt, và không có gì trả lời. Đây là lý do phổ biến nhất khiến một bài Lab 1.1 nhìn rất đúng mà vẫn trượt.</p>
<p><strong>Bẫy 3 — chỉ ping một chiều.</strong> Triệu chứng: báo cáo ghi "đã nghiệm thu kết nối" dựa trên một lần ping thành công từ switch, trong khi tường lửa trên PC âm thầm vứt ICMP đi vào và PC không ai với tới được. Cả hai chiều, lần nào cũng vậy.</p>
<p><strong>Bẫy 4 — đứng dậy đi về mà chưa lưu.</strong> Triệu chứng: mọi thứ đã chạy, demo trơn tru, rồi nhóm sau reload cái switch. Không cảnh báo, không hộp thoại, không cứu được — và câu hỏi mở đầu của bài này có đúng lời giải đó.</p></div>

<h3>Bài tập</h3>
<p><strong>(a)</strong> Bạn tới bước 6 và ping từ PC-A tới 192.168.1.2 thì hỏng. <code>show ip interface brief</code> hiện <code>Vlan1 192.168.1.2 YES manual up up</code> và <code>Fa0/6 up up</code>. Hãy nêu ba nguyên nhân khả dĩ đều KHỚP với kết xuất này, và với mỗi cái là câu lệnh hoặc phép kiểm tách nó ra.</p>
<p><strong>(b)</strong> Hãy viết chuỗi câu lệnh NGẮN nhất chứng minh được với người chấm rằng mật khẩu console, enable secret và cấu hình đã lưu đều có đủ. Không được dùng riêng <code>show running-config</code>.</p>

<div class="dap-an"><strong>Lời giải (a).</strong> Phía switch hoàn toàn khoẻ — SVI đã lên với đúng địa chỉ và cổng cũng đã lên — nên sự cố nằm ở PC hoặc ở giữa các tầng.
<ol>
<li><strong>Sai địa chỉ hoặc sai mặt nạ trên PC-A</strong>, ví dụ 192.168.2.10 hoặc mặt nạ /16. Kiểm: <code>ipconfig /all</code> trên PC; địa chỉ phải nằm trong 192.168.1.0/24.</li>
<li><strong>Tường lửa trên PC đang vứt ICMP</strong>, chiều vào hoặc chiều ra. Kiểm: ping <em>từ</em> switch <em>tới</em> PC. Nếu switch không tới được PC mà PC lại tới được switch, thì tường lửa đang lọc gói echo đi vào.</li>
<li><strong>PC cắm vào cổng khác</strong> với cái cổng đang báo up, hoặc cắm nhầm hẳn sang switch khác trong một tủ rack dùng chung. Kiểm: <code>show mac address-table</code> trên S1 và tìm địa chỉ MAC của PC ở Fa0/6 — không thấy nghĩa là frame của nó không hề tới cái switch này.</li>
</ol>
<p><strong>Lời giải (b).</strong> Ba lệnh, theo đúng thứ tự này:</p>
<pre><code class="language-bash">exit                                        ! đăng xuất khỏi phiên console
! đăng nhập lại: bị hỏi mật khẩu là chứng minh có password + login trên console
show running-config | include enable secret ! phải hiện "enable secret 5 $1$..." hoặc "9 $9$..."
show startup-config | include hostname      ! phải hiện "hostname S1", chứng minh đã lưu</code></pre>
<p>Cú đăng xuất là phần người ta hay bỏ sót, và nó là cái duy nhất trong ba cái kiểm HÀNH VI chứ không kiểm chữ. Một file cấu hình hoàn toàn có thể chứa một mật khẩu không bao giờ bị hỏi tới; một lời nhắc đăng nhập thì không thể.</p></div>`,
    ),

    cq(5, [
      ['CQ2.2', 'What should we do when implement basic network with switches and end devices?', 'Khi triển khai một mạng cơ bản với switch và thiết bị đầu cuối thì chúng ta nên làm gì?'],
    ]),

    bi(
      `<div class="note-ct"><strong>How to answer CQ2.2 well — and a note on the missing question.</strong>
<p>Answer with the order, not with a list of commands: <strong>name it</strong> (hostname, so every log and screenshot identifies the device), <strong>secure it</strong> (enable secret, console and vty passwords with <code>login</code>, SSH only, banner), <strong>address it</strong> (the SVI on the switch and the four settings on each host), <strong>verify it</strong> (show ip interface brief and ping in both directions), <strong>save it</strong> (copy running-config startup-config). Five words, and each one is a slide in this chapter.</p>
<p class="ghi-chu">Session 6 is a second full session of Lab 1.1 and the syllabus gives it no constructive question at all — the same gap as sessions 9, 15, 16, 22, 30, 36 and 56. Reported here, not corrected in the original table.</p></div>`,
      `<div class="note-ct"><strong>Cách trả lời CQ2.2 cho tốt — và một ghi chú về câu hỏi bị thiếu.</strong>
<p>Hãy trả lời bằng THỨ TỰ, đừng trả lời bằng một danh sách câu lệnh: <strong>đặt tên</strong> (hostname, để mọi dòng log và mọi ảnh chụp đều nhận diện được thiết bị), <strong>làm cứng</strong> (enable secret, mật khẩu console và vty kèm <code>login</code>, chỉ SSH, có banner), <strong>đặt địa chỉ</strong> (SVI trên switch và bốn thiết lập trên từng host), <strong>nghiệm thu</strong> (show ip interface brief và ping cả hai chiều), <strong>lưu lại</strong> (copy running-config startup-config). Năm chữ, và mỗi chữ là một slide trong chương này.</p>
<p class="ghi-chu">Buổi 6 là buổi thứ hai của nguyên bài Lab 1.1 mà syllabus không ghi câu hỏi kiến tạo nào — cùng một lỗ hổng với buổi 9, 15, 16, 22, 30, 36 và 56. Nêu ra ở đây, không sửa vào bảng gốc.</p></div>`,
    ),
  ].join('\n'),
};

/* ════════════════════════════════════════════════════════════════════════════
   Quiz Chương 2 — 10 câu song ngữ, có explanation
   ════════════════════════════════════════════════════════════════════════════ */
const QUIZ2 = {
  title: 'Quiz — Chapter 2: Switch and end device configuration|||Quiz — Chương 2: Cấu hình switch và thiết bị đầu cuối',
  slug: 'nwc204-ch2-quiz',
  type: 'QUIZ',
  description: '10 câu song ngữ cho buổi 3–6: ba đường vào thiết bị, chế độ IOS và dấu nhắc, keyword vs argument, ba thông báo lỗi, mật khẩu nào canh cửa nào, RAM vs NVRAM, SVI, Status/Protocol, đọc ping, và thứ tự thao tác của Lab 1.1. Mỗi câu có giải thích.',
  quiz: {
    timeLimitSeconds: 600,
    questions: [
      {
        id: 'q1',
        question: 'A brand-new switch has no IP address. Which access method can you use?|||Một cái switch mới tinh chưa có địa chỉ IP. Bạn dùng được cách truy cập nào?',
        options: [
          'SSH, because it is encrypted|||SSH, vì nó có mã hoá',
          'Telnet, because it needs no encryption|||Telnet, vì nó không cần mã hoá',
          'The console port, because it works without any network configuration|||Cổng console, vì nó chạy mà không cần cấu hình mạng nào',
          'Any of the three|||Cách nào cũng được',
        ],
        correctIndex: 2,
        explanation: 'Slide 3. Both SSH and Telnet travel over the IP network to an address the device must already have, so neither can be used to create that address. The console port is physically separate from the network and needs no configuration at all — which is why it still exists on hardware sold today.|||Slide 3. Cả SSH lẫn Telnet đều đi qua mạng IP tới một địa chỉ mà thiết bị PHẢI có sẵn, nên không cái nào dùng được để TẠO RA chính địa chỉ đó. Cổng console tách rời mạng về mặt vật lý và không cần cấu hình gì cả — đó là lý do nó vẫn còn trên phần cứng bán ra hôm nay.',
      },
      {
        id: 'q2',
        question: 'What are the correct terminal settings for a Cisco console session?|||Thông số terminal đúng cho một phiên console Cisco là gì?',
        options: [
          '115200 baud, 8 data bits, no parity, 1 stop bit|||115200 baud, 8 bit dữ liệu, không chẵn lẻ, 1 bit dừng',
          '9600 baud, 8 data bits, no parity, 1 stop bit, no flow control|||9600 baud, 8 bit dữ liệu, không chẵn lẻ, 1 bit dừng, không điều khiển luồng',
          '9600 baud, 7 data bits, even parity, 2 stop bits|||9600 baud, 7 bit dữ liệu, chẵn lẻ chẵn, 2 bit dừng',
          'It does not matter, the device negotiates automatically|||Không quan trọng, thiết bị tự thương lượng',
        ],
        correctIndex: 1,
        explanation: 'Slide 4: 9600 8N1 with no flow control. A serial console negotiates nothing — that is the point of it. The visible symptom of the wrong baud rate is garbage characters on screen, with no error message of any kind.|||Slide 4: 9600 8N1 và không điều khiển luồng. Console serial KHÔNG thương lượng gì cả — đó chính là ý nghĩa của nó. Triệu chứng nhìn thấy được khi sai tốc độ baud là ký tự rác trên màn hình, và không có bất kỳ thông báo lỗi nào.',
      },
      {
        id: 'q3',
        question: 'You are at the prompt S1(config-if)# and type show ip interface brief. What happens?|||Bạn đang ở dấu nhắc S1(config-if)# và gõ show ip interface brief. Chuyện gì xảy ra?',
        options: [
          'It runs normally|||Nó chạy bình thường',
          'It is rejected, because show is an EXEC command and you are in a configuration mode. Use end first|||Nó bị từ chối, vì show là lệnh EXEC còn bạn đang ở chế độ cấu hình. Phải gõ end trước',
          'It runs but shows only the current interface|||Nó chạy nhưng chỉ hiện interface hiện tại',
          'It saves the configuration and then runs|||Nó lưu cấu hình rồi mới chạy',
        ],
        correctIndex: 1,
        explanation: 'Slides 6, 7 and 8. Each mode has its own list of allowed commands; a correctly spelled command in the wrong mode gives "% Invalid input detected", which is why reading the prompt comes before retyping. end (or Ctrl-Z) goes straight to privileged EXEC in one step, where exit would only go up one level.|||Slide 6, 7 và 8. Mỗi chế độ có danh sách lệnh được phép riêng; một câu lệnh gõ đúng chính tả nhưng sai chế độ sẽ cho "% Invalid input detected", đó là lý do phải ĐỌC DẤU NHẮC trước khi gõ lại. end (hoặc Ctrl-Z) nhảy thẳng về privileged EXEC trong một bước, còn exit chỉ lên được một bậc.',
      },
      {
        id: 'q4',
        question: 'IOS answers "% Incomplete command". What does it mean?|||IOS đáp "% Incomplete command". Nó nghĩa là gì?',
        options: [
          'The command does not exist|||Câu lệnh đó không tồn tại',
          'You typed too few letters and several commands match|||Bạn gõ quá ít chữ nên nhiều lệnh cùng khớp',
          'The command is correct but an argument is missing|||Câu lệnh đúng nhưng đang thiếu một argument',
          'You are in the wrong mode|||Bạn đang ở sai chế độ',
        ],
        correctIndex: 2,
        explanation: 'Slide 10. The three messages mean three different things: Ambiguous = too few letters, add more; Incomplete = the keyword is right and an argument is missing, so use ? to find which; Invalid input = wrong word, wrong mode or a typo, and the ^ marker points at the first bad character.|||Slide 10. Ba thông báo mang ba nghĩa khác nhau: Ambiguous = gõ quá ít chữ, hãy thêm; Incomplete = keyword đúng rồi và đang thiếu argument, dùng ? để biết thiếu cái nào; Invalid input = sai từ, sai chế độ hoặc gõ nhầm, và dấu ^ chỉ vào ký tự sai đầu tiên.',
      },
      {
        id: 'q5',
        question: 'Why is "ip add 192.168.1.2 255.255.255.0" accepted but "ip address 192.168.1" is not?|||Vì sao "ip add 192.168.1.2 255.255.255.0" được chấp nhận còn "ip address 192.168.1" thì không?',
        options: [
          'Because IOS accepts abbreviated keywords but never abbreviated arguments|||Vì IOS chấp nhận keyword viết tắt nhưng không bao giờ chấp nhận argument viết tắt',
          'Because the second command is in the wrong mode|||Vì câu lệnh thứ hai ở sai chế độ',
          'Because 192.168.1 is a reserved address|||Vì 192.168.1 là địa chỉ dành riêng',
          'Because a mask must come first|||Vì mặt nạ phải đứng trước',
        ],
        correctIndex: 0,
        explanation: 'Slide 9. IOS holds a finite list of keywords, so it can prove that only one starts with "add" and expand it safely. It has no list of valid addresses, so it cannot tell whether 192.168.1 means .1.2 or .1.200 — and guessing an address would be far worse than refusing.|||Slide 9. IOS giữ một danh sách HỮU HẠN các keyword, nên nó chứng minh được chỉ có một keyword bắt đầu bằng "add" và bung ra an toàn. Nó không có danh sách địa chỉ hợp lệ nào, nên không thể biết 192.168.1 nghĩa là .1.2 hay .1.200 — và đoán mò một địa chỉ thì tệ hơn nhiều so với từ chối.',
      },
      {
        id: 'q6',
        question: 'A switch has a console password configured but the line has no "login" command. What is the effect?|||Một switch đã đặt mật khẩu console nhưng đường đó không có câu lệnh "login". Hậu quả là gì?',
        options: [
          'The password is asked for every time|||Mật khẩu bị hỏi mỗi lần',
          'The password is never asked for, so the console is unprotected while the configuration looks correct|||Mật khẩu không bao giờ bị hỏi, nên console không được bảo vệ trong khi cấu hình nhìn vẫn đúng',
          'The switch refuses all console connections|||Switch từ chối mọi kết nối console',
          'The password applies to SSH instead|||Mật khẩu chuyển sang áp dụng cho SSH',
        ],
        correctIndex: 1,
        explanation: 'Slide 14 and lesson 2.2. The login command is what makes IOS actually ask; without it the password is configured, stored and even encrypted, and never requested. IOS prints no warning for this, so the only reliable test is to log out and log back in.|||Slide 14 và bài 2.2. Chính câu lệnh login mới làm IOS HỎI tới mật khẩu; thiếu nó thì mật khẩu vẫn được đặt, được lưu, thậm chí được mã hoá, và không bao giờ bị hỏi. IOS không in cảnh báo nào, nên phép thử đáng tin duy nhất là đăng xuất rồi đăng nhập lại.',
      },
      {
        id: 'q7',
        question: 'You configure a switch for two hours and it works. The building loses power. What comes back?|||Bạn cấu hình một switch trong hai tiếng và nó chạy tốt. Toà nhà mất điện. Cái gì quay trở lại?',
        options: [
          'Everything, IOS saves automatically|||Mọi thứ, IOS tự lưu',
          'Whatever is in startup-config (NVRAM). If you never ran copy running-config startup-config, that is the old or empty configuration|||Bất cứ thứ gì đang nằm trong startup-config (NVRAM). Nếu bạn chưa từng chạy copy running-config startup-config thì đó là cấu hình cũ hoặc rỗng',
          'Only the hostname survives|||Chỉ hostname sống sót',
          'The configuration from the last reload, whichever it was|||Cấu hình của lần reload gần nhất, bất kể là cái nào',
        ],
        correctIndex: 1,
        explanation: 'Slide 15. running-config lives in RAM and disappears with the power; startup-config lives in NVRAM and is what boot loads back. IOS never saves for you — deliberately, because that same property is what lets you undo a bad change by reloading.|||Slide 15. running-config nằm trong RAM và biến mất cùng với điện; startup-config nằm trong NVRAM và là thứ được nạp lại lúc khởi động. IOS không bao giờ lưu giùm bạn — và đó là chủ đích, vì chính tính chất ấy cho phép bạn huỷ một thay đổi hỏng bằng cách reload.',
      },
      {
        id: 'q8',
        question: 'Where does a Layer 2 switch keep its own management IP address?|||Một switch tầng 2 giữ địa chỉ IP quản trị của chính nó ở đâu?',
        options: [
          'On interface fa0/1, the first physical port|||Trên interface fa0/1, cổng vật lý đầu tiên',
          'On the console port|||Trên cổng console',
          'On a switch virtual interface, normally interface vlan 1|||Trên một switch virtual interface, thường là interface vlan 1',
          'It does not have one and cannot have one|||Nó không có và không thể có',
        ],
        correctIndex: 2,
        explanation: 'Slides 18 and 19. Forwarding frames needs no IP at all, but being managed does — SSH, Telnet, SNMP and syslog are IP traffic. That address lives on the SVI, and IOS rejects ip address under a Layer 2 physical port, which is itself the proof.|||Slide 18 và 19. Chuyển frame thì hoàn toàn không cần IP, nhưng được QUẢN TRỊ thì cần — SSH, Telnet, SNMP và syslog đều là lưu lượng IP. Địa chỉ đó nằm trên SVI, và IOS TỪ CHỐI lệnh ip address dưới một cổng vật lý tầng 2, chính cú từ chối đó là bằng chứng.',
      },
      {
        id: 'q9',
        question: 'show ip interface brief reports an interface as "administratively down". What should you do?|||show ip interface brief báo một interface là "administratively down". Bạn nên làm gì?',
        options: [
          'Replace the cable|||Thay sợi cáp',
          'Check the device at the far end|||Kiểm thiết bị ở đầu kia',
          'Enter that interface and type no shutdown — somebody disabled it by configuration|||Vào interface đó và gõ no shutdown — có người đã tắt nó bằng cấu hình',
          'Reload the switch|||Khởi động lại switch',
        ],
        correctIndex: 2,
        explanation: 'Slide 21. administratively down is a decision, not a failure: it means shutdown was typed. down/down would be the cable-and-port case and up/down a layer 2 mismatch. IOS separates these three on purpose, so that you do not spend an hour testing cables on a port a colleague switched off last month.|||Slide 21. administratively down là một QUYẾT ĐỊNH chứ không phải một sự cố: nó nghĩa là có người đã gõ shutdown. down/down mới là trường hợp cáp và cổng, còn up/down là lệch ở tầng 2. IOS tách riêng ba trạng thái này là có chủ đích, để bạn không ngồi cả tiếng thử cáp trên một cổng mà đồng nghiệp đã tắt từ tháng trước.',
      },
      {
        id: 'q10',
        question: 'An IOS ping returns ".!!!!" — 80% success. What does this mean?|||Một lệnh ping trên IOS trả về ".!!!!" — thành công 80%. Nó nghĩa là gì?',
        options: [
          'The link is losing 20% of packets and must be repaired|||Đường truyền đang mất 20% gói và cần sửa',
          'The first packet was lost while ARP resolved the destination MAC. This is normal, not a fault|||Gói đầu tiên mất trong lúc ARP đi hỏi địa chỉ MAC của đích. Đây là bình thường, không phải sự cố',
          'A router answered destination unreachable|||Một router đã trả lời destination unreachable',
          'The destination is powered off|||Máy đích đang tắt',
        ],
        correctIndex: 1,
        explanation: 'Slide 22. The leading dot is the cost of ARP, once. Run the ping a second time and it returns !!!!! because the ARP entry is now cached — and that repeat is the proof. A U would mean a router replied unreachable, and all dots would mean silence, which is a different and less informative result.|||Slide 22. Dấu chấm ở đầu là cái giá của ARP, đúng một lần. Ping lần thứ hai sẽ ra !!!!! vì bản ghi ARP đã nằm trong bộ đệm — và chính lần lặp lại đó là bằng chứng. Chữ U nghĩa là có router trả lời unreachable, còn toàn dấu chấm nghĩa là im lặng, một kết quả khác và ít thông tin hơn.',
      },
    ],
  },
};

export default [
  {
    title: 'Chapter 2 — Basic Switch and End Device Configuration (sessions 3–6)|||Chương 2 — Cấu hình switch và thiết bị đầu cuối (buổi 3–6)',
    slug: 'nwc204-chuong-2-basic-switch-configuration',
    description: 'Cisco Module 2 và Lab 1.1 theo đúng buổi 3–6 của FLM: ba đường vào thiết bị, cây chế độ IOS, cấu trúc câu lệnh, làm cứng thiết bị, running-config vs startup-config, cổng và địa chỉ, cấu hình IP, kiểm tra kết nối, và toàn bộ Lab 1.1 qua Tera Term. Học theo từng slide, kèm cách tự kiểm bằng lệnh thật.',
    lessons: [L21, L22, L23, L24, L25, QUIZ2],
  },
];
