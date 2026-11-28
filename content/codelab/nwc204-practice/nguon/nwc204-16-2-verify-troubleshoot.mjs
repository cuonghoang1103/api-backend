/** NWC204 · 16.2 — Verify connectivity, host and IOS commands, troubleshooting methods and scenarios (Chương 16, buổi 55). */
import { doiDau, KHOA, tinh, q, ord, bang1, tn, cs, js, mt, S } from './_nw.mjs';

const E1 = tinh({
  tieuDe: 'Verify 1 — Walk the ladder from your own machine outwards', doKho: 'EASY', phut: 6,
  moTa: mt('Lesson 16.2: each rung proves one more piece; the first rung that fails is where you look. Put the rungs in order, from the one that assumes the least.', 'Bài 16.2: mỗi bậc chứng minh thêm một phần; bậc đầu tiên hỏng là chỗ cần nhìn. Xếp các bậc theo thứ tự, từ bậc giả định ít nhất.'),
  loai: 'order',
  cauHoi: [ord('q1', ['The verification ladder', 'Chiếc thang nghiệm thu'], ['ping 127.0.0.1 — the TCP/IP stack on this machine', 'ping your own address — the NIC and its configuration', 'ping the default gateway — the local network', 'ping 8.8.8.8 — routing beyond your network, by address', 'ping example.com — name resolution'], ['Bottom-up: each rung only means something if the one below passed. If 8.8.8.8 works and example.com fails, the network is fine and DNS is broken; if the gateway fails, you cannot leave your LAN.', 'Từ dưới lên: mỗi bậc chỉ có nghĩa khi bậc dưới đã qua. Nếu 8.8.8.8 chạy mà example.com hỏng thì mạng vẫn tốt và DNS hỏng; nếu gateway hỏng thì bạn không ra khỏi LAN được.'])],
  goiY: ['Loopback first: it involves no cable at all.', 'Names come last.'],
  loiHayGap: ['Starting with a name and blaming DNS for an unplugged cable.', 'Re-testing a rung that was already proven.'],
  thuatNgu: [tn('loopback', 'địa chỉ vòng lặp nội bộ')], khaiNiem: ['verify connectivity'],
});

