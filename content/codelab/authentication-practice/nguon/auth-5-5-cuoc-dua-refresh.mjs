/** Authentication · 5.5 — Cuộc đua refresh: đọc output thật (grace 10 s vs 0); tự viết raceOutcome; sắp + bảng. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s05/_ma.mjs';

const RA = OUT['55-race'].split('\n').slice(1);

const S1 = cs({
  ten: '5.5-1 — The refresh race: read the real run', kho: 'MEDIUM', phut: 8,
  en: `LabFlow ID v0.5 (real run):${pre(RA)}`,
  vi: `LabFlow ID v0.5 (chạy thật):${pre(RA)}`,
  cau: [
    q('c1', ['With the 10-second grace window, two tabs refresh at once. What happens?', 'Với cửa sổ ân hạn 10 giây, hai tab refresh cùng lúc. Chuyện gì xảy ra?'],
      ['Both tabs get the same new token (the second from the grace window) and stay signed in', 'The second tab triggers REUSE_DETECTED', 'Both tabs get different tokens and the family is revoked', 'The second request is rejected as expired'],
      ['Within the grace window, a second use of the just-rotated token returns the first request’s new child, so a race is not mistaken for theft (5.5).', 'Trong cửa sổ ân hạn, một lần dùng thứ hai của token vừa xoay trả về cái con của request đầu, nên một cuộc đua không bị nhầm là trộm (5.5).']),
    q('c2', ['With the grace window set to zero (naive rotation), the same race gives what?', 'Với cửa sổ ân hạn đặt bằng không (xoay vòng ngây thơ), cùng cuộc đua cho gì?'],
      ['REUSE_DETECTED — the real user is logged out (a false positive)', 'The same token to both tabs', 'EXPIRED for the second tab', 'Nothing changes — grace does not matter'],
      ['Without a grace window, the second request looks exactly like reuse, so the family is revoked and an honest user is logged out (5.5).', 'Không có cửa sổ ân hạn, request thứ hai trông đúng như tái dùng, nên họ bị thu hồi và một người ngay thẳng bị đăng xuất (5.5).']),
    q('c3', ['Why is a false positive here so damaging?', 'Vì sao một cảnh báo giả ở đây gây hại đến thế?'],
      ['A control that logs real users out gets turned off — losing the protection', 'It noticeably slows down every single request to the server', 'It gradually fills the database with revoked refresh tokens', 'It only annoys users a little, with no real security cost'],
      ['A detector that fires on normal use (two tabs) gets disabled by the team, losing reuse detection entirely — so the false positive removes the feature (5.5).', 'Một bộ phát hiện nổ khi dùng bình thường (hai tab) bị đội tắt, mất hẳn phát hiện tái dùng — nên cảnh báo giả gỡ mất tính năng (5.5).']),
  ],
  goiY: [['The grace window is the whole difference.', 'Cửa sổ ân hạn là toàn bộ khác biệt.'], ['A race is milliseconds; a replay is much later.', 'Một cuộc đua là mili giây; một lần phát lại muộn hơn nhiều.']],
  loi: [['Setting the grace window to zero.', 'Đặt cửa sổ ân hạn bằng không.'], ['Making the grace window minutes long.', 'Làm cửa sổ ân hạn dài vài phút.']],
  tns: [tn('refresh race', 'cuộc đua refresh'), tn('false positive', 'cảnh báo giả')],
  kn: ['refresh token'],
});

function raceOutcome(graceMs, gapMs) {
  return gapMs <= graceMs ? 'BOTH_STAY_IN' : 'REUSE_FLAGGED';
}
const S2 = jsBai({
  ten: '5.5-2 — Write raceOutcome(graceMs, gapMs): does the second tab stay in?', kho: 'MEDIUM', phut: 12,
  en: `<p>Two tabs refresh with the same cookie; <code>gapMs</code> is how far behind the second request is. With a grace window of <code>graceMs</code>, return <code>'BOTH_STAY_IN'</code> if the second arrives within the window (<code>gapMs &lt;= graceMs</code> — it gets the first’s new token), otherwise <code>'REUSE_FLAGGED'</code> (treated as theft, the family is revoked). With <code>graceMs = 0</code> any race is flagged.</p>`,
  vi: `<p>Hai tab refresh với cùng cookie; <code>gapMs</code> là request thứ hai đến sau bao xa. Với cửa sổ ân hạn <code>graceMs</code>, trả <code>'BOTH_STAY_IN'</code> nếu cái thứ hai đến trong cửa sổ (<code>gapMs &lt;= graceMs</code> — nó nhận token mới của cái đầu), còn lại <code>'REUSE_FLAGGED'</code> (coi là trộm, họ bị thu hồi). Với <code>graceMs = 0</code> mọi cuộc đua bị báo.</p>`,
  goiY: [['Compare gapMs with graceMs.', 'So gapMs với graceMs.'], ['graceMs = 0 ⇒ every race is flagged.', 'graceMs = 0 ⇒ mọi cuộc đua bị báo.']],
  loi: [['Using < instead of <= at the boundary.', 'Dùng < thay vì <= ở biên.'], ['Returning BOTH_STAY_IN when graceMs is 0.', 'Trả BOTH_STAY_IN khi graceMs là 0.']],
  gt: ['A real race is milliseconds, so a short window keeps both tabs signed in; set the window to zero and the same race is a false positive that logs the user out (5.5).', 'Một cuộc đua thật là mili giây, nên một cửa sổ ngắn giữ cả hai tab đăng nhập; đặt cửa sổ bằng không và cùng cuộc đua là một cảnh báo giả đăng xuất người dùng (5.5).'],
  kn: ['refresh token'], tns: [tn('grace window', 'cửa sổ ân hạn')],
  dau: `/** ⇒ 'BOTH_STAY_IN' | 'REUSE_FLAGGED' */
