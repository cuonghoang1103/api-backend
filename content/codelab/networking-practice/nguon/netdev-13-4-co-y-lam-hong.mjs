/**
 * Networking for Developers · Chương 13 (dự án cuối khoá) — bộ luyện chương, gắn bài 13.4 "Cố tình làm hỏng rồi chẩn đoán"
 * (netdev-13-4-co-y-lam-hong). Dữ liệu thật: lab/out/c132-measure (curl -w qua cả stack), c133-toiuu (67092 B → 1809 B khi gzip; MISS 3,01 s
 * → HIT 0,0006 s), c134-break (504, 502, refused). Bằng chứng ở ca ẩn của bài viết hàm là DỰNG theo đúng các lớp của bài.
 */
import { doiDau, KHOA, tn, jsBai, nguon, goi, ra, sauLenh, pre, cs, tinh, ord, bang1, mt, q, soNhan } from './_net.mjs';

const T = (tep) => ra(tep).split('\n').map((d) => d.replace(/\r$/, ''));
const MEASURE = sauLenh('c132-measure', 'curl -s -o /dev/null -w')[0];
const SZ = T('c133-toiuu').filter((d) => /bytes$/.test(d) && !/^\$/.test(d)).map((d) => Number(d.match(/(\d+) bytes/)[1]));
const TM = T('c133-toiuu').filter((d) => /^\s+time=/.test(d)).map((d) => Number(d.match(/time=([\d.]+)s/)[1]));
const BREAK = T('c134-break').filter((d) => /->|Connection/.test(d) && !/^(\$|==)/.test(d)).map((d) => d.trim());
if (!/size=67092/.test(MEASURE) || SZ.join() !== '67092,1809' || TM.length !== 2 || BREAK.length !== 4) throw new Error('Ch13: output thật đổi — xem lại đề');

const E1 = tinh({
  tieuDe: 'Capstone 1 — What did each optimisation buy, in numbers?', doKho: 'MEDIUM', phut: 10,
  moTa: mt(`Lesson 13.3 measured before and after on the capstone stack, for real:${pre([MEASURE, `no-gzip ${SZ[0]} bytes · gzip ${SZ[1]} bytes`, `edge cache MISS time=${TM[0]}s · HIT time=${TM[1]}s`])}Compute the two ratios (one decimal place).`, `Bài 13.3 đo trước và sau trên stack capstone, thật:${pre([MEASURE, `no-gzip ${SZ[0]} bytes · gzip ${SZ[1]} bytes`, `edge cache MISS time=${TM[0]}s · HIT time=${TM[1]}s`])}Tính hai tỉ lệ (một chữ số thập phân).`),
  loai: 'table',
  bang: [bang1('b1', ['Before ÷ after', 'Trước ÷ sau'], [{ ma: 'x', ten: 'Optimisation' }, { ma: 'r', ten: 'Ratio (×)' }], [
    { o: { x: 'gzip: bytes without ÷ bytes with' }, a: { r: soNhan(SZ[0] / SZ[1], 1) } },
    { o: { x: 'edge cache: MISS time ÷ HIT time' }, a: { r: soNhan(TM[0] / TM[1], 1) } },
  ], [`${SZ[0]} / ${SZ[1]} ≈ ${(SZ[0] / SZ[1]).toFixed(1)}× fewer bytes — text compresses extremely well, and fewer bytes is fewer round trips under slow start. ${TM[0]} / ${TM[1]} ≈ ${(TM[0] / TM[1]).toFixed(1)}× faster: a HIT never touches the 3-second origin. Both numbers came from measuring before and after; an optimisation without a before/after measurement is a guess.`, `${SZ[0]} / ${SZ[1]} ≈ ${(SZ[0] / SZ[1]).toFixed(1)} lần ít byte hơn — văn bản nén cực tốt, và ít byte hơn là ít vòng khứ hồi hơn trong giai đoạn slow start. ${TM[0]} / ${TM[1]} ≈ ${(TM[0] / TM[1]).toFixed(1)} lần nhanh hơn: một lần HIT không bao giờ chạm tới origin 3 giây. Cả hai con số đều đến từ việc đo trước và sau; tối ưu mà không có số đo trước/sau là phỏng đoán.`])],
  goiY: ['Divide the before by the after.', 'Round to one decimal place.'],
  loiHayGap: ['Dividing after by before and reporting 0.0.', 'Reporting the percentage saved instead of the ratio.'],
  thuatNgu: [tn('before/after measurement', 'đo trước/sau')], khaiNiem: ['optimisation'],
});

