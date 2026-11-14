/**
 * "SSH khi cổng 22 bị chặn" (14.3): ba kịch bản trên lab "Wi-Fi trường trong một hộp" mở rộng (vps.example 198.18.0.30).
 *   port    — ~/.ssh/config có khối Match chọn 22/993; ở trường (chỉ mở 80/443/587/993) hay ở nhà; Match đứng TRƯỚC hay SAU Host vps
 *   forward — -L (kéo redis 127.0.0.1:6379 của VPS về laptop) · -R chỉ 127.0.0.1 (bạn ở nhà bị từ chối) · -R 0.0.0.0 + GatewayPorts
 *   socks   — -D: gọi thẳng (SNI reset) · socks5h · socks5 (rò DNS) · người lạ dùng SOCKS mở toang 0.0.0.0:1081
 * Dòng output là của lab thật (capture143.ts); tổ hợp lab không chạy (vd Match đứng sau mà ở nhà) ⇒ real = false ("tính ra").
 */
import * as K from './capture143';
import type { Q } from './capture14';

export type Place = 'school' | 'home';
export type Order = 'first' | 'last';
export type Fwd = 'L' | 'R' | 'R0';
export type SocksReq = 'direct' | 'socks5h' | 'socks5' | 'phim5h' | 'stranger';
export type NodeId = 'laptop' | 'fw' | 'vps' | 'site' | 'friend' | 'ke' | 'dns';
export interface Hop { from: NodeId; to: NodeId; label: string; vi?: string; bad?: boolean; tunnel?: boolean }
export interface TStep {
  focus: NodeId;
  hop?: Hop;
  tunnel: boolean;
  term: Array<{ t: string; real: boolean }>;
  en: string; vi: string; tone?: 'ok' | 'bad' | 'warn';
  where: string;
  /** trường (tường lửa) thấy gì — chỉ khi có */
  sees?: { en: string; vi: string };
  port?: number;
}

const R = (x: Q) => ({ t: x[1], real: true });
const C = (t: string) => ({ t, real: false });
const cmd = (t: string) => ({ t: `$ ${t}`, real: true });

/** Cấu hình ~/.ssh/config hai kiểu (để mô phỏng tô dòng nào thắng). */
export function configLines(order: Order): string[] {
  const m = ['Match host vps,vps.example exec "ip -4 -br addr | grep -q \' 10\\.20\\.2\\.\'"', '  Port 993'];
  const h = ['Host vps', '  HostName vps.example', '  User sv', '  Port 22'];
  return order === 'first' ? [...m, ...h] : [...h, ...m];
}
/** Cổng ssh chọn: giá trị Port ĐẦU TIÊN gặp trong các khối áp dụng. */
export function chosenPort(place: Place, order: Order): number {
  const matchApplies = place === 'school';
  if (order === 'first' && matchApplies) return 993;
  return 22;
}

