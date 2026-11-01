/** Authentication · 2.5 — Chuyển khỏi hàm băm cũ: đọc lần chuyển thật (1.003 dòng); tự viết planRow (tình huống ⇒ nước đi), estimateWrap (từ phép đo tới quy mô triệu dòng); sắp thứ tự một lần chuyển. */
import { doiDau, KHOA, cs, q, ord, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s02/_ma.mjs';

const LG = OUT['25-legacy'].split('\n').slice(1);

/* ── 1. Đọc lần chuyển thật ── */
const S1 = cs({
  ten: '2.5-1 — 1,003 legacy MD5 rows: read the real migration', kho: 'EASY', phut: 8,
  en: `<code>UV_THREADPOOL_SIZE=10 node demo2/legacy.mjs</code> on PostgreSQL 17 (real run):${pre(LG)}`,
  vi: `<code>UV_THREADPOOL_SIZE=10 node demo2/legacy.mjs</code> trên PostgreSQL 17 (chạy thật):${pre(LG)}`,
  cau: [
    q('c1', ['How could 1,003 rows be moved to argon2id without knowing any password?', 'Làm sao chuyển 1.003 dòng sang argon2id mà không biết mật khẩu nào?'],
      ['Each MD5 hex value was hashed with argon2id (wrapping); the old column was set to NULL in the same UPDATE', 'The script cracked the MD5s first and re-hashed the passwords', 'Everyone received a reset e-mail', 'argon2 can convert an MD5 hash directly'],
      ['The MD5 hex is just a 32-character string to hash. At sign-in the server computes md5(input) and verifies it against the wrapped row.', 'Chuỗi MD5 hex chỉ là một chuỗi 32 ký tự để băm. Lúc đăng nhập máy chủ tính md5(đầu vào) rồi kiểm với dòng đã bọc.']),
    q('c2', ['After An signs in: argon2id 1, wrapped 1,002. What is true about the 1,002?', 'Sau khi An đăng nhập: argon2id 1, bọc 1.002. Điều gì đúng về 1.002 dòng kia?'],
      ['Each guess costs argon2id now; each unwraps at next sign-in', 'They are still crackable at full MD5 speed on a GPU', 'They are deleted automatically after 30 days', 'Their owners must reset passwords by e-mail first'],
      ['Wrapping protects every row today; unwrapping is a clean-up that happens naturally at login. Nothing is urgent any more.', 'Bọc bảo vệ mọi dòng ngay hôm nay; gỡ bọc là việc dọn dẹp tự nhiên lúc đăng nhập. Chẳng còn gì gấp nữa.']),
    q('c3', ['Ashley Madison used bcrypt cost 12. How were over 11 million passwords recovered anyway?', 'Ashley Madison dùng bcrypt cost 12. Vậy mà hơn 11 triệu mật khẩu vẫn bị khôi phục bằng cách nào?'],
      ['Through a leftover MD5 $loginkey from pre-2012 accounts', 'bcrypt cost 12 falls on a single GPU in a few days', 'The bcrypt salt was the same for every account', 'The plain passwords were found in the server logs'],
      ['The upgrade happened, the old value stayed. A migration is finished only when the old value is gone — column, backups, exports.', 'Việc nâng cấp đã diễn ra, giá trị cũ vẫn ở lại. Một lần chuyển chỉ xong khi giá trị cũ biến mất — cột, bản sao lưu, tệp xuất.']),
  ],
  goiY: [['What does the md5_left counter say after the wrap?', 'Bộ đếm md5_left nói gì sau khi bọc?'], ['Which value did the attackers actually crack?', 'Kẻ tấn công thật ra đã bẻ giá trị nào?']],
  loi: [['“Upgrade on login is enough” for a broken hash.', '"Nâng cấp khi đăng nhập là đủ" cho hàm băm hỏng.'], ['Keeping the old column “just in case”.', 'Giữ cột cũ "phòng khi cần".']],
  tns: [tn('wrapping', 'bọc'), tn('rehash on login', 'băm lại khi đăng nhập')],
  kn: ['hash migration'],
});

/* ── 2. Tự viết: planRow ── */
function planRow(stored, want) {
  if (typeof stored !== 'string') return 'UNKNOWN';
  if (/^[0-9a-f]{32}$/i.test(stored) || /^[0-9a-f]{40}$/i.test(stored) || /^[0-9a-f]{64}$/i.test(stored)) return 'WRAP_NOW';
  var m = /^\$argon2id\$v=19\$([^$]+)\$/.exec(stored);
  if (m) {
    var p = {};
    m[1].split(',').forEach(function (kv) { var i = kv.indexOf('='); p[kv.slice(0, i)] = Number(kv.slice(i + 1)); });
    return p.m >= want.m && p.t >= want.t && p.p >= want.p ? 'OK' : 'REHASH_ON_LOGIN';
  }
  if (/^\$2[aby]\$\d\d\$/.test(stored) || /^\$md5-argon2id\$/.test(stored)) return 'REHASH_ON_LOGIN';
  return 'UNKNOWN';
}
const WANT = { m: 65536, t: 2, p: 1 };
const S2 = jsBai({
  ten: '2.5-2 — Write planRow(stored, want): which situation is this row in?', kho: 'MEDIUM', phut: 15,
  en: `<p>Classify one stored value for the migration plan of lesson 2.5 (<code>want = { m, t, p }</code> = today's parameters):</p><ul>
<li><code>'WRAP_NOW'</code> — a bare MD5 / SHA-1 / SHA-256 hex digest (32, 40 or 64 hex characters, any case): broken, wrap today;</li>
<li><code>'OK'</code> — <code>$argon2id$v=19$…</code> with every parameter ≥ <code>want</code> (read them by name, any order);</li>
<li><code>'REHASH_ON_LOGIN'</code> — argon2id below <code>want</code>, bcrypt (<code>$2a$</code>/<code>$2b$</code>/<code>$2y$</code> + 2-digit cost), or an already wrapped <code>$md5-argon2id$…</code>;</li>
<li><code>'UNKNOWN'</code> — anything else (including non-strings).</li></ul>`,
  vi: `<p>Phân loại một giá trị đang lưu cho kế hoạch chuyển đổi của bài 2.5 (<code>want = { m, t, p }</code> = tham số hiện hành):</p><ul>
<li><code>'WRAP_NOW'</code> — một chuỗi MD5 / SHA-1 / SHA-256 hex trần (32, 40 hoặc 64 ký tự hex, hoa hay thường): đã hỏng, bọc ngay hôm nay;</li>
<li><code>'OK'</code> — <code>$argon2id$v=19$…</code> có mọi tham số ≥ <code>want</code> (đọc theo tên, thứ tự bất kỳ);</li>
<li><code>'REHASH_ON_LOGIN'</code> — argon2id thấp hơn <code>want</code>, bcrypt (<code>$2a$</code>/<code>$2b$</code>/<code>$2y$</code> + cost 2 chữ số), hoặc dòng đã bọc <code>$md5-argon2id$…</code>;</li>
<li><code>'UNKNOWN'</code> — mọi thứ khác (kể cả không phải chuỗi).</li></ul>`,
  goiY: [['Test the bare hex shapes first: they are the urgent ones.', 'Kiểm các dạng hex trần trước: chúng là dạng gấp.'], ['Reuse the by-name parameter parser of 2.2.', 'Dùng lại bộ đọc tham số theo tên của 2.2.']],
  loi: [['Treating bcrypt as WRAP_NOW: bcrypt-10 is slow already.', 'Coi bcrypt là WRAP_NOW: bcrypt-10 vốn đã chậm.'], ['Missing upper-case hex: some systems stored MD5 in capitals.', 'Bỏ sót hex viết hoa: có hệ thống lưu MD5 bằng chữ hoa.']],
  gt: ['Only fast unsalted digests are urgent; everything that is already slow can wait for its owner’s next login. Running this over a whole table gives the migration plan in one query’s worth of counts.', 'Chỉ các digest nhanh không muối là gấp; mọi thứ vốn đã chậm thì chờ được tới lần đăng nhập sau của chủ nhân. Chạy hàm này trên cả bảng cho ra kế hoạch chuyển đổi chỉ bằng vài con số đếm.'],
  kn: ['hash migration'],
  tns: [tn('legacy hash', 'giá trị băm cũ')],
  dau: `/** ⇒ 'WRAP_NOW' | 'OK' | 'REHASH_ON_LOGIN' | 'UNKNOWN' */
function planRow(stored, want) {
  // Write your solution here
  if (stored.indexOf('$argon2id$') === 0) return 'OK';
  if (stored.indexOf('$2b$') === 0) return 'WRAP_NOW';
  return 'UNKNOWN';
}
`,
  giai: '// Reference solution\n' + nguon(planRow),
  cases: [
    { goi: goi('planRow', 'e10adc3949ba59abbe56e057f20f883e', WANT), moTa: ['md5("123456")', 'md5("123456")'] },
    { goi: goi('planRow', '$argon2id$v=19$m=65536,p=1,t=2$c2FsdA$aGFzaA', WANT) },
    { goi: goi('planRow', '$argon2id$v=19$m=19456,p=1,t=2$c2FsdA$aGFzaA', WANT), an: true },
    { goi: goi('planRow', '$2b$10$abcdefghijklmnopqrstuuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012', WANT), an: true },
    { goi: goi('planRow', '$md5-argon2id$v=19$m=65536,p=1,t=2$c2FsdA$aGFzaA', WANT), an: true },
    { goi: goi('planRow', '7C4A8D09CA3762AF61E59520943DC26494F8941B', WANT), an: true },
    { goi: goi('planRow', '$argon2id$v=19$t=3,p=1,m=131072$c2FsdA$aGFzaA', WANT), an: true },
    { goi: goi('planRow', 'an-lab-2026', WANT), an: true },
    { goi: 'planRow(null, ' + JSON.stringify(WANT) + ')', an: true },
  ],
});

/* ── 3. Tự viết: estimateWrap ── */
function estimateWrap(totalRows, sampleRows, sampleSeconds, batchSize) {
  var perSecond = sampleRows / sampleSeconds;
  var seconds = totalRows / perSecond;
  return { rowsPerSecond: Math.round(perSecond * 10) / 10, hours: Math.round(seconds / 360) / 10, batches: Math.ceil(totalRows / batchSize) };
}
const S3 = jsBai({
  ten: '2.5-3 — Write estimateWrap(total, sampleRows, sampleSeconds, batchSize)', kho: 'EASY', phut: 10,
  en: `<p>Lesson 2.5 wrapped 1,003 rows in 17.1 s on 10 threads. Before running a migration on production you estimate it from your own measurement. Return <code>{ rowsPerSecond, hours, batches }</code>: rows per second of the sample (1 decimal), the time for <code>totalRows</code> in hours (1 decimal), and how many batches of <code>batchSize</code> the job needs (the last batch may be partial).</p>`,
  vi: `<p>Bài 2.5 bọc 1.003 dòng trong 17,1 s trên 10 luồng. Trước khi chạy một lần chuyển trên production, bạn ước lượng từ phép đo của chính mình. Trả <code>{ rowsPerSecond, hours, batches }</code>: số dòng mỗi giây của mẫu (1 chữ số lẻ), thời gian cho <code>totalRows</code> tính bằng giờ (1 chữ số lẻ), và tác vụ cần bao nhiêu lô cỡ <code>batchSize</code> (lô cuối có thể thiếu).</p>`,
  goiY: [['rate = sampleRows / sampleSeconds; seconds = total / rate.', 'tốc độ = sampleRows / sampleSeconds; số giây = total / tốc độ.'], ['Math.ceil for the batches.', 'Math.ceil cho số lô.']],
  loi: [['Math.floor for batches: the last partial batch is never run.', 'Math.floor cho số lô: lô cuối bị thiếu không bao giờ chạy.'], ['Rounding the rate before computing the time.', 'Làm tròn tốc độ trước khi tính thời gian.']],
  gt: ['≈ 59 rows/s ⇒ a million rows ≈ 4.7 hours: that is a restartable background job, not a migration file that runs inside a deploy.', '≈ 59 dòng/s ⇒ một triệu dòng ≈ 4,7 giờ: đó là một tác vụ nền chạy lại được, không phải một tệp migration chạy trong lúc deploy.'],
  kn: ['hash migration'],
  tns: [tn('batch', 'lô')],
  dau: `/** ⇒ { rowsPerSecond, hours, batches } */
function estimateWrap(totalRows, sampleRows, sampleSeconds, batchSize) {
  // Write your solution here
  var rate = Math.round(sampleRows / sampleSeconds);
  return { rowsPerSecond: rate, hours: Math.round(totalRows / rate / 3600), batches: Math.floor(totalRows / batchSize) };
}
`,
  giai: '// Reference solution\n' + nguon(estimateWrap),
  cases: [
    { goi: goi('estimateWrap', 1000000, 1003, 17.1, 1000), moTa: ['A million rows at lesson 2.5’s rate', 'Một triệu dòng với tốc độ của bài 2.5'] },
    { goi: goi('estimateWrap', 250000, 1003, 17.1, 1000) },
    { goi: goi('estimateWrap', 1003, 1003, 17.1, 1000), an: true },
    { goi: goi('estimateWrap', 50000, 400, 10, 300), an: true },
  ],
});

/* ── 4. Sắp thứ tự một lần chuyển ── */
const S4 = cs({
  ten: '2.5-4 — Put the MD5 → argon2id migration in order', kho: 'EASY', phut: 6, loai: 'order',
  en: 'LabFlow’s old booking system kept md5(password). Put the migration steps in the order a careful team runs them.',
  vi: 'Hệ thống đặt phòng cũ của LabFlow giữ md5(password). Sắp các bước chuyển đổi theo thứ tự một đội cẩn thận sẽ chạy.',
  cau: [ord('o1', ['First to last', 'Trước tới sau'], [
    'Deploy a verifyPassword that understands $md5-argon2id$ (and still the old shape)',
    'Run the wrap job in restartable batches: argon2id(md5) and pass_md5 = NULL in the same UPDATE',
    'Check that no row has pass_md5 left',
    'At each successful sign-in, replace the wrapped hash with argon2id(password)',
    'Destroy old backups and exports that still contain the MD5 column',
    'Months later, decide about the long tail of rows still wrapped',
  ], ['Sign-in must understand the new shape before any row changes; the wrap removes the old value as it goes; logins finish the job; old copies are the Ashley Madison column under another name; the long tail is a policy decision, not an emergency.', 'Đăng nhập phải hiểu dạng mới trước khi dòng nào thay đổi; việc bọc xoá giá trị cũ ngay khi làm; các lượt đăng nhập làm nốt; bản chép cũ là cột của Ashley Madison dưới tên khác; cái đuôi dài là quyết định chính sách, không phải sự cố.'])],
  goiY: [['What breaks if a row changes before the code understands it?', 'Điều gì hỏng nếu một dòng đổi trước khi mã hiểu nó?'], ['When is the old value really gone?', 'Khi nào giá trị cũ thật sự biến mất?']],
  loi: [['Wrapping first and deploying the verify later: nobody can sign in in between.', 'Bọc trước rồi mới deploy hàm kiểm: không ai đăng nhập được ở giữa.'], ['Forgetting the backups.', 'Quên các bản sao lưu.']],
  kn: ['hash migration'],
});

export default doiDau({ slug: 'auth-2-5-chuyen-doi', ten: '2.5 Moving off an old hash, without a reset', khoa: KHOA, baiHoc: 'auth-2-5-chuyen-doi', de: [S1, S2, S3, S4] });
