/** API Design · Lab 11 — Phỏng vấn thử API sự kiện CLB: luật tài nguyên của bộ chấm, chỗ ngồi/hàng chờ, huỷ và đôn (output thật Lab 11: lab/grade-lab11.mjs). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = {
  ...cs({
    ten: 'Lab 11 · 1 — The starter, the YAML trap and the reference', kho: 'EASY', phut: 8,
    en: 'Club event sign-up and check-in, graded by lab/grade-lab11.mjs (starter 0/10, one unquoted brace 2/10, reference 10/10).',
    vi: 'Đăng ký và check-in sự kiện CLB, chấm bằng lab/grade-lab11.mjs (khởi đầu 0/10, một dấu ngoặc thiếu nháy 2/10, lời giải 10/10).',
    cau: [
      q('c1', ['One line { description: /v1/events/{eventId} } in a flow map dropped the reference solution to 2/10. Why so many points?', 'Một dòng { description: /v1/events/{eventId} } trong flow map kéo lời giải xuống 2/10. Vì sao mất nhiều điểm vậy?'],
        ['The whole YAML stopped parsing, so every contract check after the design doc failed', 'redocly treats curly braces in descriptions as a breaking change', 'The grader penalises path templates inside descriptions', 'The design doc referred to a path that no longer existed'],
        ['Quote strings with {, : or a comma inside flow maps, and run the grader after every edit (7.1 had the same family of traps).', 'Đặt trong nháy chuỗi có {, : hay dấu phẩy trong flow map, và chạy bộ chấm sau mỗi lần sửa (7.1 có cùng họ bẫy).']),
      q('c2', ['The event is full and a student registers. Why does the reference answer 201 with status WAITLISTED, not 202?', 'Sự kiện hết chỗ và một sinh viên đăng ký. Vì sao lời giải trả 201 kèm status WAITLISTED mà không 202?'],
        ['A waitlist place is created immediately — it has an id, a position and can be cancelled', '202 is only allowed for POST requests without a body', 'Clients cannot read the body of a 202 response', '201 is required by OpenAPI for every POST'],
        ['202 means “decided later”; use it only if registrations went through a queue at a far bigger scale (10.1).', '202 nghĩa là “quyết sau”; chỉ dùng khi đăng ký phải qua hàng đợi ở quy mô lớn hơn nhiều (10.1).']),
      q('c3', ['An organiser scans the same ticket twice (or an offline queue replays it). What should the API answer?', 'Ban tổ chức quét một vé hai lần (hoặc hàng đợi offline phát lại). API nên trả gì?'],
        ['200 with the first check-in — “already in” is the answer the door needs', '409 CONFLICT, because the ticket was already used', '422, because a used ticket breaks a business rule', '201 again with a second check-in record'],
        ['Same reasoning as a replayed Idempotency-Key: the repeat is not an error to dismiss.', 'Cùng lý lẽ với Idempotency-Key được phát lại: lần lặp không phải lỗi để bấm tắt.']),
    ],
    goiY: [['Read the trap boxes of the lab page.', 'Đọc các khung “Bẫy” của trang lab.'], ['Ask what exists right after the request.', 'Hỏi: ngay sau request, cái gì đã tồn tại?']],
    loi: [['Unquoted braces inside YAML flow maps.', 'Dấu ngoặc nhọn không có nháy trong flow map YAML.'], ['Answering 409 at the door for a repeat scan.', 'Trả 409 ở cửa cho lần quét lặp.']],
    tns: [tn('flow map', 'map viết trên một dòng { … }'), tn('waitlist', 'hàng chờ')],
    kn: ['interview', 'openapi'],
  }),
  dangBai: 'lab',
};

function checkPaths(paths) {
  const verb = /^(get|create|update|delete|register|add|remove|list|fetch|do|set|checkin)([A-Z_-]|$)/i;
  const bad = paths.filter((p) => !p.startsWith('/v1/') || p.split('/').some((seg) => !seg.startsWith('{') && verb.test(seg)));
  const missing = ['/events', '/registrations', '/check-ins'].filter((n) => !paths.some((p) => p.includes(n)));
  return { ok: paths.length > 0 && bad.length === 0 && missing.length === 0, bad, missing };
}
const E2 = jsBai({
  ten: 'Lab 11 · 2 — Write checkPaths(paths): check 4 of the grader', kho: 'MEDIUM', phut: 15, dangBai: 'lab',
  en: `<p>Re-create rubric check 4 of <code>lab/grade-lab11.mjs</code>. A path is <b>bad</b> when it does not start with <code>/v1/</code>, or when any segment that is not a template (does not start with <code>{</code>) is a verb: it matches <code>^(get|create|update|delete|register|add|remove|list|fetch|do|set|checkin)</code> case-insensitively, followed by an upper-case letter, <code>_</code>, <code>-</code> or the end. <b>Missing</b> lists those of <code>/events</code>, <code>/registrations</code>, <code>/check-ins</code> (in that order) that no path contains. Return <code>{ ok, bad, missing }</code>; <code>ok</code> needs at least one path, no bad path and nothing missing.</p>`,
  vi: `<p>Dựng lại phép kiểm 4 của <code>lab/grade-lab11.mjs</code>. Một đường là <b>sai</b> khi không bắt đầu bằng <code>/v1/</code>, hoặc khi có đoạn không phải tham số (không bắt đầu bằng <code>{</code>) là động từ: khớp <code>^(get|create|update|delete|register|add|remove|list|fetch|do|set|checkin)</code> không phân biệt hoa thường, theo sau là chữ hoa, <code>_</code>, <code>-</code> hoặc hết chuỗi. <b>Thiếu</b> liệt kê những cái trong <code>/events</code>, <code>/registrations</code>, <code>/check-ins</code> (đúng thứ tự) mà không đường nào chứa. Trả <code>{ ok, bad, missing }</code>; <code>ok</code> cần ít nhất một đường, không đường sai và không thiếu gì.</p>`,
  dauVao: ['paths — string[] (the keys of openapi.paths)', 'paths — string[] (các khoá của openapi.paths)'],
  dauRa: ['{ ok: boolean, bad: string[], missing: string[] }', '{ ok: boolean, bad: string[], missing: string[] }'],
  goiY: [['split("/") and skip segments starting with “{”.', 'split("/") và bỏ qua đoạn bắt đầu bằng “{”.'], ['The verb must be followed by an upper-case letter, _ , - or the end — so “getEvents” is a verb but “settings” is not.', 'Động từ phải theo sau bởi chữ hoa, _, - hoặc hết chuỗi — nên “getEvents” là động từ còn “settings” thì không.']],
  loi: [['Flagging “check-ins” because it starts with “check”.', 'Bắt nhầm “check-ins” vì nó bắt đầu bằng “check”.'], ['Forgetting the /v1/ prefix rule.', 'Quên luật tiền tố /v1/.']],
  gt: ['The starter of Lab 11 failed exactly this: /getEvents, /registerEvent, /checkin. The reference passed with six resource paths under /v1/.', 'Bản khởi đầu của Lab 11 trượt đúng chỗ này: /getEvents, /registerEvent, /checkin. Lời giải qua với sáu đường tài nguyên dưới /v1/.'],
  kn: ['resources', 'openapi'],
  tns: [tn('path template', 'tham số trong đường dẫn {id}'), tn('segment', 'đoạn đường dẫn')],
  dau: `/** rubric check 4 */
