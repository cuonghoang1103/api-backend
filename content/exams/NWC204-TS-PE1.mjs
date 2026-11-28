/**
 * NWC204 — Practical Exam (tự soạn theo dạng đề): MỘT tình huống tích hợp gồm năm nhóm việc, 85 phút.
 *
 * Bám syllabus FLM 14520: "Practical Exam — 20%, 85 minutes, CLO2, CLO3, CLO5, CLO6, CLO7, CLO8 — One integrated
 * scenario consisting of several task groups". Bài thật làm trên Packet Tracer; ở Phòng thi web, học viên VIẾT
 * đúng các lệnh / bảng mình sẽ gõ, AI chấm theo đáp án mẫu + rubric (peType WRITE, như các đề PE viết khác).
 *
 * Năm nhóm việc = năm câu, mỗi câu 2 điểm: (1) hoạch định địa chỉ VLSM · (2) cấu hình cơ bản + làm cứng + SSH ·
 * (3) interface IPv4/IPv6, default route, SVI và máy trạm · (4) giới hạn truy cập quản trị (ACL standard trên vty,
 * tắt cổng thừa) · (5) nghiệm thu và gỡ bốn lỗi cài sẵn.
 *
 * Bảng địa chỉ do bộ mô phỏng Code Lab tính (content/codelab/nwc204-practice/nguon/_sim.mjs › vlsm, ipInfo).
 * Mọi lệnh là cú pháp Cisco IOS chuẩn cho ISR 4331 (G0/0/0–G0/0/2) và Catalyst 2960; địa chỉ phía ISP là dải
 * tài liệu RFC 5737 (203.0.113.0/24), IPv6 là dải tài liệu 2001:db8::/32.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NWC204-TS-PE1.mjs --apply
 * Kiểm: node scripts/exam-check.mjs content/exams/NWC204-TS-PE1.mjs
 */
import { B, EX, code, rubric } from './_lib/nwc204-exam-kit.mjs';
import * as S from '../codelab/nwc204-practice/nguon/_sim.mjs';

const V = S.vlsm('192.168.50.0', 24, [{ name: 'STAFF', hosts: 50 }, { name: 'LAB', hosts: 25 }, { name: 'PRINT', hosts: 10 }]);
const [ST, LB, PR] = ['STAFF', 'LAB', 'PRINT'].map((n) => V.find((x) => x.name === n));
const mask = (p) => S.ipInfo('0.0.0.0', p).mask;
const wild = (p) => S.ipInfo('0.0.0.0', p).wildcard;
const cong = (ip, k) => { const a = ip.split('.').map(Number); a[3] += k; return a.join('.'); };

const TOPO = `                 ISP 203.0.113.1/30
                      |
                 G0/0/2 203.0.113.2/30
   +------------- R1 (ISR 4331) -------------+
 G0/0/0 (LAN STAFF)                    G0/0/1 (LAN LAB)
   |                                         |
  S1 (2960) Fa0/1                           S2 (2960) Fa0/1
   |  Fa0/2                                  |  Fa0/2
 PC-A                                       PC-B

 LAN PRINT (10 hosts) is reserved for a later phase — plan it, do not configure it.`;