function incidentLayer(e) {
  // Ask every layer bottom-up; the first one that fails names itself.
  if (e.dns === 'nxdomain') return { layer: 'dns', fix: 'fix the DNS record' };
  if (e.dns === 'wrong-ip') return { layer: 'dns', fix: 'point the record at the right address' };
  if (e.port === 'timeout') return { layer: 'path', fix: 'open the firewall / fix the route' };
  if (e.port === 'refused') return { layer: 'port', fix: 'start the service or bind it to the right address' };
  if (e.tls === 'expired') return { layer: 'tls', fix: 'renew the certificate' };
  if (e.tls === 'chain') return { layer: 'tls', fix: 'serve the full chain' };
  if (e.http === 502) return { layer: 'upstream', fix: 'bring the backend up' };
  if (e.http === 504) return { layer: 'upstream', fix: 'speed up the backend or move the work to a job' };
  if (e.http === 503) return { layer: 'capacity', fix: 'restore healthy capacity' };
  if (e.http === 404) return { layer: 'deploy', fix: 'deploy the build that mounts the route' };
  return { layer: 'none', fix: 'healthy' };
}
const OK = { dns: 'ok', port: 'open', tls: 'ok', http: 200 };
const E2 = jsBai({
  ten: 'Capstone 2 — Write incidentLayer(evidence): let the failing layer name itself', kho: 'MEDIUM', phut: 20,
  en: `<p>Lesson 13.4 broke the capstone on purpose and read it back, for real:</p>${pre(BREAK)}<p>Write <code>incidentLayer(evidence)</code>. <code>evidence</code> has <code>dns</code> (<code>"ok" | "nxdomain" | "wrong-ip"</code>), <code>port</code> (<code>"open" | "refused" | "timeout"</code>), <code>tls</code> (<code>"ok" | "expired" | "chain"</code>) and <code>http</code> (a status code). Check bottom-up and return the first failure as <code>{ layer, fix }</code>:</p>
<ol>
<li>dns nxdomain ⇒ dns / "fix the DNS record"; wrong-ip ⇒ dns / "point the record at the right address"</li>
<li>port timeout ⇒ path / "open the firewall / fix the route"; refused ⇒ port / "start the service or bind it to the right address"</li>
<li>tls expired ⇒ tls / "renew the certificate"; chain ⇒ tls / "serve the full chain"</li>
<li>http 502 ⇒ upstream / "bring the backend up"; 504 ⇒ upstream / "speed up the backend or move the work to a job"; 503 ⇒ capacity / "restore healthy capacity"; 404 ⇒ deploy / "deploy the build that mounts the route"</li>
<li>otherwise none / "healthy"</li>
</ol>`,
  vi: `<p>Bài 13.4 cố tình làm hỏng capstone rồi đọc lại, thật:</p>${pre(BREAK)}<p>Viết <code>incidentLayer(evidence)</code>. <code>evidence</code> có <code>dns</code> (<code>"ok" | "nxdomain" | "wrong-ip"</code>), <code>port</code> (<code>"open" | "refused" | "timeout"</code>), <code>tls</code> (<code>"ok" | "expired" | "chain"</code>) và <code>http</code> (mã trạng thái). Kiểm từ dưới lên và trả lỗi đầu tiên dạng <code>{ layer, fix }</code> (chuỗi <code>fix</code> giữ nguyên tiếng Anh):</p>
<ol>
<li>dns nxdomain ⇒ dns / "fix the DNS record"; wrong-ip ⇒ dns / "point the record at the right address"</li>
<li>port timeout ⇒ path / "open the firewall / fix the route"; refused ⇒ port / "start the service or bind it to the right address"</li>
<li>tls expired ⇒ tls / "renew the certificate"; chain ⇒ tls / "serve the full chain"</li>
<li>http 502 ⇒ upstream / "bring the backend up"; 504 ⇒ upstream / "speed up the backend or move the work to a job"; 503 ⇒ capacity / "restore healthy capacity"; 404 ⇒ deploy / "deploy the build that mounts the route"</li>
<li>còn lại none / "healthy"</li>
</ol>`,
  dau: 'function incidentLayer(e) {\n  return { layer: "none", fix: "healthy" };\n}\n',
  giai: nguon(incidentLayer),
  cases: [
    { goi: goi('incidentLayer', { ...OK, http: 504 }) },
    { goi: goi('incidentLayer', { ...OK, http: 502 }) },
    { goi: goi('incidentLayer', { ...OK, port: 'refused', http: 0 }) },
    { goi: goi('incidentLayer', { dns: 'nxdomain', port: 'timeout', tls: 'expired', http: 0 }), an: true },
    { goi: goi('incidentLayer', { ...OK, tls: 'chain', http: 0 }), an: true },
    { goi: goi('incidentLayer', { ...OK, port: 'timeout', http: 0 }), an: true },
    { goi: goi('incidentLayer', { ...OK, http: 404 }), an: true },
    { goi: goi('incidentLayer', OK), an: true },
  ],
  goiY: [['One early return per failure, in the order given.', 'Mỗi lỗi một lệnh return sớm, theo đúng thứ tự đã cho.'], ['A broken lower layer makes the upper evidence meaningless — never look at http if the port is closed.', 'Tầng dưới đã hỏng thì bằng chứng ở tầng trên vô nghĩa — đừng nhìn http khi cổng còn đóng.']],
  loi: [['Reporting the 404 when DNS already failed.', 'Báo lỗi 404 trong khi DNS đã hỏng từ trước.'], ['Treating refused and timeout as the same port problem.', 'Coi refused và timeout là cùng một lỗi cổng.']],
  gt: ['The layered method turns "the site is down" into one sentence with a cause: the first layer whose evidence is bad. Everything below it is proven good, everything above it is not worth reading yet. That sentence is the core of the incident report the lesson asks for.', 'Phương pháp theo tầng biến "trang sập rồi" thành một câu có nguyên nhân: tầng đầu tiên có bằng chứng xấu. Mọi thứ dưới nó đã được chứng minh tốt, mọi thứ trên nó chưa đáng đọc. Câu đó là lõi của bản báo cáo sự cố mà bài học yêu cầu.'],
  kn: ['layered diagnosis', 'incident report'],
});

