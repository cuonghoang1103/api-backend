/** NWC204 · 2.1 — Getting into a Cisco device: console/SSH/Telnet, IOS modes and prompts, command structure and help (Chương 2, buổi 3). */
import { doiDau, KHOA, tinh, q, bang1, tn, cs, js, mt, bi, S } from './_nw.mjs';

const E1 = cs({
  ten: 'IOS 1 — Three doors into a switch', kho: 'EASY', phut: 8,
  en: 'Lesson 2.1: the console port, SSH and Telnet, and what each needs before it works.',
  vi: 'Bài 2.1: cổng console, SSH và Telnet, và mỗi đường cần gì trước khi dùng được.',
  cau: [
    q('c1', ['A switch is still in its box: no IP address, no password. Which way in works?', 'Switch còn nguyên hộp: chưa có IP, chưa có mật khẩu. Đường nào vào được?'], ['The console port with a rollover cable', 'SSH to its default address', 'Telnet on TCP port 23', 'A web browser on port 80'], ['SSH and Telnet both reach the vty lines, which need an IP address that does not exist yet. The console port is physically separate from the network and works on a device with no configuration at all.', 'SSH và Telnet đều vào các dòng vty, mà vty cần một địa chỉ IP chưa hề tồn tại. Cổng console tách biệt vật lý khỏi mạng và chạy được trên thiết bị chưa cấu hình gì.']),
    q('c2', ['Which terminal settings open a standard Cisco console session?', 'Thiết lập terminal nào mở được phiên console Cisco tiêu chuẩn?'], ['9600 baud, 8 data bits, no parity, 1 stop bit, no flow control', '115200 baud, 7 data bits, even parity, 2 stop bits', '9600 baud with hardware flow control on', '1200 baud, 8 data bits, odd parity'], ['9600 8N1 with no flow control. Garbage characters on screen are the classic sign of the wrong speed: close the session and reopen at 9600 — do not touch the cable.', '9600 8N1, không điều khiển luồng. Ký tự rác trên màn hình là dấu hiệu kinh điển của sai tốc độ: đóng phiên, mở lại ở 9600 — đừng đụng vào cáp.']),
    q('c3', ['Telnet and SSH both give a remote CLI. What is the difference that matters?', 'Telnet và SSH đều cho CLI từ xa. Khác biệt quan trọng là gì?'], ['Telnet sends everything, passwords included, as readable text; SSH encrypts after a key exchange', 'Telnet is faster because SSH re-encrypts every keystroke with a new key', 'SSH works only on the console line, Telnet only on vty lines', 'Telnet uses TCP 22 and SSH uses TCP 23'], ['Telnet is TCP 23 with no encryption of any kind; anyone who captures the traffic gets working credentials. SSH is TCP 22, encrypted after a key exchange that costs milliseconds once per session.', 'Telnet là TCP 23, không mã hoá gì cả; ai bắt được lưu lượng là có ngay tài khoản dùng được. SSH là TCP 22, mã hoá sau một lần trao đổi khoá chỉ tốn vài mili giây mỗi phiên.']),
    q('c4', ['You open the terminal window, it stays black and never answers Enter, and the cable is the blue RJ-45 console cable. Most likely?', 'Bạn mở cửa sổ terminal, nó đen thui và không phản hồi Enter, cáp là cáp console RJ-45 màu xanh. Nhiều khả năng nhất là gì?'], ['It is plugged into an Ethernet port instead of the CONSOLE port', 'The baud rate is wrong', 'The switch has no enable secret yet', 'Telnet is disabled on the vty lines'], ['An RJ-45 console cable fits an Ethernet port perfectly and produces no error. Wrong speed gives garbage, not silence. Check the COM port, then the cable and the port it is in.', 'Cáp console RJ-45 vừa khít cổng Ethernet và không báo lỗi gì. Sai tốc độ cho ra ký tự rác, không phải im lặng. Kiểm số cổng COM, rồi tới cáp và cổng đang cắm.']),
    q('c5', ['Every way in — console, SSH, Telnet — ends at the same user EXEC prompt. So which password protects the power to change the device?', 'Mọi đường vào — console, SSH, Telnet — đều dừng ở cùng dấu nhắc user EXEC. Vậy mật khẩu nào bảo vệ quyền thay đổi thiết bị?'], ['enable secret, the step from > to #', 'The console line password', 'The vty line password', 'The banner motd text'], ['Line passwords guard the doors; enable secret guards the power. Protecting the doors without protecting the power is protecting nothing.', 'Mật khẩu dòng truy cập canh cửa; enable secret canh quyền lực. Canh cửa mà không canh quyền lực là không canh gì cả.']),
  ],
  goiY: ['No IP yet ⇒ only the console works.', 'Telnet = 23, plaintext. SSH = 22, encrypted.'],
  loi: ['Trying to SSH to a switch that has no address.', 'Changing cables when the screen shows garbage — that is the baud rate.'],
  tn: [tn('rollover cable', 'cáp console (đảo dây)'), tn('terminal emulator', 'trình giả lập terminal'), tn('vty line', 'dòng truy cập từ xa')], kn: ['console access', 'SSH vs Telnet'],
});

