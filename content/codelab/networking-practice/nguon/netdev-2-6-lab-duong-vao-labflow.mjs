/**
 * Networking for Developers · LAB chương 2 — "Đường vào LabFlow" (bài netdev-2-6-lab-duong-vao-labflow; output thật lab/out/lab2-*.out.txt,
 * kịch bản lab/code/ch02/lab2/). Một đề lớn "bản in" ghép cả chương: R1 kế hoạch địa chỉ, R2 bản đồ đường đi + chủ sở hữu/AS từng chặng,
 * R3+R4 máy chủ thấy gì và mở cổng được không, R5 sự cố A (tuyến tĩnh bị quên ⇒ vòng lặp), R6 sự cố B (AS64511 cướp /25 ⇒ prefix-list).
 */
import { doiDau, KHOA, bi, tn, jsBai, nguon, goi, sauLenh } from './_net.mjs';

const tr = (ds) => ds.map((d) => d.replace(/\s+$/, ''));
const S = (tep, lenh) => tr(sauLenh(tep, lenh));
const J = (ds) => ds.join('\n');
const R1 = S('lab2-r1', 'python3 ../chia.py');
const R2_V4 = S('lab2-r2-laptop', 'traceroute -n -q 1 -N 1 203.0.113.10');
const R2_V6 = S('lab2-r2-laptop', 'traceroute -6');
const R2_MOB = S('lab2-r2-mobile', 'traceroute');
const R3 = [['laptop (IPv4)', S('lab2-r3-laptop', 'curl -4')[0]], ['laptop (IPv6)', S('lab2-r3-laptop', 'curl -6')[0]], ['phone', S('lab2-r3-phone', 'curl -4')[0]], ['4G phone', S('lab2-r3-mobile', 'curl -4')[0]]];
const R4_CMD = 'iptables -t nat -A PREROUTING -i wan0 -p tcp --dport 8443 -j DNAT --to-destination 192.168.50.10:8080';
if (!sauLenh('lab2-r4-homegw', 'iptables -t nat -S PREROUTING')[0].includes('--dport 8443 -j DNAT --to-destination 192.168.50.10:8080')) throw new Error('lab2-r4: luật DNAT thật không như mong đợi');
const R4_SRV = S('lab2-r4-server', 'curl -s -m 3 http://198.51.100.2:8443/');
const R4_4G = S('lab2-r4-server', 'nc -vz -w 3 198.51.100.200 8443');
const R5_L10 = S('lab2-r5-laptop', 'traceroute -n -q 1 -N 1 -m 7 203.0.113.10');
const R5_L100 = S('lab2-r5-laptop', 'traceroute -n -q 1 -N 1 -m 5 203.0.113.100');
const R5_CURL = S('lab2-r5-laptop', 'curl -sS -m 3');
const R5_DC = S('lab2-r5-dc', 'ip route | grep 203.0.113').filter((d) => d.trim());
const R6_TAB = S('lab2-r6-isp', "vtysh -c 'show ip bgp'");
const R6_LAP = [...S('lab2-r6-laptop', 'curl -4 -sS -m 3'), ...S('lab2-r6-laptop', 'dig +time=2'), ...S('lab2-r6-laptop', 'traceroute')];
const HOMEGW = S('c22-routers', 'ip route').filter((d) => d.trim());
const ISP = S('c22-isp', 'ip route').filter((d) => d.trim());
const ISP_CUOP = S('c25-isp-cuop', 'ip route | grep 203.0.113').filter((d) => d.trim());
if (R1.length !== 8 || R5_DC.length !== 2 || R6_TAB.length !== 5 || ISP.length !== 5) throw new Error('lab2: output thật không đúng số dòng');

/* ─────────────── lời giải tham chiếu ─────────────── */
function num4(ip) { return ip.split('.').reduce(function (n, b) { return n * 256 + Number(b); }, 0); }
function dotted(n) { return [Math.floor(n / 16777216) % 256, Math.floor(n / 65536) % 256, Math.floor(n / 256) % 256, n % 256].join('.'); }
function inside4(ip, prefix) {
  var p = prefix.split('/'), size = Math.pow(2, 32 - Number(p[1]));
  return Math.floor(num4(ip.split('/')[0]) / size) === Math.floor(num4(p[0]) / size) && Number(ip.split('/')[1] || 32) >= Number(p[1]);
}
// Bits of an IPv4 (32) or IPv6 (128) address as a string of 0/1 — one prefix test for both families.
function bits(ip) {
  if (ip.indexOf(':') < 0) return ('00000000000000000000000000000000' + num4(ip).toString(2)).slice(-32);
  var h = ip.toLowerCase().split('::'), a = h[0] ? h[0].split(':') : [], b = h.length > 1 && h[1] ? h[1].split(':') : [];
  var g = a.concat(new Array(8 - a.length - b.length).fill('0'), b);
  return g.map(function (x) { return ('0000000000000000' + parseInt(x, 16).toString(2)).slice(-16); }).join('');
}

/* R1 */
function plan(block, needs) {
  var bp = block.split('/'), total = Math.pow(2, 32 - Number(bp[1])), next = num4(bp[0]), end = next + total;
  var list = needs.slice().sort(function (a, b) { return b.hosts - a.hosts; });   // largest first, stable
  var subnets = [], gaps = [];
  for (var i = 0; i < list.length; i++) {
    var k = 0;
    while (Math.pow(2, k) < list[i].hosts + 2) k++;
    var size = Math.pow(2, k), start = Math.ceil(next / size) * size;
    if (start + size > end) return { ok: false, name: list[i].name, prefix: 32 - k, size: size };
    if (start > next) gaps.push({ from: dotted(next), to: dotted(start - 1), size: start - next });
    subnets.push({ name: list[i].name, hosts: list[i].hosts, subnet: dotted(start) + '/' + (32 - k), first: dotted(start + 1), last: dotted(start + size - 2), broadcast: dotted(start + size - 1), usable: size - 2 });
    next = start + size;
  }
  return { ok: true, subnets: subnets, gaps: gaps, used: next - num4(bp[0]) - gaps.reduce(function (s, g) { return s + g.size; }, 0), total: total, nextFree: next < end ? dotted(next) : null };
}
function whereIs(planResult, ip) {
  var hit = (planResult.subnets || []).filter(function (s) { return inside4(ip, s.subnet); })[0];
  return hit ? hit.name : null;
}

