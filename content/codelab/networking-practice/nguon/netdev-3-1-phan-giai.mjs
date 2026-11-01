/** Networking for Developers · 3.1 — Phân giải tên: đọc dig, theo resolver từng gói, tự đi root → TLD → authoritative, phía stub (hosts, search/ndots, systemd-resolved); tự viết searchOrder()/queriesFor() và clientWaits() trên bản in dnsgoi thật. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, sauLenh, pre } from './_net.mjs';

const tr = (ds) => ds.map((d) => d.replace(/\s+$/, ''));
const S = (tep, lenh) => tr(sauLenh(tep, lenh));
const DIG = S('c31-dig', 'dig www.labflow.test').filter((d, i, a) => !(d === '' && a[i - 1] === ''));
const DIG2 = S('c31-dig', "dig www.labflow.test | grep");
const RES = S('c31-dig', 'cat /etc/resolv.conf');
const GOI = S('c31-isp-doc', './dnsgoi.sh');
const TAY1 = S('c31-tay', 'dig @192.0.2.10').filter((d) => d.trim());
const TAY2 = S('c31-tay', 'dig @192.0.2.20').filter((d) => d.trim());
const TAY3 = S('c31-tay', 'dig @203.0.113.53').filter((d) => d.trim());
if (GOI.length !== 23 || !DIG.some((d) => d.includes('Query time: 13 msec')) || !DIG2.some((d) => d.includes('Query time: 0 msec'))) throw new Error('3.1: output thật đổi — xem lại đề');
const gon = (ds) => ds.filter((d) => !/^; <<>>|^;; global|^; \(1 server|^;; Got answer|^; COOKIE|^;; OPT|^; EDNS|^;; WHEN|^;; MSG/.test(d));

/* ── 1. Đọc một câu trả lời dig ── */
const E1 = cs({
  ten: 'DNS 1 — Read one dig answer, line by line', kho: 'EASY', phut: 10,
  en: `On the lab laptop (lab/out/c31-dig): which resolver the laptop uses, a first question, then the same question again a moment later.${pre(['$ cat /etc/resolv.conf', ...RES, '$ dig www.labflow.test', ...DIG, '$ dig www.labflow.test | grep -E \'Query time|^www|^labflow\'', ...DIG2])}`,
  vi: `Trên laptop của phòng lab (lab/out/c31-dig): laptop dùng resolver nào, một câu hỏi, rồi hỏi lại đúng câu đó ngay sau.${pre(['$ cat /etc/resolv.conf', ...RES, '$ dig www.labflow.test', ...DIG, '$ dig www.labflow.test | grep -E \'Query time|^www|^labflow\'', ...DIG2])}`,
  cau: [
    q('c1', ['Which flag says that the server you asked is willing to do the whole lookup for you?', 'Cờ nào cho biết máy chủ bạn hỏi sẵn lòng đi tra trọn cho bạn?'], ['ra — recursion available', 'aa — authoritative answer', 'qr — this message is a response', 'ad — authenticated data'], ['rd ("recursion desired") is what dig asked for; ra is the server saying yes. qr only marks a reply, ad says DNSSEC checked out (lesson 3.5), and aa appears only when the zone\'s own server answers — here it is missing because a resolver answered.', 'rd ("muốn đệ quy") là thứ dig xin; ra là máy chủ đồng ý. qr chỉ đánh dấu đây là câu trả lời, ad nói DNSSEC đã kiểm đạt (bài 3.5), còn aa chỉ có khi chính máy chủ của vùng trả lời — ở đây không có vì resolver trả lời.']),
    q('c2', ['The ANSWER section has two lines. What does the first line tell the client?', 'Phần ANSWER có hai dòng. Dòng đầu nói gì với client?'], ['www.labflow.test is another name (CNAME) for labflow.test, whose address follows', 'www.labflow.test has two addresses, and the client may use either', 'The resolver could not find www, so it answered for labflow.test instead', 'labflow.test is the name server responsible for www.labflow.test'], ['A CNAME says "the real name is labflow.test — look that up". The resolver followed the alias itself and added the A record, so one answer is enough.', 'CNAME nói "tên thật là labflow.test — hãy tra tên đó". Resolver tự đi theo bí danh và gửi kèm bản ghi A, nên một câu trả lời là đủ.']),
    q('c3', ['What is the number 300 on both answer lines?', 'Con số 300 trên cả hai dòng trả lời là gì?'], ['The TTL: how many seconds this answer may be kept in a cache', 'The size of the answer in bytes', 'The priority of the record, lowest first', 'How many milliseconds the lookup took'], ['TTL = time to live, in seconds. A resolver that got it at 300 counts down from there (lesson 3.3). The time is on the "Query time" line.', 'TTL = thời gian sống, tính bằng giây. Resolver nhận nó ở 300 sẽ đếm ngược từ đó (bài 3.3). Thời gian nằm ở dòng "Query time".']),
    q('c4', ['13 msec the first time, 0 msec the second time. Why?', 'Lần đầu 13 msec, lần hai 0 msec. Vì sao?'], ['The second answer came from the resolver\'s cache', 'The laptop kept the answer and did not send a second query', 'The second time dig asked the authoritative server directly', 'The network was busy during the first query'], ['dig never caches; it sent a packet both times. The resolver walked root → TLD → LabFlow the first time and answered the second time from memory — exercise 2 shows the packets.', 'dig không bao giờ có cache; cả hai lần nó đều gửi gói. Lần đầu resolver đi gốc → TLD → LabFlow, lần hai trả lời từ bộ nhớ — bài 2 cho thấy các gói.']),
    q('c5', ['"SERVER: 198.51.100.1#53 (UDP)". Where did the laptop get that address?', '"SERVER: 198.51.100.1#53 (UDP)". Laptop lấy địa chỉ đó ở đâu?'], ['From the nameserver line of /etc/resolv.conf: the ISP\'s resolver', 'From the root servers, which assign a resolver to every laptop', 'From the NS records of labflow.test', 'It is the address of the home router, which answers every DNS query'], ['The stub (the small resolver library inside your machine) sends every question to the address in resolv.conf — usually handed out by DHCP. #53 is the port.', 'Stub (thư viện phân giải nhỏ trong máy bạn) gửi mọi câu hỏi tới địa chỉ trong resolv.conf — thường do DHCP cấp. #53 là cổng.']),
    q('c6', ['Every name ends with a dot: "www.labflow.test.". What is that dot?', 'Tên nào cũng kết thúc bằng dấu chấm: "www.labflow.test.". Dấu chấm đó là gì?'], ['The root of the DNS tree: the name is complete', 'A separator dig adds before the TTL', 'A sign that the name was found in a cache', 'A typo in the zone file that dig repairs'], ['A fully qualified name ends at the root, written as an empty label after the last dot. In a zone file a name WITHOUT the final dot is relative and gets the domain appended (lesson 3.2).', 'Tên đầy đủ kết thúc ở gốc, viết là một nhãn rỗng sau dấu chấm cuối. Trong tệp vùng, tên KHÔNG có dấu chấm cuối là tên tương đối và bị ghép thêm tên miền (bài 3.2).']),
  ],
  goiY: [['The header line gives the status, the flags line gives qr/rd/ra/aa/ad and the four counts.', 'Dòng header cho trạng thái, dòng flags cho qr/rd/ra/aa/ad và bốn con số đếm.'], ['Read the ANSWER section top to bottom: an alias first, then the record it points to.', 'Đọc phần ANSWER từ trên xuống: bí danh trước, rồi bản ghi nó trỏ tới.']],
  loi: [['Reading the 300 as a time measurement of the query.', 'Đọc 300 thành thời gian đo được của câu hỏi.'], ['Thinking dig keeps a cache: it does not, the resolver does.', 'Nghĩ dig có cache: không có, resolver mới có.']],
  tns: [tn('stub resolver', 'bộ phân giải đầu cuối', 'Thư viện trong máy bạn, chỉ biết gửi câu hỏi tới resolver.'), tn('recursive resolver', 'resolver đệ quy', 'Máy đi hỏi hộ từ gốc xuống và giữ cache.'), tn('CNAME', 'bí danh'), tn('TTL', 'thời gian sống của bản ghi trong cache')],
  kn: ['dig', 'DNS message'],
});

