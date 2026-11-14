/**
 * nfd-14-1 — Networking for Developers, bài 14.1 "Wi-Fi trường thực chiến: trang đăng nhập, đăng ký thiết bị theo MAC, và địa chỉ
 * Wi-Fi riêng làm MAC đổi" (slug netdev-14-1-wifi-truong-mac). Output = CHẠY THẬT đọc bằng ra(): lab/out/c141-* (máy Mac thật — MAC
 * bị che — và lab "Wi-Fi trường trong một hộp").
 */
import { lamDeck, sh, two, box, kw, bang, steps, ra, seq, svg, T, R, A, MK, C } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-14-1', code: 'NFD 14.1', title: 'School Wi-Fi in practice: login page, MAC registration, private addresses', sub: 'Networking for Developers · Chapter 14' };
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const dropU = /^# |^udhcpc: broadcasting/;

/** Hai SSID — mỗi SSID một MAC riêng — bộ điều khiển chỉ cho MAC đã đăng ký đi tiếp. */
function haiSsid() {
  const d = MK('ag', C.tcp) + MK('ar', C.red) + MK('ab', C.ip);
  let s = '';
  s += R(20, 90, 230, 150, '#f6f2ff', C.link, { rx: 14 }) + T(135, 125, '💻 MacBook', 24, { a: 'middle', w: 800, f: C.link });
  s += T(135, 160, 'card for SSID 1:', 17, { a: 'middle', f: '#555' }) + T(135, 184, '26:3a:91:c4:5e:10', 18, { a: 'middle', m: 1, f: C.link, w: 700 });
  s += T(135, 210, 'card for SSID 2:', 17, { a: 'middle', f: '#555' }) + T(135, 232, '9a:7f:02:b8:41:6d', 18, { a: 'middle', m: 1, f: C.red, w: 700 });
  s += R(420, 20, 300, 100, '#eef4fa', C.ip, { rx: 12 }) + T(570, 52, 'SSID 1 · TRUONG-DANGKY', 19, { a: 'middle', w: 800, f: C.ip }) + T(570, 80, 'no Internet · login page', 17, { a: 'middle', f: '#555' }) + T(570, 105, 'registers 26:3a:91:c4:5e:10 ✔', 17, { a: 'middle', f: C.tcp, w: 700 });
  s += R(420, 210, 300, 100, '#fdf0ee', C.red, { rx: 12 }) + T(570, 242, 'SSID 2 · TRUONG-SV', 19, { a: 'middle', w: 800, f: C.red }) + T(570, 270, 'Internet · only registered MACs', 17, { a: 'middle', f: '#555' }) + T(570, 295, 'sees 9a:7f:02:b8:41:6d ✘', 17, { a: 'middle', f: C.red, w: 700 });
  s += A(252, 140, 416, 72, 'ab', C.ip) + A(252, 200, 416, 258, 'ar', C.red);
  s += R(860, 110, 230, 120, '#fff7ec', C.or, { rx: 12 }) + T(975, 145, '🛂 controller', 22, { a: 'middle', w: 800, f: C.br }) + T(975, 175, 'SE12345 ↔', 18, { a: 'middle', m: 1 }) + T(975, 200, '26:3a:91:c4:5e:10', 17, { a: 'middle', m: 1, w: 700 });
  s += A(722, 70, 856, 140, 'ag', C.tcp) + A(722, 260, 856, 200, 'ar', C.red, { dash: 1 });
  s += T(790, 330, 'different MAC ⇒ "not registered" ⇒ blocked', 20, { a: 'middle', w: 800, f: C.red });
  return svg(1110, 345, s, d);
}

