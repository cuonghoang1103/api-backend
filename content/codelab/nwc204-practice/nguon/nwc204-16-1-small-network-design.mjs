/** NWC204 · 16.1 — Build a small network: devices, addressing, protocols, scaling and redundancy (Chương 16, buổi 54). */
import { doiDau, KHOA, tinh, q, bang1, tn, cs, js, mt, S } from './_nw.mjs';

const E1 = cs({
  ten: 'Small 1 — The decisions before any cable is plugged in', kho: 'EASY', phut: 8,
  en: 'Lesson 16.1: device selection, addressing, redundancy and documentation for a network one person can hold in their head.',
  vi: 'Bài 16.1: chọn thiết bị, đánh địa chỉ, dự phòng và tài liệu cho một mạng đủ nhỏ để một người nắm trọn trong đầu.',
  cau: [
    q('c1', ['Which devices should have a static (or DHCP-reserved) address rather than one from the pool?', 'Thiết bị nào nên có địa chỉ tĩnh (hoặc DHCP giữ chỗ) thay vì lấy từ pool?'], ['Router, switches, printer, camera and servers', 'Laptops, because they move between meeting rooms', 'Guest phones, so each visitor can be traced', 'None of them: DHCP handles every device better'], ['A printer that comes back after a power cut with a new address breaks every driver pointing at the old one. Users\' laptops are exactly what the pool is for.', 'Máy in bật lại sau mất điện với địa chỉ mới là làm hỏng mọi driver đang trỏ vào địa chỉ cũ. Laptop của người dùng mới đúng là thứ dành cho pool.']),
    q('c2', ['CQ19.2: which element of scaling a network involves identifying the physical and logical topologies?', 'CQ19.2: yếu tố nào của việc mở rộng mạng liên quan tới xác định tô-pô vật lý và logic?'], ['Network documentation', 'Traffic analysis', 'Device inventory', 'Protocol analysis'], ['Documentation comes first because every later decision is an argument about a diagram — and the two topologies are kept separately because they fail separately.', 'Tài liệu mạng đi trước vì mọi quyết định sau đều là một cuộc tranh luận quanh một sơ đồ — và hai tô-pô được ghi riêng vì chúng hỏng riêng.']),
    q('c3', ['CQ20.1: the only exit to the ISP is one router. What keeps connectivity if the router or its line fails?', 'CQ20.1: lối ra duy nhất tới ISP là một router. Cái gì giữ được kết nối nếu router hoặc đường truyền hỏng?'], ['Redundancy — a second, independent path out', 'QoS on the existing router', 'A larger subnet mask on the LAN', 'Saving the configuration more often'], ['The word that does the work is independent: two routers sharing one line still share one failure. For a small office, "none, accepted deliberately and written down, with a 4G hotspot as manual fallback" is also a defensible answer.', 'Từ gánh cả câu là độc lập: hai router dùng chung một đường truyền vẫn chung một điểm hỏng. Với văn phòng nhỏ, "không dự phòng, chấp nhận có chủ ý và ghi lại, với một điểm phát 4G làm phương án tay" cũng là câu trả lời bảo vệ được.']),
    q('c4', ['CQ20.2: which mechanism minimises latency for real-time streaming on a small network?', 'CQ20.2: cơ chế nào giảm độ trễ cho luồng thời gian thực trên mạng nhỏ?'], ['Quality of Service (QoS) where the queue forms', 'A faster DNS server for every client', 'Port security on every access port', 'A longer DHCP lease for every host'], ['QoS creates no bandwidth; it only decides who waits. On an uncongested link it changes nothing by design — find where the queue forms first, prioritise second.', 'QoS không tạo ra băng thông; nó chỉ quyết định ai phải chờ. Trên đường không nghẽn thì theo thiết kế nó không đổi gì — tìm chỗ hàng đợi hình thành trước, ưu tiên sau.']),
    q('c5', ['Why is voice the traffic that changes the design, rather than file transfer?', 'Vì sao thoại mới là lưu lượng làm thay đổi thiết kế, chứ không phải truyền tệp?'], ['A late voice packet has already missed its moment — it cannot be repaired by retrying', 'Voice uses more bandwidth than any file transfer', 'Voice needs a public IP address on every phone', 'File transfers are always encrypted and voice is not'], ['Elastic traffic (files, email, web) slows down and recovers. Real-time traffic has a deadline; that is why the switch must support QoS — and ideally PoE so phones do not each need a power brick.', 'Lưu lượng co giãn (tệp, email, web) chậm lại rồi hồi phục. Lưu lượng thời gian thực có hạn chót; vì thế switch phải hỗ trợ QoS — và tốt nhất có PoE để mỗi điện thoại khỏi cần một cục nguồn.']),
  ],
  goiY: ['Static for things others look up; DHCP for things that look others up.', 'Redundancy only counts if the second path fails for different reasons.'],
  loi: ['Putting the printer on DHCP.', 'Thinking QoS adds bandwidth.'],
  tn: [tn('single point of failure', 'điểm hỏng duy nhất'), tn('PoE', 'cấp nguồn qua cáp mạng')], kn: ['small network design'],
});

