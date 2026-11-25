/**
 * 11.2 — Ghi lại bản sửa: nguyên nhân gốc, thay đổi, test chặn tái phát (soạn 24/11/2026, máy nhà Linux).
 * Output THẬT: repo git dựng bằng script (3 commit, tác giả giả, ngày cố định), node --test (Node 22), app LabFlow mini + PostgreSQL 16
 * — scratchpad/dbg/lab/ch11/c112 (tao-repo.sh, c112.sh, out/o-112-*.txt). Bài tập viết lại PR dùng diff thật của Lab 8.5.
 */
import { nguon, lienKet } from '../_chung.mjs';
import { TAO_REPO, C112_SH, TAI_PHAT112, THONG_DIEP } from './_ma-11.mjs';
import { FIX_BUG, DO_TRUOC, BLAME } from './_ra-11.mjs';
import { L_DIFF as DIFF8 } from '../s08/_ma-8.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;
const chiTiet = (tom, noiDung) => `<details><summary>${tom}</summary>${noiDung}</details>`;

const PR_EN = ma(`## Problem
LAB-1107: booking with a note longer than 255 characters returns 500; the page only says "Có lỗi xảy ra".

## Root cause
dat_lich.ghi_chu is varchar(255); the API never checked the length, so PostgreSQL rejected the INSERT (22001).
The earlier "fix bug" (8e9a023) only added maxlength to the textarea — curl, mobile and other clients still hit 500.

## Change
- kiemDatLich(): &gt; 255 characters ⇒ 400 "Ghi chú tối đa 255 ký tự"
- counts code points ([...s].length), the same way PostgreSQL counts; s.length would reject 255 emoji
- the page shows the 400 message

## How I verified
- test/tai-phat.test.mjs: 256 ⇒ 400, exactly 255 ⇒ 201, 255 emoji ⇒ 201
- the first test is RED on main before this change (500 !== 400), all GREEN after
- curl against staging build: 256 ⇒ 400

## Risk
Low. No schema or data change; every existing note is ≤ 255 (checked: SELECT max(length(ghi_chu)) FROM dat_lich).

Fixes: LAB-1107`, 'markdown');
const PR_VI = ma(`## Vấn đề
LAB-1107: đặt lịch với ghi chú dài hơn 255 ký tự trả 500; trang chỉ báo "Có lỗi xảy ra".

## Nguyên nhân gốc
dat_lich.ghi_chu là varchar(255); API không bao giờ kiểm độ dài, nên PostgreSQL từ chối câu INSERT (22001).
Bản "fix bug" trước đó (8e9a023) chỉ thêm maxlength cho textarea — curl, ứng dụng di động và client khác vẫn gặp 500.

## Thay đổi
- kiemDatLich(): &gt; 255 ký tự ⇒ 400 "Ghi chú tối đa 255 ký tự"
- đếm theo code point ([...s].length), giống cách PostgreSQL đếm; s.length sẽ từ chối oan 255 emoji
- trang hiện lời báo của 400

## Đã kiểm thế nào
- test/tai-phat.test.mjs: 256 ⇒ 400, đúng 255 ⇒ 201, 255 emoji ⇒ 201
- test đầu ĐỎ trên main trước thay đổi này (500 !== 400), tất cả XANH sau
- curl vào bản build staging: 256 ⇒ 400

## Rủi ro
Thấp. Không đổi schema hay dữ liệu; mọi ghi chú hiện có đều ≤ 255 (đã kiểm: SELECT max(length(ghi_chu)) FROM dat_lich).

Fixes: LAB-1107`, 'markdown');

