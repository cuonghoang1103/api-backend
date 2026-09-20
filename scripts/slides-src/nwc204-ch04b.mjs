/**
 * nwc204-ch04b.mjs — NWC204 Chapter 4B: Number Systems (CHƯƠNG BÙ).
 *
 * ⛔ Kế hoạch 60 buổi của FPT KHÔNG xếp buổi nào cho phần này: chương 5 của môn
 * dùng Cisco Module 6, chương 6 dùng Module 7 — lệch 1 đơn vị suốt phần còn lại,
 * và module bị nhảy qua chính là **Module 5 — Number Systems**. Nhưng buổi 30–33
 * dạy IPv4 Addressing, chia subnet và VLSM, không đọc được nhị phân thì không làm
 * được. Vì vậy đây là chương WEB BỔ SUNG do cuongthai.com dựng, đặt trước chương
 * IPv4 Addressing. Slide 2 nói thẳng điều đó.
 *
 * ⚠️ MỌI con số trên các slide này đã được kiểm lại bằng python3 (114 phép kiểm)
 * và mọi bảng bit/AND dưới đây đều do helper TỰ TÍNH từ chuỗi bit, không gõ tay.
 */
import { CSS, bits, stack, topo, term, kv, m } from './_nwc-chung.mjs';

export const deck = {
  key: 'nwc204-ch04b',
  code: 'NWC204',
  title: 'Ch.4B — Number Systems (added chapter)',
  sub: 'NWC204 · Computer Networking · cuongthai.com',
};

const W8 = [128, 64, 32, 16, 8, 4, 2, 1];
const dec = (b) => parseInt(b, 2);

/** Hàng bit có nhãn ở đầu — dùng cho bảng AND. Giá trị thập phân TỰ TÍNH. */
const bitRow = (label, b, cls = '') =>
  `<tr><th style="background:#eef5fc;text-align:right;padding-right:8px">${label}</th>` +
  [...b].map((c) => `<td class="${c === '1' ? 'one' : 'zero'}${cls ? ' ' + cls : ''}">${c}</td>`).join('') +
  `<td class="one">${dec(b)}</td></tr>`;

/** Bảng AND một octet: A, mask, kết quả. Kết quả TỰ TÍNH, không gõ tay. */
const andOctet = (a, mk) => {
  const r = [...a].map((c, i) => (c === '1' && mk[i] === '1' ? '1' : '0')).join('');
  return `${CSS}<table class="nw-bits">` +
    `<tr><th></th><th>${W8.join('</th><th>')}</th><th>=</th></tr>` +
    bitRow('address', a) + bitRow('mask', mk) + bitRow('AND', r) + `</table>`;
};

/** Bảng AND đủ 4 octet của một địa chỉ với một mặt nạ. */
const andAll = (ip, mask) => {
  const a = ip.split('.').map(Number), b = mask.split('.').map(Number);
  const r = a.map((x, i) => x & b[i]);
  const bin = (n) => n.toString(2).padStart(8, '0');
  const row = (lb, arr, cls) =>
    `<tr><th>${lb}</th>` + arr.map((n) => `<td${cls ? ` class="${cls}"` : ''}>${bin(n)}<br><span style="color:#6b8199">${n}</span></td>`).join('') + `</tr>`;
  return `${CSS}<table class="t" style="font-size:18px;font-family:SF Mono,Menlo,monospace">` +
    `<tr><th></th><th>octet 1</th><th>octet 2</th><th>octet 3</th><th>octet 4</th></tr>` +
    row('address', a) + row('mask', b) + row('AND', r, 'hl') +
    `<tr><th>network</th><td colspan="4" class="hl">${r.join('.')}</td></tr></table>`;
};

