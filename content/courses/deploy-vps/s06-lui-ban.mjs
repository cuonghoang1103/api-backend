/**
 * Deploy lên VPS — Chương 6: Lùi bản, và thứ KHÔNG lùi được.
 * LUẬT: backtick → &#96;; ${ của bash → \${; < > & trong code → &lt; &gt; &amp;; gạch chéo ngược viết đôi.
 * Nâng cấp 29/09/2026: bài 6.0 slide (deck dv-06, 32 slide) + slide/🧪/🗂/📌 trong 6.1–6.5; quiz viết lại 10 câu có
 * giải thích. Đào sâu: lui.sh chạy lại trên VPS thí nghiệm (157–218 ms), lùi bằng ảnh Docker — ảnh mồ côi trên kho
 * overlay2 vs KHÔNG có gì trên kho containerd (mặc định cài mới Engine 29), docker tag cứu 10,8 s vs build lại 30,5 s
 * (production: 40 giây vs 15 phút — CLAUDE.md), bốn ảnh mồ côi cùng 510MB, prune xoá đường cứu, TAG theo phiên bản
 * 3,6 s; git revert xoá tệp migration mà Prisma vẫn "up to date"; liveness/readiness/smoke; ghi_boi + đường ghi đo
 * thật trong đoạn xanh/lam chồng nhau (65/40/30); phiên đăng nhập bản mới cấp bị bản cũ 401; tệp tải lên; bảng lùi
 * được/không lùi được; cấu hình proxy_cache từng chỉ thị + nginx không root; phép kiểm cửa trước chạy lại (520 ms).
 * Output MỚI chạy thật: VPS thí nghiệm ubuntu:24.04 (Node 18.19.1, PostgreSQL 16.15, nginx 1.24.0), Docker 29.1.3
 * lồng trong container đặc quyền, Prisma 5.22.0 trên Mac M1.
 */
