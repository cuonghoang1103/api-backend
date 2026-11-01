/** Chương 3 · Quiz — 10 câu tình huống, đáp án rải đều (A×2 · B×3 · C×3 · D×2), dữ liệu từ output thật của lab DNS. */
const q = (en, vi) => `${en}|||${vi}`;
const o = (pairs) => pairs.map(([en, vi]) => q(en, vi));
const ex = (en, vi) => `EN: ${en}|||VI: ${vi}`;

export default {
  title: 'Quiz — Chapter 3: DNS in depth|||Quiz — Chương 3: DNS tới tận gốc',
  slug: 'netdev-3-7-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: cờ aa, search/ndots kiểu Kubernetes, /etc/hosts và getent, CNAME ở đỉnh tên miền, quên tăng serial, hạ TTL đúng thứ tự, cache âm, cache DNS của Java, GeoDNS nhìn resolver, chữ ký DNSSEC hết hạn.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Quiz</span>
<h2>Quiz — DNS in depth</h2>
<p class="lead">Ten situations from the DNS lab of this chapter. Most can be answered by reading an output the way the lessons taught.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can follow a name from the root with <code>dig +trace</code> or <code>+norecurse</code>, and tell a referral from an authoritative answer.</li>
<li>I know why <code>getent</code> and <code>dig</code> can disagree, and what <code>ndots</code> does.</li>
<li>I can write A/CNAME/MX/TXT/SRV/CAA records, avoid an apex CNAME, and bump the SOA serial.</li>
<li>I can plan a record change with TTLs, and explain negative caching and the Java/Node DNS caches.</li>
<li>I can explain anycast, GeoDNS and round-robin DNS, and diagnose a DNSSEC SERVFAIL with +cd and EDE.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Quiz</span>
<h2>Quiz — DNS tới tận gốc</h2>
<p class="lead">Mười tình huống lấy từ phòng lab DNS của chương. Phần lớn trả lời được bằng cách đọc một output theo đúng cách các bài đã dạy.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi lần được một cái tên từ gốc bằng <code>dig +trace</code> hoặc <code>+norecurse</code>, và phân biệt được lời giới thiệu với câu trả lời có thẩm quyền.</li>
<li>Tôi biết vì sao <code>getent</code> và <code>dig</code> có thể khác nhau, và <code>ndots</code> làm gì.</li>
<li>Tôi viết được bản ghi A/CNAME/MX/TXT/SRV/CAA, tránh CNAME ở đỉnh, và tăng serial SOA.</li>
<li>Tôi lên kế hoạch đổi bản ghi theo TTL được, và giải thích được cache âm cùng cache DNS của Java/Node.</li>
<li>Tôi giải thích được anycast, GeoDNS và DNS round-robin, và chẩn đoán được SERVFAIL do DNSSEC bằng +cd và EDE.</li>
</ul>
</div>`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: q('You ask <code>www.labflow.test</code> twice through the ISP resolver, then once with <code>dig @203.0.113.53 +norecurse</code>. Only the last answer carries the flag <code>aa</code>. Why?', 'Bạn hỏi <code>www.labflow.test</code> hai lần qua resolver nhà mạng, rồi một lần bằng <code>dig @203.0.113.53 +norecurse</code>. Chỉ câu trả lời cuối có cờ <code>aa</code>. Vì sao?'),
        options: o([['The resolver’s answer is wrong and should not be trusted', 'Câu trả lời của resolver sai, không nên tin'], ['aa = authoritative answer: only LabFlow’s own name server owns the data; the resolver returns a copy from its cache', 'aa = authoritative answer: chỉ máy chủ tên của chính LabFlow sở hữu dữ liệu; resolver trả bản sao từ cache'], ['aa means the DNSSEC signatures were checked', 'aa nghĩa là chữ ký DNSSEC đã được kiểm'], ['aa only appears when the query goes over TCP', 'aa chỉ xuất hiện khi câu hỏi đi qua TCP']]),
        correctIndex: 1, points: 1,
        explanation: ex('The resolver walked root → TLD → LabFlow once and caches the result (13 ms, then 0 ms); its replies carry rd ra (and ad), never aa. The authoritative server answers from its own zone, so it sets aa. DNSSEC validation is the ad flag, the tempting confusion; transport has nothing to do with aa.', 'Resolver đi gốc → TLD → LabFlow một lần rồi cache kết quả (13 ms, rồi 0 ms); câu trả lời của nó có rd ra (và ad), không bao giờ có aa. Máy chủ authoritative trả lời từ vùng của chính nó nên bật aa. Kiểm DNSSEC là cờ ad — chỗ dễ nhầm; còn giao thức vận chuyển không liên quan gì tới aa.'),
      },
      {
        question: q('A pod in Kubernetes has <code>search default.svc.cluster.local svc.cluster.local cluster.local</code> and <code>options ndots:5</code>. The app looks up <code>api.stripe.com</code> (IPv4 only). How many NXDOMAIN lookups happen before the real name is asked?', 'Một pod trong Kubernetes có <code>search default.svc.cluster.local svc.cluster.local cluster.local</code> và <code>options ndots:5</code>. Ứng dụng tra <code>api.stripe.com</code> (chỉ IPv4). Có bao nhiêu lần tra NXDOMAIN trước khi tên thật được hỏi?'),
        options: o([['0 — the name already has dots', '0 — tên đã có dấu chấm rồi'], ['1', '1'], ['3 — one per search domain', '3 — mỗi tên miền search một lần'], ['5 — one per dot required by ndots', '5 — mỗi dấu chấm ndots đòi một lần']]),
        correctIndex: 2, points: 1,
        explanation: ex('api.stripe.com has 2 dots, fewer than ndots 5, so the stub tries it with each search domain first — api.stripe.com.default.svc.cluster.local, …svc.cluster.local, …cluster.local — and only then as itself, exactly like labflow.cdn.test.labflow.test in lesson 3.1. Writing api.stripe.com. with a final dot skips the list. ndots is a threshold, not a count of attempts.', 'api.stripe.com có 2 dấu chấm, ít hơn ndots 5, nên stub thử ghép từng tên miền search trước — api.stripe.com.default.svc.cluster.local, …svc.cluster.local, …cluster.local — rồi mới tới chính nó, y như labflow.cdn.test.labflow.test ở bài 3.1. Viết api.stripe.com. có dấu chấm cuối thì bỏ qua danh sách. ndots là ngưỡng, không phải số lần thử.'),
      },
      {
        question: q('On a server, <code>dig +short labflow.test</code> prints <code>203.0.113.10</code> but <code>curl http://labflow.test/</code> reaches <code>203.0.113.11</code>. What do you check first?', 'Trên một máy, <code>dig +short labflow.test</code> in <code>203.0.113.10</code> nhưng <code>curl http://labflow.test/</code> lại tới <code>203.0.113.11</code>. Bạn kiểm gì trước?'),
        options: o([['getent ahosts labflow.test and /etc/hosts — curl uses getaddrinfo, which reads the hosts file before DNS', 'getent ahosts labflow.test và /etc/hosts — curl dùng getaddrinfo, thứ đọc tệp hosts trước DNS'], ['The resolver’s cache, which must be flushed', 'Cache của resolver, phải xoá đi'], ['The DNSSEC signatures of the zone', 'Chữ ký DNSSEC của vùng'], ['The TTL of the A record', 'TTL của bản ghi A']]),
        correctIndex: 0, points: 1,
        explanation: ex('dig speaks DNS directly; curl, browsers and Node’s dns.lookup call getaddrinfo, which follows nsswitch “files dns”. A forgotten /etc/hosts line (or extra_hosts in compose) gives exactly this split — lesson 3.1. A stale resolver cache would affect dig too, since dig asks the same resolver.', 'dig nói DNS trực tiếp; curl, trình duyệt và dns.lookup của Node gọi getaddrinfo, thứ làm theo nsswitch “files dns”. Một dòng /etc/hosts bị quên (hoặc extra_hosts trong compose) cho đúng sự chênh này — bài 3.1. Cache cũ của resolver thì dig cũng bị theo, vì dig hỏi cùng resolver đó.'),
      },
      {
        question: q('Your CDN says “point your domain to <code>labflow.cdn.test</code> with a CNAME”. You add <code>@ IN CNAME labflow.cdn.test.</code> to the zone of <code>labflow.test</code>. What happens?', 'CDN bảo “trỏ tên miền của bạn tới <code>labflow.cdn.test</code> bằng CNAME”. Bạn thêm <code>@ IN CNAME labflow.cdn.test.</code> vào vùng <code>labflow.test</code>. Chuyện gì xảy ra?'),
        options: o([['It works; the apex now follows the CDN', 'Chạy được; đỉnh tên miền giờ đi theo CDN'], ['Only email breaks', 'Chỉ email bị hỏng'], ['Only the www name is affected', 'Chỉ tên www bị ảnh hưởng'], ['The zone fails to load (“CNAME and other data”): the apex must keep SOA, NS, MX…; use the provider’s CNAME flattening / ALIAS instead', 'Vùng không nạp được (“CNAME and other data”): đỉnh phải giữ SOA, NS, MX…; hãy dùng CNAME flattening / ALIAS của nhà cung cấp']]),
        correctIndex: 3, points: 1,
        explanation: ex('A CNAME means “this name has no data of its own”, so it cannot coexist with any other record — and the apex always has SOA and NS. named-checkzone refused the whole zone in lesson 3.2, not just the apex. Providers publish the CDN’s addresses as A/AAAA at the apex (flattening/ALIAS).', 'CNAME nghĩa là “tên này không có dữ liệu riêng”, nên nó không đứng chung được với bản ghi nào khác — mà đỉnh luôn có SOA và NS. named-checkzone từ chối cả vùng ở bài 3.2, không chỉ riêng đỉnh. Nhà cung cấp công bố địa chỉ của CDN dưới dạng A/AAAA ở đỉnh (flattening/ALIAS).'),
      },
      {
        question: q('After a change on ns1, <code>dig +short @ns1 api.labflow.test</code> gives <code>.11</code>, <code>@ns2</code> gives <code>.10</code>, and both report SOA serial <code>2026110101</code>. Users get one or the other. Fix?', 'Sau một lần sửa trên ns1, <code>dig +short @ns1 api.labflow.test</code> ra <code>.11</code>, <code>@ns2</code> ra <code>.10</code>, và cả hai báo serial SOA <code>2026110101</code>. Người dùng nhận câu này hoặc câu kia. Sửa thế nào?'),
        options: o([['Restart ns2', 'Khởi động lại ns2'], ['Increase the serial on ns1 and reload: NOTIFY + a larger serial makes ns2 transfer the zone', 'Tăng serial trên ns1 rồi nạp lại: NOTIFY + serial lớn hơn khiến ns2 chép vùng'], ['Lower the TTL of api', 'Hạ TTL của api'], ['Flush the ISP resolver', 'Xoá cache resolver nhà mạng']]),
        correctIndex: 1, points: 1,
        explanation: ex('A secondary copies the zone only when the primary’s serial is larger. With the same serial ns2 keeps the old data forever (until expire). In lesson 3.2 bumping to 2026110102 produced a NOTIFY and a transfer in 2 ms. Restarting ns2 reloads its own old copy; flushing a resolver just picks the wrong server again later.', 'Máy phụ chỉ chép vùng khi serial của máy chính lớn hơn. Cùng serial thì ns2 giữ dữ liệu cũ mãi (tới khi hết expire). Ở bài 3.2, tăng lên 2026110102 sinh ra NOTIFY và một lần chép trong 2 ms. Khởi động lại ns2 chỉ nạp lại bản cũ của nó; xoá cache resolver thì lần sau nó vẫn có thể hỏi trúng máy sai.'),
      },
      {
        question: q('A record has TTL 3600. At 10:00 you lower it to 60; at 10:05 you change the IP. A resolver fetched the record at 9:59. Until about when may its users still get the old IP?', 'Một bản ghi có TTL 3600. Lúc 10:00 bạn hạ xuống 60; lúc 10:05 bạn đổi IP. Một resolver đã lấy bản ghi lúc 9:59. Người dùng của nó có thể vẫn nhận IP cũ tới khoảng mấy giờ?'),
        options: o([['10:06 — 60 s after the change', '10:06 — 60 giây sau khi đổi'], ['10:05 — immediately after the change', '10:05 — ngay khi đổi'], ['About 10:59 — the copy fetched with TTL 3600 lives its full hour', 'Khoảng 10:59 — bản lấy về với TTL 3600 sống trọn một giờ'], ['Forever, until the resolver restarts', 'Mãi mãi, tới khi resolver khởi động lại']]),
        correctIndex: 2, points: 1,
        explanation: ex('Caches count down the TTL they received and never re-ask before it ends; lowering the TTL on the server does not reach a copy fetched earlier. We measured exactly this: IP changed at 16:11:02, old address served until 16:12:47 (the rest of the old 120 s). Lower the TTL, wait the old TTL, then change.', 'Cache đếm ngược TTL nó đã nhận và không hỏi lại trước khi hết; hạ TTL trên máy chủ không chạm tới bản đã lấy trước đó. Ta đã đo đúng điều này: đổi IP lúc 16:11:02, địa chỉ cũ còn được trả tới 16:12:47 (phần còn lại của 120 s cũ). Hạ TTL, chờ hết TTL cũ, rồi mới đổi.'),
      },
      {
        question: q('The SOA of a zone is <code>… 3600 IN SOA … 2026110101 3600 600 1209600 300</code>. A monitoring probe asked <code>new.labflow.test</code> before you created it. For how long can a resolver keep answering NXDOMAIN?', 'SOA của một vùng là <code>… 3600 IN SOA … 2026110101 3600 600 1209600 300</code>. Một đầu dò giám sát đã hỏi <code>new.labflow.test</code> trước khi bạn tạo nó. Resolver có thể tiếp tục trả NXDOMAIN bao lâu?'),
        options: o([['300 s — min(SOA TTL 3600, minimum 300)', '300 s — min(TTL của SOA 3600, minimum 300)'], ['3600 s — the SOA’s TTL', '3600 s — TTL của SOA'], ['600 s — the retry value', '600 s — giá trị retry'], ['0 s — negative answers are never cached', '0 s — câu trả lời âm không bao giờ được cache']]),
        correctIndex: 0, points: 1,
        explanation: ex('RFC 2308: a negative answer is cached for the smaller of the SOA record’s TTL and its last field. In lesson 3.3 the resolver showed 298 s left after the record existed on ns1; for cuongthai.com (Cloudflare) the value is 1800 s. With DNSSEC, flushing just the name may not even help (aggressive NSEC).', 'RFC 2308: câu trả lời âm được cache trong khoảng nhỏ hơn giữa TTL của bản ghi SOA và trường cuối của nó. Ở bài 3.3, resolver còn 298 s dù bản ghi đã có trên ns1; với cuongthai.com (Cloudflare) con số là 1800 s. Với DNSSEC, xoá riêng cái tên có khi còn không đủ (aggressive NSEC).'),
      },
      {
        question: q('A service moved to a new IP. The DNS TTL is 60 s, the Node services switched within a minute, but one Java service kept calling the old IP until it was restarted the next day. Most likely cause?', 'Một dịch vụ chuyển sang IP mới. TTL DNS là 60 s, các dịch vụ Node đã đổi trong vòng một phút, nhưng một dịch vụ Java vẫn gọi IP cũ tới khi được khởi động lại hôm sau. Nguyên nhân nhiều khả năng nhất?'),
        options: o([['Java does not use DNS', 'Java không dùng DNS'], ['The resolver ignored the TTL for Java', 'Resolver bỏ qua TTL cho Java'], ['Node caches DNS longer than Java', 'Node cache DNS lâu hơn Java'], ['The JVM’s own DNS cache was set to forever (networkaddress.cache.ttl=-1, or a security manager)', 'Cache DNS riêng của JVM bị đặt thành mãi mãi (networkaddress.cache.ttl=-1, hoặc có security manager)']]),
        correctIndex: 3, points: 1,
        explanation: ex('The JVM caches lookups itself — 30 s by default without a security manager (DEFAULT_POSITIVE = 30; in lesson 3.3 it asked the network once for five lookups). Set to -1 it never asks again. Node has no DNS cache at all (it asked five times), which is why it followed the change.', 'JVM tự cache các lần tra — mặc định 30 s khi không có security manager (DEFAULT_POSITIVE = 30; ở bài 3.3 nó chỉ ra mạng một lần cho năm lần tra). Đặt -1 thì nó không bao giờ hỏi lại. Node hoàn toàn không có cache DNS (nó hỏi năm lần), vì thế nó theo kịp thay đổi.'),
      },
      {
        question: q('Users in Hanoi sometimes download images from the CDN’s Singapore edge. The CDN uses GeoDNS. Which explanation fits what the lab showed?', 'Người dùng ở Hà Nội thỉnh thoảng tải ảnh từ máy biên Singapore của CDN. CDN dùng GeoDNS. Giải thích nào khớp với điều lab đã cho thấy?'),
        options: o([['Their Wi-Fi is slow', 'Wi-Fi của họ chậm'], ['GeoDNS sees the resolver’s address, not the user’s: their resolver (or its anycast site) is in Singapore', 'GeoDNS thấy địa chỉ của resolver, không phải của người dùng: resolver của họ (hoặc điểm anycast của nó) ở Singapore'], ['The image TTL expired', 'TTL của ảnh đã hết'], ['DNSSEC forces the farthest server', 'DNSSEC ép chọn máy xa nhất']]),
        correctIndex: 1, points: 1,
        explanation: ex('The CDN’s name server only talks to resolvers. When pop1 was withdrawn, the laptop in Vietnam silently used pop2 in Singapore and got the Singapore edge (203.0.113.11). ECS could pass part of the user’s address, but 1.1.1.1 deliberately does not send it.', 'Máy chủ tên của CDN chỉ nói chuyện với resolver. Khi pop1 bị rút, laptop ở Việt Nam lặng lẽ dùng pop2 ở Singapore và nhận máy biên Singapore (203.0.113.11). ECS có thể gửi một phần địa chỉ người dùng, nhưng 1.1.1.1 cố ý không gửi.'),
      },
      {
        question: q('<code>dig labflow.test</code> returns <code>SERVFAIL</code> with <code>EDE: 7 (Signature Expired)</code>; <code>dig +cd labflow.test</code> returns <code>203.0.113.10</code>; both name servers answer normally. What is wrong and what fixes it?', '<code>dig labflow.test</code> trả <code>SERVFAIL</code> kèm <code>EDE: 7 (Signature Expired)</code>; <code>dig +cd labflow.test</code> trả <code>203.0.113.10</code>; cả hai máy chủ tên trả lời bình thường. Hỏng gì và sửa ra sao?'),
        options: o([['The web server is down; restart it', 'Máy chủ web sập; khởi động lại'], ['The A record was deleted; add it back', 'Bản ghi A bị xoá; thêm lại'], ['The zone’s DNSSEC signatures expired; re-sign the zone (then the resolver’s bogus cache clears within ~60 s or by a flush)', 'Chữ ký DNSSEC của vùng đã hết hạn; ký lại vùng (rồi cache bogus của resolver tự hết trong ~60 s hoặc xoá đi)'], ['The TTL is too long; lower it', 'TTL quá dài; hạ xuống']]),
        correctIndex: 2, points: 1,
        explanation: ex('Works with +cd (checking disabled), fails without ⇒ DNSSEC; EDE 7 names the reason. Re-signing fixed the zone in lesson 3.5, but the resolver still returned SERVFAIL until its val-bogus-ttl (60 s) passed or flush_bogus was run. The data and servers were fine all along.', 'Chạy với +cd (tắt kiểm), hỏng khi không có ⇒ DNSSEC; EDE 7 gọi tên lý do. Ký lại đã sửa được vùng ở bài 3.5, nhưng resolver vẫn trả SERVFAIL tới khi hết val-bogus-ttl (60 s) hoặc chạy flush_bogus. Dữ liệu và máy chủ lúc nào cũng ổn.'),
      },
    ],
  },
};
