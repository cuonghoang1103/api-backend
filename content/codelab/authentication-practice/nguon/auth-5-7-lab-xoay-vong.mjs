/** Authentication · Lab 5 — Lớp refresh: dựng lại từng mảnh (rotateState, rotateAction) rồi gộp thiết bị (groupDevices), thuần JS. */
import { doiDau, KHOA, tn, jsBai, nguon, goi } from './_auth.mjs';

const T0 = Date.UTC(2026, 10, 3, 9, 0, 0);
const rec = (o) => Object.assign({ userId: 'usr_1', familyId: 'fam_1', createdAt: T0, expiresAt: T0 + 30 * 24 * 3600e3, usedAt: null, revokedAt: null }, o);

function rotateState(rec, now) {
  if (!rec) return 'INVALID';
  if (rec.revokedAt) return 'REVOKED';
  if (now >= rec.expiresAt) return 'EXPIRED';
  if (rec.usedAt) return 'USED';
  return 'LIVE';
}
const S1 = jsBai({
  ten: 'Lab 5·1 — rotateState(rec, now): classify a presented token', kho: 'MEDIUM', phut: 12, dangBai: 'lab',
  en: `<p>Part one of rotate. Return, in order: <code>'INVALID'</code> (rec null); <code>'REVOKED'</code> (<code>rec.revokedAt</code> set); <code>'EXPIRED'</code> (<code>now &gt;= rec.expiresAt</code>); <code>'USED'</code> (<code>rec.usedAt</code> set); otherwise <code>'LIVE'</code>. Times are epoch ms.</p>`,
  vi: `<p>Nửa đầu của rotate. Trả, theo thứ tự: <code>'INVALID'</code> (rec null); <code>'REVOKED'</code> (có <code>rec.revokedAt</code>); <code>'EXPIRED'</code> (<code>now &gt;= rec.expiresAt</code>); <code>'USED'</code> (có <code>rec.usedAt</code>); còn lại <code>'LIVE'</code>. Thời gian là epoch ms.</p>`,
  goiY: [['Order: null, revoked, expired, used, live.', 'Thứ tự: null, revoked, expired, used, live.'], ['Revoked and expired BEFORE used.', 'Revoked và expired TRƯỚC used.']],
  loi: [['Checking used before revoked/expired.', 'Kiểm used trước revoked/expired.'], ['Using > instead of >= at expiry.', 'Dùng > thay vì >= ở hết hạn.']],
  gt: ['The order is the safety: a dead token is rejected cleanly and never mistaken for the already-used case that triggers reuse detection (5.2).', 'Thứ tự chính là an toàn: một token chết bị từ chối gọn và không bao giờ bị nhầm với trường hợp đã-dùng kích hoạt phát hiện tái dùng (5.2).'],
  kn: ['refresh token'], tns: [tn('rotation', 'xoay vòng')],
  dau: `/** ⇒ 'INVALID' | 'REVOKED' | 'EXPIRED' | 'USED' | 'LIVE' */
function rotateState(rec, now) {
  // Write your solution here
  if (!rec) return 'INVALID';
  if (rec.usedAt) return 'USED';
  return 'LIVE';
}
`,
  giai: '// Reference solution\n' + nguon(rotateState),
  cases: [
    { goi: goi('rotateState', rec({}), T0 + 60e3), moTa: ['Live', 'Sống'] },
    { goi: goi('rotateState', rec({ usedAt: T0 + 30e3 }), T0 + 60e3), an: true, moTa: ['Used', 'Đã dùng'] },
    { goi: goi('rotateState', rec({ revokedAt: T0 + 40e3, usedAt: T0 + 30e3 }), T0 + 60e3), an: true, moTa: ['Revoked wins', 'Revoked thắng'] },
    { goi: goi('rotateState', rec({ expiresAt: T0 + 50e3 }), T0 + 60e3), an: true, moTa: ['Expired', 'Hết hạn'] },
    { goi: 'rotateState(null, ' + (T0 + 60e3) + ')', an: true, moTa: ['Invalid', 'Lạ'] },
  ],
});

