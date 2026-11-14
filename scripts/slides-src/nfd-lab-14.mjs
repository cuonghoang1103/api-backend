/**
 * nfd-lab-14 — Networking for Developers, Lab 14 "Tuần đầu ở ký túc xá và ở trường" (slug netdev-14-7-lab-mang-thuc-chien).
 * Lời giải mẫu = output THẬT đã có (lab/out/c141…c146). Khuôn như các lab chương trước: tình huống · yêu cầu · rubric · một mẫu lời giải · checklist.
 */
import { lamDeck, sh, two, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-lab-14', code: 'NFD Lab 14', title: 'Lab 14 — Week one in the dorm and at school', sub: 'Networking for Developers · Chapter 14' };
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const rt = (...a) => ra(...a).replace(/[ \t]+$/gm, '');

export const slides = lamDeck({ chuong: 'Chapter 14 — Real-life networks', bai: 'Lab 14' }, [
  { cover: true, t: 'Lab 14 — Week one<br>in the dorm and at school', sub: 'Wi-Fi · a blocked network · SSH · VPN ·<br>a demo without port forwarding', nhan: 'Chapter 14 · Lab 14' },

  { t: 'The week', giua: true, body: `
${steps(['<b>Mon</b> — register the laptop on the school Wi-Fi', '<b>Tue</b> — half the Internet "is broken"', '<b>Wed</b> — deploy from the library, port 22 blocked', '<b>Thu</b> — the VPN works in the dorm, dies at school', '<b>Fri</b> — show the project on your home PC to the teacher'])}
${box('', 'Lab: <code class="i">bash lab/code/dung-output-ch14.sh</code> (14.1–14.2) and <code class="i">bash lab/code/dung-output-ch14b.sh</code> (14.3–14.6, <code class="i">CHI=143…146</code>) with <code class="i">GIU_LAB=1</code>.', 'lam')}` },

  { t: 'Requirements and rubric — 10 points', giua: true, body: `
${bang(['', 'Task', 'Pts'], [
    ['R1', 'registered MAC = MAC on SSID 2 (private address)', '1.5'],
    ['R2', '6 symptoms → DNS / SNI / IP / port / UDP / TTL + proof', '2'],
    ['R3', '~/.ssh/config: 993 at school, 22 at home · keys only', '2'],
    ['R4', 'WireGuard home vs school · TCP 443 tunnel · DNS leak fixed', '2'],
    ['R5', 'CGNAT? · reserved IP · demo WITHOUT a port forward', '1.5'],
    ['R6', 'three risks + the setting that stops each', '1'],
  ], { fs: 18 })}` },

  { t: 'Worked example — R3: the right door, by itself', body: `
${term(rt('c143-config', 'ssh -G vps 2>/dev/null', 1, { lan: 2 }), { title: 'at school (Match block FIRST): port 993' })}
${term(rt('c143-config-nha', 'ssh -G', 1), { title: 'same file at home: port 22' })}
${term(rt('c143-do-vps', 'sshd -T', 1), { title: 'and the server offers keys only' })}` },

  { t: 'Checklist — R1, R2', giua: true, body: `
${two(box('R1 Wi-Fi', '<code class="i">cat /run/truong/dang-ky.tsv</code> on nft-gw · <code class="i">ip -br link</code> on the laptop · the MAC in both must match', 'xanh'), box('R2 Blocked', '<code class="i">dig</code> · <code class="i">curl -v https://…</code> · <code class="i">nc -vz -w 3</code> · <code class="i">nc -u</code> — then <code class="i">iptables -L CHAN -v -n</code> + <code class="i">-t mangle -L PREROUTING -v -n</code>: which counter rose?', 'lam'))}
${term(rt('c142-dem', 'iptables -L CHAN', 1, { cut: 100, max: 10 }), { title: 'model answer R2: one counter per mechanism on the controller' })}` },

  { t: 'Checklist — R4, R5', giua: true, body: `
${two(box('R4 VPN', '<code class="i">wg show</code> at home and at school (handshake? bytes received?) · OpenVPN over 443 · <code class="i">tcpdump -i sv0 udp port 53</code> on nft-gw before and after fixing resolv.conf', 'xanh'), box('R5 Home', '<code class="i">ip -4 -br addr show wan</code> vs <code class="i">curl http://news.test/</code> · <code class="i">dhcp-host=MAC,IP</code> · <code class="i">ssh -R</code> + GatewayPorts — test from nft-vps', 'lam'))}
${term(rt('c146-wan', 'python3', 2, { gay: 96 }), { title: 'model answer R5: WAN in 100.64.0.0/10, the Internet sees another IP ⇒ CGNAT' })}` },

  { t: 'Checklist — R6: the attacker\'s week', giua: true, body: `
${bang(['Risk', 'Setting'], [
    ['a stranger on your open hotspot uses YOUR account (14.5)', 'WPA2/WPA3 + a long passphrase'],
    ['SOCKS on 0.0.0.0: the Wi-Fi rides your VPS (14.3)', 'bind forwards to 127.0.0.1'],
    ['bots guessing SSH passwords (14.3)', 'keys only, drop-in 01-, check sshd -T'],
    ['the router\'s default admin login (14.6)', 'change it; WPS/UPnP off'],
  ], { fs: 18 })}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Every task has a <b>command</b> and a <b>real answer</b> — no screenshot of a setting counts as proof</li>
<li>Name the checkpoint before you fix anything: MAC · DNS · SNI · port · UDP · TTL · CGNAT</li>
<li>When something is blocked: an allowed door (993/443), a tunnel out, a VPN over TCP — where a rule forbids it, follow the rule</li>
</ul>
<p style="margin:0">${kw('R1–R6', '10 điểm')} ${kw('ssh -G', 'cấu hình cuối')} ${kw('wg show', 'bắt tay?')} ${kw('CGNAT', 'WAN ≠ IP thấy')}</p>` },
]);
