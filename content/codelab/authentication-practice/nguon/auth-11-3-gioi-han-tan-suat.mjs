/** Authentication · 11.3 — Rate limiting; write effectiveLimit for the in-memory-counter bug. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: '11.3-1 — The counter must be shared', kho: 'EASY', phut: 8,
  en: 'A rate-limit counter in process memory lets N instances allow N times the limit; it must be shared (Redis), fail open, and tell the client.',
  vi: 'Một cái đếm giới hạn trong bộ nhớ tiến trình để N instance cho N lần giới hạn; nó phải chung (Redis), hỏng mở, và báo client.',
  cau: [
    q('c1', ['An in-memory limiter is set to 100/min on 4 instances. What is the real limit?', 'Một bộ giới hạn trong bộ nhớ đặt 100/phút trên 4 instance. Giới hạn thật là bao nhiêu?'],
      ['About 400/min — each instance counts only its own share of the traffic; share one counter in Redis', 'Exactly 100/min — the load balancer keeps every instance consistent', '25/min — the limit is divided evenly across the four instances', 'Unlimited — an in-memory counter does not actually count anything'],
      ['Each node allows up to 100 of its ~1/4 of traffic ⇒ ~400; the counter must be shared (11.3).', 'Mỗi node cho tới 100 của ~1/4 lưu lượng ⇒ ~400; cái đếm phải chung (11.3).']),
    q('c2', ['Redis (the rate-limit store) goes down. What should the limiter do?', 'Redis (kho giới hạn) sập. Bộ giới hạn nên làm gì?'],
      ['Fail open — allow the request — because failing closed turns a cache outage into a total login outage', 'Block every request until Redis recovers, to stay on the safe side', 'Crash the process so the load balancer removes the instance', 'Silently drop the request without any status code'],
      ['Failing closed means nobody can log in when the counter cannot be read; fail open (11.3).', 'Hỏng đóng nghĩa là không ai đăng nhập được khi cái đếm không đọc được; hỏng mở (11.3).']),
    q('c3', ['How should the client learn it is being rate-limited?', 'Client nên biết nó đang bị giới hạn ra sao?'],
      ['A 429 response with a Retry-After header, so a well-behaved client backs off instead of retrying harder', 'A plain 500 Internal Server Error, so the client simply knows that something somewhere went wrong', 'A 200 OK with an empty response body, to avoid alarming the client or revealing the rate limit', 'No response at all — just drop the connection so the attacker learns nothing about the limit'],
      ['A limit the client cannot see is one it cannot back off from; return 429 + Retry-After (11.3).', 'Một giới hạn client không thấy là một cái nó không lùi được; trả 429 + Retry-After (11.3).']),
  ],
  goiY: [['Each instance counts only its own slice of traffic.', 'Mỗi instance chỉ đếm lát lưu lượng của nó.'], ['The protection must never become the outage.', 'Bảo vệ không bao giờ được thành sự cố.']],
  loi: [['Using an in-memory counter across many instances.', 'Dùng một cái đếm trong bộ nhớ qua nhiều instance.'], ['Failing closed when the store is down.', 'Hỏng đóng khi kho sập.']],
  tns: [tn('shared counter', 'cái đếm chung'), tn('fail open', 'hỏng mở')],
  kn: ['authentication'],
});

function effectiveLimit(limit, instances) {
  // The in-memory-counter bug: with N instances, each enforces the full limit on its own share, so the real
  // cap across the fleet is limit × instances. A non-positive instance count means a bad config ⇒ just the limit.
  if (!Number.isFinite(instances) || instances < 1) return limit;
  return limit * instances;
}
const S2 = jsBai({
  ten: '11.3-2 — Write effectiveLimit(limit, instances): the real cap', kho: 'EASY', phut: 8,
  en: `<p>With an in-memory counter, each of <code>instances</code> nodes enforces the full <code>limit</code> on its own share of the traffic, so the real cap across the fleet is <code>limit × instances</code>. Return that. If <code>instances</code> is not a finite number ≥ 1, return just <code>limit</code> (a single process, or a bad config).</p>`,
  vi: `<p>Với một cái đếm trong bộ nhớ, mỗi trong <code>instances</code> node thực thi trọn <code>limit</code> trên phần lưu lượng của nó, nên trần thật trên cả cụm là <code>limit × instances</code>. Trả cái đó. Nếu <code>instances</code> không phải một số hữu hạn ≥ 1, trả chỉ <code>limit</code> (một tiến trình, hoặc một cấu hình sai).</p>`,
  goiY: [['Multiply the limit by the instance count.', 'Nhân giới hạn với số instance.'], ['Guard a non-finite or < 1 instance count.', 'Chặn một số instance không hữu hạn hoặc < 1.']],
  loi: [['Returning the limit unchanged for many instances.', 'Trả giới hạn không đổi cho nhiều instance.'], ['Crashing or returning NaN for a bad instance count.', 'Sập hoặc trả NaN cho một số instance sai.']],
  gt: ['The in-memory limiter leaks the limit by a factor of N; a shared counter (Redis) holds the real cap (11.3).', 'Bộ giới hạn trong bộ nhớ để lọt giới hạn gấp N lần; một cái đếm chung (Redis) giữ trần thật (11.3).'],
  kn: ['authentication'], tns: [tn('fixed window', 'cửa sổ cố định')],
  dau: `/** ⇒ the real per-minute cap across the fleet with an in-memory counter */