function rotateAction(rec, now, graceMs) {
  if (!rec) return 'REJECT_INVALID';
  if (rec.revokedAt) return 'REJECT_REVOKED';
  if (now >= rec.expiresAt) return 'REJECT_EXPIRED';
  if (rec.usedAt) return now - rec.usedAt <= graceMs ? 'RACE' : 'REVOKE_FAMILY';
  return 'ROTATE';
}
const S2 = jsBai({
  ten: 'Lab 5·2 — rotateAction(rec, now, graceMs): the whole decision', kho: 'HARD', phut: 16, dangBai: 'lab',
  en: `<p>The full rotate decision (minus the database writes). Return: <code>'REJECT_INVALID'</code> (rec null); <code>'REJECT_REVOKED'</code>; <code>'REJECT_EXPIRED'</code> (<code>now &gt;= expiresAt</code>); if <code>rec.usedAt</code> is set, <code>'RACE'</code> when <code>now − usedAt &lt;= graceMs</code> else <code>'REVOKE_FAMILY'</code>; otherwise <code>'ROTATE'</code>. This is lessons 5.2 + 5.5 in one function.</p>`,
  vi: `<p>Toàn bộ quyết định rotate (trừ việc ghi cơ sở dữ liệu). Trả: <code>'REJECT_INVALID'</code> (rec null); <code>'REJECT_REVOKED'</code>; <code>'REJECT_EXPIRED'</code> (<code>now &gt;= expiresAt</code>); nếu có <code>rec.usedAt</code>, <code>'RACE'</code> khi <code>now − usedAt &lt;= graceMs</code> còn không <code>'REVOKE_FAMILY'</code>; còn lại <code>'ROTATE'</code>. Đây là bài 5.2 + 5.5 trong một hàm.</p>`,
  goiY: [['Reject dead tokens first; then the used-token branch.', 'Từ chối token chết trước; rồi nhánh token đã dùng.'], ['A used token within grace is a RACE, else REVOKE_FAMILY.', 'Một token đã dùng trong ân hạn là RACE, còn không REVOKE_FAMILY.']],
  loi: [['Treating a used token within grace as reuse (missing the race).', 'Coi một token đã dùng trong ân hạn là tái dùng (sót cuộc đua).'], ['Checking usedAt before revoked/expired.', 'Kiểm usedAt trước revoked/expired.']],
  gt: ['Reject invalid/revoked/expired cleanly, then split a used token into the legitimate race (within grace) and theft (after it) — the single decision behind LabFlow ID’s rotate (5.2, 5.5).', 'Từ chối invalid/revoked/expired gọn, rồi tách một token đã dùng thành cuộc đua hợp lệ (trong ân hạn) và trộm (sau đó) — quyết định duy nhất sau rotate của LabFlow ID (5.2, 5.5).'],
  kn: ['refresh token'], tns: [tn('reuse detection', 'phát hiện tái dùng'), tn('grace window', 'cửa sổ ân hạn')],
  dau: `/** ⇒ 'REJECT_INVALID' | 'REJECT_REVOKED' | 'REJECT_EXPIRED' | 'RACE' | 'REVOKE_FAMILY' | 'ROTATE' */
function rotateAction(rec, now, graceMs) {
  // Write your solution here
  if (!rec) return 'REJECT_INVALID';
  if (rec.usedAt) return 'REVOKE_FAMILY';
  return 'ROTATE';
}
`,
  giai: '// Reference solution\n' + nguon(rotateAction),
  cases: [
    { goi: goi('rotateAction', rec({}), T0 + 60e3, 10000), moTa: ['Live ⇒ ROTATE', 'Sống ⇒ ROTATE'] },
    { goi: goi('rotateAction', rec({ usedAt: T0 + 60e3 }), T0 + 60e3 + 50, 10000), an: true, moTa: ['Used 50 ms ago ⇒ RACE', 'Đã dùng 50 ms trước ⇒ RACE'] },
    { goi: goi('rotateAction', rec({ usedAt: T0 + 60e3 }), T0 + 60e3 + 11000, 10000), an: true, moTa: ['Used 11 s ago ⇒ REVOKE_FAMILY', 'Đã dùng 11 s trước ⇒ REVOKE_FAMILY'] },
    { goi: goi('rotateAction', rec({ revokedAt: T0 + 40e3 }), T0 + 60e3, 10000), an: true, moTa: ['Revoked', 'Đã thu hồi'] },
    { goi: goi('rotateAction', rec({ expiresAt: T0 + 50e3 }), T0 + 60e3, 10000), an: true, moTa: ['Expired', 'Hết hạn'] },
    { goi: 'rotateAction(null, ' + (T0 + 60e3) + ', 10000)', an: true, moTa: ['Invalid', 'Lạ'] },
  ],
});

