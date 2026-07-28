/**
 * Mạng · NWC203c — một gói tin đi từ máy trong nhà ra Internet.
 *
 * Máy bạn mang địa chỉ 192.168.1.5. Địa chỉ đó KHÔNG tồn tại trên Internet —
 * hàng triệu ngôi nhà khác cũng đang dùng đúng con số ấy. Vậy mà gói tin vẫn
 * ra được tới máy chủ ở nửa vòng trái đất và quay về đúng máy bạn, giữa lúc
 * bốn thiết bị khác trong nhà cũng đang lướt web.
 *
 * Ba cơ chế xếp chồng lên nhau làm được chuyện đó:
 *
 *   ARP  — trong mạng nội bộ, muốn gửi được frame phải biết địa chỉ MAC, mà
 *          ta chỉ có IP. ARP là câu hỏi "ai đang giữ IP này?" hét lên cho cả
 *          mạng nghe.
 *   Định tuyến — router không biết đường tới đích, nó chỉ biết bước KẾ TIẾP.
 *          Không ai nắm bản đồ toàn cục cả.
 *   NAT  — router nhà viết lại địa chỉ nguồn thành IP công cộng của nó, và ghi
 *          vào bảng để biết đường trả lời về đúng máy nào.
 *
 * Hiểu NAT còn giải thích luôn vì sao máy trong nhà tự nhiên "được bảo vệ" khỏi
 * kết nối từ ngoài vào, và vì sao chơi game hay gọi video ngang hàng lại cần
 * những trò lách như UPnP hoặc máy chủ trung gian.
 */

import { Router } from 'lucide-react';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

const nodes = [
  { id: 'pc', label: 'Máy của bạn', kind: 'client' as const, x: 110, y: 300, sublabel: { vi: '192.168.1.5', en: '192.168.1.5' } },
  { id: 'gw', label: 'Router nhà', kind: 'edge' as const, x: 370, y: 300, sublabel: { vi: 'nội bộ .1 · công cộng 113.161.8.20', en: 'LAN .1 · WAN 113.161.8.20' } },
  { id: 'isp', label: 'Router ISP', kind: 'gateway' as const, x: 620, y: 180, sublabel: { vi: 'chỉ biết bước kế tiếp', en: 'knows only the next hop' } },
  { id: 'net', label: 'Xương sống Internet', kind: 'gateway' as const, x: 620, y: 430, sublabel: { vi: '12 chặng nữa', en: '12 more hops' } },
  { id: 'srv', label: 'Máy chủ', kind: 'server' as const, x: 890, y: 300, sublabel: { vi: '93.184.216.34:443', en: '93.184.216.34:443' } },
];

const edges = [
  { id: 'e_pc_gw', from: 'pc', to: 'gw' },
  { id: 'e_gw_isp', from: 'gw', to: 'isp' },
  { id: 'e_isp_net', from: 'isp', to: 'net' },
  { id: 'e_net_srv', from: 'net', to: 'srv' },
  { id: 'e_gw_srv', from: 'gw', to: 'srv', ghost: true },
];

type Push = (step: Partial<SimStep> & { id: string; title: I18nText; detail: I18nText; duration: number }) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (s) => {
    steps.push({ kind: 'INTERNAL', ...s } as SimStep);
  };
  return { steps, push };
}

/* ── A — ARP VÀ ĐỊNH TUYẾN ───────────────────────────────────── */

