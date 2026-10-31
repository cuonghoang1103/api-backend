/**
 * Chương 2 · 2.5 — Internet được nối lại thế nào: AS và BGP (slug khung netdev-2-5-bgp-internet).
 * Output thật: lab/out/c25-*.out.txt (FRR trong lab "Internet trong một hộp") + c25-that (RIPEstat, Internet thật, chỉ đọc).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-02-5.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };
// Bảng của FRR in 5 dòng chú giải ở đầu — ẩn cho dễ đọc (nói rõ trong bài)
const C = { drop: /^# |^Status codes|^\s+i internal|^Nexthop codes|^Origin codes|^RPKI validation|^Default local pref|^BGP table version/ };

export default {
  title: '2.5 — How the Internet is stitched together: AS and BGP|||2.5 — Internet được nối lại thế nào: AS và BGP',
  slug: 'netdev-2-5-bgp-internet',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Hệ tự trị (AS) và số ASN; transit, peering và điểm trao đổi (IX, VNIX); BGP quảng bá tuyến và AS path đọc trên FRR thật; cướp tuyến bằng dải cụ thể hơn (YouTube 2008) và bộ lọc prefix; RPKI kiểm thật cho cuongthai.com; rút tuyến kiểu Facebook 2021 làm DNS biến mất.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>How the Internet is stitched together: AS and BGP</h2>
<p class="lead">In lesson 2.2 the ISP's router had a line "203.0.113.0/24 via 192.0.2.3, proto bgp" that nobody typed. Where did it come from? This lesson answers with the protocol that holds the Internet together, BGP. You will read real BGP tables, steal LabFlow's address range from the ISP and fix it, check who is allowed to announce cuongthai.com's address on the real Internet, and replay — in the lab — the mechanism behind the day Facebook disappeared.</p>

<h3>The Internet is a network of networks</h3>
<p>Nobody runs "the Internet". It is tens of thousands of independent networks — ISPs, mobile operators, clouds, universities, big companies — each with its own routers and its own rules. Each such network, as seen from outside, is an <strong>Autonomous System</strong> (AS): one administration, one routing policy, identified by an <strong>AS number</strong> (ASN). Real examples: Cloudflare is AS13335, Google AS15169, and the hosting company whose network carries cuongthai.com's server is AS152992 — we will look it up live. In our lab: the ISP is AS64500, the datacenter AS64510, and another network at the exchange point AS64511 (numbers 64496–64511 are reserved for documentation).</p>
<p>Networks connect in two ways. <strong>Transit</strong>: a small network pays a bigger one to carry its traffic to the whole Internet. <strong>Peering</strong>: two networks exchange traffic between their own customers directly, usually without payment, because it is cheaper for both. Peering often happens at an <strong>Internet Exchange Point</strong> (IX or IXP) — a big shared switch in a datacenter where many networks plug in. Vietnam has a national one, VNIX, run by VNNIC in Hanoi, Da Nang and Ho Chi Minh City, so that traffic between two Vietnamese ISPs does not have to travel abroad and back. Our lab's IX is the <code>192.0.2.0/24</code> network.</p>

<h3>BGP: "I can reach this range — through me"</h3>
<p>The <strong>Border Gateway Protocol</strong> (BGP) is how ASes tell each other which address ranges they can reach. Each router opens a TCP session (port 179) to its neighbours and announces prefixes: "203.0.113.0/24 is reachable through me". A neighbour that accepts it passes it on to its own neighbours, adding its own ASN in front — so every route carries the list of ASes it crossed, the <strong>AS path</strong>. Here is the ISP's router (FRR prints a five-line legend above every table; we hide it to keep the output readable):</p>
${run('c25-isp', "vtysh -c 'show bgp ipv4 unicast summary'", 1, C)}
<p>Two neighbours, both <em>Established</em> (the session is up), each sending one prefix (<code>PfxRcd 1</code>). The table:</p>
${run('c25-isp', "vtysh -c 'show ip bgp'", 1, C)}
<ul>
<li><code>*&gt;</code>: valid and <strong>best</strong> — the route actually used.</li>
<li><strong>Next Hop</strong>: where to send packets (the neighbour's address at the IX); <code>0.0.0.0</code> = announced by this router itself.</li>
<li><strong>Path</strong>: the AS path, read right to left. The <em>last</em> number is the <strong>origin AS</strong> — the network that owns the range: 203.0.113.0/24 comes from AS64510, the datacenter. <code>i</code> at the end = it was originated inside that AS.</li>
</ul>
${run('c25-isp', "vtysh -c 'show ip bgp 203.0.113.0/24'", 2, C)}
<p>The chosen route is copied into the kernel's routing table — that is the <code>proto bgp</code> line we read in lesson 2.2. Now the same routes seen from the datacenter:</p>
${run('c25-dc', "vtysh -c 'show ip bgp'", 1, C)}
<p>The datacenter learned AS64511's range through the ISP, so its path is <code>64500 64511</code>: two ASes away. When several routes reach the same prefix, BGP prefers the operator's policy first (who pays whom) and then, among others, the <strong>shorter AS path</strong>. IPv6 ranges travel the same way:</p>
${run('c25-isp', "vtysh -c 'show bgp ipv6 unicast'", 1, C)}
${net('bgp', 'announce', 'en', 'Three networks on an exchange point announce their ranges: watch the tables fill and the AS path grow. Which AS owns 198.18.0.0/24?', { tour: 'bgp-path' })}

<h3>The weakness: BGP believes what it is told</h3>
<p>Classic BGP has no built-in way to check that a network is allowed to announce a range. Combine that with longest prefix match (lesson 2.2) and you get a <strong>BGP hijack</strong>. On 24 February 2008 at 18:47 UTC, Pakistan Telecom (AS17557), ordered to block YouTube inside Pakistan, announced <code>208.65.153.0/24</code> — more specific than YouTube's own <code>208.65.152.0/22</code> — to route YouTube into a black hole. Its upstream provider PCCW (AS3491) passed the announcement on to the world, and because a /24 beats a /22 everywhere, most of the Internet sent YouTube's traffic to Pakistan. YouTube answered about 80 minutes later by announcing the same /24 and then two /25s; PCCW withdrew the bad route at 21:01 UTC — about two hours in total (RIPE NCC's analysis). Let us replay it. The rogue network announces half of LabFlow's range and drops everything sent there:</p>
${run('c25-rogue-cuop', 'ip route add blackhole', 3, C)}
${run('c25-isp-cuop', "vtysh -c 'show ip bgp'", 3, C)}
<p>The ISP accepted both. Its kernel has the /24 via the datacenter <em>and</em> the /25 via the rogue — and the /25 wins for every address from .0 to .127, including LabFlow's server (.10) and its name server (.53):</p>
${run('c25-laptop-cuop', 'curl -sS', 3, C)}
<p>The customer sees a timeout, a traceroute that disappears after the ISP, and DNS that does not answer — three symptoms, one cause, none of them inside LabFlow. And the victim can see it, if it watches: the datacenter receives its own range back with a strange origin AS:</p>
${run('c25-dc-thay', 'vtysh', 1, C)}
<p>Monitoring services (for example RIPE's RIS, Cloudflare Radar, BGP alerting tools) send exactly this alarm: "your prefix is being announced by AS64511".</p>

<h3>The fixes: filters, and RPKI</h3>
<p><strong>Filter what your neighbours may announce.</strong> The ISP knows AS64511 owns only 198.18.0.0/24, so it accepts only that from it:</p>
${run('c25-isp-loc', "vtysh -c 'configure terminal'", 4, C)}
${run('c25-laptop-ok', 'curl', 1, C)}
<p>That works between neighbours who know each other — it failed in 2008 because PCCW did not filter its customer. The Internet-scale fix is <strong>RPKI</strong> (Resource Public Key Infrastructure): the owner of a range publishes a signed record, a <strong>ROA</strong> (Route Origin Authorization), saying "this prefix may be originated by this AS, up to this prefix length". Routers that do <em>route origin validation</em> (RFC 6811) drop announcements that contradict a ROA. Here is the real Internet, checked through RIPE's public API — read-only, no scanning:</p>
${run('c25-that', 'IP=', 7, C)}
<p>cuongthai.com's address <code>160.187.1.208</code> lies in <code>160.187.0.0/23</code>, announced by AS152992 — <em>valid</em>: its ROA allows AS152992 up to /24. The same range announced by AS64511 would be <em>invalid_asn</em> (wrong origin), and a <code>/25</code> by the rightful owner would be <em>invalid_length</em> — which is exactly how a "more specific" hijack like 2008 would be caught today, on networks that validate. RPKI is not the whole answer: on 27 June 2024, Cloudflare's resolver 1.1.1.1 was hijacked as a /32 by AS267613 and, separately, leaked as a /24 by AS262504; RPKI marked the /32 invalid, but the leaked /24 still carried Cloudflare's correct origin, so origin validation could not catch it. Protecting the <em>path</em> needs newer work (ASPA).</p>
${net('bgp', 'hijack', 'en', 'Let the rogue AS announce a more specific range and watch traffic fall into its black hole — then apply the prefix filter, and see what RPKI would say.', { tour: 'bgp-hijack' })}

<h3>Withdrawal: the day Facebook disappeared</h3>
<p>BGP can also take a network off the Internet in seconds. On 4 October 2021, during routine maintenance, a command meant to assess capacity took down all the links of Facebook's backbone (an audit tool that should have stopped it had a bug). Facebook's DNS servers are designed to stop announcing their own prefixes when they cannot reach Facebook's datacenters — so they withdrew them. Around 15:40 UTC Cloudflare saw a burst of routing changes; by 15:58 the prefixes of Facebook's DNS servers were gone from the Internet's tables. Every resolver in the world (1.1.1.1, 8.8.8.8, ISPs') started answering SERVFAIL for facebook.com, and it took until about 21:20 — roughly five and a half hours — for names to resolve again. We replay the mechanism: the datacenter stops announcing its range.</p>
${run('c25-dc-rut', "vtysh -c 'configure terminal'", 2, C)}
${run('c25-isp-rut', "vtysh -c 'show ip bgp'", 3, C)}
<p>The ISP no longer knows any route to LabFlow — nor to its name server. What the user sees:</p>
${run('c25-laptop-rut', 'dig +tries=1', 4, C)}
<p>Not "the site is slow" but "this name does not exist any more": the ISP's resolver cannot reach LabFlow's name server and answers at once. Our small resolver (dnsmasq) says <code>REFUSED</code> with Extended DNS Error 23 "Network Error"; big public resolvers say <code>SERVFAIL</code> — same meaning for your application: no address, <code>Could not resolve host</code>. The direct IP fails too, and traceroute stops at the ISP with <code>!N</code> (network unreachable). Notice something subtle: LabFlow's IPv6 range was still announced the whole time — but without DNS, nobody could find the address. When the datacenter announces again, everything comes back within seconds:</p>
${run('c25-dc-lai', "vtysh -c 'configure terminal'", 1, C)}
${run('c25-laptop-lai', 'dig +short', 2, C)}
${net('bgp', 'withdraw', 'en', 'Withdraw the datacenter’s range and follow the effect: routes vanish, DNS fails, the site disappears — then announce it again.')}
<div class="pitfall co-tieu-de">
<p><strong>"DNS is down" is often not a DNS problem.</strong> For Facebook, the DNS servers were running fine; they were unreachable because their routes were withdrawn. When names suddenly fail for a whole service, check routing too: can you reach the name server's IP (<code>dig @IP</code>, <code>traceroute</code>)? Is the prefix still announced (a looking glass, RIPEstat, Cloudflare Radar)? And never let your only way to log in to fix a network depend on that same network.</p>
</div>

<h3>Where this lives in the computer</h3>
<ul>
<li>A BGP router runs a daemon (FRR's <code>bgpd</code> in our lab; vendor software in hardware routers) that keeps the TCP sessions and all received routes in RAM — the RIB. The best route per prefix is pushed into the kernel's forwarding table (<code>proto bgp</code>), where packets are actually routed.</li>
<li>A full Internet table has around a million IPv4 prefixes; core routers hold it in special fast memory on their forwarding chips.</li>
<li>RPKI data is downloaded from the five regional registries by validator software, which tells the routers which announcements are valid.</li>
</ul>
${cauNoi('en', { ...NWC, bai: 'nwc204-1-1-mang-la-gi-thanh-phan-to-po', so: '1.1', ten: 'What a network is: components, topologies, types', giong: 'the Internet as a network of networks run by ISPs', khac: 'NWC204 stops at LAN/WAN and the ISP as a cloud', them: 'how those networks really exchange routes — ASes, BGP sessions, AS paths in real FRR tables, a hijack, a withdrawal, and RPKI checked on the real Internet' })}

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> Monday, 9:00. Customers report LabFlow "down" — timeouts and "could not resolve host". The datacenter team swears nothing changed on their side. You have access to the lab routers.</p>
<ol>
<li>Restart the Internet in a box. On <code>nfi-isp</code> read <code>show bgp ipv4 unicast summary</code> and <code>show ip bgp</code>; write the origin AS of each prefix.</li>
<li>Inject the incident: <code>docker exec nfi-rogue bash /lab/k/code/ch02/lab2/su-co-b.sh</code> (do not read the script yet). From the laptop collect the symptoms (curl, traceroute, dig). Then find the cause using only <code>show ip bgp</code> and <code>ip route get</code> on the ISP.</li>
<li>Fix it on the ISP with a prefix-list for neighbour 192.0.2.66, prove LabFlow works again.</li>
<li>Write a three-sentence incident note, and explain which RPKI status the bad announcement would have on a network that validates.</li>
<li>Bonus: on <code>nfi-dc</code> withdraw <code>203.0.113.0/24</code>, observe <code>dig</code> and <code>traceroute</code> from the laptop, announce it again and time how long recovery takes.</li>
</ol>
<p><strong>Done when:</strong> you identify AS64511 announcing 203.0.113.0/25 as the cause, fix it with a filter, and your note mentions longest prefix match and RPKI <em>invalid</em>.</p>
<details><summary>Solution</summary>
<p>1) 198.18.0.0/24 → AS64511, 198.51.100.0/24 → the ISP itself (path empty, next hop 0.0.0.0), 203.0.113.0/24 → AS64510. 2) Symptoms: curl times out, traceroute stops after 198.51.100.1, dig gets no answer. <code>show ip bgp</code> now lists <code>203.0.113.0/25 via 192.0.2.66, path 64511</code>; <code>ip route get 203.0.113.10</code> says <code>via 192.0.2.66</code> — the /25 beats the datacenter's /24. 3) <code>ip prefix-list FROM-ROGUE seq 10 permit 198.18.0.0/24</code>, <code>neighbor 192.0.2.66 prefix-list FROM-ROGUE in</code>, <code>clear bgp ipv4 unicast 192.0.2.66 soft in</code>; the /25 disappears and curl works. 4) "At 9:00 AS64511 announced 203.0.113.0/25, a more specific part of LabFlow's 203.0.113.0/24; by longest prefix match the ISP sent our traffic — including DNS — to AS64511, which dropped it. We filtered AS64511's announcements to the prefixes it owns. With RPKI, our ROA (origin AS64510) would make that route invalid_asn, and validating networks would have dropped it." 5) Withdrawal: dig answers REFUSED (EDE 23 Network Error) immediately, traceroute ends with <code>198.51.100.1 !N</code>; after announcing again, routes and DNS return within a couple of seconds.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
    ['Autonomous System (AS, hệ tự trị)', 'A network under one administration and routing policy, identified by an ASN.'],
    ['transit / peering', 'Paying a bigger network to reach everything / exchanging customers’ traffic directly.'],
    ['IXP (điểm trao đổi Internet)', 'Shared switch where many networks connect to peer (e.g. VNIX in Vietnam).'],
    ['BGP', 'Protocol ASes use to announce reachable prefixes to each other over TCP 179.'],
    ['AS path / origin AS', 'List of ASes a route crossed; the last one owns the prefix.'],
    ['BGP hijack (cướp tuyến)', 'Announcing someone else’s prefix (often more specific) to attract their traffic.'],
    ['RPKI / ROA', 'Signed records of which AS may originate a prefix and up to which length.'],
    ['route withdrawal (rút tuyến)', 'An AS stops announcing a prefix; the rest of the Internet forgets the route.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>The Internet is a mesh of autonomous systems connected by transit and peering, often at exchange points.</li>
<li>BGP announces prefixes with an AS path; the last AS is the origin; the best route goes into the kernel table.</li>
<li>BGP trusts what it hears: a more specific announcement wins everywhere (YouTube 2008). Filters and RPKI (ROA + origin validation) are the defences; path leaks need more.</li>
<li>Withdrawing a prefix removes a network in seconds; when DNS servers vanish, the symptom is "the name does not exist" (Facebook 2021).</li>
<li>"DNS is down" can be routing: check reachability of the name server and whether the prefix is still announced.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc4271', '📄', 'RFC 4271 — A Border Gateway Protocol 4 (BGP-4)', 'The protocol: sessions, updates, AS path, route selection.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc6811', '📄', 'RFC 6811 — BGP Prefix Origin Validation', 'How routers use RPKI ROAs to mark routes valid / invalid.', 'Open')}
${L('https://www.ripe.net/about-us/news/youtube-hijacking-a-ripe-ncc-ris-case-study/', '📰', 'RIPE NCC — YouTube Hijacking: a RIPE NCC RIS case study', 'The 2008 hijack, minute by minute.', 'Open')}
${L('https://blog.cloudflare.com/october-2021-facebook-outage/', '📰', 'Cloudflare — Understanding how Facebook disappeared from the Internet', 'BGP withdrawals and SERVFAIL, seen from 1.1.1.1.', 'Open')}
${L('https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/', '📰', 'Meta Engineering — More details about the October 4 outage', 'The maintenance command, the audit-tool bug, DNS withdrawing routes.', 'Open')}
${L('https://blog.cloudflare.com/cloudflare-1111-incident-on-june-27-2024/', '📰', 'Cloudflare — 1.1.1.1 incident on June 27, 2024', 'A hijack caught by RPKI and a leak it could not catch.', 'Open')}
${L('https://isbgpsafeyet.com/', '🛡️', 'Is BGP safe yet?', 'Which networks validate RPKI — and test your own ISP.', 'Open')}
${L('https://vnnic.vn/en/vnix/introduction', '🇻🇳', 'VNNIC — About VNIX', 'Vietnam’s national Internet exchange: Hanoi, Da Nang, Ho Chi Minh City.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Internet được nối lại thế nào: AS và BGP</h2>
<p class="lead">Ở bài 2.2, router của nhà mạng có một dòng "203.0.113.0/24 via 192.0.2.3, proto bgp" mà không ai gõ. Nó từ đâu ra? Bài này trả lời bằng giao thức giữ cho Internet dính lại với nhau: BGP. Bạn sẽ đọc bảng BGP thật, cướp dải địa chỉ của LabFlow khỏi tay nhà mạng rồi sửa lại, kiểm xem ai được phép quảng bá địa chỉ của cuongthai.com trên Internet thật, và dựng lại — trong lab — cơ chế đứng sau ngày Facebook biến mất.</p>

<h3>Internet là mạng của các mạng</h3>
<p>Không ai điều hành "Internet". Nó là hàng chục nghìn mạng độc lập — nhà mạng, nhà mạng di động, cloud, trường đại học, công ty lớn — mỗi mạng có router riêng và luật riêng. Mỗi mạng như vậy, nhìn từ bên ngoài, là một <strong>hệ tự trị (Autonomous System — AS)</strong>: một ban quản trị, một chính sách định tuyến, có một <strong>số hiệu AS (ASN)</strong>. Ví dụ thật: Cloudflare là AS13335, Google là AS15169, còn công ty hosting có mạng chở máy chủ của cuongthai.com là AS152992 — lát nữa ta tra trực tiếp. Trong lab: nhà mạng là AS64500, trung tâm dữ liệu AS64510, và một mạng khác ở điểm trao đổi là AS64511 (các số 64496–64511 dành cho tài liệu).</p>
<p>Các mạng nối với nhau theo hai cách. <strong>Transit (trung chuyển)</strong>: một mạng nhỏ trả tiền cho một mạng lớn hơn để chở lưu lượng của mình đi khắp Internet. <strong>Peering (kết nối ngang hàng)</strong>: hai mạng trao đổi trực tiếp lưu lượng giữa khách hàng của nhau, thường không mất tiền, vì như vậy rẻ hơn cho cả hai. Peering thường diễn ra ở một <strong>điểm trao đổi Internet (Internet Exchange Point — IX hay IXP)</strong> — một switch dùng chung cỡ lớn trong một trung tâm dữ liệu, nơi nhiều mạng cùng cắm vào. Việt Nam có một điểm trao đổi quốc gia, VNIX, do VNNIC vận hành ở Hà Nội, Đà Nẵng và TP. Hồ Chí Minh, để lưu lượng giữa hai nhà mạng Việt Nam không phải đi ra nước ngoài rồi vòng về. IX của lab là mạng <code>192.0.2.0/24</code>.</p>

<h3>BGP: "Tôi tới được dải này — đi qua tôi"</h3>
<p><strong>Giao thức cổng biên (Border Gateway Protocol — BGP)</strong> là cách các AS báo cho nhau biết chúng tới được những dải địa chỉ nào. Mỗi router mở một phiên TCP (cổng 179) tới các láng giềng và quảng bá prefix: "đi qua tôi thì tới được 203.0.113.0/24". Láng giềng chấp nhận sẽ chuyển tiếp cho các láng giềng của nó, thêm ASN của chính nó vào phía trước — nên tuyến nào cũng mang danh sách các AS nó đã đi qua, gọi là <strong>AS path</strong>. Đây là router của nhà mạng (FRR in năm dòng chú giải ở đầu mỗi bảng; ta ẩn chúng cho output dễ đọc):</p>
${run('c25-isp', "vtysh -c 'show bgp ipv4 unicast summary'", 1, C)}
<p>Hai láng giềng, cả hai ở trạng thái <em>Established</em> (phiên đã lên), mỗi bên gửi một prefix (<code>PfxRcd 1</code>). Bảng tuyến:</p>
${run('c25-isp', "vtysh -c 'show ip bgp'", 1, C)}
<ul>
<li><code>*&gt;</code>: hợp lệ và là tuyến <strong>tốt nhất (best)</strong> — tuyến thật sự được dùng.</li>
<li><strong>Next Hop</strong>: gửi gói tới đâu (địa chỉ của láng giềng ở IX); <code>0.0.0.0</code> = do chính router này quảng bá.</li>
<li><strong>Path</strong>: AS path, đọc từ phải sang trái. Số <em>cuối cùng</em> là <strong>AS gốc (origin AS)</strong> — mạng sở hữu dải đó: 203.0.113.0/24 đến từ AS64510, trung tâm dữ liệu. Chữ <code>i</code> ở cuối = tuyến được sinh ra bên trong AS đó.</li>
</ul>
${run('c25-isp', "vtysh -c 'show ip bgp 203.0.113.0/24'", 2, C)}
<p>Tuyến được chọn được chép vào bảng định tuyến của nhân — chính là dòng <code>proto bgp</code> ta đọc ở bài 2.2. Giờ cùng các tuyến đó nhìn từ trung tâm dữ liệu:</p>
${run('c25-dc', "vtysh -c 'show ip bgp'", 1, C)}
<p>Trung tâm dữ liệu học dải của AS64511 qua nhà mạng, nên path của nó là <code>64500 64511</code>: cách hai AS. Khi có nhiều tuyến tới cùng một prefix, BGP ưu tiên chính sách của nhà vận hành trước (ai trả tiền cho ai) rồi, trong số các tiêu chí khác, chọn <strong>AS path ngắn hơn</strong>. Dải IPv6 cũng đi đúng như vậy:</p>
${run('c25-isp', "vtysh -c 'show bgp ipv6 unicast'", 1, C)}
${net('bgp', 'announce', 'vi', 'Ba mạng ở một điểm trao đổi quảng bá dải của mình: xem các bảng đầy dần và AS path dài ra. AS nào sở hữu 198.18.0.0/24?', { tour: 'bgp-path' })}

<h3>Điểm yếu: BGP tin những gì nó được nghe</h3>
<p>BGP kiểu cổ điển không có sẵn cách nào kiểm xem một mạng có được phép quảng bá một dải hay không. Ghép điều đó với khớp tiền tố dài nhất (bài 2.2) là ra <strong>cướp tuyến BGP (BGP hijack)</strong>. Ngày 24/2/2008 lúc 18:47 UTC, Pakistan Telecom (AS17557), khi được yêu cầu chặn YouTube trong nước, đã quảng bá <code>208.65.153.0/24</code> — cụ thể hơn dải <code>208.65.152.0/22</code> của chính YouTube — để dẫn YouTube vào một hố đen. Nhà cung cấp phía trên của họ là PCCW (AS3491) chuyển lời quảng bá đó ra cả thế giới, và vì một /24 thắng một /22 ở mọi nơi, phần lớn Internet gửi lưu lượng của YouTube sang Pakistan. YouTube phản ứng khoảng 80 phút sau bằng cách quảng bá đúng /24 đó rồi hai /25; PCCW rút tuyến sai lúc 21:01 UTC — tổng cộng khoảng hai giờ (phân tích của RIPE NCC). Ta dựng lại. Mạng rogue quảng bá một nửa dải của LabFlow và vứt mọi thứ gửi tới đó:</p>
${run('c25-rogue-cuop', 'ip route add blackhole', 3, C)}
${run('c25-isp-cuop', "vtysh -c 'show ip bgp'", 3, C)}
<p>Nhà mạng chấp nhận cả hai. Nhân của nó có /24 đi qua trung tâm dữ liệu <em>và</em> /25 đi qua rogue — và /25 thắng cho mọi địa chỉ từ .0 tới .127, gồm cả máy chủ LabFlow (.10) lẫn máy chủ tên của nó (.53):</p>
${run('c25-laptop-cuop', 'curl -sS', 3, C)}
<p>Khách hàng thấy hết giờ chờ, traceroute biến mất sau nhà mạng, và DNS không trả lời — ba triệu chứng, một nguyên nhân, không cái nào nằm trong LabFlow. Và nạn nhân có thể nhìn thấy, nếu có theo dõi: trung tâm dữ liệu nhận lại chính dải của mình với một AS gốc lạ:</p>
${run('c25-dc-thay', 'vtysh', 1, C)}
<p>Các dịch vụ giám sát (ví dụ RIS của RIPE, Cloudflare Radar, các công cụ cảnh báo BGP) gửi đúng lời cảnh báo này: "dải của bạn đang được AS64511 quảng bá".</p>

<h3>Cách sửa: bộ lọc, và RPKI</h3>
<p><strong>Lọc những gì láng giềng được phép quảng bá.</strong> Nhà mạng biết AS64511 chỉ sở hữu 198.18.0.0/24, nên chỉ nhận đúng dải đó từ nó:</p>
${run('c25-isp-loc', "vtysh -c 'configure terminal'", 4, C)}
${run('c25-laptop-ok', 'curl', 1, C)}
<p>Cách này chạy giữa các láng giềng biết rõ nhau — năm 2008 nó thất bại vì PCCW không lọc khách hàng của mình. Cách sửa ở quy mô cả Internet là <strong>RPKI</strong> (Resource Public Key Infrastructure — hạ tầng khoá công khai cho tài nguyên): chủ của một dải công bố một bản ghi có chữ ký, gọi là <strong>ROA</strong> (Route Origin Authorization — giấy phép AS gốc), nói "prefix này được AS này sinh ra, dài tối đa tới chừng này". Router có làm <em>kiểm tra AS gốc (route origin validation)</em> (RFC 6811) sẽ bỏ các lời quảng bá trái với ROA. Đây là Internet thật, kiểm qua API công khai của RIPE — chỉ đọc, không quét gì cả:</p>
${run('c25-that', 'IP=', 7, C)}
<p>Địa chỉ của cuongthai.com <code>160.187.1.208</code> nằm trong <code>160.187.0.0/23</code>, do AS152992 quảng bá — <em>valid</em>: ROA của nó cho phép AS152992 tới /24. Cùng dải đó mà AS64511 quảng bá sẽ là <em>invalid_asn</em> (sai AS gốc), và một <code>/25</code> do chính chủ quảng bá sẽ là <em>invalid_length</em> — đúng là cách một vụ cướp "cụ thể hơn" như năm 2008 bị bắt ngày nay, trên các mạng có kiểm tra. RPKI chưa phải toàn bộ lời giải: ngày 27/6/2024, resolver 1.1.1.1 của Cloudflare bị AS267613 cướp dưới dạng /32 và, riêng rẽ, bị AS262504 làm rò dưới dạng /24; RPKI đánh dấu /32 là invalid, nhưng /24 bị rò vẫn mang đúng AS gốc của Cloudflare, nên kiểm AS gốc không bắt được. Bảo vệ cả <em>đường đi</em> cần những cơ chế mới hơn (ASPA).</p>
${net('bgp', 'hijack', 'vi', 'Cho AS rogue quảng bá một dải cụ thể hơn và xem lưu lượng rơi vào hố đen của nó — rồi bật bộ lọc prefix, và xem RPKI sẽ nói gì.', { tour: 'bgp-hijack' })}

<h3>Rút tuyến: ngày Facebook biến mất</h3>
<p>BGP còn có thể đưa một mạng ra khỏi Internet trong vài giây. Ngày 4/10/2021, trong một lần bảo trì thường lệ, một lệnh dùng để đánh giá dung lượng đã làm sập mọi đường nối trong mạng xương sống của Facebook (công cụ kiểm duyệt lẽ ra phải chặn nó lại bị lỗi). Máy chủ DNS của Facebook được thiết kế để thôi quảng bá prefix của chính mình khi không liên lạc được với các trung tâm dữ liệu của Facebook — nên chúng rút đi. Khoảng 15:40 UTC Cloudflare thấy một loạt thay đổi định tuyến; tới 15:58 các prefix chứa máy chủ DNS của Facebook đã biến mất khỏi bảng định tuyến của Internet. Mọi resolver trên thế giới (1.1.1.1, 8.8.8.8, của các nhà mạng) bắt đầu trả SERVFAIL cho facebook.com, và phải tới khoảng 21:20 — chừng năm tiếng rưỡi — các tên mới phân giải lại được. Ta dựng lại cơ chế đó: trung tâm dữ liệu thôi quảng bá dải của mình.</p>
${run('c25-dc-rut', "vtysh -c 'configure terminal'", 2, C)}
${run('c25-isp-rut', "vtysh -c 'show ip bgp'", 3, C)}
<p>Nhà mạng không còn biết tuyến nào tới LabFlow — lẫn máy chủ tên của nó. Người dùng thấy gì:</p>
${run('c25-laptop-rut', 'dig +tries=1', 4, C)}
<p>Không phải "trang chậm" mà là "tên này không còn tồn tại": resolver của nhà mạng không tới được máy chủ tên của LabFlow và trả lời ngay. Resolver nhỏ của ta (dnsmasq) nói <code>REFUSED</code> kèm lỗi DNS mở rộng 23 "Network Error"; các resolver công cộng lớn nói <code>SERVFAIL</code> — với ứng dụng của bạn thì nghĩa như nhau: không có địa chỉ, <code>Could not resolve host</code>. Gọi thẳng IP cũng hỏng, và traceroute dừng ở nhà mạng với <code>!N</code> (network unreachable). Để ý một điểm tinh tế: dải IPv6 của LabFlow vẫn được quảng bá suốt thời gian đó — nhưng không có DNS thì chẳng ai tìm ra địa chỉ. Khi trung tâm dữ liệu quảng bá lại, mọi thứ quay về trong vài giây:</p>
${run('c25-dc-lai', "vtysh -c 'configure terminal'", 1, C)}
${run('c25-laptop-lai', 'dig +short', 2, C)}
${net('bgp', 'withdraw', 'vi', 'Rút dải của trung tâm dữ liệu và theo dõi hậu quả: tuyến biến mất, DNS hỏng, trang biến mất — rồi quảng bá lại.')}
<div class="pitfall co-tieu-de">
<p><strong>"DNS sập" thường không phải lỗi DNS.</strong> Với Facebook, máy chủ DNS vẫn chạy bình thường; chúng không tới được vì tuyến đã bị rút. Khi các tên đột nhiên hỏng với cả một dịch vụ, hãy kiểm cả định tuyến: có tới được IP của máy chủ tên không (<code>dig @IP</code>, <code>traceroute</code>)? Prefix còn được quảng bá không (một looking glass, RIPEstat, Cloudflare Radar)? Và đừng bao giờ để con đường duy nhất để đăng nhập vào sửa mạng lại phụ thuộc chính mạng đó.</p>
</div>

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li>Router BGP chạy một daemon (<code>bgpd</code> của FRR trong lab; phần mềm của hãng trên router phần cứng) giữ các phiên TCP và mọi tuyến nhận được trong RAM — gọi là RIB. Tuyến tốt nhất cho mỗi prefix được đẩy vào bảng chuyển tiếp của nhân (<code>proto bgp</code>), nơi gói tin thật sự được định tuyến.</li>
<li>Một bảng định tuyến Internet đầy đủ có khoảng một triệu prefix IPv4; router lõi giữ nó trong bộ nhớ nhanh đặc biệt trên các chip chuyển tiếp.</li>
<li>Dữ liệu RPKI được phần mềm kiểm tra (validator) tải về từ năm tổ chức đăng ký khu vực, rồi báo cho router biết lời quảng bá nào hợp lệ.</li>
</ul>
${cauNoi('vi', { ...NWC, bai: 'nwc204-1-1-mang-la-gi-thanh-phan-to-po', so: '1.1', ten: 'Mạng là gì: thành phần, tô-pô, các loại mạng', giong: 'Internet là mạng của các mạng do các nhà mạng vận hành', khac: 'NWC204 dừng ở LAN/WAN và coi nhà mạng là một đám mây', them: 'các mạng đó thật sự trao đổi tuyến ra sao — AS, phiên BGP, AS path trong bảng FRR thật, một vụ cướp tuyến, một lần rút tuyến, và RPKI kiểm trên Internet thật' })}

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> thứ Hai, 9 giờ sáng. Khách hàng báo LabFlow "sập" — hết giờ chờ và "could not resolve host". Đội trung tâm dữ liệu thề là phía họ không đổi gì. Bạn có quyền vào các router của lab.</p>
<ol>
<li>Khởi động lại Internet trong một hộp. Trên <code>nfi-isp</code> đọc <code>show bgp ipv4 unicast summary</code> và <code>show ip bgp</code>; ghi AS gốc của từng prefix.</li>
<li>Gây sự cố: <code>docker exec nfi-rogue bash /lab/k/code/ch02/lab2/su-co-b.sh</code> (đừng đọc script vội). Từ laptop thu thập triệu chứng (curl, traceroute, dig). Rồi tìm nguyên nhân chỉ bằng <code>show ip bgp</code> và <code>ip route get</code> trên nhà mạng.</li>
<li>Sửa trên nhà mạng bằng một prefix-list cho láng giềng 192.0.2.66, chứng minh LabFlow chạy lại.</li>
<li>Viết một ghi chú sự cố ba câu, và giải thích lời quảng bá xấu sẽ có trạng thái RPKI nào trên một mạng có kiểm tra.</li>
<li>Thêm: trên <code>nfi-dc</code> rút <code>203.0.113.0/24</code>, quan sát <code>dig</code> và <code>traceroute</code> từ laptop, quảng bá lại và đo mất bao lâu để hồi phục.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra nguyên nhân là AS64511 quảng bá 203.0.113.0/25, sửa bằng bộ lọc, và ghi chú của bạn nhắc tới khớp tiền tố dài nhất và RPKI <em>invalid</em>.</p>
<details><summary>Lời giải</summary>
<p>1) 198.18.0.0/24 → AS64511, 198.51.100.0/24 → chính nhà mạng (path trống, next hop 0.0.0.0), 203.0.113.0/24 → AS64510. 2) Triệu chứng: curl hết giờ, traceroute dừng sau 198.51.100.1, dig không có trả lời. <code>show ip bgp</code> giờ có <code>203.0.113.0/25 via 192.0.2.66, path 64511</code>; <code>ip route get 203.0.113.10</code> ghi <code>via 192.0.2.66</code> — /25 thắng /24 của trung tâm dữ liệu. 3) <code>ip prefix-list FROM-ROGUE seq 10 permit 198.18.0.0/24</code>, <code>neighbor 192.0.2.66 prefix-list FROM-ROGUE in</code>, <code>clear bgp ipv4 unicast 192.0.2.66 soft in</code>; /25 biến mất và curl chạy. 4) "Lúc 9:00, AS64511 quảng bá 203.0.113.0/25, một phần cụ thể hơn của dải 203.0.113.0/24 của LabFlow; theo khớp tiền tố dài nhất, nhà mạng gửi lưu lượng của chúng ta — cả DNS — sang AS64511, nơi nó bị vứt. Chúng ta đã lọc lời quảng bá của AS64511 về đúng các prefix nó sở hữu. Với RPKI, ROA của chúng ta (AS gốc AS64510) sẽ khiến tuyến đó là invalid_asn, và các mạng có kiểm tra đã bỏ nó." 5) Rút tuyến: dig trả REFUSED (EDE 23 Network Error) ngay lập tức, traceroute kết thúc ở <code>198.51.100.1 !N</code>; sau khi quảng bá lại, tuyến và DNS quay về trong vài giây.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['Autonomous System (AS, hệ tự trị)', 'Một mạng dưới một ban quản trị và một chính sách định tuyến, có số hiệu ASN.'],
    ['transit / peering (trung chuyển / ngang hàng)', 'Trả tiền cho mạng lớn hơn để tới mọi nơi / trao đổi thẳng lưu lượng của khách hàng hai bên.'],
    ['IXP (điểm trao đổi Internet)', 'Switch dùng chung nơi nhiều mạng cắm vào để peering (vd VNIX ở Việt Nam).'],
    ['BGP', 'Giao thức các AS dùng để quảng bá prefix tới được cho nhau qua TCP 179.'],
    ['AS path / origin AS (AS gốc)', 'Danh sách AS mà tuyến đã đi qua; AS cuối cùng sở hữu prefix.'],
    ['BGP hijack (cướp tuyến)', 'Quảng bá prefix của người khác (thường cụ thể hơn) để hút lưu lượng của họ.'],
    ['RPKI / ROA', 'Bản ghi có chữ ký cho biết AS nào được sinh ra prefix nào, dài tối đa bao nhiêu.'],
    ['route withdrawal (rút tuyến)', 'Một AS thôi quảng bá một prefix; phần còn lại của Internet quên tuyến đó.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Internet là một mạng lưới các hệ tự trị nối với nhau bằng transit và peering, thường ở các điểm trao đổi.</li>
<li>BGP quảng bá prefix kèm AS path; AS cuối là AS gốc; tuyến tốt nhất được đưa vào bảng của nhân.</li>
<li>BGP tin những gì nó nghe: một lời quảng bá cụ thể hơn thắng ở mọi nơi (YouTube 2008). Bộ lọc và RPKI (ROA + kiểm AS gốc) là hàng phòng thủ; rò rỉ đường đi cần thêm cơ chế khác.</li>
<li>Rút một prefix xoá một mạng khỏi Internet trong vài giây; khi máy chủ DNS biến mất, triệu chứng là "tên không tồn tại" (Facebook 2021).</li>
<li>"DNS sập" có thể là chuyện định tuyến: kiểm khả năng tới máy chủ tên và xem prefix còn được quảng bá không.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc4271', '📄', 'RFC 4271 — Giao thức cổng biên 4 (BGP-4)', 'Giao thức: phiên, cập nhật, AS path, chọn tuyến.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc6811', '📄', 'RFC 6811 — Kiểm tra AS gốc của prefix BGP', 'Router dùng ROA của RPKI để đánh dấu tuyến valid / invalid ra sao.', 'Mở')}
${L('https://www.ripe.net/about-us/news/youtube-hijacking-a-ripe-ncc-ris-case-study/', '📰', 'RIPE NCC — Vụ cướp tuyến YouTube: phân tích của RIS', 'Vụ năm 2008, từng phút một.', 'Mở')}
${L('https://blog.cloudflare.com/october-2021-facebook-outage/', '📰', 'Cloudflare — Facebook đã biến mất khỏi Internet thế nào', 'Rút tuyến BGP và SERVFAIL, nhìn từ 1.1.1.1.', 'Mở')}
${L('https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/', '📰', 'Meta Engineering — Thêm chi tiết về sự cố ngày 4/10', 'Lệnh bảo trì, lỗi của công cụ kiểm duyệt, DNS tự rút tuyến.', 'Mở')}
${L('https://blog.cloudflare.com/cloudflare-1111-incident-on-june-27-2024/', '📰', 'Cloudflare — Sự cố 1.1.1.1 ngày 27/6/2024', 'Một vụ cướp tuyến RPKI bắt được và một vụ rò nó không bắt được.', 'Mở')}
${L('https://isbgpsafeyet.com/', '🛡️', 'Is BGP safe yet?', 'Mạng nào kiểm RPKI — và tự kiểm nhà mạng của bạn.', 'Mở')}
${L('https://vnnic.vn/en/vnix/introduction', '🇻🇳', 'VNNIC — Giới thiệu VNIX', 'Điểm trao đổi Internet quốc gia: Hà Nội, Đà Nẵng, TP. Hồ Chí Minh.', 'Mở')}
</div>
`,
};
