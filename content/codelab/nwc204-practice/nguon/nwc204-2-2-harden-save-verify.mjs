/** NWC204 · 2.2 — Hardening, saving, addressing and verifying a switch + Lab 1.1 (Chương 2, buổi 3–6). */
import { doiDau, KHOA, tinh, q, ord, bang1, tn, cs, js, mt, bi, S, code } from './_nw.mjs';

const E1 = cs({
  ten: 'Save 1 — running-config, startup-config and the power cut', kho: 'EASY', phut: 8,
  en: 'Lesson 2.3: two copies of the configuration, and the one command that decides which one survives.',
  vi: 'Bài 2.3: hai bản cấu hình, và một lệnh duy nhất quyết định bản nào sống sót.',
  cau: [
    q('c1', ['Where is the configuration the device is using right now?', 'Cấu hình thiết bị đang dùng ngay lúc này nằm ở đâu?'], ['running-config, in RAM — it changes the instant you press Enter', 'startup-config, in NVRAM', 'In flash, next to the IOS image', 'On the TFTP server it was last copied to'], ['RAM is volatile: everything in running-config disappears when power is removed. startup-config in NVRAM is what is loaded at the next boot.', 'RAM là bộ nhớ khả biến: mọi thứ trong running-config mất khi mất điện. startup-config trong NVRAM là thứ được nạp ở lần khởi động sau.']),
    q('c2', ['Which command saves your work so it survives a reload?', 'Lệnh nào lưu công việc để nó sống sót qua lần khởi động lại?'], ['copy running-config startup-config', 'copy startup-config running-config', 'write erase', 'reload'], ['Source first, destination second: from running to startup. The reverse direction MERGES the old configuration on top of your new one.', 'Nguồn trước, đích sau: từ running sang startup. Chiều ngược lại TRỘN cấu hình cũ đè lên cấu hình mới của bạn.']),
    q('c3', ['After "copy startup-config running-config" by mistake, what does the running configuration look like?', 'Lỡ gõ "copy startup-config running-config", cấu hình đang chạy trông thế nào?'], ['A merge: your new lines stay, old lines come back on top — it matches neither copy', 'Exactly the old startup configuration; your changes are gone', 'Exactly your new configuration; nothing happens', 'Empty, because the copy erased RAM first'], ['Copying INTO running-config merges line by line rather than replacing. The result matches neither file, which is why the trap is so confusing.', 'Chép VÀO running-config là trộn từng dòng chứ không thay thế. Kết quả không khớp với bản nào, đó là lý do bẫy này rất khó hiểu.']),
    q('c4', ['You want the next reload to come up factory-fresh. Which pair of commands?', 'Bạn muốn lần khởi động lại tới lên như mới xuất xưởng. Cặp lệnh nào?'], ['erase startup-config, then reload (answer no when asked to save)', 'no running-config, then reload', 'copy running-config startup-config, then reload', 'delete flash:, then reload'], ['Emptying NVRAM means there is nothing to load at boot. Answering "yes" to the save prompt during reload would write the current configuration straight back.', 'Làm rỗng NVRAM thì lúc khởi động không còn gì để nạp. Trả lời "yes" khi reload hỏi lưu sẽ ghi ngược cấu hình hiện tại vào lại.']),
    q('c5', ['On a Layer 2 switch, where does its own management IP address go?', 'Trên switch tầng 2, địa chỉ IP quản trị của chính nó đặt ở đâu?'], ['interface vlan 1 — the switch virtual interface', 'interface fa0/1 — the port the PC is plugged into', 'line vty 0 15', 'The global command ip address'], ['A Layer 2 switch port carries frames, it has no address. The SVI is the switch\'s own presence on the network — and it stays administratively down until no shutdown.', 'Cổng switch tầng 2 chỉ chuyển frame, không có địa chỉ. SVI là sự hiện diện của chính switch trên mạng — và nó ở trạng thái administratively down cho tới khi gõ no shutdown.']),
  ],
  goiY: ['RAM forgets, NVRAM remembers.', 'copy SOURCE DESTINATION.'],
  loi: ['Assuming IOS saves automatically.', 'Copying in the wrong direction.'],
  tn: [tn('NVRAM', 'RAM không khả biến'), tn('SVI', 'interface ảo của switch')], kn: ['saving configuration'],
});