const SCENARIO = (en) => en
  ? `<p><b>Scenario.</b> A small branch office of a training company is being set up. You are given the address block <b>192.168.50.0/24</b> and must build the network below so that both LANs reach each other and the Internet over IPv4, both LANs also run IPv6, and only the STAFF LAN can manage the router.</p>${code(TOPO)}<p><b>Requirements:</b> STAFF needs 50 hosts, LAB 25 hosts, PRINT 10 hosts (planned now, configured later). Allocate with VLSM, largest LAN first, starting at 192.168.50.0. Router interface = FIRST usable address, switch SVI = SECOND usable, PC = LAST usable. IPv6: STAFF 2001:db8:acad:10::/64, LAB 2001:db8:acad:20::/64, router ::1 with link-local fe80::1 on both LAN interfaces.</p><p>Common values for every device: domain <code>netlab.local</code>, enable secret <code>Cl4ss!2026</code>, console and vty password <code>Line!2026</code>, local user <code>admin</code> with secret <code>Adm1n!2026</code>, banner <code>Authorised access only</code>.</p>`
  : `<p><b>Tình huống.</b> Một chi nhánh nhỏ của công ty đào tạo đang được dựng. Bạn được cấp khối địa chỉ <b>192.168.50.0/24</b> và phải dựng mạng dưới đây sao cho hai LAN tới được nhau và tới Internet qua IPv4, cả hai LAN chạy thêm IPv6, và chỉ LAN STAFF được quản trị router.</p>${code(TOPO)}<p><b>Yêu cầu:</b> STAFF cần 50 host, LAB 25 host, PRINT 10 host (hoạch định ngay, cấu hình sau). Chia bằng VLSM, LAN lớn nhất trước, bắt đầu từ 192.168.50.0. Interface router = địa chỉ dùng được ĐẦU TIÊN, SVI của switch = THỨ HAI, PC = CUỐI CÙNG. IPv6: STAFF 2001:db8:acad:10::/64, LAB 2001:db8:acad:20::/64, router ::1 kèm link-local fe80::1 trên cả hai interface LAN.</p><p>Giá trị chung cho mọi thiết bị: domain <code>netlab.local</code>, enable secret <code>Cl4ss!2026</code>, mật khẩu console và vty <code>Line!2026</code>, tài khoản cục bộ <code>admin</code> với secret <code>Adm1n!2026</code>, banner <code>Authorised access only</code>.</p>`;

const prompt = (n, en, vi) => B(`${n === 1 ? SCENARIO(true) : '<p><i>Same scenario and topology as Task 1.</i></p>'}${en}`, `${n === 1 ? SCENARIO(false) : '<p><i>Cùng tình huống và sơ đồ như Nhiệm vụ 1.</i></p>'}${vi}`);

const bangDiaChi = [
  ['LAN', 'Network/prefix', 'Mask', 'Gateway (R1)', 'Switch SVI', 'PC (last usable)', 'Broadcast'],
  ['STAFF (50)', `${ST.network}/${ST.prefix}`, mask(ST.prefix), ST.firstHost, cong(ST.firstHost, 1), ST.lastHost, ST.broadcast],
  ['LAB (25)', `${LB.network}/${LB.prefix}`, mask(LB.prefix), LB.firstHost, cong(LB.firstHost, 1), LB.lastHost, LB.broadcast],
  ['PRINT (10)', `${PR.network}/${PR.prefix}`, mask(PR.prefix), `${PR.firstHost} (planned)`, '—', `${PR.lastHost} (planned)`, PR.broadcast],
];
const bangHtml = `<table>${bangDiaChi.map((r, i) => `<tr>${r.map((x) => (i ? `<td>${x}</td>` : `<th>${x}</th>`)).join('')}</tr>`).join('')}</table>`;

