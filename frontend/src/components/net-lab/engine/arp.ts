/**
 * arp — engine thuần cho mô phỏng `arp`: một mạng LAN (cầu Docker = công tắc ảo) với client, client2, router.
 *
 *   • lan     — ping hàng xóm cùng mạng với bộ đệm trống: tra bảng định tuyến → ARP hỏi phát rộng → công tắc học cổng
 *               + phát tràn → chỉ client2 trả lời (gửi thẳng) → bộ đệm REACHABLE → ICMP gửi thẳng. Dòng tcpdump THẬT.
 *   • gateway — ping 10.10.2.10 (mạng khác): bảng định tuyến nói "qua 10.10.1.254" ⇒ ARP hỏi ROUTER, không bao giờ hỏi
 *               10.10.2.10; MAC đích = router, IP đích = web. Dòng tcpdump THẬT (kể cả lúc router hỏi lại client).
 *   • stale   — client2 bị thay bằng máy mới cùng IP, MAC mới: trạng thái hàng xóm của Linux (NUD)
 *               REACHABLE → STALE → DELAY → PROBE → FAILED → hỏi lại, hoặc gratuitous ARP sửa ngay. Thời gian là
 *               GIÁ TRỊ MẶC ĐỊNH của nhân (TÍNH RA, không đo): base_reachable_time 30 s (ngẫu nhiên 15–45 s),
 *               delay_first_probe_time 5 s, retrans_time 1 s, ucast_solicit 3.
 * Mỗi bước là một ảnh chụp trạng thái — bộ phát chỉ dời con trỏ.
 */
import { ARP_LINES, IP, MAC, NEIGH_AFTER } from './capture';

export type HostId = 'client' | 'client2' | 'router' | 'newbox';
export type Nud = 'INCOMPLETE' | 'REACHABLE' | 'STALE' | 'DELAY' | 'PROBE' | 'FAILED';
export interface Neigh { ip: string; mac: string; state: Nud }
export interface Host { id: HostId; name: string; ip: string; mac: string; port: number; cache: Neigh[]; gone?: boolean }
export interface WireFrame {
  kind: 'arp-req' | 'arp-rep' | 'icmp' | 'garp' | 'probe';
  from: HostId; dstMac: string; srcMac: string;
  /** cổng của công tắc nhận được frame (đã giao) */
  to: number[];
  /** frame bị bỏ ở nơi nhận (MAC đích không phải của nó / không ai nhận) */
  dropped?: number[];
  label: string;
  ipSrc?: string; ipDst?: string;
}
export interface ArpStep {
  hosts: Host[];
  /** bảng MAC của công tắc: MAC → cổng */
  fdb: Array<{ mac: string; port: number }>;
  frame?: WireFrame;
  /** dòng tcpdump thật ứng với bước này (chỉ số trong ARP_LINES) */
  lines: number[];
  /** dòng nào là bản phản chiếu do cầu ảo Docker Desktop vọng lại */
  echoLines?: number[];
  /** dòng tính ra (không phải capture) — kịch bản stale */
  computed?: string[];
  route?: string;
  t?: number;
  focus: HostId | 'switch';
  where: string;
  call: string; en: string; vi: string;
  tone?: 'ok' | 'warn' | 'bad';
  sfx?: 'whoosh' | 'pop' | 'hit' | 'miss' | 'oops' | 'blip-fetch' | 'blip-decode' | 'tick' | 'right';
}

export const NUD_DEFAULTS = { baseReachableS: 30, minS: 15, maxS: 45, delayFirstProbeS: 5, retransS: 1, ucastSolicit: 3, mcastSolicit: 3, bridgeAgeingS: 300 } as const;
export const NEW_MAC = '02:00:0a:0a:01:99';
export const BCAST = 'ff:ff:ff:ff:ff:ff';

const ROUTES = ['default via 10.10.1.254 dev eth0', '10.10.1.0/24 dev eth0 proto kernel scope link src 10.10.1.10'];
export const ROUTE_TABLE = ROUTES;