const E2 = tinh({
  tieuDe: 'IOS 2 — Read the prompt, know the mode', doKho: 'MEDIUM', phut: 10,
  moTa: mt('The prompt is the only reliable way to know where you are. For each prompt, name the mode and say whether <code>show running-config</code> typed exactly like that would be accepted there.', 'Dấu nhắc là cách duy nhất chắc chắn để biết mình đang ở đâu. Với mỗi dấu nhắc, gọi tên mode và cho biết <code>show running-config</code> gõ đúng như vậy có được chấp nhận ở đó không.'),
  loai: 'table',
  bang: [bang1('b1', ['Prompt → mode → is show running-config accepted?', 'Dấu nhắc → mode → show running-config có được chấp nhận?'], [{ ma: 'p', ten: 'Prompt' }, { ma: 'm', ten: 'Mode', luaChon: ['user EXEC', 'privileged EXEC', 'global configuration', 'line configuration', 'interface configuration'] }, { ma: 'r', ten: 'show running-config?', luaChon: ['yes', 'no'] }], [
    { o: { p: 'S1>' }, a: { m: 'user EXEC', r: 'no' } },
    { o: { p: 'S1#' }, a: { m: 'privileged EXEC', r: 'yes' } },
    { o: { p: 'S1(config)#' }, a: { m: 'global configuration', r: 'no' } },
    { o: { p: 'S1(config-line)#' }, a: { m: 'line configuration', r: 'no' } },
    { o: { p: 'S1(config-if)#' }, a: { m: 'interface configuration', r: 'no' } },
  ], ['show running-config is a privileged EXEC command. It does not exist in user EXEC at all, and in every configuration mode it is rejected unless you prefix it with do. That rejection is itself a quick test of which mode you are in.', 'show running-config là lệnh privileged EXEC. Ở user EXEC nó hoàn toàn không tồn tại, còn ở mọi mode cấu hình nó bị từ chối trừ khi thêm tiền tố do. Chính lời từ chối đó là phép thử nhanh xem mình đang ở mode nào.'])],
  goiY: ['> is user EXEC, # is privileged EXEC; the bracket names the configuration sub-mode.', 'Configuration modes accept EXEC commands only with "do" in front.'],
  loiHayGap: ['Thinking # means "configuration mode".', 'Answering yes for the configuration modes because "do show running-config" works there.'],
  thuatNgu: [tn('privileged EXEC', 'chế độ đặc quyền'), tn('global configuration', 'cấu hình toàn cục')], khaiNiem: ['IOS modes'],
});