/* ── 2. Theo resolver từng gói ── */
const E2 = cs({
  ten: 'DNS 2 — Follow the resolver, packet by packet', kho: 'MEDIUM', phut: 12, loai: 'order',
  en: `While the laptop asked <code>www.labflow.test</code> twice (one second apart), we captured on the ISP's resolver (lab/out/c31-isp-doc; <code>dnsgoi.sh</code> prints one line per DNS packet). 198.51.100.2 is the house, 198.51.100.1 / 192.0.2.1 are the two sides of the resolver, 192.0.2.10 is the root, 192.0.2.20 the TLD <code>test.</code>, 203.0.113.53/.54 are LabFlow's two name servers.${pre(['$ ./dnsgoi.sh /tmp/r.pcap', ...GOI])}`,
  vi: `Trong lúc laptop hỏi <code>www.labflow.test</code> hai lần (cách nhau một giây), ta bắt gói trên resolver nhà mạng (lab/out/c31-isp-doc; <code>dnsgoi.sh</code> in mỗi gói DNS một dòng). 198.51.100.2 là ngôi nhà, 198.51.100.1 / 192.0.2.1 là hai phía của resolver, 192.0.2.10 là máy chủ gốc, 192.0.2.20 là TLD <code>test.</code>, 203.0.113.53/.54 là hai máy chủ tên của LabFlow.${pre(['$ ./dnsgoi.sh /tmp/r.pcap', ...GOI])}`,
  cau: [
    ord('o1', ['Put the first lookup in order, as the capture shows it.', 'Xếp lần tra đầu tiên theo đúng thứ tự trong bản bắt gói.'], [
      'The house asks the resolver for www.labflow.test',
      'The resolver asks the root, and the root refers it to the servers of test.',
      'The TLD refers it to ns1/ns2.labflow.test (a referral, no address yet)',
      'LabFlow\'s server answers with the records (flag aa)',
      'The resolver fetches the DNSKEY sets to check the signatures',
      'The resolver answers the house: NOERROR, two answers',
    ], ['The resolver starts from the only thing it knows — the root\'s address, built in — and each level points one step down. The DNSKEY lines are DNSSEC validation (lesson 3.5); only after that does the house get its answer at 0.0097 s.', 'Resolver bắt đầu từ thứ duy nhất nó biết — địa chỉ máy chủ gốc, có sẵn — và mỗi cấp chỉ xuống một bậc. Các dòng DNSKEY là kiểm DNSSEC (bài 3.5); chỉ sau đó nhà mới nhận câu trả lời, lúc 0,0097 s.']),
    ord('o2', ['Order the servers by how much of the name they know, from least to most.', 'Xếp các máy chủ theo mức hiểu biết về tên, từ ít nhất tới nhiều nhất.'], [
      'Root server (192.0.2.10): only who runs each TLD',
      'TLD server ns1.nic.test (192.0.2.20): who runs each domain under test.',
      'ns1/ns2.labflow.test: every record of labflow.test',
    ], ['Each level knows exactly one level down — that is delegation. Nobody holds the whole tree, which is why DNS scales to hundreds of millions of domains.', 'Mỗi cấp biết đúng một cấp bên dưới — đó là ủy quyền. Không ai giữ cả cây, nên DNS mở rộng được tới hàng trăm triệu tên miền.']),
    ord('o3', ['Order what happens from typing the URL to the first byte of HTTP.', 'Xếp các việc từ lúc gõ URL tới byte HTTP đầu tiên.'], [
      'getaddrinfo reads /etc/hosts (files before dns)',
      'The stub sends the question to the resolver in resolv.conf',
      'The resolver answers from its cache or walks the tree',
      'The client opens a TCP connection to the address it got',
    ], ['DNS finishes before any connection starts — a slow lookup delays everything after it (lesson 0.2: the "namelookup" stage of curl).', 'DNS xong trước khi bất kỳ kết nối nào bắt đầu — tra chậm thì mọi việc sau đều chậm (bài 0.2: chặng "namelookup" của curl).']),
  ],
  goiY: [['Follow the time column; a "referral" answer gives no address, only who to ask next.', 'Đi theo cột thời gian; câu trả lời "referral" không cho địa chỉ, chỉ cho biết hỏi ai tiếp.'], ['The second lookup at 1.0359 s produces no upstream packets at all.', 'Lần tra thứ hai lúc 1,0359 s không sinh ra gói nào đi lên trên.']],
  loi: [['Thinking the laptop talks to the root servers: only the resolver does.', 'Nghĩ laptop nói chuyện với máy chủ gốc: chỉ resolver làm việc đó.'], ['Reading a referral as an answer.', 'Đọc một referral thành câu trả lời.']],
  tns: [tn('referral', 'chỉ đường', 'Câu trả lời "tôi không biết, hỏi các máy này" kèm NS.'), tn('delegation', 'ủy quyền'), tn('iterative query', 'hỏi lần lượt')],
  kn: ['DNS resolution'],
});