function initHosts(): Host[] {
  return [
    { id: 'client', name: 'client', ip: IP.client, mac: MAC.client, port: 1, cache: [] },
    { id: 'client2', name: 'client2', ip: IP.client2, mac: MAC.client2, port: 2, cache: [] },
    { id: 'router', name: 'router', ip: IP.routerLan, mac: MAC.routerLan, port: 3, cache: [] },
  ];
}

class Script {
  hosts: Host[] = initHosts();
  fdb: Array<{ mac: string; port: number }> = [];
  out: ArpStep[] = [];
  host(id: HostId) { return this.hosts.find((h) => h.id === id)!; }
  setNeigh(id: HostId, ip: string, mac: string, state: Nud) {
    const h = this.host(id);
    const e = h.cache.find((x) => x.ip === ip);
    if (e) { e.mac = mac; e.state = state; } else h.cache.push({ ip, mac, state });
  }
  learn(mac: string, port: number) {
    const e = this.fdb.find((x) => x.mac === mac);
    if (e) e.port = port; else this.fdb.push({ mac, port });
  }
  /** cổng công tắc sẽ đưa frame tới: phát rộng / MAC lạ ⇒ mọi cổng khác (flood) */
  forward(dstMac: string, inPort: number): number[] {
    const ports = this.hosts.filter((h) => !h.gone).map((h) => h.port);
    if (dstMac === BCAST) return ports.filter((p) => p !== inPort);
    const e = this.fdb.find((x) => x.mac === dstMac);
    return e ? [e.port] : ports.filter((p) => p !== inPort);
  }
  push(s: Omit<ArpStep, 'hosts' | 'fdb' | 'lines'> & { lines?: number[] }) {
    this.out.push({ lines: [], ...s, hosts: this.hosts.map((h) => ({ ...h, cache: h.cache.map((c) => ({ ...c })) })), fdb: this.fdb.map((x) => ({ ...x })) });
  }
}

