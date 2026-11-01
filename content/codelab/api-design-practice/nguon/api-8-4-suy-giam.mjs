/** API Design · 8.6 — Suy giảm có chủ đích: bản cũ kèm Age + LabFlow-Degraded, 503 DEPENDENCY_DOWN, readiness, client đọc hợp đồng (output thật bài 8.6). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Degradation 1 — The database is down', kho: 'EASY', phut: 8,
  en: 'LabFlow with LABFLOW_CHAOS=1 after POST /chaos/db {"down":true}, lesson 8.6.',
  vi: 'LabFlow với LABFLOW_CHAOS=1 sau POST /chaos/db {"down":true}, bài 8.6.',
  cau: [
    q('c1', ['What did GET /v2/labs answer two seconds into the outage?', 'GET /v2/labs trả gì sau hai giây sự cố?'],
      ['200 with Age: 2 and LabFlow-Degraded: stale-data', '503 DEPENDENCY_DOWN with Retry-After: 30', '500 Internal Server Error', '200 with no extra headers'],
      ['A read with a safe fallback: the last good copy, labelled with its age, so the app can show “updating”.', 'Đọc có đường lùi an toàn: bản tốt gần nhất, dán nhãn tuổi của nó, để app hiện “đang cập nhật”.']),
    q('c2', ['During the outage, what did /health and /ready answer?', 'Trong sự cố, /health và /ready trả gì?'],
      ['/health 200, /ready 503 with Retry-After: 30', '/health 503 and /ready 503, both with Retry-After', '/health 503 (restart), /ready 200 (still routable)', 'Both 200, because the process is still running'],
      ['Liveness checks only the process (restart if dead); readiness includes dependencies (route around, no restart).', 'Liveness chỉ kiểm tiến trình (chết thì khởi động lại); readiness tính cả phụ thuộc (đi vòng, không khởi động lại).']),
    q('c3', ['The booking got 503 with Retry-After: 30, and the app’s time budget is 10 s. What should the app do?', 'Lượt đặt nhận 503 kèm Retry-After: 30, ngân sách thời gian của app là 10 giây. App nên làm gì?'],
      ['Stop now and tell the user it was not booked yet', 'Retry immediately until it succeeds', 'Wait 30 s silently, then retry', 'Show the booking as saved and sync later'],
      ['The wait is longer than the screen can afford; a clear message beats a 30-second spinner. Measured: the app stopped in 3 ms.', 'Thời gian chờ dài hơn màn hình chịu được; một thông báo rõ tốt hơn vòng xoay 30 giây. Đo được: app dừng sau 3 ms.']),
  ],
  goiY: [['Reads may be stale; writes must not pretend.', 'Đọc có thể cũ; ghi không được giả vờ.'], ['Liveness = restart; readiness = traffic.', 'Liveness = khởi động lại; readiness = lưu lượng.']],
  loi: [['Putting the database in the liveness probe.', 'Đưa CSDL vào liveness probe.'], ['Answering 2xx for a write that was not saved.', 'Trả 2xx cho lệnh ghi chưa được lưu.']],
  tns: [tn('graceful degradation', 'suy giảm có kiểm soát'), tn('readiness', 'sẵn sàng nhận lưu lượng')],
  kn: ['availability'],
});

function labsResponse(state) {
  const { down, lastAt, now } = state;
  if (!down) return { status: 200, headers: {} };
  if (lastAt === null) return { status: 503, headers: { 'Retry-After': '30' } };
  return { status: 200, headers: { Age: String(Math.floor((now - lastAt) / 1000)), 'LabFlow-Degraded': 'stale-data' } };
}
const E2 = jsBai({
  ten: 'Degradation 2 — Write labsResponse(state): the withLastGood contract', kho: 'EASY', phut: 10,
  en: `<p>Return what <code>GET /v2/labs</code> answers. <code>state</code> = <code>{ down, lastAt, now }</code> (times in ms; <code>lastAt</code> = when the last good copy was read, or <code>null</code>). Database up ⇒ <code>{ status: 200, headers: {} }</code>. Down and never read ⇒ <code>503</code> with <code>Retry-After: "30"</code>. Down with a copy ⇒ <code>200</code> with <code>Age</code> = whole seconds since <code>lastAt</code> (rounded down, as a string) and <code>LabFlow-Degraded: "stale-data"</code>.</p>`,
  vi: `<p>Trả thứ mà <code>GET /v2/labs</code> trả lời. <code>state</code> = <code>{ down, lastAt, now }</code> (thời gian tính ms; <code>lastAt</code> = lúc đọc được bản tốt gần nhất, hoặc <code>null</code>). CSDL chạy ⇒ <code>{ status: 200, headers: {} }</code>. Sập và chưa từng đọc được ⇒ <code>503</code> kèm <code>Retry-After: "30"</code>. Sập nhưng có bản sao ⇒ <code>200</code> kèm <code>Age</code> = số giây tròn kể từ <code>lastAt</code> (làm tròn xuống, dạng chuỗi) và <code>LabFlow-Degraded: "stale-data"</code>.</p>`,
  dauVao: ['state — { down: boolean, lastAt: number | null, now: number }', 'state — { down: boolean, lastAt: number | null, now: number }'],
  dauRa: ['{ status, headers }', '{ status, headers }'],
  goiY: [['Three cases, in this order: up, never read, stale.', 'Ba trường hợp, theo thứ tự: chạy, chưa từng đọc, bản cũ.'], ['Header values are strings.', 'Giá trị header là chuỗi.']],
  loi: [['Age in milliseconds.', 'Age tính bằng mili giây.'], ['Returning 200 with empty data when nothing was ever read.', 'Trả 200 với dữ liệu rỗng khi chưa từng đọc được gì.']],
  gt: ['Two seconds after the outage started: 200, Age "2", LabFlow-Degraded "stale-data" — exactly the curl output of lesson 8.6.', 'Hai giây sau khi sự cố bắt đầu: 200, Age "2", LabFlow-Degraded "stale-data" — đúng output curl của bài 8.6.'],
  kn: ['availability', 'HTTP'],
  tns: [tn('Age', 'số giây kể từ khi bản còn mới'), tn('stale data', 'dữ liệu cũ')],
  dau: `/** what GET /v2/labs answers while the database may be down */
