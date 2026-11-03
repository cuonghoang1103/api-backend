/** Authentication · 5.2 — Xoay vòng: đọc output thật (họ r0→r1→r2, tái dùng ⇒ thu hồi họ); tự viết rotateState, reuseOrRace; bảng. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s05/_ma.mjs';

const RR = OUT['52-rotate-reuse'].split('\n').slice(1);

const S1 = cs({
  ten: '5.2-1 — Rotation and reuse: read the real run', kho: 'MEDIUM', phut: 8,
  en: `LabFlow ID v0.5 (real run):${pre(RR)}`,
  vi: `LabFlow ID v0.5 (chạy thật):${pre(RR)}`,
  cau: [
    q('c1', ['After An refreshes twice, how many tokens are live, and which?', 'Sau khi An refresh hai lần, bao nhiêu token sống, và cái nào?'],
      ['One — r2; r0 and r1 are marked used', 'Three — r0, r1 and r2 all work', 'Two — r1 and r2', 'None — refreshing expires them all'],
      ['Rotation marks each used token and mints the next; only the one token whose used flag is empty (r2) is accepted (5.2).', 'Xoay vòng đánh dấu mỗi token đã dùng và đúc cái kế; chỉ một token mà cờ đã-dùng còn trống (r2) được chấp nhận (5.2).']),
    q('c2', ['The thief replays r0 long after it was rotated. What does the server do?', 'Kẻ cắp phát lại r0 lâu sau khi nó bị xoay. Máy chủ làm gì?'],
      ['Revokes the whole family (REUSE_DETECTED) — including the live r2', 'Rejects only r0 and lets r2 keep working', 'Issues the thief a new token in the family', 'Ignores it because r0 was already used'],
      ['An already-used token coming back never happens on the honest path, so it is treated as theft and the whole family is revoked (5.2).', 'Một token đã dùng quay lại không bao giờ xảy ra trên đường ngay thẳng, nên bị coi là trộm và cả họ bị thu hồi (5.2).']),
    q('c3', ['After reuse detection, An’s next real refresh (with r2) returns what?', 'Sau phát hiện tái dùng, lần refresh thật kế của An (với r2) trả về gì?'],
      ['REVOKED — the family was revoked, so even the live token is dead', 'A new token — r2 was still valid', 'EXPIRED — r2 timed out', 'RACE — it is treated as a browser race'],
      ['Reuse revokes every token of the family, including r2, so the real user is signed out and must re-authenticate (5.2).', 'Tái dùng thu hồi mọi token của họ, kể cả r2, nên người thật bị đăng xuất và phải xác thực lại (5.2).']),
  ],
  goiY: [['Only one token in a family is live at a time.', 'Chỉ một token trong một họ sống tại một thời điểm.'], ['Reuse revokes the family, not just the token.', 'Tái dùng thu hồi họ, không chỉ token.']],
  loi: [['Thinking only the replayed token is rejected.', 'Tưởng chỉ token bị phát lại bị từ chối.'], ['Thinking the live token survives a reuse.', 'Tưởng token sống sót sau một lần tái dùng.']],
  tns: [tn('rotation', 'xoay vòng'), tn('reuse detection', 'phát hiện tái dùng')],
  kn: ['refresh token'],
});

function rotateState(rec, now) {
  if (!rec) return 'INVALID';
  if (rec.revokedAt) return 'REVOKED';
  if (now >= rec.expiresAt) return 'EXPIRED';
  if (rec.usedAt) return 'USED';
  return 'LIVE';
}
const T0 = Date.UTC(2026, 10, 3, 9, 0, 0);
const rec = (o) => Object.assign({ userId: 'usr_1', familyId: 'fam_1', createdAt: T0, expiresAt: T0 + 30 * 24 * 3600e3, usedAt: null, revokedAt: null }, o);
const S2 = jsBai({
  ten: '5.2-2 — Write rotateState(rec, now): the state of a presented token', kho: 'MEDIUM', phut: 14,
  en: `<p>The first half of rotation: classify the row a presented refresh token maps to. Return, in order: <code>'INVALID'</code> if <code>rec</code> is null; <code>'REVOKED'</code> if <code>rec.revokedAt</code> is set; <code>'EXPIRED'</code> if <code>now &gt;= rec.expiresAt</code>; <code>'USED'</code> if <code>rec.usedAt</code> is set (already rotated — a race or theft, decided next); otherwise <code>'LIVE'</code>. <code>now</code>, <code>expiresAt</code>, <code>usedAt</code>, <code>revokedAt</code> are epoch ms (or null).</p>`,
  vi: `<p>Nửa đầu của xoay vòng: phân loại dòng mà một refresh token được trình ánh xạ tới. Trả, theo thứ tự: <code>'INVALID'</code> nếu <code>rec</code> null; <code>'REVOKED'</code> nếu có <code>rec.revokedAt</code>; <code>'EXPIRED'</code> nếu <code>now &gt;= rec.expiresAt</code>; <code>'USED'</code> nếu có <code>rec.usedAt</code> (đã xoay — một cuộc đua hoặc trộm, quyết định sau); còn lại <code>'LIVE'</code>. <code>now</code>, <code>expiresAt</code>, <code>usedAt</code>, <code>revokedAt</code> là epoch ms (hoặc null).</p>`,
  goiY: [['Order: null, revoked, expired, used, live.', 'Thứ tự: null, revoked, expired, used, live.'], ['Check revoked and expired BEFORE used, so a dead token is not a “race”.', 'Kiểm revoked và expired TRƯỚC used, để một token chết không thành "cuộc đua".']],
  loi: [['Checking used before revoked/expired — a revoked token would look like a race.', 'Kiểm used trước revoked/expired — một token đã thu hồi sẽ trông như một cuộc đua.'], ['Using > instead of >= at expiry.', 'Dùng > thay vì >= ở hết hạn.']],
  gt: ['The order is the safety: a revoked or expired token must be rejected cleanly, never mistaken for the already-used case that triggers reuse detection (5.2, 5.5).', 'Thứ tự chính là an toàn: một token đã thu hồi hay hết hạn phải bị từ chối gọn, không bao giờ bị nhầm với trường hợp đã-dùng kích hoạt phát hiện tái dùng (5.2, 5.5).'],
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
    { goi: goi('rotateState', rec({}), T0 + 60e3), moTa: ['A live token', 'Token sống'] },
    { goi: goi('rotateState', rec({ usedAt: T0 + 30e3 }), T0 + 60e3), an: true, moTa: ['Already rotated', 'Đã xoay'] },
    { goi: goi('rotateState', rec({ revokedAt: T0 + 40e3 }), T0 + 60e3), an: true, moTa: ['Family revoked', 'Họ đã thu hồi'] },
    { goi: goi('rotateState', rec({ revokedAt: T0 + 40e3, usedAt: T0 + 30e3 }), T0 + 60e3), an: true, moTa: ['Revoked AND used ⇒ REVOKED', 'Thu hồi VÀ đã dùng ⇒ REVOKED'] },
    { goi: goi('rotateState', rec({ expiresAt: T0 + 50e3 }), T0 + 60e3), an: true, moTa: ['Past expiry', 'Quá hạn'] },
    { goi: 'rotateState(null, ' + (T0 + 60e3) + ')', an: true, moTa: ['Unknown token', 'Token lạ'] },
  ],
});

function reuseOrRace(rec, now, graceMs) {
  return now - rec.usedAt <= graceMs ? 'RACE' : 'REUSE';
}
const S3 = jsBai({
  ten: '5.2-3 — Write reuseOrRace(rec, now, graceMs): a used token — race or theft?', kho: 'MEDIUM', phut: 12,
  en: `<p>When <code>rotateState</code> returns <code>'USED'</code>, decide whether it is the legitimate browser race (lesson 5.5) or theft. Given a <code>rec</code> whose <code>usedAt</code> is set: return <code>'RACE'</code> if it was rotated within the grace window (<code>now − rec.usedAt &lt;= graceMs</code>), otherwise <code>'REUSE'</code>. A real race is milliseconds; a replay is much later.</p>`,
  vi: `<p>Khi <code>rotateState</code> trả <code>'USED'</code>, quyết định đó là cuộc đua trình duyệt hợp lệ (bài 5.5) hay trộm. Cho một <code>rec</code> có <code>usedAt</code>: trả <code>'RACE'</code> nếu nó được xoay trong cửa sổ ân hạn (<code>now − rec.usedAt &lt;= graceMs</code>), còn lại <code>'REUSE'</code>. Một cuộc đua thật là mili giây; một lần phát lại muộn hơn nhiều.</p>`,
  goiY: [['Compare now − usedAt with graceMs.', 'So now − usedAt với graceMs.'], ['Within grace ⇒ race; after ⇒ reuse.', 'Trong ân hạn ⇒ đua; sau ⇒ tái dùng.']],
  loi: [['Using < instead of <= at the boundary.', 'Dùng < thay vì <= ở biên.'], ['Treating every used token as reuse (no grace).', 'Coi mọi token đã dùng là tái dùng (không ân hạn).']],
  gt: ['A browser race is over in milliseconds, so a used token seen within the short grace window is the same login refreshing twice; later than that, a copy is loose and it is theft (5.5).', 'Một cuộc đua trình duyệt xong trong mili giây, nên một token đã dùng thấy trong cửa sổ ân hạn ngắn là cùng một lần đăng nhập refresh hai lần; muộn hơn, một bản đang lọt ra ngoài và đó là trộm (5.5).'],
  kn: ['refresh token'], tns: [tn('grace window', 'cửa sổ ân hạn')],
  dau: `/** rec.usedAt is set ⇒ 'RACE' | 'REUSE' */