export const slides = [
  {
    kind: 'cover',
    t: 'Number Systems',
    sub: 'Chapter 4B — Cisco Module 5 — ADDED BY cuongthai.com',
    body: `<div class="cov-meta">⚠️ FPT scheduled NO session for this material<br>
      Binary · 8-bit conversion both ways · why an octet stops at 255<br>
      Hexadecimal · why MAC and IPv6 use it · bitwise AND<br>
      Without this chapter, sessions 30–33 (IPv4 addressing, subnetting, VLSM) are impossible</div>`,
  },

  {
    t: 'Why this chapter is here at all',
    body: `${CSS}
      <table class="t">
        <tr><th>Course chapter (FPT)</th><th>Cisco module</th><th>FLM sessions</th></tr>
        <tr><td>3. Protocols and Models</td><td>Module 3</td><td>7–8</td></tr>
        <tr><td>4. Physical Layer</td><td>Module 4</td><td>11–12</td></tr>
        <tr><td class="hl">— nothing —</td><td class="hl">Module 5 — Number Systems</td><td class="hl">NONE</td></tr>
        <tr><td>5. Data Link Layer</td><td>Module 6</td><td>15–16</td></tr>
        <tr><td>6. Ethernet Switching</td><td>Module 7</td><td>17–18</td></tr>
        <tr><td>10. IPv4 Addressing</td><td>Module 11</td><td>30–33 — needs binary</td></tr>
      </table>
      <div class="box warn">From chapter 5 onward the course numbering runs exactly
      one behind Cisco. The module that was skipped is <b>Module 5</b>. This chapter
      is <b>not part of the FLM plan</b> — it was added for this site, because
      subnetting in sessions 30–33 cannot be done without it.</div>`,
  },

  {
    t: 'Why machines count in twos',
    body: `${CSS}
      ${topo([
        'nd.cl:Voltage|high = 1 · low = 0',
        'lk:one wire<br>one bit at a time',
        'nd:Light|on = 1 · off = 0',
        'lk:one fibre',
        'nd.cl:Radio|two phases = 1 and 0',
      ])}
      ${kv([
        ['A wire has two reliable states', 'present or absent — ten voltage levels would be ten times easier to misread'],
        ['So every address is really bits', 'the dotted decimal you type is only a human costume'],
        ['One octet = 8 bits', 'an IPv4 address is 4 octets = 32 bits'],
        ['A MAC address', '48 bits · an IPv6 address 128 bits'],
      ])}`,
  },

  {
    t: 'The position table is the whole trick',
    body: `${CSS}
      ${bits('11111111', 'every position set — this is the largest an octet can be')}
      ${kv([
        ['Read left to right', '128 · 64 · 32 · 16 · 8 · 4 · 2 · 1 — each step halves'],
        ['A 1 means', 'add that column value'],
        ['A 0 means', 'skip it'],
        ['Memorise this one row', 'everything else in this chapter is just using it'],
      ])}
      <p class="note">128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255. That single sum
      explains the whole range of an octet.</p>`,
  },

  {
    t: 'Binary → decimal, worked: 11000000',
    body: `${CSS}
      ${bits('11000000', '128 + 64 = 192 — the first octet of 192.168.x.x')}
      <div class="steps">
        <div><span class="n">1</span><span>Write the position row above the bits: 128 64 32 16 8 4 2 1</span></div>
        <div><span class="n">2</span><span>Keep only the columns holding a 1: <b>128</b> and <b>64</b></span></div>
        <div><span class="n">3</span><span>Add them: 128 + 64 = <b>192</b></span></div>
      </div>
      <p class="note">Mental shortcut: a byte that starts <span class="nw-m">11</span>
      and then stops is always 192. You will meet it every day as a mask octet.</p>`,
  },

  {
    t: 'Binary → decimal, worked: 10101100',
    body: `${CSS}
      ${bits('10101100', '128 + 32 + 8 + 4 = 172 — the first octet of 172.16.x.x')}
      <div class="steps">
        <div><span class="n">1</span><span>Columns with a 1: 128, 32, 8, 4</span></div>
        <div><span class="n">2</span><span>128 + 32 = 160 · 160 + 8 = 168 · 168 + 4 = <b>172</b></span></div>
        <div><span class="n">3</span><span>Add the big numbers first — fewer carries, fewer mistakes</span></div>
      </div>
      <div class="box ok">Check it in one line: <span class="nw-m">python3 -c "print(int('10101100',2))"</span> → 172</div>`,
  },

  {
    t: 'The two extremes decide the range',
    body: `${CSS}
      ${bits('00000000', 'no column selected → 0, the smallest an octet can be')}
      ${bits('11111111', 'every column selected → 255, the largest')}
      ${kv([
        ['8 bits', 'give 2 to the power of 8 = 256 different patterns'],
        ['Counting from 0', 'the values run 0 … 255 — that is 256 values, not 255'],
        ['So each octet', 'can never be negative and never exceed 255'],
      ])}`,
  },

  {
    t: 'Why 192.168.1.256 does not exist',
    body: `${CSS}
      <table class="t">
        <tr><th>Written</th><th>Binary needed</th><th>Verdict</th></tr>
        <tr><td><span class="nw-m">192.168.1.255</span></td><td>11111111 — 8 bits</td><td>Valid (it is the broadcast of that /24)</td></tr>
        <tr><td class="hl"><span class="nw-m">192.168.1.256</span></td><td class="hl">100000000 — <b>9 bits</b></td><td class="hl">Impossible — an octet only holds 8</td></tr>
        <tr><td><span class="nw-m">192.168.1.300</span></td><td>100101100 — 9 bits</td><td>Impossible for the same reason</td></tr>
      </table>
      <div class="box warn">The error message you will actually see is
      <span class="nw-m">Invalid IP address</span> or a config line the router
      silently refuses. Now you know it is not a typo rule — it is arithmetic: the
      ninth bit has nowhere to live.</div>`,
  },

  {
    t: 'Decimal → binary: the subtraction ladder',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span>200 ≥ 128? <b>yes</b> → write 1, keep 200 − 128 = 72</span></div>
        <div><span class="n">2</span><span>72 ≥ 64? <b>yes</b> → write 1, keep 72 − 64 = 8</span></div>
        <div><span class="n">3</span><span>8 ≥ 32? no → 0 · 8 ≥ 16? no → 0</span></div>
        <div><span class="n">4</span><span>8 ≥ 8? <b>yes</b> → write 1, keep 0</span></div>
        <div><span class="n">5</span><span>0 for every remaining column — stop when the remainder is 0</span></div>
      </div>
      ${bits('11001000', '200 = 128 + 64 + 8 — the remainder reached 0, so the rest are zeros')}`,
  },

  {
    t: 'Decimal → binary, second pass: 172',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span>172 − 128 = 44 → bit 128 is <b>1</b></span></div>
        <div><span class="n">2</span><span>44 &lt; 64 → bit 64 is <b>0</b> · 44 − 32 = 12 → bit 32 is <b>1</b></span></div>
        <div><span class="n">3</span><span>12 &lt; 16 → bit 16 is <b>0</b> · 12 − 8 = 4 → bit 8 is <b>1</b></span></div>
        <div><span class="n">4</span><span>4 − 4 = 0 → bit 4 is <b>1</b>; bits 2 and 1 are <b>0</b></span></div>
      </div>
      ${bits('10101100', '172 — and the sum check gives 128 + 32 + 8 + 4 = 172 ✓')}
      <p class="note">Always finish by adding the ones back up. If the sum is not
      the number you started with, you dropped a column.</p>`,
  },

  {
    t: 'A whole IPv4 address, octet by octet',
    body: `${CSS}
      <table class="t" style="font-size:20px;font-family:SF Mono,Menlo,monospace">
        <tr><th>Octet</th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
        <tr><th>decimal</th><td>192</td><td>168</td><td>10</td><td>10</td></tr>
        <tr><th>binary</th><td class="hl">11000000</td><td class="hl">10101000</td><td class="hl">00001010</td><td class="hl">00001010</td></tr>
        <tr><th>positions</th><td>128+64</td><td>128+32+8</td><td>8+2</td><td>8+2</td></tr>
      </table>
      ${kv([
        ['The address is really', '11000000 10101000 00001010 00001010 — 32 bits in a row'],
        ['The dots', 'are punctuation for humans; the router never sees them'],
        ['Two addresses are in the same network', 'when the bits the mask covers are identical'],
      ])}`,
  },

  {
    t: 'Hexadecimal: four bits, one symbol',
    body: `${CSS}
      <table class="t" style="font-size:18px;font-family:SF Mono,Menlo,monospace">
        <tr><th>Binary</th><td>0000</td><td>0001</td><td>0010</td><td>0011</td><td>0100</td><td>0101</td><td>0110</td><td>0111</td></tr>
        <tr><th>Decimal</th><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td></tr>
        <tr><th>Hex</th><td class="hl">0</td><td class="hl">1</td><td class="hl">2</td><td class="hl">3</td><td class="hl">4</td><td class="hl">5</td><td class="hl">6</td><td class="hl">7</td></tr>
        <tr><th>Binary</th><td>1000</td><td>1001</td><td>1010</td><td>1011</td><td>1100</td><td>1101</td><td>1110</td><td>1111</td></tr>
        <tr><th>Decimal</th><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td></tr>
        <tr><th>Hex</th><td class="hl">8</td><td class="hl">9</td><td class="hl">A</td><td class="hl">B</td><td class="hl">C</td><td class="hl">D</td><td class="hl">E</td><td class="hl">F</td></tr>
      </table>
      <p class="note">4 bits have 16 patterns and hex has exactly 16 symbols — so
      one hex digit is one nibble, with <b>no arithmetic at all</b>. That is the
      entire reason hex exists.</p>`,
  },

  {
    t: 'Why MAC and IPv6 use hex, IPv4 does not',
    body: `${CSS}
      <table class="t">
        <tr><th></th><th>IPv4</th><th>MAC</th><th>IPv6</th></tr>
        <tr><td><b>Length</b></td><td>32 bits</td><td>48 bits</td><td class="hl">128 bits</td></tr>
        <tr><td><b>Written as</b></td><td>4 decimal octets</td><td>12 hex digits</td><td>32 hex digits</td></tr>
        <tr><td><b>Example</b></td><td><span class="nw-m">192.168.10.10</span></td><td><span class="nw-m">00:1B:44:11:3A:B7</span></td><td><span class="nw-m">2001:db8::1</span></td></tr>
        <tr><td><b>In decimal it would be</b></td><td>—</td><td>0.27.68.17.58.183</td><td class="hl">39 digits long</td></tr>
      </table>
      ${kv([
        ['Decimal hides the bits', 'you must divide by 2 to see them — 255 tells you nothing at a glance'],
        ['Hex shows the bits', 'each digit IS four bits, so a prefix boundary is visible by eye'],
        ['IPv4 kept decimal', 'purely historical — it was designed for humans reading paper'],
      ])}`,
  },

  {
    t: 'Reading a MAC address in binary',
    body: `${CSS}
      <table class="t" style="font-size:19px;font-family:SF Mono,Menlo,monospace">
        <tr><th>Hex pair</th><td>00</td><td>1B</td><td>44</td><td>11</td><td>3A</td><td>B7</td></tr>
        <tr><th>Binary</th><td>00000000</td><td class="hl">00011011</td><td>01000100</td><td>00010001</td><td class="hl">00111010</td><td>10110111</td></tr>
        <tr><th>Decimal</th><td>0</td><td>27</td><td>68</td><td>17</td><td>58</td><td>183</td></tr>
      </table>
      ${kv([
        ['Each hex pair', 'is one byte = 8 bits = 2 nibbles: 1B = 0001 then 1011'],
        ['First 3 bytes (00:1B:44)', 'OUI — identifies the manufacturer'],
        ['Last 3 bytes (11:3A:B7)', 'serial assigned by that manufacturer'],
        ['48 bits total', 'about 281 thousand billion possible addresses'],
      ])}`,
  },

  {
    t: 'Bitwise AND — the operation a router runs',
    body: `${CSS}
      <div class="two">
        <div><div class="nh">Truth table</div>
          <table class="t" style="font-size:21px">
            <tr><th>A</th><th>B</th><th>A AND B</th></tr>
            <tr><td>0</td><td>0</td><td>0</td></tr>
            <tr><td>0</td><td>1</td><td>0</td></tr>
            <tr><td>1</td><td>0</td><td>0</td></tr>
            <tr><td class="hl">1</td><td class="hl">1</td><td class="hl">1</td></tr>
          </table>
          <p class="note">Only 1 AND 1 survives. So a mask bit of 1 <b>keeps</b> the
          address bit, and a mask bit of 0 <b>erases</b> it to 0.</p>
        </div>
        <div><div class="nh">One octet: 200 AND 192</div>
          ${andOctet('11001000', '11000000')}
          <p class="note">200 AND 192 = 192 — the host part was wiped out and only
          the network part is left.</p>
        </div>
      </div>`,
  },

  {
    t: 'AND across all four octets',
    body: `${CSS}
      ${andAll('192.168.10.200', '255.255.255.192')}
      <div class="steps">
        <div><span class="n">1</span><span>Octets 1–3: the mask is 11111111, so every bit is kept unchanged</span></div>
        <div><span class="n">2</span><span>Octet 4: 11001000 AND 11000000 = 11000000 → 192</span></div>
        <div><span class="n">3</span><span>The network address of this host is <b>192.168.10.192</b></span></div>
      </div>`,
  },

  {
    t: 'Same network or different? Ask AND twice',
    body: `${CSS}
      <table class="t" style="font-size:19px">
        <tr><th>Host</th><th>Address</th><th>Mask</th><th>AND → network</th><th>Verdict</th></tr>
        <tr><td>PC-A</td><td><span class="nw-m">192.168.10.10</span></td><td>255.255.255.192</td><td class="hl">192.168.10.0</td><td rowspan="2" class="hl">DIFFERENT<br>router needed</td></tr>
        <tr><td>PC-B</td><td><span class="nw-m">192.168.10.200</span></td><td>255.255.255.192</td><td class="hl">192.168.10.192</td></tr>
        <tr><td>PC-A</td><td><span class="nw-m">192.168.10.10</span></td><td>255.255.255.0</td><td>192.168.10.0</td><td rowspan="2">SAME<br>send it directly</td></tr>
        <tr><td>PC-B</td><td><span class="nw-m">192.168.10.200</span></td><td>255.255.255.0</td><td>192.168.10.0</td></tr>
      </table>
      <div class="box warn">Same two hosts, same cable, same switch — <b>only the
      mask changed</b>, and with /26 they can no longer talk without a router.
      This is the single most common "the network is broken" that is not broken.</div>`,
  },

  {
    t: 'Mark your own homework with python3',
    body: `${CSS}
      ${term(`<span class="c"># Both directions, in one line each</span>
<span class="p">$</span> <span class="k">python3</span> -c <span class="g">"print(bin(192), int('11000000',2))"</span>
0b11000000 192

<span class="c"># A whole address, padded to 8 bits per octet</span>
<span class="p">$</span> <span class="k">python3</span> -c <span class="g">"print('.'.join(f'{int(o):08b}' for o in '192.168.10.10'.split('.')))"</span>
11000000.10101000.00001010.00001010

<span class="c"># The AND a router does — and the answer it reaches</span>
<span class="p">$</span> <span class="k">python3</span> -c <span class="g">"import ipaddress as i; print(i.ip_network('192.168.10.200/26', strict=False))"</span>
192.168.10.192/26`, 'sm')}
      <div class="box ok">Do every exercise on paper <b>first</b>, then check. If you
      check before you finish, you learn to read the answer instead of the method —
      and sessions 30–33 will hurt.</div>`,
  },
];
