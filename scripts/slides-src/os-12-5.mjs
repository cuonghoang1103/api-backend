/**
 * os-12-5 — khoá "Operating Systems for Developers", bài 12.5 "Container networking by hand" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c125-net.out.txt (chạy thật) qua grab().
 * Giảng: content/courses/operating-systems-for-developers/giang/os-12-5.mjs.
 */
import { lamDeck, sh, two, box, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-12-5', code: 'OS 12.5', title: 'Container networking by hand', sub: 'Operating Systems · Chapter 12 — Containers' };

const g = (pre, n = 1) => grab('c125-net', pre, n);
const cut = (t, w) => t.split('\n').map((l) => (l.length > w ? l.slice(0, w - 1) + '…' : l)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.42">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, hh, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${o.rx ?? 10}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"${o.d ? ' stroke-dasharray="8 6"' : ''}/>`;
const BL = '#336791', OR = '#e08a1e', GR = '#2f7d4f', RD = '#c0392b', PU = '#7b4fa0';
const svg = (w, hh, inner) => `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" font-family="Arial" style="display:block;margin:0 auto">` +
  `<defs><marker id="m5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${RD}"/></marker></defs>${inner}</svg>`;
const W = (x1, y1, x2, y2, c = '#555') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="4"/>`;

/* sơ đồ: docker0 ← veth → lab; br0 → c1, c2, box3 */
const topo = () => {
  let s = '';
  s += R(20, 20, 250, 90, '#eef3f8', BL) + T(145, 56, 'Docker VM', 20, { a: 'middle', w: 700, f: BL }) + T(145, 86, 'docker0 172.17.0.1', 17, { a: 'middle', m: 1 });
  s += R(330, 10, 760, 420, '#fbfbfb', OR, { d: 1 }) + T(1075, 418, 'our lab container (its own network namespace)', 17, { a: 'end', w: 700, f: OR });
  s += W(270, 65, 380, 65) + T(325, 52, 'veth', 15, { a: 'middle', f: '#555' });
  s += R(380, 50, 250, 50, '#fff', OR) + T(505, 82, 'eth0 172.17.0.4', 18, { a: 'middle', m: 1, w: 700 });
  s += R(600, 150, 300, 60, '#fdf6ee', OR, { sw: 3 }) + T(750, 178, 'br0  (a switch)', 19, { a: 'middle', w: 700, f: OR }) + T(750, 200, '10.12.0.1 = gateway', 15, { a: 'middle', m: 1 });
  s += T(505, 132, 'MASQUERADE ↑ out · DNAT :8080 ↓ in', 16, { a: 'middle', f: RD, w: 700 });
  [['c1', '10.12.0.2', 380, GR], ['c2  :8000', '10.12.0.3', 620, GR], ['box3 (12.4)', '10.12.0.4', 860, PU]].forEach(([n, ip, x, c]) => {
    s += W(750, 210, x + 95, 300, '#888') + T((750 + x + 95) / 2 + 10, 262, 'veth', 14, { f: '#777' });
    s += R(x, 300, 190, 100, c + '14', c) + T(x + 95, 336, n, 19, { a: 'middle', w: 700, f: c }) + T(x + 95, 366, 'eth0 ' + ip, 15, { a: 'middle', m: 1 });
  });
  s += `<line x1="505" y1="50" x2="505" y2="16" stroke="${RD}" stroke-width="3" marker-end="url(#m5)"/>` + T(520, 30, 'to the Internet (via the VM)', 16, { f: RD, w: 700 });
  return svg(1110, 440, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 12 — Containers', bai: '12.5',
}, [
  { cover: true, t: 'Container networking<br>by hand', sub: 'veth pairs, a bridge, NAT and a published port — Docker’s default network, rebuilt' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What a container’s <b>eth0</b> really is</li>
<li>A <b>bridge</b> and <b>veth</b> cables between two network namespaces</li>
<li>Reaching the Internet: <b>forwarding + MASQUERADE</b></li>
<li>Publishing a port is <b>DNAT</b> — and why it bypasses ufw</li>
<li>Wiring the 12.4 mini container in, and what a hop costs</li>
</ul>` },

  { t: 'The network we are going to build', giua: true, body: topo() },

  { t: 'The lab container’s eth0 is one end of a veth', giua: true, to: true, body: term(g('ip -br addr | grep -v NONE', 2), 20) +
    box('', 'The other end lives in the Docker VM (<code class="i">link-netnsid 0</code>), plugged into <b>docker0</b> = 172.17.0.1. A namespace, a cable, a switch, routing — that is all.', 'lam') },

  { t: 'Two namespaces, one bridge, two cables', giua: true, body: term(g('ip netns add c1', 3) + '\n' + g('ip -br link show master br0'), 16) },

  { t: 'Container to container: ping, HTTP, a learning switch', giua: true, body: term(g('ip netns exec c1 ip -br addr') + '\n' + g('ip netns exec c1 ping', 4), 15.5) +
    box('', 'The bridge <b>learned</b> which MAC sits behind which port (bridge fdb) and forwards frames only there.', 'lam') },

  { t: 'No way out — until forwarding + MASQUERADE', giua: true, body: term(g('ip netns exec c1 curl -sS -m 4', 2) + '\n' + g('iptables -t nat -A POSTROUTING', 3), 15.5) +
    box('', 'Without SNAT even the DNS server is unreachable (curl 28). The rule rewrites 10.12.0.x to the outgoing address; conntrack translates the replies back.', 'xanh') },

  { t: 'Publishing a port is destination NAT', giua: true, to: true, body: term(g('ME=$(hostname -i)', 4), 17) +
    box('', '<b>PREROUTING</b> for packets from other machines, <b>OUTPUT</b> for this host’s own processes. <code class="i" style="white-space:nowrap">-p 8080:8000</code> writes rules like these.', 'lam') },

  { t: 'Pitfall: published ports bypass ufw', giua: true, to: true, body: vsd(
    '<code class="i">-p 5432:5432</code> on a VPS with <code class="i">ufw deny 5432</code>: DNAT in PREROUTING forwards the packet before INPUT rules see it — the database answers the whole Internet.',
    'Bind internal services to <code class="i">127.0.0.1:5432:5432</code> or do not publish them; filter in <b>DOCKER-USER</b>; test from outside the server.') },

  { t: 'Wire the 12.4 mini container in — through its PID', giua: true, body: term(g('./mini-container.sh box3 sleep 300 &', 6), 13.5) +
    box('', 'Move one veth end into the network namespace of the box’s PID 1, configure it from inside, give it a resolv.conf — what every runtime does.', 'lam') },

  { t: 'When the namespace dies, its veth dies', giua: true, to: true, body: term(g('kill -KILL $P $SRV', 2), 15) +
    box('', '<b>veth-b3</b> vanished from the bridge on its own. Deleting c1, c2 and br0 leaves the lab as it was.', 'xanh') },

  { t: 'A veth + bridge hop costs microseconds', giua: true, to: true, body: term(g('ping -c 500', 2), 19) +
    box('', 'Minimum 1–2 µs on both paths; the averages are VM scheduling noise (a 54 ms outlier on lo). ~1000× less than a data-centre round trip — container networking is not where latency goes.', 'lam') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>A container’s eth0 = one end of a <b>veth</b>; the other end is on a <b>bridge</b></li>
<li>Same bridge → containers reach each other; the bridge learns MACs</li>
<li>Internet = <b>ip_forward + MASQUERADE</b>; published port = <b>DNAT</b></li>
<li>Runtimes wire containers through the netns of their <b>PID</b></li>
<li>Published ports <b>bypass ufw</b>: bind to 127.0.0.1, test from outside</li>
</ul>` },
]);
