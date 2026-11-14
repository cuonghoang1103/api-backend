/**
 * "VPN cho lập trình viên" (14.4): ba kịch bản trên lab "Wi-Fi trường trong một hộp" mở rộng.
 *   route  — laptop ở nhà (sau router nhà + CGNAT), WireGuard split / full tunnel: gói đi đường nào, trang thấy IP nào
 *   school — ở trường (bỏ mọi UDP): WireGuard (UDP) · OpenVPN qua TCP 443 sau sslh (DNS trường ⇒ rò, DNS VPN ⇒ kín) · mạng lưới kiểu
 *            Tailscale có DERP qua 443 (lab offline KHÔNG đo được ⇒ mọi dòng "tính ra")
 *   kill   — VPN sập: OpenVPN không kill switch (gói đi thẳng bằng IP trường) · wg-quick full tunnel (gói bị giữ trong wg0)
 * Dòng output thật: capture144.ts.
 */
import * as K from './capture144';
import type { Q } from './capture14';

export type Mode = 'split' | 'full';
export type Tun = 'wg' | 'ovpn' | 'mesh';
export type Dns = 'school' | 'vpn';
export type Kill = 'ovpn' | 'wg';
export type VNode = 'laptop' | 'local' | 'vps' | 'site' | 'dns' | 'derp';
export interface VHop { from: VNode; to: VNode; label: string; vi?: string; bad?: boolean; tunnel?: boolean }
export interface VStep {
  focus: VNode;
  hop?: VHop;
  tunnel: boolean;
  term: Array<{ t: string; real: boolean }>;
  en: string; vi: string; tone?: 'ok' | 'bad' | 'warn';
  where: string;
  sees?: { en: string; vi: string };
  /** địa chỉ trang web thấy (khi đã tới đích) */
  ip?: string;
  leak?: boolean;
}

const R = (x: Q) => ({ t: x[1].replace(/\s+$/, ''), real: true });
const C = (t: string) => ({ t, real: false });
const cmd = (t: string) => ({ t: `$ ${t}`, real: true });

export function routeScript(mode: Mode): VStep[] {
  const full = mode === 'full';
  return [
    { focus: 'laptop', tunnel: full, where: 'routing-table', term: [cmd('ip route get 198.18.0.10'), R(full ? K.V_FULL_ROUTE : K.V_SPLIT_ROUTE), ...(full ? [R(K.V_FW_RULE)] : [])],
      en: full ? 'Full tunnel (AllowedIPs 0.0.0.0/0): the kernel looks up table 51820, whose default route is wg0. WireGuard\'s own UDP packets carry fwmark 51820 and skip that table — no loop.' : 'Split tunnel (AllowedIPs 10.66.0.0/24): only the VPN network goes into wg0. The website is reached the normal way, via the home router.',
      vi: full ? 'Full tunnel (AllowedIPs 0.0.0.0/0): nhân tra bảng 51820, có tuyến mặc định là wg0. Chính các gói UDP của WireGuard mang fwmark 51820 nên bỏ qua bảng đó — không thành vòng lặp.' : 'Split tunnel (AllowedIPs 10.66.0.0/24): chỉ mạng VPN đi vào wg0. Trang web được tới bằng đường thường, qua router nhà.' },
    { focus: 'local', tunnel: full, where: 'conntrack', hop: { from: 'laptop', to: 'local', label: full ? 'UDP 51820 (encrypted)' : 'TCP :80 → news.test', vi: full ? 'UDP 51820 (mã hoá)' : 'TCP :80 → news.test', tunnel: full }, term: [cmd('curl -s http://news.test/')],
      en: full ? 'What leaves the laptop is only encrypted UDP to the VPS. The home router and the ISP\'s CGNAT see one flow; nobody along the way can read it.' : 'The request leaves in clear through the home router, then the ISP\'s CGNAT.',
      vi: full ? 'Thứ rời laptop chỉ là UDP đã mã hoá tới VPS. Router nhà và CGNAT của nhà mạng thấy một luồng; không ai dọc đường đọc được.' : 'Request đi ra ở dạng rõ qua router nhà, rồi CGNAT của nhà mạng.',
      sees: full ? { en: 'one encrypted UDP flow to 198.18.0.30:51820', vi: 'một luồng UDP mã hoá tới 198.18.0.30:51820' } : { en: 'the request itself: news.test, port 80', vi: 'chính request: news.test, cổng 80' } },
    ...(full ? [{ focus: 'vps' as const, tunnel: true, where: 'routing-table', hop: { from: 'local' as const, to: 'vps' as const, label: '🔒 → VPS wg0', tunnel: true }, term: [cmd('curl -s http://news.test/')],
      en: 'The VPS decrypts it on wg0 and NATs it out with its own address (the PostUp MASQUERADE rule).', vi: 'VPS giải mã ở wg0 rồi NAT đi ra bằng địa chỉ của chính nó (luật MASQUERADE trong PostUp).' }] : []),
    { focus: 'site', tunnel: full, where: 'socket', tone: 'ok', ip: full ? '198.18.0.30' : '198.18.0.40', hop: { from: full ? 'vps' : 'local', to: 'site', label: full ? 'from 198.18.0.30 (VPS)' : 'from 198.18.0.40 (ISP)', vi: full ? 'từ 198.18.0.30 (VPS)' : 'từ 198.18.0.40 (nhà mạng)' }, term: [cmd('curl -s http://news.test/'), R(full ? K.V_SEES_VPS : K.V_SEES_ISP)],
      en: full ? 'The site sees the VPS. Good on a hostile Wi-Fi — and now the VPS operator is the one who could watch.' : 'The site sees the ISP\'s shared address — split tunnel changes nothing for normal browsing.',
      vi: full ? 'Trang thấy VPS. Tốt khi ở Wi-Fi không tin được — và giờ người có thể nhìn là người vận hành VPS.' : 'Trang thấy địa chỉ dùng chung của nhà mạng — split tunnel không đổi gì với việc lướt web thường.' },
  ];
}

