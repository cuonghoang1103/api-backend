/**
 * Networking for Developers — Progress Test 3 (Chương 10–14: cân bằng tải, chẩn đoán, phỏng vấn, capstone, mạng thực chiến):
 * 20 câu trắc nghiệm + 1 câu lập trình, 50 phút.
 *
 * Đề tự soạn, bám content/courses/networking-for-developers/s10…s14 và output thật trong lab/out (c101-*, c102-hash, c104-codes, c113-path,
 * c133-toiuu, c134-break, c142-dem, c146-wan). Câu lập trình: so số khoá phải dời khi bớt một backend — băm modulo so với vòng băm —
 * expectedOutput do bộ dựng CHẠY lời giải mẫu mà ra; exam-check chạy lại bằng node thật.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NETWORKING-FOR-DEVELOPERS-PT3.mjs --apply
 * Kiểm: node scripts/exam-check.mjs content/exams/NETWORKING-FOR-DEVELOPERS-PT3.mjs
 */
import { B, c, mcq, codeQ, ptInstructions } from './_lib/networking-exam-kit.mjs';

const M = (p, opts, ex) => mcq({ p, opts, ex, points: 0.4 });

const Q = [
  /* Chương 10 */
  M(['Through an L4 forwarder the backend sees forwardedFor: null; through nginx it sees the client IP. Why?', 'Qua bộ chuyển tiếp L4, backend thấy forwardedFor: null; qua nginx thì thấy IP client. Vì sao?'],
    [['L4 copies bytes and cannot add headers', 'L4 chỉ chép byte, không thêm được header'], ['The L4 forwarder strips headers', 'Bộ L4 xoá header'], ['nginx uses UDP', 'nginx dùng UDP'], ['The backend ignores port 9090', 'Backend bỏ qua cổng 9090']],
    ['Only an L7 proxy parses HTTP, so only it can add X-Forwarded-For. At L4 the client IP needs the PROXY protocol or similar.', 'Chỉ proxy L7 đọc HTTP, nên chỉ nó thêm được X-Forwarded-For. Ở L4, IP client cần PROXY protocol hoặc tương tự.']),
  M(['Hashing on ?user= sends alice to be2 every time. What is that good for?', 'Băm theo ?user= luôn đưa alice tới be2. Điều đó có ích gì?'],
    [['Per-user state and caches stay warm on one backend', 'Trạng thái và cache theo người dùng nằm ấm trên một backend'], ['It spreads load perfectly evenly', 'Nó chia tải đều tuyệt đối'], ['It makes failover unnecessary', 'Nó khiến khỏi cần chuyển dự phòng'], ['It encrypts the session', 'Nó mã hoá phiên']],
    ['Stickiness keeps a user\'s session or cache on one machine. The price: a hot user makes a hot backend, and the backend\'s death moves that user.', 'Dính phiên giữ phiên hay cache của người dùng trên một máy. Cái giá: người dùng "nóng" làm backend nóng, và backend chết thì người đó bị dời.']),
  M(['A proxy returns 504. What is ruled out?', 'Proxy trả 504. Điều gì đã bị loại trừ?'],
    [['The backend being unreachable', 'Backend không với tới được'], ['The backend being slow', 'Backend chậm'], ['A slow database query', 'Một truy vấn chậm'], ['The proxy timeout being too short', 'Timeout của proxy quá ngắn']],
    ['504 means the proxy reached the backend and waited longer than its timeout for an answer. A backend nobody can connect to produces 502 instead.', '504 nghĩa là proxy đã tới được backend và chờ lâu hơn timeout của nó. Backend không ai nối được thì cho 502.']),
  M(['Why must automatic retries at the balancer be limited to idempotent requests?', 'Vì sao tự động thử lại ở bộ cân bằng phải giới hạn ở request idempotent?'],
    [['A retried POST may run twice', 'POST thử lại có thể chạy hai lần'], ['GET requests cannot be retried', 'GET không thử lại được'], ['Retries break TLS', 'Thử lại làm hỏng TLS'], ['Retries disable health checks', 'Thử lại làm tắt health check']],
    ['The first backend may have done the work before failing. Retrying a payment charges twice; retry GET/PUT-style requests, or use an idempotency key.', 'Backend đầu có thể đã làm xong việc trước khi hỏng. Thử lại một lần thanh toán là trừ tiền hai lần; chỉ thử lại request kiểu GET/PUT, hoặc dùng idempotency key.']),
  /* Chương 11 */
  M(['mtr shows 60% loss at hop 3 and 0% at hops 4–5 (the destination). What do you conclude?', 'mtr cho thấy mất 60% ở hop 3 và 0% ở hop 4–5 (đích). Bạn kết luận gì?'],
    [['Hop 3 rate-limits ICMP replies; users are fine', 'Hop 3 hạn chế trả lời ICMP; người dùng không sao'], ['Hop 3 drops 60% of user traffic', 'Hop 3 bỏ 60% lưu lượng người dùng'], ['The destination is overloaded', 'Đích bị quá tải'], ['The path loops at hop 3', 'Đường đi lặp ở hop 3']],
    ['Loss that does not continue downstream is the router de-prioritising its own replies. Real loss starts at a hop and persists to the destination.', 'Mất gói không kéo dài xuống phía sau là router hạ ưu tiên câu trả lời của chính nó. Mất gói thật bắt đầu ở một hop và kéo dài tới đích.']),
  M(['A log says connect ETIMEDOUT 10.99.0.2:5432 after 7 s. Which layer, and the next command?', 'Log ghi connect ETIMEDOUT 10.99.0.2:5432 sau 7 giây. Tầng nào, lệnh tiếp theo?'],
    [['Path or firewall: nc -zv -w 3', 'Đường đi hay tường lửa: nc -zv -w 3'], ['DNS: dig the name', 'DNS: dig cái tên'], ['Application: read the slow log', 'Ứng dụng: đọc slow log'], ['TLS: openssl s_client', 'TLS: openssl s_client']],
    ['No answer to the SYN — a DROP rule, a security group or a wrong route. A refused port would fail in milliseconds with ECONNREFUSED instead.', 'Không ai trả lời SYN — luật DROP, security group hoặc sai tuyến. Cổng bị từ chối thì hỏng trong vài mili giây với ECONNREFUSED.']),
  M(['iperf3 shows 289 Mbit/s and ping 22 ms. A page makes 30 sequential API calls. Which number dominates its load time?', 'iperf3 cho 289 Mbit/s và ping 22 ms. Một trang gọi 30 API tuần tự. Con số nào chi phối thời gian tải?'],
    [['The 22 ms round trip', 'Vòng khứ hồi 22 ms'], ['The 289 Mbit/s', '289 Mbit/s'], ['Neither', 'Không con nào'], ['The MTU', 'MTU']],
    ['30 × 22 ms ≈ 0.7 s of pure waiting, regardless of bandwidth. The fix is fewer or closer round trips — batching, keep-alive, HTTP/2, a CDN.', '30 × 22 ms ≈ 0,7 giây chờ thuần tuý, bất kể băng thông. Cách sửa là ít vòng hơn hoặc gần hơn — gộp lời gọi, keep-alive, HTTP/2, CDN.']),
  M(['A rare ECONNRESET appears after moving behind a load balancer. First thing to compare?', 'ECONNRESET thỉnh thoảng xuất hiện sau khi chuyển ra sau load balancer. So cái gì trước?'],
    [['The idle timeouts of the LB and the app', 'Idle timeout của LB và của ứng dụng'], ['The TLS cipher suites', 'Các bộ mã TLS'], ['The DNS TTL', 'TTL của DNS'], ['The MTU of both interfaces', 'MTU của hai interface']],
    ['An idle keep-alive race: one side closes an idle connection as the other reuses it. Make the server\'s keep-alive timeout longer than the LB\'s.', 'Cuộc đua keep-alive nhàn rỗi: một bên đóng kết nối nhàn rỗi đúng lúc bên kia dùng lại. Đặt keep-alive timeout của server dài hơn của LB.']),
  /* Chương 12 */
  M(['"The page is slow only from one region." curl -w shows time_connect 0.21 s there and 0.01–0.03 s elsewhere; TTFB minus connect is similar everywhere. Verdict?', '"Trang chỉ chậm ở một vùng." curl -w cho time_connect 0,21 s ở đó và 0,01–0,03 s ở nơi khác; TTFB trừ connect giống nhau mọi nơi. Kết luận?'],
    [['Distance or path to that region', 'Khoảng cách hoặc đường đi tới vùng đó'], ['The origin is slow', 'Origin chậm'], ['The database is overloaded', 'Cơ sở dữ liệu quá tải'], ['The TLS certificate is wrong', 'Chứng chỉ TLS sai']],
    ['connect is roughly one round trip, so it measures the path; the server time is the same everywhere. Look at a CDN, the PoP that answered, or the route.', 'connect xấp xỉ một vòng khứ hồi, nên nó đo đường đi; thời gian server ở đâu cũng như nhau. Hãy xem CDN, PoP đã trả lời, hoặc tuyến đường.']),
  M(['In a scenario round, what do interviewers grade most?', 'Trong vòng tình huống, người phỏng vấn chấm điểm điều gì nhiều nhất?'],
    [['The method: hypotheses with measurements', 'Phương pháp: giả thuyết kèm phép đo'], ['Naming the cause first', 'Nói ra nguyên nhân trước tiên'], ['Reciting the OSI layers', 'Đọc thuộc các tầng OSI'], ['Knowing vendor commands', 'Thuộc lệnh của hãng']],
    ['Restate the symptom, list layered hypotheses, name the one measurement for each, conclude with the fix and prevention. A lucky guess scores less than a sound method.', 'Nói lại triệu chứng, liệt kê giả thuyết theo tầng, gọi tên đúng một phép đo cho mỗi giả thuyết, kết luận bằng cách sửa và cách phòng. Đoán trúng nhờ may được ít điểm hơn một phương pháp chắc chắn.']),
  M(['Which HTTP version removed TCP head-of-line blocking?', 'Phiên bản HTTP nào xoá nghẽn đầu hàng của TCP?'],
    [['HTTP/3', 'HTTP/3'], ['HTTP/2', 'HTTP/2'], ['HTTP/1.1', 'HTTP/1.1'], ['None of them', 'Không phiên bản nào']],
    ['HTTP/2 multiplexes streams over ONE TCP connection, so a lost packet still stalls them all. HTTP/3 runs streams over QUIC, where a loss stalls only its own stream.', 'HTTP/2 ghép luồng trên MỘT kết nối TCP, nên một gói mất vẫn làm đứng tất cả. HTTP/3 chạy luồng trên QUIC, nơi gói mất chỉ làm đứng luồng của nó.']),
  M(['For a backend developer, the course\'s view of the CCNA is…', 'Với lập trình viên backend, quan điểm của khoá về CCNA là…'],
    [['Usually overkill; measured projects say more', 'Thường là quá tay; dự án có đo đạc nói nhiều hơn'], ['Required for any backend job', 'Bắt buộc cho mọi việc backend'], ['Worthless in every case', 'Vô giá trị trong mọi trường hợp'], ['Only valid with a cloud certificate', 'Chỉ có giá trị khi kèm chứng chỉ cloud']],
    ['CCNA is the credential when the network is your job. For application developers, a project you can measure and explain carries more weight in an interview.', 'CCNA là chứng chỉ khi mạng là công việc của bạn. Với lập trình viên ứng dụng, một dự án đo được và giải thích được có trọng lượng hơn trong phỏng vấn.']),
  /* Chương 13 */
  M(['/big.html is 67,092 bytes without compression and 1,809 bytes with gzip. Roughly how many times smaller?', '/big.html dài 67.092 byte khi không nén và 1.809 byte khi gzip. Nhỏ đi khoảng bao nhiêu lần?'],
    [['About 37×', 'Khoảng 37 lần'], ['About 3.7×', 'Khoảng 3,7 lần'], ['About 370×', 'Khoảng 370 lần'], ['About 2.7×', 'Khoảng 2,7 lần']],
    ['67,092 / 1,809 ≈ 37.1. Repetitive HTML compresses extremely well, and fewer bytes means fewer round trips while the congestion window is still small.', '67.092 / 1.809 ≈ 37,1. HTML lặp lại nén cực tốt, và ít byte hơn nghĩa là ít vòng khứ hồi hơn khi cửa sổ tắc nghẽn còn nhỏ.']),
  M(['nc -zv to port 8099 prints "Connection refused". Which layer does that pin?', 'nc -zv tới cổng 8099 in "Connection refused". Điều đó chốt tầng nào?'],
    [['The port layer', 'Tầng cổng'], ['The upstream behind a proxy', 'Upstream phía sau proxy'], ['The DNS layer', 'Tầng DNS'], ['The TLS layer', 'Tầng TLS']],
    ['Refused is an answer from the host itself: reachable, nothing listening. A 502, by contrast, means the port is open and the upstream behind it is broken.', 'Refused là câu trả lời từ chính máy đó: với tới được, không có gì nghe. Còn 502 nghĩa là cổng mở nhưng upstream phía sau hỏng.']),
  M(['What turns an incident report from history into prevention?', 'Điều gì biến báo cáo sự cố từ chuyện đã qua thành biện pháp phòng ngừa?'],
    [['An alert that would catch it next time', 'Một cảnh báo bắt được nó lần sau'], ['A longer, more detailed timeline', 'Dòng thời gian dài và chi tiết hơn'], ['Naming who made the mistake', 'Nêu tên người đã mắc lỗi'], ['Attaching every single log line', 'Đính kèm mọi dòng log']],
    ['Symptom → diagnosis (layer + measurement) → fix → prevention. The last section — "add a TTFB alert", "move the report to a job" — is what stops the repeat; blameless reports keep people honest.', 'Triệu chứng → chẩn đoán (tầng + phép đo) → cách sửa → phòng ngừa. Phần cuối — "thêm cảnh báo TTFB", "chuyển báo cáo sang job" — mới ngăn lặp lại; báo cáo không đổ lỗi giữ mọi người trung thực.']),
  M(['A MISS through the edge took 3.01 s; the next request, a HIT, took 0.0006 s. What did the HIT skip?', 'Một lần MISS qua biên mất 3,01 giây; request kế tiếp là HIT mất 0,0006 giây. Lần HIT đã bỏ qua cái gì?'],
    [['The trip to the 3-second origin', 'Chuyến đi tới origin 3 giây'], ['The DNS lookup', 'Tra DNS'], ['The TLS handshake', 'Bắt tay TLS'], ['The TCP handshake', 'Bắt tay TCP']],
    ['The edge answered from its own copy, so the slow origin never ran. That is the strongest optimisation in the chapter — when the content is cacheable.', 'Biên trả lời từ bản sao của nó, nên origin chậm không phải chạy. Đó là tối ưu mạnh nhất của chương — khi nội dung cache được.']),
  /* Chương 14 */
  M([`The school gateway's rule ${c('DROP tcp multiport dports !80,443,587,993')} explains which symptom?`, `Luật ${c('DROP tcp multiport dports !80,443,587,993')} của gateway trường giải thích triệu chứng nào?`],
    [['SSH on 22 fails; SSH on 993 works', 'SSH cổng 22 hỏng; SSH cổng 993 chạy'], ['HTTPS to every site fails', 'HTTPS tới mọi trang đều hỏng'], ['Email on 587 fails', 'Email cổng 587 hỏng'], ['DNS lookups fail', 'Tra DNS hỏng']],
    ['The ! means "every port EXCEPT these": 22 is dropped, 80/443/587/993 pass. That is why the course\'s ssh config uses 993 at school.', 'Dấu ! nghĩa là "mọi cổng TRỪ các cổng này": 22 bị bỏ, 80/443/587/993 đi qua. Đó là lý do cấu hình ssh của khoá dùng 993 ở trường.']),
  M(['The home router\'s WAN is 100.64.0.2 while websites see 198.18.0.40. Will a port forward on the home router work?', 'WAN của router nhà là 100.64.0.2 trong khi các trang web thấy 198.18.0.40. Mở cổng trên router nhà có chạy không?'],
    [['No: the ISP\'s CGNAT is in front', 'Không: CGNAT của nhà mạng đứng phía trước'], ['Yes, on any port above 1024', 'Có, với mọi cổng trên 1024'], ['Yes, if UPnP is on', 'Có, nếu bật UPnP'], ['Only for UDP', 'Chỉ với UDP']],
    ['100.64.0.0/10 is the carrier-grade NAT range; nobody outside can start a connection to your router. Connect OUT instead — a reverse SSH tunnel or a VPN peer on a VPS.', '100.64.0.0/10 là dải NAT cấp nhà mạng; không ai bên ngoài mở được kết nối tới router của bạn. Hãy nối RA ngoài — đường hầm SSH ngược hoặc peer VPN trên VPS.']),
  M(['At school WireGuard shows "0 B received" but it works at home, while OpenVPN over TCP 443 connects. Why?', 'WireGuard báo "0 B received" ở trường nhưng chạy ở nhà, trong khi OpenVPN qua TCP 443 nối được. Vì sao?'],
    [['The school drops UDP; WireGuard is UDP-only', 'Trường bỏ UDP; WireGuard chỉ chạy UDP'], ['WireGuard keys expire at school', 'Khoá WireGuard hết hạn ở trường'], ['TCP 443 is faster than UDP', 'TCP 443 nhanh hơn UDP'], ['The VPS blocks the school', 'VPS chặn trường']],
    ['No handshake ever completes because every UDP packet is dropped. A TCP 443 tunnel looks like HTTPS to the port filter. Where the rules forbid tunnels, follow the rules.', 'Không lần bắt tay nào hoàn tất vì mọi gói UDP đều bị bỏ. Đường hầm TCP 443 trông như HTTPS với bộ lọc cổng. Ở nơi luật cấm đường hầm, hãy theo luật.']),
  M(['A school gateway counts packets arriving with TTL 63 from one Wi-Fi client. What does that suggest?', 'Một gateway đếm các gói tới với TTL 63 từ một client Wi-Fi. Điều đó gợi ý gì?'],
    [['A device behind a hotspot', 'Có thiết bị nằm sau điểm phát'], ['A Windows laptop on the Wi-Fi', 'Laptop Windows trên Wi-Fi'], ['A DNS server', 'Một máy chủ DNS'], ['A failing access point', 'Access point sắp hỏng']],
    ['Linux, Android, iOS and macOS start at TTL 64; one extra router (the phone sharing its connection) makes it 63. Windows starts at 128, so 127 means the same thing.', 'Linux, Android, iOS và macOS bắt đầu ở TTL 64; thêm một router (điện thoại đang chia sẻ mạng) thành 63. Windows bắt đầu ở 128, nên 127 cũng mang nghĩa đó.']),
];