export function lanScript(): ArpStep[] {
  const S = new Script();
  S.push({ focus: 'client', where: 'arp-cache', call: 'ip neigh flush all; ping -c1 10.10.1.11',
    en: 'Every host keeps a small table “IP → MAC” (the ARP cache, `ip neigh`). Ours was just emptied. We ping client2, a neighbour on the same network. Ping sends an ICMP packet — but a packet on Ethernet needs a destination MAC, and we do not know it.',
    vi: 'Máy nào cũng giữ một bảng nhỏ “IP → MAC” (bộ đệm ARP, `ip neigh`). Bảng của ta vừa bị xoá sạch. Ta ping client2, một hàng xóm cùng mạng. Ping gửi một gói ICMP — nhưng gói trên Ethernet cần MAC đích, mà ta chưa biết.', sfx: 'blip-fetch' });
  S.push({ focus: 'client', where: 'tcp-stack', route: ROUTES[1], call: 'ip route get 10.10.1.11',
    en: 'First the routing table: 10.10.1.11 is inside 10.10.1.0/24, our own network (“scope link” = directly connected). So we can deliver it ourselves — we need client2’s OWN MAC.',
    vi: 'Trước hết là bảng định tuyến: 10.10.1.11 nằm trong 10.10.1.0/24, mạng của chính mình (“scope link” = nối trực tiếp). Vậy ta tự giao được — cần MAC của CHÍNH client2.', sfx: 'blip-decode' });
  S.setNeigh('client', IP.client2, '', 'INCOMPLETE');
  S.learn(MAC.client, 1);
  S.push({ focus: 'switch', where: 'wire', lines: [0, 1], echoLines: [1], frame: { kind: 'arp-req', from: 'client', srcMac: MAC.client, dstMac: BCAST, to: S.forward(BCAST, 1), dropped: [3], label: 'who-has 10.10.1.11 tell 10.10.1.10' },
    call: 'ARP request → ff:ff:ff:ff:ff:ff',
    en: 'The cache entry is INCOMPLETE and an ARP request goes to ff:ff:ff:ff:ff:ff — the broadcast MAC, “everyone on this network”. The switch learns “02:00:0a:0a:01:0a is on port 1” and, because it is a broadcast, floods it out of every other port.',
    vi: 'Mục trong bộ đệm ở trạng thái INCOMPLETE và một câu hỏi ARP đi tới ff:ff:ff:ff:ff:ff — MAC phát rộng, “mọi người trong mạng này”. Công tắc học “02:00:0a:0a:01:0a ở cổng 1” và vì đây là phát rộng, nó phát tràn ra mọi cổng khác.', sfx: 'whoosh' });
  S.setNeigh('client2', IP.client, MAC.client, 'STALE');
  S.push({ focus: 'client2', where: 'arp-cache', lines: [0], frame: { kind: 'arp-req', from: 'client', srcMac: MAC.client, dstMac: BCAST, to: [2, 3], dropped: [3], label: 'who-has 10.10.1.11' },
    call: 'client2: "10.10.1.11 — that is me"; router: ignores',
    en: 'Everyone receives it. The router reads it, sees “who has 10.10.1.11?” — not its IP — and ignores it. client2 recognises its own IP. It also writes the asker into its own cache (the question carried the client’s MAC).',
    vi: 'Mọi máy đều nhận. Router đọc, thấy “ai có 10.10.1.11?” — không phải IP của nó — nên bỏ qua. client2 nhận ra IP của mình. Nó còn ghi luôn người hỏi vào bộ đệm của nó (câu hỏi có mang MAC của client).', sfx: 'pop' });
  S.learn(MAC.client2, 2);
  S.setNeigh('client', IP.client2, MAC.client2, 'REACHABLE');
  S.push({ focus: 'switch', where: 'wire', lines: [2], frame: { kind: 'arp-rep', from: 'client2', srcMac: MAC.client2, dstMac: MAC.client, to: S.forward(MAC.client, 2), label: '10.10.1.11 is-at 02:00:0a:0a:01:0b' },
    call: 'ARP reply → 02:00:0a:0a:01:0a (unicast)',
    en: 'The answer is NOT broadcast: client2 sends it straight to the asker’s MAC. The switch learns “02:00:0a:0a:01:0b is on port 2” and, already knowing port 1, forwards it only there.',
    vi: 'Câu trả lời KHÔNG phát rộng: client2 gửi thẳng tới MAC người hỏi. Công tắc học “02:00:0a:0a:01:0b ở cổng 2” và vì đã biết cổng 1, chỉ chuyển ra đúng cổng đó.', sfx: 'hit' });
  S.push({ focus: 'client', where: 'arp-cache', lines: [3], frame: { kind: 'icmp', from: 'client', srcMac: MAC.client, dstMac: MAC.client2, to: S.forward(MAC.client2, 1), label: 'ICMP echo request', ipSrc: IP.client, ipDst: IP.client2 },
    call: '10.10.1.11 lladdr 02:00:0a:0a:01:0b REACHABLE',
    en: 'Cache: 10.10.1.11 → 02:00:0a:0a:01:0b, REACHABLE. The waiting ping finally leaves: a 98-byte frame addressed to client2’s MAC. The switch sends it only to port 2 — the router never sees it.',
    vi: 'Bộ đệm: 10.10.1.11 → 02:00:0a:0a:01:0b, REACHABLE. Gói ping đang chờ cuối cùng cũng đi: frame 98 byte gửi tới MAC của client2. Công tắc chỉ đưa ra cổng 2 — router không hề thấy.', sfx: 'blip-fetch' });
  S.push({ focus: 'client2', where: 'wire', lines: [4], frame: { kind: 'icmp', from: 'client2', srcMac: MAC.client2, dstMac: MAC.client, to: S.forward(MAC.client, 2), label: 'ICMP echo reply', ipSrc: IP.client2, ipDst: IP.client },
    call: 'ICMP echo reply', tone: 'ok',
    en: 'The reply comes straight back — client2 already had our MAC from the question, so it did not need to ask. From the first ARP question to the ping reply: 68 µs in the real capture. The next pings skip ARP entirely.',
    vi: 'Câu trả lời quay về thẳng — client2 đã có MAC của ta từ câu hỏi nên không phải hỏi. Từ câu hỏi ARP đầu tiên tới lúc ping được trả lời: 68 µs trong capture thật. Các lần ping sau bỏ qua ARP hẳn.', sfx: 'right' });
  return S.out;
}

