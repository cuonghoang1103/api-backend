/**
 * Deploy lên VPS — Chương 3: Bước tráo.
 * Nâng cấp 29/09/2026: bài 3.0 slide (deck dv-03, 30 slide) + slide/🧪/🗂/📌 trong 3.1–3.5; đào sâu: đo lại tráo
 * ngây thơ qua nginx (502) và thẳng cổng (refused), vòng curl tự đo + bảng cờ + macOS thiếu %N, bốn cách dừng
 * (SIGTERM không bắt = SIGKILL), cái gì giữ close() (keepalive rỗi đóng ngay; TCP chưa thành request giữ tới hạn
 * chót), bảng tín hiệu + Windows, sleep sau nginx reload (bảng 0–1 s), upstream theo tên máy giữ IP cũ, Restart=
 * đo hồi sinh 3,7 s, StartLimit sai mục làm vòng sập không dừng (13 lần/30 s), systemctl restart là tráo ngây thơ
 * + NRestarts về 0, script tráo bản systemd app@ + smoke-test + nhánh lùi có lỗi riêng, 404 = bản cũ; quiz 10 câu.
 * Output MỚI chạy thật trong container ubuntu:24.04 có systemd 255 (dv03-vps) và trên Mac M1 (macOS 27).
 * LUẬT: backtick → &#96;; ${ của bash → \${; < > & trong code → &lt; &gt; &amp;; gạch chéo ngược viết đôi.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';

export default {
  title: 'Chapter 3 — The swap: changing versions without dropping a request|||Chương 3 — Bước tráo: đổi phiên bản mà không rơi một request nào',
  description: 'Bước tráo ngây thơ làm hỏng 168 trên 514 request. Chương này đo lại đúng lần deploy ấy theo cách khác và thu về số không — kèm một cú SIGTERM mà chính tôi viết sai, trả 503 cho mười request lẽ ra phải được phục vụ tử tế.',
  lessons: [

    /* ─────────────────────────── 3.0 ─────────────────────────── */
    {
      title: '3.0 — Chapter 3 slides: the swap in pictures|||3.0 — Slide Chương 3: bước tráo bằng hình',
      slug: 'deploy-3-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 30 slide của Chương 3: dòng thời gian request rơi khi tráo (đo thật), ba cửa sổ, bốn cách dừng tiến trình, cái gì giữ close(), xanh/lam sau nginx, chờ bao lâu sau reload, nginx giữ IP cũ, systemd Restart= và StartLimit sai mục, script tráo có smoke-test và nhánh lùi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Slides</span>
<h2>The whole chapter in 30 slides</h2>
<p class="lead">Skim these before the lessons to see the shape of the chapter, then come back after the quiz as a revision sheet. The centre of it is one picture: a timeline of requests during a swap, bar by bar, measured — a red block of 502s when the old version is stopped first, nothing red at all when the new one starts first, and a longer red block when systemd has to restart a crashed app.</p>
<p>Slides 3–7 belong to Lesson 3.1 (the naive swap and how to measure it), 8–12 to 3.2 (signals and graceful shutdown), 13–17 to 3.3 (blue-green behind Nginx, how long to wait after a reload, and why Nginx keeps an old IP), 18–22 to 3.4 (systemd: <code>Restart=</code>, the directive table, a start limit in the wrong section, <code>systemctl restart</code> as a naive swap) and 23–26 to 3.5 (the complete script, a rollback that caused its own 502s, the smoke test, the inherited lock). The last four are the chapter's common mistakes, a two-page cheat sheet and a 45-minute practice session. Every terminal is real output recorded on 29/09/2026 on the "lab VPS" — an Ubuntu 24.04 container running sshd and systemd 255 that the Mac reaches over SSH like a rented server — with one keepalive measurement repeated on a Mac M1.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Slide</span>
<h2>Cả chương trong 30 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để thấy hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Tâm điểm là MỘT bức hình: dòng thời gian các request trong một lần tráo, từng cột một, đo thật — một mảng đỏ 502 khi bản cũ bị dừng trước, không chút đỏ nào khi bản mới được chạy trước, và một mảng đỏ dài hơn khi systemd phải khởi động lại một app vừa sập.</p>
<p>Slide 3–7 thuộc Bài 3.1 (cú tráo ngây thơ và cách đo nó), 8–12 thuộc 3.2 (tín hiệu và tắt tử tế), 13–17 thuộc 3.3 (xanh/lam sau nginx, chờ bao lâu sau reload, và vì sao nginx giữ IP cũ), 18–22 thuộc 3.4 (systemd: <code>Restart=</code>, bảng chỉ thị, giới hạn khởi động đặt sai mục, <code>systemctl restart</code> là một cú tráo ngây thơ) và 23–26 thuộc 3.5 (script hoàn chỉnh, một cú lùi tự gây 502, smoke-test, cái khoá bị thừa hưởng). Bốn slide cuối là những sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Mọi terminal là output THẬT, ghi ngày 29/09/2026 trên "VPS thí nghiệm" — một container Ubuntu 24.04 chạy sshd và systemd 255 mà máy Mac SSH vào như một máy chủ thuê — cùng một phép đo keepalive làm lại trên Mac M1.</p>
</div>
${gallery('dv-03', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Dừng rồi chạy: 1,6 giây không ai trả lời'], [4, 'Dòng thời gian: nơi request rơi'], [5, 'Ba cửa sổ, ba cách sửa'],
  [6, 'Bốn bước — bản ngây thơ làm ngược'], [7, 'Đo bằng vòng request'],
  [8, 'Bốn cách dừng, mười request đang bay'], [9, 'Bộ xử lý SIGTERM đúng'], [10, 'Cờ xả đặt sai chỗ: 10 cú 503'],
  [11, 'Cái gì giữ tiến trình lại khi tắt'], [12, 'Ai gửi tín hiệu, bạn được bao lâu'],
  [13, 'Xanh/lam: cổng cố định thuộc về proxy'], [14, 'upstream.conf và bảng chỉ thị'], [15, 'Đổi thứ tự: 0 lỗi'],
  [16, 'Dừng bản cũ ngay sau reload: vẫn rơi'], [17, 'nginx phân giải tên máy một lần'],
  [18, 'nohup không hồi sinh; Restart= thì có'], [19, 'Unit systemd, từng dòng'], [20, 'Bảng chỉ thị Restart='],
  [21, 'Chỉ thị sai mục: vòng lặp sập không dừng'], [22, 'systemctl restart cũng là tráo ngây thơ'],
  [23, 'Script tráo bản systemd'], [24, 'Ba lần tráo + một lần lùi: 0 lỗi'], [25, 'Smoke-test: 404 là bản cũ'], [26, 'Con của script thừa hưởng khoá'],
  [27, 'Sai lầm hay gặp'], [28, 'Bảng tra nhanh (1/2)'], [29, 'Bảng tra nhanh (2/2)'], [30, 'Thực hành chương 3'],
])}
`,
    },

    /* ─────────────────────────── 3.1 ─────────────────────────── */
    {
      title: '3.1 — What the naive swap costs, measured|||3.1 — Bước tráo ngây thơ tốn bao nhiêu, đo thật',
      slug: 'deploy-3-1-trao-ngay-tho-ton-bao-nhieu',
      type: 'LESSON',
      description: '514 request bắn liên tục xuyên qua một lần deploy kiểu dừng-rồi-chạy-lại: 168 cái hỏng. Bài này đo con số đó rồi tách nó ra thành ba khoảng thời gian riêng biệt, mỗi khoảng cần một cách sửa khác nhau.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>What the naive swap costs, measured</h2>
<p class="lead">Everything in Chapters 1 and 2 stopped at the moment the bytes reached the server. At that point nothing has changed for anyone — the old version is still serving. This chapter is about the moment it stops, and the measurement below is why that moment deserves a chapter.</p>

<h3>The measurement</h3>
${slide('dv-03', 3, 'Dừng rồi chạy: 1,6 giây không ai trả lời (đo lại 29/09)')}
${slide('dv-03', 4, 'Dòng thời gian: nơi request rơi — ba lần tráo đo thật')}
<p>A client sending requests continuously for six seconds, across a deploy that kills the old process and starts the new one. The application takes 1.5 seconds to become ready:</p>
<div class="out">════ A) DUNG roi KHOI DONG LAI (ung dung khoi dong 1,5s) ════
  200: 346   loi ket noi: 168   ma khac: 0
  phan bo ban: {'A': 120, 'B': 226}</div>
<div class="kv-grid">
  <div class="kv"><span class="k">168 failures out of 514</span><span class="v">Nearly one request in three, for the whole window. Not slow responses — connection errors, with no HTTP status at all.</span></div>
  <div class="kv"><span class="k">The client saw nothing to retry against</span><span class="v"><code>ma khac: 0</code> means not a single request got a 5xx. There was no server to produce one. A browser shows "this site can't be reached"; an API client raises a connection error rather than an HTTP error, which is a different code path in most libraries.</span></div>
  <div class="kv"><span class="k">The version split shows the seam</span><span class="v">120 requests answered by A, 226 by B, and 168 by nobody in between.</span></div>
  <div class="kv"><span class="k">The duration is your startup time</span><span class="v">Lesson 0.1 measured the same deploy against an application that started instantly: one failed request. The only thing that changed here is how long the application takes to be ready.</span></div>
</div>

<h3>Three separate windows, three separate fixes</h3>
${slide('dv-03', 5, 'Ba cửa sổ rơi request, ba cách sửa')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Before the kill — requests already in flight</span><span class="lz-d">Requests the old process accepted and has not answered yet. Killing it abandons them: the client gets a closed connection mid-response. Fixed by <em>graceful shutdown</em> — Lesson 3.2, where a measured SIGKILL drops them and a correct SIGTERM does not.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Between the kill and the new process binding the port</span><span class="lz-d">Nothing is listening. Every connection is refused instantly. This is the bulk of the 168, and no amount of care inside the application can fix it — the fix has to be structural, so that something is always listening. Lesson 3.3.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">After it binds but before it is ready</span><span class="lz-d">The subtlest window. The port is open, connections are accepted, and the application cannot answer them properly yet — half-initialised database pools, empty caches, missing config. Fixed by not sending traffic until a readiness check passes, which is the alive-versus-ready distinction from Lesson 0.3.</span></div>
</div>
<div class="callout warn"><strong>Window 2 is the one people try to shrink instead of remove.</strong> Faster startup, a smaller bundle, lazy initialisation — all real improvements, and none of them a fix. They make the outage shorter. The measurement in Lesson 0.1 is the proof: the same deploy on a fast-starting application still dropped a request. The only difference between one dropped request and 168 is how long you were unlucky for.</div>

<h3>The shape of the fix</h3>
${slide('dv-03', 6, 'Bốn bước — và bản ngây thơ làm NGƯỢC')}
<p>Every zero-downtime deploy, at every scale, is the same four steps in the same order:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. Start the new version alongside the old</span><span class="lz-lnote">Both running at once, briefly. This is what removes window 2 entirely — there is never a moment with nothing listening.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. Wait until the new one is genuinely ready</span><span class="lz-lnote">Poll its own health endpoint until it answers. Not <code>sleep 5</code> — a real check, because the startup time you guessed is the outage you get when you guess low.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. Move traffic</span><span class="lz-lnote">One atomic action: a proxy reload, a symlink swap plus restart, a load balancer update. Nothing is served by a half-switched state.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. Stop the old one gracefully</span><span class="lz-lnote">Last, not first. Send <code>SIGTERM</code>, let it finish what it accepted, and only then let it exit. Lesson 3.2 measures the difference.</span></div>
</div>
<div class="callout ok"><strong>The naive deploy does exactly these four steps in reverse.</strong> It stops the old one first, then starts the new one, then hopes it is ready, then finds out. Reversing the order is the entire technique — Lesson 3.3 runs the same deploy in this order and measures zero failed requests out of 733.</div>

<h3>What "zero downtime" does not mean</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Not that both versions never run at once</span><span class="v">They must, for a moment — that is the mechanism. Which means your code has to tolerate it: two versions reading the same database, the same cache, the same files. Chapter 5 is about the version of that problem involving schemas.</span></div>
  <div class="kv"><span class="k">Not that in-flight work is safe</span><span class="v">A request that was going to take thirty seconds does not stop being at risk. Graceful shutdown gives it a deadline, not immunity.</span></div>
  <div class="kv"><span class="k">Not that long-lived connections survive</span><span class="v">WebSockets, server-sent events and streaming responses are attached to the old process. They will be closed when it exits, and the client has to reconnect. Zero-downtime for request-response traffic is not the same as zero-downtime for a persistent connection.</span></div>
  <div class="kv"><span class="k">Not that the deploy is safe</span><span class="v">Shipping a broken version with no dropped requests is still shipping a broken version. This chapter removes the outage caused by the <em>swap</em>; Chapter 6 handles the one caused by the <em>code</em>.</span></div>
</div>
<div class="note-ct">A fair question at this point: is this worth doing for a personal site with a hundred visitors a day? Often not — Lesson 0.1 measured 94 ms and one failed request on a fast-starting app, and that is a defensible cost. The reason to build it anyway is that the machinery is small, it is the same machinery that gives you instant rollback in Chapter 6, and the day you actually need it is the day you are deploying an urgent fix under load, which is the worst possible time to be assembling it.</div>
<h3>Where the downtime in a naive swap actually goes</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Window 1 — the old process is stopped</span><span class="lz-lnote">From <code>stop</code> to the socket closing. Short, and it is the only part most people picture when they say &quot;downtime&quot;.</span></div>
  <div class="lz-layer"><span class="lz-lname">Window 2 — the new process is starting</span><span class="lz-lnote">Node boots, the framework loads, the pool connects. Measured in seconds, and it is usually the largest of the three.</span></div>
  <div class="lz-layer"><span class="lz-lname">Window 3 — it is listening but not ready</span><span class="lz-lnote">The port is open, so the proxy sends traffic, and the app returns 500 until warm-up finishes. This one is invisible without a readiness check.</span></div>
  <div class="lz-layer"><span class="lz-lname">So three windows, three different fixes</span><span class="lz-lnote">Start-before-stop removes the first two; a readiness probe the proxy honours removes the third. Fixing only one leaves the outage roughly as long.</span></div>
</div>

<h3>Measured again on the lab VPS: with Nginx in front, the gap is a 502</h3>
<p>The numbers above came from a client talking straight to the application port. Real users never do that — they talk to Nginx, which talks to the application. So the same stop-then-start deploy was run again on the "lab VPS" (an Ubuntu 24.04 container running sshd and systemd, reached over SSH from a Mac exactly like a rented server; Node v18.19.1, nginx 1.24.0), once against the port and once through Nginx. The application still takes 1.5 seconds to start, and the client fires one request roughly every 10 ms, each on a fresh connection like <code>curl</code>:</p>
<div class="out">════ A) DUNG roi CHAY — client goi http://127.0.0.1:3101/ ════
  +1022ms  kill -TERM ban A (khong co bo xu ly SIGTERM)
  +1040ms  khoi dong ban B (KHOI=1500ms)
  +2725ms  ban B san sang (cho 1679 ms)
  tong: 534   200: 382   ECONNRESET: 3   ECONNREFUSED: 149
  phan bo ban: {"A":88,"B":294}
  cua so hong: tu 1010ms den 2662ms (1652ms)
════ A) DUNG roi CHAY — client goi http://127.0.0.1/ ════
  +1011ms  kill -TERM ban A (khong co bo xu ly SIGTERM)
  +1018ms  khoi dong ban B (KHOI=1500ms)
  +2651ms  ban B san sang (cho 1630 ms)
  tong: 473   200: 340   502: 133
  phan bo ban: {"A":78,"B":262}
  cua so hong: tu 1007ms den 2601ms (1594ms)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Same hole, two costumes</span><span class="v">Straight to the port: 149 <code>ECONNREFUSED</code> (the browser says "this site can't be reached"). Through Nginx: 133 <code>502 Bad Gateway</code> — Nginx did get the connection, tried the application, was refused, and turned the refusal into an HTTP error. That is why users of a site behind a proxy never report "connection refused" during a bad deploy; they report 502s.</span></div>
  <div class="kv"><span class="k">Three <code>ECONNRESET</code></span><span class="v">Requests that were already inside the old process when it died — window 1 below. Nginx hides them among the 502s.</span></div>
  <div class="kv"><span class="k">The window is the startup time, again</span><span class="v">1,652 ms and 1,594 ms of failures for an application that needs about 1,630 ms to be ready. The measurement is repeatable to within a few tens of milliseconds.</span></div>
</div>
<p>The timeline slide above draws this run bar by bar (one bar per 200 ms): blue is version A answering, red is 502, green is version B. The second row is the same deploy done in the right order (Lesson 3.3) and the third is what systemd's <code>Restart=on-failure</code> gives you after a crash (Lesson 3.4) — worth coming back to after those lessons.</p>

<h3>Measure it yourself: a request loop in eight lines</h3>
<p>The client used above is a small Node script, but the idea fits in plain bash — fire requests back to back, write down the time and the status code of each, count afterwards:</p>
<pre><code class="language-bash">#!/bin/bash
# vong.sh URL GIAY — ban curl lien tuc, in theo mili giay: thoi_diem ma
URL=\${1:-http://127.0.0.1/}; HET=\$(( \$(date +%s%3N) + \${2:-6} * 1000 ))
T0=\$(date +%s%3N)
while [ "\$(date +%s%3N)" -lt "\$HET" ]; do
  ma=\$(curl -s -o /dev/null -w '%{http_code}' --max-time 2 "\$URL")
  echo "\$(( \$(date +%s%3N) - T0 )) \$ma"
done</code></pre>
<div class="out">$ bash vong.sh http://127.0.0.1/ 5 &gt; /tmp/vong.txt &amp;
  (… meanwhile: kill version A, start version B …)
$ awk '{print $2}' /tmp/vong.txt | sort | uniq -c
    121 200
    266 502
$ awk '$2!=200' /tmp/vong.txt | sed -n '1p;$p'
1005 502
2615 502</div>
${slide('dv-03', 7, 'Đo bằng vòng request, không bằng một curl')}
<table>
<tr><th>Piece</th><th>What it does</th></tr>
<tr><td><code>date +%s%3N</code></td><td>Seconds since 1970 followed by the first three digits of the nanoseconds — milliseconds. GNU date only.</td></tr>
<tr><td><code>curl -s</code></td><td>Silent: no progress bar, no error text.</td></tr>
<tr><td><code>-o /dev/null</code></td><td>Throw the body away; we only want the status.</td></tr>
<tr><td><code>-w '%{http_code}'</code></td><td>Print the HTTP status after the transfer. <code>000</code> means there was no HTTP response at all — refused, reset or timed out.</td></tr>
<tr><td><code>--max-time 2</code></td><td>Give up after 2 s, so one hanging request does not stall the whole loop.</td></tr>
<tr><td><code>sort | uniq -c</code></td><td>Count identical lines — here, how many of each status code.</td></tr>
<tr><td><code>sed -n '1p;$p'</code></td><td>Print only the first and last line — the start and end of the failure window.</td></tr>
</table>
<div class="callout warn"><strong>Read the counts with care: failures are faster than successes.</strong> A 502 comes back in a millisecond or two, a real answer takes longer, so a sequential loop sends <em>more</em> requests while things are broken. Here 266 of 387 lines are 502 even though the broken window was only a third of the run. Compare the <em>window</em> (first to last failure: 1,005 → 2,615 ms), not the ratio.</div>

<h3>On macOS and Windows: the loop needs a different clock</h3>
<p>Run the loop on the server itself, not on your laptop, and the numbers are about the deploy rather than about your Wi-Fi. If you do want to run it on a Mac, the BSD <code>date</code> that ships with macOS has no <code>%N</code> — it prints the letters literally, and the arithmetic breaks:</p>
<div class="out">$ date +%s%3N          # macOS 27
17906478913N
$ perl -MTime::HiRes=time -e 'printf "%d\\n", time*1000'
1790647899241</div>
<p>Replace each <code>\$(date +%s%3N)</code> with the <code>perl</code> one-liner (Perl ships with macOS), or install GNU coreutils and use <code>gdate</code>. On Windows, run the script inside WSL, where <code>date</code> is the GNU one; Git Bash also has GNU <code>date</code>. PowerShell's <code>curl</code> is an alias for <code>Invoke-WebRequest</code> in Windows PowerShell 5.1 and does not understand <code>-w</code> — call <code>curl.exe</code> explicitly.</p>
<div class="pitfall"><strong>Trap — measuring downtime with a single curl and concluding it was instant.</strong> One request, sent at a moment you chose, has roughly a one-in-a-hundred chance of landing inside a two-second window. So the naive swap measures as zero downtime and users see 502s, and the disagreement gets blamed on the proxy or the browser. Measure it the way this lesson does: a request every 100 ms for the whole deploy, counting non-200 responses. That turns &quot;it felt fine&quot; into a number — and the number is what tells you which of the three windows you actually closed.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the night before the SWP391 defence, your team deploys with <code>pkill node &amp;&amp; npm start</code>. It "works on every test", but the examiner clicks at exactly the wrong second and sees 502. Reproduce that on the lab VPS and put a number on it.</p>
<ol>
<li>On the lab VPS, run a small Node app that waits 1.5 s before <code>listen()</code> (a <code>setTimeout</code> around it is enough) on port 3101, with Nginx on port 80 proxying to it.</li>
<li>Start <code>bash vong.sh http://127.0.0.1/ 6 &gt; /tmp/vong.txt &amp;</code>, wait one second, then kill the app and start it again.</li>
<li>Count with <code>awk '{print $2}' /tmp/vong.txt | sort | uniq -c</code> and find the window with <code>awk '$2!=200' /tmp/vong.txt | sed -n '1p;$p'</code>.</li>
<li>Repeat against <code>http://127.0.0.1:3101/</code> directly and compare the codes you get (<code>000</code> instead of <code>502</code>).</li>
</ol>
<p><strong>Done when:</strong> you can state "through Nginx: N × 502 over a window of about X ms, direct: N × 000", and X is within a few hundred milliseconds of the app's startup time.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Swap</span><span class="v">The moment traffic moves from the old version to the new one — the step this chapter is about.</span></div>
  <div class="kv"><span class="k">Stop-then-start (naive swap)</span><span class="v">Kill the old process, start the new one; costs exactly the new version's startup time in failed requests.</span></div>
  <div class="kv"><span class="k">ECONNREFUSED / ECONNRESET</span><span class="v">Nothing listening on the port / the connection was cut mid-request; neither carries an HTTP status.</span></div>
  <div class="kv"><span class="k">502 Bad Gateway</span><span class="v">What Nginx answers when the upstream refused or reset — the same hole seen through a proxy.</span></div>
  <div class="kv"><span class="k">Readiness</span><span class="v">The app can answer real requests correctly, which is later than "the port is open".</span></div>
  <div class="kv"><span class="k">Zero-downtime deploy</span><span class="v">A swap during which no request-response call fails — not a promise about long-lived connections or bad code.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Stop-then-start drops requests for exactly as long as the new version takes to become ready — 1.6 s here, measured twice.</li>
<li>Straight to the port the failures are refusals with no status; behind Nginx they become 502s.</li>
<li>There are three windows — in-flight, nothing listening, listening but not ready — and each needs its own fix.</li>
<li>The fix is an order: start new, wait for ready, switch traffic, stop old last.</li>
<li>Measure with a loop of requests over the whole deploy, and compare failure windows rather than ratios.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — BlueGreenDeployment</span><span class="lc-sub">martinfowler.com/bliki/BlueGreenDeployment.html — the two-environment pattern this chapter builds, in two pages.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kubernetes — readiness probes and rolling updates</span><span class="lc-sub">kubernetes.io/docs/concepts/workloads/controllers/deployment — the same four steps, automated. Worth reading even on a single VPS, because it names each step precisely.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — reloading under live traffic</span><span class="lc-sub">/courses/nginx/learn${REF} — the measurement showing three reloads during four hundred requests produced four hundred 200s, which is what makes step 3 above atomic.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — signals, and what a process does when it receives one</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the mechanism behind step 4, and why SIGTERM and SIGKILL are not two strengths of the same thing.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Bước tráo ngây thơ tốn bao nhiêu, đo thật</h2>
<p class="lead">Mọi thứ ở Chương 1 và Chương 2 dừng lại ở khoảnh khắc các byte tới được máy chủ. Ở thời điểm đó chưa có gì thay đổi với ai cả — bản cũ vẫn đang phục vụ. Chương này nói về cái khoảnh khắc nó DỪNG, và phép đo dưới đây là lý do khoảnh khắc ấy xứng đáng có một chương riêng.</p>

<h3>Phép đo</h3>
${slide('dv-03', 3, 'Dừng rồi chạy: 1,6 giây không ai trả lời (đo lại 29/09)')}
${slide('dv-03', 4, 'Dòng thời gian: nơi request rơi — ba lần tráo đo thật')}
<p>Một client bắn request liên tục trong sáu giây, xuyên qua một lần deploy giết tiến trình cũ rồi khởi động cái mới. Ứng dụng mất 1,5 giây để sẵn sàng:</p>
<div class="out">════ A) DUNG roi KHOI DONG LAI (ung dung khoi dong 1,5s) ════
  200: 346   loi ket noi: 168   ma khac: 0
  phan bo ban: {'A': 120, 'B': 226}</div>
<div class="kv-grid">
  <div class="kv"><span class="k">168 cái hỏng trên tổng 514</span><span class="v">Gần một request trên ba, suốt cả cửa sổ đó. Không phải phản hồi chậm — mà là LỖI KẾT NỐI, không có mã trạng thái HTTP nào cả.</span></div>
  <div class="kv"><span class="k">Client chẳng thấy gì để mà thử lại</span><span class="v"><code>ma khac: 0</code> nghĩa là KHÔNG một request nào nhận được 5xx. Chẳng có máy chủ nào ở đó để sinh ra nó. Trình duyệt hiện "không truy cập được trang này"; một thư viện API thì ném ra lỗi KẾT NỐI chứ không phải lỗi HTTP, mà đó là một nhánh mã hoàn toàn khác trong hầu hết thư viện.</span></div>
  <div class="kv"><span class="k">Phân bố phiên bản cho thấy vết nứt</span><span class="v">120 request do A trả lời, 226 do B, và 168 thì KHÔNG AI trả lời, nằm ở giữa.</span></div>
  <div class="kv"><span class="k">Độ dài của nó chính là thời gian khởi động của bạn</span><span class="v">Bài 0.1 đã đo đúng lần deploy đó trên một ứng dụng khởi động tức thì: MỘT request hỏng. Thứ duy nhất thay đổi ở đây là ứng dụng mất bao lâu để sẵn sàng.</span></div>
</div>

<h3>Ba cửa sổ riêng biệt, ba cách sửa riêng biệt</h3>
${slide('dv-03', 5, 'Ba cửa sổ rơi request, ba cách sửa')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Trước lúc giết — những request đang bay dở</span><span class="lz-d">Những request mà tiến trình cũ đã NHẬN và chưa trả lời. Giết nó là bỏ rơi chúng: client nhận một kết nối bị đóng giữa chừng phản hồi. Sửa bằng <em>tắt tử tế</em> — Bài 3.2, nơi một cú SIGKILL đo được là làm rơi chúng còn một cú SIGTERM viết đúng thì không.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Giữa lúc giết và lúc tiến trình mới gắn được cổng</span><span class="lz-d">Không có gì lắng nghe. Mọi kết nối bị từ chối ngay lập tức. Đây là PHẦN LỚN trong số 168 đó, và không sự cẩn thận nào bên trong ứng dụng sửa được — cách sửa buộc phải mang tính CẤU TRÚC, sao cho LUÔN có thứ gì đó đang lắng nghe. Bài 3.3.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Sau khi nó gắn cổng nhưng TRƯỚC khi nó sẵn sàng</span><span class="lz-d">Cửa sổ tinh vi nhất. Cổng đã mở, kết nối được nhận, và ứng dụng thì chưa trả lời tử tế nổi — bể kết nối cơ sở dữ liệu mới khởi tạo một nửa, bộ đệm còn rỗng, cấu hình còn thiếu. Sửa bằng cách KHÔNG gửi lưu lượng vào cho tới khi một phép kiểm sẵn sàng qua được, tức là phân biệt còn-sống/sẵn-sàng ở Bài 0.3.</span></div>
</div>
<div class="callout warn"><strong>Cửa sổ 2 là cái mà người ta cố THU NHỎ thay vì LOẠI BỎ.</strong> Khởi động nhanh hơn, gói nhỏ hơn, khởi tạo lười — đều là cải thiện có thật, và chẳng cái nào là một cách SỬA. Chúng làm cho lần gián đoạn NGẮN HƠN. Phép đo ở Bài 0.1 là bằng chứng: cùng lần deploy đó trên một ứng dụng khởi động nhanh vẫn làm rơi một request. Khác biệt duy nhất giữa một request rơi và 168 request rơi là bạn đen đủi trong bao lâu.</div>

<h3>Hình dạng của cách sửa</h3>
${slide('dv-03', 6, 'Bốn bước — và bản ngây thơ làm NGƯỢC')}
<p>Mọi quy trình deploy không-gián-đoạn, ở mọi quy mô, đều là cùng bốn bước theo cùng một thứ tự:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. Khởi động bản MỚI SONG SONG với bản cũ</span><span class="lz-lnote">Cả hai cùng chạy một lúc, trong chốc lát. Đây là thứ LOẠI BỎ HẲN cửa sổ 2 — không bao giờ có khoảnh khắc nào mà chẳng có gì lắng nghe.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. CHỜ tới khi bản mới thật sự SẴN SÀNG</span><span class="lz-lnote">Hỏi endpoint sức khoẻ của chính nó tới khi nó trả lời. Không phải <code>sleep 5</code> — một phép kiểm THẬT, vì cái thời gian khởi động mà bạn đoán chính là cái gián đoạn bạn nhận khi đoán thiếu.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. CHUYỂN lưu lượng</span><span class="lz-lnote">MỘT hành động nguyên tử: một lần nạp lại proxy, một cú tráo symlink kèm khởi động lại, một lần cập nhật bộ cân bằng tải. Không có gì được phục vụ bởi một trạng thái chuyển dở.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. DỪNG bản cũ một cách tử tế</span><span class="lz-lnote">SAU CÙNG, không phải đầu tiên. Gửi <code>SIGTERM</code>, để nó làm nốt những gì đã nhận, rồi mới để nó thoát. Bài 3.2 đo cái khác biệt đó.</span></div>
</div>
<div class="callout ok"><strong>Lần deploy ngây thơ làm ĐÚNG bốn bước đó theo thứ tự NGƯỢC.</strong> Nó dừng bản cũ trước, rồi khởi động bản mới, rồi hy vọng nó sẵn sàng, rồi mới biết. ĐẢO lại thứ tự chính là toàn bộ kỹ thuật — Bài 3.3 chạy đúng lần deploy đó theo thứ tự này và đo được KHÔNG request nào hỏng trên tổng 733.</div>

<h3>"Không gián đoạn" KHÔNG có nghĩa là gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Không có nghĩa là hai phiên bản không bao giờ chạy cùng lúc</span><span class="v">Chúng BẮT BUỘC phải thế, trong chốc lát — đó chính là cơ chế. Nghĩa là mã của bạn phải CHỊU ĐƯỢC chuyện đó: hai phiên bản cùng đọc một cơ sở dữ liệu, một bộ đệm, một bộ tệp. Chương 5 nói về phiên bản của bài toán đó dính tới lược đồ.</span></div>
  <div class="kv"><span class="k">Không có nghĩa là công việc đang bay dở thì AN TOÀN</span><span class="v">Một request lẽ ra mất ba mươi giây không vì thế mà hết rủi ro. Tắt tử tế cho nó một cái HẠN, chứ không cho nó quyền miễn trừ.</span></div>
  <div class="kv"><span class="k">Không có nghĩa là kết nối dài hạn sống sót</span><span class="v">WebSocket, server-sent event và phản hồi dạng dòng chảy đều gắn vào tiến trình CŨ. Chúng sẽ bị đóng khi nó thoát, và client phải kết nối lại. Không-gián-đoạn cho lưu lượng request-response KHÔNG giống không-gián-đoạn cho một kết nối bền.</span></div>
  <div class="kv"><span class="k">Không có nghĩa là lần deploy AN TOÀN</span><span class="v">Gửi đi một bản hỏng mà không rơi request nào thì vẫn là gửi đi một bản hỏng. Chương này gỡ bỏ cái gián đoạn do <em>BƯỚC TRÁO</em> gây ra; Chương 6 xử lý cái do <em>MÃ</em> gây ra.</span></div>
</div>
<div class="note-ct">Một câu hỏi công bằng ở đây: có đáng làm chuyện này cho một website cá nhân trăm khách mỗi ngày không? Thường là KHÔNG — Bài 0.1 đo được 94 ms và một request hỏng trên một ứng dụng khởi động nhanh, và đó là cái giá bảo vệ được. Lý do vẫn nên dựng nó là bộ máy này NHỎ, nó cũng chính là bộ máy đem lại cho bạn khả năng lùi bản tức thì ở Chương 6, và cái ngày bạn THẬT SỰ cần tới nó là ngày bạn đang deploy một bản vá khẩn giữa lúc có tải, tức là thời điểm tệ nhất để mà ngồi lắp ráp nó.</div>
<h3>Thời gian chết trong một bước tráo ngây thơ thật ra đi đâu</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Cửa sổ 1 — tiến trình cũ bị dừng</span><span class="lz-lnote">Từ lúc <code>stop</code> tới lúc socket đóng. Ngắn, và đó là phần duy nhất mà phần lớn người ta hình dung khi nói &quot;thời gian chết&quot;.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cửa sổ 2 — tiến trình mới đang khởi động</span><span class="lz-lnote">Node khởi động, framework nạp lên, pool kết nối. Đo bằng giây, và thường là cửa sổ lớn nhất trong ba.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cửa sổ 3 — nó đang nghe nhưng chưa sẵn sàng</span><span class="lz-lnote">Cổng đã mở, nên proxy đẩy lưu lượng tới, và ứng dụng trả 500 cho tới khi khởi động xong. Cửa sổ này vô hình nếu không có phép kiểm sẵn-sàng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Vậy là ba cửa sổ, ba cách chữa khác nhau</span><span class="lz-lnote">Khởi-động-trước-rồi-mới-dừng gỡ bỏ hai cái đầu; một probe sẵn-sàng mà proxy tôn trọng gỡ bỏ cái thứ ba. Chữa mỗi một cái thì thời gian chết gần như vẫn thế.</span></div>
</div>

<h3>Đo lại trên VPS thí nghiệm: có nginx đứng trước thì lỗ hổng thành 502</h3>
<p>Mấy con số ở trên đo bằng một client nói chuyện THẲNG với cổng của ứng dụng. Người dùng thật không bao giờ làm thế — họ nói chuyện với nginx, nginx nói chuyện với ứng dụng. Nên đúng lần deploy dừng-rồi-chạy ấy được chạy lại trên "VPS thí nghiệm" (một container Ubuntu 24.04 chạy sshd và systemd, máy Mac SSH vào y như một máy chủ thuê thật; Node v18.19.1, nginx 1.24.0), một lần gọi thẳng cổng và một lần đi qua nginx. Ứng dụng vẫn mất 1,5 giây để khởi động, và client bắn một request khoảng mỗi 10 ms, mỗi request một kết nối mới như <code>curl</code>:</p>
<div class="out">════ A) DUNG roi CHAY — client goi http://127.0.0.1:3101/ ════
  +1022ms  kill -TERM ban A (khong co bo xu ly SIGTERM)
  +1040ms  khoi dong ban B (KHOI=1500ms)
  +2725ms  ban B san sang (cho 1679 ms)
  tong: 534   200: 382   ECONNRESET: 3   ECONNREFUSED: 149
  phan bo ban: {"A":88,"B":294}
  cua so hong: tu 1010ms den 2662ms (1652ms)
════ A) DUNG roi CHAY — client goi http://127.0.0.1/ ════
  +1011ms  kill -TERM ban A (khong co bo xu ly SIGTERM)
  +1018ms  khoi dong ban B (KHOI=1500ms)
  +2651ms  ban B san sang (cho 1630 ms)
  tong: 473   200: 340   502: 133
  phan bo ban: {"A":78,"B":262}
  cua so hong: tu 1007ms den 2601ms (1594ms)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Cùng một lỗ hổng, hai cái áo</span><span class="v">Gọi thẳng cổng: 149 cú <code>ECONNREFUSED</code> (bị từ chối kết nối — trình duyệt báo "không truy cập được trang này"). Đi qua nginx: 133 cú <code>502 Bad Gateway</code> (cổng nối hỏng) — nginx ĐÃ nhận kết nối, thử gọi ứng dụng, bị từ chối, rồi biến cú từ chối đó thành một lỗi HTTP. Đó là lý do người dùng của một website đứng sau proxy không bao giờ kêu "bị từ chối kết nối" trong một lần deploy hỏng; họ kêu 502.</span></div>
  <div class="kv"><span class="k">Ba cú <code>ECONNRESET</code></span><span class="v">(kết nối bị cắt ngang) Những request đã NẰM TRONG tiến trình cũ lúc nó chết — cửa sổ 1 ở dưới. Có nginx thì chúng lẫn vào đám 502.</span></div>
  <div class="kv"><span class="k">Cửa sổ vẫn bằng thời gian khởi động</span><span class="v">1.652 ms và 1.594 ms hỏng liên tục, với một ứng dụng cần khoảng 1.630 ms để sẵn sàng. Phép đo lặp lại được, chênh nhau vài chục mili giây.</span></div>
</div>
<p>Slide dòng thời gian ở trên vẽ đúng lần chạy này, từng cột một (mỗi cột 200 ms): xanh dương là bản A trả lời, đỏ là 502, xanh lá là bản B. Hàng thứ hai là CÙNG lần deploy đó làm theo đúng thứ tự (Bài 3.3), hàng thứ ba là thứ <code>Restart=on-failure</code> của systemd đem lại sau một cú sập (Bài 3.4) — đáng quay lại xem sau khi học hai bài đó.</p>

<h3>Tự đo: một vòng request trong tám dòng</h3>
<p>Client dùng ở trên là một script Node nhỏ, nhưng ý tưởng gói vừa trong bash thuần — bắn request nối đuôi nhau, ghi lại thời điểm và mã trạng thái của từng cái, rồi đếm sau:</p>
<pre><code class="language-bash">#!/bin/bash
# vong.sh URL GIAY — ban curl lien tuc, in theo mili giay: thoi_diem ma
URL=\${1:-http://127.0.0.1/}; HET=\$(( \$(date +%s%3N) + \${2:-6} * 1000 ))
T0=\$(date +%s%3N)
while [ "\$(date +%s%3N)" -lt "\$HET" ]; do
  ma=\$(curl -s -o /dev/null -w '%{http_code}' --max-time 2 "\$URL")
  echo "\$(( \$(date +%s%3N) - T0 )) \$ma"
done</code></pre>
<div class="out">$ bash vong.sh http://127.0.0.1/ 5 &gt; /tmp/vong.txt &amp;
  (… trong lúc đó: kill bản A, chạy bản B …)
$ awk '{print $2}' /tmp/vong.txt | sort | uniq -c
    121 200
    266 502
$ awk '$2!=200' /tmp/vong.txt | sed -n '1p;$p'
1005 502
2615 502</div>
${slide('dv-03', 7, 'Đo bằng vòng request, không bằng một curl')}
<table>
<tr><th>Mảnh</th><th>Làm gì</th></tr>
<tr><td><code>date +%s%3N</code></td><td>Số giây từ năm 1970, nối thêm ba chữ số đầu của phần nano giây — tức là mili giây. Chỉ <code>date</code> của GNU có.</td></tr>
<tr><td><code>curl -s</code></td><td>Im lặng (silent): không thanh tiến trình, không chữ báo lỗi.</td></tr>
<tr><td><code>-o /dev/null</code></td><td>Vứt phần thân phản hồi đi; ta chỉ cần mã trạng thái.</td></tr>
<tr><td><code>-w '%{http_code}'</code></td><td>In mã HTTP sau khi xong. <code>000</code> nghĩa là KHÔNG có phản hồi HTTP nào — bị từ chối, bị cắt hoặc hết giờ.</td></tr>
<tr><td><code>--max-time 2</code></td><td>Bỏ cuộc sau 2 giây, để một request treo không làm đứng cả vòng lặp.</td></tr>
<tr><td><code>sort | uniq -c</code></td><td>Đếm các dòng giống nhau — ở đây là mỗi mã trạng thái bao nhiêu lần.</td></tr>
<tr><td><code>sed -n '1p;$p'</code></td><td>Chỉ in dòng đầu và dòng cuối — điểm bắt đầu và kết thúc của cửa sổ hỏng.</td></tr>
</table>
<div class="callout warn"><strong>Đọc con số cho cẩn thận: lỗi về NHANH hơn thành công.</strong> Một cú 502 quay về trong một hai mili giây, một câu trả lời thật thì lâu hơn, nên một vòng lặp tuần tự gửi ĐƯỢC NHIỀU request hơn trong lúc hệ thống đang hỏng. Ở đây 266 trên 387 dòng là 502 dù cửa sổ hỏng chỉ chiếm một phần ba thời gian đo. Hãy so <em>CỬA SỔ</em> (từ lỗi đầu tới lỗi cuối: 1.005 → 2.615 ms), đừng so tỉ lệ.</div>

<h3>Trên macOS và Windows: vòng lặp cần một cái đồng hồ khác</h3>
<p>Hãy chạy vòng lặp NGAY TRÊN máy chủ chứ đừng chạy trên laptop, như thế con số nói về lần deploy chứ không nói về cái Wi-Fi của bạn. Nếu vẫn muốn chạy trên Mac: <code>date</code> kiểu BSD có sẵn trong macOS không có <code>%N</code> — nó in nguyên chữ ra, và phép cộng trừ vỡ luôn:</p>
<div class="out">$ date +%s%3N          # macOS 27
17906478913N
$ perl -MTime::HiRes=time -e 'printf "%d\\n", time*1000'
1790647899241</div>
<p>Thay mỗi chỗ <code>\$(date +%s%3N)</code> bằng dòng <code>perl</code> kia (macOS có sẵn Perl), hoặc cài GNU coreutils rồi dùng <code>gdate</code>. Trên Windows, chạy script trong WSL, nơi <code>date</code> là bản GNU; Git Bash cũng có <code>date</code> của GNU. Còn <code>curl</code> trong Windows PowerShell 5.1 là bí danh của <code>Invoke-WebRequest</code> và không hiểu <code>-w</code> — hãy gọi thẳng <code>curl.exe</code>.</p>
<div class="pitfall"><strong>Bẫy — đo thời gian chết bằng một lệnh curl duy nhất rồi kết luận là tức thì.</strong> Một request, gửi đi vào một thời điểm do bạn chọn, có xác suất cỡ một phần trăm rơi trúng vào một cửa sổ hai giây. Nên bước tráo ngây thơ đo ra bằng không thời gian chết trong khi người dùng nhận 502, và sự bất đồng đó bị đổ cho proxy hoặc cho trình duyệt. Hãy đo theo đúng cách bài này làm: một request mỗi 100 ms trong suốt lần deploy, đếm số phản hồi khác 200. Việc đó biến &quot;thấy cũng ổn&quot; thành một con số — và chính con số ấy nói cho bạn biết bạn đã thật sự đóng được cửa sổ nào trong ba cửa sổ.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tối trước hôm bảo vệ SWP391, nhóm bạn deploy bằng <code>pkill node &amp;&amp; npm start</code>. "Lần nào thử cũng chạy", nhưng thầy bấm đúng vào giây xui xẻo và thấy 502. Hãy dựng lại chuyện đó trên VPS thí nghiệm và gắn cho nó một con số.</p>
<ol>
<li>Trên VPS thí nghiệm, chạy một app Node nhỏ chờ 1,5 giây rồi mới <code>listen()</code> (bọc nó trong một <code>setTimeout</code> là đủ) ở cổng 3101, và nginx ở cổng 80 chuyển tiếp vào đó.</li>
<li>Chạy <code>bash vong.sh http://127.0.0.1/ 6 &gt; /tmp/vong.txt &amp;</code>, chờ một giây, rồi kill app và chạy lại nó.</li>
<li>Đếm bằng <code>awk '{print $2}' /tmp/vong.txt | sort | uniq -c</code> và tìm cửa sổ bằng <code>awk '$2!=200' /tmp/vong.txt | sed -n '1p;$p'</code>.</li>
<li>Làm lại, lần này gọi thẳng <code>http://127.0.0.1:3101/</code> và so mã bạn nhận được (<code>000</code> thay vì <code>502</code>).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được "qua nginx: N cú 502 trong một cửa sổ khoảng X ms, gọi thẳng: N cú 000", và X chênh thời gian khởi động của app không quá vài trăm mili giây.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Swap (bước tráo)</span><span class="v">Khoảnh khắc lưu lượng chuyển từ bản cũ sang bản mới — đúng cái bước chương này bàn.</span></div>
  <div class="kv"><span class="k">Stop-then-start (dừng rồi chạy — tráo ngây thơ)</span><span class="v">Giết tiến trình cũ, chạy tiến trình mới; tốn đúng bằng thời gian khởi động của bản mới tính bằng request hỏng.</span></div>
  <div class="kv"><span class="k">ECONNREFUSED / ECONNRESET (bị từ chối / bị cắt ngang)</span><span class="v">Không ai nghe cổng / kết nối bị cắt giữa chừng; cả hai đều KHÔNG có mã HTTP.</span></div>
  <div class="kv"><span class="k">502 Bad Gateway (cổng nối hỏng)</span><span class="v">Thứ nginx trả khi upstream từ chối hoặc cắt kết nối — cùng lỗ hổng ấy nhìn qua một proxy.</span></div>
  <div class="kv"><span class="k">Readiness (sẵn sàng)</span><span class="v">Ứng dụng trả lời ĐÚNG được request thật — muộn hơn lúc "cổng đã mở".</span></div>
  <div class="kv"><span class="k">Zero-downtime deploy (deploy không gián đoạn)</span><span class="v">Một lần tráo mà không request-response nào hỏng — không phải lời hứa cho kết nối dài hay cho mã hỏng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dừng-rồi-chạy làm rơi request đúng bằng thời gian bản mới cần để sẵn sàng — 1,6 giây ở đây, đo hai lần.</li>
<li>Gọi thẳng cổng thì lỗi là "bị từ chối" không có mã; có nginx đứng trước thì chúng thành 502.</li>
<li>Có ba cửa sổ — đang bay, không ai nghe, nghe mà chưa sẵn sàng — và mỗi cái cần một cách sửa riêng.</li>
<li>Cách sửa là một THỨ TỰ: chạy bản mới, chờ sẵn sàng, chuyển lưu lượng, dừng bản cũ sau cùng.</li>
<li>Đo bằng một vòng request trải suốt lần deploy, và so cửa sổ hỏng chứ đừng so tỉ lệ.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — BlueGreenDeployment</span><span class="lc-sub">martinfowler.com/bliki/BlueGreenDeployment.html — khuôn hai-môi-trường mà chương này dựng, gói trong hai trang.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kubernetes — readiness probe và rolling update</span><span class="lc-sub">kubernetes.io/docs/concepts/workloads/controllers/deployment — vẫn bốn bước đó, đã tự động hoá. Đáng đọc ngay cả khi bạn chỉ có một con VPS, vì nó gọi tên từng bước rất chính xác.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — nạp lại cấu hình giữa lúc có lưu lượng</span><span class="lc-sub">/courses/nginx/learn${REF} — phép đo cho thấy ba lần reload giữa bốn trăm request cho ra bốn trăm cú 200, và đó là thứ làm cho bước 3 ở trên trở nên nguyên tử.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — tín hiệu, và một tiến trình làm gì khi nhận được</span><span class="lc-sub">/courses/linux-bash/learn${REF} — cơ chế nằm sau bước 4, và vì sao SIGTERM với SIGKILL không phải hai mức mạnh yếu của cùng một thứ.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.2 ─────────────────────────── */
    {
      title: '3.2 — Graceful shutdown, and the drain I got wrong|||3.2 — Tắt tử tế, và cái bước xả tôi viết sai',
      slug: 'deploy-3-2-tat-tu-te',
      type: 'LESSON',
      description: 'SIGKILL làm rơi mười request đang bay. SIGTERM giữ được chúng — nhưng bản xả đầu tiên tôi viết trả 503 cho cả mười, mà từ phía người dùng thì cũng hỏng y như bị giết. Đo cả ba trạng thái.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Graceful shutdown, and the drain I got wrong</h2>
<p class="lead">Step 4 of the fix is stopping the old version. It looks like the easy step. It is the one where a plausible implementation produces exactly the outcome you were trying to avoid — measured below, in code I wrote for this lesson.</p>

<h3>SIGKILL: the baseline</h3>
<p>Ten requests in flight, each taking 400 ms, and the process is killed with <code>SIGKILL</code> 150 ms in:</p>
<div class="out">════ SIGKILL ════
  ma tra ve: 000 000 000 000 RỚT RỚT 000 000 000 000 000 RỚT RỚT 000 RỚT ...</div>
<p><code>000</code> is curl's code for "no HTTP response at all". The connections were open, the server was going to answer, and the process ceased to exist. Nothing was written, nothing was logged, and the client cannot distinguish this from the server never having received the request — which matters when the request was a payment.</p>
<div class="note-ct"><code>SIGKILL</code> cannot be caught, blocked or handled. The process does not get to run any code — no flush, no close, no log line. That is the point of it, and it is why it is the wrong tool for a deploy. It is the right tool only for a process that has already refused to stop.</div>


<h3>Measured again: four ways to stop, and "no handler" is SIGKILL</h3>
<p>The lab VPS repeated the experiment with one more case that most first deploys actually hit: <code>SIGTERM</code> sent to an application that never registered a handler. Ten requests to a 400 ms endpoint, signal after 150 ms:</p>
<div class="out">$ bash B.sh
════ 10 request dang bay (moi cai 400ms), tin hieu sau 150ms — che do: KILL ════
  ma tra ve: 000 000 000 000 000 000 000 000 000 000
  socket con nghe cong 3107: 0
════ 10 request dang bay (moi cai 400ms), tin hieu sau 150ms — che do: none ════
  ma tra ve: 000 000 000 000 000 000 000 000 000 000
  socket con nghe cong 3107: 0
════ 10 request dang bay (moi cai 400ms), tin hieu sau 150ms — che do: co503 ════
  ma tra ve: 503 503 503 503 503 503 503 503 503 503
    [S] SIGTERM — thoi nhan ket noi moi, phuc vu not cai dang co
    [S] da dong sach sau 259ms
  socket con nghe cong 3107: 0
════ 10 request dang bay (moi cai 400ms), tin hieu sau 150ms — che do: tutu ════
  ma tra ve: 200 200 200 200 200 200 200 200 200 200
    [S] SIGTERM — thoi nhan ket noi moi, phuc vu not cai dang co
    [S] da dong sach sau 272ms
  socket con nghe cong 3107: 0</div>
${slide('dv-03', 8, 'Bốn cách dừng, cùng mười request đang bay')}
<div class="callout warn"><strong>No <code>process.on('SIGTERM')</code> means you get SIGKILL behaviour.</strong> The default action of <code>SIGTERM</code> is to terminate the process, and Node's default handler exits at once with code <code>128 + 15 = 143</code>. So <code>kill</code>, <code>systemctl stop</code> and <code>docker stop</code> are only "graceful" if your code makes them so — ten out of ten in-flight requests got no response either way.</div>
<h3>SIGTERM: catchable, and therefore useful</h3>
${slide('dv-03', 9, 'Bộ xử lý SIGTERM đúng: bốn phần')}
<pre><code>process.on('SIGTERM', () =&gt; {
  dang_dong = true;
  sv.close(() =&gt; { console.log('da dong sach'); process.exit(0); });
  setTimeout(() =&gt; { console.log('het gio, thoat cung'); process.exit(1); }, 10000);
});</code></pre>
<p><code>server.close()</code> in Node stops accepting new connections, keeps serving the ones already accepted, and runs its callback when the last one finishes. The <code>setTimeout</code> is the deadline: if something never finishes, exit anyway rather than hanging forever.</p>

<h3>And then the version I got wrong</h3>
${slide('dv-03', 10, 'Cờ xả đặt SAI chỗ: 10 cú 503')}
<p>The first implementation set a <code>dang_dong</code> flag and had the request handler check it. Same ten in-flight requests, same <code>SIGTERM</code>:</p>
<div class="out">════ SIGTERM, ban DAU ════
  ma tra ve cho 10 request dang bay: 503 503 503 503 503 503 503 503 503 503
    [G] SIGTERM — dang cho 10 request xong
    [G] da dong sach</div>
<div class="pitfall"><strong>Trap — a drain flag that the request handler consults will answer 503 to requests that were already in flight.</strong> The log says it correctly: it waited for all ten, and it closed cleanly. Every connection was honoured. And every user got an error page, because the handler checked the flag <em>after</em> the request had been accepted and answered <code>503</code> instead of the response it had already computed. From the client's side this is barely better than <code>SIGKILL</code> — it is a failed request either way, just with a status code attached. The bug is subtle enough that it survives review: the shutdown logic is correct, and the handler looks defensive rather than wrong.</div>

<h3>The fix, and the measurement that confirms it</h3>
<pre><code>const sv = http.createServer((req, res) =&gt; {
  <span class="tok-comment">// request DA VAO thi phuc vu TU TE toi cung.</span>
  <span class="tok-comment">// Chi bao client dung ket noi lai, khong tra loi loi.</span>
  setTimeout(() =&gt; {
    res.writeHead(200, {'x-ban': V, ...(dang_dong ? {'connection': 'close'} : {})});
    res.end(V + '\\n');
  }, tre);
});</code></pre>
<div class="out">════ ban DA SUA ════
  ma tra ve: 200 200 200 200 200 200 200 200 200 200
    [S] SIGTERM — thoi nhan ket noi moi, phuc vu not cai dang co
    [S] da dong sach
  --- cong 3107 con ai nghe khong? ---
    socket: 0</div>
<div class="callout ok"><strong>All ten answered 200, and the listening socket was gone immediately.</strong> Those two facts together are what graceful shutdown means: nothing new can arrive, because the socket is closed the moment <code>server.close()</code> is called — and everything already accepted is served to completion. The flag does not decide the <em>response</em>; it only adds <code>Connection: close</code>, which tells a client with a keepalive connection not to send another request down it.</div>

<h3>The parts a correct handler needs</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Stop accepting, immediately</span><span class="lz-d"><code>server.close()</code>, or your framework's equivalent. This is the part that must happen first, and it is instant — the measurement above shows the socket gone while requests were still being answered.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Finish what you accepted, unchanged</span><span class="lz-d">Answer with the response you would have given. Do not switch to an error, do not truncate, do not shorten a timeout. The user cannot tell a deploy is happening, which is the goal.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Close what is not a request</span><span class="lz-d">Database pools, message-queue consumers, cron timers, open file handles. A pool that is not drained leaves connections occupied on the database side until they time out — and Chapter 8 measures what happens when those add up.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Have a deadline, and exit non-zero when you hit it</span><span class="lz-d">A shutdown that hangs is worse than a fast one: the supervisor waits, the deploy waits, and eventually something sends <code>SIGKILL</code> anyway. Choosing your own deadline means you choose what gets abandoned.</span></div>
</div>
<div class="pitfall"><strong>Trap — something can keep a "drained" server alive, but on current Node it is not the idle keepalive connection.</strong> Before Node 19, <code>server.close()</code> also waited for idle keepalive connections — open, with nothing on them — and <code>server.closeIdleConnections()</code> (added in 18.2) was the fix. Node 19.0.0 made <code>close()</code> reap idle connections itself, and measured below, Ubuntu's Node 18.19.1 and Node 22.21.0 on a Mac both exited within 8 ms with an idle keepalive connection open. What still holds the process is a connection that has not become a request yet — a client that connected and sent nothing, or sent half a header — and neither <code>close()</code> nor <code>closeIdleConnections()</code> touches it: the measurement below ran to the 10-second deadline every time. <code>Connection: close</code> on the responses (above) stays the polite half of the story, telling keepalive clients not to send another request down a connection that is about to go. The deadline is what guarantees the process actually exits.</div>

<h3>What actually keeps a closing server alive, measured</h3>
<p>Four probes against the correct handler (a 10-second deadline), each with one extra connection open when <code>SIGTERM</code> arrives: an idle keepalive connection that already finished a request; the same on a Mac with Node 22; a TCP connection that sent nothing; one that sent half a request header; and the empty one again with <code>closeIdleConnections()</code> added:</p>
<div class="out">════ v18.19.1 · SIGTERM khi co 1 ket noi keepalive NHAN ROI ════
  [client] xong 1 request, giu ket noi nhan roi
  ket noi ESTAB toi 3107 truoc SIGTERM: 1
  thoat sau 8ms
# (Mac M1, Node v22.21.0 — cung phep do)
  [client] xong 1 request, giu ket noi nhan roi
  [S] SIGTERM — thoi nhan ket noi moi, phuc vu not cai dang co
  [S] da dong sach sau 1ms
════ v18.19.1 · SIGTERM khi co 1 ket noi TCP kieu 'trong' ════
  [client] ket noi TCP mo, kieu=trong
  [client] may chu dong ket noi
  tien trinh thoat sau 10057ms
    [S] het gio sau 10000ms, thoat cung
════ v18.19.1 · SIGTERM khi co 1 ket noi TCP kieu 'do' ════
  …
  tien trinh thoat sau 10029ms
    [S] het gio sau 10003ms, thoat cung
# (kieu 'trong', them sv.closeIdleConnections())
  …
  IDLE=1, TCP trong: thoat sau 10019ms</div>
${slide('dv-03', 11, 'Cái gì giữ tiến trình lại khi tắt? keepalive rỗi vs TCP chưa thành request')}
<table>
<tr><th>Connection open at SIGTERM</th><th>Does <code>close()</code> wait for it?</th><th>Measured</th></tr>
<tr><td>Idle keepalive (request already answered)</td><td>No — closed immediately (Node ≥ 19, and 18.19 as shipped by Ubuntu)</td><td>1–8 ms</td></tr>
<tr><td>A request still being processed</td><td>Yes — that is the point of draining</td><td>259–272 ms</td></tr>
<tr><td>TCP open, no complete request yet</td><td>Yes, until your deadline (or <code>server.closeAllConnections()</code>)</td><td>10,000 ms</td></tr>
</table>
<p>In practice the third row is a slow or misbehaving client, a load balancer's pre-opened connection, or a port scanner. It is exactly why the deadline in step 4 is not optional — and why the supervisor's own timeout (<code>TimeoutStopSec</code>, <code>stop_grace_period</code>) must be longer than it.</p>

<h3>Who sends the signal, and how long you get</h3>
${slide('dv-03', 12, 'Ai gửi tín hiệu, bạn được bao lâu')}
<table>
<tr><th>Signal</th><th>Number</th><th>Who sends it</th><th>Can your code catch it?</th></tr>
<tr><td><code>SIGTERM</code></td><td>15</td><td><code>kill PID</code>, <code>systemctl stop</code>, <code>docker stop</code></td><td>Yes — this is the "please stop" signal; without a handler Node exits at once with code 143</td></tr>
<tr><td><code>SIGINT</code></td><td>2</td><td>Ctrl+C in a terminal</td><td>Yes — handle it with the same function when you test locally</td></tr>
<tr><td><code>SIGHUP</code></td><td>1</td><td>the terminal closed; by convention "reload config" (Nginx)</td><td>Yes</td></tr>
<tr><td><code>SIGKILL</code></td><td>9</td><td><code>kill -9</code>, a supervisor after its timeout, the OOM killer</td><td>No — no code runs at all</td></tr>
</table>
<p><strong>On Windows it is different.</strong> Node's documentation says <code>'SIGTERM'</code> is not supported on Windows (it can be listened on but is never delivered), while <code>'SIGINT'</code> from Ctrl+C works everywhere. A teammate testing graceful shutdown on Windows should register the same handler for both, and test the real <code>SIGTERM</code> path inside WSL or on the lab VPS — that is where production runs.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">systemd</span><span class="v"><code>SIGTERM</code>, then <code>SIGKILL</code> after <code>TimeoutStopSec</code> — 90 seconds by default. Set it explicitly to slightly more than your own deadline, so your code decides rather than the supervisor.</span></div>
  <div class="kv"><span class="k">Docker</span><span class="v"><code>docker stop</code> sends <code>SIGTERM</code> and kills after 10 seconds. That default is short: a 30-second shutdown deadline inside a container is silently a 10-second one unless you pass <code>--time</code> or set <code>stop_grace_period</code>.</span></div>
  <div class="kv"><span class="k">A shell script</span><span class="v"><code>kill</code> sends <code>SIGTERM</code>. <code>kill -9</code> sends <code>SIGKILL</code> — and the measurement at the top of this lesson is what that does to users. It should appear in a deploy script only as a last resort after a timeout.</span></div>
  <div class="kv"><span class="k">Your process manager, in a container</span><span class="v">If PID 1 is a shell rather than your app, signals may not reach the app at all. This is the classic <code>docker stop</code> takes exactly ten seconds every time symptom, and the fix is <code>exec</code> in the entrypoint or an init that forwards signals.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a payment callback takes about 400 ms. After every deploy, a few customers are charged but the shop never records the order — the request was in flight when the old process died. Prove it, then fix it.</p>
<ol>
<li>On the lab VPS, write an app with a <code>/cham</code> route that answers after 400 ms. Fire ten requests at once: <code>for i in $(seq 1 10); do curl -s -o /dev/null -w '%{http_code} ' http://127.0.0.1:3107/cham &amp; done; wait</code>, and 150 ms in, send <code>kill -9</code>.</li>
<li>Repeat with plain <code>kill</code> (SIGTERM) and no handler.</li>
<li>Add the four-part handler from this lesson (<code>close()</code>, serve unchanged, close pools, a <code>setTimeout(...).unref()</code> deadline) and repeat with <code>kill</code>.</li>
<li>While the ten requests are running, check <code>ss -ltn | grep 3107</code> to confirm the listening socket is already gone.</li>
</ol>
<p><strong>Done when:</strong> you have three lines of output — <code>000 ×10</code>, <code>000 ×10</code>, <code>200 ×10</code> — and the log of the last run says it closed cleanly in well under the deadline.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Signal</span><span class="v">A small numbered message the kernel delivers to a process; <code>SIGTERM</code> asks, <code>SIGKILL</code> ends.</span></div>
  <div class="kv"><span class="k">Graceful shutdown</span><span class="v">Stop accepting at once, finish what was accepted unchanged, close resources, exit before a deadline.</span></div>
  <div class="kv"><span class="k">Drain</span><span class="v">The waiting part of graceful shutdown: letting in-flight requests complete.</span></div>
  <div class="kv"><span class="k">In-flight request</span><span class="v">A request the server has accepted but not yet answered.</span></div>
  <div class="kv"><span class="k">Keepalive connection</span><span class="v">A TCP connection reused for several HTTP requests; idle between them.</span></div>
  <div class="kv"><span class="k">Deadline (shutdown timeout)</span><span class="v">The time after which your own code gives up waiting and exits non-zero.</span></div>
  <div class="kv"><span class="k">Exit code 143</span><span class="v">128 + 15: the process ended because of <code>SIGTERM</code> without handling it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>SIGKILL</code> and an unhandled <code>SIGTERM</code> did the same thing: ten in-flight requests, ten <code>000</code>s.</li>
<li><code>server.close()</code> closes the listening socket immediately and lets accepted requests finish.</li>
<li>A shutdown flag must never change the response of an accepted request — only add <code>Connection: close</code>.</li>
<li>Idle keepalive connections no longer block <code>close()</code>; a connection that is not yet a request does, until the deadline.</li>
<li>Always have your own deadline and set the supervisor's timeout slightly above it.</li>
<li>Windows does not deliver <code>SIGTERM</code>; handle <code>SIGINT</code> too and test the real path on Linux.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — server.close() and closeIdleConnections()</span><span class="lc-sub">nodejs.org/api/http.html#serverclosecallback — the exact semantics: stops accepting, waits for existing connections, and what counts as existing.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">signal(7)</span><span class="lc-sub">man7.org/linux/man-pages/man7/signal.7.html — the table showing which signals can be caught, and the sentence saying SIGKILL cannot.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.service(5) — TimeoutStopSec, KillSignal</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.service.html — how long your process actually gets, and how to change it.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — PID 1, signal forwarding and stop_grace_period</span><span class="lc-sub">/courses/docker/learn${REF} — why a container can appear to ignore SIGTERM entirely, and the two ways to fix it.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Tắt tử tế, và cái bước xả tôi viết sai</h2>
<p class="lead">Bước 4 của cách sửa là DỪNG bản cũ. Nó trông như bước dễ. Nó lại là bước mà một cách cài đặt nghe rất hợp lý lại sinh ra ĐÚNG cái kết cục bạn đang cố tránh — đo ngay dưới đây, trong đoạn mã do chính tôi viết cho bài này.</p>

<h3>SIGKILL: mốc đối chiếu</h3>
<p>Mười request đang bay, mỗi cái mất 400 ms, và tiến trình bị giết bằng <code>SIGKILL</code> sau 150 ms:</p>
<div class="out">════ SIGKILL ════
  ma tra ve: 000 000 000 000 RỚT RỚT 000 000 000 000 000 RỚT RỚT 000 RỚT ...</div>
<p><code>000</code> là mã của curl cho "không có phản hồi HTTP nào cả". Kết nối đang mở, máy chủ sắp trả lời, và tiến trình thôi tồn tại. Không có gì được ghi ra, không có gì vào log, và client KHÔNG phân biệt được chuyện này với chuyện máy chủ chưa từng nhận được request — điều đó rất quan trọng khi cái request đó là một giao dịch thanh toán.</p>
<div class="note-ct"><code>SIGKILL</code> không thể bắt, không thể chặn, không thể xử lý. Tiến trình KHÔNG được chạy lấy một dòng mã nào — không xả bộ đệm, không đóng, không một dòng log. Đó chính là mục đích của nó, và đó là lý do nó là công cụ SAI cho một lần deploy. Nó chỉ đúng cho một tiến trình đã TỪ CHỐI dừng lại.</div>


<h3>Đo lại: bốn cách dừng, và "không có bộ xử lý" chính là SIGKILL</h3>
<p>VPS thí nghiệm làm lại thí nghiệm, thêm một trường hợp mà phần lớn những lần deploy đầu tiên thật sự gặp: gửi <code>SIGTERM</code> cho một ứng dụng CHƯA từng đăng ký bộ xử lý nào. Mười request vào một endpoint mất 400 ms, tín hiệu gửi sau 150 ms:</p>
<div class="out">$ bash B.sh
════ 10 request dang bay (moi cai 400ms), tin hieu sau 150ms — che do: KILL ════
  ma tra ve: 000 000 000 000 000 000 000 000 000 000
  socket con nghe cong 3107: 0
════ 10 request dang bay (moi cai 400ms), tin hieu sau 150ms — che do: none ════
  ma tra ve: 000 000 000 000 000 000 000 000 000 000
  socket con nghe cong 3107: 0
════ 10 request dang bay (moi cai 400ms), tin hieu sau 150ms — che do: co503 ════
  ma tra ve: 503 503 503 503 503 503 503 503 503 503
    [S] SIGTERM — thoi nhan ket noi moi, phuc vu not cai dang co
    [S] da dong sach sau 259ms
  socket con nghe cong 3107: 0
════ 10 request dang bay (moi cai 400ms), tin hieu sau 150ms — che do: tutu ════
  ma tra ve: 200 200 200 200 200 200 200 200 200 200
    [S] SIGTERM — thoi nhan ket noi moi, phuc vu not cai dang co
    [S] da dong sach sau 272ms
  socket con nghe cong 3107: 0</div>
${slide('dv-03', 8, 'Bốn cách dừng, cùng mười request đang bay')}
<div class="callout warn"><strong>Không có <code>process.on('SIGTERM')</code> nghĩa là bạn nhận hành vi của SIGKILL.</strong> Hành động mặc định của <code>SIGTERM</code> là kết thúc tiến trình, và bộ xử lý mặc định của Node thoát NGAY với mã <code>128 + 15 = 143</code>. Nên <code>kill</code>, <code>systemctl stop</code> hay <code>docker stop</code> chỉ "tử tế" khi mã của BẠN làm cho nó tử tế — đằng nào thì mười trên mười request đang bay cũng không nhận được phản hồi nào.</div>
<h3>SIGTERM: bắt được, nên dùng được</h3>
${slide('dv-03', 9, 'Bộ xử lý SIGTERM đúng: bốn phần')}
<pre><code>process.on('SIGTERM', () =&gt; {
  dang_dong = true;
  sv.close(() =&gt; { console.log('da dong sach'); process.exit(0); });
  setTimeout(() =&gt; { console.log('het gio, thoat cung'); process.exit(1); }, 10000);
});</code></pre>
<p><code>server.close()</code> trong Node thôi nhận kết nối mới, vẫn phục vụ những cái đã nhận, và chạy callback của nó khi cái cuối cùng xong. Cái <code>setTimeout</code> là HẠN CHÓT: nếu có thứ gì đó không bao giờ xong thì cứ thoát, còn hơn treo mãi mãi.</p>

<h3>Và rồi bản tôi viết SAI</h3>
${slide('dv-03', 10, 'Cờ xả đặt SAI chỗ: 10 cú 503')}
<p>Bản cài đặt đầu tiên đặt một cờ <code>dang_dong</code> rồi để bộ xử lý request kiểm cái cờ đó. Vẫn mười request đang bay ấy, vẫn <code>SIGTERM</code> ấy:</p>
<div class="out">════ SIGTERM, ban DAU ════
  ma tra ve cho 10 request dang bay: 503 503 503 503 503 503 503 503 503 503
    [G] SIGTERM — dang cho 10 request xong
    [G] da dong sach</div>
<div class="pitfall"><strong>Bẫy — một cái cờ xả mà bộ xử lý request đi kiểm sẽ trả 503 cho những request VỐN ĐÃ đang bay.</strong> Dòng log nói đúng: nó đã chờ đủ mười cái, và nó đã đóng sạch. Mọi kết nối đều được tôn trọng. Và MỌI người dùng đều nhận một trang lỗi, vì bộ xử lý kiểm cái cờ SAU KHI request đã được nhận rồi trả <code>503</code> thay vì cái phản hồi mà nó vốn đã tính xong. Từ phía client thì chuyện này chỉ nhỉnh hơn <code>SIGKILL</code> một chút — đằng nào cũng là một request hỏng, chỉ khác là có kèm một mã trạng thái. Cái lỗi này tinh vi đủ để sống sót qua một buổi review mã: phần logic tắt thì đúng, còn bộ xử lý thì trông như đang PHÒNG THỦ chứ không như đang sai.</div>

<h3>Cách sửa, và phép đo xác nhận nó</h3>
<pre><code>const sv = http.createServer((req, res) =&gt; {
  <span class="tok-comment">// request DA VAO thi phuc vu TU TE toi cung.</span>
  <span class="tok-comment">// Chi bao client dung ket noi lai, khong tra loi loi.</span>
  setTimeout(() =&gt; {
    res.writeHead(200, {'x-ban': V, ...(dang_dong ? {'connection': 'close'} : {})});
    res.end(V + '\\n');
  }, tre);
});</code></pre>
<div class="out">════ ban DA SUA ════
  ma tra ve: 200 200 200 200 200 200 200 200 200 200
    [S] SIGTERM — thoi nhan ket noi moi, phuc vu not cai dang co
    [S] da dong sach
  --- cong 3107 con ai nghe khong? ---
    socket: 0</div>
<div class="callout ok"><strong>Cả mười cái đều trả 200, và cái socket đang lắng nghe biến mất NGAY.</strong> Hai sự thật đó gộp lại chính là nghĩa của "tắt tử tế": không có gì MỚI vào được nữa, vì socket đóng ngay khoảnh khắc <code>server.close()</code> được gọi — và mọi thứ ĐÃ nhận thì được phục vụ tới cùng. Cái cờ KHÔNG quyết định nội dung <em>PHẢN HỒI</em>; nó chỉ thêm <code>Connection: close</code>, thứ bảo một client đang giữ kết nối keepalive rằng đừng gửi request nữa xuống cái kết nối đó.</div>

<h3>Những phần mà một bộ xử lý ĐÚNG cần có</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">THÔI NHẬN, ngay lập tức</span><span class="lz-d"><code>server.close()</code>, hoặc lệnh tương đương của framework bạn dùng. Đây là phần PHẢI xảy ra trước tiên, và nó tức thì — phép đo ở trên cho thấy socket đã biến mất trong khi các request vẫn đang được trả lời.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Làm nốt thứ bạn đã nhận, KHÔNG đổi gì</span><span class="lz-d">Trả lời bằng đúng cái phản hồi bạn vốn sẽ đưa. Đừng đổi sang một lỗi, đừng cắt ngắn, đừng rút ngắn timeout. Người dùng KHÔNG nhận ra là đang có một lần deploy, và đó mới là mục tiêu.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đóng những thứ KHÔNG phải request</span><span class="lz-d">Bể kết nối cơ sở dữ liệu, bộ tiêu thụ hàng đợi tin nhắn, đồng hồ cron, mô tả tệp đang mở. Một cái bể không được xả để lại những kết nối chiếm chỗ ở phía cơ sở dữ liệu cho tới khi chúng hết giờ — và Chương 8 đo chuyện gì xảy ra khi đám đó cộng dồn lại.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Có HẠN CHÓT, và thoát ra khác 0 khi chạm nó</span><span class="lz-d">Một lần tắt bị treo còn tệ hơn một lần tắt nhanh: trình giám sát chờ, lần deploy chờ, và rốt cuộc vẫn có thứ gì đó gửi <code>SIGKILL</code>. Tự chọn hạn chót của mình nghĩa là BẠN chọn cái gì bị bỏ rơi.</span></div>
</div>
<div class="pitfall"><strong>Bẫy — có thứ giữ cho một máy chủ "đã xả" tiếp tục sống, nhưng trên Node hiện nay thứ đó KHÔNG phải kết nối keepalive nhàn rỗi.</strong> Trước Node 19, <code>server.close()</code> chờ cả những kết nối keepalive nhàn rỗi — đang mở, chẳng có gì trên đó — và <code>server.closeIdleConnections()</code> (thêm vào từ 18.2) là cách chữa. Node 19.0.0 cho <code>close()</code> tự dọn kết nối nhàn rỗi, và đo ở dưới: Node 18.19.1 của Ubuntu lẫn Node 22.21.0 trên Mac đều thoát trong vòng 8 ms dù đang có một kết nối keepalive nhàn rỗi. Thứ VẪN giữ được tiến trình là một kết nối CHƯA thành request — một client kết nối xong rồi không gửi gì, hoặc gửi được nửa cái header — và cả <code>close()</code> lẫn <code>closeIdleConnections()</code> đều không đụng tới nó: phép đo ở dưới lần nào cũng chạy tới đúng hạn chót 10 giây. <code>Connection: close</code> trên các phản hồi (ở trên) vẫn là nửa lịch sự của câu chuyện, bảo client keepalive đừng gửi thêm request vào một kết nối sắp biến mất. Còn thứ ĐẢM BẢO tiến trình thật sự thoát là cái hạn chót.</div>

<h3>Thứ thật sự giữ một máy chủ đang tắt, đo thật</h3>
<p>Bốn phép thử vào bộ xử lý ĐÚNG (hạn chót 10 giây), mỗi phép có thêm một kết nối đang mở lúc <code>SIGTERM</code> tới: một kết nối keepalive nhàn rỗi đã xong một request; cùng thứ đó trên Mac với Node 22; một kết nối TCP không gửi gì; một kết nối gửi được nửa header; và lại cái kết nối trống kia nhưng có gọi thêm <code>closeIdleConnections()</code>:</p>
<div class="out">════ v18.19.1 · SIGTERM khi co 1 ket noi keepalive NHAN ROI ════
  [client] xong 1 request, giu ket noi nhan roi
  ket noi ESTAB toi 3107 truoc SIGTERM: 1
  thoat sau 8ms
# (Mac M1, Node v22.21.0 — cung phep do)
  [client] xong 1 request, giu ket noi nhan roi
  [S] SIGTERM — thoi nhan ket noi moi, phuc vu not cai dang co
  [S] da dong sach sau 1ms
════ v18.19.1 · SIGTERM khi co 1 ket noi TCP kieu 'trong' ════
  [client] ket noi TCP mo, kieu=trong
  [client] may chu dong ket noi
  tien trinh thoat sau 10057ms
    [S] het gio sau 10000ms, thoat cung
════ v18.19.1 · SIGTERM khi co 1 ket noi TCP kieu 'do' ════
  …
  tien trinh thoat sau 10029ms
    [S] het gio sau 10003ms, thoat cung
# (kieu 'trong', them sv.closeIdleConnections())
  …
  IDLE=1, TCP trong: thoat sau 10019ms</div>
${slide('dv-03', 11, 'Cái gì giữ tiến trình lại khi tắt? keepalive rỗi vs TCP chưa thành request')}
<table>
<tr><th>Kết nối đang mở lúc SIGTERM</th><th><code>close()</code> có chờ nó?</th><th>Đo được</th></tr>
<tr><td>Keepalive nhàn rỗi (request đã trả lời xong)</td><td>Không — đóng ngay (Node ≥ 19, và bản 18.19 Ubuntu phát hành)</td><td>1–8 ms</td></tr>
<tr><td>Một request vẫn đang xử lý</td><td>Có — đó chính là mục đích của việc xả</td><td>259–272 ms</td></tr>
<tr><td>TCP mở, chưa có request trọn vẹn</td><td>Có, tới hạn chót của bạn (hoặc <code>server.closeAllConnections()</code>)</td><td>10.000 ms</td></tr>
</table>
<p>Ngoài đời, hàng thứ ba là một client chậm hay cư xử lạ, một kết nối bộ cân bằng tải mở sẵn, hoặc một con quét cổng. Đó chính là lý do hạn chót ở bước 4 KHÔNG phải tuỳ chọn — và vì sao timeout của trình giám sát (<code>TimeoutStopSec</code>, <code>stop_grace_period</code>) phải DÀI hơn nó.</p>

<h3>Ai gửi tín hiệu, và bạn được bao nhiêu thời gian</h3>
${slide('dv-03', 12, 'Ai gửi tín hiệu, bạn được bao lâu')}
<table>
<tr><th>Tín hiệu</th><th>Số</th><th>Ai gửi</th><th>Mã của bạn bắt được không?</th></tr>
<tr><td><code>SIGTERM</code></td><td>15</td><td><code>kill PID</code>, <code>systemctl stop</code>, <code>docker stop</code></td><td>Được — đây là tín hiệu "xin hãy dừng"; không có bộ xử lý thì Node thoát ngay với mã 143</td></tr>
<tr><td><code>SIGINT</code></td><td>2</td><td>Ctrl+C trong terminal</td><td>Được — dùng CÙNG hàm xử lý khi bạn thử ở máy mình</td></tr>
<tr><td><code>SIGHUP</code></td><td>1</td><td>terminal bị đóng; theo quy ước là "nạp lại cấu hình" (nginx)</td><td>Được</td></tr>
<tr><td><code>SIGKILL</code></td><td>9</td><td><code>kill -9</code>, trình giám sát sau khi hết giờ, bộ giết-khi-hết-RAM (OOM killer)</td><td>Không — không một dòng mã nào được chạy</td></tr>
</table>
<p><strong>Trên Windows thì khác.</strong> Tài liệu Node ghi <code>'SIGTERM'</code> không được hỗ trợ trên Windows (đăng ký lắng nghe được nhưng không bao giờ được gửi tới), còn <code>'SIGINT'</code> từ Ctrl+C thì chạy ở mọi nơi. Bạn cùng nhóm thử tắt tử tế trên Windows nên đăng ký cùng một hàm cho cả hai, và thử đường <code>SIGTERM</code> thật trong WSL hoặc trên VPS thí nghiệm — production chạy ở đó.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">systemd</span><span class="v"><code>SIGTERM</code>, rồi <code>SIGKILL</code> sau <code>TimeoutStopSec</code> — mặc định 90 giây. Hãy đặt nó tường minh, nhỉnh hơn hạn chót của chính bạn một chút, để MÃ CỦA BẠN quyết định chứ không phải trình giám sát.</span></div>
  <div class="kv"><span class="k">Docker</span><span class="v"><code>docker stop</code> gửi <code>SIGTERM</code> rồi giết sau 10 giây. Mặc định đó NGẮN: một hạn chót tắt 30 giây bên trong container thì âm thầm chỉ còn 10 giây, trừ khi bạn truyền <code>--time</code> hoặc đặt <code>stop_grace_period</code>.</span></div>
  <div class="kv"><span class="k">Một script shell</span><span class="v"><code>kill</code> gửi <code>SIGTERM</code>. <code>kill -9</code> gửi <code>SIGKILL</code> — và phép đo ở đầu bài này chính là thứ nó gây ra cho người dùng. Nó chỉ nên xuất hiện trong một script deploy như phương án CUỐI CÙNG sau khi đã hết giờ.</span></div>
  <div class="kv"><span class="k">Trình quản lý tiến trình của bạn, khi ở trong container</span><span class="v">Nếu PID 1 là một cái shell chứ không phải ứng dụng của bạn thì tín hiệu có thể KHÔNG tới được ứng dụng. Đây là triệu chứng kinh điển "docker stop lần nào cũng mất đúng mười giây", và cách sửa là dùng <code>exec</code> trong entrypoint hoặc một init biết chuyển tiếp tín hiệu.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một callback thanh toán mất khoảng 400 ms. Sau mỗi lần deploy, vài khách bị trừ tiền mà cửa hàng không ghi nhận đơn — request đang bay đúng lúc tiến trình cũ chết. Chứng minh điều đó, rồi sửa nó.</p>
<ol>
<li>Trên VPS thí nghiệm, viết một app có route <code>/cham</code> trả lời sau 400 ms. Bắn mười request cùng lúc: <code>for i in $(seq 1 10); do curl -s -o /dev/null -w '%{http_code} ' http://127.0.0.1:3107/cham &amp; done; wait</code>, và 150 ms sau gửi <code>kill -9</code>.</li>
<li>Làm lại với <code>kill</code> trơn (SIGTERM) và KHÔNG có bộ xử lý.</li>
<li>Thêm bộ xử lý bốn phần của bài này (<code>close()</code>, phục vụ nguyên vẹn, đóng pool, hạn chót <code>setTimeout(...).unref()</code>) rồi làm lại với <code>kill</code>.</li>
<li>Trong lúc mười request đang chạy, kiểm <code>ss -ltn | grep 3107</code> để thấy socket lắng nghe ĐÃ biến mất.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có ba dòng output — <code>000 ×10</code>, <code>000 ×10</code>, <code>200 ×10</code> — và log của lần cuối nói đã đóng sạch, nhanh hơn hạn chót rất nhiều.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Signal (tín hiệu)</span><span class="v">Một thông điệp nhỏ có đánh số mà nhân hệ điều hành gửi cho tiến trình; <code>SIGTERM</code> xin, <code>SIGKILL</code> kết thúc.</span></div>
  <div class="kv"><span class="k">Graceful shutdown (tắt tử tế)</span><span class="v">Thôi nhận ngay, làm nốt thứ đã nhận mà không đổi gì, đóng tài nguyên, thoát trước hạn chót.</span></div>
  <div class="kv"><span class="k">Drain (xả)</span><span class="v">Phần CHỜ của tắt tử tế: để các request đang bay làm xong.</span></div>
  <div class="kv"><span class="k">In-flight request (request đang bay)</span><span class="v">Request máy chủ đã nhận mà chưa trả lời.</span></div>
  <div class="kv"><span class="k">Keepalive connection (kết nối giữ sống)</span><span class="v">Một kết nối TCP dùng lại cho nhiều request HTTP; nhàn rỗi giữa các lần.</span></div>
  <div class="kv"><span class="k">Deadline (hạn chót khi tắt)</span><span class="v">Mốc thời gian mà chính mã của bạn thôi chờ và thoát với mã khác 0.</span></div>
  <div class="kv"><span class="k">Exit code 143 (mã thoát 143)</span><span class="v">128 + 15: tiến trình kết thúc vì <code>SIGTERM</code> mà không xử lý nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>SIGKILL</code> và một <code>SIGTERM</code> không được xử lý làm cùng một việc: mười request đang bay, mười cú <code>000</code>.</li>
<li><code>server.close()</code> đóng socket lắng nghe ngay lập tức và để các request đã nhận làm xong.</li>
<li>Cờ đang-tắt KHÔNG BAO GIỜ được đổi phản hồi của request đã nhận — chỉ thêm <code>Connection: close</code>.</li>
<li>Kết nối keepalive nhàn rỗi không còn chặn <code>close()</code>; một kết nối chưa thành request thì chặn, tới hạn chót.</li>
<li>Luôn có hạn chót của riêng bạn, và đặt timeout của trình giám sát nhỉnh hơn nó.</li>
<li>Windows không gửi <code>SIGTERM</code>; xử lý cả <code>SIGINT</code> và thử đường thật trên Linux.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — server.close() và closeIdleConnections()</span><span class="lc-sub">nodejs.org/api/http.html#serverclosecallback — ngữ nghĩa chính xác: thôi nhận, chờ các kết nối đang có, và cái gì được tính là "đang có".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">signal(7)</span><span class="lc-sub">man7.org/linux/man-pages/man7/signal.7.html — cái bảng liệt kê tín hiệu nào bắt được, và câu nói rằng SIGKILL thì không.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.service(5) — TimeoutStopSec, KillSignal</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.service.html — tiến trình của bạn THẬT SỰ được bao lâu, và đổi nó thế nào.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — PID 1, chuyển tiếp tín hiệu và stop_grace_period</span><span class="lc-sub">/courses/docker/learn${REF} — vì sao một container trông như đang phớt lờ hoàn toàn SIGTERM, và hai cách sửa.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.3 ─────────────────────────── */
    {
      title: '3.3 — Blue-green: the same deploy, zero failures|||3.3 — Xanh-lam: cùng lần deploy đó, không cái nào hỏng',
      slug: 'deploy-3-3-xanh-lam',
      type: 'LESSON',
      description: 'Cùng ứng dụng khởi động 1,5 giây, cùng lần deploy, chỉ đổi THỨ TỰ bốn bước: 733 request, 0 lỗi. Kèm một ngõ cụt đo thật — SO_REUSEPORT nhận cờ nhưng không chạy trên Node của máy chủ này.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Blue-green: the same deploy, zero failures</h2>
<p class="lead">Lesson 3.1 measured 168 failures out of 514. This lesson runs the identical deploy — same application, same 1.5-second startup, same client hammering it — with the four steps in the right order.</p>

<h3>The result first</h3>
${slide('dv-03', 15, 'Cùng lần deploy, đổi thứ tự: 0 lỗi (đo lại 29/09)')}
<div class="out">════ B) TRIEN KHAI XANH-LAM ════
  ban B san sang sau 1500ms
  da chuyen upstream sang 3102
  da gui SIGTERM cho ban A
  200: 733   loi ket noi: 0   ma khac: 0
  phan bo ban: {'A': 207, 'B': 526}</div>
<p>Seven hundred and thirty-three requests, none failed, and the version distribution shows the handover: A answered 207, B answered 526, and there is no gap between them. The 168 failures are gone, and nothing about the application changed — it still takes 1.5 seconds to start.</p>

<h3>The arrangement</h3>
${slide('dv-03', 13, 'Xanh/lam: cổng cố định thuộc về proxy')}
${slide('dv-03', 14, 'upstream.conf: tệp duy nhất lần deploy sửa + bảng chỉ thị')}
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Before</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">client → :3200</span><span class="lz-nsub">Nginx, on a fixed port — the only thing the outside world knows about.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">upstream → :3101</span><span class="lz-nsub">Version A, serving.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">:3102</span><span class="lz-nsub">Empty.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">After</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">client → :3200</span><span class="lz-nsub">Unchanged. The client never learns anything happened.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">upstream → :3102</span><span class="lz-nsub">Version B, which took no traffic until it passed its check.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">:3101</span><span class="lz-nsub">Version A, draining and then exiting.</span></div></div>
  </div>
</div>
<p>The fixed port belongs to the proxy, and the application moves between two ports behind it. Nothing outside the machine ever sees the change.</p>
<pre><code><span class="tok-comment"># upstream.conf — tep DUY NHAT ma lan deploy sua</span>
upstream ungdung { server 127.0.0.1:3101; keepalive 16; }

<span class="tok-comment"># nginx.conf — khong bao gio doi</span>
server {
    listen 80;
    location / {
        proxy_pass http://ungdung;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_next_upstream error timeout http_502 http_503;
    }
}</code></pre>
<div class="note-ct"><code>proxy_next_upstream</code> is the safety net: if the chosen backend refuses a connection or returns 502/503, Nginx retries the request against another server in the pool rather than passing the failure to the client. With one server in the pool it does little; with the old and new both listed during the transition it covers the seam entirely.</div>

<h3>The deploy, in four steps</h3>
<pre><code>set -euo pipefail
CU=3101; MOI=3102

<span class="tok-comment"># 1. khoi dong ban moi — ban cu VAN dang phuc vu</span>
V=B CONG=\$MOI setsid nohup node app.mjs &gt;/var/log/app-b.log 2&gt;&amp;1 &lt;/dev/null &amp;

<span class="tok-comment"># 2. CHO toi khi no THAT SU tra loi — khong phai sleep</span>
for i in \$(seq 1 40); do
  [ "\$(curl -s -o /dev/null -w '%{http_code}' --max-time 1 \\
        http://127.0.0.1:\$MOI/health)" = "200" ] &amp;&amp; break
  sleep 0.1
  [ "\$i" = "40" ] &amp;&amp; { echo "ban moi khong len duoc sau 4s" &gt;&amp;2; exit 1; }
done

<span class="tok-comment"># 3. chuyen luu luong — mot thao tac nguyen tu</span>
echo "upstream ungdung { server 127.0.0.1:\$MOI; keepalive 16; }" &gt; upstream.conf
nginx -t &amp;&amp; nginx -s reload

<span class="tok-comment"># 4. gio moi dung ban cu, TU TE</span>
sleep 2
kill -TERM "\$(ss -ltnp | grep \":\$CU \" | grep -o 'pid=[0-9]*' | cut -d= -f2)"</code></pre>
<div class="callout ok"><strong>Step 2 is the one that earns the zero.</strong> The measurement printed <code>ban B san sang sau 1500ms</code> — the loop polled until the new version genuinely answered, which took exactly as long as its startup. Replacing that loop with <code>sleep 1</code> would have switched traffic to a process that was not ready yet, and the failures would come back in a different shape: 502s from Nginx instead of connection refusals. Replacing it with <code>sleep 10</code> would work and make every deploy eight seconds slower for no reason.</div>
<div class="pitfall"><strong>Trap — the <code>sleep 2</code> in step 4 is not decoration, and it is also not enough.</strong> Nginx finishes its reload asynchronously: old worker processes keep serving their in-flight requests while new workers take new ones. Killing the old application immediately after <code>reload</code> can cut off a request that an old worker is still proxying. Two seconds covers a fast application; the honest version waits until the old backend reports zero in-flight requests, or simply waits longer than your slowest request. This is the same seam as Lesson 3.2, one layer out.</div>


<h3>Measured again on the lab VPS</h3>
<p>The same arrangement rebuilt on the lab VPS (Nginx 1.24 on port 80, an <code>include</code>d <code>upstream.conf</code>, the app taking 1.5 s to start) gave the same answer as the original measurement — no failures at all, and the handover visible in the version split:</p>
<div class="out">════ B) XANH/LAM sau nginx ════
  +1028ms  1. khoi dong B tren 3102
  +2699ms  2. B /health 200 (cho 1669 ms)
  +2708ms  3. upstream → 3102, reload
  +3716ms  4. SIGTERM A
  tong: 494   200: 494
  phan bo ban: {"A":239,"B":255}</div>
<p>The directives doing the work, one line each:</p>
<table>
<tr><th>Directive</th><th>What it does</th></tr>
<tr><td><code>upstream NAME { server …; }</code></td><td>A named pool of backends; <code>proxy_pass http://NAME</code> sends to it.</td></tr>
<tr><td><code>server … backup</code></td><td>Receives traffic only when the non-backup servers are unavailable.</td></tr>
<tr><td><code>keepalive N</code></td><td>Keep up to N idle connections to the pool open in each worker process.</td></tr>
<tr><td><code>proxy_http_version 1.1</code> + <code>proxy_set_header Connection ""</code></td><td>Required for upstream keepalive: HTTP/1.0 and a forwarded <code>Connection: close</code> would close every connection.</td></tr>
<tr><td><code>proxy_next_upstream</code></td><td>Which failures are retried on the next server of the pool; the default is <code>error timeout</code>.</td></tr>
<tr><td><code>max_fails</code> / <code>fail_timeout</code></td><td>How many failures mark a server unavailable, and for how long.</td></tr>
<tr><td><code>nginx -t</code>, then <code>nginx -s reload</code></td><td>Check the syntax, then start new workers with the new config while old workers finish their requests.</td></tr>
</table>

<h3>Guessing with <code>sleep</code>, measured</h3>
<p>The callout above predicts what happens if step 2 is replaced by a guess. Both shapes were measured — once with an app that is not listening yet after one second, once with an app that listens immediately but needs 1.5 s to warm up and answers 500 until then:</p>
<div class="out">════ C2-sleep1-chua-nghe ════
  +1009ms  1. khoi dong B tren 3102 — A van phuc vu
  +2018ms  2. sleep 1 (khong kiem)
  +2028ms  3. upstream → 3102, nginx -s reload
  +3040ms  4. kill -TERM ban A
  tong: 455   200: 421   502: 34
  cua so hong: tu 2134ms den 2601ms (467ms)
════ C3-sleep1-nghe-nhung-lanh ════
  +1016ms  1. khoi dong B tren 3102 — A van phuc vu
  +2044ms  2. sleep 1 (khong kiem)
  +2055ms  3. upstream → 3102, nginx -s reload
  +3066ms  4. kill -TERM ban A
  tong: 447   200: 414   500: 33
  cua so hong: tu 2176ms den 2612ms (436ms)</div>
<p>34 × 502 and 33 × 500, from two apps whose only difference is <em>when</em> they open the port. Window 3 from Lesson 3.1 is the second run: to Nginx and to <code>ss -ltn</code> the port is open and everything looks healthy. Only the application's own <code>/health</code>, answering 200 when it is actually ready, can tell the script the truth.</p>

<h3>How long is long enough after the reload, measured</h3>
<p>The pitfall above says the <code>sleep 2</code> before stopping the old version is "not decoration". Here it is swept on the lab VPS, with slow 300 ms requests so plenty are in flight, three runs per value:</p>
<div class="out">$ bash C8.sh      # request 300 ms; SIGTERM ban cu sau X giay; moi muc do 3 lan
  cho 0 s sau reload roi SIGTERM ban cu → so 502 qua 3 lan: 9 8 9
  cho 0.05 s sau reload roi SIGTERM ban cu → so 502 qua 3 lan: 4 5 4
  cho 0.1 s sau reload roi SIGTERM ban cu → so 502 qua 3 lan: 0 0 1
  cho 0.3 s sau reload roi SIGTERM ban cu → so 502 qua 3 lan: 0 0 0
  cho 1 s sau reload roi SIGTERM ban cu → so 502 qua 3 lan: 0 0 0
$ ps -eo pid,etimes,args | grep '[n]ginx:'      # ~20 ms sau nginx -s reload
     92     331 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
   3216       0 nginx: worker process is shutting down
   3217       0 nginx: worker process is shutting down
   …
   3270       0 nginx: worker process
   3271       0 nginx: worker process
   …</div>
${slide('dv-03', 16, 'Dừng bản cũ ngay sau reload: vẫn rơi — bảng 0 → 1 giây')}
<div class="callout warn"><strong><code>nginx -s reload</code> returns before the switch has finished.</strong> It only signals the master process. The master starts new workers with the new config and tells the old ones to shut down gracefully — and for a few tens of milliseconds, old workers are still passing requests to the old backend. Stop that backend inside that window and Nginx gets a refusal and answers 502: nine of them with no pause at all, zero from 0.3 s on, on this machine. The script uses a full second because it costs nothing and leaves room for a slower server; the honest rule is to measure yours with the request loop from Lesson 3.1.</div>

<h3>When the upstream is a hostname: Nginx resolves it once</h3>
<p>Writing <code>server app:3101;</code> instead of an IP address is normal — and in Docker Compose it is the only sane option, because container IPs change. What changes with it is <em>when</em> the name is looked up. The lab VPS pointed <code>ungdung-may</code> at 127.0.0.2 in <code>/etc/hosts</code>, started version A there, then started version B on 127.0.0.3 and changed <code>/etc/hosts</code> — the equivalent of recreating a container, which gets a new IP — and stopped A:</p>
<div class="out">════ F) upstream theo TEN may; ban moi o IP moi (nhu container tao lai) ════
  +1531ms  B chay o 127.0.0.3:3101
  +1546ms  ungdung-may → 127.0.0.3 (127.0.0.3)
  +1554ms  SIGTERM ban A (127.0.0.2)
  +4558ms  nginx -s reload
  tong: 544   200: 304   502: 240
  phan bo ban: {"A":128,"B":176}
  cua so hong: tu 1562ms den 4662ms (3100ms)
$ sudo grep 'connect() failed' /var/log/nginx/error.log | tail -1
… connect() failed (111: Connection refused) while connecting to upstream, client: 127.0.0.1, server: , request: "GET / HTTP/1.1", upstream: "http://127.0.0.2:3101/", host: "127.0.0.1"</div>
${slide('dv-03', 17, 'nginx phân giải tên máy MỘT lần, lúc nạp')}
<div class="pitfall co-tieu-de"><strong>Trap — a new IP behind the same name is invisible to Nginx until it reloads.</strong> <code>getent hosts</code> already returned the new address, and every request for 3.1 seconds still went to 127.0.0.2, because Nginx resolved the name when it loaded its configuration and kept the result. 240 × 502 until <code>nginx -s reload</code>. The same happens with containers: <code>docker compose up -d</code> recreates the app container, it comes back with a new IP on the Docker network, and an Nginx container that is not reloaded keeps sending traffic to the old IP. The fixes are to reload Nginx as part of the swap (what this chapter does), or to make Nginx re-resolve at request time with a <code>resolver</code> (Docker's is <code>127.0.0.11</code>) and a variable in <code>proxy_pass</code>. Chapter 13.4 does the container version end to end.</div>

<h3>When to use which</h3>
<table>
<tr><th>Approach</th><th>Use when</th><th>Do not use when</th></tr>
<tr><td>Stop-then-start (<code>systemctl restart</code>)</td><td>Low traffic, fast startup, a second of 502s is acceptable — and you run a smoke test afterwards</td><td>Payments, uploads, anything where a failed request costs money or data</td></tr>
<tr><td>Blue-green behind Nginx (this lesson)</td><td>Any site with a reverse proxy and room in RAM for two copies briefly</td><td>The app cannot run twice at once (holds a file lock, runs a scheduler that must not double up)</td></tr>
<tr><td>Rolling restart of several workers</td><td>You already run N workers (<code>pm2 reload</code>, cluster mode) behind one port</td><td>You run one process — there is nothing to roll</td></tr>
<tr><td>Socket activation (<code>systemd.socket</code>)</td><td>You want the kernel to queue connections across a restart without a proxy</td><td>Startup is slow: queued clients wait the whole startup and may time out</td></tr>
</table>
<h3>A dead end worth knowing about</h3>
<p>There is a tidier-looking approach: have both processes bind the <em>same</em> port using <code>SO_REUSEPORT</code>, so no proxy is needed. Measured on this server:</p>
<div class="out">  [A] da gan cong 3198
  [B] HONG: EADDRINUSE
  --- so socket dang nghe cong 3198 ---
  1
  --- 20 request, phan bo vao hai tien trinh ---
       20 A</div>
<div class="callout warn"><strong><code>reusePort: true</code> was accepted and did nothing.</strong> Node v20.20.2 takes the option without complaint, and the second process still failed with <code>EADDRINUSE</code> — one socket, all twenty requests to A. The option landed properly in later Node releases, so this is a version-specific dead end rather than a broken idea. It is worth reporting for two reasons: an option that is silently ignored is worse than one that errors, and a deploy strategy that depends on a runtime feature you have not verified on <em>your</em> runtime is a strategy that fails on the first real deploy.</div>
<p>The proxy approach has no such dependency. It works on every runtime, every language and every version, because the only thing that needs to support it is a reverse proxy you already have.</p>

<h3>Variations of the same shape</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Two ports plus a proxy — measured above</span><span class="lz-lnote">The general answer. Needs a proxy in front, which any site serving TLS already has.</span></div>
  <div class="lz-layer"><span class="lz-lname">Two containers plus a proxy</span><span class="lz-lnote">Identical, with <code>docker compose up -d</code> in place of starting a process. The compose service name replaces the port number.</span></div>
  <div class="lz-layer"><span class="lz-lname">A socket-activated service</span><span class="lz-lnote">systemd holds the listening socket and hands it to whichever process is current, so connections queue in the kernel during the swap instead of being refused. Elegant, and it ties the arrangement to systemd.</span></div>
  <div class="lz-layer"><span class="lz-lname">Several workers, restarted one at a time</span><span class="lz-lnote">A rolling restart, which is what <code>pm2 reload</code> and Nginx's own reload do. Same principle — something is always listening — applied within one process group instead of across two.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the stop-then-start deploy from Lesson 3.1 dropped 133 requests. Rebuild the same deploy as blue-green on the lab VPS and bring the number to zero — then break it on purpose to see which step earns the zero.</p>
<ol>
<li>Put <code>upstream ungdung { server 127.0.0.1:3101; }</code> in <code>/srv/app/upstream.conf</code>, <code>include</code> it from an Nginx site, and run version A on 3101.</li>
<li>With <code>vong.sh</code> running, start version B on 3102, poll <code>curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3102/health</code> until it prints 200, rewrite <code>upstream.conf</code>, run <code>nginx -t &amp;&amp; nginx -s reload</code>, wait 1 s, then <code>kill -TERM</code> A.</li>
<li>Repeat with <code>sleep 1</code> instead of the poll, and once more with the poll but no pause after the reload.</li>
<li>Bonus: point the upstream at a hostname from <code>/etc/hosts</code>, move it to 127.0.0.3 during the swap and see the 502s stop only at the reload.</li>
</ol>
<p><strong>Done when:</strong> the full procedure gives 0 non-200 lines, and you have a number for each broken variant (sleep instead of poll; no pause after reload).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Blue-green deployment</span><span class="v">Two slots for the application; the new version starts in the idle slot and traffic moves only when it is ready.</span></div>
  <div class="kv"><span class="k">Upstream</span><span class="v">The backend(s) Nginx forwards requests to, declared in an <code>upstream</code> block.</span></div>
  <div class="kv"><span class="k">Reload</span><span class="v"><code>nginx -s reload</code>: new workers take the new config, old workers finish their requests — asynchronous.</span></div>
  <div class="kv"><span class="k">Health check</span><span class="v">A request to the app's own endpoint that returns 200 only when it can serve real traffic.</span></div>
  <div class="kv"><span class="k">Worker process</span><span class="v">The Nginx processes that actually handle connections; "shutting down" ones still finish old requests.</span></div>
  <div class="kv"><span class="k">Name resolution</span><span class="v">Turning <code>app</code> into an IP address; Nginx does it once, at config load, unless told otherwise.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The same 1.5-second app, deployed in the right order, dropped zero of 494 requests on the lab VPS.</li>
<li>Replacing the health poll with <code>sleep 1</code> brought failures back: 502 if the app is not listening yet, 500 if it is not warm yet.</li>
<li><code>nginx -s reload</code> is asynchronous; stopping the old backend immediately cost 8–9 × 502, waiting 0.3 s cost none.</li>
<li>A hostname upstream is resolved at load time — a new IP behind it stays invisible until Nginx reloads.</li>
<li>Blue-green needs a proxy and room for two copies; stop-then-start with a smoke test is fine for a quiet site.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_upstream_module — proxy_next_upstream</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_upstream_module.html — which failures are retried against another backend, and the ones that are deliberately not.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">socket(7) — SO_REUSEPORT</span><span class="lc-sub">man7.org/linux/man-pages/man7/socket.7.html — what the option promises at the kernel level, which is not what the measurement above showed at the Node level.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.socket(5) — socket activation</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.socket.html — the variation where the kernel queues connections across a restart.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — upstream blocks, keepalive and reloading</span><span class="lc-sub">/courses/nginx/learn${REF} — the proxy side of this lesson in depth, including why the empty Connection header is required for upstream keepalive.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Xanh-lam: cùng lần deploy đó, không cái nào hỏng</h2>
<p class="lead">Bài 3.1 đo được 168 cái hỏng trên 514. Bài này chạy ĐÚNG lần deploy ấy — cùng ứng dụng, cùng thời gian khởi động 1,5 giây, cùng cái client đang nện vào nó — với bốn bước xếp theo đúng thứ tự.</p>

<h3>Kết quả trước đã</h3>
${slide('dv-03', 15, 'Cùng lần deploy, đổi thứ tự: 0 lỗi (đo lại 29/09)')}
<div class="out">════ B) TRIEN KHAI XANH-LAM ════
  ban B san sang sau 1500ms
  da chuyen upstream sang 3102
  da gui SIGTERM cho ban A
  200: 733   loi ket noi: 0   ma khac: 0
  phan bo ban: {'A': 207, 'B': 526}</div>
<p>Bảy trăm ba mươi ba request, không cái nào hỏng, và phân bố phiên bản cho thấy cú bàn giao: A trả lời 207, B trả lời 526, và giữa chúng KHÔNG có khoảng trống nào. 168 cái hỏng đã biến mất, và chẳng có gì trong ứng dụng thay đổi cả — nó vẫn mất 1,5 giây để khởi động.</p>

<h3>Cách bố trí</h3>
${slide('dv-03', 13, 'Xanh/lam: cổng cố định thuộc về proxy')}
${slide('dv-03', 14, 'upstream.conf: tệp duy nhất lần deploy sửa + bảng chỉ thị')}
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Trước</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">client → :3200</span><span class="lz-nsub">Nginx, cổng cố định — cái duy nhất thế giới bên ngoài biết tới.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">upstream → :3101</span><span class="lz-nsub">Bản A, đang phục vụ.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">:3102</span><span class="lz-nsub">Trống.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Sau</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">client → :3200</span><span class="lz-nsub">Không đổi. Client không hề biết là có chuyện gì xảy ra.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">upstream → :3102</span><span class="lz-nsub">Bản B, không nhận lưu lượng nào cho tới khi nó qua được phép kiểm.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">:3101</span><span class="lz-nsub">Bản A, đang xả nốt rồi thoát.</span></div></div>
  </div>
</div>
<p>Cái cổng cố định thuộc về PROXY, còn ứng dụng thì di chuyển giữa hai cổng nằm sau nó. Không có gì bên ngoài cái máy từng nhìn thấy sự thay đổi đó.</p>
<pre><code><span class="tok-comment"># upstream.conf — tep DUY NHAT ma lan deploy sua</span>
upstream ungdung { server 127.0.0.1:3101; keepalive 16; }

<span class="tok-comment"># nginx.conf — khong bao gio doi</span>
server {
    listen 80;
    location / {
        proxy_pass http://ungdung;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_next_upstream error timeout http_502 http_503;
    }
}</code></pre>
<div class="note-ct"><code>proxy_next_upstream</code> là tấm lưới an toàn: nếu backend được chọn từ chối kết nối hoặc trả 502/503, Nginx thử lại request đó vào một máy khác trong bể thay vì đẩy cái lỗi tới client. Với một máy trong bể thì nó làm được ít; với cả bản cũ lẫn bản mới cùng nằm trong danh sách suốt lúc chuyển thì nó phủ trọn cái vết nứt.</div>

<h3>Lần deploy, bốn bước</h3>
<pre><code>set -euo pipefail
CU=3101; MOI=3102

<span class="tok-comment"># 1. khoi dong ban moi — ban cu VAN dang phuc vu</span>
V=B CONG=\$MOI setsid nohup node app.mjs &gt;/var/log/app-b.log 2&gt;&amp;1 &lt;/dev/null &amp;

<span class="tok-comment"># 2. CHO toi khi no THAT SU tra loi — khong phai sleep</span>
for i in \$(seq 1 40); do
  [ "\$(curl -s -o /dev/null -w '%{http_code}' --max-time 1 \\
        http://127.0.0.1:\$MOI/health)" = "200" ] &amp;&amp; break
  sleep 0.1
  [ "\$i" = "40" ] &amp;&amp; { echo "ban moi khong len duoc sau 4s" &gt;&amp;2; exit 1; }
done

<span class="tok-comment"># 3. chuyen luu luong — mot thao tac nguyen tu</span>
echo "upstream ungdung { server 127.0.0.1:\$MOI; keepalive 16; }" &gt; upstream.conf
nginx -t &amp;&amp; nginx -s reload

<span class="tok-comment"># 4. gio moi dung ban cu, TU TE</span>
sleep 2
kill -TERM "\$(ss -ltnp | grep \":\$CU \" | grep -o 'pid=[0-9]*' | cut -d= -f2)"</code></pre>
<div class="callout ok"><strong>Bước 2 mới là bước giành được con số không.</strong> Phép đo in ra <code>ban B san sang sau 1500ms</code> — cái vòng lặp hỏi cho tới khi bản mới THẬT SỰ trả lời, và nó mất đúng bằng thời gian khởi động của nó. Thay cái vòng lặp đó bằng <code>sleep 1</code> thì lưu lượng đã bị chuyển sang một tiến trình CHƯA sẵn sàng, và mấy cái hỏng sẽ quay lại dưới một hình dạng khác: 502 từ Nginx thay vì lỗi từ chối kết nối. Thay nó bằng <code>sleep 10</code> thì chạy được và làm MỌI lần deploy chậm thêm tám giây mà chẳng vì lý do gì.</div>
<div class="pitfall"><strong>Bẫy — dòng <code>sleep 2</code> ở bước 4 không phải đồ trang trí, và nó cũng KHÔNG đủ.</strong> Nginx hoàn tất việc nạp lại một cách BẤT ĐỒNG BỘ: các tiến trình worker cũ vẫn phục vụ nốt request đang bay của chúng trong khi worker mới nhận request mới. Giết ứng dụng cũ ngay sau lệnh <code>reload</code> có thể cắt đứt một request mà một worker cũ vẫn đang proxy. Hai giây phủ được một ứng dụng nhanh; bản trung thực thì chờ tới khi backend cũ báo không còn request nào đang bay, hoặc đơn giản là chờ lâu hơn cái request chậm nhất của bạn. Đây vẫn là cái vết nứt ở Bài 3.2, chỉ lùi ra ngoài một lớp.</div>


<h3>Đo lại trên VPS thí nghiệm</h3>
<p>Dựng lại đúng cách bố trí đó trên VPS thí nghiệm (nginx 1.24 ở cổng 80, một <code>upstream.conf</code> được <code>include</code> vào, app mất 1,5 giây để khởi động) cho ra cùng câu trả lời với phép đo gốc — không một cái hỏng nào, và cú bàn giao hiện rõ trong bảng phân bố phiên bản:</p>
<div class="out">════ B) XANH/LAM sau nginx ════
  +1028ms  1. khoi dong B tren 3102
  +2699ms  2. B /health 200 (cho 1669 ms)
  +2708ms  3. upstream → 3102, reload
  +3716ms  4. SIGTERM A
  tong: 494   200: 494
  phan bo ban: {"A":239,"B":255}</div>
<p>Các chỉ thị đang làm việc, mỗi cái một dòng:</p>
<table>
<tr><th>Chỉ thị</th><th>Làm gì</th></tr>
<tr><td><code>upstream TEN { server …; }</code></td><td>Một bể backend có tên; <code>proxy_pass http://TEN</code> gửi vào đó.</td></tr>
<tr><td><code>server … backup</code></td><td>Chỉ nhận lưu lượng khi các máy không-dự-phòng đều không dùng được.</td></tr>
<tr><td><code>keepalive N</code></td><td>Giữ tối đa N kết nối nhàn rỗi lên bể, trong mỗi tiến trình worker.</td></tr>
<tr><td><code>proxy_http_version 1.1</code> + <code>proxy_set_header Connection ""</code></td><td>Bắt buộc để keepalive lên upstream chạy được: HTTP/1.0 và một <code>Connection: close</code> bị chuyển tiếp sẽ đóng mọi kết nối.</td></tr>
<tr><td><code>proxy_next_upstream</code></td><td>Những kiểu hỏng nào được thử lại ở máy kế tiếp trong bể; mặc định là <code>error timeout</code>.</td></tr>
<tr><td><code>max_fails</code> / <code>fail_timeout</code></td><td>Bao nhiêu lần hỏng thì một máy bị coi là không dùng được, và trong bao lâu.</td></tr>
<tr><td><code>nginx -t</code>, rồi <code>nginx -s reload</code></td><td>Kiểm cú pháp, rồi cho worker mới chạy với cấu hình mới trong khi worker cũ làm nốt request của chúng.</td></tr>
</table>

<h3>Đoán bằng <code>sleep</code>, đo thật</h3>
<p>Hộp ở trên đoán chuyện gì xảy ra nếu bước 2 bị thay bằng một phỏng đoán. Cả hai hình dạng đều đã được đo — một lần với app sau một giây vẫn CHƯA nghe cổng, một lần với app nghe cổng NGAY nhưng cần 1,5 giây để làm nóng và trả 500 trong lúc đó:</p>
<div class="out">════ C2-sleep1-chua-nghe ════
  +1009ms  1. khoi dong B tren 3102 — A van phuc vu
  +2018ms  2. sleep 1 (khong kiem)
  +2028ms  3. upstream → 3102, nginx -s reload
  +3040ms  4. kill -TERM ban A
  tong: 455   200: 421   502: 34
  cua so hong: tu 2134ms den 2601ms (467ms)
════ C3-sleep1-nghe-nhung-lanh ════
  +1016ms  1. khoi dong B tren 3102 — A van phuc vu
  +2044ms  2. sleep 1 (khong kiem)
  +2055ms  3. upstream → 3102, nginx -s reload
  +3066ms  4. kill -TERM ban A
  tong: 447   200: 414   500: 33
  cua so hong: tu 2176ms den 2612ms (436ms)</div>
<p>34 cú 502 và 33 cú 500, từ hai app chỉ khác nhau ở chỗ <em>KHI NÀO</em> chúng mở cổng. Cửa sổ 3 ở Bài 3.1 chính là lần chạy thứ hai: với nginx và với <code>ss -ltn</code> thì cổng đang mở và mọi thứ trông khoẻ mạnh. Chỉ <code>/health</code> của chính ứng dụng — trả 200 khi nó THẬT SỰ sẵn sàng — mới nói được sự thật cho script.</p>

<h3>Sau reload phải chờ bao lâu, đo thật</h3>
<p>Hộp bẫy ở trên nói dòng <code>sleep 2</code> trước khi dừng bản cũ "không phải đồ trang trí". Đây là nó được quét trên VPS thí nghiệm, với request chậm 300 ms để có nhiều cái đang bay, mỗi mức ba lần:</p>
<div class="out">$ bash C8.sh      # request 300 ms; SIGTERM ban cu sau X giay; moi muc do 3 lan
  cho 0 s sau reload roi SIGTERM ban cu → so 502 qua 3 lan: 9 8 9
  cho 0.05 s sau reload roi SIGTERM ban cu → so 502 qua 3 lan: 4 5 4
  cho 0.1 s sau reload roi SIGTERM ban cu → so 502 qua 3 lan: 0 0 1
  cho 0.3 s sau reload roi SIGTERM ban cu → so 502 qua 3 lan: 0 0 0
  cho 1 s sau reload roi SIGTERM ban cu → so 502 qua 3 lan: 0 0 0
$ ps -eo pid,etimes,args | grep '[n]ginx:'      # ~20 ms sau nginx -s reload
     92     331 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
   3216       0 nginx: worker process is shutting down
   3217       0 nginx: worker process is shutting down
   …
   3270       0 nginx: worker process
   3271       0 nginx: worker process
   …</div>
${slide('dv-03', 16, 'Dừng bản cũ ngay sau reload: vẫn rơi — bảng 0 → 1 giây')}
<div class="callout warn"><strong><code>nginx -s reload</code> trả về TRƯỚC khi cú chuyển hoàn tất.</strong> Nó chỉ gửi tín hiệu cho tiến trình master. Master khởi động worker mới với cấu hình mới và bảo worker cũ tắt tử tế — và trong vài chục mili giây, worker cũ VẪN chuyển request tới backend cũ. Dừng backend đó trong cửa sổ ấy thì nginx nhận một cú từ chối và trả 502: chín cái khi không chờ chút nào, không cái nào từ 0,3 giây trở lên, trên máy này. Script dùng trọn một giây vì nó chẳng tốn gì và chừa chỗ cho máy chủ chậm hơn; luật trung thực là ĐO máy của bạn bằng vòng request ở Bài 3.1.</div>

<h3>Khi upstream là một tên máy: nginx phân giải nó MỘT lần</h3>
<p>Viết <code>server app:3101;</code> thay cho một địa chỉ IP là chuyện bình thường — và trong Docker Compose đó là cách duy nhất hợp lý, vì IP của container thay đổi. Thứ thay đổi theo là <em>LÚC NÀO</em> cái tên được tra. VPS thí nghiệm cho <code>ungdung-may</code> trỏ tới 127.0.0.2 trong <code>/etc/hosts</code>, chạy bản A ở đó, rồi chạy bản B ở 127.0.0.3 và sửa <code>/etc/hosts</code> — tương đương với việc tạo lại một container, thứ nhận IP mới — rồi dừng A:</p>
<div class="out">════ F) upstream theo TEN may; ban moi o IP moi (nhu container tao lai) ════
  +1531ms  B chay o 127.0.0.3:3101
  +1546ms  ungdung-may → 127.0.0.3 (127.0.0.3)
  +1554ms  SIGTERM ban A (127.0.0.2)
  +4558ms  nginx -s reload
  tong: 544   200: 304   502: 240
  phan bo ban: {"A":128,"B":176}
  cua so hong: tu 1562ms den 4662ms (3100ms)
$ sudo grep 'connect() failed' /var/log/nginx/error.log | tail -1
… connect() failed (111: Connection refused) while connecting to upstream, client: 127.0.0.1, server: , request: "GET / HTTP/1.1", upstream: "http://127.0.0.2:3101/", host: "127.0.0.1"</div>
${slide('dv-03', 17, 'nginx phân giải tên máy MỘT lần, lúc nạp')}
<div class="pitfall co-tieu-de"><strong>Bẫy — một IP mới đứng sau CÙNG cái tên thì nginx không nhìn thấy cho tới khi nó nạp lại.</strong> <code>getent hosts</code> đã trả về địa chỉ mới, vậy mà suốt 3,1 giây mọi request vẫn đi tới 127.0.0.2, vì nginx phân giải cái tên lúc nạp cấu hình rồi giữ nguyên kết quả. 240 cú 502 cho tới lệnh <code>nginx -s reload</code>. Với container cũng y như vậy: <code>docker compose up -d</code> tạo lại container ứng dụng, nó quay lại với một IP mới trong mạng Docker, và một container nginx không được nạp lại thì vẫn gửi lưu lượng tới IP cũ. Cách chữa là nạp lại nginx như một phần của bước tráo (việc chương này làm), hoặc bắt nginx phân giải lại lúc có request bằng một <code>resolver</code> (của Docker là <code>127.0.0.11</code>) cộng một biến trong <code>proxy_pass</code>. Chương 13.4 làm bản container từ đầu tới cuối.</div>

<h3>Khi nào dùng cách nào</h3>
<table>
<tr><th>Cách</th><th>Dùng khi</th><th>KHÔNG dùng khi</th></tr>
<tr><td>Dừng-rồi-chạy (<code>systemctl restart</code>)</td><td>Ít lưu lượng, khởi động nhanh, một giây 502 là chấp nhận được — và bạn chạy smoke-test sau đó</td><td>Thanh toán, tải tệp lên, bất cứ thứ gì mà một request hỏng là mất tiền hoặc mất dữ liệu</td></tr>
<tr><td>Xanh/lam sau nginx (bài này)</td><td>Mọi website có proxy ngược và đủ RAM cho hai bản chạy cùng lúc trong chốc lát</td><td>App không thể chạy hai bản một lúc (giữ khoá tệp, chạy bộ lập lịch không được phép chạy đôi)</td></tr>
<tr><td>Khởi động lại cuốn chiếu nhiều worker</td><td>Bạn đã chạy N worker (<code>pm2 reload</code>, chế độ cluster) sau một cổng</td><td>Bạn chỉ chạy một tiến trình — chẳng có gì để cuốn</td></tr>
<tr><td>Kích hoạt bằng socket (<code>systemd.socket</code>)</td><td>Bạn muốn nhân hệ điều hành xếp hàng kết nối qua một lần khởi động lại mà không cần proxy</td><td>Khởi động chậm: client xếp hàng phải chờ trọn thời gian khởi động và có thể hết giờ</td></tr>
</table>
<h3>Một ngõ cụt đáng biết</h3>
<p>Có một cách trông gọn gàng hơn: cho cả hai tiến trình cùng gắn vào <em>MỘT</em> cổng bằng <code>SO_REUSEPORT</code>, thế thì chẳng cần proxy nào. Đo trên chính máy chủ này:</p>
<div class="out">  [A] da gan cong 3198
  [B] HONG: EADDRINUSE
  --- so socket dang nghe cong 3198 ---
  1
  --- 20 request, phan bo vao hai tien trinh ---
       20 A</div>
<div class="callout warn"><strong><code>reusePort: true</code> được NHẬN và chẳng làm gì cả.</strong> Node v20.20.2 nhận cái tuỳ chọn đó không kêu ca gì, và tiến trình thứ hai vẫn hỏng với <code>EADDRINUSE</code> — một socket, cả hai mươi request vào A. Tuỳ chọn này chạy đúng ở những bản Node về sau, nên đây là ngõ cụt theo PHIÊN BẢN chứ không phải một ý tưởng hỏng. Nó đáng được báo lại vì hai lẽ: một tuỳ chọn bị PHỚT LỜ LẶNG LẼ thì tệ hơn một tuỳ chọn báo lỗi, và một chiến lược deploy phụ thuộc vào một tính năng runtime mà bạn chưa kiểm trên runtime CỦA MÌNH là một chiến lược sẽ hỏng ngay ở lần deploy thật đầu tiên.</div>
<p>Cách dùng proxy thì không có sự phụ thuộc nào như vậy. Nó chạy trên mọi runtime, mọi ngôn ngữ và mọi phiên bản, vì thứ duy nhất cần hỗ trợ nó là một con proxy ngược mà bạn vốn đã có.</p>

<h3>Các biến thể của cùng một hình dạng</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Hai cổng cộng một proxy — đo ở trên</span><span class="lz-lnote">Câu trả lời tổng quát. Cần một proxy đứng trước, mà mọi website phục vụ TLS thì đều đã có.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hai container cộng một proxy</span><span class="lz-lnote">Y hệt, chỉ thay việc khởi động một tiến trình bằng <code>docker compose up -d</code>. Tên dịch vụ trong compose thay cho số cổng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một dịch vụ kích hoạt-bằng-socket</span><span class="lz-lnote">systemd giữ cái socket lắng nghe rồi trao nó cho tiến trình nào đang là hiện hành, nên kết nối XẾP HÀNG trong nhân hệ điều hành suốt lúc tráo thay vì bị từ chối. Thanh lịch, và nó buộc cách bố trí này dính vào systemd.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nhiều worker, khởi động lại từng cái một</span><span class="lz-lnote">Một cú khởi động lại cuốn chiếu, đó là thứ <code>pm2 reload</code> và chính lệnh reload của Nginx đang làm. Cùng nguyên lý — LUÔN có thứ gì đó đang lắng nghe — áp dụng bên trong một nhóm tiến trình thay vì bắc qua hai nhóm.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> lần deploy dừng-rồi-chạy ở Bài 3.1 làm rơi 133 request. Dựng lại đúng lần deploy đó theo kiểu xanh/lam trên VPS thí nghiệm và đưa con số về không — rồi cố tình làm hỏng để thấy bước nào giành được con số không.</p>
<ol>
<li>Đặt <code>upstream ungdung { server 127.0.0.1:3101; }</code> vào <code>/srv/app/upstream.conf</code>, <code>include</code> nó từ một site nginx, và chạy bản A ở 3101.</li>
<li>Trong lúc <code>vong.sh</code> đang chạy, khởi động bản B ở 3102, hỏi <code>curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3102/health</code> cho tới khi in 200, ghi lại <code>upstream.conf</code>, chạy <code>nginx -t &amp;&amp; nginx -s reload</code>, chờ 1 giây, rồi <code>kill -TERM</code> bản A.</li>
<li>Làm lại với <code>sleep 1</code> thay cho vòng hỏi, và một lần nữa có vòng hỏi nhưng KHÔNG chờ sau reload.</li>
<li>Thêm: cho upstream trỏ vào một tên máy trong <code>/etc/hosts</code>, dời nó sang 127.0.0.3 giữa lúc tráo, và thấy 502 chỉ dừng khi reload.</li>
</ol>
<p><strong>Đạt khi:</strong> quy trình đầy đủ cho 0 dòng khác 200, và bạn có một con số cho mỗi biến thể hỏng (sleep thay vòng hỏi; không chờ sau reload).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Blue-green deployment (triển khai xanh/lam)</span><span class="v">Hai chỗ cho ứng dụng; bản mới khởi động ở chỗ đang trống và lưu lượng chỉ chuyển khi nó sẵn sàng.</span></div>
  <div class="kv"><span class="k">Upstream (máy phía sau)</span><span class="v">Các backend mà nginx chuyển request tới, khai trong khối <code>upstream</code>.</span></div>
  <div class="kv"><span class="k">Reload (nạp lại)</span><span class="v"><code>nginx -s reload</code>: worker mới nhận cấu hình mới, worker cũ làm nốt request — BẤT ĐỒNG BỘ.</span></div>
  <div class="kv"><span class="k">Health check (phép kiểm còn sống)</span><span class="v">Một request tới endpoint của chính app, chỉ trả 200 khi nó phục vụ được lưu lượng thật.</span></div>
  <div class="kv"><span class="k">Worker process (tiến trình worker)</span><span class="v">Các tiến trình nginx thật sự xử lý kết nối; cái "shutting down" vẫn làm nốt request cũ.</span></div>
  <div class="kv"><span class="k">Name resolution (phân giải tên)</span><span class="v">Biến <code>app</code> thành một địa chỉ IP; nginx làm việc đó MỘT lần, lúc nạp cấu hình, trừ khi được bảo khác.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cùng cái app 1,5 giây, deploy theo đúng thứ tự, rơi 0 trên 494 request trên VPS thí nghiệm.</li>
<li>Thay vòng hỏi sức khoẻ bằng <code>sleep 1</code> thì lỗi quay lại: 502 nếu app chưa nghe, 500 nếu app chưa nóng.</li>
<li><code>nginx -s reload</code> là bất đồng bộ; dừng backend cũ ngay lập tức tốn 8–9 cú 502, chờ 0,3 giây thì không tốn cái nào.</li>
<li>Upstream theo tên máy được phân giải lúc nạp — một IP mới đứng sau nó vô hình cho tới khi nginx nạp lại.</li>
<li>Xanh/lam cần một proxy và đủ chỗ cho hai bản; dừng-rồi-chạy kèm smoke-test là ổn cho một website vắng khách.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_upstream_module — proxy_next_upstream</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_upstream_module.html — những kiểu hỏng nào được thử lại vào backend khác, và những kiểu CỐ Ý không.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">socket(7) — SO_REUSEPORT</span><span class="lc-sub">man7.org/linux/man-pages/man7/socket.7.html — cái tuỳ chọn đó hứa gì ở tầng nhân hệ điều hành, mà đó không phải thứ phép đo ở trên cho thấy ở tầng Node.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.socket(5) — kích hoạt bằng socket</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.socket.html — biến thể mà nhân hệ điều hành xếp hàng kết nối xuyên qua một lần khởi động lại.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — khối upstream, keepalive và nạp lại cấu hình</span><span class="lc-sub">/courses/nginx/learn${REF} — phía proxy của bài này ở mức sâu, kể cả vì sao cái header Connection rỗng là bắt buộc cho keepalive lên upstream.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.4 ─────────────────────────── */
    {
      title: '3.4 — Keeping it running: a service manager instead of nohup|||3.4 — Giữ cho nó chạy: một trình quản lý dịch vụ thay cho nohup',
      slug: 'deploy-3-4-trinh-quan-ly-dich-vu',
      type: 'LESSON',
      description: 'Ứng dụng sập, và năm giây sau vẫn chẳng có gì lắng nghe — nohup không khởi động lại bất cứ thứ gì. Bài này viết một unit systemd thay thế, rồi systemd-analyze verify tìm ra một dòng trong đó bị PHỚT LỜ LẶNG LẼ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Keeping it running: a service manager instead of <code>nohup</code></h2>
<p class="lead">Every measurement so far started the application with <code>setsid nohup node app.mjs &amp;</code>. That is enough to survive the SSH session ending, and it is enough for nothing else. This lesson measures what it does not cover, and replaces it.</p>

<h3>What <code>nohup</code> does when the application crashes</h3>
${slide('dv-03', 18, 'nohup không hồi sinh; Restart= thì có — đo dưới tải')}
<div class="out">════ KHONG co trinh giam sat ════
  truoc khi sap:      ma=200  socket=1
  sau khi sap:        ma=000  socket=0
  5 giay sau:         ma=000  socket=0
  → nohup khong khoi dong lai; tien trinh chet la chet</div>
<p>One unhandled exception, and the site is down until a human notices. <code>nohup</code> detaches a process from a terminal; it has no opinion about whether the process should be running. The same applies to a reboot: <code>nohup</code> survives a logout, not a restart, so an unattended reboot at 4 a.m. leaves the machine up and the site down.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">A crash is not the main case</span><span class="v">Applications crash rarely. Machines reboot for kernel updates, hosts migrate, and out-of-memory kills happen — Chapter 8 measures one. All of those need something that starts the application again.</span></div>
  <div class="kv"><span class="k">Logs go wherever you redirected them</span><span class="v">Usually a file that grows forever, because nothing rotates it. Chapter 8 measures a disk filling up; an unrotated application log is one of the standard ways.</span></div>
  <div class="kv"><span class="k">There is no way to ask "is it running?"</span><span class="v">Only <code>ps</code> and guesswork. No status, no uptime, no restart count, no record of why it last stopped.</span></div>
  <div class="kv"><span class="k">Environment comes from whoever ran it</span><span class="v">The variables in your interactive shell at that moment. Which is why an application started by hand works and the same application started by cron does not.</span></div>
</div>


<h3>The same crash under <code>Restart=</code>, measured</h3>
<p>On the lab VPS (systemd 255, the app behind Nginx, 1.5 s startup), the app was crashed with an uncaught exception while the request loop ran — once with <code>Restart=no</code>, which behaves like <code>nohup</code>, and once with <code>Restart=on-failure</code> and <code>RestartSec=2s</code>:</p>
<div class="out">════ D) systemd Restart=no — ung dung SAP giua luc co tai ════
  +1018ms  ung dung sap (loi khong ai bat)
  tong: 506   200: 72   502: 434
  phan bo ban: {"A":72}
  cua so hong: tu 998ms den 6997ms (5999ms)
════ D) systemd Restart=on-failure — ung dung SAP giua luc co tai ════
  +1019ms  ung dung sap (loi khong ai bat)
  +4773ms  3101 tra 200 tro lai (sau 3750 ms)
  tong: 574   200: 273   502: 301
  phan bo ban: {"A":273}
  cua so hong: tu 1003ms den 4725ms (3722ms)
$ sudo journalctl -u app --no-pager -o short-precise | grep -i 'Main process\\|Failed with\\|Scheduled restart\\|Started'
Sep 29 01:52:46.313867 f9cfa190e24e systemd[1]: app.service: Main process exited, code=exited, status=1/FAILURE
Sep 29 01:52:46.313963 f9cfa190e24e systemd[1]: app.service: Failed with result 'exit-code'.
Sep 29 01:52:48.403034 f9cfa190e24e systemd[1]: app.service: Scheduled restart job, restart counter is at 1.
Sep 29 01:52:48.411618 f9cfa190e24e systemd[1]: Started app.service - Ung dung web (Chuong 3).
…</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>Restart=no</code>: down until the end of the test</span><span class="v">502 from the crash to the last request, six seconds later — and it would have stayed that way until morning.</span></div>
  <div class="kv"><span class="k"><code>on-failure</code>: 3.7 s</span><span class="v">The journal shows the arithmetic: exit at .313, restart scheduled at 48.403 (2.09 s = <code>RestartSec</code>), then 1.5 s of startup. Restarting is not zero downtime; it turns "dead until someone notices" into "a few seconds".</span></div>
  <div class="kv"><span class="k">The journal has millisecond timestamps</span><span class="v"><code>journalctl -o short-precise</code> prints microseconds — the fastest way to see exactly how long each phase took.</span></div>
</div>
<h3>The unit file</h3>
${slide('dv-03', 19, 'Unit systemd, từng dòng')}
${slide('dv-03', 20, 'Bảng chỉ thị: Restart= và những người bạn')}
<table>
<tr><th>Directive</th><th>Value</th><th>Meaning — use when</th></tr>
<tr><td><code>Restart=</code></td><td><code>no</code> (default)</td><td>Never restart. Only for one-shot jobs.</td></tr>
<tr><td></td><td><code>on-failure</code></td><td>Non-zero exit, killed by a signal, timeout, watchdog. The right choice for a web app.</td></tr>
<tr><td></td><td><code>on-abnormal</code></td><td>Signal, timeout or watchdog only — an ordinary <code>exit(1)</code> is <em>not</em> restarted.</td></tr>
<tr><td></td><td><code>always</code></td><td>Also after a clean exit 0. <code>systemctl stop</code> still stops it; the difference is that an app which exits 0 on its own is pulled back up.</td></tr>
<tr><td><code>RestartSec=</code></td><td>100 ms default</td><td>Pause before restarting. 1–5 s keeps a crash loop from hammering the machine.</td></tr>
<tr><td><code>StartLimitIntervalSec=</code>, <code>StartLimitBurst=</code></td><td>10 s, 5 default</td><td>More than Burst starts inside Interval ⇒ the unit goes <code>failed</code> and stops trying. Belong in <code>[Unit]</code>.</td></tr>
<tr><td><code>TimeoutStopSec=</code></td><td>90 s default</td><td>How long after <code>KillSignal</code> before <code>SIGKILL</code>.</td></tr>
<tr><td><code>Type=</code></td><td><code>simple</code>, <code>exec</code>, <code>notify</code></td><td><code>exec</code>: "started" once the binary is executed. <code>notify</code>: only when the app calls <code>sd_notify(READY=1)</code>.</td></tr>
<tr><td><code>ExecReload=</code></td><td>a command</td><td>What <code>systemctl reload</code> runs, e.g. <code>kill -HUP $MAINPID</code>.</td></tr>
</table>
<p>What is actually in effect is whatever <code>systemctl show app -p Restart -p RestartUSec -p TimeoutStopUSec</code> prints — not what you believe you wrote. A typo, a wrong section or a drop-in file elsewhere all show up there.</p>
<pre><code><span class="tok-comment"># /etc/systemd/system/app.service</span>
[Unit]
Description=Ung dung web
After=network-online.target
Wants=network-online.target
StartLimitBurst=5
StartLimitIntervalSec=60

[Service]
Type=exec
User=trienkhai
WorkingDirectory=/srv/app/hien-tai
EnvironmentFile=/srv/app/chung/.env
ExecStart=/opt/node22/bin/node src/server.js
Restart=on-failure
RestartSec=2s
KillSignal=SIGTERM
TimeoutStopSec=15s
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t"><code>WorkingDirectory=/srv/app/hien-tai</code></span><span class="lz-d">The symlink from Lesson 0.4. A restart picks up whichever release it currently points at, so the swap and the service manager are the same mechanism rather than two competing ones.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>EnvironmentFile</code> points outside the release</span><span class="lz-d">Configuration lives in the shared directory, so a deploy cannot overwrite it and a rollback cannot revert it. This is Lesson 1.1's category 4, and Chapter 4 is entirely about it.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>Restart=on-failure</code>, not <code>always</code></span><span class="lz-d"><code>on-failure</code> restarts on a crash or a non-zero exit, and leaves it alone after a clean exit or a deliberate <code>systemctl stop</code>. <code>always</code> restarts even after you stopped it on purpose, which turns a maintenance window into a fight.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t"><code>KillSignal</code> and <code>TimeoutStopSec</code></span><span class="lz-d">The other half of Lesson 3.2. <code>SIGTERM</code> first, then 15 seconds, then <code>SIGKILL</code>. Set the timeout slightly higher than your own shutdown deadline so your code decides what gets abandoned.</span></div>
</div>

<h3><code>systemd-analyze verify</code>, and the line it caught</h3>
${slide('dv-03', 21, 'Chỉ thị sai mục: vòng lặp sập không dừng')}
<p>The first version of that unit had <code>StartLimitBurst</code> and <code>StartLimitIntervalSec</code> in the <code>[Service]</code> section, which looks natural — they are about restarting a service. Run through the validator:</p>
<div class="out">$ systemd-analyze verify /tmp/app.service

  app.service:15: Unknown key name 'StartLimitIntervalSec' in section 'Service', ignoring.
  app.service: Command /usr/bin/node is not executable: No such file or directory</div>
<div class="pitfall"><strong>Trap — a directive in the wrong section is ignored, not rejected.</strong> systemd loads the unit, starts the service, and simply does not apply that setting. The restart rate-limiting you thought you had configured is absent, so a service in a crash loop restarts forever at two-second intervals instead of giving up after five attempts — which is exactly the state where a broken deploy generates thousands of log lines and hides the original error. Nothing about a running service tells you the line was ignored; the only way to find out is the validator, or reading the journal at boot very carefully.</div>
<p>The second finding is more prosaic and just as useful: the path was wrong. <code>node</code> on this machine is at <code>/opt/node22/bin/node</code>. <code>ExecStart</code> requires an absolute path — there is no <code>PATH</code> lookup — and a unit with the wrong one fails at start with a message people routinely read as "node is not installed".</p>
<div class="out">=== sau khi chuyen StartLimit* sang [Unit] va sua duong dan node ===
  (khong con canh bao nao — unit hop le)</div>
<div class="callout ok"><strong>Run <code>systemd-analyze verify</code> on every unit before enabling it.</strong> It parses the file the way systemd will, checks that every key belongs where you put it, and confirms the binary exists. It is the <code>nginx -t</code> of service files — and like <code>nginx -t</code> (Lesson 11.2 of the Nginx course), it proves the file loads and not that the service works.</div>


<h3>What the ignored line costs, measured</h3>
<p>The pitfall above claims a crash loop never gives up when <code>StartLimitIntervalSec</code> is in the wrong section. On systemd 255 in the lab VPS, a unit that fails immediately — like a deploy whose build output is missing — was started twice: once correct, once with the two <code>StartLimit*</code> lines moved into <code>[Service]</code>:</p>
<pre><code class="language-ini"># loop.service — mot ban deploy hong: sap ngay khi khoi dong
[Unit]
Description=Ban deploy hong — sap ngay khi khoi dong
StartLimitIntervalSec=60
StartLimitBurst=5

[Service]
Type=exec
ExecStart=/usr/bin/node -e "console.error('Error: Cannot find module ./dist/server.js'); process.exit(1)"
Restart=on-failure
RestartSec=2s</code></pre><div class="out">════ verify ban dat SAI muc ════
  /tmp/loop.service:9: Unknown key name 'StartLimitIntervalSec' in section 'Service', ignoring.
════ verify ban dung ════
  (thoat 0)
════ loop: vong lap sap, cho 30 giay ════
Result=exit-code NRestarts=5 ActiveState=failed
  Sep 29 01:54:11.387433 f9cfa190e24e systemd[1]: loop.service: Scheduled restart job, restart counter is at 5.
  Sep 29 01:54:11.387474 f9cfa190e24e systemd[1]: loop.service: Start request repeated too quickly.
  Sep 29 01:54:11.387480 f9cfa190e24e systemd[1]: loop.service: Failed with result 'exit-code'.
════ loop-sai: vong lap sap, cho 30 giay ════
Result=exit-code NRestarts=13 ActiveState=activating
  Sep 29 01:54:57.472903 f9cfa190e24e systemd[1]: loop.service: Failed with result 'exit-code'.
  Sep 29 01:54:59.650255 f9cfa190e24e systemd[1]: loop.service: Scheduled restart job, restart counter is at 13.
  Sep 29 01:54:59.849043 f9cfa190e24e systemd[1]: loop.service: Failed with result 'exit-code'.</div>
<div class="callout warn"><strong>Correct: five attempts, then <code>failed</code> — "Start request repeated too quickly". Wrong section: still going after 13 restarts in 30 seconds, and it would never stop.</strong> Why the wrong one never trips even the default limit: with the interval ignored, systemd uses its default of 10 s, and five starts spaced by <code>RestartSec=2s</code> plus the time to crash take just over 10 s — so the window never contains six. Note also what <code>verify</code> did <em>not</em> say: <code>StartLimitBurst</code> in <code>[Service]</code> produced no warning, because systemd still accepts that old spelling there for compatibility. One warning line was the whole difference.</div>
<h3>The commands that replace <code>ps</code> and guessing</h3>
<pre><code>systemctl status app          <span class="tok-comment"># dang chay? tu bao gio? khoi dong lai may lan?</span>
systemctl restart app         <span class="tok-comment"># SIGTERM, cho, roi khoi dong lai</span>
systemctl reload app          <span class="tok-comment"># neu unit khai ExecReload</span>
journalctl -u app -f          <span class="tok-comment"># log, dang chay</span>
journalctl -u app -n 50 --no-pager   <span class="tok-comment"># 50 dong cuoi</span>
journalctl -u app --since '10 min ago' -p err   <span class="tok-comment"># chi loi, 10 phut qua</span>
systemctl show app -p NRestarts      <span class="tok-comment"># no da sap bao nhieu lan</span></code></pre>
<div class="note-ct"><code>NRestarts</code> is the one worth putting in a dashboard. A service that is up but has restarted forty times today is a service in trouble, and every other check — the port is open, the health endpoint answers — reports it as healthy between crashes. Chapter 9 covers what else is worth watching.</div>

<h3>Where this meets the swap</h3>
${slide('dv-03', 22, 'systemctl restart cũng là tráo ngây thơ')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Simple: one unit, restart after the symlink moves</span><span class="lz-lnote"><code>ln -sfn … &amp;&amp; systemctl restart app</code>. Costs the outage measured in Lesson 3.1, so it suits a low-traffic site where 94 ms and one dropped request is acceptable.</span></div>
  <div class="lz-layer"><span class="lz-lname">Zero-downtime: two units, one proxy</span><span class="lz-lnote"><code>app-blue.service</code> and <code>app-green.service</code> on two ports, with the Lesson 3.3 switch between them. The service manager handles crashes and reboots; the proxy handles the swap.</span></div>
  <div class="lz-layer"><span class="lz-lname">A template unit</span><span class="lz-lnote"><code>app@.service</code> started as <code>app@3101</code> and <code>app@3102</code>, with <code>%i</code> as the port. One file for both colours.</span></div>
  <div class="lz-layer"><span class="lz-lname">In containers, the runtime is the service manager</span><span class="lz-lnote"><code>restart: unless-stopped</code> in Compose is <code>Restart=on-failure</code>, and the Docker daemon's own unit is what survives the reboot. Same roles, different names.</span></div>
</div>

<h3><code>systemctl restart</code> is a naive swap too, measured</h3>
<p>The first option in the list above — one unit, <code>systemctl restart</code> — was measured under the same request loop:</p>
<div class="out">════ D2) systemctl restart app = tráo ngây thơ ════
  +1007ms  systemctl restart app
  +1046ms  lenh restart tra ve
  +2675ms  san sang (sau 1625 ms)
  tong: 498   200: 371   502: 127
  phan bo ban: {"A":371}
  cua so hong: tu 1015ms den 2625ms (1610ms)
$ sudo systemctl show app -p Restart -p RestartUSec -p TimeoutStopUSec -p NRestarts -p ActiveState
Restart=on-failure
RestartUSec=2s
TimeoutStopUSec=15s
NRestarts=0
ActiveState=active</div>
<div class="kv-grid">
  <div class="kv"><span class="k">127 × 502 over 1.6 s</span><span class="v">Exactly the naive swap of Lesson 3.1: <code>restart</code> is stop, then start.</span></div>
  <div class="kv"><span class="k">The command returned after 39 ms</span><span class="v">With <code>Type=exec</code>, systemd considers the service started as soon as the binary runs. A script that trusts the exit code of <code>restart</code> and prints "deployed" is 1.6 s early. <code>Type=notify</code> or an explicit <code>/health</code> poll closes that gap.</span></div>
  <div class="kv"><span class="k"><code>NRestarts=0</code> after a crash and a restart</span><span class="v">A manual restart resets the counter, so a dashboard of <code>NRestarts</code> shows a clean slate after every deploy. Record it before you restart if you care.</span></div>
</div>

<h3>On macOS and Windows: there is no systemd on your laptop</h3>
<p>macOS keeps services alive with <strong>launchd</strong> — a <code>.plist</code> with <code>KeepAlive</code> plays the role of <code>Restart=</code> — so a unit file cannot be tested on a Mac at all; test it on the lab VPS, which runs systemd 255 like Ubuntu 24.04. On Windows, WSL 2 can run systemd once <code>/etc/wsl.conf</code> contains <code>[boot]</code> and <code>systemd=true</code> (then <code>wsl --shutdown</code> and reopen); without it, <code>systemctl</code> in WSL answers that the system has not been booted with systemd. Either way, the only honest test of a unit is <code>systemd-analyze verify</code> plus a real start on a Linux machine.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the VPS rebooted for a kernel update at 4 a.m. and the site stayed down until a teammate noticed at 9 — the app had been started with <code>nohup</code>. Replace it with a unit and prove the three things <code>nohup</code> could not do.</p>
<ol>
<li>On the lab VPS (the systemd variant), write <code>/etc/systemd/system/app.service</code> from this lesson, run <code>sudo systemd-analyze verify</code> on it, then <code>sudo systemctl daemon-reload &amp;&amp; sudo systemctl enable --now app</code>.</li>
<li>With the request loop running, crash the app (a route that throws, or <code>sudo kill -SEGV $(systemctl show app -p MainPID --value)</code>) and time the gap in <code>journalctl -u app -o short-precise</code>.</li>
<li>Write a second unit whose <code>ExecStart</code> fails immediately; put <code>StartLimit*</code> in <code>[Unit]</code>, watch it reach <code>failed</code>, then move them to <code>[Service]</code> and watch <code>NRestarts</code> keep climbing.</li>
<li>Run <code>sudo systemctl reset-failed</code> and clean up the test unit.</li>
</ol>
<p><strong>Done when:</strong> you can read off the restart gap from the journal (≈ <code>RestartSec</code> + startup), and you have the two <code>NRestarts</code> values — stuck at 5 with <code>failed</code>, and still rising.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Service manager</span><span class="v">The program that starts, watches and restarts your app — systemd on Ubuntu, launchd on macOS, the Docker daemon for containers.</span></div>
  <div class="kv"><span class="k">Unit file</span><span class="v">A text file in <code>/etc/systemd/system/</code> describing one service, in <code>[Unit]</code>, <code>[Service]</code> and <code>[Install]</code> sections.</span></div>
  <div class="kv"><span class="k">Restart policy</span><span class="v"><code>Restart=</code>: which kinds of exit make systemd start the service again.</span></div>
  <div class="kv"><span class="k">Start rate limit</span><span class="v"><code>StartLimitIntervalSec</code> + <code>StartLimitBurst</code>: give up after too many starts in a window.</span></div>
  <div class="kv"><span class="k">Template unit</span><span class="v"><code>app@.service</code> started as <code>app@3101</code>; <code>%i</code> is the part after the @.</span></div>
  <div class="kv"><span class="k">Journal</span><span class="v">systemd's log store, read with <code>journalctl -u NAME</code>.</span></div>
  <div class="kv"><span class="k"><code>daemon-reload</code></span><span class="v">Tell systemd to re-read unit files after you edit one — without it, your edit does nothing.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>nohup</code> (and <code>Restart=no</code>) leaves a crashed app down; <code>Restart=on-failure</code> brought it back in 3.7 s.</li>
<li>Restart gap = <code>RestartSec</code> + startup time — measured to the millisecond with <code>journalctl -o short-precise</code>.</li>
<li>A directive in the wrong section is ignored with one warning; here it turned "give up after 5" into a crash loop that never ends.</li>
<li>Always <code>systemd-analyze verify</code> before enabling, and read the effective values with <code>systemctl show</code>.</li>
<li><code>systemctl restart</code> is still a naive swap (127 × 502) and returns before the app is ready.</li>
<li>Zero downtime with systemd means two units — <code>app@3101</code>/<code>app@3102</code> — and Nginx switching between them.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.service(5)</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.service.html — every directive in the unit above, including the table of what <code>Restart=</code> considers a failure.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.unit(5) — section rules</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.unit.html — which keys belong in <code>[Unit]</code> rather than <code>[Service]</code>, which is what the validator caught above.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">systemd-analyze(1) — verify, security, blame</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd-analyze.html — <code>verify</code> for correctness and <code>security</code> for a hardening score on your unit.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — systemd units, timers and the journal</span><span class="lc-sub">/courses/linux-bash/learn${REF} — services, targets and dependency ordering in depth.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Giữ cho nó chạy: một trình quản lý dịch vụ thay cho <code>nohup</code></h2>
<p class="lead">Mọi phép đo từ đầu tới giờ đều khởi động ứng dụng bằng <code>setsid nohup node app.mjs &amp;</code>. Chừng đó đủ để sống sót khi phiên SSH kết thúc, và không đủ cho bất cứ điều gì khác. Bài này đo những thứ nó KHÔNG phủ, rồi thay thế nó.</p>

<h3><code>nohup</code> làm gì khi ứng dụng SẬP</h3>
${slide('dv-03', 18, 'nohup không hồi sinh; Restart= thì có — đo dưới tải')}
<div class="out">════ KHONG co trinh giam sat ════
  truoc khi sap:      ma=200  socket=1
  sau khi sap:        ma=000  socket=0
  5 giay sau:         ma=000  socket=0
  → nohup khong khoi dong lai; tien trinh chet la chet</div>
<p>Một ngoại lệ không bắt được, và website chết cho tới khi có người phát hiện. <code>nohup</code> TÁCH một tiến trình khỏi terminal; nó chẳng có ý kiến gì về việc tiến trình đó CÓ NÊN đang chạy hay không. Điều tương tự đúng với một lần khởi động lại máy: <code>nohup</code> sống sót qua một lần đăng xuất, chứ không qua một lần restart, nên một cú reboot tự động lúc 4 giờ sáng để lại cái máy sống và website chết.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Sập KHÔNG phải trường hợp chính</span><span class="v">Ứng dụng ít khi sập. Nhưng máy thì khởi động lại để cập nhật nhân, máy chủ vật lý thì được di trú, và những cú giết vì hết bộ nhớ thì có xảy ra — Chương 8 đo một cú. Tất cả những cái đó đều cần một thứ khởi động ứng dụng LẠI.</span></div>
  <div class="kv"><span class="k">Log đi tới đúng chỗ bạn chuyển hướng nó</span><span class="v">Thường là một cái tệp phình ra mãi mãi, vì chẳng có gì xoay vòng nó. Chương 8 đo một cái đĩa bị làm đầy; một tệp log ứng dụng không được xoay vòng là một trong những cách chuẩn mực để làm chuyện đó.</span></div>
  <div class="kv"><span class="k">Không có cách nào hỏi "nó còn chạy không?"</span><span class="v">Chỉ có <code>ps</code> và phỏng đoán. Không trạng thái, không thời gian sống, không số lần khởi động lại, không ghi chép nào về lý do lần trước nó dừng.</span></div>
  <div class="kv"><span class="k">Biến môi trường tới từ người đã chạy nó</span><span class="v">Đúng những biến trong shell tương tác của bạn ở khoảnh khắc ấy. Đó là lý do một ứng dụng khởi động bằng tay thì chạy còn chính nó khởi động bằng cron thì không.</span></div>
</div>


<h3>Cùng cú sập đó dưới <code>Restart=</code>, đo thật</h3>
<p>Trên VPS thí nghiệm (systemd 255, app đứng sau nginx, khởi động 1,5 giây), app bị làm sập bằng một ngoại lệ không ai bắt trong lúc vòng request đang chạy — một lần với <code>Restart=no</code>, cư xử y như <code>nohup</code>, và một lần với <code>Restart=on-failure</code> cùng <code>RestartSec=2s</code>:</p>
<div class="out">════ D) systemd Restart=no — ung dung SAP giua luc co tai ════
  +1018ms  ung dung sap (loi khong ai bat)
  tong: 506   200: 72   502: 434
  phan bo ban: {"A":72}
  cua so hong: tu 998ms den 6997ms (5999ms)
════ D) systemd Restart=on-failure — ung dung SAP giua luc co tai ════
  +1019ms  ung dung sap (loi khong ai bat)
  +4773ms  3101 tra 200 tro lai (sau 3750 ms)
  tong: 574   200: 273   502: 301
  phan bo ban: {"A":273}
  cua so hong: tu 1003ms den 4725ms (3722ms)
$ sudo journalctl -u app --no-pager -o short-precise | grep -i 'Main process\\|Failed with\\|Scheduled restart\\|Started'
Sep 29 01:52:46.313867 f9cfa190e24e systemd[1]: app.service: Main process exited, code=exited, status=1/FAILURE
Sep 29 01:52:46.313963 f9cfa190e24e systemd[1]: app.service: Failed with result 'exit-code'.
Sep 29 01:52:48.403034 f9cfa190e24e systemd[1]: app.service: Scheduled restart job, restart counter is at 1.
Sep 29 01:52:48.411618 f9cfa190e24e systemd[1]: Started app.service - Ung dung web (Chuong 3).
…</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>Restart=no</code>: chết tới hết phép đo</span><span class="v">502 từ lúc sập tới request cuối cùng, sáu giây sau — và nó sẽ nằm yên như thế tới sáng.</span></div>
  <div class="kv"><span class="k"><code>on-failure</code>: 3,7 giây</span><span class="v">Journal cho thấy phép cộng: thoát lúc .313, lên lịch chạy lại lúc 48.403 (2,09 giây = <code>RestartSec</code>), rồi 1,5 giây khởi động. Tự khởi động lại KHÔNG phải không gián đoạn; nó biến "chết tới khi có người thấy" thành "vài giây".</span></div>
  <div class="kv"><span class="k">Journal có dấu thời gian tới mili giây</span><span class="v"><code>journalctl -o short-precise</code> in tới micro giây — cách nhanh nhất để thấy từng giai đoạn mất bao lâu.</span></div>
</div>
<h3>Tệp unit</h3>
${slide('dv-03', 19, 'Unit systemd, từng dòng')}
${slide('dv-03', 20, 'Bảng chỉ thị: Restart= và những người bạn')}
<table>
<tr><th>Chỉ thị</th><th>Giá trị</th><th>Nghĩa — dùng khi</th></tr>
<tr><td><code>Restart=</code></td><td><code>no</code> (mặc định)</td><td>Không bao giờ chạy lại. Chỉ cho việc chạy một lần.</td></tr>
<tr><td></td><td><code>on-failure</code></td><td>Thoát khác 0, bị tín hiệu giết, hết giờ, watchdog. Lựa chọn ĐÚNG cho một ứng dụng web.</td></tr>
<tr><td></td><td><code>on-abnormal</code></td><td>Chỉ khi bị tín hiệu, hết giờ hoặc watchdog — một cú <code>exit(1)</code> bình thường thì KHÔNG được chạy lại.</td></tr>
<tr><td></td><td><code>always</code></td><td>Cả sau một lần thoát sạch với mã 0. <code>systemctl stop</code> vẫn dừng được nó; khác biệt là một app tự thoát 0 cũng bị kéo dậy.</td></tr>
<tr><td><code>RestartSec=</code></td><td>100 ms mặc định</td><td>Nghỉ trước khi chạy lại. 1–5 giây để một vòng lặp sập không đập máy liên tục.</td></tr>
<tr><td><code>StartLimitIntervalSec=</code>, <code>StartLimitBurst=</code></td><td>10 giây, 5 lần mặc định</td><td>Chạy quá Burst lần trong Interval ⇒ unit thành <code>failed</code> và thôi thử. Thuộc về <code>[Unit]</code>.</td></tr>
<tr><td><code>TimeoutStopSec=</code></td><td>90 giây mặc định</td><td>Bao lâu sau <code>KillSignal</code> thì gửi <code>SIGKILL</code>.</td></tr>
<tr><td><code>Type=</code></td><td><code>simple</code>, <code>exec</code>, <code>notify</code></td><td><code>exec</code>: "đã chạy" ngay khi tệp chương trình được thực thi. <code>notify</code>: chỉ khi app gọi <code>sd_notify(READY=1)</code>.</td></tr>
<tr><td><code>ExecReload=</code></td><td>một lệnh</td><td>Thứ <code>systemctl reload</code> sẽ chạy, ví dụ <code>kill -HUP $MAINPID</code>.</td></tr>
</table>
<p>Thứ ĐANG có hiệu lực là thứ <code>systemctl show app -p Restart -p RestartUSec -p TimeoutStopUSec</code> in ra — không phải thứ bạn tin là mình đã viết. Một lỗi gõ, một mục sai hay một tệp drop-in ở chỗ khác đều lộ ra ở đó.</p>
<pre><code><span class="tok-comment"># /etc/systemd/system/app.service</span>
[Unit]
Description=Ung dung web
After=network-online.target
Wants=network-online.target
StartLimitBurst=5
StartLimitIntervalSec=60

[Service]
Type=exec
User=trienkhai
WorkingDirectory=/srv/app/hien-tai
EnvironmentFile=/srv/app/chung/.env
ExecStart=/opt/node22/bin/node src/server.js
Restart=on-failure
RestartSec=2s
KillSignal=SIGTERM
TimeoutStopSec=15s
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t"><code>WorkingDirectory=/srv/app/hien-tai</code></span><span class="lz-d">Chính cái symlink ở Bài 0.4. Một lần khởi động lại sẽ lấy bản phát hành mà nó ĐANG trỏ vào, nên bước tráo và trình quản lý dịch vụ là CÙNG một cơ chế chứ không phải hai thứ giẫm chân nhau.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>EnvironmentFile</code> trỏ ra NGOÀI bản phát hành</span><span class="lz-d">Cấu hình sống ở thư mục dùng chung, nên một lần deploy KHÔNG ghi đè được nó và một cú lùi bản KHÔNG hoàn tác được nó. Đây là loại 4 ở Bài 1.1, và Chương 4 dành trọn cho nó.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>Restart=on-failure</code>, không phải <code>always</code></span><span class="lz-d"><code>on-failure</code> khởi động lại khi sập hoặc thoát khác 0, và ĐỂ YÊN sau một lần thoát sạch hoặc một lệnh <code>systemctl stop</code> cố ý. <code>always</code> thì khởi động lại ngay cả khi bạn CỐ TÌNH dừng nó, biến một cửa sổ bảo trì thành một cuộc vật lộn.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t"><code>KillSignal</code> và <code>TimeoutStopSec</code></span><span class="lz-d">Nửa còn lại của Bài 3.2. <code>SIGTERM</code> trước, rồi 15 giây, rồi <code>SIGKILL</code>. Hãy đặt timeout nhỉnh hơn hạn chót tắt của chính bạn để MÃ CỦA BẠN quyết định cái gì bị bỏ rơi.</span></div>
</div>

<h3><code>systemd-analyze verify</code>, và cái dòng nó bắt được</h3>
${slide('dv-03', 21, 'Chỉ thị sai mục: vòng lặp sập không dừng')}
<p>Bản đầu tiên của cái unit đó đặt <code>StartLimitBurst</code> và <code>StartLimitIntervalSec</code> trong mục <code>[Service]</code>, và điều đó trông rất tự nhiên — chúng nói về việc khởi động lại một dịch vụ mà. Đưa qua bộ kiểm:</p>
<div class="out">$ systemd-analyze verify /tmp/app.service

  app.service:15: Unknown key name 'StartLimitIntervalSec' in section 'Service', ignoring.
  app.service: Command /usr/bin/node is not executable: No such file or directory</div>
<div class="pitfall"><strong>Bẫy — một chỉ thị đặt SAI MỤC thì bị PHỚT LỜ, chứ không bị từ chối.</strong> systemd nạp cái unit, khởi động dịch vụ, và đơn giản là KHÔNG áp dụng thiết lập đó. Cái giới hạn tần suất khởi động lại mà bạn tưởng đã cấu hình thì KHÔNG tồn tại, nên một dịch vụ đang trong vòng lặp sập sẽ khởi động lại MÃI MÃI mỗi hai giây thay vì bỏ cuộc sau năm lần — mà đó đúng là cái trạng thái một lần deploy hỏng sinh ra hàng nghìn dòng log và che mất lỗi gốc. Chẳng có gì ở một dịch vụ đang chạy cho bạn biết cái dòng đó đã bị bỏ qua; cách duy nhất để biết là bộ kiểm, hoặc đọc journal lúc khởi động thật kỹ.</div>
<p>Phát hiện thứ hai thì tầm thường hơn và hữu ích chẳng kém: đường dẫn SAI. <code>node</code> trên máy này nằm ở <code>/opt/node22/bin/node</code>. <code>ExecStart</code> đòi một đường dẫn TUYỆT ĐỐI — không hề có chuyện tra <code>PATH</code> — và một unit ghi sai đường dẫn sẽ hỏng lúc khởi động với một thông báo mà người ta thường đọc thành "chưa cài node".</p>
<div class="out">=== sau khi chuyen StartLimit* sang [Unit] va sua duong dan node ===
  (khong con canh bao nao — unit hop le)</div>
<div class="callout ok"><strong>Hãy chạy <code>systemd-analyze verify</code> trên MỌI unit trước khi bật nó.</strong> Nó phân tích tệp theo đúng cách systemd sẽ làm, kiểm xem mọi khoá có nằm đúng chỗ bạn đặt không, và xác nhận cái nhị phân có tồn tại. Nó là <code>nginx -t</code> của tệp dịch vụ — và giống <code>nginx -t</code> (Bài 11.2 của khoá Nginx), nó chứng minh tệp NẠP ĐƯỢC chứ không chứng minh dịch vụ CHẠY ĐƯỢC.</div>


<h3>Cái dòng bị phớt lờ tốn gì, đo thật</h3>
<p>Hộp bẫy ở trên nói một vòng lặp sập sẽ không bao giờ bỏ cuộc khi <code>StartLimitIntervalSec</code> nằm sai mục. Trên systemd 255 trong VPS thí nghiệm, một unit hỏng ngay khi chạy — như một lần deploy thiếu thư mục build — được khởi động hai lần: một lần đúng, một lần hai dòng <code>StartLimit*</code> bị dời vào <code>[Service]</code>:</p>
<pre><code class="language-ini"># loop.service — mot ban deploy hong: sap ngay khi khoi dong
[Unit]
Description=Ban deploy hong — sap ngay khi khoi dong
StartLimitIntervalSec=60
StartLimitBurst=5

[Service]
Type=exec
ExecStart=/usr/bin/node -e "console.error('Error: Cannot find module ./dist/server.js'); process.exit(1)"
Restart=on-failure
RestartSec=2s</code></pre><div class="out">════ verify ban dat SAI muc ════
  /tmp/loop.service:9: Unknown key name 'StartLimitIntervalSec' in section 'Service', ignoring.
════ verify ban dung ════
  (thoat 0)
════ loop: vong lap sap, cho 30 giay ════
Result=exit-code NRestarts=5 ActiveState=failed
  Sep 29 01:54:11.387433 f9cfa190e24e systemd[1]: loop.service: Scheduled restart job, restart counter is at 5.
  Sep 29 01:54:11.387474 f9cfa190e24e systemd[1]: loop.service: Start request repeated too quickly.
  Sep 29 01:54:11.387480 f9cfa190e24e systemd[1]: loop.service: Failed with result 'exit-code'.
════ loop-sai: vong lap sap, cho 30 giay ════
Result=exit-code NRestarts=13 ActiveState=activating
  Sep 29 01:54:57.472903 f9cfa190e24e systemd[1]: loop.service: Failed with result 'exit-code'.
  Sep 29 01:54:59.650255 f9cfa190e24e systemd[1]: loop.service: Scheduled restart job, restart counter is at 13.
  Sep 29 01:54:59.849043 f9cfa190e24e systemd[1]: loop.service: Failed with result 'exit-code'.</div>
<div class="callout warn"><strong>Đúng mục: năm lần thử, rồi <code>failed</code> — "Start request repeated too quickly". Sai mục: vẫn chạy tiếp sau 13 lần khởi động lại trong 30 giây, và sẽ không bao giờ dừng.</strong> Vì sao bản sai không chạm nổi cả giới hạn mặc định: khi interval bị phớt lờ, systemd dùng mặc định 10 giây, mà năm lần chạy cách nhau <code>RestartSec=2s</code> cộng thời gian sập trải hơn 10 giây — nên cửa sổ không bao giờ chứa đủ sáu lần. Để ý cả thứ <code>verify</code> KHÔNG nói: <code>StartLimitBurst</code> trong <code>[Service]</code> không sinh cảnh báo nào, vì systemd vẫn nhận cách viết cũ đó ở đấy để tương thích. Một dòng cảnh báo là toàn bộ khác biệt.</div>
<h3>Những lệnh thay thế cho <code>ps</code> và sự phỏng đoán</h3>
<pre><code>systemctl status app          <span class="tok-comment"># dang chay? tu bao gio? khoi dong lai may lan?</span>
systemctl restart app         <span class="tok-comment"># SIGTERM, cho, roi khoi dong lai</span>
systemctl reload app          <span class="tok-comment"># neu unit khai ExecReload</span>
journalctl -u app -f          <span class="tok-comment"># log, dang chay</span>
journalctl -u app -n 50 --no-pager   <span class="tok-comment"># 50 dong cuoi</span>
journalctl -u app --since '10 min ago' -p err   <span class="tok-comment"># chi loi, 10 phut qua</span>
systemctl show app -p NRestarts      <span class="tok-comment"># no da sap bao nhieu lan</span></code></pre>
<div class="note-ct"><code>NRestarts</code> là con số đáng đưa lên bảng theo dõi. Một dịch vụ đang SỐNG mà hôm nay đã khởi động lại bốn mươi lần là một dịch vụ đang gặp chuyện, và mọi phép kiểm khác — cổng đang mở, endpoint sức khoẻ trả lời — đều báo nó khoẻ mạnh trong những quãng giữa các lần sập. Chương 9 nói về những thứ khác đáng theo dõi.</div>

<h3>Chỗ nó gặp bước tráo</h3>
${slide('dv-03', 22, 'systemctl restart cũng là tráo ngây thơ')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Đơn giản: một unit, khởi động lại sau khi symlink dịch chuyển</span><span class="lz-lnote"><code>ln -sfn … &amp;&amp; systemctl restart app</code>. Tốn đúng cái gián đoạn đo ở Bài 3.1, nên nó hợp với một website ít lưu lượng mà 94 ms cùng một request rơi là chấp nhận được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Không gián đoạn: hai unit, một proxy</span><span class="lz-lnote"><code>app-blue.service</code> và <code>app-green.service</code> trên hai cổng, với cú chuyển ở Bài 3.3 giữa chúng. Trình quản lý dịch vụ lo chuyện sập và reboot; proxy lo chuyện tráo.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một unit dạng khuôn</span><span class="lz-lnote"><code>app@.service</code> khởi động thành <code>app@3101</code> và <code>app@3102</code>, với <code>%i</code> là số cổng. Một tệp cho cả hai màu.</span></div>
  <div class="lz-layer"><span class="lz-lname">Trong container, chính runtime là trình quản lý dịch vụ</span><span class="lz-lnote"><code>restart: unless-stopped</code> trong Compose chính là <code>Restart=on-failure</code>, và cái unit của chính Docker daemon mới là thứ sống sót qua lần reboot. Cùng vai trò, khác tên gọi.</span></div>
</div>

<h3><code>systemctl restart</code> cũng là một cú tráo ngây thơ, đo thật</h3>
<p>Phương án đầu tiên trong danh sách trên — một unit, <code>systemctl restart</code> — được đo dưới đúng vòng request đó:</p>
<div class="out">════ D2) systemctl restart app = tráo ngây thơ ════
  +1007ms  systemctl restart app
  +1046ms  lenh restart tra ve
  +2675ms  san sang (sau 1625 ms)
  tong: 498   200: 371   502: 127
  phan bo ban: {"A":371}
  cua so hong: tu 1015ms den 2625ms (1610ms)
$ sudo systemctl show app -p Restart -p RestartUSec -p TimeoutStopUSec -p NRestarts -p ActiveState
Restart=on-failure
RestartUSec=2s
TimeoutStopUSec=15s
NRestarts=0
ActiveState=active</div>
<div class="kv-grid">
  <div class="kv"><span class="k">127 cú 502 trong 1,6 giây</span><span class="v">Đúng cú tráo ngây thơ ở Bài 3.1: <code>restart</code> là dừng, rồi chạy.</span></div>
  <div class="kv"><span class="k">Lệnh trả về sau 39 ms</span><span class="v">Với <code>Type=exec</code>, systemd coi dịch vụ đã chạy ngay khi tệp chương trình chạy. Một script tin mã thoát của <code>restart</code> rồi in "đã deploy" là in sớm 1,6 giây. <code>Type=notify</code> hoặc một vòng hỏi <code>/health</code> tường minh sẽ đóng khoảng hở đó.</span></div>
  <div class="kv"><span class="k"><code>NRestarts=0</code> sau một cú sập và một lần restart</span><span class="v">Restart bằng tay đặt lại bộ đếm, nên bảng theo dõi <code>NRestarts</code> sạch trơn sau mỗi lần deploy. Muốn giữ thì ghi nó lại TRƯỚC khi restart.</span></div>
</div>

<h3>Trên macOS và Windows: laptop của bạn không có systemd</h3>
<p>macOS giữ dịch vụ sống bằng <strong>launchd</strong> — một tệp <code>.plist</code> có <code>KeepAlive</code> đóng vai của <code>Restart=</code> — nên một tệp unit hoàn toàn không thử được trên Mac; hãy thử nó trên VPS thí nghiệm, nơi chạy systemd 255 như Ubuntu 24.04. Trên Windows, WSL 2 chạy được systemd khi <code>/etc/wsl.conf</code> có <code>[boot]</code> và <code>systemd=true</code> (rồi <code>wsl --shutdown</code> và mở lại); không có dòng đó thì <code>systemctl</code> trong WSL trả lời rằng hệ thống không được khởi động bằng systemd. Đằng nào thì phép thử trung thực duy nhất cho một unit vẫn là <code>systemd-analyze verify</code> cộng một lần chạy thật trên một máy Linux.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> VPS khởi động lại để cập nhật nhân lúc 4 giờ sáng và website chết tới 9 giờ mới có bạn cùng nhóm phát hiện — app được chạy bằng <code>nohup</code>. Thay nó bằng một unit và chứng minh ba điều mà <code>nohup</code> không làm được.</p>
<ol>
<li>Trên VPS thí nghiệm (bản có systemd), viết <code>/etc/systemd/system/app.service</code> theo bài này, chạy <code>sudo systemd-analyze verify</code> trên nó, rồi <code>sudo systemctl daemon-reload &amp;&amp; sudo systemctl enable --now app</code>.</li>
<li>Trong lúc vòng request đang chạy, làm sập app (một route ném lỗi, hoặc <code>sudo kill -SEGV $(systemctl show app -p MainPID --value)</code>) rồi đo khoảng hở trong <code>journalctl -u app -o short-precise</code>.</li>
<li>Viết một unit thứ hai có <code>ExecStart</code> hỏng ngay; đặt <code>StartLimit*</code> ở <code>[Unit]</code>, xem nó tới <code>failed</code>, rồi dời chúng sang <code>[Service]</code> và xem <code>NRestarts</code> cứ tăng mãi.</li>
<li>Chạy <code>sudo systemctl reset-failed</code> và dọn unit thử.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đọc được khoảng hở khởi động lại từ journal (≈ <code>RestartSec</code> + thời gian khởi động), và có hai giá trị <code>NRestarts</code> — đứng ở 5 kèm <code>failed</code>, và vẫn đang tăng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Service manager (trình quản lý dịch vụ)</span><span class="v">Chương trình khởi động, theo dõi và chạy lại app của bạn — systemd trên Ubuntu, launchd trên macOS, Docker daemon với container.</span></div>
  <div class="kv"><span class="k">Unit file (tệp unit)</span><span class="v">Tệp chữ trong <code>/etc/systemd/system/</code> mô tả một dịch vụ, gồm các mục <code>[Unit]</code>, <code>[Service]</code>, <code>[Install]</code>.</span></div>
  <div class="kv"><span class="k">Restart policy (chính sách chạy lại)</span><span class="v"><code>Restart=</code>: kiểu thoát nào khiến systemd chạy dịch vụ lại.</span></div>
  <div class="kv"><span class="k">Start rate limit (giới hạn tần suất khởi động)</span><span class="v"><code>StartLimitIntervalSec</code> + <code>StartLimitBurst</code>: bỏ cuộc khi khởi động quá nhiều lần trong một khoảng.</span></div>
  <div class="kv"><span class="k">Template unit (unit dạng khuôn)</span><span class="v"><code>app@.service</code> chạy thành <code>app@3101</code>; <code>%i</code> là phần sau dấu @.</span></div>
  <div class="kv"><span class="k">Journal (nhật ký hệ thống)</span><span class="v">Kho log của systemd, đọc bằng <code>journalctl -u TEN</code>.</span></div>
  <div class="kv"><span class="k"><code>daemon-reload</code> (nạp lại tệp unit)</span><span class="v">Bảo systemd đọc lại tệp unit sau khi bạn sửa — thiếu nó thì chỗ sửa không có tác dụng gì.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>nohup</code> (và <code>Restart=no</code>) để một app đã sập nằm chết; <code>Restart=on-failure</code> kéo nó dậy trong 3,7 giây.</li>
<li>Khoảng hở khi chạy lại = <code>RestartSec</code> + thời gian khởi động — đo tới mili giây bằng <code>journalctl -o short-precise</code>.</li>
<li>Một chỉ thị sai mục bị phớt lờ kèm đúng một dòng cảnh báo; ở đây nó biến "bỏ cuộc sau 5 lần" thành vòng lặp sập không bao giờ dừng.</li>
<li>Luôn <code>systemd-analyze verify</code> trước khi bật, và đọc giá trị đang hiệu lực bằng <code>systemctl show</code>.</li>
<li><code>systemctl restart</code> vẫn là một cú tráo ngây thơ (127 cú 502) và trả về trước khi app sẵn sàng.</li>
<li>Không gián đoạn với systemd nghĩa là hai unit — <code>app@3101</code>/<code>app@3102</code> — và nginx chuyển giữa chúng.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.service(5)</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.service.html — mọi chỉ thị trong cái unit ở trên, kèm bảng nói <code>Restart=</code> coi cái gì là một lần hỏng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.unit(5) — luật về các mục</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.unit.html — khoá nào thuộc về <code>[Unit]</code> chứ không phải <code>[Service]</code>, chính là thứ bộ kiểm đã bắt được ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">systemd-analyze(1) — verify, security, blame</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd-analyze.html — <code>verify</code> để kiểm tính đúng đắn và <code>security</code> để chấm điểm gia cố cho unit của bạn.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — unit systemd, timer và journal</span><span class="lc-sub">/courses/linux-bash/learn${REF} — dịch vụ, target và thứ tự phụ thuộc ở mức sâu.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.5 ─────────────────────────── */
    {
      title: '3.5 — The complete swap script|||3.5 — Script tráo hoàn chỉnh',
      slug: 'deploy-3-5-script-trao-hoan-chinh',
      type: 'LESSON',
      description: 'Ba lần tráo liên tiếp, 1.653 request, không cái nào hỏng. Nhưng lần chạy đầu tiên chỉ tráo được MỘT lần rồi tự khoá chính mình lại vĩnh viễn — và nguyên nhân là một mô tả tệp đi lạc vào chỗ không ai ngờ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>The complete swap script</h2>
<p class="lead">Everything in this chapter, assembled into one script and run three times in a row under continuous load. It works — but only after the first version deadlocked itself permanently on the second deploy, for a reason that took a look inside <code>/proc</code> to find.</p>

<h3>The script</h3>
<pre><code><span class="tok-comment">#!/bin/bash — trao.sh</span>
set -euo pipefail
GOC=/srv/app; CONG_A=3101; CONG_B=3102

<span class="tok-comment"># mot lan trao tai mot thoi diem (Bai 2.5)</span>
exec 9&gt;/var/lock/trao.lock
flock -w 30 9 || { echo "co lan trao khac dang chay" &gt;&amp;2; exit 1; }

<span class="tok-comment"># mau nao dang chay? mau kia la dich</span>
CU=\$(grep -oE '127\\.0\\.0\\.1:[0-9]+' "\$GOC/upstream.conf" | cut -d: -f2)
MOI=\$([ "\$CU" = "\$CONG_A" ] &amp;&amp; echo "\$CONG_B" || echo "\$CONG_A")
echo "  dang chay tren \$CU → se chuyen sang \$MOI"

<span class="tok-comment"># 1. khoi dong ban moi — 9&gt;&amp;- la BAT BUOC, xem duoi</span>
CONG=\$MOI setsid nohup node "\$GOC/hien-tai/app.mjs" \\
     &gt;"/var/log/app-\$MOI.log" 2&gt;&amp;1 &lt;/dev/null 9&gt;&amp;- &amp;
PID_MOI=\$!

<span class="tok-comment"># 2. cho toi khi no THAT SU tra loi</span>
san_sang=0
for i in \$(seq 1 60); do
  [ "\$(curl -s -o /dev/null -w '%{http_code}' --max-time 1 \\
        "http://127.0.0.1:\$MOI/health")" = "200" ] &amp;&amp; { san_sang=1; break; }
  sleep 0.1
done
if [ "\$san_sang" != 1 ]; then
  echo "ban moi KHONG len duoc — giu nguyen ban cu" &gt;&amp;2
  kill "\$PID_MOI" 2&gt;/dev/null || true
  exit 1
fi

<span class="tok-comment"># 3. chuyen luu luong</span>
echo "upstream ungdung { server 127.0.0.1:\$MOI; keepalive 16; }" &gt; "\$GOC/upstream.conf"
nginx -t &amp;&amp; nginx -s reload

<span class="tok-comment"># 4. kiem qua CUA TRUOC — va lui lai neu hong</span>
sleep 1
MA=\$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 http://127.0.0.1/health)
if [ "\$MA" != "200" ]; then
  echo "KIEM HONG (\$MA) — chuyen NGUOC ve \$CU" &gt;&amp;2
  echo "upstream ungdung { server 127.0.0.1:\$CU; keepalive 16; }" &gt; "\$GOC/upstream.conf"
  nginx -s reload
  exit 1
fi

<span class="tok-comment"># 5. gio moi dung ban cu, tu te</span>
sleep 1
kill -TERM "\$(ss -ltnp | grep \":\$CU \" | grep -o 'pid=[0-9]*' | cut -d= -f2)"</code></pre>


<div class="pitfall co-tieu-de"><strong>Trap — <code>pkill -f "CONG=\$MOI"</code> never matches: environment variables are not part of the command line.</strong> The first published version of this script cleaned up a failed new version with <code>pkill -f "CONG=\$MOI"</code>. <code>pkill -f</code> searches <code>/proc/&lt;pid&gt;/cmdline</code>, and <code>CONG=3102 node app.mjs</code> puts <code>CONG=3102</code> in the <em>environment</em>, not the command line — so the cleanup silently did nothing, left the broken process holding the port, and made the next deploy fail on it. Measured on the lab VPS:
<div class="out">$ CONG=3108 KHOI=0 setsid nohup node app.mjs &gt;/dev/null 2&gt;&amp;1 &lt;/dev/null &amp;
$ pgrep -af "CONG=3108"
  ma thoat: 1
$ tr '\\0' ' ' &lt; /proc/11664/cmdline
node app.mjs
$ tr '\\0' '\\n' &lt; /proc/11664/environ | grep CONG
CONG=3108</div>
<p>The script above is corrected: it keeps the PID with <code>PID_MOI=\$!</code> right after starting the process and kills exactly that. Under systemd (below) the question disappears — <code>systemctl stop app@3102</code> knows which process it started.</p></div>
<h3>Three deploys in a row, under load</h3>
<div class="out">  dang chay tren 3101 → se chuyen sang 3102
  ban moi san sang sau 200ms
  kiem qua proxy: 200
  da SIGTERM ban cu tren 3101 — XONG
  ── trao 1 xong ──
  dang chay tren 3102 → se chuyen sang 3101
  ...
  ── trao 2 xong ──
  dang chay tren 3101 → se chuyen sang 3102
  ...
  ── trao 3 xong ──

  200: 1653   loi ket noi: 0   ma khac: 0
  phan bo ban: {'v1': 96, 'v2': 338, 'v3': 344, 'v4': 875}</div>
<div class="callout ok"><strong>1,653 requests across three version changes, zero failures.</strong> The port ping-pongs between 3101 and 3102 — there is no "blue is always primary", just two slots and whichever one is not in use. All four versions appear in the distribution, so every swap really happened.</div>

<h3>The bug in the first version</h3>
${slide('dv-03', 26, 'Con của script thừa hưởng khoá deploy (dựng lại 29/09)')}
<p>The first run deployed once, correctly, and then every subsequent deploy printed this:</p>
<div class="out">  co lan trao khac dang chay
  ma thoat: 1</div>
<p>No deploy was running. The lock was held anyway, and it stayed held. Looking at what was holding it:</p>
<div class="out">  tien trinh ung dung dang chay: pid=2944
  --- no dang giu nhung mo ta tep nao trong /var/lock ---
    l-wx------ 1 root root 64 Aug 23 20:55 9 -&gt; /run/lock/trao.lock
  --- ai dang giu khoa tren trao.lock ---
    /run/lock/trao.lock: root 2944 F.... node</div>
<div class="pitfall"><strong>Trap — a background process started inside the locked section inherits the lock file descriptor and holds the lock for as long as it lives.</strong> <code>exec 9&gt;file</code> opens descriptor 9 in the shell; every child inherits it, including the application the deploy just started. The script exits and releases <em>its</em> copy — but the application is still running, still holding fd 9, and <code>flock</code> considers the lock held. So the deploy script locks itself out permanently, and the only cure is killing the application it just started. The application is the last process on earth that should be holding your deploy lock, and nothing about it looks wrong from the outside.</div>

<p>Reproduced on the lab VPS with a stripped-down script that forgets <code>9&gt;&amp;-</code> — the same symptom, and <code>fuser</code> names the culprit:</p>
<div class="out">$ bash khoa-sai.sh
  da chay app nen, pid=11626
  ma thoat: 0
$ bash khoa-sai.sh      # lan 2, khong con lan nao dang chay
co lan trao khac dang chay
  ma thoat: 1
$ ls -l /proc/11626/fd | grep lock
l-wx------ 1 deploy deploy 64 Sep 29 02:08 9 -&gt; /run/lock/trao.lock
$ fuser -v /run/lock/trao.lock
                     USER        PID ACCESS COMMAND
/run/lock/trao.lock: deploy    11626 F.... node</div>
<p>The fix is four characters — <code>9&gt;&amp;-</code> closes descriptor 9 in the child only:</p>
<pre><code>CONG=\$MOI setsid nohup node app.mjs &gt;log 2&gt;&amp;1 &lt;/dev/null <strong>9&gt;&amp;-</strong> &amp;</code></pre>
<div class="note-ct">The general form of this problem is worth carrying: <em>anything a script opens, its children inherit</em> — lock descriptors, log files, sockets, the SSH connection itself. Lesson 0.3 measured the version where an inherited stdin makes <code>ssh</code> hang forever; this is the same mechanism holding a lock instead. When a long-lived process is started from a script, close everything it does not need. <code>lsof -p &lt;pid&gt;</code> or <code>ls -l /proc/&lt;pid&gt;/fd</code> shows what it actually holds.</div>

<h3>The five things this script does that a naive one does not</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">It refuses to run twice at once</span><span class="lz-d">The lock from Lesson 2.5, with <code>-w 30</code> so a concurrent deploy waits rather than failing — the newest change wins.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">It works out its own direction</span><span class="lz-d">Reading the current port out of the config rather than being told. That makes it idempotent in the useful sense: run it twice and you get two deploys, not a broken state, and there is no argument to get wrong.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">It waits for readiness rather than sleeping</span><span class="lz-d">200 ms in the measurement above, because the app was warm. The same loop covers a 30-second startup without being told about it, and gives up after 6 seconds rather than hanging.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">It checks through the front door</span><span class="lz-d">Step 4 tests <code>http://127.0.0.1/health</code> — through Nginx — not the backend port directly. That is what catches a proxy config that reloaded into a broken state, which a backend check cannot see.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">It reverses itself when that check fails</span><span class="lz-d">Switching the upstream back and reloading. The old version is still running at that point — step 5 has not happened yet — so the rollback is instant and complete. This is why stopping the old version is last.</span></div>
</div>
<div class="callout warn"><strong>What this script still does not do.</strong> It does not handle database migrations, which have to happen at a specific point relative to all of this and cannot be reversed by switching a port — Chapter 5. It does not prune old releases, so the disk grows — Lesson 1.5. It does not tell anyone it ran. And its rollback only covers a failure it detects <em>during</em> the deploy; a bug that surfaces twenty minutes later needs Chapter 6.</div>

<h3>Version 2: the same script on systemd template units, with a smoke test</h3>
<p>Lesson 3.4 gave the application a service manager. Put the two together and the script gets simpler, not longer: systemd starts and stops the colours (no <code>nohup</code>, no inherited descriptors, no PID hunting), and a smoke test through the front door decides whether to keep the new version or fall back:</p>
<pre><code class="language-bash">#!/bin/bash
# trao.sh BAN — trao xanh/lam bang hai unit app@3101 / app@3102 sau nginx
set -euo pipefail
exec 9&gt;/tmp/trao.lock; flock -w 30 9 || { echo "co lan trao khac dang chay" &gt;&amp;2; exit 1; }
CU=\$(grep -oE '127\\.0\\.0\\.1:[0-9]+' /srv/app/upstream.conf | cut -d: -f2)
MOI=\$([ "\$CU" = 3101 ] &amp;&amp; echo 3102 || echo 3101)
echo "V=\${1:?can ten ban}" &gt; /srv/app/mau-\$MOI.env
sudo systemctl start app@\$MOI
for i in \$(seq 1 100); do
  [ "\$(curl -s -o /dev/null -w '%{http_code}' --max-time 1 \\
       http://127.0.0.1:\$MOI/health)" = 200 ] &amp;&amp; break
  [ "\$i" = 100 ] &amp;&amp; { sudo systemctl stop app@\$MOI; exit 1; }
  sleep 0.1
done
echo "upstream ungdung { server 127.0.0.1:\$MOI; keepalive 16; }" \\
  &gt; /srv/app/upstream.conf
sudo nginx -t -q &amp;&amp; sudo nginx -s reload
sleep 1
bash smoke.sh || { echo "SMOKE HONG — lui ve \$CU" &gt;&amp;2
  echo "upstream ungdung { server 127.0.0.1:\$CU; keepalive 16; }" &gt; /srv/app/upstream.conf
  sudo nginx -s reload; sleep 1; sudo systemctl stop app@\$MOI; exit 1; }
sudo systemctl stop app@\$CU
echo "  \$CU → \$MOI  xong"</code></pre>
<pre><code class="language-ini"># /etc/systemd/system/app@.service
[Unit]
Description=Ung dung web tren cong %i
StartLimitIntervalSec=60
StartLimitBurst=5

[Service]
Type=exec
User=deploy
WorkingDirectory=/srv/app/lab
EnvironmentFile=/srv/app/mau-%i.env
Environment=CONG=%i KHOI=1500 CHE_DO=tutu TRE=300
ExecStart=/usr/bin/node app.mjs
Restart=on-failure
RestartSec=2s
TimeoutStopSec=15s</code></pre>
${slide('dv-03', 23, 'Script tráo: khoá · chờ · chuyển · dừng (bản systemd)')}
<p>Three swaps under continuous load with 300 ms requests, then a fourth to a version that is missing a route — the smoke test catches it and the script switches back while the old version is still running:</p>
<div class="out">════ H) ba lan trao lien tiep bang systemd app@.service, request 300ms ════
  3101 → 3102  xong
  3102 → 3101  xong
  3101 → 3102  xong
--- tráo sang một bản THIẾU route mới (v1) ---
  HONG  404  /api/moi   ← route khong ton tai: tien trinh dang chay ban CU?
SMOKE HONG — lui ve 3102
  ma thoat: 1
  tong: 1607   200: 1607
  phan bo ban: {"v1":324,"v2":245,"v3":244,"v4":794}</div>
${slide('dv-03', 24, 'Ba lần tráo + một lần lùi: 0 lỗi')}
<div class="pitfall co-tieu-de"><strong>Trap — the rollback path has the same bug the main path avoided.</strong> The first version of the rollback reloaded Nginx and stopped the new version immediately — without the <code>sleep 1</code> the main path has — and that rollback produced its own failures:
<div class="out">  HONG  404  /api/moi   ← route khong ton tai: tien trinh dang chay ban CU?
SMOKE HONG — lui ve 3102
  ma thoat: 1
  tong: 1517   200: 1508   502: 9
  cua so hong: tu 11837ms den 11925ms (88ms)</div>
<p>Nine 502s, caused by the code that was supposed to protect users. Rollback branches run rarely, so nobody notices their bugs until the day they matter. Measure them with the request loop exactly like the main path — the corrected script above gave 1,607 out of 1,607.</p></div>

<h3>Smoke test after the swap: 404 means the old code is running</h3>
<p>A health check says the process is alive. A <strong>smoke test</strong> (a quick "does it light up" test) says the <em>new</em> code is the one answering: call a few parameter-less, no-login routes, including one that only the new version has, and treat 404 as a failure:</p>
<pre><code class="language-bash">#!/bin/bash
# smoke.sh — goi cac route KHONG tham so, KHONG can dang nhap. 404 = route chua gan = dang chay ban CU.
set -u
GOC=\${1:-http://127.0.0.1}
hong=0
for r in /health /api/moi; do
  ma=\$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "\$GOC\$r")
  case \$ma in
    200|401) echo "  ok    \$ma  \$r" ;;
    404)     echo "  HONG  \$ma  \$r   ← route khong ton tai: tien trinh dang chay ban CU?"; hong=1 ;;
    *)       echo "  HONG  \$ma  \$r"; hong=1 ;;
  esac
done
exit \$hong</code></pre>
<p>The lab VPS ran an app from the <code>/srv/app/hien-tai</code> symlink under a systemd unit, moved the symlink to v2 — which adds <code>/api/moi</code> — and "forgot" to restart:</p>
<div class="out">$ ln -sfn /srv/app/phat-hanh/v2 /srv/app/hien-tai
$ readlink /srv/app/hien-tai → /srv/app/phat-hanh/v2
$ curl -s localhost/ → v1
$ bash smoke.sh
  ok    200  /health
  HONG  404  /api/moi   ← route khong ton tai: tien trinh dang chay ban CU?
  ma thoat: 1
$ sudo readlink /proc/$(systemctl show web -p MainPID --value)/cwd → /srv/app/phat-hanh/v1
$ sudo systemctl restart web
$ bash smoke.sh
  ok    200  /health
  ok    401  /api/moi
  ma thoat: 0
$ sudo readlink /proc/$(systemctl show web -p MainPID --value)/cwd → /srv/app/phat-hanh/v2</div>
${slide('dv-03', 25, 'Smoke-test sau tráo: 404 nghĩa là bản CŨ')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>/health</code> was 200 the whole time</span><span class="v">The old process was perfectly healthy. Only a route that exists in the new version could tell the two apart.</span></div>
  <div class="kv"><span class="k">401 counts as a pass</span><span class="v">"Needs login" proves the route is mounted. That is why the smoke test uses unauthenticated calls and accepts 200 or 401.</span></div>
  <div class="kv"><span class="k"><code>/proc/PID/cwd</code> tells the truth</span><span class="v"><code>WorkingDirectory</code> follows the symlink when the process <em>starts</em>; afterwards the process stays in the old release directory whatever the symlink says.</span></div>
</div>
<div class="callout warn"><strong>This is a real incident, not a thought experiment.</strong> In a student project running on a VPS (cuongthai.com, 02/07), a <code>--no-build</code> deploy only synced files: the container kept running the old image, and a newly added route answered 404 all day while everything "deployed successfully". The deploy script has smoke-tested ever since — 401/200 means the route is mounted, 404 means a stale build — and the rule that came with it: when you add a new router, add one of its parameter-less, no-login GET routes to the smoke list. POST-only or parameter routes would fail every deploy for the wrong reason.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your team's deploy is now a script, but "it printed <em>done</em>" is the only evidence it worked. Make the script prove it: zero failed requests across several swaps, and an automatic fall-back when the new version is wrong.</p>
<ol>
<li>On the lab VPS, install <code>app@.service</code> and <code>trao.sh</code> (version 2 above) and <code>smoke.sh</code>; start <code>app@3101</code> and point <code>upstream.conf</code> at it.</li>
<li>With <code>vong.sh</code> running for 20 s, run <code>for v in v2 v3 v4; do bash trao.sh \$v; done</code>.</li>
<li>Run it once more with a version that lacks the new route and confirm the script prints <code>SMOKE HONG</code>, exits 1, and traffic stays on the old colour.</li>
<li>Delete the <code>sleep 1</code> in the rollback branch, repeat step 3, and count the 502s it causes. Put it back.</li>
</ol>
<p><strong>Done when:</strong> the loop shows 0 non-200 lines for the three swaps plus the rollback, you have a number for the broken rollback, and <code>cat /srv/app/upstream.conf</code> after step 3 still names the old port.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Smoke test</span><span class="v">A handful of quick requests right after a deploy that prove the <em>new</em> code is answering.</span></div>
  <div class="kv"><span class="k">Rollback</span><span class="v">Returning traffic to the previous version — instant here, because it is still running.</span></div>
  <div class="kv"><span class="k">File descriptor inheritance</span><span class="v">A child process gets copies of every descriptor its parent had open, including locks.</span></div>
  <div class="kv"><span class="k"><code>flock</code></span><span class="v">An advisory lock on a file, held as long as any process keeps the descriptor open.</span></div>
  <div class="kv"><span class="k"><code>\$!</code></span><span class="v">The PID of the last background command — the reliable way to remember what you started.</span></div>
  <div class="kv"><span class="k">Idempotent script</span><span class="v">Safe to run again: it works out its own state instead of trusting arguments.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A complete swap script is: lock, start new, wait for health, switch, smoke-test, then stop old — or roll back while old is still running.</li>
<li>On systemd template units the same swap ran three times plus a rollback with 1,607 of 1,607 requests answered.</li>
<li>The rollback branch needs the same pause after reload as the main path; without it, the rollback itself caused 9 × 502.</li>
<li>A smoke test must hit a route that only the new version has: <code>/health</code> stayed 200 on the old code, <code>/api/moi</code> said 404.</li>
<li>Background processes inherit the deploy lock unless you close it with <code>9&gt;&amp;-</code>; systemd-started services do not.</li>
<li><code>pkill -f</code> cannot see environment variables — remember PIDs with <code>\$!</code> or let the service manager stop what it started.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">bash(1) — redirections, and closing a descriptor</span><span class="lc-sub">gnu.org/software/bash/manual/bash.html#Redirections — the <code>n&gt;&amp;-</code> form that fixed the lock bug, in the section nobody reads until they need it.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">fuser(1) and lsof(8)</span><span class="lc-sub">man7.org/linux/man-pages/man1/fuser.1.html — finding which process holds a file or a lock, which is how the bug above was identified rather than guessed at.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">proc(5) — the fd directory</span><span class="lc-sub">man7.org/linux/man-pages/man5/proc.html — <code>/proc/&lt;pid&gt;/fd</code>, which shows every descriptor a process holds and where it points.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — file descriptors and what children inherit</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the mechanism behind both this bug and the hanging-ssh one in Lesson 0.3.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Script tráo hoàn chỉnh</h2>
<p class="lead">Toàn bộ chương này, lắp thành một script và chạy ba lần liên tiếp dưới tải liên tục. Nó chạy được — nhưng chỉ SAU KHI bản đầu tiên tự khoá chính nó lại vĩnh viễn ở lần deploy thứ hai, vì một lý do phải ngó vào tận <code>/proc</code> mới tìm ra.</p>

<h3>Cái script</h3>
<pre><code><span class="tok-comment">#!/bin/bash — trao.sh</span>
set -euo pipefail
GOC=/srv/app; CONG_A=3101; CONG_B=3102

<span class="tok-comment"># mot lan trao tai mot thoi diem (Bai 2.5)</span>
exec 9&gt;/var/lock/trao.lock
flock -w 30 9 || { echo "co lan trao khac dang chay" &gt;&amp;2; exit 1; }

<span class="tok-comment"># mau nao dang chay? mau kia la dich</span>
CU=\$(grep -oE '127\\.0\\.0\\.1:[0-9]+' "\$GOC/upstream.conf" | cut -d: -f2)
MOI=\$([ "\$CU" = "\$CONG_A" ] &amp;&amp; echo "\$CONG_B" || echo "\$CONG_A")
echo "  dang chay tren \$CU → se chuyen sang \$MOI"

<span class="tok-comment"># 1. khoi dong ban moi — 9&gt;&amp;- la BAT BUOC, xem duoi</span>
CONG=\$MOI setsid nohup node "\$GOC/hien-tai/app.mjs" \\
     &gt;"/var/log/app-\$MOI.log" 2&gt;&amp;1 &lt;/dev/null 9&gt;&amp;- &amp;
PID_MOI=\$!

<span class="tok-comment"># 2. cho toi khi no THAT SU tra loi</span>
san_sang=0
for i in \$(seq 1 60); do
  [ "\$(curl -s -o /dev/null -w '%{http_code}' --max-time 1 \\
        "http://127.0.0.1:\$MOI/health")" = "200" ] &amp;&amp; { san_sang=1; break; }
  sleep 0.1
done
if [ "\$san_sang" != 1 ]; then
  echo "ban moi KHONG len duoc — giu nguyen ban cu" &gt;&amp;2
  kill "\$PID_MOI" 2&gt;/dev/null || true
  exit 1
fi

<span class="tok-comment"># 3. chuyen luu luong</span>
echo "upstream ungdung { server 127.0.0.1:\$MOI; keepalive 16; }" &gt; "\$GOC/upstream.conf"
nginx -t &amp;&amp; nginx -s reload

<span class="tok-comment"># 4. kiem qua CUA TRUOC — va lui lai neu hong</span>
sleep 1
MA=\$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 http://127.0.0.1/health)
if [ "\$MA" != "200" ]; then
  echo "KIEM HONG (\$MA) — chuyen NGUOC ve \$CU" &gt;&amp;2
  echo "upstream ungdung { server 127.0.0.1:\$CU; keepalive 16; }" &gt; "\$GOC/upstream.conf"
  nginx -s reload
  exit 1
fi

<span class="tok-comment"># 5. gio moi dung ban cu, tu te</span>
sleep 1
kill -TERM "\$(ss -ltnp | grep \":\$CU \" | grep -o 'pid=[0-9]*' | cut -d= -f2)"</code></pre>


<div class="pitfall co-tieu-de"><strong>Bẫy — <code>pkill -f "CONG=\$MOI"</code> không bao giờ khớp: biến môi trường KHÔNG nằm trong dòng lệnh.</strong> Bản đầu tiên được đăng của script này dọn một bản mới hỏng bằng <code>pkill -f "CONG=\$MOI"</code>. <code>pkill -f</code> tìm trong <code>/proc/&lt;pid&gt;/cmdline</code>, mà <code>CONG=3102 node app.mjs</code> đặt <code>CONG=3102</code> vào <em>BIẾN MÔI TRƯỜNG</em> chứ không vào dòng lệnh — nên bước dọn âm thầm chẳng làm gì, để tiến trình hỏng giữ nguyên cái cổng, và lần deploy sau hỏng vì nó. Đo trên VPS thí nghiệm:
<div class="out">$ CONG=3108 KHOI=0 setsid nohup node app.mjs &gt;/dev/null 2&gt;&amp;1 &lt;/dev/null &amp;
$ pgrep -af "CONG=3108"
  ma thoat: 1
$ tr '\\0' ' ' &lt; /proc/11664/cmdline
node app.mjs
$ tr '\\0' '\\n' &lt; /proc/11664/environ | grep CONG
CONG=3108</div>
<p>Script ở trên đã được SỬA: nó giữ PID bằng <code>PID_MOI=\$!</code> ngay sau khi khởi động tiến trình và giết đúng cái đó. Dưới systemd (ở dưới) câu hỏi này biến mất — <code>systemctl stop app@3102</code> biết nó đã khởi động tiến trình nào.</p></div>
<h3>Ba lần deploy liên tiếp, dưới tải</h3>
<div class="out">  dang chay tren 3101 → se chuyen sang 3102
  ban moi san sang sau 200ms
  kiem qua proxy: 200
  da SIGTERM ban cu tren 3101 — XONG
  ── trao 1 xong ──
  dang chay tren 3102 → se chuyen sang 3101
  ...
  ── trao 2 xong ──
  dang chay tren 3101 → se chuyen sang 3102
  ...
  ── trao 3 xong ──

  200: 1653   loi ket noi: 0   ma khac: 0
  phan bo ban: {'v1': 96, 'v2': 338, 'v3': 344, 'v4': 875}</div>
<div class="callout ok"><strong>1.653 request xuyên qua ba lần đổi phiên bản, KHÔNG cái nào hỏng.</strong> Cái cổng nảy qua nảy lại giữa 3101 và 3102 — không có chuyện "xanh luôn là chính", chỉ có HAI CHỖ và cái nào đang trống thì dùng. Cả bốn phiên bản đều xuất hiện trong bảng phân bố, nên mọi lần tráo đều đã thật sự xảy ra.</div>

<h3>Cái lỗi trong bản đầu tiên</h3>
${slide('dv-03', 26, 'Con của script thừa hưởng khoá deploy (dựng lại 29/09)')}
<p>Lần chạy đầu tiên deploy được MỘT lần, đúng đắn, rồi mọi lần deploy sau đó đều in ra thế này:</p>
<div class="out">  co lan trao khac dang chay
  ma thoat: 1</div>
<p>Chẳng có lần deploy nào đang chạy cả. Cái khoá vẫn bị giữ, và nó cứ bị giữ mãi. Ngó xem cái gì đang giữ nó:</p>
<div class="out">  tien trinh ung dung dang chay: pid=2944
  --- no dang giu nhung mo ta tep nao trong /var/lock ---
    l-wx------ 1 root root 64 Aug 23 20:55 9 -&gt; /run/lock/trao.lock
  --- ai dang giu khoa tren trao.lock ---
    /run/lock/trao.lock: root 2944 F.... node</div>
<div class="pitfall"><strong>Bẫy — một tiến trình nền khởi động BÊN TRONG vùng đã khoá sẽ THỪA HƯỞNG mô tả tệp khoá và giữ cái khoá suốt đời nó.</strong> <code>exec 9&gt;file</code> mở mô tả tệp số 9 trong shell; MỌI tiến trình con đều thừa hưởng nó, kể cả cái ứng dụng mà lần deploy vừa khởi động. Script thoát và nhả bản sao của CHÍNH NÓ — nhưng ứng dụng thì vẫn chạy, vẫn giữ fd 9, và <code>flock</code> coi như cái khoá vẫn đang bị giữ. Thế là script deploy tự khoá mình ra ngoài VĨNH VIỄN, và cách chữa duy nhất là giết cái ứng dụng mà nó vừa khởi động. Ứng dụng là tiến trình cuối cùng trên đời này nên giữ cái khoá deploy của bạn, và nhìn từ bên ngoài thì chẳng có gì ở nó trông sai cả.</div>

<p>Dựng lại trên VPS thí nghiệm bằng một script rút gọn QUÊN <code>9&gt;&amp;-</code> — đúng triệu chứng đó, và <code>fuser</code> gọi đích danh thủ phạm:</p>
<div class="out">$ bash khoa-sai.sh
  da chay app nen, pid=11626
  ma thoat: 0
$ bash khoa-sai.sh      # lan 2, khong con lan nao dang chay
co lan trao khac dang chay
  ma thoat: 1
$ ls -l /proc/11626/fd | grep lock
l-wx------ 1 deploy deploy 64 Sep 29 02:08 9 -&gt; /run/lock/trao.lock
$ fuser -v /run/lock/trao.lock
                     USER        PID ACCESS COMMAND
/run/lock/trao.lock: deploy    11626 F.... node</div>
<p>Cách sửa gồm bốn ký tự — <code>9&gt;&amp;-</code> đóng mô tả tệp số 9 CHỈ trong tiến trình con:</p>
<pre><code>CONG=\$MOI setsid nohup node app.mjs &gt;log 2&gt;&amp;1 &lt;/dev/null <strong>9&gt;&amp;-</strong> &amp;</code></pre>
<div class="note-ct">Dạng tổng quát của vấn đề này đáng mang theo: <em>bất cứ thứ gì một script MỞ RA thì con của nó THỪA HƯỞNG</em> — mô tả tệp khoá, tệp log, socket, và cả chính kết nối SSH. Bài 0.3 đã đo phiên bản mà một stdin bị thừa hưởng làm <code>ssh</code> treo mãi mãi; đây là cùng cơ chế ấy, chỉ khác là nó đang giữ một cái khoá. Khi khởi động một tiến trình sống lâu từ một script, hãy ĐÓNG mọi thứ nó không cần. <code>lsof -p &lt;pid&gt;</code> hoặc <code>ls -l /proc/&lt;pid&gt;/fd</code> cho thấy nó thật sự đang giữ những gì.</div>

<h3>Năm việc script này làm mà một script ngây thơ thì không</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nó từ chối chạy hai lần cùng lúc</span><span class="lz-d">Cái khoá ở Bài 2.5, kèm <code>-w 30</code> để một lần deploy chồng lên thì CHỜ chứ không hỏng — thay đổi mới nhất thắng.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nó tự tính ra hướng đi của mình</span><span class="lz-d">Đọc cổng hiện hành ra từ cấu hình thay vì được người ta bảo. Nhờ đó nó bất biến khi lặp lại theo nghĩa hữu ích: chạy hai lần thì ra hai lần deploy, chứ không ra một trạng thái hỏng, và chẳng có tham số nào để gõ nhầm.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nó CHỜ sẵn sàng chứ không ngủ</span><span class="lz-d">200 ms trong phép đo ở trên, vì ứng dụng đang nóng. Vẫn vòng lặp đó phủ được một lần khởi động 30 giây mà chẳng cần ai báo trước, và nó bỏ cuộc sau 6 giây thay vì treo.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nó kiểm qua CỬA TRƯỚC</span><span class="lz-d">Bước 4 thử <code>http://127.0.0.1/health</code> — đi XUYÊN QUA Nginx — chứ không thử thẳng vào cổng backend. Đó mới là thứ bắt được một cấu hình proxy vừa nạp lại vào một trạng thái hỏng, thứ mà một phép kiểm ở backend không nhìn thấy.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Nó TỰ ĐẢO NGƯỢC khi phép kiểm đó hỏng</span><span class="lz-d">Chuyển upstream về lại rồi nạp lại. Ở thời điểm đó bản CŨ VẪN ĐANG CHẠY — bước 5 chưa xảy ra — nên cú lùi bản là tức thì và trọn vẹn. Đây chính là lý do việc dừng bản cũ phải nằm SAU CÙNG.</span></div>
</div>
<div class="callout warn"><strong>Những gì script này VẪN chưa làm.</strong> Nó không xử lý migration cơ sở dữ liệu, thứ phải xảy ra ở một thời điểm cụ thể so với tất cả những cái trên và KHÔNG đảo ngược được bằng cách đổi một số cổng — Chương 5. Nó không dọn bớt bản phát hành cũ, nên đĩa cứ phình ra — Bài 1.5. Nó không báo cho ai biết là nó đã chạy. Và cú lùi bản của nó chỉ phủ được một sự cố mà nó PHÁT HIỆN RA TRONG LÚC deploy; một cái lỗi lộ ra hai mươi phút sau thì cần Chương 6.</div>

<h3>Bản 2: cùng script đó trên unit khuôn của systemd, kèm smoke-test</h3>
<p>Bài 3.4 đã cho ứng dụng một trình quản lý dịch vụ. Ghép hai thứ lại thì script GỌN hơn chứ không dài hơn: systemd khởi động và dừng từng màu (không <code>nohup</code>, không mô tả tệp bị thừa hưởng, không phải đi săn PID), và một smoke-test đi qua cửa trước quyết định giữ bản mới hay lùi về:</p>
<pre><code class="language-bash">#!/bin/bash
# trao.sh BAN — trao xanh/lam bang hai unit app@3101 / app@3102 sau nginx
set -euo pipefail
exec 9&gt;/tmp/trao.lock; flock -w 30 9 || { echo "co lan trao khac dang chay" &gt;&amp;2; exit 1; }
CU=\$(grep -oE '127\\.0\\.0\\.1:[0-9]+' /srv/app/upstream.conf | cut -d: -f2)
MOI=\$([ "\$CU" = 3101 ] &amp;&amp; echo 3102 || echo 3101)
echo "V=\${1:?can ten ban}" &gt; /srv/app/mau-\$MOI.env
sudo systemctl start app@\$MOI
for i in \$(seq 1 100); do
  [ "\$(curl -s -o /dev/null -w '%{http_code}' --max-time 1 \\
       http://127.0.0.1:\$MOI/health)" = 200 ] &amp;&amp; break
  [ "\$i" = 100 ] &amp;&amp; { sudo systemctl stop app@\$MOI; exit 1; }
  sleep 0.1
done
echo "upstream ungdung { server 127.0.0.1:\$MOI; keepalive 16; }" \\
  &gt; /srv/app/upstream.conf
sudo nginx -t -q &amp;&amp; sudo nginx -s reload
sleep 1
bash smoke.sh || { echo "SMOKE HONG — lui ve \$CU" &gt;&amp;2
  echo "upstream ungdung { server 127.0.0.1:\$CU; keepalive 16; }" &gt; /srv/app/upstream.conf
  sudo nginx -s reload; sleep 1; sudo systemctl stop app@\$MOI; exit 1; }
sudo systemctl stop app@\$CU
echo "  \$CU → \$MOI  xong"</code></pre>
<pre><code class="language-ini"># /etc/systemd/system/app@.service
[Unit]
Description=Ung dung web tren cong %i
StartLimitIntervalSec=60
StartLimitBurst=5

[Service]
Type=exec
User=deploy
WorkingDirectory=/srv/app/lab
EnvironmentFile=/srv/app/mau-%i.env
Environment=CONG=%i KHOI=1500 CHE_DO=tutu TRE=300
ExecStart=/usr/bin/node app.mjs
Restart=on-failure
RestartSec=2s
TimeoutStopSec=15s</code></pre>
${slide('dv-03', 23, 'Script tráo: khoá · chờ · chuyển · dừng (bản systemd)')}
<p>Ba lần tráo dưới tải liên tục với request 300 ms, rồi lần thứ tư sang một bản THIẾU một route — smoke-test bắt được và script chuyển về trong lúc bản cũ vẫn đang chạy:</p>
<div class="out">════ H) ba lan trao lien tiep bang systemd app@.service, request 300ms ════
  3101 → 3102  xong
  3102 → 3101  xong
  3101 → 3102  xong
--- tráo sang một bản THIẾU route mới (v1) ---
  HONG  404  /api/moi   ← route khong ton tai: tien trinh dang chay ban CU?
SMOKE HONG — lui ve 3102
  ma thoat: 1
  tong: 1607   200: 1607
  phan bo ban: {"v1":324,"v2":245,"v3":244,"v4":794}</div>
${slide('dv-03', 24, 'Ba lần tráo + một lần lùi: 0 lỗi')}
<div class="pitfall co-tieu-de"><strong>Bẫy — nhánh lùi mang đúng cái lỗi mà nhánh chính đã tránh.</strong> Bản đầu của nhánh lùi nạp lại nginx rồi dừng bản mới NGAY — thiếu dòng <code>sleep 1</code> mà nhánh chính có — và chính cú lùi đó sinh ra lỗi của riêng nó:
<div class="out">  HONG  404  /api/moi   ← route khong ton tai: tien trinh dang chay ban CU?
SMOKE HONG — lui ve 3102
  ma thoat: 1
  tong: 1517   200: 1508   502: 9
  cua so hong: tu 11837ms den 11925ms (88ms)</div>
<p>Chín cú 502, gây ra bởi đúng đoạn mã lẽ ra phải BẢO VỆ người dùng. Nhánh lùi hiếm khi chạy, nên chẳng ai thấy lỗi của nó cho tới đúng cái ngày nó quan trọng. Hãy đo nó bằng vòng request y như nhánh chính — script đã sửa ở trên cho ra 1.607 trên 1.607.</p></div>

<h3>Smoke-test sau khi tráo: 404 nghĩa là mã CŨ đang chạy</h3>
<p>Một phép kiểm sức khoẻ nói tiến trình còn sống. Một <strong>smoke test</strong> (phép thử khói — cắm điện xem có bốc khói không) nói mã <em>MỚI</em> mới là thứ đang trả lời: gọi vài route không tham số, không cần đăng nhập, trong đó có một route chỉ bản mới có, và coi 404 là hỏng:</p>
<pre><code class="language-bash">#!/bin/bash
# smoke.sh — goi cac route KHONG tham so, KHONG can dang nhap. 404 = route chua gan = dang chay ban CU.
set -u
GOC=\${1:-http://127.0.0.1}
hong=0
for r in /health /api/moi; do
  ma=\$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "\$GOC\$r")
  case \$ma in
    200|401) echo "  ok    \$ma  \$r" ;;
    404)     echo "  HONG  \$ma  \$r   ← route khong ton tai: tien trinh dang chay ban CU?"; hong=1 ;;
    *)       echo "  HONG  \$ma  \$r"; hong=1 ;;
  esac
done
exit \$hong</code></pre>
<p>VPS thí nghiệm chạy một app từ symlink <code>/srv/app/hien-tai</code> dưới một unit systemd, dời symlink sang v2 — bản thêm <code>/api/moi</code> — rồi "quên" khởi động lại:</p>
<div class="out">$ ln -sfn /srv/app/phat-hanh/v2 /srv/app/hien-tai
$ readlink /srv/app/hien-tai → /srv/app/phat-hanh/v2
$ curl -s localhost/ → v1
$ bash smoke.sh
  ok    200  /health
  HONG  404  /api/moi   ← route khong ton tai: tien trinh dang chay ban CU?
  ma thoat: 1
$ sudo readlink /proc/$(systemctl show web -p MainPID --value)/cwd → /srv/app/phat-hanh/v1
$ sudo systemctl restart web
$ bash smoke.sh
  ok    200  /health
  ok    401  /api/moi
  ma thoat: 0
$ sudo readlink /proc/$(systemctl show web -p MainPID --value)/cwd → /srv/app/phat-hanh/v2</div>
${slide('dv-03', 25, 'Smoke-test sau tráo: 404 nghĩa là bản CŨ')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>/health</code> trả 200 suốt</span><span class="v">Tiến trình cũ hoàn toàn khoẻ mạnh. Chỉ một route có trong bản mới mới phân biệt được hai bản.</span></div>
  <div class="kv"><span class="k">401 được tính là ĐẠT</span><span class="v">"Cần đăng nhập" chứng minh route đã được gắn. Vì thế smoke-test gọi không đăng nhập và chấp nhận 200 hoặc 401.</span></div>
  <div class="kv"><span class="k"><code>/proc/PID/cwd</code> nói thật</span><span class="v"><code>WorkingDirectory</code> đi theo symlink lúc tiến trình <em>KHỞI ĐỘNG</em>; sau đó tiến trình ở lại thư mục bản cũ, symlink nói gì cũng mặc.</span></div>
</div>
<div class="callout warn"><strong>Đây là sự cố thật, không phải thí nghiệm tưởng tượng.</strong> Ở một dự án sinh viên chạy trên VPS (cuongthai.com, 02/07), một lần deploy <code>--no-build</code> chỉ đồng bộ tệp: container vẫn chạy ảnh CŨ, và một route vừa thêm trả 404 cả ngày trong khi mọi thứ "deploy thành công". Từ đó script deploy luôn smoke-test — 401/200 nghĩa là route đã gắn, 404 nghĩa là bản build cũ — kèm một luật: thêm router mới thì thêm một route GET không tham số, không đăng nhập của nó vào danh sách smoke. Route chỉ có POST hay cần tham số sẽ làm mọi lần deploy hỏng vì một lý do sai.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> deploy của nhóm giờ đã là một script, nhưng "nó in ra <em>xong</em>" là bằng chứng duy nhất rằng nó chạy đúng. Bắt script tự chứng minh: không request nào hỏng qua nhiều lần tráo, và tự lùi về khi bản mới sai.</p>
<ol>
<li>Trên VPS thí nghiệm, cài <code>app@.service</code>, <code>trao.sh</code> (bản 2 ở trên) và <code>smoke.sh</code>; chạy <code>app@3101</code> và trỏ <code>upstream.conf</code> vào nó.</li>
<li>Trong lúc <code>vong.sh</code> chạy 20 giây, chạy <code>for v in v2 v3 v4; do bash trao.sh \$v; done</code>.</li>
<li>Chạy thêm một lần với một bản thiếu route mới và xác nhận script in <code>SMOKE HONG</code>, thoát 1, và lưu lượng vẫn ở màu cũ.</li>
<li>Xoá <code>sleep 1</code> trong nhánh lùi, làm lại bước 3, đếm số 502 nó gây ra. Rồi trả nó về.</li>
</ol>
<p><strong>Đạt khi:</strong> vòng request cho 0 dòng khác 200 qua ba lần tráo cộng lần lùi, bạn có con số cho nhánh lùi bị hỏng, và <code>cat /srv/app/upstream.conf</code> sau bước 3 vẫn ghi cổng cũ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Smoke test (phép thử khói)</span><span class="v">Vài request nhanh ngay sau deploy để chứng minh mã <em>MỚI</em> đang trả lời.</span></div>
  <div class="kv"><span class="k">Rollback (lùi bản)</span><span class="v">Đưa lưu lượng về bản trước — tức thì ở đây, vì bản đó vẫn đang chạy.</span></div>
  <div class="kv"><span class="k">File descriptor inheritance (thừa hưởng mô tả tệp)</span><span class="v">Tiến trình con nhận bản sao của mọi mô tả tệp cha đang mở, kể cả khoá.</span></div>
  <div class="kv"><span class="k"><code>flock</code> (khoá tệp)</span><span class="v">Một khoá tư vấn trên một tệp, còn bị giữ chừng nào còn tiến trình mở mô tả tệp đó.</span></div>
  <div class="kv"><span class="k"><code>\$!</code> (PID nền cuối)</span><span class="v">PID của lệnh chạy nền gần nhất — cách chắc chắn để nhớ mình đã khởi động cái gì.</span></div>
  <div class="kv"><span class="k">Idempotent script (script chạy lại an toàn)</span><span class="v">Chạy lại vẫn an toàn: nó tự tính trạng thái của mình thay vì tin vào tham số.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một script tráo hoàn chỉnh là: khoá, chạy bản mới, chờ sức khoẻ, chuyển, smoke-test, rồi dừng bản cũ — hoặc lùi về khi bản cũ vẫn còn chạy.</li>
<li>Trên unit khuôn của systemd, cùng cú tráo đó chạy ba lần cộng một lần lùi với 1.607 trên 1.607 request được trả lời.</li>
<li>Nhánh lùi cần cùng khoảng chờ sau reload như nhánh chính; thiếu nó, chính cú lùi gây ra 9 cú 502.</li>
<li>Smoke-test phải gọi một route chỉ bản mới có: <code>/health</code> vẫn 200 trên mã cũ, <code>/api/moi</code> mới nói 404.</li>
<li>Tiến trình nền thừa hưởng khoá deploy trừ khi bạn đóng nó bằng <code>9&gt;&amp;-</code>; dịch vụ do systemd khởi động thì không.</li>
<li><code>pkill -f</code> không nhìn thấy biến môi trường — nhớ PID bằng <code>\$!</code> hoặc để trình quản lý dịch vụ dừng thứ nó đã khởi động.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">bash(1) — chuyển hướng, và đóng một mô tả tệp</span><span class="lc-sub">gnu.org/software/bash/manual/bash.html#Redirections — dạng <code>n&gt;&amp;-</code> đã sửa được lỗi khoá ở trên, nằm trong mục mà chẳng ai đọc cho tới khi cần tới.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">fuser(1) và lsof(8)</span><span class="lc-sub">man7.org/linux/man-pages/man1/fuser.1.html — tìm xem tiến trình nào đang giữ một tệp hay một cái khoá, và đó là cách cái lỗi ở trên được TÌM RA chứ không phải được đoán.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">proc(5) — thư mục fd</span><span class="lc-sub">man7.org/linux/man-pages/man5/proc.html — <code>/proc/&lt;pid&gt;/fd</code>, nơi cho thấy mọi mô tả tệp một tiến trình đang giữ và chúng trỏ đi đâu.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — mô tả tệp và thứ mà tiến trình con thừa hưởng</span><span class="lc-sub">/courses/linux-bash/learn${REF} — cơ chế nằm sau cả cái lỗi này lẫn cái lỗi ssh-treo ở Bài 0.3.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.6 ─────────────────────────── */
    {
      title: '3.6 — Quiz: the swap|||3.6 — Quiz: bước tráo',
      slug: 'deploy-3-6-quiz',
      type: 'QUIZ',
      description: 'Mười câu tình huống: systemctl restart làm rơi 502, SIGTERM không ai bắt, cờ 503, kết nối chưa thành request giữ tiến trình, dừng bản cũ ngay sau reload, nginx giữ IP cũ, StartLimit sai mục, symlink đổi mà tiến trình không, nhánh lùi tự gây 502, và sleep thay cho /health.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.6</span>
<h2>Quiz: the swap</h2>
<p class="lead">Ten questions from a chapter in which three separate things were accepted without complaint and then silently did nothing — a Node option, a systemd directive, and a drain flag that made everything worse.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can measure a swap with a request loop and read off the failure window, and I know why behind Nginx the failures are 502s rather than refusals.</li>
<li>I can write a SIGTERM handler that closes the listener at once, serves accepted requests unchanged, closes pools and exits before its own deadline.</li>
<li>I can explain what keeps <code>server.close()</code> waiting on current Node, and why the supervisor's timeout must exceed my deadline.</li>
<li>I can run a blue-green swap behind Nginx: start new, poll <code>/health</code>, rewrite the upstream, reload, pause, stop old — and say why each step is there.</li>
<li>I can write and verify a systemd unit with <code>Restart=on-failure</code> and a start limit in the right section, and read restart timing from the journal.</li>
<li>I can add a smoke test that proves the new code answers, and a rollback branch that does not cause its own failures.</li>
</ul>
${slide('dv-03', 28, 'Bảng tra nhanh Chương 3 (1/2): tín hiệu và nginx')}
${slide('dv-03', 29, 'Bảng tra nhanh Chương 3 (2/2): systemd')}
<div class="callout">
<p><strong>What this chapter established.</strong> The naive stop-then-start deploy lost <strong>168 of 514</strong> requests, all as connection errors with no HTTP status at all, and the outage lasted exactly as long as the application's startup time (3.1). <code>SIGKILL</code> abandoned ten in-flight requests with no response; <code>SIGTERM</code> kept them — but the first drain implementation answered all ten with <code>503</code>, because the handler consulted the shutdown flag <em>after</em> accepting the request, which from the user's side is a failed request either way. Serving them unchanged and adding only <code>Connection: close</code> produced ten <code>200</code>s with the listening socket already gone (3.2). Reordering the same deploy — start new, wait for readiness, switch traffic, stop old — produced <strong>733 requests and zero failures</strong>; and <code>reusePort: true</code> was accepted by Node v20.20.2 and did nothing, the second process still failing with <code>EADDRINUSE</code> (3.3). <code>nohup</code> does not restart anything: after a crash the port stayed closed indefinitely — and <code>systemd-analyze verify</code> found <code>StartLimitIntervalSec</code> in the wrong section, where systemd ignores it silently (3.4). Finally, the assembled script deployed once and then locked itself out forever, because the application it started inherited the lock file descriptor and held <code>/run/lock/trao.lock</code> for its entire life; <code>9&gt;&amp;-</code> fixed it, and three consecutive swaps then ran 1,653 requests with zero failures (3.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.6</span>
<h2>Quiz: bước tráo</h2>
<p class="lead">Mười câu ra từ một chương mà BA thứ khác nhau đều được chấp nhận không kêu ca gì rồi lặng lẽ chẳng làm gì cả — một tuỳ chọn của Node, một chỉ thị của systemd, và một cái cờ xả làm mọi thứ tệ hơn.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đo được một lần tráo bằng vòng request và đọc ra cửa sổ hỏng, và biết vì sao sau nginx lỗi là 502 chứ không phải "bị từ chối".</li>
<li>Tôi viết được bộ xử lý SIGTERM đóng cổng nghe ngay, phục vụ nguyên vẹn request đã nhận, đóng pool và thoát trước hạn chót của chính nó.</li>
<li>Tôi giải thích được thứ gì làm <code>server.close()</code> phải chờ trên Node hiện nay, và vì sao timeout của trình giám sát phải dài hơn hạn chót của tôi.</li>
<li>Tôi chạy được một cú tráo xanh/lam sau nginx: chạy bản mới, hỏi <code>/health</code>, ghi lại upstream, reload, chờ, dừng bản cũ — và nói được vì sao có từng bước.</li>
<li>Tôi viết và kiểm được một unit systemd có <code>Restart=on-failure</code> với giới hạn khởi động đặt đúng mục, và đọc được thời gian chạy lại từ journal.</li>
<li>Tôi thêm được một smoke-test chứng minh mã mới đang trả lời, và một nhánh lùi không tự gây ra lỗi.</li>
</ul>
${slide('dv-03', 28, 'Bảng tra nhanh Chương 3 (1/2): tín hiệu và nginx')}
${slide('dv-03', 29, 'Bảng tra nhanh Chương 3 (2/2): systemd')}
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Lần deploy ngây thơ kiểu dừng-rồi-chạy-lại làm mất <strong>168 trên 514</strong> request, tất cả đều là lỗi KẾT NỐI không hề có mã HTTP nào, và cái gián đoạn kéo dài ĐÚNG BẰNG thời gian khởi động của ứng dụng (3.1). <code>SIGKILL</code> bỏ rơi mười request đang bay mà không trả lời gì; <code>SIGTERM</code> giữ được chúng — nhưng bản xả đầu tiên trả lời cả mười bằng <code>503</code>, vì bộ xử lý đi kiểm cái cờ tắt SAU KHI đã nhận request, mà từ phía người dùng thì đằng nào cũng là một request hỏng. Phục vụ chúng NGUYÊN VẸN và chỉ thêm <code>Connection: close</code> thì cho ra mười cú <code>200</code> với cái socket lắng nghe đã biến mất từ trước (3.2). Xếp lại thứ tự đúng lần deploy ấy — khởi động cái mới, chờ sẵn sàng, chuyển lưu lượng, dừng cái cũ — cho ra <strong>733 request và KHÔNG cái nào hỏng</strong>; còn <code>reusePort: true</code> thì được Node v20.20.2 chấp nhận và chẳng làm gì, tiến trình thứ hai vẫn hỏng với <code>EADDRINUSE</code> (3.3). <code>nohup</code> không khởi động lại bất cứ thứ gì: sau một cú sập thì cái cổng đóng vô thời hạn — và <code>systemd-analyze verify</code> tìm ra <code>StartLimitIntervalSec</code> nằm sai mục, chỗ mà systemd phớt lờ nó trong im lặng (3.4). Cuối cùng, cái script đã lắp xong deploy được một lần rồi tự khoá mình ra ngoài vĩnh viễn, vì cái ứng dụng nó vừa khởi động đã thừa hưởng mô tả tệp khoá và giữ <code>/run/lock/trao.lock</code> suốt đời nó; <code>9&gt;&amp;-</code> sửa được, và ba lần tráo liên tiếp sau đó chạy 1.653 request không cái nào hỏng (3.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Your deploy is ln -sfn … && systemctl restart app. The app needs about 1.5 s to start, and during every deploy the request loop shows ~130 × 502 over ~1.6 s. Which change removes the 502s rather than shortening them?|||Deploy của bạn là ln -sfn … && systemctl restart app. App cần khoảng 1,5 giây để khởi động, và mỗi lần deploy vòng request cho ra ~130 cú 502 trong ~1,6 giây. Thay đổi nào LOẠI BỎ được 502 chứ không chỉ rút ngắn nó?',
            options: [
              'Move to a faster VPS so startup takes 0.3 s|||Chuyển sang VPS nhanh hơn để khởi động chỉ mất 0,3 giây',
              'Raise RestartSec so systemd waits longer before starting|||Tăng RestartSec để systemd chờ lâu hơn trước khi chạy',
              'Start the new version on a second port, poll its /health, point the Nginx upstream at it and reload, then stop the old one last|||Chạy bản mới ở cổng thứ hai, hỏi /health của nó, trỏ upstream nginx sang đó rồi reload, cuối cùng mới dừng bản cũ',
              'Add proxy_next_upstream error timeout to the single-server upstream|||Thêm proxy_next_upstream error timeout vào upstream chỉ có một máy',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: restart is stop-then-start, so the gap equals startup time; a faster machine only shortens it (Lesson 0.1 still dropped one request on an instant start). Reordering — start new, wait for ready, switch, stop old — measured 0 of 494 on the same 1.5 s app. proxy_next_upstream is tempting, but with one server in the pool there is nowhere else to retry.|||VI: restart là dừng-rồi-chạy, nên lỗ hổng bằng thời gian khởi động; máy nhanh hơn chỉ làm nó ngắn lại (Bài 0.1 vẫn rơi một request với app khởi động tức thì). Đổi thứ tự — chạy mới, chờ sẵn sàng, chuyển, dừng cũ — đo được 0 trên 494 với cùng app 1,5 giây. proxy_next_upstream nghe hấp dẫn, nhưng bể chỉ có một máy thì chẳng có chỗ nào để thử lại.',
          },
          {
            question: 'journalctl shows the app exited with status 143 on every deploy, and ten requests that were in flight all got no response. The team believed Node shuts down gracefully by default. What is going on?|||journalctl cho thấy app thoát với mã 143 ở mỗi lần deploy, và mười request đang bay đều không nhận được phản hồi. Cả nhóm tin rằng Node mặc định đã tắt tử tế. Chuyện gì đang xảy ra?',
            options: [
              'Without a process.on("SIGTERM") handler, Node exits at once with 128 + 15 = 143 — exactly like SIGKILL for in-flight requests; graceful shutdown has to be written|||Không có process.on("SIGTERM"), Node thoát ngay với mã 128 + 15 = 143 — với request đang bay thì y như SIGKILL; tắt tử tế phải tự viết',
              'systemd sent SIGKILL because TimeoutStopSec was too short|||systemd gửi SIGKILL vì TimeoutStopSec quá ngắn',
              '143 means the app ran out of memory and the kernel killed it|||143 nghĩa là app hết RAM và bị nhân hệ điều hành giết',
              'Node needs --graceful on the command line to drain requests|||Node cần cờ --graceful trên dòng lệnh để xả request',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: 143 = 128 + SIGTERM (15): the process ended because of SIGTERM without handling it. Measured in 3.2: SIGKILL and an unhandled SIGTERM both gave ten 000s. A supervisor SIGKILL would show 137 (128 + 9), and so would the OOM killer — which is why the tempting timeout answer does not fit the evidence. There is no --graceful flag.|||VI: 143 = 128 + SIGTERM (15): tiến trình kết thúc vì SIGTERM mà không xử lý nó. Đo ở 3.2: SIGKILL và SIGTERM không được bắt đều cho mười cú 000. Nếu trình giám sát gửi SIGKILL thì mã là 137 (128 + 9), bộ giết-khi-hết-RAM cũng vậy — nên đáp án "timeout quá ngắn" không khớp bằng chứng. Không có cờ --graceful nào cả.',
          },
          {
            question: 'After adding a SIGTERM handler, the log says "closed cleanly after 259 ms" — yet the ten requests that were in flight during the deploy all received 503. The handler checks a dang_dong flag. What should change?|||Sau khi thêm bộ xử lý SIGTERM, log nói "đã đóng sạch sau 259 ms" — vậy mà mười request đang bay trong lúc deploy đều nhận 503. Bộ xử lý kiểm một cờ dang_dong. Nên đổi gì?',
            options: [
              'Lower the deadline so the process exits sooner|||Giảm hạn chót để tiến trình thoát sớm hơn',
              'Check the flag before calling server.close()|||Kiểm cờ trước khi gọi server.close()',
              'Return 502 instead of 503 so Nginx retries|||Trả 502 thay vì 503 để nginx thử lại',
              'Serve accepted requests exactly as normal; the flag may only add Connection: close (and make /health return 503)|||Phục vụ các request đã nhận y như bình thường; cờ chỉ được thêm Connection: close (và cho /health trả 503)',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: The drain itself was correct — it waited for all ten — but the handler turned already-accepted requests into errors, which from the user side is almost as bad as SIGKILL. With the flag only adding Connection: close, the same test gave ten 200s. Changing 503 to 502 still fails the user; retrying on another server needs a second server in the pool.|||VI: Phần xả thì đúng — nó chờ đủ mười cái — nhưng bộ xử lý biến request ĐÃ nhận thành lỗi, mà nhìn từ phía người dùng thì gần tệ như SIGKILL. Khi cờ chỉ thêm Connection: close, cùng phép thử cho ra mười cú 200. Đổi 503 thành 502 thì người dùng vẫn hỏng; thử lại ở máy khác cần có máy thứ hai trong bể.',
          },
          {
            question: 'Your graceful shutdown is correct, but on some deploys the old process takes exactly 10 s (your deadline) to exit. ss shows one connection from a load balancer that opened TCP and has not sent a request yet. You add server.closeIdleConnections(). What happens?|||Quy trình tắt của bạn đúng, nhưng ở vài lần deploy tiến trình cũ mất đúng 10 giây (hạn chót của bạn) mới thoát. ss cho thấy một kết nối từ bộ cân bằng tải đã mở TCP mà chưa gửi request nào. Bạn thêm server.closeIdleConnections(). Chuyện gì xảy ra?',
            options: [
              'It fixes it — that connection is idle, so it is closed at once|||Sửa được — kết nối đó nhàn rỗi nên bị đóng ngay',
              'Nothing changes: a connection that has not become a request is not "idle" to Node; only the deadline or closeAllConnections() ends it (measured: 10,019 ms)|||Không đổi gì: một kết nối chưa thành request không bị Node coi là "nhàn rỗi"; chỉ hạn chót hoặc closeAllConnections() mới cắt được (đo: 10.019 ms)',
              'The process now exits immediately but drops in-flight requests|||Tiến trình giờ thoát ngay nhưng làm rơi request đang bay',
              'Node refuses to start: closeIdleConnections() requires Node 22|||Node không khởi động được: closeIdleConnections() cần Node 22',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Measured in 3.2: an idle keepalive connection (one that already finished a request) is closed by close() itself on Node 19+ and on Ubuntu’s 18.19 — 1–8 ms. A TCP connection that sent nothing held the process until the 10 s deadline, with or without closeIdleConnections(). The method exists since 18.2, so the last option is false.|||VI: Đo ở 3.2: một kết nối keepalive nhàn rỗi (đã xong một request) được chính close() đóng trên Node 19+ và bản 18.19 của Ubuntu — 1–8 ms. Một kết nối TCP không gửi gì giữ tiến trình tới hạn chót 10 giây, có hay không có closeIdleConnections(). Hàm đó có từ 18.2, nên phương án cuối sai.',
          },
          {
            question: 'Your blue-green script does nginx -s reload and then immediately kill -TERM the old backend. With slow requests in flight, the loop shows 8–9 × 502 per deploy; with sleep 1 in between it shows none. Why?|||Script xanh/lam của bạn chạy nginx -s reload rồi kill -TERM backend cũ NGAY. Khi có request chậm đang bay, vòng đo cho 8–9 cú 502 mỗi lần deploy; chèn sleep 1 ở giữa thì không còn cái nào. Vì sao?',
            options: [
              'nginx -t was not run, so the reload failed|||Chưa chạy nginx -t nên reload hỏng',
              'SIGTERM is too slow; SIGKILL would avoid the 502s|||SIGTERM chậm quá; SIGKILL sẽ tránh được 502',
              'reload only signals the master: for a few tens of milliseconds old workers still send requests to the old backend, which has already closed its port|||reload chỉ gửi tín hiệu cho master: trong vài chục mili giây worker cũ vẫn gửi request tới backend cũ, mà backend đó đã đóng cổng',
              'The new backend was not ready yet|||Backend mới chưa sẵn sàng',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured sweep: 0 s → 9, 8, 9 failures; 0.05 s → 4, 5, 4; 0.3 s and 1 s → 0. reload is asynchronous; old workers keep proxying briefly. "The new backend was not ready" is excluded because the script polled /health before switching, and SIGKILL would add in-flight losses, not remove any.|||VI: Phép quét đo được: 0 giây → 9, 8, 9 cú hỏng; 0,05 giây → 4, 5, 4; 0,3 và 1 giây → 0. reload là bất đồng bộ; worker cũ vẫn proxy thêm một chút. "Backend mới chưa sẵn sàng" bị loại vì script đã hỏi /health trước khi chuyển, còn SIGKILL chỉ thêm lỗi cho request đang bay chứ không bớt cái nào.',
          },
          {
            question: 'Nginx proxies to server app:3101;. You recreate the app (a new container, so a new IP). getent hosts app already shows the new IP, but users get 502 until someone runs nginx -s reload. What is the cause?|||nginx proxy tới server app:3101;. Bạn tạo lại app (container mới, nên IP mới). getent hosts app đã ra IP mới, nhưng người dùng nhận 502 cho tới khi có người chạy nginx -s reload. Nguyên nhân là gì?',
            options: [
              'Nginx resolved "app" when it loaded its config and keeps that IP; reload after the swap, or use a resolver plus a variable in proxy_pass|||nginx phân giải "app" lúc nạp cấu hình và giữ nguyên IP đó; reload sau khi tráo, hoặc dùng resolver cộng một biến trong proxy_pass',
              'The DNS TTL of "app" is 24 hours|||TTL DNS của "app" là 24 giờ',
              'keepalive 16 pins every connection to the old container forever|||keepalive 16 ghim mọi kết nối vào container cũ mãi mãi',
              'The new container is not listening on 3101|||Container mới không nghe cổng 3101',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Measured with /etc/hosts on the lab VPS: 240 × 502 for 3.1 s, the error log naming the OLD address, and the failures stopped exactly at the reload. The new container was listening — the reload fixed it without touching the app — and keepalive connections to a dead IP fail and are replaced, they do not pin anything. Chapter 13.4 does the container version.|||VI: Đo bằng /etc/hosts trên VPS thí nghiệm: 240 cú 502 trong 3,1 giây, error.log gọi đích danh địa chỉ CŨ, và lỗi dừng đúng lúc reload. Container mới VẪN đang nghe — reload sửa được mà không đụng tới app — còn kết nối keepalive tới một IP đã chết thì hỏng rồi được thay, không ghim gì cả. Chương 13.4 làm bản container.',
          },
          {
            question: 'A broken release crashes on start. The unit has Restart=on-failure, RestartSec=2s, and StartLimitIntervalSec=60 / StartLimitBurst=5 under [Service]. After 30 s, systemctl show says NRestarts=13, ActiveState=activating. Why did it not stop after five tries?|||Một bản phát hành hỏng sập ngay khi chạy. Unit có Restart=on-failure, RestartSec=2s, và StartLimitIntervalSec=60 / StartLimitBurst=5 nằm trong [Service]. Sau 30 giây, systemctl show báo NRestarts=13, ActiveState=activating. Vì sao nó không dừng sau năm lần?',
            options: [
              'StartLimitBurst only counts manual starts|||StartLimitBurst chỉ đếm những lần chạy bằng tay',
              'Restart=on-failure ignores start limits by design|||Restart=on-failure cố ý bỏ qua giới hạn khởi động',
              'NRestarts is reset every 10 restarts|||NRestarts bị đặt lại sau mỗi 10 lần',
              'StartLimitIntervalSec is ignored in [Service] (verify warns once), so the 10 s default applies, and five starts spaced over 2 s never fit inside it|||StartLimitIntervalSec bị phớt lờ khi nằm ở [Service] (verify cảnh báo một dòng), nên dùng mặc định 10 giây, mà năm lần chạy cách nhau hơn 2 giây thì không bao giờ lọt vào đó',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Measured on systemd 255: with the lines in [Unit] the unit reached failed after 5 ("Start request repeated too quickly"); moved to [Service] it was still restarting at 13. StartLimitBurst is accepted in [Service] for compatibility, which is why verify complained about only one line. Start limits do apply to automatic restarts — that is their whole purpose.|||VI: Đo trên systemd 255: để ở [Unit] thì unit tới failed sau 5 lần ("Start request repeated too quickly"); dời sang [Service] thì tới 13 lần vẫn đang chạy lại. StartLimitBurst vẫn được nhận ở [Service] để tương thích, nên verify chỉ kêu một dòng. Giới hạn khởi động CÓ áp cho các lần tự chạy lại — đó chính là mục đích của nó.',
          },
          {
            question: 'You deploy by pointing /srv/app/hien-tai at the new release. /health returns 200, but the route added in this release returns 404. The unit has WorkingDirectory=/srv/app/hien-tai. What is the most likely explanation?|||Bạn deploy bằng cách trỏ /srv/app/hien-tai vào bản mới. /health trả 200, nhưng route mới thêm trong bản này trả 404. Unit có WorkingDirectory=/srv/app/hien-tai. Giải thích khả dĩ nhất là gì?',
            options: [
              'The new route needs a database migration first|||Route mới cần chạy migration cơ sở dữ liệu trước',
              'The process was not restarted: its working directory was resolved when it started, so it still runs the old release — /proc/PID/cwd shows the old path|||Tiến trình chưa được khởi động lại: thư mục làm việc của nó được giải lúc khởi động, nên nó vẫn chạy bản cũ — /proc/PID/cwd chỉ ra đường dẫn cũ',
              'Nginx caches 404 responses|||nginx lưu đệm các phản hồi 404',
              'ln -sfn failed silently because the link already existed|||ln -sfn hỏng lặng lẽ vì liên kết đã tồn tại',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Measured in 3.5: readlink said v2, the process served v1, smoke.sh reported 404 on /api/moi and exited 1; /proc/PID/cwd pointed at v1; after a restart the same route gave 401 (mounted, needs login). This is the 02/07 incident shape: a deploy that did not rebuild kept the old code, and only a smoke test on a NEW route catches it — /health is 200 on old code too. ln -sfn replaces an existing link; that is what -f and -n are for.|||VI: Đo ở 3.5: readlink nói v2, tiến trình phục vụ v1, smoke.sh báo 404 ở /api/moi và thoát 1; /proc/PID/cwd trỏ vào v1; khởi động lại xong thì cùng route cho 401 (đã gắn, cần đăng nhập). Đây là hình dạng sự cố 02/07: một lần deploy không build lại giữ nguyên mã cũ, và chỉ smoke-test trên route MỚI mới bắt được — mã cũ vẫn trả /health 200. ln -sfn thay một liên kết đã có; -f và -n sinh ra để làm việc đó.',
          },
          {
            question: 'Your swap script falls back when the smoke test fails: it writes the old port back to upstream.conf, runs nginx -s reload, then systemctl stop on the new colour. The main path has zero failures, but every rollback produces a handful of 502s. What is missing?|||Script tráo của bạn tự lùi khi smoke-test hỏng: ghi lại cổng cũ vào upstream.conf, chạy nginx -s reload, rồi systemctl stop màu mới. Nhánh chính không có lỗi nào, nhưng mỗi lần lùi lại sinh ra vài cú 502. Thiếu gì?',
            options: [
              'A second smoke test on the old version|||Một smoke-test thứ hai cho bản cũ',
              'Restarting the old colour before switching back|||Khởi động lại màu cũ trước khi chuyển về',
              'The same pause after the reload that the main path has — old workers are still sending to the new colour when it is stopped|||Đúng khoảng chờ sau reload mà nhánh chính có — worker cũ vẫn đang gửi tới màu mới lúc nó bị dừng',
              'Setting TimeoutStopSec higher on the new colour|||Đặt TimeoutStopSec cao hơn cho màu mới',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured: the first rollback caused 9 × 502 in 88 ms; adding sleep 1 before systemctl stop gave 1,607 of 1,607. It is the same async-reload seam as the main path, reversed. Restarting the old colour would itself be a naive swap — it is still running and ready, which is the whole point of stopping it last.|||VI: Đo được: bản lùi đầu tiên gây 9 cú 502 trong 88 ms; thêm sleep 1 trước systemctl stop thì được 1.607 trên 1.607. Đó là cùng vết nứt reload-bất-đồng-bộ của nhánh chính, chỉ theo chiều ngược lại. Khởi động lại màu cũ thì chính nó lại là một cú tráo ngây thơ — màu cũ vẫn đang chạy và sẵn sàng, đó là toàn bộ lý do dừng nó sau cùng.',
          },
          {
            question: 'To save time, the script waits sleep 1 instead of polling /health. The new app opens its port immediately but needs 1.5 s to load its config and pools, answering 500 until then. ss -ltn shows the port open. What does the request loop show, and why?|||Để đỡ thời gian, script chờ sleep 1 thay vì hỏi /health. App mới mở cổng NGAY nhưng cần 1,5 giây để nạp cấu hình và pool, trong lúc đó trả 500. ss -ltn thấy cổng đang mở. Vòng đo cho thấy gì, và vì sao?',
            options: [
              'About half a second of 500s after the switch: the port being open is not readiness, and only the app’s own /health knows (measured 33 × 500)|||Khoảng nửa giây 500 sau khi chuyển: cổng mở không có nghĩa là sẵn sàng, và chỉ /health của chính app mới biết (đo được 33 cú 500)',
              'Zero failures — Nginx only forwards once the port is open|||Không lỗi nào — nginx chỉ chuyển tới khi cổng đã mở',
              'Connection refused errors, because the app is still starting|||Lỗi bị từ chối kết nối, vì app còn đang khởi động',
              '502s, because Nginx cannot reach a warming app|||502, vì nginx không tới được một app đang làm nóng',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: This is window 3 of Lesson 3.1, measured in 3.3: 33 × 500 over 436 ms. The port was open, so nothing was refused and Nginx had no 502 to produce — it faithfully passed on the app’s 500s. The variant where the app is not listening yet gives 502s instead (34 measured); polling /health removes both.|||VI: Đây là cửa sổ 3 của Bài 3.1, đo ở 3.3: 33 cú 500 trong 436 ms. Cổng đã mở, nên không có gì bị từ chối và nginx chẳng có 502 nào để sinh ra — nó trung thành chuyển nguyên các cú 500 của app. Biến thể app CHƯA nghe cổng thì cho 502 (đo được 34); hỏi /health loại được cả hai.',
          },
        ],
      },
    },
  ],
};