import { gallery, slide } from './_slides.mjs';

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

    /* ─────────────────────────── 6.0 ─────────────────────────── */
    {
      title: '6.0 — Chapter 6 slides: rolling back, and what does not come back|||6.0 — Slide Chương 6: lùi bản, và thứ không quay lại',
      slug: 'deploy-6-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 6: lùi bằng symlink và bằng ảnh Docker, ảnh mồ côi và kho containerd, cú lùi nói dối, git revert không lùi CSDL, dòng bản hỏng đã ghi, cánh cửa một chiều (email, phiên đăng nhập, tệp tải lên), bộ đệm trước người dùng và phép kiểm qua cửa trước.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">Skim these before the lessons to see the shape of the chapter, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: a symlink moving from a broken release to a good one, an old Docker image surviving as an orphan on one image store and vanishing on another, a health check answering 200 while every real request fails, <code>git revert</code> deleting a migration file while Prisma reports "up to date", a door that only opens outwards, and a cache that keeps serving the version you just removed.</p>
<p>Slides 3–9 belong to Lesson 6.1 (the rollback that works — directories, images, tags), 10–15 to 6.2 (the rollback that lies, and <code>git revert</code>), 16–19 to 6.3 (what the bad version wrote), 20–23 to 6.4 (one-way doors: emails, sessions, uploads) and 24–28 to 6.5 (proving the rollback reached the user). The last four are the chapter's common mistakes, a two-page cheat sheet and a 45-minute practice session. New terminals were recorded on 29/09/2026 on the course's lab VPS — an Ubuntu 24.04 container with Node 18, PostgreSQL 16.15 and nginx 1.24.0 — plus a Docker Engine 29.1.3 running inside a container, so its seconds are slower and noisier than a real VPS; production numbers (40 seconds against 15 minutes) come from the project's own notes. The slides are in Vietnamese; the diagrams, commands and output read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để thấy hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại trong bài giảng giải thích nó: một symlink dời từ bản hỏng về bản tốt, một ảnh Docker cũ sống sót dưới dạng mồ côi ở kho ảnh này và biến mất ở kho ảnh kia, một chốt kiểm sức khoẻ trả 200 trong khi mọi request thật đều hỏng, <code>git revert</code> xoá tệp migration trong khi Prisma báo "up to date", một cánh cửa chỉ mở ra ngoài, và một bộ đệm cứ phục vụ cái bản bạn vừa gỡ.</p>
<p>Slide 3–9 thuộc Bài 6.1 (cú lùi chạy được — thư mục, ảnh, tag), 10–15 thuộc 6.2 (cú lùi nói dối, và <code>git revert</code>), 16–19 thuộc 6.3 (thứ bản hỏng đã ghi), 20–23 thuộc 6.4 (cánh cửa một chiều: email, phiên đăng nhập, tệp tải lên) và 24–28 thuộc 6.5 (chứng minh cú lùi đã tới người dùng). Bốn slide cuối là những sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Các terminal mới ghi ngày 29/09/2026 trên VPS thí nghiệm của khoá — một container Ubuntu 24.04 có Node 18, PostgreSQL 16.15 và nginx 1.24.0 — cộng một Docker Engine 29.1.3 chạy bên trong container, nên số giây của nó chậm và dao động hơn VPS thật; số của production (40 giây so với 15 phút) lấy từ ghi chép của chính dự án.</p>
</div>
${gallery('dv-06', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Lùi bản là trỏ lại thứ đã chạy được'], [4, 'Đo thật: lùi trọn vẹn dưới 250 ms'], [5, 'Về bản cũ: mili giây hay phút'], [6, 'Build đè tag latest: ảnh cũ thành mồ côi'], [7, 'Cứu bằng docker tag'], [8, 'Ảnh mồ côi là may mắn, không phải kế hoạch'], [9, 'Tag theo phiên bản: lùi = đổi một biến'],
  [10, '/health 200, request thật 500'], [11, 'Chốt kiểm sức khoẻ nông là có chủ đích'], [12, 'Thay đổi lược đồ nào lùi được'], [13, 'git revert xoá tệp migration, CSDL giữ cột'], [14, 'git revert và lùi ảnh là hai việc khác nhau'], [15, 'Tầm lùi đo bằng lược đồ'],
  [16, 'Lùi bản cầm máu, không chữa vết thương'], [17, 'Tìm dòng hỏng: ba cách'], [18, 'ghi_boi: dấu phiên bản trên từng dòng'], [19, 'DROP COLUMN: nhanh nhất, một chiều'],
  [20, 'Cửa một chiều'], [21, 'Hộp gửi thu hẹp cửa sổ'], [22, 'Phiên đăng nhập: bản cũ không đọc được'], [23, 'Lùi được, không lùi được, chuẩn bị gì'],
  [24, 'Cửa sau v1, cửa trước v3'], [25, 'Chuỗi bộ đệm: ai xoá được'], [26, 'Script lùi kiểm phiên bản qua cửa trước'], [27, 'Kiểm lại bộ kiểm: thoát 3'], [28, 'Lùi lại hay đi tới?'],
  [29, 'Sai lầm hay gặp'], [30, 'Bảng tra nhanh (1/2): lệnh lùi'], [31, 'Bảng tra nhanh (2/2): trước khi deploy'], [32, 'Thực hành chương 6'],
])}
`,
    },

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
${slide('dv-06', 3, 'Lùi bản là trỏ lại thứ đã chạy được')}
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
${slide('dv-06', 5, 'Về bản cũ: đo bằng mili giây hay bằng phút')}
<p>The other way to get back to a previous version is to rebuild it: check out the old commit and run the pipeline again. People reach for this because it needs no special layout — you already have git. Here is what it costs, on a project deliberately kept small (83 npm packages, 61 TypeScript files):</p>

<pre><code class="language-bash">T0=\$(date +%s%N)
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

<h3>Run it yourself: the rollback script on the lab VPS</h3>
${slide('dv-06', 4, 'Đo thật trên VPS thí nghiệm: lùi trọn vẹn dưới 250 ms')}
<p>The measurements above were taken in the lesson's original sandbox. Here is the same idea as one script you can keep, run again on 29/09/2026 on the course's lab VPS — an Ubuntu 24.04 container with Node 18, reached over SSH exactly like a real server. Each release is a directory <code>~/lui/ban/vN/</code> containing <code>app.mjs</code> and a one-line file <code>BAN</code> with its version; the app answers <code>/health</code> and prints its version on <code>/</code>.</p>
<pre><code class="language-bash">#!/bin/bash
# lui.sh &lt;ban&gt; — doi symlink, khoi dong lai, cho /health, in thoi gian tung doan
set -euo pipefail
GOC=\${GOC:-~/lui}; DICH=\${1:?dung: lui.sh &lt;ban&gt;}
[ -d "$GOC/ban/$DICH" ] || { echo "KHONG co ban '$DICH'. Co: $(ls "$GOC/ban" | tr '\\n' ' ')" &gt;&amp;2; exit 2; }
ms(){ echo $(( ($(date +%s%N) - T0) / 1000000 )); }
T0=$(date +%s%N)
ln -sfn "$GOC/ban/$DICH" "$GOC/ht.moi" &amp;&amp; mv -Tf "$GOC/ht.moi" "$GOC/hien-tai"
t1=$(ms)
for p in $(ss -ltnp 2&gt;/dev/null | grep ':3300 ' | grep -o 'pid=[0-9]*' | cut -d= -f2); do kill -TERM "$p"; done
while ss -ltn | grep -q ':3300 '; do sleep 0.01; done
CONG=3300 setsid nohup node "$GOC/hien-tai/app.mjs" &gt;"$GOC/app.log" 2&gt;&amp;1 &lt;/dev/null &amp;
t2=$(ms)
until [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 1 http://127.0.0.1:3300/health)" = 200 ]; do sleep 0.02; done
t3=$(ms)
echo "symlink \${t1} ms | khoi dong \${t2} ms | san sang \${t3} ms | dang phuc vu: $(curl -s http://127.0.0.1:3300/)"</code></pre>
<div class="out">$ ./lui.sh v2
symlink 3 ms | khoi dong 27 ms | san sang 218 ms | dang phuc vu: v2
$ ./lui.sh v1
symlink 3 ms | khoi dong 24 ms | san sang 189 ms | dang phuc vu: v1
$ ./lui.sh v3
symlink 2 ms | khoi dong 24 ms | san sang 157 ms | dang phuc vu: v3
$ ./lui.sh v9; echo "ma thoat: $?"
KHONG co ban 'v9'. Co: v1 v2 v3
ma thoat: 2</div>
<ul>
<li><strong>Read it line by line.</strong> <code>\${1:?…}</code> stops the script with a message if you forget the argument. <code>ln -sfn</code> builds the new link under a temporary name; <code>mv -Tf</code> renames it over the old one — one <code>rename(2)</code>, so there is no instant with no link. <code>-T</code> matters: without it, <code>mv</code> would move the new link <em>into</em> the directory the old link points at.</li>
<li><strong>Why kill by port, and wait for the port to close.</strong> <code>pkill -f node</code> would also kill every other Node process on the machine. Waiting until nothing listens on 3300 avoids the new process failing with <code>EADDRINUSE</code> because the old one is still shutting down.</li>
<li><strong>"Ready" means "answered", not "started".</strong> The middle number (24–27 ms) is when the process <em>exists</em>; the last (157–218 ms) is when it first answers <code>/health</code>. A script that stops timing at the middle number is measuring the wrong thing.</li>
<li><strong>The failure is loud and helpful.</strong> An unknown target exits 2 and lists what does exist, rather than half-switching the pointer.</li>
</ul>

<h3>With containers: the old image is the artifact</h3>
${slide('dv-06', 6, 'Build đè tag latest: ảnh cũ thành ảnh mồ côi — hoặc biến mất')}
<p>This project does not deploy directories; it deploys Docker images, and Compose picks the image by name — <code>image: app-backend:latest</code> style. That changes what "keep the old artifact" means. If every build is tagged <code>latest</code>, building v2 moves the name <code>latest</code> to the new image, and v1 is left with no name at all: a <strong>dangling image</strong> (<em>ảnh mồ côi</em>). Measured on 29/09/2026 inside the lab — a Docker Engine 29.1.3 running inside a privileged container on a Mac, so the seconds are slow and noisy:</p>
<div class="out">=== 1. build v1, cache SACH (keo node:22-alpine + npm install) ===
  build v1: 28225 ms
  dang phuc vu: v1
=== 2. build v2 (co bug) CUNG TAG latest, trao ===
  build v2: 665 ms
  dang phuc vu: v2
=== 3. anh v1 gio o dau? ===
IMAGE        ID             DISK USAGE   CONTENT SIZE   EXTRA
&lt;untagged&gt;   e2b6a7a92107        510MB             0B        </div>
<p>With the classic <code>overlay2</code> image store, v1 is still on disk, just nameless. Now the same script on the same engine with the <strong>containerd image store</strong>:</p>
<div class="out">$ docker info | grep -A1 "Storage Driver"
 Storage Driver: overlayfs
  driver-type: io.containerd.snapshotter.v1
=== 3. anh v1 gio o dau? ===
IMAGE   ID             DISK USAGE   CONTENT SIZE   EXTRA</div>
<p>Nothing. There is no orphan to rescue. Docker's documentation states that the containerd image store is the default for Docker Engine 29.0 and later <em>on fresh installations</em>, while a machine upgraded from an earlier version keeps what it had (as of 09/2026). So the same habit — "the old image will still be there" — is true on a VPS that has been upgraded for years and false on one installed last month. Check which one you have <em>before</em> you need it.</p>

<h3>The rescue this project actually used</h3>
${slide('dv-06', 7, 'Cứu bằng docker tag: không build lại')}
<p>On 18/08/2026 a build script ran <code>docker build .</code>, which picks the default <code>Dockerfile</code> instead of the <code>Dockerfile.backend</code> that Compose uses. The image was Alpine (musl) carrying a Prisma engine built for glibc: build green, push green, swap green — and the backend restarted forever, with the <strong>API returning 502 for seven minutes</strong>. The project's own notes record the way out: the previous image was still on the VPS as an orphan, so instead of rebuilding for about fifteen minutes, it was re-tagged and started without a build, in about <strong>forty seconds</strong>:</p>
<pre><code class="language-bash">docker images -a --filter dangling=true          # tim anh cu, doi chieu ID va tuoi
docker tag &lt;id&gt; cuonghoangdev-backend:latest       # gan lai dung ten compose dang dung
set -a; . /opt/cuonghoangdev/.env; set +a          # dung env cua production
docker compose -p cuonghoangdev up -d --no-build backend</code></pre>
<p>The lab reproduction, same steps, and the rebuild for comparison:</p>
<div class="out">=== 4. CUU: tag lai anh mo coi, trao KHONG build ===
  tag + up + cho v1: 10732 ms   dang phuc vu: v1
=== 5. CACH KIA: build lai v1 tu git (git revert + build --no-cache) ===
  revert + build + up: 30472 ms</div>
<p>Split into parts on a second run: <code>docker tag</code> 47 ms, <code>compose up</code> finished at 10,580 ms, v1 answering at 10,790 ms. Renaming is instant; almost all the time is Compose recreating the container. The lab's ratio (10.7 s against 30.5 s) is smaller than production's (40 s against 15 min) because the test app is tiny — but the direction is the same, and on a real app the gap only grows.</p>
<div class="pitfall co-tieu-de"><strong>Trap — <code>up</code> with the wrong environment or project name.</strong> <code>docker compose up</code> reads variables from your shell and from the project name. Run it without loading <code>/opt/cuonghoangdev/.env</code> and the container starts with empty secrets; run it from a directory whose name differs from the production project without <code>-p</code>, and Compose creates a <em>second</em> set of containers instead of replacing the first. Both look like "the rollback didn't work" when the rollback was fine.</div>

<h3>Orphans are luck, not a plan</h3>
${slide('dv-06', 8, 'Ảnh mồ côi là may mắn, không phải kế hoạch')}
<p>Three measured reasons not to rely on the orphan trick:</p>
<ul>
<li><strong>They all look the same.</strong> After a few builds over the same tag, the lab had four orphans, every one of them <code>510MB</code>. The project's note says to identify the old image by size; when only code changed and dependencies did not, sizes are identical. Use the creation time (<code>docker image inspect -f '{{.Created}}' &lt;id&gt;</code>) or, better, a label written at build time.</li>
<li><strong>Cleaning the disk deletes them.</strong> <code>docker image prune -f</code> removed both remaining orphans in the lab (<code>Total reclaimed space: 0B</code> — their layers were shared, which is also why deleting them saved nothing). Any disk-cleanup job that prunes images removes your rescue path without telling you.</li>
<li><strong>On a containerd store they never exist</strong> (above).</li>
</ul>
${slide('dv-06', 9, 'Tag theo phiên bản: lùi = đổi một biến')}
<p>The plan that replaces luck: give every build its own tag that is never overwritten, and let Compose read the tag from a variable.</p>
<pre><code class="language-bash"># compose.yaml:   image: app-backend:\${TAG:-latest}
docker build -t app-backend:v2 --label org.opencontainers.image.version=v2 .
TAG=v2 docker compose up -d                          # deploy
TAG=v1 docker compose up -d --no-build backend       # roll back: change one variable</code></pre>
<div class="out">=== dang chay app-backend:v2. LUI = doi TAG ===
  TAG=v1 up + cho v1: 3640 ms   dang phuc vu: v1
REPOSITORY:TAG       IMAGE ID       CREATED
app-backend:v2       84c5bb72ebf3   11 seconds ago
app-backend:v1       a43b4700ed66   17 seconds ago
app-backend:latest   b15c2180ac9c   3 minutes ago</div>
<p>Tagged images survive <code>docker image prune</code> (it only removes dangling ones), so after the cleanup above <code>v1</code> and <code>v2</code> were still listed. Keep the last N tags on the VPS and on the registry, and the rollback target becomes a name you type, not an ID you hunt for. Chapter 13 builds this into the container deploy pipeline.</p>

<h3>On macOS and Windows</h3>
<ul>
<li><strong>The rollback script runs on the server, not on your laptop.</strong> Measured on macOS: <code>/bin/mv -Tf</code> fails with <code>mv: illegal option -- T</code>, and <code>ss</code> does not exist. The macOS equivalent of the atomic link swap is <code>mv -fh ht.moi hien-tai</code> (<code>-h</code>: do not follow a link to a directory) — useful for testing the idea locally, but keep the Linux version in the script.</li>
<li><strong>Windows teammates:</strong> edit and run the script inside WSL, not Git Bash, and make sure it is saved with LF line endings; a script saved with CRLF fails on the server with errors about <code>$'\\r'</code>. <code>*.sh text eol=lf</code> in <code>.gitattributes</code> settles it for everyone.</li>
<li><strong>Docker Desktop on both</strong> uses its own engine version and image store — what your laptop does with orphans says nothing about the VPS. Run <code>docker info</code> <em>on the VPS</em>.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the night before your SWP391 defence, the team deploys v3 and the home page breaks. You have one minute to put v2 back. Build the lab once — later lessons reuse it:</p>
<pre><code class="language-bash">mkdir -p ~/dv-lab6 &amp;&amp; cd ~/dv-lab6
ssh-keygen -t ed25519 -N "" -f ./khoa -q            # khoa CHI cho phong thi nghiem
cat &gt; Dockerfile &lt;&lt;'EOF'
FROM ubuntu:24.04
RUN apt-get update &amp;&amp; DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \\
    openssh-server nodejs postgresql-16 nginx curl iproute2 \\
 &amp;&amp; mkdir -p /run/sshd &amp;&amp; useradd -m -s /bin/bash deploy &amp;&amp; mkdir -p /home/deploy/.ssh
COPY khoa.pub /home/deploy/.ssh/authorized_keys
RUN chown -R deploy /home/deploy/.ssh &amp;&amp; chmod 700 /home/deploy/.ssh
CMD ["/usr/sbin/sshd", "-D", "-e"]
EOF
docker build -t vps-thu6 . &amp;&amp; docker run -d --name vps-thu6 --memory 512m -p 127.0.0.1:2226:22 vps-thu6
ssh -i khoa -p 2226 -o UserKnownHostsFile=./known_hosts deploy@127.0.0.1 'node --version'</code></pre>
<pre><code class="language-bash"># tren VPS: tao ba ban, moi ban mot thu muc day du
mkdir -p ~/lui/ban
cat &gt; ~/app.mjs &lt;&lt;'JS'
import http from 'node:http';
import { readFileSync } from 'node:fs';
const BAN = readFileSync(new URL('./BAN', import.meta.url), 'utf8').trim();
http.createServer((req, res) =&gt; {
  if (req.url === '/health') { res.writeHead(200); return res.end('ok\\n'); }
  res.writeHead(200, { 'x-ban': BAN }); res.end(BAN + '\\n');
}).listen(Number(process.env.CONG || 3300), '127.0.0.1');
JS
for v in v1 v2 v3; do mkdir -p ~/lui/ban/$v; cp ~/app.mjs ~/lui/ban/$v/; echo $v &gt; ~/lui/ban/$v/BAN; done</code></pre>
<ol>
<li>On the VPS, create <code>~/lui/ban/v1</code>, <code>v2</code>, <code>v3</code>, each with a copy of the <code>app.mjs</code> above (answers <code>/health</code>, prints the contents of <code>BAN</code> on <code>/</code>) and a file <code>BAN</code> containing its name — the block above does exactly that.</li>
<li>Copy <code>lui.sh</code> from this lesson, <code>chmod +x</code> it, run <code>./lui.sh v3</code> then <code>./lui.sh v2</code>. Write down the three numbers of the second run.</li>
<li>Run <code>./lui.sh v9; echo "ma thoat: $?"</code>. Then run <code>readlink -f ~/lui/hien-tai</code> and confirm the pointer did not move.</li>
<li>If you have Docker on a Linux machine or the VPS: run <code>docker info | grep -A1 "Storage Driver"</code> and write down whether it is <code>overlay2</code> or containerd. One sentence: can you rescue an orphan on this machine?</li>
</ol>
<p><strong>Done when:</strong> the second run prints <code>dang phuc vu: v2</code> with a total under one second, the unknown target prints the list of real versions and <code>ma thoat: 2</code> without moving <code>hien-tai</code>, and you know which image store your Docker uses.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rollback</span><span class="v">Putting back a version that is already known to work — not running a deploy backwards.</span></div>
  <div class="kv"><span class="k">Release directory</span><span class="v">One complete, unpacked, never-edited copy of a version (<code>ban/v2/</code>).</span></div>
  <div class="kv"><span class="k">Symlink</span><span class="v">A file that points at another path; <code>hien-tai</code> is the one thing a deploy or rollback changes.</span></div>
  <div class="kv"><span class="k">Atomic rename</span><span class="v"><code>rename(2)</code> replaces the old name in one step, so no process ever sees "no link".</span></div>
  <div class="kv"><span class="k">Image tag</span><span class="v">A name pointing at an image (<code>app-backend:v2</code>); moving a tag does not copy anything.</span></div>
  <div class="kv"><span class="k">Dangling image</span><span class="v">An image that lost its last tag — kept by the overlay2 store until pruned; absent on a containerd store.</span></div>
  <div class="kv"><span class="k">Retention</span><span class="v">How many old releases or tags you keep; too few turns "roll back" into "rebuild".</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A rollback is fast only because the old artifact was kept: pointing back took 157–218 ms in the lab, rebuilding took seconds in a toy and fifteen minutes in production.</li>
<li>Time the rollback until the app <em>answers</em>, not until the process exists.</li>
<li>Building over the same tag turns the old image into an orphan on overlay2 — and into nothing at all on the containerd store that fresh Docker 29 installs use.</li>
<li>Re-tagging an orphan saved this project from a fifteen-minute rebuild during a real 502 — but orphans look identical, and pruning deletes them.</li>
<li>The plan instead of luck: one tag per version, <code>TAG=vN docker compose up -d --no-build</code> to go back.</li>
<li>Rolling back the artifact rolls back neither <code>.env</code> nor the database — the next lessons are about those.</li>
</ul>

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
${slide('dv-06', 3, 'Lùi bản là trỏ lại thứ đã chạy được')}
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
${slide('dv-06', 5, 'Về bản cũ: đo bằng mili giây hay bằng phút')}
<p>Cách khác để quay về một phiên bản cũ là DỰNG LẠI nó: lấy commit cũ ra rồi chạy lại đường ống. Người ta hay chọn cách này vì nó không cần bố cục đặc biệt gì — bạn vốn đã có git. Đây là cái giá của nó, trên một dự án cố tình làm nhỏ (83 gói npm, 61 tệp TypeScript):</p>

<pre><code class="language-bash">T0=\$(date +%s%N)
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

<h3>Tự chạy: script lùi bản trên VPS thí nghiệm</h3>
${slide('dv-06', 4, 'Đo thật trên VPS thí nghiệm: lùi trọn vẹn dưới 250 ms')}
<p>Các số đo ở trên lấy trong hộp cát gốc của bài. Đây là cùng ý đó gói thành MỘT script để bạn giữ lại, chạy lại ngày 29/09/2026 trên VPS thí nghiệm của khoá — một container Ubuntu 24.04 có Node 18, SSH vào y như một máy chủ thật. Mỗi bản là một thư mục <code>~/lui/ban/vN/</code> chứa <code>app.mjs</code> và một tệp một dòng <code>BAN</code> ghi phiên bản; ứng dụng trả lời <code>/health</code> và in phiên bản của nó ở <code>/</code>.</p>
<pre><code class="language-bash">#!/bin/bash
# lui.sh &lt;ban&gt; — doi symlink, khoi dong lai, cho /health, in thoi gian tung doan
set -euo pipefail
GOC=\${GOC:-~/lui}; DICH=\${1:?dung: lui.sh &lt;ban&gt;}
[ -d "$GOC/ban/$DICH" ] || { echo "KHONG co ban '$DICH'. Co: $(ls "$GOC/ban" | tr '\\n' ' ')" &gt;&amp;2; exit 2; }
ms(){ echo $(( ($(date +%s%N) - T0) / 1000000 )); }
T0=$(date +%s%N)
ln -sfn "$GOC/ban/$DICH" "$GOC/ht.moi" &amp;&amp; mv -Tf "$GOC/ht.moi" "$GOC/hien-tai"
t1=$(ms)
for p in $(ss -ltnp 2&gt;/dev/null | grep ':3300 ' | grep -o 'pid=[0-9]*' | cut -d= -f2); do kill -TERM "$p"; done
while ss -ltn | grep -q ':3300 '; do sleep 0.01; done
CONG=3300 setsid nohup node "$GOC/hien-tai/app.mjs" &gt;"$GOC/app.log" 2&gt;&amp;1 &lt;/dev/null &amp;
t2=$(ms)
until [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 1 http://127.0.0.1:3300/health)" = 200 ]; do sleep 0.02; done
t3=$(ms)
echo "symlink \${t1} ms | khoi dong \${t2} ms | san sang \${t3} ms | dang phuc vu: $(curl -s http://127.0.0.1:3300/)"</code></pre>
<div class="out">$ ./lui.sh v2
symlink 3 ms | khoi dong 27 ms | san sang 218 ms | dang phuc vu: v2
$ ./lui.sh v1
symlink 3 ms | khoi dong 24 ms | san sang 189 ms | dang phuc vu: v1
$ ./lui.sh v3
symlink 2 ms | khoi dong 24 ms | san sang 157 ms | dang phuc vu: v3
$ ./lui.sh v9; echo "ma thoat: $?"
KHONG co ban 'v9'. Co: v1 v2 v3
ma thoat: 2</div>
<ul>
<li><strong>Đọc từng dòng.</strong> <code>\${1:?…}</code> dừng script kèm lời nhắn nếu bạn quên đối số. <code>ln -sfn</code> dựng liên kết mới dưới một cái tên tạm; <code>mv -Tf</code> đổi tên nó đè lên cái cũ — MỘT lệnh <code>rename(2)</code>, nên không có khoảnh khắc nào thiếu liên kết. <code>-T</code> quan trọng: thiếu nó, <code>mv</code> sẽ dời liên kết mới vào <em>BÊN TRONG</em> thư mục mà liên kết cũ đang trỏ tới.</li>
<li><strong>Vì sao giết theo cổng, và chờ cổng đóng.</strong> <code>pkill -f node</code> sẽ giết luôn mọi tiến trình Node khác trên máy. Chờ tới khi không còn ai nghe cổng 3300 thì tiến trình mới không chết vì <code>EADDRINUSE</code> do tiến trình cũ còn đang tắt dở.</li>
<li><strong>"Sẵn sàng" nghĩa là "đã trả lời", không phải "đã khởi động".</strong> Con số giữa (24–27 ms) là lúc tiến trình <em>tồn tại</em>; con số cuối (157–218 ms) là lúc nó trả lời <code>/health</code> lần đầu. Script nào dừng bấm giờ ở con số giữa là đang đo nhầm thứ.</li>
<li><strong>Hỏng thì hỏng to và có ích.</strong> Đích lạ thì thoát 2 và liệt kê những bản CÓ, thay vì đổi con trỏ nửa vời.</li>
</ul>

<h3>Với container: ảnh cũ CHÍNH LÀ tạo tác</h3>
${slide('dv-06', 6, 'Build đè tag latest: ảnh cũ thành ảnh mồ côi — hoặc biến mất')}
<p>Dự án này không deploy thư mục; nó deploy ảnh Docker, và Compose chọn ảnh theo TÊN — kiểu <code>image: app-backend:latest</code>. Điều đó đổi nghĩa của "giữ tạo tác cũ". Nếu bản nào cũng gắn tag <code>latest</code>, thì build v2 sẽ dời cái tên <code>latest</code> sang ảnh mới, còn v1 bị bỏ lại không tên: một <strong>ảnh mồ côi</strong> (dangling image). Đo ngày 29/09/2026 trong phòng thí nghiệm — Docker Engine 29.1.3 chạy BÊN TRONG một container đặc quyền trên Mac, nên số giây chậm và dao động:</p>
<div class="out">=== 1. build v1, cache SACH (keo node:22-alpine + npm install) ===
  build v1: 28225 ms
  dang phuc vu: v1
=== 2. build v2 (co bug) CUNG TAG latest, trao ===
  build v2: 665 ms
  dang phuc vu: v2
=== 3. anh v1 gio o dau? ===
IMAGE        ID             DISK USAGE   CONTENT SIZE   EXTRA
&lt;untagged&gt;   e2b6a7a92107        510MB             0B        </div>
<p>Với kho ảnh <code>overlay2</code> kiểu cũ, v1 vẫn nằm trên đĩa, chỉ mất tên. Giờ vẫn script ấy, vẫn engine ấy, nhưng dùng <strong>kho ảnh containerd</strong>:</p>
<div class="out">$ docker info | grep -A1 "Storage Driver"
 Storage Driver: overlayfs
  driver-type: io.containerd.snapshotter.v1
=== 3. anh v1 gio o dau? ===
IMAGE   ID             DISK USAGE   CONTENT SIZE   EXTRA</div>
<p>Không có gì. Chẳng có ảnh mồ côi nào để cứu. Tài liệu Docker ghi rằng kho ảnh containerd là mặc định cho Docker Engine 29.0 trở lên <em>trên bản cài MỚI</em>, còn máy nâng cấp từ bản cũ thì giữ nguyên kho đang có (tính đến 09/2026). Nên cùng một thói quen — "ảnh cũ chắc vẫn còn đó" — đúng trên một VPS đã nâng cấp qua nhiều năm và SAI trên một VPS mới cài tháng trước. Kiểm máy mình thuộc loại nào <em>TRƯỚC</em> khi cần tới.</p>

<h3>Cú cứu mà chính dự án này đã dùng</h3>
${slide('dv-06', 7, 'Cứu bằng docker tag: không build lại')}
<p>Ngày 18/08/2026 một script build chạy <code>docker build .</code> — lệnh này lấy <code>Dockerfile</code> mặc định thay vì <code>Dockerfile.backend</code> mà Compose dùng. Ảnh ra là Alpine (musl) mang engine Prisma dựng cho glibc: build xanh, đẩy xanh, tráo xanh — và backend khởi động lại vô tận, <strong>API trả 502 suốt bảy phút</strong>. Ghi chép của chính dự án ghi lại lối ra: ảnh trước đó vẫn nằm trên VPS dưới dạng mồ côi, nên thay vì dựng lại mất chừng mười lăm phút, người ta gắn lại tên cho nó rồi chạy mà không build, mất chừng <strong>bốn mươi giây</strong>:</p>
<pre><code class="language-bash">docker images -a --filter dangling=true          # tim anh cu, doi chieu ID va tuoi
docker tag &lt;id&gt; cuonghoangdev-backend:latest       # gan lai dung ten compose dang dung
set -a; . /opt/cuonghoangdev/.env; set +a          # dung env cua production
docker compose -p cuonghoangdev up -d --no-build backend</code></pre>
<p>Tái hiện trong phòng thí nghiệm, đúng các bước ấy, kèm cách dựng lại để so:</p>
<div class="out">=== 4. CUU: tag lai anh mo coi, trao KHONG build ===
  tag + up + cho v1: 10732 ms   dang phuc vu: v1
=== 5. CACH KIA: build lai v1 tu git (git revert + build --no-cache) ===
  revert + build + up: 30472 ms</div>
<p>Tách từng phần ở một lần chạy khác: <code>docker tag</code> 47 ms, <code>compose up</code> xong ở 10.580 ms, v1 trả lời ở 10.790 ms. Đổi tên là tức thì; gần hết thời gian là Compose tạo lại container. Tỷ lệ trong phòng thí nghiệm (10,7 s so với 30,5 s) nhỏ hơn của production (40 giây so với 15 phút) vì ứng dụng thử bé tí — nhưng chiều thì y như vậy, và với ứng dụng thật khoảng cách chỉ càng rộng.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — <code>up</code> với sai môi trường hoặc sai tên dự án.</strong> <code>docker compose up</code> đọc biến từ shell của bạn và từ tên dự án. Chạy mà không nạp <code>/opt/cuonghoangdev/.env</code> thì container khởi động với bí mật RỖNG; chạy từ một thư mục có tên khác tên dự án production mà không có <code>-p</code>, thì Compose tạo ra một bộ container THỨ HAI thay vì thay bộ đầu. Cả hai trông như "lùi bản không ăn" trong khi cú lùi vốn đúng.</div>

<h3>Ảnh mồ côi là may mắn, không phải kế hoạch</h3>
${slide('dv-06', 8, 'Ảnh mồ côi là may mắn, không phải kế hoạch')}
<p>Ba lý do, đều đo được, để đừng trông vào mẹo ảnh mồ côi:</p>
<ul>
<li><strong>Chúng trông y hệt nhau.</strong> Sau vài lần build đè cùng một tag, phòng thí nghiệm có bốn ảnh mồ côi, ảnh nào cũng <code>510MB</code>. Ghi chép của dự án bảo nhận ảnh cũ bằng kích thước; khi chỉ mã đổi còn phụ thuộc thì không, kích thước giống hệt. Hãy dùng thời điểm tạo (<code>docker image inspect -f '{{.Created}}' &lt;id&gt;</code>) hoặc, tốt hơn, một nhãn ghi lúc build.</li>
<li><strong>Dọn đĩa là xoá mất.</strong> <code>docker image prune -f</code> xoá cả hai ảnh mồ côi còn lại trong phòng thí nghiệm (<code>Total reclaimed space: 0B</code> — các tầng của chúng dùng chung, nên xoá cũng chẳng được thêm byte nào). Bất kỳ việc dọn đĩa nào có prune ảnh đều xoá đường cứu của bạn mà không báo.</li>
<li><strong>Trên kho containerd chúng không bao giờ tồn tại</strong> (ở trên).</li>
</ul>
${slide('dv-06', 9, 'Tag theo phiên bản: lùi = đổi một biến')}
<p>Kế hoạch thay cho may mắn: cho mỗi bản build một tag RIÊNG không bao giờ bị đè, và để Compose đọc tag từ một biến.</p>
<pre><code class="language-bash"># compose.yaml:   image: app-backend:\${TAG:-latest}
docker build -t app-backend:v2 --label org.opencontainers.image.version=v2 .
TAG=v2 docker compose up -d                          # deploy
TAG=v1 docker compose up -d --no-build backend       # lui: doi MOT bien</code></pre>
<div class="out">=== dang chay app-backend:v2. LUI = doi TAG ===
  TAG=v1 up + cho v1: 3640 ms   dang phuc vu: v1
REPOSITORY:TAG       IMAGE ID       CREATED
app-backend:v2       84c5bb72ebf3   11 seconds ago
app-backend:v1       a43b4700ed66   17 seconds ago
app-backend:latest   b15c2180ac9c   3 minutes ago</div>
<p>Ảnh có tag sống sót qua <code>docker image prune</code> (lệnh đó chỉ xoá ảnh mồ côi), nên sau cú dọn ở trên <code>v1</code> và <code>v2</code> vẫn còn trong danh sách. Giữ N tag gần nhất trên VPS và trên registry, thì đích lùi trở thành một CÁI TÊN bạn gõ, không phải một ID bạn đi mò. Chương 13 đưa chuyện này vào đường ống deploy container.</p>

<h3>Trên macOS và Windows</h3>
<ul>
<li><strong>Script lùi bản chạy trên MÁY CHỦ, không phải trên laptop.</strong> Đo trên macOS: <code>/bin/mv -Tf</code> hỏng với <code>mv: illegal option -- T</code>, và không có lệnh <code>ss</code>. Bản tương đương trên macOS của cú đổi liên kết nguyên tử là <code>mv -fh ht.moi hien-tai</code> (<code>-h</code>: đừng đi theo liên kết trỏ vào thư mục) — tiện để thử ý tưởng trên máy mình, nhưng trong script cứ giữ bản Linux.</li>
<li><strong>Bạn cùng nhóm dùng Windows:</strong> sửa và chạy script trong WSL chứ không phải Git Bash, và bảo đảm tệp lưu với xuống dòng LF; script lưu kiểu CRLF sẽ hỏng trên máy chủ với lỗi nhắc tới <code>$'\\r'</code>. Thêm <code>*.sh text eol=lf</code> vào <code>.gitattributes</code> là xong cho cả nhóm.</li>
<li><strong>Docker Desktop trên cả hai</strong> dùng phiên bản engine và kho ảnh RIÊNG của nó — laptop của bạn xử lý ảnh mồ côi thế nào chẳng nói gì về VPS. Chạy <code>docker info</code> <em>TRÊN VPS</em>.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tối trước hôm bảo vệ SWP391, nhóm deploy v3 và trang chủ vỡ. Bạn có một phút để đặt v2 trở lại. Dựng phòng thí nghiệm một lần — các bài sau dùng lại:</p>
<pre><code class="language-bash">mkdir -p ~/dv-lab6 &amp;&amp; cd ~/dv-lab6
ssh-keygen -t ed25519 -N "" -f ./khoa -q            # khoa CHI cho phong thi nghiem
cat &gt; Dockerfile &lt;&lt;'EOF'
FROM ubuntu:24.04
RUN apt-get update &amp;&amp; DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \\
    openssh-server nodejs postgresql-16 nginx curl iproute2 \\
 &amp;&amp; mkdir -p /run/sshd &amp;&amp; useradd -m -s /bin/bash deploy &amp;&amp; mkdir -p /home/deploy/.ssh
COPY khoa.pub /home/deploy/.ssh/authorized_keys
RUN chown -R deploy /home/deploy/.ssh &amp;&amp; chmod 700 /home/deploy/.ssh
CMD ["/usr/sbin/sshd", "-D", "-e"]
EOF
docker build -t vps-thu6 . &amp;&amp; docker run -d --name vps-thu6 --memory 512m -p 127.0.0.1:2226:22 vps-thu6
ssh -i khoa -p 2226 -o UserKnownHostsFile=./known_hosts deploy@127.0.0.1 'node --version'</code></pre>
<pre><code class="language-bash"># tren VPS: tao ba ban, moi ban mot thu muc day du
mkdir -p ~/lui/ban
cat &gt; ~/app.mjs &lt;&lt;'JS'
import http from 'node:http';
import { readFileSync } from 'node:fs';
const BAN = readFileSync(new URL('./BAN', import.meta.url), 'utf8').trim();
http.createServer((req, res) =&gt; {
  if (req.url === '/health') { res.writeHead(200); return res.end('ok\\n'); }
  res.writeHead(200, { 'x-ban': BAN }); res.end(BAN + '\\n');
}).listen(Number(process.env.CONG || 3300), '127.0.0.1');
JS
for v in v1 v2 v3; do mkdir -p ~/lui/ban/$v; cp ~/app.mjs ~/lui/ban/$v/; echo $v &gt; ~/lui/ban/$v/BAN; done</code></pre>
<ol>
<li>Trên VPS, tạo <code>~/lui/ban/v1</code>, <code>v2</code>, <code>v3</code>, mỗi thư mục một bản <code>app.mjs</code> ở trên (trả lời <code>/health</code>, in nội dung tệp <code>BAN</code> ở <code>/</code>) và một tệp <code>BAN</code> chứa tên của nó — khối lệnh trên làm đúng việc đó.</li>
<li>Chép <code>lui.sh</code> ở bài này sang, <code>chmod +x</code>, chạy <code>./lui.sh v3</code> rồi <code>./lui.sh v2</code>. Ghi lại ba con số của lần chạy thứ hai.</li>
<li>Chạy <code>./lui.sh v9; echo "ma thoat: $?"</code>. Rồi chạy <code>readlink -f ~/lui/hien-tai</code> và xác nhận con trỏ KHÔNG dời.</li>
<li>Nếu bạn có Docker trên một máy Linux hoặc trên VPS: chạy <code>docker info | grep -A1 "Storage Driver"</code> và ghi lại đó là <code>overlay2</code> hay containerd. Một câu: trên máy này bạn có cứu được ảnh mồ côi không?</li>
</ol>
<p><strong>Đạt khi:</strong> lần chạy thứ hai in <code>dang phuc vu: v2</code> với tổng dưới một giây, đích lạ in ra danh sách phiên bản thật kèm <code>ma thoat: 2</code> mà <code>hien-tai</code> không dời, và bạn biết Docker của mình dùng kho ảnh nào.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rollback (lùi bản)</span><span class="v">Đặt trở lại một phiên bản đã biết chắc chạy được — không phải chạy ngược một lần deploy.</span></div>
  <div class="kv"><span class="k">Release directory (thư mục bản phát hành)</span><span class="v">Một bản sao đầy đủ, đã bung, không bao giờ bị sửa của một phiên bản (<code>ban/v2/</code>).</span></div>
  <div class="kv"><span class="k">Symlink (liên kết mềm)</span><span class="v">Một tệp trỏ tới đường dẫn khác; <code>hien-tai</code> là thứ DUY NHẤT mà deploy hay lùi bản đổi.</span></div>
  <div class="kv"><span class="k">Atomic rename (đổi tên nguyên tử)</span><span class="v"><code>rename(2)</code> thay tên cũ trong một bước, nên không tiến trình nào thấy lúc "không có liên kết".</span></div>
  <div class="kv"><span class="k">Image tag (tag ảnh)</span><span class="v">Một cái tên trỏ vào một ảnh (<code>app-backend:v2</code>); dời tag không chép gì cả.</span></div>
  <div class="kv"><span class="k">Dangling image (ảnh mồ côi)</span><span class="v">Ảnh đã mất tag cuối cùng — kho overlay2 giữ nó tới lúc prune; kho containerd thì không có.</span></div>
  <div class="kv"><span class="k">Retention (luật giữ bản)</span><span class="v">Giữ bao nhiêu bản/tag cũ; quá ít thì "lùi bản" biến thành "dựng lại".</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lùi bản nhanh chỉ vì tạo tác cũ đã được GIỮ: trỏ lại mất 157–218 ms trong phòng thí nghiệm, dựng lại mất vài giây với dự án đồ chơi và mười lăm phút trên production.</li>
<li>Bấm giờ cú lùi tới lúc ứng dụng <em>TRẢ LỜI</em>, không phải tới lúc tiến trình tồn tại.</li>
<li>Build đè cùng một tag biến ảnh cũ thành mồ côi trên overlay2 — và thành KHÔNG CÒN GÌ trên kho containerd mà bản cài Docker 29 mới dùng.</li>
<li>Gắn lại tag cho ảnh mồ côi đã cứu dự án này khỏi mười lăm phút dựng lại giữa một sự cố 502 thật — nhưng ảnh mồ côi trông y hệt nhau, và prune xoá sạch chúng.</li>
<li>Kế hoạch thay cho may mắn: mỗi phiên bản một tag, lùi bằng <code>TAG=vN docker compose up -d --no-build</code>.</li>
<li>Lùi tạo tác KHÔNG lùi <code>.env</code> và cũng không lùi cơ sở dữ liệu — các bài sau nói về hai thứ đó.</li>
</ul>

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
${slide('dv-06', 10, '/health 200, còn mọi request thật 500')}
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
${slide('dv-06', 11, 'Chốt kiểm sức khoẻ nông là có chủ đích')}
<p>Because of what a health endpoint usually is:</p>

<pre><code class="language-bash">if (req.url === "/health") { res.writeHead(200); return res.end("ok\\n"); }</code></pre>

<p>It answers before touching anything. It does not open a database connection, it does not run a query, it does not read a config value. That is deliberate — a health check that talks to the database will report the app as unhealthy during a database blip and get the process killed by whatever supervises it, which turns a five-second database hiccup into a restart loop. So health checks are kept shallow on purpose, and a shallow health check cannot possibly detect a schema mismatch.</p>

<div class="pitfall">
<p><strong>Trap — "deep" health checks are not the fix.</strong> The obvious reaction is to make <code>/health</code> run <code>SELECT 1</code>. That catches "the database is unreachable" and still misses this entirely: <code>SELECT 1</code> succeeds perfectly against a schema your code cannot read. To catch <em>this</em> you would need the health check to exercise a real query on a real table — at which point it is no longer a health check, it is a smoke test, and it belongs in the deploy script, not on an endpoint a load balancer polls every two seconds.</p>
</div>

<h3>The fix, and its cost</h3>
${slide('dv-06', 12, 'Thay đổi lược đồ nào lùi được')}
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
${slide('dv-06', 15, 'Tầm lùi đo bằng lược đồ, không bằng đĩa')}
<p>This is the question 6.1's retention policy could not answer on its own. Keeping ten releases on disk does not mean you can roll back ten releases — you can roll back to the oldest release that still works against the schema you have <em>now</em>. If you run expand–contract with a one-week gap between expand and contract, that is roughly "one week". If you rename columns in place, it is "zero releases", and the ten directories on disk are decoration.</p>

<div class="kv-grid">
<div class="kv"><span class="k">rollback distance</span><span class="v">the number of releases back you can go and still work against today's schema</span></div>
<div class="kv"><span class="k">set by</span><span class="v">the gap between your expand and contract phases — not by disk retention</span></div>
<div class="kv"><span class="k">measured how</span><span class="v">start release N-1 against the current database and hit a real endpoint. That is the whole test.</span></div>
<div class="kv"><span class="k">what breaks it</span><span class="v">any migration that removes something the previous release reads</span></div>
</div>

<p>And that last row is a test you can run before you ever need it — it is exactly what I did above, and it took one <code>curl</code>.</p>

<h3>Run it yourself: the lying rollback on the lab VPS</h3>
<p>The measurement at the top of this lesson came from the original sandbox. It reproduces in a few lines on the lab VPS from Lesson 6.1 (PostgreSQL 16.15, Node 18). The test app does not need a database driver: it asks <code>psql</code>, which is enough to show the shape. Release <code>v1</code> reads column <code>ten</code>, <code>v2</code> reads <code>ho_ten</code>, and <code>/health</code> answers before touching anything:</p>
<pre><code class="language-javascript">// app-db.mjs (trich) — /health nong, /don doc cot qua psql
const COT = BAN === 'v1' ? 'ten' : 'ho_ten';          // v2 doc cot moi
const sql = (q) =&gt; execFileSync('psql', ['-d', 'lab', '-XtAc', q], { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
if (req.url === '/health') { res.writeHead(200); return res.end('ok\\n'); }
try { res.writeHead(200, { 'x-ban': BAN }); res.end(sql(&#96;select \${COT} from don order by id limit 1&#96;) + '\\n'); }
catch (e) { res.writeHead(500); res.end(String(e.stderr).split('\\n')[0] + '\\n'); }</code></pre>
<pre><code class="language-bash"># do-62.sh — dung lui.sh cua bai 6.1 voi GOC=~/lui2
kiem(){ for u in /health /don; do printf "  %-8s %s  " $u "$(curl -s -o /tmp/b -w '%{http_code}' localhost:3300$u)"; cat /tmp/b; done; }
echo "=== 1. v1 tren luoc do cu ==="; ./lui.sh v1 &gt;/dev/null; kiem
echo "=== 2. deploy v2: doi ten cot roi trao ma ==="; psql -d lab -Xc "alter table don rename column ten to ho_ten"; ./lui.sh v2 &gt;/dev/null; kiem
echo "=== 3. LUI ma ve v1, khong dung CSDL ==="; ./lui.sh v1 &gt;/dev/null; kiem</code></pre>
<div class="out">=== 1. v1 tren luoc do cu ===
  /health  200  ok
  /don     200  khach 1
=== 2. deploy v2: doi ten cot roi trao ma ===
ALTER TABLE
  /health  200  ok
  /don     200  khach 1
=== 3. LUI ma ve v1, khong dung CSDL ===
  /health  200  ok
  /don     500  ERROR:  column "ten" does not exist</div>
<p>Same result as the sandbox, on a different machine and a different PostgreSQL minor version: the health endpoint and the real endpoint disagree, and only the real one is telling the truth. Then the same scenario done the expand way — keep <code>ten</code>, add <code>ho_ten</code>, copy the data:</p>
<div class="out">=== 4. lam lai theo MO RONG: giu ten, them ho_ten ===
 v2:
  /health  200  ok
  /don     200  khach 1
 lui ve v1:
  /health  200  ok
  /don     200  khach 1</div>
<p>Both directions work, and the rollback is again the harmless 150-millisecond pointer move of 6.1. The only thing that changed is the migration.</p>

<h3>git revert is not a rollback — and it does not touch the database</h3>
${slide('dv-06', 13, 'git revert xoá tệp migration, CSDL giữ cột')}
<p>This project's own rollback procedure starts with <code>git revert &lt;bad_commit_sha&gt;</code>, followed immediately by a warning: <em>if the bad deploy included a migration, discuss before reverting — reverting code does not revert the database.</em> Measured, to see exactly what that sentence means. A commit that changes code <em>and</em> adds a migration, then reverted:</p>
<div class="out">$ git log --oneline
fe90aec v42: doi don vi gia + them cot ghi_boi
db72d38 v41: tinh gia
$ git revert --no-edit HEAD
[main 3f49440] Revert "v42: doi don vi gia + them cot ghi_boi"
 Date: Tue Sep 29 13:38:56 2026 +0700
 2 files changed, 1 insertion(+), 2 deletions(-)
 delete mode 100644 prisma/migrations/20260929_them_cot/migration.sql</div>
<p>The revert deleted the migration file — which is exactly what this project forbids for any migration already deployed. Then, against a PostgreSQL where that migration had already run (Prisma 5.22 from the Mac, through an SSH tunnel to the lab VPS), after removing the migration folder the same way:</p>
<div class="out">$ psql -d lab -c "\\d don"
…
 ghi_boi | text    |           |          |
$ npx prisma migrate status
…
1 migration found in prisma/migrations

Database schema is up to date!</div>
<p>The column is still there, the ledger <code>_prisma_migrations</code> still records the migration as finished, and <code>migrate status</code> — and <code>migrate deploy</code>, which printed <code>No pending migrations to apply.</code> — report green. Nothing tells you the history in git and the history in the database now disagree. The next person who adds a migration builds on a schema that the repository no longer describes.</p>
${slide('dv-06', 14, 'git revert và lùi ảnh là hai việc khác nhau')}
<div class="kv-grid">
  <div class="kv"><span class="k">Rolling back the image or symlink</span><span class="v">Runs an OLD artifact again. Seconds. Stops the damage now. But <code>main</code> still contains the bug, so the next deploy ships it again.</span></div>
  <div class="kv"><span class="k"><code>git revert</code></span><span class="v">A NEW commit that undoes the bad one. Minutes (CI, build, deploy). Makes history correct so the bug does not come back. Touches no database.</span></div>
  <div class="kv"><span class="k">In an incident, the order</span><span class="v">Roll back the artifact first to stop the clock; revert on <code>main</code> right after; if the bad commit had a migration, stop and decide together — keep the migration file, and write a NEW migration if the schema really must go back.</span></div>
  <div class="kv"><span class="k">Never</span><span class="v"><code>git push --force</code> to "roll back" <code>main</code>: it rewrites shared history and still leaves the database where it was.</span></div>
</div>

<h3>For first-timers: "health check", "readiness", "smoke test"</h3>
<p>Three words that sound alike and do different jobs. A <strong>liveness</strong> check answers "is the process alive?" and a supervisor restarts it if not — so it must be shallow, or a slow database causes restart loops. A <strong>readiness</strong> check answers "should traffic be sent here yet?" — a load balancer or a deploy script waits for it. A <strong>smoke test</strong> calls real endpoints that touch real tables, once, right after a version change. Lesson 6.1's <code>lui.sh</code> waits for readiness; nothing in it is a smoke test, which is exactly how 6.2 slipped through. This project's deploy runs a smoke test that treats <strong>401/200 as "route mounted" and 404 as "stale image"</strong>; adding one GET that reads a table catches a schema mismatch as well.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your team's v2 renamed a column and shipped fine; twenty minutes later an unrelated bug forces a rollback, and the rollback script prints a green tick while every order page is broken. Reproduce it, then make it impossible. Use the lab VPS from 6.1 (it has PostgreSQL 16).</p>
<ol>
<li>As root in the container (<code>docker exec -it vps-thu6 bash</code>): <code>pg_ctlcluster 16 main start</code>, then <code>su postgres -c "createuser -s deploy"</code> and <code>su postgres -c "createdb -O deploy lab"</code>.</li>
<li>As <code>deploy</code>: create table <code>don(id serial, ten text, so_tien int)</code> with one row; make <code>~/lui2/ban/v1</code> and <code>v2</code> from <code>app-db.mjs</code> (v1 reads <code>ten</code>, v2 reads <code>ho_ten</code>) — start from 6.1's <code>app.mjs</code>, add <code>import { execFileSync } from 'node:child_process';</code> and the lines shown above.</li>
<li>Run steps 1–3 of <code>do-62.sh</code> with <code>GOC=~/lui2</code>. Record <code>/health</code> and <code>/don</code> after the rollback.</li>
<li>Rename the column back, then redo the change the expand way (<code>add column ho_ten text; update don set ho_ten = ten</code>), deploy v2, roll back to v1.</li>
</ol>
<p><strong>Done when:</strong> you have two tables of results — the first ending in <code>/health 200</code> and <code>/don 500 … column "ten" does not exist</code>, the second with <code>200</code> everywhere — and one sentence explaining why <code>/health</code> could not tell them apart.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Liveness check</span><span class="v">"Is the process alive?" — shallow on purpose; failing it gets the process restarted.</span></div>
  <div class="kv"><span class="k">Readiness check</span><span class="v">"Can it take traffic yet?" — what a rollback script waits for.</span></div>
  <div class="kv"><span class="k">Smoke test</span><span class="v">A few real requests against real data right after a version change.</span></div>
  <div class="kv"><span class="k">Schema mismatch</span><span class="v">Code expecting a shape of database that is not the one running.</span></div>
  <div class="kv"><span class="k"><code>git revert</code></span><span class="v">A new commit that undoes an old one; history-safe, but it never changes a database.</span></div>
  <div class="kv"><span class="k">Rollback distance</span><span class="v">How many releases back still work against today's schema — set by the gap between expand and contract.</span></div>
  <div class="kv"><span class="k">Expand–contract</span><span class="v">Add the new shape first, remove the old one releases later, so the previous release always runs.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Rolling code back over a schema that moved on gives <code>/health 200</code> and real endpoints 500 — measured twice, on two machines.</li>
<li>Health checks stay shallow on purpose; the check that catches schema problems is a smoke test in the deploy or rollback script.</li>
<li>A migration is safe when the <em>previous</em> release still works with the new schema; expand–contract makes rollback trivial again.</li>
<li><code>git revert</code> of a commit with a migration deletes the migration file and leaves the database untouched — and Prisma still says "up to date".</li>
<li>In an incident: roll back the artifact to stop the damage, then revert on <code>main</code>; a migration in the bad commit means stop and decide together.</li>
<li>How far back you can go is decided by your schema history, not by how many releases sit on disk.</li>
</ul>

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
${slide('dv-06', 10, '/health 200, còn mọi request thật 500')}
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
${slide('dv-06', 11, 'Chốt kiểm sức khoẻ nông là có chủ đích')}
<p>Vì bản chất của một endpoint sức khoẻ thường là thế này:</p>

<pre><code class="language-bash">if (req.url === "/health") { res.writeHead(200); return res.end("ok\\n"); }</code></pre>

<p>Nó trả lời TRƯỚC KHI đụng vào bất cứ thứ gì. Nó không mở kết nối cơ sở dữ liệu, không chạy truy vấn, không đọc giá trị cấu hình nào. Đó là CỐ Ý — một chốt kiểm sức khoẻ có nói chuyện với cơ sở dữ liệu sẽ báo ứng dụng là ốm trong lúc cơ sở dữ liệu chớp một cái, rồi bị cái thứ đang giám sát nó giết chết, biến một cú nấc năm giây của cơ sở dữ liệu thành một vòng lặp khởi động lại. Nên chốt kiểm sức khoẻ được giữ NÔNG có chủ đích, mà một chốt kiểm nông thì không thể nào phát hiện được một cú lệch lược đồ.</p>

<div class="pitfall">
<p><strong>Bẫy — chốt kiểm sức khoẻ "sâu" KHÔNG phải cách chữa.</strong> Phản ứng hiển nhiên là bắt <code>/health</code> chạy <code>SELECT 1</code>. Cái đó bắt được "cơ sở dữ liệu không với tới được" và vẫn TRẬT hoàn toàn ca này: <code>SELECT 1</code> thành công mỹ mãn trên một lược đồ mà mã của bạn không đọc nổi. Để bắt được <em>CA NÀY</em> thì chốt kiểm phải chạy một truy vấn thật trên một bảng thật — mà tới lúc đó nó không còn là chốt kiểm sức khoẻ nữa, nó là một phép kiểm khói, và chỗ của nó là trong script deploy chứ không phải trên một endpoint mà bộ cân bằng tải gõ hai giây một lần.</p>
</div>

<h3>Cách chữa, và giá của nó</h3>
${slide('dv-06', 12, 'Thay đổi lược đồ nào lùi được')}
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
${slide('dv-06', 15, 'Tầm lùi đo bằng lược đồ, không bằng đĩa')}
<p>Đây là câu mà luật giữ bản của 6.1 tự nó không trả lời được. Giữ mười bản trên đĩa KHÔNG có nghĩa là bạn lùi được mười bản — bạn lùi được tới bản CŨ NHẤT còn chạy được với cái lược đồ bạn có <em>BÂY GIỜ</em>. Nếu bạn chạy mở-rộng–thu-hẹp với khoảng cách một tuần giữa hai giai đoạn, thì con số đó đại khái là "một tuần". Nếu bạn đổi tên cột tại chỗ, nó là "không bản nào", và mười thư mục trên đĩa chỉ để trang trí.</p>

<div class="kv-grid">
<div class="kv"><span class="k">tầm lùi</span><span class="v">số bản bạn lùi về được mà vẫn chạy với lược đồ hôm nay</span></div>
<div class="kv"><span class="k">do cái gì quyết định</span><span class="v">khoảng cách giữa giai đoạn mở rộng và thu hẹp — KHÔNG phải luật giữ bản trên đĩa</span></div>
<div class="kv"><span class="k">đo bằng cách nào</span><span class="v">khởi động bản N-1 với cơ sở dữ liệu hiện tại rồi gõ vào một endpoint thật. Toàn bộ phép kiểm là thế.</span></div>
<div class="kv"><span class="k">cái gì phá nó</span><span class="v">bất kỳ migration nào bỏ đi một thứ mà bản trước đó đọc</span></div>
</div>

<p>Và cái dòng cuối ấy là một phép kiểm bạn chạy được TRƯỚC KHI cần tới nó — đó chính xác là thứ tôi vừa làm ở trên, và nó tốn đúng một lệnh <code>curl</code>.</p>

<h3>Tự chạy: cú lùi nói dối trên VPS thí nghiệm</h3>
<p>Phép đo ở đầu bài lấy từ hộp cát gốc. Nó tái hiện được bằng vài dòng trên VPS thí nghiệm của bài 6.1 (PostgreSQL 16.15, Node 18). Ứng dụng thử không cần trình điều khiển CSDL: nó hỏi <code>psql</code>, vậy là đủ để thấy hình dạng. Bản <code>v1</code> đọc cột <code>ten</code>, <code>v2</code> đọc <code>ho_ten</code>, còn <code>/health</code> trả lời trước khi đụng vào bất cứ thứ gì:</p>
<pre><code class="language-javascript">// app-db.mjs (trich) — /health nong, /don doc cot qua psql
const COT = BAN === 'v1' ? 'ten' : 'ho_ten';          // v2 doc cot moi
const sql = (q) =&gt; execFileSync('psql', ['-d', 'lab', '-XtAc', q], { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
if (req.url === '/health') { res.writeHead(200); return res.end('ok\\n'); }
try { res.writeHead(200, { 'x-ban': BAN }); res.end(sql(&#96;select \${COT} from don order by id limit 1&#96;) + '\\n'); }
catch (e) { res.writeHead(500); res.end(String(e.stderr).split('\\n')[0] + '\\n'); }</code></pre>
<pre><code class="language-bash"># do-62.sh — dung lui.sh cua bai 6.1 voi GOC=~/lui2
kiem(){ for u in /health /don; do printf "  %-8s %s  " $u "$(curl -s -o /tmp/b -w '%{http_code}' localhost:3300$u)"; cat /tmp/b; done; }
echo "=== 1. v1 tren luoc do cu ==="; ./lui.sh v1 &gt;/dev/null; kiem
echo "=== 2. deploy v2: doi ten cot roi trao ma ==="; psql -d lab -Xc "alter table don rename column ten to ho_ten"; ./lui.sh v2 &gt;/dev/null; kiem
echo "=== 3. LUI ma ve v1, khong dung CSDL ==="; ./lui.sh v1 &gt;/dev/null; kiem</code></pre>
<div class="out">=== 1. v1 tren luoc do cu ===
  /health  200  ok
  /don     200  khach 1
=== 2. deploy v2: doi ten cot roi trao ma ===
ALTER TABLE
  /health  200  ok
  /don     200  khach 1
=== 3. LUI ma ve v1, khong dung CSDL ===
  /health  200  ok
  /don     500  ERROR:  column "ten" does not exist</div>
<p>Cùng kết quả với hộp cát, trên một máy khác và một bản PostgreSQL khác: endpoint sức khoẻ và endpoint thật cãi nhau, và chỉ cái thật là nói thật. Rồi cùng kịch bản ấy làm theo kiểu MỞ RỘNG — giữ <code>ten</code>, thêm <code>ho_ten</code>, chép dữ liệu sang:</p>
<div class="out">=== 4. lam lai theo MO RONG: giu ten, them ho_ten ===
 v2:
  /health  200  ok
  /don     200  khach 1
 lui ve v1:
  /health  200  ok
  /don     200  khach 1</div>
<p>Cả hai chiều đều chạy, và cú lùi lại là cú dời con trỏ 150 mili giây vô hại của bài 6.1. Thứ DUY NHẤT thay đổi là cái migration.</p>

<h3>git revert không phải lùi bản — và nó không đụng tới cơ sở dữ liệu</h3>
${slide('dv-06', 13, 'git revert xoá tệp migration, CSDL giữ cột')}
<p>Quy trình lùi bản của chính dự án này bắt đầu bằng <code>git revert &lt;bad_commit_sha&gt;</code>, và ngay sau đó là một lời cảnh báo: <em>nếu lần deploy hỏng có kèm migration, hãy bàn trước khi revert — revert mã không revert cơ sở dữ liệu.</em> Đo thật, để thấy câu đó nghĩa CHÍNH XÁC là gì. Một commit vừa đổi mã VỪA thêm một migration, rồi đem revert:</p>
<div class="out">$ git log --oneline
fe90aec v42: doi don vi gia + them cot ghi_boi
db72d38 v41: tinh gia
$ git revert --no-edit HEAD
[main 3f49440] Revert "v42: doi don vi gia + them cot ghi_boi"
 Date: Tue Sep 29 13:38:56 2026 +0700
 2 files changed, 1 insertion(+), 2 deletions(-)
 delete mode 100644 prisma/migrations/20260929_them_cot/migration.sql</div>
<p>Cú revert đã XOÁ tệp migration — đúng thứ mà dự án này cấm với mọi migration đã deploy. Rồi, trên một PostgreSQL mà migration ấy đã chạy rồi (Prisma 5.22 từ Mac, qua đường hầm SSH vào VPS thí nghiệm), sau khi thư mục migration bị xoá theo đúng cách đó:</p>
<div class="out">$ psql -d lab -c "\\d don"
…
 ghi_boi | text    |           |          |
$ npx prisma migrate status
…
1 migration found in prisma/migrations

Database schema is up to date!</div>
<p>Cột vẫn còn đó, sổ <code>_prisma_migrations</code> vẫn ghi migration ấy đã xong, và <code>migrate status</code> — cả <code>migrate deploy</code>, lệnh in ra <code>No pending migrations to apply.</code> — đều báo xanh. Không gì cho bạn biết lịch sử trong git và lịch sử trong CSDL giờ đã lệch nhau. Người kế tiếp thêm migration sẽ xây trên một lược đồ mà kho mã không còn mô tả nữa.</p>
${slide('dv-06', 14, 'git revert và lùi ảnh là hai việc khác nhau')}
<div class="kv-grid">
  <div class="kv"><span class="k">Lùi ảnh hoặc symlink</span><span class="v">Chạy lại một tạo tác CŨ. Vài giây. Chặn thiệt hại NGAY. Nhưng <code>main</code> vẫn chứa bug, nên lần deploy kế tiếp lại mang nó lên.</span></div>
  <div class="kv"><span class="k"><code>git revert</code></span><span class="v">Một commit MỚI đảo ngược commit hỏng. Hàng phút (CI, build, deploy). Làm lịch sử đúng để bug không quay lại. Không đụng CSDL nào.</span></div>
  <div class="kv"><span class="k">Thứ tự khi có sự cố</span><span class="v">Lùi tạo tác trước để dừng đồng hồ; revert trên <code>main</code> ngay sau đó; nếu commit hỏng có migration thì DỪNG và cùng quyết — giữ tệp migration, và viết một migration MỚI nếu lược đồ thật sự phải lùi.</span></div>
  <div class="kv"><span class="k">Không bao giờ</span><span class="v"><code>git push --force</code> để "lùi" <code>main</code>: nó viết lại lịch sử chung mà CSDL vẫn nằm nguyên chỗ cũ.</span></div>
</div>

<h3>Cho người mới: "health check", "readiness", "smoke test"</h3>
<p>Ba từ nghe na ná mà làm ba việc khác nhau. Phép kiểm <strong>liveness</strong> (còn sống) trả lời "tiến trình còn sống không?" và trình giám sát sẽ khởi động lại nếu không — nên nó phải NÔNG, không thì một CSDL chậm sinh ra vòng lặp khởi động lại. Phép kiểm <strong>readiness</strong> (sẵn sàng) trả lời "đã nên đưa lưu lượng vào đây chưa?" — bộ cân bằng tải hay script deploy chờ nó. <strong>Smoke test</strong> (phép kiểm khói) gọi endpoint THẬT chạm bảng THẬT, một lần, ngay sau khi đổi phiên bản. <code>lui.sh</code> của bài 6.1 chờ readiness; không có gì trong đó là smoke test, và đó chính là đường 6.2 lọt qua. Script deploy của dự án này có smoke test coi <strong>401/200 là "có route" và 404 là "ảnh cũ"</strong>; thêm một GET đọc bảng là bắt được cả lệch lược đồ.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> v2 của nhóm đổi tên một cột và lên êm; hai mươi phút sau một bug chẳng liên quan buộc phải lùi bản, và script lùi in dấu tích xanh trong khi mọi trang đơn hàng đều vỡ. Tái hiện nó, rồi làm cho nó không thể xảy ra. Dùng VPS thí nghiệm của bài 6.1 (đã có PostgreSQL 16).</p>
<ol>
<li>Với quyền root trong container (<code>docker exec -it vps-thu6 bash</code>): <code>pg_ctlcluster 16 main start</code>, rồi <code>su postgres -c "createuser -s deploy"</code> và <code>su postgres -c "createdb -O deploy lab"</code>.</li>
<li>Với user <code>deploy</code>: tạo bảng <code>don(id serial, ten text, so_tien int)</code> có một dòng; dựng <code>~/lui2/ban/v1</code> và <code>v2</code> từ <code>app-db.mjs</code> (v1 đọc <code>ten</code>, v2 đọc <code>ho_ten</code>) — lấy <code>app.mjs</code> của bài 6.1, thêm <code>import { execFileSync } from 'node:child_process';</code> và mấy dòng ở trên.</li>
<li>Chạy bước 1–3 của <code>do-62.sh</code> với <code>GOC=~/lui2</code>. Ghi lại <code>/health</code> và <code>/don</code> sau cú lùi.</li>
<li>Đổi tên cột về như cũ, rồi làm lại thay đổi theo kiểu mở rộng (<code>add column ho_ten text; update don set ho_ten = ten</code>), deploy v2, lùi về v1.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có hai bảng kết quả — bảng đầu kết thúc bằng <code>/health 200</code> và <code>/don 500 … column "ten" does not exist</code>, bảng sau toàn <code>200</code> — và một câu giải thích vì sao <code>/health</code> không phân biệt được hai trường hợp.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Liveness check (phép kiểm còn sống)</span><span class="v">"Tiến trình còn sống không?" — cố ý giữ nông; trượt thì bị khởi động lại.</span></div>
  <div class="kv"><span class="k">Readiness check (phép kiểm sẵn sàng)</span><span class="v">"Nhận lưu lượng được chưa?" — thứ script lùi bản chờ.</span></div>
  <div class="kv"><span class="k">Smoke test (phép kiểm khói)</span><span class="v">Vài request thật trên dữ liệu thật ngay sau khi đổi phiên bản.</span></div>
  <div class="kv"><span class="k">Schema mismatch (lệch lược đồ)</span><span class="v">Mã chờ một hình dạng CSDL khác với cái đang chạy.</span></div>
  <div class="kv"><span class="k"><code>git revert</code> (đảo commit)</span><span class="v">Một commit mới đảo ngược commit cũ; an toàn cho lịch sử, nhưng không bao giờ đổi CSDL.</span></div>
  <div class="kv"><span class="k">Rollback distance (tầm lùi)</span><span class="v">Lùi được bao nhiêu bản mà vẫn chạy với lược đồ hôm nay — do khoảng cách mở rộng→thu hẹp quyết.</span></div>
  <div class="kv"><span class="k">Expand–contract (mở rộng–thu hẹp)</span><span class="v">Thêm hình dạng mới trước, bỏ hình dạng cũ vài bản sau, để bản trước luôn chạy được.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lùi mã lên một lược đồ đã đi tiếp cho ra <code>/health 200</code> còn endpoint thật 500 — đo hai lần, trên hai máy.</li>
<li>Chốt kiểm sức khoẻ cố ý giữ nông; thứ bắt được lệch lược đồ là smoke test trong script deploy/lùi.</li>
<li>Một migration an toàn khi bản <em>TRƯỚC</em> vẫn chạy với lược đồ mới; mở rộng–thu hẹp làm cú lùi lại trở nên vô hại.</li>
<li><code>git revert</code> một commit có migration sẽ xoá tệp migration mà CSDL vẫn y nguyên — và Prisma vẫn báo "up to date".</li>
<li>Khi có sự cố: lùi tạo tác để chặn thiệt hại, rồi revert trên <code>main</code>; commit hỏng có migration thì dừng lại cùng quyết.</li>
<li>Lùi xa được tới đâu là do lịch sử lược đồ quyết, không phải do số bản đang nằm trên đĩa.</li>
</ul>

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
${slide('dv-06', 16, 'Lùi bản cầm máu, không chữa vết thương')}
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
${slide('dv-06', 17, 'Tìm dòng hỏng: ba cách, ba độ chính xác')}
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
${slide('dv-06', 19, 'DROP COLUMN 1,3 ms: nhanh nhất, một chiều')}
<p>Dropping a column is the one migration in this course that is genuinely one-way. It is also, measured, the <em>fastest</em> thing in the entire course. On a 200,000-row table with real data in it:</p>

<pre><code class="language-sql">alter table kh drop column dien_thoai;</code></pre>

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

<pre><code class="language-sql">select attname, attnum, attisdropped from pg_attribute
 where attrelid='kh'::regclass and attnum &gt; 0;</code></pre>

<div class="out">           attname            | attnum | attisdropped
------------------------------+--------+--------------
 id                           |      1 | f
 email                        |      2 | f
 ........pg.dropped.3........ |      3 | t
 ghi_chu                      |      4 | f
 dien_thoai                   |      5 | f</div>

<p>The dropped column is still row 3 of the catalogue, renamed to a placeholder and flagged. The new <code>dien_thoai</code> is <code>attnum = 5</code> — a different column that happens to share a name. And with <code>pageinspect</code> you can read the raw heap and find the data still sitting there:</p>

<pre><code class="language-bash">create extension if not exists pageinspect;
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

<h3>Measured: what a version stamp buys — and what it does not</h3>
${slide('dv-06', 18, 'ghi_boi: đóng dấu phiên bản vào từng dòng')}
<p>The section above recommends a <code>ghi_boi</code> column. Here it is on the lab VPS, with the stamp filled in by the database itself: the column's default is the connection's <code>application_name</code>, which a libpq client sets from <code>PGAPPNAME</code> or <code>?application_name=</code> in the connection URL. Scenario: v2 is live; v3 goes live with a bug on the order path (amounts ×1000) while its sign-up path is fine; during the blue-green overlap v2 is still draining requests; then everything is rolled back to v2.</p>
<pre><code class="language-bash"># do-63.sql — dong dau phien ban vao tung dong
create table ghi (
  id      bigserial primary key,
  nguon   text not null,                       -- duong ghi: 'don' | 'dang-ky'
  so_tien int,
  ghi_boi text not null default current_setting('application_name'),
  luc     timestamptz not null default clock_timestamp()
);
# do-63.sh (trich) — moi "ban" ghi qua mot ket noi mang ten cua no
ghi(){ PGAPPNAME=$1 psql -d lab -qXc "insert into ghi(nguon, so_tien) select '$2', $3 from generate_series(1,$4)"; }
ghi v2 don 100 50; ghi v2 dang-ky 0 20
T1=$(psql -d lab -XtAc "select clock_timestamp()")
ghi v3 don 100000 30; ghi v3 dang-ky 0 10            # v3 song: /don hong
ghi v2 don 100 25                                    # xanh/lam: v2 van xa request
T2=$(psql -d lab -XtAc "select clock_timestamp()")
ghi v2 don 100 15                                    # da lui ve v2</code></pre>
<div class="out"> ghi_boi |  nguon  | count |  max
---------+---------+-------+--------
 v2      | dang-ky |    20 |      0
 v2      | don     |    90 |    100
 v3      | dang-ky |    10 |      0
 v3      | don     |    30 | 100000
(4 rows)

            cach             | dinh | that_su_hong
-----------------------------+------+--------------
 cua so thoi gian            |   65 |           30
 ghi_boi = v3                |   40 |           30
 ghi_boi = v3 va nguon = don |   30 |           30
(3 rows)</div>
<ul>
<li><strong>The time window caught 65 rows to fix 30</strong> — and the extra 35 include 25 rows written by the <em>good</em> version, because during a blue-green overlap two versions write at the same time. Time cannot separate them; a stamp can.</li>
<li><strong><code>ghi_boi = 'v3'</code> alone still caught 10 innocent rows</strong>: the sign-up rows that v3 wrote correctly. The stamp tells you <em>which release</em> wrote a row, not <em>which code path</em>. Without the overlap, a version stamp and a time window select the same rows — its value appears exactly when versions overlap or timestamps are fuzzy.</li>
<li><strong>Stamp plus path was exact: 30 of 30.</strong> In this measurement the path was a column; in a real app it can be the table itself, an <code>action</code> field, or the request route recorded in an audit table.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Trap — relying on a connection parameter you do not control.</strong> The <code>application_name</code> trick works when every writer sets it; a pooled connection, a migration script or a manual <code>psql</code> session each write whatever their own setting is. With Prisma the dependable form is explicit: write <code>ghiBoi: process.env.BAN</code> in the code, where <code>BAN</code> is the version the build stamped into the artifact (Chapter 1). A default is a safety net, not the mechanism.</div>

<h3>What "cleaning up" actually means</h3>
<p>Once the rows are identified, you still have to decide what to do with them, and "delete" is rarely the answer — an order with a wrong amount is still an order somebody placed. The usual order of operations: <strong>copy first</strong> (<code>create table ghi_hong_20260929 as select … where ghi_boi = 'v3' and nguon = 'don'</code>) so the evidence survives the fix; <strong>correct in place in one transaction</strong> (<code>update … set so_tien = so_tien / 1000 where …</code>) with the same <code>WHERE</code> you counted; <strong>compare counts</strong> — the <code>UPDATE</code> must report exactly the number your <code>SELECT count(*)</code> returned; then <strong>tell the people affected</strong> if they saw the wrong number (which is Lesson 6.4's problem). Chapter 10's backups are for when the data cannot be derived back at all.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> for eighteen seconds your team's v3 multiplied every order amount by 1000; it has been rolled back, and the teacher asks "which orders are wrong, exactly?". Use the lab VPS and database from 6.2.</p>
<ol>
<li>Create table <code>ghi</code> from <code>do-63.sql</code>. Run the <code>ghi</code> calls from <code>do-63.sh</code> in the same order, including the v2 rows during the overlap.</li>
<li>Count the rows each method would touch: time window between <code>T1</code> and <code>T2</code>; <code>ghi_boi = 'v3'</code>; <code>ghi_boi = 'v3' and nguon = 'don'</code>.</li>
<li>Copy the exact set into a table <code>ghi_hong</code>, then correct it in one transaction with <code>update … set so_tien = so_tien / 1000</code> using the same <code>WHERE</code>.</li>
<li>Check: <code>select max(so_tien) from ghi</code> must now be 100.</li>
</ol>
<p><strong>Done when:</strong> you have the three numbers 65 / 40 / 30, the <code>UPDATE</code> reported <code>UPDATE 30</code>, <code>ghi_hong</code> holds 30 rows, and <code>max(so_tien)</code> is 100.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Poisoned rows</span><span class="v">Data written by a bad version; a rollback leaves every one of them in place.</span></div>
  <div class="kv"><span class="k">Time-window cleanup</span><span class="v">Selecting "everything written between deploy and rollback" — always available, never exact.</span></div>
  <div class="kv"><span class="k">Version stamp</span><span class="v">A column recording which release wrote the row (<code>ghi_boi</code>).</span></div>
  <div class="kv"><span class="k">Write path</span><span class="v">Which piece of code wrote the row (route, action); with the stamp, it makes the selection exact.</span></div>
  <div class="kv"><span class="k"><code>application_name</code></span><span class="v">A per-connection label a PostgreSQL client can set; a column default can read it.</span></div>
  <div class="kv"><span class="k">Catalog-only change</span><span class="v">A DDL that edits metadata instead of rewriting rows — why <code>DROP COLUMN</code> takes 1.3 ms.</span></div>
  <div class="kv"><span class="k"><code>VACUUM FULL</code></span><span class="v">Rewrites the table and finally removes dropped bytes, under an exclusive lock.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A rollback changes which code runs; every row the bad version wrote stays, indistinguishable unless you can name what made it bad.</li>
<li>Damage = how long the bad version lived × how many writes per second it served.</li>
<li>Cleaning up by time window touched 65 rows to fix 30 in the lab, because the old version was still writing during the overlap.</li>
<li>A version stamp removes the overlap problem; stamp plus write path was exact — and it has to exist before the incident.</li>
<li><code>DROP COLUMN</code> is the fastest statement in the course and the only truly one-way migration; drop in a later release, after the rollback distance has passed.</li>
<li>Clean up by copying first, correcting in one transaction, and checking that the row counts match.</li>
</ul>

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
${slide('dv-06', 16, 'Lùi bản cầm máu, không chữa vết thương')}
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
${slide('dv-06', 17, 'Tìm dòng hỏng: ba cách, ba độ chính xác')}
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
${slide('dv-06', 19, 'DROP COLUMN 1,3 ms: nhanh nhất, một chiều')}
<p>Xoá một cột là migration duy nhất trong khoá này thật sự MỘT CHIỀU. Nó cũng là, đo thật, thứ <em>NHANH NHẤT</em> trong cả khoá học. Trên một bảng 200.000 dòng có dữ liệu thật:</p>

<pre><code class="language-sql">alter table kh drop column dien_thoai;</code></pre>

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

<pre><code class="language-sql">select attname, attnum, attisdropped from pg_attribute
 where attrelid='kh'::regclass and attnum &gt; 0;</code></pre>

<div class="out">           attname            | attnum | attisdropped
------------------------------+--------+--------------
 id                           |      1 | f
 email                        |      2 | f
 ........pg.dropped.3........ |      3 | t
 ghi_chu                      |      4 | f
 dien_thoai                   |      5 | f</div>

<p>Cột đã xoá vẫn là dòng số 3 của danh mục, đổi tên thành một chỗ giữ chỗ và gắn cờ. Cột <code>dien_thoai</code> MỚI là <code>attnum = 5</code> — một cột KHÁC tình cờ trùng tên. Và với <code>pageinspect</code> bạn đọc được trang heap thô và thấy dữ liệu vẫn ngồi đó:</p>

<pre><code class="language-bash">create extension if not exists pageinspect;
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

<h3>Đo thật: dấu phiên bản mua được gì — và không mua được gì</h3>
${slide('dv-06', 18, 'ghi_boi: đóng dấu phiên bản vào từng dòng')}
<p>Đoạn trên khuyên thêm cột <code>ghi_boi</code>. Đây là nó trên VPS thí nghiệm, với con dấu do chính cơ sở dữ liệu điền: giá trị mặc định của cột là <code>application_name</code> của kết nối, thứ mà một trình khách libpq đặt từ biến <code>PGAPPNAME</code> hoặc từ <code>?application_name=</code> trong URL kết nối. Kịch bản: v2 đang chạy; v3 lên với một lỗi ở đường ghi ĐƠN HÀNG (số tiền ×1000) trong khi đường ĐĂNG KÝ của nó vẫn đúng; trong lúc xanh/lam chồng nhau, v2 vẫn còn xả request; rồi mọi thứ được lùi về v2.</p>
<pre><code class="language-bash"># do-63.sql — dong dau phien ban vao tung dong
create table ghi (
  id      bigserial primary key,
  nguon   text not null,                       -- duong ghi: 'don' | 'dang-ky'
  so_tien int,
  ghi_boi text not null default current_setting('application_name'),
  luc     timestamptz not null default clock_timestamp()
);
# do-63.sh (trich) — moi "ban" ghi qua mot ket noi mang ten cua no
ghi(){ PGAPPNAME=$1 psql -d lab -qXc "insert into ghi(nguon, so_tien) select '$2', $3 from generate_series(1,$4)"; }
ghi v2 don 100 50; ghi v2 dang-ky 0 20
T1=$(psql -d lab -XtAc "select clock_timestamp()")
ghi v3 don 100000 30; ghi v3 dang-ky 0 10            # v3 song: /don hong
ghi v2 don 100 25                                    # xanh/lam: v2 van xa request
T2=$(psql -d lab -XtAc "select clock_timestamp()")
ghi v2 don 100 15                                    # da lui ve v2</code></pre>
<div class="out"> ghi_boi |  nguon  | count |  max
---------+---------+-------+--------
 v2      | dang-ky |    20 |      0
 v2      | don     |    90 |    100
 v3      | dang-ky |    10 |      0
 v3      | don     |    30 | 100000
(4 rows)

            cach             | dinh | that_su_hong
-----------------------------+------+--------------
 cua so thoi gian            |   65 |           30
 ghi_boi = v3                |   40 |           30
 ghi_boi = v3 va nguon = don |   30 |           30
(3 rows)</div>
<ul>
<li><strong>Cửa sổ thời gian đụng 65 dòng để sửa 30</strong> — và trong 35 dòng thừa có 25 dòng do bản <em>TỐT</em> ghi, vì trong lúc xanh/lam chồng nhau hai phiên bản ghi CÙNG lúc. Thời gian không tách được chúng; con dấu thì tách được.</li>
<li><strong>Riêng <code>ghi_boi = 'v3'</code> vẫn dính 10 dòng vô tội</strong>: các dòng đăng ký mà v3 ghi ĐÚNG. Con dấu cho biết <em>bản nào</em> ghi dòng đó, không cho biết <em>đường mã nào</em>. Không có đoạn chồng nhau thì dấu phiên bản và cửa sổ thời gian chọn ra cùng một tập — giá trị của nó hiện ra đúng lúc các phiên bản chồng nhau hoặc dấu thời gian không chắc.</li>
<li><strong>Dấu phiên bản cộng đường ghi thì chính xác: 30 trên 30.</strong> Trong phép đo này đường ghi là một cột; ở ứng dụng thật nó có thể là chính cái bảng, một trường <code>action</code>, hay route của request được ghi trong bảng nhật ký.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Bẫy — trông vào một tham số kết nối mà bạn không kiểm soát.</strong> Mẹo <code>application_name</code> chạy được khi MỌI bên ghi đều đặt nó; một kết nối từ pool, một script migration hay một phiên <code>psql</code> gõ tay đều ghi bất cứ giá trị nào mà chính chúng đang đặt. Với Prisma, dạng đáng tin là viết rõ: <code>ghiBoi: process.env.BAN</code> trong mã, với <code>BAN</code> là phiên bản mà bản dựng đã đóng dấu vào tạo tác (Chương 1). Giá trị mặc định là lưới đỡ, không phải cơ chế chính.</div>

<h3>"Dọn dẹp" thật ra nghĩa là gì</h3>
<p>Nhận dạng xong các dòng rồi, bạn vẫn phải quyết làm gì với chúng, và "xoá" hiếm khi là câu trả lời — một đơn hàng sai số tiền vẫn là một đơn có người đã đặt. Thứ tự thường dùng: <strong>chép ra trước</strong> (<code>create table ghi_hong_20260929 as select … where ghi_boi = 'v3' and nguon = 'don'</code>) để bằng chứng sống sót qua cú sửa; <strong>sửa tại chỗ trong MỘT giao dịch</strong> (<code>update … set so_tien = so_tien / 1000 where …</code>) với đúng cái <code>WHERE</code> bạn đã đếm; <strong>so con số</strong> — <code>UPDATE</code> phải báo đúng bằng số mà <code>SELECT count(*)</code> đã trả; rồi <strong>báo cho người bị ảnh hưởng</strong> nếu họ đã thấy con số sai (đó là chuyện của bài 6.4). Bản sao lưu ở Chương 10 là dành cho khi dữ liệu không suy ngược lại được nữa.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> suốt mười tám giây, v3 của nhóm nhân mọi số tiền đơn hàng với 1000; nó đã được lùi, và thầy hỏi "chính xác là những đơn nào sai?". Dùng VPS và cơ sở dữ liệu của bài 6.2.</p>
<ol>
<li>Tạo bảng <code>ghi</code> từ <code>do-63.sql</code>. Chạy các lời gọi <code>ghi</code> trong <code>do-63.sh</code> đúng thứ tự, kể cả các dòng v2 trong đoạn chồng nhau.</li>
<li>Đếm số dòng mỗi cách sẽ đụng tới: cửa sổ thời gian giữa <code>T1</code> và <code>T2</code>; <code>ghi_boi = 'v3'</code>; <code>ghi_boi = 'v3' and nguon = 'don'</code>.</li>
<li>Chép đúng tập chính xác sang bảng <code>ghi_hong</code>, rồi sửa nó trong một giao dịch bằng <code>update … set so_tien = so_tien / 1000</code> với cùng cái <code>WHERE</code>.</li>
<li>Kiểm: <code>select max(so_tien) from ghi</code> giờ phải là 100.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có ba con số 65 / 40 / 30, lệnh <code>UPDATE</code> báo <code>UPDATE 30</code>, <code>ghi_hong</code> chứa 30 dòng, và <code>max(so_tien)</code> là 100.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Poisoned rows (dòng nhiễm độc)</span><span class="v">Dữ liệu do bản hỏng ghi; cú lùi để nguyên từng dòng một.</span></div>
  <div class="kv"><span class="k">Time-window cleanup (dọn theo cửa sổ thời gian)</span><span class="v">Chọn "mọi thứ ghi giữa lúc deploy và lúc lùi" — lúc nào cũng làm được, không bao giờ chính xác.</span></div>
  <div class="kv"><span class="k">Version stamp (dấu phiên bản)</span><span class="v">Một cột ghi lại bản nào đã ghi dòng đó (<code>ghi_boi</code>).</span></div>
  <div class="kv"><span class="k">Write path (đường ghi)</span><span class="v">Đoạn mã nào đã ghi dòng đó (route, tác vụ); đi cùng dấu phiên bản thì chọn chính xác.</span></div>
  <div class="kv"><span class="k"><code>application_name</code> (tên ứng dụng của kết nối)</span><span class="v">Nhãn theo từng kết nối mà trình khách PostgreSQL đặt được; giá trị mặc định của cột đọc được nó.</span></div>
  <div class="kv"><span class="k">Catalog-only change (chỉ sửa danh mục)</span><span class="v">Lệnh DDL sửa siêu dữ liệu thay vì ghi lại các dòng — lý do <code>DROP COLUMN</code> mất 1,3 ms.</span></div>
  <div class="kv"><span class="k"><code>VACUUM FULL</code> (ghi lại toàn bảng)</span><span class="v">Ghi lại cả bảng và cuối cùng mới xoá hẳn byte của cột đã bỏ, dưới một khoá độc quyền.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lùi bản đổi xem mã nào chạy; mọi dòng bản hỏng đã ghi vẫn ở lại, không phân biệt được trừ khi bạn gọi tên được thứ làm nó hỏng.</li>
<li>Thiệt hại = bản hỏng sống bao lâu × nó phục vụ bao nhiêu lệnh ghi mỗi giây.</li>
<li>Dọn theo cửa sổ thời gian đụng 65 dòng để sửa 30 trong phòng thí nghiệm, vì bản cũ vẫn còn ghi trong đoạn chồng nhau.</li>
<li>Dấu phiên bản gỡ được chuyện chồng nhau; dấu phiên bản cộng đường ghi thì chính xác — và nó phải có TRƯỚC sự cố.</li>
<li><code>DROP COLUMN</code> là câu lệnh nhanh nhất khoá học và là migration một chiều thật sự duy nhất; hãy xoá ở một bản SAU, khi đã hết tầm lùi.</li>
<li>Dọn dẹp bằng cách chép ra trước, sửa trong một giao dịch, và kiểm cho số dòng khớp nhau.</li>
</ul>

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
${slide('dv-06', 20, 'Cửa một chiều: thứ đã rời khỏi máy')}
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
${slide('dv-06', 21, 'Hộp gửi: không hoàn tác, mà thu hẹp cửa sổ')}
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

<pre><code class="language-sql">await c.query("begin");
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

<h3>Two more one-way doors: sessions and uploads</h3>
${slide('dv-06', 22, 'Phiên đăng nhập: bản cũ không đọc được')}
<p>Emails and payments leave the machine. Two other things never leave it, and still do not come back cleanly: the <strong>sessions</strong> the new version issued, and the <strong>files</strong> users uploaded while it ran. Sessions, measured on the lab VPS: a small app signs a session token with HMAC, using the same key in every release. v1 puts <code>{ userId: 42 }</code> in the token; v2 renames the field to <code>{ sub: 42 }</code> but can still read the old form. An, who logged in under v1, and Binh, who logged in under v2, then a rollback:</p>
<pre><code class="language-javascript">// app-phien.mjs (trich) — cung khoa ky, chi doi hinh dang phien
if (req.url === '/dang-nhap') return res.end(cap(BAN === 'v1' ? { userId: 42 } : { sub: 42 }) + '\\n');
const p = doc((req.headers.cookie || '').replace('phien=', ''));
const id = BAN === 'v1' ? p?.userId : (p?.sub ?? p?.userId);   // v2 doc duoc ca kieu cu
if (!id) { res.writeHead(401); return res.end(&#96;401 \${BAN}: chua dang nhap\\n&#96;); }</code></pre>
<div class="out">=== dang chay v2 ===
  An  : 200 v2: xin chao nguoi dung 42
  Binh: 200 v2: xin chao nguoi dung 42
=== da LUI ve v1 ===
  An  : 200 v1: xin chao nguoi dung 42
  Binh: 401 v1: chua dang nhap</div>
<p>Everyone who logged in while the new version was live is logged out by the rollback — not because anything expired, but because the old code does not understand the session the new code wrote. That is the mild version. If a release <em>rotates the signing key</em> (a new <code>JWT_SECRET</code>), every token it issued fails signature verification in the old code, and even a refresh endpoint cannot help, because refreshing starts by verifying the signature. The preparation is the same expand–contract shape as everywhere else in this chapter: first ship a release that <em>reads</em> both forms (v2 above does), and only in a later release start <em>issuing</em> the new one; rotate keys by accepting old and new for a while, never by swapping one for the other in the same deploy.</p>
<p><strong>Uploads.</strong> Files uploaded under the bad version stay where they were written — on disk or in object storage like R2 — and a rollback does not delete them, which is usually what you want. The trouble is the other direction: if the new version started storing uploads under a new key layout or in a new format (for example converting images on upload), the old version may not know how to find or display them, and those users see broken images after the rollback. The files are not lost; the <em>pointer</em> to them is in a shape the old code does not read. Same rule: the reading side ships first.</p>
${slide('dv-06', 23, 'Lùi được, không lùi được, chuẩn bị gì')}
<p>The whole chapter in one table — what a code rollback does to each kind of state, and what you must have done <em>before</em> the deploy for the rollback to be enough:</p>
<table>
<tr><th>State</th><th>Does rolling back code undo it?</th><th>Prepare before deploying</th></tr>
<tr><td>Running code</td><td>Yes — symlink or tag, seconds</td><td>keep N releases/tags; rollback script already tested</td></tr>
<tr><td><code>.env</code> configuration</td><td>No — a separate axis</td><td>add the new name, keep the old one for a few releases</td></tr>
<tr><td>Migrations that ran</td><td>No</td><td>expand–contract; the previous release must run on the new schema</td></tr>
<tr><td>Dropped columns</td><td>Never</td><td>drop in a later release; backups whose restore you have tested</td></tr>
<tr><td>Rows the bad version wrote</td><td>No — they stay</td><td>version stamp + write path on every row</td></tr>
<tr><td>Emails, webhooks, payments sent</td><td>No</td><td>transactional outbox + idempotency key</td></tr>
<tr><td>Sessions the new version issued</td><td>No — the old code rejects them</td><td>read both forms first; never rotate keys in the same deploy</td></tr>
<tr><td>Files users uploaded</td><td>Kept — may not display</td><td>new formats/paths only after the old code can read them</td></tr>
<tr><td>nginx, CDN and browser caches</td><td>No — they keep serving</td><td><code>no-store</code> on HTML; a purge step inside the rollback script (6.5)</td></tr>
</table>

<h3>Run it yourself: the outbox on the lab VPS</h3>
<p>A shell version of the outbox, small enough to read in one screen: twenty orders, each inserted together with its send-intent in one transaction; a worker takes five unsent intents per round, "sends" them (appends to a file) and marks them; after two rounds the bad version is discovered and the unsent intents are deleted.</p>
<pre><code class="language-bash"># do-64.sh (trich)
for i in $(seq 1 20); do Q &lt;&lt;SQL
begin;
insert into dh(email) values ('kh$i@vd.local');
insert into hop_gui(den, than) values ('kh$i@vd.local', 'don $i da dat');
commit;
SQL
done
tho_mot_luot(){   # rut 5 y dinh CHUA gui, "gui" (ghi vao hop-thu.txt), roi danh dau
  Q -c "select id||' '||den from hop_gui where da_gui_luc is null order by id limit 5 for update skip locked" |
  while read -r id den; do echo "gui toi $den" &gt;&gt; hop-thu.txt; Q -c "update hop_gui set da_gui_luc = now() where id = $id"; done; }
tho_mot_luot; tho_mot_luot
echo "da gui (khong lay lai duoc): $(wc -l &lt; hop-thu.txt)"
echo "huy y dinh chua gui        : $(Q -c "with x as (delete from hop_gui where da_gui_luc is null returning 1) select count(*) from x")"</code></pre>
<div class="out">da gui (khong lay lai duoc): 10
huy y dinh chua gui        : 10</div>
<p>Two rounds of five went out; ten were cancelled. The ratio depends only on how fast the worker drains and how fast you notice, which is the lesson's point in one line. (The <code>for update skip locked</code> in a pipeline like this does not hold the lock after that statement ends — it is here to show the query a real worker would run inside its transaction, where it lets several workers share the queue without taking the same rows.)</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> during the demo week your team's v2 sent order confirmations with the wrong total. Before rolling back, the lecturer asks two questions: how many customers already got the wrong email, and who will be logged out by the rollback? Measure both on the lab VPS.</p>
<ol>
<li>Create tables <code>dh</code> and <code>hop_gui</code> (the latter with <code>da_gui_luc timestamptz</code>) and run <code>do-64.sh</code>: 20 orders, two worker rounds, then cancel the rest.</li>
<li>Change the number of worker rounds to 3 and run again. Write down how "sent" and "cancelled" change.</li>
<li>Make <code>~/lui3/ban/v1</code> and <code>v2</code> from <code>app-phien.mjs</code>; log in once under v1 and once under v2 (<code>curl -s localhost:3300/dang-nhap</code>), then roll back to v1 with <code>GOC=~/lui3 ./lui.sh v1</code> and call <code>/toi</code> with each cookie.</li>
<li>One sentence for each: why the outbox cannot recall the ten, and what v1 would have to do so Binh stays logged in.</li>
</ol>
<p><strong>Done when:</strong> the outbox reports 10 sent / 10 cancelled (then 15 / 5 with three rounds), An gets <code>200 v1</code> and Binh gets <code>401 v1: chua dang nhap</code> after the rollback, and both sentences name "left the machine" and "reads the old form" respectively.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">One-way door</span><span class="v">A change that cannot be undone, only compensated for; it needs preparation before the deploy.</span></div>
  <div class="kv"><span class="k">Side effect</span><span class="v">Anything a request does besides returning a response: an email, a charge, a webhook.</span></div>
  <div class="kv"><span class="k">Transactional outbox</span><span class="v">Writing the intent to send into the same transaction as the data; a worker sends later.</span></div>
  <div class="kv"><span class="k">Idempotency key</span><span class="v">A key sent with a request so the receiver performs a retried request only once.</span></div>
  <div class="kv"><span class="k">At-least-once delivery</span><span class="v">The outbox's guarantee: nothing is lost, but a crash can cause a duplicate.</span></div>
  <div class="kv"><span class="k">Session token</span><span class="v">What proves "logged in" on each request; its shape and signing key are part of the release.</span></div>
  <div class="kv"><span class="k">Object versioning</span><span class="v">Storage keeping old versions of each file, so a deletion can be undone — only if enabled beforehand.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A rollback is a statement about your process and your data; the outside world never took part in it — 90 emails sent stayed 90.</li>
<li>The outbox does not make side effects reversible; it narrows the window and gives you a table of unsent intents to cancel.</li>
<li>Sessions issued by the new version are rejected by the old one: in the lab, the user who logged in under v2 got 401 after the rollback.</li>
<li>Uploads survive a rollback, but new formats or paths may be unreadable to the old code — the reading side must ship first.</li>
<li>Rotating a signing key in the same deploy turns a rollback into "everyone is logged out".</li>
<li>Decide, while calm, which effects leave the machine; only those need an outbox and an idempotency key.</li>
</ul>

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
${slide('dv-06', 20, 'Cửa một chiều: thứ đã rời khỏi máy')}
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
${slide('dv-06', 21, 'Hộp gửi: không hoàn tác, mà thu hẹp cửa sổ')}
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

<pre><code class="language-sql">await c.query("begin");
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

<h3>Thêm hai cánh cửa một chiều: phiên đăng nhập và tệp tải lên</h3>
${slide('dv-06', 22, 'Phiên đăng nhập: bản cũ không đọc được')}
<p>Email và tiền thì rời khỏi máy. Có hai thứ KHÔNG bao giờ rời khỏi máy mà vẫn không quay lại gọn gàng: những <strong>phiên đăng nhập</strong> mà bản mới đã cấp, và những <strong>tệp</strong> người dùng tải lên trong lúc nó chạy. Phiên đăng nhập, đo trên VPS thí nghiệm: một ứng dụng nhỏ ký token phiên bằng HMAC, dùng CÙNG một khoá ở mọi bản. v1 đặt <code>{ userId: 42 }</code> vào token; v2 đổi tên trường thành <code>{ sub: 42 }</code> nhưng vẫn đọc được kiểu cũ. An đăng nhập lúc v1, Bình đăng nhập lúc v2, rồi lùi bản:</p>
<pre><code class="language-javascript">// app-phien.mjs (trich) — cung khoa ky, chi doi hinh dang phien
if (req.url === '/dang-nhap') return res.end(cap(BAN === 'v1' ? { userId: 42 } : { sub: 42 }) + '\\n');
const p = doc((req.headers.cookie || '').replace('phien=', ''));
const id = BAN === 'v1' ? p?.userId : (p?.sub ?? p?.userId);   // v2 doc duoc ca kieu cu
if (!id) { res.writeHead(401); return res.end(&#96;401 \${BAN}: chua dang nhap\\n&#96;); }</code></pre>
<div class="out">=== dang chay v2 ===
  An  : 200 v2: xin chao nguoi dung 42
  Binh: 200 v2: xin chao nguoi dung 42
=== da LUI ve v1 ===
  An  : 200 v1: xin chao nguoi dung 42
  Binh: 401 v1: chua dang nhap</div>
<p>Ai đăng nhập trong lúc bản mới đang sống đều bị cú lùi đăng xuất — không phải vì gì hết hạn, mà vì mã cũ không hiểu cái phiên mà mã mới đã viết. Đó còn là bản NHẸ. Nếu một bản phát hành <em>đổi khoá ký</em> (một <code>JWT_SECRET</code> mới), thì mọi token nó cấp đều trượt bước kiểm chữ ký ở mã cũ, và ngay cả endpoint làm mới phiên cũng không cứu được, vì làm mới bắt đầu bằng việc kiểm chữ ký. Cách chuẩn bị vẫn là hình dạng mở-rộng–thu-hẹp như khắp chương này: trước hết phát hành một bản <em>ĐỌC</em> được cả hai kiểu (v2 ở trên làm vậy), và chỉ ở một bản SAU mới bắt đầu <em>CẤP</em> kiểu mới; đổi khoá thì chấp nhận cả khoá cũ lẫn khoá mới một thời gian, không bao giờ thay cái này bằng cái kia trong cùng một lần deploy.</p>
<p><strong>Tệp tải lên.</strong> Tệp tải lên dưới bản hỏng nằm nguyên chỗ nó được ghi — trên đĩa hay trong kho đối tượng như R2 — và cú lùi không xoá chúng, thường thì đó đúng là điều bạn muốn. Rắc rối nằm ở chiều ngược lại: nếu bản mới bắt đầu lưu tệp theo một kiểu khoá mới hay một định dạng mới (ví dụ đổi định dạng ảnh ngay lúc tải lên), bản cũ có thể không biết tìm hay hiển thị chúng, và những người dùng đó thấy ảnh vỡ sau cú lùi. Tệp không mất; <em>con trỏ</em> tới chúng mang hình dạng mà mã cũ không đọc được. Cùng một luật: phía ĐỌC phải lên trước.</p>
${slide('dv-06', 23, 'Lùi được, không lùi được, chuẩn bị gì')}
<p>Cả chương trong một bảng — lùi mã làm gì với từng loại trạng thái, và bạn phải làm gì <em>TRƯỚC</em> lần deploy để cú lùi là đủ:</p>
<table>
<tr><th>Trạng thái</th><th>Lùi mã có lùi nó không?</th><th>Chuẩn bị trước khi deploy</th></tr>
<tr><td>Mã đang chạy</td><td>Có — symlink hoặc tag, vài giây</td><td>giữ N bản/tag; script lùi đã chạy thử</td></tr>
<tr><td>Cấu hình <code>.env</code></td><td>Không — một trục riêng</td><td>thêm tên mới, giữ tên cũ thêm vài bản</td></tr>
<tr><td>Migration đã chạy</td><td>Không</td><td>mở rộng–thu hẹp; bản trước phải chạy được trên lược đồ mới</td></tr>
<tr><td>Cột đã xoá</td><td>Không bao giờ</td><td>xoá ở một bản sau; bản sao lưu đã thử khôi phục</td></tr>
<tr><td>Dòng bản hỏng đã ghi</td><td>Không — chúng ở lại</td><td>dấu phiên bản + đường ghi trên mọi dòng</td></tr>
<tr><td>Email, webhook, tiền đã đi</td><td>Không</td><td>hộp gửi giao dịch + khoá bất biến</td></tr>
<tr><td>Phiên do bản mới cấp</td><td>Không — mã cũ từ chối</td><td>đọc cả hai kiểu trước; không đổi khoá trong cùng lần deploy</td></tr>
<tr><td>Tệp người dùng đã tải lên</td><td>Còn nguyên — có thể không hiển thị</td><td>định dạng/đường dẫn mới chỉ sau khi mã cũ đọc được</td></tr>
<tr><td>Bộ đệm nginx, CDN, trình duyệt</td><td>Không — vẫn phục vụ tiếp</td><td><code>no-store</code> cho HTML; bước dọn bộ đệm nằm sẵn trong script lùi (6.5)</td></tr>
</table>

<h3>Tự chạy: hộp gửi trên VPS thí nghiệm</h3>
<p>Một bản hộp gửi bằng shell, đủ nhỏ để đọc trong một màn hình: hai mươi đơn, mỗi đơn chèn CÙNG với ý định gửi của nó trong một giao dịch; một con thợ mỗi lượt lấy năm ý định chưa gửi, "gửi" chúng (ghi nối vào một tệp) rồi đánh dấu; sau hai lượt thì phát hiện bản hỏng và xoá các ý định chưa gửi.</p>
<pre><code class="language-bash"># do-64.sh (trich)
for i in $(seq 1 20); do Q &lt;&lt;SQL
begin;
insert into dh(email) values ('kh$i@vd.local');
insert into hop_gui(den, than) values ('kh$i@vd.local', 'don $i da dat');
commit;
SQL
done
tho_mot_luot(){   # rut 5 y dinh CHUA gui, "gui" (ghi vao hop-thu.txt), roi danh dau
  Q -c "select id||' '||den from hop_gui where da_gui_luc is null order by id limit 5 for update skip locked" |
  while read -r id den; do echo "gui toi $den" &gt;&gt; hop-thu.txt; Q -c "update hop_gui set da_gui_luc = now() where id = $id"; done; }
tho_mot_luot; tho_mot_luot
echo "da gui (khong lay lai duoc): $(wc -l &lt; hop-thu.txt)"
echo "huy y dinh chua gui        : $(Q -c "with x as (delete from hop_gui where da_gui_luc is null returning 1) select count(*) from x")"</code></pre>
<div class="out">da gui (khong lay lai duoc): 10
huy y dinh chua gui        : 10</div>
<p>Hai lượt năm lá đã đi; mười lá được huỷ. Tỷ lệ chỉ phụ thuộc vào con thợ rút nhanh cỡ nào và bạn phát hiện nhanh cỡ nào — cả bài học trong một dòng. (Cái <code>for update skip locked</code> trong một đường ống như thế này không giữ khoá sau khi câu lệnh đó kết thúc — nó có mặt để cho thấy câu truy vấn mà một con thợ thật sẽ chạy BÊN TRONG giao dịch của nó, nơi nó cho nhiều con thợ chia nhau hàng đợi mà không lấy trùng dòng.)</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> trong tuần demo, v2 của nhóm gửi email xác nhận đơn với tổng tiền sai. Trước khi lùi bản, giảng viên hỏi hai câu: bao nhiêu khách đã nhận email sai, và ai sẽ bị cú lùi đăng xuất? Đo cả hai trên VPS thí nghiệm.</p>
<ol>
<li>Tạo bảng <code>dh</code> và <code>hop_gui</code> (bảng sau có <code>da_gui_luc timestamptz</code>) rồi chạy <code>do-64.sh</code>: 20 đơn, hai lượt thợ, rồi huỷ phần còn lại.</li>
<li>Đổi số lượt thợ thành 3 rồi chạy lại. Ghi lại "đã gửi" và "huỷ được" đổi thế nào.</li>
<li>Dựng <code>~/lui3/ban/v1</code> và <code>v2</code> từ <code>app-phien.mjs</code>; đăng nhập một lần lúc v1 và một lần lúc v2 (<code>curl -s localhost:3300/dang-nhap</code>), rồi lùi về v1 bằng <code>GOC=~/lui3 ./lui.sh v1</code> và gọi <code>/toi</code> với từng cookie.</li>
<li>Mỗi thứ một câu: vì sao hộp gửi không gọi về được mười lá kia, và v1 phải làm gì để Bình vẫn còn đăng nhập.</li>
</ol>
<p><strong>Đạt khi:</strong> hộp gửi báo 10 đã gửi / 10 huỷ được (rồi 15 / 5 với ba lượt), sau cú lùi An nhận <code>200 v1</code> còn Bình nhận <code>401 v1: chua dang nhap</code>, và hai câu của bạn lần lượt gọi tên "đã rời khỏi máy" và "đọc được kiểu cũ".</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">One-way door (cánh cửa một chiều)</span><span class="v">Thay đổi không hoàn tác được, chỉ bù đắp được; cần chuẩn bị trước lần deploy.</span></div>
  <div class="kv"><span class="k">Side effect (tác dụng phụ)</span><span class="v">Bất cứ thứ gì request làm ngoài việc trả lời: một email, một lần thu tiền, một webhook.</span></div>
  <div class="kv"><span class="k">Transactional outbox (hộp gửi giao dịch)</span><span class="v">Ghi ý định gửi vào CÙNG giao dịch với dữ liệu; một con thợ gửi sau.</span></div>
  <div class="kv"><span class="k">Idempotency key (khoá bất biến)</span><span class="v">Khoá gửi kèm request để bên nhận chỉ làm một lần dù request bị thử lại.</span></div>
  <div class="kv"><span class="k">At-least-once delivery (phát ít nhất một lần)</span><span class="v">Lời bảo đảm của hộp gửi: không mất gì, nhưng một cú sập có thể gây gửi trùng.</span></div>
  <div class="kv"><span class="k">Session token (token phiên)</span><span class="v">Thứ chứng minh "đã đăng nhập" ở mỗi request; hình dạng và khoá ký của nó là một phần của bản phát hành.</span></div>
  <div class="kv"><span class="k">Object versioning (lưu phiên bản đối tượng)</span><span class="v">Kho giữ các bản cũ của mỗi tệp để một lần xoá có thể hoàn tác — chỉ khi đã bật từ trước.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cú lùi là một phát biểu về tiến trình và dữ liệu của bạn; thế giới bên ngoài chưa từng tham gia — 90 lá thư đã gửi vẫn là 90.</li>
<li>Hộp gửi không làm tác dụng phụ lùi được; nó thu hẹp cửa sổ và cho bạn một bảng ý định chưa gửi để huỷ.</li>
<li>Phiên do bản mới cấp bị bản cũ từ chối: trong phòng thí nghiệm, người đăng nhập lúc v2 nhận 401 sau cú lùi.</li>
<li>Tệp tải lên sống sót qua cú lùi, nhưng định dạng hay đường dẫn mới có thể không đọc được bằng mã cũ — phía đọc phải lên trước.</li>
<li>Đổi khoá ký trong cùng một lần deploy biến cú lùi thành "mọi người đều bị đăng xuất".</li>
<li>Quyết định lúc còn bình tĩnh: tác dụng phụ nào rời khỏi máy; chỉ chúng mới cần hộp gửi và khoá bất biến.</li>
</ul>

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
${slide('dv-06', 24, 'Cửa sau đã v1, cửa trước vẫn v3')}
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
${slide('dv-06', 25, 'Chuỗi bộ đệm: ai xoá được, mất bao lâu')}
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
${slide('dv-06', 26, 'Script lùi: kiểm PHIÊN BẢN qua cửa trước')}
<p>Everything in this chapter comes together in one shape: <strong>verify through the front door, using the address the user uses, and check the version rather than the status code.</strong></p>

<pre><code class="language-bash">#!/bin/bash
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
${slide('dv-06', 27, 'Kiểm lại bộ kiểm: quên dọn ⇒ thoát 3')}
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
${slide('dv-06', 28, 'Lùi lại hay đi tới?')}
<p>Everything so far assumes rolling back is right. Often it is not. The numbers from this chapter make the decision concrete:</p>

<div class="kv-grid">
<div class="kv"><span class="k">roll back when</span><span class="v">the previous release works against today&#39;s schema (6.2), and the bad version is still writing damage every second (6.3)</span></div>
<div class="kv"><span class="k">roll forward when</span><span class="v">the fix is small and certain, and rolling back would strand data the new version wrote in a shape the old one cannot read</span></div>
<div class="kv"><span class="k">the deciding number</span><span class="v">140 ms (6.1) against however long a fix takes to write, review and deploy — which is minutes at best</span></div>
<div class="kv"><span class="k">the trap</span><span class="v">rolling forward because it feels more professional. It is a bet that you have diagnosed correctly under pressure; the rollback is not a bet.</span></div>
</div>

<p>A useful default: roll back first, then fix at your own pace. Rolling back is not an admission of failure, it is the cheapest possible way to stop the clock — and this chapter has measured exactly how cheap: 140 milliseconds of process time, 592 milliseconds including the proof.</p>

<h3>The cache configuration, directive by directive</h3>
<p>The five-minute window comes from four lines of nginx. This is the configuration used on the lab VPS to reproduce it, with nginx 1.24.0 running as the <code>deploy</code> user — the front door on <code>127.0.0.1:3320</code>, the app on <code>127.0.0.1:3300</code>:</p>
<pre><code class="language-nginx"># ~/nx/nginx.conf — nginx chay bang user deploy, cua truoc 127.0.0.1:3320, dem 5 phut
pid        /home/deploy/nx/nginx.pid;
error_log  /home/deploy/nx/error.log;
events { worker_connections 64; }
http {
    access_log off;
    proxy_temp_path   /home/deploy/nx/tmp;
    client_body_temp_path /home/deploy/nx/tmp/body;
    fastcgi_temp_path /home/deploy/nx/tmp/f; uwsgi_temp_path /home/deploy/nx/tmp/u; scgi_temp_path /home/deploy/nx/tmp/s;
    proxy_cache_path  /home/deploy/nx/cache keys_zone=dem:1m max_size=50m;
    server {
        listen 127.0.0.1:3320;
        location / {
            proxy_pass         http://127.0.0.1:3300;
            proxy_cache        dem;
            proxy_cache_valid  200 5m;
            add_header         X-Cache $upstream_cache_status;
        }
    }
}</code></pre>
<table>
<tr><th>Directive</th><th>What it does here</th><th>What it means for a rollback</th></tr>
<tr><td><code>proxy_cache_path … keys_zone=dem:1m max_size=50m</code></td><td>where cached responses live on disk; a 1 MB shared-memory zone for keys; at most 50 MB of responses</td><td>the directory you empty when you purge</td></tr>
<tr><td><code>proxy_cache dem</code></td><td>turns caching on for this <code>location</code>, using that zone</td><td>every response the old version gave may already be stored</td></tr>
<tr><td><code>proxy_cache_valid 200 5m</code></td><td>keeps 200 responses for five minutes</td><td>the length of the window in which users see the version you removed</td></tr>
<tr><td><code>add_header X-Cache $upstream_cache_status</code></td><td>adds <code>HIT</code>/<code>MISS</code>/<code>EXPIRED</code> to each response</td><td>the one header that lets a script tell "fresh from the app" from "served from memory"</td></tr>
<tr><td><code>*_temp_path</code>, <code>pid</code>, <code>error_log</code></td><td>move every file nginx writes into the user's home</td><td>only needed to run nginx without root in a lab</td></tr>
</table>
<p>Those temp paths are there because of a real failure: without them, nginx started as a normal user stopped immediately with <code>[emerg] … mkdir() "/var/lib/nginx/body" failed (13: Permission denied)</code> — the compiled-in default temp directory belongs to root. On a real server nginx runs as root and drops privileges, so you will not meet this there; you meet it the first time you try a cache experiment in your own account.</p>
<div class="pitfall co-tieu-de"><strong>Trap — trusting a cache header you set in the app.</strong> This project learned that nginx decides what the browser caches, not the application: <code>next.config.js</code> set a week-long <code>Cache-Control</code> on some paths, and the nginx <code>location /</code> removed it with <code>proxy_hide_header</code> and put <code>no-store</code> on everything. For rollbacks that happens to be the safe default for HTML. The lesson for your rollback plan: check what the <em>front door</em> sends with <code>curl -I</code>, not what the app thinks it sends.</div>

<h3>Run it yourself: the front-door check on the lab VPS</h3>
<p>The script above, cut down to the three things that matter and run on the lab VPS with the configuration just shown. <code>QUEN_DON=1</code> skips the purge on purpose, so the check can be seen failing:</p>
<pre><code class="language-bash">#!/bin/bash
# lui-an-toan.sh &lt;ban&gt; — lui, DON bo dem, roi kiem PHIEN BAN qua CUA TRUOC
set -euo pipefail
GOC=~/lui; CUA_TRUOC=http://127.0.0.1:3320; BO_DEM=~/nx/cache
DICH=\${1:?dung: lui-an-toan.sh &lt;ban&gt;}
[ -d "$GOC/ban/$DICH" ] || { echo "KHONG co ban '$DICH'. Co: $(ls "$GOC/ban" | tr '\\n' ' ')" &gt;&amp;2; exit 2; }
~/lui.sh "$DICH" &gt;/dev/null                                  # 1) symlink + khoi dong + cho /health
if [ "\${QUEN_DON:-0}" != 1 ]; then                           # 2) don bo dem roi nap lai nginx
  rm -rf "\${BO_DEM:?}"/*; nginx -p ~/nx -c ~/nx/nginx.conf -s reload 2&gt;/dev/null; sleep 0.3
fi
THAY=$(curl -s --max-time 3 "$CUA_TRUOC/")                   # 3) hoi nhu NGUOI DUNG hoi
[ "$THAY" = "$DICH" ] || { echo "  ✗ cua truoc van tra '$THAY', khong phai '$DICH'" &gt;&amp;2; exit 3; }
echo "  ✓ cua truoc tra '$THAY'"</code></pre>
<div class="out">  ✓ cua truoc tra 'v3'
x-ban: v3 X-Cache: HIT
x-ban: v3 X-Cache: HIT
=== lui ve v1, QUEN don bo dem ===
  ✗ cua truoc van tra 'v3', khong phai 'v1'
  ma thoat: 3
  cua sau (thang app): v1
=== chay lai DAY DU ===
  ✓ cua truoc tra 'v1'
  ma thoat: 0  (520 ms)</div>
<p>The same three states as the sandbox measurement — back door v1, front door v3, exit code 3 — and 520 ms for a complete, proven rollback, against the 558–592 ms measured earlier. <code>\${BO_DEM:?}</code> is not decoration: if the variable were ever empty, <code>rm -rf "$BO_DEM"/*</code> would become <code>rm -rf /*</code>; with <code>:?</code> the shell stops instead.</p>

<h3>On Windows and macOS</h3>
<ul>
<li><strong>Checking the front door from your laptop.</strong> On macOS and Linux, <code>curl -s -D - -o /dev/null https://… | grep -i x-</code> works as written. In Windows PowerShell 5.1, <code>curl</code> is an alias for <code>Invoke-WebRequest</code> with different flags — type <code>curl.exe</code> to get the real curl that ships with Windows 10 and 11, or run the check from WSL.</li>
<li><strong>Your browser is also a cache.</strong> After a rollback, a normal reload can show you the old page from your own browser cache while every other user already sees the fix, or the reverse. Verify with <code>curl</code> or a private window, never with the tab you have been refreshing all evening.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> you rolled back, the script said "done", and a teammate on the group chat insists the site still shows the broken version. Prove who is right, and make the script prove it next time. Use the lab VPS and <code>~/lui</code> from 6.1.</p>
<ol>
<li>Create <code>~/nx/cache</code> and <code>~/nx/tmp</code>, save the <code>nginx.conf</code> above to <code>~/nx/</code>, and start nginx as <code>deploy</code>: <code>nginx -p ~/nx -c ~/nx/nginx.conf</code>.</li>
<li>Put v3 live and request the front door twice: <code>curl -s -D - -o /dev/null localhost:3320/ | grep -iE "^x-(ban|cache)"</code>. You should see <code>HIT</code> the second time.</li>
<li>Run <code>QUEN_DON=1 ./lui-an-toan.sh v1; echo "ma thoat: $?"</code>, then <code>curl -s localhost:3300/</code> (back door).</li>
<li>Run <code>./lui-an-toan.sh v1</code> without <code>QUEN_DON</code> and time it.</li>
</ol>
<p><strong>Done when:</strong> the first run exits 3 naming both halves (<code>van tra 'v3', khong phai 'v1'</code>) while the back door says <code>v1</code>, and the second run prints <code>✓ cua truoc tra 'v1'</code> with exit 0 in well under a second.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Front door / back door</span><span class="v">The address users reach (through proxies and caches) versus the app's own port.</span></div>
  <div class="kv"><span class="k">Proxy cache</span><span class="v">Responses stored by nginx and replayed without asking the app, for as long as <code>proxy_cache_valid</code> says.</span></div>
  <div class="kv"><span class="k">Purge</span><span class="v">Removing cached responses; in open-source nginx that means emptying the cache directory and reloading.</span></div>
  <div class="kv"><span class="k"><code>X-Cache: HIT / MISS</code></span><span class="v">A header added by the proxy saying whether the response came from memory or from the app.</span></div>
  <div class="kv"><span class="k"><code>Cache-Control: no-store</code></span><span class="v">Tells browsers and shared caches not to keep the response at all — the safe choice for HTML.</span></div>
  <div class="kv"><span class="k">Roll forward</span><span class="v">Fixing by deploying a new version instead of returning to an old one.</span></div>
  <div class="kv"><span class="k">Exit code</span><span class="v">The number a script returns; here 0 = proven, 2 = unknown target, 3 = users still see the wrong version.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A correct 140 ms rollback still served the removed version to every user for five minutes, because a proxy cache sat in front of the app.</li>
<li>The only proof is a request through the users' address that compares the <em>version</em> served, not the status code.</li>
<li>Open-source nginx has no single-entry purge; emptying the cache directory and reloading took 7 ms.</li>
<li>Test the test: with the purge skipped on purpose, the check failed with exit 3 and named both halves of the mismatch.</li>
<li>Caches you do not own — a CDN, the users' browsers — need an API call or time; <code>no-store</code> on HTML is what keeps a rollback reachable.</li>
<li>Default to rolling back first and fixing at your own pace: 0.15 s to stop the clock, about half a second including the proof.</li>
</ul>

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
${slide('dv-06', 24, 'Cửa sau đã v1, cửa trước vẫn v3')}
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
${slide('dv-06', 25, 'Chuỗi bộ đệm: ai xoá được, mất bao lâu')}
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
${slide('dv-06', 26, 'Script lùi: kiểm PHIÊN BẢN qua cửa trước')}
<p>Mọi thứ trong chương này gộp lại thành một hình dạng: <strong>kiểm qua CỬA TRƯỚC, bằng đúng địa chỉ người dùng đi vào, và kiểm PHIÊN BẢN chứ không phải mã trạng thái.</strong></p>

<pre><code class="language-bash">#!/bin/bash
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
${slide('dv-06', 27, 'Kiểm lại bộ kiểm: quên dọn ⇒ thoát 3')}
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
${slide('dv-06', 28, 'Lùi lại hay đi tới?')}
<p>Mọi thứ tới giờ giả định lùi lại là đúng. Nhiều khi không. Các con số của chương này làm cho quyết định đó cụ thể:</p>

<div class="kv-grid">
<div class="kv"><span class="k">lùi lại khi</span><span class="v">bản trước còn chạy được với lược đồ hôm nay (6.2), và bản hỏng vẫn đang ghi thiệt hại từng giây (6.3)</span></div>
<div class="kv"><span class="k">đi tới khi</span><span class="v">cách sửa nhỏ và chắc chắn, và lùi lại sẽ bỏ mắc kẹt dữ liệu mà bản mới đã ghi theo hình dạng bản cũ không đọc được</span></div>
<div class="kv"><span class="k">con số quyết định</span><span class="v">140 ms (6.1) so với thời gian viết-duyệt-deploy một cách sửa — mà cái đó ít nhất cũng tính bằng phút</span></div>
<div class="kv"><span class="k">cái bẫy</span><span class="v">đi tới vì nó nghe CHUYÊN NGHIỆP hơn. Đó là một canh bạc rằng bạn đã chẩn đoán đúng dưới áp lực; còn lùi lại thì KHÔNG phải canh bạc.</span></div>
</div>

<p>Một mặc định hữu ích: lùi trước, rồi sửa theo nhịp của mình. Lùi bản không phải là thừa nhận thất bại, nó là cách rẻ nhất có thể để DỪNG ĐỒNG HỒ — và chương này đã đo chính xác nó rẻ tới đâu: 140 mili giây thời gian tiến trình, 592 mili giây tính cả phần chứng minh.</p>

<h3>Cấu hình bộ đệm, từng chỉ thị một</h3>
<p>Cửa sổ năm phút đến từ bốn dòng nginx. Đây là cấu hình dùng trên VPS thí nghiệm để tái hiện nó, với nginx 1.24.0 chạy bằng user <code>deploy</code> — cửa trước ở <code>127.0.0.1:3320</code>, ứng dụng ở <code>127.0.0.1:3300</code>:</p>
<pre><code class="language-nginx"># ~/nx/nginx.conf — nginx chay bang user deploy, cua truoc 127.0.0.1:3320, dem 5 phut
pid        /home/deploy/nx/nginx.pid;
error_log  /home/deploy/nx/error.log;
events { worker_connections 64; }
http {
    access_log off;
    proxy_temp_path   /home/deploy/nx/tmp;
    client_body_temp_path /home/deploy/nx/tmp/body;
    fastcgi_temp_path /home/deploy/nx/tmp/f; uwsgi_temp_path /home/deploy/nx/tmp/u; scgi_temp_path /home/deploy/nx/tmp/s;
    proxy_cache_path  /home/deploy/nx/cache keys_zone=dem:1m max_size=50m;
    server {
        listen 127.0.0.1:3320;
        location / {
            proxy_pass         http://127.0.0.1:3300;
            proxy_cache        dem;
            proxy_cache_valid  200 5m;
            add_header         X-Cache $upstream_cache_status;
        }
    }
}</code></pre>
<table>
<tr><th>Chỉ thị</th><th>Ở đây nó làm gì</th><th>Nghĩa là gì với một cú lùi</th></tr>
<tr><td><code>proxy_cache_path … keys_zone=dem:1m max_size=50m</code></td><td>chỗ lưu các bản trả lời trên đĩa; một vùng nhớ chung 1 MB cho khoá; tối đa 50 MB bản trả lời</td><td>thư mục mà bạn dọn sạch khi xoá bộ đệm</td></tr>
<tr><td><code>proxy_cache dem</code></td><td>bật bộ đệm cho <code>location</code> này, dùng vùng đó</td><td>mọi bản trả lời của bản cũ có thể đã được lưu sẵn</td></tr>
<tr><td><code>proxy_cache_valid 200 5m</code></td><td>giữ các bản trả lời 200 trong năm phút</td><td>độ dài cửa sổ mà người dùng thấy cái bản bạn đã gỡ</td></tr>
<tr><td><code>add_header X-Cache $upstream_cache_status</code></td><td>thêm <code>HIT</code>/<code>MISS</code>/<code>EXPIRED</code> vào mỗi bản trả lời</td><td>header DUY NHẤT giúp script phân biệt "mới từ app" với "phát lại từ bộ nhớ"</td></tr>
<tr><td><code>*_temp_path</code>, <code>pid</code>, <code>error_log</code></td><td>dời mọi tệp nginx ghi vào thư mục nhà của user</td><td>chỉ cần khi chạy nginx không có root trong phòng thí nghiệm</td></tr>
</table>
<p>Mấy đường dẫn tạm đó có mặt vì một lần hỏng thật: thiếu chúng, nginx chạy bằng user thường dừng ngay với <code>[emerg] … mkdir() "/var/lib/nginx/body" failed (13: Permission denied)</code> — thư mục tạm mặc định được biên dịch sẵn thuộc về root. Trên máy chủ thật nginx chạy bằng root rồi mới hạ quyền, nên bạn không gặp chuyện này ở đó; bạn gặp nó lần đầu tiên thử bộ đệm trong tài khoản của chính mình.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — tin vào header bộ đệm mà ứng dụng tự đặt.</strong> Dự án này đã học rằng nginx quyết trình duyệt đệm gì, không phải ứng dụng: <code>next.config.js</code> đặt <code>Cache-Control</code> một tuần cho vài đường dẫn, còn <code>location /</code> của nginx gỡ nó đi bằng <code>proxy_hide_header</code> rồi dán <code>no-store</code> lên mọi thứ. Với chuyện lùi bản, đó hoá ra lại là mặc định an toàn cho HTML. Bài học cho kế hoạch lùi bản: kiểm xem <em>CỬA TRƯỚC</em> gửi gì bằng <code>curl -I</code>, đừng tin thứ ứng dụng tưởng nó gửi.</div>

<h3>Tự chạy: phép kiểm cửa trước trên VPS thí nghiệm</h3>
<p>Script ở trên, cắt gọn còn ba việc quan trọng và chạy trên VPS thí nghiệm với cấu hình vừa xem. <code>QUEN_DON=1</code> cố tình bỏ bước dọn bộ đệm, để thấy phép kiểm hỏng:</p>
<pre><code class="language-bash">#!/bin/bash
# lui-an-toan.sh &lt;ban&gt; — lui, DON bo dem, roi kiem PHIEN BAN qua CUA TRUOC
set -euo pipefail
GOC=~/lui; CUA_TRUOC=http://127.0.0.1:3320; BO_DEM=~/nx/cache
DICH=\${1:?dung: lui-an-toan.sh &lt;ban&gt;}
[ -d "$GOC/ban/$DICH" ] || { echo "KHONG co ban '$DICH'. Co: $(ls "$GOC/ban" | tr '\\n' ' ')" &gt;&amp;2; exit 2; }
~/lui.sh "$DICH" &gt;/dev/null                                  # 1) symlink + khoi dong + cho /health
if [ "\${QUEN_DON:-0}" != 1 ]; then                           # 2) don bo dem roi nap lai nginx
  rm -rf "\${BO_DEM:?}"/*; nginx -p ~/nx -c ~/nx/nginx.conf -s reload 2&gt;/dev/null; sleep 0.3
fi
THAY=$(curl -s --max-time 3 "$CUA_TRUOC/")                   # 3) hoi nhu NGUOI DUNG hoi
[ "$THAY" = "$DICH" ] || { echo "  ✗ cua truoc van tra '$THAY', khong phai '$DICH'" &gt;&amp;2; exit 3; }
echo "  ✓ cua truoc tra '$THAY'"</code></pre>
<div class="out">  ✓ cua truoc tra 'v3'
x-ban: v3 X-Cache: HIT
x-ban: v3 X-Cache: HIT
=== lui ve v1, QUEN don bo dem ===
  ✗ cua truoc van tra 'v3', khong phai 'v1'
  ma thoat: 3
  cua sau (thang app): v1
=== chay lai DAY DU ===
  ✓ cua truoc tra 'v1'
  ma thoat: 0  (520 ms)</div>
<p>Đúng ba trạng thái như phép đo trong hộp cát — cửa sau v1, cửa trước v3, mã thoát 3 — và 520 ms cho một cú lùi trọn vẹn CÓ chứng minh, so với 558–592 ms đo trước đó. <code>\${BO_DEM:?}</code> không phải trang trí: nếu biến ấy có lúc rỗng, <code>rm -rf "$BO_DEM"/*</code> sẽ thành <code>rm -rf /*</code>; có <code>:?</code> thì shell dừng lại.</p>

<h3>Trên Windows và macOS</h3>
<ul>
<li><strong>Kiểm cửa trước từ laptop.</strong> Trên macOS và Linux, <code>curl -s -D - -o /dev/null https://… | grep -i x-</code> chạy đúng như viết. Trong Windows PowerShell 5.1, <code>curl</code> là bí danh của <code>Invoke-WebRequest</code> với bộ cờ khác hẳn — gõ <code>curl.exe</code> để gọi curl thật đi kèm Windows 10 và 11, hoặc chạy phép kiểm trong WSL.</li>
<li><strong>Trình duyệt của bạn cũng là một bộ đệm.</strong> Sau cú lùi, bấm tải lại bình thường có thể cho bạn xem trang cũ từ bộ đệm của chính trình duyệt trong khi mọi người khác đã thấy bản sửa, hoặc ngược lại. Kiểm bằng <code>curl</code> hay một cửa sổ ẩn danh, đừng bằng cái tab bạn đã bấm tải lại cả buổi tối.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn đã lùi bản, script báo "xong", còn một bạn trong nhóm chat khăng khăng web vẫn hiện bản hỏng. Chứng minh ai đúng, và làm cho script tự chứng minh ở lần sau. Dùng VPS thí nghiệm và <code>~/lui</code> của bài 6.1.</p>
<ol>
<li>Tạo <code>~/nx/cache</code> và <code>~/nx/tmp</code>, lưu <code>nginx.conf</code> ở trên vào <code>~/nx/</code>, rồi chạy nginx bằng user <code>deploy</code>: <code>nginx -p ~/nx -c ~/nx/nginx.conf</code>.</li>
<li>Đưa v3 lên rồi hỏi cửa trước hai lần: <code>curl -s -D - -o /dev/null localhost:3320/ | grep -iE "^x-(ban|cache)"</code>. Lần thứ hai phải thấy <code>HIT</code>.</li>
<li>Chạy <code>QUEN_DON=1 ./lui-an-toan.sh v1; echo "ma thoat: $?"</code>, rồi <code>curl -s localhost:3300/</code> (cửa sau).</li>
<li>Chạy <code>./lui-an-toan.sh v1</code> KHÔNG có <code>QUEN_DON</code> và bấm giờ.</li>
</ol>
<p><strong>Đạt khi:</strong> lần đầu thoát 3 và gọi tên cả hai nửa (<code>van tra 'v3', khong phai 'v1'</code>) trong khi cửa sau nói <code>v1</code>, còn lần hai in <code>✓ cua truoc tra 'v1'</code> với mã thoát 0 trong chưa tới một giây.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Front door / back door (cửa trước / cửa sau)</span><span class="v">Địa chỉ người dùng đi vào (qua proxy và bộ đệm) so với cổng riêng của ứng dụng.</span></div>
  <div class="kv"><span class="k">Proxy cache (bộ đệm proxy)</span><span class="v">Các bản trả lời nginx lưu lại và phát lại mà không hỏi app, trong khoảng <code>proxy_cache_valid</code> cho phép.</span></div>
  <div class="kv"><span class="k">Purge (xoá bộ đệm)</span><span class="v">Gỡ các bản trả lời đã đệm; với nginx mã nguồn mở nghĩa là dọn thư mục bộ đệm rồi nạp lại.</span></div>
  <div class="kv"><span class="k"><code>X-Cache: HIT / MISS</code> (trúng / trượt bộ đệm)</span><span class="v">Header proxy thêm vào cho biết bản trả lời lấy từ bộ nhớ hay từ app.</span></div>
  <div class="kv"><span class="k"><code>Cache-Control: no-store</code> (đừng lưu)</span><span class="v">Bảo trình duyệt và bộ đệm dùng chung đừng giữ bản trả lời — lựa chọn an toàn cho HTML.</span></div>
  <div class="kv"><span class="k">Roll forward (đi tới)</span><span class="v">Sửa bằng cách deploy một bản mới thay vì quay về bản cũ.</span></div>
  <div class="kv"><span class="k">Exit code (mã thoát)</span><span class="v">Con số script trả về; ở đây 0 = đã chứng minh, 2 = đích lạ, 3 = người dùng vẫn thấy sai bản.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một cú lùi ĐÚNG trong 140 ms vẫn phục vụ bản đã gỡ cho mọi người dùng suốt năm phút, vì có bộ đệm proxy đứng trước app.</li>
<li>Bằng chứng duy nhất là một request đi qua địa chỉ của người dùng và so <em>PHIÊN BẢN</em> được phục vụ, không so mã trạng thái.</li>
<li>nginx mã nguồn mở không xoá được từng mục; dọn thư mục bộ đệm rồi nạp lại mất 7 ms.</li>
<li>Kiểm lại bộ kiểm: cố tình bỏ bước dọn, phép kiểm hỏng với mã thoát 3 và gọi tên cả hai nửa của chỗ vênh.</li>
<li>Bộ đệm không thuộc về bạn — CDN, trình duyệt người dùng — cần một lời gọi API hoặc thời gian; <code>no-store</code> cho HTML là thứ giữ cho cú lùi với tới được người dùng.</li>
<li>Mặc định: lùi trước, sửa theo nhịp của mình — 0,15 s để dừng đồng hồ, khoảng nửa giây kể cả phần chứng minh.</li>
</ul>

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
      description: 'Mười câu tình huống có giải thích: lùi bằng symlink hay dựng lại, ảnh mồ côi và kho containerd, chọn đúng ảnh để gắn lại tag, /health 200 mà request thật 500, git revert không lùi CSDL, dọn dòng hỏng bằng ghi_boi, hộp gửi, phiên bị đăng xuất sau cú lùi, bộ đệm trước người dùng, và lùi lại hay đi tới.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.6</span>
<h2>Quiz: rollback</h2>
<p class="lead">Ten questions from the chapter where the fastest operation is the destructive one, and the successful rollback is the one that fooled you. Every output quoted in them was measured — in the lesson sandbox, or on 29/09/2026 on the lab VPS.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can roll a release back by moving one symlink atomically, and I time it until the app answers, not until the process exists.</li>
<li>I can tell whether a Docker host keeps orphaned images (overlay2) or not (containerd), and I tag every build with its own version.</li>
<li>I can explain why <code>/health</code> said 200 while every real request returned 500, and which check would have caught it.</li>
<li>I know that <code>git revert</code> of a commit with a migration deletes the file and leaves the database — and that Prisma still reports "up to date".</li>
<li>I can list what a rollback does not undo — written rows, sent emails, issued sessions, uploads, caches — and what to prepare for each.</li>
<li>I can prove a rollback through the users' address by comparing the version served.</li>
</ul>
${slide('dv-06', 30, 'Bảng tra nhanh Chương 6')}

<div class="callout">
<p><strong>What this chapter established.</strong> Flipping a release symlink measured 5.1–5.7 ms, and a complete rollback including restart and readiness was 140 ms — against 1,994 ms to rebuild the same release from source on a deliberately tiny 83-package project, where the real repository has 897 and 1,159 packages (6.1). Rolling code back while leaving a renamed column in place produced <code>/health</code> = 200 and every real endpoint = 500, because health checks are kept shallow on purpose (6.2). A bad version live for 18.6 seconds wrote 240 poisoned rows that the rollback did not touch, and cleaning up by time window caught 60 innocent rows to fix 180; meanwhile <code>DROP COLUMN</code> on 200,000 rows took <strong>1.287 ms</strong> — two thousand times faster than the harmless <code>ADD COLUMN ... gen_random_uuid()</code> from Chapter 5 — left the table at 20 MB with the phone numbers still readable in the raw heap, and erased them only at <code>VACUUM FULL</code>, 239 ms later (6.3). Ninety orders sent ninety emails; deleting all ninety rows left all ninety emails delivered, while a transactional outbox turned that into 40 irreversible and 50 cancellable (6.4). And a correct 140 ms rollback still served the rolled-back version to every user for five minutes, because a proxy cache sat in front of it; a 7 ms purge fixed it, and a front-door version check caught the omission with exit code 3 (6.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.6</span>
<h2>Quiz: lùi bản</h2>
<p class="lead">Mười câu ra từ cái chương mà thao tác NHANH NHẤT lại là thao tác phá huỷ, và cú lùi THÀNH CÔNG lại là cú đã lừa được bạn. Mọi output trích trong câu hỏi đều đo thật — trong hộp cát của bài, hoặc ngày 29/09/2026 trên VPS thí nghiệm.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi lùi được một bản bằng cách dời MỘT symlink một cách nguyên tử, và tôi bấm giờ tới lúc app trả lời chứ không phải tới lúc tiến trình tồn tại.</li>
<li>Tôi biết một máy Docker giữ ảnh mồ côi (overlay2) hay không (containerd), và tôi gắn cho mỗi bản build một tag phiên bản riêng.</li>
<li>Tôi giải thích được vì sao <code>/health</code> báo 200 trong khi mọi request thật trả 500, và phép kiểm nào lẽ ra đã bắt được.</li>
<li>Tôi biết <code>git revert</code> một commit có migration sẽ xoá tệp mà CSDL vẫn y nguyên — và Prisma vẫn báo "up to date".</li>
<li>Tôi kể được những gì cú lùi KHÔNG hoàn tác — dòng đã ghi, email đã gửi, phiên đã cấp, tệp đã tải, bộ đệm — và cần chuẩn bị gì cho từng thứ.</li>
<li>Tôi chứng minh được cú lùi qua địa chỉ của người dùng bằng cách so phiên bản được phục vụ.</li>
</ul>
${slide('dv-06', 30, 'Bảng tra nhanh Chương 6')}

<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Dời một symlink bản phát hành đo được 5,1–5,7 ms, và một cú lùi TRỌN VẸN kể cả khởi động lại và chờ sẵn sàng là 140 ms — so với 1.994 ms để dựng lại đúng bản đó từ nguồn trên một dự án cố tình làm nhỏ 83 gói, trong khi kho thật có 897 và 1.159 gói (6.1). Lùi mã mà để nguyên một cột đã đổi tên cho ra <code>/health</code> = 200 còn MỌI endpoint thật = 500, vì chốt kiểm sức khoẻ được giữ NÔNG có chủ đích (6.2). Một bản hỏng sống 18,6 giây ghi ra 240 dòng nhiễm độc mà cú lùi không đụng tới, và dọn theo cửa sổ thời gian thì đụng 60 dòng vô tội để sửa 180; trong khi đó <code>DROP COLUMN</code> trên 200.000 dòng mất <strong>1,287 ms</strong> — nhanh hơn hai nghìn lần câu <code>ADD COLUMN ... gen_random_uuid()</code> vô hại ở Chương 5 — để bảng nguyên 20 MB với các số điện thoại vẫn đọc được trong heap thô, và chỉ xoá thật ở lần <code>VACUUM FULL</code>, 239 ms sau đó (6.3). Chín mươi đơn hàng gửi ra chín mươi lá thư; xoá sạch chín mươi dòng vẫn để lại chín mươi lá đã phát, còn hộp gửi giao dịch biến chuyện đó thành 40 cái không lùi được và 50 cái huỷ được (6.4). Và một cú lùi ĐÚNG trong 140 ms vẫn phục vụ đúng cái bản vừa lùi cho mọi người dùng suốt năm phút, vì có một bộ đệm proxy đứng phía trước; một cú dọn 7 ms chữa được, và một phép kiểm phiên bản qua cửa trước bắt được chỗ thiếu ấy bằng mã thoát 3 (6.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'At 21:00 the night before your SWP391 defence the team swaps in v3 and the home page breaks. The VPS has ban/v1, ban/v2, ban/v3 and a symlink hien-tai → ban/v3. What is the fastest safe way back?|||21:00 tối trước hôm bảo vệ SWP391, nhóm tráo v3 lên và trang chủ vỡ. VPS có ban/v1, ban/v2, ban/v3 và symlink hien-tai → ban/v3. Cách về bản cũ nhanh mà an toàn nhất là gì?',
            options: [
              'Check out the v2 tag, run npm ci and the build again, then copy the result over ban/v3|||Lấy tag v2 ra, chạy lại npm ci và build, rồi chép kết quả đè lên ban/v3',
              'git revert the v3 commit and push to main so the pipeline redeploys|||git revert commit v3 rồi push lên main để đường ống deploy lại',
              'ln -sfn ban/v2 ht.moi && mv -Tf ht.moi hien-tai, restart the app, and wait until /health answers|||ln -sfn ban/v2 ht.moi && mv -Tf ht.moi hien-tai, khởi động lại app, rồi chờ tới khi /health trả lời',
              'Edit the changed files inside ban/v3 back to their v2 content and restart|||Sửa các tệp đã đổi bên trong ban/v3 về nội dung của v2 rồi khởi động lại',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Pointing back at a release that already exists is one rename(2) plus a restart — 157–218 ms measured on the lab VPS, against seconds for a toy rebuild and about fifteen minutes for a real one. Reverting on main is the right SECOND step, but it goes through CI and a build while the site is down; editing ban/v3 in place breaks the rule that releases are never modified and leaves you with a release nobody built.|||VI: Trỏ lại một bản vốn đã có là MỘT lệnh rename(2) cộng một lần khởi động lại — đo 157–218 ms trên VPS thí nghiệm, so với vài giây cho một bản dựng đồ chơi và chừng mười lăm phút cho bản thật. Revert trên main là bước THỨ HAI đúng, nhưng nó phải qua CI và build trong lúc web đang sập; sửa tại chỗ trong ban/v3 phá luật "bản phát hành không bao giờ bị sửa" và để lại một bản chẳng ai dựng ra.',
          },
          {
            question: 'A VPS installed last month with Docker Engine 29. You build v2 over app:latest; v2 is broken, and docker images -a --filter dangling=true prints only the header. Why is there no old image to re-tag?|||Một VPS cài tháng trước với Docker Engine 29. Bạn build v2 đè lên app:latest; v2 hỏng, và docker images -a --filter dangling=true chỉ in dòng tiêu đề. Vì sao không có ảnh cũ nào để gắn lại tag?',
            options: [
              'Fresh Engine 29 installs use the containerd image store, where overwriting a tag leaves no dangling image behind|||Bản cài Engine 29 mới dùng kho ảnh containerd, và ở đó build đè tag không để lại ảnh mồ côi nào',
              'Docker prunes dangling images automatically after every successful build|||Docker tự prune ảnh mồ côi sau mỗi lần build thành công',
              'The filter hides dangling images unless you also pass --digests|||Bộ lọc giấu ảnh mồ côi trừ khi bạn thêm --digests',
              'docker compose up deletes the previous image when it recreates the container|||docker compose up xoá ảnh trước đó khi nó tạo lại container',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Measured on the same engine: with overlay2 the old v1 remained as <untagged> e2b6a7a92107; with the containerd store the same script left nothing. Docker documents containerd as the default for Engine 29 on fresh installations, while upgraded hosts keep overlay2. Docker does not auto-prune after builds — that is exactly why orphans pile up on overlay2 hosts.|||VI: Đo trên cùng một engine: với overlay2, v1 cũ còn lại dạng <untagged> e2b6a7a92107; với kho containerd, cùng script không để lại gì. Tài liệu Docker ghi containerd là mặc định cho Engine 29 trên bản cài mới, còn máy nâng cấp thì giữ overlay2. Docker không tự prune sau khi build — chính vì thế ảnh mồ côi mới chất đống trên máy overlay2.',
          },
          {
            question: 'During an incident you list orphans to re-tag the previous backend image and see four <untagged> entries, all 510MB. Which one do you tag?|||Giữa sự cố, bạn liệt kê ảnh mồ côi để gắn lại tag cho ảnh backend trước đó và thấy bốn dòng <untagged>, đều 510MB. Bạn gắn tag cho cái nào?',
            options: [
              'The first line of the listing, because Docker sorts newest first|||Dòng đầu danh sách, vì Docker xếp mới nhất lên trước',
              'Any of them: identical size means identical content|||Cái nào cũng được: cùng kích thước nghĩa là cùng nội dung',
              'None — rebuild instead, since orphans are always corrupted|||Không cái nào — dựng lại thôi, vì ảnh mồ côi luôn hỏng',
              'The one whose creation time or version label matches the last good release (docker image inspect)|||Cái có thời điểm tạo hoặc nhãn phiên bản khớp bản tốt gần nhất (docker image inspect)',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: When only code changes and dependencies do not, every build has the same size — the lab showed four orphans at 510MB each, so "match by size" cannot choose. docker image inspect -f "{{.Created}}" or a label such as org.opencontainers.image.version set at build time identifies the right one. Tagging a random orphan can put an even older or the broken build back.|||VI: Khi chỉ mã đổi còn phụ thuộc thì không, bản build nào cũng cùng kích thước — phòng thí nghiệm có bốn ảnh mồ côi, mỗi cái 510MB, nên "đối chiếu kích thước" không chọn được. docker image inspect -f "{{.Created}}" hoặc một nhãn như org.opencontainers.image.version đặt lúc build mới nhận ra đúng ảnh. Gắn tag bừa một ảnh mồ côi có thể đưa lên một bản còn cũ hơn, hoặc chính bản hỏng.',
          },
          {
            question: 'v2 shipped a migration renaming don.ten to ho_ten. After rolling the code back to v1: /health → 200, /don → 500 ERROR: column "ten" does not exist. What is the right conclusion?|||v2 mang theo một migration đổi tên don.ten thành ho_ten. Sau khi lùi mã về v1: /health → 200, /don → 500 ERROR: column "ten" does not exist. Kết luận đúng là gì?',
            options: [
              'The rollback failed; roll back again and it will pick up the old column|||Cú lùi hỏng; lùi thêm lần nữa là nó nhận cột cũ',
              'Code went back but the schema did not; the shallow /health cannot see it — rename back now, and next time ship the rename as expand–contract|||Mã đã lùi nhưng lược đồ thì không; /health nông không thấy được — đổi tên cột về ngay, và lần sau làm cú đổi tên theo mở rộng–thu hẹp',
              'The database connection pool still caches the v2 schema; restart PostgreSQL|||Pool kết nối vẫn nhớ đệm lược đồ v2; khởi động lại PostgreSQL',
              'Make /health run SELECT 1 so the next rollback reports the problem|||Cho /health chạy SELECT 1 để lần lùi sau báo ra vấn đề',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Measured twice (sandbox and lab VPS): the health endpoint answers before touching the database, on purpose, so it stays 200. SELECT 1 is the tempting fix, but it succeeds on a schema your code cannot read; what catches this is a smoke test that queries a real table. Done as expand–contract (keep ten, add ho_ten), both v2 and the rolled-back v1 returned 200.|||VI: Đo hai lần (hộp cát và VPS thí nghiệm): endpoint sức khoẻ cố ý trả lời trước khi đụng CSDL, nên nó vẫn 200. SELECT 1 là cách sửa hấp dẫn, nhưng nó chạy mỹ mãn trên một lược đồ mà mã của bạn không đọc nổi; thứ bắt được chuyện này là smoke test truy vấn một bảng thật. Làm theo mở rộng–thu hẹp (giữ ten, thêm ho_ten), cả v2 lẫn v1 sau cú lùi đều trả 200.',
          },
          {
            question: 'A teammate runs git revert on a commit that changed code and added prisma/migrations/…_them_cot, already deployed. Afterwards prisma migrate status prints "Database schema is up to date!". What is the actual state?|||Một bạn cùng nhóm chạy git revert trên một commit vừa đổi mã vừa thêm prisma/migrations/…_them_cot, đã deploy rồi. Sau đó prisma migrate status in "Database schema is up to date!". Trạng thái thật là gì?',
            options: [
              'The revert also dropped the column, so repository and database agree|||Cú revert cũng đã xoá cột, nên kho mã và CSDL khớp nhau',
              'Prisma will drop the column on the next migrate deploy|||Prisma sẽ xoá cột ở lần migrate deploy kế tiếp',
              'The migration file is deleted, the column still exists and _prisma_migrations still records it — history in git and in the database now disagree|||Tệp migration bị xoá, cột vẫn còn và _prisma_migrations vẫn ghi nó — lịch sử trong git và trong CSDL giờ lệch nhau',
              'The database rolled the migration back automatically when the file disappeared|||CSDL tự lùi migration khi tệp biến mất',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured: the revert output ends with "delete mode 100644 prisma/migrations/…/migration.sql"; psql still shows ghi_boi; migrate status says up to date and migrate deploy says "No pending migrations to apply." Nothing ever runs SQL because a file vanished. That is why this project forbids deleting deployed migrations and says to discuss before reverting a commit that carries one.|||VI: Đo thật: output của revert kết thúc bằng "delete mode 100644 prisma/migrations/…/migration.sql"; psql vẫn thấy cột ghi_boi; migrate status báo up to date và migrate deploy báo "No pending migrations to apply." Không có gì chạy SQL chỉ vì một tệp biến mất. Đó là lý do dự án này cấm xoá migration đã deploy và dặn phải bàn trước khi revert một commit có migration.',
          },
          {
            question: 'v3 multiplied order amounts by 1000 while its sign-up path was fine; during the blue-green overlap v2 was still writing. Cleaning up "everything written between deploy and rollback" touches 65 rows to fix 30. What selects exactly the 30?|||v3 nhân số tiền đơn hàng với 1000 trong khi đường đăng ký của nó vẫn đúng; trong đoạn xanh/lam chồng nhau, v2 vẫn còn ghi. Dọn "mọi thứ ghi giữa lúc deploy và lúc lùi" đụng 65 dòng để sửa 30. Cái gì chọn ra ĐÚNG 30 dòng?',
            options: [
              'A version stamp plus the write path: ghi_boi = v3 AND nguon = don|||Dấu phiên bản cộng đường ghi: ghi_boi = v3 AND nguon = don',
              'The version stamp alone: ghi_boi = v3|||Chỉ dấu phiên bản: ghi_boi = v3',
              'A narrower time window around the deploy|||Một cửa sổ thời gian hẹp hơn quanh lần deploy',
              'Restoring last night’s backup over the table|||Khôi phục bản sao lưu đêm qua đè lên bảng',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Measured on the lab VPS: time window 65, ghi_boi = v3 alone 40 (it still catches the 10 sign-up rows v3 wrote correctly), stamp + path 30 of 30. A narrower window still contains the overlapping v2 writes; restoring a backup throws away every good row written since. The stamp must exist before the incident — ghiBoi: process.env.BAN in the code.|||VI: Đo trên VPS thí nghiệm: cửa sổ thời gian 65, riêng ghi_boi = v3 là 40 (vẫn dính 10 dòng đăng ký mà v3 ghi đúng), dấu + đường ghi 30 trên 30. Cửa sổ hẹp hơn vẫn chứa các lệnh ghi chồng nhau của v2; khôi phục sao lưu thì vứt luôn mọi dòng tốt ghi từ đó tới giờ. Con dấu phải có TRƯỚC sự cố — ghiBoi: process.env.BAN trong mã.',
          },
          {
            question: 'Ninety orders each sent a confirmation email in the request. Deleting all ninety rows left ninety emails delivered. With a transactional outbox and a running worker, the rollback at 1.6 s found 40 sent and 50 unsent. What did the outbox actually buy?|||Chín mươi đơn hàng, mỗi đơn gửi một email xác nhận ngay trong request. Xoá cả chín mươi dòng vẫn để lại chín mươi lá đã phát. Với hộp gửi giao dịch và con thợ đang chạy, cú lùi ở giây 1,6 thấy 40 đã gửi và 50 chưa gửi. Hộp gửi thật ra mua được gì?',
            options: [
              'It made delivered emails recallable through the provider|||Nó làm cho email đã phát gọi về được qua nhà cung cấp',
              'A narrower window and a table of not-yet-sent intents you can delete — nothing makes a delivered email reversible|||Một cửa sổ hẹp hơn và một bảng ý định CHƯA gửi để xoá — không gì làm email đã phát lùi được',
              'Exactly-once delivery, so idempotency keys are no longer needed|||Phát đúng một lần, nên không cần khoá bất biến nữa',
              'Faster sending, so the bad version finishes before anyone notices|||Gửi nhanh hơn, để bản hỏng xong trước khi ai kịp thấy',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The outbox turns "90 irreversible" into "40 irreversible, 50 cancellable" — the ratio depends on drain speed and detection time (the lab run: 10/10 after two rounds, 15/5 after three). It gives at-least-once, not exactly-once: a worker that dies between sending and marking sends twice, which is why the receiving side still needs an idempotency key.|||VI: Hộp gửi biến "90 cái không lùi được" thành "40 không lùi được, 50 huỷ được" — tỷ lệ phụ thuộc tốc độ rút và thời gian phát hiện (chạy trong phòng thí nghiệm: 10/10 sau hai lượt, 15/5 sau ba lượt). Nó cho phát-ít-nhất-một-lần, không phải đúng-một-lần: thợ chết giữa lúc gửi và lúc đánh dấu sẽ gửi hai lần, nên phía nhận vẫn cần khoá bất biến.',
          },
          {
            question: 'After rolling back from v2 to v1, users who logged in during v2 get 401 "chua dang nhap"; users from before v2 are fine. The signing key never changed. What happened, and how is it prevented?|||Sau khi lùi từ v2 về v1, người đăng nhập trong lúc v2 chạy nhận 401 "chua dang nhap"; người đăng nhập từ trước v2 vẫn ổn. Khoá ký chưa hề đổi. Chuyện gì đã xảy ra, và phòng thế nào?',
            options: [
              'The rollback cleared the session store; keep sessions in Redis|||Cú lùi đã xoá kho phiên; hãy giữ phiên trong Redis',
              'Their tokens expired during the rollback; lengthen JWT_EXPIRES_IN|||Token của họ hết hạn trong lúc lùi; kéo dài JWT_EXPIRES_IN',
              'The browser cached a 401 from v2; tell users to clear their cache|||Trình duyệt đã đệm một 401 từ v2; bảo người dùng xoá bộ đệm',
              'v2 issued sessions in a shape v1 cannot read; ship a release that reads both shapes first, and issue the new shape only in a later one|||v2 cấp phiên theo hình dạng mà v1 không đọc được; phát hành một bản ĐỌC được cả hai kiểu trước, và chỉ CẤP kiểu mới ở một bản sau',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Measured with an HMAC session and one unchanged key: v2 wrote { sub: 42 } and read both forms; v1 only understands { userId }. After the rollback An (logged in under v1) got 200, Binh (under v2) got 401. Nothing expired and nothing was deleted. If a release also rotates the signing key, every token it issued fails verification in the old code — rotate by accepting both keys for a while.|||VI: Đo bằng phiên HMAC với một khoá không đổi: v2 ghi { sub: 42 } và đọc được cả hai kiểu; v1 chỉ hiểu { userId }. Sau cú lùi An (đăng nhập lúc v1) nhận 200, Bình (lúc v2) nhận 401. Chẳng có gì hết hạn hay bị xoá. Nếu một bản còn đổi khoá ký nữa thì mọi token nó cấp đều trượt kiểm chữ ký ở mã cũ — đổi khoá bằng cách chấp nhận cả hai khoá một thời gian.',
          },
          {
            question: 'Your rollback script checks http://127.0.0.1:3300/ and prints ✓ v1. For the next five minutes every user still sees v3, and curl through the site shows x-ban: v3 X-Cache: HIT. What should the script do?|||Script lùi bản của bạn kiểm http://127.0.0.1:3300/ và in ✓ v1. Suốt năm phút sau mọi người dùng vẫn thấy v3, và curl qua tên miền cho thấy x-ban: v3 X-Cache: HIT. Script nên làm gì?',
            options: [
              'Purge the proxy cache, then check through the users’ address and compare the version served, exiting non-zero if it differs|||Dọn bộ đệm proxy, rồi kiểm qua địa chỉ của người dùng và so phiên bản được phục vụ, thoát khác 0 nếu lệch',
              'Check the back door twice to be sure the app is really v1|||Kiểm cửa sau hai lần cho chắc app đúng là v1',
              'Restart nginx instead of reloading it, then trust the app check|||Khởi động lại nginx thay vì nạp lại, rồi tin phép kiểm app',
              'Wait five minutes before printing ✓|||Chờ năm phút rồi mới in ✓',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The back door was right and irrelevant: users go through nginx, which replayed v3 for proxy_cache_valid 200 5m. Emptying the cache directory and reloading took 7 ms; the front-door version check exited 3 when the purge was skipped and 0 in 520 ms when it ran. Waiting five minutes "works" only for the cache you know about and leaves users on the broken version the whole time.|||VI: Cửa sau đúng mà vô nghĩa: người dùng đi qua nginx, và nginx phát lại v3 suốt proxy_cache_valid 200 5m. Dọn thư mục bộ đệm rồi nạp lại mất 7 ms; phép kiểm phiên bản qua cửa trước thoát 3 khi bỏ bước dọn và thoát 0 trong 520 ms khi có. Chờ năm phút chỉ "được" với bộ đệm bạn biết, và bỏ người dùng ở bản hỏng suốt thời gian đó.',
          },
          {
            question: 'v2 went live at 09:00 and has been writing wrong amounts at about 50 writes per second; its migration only added a nullable column. A fix is ready but needs about 20 minutes of CI, build and deploy. What do you do first?|||v2 lên lúc 09:00 và đang ghi sai số tiền với khoảng 50 lệnh ghi mỗi giây; migration của nó chỉ thêm một cột cho phép NULL. Bản sửa đã sẵn nhưng cần chừng 20 phút CI, build và deploy. Việc đầu tiên bạn làm là gì?',
            options: [
              'Roll forward: deploy the fix, since going back looks unprofessional|||Đi tới: deploy bản sửa, vì lùi lại trông không chuyên nghiệp',
              'Restore last night’s database backup, then redeploy v1|||Khôi phục bản sao lưu CSDL đêm qua, rồi deploy lại v1',
              'Roll back to v1 now — the schema change is additive so v1 still runs — then clean up the rows and ship the fix at your own pace|||Lùi về v1 ngay — thay đổi lược đồ chỉ là thêm nên v1 vẫn chạy — rồi dọn các dòng hỏng và đưa bản sửa lên theo nhịp của mình',
              'Leave v2 running and fix the rows once the new version is out|||Cứ để v2 chạy rồi sửa các dòng khi bản mới đã lên',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Damage is lifetime × write rate: twenty more minutes at 50 writes/s is about 60,000 more bad rows. Rolling back takes a fraction of a second and is safe here because v1 runs on a schema that only gained a nullable column. Rolling forward is a bet that your diagnosis under pressure is right; restoring a backup destroys every good row written since.|||VI: Thiệt hại = thời gian sống × tốc độ ghi: thêm hai mươi phút ở 50 lệnh/giây là thêm chừng 60.000 dòng hỏng. Lùi bản mất chưa tới một giây và an toàn ở đây vì v1 chạy được trên lược đồ chỉ được thêm một cột cho phép NULL. Đi tới là đánh cược rằng chẩn đoán dưới áp lực của bạn đúng; khôi phục sao lưu thì phá mọi dòng tốt ghi từ đó tới giờ.',
          },
        ],
      },
    },
  ],
};