const SO_EN = `<table>
<thead><tr><th>Ticket</th><th>Symptom</th><th>Cause</th><th>Fix</th><th>Impact</th><th>Lesson</th></tr></thead>
<tbody>
<tr><td>LAB-1107</td><td>Long note ⇒ 500</td><td>varchar(255), no API validation; UI-only "fix"</td><td>400 + code-point count + test</td><td>Notes &gt; 255, since 2.5.0</td><td>Validate at the server; a UI limit is not a rule</td></tr>
<tr><td>#802 (Lab 8)</td><td>Tokyo day shows next day's bookings</td><td><code>new Date('YYYY-MM-DD')</code> = UTC midnight</td><td>Day bounds <code>AT TIME ZONE</code> in SQL</td><td>Viewers outside UTC, 6 days</td><td>Day boundaries belong to the viewer's zone</td></tr>
<tr><td>LAB-1050 (Lab 10)</td><td>500 on /lich/ical, everything slow</td><td>Null room + pbkdf2Sync on the event loop</td><td>Kill switch, null check, async hash</td><td>445 errors, 6 students, 4 min</td><td>Measure latency at the edge</td></tr>
</tbody></table>`;
const SO_VI = `<table>
<thead><tr><th>Ticket</th><th>Triệu chứng</th><th>Nguyên nhân</th><th>Cách sửa</th><th>Ảnh hưởng</th><th>Bài học</th></tr></thead>
<tbody>
<tr><td>LAB-1107</td><td>Ghi chú dài ⇒ 500</td><td>varchar(255), API không kiểm; "sửa" chỉ ở giao diện</td><td>400 + đếm code point + test</td><td>Ghi chú &gt; 255, từ bản 2.5.0</td><td>Kiểm ở server; giới hạn trên giao diện không phải luật</td></tr>
<tr><td>#802 (Lab 8)</td><td>Ngày theo giờ Tokyo hiện lịch của ngày hôm sau</td><td><code>new Date('YYYY-MM-DD')</code> = nửa đêm UTC</td><td>Biên ngày <code>AT TIME ZONE</code> trong SQL</td><td>Người xem ngoài UTC, 6 ngày</td><td>Biên ngày thuộc múi giờ người xem</td></tr>
<tr><td>LAB-1050 (Lab 10)</td><td>500 ở /lich/ical, mọi thứ chậm</td><td>Phòng null + pbkdf2Sync chặn event loop</td><td>Công tắc ngắt, kiểm null, băm bất đồng bộ</td><td>445 lỗi, 6 SV, 4 phút</td><td>Đo độ trễ ở rìa</td></tr>
</tbody></table>`;

const PR_MO_EN = `<ol><li><strong>PR #31 "fix"</strong> — the first hunk of the diff (UNIQUE + 23505 ⇒ 409).</li>
<li><strong>PR #32 "update app.mjs"</strong> — the <code>lichTheoNgay</code> hunk (day bounds).</li>
<li><strong>PR #33 "sửa lỗi cache"</strong> — the <code>baoGia</code> hunk (cache key + cap).</li></ol>`;
const PR_MO_VI = `<ol><li><strong>PR #31 "fix"</strong> — khối đầu của diff (UNIQUE + 23505 ⇒ 409).</li>
<li><strong>PR #32 "update app.mjs"</strong> — khối <code>lichTheoNgay</code> (biên ngày).</li>
<li><strong>PR #33 "sửa lỗi cache"</strong> — khối <code>baoGia</code> (khoá cache + trần).</li></ol>`;

const DAP_AN_PR = chiTiet('Model answers / Đáp án mẫu (open after writing yours / mở sau khi viết xong)', ma(`PR #31  Chặn giữ trùng ca bằng UNIQUE thay vì SELECT-rồi-INSERT (#801)
  Nguyên nhân: ở READ COMMITTED, SELECT không khoá "khoảng trống" — 5 transaction cùng thấy 0 dòng rồi cùng INSERT; bọc transaction không giúp.
  Thay đổi: UNIQUE (phong, ngay, ca) trong schema.sql; bắt 23505 (unique_violation) ⇒ 409 "Ca vừa có người giữ".
  Kiểm: kiem.mjs 801 (100 vòng × 5 request song song): 100 vòng sai trước, 0 vòng sai sau; 0 phản hồi 5xx.
  Rủi ro: migration thêm UNIQUE sẽ lỗi nếu bảng đã có bản trùng — chạy truy vấn tìm trùng trước khi deploy.

PR #32  Tính biên ngày theo múi giờ người xem trong PostgreSQL (#802)
  Nguyên nhân: new Date('2026-12-01') là nửa đêm UTC; tz chỉ dùng để định dạng, không dùng để lọc.
  Thay đổi: bat_dau >= ($1::date)::timestamp AT TIME ZONE $2 AND < ($1::date + 1)…; kiểm tz bằng Intl.DateTimeFormat.
  Kiểm: Tokyo 01/12 = [Tanaka, Lan], VN 01/12 có cả ca 06:30; đúng cả ngày đổi giờ (23/25 giờ). Index trên bat_dau vẫn dùng được.
  Rủi ro: màn hình theo ngày sẽ hiện danh sách khác trước (đúng hơn) — báo đội mobile.

PR #33  Khoá cache báo giá chỉ gồm tham số ảnh hưởng kết quả, có trần 1.000 mục (#803)
  Nguyên nhân: khoá = JSON.stringify(cả query), nên _=<timestamp> chống cache của trình duyệt tạo một mục mới mỗi request — Map lớn mãi.
  Thay đổi: khoá = phong:gio; quá 1.000 mục thì bỏ mục cũ nhất.
  Kiểm: heap sau GC 8,1 MB → 90,4 MB sau 30.000 lần báo giá trước sửa; 8,1 MB → 9 MB sau sửa.
  Rủi ro: nếu sau này giá phụ thuộc thêm tham số, phải thêm vào khoá — đã ghi chú ngay cạnh hàm.`, 'text'));

