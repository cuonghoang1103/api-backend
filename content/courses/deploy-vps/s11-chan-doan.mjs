const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';
/**
 * Deploy VPS — Chương 11: Chẩn đoán, nghiệm thu, và bài thi cuối.
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
<p>Chapter 6 measured a rollback at 140 milliseconds, and 6.3 measured a bad version writing 240 poisoned rows in 18.6 seconds. Those two numbers together settle the sequencing argument: <strong>if a deploy went out in the last hour, roll back first and diagnose afterwards.</strong> You lose nothing — the artifact is still there — and every second you spend understanding the problem is a second the broken version keeps writing.</p>

<div class="callout warn">
<p><strong>The exception, and it is the only one.</strong> Do not roll back if the previous release cannot run against the current schema (6.2). That is the one case where rolling back makes things worse, and it is knowable in advance — it is exactly the "rollback distance" you established when you wrote the migration. If you do not know the answer, you have just learned why that question is worth answering before an incident.</p>
</div>

<h3>Question 1 — did I cause this?</h3>
<pre><code>git log --oneline -5                          <span class="tok-comment"># co gi vua ra?</span>
ls -lt /srv/vps/nt/nhat-ky/ | head -3         <span class="tok-comment"># lan deploy cuoi luc nao?</span>
readlink -f /srv/vps/nt/hien-tai              <span class="tok-comment"># dang chay ban NAO?</span></code></pre>

<p>A failure that starts within minutes of a deploy is caused by that deploy until proven otherwise. This is not a heuristic, it is base rates: most things that change on a server are changed by you.</p>

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

<p>The first of those four that fails is your layer. Everything below it is fine and can be left alone; everything above it is a symptom.</p>

<div class="pitfall">
<p><strong>Bẫy — the layer that fails is not always the layer at fault.</strong> Chapter 6 measured a rollback that left <code>/health</code> returning 200 while every real endpoint returned 500, because the application was fine and the <em>schema</em> had moved. Chapter 8 measured a database killed by a build script that exited 0. Chapter 9 measured a proxy returning 200 on one location and 502 on another. In all three the failing layer and the responsible change were different things — which is why Question 1 comes first.</p>
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

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Effective Troubleshooting</span><span class="lc-sub">sre.google/sre-book/effective-troubleshooting/ — the triage-examine-diagnose loop, and its argument that stopping the bleeding precedes understanding the cause.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Managing Incidents</span><span class="lc-sub">sre.google/sre-book/managing-incidents/ — separating the person fixing from the person communicating, which matters the moment more than one person is involved.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">curl(1) — --write-out variables</span><span class="lc-sub">curl.se/docs/manpage.html — <code>time_namelookup</code>, <code>time_connect</code>, <code>time_appconnect</code>, <code>time_starttransfer</code>: the breakdown that splits DNS from TLS from the server in a single request.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — the diagnosis recipe book</span><span class="lc-sub">/courses/nginx/learn${REF} — the same layered approach from the proxy&#39;s side, with the error-log lines that go with each case.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Năm phút đầu tiên</h2>
<p class="lead">Dưới áp lực, kiểu hỏng không phải là THIẾU HIỂU BIẾT — mà là làm việc thứ ba trước tiên. Bài này là một THỨ TỰ, và cái thứ tự ấy giá trị hơn bất kỳ câu lệnh riêng lẻ nào trong nó.</p>

<h3>Trước hết: DỪNG ĐỒNG HỒ</h3>
<p>Chương 6 đo một cú lùi ở 140 mili giây, và 6.3 đo một bản hỏng ghi ra 240 dòng nhiễm độc trong 18,6 giây. Hai con số đó gộp lại giải quyết xong tranh cãi về thứ tự: <strong>nếu có một lần deploy vừa ra trong một giờ qua, hãy LÙI TRƯỚC rồi chẩn đoán sau.</strong> Bạn chẳng mất gì — cái tạo tác vẫn còn đó — và mỗi giây bạn bỏ ra để hiểu vấn đề là một giây bản hỏng vẫn đang ghi.</p>

<div class="callout warn">
<p><strong>Ngoại lệ, và đó là ngoại lệ DUY NHẤT.</strong> ĐỪNG lùi nếu bản trước không chạy được với lược đồ hiện tại (6.2). Đó là ca duy nhất mà lùi lại làm mọi thứ TỆ HƠN, và nó BIẾT TRƯỚC ĐƯỢC — nó chính là cái "tầm lùi" bạn đã thiết lập lúc viết cái migration. Nếu bạn không biết câu trả lời, thì bạn vừa học được vì sao câu hỏi ấy đáng trả lời TRƯỚC một sự cố.</p>
</div>

<h3>Câu hỏi 1 — có phải MÌNH gây ra không?</h3>
<pre><code>git log --oneline -5                          <span class="tok-comment"># co gi vua ra?</span>
ls -lt /srv/vps/nt/nhat-ky/ | head -3         <span class="tok-comment"># lan deploy cuoi luc nao?</span>
readlink -f /srv/vps/nt/hien-tai              <span class="tok-comment"># dang chay ban NAO?</span></code></pre>

<p>Một cú hỏng bắt đầu trong vòng vài phút sau một lần deploy là DO lần deploy đó gây ra, cho tới khi chứng minh được điều ngược lại. Đây không phải một mẹo suy đoán, đây là TỶ LỆ NỀN: phần lớn những thứ thay đổi trên một máy chủ là do BẠN thay đổi.</p>

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

<p>Cái ĐẦU TIÊN trong bốn cái đó mà hỏng chính là tầng của bạn. Mọi thứ DƯỚI nó đều ổn và cứ để yên; mọi thứ TRÊN nó là triệu chứng.</p>

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

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Effective Troubleshooting</span><span class="lc-sub">sre.google/sre-book/effective-troubleshooting/ — vòng lặp phân-loại / soi / chẩn-đoán, và lập luận rằng CẦM MÁU đi trước việc hiểu nguyên nhân.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Managing Incidents</span><span class="lc-sub">sre.google/sre-book/managing-incidents/ — tách người SỬA khỏi người BÁO CÁO, thứ trở nên quan trọng ngay khi có hơn một người tham gia.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">curl(1) — các biến --write-out</span><span class="lc-sub">curl.se/docs/manpage.html — <code>time_namelookup</code>, <code>time_connect</code>, <code>time_appconnect</code>, <code>time_starttransfer</code>: bản chia nhỏ tách DNS khỏi TLS khỏi máy chủ chỉ trong MỘT request.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — sách công thức chẩn đoán</span><span class="lc-sub">/courses/nginx/learn${REF} — cùng cách tiếp cận theo tầng nhìn từ phía proxy, kèm những dòng error log đi cùng mỗi ca.</span></span></div>
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

<h3>What nginx writes down</h3>
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
<p><strong>Bẫy — "nothing is listening" and "listening on the wrong address" look identical from the proxy.</strong> An application bound to <code>127.0.0.1</code> is unreachable from another container; one bound to a container&#39;s internal address is unreachable from the host. Both produce <code>ECONNREFUSED</code> and a sub-millisecond 502. <code>ss -ltn</code> shows the address as well as the port, and that column is the one to read — <code>0.0.0.0:3000</code> and <code>127.0.0.1:3000</code> are very different situations that the status code cannot tell apart.</p>
</div>

<h3>The case with no status code at all</h3>
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

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 9110 §15.6 — Server Error 5xx</span><span class="lc-sub">rfc-editor.org/rfc/rfc9110#section-15.6 — the normative meanings of 500, 502, 503 and 504, which are more specific than common usage suggests.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — proxy_read_timeout, proxy_connect_timeout, proxy_next_upstream</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_proxy_module.html — the directives that turn a slow upstream into a 504, and the defaults worth changing.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ss(8)</span><span class="lc-sub">man 8 ss — <code>-ltnp</code> for listening TCP sockets with the owning process; the replacement for <code>netstat</code> and the command this whole course uses.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">errno(3) — ECONNREFUSED and ETIMEDOUT</span><span class="lc-sub">man 3 errno — 111 and 110, the two numbers that appear in the nginx error log above and distinguish the two failures.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — 502 versus 504, and what the error log says</span><span class="lc-sub">/courses/nginx/learn${REF} — the same signatures from the proxy&#39;s side, including what <code>proxy_next_upstream</code> does to them.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Đọc CHỮ KÝ của cú hỏng</h2>
<p class="lead">Một mã trạng thái nói cho bạn biết TẦNG NÀO TRẢ LỜI. Thời gian nó tốn nói cho bạn biết TẦNG NÀO HỎNG. Gộp lại, chúng nhận diện được vấn đề trước khi bạn kịp mở một tệp log nào.</p>

<h3>Bốn cú hỏng, đo thật</h3>
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

<h3>nginx ghi lại cái gì</h3>
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

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 9110 §15.6 — Server Error 5xx</span><span class="lc-sub">rfc-editor.org/rfc/rfc9110#section-15.6 — ý nghĩa chuẩn tắc của 500, 502, 503 và 504, cụ thể hơn cách người ta hay dùng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — proxy_read_timeout, proxy_connect_timeout, proxy_next_upstream</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_proxy_module.html — các chỉ thị biến một upstream chậm thành một cú 504, và những giá trị mặc định đáng đổi.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ss(8)</span><span class="lc-sub">man 8 ss — <code>-ltnp</code> cho các socket TCP đang nghe kèm tiến trình sở hữu; thứ thay thế <code>netstat</code> và là câu lệnh cả khoá này dùng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">errno(3) — ECONNREFUSED và ETIMEDOUT</span><span class="lc-sub">man 3 errno — 111 và 110, hai con số xuất hiện trong error log nginx ở trên và phân biệt hai cú hỏng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — 502 so với 504, và error log nói gì</span><span class="lc-sub">/courses/nginx/learn${REF} — cùng những chữ ký ấy nhìn từ phía proxy, kể cả việc <code>proxy_next_upstream</code> làm gì với chúng.</span></span></div>
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
<pre><code>curl -s http://cua-truoc/ban                       <span class="tok-comment"># nguoi dung thay ban nao</span>
basename "\$(readlink -f /srv/vps/nt/hien-tai)"     <span class="tok-comment"># symlink tro dau</span>
ss -ltnp | grep ':3391 '                            <span class="tok-comment"># tien trinh nao dang giu cong</span></code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">symlink is old</span><span class="lz-lnote">the deploy exited before the swap. Read the log: which numbered step is the last one? (7.5)</span></div>
<div class="lz-layer"><span class="lz-lname">symlink new, process old</span><span class="lz-lnote">it was never restarted. A running process does not follow a symlink that changes — this was the bug in my own script (7.5)</span></div>
<div class="lz-layer"><span class="lz-lname">both new, front door old</span><span class="lz-lnote">a cache. Measured at five minutes in 6.5; purge and re-check</span></div>
<div class="lz-layer"><span class="lz-lname">exit 0 and no log at all</span><span class="lz-lnote">the script refused and said so quietly — a prompt with no terminal exits 0 (7.3)</span></div>
</div>

<h3>2. A route returns 404 that worked yesterday</h3>
<p>A stale or partial build: the process started, <code>/health</code> passes, and one router was never mounted. 7.4 measured the check that catches it — an unauthenticated GET returning <strong>401 means mounted</strong>, <strong>404 means missing</strong>. A full clean redeploy is the fix; a <code>--no-build</code> shortcut is usually the cause.</p>

<h3>3. Every request returns 500 but /health returns 200</h3>
<pre><code>curl -s http://cua-truoc/api/v1/bai | head -c 200
psql -d nt -c "\\d ten_bang"                        <span class="tok-comment"># cot ma ma cu doc CO khong?</span></code></pre>

<p>Measured in 6.2: code rolled back onto a schema that moved on. <code>/health</code> answers before touching anything, so it cannot see a schema mismatch — that is deliberate, not a bug (9.5). Either roll the schema back too, or roll forward.</p>

<h3>4. It worked, then died a few minutes later</h3>
<pre><code>dmesg | grep -i 'killed process'
cat /sys/fs/cgroup/memory/…/memory.max_usage_in_bytes</code></pre>

<div class="callout warn">
<p><strong>Exit 137 and an empty application log is the OOM killer (8.1).</strong> Nothing your application wrote will mention it, because <code>SIGKILL</code> cannot be caught. Check whether a build ran at the same time — 8.2 measured a build that exited 0 while the database was killed, and 8.5 measured two parallel builds killing one another on a 200 MB ceiling.</p>
</div>

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

<h3>The two questions that end most of these</h3>
<div class="kv-grid">
<div class="kv"><span class="k">what version is actually serving?</span><span class="v">from the front door, not from the machine. Nearly half the entries above resolve here</span></div>
<div class="kv"><span class="k">what changed, and when?</span><span class="v">the deploy log with timestamps, the git log, and the migration ledger. Three commands</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — "nothing changed" is almost always false.</strong> A certificate expired. A disk crossed a threshold. A cron job ran for the first time this month. An upstream provider deployed. A log rotated and something reopened a file it should not have. Chapter 8 measured a disk filling from build cache alone, with nobody touching the machine. When somebody says nothing changed, they mean nobody deployed — which is a much smaller claim.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — migrate status and resolve</span><span class="lc-sub">prisma.io/docs/orm/prisma-migrate — the ledger table and what each state means; read before running <code>resolve</code>, never after.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — \$upstream_addr and \$upstream_status</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_upstream_module.html#variables — the log fields that identify which backend served a request, and every backend it tried first.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 9111 §4.2 — Freshness</span><span class="lc-sub">rfc-editor.org/rfc/rfc9111#section-4.2 — why a response already in a browser cache cannot be recalled by the origin, which is the honest answer to entry 6.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Prisma ORM — migrations and the tracking table</span><span class="lc-sub">/courses/prisma-orm/learn${REF} — the columns of the migration ledger, and what a failed migration leaves in each of them.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Sách công thức: lần deploy làm chuyện lạ</h2>
<p class="lead">Mỗi mục dưới đây là một triệu chứng mà khoá này đã ĐO, kèm câu lệnh xác nhận và bài học đã sinh ra con số ấy. Nó là một BẢNG TRA, và nó được viết để đọc TRONG một sự cố chứ không phải trước đó.</p>

<h3>1. Lần deploy báo thành công và chẳng có gì thay đổi</h3>
<pre><code>curl -s http://cua-truoc/ban                       <span class="tok-comment"># nguoi dung thay ban nao</span>
basename "\$(readlink -f /srv/vps/nt/hien-tai)"     <span class="tok-comment"># symlink tro dau</span>
ss -ltnp | grep ':3391 '                            <span class="tok-comment"># tien trinh nao dang giu cong</span></code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">symlink còn CŨ</span><span class="lz-lnote">lần deploy thoát TRƯỚC bước tráo. Đọc nhật ký: bước đánh số nào là bước cuối cùng? (7.5)</span></div>
<div class="lz-layer"><span class="lz-lname">symlink MỚI, tiến trình CŨ</span><span class="lz-lnote">nó chưa bao giờ được khởi động lại. Một tiến trình đang chạy KHÔNG đi theo symlink khi symlink đổi — đây là con bọ trong chính script của tôi (7.5)</span></div>
<div class="lz-layer"><span class="lz-lname">cả hai MỚI, cửa trước CŨ</span><span class="lz-lnote">một bộ đệm. Đo được năm phút ở bài 6.5; dọn rồi kiểm lại</span></div>
<div class="lz-layer"><span class="lz-lname">thoát 0 và KHÔNG có nhật ký nào</span><span class="lz-lnote">script đã TỪ CHỐI và nói ra một cách lặng lẽ — một lời hỏi khi không có terminal thì thoát 0 (7.3)</span></div>
</div>

<h3>2. Một route trả 404 mà hôm qua nó chạy</h3>
<p>Một bản dựng CŨ hoặc NỬA VỜI: tiến trình khởi động được, <code>/health</code> qua, và một cái router chưa bao giờ được gắn. Bài 7.4 đo cái phép kiểm bắt được nó — một lệnh GET không xác thực trả <strong>401 nghĩa là ĐÃ GẮN</strong>, <strong>404 nghĩa là THIẾU</strong>. Deploy lại sạch sẽ toàn phần là cách chữa; một cú tắt đường <code>--no-build</code> thường là nguyên nhân.</p>

<h3>3. Mọi request trả 500 mà /health trả 200</h3>
<pre><code>curl -s http://cua-truoc/api/v1/bai | head -c 200
psql -d nt -c "\\d ten_bang"                        <span class="tok-comment"># cot ma ma cu doc CO khong?</span></code></pre>

<p>Đo ở bài 6.2: mã bị lùi lên một lược đồ đã đi tiếp. <code>/health</code> trả lời TRƯỚC khi đụng vào bất cứ thứ gì, nên nó không thể thấy được một cú lệch lược đồ — đó là CHỦ ĐÍCH, không phải một con bọ (9.5). Hoặc lùi cả lược đồ, hoặc đi tới.</p>

<h3>4. Nó chạy, rồi chết sau vài phút</h3>
<pre><code>dmesg | grep -i 'killed process'
cat /sys/fs/cgroup/memory/…/memory.max_usage_in_bytes</code></pre>

<div class="callout warn">
<p><strong>Mã thoát 137 kèm một log ứng dụng RỖNG chính là OOM killer (8.1).</strong> Chẳng thứ gì ứng dụng của bạn ghi ra sẽ nhắc tới nó, vì <code>SIGKILL</code> không bắt được. Hãy kiểm xem có bản dựng nào chạy cùng lúc không — bài 8.2 đo một bản dựng THOÁT 0 trong khi cơ sở dữ liệu bị giết, và 8.5 đo hai bản dựng song song giết nhau dưới cái trần 200 MB.</p>
</div>

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

<h3>Hai câu hỏi kết thúc phần lớn những mục trên</h3>
<div class="kv-grid">
<div class="kv"><span class="k">phiên bản nào THẬT SỰ đang phục vụ?</span><span class="v">từ CỬA TRƯỚC, không phải từ cái máy. Gần một nửa các mục ở trên giải quyết xong ngay đây</span></div>
<div class="kv"><span class="k">cái gì đã đổi, và LÚC NÀO?</span><span class="v">nhật ký deploy có dấu thời gian, git log, và cuốn sổ migration. Ba câu lệnh</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — "chẳng có gì thay đổi" gần như luôn SAI.</strong> Một chứng chỉ hết hạn. Một cái đĩa vượt qua một ngưỡng. Một cron job chạy lần đầu trong tháng. Một nhà cung cấp phía trên vừa deploy. Một cuốn log xoay vòng và có thứ gì đó mở lại một tệp mà lẽ ra không nên. Chương 8 đo một cái đĩa đầy lên CHỈ vì bộ đệm dựng, chẳng ai đụng vào máy. Khi ai đó nói chẳng có gì thay đổi, ý họ là chẳng ai DEPLOY — mà đó là một lời khẳng định NHỎ HƠN nhiều.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — migrate status và resolve</span><span class="lc-sub">prisma.io/docs/orm/prisma-migrate — bảng sổ ghi và ý nghĩa từng trạng thái; đọc TRƯỚC khi chạy <code>resolve</code>, đừng bao giờ sau.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — \$upstream_addr và \$upstream_status</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_upstream_module.html#variables — những trường log nhận diện backend nào đã phục vụ một request, và mọi backend nó đã thử trước đó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 9111 §4.2 — Freshness</span><span class="lc-sub">rfc-editor.org/rfc/rfc9111#section-4.2 — vì sao một bản trả lời đã nằm trong bộ đệm trình duyệt thì máy chủ gốc không gọi về được, và đó là câu trả lời thành thật cho mục số 6.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Prisma ORM — migration và bảng theo dõi</span><span class="lc-sub">/courses/prisma-orm/learn${REF} — các cột của cuốn sổ migration, và một migration hỏng để lại gì trong từng cột.</span></span></div>
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
<pre><code>vmstat 1 5           <span class="tok-comment"># cot r, si/so, wa — mot lenh loai duoc ba kha nang</span>
<span class="tok-comment"># DONG DAU la trung binh tu luc khoi dong — BO QUA no</span></code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">r (runnable) &gt; cores, wa low</span><span class="lz-lnote">CPU-bound. Something is computing. 9.1 measured why load average will not tell you this for another minute</span></div>
<div class="lz-layer"><span class="lz-lname">si/so moving constantly</span><span class="lz-lnote">swap thrashing. 8.3 measured 56–66 ms against 0.14 ms for the same reads — the process is alive and unusable</span></div>
<div class="lz-layer"><span class="lz-lname">wa high, r low</span><span class="lz-lnote">waiting on disk. A slow query, a backup running, or a failing disk</span></div>
<div class="lz-layer"><span class="lz-lname">everything low and it is still slow</span><span class="lz-lnote">not this machine. An external call with no timeout, a locked table, or <code>steal</code> — check field 8 of <code>/proc/stat</code> (9.1)</span></div>
</div>

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
<pre><code>df -h; df -i                    <span class="tok-comment"># HAI lenh: khoi va inode can hoan toan khac nhau</span>
lsof -nP +L1 | head             <span class="tok-comment"># tep DA XOA ma con mo</span>
du -sh /var/log/* /srv/*/ban/* 2>/dev/null | sort -h | tail -5</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">df -h full, df -i fine</span><span class="lz-lnote">blocks exhausted. Delete or truncate something large. 8.4 measured recovery at 8 ms</span></div>
<div class="lz-layer"><span class="lz-lname">df -i full, df -h fine</span><span class="lz-lnote">inodes exhausted. 8.4 measured 162 MB free and still <code>ENOSPC</code>. Delete <em>many</em> files; size is irrelevant</span></div>
<div class="lz-layer"><span class="lz-lname">df full, du does not agree</span><span class="lz-lnote">a deleted file still held open. 8.4 measured a 100 MB gap; <code>: &gt; /proc/&lt;pid&gt;/fd/N</code> recovered it with no restart</span></div>
<div class="lz-layer"><span class="lz-lname">nothing large anywhere</span><span class="lz-lnote">the 5% root reserve is what you are inside. <code>tune2fs -l</code> shows it (8.4)</span></div>
</div>

<div class="callout warn">
<p><strong>The instinct that fails here.</strong> <code>rm big.log</code> on a file a process still has open frees exactly zero bytes — <code>du</code> now shows the space as gone and <code>df</code> still says full. Truncate instead: <code>: &gt; big.log</code>. This is the single most confusing disk situation, and 8.4 measured both the symptom and both fixes.</p>
</div>

<h3>It keeps restarting</h3>
<pre><code>dmesg | grep -i 'killed process' | tail -3
systemctl status ung-dung | head -20
grep -c 'oom' /sys/fs/cgroup/memory/…/memory.oom_control</code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">exit 137, empty app log</span><span class="v">OOM killer. Check what else ran at that moment — 8.2 measured the culprit exiting 0 while the victim died</span></div>
<div class="kv"><span class="k">exit 134 with a stack trace</span><span class="v">V8 heap limit — a <em>better</em> outcome, because it tells you where. Set <code>--max-old-space-size</code> below the cgroup limit to convert 137 into 134 (8.5)</span></div>
<div class="kv"><span class="k">exit 1 immediately on start</span><span class="v">missing config. 6.1 measured an artifact rollback leaving a renamed env var undefined</span></div>
<div class="kv"><span class="k">restarting every few seconds</span><span class="v">a restart loop making things worse each cycle. Stop it, then diagnose — <code>StartLimitBurst</code> exists for this (8.2)</span></div>
</div>

<h3>The order to check in</h3>
<p>Because these interact, and checking in the wrong order wastes the most time:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1. disk</span><span class="lz-t">df -h; df -i</span><span class="lz-d">two lines, and a full disk explains a startling variety of unrelated errors</span></div>
<div class="lz-step"><span class="lz-k">2. memory</span><span class="lz-t">dmesg | grep -i oom</span><span class="lz-d">one line, and it is the failure your logs cannot show you</span></div>
<div class="lz-step"><span class="lz-k">3. saturation</span><span class="lz-t">vmstat 1 5</span><span class="lz-d">separates CPU from swap from I/O in one command</span></div>
<div class="lz-step"><span class="lz-k">4. the database</span><span class="lz-t">pg_stat_activity</span><span class="lz-d">only once the machine itself is ruled out</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — the resource that is exhausted is often not the one that broke.</strong> A full disk stops the database writing, and the symptom is 500s from the application. Memory pressure evicts the page cache, and the symptom is slow queries. Chapter 8 measured a build filling a disk shared with PostgreSQL and a build triggering an OOM kill of the database — in both, the visible failure was the database and the cause was a build. Check the machine before you tune the application.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">vmstat(8) and iostat(1)</span><span class="lc-sub">man 8 vmstat — the <code>r</code>, <code>si</code>/<code>so</code> and <code>wa</code> columns, and the warning that the first line is an average since boot.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_stat_activity and pg_locks</span><span class="lc-sub">postgresql.org/docs/current/monitoring-stats.html — <code>wait_event_type</code> in particular tells you whether a query is running or waiting, which are very different problems.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Brendan Gregg — Linux Performance Analysis in 60 Seconds</span><span class="lc-sub">netflixtechblog.com/linux-performance-analysis-in-60-000-milliseconds — ten commands in a deliberate order; this lesson is a smaller version aimed at one VPS.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">lsof(8) — the +L flag</span><span class="lc-sub">man 8 lsof — <code>+L1</code> for deleted-but-open files, the command behind the third disk case.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — locks, waits and slow queries</span><span class="lc-sub">/courses/postgresql/learn${REF} — reading <code>pg_locks</code>, and which operations take which lock level.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>Sách công thức: chậm, đầy, hoặc đang chết</h2>
<p class="lead">Các vấn đề tài nguyên đều hiện ra GIỐNG NHAU — website chậm, hoặc hỏng lúc được lúc không — và chúng cần những cách chữa hoàn toàn khác nhau. Các câu lệnh dưới đây được chọn để TÁCH chúng ra trong ít bước nhất có thể.</p>

<h3>Mọi thứ đều chậm</h3>
<pre><code>vmstat 1 5           <span class="tok-comment"># cot r, si/so, wa — mot lenh loai duoc ba kha nang</span>
<span class="tok-comment"># DONG DAU la trung binh tu luc khoi dong — BO QUA no</span></code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">r (chạy được) &gt; số nhân, wa thấp</span><span class="lz-lnote">nghẽn CPU. Có thứ gì đó đang tính. Bài 9.1 đo vì sao load average sẽ chưa nói cho bạn biết chuyện này thêm cả một phút nữa</span></div>
<div class="lz-layer"><span class="lz-lname">si/so chạy liên tục</span><span class="lz-lnote">quẫy đạp swap. Bài 8.3 đo 56–66 ms so với 0,14 ms cho cùng phép đọc — tiến trình đang SỐNG và KHÔNG DÙNG ĐƯỢC</span></div>
<div class="lz-layer"><span class="lz-lname">wa cao, r thấp</span><span class="lz-lnote">đang CHỜ ĐĨA. Một truy vấn chậm, một bản sao lưu đang chạy, hoặc một cái đĩa sắp hỏng</span></div>
<div class="lz-layer"><span class="lz-lname">mọi thứ đều thấp mà vẫn chậm</span><span class="lz-lnote">KHÔNG phải cái máy này. Một lời gọi ra ngoài không có hạn giờ, một cái bảng bị khoá, hoặc <code>steal</code> — kiểm trường số 8 của <code>/proc/stat</code> (9.1)</span></div>
</div>

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
<pre><code>df -h; df -i                    <span class="tok-comment"># HAI lenh: khoi va inode can hoan toan khac nhau</span>
lsof -nP +L1 | head             <span class="tok-comment"># tep DA XOA ma con mo</span>
du -sh /var/log/* /srv/*/ban/* 2>/dev/null | sort -h | tail -5</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">df -h đầy, df -i ổn</span><span class="lz-lnote">cạn KHỐI. Xoá hoặc cắt cụt thứ gì đó lớn. Bài 8.4 đo việc phục hồi mất 8 ms</span></div>
<div class="lz-layer"><span class="lz-lname">df -i đầy, df -h ổn</span><span class="lz-lnote">cạn INODE. Bài 8.4 đo còn 162 MB trống mà vẫn <code>ENOSPC</code>. Xoá NHIỀU tệp; kích thước không liên quan</span></div>
<div class="lz-layer"><span class="lz-lname">df đầy, du không đồng ý</span><span class="lz-lnote">một tệp đã xoá còn bị giữ mở. Bài 8.4 đo một khoảng chênh 100 MB; <code>: &gt; /proc/&lt;pid&gt;/fd/N</code> lấy lại được mà không cần khởi động lại</span></div>
<div class="lz-layer"><span class="lz-lname">chẳng có gì lớn ở đâu cả</span><span class="lz-lnote">bạn đang nằm trong phần 5% dự trữ cho root. <code>tune2fs -l</code> cho xem (8.4)</span></div>
</div>

<div class="callout warn">
<p><strong>Cái phản xạ HỎNG ở đây.</strong> <code>rm big.log</code> trên một tệp mà một tiến trình vẫn đang mở sẽ giải phóng đúng KHÔNG byte — <code>du</code> giờ báo chỗ đó đã đi rồi còn <code>df</code> vẫn nói đầy. Hãy CẮT CỤT thay vào đó: <code>: &gt; big.log</code>. Đây là tình huống đĩa gây rối trí nhất, và bài 8.4 đã đo cả triệu chứng lẫn cả hai cách chữa.</p>
</div>

<h3>Nó cứ khởi động lại</h3>
<pre><code>dmesg | grep -i 'killed process' | tail -3
systemctl status ung-dung | head -20
grep -c 'oom' /sys/fs/cgroup/memory/…/memory.oom_control</code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">thoát 137, log ứng dụng rỗng</span><span class="v">OOM killer. Kiểm xem còn gì chạy vào đúng khoảnh khắc đó — bài 8.2 đo thủ phạm THOÁT 0 trong khi nạn nhân chết</span></div>
<div class="kv"><span class="k">thoát 134 kèm vết ngăn xếp</span><span class="v">giới hạn heap của V8 — một kết cục <em>TỐT HƠN</em>, vì nó nói cho bạn biết Ở ĐÂU. Đặt <code>--max-old-space-size</code> THẤP HƠN giới hạn cgroup để biến 137 thành 134 (8.5)</span></div>
<div class="kv"><span class="k">thoát 1 ngay khi khởi động</span><span class="v">thiếu cấu hình. Bài 6.1 đo một cú lùi tạo tác để lại một biến môi trường đã đổi tên thành undefined</span></div>
<div class="kv"><span class="k">khởi động lại vài giây một lần</span><span class="v">một vòng lặp khởi động lại làm mọi thứ tệ hơn mỗi vòng. DỪNG nó lại, rồi mới chẩn đoán — <code>StartLimitBurst</code> tồn tại vì chuyện này (8.2)</span></div>
</div>

<h3>Thứ tự cần kiểm</h3>
<p>Vì những thứ này TƯƠNG TÁC với nhau, và kiểm sai thứ tự là cách tốn thời gian nhất:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1. đĩa</span><span class="lz-t">df -h; df -i</span><span class="lz-d">hai dòng, và một cái đĩa đầy giải thích được một mớ lỗi trông chẳng liên quan gì tới nhau</span></div>
<div class="lz-step"><span class="lz-k">2. bộ nhớ</span><span class="lz-t">dmesg | grep -i oom</span><span class="lz-d">một dòng, và đó là cú hỏng mà log của bạn KHÔNG cho bạn thấy được</span></div>
<div class="lz-step"><span class="lz-k">3. độ bão hoà</span><span class="lz-t">vmstat 1 5</span><span class="lz-d">tách CPU khỏi swap khỏi I/O trong một câu lệnh</span></div>
<div class="lz-step"><span class="lz-k">4. cơ sở dữ liệu</span><span class="lz-t">pg_stat_activity</span><span class="lz-d">chỉ SAU KHI đã loại trừ bản thân cái máy</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — cái tài nguyên bị cạn thường KHÔNG phải cái đã hỏng.</strong> Một cái đĩa đầy làm cơ sở dữ liệu không ghi được, và triệu chứng là các cú 500 từ ứng dụng. Sức ép bộ nhớ đẩy bộ đệm trang ra, và triệu chứng là truy vấn chậm. Chương 8 đo một bản dựng làm đầy cái đĩa dùng chung với PostgreSQL và một bản dựng kích hoạt cú OOM giết cơ sở dữ liệu — trong cả hai, cú hỏng NHÌN THẤY ĐƯỢC là cơ sở dữ liệu còn nguyên nhân là một bản dựng. Hãy kiểm CÁI MÁY trước khi đi tinh chỉnh ứng dụng.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">vmstat(8) và iostat(1)</span><span class="lc-sub">man 8 vmstat — các cột <code>r</code>, <code>si</code>/<code>so</code> và <code>wa</code>, cùng lời cảnh báo rằng dòng đầu là trung bình kể từ lúc khởi động.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_stat_activity và pg_locks</span><span class="lc-sub">postgresql.org/docs/current/monitoring-stats.html — riêng <code>wait_event_type</code> nói cho bạn biết một truy vấn đang CHẠY hay đang CHỜ, hai vấn đề rất khác nhau.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Brendan Gregg — Linux Performance Analysis in 60 Seconds</span><span class="lc-sub">netflixtechblog.com/linux-performance-analysis-in-60-000-milliseconds — mười câu lệnh theo một thứ tự có chủ đích; bài này là bản nhỏ hơn nhắm vào một cái VPS.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">lsof(8) — cờ +L</span><span class="lc-sub">man 8 lsof — <code>+L1</code> cho các tệp đã-xoá-còn-mở, câu lệnh nằm sau ca đĩa thứ ba.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — khoá, chờ và truy vấn chậm</span><span class="lc-sub">/courses/postgresql/learn${REF} — đọc <code>pg_locks</code>, và thao tác nào lấy mức khoá nào.</span></span></div>
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
<p><strong>Bẫy — a green suite is evidence about the suite, not about the system.</strong> Twice in this course a check passed while the thing it was supposed to protect was broken: check 13 here, and the readiness loop in 7.4. Both times the fix was the same — make the failure happen deliberately and confirm the check goes red. A check nobody has seen fail is a check nobody has tested, and it is worth less than no check, because it produces confidence.</p>
</div>

<div class="callout ok">
<p><strong>Where this belongs.</strong> Run it as the last step of the deploy script (7.5), against the front door, and let a non-zero exit trigger the rollback. That closes the loop this whole course has been building: an artifact you can identify (Ch 1), moved deliberately (Ch 2), swapped atomically (Ch 3), configured from outside (Ch 4), against a schema that tolerates two versions (Ch 5), reversible in 140 ms (Ch 6), by a script that refuses when it should (Ch 7), on a machine that will not run out (Ch 8), watched by numbers that do not lie (Ch 9), backed up in a way that has been restored (Ch 10) — and finally, <em>proven correct from where the user stands.</em></p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — server_tokens</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_core_module.html#server_tokens — <code>off</code>, and <code>build</code>/a custom string with the <code>headers_more</code> module if you want the header gone entirely.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OWASP — Error Handling cheat sheet</span><span class="lc-sub">cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html — the generic-message-out, detail-to-the-log pattern applied above, and what else leaks through error responses.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Mozilla Observatory</span><span class="lc-sub">developer.mozilla.org/en-US/observatory — scores a live site on exactly the headers checks 7, 8 and 14 look at; a reasonable source for what to add next.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — security headers, and an acceptance test for a proxy</span><span class="lc-sub">/courses/nginx/learn${REF} — the same exercise from the proxy&#39;s side, including a missing HSTS header that its own acceptance test found.</span></span></div>
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

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — server_tokens</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_core_module.html#server_tokens — <code>off</code>, và <code>build</code>/một chuỗi tuỳ ý với module <code>headers_more</code> nếu bạn muốn bỏ hẳn cái header đó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OWASP — Error Handling cheat sheet</span><span class="lc-sub">cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html — khuôn mẫu thông-điệp-chung-ra-ngoài, chi-tiết-vào-log áp dụng ở trên, và còn thứ gì nữa rò rỉ qua các bản trả lời lỗi.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Mozilla Observatory</span><span class="lc-sub">developer.mozilla.org/en-US/observatory — chấm điểm một website đang sống trên đúng những header mà phép kiểm 7, 8 và 14 nhìn vào; một nguồn hợp lý để biết nên thêm gì tiếp theo.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — header bảo mật, và một bộ nghiệm thu cho proxy</span><span class="lc-sub">/courses/nginx/learn${REF} — cùng bài tập đó nhìn từ phía proxy, kể cả một header HSTS bị thiếu mà chính bộ nghiệm thu của nó tìm ra.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 11.6 ─────────────────────────── */
    {
      title: '11.6 — Final exam|||11.6 — Bài thi cuối khoá',
      slug: 'deploy-11-6-thi-cuoi',
      type: 'QUIZ',
      description: 'Mười hai câu trải khắp mười hai mục, mỗi câu ra từ một phép ĐO THẬT trong khoá này: một cú lùi 140 mili giây, một bảng 400.170 dòng phục hồi ra RỖNG với mã thoát 0, một bản dựng thoát 0 trong khi cơ sở dữ liệu bị giết, và một chốt kiểm sức khoẻ trả 200 trong khi trang chủ trả 502.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.6</span>
<h2>Final exam</h2>
<p class="lead">Twelve questions, eighteen minutes, drawn from every chapter. Each one comes from something this course measured on a real machine rather than described.</p>
<div class="callout">
<p><strong>The through-line.</strong> A deploy is four steps — build an artifact, move it, swap it in, prove it works — and this course measured every way each one fails quietly. The pattern that recurred in every single chapter: <strong>the check said yes and the system was wrong.</strong> A health check returning 200 with every endpoint at 500 (6.2). A rollback that succeeded while users got the old version for five minutes (6.5). A confirmation prompt exiting 0 without deploying (7.3). A readiness check burning 3,022 ms to learn nothing (7.4). A build exiting 0 while the database was killed (8.2). A load average of 0.10 on a fully saturated machine (9.1). A health check at 200 with the homepage at 502 (9.5). A restore exiting 0 with a 400,170-row table empty (10.3). And an acceptance check passing because it was pointed at a 404 (11.5). The recurring answer was also the same every time: <em>verify from where the user stands, compare against what should be true, and make the check fail on purpose before you trust it.</em></p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.6</span>
<h2>Bài thi cuối khoá</h2>
<p class="lead">Mười hai câu, mười tám phút, rút từ mọi chương. Mỗi câu tới từ một thứ mà khoá này đã ĐO trên một cái máy thật chứ không phải mô tả lại.</p>
<div class="callout">
<p><strong>Sợi chỉ xuyên suốt.</strong> Một lần deploy là bốn bước — dựng tạo tác, chuyển đi, tráo vào, chứng minh nó chạy — và khoá này đã đo MỌI cách mà từng bước hỏng một cách âm thầm. Cái khuôn mẫu lặp lại ở TỪNG chương: <strong>phép kiểm nói CÓ và hệ thống thì SAI.</strong> Một chốt kiểm sức khoẻ trả 200 trong khi mọi endpoint trả 500 (6.2). Một cú lùi thành công trong khi người dùng nhận bản cũ suốt năm phút (6.5). Một lời hỏi xác nhận thoát 0 mà không deploy (7.3). Một phép kiểm sẵn sàng đốt 3.022 ms để học được con số không (7.4). Một bản dựng thoát 0 trong khi cơ sở dữ liệu bị giết (8.2). Một load average 0,10 trên một cái máy bão hoà hoàn toàn (9.1). Một chốt kiểm sức khoẻ ở 200 với trang chủ ở 502 (9.5). Một cú phục hồi thoát 0 với một bảng 400.170 dòng RỖNG (10.3). Và một phép kiểm nghiệm thu ĐẠT vì nó bị chĩa vào một cái 404 (11.5). Câu trả lời lặp lại cũng y hệt nhau mỗi lần: <em>kiểm từ CHỖ NGƯỜI DÙNG ĐỨNG, đối chiếu với thứ LẼ RA phải đúng, và bắt phép kiểm HỎNG một cách có chủ đích trước khi tin nó.</em></p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 1080,
        questions: [
          {
            question: 'What single property of an artifact makes a 140 ms rollback possible?|||Đúng MỘT tính chất nào của một tạo tác làm cho cú lùi 140 mili giây khả thi?',
            options: [
              'It is compressed|||Nó đã được nén',
              'It was built once and kept on disk unpacked, so "roll back" means repointing a symlink rather than rebuilding — measured at 140 ms against 1,994 ms to rebuild|||Nó được dựng MỘT lần và giữ trên đĩa ở dạng đã bung, nên "lùi bản" nghĩa là trỏ lại một symlink chứ không phải dựng lại — đo được 140 ms so với 1.994 ms để dựng lại',
              'It contains no dependencies|||Nó không chứa phụ thuộc nào',
              'It is stored in a registry|||Nó được lưu trong một registry',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'A deploy renames a column and ships the code that reads the new name. Both work. Why is that migration still unsafe?|||Một lần deploy đổi tên một cột và phát hành mã đọc tên mới. Cả hai đều chạy. Vì sao cái migration ấy VẪN không an toàn?',
            options: [
              'Renames are slow on large tables|||Đổi tên thì chậm trên bảng lớn',
              'A migration is safe only when the PREVIOUS release still works against the new schema — here it does not, so the rollback distance is zero|||Một migration chỉ an toàn khi bản phát hành TRƯỚC ĐÓ vẫn chạy được với lược đồ mới — ở đây thì không, nên tầm lùi bằng KHÔNG',
              'It requires downtime|||Nó đòi phải dừng dịch vụ',
              'Column names cannot be changed back|||Tên cột không đổi lại được',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'A bad version was live 18.6 seconds and wrote 240 bad rows. After a clean rollback, how many of those rows remain?|||Một bản hỏng sống 18,6 giây và ghi 240 dòng sai. Sau một cú lùi sạch sẽ, còn lại bao nhiêu dòng đó?',
            options: [
              'None; the rollback reverts data too|||Không còn dòng nào; cú lùi hoàn tác cả dữ liệu',
              'All 240 — a rollback changes which code runs and has no opinion about rows; cleaning up by time window also caught 60 innocent rows|||Cả 240 — một cú lùi đổi xem MÃ NÀO chạy và chẳng có ý kiến gì về các dòng dữ liệu; dọn theo cửa sổ thời gian còn đụng cả 60 dòng vô tội',
              'Only the ones written after the deploy finished|||Chỉ những dòng ghi sau khi deploy xong',
              'It depends on the isolation level|||Tuỳ mức cô lập giao dịch',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'Ninety orders sent ninety emails. Deleting all ninety rows left ninety emails delivered. What does a transactional outbox change?|||Chín mươi đơn hàng gửi ra chín mươi lá thư. Xoá cả chín mươi dòng vẫn để lại chín mươi lá đã phát. Một hộp gửi giao dịch đổi được gì?',
            options: [
              'It makes delivered emails recallable|||Nó làm cho thư đã phát gọi về được',
              'Nothing makes a delivered email reversible; it shrinks the window — measured as 40 sent and 50 still cancellable — and gives you a table to cancel from|||Không gì làm cho một lá thư đã phát lùi lại được; nó THU HẸP cửa sổ — đo được 40 đã gửi và 50 còn huỷ được — và cho bạn một cái bảng để huỷ từ đó',
              'It removes the need for idempotency keys|||Nó bỏ được nhu cầu dùng khoá bất biến',
              'It guarantees exactly-once delivery|||Nó bảo đảm phát đúng một lần',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'Which shell construct silently defeats set -euo pipefail, even with inherit_errexit enabled?|||Cấu trúc shell nào ÂM THẦM vô hiệu hoá set -euo pipefail, kể cả khi đã bật inherit_errexit?',
            options: [
              'A pipeline|||Một cái ống',
              'local x=$(cmd) inside a function — local is itself a command whose exit status wins; splitting into local x; x=$(cmd) fixes it|||local x=$(cmd) bên trong một hàm — local tự nó là một LỆNH và trạng thái thoát của nó THẮNG; tách thành local x; x=$(cmd) thì chữa được',
              'An unset variable|||Một biến chưa đặt',
              'A subshell|||Một shell con',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'A deploy script asks for confirmation and is run from cron. What happens, and what is the fix?|||Một script deploy hỏi xác nhận và được chạy từ cron. Chuyện gì xảy ra, và cách chữa là gì?',
            options: [
              'It waits forever|||Nó chờ vô hạn',
              'It can exit 0 without deploying — indistinguishable from success; test [ ! -t 0 ] first, refuse with its own exit code, and give automation an explicit flag|||Nó CÓ THỂ thoát 0 mà không deploy — không phân biệt được với thành công; hãy kiểm [ ! -t 0 ] trước, TỪ CHỐI kèm mã thoát riêng, và cho phía tự động hoá một cái cờ tường minh',
              'cron always provides a terminal|||cron lúc nào cũng cấp một terminal',
              'The prompt is skipped automatically|||Lời hỏi tự động được bỏ qua',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'Exit code 137 with nothing in the application log. What happened and where is the evidence?|||Mã thoát 137 kèm log ứng dụng trống trơn. Chuyện gì đã xảy ra và bằng chứng ở đâu?',
            options: [
              'A crash; the stack trace is in the app log|||Một cú sập; vết ngăn xếp nằm trong log ứng dụng',
              'SIGKILL from the OOM killer — 128+9, uncatchable, so the process wrote nothing; the record is in dmesg with the pid, RSS and the constraint that was hit|||SIGKILL từ OOM killer — 128+9, không bắt được, nên tiến trình không ghi được gì; bản ghi nằm trong dmesg kèm pid, RSS và cái giới hạn đã bị chạm',
              'A SIGTERM the handler ignored|||Một cú SIGTERM mà handler đã bỏ qua',
              'A disk error|||Một lỗi đĩa',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'A build asked for 120 MB, exited 0, and the database was killed. Why, and what is the one-line fix?|||Một bản dựng xin 120 MB, thoát 0, và cơ sở dữ liệu bị giết. Vì sao, và cách chữa một dòng là gì?',
            options: [
              'The database had a memory leak; restart it|||Cơ sở dữ liệu bị rò bộ nhớ; khởi động lại nó',
              'The OOM killer picks the largest process, not the culprit — having the temporary job raise its own oom_score_adj to 1000 reversed it exactly|||OOM killer chọn tiến trình LỚN NHẤT, không phải thủ phạm — bắt tác vụ tạm thời tự nâng oom_score_adj của nó lên 1000 thì đảo ngược y hệt',
              'Swap was disabled; enable it|||Swap bị tắt; hãy bật lên',
              'The build was too slow|||Bản dựng chạy quá chậm',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'df reports 100% full, du disagrees, and rm on the largest file frees nothing. What is happening?|||df báo đầy 100%, du không đồng ý, và rm cái tệp lớn nhất chẳng giải phóng được gì. Chuyện gì đang xảy ra?',
            options: [
              'The filesystem is corrupt|||Hệ tệp bị hỏng',
              'A deleted file is still held open by a process, so the inode survives with no name — lsof -nP +L1 finds it and truncating through /proc/<pid>/fd frees it without a restart|||Một tệp đã xoá vẫn bị một tiến trình giữ mở, nên inode sống tiếp mà không còn tên — lsof -nP +L1 tìm ra nó và cắt cụt qua /proc/<pid>/fd giải phóng được mà không cần khởi động lại',
              'Inodes are exhausted|||Inode đã cạn',
              'The 5% root reserve is in use|||Phần 5% dự trữ cho root đang được dùng',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'Four cores were pinned at 100% and the one-minute load average read 0.10. What should you have looked at instead?|||Bốn nhân bị ghim 100% và load average một phút đọc ra 0,10. Lẽ ra bạn nên nhìn cái gì?',
            options: [
              'The five-minute load average|||Load average năm phút',
              'CPU computed from two readings of /proc/stat, which showed 100% immediately — load average is a moving average and describes the past|||CPU tính từ HAI lần đọc /proc/stat, thứ cho ra 100% NGAY — load average là một trung bình động và nó mô tả QUÁ KHỨ',
              'The number of processes in ps|||Số tiến trình trong ps',
              'Memory usage|||Mức dùng bộ nhớ',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'A backup file exists, is a plausible size, lists cleanly with pg_restore --list, and the restore exits 0. Is it a good backup?|||Một tệp sao lưu tồn tại, kích thước hợp lý, liệt kê sạch sẽ bằng pg_restore --list, và cú phục hồi thoát 0. Nó có phải một bản sao lưu tốt không?',
            options: [
              'Yes; four independent checks passed|||Có; bốn phép kiểm độc lập đều đạt',
              'No — all four were passed by a truncated dump that restored a 400,170-row table as empty; only restoring and comparing row counts against the source proves anything|||Không — cả bốn cái đó đều bị một bản dump cắt cụt vượt qua, và nó phục hồi một bảng 400.170 dòng thành RỖNG; chỉ có phục hồi rồi ĐỐI CHIẾU số dòng với nguồn mới chứng minh được điều gì',
              'Only if the file is over 20 MB|||Chỉ khi tệp lớn hơn 20 MB',
              'Yes, provided it is encrypted|||Có, miễn là nó đã được mã hoá',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'What is the single rule that would have caught the most failures measured in this course?|||Đúng MỘT quy tắc nào sẽ bắt được NHIỀU NHẤT những cú hỏng đã đo trong khoá này?',
            options: [
              'Deploy less often|||Deploy thưa hơn',
              'Verify from the address users type, comparing against what should be true — and make every check fail on purpose once before trusting it|||Kiểm từ ĐÚNG cái địa chỉ người dùng gõ vào, đối chiếu với thứ LẼ RA phải đúng — và bắt MỌI phép kiểm hỏng một cách có chủ đích một lần trước khi tin nó',
              'Add more monitoring|||Thêm nhiều giám sát hơn',
              'Use a bigger server|||Dùng máy chủ lớn hơn',
            ],
            correctIndex: 1,
            points: 10,
          },
        ],
      },
    },
  ],
};
