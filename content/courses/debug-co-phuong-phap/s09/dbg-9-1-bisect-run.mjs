/**
 * 9.1 — git bisect run với script kiểm tự động (soạn 24/11/2026, máy nhà Linux).
 * Output THẬT: git 2.55, Node 22, Maven 3.9.11 + JDK 25 offline — kho sinh bằng script (labflow-bao-cao 498 commit, labflow-diem 64 commit),
 * scratchpad/dbg/lab/ch9/c91 (tao-repo*.mjs, kiem/, c91*.sh; o-91-*.txt). Lệnh bisect cơ bản đã dạy ở khoá git bài 2.4 — ở đây chỉ liên kết.
 */
import { nguon, lienKet } from '../_chung.mjs';
import { TAO_REPO, KIEM_CSV, KIEM_SH, KIEM_124, KIEM_KILL, KIEM_TREO, C91_SH, TAO_JAVA, KIEM_MVN, KIEM_MVN_THO, J_TEST } from './_ma-9.mjs';
import { DUNG, NGAY_THO, T124, T137, FP, LOG, REPLAY, TERMS, J_THO, J_DUNG } from './_ra-9.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;

const BANG_MA_EN = `<table>
<thead><tr><th>Exit code of your script</th><th>git bisect run reads it as</th><th>Typical source</th></tr></thead>
<tbody>
<tr><td><code>0</code></td><td>good — the bug is NOT here</td><td>your check passed</td></tr>
<tr><td><code>1</code> … <code>127</code> except <code>125</code></td><td>bad — the bug IS here</td><td>your check failed — but also <code>npm</code> "Missing script", <code>mvn</code> compile error, <code>timeout</code>'s <code>124</code>, "command not found" <code>127</code></td></tr>
<tr><td><code>125</code></td><td>skip — this commit cannot be judged</td><td>you decided it: does not build, does not load, hangs</td></tr>
<tr><td><code>128</code> and above</td><td>abort the whole bisect</td><td>the script was killed by a signal (<code>137</code> = 128 + 9 SIGKILL), or <code>exit 255</code></td></tr>
</tbody></table>`;
const BANG_MA_VI = `<table>
<thead><tr><th>Mã thoát của script</th><th>git bisect run hiểu là</th><th>Hay đến từ đâu</th></tr></thead>
<tbody>
<tr><td><code>0</code></td><td>good — lỗi KHÔNG có ở đây</td><td>bước kiểm của bạn qua</td></tr>
<tr><td><code>1</code> … <code>127</code> trừ <code>125</code></td><td>bad — lỗi CÓ ở đây</td><td>bước kiểm trượt — nhưng cũng là <code>npm</code> "Missing script", <code>mvn</code> lỗi biên dịch, <code>124</code> của <code>timeout</code>, <code>127</code> "command not found"</td></tr>
<tr><td><code>125</code></td><td>skip — commit này không phán được</td><td>chính bạn quyết: không build được, không nạp được, treo</td></tr>
<tr><td><code>128</code> trở lên</td><td>huỷ cả phiên bisect</td><td>script bị tín hiệu giết (<code>137</code> = 128 + 9 SIGKILL), hoặc <code>exit 255</code></td></tr>
</tbody></table>`;

