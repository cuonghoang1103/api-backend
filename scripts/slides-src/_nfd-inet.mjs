/**
 * _nfd-inet.mjs — sơ đồ "Internet trong một hộp" (lab Chương 2, compose internet.yml) dùng chung cho các deck nfd-02-*.
 *   inetTopo({ hl: ['laptop','homegw','isp','ix','dc','server'], path: true, note: '…' })
 * hl = các khối tô vàng; path = vẽ mũi tên đường đi laptop → server.
 */
import { svg, T, R, C, MK } from './_nfd-chung.mjs';

export function inetTopo(opts = {}) {
  const { hl = [], w = 1110, h = 330, path = false, v6 = false } = opts;
  const on = (k) => hl.includes(k);
  const box = (k, x, y, ww, hh, t1, t2, c, t3) => R(x, y, ww, hh, on(k) ? '#fff3c4' : c + '12', c, { rx: 10, sw: on(k) ? 3.5 : 2.2 }) +
    T(x + ww / 2, y + 25, t1, 18, { a: 'middle', w: 800, f: c }) + T(x + ww / 2, y + 46, t2, 14, { a: 'middle', m: 1 }) + (t3 ? T(x + ww / 2, y + 64, t3, 12, { a: 'middle', m: 1, f: '#777' }) : '');
  const ln = (x1, y1, x2, y2, c = '#999') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="3"/>`;
  let s = '';
  // vùng
  s += R(4, 6, 300, 228, '#f6f9fc', '#c8d6e5', { rx: 14, sw: 1.5, dash: true }) + T(16, 26, v6 ? 'HOME 192.168.50.0/24 · 2001:db8:a:50::/64' : 'HOME 192.168.50.0/24', 13, { w: 700, f: C.ip });
  s += R(318, 6, 210, 318, '#fbf6f0', '#e3cdb4', { rx: 14, sw: 1.5, dash: true }) + T(330, 26, 'ISP · AS64500', 13, { w: 700, f: C.br });
  s += R(542, 6, 170, 318, '#f5f1fd', '#d5c8f0', { rx: 14, sw: 1.5, dash: true }) + T(554, 26, 'IX 192.0.2.0/24', 13, { w: 700, f: C.link });
  s += R(726, 6, 380, 228, '#f2f8f3', '#bfdcc6', { rx: 14, sw: 1.5, dash: true }) + T(738, 26, v6 ? 'DC · AS64510 · 203.0.113.0/24 · 2001:db8:d::/64' : 'DC · AS64510 · 203.0.113.0/24', 13, { w: 700, f: C.tcp });
  // máy
  s += box('laptop', 18, 42, 124, 70, 'laptop', '.10', C.ip);
  s += box('phone', 18, 140, 124, 70, 'phone', '.11', C.ip);
  s += box('homegw', 168, 86, 124, 82, 'homegw', '.1 | wan .2', C.br, 'NAT');
  s += box('isp', 352, 86, 150, 82, 'isp', '198.51.100.1', C.br, 'ix0 192.0.2.1');
  s += box('mobile', 352, 236, 150, 70, 'mobile (4G)', '100.64.0.10', C.ip);
  s += R(566, 104, 122, 46, on('ix') ? '#fff3c4' : '#f3eefe', C.link, { rx: 8, sw: on('ix') ? 3.5 : 2 }) + T(627, 133, 'IX switch', 15, { a: 'middle', w: 700, f: C.link });
  s += box('rogue', 566, 236, 122, 70, 'rogue', 'AS64511 .66', C.red);
  s += box('dc', 744, 86, 120, 82, 'dc', '192.0.2.3', C.tcp, 'dc0 .1');
  s += box('server', 904, 42, 190, 70, 'server (LabFlow)', '203.0.113.10', C.app);
  s += box('ns', 904, 140, 190, 70, 'ns (DNS)', '203.0.113.53', C.tcp);
  // dây
  s += ln(142, 77, 168, 112) + ln(142, 175, 168, 142) + ln(292, 127, 352, 127) + ln(427, 168, 427, 236) + ln(502, 127, 566, 127) + ln(627, 150, 627, 236) + ln(688, 127, 744, 127) + ln(864, 112, 904, 77) + ln(864, 142, 904, 175);
  if (path) {
    const c = C.red, id = 'ippath';
    s += `<path d="M142,64 L904,64" fill="none" stroke="${c}" stroke-width="4" stroke-dasharray="10 6" marker-end="url(#${id})"/>`;
    s += R(392, 48, 286, 30, '#fff', c, { rx: 15, sw: 2 }) + T(535, 69, 'laptop → server: 4 routers', 16, { a: 'middle', w: 800, f: c });
    return svg(w, h, s, MK(id, c));
  }
  return svg(w, h, s);
}
