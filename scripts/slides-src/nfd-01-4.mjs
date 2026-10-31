/**
 * nfd-01-4 — Networking for Developers, bài 1.4 "Ethernet, địa chỉ MAC và ARP" (slug netdev-1-3-ethernet-arp).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c13-*.out.txt). Khuôn _nfd-chung.mjs.
 */
import { lamDeck, sh, two, box, cards, kw, bang, steps, seq, svg, T, R, C, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-01-4', code: 'NFD 1.4', title: 'Ethernet, MAC addresses and ARP', sub: 'Networking for Developers · Chapter 1' };
const term = (t, o = {}) => sh(t, o);
const tcpd = (s) => s.replace(/^\d\d:\d\d:\d\d\.\d+ /gm, '').replace(/, ethertype /g, ' ').replace(/ \(0x0806\)| \(0x0800\)/g, '');

/* 6 byte MAC: 3 byte đầu (OUI hoặc cờ) + 3 byte sau */
const macPic = () => {
  const w = 1110, h = 190, by = ['02', '00', '0a', '0a', '01', '0a'];
  let s = '';
  by.forEach((b, i) => {
    const x = 60 + i * 168;
    s += R(x, 20, 150, 70, i < 3 ? C.link + '22' : C.ip + '18', i < 3 ? C.link : C.ip, { rx: 8 });
    s += T(x + 75, 66, b, 34, { a: 'middle', w: 800, m: 1, f: i < 3 ? C.link : C.ip });
  });
  s += T(60 + 1.5 * 168 - 9, 120, 'first 3 bytes: manufacturer (OUI) — or flags', 18, { a: 'middle', w: 700, f: C.link });
  s += T(60 + 4.5 * 168 - 9, 120, 'last 3 bytes: chosen per card', 18, { a: 'middle', w: 700, f: C.ip });
  s += T(555, 162, 'first byte 02 = 0000 0010: bit “locally administered” = 1 (not from a factory) · bit “multicast” = 0', 17, { a: 'middle', f: '#555' });
  return svg(w, h, s);
};

export const slides = lamDeck({ chuong: 'Chapter 1 — Layers and packets', bai: '1.4' }, [
  { cover: true, t: 'Ethernet, MAC addresses<br>and ARP', sub: 'How a frame finds the next device —<br>and why your machine sometimes remembers the wrong one', nhan: 'Chapter 1 · Lesson 1.4' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What a <b>MAC address</b> is, how to read one, and why it is valid on <b>one link only</b></li>
<li>How a <b>switch</b> learns which port leads to which MAC — seen in a real switch table</li>
<li><b>ARP</b>: how a machine finds the MAC behind an IP — captured live</li>
<li>Why you ARP for the <b>router</b>, never for a server on another network</li>
<li>The stale ARP cache: “I changed the machine and the network still remembers the old one”</li>
</ul>` },

  { t: 'A MAC address: 48 bits on a network card', giua: true, body: `
${macPic()}
${bang(['Example', 'Meaning'], [
    ['<code class="i">ff:ff:ff:ff:ff:ff</code>', '<b>broadcast</b> — every device on this link'],
    ['a card from a manufacturer', 'first 3 bytes = vendor code (OUI), burned in at the factory'],
    ['<code class="i">02:…</code> (our lab)', 'locally administered — chosen by software (Docker, VMs, phones’ random MACs)'],
  ], { fs: 20 })}` },

  { t: 'Ethernet only reaches the next device', to: true, body: `
${cards([
    ['One link', 'A frame goes from one card to another on the <b>same</b> cable, Wi-Fi or switch — a “broadcast domain”.'],
    ['Next hop', 'To leave the network, the frame is addressed to the <b>router’s</b> MAC. The router builds a new frame on the other side.'],
    ['Switch', 'Reads the destination MAC, sends the frame out of the port where that MAC lives — or to all ports if unknown.'],
  ])}
${box('So every packet carries two kinds of address', 'IP addresses say <b>where the packet is going</b> (end to end). MAC addresses say <b>which card receives this frame now</b> (one hop).', 'lam')}` },

  { t: 'A switch learns from the source address', giua: true, body: `
${term(ra('c13-switch', 'bridge fdb show', 1), { title: 'the Docker bridge nfd-lan — a real switch table (read-only)' })}
${steps([
    'A frame arrives on a port ⇒ the switch writes “<b>this source MAC lives behind this port</b>”',
    'Destination MAC known ⇒ send out of that one port · unknown or broadcast ⇒ <b>flood</b> to all ports',
    'Entries expire after a few minutes without traffic',
  ])}` },

  { t: 'The question ARP answers', to: true, giua: true, body: `
${term(ra('c13-arp', 'ip route get 10.10.1.11', 2))}
<ul>
<li>10.10.1.11 is on my link (<code class="i">dev eth0</code>) ⇒ I need <b>its</b> MAC</li>
<li>10.10.2.10 is not ⇒ go <b>via 10.10.1.254</b> ⇒ I need the <b>router’s</b> MAC</li>
<li>Either way I know an IP and need a MAC: <b>ARP</b> (Address Resolution Protocol) finds it</li>
</ul>` },

  { t: 'ARP, captured: who has 10.10.1.11?', giua: true, body: `
${seq('client 10.10.1.10', 'client2 10.10.1.11', [
    { d: 'r', t: 'who-has 10.10.1.11? (to ff:ff:ff:ff:ff:ff)', c: C.link, s: 'broadcast' },
    { d: 'l', t: '10.10.1.11 is-at 02:00:0a:0a:01:0b', c: C.link, s: 'unicast reply' },
    { d: 'r', t: 'ICMP echo request', c: C.ip, s: 'now unicast' },
    { d: 'l', t: 'ICMP echo reply', c: C.ip },
  ])}
${term(tcpd(ra('c13-arp', 'tcpdump -e -n -r', 1, { drop: /^reading/, max: 6 })), { sm: true, title: 'tcpdump -e (timestamps removed)' })}` },

  { t: 'Why is the request there twice?', to: true, body: `
${term(tcpd(ra('c13-q-in', 'tcpdump -e -n -r', 1, { drop: /^reading/ })), { title: 'captured with -Q in: only frames ARRIVING at the client' })}
${box('Measured, not guessed', 'Capturing only <b>incoming</b> frames shows one copy of our <b>own</b> broadcast coming back in: the Docker Desktop bridge reflects it. It is not a second request — a quirk of this virtual switch. Real lesson: when a capture looks odd, ask “in which direction?”', 'lam')}` },

  { t: 'The ARP cache: remember, then forget', giua: true, body: `
${term(ra('c13-arp', 'ip neigh show', 1) + '\n' + ra('c13-arp', 'ip neigh flush all', 2) + '\n…  (two pings later)\n' + ra('c13-arp', 'ip neigh show', 1, { lan: 3 }), { sm: true })}
${bang(['State', 'Means'], [
    ['REACHABLE', 'confirmed recently — use it'],
    ['STALE', 'not confirmed for a while — still used, re-checked on next use'],
    ['DELAY → PROBE', 'checking: wait 5 s, then unicast ARP probes'],
    ['FAILED', 'no answer — ask again by broadcast next time'],
  ], { fs: 19 })}` },

  { t: 'Through the router: MAC changes, IP does not', giua: true, body: `
${term(ra('c13-hop-client', 'tshark', 1).split('\n').slice(1).join('\n'), { sm: true, title: 'LAN side (captured on the client)' })}
${term(ra('c13-hop-web', 'tshark', 1).split('\n').slice(1).join('\n'), { sm: true, title: 'DMZ side (captured on the web server) — the same request' })}
<p style="margin:0;font-size:20px">Both <b>MACs</b> replaced · <b>IP addresses</b> and ports unchanged · <b>TTL</b> 64 → 63 · IP checksum recomputed.</p>` },

  { t: 'Bug: the machine was replaced, the cache was not', body: `
${two(term(ra('c13-stale-2', 'ip neigh', 2, { drop: /^$|statistics|PING/ }) , { sm: true, title: 'client2 now has MAC …:01:bb' }),
    term(ra('c13-stale-garp', 'arping', 1) + '\n' + ra('c13-stale-3', 'ip neigh', 1), { sm: true, title: 'the new machine announces itself' }))}
${box('What happened', 'The client still sent frames to the <b>old MAC</b> …:01:0b: 3 pings, 0 replies, while the cache said REACHABLE. A <b>gratuitous ARP</b> (“10.10.1.11 is at …:01:bb”) from the new machine updated every cache at once.', 'do2')}` },

  { t: 'Without the announcement: about 9 seconds of loss', giua: true, body: `
${term(ra('c13-stale-cho', 'for i in', 1).replace(/^\$ .*/, '$ for i in $(seq 1 90); do ping -c1 -W1 10.10.1.11 …; print only when something changes; done'), { title: 'client2 changed its MAC again to …:01:cc, silently' })}
${steps([
    '<b>DELAY</b>: entry is old, traffic flows to the old MAC — lost — kernel waits 5 s',
    '<b>PROBE</b>: unicast ARP to the old MAC — no answer',
    '<b>FAILED</b> ⇒ next packet triggers a fresh broadcast ⇒ the new MAC is learned ⇒ reply',
  ])}` },

  { t: 'Where this lives in the computer', to: true, giua: true, body: `
<ul>
<li>The <b>ARP cache</b> (neighbour table) is a kernel table in <b>RAM</b> — <code class="i">ip neigh</code> reads it</li>
<li>ARP frames are built by the kernel and sent by the <b>network chip</b>; your program never sees them</li>
<li>The <b>switch table</b> lives in the switch — here, inside the Docker VM’s kernel (<code class="i">bridge fdb</code>)</li>
<li>Failover tools (keepalived, cloud floating IPs) send gratuitous ARP on purpose when an IP moves</li>
</ul>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>A MAC address names a network card; it is used <b>one hop at a time</b></li>
<li>A switch learns MAC → port from source addresses and floods what it does not know</li>
<li>ARP turns a next-hop IP into a MAC; for other networks the next hop is the <b>router</b></li>
<li>At each router the frame is rebuilt: new MACs, same IPs, TTL − 1</li>
<li>Replacing a machine behind an IP needs a <b>gratuitous ARP</b> — or users wait for the cache to fail</li>
</ul>
<p style="margin:0">${kw('MAC address', 'địa chỉ phần cứng')} ${kw('broadcast', 'gửi cho cả mạng')} ${kw('ARP cache', 'bảng hàng xóm')} ${kw('gratuitous ARP', 'tự thông báo')}</p>` },
]);