/* R2 */
function pathMap(traceText, owners) {
  var out = [];
  String(traceText).split('\n').forEach(function (line) {
    var m = /^\s*(\d+)\s+(.*)$/.exec(line);
    if (!m) return;
    var ip = m[2].trim().split(/\s+/).filter(function (w) { return /^\d+\.\d+\.\d+\.\d+$/.test(w) || (w.indexOf(':') >= 0 && /^[0-9a-fA-F:]+$/.test(w)); })[0] || null;
    var best = null;
    if (ip) {
      owners.forEach(function (o) {
        var p = o.prefix.split('/'), len = Number(p[1]);
        if ((p[0].indexOf(':') >= 0) !== (ip.indexOf(':') >= 0)) return;     // the same family only
        if (bits(ip).slice(0, len) !== bits(p[0]).slice(0, len)) return;
        if (!best || len > best.len) best = { len: len, o: o };              // longest prefix wins, as in routing
      });
    }
    out.push({ hop: Number(m[1]), ip: ip, owner: best ? best.o.owner : null, as: best ? best.o.as : null });
  });
  return out;
}

/* R3 + R4 */
function natReport(deviceIp, seenIp, forward) {
  var dev = String(deviceIp).toLowerCase(), seen = String(seenIp).toLowerCase().replace(/^::ffff:(?=\d+\.\d+\.\d+\.\d+$)/, '');
  if (dev === seen) return { nat: 'none', inbound: 'direct', rule: null };      // IPv6: the server sees the device itself
  if (dev.indexOf(':') < 0 && inside4(dev, '100.64.0.0/10')) return { nat: 'cgnat', inbound: 'impossible', rule: null };
  if (dev.indexOf(':') < 0 && ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'].some(function (p) { return inside4(dev, p); })) {
    return { nat: 'home', inbound: 'port-forward', rule: forward ? 'iptables -t nat -A PREROUTING -i wan0 -p tcp --dport ' + forward.publicPort + ' -j DNAT --to-destination ' + deviceIp + ':' + forward.devicePort : null };
  }
  return { nat: 'unknown', inbound: 'unknown', rule: null };
}

/* R5 */
function lookup(table, dst) {
  var best = null;
  table.forEach(function (line) {
    var t = line.trim().split(/\s+/);
    var type = t[0] === 'blackhole' || t[0] === 'unreachable' ? t.shift() : null;
    if (!t[0]) return;
    var pfx = t[0] === 'default' ? '0.0.0.0/0' : (t[0].indexOf('/') < 0 ? t[0] + '/32' : t[0]);
    if (!inside4(dst, pfx)) return;
    var len = Number(pfx.split('/')[1]);
    function val(k) { var i = t.indexOf(k); return i > 0 && i + 1 < t.length ? t[i + 1] : null; }
    var metric = val('metric') === null ? 0 : Number(val('metric'));
    if (!best || len > best.len || (len === best.len && metric < best.metric)) best = { len: len, metric: metric, route: pfx, via: val('via'), dev: val('dev'), type: type };
  });
  return best;
}
function simulate(routers, start, dst) {
  var path = [start], at = start;
  for (;;) {
    var r = lookup(routers[at].routes, dst);
    if (!r || r.type === 'unreachable') return { result: 'unreachable', path: path };
    if (r.type === 'blackhole') return { result: 'blackhole', path: path };
    if (!r.via) return { result: 'delivered', path: path };                  // connected route: on this router's LAN
    var next = Object.keys(routers).filter(function (n) { return routers[n].addrs.indexOf(r.via) >= 0; })[0];
    if (!next) return { result: 'left', path: path };                         // a next hop outside the routers we know
    var seen = path.indexOf(next) >= 0;
    path.push(next);
    if (seen) return { result: 'loop', path: path };                          // same destination, same router again ⇒ it will circle
    at = next;
  }
}

/* R6 */
function parseBgpTable(text) {
  var localAs = null, pathCol = -1, routes = [], last = null, lastNet = null;
  function fill(r, line) {
    if (line.length <= pathCol) return false;
    var w = line.slice(pathCol).trim().split(/\s+/);
    r.origin = w[w.length - 1]; r.path = w.slice(0, -1).map(Number);
    r.originAs = r.path.length ? r.path[r.path.length - 1] : localAs;
    return true;
  }
  String(text).split('\n').forEach(function (line) {
    var m = /local AS (\d+)/.exec(line); if (m) localAs = Number(m[1]);
    if (/^\s*Network\s+Next Hop/.test(line)) { pathCol = line.indexOf('Path'); return; }
    if (pathCol < 0 || !line.trim()) return;
    if (/^ ?[sdhuirSR*=>]+\s/.test(line) && line.indexOf('*') >= 0 && line.indexOf('*') < 4) {
      var w = line.slice(0, pathCol).trim().split(/\s+/), hasNet = w[1] && w[1].indexOf('/') >= 0;
      var r = { status: w[0], best: w[0].indexOf('>') >= 0, network: hasNet ? w[1] : lastNet, nextHop: hasNet ? w[2] : w[1], path: [], originAs: null, origin: null };
      lastNet = r.network; routes.push(r);
      last = fill(r, line) ? null : r;
      return;
    }
    if (last && /^\s/.test(line)) { fill(last, line); last = null; }
  });
  return routes;
}
function rpkiValidate(prefix, originAs, roas) {
  var len = Number(prefix.split('/')[1]);
  var covering = roas.filter(function (roa) { return inside4(prefix, roa.prefix); });
  if (!covering.length) return 'not_found';
  function maxLen(roa) { return roa.maxLength == null ? Number(roa.prefix.split('/')[1]) : roa.maxLength; }
  if (covering.some(function (roa) { return roa.asn !== 0 && roa.asn === originAs && len <= maxLen(roa); })) return 'valid';
  if (covering.some(function (roa) { return roa.asn !== 0 && roa.asn === originAs; })) return 'invalid_length';
  return 'invalid_asn';
}
function incidentB(tableText, mine, roas) {
  var routes = parseBgpTable(tableText).filter(function (r) { return r.network.indexOf(':') < 0; });
  var hijacks = [];
  routes.forEach(function (r) {
    mine.forEach(function (m) {
      if (inside4(r.network, m.prefix) && r.originAs !== m.asn) hijacks.push({ network: r.network, originAs: r.originAs, nextHop: r.nextHop, rpki: rpkiValidate(r.network, r.originAs, roas) });
    });
  });
  // For every neighbour that sent a hijack: the prefixes it may keep sending (what the prefix-list must permit)
  var allow = {};
  hijacks.forEach(function (h) {
    allow[h.nextHop] = routes.filter(function (r) {
      return r.nextHop === h.nextHop && !hijacks.some(function (x) { return x.network === r.network && x.nextHop === r.nextHop; });
    }).map(function (r) { return r.network; });
  });
  return { hijacks: hijacks, allow: allow };
}

