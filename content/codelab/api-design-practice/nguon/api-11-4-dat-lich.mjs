/** API Design · 11.6 — Đặt lịch: bảng bằng chứng, cuộc đua 50 người, ràng buộc loại trừ, giữ chỗ hết hạn (output thật bài 11.6: interview/booking/race.mjs). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Booking 1 — Fifty students, one slot, measured', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 11.6: race.mjs on PostgreSQL 18.4 — 50 handlers book lab_1 14:00–16:00 at once — and the expiring-hold trap.',
  vi: 'Những điều từ bài 11.6: race.mjs trên PostgreSQL 18.4 — 50 handler cùng đặt lab_1 14:00–16:00 — và bẫy giữ chỗ hết hạn.',
  cau: [
    q('c1', ['“SELECT overlapping bookings, then INSERT” inside a Read Committed transaction, 50 handlers at once. Result?', '“SELECT lượt đặt chồng giờ, rồi INSERT” trong transaction Read Committed, 50 handler cùng lúc. Kết quả?'],
      ['50 bookings for the same slot, in three runs of three', 'Exactly 1 booking — the transaction makes check and insert atomic', 'About 25 bookings — half see the others’ uncommitted rows', '0 bookings — PostgreSQL rolls back every conflicting transaction'],
      ['Each SELECT sees only rows committed before it began, and nobody had committed yet.', 'Mỗi SELECT chỉ thấy dòng đã commit trước khi nó bắt đầu, mà chưa ai commit cả.']),
    q('c2', ['Under SERIALIZABLE, 49 handlers lost. What did they get in the measured run?', 'Ở SERIALIZABLE, 49 handler thua. Lần đo đó họ nhận gì?'],
      ['37 got error 40001 and 12 saw the winner and got a clean 409', 'All 49 got 409, because SERIALIZABLE checks the overlap for you', 'All 49 got 500, because PostgreSQL aborted them', 'All 49 waited and then succeeded one by one'],
      ['40001 means “retry me”: the API must retry it or map it to 409 — never answer 500.', '40001 nghĩa là “thử lại tôi”: API phải thử lại hoặc đổi thành 409 — không bao giờ trả 500.']),
    q('c3', ['Why did Bình’s hold fail with 23P01 although An’s hold had expired 0.5 s earlier?', 'Vì sao chỗ giữ của Bình lỗi 23P01 dù chỗ giữ của An đã hết hạn 0,5 s?'],
      ['The constraint cannot read the clock (now() is not allowed in an index predicate), so the expired hold still counts', 'Bình’s range also overlapped a confirmed booking of the same lab that afternoon', 'The btree_gist extension was not installed, so equality on lab_id failed', 'The serial id 2 was already used by An’s hold, so the insert collided on the key'],
      ['Fix: in the inserting transaction, mark that lab’s expired holds EXPIRED, then insert.', 'Sửa: trong transaction chèn, đánh dấu EXPIRED các chỗ giữ đã hết hạn của phòng đó, rồi chèn.']),
    q('c4', ['In an interview, how should you use the evidence table of Chapters 3–10?', 'Khi phỏng vấn, nên dùng bảng bằng chứng của Chương 3–10 thế nào?'],
      ['Pick the two or three rows the follow-up questions lead to, each with its number and lesson', 'Recite all rows at the start to show how much you know', 'Never mention numbers — interviewers only care about diagrams', 'Only quote numbers from big companies’ blogs'],
      ['“Have you actually seen this happen?” — “Yes, here is the number” ends the question.', '“Em đã thấy chuyện đó xảy ra thật chưa?” — “Rồi ạ, đây là con số” khép câu hỏi lại.']),
  ],
  goiY: [['What does a SELECT see in Read Committed?', 'Một SELECT thấy gì ở Read Committed?'], ['Index predicates must be immutable.', 'Điều kiện của chỉ mục phải bất biến.']],
  loi: [['Believing a transaction alone prevents double booking.', 'Tin rằng chỉ transaction là chặn được đặt trùng.'], ['Returning 500 for a serialization failure.', 'Trả 500 cho lỗi tuần tự hoá.']],
  tns: [tn('race condition', 'điều kiện đua'), tn('exclusion constraint', 'ràng buộc loại trừ'), tn('40001', 'lỗi tuần tự hoá')],
  kn: ['concurrency', 'databases'],
});

function findConflict(bookings, req, now) {
  const ms = (s) => Date.parse(s);
  for (const b of bookings) {
    if (b.labId !== req.labId) continue;
    const active = b.status === 'CONFIRMED' || (b.status === 'HELD' && ms(b.holdExpiresAt) > ms(now));
    if (active && ms(b.start) < ms(req.end) && ms(req.start) < ms(b.end)) return b.id;   // [start, end) chồng nhau
  }
  return null;
}
const BK = [
  { id: 'bk_1', labId: 'lab_1', start: '2026-11-20T07:00:00Z', end: '2026-11-20T09:00:00Z', status: 'CONFIRMED' },
  { id: 'bk_2', labId: 'lab_1', start: '2026-11-20T09:00:00Z', end: '2026-11-20T10:00:00Z', status: 'HELD', holdExpiresAt: '2026-11-01T10:00:02Z' },
  { id: 'bk_3', labId: 'lab_2', start: '2026-11-20T07:00:00Z', end: '2026-11-20T09:00:00Z', status: 'CONFIRMED' },
  { id: 'bk_4', labId: 'lab_1', start: '2026-11-20T11:00:00Z', end: '2026-11-20T12:00:00Z', status: 'CANCELLED' },
];
const E2 = jsBai({
  ten: 'Booking 2 — Write findConflict(bookings, req, now): what the constraint checks', kho: 'MEDIUM', phut: 15,
  en: `<p>Return the id of the first booking that blocks <code>req = { labId, start, end }</code> at time <code>now</code>, or <code>null</code>. A booking blocks when it is for the same lab, is <b>active</b> — <code>CONFIRMED</code>, or <code>HELD</code> with <code>holdExpiresAt</code> after <code>now</code> — and its half-open range <code>[start, end)</code> overlaps the request’s: <code>b.start &lt; req.end</code> and <code>req.start &lt; b.end</code>. Times are ISO strings; compare them with <code>Date.parse</code>.</p>`,
  vi: `<p>Trả id của lượt đặt đầu tiên chặn <code>req = { labId, start, end }</code> ở thời điểm <code>now</code>, hoặc <code>null</code>. Một lượt đặt chặn khi cùng phòng, đang <b>hiệu lực</b> — <code>CONFIRMED</code>, hoặc <code>HELD</code> có <code>holdExpiresAt</code> sau <code>now</code> — và khoảng nửa mở <code>[start, end)</code> chồng với của request: <code>b.start &lt; req.end</code> và <code>req.start &lt; b.end</code>. Thời gian là chuỗi ISO; so bằng <code>Date.parse</code>.</p>`,
  dauVao: ['bookings — object[]; req — {labId, start, end}; now — ISO string', 'bookings — object[]; req — {labId, start, end}; now — chuỗi ISO'],
  dauRa: ['string | null', 'chuỗi | null'],
  goiY: [['Two half-open ranges overlap when each starts before the other ends.', 'Hai khoảng nửa mở chồng nhau khi cái này bắt đầu trước khi cái kia kết thúc.'], ['Ignore CANCELLED and expired HELD bookings.', 'Bỏ qua lượt CANCELLED và HELD đã hết hạn.']],
  loi: [['Using ≤: 07:00–09:00 and 09:00–10:00 then “overlap”.', 'Dùng ≤: 07:00–09:00 và 09:00–10:00 thành “chồng”.'], ['Counting an expired hold as active — the trap the constraint itself has.', 'Coi chỗ giữ hết hạn là còn hiệu lực — đúng cái bẫy ràng buộc mắc phải.']],
  gt: ['In PostgreSQL this is EXCLUDE USING gist (lab_id WITH =, slot WITH &&) WHERE (status IN (...)) — except the database cannot evaluate “expired at now”, which is why the transaction must expire holds first (11.6).', 'Trong PostgreSQL đây là EXCLUDE USING gist (lab_id WITH =, slot WITH &&) WHERE (status IN (...)) — chỉ khác là CSDL không tính được “hết hạn ở thời điểm now”, vì thế transaction phải cho chỗ giữ hết hạn trước (11.6).'],
  kn: ['concurrency', 'validation'],
  tns: [tn('half-open range', 'khoảng nửa mở'), tn('overlap', 'chồng nhau')],
  dau: `/** which booking blocks this request? */