const E3 = cs({
  ten: 'IOS 3 — Keywords, arguments and the three error messages', kho: 'MEDIUM', phut: 10,
  en: 'Lesson 2.2: IOS abbreviates keywords but never arguments, and each of its three error messages has its own fix.',
  vi: 'Bài 2.2: IOS cho viết tắt từ khoá nhưng không bao giờ viết tắt đối số, và mỗi thông báo lỗi trong ba thông báo có cách sửa riêng.',
  cau: [
    q('c1', ['"% Incomplete command" after "ip address 192.168.1.2". What is wrong?', '"% Incomplete command" sau lệnh "ip address 192.168.1.2". Sai ở đâu?'], ['An argument is missing: the subnet mask', 'The keyword "address" is misspelled', 'You are typing in the wrong mode', 'The abbreviation matches two keywords'], ['Incomplete means add an argument. "ip address 192.168.1.2 ?" lists what IOS expects next — here the mask.', 'Incomplete nghĩa là thiếu đối số. "ip address 192.168.1.2 ?" liệt kê thứ IOS chờ tiếp — ở đây là mặt nạ.']),
    q('c2', ['"% Invalid input detected at \'^\' marker". What should you do?', '"% Invalid input detected at \'^\' marker". Nên làm gì?'], ['Read where the ^ points, then check the prompt', 'Add more letters to the abbreviation', 'Add the missing argument at the end', 'Reload the device: the parser is stuck'], ['The caret marks the first character IOS could not accept. Most of these are a mode error, not a spelling error — read the prompt first.', 'Dấu ^ chỉ ký tự đầu tiên IOS không chấp nhận được. Phần lớn là lỗi sai mode, không phải lỗi chính tả — đọc dấu nhắc trước.']),
    q('c3', ['"% Ambiguous command" after typing "co" in privileged EXEC. Why?', '"% Ambiguous command" sau khi gõ "co" ở privileged EXEC. Vì sao?'], ['Several keywords in this mode start with "co" (configure, copy…), so IOS will not guess', 'The command "co" does not exist on this IOS version', '"co" is an argument and arguments cannot be abbreviated', 'Abbreviations are only allowed in configuration modes'], ['Ambiguous means add letters until exactly one keyword matches: "conf" or "cop". IOS expands an abbreviation only when it can prove there is one candidate.', 'Ambiguous nghĩa là thêm chữ tới khi chỉ còn đúng một từ khoá khớp: "conf" hoặc "cop". IOS chỉ mở rộng chữ viết tắt khi chứng minh được chỉ có một ứng viên.']),
    q('c4', ['Why is "int vl 1" accepted but "ip add 192.168.1 255.255.255.0" rejected?', 'Vì sao "int vl 1" được chấp nhận còn "ip add 192.168.1 255.255.255.0" thì bị từ chối?'], ['Keywords can be expanded; an address is an argument', 'IOS abbreviates only the first word of a line', 'Addresses must be typed before the keyword', '"add" is not a valid abbreviation of "address"'], ['Keywords come from a finite list in each mode, so a unique prefix can be expanded safely. An address has no such list: 192.168.1 is not a short address, it is a different, wrong one.', 'Từ khoá nằm trong một danh sách hữu hạn của mỗi mode, nên một tiền tố duy nhất mở rộng được an toàn. Địa chỉ không có danh sách như thế: 192.168.1 không phải địa chỉ viết tắt, nó là một địa chỉ khác, và sai.']),
    q('c5', ['You want to see which commands start with "cl" in the current mode. What do you type?', 'Bạn muốn xem các lệnh bắt đầu bằng "cl" trong mode hiện tại. Gõ gì?'], ['cl?  (no space before the question mark)', 'cl ?  (with a space)', 'help cl', 'show commands cl'], ['"cl?" with no space completes the word: it lists every command beginning with cl. "clock ?" with a space asks what may come AFTER the keyword clock. Two different questions, one character apart.', '"cl?" không cách lấy trọn từ: liệt kê mọi lệnh bắt đầu bằng cl. "clock ?" có dấu cách hỏi thứ gì được đứng SAU từ khoá clock. Hai câu hỏi khác nhau, cách nhau đúng một ký tự.']),
  ],
  goiY: ['Ambiguous → add letters. Incomplete → add an argument. Invalid → look at the caret, then the prompt.', 'A space before ? changes the question.'],
  loi: ['Retyping the same command five times instead of reading which error it is.', 'Expecting IOS to complete an IP address the way it completes a keyword.'],
  tn: [tn('keyword', 'từ khoá'), tn('argument', 'đối số'), tn('context-sensitive help', 'trợ giúp theo ngữ cảnh')], kn: ['command structure'],
});

