/** Networking for Developers · 3.4 — Anycast (BGP thật, rút một điểm), GeoDNS theo resolver (view của BIND, ECS), round robin với máy chết (curl/Python/Node), Cloudflare proxy; tự viết bgpBest() và geoAnswer(). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre, ra } from './_net.mjs';

const tr = (ds) => ds.map((d) => d.replace(/\s+$/, ''));
const T = (tep) => tr(ra(tep).split('\n').slice(1)).filter((d) => d.trim());
const ANY = T('c34-anycast'), ANYDC = T('c34-anycast-dc'), BGP = T('c34-bgp'), RUT = T('c34-pop1-rut'), THEO = T('c34-theo-doc');
const GEO = T('c34-geo'), GEODC = T('c34-geo-dc'), GEOSAI = T('c34-geo-sai');
const RR = T('c34-rr').map((d) => (d.length > 150 ? `${d.slice(0, 147)}…` : d)), RRTHU = T('c34-rr-thu'), THAT = T('c34-that');
const CDN = fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../courses/networking-for-developers/lab/moi-truong/dns/named-cdn.conf'), 'utf8').split('\n').filter((d) => /^(acl|view)/.test(d));
const BGP_TXT = BGP.filter((d) => !d.startsWith('$')).join('\n');
if (CDN.length !== 3 || !BGP_TXT.includes('best (AS Path)') || THEO.length !== 11) throw new Error('3.4: output thật đổi');

/* ── 1. Anycast ── */
const E1 = cs({
  ten: 'Anycast 1 — One address, two cities', kho: 'EASY', phut: 12,
  en: `The public DNS 198.19.1.1 runs in two places: pop1 "Hanoi" and pop2 "Singapore", both announcing 198.19.1.0/24 with BGP from AS64530 (lab/out/c34-anycast, c34-anycast-dc, c34-bgp, c34-pop1-rut, c34-theo-doc):${pre(['# from the laptop at home', ...ANY, '', '# from the server in the datacenter', ...ANYDC, '', '# on the ISP\'s router', ...BGP, '', '# on pop1', ...RUT, '', '# the laptop, asking id.server every second', ...THEO])}`,
  vi: `DNS công cộng 198.19.1.1 chạy ở hai nơi: pop1 "Hà Nội" và pop2 "Singapore", cả hai quảng bá 198.19.1.0/24 bằng BGP từ AS64530 (lab/out/c34-anycast, c34-anycast-dc, c34-bgp, c34-pop1-rut, c34-theo-doc):${pre(['# từ laptop ở nhà', ...ANY, '', '# từ máy chủ trong datacenter', ...ANYDC, '', '# trên router nhà mạng', ...BGP, '', '# trên pop1', ...RUT, '', '# laptop, hỏi id.server mỗi giây', ...THEO])}`,
  cau: [
    q('c1', ['The laptop and the server ask the same address and get different machines. What decided?', 'Laptop và máy chủ hỏi cùng một địa chỉ mà gặp hai máy khác nhau. Cái gì quyết định?'], ['Routing: each router sends packets to the nearest announcement of 198.19.1.0/24', 'DNS: 198.19.1.1 resolves to a different machine for each client', 'The client: it picks the city with the lowest ping', 'A load balancer in front of both machines'], ['Anycast is plain routing. The ISP router\'s best path is AS64530 directly (pop1); the DC router\'s best path is pop2. Nothing in DNS or in the client is involved.', 'Anycast chỉ là định tuyến bình thường. Đường tốt nhất của router nhà mạng là AS64530 trực tiếp (pop1); của router DC là pop2. DNS hay client không dính dáng gì.']),
    q('c2', ['Why is the path "64530" chosen over "64510 64530" on the ISP router?', 'Vì sao đường "64530" được chọn thay cho "64510 64530" trên router nhà mạng?'], ['Shorter AS path: one network instead of two', 'The lower AS number always wins in BGP', 'It was the first path the router learned', 'pop1 is connected through a faster link'], ['"best (AS Path)" — FRR even prints the reason. The second path goes through the datacenter\'s AS64510 first.', '"best (AS Path)" — FRR in luôn lý do. Đường thứ hai đi qua AS64510 của datacenter trước.']),
    q('c3', ['pop1 withdrew at 16:22:56; the next second pop2 answered. What did clients have to change?', 'pop1 rút lúc 16:22:56; giây sau pop2 trả lời. Client phải đổi gì?'], ['Nothing: same address, same config; the routers switched paths', 'Their resolv.conf, to the Singapore address', 'They had to wait for a DNS TTL to expire', 'They had to reconnect with a new TLS certificate'], ['This is why root servers and public resolvers are anycast: failover in about a second, invisible to clients. Long TCP connections can break if a route change moves them mid-way (RFC 4786); DNS over UDP does not care.', 'Đó là lý do máy chủ gốc và resolver công cộng dùng anycast: chuyển dự phòng trong khoảng một giây, client không hề hay biết. Kết nối TCP dài có thể đứt nếu đổi tuyến giữa chừng (RFC 4786); DNS trên UDP thì không sao.']),
    q('c4', ['How does "dig @198.19.1.1 id.server CH TXT" help when debugging?', '"dig @198.19.1.1 id.server CH TXT" giúp gì khi gỡ lỗi?'], ['It tells you which instance of an anycast service you are reaching', 'It shows the server\'s software version for security audits', 'It forces the query to the primary server', 'It measures the round-trip time to every instance'], ['Same trick as the root servers in lesson 3.1. Your view of an anycast service depends on where you stand — always note which instance answered.', 'Cùng mẹo với máy chủ gốc ở bài 3.1. Thứ bạn thấy của một dịch vụ anycast tuỳ vào chỗ bạn đứng — luôn ghi lại bản nào đã trả lời.']),
  ],
  goiY: [['Anycast = the same prefix announced from several places.', 'Anycast = cùng một dải được quảng bá từ nhiều nơi.'], ['In "show ip bgp", each path starts with its AS path line.', 'Trong "show ip bgp", mỗi đường bắt đầu bằng dòng AS path của nó.']],
  loi: [['Thinking anycast is a DNS feature.', 'Nghĩ anycast là tính năng của DNS.'], ['Testing an anycast service from one place and assuming everyone sees the same.', 'Thử dịch vụ anycast từ một chỗ rồi mặc định ai cũng thấy như vậy.']],
  tns: [tn('anycast', 'một địa chỉ, nhiều nơi'), tn('PoP', 'điểm hiện diện'), tn('withdraw', 'rút quảng bá'), tn('AS path', 'chuỗi AS')],
  kn: ['anycast', 'BGP best path'],
});

