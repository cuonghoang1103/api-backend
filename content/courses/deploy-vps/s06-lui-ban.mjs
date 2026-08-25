const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';
/**
 * Deploy VPS — Chương 6: Lùi bản, và thứ KHÔNG lùi được.
 * Mọi số đo trong chương này là ĐO THẬT trong hộp cát: symlink + Node trên
 * /srv/vps/lui, PostgreSQL 16.13 ở /tmp/pgdata cổng 5433, nginx 1.24.0 làm
 * bộ đệm phía trước ở 127.0.0.1:3320, và một "máy chủ mail" giả ở 3310 ghi
 * lại mọi thứ nó nhận được.
 */

export default {
  title: 'Chapter 6 — Rollback, and what cannot be rolled back|||Chương 6 — Lùi bản, và thứ không lùi được',
  slug: 'deploy-ch6-lui-ban',
  description: 'Đổi symlink mất 5 mili giây và lùi trọn vẹn mất 140. Đó là nửa DỄ. Nửa còn lại: một lược đồ đã đi tiếp, 240 dòng dữ liệu hỏng đã ghi, 90 lá thư đã gửi, và một bộ đệm vẫn phục vụ bản hỏng thêm năm phút sau khi bạn tưởng đã lùi xong.',
  sortOrder: 7,
  lessons: [

    /* ─────────────────────────── 6.1 ─────────────────────────── */
    {
      title: '6.1 — The rollback that works|||6.1 — Cú lùi CHẠY ĐƯỢC',
      slug: 'deploy-6-1-lui-chay-duoc',
      type: 'VIDEO',
      description: 'Đổi symlink: 5,2 ms. Lùi trọn vẹn kể cả khởi động lại và chờ ứng dụng trả lời: 140 ms. Dựng lại từ nguồn cho đúng commit đó: 1.994 ms — trên một dự án ĐỒ CHƠI. Đây là bài đo vì sao bạn giữ tạo tác cũ thay vì dựng lại chúng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>The rollback that works</h2>
<p class="lead">A rollback is not a deploy run backwards. It is the one deploy you already know works, put back — and the whole reason it is fast is that you kept the artifact instead of the instructions for building it.</p>

<div class="callout">
<p><strong>Where this chapter sits.</strong> Chapter 3 built a swap that drops no requests, and its script rolls back automatically when the front-door check fails <em>during</em> the deploy. Chapter 5 built migrations that let two versions coexist. This chapter is about the failure those two do not cover: the deploy finished cleanly, every check passed, and twenty minutes later somebody notices the numbers are wrong. Nothing is going to roll back for you. You have to do it, and half of what the bad version did is not coming back.</p>
</div>

<h3>Why a rollback can be milliseconds</h3>
<p>Chapter 1 argued for building an artifact once and moving it around unchanged. This lesson is where that argument gets paid off. If a release is a directory on disk and <code>hien-tai</code> is a symlink pointing at one of them, then "roll back" means "point the symlink somewhere else". That is a single filesystem operation.</p>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">layout</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">ban/v1/</div><div class="lz-nsub">a release, complete, unpacked</div></div></div>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">ban/v2/</div><div class="lz-nsub">a release, complete, unpacked</div></div></div>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">ban/v3/</div><div class="lz-nsub">a release, complete, unpacked</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">pointer</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">hien-tai →</div><div class="lz-nsub">one symlink; this is the only thing a deploy or a rollback changes</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">process</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">node hien-tai/app.mjs</div><div class="lz-nsub">restarted after the pointer moves; reads whatever the link resolves to</div></div></div>
</div>
</div>

<p>Measured on the sandbox, five consecutive flips of that pointer:</p>

<pre><code># doi symlink NGUYEN TU: tao link moi roi mv -Tf de len link cu
<span class="tok-comment"># mv -Tf tren cung mot he tep la mot lenh rename(2) — khong co khoanh khac nao khong co link</span>
ln -sfn /srv/vps/lui/ban/v1 /srv/vps/lui/ht.moi
mv -Tf /srv/vps/lui/ht.moi /srv/vps/lui/hien-tai</code></pre>

<div class="out">doi symlink: 5718 us
doi symlink: 5227 us
doi symlink: 5726 us
doi symlink: 5351 us
doi symlink: 5150 us</div>

<p>Between 5.1 and 5.7 milliseconds, and most of that is the shell, not the kernel. But nobody rolls back by moving a pointer alone — the process has to be restarted so it picks up the new code. Here is the whole thing, timed in three parts:</p>

<pre><code>T0=\$(date +%s%N)
ln -sfn "\$GOC/ban/\$DICH" "\$GOC/ht.moi" &amp;&amp; mv -Tf "\$GOC/ht.moi" "\$GOC/hien-tai"
T1=\$(date +%s%N)
<span class="tok-comment"># giet ban dang chay theo CONG dang nghe, khong dung pkill -f</span>
for p in \$(ss -ltnp 2>/dev/null|grep ":3300 "|grep -o 'pid=[0-9]*'|cut -d= -f2); do kill -TERM "\$p"; done
CONG=3300 setsid nohup node "\$GOC/hien-tai/app.mjs" >/tmp/lui-app.log 2>&amp;1 &lt;/dev/null &amp;
T2=\$(date +%s%N)
<span class="tok-comment"># cho toi khi no THAT SU tra loi, khong phai toi khi tien trinh ton tai</span>
for i in \$(seq 1 200); do
  [ "\$(curl -s -o /dev/null -w '%{http_code}' --max-time 1 http://127.0.0.1:3300/health)" = "200" ] &amp;&amp; break
  sleep 0.02
done
T3=\$(date +%s%N)</code></pre>

<div class="out">=== LUI VE v2 ===
  symlink   : 4 ms
  khoi dong : 8 ms
  cho san sang: 129 ms
  TONG      : 142 ms   → dang phuc vu: v2
=== LUI VE v1 ===
  symlink   : 4 ms
  khoi dong : 7 ms
  cho san sang: 128 ms
  TONG      : 140 ms   → dang phuc vu: v1
=== TIEN LEN v3 ===
  symlink   : 4 ms
  khoi dong : 8 ms
  cho san sang: 128 ms
  TONG      : 141 ms   → dang phuc vu: v3</div>

<p>140 milliseconds, and 128 of them are Node starting up. The pointer move and the process spawn together are 12 ms. Notice the third block: rolling <em>forward</em> costs exactly the same as rolling back, because in this model there is no difference between them — both are "point at a different directory that already exists".</p>

<h3>The alternative, measured</h3>
<p>The other way to get back to a previous version is to rebuild it: check out the old commit and run the pipeline again. People reach for this because it needs no special layout — you already have git. Here is what it costs, on a project deliberately kept small (83 npm packages, 61 TypeScript files):</p>

<pre><code>T0=\$(date +%s%N)
git clone -q /tmp/kho-lui.git /tmp/lui-build
T1=\$(date +%s%N)
cd /tmp/lui-build &amp;&amp; npm ci --no-audit --no-fund
T2=\$(date +%s%N)
npx tsc
T3=\$(date +%s%N)</code></pre>

<div class="out">  git clone : 23 ms
  npm ci    : 900 ms
  tsc build : 1070 ms
  TONG      : 1994 ms</div>

<p>Two seconds against 140 milliseconds — fourteen times slower, and this is the most favourable comparison I could construct. The clone is a local bare repo over the filesystem, so 23 ms; over a network it is seconds. The npm cache was warm; cold it measured 1,090 ms instead of 612 ms for the same 83 packages:</p>

<div class="out">=== npm ci lan 1 (co cache) ===   667 ms
=== npm ci lan 2 ===              612 ms
=== npm ci lan 3, cache SACH ===  1090 ms</div>

<div class="pitfall">
<p><strong>Trap — a toy project is not the measurement you need.</strong> 83 packages is nothing. The repository this course is written in has <strong>897</strong> resolved packages in the backend lockfile and <strong>1,159</strong> in the frontend one, and the frontend build is <code>next build</code>, not <code>tsc</code>. My 1,994 ms is a <em>floor</em>, not an estimate — a real rebuild of a real app is minutes. The ratio to remember is not "14×", it is "milliseconds against minutes, while the site is broken".</p>
</div>

<h3>What you are actually paying for: disk</h3>
<p>Keeping old releases means keeping their dependencies. Measured on the same 83-package tree, with dev dependencies installed:</p>

<div class="out">node_modules cua MOT ban: 29M

  giu 5 ban  : ~145 MB
  giu 20 ban : ~580 MB
  giu 100 ban: ~2,8 GB</div>

<p>On the 6 GB VPS this course keeps referring to, twenty releases of a real app is a real fraction of the disk — and Chapter 8 will show what happens when that disk fills. The cheap fix is hard links: identical files share one copy on disk.</p>

<pre><code><span class="tok-comment"># cp -al = chep CAY THU MUC nhung file thi lam LIEN KET CUNG, khong nhan doi byte</span>
cp -al /tmp/hl/a /tmp/hl/b     <span class="tok-comment"># lien ket cung</span>
cp -r  /tmp/hl/a /tmp/hl/c     <span class="tok-comment"># chep that</span></code></pre>

<div class="out">  cp -al (hardlink): 15 ms
  cp -r  (chep that): 126 ms

25M	/tmp/hl/a
0	/tmp/hl/b      ← khong ton them byte nao
25M	/tmp/hl/c</div>

<p>Eight times faster and free on disk. The catch is that hard links only help when the files are byte-identical, which for <code>node_modules</code> across two releases with the same lockfile they usually are — and when they are not, <code>cp -al</code> simply makes a real copy of the differing file.</p>

<div class="callout ok">
<p><strong>The rule this lesson buys.</strong> Keep the last N releases on disk, unpacked, ready to be pointed at. Pick N by asking "how far back would I ever roll?" — for most teams that is 3 to 5, because a release older than a few days is almost certainly incompatible with the database anyway (6.2). Then measure what N costs you in disk, and hard-link if it hurts.</p>
</div>

<h3>The rollback that has nowhere to go</h3>
<p>A retention policy that is too aggressive turns "roll back" into "rebuild". Measured, with a policy of keeping three:</p>

<div class="out">  luat: giu 3 ban gan nhat → v0 bi don
  xoa: v0
KHONG co ban 'v0'. Co: v1 v2 v3
  ma thoat: 2</div>

<p>Exit code 2, and a message that lists what <em>is</em> available. That is the right behaviour for a rollback script: fail loudly with the options, rather than half-succeeding. But notice that the script cannot help you here — the decision that broke this was made days ago when somebody set the retention to three.</p>

<h3>The other axis a rollback does not move</h3>
<p>Chapter 4 established that configuration lives outside the artifact, in <code>/opt/cuonghoangdev/.env</code> on the VPS, and survives every deploy. That is exactly what you want almost all the time. It also means rolling the artifact back does <strong>not</strong> roll the config back:</p>

<div class="out">  .env HIEN TAI (do v2 dat):  KHOA_API=abc
  ma v1 (ban lui ve) doc:     API_KEY
  v1 doc API_KEY = undefined → NO ra khi khoi dong
→ lui tao tac KHONG lui .env. Cot env la mot truc THU HAI, lui rieng.</div>

<p>If the release you are rolling back <em>renamed</em> an environment variable and somebody tidied up the old name, the old code starts and immediately dies on a missing key. This is why Chapter 4 argued for adding the new name while keeping the old one working for a release or two — the same expand-and-contract shape as Chapter 5's column rename, applied to config.</p>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">rename(2) — atomic replacement</span><span class="lc-sub">man 2 rename: <em>"If newpath already exists, it will be atomically replaced"</em>. This one sentence is the guarantee <code>mv -Tf</code> relies on, and the reason the pointer move has no gap.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">symlink(7) — how the kernel resolves a soft link</span><span class="lc-sub">man 7 symlink — including why a process already running does not follow the link when the link changes, which is exactly why the restart in this lesson is not optional.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — V. Build, release, run</span><span class="lc-sub">12factor.net/build-release-run: <em>"releases are immutable... any change must create a new release"</em>. The directory layout measured here is a direct consequence.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">cp(1) — the --link flag</span><span class="lc-sub">gnu.org/software/coreutils/manual/html_node/cp-invocation.html — what <code>cp -al</code> does and when hard links are and are not safe.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Capistrano — directory structure</span><span class="lc-sub">capistranorb.com/documentation/getting-started/structure — the <code>releases/</code> plus <code>current</code> layout this lesson measures has been standard since 2006; worth reading for the conventions, not the Ruby.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — links, inodes and what du actually counts</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the hard-link measurement above makes a lot more sense once inodes do.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Cú lùi CHẠY ĐƯỢC</h2>
<p class="lead">Lùi bản không phải là chạy ngược một lần deploy. Nó là ĐÚNG cái lần deploy mà bạn đã biết chắc chạy được, đặt trở lại — và toàn bộ lý do nó nhanh là vì bạn đã GIỮ tạo tác, chứ không giữ mỗi bản hướng dẫn cách dựng ra nó.</p>

<div class="callout">
<p><strong>Chương này nằm ở đâu.</strong> Chương 3 dựng một bước tráo không rơi request, và script của nó tự lùi khi chốt kiểm cửa trước hỏng <em>TRONG LÚC</em> deploy. Chương 5 dựng những migration cho phép hai phiên bản sống chung. Chương này nói về cái hỏng mà hai thứ đó KHÔNG che: lần deploy đã xong sạch sẽ, mọi chốt kiểm đều xanh, và hai mươi phút sau có người phát hiện các con số sai. Sẽ KHÔNG có gì tự lùi giúp bạn. Bạn phải tự làm, và một nửa những gì bản hỏng đã làm thì không quay lại được.</p>
</div>

<h3>Vì sao một cú lùi có thể tính bằng mili giây</h3>
<p>Chương 1 lập luận rằng hãy dựng tạo tác MỘT lần rồi chuyển nó đi nguyên vẹn. Bài này là chỗ lập luận đó được trả công. Nếu một bản phát hành là một thư mục trên đĩa và <code>hien-tai</code> là một symlink trỏ vào một trong số đó, thì "lùi bản" nghĩa là "trỏ symlink sang chỗ khác". Đó là MỘT thao tác hệ tệp.</p>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">bố cục</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">ban/v1/</div><div class="lz-nsub">một bản phát hành, đầy đủ, đã bung</div></div></div>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">ban/v2/</div><div class="lz-nsub">một bản phát hành, đầy đủ, đã bung</div></div></div>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">ban/v3/</div><div class="lz-nsub">một bản phát hành, đầy đủ, đã bung</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">con trỏ</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">hien-tai →</div><div class="lz-nsub">một symlink; đây là thứ DUY NHẤT mà deploy hay lùi bản đụng vào</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">tiến trình</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">node hien-tai/app.mjs</div><div class="lz-nsub">khởi động lại sau khi con trỏ dời; đọc thứ mà liên kết phân giải ra</div></div></div>
</div>
</div>

<p>Đo trong hộp cát, năm lần dời con trỏ đó liên tiếp:</p>

<pre><code># doi symlink NGUYEN TU: tao link moi roi mv -Tf de len link cu
<span class="tok-comment"># mv -Tf tren cung mot he tep la mot lenh rename(2) — khong co khoanh khac nao khong co link</span>
ln -sfn /srv/vps/lui/ban/v1 /srv/vps/lui/ht.moi
mv -Tf /srv/vps/lui/ht.moi /srv/vps/lui/hien-tai</code></pre>

<div class="out">doi symlink: 5718 us
doi symlink: 5227 us
doi symlink: 5726 us
doi symlink: 5351 us
doi symlink: 5150 us</div>

<p>Từ 5,1 tới 5,7 mili giây, mà phần lớn trong đó là cái shell chứ không phải nhân hệ điều hành. Nhưng chẳng ai lùi bản chỉ bằng cách dời con trỏ — tiến trình phải được khởi động lại thì mới nhặt được mã mới. Đây là toàn bộ chuyện đó, bấm giờ ba đoạn:</p>

<pre><code>T0=\$(date +%s%N)
ln -sfn "\$GOC/ban/\$DICH" "\$GOC/ht.moi" &amp;&amp; mv -Tf "\$GOC/ht.moi" "\$GOC/hien-tai"
T1=\$(date +%s%N)
<span class="tok-comment"># giet ban dang chay theo CONG dang nghe, khong dung pkill -f</span>
for p in \$(ss -ltnp 2>/dev/null|grep ":3300 "|grep -o 'pid=[0-9]*'|cut -d= -f2); do kill -TERM "\$p"; done
CONG=3300 setsid nohup node "\$GOC/hien-tai/app.mjs" >/tmp/lui-app.log 2>&amp;1 &lt;/dev/null &amp;
T2=\$(date +%s%N)
<span class="tok-comment"># cho toi khi no THAT SU tra loi, khong phai toi khi tien trinh ton tai</span>
for i in \$(seq 1 200); do
  [ "\$(curl -s -o /dev/null -w '%{http_code}' --max-time 1 http://127.0.0.1:3300/health)" = "200" ] &amp;&amp; break
  sleep 0.02
done
T3=\$(date +%s%N)</code></pre>

<div class="out">=== LUI VE v2 ===
  symlink   : 4 ms
  khoi dong : 8 ms
  cho san sang: 129 ms
  TONG      : 142 ms   → dang phuc vu: v2
=== LUI VE v1 ===
  symlink   : 4 ms
  khoi dong : 7 ms
  cho san sang: 128 ms
  TONG      : 140 ms   → dang phuc vu: v1
=== TIEN LEN v3 ===
  symlink   : 4 ms
  khoi dong : 8 ms
  cho san sang: 128 ms
  TONG      : 141 ms   → dang phuc vu: v3</div>

<p>140 mili giây, và 128 trong số đó là Node khởi động. Dời con trỏ cộng đẻ tiến trình gộp lại là 12 ms. Để ý khối thứ ba: đi <em>TỚI</em> tốn đúng bằng lùi <em>VỀ</em>, vì trong mô hình này chúng không khác nhau — cả hai đều là "trỏ vào một thư mục khác vốn đã có sẵn".</p>

<h3>Cách còn lại, đo thật</h3>
<p>Cách khác để quay về một phiên bản cũ là DỰNG LẠI nó: lấy commit cũ ra rồi chạy lại đường ống. Người ta hay chọn cách này vì nó không cần bố cục đặc biệt gì — bạn vốn đã có git. Đây là cái giá của nó, trên một dự án cố tình làm nhỏ (83 gói npm, 61 tệp TypeScript):</p>

<pre><code>T0=\$(date +%s%N)
git clone -q /tmp/kho-lui.git /tmp/lui-build
T1=\$(date +%s%N)
cd /tmp/lui-build &amp;&amp; npm ci --no-audit --no-fund
T2=\$(date +%s%N)
npx tsc
T3=\$(date +%s%N)</code></pre>

<div class="out">  git clone : 23 ms
  npm ci    : 900 ms
  tsc build : 1070 ms
  TONG      : 1994 ms</div>

<p>Hai giây so với 140 mili giây — chậm hơn mười bốn lần, mà đây đã là phép so sánh THUẬN LỢI NHẤT tôi dựng được. Cú clone là từ một kho trần ngay trên hệ tệp, nên 23 ms; qua mạng thì nó là hàng giây. Bộ nhớ đệm npm đang ấm; để nguội thì cùng 83 gói ấy đo được 1.090 ms thay vì 612 ms:</p>

<div class="out">=== npm ci lan 1 (co cache) ===   667 ms
=== npm ci lan 2 ===              612 ms
=== npm ci lan 3, cache SACH ===  1090 ms</div>

<div class="pitfall">
<p><strong>Bẫy — một dự án đồ chơi KHÔNG phải phép đo bạn cần.</strong> 83 gói chẳng là gì. Chính cái kho mà khoá học này được viết trong đó có <strong>897</strong> gói đã phân giải trong lockfile backend và <strong>1.159</strong> gói bên frontend, mà bản dựng frontend là <code>next build</code> chứ không phải <code>tsc</code>. Con số 1.994 ms của tôi là một cái SÀN, không phải một ước lượng — dựng lại thật một ứng dụng thật là hàng phút. Tỷ số cần nhớ không phải "14 lần", mà là "mili giây so với phút, trong lúc website đang hỏng".</p>
</div>

<h3>Thứ bạn thật sự trả tiền: đĩa</h3>
<p>Giữ bản cũ nghĩa là giữ cả phụ thuộc của chúng. Đo trên cùng cây 83 gói ấy, có cài cả phụ thuộc phát triển:</p>

<div class="out">node_modules cua MOT ban: 29M

  giu 5 ban  : ~145 MB
  giu 20 ban : ~580 MB
  giu 100 ban: ~2,8 GB</div>

<p>Trên cái VPS 6 GB mà khoá này cứ nhắc đi nhắc lại, hai mươi bản của một ứng dụng thật là một phần đáng kể của cái đĩa — và Chương 8 sẽ cho xem chuyện gì xảy ra khi đĩa đó đầy. Cách chữa rẻ tiền là LIÊN KẾT CỨNG: các tệp giống hệt nhau dùng chung một bản trên đĩa.</p>

<pre><code><span class="tok-comment"># cp -al = chep CAY THU MUC nhung file thi lam LIEN KET CUNG, khong nhan doi byte</span>
cp -al /tmp/hl/a /tmp/hl/b     <span class="tok-comment"># lien ket cung</span>
cp -r  /tmp/hl/a /tmp/hl/c     <span class="tok-comment"># chep that</span></code></pre>

<div class="out">  cp -al (hardlink): 15 ms
  cp -r  (chep that): 126 ms

25M	/tmp/hl/a
0	/tmp/hl/b      ← khong ton them byte nao
25M	/tmp/hl/c</div>

<p>Nhanh hơn tám lần và miễn phí trên đĩa. Điều kiện là liên kết cứng chỉ giúp khi các tệp giống hệt từng byte, mà với <code>node_modules</code> của hai bản cùng một lockfile thì thường là đúng vậy — còn khi không giống, <code>cp -al</code> đơn giản là chép thật cái tệp khác nhau đó.</p>

<div class="callout ok">
<p><strong>Quy tắc bài này mua được.</strong> Giữ N bản gần nhất trên đĩa, đã bung sẵn, sẵn sàng để trỏ vào. Chọn N bằng cách tự hỏi "tôi có bao giờ lùi xa tới đâu?" — với phần lớn đội đó là 3 tới 5, vì một bản cũ hơn vài ngày thì gần như chắc chắn đã không tương thích với cơ sở dữ liệu nữa rồi (6.2). Rồi đo xem N ấy tốn bao nhiêu đĩa, và liên kết cứng nếu thấy xót.</p>
</div>

<h3>Cú lùi KHÔNG CÓ CHỖ để về</h3>
<p>Một luật giữ bản quá gắt biến "lùi bản" thành "dựng lại". Đo thật, với luật giữ ba bản:</p>

<div class="out">  luat: giu 3 ban gan nhat → v0 bi don
  xoa: v0
KHONG co ban 'v0'. Co: v1 v2 v3
  ma thoat: 2</div>

<p>Mã thoát 2, và một dòng thông báo liệt kê ra những bản CÓ. Đó là hành vi đúng cho một script lùi bản: hỏng thật to kèm danh sách lựa chọn, thay vì thành công nửa vời. Nhưng để ý là script không cứu được bạn ở đây — cái quyết định làm hỏng chuyện này đã diễn ra vài ngày trước, lúc có người đặt luật giữ bằng ba.</p>

<h3>Cái trục còn lại mà một cú lùi KHÔNG dời</h3>
<p>Chương 4 đã xác lập rằng cấu hình sống NGOÀI tạo tác, trong <code>/opt/cuonghoangdev/.env</code> trên VPS, và sống sót qua mọi lần deploy. Đó chính xác là thứ bạn muốn trong gần như mọi lúc. Nó cũng có nghĩa là lùi tạo tác thì <strong>KHÔNG</strong> lùi cấu hình:</p>

<div class="out">  .env HIEN TAI (do v2 dat):  KHOA_API=abc
  ma v1 (ban lui ve) doc:     API_KEY
  v1 doc API_KEY = undefined → NO ra khi khoi dong
→ lui tao tac KHONG lui .env. Cot env la mot truc THU HAI, lui rieng.</div>

<p>Nếu cái bản bạn đang lùi về đã ĐỔI TÊN một biến môi trường và có ai đó dọn nốt cái tên cũ đi, thì mã cũ khởi động lên và chết ngay vì thiếu khoá. Đây chính là lý do Chương 4 khuyên thêm tên mới NHƯNG giữ tên cũ chạy được thêm một hai bản — đúng cái hình dạng mở-rộng-rồi-thu-hẹp của cú đổi tên cột ở Chương 5, áp cho cấu hình.</p>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">rename(2) — thay thế nguyên tử</span><span class="lc-sub">man 2 rename: <em>"If newpath already exists, it will be atomically replaced"</em>. Đúng một câu này là lời bảo đảm mà <code>mv -Tf</code> dựa vào, và là lý do cú dời con trỏ không có khe hở.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">symlink(7) — nhân hệ điều hành phân giải liên kết mềm thế nào</span><span class="lc-sub">man 7 symlink — kể cả chuyện vì sao một tiến trình ĐANG chạy không đi theo liên kết khi liên kết đổi, mà đó chính là lý do bước khởi động lại trong bài này không phải tuỳ chọn.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — V. Build, release, run</span><span class="lc-sub">12factor.net/build-release-run: <em>"releases are immutable... any change must create a new release"</em>. Cách bố trí thư mục đo ở đây là hệ quả trực tiếp.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">cp(1) — cờ --link</span><span class="lc-sub">gnu.org/software/coreutils/manual/html_node/cp-invocation.html — <code>cp -al</code> làm gì, và khi nào liên kết cứng an toàn, khi nào không.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Capistrano — cấu trúc thư mục</span><span class="lc-sub">capistranorb.com/documentation/getting-started/structure — bố cục <code>releases/</code> cộng <code>current</code> mà bài này đem đi đo đã là chuẩn từ 2006; đáng đọc vì quy ước, không phải vì Ruby.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — liên kết, inode, và du thật ra đếm cái gì</span><span class="lc-sub">/courses/linux-bash/learn${REF} — phép đo liên kết cứng ở trên dễ hiểu hơn nhiều khi đã hiểu inode.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 6.2 ─────────────────────────── */
    {
      title: '6.2 — The rollback that lies|||6.2 — Cú lùi NÓI DỐI',
      slug: 'deploy-6-2-lui-noi-doi',
      type: 'VIDEO',
      description: 'Lùi bản xong, chốt kiểm sức khoẻ trả 200, script báo thành công — và mọi endpoint thật trả 500. Đo thật: mã cũ đâm vào một lược đồ đã đi tiếp, và vì sao /health là chốt kiểm dối trá nhất trong toàn bộ khoá học này.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>The rollback that lies</h2>
<p class="lead">The pointer moved. The process restarted. The health check returned 200 and the script printed a tick. Every request that does actual work returned 500, and nothing in the deploy pipeline noticed.</p>

<div class="callout warn">
<p><strong>The setup.</strong> Version 2 shipped a migration that renamed <code>ten</code> to <code>ho_ten</code>, plus the code that reads the new name. Both went out together, both worked. Twenty minutes later v2 turns out to have an unrelated bug, so somebody rolls the code back to v1 — the fast, clean, 140-millisecond rollback from 6.1. The database is not touched, because "rolling back a migration is dangerous" and everyone knows it.</p>
</div>

<h3>What the machine actually reports</h3>
<p>Measured, against the live PostgreSQL 16.13 on port 5433. First the deploy of v2, which works:</p>

<div class="out">=== 1. DEPLOY v2: chay migration doi ten cot, roi trao ma ===
v2 doc : [{"id":1001,"ten":"v1 ghi","so_tien":7},{"id":1000,"ten":"khach 1000",...
v2 ghi : {"id":1002}</div>

<p>Then the rollback to v1, code only:</p>

<div class="out">=== 2. v2 CO BUG. LUI VE v1 — chi doi ma, KHONG dung toi CSDL ===
  /health = 200   ← chot kiem suc khoe noi: XANH
  /don    = 500   than: column "ten" does not exist
  /tao    = 500   than: column "ten" of relation "don" does not exist</div>

<p>Read those three lines again. <code>/health</code> is 200. Every rollback script in this course so far — including the one in Chapter 3 — treats a 200 from the health endpoint as proof that the version came up. It came up. It is also completely broken.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">v1 + old schema</span><span class="lz-t">healthy</span><span class="lz-d">column <code>ten</code> exists; v1 reads it</span></div>
<div class="lz-step"><span class="lz-k">deploy v2</span><span class="lz-t">healthy</span><span class="lz-d">rename runs, v2 reads <code>ho_ten</code>; both moved together</span></div>
<div class="lz-step"><span class="lz-k">roll back to v1</span><span class="lz-t">BROKEN</span><span class="lz-d">v1 reads <code>ten</code>; the database only has <code>ho_ten</code>. Health check still 200.</span></div>
</div>

<h3>Why the health check cannot see it</h3>
<p>Because of what a health endpoint usually is:</p>

<pre><code>if (req.url === "/health") { res.writeHead(200); return res.end("ok\\n"); }</code></pre>

<p>It answers before touching anything. It does not open a database connection, it does not run a query, it does not read a config value. That is deliberate — a health check that talks to the database will report the app as unhealthy during a database blip and get the process killed by whatever supervises it, which turns a five-second database hiccup into a restart loop. So health checks are kept shallow on purpose, and a shallow health check cannot possibly detect a schema mismatch.</p>

<div class="pitfall">
<p><strong>Trap — "deep" health checks are not the fix.</strong> The obvious reaction is to make <code>/health</code> run <code>SELECT 1</code>. That catches "the database is unreachable" and still misses this entirely: <code>SELECT 1</code> succeeds perfectly against a schema your code cannot read. To catch <em>this</em> you would need the health check to exercise a real query on a real table — at which point it is no longer a health check, it is a smoke test, and it belongs in the deploy script, not on an endpoint a load balancer polls every two seconds.</p>
</div>

<h3>The fix, and its cost</h3>
<p>Rolling the schema back too:</p>

<div class="out">=== 3. LUI CA LUOC DO: doi ten cot ve ===
  /don = 200  ← v1 song lai</div>

<p>One <code>ALTER TABLE ... RENAME COLUMN</code> and the site works. So why does every piece of writing about deploys tell you not to roll migrations back? Because this case — a pure rename, no data written in the new shape, no dependent objects — is the friendliest one that exists. The general case is not friendly:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">rename a column</span><span class="lz-lnote">reversible; one statement; measured above</span></div>
<div class="lz-layer"><span class="lz-lname">add a column</span><span class="lz-lnote">reversible by dropping it — but you lose everything written into it (6.3)</span></div>
<div class="lz-layer"><span class="lz-lname">add a NOT NULL constraint</span><span class="lz-lnote">reversible; the rows that violated it were already rejected, and they are not coming back</span></div>
<div class="lz-layer"><span class="lz-lname">change a type</span><span class="lz-lnote">sometimes: <code>int → bigint</code> reverses only if no value exceeded the old range</span></div>
<div class="lz-layer"><span class="lz-lname">drop a column</span><span class="lz-lnote">NOT reversible; the data is gone (6.3 measures exactly how gone)</span></div>
<div class="lz-layer"><span class="lz-lname">merge or split a table</span><span class="lz-lnote">not reversible in any general way; the inverse is a data migration of its own</span></div>
</div>

<h3>The rule that makes this stop happening</h3>
<p>Chapter 5 built expand–contract for exactly this reason, and 6.2 is where the payoff becomes visible. If v2 had shipped the expand phase — add <code>ho_ten</code>, keep <code>ten</code>, sync both with a trigger — then rolling the code back to v1 would have been a 140-millisecond non-event, because <code>ten</code> would still be there and still correct. The contract phase, the one that actually drops <code>ten</code>, ships days later when nobody is going to roll back that far any more.</p>

<div class="callout ok">
<p><strong>Say it as a rule.</strong> A migration is safe to deploy when the <em>previous</em> release still works against the new schema. Not the current one — the previous one. That single sentence is what turns "can I roll back?" from a question you answer under pressure at 2 a.m. into a property you established when you wrote the migration.</p>
</div>

<h3>How far back can you actually go?</h3>
<p>This is the question 6.1's retention policy could not answer on its own. Keeping ten releases on disk does not mean you can roll back ten releases — you can roll back to the oldest release that still works against the schema you have <em>now</em>. If you run expand–contract with a one-week gap between expand and contract, that is roughly "one week". If you rename columns in place, it is "zero releases", and the ten directories on disk are decoration.</p>

<div class="kv-grid">
<div class="kv"><span class="k">rollback distance</span><span class="v">the number of releases back you can go and still work against today's schema</span></div>
<div class="kv"><span class="k">set by</span><span class="v">the gap between your expand and contract phases — not by disk retention</span></div>
<div class="kv"><span class="k">measured how</span><span class="v">start release N-1 against the current database and hit a real endpoint. That is the whole test.</span></div>
<div class="kv"><span class="k">what breaks it</span><span class="v">any migration that removes something the previous release reads</span></div>
</div>

<p>And that last row is a test you can run before you ever need it — it is exactly what I did above, and it took one <code>curl</code>.</p>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — ParallelChange</span><span class="lc-sub">martinfowler.com/bliki/ParallelChange.html — expand, migrate, contract. Read it once and the phrase "rollback distance" above becomes obvious.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — ALTER TABLE ... RENAME</span><span class="lc-sub">postgresql.org/docs/current/sql-altertable.html — a rename is a catalogue update, which is why both directions are milliseconds.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kubernetes — configure liveness, readiness and startup probes</span><span class="lc-sub">kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/ — the clearest statement anywhere of why liveness probes must stay shallow, which is the reason this lesson exists.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — schema changes and what each one locks</span><span class="lc-sub">/courses/postgresql/learn${REF} — the reversibility table above, from the database side.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Cú lùi NÓI DỐI</h2>
<p class="lead">Con trỏ đã dời. Tiến trình đã khởi động lại. Chốt kiểm sức khoẻ trả 200 và script in ra một dấu tích. Mọi request làm việc thật đều trả 500, và chẳng có gì trong đường ống deploy nhận ra.</p>

<div class="callout warn">
<p><strong>Tình huống.</strong> Bản 2 phát hành kèm một migration đổi tên <code>ten</code> thành <code>ho_ten</code>, cộng với mã đọc cái tên mới. Cả hai đi ra cùng nhau, cả hai đều chạy. Hai mươi phút sau v2 hoá ra có một lỗi CHẲNG LIÊN QUAN, nên có người lùi mã về v1 — đúng cú lùi nhanh, sạch, 140 mili giây của bài 6.1. Cơ sở dữ liệu KHÔNG bị đụng vào, vì "lùi migration là nguy hiểm" và ai cũng biết thế.</p>
</div>

<h3>Cái máy thật ra báo gì</h3>
<p>Đo thật, trên PostgreSQL 16.13 đang chạy ở cổng 5433. Trước hết là lần deploy v2, chạy tốt:</p>

<div class="out">=== 1. DEPLOY v2: chay migration doi ten cot, roi trao ma ===
v2 doc : [{"id":1001,"ten":"v1 ghi","so_tien":7},{"id":1000,"ten":"khach 1000",...
v2 ghi : {"id":1002}</div>

<p>Rồi lùi về v1, chỉ mã thôi:</p>

<div class="out">=== 2. v2 CO BUG. LUI VE v1 — chi doi ma, KHONG dung toi CSDL ===
  /health = 200   ← chot kiem suc khoe noi: XANH
  /don    = 500   than: column "ten" does not exist
  /tao    = 500   than: column "ten" of relation "don" does not exist</div>

<p>Đọc lại ba dòng đó. <code>/health</code> là 200. MỌI script lùi bản trong khoá này từ đầu tới giờ — kể cả cái ở Chương 3 — đều coi một cái 200 từ endpoint sức khoẻ là bằng chứng rằng phiên bản đã lên. Nó lên thật. Và nó cũng hỏng hoàn toàn.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">v1 + lược đồ cũ</span><span class="lz-t">khoẻ</span><span class="lz-d">cột <code>ten</code> có; v1 đọc nó</span></div>
<div class="lz-step"><span class="lz-k">deploy v2</span><span class="lz-t">khoẻ</span><span class="lz-d">cú đổi tên chạy, v2 đọc <code>ho_ten</code>; hai thứ dời cùng nhau</span></div>
<div class="lz-step"><span class="lz-k">lùi về v1</span><span class="lz-t">HỎNG</span><span class="lz-d">v1 đọc <code>ten</code>; cơ sở dữ liệu chỉ còn <code>ho_ten</code>. Chốt kiểm sức khoẻ vẫn 200.</span></div>
</div>

<h3>Vì sao chốt kiểm sức khoẻ KHÔNG THỂ thấy</h3>
<p>Vì bản chất của một endpoint sức khoẻ thường là thế này:</p>

<pre><code>if (req.url === "/health") { res.writeHead(200); return res.end("ok\\n"); }</code></pre>

<p>Nó trả lời TRƯỚC KHI đụng vào bất cứ thứ gì. Nó không mở kết nối cơ sở dữ liệu, không chạy truy vấn, không đọc giá trị cấu hình nào. Đó là CỐ Ý — một chốt kiểm sức khoẻ có nói chuyện với cơ sở dữ liệu sẽ báo ứng dụng là ốm trong lúc cơ sở dữ liệu chớp một cái, rồi bị cái thứ đang giám sát nó giết chết, biến một cú nấc năm giây của cơ sở dữ liệu thành một vòng lặp khởi động lại. Nên chốt kiểm sức khoẻ được giữ NÔNG có chủ đích, mà một chốt kiểm nông thì không thể nào phát hiện được một cú lệch lược đồ.</p>

<div class="pitfall">
<p><strong>Bẫy — chốt kiểm sức khoẻ "sâu" KHÔNG phải cách chữa.</strong> Phản ứng hiển nhiên là bắt <code>/health</code> chạy <code>SELECT 1</code>. Cái đó bắt được "cơ sở dữ liệu không với tới được" và vẫn TRẬT hoàn toàn ca này: <code>SELECT 1</code> thành công mỹ mãn trên một lược đồ mà mã của bạn không đọc nổi. Để bắt được <em>CA NÀY</em> thì chốt kiểm phải chạy một truy vấn thật trên một bảng thật — mà tới lúc đó nó không còn là chốt kiểm sức khoẻ nữa, nó là một phép kiểm khói, và chỗ của nó là trong script deploy chứ không phải trên một endpoint mà bộ cân bằng tải gõ hai giây một lần.</p>
</div>

<h3>Cách chữa, và giá của nó</h3>
<p>Lùi cả lược đồ:</p>

<div class="out">=== 3. LUI CA LUOC DO: doi ten cot ve ===
  /don = 200  ← v1 song lai</div>

<p>Một câu <code>ALTER TABLE ... RENAME COLUMN</code> và website chạy lại. Vậy sao mọi thứ viết về deploy đều bảo bạn ĐỪNG lùi migration? Vì ca này — một cú đổi tên thuần tuý, chưa có dữ liệu nào ghi theo hình dạng mới, không có đối tượng phụ thuộc nào — là ca THÂN THIỆN NHẤT tồn tại. Ca tổng quát thì không thân thiện:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">đổi tên một cột</span><span class="lz-lnote">lùi được; một câu lệnh; đã đo ở trên</span></div>
<div class="lz-layer"><span class="lz-lname">thêm một cột</span><span class="lz-lnote">lùi được bằng cách xoá nó — nhưng mất sạch thứ đã ghi vào đó (6.3)</span></div>
<div class="lz-layer"><span class="lz-lname">thêm ràng buộc NOT NULL</span><span class="lz-lnote">lùi được; những dòng vi phạm nó thì đã bị từ chối rồi, và chúng không quay lại</span></div>
<div class="lz-layer"><span class="lz-lname">đổi kiểu dữ liệu</span><span class="lz-lnote">đôi khi: <code>int → bigint</code> chỉ lùi được nếu chưa giá trị nào vượt khoảng cũ</span></div>
<div class="lz-layer"><span class="lz-lname">xoá một cột</span><span class="lz-lnote">KHÔNG lùi được; dữ liệu đi rồi (6.3 đo chính xác là đi tới mức nào)</span></div>
<div class="lz-layer"><span class="lz-lname">gộp hay tách bảng</span><span class="lz-lnote">không lùi được theo bất kỳ nghĩa tổng quát nào; nghịch đảo của nó là một cuộc di trú dữ liệu riêng</span></div>
</div>

<h3>Quy tắc làm chuyện này thôi xảy ra</h3>
<p>Chương 5 dựng mở-rộng–thu-hẹp đúng vì lý do này, và 6.2 là chỗ phần thưởng lộ ra. Nếu v2 phát hành giai đoạn MỞ RỘNG — thêm <code>ho_ten</code>, GIỮ <code>ten</code>, đồng bộ cả hai bằng một trigger — thì lùi mã về v1 đã là chuyện không đáng kể trong 140 mili giây, vì <code>ten</code> vẫn còn đó và vẫn đúng. Giai đoạn THU HẸP, cái thật sự xoá <code>ten</code>, phát hành vài ngày sau, lúc chẳng còn ai định lùi xa tới thế nữa.</p>

<div class="callout ok">
<p><strong>Nói thành quy tắc.</strong> Một migration an toàn để deploy khi bản phát hành <em>TRƯỚC ĐÓ</em> vẫn chạy được với lược đồ mới. Không phải bản hiện tại — bản TRƯỚC. Đúng một câu đó biến "tôi lùi được không?" từ một câu hỏi phải trả lời dưới áp lực lúc 2 giờ sáng thành một tính chất bạn đã thiết lập từ lúc viết cái migration.</p>
</div>

<h3>Bạn thật ra lùi xa được tới đâu?</h3>
<p>Đây là câu mà luật giữ bản của 6.1 tự nó không trả lời được. Giữ mười bản trên đĩa KHÔNG có nghĩa là bạn lùi được mười bản — bạn lùi được tới bản CŨ NHẤT còn chạy được với cái lược đồ bạn có <em>BÂY GIỜ</em>. Nếu bạn chạy mở-rộng–thu-hẹp với khoảng cách một tuần giữa hai giai đoạn, thì con số đó đại khái là "một tuần". Nếu bạn đổi tên cột tại chỗ, nó là "không bản nào", và mười thư mục trên đĩa chỉ để trang trí.</p>

<div class="kv-grid">
<div class="kv"><span class="k">tầm lùi</span><span class="v">số bản bạn lùi về được mà vẫn chạy với lược đồ hôm nay</span></div>
<div class="kv"><span class="k">do cái gì quyết định</span><span class="v">khoảng cách giữa giai đoạn mở rộng và thu hẹp — KHÔNG phải luật giữ bản trên đĩa</span></div>
<div class="kv"><span class="k">đo bằng cách nào</span><span class="v">khởi động bản N-1 với cơ sở dữ liệu hiện tại rồi gõ vào một endpoint thật. Toàn bộ phép kiểm là thế.</span></div>
<div class="kv"><span class="k">cái gì phá nó</span><span class="v">bất kỳ migration nào bỏ đi một thứ mà bản trước đó đọc</span></div>
</div>

<p>Và cái dòng cuối ấy là một phép kiểm bạn chạy được TRƯỚC KHI cần tới nó — đó chính xác là thứ tôi vừa làm ở trên, và nó tốn đúng một lệnh <code>curl</code>.</p>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — ParallelChange</span><span class="lc-sub">martinfowler.com/bliki/ParallelChange.html — mở rộng, di trú, thu hẹp. Đọc một lần là cụm "tầm lùi" ở trên thành hiển nhiên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — ALTER TABLE ... RENAME</span><span class="lc-sub">postgresql.org/docs/current/sql-altertable.html — đổi tên là cập nhật danh mục, nên cả hai chiều đều tính bằng mili giây.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kubernetes — cấu hình liveness, readiness và startup probe</span><span class="lc-sub">kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/ — phát biểu rõ nhất ở đâu đó về việc vì sao liveness probe phải giữ NÔNG, mà đó là lý do bài này tồn tại.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — thay đổi lược đồ, và mỗi thứ khoá cái gì</span><span class="lc-sub">/courses/postgresql/learn${REF} — bảng khả-nghịch ở trên, nhìn từ phía cơ sở dữ liệu.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 6.3 ─────────────────────────── */
    {
      title: '6.3 — What the bad version wrote|||6.3 — Thứ bản HỎNG đã GHI',
      slug: 'deploy-6-3-du-lieu-hong',
      type: 'VIDEO',
      description: 'Bản hỏng sống 18,6 giây và ghi 240 dòng sai. Lùi bản xoá được 0 dòng trong số đó. Dọn theo cửa sổ thời gian thì đụng 60 dòng VÔ TỘI để sửa 180 dòng hỏng. Và DROP COLUMN trên 200.000 dòng mất 1,287 mili giây — nhanh nhất khoá học, và là thứ duy nhất không lùi được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>What the bad version wrote</h2>
<p class="lead">Rolling back stops the bleeding. It does not undo the wound. Everything the bad version wrote while it was live is still in the database, indistinguishable from good data unless you can name exactly what made it bad.</p>

<h3>How much a bad version writes</h3>
<p>The rig: a version with a unit bug — it multiplies every amount by 1000 before storing it. Measured under a small, steady load, with the exact window timed:</p>

<div class="out">=== ban HONG len song. Do luu luong that trong 20 giay ===
  cua so: 18616 ms

 dong_HONG | dong_dung | tong
-----------+-----------+------
       240 |       500 |  740</div>

<p>240 poisoned rows in 18.6 seconds — about 12.9 per second, on a load small enough that it never troubled the machine. Now the rollback, which works perfectly:</p>

<div class="out">=== LUI: giet ban hong, dua ban dung len ===
  ban moi tra: x-ban: v2

  so_tien  | count
-----------+-------
    100000 |   531
 100000000 |   240</div>

<p>The new version is serving. New writes are correct — 531 good rows now, up from 500. And all 240 bad rows are exactly where the bad version left them. The rollback did what a rollback does: it changed which code runs. It has no opinion about rows.</p>

<div class="callout warn">
<p><strong>The number that actually matters.</strong> Not "how fast can I roll back" — 6.1 answered that, and it is 140 ms. The number that decides how bad your day is: <strong>how long the bad version was live</strong>, multiplied by <strong>how many writes per second it served</strong>. In my rig that is 18.6 s × 12.9/s = 240 rows. A real deploy that goes bad at 09:00 and gets noticed at 09:35 on a service doing 50 writes/second has written 105,000 of them.</p>
</div>

<h3>Now find them</h3>
<p>My cleanup above was trivial because I built the bug to be uniform: every bad row has <code>so_tien = 100000000</code> and no good row does. Real bugs are not that tidy. The usual identification is by <em>time</em>: "everything written between the deploy and the rollback". Measured, with a rig where only one endpoint is affected and a second, unrelated endpoint writes into the same table throughout:</p>

<div class="out">   ten   | count
---------+-------
 dang-ky |    60
 don     |   180

cua so hong: 2026-08-23 21:45:26.112258+00 → 2026-08-23 21:45:27.809144+00

=== don dep bang CUA SO THOI GIAN dinh nhung ai? ===
 vo_toi_bi_dinh | that_su_hong
----------------+--------------
             60 |          180</div>

<p>A time-window cleanup touches 240 rows to fix 180. Sixty of them — a quarter of everything it touches — were never broken. Whatever the cleanup does (delete, recalculate, flag for review), it does to those sixty too.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">by value</span><span class="lz-t">exact</span><span class="lz-d">works only when the bug leaves a signature you can write in SQL</span></div>
<div class="lz-step"><span class="lz-k">by time window</span><span class="lz-t">always available</span><span class="lz-d">measured 25% collateral here; the rate depends on how much unrelated traffic shares the table</span></div>
<div class="lz-step"><span class="lz-k">by version stamp</span><span class="lz-t">exact, if you planned</span><span class="lz-d">a column recording which release wrote each row — cheap to add, priceless here</span></div>
</div>

<p>That third row is the one worth acting on. A <code>ghi_boi</code> column holding the release identifier costs a few bytes per row and turns "everything in this window" into "everything written by v3", which is exactly the set you want and nothing else. Chapter 1's build stamps the version into the artifact already; carrying it into writes is a one-line change you will be extremely glad you made.</p>

<h3>The change that does not come back</h3>
<p>Dropping a column is the one migration in this course that is genuinely one-way. It is also, measured, the <em>fastest</em> thing in the entire course. On a 200,000-row table with real data in it:</p>

<pre><code>alter table kh drop column dien_thoai;</code></pre>

<div class="out">ALTER TABLE
Time: 1.287 ms</div>

<p>1.287 milliseconds to destroy 200,000 phone numbers. For comparison, Chapter 5 measured a completely harmless <code>ADD COLUMN ... DEFAULT gen_random_uuid()</code> on a similar table at <strong>2,606 ms</strong> — the safe operation took two thousand times longer than the destructive one. There is no relationship between how long a migration takes and how much damage it does, and if your instinct is "it finished instantly so it can't have done much", this is the measurement that should kill that instinct.</p>

<p>Adding the column back does not bring anything with it:</p>

<div class="out">alter table kh add column dien_thoai text;

  tong  | con_du_lieu
--------+-------------
 200000 |           0</div>

<h3>But where did the bytes go?</h3>
<p>Nowhere, at first. The table did not shrink:</p>

<div class="out">=== kich thuoc bang SAU khi drop ===
 van_con
---------
 20 MB</div>

<p>PostgreSQL implements <code>DROP COLUMN</code> as a catalogue edit — it marks the column dropped and stops showing it. The old values stay in every row on disk. You can see them:</p>

<pre><code>select attname, attnum, attisdropped from pg_attribute
 where attrelid='kh'::regclass and attnum &gt; 0;</code></pre>

<div class="out">           attname            | attnum | attisdropped
------------------------------+--------+--------------
 id                           |      1 | f
 email                        |      2 | f
 ........pg.dropped.3........ |      3 | t
 ghi_chu                      |      4 | f
 dien_thoai                   |      5 | f</div>

<p>The dropped column is still row 3 of the catalogue, renamed to a placeholder and flagged. The new <code>dien_thoai</code> is <code>attnum = 5</code> — a different column that happens to share a name. And with <code>pageinspect</code> you can read the raw heap and find the data still sitting there:</p>

<pre><code>create extension if not exists pageinspect;
select substring(encode(t_data,'escape') from 1 for 120)
  from heap_page_items(get_raw_page('kh',0)) where lp=1;</code></pre>

<div class="out"> \\x01\\000\\000\\000\\x17kh1@vd.com\\x170900007919)ghi chu cua khach 1</div>

<p><code>0900007919</code> — the phone number, physically present in the page, permanently unreachable through SQL. It disappears for real at the next table rewrite:</p>

<div class="out">vacuum full kh;
VACUUM
Time: 239.525 ms

=== sau VACUUM FULL ===
 19 MB
 \\x01\\000\\000\\000\\x17kh1@vd.com)ghi chu cua khach 1</div>

<p>239 milliseconds, one megabyte reclaimed, and the phone number is gone from the page.</p>

<div class="pitfall">
<p><strong>Trap — "the bytes are still there" is not a recovery plan.</strong> Everything above is diagnostic, not a rescue. There is no supported way to read a dropped column's values back into a query, the layout is version-specific and undocumented as an interface, <code>TOAST</code>-ed values live in another table entirely, and any autovacuum-triggered rewrite erases them without warning. If you dropped a column you needed, the recovery is a restore from backup — which Chapter 10 measures with a stopwatch. What this measurement is genuinely good for: understanding that <code>DROP COLUMN</code> does <em>not</em> free disk, which surprises people whose disk is full.</p>
</div>

<div class="callout ok">
<p><strong>What to do instead.</strong> Do not drop a column in the same release that stops writing to it. Stop writing, ship, wait out your rollback distance (6.2), then drop in a later release. That gap is the entire safety mechanism — during it, a rollback is free, and afterwards the data has proven itself unwanted for a week. The same shape as Chapter 5's contract phase, and the same shape as retiring a config key in Chapter 4.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — ALTER TABLE, notes on DROP COLUMN</span><span class="lc-sub">postgresql.org/docs/current/sql-altertable.html: <em>"the DROP COLUMN form does not physically remove the column, but simply makes it invisible to SQL operations"</em> — the documented sentence behind the heap measurement above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pageinspect</span><span class="lc-sub">postgresql.org/docs/current/pageinspect.html — <code>get_raw_page</code> and <code>heap_page_items</code>, the two functions used above. A diagnostic tool, explicitly not an interface.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — VACUUM FULL</span><span class="lc-sub">postgresql.org/docs/current/sql-vacuum.html — it rewrites the whole table and takes an ACCESS EXCLUSIVE lock, which is why 239 ms on 20 MB is not a number to extrapolate to a 20 GB table.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — how a row is stored on a page</span><span class="lc-sub">/courses/postgresql/learn${REF} — tuple headers, alignment and TOAST, which is what makes the raw-page output above readable.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Thứ bản HỎNG đã GHI</h2>
<p class="lead">Lùi bản cầm được máu. Nó KHÔNG hoàn tác vết thương. Mọi thứ bản hỏng đã ghi trong lúc nó còn sống vẫn nằm nguyên trong cơ sở dữ liệu, không phân biệt được với dữ liệu tốt, trừ khi bạn gọi tên được CHÍNH XÁC cái gì làm nó hỏng.</p>

<h3>Một bản hỏng ghi được bao nhiêu</h3>
<p>Bộ đo: một phiên bản có lỗi đơn vị — nó nhân mọi số tiền với 1000 trước khi lưu. Đo dưới một luồng tải nhỏ và đều, với cửa sổ được bấm giờ chính xác:</p>

<div class="out">=== ban HONG len song. Do luu luong that trong 20 giay ===
  cua so: 18616 ms

 dong_HONG | dong_dung | tong
-----------+-----------+------
       240 |       500 |  740</div>

<p>240 dòng nhiễm độc trong 18,6 giây — khoảng 12,9 dòng mỗi giây, trên một mức tải nhỏ tới mức không làm phiền cái máy. Giờ tới cú lùi, và nó chạy hoàn hảo:</p>

<div class="out">=== LUI: giet ban hong, dua ban dung len ===
  ban moi tra: x-ban: v2

  so_tien  | count
-----------+-------
    100000 |   531
 100000000 |   240</div>

<p>Bản mới đang phục vụ. Các lệnh ghi mới đều đúng — 531 dòng tốt, tăng từ 500. Và cả 240 dòng hỏng nằm y nguyên chỗ bản hỏng bỏ chúng lại. Cú lùi đã làm đúng việc của một cú lùi: đổi xem mã nào chạy. Nó chẳng có ý kiến gì về các dòng dữ liệu.</p>

<div class="callout warn">
<p><strong>Con số thật sự quan trọng.</strong> Không phải "tôi lùi nhanh cỡ nào" — 6.1 trả lời rồi, và đó là 140 ms. Con số quyết định ngày hôm nay của bạn tệ tới đâu: <strong>bản hỏng sống bao lâu</strong>, nhân với <strong>nó phục vụ bao nhiêu lệnh ghi mỗi giây</strong>. Trong bộ đo của tôi đó là 18,6 s × 12,9/s = 240 dòng. Một lần deploy thật hỏng lúc 09:00 và bị phát hiện lúc 09:35 trên một dịch vụ ghi 50 lệnh/giây đã ghi ra 105.000 dòng.</p>
</div>

<h3>Giờ đi TÌM chúng</h3>
<p>Cú dọn dẹp ở trên của tôi dễ vì tôi cố tình dựng lỗi cho ĐỀU: mọi dòng hỏng đều có <code>so_tien = 100000000</code> và không dòng tốt nào như thế. Lỗi thật không gọn gàng vậy. Cách nhận dạng thông thường là theo <em>THỜI GIAN</em>: "mọi thứ ghi giữa lúc deploy và lúc lùi". Đo thật, với một bộ đo mà chỉ MỘT endpoint bị lỗi còn một endpoint thứ hai, chẳng liên quan, vẫn ghi vào cùng bảng suốt thời gian đó:</p>

<div class="out">   ten   | count
---------+-------
 dang-ky |    60
 don     |   180

cua so hong: 2026-08-23 21:45:26.112258+00 → 2026-08-23 21:45:27.809144+00

=== don dep bang CUA SO THOI GIAN dinh nhung ai? ===
 vo_toi_bi_dinh | that_su_hong
----------------+--------------
             60 |          180</div>

<p>Dọn theo cửa sổ thời gian đụng vào 240 dòng để sửa 180. Sáu mươi dòng trong đó — một phần tư tất cả những gì nó chạm tới — chưa bao giờ hỏng. Cú dọn làm gì (xoá, tính lại, gắn cờ để xem lại), nó làm luôn với sáu mươi dòng đó.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">theo GIÁ TRỊ</span><span class="lz-t">chính xác</span><span class="lz-d">chỉ chạy được khi lỗi để lại một chữ ký viết ra SQL được</span></div>
<div class="lz-step"><span class="lz-k">theo CỬA SỔ thời gian</span><span class="lz-t">lúc nào cũng có</span><span class="lz-d">ở đây đo được 25% thiệt hại lan; tỷ lệ tuỳ vào bao nhiêu lưu lượng không liên quan dùng chung bảng</span></div>
<div class="lz-step"><span class="lz-k">theo DẤU PHIÊN BẢN</span><span class="lz-t">chính xác, nếu đã tính trước</span><span class="lz-d">một cột ghi lại bản nào đã ghi dòng nào — rẻ để thêm, vô giá lúc này</span></div>
</div>

<p>Cái dòng thứ ba mới là thứ đáng hành động. Một cột <code>ghi_boi</code> giữ mã bản phát hành tốn vài byte mỗi dòng và biến "mọi thứ trong cửa sổ này" thành "mọi thứ do v3 ghi", đúng bằng tập hợp bạn muốn và không thừa gì. Bản dựng ở Chương 1 đã đóng dấu phiên bản vào tạo tác rồi; mang nó vào các lệnh ghi là một dòng sửa mà bạn sẽ CỰC KỲ mừng vì đã làm.</p>

<h3>Cái thay đổi KHÔNG quay lại</h3>
<p>Xoá một cột là migration duy nhất trong khoá này thật sự MỘT CHIỀU. Nó cũng là, đo thật, thứ <em>NHANH NHẤT</em> trong cả khoá học. Trên một bảng 200.000 dòng có dữ liệu thật:</p>

<pre><code>alter table kh drop column dien_thoai;</code></pre>

<div class="out">ALTER TABLE
Time: 1.287 ms</div>

<p>1,287 mili giây để phá huỷ 200.000 số điện thoại. So sánh: Chương 5 đo một câu <code>ADD COLUMN ... DEFAULT gen_random_uuid()</code> hoàn toàn vô hại trên một bảng tương tự ở <strong>2.606 ms</strong> — thao tác AN TOÀN mất thời gian gấp hai nghìn lần thao tác PHÁ HUỶ. Không có mối liên hệ nào giữa việc một migration chạy lâu bao nhiêu và nó gây hại tới đâu, và nếu bản năng của bạn là "nó xong ngay tức thì nên chắc chẳng làm gì mấy", thì đây là phép đo phải giết cái bản năng đó.</p>

<p>Thêm cột lại thì chẳng mang theo được gì:</p>

<div class="out">alter table kh add column dien_thoai text;

  tong  | con_du_lieu
--------+-------------
 200000 |           0</div>

<h3>Nhưng các byte đi đâu?</h3>
<p>Chẳng đi đâu cả, lúc đầu. Bảng KHÔNG hề nhỏ đi:</p>

<div class="out">=== kich thuoc bang SAU khi drop ===
 van_con
---------
 20 MB</div>

<p>PostgreSQL cài đặt <code>DROP COLUMN</code> như một lần sửa DANH MỤC — nó đánh dấu cột đã xoá rồi thôi hiển thị. Các giá trị cũ nằm nguyên trong mọi dòng trên đĩa. Bạn nhìn thấy được:</p>

<pre><code>select attname, attnum, attisdropped from pg_attribute
 where attrelid='kh'::regclass and attnum &gt; 0;</code></pre>

<div class="out">           attname            | attnum | attisdropped
------------------------------+--------+--------------
 id                           |      1 | f
 email                        |      2 | f
 ........pg.dropped.3........ |      3 | t
 ghi_chu                      |      4 | f
 dien_thoai                   |      5 | f</div>

<p>Cột đã xoá vẫn là dòng số 3 của danh mục, đổi tên thành một chỗ giữ chỗ và gắn cờ. Cột <code>dien_thoai</code> MỚI là <code>attnum = 5</code> — một cột KHÁC tình cờ trùng tên. Và với <code>pageinspect</code> bạn đọc được trang heap thô và thấy dữ liệu vẫn ngồi đó:</p>

<pre><code>create extension if not exists pageinspect;
select substring(encode(t_data,'escape') from 1 for 120)
  from heap_page_items(get_raw_page('kh',0)) where lp=1;</code></pre>

<div class="out"> \\x01\\000\\000\\000\\x17kh1@vd.com\\x170900007919)ghi chu cua khach 1</div>

<p><code>0900007919</code> — cái số điện thoại, hiện diện vật lý trong trang, và vĩnh viễn không với tới được bằng SQL. Nó biến mất thật ở lần ghi lại bảng kế tiếp:</p>

<div class="out">vacuum full kh;
VACUUM
Time: 239.525 ms

=== sau VACUUM FULL ===
 19 MB
 \\x01\\000\\000\\000\\x17kh1@vd.com)ghi chu cua khach 1</div>

<p>239 mili giây, đòi lại được một megabyte, và số điện thoại đã biến khỏi trang.</p>

<div class="pitfall">
<p><strong>Bẫy — "các byte vẫn còn đó" KHÔNG phải một kế hoạch phục hồi.</strong> Mọi thứ ở trên là CHẨN ĐOÁN, không phải cứu hộ. Không có cách nào được hỗ trợ để đọc giá trị của một cột đã xoá trở lại vào một truy vấn, bố cục đó phụ thuộc phiên bản và không được ghi tài liệu như một giao diện, giá trị đã <code>TOAST</code> thì nằm hẳn ở bảng khác, và bất kỳ lần ghi lại nào do autovacuum kích hoạt cũng xoá sạch chúng mà không báo. Nếu bạn đã xoá một cột bạn CẦN, thì đường phục hồi là khôi phục từ bản sao lưu — thứ Chương 10 đem ra bấm giờ. Cái phép đo này thật sự có ích cho điều gì: hiểu rằng <code>DROP COLUMN</code> <em>KHÔNG</em> giải phóng đĩa, chuyện làm ngạc nhiên những người đang đầy đĩa.</p>
</div>

<div class="callout ok">
<p><strong>Làm gì thay vào đó.</strong> ĐỪNG xoá một cột trong cùng bản phát hành mà bạn thôi ghi vào nó. Thôi ghi, phát hành, chờ hết tầm lùi của bạn (6.2), rồi mới xoá ở một bản sau. Cái khoảng cách đó CHÍNH LÀ toàn bộ cơ chế an toàn — trong lúc đó, lùi bản là miễn phí, còn sau đó thì dữ liệu đã tự chứng minh là không ai cần suốt một tuần. Cùng hình dạng với giai đoạn thu hẹp ở Chương 5, và cùng hình dạng với việc cho một khoá cấu hình về hưu ở Chương 4.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — ALTER TABLE, ghi chú về DROP COLUMN</span><span class="lc-sub">postgresql.org/docs/current/sql-altertable.html: <em>"the DROP COLUMN form does not physically remove the column, but simply makes it invisible to SQL operations"</em> — đúng câu tài liệu nằm sau phép đo heap ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pageinspect</span><span class="lc-sub">postgresql.org/docs/current/pageinspect.html — <code>get_raw_page</code> và <code>heap_page_items</code>, hai hàm dùng ở trên. Một công cụ chẩn đoán, và nói rõ là KHÔNG phải giao diện.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — VACUUM FULL</span><span class="lc-sub">postgresql.org/docs/current/sql-vacuum.html — nó ghi lại cả bảng và giữ khoá ACCESS EXCLUSIVE, nên 239 ms trên 20 MB không phải con số để ngoại suy sang bảng 20 GB.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — một dòng được lưu trên trang như thế nào</span><span class="lc-sub">/courses/postgresql/learn${REF} — đầu tuple, canh lề và TOAST, thứ làm cho output trang thô ở trên đọc được.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 6.4 ─────────────────────────── */
    {
      title: '6.4 — One-way doors|||6.4 — Những CÁNH CỬA MỘT CHIỀU',
      slug: 'deploy-6-4-cua-mot-chieu',
      type: 'VIDEO',
      description: 'Cơ sở dữ liệu về 0 dòng; hộp thư vẫn 90 lá. Đo thật hai kiến trúc: gửi thẳng trong request thì lùi bản cứu được 0 lá, còn hộp gửi thì cứu được 50 trên 90 — không phải vì nó hoàn tác được, mà vì nó thu hẹp cửa sổ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>One-way doors</h2>
<p class="lead">6.3 was about data you own and can therefore repair, however painfully. This lesson is about the things the bad version did that left your machine entirely — and there is no query that fixes those.</p>

<h3>The measurement</h3>
<p>A fake mail server on port 3310 that appends every message it receives to a file. An app that, on each order, inserts a row and sends a confirmation email in the same request. Then the bad version runs, and we roll back by deleting everything it wrote:</p>

<div class="out">=== ban HONG len song, 90 don ===
  cua so: 849 ms
dong trong CSDL: 90
thu DA GUI DI  : 90

=== LUI: xoa sach dong hong trong CSDL ===
dong trong CSDL sau lui: 0
thu DA GUI DI sau lui: 90   ← KHONG DOI</div>

<p>The database went to zero. The mailbox stayed at 90. This is the whole lesson in four lines: a rollback is a statement about your process and your data, and the outside world was never party to it.</p>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">reversible</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">which code runs</div><div class="lz-nsub">140 ms (6.1)</div></div></div>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">schema shape</div><div class="lz-nsub">sometimes, and only if you planned it (6.2)</div></div></div>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">rows you wrote</div><div class="lz-nsub">repairable if you can identify them (6.3)</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">one-way</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">an email delivered</div><div class="lz-nsub">measured: 90 sent, 90 still sent after rollback</div></div></div>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">a payment captured</div><div class="lz-nsub">a refund is a new transaction, not an undo — and it is visible on the statement</div></div></div>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">a webhook fired</div><div class="lz-nsub">another company&#39;s system already acted on it</div></div></div>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">a push notification</div><div class="lz-nsub">on a lock screen, already read</div></div></div>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">a file deleted from object storage</div><div class="lz-nsub">gone unless versioning was on before the deploy</div></div></div>
</div>
</div>

<h3>The shape that shrinks the damage</h3>
<p>The transactional outbox: instead of sending inside the request, write the <em>intent</em> to a table in the same transaction as the business data, and let a separate worker deliver it. Same 90 orders, worker not yet started:</p>

<div class="out">=== ban HONG len song, 90 don — THO CHUA CHAY ===
don: 90
y dinh gui xep hang: 90
thu DA GUI DI: 0   ← chua ai nhan gi

=== LUI trong khi hang doi chua chay ===
y dinh con lai: 0
thu DA GUI DI: 0   ← VAN 0. Lui ket qua SACH.</div>

<p>Zero emails. The rollback was clean because the send had not happened yet — the intent was still a row, and rows are the thing rollbacks can touch.</p>

<div class="callout warn">
<p><strong>That result is too flattering, so here is the honest one.</strong> The clean rollback above depended on the worker never having run. In production it runs constantly. Measured again, with the worker draining ten at a time and the rollback happening 1.6 seconds in:</p>
</div>

<div class="out">=== khoanh khac LUI ===
da danh dau gui   : 40
chua gui, HUY DUOC: 50
thu that su da roi khoi may: 40</div>

<p>Forty gone, fifty saved. The outbox did not make the side effect reversible — nothing does. It converted "90 irreversible" into "40 irreversible and 50 cancellable", and it gave you a table to run <code>DELETE ... WHERE da_gui_luc IS NULL</code> against, which is a place to stand that the direct-send version simply does not have.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">direct send</span><span class="lz-t">90 / 90 gone</span><span class="lz-d">the send happens inside the request; by the time you know, it is delivered</span></div>
<div class="lz-step"><span class="lz-k">outbox, worker idle</span><span class="lz-t">0 / 90 gone</span><span class="lz-d">best case; only true if you catch it before the first drain</span></div>
<div class="lz-step"><span class="lz-k">outbox, worker running</span><span class="lz-t">40 / 90 gone</span><span class="lz-d">the realistic case: damage proportional to drain rate × detection time</span></div>
</div>

<h3>A second thing the outbox buys, for free</h3>
<p>Look again at the direct-send version. The email goes out <em>after</em> the insert but <em>inside</em> the same request. If the process is killed between the two — a deploy, an OOM kill, a crash — you get an order with no email, or an email for an order that was rolled back by the database. The outbox makes both impossible, because the intent and the data commit together or not at all:</p>

<pre><code>await c.query("begin");
const r = await c.query("insert into dh (email) values (\$1) returning id", [email]);
<span class="tok-comment">// Y DINH gui nam CUNG giao dich voi don hang</span>
await c.query("insert into hop_gui (den, than) values (\$1, \$2)",
              [email, &#96;don \${r.rows[0].id} da dat&#96;]);
await c.query("commit");</code></pre>

<p>Either both rows exist or neither does. There is no third state, and there is no network call inside the transaction to make it slow or flaky.</p>

<div class="pitfall">
<p><strong>Trap — the outbox worker will send something twice.</strong> Look at the worker loop: it sends, then marks the row sent. If it dies between those two steps, the next run sends again. Making it mark-then-send just trades duplicates for silent losses, which is worse. The real fix is on the receiving side: an idempotency key on the send, so the provider recognises the retry and delivers once. Every serious email and payment API supports this, and it is the single most important header in the request. In my rig the two statements are 4 ms apart, so I never observed a duplicate — that does not mean the window is not there, it means my measurement could not see it. Assume it is there.</p>
</div>

<h3>The decision this forces you to make early</h3>
<p>You cannot bolt an outbox on during an incident. The question to answer while you are calm is: <em>which side effects in my app leave the machine, and which of those would I want back?</em> Usually the list is short — payment capture, confirmation email, external webhook, push notification — and everything else is internal and repairable. Those few get the outbox and an idempotency key. The rest can stay inline.</p>

<div class="kv-grid">
<div class="kv"><span class="k">worth an outbox</span><span class="v">anything a customer or another company sees, and anything that moves money</span></div>
<div class="kv"><span class="k">not worth it</span><span class="v">internal cache invalidation, log lines, metrics — cheap to redo, harmless to lose</span></div>
<div class="kv"><span class="k">the give-away</span><span class="v">if undoing it requires an apology, it belongs in the outbox</span></div>
<div class="kv"><span class="k">measured cost</span><span class="v">one table, one worker loop, one extra INSERT per request inside a transaction you were opening anyway</span></div>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Chris Richardson — Pattern: Transactional outbox</span><span class="lc-sub">microservices.io/patterns/data/transactional-outbox.html — the canonical write-up of the pattern measured above, including the at-least-once delivery consequence.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Stripe — idempotent requests</span><span class="lc-sub">docs.stripe.com/api/idempotent_requests — the clearest specification of an idempotency key anywhere, and the reason the duplicate-send pitfall above is solvable rather than fundamental.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Amazon S3 — using versioning in buckets</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html — the one one-way door on the list above that you can genuinely close in advance, by turning versioning on before you need it.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — transactions, and what commits together</span><span class="lc-sub">/courses/postgresql/learn${REF} — why the two inserts above are genuinely atomic, and what SELECT ... FOR UPDATE SKIP LOCKED does for a worker queue.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Những CÁNH CỬA MỘT CHIỀU</h2>
<p class="lead">6.3 nói về dữ liệu bạn SỞ HỮU nên sửa được, dù đau tới đâu. Bài này nói về những thứ bản hỏng đã làm mà chúng đã RỜI KHỎI máy bạn — và không có truy vấn nào sửa được chúng.</p>

<h3>Phép đo</h3>
<p>Một máy chủ mail giả ở cổng 3310 nối thêm mọi thư nó nhận vào một tệp. Một ứng dụng mà mỗi đơn hàng thì chèn một dòng VÀ gửi một email xác nhận trong CÙNG request. Rồi bản hỏng chạy, và ta lùi bằng cách xoá sạch những gì nó ghi:</p>

<div class="out">=== ban HONG len song, 90 don ===
  cua so: 849 ms
dong trong CSDL: 90
thu DA GUI DI  : 90

=== LUI: xoa sach dong hong trong CSDL ===
dong trong CSDL sau lui: 0
thu DA GUI DI sau lui: 90   ← KHONG DOI</div>

<p>Cơ sở dữ liệu về không. Hộp thư vẫn 90. Toàn bộ bài học nằm trong bốn dòng đó: một cú lùi là một phát biểu về TIẾN TRÌNH của bạn và DỮ LIỆU của bạn, còn thế giới bên ngoài chưa bao giờ tham gia vào phát biểu ấy.</p>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">lùi được</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">mã nào chạy</div><div class="lz-nsub">140 ms (6.1)</div></div></div>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">hình dạng lược đồ</div><div class="lz-nsub">đôi khi, và chỉ khi bạn đã tính trước (6.2)</div></div></div>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">dòng bạn đã ghi</div><div class="lz-nsub">sửa được nếu nhận dạng được chúng (6.3)</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">một chiều</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">một email đã phát</div><div class="lz-nsub">đo thật: gửi 90, sau khi lùi vẫn 90</div></div></div>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">một khoản tiền đã thu</div><div class="lz-nsub">hoàn tiền là một giao dịch MỚI, không phải hoàn tác — và nó hiện trên sao kê</div></div></div>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">một webhook đã bắn</div><div class="lz-nsub">hệ thống của công ty khác đã hành động theo nó rồi</div></div></div>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">một thông báo đẩy</div><div class="lz-nsub">nằm trên màn hình khoá, đã bị đọc</div></div></div>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">một tệp đã xoá khỏi kho đối tượng</div><div class="lz-nsub">mất, trừ khi versioning đã bật TỪ TRƯỚC lần deploy</div></div></div>
</div>
</div>

<h3>Cái hình dạng thu hẹp được thiệt hại</h3>
<p>Hộp gửi giao dịch: thay vì gửi ngay trong request, hãy ghi Ý ĐỊNH vào một bảng trong CÙNG giao dịch với dữ liệu nghiệp vụ, rồi để một thợ riêng đi phát. Vẫn 90 đơn ấy, thợ chưa khởi động:</p>

<div class="out">=== ban HONG len song, 90 don — THO CHUA CHAY ===
don: 90
y dinh gui xep hang: 90
thu DA GUI DI: 0   ← chua ai nhan gi

=== LUI trong khi hang doi chua chay ===
y dinh con lai: 0
thu DA GUI DI: 0   ← VAN 0. Lui ket qua SACH.</div>

<p>Không lá thư nào. Cú lùi sạch vì việc gửi CHƯA xảy ra — ý định vẫn còn là một DÒNG, mà dòng thì đúng là thứ mà lùi bản chạm tới được.</p>

<div class="callout warn">
<p><strong>Kết quả đó đẹp quá đáng, nên đây là kết quả thành thật.</strong> Cú lùi sạch ở trên phụ thuộc vào việc con thợ CHƯA BAO GIỜ chạy. Trên production nó chạy liên tục. Đo lại, với con thợ rút mười cái một lượt và cú lùi xảy ra sau 1,6 giây:</p>
</div>

<div class="out">=== khoanh khac LUI ===
da danh dau gui   : 40
chua gui, HUY DUOC: 50
thu that su da roi khoi may: 40</div>

<p>Bốn mươi đi rồi, năm mươi cứu kịp. Hộp gửi KHÔNG làm cho tác dụng phụ trở nên lùi được — chẳng gì làm được thế. Nó biến "90 cái không lùi được" thành "40 cái không lùi được và 50 cái huỷ được", và nó cho bạn một cái BẢNG để chạy <code>DELETE ... WHERE da_gui_luc IS NULL</code> lên đó, một chỗ đứng mà bản gửi-thẳng đơn giản là không có.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">gửi thẳng</span><span class="lz-t">mất 90 / 90</span><span class="lz-d">việc gửi nằm trong request; tới lúc bạn biết thì nó đã phát rồi</span></div>
<div class="lz-step"><span class="lz-k">hộp gửi, thợ ngủ</span><span class="lz-t">mất 0 / 90</span><span class="lz-d">ca tốt nhất; chỉ đúng nếu bạn bắt được trước lượt rút đầu tiên</span></div>
<div class="lz-step"><span class="lz-k">hộp gửi, thợ đang chạy</span><span class="lz-t">mất 40 / 90</span><span class="lz-d">ca thực tế: thiệt hại tỷ lệ với tốc độ rút × thời gian phát hiện</span></div>
</div>

<h3>Thứ thứ hai hộp gửi mua được, miễn phí</h3>
<p>Nhìn lại bản gửi thẳng. Email đi ra <em>SAU</em> lệnh chèn nhưng <em>TRONG</em> cùng một request. Nếu tiến trình bị giết giữa hai bước đó — một lần deploy, một cú OOM, một cú sập — bạn được một đơn hàng không có email, hoặc một email cho một đơn hàng mà cơ sở dữ liệu đã cuộn lại. Hộp gửi làm cả hai chuyện đó bất khả, vì ý định và dữ liệu cùng chốt hoặc cùng không:</p>

<pre><code>await c.query("begin");
const r = await c.query("insert into dh (email) values (\$1) returning id", [email]);
<span class="tok-comment">// Y DINH gui nam CUNG giao dich voi don hang</span>
await c.query("insert into hop_gui (den, than) values (\$1, \$2)",
              [email, &#96;don \${r.rows[0].id} da dat&#96;]);
await c.query("commit");</code></pre>

<p>Hoặc cả hai dòng cùng tồn tại, hoặc không dòng nào. Không có trạng thái thứ ba, và không có lời gọi mạng nào nằm trong giao dịch để làm nó chậm hay chập chờn.</p>

<div class="pitfall">
<p><strong>Bẫy — con thợ hộp gửi SẼ có lúc gửi hai lần.</strong> Nhìn vòng lặp của nó: nó gửi, RỒI mới đánh dấu dòng là đã gửi. Nếu nó chết giữa hai bước ấy, lượt sau gửi lại. Đổi thành đánh-dấu-rồi-gửi chỉ là đổi trùng lặp lấy MẤT ÂM THẦM, mà thế còn tệ hơn. Cách chữa thật nằm ở phía NHẬN: một khoá bất biến trên lời gửi, để nhà cung cấp nhận ra đây là lượt thử lại và chỉ phát một lần. Mọi API email và thanh toán nghiêm túc đều hỗ trợ, và đó là cái header quan trọng nhất trong lời gọi. Trong bộ đo của tôi hai câu lệnh cách nhau 4 ms nên tôi chưa bao giờ quan sát được một cú trùng — điều đó KHÔNG có nghĩa là cửa sổ ấy không tồn tại, nó có nghĩa là phép đo của tôi không nhìn thấy được. Cứ coi như nó có.</p>
</div>

<h3>Cái quyết định chuyện này bắt bạn phải ra sớm</h3>
<p>Bạn không lắp được hộp gửi vào giữa lúc đang có sự cố. Câu cần trả lời lúc còn bình tĩnh là: <em>tác dụng phụ nào trong ứng dụng của tôi RỜI KHỎI máy, và trong số đó cái nào tôi sẽ muốn lấy lại?</em> Thường danh sách rất ngắn — thu tiền, email xác nhận, webhook ra ngoài, thông báo đẩy — còn mọi thứ khác là nội bộ và sửa được. Chỉ vài cái đó được hộp gửi và một khoá bất biến. Phần còn lại cứ nằm trong dòng chảy.</p>

<div class="kv-grid">
<div class="kv"><span class="k">đáng làm hộp gửi</span><span class="v">bất cứ thứ gì khách hàng hay công ty khác NHÌN THẤY, và bất cứ thứ gì làm TIỀN dịch chuyển</span></div>
<div class="kv"><span class="k">không đáng</span><span class="v">xoá bộ đệm nội bộ, dòng log, số đo — làm lại thì rẻ, mất thì vô hại</span></div>
<div class="kv"><span class="k">dấu hiệu nhận biết</span><span class="v">nếu hoàn tác nó đòi hỏi một lời xin lỗi, thì chỗ của nó là hộp gửi</span></div>
<div class="kv"><span class="k">giá đo được</span><span class="v">một cái bảng, một vòng lặp thợ, một câu INSERT thêm mỗi request bên trong một giao dịch vốn dĩ bạn đã mở</span></div>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Chris Richardson — Pattern: Transactional outbox</span><span class="lc-sub">microservices.io/patterns/data/transactional-outbox.html — bài viết kinh điển về khuôn mẫu vừa đo ở trên, kể cả hệ quả phát-ít-nhất-một-lần.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Stripe — idempotent requests</span><span class="lc-sub">docs.stripe.com/api/idempotent_requests — bản đặc tả rõ nhất về khoá bất biến ở bất cứ đâu, và là lý do cái bẫy gửi-trùng ở trên giải được chứ không phải bản chất.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Amazon S3 — dùng versioning trong bucket</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html — cánh cửa một chiều DUY NHẤT trong danh sách trên mà bạn thật sự đóng trước được, bằng cách bật versioning từ khi chưa cần.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — giao dịch, và cái gì chốt cùng nhau</span><span class="lc-sub">/courses/postgresql/learn${REF} — vì sao hai câu chèn ở trên thật sự nguyên tử, và SELECT ... FOR UPDATE SKIP LOCKED làm được gì cho một hàng đợi thợ.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 6.5 ─────────────────────────── */
    {
      title: '6.5 — Proving the rollback reached the user|||6.5 — Chứng minh cú lùi ĐÃ TỚI người dùng',
      slug: 'deploy-6-5-chung-minh',
      type: 'VIDEO',
      description: 'Lùi bản xong, ứng dụng trả v1 qua cửa sau — và người dùng vẫn nhận v3 suốt năm phút, vì bộ đệm phía trước không biết gì. Đo thật, rồi viết cái script bắt được đúng ca đó bằng mã thoát 3.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>Proving the rollback reached the user</h2>
<p class="lead">A rollback you cannot prove is a rollback you did not do. 6.2 showed a health check saying yes while the app was broken; this one shows the app saying yes while the user is still being served the version you just rolled back.</p>

<h3>The measurement</h3>
<p>nginx 1.24.0 in front of the app with a five-minute cache, which is a conservative setting for a page that does not change often. Version 3 is live and its response is in the cache:</p>

<div class="out">=== 1. ban v3 dang phuc vu, bo dem da giu ban tra loi cua no ===
x-ban: v3 X-Cache: HIT
x-ban: v3 X-Cache: HIT
x-ban: v3 X-Cache: HIT</div>

<p>Now roll back to v1, with the fast, correct, verified procedure from 6.1:</p>

<div class="out">=== 2. LUI ve v1 (140ms, sach se) ===
  cho san sang: 128 ms
  TONG      : 142 ms   → dang phuc vu: v1

=== 3. Hoi qua CUA SAU (thang app): ===
   v1</div>

<p>The app is serving v1. The rollback script is satisfied, and by every check it runs, it is right. Now ask the way a user asks — through the front door:</p>

<div class="out">=== 4. Hoi qua CUA TRUOC (qua bo dem) — nguoi dung thay gi? ===
x-ban: v3 X-Cache: HIT
x-ban: v3 X-Cache: HIT
x-ban: v3 X-Cache: HIT
   than: v3</div>

<p>Every user gets v3 — the version you rolled back — for the next five minutes. The incident continues while your dashboard says it is over, which is the specific kind of bad that costs the most time: you have stopped looking.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">back door</span><span class="lz-t">127.0.0.1:3300 → v1</span><span class="lz-d">what the deploy script checks, and it is true</span></div>
<div class="lz-step"><span class="lz-k">front door</span><span class="lz-t">127.0.0.1:3320 → v3</span><span class="lz-d">what the user gets, for <code>proxy_cache_valid 200 5m</code></span></div>
</div>

<h3>The fix, and its cost</h3>
<p>nginx open-source has no purge command — <code>proxy_cache_purge</code> is a commercial feature. The version everyone actually uses is to delete the cache directory and reload:</p>

<pre><code>rm -rf /srv/vps/lui/nx/cache/*
/usr/sbin/nginx -s reload -c .../nginx.conf -p ...</code></pre>

<div class="out">  mat 7 ms
  qua cua truoc bay gio: x-ban: v1 X-Cache: MISS
  than: v1</div>

<p>Seven milliseconds. It is crude — it throws away every cached entry, not just the stale ones, so the next few requests all go to the origin — but on a rollback that is exactly what you want, and 7 ms of bluntness beats five minutes of serving the broken version.</p>

<div class="pitfall">
<p><strong>Trap — the cache in front of you may not be yours.</strong> My measurement is one nginx on the same machine, so <code>rm -rf</code> reaches it. In production the chain is longer: nginx, then possibly a CDN, then the browser. A CDN needs its own purge API call. The browser is worse — if you served an HTML page with <code>Cache-Control: max-age=3600</code>, there is no command on earth that reaches it, and the only remedy is waiting. This is the argument for <code>Cache-Control: no-store</code> on HTML documents and long caching only on content-hashed assets, which the Nginx course measures in detail. A rollback plan that cannot reach a cache is not a plan.</p>
</div>

<h3>The script that catches this</h3>
<p>Everything in this chapter comes together in one shape: <strong>verify through the front door, using the address the user uses, and check the version rather than the status code.</strong></p>

<pre><code>#!/bin/bash
set -euo pipefail
GOC=/srv/vps/lui
CUA_TRUOC=http://127.0.0.1:3320      <span class="tok-comment"># dung dia chi NGUOI DUNG di vao</span>

DICH=\${1:?dung: lui-an-toan.sh &lt;ten-ban&gt;}
[ -d "\$GOC/ban/\$DICH" ] || { echo "KHONG co ban '\$DICH'. Co: \$(ls "\$GOC/ban"|tr '\\n' ' ')" >&amp;2; exit 2; }

DANG=\$(basename "\$(readlink -f "\$GOC/hien-tai")")
[ "\$DANG" != "\$DICH" ] || { echo "dang chay '\$DICH' roi, khong lui" >&amp;2; exit 0; }

exec 9>/var/lock/lui.lock
flock -w 30 9 || { echo "co lan lui khac dang chay" >&amp;2; exit 1; }

<span class="tok-comment"># 1) doi symlink NGUYEN TU</span>
ln -sfn "\$GOC/ban/\$DICH" "\$GOC/ht.moi" &amp;&amp; mv -Tf "\$GOC/ht.moi" "\$GOC/hien-tai"
<span class="tok-comment"># 2) khoi dong lai — 9>&amp;- de tien trinh con KHONG giu cai khoa (bay o 3.5)</span>
for p in \$(ss -ltnp 2>/dev/null|grep ":3300 "|grep -o 'pid=[0-9]*'|cut -d= -f2); do kill -TERM "\$p" 2>/dev/null||true; done
CONG=3300 setsid nohup node "\$GOC/hien-tai/app.mjs" >/tmp/lui-app.log 2>&amp;1 &lt;/dev/null 9>&amp;- &amp;
<span class="tok-comment"># 3) doi ung dung THAT SU tra loi</span>
san=0; for i in \$(seq 1 150); do
  [ "\$(curl -s -o /dev/null -w '%{http_code}' --max-time 1 http://127.0.0.1:3300/health)" = "200" ] &amp;&amp; { san=1; break; }
  sleep 0.02
done
[ "\$san" = 1 ] || { echo "  ban \$DICH KHONG len duoc — lui THAT BAI" >&amp;2; exit 1; }
<span class="tok-comment"># 4) DON BO DEM — neu khong, nguoi dung van thay ban hong</span>
rm -rf "\${BO_DEM:?}"/* 2>/dev/null || true
/usr/sbin/nginx -s reload -c "\$GOC/nx/nginx.conf" -p "\$GOC/nx" 2>/dev/null
sleep 0.4
<span class="tok-comment"># 5) KIEM QUA CUA TRUOC — day moi la bang chung</span>
THAY=\$(curl -s --max-time 3 "\$CUA_TRUOC/" | tr -d '\\n')
if [ "\$THAY" != "\$DICH" ]; then
  echo "  ✗ CUA TRUOC van tra '\$THAY', khong phai '\$DICH'" >&amp;2; exit 3
fi
echo "  ✓ cua truoc tra '\$THAY'"</code></pre>

<p>Run against the live rig:</p>

<div class="out">=== chay that ===
lui: v1 → v3
  ✓ cua truoc tra 'v3' sau 558 ms

=== lui tiep ve v2 ===
lui: v3 → v2
  ✓ cua truoc tra 'v2' sau 592 ms

=== lui ve ban khong ton tai ===
KHONG co ban 'v9'. Co: v1 v2 v3
  ma thoat: 2</div>

<h3>Testing the test</h3>
<p>A check nobody has seen fail is not a check. Here is the same script with step 4 commented out — the version that rolls back correctly and forgets the cache:</p>

<div class="out">bo dem dang giu: x-ban: v2 X-Cache: HIT
=== chay ban QUEN DON BO DEM: lui v2 → v1 ===
lui: v2 → v1
  ✗ CUA TRUOC van tra 'v2', khong phai 'v1' — LUI CHUA TOI TAY NGUOI DUNG
  ma thoat: 3
  ung dung that su dang chay: v1
  nhung nguoi dung thay    : v2</div>

<p>Exit code 3, and a message that names both halves of the discrepancy. That is the difference between a script that reports what it did and a script that reports what happened.</p>

<div class="callout ok">
<p><strong>Four properties worth copying.</strong> <strong>(1)</strong> It refuses a target that does not exist, and prints the ones that do. <strong>(2)</strong> It exits 0 if you ask it to roll back to what is already running — rollbacks get run twice by panicking humans. <strong>(3)</strong> It takes a lock, and closes fd 9 in the child so the app cannot inherit and hold it — the bug from Lesson 3.5 that deadlocked my own swap script. <strong>(4)</strong> Its final check goes through the user address and compares the <em>version</em>, not the status code.</p>
</div>

<h3>Roll back, or roll forward?</h3>
<p>Everything so far assumes rolling back is right. Often it is not. The numbers from this chapter make the decision concrete:</p>

<div class="kv-grid">
<div class="kv"><span class="k">roll back when</span><span class="v">the previous release works against today&#39;s schema (6.2), and the bad version is still writing damage every second (6.3)</span></div>
<div class="kv"><span class="k">roll forward when</span><span class="v">the fix is small and certain, and rolling back would strand data the new version wrote in a shape the old one cannot read</span></div>
<div class="kv"><span class="k">the deciding number</span><span class="v">140 ms (6.1) against however long a fix takes to write, review and deploy — which is minutes at best</span></div>
<div class="kv"><span class="k">the trap</span><span class="v">rolling forward because it feels more professional. It is a bet that you have diagnosed correctly under pressure; the rollback is not a bet.</span></div>
</div>

<p>A useful default: roll back first, then fix at your own pace. Rolling back is not an admission of failure, it is the cheapest possible way to stop the clock — and this chapter has measured exactly how cheap: 140 milliseconds of process time, 592 milliseconds including the proof.</p>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — ngx_http_proxy_module, proxy_cache_valid</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_valid — the directive that produced the five-minute window measured above, and the note that <code>proxy_cache_purge</code> is commercial-only.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 9111 — HTTP Caching</span><span class="lc-sub">rfc-editor.org/rfc/rfc9111 — §5.2 on Cache-Control, and why a response already in a browser cache cannot be recalled by the origin.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">flock(1) and flock(2)</span><span class="lc-sub">man 1 flock — including the inheritance behaviour across fork that made <code>9&gt;&amp;-</code> necessary in the script above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — the proxy cache, and what it actually stores</span><span class="lc-sub">/courses/nginx/learn${REF} — cache keys, X-Cache statuses, and the header rules that decide whether a response is cacheable at all.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>Chứng minh cú lùi ĐÃ TỚI người dùng</h2>
<p class="lead">Một cú lùi mà bạn không chứng minh được là một cú lùi bạn chưa làm. 6.2 cho thấy chốt kiểm sức khoẻ nói CÓ trong khi ứng dụng đang hỏng; bài này cho thấy ỨNG DỤNG nói CÓ trong khi người dùng vẫn đang được phục vụ đúng cái bản bạn vừa lùi đi.</p>

<h3>Phép đo</h3>
<p>nginx 1.24.0 đứng trước ứng dụng với bộ đệm năm phút, một thiết lập dè dặt cho một trang không đổi thường xuyên. Bản 3 đang sống và bản trả lời của nó nằm trong bộ đệm:</p>

<div class="out">=== 1. ban v3 dang phuc vu, bo dem da giu ban tra loi cua no ===
x-ban: v3 X-Cache: HIT
x-ban: v3 X-Cache: HIT
x-ban: v3 X-Cache: HIT</div>

<p>Giờ lùi về v1, bằng quy trình nhanh, đúng, có kiểm chứng của bài 6.1:</p>

<div class="out">=== 2. LUI ve v1 (140ms, sach se) ===
  cho san sang: 128 ms
  TONG      : 142 ms   → dang phuc vu: v1

=== 3. Hoi qua CUA SAU (thang app): ===
   v1</div>

<p>Ứng dụng đang phục vụ v1. Script lùi bản hài lòng, và theo mọi phép kiểm nó chạy thì nó ĐÚNG. Giờ hỏi theo cách người dùng hỏi — qua CỬA TRƯỚC:</p>

<div class="out">=== 4. Hoi qua CUA TRUOC (qua bo dem) — nguoi dung thay gi? ===
x-ban: v3 X-Cache: HIT
x-ban: v3 X-Cache: HIT
x-ban: v3 X-Cache: HIT
   than: v3</div>

<p>MỌI người dùng nhận v3 — cái bản bạn vừa lùi đi — trong năm phút tới. Sự cố vẫn tiếp diễn trong lúc bảng điều khiển của bạn nói nó đã xong, mà đó đúng là cái kiểu tệ tốn thời gian nhất: bạn đã thôi nhìn.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">cửa sau</span><span class="lz-t">127.0.0.1:3300 → v1</span><span class="lz-d">thứ script deploy kiểm, và nó đúng</span></div>
<div class="lz-step"><span class="lz-k">cửa trước</span><span class="lz-t">127.0.0.1:3320 → v3</span><span class="lz-d">thứ người dùng nhận, suốt <code>proxy_cache_valid 200 5m</code></span></div>
</div>

<h3>Cách chữa, và giá của nó</h3>
<p>nginx bản mã nguồn mở KHÔNG có lệnh xoá bộ đệm — <code>proxy_cache_purge</code> là tính năng thương mại. Bản mà ai cũng thật sự dùng là xoá thư mục bộ đệm rồi nạp lại:</p>

<pre><code>rm -rf /srv/vps/lui/nx/cache/*
/usr/sbin/nginx -s reload -c .../nginx.conf -p ...</code></pre>

<div class="out">  mat 7 ms
  qua cua truoc bay gio: x-ban: v1 X-Cache: MISS
  than: v1</div>

<p>Bảy mili giây. Nó THÔ — nó vứt hết mọi mục trong bộ đệm chứ không riêng mục cũ, nên vài request kế tiếp đều phải đi tới gốc — nhưng trong một cú lùi thì đó đúng là thứ bạn muốn, và 7 ms thô bạo còn hơn năm phút phục vụ bản hỏng.</p>

<div class="pitfall">
<p><strong>Bẫy — cái bộ đệm đứng trước bạn có thể KHÔNG phải của bạn.</strong> Phép đo của tôi là một con nginx trên cùng cái máy, nên <code>rm -rf</code> với tới được. Trên production chuỗi ấy dài hơn: nginx, rồi có thể một CDN, rồi trình duyệt. Một CDN cần lời gọi API xoá bộ đệm riêng của nó. Trình duyệt còn tệ hơn — nếu bạn đã phục vụ một trang HTML kèm <code>Cache-Control: max-age=3600</code>, thì không có lệnh nào trên đời với tới nó được, và cách chữa duy nhất là CHỜ. Đây là lý lẽ cho <code>Cache-Control: no-store</code> trên tài liệu HTML và chỉ đệm dài trên các tài nguyên có mã băm nội dung, thứ khoá Nginx đo kỹ. Một kế hoạch lùi bản không với tới được bộ đệm thì không phải kế hoạch.</p>
</div>

<h3>Cái script bắt được chuyện này</h3>
<p>Mọi thứ trong chương này gộp lại thành một hình dạng: <strong>kiểm qua CỬA TRƯỚC, bằng đúng địa chỉ người dùng đi vào, và kiểm PHIÊN BẢN chứ không phải mã trạng thái.</strong></p>

<pre><code>#!/bin/bash
set -euo pipefail
GOC=/srv/vps/lui
CUA_TRUOC=http://127.0.0.1:3320      <span class="tok-comment"># dung dia chi NGUOI DUNG di vao</span>

DICH=\${1:?dung: lui-an-toan.sh &lt;ten-ban&gt;}
[ -d "\$GOC/ban/\$DICH" ] || { echo "KHONG co ban '\$DICH'. Co: \$(ls "\$GOC/ban"|tr '\\n' ' ')" >&amp;2; exit 2; }

DANG=\$(basename "\$(readlink -f "\$GOC/hien-tai")")
[ "\$DANG" != "\$DICH" ] || { echo "dang chay '\$DICH' roi, khong lui" >&amp;2; exit 0; }

exec 9>/var/lock/lui.lock
flock -w 30 9 || { echo "co lan lui khac dang chay" >&amp;2; exit 1; }

<span class="tok-comment"># 1) doi symlink NGUYEN TU</span>
ln -sfn "\$GOC/ban/\$DICH" "\$GOC/ht.moi" &amp;&amp; mv -Tf "\$GOC/ht.moi" "\$GOC/hien-tai"
<span class="tok-comment"># 2) khoi dong lai — 9>&amp;- de tien trinh con KHONG giu cai khoa (bay o 3.5)</span>
for p in \$(ss -ltnp 2>/dev/null|grep ":3300 "|grep -o 'pid=[0-9]*'|cut -d= -f2); do kill -TERM "\$p" 2>/dev/null||true; done
CONG=3300 setsid nohup node "\$GOC/hien-tai/app.mjs" >/tmp/lui-app.log 2>&amp;1 &lt;/dev/null 9>&amp;- &amp;
<span class="tok-comment"># 3) doi ung dung THAT SU tra loi</span>
san=0; for i in \$(seq 1 150); do
  [ "\$(curl -s -o /dev/null -w '%{http_code}' --max-time 1 http://127.0.0.1:3300/health)" = "200" ] &amp;&amp; { san=1; break; }
  sleep 0.02
done
[ "\$san" = 1 ] || { echo "  ban \$DICH KHONG len duoc — lui THAT BAI" >&amp;2; exit 1; }
<span class="tok-comment"># 4) DON BO DEM — neu khong, nguoi dung van thay ban hong</span>
rm -rf "\${BO_DEM:?}"/* 2>/dev/null || true
/usr/sbin/nginx -s reload -c "\$GOC/nx/nginx.conf" -p "\$GOC/nx" 2>/dev/null
sleep 0.4
<span class="tok-comment"># 5) KIEM QUA CUA TRUOC — day moi la bang chung</span>
THAY=\$(curl -s --max-time 3 "\$CUA_TRUOC/" | tr -d '\\n')
if [ "\$THAY" != "\$DICH" ]; then
  echo "  ✗ CUA TRUOC van tra '\$THAY', khong phai '\$DICH'" >&amp;2; exit 3
fi
echo "  ✓ cua truoc tra '\$THAY'"</code></pre>

<p>Chạy trên bộ đo đang sống:</p>

<div class="out">=== chay that ===
lui: v1 → v3
  ✓ cua truoc tra 'v3' sau 558 ms

=== lui tiep ve v2 ===
lui: v3 → v2
  ✓ cua truoc tra 'v2' sau 592 ms

=== lui ve ban khong ton tai ===
KHONG co ban 'v9'. Co: v1 v2 v3
  ma thoat: 2</div>

<h3>Kiểm lại chính bộ kiểm</h3>
<p>Một phép kiểm chưa ai thấy nó HỎNG thì không phải phép kiểm. Đây là đúng script đó với bước 4 bị chú thích đi — bản lùi đúng nhưng QUÊN bộ đệm:</p>

<div class="out">bo dem dang giu: x-ban: v2 X-Cache: HIT
=== chay ban QUEN DON BO DEM: lui v2 → v1 ===
lui: v2 → v1
  ✗ CUA TRUOC van tra 'v2', khong phai 'v1' — LUI CHUA TOI TAY NGUOI DUNG
  ma thoat: 3
  ung dung that su dang chay: v1
  nhung nguoi dung thay    : v2</div>

<p>Mã thoát 3, và một dòng gọi tên CẢ HAI nửa của chỗ vênh. Đó là khác biệt giữa một script báo cáo nó ĐÃ LÀM GÌ và một script báo cáo chuyện gì ĐÃ XẢY RA.</p>

<div class="callout ok">
<p><strong>Bốn tính chất đáng chép lại.</strong> <strong>(1)</strong> Nó TỪ CHỐI một đích không tồn tại, và in ra những đích CÓ. <strong>(2)</strong> Nó thoát 0 nếu bạn bảo nó lùi về đúng cái đang chạy — script lùi bản hay bị con người đang hoảng chạy hai lần. <strong>(3)</strong> Nó lấy một cái khoá, và đóng fd 9 trong tiến trình con để ứng dụng không thừa kế rồi giữ mãi cái khoá đó — đúng con bọ ở Bài 3.5 từng làm chính script tráo của tôi tự kẹt. <strong>(4)</strong> Phép kiểm cuối của nó đi qua ĐỊA CHỈ NGƯỜI DÙNG và so PHIÊN BẢN, không so mã trạng thái.</p>
</div>

<h3>Lùi lại, hay đi tới?</h3>
<p>Mọi thứ tới giờ giả định lùi lại là đúng. Nhiều khi không. Các con số của chương này làm cho quyết định đó cụ thể:</p>

<div class="kv-grid">
<div class="kv"><span class="k">lùi lại khi</span><span class="v">bản trước còn chạy được với lược đồ hôm nay (6.2), và bản hỏng vẫn đang ghi thiệt hại từng giây (6.3)</span></div>
<div class="kv"><span class="k">đi tới khi</span><span class="v">cách sửa nhỏ và chắc chắn, và lùi lại sẽ bỏ mắc kẹt dữ liệu mà bản mới đã ghi theo hình dạng bản cũ không đọc được</span></div>
<div class="kv"><span class="k">con số quyết định</span><span class="v">140 ms (6.1) so với thời gian viết-duyệt-deploy một cách sửa — mà cái đó ít nhất cũng tính bằng phút</span></div>
<div class="kv"><span class="k">cái bẫy</span><span class="v">đi tới vì nó nghe CHUYÊN NGHIỆP hơn. Đó là một canh bạc rằng bạn đã chẩn đoán đúng dưới áp lực; còn lùi lại thì KHÔNG phải canh bạc.</span></div>
</div>

<p>Một mặc định hữu ích: lùi trước, rồi sửa theo nhịp của mình. Lùi bản không phải là thừa nhận thất bại, nó là cách rẻ nhất có thể để DỪNG ĐỒNG HỒ — và chương này đã đo chính xác nó rẻ tới đâu: 140 mili giây thời gian tiến trình, 592 mili giây tính cả phần chứng minh.</p>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — ngx_http_proxy_module, proxy_cache_valid</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_valid — chỉ thị đã tạo ra cửa sổ năm phút đo ở trên, và ghi chú rằng <code>proxy_cache_purge</code> chỉ có ở bản thương mại.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 9111 — HTTP Caching</span><span class="lc-sub">rfc-editor.org/rfc/rfc9111 — §5.2 về Cache-Control, và vì sao một bản trả lời đã nằm trong bộ đệm trình duyệt thì máy chủ gốc KHÔNG gọi về được.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">flock(1) và flock(2)</span><span class="lc-sub">man 1 flock — kể cả hành vi thừa kế qua fork, thứ làm cho <code>9&gt;&amp;-</code> trở thành bắt buộc trong script ở trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — bộ đệm proxy, và nó thật ra lưu cái gì</span><span class="lc-sub">/courses/nginx/learn${REF} — khoá bộ đệm, các trạng thái X-Cache, và luật header quyết định một bản trả lời có đệm được hay không.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 6.6 ─────────────────────────── */
    {
      title: '6.6 — Quiz: rollback|||6.6 — Quiz: lùi bản',
      slug: 'deploy-6-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về một cú lùi 140 mili giây, một chốt kiểm sức khoẻ nói dối, 240 dòng không quay lại, 90 lá thư đã gửi, và một bộ đệm phục vụ bản hỏng thêm năm phút sau khi bạn tưởng đã xong.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.6</span>
<h2>Quiz: rollback</h2>
<p class="lead">Eight questions from the chapter where the fastest operation is the destructive one, and the successful rollback is the one that fooled you.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> Flipping a release symlink measured 5.1–5.7 ms, and a complete rollback including restart and readiness was 140 ms — against 1,994 ms to rebuild the same release from source on a deliberately tiny 83-package project, where the real repository has 897 and 1,159 packages (6.1). Rolling code back while leaving a renamed column in place produced <code>/health</code> = 200 and every real endpoint = 500, because health checks are kept shallow on purpose (6.2). A bad version live for 18.6 seconds wrote 240 poisoned rows that the rollback did not touch, and cleaning up by time window caught 60 innocent rows to fix 180; meanwhile <code>DROP COLUMN</code> on 200,000 rows took <strong>1.287 ms</strong> — two thousand times faster than the harmless <code>ADD COLUMN ... gen_random_uuid()</code> from Chapter 5 — left the table at 20 MB with the phone numbers still readable in the raw heap, and erased them only at <code>VACUUM FULL</code>, 239 ms later (6.3). Ninety orders sent ninety emails; deleting all ninety rows left all ninety emails delivered, while a transactional outbox turned that into 40 irreversible and 50 cancellable (6.4). And a correct 140 ms rollback still served the rolled-back version to every user for five minutes, because a proxy cache sat in front of it; a 7 ms purge fixed it, and a front-door version check caught the omission with exit code 3 (6.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.6</span>
<h2>Quiz: lùi bản</h2>
<p class="lead">Tám câu ra từ cái chương mà thao tác NHANH NHẤT lại là thao tác phá huỷ, và cú lùi THÀNH CÔNG lại là cú đã lừa được bạn.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Dời một symlink bản phát hành đo được 5,1–5,7 ms, và một cú lùi TRỌN VẸN kể cả khởi động lại và chờ sẵn sàng là 140 ms — so với 1.994 ms để dựng lại đúng bản đó từ nguồn trên một dự án cố tình làm nhỏ 83 gói, trong khi kho thật có 897 và 1.159 gói (6.1). Lùi mã mà để nguyên một cột đã đổi tên cho ra <code>/health</code> = 200 còn MỌI endpoint thật = 500, vì chốt kiểm sức khoẻ được giữ NÔNG có chủ đích (6.2). Một bản hỏng sống 18,6 giây ghi ra 240 dòng nhiễm độc mà cú lùi không đụng tới, và dọn theo cửa sổ thời gian thì đụng 60 dòng vô tội để sửa 180; trong khi đó <code>DROP COLUMN</code> trên 200.000 dòng mất <strong>1,287 ms</strong> — nhanh hơn hai nghìn lần câu <code>ADD COLUMN ... gen_random_uuid()</code> vô hại ở Chương 5 — để bảng nguyên 20 MB với các số điện thoại vẫn đọc được trong heap thô, và chỉ xoá thật ở lần <code>VACUUM FULL</code>, 239 ms sau đó (6.3). Chín mươi đơn hàng gửi ra chín mươi lá thư; xoá sạch chín mươi dòng vẫn để lại chín mươi lá đã phát, còn hộp gửi giao dịch biến chuyện đó thành 40 cái không lùi được và 50 cái huỷ được (6.4). Và một cú lùi ĐÚNG trong 140 ms vẫn phục vụ đúng cái bản vừa lùi cho mọi người dùng suốt năm phút, vì có một bộ đệm proxy đứng phía trước; một cú dọn 7 ms chữa được, và một phép kiểm phiên bản qua cửa trước bắt được chỗ thiếu ấy bằng mã thoát 3 (6.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A rollback by symlink measured 140 ms; rebuilding the same release from source measured 1,994 ms. Why is that comparison still generous to the rebuild?|||Lùi bằng symlink đo được 140 ms; dựng lại đúng bản đó từ nguồn đo được 1.994 ms. Vì sao phép so sánh ấy VẪN còn rộng lượng với cách dựng lại?',
            options: [
              'It is not generous; 1,994 ms is typical|||Nó không rộng lượng; 1.994 ms là điển hình',
              'The test project had 83 packages and a tsc build, while a real repo here has 897 and 1,159 packages and runs next build — so 1,994 ms is a floor, not an estimate|||Dự án thử có 83 gói và một bản dựng tsc, còn kho thật ở đây có 897 và 1.159 gói và chạy next build — nên 1.994 ms là một cái SÀN, không phải ước lượng',
              'The symlink measurement excluded the restart|||Phép đo symlink đã loại bỏ bước khởi động lại',
              'git clone is always slower than measured|||git clone lúc nào cũng chậm hơn số đo',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'After rolling code back onto a schema whose column was renamed, /health returned 200 while every real endpoint returned 500. Why can a health check not catch this?|||Sau khi lùi mã lên một lược đồ đã đổi tên cột, /health trả 200 còn mọi endpoint thật trả 500. Vì sao chốt kiểm sức khoẻ KHÔNG bắt được?',
            options: [
              'The health check was misconfigured|||Chốt kiểm sức khoẻ bị cấu hình sai',
              'It answers before touching anything — deliberately, so a database blip does not trigger a restart loop — and a shallow check cannot see a schema mismatch|||Nó trả lời TRƯỚC khi đụng vào bất cứ thứ gì — có chủ đích, để một cú nấc của cơ sở dữ liệu không kích hoạt vòng lặp khởi động lại — và một phép kiểm nông thì không thấy được lệch lược đồ',
              'The database was down|||Cơ sở dữ liệu đang sập',
              'nginx cached the 200|||nginx đã đệm cái 200 đó',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'What actually determines how many releases you can roll back?|||Cái gì THẬT SỰ quyết định bạn lùi được bao nhiêu bản?',
            options: [
              'The disk retention policy — how many release directories you keep|||Luật giữ bản trên đĩa — bạn giữ bao nhiêu thư mục',
              'The gap between your expand and contract phases: you can go back to the oldest release that still works against today schema|||Khoảng cách giữa giai đoạn mở rộng và thu hẹp: bạn về được tới bản CŨ NHẤT còn chạy được với lược đồ hôm nay',
              'The size of node_modules|||Kích thước của node_modules',
              'How long the CI pipeline takes|||Đường ống CI chạy mất bao lâu',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'A bad version was live 18.6 seconds and wrote 240 poisoned rows. What did the rollback do to those rows?|||Một bản hỏng sống 18,6 giây và ghi 240 dòng nhiễm độc. Cú lùi đã làm gì với những dòng đó?',
            options: [
              'Deleted them automatically|||Xoá chúng tự động',
              'Nothing — all 240 remained; the rollback only changed which code runs, and new writes were correct|||Không gì cả — cả 240 dòng còn nguyên; cú lùi chỉ đổi xem mã nào chạy, còn các lệnh ghi MỚI thì đúng',
              'Marked them for review|||Đánh dấu chúng để xem lại',
              'Rolled them back with the schema|||Cuộn chúng lại cùng với lược đồ',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Cleaning up by time window caught 60 innocent rows while fixing 180 broken ones. What is the cheap prevention?|||Dọn theo cửa sổ thời gian đụng 60 dòng vô tội trong khi sửa 180 dòng hỏng. Cách phòng RẺ TIỀN là gì?',
            options: [
              'Use a narrower time window|||Dùng cửa sổ thời gian hẹp hơn',
              'A column on each row recording which release wrote it, so the cleanup targets exactly the writes of the bad version|||Một cột trên mỗi dòng ghi lại bản nào đã ghi nó, để cú dọn nhắm CHÍNH XÁC vào các lệnh ghi của bản hỏng',
              'Stop writing to shared tables|||Thôi ghi vào các bảng dùng chung',
              'Take a backup before every deploy|||Sao lưu trước mỗi lần deploy',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'DROP COLUMN on 200,000 rows took 1.287 ms and the table stayed at 20 MB, with old values still readable in the raw heap. What does that tell you?|||DROP COLUMN trên 200.000 dòng mất 1,287 ms còn bảng vẫn 20 MB, với giá trị cũ vẫn đọc được trong heap thô. Điều đó cho bạn biết gì?',
            options: [
              'The data is recoverable, so DROP COLUMN is safe|||Dữ liệu lấy lại được, nên DROP COLUMN an toàn',
              'The operation is a catalogue edit: instant, unrelated to how much damage it does, and the leftover bytes are a diagnostic curiosity, not a recovery path|||Thao tác đó là một lần sửa DANH MỤC: tức thì, chẳng liên quan gì tới mức thiệt hại nó gây ra, và các byte sót lại là chuyện hay để chẩn đoán chứ không phải đường phục hồi',
              'PostgreSQL is slow at dropping columns|||PostgreSQL xoá cột chậm',
              'You must run VACUUM FULL before every deploy|||Bạn phải chạy VACUUM FULL trước mỗi lần deploy',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Ninety orders sent ninety emails. Deleting all ninety rows left ninety emails delivered. With a transactional outbox the measured result was 40 sent and 50 cancelled. What did the outbox actually change?|||Chín mươi đơn hàng gửi ra chín mươi lá thư. Xoá cả chín mươi dòng vẫn để lại chín mươi lá đã phát. Với hộp gửi giao dịch, kết quả đo được là 40 đã gửi và 50 đã huỷ. Hộp gửi thật ra đã đổi cái gì?',
            options: [
              'It made the emails recallable|||Nó làm cho các lá thư gọi về được',
              'Nothing makes a delivered email reversible; it shrank the window and gave you a table of not-yet-sent intents you can cancel|||Không gì làm cho một lá thư đã phát trở nên lùi được; nó THU HẸP cửa sổ và cho bạn một bảng chứa các ý định CHƯA gửi để mà huỷ',
              'It removed the need for idempotency keys|||Nó bỏ được nhu cầu dùng khoá bất biến',
              'It sends emails faster|||Nó gửi thư nhanh hơn',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'A 140 ms rollback succeeded, the app served v1 through the back door, and every user still got v3 for five minutes. What makes a rollback script catch that?|||Một cú lùi 140 ms thành công, ứng dụng phục vụ v1 qua cửa sau, và mọi người dùng vẫn nhận v3 suốt năm phút. Cái gì làm cho một script lùi bản bắt được chuyện đó?',
            options: [
              'Checking the health endpoint twice|||Kiểm endpoint sức khoẻ hai lần',
              'A final check through the user-facing address that compares the version served, not the status code — it exited 3 when the cache purge was omitted|||Một phép kiểm cuối đi qua ĐỊA CHỈ NGƯỜI DÙNG và so PHIÊN BẢN được phục vụ, không so mã trạng thái — nó thoát 3 khi bước dọn bộ đệm bị bỏ',
              'Waiting five minutes before declaring success|||Chờ năm phút rồi mới tuyên bố thành công',
              'Restarting nginx instead of reloading it|||Khởi động lại nginx thay vì nạp lại',
            ],
            correctIndex: 1,
            points: 10,
          },
        ],
      },
    },
  ],
};