export function schoolScript(t: Tun, dns: Dns): VStep[] {
  if (t === 'wg') {
    return [
      { focus: 'laptop', tunnel: false, where: 'packet', hop: { from: 'laptop', to: 'local', label: 'UDP 51820 handshake' }, term: [cmd('wg-quick up wg0')],
        en: 'The same WireGuard config that worked at home. It sends its 148-byte handshake over UDP.', vi: 'Đúng cấu hình WireGuard đã chạy ở nhà. Nó gửi gói bắt tay 148 byte qua UDP.' },
      { focus: 'local', tunnel: false, where: 'conntrack', tone: 'bad', hop: { from: 'local', to: 'vps', label: '✕ DROP udp', bad: true }, term: [cmd('wg show wg0 | grep transfer'), R(K.V_WG_SCHOOL), cmd('iptables -L CHAN -v -n   # on the school firewall'), R(K.V_UDP_COUNT)],
        en: 'The school drops ALL UDP (lesson 14.2). No handshake ever completes: 0 bytes received. With a full tunnel the whole Internet is gone too. WireGuard has no TCP mode.',
        vi: 'Trường bỏ MỌI gói UDP (bài 14.2). Bắt tay không bao giờ xong: nhận 0 byte. Với full tunnel thì mất luôn cả Internet. WireGuard không có chế độ TCP.' },
    ];
  }
  if (t === 'mesh') {
    return [
      { focus: 'laptop', tunnel: false, where: 'packet', hop: { from: 'laptop', to: 'local', label: 'UDP: try direct (hole punching)', vi: 'UDP: thử đi thẳng (đục NAT)', bad: true }, term: [C('tailscale ping home-pc   # direct path? (computed — not measured offline)')],
        en: 'A Tailscale-like mesh first tries a direct WireGuard path to your home PC, punching through both NATs over UDP. At school that UDP is dropped.',
        vi: 'Một mạng lưới kiểu Tailscale trước hết thử đường WireGuard thẳng tới máy ở nhà, đục xuyên cả hai NAT bằng UDP. Ở trường UDP đó bị bỏ.' },
      { focus: 'derp', tunnel: true, where: 'tls', hop: { from: 'local', to: 'derp', label: 'HTTPS :443 → DERP relay', tunnel: true }, term: [C('via DERP(sin) — relayed over HTTPS 443')],
        en: 'It falls back to a DERP relay over HTTPS port 443 — allowed at school. The relay forwards WireGuard packets it cannot decrypt.',
        vi: 'Nó lùi về trạm DERP qua HTTPS cổng 443 — trường cho phép. Trạm chỉ chuyển các gói WireGuard nó không giải mã được.',
        sees: { en: 'HTTPS to a relay — not your traffic', vi: 'HTTPS tới một trạm chuyển tiếp — không phải lưu lượng của bạn' } },
      { focus: 'site', tunnel: true, where: 'socket', tone: 'ok', term: [C('pong from home-pc via DERP(sin) in 61ms   (computed)')],
        en: 'Connected — slower than direct, but end-to-end encrypted, and no port opened at home. Not measured in our offline lab: the numbers here are illustrative.',
        vi: 'Đã nối — chậm hơn đi thẳng, nhưng mã hoá đầu-cuối, và nhà không mở cổng nào. Lab offline của ta không đo được: số ở đây chỉ minh hoạ.' },
    ];
  }
  const leak = dns === 'school';
  return [
    { focus: 'local', tunnel: true, where: 'conntrack', hop: { from: 'laptop', to: 'local', label: 'TCP :443', tunnel: true }, term: [cmd('openvpn --config client.conf --daemon'), R(K.V_OVPN_TCP)],
      en: 'OpenVPN over TCP to port 443 — a door the school must keep open for the web.', vi: 'OpenVPN qua TCP tới cổng 443 — cửa trường buộc phải mở cho web.',
      sees: { en: 'one TCP connection to 198.18.0.30:443', vi: 'một kết nối TCP tới 198.18.0.30:443' } },
    { focus: 'vps', tunnel: true, where: 'process', hop: { from: 'local', to: 'vps', label: 'sslh :443 → openvpn 127.0.0.1:1194', tunnel: true }, term: [R(K.V_OVPN_TCP), R(K.V_GW_ONE)],
      en: 'On the VPS, sslh recognises OpenVPN\'s first packet and hands it to 127.0.0.1:1194 — next to SSH and HTTPS on the same port.', vi: 'Trên VPS, sslh nhận ra gói đầu của OpenVPN và trao cho 127.0.0.1:1194 — cạnh SSH và HTTPS cùng một cổng.' },
    leak
      ? { focus: 'dns', tunnel: true, where: 'dns-resolver', tone: 'bad', leak: true, hop: { from: 'laptop', to: 'dns', label: 'DNS phim.test? → 10.20.2.1', bad: true }, term: [cmd('cat /etc/resolv.conf'), R(K.V_RESOLV_SCHOOL), cmd('tshark -r dns.pcap …   # on the school firewall'), R(K.V_LEAK)],
        en: 'DNS leak: resolv.conf still says the school\'s DNS, 10.20.2.1 — on the laptop\'s own Wi-Fi, a more specific route than the tunnel. Every name goes to the school in clear.',
        vi: 'Rò DNS: resolv.conf vẫn ghi DNS của trường, 10.20.2.1 — nằm ngay trên Wi-Fi của laptop, tuyến cụ thể hơn đường hầm. Mọi tên tới tay trường ở dạng rõ.',
        sees: { en: 'every name you look up (phim.test…)', vi: 'mọi tên bạn tra (phim.test…)' } }
      : { focus: 'vps', tunnel: true, where: 'dns-resolver', hop: { from: 'laptop', to: 'vps', label: 'DNS → 198.18.0.53 inside the tunnel', vi: 'DNS → 198.18.0.53 trong hầm', tunnel: true }, term: [cmd('echo "nameserver 198.18.0.53" > /etc/resolv.conf'), cmd('dig +short phim.test'), R(K.V_DNS_FIX)],
        en: 'With the DNS the VPN provides (198.18.0.53), the question travels inside the tunnel. The school sees nothing but the one TCP connection.', vi: 'Dùng DNS mà VPN cấp (198.18.0.53), câu hỏi đi trong hầm. Trường không thấy gì ngoài một kết nối TCP đó.',
        sees: { en: 'still only the TCP connection to 443', vi: 'vẫn chỉ một kết nối TCP tới 443' } },
    { focus: 'site', tunnel: true, where: 'socket', tone: leak ? 'warn' : 'ok', ip: '198.18.0.30', hop: { from: 'vps', to: 'site', label: 'from 198.18.0.30' }, term: [cmd('curl -sS --cacert /ca/ca.pem https://social.test/'), R(K.V_OVPN_SOCIAL)],
      en: leak ? 'The page opens through the tunnel (the SNI block of 14.2 never sees it) — but your DNS questions already told the school where you were going.' : 'The page opens through the tunnel; content AND names stay inside. That is what "connected to a VPN" should mean.',
      vi: leak ? 'Trang mở qua đường hầm (bộ lọc SNI của 14.2 không thấy) — nhưng câu hỏi DNS đã báo cho trường biết bạn định đi đâu.' : 'Trang mở qua đường hầm; nội dung VÀ tên đều ở bên trong. "Đã nối VPN" phải có nghĩa như vậy.' },
  ];
}