/* ── 2. GeoDNS: ai thấy gì ── */
const BAN = ['pop1 Hanoi', 'pop2 Singapore', 'not used (ISP resolver)'];
const BIEN = ['Hanoi edge', 'Singapore edge'];
const E2 = cs({
  ten: 'Anycast 2 — GeoDNS: who gets which edge?', kho: 'MEDIUM', phut: 15, loai: 'table',
  en: `static.labflow.test is a CNAME to labflow.cdn.test; the CDN's name server ns1.cdn.test chooses the answer with BIND views (lab/moi-truong/dns/named-cdn.conf):${pre(CDN)}Real output (lab/out/c34-geo, c34-geo-dc, c34-geo-sai):${pre(['# laptop (Vietnam), pop1 up', ...GEO, '', '# ns2 in the datacenter (its nearest public DNS is pop2)', ...GEODC, '', '# laptop, after pop1 withdrew', ...GEOSAI])}`,
  vi: `static.labflow.test là CNAME sang labflow.cdn.test; máy chủ tên của CDN ns1.cdn.test chọn câu trả lời bằng view của BIND (lab/moi-truong/dns/named-cdn.conf):${pre(CDN)}Output thật (lab/out/c34-geo, c34-geo-dc, c34-geo-sai):${pre(['# laptop (Việt Nam), pop1 đang chạy', ...GEO, '', '# ns2 trong datacenter (DNS công cộng gần nhất là pop2)', ...GEODC, '', '# laptop, sau khi pop1 rút', ...GEOSAI])}`,
  bang: [bang1('b1', ['Fill one row per situation', 'Điền mỗi tình huống một hàng'], [{ ma: 'x', ten: 'Who asks, through which resolver' }, { ma: 'p', ten: 'Copy of 198.19.1.1 used', luaChon: BAN }, { ma: 'r', ten: 'Address the CDN sees asking (resolver)' }, { ma: 'a', ten: 'Answer for labflow.cdn.test' }, { ma: 'e', ten: 'Edge reached', luaChon: BIEN }], [
    { o: { x: 'laptop → ISP resolver' }, a: { p: BAN[2], r: ['192.0.2.1'], a: ['203.0.113.10'], e: BIEN[0] } },
    { o: { x: 'laptop → 198.19.1.1, pop1 up' }, a: { p: BAN[0], r: ['192.0.2.30'], a: ['203.0.113.10'], e: BIEN[0] } },
    { o: { x: 'ns2 (datacenter) → 198.19.1.1' }, a: { p: BAN[1], r: ['198.19.255.2'], a: ['203.0.113.11'], e: BIEN[1] } },
    { o: { x: 'laptop → 198.19.1.1, pop1 withdrawn' }, a: { p: BAN[1], r: ['198.19.255.2'], a: ['203.0.113.11'], e: BIEN[1] } },
  ], ['The CDN never sees the laptop: it sees the resolver that asks on its behalf — 192.0.2.1 is the outside address of the ISP resolver, 192.0.2.30 is pop1, 198.19.255.2 is pop2 (all in named-cdn.conf). The last row is the trap: the user did not move, but their resolver did, so a Vietnamese user is sent to Singapore. EDNS Client Subnet (RFC 7871) fixes this by passing part of the user\'s address, at a privacy cost — 1.1.1.1 does not send it.', 'CDN không bao giờ thấy laptop: nó thấy resolver hỏi thay — 192.0.2.1 là địa chỉ phía ngoài của resolver nhà mạng, 192.0.2.30 là pop1, 198.19.255.2 là pop2 (đều có trong named-cdn.conf). Hàng cuối là cái bẫy: người dùng không đi đâu cả, nhưng resolver của họ đổi chỗ, nên người dùng Việt Nam bị đưa sang Singapore. EDNS Client Subnet (RFC 7871) sửa chuyện này bằng cách gửi một phần địa chỉ người dùng, đổi lại mất riêng tư — 1.1.1.1 không gửi nó.'])],
  goiY: [['Who asks the CDN\'s name server? Never the laptop itself.', 'Ai hỏi máy chủ tên của CDN? Không bao giờ là chính laptop.'], ['The views are tried top to bottom; the first match wins.', 'Các view được thử từ trên xuống; khớp cái đầu tiên là thắng.']],
  loi: [['Assuming GeoDNS sees the user\'s IP.', 'Mặc định GeoDNS thấy IP của người dùng.'], ['Blaming the CDN when a user uses a far-away resolver.', 'Đổ lỗi cho CDN khi người dùng xài một resolver ở xa.']],
  tns: [tn('GeoDNS', 'DNS theo vị trí'), tn('view (BIND)', 'góc nhìn theo người hỏi'), tn('ECS', 'EDNS Client Subnet — gửi kèm dải địa chỉ người dùng')],
  kn: ['GeoDNS'],
});