function groupDevices(rows, now) {
  var fam = {};
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    if (r.revokedAt || r.expiresAt <= now) continue;
    if (!fam[r.familyId]) fam[r.familyId] = { familyId: r.familyId, userAgent: r.userAgent, tokens: 0 };
    fam[r.familyId].tokens++;
  }
  return Object.keys(fam).sort().map(function (k) { return fam[k]; });
}
const drow = (familyId, userAgent, o) => Object.assign({ userId: 'usr_1', familyId: familyId, userAgent: userAgent, expiresAt: T0 + 30 * 24 * 3600e3, revokedAt: null }, o || {});
const DROWS = [drow('fam_a', 'laptop'), drow('fam_a', 'laptop'), drow('fam_b', 'phone'), drow('fam_c', 'g', { revokedAt: T0 })];
const S3 = jsBai({
  ten: 'Lab 5·3 — groupDevices(rows, now): the devices page', kho: 'MEDIUM', phut: 14, dangBai: 'lab',
  en: `<p>Build the devices list. Keep only live rows (<code>revokedAt</code> null and <code>expiresAt &gt; now</code>), group by <code>familyId</code>, and return <code>{ familyId, userAgent, tokens }</code> per family (<code>tokens</code> = row count, <code>userAgent</code> = the first row’s), sorted by <code>familyId</code> ascending.</p>`,
  vi: `<p>Dựng danh sách thiết bị. Giữ chỉ các dòng sống (<code>revokedAt</code> null và <code>expiresAt &gt; now</code>), gộp theo <code>familyId</code>, và trả <code>{ familyId, userAgent, tokens }</code> cho mỗi họ (<code>tokens</code> = số dòng, <code>userAgent</code> = của dòng đầu), sắp theo <code>familyId</code> tăng dần.</p>`,
  goiY: [['Skip revoked/expired rows.', 'Bỏ các dòng revoked/expired.'], ['Group into an object, then sort the keys.', 'Gộp vào một object, rồi sắp các khoá.']],
  loi: [['Counting revoked/expired rows.', 'Đếm các dòng revoked/expired.'], ['One entry per token instead of per family.', 'Một mục cho mỗi token thay vì mỗi họ.']],
  gt: ['A family is one device; grouping rotated tokens into one entry and filtering to live rows is the whole devices page (5.4).', 'Một họ là một thiết bị; gộp các token đã xoay thành một mục và lọc còn các dòng sống là cả trang thiết bị (5.4).'],
  kn: ['session management'], tns: [tn('family = device', 'họ = thiết bị')],
  dau: `/** ⇒ [{ familyId, userAgent, tokens }] for live families, sorted by familyId */
function groupDevices(rows, now) {
  // Write your solution here
  return rows.map(function (r) { return { familyId: r.familyId, userAgent: r.userAgent, tokens: 1 }; });
}
`,
  giai: '// Reference solution\n' + nguon(groupDevices),
  cases: [
    { goi: goi('groupDevices', DROWS, T0 + 60e3), moTa: ['2 live families (one revoked skipped)', '2 họ sống (bỏ một đã thu hồi)'] },
    { goi: goi('groupDevices', [], T0 + 60e3), an: true, moTa: ['No tokens', 'Không token'] },
    { goi: goi('groupDevices', [drow('fam_z', 'tablet')], T0 + 60e3), an: true, moTa: ['One device', 'Một thiết bị'] },
  ],
});

export default doiDau({ slug: 'auth-5-7-lab-xoay-vong', ten: 'Lab 5 — The refresh layer', khoa: KHOA, baiHoc: 'auth-5-7-lab-xoay-vong', de: [S1, S2, S3] });