/** Byte đầu 0x26 thành 8 bit, tô hai bit cờ. */
function bitByte() {
  const bits = '00100110'.split('');
  let s = T(20, 40, '0x26 =', 26, { w: 800, m: 1, f: C.ip });
  bits.forEach((b, i) => {
    const x = 150 + i * 70, flag = i >= 6;
    s += R(x, 10, 60, 50, flag ? (i === 6 ? '#fde8e6' : '#eef4fa') : '#f5f5f5', flag ? (i === 6 ? C.red : C.ip) : '#bbb', { rx: 6 });
    s += T(x + 30, 45, b, 28, { a: 'middle', m: 1, w: 800, f: flag ? (i === 6 ? C.red : C.ip) : '#555' });
    s += T(x + 30, 80, `bit ${7 - i}`, 15, { a: 'middle', f: '#777' });
  });
  s += T(150 + 6 * 70 + 30, 112, 'bit 1 = 1 ⇒ locally administered', 18, { a: 'middle', w: 700, f: C.red });
  s += T(150 + 7 * 70 + 30, 138, 'bit 0 = 0 ⇒ one device', 18, { a: 'middle', w: 700, f: C.ip });
  return svg(1110, 150, s);
}

export const slides = lamDeck({ chuong: 'Chapter 14 — Real-life networks', bai: '14.1' }, [
  { cover: true, t: 'School Wi-Fi in practice:<br>login page, MAC registration,<br>private Wi-Fi addresses', sub: 'Why "registered" still means "blocked" —<br>and the fix that works the first time', nhan: 'Chapter 14 · Lesson 14.1' },

  { t: 'Chapter 14 in one frame — and this lesson', giua: true, body: `
${box('🎯 Chapter 14: networking where you actually live', 'School Wi-Fi with a login page · networks that block sites, games, SSH · hotspots · VPNs and tunnels · the router at home. Measured on a lab you run: <b>"school Wi-Fi in a box"</b>.', 'lam')}
${box('The real story', 'Register on an SSID with <b>no Internet</b>, switch to the SSID <b>with</b> Internet — only the registered device passes. One account = one device. And the Mac was blocked <b>even after registering</b>: its MAC "kept changing".', 'do2')}
<ul><li>MAC vs IP · reading a MAC · DHCP in four packets</li><li>How the login page appears · what the controller writes</li><li>The culprit: <b>private Wi-Fi address</b> — and the fix · one account, one MAC · the attacker's corner</li></ul>` },

  { t: 'Two addresses, two jobs', giua: true, body: `
${bang(['', 'MAC address', 'IP address'], [
    ['Looks like', '<code class="i">a4:83:e7:5c:21:0b</code>', '<code class="i">10.20.2.114</code>'],
    ['Layer', '2 — one link (one Wi-Fi)', '3 — across networks'],
    ['Set by', 'card factory, or the OS (private MAC)', 'DHCP, or by hand'],
    ['Changes', 'normally never', 'every join / lease — normal'],
    ['Picture', '🏍️ chassis number of a motorbike', '🏠 address of the room you rent'],
    ['School checks it?', '<b>yes — registration</b>', 'no'],
  ], { fs: 20 })}
${box('', '"My IP changed" is harmless. <b>"My MAC changed"</b> is what breaks a network that registers devices by MAC.', 'lam')}` },

  { t: 'Your own Mac: two different MACs', body: `
${term(ra('c141-mac', 'ifconfig en0', 2), { title: 'MacBook on home Wi-Fi — last 3 bytes of real MACs masked' })}
${term(ra('c141-mac', 'ipconfig getpacket', 1), { title: 'the DHCP answer the Mac kept: chaddr = the MAC the router saw' })}
${box('', '<code class="i">networksetup</code> = the <b>hardware</b> MAC (f4:d4:88…). <code class="i">ifconfig</code> = the MAC <b>in use on this network</b> (26:df:5a…). The router — and a school — only ever see the second one.', 'do2')}` },

  { t: 'Reading a MAC: maker, and random or not', body: `
${bitByte()}
${two(term(ra('c141-oui', 'grep -iE "^MA-L,(F4D488', 2), { title: 'public IEEE registry (oui.csv)' }), box('Rule of thumb', 'Second hex character <b>2, 6, A or E</b> ⇒ private/random MAC. No maker owns <code class="i">26DF5A</code> (count = 0).', 'xanh'))}
${bang(['MAC', '2nd character', 'Verdict'], [
    ['<code class="i">f4:d4:88:…</code>', '4', 'factory — Apple (this Mac\'s Wi-Fi chip)'],
    ['<code class="i">26:df:5a:…</code>', '6', 'private — what this Mac uses at home'],
    ['<code class="i">8c:8d:28:…</code>', 'c', 'factory — Intel (the lab\'s Windows laptop)'],
    ['<code class="i">9a:7f:02:…</code>', 'a', 'private — the lab Mac on SSID 2'],
  ], { fs: 18 })}` },

  { t: 'DHCP: borrowing an IP in four packets (DORA)', body: `
${seq('💻 laptop (no IP yet)', '🛂 controller 10.20.1.1', [
    { d: 'r', t: '① Discover — from 0.0.0.0, carries MAC 26:3a:91:c4:5e:10', c: C.link },
    { d: 'l', t: '② Offer — you can have 10.20.1.177', c: C.ip },
    { d: 'r', t: '③ Request — I take 10.20.1.177', c: C.link },
    { d: 'l', t: '④ Ack — yours for 7200 s · gateway + DNS 10.20.1.1', c: C.tcp },
  ], { rowH: 38 })}
${term(ra('c141-dora', 'tshark', 2, { cut: 100 }), { title: 'captured on the controller: sender MAC · destination · message, then the lease file' })}` },

  { t: 'Why the login page pops up by itself', body: `
${term(ra('c141-mac', 'curl -s http://captive.apple.com', 2), { title: 'home Wi-Fi (real Mac): the probe gets exactly what it expects' })}
${term(ra('c141-dk', 'curl -sI', 1), { title: 'school SSID before login (lab): intercepted, redirected to the login page' })}
${term(ra('c141-dk', 'curl -sS --cacert', 1, { max: 2 }), { title: 'HTTPS cannot be redirected — wrong certificate' })}
${box('', 'The OS fetches a known <b>HTTP</b> page (Apple: <code class="i">Success</code>, Windows: <code class="i">Microsoft Connect Test</code>). Anything else ⇒ "captive" ⇒ the login window opens. Open any <code class="i">http://</code> address to trigger it by hand.', 'lam')}` },

  { t: 'What the controller writes when you log in', body: `
${term(ra('c141-dk', 'curl -s -d', 1), { title: 'MacBook logs in on the registration SSID' })}
${term(ra('c141-dora', 'cat /run/truong/dang-ky.tsv', 2), { title: 'controller: account ↔ MAC, then a firewall rule for THAT MAC' })}
${box('', 'It cannot see "your laptop" — only the <b>source MAC</b> of the frame that carried the login. Like a dorm guard writing down your bike\'s chassis number.', 'lam')}` },

  { t: 'The bug: SSID 2 sees a different MAC', body: `
${haiSsid()}
${term(ra('c141-sv', 'ip -br link show sv', 3, { cut: 104 }), { title: 'MacBook on TRUONG-SV with "Private Wi-Fi address: Fixed"' })}` },

  { t: 'Private Wi-Fi address — the three modes', giua: true, body: `
${bang(['Setting', 'MAC used', 'On a school network'], [
    ['macOS/iOS <b>Off</b> · Windows <b>Off</b>', 'the hardware MAC', '✅ register once, every SSID works'],
    ['macOS/iOS <b>Fixed</b> · Windows <b>On</b>', 'one private MAC <b>per network</b>', '❌ SSID 1 and SSID 2 see different MACs'],
    ['macOS/iOS <b>Rotating</b> · Windows <b>Change daily</b>', 'new private MAC every 2 weeks / every day', '❌ works, then "randomly" stops'],
  ], { fs: 20 })}
${box('Also', 'Fixed is the Apple default on WPA2/WPA3 networks. <b>Forgetting</b> a network (macOS 15 / iOS 18+) forgets its private MAC too (unless &lt; 24 h) ⇒ a new MAC, registration lost.', 'do2')}` },

  { t: 'The fix that works the first time', body: `
${steps([
    'Private address <b>Off for BOTH school SSIDs</b> — macOS: Wi-Fi → Details… → Private Wi-Fi Address → Off · Windows: Manage known networks → Random hardware addresses → Off',
    'Check: <code class="i">ifconfig en0 | grep ether</code> = <code class="i">networksetup -getmacaddress Wi-Fi</code> (Windows: <code class="i">getmac /v</code>)',
    'Join the registration SSID, log in <b>once</b>, then join the Internet SSID',
  ])}
${term(ra('c141-tat', 'curl -s -d', 4, { drop: dropU, cut: 104 }), { title: 'same MAC on both cards ⇒ registered, HTTP and HTTPS work' })}` },

  { t: 'One account = one MAC · two laptops on one MAC', body: `
${term(ra('c141-win', 'curl -s -d', 1, { cut: 104 }) + '\n' + ra('c141-mat', 'curl -sL', 1, { cut: 104 }), { title: 'Windows logs in with the same account ⇒ the Mac is kicked' })}
${term(ra('c141-trung-win', 'curl -sS -o /dev/null', 1, { gay: 70 }) + '\n' + ra('c141-trung-fdb', 'cut -d', 1), { title: 'a third machine copies the MAC: same IP, both downloads reset, the switch table flips between two ports' })}
${box('', 'Fix: ask IT to register a second device. Two machines on one MAC break each other\'s TCP — and <b>ping still says 0% loss</b>.', 'lam')}` },

  { t: 'The attacker\'s corner', body: `
${two(box('1 · Copy a MAC', 'Ride a classmate\'s login — the controller only checks the MAC (we just did it).', 'do2'), box('2 · Evil twin + fake login', 'Same SSID name, a "login page" on http:// or a strange domain asking for your <b>email</b> password.', 'do2'))}
${term(ra('c141-arp-nan', 'ip neigh show dev sv', 1) + '\n' + ra('c141-arp-doc', 'tshark -r /tmp/nghe.pcap -Y "http.request"', 2, { gay: 70 }), { title: '3 · ARP spoofing in the lab: gateway = attacker\'s MAC; HTTP password readable, HTTPS only the name' })}
${box('Defend', 'HTTPS everywhere, never click through certificate warnings · VPN on untrusted Wi-Fi · 802.1X networks · two IPs with one MAC in <code class="i">arp -a</code> = suspicious.', 'xanh')}` },

  { t: 'Better design (802.1X) and a troubleshooting order', giua: true, body: `
${box('WPA2/WPA3-Enterprise (802.1X, e.g. eduroam)', 'You log in <b>when joining the SSID</b>; a RADIUS server checks the person; each device gets its own keys. Private MACs are fine, copied MACs are useless. Check the network\'s certificate before trusting it.', 'xanh')}
${bang(['#', 'Check', 'macOS', 'Healthy'], [
    ['1', 'MAC in use', '<code class="i">ifconfig en0 | grep ether</code>', '= the registered one'],
    ['2', 'Got an IP', '<code class="i">ipconfig getifaddr en0</code>', 'not 169.254.x.x'],
    ['3', 'Gateway', '<code class="i">arp -a</code>', 'one MAC per IP'],
    ['4', 'Portal', '<code class="i">curl -sI http://captive.apple.com</code>', '200 + Success'],
    ['5', 'DNS / HTTPS', '<code class="i">dig</code> · <code class="i">curl -I https://…</code>', 'answer + valid cert'],
  ], { fs: 18 })}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>IP = room address (changes, normal) · <b>MAC = chassis number</b> (what the school registers)</li>
<li>The network sees the MAC <b>in use</b> (<code class="i">ifconfig en0</code>), not the hardware one; 2/6/A/E = private</li>
<li>Private Wi-Fi address ⇒ a different MAC per SSID ⇒ registered on one, blocked on the other — <b>Off for both school SSIDs</b></li>
<li>One account = one MAC; two machines on one MAC break each other's TCP — ask IT for a second device</li>
<li>MAC registration is weak security: MAC copying, evil twins, ARP spoofing — <b>HTTPS, VPN, 802.1X</b></li>
</ul>
<p style="margin:0">${kw('MAC', 'địa chỉ card mạng')} ${kw('OUI', 'mã hãng')} ${kw('private Wi-Fi address', 'địa chỉ Wi-Fi riêng')} ${kw('DHCP lease', 'hợp đồng thuê IP')} ${kw('captive portal', 'trang đăng nhập')} ${kw('ARP spoofing', 'ARP giả mạo')}</p>` },
]);
