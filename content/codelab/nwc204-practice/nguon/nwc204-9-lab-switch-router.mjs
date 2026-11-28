/** NWC204 · LAB chương 9 — Lab 2.1: mạng có switch và router; làm hỏng có chủ đích rồi dự đoán triệu chứng (bài 9.3). */
import { doiDau, KHOA, tinh, bang1, tn, js, mt, bi, S, code } from './_nw.mjs';

const TOPO = `PC-A 192.168.10.3/24  gw 192.168.10.1
  |
 S1  (SVI Vlan1 192.168.10.2/24, ip default-gateway 192.168.10.1)
  |
 R1  G0/0/0 192.168.10.1/24  ──  G0/0/1 to the Internet (8.8.8.8 reachable)`;

const E1 = tinh({
  tieuDe: 'Lab 2.1 A — Predict the symptom before you look', doKho: 'MEDIUM', phut: 15,
  moTa: mt(`Lesson 9.3 breaks the working lab one fault at a time. For each experiment, predict the result of the ping in the last columns (ok = replies come back; fails = no reply or an error).${code(TOPO)}`, `Bài 9.3 làm hỏng lab đang chạy, mỗi lần một lỗi. Với mỗi thí nghiệm, dự đoán kết quả của lệnh ping ở các cột cuối (ok = có phản hồi; fails = không phản hồi hoặc báo lỗi).${code(TOPO)}`),
  loai: 'table',
  bang: [bang1('b1', ['Six experiments, three pings each', 'Sáu thí nghiệm, mỗi thí nghiệm ba lệnh ping'], [{ ma: 'x', ten: 'Fault' }, { ma: 'g', ten: 'PC-A → R1', luaChon: ['ok', 'fails'] }, { ma: 's', ten: 'PC-A → S1', luaChon: ['ok', 'fails'] }, { ma: 'i', ten: 'PC-A → 8.8.8.8', luaChon: ['ok', 'fails'] }], [
    { o: { x: 'R1: interface g0/0/0 → shutdown' }, a: { g: 'fails', s: 'ok', i: 'fails' } },
    { o: { x: 'S1: no ip default-gateway 192.168.10.1' }, a: { g: 'ok', s: 'ok', i: 'ok' } },
    { o: { x: 'PC-A mask 255.255.0.0 instead of /24' }, a: { g: 'ok', s: 'ok', i: 'ok' } },
    { o: { x: 'PC-A gateway 192.168.11.1' }, a: { g: 'ok', s: 'ok', i: 'fails' } },
    { o: { x: 'S1: interface vlan 1 → shutdown' }, a: { g: 'ok', s: 'fails', i: 'ok' } },
    { o: { x: 'Everything correct, not saved, then reload of R1 and S1' }, a: { g: 'fails', s: 'fails', i: 'fails' } },
  ], ['(1) A shut interface contributes no routes and answers no ARP: the gateway and the Internet die, the switch is untouched. (2) The switch\'s own gateway only matters for traffic the switch itself originates off-subnet; PC-A never uses it — the fault hides in the lab. (3) 192.168.10.x AND 255.255.0.0 is still 192.168.0.0 for both ends, so these three destinations work; the wrong mask bites only for a genuinely different 192.168.x.y subnet. (4) The gateway is not local by PC-A\'s own mask, so no frame for 8.8.8.8 is ever built; local targets are unaffected. (5) The switch answers pings from its SVI. (6) running-config was RAM: both devices come back empty — no addresses at all.', '(1) Interface bị shut không góp tuyến nào và không trả lời ARP: gateway và Internet chết, switch không sao. (2) Gateway của chính switch chỉ dùng cho lưu lượng do switch tự phát ra ngoài subnet; PC-A không bao giờ dùng nó — lỗi trốn biệt trong lab. (3) 192.168.10.x AND 255.255.0.0 vẫn là 192.168.0.0 ở cả hai đầu, nên ba đích này vẫn chạy; mặt nạ sai chỉ cắn khi gặp một subnet 192.168.x.y thật sự khác. (4) Theo chính mặt nạ của PC-A, gateway không cục bộ, nên không frame nào tới 8.8.8.8 được dựng; đích cục bộ không ảnh hưởng. (5) Switch trả lời ping từ SVI của nó. (6) running-config nằm trong RAM: cả hai thiết bị bật lên trống trơn — không còn địa chỉ nào.'])],
  goiY: ['Ask for each ping: does the sender think the target is local, and who must answer?', 'An unsaved device after reload has no addresses at all.'],
  loiHayGap: ['Predicting that removing the switch\'s default gateway breaks PC-A\'s Internet access.', 'Predicting that the /16 mask breaks the ping to R1.'],
  thuatNgu: [tn('fault injection', 'cố ý gây lỗi'), tn('asymmetric failure', 'hỏng một chiều')], khaiNiem: ['Lab 2.1', 'prediction before verification'],
});

