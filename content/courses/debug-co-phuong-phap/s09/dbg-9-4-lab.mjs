/**
 * 9.4 — Lab: tìm commit gây lỗi và thư viện gây lỗi (soạn 24/11/2026, máy nhà Linux).
 * Kho labflow-muon (336 commit, tất định) + registry Verdaccio với @labflow/lich-tuan 2.0.0…2.6.0, server build bằng Docker (node:22-alpine).
 * Output thật bản lỗi/bản sửa — scratchpad/dbg/lab/ch9/lab (tao-lab.mjs, chuan-bi.sh, dap-an/, c94.sh, lab-sua.diff; o-lab9-*.txt).
 */
import { L_CHUAN_BI, L_TAO, L_K941, L_K941_SH, L_K941_DD, L_K942, L_C94, L_DIFF } from './_ma-9.mjs';
import { L941_TAI_HIEN, L941_NPM, L941_DD, L941, L941_FP, L941_SHOW, L942, L942_CHIA_DOI, L_SUA } from './_ra-9.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;

const CHUAN_BI = ma(`# Cần: Docker, Node 22, git. Mọi thứ chỉ nghe trên 127.0.0.1 của máy bạn.
cd dbg-lab/ch9/lab
./chuan-bi.sh                 # registry npm (dbg-npm, 44873) + @labflow/lich-tuan + kho labflow-muon (336 commit)
cd labflow-muon
npm ci && npm test            # 6/6 xanh — test của dự án không bắt được lỗi nào
npm start                     # server ở 127.0.0.1:41940:  /phi-tre?han=…&tra=…   /lich-tuan?ngay=…
# server "test" của khách: build đúng Dockerfile trong kho
docker build --network host -t dbg-lab9-muon . && docker run -d --name dbg-lab9-muon -p 127.0.0.1:41940:41940 dbg-lab9-muon
# dọn: docker rm -f dbg-lab9-muon dbg-npm && docker rmi dbg-lab9-muon`, 'bash');

const TEP = `<details><summary>chuan-bi.sh · tao-lab.mjs (generator — spoilers inside / có lời giải bên trong, open only after / chỉ mở sau khi làm)</summary>${ma(L_CHUAN_BI, 'bash')}${ma(L_TAO)}</details>`;

