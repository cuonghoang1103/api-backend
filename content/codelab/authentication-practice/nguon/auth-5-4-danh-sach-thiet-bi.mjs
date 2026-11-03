/** Authentication · 5.4 — Danh sách thiết bị: đọc output thật (3 thiết bị, thu hồi 1); tự viết groupDevices, canRevokeDevice; bảng. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s05/_ma.mjs';

const DV = OUT['54-devices'].split('\n').slice(1);

const S1 = cs({
  ten: '5.4-1 — The devices page: read the real run', kho: 'EASY', phut: 8,
  en: `LabFlow ID v0.5 (real run):${pre(DV)}`,
  vi: `LabFlow ID v0.5 (chạy thật):${pre(DV)}`,
  cau: [
    q('c1', ['Three logins, each refreshed many times, show as three rows. Why not dozens?', 'Ba lần đăng nhập, mỗi cái refresh nhiều lần, hiện thành ba dòng. Vì sao không hàng chục?'],
      ['It groups by family_id, and every rotation stays in its family', 'The page is capped and only shows the three newest tokens per user', 'Old tokens are permanently deleted from the table on each rotation', 'The browser caches the device list and never re-fetches it'],
      ['A family is one login on one device; GROUP BY family_id collapses its many rotated tokens into one device row (5.4).', 'Một họ là một lần đăng nhập trên một thiết bị; GROUP BY family_id gộp nhiều token đã xoay của nó thành một dòng thiết bị (5.4).']),
    q('c2', ['An revokes the phone and the phone’s next /refresh returns REVOKED. What about the laptop?', 'An thu hồi điện thoại và lần /refresh kế của điện thoại trả về REVOKED. Còn laptop thì sao?'],
      ['It keeps working — only the phone’s family was revoked', 'It is also revoked — revoking one revokes all', 'It must re-enter the password', 'Its access token is revoked but not the refresh token'],
      ['The revoke targets one family by id; other devices (families) are untouched, so only the phone is cut off (5.4).', 'Lệnh thu hồi nhắm một họ theo id; các thiết bị (họ) khác không bị đụng, nên chỉ điện thoại bị cắt (5.4).']),
    q('c3', ['An guesses a family_id that is not hers and tries to revoke it. The server returns {"revoked":0}. Why?', 'An đoán một family_id không phải của cô và thử thu hồi nó. Máy chủ trả {"revoked":0}. Vì sao?'],
      ['The revoke is scoped to her user id, so another family matches nothing', 'The family_id she guessed simply happened to be spelled wrong', 'The server rate-limited her for too many revoke attempts', 'The family she guessed had already expired on its own'],
      ['revokeFamilyForUser(userId, familyId) only touches families belonging to the caller — the BOLA/IDOR defence from Mục 0 on a device id (5.4).', 'revokeFamilyForUser(userId, familyId) chỉ đụng các họ thuộc về người gọi — phòng BOLA/IDOR từ Mục 0 trên một device id (5.4).']),
  ],
  goiY: [['Group by family, not by token.', 'Gộp theo họ, không theo token.'], ['Scope the revoke to the signed-in user.', 'Giới hạn lệnh thu hồi theo người đăng nhập.']],
  loi: [['Listing one row per token.', 'Liệt kê một dòng cho mỗi token.'], ['Revoking by family_id without an ownership check.', 'Thu hồi theo family_id mà không kiểm sở hữu.']],
  tns: [tn('devices page', 'trang thiết bị'), tn('IDOR / BOLA')],
  kn: ['session management'],
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
const T0 = Date.UTC(2026, 10, 3, 9, 0, 0);
const row = (familyId, userAgent, o) => Object.assign({ userId: 'usr_1', familyId: familyId, userAgent: userAgent, expiresAt: T0 + 30 * 24 * 3600e3, revokedAt: null }, o || {});
const ROWS = [
  row('fam_a', 'laptop'), row('fam_a', 'laptop'), row('fam_a', 'laptop'), // one login, three rotations
  row('fam_b', 'phone'),
  row('fam_c', 'labpc', { revokedAt: T0 }),      // revoked — not a live device
  row('fam_d', 'old', { expiresAt: T0 - 1000 }), // expired — not a live device
];
const S2 = jsBai({
  ten: '5.4-2 — Write groupDevices(rows, now): one row per live family', kho: 'MEDIUM', phut: 14,
  en: `<p>Build the devices list from refresh rows. Keep only <strong>live</strong> rows (<code>revokedAt</code> is null and <code>expiresAt &gt; now</code>), group them by <code>familyId</code>, and return one object per family: <code>{ familyId, userAgent, tokens }</code> where <code>tokens</code> is how many rows that family has. Sort the result by <code>familyId</code> ascending. Use the first row’s <code>userAgent</code> for the family.</p>`,
  vi: `<p>Dựng danh sách thiết bị từ các dòng refresh. Giữ chỉ các dòng <strong>sống</strong> (<code>revokedAt</code> null và <code>expiresAt &gt; now</code>), gộp chúng theo <code>familyId</code>, và trả một object cho mỗi họ: <code>{ familyId, userAgent, tokens }</code> trong đó <code>tokens</code> là số dòng của họ đó. Sắp kết quả theo <code>familyId</code> tăng dần. Dùng <code>userAgent</code> của dòng đầu cho họ.</p>`,
  goiY: [['Skip revoked and expired rows.', 'Bỏ các dòng revoked và expired.'], ['Group into an object keyed by familyId, then sort the keys.', 'Gộp vào một object khoá theo familyId, rồi sắp các khoá.']],
  loi: [['Counting revoked/expired rows as live devices.', 'Đếm các dòng revoked/expired là thiết bị sống.'], ['Returning one entry per token instead of per family.', 'Trả một mục cho mỗi token thay vì mỗi họ.']],
  gt: ['A family is one device; grouping its rotated tokens into one entry is the whole devices page, and filtering to live rows keeps revoked or expired logins off the list (5.4).', 'Một họ là một thiết bị; gộp các token đã xoay của nó thành một mục là cả trang thiết bị, và lọc còn các dòng sống giữ các lần đăng nhập đã thu hồi/hết hạn khỏi danh sách (5.4).'],
  kn: ['session management'], tns: [tn('family = device', 'họ = thiết bị')],
  dau: `/** ⇒ [{ familyId, userAgent, tokens }] for live families, sorted by familyId */
