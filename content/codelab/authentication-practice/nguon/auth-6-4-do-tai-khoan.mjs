/** Authentication · 6.4 — Dò tài khoản: đọc output đo thời gian; viết enumerationChannel/leaks; sắp + bảng. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s06/_ma.mjs';

const EN = OUT['64-enum'].split('\n').slice(1);

const S1 = cs({
  ten: '6.4-1 — Enumeration by timing: read the measurement', kho: 'MEDIUM', phut: 10,
  en: `LabFlow ID v0.6 (real measurement):${pre(EN)}`,
  vi: `LabFlow ID v0.6 (đo thật):${pre(EN)}`,
  cau: [
    q('c1', ['The naive /forgot-password has an identical message, yet a real account replies ~0.9 ms slower. Why?', 'Bản /forgot-password ngây thơ có thông điệp y hệt, vậy mà một tài khoản thật trả lời chậm hơn ~0,9 ms. Vì sao?'],
      ['It AWAITS the token insert + email for a real account — work a fake one skips', 'The real account is on a slower disk', 'Random network jitter, nothing more', 'The email provider rate-limits the real address'],
      ['Account-specific work awaited before replying leaks timing even with a uniform message — a timing oracle (6.4).', 'Việc riêng-tài-khoản được await trước khi trả lời rò thời gian kể cả với một thông điệp đồng nhất — một nhà tiên tri thời gian (6.4).']),
    q('c2', ['The fixed /forgot-password brings the difference into the noise. How?', 'Bản /forgot-password đã vá đưa chênh lệch vào nhiễu. Bằng cách nào?'],
      ['It fires the insert + email off the response path (not awaited)', 'It adds a random sleep to every request', 'It stops sending the email entirely', 'It caches the response for both addresses'],
      ['Moving the insert + send off the response path leaves both branches doing only the lookup, so the time matches (6.4).', 'Chuyển chèn + gửi ra ngoài đường phản hồi để cả hai nhánh chỉ làm phép tra, nên thời gian khớp (6.4).']),
    q('c3', ['/sign-up shows a taken vs free ratio of ~1x. Why, when only one branch creates a row?', '/sign-up cho tỉ lệ đã-dùng đối trống ~1x. Vì sao, khi chỉ một nhánh tạo một dòng?'],
      ['argon2 runs in BOTH branches, so it dominates both', 'Node caches the response for a repeated sign-up email', 'The database insert is the single slowest step here', 'The free email is rejected before any hashing runs'],
      ['Hashing in both branches makes argon2 (~190 ms) the cost of both, so creating a row is a rounding error — the constant-work fix (6.1, 6.4).', 'Băm ở cả hai nhánh khiến argon2 (~190 ms) là chi phí của cả hai, nên tạo một dòng là sai số làm tròn — cách vá công việc hằng định (6.1, 6.4).']),
  ],
  goiY: [['A uniform message does not mean a uniform clock.', 'Một thông điệp đồng nhất không nghĩa là một đồng hồ đồng nhất.'], ['Same work ⇒ same time.', 'Cùng công việc ⇒ cùng thời gian.']],
  loi: [['Thinking a fixed message closes enumeration.', 'Tưởng một thông điệp cố định đóng dò tài khoản.'], ['Thinking 0.9 ms is unexploitable.', 'Tưởng 0,9 ms không khai thác được.']],
  tns: [tn('timing oracle', 'nhà tiên tri thời gian'), tn('off the response path', 'ngoài đường phản hồi')],
  kn: ['account enumeration'],
});

function leaks(realMs, fakeMs) {
  // A consistent, measurable gap is a leak. We treat ≥ 0.3 ms as readable over many requests.
  return Math.abs(realMs - fakeMs) >= 0.3;
}
const S2 = jsBai({
  ten: '6.4-2 — Write leaks(realMs, fakeMs): is the timing a leak?', kho: 'EASY', phut: 8,
  en: `<p>Given the median reply time for a real account and a fake one, return <code>true</code> if the gap is a readable timing leak. Treat a difference of <b>0.3 ms or more</b> as readable (an attacker averages the jitter out over many requests); below that, treat it as noise.</p>`,
  vi: `<p>Cho thời gian trả lời trung vị của một tài khoản thật và một cái giả, trả <code>true</code> nếu khoảng cách là một cú rò thời gian đọc được. Coi một chênh lệch <b>0,3 ms trở lên</b> là đọc được (kẻ tấn công lấy trung bình bỏ nhiễu qua nhiều request); dưới đó, coi là nhiễu.</p>`,
  goiY: [['Use the absolute difference.', 'Dùng chênh lệch tuyệt đối.'], ['Consistency, not magnitude, makes it readable.', 'Tính nhất quán, không phải độ lớn, khiến nó đọc được.']],
  loi: [['Only flagging large gaps (e.g. ≥ 50 ms).', 'Chỉ báo khoảng cách lớn (vd ≥ 50 ms).'], ['Forgetting Math.abs for either ordering.', 'Quên Math.abs cho cả hai chiều.']],
  gt: ['The naive endpoint leaks ~0.9 ms (≥ 0.3), the fix ~0.01 ms (noise). A small but consistent gap is exploitable by averaging (6.4).', 'Tuyến ngây thơ rò ~0,9 ms (≥ 0,3), bản vá ~0,01 ms (nhiễu). Một khoảng cách nhỏ nhưng nhất quán khai thác được bằng lấy trung bình (6.4).'],
  kn: ['account enumeration'], tns: [tn('median over N requests', 'trung vị qua N request')],
  dau: `/** ⇒ true if the timing gap is a readable leak (≥ 0.3 ms) */
