/** API Design · 4.4 — App không chịu cập nhật: quyết định chặn/gợi ý theo semver, giấu giá trị enum mới khỏi phiên bản cũ. */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

/* ── 1. Tình huống ── */
const E1 = cs({
  ten: 'Apps 1 — Clients that never update', kho: 'EASY', phut: 10,
  en: 'Facts from lesson 4.4 (LabFlow /app-config, the version guard and check-in, real runs).',
  vi: 'Những điều từ bài 4.4 (LabFlow /app-config, chốt phiên bản và check-in, chạy thật).',
  cau: [
    q('c1', ['Why is GET /app-config registered BEFORE appVersionGuard?', 'Vì sao GET /app-config được đăng ký TRƯỚC appVersionGuard?'], ['A too-old app must still read it to learn that it must update', 'Config responses are larger and slower', 'Express runs the last middleware first', 'So that the config can use the guard’s cache'], ['App 1.2.0 read minVersion 1.3.0 and showed the update screen; behind the guard it would only get 400s.', 'App 1.2.0 đọc minVersion 1.3.0 và hiện màn hình cập nhật; nằm sau chốt thì nó chỉ nhận 400.']),
    q('c2', ['A request without the LabFlow-Client header reached /v2/bookings. The guard …', 'Một request không có header LabFlow-Client tới /v2/bookings. Chốt chặn …'], ['let it through — only known-bad app builds are blocked', 'answered 400 APP_VERSION_UNSUPPORTED', 'answered 401 Unauthorized', 'redirected it to /app-config'], ['curl, scripts and the web do not send the header; blocking them would break everything for no gain.', 'curl, script và web không gửi header này; chặn chúng là làm hỏng mọi thứ mà chẳng được gì.']),
    q('c3', ['Why not 426 Upgrade Required for a too-old app?', 'Vì sao không dùng 426 Upgrade Required cho app quá cũ?'], ['426 means switching to another protocol and requires an Upgrade header', '426 is not a status code defined by HTTP at all', '426 responses are not allowed to carry a body', 'Mobile HTTP libraries cannot read 4xx statuses'], ['The build is the problem, not the protocol; LabFlow uses 400 with a specific code, minVersion and updateUrl.', 'Vấn đề nằm ở bản build, không ở giao thức; LabFlow dùng 400 với mã riêng, minVersion và updateUrl.']),
    q('c4', ['After checking in bk_8, GET /v1/bookings/bk_8 showed status …', 'Sau khi check-in bk_8, GET /v1/bookings/bk_8 hiện status …'], ['PENDING — v1 maps the new value to the nearest old meaning', 'CHECKED_IN — the same value v2 shows', 'null — v1 has no value for check-in', 'a 409 NOT_PENDING error from the v1 route'], ['New enum values only appear in the version that knows them; the v1 filter uses the same mapping.', 'Giá trị enum mới chỉ xuất hiện ở phiên bản biết nó; bộ lọc v1 dùng cùng phép ánh xạ.']),
    q('c5', ['App 1.4.0 was written before check-in existed. Why did it not crash on CHECKED_IN?', 'App 1.4.0 viết trước khi có check-in. Vì sao nó không sập khi gặp CHECKED_IN?'], ['It reads tolerantly: an unknown status gets “Trạng thái khác (…)”', 'The server hid CHECKED_IN from v2 as well', 'Its minVersion forced an update first', 'It caught the exception and restarted'], ['LABEL[s] ?? fallback — the rule from lesson 4.1, applied in the app.', 'LABEL[s] ?? phương án dự phòng — luật của bài 4.1, áp vào app.']),
  ],
  goiY: [['Every answer was printed in lesson 4.4.', 'Mọi đáp án đã được in trong bài 4.4.'], ['Think about which door must always stay open.', 'Nghĩ xem cánh cửa nào phải luôn mở.']],
  loi: [['Guarding the config endpoint.', 'Chặn cả endpoint cấu hình.'], ['Showing new enum values to old clients.', 'Cho client cũ thấy giá trị enum mới.']],
  tns: [tn('remote config', 'cấu hình từ xa'), tn('forced update', 'ép cập nhật')],
  kn: ['mobile clients'],
});