const Q1 = {
  kind: 'WRITE', points: 2,
  prompt: prompt(1,
    `<p><b>Task 1 — Addressing plan (2 points).</b> Write the complete VLSM table: for STAFF, LAB and PRINT give the network address with prefix, the subnet mask, the router (gateway) address, the switch SVI address, the PC address, and the broadcast address. Then state in one sentence why the largest LAN must be allocated first.</p>`,
    `<p><b>Nhiệm vụ 1 — Hoạch định địa chỉ (2 điểm).</b> Viết đầy đủ bảng VLSM: với STAFF, LAB và PRINT ghi địa chỉ mạng kèm prefix, mặt nạ, địa chỉ router (gateway), địa chỉ SVI của switch, địa chỉ PC và địa chỉ broadcast. Sau đó nói trong một câu vì sao phải cấp cho LAN lớn nhất trước.</p>`),
  sampleSolution: EX(
    `<p><b>Reference addressing table</b></p>${bangHtml}<p>50 hosts need 6 host bits (2⁶ − 2 = 62) ⇒ /26; 25 hosts need 5 (30) ⇒ /27; 10 hosts need 4 (14) ⇒ /28. Allocating largest first keeps every block on its natural boundary (.0, .64, .96) — allocating small blocks first leaves gaps that a larger block can no longer fit into.</p>`,
    `<p><b>Bảng địa chỉ mẫu</b></p>${bangHtml}<p>50 host cần 6 bit host (2⁶ − 2 = 62) ⇒ /26; 25 host cần 5 bit (30) ⇒ /27; 10 host cần 4 bit (14) ⇒ /28. Cấp cho LAN lớn trước giữ mọi khối đúng ranh giới tự nhiên (.0, .64, .96) — cấp khối nhỏ trước sẽ để lại khe hở mà khối lớn hơn không còn vừa.</p>`),
  rubric: rubric([
    ['prefixes', 'Correct prefix and mask for each LAN (/26, /27, /28) and correct network addresses in largest-first order.', 'Prefix và mặt nạ đúng cho từng LAN (/26, /27, /28) và địa chỉ mạng đúng theo thứ tự lớn trước.', 0.8],
    ['hosts', 'Correct gateway, SVI, PC and broadcast addresses following the first / second / last usable rule.', 'Địa chỉ gateway, SVI, PC và broadcast đúng theo quy tắc dùng được đầu / thứ hai / cuối.', 0.8],
    ['why', 'A correct reason for largest-first allocation (block boundaries, no unusable gaps).', 'Lý do đúng cho việc cấp lớn trước (ranh giới khối, không để khe hở không dùng được).', 0.4],
  ]),
};

const CAU_HINH_CO_BAN = `! R1 (the same block, with hostname S1 / S2, on each switch)
enable
configure terminal
hostname R1
no ip domain-lookup
enable secret Cl4ss!2026
service password-encryption
banner motd ^Authorised access only^
line console 0
 password Line!2026
 login
 logging synchronous
 exit
ip domain-name netlab.local
username admin secret Adm1n!2026
crypto key generate rsa modulus 2048
ip ssh version 2
line vty 0 4          ! line vty 0 15 on the 2960 switches
 login local
 transport input ssh
 exit
end
copy running-config startup-config`;

const Q2 = {
  kind: 'WRITE', points: 2,
  prompt: prompt(2,
    `<p><b>Task 2 — Basic configuration and hardening (2 points).</b> Write, in the order you would type them from <code>Router&gt;</code>, the commands that configure R1 with: hostname, no DNS lookup on typos, the enable secret, password encryption, the banner, a protected console line, and SSH version 2 only on the vty lines using the local user (2048-bit key). Say what changes for S1 and S2, and name the command that proves SSH is enabled.</p>`,
    `<p><b>Nhiệm vụ 2 — Cấu hình cơ bản và làm cứng (2 điểm).</b> Viết, theo đúng thứ tự bạn sẽ gõ từ <code>Router&gt;</code>, các lệnh cấu hình R1 gồm: hostname, không tra DNS khi gõ nhầm, enable secret, mã hoá mật khẩu, banner, dòng console có bảo vệ, và chỉ SSH phiên bản 2 trên các dòng vty dùng tài khoản cục bộ (khoá 2048 bit). Nêu điều gì khác đi với S1 và S2, và gọi tên lệnh chứng minh SSH đã bật.</p>`),
  sampleSolution: EX(
    `<p><b>Reference configuration</b></p>${code(CAU_HINH_CO_BAN)}<p>Order matters in two places: <code>hostname</code> and <code>ip domain-name</code> must exist before <code>crypto key generate rsa</code> (the key is named R1.netlab.local), and <code>username</code> must exist before <code>login local</code>, otherwise the next login has no account to check. On the switches: hostname S1 / S2 and <code>line vty 0 15</code> so no vty line is left unprotected. Proof: <code>show ip ssh</code> must report SSH Enabled, version 2.0.</p>`,
    `<p><b>Cấu hình mẫu</b></p>${code(CAU_HINH_CO_BAN)}<p>Thứ tự quan trọng ở hai chỗ: <code>hostname</code> và <code>ip domain-name</code> phải có trước <code>crypto key generate rsa</code> (khoá mang tên R1.netlab.local), và <code>username</code> phải có trước <code>login local</code>, nếu không lần đăng nhập sau chẳng có tài khoản nào để đối chiếu. Trên switch: hostname S1 / S2 và <code>line vty 0 15</code> để không dòng vty nào bị bỏ ngỏ. Bằng chứng: <code>show ip ssh</code> phải báo SSH Enabled, version 2.0.</p>`),
  rubric: rubric([
    ['secure', 'enable secret (not enable password), console password WITH login, service password-encryption, banner motd.', 'enable secret (không phải enable password), mật khẩu console CÓ login, service password-encryption, banner motd.', 0.8],
    ['ssh', 'All SSH prerequisites in a valid order: hostname, ip domain-name, RSA key 2048, ip ssh version 2, username, vty login local + transport input ssh.', 'Đủ điều kiện SSH theo thứ tự hợp lệ: hostname, ip domain-name, khoá RSA 2048, ip ssh version 2, username, vty login local + transport input ssh.', 0.8],
    ['verify', 'Mentions vty 0 15 on the switches, saving the configuration, and show ip ssh as proof.', 'Nêu vty 0 15 trên switch, lưu cấu hình, và show ip ssh làm bằng chứng.', 0.4],
  ]),
};