export function portScript(place: Place, order: Order): TStep[] {
  const port = chosenPort(place, order);
  const blocked = place === 'school' && port === 22;
  const S: TStep[] = [];
  S.push({ focus: 'laptop', tunnel: false, port, where: 'process', term: [cmd('ssh -G vps | grep -E \'^(hostname|port) \''), C('hostname vps.example'), place === 'school' ? R(order === 'first' ? K.T_CFG_PORT993 : K.T_CFG_PORT22) : (order === 'first' ? R(K.T_HOME_PORT22) : C('port 22'))],
    en: `ssh reads ~/.ssh/config top to bottom and keeps the FIRST value of each option. ${place === 'school' ? 'At school the Match test succeeds (address 10.20.2.x)' : 'At home the Match test fails (address 192.168.1.x), so its block is skipped'}${place === 'school' ? (order === 'first' ? ' and Match comes first ⇒ Port 993.' : ', but Host vps already set Port 22 above it ⇒ 993 is ignored.') : ' ⇒ Port 22.'}`,
    vi: `ssh đọc ~/.ssh/config từ trên xuống và giữ giá trị ĐẦU TIÊN của mỗi tuỳ chọn. ${place === 'school' ? 'Ở trường phép thử của Match thành công (địa chỉ 10.20.2.x)' : 'Ở nhà phép thử của Match thất bại (địa chỉ 192.168.1.x), khối đó bị bỏ qua'}${place === 'school' ? (order === 'first' ? ' và Match đứng trước ⇒ Port 993.' : ', nhưng Host vps đã đặt Port 22 ở phía trên ⇒ 993 bị bỏ qua.') : ' ⇒ Port 22.'}`,
    tone: place === 'school' && order === 'last' ? 'warn' : undefined });
  S.push({ focus: 'fw', tunnel: false, port, where: 'conntrack', hop: { from: 'laptop', to: 'fw', label: `TCP SYN → 198.18.0.30:${port}` },
    en: place === 'school' ? `The SYN reaches the school firewall, which opens only TCP 80/443/587/993.` : 'At home the router has no such rule: every outgoing port is allowed.',
    vi: place === 'school' ? 'Gói SYN tới tường lửa trường, nơi chỉ mở TCP 80/443/587/993.' : 'Ở nhà router không có luật kiểu đó: cổng đi ra nào cũng được.',
    term: [cmd(`ssh vps   # port ${port}`)] });
  if (blocked) {
    S.push({ focus: 'fw', tunnel: false, port, where: 'conntrack', hop: { from: 'fw', to: 'vps', label: '✕ DROP :22', bad: true }, tone: 'bad',
      term: [cmd('ssh vps'), R(K.T_SSH22_TIMEOUT)],
      en: 'Port 22 is not on the list: the packet is dropped in silence, ssh retries until its timeout. The server is fine — the road is closed.',
      vi: 'Cổng 22 không có trong danh sách: gói bị bỏ trong im lặng, ssh thử lại tới hết giờ. Máy chủ vẫn khoẻ — con đường bị đóng.' });
  } else {
    S.push({ focus: 'vps', tunnel: true, port, where: 'tcp-stack', hop: { from: 'fw', to: 'vps', label: `SSH :${port} ✓`, tunnel: true },
      term: port === 993 ? [cmd('ssh -v vps'), R(K.T_AUTH993)] : [cmd('ssh vps')],
      en: port === 993 ? 'Port 993 is the mail door the school keeps open. sshd on the VPS (ssh993.service) answers, proves itself with its host key, and accepts our KEY.' : 'Port 22 goes through; ssh.socket on the VPS hands the connection to sshd.',
      vi: port === 993 ? 'Cổng 993 là cửa thư từ trường để mở. sshd trên VPS (ssh993.service) trả lời, chứng minh nó bằng khoá máy chủ, và nhận KHOÁ của ta.' : 'Cổng 22 đi qua; ssh.socket trên VPS trao kết nối cho sshd.' });
    const line = port === 993 ? R(K.T_IN993) : (order === 'first' ? R(K.T_IN22_HOME) : C('vao duoc vps qua cong 22'));
    S.push({ focus: 'laptop', tunnel: true, port, where: 'socket', tone: 'ok', term: [cmd('ssh vps \'echo "vao duoc $(hostname) qua cong ${SSH_CONNECTION##* }"\''), line],
      en: `Logged in through port ${port}. Same laptop, same file — the network decided the door.`, vi: `Đã vào qua cổng ${port}. Cùng laptop, cùng tệp — mạng đang đứng quyết định cửa nào.` });
  }
  return S;
}

