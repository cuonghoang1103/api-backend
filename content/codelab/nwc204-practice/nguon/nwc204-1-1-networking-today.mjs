/** NWC204 · 1.1 — Networking today: components, topologies, the four numbers, reliability, and the five-command ladder (Chương 1, buổi 1–2). */
import { doiDau, KHOA, tinh, q, ord, bang1, tn, cs, js, mt, bi, S } from './_nw.mjs';

const E1 = cs({
  ten: 'Today 1 — Name every box on the diagram', kho: 'EASY', phut: 8,
  en: 'The vocabulary of Lesson 1.1: end devices, intermediary devices, media, NIC, port and interface, physical and logical topology, LAN and WAN.',
  vi: 'Từ vựng của bài 1.1: thiết bị đầu cuối, thiết bị trung gian, môi trường truyền, NIC, port và interface, tô-pô vật lý và logic, LAN và WAN.',
  cau: [
    q('c1', ['Which of these is an INTERMEDIARY device?', 'Thiết bị nào là thiết bị TRUNG GIAN?'], ['A Wi-Fi access point', 'A network printer', 'An IP camera', 'A file server'], ['Intermediary devices move data and decide where it goes (switch, router, access point, firewall). The other three are places where data starts or ends — end devices.', 'Thiết bị trung gian chuyển dữ liệu và quyết định đường đi (switch, router, access point, tường lửa). Ba thứ còn lại là nơi dữ liệu bắt đầu hoặc kết thúc — thiết bị đầu cuối.']),
    q('c2', ['You configure an address on Gi0/1. In IOS terms you are configuring …', 'Bạn đặt địa chỉ cho Gi0/1. Theo cách gọi của IOS, bạn đang cấu hình …'], ['an interface — the port as the software sees it', 'a port — the physical socket on the chassis', 'a NIC — the card inside an end device', 'a medium — the copper that carries the signal'], ['The port is the hole you plug a cable into; the interface is the same thing seen by software. Configuration always happens on the interface.', 'Port là cái lỗ để cắm cáp; interface là chính nó dưới con mắt phần mềm. Cấu hình luôn làm trên interface.']),
    q('c3', ['Two PCs hang off the same switch, but one is 192.168.1.10/24 and the other 192.168.2.10/24. Which topology differs between them?', 'Hai PC cắm cùng một switch, nhưng một máy là 192.168.1.10/24, máy kia 192.168.2.10/24. Tô-pô nào khác nhau giữa chúng?'], ['The logical topology: they are in different networks although the cabling is shared', 'The physical topology: they need separate cables to the router', 'Neither: one switch always means one network', 'Both: a switch cannot carry two subnets on its ports'], ['Physical topology is where the cables run — identical here. Logical topology is which addresses may talk to which — and these two are in different networks, so the link lights are green and they still cannot talk directly.', 'Tô-pô vật lý là cáp chạy ở đâu — ở đây giống hệt. Tô-pô logic là địa chỉ nào được nói với địa chỉ nào — hai máy này ở hai mạng khác nhau, nên đèn link xanh mà vẫn không nói chuyện trực tiếp được.']),
    q('c4', ['Ten hosts are cabled so that every host connects directly to every other host. How many cables is that?', 'Mười máy được nối sao cho máy nào cũng cắm thẳng tới mọi máy khác. Tốn bao nhiêu sợi cáp?'], ['45', '90', '100', '10'], ['A full mesh needs n(n−1)/2 links: 10 × 9 / 2 = 45, and 100 hosts would need 4,950. That growth is the reason intermediary devices exist — with one switch, adding a host costs one cable.', 'Lưới đầy đủ cần n(n−1)/2 đường nối: 10 × 9 / 2 = 45, còn 100 máy thì cần 4.950. Chính đà tăng đó là lý do thiết bị trung gian tồn tại — có một switch thì thêm một máy chỉ tốn một sợi cáp.']),
    q('c5', ['Which statement about the Internet is accurate?', 'Câu nào về Internet là chính xác?'], ['It is a network of independently owned networks that agreed on IP and on how to hand traffic to each other', 'It is one very large LAN run by a single international operator', 'It is the set of web servers that answer on port 80 and 443', 'It is a WAN owned jointly by the national telecom carriers'], ['CQ1.1: a network of networks. Nobody owns all of it, which is why nobody can switch it off and nobody can guarantee it either.', 'CQ1.1: một mạng của các mạng. Không ai sở hữu toàn bộ, vì thế không ai tắt được nó và cũng không ai bảo đảm được nó.']),
    q('c6', ['A company makes some internal pages reachable to its suppliers over the Internet, behind a login. Cisco calls that an …', 'Một công ty cho nhà cung cấp truy cập một số trang nội bộ qua Internet, có đăng nhập. Cisco gọi đó là …'], ['extranet', 'intranet', 'internetwork', 'intermediary network'], ['An intranet is for the organisation itself; an extranet extends a controlled part of it to outsiders such as suppliers and partners.', 'Intranet dành cho chính tổ chức; extranet mở một phần có kiểm soát của nó cho người ngoài như nhà cung cấp và đối tác.']),
  ],
  goiY: ['End device = data starts or ends there. Intermediary = data passes through.', 'Physical topology is about cables; logical topology is about addresses.'],
  loi: ['Calling a printer or a camera an intermediary device because it is "on the network".', 'Assuming one switch means one network — the mask decides that, not the cabling.'],
  tn: [tn('intermediary device', 'thiết bị trung gian'), tn('logical topology', 'tô-pô logic'), tn('extranet', 'mạng mở rộng cho đối tác')], kn: ['network components', 'topology'],
});