const CAU_HINH_IF = `! R1
configure terminal
ipv6 unicast-routing
interface g0/0/0
 description LAN STAFF
 ip address ${ST.firstHost} ${mask(ST.prefix)}
 ipv6 address 2001:db8:acad:10::1/64
 ipv6 address fe80::1 link-local
 no shutdown
interface g0/0/1
 description LAN LAB
 ip address ${LB.firstHost} ${mask(LB.prefix)}
 ipv6 address 2001:db8:acad:20::1/64
 ipv6 address fe80::1 link-local
 no shutdown
interface g0/0/2
 description Link to ISP
 ip address 203.0.113.2 255.255.255.252
 no shutdown
 exit
ip route 0.0.0.0 0.0.0.0 203.0.113.1
end

! S1
configure terminal
interface vlan 1
 ip address ${cong(ST.firstHost, 1)} ${mask(ST.prefix)}
 no shutdown
 exit
ip default-gateway ${ST.firstHost}
end

! S2
configure terminal
interface vlan 1
 ip address ${cong(LB.firstHost, 1)} ${mask(LB.prefix)}
 no shutdown
 exit
ip default-gateway ${LB.firstHost}
end

! PC-A: ${ST.lastHost} / ${mask(ST.prefix)}, gateway ${ST.firstHost}, IPv6 2001:db8:acad:10::10/64, gateway fe80::1
! PC-B: ${LB.lastHost} / ${mask(LB.prefix)}, gateway ${LB.firstHost}, IPv6 2001:db8:acad:20::10/64, gateway fe80::1`;

