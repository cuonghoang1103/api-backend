const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';

export default {
  title: 'Section 0 — What a deploy actually is|||Mục 0 — Một lần deploy thật ra là cái gì',
  description: 'Bốn bước, và mỗi bước có kiểu hỏng âm thầm riêng. Mục này đo ba đường vận chuyển mã lên máy chủ bằng byte và giây, rồi đo cái giá của cách tráo phiên bản đơn giản nhất — trên hai ứng dụng chỉ khác nhau đúng một tính chất.',
  lessons: [

    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — Four steps, and four ways to fail|||0.1 — Bốn bước, và bốn kiểu hỏng',
      slug: 'deploy-0-1-bon-buoc',
      type: 'LESSON',
      description: 'Mọi lần deploy — script mười dòng hay hệ thống CI cả nghìn dòng — đều là cùng bốn bước. Tách chúng ra là điều kiện cần để biết bước nào đang hỏng, và bài này mở đầu bằng một phép đo cho thấy hai lần deploy trông giống hệt nhau lại gửi đi hai thứ khác nhau.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Four steps, and four ways to fail</h2>
<p class="lead">Every deploy is the same four steps, whether it is a ten-line shell script or a thousand-line pipeline: make an artifact, move it to the server, swap it in, and prove it works. Naming them separately is what lets you answer "which step broke" instead of "the deploy failed".</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Artifact — decide exactly what is being shipped</span><span class="lz-d">A directory of files, a git commit, a tarball, a container image. The question this step answers is <em>which bytes</em>, and it is the step people skip. Skipping it is how a half-written file reaches production.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Transport — get it onto the machine</span><span class="lz-d"><code>rsync</code>, <code>git pull</code>, <code>docker pull</code>, <code>scp</code>. Measured below: the three main options differ by more than taste, but not in the way most people assume.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Swap — make the new version the live one</span><span class="lz-d">Stop and start, or something smarter. The cost of the naive version is measured at the end of this lesson, and it depends almost entirely on one property of your application.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Verify — prove the new version actually serves traffic</span><span class="lz-d">Not "the script exited 0". An HTTP request, against a real route, with the answer checked. Every incident in this repository's own history was a deploy that reported success.</span></div>
</div>
<div class="callout"><strong>The four steps are independent.</strong> You can change transport without touching the swap, or add verification to a deploy that has none. Treating "deploy" as one indivisible thing is what makes it feel unfixable — there is no single knob, but there are four small ones.</div>

<h3>Step 1 is not optional: what an artifact excludes</h3>
<p>Two deploys of the same project, at the same moment, from the same directory. One uses <code>rsync</code> of the working tree; the other pushes a git commit. In between, a file is being edited and is not finished:</p>
<div class="out">  cay lam viec bay gio CO mot tep hong, CHUA commit:
     M src/server.js
    node --check: /tmp/duan/src/server.js:5

=== rsync (day CAY LAM VIEC) ===
    tren VPS: /srv/vps/app/src/server.js:5
=== git push (day thu DA COMMIT) ===
    tren VPS: cu phap HOP LE</div>
<p>The file has a syntax error — <code>node --check</code> names line 5 locally. After the <code>rsync</code>, <code>node --check</code> on the server names the same line 5: the broken file is now on the server. After the <code>git push</code>, the server still has valid syntax, because the broken edit was never committed and therefore was never part of the artifact.</p>
<div class="pitfall"><strong>Bẫy — rsync of a working tree ships whatever you happen to be typing.</strong> This is not a hypothetical: this project's own <code>deploy.sh</code> caught a half-written file from a parallel editing session three separate times, which is why the standard path was changed to build from committed code only. The failure is invisible at deploy time — <code>rsync</code> succeeds, the script exits 0 — and shows up as a crash loop minutes later.</div>
<p>That is the whole argument for step 1. An artifact is a decision about which bytes ship, made once, deliberately. "Whatever is in the directory right now" is not a decision; it is the absence of one.</p>

<h3>Step 2, measured: rsync versus git</h3>
<p>A 42-file project, 176 KB, deployed over real SSH to a real server. First the bytes actually sent:</p>
<div class="out">=== rsync ===
  lan dau:    Total file size: 108,720 bytes
              Total bytes sent: 85,318
  sua 1 tep:  Literal data: 435 bytes
              Total bytes sent: 1,228

=== git push ===
  sua 1 tep:  Enumerating objects: 7, done.
              Writing objects: 100% (4/4), 569 bytes | 569.00 KiB/s, done.
              Total 4 (delta 2), reused 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Both send only the delta</span><span class="v">1,228 bytes for rsync, 569 for git, to change one file in a 176 KB tree. Neither re-sends the project. The common belief that "rsync copies everything" is wrong — that is <code>scp</code>.</span></div>
  <div class="kv"><span class="k">Git sends less over the wire</span><span class="v">Roughly half here, because it ships compressed objects and a delta against what the remote already has, rather than a file-level diff.</span></div>
  <div class="kv"><span class="k">Git costs more on disk</span><span class="v">The bare repository on the server measured 556 KB against 176 KB for the rsync tree, and a clone added 608 KB of history — because git brings every version, forever.</span></div>
  <div class="kv"><span class="k">Neither difference is why you choose</span><span class="v">At this size both are under a second and under two kilobytes. The measurement above about the uncommitted file is what actually decides it.</span></div>
</div>

<p>The commands behind those numbers, so you can run them against your own project:</p>
<pre><code><span class="tok-comment"># rsync: xem CHINH XAC no gui bao nhieu byte</span>
rsync -az --delete --stats --exclude .git ./ vps:/srv/app/ | grep -E 'bytes sent|Literal'

<span class="tok-comment"># rsync: xem no dinh dong vao nhung TEP nao, ma KHONG gui gi (chay thu)</span>
rsync -azin --delete --exclude .git ./ vps:/srv/app/

<span class="tok-comment"># git: xem mot lan day gui bao nhieu</span>
git push --progress 2&gt;&amp;1 | grep -E 'Writing|Total'</code></pre>
<div class="note-ct">The <code>-n</code> in the second command is <code>--dry-run</code> and the <code>-i</code> is <code>--itemize-changes</code>. Together they answer "what would this deploy change?" without changing anything — the single most useful habit to build before running a deploy against production for the first time.</div>

<h3>The number that surprises people</h3>
<div class="out">=== rsync: lan dau (cay rong)      → 280 ms
=== rsync: lan hai (khong doi gi)  → 286 ms
=== rsync: sau khi sua DUNG MOT tep → 280 ms</div>
<p>Transferring 176 KB, transferring nothing, and transferring one small file all took about the same time. The work is not the transfer — it is the SSH connection: key exchange, authentication, session setup. At this project size the payload is free and the handshake is the whole cost.</p>
<div class="callout ok"><strong>This is why deploy scripts should reuse one SSH connection.</strong> A script that runs eight separate <code>ssh</code> commands pays that ~280 ms eight times before doing any work. OpenSSH solves it with <code>ControlMaster</code> — one connection, many commands — and Lesson 0.2 measures exactly what that saves.</div>

<h3>Step 3, measured: what the simplest swap costs</h3>
<p>The most common swap is: kill the old process, start the new one. Measured by polling <code>/health</code> every 50 ms across the swap, on a trivial Node application:</p>
<div class="out">=== TRIEN KHAI 'dung roi khoi dong lai' ===
  tong 200 phep do, 1 cai HONG
  gian doan: 0 ms  (1 request truot)
  200 dau tien sau khi dung: +94 ms</div>
<p>One failed request, and 94 ms until the new version answered. That is genuinely small — small enough that for a hobby project on a quiet evening, stop-and-start is a defensible strategy.</p>
<p>Now the identical deploy, on an application that differs in exactly one respect — it takes three seconds to become ready, which is what an application that reads config, connects to a database and warms a cache actually does:</p>
<div class="out">=== cung mot kieu trien khai, ung dung khoi dong mat 3s ===
  tong 200 phep do, 49 cai HONG
  gian doan: 2983 ms  (49 request truot)
  200 dau tien sau khi dung: +3070 ms</div>
<div class="callout warn"><strong>One request became forty-nine; 94 ms became 2,983 ms.</strong> Thirty-two times worse, from a property of the application that no deploy script can see. The startup time you never measured is the length of every outage you deploy. Chapter 3 is about making the swap independent of it.</div>
<div class="note-ct">Read the resolution honestly: polling every 50 ms means a single failure could represent anywhere from a moment to about 100 ms of downtime. That is why the second figure — <em>time until the first 200 after the kill</em> — is the more trustworthy of the two, and it is the one that grew from 94 ms to 3,070 ms.</div>

<h3>Step 4: what "it worked" has to mean</h3>
<p>The failure mode that matters most is a deploy that <em>reports success</em> and leaves the site broken. Every incident in this project's history is one of those: an image that built green, pushed green, swapped green, and then restarted forever because its Prisma engine was built for a different C library. A script exiting 0 proves the script ran, not that the site works.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Weakest: the script exited 0</span><span class="lz-lnote">Proves the commands ran. Says nothing about the application, which may not have started, or may be crash-looping.</span></div>
  <div class="lz-layer"><span class="lz-lname">Better: the process is running</span><span class="lz-lnote">A PID exists, or the port is listening. Better, and still passes while the app returns 500 to everything.</span></div>
  <div class="lz-layer"><span class="lz-lname">Right: a real route answers correctly</span><span class="lz-lnote">An HTTP request to a route the application actually serves, with the status checked. <code>401</code> and <code>200</code> both prove the route is mounted; <code>404</code> means it is not — a stale build, or a router that never registered.</span></div>
  <div class="lz-layer"><span class="lz-lname">Best: the deploy fails when that check fails</span><span class="lz-lnote">A verification whose result is ignored is decoration. If the smoke test cannot stop the deploy or trigger a rollback, it is not a gate.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — V. Build, release, run</span><span class="lc-sub">12factor.net/build-release-run — the clearest short statement of why the artifact must be separated from the release, which is step 1 above.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">rsync(1) — the --stats and --itemize-changes flags</span><span class="lc-sub">man7.org/linux/man-pages/man1/rsync.1.html — the two flags that produced the byte counts above, and the fastest way to see what a deploy is really sending.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — what a commit actually contains</span><span class="lc-sub">/courses/git/learn${REF} — the artifact in step 1, when the artifact is a commit.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — processes, signals and what kill really does</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the mechanism under step 3, and why a process does not die the instant you ask it to.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Bốn bước, và bốn kiểu hỏng</h2>
<p class="lead">Mọi lần deploy đều là cùng bốn bước, dù nó là một script shell mười dòng hay một đường ống CI cả nghìn dòng: tạo ra một tạo tác, chuyển nó lên máy chủ, tráo nó vào, và chứng minh nó chạy. Gọi tên từng bước riêng ra chính là thứ cho phép bạn trả lời "bước nào hỏng" thay vì "deploy thất bại".</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tạo tác — quyết định CHÍNH XÁC thứ gì được gửi đi</span><span class="lz-d">Một thư mục tệp, một commit git, một tệp nén, một ảnh container. Câu hỏi bước này trả lời là <em>những byte nào</em>, và đây là bước người ta hay bỏ qua. Bỏ qua nó chính là cách một tệp viết dở lên tới production.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Vận chuyển — đưa nó lên máy</span><span class="lz-d"><code>rsync</code>, <code>git pull</code>, <code>docker pull</code>, <code>scp</code>. Đo ngay dưới đây: ba lựa chọn chính khác nhau nhiều hơn chuyện sở thích, nhưng không khác theo cái cách mà phần lớn người ta tưởng.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Tráo — làm cho phiên bản mới thành phiên bản đang sống</span><span class="lz-d">Dừng rồi khởi động lại, hoặc một cách khôn hơn. Cái giá của cách ngây thơ được đo ở cuối bài này, và nó phụ thuộc gần như hoàn toàn vào MỘT tính chất của ứng dụng bạn.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Kiểm — chứng minh phiên bản mới thật sự đang phục vụ</span><span class="lz-d">Không phải "script thoát ra 0". Một request HTTP, vào một tuyến thật, có kiểm câu trả lời. Mọi sự cố trong lịch sử của chính kho mã này đều là một lần deploy đã BÁO THÀNH CÔNG.</span></div>
</div>
<div class="callout"><strong>Bốn bước đó độc lập với nhau.</strong> Bạn đổi được cách vận chuyển mà không đụng tới cách tráo, hoặc thêm bước kiểm vào một quy trình vốn chẳng có. Coi "deploy" là một khối không chia được chính là thứ làm nó có cảm giác không sửa nổi — không có một cái núm duy nhất, nhưng có bốn cái núm nhỏ.</div>

<h3>Bước 1 không phải tuỳ chọn: một tạo tác LOẠI TRỪ cái gì</h3>
<p>Hai lần deploy cùng một dự án, cùng một thời điểm, từ cùng một thư mục. Một cái dùng <code>rsync</code> cây làm việc; cái kia đẩy một commit git. Ở giữa, có một tệp đang được sửa và chưa xong:</p>
<div class="out">  cay lam viec bay gio CO mot tep hong, CHUA commit:
     M src/server.js
    node --check: /tmp/duan/src/server.js:5

=== rsync (day CAY LAM VIEC) ===
    tren VPS: /srv/vps/app/src/server.js:5
=== git push (day thu DA COMMIT) ===
    tren VPS: cu phap HOP LE</div>
<p>Cái tệp đó có lỗi cú pháp — <code>node --check</code> chỉ đích danh dòng 5 ở máy local. Sau lệnh <code>rsync</code>, <code>node --check</code> chạy TRÊN MÁY CHỦ cũng chỉ đúng dòng 5 ấy: tệp hỏng bây giờ đã nằm trên máy chủ. Sau lệnh <code>git push</code>, máy chủ vẫn có cú pháp hợp lệ, vì cái sửa dở kia chưa từng được commit nên chưa từng là một phần của tạo tác.</p>
<div class="pitfall"><strong>Bẫy — rsync một cây làm việc thì gửi đi bất cứ thứ gì bạn đang gõ dở.</strong> Đây không phải chuyện giả định: chính <code>deploy.sh</code> của dự án này đã ba lần chộp trúng một tệp viết dở từ một phiên soạn thảo song song, và đó là lý do đường chuẩn được đổi sang chỉ dựng từ mã ĐÃ COMMIT. Kiểu hỏng này vô hình ngay lúc deploy — <code>rsync</code> thành công, script thoát ra 0 — rồi hiện ra thành một vòng lặp sập vài phút sau đó.</div>
<p>Đó là toàn bộ lý lẽ cho bước 1. Một tạo tác là một QUYẾT ĐỊNH về việc những byte nào được gửi đi, ra quyết định một lần, một cách có chủ ý. "Bất cứ thứ gì đang có trong thư mục lúc này" không phải một quyết định; nó là sự vắng mặt của quyết định.</p>

<h3>Bước 2, đo thật: rsync so với git</h3>
<p>Một dự án 42 tệp, 176 KB, deploy qua SSH thật lên một máy chủ thật. Trước hết là số byte thật sự được gửi:</p>
<div class="out">=== rsync ===
  lan dau:    Total file size: 108,720 bytes
              Total bytes sent: 85,318
  sua 1 tep:  Literal data: 435 bytes
              Total bytes sent: 1,228

=== git push ===
  sua 1 tep:  Enumerating objects: 7, done.
              Writing objects: 100% (4/4), 569 bytes | 569.00 KiB/s, done.
              Total 4 (delta 2), reused 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Cả hai đều chỉ gửi phần CHÊNH LỆCH</span><span class="v">1.228 byte với rsync, 569 byte với git, để đổi một tệp trong cây 176 KB. Không cái nào gửi lại cả dự án. Cái niềm tin phổ biến rằng "rsync chép hết" là SAI — cái chép hết là <code>scp</code>.</span></div>
  <div class="kv"><span class="k">Git gửi ít hơn qua đường truyền</span><span class="v">Ở đây khoảng một nửa, vì nó gửi các đối tượng đã nén cùng một delta so với thứ máy kia đã có, chứ không phải một bản khác biệt ở mức tệp.</span></div>
  <div class="kv"><span class="k">Git tốn nhiều hơn trên ĐĨA</span><span class="v">Kho trần trên máy chủ đo được 556 KB so với 176 KB của cây rsync, và một lần clone thêm 608 KB lịch sử — vì git mang theo MỌI phiên bản, mãi mãi.</span></div>
  <div class="kv"><span class="k">Không khác biệt nào ở trên là lý do để chọn</span><span class="v">Ở cỡ dự án này thì cả hai đều dưới một giây và dưới hai kilobyte. Chính phép đo về cái tệp chưa commit ở trên mới là thứ quyết định.</span></div>
</div>

<p>Mấy lệnh đứng sau những con số đó, để bạn chạy được trên chính dự án của mình:</p>
<pre><code><span class="tok-comment"># rsync: xem CHINH XAC no gui bao nhieu byte</span>
rsync -az --delete --stats --exclude .git ./ vps:/srv/app/ | grep -E 'bytes sent|Literal'

<span class="tok-comment"># rsync: xem no dinh dong vao nhung TEP nao, ma KHONG gui gi (chay thu)</span>
rsync -azin --delete --exclude .git ./ vps:/srv/app/

<span class="tok-comment"># git: xem mot lan day gui bao nhieu</span>
git push --progress 2&gt;&amp;1 | grep -E 'Writing|Total'</code></pre>
<div class="note-ct">Chữ <code>-n</code> ở lệnh thứ hai là <code>--dry-run</code> còn <code>-i</code> là <code>--itemize-changes</code>. Ghép lại chúng trả lời câu "lần deploy này sẽ đổi những gì?" mà không đổi bất cứ thứ gì — đây là thói quen hữu ích nhất cần rèn trước khi lần đầu chạy một lệnh deploy vào production.</div>

<h3>Con số làm người ta bất ngờ</h3>
<div class="out">=== rsync: lan dau (cay rong)      → 280 ms
=== rsync: lan hai (khong doi gi)  → 286 ms
=== rsync: sau khi sua DUNG MOT tep → 280 ms</div>
<p>Chuyển 176 KB, chuyển KHÔNG GÌ CẢ, và chuyển một tệp nhỏ đều mất chừng ấy thời gian như nhau. Công việc không nằm ở phần truyền — nó nằm ở KẾT NỐI SSH: trao đổi khoá, xác thực, dựng phiên. Ở cỡ dự án này thì phần tải là miễn phí còn cái bắt tay là toàn bộ chi phí.</p>
<div class="callout ok"><strong>Đây là lý do script deploy nên TÁI DÙNG một kết nối SSH.</strong> Một script chạy tám lệnh <code>ssh</code> riêng lẻ thì trả cái giá ~280 ms đó tám lần trước khi làm được việc gì. OpenSSH giải quyết bằng <code>ControlMaster</code> — một kết nối, nhiều lệnh — và Bài 0.2 đo chính xác nó tiết kiệm được bao nhiêu.</div>

<h3>Bước 3, đo thật: cách tráo đơn giản nhất tốn bao nhiêu</h3>
<p>Cách tráo phổ biến nhất là: giết tiến trình cũ, khởi động cái mới. Đo bằng cách hỏi <code>/health</code> mỗi 50 ms xuyên qua lần tráo, trên một ứng dụng Node tầm thường:</p>
<div class="out">=== TRIEN KHAI 'dung roi khoi dong lai' ===
  tong 200 phep do, 1 cai HONG
  gian doan: 0 ms  (1 request truot)
  200 dau tien sau khi dung: +94 ms</div>
<p>Một request hỏng, và 94 ms cho tới khi phiên bản mới trả lời. Con số đó THẬT SỰ nhỏ — nhỏ tới mức với một dự án cá nhân vào một buổi tối vắng khách thì dừng-rồi-khởi-động-lại là một chiến lược bảo vệ được.</p>
<p>Giờ vẫn đúng lần deploy ấy, trên một ứng dụng chỉ khác đúng một điểm — nó mất BA GIÂY để sẵn sàng, mà đó chính là thứ một ứng dụng phải đọc cấu hình, kết nối cơ sở dữ liệu và dựng bộ đệm sẽ làm:</p>
<div class="out">=== cung mot kieu trien khai, ung dung khoi dong mat 3s ===
  tong 200 phep do, 49 cai HONG
  gian doan: 2983 ms  (49 request truot)
  200 dau tien sau khi dung: +3070 ms</div>
<div class="callout warn"><strong>Một request thành bốn mươi chín; 94 ms thành 2.983 ms.</strong> Tệ hơn ba mươi hai lần, chỉ vì một tính chất của ứng dụng mà không script deploy nào nhìn thấy được. Cái thời gian khởi động bạn chưa bao giờ đo chính là độ dài của mọi lần gián đoạn bạn deploy ra. Chương 3 nói về chuyện làm cho bước tráo ĐỘC LẬP với nó.</div>
<div class="note-ct">Hãy đọc độ phân giải cho trung thực: hỏi mỗi 50 ms nghĩa là MỘT lần hỏng có thể ứng với bất cứ đâu từ một khoảnh khắc tới khoảng 100 ms gián đoạn. Đó là lý do con số thứ hai — <em>thời gian tới cú 200 đầu tiên sau khi giết</em> — mới là con số đáng tin hơn, và chính nó tăng từ 94 ms lên 3.070 ms.</div>

<h3>Bước 4: "nó chạy rồi" phải có nghĩa là gì</h3>
<p>Kiểu hỏng đáng sợ nhất là một lần deploy <em>BÁO THÀNH CÔNG</em> mà để lại một website hỏng. Mọi sự cố trong lịch sử dự án này đều thuộc loại đó: một ảnh dựng xanh, đẩy xanh, tráo xanh, rồi restart vô tận vì engine Prisma của nó được dựng cho một thư viện C khác. Một script thoát ra 0 chứng minh rằng SCRIPT đã chạy, không chứng minh rằng WEBSITE chạy.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Yếu nhất: script thoát ra 0</span><span class="lz-lnote">Chứng minh các lệnh đã chạy. Không nói gì về ứng dụng, thứ có thể chưa khởi động nổi, hoặc đang sập đi sập lại.</span></div>
  <div class="lz-layer"><span class="lz-lname">Khá hơn: tiến trình đang chạy</span><span class="lz-lnote">Có một PID, hoặc cổng đang được lắng nghe. Khá hơn, và vẫn qua được trong lúc ứng dụng trả 500 cho tất cả mọi thứ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đúng: một tuyến THẬT trả lời đúng</span><span class="lz-lnote">Một request HTTP vào một tuyến mà ứng dụng thật sự phục vụ, có kiểm mã trạng thái. <code>401</code> và <code>200</code> đều chứng minh tuyến đã được gắn; <code>404</code> nghĩa là chưa — bản dựng cũ, hoặc bộ định tuyến chưa đăng ký.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tốt nhất: phép kiểm đó HỎNG thì deploy phải HỎNG</span><span class="lz-lnote">Một phép kiểm mà kết quả bị bỏ qua thì chỉ là đồ trang trí. Nếu smoke test không dừng được lần deploy hay không kích hoạt được lùi lại, thì nó không phải một cái cổng.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — V. Build, release, run</span><span class="lc-sub">12factor.net/build-release-run — phát biểu ngắn gọn và rõ nhất về việc vì sao phải tách tạo tác khỏi bản phát hành, tức là bước 1 ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">rsync(1) — hai cờ --stats và --itemize-changes</span><span class="lc-sub">man7.org/linux/man-pages/man1/rsync.1.html — hai cái cờ đã sinh ra mấy con số byte ở trên, và là cách nhanh nhất để thấy một lần deploy thật sự gửi đi cái gì.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — một commit thật ra chứa cái gì</span><span class="lc-sub">/courses/git/learn${REF} — chính là cái tạo tác ở bước 1, khi tạo tác là một commit.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — tiến trình, tín hiệu và kill thật ra làm gì</span><span class="lc-sub">/courses/linux-bash/learn${REF} — cơ chế nằm dưới bước 3, và vì sao một tiến trình không chết ngay khoảnh khắc bạn bảo nó chết.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — The machine that receives the deploy|||0.2 — Cái máy nhận lần deploy',
      slug: 'deploy-0-2-may-nhan',
      type: 'LESSON',
      description: 'Bốn thay đổi trên máy chủ, mỗi cái đo bằng thứ kẻ tấn công nhìn thấy hoặc bằng thời gian tiết kiệm được. Trong đó có một khoá SSH không thể biến thành shell, và một lỗi quyền sở hữu tệp mà mọi hướng dẫn rsync đều bỏ qua.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>The machine that receives the deploy</h2>
<p class="lead">A fresh VPS is reachable from the entire internet within seconds of being created, and the automated login attempts start about as fast. This lesson makes four changes and measures each one — not by quoting a checklist, but by looking at what an attacker actually sees before and after.</p>

<h3>First, read what is actually in effect</h3>
<p>Do not read <code>/etc/ssh/sshd_config</code> to find out what SSH allows. That file is a wish; it has commented-out defaults, <code>Include</code> directives pulling in <code>sshd_config.d/*.conf</code>, and settings that a later line silently overrides. <code>sshd -T</code> prints the values the daemon will actually use:</p>
<div class="out">$ sshd -T | grep -iE 'permitroot|password|pubkey|maxauth|forwarding'

  maxauthtries 6
  permitrootlogin without-password
  pubkeyauthentication yes
  passwordauthentication yes
  kbdinteractiveauthentication no
  x11forwarding yes
  permitemptypasswords no
  allowtcpforwarding yes
  permittunnel no</div>
<div class="note-ct">Two things worth noticing in a default install. <code>passwordauthentication yes</code> — passwords are accepted, which is the single setting most worth changing. And <code>permitrootlogin without-password</code>, which despite its name does <em>not</em> mean "no password needed"; it means "any method except a password", so key-based root login is allowed. The clearer synonym is <code>prohibit-password</code>, and modern OpenSSH prints that instead.</div>

<h3>What an attacker sees, before and after</h3>
<p>Two daemons, one default and one hardened, asked for a password login by a user that does not exist:</p>
<div class="out">=== cong 2222 (mac dinh) ===
  Permission denied, please try again.
  Permission denied, please try again.
  Permission denied (publickey,password).

=== cong 2223 (da gia co) ===
  Permission denied (publickey).</div>
<p>The default gave three password prompts and then named both accepted methods. The hardened one refused immediately and named only <code>publickey</code>.</p>
<div class="callout warn"><strong>That parenthesis is reconnaissance.</strong> <code>(publickey,password)</code> tells a scanner that guessing is worth its time, and the three prompts tell it how many guesses it gets per connection. <code>(publickey)</code> tells it there is nothing to guess — no password exists that will work, however weak, however many attempts. It is the difference between a lock that can be picked slowly and a door with no keyhole.</div>
<pre><code><span class="tok-comment"># /etc/ssh/sshd_config.d/10-gia-co.conf</span>
PermitRootLogin prohibit-password    <span class="tok-comment"># khoa duoc, mat khau thi khong</span>
PasswordAuthentication no            <span class="tok-comment"># thay doi quan trong nhat</span>
KbdInteractiveAuthentication no      <span class="tok-comment"># cua sau cua mat khau — dong luon</span>
PermitEmptyPasswords no
MaxAuthTries 3
X11Forwarding no
AllowTcpForwarding no                <span class="tok-comment"># chi tat neu ban khong dung tunnel</span>
AllowAgentForwarding no</code></pre>
<div class="pitfall"><strong>Bẫy — <code>PasswordAuthentication no</code> without <code>KbdInteractiveAuthentication no</code> is a half-closed door.</strong> Keyboard-interactive is a separate mechanism that on many distributions ends up asking for the same password through PAM. Turning off one and leaving the other is a configuration that reads as hardened and measures as open. The <code>sshd -T</code> output above is how you check which state you are actually in — and always test the new setting from a second terminal <em>before</em> closing the first, because a locked-out root on a VPS means a console rescue session.</div>

<h3>A key that cannot become a shell</h3>
<p>A deploy key lives in CI, or in a script, or on a laptop. If it is stolen, the default outcome is a full shell on the server. It does not have to be. Prefixing the key in <code>authorized_keys</code> with a forced command means that key runs one program and nothing else:</p>
<pre><code><span class="tok-comment"># ~/.ssh/authorized_keys — tat ca tren MOT dong</span>
command="/srv/vps/chi-duoc-deploy.sh",no-agent-forwarding,no-port-forwarding,\\
no-pty,no-X11-forwarding ssh-ed25519 AAAAC3Nza... deploy@ci</code></pre>
<p>Three attempts with that key — one legitimate, two not:</p>
<div class="out">=== 1) khoa deploy chay dung viec cua no ===
  [deploy] lenh client YEU CAU: deploy
  [deploy] dang trien khai...
=== 2) cung khoa do, nhung doi lay mot SHELL ===
  [deploy] lenh client YEU CAU: &lt;khong co&gt;
  [deploy] dang trien khai...
=== 3) cung khoa do, doi doc /etc/shadow ===
  [deploy] lenh client YEU CAU: cat /etc/shadow
  [deploy] dang trien khai...</div>
<div class="callout ok"><strong>All three ran the deploy script.</strong> Asking for a shell got the deploy script. Asking to read the shadow password file got the deploy script. What the client requested is not discarded — it arrives in <code>\$SSH_ORIGINAL_COMMAND</code>, which is how a forced-command script can offer a small menu of allowed actions, and also how you log exactly what a stolen key tried to do.</div>
<p><code>no-pty</code> is what stops an interactive terminal being allocated at all, and the three <code>no-*-forwarding</code> options stop the key being used to tunnel into the private network behind the server. Together they turn a credential worth stealing into one worth much less.</p>

<h3>Reuse the connection: 228 ms becomes 8 ms</h3>
<p>Lesson 0.1 measured that an <code>rsync</code> takes about 280 ms regardless of payload, because the SSH handshake is the cost. A deploy script runs many SSH commands, and each one pays it again. OpenSSH can multiplex them over a single connection:</p>
<div class="out">=== 8 lenh ssh RIENG LE (moi cai mot ket noi) ===
  1830 ms  (228 ms/lenh)
=== 8 lenh ssh dung CHUNG mot ket noi (ControlMaster) ===
  71 ms  (8 ms/lenh)</div>
<pre><code><span class="tok-comment"># ~/.ssh/config</span>
Host vps
    HostName 203.0.113.10
    User trienkhai
    ControlMaster auto
    ControlPath  ~/.ssh/cm-%r@%h:%p
    ControlPersist 60          <span class="tok-comment"># giu ket noi song them 60s sau lenh cuoi</span></code></pre>
<p>Twenty-six times faster per command, and the saving grows with every step a deploy script adds. It costs one block in <code>~/.ssh/config</code> and nothing on the server.</p>
<div class="note-ct">Close a persistent connection deliberately with <code>ssh -O exit vps</code>. Two things to know: the socket path is a real file, so a stale one after a crash produces a confusing "control socket already exists" — delete it. And a multiplexed session inherits the master connection, so changing <code>~/.ssh/config</code> has no effect until the master exits.</div>

<h3>The ownership bug every rsync guide skips</h3>
<p>The application should not run as root, so it gets its own user. The directory is created and given to that user. Then the deploy runs — as root, because that is who has the SSH key — and this happens:</p>
<div class="out">  /srv/vps/app2 thuoc: trienkhai:trienkhai
=== rsync bang root vao thu muc cua trienkhai ===
  sau rsync: root:root
  → ung dung chay duoi trienkhai co doc duoc khong: CO
  → co GHI de duoc khong (log, cache, upload): KHONG</div>
<div class="pitfall"><strong>Bẫy — the files land owned by whoever ran the deploy, not by whoever owns the directory.</strong> The application can still <em>read</em> everything, because the files are world-readable, so the site comes up and almost every route works. What breaks is anything that writes into the tree: a log file, a cache directory, an upload folder, a SQLite database, a framework build cache. It fails with a permission error on one code path, hours later, and the deploy that caused it reported success.</div>
<p>Three fixes, in order of preference. Deploy <em>as</em> the application user, so the question never arises. Or tell rsync who should own the result — <code>rsync --chown=trienkhai:trienkhai</code>, which needs root on the receiving side. Or keep the writable directories out of the deployed tree entirely, which is the direction Chapter 4 argues for anyway: an artifact should be read-only, and everything that changes at runtime should live somewhere the deploy never touches.</p>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">sshd_config(5) — every option in the hardening block</span><span class="lc-sub">man.openbsd.org/sshd_config — the authority on what <code>prohibit-password</code> means and why keyboard-interactive is separate from password auth.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">sshd(8) — the AUTHORIZED_KEYS FILE FORMAT section</span><span class="lc-sub">man.openbsd.org/sshd#AUTHORIZED_KEYS_FILE_FORMAT — the full list of key restrictions, including <code>command=</code>, <code>from=</code> and <code>restrict</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ssh_config(5) — ControlMaster, ControlPath, ControlPersist</span><span class="lc-sub">man.openbsd.org/ssh_config — the three settings behind the 26× measurement, and the tokens available in a control path.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — users, groups and the permission bits</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the mechanism under the ownership bug, including why read works and write does not.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cái máy nhận lần deploy</h2>
<p class="lead">Một con VPS mới toanh có thể được cả internet với tới chỉ vài giây sau khi tạo, và mấy cú thử đăng nhập tự động bắt đầu cũng nhanh chừng ấy. Bài này thực hiện bốn thay đổi và ĐO từng cái — không phải bằng cách chép lại một danh mục kiểm, mà bằng cách nhìn xem kẻ tấn công thật sự thấy gì trước và sau.</p>

<h3>Trước hết, hãy đọc thứ ĐANG THỰC SỰ có hiệu lực</h3>
<p>Đừng đọc <code>/etc/ssh/sshd_config</code> để biết SSH đang cho phép cái gì. Tệp đó là một điều ước; nó đầy giá trị mặc định bị chú thích, những chỉ thị <code>Include</code> kéo vào <code>sshd_config.d/*.conf</code>, và những thiết lập bị một dòng phía sau âm thầm ghi đè. <code>sshd -T</code> in ra đúng những giá trị mà daemon sẽ dùng thật:</p>
<div class="out">$ sshd -T | grep -iE 'permitroot|password|pubkey|maxauth|forwarding'

  maxauthtries 6
  permitrootlogin without-password
  pubkeyauthentication yes
  passwordauthentication yes
  kbdinteractiveauthentication no
  x11forwarding yes
  permitemptypasswords no
  allowtcpforwarding yes
  permittunnel no</div>
<div class="note-ct">Có hai chỗ đáng để ý trong một bản cài mặc định. <code>passwordauthentication yes</code> — mật khẩu ĐƯỢC chấp nhận, và đây là thiết lập đáng đổi nhất. Và <code>permitrootlogin without-password</code>, cái tên nghe như "không cần mật khẩu" nhưng <em>KHÔNG</em> có nghĩa đó; nó nghĩa là "mọi phương thức TRỪ mật khẩu", tức là đăng nhập root bằng khoá vẫn được phép. Từ đồng nghĩa rõ hơn là <code>prohibit-password</code>, và OpenSSH đời mới in ra từ đó.</div>

<h3>Kẻ tấn công thấy gì, trước và sau</h3>
<p>Hai daemon, một cái mặc định và một cái đã gia cố, cùng bị đòi đăng nhập bằng mật khẩu bởi một người dùng không tồn tại:</p>
<div class="out">=== cong 2222 (mac dinh) ===
  Permission denied, please try again.
  Permission denied, please try again.
  Permission denied (publickey,password).

=== cong 2223 (da gia co) ===
  Permission denied (publickey).</div>
<p>Bản mặc định cho ba lượt hỏi mật khẩu rồi nêu tên cả hai phương thức được chấp nhận. Bản gia cố từ chối NGAY và chỉ nêu <code>publickey</code>.</p>
<div class="callout warn"><strong>Cái ngoặc đơn đó là trinh sát.</strong> <code>(publickey,password)</code> nói với một con dò rằng việc đoán là đáng bỏ công, và ba lượt hỏi kia nói cho nó biết mỗi kết nối được đoán mấy lần. <code>(publickey)</code> nói với nó rằng chẳng có gì để đoán cả — không tồn tại mật khẩu nào chạy được, dù yếu tới đâu, dù thử bao nhiêu lần. Đó là khác biệt giữa một ổ khoá có thể cạy từ từ và một cánh cửa KHÔNG CÓ lỗ khoá.</div>
<pre><code><span class="tok-comment"># /etc/ssh/sshd_config.d/10-gia-co.conf</span>
PermitRootLogin prohibit-password    <span class="tok-comment"># khoa duoc, mat khau thi khong</span>
PasswordAuthentication no            <span class="tok-comment"># thay doi quan trong nhat</span>
KbdInteractiveAuthentication no      <span class="tok-comment"># cua sau cua mat khau — dong luon</span>
PermitEmptyPasswords no
MaxAuthTries 3
X11Forwarding no
AllowTcpForwarding no                <span class="tok-comment"># chi tat neu ban khong dung tunnel</span>
AllowAgentForwarding no</code></pre>
<div class="pitfall"><strong>Bẫy — <code>PasswordAuthentication no</code> mà thiếu <code>KbdInteractiveAuthentication no</code> là một cánh cửa mới khép một nửa.</strong> Keyboard-interactive là một cơ chế RIÊNG mà trên nhiều bản phân phối rốt cuộc vẫn đi hỏi đúng cái mật khẩu đó qua PAM. Tắt một cái và bỏ cái kia là một cấu hình ĐỌC thì thấy đã gia cố còn ĐO thì thấy vẫn mở. Kết quả <code>sshd -T</code> ở trên chính là cách kiểm xem bạn đang ở trạng thái nào — và LUÔN thử thiết lập mới từ một cửa sổ terminal thứ hai <em>TRƯỚC KHI</em> đóng cửa sổ đầu, vì một con VPS mà root bị khoá ngoài nghĩa là phải vào phiên cứu hộ qua console.</div>

<h3>Một cái khoá không thể biến thành shell</h3>
<p>Khoá deploy sống trong CI, hoặc trong một script, hoặc trên một cái laptop. Nếu nó bị trộm thì kết cục mặc định là kẻ trộm có nguyên một shell trên máy chủ. Không nhất thiết phải như vậy. Thêm tiền tố forced command cho cái khoá đó trong <code>authorized_keys</code> nghĩa là khoá ấy chạy đúng MỘT chương trình và không gì khác:</p>
<pre><code><span class="tok-comment"># ~/.ssh/authorized_keys — tat ca tren MOT dong</span>
command="/srv/vps/chi-duoc-deploy.sh",no-agent-forwarding,no-port-forwarding,\\
no-pty,no-X11-forwarding ssh-ed25519 AAAAC3Nza... deploy@ci</code></pre>
<p>Ba lần thử với cái khoá đó — một lần chính đáng, hai lần không:</p>
<div class="out">=== 1) khoa deploy chay dung viec cua no ===
  [deploy] lenh client YEU CAU: deploy
  [deploy] dang trien khai...
=== 2) cung khoa do, nhung doi lay mot SHELL ===
  [deploy] lenh client YEU CAU: &lt;khong co&gt;
  [deploy] dang trien khai...
=== 3) cung khoa do, doi doc /etc/shadow ===
  [deploy] lenh client YEU CAU: cat /etc/shadow
  [deploy] dang trien khai...</div>
<div class="callout ok"><strong>Cả ba lần đều chạy script deploy.</strong> Đòi một shell thì nhận được script deploy. Đòi đọc tệp mật khẩu bóng thì nhận được script deploy. Thứ client YÊU CẦU không bị vứt đi — nó tới trong biến <code>\$SSH_ORIGINAL_COMMAND</code>, và đó là cách một script forced-command có thể mở ra một thực đơn nhỏ các hành động được phép, và cũng là cách bạn ghi lại chính xác một cái khoá bị trộm đã thử làm gì.</div>
<p><code>no-pty</code> là thứ ngăn hẳn việc cấp phát một terminal tương tác, còn ba tuỳ chọn <code>no-*-forwarding</code> ngăn cái khoá bị dùng để đào hầm vào mạng riêng nằm sau máy chủ. Cộng lại, chúng biến một tín vật đáng trộm thành một thứ đáng trộm ít hơn hẳn.</p>

<h3>Tái dùng kết nối: 228 ms thành 8 ms</h3>
<p>Bài 0.1 đã đo rằng một lệnh <code>rsync</code> mất chừng 280 ms bất kể tải nặng nhẹ, vì cái bắt tay SSH mới là chi phí. Một script deploy chạy nhiều lệnh SSH, và mỗi lệnh lại trả cái giá đó một lần nữa. OpenSSH ghép được tất cả chúng lên MỘT kết nối:</p>
<div class="out">=== 8 lenh ssh RIENG LE (moi cai mot ket noi) ===
  1830 ms  (228 ms/lenh)
=== 8 lenh ssh dung CHUNG mot ket noi (ControlMaster) ===
  71 ms  (8 ms/lenh)</div>
<pre><code><span class="tok-comment"># ~/.ssh/config</span>
Host vps
    HostName 203.0.113.10
    User trienkhai
    ControlMaster auto
    ControlPath  ~/.ssh/cm-%r@%h:%p
    ControlPersist 60          <span class="tok-comment"># giu ket noi song them 60s sau lenh cuoi</span></code></pre>
<p>Nhanh hơn hai mươi sáu lần trên mỗi lệnh, và mức tiết kiệm còn tăng theo từng bước mà script deploy thêm vào. Nó tốn đúng một khối trong <code>~/.ssh/config</code> và không tốn gì trên máy chủ.</p>
<div class="note-ct">Đóng một kết nối bền vững một cách có chủ ý bằng <code>ssh -O exit vps</code>. Có hai điều nên biết: đường dẫn socket là một tệp THẬT, nên một cái socket cũ còn sót sau khi sập sẽ sinh ra thông báo khó hiểu "control socket already exists" — hãy xoá nó đi. Và một phiên ghép kênh kế thừa kết nối chủ, nên sửa <code>~/.ssh/config</code> sẽ KHÔNG có tác dụng gì cho tới khi kết nối chủ thoát.</div>

<h3>Lỗi quyền sở hữu mà mọi hướng dẫn rsync đều bỏ qua</h3>
<p>Ứng dụng không nên chạy dưới root, nên nó có người dùng riêng. Thư mục được tạo và giao cho người dùng đó. Rồi lần deploy chạy — dưới quyền root, vì root mới là bên giữ khoá SSH — và chuyện này xảy ra:</p>
<div class="out">  /srv/vps/app2 thuoc: trienkhai:trienkhai
=== rsync bang root vao thu muc cua trienkhai ===
  sau rsync: root:root
  → ung dung chay duoi trienkhai co doc duoc khong: CO
  → co GHI de duoc khong (log, cache, upload): KHONG</div>
<div class="pitfall"><strong>Bẫy — tệp rơi xuống thuộc về NGƯỜI CHẠY DEPLOY, không thuộc về người sở hữu thư mục.</strong> Ứng dụng vẫn <em>ĐỌC</em> được mọi thứ, vì tệp cho cả thế giới đọc, nên website vẫn lên và gần như mọi tuyến vẫn chạy. Thứ vỡ là bất cứ cái gì GHI vào trong cây: một tệp log, một thư mục cache, một thư mục upload, một cơ sở dữ liệu SQLite, một cache dựng của framework. Nó hỏng bằng một lỗi quyền trên đúng một nhánh mã, vài giờ sau, và lần deploy gây ra nó thì đã báo thành công.</div>
<p>Ba cách sửa, xếp theo mức ưu tiên. Deploy <em>DƯỚI QUYỀN</em> người dùng của ứng dụng, để câu hỏi này không bao giờ phát sinh. Hoặc bảo rsync ai nên sở hữu kết quả — <code>rsync --chown=trienkhai:trienkhai</code>, cái này cần quyền root ở phía nhận. Hoặc đưa hẳn những thư mục có ghi ra ngoài cây được deploy, và đó cũng chính là hướng mà Chương 4 sẽ lập luận: một tạo tác nên CHỈ ĐỌC, còn mọi thứ thay đổi lúc chạy thì nên sống ở một chỗ mà lần deploy không bao giờ đụng tới.</p>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">sshd_config(5) — mọi tuỳ chọn trong khối gia cố</span><span class="lc-sub">man.openbsd.org/sshd_config — nguồn chính thống về việc <code>prohibit-password</code> nghĩa là gì và vì sao keyboard-interactive tách khỏi xác thực mật khẩu.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">sshd(8) — mục AUTHORIZED_KEYS FILE FORMAT</span><span class="lc-sub">man.openbsd.org/sshd#AUTHORIZED_KEYS_FILE_FORMAT — danh sách đầy đủ các ràng buộc đặt lên khoá, trong đó có <code>command=</code>, <code>from=</code> và <code>restrict</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ssh_config(5) — ControlMaster, ControlPath, ControlPersist</span><span class="lc-sub">man.openbsd.org/ssh_config — ba thiết lập nằm sau phép đo 26 lần, và các ký hiệu thay thế dùng được trong đường dẫn control path.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — người dùng, nhóm và các bit quyền</span><span class="lc-sub">/courses/linux-bash/learn${REF} — cơ chế nằm dưới lỗi quyền sở hữu, kể cả chuyện vì sao đọc thì được mà ghi thì không.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — The first deploy, done by hand|||0.3 — Lần deploy đầu tiên, làm bằng tay',
      slug: 'deploy-0-3-lan-dau-lam-tay',
      type: 'LESSON',
      description: 'Bốn bước chạy bằng tay trên một máy chủ thật, ba lần: một bản tốt, một bản chết hẳn, và một bản KHỞI ĐỘNG ĐƯỢC nhưng hỏng. Bản thứ ba qua được ba trong bốn phép kiểm — và đó là toàn bộ lý do bước 4 phải là một request HTTP thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The first deploy, done by hand</h2>
<p class="lead">Before automating anything, do it once by hand and watch each step. The script you write afterwards is only worth having if you already know what it is supposed to check — and the measurement below shows that the obvious checks are the ones that do not work.</p>

<h3>The four steps, as commands</h3>
<pre><code><span class="tok-comment"># BUOC 1 — tao tac: chi lay thu DA COMMIT (bai 0.1)</span>
git archive --format=tar HEAD | gzip &gt; /tmp/ban-phat-hanh.tar.gz

<span class="tok-comment"># BUOC 2 — van chuyen</span>
scp /tmp/ban-phat-hanh.tar.gz vps:/srv/vps/phat-hanh/

<span class="tok-comment"># BUOC 3 — trao</span>
ssh vps 'cd /srv/vps/app &amp;&amp; tar xzf ../phat-hanh/ban-phat-hanh.tar.gz &amp;&amp; \\
         pkill -f "node src/server.js"; sleep 0.3; \\
         setsid nohup node src/server.js &gt;/srv/vps/app.log 2&gt;&amp;1 &lt;/dev/null &amp;'

<span class="tok-comment"># BUOC 4 — kiem</span>
ssh vps 'curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/health'</code></pre>
<div class="pitfall"><strong>Bẫy — a remote command that leaves a stream open makes <code>ssh</code> hang forever.</strong> Writing the step-3 line without <code>&lt;/dev/null</code> is the classic version of this: the background process inherits SSH's stdin, SSH waits for the channel to close, and the deploy script sits there until something kills it. It looks like a slow server. It is a file descriptor. Redirect all three streams — <code>&gt;log 2&gt;&amp;1 &lt;/dev/null</code> — and use <code>setsid</code> so the process survives the session ending.</div>
<p><code>git archive</code> is worth knowing: it writes a tarball of exactly one commit, with no <code>.git</code> directory and no working-tree changes. It is the smallest honest answer to "which bytes are we shipping" — an artifact, in one command, with no build system involved.</p>

<h3>Step 4, measured on three deploys</h3>
<p>The same deploy script, with four levels of verification in it, run three times: once on a good build, once on a build whose entry file does not exist, and once on a build that starts perfectly and is nonetheless broken.</p>
<div class="out">════ A) trien khai mot ban TOT ════
  a) script thoat ra 0?          → 0
  b) tien trinh dang chay?       → 32689
  c) cong 3000 co ai nghe?       → CO
  d) tuyen THAT tra loi dung?    → 200
  ✅ DEPLOY THANH CONG

════ B) trien khai mot ban HONG (thieu tep) ════
  a) script thoat ra 0?          → 0
  b) tien trinh dang chay?       → KHONG CO
  c) cong 3000 co ai nghe?       → KHONG
  d) tuyen THAT tra loi dung?    → 000
  ❌ DEPLOY HONG

════ C) ban ung dung KHOI DONG DUOC nhung moi request tra 500 ════
  a) script thoat ra 0?          → 0
  b) tien trinh dang chay?       → 710
  c) cong 3000 co ai nghe?       → CO
  d) tuyen THAT tra loi dung?    → 500
  ❌ DEPLOY HONG</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Check (a) — exit code</span><span class="v">Returned <code>0</code> on all three, including the deploy that shipped nothing runnable. It proves the commands ran. It is the check almost every hand-rolled deploy stops at.</span></div>
  <div class="kv"><span class="k">Check (b) and (c) — process, port</span><span class="v">Caught case B. Both <em>passed</em> case C — there is a process, the port is bound, everything looks alive.</span></div>
  <div class="kv"><span class="k">Check (d) — a real request</span><span class="v">The only one that caught all three. It is also the only one that costs a round trip.</span></div>
</div>
<p>Case C is the one worth staring at. The application started, bound its port and holds a healthy-looking PID. Three of the four checks say the deploy succeeded. What it actually returns is this:</p>
<div class="out">$ curl http://127.0.0.1:3000/health
     Loi cau hinh: thieu DATABASE_URL</div>
<div class="callout warn"><strong>A missing environment variable is the most common shape of case C.</strong> The code is fine, the artifact is fine, the transport worked, the swap worked. One value that lives on the server rather than in the repository was not set, and every request fails — while the process list, the port table and the exit code all report health. Chapter 4 is entirely about where that value should live so this cannot happen.</div>

<h3>What a health endpoint should and should not do</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">It must exercise the thing that breaks</span><span class="lz-d">A <code>/health</code> that returns a hardcoded <code>200</code> passes case C. If your application needs a database, the health check should touch the database — otherwise it is checking that Node can serve a string.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">It must not be expensive</span><span class="lz-d">A load balancer polls it every second forever. A <code>SELECT 1</code> is right; counting rows in a large table is a self-inflicted outage waiting for traffic.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Separate "alive" from "ready"</span><span class="lz-d">Two endpoints. <em>Alive</em> means the process is not wedged — restart me if this fails. <em>Ready</em> means it can serve traffic — send me requests only if this passes. During the three-second startup measured in Lesson 0.1, an application is alive but not ready, and conflating them is what makes a restart loop.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">It must not require authentication</span><span class="lz-d">Or the check cannot run. Keep it free of anything sensitive: no version numbers, no dependency names, no connection strings in the error text. The 500 above is fine for a private port and too talkative for a public one.</span></div>
</div>

<h3>Now count what the hand deploy did not do</h3>
<p>The four commands work. Run them a few times and the gaps appear, and each one is a chapter of this course:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">There is no way back</span><span class="lz-lnote"><code>tar xzf</code> overwrote the old version in place. When check (d) says 500, there is nothing to return to — the previous release no longer exists on the machine. Chapter 6.</span></div>
  <div class="lz-layer"><span class="lz-lname">The outage is as long as the startup</span><span class="lz-lnote">The old process is killed before the new one is known to work. Lesson 0.1 measured 3,070 ms for a realistic application. Chapter 3.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nothing stops a half-failed deploy</span><span class="lz-lnote">If <code>tar</code> fails, the <code>pkill</code> still runs. A shell script without <code>set -euo pipefail</code> marches straight past errors into the next destructive step. Chapter 7.</span></div>
  <div class="lz-layer"><span class="lz-lname">The database is not in the picture</span><span class="lz-lnote">Code changed; the schema did not. The ordering of those two is where the worst deploy outages come from, including one in this repository. Chapter 5.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nothing survives a reboot</span><span class="lz-lnote"><code>nohup</code> keeps the process alive when the session ends, not when the machine restarts. Chapter 3 replaces it with a service manager.</span></div>
</div>
<div class="callout ok"><strong>The hand deploy is still worth doing first.</strong> Every line of the deploy script you eventually write exists to close one of these gaps, and reading it will make sense only if you have felt the gap. It is also the fallback when the automation itself is what broke.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-archive(1)</span><span class="lc-sub">git-scm.com/docs/git-archive — producing a tarball of exactly one commit, which is the simplest possible artifact.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kubernetes — liveness, readiness and startup probes</span><span class="lc-sub">kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes — the clearest write-up of the alive/ready distinction, and it applies just as well to a single VPS.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">curl — the -w write-out variables</span><span class="lc-sub">everything.curl.dev/usingcurl/verbose/writeout — <code>%{http_code}</code> and friends, which is what turns curl into a deploy gate rather than a debugging tool.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — diagnosing a 502 that is not the backend</span><span class="lc-sub">/courses/nginx/learn${REF} — when a deploy looks healthy from the server but not from the proxy in front of it.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Lần deploy đầu tiên, làm bằng tay</h2>
<p class="lead">Trước khi tự động hoá bất cứ thứ gì, hãy làm nó một lần bằng tay và nhìn từng bước. Cái script bạn viết sau đó chỉ đáng có nếu bạn đã biết trước nó PHẢI kiểm cái gì — và phép đo dưới đây cho thấy chính những phép kiểm hiển nhiên nhất mới là những cái không hoạt động.</p>

<h3>Bốn bước, viết thành lệnh</h3>
<pre><code><span class="tok-comment"># BUOC 1 — tao tac: chi lay thu DA COMMIT (bai 0.1)</span>
git archive --format=tar HEAD | gzip &gt; /tmp/ban-phat-hanh.tar.gz

<span class="tok-comment"># BUOC 2 — van chuyen</span>
scp /tmp/ban-phat-hanh.tar.gz vps:/srv/vps/phat-hanh/

<span class="tok-comment"># BUOC 3 — trao</span>
ssh vps 'cd /srv/vps/app &amp;&amp; tar xzf ../phat-hanh/ban-phat-hanh.tar.gz &amp;&amp; \\
         pkill -f "node src/server.js"; sleep 0.3; \\
         setsid nohup node src/server.js &gt;/srv/vps/app.log 2&gt;&amp;1 &lt;/dev/null &amp;'

<span class="tok-comment"># BUOC 4 — kiem</span>
ssh vps 'curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/health'</code></pre>
<div class="pitfall"><strong>Bẫy — một lệnh chạy từ xa mà để hở một luồng thì làm <code>ssh</code> TREO mãi mãi.</strong> Viết dòng bước 3 mà thiếu <code>&lt;/dev/null</code> chính là phiên bản kinh điển của lỗi này: tiến trình nền thừa hưởng stdin của SSH, SSH ngồi chờ kênh đóng lại, và script deploy nằm im ở đó cho tới khi có thứ gì giết nó. Nó TRÔNG như một máy chủ chậm. Thật ra nó là một cái file descriptor. Hãy chuyển hướng cả ba luồng — <code>&gt;log 2&gt;&amp;1 &lt;/dev/null</code> — và dùng <code>setsid</code> để tiến trình sống sót khi phiên kết thúc.</div>
<p><code>git archive</code> đáng để biết: nó viết ra một tệp nén của ĐÚNG một commit, không kèm thư mục <code>.git</code> và không kèm thay đổi trong cây làm việc. Nó là câu trả lời trung thực nhỏ gọn nhất cho câu "chúng ta đang gửi những byte nào" — một tạo tác, trong một lệnh, không dính tới hệ thống build nào.</p>

<h3>Bước 4, đo trên ba lần deploy</h3>
<p>Cùng một script deploy, bên trong có bốn mức kiểm, chạy ba lần: một lần trên bản dựng tốt, một lần trên bản dựng mà tệp khởi động không tồn tại, và một lần trên bản dựng KHỞI ĐỘNG hoàn hảo mà vẫn hỏng.</p>
<div class="out">════ A) trien khai mot ban TOT ════
  a) script thoat ra 0?          → 0
  b) tien trinh dang chay?       → 32689
  c) cong 3000 co ai nghe?       → CO
  d) tuyen THAT tra loi dung?    → 200
  ✅ DEPLOY THANH CONG

════ B) trien khai mot ban HONG (thieu tep) ════
  a) script thoat ra 0?          → 0
  b) tien trinh dang chay?       → KHONG CO
  c) cong 3000 co ai nghe?       → KHONG
  d) tuyen THAT tra loi dung?    → 000
  ❌ DEPLOY HONG

════ C) ban ung dung KHOI DONG DUOC nhung moi request tra 500 ════
  a) script thoat ra 0?          → 0
  b) tien trinh dang chay?       → 710
  c) cong 3000 co ai nghe?       → CO
  d) tuyen THAT tra loi dung?    → 500
  ❌ DEPLOY HONG</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Kiểm (a) — mã thoát</span><span class="v">Trả về <code>0</code> ở cả BA lần, kể cả lần deploy chẳng gửi được thứ gì chạy được. Nó chứng minh các lệnh đã chạy. Và nó là phép kiểm mà gần như mọi script deploy tự chế dừng lại ở đó.</span></div>
  <div class="kv"><span class="k">Kiểm (b) và (c) — tiến trình, cổng</span><span class="v">Bắt được ca B. Cả hai đều <em>QUA</em> ở ca C — có tiến trình, cổng đã gắn, mọi thứ trông như đang sống.</span></div>
  <div class="kv"><span class="k">Kiểm (d) — một request THẬT</span><span class="v">Cái duy nhất bắt được cả ba. Nó cũng là cái duy nhất tốn một vòng đi-về.</span></div>
</div>
<p>Ca C mới là cái đáng nhìn chằm chằm. Ứng dụng đã khởi động, đã gắn cổng và đang giữ một PID trông rất khoẻ mạnh. Ba trong bốn phép kiểm nói rằng lần deploy thành công. Còn thứ nó thật sự trả về là thế này:</p>
<div class="out">$ curl http://127.0.0.1:3000/health
     Loi cau hinh: thieu DATABASE_URL</div>
<div class="callout warn"><strong>Một biến môi trường bị thiếu là hình dạng phổ biến nhất của ca C.</strong> Mã thì ổn, tạo tác thì ổn, vận chuyển chạy tốt, tráo cũng chạy tốt. Một giá trị vốn sống trên MÁY CHỦ chứ không sống trong kho mã đã không được đặt, và mọi request đều hỏng — trong khi danh sách tiến trình, bảng cổng và mã thoát đều báo khoẻ mạnh. Chương 4 dành trọn cho chuyện cái giá trị đó nên sống ở đâu để điều này không thể xảy ra.</div>

<h3>Một endpoint health nên và KHÔNG nên làm gì</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nó phải ĐỘNG tới đúng cái thứ hay hỏng</span><span class="lz-d">Một <code>/health</code> trả về <code>200</code> cứng thì QUA được ca C. Nếu ứng dụng của bạn cần cơ sở dữ liệu, phép kiểm sức khoẻ nên chạm vào cơ sở dữ liệu — không thì nó chỉ đang kiểm rằng Node phục vụ được một chuỗi ký tự.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nó không được đắt</span><span class="lz-d">Một bộ cân bằng tải hỏi nó mỗi giây, mãi mãi. Một câu <code>SELECT 1</code> là đúng; đếm số dòng trong một bảng lớn là một sự cố tự gây ra đang nằm chờ lưu lượng.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Tách "còn sống" khỏi "sẵn sàng"</span><span class="lz-d">Hai endpoint. <em>Còn sống</em> nghĩa là tiến trình chưa kẹt cứng — hỏng cái này thì hãy khởi động lại tôi. <em>Sẵn sàng</em> nghĩa là nó phục vụ được lưu lượng — chỉ gửi request cho tôi khi cái này qua. Trong ba giây khởi động đo ở Bài 0.1, một ứng dụng đang CÒN SỐNG mà CHƯA SẴN SÀNG, và trộn hai thứ đó vào nhau chính là thứ tạo ra một vòng lặp khởi động lại.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nó không được đòi đăng nhập</span><span class="lz-d">Không thì phép kiểm chạy không nổi. Hãy giữ nó sạch mọi thứ nhạy cảm: không số phiên bản, không tên thư viện, không chuỗi kết nối trong chữ báo lỗi. Cú 500 ở trên thì ổn cho một cổng nội bộ và quá nhiều lời cho một cổng công khai.</span></div>
</div>

<h3>Giờ hãy đếm những gì lần deploy bằng tay KHÔNG làm</h3>
<p>Bốn lệnh đó chạy được. Chạy vài lần thì mấy lỗ hổng hiện ra, và mỗi cái là một chương của khoá này:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Không có đường lùi</span><span class="lz-lnote"><code>tar xzf</code> ghi đè bản cũ ngay tại chỗ. Khi phép kiểm (d) báo 500 thì chẳng còn gì để quay về — bản phát hành trước đó không còn tồn tại trên máy nữa. Chương 6.</span></div>
  <div class="lz-layer"><span class="lz-lname">Gián đoạn dài đúng bằng thời gian khởi động</span><span class="lz-lnote">Tiến trình cũ bị giết TRƯỚC KHI biết cái mới có chạy được không. Bài 0.1 đo được 3.070 ms với một ứng dụng thực tế. Chương 3.</span></div>
  <div class="lz-layer"><span class="lz-lname">Không có gì chặn một lần deploy hỏng NỬA CHỪNG</span><span class="lz-lnote">Nếu <code>tar</code> hỏng thì lệnh <code>pkill</code> vẫn cứ chạy. Một script shell thiếu <code>set -euo pipefail</code> sẽ đi thẳng qua lỗi để bước vào bước phá huỷ kế tiếp. Chương 7.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cơ sở dữ liệu không có mặt trong bức tranh</span><span class="lz-lnote">Mã đổi; lược đồ thì không. Thứ tự giữa hai thứ đó chính là nơi sinh ra những sự cố deploy tệ nhất, trong đó có một sự cố của chính kho mã này. Chương 5.</span></div>
  <div class="lz-layer"><span class="lz-lname">Không thứ gì sống sót qua một lần khởi động lại máy</span><span class="lz-lnote"><code>nohup</code> giữ tiến trình sống khi PHIÊN kết thúc, chứ không phải khi MÁY khởi động lại. Chương 3 thay nó bằng một trình quản lý dịch vụ.</span></div>
</div>
<div class="callout ok"><strong>Lần deploy bằng tay vẫn đáng làm trước tiên.</strong> Mọi dòng trong cái script deploy mà rốt cuộc bạn sẽ viết đều tồn tại để bịt một trong những lỗ hổng này, và đọc nó chỉ có nghĩa nếu bạn đã CẢM được cái lỗ hổng ấy. Nó cũng là đường lùi cho đúng cái tình huống mà chính phần tự động hoá mới là thứ bị hỏng.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-archive(1)</span><span class="lc-sub">git-scm.com/docs/git-archive — tạo một tệp nén của đúng một commit, tức là cái tạo tác đơn giản nhất có thể có.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kubernetes — liveness, readiness và startup probe</span><span class="lc-sub">kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes — bài viết rõ nhất về phân biệt còn-sống/sẵn-sàng, và nó áp dụng y hệt cho một con VPS đơn lẻ.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">curl — các biến của -w (write-out)</span><span class="lc-sub">everything.curl.dev/usingcurl/verbose/writeout — <code>%{http_code}</code> và các anh em, thứ biến curl từ một công cụ gỡ lỗi thành một cái CỔNG cho deploy.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — chẩn đoán cú 502 không phải lỗi của backend</span><span class="lc-sub">/courses/nginx/learn${REF} — khi một lần deploy trông khoẻ mạnh từ phía máy chủ mà không khoẻ từ phía proxy đứng trước nó.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — What you have not solved yet|||0.4 — Những gì bạn CHƯA giải quyết',
      slug: 'deploy-0-4-chua-giai-quyet',
      type: 'LESSON',
      description: 'Bản đồ của cả khoá, neo vào một phép đo: cùng một cú lùi bản, làm theo hai cách, trên hai cỡ dự án. Một cách mất 5 mili giây bất kể dự án to cỡ nào; cách kia mất 590 mili giây và còn tăng tiếp.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>What you have not solved yet</h2>
<p class="lead">The four commands in Lesson 0.3 are a working deploy. They are also a deploy with no way back, an outage as long as your startup time, no protection against half-failing, and nothing that survives a reboot. This lesson measures the first of those, because the measurement explains the shape of everything that follows.</p>

<h3>One decision changes the cost of every rollback</h3>
<p>The hand deploy extracted the new version <em>over</em> the old one. There is an alternative: give every release its own directory and point a symlink at the live one. Rolling back is then moving the symlink. Both approaches measured, on two project sizes:</p>
<div class="out">═══ du an nho: 42 tep, 176 KB ═══
  doi symlink:      6.330 micro giay  (6,3 ms)
  giai nen lai:    13.372 micro giay  (13,4 ms)

═══ du an that: 12.000 tep, 48 MB (nen con 11 MB) ═══
  doi symlink:      4.796 micro giay  (4,8 ms)
  giai nen lai:       590 mili giay</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The symlink swap does not grow</span><span class="v">6.3 ms on a 176 KB project, 4.8 ms on a 48 MB one — the difference is noise. Moving a symlink is one filesystem operation whatever it points at.</span></div>
  <div class="kv"><span class="k">Extraction grows with the project</span><span class="v">13 ms became 590 ms: forty-five times slower, because there were 12,000 files to write instead of 42. A real application with <code>node_modules</code> is larger still.</span></div>
  <div class="kv"><span class="k">123× at a realistic size</span><span class="v">And the gap keeps widening. The interesting part is that one number is a constant and the other is a function of your codebase.</span></div>
  <div class="kv"><span class="k">The speed is not even the main point</span><span class="v">See below — the structural difference matters more than the milliseconds.</span></div>
</div>
<div class="callout ok"><strong>The releases layout, in three lines.</strong> Every release lands in its own directory; a symlink names the current one; rolling back moves the symlink. Nothing is ever overwritten, so the previous version is still sitting on disk, complete, when you need it at two in the morning.</div>
<pre><code>/srv/app/
├── phat-hanh/
│   ├── 2026-08-23-1930-a3f1c9/     <span class="tok-comment"># moi ban phat hanh mot thu muc</span>
│   ├── 2026-08-23-2114-b8e402/
│   └── 2026-08-24-0902-c1d773/
├── hien-tai -> phat-hanh/2026-08-24-0902-c1d773
└── chung/                          <span class="tok-comment"># thu KHONG thuoc ban phat hanh nao</span>
    ├── .env                        <span class="tok-comment">#   → Chuong 4</span>
    ├── tai-len/
    └── log/</code></pre>
<div class="pitfall"><strong>Bẫy — <code>ln -sfn</code> alone is not atomic.</strong> Replacing an existing symlink is internally an unlink followed by a create, and for a moment the path does not exist. A request arriving in that window sees nothing. The atomic form creates the new link under a temporary name and renames it over the old one — <code>ln -sfn &lt;dich&gt; hien-tai.moi &amp;&amp; mv -T hien-tai.moi hien-tai</code> — because <code>rename(2)</code> is atomic and <code>mv -T</code> uses it. That is the form measured above, and the two extra words are the difference between a rollback and a brief outage during a rollback.</div>
<p>The structural difference matters more than the timing. Rolling back by re-extracting needs the old artifact to still exist somewhere — the tarball, the git tag, the registry image, the network to fetch it. Rolling back by symlink needs nothing but a directory that is already on the disk. The moment you most need to roll back is often the moment something else is also broken, and a rollback that depends on the network is a rollback you may not get.</p>

<h3>The rest of the course, and what each chapter closes</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1–2</span><span class="lz-t">The artifact, and getting it there</span><span class="lz-d">What exactly ships, and the three transports compared properly — rsync, git, and a container registry — including what changes when the artifact has to be <em>built</em> rather than copied, and where that build should happen.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The swap, without the outage</span><span class="lz-d">The releases layout above, a service manager instead of <code>nohup</code>, and starting the new version <em>before</em> stopping the old one — which is what makes the 3,070 ms measured in Lesson 0.1 go to zero.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Configuration and secrets</span><span class="lz-d">Where the missing <code>DATABASE_URL</code> from Lesson 0.3 should live so that a deploy cannot lose it, why build-time and run-time values are different things, and what makes a secret in a git history unrecoverable.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">The database</span><span class="lz-d">The chapter with the worst outages in it. Schema changes and code changes deploy at different moments, and the window between them is where a site breaks. Includes the failed-migration state this repository has actually been in.</span></div>
  <div class="lz-step"><span class="lz-k">6</span><span class="lz-t">Rollback, and what cannot be rolled back</span><span class="lz-d">The symlink is the easy half. Data written by the bad version, a migration that dropped a column, an email already sent — none of those come back. Knowing which changes are one-way is what makes a deploy safe to attempt.</span></div>
  <div class="lz-step"><span class="lz-k">7</span><span class="lz-t">The deploy script itself</span><span class="lz-d">Failing loudly instead of continuing, running twice without harm, refusing to run against a dirty tree, and a smoke test whose failure actually stops the deploy.</span></div>
  <div class="lz-step"><span class="lz-k">8</span><span class="lz-t">Living on a small machine</span><span class="lz-d">Memory, swap, the OOM killer and the build cache. This repository has filled the disk that Postgres was sitting on and had a build killed with exit 137; both are measured here.</span></div>
  <div class="lz-step"><span class="lz-k">9–10</span><span class="lz-t">Watching it, and getting it back</span><span class="lz-d">The handful of things worth alerting on, and backups — specifically the difference between having backups and having restored one, measured with a stopwatch.</span></div>
  <div class="lz-step"><span class="lz-k">11</span><span class="lz-t">Diagnosis</span><span class="lz-d">A procedure for the deploy that just failed, and a final exam over everything.</span></div>
</div>

<h3>A note on what this course is not</h3>
<p>It is not about Kubernetes, or a platform-as-a-service, or any system that hides the four steps from you. Those are reasonable choices and they solve real problems; they also make it impossible to see what is happening, which is exactly the thing worth learning first. Everything here runs on one machine you can SSH into, and every mechanism is one you could implement in a shell script — because at the bottom, that is what the large systems are doing too.</p>
<div class="note-ct">If you already run Docker, almost nothing changes conceptually. The artifact becomes an image instead of a directory, the transport becomes <code>docker pull</code> instead of <code>rsync</code>, and the swap becomes <code>docker compose up -d</code> instead of a symlink. The four steps are the same, the failure modes are the same, and Chapter 2 measures the container path alongside the others rather than treating it as a different subject.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">rename(2) — why mv -T is atomic and ln -sfn is not</span><span class="lc-sub">man7.org/linux/man-pages/man2/rename.2.html — the guarantee the releases layout depends on, stated in one paragraph.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Capistrano — the releases/current layout</span><span class="lc-sub">capistranorb.com/documentation/getting-started/structure — the tool that popularised this directory structure; the layout is worth stealing even if the tool is not.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App</span><span class="lc-sub">12factor.net — twelve short pages. Factors III (Config), V (Build/release/run) and XI (Logs) are the ones this course keeps returning to.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — images, and what a swap means when the artifact is an image</span><span class="lc-sub">/courses/docker/learn${REF} — the container version of the releases layout, where the image tag plays the part of the symlink.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Những gì bạn CHƯA giải quyết</h2>
<p class="lead">Bốn lệnh ở Bài 0.3 là một lần deploy CHẠY ĐƯỢC. Chúng cũng là một lần deploy không có đường lùi, gián đoạn dài đúng bằng thời gian khởi động, không có gì bảo vệ khi hỏng nửa chừng, và chẳng thứ gì sống sót qua một lần khởi động lại máy. Bài này đo cái đầu tiên trong số đó, vì chính phép đo ấy giải thích hình dạng của mọi thứ theo sau.</p>

<h3>Một quyết định làm thay đổi cái giá của MỌI lần lùi bản</h3>
<p>Lần deploy bằng tay đã giải nén bản mới ĐÈ LÊN bản cũ. Có một cách khác: cho mỗi bản phát hành một thư mục riêng, rồi trỏ một symlink vào cái đang sống. Lùi bản khi đó là DI CHUYỂN cái symlink. Đo cả hai cách, trên hai cỡ dự án:</p>
<div class="out">═══ du an nho: 42 tep, 176 KB ═══
  doi symlink:      6.330 micro giay  (6,3 ms)
  giai nen lai:    13.372 micro giay  (13,4 ms)

═══ du an that: 12.000 tep, 48 MB (nen con 11 MB) ═══
  doi symlink:      4.796 micro giay  (4,8 ms)
  giai nen lai:       590 mili giay</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Đổi symlink thì KHÔNG tăng</span><span class="v">6,3 ms trên dự án 176 KB, 4,8 ms trên dự án 48 MB — chênh lệch chỉ là nhiễu. Di chuyển một symlink là MỘT thao tác hệ tệp, bất kể nó trỏ vào cái gì.</span></div>
  <div class="kv"><span class="k">Giải nén thì tăng theo dự án</span><span class="v">13 ms thành 590 ms: chậm hơn bốn mươi lăm lần, vì có 12.000 tệp phải ghi thay vì 42. Một ứng dụng thật có <code>node_modules</code> còn lớn hơn nữa.</span></div>
  <div class="kv"><span class="k">Gấp 123 lần ở cỡ thực tế</span><span class="v">Và khoảng cách còn tiếp tục doãng ra. Điểm thú vị là một con số là HẰNG SỐ còn con số kia là một HÀM của kho mã bạn.</span></div>
  <div class="kv"><span class="k">Tốc độ thậm chí còn chưa phải điểm chính</span><span class="v">Xem bên dưới — khác biệt về CẤU TRÚC quan trọng hơn mấy phần nghìn giây.</span></div>
</div>
<div class="callout ok"><strong>Bố cục "releases", gói trong ba dòng.</strong> Mỗi bản phát hành rơi vào thư mục riêng của nó; một symlink gọi tên cái đang hiện hành; lùi bản là di chuyển cái symlink. Không có gì bị ghi đè, nên bản trước đó vẫn còn nằm nguyên vẹn trên đĩa vào cái lúc bạn cần nó lúc hai giờ sáng.</div>
<pre><code>/srv/app/
├── phat-hanh/
│   ├── 2026-08-23-1930-a3f1c9/     <span class="tok-comment"># moi ban phat hanh mot thu muc</span>
│   ├── 2026-08-23-2114-b8e402/
│   └── 2026-08-24-0902-c1d773/
├── hien-tai -> phat-hanh/2026-08-24-0902-c1d773
└── chung/                          <span class="tok-comment"># thu KHONG thuoc ban phat hanh nao</span>
    ├── .env                        <span class="tok-comment">#   → Chuong 4</span>
    ├── tai-len/
    └── log/</code></pre>
<div class="pitfall"><strong>Bẫy — riêng <code>ln -sfn</code> thì KHÔNG nguyên tử.</strong> Thay một symlink đang tồn tại thực chất là gỡ liên kết rồi tạo lại, và trong một khoảnh khắc thì đường dẫn đó KHÔNG tồn tại. Một request rơi vào đúng cửa sổ ấy sẽ chẳng thấy gì. Dạng nguyên tử là tạo liên kết mới dưới một cái tên tạm rồi đổi tên nó đè lên cái cũ — <code>ln -sfn &lt;dich&gt; hien-tai.moi &amp;&amp; mv -T hien-tai.moi hien-tai</code> — vì <code>rename(2)</code> là nguyên tử và <code>mv -T</code> dùng đúng nó. Đó chính là dạng đã đo ở trên, và hai chữ thêm vào đó là khác biệt giữa MỘT CÚ LÙI BẢN và MỘT CÚ GIÁN ĐOẠN trong lúc lùi bản.</div>
<p>Khác biệt về cấu trúc còn quan trọng hơn con số thời gian. Lùi bản bằng cách giải nén lại thì CẦN cái tạo tác cũ vẫn còn tồn tại ở đâu đó — tệp nén, cái tag git, ảnh trong registry, và mạng để tải nó về. Lùi bản bằng symlink thì chẳng cần gì ngoài một thư mục ĐÃ NẰM SẴN trên đĩa. Cái lúc bạn cần lùi bản nhất thường cũng là cái lúc có thứ khác đang hỏng, và một cú lùi bản phụ thuộc vào mạng là một cú lùi bản bạn có thể sẽ không có được.</p>

<h3>Phần còn lại của khoá, và mỗi chương bịt lỗ hổng nào</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1–2</span><span class="lz-t">Cái tạo tác, và đưa nó lên máy</span><span class="lz-d">Chính xác thứ gì được gửi đi, và ba đường vận chuyển so sánh cho đầy đủ — rsync, git, và một registry container — kể cả chuyện gì thay đổi khi tạo tác phải được <em>DỰNG</em> chứ không phải chép, và việc dựng đó nên xảy ra ở đâu.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Bước tráo, mà không có gián đoạn</span><span class="lz-d">Bố cục releases ở trên, một trình quản lý dịch vụ thay cho <code>nohup</code>, và khởi động bản mới <em>TRƯỚC KHI</em> dừng bản cũ — đó là thứ đưa con số 3.070 ms đo ở Bài 0.1 về không.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Cấu hình và bí mật</span><span class="lz-d">Cái <code>DATABASE_URL</code> bị thiếu ở Bài 0.3 nên sống ở đâu để một lần deploy không thể làm mất nó, vì sao giá trị lúc DỰNG và giá trị lúc CHẠY là hai thứ khác nhau, và điều gì làm một bí mật lỡ nằm trong lịch sử git thành không thu hồi được.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Cơ sở dữ liệu</span><span class="lz-d">Chương chứa những sự cố tệ nhất. Thay đổi lược đồ và thay đổi mã được deploy ở hai thời điểm khác nhau, và cái cửa sổ giữa hai thời điểm ấy là nơi website vỡ. Có kèm cả cái trạng thái migration hỏng mà chính kho mã này đã từng rơi vào.</span></div>
  <div class="lz-step"><span class="lz-k">6</span><span class="lz-t">Lùi bản, và những gì KHÔNG lùi được</span><span class="lz-d">Cái symlink mới là nửa dễ. Dữ liệu do bản hỏng ghi ra, một migration đã xoá mất một cột, một email đã gửi đi — chẳng cái nào quay lại được. Biết thay đổi nào là MỘT CHIỀU chính là thứ làm cho một lần deploy an toàn để thử.</span></div>
  <div class="lz-step"><span class="lz-k">7</span><span class="lz-t">Chính cái script deploy</span><span class="lz-d">Hỏng thì phải la lên chứ không đi tiếp, chạy hai lần không gây hại, từ chối chạy khi cây làm việc còn bẩn, và một smoke test mà việc nó hỏng THẬT SỰ dừng được lần deploy.</span></div>
  <div class="lz-step"><span class="lz-k">8</span><span class="lz-t">Sống trên một cái máy nhỏ</span><span class="lz-d">Bộ nhớ, swap, kẻ giết OOM và cache dựng. Chính kho mã này đã từng làm đầy cái đĩa mà Postgres đang ngồi trên đó, và từng bị một lần dựng giết chết với mã thoát 137; cả hai đều được đo lại ở đây.</span></div>
  <div class="lz-step"><span class="lz-k">9–10</span><span class="lz-t">Trông chừng nó, và lấy lại nó</span><span class="lz-d">Một nhúm thứ đáng đặt cảnh báo, và sao lưu — cụ thể là khác biệt giữa CÓ bản sao lưu và ĐÃ TỪNG phục hồi một bản, đo bằng đồng hồ bấm giây.</span></div>
  <div class="lz-step"><span class="lz-k">11</span><span class="lz-t">Chẩn đoán</span><span class="lz-d">Một quy trình cho cái lần deploy vừa mới hỏng, cộng một bài thi cuối khoá trên toàn bộ nội dung.</span></div>
</div>

<h3>Một ghi chú về việc khoá này KHÔNG phải cái gì</h3>
<p>Nó không nói về Kubernetes, hay một nền tảng dạng dịch vụ, hay bất kỳ hệ thống nào GIẤU bốn bước đó khỏi bạn. Đó đều là những lựa chọn hợp lý và chúng giải quyết vấn đề có thật; chúng cũng làm bạn không thể nhìn thấy chuyện gì đang diễn ra, mà đó lại đúng là thứ đáng học TRƯỚC TIÊN. Mọi thứ ở đây chạy trên MỘT cái máy mà bạn SSH vào được, và mọi cơ chế đều là thứ bạn tự cài đặt được bằng một script shell — vì ở tầng đáy, mấy hệ thống lớn cũng đang làm đúng như vậy.</p>
<div class="note-ct">Nếu bạn đã dùng Docker thì gần như không có gì thay đổi về mặt khái niệm. Tạo tác trở thành một cái ảnh thay vì một thư mục, vận chuyển trở thành <code>docker pull</code> thay vì <code>rsync</code>, và bước tráo trở thành <code>docker compose up -d</code> thay vì một cái symlink. Bốn bước vẫn thế, các kiểu hỏng vẫn thế, và Chương 2 đo đường container SONG SONG với các đường khác chứ không coi nó là một môn học riêng.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">rename(2) — vì sao mv -T nguyên tử còn ln -sfn thì không</span><span class="lc-sub">man7.org/linux/man-pages/man2/rename.2.html — cái bảo đảm mà bố cục releases dựa vào, phát biểu gọn trong một đoạn.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Capistrano — bố cục releases/current</span><span class="lc-sub">capistranorb.com/documentation/getting-started/structure — công cụ đã làm cho cấu trúc thư mục này phổ biến; cái bố cục đáng lấy về dùng kể cả khi bạn không dùng công cụ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App</span><span class="lc-sub">12factor.net — mười hai trang ngắn. Các yếu tố III (Config), V (Build/release/run) và XI (Logs) là mấy cái khoá này quay lại nhiều nhất.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — ảnh, và bước tráo có nghĩa gì khi tạo tác là một cái ảnh</span><span class="lc-sub">/courses/docker/learn${REF} — phiên bản container của bố cục releases, nơi cái tag ảnh đóng vai của cái symlink.</span></span></div>
</div>
`,
    },
  ],
};