/* ── 3. Round robin ── */
const E3 = cs({
  ten: 'Anycast 3 — Round-robin DNS with a dead server', kho: 'MEDIUM', phut: 15,
  en: `app.labflow.test has two A records, .10 and .12 — and .12 was shut down last month (lab/out/c34-rr, c34-rr-thu):${pre([...RR, '', ...RRTHU])}`,
  vi: `app.labflow.test có hai bản ghi A, .10 và .12 — mà .12 đã tắt từ tháng trước (lab/out/c34-rr, c34-rr-thu):${pre([...RR, '', ...RRTHU])}`,
  cau: [
    q('c1', ['The order of the two addresses changes between answers. Who does that?', 'Thứ tự hai địa chỉ đổi giữa các câu trả lời. Ai làm việc đó?'], ['The resolver (and the server) rotate the order of the records', 'The laptop\'s stub sorts by distance', 'dig shuffles answers randomly', 'ns1 and ns2 store them in opposite order'], ['Rotation spreads users over the addresses — but only roughly: one big resolver hands the same order to thousands of users at once.', 'Xoay vòng rải người dùng lên các địa chỉ — nhưng chỉ đại khái: một resolver lớn đưa cùng một thứ tự cho hàng nghìn người cùng lúc.']),
    q('c2', ['curl connected in 0.002 s, 0.206 s, 0.002 s, 0.002 s. Where does the 0.206 come from?', 'curl kết nối trong 0,002 s, 0,206 s, 0,002 s, 0,002 s. 0,206 từ đâu ra?'], ['.12 came first; after 200 ms curl moved on to .10', 'The resolver took 200 ms to answer that time', 'The .10 server was busy for that request', 'TCP retransmitted the lost SYN after 200 ms'], ['--trace-time shows it: "Trying .12" at 49.381, "Trying .10" at 49.592. With --happy-eyeballs-timeout-ms 1000 the gap becomes one second.', '--trace-time cho thấy: "Trying .12" lúc 49.381, "Trying .10" lúc 49.592. Với --happy-eyeballs-timeout-ms 1000 khoảng cách thành một giây.']),
    q('c3', ['Python took 2.8 s and 3.1 s when .12 came first. Why so much longer than curl?', 'Python mất 2,8 s và 3,1 s khi .12 đứng đầu. Vì sao lâu hơn curl nhiều vậy?'], ['socket.create_connection tries addresses one after another and waits for each to fail', 'Python resolves the name again for every address', 'Python uses a slower TCP stack', 'Python waits for the DNS TTL of 30 s'], ['Here the failure is "No route to host" after ~3 s (ARP for .12 gets no answer). Behind a firewall that silently drops, each dead address can cost tens of seconds.', 'Ở đây lỗi là "No route to host" sau ~3 s (ARP cho .12 không ai trả lời). Sau tường lửa lặng lẽ bỏ gói, mỗi địa chỉ chết có thể tốn vài chục giây.']),
    q('c4', ['What is the right way to send users to several servers and survive one dying?', 'Cách đúng để chia người dùng ra nhiều máy chủ mà vẫn sống khi một máy chết là gì?'], ['A load balancer (or health-checked DNS) that removes dead servers', 'More A records, so a dead one is a smaller share', 'A shorter TTL on the round-robin records', 'Asking clients to retry'], ['Plain DNS has no health check: .12 stays in every answer until someone removes it, then one more TTL in caches. Chapter 10 builds a load balancer.', 'DNS thường không có kiểm tra sức khoẻ: .12 nằm trong mọi câu trả lời tới khi có người gỡ, rồi thêm một TTL trong cache. Chương 10 dựng bộ cân bằng tải.']),
  ],
  goiY: [['Compare the timestamps of the "Trying" lines.', 'So mốc thời gian của các dòng "Trying".'], ['Each client library has its own strategy for multiple addresses.', 'Mỗi thư viện client có chiến lược riêng cho nhiều địa chỉ.']],
  loi: [['Leaving a dead server in DNS and calling it "load balancing".', 'Để máy chết trong DNS và gọi đó là "cân bằng tải".'], ['Measuring only with curl, which hides the problem better than most clients.', 'Chỉ đo bằng curl, thứ che vấn đề giỏi hơn hầu hết client.']],
  tns: [tn('round-robin DNS', 'DNS xoay vòng'), tn('Happy Eyeballs', 'thử song song nhiều địa chỉ'), tn('health check', 'kiểm tra sức khoẻ')],
  kn: ['round-robin DNS'],
});