const Q3 = {
  kind: 'WRITE', points: 2,
  prompt: prompt(3,
    `<p><b>Task 3 — Interfaces, IPv6 and the way out (2 points).</b> Write the commands that: address R1's three interfaces (IPv4 on all three, IPv6 global + link-local fe80::1 on both LAN interfaces, a description on each), enable IPv6 routing, give R1 a default route to the ISP, and give S1 and S2 their management address and default gateway. Then give PC-A's and PC-B's IPv4 and IPv6 settings (use ::10 as the PC's IPv6 host part).</p>`,
    `<p><b>Nhiệm vụ 3 — Interface, IPv6 và lối ra (2 điểm).</b> Viết các lệnh: đặt địa chỉ ba interface của R1 (IPv4 cả ba, IPv6 global + link-local fe80::1 trên hai interface LAN, mô tả cho từng cái), bật định tuyến IPv6, cho R1 một default route tới ISP, và cho S1, S2 địa chỉ quản trị cùng default gateway. Sau đó ghi thiết lập IPv4 và IPv6 của PC-A và PC-B (dùng ::10 làm phần host IPv6 của PC).</p>`),
  sampleSolution: EX(
    `<p><b>Reference configuration</b></p>${code(CAU_HINH_IF)}<p>The three things graders see forgotten most: <code>no shutdown</code> on every router interface (they are shut by default), <code>ipv6 unicast-routing</code> (without it R1 does not route IPv6 or send Router Advertisements), and the switch's <code>ip default-gateway</code> — a router would use <code>ip route 0.0.0.0 0.0.0.0</code> instead, and typing <code>ip default-gateway</code> on R1 is accepted and ignored. Using fe80::1 as the link-local on both LANs is legal because a link-local address only has to be unique on its own link, and it gives the hosts one easy gateway to remember.</p>`,
    `<p><b>Cấu hình mẫu</b></p>${code(CAU_HINH_IF)}<p>Ba thứ người chấm thấy bị quên nhiều nhất: <code>no shutdown</code> trên mọi interface của router (mặc định chúng bị tắt), <code>ipv6 unicast-routing</code> (thiếu nó R1 không định tuyến IPv6 và không gửi Router Advertisement), và <code>ip default-gateway</code> của switch — router thì dùng <code>ip route 0.0.0.0 0.0.0.0</code>, còn gõ <code>ip default-gateway</code> trên R1 thì được nhận và bị bỏ qua. Dùng fe80::1 làm link-local trên cả hai LAN là hợp lệ vì link-local chỉ cần duy nhất trên chính đường link của nó, và nó cho máy trạm một gateway dễ nhớ.</p>`),
  rubric: rubric([
    ['router', 'Correct IPv4 addresses and masks on G0/0/0, G0/0/1 and G0/0/2, no shutdown on each, descriptions, and the default route to 203.0.113.1.', 'Địa chỉ IPv4 và mặt nạ đúng trên G0/0/0, G0/0/1, G0/0/2, no shutdown từng cái, có description, và default route tới 203.0.113.1.', 0.8],
    ['ipv6', 'ipv6 unicast-routing plus correct global and link-local addresses on both LAN interfaces; PCs use fe80::1 (or the router GUA) as IPv6 gateway.', 'ipv6 unicast-routing cùng địa chỉ global và link-local đúng trên cả hai interface LAN; PC dùng fe80::1 (hoặc GUA của router) làm gateway IPv6.', 0.6],
    ['hosts', 'S1/S2 SVI with no shutdown and ip default-gateway; PC-A and PC-B with the right address, mask and gateway.', 'SVI của S1/S2 có no shutdown và ip default-gateway; PC-A và PC-B đúng địa chỉ, mặt nạ, gateway.', 0.6],
  ]),
};

const CAU_HINH_ACL = `! R1 — only the STAFF LAN may open a management session
configure terminal
access-list 10 remark Management from STAFF only
access-list 10 permit ${ST.network} ${wild(ST.prefix)}
line vty 0 4
 access-class 10 in
 exec-timeout 5 0
 exit
end

! S1 and S2 — switch off every access port that is not cabled
configure terminal
interface range fa0/3 - 24
 shutdown
end
copy running-config startup-config`;