function effectiveLimit(limit, instances) {
  // Write your solution here
  return limit;
}
`,
  giai: '// Reference solution\n' + nguon(effectiveLimit),
  cases: [
    { goi: goi('effectiveLimit', 100, 4), moTa: ['100 × 4 ⇒ 400', '100 × 4 ⇒ 400'] },
    { goi: goi('effectiveLimit', 100, 1), an: true, moTa: ['single instance ⇒ 100', 'một instance ⇒ 100'] },
    { goi: goi('effectiveLimit', 50, 0), an: true, moTa: ['bad count ⇒ just the limit', 'số sai ⇒ chỉ giới hạn'] },
    { goi: goi('effectiveLimit', 30, 10), an: true, moTa: ['30 × 10 ⇒ 300', '30 × 10 ⇒ 300'] },
  ],
});

const S3 = cs({
  ten: '11.3-3 — Rate-limit choice → why', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each rate-limit design choice to the reason for it.',
  vi: 'Ghép mỗi lựa chọn thiết kế giới hạn tần suất với lý do của nó.',
  bang: [bang1('b1', ['Choice → reason', 'Lựa chọn → lý do'], [{ ma: 'x', ten: 'Choice' }, { ma: 'q', ten: 'Reason', luaChon: ['so the limit holds across instances', 'so a cache outage is not a login outage', 'so the client can back off'] }], [
    { o: { x: 'counter in Redis' }, a: { q: 'so the limit holds across instances' } },
    { o: { x: 'fail open' }, a: { q: 'so a cache outage is not a login outage' } },
    { o: { x: '429 + Retry-After' }, a: { q: 'so the client can back off' } },
  ], ['Shared counter holds the limit; fail open keeps logins working; 429 + Retry-After lets the client wait (11.3).', 'Cái đếm chung giữ giới hạn; hỏng mở giữ đăng nhập chạy; 429 + Retry-After để client đợi (11.3).'])],
  goiY: [['One choice is about scaling, one about resilience, one about the client.', 'Một lựa chọn về mở rộng, một về chịu lỗi, một về client.'], ['Failing open protects availability.', 'Hỏng mở bảo vệ tính sẵn sàng.']],
  loi: [['Matching Redis to the client back-off reason.', 'Ghép Redis với lý do client lùi lại.'], ['Thinking 429 is about scaling.', 'Tưởng 429 về mở rộng.']],
  tns: [tn('Retry-After', 'Retry-After')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-11-3-gioi-han-tan-suat', ten: '11.3 Rate limiting', khoa: KHOA, baiHoc: 'auth-11-3-gioi-han-tan-suat', de: [S1, S2, S3] });