export function forwardScript(f: Fwd): TStep[] {
  const S: TStep[] = [];
  const up: TStep = { focus: 'vps', tunnel: true, where: 'process', hop: { from: 'laptop', to: 'vps', label: 'SSH :993', tunnel: true },
    term: [cmd(f === 'L' ? 'ssh -f -N -L 16379:127.0.0.1:6379 vps' : f === 'R' ? 'ssh -f -N -R 8080:localhost:3000 vps' : 'ssh -f -N -R 0.0.0.0:8080:localhost:3000 vps')],
    en: f === 'L' ? 'One SSH connection to the VPS on 993. -L asks the LAPTOP to listen on 127.0.0.1:16379.' : f === 'R' ? '-R asks the VPS to listen on port 8080 — by default only on its 127.0.0.1.' : 'With GatewayPorts clientspecified on the server, -R 0.0.0.0:8080 asks the VPS to listen on every address.',
    vi: f === 'L' ? 'Một kết nối SSH tới VPS ở cổng 993. -L bảo LAPTOP nghe ở 127.0.0.1:16379.' : f === 'R' ? '-R bảo VPS nghe ở cổng 8080 — mặc định chỉ trên 127.0.0.1 của nó.' : 'Có GatewayPorts clientspecified trên máy chủ, -R 0.0.0.0:8080 bảo VPS nghe ở mọi địa chỉ.' };
  if (f === 'L') {
    S.push({ focus: 'laptop', tunnel: false, where: 'socket', hop: { from: 'laptop', to: 'vps', label: '✕ :6379 direct', bad: true }, tone: 'bad', term: [cmd('nc -vz -w 3 vps.example 6379'), R(K.T_L_DIRECT)],
      en: 'Directly, port 6379 times out: the school allows only a few ports, and Redis on the VPS listens on 127.0.0.1 anyway — never on the Internet.',
      vi: 'Gọi thẳng, cổng 6379 hết giờ: trường chỉ mở vài cổng, và dù sao Redis trên VPS cũng chỉ nghe 127.0.0.1 — không bao giờ ra Internet.' });
    S.push(up);
    S.push({ focus: 'laptop', tunnel: true, where: 'socket', hop: { from: 'laptop', to: 'laptop', label: 'redis-cli → 127.0.0.1:16379' }, term: [cmd('redis-cli -p 16379 ping')],
      en: 'redis-cli connects to the laptop\'s own port 16379 — the ssh process accepts it.', vi: 'redis-cli nối vào chính cổng 16379 của laptop — tiến trình ssh nhận.' });
    S.push({ focus: 'vps', tunnel: true, where: 'tcp-stack', hop: { from: 'laptop', to: 'vps', label: 'inside SSH :993', vi: 'trong SSH :993', tunnel: true }, term: [cmd('redis-cli -p 16379 ping')],
      en: 'The bytes ride inside the SSH connection. The school sees one more encrypted chunk to the VPS on 993.', vi: 'Các byte đi trong kết nối SSH. Trường chỉ thấy thêm một khúc mã hoá tới VPS ở cổng 993.',
      sees: { en: 'TCP 10.20.2.159 → 198.18.0.30:993, encrypted', vi: 'TCP 10.20.2.159 → 198.18.0.30:993, mã hoá' } });
    S.push({ focus: 'site', tunnel: true, where: 'socket', tone: 'ok', hop: { from: 'vps', to: 'site', label: 'VPS → 127.0.0.1:6379' }, term: [cmd('redis-cli -p 16379 ping'), R(K.T_L_PONG), cmd('redis-cli -p 16379 get diem:SE12345'), R(K.T_L_GET)],
      en: 'sshd on the VPS opens the connection to 127.0.0.1:6379 — for Redis the client is local. PONG.', vi: 'sshd trên VPS mở kết nối tới 127.0.0.1:6379 — với Redis, máy khách là người trong nhà. PONG.' });
    return S;
  }
  S.push(up);
  S.push({ focus: 'friend', tunnel: true, where: 'socket', hop: { from: 'friend', to: 'vps', label: 'curl vps.example:8080', bad: f === 'R' }, term: [cmd('curl -sS -m 3 http://vps.example:8080/')],
    en: 'A friend at home opens http://vps.example:8080/.', vi: 'Bạn ở nhà mở http://vps.example:8080/.' });
  if (f === 'R') {
    S.push({ focus: 'vps', tunnel: true, where: 'socket', tone: 'bad', term: [cmd('curl -sS -m 3 http://vps.example:8080/'), R(K.T_R_REFUSED), cmd('ssh vps "ss -4tln | grep 8080"'), C('LISTEN 0 128 127.0.0.1:8080 0.0.0.0:*')],
      en: 'Refused: the forward listens on 127.0.0.1:8080 of the VPS only — a safe default. The server must allow GatewayPorts for anything else.',
      vi: 'Bị từ chối: đường hầm chỉ nghe 127.0.0.1:8080 của VPS — một mặc định an toàn. Máy chủ phải cho GatewayPorts thì mới nghe chỗ khác.' });
    return S;
  }
  S.push({ focus: 'vps', tunnel: true, where: 'process', hop: { from: 'vps', to: 'laptop', label: 'back inside SSH', vi: 'quay ngược trong SSH', tunnel: true }, term: [R(K.T_R_GW), cmd('curl -sS -m 3 http://vps.example:8080/')],
    en: 'sshd-session on the VPS accepts it and sends it BACK through the tunnel to the laptop, which sits behind the school\'s NAT where nobody can call in.',
    vi: 'sshd-session trên VPS nhận rồi gửi NGƯỢC qua đường hầm về laptop, vốn ngồi sau NAT của trường nơi không ai gọi vào được.' });
  S.push({ focus: 'laptop', tunnel: true, where: 'socket', tone: 'ok', hop: { from: 'laptop', to: 'laptop', label: '→ 127.0.0.1:3000' }, term: [cmd('curl -sS -m 3 http://vps.example:8080/'), R(K.T_R_DEMO)],
    en: 'The laptop\'s ssh opens 127.0.0.1:3000 — the demo answers the friend. Close it when the demo is over: this is a hole into wherever your laptop is.',
    vi: 'ssh trên laptop mở 127.0.0.1:3000 — bản demo trả lời bạn ở nhà. Xong demo thì đóng: đây là một lỗ chui vào nơi laptop đang ngồi.' });
  return S;
}