function checkPaths(paths) {
  // Write your solution here
  const bad = paths.filter((p) => /get|create|register|checkin/i.test(p));
  return { ok: bad.length === 0, bad, missing: [] };
}
`,
  giai: '// Reference solution\n' + nguon(checkPaths),
  cases: [
    { goi: goi('checkPaths', ['/getEvents', '/registerEvent', '/checkin']), moTa: ['The starter of Lab 11', 'Bản khởi đầu của Lab 11'] },
    { goi: goi('checkPaths', ['/v1/events', '/v1/events/{eventId}', '/v1/events/{eventId}/registrations', '/v1/events/{eventId}/registrations/{registrationId}', '/v1/me/registrations', '/v1/events/{eventId}/check-ins']), moTa: ['The reference solution', 'Lời giải tham khảo'] },
    { goi: goi('checkPaths', ['/v1/events', '/v1/events/{id}/register', '/v1/me/settings']), an: true },
    { goi: goi('checkPaths', ['/events', '/v1/registrations', '/v1/check-ins']), an: true },
    { goi: goi('checkPaths', []), an: true },
    { goi: goi('checkPaths', ['/v1/events/{createdBy}/registrations', '/v1/check-ins/list_all']), an: true },
  ],
});

function register(event, regs, userId) {
  const mine = regs.find((r) => r.userId === userId && r.status !== 'CANCELLED');
  if (mine) return { status: 409, code: 'ALREADY_REGISTERED' };
  if (!event.open) return { status: 422, code: 'REGISTRATION_CLOSED' };
  const confirmed = regs.filter((r) => r.status === 'CONFIRMED').length;
  const waiting = regs.filter((r) => r.status === 'WAITLISTED').length;
  if (confirmed < event.capacity) return { status: 201, registration: { userId, status: 'CONFIRMED', waitlistPosition: null } };
  if (waiting >= event.waitlistLimit) return { status: 422, code: 'WAITLIST_FULL' };
  return { status: 201, registration: { userId, status: 'WAITLISTED', waitlistPosition: waiting + 1 } };
}
const EV = { capacity: 2, waitlistLimit: 2, open: true };
const E3 = jsBai({
  ten: 'Lab 11 · 3 — Write register(event, regs, userId): a seat or the waitlist', kho: 'HARD', phut: 20, dangBai: 'lab',
  en: `<p>The decision inside <code>POST /v1/events/{eventId}/registrations</code>, in this order:</p><ol><li>the user already has a registration that is not CANCELLED ⇒ <code>{ status: 409, code: "ALREADY_REGISTERED" }</code>;</li><li><code>event.open</code> is false ⇒ <code>422 REGISTRATION_CLOSED</code>;</li><li>fewer CONFIRMED than <code>event.capacity</code> ⇒ <code>{ status: 201, registration: { userId, status: "CONFIRMED", waitlistPosition: null } }</code>;</li><li>WAITLISTED count ≥ <code>event.waitlistLimit</code> ⇒ <code>422 WAITLIST_FULL</code>;</li><li>otherwise <code>201</code> with <code>status: "WAITLISTED"</code> and <code>waitlistPosition</code> = waiting count + 1.</li></ol>`,
  vi: `<p>Quyết định bên trong <code>POST /v1/events/{eventId}/registrations</code>, theo thứ tự:</p><ol><li>người dùng đã có đăng ký không ở trạng thái CANCELLED ⇒ <code>{ status: 409, code: "ALREADY_REGISTERED" }</code>;</li><li><code>event.open</code> là false ⇒ <code>422 REGISTRATION_CLOSED</code>;</li><li>số CONFIRMED ít hơn <code>event.capacity</code> ⇒ <code>{ status: 201, registration: { userId, status: "CONFIRMED", waitlistPosition: null } }</code>;</li><li>số WAITLISTED ≥ <code>event.waitlistLimit</code> ⇒ <code>422 WAITLIST_FULL</code>;</li><li>ngược lại <code>201</code> với <code>status: "WAITLISTED"</code> và <code>waitlistPosition</code> = số đang chờ + 1.</li></ol>`,
  dauVao: ['event — {capacity, waitlistLimit, open}; regs — {userId, status}[]; userId — string', 'event — {capacity, waitlistLimit, open}; regs — {userId, status}[]; userId — chuỗi'],
  dauRa: ['{ status: 201, registration } | { status: 409 | 422, code }', '{ status: 201, registration } | { status: 409 | 422, code }'],
  goiY: [['Count CONFIRMED and WAITLISTED separately; ignore CANCELLED.', 'Đếm CONFIRMED và WAITLISTED riêng; bỏ qua CANCELLED.'], ['A cancelled earlier registration does not block a new one.', 'Một đăng ký cũ đã huỷ không chặn đăng ký mới.']],
  loi: [['Counting CANCELLED rows as taken seats.', 'Đếm dòng CANCELLED là chỗ đã có người.'], ['Answering 409 when the event is full — full is not a conflict with this user.', 'Trả 409 khi hết chỗ — hết chỗ không phải xung đột với người này.']],
  gt: ['In the database this decision is one transaction: UPDATE events SET seats_left = seats_left - 1 WHERE id = $1 AND seats_left > 0 (0 rows ⇒ waitlist) plus UNIQUE (event_id, user_id) — the race of 11.6 cannot slip through.', 'Trong CSDL quyết định này là một transaction: UPDATE events SET seats_left = seats_left - 1 WHERE id = $1 AND seats_left > 0 (0 dòng ⇒ hàng chờ) cộng UNIQUE (event_id, user_id) — cuộc đua ở bài 11.6 không lọt được.'],
  kn: ['business rules', 'errors'],
  tns: [tn('capacity', 'số chỗ'), tn('waitlist position', 'vị trí trong hàng chờ')],
  dau: `/** seat or waitlist */
