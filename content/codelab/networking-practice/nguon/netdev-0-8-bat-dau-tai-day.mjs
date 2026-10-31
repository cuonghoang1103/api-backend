/** Networking for Developers · Mục 0 · "Bắt đầu tại đây (1/2)" — mạng bằng lời đời thường, các cặp từ hay nhầm, lịch sử, sự cố → tầng. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, sauLenh, pre } from './_net.mjs';

/* ── 1. Bưu kiện ⇒ thuật ngữ mạng ── */
const TU = ['packet', 'IP address', 'port', 'router', 'link', 'DNS', 'switch'];
const E1 = cs({
  ten: 'Start 1 — The post-office picture, word by word', kho: 'EASY', phut: 6, loai: 'table',
  en: 'The lesson explains a network as sending a book by post. Match every piece of the post-office picture to the network word it stands for.',
  vi: 'Bài học giải thích mạng bằng hình ảnh gửi một cuốn sách qua bưu điện. Ghép mỗi mảnh của bức tranh bưu điện với từ mạng mà nó đại diện.',
  bang: [bang1('b1', ['Post office → network', 'Bưu điện → mạng'], [{ ma: 'x', ten: 'In the post-office picture' }, { ma: 'w', ten: 'Network word', luaChon: TU }], [
    { o: { x: 'A chunk of your data in a box, with a label written on the outside' }, a: { w: 'packet' } },
    { o: { x: 'The street address of the building, valid anywhere in the world' }, a: { w: 'IP address' } },
    { o: { x: 'The flat number inside the apartment building' }, a: { w: 'port' } },
    { o: { x: 'A sorting centre that reads only the address and passes the box one step on' }, a: { w: 'router' } },
    { o: { x: 'The roads and trucks that carry boxes and know nothing else' }, a: { w: 'link' } },
    { o: { x: 'The phone book that turns a name into a street address' }, a: { w: 'DNS' } },
    { o: { x: 'The letterboxes inside one building, where boxes move between neighbours only' }, a: { w: 'switch' } },
  ], ['Packet = data + header (the label). The IP address picks the machine anywhere in the world, the port picks the program on it (443 for HTTPS, 80 for HTTP). Routers forward between networks without opening the box; links only carry bits; DNS turns cuongthai.com into 160.187.1.208. A switch only moves frames between machines of ONE local network — that is why it is the neighbours\' letterboxes, not a sorting centre between cities.', 'Packet = dữ liệu + header (nhãn). Địa chỉ IP chọn máy ở bất cứ đâu, cổng (port) chọn chương trình trên máy đó (443 cho HTTPS, 80 cho HTTP). Router chuyển giữa các mạng mà không mở hộp; đường truyền chỉ chở bit; DNS đổi cuongthai.com thành 160.187.1.208. Switch chỉ chuyển frame giữa các máy trong MỘT mạng nội bộ — nên nó là hộp thư giữa hàng xóm, không phải trung tâm phân loại giữa các thành phố.'])],
  goiY: [['Ask of each piece: does it pick a machine, pick a program, move things one step, or translate a name?', 'Hỏi mỗi mảnh: nó chọn máy, chọn chương trình, chuyển hộp một bước, hay dịch tên?'], ['Two "forwarding" pieces exist: one works between networks (by IP), one inside a single network (by MAC).', 'Có hai mảnh "chuyển tiếp": một cái làm việc giữa các mạng (theo IP), một cái bên trong một mạng (theo MAC).']],
  loi: [['Mixing up the IP address (which machine) and the port (which program on that machine).', 'Nhầm địa chỉ IP (máy nào) với cổng (chương trình nào trên máy đó).'], ['Calling a switch a router: a switch never connects two different networks.', 'Gọi switch là router: switch không bao giờ nối hai mạng khác nhau.']],
  tns: [tn('packet', 'gói tin', 'Một mẩu dữ liệu có header phía trước.'), tn('port', 'cổng', 'Số chọn chương trình trên một máy, ví dụ 443.'), tn('link', 'đường truyền', 'Cáp đồng, cáp quang, Wi-Fi, 4G/5G — chỉ chở bit.')],
  kn: ['network basics'],
});