const Q4 = {
  kind: 'WRITE', points: 2,
  prompt: prompt(4,
    `<p><b>Task 4 — Restrict management and close unused ports (2 points).</b> (a) Write a standard numbered ACL and apply it so that only hosts in the STAFF LAN can open SSH sessions to R1, and idle sessions close after 5 minutes. (b) On S1 and S2, only Fa0/1 and Fa0/2 are cabled: switch every other access port off. (c) Explain why the ACL is applied with <code>access-class</code> on the vty lines rather than with <code>ip access-group</code> on an interface, and what implicit rule ends every ACL.</p>`,
    `<p><b>Nhiệm vụ 4 — Giới hạn quản trị và đóng cổng thừa (2 điểm).</b> (a) Viết một ACL standard đánh số và áp nó sao cho chỉ máy trong LAN STAFF mở được phiên SSH tới R1, và phiên nhàn rỗi tự đóng sau 5 phút. (b) Trên S1 và S2 chỉ có Fa0/1 và Fa0/2 được cắm cáp: tắt mọi cổng truy cập còn lại. (c) Giải thích vì sao ACL được áp bằng <code>access-class</code> trên dòng vty thay vì <code>ip access-group</code> trên một interface, và luật ngầm định nào kết thúc mọi ACL.</p>`),
  sampleSolution: EX(
    `<p><b>Reference configuration</b></p>${code(CAU_HINH_ACL)}<p>The wildcard is the inverse of the /${ST.prefix} mask: ${wild(ST.prefix)}. <code>access-class 10 in</code> filters who may open a session TO the router's own vty lines — exactly the management plane — whatever interface the connection arrives on; <code>ip access-group</code> on G0/0/1 would instead filter all traffic routed through that interface and would still leave SSH from the Internet side open. Every ACL ends with an invisible <b>deny any</b>, which is what blocks LAB and the Internet here. Shutting unused ports means a visitor cannot plug into a live wall socket — the infrastructure security of Chapter 1.</p>`,
    `<p><b>Cấu hình mẫu</b></p>${code(CAU_HINH_ACL)}<p>Wildcard là nghịch đảo của mặt nạ /${ST.prefix}: ${wild(ST.prefix)}. <code>access-class 10 in</code> lọc ai được mở phiên TỚI chính các dòng vty của router — đúng mặt phẳng quản trị — bất kể kết nối đi vào từ interface nào; còn <code>ip access-group</code> trên G0/0/1 thì lọc mọi lưu lượng được định tuyến qua interface đó và vẫn để ngỏ SSH từ phía Internet. Mọi ACL kết thúc bằng một <b>deny any</b> vô hình, chính nó chặn LAB và Internet ở đây. Tắt cổng thừa nghĩa là khách không cắm được vào một ổ mạng đang sống — đúng chuyện an toàn hạ tầng của Chương 1.</p>`),
  rubric: rubric([
    ['acl', 'A standard ACL permitting exactly the STAFF network with the correct wildcard, applied with access-class … in under line vty, plus exec-timeout 5 0.', 'ACL standard cho phép đúng mạng STAFF với wildcard đúng, áp bằng access-class … in dưới line vty, kèm exec-timeout 5 0.', 0.8],
    ['ports', 'Unused switch ports shut with interface range (Fa0/3–24) on both switches, configuration saved.', 'Cổng switch thừa được shutdown bằng interface range (Fa0/3–24) trên cả hai switch, có lưu cấu hình.', 0.6],
    ['explain', 'Correct difference between access-class and ip access-group, and names the implicit deny any.', 'Nêu đúng khác biệt giữa access-class và ip access-group, và gọi tên deny any ngầm định.', 0.6],
  ]),
};

const LOI = `R1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0/0   ${ST.firstHost}    YES manual up                    up
GigabitEthernet0/0/1   ${LB.firstHost}   YES manual administratively down down
GigabitEthernet0/0/2   203.0.113.2     YES manual up                    up

PC-B> ipconfig
   IPv4 Address. . . . : ${LB.lastHost}
   Subnet Mask . . . . : ${mask(LB.prefix)}
   Default Gateway . . : ${ST.firstHost}

S2# show running-config | include default-gateway
S2#

R1# show startup-config
startup-config is not present`;