const E2 = js({
  ten: 'Lab 2.1 B — Write hostReach(host, target): what does the host do?', kho: 'MEDIUM', phut: 15,
  en: `<p>Before sending anything, a host decides with its <b>own</b> address and mask. Write <code>hostReach(host, target)</code> where <code>host = { ip, prefix, gateway }</code> (<code>gateway</code> may be <code>null</code>):</p>
<ul>
<li><code>"local"</code> — target AND mask equals host ip AND mask: ARP for the target itself.</li>
<li><code>"no-gateway"</code> — not local and there is no gateway.</li>
<li><code>"gateway-not-local"</code> — not local, and the gateway itself is not in the host's own network: to reach its gateway it would need a gateway, so no frame is ever built.</li>
<li><code>"via-gateway"</code> — otherwise: ARP for the gateway and hand the packet to it.</li>
</ul>`,
  vi: `<p>Trước khi gửi bất cứ thứ gì, máy trạm quyết định bằng địa chỉ và mặt nạ <b>của chính nó</b>. Viết <code>hostReach(host, target)</code> với <code>host = { ip, prefix, gateway }</code> (<code>gateway</code> có thể là <code>null</code>):</p>
<ul>
<li><code>"local"</code> — target AND mặt nạ bằng ip của máy AND mặt nạ: ARP thẳng cho đích.</li>
<li><code>"no-gateway"</code> — không cục bộ và không có gateway.</li>
<li><code>"gateway-not-local"</code> — không cục bộ, và chính gateway cũng không nằm trong mạng của máy: muốn tới gateway lại cần một gateway, nên không frame nào được dựng.</li>
<li><code>"via-gateway"</code> — các trường hợp còn lại: ARP cho gateway và giao gói cho nó.</li>
</ul>`,
  fn: 'hostReach', params: 'host, target', ref: S.hostReach,
  cases: [
    [{ ip: '10.10.5.40', prefix: 24, gateway: '10.10.6.1' }, '10.10.6.1'],
    [{ ip: '10.10.5.40', prefix: 24, gateway: '10.10.6.1' }, '10.10.5.1'],
    [{ ip: '192.168.10.3', prefix: 24, gateway: '192.168.10.1' }, '8.8.8.8'],
    [{ ip: '192.168.10.3', prefix: 16, gateway: '192.168.10.1' }, '192.168.20.9'],
    [{ ip: '192.168.10.3', prefix: 24, gateway: null }, '1.1.1.1'],
    [{ ip: '172.16.4.20', prefix: 22, gateway: '172.16.7.254' }, '172.16.8.1'],
    [{ ip: '172.16.4.20', prefix: 23, gateway: '172.16.7.254' }, '172.16.8.1'],
    [{ ip: '10.0.0.130', prefix: 25, gateway: '10.0.0.129' }, '10.0.0.5'],
    [{ ip: '10.0.0.130', prefix: 25, gateway: '10.0.0.1' }, '10.0.0.200'],
  ],
  goiY: ['Convert to 32-bit integers, build the mask from the prefix, compare (a & m) with (b & m).', 'Use >>> 0 after every bitwise operation to stay unsigned.'],
  loi: ['Using the target\'s mask or the gateway\'s mask — the decision is made with the sender\'s own mask.', 'Comparing octet strings, which only works for /8, /16 and /24.'],
  gt: ['Every IPv4 host runs this test before every packet. It explains both one-way failures of a wrong mask and the "gateway outside my subnet" failure that leaves the LAN working while everything else dies.', 'Mọi máy IPv4 chạy phép thử này trước mỗi gói. Nó giải thích cả kiểu hỏng một chiều của mặt nạ sai lẫn kiểu "gateway ngoài subnet" khiến LAN vẫn chạy còn mọi thứ khác chết.'],
  kn: ['AND test', 'default gateway'],
});