/* ── 2. Tự viết: appDecision ── */
function appDecision(header, cfg) {
  const m = /^(android|ios|web)\/(\d+)\.(\d+)\.(\d+)$/.exec(header ?? '');
  if (!m || m[1] === 'web') return 'ok';
  const v = [Number(m[2]), Number(m[3]), Number(m[4])];
  const older = (min) => {
    const w = min.split('.').map(Number);
    return (v[0] - w[0] || v[1] - w[1] || v[2] - w[2]) < 0;
  };
  if (older(cfg.minVersion[m[1]])) return 'block';
  if (older(cfg.latestVersion[m[1]])) return 'suggest';
  return 'ok';
}
const CFG = { minVersion: { android: '1.3.0', ios: '1.3.0' }, latestVersion: { android: '1.5.0', ios: '1.10.0' } };
const E2 = jsBai({
  ten: 'Apps 2 — Write appDecision(header, cfg): block, suggest or ok', kho: 'MEDIUM', phut: 15,
  en: `<p>Given the <code>LabFlow-Client</code> header (e.g. <code>"android/1.4.0"</code>) and the config, return:</p><ul>
<li><code>"block"</code> — version below <code>cfg.minVersion[platform]</code></li>
<li><code>"suggest"</code> — not blocked, but below <code>cfg.latestVersion[platform]</code></li>
<li><code>"ok"</code> — otherwise, and also for a missing or malformed header and for <code>web/…</code> (never block what you cannot identify)</li></ul>
<p>Compare versions <b>number by number</b>: <code>1.10.0</code> is newer than <code>1.9.0</code>.</p>`,
  vi: `<p>Cho header <code>LabFlow-Client</code> (ví dụ <code>"android/1.4.0"</code>) và cấu hình, trả:</p><ul>
<li><code>"block"</code> — phiên bản dưới <code>cfg.minVersion[nền tảng]</code></li>
<li><code>"suggest"</code> — không bị chặn, nhưng dưới <code>cfg.latestVersion[nền tảng]</code></li>
<li><code>"ok"</code> — còn lại, và cả khi header thiếu hay sai dạng, và với <code>web/…</code> (không bao giờ chặn thứ không nhận diện được)</li></ul>
<p>So phiên bản <b>từng con số</b>: <code>1.10.0</code> mới hơn <code>1.9.0</code>.</p>`,
  dauVao: ['header — string | undefined; cfg — { minVersion, latestVersion }', 'header — chuỗi | undefined; cfg — { minVersion, latestVersion }'],
  dauRa: ['"block" | "suggest" | "ok"', '"block" | "suggest" | "ok"'],
  goiY: [['Parse with /^(android|ios|web)\\/(\\d+)\\.(\\d+)\\.(\\d+)$/.', 'Đọc bằng /^(android|ios|web)\\/(\\d+)\\.(\\d+)\\.(\\d+)$/.'], ['a[0] - b[0] || a[1] - b[1] || a[2] - b[2] compares two versions.', 'a[0] - b[0] || a[1] - b[1] || a[2] - b[2] so hai phiên bản.']],
  loi: [['Comparing "1.10.0" &lt; "1.9.0" as strings — true, and wrong.', 'So "1.10.0" &lt; "1.9.0" như chuỗi — ra true, và sai.'], ['Blocking requests without the header.', 'Chặn request không có header.']],
  gt: ['The decision app.mjs and appVersionGuard make together in lesson 4.4: the app shows a blocking screen or a hint from the config, and the server blocks only known-bad builds.', 'Quyết định mà app.mjs và appVersionGuard cùng đưa ra ở bài 4.4: app hiện màn hình chặn hay lời gợi ý từ cấu hình, còn server chỉ chặn bản build đã biết là hỏng.'],
  kn: ['semantic versioning', 'mobile clients'],
  tns: [tn('semver', 'phiên bản ngữ nghĩa MAJOR.MINOR.PATCH'), tn('minimum supported version', 'phiên bản tối thiểu được hỗ trợ')],
  dau: `/** client header + config ⇒ "block" | "suggest" | "ok" */
function appDecision(header, cfg) {
  // Write your solution here
  const [platform, version] = header.split('/');
  if (version < cfg.minVersion[platform]) return 'block';
  if (version < cfg.latestVersion[platform]) return 'suggest';
  return 'ok';
}
`,
  giai: '// Reference solution\n' + nguon(appDecision),
  cases: [
    { goi: goi('appDecision', 'android/1.2.0', CFG), moTa: ['App 1.2.0 (lesson 4.4)', 'App 1.2.0 (bài 4.4)'] },
    { goi: goi('appDecision', 'android/1.4.0', CFG), moTa: ['App 1.4.0', 'App 1.4.0'] },
    { goi: `appDecision(undefined, ${JSON.stringify(CFG)})`, moTa: ['No header (curl, scripts)', 'Không có header (curl, script)'] },
    { goi: goi('appDecision', 'ios/1.9.0', CFG), an: true, moTa: ['1.9.0 vs latest 1.10.0', '1.9.0 so với bản mới nhất 1.10.0'] },
    { goi: goi('appDecision', 'ios/1.10.0', CFG), an: true },
    { goi: goi('appDecision', 'android/1.3.0', CFG), an: true },
    { goi: goi('appDecision', 'web/0.1.0', CFG), an: true },
    { goi: goi('appDecision', 'android/1.2', CFG), an: true },
  ],
});

