/** NWC204 · LAB chương 10 — Hoạch định địa chỉ cho một công ty (VLSM + cổng mặc định + phần còn trống). */
import { doiDau, KHOA, bi, js } from './_nw.mjs';

function planNetwork(base, prefix, depts) {
  function toInt(s) { var p = s.split('.'); return ((+p[0]) * 16777216 + (+p[1]) * 65536 + (+p[2]) * 256 + (+p[3])) >>> 0; }
  function toStr(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }
  var m0 = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0, cur = (toInt(base) & m0) >>> 0, end = cur + Math.pow(2, 32 - prefix);
  var list = depts.map(function (d, i) {
    var need = Math.ceil(d.hosts * (1 + (d.growthPct || 0) / 100)) + 1;
    return { name: d.name, need: need, i: i };
  });
  list.sort(function (a, b) { return b.need - a.need || a.i - b.i; });
  var subnets = [], used = 0, block = 0;
  for (var k = 0; k < list.length; k++) {
    var p = 30; while (p > 0 && Math.pow(2, 32 - p) - 2 < list[k].need) p--;
    var size = Math.pow(2, 32 - p), mask = (0xFFFFFFFF << (32 - p)) >>> 0;
    if (cur + size > end) return { error: 'does not fit', failedAt: list[k].name };
    subnets.push({ name: list[k].name, need: list[k].need, prefix: p, network: toStr(cur), mask: toStr(mask), gateway: toStr(cur + 1), broadcast: toStr(cur + size - 1), usable: size - 2 });
    used += list[k].need; block += size; cur += size;
  }
  return { subnets: subnets, free: { next: toStr(cur), addresses: end - cur }, efficiency: block === 0 ? 0 : Math.round(used / block * 10000) / 100 };
}

const D1 = [{ name: 'Sales', hosts: 55, growthPct: 10 }, { name: 'Engineering', hosts: 100, growthPct: 20 }, { name: 'Guests', hosts: 20, growthPct: 0 }, { name: 'Servers', hosts: 10, growthPct: 50 }, { name: 'WAN', hosts: 1, growthPct: 0 }];
const D2 = [{ name: 'A', hosts: 200, growthPct: 0 }, { name: 'B', hosts: 60, growthPct: 0 }];
const D3 = [{ name: 'HQ', hosts: 400, growthPct: 25 }, { name: 'Lab', hosts: 120, growthPct: 0 }, { name: 'Wifi', hosts: 250, growthPct: 0 }, { name: 'Link', hosts: 1, growthPct: 0 }];

const LAB = js({
  ten: 'Lab 10 — Address planner for a small company', kho: 'HARD', phut: 60, diem: 60, dangBai: 'lab',
  en: `<p><b>Scenario.</b> You are the network engineer of a start-up. The ISP gave you one block and each department has a head-count. Write <code>planNetwork(base, prefix, depts)</code> that produces the addressing plan:</p>
<ol>
<li>Each department <code>{ name, hosts, growthPct }</code> needs <code>need = ceil(hosts × (1 + growthPct / 100)) + 1</code> addresses (the “+1” is the default gateway on the router).</li>
<li>Allocate subnets from the start of <code>base/prefix</code>, <b>largest need first</b> (ties keep the input order), each with the longest prefix (never longer than /30) that offers at least <code>need</code> usable hosts.</li>
<li>Return <code>{ subnets, free, efficiency }</code>. Each subnet: <code>{ name, need, prefix, network, mask, gateway, broadcast, usable }</code> where <code>gateway</code> is the first usable address. <code>free = { next, addresses }</code> is the first unallocated address and how many addresses remain. <code>efficiency</code> = Σ need ÷ Σ allocated block sizes × 100, rounded to 2 decimals.</li>
<li>If a subnet does not fit, return <code>{ error: "does not fit", failedAt: name }</code>.</li>
</ol>
<p>Sample: 5 departments in 192.168.0.0/24 — Sales 55 +10%, Engineering 100 +20%, Guests 20, Servers 10 +50%, WAN 1.</p>`,
  vi: `<p><b>Tình huống.</b> Bạn là kỹ sư mạng của một start-up. ISP cấp một khối địa chỉ và mỗi phòng ban có số người. Viết <code>planNetwork(base, prefix, depts)</code> tạo kế hoạch địa chỉ:</p>
<ol>
<li>Mỗi phòng ban <code>{ name, hosts, growthPct }</code> cần <code>need = ceil(hosts × (1 + growthPct / 100)) + 1</code> địa chỉ (“+1” là default gateway trên router).</li>
<li>Cấp mạng con từ đầu <code>base/prefix</code>, <b>nhu cầu lớn nhất trước</b> (hoà giữ thứ tự đầu vào), mỗi mạng con dùng prefix dài nhất (không dài hơn /30) còn cho ít nhất <code>need</code> host dùng được.</li>
<li>Trả <code>{ subnets, free, efficiency }</code>. Mỗi mạng con: <code>{ name, need, prefix, network, mask, gateway, broadcast, usable }</code> với <code>gateway</code> là địa chỉ dùng được đầu tiên. <code>free = { next, addresses }</code> là địa chỉ chưa cấp đầu tiên và số địa chỉ còn lại. <code>efficiency</code> = Σ need ÷ Σ kích thước khối đã cấp × 100, làm tròn 2 chữ số.</li>
<li>Nếu một mạng con không vừa, trả <code>{ error: "does not fit", failedAt: name }</code>.</li>
</ol>
<p>Ví dụ: 5 phòng ban trong 192.168.0.0/24 — Sales 55 +10%, Engineering 100 +20%, Guests 20, Servers 10 +50%, WAN 1.</p>`,
  yc: [bi('Return the value; do not print it.', 'Trả về giá trị, đừng in ra.'), bi('Mask the base address down to its network first.', 'Hãy đưa địa chỉ base về địa chỉ mạng trước.')],
  fn: 'planNetwork', params: 'base, prefix, depts', ref: planNetwork,
  cases: [['192.168.0.0', 24, D1], ['192.168.0.0', 24, D2], ['10.20.0.0', 22, D3], ['10.20.0.0', 23, D3], ['192.168.5.77', 24, [{ name: 'only', hosts: 10, growthPct: 0 }]], ['172.16.0.0', 24, []], ['192.168.0.0', 24, [{ name: 'x', hosts: 10, growthPct: 0 }, { name: 'y', hosts: 10, growthPct: 0 }, { name: 'z', hosts: 40, growthPct: 0 }]]],
  goiY: ['Compute need per department first, then sort a copy, keeping the original index for ties.', 'The prefix search starts at /30 and shortens until 2^(32 − p) − 2 ≥ need; remember the +1 gateway is already in need.', 'Keep a running cursor (unsigned 32-bit) and compare cursor + size with the end of the block before allocating.'],
  loi: ['Forgetting the gateway (“+1”) and giving a /26 to exactly 62 hosts.', 'Sorting by hosts instead of by need (growth can change the order).', 'Not returning the error object when the block is exhausted.'],
  gt: ['This is the full job of the addressing step in a network design: demand → block sizes → aligned allocation → documented gateways and spare capacity.', 'Đây là toàn bộ công việc bước địa chỉ trong thiết kế mạng: nhu cầu → kích thước khối → cấp phát thẳng hàng → ghi lại gateway và phần dự phòng.'],
  kn: ['VLSM', 'address planning'],
});

export default doiDau({ slug: 'nwc204-10-lab-address-planner', ten: 'Lab 10 — Address planner', khoa: KHOA, baiHoc: 'nwc204-ch10-quiz', de: [LAB] });
