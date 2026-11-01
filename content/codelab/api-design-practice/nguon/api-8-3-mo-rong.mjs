/** API Design · 8.4 — Mở rộng ngang: hai instance sau round-robin, trạng thái trong RAM, giành khoá idempotency nguyên tử (output thật bài 8.4). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Scale-out 1 — What broke behind the load balancer', kho: 'EASY', phut: 8,
  en: 'Two LabFlow instances (A :4001, B :4002) behind perf/proxy-rr.mjs, lesson 8.4.',
  vi: 'Hai bản LabFlow (A :4001, B :4002) sau perf/proxy-rr.mjs, bài 8.4.',
  cau: [
    q('c1', ['With two instances and in-memory state, which of these kept working?', 'Với hai bản và trạng thái trong RAM, thứ nào vẫn chạy?'],
      ['JWT: logged in on A, accepted by B', 'Idempotency-Key: the same key gave one 201', 'The booking limit of 5 per minute', 'Booking IDs: every bk_ number unique'],
      ['The token carries its own claims and the secret is shared configuration. The others lived in one process’s RAM: two 201s for one key, 8/8 bookings past a limit of 5, two different bk_1.', 'Token tự mang thông tin và khoá bí mật là cấu hình dùng chung. Những thứ kia nằm trong RAM một tiến trình: hai 201 cho một khoá, 8/8 lượt đặt vượt giới hạn 5, hai bk_1 khác nhau.']),
    q('c2', ['After B was killed, the proxy returned 502 200 502 200. What do real load balancers add?', 'Sau khi tắt B, proxy trả 502 200 502 200. Bộ cân bằng tải thật thêm gì?'],
      ['Health checks, and retries only for requests that are safe to repeat', 'Sticky sessions so each user stays on A', 'A retry of every failed request, POST included', 'Nothing — 502 is the correct contract'],
      ['A POST without an idempotency key may already have been done by the dead instance; resending it can book twice.', 'POST không có khoá idempotency có thể đã được bản chết làm xong; gửi lại có thể đặt hai lần.']),
    q('c3', ['Why are sticky sessions not the fix?', 'Vì sao sticky session không phải cách sửa?'],
      ['State is lost on every restart, load is uneven, and users on different instances can still double-book', 'They are not supported by HTTP/1.1, only by HTTP/2 and HTTP/3 connections', 'They make JWT stop working because the token is bound to one instance', 'They double every rate limit, since each instance counts each user twice'],
      ['The Twelve-Factor App: processes are stateless and share-nothing; persistent data goes to a backing service.', 'The Twelve-Factor App: tiến trình không trạng thái, không chia sẻ; dữ liệu cần giữ đi vào dịch vụ phía sau.']),
  ],
  goiY: [['Ask: where does this piece of state live?', 'Hỏi: mẩu trạng thái này nằm ở đâu?'], ['Which requests are safe to repeat?', 'Request nào lặp lại an toàn?']],
  loi: [['Thinking “stateless” means “no database”.', 'Tưởng “không trạng thái” là “không có CSDL”.'], ['Retrying POST at the load balancer without idempotency.', 'Thử lại POST ở bộ cân bằng tải khi chưa có idempotency.']],
  tns: [tn('stateless', 'không trạng thái'), tn('load balancer', 'bộ cân bằng tải')],
  kn: ['scalability'],
});

function roundRobin(instances, n, down = []) {
  const up = instances.filter((x) => !down.includes(x));
  const out = [];
  let i = 0;
  for (let k = 0; k < n; k++) {
    if (up.length === 0) { out.push(null); continue; }
    out.push(up[i % up.length]);
    i++;
  }
  return out;
}
const E2 = jsBai({
  ten: 'Scale-out 2 — Write roundRobin(instances, n, down)', kho: 'EASY', phut: 10,
  en: `<p>A load balancer with health checks. Send <code>n</code> requests in turn to the instances that are <em>not</em> in <code>down</code>, in their original order, starting from the first healthy one. Return the instance chosen for each request; if every instance is down, that request gets <code>null</code> (the balancer would answer 503).</p>`,
  vi: `<p>Bộ cân bằng tải có kiểm tra sức khoẻ. Gửi lần lượt <code>n</code> request cho các bản <em>không</em> nằm trong <code>down</code>, theo thứ tự ban đầu, bắt đầu từ bản khoẻ đầu tiên. Trả bản được chọn cho từng request; nếu mọi bản đều chết thì request đó nhận <code>null</code> (bộ cân bằng tải sẽ trả 503).</p>`,
  dauVao: ['instances — string[]; n — number; down — string[]', 'instances — string[]; n — số; down — string[]'],
  dauRa: ['(string | null)[] of length n', '(string | null)[] dài n'],
  goiY: [['Filter the healthy ones first.', 'Lọc các bản khoẻ trước.'], ['Use a counter modulo the number of healthy instances.', 'Dùng bộ đếm chia lấy dư cho số bản khoẻ.']],
  loi: [['Rotating over all instances and sending to a dead one — the 502s of lesson 8.4.', 'Xoay vòng trên mọi bản và gửi tới bản chết — chính các 502 của bài 8.4.'], ['Dividing by zero when every instance is down.', 'Chia cho 0 khi mọi bản đều chết.']],
  gt: ['With B down, every request goes to A — no 502 for the client.', 'B chết thì mọi request đi A — client không gặp 502.'],
  kn: ['scalability', 'load balancing'],
  tns: [tn('round-robin', 'chia lần lượt'), tn('health check', 'kiểm tra sức khoẻ')],
  dau: `/** which instance gets each of n requests */
