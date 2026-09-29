import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';
/**
 * Deploy VPS — Chương 11: Chẩn đoán, nghiệm thu, và bài thi cuối.
 * Nâng cấp 29/09/2026: bài 11.0 slide (deck dv-11, 31 slide) + slide/🧪/🗂/📌 trong 11.1–11.5; đào sâu: cây "hỏng ở
 * bước nào trong bốn bước", ba câu trả lời cho "đang chạy bản nào" (/proc/PID/cwd), đi từ ngoài vào đo lại, chu kỳ
 * đo → giả thuyết → kiểm + ghi.sh và một sổ sự cố thật (StartLimitBurst từ chối restart tay), dựng VPS thí nghiệm,
 * bốn chữ ký đo lại + curl -w từng pha + mã thoát curl 6/7/60, kiểm khói 401/404, lệch lược đồ đo lại, container
 * Restarting, vmstat, tệp đã xoá còn mở, cạn inode, mã thoát 137/134/139 (node là PID 1), nghiem-thu.sh 12 phép,
 * kiem-vps.sh 10 phép, grep -q + pipefail hỏng giả 57/200, giới thiệu Chương 12–15; bài 11.6 thành bài thi phần
 * cốt lõi 10 câu có giải thích. Sửa câu SAI: đường dẫn cgroup v1 (memory.max_usage_in_bytes, memory.oom_control)
 * không tồn tại trên Ubuntu 22.04+ (cgroup v2); "cái ĐẦU TIÊN trong bốn cái hỏng" ⇒ tầng SÂU NHẤT còn hỏng.
 * Mọi số đo là ĐO THẬT: một chồng nginx 1.24.0 + Node + PostgreSQL dựng riêng
 * ở /srv/vps/nt, bốn chữ ký hỏng đo cả mã lẫn thời gian, và một bộ 15 phép
 * kiểm nghiệm thu tìm ra HAI lỗi thật trong chính cấu hình của tôi.
 */