const E4 = js({
  ten: 'IOS 4 — Write iosSession(hostname, cmds): a mode simulator', kho: 'HARD', phut: 30,
  en: `<p>Write <code>iosSession(hostname, cmds)</code>: start at <code>hostname + "&gt;"</code> (user EXEC), apply the commands in order, and return <code>{ prompt, rejected, loggedOut }</code> — the final prompt, the 0-based indexes of the commands IOS would refuse (a refused command changes nothing), and whether the session ended.</p>
<p>Commands are compared case-insensitively after trimming and collapsing spaces. The simulator knows exactly these:</p>
<ul>
<li><code>enable</code> / <code>en</code> — user → privileged. Accepted (no change) in privileged; refused in configuration modes.</li>
<li><code>disable</code> — privileged → user. Refused in configuration modes.</li>
<li><code>configure terminal</code> / <code>conf t</code> — privileged → global configuration. Refused anywhere else.</li>
<li><code>exit</code> — interface or line → global configuration; global configuration → privileged; <b>user or privileged → the session ends</b>: return <code>{ prompt: null, rejected, loggedOut: true }</code> immediately and ignore the rest.</li>
<li><code>end</code> — any configuration mode → privileged. Refused in user and privileged.</li>
<li><code>line console 0</code> / <code>line con 0</code> / <code>line vty A B</code> → line configuration; <code>interface X</code> / <code>int X</code> → interface configuration. Accepted from global configuration and from either sub-mode (you can jump straight from one to another); refused in user and privileged.</li>
<li><code>hostname NAME</code> — only in global configuration; the new name keeps the case you typed and appears in the prompt at once.</li>
<li>Global commands <code>enable secret …</code>, <code>enable password …</code>, <code>service password-encryption</code>, <code>banner motd …</code>, <code>no ip domain-lookup</code>, <code>ip domain-name …</code>, <code>ip default-gateway …</code>, <code>username …</code>, <code>crypto key generate rsa …</code> — only in global configuration.</li>
<li>Line commands <code>password …</code>, <code>login</code>, <code>login local</code>, <code>transport input …</code>, <code>logging synchronous</code>, <code>exec-timeout …</code> — only in line configuration. Interface commands <code>ip address …</code>, <code>no shutdown</code>, <code>shutdown</code>, <code>description …</code> — only in interface configuration.</li>
<li><code>show …</code>, <code>ping …</code>, <code>copy …</code>, <code>erase …</code>, <code>reload</code> — EXEC commands: refused in every configuration mode. In user EXEC, <code>show running-config</code>, <code>show run</code>, <code>show startup-config</code>, <code>show start</code>, <code>copy</code>, <code>erase</code> and <code>reload</code> are also refused (privileged only); other <code>show</code> and <code>ping</code> commands are accepted.</li>
<li><code>do show …</code> / <code>do ping …</code> / <code>do copy …</code> — accepted in configuration modes (no mode change), refused in user and privileged.</li>
<li>Anything else is refused.</li>
</ul>
<p>Prompts: <code>S1&gt;</code>, <code>S1#</code>, <code>S1(config)#</code>, <code>S1(config-line)#</code>, <code>S1(config-if)#</code>. <i>Simplification: real IOS also accepts a global command such as <code>hostname</code> typed inside a sub-mode and falls back to global configuration; this simulator refuses it so that every exercise has one unambiguous answer.</i></p>`,
  vi: `<p>Viết <code>iosSession(hostname, cmds)</code>: bắt đầu ở <code>hostname + "&gt;"</code> (user EXEC), áp các lệnh theo thứ tự, trả về <code>{ prompt, rejected, loggedOut }</code> — dấu nhắc cuối cùng, chỉ số (đếm từ 0) các lệnh IOS sẽ từ chối (lệnh bị từ chối không làm thay đổi gì), và phiên đã kết thúc hay chưa.</p>
<p>So lệnh không phân biệt hoa thường, sau khi cắt khoảng trắng hai đầu và gộp khoảng trắng liên tiếp. Bộ mô phỏng biết đúng các lệnh sau:</p>
<ul>
<li><code>enable</code> / <code>en</code> — user → privileged. Ở privileged thì chấp nhận (không đổi gì); ở các mode cấu hình thì từ chối.</li>
<li><code>disable</code> — privileged → user. Từ chối ở các mode cấu hình.</li>
<li><code>configure terminal</code> / <code>conf t</code> — privileged → cấu hình toàn cục. Ở chỗ khác đều từ chối.</li>
<li><code>exit</code> — interface hoặc line → cấu hình toàn cục; cấu hình toàn cục → privileged; <b>user hoặc privileged → phiên kết thúc</b>: trả ngay <code>{ prompt: null, rejected, loggedOut: true }</code> và bỏ qua các lệnh còn lại.</li>
<li><code>end</code> — mọi mode cấu hình → privileged. Từ chối ở user và privileged.</li>
<li><code>line console 0</code> / <code>line con 0</code> / <code>line vty A B</code> → cấu hình line; <code>interface X</code> / <code>int X</code> → cấu hình interface. Chấp nhận từ cấu hình toàn cục và từ cả hai mode con (nhảy thẳng từ mode con này sang mode con kia được); từ chối ở user và privileged.</li>
<li><code>hostname NAME</code> — chỉ ở cấu hình toàn cục; tên mới giữ nguyên hoa thường như bạn gõ và hiện ngay trong dấu nhắc.</li>
<li>Lệnh toàn cục <code>enable secret …</code>, <code>enable password …</code>, <code>service password-encryption</code>, <code>banner motd …</code>, <code>no ip domain-lookup</code>, <code>ip domain-name …</code>, <code>ip default-gateway …</code>, <code>username …</code>, <code>crypto key generate rsa …</code> — chỉ ở cấu hình toàn cục.</li>
<li>Lệnh line <code>password …</code>, <code>login</code>, <code>login local</code>, <code>transport input …</code>, <code>logging synchronous</code>, <code>exec-timeout …</code> — chỉ ở cấu hình line. Lệnh interface <code>ip address …</code>, <code>no shutdown</code>, <code>shutdown</code>, <code>description …</code> — chỉ ở cấu hình interface.</li>
<li><code>show …</code>, <code>ping …</code>, <code>copy …</code>, <code>erase …</code>, <code>reload</code> — lệnh EXEC: bị từ chối ở mọi mode cấu hình. Ở user EXEC, <code>show running-config</code>, <code>show run</code>, <code>show startup-config</code>, <code>show start</code>, <code>copy</code>, <code>erase</code> và <code>reload</code> cũng bị từ chối (chỉ privileged); các lệnh <code>show</code> và <code>ping</code> khác thì được.</li>
<li><code>do show …</code> / <code>do ping …</code> / <code>do copy …</code> — chấp nhận ở các mode cấu hình (không đổi mode), từ chối ở user và privileged.</li>
<li>Mọi thứ khác bị từ chối.</li>
</ul>
<p>Dấu nhắc: <code>S1&gt;</code>, <code>S1#</code>, <code>S1(config)#</code>, <code>S1(config-line)#</code>, <code>S1(config-if)#</code>. <i>Giản lược: IOS thật còn nhận lệnh toàn cục như <code>hostname</code> gõ ngay trong mode con và tự lùi về cấu hình toàn cục; bộ mô phỏng này từ chối để mỗi bài chỉ có một đáp án rõ ràng.</i></p>`,
  yc: [bi('Return the value; do not print it.', 'Trả về giá trị, đừng in ra.'), bi('Do not modify the cmds array.', 'Không sửa mảng cmds.')],
  fn: 'iosSession', params: 'hostname, cmds', ref: S.iosSession,
  cases: [
    ['Switch', ['enable', 'configure terminal', 'hostname S1', 'line console 0', 'exit', 'end']],
    ['S1', ['enable', 'hostname S2']],
    ['S1', ['en', 'conf t', 'interface vlan 1', 'show ip interface brief', 'do show ip interface brief']],
    ['S1', ['enable', 'conf t', 'int fa0/1', 'exit', 'exit', 'exit', 'enable']],
    ['S1', ['show running-config', 'show version', 'enable', 'show running-config']],
    ['S1', ['enable', 'conf t', 'ip address 192.168.1.2 255.255.255.0', 'interface vlan 1', 'ip address 192.168.1.2 255.255.255.0', 'no shutdown', 'line vty 0 15', 'transport input ssh', 'end']],
    ['Switch', ['  ENABLE ', 'Configure   Terminal', 'hostname Core-SW1', 'end', 'copy running-config startup-config']],
    ['S1', ['enable', 'conf t', 'line console 0', 'password C0nsole!', 'login', 'interface fa0/5', 'login', 'shutdown', 'do copy running-config startup-config']],
    ['R1', ['end', 'enable', 'disable', 'exit', 'enable']],
    ['S1', ['enable', 'conf t', 'enable secret Cl4ss!2026', 'banner motd ^Authorised only^', 'line vty 0 15', 'enable secret x', 'conf t', 'exit', 'exit']],
    ['S1', ['enable', 'erase startup-config', 'conf t', 'reload', 'end', 'ping 192.168.1.10']],
  ],
  goiY: ['Keep two variables — the name and the mode — and derive the prompt only at the end.', 'Classify each command first (mode change, global, line, interface, EXEC), then decide by the current mode.', 'exit means three different things depending on the mode; in user or privileged EXEC it ends the session.'],
  loi: ['Letting a refused command change the mode or the name.', 'Treating exit in privileged EXEC as "go back to user EXEC" — that is disable.', 'Matching "show running-config" case-sensitively, so "SHOW RUN" slips through in user EXEC.'],
  gt: ['IOS is a small state machine: the prompt is the state, and every command is either legal in that state or refused. Being able to replay a session in your head is what lets you read a lab transcript and point at the exact line where somebody was in the wrong mode.', 'IOS là một máy trạng thái nhỏ: dấu nhắc là trạng thái, và mỗi lệnh hoặc hợp lệ ở trạng thái đó hoặc bị từ chối. Tua lại được một phiên trong đầu là thứ giúp bạn đọc bản ghi lab và chỉ đúng dòng mà ai đó đang đứng sai mode.'],
  kn: ['IOS modes', 'state machine'],
});

