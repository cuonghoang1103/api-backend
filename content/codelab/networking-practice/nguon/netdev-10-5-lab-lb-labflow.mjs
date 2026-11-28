/**
 * Networking for Developers · Chương 10 (cân bằng tải và proxy) — bộ luyện chương, gắn bài Lab 10 (netdev-10-5-lab-lb-labflow).
 * Dữ liệu thật: lab/out/c101-rr (round robin be1→be2→be3), c101-l4l7 (L7 có X-Forwarded-For, L4 thì null), c102-hash (alice luôn be2,
 * bob luôn be3), c104-codes (502 dead upstream, 504 backend chậm). Vòng băm của bài viết hàm dùng FNV-1a 32 bit (đề ghi rõ) — nginx
 * dùng hàm băm khác nên tên backend cụ thể KHÔNG trùng với lab; điều được kiểm là tính chất của consistent hashing.
 */
import { doiDau, KHOA, tn, jsBai, nguon, goi, ra, pre, cs, tinh, ord, bang1, mt, q } from './_net.mjs';

const BE = (tep) => ra(tep).split('\n').filter((d) => !/^\$/.test(d)).map((d) => (/"backend":"([^"]+)"/.exec(d) || [])[1]).filter(Boolean);
const RR = BE('c101-rr'), HASH = BE('c102-hash');
const XFF = ra('c101-l4l7').split('\n').filter((d) => /^"forwardedFor"/.test(d));
const CODES = ra('c104-codes').split('\n').filter((d) => /->/.test(d) && !/^\$/.test(d)).map((d) => d.replace(/\s+/g, ' '));
if (RR.join() !== 'be1,be2,be3,be1,be2,be3' || HASH.join() !== 'be2,be2,be2,be3,be3,be3' || XFF.length !== 2 || CODES.length !== 2) throw new Error('Ch10: output thật đổi — xem lại đề');