export default {
  title: 'Chapter 11 — Diagnosis, acceptance, and the final exam|||Chương 11 — Chẩn đoán, nghiệm thu, và bài thi cuối',
  slug: 'deploy-ch11-chan-doan',
  description: 'Bốn cú hỏng khác nhau, đo cả mã trạng thái lẫn thời gian: 502 trong 0,33 mili giây, 504 đúng bằng hạn giờ, 500 trong 1,3 ms. Thời gian mới là thứ nói cho bạn biết tầng nào hỏng. Rồi một bộ nghiệm thu 15 phép kiểm, và hai lỗi nó tìm ra.',
  sortOrder: 12,
  lessons: [

    /* ─────────────────────────── 11.0 ─────────────────────────── */
    {
      title: '11.0 — Chapter 11 slides: diagnosis and acceptance in pictures|||11.0 — Slide Chương 11: chẩn đoán và nghiệm thu bằng hình',
      slug: 'deploy-11-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 31 slide của Chương 11: cây "hỏng ở bước nào trong bốn bước", lùi trước hay đi tới, bốn chữ ký 500/502/504 đo lại, curl -w từng pha, sổ sự cố có giờ, tệp đã xoá còn mở, mã thoát 139 khi node là PID 1, và hai bộ nghiệm thu chạy được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Slides</span>
<h2>The whole chapter in 31 slides</h2>
<p class="lead">Skim these before the lessons to see the shape of the chapter, then keep slides 29 and 30 open the next time a deploy goes wrong. Two pictures carry it: a decision tree that asks, left to right, which of the four deploy steps broke — build, move, swap, prove — and a real incident notebook where the right fix still returned 502, because systemd was refusing the restart.</p>
<p>Slides 3–8 belong to Lesson 11.1 (the four-step tree, roll back or roll forward, "which version is running", walking inwards, the measure–hypothesise–test loop, the notebook), 9–12 to 11.2 (four failures and their timings, the signature table, nginx errno, curl phases), 13–16 to 11.3 (deployed but unchanged, 401 against 404, schema drift, "nothing changed"), 17–21 to 11.4 (the order to check, <code>vmstat</code>, a deleted file still open, inode exhaustion, exit codes 137/134/139/1) and 22–27 to 11.5 (<code>nghiem-thu.sh</code>, its first run at 8 of 12, making it fail on purpose, accepting the machine with <code>kiem-vps.sh</code>, a checker that failed 57 times in 200, and the four new chapters). The last four are common mistakes, a two-page cheat sheet and a 45-minute practice session. New terminals are real output recorded on 29/09/2026 on the "lab VPS" — an Ubuntu 24.04 container running systemd, sshd, nginx and PostgreSQL that the Mac reaches over SSH like a rented server — plus <code>docker</code> runs on the Mac.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Slide</span>
<h2>Cả chương trong 31 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để thấy hình dạng của chương, rồi để sẵn slide 29 và 30 cho lần deploy hỏng kế tiếp. Hai bức hình gánh cả chương: một cây quyết định hỏi, từ trái sang phải, bước nào trong bốn bước deploy đã hỏng — dựng, chuyển, tráo, chứng minh — và một cuốn sổ sự cố thật, nơi cách sửa ĐÚNG vẫn trả 502 vì systemd đang từ chối lệnh khởi động lại.</p>
<p>Slide 3–8 thuộc Bài 11.1 (cây bốn bước, lùi hay đi tới, "đang chạy bản nào", đi từ ngoài vào, chu kỳ đo–giả thuyết–kiểm, cuốn sổ), 9–12 thuộc 11.2 (bốn cú hỏng và thời gian của chúng, bảng chữ ký, errno của nginx, curl chia pha), 13–16 thuộc 11.3 (deploy xong mà không đổi, 401 so với 404, lệch lược đồ, "chẳng có gì đổi"), 17–21 thuộc 11.4 (thứ tự kiểm, <code>vmstat</code>, tệp đã xoá còn mở, cạn inode, mã thoát 137/134/139/1) và 22–27 thuộc 11.5 (<code>nghiem-thu.sh</code>, lần chạy đầu 8/12, bắt nó hỏng có chủ đích, nghiệm thu cái máy bằng <code>kiem-vps.sh</code>, một bộ kiểm hỏng giả 57 trên 200 lần, và bốn chương mới). Bốn slide cuối là những sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Terminal mới đều là output THẬT ghi ngày 29/09/2026 trên "VPS thí nghiệm" — một container Ubuntu 24.04 chạy systemd, sshd, nginx và PostgreSQL mà máy Mac SSH vào như một máy chủ thuê — cộng các lần chạy <code>docker</code> trên Mac.</p>
</div>
${gallery('dv-11', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Hỏng ở bước nào trong bốn bước'], [4, 'Lùi trước, chẩn đoán sau — trừ một ca'], [5, 'Có phải mình vừa gây ra'], [6, 'Đi từ ngoài vào: tầng sâu nhất còn hỏng'], [7, 'Chu kỳ đo → giả thuyết → kiểm'], [8, 'Sổ sự cố thật: sửa đúng, vẫn 502'],
  [9, 'Bốn cú hỏng, bốn thời gian'], [10, 'Mã × thời gian → tầng nào hỏng'], [11, 'nginx ghi rõ lời gọi hệ thống nào hỏng'], [12, 'curl -w chia một request thành từng pha'],
  [13, 'Deploy báo xong mà chẳng có gì đổi'], [14, 'Kiểm khói: 401 là có, 404 là ảnh cũ'], [15, '/health 200, API 500: lược đồ đã đi tiếp'], [16, '"Chẳng có gì thay đổi" gần như luôn sai'],
  [17, 'Thứ tự kiểm: đĩa → RAM → bão hoà → CSDL'], [18, 'vmstat: dòng đầu là quá khứ'], [19, 'Tệp đã xoá còn mở'], [20, 'Cạn inode'], [21, 'Mã thoát 137, 134, 139, 1'],
  [22, 'nghiem-thu.sh: kiểm từ cửa trước'], [23, 'Lần chạy đầu: 8/12'], [24, 'Bắt bộ kiểm hỏng'], [25, 'Nghiệm thu cái máy trước khi giao'], [26, 'grep -q + pipefail: hỏng giả 57/200'], [27, 'Đi tiếp: Chương 12–15'],
  [28, 'Sai lầm hay gặp'], [29, 'Bảng tra nhanh (1/2)'], [30, 'Bảng tra nhanh (2/2)'], [31, 'Thực hành chương 11'],
])}
`,
    },

    /* ─────────────────────────── 11.1 ─────────────────────────── */
    {
      title: '11.1 — The first five minutes|||11.1 — Năm phút đầu tiên',
      slug: 'deploy-11-1-nam-phut-dau',
      type: 'VIDEO',
      description: 'Ba câu hỏi, theo đúng thứ tự, và mỗi câu là một lệnh. Chúng thu hẹp mọi cú hỏng trong khoá này xuống còn một tầng — và câu đầu tiên không phải "lỗi gì" mà là "có phải mình vừa gây ra không".',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>The first five minutes</h2>
<p class="lead">Under pressure, the failure mode is not ignorance — it is doing the third thing first. This lesson is an order, and the order is more valuable than any individual command in it.</p>

<h3>Before anything: stop the clock</h3>
${slide('dv-11', 4, 'Lùi trước, chẩn đoán sau — trừ khi bản cũ không đọc được lược đồ mới')}
<p>Chapter 6 measured a rollback at 140 milliseconds, and 6.3 measured a bad version writing 240 poisoned rows in 18.6 seconds. Those two numbers together settle the sequencing argument: <strong>if a deploy went out in the last hour, roll back first and diagnose afterwards.</strong> You lose nothing — the artifact is still there — and every second you spend understanding the problem is a second the broken version keeps writing.</p>

<div class="callout warn">
<p><strong>The exception, and it is the only one.</strong> Do not roll back if the previous release cannot run against the current schema (6.2). That is the one case where rolling back makes things worse, and it is knowable in advance — it is exactly the "rollback distance" you established when you wrote the migration. If you do not know the answer, you have just learned why that question is worth answering before an incident.</p>
</div>

<h3>Question 1 — did I cause this?</h3>
${slide('dv-11', 5, 'Có phải mình vừa gây ra? Symlink mới, tiến trình cũ — đo trên VPS thí nghiệm')}
<pre><code>git log --oneline -5                          <span class="tok-comment"># co gi vua ra?</span>
ls -lt /srv/vps/nt/nhat-ky/ | head -3         <span class="tok-comment"># lan deploy cuoi luc nao?</span>
readlink -f /srv/vps/nt/hien-tai              <span class="tok-comment"># dang chay ban NAO?</span></code></pre>

<p>A failure that starts within minutes of a deploy is caused by that deploy until proven otherwise. This is not a heuristic, it is base rates: most things that change on a server are changed by you.</p>

<h3>Measured again: new symlink, old process</h3>
<p>Question 1 hides a trap of its own: "which version is running" has <em>three</em> answers, and they can disagree. On this chapter&#39;s lab VPS (nginx → a Python app run by a systemd unit with <code>WorkingDirectory=/srv/app/hien-tai</code> → PostgreSQL), I pointed the symlink at <code>v2</code> without restarting the app, then asked all three places:</p>
<pre><code class="language-bash">echo "cua truoc : \$(curl -s https://vidu.local/ban --cacert /etc/nginx/vidu.crt)"
echo "symlink   : \$(basename "\$(readlink -f /srv/app/hien-tai)")"
PID=\$(systemctl show -p MainPID --value ung-dung)
echo "tien trinh: \$(basename "\$(readlink /proc/\$PID/cwd)")  (pid \$PID)"
echo "khoi dong : \$(systemctl show -p ActiveEnterTimestamp --value ung-dung)"
echo "doi link  : \$(stat -c %y /srv/app/hien-tai | cut -d. -f1)"</code></pre>
<div class="out">cua truoc : v1
symlink   : v2
tien trinh: v1  (pid 880)
khoi dong : Tue 2026-09-29 14:23:17 +07
doi link  : 2026-09-29 14:23:20</div>
<p>Line by line: the symlink says <code>v2</code>, users get <code>v1</code>, and <code>/proc/880/cwd</code> — the working directory of the process actually running — still points into <code>ban/v1</code>. The two timestamps settle it: the process started at 14:23:17 and the symlink changed at 14:23:20. A process that has entered its directory keeps <em>that</em> directory; it does not follow the symlink. After <code>sudo systemctl restart ung-dung</code> all three lines say <code>v2</code>. This is exactly the bug Lesson 7.5 found in my own script — and now it is a five-line check that answers in five seconds.</p>
<div class="callout ok"><p><strong>Why <code>/proc/PID/cwd</code> beats everything else.</strong> The deploy log says what the script <em>intended</em>; the symlink says what the next start <em>will</em> run; only <code>/proc/PID/cwd</code> (and <code>/proc/PID/exe</code> for a compiled binary) says where <em>this</em> process is running from. For a container the equivalent is <code>docker inspect -f '{{.Image}}' name</code> compared against the digest you just pushed (Chapter 2).</p></div>

<h3>Which of the four steps broke?</h3>
${slide('dv-11', 3, 'Cây quyết định: dựng → chuyển → tráo → chứng minh, mỗi bước bốn câu hỏi và một lệnh')}
<p>When the answer to Question 1 is "yes, we just deployed", the next question is not "what error" but "which <em>step</em>". Section 0 split a deploy into four steps — build an artifact, move it to the machine, swap it in, prove it works — and every chapter since measured one way a step fails quietly. The tree on the slide walks them left to right in that order; the first step that answers "no" is the broken one, and everything after it is a symptom.</p>
<table>
<tr><th>Step</th><th>Checkable questions</th><th>First command</th><th>Measured in</th></tr>
<tr><td>1 · Build</td><td>did the build really exit 0 (not swallowed by <code>|| echo</code>)? the right commit? the right platform (linux/amd64, glibc or musl)? killed by OOM while building?</td><td><code>cat BAN</code>, <code>ldd</code>, <code>dmesg | grep -i oom</code></td><td>Ch1, Ch8</td></tr>
<tr><td>2 · Move</td><td>did all the bytes arrive intact? into the right directory (rsync&#39;s trailing <code>/</code>)? cut off halfway? space left on the target disk?</td><td><code>sha256sum</code> on both ends, <code>ls -l ban/</code></td><td>Ch2</td></tr>
<tr><td>3 · Swap</td><td>where does the symlink point? which release is the process running? did it start at all (config, environment)? does the schema match the code?</td><td><code>readlink</code>, <code>journalctl -u</code>, <code>migrate status</code></td><td>Ch3, Ch4, Ch5</td></tr>
<tr><td>4 · Prove</td><td>which version does the front door serve? is the new route there (401/200) or 404? is a cache in front? has the check itself ever been seen failing?</td><td><code>curl -s …/ban</code>, smoke test</td><td>Ch6, Ch7, Ch9</td></tr>
</table>
<p>Two pieces of advice for walking it. First, do not jump to step 3 because "it is probably the restart" — a build missing a file (step 1) looks exactly like a broken swap (step 3): the app exits 1 the moment it starts. Only step 1&#39;s questions tell the two apart. Second, the last question of step 4 — "has the check ever been seen failing" — is not a joke. Lesson 11.5 measures a check that passed because it was pointed at a 404 page.</p>

<h3>Question 2 — is it down, or is it slow, or is it wrong?</h3>
<p>These are three different problems with three different investigations, and they are distinguished by one command from the front door:</p>

<pre><code>curl -s -o /dev/null -w 'ma=%{http_code} tong=%{time_total}s\\n' \\
  --max-time 10 https://vidu.com/</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">no answer at all</span><span class="lz-t">DOWN</span><span class="lz-d">DNS, firewall, or the machine. 11.2</span></div>
<div class="lz-step"><span class="lz-k">5xx, fast</span><span class="lz-t">BROKEN</span><span class="lz-d">the application or its dependencies. 11.2</span></div>
<div class="lz-step"><span class="lz-k">200, slow</span><span class="lz-t">SLOW</span><span class="lz-d">a resource is saturated. 11.4</span></div>
<div class="lz-step"><span class="lz-k">200, fast, wrong content</span><span class="lz-t">WRONG</span><span class="lz-d">a stale cache or the wrong version. 11.3</span></div>
</div>

<p>That fourth row is the one people forget, and Chapter 6 measured it: a rollback that worked perfectly while every user was served the rolled-back version for five minutes, because a cache sat in front. Status 200, sub-second, entirely wrong.</p>

<h3>Question 3 — how far in does it break?</h3>
${slide('dv-11', 6, 'Đi từ ngoài vào: tầng SÂU NHẤT còn hỏng mới là tầng của bạn — đo khi app chết')}
<p>Chapter 9 established that a check only proves the exact path it exercises. Walking inwards separates the layers in four commands:</p>

<pre><code>curl -sI https://vidu.com/            <span class="tok-comment"># DNS + TLS + tuong lua + proxy + app</span>
curl -sI http://127.0.0.1:3390/       <span class="tok-comment"># proxy + app   (bo DNS, TLS, tuong lua)</span>
curl -sI http://127.0.0.1:3391/       <span class="tok-comment"># chi app       (bo proxy)</span>
psql -d nt -c 'select 1'              <span class="tok-comment"># chi CSDL      (bo app)</span></code></pre>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">outermost</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">the real hostname</div><div class="lz-nsub">fails and the rest works → DNS, TLS, firewall, or the machine is unreachable</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">proxy</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">127.0.0.1 : proxy port</div><div class="lz-nsub">fails and the app answers → nginx config, upstream, or cache (9.5 measured exactly this)</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">app</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">127.0.0.1 : app port</div><div class="lz-nsub">fails and the database answers → the application, its config, or its release</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">data</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">psql / redis-cli</div><div class="lz-nsub">fails → the dependency, or a migration (Chapter 5)</div></div></div>
</div>
</div>

<p>The innermost of those four that still fails is your layer. Everything below it is fine and can be left alone; everything above it is a symptom.</p>

<p>Measured on the lab VPS with the app stopped (<code>sudo systemctl stop ung-dung</code>):</p>
<div class="out">https://vidu.local/      502
http://127.0.0.1/        502
http://127.0.0.1:8080/   000
psql select 1            1</div>
<p>The two 502s are nginx answering on behalf of an application that is not there — symptoms. <code>000</code> is curl failing to connect to anything on port 8080: that is the application layer. The database answers <code>1</code>: leave it alone. Beginners stop at the first line ("the site returns 502, nginx must be broken") and go and fix nginx — the one layer of the four that is doing its job correctly.</p>

<div class="pitfall">
<p><strong>Trap — the layer that fails is not always the layer at fault.</strong> Chapter 6 measured a rollback that left <code>/health</code> returning 200 while every real endpoint returned 500, because the application was fine and the <em>schema</em> had moved. Chapter 8 measured a database killed by a build script that exited 0. Chapter 9 measured a proxy returning 200 on one location and 502 on another. In all three the failing layer and the responsible change were different things — which is why Question 1 comes first.</p>
</div>

<h3>What to have open before you need it</h3>
<div class="kv-grid">
<div class="kv"><span class="k">the deploy log</span><span class="v">timestamped per step (7.4), so "did the deploy finish?" is not a guess</span></div>
<div class="kv"><span class="k">the release symlink</span><span class="v"><code>readlink -f</code> — the single most useful fact in an incident, and one command</span></div>
<div class="kv"><span class="k">the kernel log</span><span class="v"><code>dmesg | grep -i oom</code> — nothing in your application log will ever mention exit 137 (8.1)</span></div>
<div class="kv"><span class="k">disk and inodes</span><span class="v"><code>df -h; df -i</code> — two lines that explain a startling number of unrelated-looking errors (8.4)</span></div>
</div>

<h3>The discipline that makes the next incident shorter</h3>
<p>Write down what you did, while you are doing it. Not afterwards — afterwards you will remember a clean narrative rather than the four things you tried that did nothing. The value is not the record; it is that the act of writing "I restarted nginx" makes you notice you have not checked whether nginx was the problem.</p>

<div class="callout ok">
<p><strong>And change one thing at a time.</strong> Restarting the app, clearing the cache and rolling back simultaneously will probably fix it, and you will not know which one did — so the next occurrence starts from zero. If you must do several at once because the site is down and speed matters, say so out loud and accept that you are trading the diagnosis for the minutes. That is often the right trade. It is only a mistake when it is unintentional.</p>
</div>


<h3>The loop: measure, hypothesise, test — and write it down</h3>
${slide('dv-11', 7, 'Chu kỳ đo → giả thuyết → kiểm, và ghi.sh — sổ sự cố có giờ')}
<p>"Change one thing at a time" is half of it. The other half is <em>order</em>: measure before changing anything (read only, fix nothing), state one hypothesis as one sentence, pick a command that could <em>disprove</em> it, and only then change exactly one thing and measure again with the very same command you started with. If the check does not match, go back to measuring with the new facts — do not stack a second change on top of the first. The Linux &amp; Bash course, Chapter 12, teaches the same loop for diagnosing the machine itself (six steps, with a timeline); here is the short version for deploys.</p>
<p>Writing things down during an incident sounds slow; it is cheap if the shell does it for you. These three lines, loaded with <code>source ghi.sh</code>, turn every command you run through <code>ghi</code> into a timestamped line in today&#39;s incident notebook, output included:</p>
<pre><code class="language-bash"># ghi.sh — nap bang: source ghi.sh ; moi lenh chay qua "ghi" deu vao so su co
SO=~/su-co-\$(date +%Y%m%d).md
ghi() { echo "\$(date +%T)  \\\$ \$*" &gt;&gt; "\$SO"; "\$@" 2&gt;&amp;1 | tee -a "\$SO"; }
gt()  { echo "\$(date +%T)  GIA THUYET: \$*" | tee -a "\$SO"; }</code></pre>
<table>
<tr><th>Piece</th><th>What it does</th></tr>
<tr><td><code>ghi command…</code></td><td>runs the command, appends time + command + output (stderr too, via <code>2&gt;&amp;1</code>) to the notebook, and still shows it on screen (<code>tee -a</code>)</td></tr>
<tr><td><code>gt "sentence"</code></td><td>records a hypothesis with its time — the line you will be glad of afterwards</td></tr>
<tr><td><code>\$SO</code></td><td>one file per day in your home directory; paste it into the group chat or the post-mortem as it is</td></tr>
</table>

<h3>A real notebook: the right fix, still 502</h3>
${slide('dv-11', 8, 'Sổ sự cố thật: lùi đúng mà vẫn 502 — StartLimitBurst từ chối cả restart tay')}
<p>To test the loop I deployed a <code>v3</code> deliberately missing the <code>BAN</code> file (the app reads it at start-up), then handled it using only <code>ghi</code> and <code>gt</code>. Here is the notebook, with a few repeated lines cut:</p>
<div class="out">14:28:39  $ curl -s -o /dev/null -w %{http_code}\\n --cacert /etc/nginx/vidu.crt https://vidu.local/
502
14:28:39  $ systemctl is-active ung-dung
failed
14:28:39  $ journalctl -u ung-dung -n 1 -o cat
FileNotFoundError: [Errno 2] No such file or directory: 'BAN'
14:28:40  GIA THUYET: ban v3 thieu tep BAN nen app thoat 1
14:28:40  $ ls /srv/app/ban/v3
app.py
14:28:40  $ ln -sfn /srv/app/ban/v2 /srv/app/hien-tai
14:28:40  $ sudo systemctl restart ung-dung
Job for ung-dung.service failed because the control process exited with error code.
See "systemctl status ung-dung.service" and "journalctl -xeu ung-dung.service" for details.
14:28:40  $ curl -s -o /dev/null -w %{http_code}\\n --cacert /etc/nginx/vidu.crt https://vidu.local/
502
…
14:29:10  GIA THUYET: restart bi tu choi vi cham gioi han khoi dong (StartLimitBurst)
14:29:10  $ sudo systemctl reset-failed ung-dung
14:29:10  $ sudo systemctl restart ung-dung
14:29:11  $ curl -s -o /dev/null -w %{http_code}\\n --cacert /etc/nginx/vidu.crt https://vidu.local/
200</div>
<p>The first hypothesis was <em>right</em> (<code>ls</code> confirmed the missing file), the fix was <em>right</em> (roll back to <code>v2</code>) — and it was still 502. Because I measured again with the same command, the new fact showed up immediately in <code>Job for ung-dung.service failed</code>. systemd&#39;s own journal (timestamp and host prefix removed) says why:</p>
<div class="out">ung-dung.service: Scheduled restart job, restart counter is at 5.
ung-dung.service: Start request repeated too quickly.
ung-dung.service: Failed with result 'exit-code'.
Failed to start ung-dung.service - ung dung dat lich.</div>
<p><code>Restart=on-failure</code> had restarted the broken release five times in about 1.5 seconds (the default <code>RestartSec</code> is 100 ms), hitting <code>StartLimitBurst=5</code> within <code>StartLimitIntervalSec=10s</code>. From that moment systemd refuses <em>every</em> start request — your manual restart included — until the 10-second window passes or you run <code>systemctl reset-failed</code>. Without the notebook, the story told afterwards would have been "rolling back to v2 did not work, it took a few restarts" — and the wrong lesson ("rollback is unreliable") would have been carried into the next incident.</p>
<div class="pitfall co-tieu-de"><p><strong>A manual restart after a restart loop is a refused command, not a failed one.</strong> When you see <code>Start request repeated too quickly</code>, your new release may be perfectly fine; systemd is protecting the machine from the old loop. Run <code>systemctl reset-failed &lt;unit&gt;</code> and start again. Lessons 3.4 and 8.2 measured the <code>StartLimit*</code> settings — set them deliberately in the unit rather than letting the defaults decide.</p></div>

<h3>Run it step by step: build this chapter&#39;s lab VPS</h3>
<p>Every new measurement in this chapter was taken on an Ubuntu 24.04 container running real systemd, which the Mac reaches over SSH like a rented VPS. Rebuilding it takes about five minutes. The image:</p>
<pre><code class="language-dockerfile">FROM ubuntu:24.04
ENV DEBIAN_FRONTEND=noninteractive TZ=Asia/Ho_Chi_Minh
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends \\
      systemd systemd-sysv dbus openssh-server ca-certificates curl nginx python3 openssl \\
      iproute2 procps psmisc lsof jq sudo postgresql-16 postgresql-client-16 tzdata \\
      unattended-upgrades ufw iptables less \\
 &amp;&amp; rm -rf /var/lib/apt/lists/*
RUN useradd -m -s /bin/bash deploy &amp;&amp; mkdir -p /home/deploy/.ssh \\
 &amp;&amp; echo 'deploy ALL=(ALL) NOPASSWD:ALL' &gt; /etc/sudoers.d/deploy
COPY khoa.pub /home/deploy/.ssh/authorized_keys
RUN chown -R deploy:deploy /home/deploy/.ssh &amp;&amp; chmod 700 /home/deploy/.ssh \\
 &amp;&amp; chmod 600 /home/deploy/.ssh/authorized_keys \\
 &amp;&amp; mkdir -p /srv/app &amp;&amp; chown deploy:deploy /srv/app \\
 &amp;&amp; systemctl enable ssh nginx postgresql
STOPSIGNAL SIGRTMIN+3
CMD ["/sbin/init"]</code></pre><pre><code class="language-bash"># tren Mac (hoac Linux/WSL) — moi thu nam trong ~/dv-lab/dv11
mkdir -p ~/dv-lab/dv11/img &amp;&amp; cd ~/dv-lab/dv11
ssh-keygen -t ed25519 -N '' -f khoa -C dv11-lab -q &amp;&amp; cp khoa.pub img/
# (chep Dockerfile o tren vao img/Dockerfile)
docker build -t dv11-img img
docker network create dv11-net
docker run -d --name dv11-vps --hostname vps-thi-nghiem --label dvhoc=11 \\
  --network dv11-net --privileged --cgroupns=host --memory 768m \\
  -p 127.0.0.1:19112:22 dv11-img
ssh -i khoa -o UserKnownHostsFile=known_hosts -p 19112 deploy@127.0.0.1</code></pre>
<table>
<tr><th>Flag</th><th>Why</th></tr>
<tr><td><code>--privileged --cgroupns=host</code></td><td>lets systemd run as PID 1 and manage real units (<code>systemctl</code>, <code>journalctl</code>, <code>StartLimitBurst</code>). Only for a lab container, and removed as soon as you finish — it grants nearly all of the Docker host&#39;s privileges</td></tr>
<tr><td><code>--memory 768m</code></td><td>a small RAM ceiling, like a cheap VPS</td></tr>
<tr><td><code>-p 127.0.0.1:19112:22</code></td><td>only your own machine can SSH in; nothing is opened to the LAN</td></tr>
<tr><td><code>STOPSIGNAL SIGRTMIN+3</code></td><td>the signal systemd understands as "shut down cleanly" on <code>docker stop</code></td></tr>
<tr><td><code>--label dvhoc=11</code></td><td>so you remove exactly your own things: <code>docker rm -f \$(docker ps -aq --filter label=dvhoc=11)</code></td></tr>
</table>
<p>Inside the VPS: a self-signed certificate for the fake name <code>vidu.local</code> (pointed at 127.0.0.1 in <code>/etc/hosts</code>), a database, two releases, a unit and an nginx site. The application is 30 lines of Python with one route per failure this chapter needs:</p>
<pre><code class="language-bash">sudo openssl req -x509 -newkey rsa:2048 -nodes -days 30 -subj /CN=vidu.local \\
  -addext subjectAltName=DNS:vidu.local \\
  -keyout /etc/nginx/vidu.key -out /etc/nginx/vidu.crt
echo "127.0.0.1 vidu.local" | sudo tee -a /etc/hosts
sudo -u postgres psql -c "create role deploy superuser login"     # CHI trong phong thi nghiem
sudo -u postgres createdb -O deploy nt
psql -d nt -c "create table bai(id int primary key, ten text);
               insert into bai values (1,'Kham tong quat'),(2,'Nha khoa');"
for b in v1 v2; do mkdir -p /srv/app/ban/\$b; cp app.py /srv/app/ban/\$b/; echo \$b &gt; /srv/app/ban/\$b/BAN; done
ln -sfn /srv/app/ban/v1 /srv/app/hien-tai</code></pre>
<pre><code class="language-ini"># /etc/systemd/system/ung-dung.service
[Unit]
Description=ung dung dat lich
After=network.target postgresql.service
[Service]
User=deploy
WorkingDirectory=/srv/app/hien-tai
Environment=PGDATABASE=nt
ExecStart=/usr/bin/python3 app.py
Restart=on-failure
[Install]
WantedBy=multi-user.target</code></pre>
<pre><code class="language-nginx"># /etc/nginx/sites-available/nt  (ln -sf vao sites-enabled/default)
log_format nt '\$remote_addr [\$time_local] "\$request" \$status rt=\$request_time urt=\$upstream_response_time';
server {
    listen 80 default_server;
    listen 443 ssl default_server;
    ssl_certificate     /etc/nginx/vidu.crt;
    ssl_certificate_key /etc/nginx/vidu.key;
    access_log /var/log/nginx/nt.log nt;
    proxy_read_timeout 2s;
    location /health { access_log off; proxy_pass http://127.0.0.1:8080; }
    location /chet   { proxy_pass http://127.0.0.1:8099; }
    location /       { proxy_pass http://127.0.0.1:8080; }
}</code></pre><pre><code class="language-python">import json, os, subprocess, sys, time
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
BAN = open('BAN').read().strip()          # doc MOT lan, luc khoi dong, tu thu muc lam viec
LO = os.environ.get('LO_LOI') == '1'      # ban co bug: lo phien ban + thong diep loi
class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def gui(self, ma, body, ct='text/plain; charset=utf-8', extra=None):
        b = body.encode(); self.send_response(ma)
        self.send_header('Content-Type', ct)
        for k, v in (extra or {}).items(): self.send_header(k, v)
        self.send_header('Content-Length', str(len(b))); self.end_headers(); self.wfile.write(b)
    def do_GET(self):
        p = self.path.split('?')[0]
        try:
            if p == '/health': return self.gui(200, 'ok\\n')
            if p == '/': return self.gui(200, f'&lt;html&gt;&lt;body&gt;&lt;main id="trang-chu"&gt;&lt;h1&gt;Dat lich&lt;/h1&gt;&lt;p&gt;ban {BAN}&lt;/p&gt;&lt;/main&gt;&lt;/body&gt;&lt;/html&gt;\\n', 'text/html; charset=utf-8')
            if p == '/ban': return self.gui(200, BAN + '\\n')
            if p == '/cham': time.sleep(3); return self.gui(200, 'cham\\n')
            if p == '/api/v1/rieng': return self.gui(401, '{"loi":"chua dang nhap"}\\n', 'application/json')
            if p == '/api/v1/bai':
                r = subprocess.run(['psql', '-d', 'nt', '-XAtc', 'select id, ten from bai order by id'], capture_output=True, text=True)
                if r.returncode: raise RuntimeError(r.stderr.strip())
                rows = [dict(zip(('id', 'ten'), l.split('|'))) for l in r.stdout.splitlines()]
                return self.gui(200, json.dumps(rows, ensure_ascii=False) + '\\n', 'application/json')
            if p == '/loi': raise RuntimeError('co tinh nem de kiem')
            return self.gui(404, 'khong co\\n')
        except Exception as e:
            print(f'[{BAN}] LOI {p}: {e}', file=sys.stderr, flush=True)
            if LO: return self.gui(500, f'{e}\\n', extra={'x-ban': BAN})
            return self.gui(500, 'loi may chu\\n')
ThreadingHTTPServer(('127.0.0.1', 8080), H).serve_forever()</code></pre>
<p>Then <code>sudo systemctl daemon-reload &amp;&amp; sudo systemctl enable --now ung-dung</code> and <code>sudo nginx -t &amp;&amp; sudo systemctl reload nginx</code>. <code>curl --cacert /etc/nginx/vidu.crt https://vidu.local/</code> should return the page containing "ban v1".</p>

<h3>On Windows/WSL and macOS</h3>
<ul>
<li>Every diagnostic command in this lesson runs <em>on the VPS</em> over SSH, so it is the same whatever your laptop is. The differences are only on the developer machine.</li>
<li><strong>Windows PowerShell 5.1:</strong> <code>curl</code> is an alias for <code>Invoke-WebRequest</code> and does not understand curl&#39;s <code>-w</code>/<code>-o</code>. Type <code>curl.exe</code> (shipped since Windows 10 1803) or work inside WSL.</li>
<li><strong>WSL:</strong> Docker Desktop shares its engine, so the lab commands above run as written. Keep the SSH key in the Linux filesystem (<code>~/dv-lab</code>), not under <code>/mnt/c/…</code> — there the permissions show as 777 and ssh refuses the key as an "UNPROTECTED PRIVATE KEY FILE".</li>
<li><strong>macOS:</strong> <code>stat -c</code> is GNU syntax; on a Mac write <code>stat -f %Sm</code>. Scripts that run on the VPS are unaffected.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the night before your SWP391 defence, a teammate deploys and posts "the site is dead". You have five minutes before the examiner walks in.</p>
<ol>
<li>Build the lab VPS as above, run release <code>v1</code>, then <code>sudo systemctl stop ung-dung</code> to fake the incident.</li>
<li>Run the four walking-inwards commands (<code>https://vidu.local/</code>, <code>127.0.0.1</code>, <code>127.0.0.1:8080</code>, <code>psql -c 'select 1'</code>) and name the innermost layer that still fails.</li>
<li>Start the app again, point the symlink at <code>v2</code> <em>without</em> restarting, run the five "which version" lines and read the two timestamps.</li>
<li><code>source ghi.sh</code>, create <code>ban/v3</code> without a <code>BAN</code> file, point at it, restart, then handle it using only <code>ghi</code>/<code>gt</code> until the home page returns 200.</li>
</ol>
<p><strong>Done when:</strong> you say "the application layer" in step 2; you show with <code>/proc/PID/cwd</code> that the process still runs <code>v1</code> in step 3; and <code>~/su-co-*.md</code> contains at least two <code>GIA THUYET</code> lines and ends with <code>200</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Rollback (lùi bản)</span><span class="v">Putting the previous release back; repointing a symlink took 140 ms in Chapter 6.</span></div>
<div class="kv"><span class="k">Roll forward (đi tới)</span><span class="v">Fixing with a <em>new</em> release instead — required when the old one cannot read the current schema.</span></div>
<div class="kv"><span class="k">Triage (phân loại sự cố)</span><span class="v">Deciding quickly between down, slow and wrong before digging in.</span></div>
<div class="kv"><span class="k">Hypothesis (giả thuyết)</span><span class="v">One sentence about the cause that a specific command could disprove.</span></div>
<div class="kv"><span class="k">Working directory (thư mục làm việc)</span><span class="v">Where a process stands; <code>/proc/PID/cwd</code> shows it, and it does not follow a symlink.</span></div>
<div class="kv"><span class="k">Start limit (giới hạn khởi động)</span><span class="v"><code>StartLimitBurst</code>/<code>IntervalSec</code>: past it, systemd refuses even manual restarts until <code>reset-failed</code>.</span></div>
<div class="kv"><span class="k">Incident log (sổ sự cố)</span><span class="v">A timeline of commands and results written <em>during</em> the incident, not recalled afterwards.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A deploy in the last hour means roll back first and diagnose afterwards — unless the old release cannot read the current schema.</li>
<li>"Which version is running" has three answers — front door, symlink, <code>/proc/PID/cwd</code> — so ask all three.</li>
<li>Walk the four-step tree left to right: build, move, swap, prove; the first step that says "no" is the broken one.</li>
<li>Walk inwards; the innermost layer that still fails is yours, and every layer outside it is a symptom.</li>
<li>Measure, one hypothesis, test, change one thing, measure again with the same command — and record it all with <code>ghi</code>.</li>
<li>"Start request repeated too quickly" is systemd refusing, not your app failing: <code>reset-failed</code>, then start.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Effective Troubleshooting</span><span class="lc-sub">sre.google/sre-book/effective-troubleshooting/ — the triage-examine-diagnose loop, and its argument that stopping the bleeding precedes understanding the cause.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Managing Incidents</span><span class="lc-sub">sre.google/sre-book/managing-incidents/ — separating the person fixing from the person communicating, which matters the moment more than one person is involved.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">curl(1) — --write-out variables</span><span class="lc-sub">curl.se/docs/manpage.html — <code>time_namelookup</code>, <code>time_connect</code>, <code>time_appconnect</code>, <code>time_starttransfer</code>: the breakdown that splits DNS from TLS from the server in a single request.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — the diagnosis recipe book</span><span class="lc-sub">/courses/nginx/learn${REF} — the same layered approach from the proxy&#39;s side, with the error-log lines that go with each case.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.unit(5) — StartLimitIntervalSec=, StartLimitBurst=</span><span class="lc-sub">freedesktop.org/software/systemd/man/latest/systemd.unit.html — the rate limit behind "Start request repeated too quickly", and why <code>reset-failed</code> clears it.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">proc_pid_cwd(5)</span><span class="lc-sub">man7.org/linux/man-pages/man5/proc_pid_cwd.5.html — the symbolic link to a process&#39;s current working directory, the one fact that says which release is really running.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — Chapter 12: diagnosing a real server</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the 60-second sweep, the dead/slow/strange tree and the six-step loop: the machine side this chapter does not teach again.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Năm phút đầu tiên</h2>
<p class="lead">Dưới áp lực, kiểu hỏng không phải là THIẾU HIỂU BIẾT — mà là làm việc thứ ba trước tiên. Bài này là một THỨ TỰ, và cái thứ tự ấy giá trị hơn bất kỳ câu lệnh riêng lẻ nào trong nó.</p>

<h3>Trước hết: DỪNG ĐỒNG HỒ</h3>
${slide('dv-11', 4, 'Lùi trước, chẩn đoán sau — trừ khi bản cũ không đọc được lược đồ mới')}
<p>Chương 6 đo một cú lùi ở 140 mili giây, và 6.3 đo một bản hỏng ghi ra 240 dòng nhiễm độc trong 18,6 giây. Hai con số đó gộp lại giải quyết xong tranh cãi về thứ tự: <strong>nếu có một lần deploy vừa ra trong một giờ qua, hãy LÙI TRƯỚC rồi chẩn đoán sau.</strong> Bạn chẳng mất gì — cái tạo tác vẫn còn đó — và mỗi giây bạn bỏ ra để hiểu vấn đề là một giây bản hỏng vẫn đang ghi.</p>

<div class="callout warn">
<p><strong>Ngoại lệ, và đó là ngoại lệ DUY NHẤT.</strong> ĐỪNG lùi nếu bản trước không chạy được với lược đồ hiện tại (6.2). Đó là ca duy nhất mà lùi lại làm mọi thứ TỆ HƠN, và nó BIẾT TRƯỚC ĐƯỢC — nó chính là cái "tầm lùi" bạn đã thiết lập lúc viết cái migration. Nếu bạn không biết câu trả lời, thì bạn vừa học được vì sao câu hỏi ấy đáng trả lời TRƯỚC một sự cố.</p>
</div>

<h3>Câu hỏi 1 — có phải MÌNH gây ra không?</h3>
${slide('dv-11', 5, 'Có phải mình vừa gây ra? Symlink mới, tiến trình cũ — đo trên VPS thí nghiệm')}
<pre><code>git log --oneline -5                          <span class="tok-comment"># co gi vua ra?</span>
ls -lt /srv/vps/nt/nhat-ky/ | head -3         <span class="tok-comment"># lan deploy cuoi luc nao?</span>
readlink -f /srv/vps/nt/hien-tai              <span class="tok-comment"># dang chay ban NAO?</span></code></pre>

<p>Một cú hỏng bắt đầu trong vòng vài phút sau một lần deploy là DO lần deploy đó gây ra, cho tới khi chứng minh được điều ngược lại. Đây không phải một mẹo suy đoán, đây là TỶ LỆ NỀN: phần lớn những thứ thay đổi trên một máy chủ là do BẠN thay đổi.</p>

<h3>Đo lại: symlink MỚI, tiến trình CŨ</h3>
<p>Câu hỏi 1 có một cái bẫy riêng: "đang chạy bản nào" có tới <em>BA</em> câu trả lời, và chúng có thể khác nhau. Trên VPS thí nghiệm của chương này (nginx → một app Python chạy bằng unit systemd có <code>WorkingDirectory=/srv/app/hien-tai</code> → PostgreSQL), tôi trỏ symlink sang <code>v2</code> nhưng KHÔNG khởi động lại app, rồi hỏi cả ba chỗ:</p>
<pre><code class="language-bash">echo "cua truoc : \$(curl -s https://vidu.local/ban --cacert /etc/nginx/vidu.crt)"
echo "symlink   : \$(basename "\$(readlink -f /srv/app/hien-tai)")"
PID=\$(systemctl show -p MainPID --value ung-dung)
echo "tien trinh: \$(basename "\$(readlink /proc/\$PID/cwd)")  (pid \$PID)"
echo "khoi dong : \$(systemctl show -p ActiveEnterTimestamp --value ung-dung)"
echo "doi link  : \$(stat -c %y /srv/app/hien-tai | cut -d. -f1)"</code></pre>
<div class="out">cua truoc : v1
symlink   : v2
tien trinh: v1  (pid 880)
khoi dong : Tue 2026-09-29 14:23:17 +07
doi link  : 2026-09-29 14:23:20</div>
<p>Đọc từng dòng: symlink nói <code>v2</code>, người dùng nhận <code>v1</code>, và <code>/proc/880/cwd</code> — thư mục làm việc (working directory) của tiến trình ĐANG chạy — vẫn trỏ vào <code>ban/v1</code>. Hai mốc giờ cuối chốt lại: tiến trình khởi động lúc 14:23:17, symlink đổi lúc 14:23:20. Một tiến trình đã bước vào thư mục của nó thì giữ nguyên thư mục <em>ĐÓ</em>; nó không "đi theo" symlink. Sau <code>sudo systemctl restart ung-dung</code> cả ba dòng cùng nói <code>v2</code>. Đây đúng là con bọ bài 7.5 tìm ra trong script của chính tôi — và giờ nó là một phép kiểm năm dòng, trả lời trong năm giây.</p>
<div class="callout ok"><p><strong>Vì sao <code>/proc/PID/cwd</code> đáng tin hơn mọi thứ khác.</strong> Nhật ký deploy nói script ĐỊNH làm gì; symlink nói lần khởi động sau SẼ chạy gì; chỉ có <code>/proc/PID/cwd</code> (và <code>/proc/PID/exe</code> với chương trình biên dịch) nói tiến trình NÀY đang chạy từ đâu. Với container, câu tương đương là <code>docker inspect -f '{{.Image}}' ten-container</code> đem so với digest (mã băm nội dung) của ảnh bạn vừa đẩy (Chương 2).</p></div>

<h3>Bước nào trong BỐN bước đã hỏng?</h3>
${slide('dv-11', 3, 'Cây quyết định: dựng → chuyển → tráo → chứng minh, mỗi bước bốn câu hỏi và một lệnh')}
<p>Khi câu trả lời cho Câu hỏi 1 là "có, mình vừa deploy", câu tiếp theo không phải "lỗi gì" mà là "BƯỚC nào". Mục 0 chia một lần deploy thành bốn bước — dựng tạo tác (artifact), chuyển nó tới máy, tráo nó vào, chứng minh nó chạy — và mỗi chương sau đó đã đo một cách một bước hỏng âm thầm. Cây trên slide đi từ trái sang phải đúng thứ tự ấy; bước ĐẦU TIÊN trả lời "không" là bước hỏng, mọi thứ sau nó chỉ là triệu chứng.</p>
<table>
<tr><th>Bước</th><th>Câu hỏi kiểm được</th><th>Lệnh đầu tiên</th><th>Chương đã đo</th></tr>
<tr><td>1 · Dựng</td><td>bản dựng có thoát 0 THẬT không (không bị <code>|| echo</code> nuốt)? đúng commit? đúng nền tảng (linux/amd64, glibc hay musl)? có bị OOM giết giữa lúc dựng?</td><td><code>cat BAN</code>, <code>ldd</code>, <code>dmesg | grep -i oom</code></td><td>Ch1, Ch8</td></tr>
<tr><td>2 · Chuyển</td><td>bytes tới đủ và nguyên vẹn? đúng thư mục (dấu <code>/</code> cuối của rsync)? bị cắt giữa chừng? đĩa đích còn chỗ?</td><td><code>sha256sum</code> ở hai đầu, <code>ls -l ban/</code></td><td>Ch2</td></tr>
<tr><td>3 · Tráo</td><td>symlink trỏ đâu? tiến trình chạy bản nào? nó có khởi động được không (cấu hình, biến môi trường)? lược đồ có khớp với mã?</td><td><code>readlink</code>, <code>journalctl -u</code>, <code>migrate status</code></td><td>Ch3, Ch4, Ch5</td></tr>
<tr><td>4 · Chứng minh</td><td>cửa trước phục vụ bản nào? route mới đã có (401/200) hay 404? có bộ đệm đứng trước? chính phép kiểm đã từng được thấy ĐỎ chưa?</td><td><code>curl -s …/ban</code>, kiểm khói</td><td>Ch6, Ch7, Ch9</td></tr>
</table>
<p>Hai lời khuyên khi đi cây này. Một: đừng nhảy thẳng tới bước 3 chỉ vì "chắc là do restart" — một bản dựng thiếu tệp (bước 1) hiện ra y hệt một lần tráo hỏng (bước 3): app thoát 1 ngay khi khởi động. Chỉ những câu hỏi của bước 1 mới tách được hai ca. Hai: câu hỏi cuối của bước 4 — "phép kiểm đã từng đỏ chưa" — không phải câu đùa. Bài 11.5 đo một phép kiểm ĐẠT chỉ vì nó bị chĩa vào một trang 404.</p>

<h3>Câu hỏi 2 — nó SẬP, hay CHẬM, hay SAI?</h3>
<p>Đó là ba vấn đề khác nhau với ba cuộc điều tra khác nhau, và chúng phân biệt được bằng MỘT câu lệnh từ cửa trước:</p>

<pre><code>curl -s -o /dev/null -w 'ma=%{http_code} tong=%{time_total}s\\n' \\
  --max-time 10 https://vidu.com/</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">không trả lời gì cả</span><span class="lz-t">SẬP</span><span class="lz-d">DNS, tường lửa, hoặc cái máy. Bài 11.2</span></div>
<div class="lz-step"><span class="lz-k">5xx, nhanh</span><span class="lz-t">HỎNG</span><span class="lz-d">ứng dụng hoặc phụ thuộc của nó. Bài 11.2</span></div>
<div class="lz-step"><span class="lz-k">200, chậm</span><span class="lz-t">CHẬM</span><span class="lz-d">một tài nguyên đang bão hoà. Bài 11.4</span></div>
<div class="lz-step"><span class="lz-k">200, nhanh, nội dung SAI</span><span class="lz-t">SAI</span><span class="lz-d">một bộ đệm cũ hoặc sai phiên bản. Bài 11.3</span></div>
</div>

<p>Cái dòng thứ tư là cái người ta quên, và Chương 6 đã đo nó: một cú lùi chạy hoàn hảo trong khi MỌI người dùng được phục vụ đúng cái bản vừa lùi suốt năm phút, vì có một bộ đệm đứng phía trước. Mã 200, dưới một giây, và hoàn toàn SAI.</p>

<h3>Câu hỏi 3 — nó hỏng ở tầng nào?</h3>
${slide('dv-11', 6, 'Đi từ ngoài vào: tầng SÂU NHẤT còn hỏng mới là tầng của bạn — đo khi app chết')}
<p>Chương 9 xác lập rằng một phép kiểm chỉ chứng minh ĐÚNG cái đường nó đi qua. Đi từ ngoài vào tách được các tầng bằng bốn câu lệnh:</p>

<pre><code>curl -sI https://vidu.com/            <span class="tok-comment"># DNS + TLS + tuong lua + proxy + app</span>
curl -sI http://127.0.0.1:3390/       <span class="tok-comment"># proxy + app   (bo DNS, TLS, tuong lua)</span>
curl -sI http://127.0.0.1:3391/       <span class="tok-comment"># chi app       (bo proxy)</span>
psql -d nt -c 'select 1'              <span class="tok-comment"># chi CSDL      (bo app)</span></code></pre>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">ngoài cùng</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">tên miền thật</div><div class="lz-nsub">hỏng mà phần còn lại chạy → DNS, TLS, tường lửa, hoặc máy không với tới được</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">proxy</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">127.0.0.1 : cổng proxy</div><div class="lz-nsub">hỏng mà ứng dụng trả lời → cấu hình nginx, upstream, hoặc bộ đệm (9.5 đo đúng chuyện này)</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">ứng dụng</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">127.0.0.1 : cổng ứng dụng</div><div class="lz-nsub">hỏng mà cơ sở dữ liệu trả lời → ứng dụng, cấu hình của nó, hoặc bản phát hành của nó</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">dữ liệu</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">psql / redis-cli</div><div class="lz-nsub">hỏng → cái phụ thuộc, hoặc một migration (Chương 5)</div></div></div>
</div>
</div>

<p>Cái NẰM SÂU NHẤT trong bốn cái đó mà vẫn hỏng chính là tầng của bạn. Mọi thứ DƯỚI nó đều ổn và cứ để yên; mọi thứ TRÊN nó là triệu chứng.</p>

<p>Đo trên VPS thí nghiệm, với app đã bị dừng (<code>sudo systemctl stop ung-dung</code>):</p>
<div class="out">https://vidu.local/      502
http://127.0.0.1/        502
http://127.0.0.1:8080/   000
psql select 1            1</div>
<p>Hai cú 502 là nginx trả lời THAY cho một ứng dụng không có mặt — triệu chứng. <code>000</code> là curl không kết nối được với thứ gì ở cổng 8080: đó là tầng ứng dụng. CSDL trả <code>1</code>: để yên. Người mới hay dừng ở dòng đầu ("web trả 502, chắc nginx hỏng") rồi đi sửa nginx — đúng cái tầng duy nhất trong bốn tầng đang làm ĐÚNG việc của nó.</p>

<div class="pitfall">
<p><strong>Bẫy — tầng HỎNG không phải lúc nào cũng là tầng CÓ LỖI.</strong> Chương 6 đo một cú lùi để lại <code>/health</code> trả 200 trong khi mọi endpoint thật trả 500, vì ỨNG DỤNG thì ổn còn <em>LƯỢC ĐỒ</em> đã đi tiếp. Chương 8 đo một cơ sở dữ liệu bị giết bởi một script dựng THOÁT 0. Chương 9 đo một con proxy trả 200 ở một location và 502 ở location khác. Trong cả ba, tầng hỏng và thay đổi có trách nhiệm là hai thứ KHÁC NHAU — và đó là lý do Câu hỏi 1 đứng trước.</p>
</div>

<h3>Thứ cần mở sẵn TRƯỚC khi bạn cần tới</h3>
<div class="kv-grid">
<div class="kv"><span class="k">nhật ký deploy</span><span class="v">có dấu thời gian từng bước (7.4), để "lần deploy có xong không?" không phải một phỏng đoán</span></div>
<div class="kv"><span class="k">symlink bản phát hành</span><span class="v"><code>readlink -f</code> — sự thật hữu dụng nhất trong một sự cố, và nó là MỘT câu lệnh</span></div>
<div class="kv"><span class="k">nhật ký nhân hệ điều hành</span><span class="v"><code>dmesg | grep -i oom</code> — sẽ KHÔNG có gì trong log ứng dụng nhắc tới mã thoát 137 (8.1)</span></div>
<div class="kv"><span class="k">đĩa và inode</span><span class="v"><code>df -h; df -i</code> — hai dòng giải thích được một số lượng đáng kinh ngạc những lỗi trông chẳng liên quan (8.4)</span></div>
</div>

<h3>Kỷ luật làm cho sự cố LẦN SAU ngắn hơn</h3>
<p>Hãy GHI LẠI những gì bạn làm, TRONG LÚC bạn làm. Không phải sau đó — sau đó bạn sẽ nhớ ra một câu chuyện gọn gàng chứ không nhớ bốn thứ bạn đã thử mà chẳng ăn thua gì. Giá trị không nằm ở cuốn ghi chép; nó nằm ở chỗ chính hành động viết ra "tôi vừa khởi động lại nginx" làm bạn NHẬN RA là mình chưa kiểm xem nginx có phải vấn đề hay không.</p>

<div class="callout ok">
<p><strong>Và mỗi lần đổi MỘT thứ.</strong> Khởi động lại ứng dụng, xoá bộ đệm và lùi bản CÙNG LÚC thì chắc là sẽ chữa được, và bạn sẽ KHÔNG biết cái nào chữa — nên lần tái diễn sau bắt đầu lại từ con số không. Nếu bạn buộc phải làm nhiều thứ cùng lúc vì website đang sập và tốc độ mới là thứ đáng kể, hãy NÓI THÀNH TIẾNG điều đó và chấp nhận rằng bạn đang đổi phần chẩn đoán lấy mấy phút. Đó thường là đánh đổi ĐÚNG. Nó chỉ sai khi nó là vô ý.</p>
</div>


<h3>Chu kỳ: đo → giả thuyết → kiểm, và GHI LẠI</h3>
${slide('dv-11', 7, 'Chu kỳ đo → giả thuyết → kiểm, và ghi.sh — sổ sự cố có giờ')}
<p>"Mỗi lần đổi một thứ" mới là một nửa. Nửa còn lại là THỨ TỰ: ĐO trước khi đổi bất cứ thứ gì (chỉ đọc, chưa sửa), nói ra MỘT giả thuyết thành một câu, chọn một lệnh có thể BÁC BỎ nó, rồi mới đổi đúng một thứ và ĐO LẠI bằng chính lệnh ban đầu. Kiểm xong mà không khớp thì quay về bước đo với dữ kiện mới — đừng chồng thứ thứ hai lên thứ thứ nhất. Khoá Linux &amp; Bash, Chương 12, dạy cùng vòng lặp này cho việc chẩn đoán chính cái máy (sáu bước, có mốc thời gian); ở đây là bản rút gọn cho deploy.</p>
<p>Ghi chép giữa lúc sự cố nghe có vẻ tốn thời gian; thật ra nó rẻ nếu cái shell làm hộ bạn. Ba dòng này, nạp bằng <code>source ghi.sh</code>, biến mọi lệnh bạn chạy qua <code>ghi</code> thành một dòng có giờ trong sổ sự cố của hôm nay, kèm cả output:</p>
<pre><code class="language-bash"># ghi.sh — nap bang: source ghi.sh ; moi lenh chay qua "ghi" deu vao so su co
SO=~/su-co-\$(date +%Y%m%d).md
ghi() { echo "\$(date +%T)  \\\$ \$*" &gt;&gt; "\$SO"; "\$@" 2&gt;&amp;1 | tee -a "\$SO"; }
gt()  { echo "\$(date +%T)  GIA THUYET: \$*" | tee -a "\$SO"; }</code></pre>
<table>
<tr><th>Mảnh</th><th>Làm gì</th></tr>
<tr><td><code>ghi lệnh…</code></td><td>chạy lệnh, nối giờ + lệnh + output (cả stderr, nhờ <code>2&gt;&amp;1</code>) vào sổ, và vẫn hiện lên màn hình (<code>tee -a</code>)</td></tr>
<tr><td><code>gt "câu"</code></td><td>ghi một giả thuyết kèm giờ — dòng bạn sẽ mừng vì đã có khi kể lại</td></tr>
<tr><td><code>\$SO</code></td><td>mỗi ngày một tệp trong thư mục nhà; dán nguyên vào nhóm chat hoặc bản tường thuật sự cố (post-mortem)</td></tr>
</table>

<h3>Một cuốn sổ THẬT: sửa đúng, vẫn 502</h3>
${slide('dv-11', 8, 'Sổ sự cố thật: lùi đúng mà vẫn 502 — StartLimitBurst từ chối cả restart tay')}
<p>Để thử vòng lặp, tôi deploy một bản <code>v3</code> cố ý thiếu tệp <code>BAN</code> (app đọc nó lúc khởi động), rồi xử lý CHỈ bằng <code>ghi</code> và <code>gt</code>. Đây là cuốn sổ, cắt bớt vài dòng lặp:</p>
<div class="out">14:28:39  $ curl -s -o /dev/null -w %{http_code}\\n --cacert /etc/nginx/vidu.crt https://vidu.local/
502
14:28:39  $ systemctl is-active ung-dung
failed
14:28:39  $ journalctl -u ung-dung -n 1 -o cat
FileNotFoundError: [Errno 2] No such file or directory: 'BAN'
14:28:40  GIA THUYET: ban v3 thieu tep BAN nen app thoat 1
14:28:40  $ ls /srv/app/ban/v3
app.py
14:28:40  $ ln -sfn /srv/app/ban/v2 /srv/app/hien-tai
14:28:40  $ sudo systemctl restart ung-dung
Job for ung-dung.service failed because the control process exited with error code.
See "systemctl status ung-dung.service" and "journalctl -xeu ung-dung.service" for details.
14:28:40  $ curl -s -o /dev/null -w %{http_code}\\n --cacert /etc/nginx/vidu.crt https://vidu.local/
502
…
14:29:10  GIA THUYET: restart bi tu choi vi cham gioi han khoi dong (StartLimitBurst)
14:29:10  $ sudo systemctl reset-failed ung-dung
14:29:10  $ sudo systemctl restart ung-dung
14:29:11  $ curl -s -o /dev/null -w %{http_code}\\n --cacert /etc/nginx/vidu.crt https://vidu.local/
200</div>
<p>Giả thuyết đầu ĐÚNG (<code>ls</code> xác nhận thiếu tệp), cách sửa ĐÚNG (lùi về <code>v2</code>) — và vẫn 502. Vì đã ĐO LẠI bằng đúng lệnh ban đầu, dữ kiện mới hiện ra ngay trong dòng <code>Job for ung-dung.service failed</code>. Journal của chính systemd (đã bỏ tiền tố giờ và tên máy) nói lý do:</p>
<div class="out">ung-dung.service: Scheduled restart job, restart counter is at 5.
ung-dung.service: Start request repeated too quickly.
ung-dung.service: Failed with result 'exit-code'.
Failed to start ung-dung.service - ung dung dat lich.</div>
<p><code>Restart=on-failure</code> đã tự khởi động lại bản hỏng năm lần trong khoảng 1,5 giây (<code>RestartSec</code> mặc định 100 ms), chạm <code>StartLimitBurst=5</code> trong <code>StartLimitIntervalSec=10s</code>. Từ lúc đó systemd từ chối MỌI yêu cầu start — kể cả lệnh restart tay của bạn — cho tới khi cửa sổ 10 giây trôi qua hoặc bạn chạy <code>systemctl reset-failed</code>. Không có sổ, câu chuyện kể lại sau đó sẽ là "lùi về v2 không ăn thua, phải restart mấy lần mới được" — và một bài học SAI ("lùi bản không đáng tin") được mang sang sự cố sau.</p>
<div class="pitfall co-tieu-de"><p><strong>Restart tay sau một vòng lặp khởi động là lệnh BỊ TỪ CHỐI, không phải lệnh hỏng.</strong> Thấy <code>Start request repeated too quickly</code> thì bản mới của bạn có thể hoàn toàn ổn; systemd chỉ đang bảo vệ cái máy khỏi vòng lặp cũ. Chạy <code>systemctl reset-failed &lt;unit&gt;</code> rồi start lại. Bài 3.4 và 8.2 đã đo các giá trị <code>StartLimit*</code> — đặt chúng có chủ đích trong unit, đừng để mặc định tự quyết.</p></div>

<h3>Chạy thử từng bước: dựng VPS thí nghiệm của chương này</h3>
<p>Mọi số đo mới trong chương được làm trên một container Ubuntu 24.04 chạy systemd thật, mà máy Mac SSH vào như một VPS thuê. Dựng lại nó mất khoảng năm phút. Ảnh:</p>
<pre><code class="language-dockerfile">FROM ubuntu:24.04
ENV DEBIAN_FRONTEND=noninteractive TZ=Asia/Ho_Chi_Minh
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends \\
      systemd systemd-sysv dbus openssh-server ca-certificates curl nginx python3 openssl \\
      iproute2 procps psmisc lsof jq sudo postgresql-16 postgresql-client-16 tzdata \\
      unattended-upgrades ufw iptables less \\
 &amp;&amp; rm -rf /var/lib/apt/lists/*
RUN useradd -m -s /bin/bash deploy &amp;&amp; mkdir -p /home/deploy/.ssh \\
 &amp;&amp; echo 'deploy ALL=(ALL) NOPASSWD:ALL' &gt; /etc/sudoers.d/deploy
COPY khoa.pub /home/deploy/.ssh/authorized_keys
RUN chown -R deploy:deploy /home/deploy/.ssh &amp;&amp; chmod 700 /home/deploy/.ssh \\
 &amp;&amp; chmod 600 /home/deploy/.ssh/authorized_keys \\
 &amp;&amp; mkdir -p /srv/app &amp;&amp; chown deploy:deploy /srv/app \\
 &amp;&amp; systemctl enable ssh nginx postgresql
STOPSIGNAL SIGRTMIN+3
CMD ["/sbin/init"]</code></pre><pre><code class="language-bash"># tren Mac (hoac Linux/WSL) — moi thu nam trong ~/dv-lab/dv11
mkdir -p ~/dv-lab/dv11/img &amp;&amp; cd ~/dv-lab/dv11
ssh-keygen -t ed25519 -N '' -f khoa -C dv11-lab -q &amp;&amp; cp khoa.pub img/
# (chep Dockerfile o tren vao img/Dockerfile)
docker build -t dv11-img img
docker network create dv11-net
docker run -d --name dv11-vps --hostname vps-thi-nghiem --label dvhoc=11 \\
  --network dv11-net --privileged --cgroupns=host --memory 768m \\
  -p 127.0.0.1:19112:22 dv11-img
ssh -i khoa -o UserKnownHostsFile=known_hosts -p 19112 deploy@127.0.0.1</code></pre>
<table>
<tr><th>Cờ</th><th>Vì sao</th></tr>
<tr><td><code>--privileged --cgroupns=host</code></td><td>để systemd làm PID 1 và quản lý unit thật (<code>systemctl</code>, <code>journalctl</code>, <code>StartLimitBurst</code>). CHỈ cho container thí nghiệm, và gỡ ngay khi xong — nó trao gần hết quyền của máy chủ Docker</td></tr>
<tr><td><code>--memory 768m</code></td><td>một trần RAM nhỏ, như một VPS rẻ</td></tr>
<tr><td><code>-p 127.0.0.1:19112:22</code></td><td>chỉ máy của bạn SSH vào được; không mở gì ra mạng LAN</td></tr>
<tr><td><code>STOPSIGNAL SIGRTMIN+3</code></td><td>tín hiệu systemd hiểu là "tắt máy gọn gàng" khi <code>docker stop</code></td></tr>
<tr><td><code>--label dvhoc=11</code></td><td>để dọn đúng thứ của mình: <code>docker rm -f \$(docker ps -aq --filter label=dvhoc=11)</code></td></tr>
</table>
<p>Bên trong VPS: một chứng chỉ tự ký cho cái tên giả <code>vidu.local</code> (trỏ về 127.0.0.1 trong <code>/etc/hosts</code>), một CSDL, hai bản phát hành, một unit và một site nginx. Ứng dụng là 30 dòng Python, mỗi route là một kiểu hỏng chương này cần:</p>
<pre><code class="language-bash">sudo openssl req -x509 -newkey rsa:2048 -nodes -days 30 -subj /CN=vidu.local \\
  -addext subjectAltName=DNS:vidu.local \\
  -keyout /etc/nginx/vidu.key -out /etc/nginx/vidu.crt
echo "127.0.0.1 vidu.local" | sudo tee -a /etc/hosts
sudo -u postgres psql -c "create role deploy superuser login"     # CHI trong phong thi nghiem
sudo -u postgres createdb -O deploy nt
psql -d nt -c "create table bai(id int primary key, ten text);
               insert into bai values (1,'Kham tong quat'),(2,'Nha khoa');"
for b in v1 v2; do mkdir -p /srv/app/ban/\$b; cp app.py /srv/app/ban/\$b/; echo \$b &gt; /srv/app/ban/\$b/BAN; done
ln -sfn /srv/app/ban/v1 /srv/app/hien-tai</code></pre>
<pre><code class="language-ini"># /etc/systemd/system/ung-dung.service
[Unit]
Description=ung dung dat lich
After=network.target postgresql.service
[Service]
User=deploy
WorkingDirectory=/srv/app/hien-tai
Environment=PGDATABASE=nt
ExecStart=/usr/bin/python3 app.py
Restart=on-failure
[Install]
WantedBy=multi-user.target</code></pre>
<pre><code class="language-nginx"># /etc/nginx/sites-available/nt  (ln -sf vao sites-enabled/default)
log_format nt '\$remote_addr [\$time_local] "\$request" \$status rt=\$request_time urt=\$upstream_response_time';
server {
    listen 80 default_server;
    listen 443 ssl default_server;
    ssl_certificate     /etc/nginx/vidu.crt;
    ssl_certificate_key /etc/nginx/vidu.key;
    access_log /var/log/nginx/nt.log nt;
    proxy_read_timeout 2s;
    location /health { access_log off; proxy_pass http://127.0.0.1:8080; }
    location /chet   { proxy_pass http://127.0.0.1:8099; }
    location /       { proxy_pass http://127.0.0.1:8080; }
}</code></pre><pre><code class="language-python">import json, os, subprocess, sys, time
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
BAN = open('BAN').read().strip()          # doc MOT lan, luc khoi dong, tu thu muc lam viec
LO = os.environ.get('LO_LOI') == '1'      # ban co bug: lo phien ban + thong diep loi
class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def gui(self, ma, body, ct='text/plain; charset=utf-8', extra=None):
        b = body.encode(); self.send_response(ma)
        self.send_header('Content-Type', ct)
        for k, v in (extra or {}).items(): self.send_header(k, v)
        self.send_header('Content-Length', str(len(b))); self.end_headers(); self.wfile.write(b)
    def do_GET(self):
        p = self.path.split('?')[0]
        try:
            if p == '/health': return self.gui(200, 'ok\\n')
            if p == '/': return self.gui(200, f'&lt;html&gt;&lt;body&gt;&lt;main id="trang-chu"&gt;&lt;h1&gt;Dat lich&lt;/h1&gt;&lt;p&gt;ban {BAN}&lt;/p&gt;&lt;/main&gt;&lt;/body&gt;&lt;/html&gt;\\n', 'text/html; charset=utf-8')
            if p == '/ban': return self.gui(200, BAN + '\\n')
            if p == '/cham': time.sleep(3); return self.gui(200, 'cham\\n')
            if p == '/api/v1/rieng': return self.gui(401, '{"loi":"chua dang nhap"}\\n', 'application/json')
            if p == '/api/v1/bai':
                r = subprocess.run(['psql', '-d', 'nt', '-XAtc', 'select id, ten from bai order by id'], capture_output=True, text=True)
                if r.returncode: raise RuntimeError(r.stderr.strip())
                rows = [dict(zip(('id', 'ten'), l.split('|'))) for l in r.stdout.splitlines()]
                return self.gui(200, json.dumps(rows, ensure_ascii=False) + '\\n', 'application/json')
            if p == '/loi': raise RuntimeError('co tinh nem de kiem')
            return self.gui(404, 'khong co\\n')
        except Exception as e:
            print(f'[{BAN}] LOI {p}: {e}', file=sys.stderr, flush=True)
            if LO: return self.gui(500, f'{e}\\n', extra={'x-ban': BAN})
            return self.gui(500, 'loi may chu\\n')
ThreadingHTTPServer(('127.0.0.1', 8080), H).serve_forever()</code></pre>
<p>Rồi <code>sudo systemctl daemon-reload &amp;&amp; sudo systemctl enable --now ung-dung</code> và <code>sudo nginx -t &amp;&amp; sudo systemctl reload nginx</code>. <code>curl --cacert /etc/nginx/vidu.crt https://vidu.local/</code> phải trả về trang có chữ "ban v1".</p>

<h3>Trên Windows/WSL và macOS khác gì</h3>
<ul>
<li>Mọi lệnh chẩn đoán trong bài chạy <em>TRÊN VPS</em> qua SSH, nên chúng giống hệt nhau dù máy bạn là gì. Khác biệt chỉ nằm ở phía máy dev.</li>
<li><strong>Windows PowerShell 5.1:</strong> <code>curl</code> là bí danh của <code>Invoke-WebRequest</code>, không hiểu <code>-w</code>/<code>-o</code> kiểu curl. Gõ <code>curl.exe</code> (có sẵn từ Windows 10 bản 1803), hoặc làm trong WSL.</li>
<li><strong>WSL:</strong> Docker Desktop dùng chung engine, nên các lệnh dựng phòng thí nghiệm ở trên chạy nguyên văn. Để khoá SSH trong hệ tệp Linux (<code>~/dv-lab</code>), đừng để dưới <code>/mnt/c/…</code> — ở đó quyền tệp hiện là 777 và ssh từ chối khoá với lời "UNPROTECTED PRIVATE KEY FILE".</li>
<li><strong>macOS:</strong> <code>stat -c</code> là cú pháp GNU; trên Mac viết <code>stat -f %Sm</code>. Script chạy trên VPS thì không bị ảnh hưởng.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tối trước hôm bảo vệ SWP391, bạn cùng nhóm vừa deploy rồi nhắn "web chết rồi". Bạn có năm phút trước khi thầy vào phòng.</p>
<ol>
<li>Dựng VPS thí nghiệm như trên, chạy bản <code>v1</code>, rồi <code>sudo systemctl stop ung-dung</code> để giả sự cố.</li>
<li>Chạy bốn lệnh đi từ ngoài vào (<code>https://vidu.local/</code>, <code>127.0.0.1</code>, <code>127.0.0.1:8080</code>, <code>psql -c 'select 1'</code>) và gọi tên tầng sâu nhất còn hỏng.</li>
<li>Bật lại app, trỏ symlink sang <code>v2</code> mà KHÔNG restart, chạy năm dòng "bản nào" và đọc hai mốc giờ.</li>
<li><code>source ghi.sh</code>, tạo <code>ban/v3</code> thiếu tệp <code>BAN</code>, trỏ sang, restart, rồi xử lý CHỈ bằng <code>ghi</code>/<code>gt</code> cho tới khi trang chủ trả 200.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói đúng "tầng ứng dụng" ở bước 2; chỉ ra bằng <code>/proc/PID/cwd</code> rằng tiến trình vẫn chạy <code>v1</code> ở bước 3; và <code>~/su-co-*.md</code> có ít nhất hai dòng <code>GIA THUYET</code>, kết thúc bằng <code>200</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Rollback (lùi bản)</span><span class="v">Đưa bản trước quay lại; trỏ lại symlink mất 140 ms ở Chương 6.</span></div>
<div class="kv"><span class="k">Roll forward (đi tới)</span><span class="v">Sửa bằng một bản MỚI thay vì lùi — bắt buộc khi bản cũ không đọc được lược đồ hiện tại.</span></div>
<div class="kv"><span class="k">Triage (phân loại sự cố)</span><span class="v">Quyết định nhanh "sập, chậm hay sai" trước khi đào sâu.</span></div>
<div class="kv"><span class="k">Hypothesis (giả thuyết)</span><span class="v">Một câu về nguyên nhân mà một lệnh cụ thể có thể bác bỏ.</span></div>
<div class="kv"><span class="k">Working directory (thư mục làm việc)</span><span class="v">Chỗ tiến trình đang đứng; <code>/proc/PID/cwd</code> chỉ ra nó, và nó không đi theo symlink.</span></div>
<div class="kv"><span class="k">Start limit (giới hạn khởi động)</span><span class="v"><code>StartLimitBurst</code>/<code>IntervalSec</code>: vượt quá thì systemd từ chối cả restart tay cho tới khi <code>reset-failed</code>.</span></div>
<div class="kv"><span class="k">Incident log (sổ sự cố)</span><span class="v">Dòng thời gian lệnh + kết quả, ghi TRONG lúc xử lý chứ không nhớ lại sau.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Có deploy trong một giờ qua ⇒ lùi trước, chẩn đoán sau — trừ khi bản cũ không đọc được lược đồ hiện tại.</li>
<li>"Đang chạy bản nào" có ba câu trả lời — cửa trước, symlink, <code>/proc/PID/cwd</code> — nên hỏi cả ba.</li>
<li>Đi cây bốn bước từ trái sang phải: dựng, chuyển, tráo, chứng minh; bước đầu tiên nói "không" là bước hỏng.</li>
<li>Đi từ ngoài vào; tầng SÂU NHẤT còn hỏng là của bạn, mọi tầng bên ngoài nó là triệu chứng.</li>
<li>Đo, một giả thuyết, kiểm, đổi một thứ, đo lại bằng đúng lệnh cũ — và ghi hết bằng <code>ghi</code>.</li>
<li>"Start request repeated too quickly" là systemd từ chối, không phải app hỏng: <code>reset-failed</code> rồi mới start.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Effective Troubleshooting</span><span class="lc-sub">sre.google/sre-book/effective-troubleshooting/ — vòng lặp phân-loại / soi / chẩn-đoán, và lập luận rằng CẦM MÁU đi trước việc hiểu nguyên nhân.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Managing Incidents</span><span class="lc-sub">sre.google/sre-book/managing-incidents/ — tách người SỬA khỏi người BÁO CÁO, thứ trở nên quan trọng ngay khi có hơn một người tham gia.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">curl(1) — các biến --write-out</span><span class="lc-sub">curl.se/docs/manpage.html — <code>time_namelookup</code>, <code>time_connect</code>, <code>time_appconnect</code>, <code>time_starttransfer</code>: bản chia nhỏ tách DNS khỏi TLS khỏi máy chủ chỉ trong MỘT request.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — sách công thức chẩn đoán</span><span class="lc-sub">/courses/nginx/learn${REF} — cùng cách tiếp cận theo tầng nhìn từ phía proxy, kèm những dòng error log đi cùng mỗi ca.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.unit(5) — StartLimitIntervalSec=, StartLimitBurst=</span><span class="lc-sub">freedesktop.org/software/systemd/man/latest/systemd.unit.html — giới hạn tần suất nằm sau câu "Start request repeated too quickly", và vì sao <code>reset-failed</code> xoá được nó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">proc_pid_cwd(5)</span><span class="lc-sub">man7.org/linux/man-pages/man5/proc_pid_cwd.5.html — liên kết tới thư mục làm việc hiện tại của một tiến trình, sự thật duy nhất nói bản nào đang THẬT SỰ chạy.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — Chương 12: chẩn đoán một máy chủ thật</span><span class="lc-sub">/courses/linux-bash/learn${REF} — cuộc quét 60 giây, cây chết/chậm/lạ và vòng lặp sáu bước: phần CÁI MÁY mà chương này không dạy lại.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 11.2 ─────────────────────────── */
    {
      title: '11.2 — Reading the failure signature|||11.2 — Đọc CHỮ KÝ của cú hỏng',
      slug: 'deploy-11-2-chu-ky',
      type: 'VIDEO',
      description: 'Bốn cú hỏng khác nhau qua cùng một con proxy: 500 trong 1,3 ms, 502 trong 0,33 ms, 504 đúng bằng hạn giờ 2 giây. Thời gian mới là thứ nói cho bạn biết tầng nào hỏng, và error log của nginx xác nhận từng cái.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>Reading the failure signature</h2>
<p class="lead">A status code tells you which layer answered. The time it took tells you which layer failed. Together they identify the problem before you have opened a single log file.</p>

<h3>Four failures, measured</h3>
${slide('dv-11', 9, 'Bốn cú hỏng, bốn thời gian — đo lại trên VPS thí nghiệm')}
${slide('dv-11', 10, 'Bảng chữ ký: mã × thời gian → tầng nào hỏng, lệnh xác nhận, chương đã đo')}
<p>One nginx, one application, four deliberately different problems behind it — a working route, an application error, a dead upstream port, and an upstream that takes longer than <code>proxy_read_timeout 2s</code>:</p>

<div class="out">  /       → ma=200  0.007129s
  /loi    → ma=500  0.001334s
  /chet   → ma=502  0.000328s
  /cham   → ma=504  2.002693s</div>

<div class="callout ok">
<p><strong>The timings are the diagnosis.</strong> <strong>502 in 0.33 ms</strong> is faster than the working route — nothing was attempted, the TCP connection was refused instantly. <strong>504 at 2.0027 s</strong> is exactly the configured timeout, to three decimal places; a number that matches a timeout you set is never a coincidence. <strong>500 in 1.3 ms</strong> means the application received the request, ran code, and chose to return an error — it is alive and it disagrees with you.</p>
</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">502, sub-millisecond</span><span class="lz-lnote">connection refused. Nothing is listening on the upstream port — the app is not running (8.1: check for exit 137) or bound to the wrong address</span></div>
<div class="lz-layer"><span class="lz-lname">502, several seconds</span><span class="lz-lnote">different problem: the connection was accepted then dropped, or the upstream died mid-response. Look at the app, not the port</span></div>
<div class="lz-layer"><span class="lz-lname">504, exactly your timeout</span><span class="lz-lnote">the upstream accepted and never answered in time. A slow query, a lock, an external call with no timeout of its own</span></div>
<div class="lz-layer"><span class="lz-lname">503</span><span class="lz-lnote">nginx itself is refusing — every upstream marked down, or a <code>limit_req</code>/<code>limit_conn</code> rule firing</span></div>
<div class="lz-layer"><span class="lz-lname">500, fast</span><span class="lz-lnote">your code threw. The stack trace is in the application log, and this is the only one of these that is squarely yours</span></div>
<div class="lz-layer"><span class="lz-lname">404 on a route that should exist</span><span class="lz-lnote">a stale or partial build — the router never mounted it (7.4 measured this)</span></div>
</div>


<h3>Measured again on the lab VPS</h3>
<p>The same four routes on this chapter&#39;s lab VPS (nginx 1.24.0, <code>proxy_read_timeout 2s</code>, the Python app from 11.1), run twice:</p>
<pre><code class="language-bash"># bon-cu.sh
for u in / /loi /chet /cham; do
  printf '%-6s ' "\$u"
  curl -s -o /dev/null -w 'ma=%{http_code}  %{time_total}s\\n' "http://127.0.0.1\$u"
done</code></pre>
<div class="out">$ bash bon-cu.sh; echo ---; bash bon-cu.sh
/      ma=200  0.008167s
/loi   ma=500  0.007317s
/chet  ma=502  0.001030s
/cham  ma=504  2.006938s
---
/      ma=200  0.005526s
/loi   ma=500  0.002317s
/chet  ma=502  0.002292s
/cham  ma=504  2.005320s</div>
<p>The absolute numbers differ from the first measurement — 502 took 1.0–2.3 ms here against 0.33 ms there, because this is a container on a laptop — and two runs on the same machine differ threefold on the 500. What does <em>not</em> move is the shape: the 502 is never slower than a working request, because nothing was attempted; and the 504 lands on the configured timeout to within 7 ms, twice. Read signatures as relationships — "as fast as a success", "exactly my timeout" — never as absolute numbers to memorise.</p>
<p>Which timeout produced a 504 is itself a clue, so know the four directives that decide it (nginx documentation, defaults in brackets):</p>
<table>
<tr><th>Directive (default)</th><th>What it turns into</th></tr>
<tr><td><code>proxy_connect_timeout</code> (60s)</td><td>a connect that never completes — a firewall silently <em>dropping</em> packets — becomes a <strong>504</strong> after this long, logged as "timed out (110) while connecting". A closed port answers with a reset instead: instant <strong>502</strong>.</td></tr>
<tr><td><code>proxy_read_timeout</code> (60s)</td><td>the gap allowed between two reads of the response; exceeded ⇒ <strong>504</strong>, "while reading response header". This is the 2 s above.</td></tr>
<tr><td><code>proxy_send_timeout</code> (60s)</td><td>the same for sending the request body to the upstream — large uploads to a slow app.</td></tr>
<tr><td><code>proxy_next_upstream</code> (<code>error timeout</code>)</td><td>with several upstream servers, which failures make nginx try the next one — a 502 from one server may never reach the user, and <code>\$upstream_addr</code> in the log will list both.</td></tr>
</table>

<h3>What nginx writes down</h3>
${slide('dv-11', 11, 'errno 111 ở connect() khác errno 110 khi đọc header — error.log và ss -ltn')}
<div class="out">[error] connect() failed (111: Connection refused) while connecting to
        upstream, client: 127.0.0.1, server: , request: "GET /chet HTTP/1.1"

[error] upstream timed out (110: Connection timed out) while reading
        response header from upstream, client: 127.0.0.1, ...</div>

<p>Two different errno values, and each names the syscall that failed. <code>connect()</code> failing with <code>ECONNREFUSED</code> means the port is closed. <code>ETIMEDOUT</code> while <em>reading the response header</em> means the connection succeeded and the upstream then said nothing — a distinction that saves you from restarting a process that was never the problem.</p>

<p>Confirming it takes one command:</p>

<pre><code>ss -ltn | grep -E ':3370|:3380'
<span class="tok-comment"># LISTEN 127.0.0.1:3380   ← nginx co</span>
<span class="tok-comment"># (khong co dong nao cho 3370) ← ung dung KHONG. Day la ca 502.</span></code></pre>

<div class="pitfall">
<p><strong>Trap — "nothing is listening" and "listening on the wrong address" look identical from the proxy.</strong> An application bound to <code>127.0.0.1</code> is unreachable from another container; one bound to a container&#39;s internal address is unreachable from the host. Both produce <code>ECONNREFUSED</code> and a sub-millisecond 502. <code>ss -ltn</code> shows the address as well as the port, and that column is the one to read — <code>0.0.0.0:3000</code> and <code>127.0.0.1:3000</code> are very different situations that the status code cannot tell apart.</p>
</div>

<h3>The case with no status code at all</h3>
${slide('dv-11', 12, 'curl -w chia request thành DNS, TCP, TLS, máy chủ — và mã thoát 6/7/60')}
<p>When <code>curl</code> returns nothing, the breakdown flags say where it stopped:</p>

<pre><code>curl -s -o /dev/null --max-time 10 \\
  -w 'dns=%{time_namelookup} tcp=%{time_connect} tls=%{time_appconnect} chu-dau=%{time_starttransfer}\\n' \\
  https://vidu.com/</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">dns = 0</span><span class="lz-t">name did not resolve</span><span class="lz-d">DNS, or a typo in the hostname</span></div>
<div class="lz-step"><span class="lz-k">dns ok, tcp = 0</span><span class="lz-t">port unreachable</span><span class="lz-d">firewall, security group, or the machine is off</span></div>
<div class="lz-step"><span class="lz-k">tcp ok, tls = 0</span><span class="lz-t">TLS handshake failed</span><span class="lz-d">expired or wrong certificate — an HTTP check would never have seen this</span></div>
<div class="lz-step"><span class="lz-k">tls ok, chu-dau grows</span><span class="lz-t">the server is thinking</span><span class="lz-d">not a connectivity problem at all; go to 11.4</span></div>
</div>


<h3>Measured: every phase, and curl&#39;s own exit code</h3>
<p>The flow above is exactly what the lab VPS produced, one URL per failure — a working page, a slow page, a port nobody listens on, a name that does not exist, and an address the certificate was not issued for:</p>
<pre><code class="language-bash"># pha.sh — chay TREN VPS thi nghiem
F='dns=%{time_namelookup} tcp=%{time_connect} tls=%{time_appconnect} dau=%{time_starttransfer} ma=%{http_code}\\n'
for u in https://vidu.local/ https://vidu.local/cham https://vidu.local:8443/ https://vidu-sai.local/ https://127.0.0.1/; do
  echo "# \$u"
  curl -s -o /dev/null --max-time 5 --cacert /etc/nginx/vidu.crt -w "\$F" "\$u"; echo "  thoat=\$?"
done</code></pre>
<div class="out"># https://vidu.local/
dns=0.000328 tcp=0.000540 tls=0.005415 dau=0.011160 ma=200
  thoat=0
# https://vidu.local/cham
dns=0.001195 tcp=0.001413 tls=0.011144 dau=2.017190 ma=504
  thoat=0
# https://vidu.local:8443/
dns=0.000686 tcp=0.000000 tls=0.000000 dau=0.000000 ma=000
  thoat=7
# https://vidu-sai.local/
dns=0.000000 tcp=0.000000 tls=0.000000 dau=0.000000 ma=000
  thoat=6
# https://127.0.0.1/
dns=0.000020 tcp=0.000179 tls=0.000000 dau=0.000000 ma=000
  thoat=60</div>
<p>Each zero sits exactly where the table says. And the column most people forget is the last one: <strong>curl&#39;s exit code names the failure even when there is no HTTP code at all</strong>. Notice too that the 504 exited <code>0</code> — to curl, receiving an error page is a success; only <code>-f</code>/<code>--fail</code> turns HTTP errors into a non-zero exit (code 22).</p>
<table>
<tr><th><code>-w</code> variable</th><th>Measures, from the start of the request</th></tr>
<tr><td><code>%{time_namelookup}</code></td><td>until the name was resolved</td></tr>
<tr><td><code>%{time_connect}</code></td><td>until TCP was connected</td></tr>
<tr><td><code>%{time_appconnect}</code></td><td>until the TLS handshake finished (0 for plain HTTP)</td></tr>
<tr><td><code>%{time_starttransfer}</code></td><td>until the first byte of the response — "time to first byte"; the server&#39;s thinking time is this minus <code>time_appconnect</code></td></tr>
<tr><td><code>%{time_total}</code>, <code>%{http_code}</code></td><td>the whole request; the status (<code>000</code> = none received)</td></tr>
</table>
<table>
<tr><th>curl exit</th><th>Meaning</th><th>Look at</th></tr>
<tr><td>6</td><td>could not resolve host</td><td>DNS, <code>/etc/hosts</code>, a typo</td></tr>
<tr><td>7</td><td>failed to connect</td><td>nothing listening, or a firewall rejecting</td></tr>
<tr><td>28</td><td>operation timed out (<code>--max-time</code>)</td><td>a firewall dropping, or a server that never answers</td></tr>
<tr><td>35</td><td>TLS handshake failed</td><td>protocol/cipher mismatch, wrong port speaking HTTP</td></tr>
<tr><td>60</td><td>certificate could not be verified</td><td>expired, self-signed, or issued for another name</td></tr>
<tr><td>22</td><td>HTTP ≥ 400, only with <code>-f</code></td><td>the status code itself</td></tr>
</table>

<h3>The signature that is not an error</h3>
<p>Status 200, fast, and wrong. There is no error anywhere — not in the status, not in the logs, not in the metrics. Chapter 6 measured it: after a correct 140 ms rollback, every user received the rolled-back version for five minutes because a proxy cache sat in front. The only way to see it is to compare the version served against the version deployed:</p>

<pre><code>curl -s https://vidu.com/ban          <span class="tok-comment"># nguoi dung dang thay ban NAO</span>
basename "\$(readlink -f /srv/vps/nt/hien-tai)"   <span class="tok-comment"># may dang chay ban NAO</span>
<span class="tok-comment"># hai cai LECH nhau = bo dem, hoac tien trinh chua khoi dong lai (7.5)</span></code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">the fastest useful command</span><span class="v"><code>curl -s -o /dev/null -w '%{http_code} %{time_total}\\n'</code> — code and time together, which is the whole lesson</span></div>
<div class="kv"><span class="k">the second</span><span class="v"><code>ss -ltn</code> — address and port of everything listening</span></div>
<div class="kv"><span class="k">the third</span><span class="v"><code>tail -20 error.log</code> — the syscall and errno that failed</span></div>
<div class="kv"><span class="k">the one nobody runs</span><span class="v">comparing the version served against the version deployed</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> during the demo rehearsal three different pages fail in three different ways, and your teammate wants to "restart everything". Name each failure&#39;s layer from its signature before anyone touches a service.</p>
<ol>
<li>On the lab VPS from 11.1, run <code>bon-cu.sh</code> twice and write next to each line which layer answered and which failed.</li>
<li><code>sudo tail -n 4 /var/log/nginx/error.log</code>: find the errno for <code>/chet</code> and <code>/cham</code>, and confirm with <code>ss -ltn</code> that nothing listens on 8099.</li>
<li>Run <code>pha.sh</code>; for each URL say which phase stopped and what curl&#39;s exit code means.</li>
<li>Change <code>proxy_read_timeout</code> to <code>1s</code>, reload nginx, wait a second, run <code>bon-cu.sh</code> again. (Measured: a request sent the instant <code>systemctl reload nginx</code> returned still took 2.019 s — reload is graceful, and the old workers finish on the old configuration. A second later: 1.024 s and 1.013 s.)</li>
</ol>
<p><strong>Done when:</strong> you can explain 500/502/504 without looking at the table, match exit codes 6, 7 and 60 to DNS, port and certificate, and the <code>/cham</code> line moves to about <code>1.00…s</code> after step 4 — proving the number was your timeout.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Upstream (máy phía sau proxy)</span><span class="v">The application nginx forwards to; 502/504 are nginx reporting on it.</span></div>
<div class="kv"><span class="k">ECONNREFUSED — errno 111 (kết nối bị từ chối)</span><span class="v">Nothing listens on that address:port; the answer is instant.</span></div>
<div class="kv"><span class="k">ETIMEDOUT — errno 110 (hết giờ chờ)</span><span class="v">Connected (or trying to), then nothing came back in time.</span></div>
<div class="kv"><span class="k">proxy_read_timeout (hạn giờ đọc)</span><span class="v">How long nginx waits between reads before answering 504.</span></div>
<div class="kv"><span class="k">TTFB — time to first byte (thời gian tới byte đầu)</span><span class="v"><code>time_starttransfer</code>; minus the TLS time, it is the server&#39;s thinking time.</span></div>
<div class="kv"><span class="k">Exit code (mã thoát)</span><span class="v">curl&#39;s own verdict: 6 DNS, 7 connect, 28 timeout, 60 certificate.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The status code says which layer answered; the time says which layer failed.</li>
<li>502 as fast as a success is a closed port; a 504 equal to your timeout is an upstream that went quiet.</li>
<li>Signatures are relationships, not absolute numbers — the lab VPS measured 1–2 ms where the first machine measured 0.33 ms.</li>
<li>nginx&#39;s error log names the syscall and errno: 111 at <code>connect()</code>, 110 while reading the header.</li>
<li>With no status code, <code>curl -w</code> phases and curl&#39;s exit code (6/7/60) locate the stop.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 9110 §15.6 — Server Error 5xx</span><span class="lc-sub">rfc-editor.org/rfc/rfc9110#section-15.6 — the normative meanings of 500, 502, 503 and 504, which are more specific than common usage suggests.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — proxy_read_timeout, proxy_connect_timeout, proxy_next_upstream</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_proxy_module.html — the directives that turn a slow upstream into a 504, and the defaults worth changing.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ss(8)</span><span class="lc-sub">man 8 ss — <code>-ltnp</code> for listening TCP sockets with the owning process; the replacement for <code>netstat</code> and the command this whole course uses.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">errno(3) — ECONNREFUSED and ETIMEDOUT</span><span class="lc-sub">man 3 errno — 111 and 110, the two numbers that appear in the nginx error log above and distinguish the two failures.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — 502 versus 504, and what the error log says</span><span class="lc-sub">/courses/nginx/learn${REF} — the same signatures from the proxy&#39;s side, including what <code>proxy_next_upstream</code> does to them.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Everything curl — exit codes</span><span class="lc-sub">everything.curl.dev/cmdline/exitcode.html — the full list behind 6, 7, 28, 35 and 60, and why an HTTP error page still exits 0 without <code>--fail</code>.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Đọc CHỮ KÝ của cú hỏng</h2>
<p class="lead">Một mã trạng thái nói cho bạn biết TẦNG NÀO TRẢ LỜI. Thời gian nó tốn nói cho bạn biết TẦNG NÀO HỎNG. Gộp lại, chúng nhận diện được vấn đề trước khi bạn kịp mở một tệp log nào.</p>

<h3>Bốn cú hỏng, đo thật</h3>
${slide('dv-11', 9, 'Bốn cú hỏng, bốn thời gian — đo lại trên VPS thí nghiệm')}
${slide('dv-11', 10, 'Bảng chữ ký: mã × thời gian → tầng nào hỏng, lệnh xác nhận, chương đã đo')}
<p>Một con nginx, một ứng dụng, bốn vấn đề cố ý khác nhau phía sau nó — một route chạy tốt, một lỗi ứng dụng, một cổng upstream chết, và một upstream trả lời lâu hơn <code>proxy_read_timeout 2s</code>:</p>

<div class="out">  /       → ma=200  0.007129s
  /loi    → ma=500  0.001334s
  /chet   → ma=502  0.000328s
  /cham   → ma=504  2.002693s</div>

<div class="callout ok">
<p><strong>Các con số thời gian CHÍNH LÀ chẩn đoán.</strong> <strong>502 trong 0,33 ms</strong> nhanh hơn cả route chạy tốt — chẳng có gì được thử cả, kết nối TCP bị từ chối tức thì. <strong>504 ở 2,0027 s</strong> đúng bằng cái hạn giờ đã cấu hình, tới ba chữ số thập phân; một con số khớp với một hạn giờ BẠN đặt thì không bao giờ là trùng hợp. <strong>500 trong 1,3 ms</strong> nghĩa là ứng dụng NHẬN được request, CHẠY mã, và CHỌN trả về một lỗi — nó đang sống và nó không đồng ý với bạn.</p>
</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">502, dưới một mili giây</span><span class="lz-lnote">kết nối bị từ chối. KHÔNG có gì nghe ở cổng upstream — ứng dụng không chạy (8.1: kiểm mã thoát 137) hoặc gắn vào sai địa chỉ</span></div>
<div class="lz-layer"><span class="lz-lname">502, vài giây</span><span class="lz-lnote">vấn đề KHÁC: kết nối được chấp nhận rồi bị bỏ, hoặc upstream chết giữa chừng khi đang trả lời. Hãy nhìn ứng dụng, không phải cái cổng</span></div>
<div class="lz-layer"><span class="lz-lname">504, đúng bằng hạn giờ của bạn</span><span class="lz-lnote">upstream nhận rồi không trả lời kịp. Một truy vấn chậm, một cái khoá, một lời gọi ra ngoài không có hạn giờ riêng</span></div>
<div class="lz-layer"><span class="lz-lname">503</span><span class="lz-lnote">chính nginx đang từ chối — mọi upstream bị đánh dấu chết, hoặc một luật <code>limit_req</code>/<code>limit_conn</code> đang nổ</span></div>
<div class="lz-layer"><span class="lz-lname">500, nhanh</span><span class="lz-lnote">mã CỦA BẠN ném lỗi. Vết ngăn xếp nằm trong log ứng dụng, và đây là cái DUY NHẤT trong danh sách này rõ ràng là của bạn</span></div>
<div class="lz-layer"><span class="lz-lname">404 trên một route LẼ RA phải có</span><span class="lz-lnote">một bản dựng cũ hoặc nửa vời — router chưa bao giờ gắn nó (7.4 đã đo chuyện này)</span></div>
</div>


<h3>Đo lại trên VPS thí nghiệm</h3>
<p>Cũng bốn route ấy trên VPS thí nghiệm của chương (nginx 1.24.0, <code>proxy_read_timeout 2s</code>, app Python của bài 11.1), chạy hai lần:</p>
<pre><code class="language-bash"># bon-cu.sh
for u in / /loi /chet /cham; do
  printf '%-6s ' "\$u"
  curl -s -o /dev/null -w 'ma=%{http_code}  %{time_total}s\\n' "http://127.0.0.1\$u"
done</code></pre>
<div class="out">$ bash bon-cu.sh; echo ---; bash bon-cu.sh
/      ma=200  0.008167s
/loi   ma=500  0.007317s
/chet  ma=502  0.001030s
/cham  ma=504  2.006938s
---
/      ma=200  0.005526s
/loi   ma=500  0.002317s
/chet  ma=502  0.002292s
/cham  ma=504  2.005320s</div>
<p>Con số tuyệt đối khác lần đo đầu — 502 mất 1,0–2,3 ms ở đây so với 0,33 ms ở kia, vì đây là container trên một cái laptop — và hai lần chạy trên CÙNG một máy lệch nhau gấp ba ở cú 500. Thứ KHÔNG xê dịch là HÌNH DẠNG: 502 không bao giờ chậm hơn một request thành công, vì chẳng có gì được thử; còn 504 rơi đúng vào hạn giờ đã cấu hình, lệch dưới 7 ms, cả hai lần. Đọc chữ ký như những QUAN HỆ — "nhanh ngang một lần thành công", "đúng bằng hạn giờ của tôi" — đừng bao giờ học thuộc con số tuyệt đối.</p>
<p>Hạn giờ NÀO sinh ra cú 504 cũng là một manh mối, nên hãy biết bốn chỉ thị quyết định nó (tài liệu nginx, mặc định trong ngoặc):</p>
<table>
<tr><th>Chỉ thị (mặc định)</th><th>Biến thành cái gì</th></tr>
<tr><td><code>proxy_connect_timeout</code> (60s)</td><td>một lần kết nối không bao giờ xong — tường lửa lặng lẽ <em>VỨT</em> gói tin — thành <strong>504</strong> sau chừng ấy thời gian, log ghi "timed out (110) while connecting". Một cổng ĐÓNG thì trả gói reset: <strong>502</strong> tức thì.</td></tr>
<tr><td><code>proxy_read_timeout</code> (60s)</td><td>khoảng chờ cho phép giữa hai lần đọc bản trả lời; vượt ⇒ <strong>504</strong>, "while reading response header". Đây là con số 2 s ở trên.</td></tr>
<tr><td><code>proxy_send_timeout</code> (60s)</td><td>như trên nhưng cho việc gửi thân request tới upstream — tải tệp lớn lên một app chậm.</td></tr>
<tr><td><code>proxy_next_upstream</code> (<code>error timeout</code>)</td><td>khi có nhiều máy upstream, những kiểu hỏng nào làm nginx thử máy kế tiếp — một cú 502 của một máy có thể không bao giờ tới người dùng, và <code>\$upstream_addr</code> trong log sẽ liệt kê cả hai.</td></tr>
</table>

<h3>nginx ghi lại cái gì</h3>
${slide('dv-11', 11, 'errno 111 ở connect() khác errno 110 khi đọc header — error.log và ss -ltn')}
<div class="out">[error] connect() failed (111: Connection refused) while connecting to
        upstream, client: 127.0.0.1, server: , request: "GET /chet HTTP/1.1"

[error] upstream timed out (110: Connection timed out) while reading
        response header from upstream, client: 127.0.0.1, ...</div>

<p>Hai giá trị errno khác nhau, và mỗi cái GỌI TÊN cái lời gọi hệ thống đã hỏng. <code>connect()</code> hỏng với <code>ECONNREFUSED</code> nghĩa là cổng ĐÓNG. <code>ETIMEDOUT</code> trong lúc <em>ĐỌC HEADER TRẢ LỜI</em> nghĩa là kết nối THÀNH CÔNG rồi upstream chẳng nói gì — một khác biệt cứu bạn khỏi việc khởi động lại một tiến trình vốn chưa bao giờ là vấn đề.</p>

<p>Xác nhận nó tốn một câu lệnh:</p>

<pre><code>ss -ltn | grep -E ':3370|:3380'
<span class="tok-comment"># LISTEN 127.0.0.1:3380   ← nginx co</span>
<span class="tok-comment"># (khong co dong nao cho 3370) ← ung dung KHONG. Day la ca 502.</span></code></pre>

<div class="pitfall">
<p><strong>Bẫy — "không có gì nghe" và "nghe SAI ĐỊA CHỈ" trông y hệt nhau từ phía proxy.</strong> Một ứng dụng gắn vào <code>127.0.0.1</code> thì không với tới được từ một container khác; một cái gắn vào địa chỉ nội bộ của container thì không với tới được từ máy chủ. Cả hai đều đẻ ra <code>ECONNREFUSED</code> và một cú 502 dưới một mili giây. <code>ss -ltn</code> hiện ra cả ĐỊA CHỈ lẫn cổng, và cái cột đó mới là cột cần đọc — <code>0.0.0.0:3000</code> và <code>127.0.0.1:3000</code> là hai tình huống rất khác nhau mà mã trạng thái không phân biệt được.</p>
</div>

<h3>Ca KHÔNG có mã trạng thái nào cả</h3>
${slide('dv-11', 12, 'curl -w chia request thành DNS, TCP, TLS, máy chủ — và mã thoát 6/7/60')}
<p>Khi <code>curl</code> chẳng trả về gì, các cờ chia nhỏ sẽ nói nó dừng ở đâu:</p>

<pre><code>curl -s -o /dev/null --max-time 10 \\
  -w 'dns=%{time_namelookup} tcp=%{time_connect} tls=%{time_appconnect} chu-dau=%{time_starttransfer}\\n' \\
  https://vidu.com/</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">dns = 0</span><span class="lz-t">tên không phân giải được</span><span class="lz-d">DNS, hoặc gõ sai tên miền</span></div>
<div class="lz-step"><span class="lz-k">dns ổn, tcp = 0</span><span class="lz-t">cổng không với tới được</span><span class="lz-d">tường lửa, nhóm bảo mật, hoặc cái máy đang tắt</span></div>
<div class="lz-step"><span class="lz-k">tcp ổn, tls = 0</span><span class="lz-t">bắt tay TLS hỏng</span><span class="lz-d">chứng chỉ hết hạn hoặc sai — một phép kiểm HTTP sẽ KHÔNG BAO GIỜ thấy chuyện này</span></div>
<div class="lz-step"><span class="lz-k">tls ổn, chu-dau tăng dần</span><span class="lz-t">máy chủ đang NGHĨ</span><span class="lz-d">chẳng phải vấn đề kết nối gì cả; sang bài 11.4</span></div>
</div>


<h3>Đo thật: từng pha, và mã thoát của chính curl</h3>
<p>Dãy bước ở trên đúng là thứ VPS thí nghiệm sinh ra, mỗi URL một kiểu hỏng — một trang chạy tốt, một trang chậm, một cổng không ai nghe, một cái tên không tồn tại, và một địa chỉ mà chứng chỉ không cấp cho:</p>
<pre><code class="language-bash"># pha.sh — chay TREN VPS thi nghiem
F='dns=%{time_namelookup} tcp=%{time_connect} tls=%{time_appconnect} dau=%{time_starttransfer} ma=%{http_code}\\n'
for u in https://vidu.local/ https://vidu.local/cham https://vidu.local:8443/ https://vidu-sai.local/ https://127.0.0.1/; do
  echo "# \$u"
  curl -s -o /dev/null --max-time 5 --cacert /etc/nginx/vidu.crt -w "\$F" "\$u"; echo "  thoat=\$?"
done</code></pre>
<div class="out"># https://vidu.local/
dns=0.000328 tcp=0.000540 tls=0.005415 dau=0.011160 ma=200
  thoat=0
# https://vidu.local/cham
dns=0.001195 tcp=0.001413 tls=0.011144 dau=2.017190 ma=504
  thoat=0
# https://vidu.local:8443/
dns=0.000686 tcp=0.000000 tls=0.000000 dau=0.000000 ma=000
  thoat=7
# https://vidu-sai.local/
dns=0.000000 tcp=0.000000 tls=0.000000 dau=0.000000 ma=000
  thoat=6
# https://127.0.0.1/
dns=0.000020 tcp=0.000179 tls=0.000000 dau=0.000000 ma=000
  thoat=60</div>
<p>Mỗi số 0 nằm đúng chỗ bảng đã nói. Và cột người ta hay quên nhất là cột cuối: <strong>mã thoát của curl gọi tên cú hỏng ngay cả khi không có mã HTTP nào</strong>. Để ý thêm cú 504 thoát <code>0</code> — với curl, nhận được một trang lỗi là THÀNH CÔNG; chỉ có <code>-f</code>/<code>--fail</code> mới biến lỗi HTTP thành mã thoát khác 0 (mã 22).</p>
<table>
<tr><th>Biến <code>-w</code></th><th>Đo từ lúc bắt đầu request tới khi</th></tr>
<tr><td><code>%{time_namelookup}</code></td><td>phân giải xong tên</td></tr>
<tr><td><code>%{time_connect}</code></td><td>nối xong TCP</td></tr>
<tr><td><code>%{time_appconnect}</code></td><td>bắt tay TLS xong (0 với HTTP thường)</td></tr>
<tr><td><code>%{time_starttransfer}</code></td><td>nhận byte ĐẦU TIÊN của bản trả lời — "time to first byte" (thời gian tới byte đầu); thời gian máy chủ nghĩ = số này trừ <code>time_appconnect</code></td></tr>
<tr><td><code>%{time_total}</code>, <code>%{http_code}</code></td><td>cả request; mã trạng thái (<code>000</code> = không nhận được mã nào)</td></tr>
</table>
<table>
<tr><th>curl thoát</th><th>Nghĩa</th><th>Nhìn vào</th></tr>
<tr><td>6</td><td>không phân giải được tên máy</td><td>DNS, <code>/etc/hosts</code>, gõ sai</td></tr>
<tr><td>7</td><td>không kết nối được</td><td>không ai nghe, hoặc tường lửa từ chối</td></tr>
<tr><td>28</td><td>hết giờ (<code>--max-time</code>)</td><td>tường lửa vứt gói tin, hoặc máy chủ không bao giờ trả lời</td></tr>
<tr><td>35</td><td>bắt tay TLS hỏng</td><td>lệch giao thức/bộ mã, cổng đó đang nói HTTP thường</td></tr>
<tr><td>60</td><td>không xác minh được chứng chỉ</td><td>hết hạn, tự ký, hoặc cấp cho tên khác</td></tr>
<tr><td>22</td><td>HTTP ≥ 400, chỉ khi có <code>-f</code></td><td>chính mã trạng thái</td></tr>
</table>

<h3>Cái chữ ký KHÔNG phải một lỗi</h3>
<p>Mã 200, nhanh, và SAI. Chẳng có lỗi ở đâu cả — không trong mã trạng thái, không trong log, không trong số đo. Chương 6 đã đo nó: sau một cú lùi ĐÚNG trong 140 ms, mọi người dùng nhận đúng cái bản vừa lùi suốt năm phút vì có một bộ đệm proxy đứng phía trước. Cách duy nhất để thấy là ĐỐI CHIẾU phiên bản đang phục vụ với phiên bản đã deploy:</p>

<pre><code>curl -s https://vidu.com/ban          <span class="tok-comment"># nguoi dung dang thay ban NAO</span>
basename "\$(readlink -f /srv/vps/nt/hien-tai)"   <span class="tok-comment"># may dang chay ban NAO</span>
<span class="tok-comment"># hai cai LECH nhau = bo dem, hoac tien trinh chua khoi dong lai (7.5)</span></code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">câu lệnh hữu dụng nhanh nhất</span><span class="v"><code>curl -s -o /dev/null -w '%{http_code} %{time_total}\\n'</code> — mã và thời gian CÙNG NHAU, mà đó là toàn bộ bài học này</span></div>
<div class="kv"><span class="k">cái thứ hai</span><span class="v"><code>ss -ltn</code> — địa chỉ và cổng của mọi thứ đang nghe</span></div>
<div class="kv"><span class="k">cái thứ ba</span><span class="v"><code>tail -20 error.log</code> — lời gọi hệ thống và errno đã hỏng</span></div>
<div class="kv"><span class="k">cái không ai chạy</span><span class="v">đối chiếu phiên bản đang PHỤC VỤ với phiên bản đã DEPLOY</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> lúc tổng duyệt buổi demo, ba trang hỏng theo ba kiểu khác nhau và bạn cùng nhóm muốn "restart hết cho nhanh". Hãy gọi tên tầng của từng cú hỏng từ chữ ký của nó TRƯỚC khi có ai đụng vào dịch vụ nào.</p>
<ol>
<li>Trên VPS thí nghiệm của bài 11.1, chạy <code>bon-cu.sh</code> hai lần và ghi cạnh mỗi dòng tầng nào trả lời, tầng nào hỏng.</li>
<li><code>sudo tail -n 4 /var/log/nginx/error.log</code>: tìm errno của <code>/chet</code> và <code>/cham</code>, rồi xác nhận bằng <code>ss -ltn</code> rằng không ai nghe cổng 8099.</li>
<li>Chạy <code>pha.sh</code>; với mỗi URL nói pha nào dừng và mã thoát curl nghĩa là gì.</li>
<li>Đổi <code>proxy_read_timeout</code> thành <code>1s</code>, reload nginx, đợi một giây, chạy lại <code>bon-cu.sh</code>. (Đo thật: một request gửi ĐÚNG lúc <code>systemctl reload nginx</code> vừa trả về vẫn mất 2,019 s — reload là êm, các worker cũ phục vụ nốt bằng cấu hình cũ. Một giây sau: 1,024 s và 1,013 s.)</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giải thích được 500/502/504 mà không nhìn bảng, ghép đúng mã thoát 6, 7, 60 với DNS, cổng và chứng chỉ, và dòng <code>/cham</code> chuyển về khoảng <code>1.00…s</code> sau bước 4 — chứng minh con số ấy là hạn giờ CỦA BẠN.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Upstream (máy phía sau proxy)</span><span class="v">Ứng dụng mà nginx chuyển request tới; 502/504 là nginx báo cáo về nó.</span></div>
<div class="kv"><span class="k">ECONNREFUSED — errno 111 (kết nối bị từ chối)</span><span class="v">Không ai nghe ở địa chỉ:cổng đó; câu trả lời tới tức thì.</span></div>
<div class="kv"><span class="k">ETIMEDOUT — errno 110 (hết giờ chờ)</span><span class="v">Đã nối (hoặc đang cố nối), rồi không có gì trả về kịp.</span></div>
<div class="kv"><span class="k">proxy_read_timeout (hạn giờ đọc)</span><span class="v">nginx chờ bao lâu giữa hai lần đọc trước khi trả 504.</span></div>
<div class="kv"><span class="k">TTFB — time to first byte (thời gian tới byte đầu)</span><span class="v"><code>time_starttransfer</code>; trừ đi thời gian TLS là thời gian máy chủ nghĩ.</span></div>
<div class="kv"><span class="k">Exit code (mã thoát)</span><span class="v">Phán quyết của chính curl: 6 DNS, 7 kết nối, 28 hết giờ, 60 chứng chỉ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mã trạng thái nói tầng nào TRẢ LỜI; thời gian nói tầng nào HỎNG.</li>
<li>502 nhanh ngang một lần thành công là cổng đóng; 504 đúng bằng hạn giờ là upstream im lặng.</li>
<li>Chữ ký là quan hệ, không phải con số tuyệt đối — VPS thí nghiệm đo 1–2 ms ở chỗ máy đầu đo 0,33 ms.</li>
<li>error.log của nginx gọi tên lời gọi hệ thống và errno: 111 ở <code>connect()</code>, 110 khi đọc header.</li>
<li>Không có mã trạng thái thì các pha của <code>curl -w</code> và mã thoát curl (6/7/60) chỉ ra chỗ dừng.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 9110 §15.6 — Server Error 5xx</span><span class="lc-sub">rfc-editor.org/rfc/rfc9110#section-15.6 — ý nghĩa chuẩn tắc của 500, 502, 503 và 504, cụ thể hơn cách người ta hay dùng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — proxy_read_timeout, proxy_connect_timeout, proxy_next_upstream</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_proxy_module.html — các chỉ thị biến một upstream chậm thành một cú 504, và những giá trị mặc định đáng đổi.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ss(8)</span><span class="lc-sub">man 8 ss — <code>-ltnp</code> cho các socket TCP đang nghe kèm tiến trình sở hữu; thứ thay thế <code>netstat</code> và là câu lệnh cả khoá này dùng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">errno(3) — ECONNREFUSED và ETIMEDOUT</span><span class="lc-sub">man 3 errno — 111 và 110, hai con số xuất hiện trong error log nginx ở trên và phân biệt hai cú hỏng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — 502 so với 504, và error log nói gì</span><span class="lc-sub">/courses/nginx/learn${REF} — cùng những chữ ký ấy nhìn từ phía proxy, kể cả việc <code>proxy_next_upstream</code> làm gì với chúng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Everything curl — exit codes</span><span class="lc-sub">everything.curl.dev/cmdline/exitcode.html — danh sách đầy đủ sau các mã 6, 7, 28, 35 và 60, và vì sao một trang lỗi HTTP vẫn thoát 0 nếu không có <code>--fail</code>.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 11.3 ─────────────────────────── */
    {
      title: '11.3 — Recipe book: the deploy did something unexpected|||11.3 — Sách công thức: lần deploy làm chuyện lạ',
      slug: 'deploy-11-3-cong-thuc-deploy',
      type: 'VIDEO',
      description: 'Sáu triệu chứng liên quan tới deploy, mỗi cái kèm câu lệnh xác nhận, nguyên nhân gốc thường gặp, và số bài đã ĐO nó. Không phải danh sách gợi ý — mỗi dòng trỏ về một phép đo trong khoá này.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>Recipe book: the deploy did something unexpected</h2>
<p class="lead">Every entry below is a symptom this course measured, with the command that confirms it and the lesson that produced the number. It is a lookup table, and it is meant to be read in an incident rather than before one.</p>

<h3>1. The deploy reported success and nothing changed</h3>
${slide('dv-11', 13, 'Deploy báo xong mà không đổi: symlink, tiến trình, cửa trước — ba lệnh, năm hàng')}
<pre><code>curl -s http://cua-truoc/ban                       <span class="tok-comment"># nguoi dung thay ban nao</span>
basename "\$(readlink -f /srv/vps/nt/hien-tai)"     <span class="tok-comment"># symlink tro dau</span>
ss -ltnp | grep ':3391 '                            <span class="tok-comment"># tien trinh nao dang giu cong</span></code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">symlink is old</span><span class="lz-lnote">the deploy exited before the swap. Read the log: which numbered step is the last one? (7.5)</span></div>
<div class="lz-layer"><span class="lz-lname">symlink new, process old</span><span class="lz-lnote">it was never restarted. A running process does not follow a symlink that changes — this was the bug in my own script (7.5)</span></div>
<div class="lz-layer"><span class="lz-lname">both new, front door old</span><span class="lz-lnote">a cache. Measured at five minutes in 6.5; purge and re-check</span></div>
<div class="lz-layer"><span class="lz-lname">exit 0 and no log at all</span><span class="lz-lnote">the script refused and said so quietly — a prompt with no terminal exits 0 (7.3)</span></div>
</div>

<p>The first two rows are the ones measured in Lesson 11.1: the symlink said <code>v2</code>, <code>/proc/PID/cwd</code> said <code>v1</code>, and the process had started three seconds before the link changed. Run the three commands — <code>readlink -f</code> on the symlink, <code>readlink /proc/\$PID/cwd</code>, <code>curl</code> on the front door — before guessing; together they pick the row for you.</p>

<h3>2. A route returns 404 that worked yesterday</h3>
${slide('dv-11', 14, 'Kiểm khói: 200/401 là route đã gắn, 404 là ảnh/bản dựng cũ — khoi.sh thoát 1')}
<p>A stale or partial build: the process started, <code>/health</code> passes, and one router was never mounted. 7.4 measured the check that catches it — an unauthenticated GET returning <strong>401 means mounted</strong>, <strong>404 means missing</strong>. A full clean redeploy is the fix; a <code>--no-build</code> shortcut is usually the cause.</p>

<p>Measured on the lab VPS, with <code>/api/v1/lich-moi</code> standing for "the route this release added" — the running build does not have it:</p>
<pre><code class="language-bash"># khoi.sh — 200/401 = route da gan; con lai (404 truoc het) = hong
hong=0
for r in /health /api/v1/bai /api/v1/rieng /api/v1/lich-moi; do
  ma=\$(curl -s -o /dev/null -w '%{http_code}' "https://vidu.local\$r" --cacert /etc/nginx/vidu.crt)
  case \$ma in
    200|401) echo "  ✓ \$r → \$ma" ;;
    *)       echo "  ✗ \$r → \$ma"; hong=1 ;;
  esac
done
exit \$hong</code></pre>
<div class="out">$ bash khoi.sh; echo "thoat=\$?"
  ✓ /health → 200
  ✓ /api/v1/bai → 200
  ✓ /api/v1/rieng → 401
  ✗ /api/v1/lich-moi → 404
thoat=1</div>
<p>Two details matter. The list must hold at least one route <em>new in this release</em>, otherwise an old build passes every line. And the check accepts 401 on purpose: <code>curl -sf</code> would call a protected route "broken" on every deploy (7.4 measured exactly that). This is the lesson of 02/07 on the real project: a <code>--no-build</code> deploy kept the old image, <code>/health</code> was green, and the GIF route answered 404.</p>

<h3>3. Every request returns 500 but /health returns 200</h3>
${slide('dv-11', 15, '/health 200, API 500: đổi tên cột ten → tieu_de, đo lại trên PostgreSQL 16')}
<pre><code>curl -s http://cua-truoc/api/v1/bai | head -c 200
psql -d nt -c "\\d ten_bang"                        <span class="tok-comment"># cot ma ma cu doc CO khong?</span></code></pre>

<p>Measured in 6.2: code rolled back onto a schema that moved on. <code>/health</code> answers before touching anything, so it cannot see a schema mismatch — that is deliberate, not a bug (9.5). Either roll the schema back too, or roll forward.</p>

<p>Measured on the lab VPS: I renamed the column the running code reads, the way a migration from a newer release would:</p>
<div class="out">$ psql -d nt -Xqc "alter table bai rename column ten to tieu_de"
$ for r in /health /api/v1/bai; do printf "%-12s " \$r; curl -s -o /dev/null -w "%{http_code}\\n" http://127.0.0.1\$r; done
/health      200
/api/v1/bai  500
$ journalctl -u ung-dung -n 4 -o short-iso
2026-09-29T14:23:40+07:00 vps-thi-nghiem python3[899]: [v2] LOI /api/v1/bai: ERROR:  column "ten" does not exist
2026-09-29T14:23:40+07:00 vps-thi-nghiem python3[899]: LINE 1: select id, ten from bai order by id
2026-09-29T14:23:40+07:00 vps-thi-nghiem python3[899]:                    ^
$ psql -d nt -Xc "\\d bai"
                 Table "public.bai"
 Column  |  Type   | Collation | Nullable | Default
---------+---------+-----------+----------+---------
 id      | integer |           | not null |
 tieu_de | text    |           |          |
Indexes:
    "bai_pkey" PRIMARY KEY, btree (id)</div>
<p>Read it in the order you would meet it in an incident: the health check is green, the real route is red, the application log names the exact column, and <code>\\d</code> shows what the column is called now. Renaming it back (<code>… rename column tieu_de to ten</code>) returned the route to 200 at once — nothing needed a restart, because the code was never wrong; the schema had moved under it. On a real project the "rename back" is a new migration, not a hand edit, and it is only possible if no newer code already depends on the new name — which is why Chapter 5 renames in three deploys (expand, migrate, contract).</p>

<h3>4. It worked, then died a few minutes later</h3>
<pre><code>dmesg | grep -i 'killed process'
systemctl show ung-dung -p MemoryPeak -p MemoryCurrent       <span class="tok-comment"># cgroup v2 (Ubuntu 22.04+)</span>
cat /sys/fs/cgroup/system.slice/ung-dung.service/memory.events   <span class="tok-comment"># oom_kill &gt; 0 ?</span></code></pre>

<div class="callout warn">
<p><strong>Exit 137 and an empty application log is the OOM killer (8.1).</strong> Nothing your application wrote will mention it, because <code>SIGKILL</code> cannot be caught. Check whether a build ran at the same time — 8.2 measured a build that exited 0 while the database was killed, and 8.5 measured two parallel builds killing one another on a 200 MB ceiling.</p>
</div>

<p><strong>Corrected 29/09/2026.</strong> An earlier version of this entry read <code>memory.max_usage_in_bytes</code> under <code>/sys/fs/cgroup/memory/</code>. That is the cgroup v1 layout; Ubuntu 22.04 and later — every VPS in this course — use cgroup v2, where that directory does not exist. The v2 equivalents, measured on the lab VPS (there the unit&#39;s cgroup sits under <code>/sys/fs/cgroup/docker/&lt;id&gt;/…</code> because the "VPS" is itself a container; on a real server it is <code>/sys/fs/cgroup/system.slice/…</code>):</p>
<div class="out">$ systemctl show ung-dung -p MemoryPeak -p MemoryCurrent
MemoryCurrent=9687040
MemoryPeak=14553088
$ cat /sys/fs/cgroup/…/ung-dung.service/memory.events
low 0
high 0
max 0
oom 0
oom_kill 0
oom_group_kill 0
sock_throttled 0</div>
<p><code>MemoryPeak</code> is the most the unit has used since it started; <code>oom_kill</code> counts processes of this unit the kernel killed. Above 0, "why did it die" is answered — and <code>memory.events</code> survives even when the application wrote nothing at all.</p>

<h3>5. The migration will not run</h3>
<pre><code>npx prisma migrate status
psql -d nt -c "select * from _prisma_migrations order by started_at desc limit 3;"</code></pre>

<p>5.4 measured the half-applied state: a three-statement migration whose third statement failed left the table existing, the rows inserted, the constraint absent, and the ledger saying not-finished — and re-running failed at statement one. <strong>Do not auto-resolve.</strong> Inspect which statements actually applied, decide by hand, and only then mark the ledger. This is the one place in the whole course where the right move is to stop and ask somebody.</p>

<h3>6. The site is fine and one user says it is broken</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">their browser cache</span><span class="lz-t">no command reaches it</span><span class="lz-d">an HTML page with <code>max-age</code> cannot be recalled (6.5)</span></div>
<div class="lz-step"><span class="lz-k">their DNS</span><span class="lz-t">old A record</span><span class="lz-d">ask them for the IP they resolve; TTL is the wait</span></div>
<div class="lz-step"><span class="lz-k">their data</span><span class="lz-t">rows the bad version wrote</span><span class="lz-d">6.3 measured 240 poisoned rows surviving a clean rollback</span></div>
<div class="lz-step"><span class="lz-k">one upstream of several</span><span class="lz-t">partial</span><span class="lz-d">only some requests land on the broken one; <code>\$upstream_addr</code> in the log names it</span></div>
</div>

<h3>7. The container version: Restarting, and an exit code that reads 0</h3>
<p>With Docker the symptoms change names but not shape. A release that exits 1 on start plus <code>restart: unless-stopped</code> becomes an endless loop. Measured on the Mac (Docker 29.8, two runs of the same container):</p>
<div class="out">$ docker run -d --name dv11-api --restart unless-stopped node:22-alpine \\
    node -e "console.error('thieu DATABASE_URL');process.exit(1)"
$ docker ps -a --filter name=dv11-api --format 'table {{.Names}}\\t{{.Status}}'
NAMES      STATUS
dv11-api   Restarting (1) 1 second ago
$ docker logs --tail 2 dv11-api
thieu DATABASE_URL
thieu DATABASE_URL
$ for i in 1 2 3 4 5 6; do docker inspect -f '{{.State.Status}} Restarting={{.State.Restarting}} ExitCode={{.State.ExitCode}} RestartCount={{.RestartCount}}' dv11-api; sleep 0.7; done
restarting Restarting=true ExitCode=1 RestartCount=5
running Restarting=false ExitCode=0 RestartCount=5
restarting Restarting=true ExitCode=1 RestartCount=6
restarting Restarting=true ExitCode=1 RestartCount=6
restarting Restarting=true ExitCode=1 RestartCount=6
restarting Restarting=true ExitCode=1 RestartCount=6</div>
<p><code>Restarting (1)</code> — the number in brackets is the last exit code, and <code>docker logs</code> keeps the reason from every attempt. But look at the second line of the loop: caught in the fraction of a second between attempts, the container reads <code>running</code> with <code>ExitCode=0</code>. One <code>docker inspect</code> at the wrong moment says "healthy". Read <code>Status</code> together with <code>RestartCount</code> — a count that keeps growing is the loop, whatever the other fields say. This is the shape of the real 18/08 incident on the project: an image built on Alpine (musl) carrying a Prisma engine built for glibc, green build, green push, green swap — then a backend restarting forever and <strong>seven minutes of 502</strong>. Chapter 13 builds the check that catches it before the push.</p>
<table>
<tr><th>Command</th><th>Answers</th></tr>
<tr><td><code>docker compose ps</code></td><td>state of every service; <code>Restarting</code>, <code>Exited (137)</code>, <code>(unhealthy)</code></td></tr>
<tr><td><code>docker compose logs --tail 30 backend</code></td><td>the reason, from the last attempts</td></tr>
<tr><td><code>docker inspect -f '{{.RestartCount}} {{.State.OOMKilled}}' X</code></td><td>is it looping; did the kernel kill it (11.4)</td></tr>
<tr><td><code>docker inspect -f '{{.Image}}' X</code></td><td>which image digest is actually running — the container form of <code>/proc/PID/cwd</code></td></tr>
</table>

<h3>The two questions that end most of these</h3>
${slide('dv-11', 16, '"Chẳng có gì thay đổi" gần như luôn sai: chứng chỉ, đĩa, cron, phía trên, dữ liệu, người khác')}
<div class="kv-grid">
<div class="kv"><span class="k">what version is actually serving?</span><span class="v">from the front door, not from the machine. Nearly half the entries above resolve here</span></div>
<div class="kv"><span class="k">what changed, and when?</span><span class="v">the deploy log with timestamps, the git log, and the migration ledger. Three commands</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — "nothing changed" is almost always false.</strong> A certificate expired. A disk crossed a threshold. A cron job ran for the first time this month. An upstream provider deployed. A log rotated and something reopened a file it should not have. Chapter 8 measured a disk filling from build cache alone, with nobody touching the machine. When somebody says nothing changed, they mean nobody deployed — which is a much smaller claim.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> after tonight&#39;s deploy the group chat fills with three different complaints — "nothing changed", "the booking page is 404", "every list is empty with an error". Reproduce each on the lab VPS and find it in the recipe book in under a minute.</p>
<ol>
<li>Point <code>hien-tai</code> at <code>v2</code> without restarting; run the three commands and name the row of entry 1.</li>
<li>Run <code>khoi.sh</code> with a route the build does not have; confirm it exits 1.</li>
<li>Rename <code>bai.ten</code> to <code>tieu_de</code>; show <code>/health</code> 200 and <code>/api/v1/bai</code> 500, find the column in the journal, rename it back.</li>
<li>On your laptop: <code>docker run -d --label dvhoc=11 --name dv11-api --restart unless-stopped node:22-alpine node -e "process.exit(1)"</code>; watch <code>RestartCount</code> grow; <code>docker rm -f dv11-api</code>.</li>
</ol>
<p><strong>Done when:</strong> each symptom is matched to its entry number and confirmed by the command in that entry, <code>khoi.sh</code> prints <code>thoat=1</code>, and you can explain why a single <code>docker inspect</code> can show <code>ExitCode=0</code> on a looping container.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Smoke test (kiểm khói)</span><span class="v">A few quick requests after a deploy that prove the new build is the one serving.</span></div>
<div class="kv"><span class="k">Stale build (bản dựng cũ)</span><span class="v">An old image or artifact still running after a "successful" deploy; new routes 404.</span></div>
<div class="kv"><span class="k">Schema drift (lệch lược đồ)</span><span class="v">The database structure no longer matches what the running code expects.</span></div>
<div class="kv"><span class="k">Health check (phép kiểm còn sống)</span><span class="v">A cheap endpoint that deliberately does not touch the database — so it cannot see drift.</span></div>
<div class="kv"><span class="k">Restart policy (chính sách khởi động lại)</span><span class="v"><code>restart: unless-stopped</code> or <code>Restart=on-failure</code>; turns "exits on start" into a loop.</span></div>
<div class="kv"><span class="k">cgroup v2 (nhóm kiểm soát bản 2)</span><span class="v">The kernel&#39;s resource accounting on modern Ubuntu; <code>memory.events</code> records OOM kills per unit.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>"Deployed, nothing changed" is decided by three commands: symlink, <code>/proc/PID/cwd</code>, front door.</li>
<li>A smoke test must include a route new in this release; 401 means mounted, 404 means an old build.</li>
<li><code>/health</code> 200 with every real route 500 is schema drift; the application log names the column.</li>
<li>On cgroup v2 read <code>MemoryPeak</code> and <code>memory.events</code>; the old <code>/sys/fs/cgroup/memory/</code> paths do not exist.</li>
<li>A container loop reads <code>Restarting (N)</code>; trust a growing <code>RestartCount</code>, not one <code>ExitCode</code> reading.</li>
<li>"Nothing changed" usually means "nobody deployed" — ask what changed, and when.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — migrate status and resolve</span><span class="lc-sub">prisma.io/docs/orm/prisma-migrate — the ledger table and what each state means; read before running <code>resolve</code>, never after.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — \$upstream_addr and \$upstream_status</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_upstream_module.html#variables — the log fields that identify which backend served a request, and every backend it tried first.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 9111 §4.2 — Freshness</span><span class="lc-sub">rfc-editor.org/rfc/rfc9111#section-4.2 — why a response already in a browser cache cannot be recalled by the origin, which is the honest answer to entry 6.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Prisma ORM — migrations and the tracking table</span><span class="lc-sub">/courses/prisma-orm/learn${REF} — the columns of the migration ledger, and what a failed migration leaves in each of them.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — Control Group v2</span><span class="lc-sub">docs.kernel.org/admin-guide/cgroup-v2.html — <code>memory.peak</code>, <code>memory.events</code> and its <code>oom_kill</code> counter: the files that replaced the v1 paths.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">docker inspect</span><span class="lc-sub">docs.docker.com/reference/cli/docker/inspect/ — <code>-f</code> Go templates for <code>State</code>, <code>RestartCount</code> and <code>Image</code>, used above.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Sách công thức: lần deploy làm chuyện lạ</h2>
<p class="lead">Mỗi mục dưới đây là một triệu chứng mà khoá này đã ĐO, kèm câu lệnh xác nhận và bài học đã sinh ra con số ấy. Nó là một BẢNG TRA, và nó được viết để đọc TRONG một sự cố chứ không phải trước đó.</p>

<h3>1. Lần deploy báo thành công và chẳng có gì thay đổi</h3>
${slide('dv-11', 13, 'Deploy báo xong mà không đổi: symlink, tiến trình, cửa trước — ba lệnh, năm hàng')}
<pre><code>curl -s http://cua-truoc/ban                       <span class="tok-comment"># nguoi dung thay ban nao</span>
basename "\$(readlink -f /srv/vps/nt/hien-tai)"     <span class="tok-comment"># symlink tro dau</span>
ss -ltnp | grep ':3391 '                            <span class="tok-comment"># tien trinh nao dang giu cong</span></code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">symlink còn CŨ</span><span class="lz-lnote">lần deploy thoát TRƯỚC bước tráo. Đọc nhật ký: bước đánh số nào là bước cuối cùng? (7.5)</span></div>
<div class="lz-layer"><span class="lz-lname">symlink MỚI, tiến trình CŨ</span><span class="lz-lnote">nó chưa bao giờ được khởi động lại. Một tiến trình đang chạy KHÔNG đi theo symlink khi symlink đổi — đây là con bọ trong chính script của tôi (7.5)</span></div>
<div class="lz-layer"><span class="lz-lname">cả hai MỚI, cửa trước CŨ</span><span class="lz-lnote">một bộ đệm. Đo được năm phút ở bài 6.5; dọn rồi kiểm lại</span></div>
<div class="lz-layer"><span class="lz-lname">thoát 0 và KHÔNG có nhật ký nào</span><span class="lz-lnote">script đã TỪ CHỐI và nói ra một cách lặng lẽ — một lời hỏi khi không có terminal thì thoát 0 (7.3)</span></div>
</div>

<p>Hai hàng đầu là thứ đã đo ở bài 11.1: symlink nói <code>v2</code>, <code>/proc/PID/cwd</code> nói <code>v1</code>, và tiến trình khởi động ba giây TRƯỚC lúc link đổi. Chạy ba lệnh — <code>readlink -f</code> trên symlink, <code>readlink /proc/\$PID/cwd</code>, <code>curl</code> vào cửa trước — trước khi đoán; gộp lại chúng chọn hàng giúp bạn.</p>

<h3>2. Một route trả 404 mà hôm qua nó chạy</h3>
${slide('dv-11', 14, 'Kiểm khói: 200/401 là route đã gắn, 404 là ảnh/bản dựng cũ — khoi.sh thoát 1')}
<p>Một bản dựng CŨ hoặc NỬA VỜI: tiến trình khởi động được, <code>/health</code> qua, và một cái router chưa bao giờ được gắn. Bài 7.4 đo cái phép kiểm bắt được nó — một lệnh GET không xác thực trả <strong>401 nghĩa là ĐÃ GẮN</strong>, <strong>404 nghĩa là THIẾU</strong>. Deploy lại sạch sẽ toàn phần là cách chữa; một cú tắt đường <code>--no-build</code> thường là nguyên nhân.</p>

<p>Đo trên VPS thí nghiệm, với <code>/api/v1/lich-moi</code> đóng vai "route mà bản này mới thêm" — bản dựng đang chạy không có nó:</p>
<pre><code class="language-bash"># khoi.sh — 200/401 = route da gan; con lai (404 truoc het) = hong
hong=0
for r in /health /api/v1/bai /api/v1/rieng /api/v1/lich-moi; do
  ma=\$(curl -s -o /dev/null -w '%{http_code}' "https://vidu.local\$r" --cacert /etc/nginx/vidu.crt)
  case \$ma in
    200|401) echo "  ✓ \$r → \$ma" ;;
    *)       echo "  ✗ \$r → \$ma"; hong=1 ;;
  esac
done
exit \$hong</code></pre>
<div class="out">$ bash khoi.sh; echo "thoat=\$?"
  ✓ /health → 200
  ✓ /api/v1/bai → 200
  ✓ /api/v1/rieng → 401
  ✗ /api/v1/lich-moi → 404
thoat=1</div>
<p>Hai chi tiết quyết định. Danh sách phải có ít nhất một route <em>MỚI trong bản này</em>, không thì một bản dựng cũ qua hết mọi dòng. Và phép kiểm cố ý chấp nhận 401: <code>curl -sf</code> sẽ gọi một route cần đăng nhập là "hỏng" ở mọi lần deploy (bài 7.4 đã đo đúng chuyện đó). Đây là bài học 02/07 của dự án thật: một lần deploy <code>--no-build</code> giữ nguyên ảnh cũ, <code>/health</code> xanh, và route GIF trả 404.</p>

<h3>3. Mọi request trả 500 mà /health trả 200</h3>
${slide('dv-11', 15, '/health 200, API 500: đổi tên cột ten → tieu_de, đo lại trên PostgreSQL 16')}
<pre><code>curl -s http://cua-truoc/api/v1/bai | head -c 200
psql -d nt -c "\\d ten_bang"                        <span class="tok-comment"># cot ma ma cu doc CO khong?</span></code></pre>

<p>Đo ở bài 6.2: mã bị lùi lên một lược đồ đã đi tiếp. <code>/health</code> trả lời TRƯỚC khi đụng vào bất cứ thứ gì, nên nó không thể thấy được một cú lệch lược đồ — đó là CHỦ ĐÍCH, không phải một con bọ (9.5). Hoặc lùi cả lược đồ, hoặc đi tới.</p>

<p>Đo trên VPS thí nghiệm: tôi đổi tên đúng cái cột mà mã đang chạy đọc, như một migration của bản mới hơn sẽ làm:</p>
<div class="out">$ psql -d nt -Xqc "alter table bai rename column ten to tieu_de"
$ for r in /health /api/v1/bai; do printf "%-12s " \$r; curl -s -o /dev/null -w "%{http_code}\\n" http://127.0.0.1\$r; done
/health      200
/api/v1/bai  500
$ journalctl -u ung-dung -n 4 -o short-iso
2026-09-29T14:23:40+07:00 vps-thi-nghiem python3[899]: [v2] LOI /api/v1/bai: ERROR:  column "ten" does not exist
2026-09-29T14:23:40+07:00 vps-thi-nghiem python3[899]: LINE 1: select id, ten from bai order by id
2026-09-29T14:23:40+07:00 vps-thi-nghiem python3[899]:                    ^
$ psql -d nt -Xc "\\d bai"
                 Table "public.bai"
 Column  |  Type   | Collation | Nullable | Default
---------+---------+-----------+----------+---------
 id      | integer |           | not null |
 tieu_de | text    |           |          |
Indexes:
    "bai_pkey" PRIMARY KEY, btree (id)</div>
<p>Đọc theo đúng thứ tự bạn sẽ gặp trong sự cố: phép kiểm sức khoẻ XANH, route thật ĐỎ, log ứng dụng gọi đúng tên cột, và <code>\\d</code> cho thấy giờ cột tên là gì. Đổi tên ngược lại (<code>… rename column tieu_de to ten</code>) đưa route về 200 ngay — không cần restart gì, vì mã chưa bao giờ sai; lược đồ đã dịch chuyển dưới chân nó. Ở dự án thật, "đổi ngược lại" là một migration MỚI chứ không phải sửa tay, và chỉ làm được khi chưa có mã mới nào phụ thuộc vào tên mới — đó là lý do Chương 5 đổi tên qua ba lần deploy (mở rộng, chuyển dữ liệu, thu hẹp).</p>

<h3>4. Nó chạy, rồi chết sau vài phút</h3>
<pre><code>dmesg | grep -i 'killed process'
systemctl show ung-dung -p MemoryPeak -p MemoryCurrent       <span class="tok-comment"># cgroup v2 (Ubuntu 22.04+)</span>
cat /sys/fs/cgroup/system.slice/ung-dung.service/memory.events   <span class="tok-comment"># oom_kill &gt; 0 ?</span></code></pre>

<div class="callout warn">
<p><strong>Mã thoát 137 kèm một log ứng dụng RỖNG chính là OOM killer (8.1).</strong> Chẳng thứ gì ứng dụng của bạn ghi ra sẽ nhắc tới nó, vì <code>SIGKILL</code> không bắt được. Hãy kiểm xem có bản dựng nào chạy cùng lúc không — bài 8.2 đo một bản dựng THOÁT 0 trong khi cơ sở dữ liệu bị giết, và 8.5 đo hai bản dựng song song giết nhau dưới cái trần 200 MB.</p>
</div>

<p><strong>Sửa ngày 29/09/2026.</strong> Bản trước của mục này đọc <code>memory.max_usage_in_bytes</code> dưới <code>/sys/fs/cgroup/memory/</code>. Đó là bố cục của cgroup v1; Ubuntu 22.04 trở đi — mọi VPS trong khoá này — dùng cgroup v2, nơi thư mục đó không tồn tại. Thứ tương đương ở v2, đo trên VPS thí nghiệm (ở đó cgroup của unit nằm dưới <code>/sys/fs/cgroup/docker/&lt;id&gt;/…</code> vì chính "VPS" là một container; trên máy chủ thật là <code>/sys/fs/cgroup/system.slice/…</code>):</p>
<div class="out">$ systemctl show ung-dung -p MemoryPeak -p MemoryCurrent
MemoryCurrent=9687040
MemoryPeak=14553088
$ cat /sys/fs/cgroup/…/ung-dung.service/memory.events
low 0
high 0
max 0
oom 0
oom_kill 0
oom_group_kill 0
sock_throttled 0</div>
<p><code>MemoryPeak</code> là mức cao nhất unit từng dùng kể từ khi khởi động; <code>oom_kill</code> đếm số tiến trình của unit này bị nhân hệ điều hành giết. Lớn hơn 0 là câu "vì sao nó chết" đã có lời đáp — và <code>memory.events</code> vẫn còn đó ngay cả khi ứng dụng không kịp ghi gì.</p>

<h3>5. Migration không chịu chạy</h3>
<pre><code>npx prisma migrate status
psql -d nt -c "select * from _prisma_migrations order by started_at desc limit 3;"</code></pre>

<p>Bài 5.4 đo trạng thái NỬA CHỪNG: một migration ba câu lệnh mà câu thứ ba hỏng đã để lại bảng TỒN TẠI, dòng ĐÃ CHÈN, ràng buộc KHÔNG CÓ, và cuốn sổ ghi là chưa-xong — còn chạy lại thì hỏng ở câu SỐ MỘT. <strong>ĐỪNG tự động resolve.</strong> Hãy SOI xem câu lệnh nào thật sự đã áp dụng, quyết định bằng tay, và CHỈ SAU ĐÓ mới đánh dấu cuốn sổ. Đây là chỗ DUY NHẤT trong cả khoá học mà nước đi đúng là DỪNG LẠI và hỏi ai đó.</p>

<h3>6. Website vẫn ổn và MỘT người dùng nói là hỏng</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">bộ đệm trình duyệt của họ</span><span class="lz-t">không lệnh nào với tới</span><span class="lz-d">một trang HTML kèm <code>max-age</code> thì không gọi về được (6.5)</span></div>
<div class="lz-step"><span class="lz-k">DNS của họ</span><span class="lz-t">bản ghi A cũ</span><span class="lz-d">hỏi họ IP mà họ phân giải ra; TTL là khoảng phải chờ</span></div>
<div class="lz-step"><span class="lz-k">DỮ LIỆU của họ</span><span class="lz-t">dòng do bản hỏng ghi</span><span class="lz-d">6.3 đo 240 dòng nhiễm độc sống sót qua một cú lùi sạch sẽ</span></div>
<div class="lz-step"><span class="lz-k">một upstream trong nhiều cái</span><span class="lz-t">nửa vời</span><span class="lz-d">chỉ MỘT SỐ request rơi vào cái hỏng; <code>\$upstream_addr</code> trong log gọi tên nó</span></div>
</div>

<h3>7. Bản container: Restarting, và một mã thoát đọc ra 0</h3>
<p>Với Docker, triệu chứng đổi tên nhưng không đổi hình dạng. Một bản thoát 1 lúc khởi động cộng với <code>restart: unless-stopped</code> thành một vòng lặp vô tận. Đo trên Mac (Docker 29.8, hai lần chạy cùng một container):</p>
<div class="out">$ docker run -d --name dv11-api --restart unless-stopped node:22-alpine \\
    node -e "console.error('thieu DATABASE_URL');process.exit(1)"
$ docker ps -a --filter name=dv11-api --format 'table {{.Names}}\\t{{.Status}}'
NAMES      STATUS
dv11-api   Restarting (1) 1 second ago
$ docker logs --tail 2 dv11-api
thieu DATABASE_URL
thieu DATABASE_URL
$ for i in 1 2 3 4 5 6; do docker inspect -f '{{.State.Status}} Restarting={{.State.Restarting}} ExitCode={{.State.ExitCode}} RestartCount={{.RestartCount}}' dv11-api; sleep 0.7; done
restarting Restarting=true ExitCode=1 RestartCount=5
running Restarting=false ExitCode=0 RestartCount=5
restarting Restarting=true ExitCode=1 RestartCount=6
restarting Restarting=true ExitCode=1 RestartCount=6
restarting Restarting=true ExitCode=1 RestartCount=6
restarting Restarting=true ExitCode=1 RestartCount=6</div>
<p><code>Restarting (1)</code> — số trong ngoặc là mã thoát lần cuối, và <code>docker logs</code> giữ lý do của mọi lần thử. Nhưng nhìn dòng thứ hai của vòng lặp: bị bắt đúng trong tích tắc giữa hai lần thử, container đọc ra <code>running</code> với <code>ExitCode=0</code>. Một lệnh <code>docker inspect</code> sai thời điểm nói "khoẻ". Hãy đọc <code>Status</code> CÙNG với <code>RestartCount</code> — một bộ đếm cứ tăng là vòng lặp, bất kể các trường khác nói gì. Đây là hình dạng của sự cố THẬT ngày 18/08 ở dự án: ảnh dựng trên Alpine (musl) mang engine Prisma dựng cho glibc, build xanh, đẩy xanh, tráo xanh — rồi backend khởi động lại vô tận và <strong>bảy phút 502</strong>. Chương 13 dựng phép kiểm bắt nó TRƯỚC khi đẩy.</p>
<table>
<tr><th>Lệnh</th><th>Trả lời</th></tr>
<tr><td><code>docker compose ps</code></td><td>trạng thái mọi dịch vụ; <code>Restarting</code>, <code>Exited (137)</code>, <code>(unhealthy)</code></td></tr>
<tr><td><code>docker compose logs --tail 30 backend</code></td><td>lý do, từ những lần thử cuối</td></tr>
<tr><td><code>docker inspect -f '{{.RestartCount}} {{.State.OOMKilled}}' X</code></td><td>có đang lặp không; nhân hệ điều hành có giết nó không (11.4)</td></tr>
<tr><td><code>docker inspect -f '{{.Image}}' X</code></td><td>digest ảnh nào ĐANG chạy — bản container của <code>/proc/PID/cwd</code></td></tr>
</table>

<h3>Hai câu hỏi kết thúc phần lớn những mục trên</h3>
${slide('dv-11', 16, '"Chẳng có gì thay đổi" gần như luôn sai: chứng chỉ, đĩa, cron, phía trên, dữ liệu, người khác')}
<div class="kv-grid">
<div class="kv"><span class="k">phiên bản nào THẬT SỰ đang phục vụ?</span><span class="v">từ CỬA TRƯỚC, không phải từ cái máy. Gần một nửa các mục ở trên giải quyết xong ngay đây</span></div>
<div class="kv"><span class="k">cái gì đã đổi, và LÚC NÀO?</span><span class="v">nhật ký deploy có dấu thời gian, git log, và cuốn sổ migration. Ba câu lệnh</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — "chẳng có gì thay đổi" gần như luôn SAI.</strong> Một chứng chỉ hết hạn. Một cái đĩa vượt qua một ngưỡng. Một cron job chạy lần đầu trong tháng. Một nhà cung cấp phía trên vừa deploy. Một cuốn log xoay vòng và có thứ gì đó mở lại một tệp mà lẽ ra không nên. Chương 8 đo một cái đĩa đầy lên CHỈ vì bộ đệm dựng, chẳng ai đụng vào máy. Khi ai đó nói chẳng có gì thay đổi, ý họ là chẳng ai DEPLOY — mà đó là một lời khẳng định NHỎ HƠN nhiều.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> sau lần deploy tối nay, nhóm chat ngập ba lời than khác nhau — "chẳng có gì đổi", "trang đặt lịch 404", "danh sách nào cũng trống và báo lỗi". Dựng lại từng cái trên VPS thí nghiệm và tìm ra nó trong sách công thức dưới một phút.</p>
<ol>
<li>Trỏ <code>hien-tai</code> sang <code>v2</code> mà không restart; chạy ba lệnh và gọi tên hàng của mục 1.</li>
<li>Chạy <code>khoi.sh</code> với một route bản dựng không có; xác nhận nó thoát 1.</li>
<li>Đổi tên <code>bai.ten</code> thành <code>tieu_de</code>; cho thấy <code>/health</code> 200 và <code>/api/v1/bai</code> 500, tìm tên cột trong journal, rồi đổi ngược lại.</li>
<li>Trên laptop: <code>docker run -d --label dvhoc=11 --name dv11-api --restart unless-stopped node:22-alpine node -e "process.exit(1)"</code>; nhìn <code>RestartCount</code> tăng; <code>docker rm -f dv11-api</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> mỗi triệu chứng được ghép đúng số mục và xác nhận bằng lệnh của mục đó, <code>khoi.sh</code> in <code>thoat=1</code>, và bạn giải thích được vì sao MỘT lần <code>docker inspect</code> có thể cho <code>ExitCode=0</code> ở một container đang lặp.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Smoke test (kiểm khói)</span><span class="v">Vài request nhanh sau deploy, chứng minh bản dựng MỚI là bản đang phục vụ.</span></div>
<div class="kv"><span class="k">Stale build (bản dựng cũ)</span><span class="v">Ảnh hoặc tạo tác cũ vẫn chạy sau một lần deploy "thành công"; route mới trả 404.</span></div>
<div class="kv"><span class="k">Schema drift (lệch lược đồ)</span><span class="v">Cấu trúc CSDL không còn khớp với thứ mã đang chạy mong đợi.</span></div>
<div class="kv"><span class="k">Health check (phép kiểm còn sống)</span><span class="v">Một endpoint rẻ, cố ý không đụng CSDL — nên nó không thể thấy lệch lược đồ.</span></div>
<div class="kv"><span class="k">Restart policy (chính sách khởi động lại)</span><span class="v"><code>restart: unless-stopped</code> hoặc <code>Restart=on-failure</code>; biến "thoát lúc khởi động" thành vòng lặp.</span></div>
<div class="kv"><span class="k">cgroup v2 (nhóm kiểm soát bản 2)</span><span class="v">Cách nhân hệ điều hành đếm tài nguyên trên Ubuntu hiện đại; <code>memory.events</code> ghi các cú OOM của từng unit.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>"Deploy xong mà chẳng đổi" được phân xử bằng ba lệnh: symlink, <code>/proc/PID/cwd</code>, cửa trước.</li>
<li>Kiểm khói phải có một route MỚI của bản này; 401 là đã gắn, 404 là bản dựng cũ.</li>
<li><code>/health</code> 200 mà mọi route thật 500 là lệch lược đồ; log ứng dụng gọi đúng tên cột.</li>
<li>Trên cgroup v2 đọc <code>MemoryPeak</code> và <code>memory.events</code>; đường dẫn cũ <code>/sys/fs/cgroup/memory/</code> không tồn tại.</li>
<li>Container lặp hiện <code>Restarting (N)</code>; tin một <code>RestartCount</code> đang tăng, đừng tin một lần đọc <code>ExitCode</code>.</li>
<li>"Chẳng có gì đổi" thường chỉ là "chẳng ai deploy" — hỏi cái gì đã đổi, và lúc nào.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — migrate status và resolve</span><span class="lc-sub">prisma.io/docs/orm/prisma-migrate — bảng sổ ghi và ý nghĩa từng trạng thái; đọc TRƯỚC khi chạy <code>resolve</code>, đừng bao giờ sau.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — \$upstream_addr và \$upstream_status</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_upstream_module.html#variables — những trường log nhận diện backend nào đã phục vụ một request, và mọi backend nó đã thử trước đó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 9111 §4.2 — Freshness</span><span class="lc-sub">rfc-editor.org/rfc/rfc9111#section-4.2 — vì sao một bản trả lời đã nằm trong bộ đệm trình duyệt thì máy chủ gốc không gọi về được, và đó là câu trả lời thành thật cho mục số 6.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Prisma ORM — migration và bảng theo dõi</span><span class="lc-sub">/courses/prisma-orm/learn${REF} — các cột của cuốn sổ migration, và một migration hỏng để lại gì trong từng cột.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — Control Group v2</span><span class="lc-sub">docs.kernel.org/admin-guide/cgroup-v2.html — <code>memory.peak</code>, <code>memory.events</code> và bộ đếm <code>oom_kill</code> của nó: những tệp thay cho đường dẫn v1.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">docker inspect</span><span class="lc-sub">docs.docker.com/reference/cli/docker/inspect/ — mẫu Go của <code>-f</code> cho <code>State</code>, <code>RestartCount</code> và <code>Image</code>, dùng ở trên.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 11.4 ─────────────────────────── */
    {
      title: '11.4 — Recipe book: slow, full, or dying|||11.4 — Sách công thức: chậm, đầy, hoặc đang chết',
      slug: 'deploy-11-4-cong-thuc-tai-nguyen',
      type: 'VIDEO',
      description: 'Bốn triệu chứng tài nguyên, mỗi cái kèm câu lệnh phân biệt được nó với ba cái kia. Kể cả cái ca khó chịu nhất: đĩa báo 100% mà xoá không giải phóng được byte nào.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>Recipe book: slow, full, or dying</h2>
<p class="lead">Resource problems all present the same way — the site is slow, or intermittently broken — and they need completely different fixes. The commands below are chosen to separate them in as few steps as possible.</p>

<h3>Everything is slow</h3>
${slide('dv-11', 18, 'vmstat: dòng đầu là trung bình từ lúc khởi động — 14 vòng yes trên 10 nhân')}
<pre><code>vmstat 1 5           <span class="tok-comment"># cot r, si/so, wa — mot lenh loai duoc ba kha nang</span>
<span class="tok-comment"># DONG DAU la trung binh tu luc khoi dong — BO QUA no</span></code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">r (runnable) &gt; cores, wa low</span><span class="lz-lnote">CPU-bound. Something is computing. 9.1 measured why load average will not tell you this for another minute</span></div>
<div class="lz-layer"><span class="lz-lname">si/so moving constantly</span><span class="lz-lnote">swap thrashing. 8.3 measured 56–66 ms against 0.14 ms for the same reads — the process is alive and unusable</span></div>
<div class="lz-layer"><span class="lz-lname">wa high, r low</span><span class="lz-lnote">waiting on disk. A slow query, a backup running, or a failing disk</span></div>
<div class="lz-layer"><span class="lz-lname">everything low and it is still slow</span><span class="lz-lnote">not this machine. An external call with no timeout, a locked table, or <code>steal</code> — check field 8 of <code>/proc/stat</code> (9.1)</span></div>
</div>

<h3>Measured: the first line lies, the rest do not</h3>
<p>On the lab VPS (10 cores) idle, then with 14 busy loops started two seconds earlier:</p>
<div class="out">$ nproc; vmstat 1 3
10
procs -----------memory---------- ---swap-- -----io---- -system-- -------cpu-------
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st gu
 0  0 515948 235740 182344 5131724   11   18   670   474 1172    1  1  0 99  0  0  0
 0  0 515948 235244 182344 5132024    0    0     0   256  923  877  1  0 99  0  0  0
 1  0 515948 235244 182344 5132240    0    0     0  1100  865  820  0  0 99  0  0  0
$ for i in \$(seq 14); do timeout 12 yes &gt;/dev/null &amp; done; sleep 2; vmstat 1 4
procs -----------memory---------- ---swap-- -----io---- -system-- -------cpu-------
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st gu
16  0 515948 231788 182344 5132696   11   18   670   474 1173    1  1  0 99  0  0  0
14  0 515948 231556 182352 5132920    0    0     0   356 5235 1536 28 72  0  0  0  0
14  0 515948 231324 182352 5133152    0    0     0   260 5030 1538 28 72  0  0  0  0
31  0 515948 230864 182352 5133384    0    0     0   256 3757 1108 31 69  0  0  0  0</div>
<p>The first line of the second run says <code>id 99</code> — idle — while fourteen loops are already running, because it is the average since boot. From the second line on the truth appears: <code>r</code> 14–31 against 10 cores, <code>id 0</code>, <code>wa 0</code> — CPU-bound, and not waiting on disk. (<code>sy</code> 72 is high because <code>yes</code> into <code>/dev/null</code> is almost all system calls; a real application would show mostly <code>us</code>.) The memory columns here are the whole Docker Desktop VM, not a real VPS, which is why they barely move. Every column, once:</p>
<table>
<tr><th>Column</th><th>Means</th><th>Worry when</th></tr>
<tr><td><code>r</code> / <code>b</code></td><td>tasks runnable (running or waiting for a CPU) / blocked in uninterruptible sleep, usually on disk</td><td><code>r</code> stays above the core count; <code>b</code> is not 0</td></tr>
<tr><td><code>swpd</code>, <code>free</code>, <code>buff</code>, <code>cache</code></td><td>KiB of swap used, idle RAM, buffers, page cache</td><td>not <code>free</code> alone — <code>cache</code> is reclaimable; read <code>MemAvailable</code> (8.1)</td></tr>
<tr><td><code>si</code> / <code>so</code></td><td>KiB/s swapped in / out</td><td>both non-zero second after second: thrashing (8.3)</td></tr>
<tr><td><code>bi</code> / <code>bo</code></td><td>blocks/s read from / written to disk</td><td>high together with <code>wa</code></td></tr>
<tr><td><code>in</code> / <code>cs</code></td><td>interrupts / context switches per second</td><td>a sudden jump with no traffic change</td></tr>
<tr><td><code>us sy id wa st</code></td><td>% CPU in user code, kernel, idle, waiting on I/O, stolen by the hypervisor</td><td><code>id</code> near 0; <code>st</code> of a few % on a cheap VPS (9.1)</td></tr>
<tr><td><code>gu</code></td><td>% running guest VMs (new in procps-ng 4)</td><td>ignore on a VPS</td></tr>
</table>

<p>Then narrow by percentile, not by average — 9.2 measured a mean of 60.8 ms hiding a p95 of 900.8 ms:</p>

<pre><code>awk '{print \$3}' truy-cap.log | sort -n | awk '{a[NR]=\$1}
  END{printf "p50=%.0fms p95=%.0fms p99=%.0fms\\n", a[int(NR*.5)]*1000, a[int(NR*.95)]*1000, a[int(NR*.99)]*1000}'</code></pre>

<h3>The database is slow</h3>
<pre><code>psql -c "select pid, now()-query_start as lau, wait_event_type, left(query,60)
         from pg_stat_activity where state='active' order by lau desc limit 5;"
psql -c "select count(*) from pg_locks where not granted;"</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">one very old query</span><span class="lz-t">a scan or a lock</span><span class="lz-d">read it. Chapter 5 measured a 2,606 ms ALTER blocking 5 of 60 writes</span></div>
<div class="lz-step"><span class="lz-k">many identical queries</span><span class="lz-t">N+1 or a retry storm</span><span class="lz-d">the application is asking the same thing repeatedly</span></div>
<div class="lz-step"><span class="lz-k">ungranted locks</span><span class="lz-t">something is blocking</span><span class="lz-d">usually a migration without <code>lock_timeout</code> (5.3)</span></div>
<div class="lz-step"><span class="lz-k">nothing active, still slow</span><span class="lz-t">the pool is exhausted</span><span class="lz-d">requests are queued in the app, not in the database</span></div>
</div>

<p>And if it started immediately after a restore, check statistics before anything else — 10.2 measured the same query at 2.5× slower with the planner estimating 834 rows instead of 124,946, purely because <code>ANALYZE</code> had not run.</p>

<h3>The disk is full</h3>
${slide('dv-11', 19, 'Đĩa 90% mà du nói 0: tệp đã xoá còn mở — lsof +L1, cắt cụt qua /proc')}
${slide('dv-11', 20, 'Còn 40M trống mà ENOSPC: cạn inode — df -h và df -i')}
<pre><code>df -h; df -i                    <span class="tok-comment"># HAI lenh: khoi va inode can hoan toan khac nhau</span>
lsof -nP +L1 | head             <span class="tok-comment"># tep DA XOA ma con mo</span>
du -sh /var/log/* /srv/*/ban/* 2>/dev/null | sort -h | tail -5</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">df -h full, df -i fine</span><span class="lz-lnote">blocks exhausted. Delete or truncate something large. 8.4 measured recovery at 8 ms</span></div>
<div class="lz-layer"><span class="lz-lname">df -i full, df -h fine</span><span class="lz-lnote">inodes exhausted. 8.4 measured 162 MB free and still <code>ENOSPC</code>. Delete <em>many</em> files; size is irrelevant</span></div>
<div class="lz-layer"><span class="lz-lname">df full, du does not agree</span><span class="lz-lnote">a deleted file still held open. 8.4 measured a 100 MB gap; <code>: &gt; /proc/&lt;pid&gt;/fd/N</code> recovered it with no restart</span></div>
<div class="lz-layer"><span class="lz-lname">nothing large anywhere</span><span class="lz-lnote">the 5% root reserve is what you are inside. <code>tune2fs -l</code> shows it (8.4)</span></div>
</div>

<h3>Measured: two disks that are full without being full</h3>
<p>Two small filesystems on the lab VPS: <code>/srv/log-app</code> (tmpfs, 40 MB) and <code>/srv/tai-len</code> (tmpfs, 40 MB but only 2,000 inodes — <code>mount -t tmpfs -o size=40m,nr_inodes=2000</code>). A process writes 36 MB of "log" and keeps the file open; someone deletes it. Then an upload folder fills with small files:</p>
<div class="out">$ (head -c 36M /dev/zero; exec sleep 600) &gt; /srv/log-app/app.log &amp;
$ rm /srv/log-app/app.log
$ df -h /srv/log-app ; du -sh /srv/log-app
tmpfs            40M   36M  4.0M  90% /srv/log-app
0	/srv/log-app
$ lsof -nP +L1 | grep -E "COMMAND|deleted"
COMMAND  PID   USER   FD   TYPE DEVICE SIZE/OFF NLINK NODE NAME
sleep   1114 deploy    1w   REG  0,179 37748736     0    3 /srv/log-app/app.log (deleted)
$ : &gt; /proc/1114/fd/1
$ df -h /srv/log-app
tmpfs            40M     0   40M   0% /srv/log-app</div>
<div class="out">$ cd /srv/tai-len; i=0; while touch anh-\$i.jpg 2&gt;/tmp/loi; do i=\$((i+1)); done
$ echo "tao duoc \$i tep, roi: \$(cat /tmp/loi)"
tao duoc 1999 tep, roi: touch: cannot touch 'anh-1999.jpg': No space left on device
$ df -h /srv/tai-len ; df -i /srv/tai-len
tmpfs            40M     0   40M   0% /srv/tai-len
tmpfs            2000  2000     0  100% /srv/tai-len</div>
<p>First case: <code>df</code> 90%, <code>du</code> 0 — the name is gone, the inode is not, because <code>sleep</code> (PID 1114) still holds it on file descriptor 1. <code>lsof +L1</code> lists open files with a link count below 1, which is exactly "deleted but open"; truncating through <code>/proc/1114/fd/1</code> gave all 36 MB back with no restart. Second case: 40 MB free, 0% used — and <code>No space left on device</code> after 1,999 files, because the one inode left went to the root directory. Same error text, opposite fixes, and only <code>df -i</code> tells them apart.</p>
<div class="callout warn">
<p><strong>The instinct that fails here.</strong> <code>rm big.log</code> on a file a process still has open frees exactly zero bytes — <code>du</code> now shows the space as gone and <code>df</code> still says full. Truncate instead: <code>: &gt; big.log</code>. This is the single most confusing disk situation, and 8.4 measured both the symptom and both fixes.</p>
</div>

<h3>It keeps restarting</h3>
${slide('dv-11', 21, 'Mã thoát kể chuyện: 137 OOM, 134 hết heap, 139 khi node là PID 1, 1 thiếu cấu hình')}
<pre><code>dmesg | grep -i 'killed process' | tail -3
systemctl status ung-dung | head -20
grep oom_kill /sys/fs/cgroup/system.slice/ung-dung.service/memory.events   <span class="tok-comment"># cgroup v2</span></code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">exit 137, empty app log</span><span class="v">OOM killer. Check what else ran at that moment — 8.2 measured the culprit exiting 0 while the victim died</span></div>
<div class="kv"><span class="k">exit 134 with a stack trace</span><span class="v">V8 heap limit — a <em>better</em> outcome, because it tells you where. Set <code>--max-old-space-size</code> below the cgroup limit to convert 137 into 134 (8.5)</span></div>
<div class="kv"><span class="k">exit 1 immediately on start</span><span class="v">missing config. 6.1 measured an artifact rollback leaving a renamed env var undefined</span></div>
<div class="kv"><span class="k">restarting every few seconds</span><span class="v">a restart loop making things worse each cycle. Stop it, then diagnose — <code>StartLimitBurst</code> exists for this (8.2)</span></div>
</div>

<h3>Measured: 137, 134 — and a 139 nobody expects</h3>
<p>The exit codes in the table above, reproduced with Docker 29.8 on the Mac and <code>node:22-alpine</code> (Node v22.23.2): a container whose memory is capped at 64 MB allocating 1 MB buffers forever, and a Node process whose V8 heap is capped at 32 MB filling it with objects.</p>
<div class="out">$ docker run --name dv11-oom --memory 64m --memory-swap 64m node:22-alpine \\
    node -e "const a=[];for(;;)a.push(Buffer.alloc(1e6,1))"; echo "thoat=\$?"
thoat=137
$ docker inspect -f 'OOMKilled={{.State.OOMKilled}} ExitCode={{.State.ExitCode}}' dv11-oom
OOMKilled=true ExitCode=137
$ docker logs dv11-oom 2&gt;&amp;1 | wc -l
       0
$ for i in 1 2; do docker run --rm --memory 256m node:22-alpine node --max-old-space-size=32 \\
    -e "const a=[];for(;;)a.push({x:Math.random(),y:'c'+Math.random()})" &gt;/dev/null 2&gt;&amp;1; echo "PID1: thoat=\$?"; done
PID1: thoat=139
PID1: thoat=139
$ docker run --rm --init --memory 256m node:22-alpine node --max-old-space-size=32 -e "…" &gt;/dev/null 2&gt;&amp;1; echo "--init: thoat=\$?"
--init: thoat=134
$ docker run --memory 256m node:22-alpine sh -c 'node --max-old-space-size=32 -e "…" &gt;/dev/null 2&gt;&amp;1; echo node-thoat=\$?'
node-thoat=134</div>
<p>137 and <code>OOMKilled=true</code>, with a log of zero lines — exactly Lesson 8.1. But the heap limit, which 8.5 says turns 137 into a helpful 134, gave <strong>139</strong> (128+11, SIGSEGV) twice when node was the container&#39;s first process, and 134 (128+6, SIGABRT) as soon as it was not — under <code>--init</code>, or under <code>sh</code>. The 139 run still printed V8&#39;s own "FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory" first — so the heap limit did its job; only the way the process ended changed. The reason is PID 1: Linux does not deliver a signal whose action is the default to the init process of a PID namespace (pid_namespaces(7) documents this for signals from other processes; measured here, <code>abort()</code>&#39;s own SIGABRT is dropped the same way), so abort falls back to crashing the process outright.</p>
<div class="pitfall co-tieu-de"><p><strong>Do not read 139 as "a native module crashed" before checking PID 1.</strong> In a container, run Node under an init — <code>docker run --init</code>, or <code>init: true</code> in Compose — and the heap-limit exit becomes the documented 134 again. It also fixes the two older PID-1 problems: signals like SIGTERM being ignored without a handler, and zombie processes nobody reaps (Linux &amp; Bash, Chapter 12).</p></div>

<h3>The order to check in</h3>
${slide('dv-11', 17, 'Thứ tự kiểm: đĩa → RAM → bão hoà → CSDL, và chỗ của Linux Chương 12')}
<p>Because these interact, and checking in the wrong order wastes the most time:</p>
<p>This order is the deploy-sized version. The full machine diagnosis — the read-only 60-second sweep, the dead/slow/strange tree, <code>namei</code> for permissions, CRLF in scripts, zombies, clock and certificate problems — is <strong>Linux &amp; Bash, Chapter 12</strong>; open it when the four checks below come back clean and the machine still misbehaves.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1. disk</span><span class="lz-t">df -h; df -i</span><span class="lz-d">two lines, and a full disk explains a startling variety of unrelated errors</span></div>
<div class="lz-step"><span class="lz-k">2. memory</span><span class="lz-t">dmesg | grep -i oom</span><span class="lz-d">one line, and it is the failure your logs cannot show you</span></div>
<div class="lz-step"><span class="lz-k">3. saturation</span><span class="lz-t">vmstat 1 5</span><span class="lz-d">separates CPU from swap from I/O in one command</span></div>
<div class="lz-step"><span class="lz-k">4. the database</span><span class="lz-t">pg_stat_activity</span><span class="lz-d">only once the machine itself is ruled out</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — the resource that is exhausted is often not the one that broke.</strong> A full disk stops the database writing, and the symptom is 500s from the application. Memory pressure evicts the page cache, and the symptom is slow queries. Chapter 8 measured a build filling a disk shared with PostgreSQL and a build triggering an OOM kill of the database — in both, the visible failure was the database and the cause was a build. Check the machine before you tune the application.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the demo server "is slow and then the upload page says the disk is full", and a teammate has already deleted the biggest log file without effect. Reproduce both disks and a CPU saturation on the lab VPS, and fix each without restarting anything.</p>
<ol>
<li>Start 14 <code>yes</code> loops with <code>timeout 12</code> and run <code>vmstat 1 4</code>; circle the first line and say why you ignore it.</li>
<li><code>sudo mount -t tmpfs -o size=40m tmpfs /srv/log-app</code>, write 36 MB through a process that stays open, delete the file, recover the space with <code>lsof +L1</code> and <code>/proc/PID/fd</code>.</li>
<li>Mount a second tmpfs with <code>nr_inodes=2000</code>, fill it with <code>touch</code>, and show <code>df -h</code> and <code>df -i</code> side by side.</li>
<li>On your laptop, run the three Node containers above (label them <code>dvhoc=11</code>) and explain 137, 139 and 134.</li>
</ol>
<p><strong>Done when:</strong> <code>df -h /srv/log-app</code> is back to 0% with the writing process still alive, you can say which of the four disk cases each mount was, and you can explain why the same heap limit gave 139 and 134.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Saturation (bão hoà)</span><span class="v">A resource with more work queued than it can serve: <code>r</code> above the core count.</span></div>
<div class="kv"><span class="k">Page cache (bộ đệm trang)</span><span class="v">RAM the kernel uses for file data and gives back on demand — not "used" memory.</span></div>
<div class="kv"><span class="k">Inode (nút chỉ mục tệp)</span><span class="v">One per file; a filesystem can run out of them with blocks to spare.</span></div>
<div class="kv"><span class="k">File descriptor (bộ mô tả tệp)</span><span class="v">A process&#39;s handle on an open file; keeps a deleted file alive.</span></div>
<div class="kv"><span class="k">OOM killer (bộ giết khi hết bộ nhớ)</span><span class="v">The kernel ending a process with SIGKILL — exit 137, nothing in the app log.</span></div>
<div class="kv"><span class="k">PID 1 / init (tiến trình đầu tiên)</span><span class="v">In a container, your app unless you add <code>--init</code>; default-action signals do not reach it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Check in order: disk, memory, saturation, database — the exhausted resource is often not the broken one.</li>
<li><code>vmstat</code>&#39;s first line is the average since boot; read from the second.</li>
<li><code>df</code> full and <code>du</code> small is a deleted file still open: <code>lsof +L1</code>, then truncate through <code>/proc/PID/fd</code>.</li>
<li>Space left and ENOSPC is inode exhaustion; always run <code>df -h</code> and <code>df -i</code> together.</li>
<li>137 is the OOM killer; the heap limit gives 134 — or 139 when node is PID 1, so run it with <code>--init</code>.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">vmstat(8) and iostat(1)</span><span class="lc-sub">man 8 vmstat — the <code>r</code>, <code>si</code>/<code>so</code> and <code>wa</code> columns, and the warning that the first line is an average since boot.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_stat_activity and pg_locks</span><span class="lc-sub">postgresql.org/docs/current/monitoring-stats.html — <code>wait_event_type</code> in particular tells you whether a query is running or waiting, which are very different problems.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Brendan Gregg — Linux Performance Analysis in 60 Seconds</span><span class="lc-sub">netflixtechblog.com/linux-performance-analysis-in-60-000-milliseconds — ten commands in a deliberate order; this lesson is a smaller version aimed at one VPS.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">lsof(8) — the +L flag</span><span class="lc-sub">man 8 lsof — <code>+L1</code> for deleted-but-open files, the command behind the third disk case.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — locks, waits and slow queries</span><span class="lc-sub">/courses/postgresql/learn${REF} — reading <code>pg_locks</code>, and which operations take which lock level.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">pid_namespaces(7)</span><span class="lc-sub">man7.org/linux/man-pages/man7/pid_namespaces.7.html — why the init process of a namespace only receives signals it has a handler for; the root of the 139.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">docker container run — --init</span><span class="lc-sub">docs.docker.com/reference/cli/docker/container/run/ — runs a tiny init as PID 1 that forwards signals and reaps zombies.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>Sách công thức: chậm, đầy, hoặc đang chết</h2>
<p class="lead">Các vấn đề tài nguyên đều hiện ra GIỐNG NHAU — website chậm, hoặc hỏng lúc được lúc không — và chúng cần những cách chữa hoàn toàn khác nhau. Các câu lệnh dưới đây được chọn để TÁCH chúng ra trong ít bước nhất có thể.</p>

<h3>Mọi thứ đều chậm</h3>
${slide('dv-11', 18, 'vmstat: dòng đầu là trung bình từ lúc khởi động — 14 vòng yes trên 10 nhân')}
<pre><code>vmstat 1 5           <span class="tok-comment"># cot r, si/so, wa — mot lenh loai duoc ba kha nang</span>
<span class="tok-comment"># DONG DAU la trung binh tu luc khoi dong — BO QUA no</span></code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">r (chạy được) &gt; số nhân, wa thấp</span><span class="lz-lnote">nghẽn CPU. Có thứ gì đó đang tính. Bài 9.1 đo vì sao load average sẽ chưa nói cho bạn biết chuyện này thêm cả một phút nữa</span></div>
<div class="lz-layer"><span class="lz-lname">si/so chạy liên tục</span><span class="lz-lnote">quẫy đạp swap. Bài 8.3 đo 56–66 ms so với 0,14 ms cho cùng phép đọc — tiến trình đang SỐNG và KHÔNG DÙNG ĐƯỢC</span></div>
<div class="lz-layer"><span class="lz-lname">wa cao, r thấp</span><span class="lz-lnote">đang CHỜ ĐĨA. Một truy vấn chậm, một bản sao lưu đang chạy, hoặc một cái đĩa sắp hỏng</span></div>
<div class="lz-layer"><span class="lz-lname">mọi thứ đều thấp mà vẫn chậm</span><span class="lz-lnote">KHÔNG phải cái máy này. Một lời gọi ra ngoài không có hạn giờ, một cái bảng bị khoá, hoặc <code>steal</code> — kiểm trường số 8 của <code>/proc/stat</code> (9.1)</span></div>
</div>

<h3>Đo thật: dòng đầu nói dối, các dòng sau thì không</h3>
<p>Trên VPS thí nghiệm (10 nhân) lúc rảnh, rồi với 14 vòng lặp bận được khởi động trước đó hai giây:</p>
<div class="out">$ nproc; vmstat 1 3
10
procs -----------memory---------- ---swap-- -----io---- -system-- -------cpu-------
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st gu
 0  0 515948 235740 182344 5131724   11   18   670   474 1172    1  1  0 99  0  0  0
 0  0 515948 235244 182344 5132024    0    0     0   256  923  877  1  0 99  0  0  0
 1  0 515948 235244 182344 5132240    0    0     0  1100  865  820  0  0 99  0  0  0
$ for i in \$(seq 14); do timeout 12 yes &gt;/dev/null &amp; done; sleep 2; vmstat 1 4
procs -----------memory---------- ---swap-- -----io---- -system-- -------cpu-------
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st gu
16  0 515948 231788 182344 5132696   11   18   670   474 1173    1  1  0 99  0  0  0
14  0 515948 231556 182352 5132920    0    0     0   356 5235 1536 28 72  0  0  0  0
14  0 515948 231324 182352 5133152    0    0     0   260 5030 1538 28 72  0  0  0  0
31  0 515948 230864 182352 5133384    0    0     0   256 3757 1108 31 69  0  0  0  0</div>
<p>Dòng đầu của lần chạy thứ hai nói <code>id 99</code> — rảnh — trong khi mười bốn vòng lặp đã chạy, vì nó là trung bình KỂ TỪ LÚC KHỞI ĐỘNG. Từ dòng thứ hai sự thật mới hiện ra: <code>r</code> 14–31 so với 10 nhân, <code>id 0</code>, <code>wa 0</code> — nghẽn CPU, và không phải chờ đĩa. (<code>sy</code> 72 cao vì <code>yes</code> đổ vào <code>/dev/null</code> gần như chỉ toàn lời gọi hệ thống; một ứng dụng thật sẽ nghiêng về <code>us</code>.) Các cột bộ nhớ ở đây là của cả máy ảo Docker Desktop chứ không phải một VPS thật, nên chúng hầu như đứng yên. Mọi cột, một lần cho xong:</p>
<table>
<tr><th>Cột</th><th>Nghĩa</th><th>Đáng lo khi</th></tr>
<tr><td><code>r</code> / <code>b</code></td><td>số tác vụ chạy được (đang chạy hoặc chờ CPU) / bị chặn trong giấc ngủ không ngắt được, thường là chờ đĩa</td><td><code>r</code> cứ lớn hơn số nhân; <code>b</code> khác 0</td></tr>
<tr><td><code>swpd</code>, <code>free</code>, <code>buff</code>, <code>cache</code></td><td>KiB swap đã dùng, RAM rảnh, bộ đệm, page cache</td><td>đừng nhìn riêng <code>free</code> — <code>cache</code> lấy lại được; đọc <code>MemAvailable</code> (8.1)</td></tr>
<tr><td><code>si</code> / <code>so</code></td><td>KiB/giây đổi vào / ra swap</td><td>cả hai khác 0 giây này qua giây khác: quẫy swap (8.3)</td></tr>
<tr><td><code>bi</code> / <code>bo</code></td><td>khối/giây đọc từ / ghi xuống đĩa</td><td>cao cùng lúc với <code>wa</code></td></tr>
<tr><td><code>in</code> / <code>cs</code></td><td>số ngắt / số lần chuyển ngữ cảnh mỗi giây</td><td>nhảy vọt mà lưu lượng không đổi</td></tr>
<tr><td><code>us sy id wa st</code></td><td>% CPU chạy mã người dùng, nhân, rảnh, chờ I/O, bị hypervisor "ăn cắp"</td><td><code>id</code> gần 0; <code>st</code> vài % trên VPS rẻ (9.1)</td></tr>
<tr><td><code>gu</code></td><td>% chạy máy ảo khách (mới có từ procps-ng 4)</td><td>bỏ qua trên VPS</td></tr>
</table>

<p>Rồi thu hẹp bằng PHÂN VỊ, không phải bằng trung bình — bài 9.2 đo một cái trung bình 60,8 ms giấu đi một p95 là 900,8 ms:</p>

<pre><code>awk '{print \$3}' truy-cap.log | sort -n | awk '{a[NR]=\$1}
  END{printf "p50=%.0fms p95=%.0fms p99=%.0fms\\n", a[int(NR*.5)]*1000, a[int(NR*.95)]*1000, a[int(NR*.99)]*1000}'</code></pre>

<h3>Cơ sở dữ liệu chậm</h3>
<pre><code>psql -c "select pid, now()-query_start as lau, wait_event_type, left(query,60)
         from pg_stat_activity where state='active' order by lau desc limit 5;"
psql -c "select count(*) from pg_locks where not granted;"</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">một truy vấn RẤT cũ</span><span class="lz-t">một lần quét hoặc một cái khoá</span><span class="lz-d">đọc nó. Chương 5 đo một câu ALTER 2.606 ms chặn 5 trên 60 lệnh ghi</span></div>
<div class="lz-step"><span class="lz-k">nhiều truy vấn GIỐNG HỆT nhau</span><span class="lz-t">N+1 hoặc bão thử lại</span><span class="lz-d">ứng dụng đang hỏi cùng một thứ lặp đi lặp lại</span></div>
<div class="lz-step"><span class="lz-k">khoá chưa được cấp</span><span class="lz-t">có thứ đang chặn</span><span class="lz-d">thường là một migration thiếu <code>lock_timeout</code> (5.3)</span></div>
<div class="lz-step"><span class="lz-k">không có gì đang chạy, vẫn chậm</span><span class="lz-t">bể kết nối đã cạn</span><span class="lz-d">các request đang xếp hàng TRONG ỨNG DỤNG, không phải trong cơ sở dữ liệu</span></div>
</div>

<p>Và nếu nó bắt đầu NGAY sau một cú phục hồi, hãy kiểm THỐNG KÊ trước mọi thứ khác — bài 10.2 đo cùng một truy vấn chậm hơn 2,5 lần với bộ lập kế hoạch ước lượng 834 dòng thay vì 124.946, chỉ vì <code>ANALYZE</code> chưa chạy.</p>

<h3>Đĩa đầy</h3>
${slide('dv-11', 19, 'Đĩa 90% mà du nói 0: tệp đã xoá còn mở — lsof +L1, cắt cụt qua /proc')}
${slide('dv-11', 20, 'Còn 40M trống mà ENOSPC: cạn inode — df -h và df -i')}
<pre><code>df -h; df -i                    <span class="tok-comment"># HAI lenh: khoi va inode can hoan toan khac nhau</span>
lsof -nP +L1 | head             <span class="tok-comment"># tep DA XOA ma con mo</span>
du -sh /var/log/* /srv/*/ban/* 2>/dev/null | sort -h | tail -5</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">df -h đầy, df -i ổn</span><span class="lz-lnote">cạn KHỐI. Xoá hoặc cắt cụt thứ gì đó lớn. Bài 8.4 đo việc phục hồi mất 8 ms</span></div>
<div class="lz-layer"><span class="lz-lname">df -i đầy, df -h ổn</span><span class="lz-lnote">cạn INODE. Bài 8.4 đo còn 162 MB trống mà vẫn <code>ENOSPC</code>. Xoá NHIỀU tệp; kích thước không liên quan</span></div>
<div class="lz-layer"><span class="lz-lname">df đầy, du không đồng ý</span><span class="lz-lnote">một tệp đã xoá còn bị giữ mở. Bài 8.4 đo một khoảng chênh 100 MB; <code>: &gt; /proc/&lt;pid&gt;/fd/N</code> lấy lại được mà không cần khởi động lại</span></div>
<div class="lz-layer"><span class="lz-lname">chẳng có gì lớn ở đâu cả</span><span class="lz-lnote">bạn đang nằm trong phần 5% dự trữ cho root. <code>tune2fs -l</code> cho xem (8.4)</span></div>
</div>

<h3>Đo thật: hai cái đĩa đầy mà không đầy</h3>
<p>Hai hệ tệp nhỏ trên VPS thí nghiệm: <code>/srv/log-app</code> (tmpfs, 40 MB) và <code>/srv/tai-len</code> (tmpfs, 40 MB nhưng chỉ có 2.000 inode — <code>mount -t tmpfs -o size=40m,nr_inodes=2000</code>). Một tiến trình ghi 36 MB "log" và giữ tệp mở; có người xoá nó. Rồi một thư mục tải lên đầy những tệp nhỏ:</p>
<div class="out">$ (head -c 36M /dev/zero; exec sleep 600) &gt; /srv/log-app/app.log &amp;
$ rm /srv/log-app/app.log
$ df -h /srv/log-app ; du -sh /srv/log-app
tmpfs            40M   36M  4.0M  90% /srv/log-app
0	/srv/log-app
$ lsof -nP +L1 | grep -E "COMMAND|deleted"
COMMAND  PID   USER   FD   TYPE DEVICE SIZE/OFF NLINK NODE NAME
sleep   1114 deploy    1w   REG  0,179 37748736     0    3 /srv/log-app/app.log (deleted)
$ : &gt; /proc/1114/fd/1
$ df -h /srv/log-app
tmpfs            40M     0   40M   0% /srv/log-app</div>
<div class="out">$ cd /srv/tai-len; i=0; while touch anh-\$i.jpg 2&gt;/tmp/loi; do i=\$((i+1)); done
$ echo "tao duoc \$i tep, roi: \$(cat /tmp/loi)"
tao duoc 1999 tep, roi: touch: cannot touch 'anh-1999.jpg': No space left on device
$ df -h /srv/tai-len ; df -i /srv/tai-len
tmpfs            40M     0   40M   0% /srv/tai-len
tmpfs            2000  2000     0  100% /srv/tai-len</div>
<p>Ca thứ nhất: <code>df</code> 90%, <code>du</code> 0 — cái TÊN đã mất, inode thì chưa, vì <code>sleep</code> (PID 1114) vẫn giữ nó ở bộ mô tả tệp số 1. <code>lsof +L1</code> liệt kê các tệp đang mở có số liên kết nhỏ hơn 1, đúng nghĩa "đã xoá mà còn mở"; cắt cụt qua <code>/proc/1114/fd/1</code> trả lại đủ 36 MB mà không cần khởi động lại. Ca thứ hai: trống 40 MB, dùng 0% — vậy mà <code>No space left on device</code> sau 1.999 tệp, vì inode còn lại cuối cùng đã thuộc về thư mục gốc. Cùng một câu lỗi, hai cách chữa ngược nhau, và chỉ <code>df -i</code> phân biệt được.</p>
<div class="callout warn">
<p><strong>Cái phản xạ HỎNG ở đây.</strong> <code>rm big.log</code> trên một tệp mà một tiến trình vẫn đang mở sẽ giải phóng đúng KHÔNG byte — <code>du</code> giờ báo chỗ đó đã đi rồi còn <code>df</code> vẫn nói đầy. Hãy CẮT CỤT thay vào đó: <code>: &gt; big.log</code>. Đây là tình huống đĩa gây rối trí nhất, và bài 8.4 đã đo cả triệu chứng lẫn cả hai cách chữa.</p>
</div>

<h3>Nó cứ khởi động lại</h3>
${slide('dv-11', 21, 'Mã thoát kể chuyện: 137 OOM, 134 hết heap, 139 khi node là PID 1, 1 thiếu cấu hình')}
<pre><code>dmesg | grep -i 'killed process' | tail -3
systemctl status ung-dung | head -20
grep oom_kill /sys/fs/cgroup/system.slice/ung-dung.service/memory.events   <span class="tok-comment"># cgroup v2</span></code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">thoát 137, log ứng dụng rỗng</span><span class="v">OOM killer. Kiểm xem còn gì chạy vào đúng khoảnh khắc đó — bài 8.2 đo thủ phạm THOÁT 0 trong khi nạn nhân chết</span></div>
<div class="kv"><span class="k">thoát 134 kèm vết ngăn xếp</span><span class="v">giới hạn heap của V8 — một kết cục <em>TỐT HƠN</em>, vì nó nói cho bạn biết Ở ĐÂU. Đặt <code>--max-old-space-size</code> THẤP HƠN giới hạn cgroup để biến 137 thành 134 (8.5)</span></div>
<div class="kv"><span class="k">thoát 1 ngay khi khởi động</span><span class="v">thiếu cấu hình. Bài 6.1 đo một cú lùi tạo tác để lại một biến môi trường đã đổi tên thành undefined</span></div>
<div class="kv"><span class="k">khởi động lại vài giây một lần</span><span class="v">một vòng lặp khởi động lại làm mọi thứ tệ hơn mỗi vòng. DỪNG nó lại, rồi mới chẩn đoán — <code>StartLimitBurst</code> tồn tại vì chuyện này (8.2)</span></div>
</div>

<h3>Đo thật: 137, 134 — và một cú 139 không ai ngờ</h3>
<p>Các mã thoát trong bảng trên, dựng lại bằng Docker 29.8 trên Mac với <code>node:22-alpine</code> (Node v22.23.2): một container bị giới hạn 64 MB bộ nhớ cứ cấp phát bộ đệm 1 MB mãi, và một tiến trình Node bị giới hạn heap V8 ở 32 MB nhồi đầy đối tượng vào đó.</p>
<div class="out">$ docker run --name dv11-oom --memory 64m --memory-swap 64m node:22-alpine \\
    node -e "const a=[];for(;;)a.push(Buffer.alloc(1e6,1))"; echo "thoat=\$?"
thoat=137
$ docker inspect -f 'OOMKilled={{.State.OOMKilled}} ExitCode={{.State.ExitCode}}' dv11-oom
OOMKilled=true ExitCode=137
$ docker logs dv11-oom 2&gt;&amp;1 | wc -l
       0
$ for i in 1 2; do docker run --rm --memory 256m node:22-alpine node --max-old-space-size=32 \\
    -e "const a=[];for(;;)a.push({x:Math.random(),y:'c'+Math.random()})" &gt;/dev/null 2&gt;&amp;1; echo "PID1: thoat=\$?"; done
PID1: thoat=139
PID1: thoat=139
$ docker run --rm --init --memory 256m node:22-alpine node --max-old-space-size=32 -e "…" &gt;/dev/null 2&gt;&amp;1; echo "--init: thoat=\$?"
--init: thoat=134
$ docker run --memory 256m node:22-alpine sh -c 'node --max-old-space-size=32 -e "…" &gt;/dev/null 2&gt;&amp;1; echo node-thoat=\$?'
node-thoat=134</div>
<p>137 và <code>OOMKilled=true</code>, log KHÔNG dòng nào — đúng bài 8.1. Nhưng giới hạn heap, thứ mà bài 8.5 nói biến 137 thành một cú 134 dễ đọc, lại cho <strong>139</strong> (128+11, SIGSEGV) cả hai lần khi node là tiến trình ĐẦU TIÊN của container, và 134 (128+6, SIGABRT) ngay khi nó không phải — dưới <code>--init</code>, hoặc dưới <code>sh</code>. Lần chạy ra 139 vẫn in trước dòng "FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory" của chính V8 — tức giới hạn heap đã làm đúng việc; chỉ cách tiến trình kết thúc là khác. Lý do là PID 1: Linux không giao một tín hiệu có hành động MẶC ĐỊNH cho tiến trình init của một PID namespace (pid_namespaces(7) ghi điều này cho tín hiệu từ tiến trình khác; đo ở đây, chính SIGABRT mà <code>abort()</code> tự gửi cũng bị bỏ y như thế), nên abort lùi về cách làm sập thẳng tiến trình.</p>
<div class="pitfall co-tieu-de"><p><strong>Đừng đọc 139 thành "module native bị sập" trước khi kiểm PID 1.</strong> Trong container, hãy chạy Node dưới một init — <code>docker run --init</code>, hoặc <code>init: true</code> trong Compose — và cú thoát vì hết heap lại thành 134 như tài liệu. Nó cũng chữa luôn hai rắc rối PID 1 cũ: tín hiệu như SIGTERM bị bỏ qua khi không có handler, và tiến trình zombie không ai dọn (Linux &amp; Bash, Chương 12).</p></div>

<h3>Thứ tự cần kiểm</h3>
${slide('dv-11', 17, 'Thứ tự kiểm: đĩa → RAM → bão hoà → CSDL, và chỗ của Linux Chương 12')}
<p>Vì những thứ này TƯƠNG TÁC với nhau, và kiểm sai thứ tự là cách tốn thời gian nhất:</p>
<p>Thứ tự này là bản vừa cỡ cho deploy. Chẩn đoán CÁI MÁY đầy đủ — cuộc quét 60 giây chỉ đọc, cây chết/chậm/lạ, <code>namei</code> cho quyền, CRLF trong script, zombie, lệch đồng hồ và chứng chỉ — là <strong>Linux &amp; Bash, Chương 12</strong>; mở nó khi bốn phép kiểm dưới đây đều sạch mà cái máy vẫn lạ.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1. đĩa</span><span class="lz-t">df -h; df -i</span><span class="lz-d">hai dòng, và một cái đĩa đầy giải thích được một mớ lỗi trông chẳng liên quan gì tới nhau</span></div>
<div class="lz-step"><span class="lz-k">2. bộ nhớ</span><span class="lz-t">dmesg | grep -i oom</span><span class="lz-d">một dòng, và đó là cú hỏng mà log của bạn KHÔNG cho bạn thấy được</span></div>
<div class="lz-step"><span class="lz-k">3. độ bão hoà</span><span class="lz-t">vmstat 1 5</span><span class="lz-d">tách CPU khỏi swap khỏi I/O trong một câu lệnh</span></div>
<div class="lz-step"><span class="lz-k">4. cơ sở dữ liệu</span><span class="lz-t">pg_stat_activity</span><span class="lz-d">chỉ SAU KHI đã loại trừ bản thân cái máy</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — cái tài nguyên bị cạn thường KHÔNG phải cái đã hỏng.</strong> Một cái đĩa đầy làm cơ sở dữ liệu không ghi được, và triệu chứng là các cú 500 từ ứng dụng. Sức ép bộ nhớ đẩy bộ đệm trang ra, và triệu chứng là truy vấn chậm. Chương 8 đo một bản dựng làm đầy cái đĩa dùng chung với PostgreSQL và một bản dựng kích hoạt cú OOM giết cơ sở dữ liệu — trong cả hai, cú hỏng NHÌN THẤY ĐƯỢC là cơ sở dữ liệu còn nguyên nhân là một bản dựng. Hãy kiểm CÁI MÁY trước khi đi tinh chỉnh ứng dụng.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> máy demo "chậm, rồi trang tải lên báo đĩa đầy", và bạn cùng nhóm đã xoá tệp log to nhất mà chẳng ăn thua. Dựng lại cả hai cái đĩa và một cú bão hoà CPU trên VPS thí nghiệm, rồi chữa từng cái mà không khởi động lại gì.</p>
<ol>
<li>Chạy 14 vòng <code>yes</code> với <code>timeout 12</code> và <code>vmstat 1 4</code>; khoanh dòng đầu và nói vì sao bỏ qua nó.</li>
<li><code>sudo mount -t tmpfs -o size=40m tmpfs /srv/log-app</code>, ghi 36 MB qua một tiến trình vẫn giữ tệp mở, xoá tệp, lấy lại chỗ bằng <code>lsof +L1</code> và <code>/proc/PID/fd</code>.</li>
<li>Gắn một tmpfs thứ hai với <code>nr_inodes=2000</code>, lấp đầy bằng <code>touch</code>, rồi đặt <code>df -h</code> và <code>df -i</code> cạnh nhau.</li>
<li>Trên laptop, chạy ba container Node ở trên (gắn nhãn <code>dvhoc=11</code>) và giải thích 137, 139 và 134.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>df -h /srv/log-app</code> về 0% trong khi tiến trình ghi VẪN sống, bạn nói được mỗi mount rơi vào ca nào trong bốn ca đĩa, và giải thích được vì sao cùng một giới hạn heap lại cho 139 và 134.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Saturation (bão hoà)</span><span class="v">Tài nguyên có nhiều việc xếp hàng hơn sức phục vụ: <code>r</code> lớn hơn số nhân.</span></div>
<div class="kv"><span class="k">Page cache (bộ đệm trang)</span><span class="v">RAM nhân hệ điều hành dùng giữ dữ liệu tệp và trả lại khi cần — không phải bộ nhớ "đã dùng".</span></div>
<div class="kv"><span class="k">Inode (nút chỉ mục tệp)</span><span class="v">Mỗi tệp một cái; hệ tệp có thể cạn inode trong khi vẫn thừa khối.</span></div>
<div class="kv"><span class="k">File descriptor (bộ mô tả tệp)</span><span class="v">Cái "tay cầm" của tiến trình trên một tệp đang mở; giữ tệp đã xoá sống tiếp.</span></div>
<div class="kv"><span class="k">OOM killer (bộ giết khi hết bộ nhớ)</span><span class="v">Nhân hệ điều hành kết liễu tiến trình bằng SIGKILL — mã 137, log app không có gì.</span></div>
<div class="kv"><span class="k">PID 1 / init (tiến trình đầu tiên)</span><span class="v">Trong container, chính là app của bạn trừ khi thêm <code>--init</code>; tín hiệu có hành động mặc định không tới được nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Kiểm theo thứ tự: đĩa, bộ nhớ, bão hoà, CSDL — tài nguyên cạn thường không phải thứ hỏng.</li>
<li>Dòng đầu của <code>vmstat</code> là trung bình từ lúc khởi động; đọc từ dòng thứ hai.</li>
<li><code>df</code> đầy mà <code>du</code> nhỏ là tệp đã xoá còn mở: <code>lsof +L1</code>, rồi cắt cụt qua <code>/proc/PID/fd</code>.</li>
<li>Còn chỗ mà ENOSPC là cạn inode; luôn chạy <code>df -h</code> và <code>df -i</code> cùng nhau.</li>
<li>137 là OOM killer; giới hạn heap cho 134 — hoặc 139 khi node là PID 1, nên chạy nó với <code>--init</code>.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">vmstat(8) và iostat(1)</span><span class="lc-sub">man 8 vmstat — các cột <code>r</code>, <code>si</code>/<code>so</code> và <code>wa</code>, cùng lời cảnh báo rằng dòng đầu là trung bình kể từ lúc khởi động.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_stat_activity và pg_locks</span><span class="lc-sub">postgresql.org/docs/current/monitoring-stats.html — riêng <code>wait_event_type</code> nói cho bạn biết một truy vấn đang CHẠY hay đang CHỜ, hai vấn đề rất khác nhau.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Brendan Gregg — Linux Performance Analysis in 60 Seconds</span><span class="lc-sub">netflixtechblog.com/linux-performance-analysis-in-60-000-milliseconds — mười câu lệnh theo một thứ tự có chủ đích; bài này là bản nhỏ hơn nhắm vào một cái VPS.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">lsof(8) — cờ +L</span><span class="lc-sub">man 8 lsof — <code>+L1</code> cho các tệp đã-xoá-còn-mở, câu lệnh nằm sau ca đĩa thứ ba.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — khoá, chờ và truy vấn chậm</span><span class="lc-sub">/courses/postgresql/learn${REF} — đọc <code>pg_locks</code>, và thao tác nào lấy mức khoá nào.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">pid_namespaces(7)</span><span class="lc-sub">man7.org/linux/man-pages/man7/pid_namespaces.7.html — vì sao tiến trình init của một namespace chỉ nhận những tín hiệu nó có handler; gốc rễ của cú 139.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">docker container run — --init</span><span class="lc-sub">docs.docker.com/reference/cli/docker/container/run/ — chạy một init tí hon làm PID 1, chuyển tiếp tín hiệu và dọn zombie.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 11.5 ─────────────────────────── */
    {
      title: '11.5 — The acceptance test, and the two bugs it found|||11.5 — Bộ nghiệm thu, và HAI lỗi nó tìm ra',
      slug: 'deploy-11-5-nghiem-thu',
      type: 'VIDEO',
      description: 'Mười phép kiểm đầu tiên đạt hết — dấu hiệu chắc chắn rằng chúng chưa kiểm đủ khó. Năm phép kiểm khó hơn tìm ra hai lỗi THẬT trong chính chồng máy chủ của tôi, và một phép kiểm đạt một cách tầm thường mà không kiểm gì cả.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.5</span>
<h2>The acceptance test, and the two bugs it found</h2>
<p class="lead">A deploy script proves the deploy ran (Chapter 7). An acceptance test proves the <em>system</em> is correct. This lesson runs one against a complete stack built from scratch, and everything it found was real.</p>

<h3>The stack</h3>
<p>nginx 1.24.0 in front of a Node application in front of PostgreSQL, deployed by the Chapter 7 script, with a release symlink, a smoke test, and structured access logging. A full deploy takes 240 ms:</p>

<div class="out">1/5 dung tao tac trong /srv/vps/nt/tam.umPkym
2/5 dat ban vao /srv/vps/nt/ban/v1
3/5 trao symlink
4/5 san sang sau 120ms
5/5 kiem khoi
    ✓ /health → 200
    ✓ /api/v1/bai → 200
    ✓ /api/v1/rieng → 401
✓ XONG — cua truoc xac nhan 'v1'</div>

<h3>The first ten checks</h3>
<div class="out">── NGHIEM THU (qua cua truoc http://127.0.0.1:3390) ──
  ✓ 1. trang chu 200
  ✓ 2. trang chu co noi dung THAT
  ✓ 3. API cong khai tra JSON
  ✓ 4. route can auth tra 401 (da gan)
  ✓ 5. route khong ton tai tra 404
  ✓ 6. chot kiem suc khoe 200
  ✓ 7. header X-Content-Type-Options
  ✓ 8. header X-Frame-Options
  ✓ 9. co ghi log truy cap
  ✓ 10. log KHONG ghi /health
── dat 10 / hong 0 ──</div>

<div class="callout warn">
<p><strong>Ten out of ten on the first run is a warning, not a result.</strong> A test suite that passes immediately is usually testing what you already knew was true. The useful checks are the ones you are not sure about — so I added five harder ones aimed specifically at things this course measured going wrong.</p>
</div>

<h3>The harder five</h3>
<div class="out">  ✓ 11. phien ban cua truoc KHOP voi symlink
  ✓ 12. API dat content-type JSON
  ✓ 13. loi 500 KHONG lo vet ngan xep
  ✗ 14. KHONG lo phien ban qua header
  ✓ 15. log co truong thoi gian (9.2)
── dat 14 / hong 1 ──</div>

<h3>Finding one: the version leak</h3>
<div class="out">Server: nginx/1.24.0 (Ubuntu)</div>

<p>The exact version and distribution, on every response. Anybody who knows what is unpatched in 1.24.0 knows what to try first. One directive fixes it:</p>

<pre><code>server_tokens off;</code></pre>

<div class="out">  Server gio la: Server: nginx</div>

<h3>Finding two: a check that was passing for free</h3>
<p>Check 13 said error responses do not leak stack traces, and it passed. But <code>/api/v1/bai-loi</code>, the URL it requested, returned <strong>404</strong> — my application had no such route, so the check was inspecting a "not found" page and finding no stack trace in it. It had never tested anything.</p>

<div class="out">  /api/v1/bai-loi tra: 404
  → 404, khong phai 500. Phep kiem 13 dat MOT CACH TAM THUONG — no chua kiem gi ca.</div>

<p>Adding an endpoint that genuinely throws, so the check has something to look at, exposed the real problem:</p>

<div class="out">  HTTP/1.1 500 Internal Server Error
  x-ban: v1</div>

<div class="callout warn">
<p><strong>My own error handler was returning the release version to anyone who could trigger an error.</strong> Not a stack trace — check 13 was right about that — but <code>x-ban: v1</code> tells an attacker exactly which release is running, which is precisely the information Chapter 6 said you should keep for <em>yourself</em>. The fix returns a fixed message and logs the real error server-side:</p>
</div>

<pre><code><span class="tok-comment">// truoc: lo ca phien ban lan thong diep loi ra ngoai</span>
catch(e){ s.writeHead(500,{"x-ban":V}); s.end(e.message+"\\n"); }

<span class="tok-comment">// sau: nguoi dung nhan mot cau chung, con SU THAT di vao nhat ky</span>
catch(e){ s.writeHead(500,{"content-type":"text/plain"});
          s.end("loi may chu\\n"); console.error("[",V,"]",e.message); }</code></pre>

<div class="out">  500 gio tra:
    HTTP/1.1 500 Internal Server Error
    than: loi may chu
  loi THAT nam trong nhat ky: [ v1 ] co tinh nem de kiem</div>

<h3>Fifteen out of fifteen, and the full cycle</h3>
<div class="out">=== deploy v2 ===   tong 259 ms   cua truoc: v2   ── dat 15 / hong 0 ──
=== lui ve v1 ===   tong 245 ms   cua truoc: v1   ── dat 15 / hong 0 ──

  88 request  |  TB 0.0021s  |  max 0.0360s</div>

<p>Deploy, verify, roll back, verify — every check passing at both versions, and the access log confirming nothing was dropped along the way.</p>

<h3>What made the two findings possible</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">checking from the front door</span><span class="lz-lnote">both findings are invisible from inside the application. The <code>Server</code> header is added by nginx (9.5)</span></div>
<div class="lz-layer"><span class="lz-lname">checking headers, not just status</span><span class="lz-lnote">every response was 200 or 500 as expected; the problems were in what came alongside</span></div>
<div class="lz-layer"><span class="lz-lname">asking whether a passing check tests anything</span><span class="lz-lnote">check 13 passed for the worst possible reason. 7.4 measured the same shape: a readiness check calling a tool that was not installed, burning 3,022 ms to learn nothing</span></div>
<div class="lz-layer"><span class="lz-lname">making the failure happen on purpose</span><span class="lz-lnote">the <code>x-ban</code> leak only appeared once something actually threw</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — a green suite is evidence about the suite, not about the system.</strong> Twice in this course a check passed while the thing it was supposed to protect was broken: check 13 here, and the readiness loop in 7.4. Both times the fix was the same — make the failure happen deliberately and confirm the check goes red. A check nobody has seen fail is a check nobody has tested, and it is worth less than no check, because it produces confidence.</p>
</div>

<div class="callout ok">
<p><strong>Where this belongs.</strong> Run it as the last step of the deploy script (7.5), against the front door, and let a non-zero exit trigger the rollback. That closes the loop this whole course has been building: an artifact you can identify (Ch 1), moved deliberately (Ch 2), swapped atomically (Ch 3), configured from outside (Ch 4), against a schema that tolerates two versions (Ch 5), reversible in 140 ms (Ch 6), by a script that refuses when it should (Ch 7), on a machine that will not run out (Ch 8), watched by numbers that do not lie (Ch 9), backed up in a way that has been restored (Ch 10) — and finally, <em>proven correct from where the user stands.</em></p>
</div>


<h3>A reusable version: nghiem-thu.sh</h3>
${slide('dv-11', 22, 'nghiem-thu.sh: mười hai phép kiểm từ cửa trước, mã thoát là kết luận')}
<p>The fifteen checks above were written for one stack. Here is the idea as a script you can keep, rebuilt on this chapter&#39;s lab VPS with twelve checks: every one goes through the front door (<code>https://vidu.local</code>), checks content and headers rather than status alone, and the exit code is the verdict — so the deploy script can call it as its last step and roll back on anything but 0.</p>
<pre><code class="language-bash">#!/usr/bin/env bash
# nghiem-thu.sh — kiem he thong TU CUA TRUOC, nhu nguoi dung
set -uo pipefail
U=\${1:-https://vidu.local}; C=(--cacert /etc/nginx/vidu.crt -s --max-time 5)
dat=0; hong=0
kiem() { if eval "$2" &gt;/dev/null 2&gt;&amp;1; then echo "  ✓ $1"; dat=$((dat+1)); else echo "  ✗ $1"; hong=$((hong+1)); fi; }
ma()  { curl "\${C[@]}" -o /dev/null -w '%{http_code}' "$U$1"; }
hd()  { curl "\${C[@]}" -o /dev/null -D - "$U$1"; }
kiem "1. trang chu 200 + noi dung that"  "curl \${C[*]} $U/ | grep 'id=\\"trang-chu\\"'"
kiem "2. /health 200"                    "[ \\$(ma /health) = 200 ]"
kiem "3. API cong khai tra JSON"         "hd /api/v1/bai | grep -i '^content-type: application/json'"
kiem "4. route can dang nhap tra 401"    "[ \\$(ma /api/v1/rieng) = 401 ]"
kiem "5. route khong co tra 404"         "[ \\$(ma /khong-co-that) = 404 ]"
kiem "6. ban cua truoc = ban symlink"    "[ \\"\\$(curl \${C[*]} $U/ban)\\" = \\"\\$(basename \\$(readlink -f /srv/app/hien-tai))\\" ]"
kiem "7. co X-Content-Type-Options"      "hd / | grep -i '^x-content-type-options: nosniff'"
kiem "8. KHONG lo phien ban nginx"       "! hd / | grep -i '^server: nginx/'"
kiem "9. /loi THAT SU la 500"            "[ \\$(ma /loi) = 500 ]"
kiem "10. 500 KHONG lo ban/chi tiet"     "! hd /loi | grep -i '^x-ban' &amp;&amp; curl \${C[*]} $U/loi | grep -x 'loi may chu'"
kiem "11. http:// chuyen sang https://"  "[ \\$(curl -s -o /dev/null -w '%{http_code}' http://\${U#https://}/) = 301 ]"
kiem "12. chung chi con &gt;= 14 ngay"      "echo | openssl s_client -connect \${U#https://}:443 -servername \${U#https://} 2&gt;/dev/null | openssl x509 -noout -checkend \\$((14*86400))"
echo "── dat $dat / hong $hong ──"; [ "$hong" -eq 0 ]</code></pre>
<table>
<tr><th>Piece</th><th>Why it is there</th></tr>
<tr><td><code>set -uo pipefail</code> (no <code>-e</code>)</td><td>a failing check must be <em>counted</em>, not end the script; <code>pipefail</code> makes a pipeline fail when <code>curl</code> fails, not only when <code>grep</code> does</td></tr>
<tr><td><code>C=(--cacert … -s --max-time 5)</code></td><td>trust exactly this certificate (never <code>-k</code>, which would hide check 12&#39;s problem), and never hang for more than 5 s</td></tr>
<tr><td><code>ma</code> / <code>hd</code></td><td><code>-w '%{http_code}'</code> prints only the status; <code>-D -</code> prints only the headers</td></tr>
<tr><td>check 6</td><td>"200 but the wrong version" (6.5): compares what users are served with where the symlink points</td></tr>
<tr><td>check 9 before check 10</td><td>check 10 is only meaningful if <code>/loi</code> really returns 500 — the lesson of the check that passed against a 404</td></tr>
<tr><td><code>openssl … -checkend \$((14*86400))</code></td><td>exits 1 if the certificate expires within 14 days (Chapter 9)</td></tr>
</table>

<h3>First run on the lab VPS: 8 of 12, four real findings</h3>
${slide('dv-11', 23, 'Lần chạy đầu: 8/12 — Server lộ phiên bản, thiếu header, handler lỗi lộ x-ban, http không chuyển https')}
<p>The lab stack started the way most student stacks start: nginx with defaults, and the application&#39;s "debug" error handler still on (<code>LO_LOI=1</code>). The first run:</p>
<div class="out">$ bash nghiem-thu.sh; echo "thoat=$?"
  ✓ 1. trang chu 200 + noi dung that
  ✓ 2. /health 200
  ✓ 3. API cong khai tra JSON
  ✓ 4. route can dang nhap tra 401
  ✓ 5. route khong co tra 404
  ✓ 6. ban cua truoc = ban symlink
  ✗ 7. co X-Content-Type-Options
  ✗ 8. KHONG lo phien ban nginx
  ✓ 9. /loi THAT SU la 500
  ✗ 10. 500 KHONG lo ban/chi tiet
  ✗ 11. http:// chuyen sang https://
  ✓ 12. chung chi con &gt;= 14 ngay
── dat 8 / hong 4 ──
thoat=1
$ C="--cacert /etc/nginx/vidu.crt -s -o /dev/null -D -"
$ curl $C https://vidu.local/ | grep -i "^server"
Server: nginx/1.24.0 (Ubuntu)
$ curl $C https://vidu.local/loi | grep -iE "^(HTTP|x-ban)"; curl -s --cacert /etc/nginx/vidu.crt https://vidu.local/loi
HTTP/1.1 500 Internal Server Error
x-ban: v2
co tinh nem de kiem
$ curl -s -o /dev/null -w "http:// → %{http_code}\\n" http://vidu.local/
http:// → 200</div>
<p>Four findings, all real: the version in the <code>Server</code> header, no <code>X-Content-Type-Options</code>, an error handler returning the release (<code>x-ban: v2</code>) and the raw exception text, and plain HTTP served instead of redirected. The same two families the original fifteen checks found — so the pattern, not the stack, is what repeats. The fixes are one nginx block and one environment variable:</p>
<pre><code class="language-nginx">server_tokens off;                                  # "Server: nginx", khong so phien ban
server {
    listen 80 default_server;
    return 301 https://\$host\$request_uri;             # phep 11
}
server {
    listen 443 ssl default_server;
    ssl_certificate     /etc/nginx/vidu.crt;
    ssl_certificate_key /etc/nginx/vidu.key;
    access_log /var/log/nginx/nt.log nt;
    add_header X-Content-Type-Options nosniff always;  # phep 7 — "always": ca trang loi
    proxy_read_timeout 2s;
    location /health { access_log off; proxy_pass http://127.0.0.1:8080; }
    location /chet   { proxy_pass http://127.0.0.1:8099; }
    location /       { proxy_pass http://127.0.0.1:8080; }
}</code></pre><div class="out">$ sudo nginx -t 2&gt;&amp;1 | tail -1 &amp;&amp; sudo systemctl reload nginx
nginx: configuration file /etc/nginx/nginx.conf test is successful
$ sudo rm /etc/systemd/system/ung-dung.service.d/lo.conf; sudo systemctl daemon-reload; sudo systemctl restart ung-dung
$ bash nghiem-thu.sh | tail -1; bash nghiem-thu.sh | tail -1; bash nghiem-thu.sh | tail -1
── dat 12 / hong 0 ──
── dat 12 / hong 0 ──
── dat 12 / hong 0 ──</div>

<h3>Make it fail on purpose</h3>
${slide('dv-11', 24, 'Bắt bộ kiểm hỏng: dừng app ⇒ 4/12, và bốn phép vẫn xanh vì chỉ kiểm nginx')}
<p>A suite that goes green is evidence about the suite. So stop the application and run it again:</p>
<div class="out">$ sudo systemctl stop ung-dung
$ bash nghiem-thu.sh; echo "thoat=$?"
  ✗ 1. trang chu 200 + noi dung that
  ✗ 2. /health 200
  ✗ 3. API cong khai tra JSON
  ✗ 4. route can dang nhap tra 401
  ✗ 5. route khong co tra 404
  ✗ 6. ban cua truoc = ban symlink
  ✓ 7. co X-Content-Type-Options
  ✓ 8. KHONG lo phien ban nginx
  ✗ 9. /loi THAT SU la 500
  ✗ 10. 500 KHONG lo ban/chi tiet
  ✓ 11. http:// chuyen sang https://
  ✓ 12. chung chi con &gt;= 14 ngay
── dat 4 / hong 8 ──
thoat=1</div>
<p>It goes red and exits 1 — good: it would trigger a rollback. But look at what stayed green with the application dead: checks 7, 8, 11 and 12 test <em>nginx</em> alone (the <code>always</code> on <code>add_header</code> puts the header even on the 502 page). They are not wrong, they are just not evidence that the application works; count only checks 1–6 and 9–10 as "the app is alive". Every check should be seen red at least once, and the easiest way is to break its target deliberately, as here.</p>

<h3>Accepting the machine, not just the app: kiem-vps.sh</h3>
${slide('dv-11', 25, 'kiem-vps.sh: nghiệm thu cái máy trước khi giao — SSH, cổng, tường lửa, dịch vụ, sao lưu')}
<p><code>nghiem-thu.sh</code> proves the <em>system</em> answers correctly today. Before you hand a VPS to a team — or to the examiner of your group project — the <em>machine</em> needs its own acceptance: will it still be safe and still come back after a reboot next month? Ten read-only checks, run with <code>sudo</code> on the server:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
# kiem-vps.sh — nghiem thu CAI MAY truoc khi giao (chay bang sudo, chi DOC)
set -uo pipefail
dat=0; hong=0
kiem() { if eval "$2" &gt;/dev/null 2&gt;&amp;1; then echo "  ✓ $1"; dat=$((dat+1)); else echo "  ✗ $1"; hong=$((hong+1)); fi; }
mo_ngoai() { ss -tlnH | awk '$4 !~ /^(127\\.|\\[::1\\])/ {sub(/.*:/,"",$4); print $4}' | sort -un | tr '\\n' ' '; }
kiem "1. SSH: tat dang nhap mat khau"      "sshd -T | grep -x 'passwordauthentication no'"
kiem "2. SSH: root khong vao bang mat khau" "sshd -T | grep -Ex 'permitrootlogin (no|prohibit-password|without-password)'"
kiem "3. chi 22 80 443 mo ra ngoai"        "[ \\"\\$(mo_ngoai)\\" = '22 80 443 ' ]"
kiem "4. tuong lua dang bat"               "ufw status | grep 'Status: active'"
kiem "5. tu cai ban va bao mat"            "apt-config dump | grep 'Unattended-Upgrade \\"1\\"'"
kiem "6. dich vu bat khi khoi dong"        "systemctl is-enabled -q nginx postgresql ung-dung"
kiem "7. khong unit nao failed"            "[ \\$(systemctl list-units --state=failed --no-legend | wc -l) = 0 ]"
kiem "8. o dia / duoi 80%"                 "[ \\$(df --output=pcent / | tail -1 | tr -dc 0-9) -lt 80 ]"
kiem "9. cau hinh nginx hop le"            "nginx -t"
kiem "10. ban sao luu moi hon 26 gio"      "[ -n \\"\\$(find /srv/sao-luu -name '*.dump' -mmin -1560 2&gt;/dev/null)\\" ]"
echo "cong mo ra ngoai: $(mo_ngoai)"
echo "── dat $dat / hong $hong ──"; [ "$hong" -eq 0 ]</code></pre>
<p>Run on the lab VPS as it had drifted during the chapter — password SSH never switched off, PostgreSQL listening on <code>*</code> "just to test from my laptop", firewall off, no backup yet:</p>
<div class="out">$ sudo bash kiem-vps.sh; echo "thoat=$?"
  ✗ 1. SSH: tat dang nhap mat khau
  ✓ 2. SSH: root khong vao bang mat khau
  ✗ 3. chi 22 80 443 mo ra ngoai
  ✗ 4. tuong lua dang bat
  ✓ 5. tu cai ban va bao mat
  ✓ 6. dich vu bat khi khoi dong
  ✓ 7. khong unit nao failed
  ✓ 8. o dia / duoi 80%
  ✓ 9. cau hinh nginx hop le
  ✗ 10. ban sao luu moi hon 26 gio
cong mo ra ngoai: 22 80 443 5432
── dat 6 / hong 4 ──
thoat=1</div>
<p>The line <code>cong mo ra ngoai: 22 80 443 5432</code> is the one to fear: a database reachable from outside. The fixes — note the order: allow SSH <em>before</em> <code>ufw enable</code>, or you lock yourself out of a real server:</p>
<pre><code class="language-bash">echo "PasswordAuthentication no" | sudo tee /etc/ssh/sshd_config.d/01-khong-mat-khau.conf
sudo systemctl reload ssh                                  # 01- dung TRUOC 50-cloud-init.conf
sudo rm /etc/postgresql/16/main/conf.d/nghe.conf            # listen_addresses = '*'  -&gt; ve mac dinh localhost
sudo systemctl restart postgresql
sudo ufw allow 22/tcp; sudo ufw allow 80/tcp; sudo ufw allow 443/tcp
sudo ufw enable                                             # SAU khi da allow 22
pg_dump -Fc -d nt -f /srv/sao-luu/nt-\$(date +%Y%m%d-%H%M).dump</code></pre>
<div class="out">$ sudo bash kiem-vps.sh | tail -2
cong mo ra ngoai: 22 80 443
── dat 10 / hong 0 ──</div>
<table>
<tr><th>Check</th><th>Why it is on the list</th><th>Taught in</th></tr>
<tr><td>1–2 SSH</td><td><code>sshd -T</code> prints the value in effect; a drop-in named <code>70-…</code> loses to <code>50-cloud-init.conf</code> (the real 18/09 story)</td><td>Section 0, Linux Ch9</td></tr>
<tr><td>3 ports</td><td>everything listening on a non-loopback address; Chapter 12 adds "Docker bypasses ufw"</td><td>Ch12</td></tr>
<tr><td>4–5 firewall, updates</td><td>a VPS left for a semester without security updates</td><td>Linux Ch10, Ch14</td></tr>
<tr><td>6–7 services</td><td><code>is-enabled</code> = comes back after a reboot; no failed units hiding</td><td>Ch3</td></tr>
<tr><td>8 disk</td><td>below 80% leaves room for one build and one backup</td><td>Ch8</td></tr>
<tr><td>9 nginx</td><td>a broken config on disk is a time bomb for the next restart</td><td>Ch9, Nginx</td></tr>
<tr><td>10 backup</td><td>a backup newer than 26 hours exists — whether it restores is Chapter 10&#39;s question</td><td>Ch10</td></tr>
</table>
<div class="callout ok"><p><strong>When to use which, and when not.</strong> <code>nghiem-thu.sh</code>: after every deploy, from the deploy script, and from another machine on a timer (Chapter 9). <code>kiem-vps.sh</code>: when a machine is built or changes hands, and once a month. Neither replaces a restore test, and neither should be pointed at a server that is not yours — twelve requests are nothing, but running them in a loop against somebody else&#39;s site is a load test they did not agree to.</p></div>

<h3>The checker that failed 57 times in 200</h3>
${slide('dv-11', 26, 'grep -q + pipefail: bộ kiểm hỏng giả 57/200 lần — bỏ -q, đẩy ra /dev/null')}
<p>The first draft of <code>kiem-vps.sh</code> used <code>grep -q</code>, and on its first run reported check 5 (automatic security updates) as failed on a machine where it was correctly configured. Rerunning gave a different answer. Measured:</p>
<pre><code class="language-bash">set -o pipefail
a=0; b=0
for i in $(seq 200); do
  apt-config dump | grep -q "Unattended-Upgrade \\"1\\"" || a=$((a+1))
  apt-config dump | grep "Unattended-Upgrade \\"1\\"" &gt;/dev/null || b=$((b+1))
done
echo "grep -q         : hong $a / 200"
echo "grep &gt;/dev/null : hong $b / 200"</code></pre>
<div class="out">$ apt-config dump | wc -l
245
$ bash chap.sh
grep -q         : hong 57 / 200
grep &gt;/dev/null : hong 0 / 200</div>
<p><code>grep -q</code> exits the moment it finds a match. <code>apt-config dump</code> is still writing its 245 lines; its next write hits a closed pipe, it dies of SIGPIPE, and under <code>pipefail</code> the pipeline&#39;s status is that failure — so a correct machine "fails" about one time in four. Remove <code>-q</code> and send the output to <code>/dev/null</code>: <code>grep</code> reads everything, the writer finishes, 200 out of 200. The same trap hides in any <code>big-command | grep -q</code>, <code>| head -1</code> or <code>| head</code> under <code>pipefail</code>. A flaky checker is worse than none: it teaches everyone to ignore red — Chapter 9 measured a monitor that stayed red for 26 days until nobody read it.</p>

<h3>Where the course goes next: Chapters 12–15</h3>
${slide('dv-11', 27, 'Đi tiếp: Chương 12 tên miền và HTTPS, 13 container và CI, 14 nhiều môi trường, 15 dự án cuối khoá')}
<p>Sections 0–11 are the core: one machine, the four steps, and everything that goes wrong between them. Four newer chapters take the same machine onto the real Internet and past one server, and each reuses what you built here:</p>
<table>
<tr><th>Chapter</th><th>What it adds</th><th>What it reuses from here</th></tr>
<tr><td><strong>12 — From a domain name to HTTPS</strong></td><td>registrar and DNS records, TTL and why a new IP "has not arrived", a reverse proxy with ACME certificates (tested against Pebble, never the real Let&#39;s Encrypt), opening only the right ports — including Docker bypassing ufw — and a CDN in front of static files</td><td>checks 8, 11 and 12 of <code>nghiem-thu.sh</code>, check 3 of <code>kiem-vps.sh</code>; exit codes 6 and 60 from 11.2</td></tr>
<tr><td><strong>13 — Containers, a registry and CI</strong></td><td>Compose on the VPS with images pinned to a commit, building elsewhere and pushing to a registry, a GitHub Actions deploy over SSH, and swapping containers without dropping requests</td><td>the "Restarting" recipe from 11.3, exit codes 137/139 from 11.4, the smoke test after every swap</td></tr>
<tr><td><strong>14 — Environments, and beyond one server</strong></td><td>dev/staging/production from one image, two servers behind a load balancer with state moved off the machine, VPS against PaaS against Kubernetes, and moving to a new provider without losing data</td><td>the four-step tree, now per server; "which version is running" asked of each one</td></tr>
<tr><td><strong>15 — Capstone</strong></td><td>a group-project clinic booking app shipped end to end in three "days", eight classic incidents rebuilt for real, and the <strong>20-question final exam</strong> of the whole course</td><td>both acceptance scripts as the definition of "done"; the incident notebook as the runbook</td></tr>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> tomorrow you hand the group project&#39;s VPS to the examiner, who will open the site and may ask to see the server. Prove both are ready — and prove your proof works.</p>
<ol>
<li>On the lab VPS, set <code>LO_LOI=1</code> in a drop-in for <code>ung-dung</code> and use the first nginx site from 11.1; run <code>nghiem-thu.sh</code> and write down the four failures.</li>
<li>Apply the nginx block and remove the drop-in; run it three times.</li>
<li>Stop the application; run it again and list which checks stayed green and why.</li>
<li>Make PostgreSQL listen on <code>*</code>, then run <code>kiem-vps.sh</code>; fix every failure in the safe order (allow 22 before <code>ufw enable</code>).</li>
<li>Put <code>grep -q</code> back into check 5 and run <code>kiem-vps.sh</code> twenty times: <code>for i in \$(seq 20); do sudo bash kiem-vps.sh | tail -1; done | sort | uniq -c</code>.</li>
</ol>
<p><strong>Done when:</strong> <code>nghiem-thu.sh</code> ends <code>dat 12 / hong 0</code> three times in a row and <code>dat 4 / hong 8</code> with the app stopped; <code>kiem-vps.sh</code> ends <code>dat 10 / hong 0</code> with <code>cong mo ra ngoai: 22 80 443</code>; and step 5 shows more than one distinct result line.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Acceptance test (kiểm thử nghiệm thu)</span><span class="v">Checks that the <em>system</em> is correct from where the user stands, not that the deploy ran.</span></div>
<div class="kv"><span class="k">Hardening (gia cố)</span><span class="v">Closing what a fresh server leaves open: password SSH, extra ports, no firewall, no updates.</span></div>
<div class="kv"><span class="k">Information leak (rò rỉ thông tin)</span><span class="v">Version numbers or exception text returned to anyone who asks.</span></div>
<div class="kv"><span class="k">Flaky check (phép kiểm chập chờn)</span><span class="v">A check that gives different answers on an unchanged system — worse than none.</span></div>
<div class="kv"><span class="k">SIGPIPE (tín hiệu ống vỡ)</span><span class="v">Sent to a process writing into a pipe whose reader has exited; with <code>pipefail</code> it fails the pipeline.</span></div>
<div class="kv"><span class="k">Loopback (địa chỉ nội bộ)</span><span class="v"><code>127.0.0.1</code>/<code>::1</code>: reachable only from the machine itself.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A deploy script proves the deploy ran; an acceptance test from the front door proves the system is right.</li>
<li>Check content and headers, not just status; put the "is it really 500" check before the "does 500 leak" check.</li>
<li>Break the target on purpose: the suite must go red — and some checks stay green because they only test nginx.</li>
<li>Accept the machine too: SSH, open ports, firewall, updates, services at boot, disk, nginx config, backups.</li>
<li><code>grep -q</code> under <code>pipefail</code> made a correct machine fail 57 times in 200; a flaky checker teaches people to ignore red.</li>
<li>Chapters 12–15 take this machine onto the Internet, into containers and CI, past one server, and into a capstone.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — server_tokens</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_core_module.html#server_tokens — <code>off</code>, and <code>build</code>/a custom string with the <code>headers_more</code> module if you want the header gone entirely.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OWASP — Error Handling cheat sheet</span><span class="lc-sub">cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html — the generic-message-out, detail-to-the-log pattern applied above, and what else leaks through error responses.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Mozilla Observatory</span><span class="lc-sub">developer.mozilla.org/en-US/observatory — scores a live site on exactly the headers checks 7, 8 and 14 look at; a reasonable source for what to add next.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — security headers, and an acceptance test for a proxy</span><span class="lc-sub">/courses/nginx/learn${REF} — the same exercise from the proxy&#39;s side, including a missing HSTS header that its own acceptance test found.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">sshd_config(5)</span><span class="lc-sub">man.openbsd.org/sshd_config — <code>PasswordAuthentication</code>, <code>PermitRootLogin</code>, and "the first obtained value will be used", which is why drop-in order matters.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ufw(8) — Ubuntu 24.04</span><span class="lc-sub">manpages.ubuntu.com/manpages/noble/man8/ufw.8.html — <code>allow</code>, <code>enable</code>, <code>status</code>; allow SSH before enabling on a remote machine.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Ubuntu Server — Automatic updates</span><span class="lc-sub">ubuntu.com/server/docs/how-to/software/automatic-updates/ — <code>unattended-upgrades</code> and the <code>APT::Periodic</code> settings check 5 reads.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">bash(1) — pipefail</span><span class="lc-sub">man7.org/linux/man-pages/man1/bash.1.html — "the return status of a pipeline is the value of the last command to exit with a non-zero status", the rule behind the 57 false failures.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.5</span>
<h2>Bộ nghiệm thu, và HAI lỗi nó tìm ra</h2>
<p class="lead">Một script deploy chứng minh rằng lần deploy ĐÃ CHẠY (Chương 7). Một bộ nghiệm thu chứng minh rằng <em>HỆ THỐNG</em> ĐÚNG. Bài này chạy một bộ như thế trên một chồng máy chủ dựng từ đầu, và mọi thứ nó tìm ra đều là THẬT.</p>

<h3>Chồng máy chủ</h3>
<p>nginx 1.24.0 đứng trước một ứng dụng Node đứng trước PostgreSQL, deploy bằng script của Chương 7, có symlink bản phát hành, có kiểm khói, và có ghi log truy cập có cấu trúc. Một lần deploy đầy đủ mất 240 ms:</p>

<div class="out">1/5 dung tao tac trong /srv/vps/nt/tam.umPkym
2/5 dat ban vao /srv/vps/nt/ban/v1
3/5 trao symlink
4/5 san sang sau 120ms
5/5 kiem khoi
    ✓ /health → 200
    ✓ /api/v1/bai → 200
    ✓ /api/v1/rieng → 401
✓ XONG — cua truoc xac nhan 'v1'</div>

<h3>Mười phép kiểm đầu</h3>
<div class="out">── NGHIEM THU (qua cua truoc http://127.0.0.1:3390) ──
  ✓ 1. trang chu 200
  ✓ 2. trang chu co noi dung THAT
  ✓ 3. API cong khai tra JSON
  ✓ 4. route can auth tra 401 (da gan)
  ✓ 5. route khong ton tai tra 404
  ✓ 6. chot kiem suc khoe 200
  ✓ 7. header X-Content-Type-Options
  ✓ 8. header X-Frame-Options
  ✓ 9. co ghi log truy cap
  ✓ 10. log KHONG ghi /health
── dat 10 / hong 0 ──</div>

<div class="callout warn">
<p><strong>Mười trên mười ngay lần chạy đầu là một LỜI CẢNH BÁO, không phải một kết quả.</strong> Một bộ kiểm đạt ngay lập tức thường là đang kiểm những thứ bạn VỐN ĐÃ BIẾT là đúng. Các phép kiểm hữu dụng là những cái bạn KHÔNG chắc — nên tôi thêm năm cái khó hơn, nhắm thẳng vào những thứ mà khoá này đã đo được là hay hỏng.</p>
</div>

<h3>Năm cái khó hơn</h3>
<div class="out">  ✓ 11. phien ban cua truoc KHOP voi symlink
  ✓ 12. API dat content-type JSON
  ✓ 13. loi 500 KHONG lo vet ngan xep
  ✗ 14. KHONG lo phien ban qua header
  ✓ 15. log co truong thoi gian (9.2)
── dat 14 / hong 1 ──</div>

<h3>Phát hiện một: rò rỉ phiên bản</h3>
<div class="out">Server: nginx/1.24.0 (Ubuntu)</div>

<p>Chính xác phiên bản và bản phân phối, trên MỌI bản trả lời. Ai biết cái gì chưa được vá trong 1.24.0 thì biết ngay nên thử gì trước. Một chỉ thị chữa được:</p>

<pre><code>server_tokens off;</code></pre>

<div class="out">  Server gio la: Server: nginx</div>

<h3>Phát hiện hai: một phép kiểm ĐANG ĐẠT MIỄN PHÍ</h3>
<p>Phép kiểm 13 nói rằng các bản trả lời lỗi không lộ vết ngăn xếp, và nó ĐẠT. Nhưng <code>/api/v1/bai-loi</code>, cái URL nó gọi, trả về <strong>404</strong> — ứng dụng của tôi không có route đó, nên phép kiểm đang soi một trang "không tìm thấy" và không thấy vết ngăn xếp nào trong đó. Nó chưa bao giờ kiểm cái gì cả.</p>

<div class="out">  /api/v1/bai-loi tra: 404
  → 404, khong phai 500. Phep kiem 13 dat MOT CACH TAM THUONG — no chua kiem gi ca.</div>

<p>Thêm một endpoint THẬT SỰ ném lỗi, để phép kiểm có thứ để nhìn, đã phơi ra vấn đề thật:</p>

<div class="out">  HTTP/1.1 500 Internal Server Error
  x-ban: v1</div>

<div class="callout warn">
<p><strong>Cái handler lỗi của CHÍNH TÔI đang trả phiên bản bản phát hành cho bất cứ ai kích được một lỗi.</strong> Không phải vết ngăn xếp — phép kiểm 13 nói đúng về chuyện đó — nhưng <code>x-ban: v1</code> nói cho kẻ tấn công biết CHÍNH XÁC bản nào đang chạy, mà đó đúng là thông tin mà Chương 6 bảo bạn nên giữ cho <em>CHÍNH MÌNH</em>. Cách chữa là trả về một thông điệp cố định và ghi lỗi thật ở phía máy chủ:</p>
</div>

<pre><code><span class="tok-comment">// truoc: lo ca phien ban lan thong diep loi ra ngoai</span>
catch(e){ s.writeHead(500,{"x-ban":V}); s.end(e.message+"\\n"); }

<span class="tok-comment">// sau: nguoi dung nhan mot cau chung, con SU THAT di vao nhat ky</span>
catch(e){ s.writeHead(500,{"content-type":"text/plain"});
          s.end("loi may chu\\n"); console.error("[",V,"]",e.message); }</code></pre>

<div class="out">  500 gio tra:
    HTTP/1.1 500 Internal Server Error
    than: loi may chu
  loi THAT nam trong nhat ky: [ v1 ] co tinh nem de kiem</div>

<h3>Mười lăm trên mười lăm, và cả vòng đầy đủ</h3>
<div class="out">=== deploy v2 ===   tong 259 ms   cua truoc: v2   ── dat 15 / hong 0 ──
=== lui ve v1 ===   tong 245 ms   cua truoc: v1   ── dat 15 / hong 0 ──

  88 request  |  TB 0.0021s  |  max 0.0360s</div>

<p>Deploy, kiểm, lùi, kiểm — mọi phép kiểm đều đạt ở CẢ HAI phiên bản, và nhật ký truy cập xác nhận không rơi cái gì dọc đường.</p>

<h3>Cái gì làm cho hai phát hiện đó khả thi</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">kiểm từ CỬA TRƯỚC</span><span class="lz-lnote">cả hai phát hiện đều VÔ HÌNH từ bên trong ứng dụng. Header <code>Server</code> do nginx thêm vào (9.5)</span></div>
<div class="lz-layer"><span class="lz-lname">kiểm cả HEADER, không chỉ mã trạng thái</span><span class="lz-lnote">mọi bản trả lời đều 200 hoặc 500 đúng như mong đợi; vấn đề nằm ở thứ đi KÈM</span></div>
<div class="lz-layer"><span class="lz-lname">hỏi xem một phép kiểm ĐANG ĐẠT có kiểm gì không</span><span class="lz-lnote">phép kiểm 13 đạt vì lý do TỆ NHẤT có thể. Bài 7.4 đo cùng hình dạng ấy: một phép kiểm sẵn sàng gọi một công cụ chưa được cài, đốt 3.022 ms để học được con số không</span></div>
<div class="lz-layer"><span class="lz-lname">GÂY RA cú hỏng một cách có chủ đích</span><span class="lz-lnote">chỗ rò <code>x-ban</code> chỉ hiện ra khi có thứ gì đó THẬT SỰ ném lỗi</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — một bộ kiểm toàn màu xanh là bằng chứng về BỘ KIỂM, không phải về HỆ THỐNG.</strong> Hai lần trong khoá này một phép kiểm đã ĐẠT trong khi cái nó lẽ ra phải bảo vệ thì đang hỏng: phép kiểm 13 ở đây, và vòng lặp sẵn sàng ở 7.4. Cả hai lần cách chữa đều giống nhau — GÂY RA cú hỏng một cách có chủ đích và xác nhận rằng phép kiểm chuyển sang màu đỏ. Một phép kiểm chưa ai thấy nó HỎNG là một phép kiểm chưa ai đem đi thử, và nó còn ÍT giá trị hơn là không có phép kiểm nào, vì nó đẻ ra sự tự tin.</p>
</div>

<div class="callout ok">
<p><strong>Chỗ của nó nằm ở đâu.</strong> Chạy nó như bước CUỐI của script deploy (7.5), nhắm vào cửa trước, và để một mã thoát khác không kích hoạt cú lùi. Việc đó khép lại cái vòng mà cả khoá học này đã dựng lên: một tạo tác bạn NHẬN DIỆN ĐƯỢC (Ch 1), chuyển đi có chủ đích (Ch 2), tráo vào một cách nguyên tử (Ch 3), cấu hình từ bên ngoài (Ch 4), trên một lược đồ chịu được HAI phiên bản (Ch 5), lùi lại được trong 140 ms (Ch 6), bằng một script biết TỪ CHỐI khi cần (Ch 7), trên một cái máy sẽ không cạn kiệt (Ch 8), được canh bằng những con số không nói dối (Ch 9), sao lưu theo cách ĐÃ TỪNG được phục hồi (Ch 10) — và cuối cùng, <em>được chứng minh là ĐÚNG từ chỗ người dùng đứng.</em></p>
</div>


<h3>Một bản dùng lại được: nghiem-thu.sh</h3>
${slide('dv-11', 22, 'nghiem-thu.sh: mười hai phép kiểm từ cửa trước, mã thoát là kết luận')}
<p>Mười lăm phép kiểm ở trên được viết cho một chồng máy chủ. Đây là cùng ý tưởng ở dạng một script bạn giữ được, dựng lại trên VPS thí nghiệm của chương với mười hai phép kiểm: mọi phép đều đi qua cửa trước (<code>https://vidu.local</code>), kiểm NỘI DUNG và HEADER chứ không chỉ mã trạng thái, và mã thoát chính là phán quyết — để script deploy gọi nó như bước cuối và lùi bản khi nó khác 0.</p>
<pre><code class="language-bash">#!/usr/bin/env bash
# nghiem-thu.sh — kiem he thong TU CUA TRUOC, nhu nguoi dung
set -uo pipefail
U=\${1:-https://vidu.local}; C=(--cacert /etc/nginx/vidu.crt -s --max-time 5)
dat=0; hong=0
kiem() { if eval "$2" &gt;/dev/null 2&gt;&amp;1; then echo "  ✓ $1"; dat=$((dat+1)); else echo "  ✗ $1"; hong=$((hong+1)); fi; }
ma()  { curl "\${C[@]}" -o /dev/null -w '%{http_code}' "$U$1"; }
hd()  { curl "\${C[@]}" -o /dev/null -D - "$U$1"; }
kiem "1. trang chu 200 + noi dung that"  "curl \${C[*]} $U/ | grep 'id=\\"trang-chu\\"'"
kiem "2. /health 200"                    "[ \\$(ma /health) = 200 ]"
kiem "3. API cong khai tra JSON"         "hd /api/v1/bai | grep -i '^content-type: application/json'"
kiem "4. route can dang nhap tra 401"    "[ \\$(ma /api/v1/rieng) = 401 ]"
kiem "5. route khong co tra 404"         "[ \\$(ma /khong-co-that) = 404 ]"
kiem "6. ban cua truoc = ban symlink"    "[ \\"\\$(curl \${C[*]} $U/ban)\\" = \\"\\$(basename \\$(readlink -f /srv/app/hien-tai))\\" ]"
kiem "7. co X-Content-Type-Options"      "hd / | grep -i '^x-content-type-options: nosniff'"
kiem "8. KHONG lo phien ban nginx"       "! hd / | grep -i '^server: nginx/'"
kiem "9. /loi THAT SU la 500"            "[ \\$(ma /loi) = 500 ]"
kiem "10. 500 KHONG lo ban/chi tiet"     "! hd /loi | grep -i '^x-ban' &amp;&amp; curl \${C[*]} $U/loi | grep -x 'loi may chu'"
kiem "11. http:// chuyen sang https://"  "[ \\$(curl -s -o /dev/null -w '%{http_code}' http://\${U#https://}/) = 301 ]"
kiem "12. chung chi con &gt;= 14 ngay"      "echo | openssl s_client -connect \${U#https://}:443 -servername \${U#https://} 2&gt;/dev/null | openssl x509 -noout -checkend \\$((14*86400))"
echo "── dat $dat / hong $hong ──"; [ "$hong" -eq 0 ]</code></pre>
<table>
<tr><th>Mảnh</th><th>Vì sao có nó</th></tr>
<tr><td><code>set -uo pipefail</code> (không <code>-e</code>)</td><td>một phép kiểm hỏng phải được <em>ĐẾM</em>, không được kết thúc script; <code>pipefail</code> làm cả ống hỏng khi <code>curl</code> hỏng, không chỉ khi <code>grep</code> hỏng</td></tr>
<tr><td><code>C=(--cacert … -s --max-time 5)</code></td><td>tin ĐÚNG chứng chỉ này (không bao giờ <code>-k</code>, thứ sẽ che mất vấn đề của phép 12), và không bao giờ treo quá 5 giây</td></tr>
<tr><td><code>ma</code> / <code>hd</code></td><td><code>-w '%{http_code}'</code> chỉ in mã trạng thái; <code>-D -</code> chỉ in header</td></tr>
<tr><td>phép 6</td><td>"200 mà SAI bản" (6.5): so thứ người dùng nhận với chỗ symlink đang trỏ</td></tr>
<tr><td>phép 9 đứng trước phép 10</td><td>phép 10 chỉ có nghĩa khi <code>/loi</code> THẬT SỰ trả 500 — bài học của phép kiểm từng đạt trên một trang 404</td></tr>
<tr><td><code>openssl … -checkend \$((14*86400))</code></td><td>thoát 1 nếu chứng chỉ hết hạn trong vòng 14 ngày (Chương 9)</td></tr>
</table>

<h3>Lần chạy đầu trên VPS thí nghiệm: 8/12, bốn phát hiện thật</h3>
${slide('dv-11', 23, 'Lần chạy đầu: 8/12 — Server lộ phiên bản, thiếu header, handler lỗi lộ x-ban, http không chuyển https')}
<p>Chồng thử bắt đầu đúng như phần lớn chồng máy của sinh viên: nginx để mặc định, và handler lỗi "gỡ rối" của ứng dụng vẫn bật (<code>LO_LOI=1</code>). Lần chạy đầu:</p>
<div class="out">$ bash nghiem-thu.sh; echo "thoat=$?"
  ✓ 1. trang chu 200 + noi dung that
  ✓ 2. /health 200
  ✓ 3. API cong khai tra JSON
  ✓ 4. route can dang nhap tra 401
  ✓ 5. route khong co tra 404
  ✓ 6. ban cua truoc = ban symlink
  ✗ 7. co X-Content-Type-Options
  ✗ 8. KHONG lo phien ban nginx
  ✓ 9. /loi THAT SU la 500
  ✗ 10. 500 KHONG lo ban/chi tiet
  ✗ 11. http:// chuyen sang https://
  ✓ 12. chung chi con &gt;= 14 ngay
── dat 8 / hong 4 ──
thoat=1
$ C="--cacert /etc/nginx/vidu.crt -s -o /dev/null -D -"
$ curl $C https://vidu.local/ | grep -i "^server"
Server: nginx/1.24.0 (Ubuntu)
$ curl $C https://vidu.local/loi | grep -iE "^(HTTP|x-ban)"; curl -s --cacert /etc/nginx/vidu.crt https://vidu.local/loi
HTTP/1.1 500 Internal Server Error
x-ban: v2
co tinh nem de kiem
$ curl -s -o /dev/null -w "http:// → %{http_code}\\n" http://vidu.local/
http:// → 200</div>
<p>Bốn phát hiện, đều thật: phiên bản trong header <code>Server</code>, thiếu <code>X-Content-Type-Options</code>, một handler lỗi trả về bản phát hành (<code>x-ban: v2</code>) kèm nguyên văn câu ngoại lệ, và HTTP thường được phục vụ thay vì chuyển hướng. Vẫn hai họ lỗi mà mười lăm phép kiểm ban đầu đã tìm ra — nên thứ lặp lại là KHUÔN MẪU, không phải chồng máy. Cách chữa là một khối nginx và một biến môi trường:</p>
<pre><code class="language-nginx">server_tokens off;                                  # "Server: nginx", khong so phien ban
server {
    listen 80 default_server;
    return 301 https://\$host\$request_uri;             # phep 11
}
server {
    listen 443 ssl default_server;
    ssl_certificate     /etc/nginx/vidu.crt;
    ssl_certificate_key /etc/nginx/vidu.key;
    access_log /var/log/nginx/nt.log nt;
    add_header X-Content-Type-Options nosniff always;  # phep 7 — "always": ca trang loi
    proxy_read_timeout 2s;
    location /health { access_log off; proxy_pass http://127.0.0.1:8080; }
    location /chet   { proxy_pass http://127.0.0.1:8099; }
    location /       { proxy_pass http://127.0.0.1:8080; }
}</code></pre><div class="out">$ sudo nginx -t 2&gt;&amp;1 | tail -1 &amp;&amp; sudo systemctl reload nginx
nginx: configuration file /etc/nginx/nginx.conf test is successful
$ sudo rm /etc/systemd/system/ung-dung.service.d/lo.conf; sudo systemctl daemon-reload; sudo systemctl restart ung-dung
$ bash nghiem-thu.sh | tail -1; bash nghiem-thu.sh | tail -1; bash nghiem-thu.sh | tail -1
── dat 12 / hong 0 ──
── dat 12 / hong 0 ──
── dat 12 / hong 0 ──</div>

<h3>Bắt nó HỎNG có chủ đích</h3>
${slide('dv-11', 24, 'Bắt bộ kiểm hỏng: dừng app ⇒ 4/12, và bốn phép vẫn xanh vì chỉ kiểm nginx')}
<p>Một bộ kiểm chuyển xanh là bằng chứng về BỘ KIỂM. Nên hãy dừng ứng dụng và chạy lại:</p>
<div class="out">$ sudo systemctl stop ung-dung
$ bash nghiem-thu.sh; echo "thoat=$?"
  ✗ 1. trang chu 200 + noi dung that
  ✗ 2. /health 200
  ✗ 3. API cong khai tra JSON
  ✗ 4. route can dang nhap tra 401
  ✗ 5. route khong co tra 404
  ✗ 6. ban cua truoc = ban symlink
  ✓ 7. co X-Content-Type-Options
  ✓ 8. KHONG lo phien ban nginx
  ✗ 9. /loi THAT SU la 500
  ✗ 10. 500 KHONG lo ban/chi tiet
  ✓ 11. http:// chuyen sang https://
  ✓ 12. chung chi con &gt;= 14 ngay
── dat 4 / hong 8 ──
thoat=1</div>
<p>Nó chuyển đỏ và thoát 1 — tốt: nó sẽ kích hoạt cú lùi. Nhưng nhìn những gì vẫn XANH khi app đã chết: phép 7, 8, 11 và 12 chỉ kiểm <em>nginx</em> (chữ <code>always</code> ở <code>add_header</code> gắn header cả vào trang 502). Chúng không sai, chúng chỉ không phải bằng chứng rằng ứng dụng chạy; chỉ đếm phép 1–6 và 9–10 là "app còn sống". Mỗi phép kiểm phải được thấy ĐỎ ít nhất một lần, và cách dễ nhất là cố ý làm hỏng đúng thứ nó kiểm, như ở đây.</p>

<h3>Nghiệm thu CÁI MÁY, không chỉ cái app: kiem-vps.sh</h3>
${slide('dv-11', 25, 'kiem-vps.sh: nghiệm thu cái máy trước khi giao — SSH, cổng, tường lửa, dịch vụ, sao lưu')}
<p><code>nghiem-thu.sh</code> chứng minh HỆ THỐNG trả lời đúng hôm nay. Trước khi giao một VPS cho nhóm — hay cho hội đồng chấm đồ án — CÁI MÁY cần một lần nghiệm thu riêng: tháng sau nó có còn an toàn, reboot xong có tự lên lại không? Mười phép kiểm chỉ đọc, chạy bằng <code>sudo</code> trên máy chủ:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
# kiem-vps.sh — nghiem thu CAI MAY truoc khi giao (chay bang sudo, chi DOC)
set -uo pipefail
dat=0; hong=0
kiem() { if eval "$2" &gt;/dev/null 2&gt;&amp;1; then echo "  ✓ $1"; dat=$((dat+1)); else echo "  ✗ $1"; hong=$((hong+1)); fi; }
mo_ngoai() { ss -tlnH | awk '$4 !~ /^(127\\.|\\[::1\\])/ {sub(/.*:/,"",$4); print $4}' | sort -un | tr '\\n' ' '; }
kiem "1. SSH: tat dang nhap mat khau"      "sshd -T | grep -x 'passwordauthentication no'"
kiem "2. SSH: root khong vao bang mat khau" "sshd -T | grep -Ex 'permitrootlogin (no|prohibit-password|without-password)'"
kiem "3. chi 22 80 443 mo ra ngoai"        "[ \\"\\$(mo_ngoai)\\" = '22 80 443 ' ]"
kiem "4. tuong lua dang bat"               "ufw status | grep 'Status: active'"
kiem "5. tu cai ban va bao mat"            "apt-config dump | grep 'Unattended-Upgrade \\"1\\"'"
kiem "6. dich vu bat khi khoi dong"        "systemctl is-enabled -q nginx postgresql ung-dung"
kiem "7. khong unit nao failed"            "[ \\$(systemctl list-units --state=failed --no-legend | wc -l) = 0 ]"
kiem "8. o dia / duoi 80%"                 "[ \\$(df --output=pcent / | tail -1 | tr -dc 0-9) -lt 80 ]"
kiem "9. cau hinh nginx hop le"            "nginx -t"
kiem "10. ban sao luu moi hon 26 gio"      "[ -n \\"\\$(find /srv/sao-luu -name '*.dump' -mmin -1560 2&gt;/dev/null)\\" ]"
echo "cong mo ra ngoai: $(mo_ngoai)"
echo "── dat $dat / hong $hong ──"; [ "$hong" -eq 0 ]</code></pre>
<p>Chạy trên VPS thí nghiệm ở đúng trạng thái nó đã trôi dạt tới trong chương — SSH mật khẩu chưa bao giờ tắt, PostgreSQL nghe <code>*</code> "để thử từ laptop cho tiện", tường lửa tắt, chưa có bản sao lưu nào:</p>
<div class="out">$ sudo bash kiem-vps.sh; echo "thoat=$?"
  ✗ 1. SSH: tat dang nhap mat khau
  ✓ 2. SSH: root khong vao bang mat khau
  ✗ 3. chi 22 80 443 mo ra ngoai
  ✗ 4. tuong lua dang bat
  ✓ 5. tu cai ban va bao mat
  ✓ 6. dich vu bat khi khoi dong
  ✓ 7. khong unit nao failed
  ✓ 8. o dia / duoi 80%
  ✓ 9. cau hinh nginx hop le
  ✗ 10. ban sao luu moi hon 26 gio
cong mo ra ngoai: 22 80 443 5432
── dat 6 / hong 4 ──
thoat=1</div>
<p>Dòng <code>cong mo ra ngoai: 22 80 443 5432</code> là dòng đáng sợ: một CSDL với tới được từ bên ngoài. Cách chữa — chú ý thứ tự: cho phép SSH <em>TRƯỚC</em> <code>ufw enable</code>, không thì bạn tự khoá mình ngoài một máy chủ thật:</p>
<pre><code class="language-bash">echo "PasswordAuthentication no" | sudo tee /etc/ssh/sshd_config.d/01-khong-mat-khau.conf
sudo systemctl reload ssh                                  # 01- dung TRUOC 50-cloud-init.conf
sudo rm /etc/postgresql/16/main/conf.d/nghe.conf            # listen_addresses = '*'  -&gt; ve mac dinh localhost
sudo systemctl restart postgresql
sudo ufw allow 22/tcp; sudo ufw allow 80/tcp; sudo ufw allow 443/tcp
sudo ufw enable                                             # SAU khi da allow 22
pg_dump -Fc -d nt -f /srv/sao-luu/nt-\$(date +%Y%m%d-%H%M).dump</code></pre>
<div class="out">$ sudo bash kiem-vps.sh | tail -2
cong mo ra ngoai: 22 80 443
── dat 10 / hong 0 ──</div>
<table>
<tr><th>Phép kiểm</th><th>Vì sao nó có mặt</th><th>Học ở</th></tr>
<tr><td>1–2 SSH</td><td><code>sshd -T</code> in giá trị ĐANG hiệu lực; một drop-in tên <code>70-…</code> thua <code>50-cloud-init.conf</code> (chuyện thật 18/09)</td><td>Mục 0, Linux Ch9</td></tr>
<tr><td>3 cổng</td><td>mọi thứ nghe trên địa chỉ không phải loopback; Chương 12 thêm chuyện "Docker vượt mặt ufw"</td><td>Ch12</td></tr>
<tr><td>4–5 tường lửa, cập nhật</td><td>một VPS bỏ đó cả học kỳ không có bản vá bảo mật</td><td>Linux Ch10, Ch14</td></tr>
<tr><td>6–7 dịch vụ</td><td><code>is-enabled</code> = tự lên lại sau reboot; không có unit failed nào đang trốn</td><td>Ch3</td></tr>
<tr><td>8 đĩa</td><td>dưới 80% còn chỗ cho một lần build và một bản sao lưu</td><td>Ch8</td></tr>
<tr><td>9 nginx</td><td>một cấu hình hỏng nằm trên đĩa là quả bom hẹn giờ cho lần khởi động lại tới</td><td>Ch9, Nginx</td></tr>
<tr><td>10 sao lưu</td><td>có bản sao lưu mới hơn 26 giờ — còn phục hồi được hay không là câu hỏi của Chương 10</td><td>Ch10</td></tr>
</table>
<div class="callout ok"><p><strong>Khi nào dùng cái nào, và khi nào KHÔNG.</strong> <code>nghiem-thu.sh</code>: sau mỗi lần deploy, từ script deploy, và từ một máy khác theo lịch (Chương 9). <code>kiem-vps.sh</code>: khi một máy được dựng hoặc đổi chủ, và mỗi tháng một lần. Cả hai đều không thay được một lần tập phục hồi, và đừng chĩa cái nào vào máy chủ không phải của bạn — mười hai request thì chẳng là gì, nhưng chạy chúng trong vòng lặp vào site của người khác là một cuộc thử tải họ chưa hề đồng ý.</p></div>

<h3>Bộ kiểm hỏng GIẢ 57 lần trong 200</h3>
${slide('dv-11', 26, 'grep -q + pipefail: bộ kiểm hỏng giả 57/200 lần — bỏ -q, đẩy ra /dev/null')}
<p>Bản nháp đầu của <code>kiem-vps.sh</code> dùng <code>grep -q</code>, và ngay lần chạy đầu nó báo phép 5 (tự cập nhật bảo mật) là HỎNG trên một cái máy cấu hình đúng. Chạy lại thì ra kết quả khác. Đo thật:</p>
<pre><code class="language-bash">set -o pipefail
a=0; b=0
for i in $(seq 200); do
  apt-config dump | grep -q "Unattended-Upgrade \\"1\\"" || a=$((a+1))
  apt-config dump | grep "Unattended-Upgrade \\"1\\"" &gt;/dev/null || b=$((b+1))
done
echo "grep -q         : hong $a / 200"
echo "grep &gt;/dev/null : hong $b / 200"</code></pre>
<div class="out">$ apt-config dump | wc -l
245
$ bash chap.sh
grep -q         : hong 57 / 200
grep &gt;/dev/null : hong 0 / 200</div>
<p><code>grep -q</code> thoát NGAY khi thấy dòng khớp. <code>apt-config dump</code> vẫn đang ghi 245 dòng của nó; lần ghi tiếp theo đâm vào một cái ống đã đóng, nó chết vì SIGPIPE, và dưới <code>pipefail</code> trạng thái của cả ống chính là cú hỏng đó — nên một cái máy ĐÚNG "hỏng" khoảng một lần trên bốn. Bỏ <code>-q</code>, đẩy output ra <code>/dev/null</code>: <code>grep</code> đọc hết, bên ghi làm xong, 200 trên 200. Cùng cái bẫy ấy nằm trong mọi <code>lệnh-to | grep -q</code>, <code>| head -1</code> hay <code>| head</code> dưới <code>pipefail</code>. Một bộ kiểm chập chờn còn tệ hơn không có: nó dạy cả nhóm LỜ màu đỏ đi — Chương 9 đã đo một bộ canh đỏ suốt 26 ngày cho tới khi không ai còn đọc.</p>

<h3>Khoá học đi tiếp đâu: Chương 12–15</h3>
${slide('dv-11', 27, 'Đi tiếp: Chương 12 tên miền và HTTPS, 13 container và CI, 14 nhiều môi trường, 15 dự án cuối khoá')}
<p>Mục 0 – Chương 11 là phần cốt lõi: một cái máy, bốn bước, và mọi thứ hỏng giữa chúng. Bốn chương mới hơn đưa chính cái máy ấy ra Internet thật và vượt khỏi một máy chủ, và chương nào cũng dùng lại thứ bạn vừa dựng ở đây:</p>
<table>
<tr><th>Chương</th><th>Thêm gì</th><th>Dùng lại gì từ chương này</th></tr>
<tr><td><strong>12 — Từ tên miền tới HTTPS</strong></td><td>nhà đăng ký và bản ghi DNS, TTL và vì sao IP mới "chưa ăn", reverse proxy với chứng chỉ ACME (thử với Pebble, không bao giờ gọi Let&#39;s Encrypt thật), chỉ mở đúng cổng — kể cả chuyện Docker vượt mặt ufw — và CDN trước tệp tĩnh</td><td>phép 8, 11, 12 của <code>nghiem-thu.sh</code>, phép 3 của <code>kiem-vps.sh</code>; mã thoát 6 và 60 của bài 11.2</td></tr>
<tr><td><strong>13 — Container, registry và CI</strong></td><td>Compose trên VPS với ảnh ghim theo commit, build ở máy khác rồi đẩy lên registry, deploy bằng GitHub Actions qua SSH, và tráo container không rơi request</td><td>công thức "Restarting" của 11.3, mã thoát 137/139 của 11.4, kiểm khói sau mỗi lần tráo</td></tr>
<tr><td><strong>14 — Nhiều môi trường, và vượt khỏi một máy</strong></td><td>dev/staging/production từ MỘT ảnh, hai máy sau bộ cân bằng tải với trạng thái dời khỏi máy, VPS so với PaaS so với Kubernetes, và chuyển sang nhà cung cấp mới không mất dữ liệu</td><td>cây bốn bước, giờ áp cho từng máy; câu "đang chạy bản nào" hỏi từng máy một</td></tr>
<tr><td><strong>15 — Dự án cuối khoá</strong></td><td>một app đặt lịch phòng khám kiểu đồ án nhóm, đưa lên trọn vẹn trong ba "ngày", tám sự cố kinh điển dựng lại thật, và <strong>bài thi cuối khoá 20 câu</strong> của toàn khoá</td><td>hai script nghiệm thu làm định nghĩa của "xong"; sổ sự cố làm runbook</td></tr>
</table>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> ngày mai bạn giao VPS của đồ án nhóm cho hội đồng, họ sẽ mở website và có thể đòi xem máy chủ. Chứng minh cả hai đã sẵn sàng — và chứng minh rằng phép chứng minh của bạn hoạt động.</p>
<ol>
<li>Trên VPS thí nghiệm, đặt <code>LO_LOI=1</code> trong một drop-in của <code>ung-dung</code> và dùng site nginx đầu tiên của bài 11.1; chạy <code>nghiem-thu.sh</code> và ghi lại bốn chỗ hỏng.</li>
<li>Áp khối nginx và gỡ drop-in; chạy ba lần.</li>
<li>Dừng ứng dụng; chạy lại và liệt kê những phép vẫn xanh, kèm lý do.</li>
<li>Cho PostgreSQL nghe <code>*</code>, rồi chạy <code>kiem-vps.sh</code>; sửa từng chỗ hỏng theo thứ tự an toàn (allow 22 trước <code>ufw enable</code>).</li>
<li>Đưa <code>grep -q</code> trở lại phép 5 và chạy <code>kiem-vps.sh</code> hai mươi lần: <code>for i in \$(seq 20); do sudo bash kiem-vps.sh | tail -1; done | sort | uniq -c</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>nghiem-thu.sh</code> kết thúc <code>dat 12 / hong 0</code> ba lần liền và <code>dat 4 / hong 8</code> khi app dừng; <code>kiem-vps.sh</code> kết thúc <code>dat 10 / hong 0</code> với <code>cong mo ra ngoai: 22 80 443</code>; và bước 5 cho nhiều hơn một dòng kết quả khác nhau.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Acceptance test (kiểm thử nghiệm thu)</span><span class="v">Kiểm rằng HỆ THỐNG đúng từ chỗ người dùng đứng, không phải rằng lần deploy đã chạy.</span></div>
<div class="kv"><span class="k">Hardening (gia cố)</span><span class="v">Đóng những thứ một máy mới để ngỏ: SSH mật khẩu, cổng thừa, không tường lửa, không cập nhật.</span></div>
<div class="kv"><span class="k">Information leak (rò rỉ thông tin)</span><span class="v">Số phiên bản hay nguyên văn ngoại lệ trả về cho bất cứ ai hỏi.</span></div>
<div class="kv"><span class="k">Flaky check (phép kiểm chập chờn)</span><span class="v">Phép kiểm cho kết quả khác nhau trên một hệ thống không đổi — tệ hơn không có.</span></div>
<div class="kv"><span class="k">SIGPIPE (tín hiệu ống vỡ)</span><span class="v">Gửi cho tiến trình đang ghi vào một ống mà bên đọc đã thoát; có <code>pipefail</code> thì cả ống hỏng.</span></div>
<div class="kv"><span class="k">Loopback (địa chỉ nội bộ)</span><span class="v"><code>127.0.0.1</code>/<code>::1</code>: chỉ chính cái máy đó với tới được.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Script deploy chứng minh lần deploy đã chạy; bộ nghiệm thu từ cửa trước chứng minh hệ thống ĐÚNG.</li>
<li>Kiểm nội dung và header, không chỉ mã; đặt phép "có thật là 500" trước phép "500 có lộ gì không".</li>
<li>Cố ý làm hỏng thứ được kiểm: bộ kiểm phải đỏ — và vài phép vẫn xanh vì chúng chỉ kiểm nginx.</li>
<li>Nghiệm thu cả CÁI MÁY: SSH, cổng mở, tường lửa, cập nhật, dịch vụ khi khởi động, đĩa, cấu hình nginx, sao lưu.</li>
<li><code>grep -q</code> dưới <code>pipefail</code> làm một máy đúng "hỏng" 57/200 lần; bộ kiểm chập chờn dạy người ta lờ màu đỏ.</li>
<li>Chương 12–15 đưa cái máy này ra Internet, vào container và CI, vượt khỏi một máy chủ, và vào dự án cuối khoá.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — server_tokens</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_core_module.html#server_tokens — <code>off</code>, và <code>build</code>/một chuỗi tuỳ ý với module <code>headers_more</code> nếu bạn muốn bỏ hẳn cái header đó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OWASP — Error Handling cheat sheet</span><span class="lc-sub">cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html — khuôn mẫu thông-điệp-chung-ra-ngoài, chi-tiết-vào-log áp dụng ở trên, và còn thứ gì nữa rò rỉ qua các bản trả lời lỗi.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Mozilla Observatory</span><span class="lc-sub">developer.mozilla.org/en-US/observatory — chấm điểm một website đang sống trên đúng những header mà phép kiểm 7, 8 và 14 nhìn vào; một nguồn hợp lý để biết nên thêm gì tiếp theo.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — header bảo mật, và một bộ nghiệm thu cho proxy</span><span class="lc-sub">/courses/nginx/learn${REF} — cùng bài tập đó nhìn từ phía proxy, kể cả một header HSTS bị thiếu mà chính bộ nghiệm thu của nó tìm ra.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">sshd_config(5)</span><span class="lc-sub">man.openbsd.org/sshd_config — <code>PasswordAuthentication</code>, <code>PermitRootLogin</code>, và câu "giá trị đọc được ĐẦU TIÊN sẽ được dùng" — lý do thứ tự drop-in quan trọng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ufw(8) — Ubuntu 24.04</span><span class="lc-sub">manpages.ubuntu.com/manpages/noble/man8/ufw.8.html — <code>allow</code>, <code>enable</code>, <code>status</code>; cho phép SSH trước khi bật trên một máy ở xa.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Ubuntu Server — Automatic updates</span><span class="lc-sub">ubuntu.com/server/docs/how-to/software/automatic-updates/ — <code>unattended-upgrades</code> và các thiết lập <code>APT::Periodic</code> mà phép 5 đọc.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">bash(1) — pipefail</span><span class="lc-sub">man7.org/linux/man-pages/man1/bash.1.html — "trạng thái trả về của một ống là giá trị của lệnh CUỐI CÙNG thoát khác 0", luật nằm sau 57 lần hỏng giả.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 11.6 ─────────────────────────── */
    {
      title: '11.6 — Core exam (Sections 0–11)|||11.6 — Bài thi phần cốt lõi (Mục 0–11)',
      slug: 'deploy-11-6-thi-cuoi',
      type: 'QUIZ',
      description: 'Mười câu tình huống trải Mục 0 tới Chương 11 — bước nào trong bốn bước hỏng, tạo tác sai nền tảng, rsync đứt giữa chừng, khoảng 502 khi khởi động lại, cấu hình không lùi theo tạo tác, hàng đợi khoá, ca duy nhất không được lùi, bộ kiểm chưa từng đỏ, quẫy swap và bản sao lưu chưa từng phục hồi. Bài thi cuối khoá 20 câu nằm ở Chương 15.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.6</span>
<h2>Core exam (Sections 0–11)</h2>
<p class="lead">Ten questions, fifteen minutes, drawn from Section 0 through Chapter 11. Each one comes from something this course measured on a real machine rather than described.</p>
<div class="callout">
<p><strong>The through-line.</strong> A deploy is four steps — build an artifact, move it, swap it in, prove it works — and this course measured every way each one fails quietly. The pattern that recurred in every single chapter: <strong>the check said yes and the system was wrong.</strong> A health check returning 200 with every endpoint at 500 (6.2). A rollback that succeeded while users got the old version for five minutes (6.5). A confirmation prompt exiting 0 without deploying (7.3). A readiness check burning 3,022 ms to learn nothing (7.4). A build exiting 0 while the database was killed (8.2). A load average of 0.10 on a fully saturated machine (9.1). A health check at 200 with the homepage at 502 (9.5). A restore exiting 0 with a 400,170-row table empty (10.3). And an acceptance check passing because it was pointed at a 404 (11.5). The recurring answer was also the same every time: <em>verify from where the user stands, compare against what should be true, and make the check fail on purpose before you trust it.</em></p>
</div>
<p><strong>This is the core exam, not the end of the course.</strong> It covers the part of the course built on one machine — the four steps and everything that fails between them. Chapters 12–15 then take the same machine onto the Internet (domain, HTTPS), into containers and CI, past one server, and into a capstone project; the comprehensive <strong>20-question final exam</strong> of the whole course is Lesson 15.5. Most questions here ask "which step broke" or "which command tells you", and each answer explains why the most tempting wrong option is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can walk the four-step tree — build, move, swap, prove — and name the first step that says "no".</li>
<li>I can tell which version is running from three places: the front door, the symlink and <code>/proc/PID/cwd</code>.</li>
<li>I can read a failure&#39;s signature — status code and time — and curl&#39;s own exit code when there is no status.</li>
<li>I know when rolling back is wrong: when the previous release cannot read the current schema.</li>
<li>I can find memory, disk and inode problems in order, and explain exit codes 137, 134 and 139.</li>
<li>I can run an acceptance check from the front door and a machine check before hand-over — and have seen both fail on purpose.</li>
</ul>
${slide('dv-11', 29, 'Bảng tra nhanh Chương 11 (1/2): năm phút đầu')}
${slide('dv-11', 30, 'Bảng tra nhanh Chương 11 (2/2): tài nguyên và nghiệm thu')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.6</span>
<h2>Bài thi phần cốt lõi (Mục 0–11)</h2>
<p class="lead">Mười câu, mười lăm phút, rút từ Mục 0 tới Chương 11. Mỗi câu tới từ một thứ mà khoá này đã ĐO trên một cái máy thật chứ không phải mô tả lại.</p>
<div class="callout">
<p><strong>Sợi chỉ xuyên suốt.</strong> Một lần deploy là bốn bước — dựng tạo tác, chuyển đi, tráo vào, chứng minh nó chạy — và khoá này đã đo MỌI cách mà từng bước hỏng một cách âm thầm. Cái khuôn mẫu lặp lại ở TỪNG chương: <strong>phép kiểm nói CÓ và hệ thống thì SAI.</strong> Một chốt kiểm sức khoẻ trả 200 trong khi mọi endpoint trả 500 (6.2). Một cú lùi thành công trong khi người dùng nhận bản cũ suốt năm phút (6.5). Một lời hỏi xác nhận thoát 0 mà không deploy (7.3). Một phép kiểm sẵn sàng đốt 3.022 ms để học được con số không (7.4). Một bản dựng thoát 0 trong khi cơ sở dữ liệu bị giết (8.2). Một load average 0,10 trên một cái máy bão hoà hoàn toàn (9.1). Một chốt kiểm sức khoẻ ở 200 với trang chủ ở 502 (9.5). Một cú phục hồi thoát 0 với một bảng 400.170 dòng RỖNG (10.3). Và một phép kiểm nghiệm thu ĐẠT vì nó bị chĩa vào một cái 404 (11.5). Câu trả lời lặp lại cũng y hệt nhau mỗi lần: <em>kiểm từ CHỖ NGƯỜI DÙNG ĐỨNG, đối chiếu với thứ LẼ RA phải đúng, và bắt phép kiểm HỎNG một cách có chủ đích trước khi tin nó.</em></p>
</div>
<p><strong>Đây là bài thi phần CỐT LÕI, chưa phải cuối khoá.</strong> Nó phủ phần khoá học dựng trên một cái máy — bốn bước và mọi thứ hỏng giữa chúng. Chương 12–15 sau đó đưa chính cái máy ấy ra Internet (tên miền, HTTPS), vào container và CI, vượt khỏi một máy chủ, và vào một dự án cuối khoá; <strong>bài thi cuối khoá toàn diện 20 câu</strong> là Bài 15.5. Phần lớn câu hỏi ở đây hỏi "bước nào hỏng" hoặc "lệnh nào cho bạn biết", và mỗi đáp án giải thích vì sao phương án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đi được cây bốn bước — dựng, chuyển, tráo, chứng minh — và gọi tên bước đầu tiên nói "không".</li>
<li>Tôi biết bản nào đang chạy từ ba chỗ: cửa trước, symlink và <code>/proc/PID/cwd</code>.</li>
<li>Tôi đọc được chữ ký của một cú hỏng — mã trạng thái và thời gian — và mã thoát của curl khi không có mã trạng thái.</li>
<li>Tôi biết khi nào lùi bản là SAI: khi bản trước không đọc được lược đồ hiện tại.</li>
<li>Tôi tìm được vấn đề bộ nhớ, đĩa và inode theo đúng thứ tự, và giải thích được mã thoát 137, 134 và 139.</li>
<li>Tôi chạy được bộ nghiệm thu từ cửa trước và bộ kiểm cái máy trước khi giao — và đã thấy cả hai HỎNG có chủ đích.</li>
</ul>
${slide('dv-11', 29, 'Bảng tra nhanh Chương 11 (1/2): năm phút đầu')}
${slide('dv-11', 30, 'Bảng tra nhanh Chương 11 (2/2): tài nguyên và nghiệm thu')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'The deploy script exited 0. readlink -f /srv/app/hien-tai prints /srv/app/ban/v2, readlink /proc/$PID/cwd for the running app prints /srv/app/ban/v1, and the front door serves v1. In the four-step model, which step failed?|||Script deploy thoát 0. readlink -f /srv/app/hien-tai in ra /srv/app/ban/v2, readlink /proc/$PID/cwd của app đang chạy in ra /srv/app/ban/v1, và cửa trước phục vụ v1. Theo mô hình bốn bước, bước nào đã hỏng?',
            options: [
              'Build — the v2 artifact was never produced|||Dựng — tạo tác v2 chưa bao giờ được tạo ra',
              'Move — the v2 files never reached the server|||Chuyển — các tệp v2 chưa bao giờ tới máy chủ',
              'Swap — the symlink moved but the process was never restarted, so it still runs from v1’s directory|||Tráo — symlink đã đổi nhưng tiến trình chưa được khởi động lại, nên nó vẫn chạy từ thư mục của v1',
              'Prove — the smoke test is pointed at the wrong URL|||Chứng minh — phép kiểm khói đang chĩa sai URL',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Build and move both succeeded — ban/v2 exists and the symlink points at it. The swap is two actions, repoint and restart, and only the first happened; a running process keeps its working directory and never follows a symlink (measured in 11.1: started 14:23:17, link changed 14:23:20). "Prove" is tempting because a good smoke test should have caught it, but a check that failed to notice is a second problem — the first "no" in the tree is at step 3.|||VI: Dựng và chuyển đều thành công — ban/v2 có mặt và symlink trỏ vào nó. Tráo gồm HAI việc, trỏ lại và khởi động lại, và mới có việc đầu; một tiến trình đang chạy giữ nguyên thư mục làm việc của nó và không bao giờ đi theo symlink (đo ở 11.1: khởi động 14:23:17, link đổi 14:23:20). "Chứng minh" hấp dẫn vì một phép kiểm khói tốt lẽ ra đã bắt được, nhưng phép kiểm không nhận ra là vấn đề THỨ HAI — chữ "không" đầu tiên trên cây nằm ở bước 3.',
          },
          {
            question: 'You run npm ci on your Mac (arm64) and rsync the whole folder, node_modules included, to the Ubuntu VPS (amd64). The app crashes at start with an error about a native module built for the wrong platform. Which step is wrong, and what fixes it?|||Bạn chạy npm ci trên Mac (arm64) rồi rsync cả thư mục, kể cả node_modules, lên VPS Ubuntu (amd64). App sập ngay khi khởi động với lỗi một module native dựng cho sai nền tảng. Bước nào sai, và chữa bằng gì?',
            options: [
              'Step 1, the artifact: build it for the target — npm ci on Linux (the VPS or CI) or an image built with --platform linux/amd64 — and never ship node_modules from a laptop|||Bước 1, tạo tác: dựng nó cho máy đích — npm ci trên Linux (VPS hoặc CI) hoặc ảnh dựng với --platform linux/amd64 — và đừng bao giờ gửi node_modules từ laptop',
              'Step 2, transport: rsync damaged the binary files; add --checksum|||Bước 2, vận chuyển: rsync làm hỏng tệp nhị phân; thêm --checksum',
              'Step 3, swap: the service must be restarted after rsync|||Bước 3, tráo: phải khởi động lại dịch vụ sau rsync',
              'Step 4, prove: the smoke test ran before the app was ready|||Bước 4, chứng minh: kiểm khói chạy trước khi app sẵn sàng',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The bytes arrived intact — they are simply the wrong bytes. Native modules are compiled for one OS and CPU, and the lockfile pins versions, not platforms (Chapter 1). --checksum is the tempting answer, but it would faithfully copy the same Mac binaries again; restarting (C) only crashes faster. The fix belongs to step 1: produce the artifact for the machine that will run it.|||VI: Các byte tới nơi nguyên vẹn — chỉ là chúng là byte SAI. Module native được biên dịch cho một hệ điều hành và một loại CPU, còn lockfile ghim phiên bản chứ không ghim nền tảng (Chương 1). --checksum là đáp án hấp dẫn, nhưng nó sẽ chép lại y nguyên đúng những tệp của Mac; khởi động lại (C) chỉ làm sập nhanh hơn. Cách chữa thuộc bước 1: tạo ra tạo tác cho đúng cái máy sẽ chạy nó.',
          },
          {
            question: 'An rsync straight into the live directory is cut by a network drop after 4 seconds. Users now get a mix of old and new files and some pages crash. Which design prevents this whole class of failure?|||Một lần rsync thẳng vào thư mục đang chạy bị mạng cắt sau 4 giây. Người dùng giờ nhận một mớ tệp cũ lẫn mới và vài trang sập. Thiết kế nào ngăn được cả lớp hỏng này?',
            options: [
              'Add rsync --partial so an interrupted copy can resume|||Thêm rsync --partial để lần chép bị ngắt có thể chép tiếp',
              'Use scp instead of rsync, since it copies whole files|||Dùng scp thay rsync, vì nó chép nguyên tệp',
              'Add -z so the transfer finishes before the network drops|||Thêm -z để việc truyền xong trước khi mạng rớt',
              'Upload into a new release directory, verify it, and only then switch with one atomic step such as a symlink swap|||Tải lên một thư mục bản phát hành MỚI, kiểm nó, rồi mới chuyển bằng MỘT bước nguyên tử như tráo symlink',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Interruptions will happen; the fix is making what users see change only at one atomic moment, after the copy is complete (Chapter 2 measured the half-old, half-new directory). --partial is tempting, but while the copy is resuming the live directory is still half old and half new; scp and -z only change how bytes travel, not when users see them.|||VI: Việc bị ngắt rồi sẽ xảy ra; cách chữa là làm cho thứ người dùng thấy chỉ đổi tại MỘT thời điểm nguyên tử, sau khi bản chép đã xong (Chương 2 đo thư mục nửa cũ nửa mới). --partial nghe hấp dẫn, nhưng trong lúc chép tiếp thì thư mục đang chạy vẫn nửa cũ nửa mới; scp và -z chỉ đổi cách byte đi, không đổi lúc người dùng thấy chúng.',
          },
          {
            question: 'Every deploy restarts the app in place, and your request loop shows about 1.5 s of 502s — the time the app needs to boot. A teammate proposes shrinking the image so it boots in 0.8 s. Why is that not the fix, and what is?|||Mỗi lần deploy khởi động lại app tại chỗ, và vòng lặp request của bạn thấy khoảng 1,5 giây toàn 502 — đúng thời gian app cần để lên. Bạn cùng nhóm đề xuất thu nhỏ ảnh để app lên trong 0,8 giây. Vì sao đó không phải cách chữa, và cách chữa là gì?',
            options: [
              'It is the fix: under one second, users do not notice|||Đó chính là cách chữa: dưới một giây thì người dùng không nhận ra',
              'It only shortens the gap; start the new version alongside the old one, wait for its health check, switch the proxy, then drain the old one|||Nó chỉ rút ngắn khoảng trống; khởi động bản mới SONG SONG với bản cũ, chờ phép kiểm sức khoẻ của nó, chuyển proxy, rồi mới cho bản cũ chạy nốt',
              'Set Restart=always so systemd brings the app back sooner|||Đặt Restart=always để systemd đưa app lên lại sớm hơn',
              'Raise proxy_read_timeout so nginx waits for the new process|||Tăng proxy_read_timeout để nginx chờ tiến trình mới',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Stop-then-start always leaves a window with nothing listening, and every request in it is refused — a faster boot shrinks the window, it cannot remove it. Blue-green removes it (Chapter 3 measured zero failures). Raising proxy_read_timeout is the tempting option, but a refused connection fails at connect(), instantly, as 11.2 measured; there is nothing to read and so nothing to wait for.|||VI: Dừng-rồi-khởi-động luôn để lại một khoảng không ai nghe cổng, và mọi request rơi vào đó bị từ chối — lên nhanh hơn thu hẹp khoảng ấy chứ không xoá được. Xanh-lam (blue-green) xoá được nó (Chương 3 đo không lỗi nào). Tăng proxy_read_timeout là phương án hấp dẫn, nhưng một kết nối bị từ chối hỏng ngay ở connect(), tức thì, như 11.2 đã đo; chẳng có gì để đọc nên cũng chẳng có gì để chờ.',
          },
          {
            question: 'v2 renamed the environment variable DB_URL to DATABASE_URL in /opt/app/.env. v2 turns out broken, so you roll the artifact back to v1 in 140 ms — and v1 now exits 1 on start with "DB_URL undefined". What does this show?|||v2 đổi tên biến môi trường DB_URL thành DATABASE_URL trong /opt/app/.env. v2 hoá ra bị hỏng, nên bạn lùi tạo tác về v1 trong 140 ms — và giờ v1 thoát 1 ngay khi khởi động với "DB_URL undefined". Điều này cho thấy gì?',
            options: [
              'The rollback script has a bug|||Script lùi bản có lỗi',
              'The v1 artifact was corrupted on disk|||Tạo tác v1 bị hỏng trên đĩa',
              'Configuration lives outside the artifact and did not roll back with it; rename config the expand/contract way, keeping both names until no running release needs the old one|||Cấu hình nằm NGOÀI tạo tác và không lùi theo nó; đổi tên cấu hình theo kiểu mở rộng/thu hẹp, giữ cả hai tên cho tới khi không bản nào đang chạy còn cần tên cũ',
              'Environment variables should be baked into the image so they roll back together|||Biến môi trường nên được nướng vào ảnh để lùi cùng nhau',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: An artifact rollback moves code only; the .env file is deliberately outside the artifact (Chapter 4) and still holds v2’s names — exactly the case Lesson 6.1 measured. Baking config into the image is the tempting fix, but it breaks "one artifact for every environment" and puts secrets into images and registries. Treat a config rename like a column rename: add the new name, keep the old, remove it later.|||VI: Lùi tạo tác chỉ dời MÃ; tệp .env cố ý nằm ngoài tạo tác (Chương 4) và vẫn giữ tên của v2 — đúng cái ca bài 6.1 đã đo. Nướng cấu hình vào ảnh là cách chữa hấp dẫn, nhưng nó phá "một tạo tác cho mọi môi trường" và đưa bí mật vào ảnh lẫn registry. Hãy đổi tên cấu hình như đổi tên cột: thêm tên mới, giữ tên cũ, gỡ nó sau.',
          },
          {
            question: 'During a deploy the whole site freezes. pg_stat_activity shows your migration’s ALTER TABLE waiting for a lock held by a long report query, and dozens of ordinary SELECTs waiting behind the ALTER. What prevents this next time?|||Trong lúc deploy, cả website đứng hình. pg_stat_activity cho thấy câu ALTER TABLE của migration đang chờ một cái khoá do một truy vấn báo cáo dài giữ, và hàng chục câu SELECT bình thường xếp hàng sau câu ALTER. Điều gì ngăn được chuyện này lần sau?',
            options: [
              'SET lock_timeout for the migration (a few seconds) so it gives up and retries instead of queueing everyone behind it|||SET lock_timeout cho migration (vài giây) để nó bỏ cuộc rồi thử lại thay vì bắt mọi người xếp hàng sau nó',
              'Give the migration a higher statement_timeout so it has time to finish|||Cho migration statement_timeout cao hơn để nó có thời gian chạy xong',
              'Restart PostgreSQL whenever a migration hangs|||Khởi động lại PostgreSQL mỗi khi migration bị treo',
              'Add an index on the table first|||Thêm một chỉ mục cho bảng trước',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: ALTER TABLE needs an exclusive lock; while it waits, every later query on that table queues behind it, so one slow report freezes the site (Chapter 5 measured a 2,606 ms ALTER blocking 5 of 60 writes). lock_timeout bounds the damage. A higher statement_timeout is the tempting option, but it lets the ALTER wait even longer — the queue grows. Restarting the database turns a freeze into an outage.|||VI: ALTER TABLE cần khoá độc quyền; trong lúc nó chờ, mọi truy vấn sau đó trên bảng ấy xếp hàng sau nó, nên một báo cáo chậm làm đứng cả website (Chương 5 đo một câu ALTER 2.606 ms chặn 5 trên 60 lệnh ghi). lock_timeout giới hạn thiệt hại. statement_timeout cao hơn là phương án hấp dẫn, nhưng nó để câu ALTER chờ còn lâu hơn — hàng đợi càng dài. Khởi động lại CSDL biến đứng hình thành sập hẳn.',
          },
          {
            question: 'v2’s migration dropped a column that v1 reads, and v2 is now writing wrong data. A teammate wants to roll back to v1 at once — "roll back first, diagnose later". What do you do?|||Migration của v2 đã XOÁ một cột mà v1 đọc, và v2 đang ghi dữ liệu sai. Bạn cùng nhóm muốn lùi về v1 ngay — "lùi trước, chẩn đoán sau". Bạn làm gì?',
            options: [
              'Roll back anyway — the rule has no exceptions|||Cứ lùi — quy tắc không có ngoại lệ',
              'Restore last night’s database backup over production|||Phục hồi bản sao lưu CSDL đêm qua đè lên production',
              'Stop the database until a fix is ready|||Dừng CSDL cho tới khi có bản sửa',
              'This is the one exception: v1 cannot run on the current schema, so roll forward — ship a fix or re-add the column with a new migration — then clean the bad rows|||Đây là ngoại lệ DUY NHẤT: v1 không chạy được trên lược đồ hiện tại, nên đi tới — phát hành bản sửa hoặc thêm lại cột bằng một migration mới — rồi dọn các dòng sai',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: "Roll back first" holds only while the previous release still runs on the current schema; here the rollback distance is zero, and v1 would answer 500 everywhere (6.2). Restoring last night’s backup is the tempting "clean" option, but it throws away a day of real orders and bookings; stopping the database turns a data problem into a full outage. Roll forward, then repair the rows v2 wrote (6.3).|||VI: "Lùi trước" chỉ đúng khi bản trước còn chạy được trên lược đồ hiện tại; ở đây tầm lùi bằng không, và v1 sẽ trả 500 khắp nơi (6.2). Phục hồi bản sao lưu đêm qua là phương án "sạch sẽ" hấp dẫn, nhưng nó vứt đi cả một ngày đơn hàng và lịch hẹn thật; dừng CSDL biến một vấn đề dữ liệu thành sập toàn bộ. Hãy đi tới, rồi sửa các dòng v2 đã ghi (6.3).',
          },
          {
            question: 'Your deploy script’s smoke test has passed on every deploy for three months, yet last week users got a broken page after a deploy. Before trusting the smoke test again, what is the single most useful thing to do?|||Phép kiểm khói trong script deploy đã đạt ở mọi lần deploy suốt ba tháng, vậy mà tuần trước người dùng vẫn gặp trang hỏng sau một lần deploy. Trước khi tin lại phép kiểm khói, việc hữu ích NHẤT là gì?',
            options: [
              'Add more routes to the list|||Thêm nhiều route hơn vào danh sách',
              'Break its target on purpose — stop the app, deploy a build missing a route — and confirm it turns red and the script rolls back|||Cố ý làm hỏng thứ nó kiểm — dừng app, deploy một bản thiếu route — và xác nhận nó chuyển ĐỎ và script lùi bản',
              'Run it twice on every deploy|||Chạy nó hai lần mỗi lần deploy',
              'Switch every check to curl -sf so any HTTP error fails it|||Chuyển mọi phép kiểm sang curl -sf để lỗi HTTP nào cũng làm nó hỏng',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: A check nobody has seen fail is a check nobody has tested: 11.5 measured one that passed because it was pointed at a 404, and showed four checks staying green with the app dead because they only test nginx. curl -sf is the tempting answer, but it makes every protected route (401) look broken — the false alarm 7.4 measured — and still proves nothing about the check itself.|||VI: Một phép kiểm chưa ai thấy HỎNG là phép kiểm chưa ai thử: 11.5 đo một phép kiểm đạt vì bị chĩa vào trang 404, và cho thấy bốn phép vẫn xanh khi app đã chết vì chúng chỉ kiểm nginx. curl -sf là đáp án hấp dẫn, nhưng nó làm mọi route cần đăng nhập (401) trông như hỏng — báo động giả mà 7.4 đã đo — và vẫn chẳng chứng minh gì về chính phép kiểm.',
          },
          {
            question: 'Pages take four seconds, /health is green, and the load average is modest. vmstat 1 shows si and so both in the thousands on every line after the first. What is happening, and what helps?|||Trang mất bốn giây, /health xanh, load average ở mức vừa phải. vmstat 1 cho thấy si và so đều hàng nghìn ở mọi dòng sau dòng đầu. Chuyện gì đang xảy ra, và cái gì giúp được?',
            options: [
              'Swap thrashing: the working set no longer fits in RAM — cut memory use or add RAM; more CPU will not help|||Quẫy swap: tập dữ liệu đang dùng không còn vừa RAM — giảm dùng bộ nhớ hoặc thêm RAM; thêm CPU không giúp gì',
              'CPU saturation: add cores|||Nghẽn CPU: thêm nhân',
              'A failing disk: replace it|||Đĩa sắp hỏng: thay đĩa',
              'Network latency: move the server closer to users|||Độ trễ mạng: dời máy chủ lại gần người dùng',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: si/so non-zero second after second means pages are pushed to swap and pulled back on almost every access — Chapter 8 measured 56–66 ms against 0.14 ms for the same reads, a process alive and unusable. /health stays green because it touches almost no memory. CPU saturation is the tempting reading of "slow", but it shows as r above the core count and id near 0, not as swap traffic; and the first vmstat line is the average since boot, so it proves nothing either way (11.4).|||VI: si/so khác 0 giây này qua giây khác nghĩa là các trang bị đẩy ra swap rồi kéo về gần như mỗi lần truy cập — Chương 8 đo 56–66 ms so với 0,14 ms cho cùng phép đọc, một tiến trình còn sống mà không dùng được. /health vẫn xanh vì nó gần như không đụng bộ nhớ. Nghẽn CPU là cách đọc "chậm" hấp dẫn, nhưng nó hiện thành r lớn hơn số nhân và id gần 0, không phải lưu lượng swap; và dòng đầu của vmstat là trung bình từ lúc khởi động nên chẳng chứng minh được gì (11.4).',
          },
          {
            question: 'The nightly backup job exits 0, the file has a plausible size, and pg_restore --list reads it without error. The group wants to write "backups: OK" in the hand-over checklist. What does "OK" actually require?|||Tác vụ sao lưu hằng đêm thoát 0, tệp có kích thước hợp lý, và pg_restore --list đọc nó không lỗi. Nhóm muốn ghi "sao lưu: OK" vào checklist bàn giao. "OK" thật sự đòi hỏi gì?',
            options: [
              'Nothing more — three independent checks already passed|||Không gì thêm — ba phép kiểm độc lập đã đạt',
              'Encrypting the file before storing it|||Mã hoá tệp trước khi cất',
              'Keeping at least seven copies|||Giữ ít nhất bảy bản',
              'A timed restore into a separate database, compared table by table against the source — a truncated dump once passed all three checks above and restored a 400,170-row table as empty|||Một lần phục hồi CÓ BẤM GIỜ vào một CSDL riêng, đối chiếu từng bảng với nguồn — một bản dump bị cắt cụt từng qua cả ba phép kiểm trên và phục hồi một bảng 400.170 dòng thành RỖNG',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Exit code, size and a readable table of contents are all properties of the file, and Chapter 10 measured a truncated dump passing every one of them; only restoring and comparing row counts proves the data is there, and timing it gives you the real recovery time. kiem-vps.sh’s check 10 only proves that a recent file exists. Encryption and copies are good practice, but seven copies of an empty table are still empty.|||VI: Mã thoát, kích thước và một mục lục đọc được đều là tính chất của TỆP, và Chương 10 đã đo một bản dump cắt cụt qua được tất cả; chỉ có phục hồi rồi đối chiếu số dòng mới chứng minh dữ liệu có ở đó, và bấm giờ cho bạn thời gian khôi phục thật. Phép 10 của kiem-vps.sh chỉ chứng minh có một tệp mới. Mã hoá và nhiều bản sao là thói quen tốt, nhưng bảy bản sao của một bảng rỗng vẫn rỗng.',
          },
        ],
      },
    },
  ],
};