const E2 = tinh({
  tieuDe: 'Verify 2 — Pick the method, and the command that answers', doKho: 'MEDIUM', phut: 12,
  moTa: mt('Lesson 16.2 names three methods — bottom-up, top-down, divide-and-conquer — and the host and IOS commands that prove each layer. Fill both tables.', 'Bài 16.2 gọi tên ba phương pháp — từ dưới lên, từ trên xuống, chia để trị — và các lệnh trên máy trạm và IOS chứng minh từng tầng. Điền cả hai bảng.'),
  loai: 'table',
  bang: [
    bang1('b1', ['Which method fits the report?', 'Phương pháp nào hợp với báo cáo?'], [{ ma: 's', ten: 'Report' }, { ma: 'm', ten: 'Method', luaChon: ['bottom-up', 'top-down', 'divide-and-conquer'] }], [
      { o: { s: 'Everything at one whole site is down' }, a: { m: 'bottom-up' } },
      { o: { s: 'Only the accounting web app fails; mail and browsing work' }, a: { m: 'top-down' } },
      { o: { s: 'One laptop reaches nothing outside; every other machine on the same switch is fine' }, a: { m: 'divide-and-conquer' } },
    ], ['Whole site ⇒ assume nothing, start at layer 1. One application ⇒ start at layer 7, the lower layers are evidently working. One host while its neighbours work ⇒ layers 1–2 of the shared switch are already proven, so start at layer 3 with a ping to the gateway.', 'Cả một site ⇒ không giả định gì, bắt đầu từ tầng 1. Một ứng dụng ⇒ bắt đầu từ tầng 7, các tầng dưới rõ ràng đang chạy. Một máy hỏng trong khi hàng xóm vẫn chạy ⇒ tầng 1–2 của switch dùng chung đã được chứng minh, nên bắt đầu ở tầng 3 bằng ping tới gateway.']),
    bang1('b2', ['Which command answers the question?', 'Lệnh nào trả lời câu hỏi?'], [{ ma: 'qq', ten: 'Question' }, { ma: 'c', ten: 'Command', luaChon: ['show cdp neighbors detail', 'show interfaces', 'ipconfig /all', 'tracert', 'show version', 'arp -a'] }], [
      { o: { qq: 'Which device and port is at the other end of this cable?' }, a: { c: 'show cdp neighbors detail' } },
      { o: { qq: 'Are input errors or CRC errors climbing on this router port?' }, a: { c: 'show interfaces' } },
      { o: { qq: 'On Windows: address, mask, gateway, DNS and whether DHCP is on' }, a: { c: 'ipconfig /all' } },
      { o: { qq: 'On Windows: at which hop does the path stop?' }, a: { c: 'tracert' } },
      { o: { qq: 'Did this router reboot last night?' }, a: { c: 'show version' } },
      { o: { qq: 'Has the PC learned the gateway\'s MAC address?' }, a: { c: 'arp -a' } },
    ], ['CDP shows neighbours, show interfaces shows counters and errors, ipconfig /all shows every host setting, tracert is the Windows spelling of traceroute, show version has the uptime line, and arp -a lists the IP-to-MAC cache.', 'CDP cho thấy hàng xóm, show interfaces cho thấy bộ đếm và lỗi, ipconfig /all cho thấy mọi thiết lập của máy, tracert là cách viết traceroute trên Windows, show version có dòng uptime, còn arp -a liệt kê bộ đệm IP–MAC.']),
  ],
  goiY: ['How much is broken decides where you start.', 'Windows says tracert, Linux and IOS say traceroute.'],
  loiHayGap: ['Starting bottom-up for a single broken application.', 'Using show ip interface brief to look for error counters — it has none.'],
  thuatNgu: [tn('divide-and-conquer', 'chia để trị'), tn('CDP', 'giao thức khám phá thiết bị Cisco')], khaiNiem: ['troubleshooting methodology'],
});