/* ── 3. Tự làm việc của resolver ── */
const AI3 = ['root server', 'TLD server of test.', 'LabFlow\'s own name server', 'the ISP\'s resolver'];
const LOAI = ['referral (who to ask next)', 'final answer'];
const CO = ['yes', 'no'];
const E3 = cs({
  ten: 'DNS 3 — Do the resolver\'s job by hand', kho: 'MEDIUM', phut: 15, loai: 'table',
  en: `With <code>+norecurse</code> ("do not look it up for me") we asked each level ourselves (lab/out/c31-tay, banner lines removed):${pre(['$ dig @192.0.2.10 www.labflow.test +norecurse', ...gon(TAY1), '', '$ dig @192.0.2.20 www.labflow.test +norecurse', ...gon(TAY2), '', '$ dig @203.0.113.53 www.labflow.test +norecurse', ...gon(TAY3)])}Fill one row per server.`,
  vi: `Với <code>+norecurse</code> ("đừng tra hộ tôi") ta tự hỏi từng cấp (lab/out/c31-tay, đã bỏ các dòng tiêu đề):${pre(['$ dig @192.0.2.10 www.labflow.test +norecurse', ...gon(TAY1), '', '$ dig @192.0.2.20 www.labflow.test +norecurse', ...gon(TAY2), '', '$ dig @203.0.113.53 www.labflow.test +norecurse', ...gon(TAY3)])}Điền mỗi máy chủ một hàng.`,
  bang: [bang1('b1', ['Three servers, three kinds of answer', 'Ba máy chủ, ba kiểu trả lời'], [{ ma: 'x', ten: 'Server asked' }, { ma: 'w', ten: 'Who is it', luaChon: AI3 }, { ma: 'a', ten: 'aa flag?', luaChon: CO }, { ma: 'k', ten: 'Kind of answer', luaChon: LOAI }, { ma: 'n', ten: 'Next address to ask (or none)' }, { ma: 't', ten: 'TTL on its NS lines (s)' }], [
    { o: { x: '192.0.2.10' }, a: { w: AI3[0], a: 'no', k: LOAI[0], n: ['192.0.2.20'], t: ['172800'] } },
    { o: { x: '192.0.2.20' }, a: { w: AI3[1], a: 'no', k: LOAI[0], n: ['203.0.113.53', '203.0.113.54', '203.0.113.53 or 203.0.113.54', '203.0.113.53 / 203.0.113.54'], t: ['172800'] } },
    { o: { x: '203.0.113.53' }, a: { w: AI3[2], a: 'yes', k: LOAI[1], n: ['none', '-', '—', 'no one', 'nobody'], t: ['86400'] } },
  ], ['A referral has ANSWER: 0 and the next servers in AUTHORITY, their addresses ("glue") in ADDITIONAL. Only the zone\'s own server sets aa. Note the two TTLs for the same NS set: the parent\'s copy says 172800 (2 days), the child\'s own says 86400 — resolvers prefer the child\'s once they reach it, and lab 3 shows why a wrong parent copy hurts for days.', 'Referral có ANSWER: 0, các máy chủ kế tiếp nằm ở AUTHORITY, địa chỉ của chúng ("glue") ở ADDITIONAL. Chỉ máy chủ của chính vùng mới đặt aa. Để ý hai TTL cho cùng bộ NS: bản của vùng cha ghi 172800 (2 ngày), bản của chính vùng ghi 86400 — resolver ưu tiên bản của vùng con khi đã tới đó, và lab 3 cho thấy vì sao một bản sai ở vùng cha gây hại nhiều ngày.'])],
  goiY: [['ANSWER: 0 + NS lines in AUTHORITY = a referral.', 'ANSWER: 0 + dòng NS ở AUTHORITY = referral.'], ['The ADDITIONAL section gives the address of the next server — no extra lookup needed.', 'Phần ADDITIONAL cho địa chỉ máy chủ kế tiếp — không cần tra thêm.']],
  loi: [['Expecting the root to know the address of www.labflow.test.', 'Mong máy chủ gốc biết địa chỉ của www.labflow.test.'], ['Missing the aa flag: it is what separates the zone\'s server from a cache.', 'Bỏ sót cờ aa: chính nó phân biệt máy chủ của vùng với một bản cache.']],
  tns: [tn('authoritative server', 'máy chủ có thẩm quyền', 'Máy chủ giữ bản gốc của vùng.'), tn('glue record', 'bản ghi keo', 'Địa chỉ của máy chủ tên, gửi kèm referral.'), tn('+norecurse', 'không đệ quy')],
  kn: ['delegation', 'authoritative answer'],
});

