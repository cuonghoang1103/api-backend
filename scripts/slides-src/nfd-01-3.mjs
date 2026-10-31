/**
 * nfd-01-3 — Networking for Developers, bài 1.3 "Đóng gói: frame, packet, segment" (slug netdev-1-2-dong-goi).
 * Output = CHẠY THẬT đọc thẳng bằng ra() (lab/out/c12-goi, c12-big-on, c12-tso-web, c12-big-off). Khuôn _nfd-chung.mjs.
 */
import { lamDeck, sh, two, box, kw, bang, vsd, steps, envelope, bytebar, hexdump, svg, T, R, C, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-01-3', code: 'NFD 1.3', title: 'Encapsulation: frames, packets, segments', sub: 'Networking for Developers · Chapter 1' };
const term = (t, o = {}) => sh(t, o);

// hex dump thật của frame GET /api/hello (149 byte): 14 Ethernet | 20 IPv4 | 32 TCP | 83 HTTP
const HEX = ra('c12-goi', 'tshark -r /tmp/g.pcap -Y http.request -x', 1, { boLenh: true }).split('\n').filter((l) => /^[0-9a-f]{4}\s/.test(l));
const R4 = [[0, 13, 'link'], [14, 33, 'ip'], [34, 65, 'tcp'], [66, 148, 'app']];
const F = ra('c12-goi', 'tshark -r /tmp/g.pcap -Y http.request -T fields', 1, { boLenh: true }).split('\n')[0].split('\t');
const [flen, edst, esrc, etype, ihl, ilen, ttl, proto, thl, tlen] = F;
const b = (i) => HEX.join(' ').match(/^[0-9a-f]{4}\s+(.*)$/gm);
void b;
const bytes = HEX.map((l) => l.replace(/^[0-9a-f]{4}\s+/, '').slice(0, 47).trim().split(/\s+/)).flat();
const hx = (a, n) => bytes.slice(a, a + n).join(' ');

/* Đi xuống ở máy gửi, đi lên ở máy nhận */
const downUp = () => {
  const w = 1110, h = 400, L = [['HTTP text', C.app, '83 B · curl (user space)'], ['+ TCP header', C.tcp, '32 B · kernel'], ['+ IP header', C.ip, '20 B · kernel'], ['+ Ethernet header', C.link, '14 B · driver → NIC']];
  let s = T(170, 22, 'SENDER — wrap (encapsulate) ↓', 19, { a: 'middle', w: 800, f: C.br }) + T(940, 22, '↑ unwrap (decapsulate) — RECEIVER', 19, { a: 'middle', w: 800, f: C.br });
  const UP = ['port 80 → hand to the nginx socket', 'protocol 6 → TCP reads the ports', 'type 0x0800 → IP reads the addresses', 'dst MAC is mine → keep the frame'];
  L.forEach(([t, c, sub], i) => {
    const y = 40 + i * 84;
    s += R(10, y, 330, 70, c + '22', c, { rx: 8 }) + T(175, y + 31, t, 20, { a: 'middle', w: 800, f: c }) + T(175, y + 56, sub, 15, { a: 'middle', f: '#555' });
    s += R(770, y, 330, 70, c + '22', c, { rx: 8 }) + T(935, y + 42, UP[i], 16, { a: 'middle', w: 700, f: c });
  });
  s += R(380, 150, 350, 80, '#fff7ef', C.or, { rx: 10 }) + T(555, 185, '149 bytes on the wire', 21, { a: 'middle', w: 800, f: C.br }) + T(555, 212, 'cable / Wi-Fi / virtual bridge', 15, { a: 'middle', f: '#555' });
  s += `<text x="350" y="200" font-size="30" fill="${C.br}">→</text><text x="742" y="200" font-size="30" fill="${C.br}">→</text>`;
  s += T(555, 394, 'Reading upward: each step uses a number in the header below it — EtherType, IP protocol, TCP port.', 16, { a: 'middle', f: '#555', i: 1 });
  return svg(w, h, s);
};

export const slides = lamDeck({ chuong: 'Chapter 1 — Layers and packets', bai: '1.3' }, [
  { cover: true, t: 'Encapsulation:<br>frames, packets, segments', sub: 'One real 149-byte frame, opened byte by byte —<br>then MTU, MSS and the offload trap', nhan: 'Chapter 1 · Lesson 1.3' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>How each layer <b>wraps</b> the data of the layer above — and unwraps it on arrival</li>
<li>The names: <b>segment</b> (TCP), <b>packet</b> (IP), <b>frame</b> (Ethernet)</li>
<li>Reading a real frame in hex: MAC addresses, IP addresses, ports, the HTTP text</li>
<li><b>MTU 1500</b>, MSS 1460, and why a full segment carries <b>1448</b> bytes</li>
<li>Why your capture can show a “packet” bigger than the MTU</li>
</ul>` },

  { t: 'Four headers nested like envelopes', giua: true, body: `
${envelope([
    { k: 'link', t: 'Ethernet frame', b: 14, s: `dst ${edst} · src ${esrc} · type ${etype}` },
    { k: 'ip', t: 'IPv4 packet', b: Number(ihl), s: `total length ${ilen} · TTL ${ttl} · protocol ${proto}` },
    { k: 'tcp', t: 'TCP segment', b: Number(thl), s: `ports, sequence numbers, flags, options` },
    { k: 'app', t: 'HTTP request', b: Number(tlen), s: 'GET /api/hello HTTP/1.1 …' },
  ])}
<p style="margin:0;font-size:20px">The same packet as in lesson 1.2. Each layer treats everything inside it as an opaque <b>payload</b>.</p>` },

  { t: 'Count the bytes: 14 + 20 + 32 + 83 = 149', giua: true, body: `
${bytebar([{ k: 'link', t: 'Ethernet', b: 14 }, { k: 'ip', t: 'IPv4', b: Number(ihl) }, { k: 'tcp', t: 'TCP', b: Number(thl) }, { k: 'app', t: 'HTTP data', b: Number(tlen) }])}
${term(ra('c12-goi', 'tshark -r /tmp/g.pcap -Y http.request -T fields', 1).replace(/ 2>\/dev\/null/, ''), { sm: true })}
${bang(['tshark field', 'value', 'means'], [
    ['frame.len', flen, 'the whole frame as captured'],
    ['ip.hdr_len · ip.len', `${ihl} · ${ilen}`, 'IP header · IP packet = IP + TCP + data (149 − 14)'],
    ['tcp.hdr_len · tcp.len', `${thl} · ${tlen}`, 'TCP header with options · the HTTP bytes it carries'],
  ], { fs: 19 })}
<p class="nho" style="margin:0">Also on a real cable, not in the capture: 8 bytes of preamble, a 4-byte checksum (FCS) and a 12-byte gap.</p>` },

  { t: 'The real frame, coloured by layer', giua: true, body: `
${hexdump(HEX, R4, { fs: 21 })}` },

  { t: 'Bytes 0–13: the Ethernet header', to: true, giua: true, body: `
${bang(['Bytes', 'Field', 'Value here', 'Means'], [
    ['0–5', 'destination MAC', `<code class="i">${hx(0, 6)}</code>`, 'the <b>router</b>’s card — the next hop'],
    ['6–11', 'source MAC', `<code class="i">${hx(6, 6)}</code>`, 'the client’s card'],
    ['12–13', 'EtherType', `<code class="i">${hx(12, 2)}</code>`, '0x0800 = an IPv4 packet follows'],
  ], { fs: 21 })}
${box('Notice', 'The destination is <b>not</b> the web server (02:00:0a:0a:02:0a): an Ethernet frame only travels to the next device. Lesson 1.4 explains how the client learned the router’s MAC.', 'lam')}` },

  { t: 'Bytes 14–33: the IPv4 header', body: `
${two(term(ra('c12-goi', 'tshark -r /tmp/g.pcap -Y http.request -O ip,tcp', 1, { boLenh: true }).split('\n').slice(0, 10).join('\n'), { sm: true, title: 'tshark -O ip (lines trimmed)' }),
    bang(['Bytes', 'Field'], [
      [`<code class="i">${hx(14, 1)}</code>`, 'version 4, header 5 × 4 = 20 B'],
      [`<code class="i">${hx(16, 2)}</code>`, `total length ${ilen}`],
      [`<code class="i">${hx(22, 1)}</code>`, `TTL ${ttl}`],
      [`<code class="i">${hx(23, 1)}</code>`, 'protocol 6 = TCP'],
      [`<code class="i">${hx(26, 4)}</code>`, 'source 10.10.1.10'],
      [`<code class="i">${hx(30, 4)}</code>`, 'destination 10.10.2.10'],
    ], { fs: 19 }), 'r64')}` },

  { t: 'Bytes 34–65: the TCP header', body: `
${bang(['Bytes', 'Field', 'Value', 'Means'], [
    ['34–35', 'source port', `<code class="i">${hx(34, 2)}</code>`, `${parseInt(hx(34, 2).replace(' ', ''), 16)} — a temporary port of curl`],
    ['36–37', 'destination port', `<code class="i">${hx(36, 2)}</code>`, '80 — nginx'],
    ['38–45', 'sequence / ack numbers', `<code class="i">${hx(38, 4)} …</code>`, 'which bytes these are / which bytes were received (Ch.4)'],
    ['46–47', 'header length + flags', `<code class="i">${hx(46, 2)}</code>`, '8 × 4 = 32 B header · PSH, ACK'],
    ['48–49', 'window', `<code class="i">${hx(48, 2)}</code>`, 'how much more I can receive (Ch.4)'],
    ['54–65', 'options', `<code class="i">01 01 08 0a …</code>`, 'NOP, NOP, timestamps — 12 B'],
  ], { fs: 19 })}
${box('Then bytes 66–148', 'The 83 bytes of HTTP text: <code class="i">47 45 54 20</code> = “GET ”. TCP never looks at them.', 'xanh')}` },

  { t: 'Down the stack, across, and up again', giua: true, body: `${downUp()}` },

  { t: 'MTU: the biggest packet a link will carry', to: true, giua: true, body: `
${term(ra('c12-goi', 'ip link show eth0', 1) + '\n' + ra('c12-goi', 'ping -c 1 -M do -s 1472', 2, { drop: /^$|statistics|rtt|transmitted/ }), { sm: true })}
${bytebar([{ k: 'ip', t: 'IPv4', b: 20 }, { k: 'tcp', t: 'ICMP', b: 8 }, { k: 'app', t: 'ping data', b: 1472 }], { minW: 140 })}
<p style="margin:0;font-size:21px"><b>MTU 1500</b> = the largest IP packet on this Ethernet. 1472 bytes of ping data + 8 (ICMP) + 20 (IP) = <b>1500</b> fits; 1473 does not, and with “don’t fragment” (<code class="i">-M do</code>) the kernel refuses to send it.</p>` },

  { t: 'From MTU to MSS to 1448', giua: true, body: `
${bytebar([{ k: 'link', t: 'Ethernet', b: 14 }, { k: 'ip', t: 'IPv4', b: 20 }, { k: 'tcp', t: 'TCP', b: 20 }, { k: 'tcp', t: 'timestamps', b: 12 }, { k: 'app', t: 'data', b: 1448 }], { tong: false, minW: 120 })}
${steps([
    '<b>MTU 1500</b> − 20 (IP) − 20 (TCP) = <b>MSS 1460</b>: what each side announces in its SYN',
    '− 12 bytes of TCP timestamp options in every segment = <b>1448</b> bytes of data',
    'A 3 991-byte HTTP response therefore travels as 1448 + 1448 + 1095',
  ])}` },

  { t: 'Measured: one response, three segments', giua: true, body: `
${term(ra('c12-big-off', 'curl -s -o /dev/null', 2), { sm: true })}
${box('Read it', 'Frame <b>1514</b> = 14 + 20 + 32 + <b>1448</b>. The last one carries the 1 095 bytes left. Headers plus body = 3 991 bytes — the 3 841-byte body plus 150 bytes of HTTP headers.', 'lam')}` },

  { t: 'The trap: a 4057-byte “packet” in your capture', giua: true, body: `
${term(ra('c12-big-on', 'tshark', 1).replace(/ 2>\/dev\/null/, ''), { sm: true, title: 'before: offload ON (default) — captured on the client' })}
${term(ra('c12-tso-web', 'ethtool -K', 1) + '\n' + ra('c12-big-off', 'tshark -r /tmp/b2.pcap -Y', 1).replace(/ 2>\/dev\/null/, ''), { sm: true, title: 'after: TSO/GSO switched off on the web server' })}
${box('TSO / GSO: segmentation offload', 'The kernel hands the card (or the driver) one big chunk and lets <b>it</b> cut the segments later. tcpdump captures before the cut, so you see 4 057 bytes — bigger than the MTU. It is not a bug and not what travels on the wire.', 'do2')}` },

  { t: 'Overhead: why small messages are expensive', to: true, giua: true, body: `
${bang(['Frame', 'Data', 'Headers', 'Useful share'], [
    ['GET /api/hello (149 B)', '83 B', '66 B', '<b>56 %</b>'],
    ['full segment (1514 B)', '1448 B', '66 B', '<b>95.6 %</b>'],
    ['bare ACK (66 B)', '0 B', '66 B', '0 %'],
  ], { fs: 22 })}
<p style="margin:0">Many tiny requests waste the link; batching and connection reuse matter (Chapters 4, 8).</p>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Each layer wraps the one above: data → <b>segment</b> (TCP) → <b>packet</b> (IP) → <b>frame</b> (Ethernet)</li>
<li>Our request: 14 + 20 + 32 + 83 = <b>149</b> bytes; every field can be found in the hex</li>
<li>Ethernet addresses the next hop; IP addresses the destination; ports pick the program</li>
<li>MTU 1500 → MSS 1460 → <b>1448</b> data bytes per segment with timestamps</li>
<li>Captures can show super-packets because of segmentation offload</li>
</ul>
<p style="margin:0">${kw('encapsulation', 'đóng gói')} ${kw('payload', 'phần tải')} ${kw('MTU', 'gói lớn nhất')} ${kw('MSS', 'dữ liệu lớn nhất / segment')}</p>` },
]);
