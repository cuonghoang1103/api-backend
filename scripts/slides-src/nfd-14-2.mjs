/**
 * nfd-14-2 — Networking for Developers, bài 14.2 "Mạng trường chặn những gì và chặn bằng cách nào: DNS, SNI, cổng, UDP và TTL của
 * điểm phát" (slug netdev-14-2-mang-truong-chan). Output = CHẠY THẬT đọc bằng ra(): lab/out/c142-* (lab "Wi-Fi trường trong một hộp").
 */
import { lamDeck, sh, two, box, kw, bang, steps, ra, svg, T, R, A, MK, C } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-14-2', code: 'NFD 14.2', title: 'What the school network blocks, and how', sub: 'Networking for Developers · Chapter 14' };
const term = (t, o = {}) => sh(t, { sm: true, ...o });

/** Một request đi qua năm trạm kiểm soát. */
function tram() {
  const ds = [['🛂', 'MAC', 'registered?', C.link], ['📒', 'DNS', 'name crossed out?', C.app], ['✉️', 'SNI', 'name on envelope?', C.app], ['🚪', 'IP / port', 'allowed door?', C.ip], ['🔢', 'TTL', 'one device?', C.tcp]];
  let s = '', d = MK('k', '#888');
  s += R(0, 70, 120, 90, '#f6f2ff', C.link, { rx: 12 }) + T(60, 108, '💻', 30, { a: 'middle' }) + T(60, 145, 'student', 17, { a: 'middle', w: 700 });
  ds.forEach(([ic, n, q, c], i) => {
    const x = 170 + i * 170;
    s += R(x, 55, 145, 120, c + '14', c, { rx: 12 }) + T(x + 72, 92, ic, 28, { a: 'middle' }) + T(x + 72, 128, n, 21, { a: 'middle', w: 800, f: c }) + T(x + 72, 156, q, 15, { a: 'middle', f: '#555' });
    s += A(x - 48, 115, x - 4, 115, 'k', '#888');
  });
  s += A(1022, 115, 1046, 115, 'k', '#888') + T(1080, 122, '🌐', 34, { a: 'middle' });
  s += T(555, 215, 'each checkpoint fails differently — the error tells you which one stopped you', 19, { a: 'middle', w: 700, f: C.br });
  return svg(1110, 230, s, d);
}

/** Điện thoại sau điểm phát của laptop: TTL 64 → 63. */
function hotspot() {
  const d = MK('g', C.tcp) + MK('r', C.red);
  let s = '';
  s += R(10, 60, 210, 110, '#fdf0ee', C.red, { rx: 12 }) + T(115, 98, '📱 phone', 22, { a: 'middle', w: 800, f: C.red }) + T(115, 128, '192.168.137.50', 17, { a: 'middle', m: 1 }) + T(115, 155, 'sends TTL 64', 17, { a: 'middle', w: 700 });
  s += R(330, 40, 290, 150, '#f6f2ff', C.link, { rx: 12 }) + T(475, 75, '💻 laptop = router + NAT', 20, { a: 'middle', w: 800, f: C.link }) + T(475, 105, 'hotspot 192.168.137.1', 16, { a: 'middle', m: 1 }) + T(475, 130, 'school side 10.20.2.159', 16, { a: 'middle', m: 1 }) + T(475, 160, 'own packets: TTL 64', 17, { a: 'middle', w: 700, f: C.tcp });
  s += R(760, 60, 330, 110, '#fff7ec', C.or, { rx: 12 }) + T(925, 95, '🛂 school controller sees', 20, { a: 'middle', w: 800, f: C.br }) + T(925, 125, 'same MAC · same IP', 17, { a: 'middle' }) + T(925, 153, 'TTL 64 and TTL 63 ⇒ 2 devices', 17, { a: 'middle', w: 800, f: C.red });
  s += A(222, 115, 326, 115, 'r', C.red) + T(274, 104, 'NAT', 15, { a: 'middle', w: 700, f: C.red });
  s += A(622, 95, 756, 95, 'g', C.tcp) + T(690, 85, 'TTL 64', 16, { a: 'middle', w: 700, f: C.tcp });
  s += A(622, 140, 756, 140, 'r', C.red) + T(690, 165, 'TTL 63 (−1)', 16, { a: 'middle', w: 700, f: C.red });
  return svg(1110, 200, s, d);
}