function raceOutcome(graceMs, gapMs) {
  // Write your solution here
  return 'BOTH_STAY_IN';
}
`,
  giai: '// Reference solution\n' + nguon(raceOutcome),
  cases: [
    { goi: goi('raceOutcome', 10000, 50), moTa: ['Grace 10 s, 50 ms race', 'Grace 10 s, đua 50 ms'] },
    { goi: goi('raceOutcome', 0, 50), an: true, moTa: ['No grace — false positive', 'Không grace — cảnh báo giả'] },
    { goi: goi('raceOutcome', 10000, 10000), an: true, moTa: ['Exactly at the window', 'Đúng biên cửa sổ'] },
    { goi: goi('raceOutcome', 10000, 11000), an: true, moTa: ['11 s later — a replay', 'Sau 11 s — một lần phát lại'] },
  ],
});

const S3 = cs({
  ten: '5.5-3 — The race timeline', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Put the grace-window race in order (what happens, first to last, in a handled race).',
  vi: 'Xếp cuộc đua cửa sổ ân hạn theo thứ tự (chuyện gì xảy ra, đầu tới cuối, trong một cuộc đua được xử lý).',
  cau: [ord('o1', ['First to last', 'Trước tới sau'], [
    'Tab A refreshes first: it rotates the token, marks it used, and caches the new child',
    'Tab B arrives a moment later with the same, now-used cookie',
    'Within the grace window, the server returns the cached child to tab B',
    'Both tabs now hold the same new token and stay signed in',
  ], ['The first request caches its result; the second, within the window, gets the same new token — so a race ends with both tabs in, not a false theft alarm (5.5).', 'Request đầu cache kết quả của nó; cái thứ hai, trong cửa sổ, nhận cùng token mới — nên một cuộc đua kết thúc với cả hai tab đăng nhập, không phải một báo động trộm giả (5.5).'])],
  goiY: [['The first request caches the child for the window.', 'Request đầu cache cái con cho cửa sổ.'], ['The second request reads the cache.', 'Request thứ hai đọc cache.']],
  loi: [['Thinking the second request mints a second token.', 'Tưởng request thứ hai đúc một token thứ hai.'], ['Thinking the race revokes the family.', 'Tưởng cuộc đua thu hồi họ.']],
  tns: [tn('grace window', 'cửa sổ ân hạn')],
  kn: ['refresh token'],
});

const OUTC = ['both tabs get the same token, stay in', 'REUSE_DETECTED — user logged out', 'REUSE_DETECTED (both)'];
const S4 = cs({
  ten: '5.5-4 — Grace vs no grace', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each second request with the outcome under a 10-second grace window vs none.',
  vi: 'Ghép mỗi request thứ hai với kết quả dưới cửa sổ ân hạn 10 giây đối lại không có.',
  bang: [bang1('b1', ['Case → outcome', 'Trường hợp → kết quả'], [{ ma: 'x', ten: 'Second request' }, { ma: 'q', ten: 'Outcome', luaChon: OUTC }], [
    { o: { x: '50 ms after the first, grace 10 s (a race)' }, a: { q: 'both tabs get the same token, stay in' } },
    { o: { x: '50 ms after the first, grace 0 (naive)' }, a: { q: 'REUSE_DETECTED — user logged out' } },
    { o: { x: '11 s after the first (a replay)' }, a: { q: 'REUSE_DETECTED (both)' } },
  ], ['The short grace window turns a race into one shared token; with no window the same race is a false positive; a genuine replay is theft either way (5.5).', 'Cửa sổ ân hạn ngắn biến một cuộc đua thành một token chung; không cửa sổ thì cùng cuộc đua là một cảnh báo giả; một lần phát lại thật là trộm dù sao (5.5).'])],
  goiY: [['Within grace is a race; without grace it is flagged.', 'Trong ân hạn là đua; không ân hạn thì bị báo.'], ['A late replay is theft under any window.', 'Một lần phát lại muộn là trộm dưới mọi cửa sổ.']],
  loi: [['Thinking grace 0 handles the race.', 'Tưởng grace 0 xử lý được cuộc đua.'], ['Thinking an 11 s replay is a race.', 'Tưởng một lần phát lại 11 s là một cuộc đua.']],
  kn: ['refresh token'],
});

export default doiDau({ slug: 'auth-5-5-cuoc-dua-refresh', ten: '5.5 The refresh race', khoa: KHOA, baiHoc: 'auth-5-5-cuoc-dua-refresh', de: [S1, S2, S3, S4] });
