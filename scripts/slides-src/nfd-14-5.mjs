/**
 * nfd-14-5 — Networking for Developers, bài 14.5 "Chia sẻ mạng và điểm phát: laptop thành một router" (slug netdev-14-5-chia-se-mang-hotspot).
 * Output = CHẠY THẬT đọc bằng ra(): lab/out/c145-* (bash lab/code/dung-output-ch14b.sh, CHI=145).
 */
import { lamDeck, sh, two, box, kw, bang, ra, svg, T, R, A, MK, C } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-14-5', code: 'NFD 14.5', title: 'Sharing a connection and hotspots', sub: 'Networking for Developers · Chapter 14' };
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const rt = (...a) => ra(...a).replace(/[ \t]+$/gm, '');

/** Laptop = router nhỏ: card hs, forwarding, MASQUERADE + bảng conntrack. */
function routerNho() {
  const d = MK('g', C.tcp) + MK('r', C.red);
  let s = '';
  s += R(10, 70, 200, 100, '#fdf0ee', C.red, { rx: 12 }) + T(110, 108, '📱 phone', 21, { a: 'middle', w: 800, f: C.red }) + T(110, 140, '192.168.137.50', 16, { a: 'middle', m: 1 });
  s += R(290, 30, 470, 180, '#f6f2ff', C.link, { rx: 14 }) + T(525, 62, '💻 laptop = a small router', 21, { a: 'middle', w: 800, f: C.link });
  s += T(525, 94, '① card hs 192.168.137.1  ② ip_forward = 1', 16, { a: 'middle', m: 1 });
  s += T(525, 122, '③ MASQUERADE: src → 10.20.2.159', 16, { a: 'middle', m: 1, w: 700, f: C.tcp });
  s += R(330, 140, 390, 54, '#fff', C.gy, { rx: 8 }) + T(525, 164, 'conntrack: .50:43708 ↔ 10.20.2.159:43708', 15, { a: 'middle', m: 1 }) + T(525, 186, '(who gets which reply)', 13, { a: 'middle', f: '#666' });
  s += R(850, 70, 240, 100, '#fff7ec', C.or, { rx: 12 }) + T(970, 106, '🛂 school controller', 18, { a: 'middle', w: 800, f: C.br }) + T(970, 136, 'sees one IP + one MAC', 15, { a: 'middle' }) + T(970, 158, '… and TTL / clocks', 15, { a: 'middle', f: C.red });
  s += A(212, 120, 286, 120, 'r', C.red) + T(249, 110, 'TTL 64', 13, { a: 'middle', w: 700, f: C.red });
  s += A(762, 120, 846, 120, 'g', C.tcp) + T(804, 110, 'TTL 63', 13, { a: 'middle', w: 700, f: C.tcp });
  return svg(1100, 220, s, d);
}