/* ─────────────── dữ liệu ─────────────── */
const NEEDS = [{ name: 'wifi', hosts: 120 }, { name: 'servers', hosts: 50 }, { name: 'cameras', hosts: 25 }, { name: 'printers', hosts: 6 }, { name: 'vpn', hosts: 60 }];
// Bảng chủ sở hữu DỰNG từ sơ đồ lab (moi-truong/internet.yml): mạng của nhà, nhà mạng AS64500, LAN của điểm trao đổi, trung tâm dữ liệu AS64510.
const OWNERS = [
  { prefix: '192.168.50.0/24', owner: 'home', as: null }, { prefix: '2001:db8:a:50::/64', owner: 'home', as: null },
  { prefix: '198.51.100.0/24', owner: 'ISP', as: 64500 }, { prefix: '100.64.0.0/24', owner: 'ISP', as: 64500 }, { prefix: '2001:db8:a::/48', owner: 'ISP', as: 64500 },
  { prefix: '192.0.2.0/24', owner: 'IX', as: null }, { prefix: '2001:db8:ffff::/64', owner: 'IX', as: null },
  { prefix: '192.0.2.1/32', owner: 'ISP', as: 64500 }, { prefix: '2001:db8:ffff::1/128', owner: 'ISP', as: 64500 },
  { prefix: '192.0.2.3/32', owner: 'DC', as: 64510 }, { prefix: '2001:db8:ffff::3/128', owner: 'DC', as: 64510 },
  { prefix: '203.0.113.0/24', owner: 'DC', as: 64510 }, { prefix: '2001:db8:d::/48', owner: 'DC', as: 64510 },
];
const RT = {
  homegw: { addrs: ['192.168.50.1', '198.51.100.2'], routes: HOMEGW },
  isp: { addrs: ['192.0.2.1', '100.64.0.1', '198.51.100.1', '198.51.100.200'], routes: ISP },
};
const RT_A = { ...RT, dc: { addrs: ['192.0.2.3', '203.0.113.1'], routes: R5_DC } };
const RT_OK = { ...RT, dc: { addrs: ['192.0.2.3', '203.0.113.1'], routes: R5_DC.filter((d) => d.includes('proto kernel')) } };
const RT_B = { homegw: RT.homegw, isp: { ...RT.isp, routes: ISP_CUOP }, dc: RT_OK.dc, rogue: { addrs: ['192.0.2.66'], routes: ['blackhole 203.0.113.0/25'] } };
const MINE = [{ prefix: '203.0.113.0/24', asn: 64510 }];
const ROAS = [{ prefix: '203.0.113.0/24', asn: 64510, maxLength: 24 }];   // DỰNG: ROA LabFlow sẽ công bố (bài 2.5)
const TAB_B = J(R6_TAB);
const TAB_FULL = J(S('c25-isp-cuop', "vtysh -c 'show ip bgp'"));
const TAB_OK = J(S('lab2-r2-isp', "vtysh -c 'show ip bgp'"));
// DỰNG: rogue gửi thêm một dải riêng thứ hai (198.18.1.0/24) cùng lúc cướp — prefix-list phải cho cả hai.
const TAB_2 = TAB_B + '\n *>  198.18.1.0/24    192.0.2.66               0             0 64511 i';
const ma = (x) => JSON.stringify(x);