function reuseOrRace(rec, now, graceMs) {
  // Write your solution here
  return 'REUSE';
}
`,
  giai: '// Reference solution\n' + nguon(reuseOrRace),
  cases: [
    { goi: goi('reuseOrRace', { usedAt: T0 }, T0 + 50, 10000), moTa: ['50 ms later (race)', 'Sau 50 ms (đua)'] },
    { goi: goi('reuseOrRace', { usedAt: T0 }, T0 + 10000, 10000), an: true, moTa: ['Exactly at grace', 'Đúng biên ân hạn'] },
    { goi: goi('reuseOrRace', { usedAt: T0 }, T0 + 11000, 10000), an: true, moTa: ['11 s later (reuse)', 'Sau 11 s (tái dùng)'] },
    { goi: goi('reuseOrRace', { usedAt: T0 }, T0 + 3600e3, 10000), an: true, moTa: ['An hour later (reuse)', 'Một giờ sau (tái dùng)'] },
  ],
});

const RESP = ['rotate: mark used, mint the next', 'return the child the first request minted (race)', 'revoke the whole family (REUSE_DETECTED)', 'REVOKED', 'EXPIRED'];
const S4 = cs({
  ten: '5.2-4 — A token comes in → the response', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each presented refresh token with the server’s response.',
  vi: 'Ghép mỗi refresh token được trình với phản hồi của máy chủ.',
  bang: [bang1('b1', ['Token → response', 'Token → phản hồi'], [{ ma: 'x', ten: 'Token presented' }, { ma: 'q', ten: 'Response', luaChon: RESP }], [
    { o: { x: 'the current token (used flag empty)' }, a: { q: 'rotate: mark used, mint the next' } },
    { o: { x: 'an already-rotated token, within grace' }, a: { q: 'return the child the first request minted (race)' } },
    { o: { x: 'an already-rotated token, after grace' }, a: { q: 'revoke the whole family (REUSE_DETECTED)' } },
    { o: { x: 'a token from a revoked family' }, a: { q: 'REVOKED' } },
    { o: { x: 'a token past the 30 days' }, a: { q: 'EXPIRED' } },
  ], ['The live token rotates; a used token is a race within grace or theft after it; a revoked/expired token is rejected cleanly (5.2, 5.5).', 'Token sống thì xoay; một token đã dùng là đua trong ân hạn hoặc trộm sau đó; một token đã thu hồi/hết hạn bị từ chối gọn (5.2, 5.5).'])],
  goiY: [['Within grace is a race; after grace is theft.', 'Trong ân hạn là đua; sau ân hạn là trộm.'], ['Revoked and expired are their own codes.', 'Revoked và expired là mã riêng.']],
  loi: [['Thinking a used token is always theft.', 'Tưởng một token đã dùng luôn là trộm.'], ['Thinking an expired token triggers reuse detection.', 'Tưởng một token hết hạn kích hoạt phát hiện tái dùng.']],
  kn: ['refresh token'],
});

export default doiDau({ slug: 'auth-5-2-xoay-vong', ten: '5.2 Rotation and reuse', khoa: KHOA, baiHoc: 'auth-5-2-xoay-vong', de: [S1, S2, S3, S4] });