function buildRoute(): SimStep[] {
  const { steps, push } = collector();

  push({
    id: 'decide',
    title: { vi: 'Câu hỏi đầu tiên: đích có nằm cùng mạng với tôi không', en: 'First question: is the destination on my own network' },
    detail: {
      vi: 'Máy lấy IP đích 93.184.216.34 đem so với mạng của mình (192.168.1.0/24) qua mặt nạ mạng. Khác mạng — nên nó không thể gửi thẳng. Mọi thứ không thuộc mạng nhà đều phải đưa cho cổng mặc định, tức router nhà. Đây là toàn bộ nội dung của bảng định tuyến trên máy cá nhân.',
      en: 'The machine compares the destination 93.184.216.34 against its own network (192.168.1.0/24) using the subnet mask. Different network — so it cannot deliver directly. Everything outside the home network goes to the default gateway, the home router. That is the entire routing table on a personal computer.',
    },
    duration: 2800,
    at: 'pc',
    nodeStates: { pc: 'active' },
    sfx: 'click',
    log: { vi: '93.184.216.34 không thuộc 192.168.1.0/24 → gửi cho gateway', en: '93.184.216.34 not in 192.168.1.0/24 → send to the gateway' },
  });

  push({
    id: 'arp',
    title: { vi: 'Nhưng biết IP router vẫn chưa gửi được — cần MAC', en: 'Knowing the router’s IP is not enough — a MAC is required' },
    detail: {
      vi: 'Ở tầng dưới, mạng LAN không hiểu IP; nó chuyển frame theo địa chỉ MAC. Máy biết router là 192.168.1.1 nhưng chưa biết MAC của nó, nên hét lên cho toàn mạng nghe: "ai đang giữ 192.168.1.1?". Đó là ARP — một câu hỏi phát tán cho tất cả, và chỉ đúng một máy trả lời.',
      en: 'One layer down, the LAN knows nothing about IP; it forwards frames by MAC address. The machine knows the router is 192.168.1.1 but not its MAC, so it shouts to the whole network: "who has 192.168.1.1?". That is ARP — a broadcast question that exactly one machine answers.',
    },
    duration: 3000,
    edge: 'e_pc_gw',
    kind: 'QUERY',
    nodeStates: { gw: 'processing' },
    packetLabel: 'ARP: ai giữ .1?',
    sfx: 'blip',
    log: { vi: 'ARP broadcast → router trả lời MAC a4:2b:8c:...', en: 'ARP broadcast → router replies MAC a4:2b:8c:…' },
    teachingNote: {
      vi: 'Nhấn: ARP hỏi cả mạng. Đó cũng là lý do ARP spoofing đánh lừa được — ai trả lời trước thì tin.',
      en: 'Stress: ARP asks everyone. That is also why ARP spoofing works — whoever answers first is believed.',
    },
  });

  push({
    id: 'hop',
    title: { vi: 'Router không biết đường tới đích — chỉ biết bước kế tiếp', en: 'The router does not know the route — only the next hop' },
    detail: {
      vi: 'Đây là điều gây bất ngờ nhất về Internet: không thiết bị nào nắm bản đồ toàn cục. Router nhà chỉ biết "cái gì không phải của tôi thì đẩy sang ISP". Router ISP nhìn tiền tố mạng rồi chọn hàng xóm gần đích hơn. Cứ thế từng chặng một, mỗi chặng chỉ quyết định đúng bước tiếp theo.',
      en: 'This is the most surprising thing about the Internet: no device holds a global map. The home router only knows "anything not mine goes to the ISP". The ISP router looks at the network prefix and picks a neighbour closer to the destination. Hop by hop, each deciding only its next step.',
    },
    duration: 3100,
    edge: 'e_gw_isp',
    kind: 'GET',
    nodeStates: { gw: 'success', isp: 'processing' },
    packetLabel: 'chặng 1',
    sfx: 'swoosh',
    log: { vi: 'traceroute: 14 chặng · không ai biết trọn đường đi', en: 'traceroute: 14 hops · nobody knows the full path' },
  });

  push({
    id: 'ttl',
    title: { vi: 'TTL giảm mỗi chặng — lưới an toàn chống vòng lặp', en: 'TTL drops at each hop — the anti-loop safety net' },
    detail: {
      vi: 'Vì mỗi router quyết định độc lập, hai router hoàn toàn có thể đẩy gói qua lại lẫn nhau mãi mãi. Nên mỗi gói mang một bộ đếm TTL, giảm một sau mỗi chặng; về 0 thì bị vứt và báo lỗi ngược về nguồn. Chính cơ chế này được `traceroute` lợi dụng: gửi gói TTL=1, rồi 2, rồi 3, để từng router lần lượt tự khai tên mình.',
      en: 'Because each router decides independently, two routers can perfectly well bounce a packet between them forever. So every packet carries a TTL counter, decremented at each hop; at zero it is dropped and an error goes back to the source. `traceroute` exploits exactly this: send TTL=1, then 2, then 3, making each router reveal itself in turn.',
    },
    duration: 3000,
    edge: 'e_isp_net',
    kind: 'GET',
    nodeStates: { isp: 'success', net: 'processing' },
    packetLabel: 'TTL 62',
    sfx: 'blip',
    log: { vi: 'TTL 64 → 63 → 62 … về 0 thì vứt gói', en: 'TTL 64 → 63 → 62 … dropped at zero' },
  });

  push({
    id: 'arrive',
    title: { vi: 'Tới máy chủ sau 14 chặng và khoảng 180ms', en: 'Arrives at the server after 14 hops and about 180ms' },
    detail: {
      vi: 'Không chặng nào biết toàn bộ hành trình, vậy mà gói vẫn tới đúng chỗ. Điều đáng nói: gói ĐI và gói VỀ không bắt buộc đi cùng một đường — mỗi chiều được định tuyến độc lập, và đường có thể đổi giữa chừng nếu một liên kết nào đó hỏng. Internet không có "đường dây" nào cả, chỉ có những quyết định từng chặng.',
      en: 'No single hop knew the whole journey, yet the packet arrived. Worth noting: the outbound and return packets need not follow the same path — each direction is routed independently, and the path can change mid-connection if a link fails. The Internet has no "circuit" at all, only per-hop decisions.',
    },
    duration: 3000,
    edge: 'e_net_srv',
    kind: 'GET',
    nodeStates: { net: 'success', srv: 'success' },
    packetLabel: 'tới nơi',
    latencyMs: 180,
    sfx: 'success',
    log: { vi: '14 chặng · 180ms · đường về có thể khác đường đi', en: '14 hops · 180ms · the return path may differ' },
  });

  return steps;
}