const NGUON = [
  nguon('📘', 'Google Engineering Practices — Writing good CL descriptions', 'Dòng đầu nói làm gì, thân nói vì sao; "Fix bug" là mô tả không đủ.', 'https://google.github.io/eng-practices/review/developer/cl-descriptions.html'),
  nguon('📘', 'Chris Beams — How to Write a Git Commit Message', 'Bảy quy tắc; thân thông điệp giải thích cái gì và vì sao, không phải thế nào.', 'https://cbea.ms/git-commit/'),
  nguon('📘', 'git-scm — git-interpret-trailers', 'Trailer như Fixes:, Reviewed-by: để máy đọc được.', 'https://git-scm.com/docs/git-interpret-trailers'),
  lienKet({ khoa: 'tieng-anh-ky-thuat-di-lam', bai: 'tak-3-1-commit', title: 'Tiếng Anh kỹ thuật 3.1 — Commit message', sub: 'Câu chữ tiếng Anh cho thông điệp commit.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'tieng-anh-ky-thuat-di-lam', bai: 'tak-3-2-pr', title: 'Tiếng Anh kỹ thuật 3.2 — Mô tả pull request', sub: 'Mẫu PR bằng tiếng Anh cho dự án khách nước ngoài.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-8-5-lab', title: 'Bài 8.5 — Lab: ba ticket #801, #802, #803', sub: 'Nguồn của diff trong bài tập viết lại PR.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '11.2 — Writing up the fix: root cause, change, test that prevents regression|||11.2 — Ghi lại bản sửa: nguyên nhân gốc, thay đổi, test chặn tái phát',
  slug: 'dbg-11-2-ghi-lai-ban-sua',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Sửa xong mà không ghi lại thì "vì sao" biến mất. Repo git thật 3 commit: "fix bug" (chỉ thêm maxlength cho textarea) — test của dự án xanh hết mà curl 256 ký tự vẫn 500. Test chặn tái phát phải ĐỎ trên mã cũ trước khi tin nó: đặt test LAB-1107 lên commit cũ ⇒ 500 !== 400, lên bản sửa ⇒ 4/4 xanh; một bản sửa "gần đúng" dùng .length (đơn vị UTF-16) bị test 255 emoji bắt (400 !== 201). Thông điệp commit "vì sao" (triệu chứng, nguyên nhân, thay đổi, kiểm, không đổi gì) + trailer Fixes:, rồi 6 tháng sau git blame dẫn thẳng tới nó còn "fix bug" thì không. Mẫu mô tả PR, sổ lỗi 5 dòng (triệu chứng, nguyên nhân, cách sửa, ảnh hưởng, bài học), bài tập viết lại 3 PR mơ hồ từ diff thật của Lab 8.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>The fix is half the work; the write-up is the other half</h2>
<p class="lead">A bug is fixed when three things are true: the code is changed, a test fails without the change and passes with it, and someone reading the history later understands <em>why</em>. Teams that skip the last two fix the same bug twice — once now, once when somebody "cleans up" the strange check nobody explained. This lesson runs all three on a real repository, including the two ways a fix can look done and not be.</p>

<h3>An everyday picture: the medical record</h3>
<p>A doctor who treats you writes in your record: symptoms, diagnosis, treatment, why this drug and not the cheaper one, what to watch for. The next doctor — maybe in another hospital, years later — reads it before changing anything. A commit message and a PR description are the medical record of your code.</p>

<h3>The history: a "fix bug" that fixed nothing</h3>
<p>The bug from lesson 11.1 (long note ⇒ 500). A colleague already "fixed" it. The repository is built by a script with fictional authors and fixed dates, so you can rebuild it identically:</p>
${chiTiet('tao-repo.sh — three commits', ma(TAO_REPO, 'bash'))}
${ra(FIX_BUG)}
<p>Two failures stacked. The message "fix bug" says nothing, so you need the diff to learn it only added <code>maxlength</code> to the textarea — a UI limit, not a rule; any other client still gets 500. And the project's tests are green, because the only test books a short note. Green tests plus a "fix" commit created a false belief that LAB-1107 was done.</p>

<h3>A regression test must be red first</h3>
<p>A test proves a fix only if it fails without the fix. So before trusting a new test, run it against the old code:</p>
${chiTiet('test/tai-phat.test.mjs — the regression tests for LAB-1107', ma(TAI_PHAT112))}
${chiTiet('c112.sh — the whole lesson', ma(C112_SH, 'bash'))}
${ra(DO_TRUOC)}
<p>Three things to read here:</p>
<ul>
<li>On the old code, the first test is <strong>red</strong> with exactly the reported symptom (500, expected 400). That is the proof the test targets the bug.</li>
<li>Two tests are green on the old code too — the boundary 255 and 255 emoji. They are not useless: they protect the fix from going too far (rejecting valid notes). Write them, but do not count them as proof.</li>
<li>A plausible fix with <code>ghiChu.length</code> passes the 256 test but the emoji test catches it: JavaScript's <code>.length</code> counts UTF-16 code units (an emoji is 2), PostgreSQL counts characters. Boundary tests with multi-byte data find this in seconds; reviewers rarely do.</li>
</ul>
<p>Practical rule: write the test first, watch it fail for the right reason, then fix. If you wrote the fix first, temporarily revert it (<code>git stash</code>, or check out the old file) and run the test. This is the "prevent" step of the loop from lesson 1.1.</p>

<h3>The commit message that answers "why"</h3>
${ma(THONG_DIEP, 'text')}
${ra(BLAME)}
<p>Six months later somebody asks "why do we reject 256 characters?". <code>git blame</code> on the line leads to the commit; the commit answers: symptom, cause, why the UI limit was not enough, why <code>[...s].length</code>, how it was tested, what did not change. The other line leads to "fix bug". A trailer like <code>Fixes: LAB-1107</code> lets tools link the commit to the ticket and lets you search by ticket id.</p>
<p>Shape of a good message: a subject line that says what changes (imperative, ~50–72 characters, ticket id), a blank line, then a body that explains <em>why</em> and what was considered. "How" is in the diff.</p>

<h3>The PR description</h3>
${PR_EN}
<p>Same content as the commit, organised for a reviewer: the problem (link the ticket), the root cause in two sentences, the change as a list, how you verified it — including that the test was red first — and the risk. A reviewer who has to reconstruct the bug from the diff will either approve without understanding or ask you to write this anyway.</p>

<h3>The five-line bug log</h3>
<p>Keep a personal or team log: one row per bug you fixed. Symptom, cause, fix, impact, lesson. It takes two minutes per bug and pays three times: you stop repeating the same class of bug, the team sees patterns ("third timezone bug this month"), and you have true stories for interviews (lesson 12.5).</p>
${SO_EN}

<h3>Mini lab: rewrite three vague PRs (25 min)</h3>
<p>Below is the real diff of Lab 8.5's three fixes. Imagine they arrived as three PRs titled:</p>
${PR_MO_EN}
${chiTiet('lab-sua.diff (Lab 8.5)', ma(DIFF8, 'diff'))}
<p>For each, write a title (≤ 72 characters, with the ticket id) and a description with Root cause, Change, How verified, Risk. Then compare with the model answers.</p>
${DAP_AN_PR}

<h3>On the job</h3>
<p>Many outsourcing teams have a PR template in the repository (<code>.github/pull_request_template.md</code> or the Azure DevOps/Bitbucket equivalent) and a lead who rejects PRs with an empty description. Customers also read fix descriptions: release notes and "root cause" fields in their Jira are often copied from your PR. A clear PR makes the customer's verification faster — and makes your name the one the lead trusts with the next tricky bug.</p>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<ol>
<li>Run <code>c112.sh</code>, then change the regression test to 300 characters. Is it still red on the old commit? Is it a better or worse test than 256, and why?</li>
<li>In your own project, pick your last bug fix. Check out the commit before it and run its test (if there was none, write one). Red?</li>
<li>Rewrite the message of your last fix commit in the shape above (in a new branch with <code>git commit --amend</code> if it is not pushed; otherwise in the PR description).</li>
<li>Start your bug log with three rows.</li>
</ol>
<p><strong>Done when:</strong> every fix you make from now on has a test you have seen red, and a message a stranger can understand in one minute.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Regression test</span><span class="v">A test that reproduces a fixed bug, so it cannot come back silently.</span></div>
  <div class="kv"><span class="k">Red–green</span><span class="v">Watch the test fail without the fix, then pass with it.</span></div>
  <div class="kv"><span class="k">Symptom fix</span><span class="v">A change that hides the symptom on one path (UI) while the cause remains.</span></div>
  <div class="kv"><span class="k">Commit message body</span><span class="v">The part after the subject line: why, what was considered, what did not change.</span></div>
  <div class="kv"><span class="k">Trailer</span><span class="v">A machine-readable line at the end of a message, like <code>Fixes: LAB-1107</code>.</span></div>
  <div class="kv"><span class="k">Bug log</span><span class="v">One row per fixed bug: symptom, cause, fix, impact, lesson.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Done = code changed + test red before/green after + the "why" written down.</li>
<li>Green tests and a "fix" commit can both be true while the bug remains.</li>
<li>Boundary and multi-byte cases find wrong fixes; count them as guards, not proof.</li>
<li>Commit: subject says what, body says why; add the ticket as a trailer.</li>
<li>PR: problem, root cause, change, how verified (red first), risk. Keep a five-line bug log.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Sửa mới là một nửa; ghi lại là nửa còn lại</h2>
<p class="lead">Một lỗi được coi là đã sửa khi đủ ba điều: mã đã đổi, có một test hỏng khi không có thay đổi đó và qua khi có nó, và người đọc lịch sử sau này hiểu <em>vì sao</em>. Những đội bỏ qua hai điều sau sẽ sửa cùng một lỗi hai lần — một lần bây giờ, một lần khi ai đó "dọn dẹp" cái đoạn kiểm tra kỳ lạ không ai giải thích. Bài này chạy cả ba trên một repo thật, kể cả hai cách một bản sửa trông như xong mà thật ra chưa.</p>

<h3>Liên tưởng đời thường: bệnh án</h3>
<p>Bác sĩ điều trị cho bạn ghi vào bệnh án: triệu chứng, chẩn đoán, cách điều trị, vì sao dùng thuốc này mà không dùng thuốc rẻ hơn, cần theo dõi gì. Bác sĩ kế tiếp — có thể ở bệnh viện khác, nhiều năm sau — đọc nó trước khi đổi bất cứ thứ gì. Thông điệp commit và mô tả PR là bệnh án của mã nguồn.</p>

<h3>Lịch sử: một "fix bug" chẳng sửa gì</h3>
<p>Lỗi ở bài 11.1 (ghi chú dài ⇒ 500). Một đồng nghiệp đã "sửa" nó. Repo được dựng bằng script với tác giả giả và ngày cố định, nên bạn dựng lại được y hệt:</p>
${chiTiet('tao-repo.sh — ba commit', ma(TAO_REPO, 'bash'))}
${ra(FIX_BUG)}
<p>Hai thất bại chồng lên nhau. Thông điệp "fix bug" không nói gì, nên bạn phải xem diff mới biết nó chỉ thêm <code>maxlength</code> cho ô textarea — một giới hạn trên giao diện, không phải luật; client khác vẫn gặp 500. Và test của dự án xanh hết, vì test duy nhất chỉ đặt lịch với ghi chú ngắn. Test xanh cộng một commit "fix" tạo ra niềm tin sai rằng LAB-1107 đã xong.</p>

<h3>Test chặn tái phát phải đỏ trước</h3>
<p>Một test chỉ chứng minh được bản sửa khi nó hỏng nếu không có bản sửa. Vậy trước khi tin một test mới, hãy chạy nó trên mã cũ:</p>
${chiTiet('test/tai-phat.test.mjs — các test chặn tái phát cho LAB-1107', ma(TAI_PHAT112))}
${chiTiet('c112.sh — cả bài', ma(C112_SH, 'bash'))}
${ra(DO_TRUOC)}
<p>Ba điều cần đọc ở đây:</p>
<ul>
<li>Trên mã cũ, test đầu tiên <strong>đỏ</strong> đúng bằng triệu chứng đã báo (500, mong đợi 400). Đó là bằng chứng test nhắm đúng lỗi.</li>
<li>Hai test xanh cả trên mã cũ — biên 255 và 255 emoji. Chúng không vô dụng: chúng giữ cho bản sửa không đi quá đà (từ chối ghi chú hợp lệ). Cứ viết, nhưng đừng tính chúng là bằng chứng.</li>
<li>Một bản sửa trông hợp lý dùng <code>ghiChu.length</code> qua được test 256 nhưng bị test emoji bắt: <code>.length</code> của JavaScript đếm đơn vị UTF-16 (một emoji là 2), còn PostgreSQL đếm ký tự. Test biên với dữ liệu nhiều byte tìm ra điều này trong vài giây; người review hiếm khi thấy.</li>
</ul>
<p>Luật thực hành: viết test trước, nhìn nó hỏng đúng lý do, rồi mới sửa. Nếu đã lỡ sửa trước, tạm gỡ bản sửa ra (<code>git stash</code>, hoặc checkout tệp cũ) rồi chạy test. Đây là bước "chặn tái phát" của vòng lặp ở bài 1.1.</p>

<h3>Thông điệp commit trả lời "vì sao"</h3>
${ma(THONG_DIEP, 'text')}
${ra(BLAME)}
<p>Sáu tháng sau ai đó hỏi "sao mình lại từ chối 256 ký tự?". <code>git blame</code> trên dòng đó dẫn tới commit; commit trả lời: triệu chứng, nguyên nhân, vì sao giới hạn ở giao diện không đủ, vì sao dùng <code>[...s].length</code>, đã kiểm thế nào, cái gì không đổi. Dòng còn lại dẫn tới "fix bug". Một trailer như <code>Fixes: LAB-1107</code> cho công cụ nối commit với ticket và cho bạn tìm theo mã ticket.</p>
<p>Hình dạng của một thông điệp tốt: dòng tiêu đề nói thay đổi gì (thể mệnh lệnh, ~50–72 ký tự, có mã ticket), một dòng trống, rồi phần thân giải thích <em>vì sao</em> và đã cân nhắc những gì. "Thế nào" thì đã có trong diff.</p>

<h3>Mô tả PR</h3>
${PR_VI}
<p>Cùng nội dung với commit, sắp xếp cho người review: vấn đề (liên kết ticket), nguyên nhân gốc trong hai câu, thay đổi dạng danh sách, đã kiểm thế nào — kể cả việc test đã đỏ trước — và rủi ro. Người review phải tự dựng lại lỗi từ diff thì hoặc sẽ duyệt mà không hiểu, hoặc sẽ bắt bạn viết đúng phần này.</p>

<h3>Sổ lỗi năm dòng</h3>
<p>Giữ một sổ cá nhân hoặc của nhóm: mỗi lỗi đã sửa một hàng. Triệu chứng, nguyên nhân, cách sửa, ảnh hưởng, bài học. Mất hai phút mỗi lỗi và trả lại gấp ba: bạn thôi lặp lại cùng một loại lỗi, cả nhóm thấy được quy luật ("lỗi múi giờ thứ ba trong tháng"), và bạn có chuyện thật để kể khi phỏng vấn (bài 12.5).</p>
${SO_VI}

<h3>Lab nhỏ: viết lại ba PR mơ hồ (25 phút)</h3>
<p>Dưới đây là diff thật của ba bản sửa ở Lab 8.5. Giả sử chúng tới thành ba PR có tiêu đề:</p>
${PR_MO_VI}
${chiTiet('lab-sua.diff (Lab 8.5)', ma(DIFF8, 'diff'))}
<p>Với mỗi PR, viết tiêu đề (≤ 72 ký tự, có mã ticket) và mô tả gồm Nguyên nhân gốc, Thay đổi, Đã kiểm thế nào, Rủi ro. Rồi so với đáp án mẫu.</p>
${DAP_AN_PR}

<h3>Đi làm thật</h3>
<p>Nhiều đội outsourcing có sẵn mẫu PR trong repo (<code>.github/pull_request_template.md</code> hoặc bản tương đương của Azure DevOps/Bitbucket) và một trưởng nhóm sẽ từ chối PR có mô tả trống. Khách hàng cũng đọc mô tả bản sửa: release note và ô "root cause" trên Jira của họ thường được chép từ PR của bạn. Một PR rõ ràng giúp khách kiểm nhanh hơn — và làm tên bạn thành cái tên trưởng nhóm tin giao lỗi khó kế tiếp.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>c112.sh</code>, rồi đổi test chặn tái phát thành 300 ký tự. Nó còn đỏ trên commit cũ không? Nó là test tốt hơn hay tệ hơn bản 256, vì sao?</li>
<li>Trong dự án của bạn, chọn bản sửa lỗi gần nhất. Checkout commit ngay trước nó và chạy test của nó (nếu chưa có test, viết một cái). Có đỏ không?</li>
<li>Viết lại thông điệp commit của bản sửa gần nhất theo hình dạng ở trên (trên nhánh mới với <code>git commit --amend</code> nếu chưa push; nếu đã push thì viết vào mô tả PR).</li>
<li>Mở sổ lỗi của bạn với ba hàng đầu tiên.</li>
</ol>
<p><strong>Đạt khi:</strong> từ giờ mọi bản sửa của bạn đều có một test bạn đã tận mắt thấy đỏ, và một thông điệp mà người lạ hiểu trong một phút.</p>
</div>

<h3>🗂 Thuật ngữ chính</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Test chặn tái phát (regression test)</span><span class="v">Test tái hiện một lỗi đã sửa, để nó không thể quay lại trong im lặng.</span></div>
  <div class="kv"><span class="k">Đỏ – xanh</span><span class="v">Nhìn test hỏng khi chưa có bản sửa, rồi qua khi có.</span></div>
  <div class="kv"><span class="k">Sửa triệu chứng</span><span class="v">Thay đổi giấu triệu chứng trên một đường (giao diện) trong khi nguyên nhân vẫn còn.</span></div>
  <div class="kv"><span class="k">Thân thông điệp commit</span><span class="v">Phần sau dòng tiêu đề: vì sao, đã cân nhắc gì, cái gì không đổi.</span></div>
  <div class="kv"><span class="k">Trailer</span><span class="v">Dòng máy đọc được ở cuối thông điệp, như <code>Fixes: LAB-1107</code>.</span></div>
  <div class="kv"><span class="k">Sổ lỗi</span><span class="v">Mỗi lỗi đã sửa một hàng: triệu chứng, nguyên nhân, cách sửa, ảnh hưởng, bài học.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Xong = mã đã đổi + test đỏ trước/xanh sau + "vì sao" đã được ghi lại.</li>
<li>Test xanh và một commit "fix" có thể cùng đúng trong khi lỗi vẫn còn.</li>
<li>Trường hợp biên và dữ liệu nhiều byte tìm ra bản sửa sai; tính chúng là lưới chặn, không phải bằng chứng.</li>
<li>Commit: tiêu đề nói cái gì, thân nói vì sao; thêm mã ticket làm trailer.</li>
<li>PR: vấn đề, nguyên nhân gốc, thay đổi, đã kiểm thế nào (đỏ trước), rủi ro. Giữ một sổ lỗi năm dòng.</li>
</ul>
${NGUON}
</div>
`,
};
