/** Authentication · Final project — the capstone; write defendsAgainst(scenario) mapping each attack to its chapter. */
import { doiDau, KHOA, cs, q, ord, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: 'Final-1 — The whole course, graded by attack', kho: 'MEDIUM', phut: 8,
  en: 'The capstone is LabFlow ID v1.0 graded by ~12 real attack scenarios, one per chapter, for 100 points (pass 70). A weak build scores low; the reference scores 100.',
  vi: 'Dự án cuối là LabFlow ID v1.0 chấm bởi ~12 kịch bản tấn công thật, mỗi cái một chương, cho 100 điểm (đạt 70). Một build yếu đạt thấp; bản tham khảo đạt 100.',
  cau: [
    q('c1', ['The weak build scores 25/100 — it got argon2id, cookie flags and refresh reuse right. Why is it still unsafe?', 'Build yếu đạt 25/100 — nó làm đúng argon2id, cờ cookie và tái dùng refresh. Vì sao vẫn không an toàn?'],
      ['It missed the hardening — it allows any authorization, never blocks a spray, logs secrets, enumerates emails, accepts alg:none', 'It is simply too slow to respond to each of the twelve attack scenarios within the grader time limit', 'It consumes too much memory while running all twelve attack scenarios at once and is killed midway', 'It actually passes every scenario correctly, but the grader rounds the final score down to 25 by mistake'],
      ['"Runs" is not "secure"; the basics are necessary but not sufficient — each ✗ is a chapter it skipped (Final, 9/10/11).', '"Chạy" không phải "an toàn"; cơ bản là cần nhưng chưa đủ — mỗi ✗ là một chương nó bỏ qua (Final, 9/10/11).']),
    q('c2', ['The alg:none scenario fails on a submission. Which chapter does that point to?', 'Kịch bản alg:none trượt trên một bản nộp. Điều đó chỉ vào chương nào?'],
      ['Chapter 4 — JWT algorithm handling; accepting alg:none lets anyone forge any token', 'Chapter 2 — the choice of password-hashing function and its tuned cost parameters', 'Chapter 6 — the account lifecycle, including verification and password reset flows', 'Chapter 11 — rate limiting the login endpoint and sharing the counter across instances'],
      ['alg:none is a token-forgery bypass from the JWT chapter (Final, 4.2).', 'alg:none là một cú bypass giả-token từ chương JWT (Final, 4.2).']),
    q('c3', ['What does passing the capstone demonstrate that a happy-path demo does not?', 'Qua dự án cuối chứng minh gì mà một demo đường-đẹp không?'],
      ['That the system resists a dozen real attacks — you can build it, break it, and fix it, and explain each defence by its attack', 'That the code compiles and runs without any syntax errors across all of the wired-together modules', 'That the user interface looks polished and professional enough to ship to real paying customers', 'That the login endpoint responds quickly and stays fast even under a fairly normal production load'],
      ['The capstone grades against attacks, not the happy path — the whole course, run as an adversary would (Final, 12.5).', 'Dự án cuối chấm với tấn công, không phải đường-đẹp — cả khoá, chạy như một kẻ thù (Final, 12.5).']),
  ],
  goiY: [['The basics are necessary but not sufficient.', 'Cơ bản là cần nhưng chưa đủ.'], ['Each failed scenario names a chapter.', 'Mỗi kịch bản trượt gọi tên một chương.']],
  loi: [['Thinking a happy-path demo proves security.', 'Tưởng một demo đường-đẹp chứng minh bảo mật.'], ['Thinking 25/100 passes (pass is 70).', 'Tưởng 25/100 đạt (đạt là 70).']],
  tns: [tn('capstone', 'dự án cuối'), tn('STAR story', 'câu chuyện STAR')],
  kn: ['authentication'],
});