function ringAssign(nodes, keys, vnodes) {
  function fnv(s) {
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    // finaliser (MurmurHash3 fmix32): spreads similar names such as "be1#0" / "be1#1" over the whole ring
    h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b) >>> 0; h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35) >>> 0; h ^= h >>> 16;
    return h >>> 0;
  }
  var ring = [];
  nodes.forEach(function (n) { for (var v = 0; v < vnodes; v++) ring.push({ h: fnv(n + '#' + v), node: n }); });
  ring.sort(function (a, b) { return a.h - b.h || (a.node < b.node ? -1 : 1); });
  var out = {};
  keys.forEach(function (k) {
    if (!ring.length) { out[k] = null; return; }
    var h = fnv(k), pick = ring[0]; // wrap around to the first point
    for (var i = 0; i < ring.length; i++) if (ring[i].h >= h) { pick = ring[i]; break; } // first point clockwise
    out[k] = pick.node;
  });
  return out;
}
const USERS = ['alice', 'bob', 'carol', 'dave', 'erin', 'frank', 'grace', 'heidi', 'ivan', 'judy'];
const E1 = jsBai({
  ten: 'LB 1 — Write ringAssign(nodes, keys, vnodes): consistent hashing', kho: 'HARD', phut: 30,
  en: `<p>Lab 10 hashed on <code>?user=</code> so each user sticks to one backend — for real, <code>alice</code> always went to <code>${HASH[0]}</code> and <code>bob</code> to <code>${HASH[3]}</code>. Plain <code>hash % N</code> would move almost every user when a backend dies; a hash RING moves only the users of the dead one. Write <code>ringAssign(nodes, keys, vnodes)</code>:</p>
<ol>
<li>Hash function: FNV-1a 32-bit — start at <code>0x811c9dc5</code>; for each character <code>h ^= code; h = Math.imul(h, 0x01000193) &gt;&gt;&gt; 0</code> — then the MurmurHash3 finaliser so that similar names land far apart: <code>h ^= h&gt;&gt;&gt;16; h = Math.imul(h, 0x85ebca6b)&gt;&gt;&gt;0; h ^= h&gt;&gt;&gt;13; h = Math.imul(h, 0xc2b2ae35)&gt;&gt;&gt;0; h ^= h&gt;&gt;&gt;16</code> (keep it unsigned with <code>&gt;&gt;&gt; 0</code>).</li>
<li>Each node gets <code>vnodes</code> points on the ring: <code>hash(node + "#" + v)</code> for v = 0…vnodes−1. Sort points by hash (ties: node name ascending).</li>
<li>A key goes to the first point whose hash is ≥ hash(key); if none, wrap to the first point.</li>
<li>Return an object key → node (<code>null</code> for every key if there are no nodes).</li>
</ol>
<p>(nginx uses a different hash, so the backend names here will not match the lab — the property you are building is what matters.)</p>`,
  vi: `<p>Lab 10 băm theo <code>?user=</code> để mỗi người dùng bám một backend — thật vậy, <code>alice</code> luôn về <code>${HASH[0]}</code> còn <code>bob</code> về <code>${HASH[3]}</code>. Kiểu <code>hash % N</code> thường sẽ dời gần như mọi người dùng khi một backend chết; một VÒNG băm chỉ dời người dùng của chính backend đó. Viết <code>ringAssign(nodes, keys, vnodes)</code>:</p>
<ol>
<li>Hàm băm: FNV-1a 32 bit — bắt đầu từ <code>0x811c9dc5</code>; với mỗi ký tự <code>h ^= mã; h = Math.imul(h, 0x01000193) &gt;&gt;&gt; 0</code> — rồi qua bước trộn cuối của MurmurHash3 để các tên giống nhau rơi xa nhau: <code>h ^= h&gt;&gt;&gt;16; h = Math.imul(h, 0x85ebca6b)&gt;&gt;&gt;0; h ^= h&gt;&gt;&gt;13; h = Math.imul(h, 0xc2b2ae35)&gt;&gt;&gt;0; h ^= h&gt;&gt;&gt;16</code> (giữ không dấu bằng <code>&gt;&gt;&gt; 0</code>).</li>
<li>Mỗi node có <code>vnodes</code> điểm trên vòng: <code>hash(node + "#" + v)</code> với v = 0…vnodes−1. Sắp các điểm theo băm (bằng nhau thì theo tên node tăng dần).</li>
<li>Một khoá thuộc về điểm đầu tiên có băm ≥ hash(khoá); không có thì vòng về điểm đầu tiên.</li>
<li>Trả về object khoá → node (<code>null</code> cho mọi khoá nếu không có node nào).</li>
</ol>
<p>(nginx dùng hàm băm khác, nên tên backend ở đây sẽ không trùng với lab — thứ bạn đang dựng là TÍNH CHẤT.)</p>`,
  dau: 'function ringAssign(nodes, keys, vnodes) {\n  var out = {};\n  keys.forEach(function (k, i) { out[k] = nodes[i % nodes.length]; });\n  return out;\n}\n',
  giai: nguon(ringAssign),
  cases: [
    { goi: goi('ringAssign', ['be1', 'be2', 'be3'], USERS, 4) },
    { goi: goi('ringAssign', ['be1', 'be3'], USERS, 4), moTa: ['Case 2: be2 died — only its users may move', 'Ca 2: be2 chết — chỉ người dùng của nó được phép dời'] },
    { goi: goi('ringAssign', ['be1', 'be2', 'be3', 'be4'], USERS, 16), an: true },
    { goi: goi('ringAssign', ['only'], ['x', 'y'], 1), an: true },
    { goi: goi('ringAssign', [], ['x'], 4), an: true },
    { goi: goi('ringAssign', ['a', 'b'], ['k1', 'k2', 'k3', 'k4', 'k5', 'k6'], 1), an: true },
  ],
  goiY: [['Build the ring once: an array of { h, node }, sorted.', 'Dựng vòng một lần: mảng { h, node } đã sắp.'], ['A linear scan for the first h ≥ key hash is fine for a few dozen points.', 'Quét tuyến tính tìm h đầu tiên ≥ băm của khoá là đủ với vài chục điểm.'], ['Compare Case 1 with Case 2: every user that changed node must have been on be2.', 'So Ca 1 với Ca 2: mọi người dùng đổi node đều phải từng ở be2.']],
  loi: [['Forgetting >>> 0, so hashes become negative and the order breaks.', 'Quên >>> 0, khiến băm thành số âm và thứ tự hỏng.'], ['Skipping the finaliser: raw FNV-1a of be1#0, be1#1… clusters, and one backend ends up with almost every key.', 'Bỏ bước trộn cuối: FNV-1a thô của be1#0, be1#1… dồn cục, và một backend nhận gần hết khoá.'], ['Using key % nodes.length, which re-shuffles most keys when a node is removed.', 'Dùng khoá % số node, khiến phần lớn khoá bị xáo lại khi bớt một node.']],
  gt: ['With a ring, removing a node hands only its arc to the next node clockwise; every other key stays put, so caches and sessions on the surviving backends stay warm. Virtual nodes spread each backend around the ring so the load stays even.', 'Với vòng băm, bớt một node chỉ trao cung của nó cho node kế tiếp theo chiều kim đồng hồ; mọi khoá khác đứng yên, nên cache và phiên trên các backend còn sống vẫn "ấm". Node ảo rải mỗi backend quanh vòng để tải luôn đều.'],
  kn: ['consistent hashing', 'virtual nodes'],
});

