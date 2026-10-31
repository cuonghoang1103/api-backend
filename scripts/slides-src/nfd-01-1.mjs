/**
 * nfd-01-1 — Networking for Developers, bài 1.1 "Bit, byte, hex và tín hiệu: bảng chữ cái của mạng" (bài MỚI 31/10/2026,
 * slug netdev-1-0-bit-byte — dạy từ số 0 theo luật khoá tự đủ). Output = CHẠY THẬT (lab/out/c10-bit-byte.out.txt).
 */
import { lamDeck, sh, two, box, cards, steps, kw, bang, vsd, svg, T, R, C, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-01-1', code: 'NFD 1.1', title: 'Bits, bytes, hex and signals', sub: 'Networking for Developers · Chapter 1' };
const term = (t, o = {}) => sh(t, o);

/* Một byte = 8 ô bit, có trọng số 128…1, ví dụ 'G' = 0x47 = 71 */
const byteBox = () => {
  const bits = '01000111'.split(''), w = 1110, h = 170, cw = 100, x0 = 155;
  let s = T(10, 58, "'G' =", 30, { w: 800, f: C.app });
  bits.forEach((b, i) => {
    const on = b === '1', x = x0 + i * (cw + 6);
    s += R(x, 20, cw, 64, on ? C.tcp + '33' : '#f4f4f4', on ? C.tcp : '#bbb', { rx: 8 });
    s += T(x + cw / 2, 64, b, 34, { a: 'middle', w: 800, f: on ? C.tcp : '#999', m: 1 });
    s += T(x + cw / 2, 108, String(2 ** (7 - i)), 18, { a: 'middle', f: '#777', m: 1 });
  });
  s += T(x0, 148, '64 + 4 + 2 + 1 = 71 (decimal) = 0x47 (hex: 0100 → 4, 0111 → 7)', 22, { w: 700, f: C.br, m: 1 });
  return svg(w, h, s);
};

/* Bit đi trên dây: điện áp / ánh sáng / sóng, rồi chip mạng đổi lại thành byte trong RAM */
const signal = () => {
  const w = 1110, h = 210;
  let s = '';
  const bits = [0, 1, 0, 0, 0, 1, 1, 1];
  let path = 'M20,150';
  bits.forEach((b, i) => { const x = 20 + i * 70, y = b ? 70 : 150; path += ` L${x},${y} L${x + 70},${y}`; });
  s += `<path d="${path}" fill="none" stroke="${C.ip}" stroke-width="4"/>`;
  bits.forEach((b, i) => { s += T(55 + i * 70, 190, String(b), 22, { a: 'middle', w: 800, f: C.ip, m: 1 }); });
  s += T(20, 40, 'on the cable: high / low voltage (copper) · light on / off (fibre) · wave changes (Wi-Fi)', 18, { f: '#555' });
  s += R(640, 50, 210, 110, C.link + '18', C.link, { rx: 10 }) + T(745, 98, 'network chip', 20, { a: 'middle', w: 800, f: C.link }) + T(745, 124, 'signals ⇄ bytes', 16, { a: 'middle', f: '#555' });
  s += `<text x="880" y="112" font-size="34" fill="${C.br}">→</text>`;
  s += R(920, 50, 180, 110, C.app + '14', C.app, { rx: 10 }) + T(1010, 98, 'RAM', 22, { a: 'middle', w: 800, f: C.app }) + T(1010, 124, '0x47 = one byte', 16, { a: 'middle', f: '#555', m: 1 });
  return svg(w, h, s);
};

export const slides = lamDeck({ chuong: 'Chapter 1 — Layers and packets', bai: '1.1' }, [
  { cover: true, t: 'Bits, bytes, hex and signals', sub: 'The alphabet every packet is written in —<br>read real bytes with xxd', nhan: 'Chapter 1 · Lesson 1.1' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What a <b>bit</b> is physically, and how a network chip turns signals into bytes</li>
<li>Bytes and <b>hexadecimal</b>: why every packet tool prints pairs like <code class="i">47 45 54</code></li>
<li>Text as bytes: why “Xin chào” is 8 characters but <b>9 bytes</b></li>
<li>Numbers as bytes: port 80 is <code class="i">00 50</code> — <b>network byte order</b></li>
<li>Bits per second vs bytes per second — and why a “10 Gb/s” virtual card can do 46</li>
</ul>` },

  { t: 'A bit is a signal the chip can tell apart', giua: true, body: `
${signal()}
${box('Where this happens', 'The <b>physical layer</b>: the network chip (NIC) drives the cable or the antenna, and on the way in it turns signals back into bytes and copies them into RAM. Everything above this layer only ever sees bytes.', 'lam')}` },

  { t: 'Eight bits make a byte: 256 possible values', giua: true, body: `
${byteBox()}
${cards([
    ['bit', 'one 0 or 1 — the smallest piece'],
    ['byte', '8 bits ⇒ 2<sup>8</sup> = 256 values, 0 … 255'],
    ['hex digit', '4 bits ⇒ 16 values, 0 … 9 a … f — two hex digits = one byte'],
  ])}` },

  { t: 'Every packet tool prints bytes in hex', giua: true, body: `
${term(ra('c10-bit-byte', "printf 'GET' | xxd", 2))}
${two(box('Read it', '<b>47</b> = G · <b>45</b> = E · <b>54</b> = T. The left column is the <b>offset</b> (how many bytes from the start); the right column shows printable characters.', 'lam'),
    box('Why hex, not binary', 'One byte = exactly two hex digits. <code class="i">01000111</code> is hard to read; <code class="i">47</code> is not. tcpdump, Wireshark, xxd and MAC addresses all use hex.', 'xanh'))}` },

  { t: 'Text is bytes — and not one byte per letter', giua: true, body: `
${term(ra('c10-bit-byte', "printf 'Xin chào' | xxd", 2, { gay: 80 }))}
${vsd('<p style="margin:0;font-size:20px">Content-Length = number of <b>characters</b> ⇒ the last byte of the body is cut off, the JSON is broken.</p>',
    '<p style="margin:0;font-size:20px">Content-Length = number of <b>bytes</b> in UTF-8: “à” is <code class="i">c3 a0</code> — two bytes.</p>',
    '✗ Counting letters', '✓ Counting bytes')}` },

  { t: 'Numbers are bytes too: big-endian on the wire', giua: true, body: `
${term(ra('c10-bit-byte', 'python3 -c "print((80)', 1, { gay: 80 }) + '\n' + ra('c10-bit-byte', "python3 -c \"print('10.10.2.10", 1))}
${bang(['Value', 'In a packet', 'Rule'], [
    ['port 80', '<code class="i">00 50</code>', '2 bytes, <b>most significant byte first</b>'],
    ['port 443', '<code class="i">01 bb</code>', '1 × 256 + 187 = 443'],
    ['IP 10.10.2.10', '<code class="i">0a 0a 02 0a</code>', '4 bytes, one per dotted number'],
  ], { fs: 20 })}` },

  { t: 'Your CPU stores numbers the other way round', to: true, body: `
${term(ra('c10-bit-byte', 'python3 -c "import sys', 2))}
${box('Network byte order = big-endian', 'x86 and ARM CPUs are <b>little-endian</b>: the low byte first. So code that writes binary headers must convert: <code class="i">htons()</code> = host-to-network short. Forget it and port 80 goes out as <b>0x5000 = 20480</b>. JSON and HTTP text never meet this problem; binary protocols always do.', 'do2')}` },

  { t: 'Bits per second vs bytes per second', giua: true, body: `
${term(ra('c10-bit-byte', 'iperf3 -c 10.10.2.10 -t 2 -f m', 2))}
${two(box('The rule', 'Network speeds are in <b>bits</b> per second (Mbit/s, Gbit/s). Files are in <b>bytes</b>. Divide by 8: a 100 Mbit/s line moves at most <b>12.5 MB/s</b>.', 'lam'),
    box('Two runs, two numbers', 'Each line is a separate 2-second test, so they differ: 4853 MB/s × 8 ≈ 38 800 Mbit/s vs 46 815. Always measure more than once.', ''))}` },

  { t: 'A virtual card’s “speed” is just a label', to: true, giua: true, body: `
${term(ra('c10-bit-byte', 'ethtool eth0', 1))}
<ul>
<li>The lab card says <b>10 000 Mb/s</b>, yet iperf3 measured <b>~46 000 Mb/s</b></li>
<li>Both containers are on one computer: the “cable” is a memory copy in the kernel, limited by CPU, not by a wire</li>
<li>On real hardware the advertised speed is a ceiling; real throughput is lower (headers, distance, congestion — Chapter 4)</li>
</ul>` },

  { t: 'Units you will meet every day', giua: true, body: `
${bang(['Written', 'Means', 'Example'], [
    ['b, bit', 'one 0/1', '“a 48-bit MAC address”'],
    ['B, byte', '8 bits', '“the TCP header is 20 bytes”'],
    ['Mbit/s, Mbps', 'million bits per second', '“a 100 Mbps fibre plan”'],
    ['MB/s', 'million bytes per second', '“the download runs at 11 MB/s”'],
    ['octet', 'exactly 8 bits (RFC wording)', '“an IPv4 address is 4 octets”'],
    ['0x47, \\x47', 'the number 47 in hex', 'the byte for “G”'],
  ], { fs: 21 })}` },

  { t: 'Where you will use this in the course', to: true, giua: true, body: `
${steps([
    'Reading a frame in hex: which bytes are the MAC addresses, the IP, the port (lesson 1.3)',
    'Reading MAC addresses: <code class="i">02:00:0a:0a:01:0a</code> is six bytes (lesson 1.4)',
    'Subnets and masks: an IPv4 address as 32 bits (Chapter 2)',
    'Parsing a DNS packet byte by byte in Code Lab (Chapter 3)',
    'Bandwidth × delay: how many bytes are “in flight” on a link (Chapter 4)',
  ])}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>A bit is a signal the chip can tell apart; the NIC turns signals into <b>bytes</b> in RAM</li>
<li>One byte = 8 bits = 256 values = <b>two hex digits</b>; packet tools print hex</li>
<li>Text in UTF-8 can take several bytes per character — count <b>bytes</b>, not letters</li>
<li>Multi-byte numbers go on the wire <b>big-endian</b> (network byte order); CPUs are usually little-endian</li>
<li>Speeds are in <b>bits</b>/s, files in <b>bytes</b> — divide by 8</li>
</ul>
<p style="margin:0">${kw('bit', 'chữ số nhị phân')} ${kw('byte / octet', '8 bit')} ${kw('hex', 'hệ mười sáu')} ${kw('endianness', 'thứ tự byte')}</p>` },
]);