/* ── 4. Cloudflare ── */
const E4 = cs({
  ten: 'Anycast 4 — The orange cloud, seen from DNS', kho: 'MEDIUM', phut: 10,
  en: `The real Internet (lab/out/c34-that): cuongthai.com is served straight from the VPS; media.cuongthai.com is proxied by Cloudflare. The TXT queries ask Team Cymru which network owns an address:${pre(THAT)}`,
  vi: `Internet thật (lab/out/c34-that): cuongthai.com phục vụ thẳng từ VPS; media.cuongthai.com đi qua proxy của Cloudflare. Các truy vấn TXT hỏi Team Cymru mạng nào sở hữu một địa chỉ:${pre(THAT)}`,
  cau: [
    q('c1', ['What does "13335 | 172.67.160.0/20 | US" tell you about media.cuongthai.com?', '"13335 | 172.67.160.0/20 | US" cho biết gì về media.cuongthai.com?'], ['DNS returns Cloudflare\'s own anycast addresses, not the origin server', 'The media files are stored in the United States', 'media.cuongthai.com has moved to a new VPS', 'The domain is registered with Cloudflare'], ['AS13335 is Cloudflare. A proxied record publishes Cloudflare\'s addresses; the "US" is only where the block was registered — the edge that answered is HKG (cf-ray).', 'AS13335 là Cloudflare. Bản ghi đi qua proxy công bố địa chỉ của Cloudflare; "US" chỉ là nơi dải địa chỉ được đăng ký — máy biên trả lời là HKG (cf-ray).']),
    q('c2', ['Behind the proxy, what IP does the origin web server see as the client?', 'Sau proxy, máy chủ web gốc thấy IP nào là client?'], ['A Cloudflare address (the real one is in CF-Connecting-IP)', 'The user\'s real IP, exactly as without a proxy', 'The VPS\'s own public address, 160.187.1.208', '1.1.1.1, Cloudflare\'s public resolver'], ['The TCP connection to your origin comes from Cloudflare. Rate limits and logs must read the header — and trust it only from Cloudflare\'s ranges (Chapter 7).', 'Kết nối TCP tới máy gốc đến từ Cloudflare. Giới hạn tần suất và log phải đọc header — và chỉ tin nó khi đến từ dải của Cloudflare (Chương 7).']),
    q('c3', ['cuongthai.com resolves to 160.187.1.208 (AS152992, VN) and answers "server: nginx/1.27.5". What does that mean?', 'cuongthai.com phân giải ra 160.187.1.208 (AS152992, VN) và trả lời "server: nginx/1.27.5". Điều đó nghĩa gì?'], ['It is not proxied: anyone with dig sees the origin IP and talks to it directly', 'It is proxied by a Vietnamese CDN', 'The record is broken and points to the wrong network', 'Cloudflare hides the server header'], ['"Grey cloud": Cloudflare only hosts the DNS. Fine for many sites, but the origin is exposed and there is no edge cache.', '"Mây xám": Cloudflare chỉ giữ DNS. Ổn với nhiều trang, nhưng máy gốc bị lộ và không có cache ở máy biên.']),
    q('c4', ['dig @1.1.1.1 id.server answered "hkg11". Why can Cloudflare not do GeoDNS by the user\'s location for you here?', 'dig @1.1.1.1 id.server trả lời "hkg11". Vì sao ở đây Cloudflare không làm GeoDNS theo vị trí người dùng được?'], ['Everyone gets the same anycast IPs; routing picks the edge', 'It does: hkg11 means every user is sent to Hong Kong', 'GeoDNS requires DNSSEC, which cuongthai.com lacks', '1.1.1.1 sends ECS, which hides where the user is'], ['Big CDNs often skip GeoDNS altogether and use anycast for the site itself — the same trick as 198.19.1.1. 1.1.1.1 does not send ECS.', 'CDN lớn thường bỏ hẳn GeoDNS và dùng anycast cho chính trang web — cùng mẹo với 198.19.1.1. 1.1.1.1 không gửi ECS.']),
  ],
  goiY: [['Look up the AS of each address: who owns it?', 'Tra AS của từng địa chỉ: ai sở hữu nó?'], ['"server:" and "cf-ray:" headers say who answered HTTP.', 'Header "server:" và "cf-ray:" cho biết ai trả lời HTTP.']],
  loi: [['Logging the proxy\'s IP as the user\'s.', 'Ghi IP của proxy thành IP người dùng.'], ['Thinking "proxied" hides an origin that is also reachable by another name.', 'Nghĩ "đi qua proxy" giấu được máy gốc trong khi một tên khác vẫn trỏ thẳng vào nó.']],
  tns: [tn('origin', 'máy chủ gốc'), tn('reverse proxy', 'proxy ngược'), tn('ASN', 'số hiệu mạng')],
  kn: ['CDN proxy'],
});