function roundRobin(instances, n, down = []) {
  // Write your solution here
  const out = [];
  for (let k = 0; k < n; k++) out.push(instances[k % instances.length]);
  return out;
}
`,
  giai: '// Reference solution\n' + nguon(roundRobin),
  cases: [
    { goi: goi('roundRobin', ['A', 'B'], 4), moTa: ['Both healthy', 'Cả hai khoẻ'] },
    { goi: goi('roundRobin', ['A', 'B'], 4, ['B']), moTa: ['B was killed', 'B bị tắt'] },
    { goi: goi('roundRobin', ['A', 'B', 'C'], 5, ['A']), an: true },
    { goi: goi('roundRobin', ['A', 'B'], 2, ['A', 'B']), an: true },
    { goi: goi('roundRobin', ['A'], 0), an: true },
  ],
});

function claim(rows, scope, key, fp) {
  const e = rows.find((r) => r.scope === scope && r.key === key);
  if (!e) return { result: 'won', rows: [...rows, { scope, key, fp, state: 'running' }] };
  if (e.fp !== fp) return { result: 422, rows };
  if (e.state === 'running') return { result: 409, rows };
  return { result: 'replay', rows };
}
const E3 = jsBai({
  ten: 'Scale-out 3 — Write claim(rows, scope, key, fp): the shared idempotency table', kho: 'MEDIUM', phut: 15,
  en: `<p>Model <code>INSERT … ON CONFLICT DO NOTHING</code> on the shared table <code>idempotency_keys</code> (primary key <code>scope, key</code>). <code>rows</code> is the table now. If no row has the same scope and key, the caller <strong>wins</strong>: return <code>{ result: 'won', rows }</code> with a new row <code>{ scope, key, fp, state: 'running' }</code> appended (do not modify the input array). Otherwise the existing row decides: different <code>fp</code> ⇒ <code>422</code>; <code>state</code> running ⇒ <code>409</code>; done ⇒ <code>'replay'</code>. In those cases return the rows unchanged.</p>`,
  vi: `<p>Mô phỏng <code>INSERT … ON CONFLICT DO NOTHING</code> trên bảng dùng chung <code>idempotency_keys</code> (khoá chính <code>scope, key</code>). <code>rows</code> là bảng hiện tại. Nếu không có dòng nào cùng scope và key, bên gọi <strong>thắng</strong>: trả <code>{ result: 'won', rows }</code> với dòng mới <code>{ scope, key, fp, state: 'running' }</code> nối vào cuối (không sửa mảng đầu vào). Ngược lại dòng đã có quyết định: <code>fp</code> khác ⇒ <code>422</code>; <code>state</code> running ⇒ <code>409</code>; done ⇒ <code>'replay'</code>. Các trường hợp đó trả rows không đổi.</p>`,
  dauVao: ['rows — [{ scope, key, fp, state }]; scope, key, fp — strings', 'rows — [{ scope, key, fp, state }]; scope, key, fp — chuỗi'],
  dauRa: ['{ result: "won" | "replay" | 409 | 422, rows }', '{ result: "won" | "replay" | 409 | 422, rows }'],
  goiY: [['Find by BOTH scope and key — the primary key has two columns.', 'Tìm theo CẢ scope lẫn key — khoá chính có hai cột.'], ['[...rows, newRow] keeps the input unchanged.', '[...rows, newRow] giữ nguyên đầu vào.']],
  loi: [['Matching on key only: Lan’s key would block An’s identical key.', 'Chỉ so key: khoá của cô Lan sẽ chặn khoá trùng chữ của An.'], ['Checking state before fp — a different body must be 422 even while running.', 'Xét state trước fp — body khác phải là 422 kể cả khi đang chạy.']],
  gt: ['Lesson 8.4: B won (bk_1), A got “replay” with Idempotent-Replayed: true — one booking for two instances.', 'Bài 8.4: B thắng (bk_1), A nhận “replay” kèm Idempotent-Replayed: true — một lượt đặt cho hai bản.'],
  kn: ['idempotency', 'concurrency'],
  tns: [tn('atomic claim', 'giành khoá nguyên tử'), tn('ON CONFLICT DO NOTHING', 'chèn, trùng khoá thì bỏ qua')],
  dau: `/** model INSERT … ON CONFLICT DO NOTHING on idempotency_keys */
function claim(rows, scope, key, fp) {
  // Write your solution here
  rows.push({ scope, key, fp, state: 'running' });
  return { result: 'won', rows };
}
`,
  giai: '// Reference solution\n' + nguon(claim),
  cases: [
    { goi: goi('claim', [], 'usr_3', 'dat-phong-lan-01', 'f1'), moTa: ['First request (B)', 'Request đầu (B)'] },
    { goi: goi('claim', [{ scope: 'usr_3', key: 'dat-phong-lan-01', fp: 'f1', state: 'done' }], 'usr_3', 'dat-phong-lan-01', 'f1'), moTa: ['The retry on A', 'Lần gửi lại ở A'] },
    { goi: goi('claim', [{ scope: 'usr_3', key: 'k', fp: 'f1', state: 'running' }], 'usr_3', 'k', 'f1'), an: true },
    { goi: goi('claim', [{ scope: 'usr_3', key: 'k', fp: 'f1', state: 'running' }], 'usr_3', 'k', 'f2'), an: true },
    { goi: goi('claim', [{ scope: 'usr_3', key: 'k', fp: 'f1', state: 'done' }], 'usr_1', 'k', 'f9'), an: true },
  ],
});

export default doiDau({ slug: 'api-8-3-mo-rong', ten: '8.4 Designing APIs that scale out', khoa: KHOA, baiHoc: 'api-8-3-mo-rong', de: [E1, E2, E3] });