const E3 = tinh({
  tieuDe: 'Capstone 3 — An incident report that prevents the next one', doKho: 'EASY', phut: 6,
  moTa: mt('Lesson 13.4\'s deliverable. Put the sections of an incident report in order.', 'Sản phẩm phải nộp của bài 13.4. Xếp các phần của một bản báo cáo sự cố theo thứ tự.'),
  loai: 'order',
  cauHoi: [ord('q1', ['Incident report', 'Báo cáo sự cố'], ['Symptom: who saw what, where, since when', 'Diagnosis: the layer, and the measurement that pinned it', 'Fix: what was changed, and the proof it worked', 'Prevention: the alert, timeout or health check that catches it next time'], ['A report that ends at the fix leaves the same failure waiting for the next on-call. The prevention line — "add a TTFB alert", "move the slow report to a background job" — is what makes it worth writing.', 'Bản báo cáo dừng ở cách sửa thì cùng lỗi đó vẫn chờ người trực tiếp theo. Dòng phòng ngừa — "thêm cảnh báo TTFB", "chuyển báo cáo chậm sang job nền" — mới là thứ khiến nó đáng viết.'])],
  goiY: ['Symptom before cause, cause before fix.', 'The last section looks forward, not back.'],
  loiHayGap: ['Writing the cause before the evidence that proves it.', 'Ending the report at "restarted the server".'],
  thuatNgu: [tn('postmortem', 'báo cáo sau sự cố')], khaiNiem: ['incident report'],
});