function groupDevices(rows, now) {
  // Write your solution here
  return rows.map(function (r) { return { familyId: r.familyId, userAgent: r.userAgent, tokens: 1 }; });
}
`,
  giai: '// Reference solution\n' + nguon(groupDevices),
  cases: [
    { goi: goi('groupDevices', ROWS, T0 + 60e3), moTa: ['3 logins incl. a revoked + expired one', '3 lần đăng nhập gồm một revoked + expired'] },
    { goi: goi('groupDevices', [], T0 + 60e3), an: true, moTa: ['No tokens', 'Không token'] },
    { goi: goi('groupDevices', [row('fam_x', 'tablet')], T0 + 60e3), an: true, moTa: ['One device', 'Một thiết bị'] },
    { goi: goi('groupDevices', [row('fam_y', 'g', { revokedAt: T0 })], T0 + 60e3), an: true, moTa: ['Only a revoked device', 'Chỉ một thiết bị đã thu hồi'] },
  ],
});

function canRevokeDevice(row, userId, familyId) {
  return !!(row && row.userId === userId && row.familyId === familyId && !row.revokedAt);
}
const S3 = jsBai({
  ten: '5.4-3 — Write canRevokeDevice(row, userId, familyId): the ownership check', kho: 'EASY', phut: 10,
  en: `<p>Before revoking a device, confirm it belongs to the caller. Return <code>true</code> only when <code>row</code> exists, <code>row.userId</code> equals <code>userId</code> (from the session), <code>row.familyId</code> equals the requested <code>familyId</code>, and the family is not already revoked (<code>row.revokedAt</code> is null). Otherwise <code>false</code>. A guessed id that is not the caller’s must return false — the IDOR/BOLA defence (Mục 0).</p>`,
  vi: `<p>Trước khi thu hồi một thiết bị, xác nhận nó thuộc về người gọi. Trả <code>true</code> chỉ khi <code>row</code> tồn tại, <code>row.userId</code> bằng <code>userId</code> (từ phiên), <code>row.familyId</code> bằng <code>familyId</code> được yêu cầu, và họ chưa bị thu hồi (<code>row.revokedAt</code> null). Còn lại <code>false</code>. Một id đoán không phải của người gọi phải trả false — phòng IDOR/BOLA (Mục 0).</p>`,
  goiY: [['Take the user id from the session, not the request.', 'Lấy user id từ phiên, không từ request.'], ['Both userId and familyId must match, and the row must be live.', 'Cả userId và familyId phải khớp, và dòng phải sống.']],
  loi: [['Checking only familyId — anyone could revoke anyone’s device.', 'Chỉ kiểm familyId — ai cũng thu hồi được thiết bị của người khác.'], ['Forgetting the null row case.', 'Quên trường hợp row null.']],
  gt: ['The session names the owner, not the request, so a guessed family id that is not yours fails this check — the same ownership rule as reading a resource by id (BOLA/IDOR, Mục 0; 5.4).', 'Phiên nêu chủ, không phải request, nên một family id đoán không phải của bạn trượt phép kiểm này — cùng luật sở hữu như đọc một tài nguyên theo id (BOLA/IDOR, Mục 0; 5.4).'],
  kn: ['session management'], tns: [tn('scoped revoke', 'thu hồi có giới hạn'), tn('IDOR / BOLA')],
  dau: `/** ⇒ true only if the family belongs to userId and is live */