/* ── 2. Sáu cặp từ hay nhầm, dưới dạng tình huống ── */
const E2 = cs({
  ten: 'Start 2 — The six pairs everybody confuses', kho: 'EASY', phut: 10,
  en: 'Each question is a small situation from a developer\'s week. Pick the word of the pair that explains it.',
  vi: 'Mỗi câu là một tình huống nhỏ trong tuần làm việc của lập trình viên. Chọn từ trong cặp giải thích được nó.',
  cau: [
    q('c1', ['Email and SSH to the server still work, but no web page loads. Which one is broken?', 'Email và SSH tới server vẫn chạy, nhưng không trang web nào mở được. Cái nào hỏng?'], ['The Web — one service that runs on the Internet', 'The Internet — the network of all networks', 'The cable between your laptop and the router', 'The IP address of your own laptop'], ['Email and SSH use the Internet too, so the Internet works; only the Web service (HTTP) has a problem. "The site is down" and "the network is down" are different bugs.', 'Email và SSH cũng dùng Internet, nên Internet vẫn chạy; chỉ dịch vụ Web (HTTP) có vấn đề. "Trang web sập" và "mạng sập" là hai lỗi khác nhau.']),
    q('c2', ['A packet goes laptop → router → server. Which address is rewritten at every router?', 'Gói đi laptop → router → server. Địa chỉ nào bị viết lại ở mỗi router?'], ['The MAC address — it is valid on one hop only', 'The IP address — it is valid on one hop only', 'The port number — it changes at every router', 'The domain name — DNS changes it at each hop'], ['The IP address is for the whole journey and stays the same (lesson 1.4 captures it on both sides of the router). The MAC address names a network card on one link, so each router builds a new frame with new MACs.', 'Địa chỉ IP dùng cho cả hành trình và giữ nguyên (bài 1.4 bắt gói ở hai phía router). MAC đặt tên card mạng trên một liên kết, nên mỗi router dựng frame mới với MAC mới.']),
    q('c3', ['curl prints "404 Not Found". Did the TCP connection work?', 'curl in "404 Not Found". Kết nối TCP có thành công không?'], ['Yes — 404 is an HTTP answer sent over a working connection', 'No — 404 means TCP could not reach the server at all', 'No — 404 means the DNS lookup of the name failed', 'Yes — but 404 means the TLS certificate has expired'], ['TCP delivers the bytes; HTTP is the language written in them. Only a working connection can carry an HTTP answer like 404. "Connection refused" is the TCP-level failure.', 'TCP chở byte; HTTP là ngôn ngữ viết trong đó. Chỉ kết nối đã thông mới chở được câu trả lời HTTP như 404. "Connection refused" mới là lỗi tầng TCP.']),
    q('c4', ['You moved the website to a new server. Why do some users still reach the old one for a while?', 'Bạn chuyển website sang server mới. Vì sao vài người dùng vẫn tới server cũ một lúc?'], ['DNS answers (name → address) are cached for a while', 'The old server keeps the domain name inside its RAM', 'Routers remember every website by its name forever', 'Browsers always ignore DNS and keep the first address'], ['The name stays, the address behind it changed. Resolvers and browsers cache the old name → address answer until it expires (its TTL) — Chapter 3.', 'Tên giữ nguyên, địa chỉ phía sau đã đổi. Máy phân giải và trình duyệt lưu đệm câu trả lời tên → địa chỉ cũ tới khi hết hạn (TTL) — Chương 3.']),
    q('c5', ['A 1 Gbit/s line to a server on another continent still makes small API calls slow. Why?', 'Đường 1 Gbit/s tới server ở châu lục khác vẫn làm các lệnh gọi API nhỏ bị chậm. Vì sao?'], ['Latency: every round trip still costs 150–250 ms', 'Bandwidth: 1 Gbit/s is too little for small calls', 'The switch in the office is too slow for the line', 'The MAC address must be resolved again each time'], ['Bandwidth is how much data per second; latency is how long one trip takes. A small request is not limited by bandwidth at all — it waits for round trips, and distance makes each one long.', 'Băng thông là lượng dữ liệu mỗi giây; độ trễ là thời gian một chuyến đi. Request nhỏ không bị băng thông giới hạn — nó chờ các chuyến đi-về, và khoảng cách làm mỗi chuyến dài ra.']),
    q('c6', ['Two laptops on the same Wi-Fi talk directly; a laptop and a cloud server talk through another device. Which one?', 'Hai laptop cùng Wi-Fi nói chuyện trực tiếp; laptop và server trên cloud phải qua một thiết bị khác. Thiết bị nào?'], ['A router — it joins different networks by IP', 'A switch — it joins different networks by MAC', 'A DNS server — it carries every packet out', 'A load balancer — it is needed for every packet'], ['"Same network or not?" decides it. Inside one network a switch forwards frames by MAC; to reach another network the packet must go through a router, which forwards by IP.', '"Cùng mạng hay không?" quyết định. Trong một mạng, switch chuyển frame theo MAC; muốn tới mạng khác, gói phải qua router, router chuyển theo IP.']),
  ],
  goiY: [['For each pair, ask: which word is the bigger thing, which is one part of it?', 'Với mỗi cặp, hỏi: từ nào là thứ lớn hơn, từ nào chỉ là một phần của nó?'], ['IP/MAC: journey vs one hop. TCP/HTTP: delivery vs language. Bandwidth/latency: how much vs how long.', 'IP/MAC: cả hành trình vs một chặng. TCP/HTTP: chuyển phát vs ngôn ngữ. Băng thông/độ trễ: bao nhiêu vs bao lâu.']],
  loi: [['Reading "404" as a network failure — the network delivered the answer perfectly.', 'Đọc "404" thành lỗi mạng — mạng đã chở câu trả lời hoàn hảo.'], ['Buying more bandwidth to fix latency on small requests.', 'Mua thêm băng thông để chữa độ trễ của các request nhỏ.']],
  tns: [tn('latency', 'độ trễ', 'Thời gian một chuyến đi (hoặc đi-về).'), tn('bandwidth', 'băng thông', 'Lượng dữ liệu tối đa mỗi giây.'), tn('MAC address', 'địa chỉ MAC', 'Địa chỉ phần cứng của card mạng, chỉ có giá trị trên một chặng.')],
  kn: ['Internet vs Web', 'IP vs MAC', 'TCP vs HTTP', 'bandwidth vs latency'],
});