/* ── 5. bgpBest() ── */
/** Bản in "show ip bgp <prefix>" của FRR ⇒ các đường, đường FRR chọn và đường ta chọn theo AS path. */
function bgpBest(text) {
  var lines = String(text).split('\n');
  var head = /^BGP routing table entry for ([^,\s]+)/.exec(lines[0] || '');
  var paths = [];
  for (var i = 0; i < lines.length; i++) {
    var m = /^ {2}(\d+(?: \d+)*|Local)$/.exec(lines[i]);                // "  64510 64530" — the AS path line
    if (!m) continue;
    var hop = /^ {4}(\S+) from/.exec(lines[i + 1] || '');
    var info = lines[i + 2] || '';
    paths.push({
      asPath: m[1] === 'Local' ? [] : m[1].split(' ').map(Number),
      nextHop: hop ? hop[1] : null,
      best: /(^|, )best( |,|$)/.test(info.trim()),
    });
  }
  var num = function (ip) { return ip.split('.').reduce(function (a, b) { return a * 256 + Number(b); }, 0); };
  var chosen = -1;
  paths.forEach(function (p, k) {
    if (chosen < 0) { chosen = k; return; }
    var c = paths[chosen];
    if (p.asPath.length < c.asPath.length || (p.asPath.length === c.asPath.length && num(p.nextHop) < num(c.nextHop))) chosen = k;
  });
  return { prefix: head ? head[1] : null, paths: paths, chosen: chosen };
}
// DỰNG (ghi rõ trong đề): ba đường, trong đó đường tốt nhất KHÔNG phải đường đầu; và trường hợp sau khi pop1 rút (một đường).
const BGP_BA = ['BGP routing table entry for 198.51.100.0/24, version 7', 'Paths: (3 available, best #2, table default)', '  Advertised to peers:', '  192.0.2.30', '  64530 64510 64496', '    192.0.2.30 from 192.0.2.30 (192.0.2.30)', '      Origin IGP, valid, external', '      Last update: Sun Nov  1 17:20:00 2026', '  64510 64496', '    192.0.2.3 from 192.0.2.3 (192.0.2.3)', '      Origin IGP, metric 0, valid, external, best (AS Path)', '      Last update: Sun Nov  1 17:19:00 2026', '  64520 64496', '    192.0.2.66 from 192.0.2.66 (192.0.2.66)', '      Origin IGP, valid, external', '      Last update: Sun Nov  1 17:18:00 2026'].join('\n');
const BGP_MOT = BGP_TXT.split('\n').filter((d, i, a) => { const k = a.findIndex((x) => x === '  64530'); return i < k; }).join('\n').replace('Paths: (2 available, best #1, table default)', 'Paths: (1 available, best #1, table default)') + '\n  64510 64530\n    192.0.2.3 from 192.0.2.3 (192.0.2.3)\n      Origin IGP, valid, external, best (First path received)\n      Last update: Sun Nov  1 16:22:57 2026';
const E5 = jsBai({
  ten: 'Anycast 5 — Write bgpBest(): read a BGP table entry', kho: 'MEDIUM', phut: 25,
  en: `<p>Read FRR's <code>show ip bgp &lt;prefix&gt;</code> output, real from the ISP router (lab/out/c34-bgp):</p>${pre(BGP_TXT)}
<p>Write <code>bgpBest(text)</code> returning <code>{ prefix, paths, chosen }</code>:</p>
<ul><li><code>prefix</code> — from the first line ("BGP routing table entry for …");</li>
<li>a path starts with a line of exactly two spaces + the AS numbers (or <code>Local</code> ⇒ empty array); the next line, four spaces + the next hop + " from …", gives <code>nextHop</code>; the line after it contains <code>best</code> as a separate word when FRR selected it. Each path: <code>{ asPath: [numbers], nextHop, best }</code>;</li>
<li><code>chosen</code> — the index <b>you</b> would select: the shortest AS path; a tie goes to the numerically lowest next-hop address (a simplification of BGP's later tie-breakers). On real outputs it must agree with FRR's <code>best</code>.</li></ul>
<p>Careful: the "Advertised to peers:" line also starts with two spaces, but is not an AS path. Hidden cases: <b>constructed</b> entries — three paths where the best is the second, and the table right after pop1 withdrew (one path left).</p>`,
  vi: `<p>Đọc output <code>show ip bgp &lt;prefix&gt;</code> của FRR, bản thật trên router nhà mạng (lab/out/c34-bgp):</p>${pre(BGP_TXT)}
<p>Viết <code>bgpBest(text)</code> trả về <code>{ prefix, paths, chosen }</code>:</p>
<ul><li><code>prefix</code> — lấy từ dòng đầu ("BGP routing table entry for …");</li>
<li>một đường bắt đầu bằng dòng có đúng hai dấu cách + các số AS (hoặc <code>Local</code> ⇒ mảng rỗng); dòng kế, bốn dấu cách + next hop + " from …", cho <code>nextHop</code>; dòng sau nữa chứa chữ <code>best</code> đứng riêng khi FRR đã chọn nó. Mỗi đường: <code>{ asPath: [số], nextHop, best }</code>;</li>
<li><code>chosen</code> — chỉ số <b>bạn</b> sẽ chọn: AS path ngắn nhất; hoà thì lấy next hop có giá trị số nhỏ nhất (giản lược các bước phân xử sau của BGP). Trên output thật nó phải trùng với <code>best</code> của FRR.</li></ul>
<p>Cẩn thận: dòng "Advertised to peers:" cũng bắt đầu bằng hai dấu cách, nhưng không phải AS path. Ca ẩn: các mục <b>dựng</b> — ba đường mà đường tốt nhất là đường thứ hai, và bảng ngay sau khi pop1 rút (còn một đường).</p>`,
  dauVao: ['text — output of show ip bgp <prefix>.', 'text — output của show ip bgp <prefix>.'],
  dauRa: ['{ prefix, paths: [{ asPath, nextHop, best }], chosen }', '{ prefix, paths: [{ asPath, nextHop, best }], chosen }'],
  goiY: [['Use a regular expression for the AS path line: two spaces, then digits and spaces only.', 'Dùng biểu thức chính quy cho dòng AS path: hai dấu cách, rồi chỉ có chữ số và dấu cách.'], ['Compare IPv4 addresses as numbers: a*2^24 + b*2^16 + c*2^8 + d.', 'So địa chỉ IPv4 như số: a*2^24 + b*2^16 + c*2^8 + d.']],
  loi: [['Taking "192.0.2.3 192.0.2.30 192.0.2.66" (the peers line) as an AS path.', 'Lấy "192.0.2.3 192.0.2.30 192.0.2.66" (dòng peers) làm AS path.'], ['Comparing AS paths as strings: "64510 64530" is longer than "64530" even though "6451" < "6453".', 'So AS path như chuỗi: "64510 64530" dài hơn "64530" dù "6451" < "6453".']],
  gt: ['Anycast works because every router independently picks the shortest AS path to the prefix: the ISP router sees pop1 directly and pop2 through the datacenter, so homes reach Hanoi. When pop1 withdraws, the only remaining path is chosen within a second — the failover you measured. Reading the BGP entry tells you exactly which copy of an anycast service a network will reach.', 'Anycast chạy được vì mỗi router tự chọn AS path ngắn nhất tới dải: router nhà mạng thấy pop1 trực tiếp còn pop2 qua datacenter, nên các nhà tới Hà Nội. Khi pop1 rút, đường duy nhất còn lại được chọn trong vòng một giây — chính lần chuyển dự phòng bạn đã đo. Đọc mục BGP cho biết chính xác một mạng sẽ tới bản nào của dịch vụ anycast.'],
  kn: ['BGP best path'],
  tns: [tn('next hop', 'chặng kế tiếp'), tn('AS path', 'chuỗi AS'), tn('tie-breaker', 'luật phân xử khi hoà')],
  dau: `/** show ip bgp <prefix> text ⇒ { prefix, paths: [{ asPath, nextHop, best }], chosen } */
function bgpBest(text) {
  // Write your solution here
  return { prefix: null, paths: [], chosen: -1 };
}
`,
  giai: nguon(bgpBest),
  cases: [
    { goi: goi('bgpBest', BGP_TXT), moTa: ['Real: the ISP router, two paths', 'Thật: router nhà mạng, hai đường'] },
    { goi: `${goi('bgpBest', BGP_TXT)}.paths.map(function (p) { return p.asPath.length; })`, moTa: ['Real: AS path lengths', 'Thật: độ dài các AS path'] },
    { goi: goi('bgpBest', BGP_BA), an: true },
    { goi: goi('bgpBest', BGP_MOT), an: true },
    { goi: goi('bgpBest', 'BGP routing table entry for 192.0.2.0/24, version 1\nPaths: (2 available, best #2, table default)\n  Not advertised to any peer\n  64500\n    192.0.2.66 from 192.0.2.66 (192.0.2.66)\n      Origin IGP, valid, external\n  64501\n    192.0.2.3 from 192.0.2.3 (192.0.2.3)\n      Origin IGP, valid, external, best (Router ID)'), an: true },
  ],
});