const E5 = cs({
  ten: 'IOS 5 — Traps from the lab room', kho: 'HARD', phut: 10,
  en: 'The traps of Lessons 2.1–2.2, as they look when they happen to you.',
  vi: 'Các bẫy của bài 2.1–2.2, đúng hình dạng khi chúng xảy ra với bạn.',
  cau: [
    q('c1', ['You mistype "shwo ip int br" in privileged EXEC and the console freezes for many seconds with "Translating..." on screen. Which line prevents that?', 'Bạn gõ nhầm "shwo ip int br" ở privileged EXEC và console treo nhiều giây với chữ "Translating..." trên màn hình. Dòng nào ngăn chuyện đó?'], ['no ip domain-lookup', 'logging synchronous', 'service password-encryption', 'transport input ssh'], ['IOS treats an unknown word in EXEC as a hostname to connect to and tries to resolve it by DNS. no ip domain-lookup stops the lookup, so a typo fails at once.', 'IOS coi một từ lạ ở EXEC là tên máy cần kết nối và thử phân giải nó bằng DNS. no ip domain-lookup tắt việc tra cứu đó, nên gõ nhầm là hỏng ngay.']),
    q('c2', ['Console messages keep cutting your half-typed command in two. Which line under line console 0 fixes it?', 'Thông báo trên console cứ cắt đôi câu lệnh bạn đang gõ dở. Dòng nào dưới line console 0 sửa được?'], ['logging synchronous', 'exec-timeout 0 0', 'login local', 'no shutdown'], ['logging synchronous makes IOS reprint your partial line after a log message, so you can keep typing where you were.', 'logging synchronous khiến IOS in lại dòng bạn đang gõ dở sau một thông báo log, để bạn gõ tiếp đúng chỗ.']),
    q('c3', ['You are at S1(config-if)# and need show ip interface brief without typing do. Shortest correct sequence?', 'Bạn đang ở S1(config-if)# và cần show ip interface brief mà không gõ do. Chuỗi ngắn nhất đúng là gì?'], ['end, then the show command', 'exit, then the show command', 'exit, exit, exit, then the show command', 'disable, then the show command'], ['end (or Ctrl-Z) goes straight to privileged EXEC. One exit only reaches global configuration, which still refuses EXEC commands; a third exit from there logs you out.', 'end (hoặc Ctrl-Z) về thẳng privileged EXEC. Một exit chỉ về cấu hình toàn cục, nơi vẫn từ chối lệnh EXEC; exit thứ ba từ đó là đăng xuất luôn.']),
    q('c4', ['A colleague says "Telnet is fine in the lab, nobody is listening". Why refuse anyway?', 'Đồng nghiệp nói "Trong lab dùng Telnet cũng được, có ai nghe đâu". Vì sao vẫn từ chối?'], ['Habits formed in the lab survive into production, where a captured Telnet password is a working credential', 'Telnet does not work on Cisco devices made after 2010', 'Telnet uses more bandwidth than SSH and slows the lab network', 'Packet Tracer refuses to simulate Telnet sessions'], ['The lab is where habits are formed. transport input ssh under line vty 0 15 does not merely prefer SSH, it refuses Telnet — use it even when nobody is watching.', 'Lab là nơi hình thành thói quen. transport input ssh dưới line vty 0 15 không chỉ ưu tiên SSH mà từ chối Telnet — dùng nó cả khi không ai nhìn.']),
    q('c5', ['After enable you still see S1>, and no error was printed. What happened?', 'Sau lệnh enable bạn vẫn thấy S1>, và không có lỗi nào in ra. Chuyện gì đã xảy ra?'], ['The password typed at the Password: prompt was wrong', 'enable is only available on routers, not switches', 'The console line is missing the login command', 'You are already in global configuration mode'], ['The prompt is the check: # means privileged EXEC. A wrong or empty password at the Password: prompt leaves you at > — check what you typed before suspecting the device.', 'Dấu nhắc chính là phép kiểm: # là privileged EXEC. Mật khẩu sai hoặc để trống ở lời hỏi Password: giữ bạn lại ở > — kiểm thứ mình gõ trước khi nghi thiết bị.']),
  ],
  goiY: ['Two of these are one-line comfort settings every lab config starts with.', 'end never overshoots; exit can.'],
  loi: ['Pressing exit repeatedly and logging yourself out.', 'Keeping Telnet "just for the lab".'],
  tn: [tn('domain lookup', 'tra cứu tên miền'), tn('logging synchronous', 'đồng bộ thông báo log')], kn: ['IOS navigation'],
});

export default doiDau({ slug: 'nwc204-2-1-ios-access-modes', ten: '2.1 Into the device: access, IOS modes and command structure', khoa: KHOA, baiHoc: 'nwc204-2-1-vao-thiet-bi-console-ssh-va-che-do-ios', de: [E1, E2, E3, E4, E5] });