const E2 = js({
  ten: 'Small 2 — Write portsNeeded(s): count before you buy', kho: 'EASY', phut: 12,
  en: `<p>Trap 1 of Lesson 16.1 is buying for the headcount you have. Write <code>portsNeeded(s)</code> with <code>s = { users, printers, phones, cameras, aps, uplinks, phonePassThrough }</code> (all counts are for the size you plan for, not today):</p>
<ul>
<li>Every user, printer, camera, access point and uplink takes one switch port.</li>
<li>IP phones take one port each — unless <code>phonePassThrough</code> is true: then a user's PC plugs into the back of the phone and the pair uses ONE port; only phones beyond the number of users (a lobby phone, say) need their own port.</li>
<li>Return <code>{ ports, size }</code> where <code>size</code> is the smallest of 8, 16, 24, 48 that is ≥ <code>ports</code>, or <code>null</code> if more than 48 are needed.</li>
</ul>`,
  vi: `<p>Bẫy 1 của bài 16.1 là mua theo số người hiện có. Viết <code>portsNeeded(s)</code> với <code>s = { users, printers, phones, cameras, aps, uplinks, phonePassThrough }</code> (mọi con số là quy mô bạn tính trước, không phải hôm nay):</p>
<ul>
<li>Mỗi người dùng, máy in, camera, access point và đường uplink tốn một cổng switch.</li>
<li>Điện thoại IP tốn mỗi cái một cổng — trừ khi <code>phonePassThrough</code> là true: khi đó PC của người dùng cắm vào sau lưng điện thoại và cả cặp tốn MỘT cổng; chỉ những điện thoại vượt quá số người dùng (ví dụ điện thoại ở sảnh) mới cần cổng riêng.</li>
<li>Trả <code>{ ports, size }</code> với <code>size</code> là số nhỏ nhất trong 8, 16, 24, 48 mà ≥ <code>ports</code>, hoặc <code>null</code> nếu cần hơn 48.</li>
</ul>`,
  fn: 'portsNeeded', params: 's', ref: S.portsNeeded,
  cases: [
    [{ users: 25, printers: 1, phones: 3, cameras: 1, aps: 0, uplinks: 1, phonePassThrough: false }],
    [{ users: 25, printers: 1, phones: 3, cameras: 1, aps: 0, uplinks: 1, phonePassThrough: true }],
    [{ users: 12, printers: 1, phones: 0, cameras: 0, aps: 1, uplinks: 1, phonePassThrough: false }],
    [{ users: 5, printers: 1, phones: 0, cameras: 0, aps: 0, uplinks: 1, phonePassThrough: false }],
    [{ users: 20, printers: 2, phones: 22, cameras: 2, aps: 2, uplinks: 1, phonePassThrough: true }],
    [{ users: 40, printers: 2, phones: 10, cameras: 4, aps: 3, uplinks: 2, phonePassThrough: false }],
    [{ users: 16, printers: 0, phones: 0, cameras: 0, aps: 0, uplinks: 0, phonePassThrough: false }],
  ],
  goiY: ['Compute the phone ports separately: pass-through ⇒ max(0, phones − users).', 'Then pick the first standard size that fits.'],
  loi: ['Forgetting the uplink port to the router.', 'Subtracting every phone when pass-through is on, even phones that have no PC behind them.'],
  gt: ['The port count is the decision everything else depends on: it decides the switch model, and a too-small switch becomes a daisy chain whose single uplink squeezes all traffic between the two halves of the office.', 'Số cổng là quyết định mà mọi thứ khác phụ thuộc vào: nó quyết định đời switch, và một switch quá nhỏ sẽ thành chuỗi nối tiếp mà đường uplink duy nhất bóp nghẹt toàn bộ lưu lượng giữa hai nửa văn phòng.'],
  kn: ['capacity planning'],
});