const Q5 = {
  kind: 'WRITE', points: 2,
  prompt: prompt(5,
    `<p><b>Task 5 — Verify, then fix four planted faults (2 points).</b> A colleague finished the build before you and says "everything works". You collect these outputs:</p>${code(LOI)}<p>For each of the four faults: state the symptom a user would report, the exact fix (commands or setting), and the command that proves it is fixed. Finish with the verification routine you would run, in order, before signing the network off.</p>`,
    `<p><b>Nhiệm vụ 5 — Nghiệm thu, rồi gỡ bốn lỗi cài sẵn (2 điểm).</b> Một đồng nghiệp dựng xong trước bạn và nói "mọi thứ đều chạy". Bạn thu được các kết xuất sau:</p>${code(LOI)}<p>Với từng lỗi trong bốn lỗi: nêu triệu chứng người dùng sẽ báo, cách sửa chính xác (lệnh hoặc thiết lập), và lệnh chứng minh đã sửa xong. Kết thúc bằng quy trình nghiệm thu bạn sẽ chạy, theo thứ tự, trước khi ký bàn giao mạng.</p>`),
  sampleSolution: EX(
    `<p><b>The four faults</b></p><ol><li><b>G0/0/1 administratively down.</b> Symptom: the whole LAB LAN reaches nothing beyond its own switch. Fix: <code>interface g0/0/1</code>, <code>no shutdown</code>. Proof: <code>show ip interface brief</code> reads up/up and <code>show ip route connected</code> now lists ${LB.network}/${LB.prefix}.</li><li><b>PC-B's gateway is ${ST.firstHost}</b>, which is not in ${LB.network}/${LB.prefix} by PC-B's own mask. Symptom: PC-B reaches PC-B's own LAN and nothing else. Fix: gateway ${LB.firstHost}. Proof: <code>ipconfig</code>, then <code>ping ${LB.firstHost}</code> and <code>ping ${ST.lastHost}</code>.</li><li><b>S2 has no ip default-gateway.</b> Symptom: S2 is reachable from LAB only; nobody in STAFF can manage it — invisible while testing from the same LAN. Fix: <code>ip default-gateway ${LB.firstHost}</code> on S2. Proof: <code>show running-config | include default-gateway</code>, then SSH to ${cong(LB.firstHost, 1)} from PC-A.</li><li><b>R1 was never saved.</b> Symptom: after the next power cut R1 comes back empty. Fix: <code>copy running-config startup-config</code>. Proof: <code>show startup-config</code> now shows the configuration.</li></ol><p><b>Verification routine, bottom-up:</b> <code>show ip interface brief</code> and <code>show ipv6 interface brief</code> on R1; <code>show ip route</code> (C/L routes for both LANs and the S* default); from PC-A ping its gateway, PC-B, 203.0.113.1, and PC-B's IPv6 address; ping in BOTH directions; <code>ssh -l admin ${ST.firstHost}</code> from PC-A succeeds while the same from PC-B is refused (ACL); finally compare <code>show running-config</code> with <code>show startup-config</code> on every device.</p>`,
    `<p><b>Bốn lỗi</b></p><ol><li><b>G0/0/1 administratively down.</b> Triệu chứng: cả LAN LAB không tới được gì ngoài switch của mình. Sửa: <code>interface g0/0/1</code>, <code>no shutdown</code>. Bằng chứng: <code>show ip interface brief</code> báo up/up và <code>show ip route connected</code> đã có ${LB.network}/${LB.prefix}.</li><li><b>Gateway của PC-B là ${ST.firstHost}</b>, không nằm trong ${LB.network}/${LB.prefix} theo chính mặt nạ của PC-B. Triệu chứng: PC-B tới được LAN của mình và không gì khác. Sửa: gateway ${LB.firstHost}. Bằng chứng: <code>ipconfig</code>, rồi <code>ping ${LB.firstHost}</code> và <code>ping ${ST.lastHost}</code>.</li><li><b>S2 thiếu ip default-gateway.</b> Triệu chứng: S2 chỉ tới được từ LAB; không ai ở STAFF quản trị được nó — vô hình khi thử từ cùng LAN. Sửa: <code>ip default-gateway ${LB.firstHost}</code> trên S2. Bằng chứng: <code>show running-config | include default-gateway</code>, rồi SSH tới ${cong(LB.firstHost, 1)} từ PC-A.</li><li><b>R1 chưa từng được lưu.</b> Triệu chứng: lần mất điện tới R1 bật lên trống trơn. Sửa: <code>copy running-config startup-config</code>. Bằng chứng: <code>show startup-config</code> đã hiện cấu hình.</li></ol><p><b>Quy trình nghiệm thu, từ dưới lên:</b> <code>show ip interface brief</code> và <code>show ipv6 interface brief</code> trên R1; <code>show ip route</code> (tuyến C/L của hai LAN và default S*); từ PC-A ping gateway, PC-B, 203.0.113.1 và địa chỉ IPv6 của PC-B; ping CẢ HAI chiều; <code>ssh -l admin ${ST.firstHost}</code> từ PC-A thành công còn từ PC-B bị từ chối (ACL); cuối cùng so <code>show running-config</code> với <code>show startup-config</code> trên mọi thiết bị.</p>`),
  rubric: rubric([
    ['faults', 'Identifies all four faults correctly (admin-down G0/0/1, PC-B wrong gateway, S2 no default gateway, R1 unsaved) with the user-visible symptom of each.', 'Nhận đúng cả bốn lỗi (G0/0/1 admin down, PC-B sai gateway, S2 thiếu default gateway, R1 chưa lưu) kèm triệu chứng người dùng thấy của từng lỗi.', 0.8],
    ['fixes', 'Exact fix and a proving command for each fault.', 'Cách sửa chính xác và một lệnh chứng minh cho từng lỗi.', 0.6],
    ['routine', 'A bottom-up verification routine including pings in both directions, IPv6, the ACL test and running vs startup comparison.', 'Quy trình nghiệm thu từ dưới lên, có ping hai chiều, IPv6, phép thử ACL và so running với startup.', 0.6],
  ]),
};