/* ── 4. Phía stub ── */
const STUB = S('c31-stub', "grep '^hosts'").concat(['$ echo \'203.0.113.11 labflow.test   # added for testing, forgot to remove\' >> /etc/hosts', '$ getent ahosts labflow.test | head -1', ...S('c31-stub', 'getent ahosts labflow.test'), '$ dig +short labflow.test', ...S('c31-stub', 'dig +short labflow.test'), '$ node -e "… dns.lookup(…) … dns.resolve4(…)"', ...S('c31-stub', 'node -e')]);
const NDOTS = ['$ cat /etc/resolv.conf', 'nameserver 198.51.100.1', 'search labflow.test', 'options ndots:5', '$ getent ahostsv4 api | head -1', ...S('c31-ndots', 'getent ahostsv4 api'), '$ getent ahostsv4 labflow.cdn.test | head -1', ...S('c31-ndots', 'getent ahostsv4 labflow.cdn.test |'), '$ getent ahostsv4 labflow.cdn.test. | head -1', ...S('c31-ndots', 'getent ahostsv4 labflow.cdn.test. |'), '# every DNS answer the laptop received during the three commands', ...S('c31-ndots', 'tshark')];
const UBU = ['$ grep -v \'^#\' /etc/resolv.conf | grep .', ...S('c31-ubuntu', "grep -v '^#'"), '$ resolvectl status | sed -n \'1,4p\'', ...S('c31-ubuntu', 'resolvectl status')];
const E4 = cs({
  ten: 'DNS 4 — The stub side: hosts file, search domains, local caches', kho: 'MEDIUM', phut: 14,
  en: `Three real experiments on the client side (lab/out/c31-stub, c31-ndots, c31-ubuntu):${pre(['# 1) the hosts file', '$ grep \'^hosts\' /etc/nsswitch.conf', ...STUB, '', '# 2) search + ndots', ...NDOTS, '', '# 3) an Ubuntu machine with systemd-resolved', ...UBU])}`,
  vi: `Ba thí nghiệm thật ở phía client (lab/out/c31-stub, c31-ndots, c31-ubuntu):${pre(['# 1) tệp hosts', '$ grep \'^hosts\' /etc/nsswitch.conf', ...STUB, '', '# 2) search + ndots', ...NDOTS, '', '# 3) máy Ubuntu có systemd-resolved', ...UBU])}`,
  cau: [
    q('c1', ['getent and curl get 203.0.113.11, dig gets 203.0.113.10. Why?', 'getent và curl nhận 203.0.113.11, dig nhận 203.0.113.10. Vì sao?'], ['"hosts: files dns": the system reads /etc/hosts first; dig asks DNS directly', 'dig uses IPv6 and the others use IPv4', 'The resolver gives a different answer to each program', 'curl caches old answers and dig does not'], ['A forgotten hosts line wins over DNS for every program that uses getaddrinfo (curl, browsers, most languages). dig and nslookup skip it — so "dig says it is fine" proves nothing about what your app sees.', 'Một dòng hosts bị quên thắng DNS với mọi chương trình dùng getaddrinfo (curl, trình duyệt, hầu hết ngôn ngữ). dig và nslookup bỏ qua nó — nên "dig nói ổn" không chứng minh gì về thứ ứng dụng thấy.']),
    q('c2', ['In Node, dns.lookup gave .11 and dns.resolve4 gave .10. What is the difference?', 'Trong Node, dns.lookup cho .11 còn dns.resolve4 cho .10. Khác nhau ở đâu?'], ['lookup goes through getaddrinfo (hosts file included); resolve4 sends a DNS query itself', 'resolve4 is the newer API and ignores old records', 'lookup asks the root servers, resolve4 asks the resolver', 'lookup returns a random address from the answer'], ['http.get, fetch and most libraries call dns.lookup — they behave like curl. resolve*() talk to the DNS servers directly, like dig.', 'http.get, fetch và hầu hết thư viện gọi dns.lookup — chúng cư xử như curl. resolve*() nói chuyện thẳng với máy chủ DNS, như dig.']),
    q('c3', ['With "search labflow.test" and "ndots:5", why was labflow.cdn.test.labflow.test asked first?', 'Với "search labflow.test" và "ndots:5", vì sao labflow.cdn.test.labflow.test bị hỏi trước?'], ['The name has fewer than 5 dots, so the search domain is tried before the name itself', 'The resolver adds the search domain to every name it receives', 'labflow.cdn.test does not exist until labflow.test is asked', 'getent always tries the longest name first'], ['ndots:N means "a name with fewer than N dots is probably short — try the search list first". labflow.cdn.test has 2 dots, so one useless query (NXDOMAIN) came first. Kubernetes pods use ndots:5.', 'ndots:N nghĩa là "tên có ít hơn N dấu chấm chắc là tên ngắn — thử danh sách search trước". labflow.cdn.test có 2 dấu chấm, nên một câu hỏi vô ích (NXDOMAIN) đi trước. Pod Kubernetes dùng ndots:5.']),
    q('c4', ['How many DNS questions did the form with a final dot, "labflow.cdn.test.", cost?', 'Dạng có dấu chấm cuối, "labflow.cdn.test.", tốn bao nhiêu câu hỏi DNS?'], ['One: a final dot skips the search list', 'Two, like the form without the dot', 'None: it was answered from /etc/hosts', 'Three: one per label of the name'], ['Count the answers: 1 for api, 2 for labflow.cdn.test, 1 for labflow.cdn.test. The final dot is the cheap fix for ndots traffic.', 'Đếm các câu trả lời: 1 cho api, 2 cho labflow.cdn.test, 1 cho labflow.cdn.test. Dấu chấm cuối là cách rẻ để cắt lưu lượng do ndots.']),
    q('c5', ['On Ubuntu, resolv.conf says nameserver 127.0.0.53. Which server really answers the questions?', 'Trên Ubuntu, resolv.conf ghi nameserver 127.0.0.53. Máy chủ nào thật sự trả lời các câu hỏi?'], ['systemd-resolved, a local cache on the machine, which forwards to 198.51.100.1', '127.0.0.53, a public resolver run by Ubuntu', 'The machine itself walks from the root servers', 'Nobody: 127.0.0.53 is a placeholder and DNS is disabled'], ['127.0.0.53 is a loopback address: a local cache listens there. To see the real upstream server, run resolvectl status — and remember that this cache is one more layer that can hold an old answer (lesson 3.3).', '127.0.0.53 là địa chỉ loopback: một bộ đệm cục bộ lắng nghe ở đó. Muốn thấy máy chủ thật phía trên, chạy resolvectl status — và nhớ bộ đệm này thêm một lớp có thể giữ câu trả lời cũ (bài 3.3).']),
    q('c6', ['A pod in Kubernetes (search default.svc.cluster.local svc.cluster.local cluster.local, ndots:5) calls api.example.com. What happens first?', 'Một pod Kubernetes (search default.svc.cluster.local svc.cluster.local cluster.local, ndots:5) gọi api.example.com. Điều gì xảy ra trước?'], ['Three queries with the search domains appended fail before api.example.com itself is asked', 'api.example.com is asked first, because it contains dots', 'The pod asks the cluster DNS once and it forwards the right name', 'The call fails, because external names need a trailing dot'], ['api.example.com has 2 dots < 5, so every external call costs three NXDOMAIN lookups first (doubled for A and AAAA). Fixes: a trailing dot in the URL, or lower ndots in the pod\'s dnsConfig. Exercise 5 computes this.', 'api.example.com có 2 dấu chấm < 5, nên mỗi lần gọi ra ngoài tốn ba lần NXDOMAIN trước (nhân đôi cho A và AAAA). Cách sửa: dấu chấm cuối trong URL, hoặc hạ ndots trong dnsConfig của pod. Bài 5 tính chuyện này.']),
  ],
  goiY: [['Programs that call getaddrinfo follow nsswitch.conf; dig and resolve*() do not.', 'Chương trình gọi getaddrinfo đi theo nsswitch.conf; dig và resolve*() thì không.'], ['Count the dots in the name and compare with ndots.', 'Đếm dấu chấm trong tên rồi so với ndots.']],
  loi: [['Debugging with dig while the app reads /etc/hosts.', 'Gỡ lỗi bằng dig trong khi ứng dụng đọc /etc/hosts.'], ['Believing 127.0.0.53 is the real DNS server.', 'Tin 127.0.0.53 là máy chủ DNS thật.']],
  tns: [tn('nsswitch.conf', 'thứ tự nguồn tra tên'), tn('search domain', 'tên miền tìm kèm'), tn('ndots', 'ngưỡng số dấu chấm'), tn('systemd-resolved', 'bộ đệm DNS cục bộ của Ubuntu')],
  kn: ['getaddrinfo', 'search list'],
});