const DAN_Y_EN = `<ol>
<li><strong>"How do you find which commit introduced a bug?"</strong> Reproduce with a script outside the repo; confirm it fails at HEAD and passes at a known-good tag; <code>git bisect run</code>; map "cannot build / cannot load / hangs" to 125; attach the bisect log; read the diff of the first bad commit; write a regression test. Mention <code>--first-parent</code> to get the PR.</li>
<li><strong>"Your tests are green but production is wrong — why?"</strong> Tests did not cover the case (same-month dates only), or production does not run the same code/libraries (lockfile ignored, different image, different config). Prove which, with a test for the case and a fingerprint/<code>npm ls</code> inside the running container.</li>
<li><strong>"What is a lockfile for, and npm ci vs npm install?"</strong> Exact tree, reproducible installs; <code>ci</code> installs only the lockfile and fails on mismatch — use it in CI and Docker; <code>install</code> may change the lockfile — use it to change dependencies on purpose.</li>
<li><strong>"How do you safely upgrade dependencies?"</strong> One at a time (bot PRs), read the changelog, CI must pass, review the lockfile diff, pin or use ~ for fragile libraries, scan for vulnerabilities; never "delete the lockfile to fix a conflict" — regenerate it from the target branch and re-run <code>npm install</code>.</li>
<li><strong>"Explain Maven dependency conflicts."</strong> Nearest definition wins, not highest; symptoms <code>NoSuchMethodError</code>/<code>NoClassDefFoundError</code> at run time; diagnose with <code>dependency:tree</code> per module; fix with <code>dependencyManagement</code>/BOM, remove stale direct declarations, enforcer <code>dependencyConvergence</code>.</li>
</ol>`;
const DAN_Y_VI = `<ol>
<li><strong>"Làm sao tìm ra commit đã gây lỗi?"</strong> Tái hiện bằng script ngoài kho; xác nhận nó trượt ở HEAD và qua ở một tag chắc chắn tốt; <code>git bisect run</code>; đổi "không build / không nạp / treo" thành 125; đính bisect log; đọc diff của commit xấu đầu tiên; viết test hồi quy. Nhắc <code>--first-parent</code> để ra PR.</li>
<li><strong>"Test xanh mà production sai — vì sao?"</strong> Test không phủ trường hợp đó (chỉ ngày cùng tháng), hoặc production không chạy cùng mã/thư viện (bỏ lockfile, khác ảnh, khác cấu hình). Chứng minh là cái nào: một test cho trường hợp đó và vân tay/<code>npm ls</code> bên trong container đang chạy.</li>
<li><strong>"Lockfile để làm gì, npm ci khác npm install thế nào?"</strong> Cây chính xác, cài lặp lại được; <code>ci</code> chỉ cài theo lockfile và hỏng khi lệch — dùng cho CI và Docker; <code>install</code> có thể đổi lockfile — dùng khi chủ động đổi thư viện.</li>
<li><strong>"Nâng cấp thư viện thế nào cho an toàn?"</strong> Từng cái một (PR của bot), đọc changelog, CI phải qua, review diff lockfile, ghim hoặc dùng ~ cho thư viện dễ vỡ, quét lỗ hổng; đừng bao giờ "xoá lockfile cho hết xung đột" — lấy lockfile của nhánh đích rồi chạy lại <code>npm install</code>.</li>
<li><strong>"Giải thích xung đột phụ thuộc trong Maven."</strong> Khai báo gần nhất thắng, không phải bản cao nhất; triệu chứng <code>NoSuchMethodError</code>/<code>NoClassDefFoundError</code> lúc chạy; chẩn đoán bằng <code>dependency:tree</code> từng module; sửa bằng <code>dependencyManagement</code>/BOM, bỏ khai báo trực tiếp đã cũ, enforcer <code>dependencyConvergence</code>.</li>
</ol>`;