const AUDIT_DE = `hostname SW
enable password cisco
line console 0
 password cisco
line vty 0 4
 password cisco
 login
 transport input all`;

const E2 = js({
  ten: 'Save 2 — Write auditSwitch(text): find every security hole', kho: 'MEDIUM', phut: 25,
  en: `<p>Lesson 2.2 asks you to read a configuration and name every security problem in order of severity. Write <code>auditSwitch(text)</code> that does it for a switch with <b>16 vty lines (0–15)</b>. <code>text</code> is a running-config: a line that starts without a space begins a new section; lines indented with spaces belong to the section above (e.g. under <code>line console 0</code>); a line starting with <code>!</code> ends the section.</p>
<p>Return an array of these codes, <b>in exactly this order</b>, each at most once:</p>
<ol>
<li><code>"console-no-login"</code> — there is no <code>line console 0</code> (or <code>line con 0</code>) section, or it has neither <code>login</code> nor <code>login local</code>. A password without <code>login</code> is never asked for.</li>
<li><code>"vty-no-login"</code> — some <code>line vty A B</code> section has neither <code>login</code> nor <code>login local</code>.</li>
<li><code>"enable-password"</code> — a global <code>enable password …</code> line exists (stored in readable text).</li>
<li><code>"no-enable-secret"</code> — there is no global <code>enable secret …</code> line.</li>
<li><code>"telnet-allowed"</code> — there is no vty section at all, or some vty section lacks exactly <code>transport input ssh</code> (<code>all</code>, <code>telnet</code>, <code>telnet ssh</code> or no transport line all accept Telnet).</li>
<li><code>"vty-partial"</code> — the vty sections together do not cover every line 0–15.</li>
<li><code>"no-password-encryption"</code> — no <code>service password-encryption</code>.</li>
<li><code>"no-banner"</code> — no <code>banner motd …</code>.</li>
</ol>
<p>Compare case-insensitively and ignore trailing spaces. The configuration from the lesson's exercise is the first sample:</p>${code(AUDIT_DE)}`,
  vi: `<p>Bài 2.2 bắt bạn đọc một cấu hình rồi gọi tên mọi lỗ hổng bảo mật theo thứ tự nghiêm trọng. Viết <code>auditSwitch(text)</code> làm đúng việc đó cho một switch có <b>16 dòng vty (0–15)</b>. <code>text</code> là một running-config: dòng bắt đầu không có dấu cách mở một mục mới; các dòng thụt vào bằng dấu cách thuộc mục ngay trên (ví dụ dưới <code>line console 0</code>); dòng bắt đầu bằng <code>!</code> kết thúc mục.</p>
<p>Trả về mảng các mã sau, <b>đúng thứ tự này</b>, mỗi mã nhiều nhất một lần:</p>
<ol>
<li><code>"console-no-login"</code> — không có mục <code>line console 0</code> (hoặc <code>line con 0</code>), hoặc mục đó không có <code>login</code> lẫn <code>login local</code>. Mật khẩu mà thiếu <code>login</code> thì không bao giờ được hỏi.</li>
<li><code>"vty-no-login"</code> — có một mục <code>line vty A B</code> không có <code>login</code> lẫn <code>login local</code>.</li>
<li><code>"enable-password"</code> — có dòng toàn cục <code>enable password …</code> (lưu dạng đọc được).</li>
<li><code>"no-enable-secret"</code> — không có dòng toàn cục <code>enable secret …</code>.</li>
<li><code>"telnet-allowed"</code> — không có mục vty nào, hoặc có mục vty thiếu đúng dòng <code>transport input ssh</code> (<code>all</code>, <code>telnet</code>, <code>telnet ssh</code> hay không có dòng transport đều nhận Telnet).</li>
<li><code>"vty-partial"</code> — gộp các mục vty lại vẫn không phủ đủ mọi dòng 0–15.</li>
<li><code>"no-password-encryption"</code> — không có <code>service password-encryption</code>.</li>
<li><code>"no-banner"</code> — không có <code>banner motd …</code>.</li>
</ol>
<p>So không phân biệt hoa thường và bỏ qua khoảng trắng cuối dòng. Cấu hình trong bài tập của bài học là ca mẫu đầu tiên:</p>${code(AUDIT_DE)}`,
  yc: [bi('Return the array; do not print it.', 'Trả về mảng, đừng in ra.'), bi('Codes must appear in the order listed, not in the order you found them.', 'Các mã phải theo đúng thứ tự đã liệt kê, không theo thứ tự bạn tìm thấy.')],
  fn: 'auditSwitch', params: 'text', ref: S.auditSwitch,
  cases: [
    [AUDIT_DE],
    ['hostname S1\nenable secret 5 $1$mERr$9cTjUIEqNGurQiFU.ZeCi1\nservice password-encryption\nbanner motd ^Authorised access only^\nline console 0\n password 7 08701E1D5D4C53\n login\n logging synchronous\nline vty 0 15\n password 7 0822455D0A16\n login\n transport input ssh'],
    ['hostname S1\nenable secret 9 $9$abc\nenable password cisco\nservice password-encryption\nbanner motd #No entry#\nline con 0\n login\nline vty 0 4\n login local\n transport input ssh\nline vty 5 15\n login local\n transport input ssh'],
    ['hostname S1\nenable secret 9 $9$abc\nline console 0\n password x\nline vty 0 15\n password y\n transport input telnet ssh'],
    ['hostname S1\nenable secret 9 $9$abc\nservice password-encryption\nbanner motd ^x^\nline console 0\n login\n!\nline vty 0 4\n login\n transport input ssh\n!\nline vty 5 15\n login\n transport input all'],
    ['hostname S1\nENABLE SECRET 5 $1$q\nService Password-Encryption\nBanner MOTD ^x^\nLine Console 0\n Login   \nline vty 0 15\n Login Local\n Transport Input SSH'],
    ['hostname Lab\nbanner motd ^x^\nline console 0\n password p\n login\nline vty 0 15\n password p\n login\n transport input ssh'],
    ['hostname S1\nenable secret 5 $1$q\nservice password-encryption\nbanner motd ^x^\nline console 0\n login\n!\n password stray\nline vty 0 14\n login\n transport input ssh'],
  ],
  goiY: ['Parse first: collect the top-level lines, the console section and a list of vty sections with their from/to numbers.', 'Then run eight independent checks and push the codes in the fixed order.', 'For coverage, mark every line number from each "line vty A B", then look for any of 0..15 left unmarked.'],
  loi: ['Treating "transport input telnet ssh" as safe because it contains ssh.', 'Missing "line con 0" as the short form of "line console 0".', 'Attaching an indented line that comes after "!" to the previous section.'],
  gt: ['An audit is a list of independent yes/no questions asked of the text, reported in severity order so that the reader fixes the open door before the cosmetic issue. The console password without login comes first because it looks configured and protects nothing.', 'Một lần soát là danh sách các câu hỏi có/không độc lập đặt vào văn bản, báo theo thứ tự nghiêm trọng để người đọc vá cửa đang mở trước rồi mới tới chuyện thẩm mỹ. Mật khẩu console thiếu login đứng đầu vì nó trông như đã cấu hình mà không bảo vệ gì.'],
  kn: ['device hardening', 'configuration audit'],
});