const E2 = tinh({
  tieuDe: 'Today 2 — Bandwidth is not speed: name the number', doKho: 'MEDIUM', phut: 10,
  moTa: mt('Lesson 1.2 separates four numbers that are constantly confused, and four properties that define a reliable network. For each line, pick the one it describes.', 'Bài 1.2 tách bốn con số hay bị lẫn nhất, và bốn tính chất làm nên một mạng tin cậy. Với mỗi dòng, chọn đúng thứ nó mô tả.'),
  loai: 'table',
  bang: [
    bang1('b1', ['Which number is it?', 'Đó là con số nào?'], [{ ma: 's', ten: 'Statement' }, { ma: 'n', ten: 'Number', luaChon: ['bandwidth', 'throughput', 'goodput', 'latency', 'jitter'] }], [
      { o: { s: 'The "1 Gbps" printed on your contract' }, a: { n: 'bandwidth' } },
      { o: { s: 'What a speed test reports right now' }, a: { n: 'throughput' } },
      { o: { s: 'What is left after headers and retransmissions — your own data' }, a: { n: 'goodput' } },
      { o: { s: 'Milliseconds reported by ping' }, a: { n: 'latency' } },
      { o: { s: 'Ping varies between 40 ms and 400 ms; calls stutter' }, a: { n: 'jitter' } },
    ], ['Bandwidth is the rating and is never measured; throughput is the measurement; goodput is throughput minus overhead and is always the smallest; latency is time, independent of the other three; jitter is how much the latency varies — the number that ruins a call.', 'Băng thông là mức định danh, không bao giờ đo; thông lượng là phép đo; goodput là thông lượng trừ phần bọc, luôn nhỏ nhất; độ trễ là thời gian, độc lập với ba số kia; jitter là độ trễ dao động bao nhiêu — con số làm hỏng cuộc gọi.']),
    bang1('b2', ['Which reliability property was missing?', 'Thiếu tính chất tin cậy nào?'], [{ ma: 's', ten: 'Incident' }, { ma: 'p', ten: 'Property', luaChon: ['fault tolerance', 'scalability', 'quality of service', 'security'] }], [
      { o: { s: 'One fibre was cut and the whole branch went offline' }, a: { p: 'fault tolerance' } },
      { o: { s: 'The nightly backup makes the IP phones unusable' }, a: { p: 'quality of service' } },
      { o: { s: 'Adding a second floor meant redesigning every subnet' }, a: { p: 'scalability' } },
      { o: { s: 'A visitor plugged into a live unused wall port and reached the servers' }, a: { p: 'security' } },
    ], ['Each property answers one way networks fail: fault tolerance for a broken path, scalability for growth, QoS for congestion, security for attack. Naming the symptom with the property is what an examiner looks for.', 'Mỗi tính chất trả lời một kiểu mạng hỏng: chịu lỗi cho đường đứt, mở rộng cho tăng trưởng, QoS cho nghẽn, an toàn cho tấn công. Gọi tên được triệu chứng đi cùng tính chất là thứ giám khảo tìm.']),
  ],
  goiY: ['Rated vs measured vs useful: bandwidth, throughput, goodput.', 'A backup that kills voice is not a capacity problem; it is a priority problem.'],
  loiHayGap: ['Answering "bandwidth" for anything that sounds like speed.', 'Calling the backup-versus-phones incident a scalability problem.'],
  thuatNgu: [tn('goodput', 'thông lượng hữu ích'), tn('jitter', 'độ dao động trễ'), tn('fault tolerance', 'chịu lỗi')], khaiNiem: ['bandwidth vs latency', 'reliable networks'],
});