const LAB = jsBai({
  ten: 'Lab 2 — The road into LabFlow', kho: 'HARD', phut: 150, diem: 60, dangBai: 'lab',
  en: '<p>See the brief.</p>', vi: '<p>Xem đề.</p>',
  banIn: {
    tieuDe: bi('Lab 2 — The road into LabFlow', 'Lab 2 — Đường vào LabFlow'),
    phu: bi('Chapter 2 lab · course project part 2 · JavaScript, graded in the browser · 10 marks', 'Lab chương 2 · phần 2 của dự án khoá · JavaScript, chấm trong trình duyệt · 10 điểm'),
    moTa: bi(`<p><b>Situation.</b> LabFlow is opening an office and its customers reach the platform from homes, from 4G phones and over IPv6. During the first week two incidents hit production. Your lead wants a small toolkit that turns the lab's raw output into answers: an address plan, a map of who owns each hop, what the server really sees, and a diagnosis of both incidents. Everything below was run in the "Internet in a box" (lab/out/lab2-*.out.txt); your functions must reach the same conclusions from that output — and still be right on the hidden cases.</p>
<p>R1, the plan the tool printed:</p><pre>${J(R1)}</pre>
<p>R2, the paths (laptop IPv4, laptop IPv6, 4G phone):</p><pre>${J([...R2_V4, '', ...R2_V6, '', ...R2_MOB])}</pre>
<p>R3, what LabFlow's server printed for each device:</p><pre>${R3.map(([a, b]) => `${a.padEnd(15)} ${b}`).join('\n')}</pre>
<p>R4, port forwarding on the home router and two tries from the Internet:</p><pre>${J([`$ ${R4_CMD}`, '$ curl -s -m 3 http://198.51.100.2:8443/', ...R4_SRV, '$ nc -vz -w 3 198.51.100.200 8443', ...R4_4G])}</pre>
<p>R5, incident A (after <code>su-co-a.sh</code> on dc):</p><pre>${J([...R5_CURL, ...R5_L10, ...R5_L100, '', '# dc', ...R5_DC])}</pre>
<p>R6, incident B (after <code>su-co-b.sh</code> on rogue):</p><pre>${J([...R6_LAP, '', '# isp', ...R6_TAB])}</pre>`,
    `<p><b>Tình huống.</b> LabFlow mở văn phòng và khách hàng vào nền tảng từ nhà riêng, từ điện thoại 4G và qua IPv6. Trong tuần đầu có hai sự cố trên môi trường thật. Trưởng nhóm cần một bộ công cụ nhỏ biến output thô của lab thành câu trả lời: kế hoạch địa chỉ, bản đồ ai sở hữu từng chặng, máy chủ thật sự thấy gì, và chẩn đoán cả hai sự cố. Mọi thứ dưới đây đã chạy trong "Internet trong một hộp" (lab/out/lab2-*.out.txt); các hàm của bạn phải ra cùng kết luận từ output đó — và vẫn đúng ở các ca ẩn.</p>
<p>R1, kế hoạch công cụ đã in:</p><pre>${J(R1)}</pre>
<p>R2, các đường đi (laptop IPv4, laptop IPv6, điện thoại 4G):</p><pre>${J([...R2_V4, '', ...R2_V6, '', ...R2_MOB])}</pre>
<p>R3, máy chủ LabFlow in gì cho từng thiết bị:</p><pre>${R3.map(([a, b]) => `${a.padEnd(15)} ${b}`).join('\n')}</pre>
<p>R4, mở cổng trên router nhà và hai lần thử từ Internet:</p><pre>${J([`$ ${R4_CMD}`, '$ curl -s -m 3 http://198.51.100.2:8443/', ...R4_SRV, '$ nc -vz -w 3 198.51.100.200 8443', ...R4_4G])}</pre>
<p>R5, sự cố A (sau <code>su-co-a.sh</code> trên dc):</p><pre>${J([...R5_CURL, ...R5_L10, ...R5_L100, '', '# dc', ...R5_DC])}</pre>
<p>R6, sự cố B (sau <code>su-co-b.sh</code> trên rogue):</p><pre>${J([...R6_LAP, '', '# isp', ...R6_TAB])}</pre>`),
    chucNangChinh: [
      bi('<code>plan(block, needs)</code> + <code>whereIs(planResult, ip)</code> — the office address plan (R1).', '<code>plan(block, needs)</code> + <code>whereIs(planResult, ip)</code> — kế hoạch địa chỉ văn phòng (R1).'),
      bi('<code>pathMap(traceText, owners)</code> — owner and AS of every hop of a traceroute (R2).', '<code>pathMap(traceText, owners)</code> — chủ sở hữu và AS của từng chặng traceroute (R2).'),
      bi('<code>natReport(deviceIp, seenIp, forward)</code> — which NAT, and can the device be reached from outside (R3, R4).', '<code>natReport(deviceIp, seenIp, forward)</code> — NAT nào, và thiết bị có gọi vào được không (R3, R4).'),
      bi('<code>simulate(routers, start, dst)</code> — follow a packet router by router with the real tables (R5).', '<code>simulate(routers, start, dst)</code> — theo một gói qua từng router bằng bảng thật (R5).'),
      bi('<code>incidentB(tableText, mine, roas)</code> — find the hijack, its RPKI status and the prefix-list fix (R6).', '<code>incidentB(tableText, mine, roas)</code> — tìm vụ cướp tuyến, trạng thái RPKI và cách sửa bằng prefix-list (R6).'),
    ],
    yeuCauChung: [
      bi('One file, <code>answer.js</code>, all functions at top level (the grader calls each one directly). Helpers are allowed — reuse your code from exercises 2.1–2.5.', 'Một tệp <code>answer.js</code>, mọi hàm ở cấp cao nhất (máy chấm gọi trực tiếp từng hàm). Được viết hàm phụ — dùng lại code của bạn từ các bài 2.1–2.5.'),
      bi('Plain JavaScript, no libraries. Return values, do not print. Do not modify the arguments.', 'JavaScript thuần, không thư viện. Trả về giá trị, đừng in. Không sửa các đối số.'),
      bi('Each function is graded on its own inputs, so a mistake in one does not cost the others.', 'Mỗi hàm được chấm bằng đầu vào riêng, nên lỗi ở hàm này không làm mất điểm hàm khác.'),
    ],
    tieuDeCay: bi('Files', 'Tệp'),
    cayThuMuc: 'answer.js        plan · whereIs · pathMap · natReport · simulate · incidentB',
    moHinh: [
      { ten: 'Inputs', truong: [
        ['needs', '[{ name, hosts }]', bi('R1: wifi 120, servers 50, cameras 25, printers 6, vpn 60 in block 10.30.0.0/23', 'R1: wifi 120, servers 50, cameras 25, printers 6, vpn 60 trong khối 10.30.0.0/23')],
        ['owners', '[{ prefix, owner, as }]', bi('IPv4 and IPv6 prefixes; built for this lab from moi-truong/internet.yml (table in feature 2)', 'prefix IPv4 và IPv6; dựng cho lab này từ moi-truong/internet.yml (bảng ở chức năng 2)')],
        ['routers', '{ name: { addrs, routes } }', bi('addrs = the router\'s own IPv4 addresses; routes = its ip route lines, as printed (also "blackhole PREFIX")', 'addrs = các địa chỉ IPv4 của chính router; routes = các dòng ip route của nó, đúng như in ra (cả "blackhole PREFIX")')],
        ['mine / roas', '[{ prefix, asn }] / [{ prefix, asn, maxLength }]', bi('LabFlow: 203.0.113.0/24, AS64510; its ROA (constructed — LabFlow would publish it): max length /24', 'LabFlow: 203.0.113.0/24, AS64510; ROA của nó (dựng — LabFlow sẽ công bố): độ dài tối đa /24')],
      ] },
      { ten: 'Outputs', truong: [
        ['plan', 'object', bi('exactly the result of vlsm() in exercise 2.1 #7: { ok, subnets, gaps, used, total, nextFree } or { ok: false, name, prefix, size }', 'đúng kết quả của vlsm() ở bài 2.1 #7: { ok, subnets, gaps, used, total, nextFree } hoặc { ok: false, name, prefix, size }')],
        ['pathMap', '[{ hop, ip, owner, as }]', bi('one element per hop line; a hop of stars ⇒ ip, owner, as all null', 'mỗi dòng hop một phần tử; hop toàn dấu sao ⇒ ip, owner, as đều null')],
        ['natReport', '{ nat, inbound, rule }', bi('nat "none" | "home" | "cgnat" | "unknown"; inbound "direct" | "port-forward" | "impossible" | "unknown"; rule = the iptables command or null', 'nat "none" | "home" | "cgnat" | "unknown"; inbound "direct" | "port-forward" | "impossible" | "unknown"; rule = lệnh iptables hoặc null')],
        ['simulate', '{ result, path }', bi('result "delivered" | "loop" | "blackhole" | "unreachable" | "left"; path = router names in order', 'result "delivered" | "loop" | "blackhole" | "unreachable" | "left"; path = tên router theo thứ tự')],
        ['incidentB', '{ hijacks, allow }', bi('hijacks = [{ network, originAs, nextHop, rpki }]; allow = { nextHop: [prefixes to permit] }', 'hijacks = [{ network, originAs, nextHop, rpki }]; allow = { nextHop: [các prefix được cho phép] }')],
      ] },
    ],
    duLieuMau: `# owners (feature 2)\n${OWNERS.map((o) => `${o.prefix.padEnd(22)} ${o.owner.padEnd(5)} ${o.as === null ? '-' : `AS${o.as}`}`).join('\n')}\n\n# routers (feature 4) — real tables: homegw (c22-routers), isp (c22-isp), dc during incident A (lab2-r5-dc, printed with grep 203.0.113)\nhomegw  addrs 192.168.50.1 198.51.100.2\n${HOMEGW.map((d) => `  ${d}`).join('\n')}\nisp     addrs 192.0.2.1 100.64.0.1 198.51.100.1 198.51.100.200\n${ISP.map((d) => `  ${d}`).join('\n')}\ndc      addrs 192.0.2.3 203.0.113.1\n${R5_DC.map((d) => `  ${d}`).join('\n')}`,
    chucNang: [
      { ten: bi('plan() and whereIs() — R1', 'plan() và whereIs() — R1'), diem: 1.5,
        moTa: bi('The office plan, with the rules of chia.py (exercise 2.1 #7: largest first, smallest block that holds hosts + 2, aligned).', 'Kế hoạch văn phòng, theo luật của chia.py (bài 2.1 #7: lớn trước, khối nhỏ nhất chứa đủ số máy + 2, đúng căn lề).'),
        yeuCau: [
          bi('<code>plan(block, needs)</code> returns the same object as vlsm() without <code>asGiven</code>.', '<code>plan(block, needs)</code> trả cùng object với vlsm() khi không có <code>asGiven</code>.'),
          bi('<code>whereIs(planResult, ip)</code> = the <code>name</code> of the subnet that contains <code>ip</code>, or <code>null</code> (outside every subnet, or the plan failed).', '<code>whereIs(planResult, ip)</code> = <code>name</code> của subnet chứa <code>ip</code>, hoặc <code>null</code> (ngoài mọi subnet, hoặc kế hoạch không vừa).'),
        ],
        viDu: 'plan("10.30.0.0/23", needs).nextFree             ⇒ "10.30.1.40"\nwhereIs(plan("10.30.0.0/23", needs), "10.30.0.200") ⇒ "servers"   (cidr.py: network 10.30.0.192/26)' },
      { ten: bi('pathMap() — R2', 'pathMap() — R2'), diem: 2,
        moTa: bi('Turn a traceroute into a map of owners: each hop\'s address is matched against <code>owners</code> by <b>longest prefix match</b> (IPv4 and IPv6) — exactly how a router chooses a route.', 'Biến một traceroute thành bản đồ chủ sở hữu: địa chỉ của mỗi hop được so với <code>owners</code> bằng <b>khớp tiền tố dài nhất</b> (IPv4 và IPv6) — đúng cách router chọn tuyến.'),
        yeuCau: [
          bi('One element per hop line, in order: <code>{ hop, ip, owner, as }</code>. The hop address is the first address on the line; stars ⇒ <code>ip: null</code>.', 'Mỗi dòng hop một phần tử, theo thứ tự: <code>{ hop, ip, owner, as }</code>. Địa chỉ hop là địa chỉ đầu tiên trên dòng; dấu sao ⇒ <code>ip: null</code>.'),
          bi('192.0.2.3 is inside the IX LAN 192.0.2.0/24 but the /32 entry says it is the DC\'s router — the longer entry wins. An address no entry matches ⇒ owner and as <code>null</code>.', '192.0.2.3 nằm trong LAN của điểm trao đổi 192.0.2.0/24 nhưng mục /32 nói nó là router của DC — mục dài hơn thắng. Địa chỉ không mục nào khớp ⇒ owner và as là <code>null</code>.'),
        ],
        viDu: 'pathMap(laptopV4, owners).map(h => h.owner)  ⇒ ["home", "ISP", "DC", "DC"]\npathMap(laptopV6, owners)[1]                 ⇒ { hop: 2, ip: "2001:db8:a:1::1", owner: "ISP", as: 64500 }' },
      { ten: bi('natReport() — R3 and R4', 'natReport() — R3 và R4'), diem: 1.5,
        moTa: bi('Given the device\'s own address and the address the server printed, say which NAT translated it and whether the device can be reached from outside.', 'Cho địa chỉ của chính thiết bị và địa chỉ máy chủ in ra, cho biết NAT nào đã dịch và có gọi vào thiết bị từ bên ngoài được không.'),
        yeuCau: [
          bi('Normalise <code>seenIp</code> first: a dual-stack server may print <code>::ffff:198.51.100.2</code>. Compare without case.', 'Chuẩn hoá <code>seenIp</code> trước: máy chủ hai họ có thể in <code>::ffff:198.51.100.2</code>. So không phân biệt hoa thường.'),
          bi('Same address ⇒ <code>{ nat: "none", inbound: "direct" }</code> (IPv6: only a firewall decides). Device in 100.64.0.0/10 ⇒ <code>"cgnat"</code>, <code>"impossible"</code>. Device in an RFC 1918 range ⇒ <code>"home"</code>, <code>"port-forward"</code>. Anything else ⇒ <code>"unknown"</code>, <code>"unknown"</code>.', 'Cùng địa chỉ ⇒ <code>{ nat: "none", inbound: "direct" }</code> (IPv6: chỉ tường lửa quyết định). Thiết bị trong 100.64.0.0/10 ⇒ <code>"cgnat"</code>, <code>"impossible"</code>. Thiết bị trong dải RFC 1918 ⇒ <code>"home"</code>, <code>"port-forward"</code>. Còn lại ⇒ <code>"unknown"</code>, <code>"unknown"</code>.'),
          bi('<code>rule</code>: only for <code>"home"</code> with <code>forward = { publicPort, devicePort }</code> — the exact command of R4: <code>iptables -t nat -A PREROUTING -i wan0 -p tcp --dport P -j DNAT --to-destination DEVICE:D</code>. Otherwise <code>null</code>.', '<code>rule</code>: chỉ với <code>"home"</code> khi có <code>forward = { publicPort, devicePort }</code> — đúng lệnh của R4: <code>iptables -t nat -A PREROUTING -i wan0 -p tcp --dport P -j DNAT --to-destination THIẾT_BỊ:D</code>. Còn lại <code>null</code>.'),
        ],
        viDu: `natReport("100.64.0.10", "198.51.100.200")  ⇒ { nat: "cgnat", inbound: "impossible", rule: null }\nnatReport("192.168.50.10", "198.51.100.2", { publicPort: 8443, devicePort: 8080 }).rule\n⇒ "${R4_CMD}"` },
      { ten: bi('simulate() — R5, incident A', 'simulate() — R5, sự cố A'), diem: 2.5,
        moTa: bi('Follow a packet with the real routing tables: at each router do a longest-prefix lookup, hand the packet to the router that owns the next-hop address, and stop when the answer is clear.', 'Theo một gói bằng bảng định tuyến thật: ở mỗi router tra tiền tố dài nhất, trao gói cho router sở hữu địa chỉ chặng kế, và dừng khi câu trả lời đã rõ.'),
        yeuCau: [
          bi('Lookup rules of exercise 2.2 #5 (a prefix without "/" is /32; longest wins, then the lower metric). A line <code>blackhole PREFIX</code> is a route that drops packets.', 'Luật tra của bài 2.2 #5 (prefix không có "/" là /32; dài nhất thắng, rồi metric nhỏ hơn). Dòng <code>blackhole PREFIX</code> là tuyến vứt gói.'),
          bi('Stop with: <code>"unreachable"</code> (no line matches), <code>"blackhole"</code>, <code>"delivered"</code> (a connected line, no via), <code>"left"</code> (no router in <code>routers</code> owns the via address), or <code>"loop"</code> (the next router was already visited — add it to the path, then stop).', 'Dừng với: <code>"unreachable"</code> (không dòng nào khớp), <code>"blackhole"</code>, <code>"delivered"</code> (dòng nối trực tiếp, không via), <code>"left"</code> (không router nào trong <code>routers</code> có địa chỉ via), hoặc <code>"loop"</code> (router kế tiếp đã đi qua — thêm nó vào path rồi dừng).'),
          bi('"delivered" only means "handed to the right LAN": 203.0.113.100 is delivered to dc0, where nobody has it — hence the real <code>!H</code>.', '"delivered" chỉ nghĩa là "đã giao tới đúng LAN": 203.0.113.100 được giao ra dc0, nơi không ai có địa chỉ đó — vì thế mới có <code>!H</code> thật.'),
        ],
        viDu: 'simulate(routersA, "homegw", "203.0.113.10")  ⇒ { result: "loop", path: ["homegw", "isp", "dc", "isp"] }\nsimulate(routersA, "homegw", "203.0.113.100") ⇒ { result: "delivered", path: ["homegw", "isp", "dc"] }' },
      { ten: bi('incidentB() — R6, the hijack', 'incidentB() — R6, vụ cướp tuyến'), diem: 2.5,
        moTa: bi('Read the ISP\'s <code>show ip bgp</code> (with or without the legend, with or without the "local AS" line), find every route that steals LabFlow\'s space, give its RPKI status, and list what the guilty neighbour may still send — the content of the prefix-list.', 'Đọc <code>show ip bgp</code> của isp (có hay không có chú giải, có hay không có dòng "local AS"), tìm mọi tuyến chiếm vùng địa chỉ của LabFlow, cho trạng thái RPKI của nó, và liệt kê những gì hàng xóm có lỗi vẫn được gửi — nội dung của prefix-list.'),
        yeuCau: [
          bi('Parse with the rules of exercise 2.5 #5 (the Path column starts under "Path"). IPv4 routes only.', 'Đọc theo luật của bài 2.5 #5 (cột Path bắt đầu dưới chữ "Path"). Chỉ tuyến IPv4.'),
          bi('<code>hijacks</code>: routes equal to or inside one of <code>mine</code> with another origin AS, in table order, each <code>{ network, originAs, nextHop, rpki }</code> where <code>rpki</code> follows exercise 2.5 #6.', '<code>hijacks</code>: các tuyến bằng hoặc nằm trong một prefix của <code>mine</code> mà AS gốc khác, theo thứ tự bảng, mỗi tuyến <code>{ network, originAs, nextHop, rpki }</code> với <code>rpki</code> theo bài 2.5 #6.'),
          bi('<code>allow</code>: for each next hop that sent a hijack, the other networks it sent (table order). For the real table that is <code>{ "192.0.2.66": ["198.18.0.0/24"] }</code> — the line <code>ip prefix-list FROM-ROGUE seq 10 permit 198.18.0.0/24</code> of the real fix.', '<code>allow</code>: với mỗi next hop đã gửi tuyến cướp, các network khác nó gửi (theo thứ tự bảng). Với bảng thật đó là <code>{ "192.0.2.66": ["198.18.0.0/24"] }</code> — chính dòng <code>ip prefix-list FROM-ROGUE seq 10 permit 198.18.0.0/24</code> của cách sửa thật.'),
        ],
        viDu: 'incidentB(ispTable, mine, roas)\n⇒ { hijacks: [{ network: "203.0.113.0/25", originAs: 64511, nextHop: "192.0.2.66", rpki: "invalid_asn" }],\n    allow: { "192.0.2.66": ["198.18.0.0/24"] } }' },
    ],
    truDiem: [
      bi('Comparing only the third number of addresses: /25, /26 and /32 lines then win or lose at random.', 'Chỉ so số thứ ba của địa chỉ: các dòng /25, /26 và /32 khi đó thắng thua ngẫu nhiên.'),
      bi('Calling the !H of 203.0.113.100 a loop, or calling incident A "the server is down".', 'Gọi !H của 203.0.113.100 là vòng lặp, hoặc gọi sự cố A là "máy chủ sập".'),
      bi('Reading the BGP path by splitting the whole line on spaces (the blank Metric shifts every number).', 'Đọc path BGP bằng cách tách cả dòng theo dấu cách (Metric trống làm lệch mọi số).'),
      bi('Saying "open a port" for the 4G phone: the translation happens in the ISP\'s CGNAT.', 'Bảo "mở cổng" cho điện thoại 4G: phép dịch xảy ra trong CGNAT của nhà mạng.'),
    ],
    nopBai: bi('Press Submit. Every feature is graded by its own checks (visible ones on Run, hidden ones on Submit). Then write the incident note for your lead: two sentences per incident, quoting the line of the routing table (A) and of the BGP table (B) that proves the cause, and the fix you applied.', 'Bấm Nộp. Mỗi chức năng được chấm bằng các kiểm riêng (kiểm hiện khi Chạy thử, kiểm ẩn khi Nộp). Sau đó viết ghi chú sự cố cho trưởng nhóm: mỗi sự cố hai câu, trích dòng trong bảng định tuyến (A) và trong bảng BGP (B) chứng minh nguyên nhân, cùng cách sửa bạn đã làm.'),
  },
  goiY: [
    ['Hint 1 (after 15 minutes): copy cidr/vlsm, lookup, parseBgpTable and rpkiValidate from your earlier exercises — four of the five features are compositions of them.', 'Gợi ý 1 (sau 15 phút): chép cidr/vlsm, lookup, parseBgpTable và rpkiValidate từ các bài trước — bốn trong năm chức năng là ghép các hàm đó.'],
    ['Hint 2 (after 40 minutes): pathMap needs one prefix test for both families. Turn any address into a string of bits (32 or 128 characters) and compare the first len characters.', 'Gợi ý 2 (sau 40 phút): pathMap cần một phép thử prefix cho cả hai họ. Đổi mọi địa chỉ thành chuỗi bit (32 hoặc 128 ký tự) rồi so len ký tự đầu.'],
    ['Hint 3 (after 60 minutes): in simulate, keep the list of routers visited; the destination never changes, so meeting a router twice can only end in a loop.', 'Gợi ý 3 (sau 60 phút): trong simulate, giữ danh sách router đã đi qua; đích không đổi, nên gặp một router hai lần chỉ có thể kết thúc bằng vòng lặp.'],
  ],
  loi: [
    ['Matching 192.0.2.3 to the IX instead of the DC: the first matching owner is not the most specific one.', 'Gán 192.0.2.3 cho điểm trao đổi thay vì DC: chủ sở hữu khớp đầu tiên không phải cái cụ thể nhất.'],
    ['Comparing "::ffff:198.51.100.2" with "198.51.100.2" as text and reporting the wrong NAT.', 'So "::ffff:198.51.100.2" với "198.51.100.2" như chuỗi và báo sai loại NAT.'],
    ['Stopping simulate at the first router whose route has a via outside the map, instead of reporting "left".', 'Dừng simulate ở router đầu tiên có via nằm ngoài bản đồ mà không báo "left".'],
  ],
  gt: ['The chapter in one toolkit. R1 is VLSM arithmetic, and the address checked in the brief is placed by the same AND that cidr.py printed (10.30.0.200 ⇒ 10.30.0.192/26, servers). R2 applies longest prefix match to ownership, which is why the DC\'s router address inside the shared IX LAN is attributed to AS64510. R3/R4 follow from where the translation happens: the home router (you can add the DNAT rule of R4), the ISP\'s CGNAT (you cannot — the real nc to 198.51.100.200:8443 was refused), or nowhere (IPv6, the server sees 2001:db8:a:50::10). R5 replays incident A from the real tables: the forgotten 203.0.113.0/26 via 192.0.2.1 is longer than the connected /24, so .0–.63 — the server .10 and the name server .53 — bounce between dc and isp, while .100 falls outside the /26 and is delivered to a LAN where nobody has it (!H). R6 reads the real BGP table: the /25 from AS64511 is inside LabFlow\'s /24, RPKI would say invalid_asn, and the neighbour 192.0.2.66 may keep only 198.18.0.0/24 — exactly the prefix-list of the real fix.', 'Cả chương trong một bộ công cụ. R1 là số học VLSM, và địa chỉ được kiểm trong đề được xếp chỗ bằng đúng phép AND cidr.py đã in (10.30.0.200 ⇒ 10.30.0.192/26, servers). R2 áp khớp tiền tố dài nhất cho quyền sở hữu, vì thế địa chỉ router của DC nằm trong LAN dùng chung của điểm trao đổi được gán cho AS64510. R3/R4 suy ra từ nơi phép dịch xảy ra: router nhà (bạn thêm được luật DNAT của R4), CGNAT của nhà mạng (không được — lệnh nc thật tới 198.51.100.200:8443 bị từ chối), hoặc không ở đâu (IPv6, máy chủ thấy 2001:db8:a:50::10). R5 phát lại sự cố A từ bảng thật: 203.0.113.0/26 via 192.0.2.1 bị quên dài hơn /24 nối trực tiếp, nên .0–.63 — máy chủ .10 và máy chủ tên .53 — dội qua lại giữa dc và isp, còn .100 nằm ngoài /26 và được giao tới một LAN không ai có địa chỉ đó (!H). R6 đọc bảng BGP thật: /25 từ AS64511 nằm trong /24 của LabFlow, RPKI sẽ nói invalid_asn, và hàng xóm 192.0.2.66 chỉ được giữ 198.18.0.0/24 — đúng prefix-list của cách sửa thật.'],
  kn: ['address planning', 'routing', 'NAT', 'IPv6', 'BGP', 'incident diagnosis'],
  tns: [tn('incident note', 'ghi chú sự cố', 'Vài câu: triệu chứng, nguyên nhân có bằng chứng, cách sửa.'), tn('longest prefix match', 'khớp tiền tố dài nhất'), tn('CGNAT', 'NAT của nhà mạng'), tn('prefix-list', 'danh sách prefix được nhận'), tn('blackhole route', 'tuyến hố đen')],
  dau: `/**
 * Lab 2 — The road into LabFlow. Six functions, graded separately (see the brief).
 * Helpers are welcome: paste your cidr/vlsm, lookup, parseBgpTable, rpkiValidate from exercises 2.1–2.5.
 */
function plan(block, needs) {
  // ⇒ like vlsm() of exercise 2.1 #7
  return { ok: false };
}

function whereIs(planResult, ip) {
  // ⇒ the name of the subnet that contains ip, or null
  return null;
}

function pathMap(traceText, owners) {
  // ⇒ [{ hop, ip, owner, as }]
  return [];
}

function natReport(deviceIp, seenIp, forward) {
  // ⇒ { nat, inbound, rule }
  return { nat: 'unknown', inbound: 'unknown', rule: null };
}

function simulate(routers, start, dst) {
  // ⇒ { result, path }
  return { result: 'delivered', path: [start] };
}

function incidentB(tableText, mine, roas) {
  // ⇒ { hijacks, allow }
  return { hijacks: [], allow: {} };
}
`,
  giai: '// Reference solution\n' + nguon(num4, dotted, inside4, bits, plan, whereIs, pathMap, natReport, lookup, simulate, parseBgpTable, rpkiValidate, incidentB),
  cases: [
    // f1
    { goi: goi('plan', '10.30.0.0/23', NEEDS), nhom: 'f1', moTa: ['plan(10.30.0.0/23, the five needs) — the real R1 plan', 'plan(10.30.0.0/23, năm nhu cầu) — kế hoạch R1 thật'] },
    { goi: `whereIs(plan("10.30.0.0/23", ${ma(NEEDS)}), "10.30.0.200")`, nhom: 'f1', moTa: ['whereIs(…, 10.30.0.200) — the address cidr.py checked', 'whereIs(…, 10.30.0.200) — địa chỉ cidr.py đã kiểm'] },
    { goi: `[${['10.30.1.33', '10.30.1.40', '10.30.0.127', '10.30.2.1'].map((ip) => `whereIs(plan("10.30.0.0/23", ${ma(NEEDS)}), "${ip}")`).join(', ')}]`, nhom: 'f1', an: true },
    { goi: goi('plan', '10.30.0.0/24', NEEDS), nhom: 'f1', an: true, moTa: ['Hidden: the same needs in a /24 do not fit', 'Ẩn: cùng nhu cầu trong một /24 thì không vừa'] },
    { goi: `whereIs(plan("10.30.0.0/24", ${ma(NEEDS)}), "10.30.0.5")`, nhom: 'f1', an: true },
    // f2
    { goi: goi('pathMap', J(R2_V4), OWNERS), nhom: 'f2', moTa: ['pathMap(laptop IPv4 trace) — real R2', 'pathMap(traceroute IPv4 của laptop) — R2 thật'] },
    { goi: goi('pathMap', J(R2_V6), OWNERS), nhom: 'f2', moTa: ['pathMap(laptop IPv6 trace) — real R2', 'pathMap(traceroute IPv6 của laptop) — R2 thật'] },
    { goi: goi('pathMap', J(R2_MOB), OWNERS), nhom: 'f2', an: true },
    { goi: goi('pathMap', J(R5_L10), OWNERS), nhom: 'f2', an: true },
    { goi: goi('pathMap', J(S('c25-laptop-cuop', 'traceroute')), OWNERS), nhom: 'f2', an: true },
    { goi: goi('pathMap', J(S('c22-docker-desktop', 'traceroute')), OWNERS), nhom: 'f2', an: true, moTa: ['Hidden: Docker Desktop to 1.1.1.1 (no owner known)', 'Ẩn: Docker Desktop tới 1.1.1.1 (không biết chủ sở hữu)'] },
    // f3
    { goi: goi('natReport', '192.168.50.10', '198.51.100.2'), nhom: 'f3', moTa: ['laptop over IPv4 — real R3', 'laptop qua IPv4 — R3 thật'] },
    { goi: goi('natReport', '100.64.0.10', '198.51.100.200'), nhom: 'f3', moTa: ['4G phone — real R3', 'điện thoại 4G — R3 thật'] },
    { goi: goi('natReport', '192.168.50.10', '198.51.100.2', { publicPort: 8443, devicePort: 8080 }), nhom: 'f3', moTa: ['laptop, forward 8443 → 8080 — the real R4 rule', 'laptop, mở cổng 8443 → 8080 — luật R4 thật'] },
    { goi: goi('natReport', '2001:db8:a:50::10', '2001:db8:a:50::10'), nhom: 'f3', an: true },
    { goi: goi('natReport', '192.168.50.11', '::ffff:198.51.100.2'), nhom: 'f3', an: true },
    { goi: goi('natReport', '100.64.0.10', '198.51.100.200', { publicPort: 8443, devicePort: 8080 }), nhom: 'f3', an: true },
    { goi: goi('natReport', '2001:DB8:A:50::10', '2001:db8:a:50::10'), nhom: 'f3', an: true },
    { goi: goi('natReport', '10.30.0.193', '198.51.100.7', { publicPort: 2222, devicePort: 22 }), nhom: 'f3', an: true },
    { goi: goi('natReport', '203.0.113.10', '198.51.100.2'), nhom: 'f3', an: true },
    // f4
    { goi: goi('simulate', RT_A, 'homegw', '203.0.113.10'), nhom: 'f4', moTa: ['Incident A: homegw → 203.0.113.10 (real tables)', 'Sự cố A: homegw → 203.0.113.10 (bảng thật)'] },
    { goi: goi('simulate', RT_A, 'homegw', '203.0.113.100'), nhom: 'f4', moTa: ['Incident A: homegw → 203.0.113.100', 'Sự cố A: homegw → 203.0.113.100'] },
    { goi: goi('simulate', RT_A, 'homegw', '203.0.113.53'), nhom: 'f4', an: true, moTa: ['Hidden: the name server .53 during incident A', 'Ẩn: máy chủ tên .53 trong sự cố A'] },
    { goi: goi('simulate', RT_OK, 'homegw', '203.0.113.10'), nhom: 'f4', an: true, moTa: ['Hidden: after ip route del on dc', 'Ẩn: sau ip route del trên dc'] },
    { goi: goi('simulate', RT_B, 'homegw', '203.0.113.10'), nhom: 'f4', an: true, moTa: ['Hidden: incident B as routing (rogue blackhole)', 'Ẩn: sự cố B nhìn từ định tuyến (hố đen của rogue)'] },
    { goi: goi('simulate', RT_B, 'homegw', '203.0.113.200'), nhom: 'f4', an: true },
    { goi: goi('simulate', RT_A, 'homegw', '8.8.8.8'), nhom: 'f4', an: true },
    { goi: goi('simulate', RT, 'homegw', '203.0.113.10'), nhom: 'f4', an: true, moTa: ['Hidden: dc not in the map ⇒ left', 'Ẩn: dc không có trong bản đồ ⇒ left'] },
    { goi: goi('simulate', RT_A, 'isp', '100.64.0.10'), nhom: 'f4', an: true },
    // f5
    { goi: goi('incidentB', TAB_B, MINE, ROAS), nhom: 'f5', moTa: ['incidentB(the real R6 table)', 'incidentB(bảng R6 thật)'] },
    { goi: goi('incidentB', TAB_OK, MINE, ROAS), nhom: 'f5', an: true, moTa: ['Hidden: the healthy table of R2', 'Ẩn: bảng lành của R2'] },
    { goi: goi('incidentB', TAB_FULL, MINE, ROAS), nhom: 'f5', an: true, moTa: ['Hidden: the full table with its legend (c25-isp-cuop)', 'Ẩn: bảng đầy đủ có chú giải (c25-isp-cuop)'] },
    { goi: goi('incidentB', TAB_2, MINE, ROAS), nhom: 'f5', an: true, moTa: ['Hidden: the rogue also sends a second range of its own (constructed line)', 'Ẩn: rogue còn gửi một dải riêng thứ hai (dòng dựng)'] },
    { goi: goi('incidentB', TAB_B, MINE, []), nhom: 'f5', an: true, moTa: ['Hidden: no ROA published ⇒ not_found', 'Ẩn: chưa công bố ROA ⇒ not_found'] },
  ],
  viDu: [{ input: 'simulate(routersA, "homegw", "203.0.113.10")   // incident A, real tables|||simulate(routersA, "homegw", "203.0.113.10")   // sự cố A, bảng thật', output: JSON.stringify({ result: 'loop', path: ['homegw', 'isp', 'dc', 'isp'] }), explanation: 'dc sends .10 back to the ISP because 203.0.113.0/26 via 192.0.2.1 is longer than its connected /24.|||dc gửi .10 về isp vì 203.0.113.0/26 via 192.0.2.1 dài hơn /24 nối trực tiếp của nó.' }],
});

export default doiDau({ slug: 'netdev-2-6-lab-duong-vao-labflow', ten: 'Lab 2 — The road into LabFlow', khoa: KHOA, baiHoc: 'netdev-2-6-lab-duong-vao-labflow', de: [LAB] });
