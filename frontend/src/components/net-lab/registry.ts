/**
 * Danh mục mô phỏng của phòng lab mạng — khoá "Networking for Developers" (/courses/networking-for-developers, 31/10/2026).
 * Bài học nhúng bằng <div class="net-lab net-lab-sim-<tên> net-lab-p-<preset> [net-lab-t-<tour>]"> (dựng bằng
 * content/_labs.mjs — hai danh sách PHẢI khớp nhau; labs/registry.test.ts kiểm). Chỉ tên trong danh mục này mới được gắn.
 *
 * Số liệu: capture THẬT từ lab Docker của khoá (client 10.10.1.10 → router → nginx 10.10.2.10:80 → api 10.10.2.20:3000)
 * và curl -w thật tới cuongthai.com — engine/capture.ts. Thứ gì mô phỏng tự tính đều ghi nhãn "tính ra".
 */
import type { LabDef } from '../labs/registry';

export const NET_LABS: Record<string, LabDef> = {
  encap: {
    en: 'Encapsulation: one request, four envelopes', vi: 'Đóng gói: một request, bốn lớp phong bì', chapterEn: 'Packets & layers', chapterVi: 'Gói tin & các tầng',
    descEn: 'A real 149-byte GET goes down the stack (HTTP → TCP → IP → Ethernet), across the router and up to nginx — with the real hex dump, every field explained, what a router changes, and MTU/MSS/segmentation offload.',
    descVi: 'Một GET thật 149 byte đi xuống ngăn xếp (HTTP → TCP → IP → Ethernet), qua router rồi lên tới nginx — kèm hex dump thật, giải nghĩa từng trường, router đổi gì, và MTU/MSS/segmentation offload.',
    presets: ['http', 'hop', 'mtu'],
    load: () => import('./EncapSim'),
  },
  arp: {
    en: 'ARP: from an IP to a MAC', vi: 'ARP: từ IP ra MAC', chapterEn: 'The local network', chapterVi: 'Mạng cục bộ',
    descEn: 'Broadcast question, unicast answer, the switch learning ports, the cache filling in — real tcpdump lines; why you ARP for the ROUTER to reach another network; stale entries and gratuitous ARP.',
    descVi: 'Hỏi phát rộng, trả lời gửi thẳng, công tắc học cổng, bộ đệm được điền — dòng tcpdump thật; vì sao muốn tới mạng khác thì ARP hỏi ROUTER; mục cũ (stale) và gratuitous ARP.',
    presets: ['lan', 'gateway', 'stale'],
    load: () => import('./ArpSim'),
  },
  socket: {
    en: 'Sockets & ports: who gets the packet?', vi: 'Socket & cổng: gói này của ai?', chapterEn: 'Transport', chapterVi: 'Tầng vận chuyển',
    descEn: 'One listening socket and many connections all on port 80, matched by the 4-tuple with a live ss table; bind 127.0.0.1 vs 0.0.0.0 in Docker; running out of ephemeral ports.',
    descVi: 'Một socket nghe và nhiều kết nối cùng ở cổng 80, ghép theo bộ 4 với bảng ss sống; bind 127.0.0.1 hay 0.0.0.0 trong Docker; cạn cổng tạm.',
    presets: ['demux', 'bind', 'ephemeral'],
    load: () => import('./SocketSim'),
  },
  waterfall: {
    en: 'Type a URL, press Enter: the timing waterfall', vi: 'Gõ URL, bấm Enter: biểu đồ thác thời gian', chapterEn: 'The whole journey', chapterVi: 'Cả hành trình',
    descEn: 'DNS → TCP → TLS → request → first byte → download from real curl -w numbers (cold, reused connection, far away), the cumulative-timing trap, and an RTT slider showing why distance dominates.',
    descVi: 'DNS → TCP → TLS → request → byte đầu → tải về từ số curl -w thật (lần đầu, dùng lại kết nối, máy ở xa), cái bẫy số cộng dồn, và thanh RTT cho thấy vì sao khoảng cách quyết định.',
    presets: ['cold', 'warm', 'far'],
    load: () => import('./WaterfallSim'),
  },
  // ── Chương 2: địa chỉ, định tuyến, NAT, IPv6, BGP — "Internet in a box" (01/11/2026), số liệu engine/capture2.ts ──
  subnet: {
    en: 'Subnets: address, mask, network', vi: 'Subnet: địa chỉ, mặt nạ, mạng', chapterEn: 'Addresses & routing', chapterVi: 'Địa chỉ & định tuyến',
    descEn: 'An IPv4 address in 32 bits, AND with the mask, broadcast, usable hosts (/31, /32) — exactly like cidr.py in the lab; “is it on my network?” and the real /16-instead-of-/24 bug; carving 10.20.0.0/22 with VLSM.',
    descVi: 'Địa chỉ IPv4 thành 32 bit, AND với mặt nạ, broadcast, số máy dùng được (/31, /32) — đúng như cidr.py trong lab; “có cùng mạng không?” và lỗi thật gõ /16 thay /24; chia 10.20.0.0/22 bằng VLSM.',
    presets: ['mask', 'same', 'vlsm'],
    load: () => import('./SubnetSim'),
  },
  route: {
    en: 'Routing: longest prefix, traceroute, loops', vi: 'Định tuyến: tiền tố dài nhất, traceroute, vòng lặp', chapterEn: 'Addresses & routing', chapterVi: 'Địa chỉ & định tuyến',
    descEn: 'Real routing tables of a laptop, a home router and an ISP: which line wins and why; traceroute TTL by TTL with real ICMP replies, a silent hop “* * *”; a forgotten /32 that makes packets ping-pong until TTL runs out.',
    descVi: 'Bảng định tuyến thật của laptop, router nhà và nhà mạng: dòng nào thắng và vì sao; traceroute từng TTL với câu trả lời ICMP thật, chặng im lặng “* * *”; một tuyến /32 bị quên làm gói chạy qua lại tới khi hết TTL.',
    presets: ['lookup', 'trace', 'loop'],
    load: () => import('./RouteSim'),
  },
  nat: {
    en: 'NAT: many devices, one public IP', vi: 'NAT: nhiều máy, một IP công cộng', chapterEn: 'Addresses & routing', chapterVi: 'Địa chỉ & định tuyến',
    descEn: 'Packet headers before and after the home router, conntrack rows appearing, the real port collision 41000 → 4734; why the Internet cannot call your laptop and how port forwarding (DNAT) fixes it; carrier-grade NAT on 4G; docker -p.',
    descVi: 'Header gói trước và sau router nhà, các dòng conntrack hiện ra, va chạm cổng thật 41000 → 4734; vì sao Internet không gọi được laptop của bạn và mở cổng (DNAT) sửa thế nào; NAT của nhà mạng trên 4G; docker -p.',
    presets: ['home', 'inbound', 'cgnat'],
    load: () => import('./NatSim'),
  },
  ipv6: {
    en: 'IPv6: addresses, Happy Eyeballs, localhost', vi: 'IPv6: địa chỉ, Happy Eyeballs, localhost', chapterEn: 'Addresses & routing', chapterVi: 'Địa chỉ & định tuyến',
    descEn: 'Compress an IPv6 address step by step (the “::” trap), /64 = 18 446 744 073 709 551 616 addresses, link-local from the MAC, NDP instead of ARP; a silently broken IPv6 path and real fallback timings; why localhost:5000 gives ECONNREFUSED ::1.',
    descVi: 'Viết gọn địa chỉ IPv6 từng bước (bẫy “::”), /64 = 18 446 744 073 709 551 616 địa chỉ, link-local sinh từ MAC, NDP thay ARP; đường IPv6 hỏng lặng lẽ và thời gian lùi về IPv4 đo thật; vì sao localhost:5000 báo ECONNREFUSED ::1.',
    presets: ['addr', 'happy', 'localhost'],
    load: () => import('./Ipv6Sim'),
  },
  bgp: {
    en: 'BGP: how the Internet finds a network', vi: 'BGP: Internet tìm một mạng thế nào', chapterEn: 'Addresses & routing', chapterVi: 'Địa chỉ & định tuyến',
    descEn: 'Three ASes on an exchange point fill their BGP tables (real show ip bgp): AS path and origin; a more-specific /25 hijack that black-holes LabFlow, fixed by a prefix-list, and RPKI with real RIPEstat data for cuongthai.com; a Facebook-style withdrawal.',
    descVi: 'Ba AS trên một điểm trao đổi điền bảng BGP (show ip bgp thật): AS path và AS gốc; vụ cướp tuyến /25 cụ thể hơn đẩy LabFlow vào hố đen, sửa bằng prefix-list, và RPKI với số liệu RIPEstat thật của cuongthai.com; rút tuyến kiểu Facebook.',
    presets: ['announce', 'hijack', 'withdraw'],
    load: () => import('./BgpSim'),
  },
  // ── Chương 3: DNS — cây DNS riêng của lab (dns.yml), số liệu engine/capture3.ts ──
  dns: {
    en: 'DNS: who answers a name?', vi: 'DNS: ai trả lời một cái tên?', chapterEn: 'DNS', chapterVi: 'DNS',
    descEn: 'Replay every packet the ISP’s resolver sent for one lookup — priming, QNAME minimisation, referrals, the aa answer, DNSSEC keys — then the second lookup from cache (9 questions vs 0); ask, wait and flush a cache; see why /etc/hosts and search/ndots make your program disagree with dig.',
    descVi: 'Phát lại từng gói resolver nhà mạng gửi cho một lần tra — mồi gốc, QNAME minimisation, lời giới thiệu, câu trả lời aa, khoá DNSSEC — rồi lần tra thứ hai từ cache (9 câu so với 0); tự hỏi, chờ và xoá cache; thấy vì sao /etc/hosts và search/ndots làm chương trình của bạn nói khác dig.',
    presets: ['trace', 'cache', 'stub'],
    load: () => import('./DnsSim'),
  },
  zone: {
    en: 'Zone files: records, rules, secondaries', vi: 'Tệp vùng: bản ghi, quy tắc, máy phụ', chapterEn: 'DNS', chapterVi: 'DNS',
    descEn: 'Eleven record types with real dig answers and their rules; four classic mistakes through named-checkzone — a CNAME at the apex, CNAME next to A, MX to an IP, the missing final dot that still loads “OK”; a forgotten SOA serial that splits ns1 and ns2 until NOTIFY + AXFR.',
    descVi: 'Mười một loại bản ghi kèm câu trả lời dig thật và quy tắc của chúng; bốn lỗi kinh điển qua named-checkzone — CNAME ở đỉnh, CNAME cạnh A, MX trỏ IP, quên dấu chấm cuối mà vẫn nạp “OK”; quên serial SOA làm ns1 và ns2 nói khác nhau tới khi NOTIFY + AXFR.',
    presets: ['records', 'apex', 'serial'],
    load: () => import('./ZoneSim'),
  },
  ttl: {
    en: 'TTL: why DNS changes are slow', vi: 'TTL: vì sao đổi DNS lại chậm', chapterEn: 'DNS', chapterVi: 'DNS',
    descEn: 'Drag time and watch a resolver count a TTL down while the authoritative server always says 120; move a server in the wrong order (old IP for 1 min 45 s, measured) and the right one; a name that “does not exist” after you created it — negative caching and aggressive NSEC.',
    descVi: 'Kéo thời gian và xem resolver đếm ngược TTL trong khi máy chủ tên luôn nói 120; chuyển máy chủ sai thứ tự (IP cũ còn 1 phút 45 giây, đo thật) và đúng thứ tự; một cái tên “không tồn tại” sau khi bạn đã tạo — cache âm và aggressive NSEC.',
    presets: ['countdown', 'change', 'negative'],
    load: () => import('./TtlSim'),
  },
  anycast: {
    en: 'Anycast, GeoDNS and round-robin DNS', vi: 'Anycast, GeoDNS và DNS round-robin', chapterEn: 'DNS', chapterVi: 'DNS',
    descEn: 'One public-DNS address announced from Hanoi and Singapore with real BGP: who reaches which site, and failover in one second; a CDN’s GeoDNS that follows the resolver, not the user; two A records with a dead server — curl 0.2 s, Node 0.26 s, Python 3 s.',
    descVi: 'Một địa chỉ DNS công cộng được quảng bá từ Hà Nội và Singapore bằng BGP thật: ai tới điểm nào, và chuyển dự phòng trong một giây; GeoDNS của CDN đi theo resolver chứ không theo người dùng; hai bản ghi A với một máy chết — curl 0,2 s, Node 0,26 s, Python 3 s.',
    presets: ['anycast', 'geodns', 'roundrobin'],
    load: () => import('./AnycastSim'),
  },
  dnssec: {
    en: 'DNSSEC and encrypted DNS', vi: 'DNSSEC và DNS mã hoá', chapterEn: 'DNS', chapterVi: 'DNS',
    descEn: 'Walk a real chain of trust from the root anchor to an A record (the parent’s DS = the hash we compute); break it the way operators do — expired signatures, SERVFAIL with EDE 7, +cd, the bogus cache; and see what plain DNS, DoT and DoH reveal on the wire.',
    descVi: 'Đi một chuỗi tin cậy thật từ mỏ neo gốc tới bản ghi A (DS của vùng cha = mã băm ta tự tính); làm hỏng nó như người vận hành hay làm — chữ ký hết hạn, SERVFAIL kèm EDE 7, +cd, cache bogus; và xem DNS thường, DoT, DoH để lộ gì trên dây.',
    presets: ['chain', 'expired', 'private'],
    load: () => import('./DnssecSim'),
  },
};
