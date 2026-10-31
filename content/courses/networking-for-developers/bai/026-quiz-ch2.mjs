/** Chương 2 · Quiz — 10 câu tình huống, đáp án rải đều (A×2 · B×3 · C×2 · D×3), dữ liệu từ output thật của lab "Internet trong một hộp". */
const q = (en, vi) => `${en}|||${vi}`;
const o = (pairs) => pairs.map(([en, vi]) => q(en, vi));
const ex = (en, vi) => `EN: ${en}|||VI: ${vi}`;

export default {
  title: 'Quiz — Chapter 2: IP addressing, routing and NAT|||Quiz — Chương 2: địa chỉ IP, định tuyến và NAT',
  slug: 'netdev-2-7-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: chia subnet, mặt nạ gõ sai, khớp tiền tố dài nhất, đọc "* * *", NAT và đụng cổng, CGNAT, viết gọn IPv6, localhost = ::1, cướp tuyến BGP và RPKI, sự cố Facebook 2021.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>Quiz — IP addressing, routing and NAT</h2>
<p class="lead">Ten situations taken from the two labs of this chapter. Most can be answered by reading an output the way the lessons taught.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can find the network, broadcast and usable range of any IPv4 address/prefix by hand.</li>
<li>I can read a routing table, apply longest prefix match, and read traceroute including <code>* * *</code> and loops.</li>
<li>I can explain what a home NAT, a carrier NAT and <code>docker run -p</code> do to addresses and ports.</li>
<li>I can compress an IPv6 address and explain Happy Eyeballs and the localhost = ::1 bug.</li>
<li>I can read a BGP table, recognise a hijack and say what RPKI and a withdrawal do.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Quiz</span>
<h2>Quiz — địa chỉ IP, định tuyến và NAT</h2>
<p class="lead">Mười tình huống lấy từ hai phòng lab của chương. Phần lớn trả lời được bằng cách đọc một output theo đúng cách các bài đã dạy.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi tìm được bằng tay mạng, broadcast và dải dùng được của bất kỳ địa chỉ/prefix IPv4 nào.</li>
<li>Tôi đọc được bảng định tuyến, áp dụng khớp tiền tố dài nhất, và đọc traceroute kể cả <code>* * *</code> và vòng lặp.</li>
<li>Tôi giải thích được NAT ở nhà, NAT của nhà mạng và <code>docker run -p</code> làm gì với địa chỉ và cổng.</li>
<li>Tôi viết gọn được một địa chỉ IPv6 và giải thích được Happy Eyeballs cùng lỗi localhost = ::1.</li>
<li>Tôi đọc được bảng BGP, nhận ra một vụ cướp tuyến và nói được RPKI cùng việc rút tuyến làm gì.</li>
</ul>
</div>`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: q('The LabFlow office plan gives a camera the address <code>10.30.0.200/26</code>. Which network is it in?', 'Kế hoạch văn phòng LabFlow cấp cho một camera địa chỉ <code>10.30.0.200/26</code>. Nó thuộc mạng nào?'),
        options: o([['10.30.0.128/26', '10.30.0.128/26'], ['10.30.0.192/26', '10.30.0.192/26'], ['10.30.0.0/24', '10.30.0.0/24'], ['10.30.0.200/32', '10.30.0.200/32']]),
        correctIndex: 1, points: 1,
        explanation: ex('/26 leaves 6 host bits: block size 256 − 192 = 64, so networks start at .0, .64, .128, .192. 200 AND 192 = 192 ⇒ 10.30.0.192/26 (hosts .193–.254, broadcast .255) — exactly what cidr.py printed. .128/26 ends at .191; a /24 is not the prefix you were given.', '/26 còn 6 bit host: cỡ khối 256 − 192 = 64, nên các mạng bắt đầu ở .0, .64, .128, .192. 200 AND 192 = 192 ⇒ 10.30.0.192/26 (host .193–.254, broadcast .255) — đúng như cidr.py in ra. .128/26 kết thúc ở .191; còn /24 không phải prefix bạn được cho.'),
      },
      {
        question: q('client2 was configured as <code>10.10.1.11/16</code> (meant to be /24), default gateway 10.10.1.254. You ping <code>10.10.2.10</code> and capture outgoing frames. What do you see?', 'client2 bị cấu hình <code>10.10.1.11/16</code> (đáng ra là /24), cổng mặc định 10.10.1.254. Bạn ping <code>10.10.2.10</code> và bắt các frame đi ra. Bạn thấy gì?'),
        options: o([['ICMP Time exceeded from the router', 'ICMP Time exceeded từ router'], ['Echo replies, only 3 s late', 'Có echo reply, chỉ trễ 3 giây'], ['ARP who-has 10.10.1.254, repeated', 'ARP who-has 10.10.1.254, lặp lại'], ['ARP who-has 10.10.2.10, repeated, never answered', 'ARP who-has 10.10.2.10, lặp lại, không ai trả lời']]),
        correctIndex: 3, points: 1,
        explanation: ex('With /16 the machine believes 10.10.2.10 is on its own link (ip route get shows no “via”), so it ARPs for the server itself. Nobody on that LAN has it: the entry goes FAILED and ping prints “Destination Host Unreachable” from its own address. It never asks for the router (10.10.1.254), which is the tempting answer — that is what happens with the correct /24.', 'Với /16, máy tin 10.10.2.10 ở cùng đường truyền với nó (ip route get không có “via”), nên nó hỏi ARP cho chính máy chủ. Trên LAN đó không ai có địa chỉ ấy: mục chuyển FAILED và ping báo “Destination Host Unreachable” từ chính địa chỉ của nó. Nó không hề hỏi router (10.10.1.254) — phương án hấp dẫn đó là chuyện xảy ra khi mặt nạ đúng /24.'),
      },
      {
        question: q('A router has: <code>default via A</code>, <code>203.0.113.0/24 via B</code>, <code>203.0.113.0/26 via C</code>. Where does it send a packet for <code>203.0.113.10</code>?', 'Một router có: <code>default via A</code>, <code>203.0.113.0/24 via B</code>, <code>203.0.113.0/26 via C</code>. Nó gửi gói tới <code>203.0.113.10</code> đi đâu?'),
        options: o([['Via C', 'Qua C'], ['Via B', 'Qua B'], ['Via A', 'Qua A'], ['To the first line in the table', 'Theo dòng đầu tiên trong bảng']]),
        correctIndex: 0, points: 1,
        explanation: ex('All three lines match (.10 is inside .0–.63), and longest prefix match picks the most specific: /26 beats /24 beats /0. That is exactly how the forgotten 203.0.113.0/26 on the DC router created the loop in Lab 2. Order in the table does not matter.', 'Cả ba dòng đều khớp (.10 nằm trong .0–.63), và khớp tiền tố dài nhất chọn dòng cụ thể nhất: /26 thắng /24 thắng /0. Đó đúng là cách tuyến 203.0.113.0/26 bị quên trên router DC tạo ra vòng lặp ở Lab 2. Thứ tự trong bảng không quan trọng.'),
      },
      {
        question: q('A customer sends: traceroute hop 3 is <code>* * *</code>, hop 4 (your server) answers; <code>mtr</code> shows 100 % loss at hop 3 and 0 % at hop 4. What do you conclude?', 'Khách hàng gửi: traceroute chặng 3 là <code>* * *</code>, chặng 4 (máy chủ của bạn) trả lời; <code>mtr</code> báo mất 100 % ở chặng 3 và 0 % ở chặng 4. Bạn kết luận gì?'),
        options: o([['Hop 3 drops all traffic', 'Chặng 3 vứt toàn bộ lưu lượng'], ['The server is down', 'Máy chủ đã sập'], ['Hop 3 does not send Time exceeded replies; traffic passes through it fine', 'Chặng 3 không gửi trả lời Time exceeded; lưu lượng đi qua nó bình thường'], ['There is a routing loop', 'Có một vòng lặp định tuyến']]),
        correctIndex: 2, points: 1,
        explanation: ex('Loss only matters if it continues to every later hop. Here the destination has 0 % loss, so packets cross hop 3; the router just does not generate ICMP Time exceeded (blocked or rate-limited on its control CPU) — exactly the lab with the silent DC router. A loop would show alternating addresses.', 'Mất gói chỉ đáng lo nếu nó tiếp diễn tới mọi chặng sau. Ở đây đích mất 0 %, nên gói đi xuyên qua chặng 3; router chỉ không tạo ICMP Time exceeded (bị chặn hoặc giới hạn tốc độ trên CPU điều khiển) — đúng như lab với router DC im lặng. Vòng lặp thì sẽ hiện các địa chỉ xen kẽ.'),
      },
      {
        question: q('On 4 October 2021 Facebook’s servers were running, yet users everywhere got “facebook.com not found”. What was the mechanism?', 'Ngày 4/10/2021 các máy chủ của Facebook vẫn chạy, vậy mà người dùng khắp nơi nhận “facebook.com not found”. Cơ chế là gì?'),
        options: o([['Facebook’s TLS certificates expired', 'Chứng chỉ TLS của Facebook hết hạn'], ['The BGP routes to Facebook’s DNS servers were withdrawn, so resolvers could not reach them and answered SERVFAIL', 'Tuyến BGP tới máy chủ DNS của Facebook bị rút, nên resolver không tới được chúng và trả SERVFAIL'], ['A DDoS attack took down 1.1.1.1 and 8.8.8.8', 'Một vụ DDoS làm sập 1.1.1.1 và 8.8.8.8'], ['Browsers had cached a wrong IP address', 'Trình duyệt cache nhầm một địa chỉ IP']]),
        correctIndex: 1, points: 1,
        explanation: ex('A maintenance command took the backbone down; Facebook’s DNS servers then withdrew their own prefixes by design. With no route to the authoritative servers, every resolver returned SERVFAIL (our lab’s dnsmasq answered REFUSED + EDE 23 “Network Error” — same effect). The public resolvers were healthy; they simply had nobody to ask.', 'Một lệnh bảo trì làm sập mạng xương sống; máy chủ DNS của Facebook theo thiết kế tự rút prefix của mình. Không còn tuyến tới máy chủ tên gốc, mọi resolver trả SERVFAIL (dnsmasq trong lab trả REFUSED + EDE 23 “Network Error” — cùng hiệu ứng). Các resolver công cộng vẫn khoẻ; chỉ là chúng không còn ai để hỏi.'),
      },
      {
        question: q('The laptop and the phone in the same house both connect to LabFlow from source port 41000. The server reports <code>198.51.100.2 port 41000</code> for the laptop and <code>198.51.100.2 port 4734</code> for the phone. Why?', 'Laptop và điện thoại trong cùng một nhà đều kết nối tới LabFlow từ cổng nguồn 41000. Máy chủ báo <code>198.51.100.2 port 41000</code> cho laptop và <code>198.51.100.2 port 4734</code> cho điện thoại. Vì sao?'),
        options: o([['The phone’s network stack has a bug', 'Ngăn xếp mạng của điện thoại bị lỗi'], ['The phone used IPv6', 'Điện thoại đã dùng IPv6'], ['The ISP changed the port', 'Nhà mạng đổi cổng'], ['198.51.100.2:41000 was already used for that destination, so the home router rewrote the phone’s port', '198.51.100.2:41000 đã được dùng cho đích đó, nên router nhà viết lại cổng của điện thoại']]),
        correctIndex: 3, points: 1,
        explanation: ex('Both devices share one public address. Two connections from 198.51.100.2:41000 to the same server port would be indistinguishable, so the NAT rewrites the second one’s port and records it in conntrack (sport=41000 … dport=4734). IPv6 would show the phone’s own address, not 198.51.100.2.', 'Hai thiết bị dùng chung một địa chỉ công cộng. Hai kết nối cùng từ 198.51.100.2:41000 tới cùng một cổng máy chủ sẽ không phân biệt được, nên NAT viết lại cổng của kết nối thứ hai và ghi vào conntrack (sport=41000 … dport=4734). Nếu là IPv6, máy chủ sẽ thấy địa chỉ riêng của điện thoại chứ không phải 198.51.100.2.'),
      },
      {
        question: q('A teammate on 4G has the address <code>100.64.0.10</code> and wants to show a client a server on port 8080 of the phone. From outside, <code>nc 198.51.100.200 8080</code> is refused. What is going on?', 'Một đồng nghiệp dùng 4G có địa chỉ <code>100.64.0.10</code> và muốn cho khách xem một máy chủ ở cổng 8080 trên điện thoại. Từ bên ngoài, <code>nc 198.51.100.200 8080</code> bị từ chối. Chuyện gì đang xảy ra?'),
        options: o([['The phone is behind the ISP’s carrier-grade NAT; that public address is the ISP’s, so no port can be forwarded — use an outbound tunnel', 'Điện thoại ở sau NAT cấp nhà mạng; địa chỉ công cộng đó là của nhà mạng, nên không mở cổng được — dùng đường hầm đi ra'], ['The phone’s firewall blocks port 8080', 'Tường lửa của điện thoại chặn cổng 8080'], ['Port 8080 is reserved by Docker', 'Cổng 8080 bị Docker giữ'], ['A DNAT rule on the phone would fix it', 'Một luật DNAT trên điện thoại sẽ sửa được']]),
        correctIndex: 0, points: 1,
        explanation: ex('100.64.0.0/10 is the shared range for CGNAT (RFC 6598). 198.51.100.200 belongs to the ISP and is shared by many customers; the ISP’s box answered “refused”. A rule on the phone cannot help because the translation happens on equipment you do not control. Outbound tunnels (or IPv6) are the way out.', '100.64.0.0/10 là dải dùng chung cho CGNAT (RFC 6598). 198.51.100.200 thuộc nhà mạng và dùng chung cho nhiều khách; chính hộp của nhà mạng trả lời “refused”. Một luật trên điện thoại không giúp được vì phép biên dịch diễn ra trên thiết bị bạn không điều khiển. Đường hầm đi ra (hoặc IPv6) là lối thoát.'),
      },
      {
        question: q('What is the correct compressed form of <code>2001:0db8:0000:0000:0001:0000:0000:0001</code>?', 'Dạng viết gọn đúng của <code>2001:0db8:0000:0000:0001:0000:0000:0001</code> là gì?'),
        options: o([['2001:db8:0:0:1::1', '2001:db8:0:0:1::1'], ['2001:db8::1::1', '2001:db8::1::1'], ['2001:db8::1:0:0:1', '2001:db8::1:0:0:1'], ['2001:db8:0:0:1:0:0:1', '2001:db8:0:0:1:0:0:1']]),
        correctIndex: 2, points: 1,
        explanation: ex('Drop leading zeros, then replace ONE run of zero groups with ::. There are two runs of equal length (two groups each); RFC 5952 says take the first ⇒ 2001:db8::1:0:0:1 (Python’s ipaddress prints the same). Two :: are illegal — nobody could tell how many zeros each hides; leaving the zeros is valid but not the compressed form.', 'Bỏ số 0 đầu nhóm, rồi thay MỘT dãy nhóm số 0 bằng ::. Có hai dãy dài bằng nhau (mỗi dãy hai nhóm); RFC 5952 nói lấy dãy đầu ⇒ 2001:db8::1:0:0:1 (ipaddress của Python cũng in vậy). Hai dấu :: là sai luật — không ai biết mỗi cái che bao nhiêu số 0; để nguyên số 0 thì hợp lệ nhưng không phải dạng viết gọn.'),
      },
      {
        question: q('After upgrading Node.js, tests fail with <code>ECONNREFUSED ::1:5432</code>. PostgreSQL runs and listens on <code>127.0.0.1:5432</code>; the connection string says <code>localhost</code>. Best explanation?', 'Sau khi nâng cấp Node.js, test hỏng với <code>ECONNREFUSED ::1:5432</code>. PostgreSQL vẫn chạy và nghe trên <code>127.0.0.1:5432</code>; chuỗi kết nối ghi <code>localhost</code>. Giải thích tốt nhất?'),
        options: o([['PostgreSQL crashed', 'PostgreSQL bị sập'], ['IPv6 is disabled on the machine', 'Máy đã tắt IPv6'], ['Port 5432 is wrong', 'Cổng 5432 sai'], ['localhost resolves to ::1 first and the client tried only that; use 127.0.0.1 or make the server listen on both', 'localhost phân giải ra ::1 trước và client chỉ thử địa chỉ đó; dùng 127.0.0.1 hoặc cho máy chủ nghe cả hai']]),
        correctIndex: 3, points: 1,
        explanation: ex('Since Node 17 addresses keep the system order, and localhost lists ::1 first. Nothing listens on ::1:5432, so the kernel refuses at once (the lab reproduced ECONNREFUSED ::1:5000). Clients with address auto-selection try 127.0.0.1 next; many libraries do not. If IPv6 were disabled, ::1 would not be tried at all.', 'Từ Node 17, địa chỉ giữ nguyên thứ tự của hệ thống, và localhost liệt kê ::1 trước. Không có gì nghe ở ::1:5432, nên nhân từ chối ngay (lab đã dựng lại ECONNREFUSED ::1:5000). Client có tự chọn địa chỉ sẽ thử 127.0.0.1 kế tiếp; nhiều thư viện thì không. Nếu IPv6 bị tắt, ::1 đã chẳng được thử.'),
      },
      {
        question: q('The ISP’s BGP table shows <code>203.0.113.0/24</code> path <code>64510</code> and <code>203.0.113.0/25</code> path <code>64511</code>. LabFlow’s ROA says “203.0.113.0/24, origin AS64510, max /24”. What is the RPKI status of the /25, and where does traffic to 203.0.113.10 go on a network that does not validate?', 'Bảng BGP của nhà mạng có <code>203.0.113.0/24</code> path <code>64510</code> và <code>203.0.113.0/25</code> path <code>64511</code>. ROA của LabFlow ghi “203.0.113.0/24, AS gốc AS64510, tối đa /24”. Trạng thái RPKI của /25 là gì, và lưu lượng tới 203.0.113.10 đi đâu trên một mạng không kiểm tra?'),
        options: o([['Valid; traffic still goes to AS64510', 'Valid; lưu lượng vẫn tới AS64510'], ['Invalid; traffic for .0–.127 goes to AS64511 by longest prefix match', 'Invalid; lưu lượng cho .0–.127 tới AS64511 theo khớp tiền tố dài nhất'], ['Not found; traffic is split between both', 'Not found; lưu lượng chia cho cả hai'], ['Invalid; but the /24 still wins because it is older', 'Invalid; nhưng /24 vẫn thắng vì nó cũ hơn']]),
        correctIndex: 1, points: 1,
        explanation: ex('The ROA covers the prefix, so the status is not “not found”; the /25 has the wrong origin and is longer than /24 ⇒ invalid. Networks that validate drop it; networks that do not install it, and the more specific /25 wins for .0–.127 — the YouTube 2008 mechanism replayed in lesson 2.5. Age plays no role in route selection.', 'ROA bao phủ prefix đó nên trạng thái không phải “not found”; /25 sai AS gốc và dài hơn /24 ⇒ invalid. Mạng có kiểm tra sẽ bỏ nó; mạng không kiểm tra sẽ cài nó, và /25 cụ thể hơn thắng cho .0–.127 — đúng cơ chế YouTube 2008 đã dựng lại ở bài 2.5. Tuổi của tuyến không có vai trò gì trong việc chọn tuyến.'),
      },
    ],
  },
};