const LAB_OK = { 'PC-A': { ip: '192.168.10.3', prefix: 24, gw: '192.168.10.1' }, S1: { ip: '192.168.10.2', prefix: 24, gw: '192.168.10.1', up: true }, R1: { ip: '192.168.10.1', prefix: 24, up: true } };
const bien = (f) => { const n = JSON.parse(JSON.stringify(LAB_OK)); f(n); return n; };

const LAB = js({
  ten: 'Lab 9 — Write labPing(net, from, to): the whole Lab 2.1 in code', kho: 'HARD', phut: 45, diem: 60, dangBai: 'lab',
  en: `<p><b>Scenario.</b> You keep breaking Lab 2.1 and want a model that predicts every ping before you run it. One subnet, three devices, and R1 also reaches the Internet:</p>${code(TOPO)}
<p><code>net = { "PC-A": { ip, prefix, gw }, S1: { ip, prefix, gw, up }, R1: { ip, prefix, up } }</code> — <code>up: false</code> on S1 means its SVI is shut; on R1 it means G0/0/0 is shut; <code>gw</code> may be <code>null</code>. Write <code>labPing(net, from, to)</code> with <code>from</code> ∈ {<code>"PC-A"</code>, <code>"S1"</code>} and <code>to</code> ∈ {<code>"PC-A"</code>, <code>"S1"</code>, <code>"R1"</code>, <code>"INTERNET"</code>} (<code>INTERNET</code> is 8.8.8.8). Return the first reason that applies, in this order:</p>
<ol>
<li><code>"source-down"</code> — the sender is down (S1 with a shut SVI has no IP presence at all).</li>
<li><b>Forward path, decided by the sender with its own mask.</b> If the target is local: the device with that IP must exist and be up, else <code>"no-reply"</code> (ARP gets no answer). If not local: no gateway ⇒ <code>"no-gateway"</code>; gateway not local ⇒ <code>"gateway-not-local"</code>; the gateway must be R1 and R1 up, else <code>"no-reply"</code>; and for a target other than INTERNET, R1 must have it in its own subnet and it must be up, else <code>"no-reply"</code>.</li>
<li><b>Return path.</b> If <code>to</code> is R1 or INTERNET, the reply comes from R1, which delivers it only if the sender is in R1's subnet (by R1's mask) — else <code>"no-reply"</code>. If <code>to</code> is a host, it decides with ITS own mask: sender local ⇒ fine; otherwise it needs a gateway that is local to it, is R1, R1 up, and R1 must see the sender as local — else <code>"no-reply"</code>.</li>
<li>Otherwise <code>"ok"</code>.</li>
</ol>`,
  vi: `<p><b>Tình huống.</b> Bạn liên tục làm hỏng Lab 2.1 và muốn có một mô hình dự đoán mọi lệnh ping trước khi chạy. Một subnet, ba thiết bị, và R1 còn ra được Internet:</p>${code(TOPO)}
<p><code>net = { "PC-A": { ip, prefix, gw }, S1: { ip, prefix, gw, up }, R1: { ip, prefix, up } }</code> — <code>up: false</code> ở S1 nghĩa là SVI bị shut; ở R1 nghĩa là G0/0/0 bị shut; <code>gw</code> có thể là <code>null</code>. Viết <code>labPing(net, from, to)</code> với <code>from</code> ∈ {<code>"PC-A"</code>, <code>"S1"</code>} và <code>to</code> ∈ {<code>"PC-A"</code>, <code>"S1"</code>, <code>"R1"</code>, <code>"INTERNET"</code>} (<code>INTERNET</code> là 8.8.8.8). Trả về lý do ĐẦU TIÊN khớp, theo thứ tự:</p>
<ol>
<li><code>"source-down"</code> — máy gửi đang tắt (S1 có SVI bị shut thì không có hiện diện IP nào).</li>
<li><b>Chiều đi, do máy gửi quyết định bằng mặt nạ của chính nó.</b> Nếu đích cục bộ: thiết bị mang IP đó phải tồn tại và đang bật, nếu không ⇒ <code>"no-reply"</code> (ARP không ai trả lời). Nếu không cục bộ: không có gateway ⇒ <code>"no-gateway"</code>; gateway không cục bộ ⇒ <code>"gateway-not-local"</code>; gateway phải là R1 và R1 đang bật, nếu không ⇒ <code>"no-reply"</code>; và với đích khác INTERNET, R1 phải thấy đích nằm trong subnet của nó và đích đang bật, nếu không ⇒ <code>"no-reply"</code>.</li>
<li><b>Chiều về.</b> Nếu <code>to</code> là R1 hoặc INTERNET, phản hồi đi ra từ R1, và R1 chỉ giao được nếu máy gửi nằm trong subnet của R1 (theo mặt nạ của R1) — nếu không ⇒ <code>"no-reply"</code>. Nếu <code>to</code> là một máy, nó quyết định bằng mặt nạ CỦA NÓ: máy gửi cục bộ ⇒ được; nếu không thì nó cần một gateway cục bộ với nó, là R1, R1 đang bật, và R1 phải thấy máy gửi là cục bộ — nếu không ⇒ <code>"no-reply"</code>.</li>
<li>Còn lại ⇒ <code>"ok"</code>.</li>
</ol>`,
  yc: [bi('Return the value; do not print it.', 'Trả về giá trị, đừng in ra.'), bi('Do not modify net.', 'Không sửa net.')],
  fn: 'labPing', params: 'net, from, to', ref: S.labPing,
  cases: [
    [LAB_OK, 'PC-A', 'INTERNET'],
    [bien((n) => { n.R1.up = false; }), 'PC-A', 'R1'],
    [bien((n) => { n.R1.up = false; }), 'PC-A', 'S1'],
    [bien((n) => { n.S1.gw = null; }), 'S1', 'INTERNET'],
    [bien((n) => { n.S1.gw = null; }), 'S1', 'PC-A'],
    [bien((n) => { n['PC-A'].prefix = 16; }), 'PC-A', 'INTERNET'],
    [bien((n) => { n['PC-A'].gw = '192.168.11.1'; }), 'PC-A', 'INTERNET'],
    [bien((n) => { n['PC-A'].gw = '192.168.11.1'; }), 'PC-A', 'S1'],
    [bien((n) => { n.S1.up = false; }), 'PC-A', 'S1'],
    [bien((n) => { n.S1.up = false; }), 'S1', 'R1'],
    [bien((n) => { n['PC-A'].prefix = 25; n['PC-A'].ip = '192.168.10.130'; }), 'PC-A', 'S1'],
    [bien((n) => { n['PC-A'].prefix = 25; n['PC-A'].ip = '192.168.10.130'; n.S1.prefix = 25; }), 'S1', 'PC-A'],
    [bien((n) => { n['PC-A'].ip = '192.168.20.3'; n['PC-A'].gw = '192.168.20.1'; }), 'PC-A', 'R1'],
    [bien((n) => { n['PC-A'].gw = '192.168.10.2'; }), 'PC-A', 'INTERNET'],
  ],
  goiY: ['Write same(a, b, prefix) and byIp(ip) first; the rest is a chain of early returns in the stated order.', 'The forward decision uses the sender\'s mask; the return decision uses the replier\'s mask. That asymmetry is the whole point of experiment 3.', 'A gateway that is a switch (S1) cannot route: treat any gateway other than R1 as "no-reply".'],
  loi: ['Deciding the return path with the sender\'s mask.', 'Checking that R1 is up only for Internet targets, not for local-looking targets reached through it.', 'Returning "ok" for a shut SVI because the switch port is still up.'],
  gt: ['Every ping is two independent decisions — one per direction — each taken with the deciding host\'s own mask and gateway. Modelling it that way reproduces every experiment of Lesson 9.3, including the ones where the lab "works" while a real fault hides.', 'Mỗi lệnh ping là hai quyết định độc lập — mỗi chiều một quyết định — do máy đang quyết định tự lấy mặt nạ và gateway của mình. Mô hình hoá như vậy tái hiện được mọi thí nghiệm của bài 9.3, kể cả những cái lab "vẫn chạy" trong khi một lỗi thật đang ẩn.'],
  kn: ['Lab 2.1', 'forward and return path'],
});

export default doiDau({ slug: 'nwc204-9-lab-switch-router', ten: 'Lab 9 — Lab 2.1: build and break a switch-and-router network', khoa: KHOA, baiHoc: 'nwc204-9-3-lab-2-1-dung-mang-switch-router', de: [E1, E2, LAB] });