function register(event, regs, userId) {
  // Write your solution here
  if (regs.length >= event.capacity) return { status: 409, code: 'EVENT_FULL' };
  return { status: 201, registration: { userId, status: 'CONFIRMED', waitlistPosition: null } };
}
`,
  giai: '// Reference solution\n' + nguon(register),
  cases: [
    { goi: goi('register', EV, [{ userId: 'u1', status: 'CONFIRMED' }], 'u2'), moTa: ['The last seat', 'Chỗ cuối cùng'] },
    { goi: goi('register', EV, [{ userId: 'u1', status: 'CONFIRMED' }, { userId: 'u2', status: 'CONFIRMED' }], 'u3'), moTa: ['Full ⇒ waitlist', 'Hết chỗ ⇒ hàng chờ'] },
    { goi: goi('register', EV, [{ userId: 'u1', status: 'CONFIRMED' }], 'u1'), an: true },
    { goi: goi('register', EV, [{ userId: 'u1', status: 'CANCELLED' }, { userId: 'u2', status: 'CONFIRMED' }], 'u1'), an: true },
    { goi: goi('register', EV, [{ userId: 'a', status: 'CONFIRMED' }, { userId: 'b', status: 'CONFIRMED' }, { userId: 'c', status: 'WAITLISTED' }, { userId: 'd', status: 'WAITLISTED' }], 'e'), an: true },
    { goi: goi('register', { ...EV, open: false }, [], 'u1'), an: true },
    { goi: goi('register', EV, [{ userId: 'a', status: 'CONFIRMED' }, { userId: 'b', status: 'CONFIRMED' }, { userId: 'c', status: 'WAITLISTED' }], 'c'), an: true },
  ],
});

export default doiDau({ slug: 'api-11-7-lab', ten: 'Lab 11 — Mock interview: club event sign-up and check-in', khoa: KHOA, baiHoc: 'api-11-7-lab', de: [E1, E2, E3] });