/* ── 6. geoAnswer() ── */
/** View đầu tiên khớp với địa chỉ người hỏi (hoặc dải ECS nếu có) ⇒ câu trả lời của view đó. */
function geoAnswer(views, resolverIp, ecs) {
  var num = function (ip) { return ip.split('.').reduce(function (a, b) { return a * 256 + Number(b); }, 0); };
  var inNet = function (ip, net) {
    if (net === 'any') return true;
    var p = net.split('/'), len = p.length > 1 ? Number(p[1]) : 32;
    var size = Math.pow(2, 32 - len);                                   // addresses in the block
    return Math.floor(num(ip) / size) === Math.floor(num(p[0]) / size);
  };
  var who = ecs ? ecs.split('/')[0] : resolverIp;                      // ECS: decide by the user's subnet
  for (var i = 0; i < views.length; i++) {
    if (views[i].match.some(function (n) { return inNet(who, n); })) return { view: views[i].name, answer: views[i].answer };
  }
  return { view: null, answer: null };
}
const VIEWS = [{ name: 'vn', match: ['192.0.2.1', '192.0.2.30', '198.51.100.0/24', '100.64.0.0/24'], answer: '203.0.113.10' }, { name: 'sg', match: ['any'], answer: '203.0.113.11' }];
const VIEWS3 = [{ name: 'vn', match: ['14.160.0.0/11', '113.160.0.0/11'], answer: '203.0.113.10' }, { name: 'jp', match: ['133.0.0.0/8'], answer: '203.0.113.12' }, { name: 'sg', match: ['0.0.0.0/0'], answer: '203.0.113.11' }];
const E6 = jsBai({
  ten: 'Anycast 6 — Write geoAnswer(): how a GeoDNS server chooses', kho: 'MEDIUM', phut: 22,
  en: `<p>Reproduce the CDN's BIND views (lab/moi-truong/dns/named-cdn.conf):</p>${pre(CDN)}
<p>Write <code>geoAnswer(views, resolverIp, ecs)</code>. <code>views</code> is an ordered array <code>[{ name, match: [...], answer }]</code>; each match entry is an IPv4 address (= /32), a CIDR block, or <code>"any"</code>. Return <code>{ view, answer }</code> of the <b>first</b> view with a matching entry, or <code>{ view: null, answer: null }</code>.</p>
<p>The address tested is <code>resolverIp</code> — the GeoDNS server only sees who asks. If the optional <code>ecs</code> (EDNS Client Subnet, e.g. <code>"198.51.100.0/24"</code>) is given, test the network address of that subnet instead: that is exactly what ECS changes.</p>
<p>Visible cases are the real resolvers of the lab: the ISP resolver's outside address 192.0.2.1, pop1 192.0.2.30, pop2 198.19.255.2. Hidden cases: pop2 forwarding the house's subnet with ECS, and a <b>constructed</b> three-view setup with /11 blocks and 0.0.0.0/0.</p>`,
  vi: `<p>Làm lại các view BIND của CDN (lab/moi-truong/dns/named-cdn.conf):</p>${pre(CDN)}
<p>Viết <code>geoAnswer(views, resolverIp, ecs)</code>. <code>views</code> là mảng có thứ tự <code>[{ name, match: [...], answer }]</code>; mỗi mục match là một địa chỉ IPv4 (= /32), một khối CIDR, hoặc <code>"any"</code>. Trả về <code>{ view, answer }</code> của view <b>đầu tiên</b> có mục khớp, hoặc <code>{ view: null, answer: null }</code>.</p>
<p>Địa chỉ đem thử là <code>resolverIp</code> — máy chủ GeoDNS chỉ thấy ai hỏi. Nếu có <code>ecs</code> (EDNS Client Subnet, ví dụ <code>"198.51.100.0/24"</code>), thử địa chỉ mạng của dải đó thay vào: đó chính xác là thứ ECS thay đổi.</p>
<p>Ca hiện là các resolver thật của lab: địa chỉ phía ngoài của resolver nhà mạng 192.0.2.1, pop1 192.0.2.30, pop2 198.19.255.2. Ca ẩn: pop2 chuyển dải của ngôi nhà bằng ECS, và một cấu hình <b>dựng</b> ba view với khối /11 và 0.0.0.0/0.</p>`,
  dauVao: ['views — ordered views; resolverIp — who asks; ecs — optional "a.b.c.d/len".', 'views — các view theo thứ tự; resolverIp — ai hỏi; ecs — tuỳ chọn "a.b.c.d/len".'],
  dauRa: ['{ view, answer }', '{ view, answer }'],
  goiY: [['Turn an address into a 32-bit number; two addresses are in the same /len block when their first len bits are equal.', 'Đổi địa chỉ thành số 32 bit; hai địa chỉ cùng khối /len khi len bit đầu bằng nhau.'], ['Use Math.floor(n / 2 ** (32 - len)) instead of >> to avoid negative numbers in JavaScript.', 'Dùng Math.floor(n / 2 ** (32 - len)) thay cho >> để tránh số âm trong JavaScript.']],
  loi: [['Testing every view and taking the last match: order matters, "any" must stay last.', 'Thử mọi view rồi lấy cái khớp cuối: thứ tự quan trọng, "any" phải ở cuối.'], ['Using bit shifts on addresses ≥ 128.0.0.0: (n >> 0) becomes negative.', 'Dùng phép dịch bit cho địa chỉ ≥ 128.0.0.0: (n >> 0) thành số âm.'], ['Ignoring ECS, or using the ECS subnet when none is given.', 'Bỏ qua ECS, hoặc dùng dải ECS khi không có.']],
  gt: ['A GeoDNS server is just "first matching rule wins" over the address of whoever asks. Because that address is the resolver\'s, users of a distant resolver get a distant edge — the Vietnam-to-Singapore case of exercise 2 — and ECS fixes it only by revealing part of the user\'s address to every authoritative server on the path.', 'Máy chủ GeoDNS chỉ là "luật khớp đầu tiên thắng" trên địa chỉ của người hỏi. Vì địa chỉ đó là của resolver, người dùng resolver ở xa nhận máy biên ở xa — trường hợp Việt Nam sang Singapore của bài 2 — và ECS chỉ sửa được bằng cách để lộ một phần địa chỉ người dùng cho mọi máy chủ có thẩm quyền trên đường.'],
  kn: ['GeoDNS', 'CIDR matching'],
  tns: [tn('CIDR', 'ký hiệu khối địa chỉ'), tn('first match', 'khớp đầu tiên'), tn('EDNS Client Subnet', 'dải mạng của người dùng gửi kèm')],
  dau: `/** ordered views, resolver IP, optional ECS subnet ⇒ { view, answer } */
function geoAnswer(views, resolverIp, ecs) {
  // Write your solution here
  return { view: null, answer: null };
}
`,
  giai: nguon(geoAnswer),
  cases: [
    { goi: goi('geoAnswer', VIEWS, '192.0.2.1'), moTa: ['Real: the ISP resolver asks', 'Thật: resolver nhà mạng hỏi'] },
    { goi: goi('geoAnswer', VIEWS, '192.0.2.30'), moTa: ['Real: pop1 Hanoi asks', 'Thật: pop1 Hà Nội hỏi'] },
    { goi: goi('geoAnswer', VIEWS, '198.19.255.2'), moTa: ['Real: pop2 Singapore asks', 'Thật: pop2 Singapore hỏi'] },
    { goi: goi('geoAnswer', VIEWS, '198.19.255.2', '198.51.100.0/24'), an: true },
    { goi: goi('geoAnswer', VIEWS, '192.0.2.31'), an: true },
    { goi: goi('geoAnswer', VIEWS3, '113.190.4.4'), an: true },
    { goi: goi('geoAnswer', VIEWS3, '8.8.8.8', '133.11.0.0/16'), an: true },
    { goi: goi('geoAnswer', VIEWS3.slice(0, 2), '203.0.113.54'), an: true },
  ],
});

export default doiDau({ slug: 'netdev-3-4-anycast-geodns', ten: '3.4 Anycast, GeoDNS and DNS-based load balancing', khoa: KHOA, baiHoc: 'netdev-3-4-anycast-geodns', de: [E1, E2, E3, E4, E5, E6] });