const DAP_AN = `<details><summary>Ticket #941 — reproduction, three wrong bisects and the right one / tái hiện, ba lần bisect sai và lần đúng</summary>
${ra(L941_TAI_HIEN)}
${ma(L_K941)}${ma(L_K941_SH, 'bash')}
${ra(L941)}
${ra(L941_SHOW)}
<p>EN: 318 commits, 10 runs (2 skipped: the wrong <code>.js</code> import range). Wrong variants, all real: <code>npm test</code> blames the commit that moved the file (the project tests fail only in the broken-import range); importing the file by its <em>current</em> path makes every commit before the move a skip ⇒ 146 candidates; <code>--first-parent</code> answers with the merge of <code>feature/don-gian-phi</code> — correct, at PR level. Root cause: <code>getUTCDate()</code> subtracts day-of-month numbers, so 29/11 → 02/12 gives 2 − 29 &lt; 0 ⇒ 0 days. The project's tests only used dates in the same month.</p>
<p>VI: 318 commit, 10 lượt (2 lượt skip: dải import sai đuôi <code>.js</code>). Các biến thể sai, đều chạy thật: <code>npm test</code> đổ lỗi cho commit chuyển tệp (test của dự án chỉ trượt trong dải import hỏng); import tệp theo đường dẫn <em>hiện tại</em> làm mọi commit trước lần chuyển thành skip ⇒ 146 ứng viên; <code>--first-parent</code> trả về commit merge của <code>feature/don-gian-phi</code> — đúng, ở mức PR. Nguyên nhân gốc: <code>getUTCDate()</code> trừ hai số "ngày trong tháng", nên 29/11 → 02/12 ra 2 − 29 &lt; 0 ⇒ 0 ngày. Test của dự án chỉ dùng ngày trong cùng một tháng.</p>
${ra(L941_NPM)}
${ma(L_K941_DD, 'bash')}
${ra(L941_DD)}
${ra(L941_FP)}
</details>
<details><summary>Ticket #942 — the server builds without the lockfile / server build bỏ lockfile</summary>
${ra(L942)}
${ma(L_K942, 'bash')}
${ra(L942_CHIA_DOI)}
<p>EN: the developer's machine uses the lockfile (2.3.2); the Docker build does not — <code>.dockerignore</code> excludes <code>package-lock.json</code> "to avoid merge conflicts", and the Dockerfile runs <code>npm install</code>, so <code>^2.1.0</code> resolves to 2.6.0. Bisecting versions points at 2.4.0, whose changelog hides the default change ("week start from the en-US locale") under "Cải tiến". Two fixes, both needed: build reproducibly (<code>npm ci</code>, lockfile copied into the image) and do not rely on a library default for a business rule (<code>{ dauTuan: 1 }</code>).</p>
<p>VI: máy dev dùng lockfile (2.3.2); bản build Docker thì không — <code>.dockerignore</code> loại <code>package-lock.json</code> "cho khỏi xung đột merge", và Dockerfile chạy <code>npm install</code>, nên <code>^2.1.0</code> thành 2.6.0. Chia đôi phiên bản chỉ ra 2.4.0, bản có changelog giấu thay đổi mặc định ("đầu tuần theo vùng en-US") dưới chữ "Cải tiến". Hai cách sửa, cần cả hai: build lặp lại được (<code>npm ci</code>, chép lockfile vào ảnh) và không dựa vào giá trị mặc định của thư viện cho một quy tắc nghiệp vụ (<code>{ dauTuan: 1 }</code>).</p>
</details>
<details><summary>The fix (diff) and proof / bản sửa (diff) và bằng chứng</summary>
${ma(L_DIFF, 'diff')}
${ra(L_SUA)}
<details><summary>c94.sh — every answer above in one script / mọi đáp án trong một script</summary>${ma(L_C94, 'bash')}</details>
</details>`;