const E3 = tinh({
  tieuDe: 'Today 3 — The five commands, in the order that narrows fastest', doKho: 'MEDIUM', phut: 6,
  moTa: mt('Something stopped working and nobody is around to ask. Lesson 1.3 gives a fixed order of commands where each one rules out a whole class of causes. Put them in that order.', 'Có gì đó ngừng chạy và không có ai để hỏi. Bài 1.3 cho một thứ tự lệnh cố định, mỗi lệnh loại được cả một nhóm nguyên nhân. Hãy xếp đúng thứ tự đó.'),
  loai: 'order',
  cauHoi: [ord('q1', ['Bottom-up self-check of your own machine', 'Tự kiểm máy của mình từ dưới lên'], ['ip addr show — do I have an address, and is it the one I expect?', 'ip route show — is there a "default via", and is that gateway local to me?', 'ping 192.168.1.1 — can I reach my gateway?', 'ping 1.1.1.1 — can I reach the outside by ADDRESS?', 'ping google.com — and by NAME?'], ['Address, then exit, then the exit itself, then the world by number, and only then by name. If step 4 works and step 5 fails, the network is fine and DNS is the problem — the single most valuable distinction in Module 1.', 'Địa chỉ, rồi lối ra, rồi chính lối ra, rồi thế giới bằng số, cuối cùng mới bằng tên. Nếu bước 4 chạy mà bước 5 hỏng, mạng vẫn tốt và DNS mới là vấn đề — phân biệt giá trị nhất của Module 1.'])],
  goiY: ['Each command assumes the previous one passed.', 'Names come last because a name needs DNS, and DNS needs the network.'],
  loiHayGap: ['Starting with ping google.com and spending twenty minutes on DNS when the cable is out.', 'Pinging an Internet address before checking that you even have a default route.'],
  thuatNgu: [tn('default route', 'tuyến mặc định'), tn('bottom-up', 'từ dưới lên')], khaiNiem: ['troubleshooting order'],
});