/* ── 3. Tự viết: statusForVersion ── */
function bookingForVersion(b, version) {
  if (version >= 2) return { ...b, checkedInAt: b.checkedInAt ?? null };
  const { checkedInAt, ...rest } = b;
  void checkedInAt;
  const V1 = { PENDING: 'PENDING', CANCELLED: 'CANCELLED', CHECKED_IN: 'PENDING' };
  return { ...rest, status: V1[b.status] ?? 'PENDING' };
}
const B8 = { id: 'bk_8', status: 'CHECKED_IN', checkedInAt: '2026-10-31T20:05:03.456Z' };
const E3 = jsBai({
  ten: 'Apps 3 — Write bookingForVersion(b, version): hide new values from v1', kho: 'EASY', phut: 10,
  en: `<p>Internally a booking may be <code>PENDING</code>, <code>CHECKED_IN</code> or <code>CANCELLED</code> and may have <code>checkedInAt</code>. Return a new object:</p><ul>
<li><b>version 2</b> (or later): everything as it is, with <code>checkedInAt</code> always present (<code>null</code> when missing)</li>
<li><b>version 1</b>: no <code>checkedInAt</code> member at all; <code>CHECKED_IN</code> becomes <code>PENDING</code>; any other unknown status also becomes <code>PENDING</code></li></ul>`,
  vi: `<p>Bên trong, lượt đặt có thể là <code>PENDING</code>, <code>CHECKED_IN</code> hay <code>CANCELLED</code> và có thể có <code>checkedInAt</code>. Trả một object mới:</p><ul>
<li><b>phiên bản 2</b> (trở lên): giữ nguyên mọi thứ, <code>checkedInAt</code> luôn có mặt (<code>null</code> nếu thiếu)</li>
<li><b>phiên bản 1</b>: không có trường <code>checkedInAt</code>; <code>CHECKED_IN</code> thành <code>PENDING</code>; trạng thái lạ khác cũng thành <code>PENDING</code></li></ul>`,
  dauVao: ['b — internal booking; version — 1 | 2', 'b — lượt đặt nội bộ; version — 1 | 2'],
  dauRa: ['the booking as that version shows it', 'lượt đặt như phiên bản đó hiển thị'],
  goiY: [['Destructuring removes a member: const { checkedInAt, ...rest } = b.', 'Phân rã object bỏ được một trường: const { checkedInAt, ...rest } = b.'], ['A small map does the status translation.', 'Một bảng nhỏ lo việc dịch trạng thái.']],
  loi: [['Sending checkedInAt: null to v1 — an added member v1 never had.', 'Gửi checkedInAt: null cho v1 — một trường v1 chưa từng có.'], ['Passing CHECKED_IN through to v1 — the 4.1 crash.', 'Để CHECKED_IN lọt sang v1 — cú sập của 4.1.']],
  gt: ['LabFlow’s v1Status + toBookingV2 in one function: v1 keeps its frozen contract, v2 grows additively.', 'v1Status + toBookingV2 của LabFlow trong một hàm: v1 giữ hợp đồng đã đóng băng, v2 lớn lên theo kiểu chỉ-thêm.'],
  kn: ['versioning', 'enums'],
  tns: [tn('enum value', 'giá trị liệt kê'), tn('frozen contract', 'hợp đồng đã đóng băng')],
  dau: `/** internal booking ⇒ what version 1 or 2 shows */
function bookingForVersion(b, version) {
  // Write your solution here
  return { ...b, checkedInAt: b.checkedInAt ?? null };
}
`,
  giai: '// Reference solution\n' + nguon(bookingForVersion),
  cases: [
    { goi: goi('bookingForVersion', B8, 2), moTa: ['v2 sees CHECKED_IN', 'v2 thấy CHECKED_IN'] },
    { goi: goi('bookingForVersion', B8, 1), moTa: ['v1 sees PENDING', 'v1 thấy PENDING'] },
    { goi: goi('bookingForVersion', { id: 'bk_7', status: 'CANCELLED' }, 2), an: true },
    { goi: goi('bookingForVersion', { id: 'bk_7', status: 'CANCELLED' }, 1), an: true },
    { goi: goi('bookingForVersion', { id: 'bk_9', status: 'NO_SHOW', checkedInAt: null }, 1), an: true },
  ],
});

export default doiDau({ slug: 'api-4-4-app-di-dong', ten: '4.4 Mobile and desktop clients that never update', khoa: KHOA, baiHoc: 'api-4-4-app-di-dong', de: [E1, E2, E3] });