const E3 = tinh({
  tieuDe: 'Small 3 — An addressing and traffic plan for one office', doKho: 'MEDIUM', phut: 12,
  moTa: mt('The office of Lesson 16.1 uses 192.168.20.0/24, gateway 192.168.20.1: .1–.20 static for infrastructure, .100–.200 as the DHCP pool. Fill both tables.', 'Văn phòng của bài 16.1 dùng 192.168.20.0/24, gateway 192.168.20.1: .1–.20 tĩnh cho hạ tầng, .100–.200 làm pool DHCP. Điền cả hai bảng.'),
  loai: 'table',
  bang: [
    bang1('b1', ['Where does each device get its address?', 'Mỗi thiết bị lấy địa chỉ từ đâu?'], [{ ma: 'd', ten: 'Device' }, { ma: 'a', ten: 'Addressing', luaChon: ['static (.1–.20)', 'DHCP pool (.100–.200)'] }], [
      { o: { d: 'Edge router' }, a: { a: 'static (.1–.20)' } },
      { o: { d: 'Network printer' }, a: { a: 'static (.1–.20)' } },
      { o: { d: 'Door camera' }, a: { a: 'static (.1–.20)' } },
      { o: { d: 'Staff laptops' }, a: { a: 'DHCP pool (.100–.200)' } },
      { o: { d: 'A visitor\'s phone on Wi-Fi' }, a: { a: 'DHCP pool (.100–.200)' } },
    ], ['Infrastructure and anything other machines find by address is static; machines that only look others up take the pool. The gap between .20 and .100 lets either group grow without colliding.', 'Hạ tầng và mọi thứ máy khác tìm theo địa chỉ thì để tĩnh; máy chỉ đi tìm máy khác thì lấy từ pool. Khoảng trống giữa .20 và .100 cho phép mỗi nhóm lớn lên mà không đụng nhau.']),
    bang1('b2', ['Real-time or elastic? Prioritise it?', 'Thời gian thực hay co giãn? Có ưu tiên không?'], [{ ma: 't', ten: 'Traffic' }, { ma: 'k', ten: 'Kind', luaChon: ['real-time', 'elastic'] }, { ma: 'p', ten: 'QoS priority', luaChon: ['yes', 'no'] }], [
      { o: { t: 'IP phone call' }, a: { k: 'real-time', p: 'yes' } },
      { o: { t: 'Video meeting' }, a: { k: 'real-time', p: 'yes' } },
      { o: { t: 'Nightly backup to the cloud' }, a: { k: 'elastic', p: 'no' } },
      { o: { t: 'Email and file sharing' }, a: { k: 'elastic', p: 'no' } },
    ], ['Only traffic that cannot be repaired by waiting gets priority. Prioritising everything is prioritising nothing.', 'Chỉ lưu lượng không thể sửa bằng cách chờ mới được ưu tiên. Ưu tiên mọi thứ là không ưu tiên gì.']),
  ],
  goiY: ['Ask: does another machine need to find this one by address?', 'Ask: is a late packet still useful?'],
  loiHayGap: ['Putting the camera in the DHCP pool.', 'Giving the backup priority because it is "important".'],
  thuatNgu: [tn('DHCP reservation', 'giữ chỗ DHCP'), tn('elastic traffic', 'lưu lượng co giãn')], khaiNiem: ['addressing plan', 'QoS'],
});