export default {
  title: '9.4 — Lab: Find the breaking commit and the breaking dependency|||9.4 — Lab: Tìm commit gây lỗi và thư viện gây lỗi',
  slug: 'dbg-9-4-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Hai ticket thật của LabFlow mượn thiết bị (kho 336 commit + registry npm nội bộ + server build bằng Docker): #941 "trả trễ 3 ngày qua tháng bị tính 0 đ, bản 3.0 đúng" — test của dự án vẫn xanh 6/6; bisect run qua 318 commit có dải import hỏng và một lần chuyển tệp (npm test đổ lỗi cho commit chuyển tệp, import theo đường mới ⇒ 146 ứng viên, script qua src/index.mjs ⇒ đúng commit getUTCDate() sau 10 lượt); #942 "máy dev lịch tuần bắt đầu thứ Hai, server test bắt đầu Chủ nhật" — .dockerignore bỏ package-lock.json + npm install ⇒ @labflow/lich-tuan 2.6.0 trong container, 2.3.2 ở máy dev; chia đôi phiên bản ⇒ 2.4.0 đổi mặc định đầu tuần. Gợi ý 3 bậc, rubric 100 điểm, 5 câu phỏng vấn, mốc dự án, đáp án là output thật + diff + test hồi quy.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lab</span>
<h2>Two "it worked before" tickets</h2>
<p class="lead">LabFlow-muon handles equipment loans: late fees and the weekly calendar. The repository has 336 commits by four people, merged through feature branches; its tests are green. The customer's QA filed two tickets this week. One is in the code's history, one is in the libraries — and you have to prove which is which, with the commit and the version, not with a guess.</p>

<h3>Rules</h3>
<ul>
<li>Do not read the generator (<code>tao-lab.mjs</code>) before you finish — it contains the answer. Treat the repository as a project you just joined.</li>
<li>Every claim in your report must come with the command and its output.</li>
<li>No fix without a test that is red before and green after.</li>
<li>AI may explain a command or an error message; it may not be asked "find the bug".</li>
</ul>

<h3>Setup (10 min)</h3>
${CHUAN_BI}
${TEP}

<h3>The two tickets (as QA wrote them)</h3>
<div class="callout warn">
<p><strong>#941 — Late fee is 0 when the loan crosses a month.</strong> "Due 29/11/2026, returned 02/12/2026 ⇒ the system charges 0 đ. Should be 3 days × 20,000 = 60,000 đ. Version 3.0.0 (July) charged correctly. Also 30/12 → 01/01 gives 0." Severity: High (revenue).</p>
<p><strong>#942 — Weekly calendar starts on Sunday on the test server.</strong> "On the dev laptop, the week of 25/11/2026 shows 'Tuần từ thứ Hai 2026-11-23'. On the test server (built from the same commit, v3.4.0) it shows 'Tuần từ Chủ nhật 2026-11-22'. Nobody changed lich.mjs." Severity: Medium.</p>
</div>

<h3>Hints (open one level at a time)</h3>
<details><summary>#941 — level 1: where to look</summary><p>Write the check first and run it at HEAD and at <code>v3.0.0</code>. Then ask: does the file that computes the fee exist at the same path in every commit?</p></details>
<details><summary>#941 — level 2: tools</summary><p><code>git log --oneline --follow -- src/tinh-phi/phi-tre.mjs</code>; import through <code>src/index.mjs</code> (the public API) rather than the file path; exit 125 when the module cannot be loaded. Try <code>npm test</code> as the bisect command once, and explain its answer.</p></details>
<details><summary>#941 — level 3: the area</summary><p>Look at how <code>soNgayTre</code> computes the number of days in the first bad commit. Which dates did the project's tests use?</p></details>
<details><summary>#942 — level 1: where to look</summary><p>"Same commit, different behaviour" ⇒ not a code bug. Compare what is <em>installed</em> on the laptop and inside the container.</p></details>
<details><summary>#942 — level 2: tools</summary><p><code>npm ls @labflow/lich-tuan</code> on both; <code>docker exec … ls /app</code>; read <code>Dockerfile</code> and <code>.dockerignore</code>; bisect the versions with <code>chia-doi-phien-ban.mjs</code> from lesson 9.3.</p></details>
<details><summary>#942 — level 3: the area</summary><p>Read the CHANGELOG inside the first bad version's tarball (<code>npm pack</code>). What does <code>batDauTuan</code> use when no option is given?</p></details>

<h3>What to hand in</h3>
<ol>
<li>For #941: the check script, the bisect log, the first bad commit (hash + title), and one sentence of root cause.</li>
<li>For #941: one wrong bisect you tried (or the <code>npm test</code> one) and why it was wrong.</li>
<li>For #942: <code>npm ls</code> from both environments, the line(s) of <code>Dockerfile</code>/<code>.dockerignore</code> responsible, the first bad library version and its changelog line.</li>
<li>A fix as a diff, with regression tests for both tickets (red before, green after), and proof from a rebuilt container.</li>
<li>A five-line comment you would post on each ticket.</li>
</ol>

<h3>Rubric (100 points)</h3>
<table>
<thead><tr><th>Criterion</th><th>Points</th></tr></thead>
<tbody>
<tr><td>#941 check script: outside the repo, through the public API, 0/1/125 used correctly, works at HEAD and v3.0.0</td><td>20</td></tr>
<tr><td>#941 correct commit + bisect log + root cause</td><td>15</td></tr>
<tr><td>Explained at least one wrong bisect (npm test / path / 124)</td><td>10</td></tr>
<tr><td>#942 proved the environment difference (npm ls both sides, Docker files)</td><td>15</td></tr>
<tr><td>#942 first bad version + changelog line</td><td>10</td></tr>
<tr><td>Fix: reproducible build (npm ci, lockfile in image) + explicit option + fee formula</td><td>15</td></tr>
<tr><td>Regression tests red → green; rebuilt container shows the fix</td><td>10</td></tr>
<tr><td>Ticket comments: short, checkable, name commits not people</td><td>5</td></tr>
</tbody></table>

<h3>🎤 What an interviewer will ask</h3>
${DAN_Y_EN}

<h3>🛠 Project milestone</h3>
<p>For your capstone (chapter 12) and your group project: commit <code>.nvmrc</code>, <code>engine-strict</code>, <code>.gitattributes</code>, <code>.env.example</code> + start-up check, use <code>npm ci</code> in every Dockerfile and CI job, and keep a <code>scripts/bisect/</code> folder where each regression you fix leaves its check script behind.</p>

<h3>Answers (check only after writing yours)</h3>
${DAP_AN}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Lab</span>
<h2>Hai ticket "trước còn chạy"</h2>
<p class="lead">LabFlow-muon quản lý mượn thiết bị: phí trả trễ và lịch tuần. Kho có 336 commit của bốn người, merge qua nhánh tính năng; test đều xanh. QA của khách vừa mở hai ticket tuần này. Một cái nằm trong lịch sử mã, một cái nằm trong thư viện — và bạn phải chứng minh cái nào là cái nào, bằng commit và phiên bản, không bằng phỏng đoán.</p>

<h3>Luật</h3>
<ul>
<li>Đừng đọc script sinh kho (<code>tao-lab.mjs</code>) trước khi làm xong — nó chứa đáp án. Coi kho như một dự án bạn vừa vào.</li>
<li>Mọi khẳng định trong báo cáo phải kèm lệnh và output của nó.</li>
<li>Không sửa khi chưa có test đỏ trước và xanh sau.</li>
<li>Được hỏi AI giải thích một lệnh hay một thông báo lỗi; không được hỏi "tìm lỗi giùm".</li>
</ul>

<h3>Chuẩn bị (10 phút)</h3>
${CHUAN_BI}
${TEP}

<h3>Hai ticket (nguyên văn QA viết)</h3>
<div class="callout warn">
<p><strong>#941 — Phí trễ bằng 0 khi lượt mượn vắt qua tháng.</strong> "Hạn 29/11/2026, trả 02/12/2026 ⇒ hệ thống tính 0 đ. Đúng phải là 3 ngày × 20.000 = 60.000 đ. Bản 3.0.0 (tháng 7) tính đúng. 30/12 → 01/01 cũng ra 0." Mức độ: Cao (doanh thu).</p>
<p><strong>#942 — Lịch tuần trên server test bắt đầu từ Chủ nhật.</strong> "Trên laptop dev, tuần của 25/11/2026 hiện 'Tuần từ thứ Hai 2026-11-23'. Trên server test (build từ cùng commit, v3.4.0) hiện 'Tuần từ Chủ nhật 2026-11-22'. Không ai sửa lich.mjs." Mức độ: Trung bình.</p>
</div>

<h3>Gợi ý (mở từng bậc một)</h3>
<details><summary>#941 — bậc 1: nhìn vào đâu</summary><p>Viết phép kiểm trước rồi chạy ở HEAD và ở <code>v3.0.0</code>. Rồi tự hỏi: tệp tính phí có nằm cùng một đường dẫn ở mọi commit không?</p></details>
<details><summary>#941 — bậc 2: công cụ</summary><p><code>git log --oneline --follow -- src/tinh-phi/phi-tre.mjs</code>; import qua <code>src/index.mjs</code> (API công khai) thay vì đường dẫn tệp; thoát 125 khi module không nạp được. Thử <code>npm test</code> làm lệnh bisect một lần, và giải thích đáp án của nó.</p></details>
<details><summary>#941 — bậc 3: vùng mã</summary><p>Xem <code>soNgayTre</code> tính số ngày thế nào ở commit xấu đầu tiên. Test của dự án dùng những ngày nào?</p></details>
<details><summary>#942 — bậc 1: nhìn vào đâu</summary><p>"Cùng commit, khác hành vi" ⇒ không phải lỗi mã. So thứ được <em>cài</em> trên laptop và bên trong container.</p></details>
<details><summary>#942 — bậc 2: công cụ</summary><p><code>npm ls @labflow/lich-tuan</code> ở cả hai bên; <code>docker exec … ls /app</code>; đọc <code>Dockerfile</code> và <code>.dockerignore</code>; chia đôi phiên bản bằng <code>chia-doi-phien-ban.mjs</code> của bài 9.3.</p></details>
<details><summary>#942 — bậc 3: vùng mã</summary><p>Đọc CHANGELOG bên trong gói của bản xấu đầu tiên (<code>npm pack</code>). Khi không truyền tuỳ chọn, <code>batDauTuan</code> dùng giá trị nào?</p></details>

<h3>Nộp gì</h3>
<ol>
<li>Cho #941: script kiểm, bisect log, commit xấu đầu tiên (hash + tiêu đề), và một câu về nguyên nhân gốc.</li>
<li>Cho #941: một lần bisect sai bạn đã thử (hoặc lần <code>npm test</code>) và vì sao nó sai.</li>
<li>Cho #942: <code>npm ls</code> ở cả hai môi trường, (các) dòng trong <code>Dockerfile</code>/<code>.dockerignore</code> gây ra, bản thư viện xấu đầu tiên và dòng changelog của nó.</li>
<li>Bản sửa dạng diff, kèm test hồi quy cho cả hai ticket (đỏ trước, xanh sau), và bằng chứng từ container build lại.</li>
<li>Một bình luận năm dòng bạn sẽ đăng lên mỗi ticket.</li>
</ol>

<h3>Rubric (100 điểm)</h3>
<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Script kiểm #941: ngoài kho, qua API công khai, dùng đúng 0/1/125, chạy đúng ở HEAD và v3.0.0</td><td>20</td></tr>
<tr><td>#941 đúng commit + bisect log + nguyên nhân gốc</td><td>15</td></tr>
<tr><td>Giải thích được ít nhất một lần bisect sai (npm test / đường dẫn / 124)</td><td>10</td></tr>
<tr><td>#942 chứng minh được khác biệt môi trường (npm ls hai phía, các tệp Docker)</td><td>15</td></tr>
<tr><td>#942 bản xấu đầu tiên + dòng changelog</td><td>10</td></tr>
<tr><td>Bản sửa: build lặp lại được (npm ci, lockfile trong ảnh) + tuỳ chọn tường minh + công thức tính phí</td><td>15</td></tr>
<tr><td>Test hồi quy đỏ → xanh; container build lại cho thấy đã sửa</td><td>10</td></tr>
<tr><td>Bình luận trên ticket: ngắn, kiểm lại được, nêu commit không nêu người</td><td>5</td></tr>
</tbody></table>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
${DAN_Y_VI}

<h3>🛠 Mốc dự án</h3>
<p>Cho dự án cuối khoá (chương 12) và đồ án nhóm: commit <code>.nvmrc</code>, <code>engine-strict</code>, <code>.gitattributes</code>, <code>.env.example</code> + bước kiểm lúc khởi động, dùng <code>npm ci</code> trong mọi Dockerfile và job CI, và giữ một thư mục <code>scripts/bisect/</code> nơi mỗi lỗi hồi quy bạn sửa để lại script kiểm của nó.</p>

<h3>Đáp án (chỉ xem sau khi đã viết câu trả lời của mình)</h3>
${DAP_AN}
</div>
`,
};