export function gatewayScript(): ArpStep[] {
  const S = new Script();
  // từ lần ping trước: client đã biết client2
  S.setNeigh('client', IP.client2, MAC.client2, 'REACHABLE');
  S.setNeigh('client2', IP.client, MAC.client, 'STALE');
  S.learn(MAC.client, 1); S.learn(MAC.client2, 2);
  S.push({ focus: 'client', where: 'arp-cache', call: 'ping -c1 10.10.2.10',
    en: 'Now ping the web server 10.10.2.10. It lives on ANOTHER network (10.10.2.0/24, behind the router). Our cache knows client2 but nobody else.',
    vi: 'Giờ ping máy web 10.10.2.10. Nó ở một mạng KHÁC (10.10.2.0/24, sau router). Bộ đệm của ta biết client2 nhưng không biết ai khác.', sfx: 'blip-fetch' });
  S.push({ focus: 'client', where: 'tcp-stack', route: ROUTES[0], call: 'ip route get 10.10.2.10 → via 10.10.1.254',
    en: 'Routing table: 10.10.2.10 is not in 10.10.1.0/24 ⇒ use the default route “via 10.10.1.254”. So the packet must be handed to the ROUTER. Asking “who has 10.10.2.10?” would be useless: that machine is not on our wire and would never hear us.',
    vi: 'Bảng định tuyến: 10.10.2.10 không thuộc 10.10.1.0/24 ⇒ dùng đường mặc định “via 10.10.1.254”. Vậy gói phải giao cho ROUTER. Hỏi “ai có 10.10.2.10?” là vô ích: máy đó không ở trên dây của ta, chẳng bao giờ nghe thấy.', sfx: 'blip-decode' });
  S.setNeigh('client', IP.routerLan, '', 'INCOMPLETE');
  S.push({ focus: 'switch', where: 'wire', lines: [5, 6], echoLines: [6], frame: { kind: 'arp-req', from: 'client', srcMac: MAC.client, dstMac: BCAST, to: S.forward(BCAST, 1), dropped: [2], label: 'who-has 10.10.1.254 tell 10.10.1.10' },
    call: 'ARP request: who-has 10.10.1.254',
    en: 'So the ARP question is about the ROUTER’s IP, 10.10.1.254. Look at the real line: “who-has 10.10.1.254”. 10.10.2.10 never appears in any ARP on this network.',
    vi: 'Vậy câu hỏi ARP là về IP của ROUTER, 10.10.1.254. Nhìn dòng thật: “who-has 10.10.1.254”. 10.10.2.10 không hề xuất hiện trong ARP nào ở mạng này.', sfx: 'whoosh' });
  S.learn(MAC.routerLan, 3);
  S.setNeigh('router', IP.client, MAC.client, 'STALE');
  S.setNeigh('client', IP.routerLan, MAC.routerLan, 'REACHABLE');
  S.push({ focus: 'router', where: 'arp-cache', lines: [7], frame: { kind: 'arp-rep', from: 'router', srcMac: MAC.routerLan, dstMac: MAC.client, to: S.forward(MAC.client, 3), label: '10.10.1.254 is-at 02:00:0a:0a:01:fe' },
    call: 'ARP reply: 10.10.1.254 is-at 02:00:0a:0a:01:fe',
    en: 'The router answers with the MAC of its LAN card. Our cache: 10.10.1.254 → 02:00:0a:0a:01:fe.',
    vi: 'Router trả lời bằng MAC của card phía LAN của nó. Bộ đệm của ta: 10.10.1.254 → 02:00:0a:0a:01:fe.', sfx: 'hit' });
  S.push({ focus: 'client', where: 'nic-frame', lines: [8], frame: { kind: 'icmp', from: 'client', srcMac: MAC.client, dstMac: MAC.routerLan, to: S.forward(MAC.routerLan, 1), label: 'ICMP echo request', ipSrc: IP.client, ipDst: IP.web },
    call: 'eth.dst = router · ip.dst = web', tone: 'ok',
    en: 'The aha: in this one frame the destination MAC is the ROUTER (02:00:0a:0a:01:fe) while the destination IP is the WEB server (10.10.2.10). MAC = the next hop, IP = the final destination. The router will put a new Ethernet envelope on it for the other network.',
    vi: 'Điểm mấu chốt: trong cùng một frame, MAC đích là ROUTER (02:00:0a:0a:01:fe) còn IP đích là máy WEB (10.10.2.10). MAC = chặng kế tiếp, IP = đích cuối cùng. Router sẽ bọc phong bì Ethernet mới để sang mạng bên kia.', sfx: 'right' });
  S.push({ focus: 'router', where: 'wire', lines: [9], frame: { kind: 'icmp', from: 'router', srcMac: MAC.routerLan, dstMac: MAC.client, to: S.forward(MAC.client, 3), label: 'ICMP echo reply', ipSrc: IP.web, ipDst: IP.client },
    call: 'ICMP echo reply (from 10.10.2.10, via the router)',
    en: 'The reply: IP source is the web server, but the frame comes from the router’s MAC — the router forwarded it onto our network. The router already knew our MAC: it learned it from our question.',
    vi: 'Câu trả lời: IP nguồn là máy web, nhưng frame đến từ MAC của router — router chuyển nó vào mạng của ta. Router đã biết MAC của ta: nó học được từ câu hỏi của ta.', sfx: 'pop' });
  S.setNeigh('router', IP.client, MAC.client, 'REACHABLE');
  S.push({ focus: 'router', where: 'arp-cache', lines: [10, 11], frame: { kind: 'probe', from: 'router', srcMac: MAC.routerLan, dstMac: MAC.client, to: S.forward(MAC.client, 3), label: 'who-has 10.10.1.10 (unicast)' },
    call: 'router → client: who-has 10.10.1.10 (unicast)',
    en: 'Later the router asks “who has 10.10.1.10?” — but sent straight TO our MAC, not broadcast. It already has the MAC (learned from our question) and only checks that the entry is still valid. Linux calls this a probe. We confirm, and the entry is REACHABLE on both sides.',
    vi: 'Một lúc sau router hỏi “ai có 10.10.1.10?” — nhưng gửi thẳng TỚI MAC của ta, không phát rộng. Nó đã có MAC (học từ câu hỏi của ta) và chỉ kiểm xem mục đó còn đúng không. Linux gọi đây là probe (dò). Ta xác nhận, và mục ở hai phía đều REACHABLE.', sfx: 'blip-decode' });
  S.push({ focus: 'client', where: 'arp-cache', computed: [...NEIGH_AFTER], call: 'ip neigh', tone: 'ok',
    en: 'Our final cache (real `ip neigh` output): client2 and the router. Never 10.10.2.10 — machines on other networks are reached through the router’s MAC.',
    vi: 'Bộ đệm cuối cùng của ta (output `ip neigh` thật): client2 và router. Không bao giờ có 10.10.2.10 — máy ở mạng khác được với tới qua MAC của router.', sfx: 'right' });
  return S.out;
}