/* ── 5. searchOrder + queriesFor ── */
/** Danh sách tên stub thử, theo luật glibc (res_search). */
function searchOrder(name, conf) {
  var c = conf || {};
  var ndots = c.ndots === undefined ? 1 : c.ndots;
  var search = (c.search || []).filter(function (d) { return d && d !== '.'; }).map(function (d) { return d.replace(/\.$/, ''); });
  if (name.slice(-1) === '.') return [name.slice(0, -1)];          // absolute: the search list is never used
  var dots = name.split('.').length - 1;
  var withSearch = search.map(function (d) { return name + '.' + d; });
  return dots >= ndots ? [name].concat(withSearch) : withSearch.concat([name]);
}
/** Số câu hỏi (một tên = một câu) tới khi gặp tên có trong `existing`. */
function queriesFor(name, conf, existing) {
  var order = searchOrder(name, conf);
  for (var i = 0; i < order.length; i++) {
    if (existing.indexOf(order[i]) >= 0) return { answer: order[i], queries: i + 1 };
  }
  return { answer: null, queries: order.length };
}
const LAB = { search: ['labflow.test'], ndots: 5 };
const K8S = { search: ['default.svc.cluster.local', 'svc.cluster.local', 'cluster.local'], ndots: 5 };
const CO_THAT = ['api.labflow.test', 'labflow.cdn.test', 'labflow.test', 'www.labflow.test'];
const E5 = jsBai({
  ten: 'DNS 5 — Write searchOrder() and queriesFor(): what ndots costs', kho: 'MEDIUM', phut: 22,
  en: `<p>The stub decides which full names to ask, in which order, from <code>search</code> and <code>ndots</code> in resolv.conf. Real proof (lab/out/c31-ndots):</p>${pre(NDOTS)}
<p>Write <code>searchOrder(name, conf)</code> — <code>conf = { search: [...], ndots }</code> — returning the names tried, in order, <b>without</b> a final dot. glibc's rules:</p>
<ul><li>a name ending in <code>.</code> is absolute: only that name (dot removed) is tried;</li>
<li>count the dots in the name: if <code>dots &gt;= ndots</code>, try the name itself first, then the name + each search domain;</li>
<li>otherwise try the name + each search domain first, and the name itself <b>last</b>;</li>
<li><code>ndots</code> defaults to 1; search entries <code>"."</code> (Ubuntu writes <code>search .</code>) are ignored, a final dot on a search domain is dropped.</li></ul>
<p>Then <code>queriesFor(name, conf, existing)</code>: walk that order and return <code>{ answer, queries }</code> — the first name present in the array <code>existing</code>, and how many names were asked to get there (one query per name; real clients often double it, A + AAAA). If none exists: <code>{ answer: null, queries: &lt;all of them&gt; }</code>.</p>`,
  vi: `<p>Stub quyết định hỏi những tên đầy đủ nào, theo thứ tự nào, dựa trên <code>search</code> và <code>ndots</code> trong resolv.conf. Bằng chứng thật (lab/out/c31-ndots):</p>${pre(NDOTS)}
<p>Viết <code>searchOrder(name, conf)</code> — <code>conf = { search: [...], ndots }</code> — trả về các tên được thử, theo thứ tự, <b>không</b> có dấu chấm cuối. Luật của glibc:</p>
<ul><li>tên kết thúc bằng <code>.</code> là tên tuyệt đối: chỉ thử đúng tên đó (bỏ dấu chấm);</li>
<li>đếm dấu chấm trong tên: nếu <code>dots &gt;= ndots</code>, thử chính tên trước, rồi tên + từng search domain;</li>
<li>ngược lại thử tên + từng search domain trước, và chính tên <b>cuối cùng</b>;</li>
<li><code>ndots</code> mặc định 1; mục search <code>"."</code> (Ubuntu ghi <code>search .</code>) bị bỏ qua, dấu chấm cuối của search domain được bỏ.</li></ul>
<p>Rồi <code>queriesFor(name, conf, existing)</code>: đi theo thứ tự đó, trả <code>{ answer, queries }</code> — tên đầu tiên có trong mảng <code>existing</code>, và đã hỏi bao nhiêu tên mới tới được (mỗi tên một câu hỏi; client thật thường nhân đôi, A + AAAA). Không tên nào có: <code>{ answer: null, queries: &lt;tất cả&gt; }</code>.</p>`,
  dauVao: ['name — a host name; conf — { search, ndots }; existing — array of names that exist.', 'name — tên máy; conf — { search, ndots }; existing — mảng các tên có thật.'],
  dauRa: ['searchOrder: array of names; queriesFor: { answer, queries }.', 'searchOrder: mảng tên; queriesFor: { answer, queries }.'],
  goiY: [['Dots: name.split(".").length - 1.', 'Số dấu chấm: name.split(".").length - 1.'], ['Build the list "name + each search domain" once, then put the bare name in front or at the back.', 'Dựng danh sách "tên + từng search domain" một lần, rồi đặt tên trần ở đầu hoặc ở cuối.']],
  loi: [['Applying the search list to a name that ends with a dot.', 'Áp danh sách search cho tên kết thúc bằng dấu chấm.'], ['Forgetting the bare name at the end when dots < ndots.', 'Quên tên trần ở cuối khi dots < ndots.'], ['Comparing dots > ndots instead of dots >= ndots.', 'So dots > ndots thay vì dots >= ndots.']],
  gt: ['The stub cannot know whether "api" means api.labflow.test or a top-level name, so glibc guesses by counting dots. The guess costs real round trips: every failed candidate is a full query to the resolver, often two (A and AAAA). That is the hidden latency of ndots:5 in Kubernetes, and the reason a trailing dot or a lower ndots makes external calls faster.', 'Stub không biết "api" là api.labflow.test hay một tên cấp cao nhất, nên glibc đoán bằng cách đếm dấu chấm. Phép đoán tốn lượt đi về thật: mỗi ứng viên hỏng là một câu hỏi trọn vẹn tới resolver, thường là hai (A và AAAA). Đó là độ trễ ẩn của ndots:5 trong Kubernetes, và là lý do dấu chấm cuối hay ndots thấp hơn làm lời gọi ra ngoài nhanh hơn.'],
  kn: ['search list', 'ndots'],
  tns: [tn('absolute name / FQDN', 'tên tuyệt đối'), tn('relative name', 'tên tương đối'), tn('NXDOMAIN', 'tên không tồn tại')],
  dau: `/** Names the stub tries, in order (no final dot). conf = { search: [...], ndots } */
function searchOrder(name, conf) {
  // Write your solution here
  return [name];
}

/** First existing name and how many names were asked. */
function queriesFor(name, conf, existing) {
  // Write your solution here
  return { answer: null, queries: 0 };
}
`,
  giai: nguon(searchOrder, queriesFor),
  cases: [
    { goi: goi('searchOrder', 'api', LAB), moTa: ['Real: "api" with ndots:5 (c31-ndots)', 'Thật: "api" với ndots:5 (c31-ndots)'] },
    { goi: goi('searchOrder', 'labflow.cdn.test', LAB), moTa: ['Real: 2 dots < 5 — the search domain first', 'Thật: 2 dấu chấm < 5 — search domain trước'] },
    { goi: goi('searchOrder', 'labflow.cdn.test.', LAB), moTa: ['Real: a final dot — no search', 'Thật: có dấu chấm cuối — không search'] },
    { goi: goi('queriesFor', 'labflow.cdn.test', LAB, CO_THAT), moTa: ['Real: two queries, as tshark counted', 'Thật: hai câu hỏi, đúng như tshark đếm'] },
    { goi: goi('searchOrder', 'api.example.com', K8S), an: true },
    { goi: goi('queriesFor', 'api.example.com', K8S, ['api.example.com']), an: true },
    { goi: goi('queriesFor', 'api.example.com.', K8S, ['api.example.com']), an: true },
    { goi: goi('searchOrder', 'a.b.c.d.e.f', K8S), an: true },
    { goi: goi('searchOrder', 'db', { search: ['corp.example.'] }), an: true },
    { goi: goi('searchOrder', 'www.labflow.test', { search: ['.'], ndots: 1 }), an: true },
    { goi: goi('queriesFor', 'nope', LAB, CO_THAT), an: true },
    { goi: goi('queriesFor', 'redis', K8S, ['redis.svc.cluster.local', 'redis.cluster.local']), an: true },
  ],
});