const E4 = cs({
  ten: 'Today 4 — Latency you cannot buy away', kho: 'MEDIUM', phut: 10,
  en: 'Lesson 1.2: light in optical fibre needs about 5 ms per 1,000 km, and no contract changes that. Work the numbers.',
  vi: 'Bài 1.2: ánh sáng trong sợi quang cần khoảng 5 ms cho mỗi 1.000 km, và không hợp đồng nào đổi được điều đó. Hãy tính.',
  cau: [
    q('c1', ['A fibre path from Hanoi to a server is 2,000 km long. Ignoring queues and processing, what is the minimum ROUND-TRIP time?', 'Đường cáp quang từ Hà Nội tới một máy chủ dài 2.000 km. Bỏ qua hàng đợi và xử lý, thời gian KHỨ HỒI tối thiểu là bao nhiêu?'], ['20 ms', '10 ms', '5 ms', '40 ms'], ['One way: 2,000 km × 5 ms / 1,000 km = 10 ms. A ping measures there and back, so the floor is 20 ms whatever the bandwidth.', 'Một chiều: 2.000 km × 5 ms / 1.000 km = 10 ms. Ping đo cả đi lẫn về, nên mức sàn là 20 ms dù băng thông bao nhiêu.']),
    q('c2', ['The office upgrades from 100 Mbps to 1 Gbps on the same 2,000 km path. What happens to that 20 ms floor?', 'Văn phòng nâng từ 100 Mbps lên 1 Gbps trên cùng con đường 2.000 km. Mức sàn 20 ms thay đổi thế nào?'], ['Nothing — the path is wider, not shorter', 'It drops to 2 ms because the link is ten times faster', 'It drops to about 10 ms because only one direction is affected', 'It rises because a faster link fills its buffers sooner'], ['Bandwidth is how wide the pipe is; latency is how long it is. Widening the pipe makes a big file finish sooner and leaves the time to the first byte exactly where it was.', 'Băng thông là ống rộng bao nhiêu; độ trễ là ống dài bao nhiêu. Nới rộng ống làm file lớn xong sớm hơn và để nguyên thời gian tới byte đầu tiên.']),
    q('c3', ['A geostationary satellite orbits about 36,000 km up. A packet goes up to it and back down to the ground station once. Using the speed of light (about 300,000 km/s), what is that one trip?', 'Vệ tinh địa tĩnh bay ở độ cao khoảng 36.000 km. Một gói đi lên vệ tinh rồi xuống trạm mặt đất một lần. Dùng tốc độ ánh sáng (khoảng 300.000 km/s), một chuyến đó mất bao lâu?'], ['About 240 ms', 'About 120 ms', 'About 24 ms', 'About 1.2 s'], ['Up and down is 72,000 km; 72,000 / 300,000 s = 0.24 s. A request and its reply make two such trips, which is where the "about half a second" of satellite links comes from before anything else goes wrong.', 'Lên và xuống là 72.000 km; 72.000 / 300.000 giây = 0,24 giây. Yêu cầu và phản hồi là hai chuyến như vậy — đó là nguồn gốc "khoảng nửa giây" của đường vệ tinh, trước khi có trục trặc nào khác.']),
    q('c4', ['Which application is fine on a 100 Mbps link with 300 ms latency?', 'Ứng dụng nào vẫn ổn trên đường 100 Mbps với độ trễ 300 ms?'], ['A nightly off-site backup', 'A video call between two offices', 'An online multiplayer game', 'An SSH session where someone types commands'], ['A backup only cares about throughput: once the stream starts, 300 ms of delay barely matters. Conversation, games and interactive typing need low and steady latency.', 'Sao lưu chỉ quan tâm thông lượng: luồng đã chạy thì 300 ms trễ gần như không sao. Nói chuyện, game và gõ lệnh tương tác cần độ trễ thấp và đều.']),
    q('c5', ['Calls freeze every evening on a 1 Gbps cable link, while the neighbour on 100 Mbps fibre is fine. Which single measurement proves the cause fastest?', 'Cuộc gọi đứng hình mỗi tối trên đường cáp đồng trục 1 Gbps, trong khi nhà hàng xóm dùng cáp quang 100 Mbps vẫn mượt. Phép đo nào chứng minh nguyên nhân nhanh nhất?'], ['A continuous ping in the evening, reading how much the times vary', 'A speed test at noon', 'Reading the plan speed printed on the bill', 'Counting the devices connected to the Wi-Fi'], ['Cable is shared with the neighbourhood, so evening congestion shows up as jitter and loss. A ping run at the bad hour shows it; a speed test at noon measures the wrong hour and the wrong number.', 'Cáp đồng trục chia chung cả khu, nên nghẽn buổi tối hiện ra thành jitter và mất gói. Ping liên tục vào giờ tệ cho thấy ngay; speed test lúc trưa đo sai giờ và sai con số.']),
  ],
  goiY: ['5 ms per 1,000 km is ONE way. Ping is round trip.', 'Satellite: up AND down, at about 300,000 km/s.'],
  loi: ['Forgetting to double for the round trip.', 'Believing a faster plan lowers the propagation delay.'],
  tn: [tn('propagation delay', 'trễ lan truyền'), tn('round-trip time', 'thời gian khứ hồi')], kn: ['latency', 'propagation'],
});