export function socksScript(r: SocksReq): TStep[] {
  const S: TStep[] = [];
  if (r === 'direct') {
    S.push({ focus: 'laptop', tunnel: false, where: 'tls', hop: { from: 'laptop', to: 'fw', label: 'TLS ClientHello · SNI social.test' }, term: [cmd('curl -sS -m 5 --cacert /ca/ca.pem https://social.test/')],
      en: 'Without the tunnel the ClientHello leaves the laptop with the name social.test in clear.', vi: 'Không có đường hầm, ClientHello rời laptop với tên social.test ở dạng rõ.' });
    S.push({ focus: 'fw', tunnel: false, where: 'conntrack', tone: 'bad', hop: { from: 'fw', to: 'laptop', label: 'TCP RST', bad: true }, term: [cmd('curl -sS -m 5 --cacert /ca/ca.pem https://social.test/'), R(K.T_D_RESET)],
      en: 'The SNI rule of 14.2 matches the name and resets the connection.', vi: 'Luật SNI của 14.2 khớp cái tên và reset kết nối.',
      sees: { en: 'the name social.test — and its counter goes up', vi: 'cái tên social.test — và bộ đếm của luật tăng' } });
    return S;
  }
  if (r === 'stranger') {
    S.push({ focus: 'ke', tunnel: true, where: 'socket', hop: { from: 'ke', to: 'laptop', label: 'SOCKS → 10.20.2.159:1080', bad: true }, term: [cmd('curl -sS -m 5 --socks5-hostname 10.20.2.159:1080 http://news.test/'), R(K.T_KE_REFUSED)],
      en: 'A stranger on the same Wi-Fi tries your proxy on 1080: refused — -D 1080 listens on 127.0.0.1 only.', vi: 'Một người lạ cùng Wi-Fi thử proxy của bạn ở 1080: bị từ chối — -D 1080 chỉ nghe 127.0.0.1.' });
    S.push({ focus: 'ke', tunnel: true, where: 'socket', hop: { from: 'ke', to: 'laptop', label: 'SOCKS → 10.20.2.159:1081' }, term: [cmd('ssh -f -N -D 0.0.0.0:1081 vps   # on YOUR laptop, by mistake'), cmd('curl -sS -m 5 --socks5-hostname 10.20.2.159:1081 http://news.test/')],
      en: 'But you also opened -D 0.0.0.0:1081 by mistake. The stranger connects to it…', vi: 'Nhưng bạn lỡ mở thêm -D 0.0.0.0:1081. Người lạ nối vào đó…' });
    S.push({ focus: 'vps', tunnel: true, where: 'process', hop: { from: 'laptop', to: 'vps', label: 'inside YOUR SSH', vi: 'trong SSH của BẠN', tunnel: true }, term: [cmd('curl -sS -m 5 --socks5-hostname 10.20.2.159:1081 http://news.test/')],
      en: '…and rides YOUR tunnel to YOUR VPS.', vi: '…và đi nhờ đường hầm CỦA BẠN tới VPS CỦA BẠN.' });
    S.push({ focus: 'site', tunnel: true, where: 'socket', tone: 'bad', hop: { from: 'vps', to: 'site', label: 'from 198.18.0.30' }, term: [cmd('curl -sS -m 5 --socks5-hostname 10.20.2.159:1081 http://news.test/'), R(K.T_KE_OK)],
      en: 'The site sees your VPS. Whatever the stranger does online now carries your name and your provider account. Bind forwards to 127.0.0.1.',
      vi: 'Trang thấy VPS của bạn. Người lạ làm gì trên mạng lúc này cũng mang tên bạn và tài khoản nhà cung cấp của bạn. Cổng chuyển tiếp chỉ nghe 127.0.0.1.' });
    return S;
  }
  const site = r === 'socks5h' ? 'social.test' : 'phim.test';
  const flag = r === 'socks5' ? '--socks5' : '--socks5-hostname';
  const c = `curl -sS -m 5 ${r === 'socks5h' ? '--cacert /ca/ca.pem ' : ''}${flag} 127.0.0.1:1080 ${r === 'socks5h' ? 'https' : 'http'}://${site}/`;
  S.push({ focus: 'laptop', tunnel: true, where: 'socket', hop: { from: 'laptop', to: 'laptop', label: 'app → SOCKS 127.0.0.1:1080' }, term: [cmd('ssh -f -N -D 1080 vps'), cmd(c)],
    en: 'ssh -D 1080 made the laptop a SOCKS proxy. curl hands its request to 127.0.0.1:1080.', vi: 'ssh -D 1080 biến laptop thành proxy SOCKS. curl đưa request cho 127.0.0.1:1080.' });
  if (r === 'socks5') {
    S.push({ focus: 'dns', tunnel: true, where: 'dns-resolver', tone: 'bad', hop: { from: 'laptop', to: 'dns', label: 'DNS phim.test? → school DNS', vi: 'DNS phim.test? → DNS trường', bad: true }, term: [cmd(c), R(K.T_D_LEAK)],
      en: 'With plain --socks5 curl resolves the NAME on the laptop — through the school DNS, which says NXDOMAIN. The request never enters the tunnel. That is a DNS leak (and curl 8.18 mislabels it as a proxy error).',
      vi: 'Với --socks5 trơn, curl phân giải TÊN trên laptop — qua DNS của trường, vốn trả NXDOMAIN. Request chưa từng vào đường hầm. Đó là rò DNS (và curl 8.18 ghi nhầm thành lỗi proxy).',
      sees: { en: 'a DNS question for phim.test — your browsing list leaks', vi: 'một câu hỏi DNS cho phim.test — danh sách trang bạn vào bị lộ' } });
    return S;
  }
  S.push({ focus: 'fw', tunnel: true, where: 'conntrack', hop: { from: 'laptop', to: 'vps', label: `"${site}" inside SSH :993`, vi: `"${site}" trong SSH :993`, tunnel: true }, term: [cmd(c)],
    en: `socks5h sends the NAME through the tunnel. The school firewall sees only encrypted SSH to the VPS on 993 — no DNS question, no SNI.`,
    vi: `socks5h gửi cái TÊN qua đường hầm. Tường lửa trường chỉ thấy SSH mã hoá tới VPS ở cổng 993 — không câu hỏi DNS, không SNI.`,
    sees: { en: 'only flows to 198.18.0.30:993', vi: 'chỉ các luồng tới 198.18.0.30:993' } });
  S.push({ focus: 'site', tunnel: true, where: 'dns-resolver', tone: 'ok', hop: { from: 'vps', to: 'site', label: `VPS resolves ${site}, connects`, vi: `VPS phân giải ${site}, nối tới` }, term: [cmd(c), R(r === 'socks5h' ? K.T_D_SOCIAL : K.T_D_PHIM), cmd('iptables -L CHAN -v -n | awk \'/social/ {print $1, $3, $11, $14}\'   # on the school firewall'), R(K.T_GW_SNI), R(K.T_GW_FLOWS)],
    en: `The VPS resolves and connects; the site sees the VPS (198.18.0.30). On the school firewall the SNI rule caught only the direct try (1 packet); the rest is flows to the VPS on 993. Note: SOCKS through SSH carries TCP only — games (UDP) still need a VPN.`,
    vi: `VPS phân giải và nối tới; trang thấy người ghé là VPS (198.18.0.30). Trên tường lửa trường, luật SNI chỉ bắt lần gọi thẳng (1 gói); phần còn lại là luồng tới VPS ở 993. Lưu ý: SOCKS qua SSH chỉ chở TCP — game (UDP) vẫn cần VPN.` });
  return S;
}