const E4 = cs({
  ten: 'Capstone 4 — More failures to reason about', kho: 'HARD', phut: 10,
  en: 'The failure modes of lesson 13.4 that the lab describes but does not run, plus the optimisations of 13.3.',
  vi: 'Các kiểu hỏng của bài 13.4 mà lab mô tả nhưng không chạy, cùng các tối ưu của bài 13.3.',
  cau: [
    q('c1', ['After an office firewall change, HTTP/3 stops working but the site still loads. Which layer, and what next?', 'Sau khi đổi tường lửa văn phòng, HTTP/3 ngừng chạy nhưng trang vẫn tải được. Tầng nào, và làm gì tiếp?'], ['Transport: UDP 443 is blocked; allow it or accept HTTP/2', 'TLS: the certificate expired', 'DNS: the record changed', 'Application: the code broke HTTP/3'], ['QUIC rides on UDP. A block there is a soft failure: browsers fall back to HTTP/2 over TCP, so the only symptom is "h2 where we expected h3".', 'QUIC chạy trên UDP. Chặn ở đó là hỏng mềm: trình duyệt lùi về HTTP/2 trên TCP, nên triệu chứng duy nhất là "h2 ở chỗ đáng lẽ là h3".']),
    q('c2', ['TTFB climbs with concurrency until the edge returns 504. Where is the fix?', 'TTFB tăng theo số người dùng đồng thời cho tới khi biên trả 504. Cách sửa nằm ở đâu?'], ['Application: the slow query or missing capacity', 'The CDN cache rules', 'The TCP congestion control algorithm', 'The DNS TTL'], ['504 says the backend is up but too slow; TTFB growing with load says it is the server\'s work. Fix the query, add capacity, or move the slow work to a background job.', '504 nói backend còn sống nhưng quá chậm; TTFB tăng theo tải nói đó là phần việc của server. Sửa truy vấn, thêm năng lực, hoặc chuyển việc chậm sang job nền.']),
    q('c3', ['Keep-alive, gzip, edge caching and a CDN all help. What do they have in common?', 'Keep-alive, gzip, cache ở biên và CDN đều giúp. Chúng có điểm chung gì?'], ['Fewer round trips, fewer bytes, or a shorter path', 'They all make the server CPU faster', 'They all require HTTP/3', 'They all reduce DNS lookups'], ['Keep-alive removes handshakes, gzip removes bytes, a cache removes the trip to the origin, a CDN shortens the distance. Latency, not bandwidth, is usually what users feel.', 'Keep-alive bỏ bớt bắt tay, gzip bỏ bớt byte, cache bỏ chuyến đi tới origin, CDN rút ngắn khoảng cách. Thứ người dùng cảm thấy thường là độ trễ, không phải băng thông.']),
    q('c4', ['Why break your own stack on purpose?', 'Vì sao nên tự tay làm hỏng stack của mình?'], ['So the first time you see a 502 is not at 2 a.m. in production', 'To lower the hosting bill', 'To test the CDN purge API', 'Because broken stacks deploy faster'], ['Inducing a failure with a known cause turns it into a shape you recognise in seconds. That is chaos engineering in miniature, and each induced failure should end with an alert that would have caught it.', 'Gây ra một lỗi có nguyên nhân đã biết biến nó thành một hình dạng bạn nhận ra trong vài giây. Đó là chaos engineering thu nhỏ, và mỗi lỗi tự gây ra nên kết thúc bằng một cảnh báo lẽ ra đã bắt được nó.']),
  ],
  goiY: [['Ask which layer each change touches.', 'Hỏi mỗi thay đổi chạm vào tầng nào.'], ['A soft failure degrades; a hard failure stops.', 'Hỏng mềm làm chậm đi; hỏng cứng làm dừng hẳn.']],
  loi: [['Treating a fallback to HTTP/2 as an outage.', 'Coi việc lùi về HTTP/2 là sự cố sập.'], ['Raising the edge timeout to "fix" a slow query.', 'Nâng timeout ở biên để "sửa" một truy vấn chậm.']],
  tns: [tn('chaos engineering', 'cố ý gây hỏng có kiểm soát'), tn('soft failure', 'hỏng mềm')], kn: ['failure modes'],
});

export default doiDau({ slug: 'netdev-13-4-co-y-lam-hong', ten: '13.4 Practice: measure, optimise, break and report', khoa: KHOA, baiHoc: 'netdev-13-4-co-y-lam-hong', de: [E1, E2, E3, E4] });