function labsResponse(state) {
  // Write your solution here
  return state.down ? { status: 500, headers: {} } : { status: 200, headers: {} };
}
`,
  giai: '// Reference solution\n' + nguon(labsResponse),
  cases: [
    { goi: goi('labsResponse', { down: true, lastAt: 1000, now: 3400 }), moTa: ['Two seconds into the outage', 'Hai giây sau khi sự cố bắt đầu'] },
    { goi: goi('labsResponse', { down: false, lastAt: 1000, now: 3400 }), moTa: ['Database up', 'CSDL đang chạy'] },
    { goi: goi('labsResponse', { down: true, lastAt: null, now: 50 }), an: true },
    { goi: goi('labsResponse', { down: true, lastAt: 0, now: 999 }), an: true },
    { goi: goi('labsResponse', { down: true, lastAt: 5000, now: 125000 }), an: true },
  ],
});

function clientDecision(res, elapsedMs, budgetMs) {
  if (res.status !== 503 && res.status !== 429) return { action: res.headers['labflow-degraded'] ? 'show-stale' : 'show' };
  const ra = Number(res.headers['retry-after']);
  const waitMs = 1000 * (Number.isFinite(ra) && ra >= 0 ? ra : 1);
  if (elapsedMs + waitMs > budgetMs) return { action: 'fail' };
  return { action: 'retry', waitMs };
}
const E3 = jsBai({
  ten: 'Degradation 3 — Write clientDecision(res, elapsedMs, budgetMs)', kho: 'MEDIUM', phut: 15,
  en: `<p>The app side of the contract. <code>res</code> = <code>{ status, headers }</code> with lower-case header names. Not 503/429 ⇒ <code>{ action: 'show-stale' }</code> if <code>labflow-degraded</code> is present, else <code>{ action: 'show' }</code>. On 503 or 429: wait <code>retry-after</code> seconds (missing or not a number ≥ 0 ⇒ 1 s). If <code>elapsedMs</code> + that wait would exceed <code>budgetMs</code> ⇒ <code>{ action: 'fail' }</code>; otherwise <code>{ action: 'retry', waitMs }</code>.</p>`,
  vi: `<p>Phía app của hợp đồng. <code>res</code> = <code>{ status, headers }</code> với tên header chữ thường. Không phải 503/429 ⇒ <code>{ action: 'show-stale' }</code> nếu có <code>labflow-degraded</code>, ngược lại <code>{ action: 'show' }</code>. Gặp 503 hoặc 429: chờ <code>retry-after</code> giây (thiếu hoặc không phải số ≥ 0 ⇒ 1 giây). Nếu <code>elapsedMs</code> + thời gian chờ đó vượt <code>budgetMs</code> ⇒ <code>{ action: 'fail' }</code>; ngược lại <code>{ action: 'retry', waitMs }</code>.</p>`,
  dauVao: ['res — { status, headers }; elapsedMs, budgetMs — numbers', 'res — { status, headers }; elapsedMs, budgetMs — số'],
  dauRa: ['{ action: "show" | "show-stale" | "fail" } | { action: "retry", waitMs }', '{ action: "show" | "show-stale" | "fail" } | { action: "retry", waitMs }'],
  goiY: [['Retry-After is in seconds; waitMs is milliseconds.', 'Retry-After tính bằng giây; waitMs là mili giây.'], ['Check the budget BEFORE deciding to wait.', 'Kiểm ngân sách TRƯỚC khi quyết định chờ.']],
  loi: [['Retrying a 503 immediately in a loop.', 'Thử lại 503 ngay trong một vòng lặp.'], ['Waiting 30 s on a screen that can only wait 10.', 'Chờ 30 giây ở màn hình chỉ chịu được 10.']],
  gt: ['Lesson 8.6: four 503 OVERLOADED with Retry-After: 1 were waited out (in at 4.1 s); one 503 DEPENDENCY_DOWN with Retry-After: 30 failed at once against a 10 s budget.', 'Bài 8.6: bốn lần 503 OVERLOADED kèm Retry-After: 1 được chờ qua (vào lúc 4,1 giây); một lần 503 DEPENDENCY_DOWN kèm Retry-After: 30 dừng ngay với ngân sách 10 giây.'],
  kn: ['availability', 'client design'],
  tns: [tn('time budget', 'ngân sách thời gian'), tn('Retry-After', 'chờ bao lâu rồi thử lại')],
  dau: `/** what the app does with this response */
