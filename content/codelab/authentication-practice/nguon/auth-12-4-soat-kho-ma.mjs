/** Authentication · 12.4 — Reviewing code; write reviewFlag(line) detecting an auth anti-pattern. */
import { doiDau, KHOA, cs, q, ord, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: '12.4-1 — Review highest risk first', kho: 'MEDIUM', phut: 8,
  en: 'Review an auth codebase from the highest-risk thing down: the gate, a token end to end, recovery, config, the data.',
  vi: 'Soát một kho mã xác thực từ thứ rủi-ro-cao-nhất xuống: cổng, một token từ đầu tới cuối, khôi phục, cấu hình, dữ liệu.',
  cau: [
    q('c1', ['You inherit an auth service for a review. What do you look at first, and why?', 'Bạn thừa kế một dịch vụ xác thực cho một lần soát. Nhìn cái gì trước, và vì sao?'],
      ['The authorization gate — is there ONE, deny-by-default, on every write route; Broken Access Control is OWASP #1', 'The variable and function naming conventions used consistently across all of the source files', 'The length and cyclomatic complexity of each individual function body throughout the codebase', 'The code formatting, indentation and the style of the commit messages in the git history'],
      ['Review highest-risk first; the one gate (or its absence) is where the real bugs are (12.4, 9.5).', 'Soát rủi-ro-cao trước; một cổng (hay sự vắng mặt của nó) là nơi lỗi thật ở (12.4, 9.5).']),
    q('c2', ['The code "cannot produce state X", but you are asked whether X exists in production. What do you do?', 'Mã "không thể tạo trạng thái X", nhưng bạn được hỏi X có tồn tại ở production không. Bạn làm gì?'],
      ['Ask the data with a query — possibility is not reality; migrations and manual edits have their own history', 'Trust the code reasoning; if the code genuinely cannot produce state X, then X simply does not exist', 'Rewrite the relevant code paths to be absolutely certain that producing state X is impossible from now on', 'Add a prominent code comment documenting that state X is impossible so future readers do not worry'],
      ['Data has its own history; a question about current state is answered by the data, not the code (12.4).', 'Dữ liệu có lịch sử riêng; một câu hỏi về trạng thái hiện tại được trả lời bởi dữ liệu, không phải mã (12.4).']),
    q('c3', ['A test for "cross-tenant access is blocked" passes. What must you confirm before trusting it?', 'Một test cho "truy cập khác tenant bị chặn" qua. Bạn phải xác nhận gì trước khi tin nó?'],
      ['That the test actually runs and fails when cross-tenant access is allowed — a green test on a disabled check proves nothing', 'That the test file is formatted correctly and follows the project style guide conventions throughout', 'That the test has a clear, descriptive name explaining exactly what cross-tenant behaviour it checks', 'That the test runs quickly enough to not slow down the continuous integration pipeline on every push'],
      ['Verify the checker: a passing test proves nothing if the test is wrong or disabled (12.4).', 'Xác minh cái chắn: một test qua chẳng chứng minh gì nếu test sai hay bị tắt (12.4).']),
  ],
  goiY: [['Start at the gate, follow a token, read config and data.', 'Bắt đầu từ cổng, lần một token, đọc cấu hình và dữ liệu.'], ['Possibility is not reality.', 'Khả năng không phải thực tế.']],
  loi: [['Reviewing for style instead of risk.', 'Soát vì phong cách thay vì rủi ro.'], ['Trusting a green test without verifying it.', 'Tin một test xanh mà không xác minh nó.']],
  tns: [tn('review order', 'thứ tự soát'), tn('ask the data', 'hỏi dữ liệu')],
  kn: ['authentication'],
});