export default {
  course: { courseCode: 'NWC204' },
  exams: [
    {
      kind: 'PE',
      peType: 'WRITE',
      code: 'TS-PE1',
      title: B('NWC204 — Practical Exam 1 (self-composed): build a two-LAN branch', 'NWC204 — Đề thực hành 1 (tự soạn): dựng một chi nhánh hai LAN'),
      description: B('One integrated scenario in five task groups, as in the school\'s Practical Exam: VLSM plan, hardening and SSH, IPv4/IPv6 interfaces and default route, management ACL, and fault-finding. AI-graded against a reference answer and rubric.', 'Một tình huống tích hợp gồm năm nhóm việc, như bài Practical Exam của trường: hoạch định VLSM, làm cứng và SSH, interface IPv4/IPv6 và default route, ACL quản trị, và tìm lỗi. AI chấm theo đáp án mẫu và rubric.'),
      durationMinutes: 85,
      totalPoints: 10,
      passMark: 5,
      source: 'SAMPLE',
      instructions: EX(
        '<p><b>How to take this practical exam.</b></p><ol><li>This is a <b>self-composed practice</b> for the NWC204 <b>Practical Exam</b> (20% of the grade, 85 minutes, one integrated scenario with several task groups). It is not an official paper.</li><li>In the real exam you type into Packet Tracer. Here, <b>write exactly the commands and tables you would type</b>, in order, in each answer box. Build it in Packet Tracer alongside if you can — the muscle memory is part of what the real exam measures.</li><li>All five tasks share one scenario and one topology, shown in Task 1.</li><li>When you submit, AI grades each answer against a <b>rubric</b> and a reference solution, then shows the bilingual model answer. Treat the score as practice feedback.</li></ol>',
        '<p><b>Cách làm bài thi thực hành.</b></p><ol><li>Đây là <b>đề luyện tự soạn</b> cho bài <b>Practical Exam</b> của NWC204 (20% điểm, 85 phút, một tình huống tích hợp gồm nhiều nhóm việc). Không phải đề chính thức.</li><li>Ở bài thi thật bạn gõ vào Packet Tracer. Ở đây, hãy <b>viết đúng các lệnh và bảng bạn sẽ gõ</b>, theo thứ tự, vào từng ô trả lời. Dựng song song trên Packet Tracer nếu có thể — phản xạ tay là một phần thứ bài thi thật đo.</li><li>Cả năm nhiệm vụ dùng chung một tình huống và một sơ đồ, in ở Nhiệm vụ 1.</li><li>Khi nộp, AI chấm từng câu theo <b>rubric</b> và đáp án mẫu, rồi hiện đáp án mẫu song ngữ. Hãy coi điểm là phản hồi luyện tập.</li></ol>',
      ),
      isPublished: true,
      questions: [Q1, Q2, Q3, Q4, Q5],
    },
  ],
};
