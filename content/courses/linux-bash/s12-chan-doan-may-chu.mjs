/**
 * Linux & Bash — Chương 12: chẩn đoán một máy chủ thật.
 * Phương pháp · nó chết · nó chậm · nó lạ · tổng kết khoá · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 12 — Diagnosing a real server|||Chương 12 — Chẩn đoán một máy chủ thật',
  description: 'Sách công thức để mở ra GIỮA LÚC SỰ CỐ. Một phương pháp dùng được trên cái máy bạn chưa từng thấy, rồi ba chương công thức theo triệu chứng — nó chết, nó chậm, nó lạ — và cuối cùng là tổng kết cả khoá.',
  lessons: [
    /* ─────────────────────────── 12.1 ─────────────────────────── */
    {
      title: '12.1 — A method for a machine you have never seen|||12.1 — Một phương pháp cho cái máy bạn chưa từng thấy',
      slug: 'lnx-12-1-phuong-phap',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vòng lặp chẩn đoán, một cuộc quét sáu mươi giây dán một phát là chạy, ba câu hỏi chẻ đôi bài toán, dựng lại mốc thời gian, và vì sao "khởi động lại thử xem" là câu trả lời tệ thứ hai.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>A method for a machine you have never seen</h2>
<p class="lead">Somebody sends you an IP address and a sentence: <em>"the site is down"</em>. You have SSH access and nothing else — no dashboard, no context, no idea what runs on this box. Eleven chapters have given you the commands. This one gives you the order to run them in, which is the part that turns a two-hour panic into a ten-minute fix.</p>
<p>The method below is not clever. It is deliberately boring, because clever is what fails at 3am when you are the only person awake.</p>

<h3>The loop</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Observe, before touching anything</span><span class="lz-t">the 60-second sweep, below</span><span class="lz-d">Wide and cheap. You are not looking for the cause yet — you are looking for which HALF of the machine is unhappy. Restarting things now destroys the evidence that would have told you.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Establish the timeline</span><span class="lz-t">when did it start, and what changed just before</span><span class="lz-d">"It broke at 14:07" plus "we deployed at 14:05" is a solved incident. Most outages have a cause you can name in the last hour of history.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Narrow to one component</span><span class="lz-t">machine, or network, or app, or data</span><span class="lz-d">Each check should eliminate roughly half of what is left. If a check cannot eliminate anything regardless of its result, do not run it.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Form ONE hypothesis and state it out loud</span><span class="lz-t">"nginx is up, the backend is not listening on 3000"</span><span class="lz-d">A hypothesis you can say in a sentence is a hypothesis you can test in a command. If you cannot say it, you are guessing — go back to step 1.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Change ONE thing, and write it down</span><span class="lz-t">then re-test</span><span class="lz-d">Two changes at once means you never learn which one worked, and one of them may be a new bug you will meet next week.</span></div>
  <div class="lz-step"><span class="lz-k">6 · Fix the cause, then the surprise</span><span class="lz-t">why did nothing tell us?</span><span class="lz-d">The incident ends when the service is back. The work ends when the same failure cannot be silent a second time (Lesson 10.3, 11.2).</span></div>
</div>

<h3>The first sixty seconds</h3>
<p>One paste, no arguments, safe on any machine — it reads and changes nothing. Run it before you form any opinion at all.</p>
<pre><code>{
  echo "=== who and when ==="; uptime; who; last reboot | head -3
  echo "=== failed units ==="; systemctl --failed --no-legend
  echo "=== errors this boot ==="; journalctl -p err -b --no-pager | tail -15
  echo "=== disk ==="; df -h | grep -vE 'tmpfs|udev'; df -i | grep -vE 'tmpfs|udev' | head -3
  echo "=== memory ==="; free -h
  echo "=== top by cpu ==="; ps aux --sort=-%cpu | head -6
  echo "=== top by mem ==="; ps aux --sort=-%mem | head -6
  echo "=== listening ==="; ss -tlnp 2&gt;/dev/null | head -12
  echo "=== kernel ==="; dmesg -T 2&gt;/dev/null | tail -10
} 2&gt;&amp;1 | tee /tmp/sweep-\$(date +%H%M%S).txt</code></pre>
<div class="out">=== who and when ===
 18:41:02 up 12 days,  3:22,  1 user,  load average: 6.84, 4.11, 2.07
deploy   pts/0    203.0.113.55     18:39   still_logged_in
reboot   system boot  6.8.0-45-generic Sun Aug 10 15:19
=== failed units ===
backend.service loaded failed failed Node API
=== errors this boot ===
Aug 22 18:33:41 vps-1 backend[3912]: Error: connect ECONNREFUSED 127.0.0.1:5432
Aug 22 18:33:41 vps-1 systemd[1]: backend.service: Main process exited, code=exited, status=1/FAILURE
Aug 22 18:34:12 vps-1 kernel: Out of memory: Killed process 3401 (postgres)
=== disk ===
/dev/vda1        79G   72G  3.1G  96% /
=== memory ===
               total        used        free      shared  buff/cache   available
Mem:           1.9Gi       1.7Gi        91Mi        12Mi       143Mi       112Mi
Swap:             0B          0B          0B</div>
<p>That sweep took four seconds and the incident is already solved: PostgreSQL was killed by the OOM killer at 18:34, the backend then could not connect and exited, and the machine has no swap and 96% disk. You have not restarted anything, and you can now describe the failure in one sentence — which is the difference between fixing it and making it worse.</p>
<div class="callout ok"><strong><code>tee</code> the sweep to a file.</strong> Ten minutes from now you will want to know what memory looked like <em>before</em> you started changing things, and by then the machine will have moved on. A saved sweep is also the thing you paste into a chat when you ask a colleague, instead of retyping a description that leaves out the one line that mattered.</div>

<h3>Reading the sweep</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">load average: 6.84, 4.11, 2.07</span><span class="v">Rising left to right means it is getting WORSE right now (Lesson 5.2). Compare the numbers to the core count from <code>nproc</code> — 6.8 on 2 cores is a queue; 6.8 on 16 cores is a Tuesday.</span></div>
  <div class="kv"><span class="k">up 12 days</span><span class="v">Rules out "it rebooted". A short uptime you did not expect is itself the finding — check <code>last reboot</code> and <code>journalctl -k -b -1</code> for what happened before it.</span></div>
  <div class="kv"><span class="k">systemctl --failed</span><span class="v">An empty list is a strong signal that the machine is fine and your problem is elsewhere — the network, the database, the client. One line here usually IS the incident.</span></div>
  <div class="kv"><span class="k">Out of memory: Killed process</span><span class="v">The kernel chose a victim (Lesson 5.2). Whatever died is a SYMPTOM; the cause is whatever grew. Look at what was consuming memory just before, not just at what died.</span></div>
  <div class="kv"><span class="k">96% / and Swap: 0B</span><span class="v">Two independent problems, and both make everything else worse. A near-full disk breaks writes, logs and database checkpoints (Lesson 10.1); no swap means memory spikes kill processes instead of merely slowing them (Lesson 11.3).</span></div>
  <div class="kv"><span class="k">ss -tlnp</span><span class="v">Which ports are actually served, and by which process. "The port is not listening" and "the port is listening but refusing" are completely different bugs (Lesson 9.1).</span></div>
</div>

<h3>Three questions that halve the problem</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Question 1</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Is it the machine, or the app?</span><span class="lz-nsub">Can you SSH in? Is load normal, disk fine, memory fine? If yes to all, stop looking at the machine — you are debugging an application, and Chapter 12's later lessons split accordingly.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Question 2</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Did it EVER work, and what changed?</span><span class="lz-nsub">Never worked = configuration or environment. Worked until 14:07 = something changed at 14:07. These are different investigations, and asking first saves you from running the wrong one.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Question 3</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Is it everyone, or just you?</span><span class="lz-nsub">Test from the server itself with <code>curl localhost</code> (Lesson 9.2). Working locally but not from outside puts the fault in DNS, TLS, the firewall or the proxy — none of which are the app.</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment"># Question 3, as three commands — each rules out one layer</span>
curl -sS -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:3000/health   <span class="tok-comment"># the app itself</span>
curl -sS -o /dev/null -w '%{http_code}\\n' http://127.0.0.1/health        <span class="tok-comment"># through nginx</span>
curl -sS -o /dev/null -w '%{http_code}\\n' https://example.com/health     <span class="tok-comment"># through DNS + TLS + firewall</span></code></pre>
<div class="out">200
200
000</div>
<p>App healthy, proxy healthy, the outside world getting nothing. In three seconds you have eliminated everything you were about to spend an hour reading, and the remaining suspects are DNS, TLS, the firewall and the provider's network — a list of four, not a list of everything.</p>

<h3>Build the timeline</h3>
<p>Almost every outage has a "just before". Finding it is usually faster than understanding the failure, and it frequently makes understanding the failure unnecessary.</p>
<pre><code><span class="tok-comment"># When did the machine last change?</span>
journalctl --since '2 hours ago' -p warning --no-pager | head -30
grep -E ' (install|upgrade|remove) ' /var/log/dpkg.log | tail -10   <span class="tok-comment"># packages</span>
ls -lt /etc | head -10                                             <span class="tok-comment"># recently edited config</span>
last -n 10                                                         <span class="tok-comment"># who logged in</span>
sudo journalctl _COMM=sudo --since today | tail -10                <span class="tok-comment"># what they ran with sudo</span>
git -C /srv/app log --oneline -5 --date=iso --pretty='%h %ad %s'   <span class="tok-comment"># what was deployed</span></code></pre>
<div class="out">2026-08-22 14:05:11 +0000 8fbd829 chore: bump image cache TTL to 30d
2026-08-22 09:12:40 +0000 d354882 feat: add /api/v1/reports
$ sudo journalctl _COMM=sudo --since today | tail -3
Aug 22 14:04:58 vps-1 sudo[38801]: deploy : TTY=pts/1 ; PWD=/srv/app ; USER=root ; COMMAND=/usr/bin/systemctl restart backend
Aug 22 14:07:02 vps-1 sudo[38844]: deploy : TTY=pts/1 ; PWD=/etc/nginx ; USER=root ; COMMAND=/usr/bin/nano sites-enabled/app.conf</div>
<p>Somebody edited an nginx config at 14:07 and the symptom started at 14:07. That is not proof, but it is where you look first, and <code>nginx -t</code> plus <code>git diff</code> will confirm or eliminate it in ten seconds.</p>
<div class="callout"><strong><code>ls -lt /etc | head</code> is the single most underrated diagnostic on this page.</strong> Configuration files do not change themselves. A file in <code>/etc</code> with a modification time inside your incident window is either the cause or the failed attempt to fix it, and either way you want to know before you start reading code.</div>

<h3>The rule about restarting</h3>
<p>"Have you tried restarting it?" fixes a real percentage of problems, and that is exactly why it is dangerous: it converts a diagnosable failure into an undiagnosable one that will return, usually at a worse hour, with no evidence left behind.</p>
<pre><code><span class="tok-comment"># If you MUST restart, spend fifteen seconds capturing state first</span>
T=/tmp/evidence-\$(date +%H%M%S); mkdir -p "\$T"
ps auxww                     &gt; "\$T/ps.txt"
ss -tanp                     &gt; "\$T/sockets.txt" 2&gt;/dev/null
free -h; df -h; df -i        &gt; "\$T/resources.txt" 2&gt;&amp;1
sudo journalctl -u backend -n 500 --no-pager &gt; "\$T/backend.log"
sudo journalctl -k -b --no-pager | tail -200 &gt; "\$T/kernel.log"
cp /etc/nginx/sites-enabled/* "\$T/" 2&gt;/dev/null
ls -l "\$T"</code></pre>
<div class="out">total 96
-rw-r--r-- 1 deploy deploy 34981 Aug 22 18:44 backend.log
-rw-r--r-- 1 deploy deploy 11204 Aug 22 18:44 kernel.log
-rw-r--r-- 1 deploy deploy  9633 Aug 22 18:44 ps.txt
-rw-r--r-- 1 deploy deploy   412 Aug 22 18:44 resources.txt
-rw-r--r-- 1 deploy deploy  4118 Aug 22 18:44 sockets.txt</div>
<div class="callout warn"><strong>Restarting is a legitimate first action when the outage is costing money and you have the evidence.</strong> The mistake is not restarting — it is restarting <em>instead of</em> looking. Fifteen seconds of capture buys you the ability to explain the incident tomorrow, and "we restarted it and it has not happened again" is not an explanation, it is a countdown.</div>

<h3>Write it down while you work</h3>
<p>An incident log is four columns in a scratch file, and it is what stops the classic failure mode where you make six changes, the problem goes away, and nobody — including you — knows which one did it.</p>
<pre><code>18:41  observed  load 6.8, backend.service failed, OOM killed postgres 18:34, disk 96%
18:43  hypoth.   memory pressure from the 14:05 deploy; no swap so OOM instead of slow
18:45  change    truncate -s 0 /var/log/app/debug.log  (was 41G)  -&gt; disk 44%
18:47  verify    df 44%, postgres started, backend healthy, curl /health = 200
18:52  followup  add swap (11.3), logrotate for app/debug.log (10.3), alert at 80% disk</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Observed</span><span class="lz-lnote">Facts with timestamps, copied from output — not your interpretation of them. "load 6.8", not "the machine is overloaded".</span></div>
  <div class="lz-layer"><span class="lz-lname">Hypothesis</span><span class="lz-lnote">One sentence, testable. Writing it down stops you from quietly switching theories every two minutes and re-checking the same things.</span></div>
  <div class="lz-layer"><span class="lz-lname">Change</span><span class="lz-lnote">The exact command, pasted. This is what you undo if it makes things worse, and what you put in the post-mortem when it makes things better.</span></div>
  <div class="lz-layer"><span class="lz-lname">Verify</span><span class="lz-lnote">The command that PROVES it worked, and its output. "It seems fine now" is how an incident gets reopened forty minutes later.</span></div>
  <div class="lz-layer"><span class="lz-lname">Follow-up</span><span class="lz-lnote">Everything you noticed but did not fix. This list is the real product of an incident; without it you will handle the identical outage again next month.</span></div>
</div>

<h3>When you are properly stuck</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Go one layer down</span><span class="v">The app says "connection refused" — so ask the layer below. <code>ss -tlnp</code> for whether anything is listening, <code>curl</code> for whether it answers, <code>journalctl</code> for what it said as it died. Each layer down turns a vague symptom into a specific one.</span></div>
  <div class="kv"><span class="k">Re-read the actual error</span><span class="v">Out loud, in full, including the path and the number. People pattern-match the first four words and miss that the path is <code>/srv/app/dist/dist/index.js</code> or that the port is 3001 rather than 3000.</span></div>
  <div class="kv"><span class="k">Check your assumption, not your logic</span><span class="v">Stuck usually means one "obviously true" fact is false: the file you edited is not the file being read (<code>systemctl cat</code>, <code>sshd -T</code>, <code>nginx -T</code>), or the process running is not the code you deployed (<code>ls -l /proc/\$(pgrep -f app)/cwd</code>).</span></div>
  <div class="kv"><span class="k">Explain it to someone</span><span class="v">Or to a text box. Forcing the problem into full sentences finds the contradiction about half the time before anyone replies — and when it does not, you have already written the question properly.</span></div>
  <div class="kv"><span class="k">Take the machine out of the loop</span><span class="v">Reproduce the failing thing as the smallest possible command, run by hand, as the right user (Lesson 11.2). Most "server bugs" become ordinary bugs the moment you can run them on demand.</span></div>
</div>

<a class="link-card" href="https://www.brendangregg.com/USEmethod/use-linux.html" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Brendan Gregg — the USE method for Linux</span><span class="lc-sub">Utilisation, Saturation, Errors: a checklist over every resource, so you find the exhausted one instead of the interesting one. The reference for structured performance diagnosis.</span></span>
</a>
<a class="link-card" href="https://www.brendangregg.com/blog/2015-12-03/linux-perf-60s.html" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Linux performance analysis in 60 seconds</span><span class="lc-sub">The original ten-command sweep this lesson adapts. Worth reading for WHY each command is on the list — that reasoning is what lets you drop one when it is not installed.</span></span>
</a>
<a class="link-card" href="https://sre.google/sre-book/effective-troubleshooting/" target="_blank" rel="noopener">
  <span class="lc-ico">📕</span>
  <span class="lc-body"><span class="lc-title">Google SRE Book — Effective Troubleshooting</span><span class="lc-sub">Free online. The hypothesis-and-bisect loop, common traps, and why "what changed" beats "what is broken" as an opening question.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: read a sweep and name the fault</span><span class="lc-sub">Graded exercises: four real sweeps from broken machines — say what is wrong, which single command you would run next, and which finding is a symptom rather than a cause.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> fixing the first thing you see. The sweep above showed a failed backend, an OOM kill, a 96% disk and no swap — four findings, of which exactly one is the root cause and the rest are consequences or contributing conditions. Restarting the backend "fixes" it for ninety seconds. The habit that prevents this: for every finding, ask "could this be caused by one of the others?" and put it aside if the answer is yes. The root cause is the finding with nothing upstream of it — here, a 41GB debug log that filled the disk.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Observe before you touch: a four-second sweep, saved to a file, is worth more than the first twenty minutes of guessing. Ask what changed before you ask what is broken, because <code>ls -lt /etc</code> and the deploy log solve more incidents than any amount of reading source code. And change exactly one thing at a time and write it down — otherwise the outage ends without anyone learning anything, which means it has not really ended.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Một phương pháp cho cái máy bạn chưa từng thấy</h2>
<p class="lead">Ai đó gửi cho bạn một địa chỉ IP và một câu: <em>"trang web sập rồi"</em>. Bạn có quyền SSH và không có gì khác — không bảng điều khiển, không bối cảnh, không biết cái máy này chạy những gì. Mười một chương vừa rồi đã cho bạn các câu lệnh. Chương này cho bạn THỨ TỰ chạy chúng, và chính phần đó biến hai giờ hoảng loạn thành mười phút sửa xong.</p>
<p>Phương pháp dưới đây không thông minh. Nó buồn tẻ một cách có chủ ý, vì thông minh chính là thứ đổ vỡ lúc 3 giờ sáng khi bạn là người duy nhất còn thức.</p>

<h3>Cái vòng lặp</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Quan sát, trước khi đụng vào bất cứ thứ gì</span><span class="lz-t">cuộc quét 60 giây, ở dưới</span><span class="lz-d">Rộng và rẻ. Bạn chưa đi tìm nguyên nhân — bạn đang tìm xem NỬA NÀO của cái máy đang khó ở. Khởi động lại thứ gì lúc này là phá đúng cái bằng chứng lẽ ra đã nói cho bạn biết.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Dựng lại mốc thời gian</span><span class="lz-t">nó bắt đầu lúc nào, và ngay trước đó có gì đổi</span><span class="lz-d">"Hỏng lúc 14:07" cộng "chúng ta deploy lúc 14:05" là một sự cố đã giải xong. Phần lớn sự cố có một nguyên nhân gọi tên được nằm trong một giờ lịch sử gần nhất.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Thu hẹp về MỘT thành phần</span><span class="lz-t">máy, hay mạng, hay ứng dụng, hay dữ liệu</span><span class="lz-d">Mỗi phép kiểm nên loại bỏ được khoảng một nửa phần còn lại. Nếu một phép kiểm dù ra kết quả nào cũng không loại bỏ được gì thì đừng chạy nó.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Lập MỘT giả thuyết và nói to nó ra</span><span class="lz-t">"nginx còn sống, backend không lắng nghe ở cổng 3000"</span><span class="lz-d">Một giả thuyết nói được thành một câu là một giả thuyết kiểm được bằng một câu lệnh. Nếu bạn không nói ra được thì bạn đang ĐOÁN — hãy quay về bước 1.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Đổi MỘT thứ, và ghi nó lại</span><span class="lz-t">rồi kiểm lại</span><span class="lz-d">Đổi hai thứ cùng lúc nghĩa là bạn không bao giờ biết cái nào có tác dụng, và một trong hai có thể là con bọ mới bạn sẽ gặp vào tuần sau.</span></div>
  <div class="lz-step"><span class="lz-k">6 · Sửa nguyên nhân, rồi sửa sự bất ngờ</span><span class="lz-t">tại sao không có gì báo cho chúng ta?</span><span class="lz-d">Sự cố kết thúc khi dịch vụ sống lại. CÔNG VIỆC kết thúc khi cùng cú hỏng đó không thể im lặng thêm lần thứ hai (Bài 10.3, 11.2).</span></div>
</div>

<h3>Sáu mươi giây đầu tiên</h3>
<p>Dán một phát, không tham số, an toàn trên mọi máy — nó chỉ đọc và không đổi gì. Hãy chạy nó TRƯỚC khi bạn hình thành bất kỳ ý kiến nào.</p>
<pre><code>{
  echo "=== ai và khi nào ==="; uptime; who; last reboot | head -3
  echo "=== unit hỏng ==="; systemctl --failed --no-legend
  echo "=== lỗi từ lúc khởi động ==="; journalctl -p err -b --no-pager | tail -15
  echo "=== đĩa ==="; df -h | grep -vE 'tmpfs|udev'; df -i | grep -vE 'tmpfs|udev' | head -3
  echo "=== bộ nhớ ==="; free -h
  echo "=== ngốn CPU nhất ==="; ps aux --sort=-%cpu | head -6
  echo "=== ngốn RAM nhất ==="; ps aux --sort=-%mem | head -6
  echo "=== đang lắng nghe ==="; ss -tlnp 2&gt;/dev/null | head -12
  echo "=== nhân ==="; dmesg -T 2&gt;/dev/null | tail -10
} 2&gt;&amp;1 | tee /tmp/sweep-\$(date +%H%M%S).txt</code></pre>
<div class="out">=== ai và khi nào ===
 18:41:02 up 12 days,  3:22,  1 user,  load average: 6.84, 4.11, 2.07
deploy   pts/0    203.0.113.55     18:39   still_logged_in
reboot   system boot  6.8.0-45-generic Sun Aug 10 15:19
=== unit hỏng ===
backend.service loaded failed failed Node API
=== lỗi từ lúc khởi động ===
Aug 22 18:33:41 vps-1 backend[3912]: Error: connect ECONNREFUSED 127.0.0.1:5432
Aug 22 18:33:41 vps-1 systemd[1]: backend.service: Main process exited, code=exited, status=1/FAILURE
Aug 22 18:34:12 vps-1 kernel: Out of memory: Killed process 3401 (postgres)
=== đĩa ===
/dev/vda1        79G   72G  3.1G  96% /
=== bộ nhớ ===
               total        used        free      shared  buff/cache   available
Mem:           1.9Gi       1.7Gi        91Mi        12Mi       143Mi       112Mi
Swap:             0B          0B          0B</div>
<p>Cuộc quét đó tốn bốn giây và sự cố đã sáng tỏ: PostgreSQL bị kẻ giết OOM hạ lúc 18:34, backend sau đó không nối được nên thoát, và cái máy thì không có swap cùng đĩa 96%. Bạn chưa khởi động lại thứ gì, và giờ bạn mô tả được cú hỏng trong đúng một câu — đó là khác biệt giữa SỬA nó và LÀM NÓ TỆ HƠN.</p>
<div class="callout ok"><strong>Hãy <code>tee</code> cuộc quét ra một file.</strong> Mười phút nữa bạn sẽ muốn biết bộ nhớ trông thế nào <em>TRƯỚC KHI</em> bạn bắt đầu đổi các thứ, và tới lúc đó cái máy đã đi tiếp rồi. Một cuộc quét đã lưu cũng chính là thứ bạn dán vào khung chat khi hỏi đồng nghiệp, thay vì gõ lại một mô tả bỏ sót đúng cái dòng quan trọng.</div>

<h3>Đọc cuộc quét</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">load average: 6.84, 4.11, 2.07</span><span class="v">Tăng dần từ trái sang phải nghĩa là nó đang TỆ ĐI ngay lúc này (Bài 5.2). Hãy so mấy con số đó với số nhân lấy từ <code>nproc</code> — 6,8 trên 2 nhân là một hàng đợi; 6,8 trên 16 nhân là một ngày thứ Ba bình thường.</span></div>
  <div class="kv"><span class="k">up 12 days</span><span class="v">Loại trừ khả năng "nó vừa khởi động lại". Một uptime ngắn mà bạn không ngờ tới thì tự nó đã là một phát hiện — hãy xem <code>last reboot</code> và <code>journalctl -k -b -1</code> để biết chuyện gì xảy ra trước đó.</span></div>
  <div class="kv"><span class="k">systemctl --failed</span><span class="v">Danh sách rỗng là dấu hiệu mạnh rằng cái máy vẫn ổn và vấn đề của bạn nằm ở chỗ khác — mạng, cơ sở dữ liệu, phía máy khách. Một dòng ở đây thì thường CHÍNH LÀ sự cố.</span></div>
  <div class="kv"><span class="k">Out of memory: Killed process</span><span class="v">Nhân đã chọn một nạn nhân (Bài 5.2). Thứ chết đi là TRIỆU CHỨNG; nguyên nhân là thứ đã PHÌNH RA. Hãy nhìn xem cái gì đang ngốn bộ nhớ ngay trước đó, đừng chỉ nhìn cái đã chết.</span></div>
  <div class="kv"><span class="k">96% / và Swap: 0B</span><span class="v">Hai vấn đề độc lập, và cả hai đều làm mọi thứ khác tệ hơn. Đĩa sắp đầy phá vỡ việc ghi, việc ghi log và checkpoint của cơ sở dữ liệu (Bài 10.1); không swap nghĩa là những cơn tăng vọt bộ nhớ GIẾT tiến trình thay vì chỉ làm chậm chúng (Bài 11.3).</span></div>
  <div class="kv"><span class="k">ss -tlnp</span><span class="v">Cổng nào thật sự đang được phục vụ, và bởi tiến trình nào. "Cổng không lắng nghe" và "cổng có lắng nghe nhưng từ chối" là hai con bọ hoàn toàn khác nhau (Bài 9.1).</span></div>
</div>

<h3>Ba câu hỏi chẻ đôi bài toán</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Câu hỏi 1</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Là cái máy, hay là ứng dụng?</span><span class="lz-nsub">SSH vào được không? Tải bình thường, đĩa ổn, bộ nhớ ổn? Nếu tất cả đều "có" thì thôi đừng nhìn cái máy nữa — bạn đang gỡ lỗi một ỨNG DỤNG, và các bài sau của Chương 12 chia ra đúng theo hướng đó.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Câu hỏi 2</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nó ĐÃ TỪNG chạy được chưa, và cái gì đã đổi?</span><span class="lz-nsub">Chưa từng chạy = cấu hình hoặc môi trường. Chạy tốt tới 14:07 = có thứ gì đó đổi lúc 14:07. Đó là hai cuộc điều tra khác nhau, và hỏi trước giúp bạn khỏi chạy nhầm cuộc.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Câu hỏi 3</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Là tất cả mọi người, hay chỉ mình bạn?</span><span class="lz-nsub">Hãy thử từ chính máy chủ bằng <code>curl localhost</code> (Bài 9.2). Chạy được ở trong mà không được từ ngoài thì lỗi nằm ở DNS, TLS, tường lửa hoặc proxy — không cái nào là ứng dụng cả.</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment"># Câu hỏi 3, dưới dạng ba câu lệnh — mỗi câu loại một tầng</span>
curl -sS -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:3000/health   <span class="tok-comment"># chính ứng dụng</span>
curl -sS -o /dev/null -w '%{http_code}\\n' http://127.0.0.1/health        <span class="tok-comment"># qua nginx</span>
curl -sS -o /dev/null -w '%{http_code}\\n' https://example.com/health     <span class="tok-comment"># qua DNS + TLS + tường lửa</span></code></pre>
<div class="out">200
200
000</div>
<p>Ứng dụng khoẻ, proxy khoẻ, thế giới bên ngoài không nhận được gì. Trong ba giây bạn đã loại bỏ mọi thứ mà bạn sắp bỏ ra một tiếng để đọc, và danh sách nghi phạm còn lại là DNS, TLS, tường lửa và mạng của nhà cung cấp — một danh sách bốn món, không phải một danh sách vô tận.</p>

<h3>Dựng lại mốc thời gian</h3>
<p>Gần như mọi sự cố đều có một cái "ngay trước đó". Tìm ra nó thường nhanh hơn hiểu cú hỏng, và rất hay khiến việc hiểu cú hỏng trở nên không cần thiết.</p>
<pre><code><span class="tok-comment"># Cái máy đổi lần cuối lúc nào?</span>
journalctl --since '2 hours ago' -p warning --no-pager | head -30
grep -E ' (install|upgrade|remove) ' /var/log/dpkg.log | tail -10   <span class="tok-comment"># gói phần mềm</span>
ls -lt /etc | head -10                                             <span class="tok-comment"># cấu hình vừa bị sửa</span>
last -n 10                                                         <span class="tok-comment"># ai đã đăng nhập</span>
sudo journalctl _COMM=sudo --since today | tail -10                <span class="tok-comment"># họ chạy gì bằng sudo</span>
git -C /srv/app log --oneline -5 --date=iso --pretty='%h %ad %s'   <span class="tok-comment"># đã deploy cái gì</span></code></pre>
<div class="out">2026-08-22 14:05:11 +0000 8fbd829 chore: bump image cache TTL to 30d
2026-08-22 09:12:40 +0000 d354882 feat: add /api/v1/reports
$ sudo journalctl _COMM=sudo --since today | tail -3
Aug 22 14:04:58 vps-1 sudo[38801]: deploy : TTY=pts/1 ; PWD=/srv/app ; USER=root ; COMMAND=/usr/bin/systemctl restart backend
Aug 22 14:07:02 vps-1 sudo[38844]: deploy : TTY=pts/1 ; PWD=/etc/nginx ; USER=root ; COMMAND=/usr/bin/nano sites-enabled/app.conf</div>
<p>Có người sửa một file cấu hình nginx lúc 14:07 và triệu chứng bắt đầu lúc 14:07. Đó không phải bằng chứng, nhưng đó là chỗ bạn nhìn đầu tiên, và <code>nginx -t</code> cộng <code>git diff</code> sẽ xác nhận hoặc loại trừ nó trong mười giây.</p>
<div class="callout"><strong><code>ls -lt /etc | head</code> là phép chẩn đoán bị đánh giá thấp nhất trong cả trang này.</strong> File cấu hình không tự đổi. Một file trong <code>/etc</code> có thời gian sửa nằm trong khoảng sự cố của bạn thì hoặc là nguyên nhân, hoặc là một nỗ lực sửa bất thành — và kiểu nào bạn cũng muốn biết TRƯỚC KHI bắt đầu đọc mã nguồn.</div>

<h3>Luật về chuyện khởi động lại</h3>
<p>"Thử khởi động lại xem?" quả thật chữa được một tỷ lệ vấn đề có thật, và chính vì thế nó nguy hiểm: nó biến một cú hỏng CHẨN ĐOÁN ĐƯỢC thành một cú hỏng KHÔNG CHẨN ĐOÁN ĐƯỢC, mà lại sẽ quay lại, thường vào một giờ tệ hơn, và không còn bằng chứng nào.</p>
<pre><code><span class="tok-comment"># Nếu BUỘC PHẢI khởi động lại, hãy bỏ mười lăm giây thu giữ hiện trạng trước</span>
T=/tmp/evidence-\$(date +%H%M%S); mkdir -p "\$T"
ps auxww                     &gt; "\$T/ps.txt"
ss -tanp                     &gt; "\$T/sockets.txt" 2&gt;/dev/null
free -h; df -h; df -i        &gt; "\$T/resources.txt" 2&gt;&amp;1
sudo journalctl -u backend -n 500 --no-pager &gt; "\$T/backend.log"
sudo journalctl -k -b --no-pager | tail -200 &gt; "\$T/kernel.log"
cp /etc/nginx/sites-enabled/* "\$T/" 2&gt;/dev/null
ls -l "\$T"</code></pre>
<div class="out">total 96
-rw-r--r-- 1 deploy deploy 34981 Aug 22 18:44 backend.log
-rw-r--r-- 1 deploy deploy 11204 Aug 22 18:44 kernel.log
-rw-r--r-- 1 deploy deploy  9633 Aug 22 18:44 ps.txt
-rw-r--r-- 1 deploy deploy   412 Aug 22 18:44 resources.txt
-rw-r--r-- 1 deploy deploy  4118 Aug 22 18:44 sockets.txt</div>
<div class="callout warn"><strong>Khởi động lại là hành động đầu tiên CHÍNH ĐÁNG khi sự cố đang tiêu tiền và bạn đã có bằng chứng.</strong> Sai lầm không nằm ở việc khởi động lại — nó nằm ở việc khởi động lại <em>THAY VÌ</em> nhìn. Mười lăm giây thu giữ mua cho bạn khả năng giải thích được sự cố vào ngày mai, và "chúng tôi khởi động lại rồi và nó chưa tái diễn" không phải một lời giải thích, đó là một cái đồng hồ đếm ngược.</div>

<h3>Vừa làm vừa ghi</h3>
<p>Một nhật ký sự cố là bốn cột trong một file nháp, và nó là thứ chặn cái kiểu hỏng kinh điển: bạn đổi sáu thứ, vấn đề biến mất, và không ai — kể cả bạn — biết cái nào đã có tác dụng.</p>
<pre><code>18:41  quan sát  load 6,8, backend.service failed, OOM giết postgres 18:34, đĩa 96%
18:43  giả thuyết  bộ nhớ bị ép từ bản deploy 14:05; không swap nên OOM thay vì chậm
18:45  thay đổi  truncate -s 0 /var/log/app/debug.log  (đang 41G)  -&gt; đĩa 44%
18:47  xác nhận  df 44%, postgres lên, backend khoẻ, curl /health = 200
18:52  việc sau  thêm swap (11.3), logrotate cho app/debug.log (10.3), cảnh báo khi đĩa 80%</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Quan sát</span><span class="lz-lnote">Sự kiện kèm mốc thời gian, CHÉP từ output — không phải cách bạn diễn giải chúng. "load 6,8", chứ không phải "cái máy đang quá tải".</span></div>
  <div class="lz-layer"><span class="lz-lname">Giả thuyết</span><span class="lz-lnote">Một câu, kiểm được. Viết nó ra chặn bạn khỏi việc âm thầm đổi lý thuyết mỗi hai phút rồi kiểm lại đúng những thứ đã kiểm.</span></div>
  <div class="lz-layer"><span class="lz-lname">Thay đổi</span><span class="lz-lnote">Đúng câu lệnh, dán nguyên. Đây là thứ bạn hoàn tác nếu nó làm mọi chuyện tệ hơn, và là thứ bạn đưa vào biên bản khi nó làm mọi chuyện tốt hơn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Xác nhận</span><span class="lz-lnote">Câu lệnh CHỨNG MINH là nó chạy được, kèm output. "Giờ có vẻ ổn rồi" là cách một sự cố được mở lại sau bốn mươi phút.</span></div>
  <div class="lz-layer"><span class="lz-lname">Việc sau</span><span class="lz-lnote">Mọi thứ bạn để ý thấy mà chưa sửa. Danh sách này mới là sản phẩm thật của một sự cố; không có nó thì tháng sau bạn sẽ xử lý y hệt sự cố đó lần nữa.</span></div>
</div>

<h3>Khi bạn bí thật sự</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đi xuống một tầng</span><span class="v">Ứng dụng nói "connection refused" — vậy hãy hỏi cái tầng dưới nó. <code>ss -tlnp</code> xem có gì đang lắng nghe không, <code>curl</code> xem nó có trả lời không, <code>journalctl</code> xem nó nói gì lúc chết. Mỗi tầng đi xuống biến một triệu chứng mơ hồ thành một triệu chứng cụ thể.</span></div>
  <div class="kv"><span class="k">Đọc lại đúng cái thông báo lỗi</span><span class="v">Đọc to, đọc đủ, gồm cả đường dẫn và con số. Người ta khớp mẫu bốn chữ đầu rồi bỏ sót rằng đường dẫn là <code>/srv/app/dist/dist/index.js</code>, hay rằng cổng là 3001 chứ không phải 3000.</span></div>
  <div class="kv"><span class="k">Hãy kiểm GIẢ ĐỊNH của bạn, đừng kiểm lập luận</span><span class="v">Bí thường nghĩa là có một điều "hiển nhiên đúng" đang sai: file bạn vừa sửa không phải file đang được đọc (<code>systemctl cat</code>, <code>sshd -T</code>, <code>nginx -T</code>), hoặc tiến trình đang chạy không phải mã bạn vừa deploy (<code>ls -l /proc/\$(pgrep -f app)/cwd</code>).</span></div>
  <div class="kv"><span class="k">Giải thích cho ai đó nghe</span><span class="v">Hoặc cho một khung soạn thảo. Ép bài toán thành những câu hoàn chỉnh tìm ra chỗ mâu thuẫn khoảng một nửa số lần TRƯỚC KHI có ai kịp trả lời — và khi không tìm ra, bạn cũng đã viết xong một câu hỏi tử tế.</span></div>
  <div class="kv"><span class="k">Đưa cái máy ra khỏi vòng lặp</span><span class="v">Tái hiện thứ đang hỏng dưới dạng câu lệnh NHỎ NHẤT có thể, chạy tay, dưới đúng người dùng (Bài 11.2). Phần lớn "bọ máy chủ" biến thành bọ bình thường ngay khoảnh khắc bạn gọi chúng ra được theo ý muốn.</span></div>
</div>

<a class="link-card" href="https://www.brendangregg.com/USEmethod/use-linux.html" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Brendan Gregg — phương pháp USE cho Linux</span><span class="lc-sub">Mức dùng, mức bão hoà, lỗi: một danh sách kiểm quét qua mọi tài nguyên, để bạn tìm ra cái ĐÃ CẠN thay vì cái THÚ VỊ. Tài liệu tham chiếu cho chẩn đoán hiệu năng có cấu trúc.</span></span>
</a>
<a class="link-card" href="https://www.brendangregg.com/blog/2015-12-03/linux-perf-60s.html" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Phân tích hiệu năng Linux trong 60 giây</span><span class="lc-sub">Bản quét mười lệnh gốc mà bài này phỏng theo. Đáng đọc để hiểu VÌ SAO mỗi lệnh có mặt trong danh sách — chính lý lẽ đó cho phép bạn bỏ bớt một lệnh khi máy không cài nó.</span></span>
</a>
<a class="link-card" href="https://sre.google/sre-book/effective-troubleshooting/" target="_blank" rel="noopener">
  <span class="lc-ico">📕</span>
  <span class="lc-body"><span class="lc-title">Google SRE Book — Effective Troubleshooting</span><span class="lc-sub">Đọc miễn phí trên web. Vòng lặp giả thuyết-và-chia đôi, những cái bẫy thường gặp, và vì sao "cái gì đã đổi" là câu mở đầu tốt hơn "cái gì đang hỏng".</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: đọc một cuộc quét và gọi tên cái hỏng</span><span class="lc-sub">Bài chấm điểm: bốn cuộc quét thật từ những cái máy đang hỏng — nói xem sai ở đâu, câu lệnh DUY NHẤT bạn sẽ chạy tiếp theo, và phát hiện nào là triệu chứng chứ không phải nguyên nhân.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> sửa cái đầu tiên bạn nhìn thấy. Cuộc quét ở trên cho ra một backend hỏng, một cú giết OOM, một cái đĩa 96% và không có swap — bốn phát hiện, trong đó đúng MỘT cái là nguyên nhân gốc còn lại là hệ quả hoặc điều kiện góp phần. Khởi động lại backend "sửa" được nó trong chín mươi giây. Thói quen chặn chuyện này: với mỗi phát hiện, hãy hỏi "cái này có thể do một trong mấy cái kia gây ra không?" và gạt nó sang bên nếu câu trả lời là có. Nguyên nhân gốc là phát hiện KHÔNG CÓ GÌ ĐỨNG TRƯỚC nó — ở đây là một file log gỡ lỗi 41GB đã làm đầy đĩa.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Quan sát trước khi đụng vào: một cuộc quét bốn giây, lưu ra file, đáng giá hơn hai mươi phút đoán mò đầu tiên. Hãy hỏi CÁI GÌ ĐÃ ĐỔI trước khi hỏi CÁI GÌ ĐANG HỎNG, vì <code>ls -lt /etc</code> và nhật ký deploy giải được nhiều sự cố hơn bất kỳ lượng mã nguồn nào bạn đọc. Và hãy đổi đúng một thứ mỗi lần rồi ghi lại — không thì sự cố kết thúc mà không ai học được gì, tức là nó chưa thật sự kết thúc.</p>
</div>
`,
    },
    /* ─────────────────────────── 12.2 ─────────────────────────── */
    {
      title: '12.2 — Cookbook: it is down|||12.2 — Sách công thức: nó chết',
      slug: 'lnx-12-2-no-chet',
      type: 'LESSON',
      description: 'Dịch vụ không lên và các mã thoát của systemd, cổng đã bị chiếm, refused với timeout với reset, 502 của nginx, container quay vòng khởi động lại, và không SSH vào được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Cookbook: it is down</h2>
<p class="lead">Six recipes for the failures where something is simply not answering. Each one is a symptom, what it actually means, a ladder of commands, and the fix. Read them out of order; that is what a cookbook is for.</p>

<h3>Recipe 1 — the service will not start</h3>
<pre><code>systemctl status backend --no-pager -l        <span class="tok-comment"># the headline and the last few log lines</span>
journalctl -u backend -n 50 --no-pager        <span class="tok-comment"># the real story</span>
systemctl cat backend                         <span class="tok-comment"># the unit AS LOADED, drop-ins included</span></code></pre>
<div class="out">× backend.service - Node API
     Loaded: loaded (/etc/systemd/system/backend.service; enabled)
     Active: failed (Result: exit-code) since Fri 2026-08-22 19:02:11 UTC; 8s ago
    Process: 44120 ExecStart=/usr/bin/node dist/index.js (code=exited, status=203/EXEC)
   Main PID: 44120 (code=exited, status=203/EXEC)</div>
<p>The exit code is the whole diagnosis. systemd's are specific and they save you from reading logs that do not exist yet, because the process never got as far as producing any:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">203/EXEC</span><span class="v">The binary could not be executed: wrong path, not executable, or a relative path (systemd does not search <code>PATH</code>). Check with <code>ls -l</code> on the exact string in <code>ExecStart=</code>.</span></div>
  <div class="kv"><span class="k">200/CHDIR</span><span class="v"><code>WorkingDirectory=</code> does not exist, or the <code>User=</code> cannot traverse into it (needs <code>x</code> on every parent — Lesson 4.1).</span></div>
  <div class="kv"><span class="k">217/USER</span><span class="v">The <code>User=</code> does not exist. Typo, or the account was never created on this machine.</span></div>
  <div class="kv"><span class="k">226/NAMESPACE</span><span class="v">A sandboxing directive cannot be satisfied — usually <code>ProtectSystem=strict</code> plus a path the service must write to. Add a <code>ReadWritePaths=</code>.</span></div>
  <div class="kv"><span class="k">1/FAILURE</span><span class="v">The program RAN and exited non-zero. Now the journal has something worth reading: this is an application error, not a unit error.</span></div>
  <div class="kv"><span class="k">143 / 137</span><span class="v">Killed by SIGTERM (normal shutdown) or SIGKILL. A 137 with no <code>stop</code> command from you means the OOM killer or a timeout — check <code>dmesg -T | tail</code> (Lesson 5.3).</span></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Read the exit code</span><span class="lz-t">systemctl status</span><span class="lz-d">If it is 203/200/217/226 the problem is the UNIT and the logs will be empty. Stop reading application logs.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Run ExecStart by hand, as the User</span><span class="lz-t">sudo -u deploy /usr/bin/node /srv/app/dist/index.js</span><span class="lz-d">Five seconds, and it separates "systemd is configured wrong" from "the app is broken" completely.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Check what it actually loaded</span><span class="lz-t">systemctl cat backend · systemctl show backend -p ExecStart -p User -p Environment</span><span class="lz-d">A drop-in you forgot, or an edit you made without <code>daemon-reload</code> (Lesson 11.1), makes the file on disk and the unit in memory different documents.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Check the environment it gets</span><span class="lz-t">EnvironmentFile= exists? readable by User=? no quotes around values?</span><span class="lz-d">A missing <code>EnvironmentFile</code> is a hard failure; a present-but-unreadable one is the same. And systemd does NOT strip quotes the way a shell does.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Now read the journal</span><span class="lz-t">journalctl -u backend --since '10 min ago'</span><span class="lz-d">Only once the unit itself is proven correct. Otherwise you are looking for an error message the process was never alive enough to write.</span></div>
</div>

<h3>Recipe 2 — "address already in use"</h3>
<pre><code>sudo ss -tlnp | grep ':3000'         <span class="tok-comment"># who is listening, and their PID</span>
sudo fuser -n tcp 3000               <span class="tok-comment"># same answer, shorter</span>
sudo lsof -i :3000                   <span class="tok-comment"># if lsof is installed</span>
ps -fp \$(sudo ss -tlnpH 'sport = :3000' | grep -oP 'pid=\\K[0-9]+' | head -1)</code></pre>
<div class="out">LISTEN 0 511 0.0.0.0:3000 0.0.0.0:* users:(("node",pid=41288,fd=21))
UID    PID  PPID  C STIME TTY   STAT   TIME CMD
deploy 41288 1    0 14:05 ?     Ssl    0:41 node /srv/app/dist/index.js</div>
<p>An orphaned process from a previous run, still holding the port. It is parented to PID 1, which means whatever started it is gone — a <code>tmux</code> session that died, a manual <code>node</code> from a debugging session, or a service that was replaced without being stopped.</p>
<pre><code>sudo kill 41288                      <span class="tok-comment"># SIGTERM first, ALWAYS (Lesson 5.3)</span>
sleep 2; sudo ss -tlnp | grep ':3000' || echo "port free"
<span class="tok-comment"># only if it refuses to die:</span>
sudo kill -9 41288</code></pre>
<div class="callout"><strong>Two lookalikes that are NOT a held port.</strong> First, sockets in <code>TIME_WAIT</code>: <code>ss -tan | grep 3000</code> shows dozens, nothing is listening, and a normal server binds fine — <code>SO_REUSEADDR</code> handles it and your app almost certainly sets it. Second, binding to an address that does not exist: <code>EADDRNOTAVAIL</code> looks similar in a stack trace but means the IP is not on this machine (<code>ip addr</code>), not that the port is taken. Read the errno, not the summary line.</div>

<h3>Recipe 3 — refused, timeout, or reset?</h3>
<p>Three different failures that people describe with the same words. Telling them apart is the single highest-value distinction in network debugging, because each points at a different layer.</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Connection refused</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">You reached the machine; nothing is listening</span><span class="lz-nsub">The host actively said no (a TCP RST). Good news — the network works. The service is down, crashed, or bound to a different port or to 127.0.0.1 only. Fix on the SERVER.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Connection timed out</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nothing answered at all</span><span class="lz-nsub">Packets went into a hole: a firewall DROPping silently, a security group, wrong IP, or the machine is off. Fix in the NETWORK — <code>ufw status</code>, the provider's firewall, <code>ip addr</code>.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Connection reset by peer</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Something answered, then hung up mid-conversation</span><span class="lz-nsub">The connection was established. A proxy timed out, the app crashed mid-request, TLS was expected and plain HTTP arrived, or a body exceeded a limit. Fix in the APPLICATION or the proxy.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Name or service not known</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">You never got an IP</span><span class="lz-nsub">Pure DNS (Lesson 9.1). Nothing was attempted; check <code>dig +short name</code> and <code>/etc/resolv.conf</code> before touching anything else.</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment"># Which one is it? -m 5 so a timeout does not make you wait 2 minutes</span>
curl -sS -m 5 -o /dev/null -w '%{http_code} %{time_total}s\\n' http://10.0.0.9:3000/health
nc -vz 10.0.0.9 3000                 <span class="tok-comment"># TCP only, no HTTP — isolates the layer</span></code></pre>
<div class="out">$ nc -vz 10.0.0.9 3000
nc: connect to 10.0.0.9 port 3000 (tcp) failed: Connection refused
$ nc -vz 10.0.0.9 5432
nc: connect to 10.0.0.9 port 5432 (tcp) timed out: Operation now in progress</div>
<p>Port 3000: refused, so the machine is reachable and the service is down — server problem. Port 5432: timed out, so a firewall is dropping it — network problem. Same machine, two different investigations, distinguished in four seconds by one flag.</p>

<h3>Recipe 4 — nginx returns 502 Bad Gateway</h3>
<p>502 means nginx could not get a valid response from the thing behind it. nginx is working — that is what makes 502 useful. Its error log names the reason precisely:</p>
<pre><code>sudo tail -20 /var/log/nginx/error.log
sudo ss -tlnp | grep -E ':(3000|8080)'
curl -sS -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:3000/health
sudo nginx -T | grep -A3 proxy_pass          <span class="tok-comment"># what nginx REALLY has loaded</span></code></pre>
<div class="out">2026/08/22 19:14:02 [error] 812#812: *4471 connect() failed (111: Connection refused)
  while connecting to upstream, client: 203.0.113.55, server: example.com,
  request: "GET /api/v1/posts HTTP/1.1", upstream: "http://127.0.0.1:3000/api/v1/posts"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">111: Connection refused</span><span class="v">The upstream is not listening. Recipe 1 — the app is down. This is the common case by a wide margin.</span></div>
  <div class="kv"><span class="k">110: Connection timed out</span><span class="v">The app accepted the connection and never replied. It is alive but stuck: check for a blocked event loop, a hung database query, or an exhausted connection pool.</span></div>
  <div class="kv"><span class="k">13: Permission denied</span><span class="v">Unix-socket upstreams. The socket exists but <code>www-data</code> cannot open it — check the socket's mode and the directory's <code>x</code> bit (Lesson 4.1).</span></div>
  <div class="kv"><span class="k">upstream prematurely closed connection</span><span class="v">The app crashed mid-response. The reason is in the APP's log, at the same second — <code>journalctl -u backend --since</code> that timestamp.</span></div>
  <div class="kv"><span class="k">no live upstreams</span><span class="v">Every server in an upstream block is marked down after repeated failures. Fix the backends; nginx re-tries them on its own schedule.</span></div>
  <div class="kv"><span class="k">504 instead of 502</span><span class="v">Not the same bug. 504 is <code>proxy_read_timeout</code> expiring — the app is SLOW, not dead. Go to Lesson 12.3.</span></div>
</div>
<div class="pitfall"><strong>Pitfall:</strong> <code>proxy_pass http://localhost:3000</code> where the app listens on IPv4 only. <code>localhost</code> resolves to <code>::1</code> first on a dual-stack machine, nginx tries IPv6, gets refused, and you get a 502 while <code>curl http://127.0.0.1:3000</code> works perfectly from the same box. The evidence is in the error log: <code>upstream: "http://[::1]:3000/…"</code>. Write <code>127.0.0.1</code> explicitly in <code>proxy_pass</code>, or make the app bind <code>::</code>.</div>

<h3>Recipe 5 — the container restarts forever</h3>
<pre><code>docker ps -a --format 'table {{.Names}}\\t{{.Status}}\\t{{.Image}}'
docker logs --tail 50 --timestamps cuonghoangdev_backend
docker inspect cuonghoangdev_backend --format '{{.State.ExitCode}} {{.State.OOMKilled}} {{.RestartCount}}'</code></pre>
<div class="out">NAMES                     STATUS                          IMAGE
cuonghoangdev_backend     Restarting (1) 3 seconds ago    cuonghoangdev-backend:latest
$ docker inspect cuonghoangdev_backend --format '{{.State.ExitCode}} {{.State.OOMKilled}} {{.RestartCount}}'
1 false 47</div>
<div class="kv-grid">
  <div class="kv"><span class="k">ExitCode 1, OOMKilled false</span><span class="v">The application itself is failing at startup. <code>docker logs</code> has the reason — usually a missing env var or an unreachable dependency.</span></div>
  <div class="kv"><span class="k">OOMKilled true (exit 137)</span><span class="v">The container hit its memory limit, or the host ran out. <code>docker stats</code> and the host's <code>dmesg -T</code>. Raise the limit or fix the leak — a restart just repeats it.</span></div>
  <div class="kv"><span class="k">Exit 127</span><span class="v">Command not found INSIDE the image. The entrypoint references a binary the image does not have — very common after switching base images.</span></div>
  <div class="kv"><span class="k">Exit 126</span><span class="v">Found but not executable: a missing <code>+x</code> on an entrypoint script, or a script with CRLF line endings, which makes the kernel look for an interpreter named <code>/bin/sh\\r</code>.</span></div>
  <div class="kv"><span class="k">Starts, then dies with no log</span><span class="v">The wrong architecture or libc. This project's own history: an image built from the wrong <code>Dockerfile</code> put glibc Prisma engines on a musl Alpine base — green build, green push, endless restarts, API down for seven minutes.</span></div>
</div>
<pre><code><span class="tok-comment"># Get a shell in the image WITHOUT the entrypoint — the fastest way to look around</span>
docker run --rm -it --entrypoint sh cuonghoangdev-backend:latest
<span class="tok-comment"># inside: ls -l /app/dist, node -v, ldd \$(which node) | head</span></code></pre>

<h3>Recipe 6 — you cannot SSH in at all</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Is the machine there?</span><span class="lz-t">ping -c3 IP · then the provider's console</span><span class="lz-d">No ping proves little (ICMP is often blocked), but a reply proves the host is up and routed — that alone eliminates half the possibilities.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Is the port open?</span><span class="lz-t">nc -vz IP 22</span><span class="lz-d">Refused = sshd is down; the machine is fine. Timed out = firewall or security group. Two different fixes, and neither involves your key.</span></div>
  <div class="lz-step"><span class="lz-k">3 · What does the client say?</span><span class="lz-t">ssh -vvv user@IP 2&gt;&amp;1 | tail -30</span><span class="lz-d">Verbose mode names the exact step that failed: which keys it offered, whether the server accepted the username, whether it fell through to password.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Permission denied (publickey)</span><span class="lz-t">check modes on the SERVER, via the console</span><span class="lz-d">Almost always <code>~/.ssh</code> or <code>authorized_keys</code> permissions (Lesson 11.3), a wrong <code>AllowUsers</code>, or a key added to the wrong user's file.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Use the provider's console</span><span class="lz-t">the web VNC / serial console</span><span class="lz-d">This is what it is for. Log in there, run <code>systemctl status ssh</code> and <code>sshd -T</code>, fix, and get out. If the console needs a password you never set, reset it from the provider's panel first.</span></div>
</div>
<pre><code><span class="tok-comment"># The server side of a rejected key — the message you cannot see from the client</span>
sudo journalctl -u ssh -n 20 --no-pager | grep -iE 'refused|invalid|denied'</code></pre>
<div class="out">Aug 22 19:22:31 vps-1 sshd[45012]: Authentication refused: bad ownership or modes for directory /home/deploy/.ssh
Aug 22 19:22:31 vps-1 sshd[45012]: Connection closed by authenticating user deploy 203.0.113.55 port 51992 [preauth]</div>
<p>The client said "Permission denied (publickey)" — a message that describes nothing. The server said exactly what is wrong. Whenever you can reach the server another way, its log is worth more than any amount of client-side <code>-vvv</code>.</p>

<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html#Process%20Exit%20Codes" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">systemd process exit codes</span><span class="lc-sub">The authoritative table for 200–242: CHDIR, EXEC, USER, NAMESPACE and the rest. Bookmark it — these codes tell you the answer before any log does.</span></span>
</a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">nginx — ngx_http_proxy_module</span><span class="lc-sub">Where <code>proxy_pass</code>, <code>proxy_read_timeout</code> and <code>proxy_next_upstream</code> are defined. The reference for turning a 502 or 504 into a specific configuration line.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: six machines, six outages</span><span class="lc-sub">Graded exercises: name the fault from an exit code alone, free a held port without <code>kill -9</code>, tell refused from timeout from reset given only <code>nc</code> output, and find the 502 whose cause is IPv6.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> treating "it works from the server" as proof the service is fine. <code>curl http://127.0.0.1:3000</code> succeeding while the outside world gets nothing usually means the app is bound to the loopback interface only. Check the Address column of <code>ss -tlnp</code>: <code>127.0.0.1:3000</code> is reachable from the machine and from nowhere else, while <code>0.0.0.0:3000</code> is reachable from everywhere. Behind nginx, loopback-only is CORRECT and deliberate; without a proxy in front, it is the bug.</div>
<p class="note-ct"><strong>Three things to remember.</strong> The exit code is the diagnosis — 203/EXEC and 217/USER tell you the unit is wrong and the logs are empty, so do not go looking for an error message that was never written. Refused, timed out and reset are three different problems in three different layers; one <code>nc -vz</code> tells you which, and it costs four seconds. And when a client-side error message is vague, get to the server's log — <code>Permission denied (publickey)</code> means nothing, while <code>bad ownership or modes for directory /home/deploy/.ssh</code> is the entire answer.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Sách công thức: nó chết</h2>
<p class="lead">Sáu công thức cho những cú hỏng mà có thứ gì đó đơn giản là không trả lời. Mỗi công thức gồm một triệu chứng, ý nghĩa THẬT của nó, một cái thang các câu lệnh, và cách sửa. Cứ đọc lộn xộn; sách công thức sinh ra để dùng như vậy.</p>

<h3>Công thức 1 — dịch vụ không chịu lên</h3>
<pre><code>systemctl status backend --no-pager -l        <span class="tok-comment"># dòng tiêu đề và vài dòng log cuối</span>
journalctl -u backend -n 50 --no-pager        <span class="tok-comment"># câu chuyện thật</span>
systemctl cat backend                         <span class="tok-comment"># unit NHƯ ĐÃ NẠP, gồm cả drop-in</span></code></pre>
<div class="out">× backend.service - Node API
     Loaded: loaded (/etc/systemd/system/backend.service; enabled)
     Active: failed (Result: exit-code) since Fri 2026-08-22 19:02:11 UTC; 8s ago
    Process: 44120 ExecStart=/usr/bin/node dist/index.js (code=exited, status=203/EXEC)
   Main PID: 44120 (code=exited, status=203/EXEC)</div>
<p>Cái mã thoát chính là toàn bộ chẩn đoán. Mã của systemd rất cụ thể và chúng cứu bạn khỏi việc đọc những dòng log CHƯA HỀ TỒN TẠI, bởi vì tiến trình chưa đi được xa tới mức sinh ra log nào:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">203/EXEC</span><span class="v">Không chạy được cái chương trình: sai đường dẫn, không có bit thực thi, hoặc đường dẫn tương đối (systemd KHÔNG tra <code>PATH</code>). Kiểm bằng <code>ls -l</code> lên đúng cái chuỗi trong <code>ExecStart=</code>.</span></div>
  <div class="kv"><span class="k">200/CHDIR</span><span class="v"><code>WorkingDirectory=</code> không tồn tại, hoặc cái <code>User=</code> không đi xuyên vào được (cần bit <code>x</code> trên mọi thư mục cha — Bài 4.1).</span></div>
  <div class="kv"><span class="k">217/USER</span><span class="v">Cái <code>User=</code> không tồn tại. Gõ sai, hoặc tài khoản đó chưa từng được tạo trên máy này.</span></div>
  <div class="kv"><span class="k">226/NAMESPACE</span><span class="v">Một chỉ thị hộp cát không thoả mãn được — thường là <code>ProtectSystem=strict</code> cộng một đường dẫn mà dịch vụ buộc phải ghi vào. Hãy thêm một <code>ReadWritePaths=</code>.</span></div>
  <div class="kv"><span class="k">1/FAILURE</span><span class="v">Chương trình ĐÃ CHẠY và thoát khác 0. Giờ thì journal có thứ đáng đọc: đây là lỗi ỨNG DỤNG, không phải lỗi unit.</span></div>
  <div class="kv"><span class="k">143 / 137</span><span class="v">Bị SIGTERM giết (tắt bình thường) hoặc SIGKILL. Một mã 137 mà bạn không hề gõ <code>stop</code> nghĩa là kẻ giết OOM hoặc một cú hết giờ — hãy xem <code>dmesg -T | tail</code> (Bài 5.3).</span></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Đọc mã thoát</span><span class="lz-t">systemctl status</span><span class="lz-d">Nếu là 203/200/217/226 thì vấn đề nằm ở UNIT và log sẽ rỗng. Thôi đừng đọc log ứng dụng nữa.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Chạy tay ExecStart, dưới đúng User</span><span class="lz-t">sudo -u deploy /usr/bin/node /srv/app/dist/index.js</span><span class="lz-d">Năm giây, và nó tách bạch hoàn toàn "systemd cấu hình sai" với "ứng dụng hỏng".</span></div>
  <div class="lz-step"><span class="lz-k">3 · Kiểm xem nó thật sự nạp cái gì</span><span class="lz-t">systemctl cat backend · systemctl show backend -p ExecStart -p User -p Environment</span><span class="lz-d">Một drop-in bạn quên, hoặc một lần sửa mà không <code>daemon-reload</code> (Bài 11.1), khiến file trên đĩa và unit trong bộ nhớ là hai văn bản khác nhau.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Kiểm môi trường nó nhận được</span><span class="lz-t">EnvironmentFile= có tồn tại? User= đọc được? giá trị có bị bọc nháy?</span><span class="lz-d">Thiếu <code>EnvironmentFile</code> là hỏng cứng; có mà không đọc được thì cũng vậy. Và systemd KHÔNG bóc dấu nháy như shell làm.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Giờ mới đọc journal</span><span class="lz-t">journalctl -u backend --since '10 min ago'</span><span class="lz-d">Chỉ khi chính cái unit đã được chứng minh là đúng. Không thì bạn đang đi tìm một thông báo lỗi mà tiến trình chưa từng sống đủ lâu để viết ra.</span></div>
</div>

<h3>Công thức 2 — "address already in use"</h3>
<pre><code>sudo ss -tlnp | grep ':3000'         <span class="tok-comment"># ai đang lắng nghe, và PID của nó</span>
sudo fuser -n tcp 3000               <span class="tok-comment"># cùng câu trả lời, ngắn hơn</span>
sudo lsof -i :3000                   <span class="tok-comment"># nếu máy có cài lsof</span>
ps -fp \$(sudo ss -tlnpH 'sport = :3000' | grep -oP 'pid=\\K[0-9]+' | head -1)</code></pre>
<div class="out">LISTEN 0 511 0.0.0.0:3000 0.0.0.0:* users:(("node",pid=41288,fd=21))
UID    PID  PPID  C STIME TTY   STAT   TIME CMD
deploy 41288 1    0 14:05 ?     Ssl    0:41 node /srv/app/dist/index.js</div>
<p>Một tiến trình mồ côi từ lần chạy trước, vẫn đang giữ cái cổng. Cha của nó là PID 1, nghĩa là thứ khởi chạy nó đã biến mất — một phiên <code>tmux</code> đã chết, một lệnh <code>node</code> gõ tay lúc gỡ lỗi, hoặc một dịch vụ bị thay mà không được dừng.</p>
<pre><code>sudo kill 41288                      <span class="tok-comment"># SIGTERM trước, LUÔN LUÔN (Bài 5.3)</span>
sleep 2; sudo ss -tlnp | grep ':3000' || echo "cổng đã trống"
<span class="tok-comment"># chỉ khi nó nhất định không chết:</span>
sudo kill -9 41288</code></pre>
<div class="callout"><strong>Hai thứ TRÔNG GIỐNG mà KHÔNG phải cổng bị giữ.</strong> Thứ nhất, socket ở trạng thái <code>TIME_WAIT</code>: <code>ss -tan | grep 3000</code> hiện ra hàng chục cái, không có gì đang lắng nghe, và một server bình thường vẫn bind được — <code>SO_REUSEADDR</code> lo chuyện đó và ứng dụng của bạn gần như chắc chắn có bật nó. Thứ hai, bind vào một địa chỉ không tồn tại: <code>EADDRNOTAVAIL</code> trông na ná trong vết ngăn xếp nhưng nghĩa là cái IP đó không có trên máy này (<code>ip addr</code>), chứ không phải cổng bị chiếm. Hãy đọc mã lỗi, đừng đọc dòng tóm tắt.</div>

<h3>Công thức 3 — refused, timeout, hay reset?</h3>
<p>Ba cú hỏng khác nhau mà người ta mô tả bằng cùng một câu chữ. Phân biệt được chúng là phân biệt giá trị nhất trong việc gỡ lỗi mạng, vì mỗi cái chỉ vào một TẦNG khác nhau.</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Connection refused</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bạn TỚI ĐƯỢC máy; không có gì đang lắng nghe</span><span class="lz-nsub">Máy chủ chủ động nói không (một gói TCP RST). Tin tốt — mạng chạy tốt. Dịch vụ đang chết, đã sập, hoặc bind vào cổng khác hay chỉ vào 127.0.0.1. Sửa ở phía MÁY CHỦ.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Connection timed out</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Không có gì trả lời hết</span><span class="lz-nsub">Gói tin rơi vào một cái hố: một tường lửa đang DROP im lặng, một security group, sai IP, hoặc máy đang tắt. Sửa ở phía MẠNG — <code>ufw status</code>, tường lửa của nhà cung cấp, <code>ip addr</code>.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Connection reset by peer</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Có thứ trả lời, rồi cúp máy giữa chừng</span><span class="lz-nsub">Kết nối đã được thiết lập. Một proxy hết giờ, ứng dụng sập giữa request, phía kia chờ TLS mà nhận HTTP thường, hoặc thân request vượt giới hạn. Sửa ở ỨNG DỤNG hoặc proxy.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Name or service not known</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bạn chưa từng lấy được một địa chỉ IP</span><span class="lz-nsub">Thuần DNS (Bài 9.1). Chưa có gì được thử cả; hãy kiểm <code>dig +short tên</code> và <code>/etc/resolv.conf</code> trước khi đụng vào bất cứ thứ gì khác.</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment"># Là cái nào? -m 5 để một cú timeout không bắt bạn chờ 2 phút</span>
curl -sS -m 5 -o /dev/null -w '%{http_code} %{time_total}s\\n' http://10.0.0.9:3000/health
nc -vz 10.0.0.9 3000                 <span class="tok-comment"># chỉ TCP, không HTTP — cô lập đúng tầng</span></code></pre>
<div class="out">$ nc -vz 10.0.0.9 3000
nc: connect to 10.0.0.9 port 3000 (tcp) failed: Connection refused
$ nc -vz 10.0.0.9 5432
nc: connect to 10.0.0.9 port 5432 (tcp) timed out: Operation now in progress</div>
<p>Cổng 3000: refused, nên máy tới được và dịch vụ đang chết — vấn đề của máy chủ. Cổng 5432: timed out, nên có tường lửa đang thả gói — vấn đề của mạng. Cùng một cái máy, hai cuộc điều tra khác nhau, phân biệt trong bốn giây bằng đúng một cái cờ.</p>

<h3>Công thức 4 — nginx trả về 502 Bad Gateway</h3>
<p>502 nghĩa là nginx không lấy được một phản hồi hợp lệ từ cái nằm sau nó. nginx VẪN CHẠY — chính điều đó làm cho 502 hữu ích. Log lỗi của nó gọi tên lý do rất chính xác:</p>
<pre><code>sudo tail -20 /var/log/nginx/error.log
sudo ss -tlnp | grep -E ':(3000|8080)'
curl -sS -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:3000/health
sudo nginx -T | grep -A3 proxy_pass          <span class="tok-comment"># thứ nginx THẬT SỰ đã nạp</span></code></pre>
<div class="out">2026/08/22 19:14:02 [error] 812#812: *4471 connect() failed (111: Connection refused)
  while connecting to upstream, client: 203.0.113.55, server: example.com,
  request: "GET /api/v1/posts HTTP/1.1", upstream: "http://127.0.0.1:3000/api/v1/posts"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">111: Connection refused</span><span class="v">Upstream không lắng nghe. Về Công thức 1 — ứng dụng đang chết. Đây là trường hợp phổ biến hơn hẳn phần còn lại.</span></div>
  <div class="kv"><span class="k">110: Connection timed out</span><span class="v">Ứng dụng nhận kết nối rồi không bao giờ trả lời. Nó còn sống nhưng đang kẹt: hãy xem vòng lặp sự kiện có bị chặn, một truy vấn cơ sở dữ liệu treo, hay bể kết nối đã cạn.</span></div>
  <div class="kv"><span class="k">13: Permission denied</span><span class="v">Upstream kiểu socket Unix. Socket có tồn tại nhưng <code>www-data</code> không mở được — hãy kiểm quyền của socket và bit <code>x</code> của thư mục (Bài 4.1).</span></div>
  <div class="kv"><span class="k">upstream prematurely closed connection</span><span class="v">Ứng dụng sập giữa lúc trả lời. Lý do nằm trong log của CHÍNH ỨNG DỤNG, ở đúng cái giây đó — <code>journalctl -u backend --since</code> ngay mốc thời gian ấy.</span></div>
  <div class="kv"><span class="k">no live upstreams</span><span class="v">Mọi server trong khối upstream đều bị đánh dấu chết sau nhiều lần hỏng liên tiếp. Hãy sửa các backend; nginx tự thử lại theo lịch của nó.</span></div>
  <div class="kv"><span class="k">504 chứ không phải 502</span><span class="v">KHÔNG cùng một con bọ. 504 là <code>proxy_read_timeout</code> hết giờ — ứng dụng CHẬM, không phải chết. Hãy sang Bài 12.3.</span></div>
</div>
<div class="pitfall"><strong>Bẫy:</strong> <code>proxy_pass http://localhost:3000</code> trong khi ứng dụng chỉ lắng nghe trên IPv4. <code>localhost</code> phân giải ra <code>::1</code> trước trên một máy chạy song song hai ngăn xếp, nginx thử IPv6, bị từ chối, và bạn nhận 502 trong khi <code>curl http://127.0.0.1:3000</code> chạy hoàn hảo trên chính cái máy đó. Bằng chứng nằm trong log lỗi: <code>upstream: "http://[::1]:3000/…"</code>. Hãy ghi thẳng <code>127.0.0.1</code> trong <code>proxy_pass</code>, hoặc cho ứng dụng bind vào <code>::</code>.</div>

<h3>Công thức 5 — container khởi động lại mãi không thôi</h3>
<pre><code>docker ps -a --format 'table {{.Names}}\\t{{.Status}}\\t{{.Image}}'
docker logs --tail 50 --timestamps cuonghoangdev_backend
docker inspect cuonghoangdev_backend --format '{{.State.ExitCode}} {{.State.OOMKilled}} {{.RestartCount}}'</code></pre>
<div class="out">NAMES                     STATUS                          IMAGE
cuonghoangdev_backend     Restarting (1) 3 seconds ago    cuonghoangdev-backend:latest
$ docker inspect cuonghoangdev_backend --format '{{.State.ExitCode}} {{.State.OOMKilled}} {{.RestartCount}}'
1 false 47</div>
<div class="kv-grid">
  <div class="kv"><span class="k">ExitCode 1, OOMKilled false</span><span class="v">Chính ứng dụng hỏng lúc khởi động. <code>docker logs</code> có lý do — thường là thiếu một biến môi trường hoặc một thứ phụ thuộc không nối tới được.</span></div>
  <div class="kv"><span class="k">OOMKilled true (thoát 137)</span><span class="v">Container chạm trần bộ nhớ của nó, hoặc máy chủ hết RAM. Xem <code>docker stats</code> và <code>dmesg -T</code> của máy chủ. Hãy nâng trần hoặc sửa chỗ rò — khởi động lại chỉ lặp lại y hệt.</span></div>
  <div class="kv"><span class="k">Thoát 127</span><span class="v">Không tìm thấy câu lệnh BÊN TRONG ảnh. Entrypoint trỏ tới một chương trình mà ảnh không có — rất hay gặp sau khi đổi ảnh nền.</span></div>
  <div class="kv"><span class="k">Thoát 126</span><span class="v">Tìm thấy nhưng không chạy được: thiếu <code>+x</code> trên script entrypoint, hoặc một script có ký tự xuống dòng kiểu CRLF, khiến nhân đi tìm một trình thông dịch tên là <code>/bin/sh\\r</code>.</span></div>
  <div class="kv"><span class="k">Lên rồi chết mà không có log</span><span class="v">Sai kiến trúc hoặc sai libc. Chính lịch sử của dự án này: một ảnh dựng từ nhầm <code>Dockerfile</code> đã đặt engine Prisma bản glibc lên nền Alpine musl — build xanh, đẩy xanh, restart vô tận, và API chết bảy phút.</span></div>
</div>
<pre><code><span class="tok-comment"># Mở một shell trong ảnh mà KHÔNG chạy entrypoint — cách nhanh nhất để ngó quanh</span>
docker run --rm -it --entrypoint sh cuonghoangdev-backend:latest
<span class="tok-comment"># bên trong: ls -l /app/dist, node -v, ldd \$(which node) | head</span></code></pre>

<h3>Công thức 6 — bạn không SSH vào được</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Cái máy còn đó không?</span><span class="lz-t">ping -c3 IP · rồi tới console của nhà cung cấp</span><span class="lz-d">Không ping được thì chứng minh được ít (ICMP hay bị chặn), nhưng có phản hồi thì chứng minh máy còn sống và định tuyến tới được — riêng điều đó đã loại một nửa khả năng.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Cổng có mở không?</span><span class="lz-t">nc -vz IP 22</span><span class="lz-d">Refused = sshd đang chết; máy vẫn ổn. Timed out = tường lửa hoặc security group. Hai cách sửa khác nhau, và không cách nào dính tới cái khoá của bạn.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Phía máy khách nói gì?</span><span class="lz-t">ssh -vvv user@IP 2&gt;&amp;1 | tail -30</span><span class="lz-d">Chế độ chi tiết gọi tên đúng bước đã hỏng: nó chào những khoá nào, máy chủ có chấp nhận tên người dùng không, có rơi xuống mật khẩu không.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Permission denied (publickey)</span><span class="lz-t">kiểm quyền trên MÁY CHỦ, qua console</span><span class="lz-d">Gần như luôn là quyền của <code>~/.ssh</code> hay <code>authorized_keys</code> (Bài 11.3), một <code>AllowUsers</code> sai, hoặc khoá thêm nhầm vào file của người dùng khác.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Dùng console của nhà cung cấp</span><span class="lz-t">console VNC / nối tiếp trên web</span><span class="lz-d">Nó sinh ra để dùng cho đúng lúc này. Đăng nhập ở đó, chạy <code>systemctl status ssh</code> và <code>sshd -T</code>, sửa, rồi thoát. Nếu console đòi một mật khẩu bạn chưa từng đặt thì hãy đặt lại nó từ bảng điều khiển của nhà cung cấp trước.</span></div>
</div>
<pre><code><span class="tok-comment"># Phía máy chủ của một cái khoá bị từ chối — thông báo mà máy khách không thấy được</span>
sudo journalctl -u ssh -n 20 --no-pager | grep -iE 'refused|invalid|denied'</code></pre>
<div class="out">Aug 22 19:22:31 vps-1 sshd[45012]: Authentication refused: bad ownership or modes for directory /home/deploy/.ssh
Aug 22 19:22:31 vps-1 sshd[45012]: Connection closed by authenticating user deploy 203.0.113.55 port 51992 [preauth]</div>
<p>Máy khách nói "Permission denied (publickey)" — một thông báo chẳng mô tả gì cả. Máy chủ thì nói chính xác cái gì sai. Bất cứ khi nào bạn tới được máy chủ bằng đường khác, log của nó đáng giá hơn mọi lượng <code>-vvv</code> phía máy khách.</p>

<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html#Process%20Exit%20Codes" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">Mã thoát tiến trình của systemd</span><span class="lc-sub">Bảng chuẩn cho dải 200–242: CHDIR, EXEC, USER, NAMESPACE và phần còn lại. Hãy đánh dấu trang này — mấy mã đó cho bạn câu trả lời trước cả log.</span></span>
</a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">nginx — ngx_http_proxy_module</span><span class="lc-sub">Nơi định nghĩa <code>proxy_pass</code>, <code>proxy_read_timeout</code> và <code>proxy_next_upstream</code>. Tài liệu để biến một cú 502 hay 504 thành một dòng cấu hình cụ thể.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: sáu cái máy, sáu sự cố</span><span class="lc-sub">Bài chấm điểm: gọi tên cái hỏng chỉ từ một mã thoát, giải phóng một cổng bị giữ mà không dùng <code>kill -9</code>, phân biệt refused với timeout với reset khi chỉ có output của <code>nc</code>, và tìm ra cú 502 mà nguyên nhân là IPv6.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> coi "chạy được từ trên máy chủ" là bằng chứng dịch vụ vẫn ổn. <code>curl http://127.0.0.1:3000</code> thành công trong khi thế giới bên ngoài không nhận được gì thường có nghĩa là ứng dụng chỉ bind vào giao diện loopback. Hãy nhìn cột Address của <code>ss -tlnp</code>: <code>127.0.0.1:3000</code> chỉ tới được từ chính cái máy và không từ đâu khác, còn <code>0.0.0.0:3000</code> thì tới được từ mọi nơi. Nằm sau nginx thì chỉ-loopback là ĐÚNG và có chủ ý; không có proxy đứng trước thì đó chính là con bọ.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Mã thoát chính là chẩn đoán — 203/EXEC và 217/USER nói cho bạn biết cái unit sai và log thì rỗng, nên đừng đi tìm một thông báo lỗi chưa từng được viết ra. Refused, timed out và reset là ba vấn đề khác nhau ở ba tầng khác nhau; một lệnh <code>nc -vz</code> nói cho bạn biết là cái nào, và nó tốn bốn giây. Và khi thông báo lỗi phía máy khách mơ hồ, hãy tới log của máy chủ — <code>Permission denied (publickey)</code> chẳng nghĩa gì, còn <code>bad ownership or modes for directory /home/deploy/.ssh</code> là trọn vẹn câu trả lời.</p>
</div>
`,
    },
    /* ─────────────────────────── 12.3 ─────────────────────────── */
    {
      title: '12.3 — Cookbook: it is slow|||12.3 — Sách công thức: nó chậm',
      slug: 'lnx-12-3-no-cham',
      type: 'LESSON',
      description: 'Tải cao nghĩa là gì, CPU kịch trần, chờ I/O, sức ép bộ nhớ và available so với free, đĩa đầy giữa lúc sự cố, và trường hợp khó nhất: chậm mà không có gì bận.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>Cookbook: it is slow</h2>
<p class="lead">"Down" is easy — something is not answering and you go find it. "Slow" is harder, because everything is technically working and the machine will happily tell you it is fine. Six recipes for finding the resource that has run out, including the case where none of them have.</p>

<h3>Recipe 1 — what "load" actually means</h3>
<pre><code>uptime; nproc
cat /proc/pressure/cpu /proc/pressure/io /proc/pressure/memory   <span class="tok-comment"># PSI, kernel 4.20+</span></code></pre>
<div class="out">$ uptime
 19:31:44 up 12 days, 4:12, 1 user, load average: 8.21, 7.94, 6.02
$ nproc
2
$ cat /proc/pressure/io
some avg10=61.44 avg60=58.02 avg300=41.17 total=884213004
full avg10=44.10 avg60=42.55 avg300=30.09 total=612004112</div>
<p>Load average on Linux is <strong>not</strong> a CPU percentage. It counts processes that are running <em>plus</em> processes stuck in uninterruptible sleep — almost always waiting on disk or network storage. That is why a load of 8 on 2 cores can mean "the CPU is on fire" or "the CPU is idle and the disk is dying", and the number alone cannot tell you which.</p>
<p><code>/proc/pressure</code> settles it in one read. <code>io.full avg10=44</code> means that for 44% of the last ten seconds, <em>every</em> runnable task was blocked on I/O. That is a disk problem, definitively, before you have opened a single monitoring tool.</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">High load + high %us</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">CPU-bound — real work or a runaway loop</span><span class="lz-nsub">Find the process (<code>top</code>, <code>ps aux --sort=-%cpu</code>). One process at 100% of one core is usually a bug; everything at 60% is usually genuine traffic.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">High load + high %wa</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">I/O-bound — the disk is the ceiling</span><span class="lz-nsub">CPU is idle and waiting. Recipe 3. On a VPS this is also how a noisy neighbour or a throttled volume looks.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">High load + high %sy</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Kernel time — syscalls, context switches, network</span><span class="lz-nsub">Often a process making millions of tiny reads, or a container storage driver. <code>strace -c -p PID</code> for ten seconds names the syscall.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">High load, everything idle</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Processes stuck in D state</span><span class="lz-nsub"><code>ps -eo state,pid,cmd | grep '^D'</code>. Uninterruptible sleep: a hung NFS mount, a failing disk, or a stuck kernel driver. These cannot even be killed.</span></div></div>
  </div>
</div>

<h3>Recipe 2 — CPU pinned</h3>
<pre><code>top -b -n1 | head -12                       <span class="tok-comment"># snapshot, script-friendly</span>
ps -eo pid,ppid,%cpu,%mem,etime,cmd --sort=-%cpu | head -6
top -H -p 41288 -b -n1 | head -14           <span class="tok-comment"># per THREAD inside one process</span>
sudo strace -c -f -p 41288 &amp; sleep 10; kill %1   <span class="tok-comment"># which syscall dominates</span></code></pre>
<div class="out">%Cpu(s): 97.2 us,  2.1 sy,  0.0 ni,  0.5 id,  0.0 wa
  PID  PPID %CPU %MEM     ELAPSED CMD
41288     1 99.4  6.1    05:12:44 node /srv/app/dist/index.js
  812     1  1.1  0.8  12-04:11:02 nginx: worker process</div>
<p>One process, one core, 99%, and it has been alive five hours. Two questions decide what to do: is the CPU time <em>growing</em> (a leak or an infinite loop) or <em>steady</em> (real work)? And did it start at a deploy?</p>
<pre><code><span class="tok-comment"># Is it stuck, or working? Compare CPU seconds over 10s</span>
for i in 1 2 3; do ps -o etimes=,times= -p 41288; sleep 5; done</code></pre>
<div class="out">18764 18701
18769 18706
18774 18711</div>
<p>Five seconds of wall clock, five seconds of CPU, every interval: this process is burning a whole core continuously, not doing bursts of work. For Node.js that means a blocked event loop — a synchronous regex, a giant <code>JSON.parse</code>, or a loop that never exits. The fix is in the code, and the diagnosis took fifteen seconds.</p>
<div class="callout"><strong><code>%CPU</code> over 100 is normal and not a bug.</strong> <code>top</code> and <code>ps</code> report per-CPU percentages, so a process using four cores fully shows 400%. Press <code>1</code> in <code>top</code> to see cores individually. What matters is the ratio to <code>nproc</code>: 100% on a 16-core box is one saturated thread inside an otherwise idle machine — a latency problem for the requests hitting that thread, not a capacity problem for the server.</div>

<h3>Recipe 3 — waiting on the disk</h3>
<pre><code>vmstat 1 5                        <span class="tok-comment"># the wa column, and bi/bo</span>
iostat -xz 1 3                    <span class="tok-comment"># apt install sysstat</span>
sudo iotop -bon2 | head -12       <span class="tok-comment"># which process, if iotop is installed</span></code></pre>
<div class="out">Device  r/s     w/s   rkB/s    wkB/s  r_await w_await  aqu-sz  %util
vda    2.10  412.00   16.80  51488.00     0.81   181.44   74.82  99.60</div>
<div class="kv-grid">
  <div class="kv"><span class="k">%util near 100</span><span class="v">The device is busy essentially all the time. On an SSD or a network volume this is less damning than it sounds — they handle parallel requests — so read it together with <code>await</code>.</span></div>
  <div class="kv"><span class="k">w_await 181ms</span><span class="v">This is the real finding. A write is taking 181 milliseconds; a healthy SSD is under 5. Either the device is saturated or the provider is throttling you (burst IOPS credits are a common cause on cloud volumes).</span></div>
  <div class="kv"><span class="k">aqu-sz 74</span><span class="v">Seventy-four requests queued at all times. Every one of those is a process in D state, and every one of them counts toward load average.</span></div>
  <div class="kv"><span class="k">wkB/s 51488</span><span class="v">50MB/s of writes, sustained. Find the writer — a runaway log (Lesson 10.1), a database checkpoint storm, a backup running in the foreground, or a build.</span></div>
  <div class="kv"><span class="k">r/s tiny, w/s huge</span><span class="v">Write-dominated. Logs and databases. If reads dominate instead, suspect a cold cache after a restart, or a query doing full table scans.</span></div>
</div>
<pre><code><span class="tok-comment"># Who is writing? Two ways, no extra packages needed for the second</span>
sudo iotop -bon2 -o | head
sudo find /proc -maxdepth 2 -name io 2&gt;/dev/null | while read f; do
  p=\$(dirname "\$f"); w=\$(awk '/^write_bytes/{print \$2}' "\$f" 2&gt;/dev/null)
  [ "\${w:-0}" -gt 1000000000 ] &amp;&amp; echo "\$(tr -d '\\0' &lt; \$p/cmdline | head -c60) \$((w/1024/1024))MB"
done | sort -k2 -rn | head -5</code></pre>
<div class="out">node /srv/app/dist/index.js 41288  62914MB
postgres: checkpointer  3401       8211MB</div>

<h3>Recipe 4 — memory pressure</h3>
<pre><code>free -h
vmstat 1 5                    <span class="tok-comment"># si/so columns = swap in/out</span>
ps aux --sort=-%mem | head -6
cat /sys/fs/cgroup/memory.pressure 2&gt;/dev/null
dmesg -T | grep -i 'out of memory' | tail -5</code></pre>
<div class="out">               total        used        free      shared  buff/cache   available
Mem:           7.8Gi       2.1Gi       197Mi       88Mi       5.5Gi       5.3Gi
Swap:          2.0Gi          0B       2.0Gi</div>
<div class="callout warn"><strong>Read the <code>available</code> column, never <code>free</code>.</strong> 197Mi "free" looks alarming and is completely healthy: Linux uses spare RAM as page cache, and that 5.5Gi of <code>buff/cache</code> is handed back the instant a process asks for memory. <code>available</code> — 5.3Gi here — is the honest number. A machine with a low <code>free</code> and a high <code>available</code> is a machine using its memory correctly, and "we added RAM because free was low" is a fix for a problem nobody had.</div>
<pre><code><span class="tok-comment"># Real pressure looks like this instead — nonzero si/so, sustained</span>
vmstat 1 5</code></pre>
<div class="out">procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 3  6 2010112  61204   1128  74112 4812 5104  9822 11044 4218 9911 12  9  6 73  0</div>
<p>4.8MB/s swapping in and 5.1MB/s out, six processes blocked, 73% I/O wait. This machine is thrashing: it is spending its time moving memory to and from disk instead of working. Adding swap does not fix this — swap is what turned an instant OOM kill into a slow death. The fix is less memory usage or more RAM.</p>
<pre><code><span class="tok-comment"># Which process grew? RSS in MB, biggest first</span>
ps -eo pid,rss,etimes,cmd --sort=-rss | head -6 | awk '{\$2=int(\$2/1024)"MB"; print}'</code></pre>
<div class="out">41288 1842MB 18774 node /srv/app/dist/index.js
3401 402MB 1042118 /usr/lib/postgresql/16/bin/postgres
812 21MB 1051862 nginx: master process</div>
<div class="callout"><strong>Growing RSS plus a long <code>etimes</code> is the signature of a leak.</strong> Sample it three times ten minutes apart; a leak climbs monotonically while normal usage plateaus. Restarting buys you time proportional to how fast it climbs — useful during an incident, useless as a fix, and worth writing in the follow-up column (Lesson 12.1).</div>

<h3>Recipe 5 — the disk filled up mid-incident</h3>
<p>Chapter 10 covered this properly. Mid-incident you want the three commands that find the cause fastest, in order:</p>
<pre><code>df -h | grep -vE 'tmpfs|udev'; df -i | grep -vE 'tmpfs|udev'
sudo du -x --max-depth=1 / 2&gt;/dev/null | sort -rn | head -8      <span class="tok-comment"># -x: stay on one filesystem</span>
sudo lsof -nP +L1 2&gt;/dev/null | awk '\$7&gt;1073741824' | head       <span class="tok-comment"># deleted but still open</span></code></pre>
<div class="out">/dev/vda1  79G  79G  0  100% /
14680064  14012431  667633  96% /
41287632  /var
38911204  /var/log
38904112  /var/log/app
COMMAND  PID   USER FD TYPE DEVICE     SIZE/OFF NLINK NODE NAME
node    41288 deploy 9w REG  253,1  44023414784     0  918 /var/log/app/debug.log (deleted)</div>
<p>Somebody already ran <code>rm</code> on the 41GB log and freed nothing, because node still holds the file open (Lesson 10.1). <code>lsof +L1</code> lists exactly those: link count zero, size enormous. Restarting the writer releases it instantly — and next time, <code>truncate -s 0</code> instead of <code>rm</code>.</p>
<div class="pitfall"><strong>Pitfall:</strong> "the disk is not full, so it is not a disk problem" — with 96% of inodes used and a normal-looking <code>df -h</code>. Every write then fails with <code>No space left on device</code> while gigabytes remain free, and the usual culprit is millions of tiny files: a session directory, a cache, or a mail spool. <code>df -i</code> belongs next to <code>df -h</code> in every sweep, which is why it is in the one in Lesson 12.1.</div>

<h3>Recipe 6 — slow, but nothing is busy</h3>
<p>The hardest and most common case: requests take eight seconds, CPU is 4%, disk is idle, memory is fine. Nothing is busy because nothing is <em>working</em> — everything is waiting on something else.</p>
<pre><code><span class="tok-comment"># Break one request into its phases — this is the whole diagnosis</span>
curl -sS -o /dev/null -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}\\n' \\
  https://example.com/api/v1/posts</code></pre>
<div class="out">dns=0.004 connect=0.021 tls=0.061 ttfb=8.402 total=8.409</div>
<div class="kv-grid">
  <div class="kv"><span class="k">dns high</span><span class="v">Resolver problems. Check <code>/etc/resolv.conf</code> and time a lookup with <code>dig</code> (Lesson 9.1). A dead secondary nameserver adds a fixed 5s timeout to everything.</span></div>
  <div class="kv"><span class="k">connect high</span><span class="v">Network or a full accept queue. <code>ss -lnt</code> shows <code>Recv-Q</code> against <code>Send-Q</code> (the backlog); a <code>Recv-Q</code> at the limit means connections are queuing before your app ever sees them.</span></div>
  <div class="kv"><span class="k">tls high</span><span class="v">Handshake cost, or OCSP stapling fetching from a slow CA. Rare, but it shows up as a fixed penalty on every new connection.</span></div>
  <div class="kv"><span class="k">ttfb high, everything else fast</span><span class="v">The application is thinking — or waiting on a database, a cache, or an upstream API. This is the common case, and it means the machine is innocent.</span></div>
  <div class="kv"><span class="k">total ≫ ttfb</span><span class="v">The response body is slow to transfer: a huge payload, a slow client, or bandwidth throttling. Look at response size before blaming the server.</span></div>
</div>
<pre><code><span class="tok-comment"># Where is the app waiting? Look at its connections, not its CPU</span>
ss -tanp state established | grep -c 5432          <span class="tok-comment"># open DB connections</span>
ss -tanp state established '( dport = :443 )' | head <span class="tok-comment"># outbound API calls in flight</span>
ss -lnt | head -5                                   <span class="tok-comment"># accept-queue backlog</span></code></pre>
<div class="out">$ ss -tanp state established | grep -c 5432
100
$ ss -lnt | head -3
State  Recv-Q Send-Q Local Address:Port
LISTEN 511    511          0.0.0.0:3000
LISTEN 0      511          0.0.0.0:80</div>
<p>Exactly 100 database connections — a suspiciously round number, which means it is a configured pool limit, not a coincidence. And <code>Recv-Q 511</code> equal to <code>Send-Q 511</code> on port 3000 means the accept queue is completely full: new connections are queuing in the kernel while every worker waits for a database connection that will not come. The machine is idle because it is deadlocked on a pool, and no amount of CPU or RAM would help.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Split the request</span><span class="lz-t">curl -w timings</span><span class="lz-d">DNS, connect, TLS, TTFB, total. One command tells you which of five layers owns the delay.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Confirm the machine is innocent</span><span class="lz-t">load, %wa, available memory, %util</span><span class="lz-d">If all four are calm while requests are slow, stop looking at the OS. You are debugging waiting, not resources.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Look at what it is waiting ON</span><span class="lz-t">ss -tanp state established</span><span class="lz-d">Count connections per destination port. A round number is a pool limit; a growing number is a leak; zero to the database is the answer on its own.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Check the queue in front</span><span class="lz-t">ss -lnt · nginx active connections</span><span class="lz-d">A full accept queue means the symptom is one layer downstream of where users feel it.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Time the dependency directly</span><span class="lz-t">psql -c '\\timing' · curl the upstream API</span><span class="lz-d">Cut your app out of the loop. If the database answers in 4 seconds from the shell, the investigation has moved and your app was never the problem.</span></div>
</div>

<a class="link-card" href="https://docs.kernel.org/accounting/psi.html" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">PSI — Pressure Stall Information</span><span class="lc-sub">The kernel documentation for <code>/proc/pressure/*</code>. It answers "how much time was lost waiting for CPU / IO / memory", which load average cannot. Underused and available on every modern kernel.</span></span>
</a>
<a class="link-card" href="https://www.brendangregg.com/blog/2017-08-08/linux-load-averages.html" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">Linux load averages: solving the mystery</span><span class="lc-sub">Why Linux counts uninterruptible sleep in load and other Unixes do not — including the 1993 patch that did it. This is the article that makes the number finally make sense.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/iostat.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">💽</span>
  <span class="lc-body"><span class="lc-title">iostat(1) — every column explained</span><span class="lc-sub">What <code>await</code>, <code>aqu-sz</code> and <code>%util</code> actually measure, and why <code>%util</code> alone is misleading on SSDs and virtualised storage.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: four slow machines</span><span class="lc-sub">Graded exercises: separate CPU-bound from I/O-bound from D-state using only <code>vmstat</code>, read a <code>curl -w</code> breakdown and name the guilty layer, and spot the exhausted connection pool from <code>ss</code> output alone.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> optimising the thing you can see instead of the thing that is slow. A CPU at 60% during an eight-second request is not the cause — it is what the machine does while waiting. Before you tune anything, get the phase breakdown from <code>curl -w</code> and confirm which layer owns the time. Most "server is slow" incidents end at a database query, an upstream API, or a connection pool, and every hour spent on kernel parameters first is an hour the actual cause kept running.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Load average is not CPU — read <code>/proc/pressure</code> or the <code>%wa</code> column to find out whether the machine is computing or waiting. Read <code>available</code>, not <code>free</code>: page cache is not memory you have lost, and the real signature of memory trouble is sustained <code>si</code>/<code>so</code> in <code>vmstat</code>. And when nothing is busy but everything is slow, stop looking at resources and start counting connections — the answer is almost always something your machine is waiting for, not something it is doing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>Sách công thức: nó chậm</h2>
<p class="lead">"Chết" thì dễ — có thứ gì đó không trả lời và bạn đi tìm nó. "Chậm" thì khó hơn, vì về mặt kỹ thuật mọi thứ đều đang chạy và cái máy sẽ vui vẻ báo với bạn rằng nó vẫn ổn. Sáu công thức để tìm ra cái tài nguyên đã cạn, kể cả trường hợp KHÔNG CÁI NÀO cạn cả.</p>

<h3>Công thức 1 — "load" thật ra nghĩa là gì</h3>
<pre><code>uptime; nproc
cat /proc/pressure/cpu /proc/pressure/io /proc/pressure/memory   <span class="tok-comment"># PSI, nhân 4.20 trở lên</span></code></pre>
<div class="out">$ uptime
 19:31:44 up 12 days, 4:12, 1 user, load average: 8.21, 7.94, 6.02
$ nproc
2
$ cat /proc/pressure/io
some avg10=61.44 avg60=58.02 avg300=41.17 total=884213004
full avg10=44.10 avg60=42.55 avg300=30.09 total=612004112</div>
<p>Load average trên Linux <strong>KHÔNG</strong> phải phần trăm CPU. Nó đếm những tiến trình đang chạy <em>CỘNG VỚI</em> những tiến trình kẹt trong giấc ngủ không ngắt được — gần như luôn là đang chờ đĩa hoặc chờ ổ lưu trữ qua mạng. Vì thế load 8 trên 2 nhân có thể nghĩa là "CPU đang bốc cháy" hoặc "CPU rảnh rỗi còn cái đĩa thì đang hấp hối", và riêng con số đó không nói được là cái nào.</p>
<p><code>/proc/pressure</code> giải quyết chuyện đó trong một lần đọc. <code>io.full avg10=44</code> nghĩa là trong 44% của mười giây vừa rồi, <em>MỌI</em> tác vụ có thể chạy đều đang bị chặn ở I/O. Đó là một vấn đề về đĩa, dứt khoát, trước cả khi bạn mở một công cụ giám sát nào.</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Load cao + %us cao</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nghẽn ở CPU — việc thật hoặc một vòng lặp mất kiểm soát</span><span class="lz-nsub">Hãy tìm tiến trình (<code>top</code>, <code>ps aux --sort=-%cpu</code>). Một tiến trình chiếm 100% của một nhân thường là con bọ; mọi thứ ở mức 60% thì thường là lưu lượng thật.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Load cao + %wa cao</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nghẽn ở I/O — cái đĩa là trần</span><span class="lz-nsub">CPU rảnh và đang chờ. Công thức 3. Trên VPS thì đây cũng là dáng vẻ của một hàng xóm ồn ào hoặc một ổ đĩa bị bóp băng thông.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Load cao + %sy cao</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Thời gian trong nhân — lời gọi hệ thống, chuyển ngữ cảnh, mạng</span><span class="lz-nsub">Thường là một tiến trình đọc hàng triệu mẩu tí xíu, hoặc trình điều khiển lưu trữ của container. <code>strace -c -p PID</code> trong mười giây sẽ gọi tên lời gọi hệ thống đó.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Load cao, mọi thứ đều rảnh</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Tiến trình kẹt ở trạng thái D</span><span class="lz-nsub"><code>ps -eo state,pid,cmd | grep '^D'</code>. Giấc ngủ không ngắt được: một điểm gắn NFS treo, một cái đĩa đang hỏng, hoặc một trình điều khiển trong nhân bị kẹt. Những cái này còn không giết được.</span></div></div>
  </div>
</div>

<h3>Công thức 2 — CPU kịch trần</h3>
<pre><code>top -b -n1 | head -12                       <span class="tok-comment"># chụp một phát, hợp với script</span>
ps -eo pid,ppid,%cpu,%mem,etime,cmd --sort=-%cpu | head -6
top -H -p 41288 -b -n1 | head -14           <span class="tok-comment"># theo TỪNG LUỒNG trong một tiến trình</span>
sudo strace -c -f -p 41288 &amp; sleep 10; kill %1   <span class="tok-comment"># lời gọi hệ thống nào áp đảo</span></code></pre>
<div class="out">%Cpu(s): 97.2 us,  2.1 sy,  0.0 ni,  0.5 id,  0.0 wa
  PID  PPID %CPU %MEM     ELAPSED CMD
41288     1 99.4  6.1    05:12:44 node /srv/app/dist/index.js
  812     1  1.1  0.8  12-04:11:02 nginx: worker process</div>
<p>Một tiến trình, một nhân, 99%, và nó đã sống năm tiếng. Hai câu hỏi quyết định phải làm gì: thời gian CPU có đang <em>TĂNG</em> (rò rỉ hay vòng lặp vô hạn) hay <em>ĐỀU</em> (việc thật)? Và nó bắt đầu từ một bản deploy phải không?</p>
<pre><code><span class="tok-comment"># Nó kẹt hay đang làm việc? So số giây CPU qua 10 giây</span>
for i in 1 2 3; do ps -o etimes=,times= -p 41288; sleep 5; done</code></pre>
<div class="out">18764 18701
18769 18706
18774 18711</div>
<p>Năm giây đồng hồ treo tường, năm giây CPU, ở mọi khoảng đo: tiến trình này đang đốt trọn một nhân LIÊN TỤC, không phải làm việc theo từng đợt. Với Node.js thì điều đó nghĩa là vòng lặp sự kiện bị chặn — một biểu thức chính quy chạy đồng bộ, một cú <code>JSON.parse</code> khổng lồ, hoặc một vòng lặp không bao giờ thoát. Cách sửa nằm trong mã nguồn, và phần chẩn đoán tốn mười lăm giây.</p>
<div class="callout"><strong><code>%CPU</code> vượt quá 100 là bình thường và không phải lỗi.</strong> <code>top</code> và <code>ps</code> báo phần trăm theo TỪNG CPU, nên một tiến trình dùng trọn bốn nhân hiện ra 400%. Bấm <code>1</code> trong <code>top</code> để thấy từng nhân riêng. Thứ có ý nghĩa là tỷ lệ so với <code>nproc</code>: 100% trên một máy 16 nhân là MỘT luồng bão hoà bên trong một cái máy còn lại rảnh rỗi — đó là vấn đề độ trễ cho những request rơi trúng luồng đó, không phải vấn đề sức chứa của máy chủ.</div>

<h3>Công thức 3 — đang chờ cái đĩa</h3>
<pre><code>vmstat 1 5                        <span class="tok-comment"># cột wa, và bi/bo</span>
iostat -xz 1 3                    <span class="tok-comment"># apt install sysstat</span>
sudo iotop -bon2 | head -12       <span class="tok-comment"># tiến trình nào, nếu máy có cài iotop</span></code></pre>
<div class="out">Device  r/s     w/s   rkB/s    wkB/s  r_await w_await  aqu-sz  %util
vda    2.10  412.00   16.80  51488.00     0.81   181.44   74.82  99.60</div>
<div class="kv-grid">
  <div class="kv"><span class="k">%util gần 100</span><span class="v">Thiết bị bận gần như suốt thời gian. Trên SSD hay ổ đĩa qua mạng thì điều này không nặng nề như nghe có vẻ — chúng xử lý song song nhiều yêu cầu — nên hãy đọc nó CÙNG với <code>await</code>.</span></div>
  <div class="kv"><span class="k">w_await 181ms</span><span class="v">Đây mới là phát hiện thật. Một lần ghi mất 181 mili giây; một SSD khoẻ mạnh thì dưới 5. Hoặc thiết bị đã bão hoà, hoặc nhà cung cấp đang bóp bạn (hết tín dụng IOPS bùng nổ là nguyên nhân phổ biến trên ổ đĩa đám mây).</span></div>
  <div class="kv"><span class="k">aqu-sz 74</span><span class="v">Bảy mươi tư yêu cầu xếp hàng ở mọi thời điểm. Mỗi cái trong số đó là một tiến trình ở trạng thái D, và mỗi cái đều được tính vào load average.</span></div>
  <div class="kv"><span class="k">wkB/s 51488</span><span class="v">50MB/s ghi, liên tục. Hãy tìm kẻ đang ghi — một file log mất kiểm soát (Bài 10.1), một cơn bão checkpoint của cơ sở dữ liệu, một bản sao lưu chạy tiền cảnh, hay một lượt build.</span></div>
  <div class="kv"><span class="k">r/s bé tí, w/s khổng lồ</span><span class="v">Ghi áp đảo. Log và cơ sở dữ liệu. Nếu ngược lại là đọc áp đảo thì hãy nghi bộ đệm nguội sau một lần khởi động lại, hoặc một truy vấn đang quét toàn bảng.</span></div>
</div>
<pre><code><span class="tok-comment"># Ai đang ghi? Hai cách, cách thứ hai không cần cài thêm gói nào</span>
sudo iotop -bon2 -o | head
sudo find /proc -maxdepth 2 -name io 2&gt;/dev/null | while read f; do
  p=\$(dirname "\$f"); w=\$(awk '/^write_bytes/{print \$2}' "\$f" 2&gt;/dev/null)
  [ "\${w:-0}" -gt 1000000000 ] &amp;&amp; echo "\$(tr -d '\\0' &lt; \$p/cmdline | head -c60) \$((w/1024/1024))MB"
done | sort -k2 -rn | head -5</code></pre>
<div class="out">node /srv/app/dist/index.js 41288  62914MB
postgres: checkpointer  3401       8211MB</div>

<h3>Công thức 4 — sức ép bộ nhớ</h3>
<pre><code>free -h
vmstat 1 5                    <span class="tok-comment"># cột si/so = swap vào/ra</span>
ps aux --sort=-%mem | head -6
cat /sys/fs/cgroup/memory.pressure 2&gt;/dev/null
dmesg -T | grep -i 'out of memory' | tail -5</code></pre>
<div class="out">               total        used        free      shared  buff/cache   available
Mem:           7.8Gi       2.1Gi       197Mi       88Mi       5.5Gi       5.3Gi
Swap:          2.0Gi          0B       2.0Gi</div>
<div class="callout warn"><strong>Hãy đọc cột <code>available</code>, đừng bao giờ đọc <code>free</code>.</strong> 197Mi "free" trông đáng báo động và thật ra hoàn toàn khoẻ mạnh: Linux dùng RAM thừa làm bộ đệm trang, và 5,5Gi <code>buff/cache</code> kia được trả lại NGAY khoảnh khắc một tiến trình xin bộ nhớ. <code>available</code> — 5,3Gi ở đây — mới là con số trung thực. Một cái máy có <code>free</code> thấp và <code>available</code> cao là một cái máy đang dùng bộ nhớ ĐÚNG CÁCH, và "chúng tôi mua thêm RAM vì free thấp" là cách chữa cho một vấn đề không ai có.</div>
<pre><code><span class="tok-comment"># Sức ép THẬT thì trông như thế này — si/so khác 0, liên tục</span>
vmstat 1 5</code></pre>
<div class="out">procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 3  6 2010112  61204   1128  74112 4812 5104  9822 11044 4218 9911 12  9  6 73  0</div>
<p>4,8MB/s swap vào và 5,1MB/s swap ra, sáu tiến trình bị chặn, 73% chờ I/O. Cái máy này đang giãy giụa: nó dành thời gian chuyển bộ nhớ ra đĩa rồi lại vào thay vì làm việc. Thêm swap KHÔNG chữa được chuyện này — chính swap đã biến một cú OOM tức thì thành một cái chết chậm. Cách chữa là dùng ít bộ nhớ hơn hoặc mua thêm RAM.</p>
<pre><code><span class="tok-comment"># Tiến trình nào phình ra? RSS theo MB, lớn nhất trước</span>
ps -eo pid,rss,etimes,cmd --sort=-rss | head -6 | awk '{\$2=int(\$2/1024)"MB"; print}'</code></pre>
<div class="out">41288 1842MB 18774 node /srv/app/dist/index.js
3401 402MB 1042118 /usr/lib/postgresql/16/bin/postgres
812 21MB 1051862 nginx: master process</div>
<div class="callout"><strong>RSS tăng dần cộng với <code>etimes</code> dài là chữ ký của một chỗ rò rỉ.</strong> Hãy lấy mẫu ba lần cách nhau mười phút; chỗ rò thì leo đơn điệu còn mức dùng bình thường thì đi ngang. Khởi động lại mua cho bạn thời gian tỷ lệ với tốc độ nó leo — hữu ích trong lúc sự cố, vô dụng với tư cách một cách chữa, và đáng ghi vào cột việc-sau (Bài 12.1).</div>

<h3>Công thức 5 — đĩa đầy ngay giữa lúc sự cố</h3>
<p>Chương 10 đã nói kỹ chuyện này. Giữa lúc sự cố thì bạn cần ba câu lệnh tìm ra nguyên nhân nhanh nhất, theo đúng thứ tự này:</p>
<pre><code>df -h | grep -vE 'tmpfs|udev'; df -i | grep -vE 'tmpfs|udev'
sudo du -x --max-depth=1 / 2&gt;/dev/null | sort -rn | head -8      <span class="tok-comment"># -x: ở lại một hệ thống file</span>
sudo lsof -nP +L1 2&gt;/dev/null | awk '\$7&gt;1073741824' | head       <span class="tok-comment"># đã xoá mà vẫn mở</span></code></pre>
<div class="out">/dev/vda1  79G  79G  0  100% /
14680064  14012431  667633  96% /
41287632  /var
38911204  /var/log
38904112  /var/log/app
COMMAND  PID   USER FD TYPE DEVICE     SIZE/OFF NLINK NODE NAME
node    41288 deploy 9w REG  253,1  44023414784     0  918 /var/log/app/debug.log (deleted)</div>
<p>Có người đã <code>rm</code> cái log 41GB rồi mà chẳng giải phóng được gì, vì node vẫn đang giữ file đó mở (Bài 10.1). <code>lsof +L1</code> liệt kê đúng những cái đó: số liên kết bằng không, kích thước khổng lồ. Khởi động lại kẻ đang ghi là nhả ra ngay — và lần sau, hãy <code>truncate -s 0</code> thay vì <code>rm</code>.</p>
<div class="pitfall"><strong>Bẫy:</strong> "đĩa chưa đầy, nên không phải vấn đề về đĩa" — trong khi 96% inode đã dùng và <code>df -h</code> trông vẫn bình thường. Sau đó mọi lệnh ghi đều hỏng với <code>No space left on device</code> trong lúc còn hàng gigabyte trống, và thủ phạm thường gặp là hàng triệu file tí hon: một thư mục phiên, một bộ đệm, hay một hòm thư. <code>df -i</code> phải đứng cạnh <code>df -h</code> trong mọi cuộc quét, và đó là lý do nó có mặt trong cuộc quét ở Bài 12.1.</div>

<h3>Công thức 6 — chậm, mà chẳng có gì bận</h3>
<p>Trường hợp khó nhất và phổ biến nhất: request mất tám giây, CPU 4%, đĩa rảnh, bộ nhớ ổn. Không có gì bận bởi vì không có gì đang <em>LÀM VIỆC</em> — tất cả đều đang chờ một thứ khác.</p>
<pre><code><span class="tok-comment"># Chẻ một request ra thành các pha — đây chính là toàn bộ phần chẩn đoán</span>
curl -sS -o /dev/null -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}\\n' \\
  https://example.com/api/v1/posts</code></pre>
<div class="out">dns=0.004 connect=0.021 tls=0.061 ttfb=8.402 total=8.409</div>
<div class="kv-grid">
  <div class="kv"><span class="k">dns cao</span><span class="v">Vấn đề của trình phân giải. Hãy kiểm <code>/etc/resolv.conf</code> và bấm giờ một lượt tra bằng <code>dig</code> (Bài 9.1). Một máy chủ tên phụ đã chết cộng thêm đúng 5 giây hết-giờ vào MỌI THỨ.</span></div>
  <div class="kv"><span class="k">connect cao</span><span class="v">Mạng, hoặc hàng đợi nhận kết nối đã đầy. <code>ss -lnt</code> cho thấy <code>Recv-Q</code> so với <code>Send-Q</code> (độ dài hàng đợi); <code>Recv-Q</code> chạm trần nghĩa là các kết nối đang xếp hàng TRƯỚC KHI ứng dụng của bạn kịp thấy chúng.</span></div>
  <div class="kv"><span class="k">tls cao</span><span class="v">Chi phí bắt tay, hoặc OCSP stapling đang đi lấy dữ liệu từ một CA chậm. Hiếm, nhưng nó hiện ra dưới dạng một khoản phạt cố định trên mọi kết nối mới.</span></div>
  <div class="kv"><span class="k">ttfb cao, mọi thứ khác nhanh</span><span class="v">Ứng dụng đang NGHĨ — hoặc đang chờ một cơ sở dữ liệu, một bộ nhớ đệm, hay một API bên trên. Đây là trường hợp phổ biến, và nó nghĩa là cái máy vô can.</span></div>
  <div class="kv"><span class="k">total ≫ ttfb</span><span class="v">Thân phản hồi truyền chậm: gói dữ liệu khổng lồ, máy khách chậm, hoặc băng thông bị bóp. Hãy nhìn kích thước phản hồi trước khi đổ lỗi cho máy chủ.</span></div>
</div>
<pre><code><span class="tok-comment"># Ứng dụng đang chờ ở đâu? Hãy nhìn các kết nối của nó, đừng nhìn CPU</span>
ss -tanp state established | grep -c 5432          <span class="tok-comment"># số kết nối DB đang mở</span>
ss -tanp state established '( dport = :443 )' | head <span class="tok-comment"># lời gọi API ra ngoài đang bay</span>
ss -lnt | head -5                                   <span class="tok-comment"># hàng đợi nhận kết nối</span></code></pre>
<div class="out">$ ss -tanp state established | grep -c 5432
100
$ ss -lnt | head -3
State  Recv-Q Send-Q Local Address:Port
LISTEN 511    511          0.0.0.0:3000
LISTEN 0      511          0.0.0.0:80</div>
<p>Đúng 100 kết nối cơ sở dữ liệu — một con số tròn đáng ngờ, nghĩa là nó là trần của một bể kết nối đã cấu hình, không phải trùng hợp. Và <code>Recv-Q 511</code> bằng đúng <code>Send-Q 511</code> ở cổng 3000 nghĩa là hàng đợi nhận kết nối đã đầy hoàn toàn: kết nối mới đang xếp hàng trong nhân trong khi mọi worker đều chờ một kết nối cơ sở dữ liệu sẽ không bao giờ tới. Cái máy rảnh rỗi vì nó đang bế tắc ở một cái bể, và bao nhiêu CPU hay RAM cũng không giúp được.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Chẻ request ra</span><span class="lz-t">curl -w với các mốc thời gian</span><span class="lz-d">DNS, connect, TLS, TTFB, total. Một câu lệnh nói cho bạn biết tầng nào trong năm tầng đang giữ độ trễ.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Xác nhận cái máy vô can</span><span class="lz-t">load, %wa, bộ nhớ available, %util</span><span class="lz-d">Nếu cả bốn đều êm ả trong khi request chậm thì thôi đừng nhìn hệ điều hành nữa. Bạn đang gỡ lỗi việc CHỜ, không phải tài nguyên.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Nhìn xem nó đang chờ CÁI GÌ</span><span class="lz-t">ss -tanp state established</span><span class="lz-d">Đếm số kết nối theo từng cổng đích. Một con số tròn là trần của bể; một con số tăng dần là chỗ rò; con số 0 tới cơ sở dữ liệu thì tự nó đã là câu trả lời.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Kiểm cái hàng đợi phía trước</span><span class="lz-t">ss -lnt · số kết nối đang hoạt động của nginx</span><span class="lz-d">Hàng đợi nhận kết nối đầy nghĩa là triệu chứng nằm ở tầng SAU cái chỗ mà người dùng cảm nhận nó.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Bấm giờ thẳng cái thứ phụ thuộc</span><span class="lz-t">psql -c '\\timing' · curl thẳng cái API bên trên</span><span class="lz-d">Cắt ứng dụng của bạn ra khỏi vòng lặp. Nếu cơ sở dữ liệu trả lời trong 4 giây ngay từ shell thì cuộc điều tra đã chuyển chỗ và ứng dụng của bạn chưa từng là vấn đề.</span></div>
</div>

<a class="link-card" href="https://docs.kernel.org/accounting/psi.html" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">PSI — Pressure Stall Information</span><span class="lc-sub">Tài liệu nhân cho <code>/proc/pressure/*</code>. Nó trả lời "mất bao nhiêu thời gian để chờ CPU / IO / bộ nhớ", điều mà load average không làm được. Ít người dùng và có sẵn trên mọi nhân hiện đại.</span></span>
</a>
<a class="link-card" href="https://www.brendangregg.com/blog/2017-08-08/linux-load-averages.html" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">Load average của Linux: giải mã bí ẩn</span><span class="lc-sub">Vì sao Linux tính cả giấc ngủ không ngắt được vào load còn các dòng Unix khác thì không — kèm cả bản vá năm 1993 đã làm chuyện đó. Đây là bài viết khiến con số ấy cuối cùng cũng có nghĩa.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/iostat.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">💽</span>
  <span class="lc-body"><span class="lc-title">iostat(1) — giải thích từng cột</span><span class="lc-sub"><code>await</code>, <code>aqu-sz</code> và <code>%util</code> thật ra đo cái gì, và vì sao riêng <code>%util</code> thì gây hiểu nhầm trên SSD và trên ổ đĩa ảo hoá.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: bốn cái máy chậm</span><span class="lc-sub">Bài chấm điểm: phân tách nghẽn-CPU với nghẽn-I/O với trạng thái D chỉ bằng <code>vmstat</code>, đọc một bản chẻ pha của <code>curl -w</code> và gọi tên tầng có tội, và nhận ra cái bể kết nối đã cạn chỉ từ output của <code>ss</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> tối ưu cái bạn NHÌN THẤY thay vì cái đang chậm. Một CPU ở mức 60% trong một request tám giây không phải nguyên nhân — đó là thứ cái máy làm trong lúc chờ. Trước khi tinh chỉnh bất cứ thứ gì, hãy lấy bản chẻ pha từ <code>curl -w</code> và xác nhận tầng nào đang giữ thời gian. Phần lớn sự cố "máy chủ chậm" kết thúc ở một truy vấn cơ sở dữ liệu, một API bên trên, hoặc một bể kết nối, và mỗi giờ bỏ ra chỉnh tham số nhân trước là một giờ nguyên nhân thật vẫn đang chạy.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Load average không phải CPU — hãy đọc <code>/proc/pressure</code> hoặc cột <code>%wa</code> để biết cái máy đang TÍNH hay đang CHỜ. Hãy đọc <code>available</code>, đừng đọc <code>free</code>: bộ đệm trang không phải bộ nhớ bạn đã mất, và chữ ký thật của rắc rối bộ nhớ là <code>si</code>/<code>so</code> khác 0 liên tục trong <code>vmstat</code>. Và khi chẳng có gì bận mà mọi thứ đều chậm, hãy thôi nhìn tài nguyên và bắt đầu ĐẾM KẾT NỐI — câu trả lời gần như luôn là một thứ cái máy đang chờ, chứ không phải một thứ nó đang làm.</p>
</div>
`,
    },
    /* ─────────────────────────── 12.4 ─────────────────────────── */
    {
      title: '12.4 — Cookbook: it is weird|||12.4 — Sách công thức: nó lạ',
      slug: 'lnx-12-4-no-la',
      type: 'LESSON',
      description: 'Permission denied mà quyền vẫn đúng, command not found với file có thật, bản dựng cũ trả 404, chứng chỉ TLS và lệch đồng hồ, DNS chạy bằng IP mà không chạy bằng tên, và "máy tôi chạy được".',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4</span>
<h2>Cookbook: it is weird</h2>
<p class="lead">The failures in this lesson share one property: the obvious explanation is wrong. The permissions are correct and it still says denied. The file exists and the shell says not found. The code is deployed and the old behaviour persists. Six recipes for the bugs that make people distrust the machine.</p>

<h3>Recipe 1 — "Permission denied" with correct permissions</h3>
<pre><code>ls -l /srv/app/run.sh
namei -l /srv/app/run.sh          <span class="tok-comment"># EVERY component of the path, with modes</span>
findmnt -T /srv/app               <span class="tok-comment"># mount options for this path</span>
sudo dmesg -T | grep -iE 'apparmor|audit|denied' | tail -5</code></pre>
<div class="out">$ ls -l /srv/app/run.sh
-rwxr-xr-x 1 deploy deploy 412 Aug 22 14:05 /srv/app/run.sh
$ namei -l /srv/app/run.sh
f: /srv/app/run.sh
drwxr-xr-x root  root  /
drwxr-x--- root  root  srv
drwxr-xr-x deploy deploy app
-rwxr-xr-x deploy deploy run.sh</div>
<p>The file is world-executable and the failure is two levels up: <code>/srv</code> is <code>drwxr-x---</code> owned by <code>root:root</code>, so a user who is not root and not in group <code>root</code> cannot traverse into it (Lesson 4.1). <code>ls -l</code> on the file can never show you this; <code>namei -l</code> shows the whole chain at once and is the fastest permission tool on the machine.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">A parent directory lacks <code>x</code></span><span class="v">The classic. Every directory in the path needs the execute bit for the user to pass through it. <code>namei -l</code> finds it in one command.</span></div>
  <div class="kv"><span class="k">Mounted <code>noexec</code></span><span class="v"><code>findmnt -T</code> shows the options. Scripts under <code>/tmp</code> or <code>/home</code> on a hardened server frequently cannot be executed at all, regardless of mode bits.</span></div>
  <div class="kv"><span class="k">Mounted read-only</span><span class="v">A filesystem remounts read-only after an I/O error. Writes fail with <code>EROFS</code>, which many programs report as a permission problem. Check <code>dmesg -T</code> for the error that caused it.</span></div>
  <div class="kv"><span class="k">systemd sandboxing</span><span class="v"><code>ProtectSystem=strict</code>, <code>ProtectHome=</code>, <code>ReadWritePaths=</code> — the service sees a different filesystem than your shell does (Lesson 11.1). Exit code 226/NAMESPACE, or plain <code>EACCES</code> at runtime.</span></div>
  <div class="kv"><span class="k">AppArmor</span><span class="v">Ubuntu's default MAC layer. <code>dmesg</code> shows <code>apparmor="DENIED"</code> with the profile name. It applies to specific programs — <code>mysqld</code>, <code>nginx</code>, snaps — and is invisible to <code>ls</code>.</span></div>
  <div class="kv"><span class="k">Immutable attribute</span><span class="v"><code>lsattr file</code> showing <code>----i---------</code> means even root cannot modify it until <code>chattr -i</code>. Rare, memorable, and it makes people question reality for twenty minutes.</span></div>
</div>

<h3>Recipe 2 — "command not found" for a file that exists</h3>
<pre><code>ls -l ./deploy.sh &amp;&amp; ./deploy.sh
file ./deploy.sh
head -c 40 ./deploy.sh | cat -A | head -2       <span class="tok-comment"># -A shows \\r as ^M</span>
ldd \$(command -v node) | grep 'not found'</code></pre>
<div class="out">$ ./deploy.sh
bash: ./deploy.sh: cannot execute: required file not found
$ head -c 40 ./deploy.sh | cat -A | head -1
#!/bin/bash^M\$</div>
<p>The shebang line ends in <code>^M</code> — a carriage return, from a file edited on Windows or checked out with the wrong git line-ending setting. The kernel dutifully looks for an interpreter literally named <code>/bin/bash\\r</code>, does not find it, and reports "required file not found" while pointing at your script. The error names the script; the missing file is the interpreter.</p>
<pre><code>sed -i 's/\\r\$//' ./deploy.sh          <span class="tok-comment"># or: dos2unix ./deploy.sh</span>
file ./deploy.sh</code></pre>
<div class="out">./deploy.sh: Bourne-Again shell script, ASCII text executable</div>
<div class="kv-grid">
  <div class="kv"><span class="k">CRLF in the shebang</span><span class="v">"cannot execute: required file not found" on a file you can see. <code>cat -A</code> proves it in one line.</span></div>
  <div class="kv"><span class="k">Wrong architecture</span><span class="v"><code>file</code> says <code>ARM aarch64</code> on an x86 machine. Common with binaries built on an Apple Silicon laptop and copied to a VPS.</span></div>
  <div class="kv"><span class="k">Missing shared library</span><span class="v"><code>ldd</code> prints <code>=&gt; not found</code>. The binary exists and cannot start. Install the package, or you built against a libc the target does not have — the musl/glibc trap from this project's own deploy history.</span></div>
  <div class="kv"><span class="k">Not on PATH at all</span><span class="v">The boring answer, and still the most common. <code>command -v x</code>, then <code>echo "\$PATH" | tr ':' '\\n'</code> (Lesson 8.1). Remember that <code>sudo</code> and cron have different PATHs than you do.</span></div>
  <div class="kv"><span class="k">A stale shell hash</span><span class="v">You moved a binary and bash still remembers the old location. <code>hash -r</code> clears it. Symptom: the error names a path that no longer exists.</span></div>
</div>

<h3>Recipe 3 — the code is deployed and the old behaviour persists</h3>
<p>A route returns 404 after you added it; a fix does not appear; a bug you deleted still happens. In every case, the question is not "is the code right" but <strong>"is this process running the code I think it is?"</strong></p>
<pre><code><span class="tok-comment"># Is the route mounted at all? 401/200 = live, 404 = stale build</span>
curl -s -o /dev/null -w '%{http_code}\\n' https://example.com/api/v1/reports

<span class="tok-comment"># What is the running process actually executing?</span>
pgrep -af 'node|python' | head
sudo ls -l /proc/41288/cwd /proc/41288/exe
sudo stat -c '%y %n' /srv/app/dist/index.js
ps -o lstart= -p 41288                         <span class="tok-comment"># when did it start?</span></code></pre>
<div class="out">404
41288 node /srv/app/dist/index.js
lrwxrwxrwx 1 deploy deploy 0 Aug 22 19:52 /proc/41288/cwd -> /srv/releases/2026-08-19
2026-08-22 14:05:11.000000000 +0000 /srv/app/dist/index.js
Mon Aug 19 09:12:44 2026</div>
<p>Three facts and the mystery is over: the build on disk is from 22 August, the process started on 19 August, and its working directory is an old release directory. The deploy copied new files and nobody restarted the service. The code is correct and irrelevant.</p>
<div class="callout ok"><strong>Diagnose "is it live?" with an unauthenticated <code>curl</code>, never with the browser.</strong> <strong>401</strong> means the route is mounted and wants auth. <strong>200</strong> means mounted and public. <strong>404</strong> means the route does not exist in the running process — a stale or partial build. The browser adds caches, service workers and cookies to a question that has a one-word answer, and this project's own history includes a day lost to "the GIF picker is broken" that was a stale <code>dist/index.js</code> not mounting a route.</div>
<div class="pitfall"><strong>Pitfall:</strong> a static asset server that indexed its files at startup. Next.js decides what exists under <code>public/</code> when the <em>server process starts</em>; rebuild the assets while it runs and it returns 404 for files that are visibly on disk — no error, no log line, just a page that never finishes loading because its JavaScript never arrives. Anything under <code>public/</code> changing means restarting the server. And kill it by PORT (<code>lsof -ti:3000 | xargs -r kill -9</code>), because Node renames its own process to <code>next-server</code> and every <code>pkill -f</code> pattern you would naturally try silently matches nothing.</div>

<h3>Recipe 4 — TLS and the clock</h3>
<pre><code>curl -vI https://example.com 2&gt;&amp;1 | grep -E 'expire|subject|issuer|SSL'
echo | openssl s_client -connect example.com:443 -servername example.com 2&gt;/dev/null \\
  | openssl x509 -noout -dates -subject -issuer
timedatectl | head -4</code></pre>
<div class="out">notBefore=Aug  9 00:00:00 2026 GMT
notAfter=Nov  7 23:59:59 2026 GMT
subject=CN = example.com
issuer=C = US, O = Let's Encrypt, CN = R11</div>
<div class="kv-grid">
  <div class="kv"><span class="k">certificate has expired</span><span class="v">Check <code>notAfter</code> against the real date. Then check the renewal timer that should have prevented it: <code>systemctl list-timers | grep certbot</code> (Lesson 11.2). An expired certificate is nearly always a broken renewal job, not a certificate problem.</span></div>
  <div class="kv"><span class="k">certificate is not yet valid</span><span class="v">Almost never the certificate — it is the CLIENT's clock. A container or VM with a wrong date rejects perfectly good certificates. <code>timedatectl</code> on the machine doing the complaining.</span></div>
  <div class="kv"><span class="k">unable to get local issuer certificate</span><span class="v">The chain is incomplete: the server is serving the leaf without its intermediate. Browsers often paper over this by caching intermediates; <code>curl</code> and your backend do not, which is why "it works in Chrome" is not a test.</span></div>
  <div class="kv"><span class="k">hostname mismatch</span><span class="v">Compare <code>subject</code>/SAN with the name you requested. Usually the wrong vhost answered — pass <code>-servername</code> to <code>openssl s_client</code>, or you will test the default certificate instead of the one you meant.</span></div>
  <div class="kv"><span class="k">Works with curl, fails in the app</span><span class="v">Different trust store. Node has its own CA bundle; a container may have none installed at all (<code>ca-certificates</code>). The system trusting a certificate does not mean your runtime does.</span></div>
  <div class="kv"><span class="k">JWTs "expired" immediately</span><span class="v">Clock skew again. A machine minutes ahead issues tokens that another machine considers already dead. Fix NTP (Lesson 11.3), not the token lifetime.</span></div>
</div>
<pre><code><span class="tok-comment"># Days until expiry, as one number — worth putting in a monitor</span>
echo | openssl s_client -connect example.com:443 -servername example.com 2&gt;/dev/null \\
  | openssl x509 -noout -enddate | cut -d= -f2 \\
  | { read d; echo \$(( (\$(date -d "\$d" +%s) - \$(date +%s)) / 86400 )) days; }</code></pre>
<div class="out">77 days</div>

<h3>Recipe 5 — works by IP, not by name</h3>
<pre><code>dig +short api.example.com
dig +short api.example.com @1.1.1.1        <span class="tok-comment"># bypass the local resolver</span>
cat /etc/resolv.conf; cat /etc/hosts
getent hosts api.example.com               <span class="tok-comment"># what the SYSTEM resolves, not just DNS</span>
resolvectl status | head -20</code></pre>
<div class="out">$ dig +short api.example.com
10.0.0.9
$ dig +short api.example.com @1.1.1.1
203.0.113.44
$ getent hosts api.example.com
10.0.0.9        api.example.com</div>
<p>Two different answers for the same name. The local resolver returns a private address that a public resolver does not know about — either a deliberate split-horizon setup, a leftover <code>/etc/hosts</code> entry from someone's testing, or a VPN's DNS. <code>getent hosts</code> is the important one: it follows <code>/etc/nsswitch.conf</code> exactly as your application will, including <code>/etc/hosts</code>, which <code>dig</code> ignores entirely.</p>
<div class="callout"><strong><code>dig</code> and your app do not resolve names the same way.</strong> <code>dig</code> talks to a DNS server. Your application calls <code>getaddrinfo()</code>, which consults <code>/etc/hosts</code> first, then possibly mDNS, then DNS, in the order given by <code>/etc/nsswitch.conf</code>. When <code>dig</code> gives the right answer and the app still connects to the wrong place, the difference is a <code>hosts</code> entry — and <code>getent hosts</code> is the command that sees it.</div>

<h3>Recipe 6 — "but it works on my machine"</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Case sensitivity</span><span class="lz-lnote">macOS filesystems are case-INSENSITIVE by default; Linux is not. <code>import './Button'</code> resolving a file named <code>button.tsx</code> works locally and fails in the container. It is the single most common cause of "the build passed on my laptop".</span></div>
  <div class="lz-layer"><span class="lz-lname">Locale</span><span class="lz-lnote"><code>LANG</code> and <code>LC_ALL</code> change how <code>sort</code> orders, how <code>printf</code> formats decimals, and how some tools parse dates. Servers often run <code>C.UTF-8</code>; your terminal does not. Set <code>LC_ALL=C</code> in scripts that parse output (Lesson 8.3).</span></div>
  <div class="lz-layer"><span class="lz-lname">Timezone</span><span class="lz-lnote">Your machine is local time, the server is UTC. Every date-boundary bug, every "the report is empty" at the wrong hour, and every off-by-seven-hours cron (Lesson 11.2) starts here.</span></div>
  <div class="lz-layer"><span class="lz-lname">Environment variables</span><span class="lz-lnote">Your shell has fifty that the service does not — because systemd and cron read none of your startup files (Lesson 8.2). <code>systemctl show app -p Environment</code> shows what the service really gets.</span></div>
  <div class="lz-layer"><span class="lz-lname">Version drift</span><span class="lz-lnote">Node 22 locally, Node 18 in the image; a different OpenSSL; a different libc. <code>node -v</code>, <code>openssl version</code> and <code>ldd --version</code> in BOTH places, side by side.</span></div>
  <div class="lz-layer"><span class="lz-lname">Files git does not carry</span><span class="lz-lnote"><code>.env</code>, generated clients, symlinks, an <code>uploads/</code> directory that exists only on your disk. <code>git status --ignored</code> shows what your working copy has that a fresh clone would not.</span></div>
</div>
<pre><code><span class="tok-comment"># Run this on both machines and diff the output — twenty seconds, ends most arguments</span>
{ uname -srm; . /etc/os-release 2&gt;/dev/null &amp;&amp; echo "\$PRETTY_NAME"
  node -v 2&gt;/dev/null; npm -v 2&gt;/dev/null; openssl version
  echo "TZ=\$(timedatectl show -p Timezone --value 2&gt;/dev/null)"
  echo "LANG=\$LANG LC_ALL=\$LC_ALL"; locale charmap
  echo "case-sensitive: \$(touch /tmp/A_ 2&gt;/dev/null; [ -e /tmp/a_ ] &amp;&amp; echo NO || echo YES; rm -f /tmp/A_)"
} 2&gt;&amp;1</code></pre>
<div class="out">Linux 6.8.0-45-generic x86_64
Ubuntu 24.04.1 LTS
v22.11.0
10.9.0
OpenSSL 3.0.13 30 Jan 2024
TZ=Etc/UTC
LANG=C.UTF-8 LC_ALL=
UTF-8
case-sensitive: YES</div>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/namei.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">namei(1)</span><span class="lc-sub">Walks a path and prints the mode of every component, including symlinks. The right first command for any "permission denied" where the file's own mode looks fine.</span></span>
</a>
<a class="link-card" href="https://www.openssl.org/docs/man3.0/man1/openssl-s_client.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">openssl s_client</span><span class="lc-sub">The tool for looking at a live TLS connection: chain, dates, SNI, protocol version. <code>-servername</code> is the flag people forget, and forgetting it tests the wrong certificate.</span></span>
</a>
<a class="link-card" href="https://ubuntu.com/server/docs/how-to-use-apparmor" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">AppArmor on Ubuntu</span><span class="lc-sub">How profiles work, how to read a DENIED line from <code>dmesg</code>, and how to put one profile in complain mode while you investigate — without disabling the whole system.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: six impossible bugs</span><span class="lc-sub">Graded exercises: find the traversal bit with <code>namei</code>, diagnose a CRLF shebang from the error message alone, prove a running process is executing an old release, and explain why <code>dig</code> and the app disagree.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> concluding "the machine is broken" or "it must be a caching thing". Neither is ever the finding. Every recipe here is a mundane mechanism that is simply invisible from where you were looking — a mode bit two directories up, a carriage return, a process older than its own code, a clock. When a system seems to be behaving impossibly, one of your assumptions is false, and the fastest way forward is to verify the assumption you have not checked because it is "obviously" true.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>namei -l</code> before you argue about permissions — the answer is usually a parent directory, and <code>ls -l</code> on the file cannot show it. Before you debug behaviour, prove the process is running the code you think it is: <code>/proc/PID/cwd</code>, <code>/proc/PID/exe</code> and the start time answer that in three commands. And when something is impossible, the false assumption is the one you never tested — the clock, the line endings, the resolver, the case of a filename.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4</span>
<h2>Sách công thức: nó lạ</h2>
<p class="lead">Những cú hỏng trong bài này có chung một tính chất: lời giải thích hiển nhiên thì SAI. Quyền đúng cả rồi mà nó vẫn nói denied. File có thật mà shell bảo không tìm thấy. Mã đã deploy rồi mà hành vi cũ vẫn còn. Sáu công thức cho những con bọ khiến người ta mất lòng tin vào cái máy.</p>

<h3>Công thức 1 — "Permission denied" trong khi quyền vẫn đúng</h3>
<pre><code>ls -l /srv/app/run.sh
namei -l /srv/app/run.sh          <span class="tok-comment"># MỌI thành phần của đường dẫn, kèm quyền</span>
findmnt -T /srv/app               <span class="tok-comment"># tuỳ chọn gắn cho đường dẫn này</span>
sudo dmesg -T | grep -iE 'apparmor|audit|denied' | tail -5</code></pre>
<div class="out">$ ls -l /srv/app/run.sh
-rwxr-xr-x 1 deploy deploy 412 Aug 22 14:05 /srv/app/run.sh
$ namei -l /srv/app/run.sh
f: /srv/app/run.sh
drwxr-xr-x root  root  /
drwxr-x--- root  root  srv
drwxr-xr-x deploy deploy app
-rwxr-xr-x deploy deploy run.sh</div>
<p>Cái file thì ai cũng chạy được, còn chỗ hỏng nằm cao hơn hai tầng: <code>/srv</code> là <code>drwxr-x---</code> thuộc <code>root:root</code>, nên một người dùng không phải root và không thuộc nhóm <code>root</code> thì không đi xuyên vào được (Bài 4.1). <code>ls -l</code> lên cái file không bao giờ cho bạn thấy điều đó; <code>namei -l</code> bày ra cả chuỗi cùng một lúc và là công cụ kiểm quyền nhanh nhất trên máy.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Một thư mục cha thiếu bit <code>x</code></span><span class="v">Kinh điển. Mọi thư mục trên đường dẫn đều cần bit thực thi thì người dùng mới đi qua được. <code>namei -l</code> tìm ra nó bằng một câu lệnh.</span></div>
  <div class="kv"><span class="k">Gắn với <code>noexec</code></span><span class="v"><code>findmnt -T</code> cho thấy các tuỳ chọn. Script nằm dưới <code>/tmp</code> hay <code>/home</code> trên một máy chủ đã gia cố thường KHÔNG chạy được, bất kể bit quyền là gì.</span></div>
  <div class="kv"><span class="k">Gắn ở chế độ chỉ đọc</span><span class="v">Một hệ thống file tự gắn lại thành chỉ-đọc sau một lỗi I/O. Lệnh ghi hỏng với <code>EROFS</code>, và nhiều chương trình báo cái đó thành lỗi quyền. Hãy xem <code>dmesg -T</code> tìm lỗi đã gây ra nó.</span></div>
  <div class="kv"><span class="k">Hộp cát của systemd</span><span class="v"><code>ProtectSystem=strict</code>, <code>ProtectHome=</code>, <code>ReadWritePaths=</code> — dịch vụ nhìn thấy một hệ thống file KHÁC với cái shell của bạn nhìn thấy (Bài 11.1). Mã thoát 226/NAMESPACE, hoặc một cú <code>EACCES</code> thuần lúc chạy.</span></div>
  <div class="kv"><span class="k">AppArmor</span><span class="v">Tầng kiểm soát truy cập bắt buộc mặc định của Ubuntu. <code>dmesg</code> hiện <code>apparmor="DENIED"</code> kèm tên hồ sơ. Nó áp cho những chương trình cụ thể — <code>mysqld</code>, <code>nginx</code>, snap — và vô hình với <code>ls</code>.</span></div>
  <div class="kv"><span class="k">Thuộc tính bất biến</span><span class="v"><code>lsattr file</code> hiện <code>----i---------</code> nghĩa là ngay cả root cũng không sửa được cho tới khi <code>chattr -i</code>. Hiếm, dễ nhớ, và nó khiến người ta nghi ngờ thực tại trong hai mươi phút.</span></div>
</div>

<h3>Công thức 2 — "command not found" với một file CÓ THẬT</h3>
<pre><code>ls -l ./deploy.sh &amp;&amp; ./deploy.sh
file ./deploy.sh
head -c 40 ./deploy.sh | cat -A | head -2       <span class="tok-comment"># -A hiện \\r thành ^M</span>
ldd \$(command -v node) | grep 'not found'</code></pre>
<div class="out">$ ./deploy.sh
bash: ./deploy.sh: cannot execute: required file not found
$ head -c 40 ./deploy.sh | cat -A | head -1
#!/bin/bash^M\$</div>
<p>Dòng shebang kết thúc bằng <code>^M</code> — một ký tự xuống dòng kiểu Windows, từ một file soạn trên Windows hoặc lấy về với cấu hình xuống dòng sai của git. Nhân ngoan ngoãn đi tìm một trình thông dịch có tên đúng nghĩa đen là <code>/bin/bash\\r</code>, không thấy, rồi báo "required file not found" trong khi chỉ tay vào script của bạn. Thông báo gọi tên cái script; cái file thiếu là TRÌNH THÔNG DỊCH.</p>
<pre><code>sed -i 's/\\r\$//' ./deploy.sh          <span class="tok-comment"># hoặc: dos2unix ./deploy.sh</span>
file ./deploy.sh</code></pre>
<div class="out">./deploy.sh: Bourne-Again shell script, ASCII text executable</div>
<div class="kv-grid">
  <div class="kv"><span class="k">CRLF trong shebang</span><span class="v">"cannot execute: required file not found" trên một file bạn nhìn thấy rành rành. <code>cat -A</code> chứng minh nó trong một dòng.</span></div>
  <div class="kv"><span class="k">Sai kiến trúc</span><span class="v"><code>file</code> nói <code>ARM aarch64</code> trên một cái máy x86. Hay gặp với chương trình dựng trên laptop Apple Silicon rồi chép lên VPS.</span></div>
  <div class="kv"><span class="k">Thiếu thư viện chia sẻ</span><span class="v"><code>ldd</code> in ra <code>=&gt; not found</code>. File có thật mà không khởi động được. Hãy cài gói đó, hoặc bạn đã dựng dựa trên một libc mà máy đích không có — chính cái bẫy musl/glibc trong lịch sử deploy của dự án này.</span></div>
  <div class="kv"><span class="k">Đơn giản là không có trên PATH</span><span class="v">Câu trả lời buồn tẻ, và vẫn là phổ biến nhất. <code>command -v x</code>, rồi <code>echo "\$PATH" | tr ':' '\\n'</code> (Bài 8.1). Nhớ rằng <code>sudo</code> và cron có PATH KHÁC với bạn.</span></div>
  <div class="kv"><span class="k">Bộ nhớ băm cũ của shell</span><span class="v">Bạn dời một chương trình đi mà bash vẫn nhớ chỗ cũ. <code>hash -r</code> xoá nó đi. Triệu chứng: thông báo lỗi gọi tên một đường dẫn không còn tồn tại.</span></div>
</div>

<h3>Công thức 3 — mã đã deploy mà hành vi cũ vẫn còn</h3>
<p>Một route trả 404 sau khi bạn vừa thêm nó; một bản vá không hiện ra; một con bọ bạn đã xoá vẫn xảy ra. Trong mọi trường hợp, câu hỏi không phải "mã có đúng không" mà là <strong>"tiến trình này có đang chạy đúng cái mã tôi nghĩ không?"</strong></p>
<pre><code><span class="tok-comment"># Route đã được gắn chưa? 401/200 = còn sống, 404 = bản dựng cũ</span>
curl -s -o /dev/null -w '%{http_code}\\n' https://example.com/api/v1/reports

<span class="tok-comment"># Tiến trình đang chạy thật ra đang thực thi cái gì?</span>
pgrep -af 'node|python' | head
sudo ls -l /proc/41288/cwd /proc/41288/exe
sudo stat -c '%y %n' /srv/app/dist/index.js
ps -o lstart= -p 41288                         <span class="tok-comment"># nó khởi động lúc nào?</span></code></pre>
<div class="out">404
41288 node /srv/app/dist/index.js
lrwxrwxrwx 1 deploy deploy 0 Aug 22 19:52 /proc/41288/cwd -> /srv/releases/2026-08-19
2026-08-22 14:05:11.000000000 +0000 /srv/app/dist/index.js
Mon Aug 19 09:12:44 2026</div>
<p>Ba sự kiện và bí ẩn kết thúc: bản dựng trên đĩa là ngày 22 tháng 8, tiến trình khởi động ngày 19 tháng 8, và thư mục làm việc của nó là một thư mục phát hành cũ. Bản deploy đã chép file mới lên và không ai khởi động lại dịch vụ. Mã thì đúng và chẳng liên quan gì.</p>
<div class="callout ok"><strong>Hãy chẩn đoán "nó còn sống không?" bằng một lệnh <code>curl</code> không xác thực, đừng bao giờ bằng trình duyệt.</strong> <strong>401</strong> nghĩa là route đã được gắn và đòi xác thực. <strong>200</strong> nghĩa là đã gắn và công khai. <strong>404</strong> nghĩa là route KHÔNG tồn tại trong tiến trình đang chạy — một bản dựng cũ hoặc dở dang. Trình duyệt thêm bộ đệm, service worker và cookie vào một câu hỏi vốn chỉ có một từ để trả lời, và lịch sử của chính dự án này có một ngày mất trắng cho "cái chọn ảnh GIF hỏng rồi" mà thật ra là một <code>dist/index.js</code> cũ không gắn route.</div>
<div class="pitfall"><strong>Bẫy:</strong> một máy chủ tài nguyên tĩnh chốt danh sách file lúc khởi động. Next.js quyết định có những gì dưới <code>public/</code> ngay khi <em>TIẾN TRÌNH SERVER KHỞI ĐỘNG</em>; dựng lại tài nguyên trong lúc nó đang chạy thì nó trả 404 cho những file nằm sờ sờ trên đĩa — không lỗi, không dòng log nào, chỉ có một trang không bao giờ tải xong vì JavaScript của nó không bao giờ tới. Đổi bất cứ thứ gì dưới <code>public/</code> thì phải khởi động lại server. Và hãy diệt nó theo CỔNG (<code>lsof -ti:3000 | xargs -r kill -9</code>), bởi vì Node tự đổi tên tiến trình của nó thành <code>next-server</code> và mọi mẫu <code>pkill -f</code> bạn thử một cách tự nhiên đều khớp trúng con số không.</div>

<h3>Công thức 4 — TLS và cái đồng hồ</h3>
<pre><code>curl -vI https://example.com 2&gt;&amp;1 | grep -E 'expire|subject|issuer|SSL'
echo | openssl s_client -connect example.com:443 -servername example.com 2&gt;/dev/null \\
  | openssl x509 -noout -dates -subject -issuer
timedatectl | head -4</code></pre>
<div class="out">notBefore=Aug  9 00:00:00 2026 GMT
notAfter=Nov  7 23:59:59 2026 GMT
subject=CN = example.com
issuer=C = US, O = Let's Encrypt, CN = R11</div>
<div class="kv-grid">
  <div class="kv"><span class="k">certificate has expired</span><span class="v">Hãy đối chiếu <code>notAfter</code> với ngày thật. Rồi kiểm cái timer gia hạn lẽ ra đã phải ngăn chuyện đó: <code>systemctl list-timers | grep certbot</code> (Bài 11.2). Một chứng chỉ hết hạn gần như luôn là một công việc gia hạn hỏng, không phải một vấn đề về chứng chỉ.</span></div>
  <div class="kv"><span class="k">certificate is not yet valid</span><span class="v">Gần như không bao giờ là chứng chỉ — đó là ĐỒNG HỒ CỦA MÁY KHÁCH. Một container hay máy ảo sai ngày sẽ từ chối những chứng chỉ hoàn toàn tốt. Hãy chạy <code>timedatectl</code> trên cái máy đang phàn nàn.</span></div>
  <div class="kv"><span class="k">unable to get local issuer certificate</span><span class="v">Chuỗi chứng chỉ thiếu: máy chủ chỉ đưa lá cuối mà không kèm chứng chỉ trung gian. Trình duyệt hay che lấp chuyện này bằng cách lưu sẵn trung gian; <code>curl</code> và backend của bạn thì không, và đó là lý do "trên Chrome chạy được" không phải một phép kiểm.</span></div>
  <div class="kv"><span class="k">hostname mismatch</span><span class="v">Hãy so <code>subject</code>/SAN với cái tên bạn vừa yêu cầu. Thường là nhầm vhost trả lời — hãy truyền <code>-servername</code> cho <code>openssl s_client</code>, không thì bạn đang kiểm chứng chỉ mặc định chứ không phải cái bạn định kiểm.</span></div>
  <div class="kv"><span class="k">curl chạy được, ứng dụng thì không</span><span class="v">Kho tin cậy khác nhau. Node có bộ CA riêng của nó; một container có thể chẳng cài cái nào (<code>ca-certificates</code>). Hệ thống tin một chứng chỉ không có nghĩa là môi trường chạy của bạn cũng tin.</span></div>
  <div class="kv"><span class="k">JWT "hết hạn" ngay lập tức</span><span class="v">Lại là lệch đồng hồ. Một cái máy chạy nhanh vài phút phát ra token mà máy khác coi là đã chết. Hãy sửa NTP (Bài 11.3), đừng sửa thời hạn của token.</span></div>
</div>
<pre><code><span class="tok-comment"># Còn bao nhiêu ngày nữa hết hạn, dưới dạng một con số — đáng đưa vào hệ giám sát</span>
echo | openssl s_client -connect example.com:443 -servername example.com 2&gt;/dev/null \\
  | openssl x509 -noout -enddate | cut -d= -f2 \\
  | { read d; echo \$(( (\$(date -d "\$d" +%s) - \$(date +%s)) / 86400 )) ngày; }</code></pre>
<div class="out">77 ngày</div>

<h3>Công thức 5 — chạy bằng IP, không chạy bằng tên</h3>
<pre><code>dig +short api.example.com
dig +short api.example.com @1.1.1.1        <span class="tok-comment"># đi vòng qua trình phân giải cục bộ</span>
cat /etc/resolv.conf; cat /etc/hosts
getent hosts api.example.com               <span class="tok-comment"># thứ HỆ THỐNG phân giải ra, không chỉ DNS</span>
resolvectl status | head -20</code></pre>
<div class="out">$ dig +short api.example.com
10.0.0.9
$ dig +short api.example.com @1.1.1.1
203.0.113.44
$ getent hosts api.example.com
10.0.0.9        api.example.com</div>
<p>Hai câu trả lời khác nhau cho cùng một cái tên. Trình phân giải cục bộ trả về một địa chỉ riêng tư mà trình phân giải công cộng không biết tới — hoặc là một thiết lập split-horizon có chủ ý, hoặc một dòng <code>/etc/hosts</code> còn sót từ lúc ai đó thử nghiệm, hoặc DNS của một VPN. <code>getent hosts</code> mới là cái quan trọng: nó đi theo <code>/etc/nsswitch.conf</code> ĐÚNG như ứng dụng của bạn sẽ làm, gồm cả <code>/etc/hosts</code>, thứ mà <code>dig</code> hoàn toàn phớt lờ.</p>
<div class="callout"><strong><code>dig</code> và ứng dụng của bạn KHÔNG phân giải tên theo cùng một cách.</strong> <code>dig</code> nói chuyện với một máy chủ DNS. Ứng dụng của bạn gọi <code>getaddrinfo()</code>, hàm này tra <code>/etc/hosts</code> trước, rồi có thể tới mDNS, rồi mới tới DNS, theo đúng thứ tự ghi trong <code>/etc/nsswitch.conf</code>. Khi <code>dig</code> cho câu trả lời đúng mà ứng dụng vẫn nối tới nhầm chỗ, khác biệt nằm ở một dòng trong <code>hosts</code> — và <code>getent hosts</code> là câu lệnh nhìn thấy nó.</div>

<h3>Công thức 6 — "nhưng máy tôi chạy được mà"</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Phân biệt hoa thường</span><span class="lz-lnote">Hệ thống file của macOS mặc định KHÔNG phân biệt hoa thường; Linux thì có. <code>import './Button'</code> khớp trúng một file tên <code>button.tsx</code> thì chạy ngon ở máy bạn và hỏng trong container. Đây là nguyên nhân số một của "bản build qua được trên laptop tôi mà".</span></div>
  <div class="lz-layer"><span class="lz-lname">Bản địa (locale)</span><span class="lz-lnote"><code>LANG</code> và <code>LC_ALL</code> đổi cách <code>sort</code> sắp xếp, cách <code>printf</code> định dạng số thập phân, và cách vài công cụ đọc ngày tháng. Máy chủ thường chạy <code>C.UTF-8</code>; terminal của bạn thì không. Hãy đặt <code>LC_ALL=C</code> trong những script phải đọc output (Bài 8.3).</span></div>
  <div class="lz-layer"><span class="lz-lname">Múi giờ</span><span class="lz-lnote">Máy bạn là giờ địa phương, máy chủ là UTC. Mọi con bọ ở ranh giới ngày, mọi lần "báo cáo rỗng" vào sai giờ, và mọi cái cron lệch bảy tiếng (Bài 11.2) đều bắt đầu từ đây.</span></div>
  <div class="lz-layer"><span class="lz-lname">Biến môi trường</span><span class="lz-lnote">Shell của bạn có năm mươi biến mà dịch vụ thì không — vì systemd và cron chẳng đọc file khởi động nào của bạn (Bài 8.2). <code>systemctl show app -p Environment</code> cho thấy dịch vụ thật sự nhận được gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">Lệch phiên bản</span><span class="lz-lnote">Node 22 ở máy bạn, Node 18 trong ảnh; một OpenSSL khác; một libc khác. Hãy chạy <code>node -v</code>, <code>openssl version</code> và <code>ldd --version</code> ở CẢ HAI nơi, đặt cạnh nhau.</span></div>
  <div class="lz-layer"><span class="lz-lname">Những file git không mang theo</span><span class="lz-lnote"><code>.env</code>, client được sinh ra, liên kết mềm, một thư mục <code>uploads/</code> chỉ tồn tại trên đĩa của bạn. <code>git status --ignored</code> cho thấy bản làm việc của bạn có gì mà một bản clone mới thì không.</span></div>
</div>
<pre><code><span class="tok-comment"># Chạy cái này ở CẢ HAI máy rồi so output — hai mươi giây, kết thúc phần lớn cuộc tranh cãi</span>
{ uname -srm; . /etc/os-release 2&gt;/dev/null &amp;&amp; echo "\$PRETTY_NAME"
  node -v 2&gt;/dev/null; npm -v 2&gt;/dev/null; openssl version
  echo "TZ=\$(timedatectl show -p Timezone --value 2&gt;/dev/null)"
  echo "LANG=\$LANG LC_ALL=\$LC_ALL"; locale charmap
  echo "phan biet hoa thuong: \$(touch /tmp/A_ 2&gt;/dev/null; [ -e /tmp/a_ ] &amp;&amp; echo KHONG || echo CO; rm -f /tmp/A_)"
} 2&gt;&amp;1</code></pre>
<div class="out">Linux 6.8.0-45-generic x86_64
Ubuntu 24.04.1 LTS
v22.11.0
10.9.0
OpenSSL 3.0.13 30 Jan 2024
TZ=Etc/UTC
LANG=C.UTF-8 LC_ALL=
UTF-8
phan biet hoa thuong: CO</div>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/namei.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">namei(1)</span><span class="lc-sub">Đi dọc một đường dẫn và in quyền của từng thành phần, gồm cả liên kết mềm. Câu lệnh đầu tiên đúng đắn cho mọi cú "permission denied" mà quyền của chính cái file thì trông vẫn ổn.</span></span>
</a>
<a class="link-card" href="https://www.openssl.org/docs/man3.0/man1/openssl-s_client.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">openssl s_client</span><span class="lc-sub">Công cụ để soi một kết nối TLS đang sống: chuỗi chứng chỉ, ngày tháng, SNI, phiên bản giao thức. <code>-servername</code> là cái cờ người ta hay quên, và quên nó là kiểm nhầm chứng chỉ.</span></span>
</a>
<a class="link-card" href="https://ubuntu.com/server/docs/how-to-use-apparmor" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">AppArmor trên Ubuntu</span><span class="lc-sub">Hồ sơ hoạt động thế nào, đọc một dòng DENIED trong <code>dmesg</code> ra sao, và cách chuyển MỘT hồ sơ sang chế độ chỉ-ghi-nhận trong lúc bạn điều tra — mà không phải tắt cả hệ thống.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: sáu con bọ bất khả thi</span><span class="lc-sub">Bài chấm điểm: tìm ra bit đi-xuyên bằng <code>namei</code>, chẩn đoán một shebang dính CRLF chỉ từ thông báo lỗi, chứng minh một tiến trình đang chạy bản phát hành cũ, và giải thích vì sao <code>dig</code> với ứng dụng lại bất đồng.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> kết luận "cái máy hỏng rồi" hoặc "chắc tại bộ đệm gì đó". Không cái nào từng là một phát hiện cả. Mọi công thức ở đây đều là một cơ chế TẦM THƯỜNG, chỉ là nó vô hình từ cái chỗ bạn đang đứng nhìn — một bit quyền cách hai thư mục, một ký tự về đầu dòng, một tiến trình già hơn chính mã của nó, một cái đồng hồ. Khi một hệ thống có vẻ đang hành xử bất khả thi thì một giả định nào đó của bạn đang sai, và cách đi tiếp nhanh nhất là kiểm chính cái giả định bạn chưa kiểm vì nó "hiển nhiên" đúng.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Hãy <code>namei -l</code> trước khi tranh cãi về quyền — câu trả lời thường là một thư mục cha, và <code>ls -l</code> lên cái file không cho thấy được. Trước khi gỡ lỗi hành vi, hãy CHỨNG MINH tiến trình đang chạy đúng cái mã bạn nghĩ: <code>/proc/PID/cwd</code>, <code>/proc/PID/exe</code> và thời điểm khởi động trả lời chuyện đó bằng ba câu lệnh. Và khi một chuyện là bất khả thi thì giả định sai chính là cái bạn chưa bao giờ kiểm — cái đồng hồ, ký tự xuống dòng, trình phân giải tên, hay chữ hoa chữ thường của một cái tên file.</p>
</div>
`,
    },
    /* ─────────────────────────── 12.5 ─────────────────────────── */
    {
      title: '12.5 — What you can do now, and what to learn next|||12.5 — Giờ bạn làm được gì, và học tiếp cái gì',
      slug: 'lnx-12-5-tong-ket',
      type: 'LESSON',
      description: 'Tổng kết cả khoá theo bốn cung đường, một thẻ tra cứu các câu lệnh gánh phần lớn công việc, năm thói quen phân biệt người thạo terminal, và lộ trình học tiếp.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.5</span>
<h2>What you can do now, and what to learn next</h2>
<p class="lead">Sixty-something lessons ago this course opened with a claim: that a terminal is not a place where you memorise incantations, but a place where a small number of ideas compose into everything else. This lesson is the receipt. It is a map of what you covered, a reference card for the commands that carry most of the work, and an honest answer to "what now".</p>

<h3>The four arcs</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Arc 1 · Chapters 0–2 — Moving around</span><span class="lz-lnote">What a shell is, the filesystem as one tree, paths, and creating, copying, moving and deleting files without fear. The arc that turns the terminal from a black box into a place you can navigate.</span></div>
  <div class="lz-layer"><span class="lz-lname">Arc 2 · Chapters 3–6 — Composing</span><span class="lz-lnote">Streams, pipes and redirection; <code>grep</code>, <code>sed</code>, <code>awk</code>; permissions and users; processes and signals; variables, quoting and expansion. This is the arc where the shell stops being a file browser and becomes a language.</span></div>
  <div class="lz-layer"><span class="lz-lname">Arc 3 · Chapters 7–9 — Building and reaching out</span><span class="lz-lnote">Scripts that fail loudly instead of silently; <code>PATH</code> and startup files; networking, SSH, <code>curl</code>, <code>rsync</code> and firewalls. The arc that lets you automate work and operate machines you cannot touch.</span></div>
  <div class="lz-layer"><span class="lz-lname">Arc 4 · Chapters 10–12 — Running things for real</span><span class="lz-lnote">Disk, packages and logs; services, schedules and hardening; and a diagnostic method that works on a machine you have never seen. The arc that separates "I can use Linux" from "I can be responsible for a server".</span></div>
</div>
<p>If you can open a terminal on an unfamiliar server, find out what it runs, read why something failed, fix it, and leave behind a change that will still be correct after a reboot — that is the whole course, and it is a genuinely portable skill. Nothing here expires with a framework.</p>

<h3>The commands that carry the work</h3>
<p>There are thousands of commands on a Linux box. In practice a few dozen do almost everything. Keep this card; the rest you can look up.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Move and look</span><span class="v"><code>cd</code> · <code>ls -la</code> · <code>pwd</code> · <code>tree -L 2</code> · <code>less</code> · <code>tail -f</code> · <code>file</code> · <code>stat</code> · <code>realpath</code></span></div>
  <div class="kv"><span class="k">Find</span><span class="v"><code>find . -name … -mtime …</code> · <code>grep -rn</code> · <code>which</code> / <code>command -v</code> · <code>locate</code> · <code>namei -l</code></span></div>
  <div class="kv"><span class="k">Change files</span><span class="v"><code>cp -a</code> · <code>mv</code> · <code>rm -i</code> · <code>mkdir -p</code> · <code>ln -s</code> · <code>tar czf</code> / <code>tar xzf</code> · <code>install -d -m</code></span></div>
  <div class="kv"><span class="k">Text</span><span class="v"><code>cat</code> · <code>head</code>/<code>tail</code> · <code>sort</code> · <code>uniq -c</code> · <code>cut</code> · <code>tr</code> · <code>wc -l</code> · <code>sed -i</code> · <code>awk '{print \$2}'</code> · <code>jq</code></span></div>
  <div class="kv"><span class="k">Permissions</span><span class="v"><code>chmod</code> · <code>chown</code> · <code>umask</code> · <code>sudo -u</code> · <code>id</code> · <code>groups</code> · <code>visudo</code></span></div>
  <div class="kv"><span class="k">Processes</span><span class="v"><code>ps aux --sort=-%cpu</code> · <code>top</code>/<code>htop</code> · <code>pgrep -af</code> · <code>kill</code> · <code>jobs</code>/<code>bg</code>/<code>fg</code> · <code>nohup</code> · <code>timeout</code></span></div>
  <div class="kv"><span class="k">Resources</span><span class="v"><code>df -h</code> · <code>df -i</code> · <code>du -xh --max-depth=1</code> · <code>free -h</code> · <code>vmstat 1</code> · <code>iostat -xz 1</code> · <code>uptime</code></span></div>
  <div class="kv"><span class="k">Network</span><span class="v"><code>ss -tlnp</code> · <code>curl -sS -w</code> · <code>dig +short</code> · <code>getent hosts</code> · <code>nc -vz</code> · <code>ssh</code> · <code>scp</code> · <code>rsync -avz</code> · <code>ufw</code></span></div>
  <div class="kv"><span class="k">Services and logs</span><span class="v"><code>systemctl status/cat/show</code> · <code>journalctl -u -p -b --since</code> · <code>systemctl --failed</code> · <code>systemd-analyze calendar</code></span></div>
  <div class="kv"><span class="k">Scripting</span><span class="v"><code>set -Eeuo pipefail</code> · <code>trap</code> · <code>mktemp</code> · <code>flock</code> · <code>\${var:?}</code> · <code>case</code> · <code>while read -r</code> · <code>shellcheck</code></span></div>
</div>
<div class="callout ok"><strong>You are not expected to remember flags.</strong> You are expected to remember that the capability exists — that <code>df</code> has an inode mode, that <code>curl</code> can print timings, that <code>ss</code> can filter by state. Knowing a thing is possible is the hard part; <code>man</code>, <code>--help</code> and <code>tldr</code> supply the rest in five seconds. Every experienced person you have watched work fast is doing exactly this.</div>

<h3>Five habits worth more than any command</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Look before you change</span><span class="lz-t">ls before rm · --dry-run before rsync · print before delete</span><span class="lz-d">Every destructive command has a rehearsal mode. Using it costs two seconds and has saved more data than every backup system ever written.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Make failure loud</span><span class="lz-t">set -Eeuo pipefail · exit codes · check the return value</span><span class="lz-d">The default in shell is to carry on after an error. Almost every scripting disaster in Chapter 7 is a script that kept going after step three failed.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Prefer the boring, verifiable answer</span><span class="lz-t">sshd -T over reading the config · curl over the browser · systemctl cat over the file</span><span class="lz-d">Ask the system what it actually resolved, not what you believe you configured. Files lie by omission; resolved state does not.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Leave it better documented than you found it</span><span class="lz-t">a comment in the unit · a line in the README · a follow-up note</span><span class="lz-d">The next person to debug this is you, in eight months, with no memory of any of it.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Never close the working session</span><span class="lz-t">the second terminal, before a risky change</span><span class="lz-d">Firewall rules, sshd config, permission changes on a home directory. Ten seconds of preparation is the difference between an oops and a rebuild.</span></div>
</div>

<h3>Where to go next</h3>
<p>Three directions, depending on what you want to be able to do. None of them require finishing the others first.</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Run things</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Containers, proxies, deployment</span><span class="lz-nsub">Docker gives you reproducible environments; nginx or Caddy puts them behind TLS; a CI pipeline builds and ships them. Everything in Chapter 11 and 12 applies unchanged — a container is a process with a restricted view.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Store things</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Databases, backups, migrations</span><span class="lz-nsub">PostgreSQL is the default answer and worth learning deeply. The operational half — backups you have restored, migrations that roll forward, connection pools that do not deadlock — is where Chapter 12's Recipe 6 comes back.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">See things</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Monitoring and observability</span><span class="lz-nsub">Prometheus, Grafana, structured logs, alerts that fire before users notice. Every "why did nothing tell us?" in this chapter is answered here, and it is the highest-leverage thing to learn after this course.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Go deeper in the shell</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bash mastery, then when to stop</span><span class="lz-nsub">Arrays, associative arrays, coprocesses, <code>shellcheck</code> as a habit. And the judgement to move to Python when a script passes about two hundred lines — knowing the boundary is part of knowing the tool.</span></div></div>
  </div>
</div>
<a class="link-card codelab" href="/courses/nodejs/learn" target="_blank" rel="noopener">
  <span class="lc-ico">🟩</span>
  <span class="lc-body"><span class="lc-title">Node.js — the full course on this site</span><span class="lc-sub">The application layer that sits on top of everything you just learned: processes, streams, event loop, HTTP, deployment. Chapter 11's service units run exactly this.</span></span>
</a>
<a class="link-card codelab" href="/courses/postgresql/learn" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">PostgreSQL — the full course on this site</span><span class="lc-sub">Schema design, indexes, transactions, and the operational side: backups, <code>EXPLAIN</code>, connection limits. The natural companion to this course.</span></span>
</a>
<a class="link-card codelab" href="/courses/git/learn" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">Git & GitHub — the full course on this site</span><span class="lc-sub">If Chapter 12's "what changed at 14:07" made you wish for better history, this is that skill: branches, rebases, bisect, and reading a repository like a log.</span></span>
</a>
<a class="link-card" href="https://linuxjourney.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Linux Journey</span><span class="lc-sub">Free, short, well-sequenced lessons that overlap this course and go further into kernel internals, networking and filesystems. A good second pass on anything that stayed fuzzy.</span></span>
</a>
<a class="link-card" href="https://overthewire.org/wargames/bandit/" target="_blank" rel="noopener">
  <span class="lc-ico">🎮</span>
  <span class="lc-body"><span class="lc-title">OverTheWire — Bandit</span><span class="lc-sub">Thirty-odd levels solved entirely over SSH, each one a small puzzle in finding and reading files. The single best way to make Chapters 1–3 automatic rather than remembered.</span></span>
</a>
<a class="link-card" href="https://explainshell.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">explainshell.com</span><span class="lc-sub">Paste any command line and it annotates every flag with the relevant man-page fragment. The fastest way to understand a command you found in someone else's script instead of pasting it blind.</span></span>
</a>
<a class="link-card" href="https://www.shellcheck.net/" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">ShellCheck</span><span class="lc-sub">Static analysis for shell scripts, in the browser or as <code>apt install shellcheck</code>. It catches unquoted variables, useless <code>cat</code>s and the pipeline exit-code traps from Chapter 7 — automatically, every time.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: the whole course, one lab at a time</span><span class="lc-sub">Every chapter's graded exercises in one place. If you skipped them while reading, this is the version of the course that actually sticks — reading about <code>awk</code> and using <code>awk</code> are different skills.</span></span>
</a>

<h3>How to keep it</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Own a server</span><span class="v">The cheapest VPS you can find, for the price of a coffee a month. Break it, harden it, rebuild it. Nothing in this course becomes real until something you care about is running on a machine you are responsible for.</span></div>
  <div class="kv"><span class="k">Do the boring thing with a script</span><span class="v">Every task you do twice by hand is a script. It does not need to be good — it needs to exist, with <code>set -Eeuo pipefail</code> at the top. Ten small scripts teach more than one large one.</span></div>
  <div class="kv"><span class="k">Read your own logs</span><span class="v">Once a week, <code>journalctl -p warning --since '7 days ago'</code> on something you run. You will find things nobody reported, and you will learn what normal looks like — which is the only way to recognise abnormal.</span></div>
  <div class="kv"><span class="k">Keep a snippets file</span><span class="v">One plain-text file of commands that took you more than five minutes to work out. It beats searching the internet again, and re-reading it occasionally is genuine revision.</span></div>
  <div class="kv"><span class="k">Teach one thing</span><span class="v">Explain pipes, or permissions, or why <code>rm</code> on an open log frees nothing, to somebody who does not know. The gaps show up instantly, and they are always the parts you thought you understood.</span></div>
</div>

<div class="pitfall"><strong>Pitfall:</strong> treating "I finished the course" as the finish line. The skill decays if it is never used, and it consolidates fast if it is: two weeks of running something real will fix more of what stayed fuzzy than re-reading any chapter. The failure mode is not forgetting commands — commands are searchable. It is losing the confidence to open a terminal on an unfamiliar machine and start looking, and that only comes back by doing it.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Composition is the whole idea: small tools, one job each, joined by pipes — that is why sixty lessons fit in a few dozen commands. Verified state beats configuration you believe in, whether that is <code>sshd -T</code>, <code>systemctl cat</code> or an unauthenticated <code>curl</code>. And the most valuable habit in this entire course costs two seconds: look before you change, and keep the second terminal open.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.5</span>
<h2>Giờ bạn làm được gì, và học tiếp cái gì</h2>
<p class="lead">Hơn sáu mươi bài trước, khoá học này mở đầu bằng một lời khẳng định: terminal không phải chỗ để thuộc lòng những câu thần chú, mà là nơi một số ít ý tưởng ghép lại thành mọi thứ còn lại. Bài này là cái biên nhận. Nó là bản đồ những gì bạn đã đi qua, một thẻ tra cứu các câu lệnh gánh phần lớn công việc, và một câu trả lời thành thật cho "giờ thì sao".</p>

<h3>Bốn cung đường</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Cung 1 · Chương 0–2 — Đi lại được</span><span class="lz-lnote">Shell là gì, hệ thống file như MỘT cái cây, đường dẫn, và tạo/chép/dời/xoá file mà không sợ. Cung đường biến terminal từ một cái hộp đen thành một nơi bạn đi lại được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cung 2 · Chương 3–6 — Ghép nối</span><span class="lz-lnote">Luồng, ống dẫn và chuyển hướng; <code>grep</code>, <code>sed</code>, <code>awk</code>; quyền hạn và người dùng; tiến trình và tín hiệu; biến, dấu nháy và khai triển. Đây là cung đường mà shell thôi làm một trình duyệt file và trở thành một NGÔN NGỮ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cung 3 · Chương 7–9 — Dựng và vươn ra</span><span class="lz-lnote">Script hỏng thì kêu to chứ không hỏng trong im lặng; <code>PATH</code> và file khởi động; mạng, SSH, <code>curl</code>, <code>rsync</code> và tường lửa. Cung đường cho phép bạn tự động hoá công việc và vận hành những cái máy bạn không chạm tay vào được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cung 4 · Chương 10–12 — Chạy thật</span><span class="lz-lnote">Đĩa, gói phần mềm và log; dịch vụ, lịch chạy và gia cố; và một phương pháp chẩn đoán dùng được trên cái máy bạn chưa từng thấy. Cung đường tách "tôi biết dùng Linux" khỏi "tôi chịu trách nhiệm được cho một máy chủ".</span></div>
</div>
<p>Nếu bạn mở được một terminal trên một máy chủ lạ, tìm ra nó chạy những gì, đọc được vì sao có thứ hỏng, sửa nó, và để lại một thay đổi vẫn còn đúng sau khi máy khởi động lại — thì đó là toàn bộ khoá học, và đó là một kỹ năng MANG ĐI ĐƯỢC thật sự. Không có gì ở đây hết hạn cùng một framework.</p>

<h3>Những câu lệnh gánh phần lớn công việc</h3>
<p>Một máy Linux có hàng nghìn câu lệnh. Trên thực tế vài chục cái làm gần như mọi thứ. Hãy giữ cái thẻ này; phần còn lại tra cứu được.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Đi lại và nhìn</span><span class="v"><code>cd</code> · <code>ls -la</code> · <code>pwd</code> · <code>tree -L 2</code> · <code>less</code> · <code>tail -f</code> · <code>file</code> · <code>stat</code> · <code>realpath</code></span></div>
  <div class="kv"><span class="k">Tìm</span><span class="v"><code>find . -name … -mtime …</code> · <code>grep -rn</code> · <code>which</code> / <code>command -v</code> · <code>locate</code> · <code>namei -l</code></span></div>
  <div class="kv"><span class="k">Đổi file</span><span class="v"><code>cp -a</code> · <code>mv</code> · <code>rm -i</code> · <code>mkdir -p</code> · <code>ln -s</code> · <code>tar czf</code> / <code>tar xzf</code> · <code>install -d -m</code></span></div>
  <div class="kv"><span class="k">Văn bản</span><span class="v"><code>cat</code> · <code>head</code>/<code>tail</code> · <code>sort</code> · <code>uniq -c</code> · <code>cut</code> · <code>tr</code> · <code>wc -l</code> · <code>sed -i</code> · <code>awk '{print \$2}'</code> · <code>jq</code></span></div>
  <div class="kv"><span class="k">Quyền hạn</span><span class="v"><code>chmod</code> · <code>chown</code> · <code>umask</code> · <code>sudo -u</code> · <code>id</code> · <code>groups</code> · <code>visudo</code></span></div>
  <div class="kv"><span class="k">Tiến trình</span><span class="v"><code>ps aux --sort=-%cpu</code> · <code>top</code>/<code>htop</code> · <code>pgrep -af</code> · <code>kill</code> · <code>jobs</code>/<code>bg</code>/<code>fg</code> · <code>nohup</code> · <code>timeout</code></span></div>
  <div class="kv"><span class="k">Tài nguyên</span><span class="v"><code>df -h</code> · <code>df -i</code> · <code>du -xh --max-depth=1</code> · <code>free -h</code> · <code>vmstat 1</code> · <code>iostat -xz 1</code> · <code>uptime</code></span></div>
  <div class="kv"><span class="k">Mạng</span><span class="v"><code>ss -tlnp</code> · <code>curl -sS -w</code> · <code>dig +short</code> · <code>getent hosts</code> · <code>nc -vz</code> · <code>ssh</code> · <code>scp</code> · <code>rsync -avz</code> · <code>ufw</code></span></div>
  <div class="kv"><span class="k">Dịch vụ và log</span><span class="v"><code>systemctl status/cat/show</code> · <code>journalctl -u -p -b --since</code> · <code>systemctl --failed</code> · <code>systemd-analyze calendar</code></span></div>
  <div class="kv"><span class="k">Viết script</span><span class="v"><code>set -Eeuo pipefail</code> · <code>trap</code> · <code>mktemp</code> · <code>flock</code> · <code>\${var:?}</code> · <code>case</code> · <code>while read -r</code> · <code>shellcheck</code></span></div>
</div>
<div class="callout ok"><strong>Không ai đòi bạn thuộc lòng mấy cái cờ.</strong> Thứ bạn cần nhớ là KHẢ NĂNG ĐÓ CÓ TỒN TẠI — rằng <code>df</code> có chế độ đếm inode, rằng <code>curl</code> in được các mốc thời gian, rằng <code>ss</code> lọc được theo trạng thái. Biết một chuyện là làm được mới là phần khó; <code>man</code>, <code>--help</code> và <code>tldr</code> lo nốt phần còn lại trong năm giây. Mọi người có kinh nghiệm mà bạn từng thấy làm việc nhanh đều đang làm đúng như vậy.</div>

<h3>Năm thói quen đáng giá hơn mọi câu lệnh</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Nhìn trước khi đổi</span><span class="lz-t">ls trước rm · --dry-run trước rsync · in ra trước khi xoá</span><span class="lz-d">Mọi câu lệnh có tính phá huỷ đều có một chế độ diễn thử. Dùng nó tốn hai giây và đã cứu được nhiều dữ liệu hơn mọi hệ thống sao lưu từng được viết ra.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Cho cái hỏng kêu to</span><span class="lz-t">set -Eeuo pipefail · mã thoát · kiểm giá trị trả về</span><span class="lz-d">Mặc định của shell là ĐI TIẾP sau khi có lỗi. Gần như mọi thảm hoạ script trong Chương 7 đều là một script cứ chạy tiếp sau khi bước ba đã hỏng.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Ưu tiên câu trả lời buồn tẻ nhưng KIỂM ĐƯỢC</span><span class="lz-t">sshd -T thay vì đọc file cấu hình · curl thay vì trình duyệt · systemctl cat thay vì cái file</span><span class="lz-d">Hãy hỏi hệ thống nó thật sự hiểu thành gì, đừng hỏi thứ bạn tin là mình đã cấu hình. File nói dối bằng cách bỏ sót; trạng thái đã được giải quyết thì không.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Để lại chỗ đó có tài liệu hơn lúc bạn tới</span><span class="lz-t">một dòng chú thích trong unit · một dòng trong README · một ghi chú việc-sau</span><span class="lz-d">Người tiếp theo gỡ lỗi chỗ này là BẠN, tám tháng nữa, không nhớ nổi một chút gì.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Đừng bao giờ đóng cái phiên đang chạy được</span><span class="lz-t">cái terminal thứ hai, trước một thay đổi rủi ro</span><span class="lz-d">Luật tường lửa, cấu hình sshd, đổi quyền trên một thư mục nhà. Mười giây chuẩn bị là khác biệt giữa một tiếng "ối" và một lần dựng lại từ đầu.</span></div>
</div>

<h3>Đi tiếp hướng nào</h3>
<p>Ba hướng, tuỳ vào việc bạn muốn làm được gì. Không hướng nào bắt bạn học xong hướng kia trước.</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Chạy các thứ</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Container, proxy, triển khai</span><span class="lz-nsub">Docker cho bạn môi trường tái lập được; nginx hay Caddy đặt chúng sau TLS; một quy trình CI dựng và đưa chúng đi. Mọi thứ trong Chương 11 và 12 áp dụng nguyên vẹn — một container là một tiến trình với tầm nhìn bị hạn chế.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Lưu các thứ</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Cơ sở dữ liệu, sao lưu, migration</span><span class="lz-nsub">PostgreSQL là câu trả lời mặc định và đáng học sâu. Nửa vận hành của nó — những bản sao lưu bạn ĐÃ phục hồi, những migration tiến tới được, những bể kết nối không bế tắc — chính là chỗ Công thức 6 của Chương 12 quay lại.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Nhìn thấy các thứ</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Giám sát và khả quan sát</span><span class="lz-nsub">Prometheus, Grafana, log có cấu trúc, cảnh báo nổ trước khi người dùng nhận ra. Mọi câu "tại sao không có gì báo cho chúng ta?" trong chương này được trả lời ở đây, và đó là thứ đáng học nhất ngay sau khoá này.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Đi sâu hơn vào shell</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Thạo Bash, rồi biết khi nào dừng</span><span class="lz-nsub">Mảng, mảng liên kết, coprocess, <code>shellcheck</code> thành thói quen. Và cái phán đoán để chuyển sang Python khi một script vượt khoảng hai trăm dòng — biết cái ranh giới đó cũng là một phần của việc biết dùng công cụ.</span></div></div>
  </div>
</div>
<a class="link-card codelab" href="/courses/nodejs/learn" target="_blank" rel="noopener">
  <span class="lc-ico">🟩</span>
  <span class="lc-body"><span class="lc-title">Node.js — khoá đầy đủ trên trang này</span><span class="lc-sub">Tầng ứng dụng nằm trên mọi thứ bạn vừa học: tiến trình, luồng, vòng lặp sự kiện, HTTP, triển khai. Những unit dịch vụ ở Chương 11 chạy chính xác cái này.</span></span>
</a>
<a class="link-card codelab" href="/courses/postgresql/learn" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">PostgreSQL — khoá đầy đủ trên trang này</span><span class="lc-sub">Thiết kế lược đồ, chỉ mục, giao dịch, và mặt vận hành: sao lưu, <code>EXPLAIN</code>, giới hạn kết nối. Người bạn đồng hành tự nhiên của khoá này.</span></span>
</a>
<a class="link-card codelab" href="/courses/git/learn" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">Git & GitHub — khoá đầy đủ trên trang này</span><span class="lc-sub">Nếu câu "cái gì đã đổi lúc 14:07" ở Chương 12 khiến bạn ước gì lịch sử tốt hơn thì đây chính là kỹ năng đó: nhánh, rebase, bisect, và đọc một kho mã như đọc một cuốn nhật ký.</span></span>
</a>
<a class="link-card" href="https://linuxjourney.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Linux Journey</span><span class="lc-sub">Miễn phí, ngắn, sắp xếp mạch lạc, chồng lấn với khoá này và đi xa hơn vào ruột nhân, mạng và hệ thống file. Một lượt đọc thứ hai tốt cho bất cứ chỗ nào còn mờ.</span></span>
</a>
<a class="link-card" href="https://overthewire.org/wargames/bandit/" target="_blank" rel="noopener">
  <span class="lc-ico">🎮</span>
  <span class="lc-body"><span class="lc-title">OverTheWire — Bandit</span><span class="lc-sub">Hơn ba mươi màn giải HOÀN TOÀN qua SSH, mỗi màn là một câu đố nhỏ về việc tìm và đọc file. Cách tốt nhất để biến Chương 1–3 thành phản xạ thay vì thành trí nhớ.</span></span>
</a>
<a class="link-card" href="https://explainshell.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">explainshell.com</span><span class="lc-sub">Dán một dòng lệnh bất kỳ vào và nó chú giải từng cái cờ bằng đúng mẩu man tương ứng. Cách nhanh nhất để HIỂU một câu lệnh bạn nhặt trong script của người khác thay vì dán nó vào một cách mù quáng.</span></span>
</a>
<a class="link-card" href="https://www.shellcheck.net/" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">ShellCheck</span><span class="lc-sub">Phân tích tĩnh cho script shell, chạy trên trình duyệt hoặc <code>apt install shellcheck</code>. Nó bắt biến không bọc nháy, những cú <code>cat</code> vô ích và các bẫy mã thoát của ống dẫn ở Chương 7 — tự động, lần nào cũng vậy.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: cả khoá học, từng phòng lab một</span><span class="lc-sub">Toàn bộ bài chấm điểm của mọi chương gom về một chỗ. Nếu bạn bỏ qua chúng trong lúc đọc thì đây mới là phiên bản khoá học ĐỌNG LẠI — đọc về <code>awk</code> và DÙNG <code>awk</code> là hai kỹ năng khác nhau.</span></span>
</a>

<h3>Làm sao để giữ được</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Sở hữu một máy chủ</span><span class="v">Cái VPS rẻ nhất bạn tìm được, giá bằng một ly cà phê mỗi tháng. Phá nó, gia cố nó, dựng lại nó. Không có gì trong khoá này trở thành THẬT cho tới khi có một thứ bạn quan tâm đang chạy trên một cái máy bạn chịu trách nhiệm.</span></div>
  <div class="kv"><span class="k">Làm cái việc buồn tẻ bằng một script</span><span class="v">Mọi việc bạn làm tay tới lần thứ hai đều là một script. Nó không cần hay — nó cần TỒN TẠI, với <code>set -Eeuo pipefail</code> ở đầu. Mười script nhỏ dạy nhiều hơn một script lớn.</span></div>
  <div class="kv"><span class="k">Đọc log của chính mình</span><span class="v">Mỗi tuần một lần, <code>journalctl -p warning --since '7 days ago'</code> trên một thứ bạn đang chạy. Bạn sẽ thấy những chuyện chẳng ai báo, và bạn sẽ học được thế nào là BÌNH THƯỜNG — cách duy nhất để nhận ra thứ bất thường.</span></div>
  <div class="kv"><span class="k">Giữ một file mẩu lệnh</span><span class="v">Một file văn bản thuần chứa những câu lệnh khiến bạn mất hơn năm phút để nghĩ ra. Nó hơn việc đi tìm lại trên internet, và đọc lại nó thi thoảng chính là ôn tập thật sự.</span></div>
  <div class="kv"><span class="k">Dạy một thứ</span><span class="v">Hãy giải thích ống dẫn, hoặc quyền hạn, hoặc vì sao <code>rm</code> lên một file log đang mở chẳng giải phóng được gì, cho một người chưa biết. Những chỗ hổng lộ ra ngay lập tức, và chúng luôn là những phần bạn tưởng mình đã hiểu.</span></div>
</div>

<div class="pitfall"><strong>Bẫy:</strong> coi "tôi học xong khoá rồi" là vạch đích. Kỹ năng này rơi rụng nếu không dùng, và nó đóng rắn rất nhanh nếu có dùng: hai tuần vận hành một thứ có thật sẽ chữa được nhiều chỗ còn mờ hơn là đọc lại bất cứ chương nào. Kiểu hỏng ở đây không phải quên câu lệnh — câu lệnh thì tra được. Nó là mất đi sự tự tin để mở một terminal trên một cái máy lạ và bắt đầu nhìn, và thứ đó chỉ quay lại bằng cách LÀM.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> GHÉP NỐI là toàn bộ ý tưởng: công cụ nhỏ, mỗi cái một việc, nối với nhau bằng ống dẫn — đó là lý do sáu mươi bài học gói gọn trong vài chục câu lệnh. Trạng thái đã kiểm chứng thắng cấu hình mà bạn tin tưởng, dù đó là <code>sshd -T</code>, <code>systemctl cat</code> hay một lệnh <code>curl</code> không xác thực. Và thói quen giá trị nhất trong cả khoá này tốn hai giây: nhìn trước khi đổi, và giữ cái terminal thứ hai luôn mở.</p>
</div>
`,
    },
    /* ─────────────────────────── 12.6 ─────────────────────────── */
    {
      title: '12.6 — Final quiz: diagnosing a real server|||12.6 — Kiểm tra cuối khoá: chẩn đoán một máy chủ thật',
      slug: 'lnx-12-6-quiz',
      type: 'QUIZ',
      description: 'Mười câu cuối khoá: load so với CPU, available so với free, refused so với timeout, 203/EXEC, bản dựng cũ, chẻ pha bằng curl, shebang dính CRLF, namei, lệch đồng hồ, và thu giữ bằng chứng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Final quiz</span>
<h2>The last one</h2>
<p class="lead">Ten questions, drawn from the whole diagnostic chapter. They are written the way the problems arrive in real life: a symptom and some output, and you decide what it means.</p>
<div class="callout ok">Aim for 8/10. The three that matter most on a real incident: telling refused from timed out (12.2), reading <code>available</code> rather than <code>free</code> (12.3), and proving that the running process is executing the code you think it is (12.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Kiểm tra cuối khoá</span>
<h2>Bài cuối cùng</h2>
<p class="lead">Mười câu, rút từ cả chương chẩn đoán. Chúng được viết theo đúng cách các vấn đề xuất hiện ngoài đời thật: một triệu chứng và một ít output, còn bạn quyết định nó nghĩa là gì.</p>
<div class="callout ok">Hãy nhắm 8/10. Ba câu quan trọng nhất trong một sự cố thật: phân biệt refused với timed out (bài 12.2), đọc <code>available</code> chứ không đọc <code>free</code> (bài 12.3), và chứng minh tiến trình đang chạy đúng cái mã bạn nghĩ (bài 12.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Load average is 8.2 on a 2-core machine, but top shows the CPU almost idle. What does that mean?|||Load average là 8,2 trên một máy 2 nhân, nhưng top cho thấy CPU gần như rảnh. Điều đó nghĩa là gì?',
            options: [
              'The load average is stale; it updates only every 5 minutes|||Load average đã cũ; nó chỉ cập nhật mỗi 5 phút',
              'On Linux, load counts processes in uninterruptible sleep too — the machine is WAITING, almost always on disk or network storage; check %wa and /proc/pressure/io|||Trên Linux, load đếm cả tiến trình đang ngủ không ngắt được — cái máy đang CHỜ, gần như luôn là chờ đĩa hoặc ổ lưu trữ qua mạng; hãy xem %wa và /proc/pressure/io',
              'top is reporting per-core percentages, so 8.2 is really 410%|||top báo phần trăm theo từng nhân, nên 8,2 thật ra là 410%',
              'The kernel is miscounting; reboot to reset it|||Nhân đếm sai; hãy khởi động lại để đặt lại',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'free -h reports 197Mi free, 5.5Gi buff/cache and 5.3Gi available on an 8GB machine. Is memory a problem?|||free -h báo 197Mi free, 5,5Gi buff/cache và 5,3Gi available trên một máy 8GB. Bộ nhớ có phải vấn đề không?',
            options: [
              'Yes — under 200Mi free means the machine is about to start swapping|||Có — dưới 200Mi free nghĩa là máy sắp bắt đầu swap',
              'No — buff/cache is reclaimable page cache, and available (5.3Gi) is the honest number; real pressure shows as sustained si/so in vmstat|||Không — buff/cache là bộ đệm trang thu hồi được, và available (5,3Gi) mới là con số trung thực; sức ép thật hiện ra dưới dạng si/so khác 0 liên tục trong vmstat',
              'Yes — buff/cache means memory leaked into the kernel|||Có — buff/cache nghĩa là bộ nhớ đã rò vào nhân',
              'It cannot be determined without running top|||Không thể kết luận nếu chưa chạy top',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'nc -vz 10.0.0.9 3000 says "Connection refused" while nc -vz 10.0.0.9 5432 says "timed out". What do those two answers tell you?|||nc -vz 10.0.0.9 3000 nói "Connection refused" còn nc -vz 10.0.0.9 5432 nói "timed out". Hai câu trả lời đó nói cho bạn biết gì?',
            options: [
              'Both mean the service is down; the wording is arbitrary|||Cả hai đều nghĩa là dịch vụ đang chết; cách diễn đạt chỉ là ngẫu nhiên',
              'Refused = you reached the host and nothing is listening (fix on the server). Timed out = packets are being dropped (fix in the firewall/network). Same machine, two different investigations|||Refused = bạn tới được máy và không có gì lắng nghe (sửa ở máy chủ). Timed out = gói tin bị thả (sửa ở tường lửa/mạng). Cùng một cái máy, hai cuộc điều tra khác nhau',
              'Refused means DNS failed; timed out means the route is wrong|||Refused nghĩa là DNS hỏng; timed out nghĩa là định tuyến sai',
              'Refused is IPv4 and timed out is IPv6|||Refused là IPv4 còn timed out là IPv6',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'systemctl status shows status=203/EXEC and journalctl -u shows nothing from the app. What is the fastest correct next step?|||systemctl status hiện status=203/EXEC và journalctl -u không có dòng nào từ ứng dụng. Bước tiếp theo đúng và nhanh nhất là gì?',
            options: [
              'Increase the log level and restart to capture more output|||Tăng mức ghi log rồi khởi động lại để bắt thêm output',
              'Stop reading app logs — 203/EXEC means the binary could not be executed at all; ls -l the exact ExecStart path and make it absolute|||Thôi đọc log ứng dụng — 203/EXEC nghĩa là hoàn toàn không chạy được cái chương trình; hãy ls -l đúng đường dẫn trong ExecStart và cho nó thành tuyệt đối',
              'Run daemon-reload; the unit is cached|||Chạy daemon-reload; unit đang bị nạp sẵn',
              'Check the database connection string|||Kiểm chuỗi kết nối cơ sở dữ liệu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You deployed a new route an hour ago and an unauthenticated curl to it returns 404. What does that tell you, and what do you check first?|||Bạn vừa deploy một route mới một giờ trước và một lệnh curl không xác thực tới nó trả về 404. Điều đó nói lên gì, và bạn kiểm cái gì đầu tiên?',
            options: [
              'The route exists but requires auth; 404 is normal for protected routes|||Route có tồn tại nhưng đòi xác thực; 404 là bình thường với route được bảo vệ',
              '404 means the route is not mounted in the RUNNING process — check whether the service was restarted after the deploy (ps -o lstart, /proc/PID/cwd, file mtime)|||404 nghĩa là route KHÔNG được gắn trong tiến trình ĐANG CHẠY — hãy kiểm xem dịch vụ có được khởi động lại sau khi deploy không (ps -o lstart, /proc/PID/cwd, mtime của file)',
              'The browser cache needs clearing|||Cần xoá bộ đệm trình duyệt',
              'nginx needs a new proxy_pass entry for every route|||nginx cần một dòng proxy_pass mới cho mỗi route',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'curl -w reports dns=0.004 connect=0.021 tls=0.061 ttfb=8.402 total=8.409. Where is the time going?|||curl -w báo dns=0,004 connect=0,021 tls=0,061 ttfb=8,402 total=8,409. Thời gian đi đâu?',
            options: [
              'Into the network — 8 seconds of latency between client and server|||Vào mạng — 8 giây độ trễ giữa máy khách và máy chủ',
              'Into the application after the connection was established: it is thinking, or waiting on a database, cache or upstream API. The machine and the network are innocent|||Vào ỨNG DỤNG sau khi kết nối đã thiết lập: nó đang nghĩ, hoặc đang chờ cơ sở dữ liệu, bộ đệm hay một API bên trên. Máy và mạng đều vô can',
              'Into TLS negotiation|||Vào quá trình thương lượng TLS',
              'Into transferring a very large response body|||Vào việc truyền một thân phản hồi rất lớn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: './deploy.sh exists and is executable, but running it says "cannot execute: required file not found". What is the most likely cause?|||./deploy.sh có thật và chạy được, nhưng gọi nó thì báo "cannot execute: required file not found". Nguyên nhân khả dĩ nhất là gì?',
            options: [
              'The script is empty|||Script rỗng',
              'The shebang line ends with a carriage return (CRLF), so the kernel looks for an interpreter literally named /bin/bash\\r — check with cat -A, fix with dos2unix|||Dòng shebang kết thúc bằng ký tự về đầu dòng (CRLF), nên nhân đi tìm một trình thông dịch tên đúng nghĩa đen là /bin/bash\\r — kiểm bằng cat -A, chữa bằng dos2unix',
              'You need sudo to run scripts in the current directory|||Bạn cần sudo mới chạy được script trong thư mục hiện tại',
              'The filesystem is mounted read-only|||Hệ thống file đang được gắn ở chế độ chỉ đọc',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'ls -l shows -rwxr-xr-x deploy deploy on /srv/app/run.sh, but user deploy gets "Permission denied". What single command finds the cause fastest?|||ls -l hiện -rwxr-xr-x deploy deploy trên /srv/app/run.sh, nhưng người dùng deploy vẫn nhận "Permission denied". Một câu lệnh duy nhất nào tìm ra nguyên nhân nhanh nhất?',
            options: [
              'chmod 777 /srv/app/run.sh, then narrow it down|||chmod 777 /srv/app/run.sh, rồi thu hẹp dần',
              'namei -l /srv/app/run.sh — it prints the mode of EVERY component of the path, exposing a parent directory missing the x (traverse) bit|||namei -l /srv/app/run.sh — nó in quyền của MỌI thành phần trên đường dẫn, lộ ra một thư mục cha thiếu bit x (đi xuyên)',
              'stat /srv/app/run.sh|||stat /srv/app/run.sh',
              'id deploy|||id deploy',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A container reports "certificate is not yet valid" when calling an HTTPS API that works fine from your laptop. What is almost certainly wrong?|||Một container báo "certificate is not yet valid" khi gọi một API HTTPS vốn chạy tốt từ laptop của bạn. Gần như chắc chắn sai ở đâu?',
            options: [
              'The API rotated its certificate and the new one has a future start date|||API vừa xoay chứng chỉ và cái mới có ngày bắt đầu ở tương lai',
              "The CLIENT's clock is wrong — a container or VM with a skewed date rejects valid certificates; check timedatectl and NTP on the machine that is complaining|||ĐỒNG HỒ CỦA MÁY KHÁCH sai — một container hay máy ảo lệch ngày sẽ từ chối những chứng chỉ hợp lệ; hãy kiểm timedatectl và NTP trên chính cái máy đang phàn nàn",
              'The container is missing the ca-certificates package|||Container thiếu gói ca-certificates',
              'TLS 1.3 is not supported inside containers|||TLS 1.3 không được hỗ trợ bên trong container',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The outage is costing money and you decide to restart the failing service. What should you do in the fifteen seconds before that?|||Sự cố đang tiêu tiền và bạn quyết định khởi động lại cái dịch vụ đang hỏng. Bạn nên làm gì trong mười lăm giây trước đó?',
            options: [
              'Nothing — speed matters more than anything else during an outage|||Không gì cả — trong lúc sự cố thì tốc độ quan trọng hơn mọi thứ',
              'Capture the evidence a restart destroys: ps auxww, ss -tanp, free/df, and journalctl -u -n 500 into a directory — restarting without it converts a diagnosable failure into one that will return|||Thu giữ cái bằng chứng mà một cú khởi động lại sẽ phá: ps auxww, ss -tanp, free/df, và journalctl -u -n 500 vào một thư mục — khởi động lại mà không có nó là biến một cú hỏng chẩn đoán được thành một cú hỏng sẽ quay lại',
              'Take a full disk snapshot first|||Chụp ảnh toàn bộ đĩa trước',
              'Disable the service so it cannot restart itself|||Vô hiệu hoá dịch vụ để nó không tự khởi động lại được',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