const GIVEN = `// 3 backend, 1000 người dùng; be2 sắp bị gỡ khỏi pool.
const BEFORE = ['be1', 'be2', 'be3'];
const AFTER = ['be1', 'be3'];
const USERS = Array.from({ length: 1000 }, (_, i) => 'user-' + i);

// Hàm băm dùng chung (FNV-1a 32 bit + bước trộn cuối MurmurHash3) — đừng sửa.
function hash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b) >>> 0; h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35) >>> 0; h ^= h >>> 16;
  return h >>> 0;
}`;
const STUB = `function modAssign(nodes, key) {
  // nodes[hash(key) % nodes.length]
}
function ringAssign(nodes, key, vnodes) {
  // first ring point (hash(node + '#' + v)) clockwise from hash(key), wrapping around
}
function moved(assign, before, after, keys) {
  // how many keys change node between the two pools
}`;
const SOLUTION = `function modAssign(nodes, key) {
  return nodes[hash(key) % nodes.length];
}

function ringAssign(nodes, key, vnodes) {
  const ring = [];
  for (const n of nodes) for (let v = 0; v < vnodes; v++) ring.push({ h: hash(n + '#' + v), node: n });
  ring.sort((a, b) => a.h - b.h || (a.node < b.node ? -1 : 1));
  const k = hash(key);
  const p = ring.find((x) => x.h >= k) || ring[0];   // first point clockwise, wrap to the start
  return p.node;
}

function moved(assign, before, after, keys) {
  let n = 0;
  for (const k of keys) if (assign(before, k) !== assign(after, k)) n++;
  return n;
}`;
const PRINT = `const onBe2 = USERS.filter((u) => ringAssign(BEFORE, u, 50) === 'be2').length;
console.log('modulo: users moved = ' + moved(modAssign, BEFORE, AFTER, USERS));
console.log('ring(50): users moved = ' + moved((n, k) => ringAssign(n, k, 50), BEFORE, AFTER, USERS));
console.log('ring(50): users that were on be2 = ' + onBe2);`;