/* ── 3. Lịch sử ── */
const E3 = cs({
  ten: 'Start 3 — Put the history of the Internet in order', kho: 'MEDIUM', phut: 8, loai: 'order',
  en: 'The lesson lists the dates that explain why the Internet works the way it does. Put the events in the order they happened (oldest first). The second question orders the newer web protocols.',
  vi: 'Bài học liệt kê các mốc giải thích vì sao Internet hoạt động như hiện nay. Sắp các sự kiện theo thứ tự xảy ra (cũ nhất trước). Câu thứ hai sắp các giao thức web mới hơn.',
  cau: [
    ord('o1', ['From ARPANET to the Web', 'Từ ARPANET tới Web'], [
      'First host-to-host connection on the ARPANET, UCLA → SRI',
      'Vint Cerf and Bob Kahn design TCP to join different packet networks',
      'Flag day: every ARPANET host switches from NCP to TCP/IP',
      'Tim Berners-Lee proposes the World Wide Web at CERN',
      'The first public website, info.cern.ch, appears',
    ], ['29 October 1969 → 1973–1974 → 1 January 1983 → March 1989 → August 1991. The Web arrived about twenty years after the network it runs on. (DNS was also invented in 1983, by Paul Mockapetris.)', '29/10/1969 → 1973–1974 → 1/1/1983 → 3/1989 → 8/1991. Web ra đời khoảng hai mươi năm sau mạng mà nó chạy trên đó. (DNS cũng ra đời năm 1983, do Paul Mockapetris.)']),
    ord('o2', ['Newer protocols you will measure in this course', 'Các giao thức mới hơn bạn sẽ đo trong khoá'], [
      'HTTP/2 — many requests share one connection (RFC 7540)',
      'TLS 1.3 — encryption set up in one round trip (RFC 8446)',
      'QUIC — a new transport built on UDP (RFC 9000)',
      'HTTP/3 — HTTP carried over QUIC (RFC 9114)',
    ], ['2015 → 2018 → 2021 → 2022. HTTP/3 cannot come before QUIC: it is HTTP running on top of QUIC.', '2015 → 2018 → 2021 → 2022. HTTP/3 không thể có trước QUIC: nó là HTTP chạy trên QUIC.']),
  ],
  goiY: [['The network came first, then the common protocol, then the names, then the Web.', 'Mạng có trước, rồi giao thức chung, rồi tên miền, rồi mới tới Web.'], ['A protocol built "on top of" another must come after it.', 'Giao thức xây "trên" giao thức khác thì phải ra đời sau nó.']],
  loi: [['Thinking the Web and the Internet were born together.', 'Nghĩ Web và Internet ra đời cùng lúc.'], ['Putting HTTP/3 before QUIC.', 'Đặt HTTP/3 trước QUIC.']],
  tns: [tn('ARPANET', 'mạng ARPANET', 'Mạng nghiên cứu của Mỹ năm 1969, tổ tiên của Internet.'), tn('flag day', 'ngày chuyển đổi đồng loạt', '1/1/1983: mọi máy chuyển sang TCP/IP cùng lúc.'), tn('RFC', 'tài liệu chuẩn Internet', 'Request for Comments — văn bản định nghĩa giao thức.')],
  kn: ['Internet history'],
});