const E2 = tinh({
  tieuDe: 'LB 2 — Read the gateway code, name the broken side', doKho: 'MEDIUM', phut: 10,
  moTa: mt(`Lab 10 produced two of these for real:${pre(CODES)}Match every symptom to the code the proxy returns and the first thing to check.`, `Lab 10 tạo ra thật hai mã trong số này:${pre(CODES)}Ghép mỗi triệu chứng với mã proxy trả về và việc đầu tiên cần kiểm.`),
  loai: 'table',
  bang: [bang1('b1', ['Symptom → code → first check', 'Triệu chứng → mã → kiểm đầu tiên'], [{ ma: 's', ten: 'Situation' }, { ma: 'c', ten: 'Code', luaChon: ['502', '503', '504', '524'] }, { ma: 'k', ten: 'First check', luaChon: ['is the backend process running and listening?', 'how long does the backend take (TTFB)?', 'how many backends are healthy right now?', 'does the request finish within the edge limit?'] }], [
    { o: { s: 'Nothing listens on the upstream port' }, a: { c: '502', k: 'is the backend process running and listening?' } },
    { o: { s: 'The backend takes 3 s, the proxy waits 1 s' }, a: { c: '504', k: 'how long does the backend take (TTFB)?' } },
    { o: { s: 'Every backend failed its health check' }, a: { c: '503', k: 'how many backends are healthy right now?' } },
    { o: { s: 'Cloudflare waited about 100 s for the origin' }, a: { c: '524', k: 'does the request finish within the edge limit?' } },
  ], ['502 = the proxy could not get a valid answer (dead, crashed, wrong port); 504 = it connected but the answer was too slow; 503 = there was no healthy capacity to send it to; 524 = Cloudflare\'s own edge timeout. Reading the code first tells you which team and which log to open.', '502 = proxy không lấy được câu trả lời hợp lệ (chết, sập, sai cổng); 504 = đã nối được nhưng trả lời quá chậm; 503 = không còn năng lực khoẻ mạnh nào để gửi tới; 524 = timeout riêng ở biên của Cloudflare. Đọc mã trước cho bạn biết đội nào và log nào cần mở.'])],
  goiY: ['Too slow and absent are different failures.', '524 is specific to Cloudflare.'],
  loiHayGap: ['Restarting a healthy backend because of a 504 caused by a slow query.', 'Calling every 5xx "the server is down".'],
  thuatNgu: [tn('upstream', 'máy phía sau proxy'), tn('health check', 'kiểm tra sức khoẻ')], khaiNiem: ['gateway errors'],
});