const E3 = js({
  ten: 'Verify 3 — Write probeVerdict(line): read the number, not the logs', kho: 'MEDIUM', phut: 20,
  en: `<p>The ★ part of Lesson 16.2 checks a path from the machine you are already on, reading one number or one line. Write <code>probeVerdict(line)</code>:</p>
<ul>
<li>A three-digit line is the status code printed by <code>curl -s -o /dev/null -w "%{http_code}\\n" URL</code>:
  <code>000</code> ⇒ <code>"no-answer"</code> (no HTTP response at all);
  <code>404</code> ⇒ <code>"not-mounted"</code>;
  ≥ 500 ⇒ <code>"server-error"</code>;
  below 400, or exactly 401 / 403 ⇒ <code>"reachable"</code> (the server answered: the path works; authentication is a separate question);
  any other 4xx ⇒ <code>"client-error"</code>.</li>
<li>Otherwise it is one line printed by <code>nc -vz HOST PORT</code>: a line containing <code>succeeded</code> or ending in <code>open</code> ⇒ <code>"listening"</code>; containing <code>refused</code> ⇒ <code>"refused"</code> (the machine answered at once: nothing listens on that port); containing <code>timed out</code> or <code>timeout</code> ⇒ <code>"filtered"</code> (nobody answered: something swallowed the packet).</li>
<li>Anything else ⇒ <code>"no-answer"</code>. Ignore case for the nc words, and trim the line first.</li>
</ul>`,
  vi: `<p>Phần ★ của bài 16.2 kiểm một con đường ngay từ máy bạn đang ngồi, chỉ đọc một con số hoặc một dòng. Viết <code>probeVerdict(line)</code>:</p>
<ul>
<li>Dòng ba chữ số là mã trạng thái do <code>curl -s -o /dev/null -w "%{http_code}\\n" URL</code> in ra:
  <code>000</code> ⇒ <code>"no-answer"</code> (không có phản hồi HTTP nào);
  <code>404</code> ⇒ <code>"not-mounted"</code>;
  ≥ 500 ⇒ <code>"server-error"</code>;
  dưới 400, hoặc đúng 401 / 403 ⇒ <code>"reachable"</code> (máy chủ đã trả lời: đường đi tốt; xác thực là chuyện khác);
  các 4xx còn lại ⇒ <code>"client-error"</code>.</li>
<li>Nếu không, đó là một dòng do <code>nc -vz HOST PORT</code> in ra: có chữ <code>succeeded</code> hoặc kết thúc bằng <code>open</code> ⇒ <code>"listening"</code>; có chữ <code>refused</code> ⇒ <code>"refused"</code> (máy trả lời ngay: không có gì nghe ở cổng đó); có <code>timed out</code> hoặc <code>timeout</code> ⇒ <code>"filtered"</code> (không ai trả lời: có thứ đã nuốt gói).</li>
<li>Mọi thứ khác ⇒ <code>"no-answer"</code>. Không phân biệt hoa thường với các chữ của nc, và cắt khoảng trắng hai đầu trước.</li>
</ul>`,
  fn: 'probeVerdict', params: 'line', ref: S.probeVerdict,
  cases: [
    ['401'], ['404'], ['200'], ['000'], ['502'],
    ['Connection to 127.0.0.1 22 port [tcp/ssh] succeeded!'],
    ['nc: connect to 127.0.0.1 port 9 (tcp) failed: Connection refused'],
    ['nc: connect to 10.0.0.5 port 22 (tcp) failed: Connection timed out'],
    ['  301  '], ['429'], ['403'],
    ['10.0.0.5 22 (ssh) open'],
    ['something unexpected'],
  ],
  goiY: ['Test /^\\d{3}$/ on the trimmed line first, then branch on the number.', 'Order the nc checks: success words, then refused, then timeout.'],
  loi: ['Treating 401 as a failure — it proves the request arrived and the route is mounted.', 'Treating "refused" and "timed out" as the same failure: one is an answer, the other is silence.'],
  gt: ['404 means the server answered; a timeout means nothing did. Those lead to opposite next steps — check what is deployed versus check what is filtering — which is why the verdict matters more than the log.', '404 nghĩa là máy chủ đã trả lời; hết giờ nghĩa là không ai trả lời. Hai thứ dẫn tới bước tiếp theo ngược nhau — kiểm thứ đang được deploy hay kiểm thứ đang chặn — nên phán quyết quan trọng hơn log.'],
  kn: ['probing', 'refused vs filtered'],
});