/* ── 4. Sự cố thật ⇒ tầng hỏng ── */
const TANG = ['Routing (BGP)', 'Routing (BGP) + DNS', 'DNS', 'TLS certificates', 'Application behind a proxy'];
const CHUONG = ['Lesson 2.5 + Chapter 3', 'Lesson 2.2', 'Chapter 3', 'Chapter 7', 'Chapter 10'];
const E4 = cs({
  ten: 'Start 4 — Real outages: which layer broke?', kho: 'MEDIUM', phut: 12, loai: 'table',
  en: 'Seven real incidents from the two "Start here" lessons. For each one choose the layer that broke and the part of the course that explains it. In every case except the last, the servers themselves were running.',
  vi: 'Bảy sự cố thật trong hai bài "Bắt đầu tại đây". Với mỗi sự cố, chọn tầng bị hỏng và phần của khoá giải thích nó. Trừ trường hợp cuối, ở mọi sự cố các server vẫn đang chạy.',
  bang: [bang1('b1', ['Outage → layer', 'Sự cố → tầng'], [{ ma: 'x', ten: 'Incident' }, { ma: 'l', ten: 'Layer that broke', luaChon: TANG }, { ma: 'h', ten: 'Where the course explains it', luaChon: CHUONG }], [
    { o: { x: 'Facebook, 4 Oct 2021 — the backbone went down, DNS servers stopped announcing their routes, nobody could look up facebook.com for about 6 hours' }, a: { l: 'Routing (BGP) + DNS', h: 'Lesson 2.5 + Chapter 3' } },
    { o: { x: 'Dyn, 21 Oct 2016 — a Mirai botnet flooded a DNS provider; Twitter, GitHub, Netflix were up but their names did not resolve' }, a: { l: 'DNS', h: 'Chapter 3' } },
    { o: { x: 'YouTube, 24 Feb 2008 — Pakistan Telecom announced 208.65.153.0/24 and the more specific route won worldwide' }, a: { l: 'Routing (BGP)', h: 'Lesson 2.2' } },
    { o: { x: 'Let\'s Encrypt, 30 Sep 2021 — the old root DST Root CA X3 expired; valid sites failed on old devices' }, a: { l: 'TLS certificates', h: 'Chapter 7' } },
    { o: { x: 'Slack, 30 Sep 2021 — a DNSSEC change; rolling back made it worse because resolvers had cached part of it' }, a: { l: 'DNS', h: 'Chapter 3' } },
    { o: { x: 'AWS us-east-1, 19–20 Oct 2025 — the DynamoDB endpoint was left with an empty DNS record' }, a: { l: 'DNS', h: 'Chapter 3' } },
    { o: { x: 'cuongthai.com, 18 Aug 2026 — a broken API image crash-looped; nginx in front answered 502 for seven minutes' }, a: { l: 'Application behind a proxy', h: 'Chapter 10' } },
  ], ['Two routing, four DNS (Facebook counts in both), one TLS, one application behind a proxy. Facebook is the tempting one: its DNS servers were healthy, but BGP routes to them were withdrawn, so DNS failed as a consequence — both layers. YouTube was pure routing: "the most specific route wins" (lesson 2.2). The cable was never the culprit.', 'Hai định tuyến, bốn DNS (Facebook tính cả hai), một TLS, một ứng dụng sau proxy. Facebook là câu dễ nhầm: máy chủ DNS vẫn khoẻ nhưng tuyến BGP tới chúng bị rút, nên DNS hỏng theo — cả hai tầng. YouTube là định tuyến thuần: "tuyến cụ thể nhất thắng" (bài 2.2). Không lần nào thủ phạm là sợi cáp.'])],
  goiY: [['Ask "what could users not do?": find the address (DNS), reach the address (routing), trust the server (TLS), or get a valid answer (application).', 'Hỏi "người dùng không làm được gì?": tìm địa chỉ (DNS), tới được địa chỉ (định tuyến), tin server (TLS), hay nhận câu trả lời hợp lệ (ứng dụng).'], ['BGP is the protocol networks use to announce "send traffic for these addresses to me" — a wrong or missing announcement is a routing failure.', 'BGP là giao thức các mạng dùng để thông báo "gửi lưu lượng của các địa chỉ này cho tôi" — thông báo sai hoặc mất là lỗi định tuyến.']],
  loi: [['Answering "DNS" alone for Facebook: the DNS servers were running, their routes disappeared.', 'Chỉ trả lời "DNS" cho Facebook: máy chủ DNS vẫn chạy, tuyến tới chúng mới biến mất.'], ['Calling the 502 a network failure — the proxy answered; the app behind it was dead.', 'Gọi 502 là lỗi mạng — proxy đã trả lời; ứng dụng phía sau mới chết.']],
  tns: [tn('outage', 'sự cố, mất dịch vụ'), tn('BGP', 'giao thức định tuyến giữa các mạng', 'Các mạng dùng nó để báo cho nhau mình giao được địa chỉ nào.'), tn('root certificate', 'chứng chỉ gốc')],
  kn: ['outages', 'layers'],
});