export function killScript(k: Kill): VStep[] {
  if (k === 'ovpn') {
    return [
      { focus: 'laptop', tunnel: true, where: 'routing-table', term: [cmd('ip route | head -1'), R(K.V_OVPN_ROUTE)],
        en: 'OpenVPN is up: two routes 0.0.0.0/1 and 128.0.0.0/1 through tun0 beat the default route.', vi: 'OpenVPN đang chạy: hai tuyến 0.0.0.0/1 và 128.0.0.0/1 qua tun0 thắng tuyến mặc định.' },
      { focus: 'laptop', tunnel: false, where: 'routing-table', tone: 'warn', term: [cmd('pkill openvpn; ip route | head -1'), R(K.V_KILL_ROUTE)],
        en: 'OpenVPN dies (crash, sleep, a network change). It removes its routes on the way out — only the default route via the school is left.', vi: 'OpenVPN chết (sập, máy ngủ, đổi mạng). Nó gỡ các tuyến của mình khi thoát — chỉ còn tuyến mặc định qua trường.' },
      { focus: 'site', tunnel: false, where: 'socket', tone: 'bad', leak: true, ip: '198.18.0.1', hop: { from: 'local', to: 'site', label: 'direct, school IP', vi: 'đi thẳng, IP trường', bad: true }, term: [cmd('curl -sS -m 5 http://198.18.0.10/'), R(K.V_KILL_LEAK)],
        en: 'The next request goes straight out of the school Wi-Fi with the school\'s IP — no warning. Without a kill switch, a dead VPN leaks silently.', vi: 'Request kế tiếp đi thẳng ra Wi-Fi trường bằng IP của trường — không một lời cảnh báo. Không có kill switch, VPN sập là lộ trong im lặng.',
        sees: { en: 'your traffic again, in clear where it is HTTP', vi: 'lại thấy lưu lượng của bạn, ở dạng rõ nếu là HTTP' } },
    ];
  }
  return [
    { focus: 'laptop', tunnel: true, where: 'routing-table', term: [cmd('ip route get 198.18.0.10'), R(K.V_FULL_ROUTE)],
      en: 'wg-quick full tunnel: everything unmarked goes into wg0 by policy rule.', vi: 'Full tunnel của wg-quick: mọi thứ không đánh dấu đi vào wg0 theo luật định tuyến.' },
    { focus: 'local', tunnel: true, where: 'conntrack', tone: 'warn', hop: { from: 'local', to: 'vps', label: '✕ UDP 51820 blocked', vi: '✕ chặn UDP 51820', bad: true }, term: [C('iptables -I FORWARD -p udp --dport 51820 -j DROP   # on the home router')],
      en: 'Now the path to the VPS breaks (we blocked UDP 51820 at the home router).', vi: 'Giờ đường tới VPS hỏng (ta chặn UDP 51820 ở router nhà).' },
    { focus: 'laptop', tunnel: true, where: 'routing-table', tone: 'ok', term: [cmd('ip route get 198.18.0.10'), R(K.V_HOLD_ROUTE), cmd('curl -sS -m 5 http://198.18.0.10/'), R(K.V_HOLD_CURL)],
      en: 'The routing rule still points into wg0, so nothing leaves outside the tunnel — the request simply fails. That is a kill switch: when the tunnel is down, nothing goes out.',
      vi: 'Luật định tuyến vẫn trỏ vào wg0, nên không gì đi ra ngoài hầm — request chỉ đơn giản là hỏng. Đó là kill switch: hầm sập thì không gì được ra.',
      sees: { en: 'nothing but WireGuard retries', vi: 'chỉ thấy WireGuard thử lại' } },
  ];
}