function findConflict(bookings, req, now) {
  // Write your solution here
  for (const b of bookings) {
    if (b.labId === req.labId && b.start <= req.end && req.start <= b.end) return b.id;
  }
  return null;
}
`,
  giai: '// Reference solution\n' + nguon(findConflict),
  cases: [
    { goi: goi('findConflict', BK, { labId: 'lab_1', start: '2026-11-20T08:00:00Z', end: '2026-11-20T08:30:00Z' }, '2026-11-01T10:00:00Z'), moTa: ['Inside a confirmed booking', 'Nằm trong một lượt đã xác nhận'] },
    { goi: goi('findConflict', BK, { labId: 'lab_1', start: '2026-11-20T09:00:00Z', end: '2026-11-20T09:30:00Z' }, '2026-11-01T10:00:00Z'), moTa: ['Starts exactly when bk_1 ends; bk_2 is still held', 'Bắt đầu đúng lúc bk_1 kết thúc; bk_2 còn giữ'] },
    { goi: goi('findConflict', BK, { labId: 'lab_1', start: '2026-11-20T09:00:00Z', end: '2026-11-20T09:30:00Z' }, '2026-11-01T10:00:03Z'), an: true },
    { goi: goi('findConflict', BK, { labId: 'lab_1', start: '2026-11-20T11:00:00Z', end: '2026-11-20T12:00:00Z' }, '2026-11-01T10:00:00Z'), an: true },
    { goi: goi('findConflict', BK, { labId: 'lab_2', start: '2026-11-20T06:00:00Z', end: '2026-11-20T07:00:00Z' }, '2026-11-01T10:00:00Z'), an: true },
    { goi: goi('findConflict', BK, { labId: 'lab_2', start: '2026-11-20T06:00:00Z', end: '2026-11-20T07:00:01Z' }, '2026-11-01T10:00:00Z'), an: true },
  ],
});

function confirmHold(bookings, id, now) {
  const b = bookings.find((x) => x.id === id);
  if (!b) return { status: 404, code: 'BOOKING_NOT_FOUND', bookings };
  if (b.status !== 'HELD') return { status: 409, code: 'NOT_HELD', bookings };
  if (Date.parse(b.holdExpiresAt) <= Date.parse(now)) return { status: 409, code: 'HOLD_EXPIRED', bookings };
  return { status: 200, bookings: bookings.map((x) => (x.id === id ? { ...x, status: 'CONFIRMED', holdExpiresAt: null } : x)) };
}
const HB = [
  { id: 'bk_1', status: 'HELD', holdExpiresAt: '2026-11-01T10:00:02Z' },
  { id: 'bk_3', status: 'HELD', holdExpiresAt: '2026-11-01T10:05:00Z' },
  { id: 'bk_4', status: 'CONFIRMED', holdExpiresAt: null },
];
const E3 = jsBai({
  ten: 'Booking 3 — Write confirmHold(bookings, id, now): a conditional UPDATE', kho: 'HARD', phut: 15,
  en: `<p>Model <code>UPDATE bookings SET status = 'CONFIRMED', hold_expires_at = NULL WHERE id = $1 AND status = 'HELD' AND hold_expires_at &gt; now()</code> and the API answer around it. Return <code>{ status, code?, bookings }</code>:</p><ul><li>unknown id ⇒ <code>404 BOOKING_NOT_FOUND</code>;</li><li>not HELD ⇒ <code>409 NOT_HELD</code>;</li><li><code>holdExpiresAt</code> ≤ <code>now</code> ⇒ <code>409 HOLD_EXPIRED</code>;</li><li>otherwise <code>200</code> and a <b>new</b> array where that booking is CONFIRMED with <code>holdExpiresAt: null</code>.</li></ul><p>In every error case return the input array unchanged; never mutate it.</p>`,
  vi: `<p>Mô phỏng <code>UPDATE bookings SET status = 'CONFIRMED', hold_expires_at = NULL WHERE id = $1 AND status = 'HELD' AND hold_expires_at &gt; now()</code> và câu trả lời API quanh nó. Trả <code>{ status, code?, bookings }</code>:</p><ul><li>id không có ⇒ <code>404 BOOKING_NOT_FOUND</code>;</li><li>không ở HELD ⇒ <code>409 NOT_HELD</code>;</li><li><code>holdExpiresAt</code> ≤ <code>now</code> ⇒ <code>409 HOLD_EXPIRED</code>;</li><li>ngược lại <code>200</code> và một mảng <b>mới</b> trong đó lượt đặt đó thành CONFIRMED với <code>holdExpiresAt: null</code>.</li></ul><p>Mọi trường hợp lỗi trả nguyên mảng đầu vào; không bao giờ sửa nó.</p>`,
  dauVao: ['bookings — {id, status, holdExpiresAt}[]; id — string; now — ISO string', 'bookings — {id, status, holdExpiresAt}[]; id — chuỗi; now — chuỗi ISO'],
  dauRa: ['{ status, code?, bookings }', '{ status, code?, bookings }'],
  goiY: [['Check in the order: exists, HELD, not expired.', 'Kiểm theo thứ tự: có tồn tại, đang HELD, chưa hết hạn.'], ['map() builds the new array without mutating.', 'map() dựng mảng mới mà không sửa mảng cũ.']],
  loi: [['Confirming a hold that expired one second ago.', 'Xác nhận chỗ giữ đã hết hạn một giây.'], ['Confirming twice: a CONFIRMED booking is not HELD any more.', 'Xác nhận hai lần: lượt đã CONFIRMED không còn HELD.']],
  gt: ['Measured in 11.6: An confirms #1 after the hold expired — 0 rows changed ⇒ 409 HOLD_EXPIRED; Bình confirms #3 in time — 1 row ⇒ 200 CONFIRMED. The WHERE clause is the whole state machine.', 'Đo ở bài 11.6: An xác nhận #1 sau khi chỗ giữ hết hạn — đổi 0 dòng ⇒ 409 HOLD_EXPIRED; Bình xác nhận #3 kịp lúc — 1 dòng ⇒ 200 CONFIRMED. Vế WHERE chính là cả máy trạng thái.'],
  kn: ['concurrency', 'state machines'],
  tns: [tn('conditional UPDATE', 'UPDATE có điều kiện'), tn('hold', 'giữ chỗ')],
  dau: `/** confirm a hold */
function confirmHold(bookings, id, now) {
  // Write your solution here
  const b = bookings.find((x) => x.id === id);
  b.status = 'CONFIRMED';
  return { status: 200, bookings };
}
`,
  giai: '// Reference solution\n' + nguon(confirmHold),
  cases: [
    { goi: goi('confirmHold', HB, 'bk_1', '2026-11-01T10:00:02.500Z'), moTa: ['An, half a second too late', 'An, muộn nửa giây'] },
    { goi: goi('confirmHold', HB, 'bk_3', '2026-11-01T10:00:03Z'), moTa: ['Bình, in time', 'Bình, kịp lúc'] },
    { goi: goi('confirmHold', HB, 'bk_4', '2026-11-01T10:00:00Z'), an: true },
    { goi: goi('confirmHold', HB, 'bk_9', '2026-11-01T10:00:00Z'), an: true },
    { goi: goi('confirmHold', HB, 'bk_1', '2026-11-01T10:00:02Z'), an: true },
  ],
});

export default doiDau({ slug: 'api-11-4-dat-lich', ten: '11.6 Interview: a booking system', khoa: KHOA, baiHoc: 'api-11-4-dat-lich', de: [E1, E2, E3] });