function canRevokeDevice(row, userId, familyId) {
  // Write your solution here
  return !!row;
}
`,
  giai: '// Reference solution\n' + nguon(canRevokeDevice),
  cases: [
    { goi: goi('canRevokeDevice', row('fam_a', 'laptop'), 'usr_1', 'fam_a'), moTa: ['Owner, right family', 'Chủ, đúng họ'] },
    { goi: goi('canRevokeDevice', row('fam_a', 'laptop'), 'usr_2', 'fam_a'), an: true, moTa: ['Not the owner', 'Không phải chủ'] },
    { goi: goi('canRevokeDevice', row('fam_a', 'laptop'), 'usr_1', 'fam_guess'), an: true, moTa: ['Guessed family id', 'family id đoán'] },
    { goi: goi('canRevokeDevice', row('fam_a', 'laptop', { revokedAt: T0 }), 'usr_1', 'fam_a'), an: true, moTa: ['Already revoked', 'Đã thu hồi'] },
    { goi: 'canRevokeDevice(null, "usr_1", "fam_a")', an: true, moTa: ['No such family', 'Không có họ'] },
  ],
});

const PROP = ['when this login started', 'roughly where from', 'on what device/browser', 'which family to revoke'];
const S4 = cs({
  ten: '5.4-4 — The “is this you?” fields', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each devices-page column with what it tells the user.',
  vi: 'Ghép mỗi cột trang thiết bị với điều nó nói với người dùng.',
  bang: [bang1('b1', ['Column → meaning', 'Cột → nghĩa'], [{ ma: 'x', ten: 'Column' }, { ma: 'q', ten: 'Tells the user', luaChon: PROP }], [
    { o: { x: 'created_at' }, a: { q: 'when this login started' } },
    { o: { x: 'ip' }, a: { q: 'roughly where from' } },
    { o: { x: 'user_agent' }, a: { q: 'on what device/browser' } },
    { o: { x: 'family_id' }, a: { q: 'which family to revoke' } },
  ], ['Each column helps the user recognise or reject a login; family_id is the handle for the revoke (5.4).', 'Mỗi cột giúp người dùng nhận ra hoặc khước từ một lần đăng nhập; family_id là tay cầm cho lệnh thu hồi (5.4).'])],
  goiY: [['Time, place, device, and the revoke handle.', 'Thời gian, nơi, thiết bị, và tay cầm thu hồi.'], ['family_id is not shown to be read, but to be revoked.', 'family_id không hiện để đọc, mà để thu hồi.']],
  loi: [['Thinking ip tells the device.', 'Tưởng ip nói thiết bị.'], ['Thinking user_agent is the revoke key.', 'Tưởng user_agent là khoá thu hồi.']],
  kn: ['session management'],
});

export default doiDau({ slug: 'auth-5-4-danh-sach-thiet-bi', ten: '5.4 The devices page', khoa: KHOA, baiHoc: 'auth-5-4-danh-sach-thiet-bi', de: [S1, S2, S3, S4] });