const DEFENDS = { db_dump: 'Ch2', email_enumeration: 'Ch6', homograph_email: 'Ch6', session_guessing: 'Ch1/3', alg_none: 'Ch4', refresh_reuse: 'Ch5', cookie_posture: 'Ch3', forged_id_token: 'Ch8', totp_relay: 'Ch7/10', idor_cross_tenant: 'Ch9', stuffing_10k: 'Ch10', audit_log_leak: 'Ch11' };
function defendsAgainst(scenario) {
  // Map a capstone attack scenario to the chapter whose defence stops it. An unknown scenario ⇒ 'unknown'.
  return DEFENDS[scenario] || 'unknown';
}
const S2 = jsBai({
  ten: 'Final-2 — Write defendsAgainst(scenario): attack ⇒ chapter', kho: 'MEDIUM', phut: 12,
  en: `<p>Map each capstone attack scenario to the chapter whose defence stops it: <code>db_dump ⇒ 'Ch2'</code>, <code>email_enumeration ⇒ 'Ch6'</code>, <code>homograph_email ⇒ 'Ch6'</code>, <code>session_guessing ⇒ 'Ch1/3'</code>, <code>alg_none ⇒ 'Ch4'</code>, <code>refresh_reuse ⇒ 'Ch5'</code>, <code>cookie_posture ⇒ 'Ch3'</code>, <code>forged_id_token ⇒ 'Ch8'</code>, <code>totp_relay ⇒ 'Ch7/10'</code>, <code>idor_cross_tenant ⇒ 'Ch9'</code>, <code>stuffing_10k ⇒ 'Ch10'</code>, <code>audit_log_leak ⇒ 'Ch11'</code>. Unknown ⇒ <code>'unknown'</code>.</p>`,
  vi: `<p>Ánh xạ mỗi kịch bản tấn công của dự án cuối tới chương có phòng thủ chặn nó: <code>db_dump ⇒ 'Ch2'</code>, <code>email_enumeration ⇒ 'Ch6'</code>, <code>homograph_email ⇒ 'Ch6'</code>, <code>session_guessing ⇒ 'Ch1/3'</code>, <code>alg_none ⇒ 'Ch4'</code>, <code>refresh_reuse ⇒ 'Ch5'</code>, <code>cookie_posture ⇒ 'Ch3'</code>, <code>forged_id_token ⇒ 'Ch8'</code>, <code>totp_relay ⇒ 'Ch7/10'</code>, <code>idor_cross_tenant ⇒ 'Ch9'</code>, <code>stuffing_10k ⇒ 'Ch10'</code>, <code>audit_log_leak ⇒ 'Ch11'</code>. Lạ ⇒ <code>'unknown'</code>.</p>`,
  goiY: [['A lookup table maps the twelve scenarios.', 'Một bảng tra ánh xạ mười hai kịch bản.'], ['Each scenario is a chapter, run as an attack.', 'Mỗi kịch bản là một chương, chạy như một cú tấn công.']],
  loi: [['Mapping idor_cross_tenant to the wrong chapter.', 'Ánh xạ idor_cross_tenant tới sai chương.'], ['Returning undefined for an unknown scenario.', 'Trả undefined cho một kịch bản lạ.']],
  gt: ['Every capstone scenario is a lesson run as an attack; naming its chapter is the whole-course map (Final, 12.5).', 'Mỗi kịch bản dự án cuối là một bài chạy như một cú tấn công; gọi tên chương của nó là bản đồ cả khoá (Final, 12.5).'],
  kn: ['authentication'], tns: [tn('attack ⇒ chapter', 'tấn công ⇒ chương')],
  dau: `const DEFENDS = { db_dump: 'Ch2', email_enumeration: 'Ch6', homograph_email: 'Ch6', session_guessing: 'Ch1/3', alg_none: 'Ch4', refresh_reuse: 'Ch5', cookie_posture: 'Ch3', forged_id_token: 'Ch8', totp_relay: 'Ch7/10', idor_cross_tenant: 'Ch9', stuffing_10k: 'Ch10', audit_log_leak: 'Ch11' };
/** ⇒ the chapter whose defence stops this attack scenario */
function defendsAgainst(scenario) {
  // Write your solution here
  return 'unknown';
}
`,
  giai: `const DEFENDS = { db_dump: 'Ch2', email_enumeration: 'Ch6', homograph_email: 'Ch6', session_guessing: 'Ch1/3', alg_none: 'Ch4', refresh_reuse: 'Ch5', cookie_posture: 'Ch3', forged_id_token: 'Ch8', totp_relay: 'Ch7/10', idor_cross_tenant: 'Ch9', stuffing_10k: 'Ch10', audit_log_leak: 'Ch11' };
` + '// Reference solution\n' + nguon(defendsAgainst),
  cases: [
    { goi: goi('defendsAgainst', 'alg_none'), moTa: ['alg:none ⇒ Ch4', 'alg:none ⇒ Ch4'] },
    { goi: goi('defendsAgainst', 'idor_cross_tenant'), an: true, moTa: ['IDOR ⇒ Ch9', 'IDOR ⇒ Ch9'] },
    { goi: goi('defendsAgainst', 'stuffing_10k'), an: true, moTa: ['stuffing ⇒ Ch10', 'nhồi ⇒ Ch10'] },
    { goi: goi('defendsAgainst', 'mystery_attack'), an: true, moTa: ['unknown ⇒ unknown', 'lạ ⇒ unknown'] },
  ],
});

const S3 = cs({
  ten: 'Final-3 — Grade each submission', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order the three capstone submissions from the lowest grade to the highest.',
  vi: 'Xếp ba bản nộp dự án cuối từ điểm thấp nhất tới cao nhất.',
  cau: [ord('o1', ['Lowest → highest', 'Thấp → cao'], [
    'The empty starter (every decision a stub) — 0/100',
    'The "yeu" build (basics right, hardening missed) — 25/100',
    'The reference (every decision wired to the hardened module) — 100/100',
  ], ['The starter resists nothing; the yeu build gets the basics; the reference resists all twelve attacks (Final).', 'Bản khởi đầu không kháng gì; build yếu được cơ bản; bản tham khảo kháng cả mười hai cú tấn công (Final).'])],
  goiY: [['The basics alone are well under the 70 pass line.', 'Chỉ cơ bản thôi dưới xa mức đạt 70.'], ['Only the reference resists every attack.', 'Chỉ bản tham khảo kháng mọi cú tấn công.']],
  loi: [['Thinking the yeu build passes at 25.', 'Tưởng build yếu đạt ở 25.'], ['Thinking the starter resists some attacks.', 'Tưởng bản khởi đầu kháng vài cú tấn công.']],
  tns: [tn('pass = 70/100', 'đạt = 70/100')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-12-7-lab-du-an-cuoi-khoa', ten: 'Final project', khoa: KHOA, baiHoc: 'auth-12-7-lab-du-an-cuoi-khoa', de: [S1, S2, S3] });