export const slides = lamDeck({ chuong: 'Chapter 14 — Real-life networks', bai: '14.5' }, [
  { cover: true, t: 'Sharing a connection<br>and hotspots', sub: 'your laptop becomes a router — NAT, conntrack, TTL,<br>and the stranger on your open hotspot', nhan: 'Chapter 14 · Lesson 14.5' },

  { t: 'What you will get', giua: true, body: `
${box('The questions', '① What does "Mobile Hotspot" actually turn on? ② Why does my phone behind the laptop get nothing at school? ③ What happens when a stranger joins my hotspot?', 'do2')}
<ul>
<li>The laptop as a <b>small router</b>: second card, forwarding, NAT — and the conntrack note it keeps</li>
<li>The <b>TTL</b> clue, rewriting it, and the clue that survives (<b>TCP clocks</b>)</li>
<li>What NAT buys: remove it and the phone becomes a stranger</li>
<li>Phone → laptop, USB tethering, and the attacker's corner</li>
</ul>` },

  { t: 'A hotspot = three switches', giua: true, body: `
${routerNho()}
${term(rt('c145-nat', 'ip -br', 3), { title: 'nft-win with Mobile Hotspot on: card hs, forwarding, one MASQUERADE line' })}` },

  { t: 'The phone is dead — TTL 63', body: `
${term(rt('c145-dt-ttl', 'curl', 1), { title: 'phone behind the laptop, at school: timeout (lesson 14.2\'s rule drops TTL 63)' })}
${term(rt('c145-ttl-win', 'iptables -t mangle -A', 3) + '\n' + rt('c145-dt-ok', 'curl', 1), { title: 'rewrite TTL to 64 on the way out ⇒ the phone works' })}` },

  { t: 'The clue that survives: two clocks', body: `
${term(rt('c145-ttl-gw', 'tshark', 2, { gay: 96 }), { title: 'school controller: same IP, TTL 64 twice — but TCP timestamps billions apart; the TTL rule caught 5 packets first' })}
${box('', 'TTL is the cheapest clue, not the only one: TCP timestamps, the User-Agent, the number of connections, phone-typical DNS names. Operators use the same clues — read your contract; where sharing is forbidden, follow the rule.', 'lam')}` },

  { t: 'Without NAT the phone is a stranger', body: `
${term(rt('c145-bo-nat', 'iptables', 1, { gay: 96 }) + '\n' + rt('c145-dt-khongnat', 'curl', 1), { title: 'forwarding still on, MASQUERADE removed' })}
${term(rt('c145-gw-thay', 'tshark', 1, { gay: 96 }), { title: 'the controller receives source 192.168.137.50 — not its range ⇒ dropped (source guard, BCP 38)' })}` },

  { t: 'conntrack: the note NAT keeps', body: `
${term(rt('c145-ct', 'conntrack', 2, { gay: 96 }), { title: 'each connection = original (phone → web) + expected reply (web → 10.20.2.159, same port)' })}
${box('', 'Lives in kernel RAM (<code class="i">conntrack -C</code>, limit <code class="i">nf_conntrack_max</code>). A full table on a cheap router = "the Internet stops when everyone is home".', 'lam')}` },

  { t: 'Phone → laptop · USB · Wi-Fi to Wi-Fi', giua: true, body: `
${bang(['Way', 'What happens', 'Notes'], [
    ['📱 phone shares 4G', 'the phone NATs; laptop gets 172.20.10.x (iPhone)', 'operator may see TTL 63/127'],
    ['🔌 USB tethering', 'same NAT over a cable', 'lower latency, charges, nobody else joins'],
    ['📶 Wi-Fi → Wi-Fi', 'one card = client + access point', 'many cards cannot (<code class="i">iw list</code>) — explained, not measured'],
  ], { fs: 19 })}` },

  { t: 'Attacker\'s corner: the stranger on your hotspot', body: `
${term(rt('c145-ke', 'curl', 1) + '\n' + rt('c145-ke-win', 'ip neigh', 1), { title: 'a stranger\'s phone joins the open hotspot — and shows up next to yours' })}
${term(rt('c145-ke-gw', 'cat', 1), { title: 'for the school, that traffic = the laptop\'s MAC = account SE12345 = YOU' })}` },

  { t: 'Defend your hotspot', giua: true, body: `
${two(box('🔐 Lock it', 'WPA2, better WPA3 · a long passphrase you chose, never the printed default · a name that does not say who you are', 'xanh'), box('👀 Watch it', 'check the connected-devices list · turn the hotspot off after use · do not post it in a big group chat', 'lam'))}
${box('', 'On an open (unencrypted) Wi-Fi anyone nearby can read unencrypted traffic out of the air — and everyone on it shares a network with your phone.', 'do2')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>A hotspot is a small router: <b>second card + forwarding + MASQUERADE</b></li>
<li>NAT hides private addresses; <b>conntrack</b> remembers who gets each reply</li>
<li><b>TTL 63/127</b> betrays sharing; rewriting TTL does not hide TCP clocks and other clues</li>
<li>An open hotspot lends your identity — <b>WPA2/WPA3 + a real passphrase</b></li>
</ul>
<p style="margin:0">${kw('ip_forward', 'chuyển tiếp gói')} ${kw('MASQUERADE', 'NAT theo card ra')} ${kw('conntrack', 'bảng kết nối')} ${kw('TTL', 'số chặng')} ${kw('source guard', 'chống giả nguồn')}</p>` },
]);