const E5 = js({
  ten: 'Today 5 — Write diagnoseHost(h): the decision table as code', kho: 'HARD', phut: 25,
  en: `<p>Lesson 1.3 ends with a decision table: whichever of the five checks fails FIRST tells you who owns the problem. Write <code>diagnoseHost(h)</code> where <code>h</code> is what you saw on a machine:</p>
<ul>
<li><code>inet</code> — the address with prefix from <code>ip addr show</code>, e.g. <code>"192.168.1.10/24"</code>, or <code>null</code> if there is no inet line.</li>
<li><code>gateway</code> — the address after <code>default via</code> in <code>ip route show</code>, or <code>null</code>.</li>
<li><code>pingGateway</code>, <code>pingIp</code>, <code>pingName</code> — booleans for <code>ping</code> to the gateway, to <code>1.1.1.1</code>, and to a domain name. A check that was not reached may be missing.</li>
</ul>
<p>Return exactly one of these, checking in this order:</p>
<ol>
<li><code>"no-address"</code> — no inet line (interface down, cable or driver).</li>
<li><code>"dhcp-failed"</code> — the address starts with <code>169.254.</code>: DHCP never answered and the machine invented one.</li>
<li><code>"no-gateway"</code> — no default route: the LAN works, everything outside fails.</li>
<li><code>"gateway-not-local"</code> — the gateway is not in the host's own network by the host's own prefix (AND both with the mask).</li>
<li><code>"lan"</code> — the gateway does not answer: wrong gateway, wrong mask, VLAN or switch port.</li>
<li><code>"upstream"</code> — the gateway answers but <code>1.1.1.1</code> does not: the fault is beyond your network; <code>traceroute</code> says which hop.</li>
<li><code>"dns"</code> — addresses work, names do not.</li>
<li><code>"application"</code> — every check passed: the network did its job.</li>
</ol>`,
  vi: `<p>Bài 1.3 khép lại bằng một bảng quyết định: phép kiểm nào trong năm phép hỏng ĐẦU TIÊN thì cho biết sự cố là của ai. Viết <code>diagnoseHost(h)</code> với <code>h</code> là những gì bạn thấy trên một máy:</p>
<ul>
<li><code>inet</code> — địa chỉ kèm prefix từ <code>ip addr show</code>, ví dụ <code>"192.168.1.10/24"</code>, hoặc <code>null</code> nếu không có dòng inet.</li>
<li><code>gateway</code> — địa chỉ sau <code>default via</code> trong <code>ip route show</code>, hoặc <code>null</code>.</li>
<li><code>pingGateway</code>, <code>pingIp</code>, <code>pingName</code> — boolean cho <code>ping</code> tới gateway, tới <code>1.1.1.1</code>, và tới một tên miền. Phép kiểm chưa chạy tới có thể vắng.</li>
</ul>
<p>Trả đúng một trong các giá trị sau, kiểm theo thứ tự:</p>
<ol>
<li><code>"no-address"</code> — không có dòng inet (interface tắt, cáp hoặc driver).</li>
<li><code>"dhcp-failed"</code> — địa chỉ bắt đầu bằng <code>169.254.</code>: DHCP không trả lời, máy tự bịa một địa chỉ.</li>
<li><code>"no-gateway"</code> — không có tuyến mặc định: LAN chạy, mọi thứ bên ngoài hỏng.</li>
<li><code>"gateway-not-local"</code> — gateway không nằm trong mạng của chính máy theo prefix của chính máy (AND cả hai với mặt nạ).</li>
<li><code>"lan"</code> — gateway không trả lời: sai gateway, sai mặt nạ, VLAN hoặc cổng switch.</li>
<li><code>"upstream"</code> — gateway trả lời nhưng <code>1.1.1.1</code> thì không: lỗi nằm ngoài mạng của bạn; <code>traceroute</code> chỉ ra chặng nào.</li>
<li><code>"dns"</code> — địa chỉ chạy, tên thì không.</li>
<li><code>"application"</code> — mọi phép kiểm đều qua: mạng đã làm xong việc của nó.</li>
</ol>`,
  fn: 'diagnoseHost', params: 'h', ref: S.diagnoseHost,
  cases: [
    [{ inet: '192.168.1.10/24', gateway: '192.168.1.1', pingGateway: true, pingIp: true, pingName: false }],
    [{ inet: null, gateway: null }],
    [{ inet: '169.254.31.7/16', gateway: null }],
    [{ inet: '192.168.1.10/24', gateway: null }],
    [{ inet: '10.10.5.40/24', gateway: '10.10.6.1' }],
    [{ inet: '192.168.1.10/24', gateway: '192.168.1.1', pingGateway: false }],
    [{ inet: '192.168.1.10/24', gateway: '192.168.1.1', pingGateway: true, pingIp: false }],
    [{ inet: '192.168.1.10/24', gateway: '192.168.1.1', pingGateway: true, pingIp: true, pingName: true }],
    [{ inet: '172.16.4.20/22', gateway: '172.16.7.254', pingGateway: true, pingIp: false }],
    [{ inet: '172.16.4.20/23', gateway: '172.16.7.254' }],
    [{ inet: '10.0.0.130/25', gateway: '10.0.0.129', pingGateway: true, pingIp: true, pingName: false }],
    [{ inet: '10.0.0.130/25', gateway: '10.0.0.1', pingGateway: false }],
  ],
  goiY: ['Write the checks as a chain of early returns, in the order given — the order IS the method.', 'For the gateway test, turn both addresses into 32-bit numbers and compare (ip AND mask) with (gateway AND mask).', 'A /22 mask is 255.255.252.0: 172.16.4.20 and 172.16.7.254 are both in 172.16.4.0/22.'],
  loi: ['Checking the pings before the address and route, so a missing gateway is reported as "lan".', 'Comparing the first three octets instead of applying the real prefix — wrong for /22, /23 and /25.', 'Forgetting >>> 0, so a large address becomes a negative number and the comparison fails.'],
  gt: ['Each step only makes sense if the previous one passed, so the first failure names the owner: the machine itself, the local network, the provider, or DNS. The AND test for the gateway is the same test a host runs before every packet it sends.', 'Mỗi bước chỉ có nghĩa khi bước trước đã qua, nên phép hỏng đầu tiên gọi tên người chịu trách nhiệm: chính cái máy, mạng nội bộ, nhà cung cấp, hay DNS. Phép AND cho gateway cũng chính là phép một máy trạm chạy trước mỗi gói nó gửi.'],
  kn: ['troubleshooting', 'AND with the mask', 'default gateway'],
});