function clientDecision(res, elapsedMs, budgetMs) {
  // Write your solution here
  if (res.status >= 500) return { action: 'retry', waitMs: 0 };
  return { action: 'show' };
}
`,
  giai: '// Reference solution\n' + nguon(clientDecision),
  cases: [
    { goi: goi('clientDecision', { status: 503, headers: { 'retry-after': '1' } }, 34, 10000), moTa: ['503 OVERLOADED during the flood', '503 OVERLOADED trong đợt dồn'] },
    { goi: goi('clientDecision', { status: 503, headers: { 'retry-after': '30' } }, 3, 10000), moTa: ['503 DEPENDENCY_DOWN', '503 DEPENDENCY_DOWN'] },
    { goi: goi('clientDecision', { status: 200, headers: { 'labflow-degraded': 'stale-data', age: '1' } }, 74, 10000), an: true },
    { goi: goi('clientDecision', { status: 429, headers: {} }, 9500, 10000), an: true },
    { goi: goi('clientDecision', { status: 429, headers: { 'retry-after': 'soon' } }, 0, 10000), an: true },
    { goi: goi('clientDecision', { status: 201, headers: {} }, 4087, 10000), an: true },
  ],
});

export default doiDau({ slug: 'api-8-4-suy-giam', ten: '8.6 Degrading on purpose and readiness', khoa: KHOA, baiHoc: 'api-8-4-suy-giam', de: [E1, E2, E3] });