function leaks(realMs, fakeMs) {
  // Write your solution here
  return false;
}
`,
  giai: '// Reference solution\n' + nguon(leaks),
  cases: [
    { goi: goi('leaks', 2.0, 1.1), moTa: ['Naive: ~0.9 ms gap', 'Ngây thơ: khoảng ~0,9 ms'] },
    { goi: goi('leaks', 0.95, 0.94), an: true, moTa: ['Fixed: within noise', 'Đã vá: trong nhiễu'] },
    { goi: goi('leaks', 189.3, 194.6), an: true, moTa: ['Sign-up: both argon2', 'Đăng ký: cả hai argon2'] },
  ],
});

const S3 = cs({
  ten: '6.4-3 — Order the channels you must silence', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Enumeration leaks through four channels. Order them as you would audit: from the one everyone checks to the one everyone forgets.',
  vi: 'Dò tài khoản rò qua bốn kênh. Xếp chúng như khi bạn soát: từ cái ai cũng kiểm tới cái ai cũng quên.',
  cau: [ord('o1', ['Most-checked → most-forgotten', 'Hay-kiểm → hay-quên'], [
    'The message ("no such user" vs "check your inbox")',
    'The status code (404 vs 401)',
    'Side effects (a real account gets an email)',
    'The time (a real account does work a fake one skips)',
  ], ['Teams fix the message, then the status; side effects are subtler; the clock is the one almost nobody measures (6.4).', 'Các đội sửa thông điệp, rồi mã trạng thái; tác dụng phụ tinh vi hơn; cái đồng hồ là cái gần như không ai đo (6.4).'])],
  goiY: [['The clock is last because it is the one wording cannot fix.', 'Cái đồng hồ cuối vì nó là cái câu chữ không sửa được.'], ['Message and status are the two everyone checks first.', 'Thông điệp và mã trạng thái là hai cái ai cũng kiểm trước.']],
  loi: [['Putting timing first.', 'Đặt thời gian đầu tiên.'], ['Thinking side effects are checked before the message.', 'Tưởng tác dụng phụ được kiểm trước thông điệp.']],
  tns: [tn('side-channel', 'kênh bên')],
  kn: ['account enumeration'],
});

const S4 = cs({
  ten: '6.4-4 — Channel → how to close it', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each enumeration channel with how you close it.',
  vi: 'Ghép mỗi kênh dò tài khoản với cách bạn đóng nó.',
  bang: [bang1('b1', ['Channel → fix', 'Kênh → cách vá'], [{ ma: 'x', ten: 'Channel' }, { ma: 'q', ten: 'Close it by', luaChon: ['one generic response', 'same status for both', 'same work, or off the response path', 'send nothing a non-account sees'] }], [
    { o: { x: 'the message' }, a: { q: 'one generic response' } },
    { o: { x: 'the status code' }, a: { q: 'same status for both' } },
    { o: { x: 'the time' }, a: { q: 'same work, or off the response path' } },
    { o: { x: 'side effects' }, a: { q: 'send nothing a non-account sees' } },
  ], ['Message and status: make them uniform. Time: same work or move it off the path. Side effects: never send a "no account" mail (6.4).', 'Thông điệp và mã: làm đồng nhất. Thời gian: cùng công việc hoặc chuyển ra ngoài đường. Tác dụng phụ: không bao giờ gửi thư "không có tài khoản" (6.4).'])],
  goiY: [['Two channels are "make them identical"; the clock has two fixes.', 'Hai kênh là "làm y hệt"; cái đồng hồ có hai cách vá.'], ['A side effect is an email only a real account sees.', 'Một tác dụng phụ là một email chỉ tài khoản thật thấy.']],
  loi: [['Thinking a generic message also fixes timing.', 'Tưởng một thông điệp chung cũng vá thời gian.'], ['Sending a "no account" email to a stranger.', 'Gửi một thư "không có tài khoản" cho người lạ.']],
  kn: ['account enumeration'],
});

export default doiDau({ slug: 'auth-6-4-do-tai-khoan', ten: '6.4 Account enumeration', khoa: KHOA, baiHoc: 'auth-6-4-do-tai-khoan', de: [S1, S2, S3, S4] });