const E6 = cs({
  ten: 'Today 6 — Threats, defence in depth, and an AI that sounds sure', kho: 'HARD', phut: 10,
  en: 'Lessons 1.2 and 1.3: security as layers, and the five-step method for using an AI assistant without being misled. Scenarios from real work.',
  vi: 'Bài 1.2 và 1.3: an toàn là nhiều lớp, và quy trình năm bước dùng trợ lý AI mà không bị dẫn sai. Tình huống lấy từ công việc thật.',
  cau: [
    q('c1', ['"We have a firewall, so we are secure." A week later malware spreads inside the office from a personal laptop. What does this show?', '"Chúng ta có tường lửa nên an toàn." Một tuần sau mã độc lây trong văn phòng từ một laptop cá nhân. Điều này cho thấy gì?'], ['The firewall guards the edge; a device brought inside walks past it, so protection must be layered', 'The firewall was misconfigured and should have blocked the laptop', 'Malware cannot cross a firewall, so it must have come through Wi-Fi', 'Personal laptops are always infected, so the fix is to ban them'], ['Defence in depth: no single control is enough. BYOD devices start inside the perimeter, so endpoint protection, segmentation and updates have to exist behind the firewall too.', 'Phòng thủ nhiều lớp: không biện pháp đơn lẻ nào là đủ. Thiết bị cá nhân bắt đầu từ BÊN TRONG vành đai, nên bảo vệ thiết bị đầu cuối, phân đoạn mạng và cập nhật phải có cả phía sau tường lửa.']),
    q('c2', ['Which threat is intended to stop authorised users from reaching a service, without anyone breaking in?', 'Mối đe doạ nào nhằm khiến người dùng hợp lệ không truy cập được dịch vụ, mà không cần ai đột nhập?'], ['Denial of service', 'Data interception', 'Identity theft', 'Spyware'], ['Denial of service exhausts a resource — bandwidth, connections, CPU — so legitimate requests are crowded out. It succeeds without stealing a single credential.', 'Từ chối dịch vụ vắt cạn một tài nguyên — băng thông, kết nối, CPU — để yêu cầu hợp lệ bị chen mất chỗ. Nó thành công mà không cần trộm một tài khoản nào.']),
    q('c3', ['An AI assistant tells you to type "interface vlan1/0" on a Catalyst 2960 to set the management address. What should you do first?', 'Trợ lý AI bảo bạn gõ "interface vlan1/0" trên Catalyst 2960 để đặt địa chỉ quản trị. Việc đầu tiên nên làm là gì?'], ['Ask the device itself: "interface vlan ?" in global configuration lists what it accepts', 'Type it on the production switch; if it is wrong IOS will correct it', 'Ask the assistant again until it gives the same answer twice', 'Search a forum and use the most up-voted command'], ['An SVI is "interface vlan 1"; slot/port numbering belongs to physical interfaces. The device is slow but never lies, so the context-sensitive help is the judge — the assistant proposes, the device decides.', 'SVI là "interface vlan 1"; đánh số slot/port là của interface vật lý. Thiết bị chậm nhưng không bao giờ nói dối, nên trợ giúp ngữ cảnh mới là trọng tài — trợ lý đề xuất, thiết bị phán quyết.']),
    q('c4', ['In the five-step AI method, which step is the one that turns an answer into knowledge?', 'Trong quy trình năm bước dùng AI, bước nào biến một câu trả lời thành tri thức?'], ['Comparing the real output with the output you predicted', 'Giving the assistant the full topology', 'Asking for the reasoning before the command', 'Running it in Packet Tracer instead of on hardware'], ['Prediction then comparison is the only step that produces evidence about YOUR network. The mismatch is the finding; the other steps only make that comparison possible and safe.', 'Dự đoán rồi đối chiếu là bước duy nhất tạo ra bằng chứng về mạng CỦA BẠN. Chỗ lệch chính là phát hiện; các bước khác chỉ giúp phép đối chiếu đó khả thi và an toàn.']),
    q('c5', ['A traceroute shows latency jumping at hop 6 and then returning to normal from hop 7 onwards. What does that mean?', 'Traceroute cho thấy độ trễ vọt lên ở chặng 6 rồi trở lại bình thường từ chặng 7 trở đi. Nghĩa là gì?'], ['Router 6 is slow at answering traceroute itself; it is not where your traffic is delayed', 'The congestion starts at hop 6 and affects everything after it', 'Hop 6 is dropping packets, so the path is broken', 'Hop 7 is closer than hop 6, so the route is looping'], ['Routers answer traceroute probes with low priority. A delay that does not carry on to later hops is that router being slow to reply, not a slow path. A jump that STAYS high from one hop on is where the problem starts.', 'Router trả lời gói thăm dò của traceroute với ưu tiên thấp. Độ trễ không kéo dài sang các chặng sau chỉ là router đó trả lời chậm, không phải đường chậm. Vọt lên và GIỮ cao từ một chặng trở đi mới là chỗ sự cố bắt đầu.']),
  ],
  goiY: ['Security is layers, not a product.', 'Evidence about your device comes from your device, never from generated text.'],
  loi: ['Treating a firewall as the whole security plan.', 'Accepting generated show output as if it were measured on your own equipment.'],
  tn: [tn('defence in depth', 'phòng thủ nhiều lớp'), tn('denial of service', 'từ chối dịch vụ'), tn('hallucination', 'ảo giác của mô hình')], kn: ['network security', 'AI tools'],
});

export default doiDau({ slug: 'nwc204-1-1-networking-today', ten: '1.1 Networking today: components, numbers and the self-check ladder', khoa: KHOA, baiHoc: 'nwc204-1-1-mang-la-gi-thanh-phan-to-po', de: [E1, E2, E3, E4, E5, E6] });
