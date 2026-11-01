/**
 * _nfd-dns.mjs — sơ đồ cây DNS của lab Chương 3 (dns.yml chồng lên internet.yml) dùng chung cho các deck nfd-03-*.
 *   dnsTree({ hl: ['laptop','resolver','root','tld','lf','cdn','pub'], path: true })
 * hl = các khối tô vàng; path = vẽ 4 bước của một lần tra lạnh (stub → resolver → root → TLD → LabFlow).
 */
import { svg, T, R, C, MK, A } from './_nfd-chung.mjs';

export function dnsTree(opts = {}) {
  const { hl = [], w = 1110, h = 340, path = false } = opts;
  const on = (k) => hl.includes(k);
  const box = (k, x, y, ww, hh, t1, t2, c, t3) => R(x, y, ww, hh, on(k) ? '#fff3c4' : c + '12', c, { rx: 10, sw: on(k) ? 3.5 : 2.2 }) +
    T(x + ww / 2, y + 25, t1, 18, { a: 'middle', w: 800, f: c }) + T(x + ww / 2, y + 47, t2, 14, { a: 'middle', m: 1 }) +
    (t3 ? T(x + ww / 2, y + 66, t3, 13, { a: 'middle', f: '#666' }) : '');
  const ln = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#aaa" stroke-width="2.5" stroke-dasharray="6 5"/>`;
  let s = '';
  // khung "authoritative" bên phải
  s += R(468, 4, 638, 332, '#f8f8f6', '#d9d4c7', { rx: 14, sw: 1.5, dash: true }) + T(482, 24, 'authoritative servers — each knows ONE level', 13, { w: 700, f: '#7a6a4a' });
  s += box('root', 640, 34, 290, 74, 'root  “.”', 'a.root-servers.test 192.0.2.10', C.red, 'knows who runs each TLD');
  s += box('tld', 640, 136, 290, 74, 'TLD  “test.”', 'ns1.nic.test 192.0.2.20', C.br, 'the registry: who runs each domain');
  s += box('lf', 486, 246, 300, 78, 'labflow.test', 'ns1 .53 · ns2 .54 (203.0.113.x)', C.tcp, 'LabFlow’s records — answers with aa');
  s += box('cdn', 808, 246, 284, 78, 'cdn.test', 'ns1.cdn.test 192.0.2.40', C.link, 'the CDN’s GeoDNS (3.4)');
  s += ln(785, 108, 785, 136) + ln(720, 210, 640, 246) + ln(850, 210, 950, 246);
  // bên trái: máy người dùng + resolver + DNS công cộng
  s += box('laptop', 10, 120, 170, 86, 'laptop', '192.168.50.10', C.ip, 'stub: getaddrinfo()');
  s += box('resolver', 230, 104, 210, 118, 'resolver (ISP)', '198.51.100.1', C.app, 'Unbound: walks the tree,');
  s += T(335, 206, 'caches, checks DNSSEC', 13, { a: 'middle', f: '#666' });
  s += box('pub', 214, 252, 242, 78, 'public DNS 198.19.1.1', 'pop1 HN · pop2 SG', C.app, 'anycast: one address, two cities');
  if (!path) {
    s += `<line x1="180" y1="163" x2="230" y2="163" stroke="#999" stroke-width="3"/>`;
    return svg(w, h, s);
  }
  const c = C.red, id = 'dnsp';
  const lab = (x, y, t, cc = c) => R(x - 6, y - 17, t.length * 8.4 + 12, 24, '#fff', cc, { rx: 12, sw: 1.6 }) + T(x, y, t, 14, { w: 800, f: cc });
  s += A(180, 150, 228, 150, id, c) + A(230, 178, 182, 178, 'dnspg', C.tcp);
  s += lab(14, 104, '① question (rd)') + lab(14, 232, '⑤ answer + cached', C.tcp);
  s += A(440, 120, 638, 74, id, c) + lab(470, 66, '② root: referral to TLD');
  s += A(440, 150, 638, 172, id, c) + lab(462, 136, '③ TLD: referral to LabFlow');
  s += A(440, 196, 560, 246, id, c) + lab(310, 240, '④ LabFlow: answer (aa)');
  return svg(w, h, s, MK(id, c) + MK('dnspg', C.tcp));
}