const E4 = cs({
  ten: 'Verify 4 — Troubleshooting scenarios, worked like an incident', kho: 'HARD', phut: 12,
  en: 'The scenarios of Lesson 16.2: say what is already ruled out before you touch anything.',
  vi: 'Các tình huống của bài 16.2: nói được cái gì đã bị loại trừ trước khi đụng vào bất cứ thứ gì.',
  cau: [
    q('c1', ['A router interface shows up / down. What has that ALREADY ruled out?', 'Một interface router hiện up / down. Điều đó ĐÃ loại trừ cái gì?'], ['Layer 1: the cable, both ports and the optics', 'Layer 3: the IP address and the routing table', 'Nothing yet: up/down can mean anything at all', 'Only the configuration of the far-end device'], ['Status up means a signal is on the wire. What remains is layer 2: encapsulation mismatch, a missing clock rate, no keepalives, or a neighbour that is administratively down. Reseating the cable re-tests something already known.', 'Status up nghĩa là có tín hiệu trên dây. Còn lại là tầng 2: lệch encapsulation, thiếu clock rate, không có keepalive, hoặc thiết bị bên kia administratively down. Cắm lại cáp là đi thử lại thứ đã biết.']),
    q('c2', ['After up/down, show interfaces confirms nothing is being received. What is the NEXT command, and where do you type it?', 'Sau up/down, show interfaces xác nhận không nhận được gì. Lệnh TIẾP THEO là gì, và gõ ở đâu?'], ['show cdp neighbors detail, then go to that neighbour', 'reload this router and watch the interface', 'show ip route on this router to find the path', 'ping 8.8.8.8 from a PC on the same subnet'], ['The evidence points across the cable, not along it: find which device and port are at the other end, then look at that device.', 'Bằng chứng chỉ sang bên kia sợi cáp, không phải dọc theo nó: tìm thiết bị và cổng ở đầu bên kia, rồi nhìn vào thiết bị đó.']),
    q('c3', ['A user says "the internet is down". You may ask ONE question before touching anything. Which removes the most possibilities?', 'Người dùng nói "mất mạng rồi". Bạn được hỏi MỘT câu trước khi đụng vào gì. Câu nào loại được nhiều khả năng nhất?'], ['"Is it only you, or everyone around you too?"', '"Is your cable plugged in?"', '"Did you restart your computer?"', '"Which browser are you using?"'], ['"Only me" versus "everyone" splits the problem into a host fault and a shared-infrastructure fault in one answer, and it chooses your method. The cable question tests one component.', '"Chỉ mình tôi" hay "cả phòng" chia đôi vấn đề thành lỗi một máy và lỗi hạ tầng dùng chung chỉ bằng một câu, và nó chọn luôn phương pháp. Câu về cáp chỉ kiểm một bộ phận.']),
    q('c4', ['You correct a hand-typed wrong gateway on one laptop and it works. What stops the next three incidents?', 'Bạn sửa một gateway gõ tay sai trên một laptop và nó chạy. Điều gì ngăn ba sự cố tiếp theo?'], ['Asking why that laptop was static at all, and putting it back on DHCP', 'Writing the correct gateway on a sticky note on the laptop', 'Rebooting the router every morning', 'Disabling DHCP so every host is configured by hand'], ['Fixing the host fixes today; fixing the reason fixes the pattern. Manual exceptions are where small networks rot.', 'Sửa máy là sửa hôm nay; sửa lý do là sửa cả khuôn mẫu. Ngoại lệ cấu hình tay là chỗ mạng nhỏ mục ruỗng.']),
    q('c5', ['An hour into an incident, three engineers have each pinged the gateway and nobody knows what is ruled out. What would have prevented this?', 'Một giờ sau khi sự cố bắt đầu, ba kỹ sư đều đã ping gateway và không ai biết cái gì đã bị loại trừ. Điều gì lẽ ra ngăn được chuyện này?'], ['Naming the method and writing down each proven layer as it is proven', 'Working faster with more parallel tests', 'Letting the AI assistant decide which test to run', 'Restarting every device at once'], ['Prove one layer, write it down, never re-test it. That box is where every method in the lesson ends — it is the part that actually saves time.', 'Chứng minh một tầng, ghi lại, không bao giờ thử lại. Đó là ô mà mọi phương pháp trong bài đều dẫn tới — chính nó mới tiết kiệm thời gian.']),
  ],
  goiY: ['Every reading rules something out; say what before acting.', 'The cheapest question is the one that splits the problem in half.'],
  loi: ['Reseating a cable on an interface whose Status is already up.', 'Fixing the symptom on one host and never asking why it happened.'],
  tn: [tn('runbook', 'sổ tay xử lý sự cố'), tn('ruled out', 'đã loại trừ')], kn: ['troubleshooting scenarios'],
});

export default doiDau({ slug: 'nwc204-16-2-verify-troubleshoot', ten: '16.2 Verify and troubleshoot a small network', khoa: KHOA, baiHoc: 'nwc204-16-2-kiem-chung-ra-lenh-va-go-loi-mang-nho', de: [E1, E2, E3, E4] });
