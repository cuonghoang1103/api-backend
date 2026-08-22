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
  ],
};