/* ── B — NAT ─────────────────────────────────────────────────── */

function buildNat(): SimStep[] {
  const { steps, push } = collector();

  push({
    id: 'private',
    title: { vi: 'Địa chỉ 192.168.1.5 không tồn tại trên Internet', en: 'The address 192.168.1.5 does not exist on the Internet' },
    detail: {
      vi: 'Dải 192.168.x.x là địa chỉ riêng, được dành cho mạng nội bộ và bị mọi router Internet từ chối chuyển tiếp. Hàng triệu ngôi nhà đang dùng đúng con số này cùng lúc. Nếu gói tin cứ thế ra ngoài với địa chỉ nguồn đó, máy chủ sẽ không biết trả lời về đâu.',
      en: 'The 192.168.x.x range is private, reserved for local networks and refused by every Internet router. Millions of homes use that exact number simultaneously. If the packet left with that source address, the server would have nowhere to reply to.',
    },
    duration: 2800,
    at: 'pc',
    nodeStates: { pc: 'active' },
    packetLabel: 'src 192.168.1.5:51000',
    sfx: 'click',
    log: { vi: '192.168.x.x là địa chỉ riêng · Internet không định tuyến', en: '192.168.x.x is private · the Internet will not route it' },
  });

  push({
    id: 'rewrite',
    title: { vi: 'Router viết lại địa chỉ nguồn — và ghi sổ', en: 'The router rewrites the source — and takes a note' },
    detail: {
      vi: 'Router thay địa chỉ nguồn thành IP công cộng của nó, đồng thời đổi cổng nguồn sang một số riêng, ví dụ 40001. Rồi nó ghi vào bảng NAT: "cổng 40001 thuộc về 192.168.1.5:51000". Cái bảng đó chính là toàn bộ trí nhớ cần có để trả lời về đúng máy.',
      en: 'The router replaces the source address with its own public IP and also swaps the source port to a private one, say 40001. Then it records in the NAT table: "port 40001 belongs to 192.168.1.5:51000". That table is the entire memory needed to route replies back correctly.',
    },
    duration: 3100,
    edge: 'e_pc_gw',
    kind: 'PUT',
    nodeStates: { gw: 'processing' },
    packetLabel: 'src 113.161.8.20:40001',
    sfx: 'swoosh',
    log: { vi: 'NAT: 40001 ⇄ 192.168.1.5:51000', en: 'NAT: 40001 ⇄ 192.168.1.5:51000' },
  });

  push({
    id: 'many',
    title: { vi: 'Bốn thiết bị, một IP công cộng, phân biệt bằng cổng', en: 'Four devices, one public IP, told apart by port' },
    detail: {
      vi: 'Điện thoại lấy cổng 40002, tivi 40003, máy tính bảng 40004. Với máy chủ bên ngoài thì cả nhà bạn chỉ là MỘT địa chỉ duy nhất đang mở nhiều kết nối. Vì cổng có 16 bit nên một IP công cộng gánh được hàng chục nghìn kết nối cùng lúc — đây chính là thứ giúp IPv4 sống sót qua cơn cạn địa chỉ.',
      en: 'The phone gets port 40002, the TV 40003, the tablet 40004. To an outside server your entire household is ONE address holding many connections. With 16 bits of port space a single public IP carries tens of thousands of concurrent connections — which is what let IPv4 survive address exhaustion.',
    },
    duration: 3100,
    edge: 'e_gw_srv',
    kind: 'GET',
    nodeStates: { gw: 'active', srv: 'processing' },
    packetLabel: '4 máy · 1 IP',
    sfx: 'stream',
    log: { vi: 'điện thoại 40002 · tivi 40003 · máy tính bảng 40004', en: 'phone 40002 · TV 40003 · tablet 40004' },
  });

  push({
    id: 'back',
    title: { vi: 'Trả lời về: tra bảng rồi viết ngược lại', en: 'The reply comes back: look it up and rewrite in reverse' },
    detail: {
      vi: 'Máy chủ trả lời tới 113.161.8.20:40001, vì đó là địa chỉ duy nhất nó từng thấy. Router tra bảng NAT, thấy 40001 thuộc về 192.168.1.5:51000, viết lại địa chỉ đích rồi chuyển vào trong nhà. Máy bạn nhận được gói và chẳng biết gì về việc địa chỉ đã bị đổi hai lần.',
      en: 'The server replies to 113.161.8.20:40001, the only address it ever saw. The router consults the NAT table, finds 40001 maps to 192.168.1.5:51000, rewrites the destination and forwards it inside. Your machine receives the packet with no idea its address was rewritten twice.',
    },
    duration: 3000,
    edge: 'e_gw_srv',
    reverse: true,
    kind: 'RESPONSE',
    nodeStates: { srv: 'success', pc: 'success' },
    packetLabel: 'dst → 192.168.1.5',
    sfx: 'ping',
    log: { vi: 'tra bảng NAT → viết lại đích → giao đúng máy', en: 'NAT lookup → rewrite destination → delivered correctly' },
  });

  push({
    id: 'inbound',
    title: { vi: 'Nhưng chiều ngược lại thì không đi được', en: 'But the reverse direction cannot get through' },
    detail: {
      vi: 'Ai đó trên Internet gõ vào 113.161.8.20:40001 mà bạn chưa gửi gì ra trước thì router nhìn bảng NAT, không thấy dòng nào khớp, và vứt gói. Đây là lý do máy trong nhà "được bảo vệ" mà không cần cấu hình tường lửa gì — không phải vì có ai chặn, mà vì router không biết phải giao cho máy nào.',
      en: 'If someone on the Internet knocks on 113.161.8.20:40001 without you having sent anything first, the router checks its NAT table, finds no matching entry, and drops the packet. This is why home machines are "protected" with no firewall configuration — not because something blocks it, but because the router does not know which machine to give it to.',
    },
    duration: 3100,
    edge: 'e_gw_srv',
    reverse: true,
    kind: 'ERROR',
    nodeStates: { gw: 'error' },
    packetLabel: 'không khớp bảng',
    sfx: 'error',
    log: { vi: 'không có dòng NAT khớp → vứt gói', en: 'no matching NAT entry → packet dropped' },
    teachingNote: {
      vi: 'Nhấn: NAT bảo vệ như một tác dụng phụ, KHÔNG phải tường lửa. Đừng dựa vào nó làm lớp an ninh duy nhất.',
      en: 'Stress: NAT protects as a side effect, it is NOT a firewall. Never rely on it as your only security layer.',
    },
  });

  push({
    id: 'p2p',
    title: { vi: 'Và đây là lý do gọi video ngang hàng lại khó đến thế', en: 'And this is why peer-to-peer video calls are so hard' },
    detail: {
      vi: 'Hai máy cùng nằm sau NAT thì không bên nào chủ động gọi được bên kia — cả hai đều chỉ mở được kết nối ĐI RA. Nên mới sinh ra STUN để mỗi bên tự biết IP công cộng của mình, kỹ thuật đục lỗ để hai bên cùng gửi ra một lúc và tạo dòng NAT cho nhau, và TURN làm máy chủ trung chuyển khi mọi cách đều thất bại. Chuyển tiếp cổng hay UPnP cũng là những cách khoét một lỗ cố định trên bảng NAT.',
      en: 'With both machines behind NAT neither can initiate to the other — each can only open OUTBOUND connections. Hence STUN, so each side learns its own public address; hole punching, where both send out simultaneously to create NAT entries for each other; and TURN, a relay server for when everything else fails. Port forwarding and UPnP are likewise ways of punching a permanent hole in the NAT table.',
    },
    duration: 3200,
    at: 'gw',
    nodeStates: { gw: 'active' },
    sfx: 'lock',
    log: { vi: 'STUN · đục lỗ · TURN — đều để lách NAT', en: 'STUN · hole punching · TURN — all to work around NAT' },
  });

  return steps;
}