/* ── 6. clientWaits(): đọc bản in dnsgoi ── */
/** Mỗi câu hỏi client gửi: chờ bao lâu, resolver đã phải hỏi lên trên bao nhiêu lần, kết quả gì. */
function clientWaits(text, client) {
  var rows = [];
  String(text).split('\n').forEach(function (line) {
    var w = line.trim().split(/\s+/);
    if (!/^\d+(\.\d+)?$/.test(w[0]) || w[2] !== '→') return;         // header, prompt and other lines
    rows.push({ t: Number(w[0]), from: w[1], to: w[3], msg: w[4], name: w[5], type: w[6], rcode: w[7] || null });
  });
  var out = [];
  rows.forEach(function (r, i) {
    if (r.from !== client || r.msg !== 'query') return;
    var up = 0, ans = null;
    for (var j = i + 1; j < rows.length; j++) {
      var s = rows[j];
      if (s.msg === 'answer' && s.to === client && s.name === r.name && s.type === r.type) { ans = s; break; }
      if (s.msg === 'query' && s.from !== client) up++;
    }
    out.push({
      name: r.name, type: r.type,
      ms: ans ? Math.round((ans.t - r.t) * 1000 * 10) / 10 : null,
      upstream: up,
      result: ans ? ans.rcode : 'TIMEOUT',
    });
  });
  return out;
}
const GOI_TXT = GOI.join('\n');
// DỰNG (ghi rõ trong đề): laptop hỏi A + AAAA của một tên chưa có trong cache, rồi một tên không tồn tại, rồi một câu không bao giờ được trả lời.
const DUNG = [
  '   t(s)  from              to              msg     name                 type   result',
  ' 0.0000  198.51.100.2    → 198.51.100.1    query   api.labflow.test     A      ',
  ' 0.0001  198.51.100.2    → 198.51.100.1    query   api.labflow.test     AAAA   ',
  ' 0.0004  192.0.2.1       → 203.0.113.53    query   api.labflow.test     A      ',
  ' 0.0005  192.0.2.1       → 203.0.113.53    query   api.labflow.test     AAAA   ',
  ' 0.0016  203.0.113.53    → 192.0.2.1       answer  api.labflow.test     A      NOERROR aa answers=1',
  ' 0.0018  198.51.100.1    → 198.51.100.2    answer  api.labflow.test     A      NOERROR answers=1',
  ' 0.0019  203.0.113.53    → 192.0.2.1       answer  api.labflow.test     AAAA   NOERROR aa',
  ' 0.0021  198.51.100.1    → 198.51.100.2    answer  api.labflow.test     AAAA   NOERROR',
  ' 2.5000  198.51.100.2    → 198.51.100.1    query   nope.labflow.test    A      ',
  ' 2.5004  192.0.2.1       → 203.0.113.54    query   nope.labflow.test    A      ',
  ' 2.5013  203.0.113.54    → 192.0.2.1       answer  nope.labflow.test    A      NXDOMAIN aa',
  ' 2.5015  198.51.100.1    → 198.51.100.2    answer  nope.labflow.test    A      NXDOMAIN',
  ' 4.0000  198.51.100.2    → 198.51.100.1    query   x1.dead.test         A      ',
  ' 4.0003  192.0.2.1       → 203.0.113.99    query   x1.dead.test         A      ',
  ' 6.0010  192.0.2.1       → 203.0.113.99    query   x1.dead.test         A      ',
].join('\n');
const E6 = jsBai({
  ten: 'DNS 6 — Write clientWaits(): how long did the client wait, and why?', kho: 'HARD', phut: 30,
  en: `<p>Turn the resolver's capture into numbers a developer cares about. The real capture of exercise 2 (lab/out/c31-isp-doc):</p>${pre(GOI)}
<p>Write <code>clientWaits(text, client)</code>. Lines that start with a time and have <code>→</code> as the third word are packets: <code>t from → to msg name type [result…]</code> (other lines are ignored). For every packet <b>sent by</b> <code>client</code> with msg <code>query</code>, in order, return:</p>
<pre>{ name, type, ms, upstream, result }</pre>
<ul><li>the matching answer is the first later <code>answer</code> packet <b>to</b> <code>client</code> with the same name and type;</li>
<li><code>ms</code> = (answer time − query time) in milliseconds, rounded to one decimal (<code>Math.round(x * 10) / 10</code>);</li>
<li><code>upstream</code> = how many <code>query</code> packets sent by <b>anyone other than</b> <code>client</code> appear between the query and its answer (the work the resolver did for it);</li>
<li><code>result</code> = the first word after the type in the answer (<code>NOERROR</code>, <code>NXDOMAIN</code>, <code>SERVFAIL</code>…);</li>
<li>no answer before the end of the capture: <code>ms: null</code>, <code>result: "TIMEOUT"</code>, and <code>upstream</code> counted to the end.</li></ul>
<p>On the real capture: <code>[{ name: "www.labflow.test", type: "A", ms: 9.7, upstream: 9, result: "NOERROR" }, { …, ms: 0.1, upstream: 0, … }]</code> — the cost of an empty cache, then of a full one. A hidden case uses a <b>constructed</b> capture (A and AAAA asked together, an NXDOMAIN, a dead name server).</p>`,
  vi: `<p>Biến bản bắt gói của resolver thành những con số lập trình viên quan tâm. Bản bắt thật của bài 2 (lab/out/c31-isp-doc):</p>${pre(GOI)}
<p>Viết <code>clientWaits(text, client)</code>. Dòng bắt đầu bằng thời gian và có <code>→</code> là chữ thứ ba là một gói: <code>t from → to msg name type [kết quả…]</code> (dòng khác bỏ qua). Với mỗi gói <code>query</code> <b>do</b> <code>client</code> gửi, theo thứ tự, trả về:</p>
<pre>{ name, type, ms, upstream, result }</pre>
<ul><li>câu trả lời tương ứng là gói <code>answer</code> đầu tiên về sau gửi <b>tới</b> <code>client</code> có cùng name và type;</li>
<li><code>ms</code> = (thời điểm trả lời − thời điểm hỏi) tính bằng mili giây, làm tròn một chữ số thập phân (<code>Math.round(x * 10) / 10</code>);</li>
<li><code>upstream</code> = số gói <code>query</code> do <b>bất kỳ ai khác</b> <code>client</code> gửi nằm giữa câu hỏi và câu trả lời (phần việc resolver làm cho nó);</li>
<li><code>result</code> = chữ đầu tiên sau type trong câu trả lời (<code>NOERROR</code>, <code>NXDOMAIN</code>, <code>SERVFAIL</code>…);</li>
<li>tới hết bản bắt vẫn không có trả lời: <code>ms: null</code>, <code>result: "TIMEOUT"</code>, và <code>upstream</code> đếm tới cuối.</li></ul>
<p>Trên bản bắt thật: <code>[{ name: "www.labflow.test", type: "A", ms: 9.7, upstream: 9, result: "NOERROR" }, { …, ms: 0.1, upstream: 0, … }]</code> — giá của cache rỗng, rồi của cache đầy. Một ca ẩn dùng bản bắt <b>dựng</b> (A và AAAA hỏi cùng lúc, một NXDOMAIN, một máy chủ tên chết).</p>`,
  dauVao: ['text — dnsgoi.sh output; client — the client\'s IP.', 'text — output của dnsgoi.sh; client — IP của client.'],
  dauRa: ['Array of { name, type, ms, upstream, result }.', 'Mảng { name, type, ms, upstream, result }.'],
  goiY: [['Parse every packet line into an object first, then work on the array.', 'Phân tích mọi dòng gói thành object trước, rồi mới làm việc trên mảng.'], ['For each client query, scan forward: count other hosts\' queries until you meet the matching answer.', 'Với mỗi câu hỏi của client, quét tới: đếm câu hỏi của máy khác cho tới khi gặp câu trả lời khớp.']],
  loi: [['Matching by name only: A and AAAA of the same name are two separate questions.', 'Khớp chỉ theo tên: A và AAAA của cùng một tên là hai câu hỏi riêng.'], ['Counting the resolver\'s answers as upstream work, or counting the client\'s own second query.', 'Đếm câu trả lời của resolver là việc phía trên, hoặc đếm câu hỏi thứ hai của chính client.'], ['Rounding 0.1 ms to 0 by using Math.round(x) instead of one decimal.', 'Làm tròn 0,1 ms thành 0 vì dùng Math.round(x) thay vì một chữ số thập phân.']],
  gt: ['The client only ever sees one round trip to its resolver; everything else is hidden work that the resolver does on a cache miss. Counting that work explains the 13 ms vs 0 ms of exercise 1, and the same function flags the dangerous case: a question that never gets an answer because the name server behind it is dead — the client just waits (lesson 3.5 measures 20 s).', 'Client chỉ thấy một lượt đi về tới resolver của nó; mọi thứ khác là phần việc ẩn resolver làm khi trượt cache. Đếm phần việc đó giải thích 13 ms với 0 ms của bài 1, và cùng hàm này bắt được trường hợp nguy hiểm: một câu hỏi không bao giờ có trả lời vì máy chủ tên phía sau đã chết — client chỉ biết chờ (bài 3.5 đo được 20 s).'],
  kn: ['cache miss', 'resolver work'],
  tns: [tn('cache hit / miss', 'trúng / trượt cache'), tn('upstream query', 'câu hỏi đi lên trên'), tn('timeout', 'hết giờ chờ')],
  dau: `/** dnsgoi.sh text ⇒ [{ name, type, ms, upstream, result }] for every query sent by client */
function clientWaits(text, client) {
  // Write your solution here
  return [];
}
`,
  giai: nguon(clientWaits),
  cases: [
    { goi: goi('clientWaits', GOI_TXT, '198.51.100.2'), moTa: ['Real capture: empty cache, then full cache', 'Bản bắt thật: cache rỗng, rồi cache đầy'] },
    { goi: goi('clientWaits', GOI_TXT, '192.0.2.1').replace(/^/, '') + '.length', moTa: ['The resolver\'s own queries (192.0.2.1) — how many?', 'Câu hỏi của chính resolver (192.0.2.1) — bao nhiêu?'] },
    { goi: goi('clientWaits', DUNG, '198.51.100.2'), an: true },
    { goi: goi('clientWaits', GOI_TXT, '10.9.9.9'), an: true },
    { goi: goi('clientWaits', GOI.slice(0, 13).join('\n'), '198.51.100.2'), an: true },
  ],
});

export default doiDau({ slug: 'netdev-3-1-phan-giai', ten: '3.1 Resolution: stub, recursive resolver, root, TLD, authoritative', khoa: KHOA, baiHoc: 'netdev-3-1-phan-giai', de: [E1, E2, E3, E4, E5, E6] });