export function staleScript(garp: boolean): ArpStep[] {
  const S = new Script();
  const D = NUD_DEFAULTS;
  S.setNeigh('client', IP.client2, MAC.client2, 'REACHABLE');
  S.learn(MAC.client, 1); S.learn(MAC.client2, 2); S.learn(MAC.routerLan, 3);
  S.push({ t: 0, focus: 'client', where: 'arp-cache', call: '10.10.1.11 lladdr 02:00:0a:0a:01:0b REACHABLE',
    en: `The cache entry for client2 was just confirmed: REACHABLE. Linux trusts it for reachable_time — a random value between ${D.minS} and ${D.maxS} s (base_reachable_time = ${D.baseReachableS} s). This run uses ${D.baseReachableS} s. (All times here are kernel defaults, computed — not measured.)`,
    vi: `Mục của client2 vừa được xác nhận: REACHABLE. Linux tin nó trong reachable_time — một giá trị ngẫu nhiên từ ${D.minS} tới ${D.maxS} s (base_reachable_time = ${D.baseReachableS} s). Lần chạy này dùng ${D.baseReachableS} s. (Mọi mốc thời gian ở đây là mặc định của nhân, tính ra — không đo.)`, sfx: 'blip-fetch' });
  const c2 = S.host('client2');
  c2.gone = true;
  S.hosts.push({ id: 'newbox', name: 'new client2', ip: IP.client2, mac: NEW_MAC, port: 2, cache: [] });
  S.push({ t: 5, focus: 'newbox', where: 'nic-frame', call: 'client2 replaced: same IP, new card',
    en: `t = 5 s: client2 is unplugged and a NEW machine takes its place with the SAME IP 10.10.1.11 but a different network card: MAC ${NEW_MAC} (example). Our cache still says 02:00:0a:0a:01:0b — and so does the switch’s table.`,
    vi: `t = 5 s: client2 bị rút ra và một máy MỚI thế chỗ với CÙNG IP 10.10.1.11 nhưng card mạng khác: MAC ${NEW_MAC} (ví dụ). Bộ đệm của ta vẫn ghi 02:00:0a:0a:01:0b — bảng của công tắc cũng vậy.`, sfx: 'oops', tone: 'warn' });
  if (garp) {
    S.learn(NEW_MAC, 2);
    S.setNeigh('client', IP.client2, NEW_MAC, 'STALE');
    S.push({ t: 5, focus: 'switch', where: 'wire', frame: { kind: 'garp', from: 'newbox', srcMac: NEW_MAC, dstMac: BCAST, to: S.forward(BCAST, 2), label: 'gratuitous ARP: 10.10.1.11 is-at 02:00:0a:0a:01:99' },
      computed: [`${NEW_MAC} > ff:ff:ff:ff:ff:ff, ethertype ARP (0x0806), length 42: Request who-has 10.10.1.11 tell 10.10.1.11, length 28`],
      call: 'arping -U -I eth0 10.10.1.11   (gratuitous ARP)',
      en: 'The fix: the new machine announces itself with a gratuitous ARP — a broadcast nobody asked for, saying “10.10.1.11 is at my new MAC”. The switch re-learns port 2; Linux updates the EXISTING entry to the new MAC (state STALE, arp_accept=0 only forbids creating NEW entries).',
      vi: 'Cách sửa: máy mới tự giới thiệu bằng gratuitous ARP — một lời phát rộng không ai hỏi, nói “10.10.1.11 ở MAC mới của tôi”. Công tắc học lại cổng 2; Linux cập nhật mục SẴN CÓ sang MAC mới (trạng thái STALE; arp_accept=0 chỉ cấm tạo mục MỚI).', sfx: 'whoosh', tone: 'ok' });
    S.setNeigh('client', IP.client2, NEW_MAC, 'DELAY');
    S.push({ t: 10, focus: 'client', where: 'arp-cache', frame: { kind: 'icmp', from: 'client', srcMac: MAC.client, dstMac: NEW_MAC, to: [2], label: 'ICMP echo request → new MAC', ipSrc: IP.client, ipDst: IP.client2 },
      call: 'ping 10.10.1.11 → reply ✓', tone: 'ok',
      en: 't = 10 s: we ping. The STALE entry is used immediately — and it now holds the right MAC, so the reply comes back. State DELAY: Linux gives upper layers 5 s to confirm the neighbour.',
      vi: 't = 10 s: ta ping. Mục STALE được dùng ngay — và nó giờ giữ MAC đúng, nên có trả lời. Trạng thái DELAY: Linux cho tầng trên 5 s để xác nhận hàng xóm.', sfx: 'hit' });
    S.setNeigh('client', IP.client2, NEW_MAC, 'REACHABLE');
    S.push({ t: 15, focus: 'client', where: 'arp-cache', frame: { kind: 'probe', from: 'client', srcMac: MAC.client, dstMac: NEW_MAC, to: [2], label: 'unicast probe → answered' },
      call: '10.10.1.11 lladdr 02:00:0a:0a:01:99 REACHABLE', tone: 'ok',
      en: 't = 15 s: ping gives no such confirmation, so one unicast probe goes to the new MAC; the new machine answers ⇒ REACHABLE. Zero pings lost. This is why failover systems (keepalived, cloud IP moves) send gratuitous ARP.',
      vi: 't = 15 s: ping không xác nhận kiểu đó, nên một probe gửi thẳng tới MAC mới; máy mới trả lời ⇒ REACHABLE. Không mất gói ping nào. Vì vậy các hệ thống chuyển dự phòng (keepalived, đổi IP trên cloud) luôn gửi gratuitous ARP.', sfx: 'right' });
    return S.out;
  }
  S.setNeigh('client', IP.client2, MAC.client2, 'STALE');
  S.push({ t: D.baseReachableS, focus: 'client', where: 'arp-cache', call: `t = ${D.baseReachableS} s: REACHABLE → STALE`,
    en: 'reachable_time is over: the entry becomes STALE. It is NOT deleted and nothing is sent — STALE just means “probably still right, check it next time we use it”.',
    vi: 'Hết reachable_time: mục chuyển sang STALE. Nó KHÔNG bị xoá và không có gì được gửi — STALE chỉ có nghĩa “chắc vẫn đúng, lần dùng tới thì kiểm”.', sfx: 'tick', tone: 'warn' });
  S.setNeigh('client', IP.client2, MAC.client2, 'DELAY');
  S.push({ t: 40, focus: 'switch', where: 'wire', frame: { kind: 'icmp', from: 'client', srcMac: MAC.client, dstMac: MAC.client2, to: [2], dropped: [2], label: 'ICMP → OLD MAC (lost)', ipSrc: IP.client, ipDst: IP.client2 },
    call: 'ping 10.10.1.11 … (no reply)', tone: 'bad',
    en: 't = 40 s: we ping. Linux uses the STALE entry RIGHT AWAY (no waiting) ⇒ the frame goes to the OLD MAC. The switch still maps that MAC to port 2, so it lands on the new machine — which drops it: not its MAC. State DELAY.',
    vi: 't = 40 s: ta ping. Linux dùng mục STALE NGAY (không chờ) ⇒ frame đi tới MAC CŨ. Công tắc vẫn ánh xạ MAC đó về cổng 2, nên nó tới máy mới — và máy mới bỏ đi: không phải MAC của nó. Trạng thái DELAY.', sfx: 'miss' });
  S.setNeigh('client', IP.client2, MAC.client2, 'PROBE');
  for (let k = 0; k < D.ucastSolicit; k++) {
    S.push({ t: 45 + k * D.retransS, focus: 'client', where: 'arp-cache', frame: { kind: 'probe', from: 'client', srcMac: MAC.client, dstMac: MAC.client2, to: [2], dropped: [2], label: `unicast probe ${k + 1}/${D.ucastSolicit} → old MAC` },
      call: `PROBE ${k + 1}/${D.ucastSolicit}: who-has 10.10.1.11 → 02:00:0a:0a:01:0b`, tone: 'bad',
      en: k === 0
        ? `t = 45 s: ${D.delayFirstProbeS} s in DELAY (delay_first_probe_time) and no confirmation ⇒ PROBE. Linux asks — UNICAST, straight to the old MAC — up to ${D.ucastSolicit} times (ucast_solicit), one per second (retrans_time). Nobody owns that MAC any more.`
        : `t = ${45 + k} s: probe ${k + 1}, still no answer. Every ping in the meantime is lost too.`,
      vi: k === 0
        ? `t = 45 s: ${D.delayFirstProbeS} s ở DELAY (delay_first_probe_time) mà không ai xác nhận ⇒ PROBE. Linux hỏi — GỬI THẲNG tới MAC cũ — tối đa ${D.ucastSolicit} lần (ucast_solicit), mỗi giây một lần (retrans_time). Không còn ai mang MAC đó.`
        : `t = ${45 + k} s: probe ${k + 1}, vẫn không ai trả lời. Mọi gói ping trong lúc này cũng mất.`,
      sfx: 'miss' });
  }
  S.setNeigh('client', IP.client2, MAC.client2, 'FAILED');
  S.push({ t: 48, focus: 'client', where: 'arp-cache', call: '10.10.1.11 dev eth0 FAILED · ping: Destination Host Unreachable', tone: 'bad',
    en: `t = 48 s: ${D.ucastSolicit} probes unanswered ⇒ FAILED. Packets waiting for this neighbour are dropped and ping reports “Destination Host Unreachable”. About 8 s of outage so far (computed from the defaults).`,
    vi: `t = 48 s: ${D.ucastSolicit} lần dò không ai trả lời ⇒ FAILED. Gói đang chờ hàng xóm này bị vứt và ping báo “Destination Host Unreachable”. Đã mất khoảng 8 s (tính từ các giá trị mặc định).`, sfx: 'oops' });
  S.setNeigh('client', IP.client2, '', 'INCOMPLETE');
  S.push({ t: 49, focus: 'switch', where: 'wire', frame: { kind: 'arp-req', from: 'client', srcMac: MAC.client, dstMac: BCAST, to: S.forward(BCAST, 1), dropped: [3], label: 'who-has 10.10.1.11 (broadcast again)' },
    call: 'next ping ⇒ INCOMPLETE ⇒ broadcast', sfx: 'whoosh',
    en: 't = 49 s: the next ping starts from scratch: INCOMPLETE ⇒ broadcast “who has 10.10.1.11?”, exactly like an empty cache.',
    vi: 't = 49 s: gói ping kế tiếp bắt đầu lại từ đầu: INCOMPLETE ⇒ phát rộng “ai có 10.10.1.11?”, y như bộ đệm trống.' });
  S.learn(NEW_MAC, 2);
  S.setNeigh('client', IP.client2, NEW_MAC, 'REACHABLE');
  S.push({ t: 49, focus: 'client', where: 'arp-cache', frame: { kind: 'arp-rep', from: 'newbox', srcMac: NEW_MAC, dstMac: MAC.client, to: [1], label: '10.10.1.11 is-at 02:00:0a:0a:01:99' },
    call: '10.10.1.11 lladdr 02:00:0a:0a:01:99 REACHABLE', tone: 'ok',
    en: 'The new machine answers with its MAC ⇒ REACHABLE again, and pings work. Compare with the gratuitous-ARP version (toggle above): 0 s outage instead of ~9 s.',
    vi: 'Máy mới trả lời bằng MAC của nó ⇒ REACHABLE lại, ping chạy. So với phiên bản gratuitous ARP (công tắc phía trên): mất 0 s thay vì ~9 s.', sfx: 'right' });
  return S.out;
}

export const ARP_PRESETS = ['lan', 'gateway', 'stale'] as const;
export function arpScript(preset: string, garp = false): ArpStep[] {
  return preset === 'gateway' ? gatewayScript() : preset === 'stale' ? staleScript(garp) : lanScript();
}
export { ARP_LINES };