function reviewFlag(line) {
  // Flag a line of code that matches a known auth anti-pattern, naming the chapter. No match ⇒ null.
  const s = String(line);
  if (/===?\s*['"]ADMIN['"]/.test(s)) return 'scattered-authz';   // Ch9 — should be one gate
  if (/localStorage/.test(s)) return 'token-in-localstorage';     // Ch3/10 — JS-readable storage
  if (/\b(md5|sha1)\b/i.test(s)) return 'weak-hash';              // Ch2 — fast/unsalted
  if (/alg\s*[:=]\s*['"]none['"]/i.test(s)) return 'alg-none';    // Ch4 — no signature
  return null;
}
const S2 = jsBai({
  ten: '12.4-2 — Write reviewFlag(line): spot an anti-pattern', kho: 'MEDIUM', phut: 12,
  en: `<p>Given a line of source, return the anti-pattern it matches, or <code>null</code>: a comparison to <code>'ADMIN'</code> (<code>=== 'ADMIN'</code>) ⇒ <code>'scattered-authz'</code>; a mention of <code>localStorage</code> ⇒ <code>'token-in-localstorage'</code>; a word <code>md5</code> or <code>sha1</code> ⇒ <code>'weak-hash'</code>; <code>alg: 'none'</code> (or <code>alg="none"</code>) ⇒ <code>'alg-none'</code>. No match ⇒ <code>null</code>.</p>`,
  vi: `<p>Cho một dòng mã nguồn, trả phản mẫu nó khớp, hoặc <code>null</code>: một phép so với <code>'ADMIN'</code> (<code>=== 'ADMIN'</code>) ⇒ <code>'scattered-authz'</code>; một nhắc tới <code>localStorage</code> ⇒ <code>'token-in-localstorage'</code>; một từ <code>md5</code> hay <code>sha1</code> ⇒ <code>'weak-hash'</code>; <code>alg: 'none'</code> (hay <code>alg="none"</code>) ⇒ <code>'alg-none'</code>. Không khớp ⇒ <code>null</code>.</p>`,
  goiY: [['A regex per anti-pattern; return on the first match.', 'Một regex mỗi phản mẫu; trả về ở khớp đầu tiên.'], ['Make md5/sha1 case-insensitive.', 'Làm md5/sha1 không phân biệt hoa thường.']],
  loi: [['Returning a truthy value for a clean line.', 'Trả một giá trị truthy cho một dòng sạch.'], ['Missing the quoted variants (single vs double quotes).', 'Bỏ sót các biến thể trong ngoặc (đơn vs kép).']],
  gt: ['A few patterns surface most auth trouble — each anti-pattern has a grep/regex signature (12.4).', 'Vài mẫu làm nổi phần lớn rắc rối xác thực — mỗi phản mẫu có một chữ ký grep/regex (12.4).'],
  kn: ['authentication'], tns: [tn('anti-pattern grep', 'grep phản mẫu')],
  dau: `/** ⇒ the anti-pattern a line matches, or null */
function reviewFlag(line) {
  // Write your solution here
  return null;
}
`,
  giai: '// Reference solution\n' + nguon(reviewFlag),
  cases: [
    { goi: goi('reviewFlag', "if (user.role === 'ADMIN') allow();"), moTa: ['scattered authz', 'authz rải rác'] },
    { goi: goi('reviewFlag', "localStorage.setItem('jwt', token)"), an: true, moTa: ['token in localStorage', 'token trong localStorage'] },
    { goi: goi('reviewFlag', "const h = crypto.createHash('sha1')"), an: true, moTa: ['weak hash', 'băm yếu'] },
    { goi: goi('reviewFlag', "const user = await db.user.findById(id);"), an: true, moTa: ['clean line ⇒ null', 'dòng sạch ⇒ null'] },
  ],
});

const S3 = cs({
  ten: '12.4-3 — Order the review', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order an auth code review from highest risk to lowest.',
  vi: 'Xếp một lần soát mã xác thực từ rủi ro cao tới thấp.',
  cau: [ord('o1', ['Highest → lowest', 'Cao → thấp'], [
    'Find the one authorization gate (is it deny-by-default, on every write route?)',
    'Follow a token end to end (signed how, stored where, verified how)',
    'Read the recovery path and the config (resets, cookie flags, secrets from env)',
    'Write findings as risk + chapter + one-line fix',
  ], ['Gate, then the token path, then recovery/config, then write actionable findings (12.4).', 'Cổng, rồi đường token, rồi khôi phục/cấu hình, rồi viết phát hiện hành động được (12.4).'])],
  goiY: [['The gate is the highest-risk thing.', 'Cổng là thứ rủi-ro-cao-nhất.'], ['Findings must be actionable.', 'Phát hiện phải hành động được.']],
  loi: [['Starting with formatting nits.', 'Bắt đầu với vặt vãnh định dạng.'], ['Writing "looks sketchy" instead of risk + fix.', 'Viết "trông mờ ám" thay vì rủi ro + cách sửa.']],
  tns: [tn('risk + chapter + fix', 'rủi ro + chương + cách sửa')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-12-4-soat-kho-ma', ten: '12.4 Reviewing code', khoa: KHOA, baiHoc: 'auth-12-4-soat-kho-ma', de: [S1, S2, S3] });