const E3 = tinh({
  tieuDe: 'Save 3 — Lab 1.1 in the order that cannot go wrong', doKho: 'MEDIUM', phut: 8,
  moTa: mt('Lesson 2.5: every step of Lab 1.1 removes a dependency for the next one. Put the steps in the order the lesson gives.', 'Bài 2.5: mỗi bước của Lab 1.1 gỡ một sự phụ thuộc cho bước sau. Xếp các bước theo đúng thứ tự bài học đưa ra.'),
  loai: 'order',
  cauHoi: [ord('q1', ['Lab 1.1 from a cold switch', 'Lab 1.1 từ một switch nguội'], ['Cable the console and the PC, then erase startup-config and reload', 'hostname S1 — every later screenshot carries the name', 'enable secret, console password + login, vty login + transport input ssh', 'service password-encryption and banner motd', 'interface vlan 1: ip address and no shutdown; static address on PC-A', 'Verify: show ip interface brief and ping in BOTH directions', 'copy running-config startup-config, then check show startup-config'], ['Start clean so nobody else\'s configuration is in your way, name it, secure it, address it, verify it — and save last, after verifying, so a broken configuration never reaches NVRAM.', 'Bắt đầu sạch để cấu hình của nhóm trước không cản đường, đặt tên, bảo mật, đánh địa chỉ, nghiệm thu — và lưu SAU CÙNG, sau khi nghiệm thu, để cấu hình hỏng không bao giờ vào NVRAM.'])],
  goiY: ['Name → secure → address → verify → save.', 'Erasing comes before everything because a shared lab switch carries the previous group\'s work.'],
  loiHayGap: ['Saving before verifying, so a broken configuration becomes the startup configuration.', 'Skipping erase startup-config and fighting a stranger\'s leftover settings.'],
  thuatNgu: [tn('order of operations', 'thứ tự thao tác')], khaiNiem: ['Lab 1.1'],
});