export const slides = lamDeck({ chuong: 'Chapter 14 — Real-life networks', bai: '14.2' }, [
  { cover: true, t: 'What the school network<br>blocks, and how', sub: 'DNS · SNI · ports · UDP · the hotspot TTL —<br>read the error, name the checkpoint', nhan: 'Chapter 14 · Lesson 14.2' },

  { t: 'Three real questions — and what you will get', giua: true, body: `
${box('The questions', '① "Why does this site not open at school?" ② "My laptop hotspot is on — why does my phone get nothing?" ③ "Why don\'t my phone games work on school Wi-Fi?"', 'do2')}
<ul>
<li>The <b>five checkpoints</b> of a school network, each switched on in the lab and measured</li>
<li>The error each one produces — so you can name it from the symptom</li>
<li>How a network notices a hotspot (<b>TTL</b>) — and a filter bug we hit ourselves</li>
<li>The attacker's corner, and how developers still work on a blocked network</li>
</ul>` },

  { t: 'Five checkpoints on the way out', giua: true, body: `
${tram()}
${bang(['Checkpoint', 'Like…'], [
    ['DNS filter', '📒 a phone book with names crossed out'],
    ['SNI filter', '✉️ a postman reading the name on the envelope — the letter stays sealed'],
    ['IP / port / UDP', '🚪 a building that opens only doors 80, 443, 587, 993'],
    ['Tethering (TTL)', '🛂 a guard noticing one card brings in a group'],
  ], { fs: 19 })}` },

  { t: 'Baseline: nothing blocked yet', body: `
${term(ra('c142-truoc', 'dig +short', 6, { cut: 104 }), { title: 'nft-win (logged in) — names resolve, web, SSH :22, game and VPN over UDP all answer' })}
${box('', 'Keep this screen in mind: every later test repeats one of these lines with one school rule switched on.', 'lam')}` },

  { t: '① DNS filtering: the crossed-out phone book', body: `
${term(ra('c142-dns-gw', 'printf', 2, { gay: 90 }), { title: 'controller: two kinds of DNS block' })}
${term(ra('c142-dns', 'dig phim.test', 3), { title: 'student: NXDOMAIN ⇒ "site can\'t be reached"; a redirect ⇒ the school\'s block page' })}` },

  { t: 'DNS filters are only in the phone book', body: `
${term(ra('c142-dns', 'dig @198.18.0.53', 2), { title: 'ask another DNS, or give the IP yourself ⇒ the site opens' })}
${term(ra('c142-dns53-gw', 'iptables', 2) + '\n' + ra('c142-dns53', 'dig @198.18.0.53', 1), { title: 'so the school also drops DNS that does not go through its own server' })}
${box('', 'DNS over HTTPS (DoH) looks like normal HTTPS on 443 — a browser\'s "secure DNS" can make a DNS block disappear. Networks then block known DoH servers.', 'lam')}` },

  { t: '② SNI: the postman reads the envelope', body: `
${term(ra('c142-sni-gw', 'iptables', 1, { gay: 90 }), { title: 'controller: cut any packet to :443 containing "social.test"' })}
${term(ra('c142-sni', 'dig +short', 4), { title: 'student: SAME IP, two names — one passes, one is reset at once' })}` },

  { t: 'What the firewall reads inside HTTPS', body: `
${term(ra('c142-sni-doc', 'tshark', 2, { cut: 104 }), { title: 'controller capture: the site name in every ClientHello, and the rule\'s counter' })}
${two(box('Hidden by HTTPS', 'page content · URL path · cookies · passwords', 'xanh'), box('Visible to the network', 'the <b>site name</b> (SNI) · the IP · timing and size', 'do2'))}
${box('', '<b>ECH</b> (Encrypted Client Hello, RFC 9849) encrypts the name too — SNI-filtering networks often block ECH in response.', 'lam')}` },

  { t: '③ IP, port and UDP rules', body: `
${term(ra('c142-cong-gw', 'iptables', 3, { gay: 90 }), { title: 'controller: blacklist one IP · only TCP 80/443/587/993 · drop all UDP' })}
${term(ra('c142-cong', 'time nc', 5, { drop: /^(user|sys)\s|^$/ }), { title: 'student: timeout = DROP · 993 still answers SSH · UDP = silence' })}` },

  { t: 'Why phone games die (but the web works)', giua: true, body: `
${bang(['Reason', 'What you see'], [
    ['Game traffic is <b>UDP</b> (late data is useless)', 'match never starts; menus and shop still load'],
    ['Fixed game ports ≠ 80/443', 'connection to the game server times out'],
    ['Peer-to-peer needs a friendly NAT', '"NAT type: strict", cannot join friends'],
    ['QoS / bandwidth limits by category', 'connects, but lags and drops'],
    ['Category lists ("games", "social")', 'whole domains blocked via DNS/SNI/IP'],
  ], { fs: 19 })}
${box('', 'The same TCP-only rule kills <b>QUIC/HTTP-3</b> (browsers fall back to TCP, lesson 5.3) and <b>WireGuard</b> VPNs.', 'lam')}` },

  { t: '④ The hotspot: same MAC, same IP, different TTL', body: `
${hotspot()}
${term(ra('c142-ttl-gw', 'tshark', 1, { gay: 80 }), { title: 'controller capture: eth.src · ip.src · TTL · TCP timestamp' })}` },

  { t: 'The TTL rule — and the bug we hit', body: `
${term(ra('c142-ttl-gw', 'iptables -t mangle', 2) + '\n' + ra('c142-ttl-sau-phone', 'curl', 1) + '\n' + ra('c142-ttl-sau-win', 'curl', 1), { title: 'TTL 63 dropped: the phone is dead (even DNS), the laptop untouched' })}
${box('⚠️ Our first rule blocked the WRONG machine', 'We put it in <code class="i">FORWARD</code>. By then the controller has already lowered TTL by one (64→63, 63→62), so it caught the <b>laptop</b>. Rules about the TTL a packet <b>arrived</b> with belong in <code class="i">PREROUTING</code>. Test a filter with both cases.', 'do2')}` },

  { t: 'Symptom → mechanism → command', giua: true, body: `
${bang(['You see', 'Mechanism', 'Check'], [
    ['NXDOMAIN, "can\'t be reached"', 'DNS filter', '<code class="i">dig name</code> vs <code class="i">dig @1.1.1.1 name</code>'],
    ['school logo "blocked" page', 'DNS redirect', '<code class="i">dig +short name</code> → school IP'],
    ['ERR_CONNECTION_RESET on HTTPS', 'SNI filter', 'another name on the same IP works'],
    ['hangs until timeout', 'IP / port DROP', '<code class="i">nc -vz -w 3 host port</code>'],
    ['games/voice fail, web fine, 4G OK', 'UDP blocked', '<code class="i">nc -u</code> gets nothing'],
    ['laptop OK, phone via hotspot not', 'TTL detection', 'same request from both'],
  ], { fs: 18 })}` },

  { t: 'Attacker\'s corner · working on a blocked network', body: `
${two(box('🕵️ The same tricks against you', 'A rogue Wi-Fi runs the DNS ⇒ your bank\'s name → a phishing site · SNI is a diary of every site you visit · "free VPN" apps can sell your traffic · fake "log in again" block pages', 'do2'), box('🧰 Developers still need git, SSH, deploy', 'SSH on <b>443/993</b> (lesson 14.3) · a VPN that can use <b>TCP 443</b> (14.4) — WireGuard/UDP dies on TCP-only Wi-Fi · DoH beats DNS-only filters · where a rule explicitly forbids it, follow the rule', 'xanh'))}
${steps(['Read the error → name the checkpoint', 'Prove it with one command from the table', 'Then choose: wait, 4G, an allowed port, or a VPN'])}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>"Blocked" is five different checkpoints: <b>MAC · DNS · SNI · IP/port/UDP · TTL</b> — each fails differently</li>
<li>DNS filters fall to another DNS ⇒ networks also drop outside DNS; DoH looks like HTTPS</li>
<li>HTTPS hides the content, <b>not the site name</b> (SNI) — ECH hides that too</li>
<li>TCP-only Wi-Fi kills games, WireGuard and QUIC while the web still works</li>
<li>A hotspot hides the phone's MAC, not its <b>TTL</b> (64 → 63) — and test filters with both cases</li>
</ul>
<p style="margin:0">${kw('NXDOMAIN', 'tên không tồn tại')} ${kw('SNI', 'tên trang trong ClientHello')} ${kw('ECH', 'mã hoá ClientHello')} ${kw('DROP / REJECT', 'im lặng / từ chối')} ${kw('tethering', 'chia sẻ mạng')} ${kw('TTL', 'số chặng còn lại')}</p>` },
]);
