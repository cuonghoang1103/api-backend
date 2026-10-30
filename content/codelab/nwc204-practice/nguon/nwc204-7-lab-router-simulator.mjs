/** NWC204 · LAB chương 7 — Mô phỏng chuyển tiếp gói qua nhiều router (khớp tiền tố dài nhất, TTL, vòng lặp). */
import { doiDau, KHOA, S, bi, js } from './_nw.mjs';

const NET = {
  R1: { connected: ['10.0.1.0/24'], routes: [{ net: '0.0.0.0/0', via: 'R2' }] },
  R2: { connected: ['10.0.2.0/24'], routes: [{ net: '10.0.1.0/24', via: 'R1' }, { net: '10.0.3.0/24', via: 'R3' }, { net: '10.0.4.0/24', via: 'R3' }] },
  R3: { connected: ['10.0.3.0/24'], routes: [{ net: '10.0.4.0/24', via: 'R4' }, { net: '0.0.0.0/0', via: 'R2' }] },
  R4: { connected: ['10.0.4.0/24'], routes: [{ net: '0.0.0.0/0', via: 'R3' }] },
};
const LOOP = { A: { connected: ['10.1.0.0/24'], routes: [{ net: '0.0.0.0/0', via: 'B' }] }, B: { connected: ['10.2.0.0/24'], routes: [{ net: '0.0.0.0/0', via: 'A' }] } };
const SPEC = { X: { connected: ['10.0.0.0/8'], routes: [{ net: '10.5.0.0/16', via: 'Y' }] }, Y: { connected: ['10.5.1.0/24'], routes: [{ net: '10.5.1.128/25', via: 'Z' }] }, Z: { connected: ['10.5.1.128/25'], routes: [] } };

const LAB = js({
  ten: 'Lab 7 — A multi-router forwarding simulator', kho: 'HARD', phut: 50, diem: 60, dangBai: 'lab',
  en: `<p><b>Scenario.</b> You are debugging a routed network on paper. Write <code>routePacket(routers, start, dst, ttl)</code>:</p>
<ol>
<li><code>routers</code> maps a name to <code>{ connected: ["10.0.1.0/24", …], routes: [{ net: "0.0.0.0/0", via: "R2" }, …] }</code>. The packet starts at router <code>start</code> with the given <code>ttl</code>.</li>
<li>At each router: append its name to <code>path</code>, <b>decrement the TTL</b>; if it reaches 0 (or less) stop with <code>result "ttl-expired"</code>.</li>
<li>Look up <code>dst</code> among the connected networks (as routes with no next hop) and the static routes; use the <b>longest prefix match</b>. If none matches stop with <code>"unreachable"</code>; if the best match is a connected network stop with <code>"delivered"</code>; otherwise move to the router named in <code>via</code>.</li>
<li>Return <code>{ path, result, at }</code> where <code>at</code> is the router where the packet stopped.</li>
</ol>
<p>This is exactly what <code>traceroute</code> reveals when a loop (two default routes pointing at each other) eats the TTL.</p>`,
  vi: `<p><b>Tình huống.</b> Bạn gỡ lỗi một mạng định tuyến trên giấy. Viết <code>routePacket(routers, start, dst, ttl)</code>:</p>
<ol>
<li><code>routers</code> ánh xạ tên sang <code>{ connected: ["10.0.1.0/24", …], routes: [{ net: "0.0.0.0/0", via: "R2" }, …] }</code>. Gói bắt đầu ở router <code>start</code> với <code>ttl</code> cho trước.</li>
<li>Ở mỗi router: thêm tên vào <code>path</code>, <b>giảm TTL</b>; nếu về 0 (hoặc nhỏ hơn) dừng với <code>result "ttl-expired"</code>.</li>
<li>Tra <code>dst</code> trong các mạng nối trực tiếp (xem như tuyến không next hop) và tuyến tĩnh; dùng <b>khớp tiền tố dài nhất</b>. Không khớp thì dừng với <code>"unreachable"</code>; khớp tốt nhất là mạng nối trực tiếp thì dừng với <code>"delivered"</code>; ngược lại chuyển tới router ghi ở <code>via</code>.</li>
<li>Trả <code>{ path, result, at }</code> với <code>at</code> là router nơi gói dừng.</li>
</ol>
<p>Đây đúng là điều <code>traceroute</code> cho thấy khi vòng lặp (hai default route trỏ vào nhau) ăn hết TTL.</p>`,
  yc: [bi('Return the value; do not print it.', 'Trả về giá trị, đừng in ra.'), bi('Do not modify the routers object.', 'Không sửa đối tượng routers.')],
  fn: 'routePacket', params: 'routers, start, dst, ttl', ref: S.routePacket,
  cases: [[NET, 'R1', '10.0.4.9', 8], [NET, 'R1', '10.0.1.55', 8], [NET, 'R4', '10.0.1.9', 8], [NET, 'R1', '10.0.4.9', 3], [NET, 'R1', '8.8.8.8', 8], [LOOP, 'A', '10.2.0.9', 6], [LOOP, 'A', '10.1.0.9', 6], [SPEC, 'X', '10.5.1.200', 8], [SPEC, 'X', '10.5.1.20', 8], [SPEC, 'X', '10.5.9.9', 8], [SPEC, 'X', '11.0.0.1', 8]],
  goiY: ['Write lookup(router, dst) first: it returns the best entry (connected entries have via = null).', 'Decrement the TTL before the lookup; a TTL that reaches 0 stops at THIS router.', 'A routing loop is not special-cased: the TTL ends it.'],
  loi: ['Looking up before decrementing the TTL (off by one hop).', 'Treating a default route as higher priority than a more specific connected network.', 'Forgetting that the connected network counts as a route.'],
  gt: ['Every router decides alone, using only its own table and the destination IP. Loops, black holes and wrong default routes all come from these local decisions not agreeing.', 'Mỗi router tự quyết định, chỉ dựa trên bảng của mình và IP đích. Vòng lặp, hố đen và default route sai đều đến từ việc các quyết định cục bộ không khớp nhau.'],
  kn: ['routing', 'longest prefix match', 'TTL'],
});

export default doiDau({ slug: 'nwc204-7-lab-router-simulator', ten: 'Lab 7 — Router forwarding simulator', khoa: KHOA, baiHoc: 'nwc204-ch7-quiz', de: [LAB] });