const E4 = cs({
  ten: 'Small 4 — Growth, single points of failure, and the hidden incident', kho: 'HARD', phut: 10,
  en: 'Scaling scenarios from Lesson 16.1 and its ★ section, as they happen in small companies.',
  vi: 'Các tình huống mở rộng của bài 16.1 và phần ★, đúng như chúng xảy ra ở công ty nhỏ.',
  cau: [
    q('c1', ['Eighteen months after opening, a second cheap switch is plugged into the first. Users say "the network is slow in the afternoon". Why?', 'Mười tám tháng sau khi mở văn phòng, một switch rẻ thứ hai được cắm nối vào cái đầu. Người dùng kêu "chiều nào mạng cũng chậm". Vì sao?'], ['All traffic between the halves shares one uplink', 'Two linked switches always cause a broadcast storm', 'The second switch halves the size of the DHCP pool', 'Afternoon heat raises the resistance of the cables'], ['A daisy chain turns one link into the bottleneck for everything crossing between the two halves — and the afternoon is when everyone is on it. Count ports for the growth you expect.', 'Nối chuỗi biến một đường thành nút cổ chai cho mọi thứ đi qua giữa hai nửa — và buổi chiều là lúc ai cũng dùng. Hãy đếm cổng theo mức tăng trưởng dự kiến.']),
    q('c2', ['The single router dies. Nobody knows whether a spare exists, who the ISP contact is, or what the configuration was. What turned a four-hour outage into a two-day one?', 'Router duy nhất chết. Không ai biết có máy dự phòng không, liên hệ ISP là ai, cấu hình thế nào. Cái gì biến bốn giờ mất mạng thành hai ngày?'], ['The single point of failure was never written down', 'Having only one router in the first place', 'Using a private address range', 'Not enabling QoS'], ['Accepting a risk is a legitimate decision. Not writing it down — spare, contact, saved configuration — is what makes the recovery slow.', 'Chấp nhận rủi ro là quyết định hợp lệ. Không ghi lại — máy dự phòng, liên hệ, cấu hình đã lưu — mới là thứ khiến khôi phục chậm.']),
    q('c3', ['A new branch uses 10.8.0.0/16 for its LAN. Months later the company VPN is set up and some head-office servers become unreachable from the branch. Most likely cause?', 'Chi nhánh mới dùng 10.8.0.0/16 cho LAN. Vài tháng sau VPN công ty được dựng và một số máy chủ ở trụ sở không tới được từ chi nhánh. Nguyên nhân nhiều khả năng nhất?'], ['The branch range overlaps one used at head office', 'VPN tunnels cannot carry private IPv4 addresses', 'A /16 network is too large for a router to route', 'The branch router has no DNS server configured'], ['An overlapping private subnet makes hosts treat remote addresses as local — they ARP instead of routing. It is cheap to find on paper during design and expensive at 2 a.m.', 'Subnet riêng bị chồng khiến máy coi địa chỉ ở xa là cục bộ — chúng ARP thay vì định tuyến. Tìm ra trên giấy lúc thiết kế thì rẻ, tìm ra lúc 2 giờ sáng thì đắt.']),
    q('c4', ['QoS is configured, nothing measurable improves, and the team concludes the feature is broken. What is the more likely truth?', 'Đã cấu hình QoS, không có gì cải thiện đo được, cả nhóm kết luận tính năng hỏng. Sự thật nhiều khả năng hơn là gì?'], ['The link was not congested, so there was no queue for QoS to reorder', 'QoS only works on fibre links', 'QoS needs a public IP address', 'QoS must be enabled on every PC as well'], ['QoS only decides who waits in a queue. No queue, nothing to decide. Measure where the queue forms — often the uplink to the ISP — before prioritising.', 'QoS chỉ quyết định ai phải chờ trong hàng đợi. Không có hàng đợi thì không có gì để quyết. Đo xem hàng đợi hình thành ở đâu — thường là đường lên ISP — trước khi ưu tiên.']),
    q('c5', ['★ Your single-server Docker stack sits behind nginx. If nginx stops, every service is healthy and nothing is reachable. What is the cheapest real mitigation?', '★ Chồng Docker một máy của bạn nằm sau nginx. nginx dừng thì mọi dịch vụ vẫn khoẻ mà không gì tới được. Biện pháp thật sự rẻ nhất là gì?'], ['A restart policy plus a health check, so the single exit comes back fast — and the risk written down', 'A second nginx on the same machine with no health check', 'Turning off the firewall so services are reachable directly', 'Moving the database into the nginx container'], ['nginx is the single exit point. A second proxy needs something in front to choose between them; for one server the honest answer is "restart it fast" — restart policy and health check — with the remaining risk named.', 'nginx là lối ra duy nhất. Proxy thứ hai cần một thứ đứng trước để chọn giữa chúng; với một máy chủ, câu trả lời thật là "khởi động lại thật nhanh" — restart policy và health check — kèm rủi ro còn lại được gọi tên.']),
  ],
  goiY: ['Most small-network incidents are design decisions made silently.', 'A risk you name is managed; a risk you discover is an outage.'],
  loi: ['Buying for today\'s headcount.', 'Assuming two devices sharing one line are redundant.'],
  tn: [tn('daisy chain', 'nối chuỗi'), tn('overlapping subnets', 'subnet chồng lấn')], kn: ['scaling', 'redundancy'],
});

export default doiDau({ slug: 'nwc204-16-1-small-network-design', ten: '16.1 Build a small network: devices, addressing, QoS and redundancy', khoa: KHOA, baiHoc: 'nwc204-16-1-thiet-bi-giao-thuc-va-mo-rong-mang-nho', de: [E1, E2, E3, E4] });