const CODE = codeQ({
  points: 2,
  prompt: B(
    `<p><b>Q21 — Why load balancers hash on a ring (chapter 10).</b> be2 is about to leave a pool of three. With plain <code>hash % N</code>, changing N re-maps almost everybody; on a ring, only be2's users should move. Prove it on 1,000 users with the given hash function.</p><ul><li><code>modAssign(nodes, key)</code> = <code>nodes[hash(key) % nodes.length]</code>.</li><li><code>ringAssign(nodes, key, vnodes)</code>: every node gets <code>vnodes</code> points <code>hash(node + "#" + v)</code>; sort by hash (ties by node name); the key goes to the first point with hash ≥ <code>hash(key)</code>, wrapping to the first point.</li><li><code>moved(assign, before, after, keys)</code>: how many keys get a different node.</li></ul><p>The printing block reports both counts and how many users were on be2: on a correct ring the last two numbers are equal. Keep the data, the hash and the printing block unchanged.</p>`,
    `<p><b>Câu 21 — Vì sao bộ cân bằng tải băm trên vòng (chương 10).</b> be2 sắp rời một pool ba máy. Với <code>hash % N</code> thường, đổi N là ánh xạ lại gần như mọi người; trên vòng băm, chỉ người dùng của be2 phải dời. Hãy chứng minh trên 1.000 người dùng với hàm băm cho sẵn.</p><ul><li><code>modAssign(nodes, key)</code> = <code>nodes[hash(key) % nodes.length]</code>.</li><li><code>ringAssign(nodes, key, vnodes)</code>: mỗi node có <code>vnodes</code> điểm <code>hash(node + "#" + v)</code>; sắp theo băm (bằng nhau thì theo tên node); khoá thuộc điểm đầu tiên có băm ≥ <code>hash(key)</code>, vòng về điểm đầu nếu không có.</li><li><code>moved(assign, before, after, keys)</code>: số khoá bị đổi node.</li></ul><p>Khối in báo cả hai con số và số người dùng từng ở be2: vòng băm đúng thì hai số cuối bằng nhau. Giữ nguyên dữ liệu, hàm băm và khối in.</p>`,
  ),
  given: GIVEN, stub: STUB, solution: SOLUTION, print: PRINT,
});

export default {
  course: { slug: 'networking-for-developers' },
  exams: [
    {
      kind: 'FE',
      code: 'PT3',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B('Progress Test 3 — Chapters 10–14 (load balancing, diagnosis, interviews, capstone, real-world networks)', 'Bài kiểm tra tiến độ 3 — Chương 10–14 (cân bằng tải, chẩn đoán, phỏng vấn, capstone, mạng thực chiến)'),
      description: B('20 multiple-choice questions built on real lab output, plus one coding task: modulo hashing versus a hash ring when a backend leaves.', '20 câu trắc nghiệm dựng trên output thật của lab, cộng một câu lập trình: băm modulo so với vòng băm khi một backend rời đi.'),
      durationMinutes: 50,
      totalPoints: 10,
      passMark: 5,
      shuffleQuestions: false,
      shuffleOptions: false,
      instructions: ptInstructions(3, '10–14'),
      isPublished: true,
      questions: [...Q, CODE],
    },
  ],
};