const NGUON = [
  lienKet({ khoa: 'git', bai: 'git-2-4-bisect', title: 'Khoá Git — Bài 2.4: git bisect', sub: 'good/bad/skip/reset, bisect thủ công — bài này không dạy lại phần đó.', cta: 'Mở bài →' }),
  nguon('📘', 'git-bisect — tài liệu chính thức', 'Mã thoát 0 / 1–127 / 125 / còn lại huỷ; --first-parent; terms; replay.', 'https://git-scm.com/docs/git-bisect'),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-1-3-khoanh-vung', title: 'Bài 1.3 — Khoanh vùng bằng chia đôi', sub: 'Cùng ý tưởng, áp dụng cho tầng, mã, dữ liệu.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-9-3-phu-thuoc', title: 'Bài 9.3 — Lỗi hồi quy do thư viện', sub: 'Khi lịch sử mã không đổi mà phiên bản thư viện đổi.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '9.1 — git bisect run with an automatic test script|||9.1 — git bisect run với script kiểm tự động',
  slug: 'dbg-9-1-bisect-run',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lệnh bisect đã học ở khoá Git 2.4 — bài này dạy viết SCRIPT kiểm cho bisect run sao cho không chỉ nhầm commit. Chạy thật trên kho 498 commit: git bisect run npm test đổ lỗi cho chính commit THÊM test (test không có ở commit cũ ⇒ cái gì cũng "good"); script đặt ngoài kho trả 0/1/125 tìm đúng commit refactor trong 15 lượt (10 phán + 5 bỏ qua dấu xung đột và module treo); để nguyên mã 124 của timeout ⇒ chỉ nhầm commit "đợi cấu hình"; timeout -s KILL ⇒ 137 ⇒ bisect huỷ. Maven: mvn trả 1 cho cả lỗi biên dịch ⇒ chỉ nhầm commit đổi tên hàm; tách compile || exit 125 ⇒ đúng commit perf cắt làm tròn (7,0 thành 6,9). --first-parent trả về commit merge, bisect log/replay, terms old/new để tìm commit đã SỬA.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Let a script find the commit for you</h2>
<p class="lead">QA writes: "CSV export broke — a note with a comma shifts every column. Version 1.3.0 in June was fine." Between that tag and today there are 489 commits. You already know the <code>git bisect</code> commands from the Git course; this lesson is about the part that decides whether bisect gives you the <em>right</em> answer: the <strong>check script</strong> you hand to <code>git bisect run</code>. Every run below is real, on a generated repository you can rebuild yourself — including the four ways a careless script points at the wrong commit.</p>

<h3>An everyday picture: one dead bulb in a 500-bulb string</h3>
<p>A string of fairy lights goes dark. Testing bulbs one by one takes all evening. Cut the string in half, plug in each half: the dark half has the dead bulb. Nine cuts and you hold the single bulb. But it only works if your "plug it in" test is honest. If your plug is loose, a good half looks dead and you throw away the wrong half — and you will still end up holding exactly one bulb, confidently, the wrong one. <code>git bisect run</code> always ends with one commit. Whether it is the right one depends entirely on your test.</p>

<h3>1. The repository and the bug</h3>
<p>To practise on something realistic, a script builds a project with 498 commits (four fake authors, feature branches merged with <code>--no-ff</code>, fixed dates so every hash is the same on your machine). Somewhere in a feature branch a "harmless" refactor replaced the CSV cell function with a shared one that escapes quotes but forgets to wrap values containing commas. Two more traps are planted on the way: a range of commits with leftover merge-conflict markers (the module does not load) and a range where the module hangs on import (a busy-wait loop). Near HEAD someone added a failing test that reproduces ticket #912.</p>
<details><summary>c91/tao-repo.mjs — the generator (run: <code>node tao-repo.mjs labflow-bao-cao</code>)</summary>${ma(TAO_REPO)}</details>

<h3>2. Trap 1: <code>git bisect run npm test</code></h3>
${ra(NGAY_THO)}
<p>Bisect answered confidently: the first bad commit is <em>"test(csv): tái hiện ticket #912"</em> — the commit that <strong>added the test</strong>. Of course: in every older commit that test file does not exist, so <code>npm test</code> runs only the other tests and passes. The project's own test suite is part of the history being searched; it changes under your feet at every checkout. The rule: <strong>the check must be identical at every commit</strong> — keep it outside the repository (or copy it in from a fixed place before each run).</p>

<h3>3. A check script that tells the truth</h3>
${ma(KIEM_CSV)}
${ma(KIEM_SH, 'bash')}
<p>Two files, both outside the repository. The Node check imports the module, feeds it the exact row from the ticket and compares the CSV line. If the module cannot even load (conflict markers ⇒ <code>SyntaxError</code>) it exits <code>125</code>: "I cannot judge this commit", not "the bug is here". The shell wrapper adds a 10-second limit and maps a hang to <code>125</code> as well.</p>
${BANG_MA_EN}
${ra(DUNG)}
<p>Fifteen runs for 489 commits: ten real verdicts and five skips (two commits with conflict markers, three that hang — each hang costs the full 10 seconds, which is most of the run time). The answer is the refactor commit inside <code>feature/gon-csv</code>, with its diff stat. Notice how bisect handles a skip: it simply tests a neighbour. Skips cost steps, so skip only what truly cannot be judged.</p>

<h3>4. Traps 2 and 3: the exit codes of <code>timeout</code></h3>
${ma(KIEM_124, 'bash')}
${ra(T124)}
<p>Without the mapping, <code>timeout</code> exits <code>124</code> when the module hangs — and 124 is in the "bad" range. Look at the lines with no <code>=&gt;</code>: those are the 10-second hangs, silently counted as bad. Bisect walked into the hanging range and blamed <em>"feat(dinh-dang): đợi cấu hình nạp xong"</em> — a real bug, but not <strong>this</strong> bug. Hand that hash to your team lead and you have just accused the wrong colleague.</p>
${ma(KIEM_KILL, 'bash')}
${ra(T137)}
<p>With <code>-s KILL</code> the hung process dies by signal 9; the script exits <code>137</code> (128 + 9) and git refuses to guess: <em>"bisect run failed: exit code 137 … is &lt; 0 or &gt;= 128"</em>. This one is at least honest. The same happens if your script is killed by the OOM killer — exit 137 — something you met in lesson 8.4.</p>

<h3>5. Java / Maven: compile errors look exactly like failing tests</h3>
<p>The second generated repository is a small Maven project that computes course grades (20% / 30% / 50%, rounded to one decimal). Ticket #931: a student with 8 / 7 / 6.5 should get 7.0 ("Khá"), the grade sheet prints 6.9 ("Trung bình"). Between v2.0.0 and v2.3.0 there is a range where someone renamed a method and forgot a call site — the project does not compile.</p>
<details><summary>c91/tao-repo-java.mjs — the Maven repository generator</summary>${ma(TAO_JAVA)}</details>
${ma(KIEM_MVN_THO, 'bash')}
${ra(J_THO)}
<p>Maven exits <code>1</code> for a failing test <em>and</em> for a compile error. The naive script therefore treated the non-compiling commits as "bad", and bisect blamed the rename commit. Separate the two questions:</p>
${ma(J_TEST, 'java')}
${ma(KIEM_MVN, 'bash')}
${ra(J_DUNG)}
<p>Now the three non-compiling commits are skipped and the answer is <em>"perf(diem): bỏ Math.round, cắt phần thừa cho nhanh"</em>: <code>(int) (x * 10) / 10.0</code> truncates 6.95 to 6.9. Two details matter: the test class has a name that never exists in the repository (<code>BisectKiemTest</code>), and <code>trap … EXIT</code> deletes it, so the working tree is clean before git checks out the next commit. Ten Maven runs took about 30 seconds offline — budget your bisect: if one build takes 3 minutes, nine steps take half an hour, still far better than reading 58 diffs.</p>

<h3>6. Merge-heavy history: <code>--first-parent</code></h3>
${ra(FP)}
<p>Teams that merge every pull request with a merge commit have two kinds of history: the main line (one commit per PR) and the inside of each branch. <code>--first-parent</code> (git 2.29+) walks only the main line and answers with the <strong>merge commit</strong> of <code>feature/gon-csv</code> — that is: "this PR broke it". Use it when you want to know which PR to revert or whom to ask; then, if needed, bisect again inside that branch. On a busy project it also avoids landing on half-finished commits inside branches that never built.</p>

<h3>7. Keep the record: <code>bisect log</code> and <code>replay</code></h3>
${ra(LOG)}
${ra(REPLAY)}
<p>The log is the evidence: every commit tested and the verdict. Attach it to the ticket. If you realise one verdict was wrong (you marked a commit bad by mistake during a manual session), edit that one line in the saved file and <code>git bisect replay</code> it — git re-applies all your decisions in seconds instead of rebuilding nine times.</p>

<h3>8. Not only "when did it break": custom terms</h3>
${ma(KIEM_TREO, 'bash')}
${ra(TERMS)}
<p>"good/bad" sounds wrong when you search for the commit that <em>fixed</em> something (to backport the fix to an older release branch). Name the states yourself: <code>--term-old</code> is the state of older commits, <code>--term-new</code> the state of newer ones. Here bisect found the revert that removed the hang. The same pattern finds the commit that made a page slow: the script measures, compares with a threshold, exits 0 or 1.</p>
<details><summary>c91/c91.sh — all the sessions above in one script</summary>${ma(C91_SH, 'bash')}</details>

<h3>Checklist before you start a bisect</h3>
<ol>
<li>Reproduce at HEAD with your script — it must exit 1. Check out the good tag and run it — it must exit 0. If either fails, fix the script first.</li>
<li>Put the script and its test data outside the repository; never depend on files that change across history (tests, fixtures, scripts in <code>package.json</code>).</li>
<li>Decide what "cannot judge" means (does not build, does not load, hangs, migration missing) and map it to 125. Keep 1 only for "the bug I am looking for is present".</li>
<li>Limit time with <code>timeout</code> and translate 124; never let a signal escape (≥ 128).</li>
<li>Clean working tree; anything the script creates must be ignored or removed in a <code>trap</code>.</li>
<li>If dependencies change along the history, the script must reinstall them (<code>npm ci</code>) — otherwise you test old code with new libraries.</li>
</ol>

<h3>On the job</h3>
<p>In an outsourcing project the regression ticket usually arrives with a version range: "works on 2.2 in the customer's UAT, broken on 2.3". Your reply on the ticket should be short and checkable: the first bad commit (hash + title + PR link), the bisect log attached, the check script attached, and one sentence of root cause. Name the commit, not the person — the author was reviewed by someone, and a test that would have caught it did not exist; that is a team gap (lesson 11.3). Many teams also add your check script as a regression test in the same PR as the fix.</p>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok">
<ol>
<li>Rebuild the repository with <code>node tao-repo.mjs labflow-bao-cao</code> and reproduce the naive <code>npm test</code> session. Explain in two sentences why it blamed the test commit.</li>
<li>Write your own check script without looking at <code>kiem-csv.mjs</code>; make it exit 125 for the conflict-marker commits. Compare your bisect log with the one above.</li>
<li>Remove the 124 → 125 mapping and confirm you get <code>54df41a</code>. Then put it back.</li>
<li>Run the same search with <code>--first-parent</code>. Which PR would you revert?</li>
<li>Maven: rebuild <code>labflow-diem</code>, run both scripts, and time them. How long would 500 commits take?</li>
</ol>
<p><strong>Done when:</strong> your script gives the right commit on both repositories, and you can say for each of 0, 1, 125, 124 and 137 what git does with it.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">git bisect run</span><span class="v">Binary search over history driven by a command's exit code.</span></div>
  <div class="kv"><span class="k">Exit code 125</span><span class="v">"Skip": this commit cannot be judged.</span></div>
  <div class="kv"><span class="k">Exit code ≥ 128</span><span class="v">Aborts the bisect (usually a signal: 137 = SIGKILL).</span></div>
  <div class="kv"><span class="k">Check outside the repo</span><span class="v">A test that does not change when git checks out another commit.</span></div>
  <div class="kv"><span class="k">--first-parent</span><span class="v">Bisect only the main line; the answer is a merge commit (a PR).</span></div>
  <div class="kv"><span class="k">bisect log / replay</span><span class="v">Saved record of verdicts; re-apply it after fixing one line.</span></div>
  <div class="kv"><span class="k">--term-old / --term-new</span><span class="v">Rename good/bad, e.g. to find the commit that fixed something.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Bisect always ends with one commit; only your check script decides whether it is the right one.</li>
<li>Do not bisect with the project's own test suite: tests added later make every old commit "good".</li>
<li>0 = good, 1–127 = bad, 125 = skip, ≥128 = abort — map "does not build / load / hangs" to 125 yourself.</li>
<li><code>timeout</code> returns 124 (counted as bad) and, with KILL, 137 (aborts): translate it.</li>
<li>Maven returns 1 for compile errors too: <code>mvn compile || exit 125</code> before the test.</li>
<li><code>--first-parent</code> answers "which PR"; <code>bisect log</code> is evidence for the ticket.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Để script tìm commit giùm bạn</h2>
<p class="lead">QA viết: "Xuất CSV hỏng — ghi chú có dấu phẩy làm lệch hết các cột. Bản 1.3.0 hồi tháng 6 vẫn đúng." Giữa tag đó và hôm nay có 489 commit. Các lệnh <code>git bisect</code> bạn đã học ở khoá Git; bài này nói về phần quyết định bisect cho bạn câu trả lời <em>đúng</em> hay không: <strong>script kiểm</strong> bạn đưa cho <code>git bisect run</code>. Mọi lần chạy dưới đây đều thật, trên một kho sinh bằng script mà bạn tự dựng lại được — kể cả bốn cách một script ẩu chỉ nhầm commit.</p>

<h3>Liên tưởng đời thường: một bóng chết trong dây đèn 500 bóng</h3>
<p>Dây đèn nháy tắt phụt. Thử từng bóng thì mất cả buổi tối. Cắt đôi dây, cắm từng nửa: nửa nào tối là nửa có bóng chết. Chín lần cắt là bạn cầm đúng một bóng. Nhưng cách này chỉ đúng khi phép thử "cắm điện" trung thực. Nếu phích cắm lỏng, nửa tốt trông như chết và bạn vứt nhầm nửa — cuối cùng bạn vẫn cầm đúng một bóng, rất tự tin, nhưng là bóng sai. <code>git bisect run</code> lúc nào cũng kết thúc bằng một commit. Có đúng commit đó hay không phụ thuộc hoàn toàn vào phép thử của bạn.</p>

<h3>1. Kho mã và con lỗi</h3>
<p>Để luyện trên thứ giống thật, một script dựng dự án 498 commit (bốn tác giả giả, nhánh tính năng merge bằng <code>--no-ff</code>, ngày giờ cố định để mọi hash trên máy bạn giống hệt). Ở đâu đó trong một nhánh tính năng, một lần refactor "vô hại" thay hàm tạo ô CSV bằng một hàm dùng chung: có thoát nháy kép nhưng quên bọc giá trị có dấu phẩy. Trên đường còn cài thêm hai bẫy: một dải commit còn sót dấu xung đột merge (module không nạp được) và một dải mà module treo khi nạp (vòng lặp chờ bận). Gần HEAD có người thêm một test đỏ tái hiện ticket #912.</p>
<details><summary>c91/tao-repo.mjs — script sinh kho (chạy: <code>node tao-repo.mjs labflow-bao-cao</code>)</summary>${ma(TAO_REPO)}</details>

<h3>2. Bẫy 1: <code>git bisect run npm test</code></h3>
${ra(NGAY_THO)}
<p>Bisect trả lời rất tự tin: commit xấu đầu tiên là <em>"test(csv): tái hiện ticket #912"</em> — chính commit <strong>thêm test</strong>. Dĩ nhiên: ở mọi commit cũ hơn, tệp test đó chưa tồn tại, nên <code>npm test</code> chỉ chạy các test khác và qua. Bộ test của dự án nằm trong chính lịch sử đang tìm; nó thay đổi dưới chân bạn ở mỗi lần checkout. Luật: <strong>phép kiểm phải giống hệt nhau ở mọi commit</strong> — đặt nó ngoài kho (hoặc chép vào từ một chỗ cố định trước mỗi lượt).</p>

<h3>3. Script kiểm nói thật</h3>
${ma(KIEM_CSV)}
${ma(KIEM_SH, 'bash')}
<p>Hai tệp, đều nằm ngoài kho. Phần Node nạp module, đưa vào đúng dòng dữ liệu của ticket rồi so dòng CSV. Nếu module còn không nạp được (dấu xung đột ⇒ <code>SyntaxError</code>) thì thoát <code>125</code>: "tôi không phán được commit này", chứ không phải "lỗi nằm ở đây". Lớp vỏ shell thêm giới hạn 10 giây và cũng đổi trường hợp treo thành <code>125</code>.</p>
${BANG_MA_VI}
${ra(DUNG)}
<p>Mười lăm lượt cho 489 commit: mười lần phán thật và năm lần bỏ qua (hai commit còn dấu xung đột, ba commit treo — mỗi lần treo tốn trọn 10 giây, chiếm gần hết thời gian chạy). Đáp án là commit refactor nằm trong <code>feature/gon-csv</code>, kèm thống kê thay đổi. Để ý cách bisect xử lý skip: nó thử commit kế bên. Skip tốn thêm bước, nên chỉ skip thứ thật sự không phán được.</p>

<h3>4. Bẫy 2 và 3: mã thoát của <code>timeout</code></h3>
${ma(KIEM_124, 'bash')}
${ra(T124)}
<p>Không đổi mã, <code>timeout</code> thoát <code>124</code> khi module treo — mà 124 nằm trong vùng "bad". Nhìn các dòng không có <code>=&gt;</code>: đó là những lần treo 10 giây, lặng lẽ bị tính là bad. Bisect đi vào dải treo và đổ lỗi cho <em>"feat(dinh-dang): đợi cấu hình nạp xong"</em> — một lỗi có thật, nhưng không phải lỗi <strong>này</strong>. Đưa hash đó cho trưởng nhóm là bạn vừa đổ oan cho một đồng nghiệp.</p>
${ma(KIEM_KILL, 'bash')}
${ra(T137)}
<p>Với <code>-s KILL</code>, tiến trình treo chết bởi tín hiệu 9; script thoát <code>137</code> (128 + 9) và git từ chối đoán: <em>"bisect run failed: exit code 137 … is &lt; 0 or &gt;= 128"</em>. Kiểu này ít ra còn trung thực. Chuyện tương tự xảy ra nếu script bị OOM killer giết — mã 137 — thứ bạn đã gặp ở bài 8.4.</p>

<h3>5. Java / Maven: lỗi biên dịch trông y như test đỏ</h3>
<p>Kho sinh thứ hai là một dự án Maven nhỏ tính điểm học phần (20% / 30% / 50%, làm tròn một chữ số thập phân). Ticket #931: sinh viên được 8 / 7 / 6,5 phải được 7,0 ("Khá"), bảng điểm in 6,9 ("Trung bình"). Giữa v2.0.0 và v2.3.0 có một dải mà ai đó đổi tên hàm rồi quên một chỗ gọi — dự án không biên dịch được.</p>
<details><summary>c91/tao-repo-java.mjs — script sinh kho Maven</summary>${ma(TAO_JAVA)}</details>
${ma(KIEM_MVN_THO, 'bash')}
${ra(J_THO)}
<p>Maven thoát <code>1</code> khi test đỏ <em>và</em> khi lỗi biên dịch. Script ngây thơ vì thế coi các commit không biên dịch được là "bad", và bisect đổ lỗi cho commit đổi tên hàm. Tách hai câu hỏi ra:</p>
${ma(J_TEST, 'java')}
${ma(KIEM_MVN, 'bash')}
${ra(J_DUNG)}
<p>Giờ ba commit không biên dịch được bị bỏ qua và đáp án là <em>"perf(diem): bỏ Math.round, cắt phần thừa cho nhanh"</em>: <code>(int) (x * 10) / 10.0</code> cắt 6,95 thành 6,9. Hai chi tiết quan trọng: lớp test mang một cái tên không bao giờ có trong kho (<code>BisectKiemTest</code>), và <code>trap … EXIT</code> xoá nó đi, nên cây làm việc sạch trước khi git checkout commit kế. Mười lượt Maven offline mất khoảng 30 giây — hãy ước lượng trước: nếu một lần build mất 3 phút, chín bước mất nửa tiếng, vẫn hơn xa việc đọc 58 diff.</p>

<h3>6. Lịch sử nhiều merge: <code>--first-parent</code></h3>
${ra(FP)}
<p>Nhóm nào merge mọi pull request bằng commit merge thì có hai loại lịch sử: dòng chính (mỗi PR một commit) và bên trong từng nhánh. <code>--first-parent</code> (git 2.29+) chỉ đi trên dòng chính và trả lời bằng <strong>commit merge</strong> của <code>feature/gon-csv</code> — tức là: "PR này làm hỏng". Dùng khi bạn muốn biết nên revert PR nào hoặc hỏi ai; sau đó, nếu cần, bisect tiếp bên trong nhánh đó. Ở dự án đông người, cách này còn tránh rơi vào những commit dở dang trong nhánh vốn chưa bao giờ build được.</p>

<h3>7. Giữ bằng chứng: <code>bisect log</code> và <code>replay</code></h3>
${ra(LOG)}
${ra(REPLAY)}
<p>Nhật ký là bằng chứng: mọi commit đã thử và phán quyết. Đính nó vào ticket. Nếu nhận ra một phán quyết sai (bạn bấm nhầm bad trong một phiên bisect bằng tay), sửa đúng dòng đó trong tệp đã lưu rồi <code>git bisect replay</code> — git áp lại mọi quyết định của bạn trong vài giây thay vì build lại chín lần.</p>

<h3>8. Không chỉ "hỏng từ lúc nào": tự đặt tên trạng thái</h3>
${ma(KIEM_TREO, 'bash')}
${ra(TERMS)}
<p>"good/bad" nghe ngược khi bạn tìm commit đã <em>sửa</em> một thứ gì đó (để backport bản sửa sang nhánh phát hành cũ). Tự đặt tên trạng thái: <code>--term-old</code> là trạng thái của commit cũ, <code>--term-new</code> là trạng thái của commit mới. Ở đây bisect tìm ra commit revert đã gỡ vòng treo. Cùng khuôn đó tìm được commit làm một trang chậm đi: script đo thời gian, so với ngưỡng, thoát 0 hoặc 1.</p>
<details><summary>c91/c91.sh — mọi phiên ở trên gói trong một script</summary>${ma(C91_SH, 'bash')}</details>

<h3>Checklist trước khi bisect</h3>
<ol>
<li>Tái hiện ở HEAD bằng script — phải thoát 1. Checkout tag tốt rồi chạy — phải thoát 0. Một trong hai sai thì sửa script trước.</li>
<li>Đặt script và dữ liệu thử ngoài kho; đừng phụ thuộc tệp thay đổi theo lịch sử (test, fixture, script trong <code>package.json</code>).</li>
<li>Quyết định thế nào là "không phán được" (không build, không nạp, treo, thiếu migration) và đổi thành 125. Chỉ dùng 1 cho "lỗi tôi đang tìm có mặt".</li>
<li>Giới hạn thời gian bằng <code>timeout</code> và đổi mã 124; đừng để tín hiệu lọt ra ngoài (≥ 128).</li>
<li>Cây làm việc sạch; thứ gì script tạo ra phải được ignore hoặc xoá trong <code>trap</code>.</li>
<li>Nếu thư viện thay đổi dọc lịch sử, script phải cài lại (<code>npm ci</code>) — không thì bạn đang thử mã cũ với thư viện mới.</li>
</ol>

<h3>Đi làm thật</h3>
<p>Ở dự án outsourcing, ticket hồi quy thường đến kèm một khoảng phiên bản: "bản 2.2 trên UAT của khách chạy đúng, bản 2.3 hỏng". Câu trả lời của bạn trên ticket nên ngắn và kiểm lại được: commit xấu đầu tiên (hash + tiêu đề + liên kết PR), đính kèm bisect log, đính kèm script kiểm, và một câu về nguyên nhân gốc. Nêu tên commit, không nêu tên người — người viết đã được review, và test lẽ ra bắt được lỗi thì chưa ai viết; đó là lỗ hổng của cả nhóm (bài 11.3). Nhiều nhóm còn đưa script kiểm của bạn thành test hồi quy trong chính PR sửa lỗi.</p>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok">
<ol>
<li>Dựng lại kho bằng <code>node tao-repo.mjs labflow-bao-cao</code> và tái hiện phiên <code>npm test</code> ngây thơ. Giải thích trong hai câu vì sao nó đổ lỗi cho commit thêm test.</li>
<li>Tự viết script kiểm mà không nhìn <code>kiem-csv.mjs</code>; làm nó thoát 125 với các commit còn dấu xung đột. So bisect log của bạn với log ở trên.</li>
<li>Bỏ phần đổi 124 → 125 và xác nhận bạn nhận được <code>54df41a</code>. Rồi trả lại như cũ.</li>
<li>Chạy lại cùng cuộc tìm với <code>--first-parent</code>. Bạn sẽ revert PR nào?</li>
<li>Maven: dựng lại <code>labflow-diem</code>, chạy cả hai script và đo thời gian. 500 commit thì mất bao lâu?</li>
</ol>
<p><strong>Đạt khi:</strong> script của bạn cho đúng commit trên cả hai kho, và bạn nói được với từng mã 0, 1, 125, 124 và 137 thì git làm gì.</p>
</div>

<h3>🗂 Thuật ngữ chính</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">git bisect run</span><span class="v">Tìm nhị phân trên lịch sử, điều khiển bằng mã thoát của một lệnh.</span></div>
  <div class="kv"><span class="k">Mã thoát 125</span><span class="v">"Bỏ qua": commit này không phán được.</span></div>
  <div class="kv"><span class="k">Mã thoát ≥ 128</span><span class="v">Huỷ phiên bisect (thường do tín hiệu: 137 = SIGKILL).</span></div>
  <div class="kv"><span class="k">Kiểm ngoài kho</span><span class="v">Phép thử không đổi khi git checkout sang commit khác.</span></div>
  <div class="kv"><span class="k">--first-parent</span><span class="v">Chỉ bisect dòng chính; đáp án là một commit merge (một PR).</span></div>
  <div class="kv"><span class="k">bisect log / replay</span><span class="v">Bản ghi các phán quyết; sửa một dòng rồi áp lại.</span></div>
  <div class="kv"><span class="k">--term-old / --term-new</span><span class="v">Đổi tên good/bad, ví dụ để tìm commit đã sửa một lỗi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bisect luôn kết thúc bằng một commit; chỉ script kiểm của bạn quyết định nó đúng hay sai.</li>
<li>Đừng bisect bằng bộ test của dự án: test thêm về sau làm mọi commit cũ thành "good".</li>
<li>0 = good, 1–127 = bad, 125 = skip, ≥128 = huỷ — tự đổi "không build / không nạp / treo" thành 125.</li>
<li><code>timeout</code> trả 124 (bị tính là bad) và với KILL là 137 (huỷ): phải đổi mã.</li>
<li>Maven trả 1 cả khi lỗi biên dịch: <code>mvn compile || exit 125</code> trước khi chạy test.</li>
<li><code>--first-parent</code> trả lời "PR nào"; <code>bisect log</code> là bằng chứng cho ticket.</li>
</ul>
${NGUON}
</div>
`,
};