const BRIEF = `Interface      IP-Address     OK? Method Status                Protocol
Vlan1          192.168.1.2    YES manual up                    up
Fa0/2          unassigned     YES unset  down                  down
Fa0/3          unassigned     YES unset  administratively down down
Gi0/1          unassigned     YES unset  up                    down
Fa0/6          unassigned     YES unset  up                    up`;

const E4 = js({
  ten: 'Save 4 — Write ifaceVerdicts(text): read show ip interface brief', kho: 'MEDIUM', phut: 20,
  en: `<p>Lesson 2.4: the Status column is layer 1, the Protocol column is layer 2, and <i>administratively down</i> means somebody typed <code>shutdown</code>. Write <code>ifaceVerdicts(text)</code> that reads the output of <code>show ip interface brief</code> and returns one <code>{ iface, verdict }</code> per interface line, in order:</p>
<ul>
<li><code>"admin-down"</code> — the line contains <code>administratively down</code> (fix: <code>no shutdown</code>).</li>
<li><code>"ok"</code> — Status <code>up</code>, Protocol <code>up</code>.</li>
<li><code>"layer2"</code> — Status <code>up</code>, Protocol <code>down</code>: the signal arrived, the two ends do not agree.</li>
<li><code>"layer1"</code> — Status <code>down</code>: cable, port, or the far device.</li>
</ul>
<p>Skip the header line (it starts with <code>Interface</code>) and blank lines. Columns are separated by one or more spaces; Status and Protocol are the last two words of a line (except that <i>administratively down</i> is two words).</p>${code(BRIEF)}`,
  vi: `<p>Bài 2.4: cột Status là tầng 1, cột Protocol là tầng 2, còn <i>administratively down</i> nghĩa là ai đó đã gõ <code>shutdown</code>. Viết <code>ifaceVerdicts(text)</code> đọc kết xuất của <code>show ip interface brief</code> và trả về một <code>{ iface, verdict }</code> cho mỗi dòng interface, theo thứ tự:</p>
<ul>
<li><code>"admin-down"</code> — dòng có chữ <code>administratively down</code> (sửa: <code>no shutdown</code>).</li>
<li><code>"ok"</code> — Status <code>up</code>, Protocol <code>up</code>.</li>
<li><code>"layer2"</code> — Status <code>up</code>, Protocol <code>down</code>: tín hiệu đã tới, hai đầu không thống nhất.</li>
<li><code>"layer1"</code> — Status <code>down</code>: cáp, cổng, hoặc thiết bị đầu bên kia.</li>
</ul>
<p>Bỏ dòng tiêu đề (bắt đầu bằng <code>Interface</code>) và dòng trống. Các cột cách nhau một hoặc nhiều dấu cách; Status và Protocol là hai từ cuối của dòng (riêng <i>administratively down</i> là hai từ).</p>${code(BRIEF)}`,
  fn: 'ifaceVerdicts', params: 'text', ref: S.ifaceVerdicts,
  cases: [
    [BRIEF],
    ['Interface IP-Address OK? Method Status Protocol\nVlan1 192.168.1.2 YES manual administratively down down'],
    ['Interface              IP-Address      OK? Method Status                Protocol\nGigabitEthernet0/0/0   192.168.10.1    YES manual up                    up\nGigabitEthernet0/0/1   10.0.0.1        YES manual down                  down\nSerial0/1/0            10.1.1.1        YES manual up                    down\n\nVlan1                  unassigned      YES unset  administratively down down'],
    ['Interface IP-Address OK? Method Status Protocol\n'],
    ['Interface IP-Address OK? Method Status Protocol\nFa0/1 unassigned YES unset up up\nFa0/2 unassigned YES unset up up\nFa0/24 unassigned YES unset down down'],
  ],
  goiY: ['Test for "administratively down" before splitting into columns.', 'After splitting on whitespace, the last two tokens are Status and Protocol.'],
  loi: ['Reading the IP-Address column as a verdict ("unassigned" is normal on a Layer 2 port).', 'Splitting on a single space, which breaks on aligned columns.'],
  gt: ['Two columns exist because two independent things must be true before a link works. Reading them as a pair halves the search: down/down sends you to the cable, up/down to the configuration at both ends, administratively down to a person.', 'Có hai cột vì phải đúng hai điều độc lập thì một liên kết mới chạy. Đọc chúng thành một cặp là chia đôi vùng tìm: down/down đưa bạn tới sợi cáp, up/down tới cấu hình ở hai đầu, administratively down tới một con người.'],
  kn: ['interface status', 'layer 1 vs layer 2'],
});