export const ipJourneyScenario: Scenario = {
  id: 'ip-journey',
  name: { vi: 'Một gói tin ra Internet — ARP, định tuyến và NAT', en: 'A packet to the Internet — ARP, routing and NAT' },
  tagline: {
    vi: 'Máy bạn mang địa chỉ 192.168.1.5 — con số mà hàng triệu nhà khác cũng đang dùng và Internet từ chối định tuyến. Vậy mà gói tin vẫn ra tới nơi và về đúng máy, giữa lúc bốn thiết bị khác cùng lướt web.',
    en: 'Your machine is 192.168.1.5 — a number millions of other homes also use and the Internet refuses to route. Yet the packet still arrives and returns to the right device, while four others browse alongside it.',
  },
  icon: Router,
  accent: '#f59e0b',
  group: 'network',
  lesson: {
    course: 'computer-networking',
    subject: 'NWC203c',
    code: '5.1',
    slug: 'nwc203c-5-1-ip-subnet',
    title: { vi: 'Địa chỉ IP & subnet mask', en: 'IP addresses & subnet masks' },
  },
  nodes,
  edges,
  options: [
    {
      id: 'view',
      label: { vi: 'Cơ chế nào', en: 'Which mechanism' },
      defaultValue: 'route',
      choices: [
        {
          value: 'route',
          label: 'ARP & định tuyến',
          fullLabel: 'Không ai nắm bản đồ toàn cục',
          color: '#38bdf8',
          hint: { vi: 'mỗi router chỉ biết bước kế tiếp', en: 'each router knows only the next hop' },
        },
        {
          value: 'nat',
          label: 'NAT',
          fullLabel: 'Bốn thiết bị, một IP công cộng',
          color: '#f59e0b',
          hint: { vi: 'vì sao gọi video ngang hàng khó', en: 'why p2p video calls are hard' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.view === 'nat' ? buildNat() : buildRoute()),
};