const E3 = cs({
  ten: 'LB 3 — L4 or L7, reverse or forward, and the retry trap', kho: 'HARD', phut: 10,
  en: `Real Lab 10 output: the same backend through an L7 proxy (nginx :8080) and an L4 forwarder (socat :9090): ${pre(XFF)} and six round-robin requests went ${RR.join(' → ')}.`,
  vi: `Kết xuất thật của Lab 10: cùng một backend qua proxy L7 (nginx :8080) và bộ chuyển tiếp L4 (socat :9090): ${pre(XFF)} và sáu request round robin đi ${RR.join(' → ')}.`,
  cau: [
    q('c1', ['Why is forwardedFor null through the L4 forwarder?', 'Vì sao forwardedFor là null khi đi qua bộ chuyển tiếp L4?'], ['L4 copies bytes without parsing HTTP, so it cannot add headers', 'socat strips every header for security', 'The backend ignores headers on port 9090', 'L4 forwarders only work for UDP'], ['An L7 proxy understands HTTP and can add X-Forwarded-For, route by path or terminate TLS; an L4 balancer sees only IPs and ports. To keep the client IP at L4 you need something like the PROXY protocol.', 'Proxy L7 hiểu HTTP nên thêm được X-Forwarded-For, định tuyến theo path hay kết thúc TLS; bộ cân bằng L4 chỉ thấy IP và cổng. Muốn giữ IP client ở L4 cần thứ như PROXY protocol.']),
    q('c2', ['A company filter that every employee\'s browser goes through is a …', 'Bộ lọc công ty mà trình duyệt mọi nhân viên phải đi qua là một …'], ['forward proxy — it fronts the clients', 'reverse proxy — it fronts the servers', 'load balancer — it fronts the backends', 'CDN edge — it caches the origin'], ['Direction is the whole difference: a forward proxy acts for clients going out; a reverse proxy (nginx in Lab 10) acts for servers receiving traffic.', 'Hướng đi là toàn bộ khác biệt: forward proxy làm thay client đi ra ngoài; reverse proxy (nginx trong Lab 10) làm thay server nhận lưu lượng.']),
    q('c3', ['The balancer retries a request on another backend when the first one fails. Which requests is that safe for?', 'Bộ cân bằng thử lại request ở backend khác khi backend đầu hỏng. Với request nào thì việc đó an toàn?'], ['Idempotent ones such as GET — not a POST that may already have run', 'All requests, because the user never sees the retry', 'Only requests larger than 1 MB', 'Only WebSocket upgrades'], ['If the first backend crashed after charging a card, retrying the POST charges it twice. Retry idempotent methods, or make writes idempotent with an idempotency key.', 'Nếu backend đầu sập sau khi đã trừ tiền thẻ, thử lại POST là trừ hai lần. Chỉ thử lại phương thức idempotent, hoặc làm thao tác ghi idempotent bằng idempotency key.']),
    q('c4', ['Round robin sent six requests be1 → be2 → be3 → be1 → be2 → be3. When does it behave badly?', 'Round robin gửi sáu request be1 → be2 → be3 → be1 → be2 → be3. Khi nào nó hành xử tệ?'], ['When some requests cost far more than others', 'When there are exactly three backends', 'When all backends run the same code', 'When health checks are switched on'], ['Round robin counts requests, not work. With uneven requests, least-connections or a latency-aware algorithm spreads load better.', 'Round robin đếm request, không đếm khối lượng việc. Khi request nặng nhẹ khác nhau, least-connections hoặc thuật toán theo độ trễ chia tải tốt hơn.']),
    q('c5', ['A backend dies. How does the balancer stop sending it traffic?', 'Một backend chết. Bộ cân bằng ngừng gửi lưu lượng cho nó bằng cách nào?'], ['Health checks mark it down and skip it', 'The backend sends a goodbye packet first', 'DNS removes its record automatically', 'Each client stops choosing it by itself'], ['After be2 was killed in the lab, only be1 and be3 answered: the failed attempt was retried and be2 left the pool. Health checks — active probes or passive failure counts — decide that, and they also decide when it comes back.', 'Sau khi be2 bị giết trong lab, chỉ be1 và be3 trả lời: lượt hỏng được thử lại và be2 rời khỏi pool. Health check — dò chủ động hoặc đếm lỗi thụ động — quyết định điều đó, và cũng quyết định khi nào nó quay lại.']),
  ],
  goiY: [['L4 = IPs and ports; L7 = HTTP.', 'L4 = IP và cổng; L7 = HTTP.'], ['Retries are only free for idempotent requests.', 'Thử lại chỉ miễn phí với request idempotent.']],
  loi: [['Expecting X-Forwarded-For from an L4 balancer.', 'Chờ X-Forwarded-For từ bộ cân bằng L4.'], ['Enabling automatic retries for POST and double-charging customers.', 'Bật tự động thử lại cho POST và trừ tiền khách hai lần.']],
  tns: [tn('L4 / L7', 'tầng 4 / tầng 7'), tn('idempotent', 'lặp lại không đổi kết quả'), tn('forward proxy', 'proxy chiều đi')], kn: ['load balancing'],
});

const E4 = tinh({
  tieuDe: 'LB 4 — Take one backend out without dropping a request', doKho: 'MEDIUM', phut: 6,
  moTa: mt('Put the steps of a graceful removal of one backend behind the balancer in order.', 'Xếp các bước gỡ êm một backend khỏi sau bộ cân bằng theo đúng thứ tự.'),
  loai: 'order',
  cauHoi: [ord('q1', ['Graceful drain', 'Xả êm'], ['Mark the backend as draining: the balancer sends it no NEW requests', 'Wait for in-flight requests (and long-lived connections) to finish or time out', 'Stop and upgrade the backend', 'Start it and wait until its health check passes', 'Put it back into the pool, then repeat for the next backend'], ['Stopping first drops every in-flight request; re-adding before the health check passes sends users to a process that is not ready. Draining one backend at a time keeps the service up the whole time.', 'Dừng trước là làm rơi mọi request đang chạy; đưa lại trước khi health check qua là gửi người dùng tới một tiến trình chưa sẵn sàng. Xả từng backend một giữ dịch vụ sống suốt quá trình.'])],
  goiY: ['No new work first; finish old work second.', 'Health check before traffic.'],
  loiHayGap: ['Killing the process and relying on retries to hide it.', 'Re-adding the backend the moment the process starts.'],
  thuatNgu: [tn('graceful shutdown', 'tắt êm')], khaiNiem: ['rolling deploy'],
});

export default doiDau({ slug: 'netdev-10-5-lab-lb-labflow', ten: 'Lab 10 — Practice: consistent hashing, gateway codes and proxies', khoa: KHOA, baiHoc: 'netdev-10-5-lab-lb-labflow', de: [E1, E2, E3, E4] });