const E5 = cs({
  ten: 'Save 5 — Read the ping, predict the failure', kho: 'HARD', phut: 12,
  en: 'Lessons 2.3–2.5: what the ping symbols say, and how one wrong value on a host breaks some tests and not others.',
  vi: 'Bài 2.3–2.5: các ký hiệu của ping nói gì, và một giá trị sai trên máy trạm làm hỏng phép thử này mà không hỏng phép thử kia ra sao.',
  cau: [
    q('c1', ['First ping from the switch to a PC prints .!!!! (80%). The second prints !!!!!. What was the first dot?', 'Lần ping đầu từ switch tới PC in .!!!! (80%). Lần hai in !!!!!. Dấu chấm đầu tiên là gì?'], ['The ARP exchange for the PC\'s MAC address, once', 'Real packet loss of 20% on the link', 'The PC firewall dropping one request', 'Spanning tree blocking the port for a second'], ['The first echo waits for ARP and times out; once the MAC is cached every packet goes through. Reporting it as "20% loss" is a classic lab-report error — the second run is the proof.', 'Gói echo đầu phải chờ ARP và hết giờ; khi MAC đã nằm trong bộ đệm thì mọi gói đều qua. Ghi nó thành "mất 20%" là lỗi báo cáo lab kinh điển — lần chạy thứ hai là bằng chứng.']),
    q('c2', ['An IOS ping prints U.U.U. What does the U tell you that a dot would not?', 'Ping trên IOS in U.U.U. Chữ U cho bạn biết điều gì mà dấu chấm không nói?'], ['A router replied that it has no route onward', 'The destination is up but too busy to reply', 'The cable is unplugged at the far end of the link', 'The switch has no default gateway configured'], ['A dot is silence; a U is an answer from a router that has no way forward. That rules out your own address, mask and the path to the router, and points at that router\'s routing table.', 'Dấu chấm là im lặng; chữ U là câu trả lời từ một router không có đường đi tiếp. Nó loại trừ địa chỉ, mặt nạ của bạn và đường tới router đó, rồi chỉ thẳng vào bảng định tuyến của router ấy.']),
    q('c3', ['PC: 10.10.5.40, mask 255.255.255.0, gateway 10.10.6.1. Which ping still works?', 'PC: 10.10.5.40, mặt nạ 255.255.255.0, gateway 10.10.6.1. Lệnh ping nào vẫn chạy?'], ['ping 10.10.5.1 (a host in its own subnet)', 'ping 10.10.6.1 (its gateway)', 'ping 8.8.8.8', 'ping google.com'], ['10.10.5.1 is local, so no gateway is involved. Everything else needs the gateway, and 10.10.6.1 is not in 10.10.5.0/24 — to reach its gateway the PC would need a gateway. One wrong octet breaks three tests while the LAN keeps working.', '10.10.5.1 là cục bộ nên không cần gateway. Mọi thứ khác cần gateway, mà 10.10.6.1 không nằm trong 10.10.5.0/24 — muốn tới gateway thì PC lại cần một gateway. Sai một octet làm hỏng ba phép thử trong khi LAN vẫn chạy.']),
    q('c4', ['PC-A cannot ping S1 at 192.168.1.2. show ip interface brief: Vlan1 192.168.1.2 … administratively down down, and Fa0/6 up up. Why does the port being up not help?', 'PC-A không ping được S1 ở 192.168.1.2. show ip interface brief: Vlan1 192.168.1.2 … administratively down down, còn Fa0/6 up up. Vì sao cổng up mà vẫn không ích gì?'], ['The ping is addressed to the switch itself, which answers from its SVI — and the SVI is shut', 'Fa0/6 is in the wrong VLAN, so the frames are dropped', 'The PC needs a default gateway to reach a switch', 'Layer 2 switches never answer ICMP'], ['Fa0/6 up/up proves the cable and the forwarding. But the switch answers pings from interface vlan 1, and an administratively down SVI has no active IP presence. Fix: interface vlan 1, no shutdown, then expect .!!!! the first time.', 'Fa0/6 up/up chứng minh sợi cáp và việc chuyển tiếp. Nhưng switch trả lời ping từ interface vlan 1, mà SVI đang administratively down thì không có hiện diện IP nào. Sửa: interface vlan 1, no shutdown, rồi lần đầu sẽ thấy .!!!!']),
    q('c5', ['The switch pings the PC fine, but the PC cannot ping the switch. Both are in 192.168.1.0/24. Most likely cause?', 'Switch ping PC ổn, nhưng PC không ping được switch. Cả hai đều trong 192.168.1.0/24. Nguyên nhân nhiều khả năng nhất?'], ['A firewall on the PC filters one direction', 'The switch is missing its enable secret', 'The console cable is still plugged into S1', 'The switch has not saved its configuration'], ['One-way success is a real state: it proves the forward path and says nothing about the return. That is why the lab requires pinging in both directions, and why a host firewall is the first suspect.', 'Thông một chiều là trạng thái có thật: nó chứng minh chiều đi và không nói gì về chiều về. Đó là lý do lab bắt ping cả hai chiều, và tường lửa trên máy trạm là nghi phạm đầu tiên.']),
  ],
  goiY: ['A dot is silence; a U is an answer.', 'Apply the AND test to the gateway itself.'],
  loi: ['Calling the first dot packet loss.', 'Testing connectivity in one direction only.'],
  tn: [tn('destination unreachable', 'không tới được đích'), tn('one-way connectivity', 'thông một chiều')], kn: ['ping', 'verification'],
});

export default doiDau({ slug: 'nwc204-2-2-harden-save-verify', ten: '2.2 Harden, save, address and verify: Lab 1.1', khoa: KHOA, baiHoc: 'nwc204-2-4-cau-hinh-ip-va-kiem-tra-ket-noi', de: [E1, E2, E3, E4, E5] });