/* ── 5. Lý do thiết kế + con số ── */
const PING = sauLenh('c00-internet', 'ping -c 3').slice(1, 4);
const W = sauLenh('c00-internet', 'for i in 1 2 3')[0];
const E5 = cs({
  ten: 'Start 5 — Best effort, reliable ends, and two real numbers', kho: 'HARD', phut: 12,
  en: `These questions are about the design decisions behind the Internet and the real measurements from the lab (31 October 2026):${pre([...PING, '', W])}`,
  vi: `Các câu này về những quyết định thiết kế của Internet và số đo thật trong phòng lab (31/10/2026):${pre([...PING, '', W])}`,
  cau: [
    q('c1', ['A ping round trip took 7–10 ms, but the whole HTTPS request took 102.7 ms. The main reason is …', 'Một vòng ping mất 7–10 ms, nhưng cả request HTTPS mất 102,7 ms. Lý do chính là …'], ['a web request needs several round trips plus server work', 'curl measures in a slower unit than ping measures in', 'ping packets travel on a faster cable than HTTPS ones', 'the HTTPS request went to a different, farther server'], ['Same server, same path. A web request needs DNS, a TCP handshake, a TLS handshake, the request itself and the server\'s work — several round trips plus computing time; a ping is one round trip.', 'Cùng server, cùng đường đi. Một request web cần DNS, bắt tay TCP, bắt tay TLS, chính request và thời gian server xử lý — nhiều vòng đi-về cộng thời gian tính; ping chỉ là một vòng.']),
    q('c2', ['Routers in the middle of the Internet are "best effort". This means they …', 'Router ở giữa Internet là "best effort" (cố hết sức). Nghĩa là chúng …'], ['may drop, delay or reorder packets and will not tell you', 'resend every lost packet until the server receives it', 'open each packet to check that the data inside is right', 'reserve a fixed line for every conversation in advance'], ['The middle is kept simple: it forwards and may lose packets silently. Reliability (retransmission, ordering) lives at the two ends — TCP in the kernel, and timeouts/retries in your code.', 'Phần giữa được giữ đơn giản: chỉ chuyển tiếp và có thể làm mất gói trong im lặng. Độ tin cậy (gửi lại, sắp thứ tự) nằm ở hai đầu — TCP trong kernel, và timeout/thử lại trong code của bạn.']),
    q('c3', ['Your API calls another service with fetch(url) and no timeout. What can happen?', 'API của bạn gọi dịch vụ khác bằng fetch(url) không có timeout. Điều gì có thể xảy ra?'], ['The call can hang for minutes and freeze your API', 'The browser adds a two-second timeout to every call', 'TCP returns an error at once when a packet is lost', 'The router warns your code when it drops a packet'], ['"The network is reliable" is the first fallacy of distributed computing. A dropped packet or a server that accepted the connection and froze gives you silence, not an error — only a timeout you set limits the wait.', '"Mạng thì tin cậy" là ngộ nhận đầu tiên của tính toán phân tán. Gói bị rớt hoặc server nhận kết nối rồi treo cho bạn sự im lặng, không phải lỗi — chỉ timeout do bạn đặt mới giới hạn thời gian chờ.']),
    q('c4', ['Why did packet switching (instead of the telephone\'s reserved circuits) suit the ARPANET\'s goals?', 'Vì sao chuyển mạch gói (thay vì kênh dành riêng của điện thoại) hợp với mục tiêu của ARPANET?'], ['Packets share links and can take any path that still works', 'Packets always travel on one fixed path, so none are lost', 'Packets are encrypted, so a broken link cannot read them', 'Packets need no addresses, so routers are not required'], ['A cut wire kills a telephone call because its circuit is reserved. Independent packets share every link and route around the break — surviving broken links was one of the two design needs (the other: sharing costly computers).', 'Đứt dây là cuộc gọi chết vì kênh của nó được dành riêng. Các gói độc lập dùng chung mọi liên kết và đi vòng qua chỗ đứt — sống sót khi liên kết hỏng là một trong hai nhu cầu thiết kế (cái kia: dùng chung máy tính đắt tiền).']),
    q('c5', ['In the curl line above, how long did the TLS handshake itself take?', 'Trong dòng curl ở trên, riêng bắt tay TLS mất bao lâu?'], ['14.1 ms (26.0 − 11.9)', '26.0 ms (as printed)', '37.9 ms (26.0 + 11.9)', '3.3 ms (the DNS part)'], ['curl -w prints moments measured from the start, not durations: TLS ended 26.0 ms after the start and began when TCP finished at 11.9 ms, so it took 14.1 ms. Lesson 0.2 is about this trap.', 'curl -w in các THỜI ĐIỂM tính từ lúc bắt đầu, không phải độ dài: TLS kết thúc ở 26,0 ms và bắt đầu khi TCP xong ở 11,9 ms, nên nó mất 14,1 ms. Bài 0.2 nói về cái bẫy này.']),
    q('c6', ['The ITU estimate for 2025 quoted in the lesson is about …', 'Ước tính năm 2025 của ITU mà bài học trích là khoảng …'], ['6 billion people online, 74% of the world', '2.2 billion people online, 26% of the world', '8 billion people online, 99% of the world', '6 billion devices online, 74% of them phones'], ['Facts and Figures 2025: about 6 billion people (74%) online and about 2.2 billion not yet online. Every one of them reaches your software through DNS, TCP, TLS and HTTP.', 'Facts and Figures 2025: khoảng 6 tỷ người (74%) dùng Internet và khoảng 2,2 tỷ người chưa. Mỗi người trong số đó tới phần mềm của bạn qua DNS, TCP, TLS và HTTP.']),
  ],
  goiY: [['Count round trips: DNS, TCP, TLS, request — then add the server\'s own work.', 'Đếm số vòng đi-về: DNS, TCP, TLS, request — rồi cộng thời gian server tự làm.'], ['curl -w values are cumulative: subtract the previous value to get a stage.', 'Giá trị curl -w là cộng dồn: trừ giá trị trước đó để được một chặng.']],
  loi: [['Believing a lost packet always produces a quick error.', 'Tin rằng gói bị mất luôn sinh ra lỗi ngay.'], ['Reading time_appconnect as "TLS took 26 ms".', 'Đọc time_appconnect thành "TLS mất 26 ms".']],
  tns: [tn('best effort', 'cố gắng hết sức, không bảo đảm', 'Mạng chuyển gói nhưng không hứa không mất, không chậm, không đảo thứ tự.'), tn('packet switching', 'chuyển mạch gói'), tn('round trip time (RTT)', 'thời gian đi-về')],
  kn: ['best effort', 'end-to-end principle', 'timeouts'],
});

export default doiDau({ slug: 'netdev-0-8-bat-dau-tai-day', ten: 'Start here 1/2 — The network in everyday words', khoa: KHOA, baiHoc: 'netdev-0-8-bat-dau-tai-day', de: [E1, E2, E3, E4, E5] });
