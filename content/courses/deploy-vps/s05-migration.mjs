/**
 * Deploy lên VPS — Chương 5: Cơ sở dữ liệu — migration và cái cửa sổ nằm giữa.
 * LUẬT: backtick → &#96;; ${ của bash → \${; < > & trong code → &lt; &gt; &amp;; gạch chéo ngược viết đôi.
 * Nâng cấp 29/09/2026: bài 5.0 slide (deck dv-05, 31 slide) + slide/🧪/🗂/📌 trong 5.1–5.5; đào sâu: đo cửa sổ đổi tên
 * cột bằng request thật, migration là gì trong dự án Prisma, ADD COLUMN/ALTER TYPE/SET NOT NULL trên 1 và 5 triệu dòng,
 * probe đọc/ghi trong lúc ALTER, hàng đợi khoá đọc bằng pg_stat_activity + pg_locks + pg_blocking_pids, lock_timeout /
 * statement_timeout, CREATE INDEX vs CONCURRENTLY đo lại ở 5 triệu dòng, NOT VALID + VALIDATE + SET NOT NULL bỏ qua quét,
 * tái hiện P3018 → P3009 bằng chính Prisma 5.22, resolve --applied mù, thoát kẹt 5 bước, P3006 shadow DB ⇒ SQL tay,
 * CONCURRENTLY trong tệp Prisma, psql -q nuốt "UPDATE 0", seed báo OK giả. ĐÃ SỬA: trigger đồng bộ ở 5.2 bỏ sót UPDATE;
 * lệnh migrate diff ở 5.4 (Prisma 5.22 không có --to-database-url, --from-migrations cần --shadow-database-url).
 * Output MỚI chạy thật: postgres:16 (16.14) trong container + VPS thí nghiệm ubuntu:24.04, Prisma 5.22.0 trên Mac M1.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';

export default {
  title: 'Chapter 5 — The database: migrations and the window between them|||Chương 5 — Cơ sở dữ liệu: migration và cái cửa sổ nằm giữa',
  description: 'Chương chứa những sự cố deploy tệ nhất. Mã và lược đồ được deploy ở hai thời điểm khác nhau, và khoảng giữa hai thời điểm ấy là nơi website vỡ — đo trên PostgreSQL 16.13 thật, kèm cái trạng thái migration kẹt mà chính kho mã này đã từng rơi vào.',
  lessons: [


    /* ─────────────────────────── 5.0 ─────────────────────────── */
    {
      title: '5.0 — Chapter 5 slides: one database, two versions of code|||5.0 — Slide Chương 5: một cơ sở dữ liệu, hai phiên bản mã',
      slug: 'deploy-5-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 31 slide của Chương 5: cửa sổ giữa migration và mã mới đo bằng request thật, bốn giai đoạn mở rộng–thu hẹp và cái trigger bỏ sót lệnh sửa, ADD COLUMN trên 1 và 5 triệu dòng, hàng đợi khoá, lock_timeout, CONCURRENTLY, P3018 → P3009 tái hiện bằng Prisma, shadow DB, lấp dữ liệu theo lô và seed báo OK giả.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Slides</span>
<h2>The whole chapter in 31 slides</h2>
<p class="lead">Skim these before the lessons to see the shape of the chapter, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: requests from the old code turning red the instant a three-millisecond rename commits, three orderings of "migrate" and "swap" drawn as timelines, four phases of expand–contract, a table of five million rows that stops answering both reads and writes for nine seconds, a lock queue read straight out of <code>pg_stat_activity</code>, and the stuck <code>P3009</code> state reproduced with Prisma itself.</p>
<p>Slides 3–6 belong to Lesson 5.1 (the window between schema and code), 7–11 to 5.2 (expand and contract, including a sync trigger that silently misses updates), 12–18 to 5.3 (locks, measured on one and five million rows), 19–23 to 5.4 (the half-applied migration, <code>P3009</code>, the shadow database) and 24–27 to 5.5 (backfills, where the migration goes in the deploy script, and a seed that reports success while doing nothing). The last four are the chapter's common mistakes, a two-page cheat sheet and a 45-minute practice session. Every terminal is real output recorded on 29/09/2026 in a lab: PostgreSQL 16.14 in a container with 1 GB of memory, an Ubuntu 24.04 container acting as the VPS, and Prisma 5.22 — the version this project uses — on a Mac M1. A real VPS has slower disks, so its milliseconds are usually larger; the shape of every result is the same. The slides are in Vietnamese; the diagrams, SQL and output read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Slide</span>
<h2>Cả chương trong 31 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để thấy hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại trong bài giảng giải thích nó: những request của mã cũ đỏ lên đúng khoảnh khắc một cú đổi tên ba mili giây được ghi nhận, ba thứ tự "migrate" và "tráo" vẽ thành trục thời gian, bốn giai đoạn mở rộng–thu hẹp, một bảng năm triệu dòng ngừng trả lời cả đọc lẫn ghi trong chín giây, một hàng đợi khoá đọc thẳng từ <code>pg_stat_activity</code>, và trạng thái kẹt <code>P3009</code> tái hiện bằng chính Prisma.</p>
<p>Slide 3–6 thuộc Bài 5.1 (cửa sổ giữa lược đồ và mã), 7–11 thuộc 5.2 (mở rộng và thu hẹp, gồm một trigger đồng bộ lặng lẽ bỏ sót lệnh sửa), 12–18 thuộc 5.3 (khoá, đo trên một và năm triệu dòng), 19–23 thuộc 5.4 (migration áp dụng nửa chừng, <code>P3009</code>, shadow database) và 24–27 thuộc 5.5 (lấp dữ liệu, migration nằm ở đâu trong script deploy, và một bước seed báo thành công trong khi chẳng làm gì). Bốn slide cuối là những sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Mọi terminal trên slide là output THẬT, ghi ngày 29/09/2026 trong một phòng thí nghiệm: PostgreSQL 16.14 trong một container có 1 GB bộ nhớ, một container Ubuntu 24.04 đóng vai VPS, và Prisma 5.22 — đúng phiên bản dự án này dùng — trên một chiếc Mac M1. VPS thật có đĩa chậm hơn nên số mili giây thường lớn hơn; hình dạng của mọi kết quả thì y như vậy.</p>
</div>
${gallery('dv-05', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Đổi tên cột: 3 ms migration, 2 giây lỗi'], [4, 'Cửa sổ nằm giữa migration và mã mới'], [5, 'Thay đổi nào tự thân an toàn'], [6, 'Không thứ tự nào cứu được migration hỏng'],
  [7, 'Bốn giai đoạn mở rộng–thu hẹp'], [8, 'Giai đoạn 2: cột mới, lấp, trigger'], [9, 'Trigger chỉ lấp NULL bỏ sót lệnh sửa'], [10, 'Đo thật bốn giai đoạn'], [11, 'Cùng khuôn cho NOT NULL, đổi kiểu, tách cột'],
  [12, 'ADD COLUMN trên 1 và 5 triệu dòng'], [13, 'Trong 9,4 giây, đọc lẫn ghi đều đứng'], [14, 'Hàng đợi khoá'], [15, 'lock_timeout và statement_timeout'], [16, 'CREATE INDEX và CONCURRENTLY'], [17, 'NOT VALID rồi VALIDATE'], [18, 'Bảng mức khoá'],
  [19, 'P3018 rồi P3009'], [20, 'resolve --applied bừa'], [21, 'Thoát kẹt năm bước'], [22, 'Shadow DB và SQL viết tay'], [23, 'CONCURRENTLY một mình một tệp'],
  [24, 'Lấp một phát và theo lô'], [25, 'Vòng lặp lấp theo lô'], [26, 'Migration trước bước tráo'], [27, 'Seed báo OK giả'],
  [28, 'Sai lầm hay gặp'], [29, 'Bảng tra nhanh (1/2): SQL an toàn'], [30, 'Bảng tra nhanh (2/2): Prisma'], [31, 'Thực hành chương 5'],
])}
`,
    },

    /* ─────────────────────────── 5.1 ─────────────────────────── */
    {
      title: '5.1 — Code and schema deploy at different moments|||5.1 — Mã và lược đồ được deploy ở hai thời điểm khác nhau',
      slug: 'deploy-5-1-hai-thoi-diem-khac-nhau',
      type: 'LESSON',
      description: 'Một lệnh đổi tên cột chạy xong trong vài mili giây, và mã cũ vẫn còn chạy thêm vài giây nữa. Bài này đo cái cửa sổ đó, rồi chỉ ra vì sao chính bước tráo không-gián-đoạn ở Chương 3 lại làm nó TỆ HƠN.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Code and schema deploy at different moments</h2>
<p class="lead">Chapter 3 got the swap down to zero dropped requests. That result assumed one thing quietly: that both versions of the application could run at the same time. Add a schema change and that assumption becomes a question — because the database is shared, and only one version of it exists.</p>

<h3>The simplest possible schema change, measured</h3>
${slide('dv-05', 3, 'Đổi tên cột: migration 3 ms, mã cũ lỗi suốt 2 giây')}
<p>Renaming a column. Old code selects <code>email</code>; new code selects <code>dia_chi_email</code>:</p>
<div class="out">── CACH NGAY THO: migration doi ten cot, roi moi deploy ma moi ──
  ── ngay sau migration, ma CU van dang chay: ──
    ERROR:  column "email" does not exist
    LINE 1: select ten, email from nguoi_dung limit 1;
  ── ma MOI (chua deploy xong): ──
    nd1|nd1@x.com

  → CUA SO GIAN DOAN = tu luc migration chay toi luc ma moi phuc vu</div>
<div class="callout warn"><strong>The rename succeeded in milliseconds and broke every request the old code was serving.</strong> Not some requests — every one that touches that table. The outage runs from the instant the migration commits until the last old process stops, and nothing about it is visible in the migration's own output: the migration reported success.</div>

<h3>Zero-downtime deploys make this worse, not better</h3>
${slide('dv-05', 4, 'Ba thứ tự migrate/tráo và chỗ mã lệch lược đồ')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The naive swap has a short window</span><span class="lz-d">Stop old, migrate, start new. The old code is already dead when the schema changes, so nothing queries the old shape. You get the outage measured in Lesson 3.1 instead — 168 dropped requests — but no schema mismatch.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The blue-green swap deliberately overlaps them</span><span class="lz-d">Chapter 3's whole technique is running both versions at once. That is exactly the condition under which a renamed column breaks the old one. The better deploy has a <em>longer</em> window of mixed versions, not a shorter one.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">And a rollback re-opens it</span><span class="lz-d">Rolling back the code does not roll back the schema. Going back to the previous release puts old code in front of a new database — the same mismatch, arriving at the worst moment, which is during an incident.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">So the schema must satisfy both versions</span><span class="lz-d">Not "the new one". Both. For as long as both can run — which includes the rollback window, so in practice for at least one deploy cycle after the code change. Lesson 5.2 is the pattern that achieves it.</span></div>
</div>
<div class="callout ok"><strong>The rule the rest of this chapter follows.</strong> Every migration must leave the database in a state where the <em>previous</em> release still works. If that is impossible in one step, it takes more than one deploy — and that is normal, not a failure of planning.</div>

<h3>Which changes are safe on their own</h3>
${slide('dv-05', 5, 'Thay đổi nào tự thân an toàn với mã cũ')}
<div class="kv-grid">
  <div class="kv"><span class="k">Safe: adding a nullable column</span><span class="v">Old code does not know it exists and does not select it. New code uses it. No version breaks.</span></div>
  <div class="kv"><span class="k">Safe: adding a new table, a new index</span><span class="v">Nothing that exists refers to it. The only cost is time and locks — Lesson 5.3.</span></div>
  <div class="kv"><span class="k">Unsafe: renaming or dropping anything</span><span class="v">Column, table, constraint. The old code refers to the old name and gets an error, immediately, on every request.</span></div>
  <div class="kv"><span class="k">Unsafe: adding a NOT NULL column without a default</span><span class="v">Old code inserts rows without it and every insert fails. Adding <code>NOT NULL DEFAULT</code> is safe; adding <code>NOT NULL</code> alone is not.</span></div>
  <div class="kv"><span class="k">Unsafe: narrowing a type or adding a constraint</span><span class="v"><code>varchar(255)</code> to <code>varchar(50)</code>, or a new <code>UNIQUE</code>. Old code writes values the new rules reject — and existing rows may already violate them, which is measured in Lesson 5.4.</span></div>
  <div class="kv"><span class="k">Depends: changing a default</span><span class="v">Harmless for old code that supplies the value explicitly; a behaviour change for old code that relies on the default. Which one it is depends on the code, not the schema.</span></div>
</div>

<h3>When the migration runs, relative to everything else</h3>
${slide('dv-05', 6, 'Không thứ tự nào cứu được một migration không an toàn')}
<pre><code><span class="tok-comment"># thu tu trong mot script deploy — migration nam O DAU?</span>

<span class="tok-comment"># A) TRUOC khi trao (pho bien nhat)</span>
migrate up            <span class="tok-comment"># luoc do doi TRUOC, ma cu VAN dang chay</span>
&lt;trao sang ban moi&gt;   <span class="tok-comment"># → luoc do moi phai chieu duoc MA CU</span>

<span class="tok-comment"># B) SAU khi trao</span>
&lt;trao sang ban moi&gt;   <span class="tok-comment"># ma moi chay TRUOC khi luoc do doi</span>
migrate up            <span class="tok-comment"># → ma moi phai chieu duoc LUOC DO CU</span>

<span class="tok-comment"># C) Nhu MOT BUOC RIENG, khong dinh vao deploy nao</span>
migrate up            <span class="tok-comment"># chay khi ban chon, thuong la truoc — Bai 5.2</span></code></pre>
<div class="pitfall"><strong>Trap — there is no ordering that makes an unsafe migration safe.</strong> Running it before the swap breaks the old code; running it after breaks the new code; running it during breaks both in turn. People discover this and conclude they need a maintenance window, which works and costs an outage. The actual answer is that the <em>migration</em> has to change — split into steps that are each individually safe. Ordering only matters once every step already satisfies both versions.</div>

<h3>For first-timers: what a "migration" is in a Prisma project</h3>
<p>Three things with similar names, and mixing them up is how most of this chapter's incidents start:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">The schema file — <code>prisma/schema.prisma</code></span><span class="v">What you <em>want</em> the database to look like. Editing it changes nothing in any database by itself.</span></div>
  <div class="kv"><span class="k">A migration — <code>prisma/migrations/&lt;timestamp&gt;_&lt;name&gt;/migration.sql</code></span><span class="v">Plain SQL that moves a database one step from the old shape to the new one. Committed to git, run in timestamp order, never edited after it has run anywhere that matters.</span></div>
  <div class="kv"><span class="k">The ledger — table <code>_prisma_migrations</code></span><span class="v">Inside each database, one row per migration: when it started, when it finished (<code>finished_at</code>), whether it was rolled back. This is how the tool knows what is "pending". Lesson 5.4 is about what happens when this row and the real schema disagree.</span></div>
  <div class="kv"><span class="k"><code>prisma migrate dev</code> vs <code>prisma migrate deploy</code></span><span class="v"><code>dev</code> is for your laptop: it diffs the schema file, <em>writes</em> a new migration, and replays history on a throw-away "shadow database". <code>deploy</code> is for servers: it only runs the pending migration files, in order, and records each one. It never generates anything and never resets anything.</span></div>
</div>
<p>So "deploying a schema change" means: a new folder under <code>prisma/migrations/</code> travels with the release, and some step on the server runs <code>migrate deploy</code> against the production database. <em>When</em> that step runs, relative to the moment the new code starts serving, is the whole subject of this lesson.</p>

<h3>Run it yourself: measuring the window on the lab VPS</h3>
<p>The measurement at the top of this lesson (slide 3) is a thirty-line script: old code asks for <code>email</code> every 250 ms, a migration renames the column at second 1, and the new code takes over at second 3. Run from the lab VPS against PostgreSQL 16 in a neighbouring container:</p>
<pre><code class="language-bash"># cuaso.sh — chạy trên VPS thí nghiệm (PGHOST trỏ vào container Postgres)
export PGHOST=pg-thu PGUSER=postgres
psql -qc "drop table if exists nguoi_dung; create table nguoi_dung(id int primary key, ten text, email text); insert into nguoi_dung values (1,'nd1','nd1@x.com');"
T0=$(date +%s%N); ms(){ echo $(( ($(date +%s%N) - T0) / 1000000 )); }
( sleep 1; t=$(ms); psql -qc '\\timing on' -c "alter table nguoi_dung rename column email to dia_chi_email" | sed "s/^/  [$t ms] MIGRATION: /" ) &amp;
while [ $(ms) -lt 5000 ]; do
  if [ $(ms) -lt 3000 ]; then ai=CU; cot=email; else ai=MOI; cot=dia_chi_email; fi
  t=$(ms); r=$(psql -qAt -c "select ten, $cot from nguoi_dung where id=1" 2&gt;&amp;1 | head -1)
  echo "  [$t ms] ma $ai: $r"
  sleep 0.2
done
wait</code></pre>
<div class="out">  [995 ms] ma CU: nd1|nd1@x.com
  [1005 ms] MIGRATION: Time: 3.381 ms
  [1240 ms] ma CU: ERROR:  column "email" does not exist
  [1482 ms] ma CU: ERROR:  column "email" does not exist
  …
  [3001 ms] ma CU: ERROR:  column "email" does not exist
  [3240 ms] ma MOI: nd1|nd1@x.com</div>
<ul>
<li><strong>Read the timestamps, not the error.</strong> The migration took 3.4 ms. Every request of the old code from 1,240 ms to 3,001 ms failed — eight out of eight. The window is exactly "migration committed" to "old code gone", and the migration's own duration is irrelevant to it.</li>
<li><strong>Change one number and the outage changes with it.</strong> Move the swap from second 3 to second 5 and the same run gives 17 failures instead of 8. On a real deploy that gap is image pull + container start + health check — tens of seconds, not two.</li>
<li><strong>Replace the rename with <code>add column dia_chi_email text</code></strong> and run it again: zero failures, because old code never asks for the new column — but the new code reads an empty value (<code>nd1|</code>) until the data is copied across, which is exactly the job of Lesson 5.2's backfill and trigger. That is the difference between the "safe" and "unsafe" rows of the table above, measured instead of asserted.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Trap — a green migration log proves nothing about the running application.</strong> <code>ALTER TABLE … RENAME</code> printed <code>Time: 3.381 ms</code> and exited 0. The failures happened in a different process, in a different log. This project's own July incident had the same shape from the other side: two deploy workflows raced on a push to <code>main</code>, a new image started before its migration had run, and the feed returned 500 while every deploy step reported success. After a deploy that contains a migration, look at the <em>application's</em> error log for the next minute, not only at the migration output.</div>

<h3>On macOS and Windows</h3>
<ul>
<li><strong>You do not need a local <code>psql</code>.</strong> <code>docker exec -it pg-thu psql -U postgres</code> opens a client inside the database container, on any operating system with Docker Desktop. The lab VPS has <code>postgresql-client-16</code> installed, which is closer to how you will reach production.</li>
<li><strong>Line endings in migration files.</strong> A teammate on Windows with <code>core.autocrlf=true</code> can commit <code>migration.sql</code> with CRLF. PostgreSQL does not care, but the file's bytes — and Prisma's checksum of it — change. Add <code>*.sql text eol=lf</code> to <code>.gitattributes</code> so every machine sees the same bytes.</li>
<li><strong>Measured, and worth knowing:</strong> <code>prisma migrate deploy</code> (5.22) does <em>not</em> compare checksums of already-applied files. An applied migration whose content was later edited — even a real SQL change — still reports <code>No pending migrations to apply.</code> The edit never reaches production, but every <em>new</em> database built from the folder gets the edited version. That is one way two databases drift apart with no error anywhere, and why the project rule is "never edit a deployed migration".</li>
</ul>

<h3>Why this chapter is the one with the real outages</h3>
<p>Everything before this chapter is recoverable. A bad artifact is replaced by a good one; a failed transport is retried; a broken swap is reversed by moving a symlink back. A migration is different in one specific way: <strong>it changes data</strong>, and Chapter 6 will measure exactly which of those changes can be undone. A dropped column does not come back because you deployed the old code again.</p>
<div class="note-ct">This repository has been in the failed state. A migration failed partway through on a production deploy, leaving the tracking table saying the migration had started and not finished, and every subsequent deploy refused to run — the <code>P3009</code> state. The project's own instructions now say, in capital letters, not to auto-resolve that condition, because the automatic fixes can silently corrupt the schema further. Lesson 5.4 reproduces the state and explains what actually gets you out of it.</div>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the night before your SWP391 defence, a teammate pushes a migration that renames <code>email</code> to <code>dia_chi_email</code>, and the demo site starts throwing errors while "the deploy succeeded". You will reproduce the outage, measure its length, and show the version of the change that has no outage at all. Build the lab once — it is reused for the whole chapter:</p>
<pre><code class="language-bash">mkdir -p ~/dv-lab5 &amp;&amp; cd ~/dv-lab5
docker network create lab5-net
docker run -d --name pg-thu --network lab5-net --memory 1g \\
  -e POSTGRES_PASSWORD=thu -p 127.0.0.1:15432:5432 postgres:16
ssh-keygen -t ed25519 -N "" -f ./khoa -q          # khoá CHỈ cho phòng thí nghiệm
cat &gt; Dockerfile &lt;&lt;'EOF'
FROM ubuntu:24.04
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends openssh-server postgresql-client-16 \\
 &amp;&amp; mkdir -p /run/sshd &amp;&amp; useradd -m -s /bin/bash deploy &amp;&amp; mkdir -p /home/deploy/.ssh
COPY khoa.pub /home/deploy/.ssh/authorized_keys
RUN chown -R deploy /home/deploy/.ssh &amp;&amp; chmod 700 /home/deploy/.ssh
CMD ["/usr/sbin/sshd", "-D", "-e"]
EOF
docker build -t vps-thu5 . &amp;&amp; docker run -d --name vps-thu5 --network lab5-net -p 127.0.0.1:2222:22 vps-thu5
echo "pg-thu:5432:*:postgres:thu" &gt; pgpass
ssh -i khoa -p 2222 -o UserKnownHostsFile=./known_hosts deploy@127.0.0.1 \\
  'cat &gt; ~/.pgpass &amp;&amp; chmod 600 ~/.pgpass' &lt; pgpass
ssh -i khoa -p 2222 -o UserKnownHostsFile=./known_hosts deploy@127.0.0.1 \\
  'PGHOST=pg-thu PGUSER=postgres psql -tAc "select version()"'</code></pre>
<ol>
<li>Copy <code>cuaso.sh</code> from this lesson to the VPS (<code>scp -i khoa -P 2222 -o UserKnownHostsFile=./known_hosts cuaso.sh deploy@127.0.0.1:</code>) and run it with <code>PGHOST=pg-thu</code>. Count the <code>ERROR</code> lines.</li>
<li>Change the "new code takes over" point from 3000 to 5000 ms and run again. Write down both counts.</li>
<li>Replace the rename with <code>alter table nguoi_dung add column dia_chi_email text</code> (and let the "new code" read it only after the migration). Run again.</li>
<li>In your own words, one sentence: why the second number is roughly double the first, why the third run has no errors, and why it still is not finished.</li>
</ol>
<p><strong>Done when:</strong> you have three numbers — about 8, about 16–17 and 0 error lines (the third run shows <code>nd1|</code> with an empty address) — and the sentence names "migration committed" and "old code stopped" as the two ends of the window.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Schema</span><span class="v">The shape of the database: tables, columns, types, constraints, indexes.</span></div>
  <div class="kv"><span class="k">Migration</span><span class="v">A versioned SQL file that moves the schema one step; runs once per database.</span></div>
  <div class="kv"><span class="k">Migration ledger</span><span class="v">The table (<code>_prisma_migrations</code>) recording which migrations started and finished in this database.</span></div>
  <div class="kv"><span class="k">Mixed-version window</span><span class="v">The time during which code and schema of different releases meet — where outages happen.</span></div>
  <div class="kv"><span class="k">Backward compatible</span><span class="v">A schema the <em>previous</em> release can still read and write.</span></div>
  <div class="kv"><span class="k">Shadow database</span><span class="v">A throw-away database that <code>migrate dev</code> replays history on; <code>migrate deploy</code> never uses one.</span></div>
  <div class="kv"><span class="k">Maintenance window</span><span class="v">A planned outage: stop, migrate, start. Legitimate, but it is an outage.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Code and schema reach production at two different moments, and the database is shared: for a while, one version of the code always meets the other version of the schema.</li>
<li>A column rename ran in 3.4 ms and made eight out of eight old-code requests fail until the old code was gone — the migration itself reported success.</li>
<li>Blue-green makes the mixed-version window longer on purpose, and a code rollback re-opens it with old code in front of a new schema.</li>
<li>The rule: every migration must leave a database the previous release can still use; if that takes several deploys, it takes several deploys.</li>
<li>No ordering of "migrate" and "swap" fixes an unsafe migration — the migration itself has to be split.</li>
<li>After a deploy with a migration, watch the application's error log, not only the migration output.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — ALTER TABLE and its lock levels</span><span class="lc-sub">postgresql.org/docs/current/sql-altertable.html — which variants rewrite the table and which are metadata-only, measured in Lesson 5.3.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — ParallelChange (expand and contract)</span><span class="lc-sub">martinfowler.com/bliki/ParallelChange.html — the two-page statement of the pattern Lesson 5.2 measures.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — XII. Admin processes</span><span class="lc-sub">12factor.net/admin-processes — running a migration as a one-off process against the same release, which is what makes option C above coherent.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Prisma ORM — migrations, and what the migration table records</span><span class="lc-sub">/courses/prisma-orm/learn${REF} — the tracking table behind the stuck state, and what each of its columns means.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Mã và lược đồ được deploy ở hai thời điểm khác nhau</h2>
<p class="lead">Chương 3 đã đưa bước tráo về không request nào bị rơi. Kết quả đó ngầm giả định MỘT điều: rằng hai phiên bản của ứng dụng CHẠY ĐƯỢC cùng lúc. Thêm một thay đổi lược đồ vào thì cái giả định ấy thành một CÂU HỎI — vì cơ sở dữ liệu là DÙNG CHUNG, và chỉ tồn tại đúng MỘT phiên bản của nó.</p>

<h3>Thay đổi lược đồ đơn giản nhất có thể, đo thật</h3>
${slide('dv-05', 3, 'Đổi tên cột: migration 3 ms, mã cũ lỗi suốt 2 giây')}
<p>Đổi tên một cột. Mã cũ chọn <code>email</code>; mã mới chọn <code>dia_chi_email</code>:</p>
<div class="out">── CACH NGAY THO: migration doi ten cot, roi moi deploy ma moi ──
  ── ngay sau migration, ma CU van dang chay: ──
    ERROR:  column "email" does not exist
    LINE 1: select ten, email from nguoi_dung limit 1;
  ── ma MOI (chua deploy xong): ──
    nd1|nd1@x.com

  → CUA SO GIAN DOAN = tu luc migration chay toi luc ma moi phuc vu</div>
<div class="callout warn"><strong>Lệnh đổi tên thành công trong vài mili giây và làm hỏng MỌI request mà mã cũ đang phục vụ.</strong> Không phải MỘT SỐ request — mà MỌI request có chạm vào bảng đó. Cái gián đoạn chạy từ khoảnh khắc migration được ghi nhận cho tới khi tiến trình cũ CUỐI CÙNG dừng lại, và chẳng có gì trong kết quả của chính migration cho thấy điều đó: migration BÁO THÀNH CÔNG.</div>

<h3>Deploy không-gián-đoạn làm chuyện này TỆ HƠN, không phải tốt hơn</h3>
${slide('dv-05', 4, 'Ba thứ tự migrate/tráo và chỗ mã lệch lược đồ')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Cú tráo ngây thơ có cửa sổ NGẮN</span><span class="lz-d">Dừng cũ, migrate, khởi động mới. Mã cũ ĐÃ CHẾT sẵn khi lược đồ đổi, nên chẳng có gì truy vấn theo hình dạng cũ. Bạn nhận cái gián đoạn đo ở Bài 3.1 — 168 request rơi — nhưng KHÔNG có lệch lược đồ.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cú tráo xanh-lam CỐ Ý cho chúng chồng lên nhau</span><span class="lz-d">Toàn bộ kỹ thuật của Chương 3 là chạy CẢ HAI phiên bản cùng lúc. Mà đó chính xác là điều kiện để một cột bị đổi tên làm vỡ bản cũ. Lần deploy TỐT HƠN lại có cửa sổ trộn phiên bản DÀI HƠN, chứ không ngắn hơn.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Và một cú lùi bản MỞ LẠI cái cửa sổ đó</span><span class="lz-d">Lùi MÃ không lùi LƯỢC ĐỒ. Quay về bản phát hành trước là đặt mã cũ trước một cơ sở dữ liệu mới — vẫn cái lệch ấy, tới vào đúng thời điểm tệ nhất, tức là giữa một sự cố.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nên lược đồ phải làm hài lòng CẢ HAI phiên bản</span><span class="lz-d">Không phải "phiên bản mới". CẢ HAI. Trong suốt khoảng thời gian cả hai còn có thể chạy — mà khoảng đó bao gồm cả cửa sổ lùi bản, nên trên thực tế là ít nhất một chu kỳ deploy SAU khi mã đã đổi. Bài 5.2 là khuôn mẫu đạt được điều đó.</span></div>
</div>
<div class="callout ok"><strong>Cái luật mà phần còn lại của chương này tuân theo.</strong> Mọi migration đều phải để cơ sở dữ liệu ở một trạng thái mà bản phát hành <em>TRƯỚC ĐÓ</em> vẫn chạy được. Nếu điều đó không làm được trong một bước thì nó cần NHIỀU HƠN một lần deploy — và đó là chuyện BÌNH THƯỜNG, không phải một thất bại về kế hoạch.</div>

<h3>Những thay đổi nào tự thân đã an toàn</h3>
${slide('dv-05', 5, 'Thay đổi nào tự thân an toàn với mã cũ')}
<div class="kv-grid">
  <div class="kv"><span class="k">An toàn: thêm một cột cho phép NULL</span><span class="v">Mã cũ không biết nó tồn tại và không chọn nó. Mã mới thì dùng nó. Không phiên bản nào vỡ.</span></div>
  <div class="kv"><span class="k">An toàn: thêm bảng mới, thêm chỉ mục mới</span><span class="v">Chẳng có gì đang tồn tại tham chiếu tới nó. Cái giá duy nhất là THỜI GIAN và KHOÁ — Bài 5.3.</span></div>
  <div class="kv"><span class="k">KHÔNG an toàn: đổi tên hay xoá bất cứ thứ gì</span><span class="v">Cột, bảng, ràng buộc. Mã cũ tham chiếu tới tên cũ và nhận lỗi, NGAY LẬP TỨC, trên MỌI request.</span></div>
  <div class="kv"><span class="k">KHÔNG an toàn: thêm cột NOT NULL mà không có giá trị mặc định</span><span class="v">Mã cũ chèn dòng mà không có nó và MỌI lệnh chèn đều hỏng. Thêm <code>NOT NULL DEFAULT</code> thì an toàn; thêm mỗi <code>NOT NULL</code> thì không.</span></div>
  <div class="kv"><span class="k">KHÔNG an toàn: thu hẹp kiểu dữ liệu hay thêm ràng buộc</span><span class="v"><code>varchar(255)</code> xuống <code>varchar(50)</code>, hoặc một <code>UNIQUE</code> mới. Mã cũ ghi những giá trị mà luật mới từ chối — và những dòng ĐANG CÓ có thể đã vi phạm sẵn, chuyện được đo ở Bài 5.4.</span></div>
  <div class="kv"><span class="k">Tuỳ: đổi giá trị mặc định</span><span class="v">Vô hại với mã cũ vốn tự cấp giá trị tường minh; là một thay đổi HÀNH VI với mã cũ vốn dựa vào giá trị mặc định. Nó là cái nào thì phụ thuộc vào MÃ, không phụ thuộc vào lược đồ.</span></div>
</div>

<h3>Migration chạy vào lúc nào, so với mọi thứ khác</h3>
${slide('dv-05', 6, 'Không thứ tự nào cứu được một migration không an toàn')}
<pre><code><span class="tok-comment"># thu tu trong mot script deploy — migration nam O DAU?</span>

<span class="tok-comment"># A) TRUOC khi trao (pho bien nhat)</span>
migrate up            <span class="tok-comment"># luoc do doi TRUOC, ma cu VAN dang chay</span>
&lt;trao sang ban moi&gt;   <span class="tok-comment"># → luoc do moi phai chieu duoc MA CU</span>

<span class="tok-comment"># B) SAU khi trao</span>
&lt;trao sang ban moi&gt;   <span class="tok-comment"># ma moi chay TRUOC khi luoc do doi</span>
migrate up            <span class="tok-comment"># → ma moi phai chieu duoc LUOC DO CU</span>

<span class="tok-comment"># C) Nhu MOT BUOC RIENG, khong dinh vao deploy nao</span>
migrate up            <span class="tok-comment"># chay khi ban chon, thuong la truoc — Bai 5.2</span></code></pre>
<div class="pitfall"><strong>Bẫy — KHÔNG có thứ tự nào làm cho một migration KHÔNG AN TOÀN trở nên an toàn.</strong> Chạy nó trước bước tráo thì vỡ mã cũ; chạy sau thì vỡ mã mới; chạy giữa chừng thì vỡ lần lượt cả hai. Người ta phát hiện ra điều này rồi kết luận rằng phải có một cửa sổ bảo trì, cách đó CHẠY ĐƯỢC và tốn một lần gián đoạn. Câu trả lời THẬT là chính cái <em>MIGRATION</em> phải đổi — tách thành những bước mà từng bước tự nó đã an toàn. Thứ tự chỉ quan trọng KHI mọi bước đã làm hài lòng cả hai phiên bản.</div>

<h3>Cho người mới: "migration" trong một dự án Prisma là gì</h3>
<p>Ba thứ có tên na ná nhau, và nhầm chúng với nhau là cách phần lớn sự cố của chương này bắt đầu:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tệp lược đồ — <code>prisma/schema.prisma</code></span><span class="v">Hình dạng bạn <em>MUỐN</em> cơ sở dữ liệu có. Tự sửa nó thì chẳng CSDL nào thay đổi cả.</span></div>
  <div class="kv"><span class="k">Một migration — <code>prisma/migrations/&lt;thời điểm&gt;_&lt;tên&gt;/migration.sql</code></span><span class="v">SQL thuần đưa một CSDL đi MỘT bước từ hình dạng cũ sang hình dạng mới. Được commit vào git, chạy theo thứ tự thời điểm, và KHÔNG BAO GIỜ sửa lại sau khi đã chạy ở một nơi quan trọng.</span></div>
  <div class="kv"><span class="k">Cuốn sổ — bảng <code>_prisma_migrations</code></span><span class="v">Nằm TRONG mỗi CSDL, mỗi migration một dòng: bắt đầu lúc nào, xong lúc nào (<code>finished_at</code>), có bị lùi không. Nhờ nó mà công cụ biết cái gì đang "chờ chạy". Bài 5.4 nói về chuyện xảy ra khi dòng này và lược đồ thật nói hai điều khác nhau.</span></div>
  <div class="kv"><span class="k"><code>prisma migrate dev</code> và <code>prisma migrate deploy</code></span><span class="v"><code>dev</code> dành cho laptop: nó so tệp lược đồ, <em>VIẾT RA</em> một migration mới, và dựng lại toàn bộ lịch sử trên một "shadow database" (CSDL bóng — dùng xong vứt). <code>deploy</code> dành cho máy chủ: nó chỉ chạy các tệp migration đang chờ, theo thứ tự, rồi ghi sổ từng cái. Nó không sinh ra gì và không xoá sạch gì.</span></div>
</div>
<p>Vậy "deploy một thay đổi lược đồ" nghĩa là: một thư mục mới trong <code>prisma/migrations/</code> đi theo bản phát hành, và một bước nào đó trên máy chủ chạy <code>migrate deploy</code> vào CSDL production. Bước đó chạy <em>LÚC NÀO</em>, so với khoảnh khắc mã mới bắt đầu phục vụ, chính là toàn bộ chủ đề của bài này.</p>

<h3>Tự chạy: đo cái cửa sổ trên VPS thí nghiệm</h3>
<p>Phép đo ở đầu bài (slide 3) là một script ba mươi dòng: mã cũ hỏi <code>email</code> mỗi 250 ms, một migration đổi tên cột ở giây thứ 1, và mã mới thay chỗ ở giây thứ 3. Chạy từ VPS thí nghiệm vào PostgreSQL 16 ở container bên cạnh:</p>
<pre><code class="language-bash"># cuaso.sh — chạy trên VPS thí nghiệm (PGHOST trỏ vào container Postgres)
export PGHOST=pg-thu PGUSER=postgres
psql -qc "drop table if exists nguoi_dung; create table nguoi_dung(id int primary key, ten text, email text); insert into nguoi_dung values (1,'nd1','nd1@x.com');"
T0=$(date +%s%N); ms(){ echo $(( ($(date +%s%N) - T0) / 1000000 )); }
( sleep 1; t=$(ms); psql -qc '\\timing on' -c "alter table nguoi_dung rename column email to dia_chi_email" | sed "s/^/  [$t ms] MIGRATION: /" ) &amp;
while [ $(ms) -lt 5000 ]; do
  if [ $(ms) -lt 3000 ]; then ai=CU; cot=email; else ai=MOI; cot=dia_chi_email; fi
  t=$(ms); r=$(psql -qAt -c "select ten, $cot from nguoi_dung where id=1" 2&gt;&amp;1 | head -1)
  echo "  [$t ms] ma $ai: $r"
  sleep 0.2
done
wait</code></pre>
<div class="out">  [995 ms] ma CU: nd1|nd1@x.com
  [1005 ms] MIGRATION: Time: 3.381 ms
  [1240 ms] ma CU: ERROR:  column "email" does not exist
  [1482 ms] ma CU: ERROR:  column "email" does not exist
  …
  [3001 ms] ma CU: ERROR:  column "email" does not exist
  [3240 ms] ma MOI: nd1|nd1@x.com</div>
<ul>
<li><strong>Đọc mốc thời gian, đừng chỉ đọc lỗi.</strong> Migration mất 3,4 ms. MỌI request của mã cũ từ 1.240 ms tới 3.001 ms đều hỏng — tám trên tám. Cửa sổ đúng bằng khoảng "migration được ghi nhận" tới "mã cũ biến mất", và thời gian chạy của chính migration chẳng liên quan gì tới nó.</li>
<li><strong>Đổi một con số, sự cố đổi theo.</strong> Dời bước tráo từ giây 3 sang giây 5 thì cùng lần chạy đó cho 17 lần hỏng thay vì 8. Ở một lần deploy thật, khoảng đó là kéo ảnh + khởi động container + kiểm sức khoẻ — hàng chục giây, không phải hai.</li>
<li><strong>Thay cú đổi tên bằng <code>add column dia_chi_email text</code></strong> rồi chạy lại: không lỗi nào, vì mã cũ không bao giờ hỏi tới cột mới — nhưng mã mới đọc ra một giá trị RỖNG (<code>nd1|</code>) cho tới khi dữ liệu được chép sang, và đó chính là việc của bước lấp dữ liệu + trigger ở Bài 5.2. Đó là khác biệt giữa các hàng "an toàn" và "không an toàn" của bảng phía trên — đo được, chứ không chỉ khẳng định.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Bẫy — log migration xanh không chứng minh gì về ứng dụng đang chạy.</strong> <code>ALTER TABLE … RENAME</code> in <code>Time: 3.381 ms</code> và thoát 0. Chỗ hỏng nằm ở một tiến trình KHÁC, trong một cái log KHÁC. Sự cố tháng 7 của chính dự án này có cùng hình dạng nhìn từ phía ngược lại: hai workflow deploy đua nhau khi push <code>main</code>, một ảnh mới khởi động trước khi migration của nó kịp chạy, và feed trả 500 trong khi mọi bước deploy đều báo thành công. Sau một lần deploy có migration, hãy nhìn log lỗi của <em>ỨNG DỤNG</em> trong một phút kế tiếp, chứ đừng chỉ nhìn output của migration.</div>

<h3>Trên macOS và Windows</h3>
<ul>
<li><strong>Bạn không cần cài <code>psql</code> trên máy.</strong> <code>docker exec -it pg-thu psql -U postgres</code> mở một trình khách ngay bên trong container CSDL, trên hệ điều hành nào có Docker Desktop cũng được. VPS thí nghiệm đã cài sẵn <code>postgresql-client-16</code> — giống với cách bạn sẽ chạm tới production hơn.</li>
<li><strong>Kiểu xuống dòng trong tệp migration.</strong> Một bạn cùng nhóm dùng Windows với <code>core.autocrlf=true</code> có thể commit <code>migration.sql</code> mang CRLF. PostgreSQL không quan tâm, nhưng các byte của tệp — và mã kiểm tra (checksum) Prisma tính trên nó — thì đổi. Thêm <code>*.sql text eol=lf</code> vào <code>.gitattributes</code> để máy nào cũng thấy cùng một bộ byte.</li>
<li><strong>Đã đo, và đáng biết:</strong> <code>prisma migrate deploy</code> (5.22) <em>KHÔNG</em> so checksum của những tệp đã áp dụng. Một migration đã chạy mà sau đó bị sửa nội dung — kể cả sửa SQL thật — vẫn báo <code>No pending migrations to apply.</code> Chỗ sửa không bao giờ tới production, nhưng mọi CSDL <em>MỚI</em> dựng từ thư mục đó lại nhận bản đã sửa. Đó là một cách để hai CSDL trôi lệch nhau mà không có lỗi nào ở đâu cả, và là lý do luật của dự án ghi "không bao giờ sửa một migration đã deploy".</li>
</ul>

<h3>Vì sao đây là chương chứa những sự cố thật</h3>
<p>Mọi thứ TRƯỚC chương này đều KHÔI PHỤC ĐƯỢC. Một tạo tác hỏng thì thay bằng một cái tốt; một lần vận chuyển hỏng thì thử lại; một cú tráo hỏng thì đảo ngược bằng cách di chuyển symlink về. Migration khác ở đúng MỘT điểm: <strong>nó thay đổi DỮ LIỆU</strong>, và Chương 6 sẽ đo chính xác những thay đổi nào trong số đó hoàn tác được. Một cái cột đã bị xoá KHÔNG quay lại chỉ vì bạn deploy lại mã cũ.</p>
<div class="note-ct">Kho mã này đã từng rơi vào cái trạng thái hỏng đó. Một migration hỏng nửa chừng trên một lần deploy production, để lại bảng theo dõi ghi rằng migration ĐÃ BẮT ĐẦU và CHƯA XONG, và mọi lần deploy sau đó đều từ chối chạy — trạng thái <code>P3009</code>. Chính hướng dẫn của dự án bây giờ ghi bằng chữ in hoa rằng ĐỪNG tự động gỡ cái tình trạng đó, vì mấy cách sửa tự động có thể âm thầm làm hỏng lược đồ thêm nữa. Bài 5.4 tái hiện lại trạng thái ấy và nói cái gì mới THẬT SỰ đưa bạn ra khỏi nó.</div>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tối trước buổi bảo vệ SWP391, một bạn cùng nhóm đẩy lên một migration đổi tên <code>email</code> thành <code>dia_chi_email</code>, và trang demo bắt đầu báo lỗi trong khi "deploy đã thành công". Bạn sẽ tái hiện sự cố, đo độ dài của nó, và chỉ ra phiên bản của thay đổi đó mà không có sự cố nào. Dựng phòng thí nghiệm một lần — dùng lại cho cả chương:</p>
<pre><code class="language-bash">mkdir -p ~/dv-lab5 &amp;&amp; cd ~/dv-lab5
docker network create lab5-net
docker run -d --name pg-thu --network lab5-net --memory 1g \\
  -e POSTGRES_PASSWORD=thu -p 127.0.0.1:15432:5432 postgres:16
ssh-keygen -t ed25519 -N "" -f ./khoa -q          # khoá CHỈ cho phòng thí nghiệm
cat &gt; Dockerfile &lt;&lt;'EOF'
FROM ubuntu:24.04
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends openssh-server postgresql-client-16 \\
 &amp;&amp; mkdir -p /run/sshd &amp;&amp; useradd -m -s /bin/bash deploy &amp;&amp; mkdir -p /home/deploy/.ssh
COPY khoa.pub /home/deploy/.ssh/authorized_keys
RUN chown -R deploy /home/deploy/.ssh &amp;&amp; chmod 700 /home/deploy/.ssh
CMD ["/usr/sbin/sshd", "-D", "-e"]
EOF
docker build -t vps-thu5 . &amp;&amp; docker run -d --name vps-thu5 --network lab5-net -p 127.0.0.1:2222:22 vps-thu5
echo "pg-thu:5432:*:postgres:thu" &gt; pgpass
ssh -i khoa -p 2222 -o UserKnownHostsFile=./known_hosts deploy@127.0.0.1 \\
  'cat &gt; ~/.pgpass &amp;&amp; chmod 600 ~/.pgpass' &lt; pgpass
ssh -i khoa -p 2222 -o UserKnownHostsFile=./known_hosts deploy@127.0.0.1 \\
  'PGHOST=pg-thu PGUSER=postgres psql -tAc "select version()"'</code></pre>
<ol>
<li>Chép <code>cuaso.sh</code> của bài này lên VPS (<code>scp -i khoa -P 2222 -o UserKnownHostsFile=./known_hosts cuaso.sh deploy@127.0.0.1:</code>) rồi chạy với <code>PGHOST=pg-thu</code>. Đếm số dòng <code>ERROR</code>.</li>
<li>Đổi mốc "mã mới thay chỗ" từ 3000 thành 5000 ms rồi chạy lại. Ghi lại cả hai con số.</li>
<li>Thay cú đổi tên bằng <code>alter table nguoi_dung add column dia_chi_email text</code> (và cho "mã mới" chỉ đọc cột đó SAU migration). Chạy lại.</li>
<li>Viết bằng lời của bạn, một câu: vì sao con số thứ hai xấp xỉ gấp đôi con số thứ nhất, vì sao lần chạy thứ ba không có lỗi nào, và vì sao nó vẫn chưa xong việc.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có ba con số — khoảng 8, khoảng 16–17 và 0 dòng lỗi (lần thứ ba in <code>nd1|</code> với địa chỉ rỗng) — và câu giải thích gọi đúng tên hai đầu của cửa sổ: "migration được ghi nhận" và "mã cũ dừng hẳn".</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Schema (lược đồ)</span><span class="v">Hình dạng của CSDL: bảng, cột, kiểu, ràng buộc, chỉ mục.</span></div>
  <div class="kv"><span class="k">Migration (bước chuyển lược đồ)</span><span class="v">Một tệp SQL có phiên bản, đưa lược đồ đi một bước; chạy đúng một lần trên mỗi CSDL.</span></div>
  <div class="kv"><span class="k">Migration ledger (sổ migration)</span><span class="v">Bảng <code>_prisma_migrations</code> ghi migration nào đã bắt đầu và đã xong trong CSDL này.</span></div>
  <div class="kv"><span class="k">Mixed-version window (cửa sổ trộn phiên bản)</span><span class="v">Khoảng thời gian mã và lược đồ của hai bản phát hành khác nhau gặp nhau — nơi sự cố xảy ra.</span></div>
  <div class="kv"><span class="k">Backward compatible (tương thích ngược)</span><span class="v">Lược đồ mà bản phát hành <em>TRƯỚC</em> vẫn đọc và ghi được.</span></div>
  <div class="kv"><span class="k">Shadow database (CSDL bóng)</span><span class="v">CSDL dùng xong vứt mà <code>migrate dev</code> dựng lại lịch sử lên; <code>migrate deploy</code> không bao giờ dùng.</span></div>
  <div class="kv"><span class="k">Maintenance window (cửa sổ bảo trì)</span><span class="v">Một lần gián đoạn có kế hoạch: dừng, migrate, bật lại. Hợp lệ — nhưng vẫn là gián đoạn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mã và lược đồ lên production ở hai thời điểm khác nhau, còn CSDL thì dùng chung: trong một khoảng, luôn có một phiên bản mã gặp phiên bản lược đồ kia.</li>
<li>Một cú đổi tên cột chạy 3,4 ms và làm tám trên tám request của mã cũ hỏng cho tới khi mã cũ biến mất — trong khi chính migration báo thành công.</li>
<li>Xanh-lam CỐ Ý kéo dài cửa sổ trộn phiên bản, và một cú lùi mã mở lại nó với mã cũ đứng trước lược đồ mới.</li>
<li>Luật: mọi migration phải để lại một CSDL mà bản phát hành trước vẫn dùng được; cần nhiều lần deploy thì chấp nhận nhiều lần deploy.</li>
<li>Không thứ tự "migrate" và "tráo" nào cứu được một migration không an toàn — phải tách chính migration.</li>
<li>Sau một lần deploy có migration, hãy nhìn log lỗi của ứng dụng, đừng chỉ nhìn output của migration.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — ALTER TABLE và các mức khoá của nó</span><span class="lc-sub">postgresql.org/docs/current/sql-altertable.html — biến thể nào ghi lại cả bảng và biến thể nào chỉ đụng siêu dữ liệu, đo ở Bài 5.3.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — ParallelChange (mở rộng và thu hẹp)</span><span class="lc-sub">martinfowler.com/bliki/ParallelChange.html — phát biểu hai trang của khuôn mẫu mà Bài 5.2 đem đi đo.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — XII. Admin processes</span><span class="lc-sub">12factor.net/admin-processes — chạy migration như một tiến trình một-lần trên cùng bản phát hành, và đó là thứ làm cho phương án C ở trên mạch lạc.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Prisma ORM — migration, và bảng theo dõi ghi lại những gì</span><span class="lc-sub">/courses/prisma-orm/learn${REF} — cái bảng theo dõi nằm sau trạng thái kẹt, và mỗi cột của nó nghĩa là gì.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.2 ─────────────────────────── */
    {
      title: '5.2 — Expand and contract: the rename that never breaks|||5.2 — Mở rộng và thu hẹp: cú đổi tên không bao giờ làm vỡ',
      slug: 'deploy-5-2-mo-rong-thu-hep',
      type: 'LESSON',
      description: 'Cùng cú đổi tên cột đã làm vỡ mọi request ở Bài 5.1, làm lại theo bốn giai đoạn. Đo cả bốn: có một giai đoạn mà mã CŨ ghi một dòng và mã MỚI đọc được nó ngay.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Expand and contract: the rename that never breaks</h2>
<p class="lead">Lesson 5.1 measured a column rename breaking every request. The fix is not a cleverer rename — it is refusing to rename at all, and instead going through a state where <em>both</em> names exist. Four phases, four deploys, and no moment where either version is broken.</p>

<h3>The four phases, measured</h3>
${slide('dv-05', 7, 'Mở rộng → chuyển → thu hẹp: bốn lần deploy')}
<div class="out">── GD1: truoc khi bat dau ──
    ma CU:  nd1|nd1@x.com
    ma MOI: ERROR:  column "dia_chi_email" does not exist

── GD2: THEM cot moi + dong bo (migration nay AN TOAN voi ma cu) ──
    ma CU:  nd1|nd1@x.com
    ma MOI: nd1|nd1@x.com
  ma CU ghi mot dong moi, loi? 0
  → ma MOI doc duoc dong do khong: nd_cu@x.com

── GD3: deploy ma MOI (doc/ghi cot moi). Ca hai cung chay ──
    ma CU:  nd1|nd1@x.com
    ma MOI: nd1|nd1@x.com

── GD4: THU HEP — bo cot cu, sau khi khong con ma cu nao ──
    ma CU:  ERROR:  column "email" does not exist
    ma MOI: nd1|nd1@x.com</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Phase 2 is a schema change with no code change</span><span class="v">Add the column, copy the data, add a trigger to keep them in sync. Old code keeps working because nothing it uses was touched — and new code would already work if it were deployed.</span></div>
  <div class="kv"><span class="k">The measured line that matters</span><span class="v">Old code inserted a row (<code>loi? 0</code> — no error) and new code read <code>nd_cu@x.com</code> out of the <em>new</em> column. The trigger filled it in. During the overlap, inserts from either version are visible to both — updates need the corrected trigger further down this lesson.</span></div>
  <div class="kv"><span class="k">Phase 3 is a code change with no schema change</span><span class="v">Deploy the new release. Both columns still exist, both versions still work, and the rollback target is still valid.</span></div>
  <div class="kv"><span class="k">Phase 4 is the only destructive step</span><span class="v">And by the time it runs, no code refers to the old column. The error it produces for old code is correct — old code is not supposed to exist any more.</span></div>
</div>

<h3>The migration for phase 2</h3>
${slide('dv-05', 8, 'Giai đoạn 2: thêm cột, lấp, trigger đồng bộ (bản đã sửa)')}
<pre><code><span class="tok-comment">-- 1. them cot moi (cho NULL — an toan voi ma cu)</span>
alter table nguoi_dung add column dia_chi_email text;

<span class="tok-comment">-- 2. chep du lieu dang co</span>
update nguoi_dung set dia_chi_email = email;

<span class="tok-comment">-- 3. giu hai cot dong bo khi CHEN (lenh SUA: dung ban da sua o muc ben duoi)</span>
create or replace function sync_row() returns trigger as \$\$
  begin
    if NEW.dia_chi_email is null then NEW.dia_chi_email := NEW.email; end if;
    if NEW.email is null then NEW.email := NEW.dia_chi_email; end if;
    return NEW;
  end
\$\$ language plpgsql;

create trigger tg_sync_row before insert or update on nguoi_dung
  for each row execute function sync_row();</code></pre>
<div class="callout ok"><strong>The trigger is what makes the overlap safe in both directions.</strong> Without it, old code writing to <code>email</code> leaves <code>dia_chi_email</code> null, and new code sees a row with no address. The measurement above confirms it works: a row written by old code was immediately readable by new code. Application-level double-writing is the alternative and it is worse — it only covers the version that has the double-write, so the <em>other</em> version's writes are still missed. One measured caveat about the trigger above: it only fills <code>NULL</code>s, so it covers inserts and misses updates — the section below shows the failure and the corrected function.</div>
<div class="pitfall"><strong>Trap — step 2 is an <code>UPDATE</code> over the whole table, and on a large table it is not free.</strong> A single <code>update ... set x = y</code> across ten million rows takes a long lock and writes a new version of every row, which can bloat the table and stall writes. Batch it — a few thousand rows at a time, in a loop with a short pause — and let the trigger handle everything written while the backfill runs. Lesson 5.3 measures the timings that make this concrete.</div>

<h3>The sync trigger, corrected: it has to handle UPDATE</h3>
${slide('dv-05', 9, 'Trigger chỉ lấp NULL bỏ sót lệnh SỬA — đo thật')}
<p>The phase-2 trigger printed above passed the insert test and fails the next obvious one. With it installed, the old code changes a user's address:</p>
<div class="out">── trigger CU (chi lap o NULL): ma CU sua email cua nd1 ──
email=doi@x.com  dia_chi_email=nd1@x.com</div>
<p>On an <code>UPDATE</code>, <code>NEW</code> starts as a copy of the existing row, so <code>NEW.dia_chi_email</code> is the <em>old</em> address — not <code>NULL</code> — and the trigger does nothing. The new code keeps reading the old address. No error, no log line: the two columns simply stop agreeing, and phase 4 then drops the column that had the right value. The fix compares <code>NEW</code> with <code>OLD</code> to see which side actually changed:</p>
<pre><code class="language-sql">create or replace function sync_row() returns trigger as \$\$
begin
  if TG_OP = 'INSERT' then
    NEW.dia_chi_email := coalesce(NEW.dia_chi_email, NEW.email);
    NEW.email         := coalesce(NEW.email, NEW.dia_chi_email);
  elsif NEW.email is distinct from OLD.email then
    NEW.dia_chi_email := NEW.email;           -- ma CU vua sua
  elsif NEW.dia_chi_email is distinct from OLD.dia_chi_email then
    NEW.email := NEW.dia_chi_email;           -- ma MOI vua sua
  end if;
  return NEW;
end \$\$ language plpgsql;</code></pre>
<div class="out">── trigger SUA (so voi OLD): ma CU sua, roi ma MOI sua ──
email=lan2@x.com  dia_chi_email=lan2@x.com
email=lan3@x.com  dia_chi_email=lan3@x.com</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>TG_OP</code></span><span class="v">A variable PostgreSQL sets inside every trigger: <code>'INSERT'</code>, <code>'UPDATE'</code> or <code>'DELETE'</code>. The two cases need different logic.</span></div>
  <div class="kv"><span class="k"><code>OLD</code> / <code>NEW</code></span><span class="v">The row before and after the statement. <code>OLD</code> does not exist on an insert — hence the <code>TG_OP</code> branch.</span></div>
  <div class="kv"><span class="k"><code>IS DISTINCT FROM</code></span><span class="v">"Not equal" that treats <code>NULL</code> as a value. Plain <code>&lt;&gt;</code> returns <code>NULL</code> (not true) when either side is null, so a change from null to a value would be missed.</span></div>
  <div class="kv"><span class="k">A statement that sets both columns</span><span class="v">The <code>email</code> branch wins. That is fine during the overlap because neither version of the code writes both at once — but it is the kind of assumption worth writing in the migration's comment.</span></div>
</div>
<p>And the check that makes phase 4 safe to run — it must return zero before you drop anything:</p>
<pre><code class="language-sql">select count(*) from nguoi_dung where email is distinct from dia_chi_email;</code></pre>

<h3>Run the four phases yourself</h3>
${slide('dv-05', 10, 'Đo thật: mã cũ ghi, mã mới đọc được ngay — cả hai chiều')}
<p>The measurement at the top of this lesson was re-run on 29/09/2026 against PostgreSQL 16.14 in the lab, now also writing in the <em>other</em> direction: new code inserts through <code>dia_chi_email</code> only, and old code reads the value through <code>email</code>.</p>
<div class="out">── GD2: THEM cot moi + trigger (chua doi ma) ──
    ma CU : nd1|nd1@x.com
    ma MOI: nd1|nd1@x.com
    ma CU ghi 'nd_cu' → ma MOI doc: nd_cu@x.com
    ma MOI ghi 'nd_moi' → ma CU doc: nd_moi@x.com</div>
<ul>
<li><strong>Phase 2 is one deploy that changes only the schema.</strong> Ship it, watch the error log, and leave it for a while. If anything goes wrong, dropping the new column and the trigger returns you exactly to phase 1.</li>
<li><strong>Phase 3 is one deploy that changes only code.</strong> Rolling it back puts the old code in front of a schema it still understands — the property the whole chapter is after.</li>
<li><strong>Phase 4 drops the trigger, then the function, then the old column</strong> — in that order, because the trigger references both columns. Run the "is distinct from" count first.</li>
</ul>

<h3>With Prisma: the rename it generates is DROP + ADD</h3>
<p>Measured on the lab database: rename a field in <code>schema.prisma</code> by changing its <code>@map</code> from <code>thu</code> to <code>ghi_chu</code>, and ask Prisma for the SQL:</p>
<pre><code class="language-bash">npx prisma migrate diff --from-schema-datasource prisma/schema.prisma \\
  --to-schema-datamodel prisma/schema.prisma --script</code></pre>
<div class="out">-- AlterTable
ALTER TABLE "post_music" DROP COLUMN "thu",
ADD COLUMN     "ghi_chu" TEXT;</div>
<div class="pitfall co-tieu-de"><strong>Trap — the generated migration for a rename deletes the data.</strong> The diff tool sees one column disappear and another appear; it cannot know you meant "the same column, new name". Deploying that file is worse than the outage in Lesson 5.1: the column's contents are gone, and redeploying the old code does not bring them back. With Prisma, expand–contract means <em>writing phase 2 and phase 4 by hand</em>: phase 2 is the schema with <strong>both</strong> fields plus a hand-written trigger in the migration SQL; phase 4 is a later migration that drops the old field. Always read a generated <code>migration.sql</code> before committing it, and treat any <code>DROP COLUMN</code> in it as a question, not a detail.</div>

<h3>When to use which</h3>
<table>
<tr><th>Situation</th><th>Choose</th><th>Why</th></tr>
<tr><td>Solo project or class demo, nobody uses it at 3 a.m.</td><td>Maintenance window</td><td>One deploy, two minutes of downtime, no trigger to write or forget.</td></tr>
<tr><td>Real users, blue-green swaps, rollbacks must work</td><td>Expand–contract</td><td>The only option with no moment where a running version is broken.</td></tr>
<tr><td>Only <em>adding</em> (nullable column, new table)</td><td>Neither — ship it</td><td>Already backward compatible; one deploy.</td></tr>
<tr><td>Changing a column type on a large table</td><td>Expand–contract with a new column</td><td><code>ALTER TYPE</code> rewrites the table under an exclusive lock (Lesson 5.3 measured 6.7 s on 5 million rows).</td></tr>
<tr><td>Team project, several people deploying</td><td>Expand–contract, and write phase 4 into the task list now</td><td>The people who remember phase 4 will not be the ones on duty when it is due.</td></tr>
</table>

<h3>The same shape, for other changes</h3>
${slide('dv-05', 11, 'Cùng khuôn cho NOT NULL, đổi kiểu, tách cột — và khi nào không cần')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Making a column NOT NULL</span><span class="lz-lnote">Expand: add a <code>DEFAULT</code> so old inserts get a value. Backfill the nulls. Deploy code that always supplies it. Contract: add the <code>NOT NULL</code>. In Postgres, add it as <code>NOT VALID</code> first and validate separately — Lesson 5.3.</span></div>
  <div class="lz-layer"><span class="lz-lname">Splitting one column into two</span><span class="lz-lnote">Add both new columns, backfill from the old, trigger to keep all three in sync, deploy code that reads the new pair, then drop the old. Three names alive at once, briefly.</span></div>
  <div class="lz-layer"><span class="lz-lname">Changing a column type</span><span class="lz-lnote">Add a new column of the new type rather than altering in place — an <code>ALTER TYPE</code> rewrites the table under a lock and cannot be reversed cheaply. Same four phases.</span></div>
  <div class="lz-layer"><span class="lz-lname">Moving a column to another table</span><span class="lz-lnote">The same pattern with a join instead of a column read, and the trigger writing across tables. Longer, and no different in shape.</span></div>
</div>

<h3>What it costs</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Four deploys instead of one</span><span class="lz-d">Spread over days, because phase 4 must wait until no old release could be rolled back to. This is the real cost, and it is why people skip it for "small" changes and then have the outage.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">A period where the schema is untidy</span><span class="lz-d">Two columns holding the same thing, plus a trigger. It looks like a mistake to anyone reading the schema, so write down why it is there and when phase 4 happens — a comment on the column works: <code>comment on column … is 'tam thoi, bo o GD4 sau 2026-09-01'</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Phase 4 gets forgotten</span><span class="lz-d">The common failure. The system works after phase 3, so nobody is motivated to finish. Two years later the table has six abandoned columns and three triggers, and nobody knows which are live. Schedule phase 4 when you write phase 2.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">In exchange: every phase is individually reversible</span><span class="lz-d">Which is the point. At no step does rolling back the code leave the database in a shape the previous version cannot read — the property Lesson 5.1 established as the rule.</span></div>
</div>
<div class="note-ct">For a project with one developer and no traffic at 3 a.m., a maintenance window is a legitimate alternative: stop the app, migrate, start it. Two minutes of downtime, one deploy, no trigger. The reason to know expand–contract anyway is that "we have no traffic right now" stops being true at some point, usually without a decision being made about it — and the pattern is much easier to learn before you need it than during.</div>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your team's booking app must rename <code>email</code> to <code>dia_chi_email</code> while the demo stays up, and a rollback must keep working at every step. Use the lab from Lesson 5.1 (<code>pg-thu</code> + <code>vps-thu5</code>).</p>
<ol>
<li>Create <code>nguoi_dung(id serial primary key, ten text, email text)</code> with one row. Apply phase 2 using the <strong>naive</strong> trigger printed near the top of this lesson.</li>
<li>As "old code", run <code>update nguoi_dung set email = 'doi@x.com' where id = 1</code>, then read both columns. Note the mismatch.</li>
<li>Replace the function with the corrected version, re-run the backfill (<code>update nguoi_dung set dia_chi_email = email</code>), then update once through each column and read both again.</li>
<li>Run the phase-4 check <code>select count(*) … where email is distinct from dia_chi_email</code>, then phase 4 in the right order: <code>drop trigger</code>, <code>drop function</code>, <code>alter table … drop column email</code>.</li>
</ol>
<p><strong>Done when:</strong> step 2 shows <code>email=doi@x.com  dia_chi_email=nd1@x.com</code>, step 3 shows both columns equal after each update, the check returns <code>0</code>, and after phase 4 only <code>select … dia_chi_email</code> works.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Expand–contract</span><span class="v">Add the new shape, move code to it, then remove the old shape — across separate deploys.</span></div>
  <div class="kv"><span class="k">Backfill</span><span class="v">Copying existing data into the new column once it exists.</span></div>
  <div class="kv"><span class="k">Trigger</span><span class="v">A database function that runs automatically on insert/update/delete of each row.</span></div>
  <div class="kv"><span class="k"><code>BEFORE … FOR EACH ROW</code></span><span class="v">A trigger that can still change the row about to be written.</span></div>
  <div class="kv"><span class="k"><code>OLD</code> / <code>NEW</code></span><span class="v">The row before and after the current statement, inside a trigger.</span></div>
  <div class="kv"><span class="k"><code>IS DISTINCT FROM</code></span><span class="v">A null-safe "not equal".</span></div>
  <div class="kv"><span class="k">Contract phase</span><span class="v">The only destructive step; runs once no rollback target still needs the old shape.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Never rename in one step: add the new name, keep both in sync, move the code, then drop the old name — four deploys, none of them breaking a running version.</li>
<li>Phase 2 changes only the schema and phase 3 only the code, so a rollback at any point meets a schema it understands.</li>
<li>A sync trigger that only fills <code>NULL</code>s misses updates; compare <code>NEW</code> with <code>OLD</code> and prove the columns agree with an <code>IS DISTINCT FROM</code> count before phase 4.</li>
<li>Prisma turns a rename into <code>DROP COLUMN</code> + <code>ADD COLUMN</code>; with Prisma, phases 2 and 4 are migrations you write and read yourself.</li>
<li>A maintenance window is a legitimate choice for a solo project; expand–contract is the price of having no outage.</li>
<li>Schedule phase 4 when you write phase 2, or it will never happen.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — ParallelChange</span><span class="lc-sub">martinfowler.com/bliki/ParallelChange.html — expand, migrate, contract, stated in two pages and applicable well beyond databases.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — CREATE TRIGGER</span><span class="lc-sub">postgresql.org/docs/current/sql-createtrigger.html — <code>BEFORE INSERT OR UPDATE ... FOR EACH ROW</code>, which is the exact form the sync trigger needs.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — COMMENT ON</span><span class="lc-sub">postgresql.org/docs/current/sql-comment.html — attaching the "this is temporary, remove after" note to the schema itself rather than to a ticket.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — triggers, and what BEFORE gives you that AFTER does not</span><span class="lc-sub">/courses/postgresql/learn${REF} — why the sync trigger must be BEFORE to modify the row being written.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Mở rộng và thu hẹp: cú đổi tên không bao giờ làm vỡ</h2>
<p class="lead">Bài 5.1 đã đo một cú đổi tên cột làm vỡ mọi request. Cách sửa KHÔNG phải một cú đổi tên khôn ngoan hơn — mà là TỪ CHỐI đổi tên hẳn, và thay vào đó đi qua một trạng thái mà <em>CẢ HAI</em> cái tên cùng tồn tại. Bốn giai đoạn, bốn lần deploy, và không có khoảnh khắc nào mà một trong hai phiên bản bị vỡ.</p>

<h3>Bốn giai đoạn, đo thật</h3>
${slide('dv-05', 7, 'Mở rộng → chuyển → thu hẹp: bốn lần deploy')}
<div class="out">── GD1: truoc khi bat dau ──
    ma CU:  nd1|nd1@x.com
    ma MOI: ERROR:  column "dia_chi_email" does not exist

── GD2: THEM cot moi + dong bo (migration nay AN TOAN voi ma cu) ──
    ma CU:  nd1|nd1@x.com
    ma MOI: nd1|nd1@x.com
  ma CU ghi mot dong moi, loi? 0
  → ma MOI doc duoc dong do khong: nd_cu@x.com

── GD3: deploy ma MOI (doc/ghi cot moi). Ca hai cung chay ──
    ma CU:  nd1|nd1@x.com
    ma MOI: nd1|nd1@x.com

── GD4: THU HEP — bo cot cu, sau khi khong con ma cu nao ──
    ma CU:  ERROR:  column "email" does not exist
    ma MOI: nd1|nd1@x.com</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Giai đoạn 2 là thay đổi LƯỢC ĐỒ mà KHÔNG đổi mã</span><span class="v">Thêm cột, chép dữ liệu, thêm một trigger giữ hai bên đồng bộ. Mã cũ vẫn chạy vì chẳng thứ gì nó dùng bị đụng tới — và mã mới thì đã chạy được rồi NẾU nó được deploy.</span></div>
  <div class="kv"><span class="k">Dòng đo quan trọng nhất</span><span class="v">Mã CŨ chèn một dòng (<code>loi? 0</code> — không lỗi) và mã MỚI đọc ra <code>nd_cu@x.com</code> từ cột <em>MỚI</em>. Cái trigger đã điền vào. Trong khoảng chồng lấn, lệnh CHÈN từ phiên bản nào cũng nhìn thấy được ở cả hai bên — lệnh SỬA thì cần bản trigger đã sửa ở phía dưới bài này.</span></div>
  <div class="kv"><span class="k">Giai đoạn 3 là thay đổi MÃ mà KHÔNG đổi lược đồ</span><span class="v">Deploy bản mới. Cả hai cột vẫn còn, cả hai phiên bản vẫn chạy, và cái đích lùi bản vẫn còn hợp lệ.</span></div>
  <div class="kv"><span class="k">Giai đoạn 4 là bước PHÁ HUỶ duy nhất</span><span class="v">Và tới lúc nó chạy thì chẳng còn mã nào tham chiếu cột cũ. Cái lỗi nó sinh ra cho mã cũ là ĐÚNG — mã cũ lẽ ra không còn tồn tại nữa.</span></div>
</div>

<h3>Migration cho giai đoạn 2</h3>
${slide('dv-05', 8, 'Giai đoạn 2: thêm cột, lấp, trigger đồng bộ (bản đã sửa)')}
<pre><code><span class="tok-comment">-- 1. them cot moi (cho NULL — an toan voi ma cu)</span>
alter table nguoi_dung add column dia_chi_email text;

<span class="tok-comment">-- 2. chep du lieu dang co</span>
update nguoi_dung set dia_chi_email = email;

<span class="tok-comment">-- 3. giu hai cot dong bo khi CHEN (lenh SUA: dung ban da sua o muc ben duoi)</span>
create or replace function sync_row() returns trigger as \$\$
  begin
    if NEW.dia_chi_email is null then NEW.dia_chi_email := NEW.email; end if;
    if NEW.email is null then NEW.email := NEW.dia_chi_email; end if;
    return NEW;
  end
\$\$ language plpgsql;

create trigger tg_sync_row before insert or update on nguoi_dung
  for each row execute function sync_row();</code></pre>
<div class="callout ok"><strong>Cái trigger mới là thứ làm cho khoảng chồng lấn an toàn theo CẢ HAI CHIỀU.</strong> Thiếu nó thì mã cũ ghi vào <code>email</code> sẽ để <code>dia_chi_email</code> rỗng, và mã mới nhìn thấy một dòng không có địa chỉ. Phép đo ở trên xác nhận nó chạy: một dòng do mã cũ ghi ra thì mã mới ĐỌC ĐƯỢC NGAY. Phương án thay thế là ghi-đôi ở tầng ứng dụng, và nó TỆ HƠN — nó chỉ phủ được cái phiên bản CÓ đoạn ghi-đôi, nên lệnh ghi của phiên bản KIA vẫn bị bỏ sót. Một lưu ý đã đo về cái trigger ở trên: nó chỉ lấp ô <code>NULL</code>, nên phủ được lệnh CHÈN mà bỏ sót lệnh SỬA — mục ngay dưới cho thấy chỗ hỏng và hàm đã sửa.</div>
<div class="pitfall"><strong>Bẫy — bước 2 là một lệnh <code>UPDATE</code> trên TOÀN BỘ bảng, và trên một bảng lớn thì nó không miễn phí.</strong> Một lệnh <code>update ... set x = y</code> chạy qua mười triệu dòng sẽ giữ khoá lâu và ghi ra một phiên bản mới của MỌI dòng, làm bảng phình lên và làm nghẽn các lệnh ghi. Hãy CHIA LÔ — vài nghìn dòng một lần, trong một vòng lặp có nghỉ ngắn — và để cái trigger lo mọi thứ được ghi trong lúc lấp dữ liệu chạy. Bài 5.3 đo những con số làm chuyện này thành cụ thể.</div>

<h3>Trigger đồng bộ, bản đã sửa: nó phải xử lý được lệnh SỬA</h3>
${slide('dv-05', 9, 'Trigger chỉ lấp NULL bỏ sót lệnh SỬA — đo thật')}
<p>Cái trigger giai đoạn 2 in ở trên qua được phép thử lệnh chèn, rồi hỏng ngay ở phép thử hiển nhiên tiếp theo. Khi nó đang được cài, mã cũ đổi địa chỉ của một người dùng:</p>
<div class="out">── trigger CU (chi lap o NULL): ma CU sua email cua nd1 ──
email=doi@x.com  dia_chi_email=nd1@x.com</div>
<p>Với một lệnh <code>UPDATE</code>, <code>NEW</code> khởi đầu là bản chép của dòng đang có, nên <code>NEW.dia_chi_email</code> là địa chỉ <em>CŨ</em> — không phải <code>NULL</code> — và trigger chẳng làm gì. Mã mới cứ đọc địa chỉ cũ. Không lỗi, không một dòng log nào: hai cột chỉ đơn giản là thôi khớp nhau, rồi tới giai đoạn 4 thì chính cái cột mang giá trị ĐÚNG bị xoá. Cách sửa: so <code>NEW</code> với <code>OLD</code> để biết bên nào thật sự vừa đổi:</p>
<pre><code class="language-sql">create or replace function sync_row() returns trigger as \$\$
begin
  if TG_OP = 'INSERT' then
    NEW.dia_chi_email := coalesce(NEW.dia_chi_email, NEW.email);
    NEW.email         := coalesce(NEW.email, NEW.dia_chi_email);
  elsif NEW.email is distinct from OLD.email then
    NEW.dia_chi_email := NEW.email;           -- ma CU vua sua
  elsif NEW.dia_chi_email is distinct from OLD.dia_chi_email then
    NEW.email := NEW.dia_chi_email;           -- ma MOI vua sua
  end if;
  return NEW;
end \$\$ language plpgsql;</code></pre>
<div class="out">── trigger SUA (so voi OLD): ma CU sua, roi ma MOI sua ──
email=lan2@x.com  dia_chi_email=lan2@x.com
email=lan3@x.com  dia_chi_email=lan3@x.com</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>TG_OP</code></span><span class="v">Biến PostgreSQL đặt sẵn trong mọi trigger: <code>'INSERT'</code>, <code>'UPDATE'</code> hoặc <code>'DELETE'</code>. Hai trường hợp đầu cần hai logic khác nhau.</span></div>
  <div class="kv"><span class="k"><code>OLD</code> / <code>NEW</code></span><span class="v">Dòng TRƯỚC và SAU câu lệnh. Lệnh chèn thì không có <code>OLD</code> — vì thế mới có nhánh <code>TG_OP</code>.</span></div>
  <div class="kv"><span class="k"><code>IS DISTINCT FROM</code></span><span class="v">Phép "khác nhau" coi <code>NULL</code> là một giá trị. <code>&lt;&gt;</code> thường trả về <code>NULL</code> (không phải true) khi một bên rỗng, nên một thay đổi từ rỗng sang có giá trị sẽ bị bỏ sót.</span></div>
  <div class="kv"><span class="k">Một câu lệnh đặt CẢ HAI cột</span><span class="v">Nhánh <code>email</code> thắng. Trong khoảng chồng lấn thì ổn, vì không phiên bản mã nào ghi cả hai cùng lúc — nhưng đó là kiểu giả định đáng ghi vào chú thích của migration.</span></div>
</div>
<p>Và phép kiểm làm cho giai đoạn 4 an toàn — nó phải trả về 0 trước khi bạn xoá bất cứ thứ gì:</p>
<pre><code class="language-sql">select count(*) from nguoi_dung where email is distinct from dia_chi_email;</code></pre>

<h3>Tự chạy bốn giai đoạn</h3>
${slide('dv-05', 10, 'Đo thật: mã cũ ghi, mã mới đọc được ngay — cả hai chiều')}
<p>Phép đo ở đầu bài được chạy lại ngày 29/09/2026 trên PostgreSQL 16.14 của phòng thí nghiệm, lần này ghi thêm theo chiều <em>NGƯỢC LẠI</em>: mã mới chỉ chèn qua <code>dia_chi_email</code>, và mã cũ đọc giá trị đó qua <code>email</code>.</p>
<div class="out">── GD2: THEM cot moi + trigger (chua doi ma) ──
    ma CU : nd1|nd1@x.com
    ma MOI: nd1|nd1@x.com
    ma CU ghi 'nd_cu' → ma MOI doc: nd_cu@x.com
    ma MOI ghi 'nd_moi' → ma CU doc: nd_moi@x.com</div>
<ul>
<li><strong>Giai đoạn 2 là MỘT lần deploy chỉ đổi lược đồ.</strong> Đẩy lên, nhìn log lỗi, rồi để yên một thời gian. Có gì sai thì xoá cột mới và trigger là quay về đúng giai đoạn 1.</li>
<li><strong>Giai đoạn 3 là MỘT lần deploy chỉ đổi mã.</strong> Lùi nó lại là đặt mã cũ trước một lược đồ mà nó VẪN hiểu — đúng cái tính chất cả chương đang tìm.</li>
<li><strong>Giai đoạn 4 xoá trigger, rồi hàm, rồi cột cũ</strong> — đúng thứ tự đó, vì trigger tham chiếu cả hai cột. Chạy phép đếm "is distinct from" TRƯỚC.</li>
</ul>

<h3>Với Prisma: cú đổi tên nó sinh ra là DROP + ADD</h3>
<p>Đo trên CSDL thí nghiệm: đổi tên một trường trong <code>schema.prisma</code> bằng cách đổi <code>@map</code> từ <code>thu</code> thành <code>ghi_chu</code>, rồi hỏi Prisma câu SQL:</p>
<pre><code class="language-bash">npx prisma migrate diff --from-schema-datasource prisma/schema.prisma \\
  --to-schema-datamodel prisma/schema.prisma --script</code></pre>
<div class="out">-- AlterTable
ALTER TABLE "post_music" DROP COLUMN "thu",
ADD COLUMN     "ghi_chu" TEXT;</div>
<div class="pitfall co-tieu-de"><strong>Bẫy — migration sinh tự động cho một cú đổi tên XOÁ dữ liệu.</strong> Công cụ so khác biệt thấy một cột biến mất và một cột xuất hiện; nó không thể biết bạn muốn nói "cùng cột đó, tên mới". Deploy tệp đó còn tệ hơn sự cố ở Bài 5.1: nội dung của cột mất hẳn, và deploy lại mã cũ không mang nó về. Với Prisma, mở-rộng–thu-hẹp nghĩa là <em>TỰ VIẾT giai đoạn 2 và giai đoạn 4</em>: giai đoạn 2 là lược đồ có <strong>CẢ HAI</strong> trường cộng một trigger viết tay trong SQL của migration; giai đoạn 4 là một migration về sau xoá trường cũ. Luôn đọc <code>migration.sql</code> được sinh ra trước khi commit, và coi mọi <code>DROP COLUMN</code> trong đó là một CÂU HỎI, không phải một chi tiết.</div>

<h3>Khi nào dùng cách nào</h3>
<table>
<tr><th>Tình huống</th><th>Chọn</th><th>Vì sao</th></tr>
<tr><td>Dự án một mình hoặc demo trên lớp, 3 giờ sáng chẳng ai dùng</td><td>Cửa sổ bảo trì</td><td>Một lần deploy, hai phút gián đoạn, không có trigger để viết hay để quên.</td></tr>
<tr><td>Có người dùng thật, tráo xanh-lam, lùi bản phải chạy được</td><td>Mở rộng–thu hẹp</td><td>Cách duy nhất không có khoảnh khắc nào một phiên bản đang chạy bị vỡ.</td></tr>
<tr><td>Chỉ <em>THÊM</em> (cột cho NULL, bảng mới)</td><td>Không cần gì — cứ đẩy</td><td>Vốn đã tương thích ngược; một lần deploy.</td></tr>
<tr><td>Đổi kiểu một cột trên bảng lớn</td><td>Mở rộng–thu hẹp với một cột mới</td><td><code>ALTER TYPE</code> ghi lại cả bảng dưới khoá độc quyền (Bài 5.3 đo được 6,7 s trên 5 triệu dòng).</td></tr>
<tr><td>Dự án nhóm, nhiều người cùng deploy</td><td>Mở rộng–thu hẹp, và ghi giai đoạn 4 vào danh sách việc NGAY BÂY GIỜ</td><td>Người còn nhớ giai đoạn 4 sẽ không phải người đang trực khi tới hạn.</td></tr>
</table>

<h3>Cùng hình dạng đó, cho những thay đổi khác</h3>
${slide('dv-05', 11, 'Cùng khuôn cho NOT NULL, đổi kiểu, tách cột — và khi nào không cần')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Biến một cột thành NOT NULL</span><span class="lz-lnote">Mở rộng: thêm một <code>DEFAULT</code> để lệnh chèn của mã cũ có giá trị. Lấp đầy các ô null. Deploy mã luôn tự cấp giá trị. Thu hẹp: thêm ràng buộc <code>NOT NULL</code>. Trong Postgres, hãy thêm nó dạng <code>NOT VALID</code> trước rồi mới xác thực riêng — Bài 5.3.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tách một cột thành hai</span><span class="lz-lnote">Thêm cả hai cột mới, lấp từ cột cũ, trigger giữ cả BA đồng bộ, deploy mã đọc cặp mới, rồi bỏ cột cũ. Ba cái tên cùng sống một lúc, trong chốc lát.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đổi kiểu dữ liệu của một cột</span><span class="lz-lnote">Thêm một cột MỚI mang kiểu mới chứ đừng sửa tại chỗ — một lệnh <code>ALTER TYPE</code> ghi lại cả bảng dưới một cái khoá và không đảo ngược lại rẻ được. Vẫn bốn giai đoạn đó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chuyển một cột sang bảng khác</span><span class="lz-lnote">Vẫn khuôn mẫu đó, chỉ thay việc đọc cột bằng một phép nối bảng, và trigger thì ghi xuyên bảng. Dài hơn, và không khác gì về hình dạng.</span></div>
</div>

<h3>Nó tốn gì</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bốn lần deploy thay vì một</span><span class="lz-d">Trải ra nhiều ngày, vì giai đoạn 4 phải CHỜ tới khi không còn bản phát hành cũ nào có thể bị lùi về. Đây mới là cái giá thật, và nó là lý do người ta bỏ qua nó với những thay đổi "nhỏ" rồi lãnh trọn cái gián đoạn.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Một khoảng thời gian lược đồ trông LUỘM THUỘM</span><span class="lz-d">Hai cột giữ cùng một thứ, cộng một cái trigger. Với bất cứ ai đọc lược đồ thì nó TRÔNG như một sai sót, nên hãy ghi lại vì sao nó ở đó và khi nào giai đoạn 4 xảy ra — một chú thích trên cột là đủ: <code>comment on column … is 'tam thoi, bo o GD4 sau 2026-09-01'</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Giai đoạn 4 bị QUÊN</span><span class="lz-d">Kiểu hỏng phổ biến. Hệ thống chạy ngon sau giai đoạn 3, nên chẳng ai có động lực làm nốt. Hai năm sau cái bảng có sáu cột bỏ hoang và ba cái trigger, và chẳng ai biết cái nào còn sống. Hãy lên lịch cho giai đoạn 4 NGAY LÚC bạn viết giai đoạn 2.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Đổi lại: MỌI giai đoạn đều tự nó đảo ngược được</span><span class="lz-d">Mà đó chính là mục đích. Không ở bước nào việc lùi mã lại để cơ sở dữ liệu ở một hình dạng mà phiên bản trước đọc không nổi — đúng cái tính chất mà Bài 5.1 đã đặt thành luật.</span></div>
</div>
<div class="note-ct">Với một dự án chỉ có một lập trình viên và không có lưu lượng lúc 3 giờ sáng thì một cửa sổ bảo trì là phương án hợp lệ: dừng ứng dụng, migrate, khởi động lại. Hai phút gián đoạn, một lần deploy, không cần trigger. Lý do vẫn nên biết mở-rộng–thu-hẹp là cái câu "giờ chúng ta chẳng có lưu lượng nào" sẽ thôi đúng vào một lúc nào đó, mà thường là chẳng ai ra quyết định gì về chuyện ấy cả — và khuôn mẫu này học TRƯỚC khi cần thì dễ hơn hẳn học ĐANG LÚC cần.</div>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> app đặt lịch của nhóm bạn phải đổi tên <code>email</code> thành <code>dia_chi_email</code> trong khi trang demo vẫn chạy, và lùi bản phải còn dùng được ở MỌI bước. Dùng phòng thí nghiệm của Bài 5.1 (<code>pg-thu</code> + <code>vps-thu5</code>).</p>
<ol>
<li>Tạo <code>nguoi_dung(id serial primary key, ten text, email text)</code> có một dòng. Áp giai đoạn 2 bằng cái trigger <strong>ngây thơ</strong> in gần đầu bài.</li>
<li>Đóng vai "mã cũ", chạy <code>update nguoi_dung set email = 'doi@x.com' where id = 1</code>, rồi đọc cả hai cột. Ghi lại chỗ lệch.</li>
<li>Thay hàm bằng bản đã sửa, chạy lại bước lấp (<code>update nguoi_dung set dia_chi_email = email</code>), rồi sửa một lần qua MỖI cột và đọc lại cả hai.</li>
<li>Chạy phép kiểm giai đoạn 4 <code>select count(*) … where email is distinct from dia_chi_email</code>, rồi làm giai đoạn 4 đúng thứ tự: <code>drop trigger</code>, <code>drop function</code>, <code>alter table … drop column email</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bước 2 in <code>email=doi@x.com  dia_chi_email=nd1@x.com</code>, bước 3 cho hai cột bằng nhau sau MỖI lần sửa, phép kiểm trả <code>0</code>, và sau giai đoạn 4 chỉ còn <code>select … dia_chi_email</code> chạy được.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Expand–contract (mở rộng–thu hẹp)</span><span class="v">Thêm hình dạng mới, chuyển mã sang nó, rồi bỏ hình dạng cũ — qua những lần deploy riêng.</span></div>
  <div class="kv"><span class="k">Backfill (lấp dữ liệu)</span><span class="v">Chép dữ liệu đang có vào cột mới sau khi cột đó đã tồn tại.</span></div>
  <div class="kv"><span class="k">Trigger (bộ kích hoạt)</span><span class="v">Một hàm trong CSDL tự chạy khi mỗi dòng được chèn/sửa/xoá.</span></div>
  <div class="kv"><span class="k"><code>BEFORE … FOR EACH ROW</code> (trước, từng dòng)</span><span class="v">Trigger còn sửa được chính cái dòng sắp được ghi.</span></div>
  <div class="kv"><span class="k"><code>OLD</code> / <code>NEW</code> (dòng cũ / dòng mới)</span><span class="v">Dòng trước và sau câu lệnh hiện tại, nhìn từ bên trong trigger.</span></div>
  <div class="kv"><span class="k"><code>IS DISTINCT FROM</code> (khác nhau, tính cả NULL)</span><span class="v">Phép "khác nhau" an toàn với <code>NULL</code>.</span></div>
  <div class="kv"><span class="k">Contract phase (giai đoạn thu hẹp)</span><span class="v">Bước phá huỷ duy nhất; chỉ chạy khi không đích lùi bản nào còn cần hình dạng cũ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đừng bao giờ đổi tên trong một bước: thêm tên mới, giữ hai bên đồng bộ, chuyển mã, rồi mới xoá tên cũ — bốn lần deploy, không lần nào làm vỡ phiên bản đang chạy.</li>
<li>Giai đoạn 2 chỉ đổi lược đồ, giai đoạn 3 chỉ đổi mã, nên lùi bản ở bất kỳ lúc nào cũng gặp một lược đồ nó hiểu.</li>
<li>Trigger đồng bộ chỉ lấp <code>NULL</code> bỏ sót lệnh sửa; hãy so <code>NEW</code> với <code>OLD</code> và chứng minh hai cột khớp bằng phép đếm <code>IS DISTINCT FROM</code> trước giai đoạn 4.</li>
<li>Prisma biến một cú đổi tên thành <code>DROP COLUMN</code> + <code>ADD COLUMN</code>; với Prisma, giai đoạn 2 và 4 là những migration bạn tự viết và tự đọc.</li>
<li>Cửa sổ bảo trì là lựa chọn hợp lệ cho dự án một người; mở rộng–thu hẹp là cái giá của việc không gián đoạn.</li>
<li>Lên lịch giai đoạn 4 ngay lúc viết giai đoạn 2, không thì nó sẽ không bao giờ xảy ra.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — ParallelChange</span><span class="lc-sub">martinfowler.com/bliki/ParallelChange.html — mở rộng, chuyển, thu hẹp, phát biểu trong hai trang và áp dụng được xa hơn hẳn phạm vi cơ sở dữ liệu.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — CREATE TRIGGER</span><span class="lc-sub">postgresql.org/docs/current/sql-createtrigger.html — dạng <code>BEFORE INSERT OR UPDATE ... FOR EACH ROW</code>, đúng dạng mà trigger đồng bộ cần.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — COMMENT ON</span><span class="lc-sub">postgresql.org/docs/current/sql-comment.html — gắn cái ghi chú "tạm thời, bỏ sau ngày…" vào chính lược đồ chứ không vào một cái ticket.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — trigger, và BEFORE cho bạn thứ mà AFTER không có</span><span class="lc-sub">/courses/postgresql/learn${REF} — vì sao trigger đồng bộ BẮT BUỘC phải là BEFORE mới sửa được cái dòng đang được ghi.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.3 ─────────────────────────── */
    {
      title: '5.3 — Locks: the migration that takes the table with it|||5.3 — Khoá: cái migration kéo cả cái bảng đi theo',
      slug: 'deploy-5-3-khoa-va-thoi-gian',
      type: 'LESSON',
      description: 'Ba lệnh ADD COLUMN trên cùng một bảng 400.000 dòng: 53 ms, 37 ms, và 2.606 ms. Bài này đo vì sao cái thứ ba chậm hơn 49 lần, rồi đo xem trong lúc nó chạy thì các lệnh ghi khác ra sao.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Locks: the migration that takes the table with it</h2>
<p class="lead">A migration that is <em>safe</em> in the Lesson 5.1 sense can still take a production database down, for a completely different reason: it holds a lock, and everything else queues behind it. The difference between a harmless migration and an outage is often one word in the statement.</p>

<h3>Three <code>ADD COLUMN</code> statements, one table</h3>
${slide('dv-05', 12, 'ADD COLUMN trên 1 và 5 triệu dòng: hằng số tức thì, hàm ghi lại bảng')}
<p>A table with 400,000 rows, 101 MB on disk:</p>
<div class="out">════ 1) ALTER TABLE ... ADD COLUMN (khong mac dinh) ════
    53 ms
════ 2) ADD COLUMN ... DEFAULT (hang so) — Postgres 11+ ════
    37 ms
════ 3) ADD COLUMN ... DEFAULT (HAM BIEN THIEN) ════
    2606 ms</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The first two are metadata only</span><span class="v">53 ms and 37 ms on a 101 MB table — the size is irrelevant because no row is touched. Since PostgreSQL 11, a constant default is recorded in the catalogue and applied on read.</span></div>
  <div class="kv"><span class="k">The third rewrites every row</span><span class="v">2,606 ms — forty-nine times slower. <code>gen_random_uuid()</code> is volatile, so every row needs its own value, so every row is written.</span></div>
  <div class="kv"><span class="k">The statements look almost identical</span><span class="v"><code>DEFAULT 'mac-dinh'</code> against <code>DEFAULT gen_random_uuid()</code>. One is instant on any table; the other scales with your data.</span></div>
  <div class="kv"><span class="k">And 400,000 rows is small</span><span class="v">Multiply by twenty-five for ten million rows: about a minute of the table being unavailable. That is the shape of the incident.</span></div>
</div>
<div class="callout warn"><strong>The Postgres 11 change is why old advice is wrong.</strong> Guidance written before 2018 says never to add a column with a default because it rewrites the table — true then, false now for a <em>constant</em> default. Still true for a volatile one. Check your version and check whether the default is constant, rather than following a rule whose reason has expired.</div>

<h3>The same statements at one and five million rows</h3>
<p>Re-measured on 29/09/2026 on PostgreSQL 16.14 (lab container, 1 GB of memory, Mac M1 disk): two tables, <code>nd1m</code> with 1,000,000 rows (87 MB) and <code>nd5m</code> with 5,000,000 rows (464 MB), filled with <code>generate_series</code>, each statement timed with <code>\\timing on</code>:</p>
<table>
<tr><th>Statement</th><th>1 million rows</th><th>5 million rows</th></tr>
<tr><td><code>ADD COLUMN ghi_chu text</code></td><td>4.3 ms</td><td>0.7 ms</td></tr>
<tr><td><code>ADD COLUMN trang_thai text NOT NULL DEFAULT 'moi'</code></td><td>1.8 ms</td><td>0.7 ms</td></tr>
<tr><td><code>ADD COLUMN ma uuid DEFAULT gen_random_uuid()</code></td><td>1,674 ms</td><td>8,106 ms</td></tr>
<tr><td><code>ALTER COLUMN ten TYPE varchar(80)</code></td><td>927 ms</td><td>6,726 ms</td></tr>
<tr><td><code>ALTER COLUMN email SET NOT NULL</code></td><td>106 ms</td><td>853 ms</td></tr>
</table>
<ul>
<li><strong>The first two do not depend on size at all</strong> — the five-million-row table was even faster, which is just noise at sub-millisecond scale. No row is read or written.</li>
<li><strong>The volatile default scales with the data:</strong> five times the rows, about five times the time. The table grew from 464 MB to 582 MB over the whole sequence, because every row was written again.</li>
<li><strong>Type changes can rewrite too.</strong> <code>text</code> → <code>varchar(80)</code> must check every value against the new limit. Some type changes are metadata-only (for example widening <code>varchar(50)</code> to <code>varchar(100)</code>); others are not, and the only reliable way to know is to time it on a copy.</li>
<li><strong><code>SET NOT NULL</code> reads the whole table</strong> to prove there are no nulls — under an exclusive lock. Lesson section "Constraints in two steps" below makes that scan disappear.</li>
</ul>

<h3>What "holds a lock" means for your users</h3>
${slide('dv-05', 13, 'Trong 9,4 giây ALTER chạy, cả đọc lẫn ghi đều đứng')}
<p>The same 2.6-second migration, with writes running against the table throughout:</p>
<div class="out">════ A) khong co migration nao chay — moc doi chieu ════
    ghi OK: 60   bi CHAN/het gio:  0   (trong 2179 ms)

════ B) trong luc ALTER TABLE ADD COLUMN DEFAULT gen_random_uuid() ════
    ghi OK: 55   bi CHAN/het gio:  5   (trong 4742 ms)</div>
<p>Five writes hit their half-second timeout and failed. The batch that took 2,179 ms with no migration took 4,742 ms during one — more than twice as long, because writes were queuing behind the lock rather than executing.</p>
<div class="pitfall"><strong>Trap — <code>ALTER TABLE</code> takes an <code>ACCESS EXCLUSIVE</code> lock, which conflicts with <em>everything</em>, including <code>SELECT</code>.</strong> Not just writes — reads too. And the lock is taken at the <em>start</em> of the statement and held until it commits, so a two-second rewrite is two seconds during which the table does not exist as far as your application is concerned. Worse: the <code>ALTER</code> must first <em>wait</em> for existing transactions on the table to finish, and while it waits, every new query queues behind it. One long-running <code>SELECT</code> can turn a fast migration into a total stall — the migration waits for the query, and everything else waits for the migration.</div>
<pre><code><span class="tok-comment">-- chan viec cho khoa VO HAN: tha hong nhanh con hon lam nghen ca bang</span>
SET lock_timeout = '3s';
ALTER TABLE lon ADD COLUMN moi text;

<span class="tok-comment">-- va gioi han thoi gian chay cua chinh lenh do</span>
SET statement_timeout = '30s';</code></pre>
<div class="callout ok"><strong><code>lock_timeout</code> is the single most valuable line in a migration file.</strong> Without it, a migration that cannot get its lock waits indefinitely <em>while blocking every query behind it</em> — the classic "the site went down and the migration had not even started" incident. With it, the migration fails after three seconds, nothing is blocked for longer than that, and you retry when the long transaction has finished.</div>
<h3>Measured: <code>lock_timeout</code> and <code>statement_timeout</code></h3>
${slide('dv-05', 15, 'lock_timeout: thua sau 2 s thay vì làm nghẽn cả bảng')}
<p>The same three sessions, with B's <code>lock_timeout</code> set to <code>2s</code>:</p>
<div class="out">[B migration] bat dau 1015 ms, xong 3048 ms: ERROR:  canceling statement due to lock timeout
[C request ] bat dau 2025 ms, xong 3048 ms: nd42</div>
<p>B gave up after two seconds and C finished in the same millisecond — the web request waited one second instead of ten. The migration failed, and that is the correct outcome: nothing changed, the deploy script stops before swapping (Lesson 5.5), and you run it again once the report has finished. <code>statement_timeout</code> is the other half — it limits how long a statement may <em>run</em> once it has its lock:</p>
<div class="out">── statement_timeout: gioi han thoi gian CHAY ──
ERROR:  canceling statement due to statement timeout
Time: 3028.498 ms (00:03.028)
 cot_ma4_ton_tai
-----------------
               0</div>
<table>
<tr><th>Setting</th><th>Limits</th><th>Typical value in a migration</th></tr>
<tr><td><code>lock_timeout</code></td><td>Time spent <em>waiting</em> to acquire a lock</td><td><code>'2s'</code>–<code>'5s'</code> — less than your users will tolerate a frozen page</td></tr>
<tr><td><code>statement_timeout</code></td><td>Total time one statement may run</td><td>Generous (<code>'60s'</code>+) for migrations; you want it to finish, just not forever</td></tr>
<tr><td><code>idle_in_transaction_session_timeout</code></td><td>How long a session may sit idle inside an open transaction</td><td>Set on the application's database role, not in the migration — it removes the forgotten transactions that block migrations in the first place</td></tr>
</table>
<p>All three are ordinary settings: <code>SET</code> at the top of the migration file applies to that session only; <code>ALTER ROLE … SET</code> makes it the default for a role; and for a one-off shell command, <code>PGOPTIONS="-c lock_timeout=2s"</code> sets it for every <code>psql</code> started from that shell (measured: <code>show lock_timeout</code> prints <code>2s</code>). Every cancelled statement rolled back cleanly — the <code>ma4</code> column above does not exist.</p>


<h3>The same test at five million rows: reads stop too</h3>
<p>The probe used for the numbers above, re-run against <code>nd5m</code>: 56 requests, one every 250 ms, each a fresh <code>psql</code> connection from the lab VPS; the migration starts at second 2.</p>
<div class="out">══ A) khong co migration — moc doi chieu ══
  request: 56 cai · cham hon 500 ms: 0 · loi: 0 · trung binh 32 ms · lau nhat 68 ms
══ B) ADD COLUMN ... DEFAULT gen_random_uuid() tren nd5m ══
  migration: bat dau 2002 ms, xong 11450 ms (9448 ms) OK
  request: 56 cai · cham hon 500 ms: 35 · loi: 0 · trung binh 3180 ms · lau nhat 9374 ms
══ C) doc (SELECT) trong luc ADD COLUMN ... gen_random_uuid() ══
  migration: bat dau 2020 ms, xong 11711 ms (9691 ms) OK
  request: 56 cai · cham hon 500 ms: 36 · loi: 0 · trung binh 3327 ms · lau nhat 9607 ms</div>
<p>Note <code>loi: 0</code>: nothing failed. The requests simply waited — up to 9.6 seconds for a one-row <code>SELECT</code> by primary key. From a user's browser that is a frozen page, and behind nginx, whose <code>proxy_read_timeout</code> defaults to 60 seconds, a table a few times bigger turns the wait into a <code>504</code>. The earlier half-second probe showed the effect as failures because it had a timeout; this one shows what happens without one.</p>

<h3>The lock queue, read from <code>pg_stat_activity</code></h3>
${slide('dv-05', 14, 'Hàng đợi khoá: một SELECT dài làm cả bảng đứng')}
<p>The pitfall above says a long transaction can turn an instant migration into a total stall. Here it is, measured. Three sessions against <code>nd1m</code>: A is a "report" that opens a transaction, reads the table and keeps the transaction open for 12 seconds; B is the migration, a metadata-only <code>ADD COLUMN</code>; C is an ordinary web request that arrives one second after B.</p>
<pre><code class="language-bash"># queue.sh (rút gọn) — chạy trên VPS thí nghiệm
psql -qAt -c "begin; select count(*) from nd1m where id &lt; 10; select pg_sleep(12); commit;" &amp;   # A
sleep 1; psql -qAt -c "set lock_timeout='0'; alter table nd1m add column thu_1 text;" &amp;         # B
sleep 1; psql -qAt -c "select ten from nd1m where id = 42;" &amp;                                    # C
sleep 1; psql -c "select pid, state, wait_event_type as cho, wait_event,
                  pg_blocking_pids(pid) as bi_chan_boi, left(query,44) as query
                  from pg_stat_activity where datname='postgres' and pid &lt;&gt; pg_backend_pid()
                  and backend_type='client backend' order by backend_start;"
psql -c "select l.pid, l.mode, l.granted from pg_locks l where l.relation='nd1m'::regclass order by l.granted desc, l.pid;"</code></pre>
<div class="out">── pg_stat_activity luc 3026 ms ──
 pid | state  |   cho   | wait_event | bi_chan_boi |                    query
-----+--------+---------+------------+-------------+----------------------------------------------
  84 | active | Timeout | PgSleep    | {}          | begin; select count(*) from nd1m where id &lt;
  85 | active | Lock    | relation   | {84}        | set lock_timeout='0'; alter table nd1m add c
  86 | active | Lock    | relation   | {85}        | select ten from nd1m where id = 42;

── pg_locks tren nd1m ──
 pid |        mode         | granted
-----+---------------------+---------
  84 | AccessShareLock     | t
  85 | AccessExclusiveLock | f
  86 | AccessShareLock     | f

[B migration] bat dau 1008 ms, xong 12070 ms: OK
[C request ] bat dau 2020 ms, xong 12071 ms: nd42</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Read <code>bi_chan_boi</code> (<code>pg_blocking_pids</code>) as arrows</span><span class="v">86 is blocked by 85, and 85 is blocked by 84. Follow the chain to the pid with an empty list: that is the root, and it is not the migration.</span></div>
  <div class="kv"><span class="k">C conflicts with nothing that is <em>granted</em></span><span class="v">C wants <code>AccessShareLock</code>, exactly what A already holds — they are compatible. C waits because it is queued <em>behind</em> B's request for <code>AccessExclusiveLock</code>. PostgreSQL grants locks roughly in arrival order, so a waiting exclusive lock blocks everyone who arrives after it.</span></div>
  <div class="kv"><span class="k"><code>granted = f</code></span><span class="v">In <code>pg_locks</code>, a lock that has been requested and not yet received. Two <code>f</code> rows on one table during a deploy means the site is, for that table, down.</span></div>
  <div class="kv"><span class="k">The fix is on B, not on C</span><span class="v">With <code>lock_timeout</code>, B gives up and C runs at once — next section. The alternative, killing A, is sometimes right too: <code>select pg_cancel_backend(84);</code> cancels its query, <code>pg_terminate_backend(84)</code> closes its connection. Find out what A is before you do either.</span></div>
</div>

<h3>The operations worth knowing the lock level of</h3>
${slide('dv-05', 18, 'Bảng mức khoá: thao tác nào chặn đọc, chặn ghi')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Metadata only — instant at any size</span><span class="lz-lnote"><code>ADD COLUMN</code> without a default, or with a constant default (PG 11+). <code>DROP COLUMN</code> — the data stays on disk but the column is gone logically. Renames. All still take <code>ACCESS EXCLUSIVE</code>, so they still need <code>lock_timeout</code> — they just hold it briefly.</span></div>
  <div class="lz-layer"><span class="lz-lname">Rewrites the table — scales with rows</span><span class="lz-lnote"><code>ADD COLUMN</code> with a volatile default (measured: 2,606 ms), most <code>ALTER COLUMN TYPE</code>, <code>SET NOT NULL</code> on a large table. Assume minutes, not seconds, on real data.</span></div>
  <div class="lz-layer"><span class="lz-lname">Blocks writes but not reads</span><span class="lz-lnote"><code>CREATE INDEX</code> takes a <code>SHARE</code> lock: <code>SELECT</code> continues, <code>INSERT</code>/<code>UPDATE</code>/<code>DELETE</code> wait. <code>CREATE INDEX CONCURRENTLY</code> avoids that, at the cost of two table scans and an inability to run inside a transaction.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cheap in two steps</span><span class="lz-lnote">Adding a constraint: <code>ADD CONSTRAINT ... NOT VALID</code> is instant and applies to new rows, then <code>VALIDATE CONSTRAINT</code> scans existing rows under a weaker lock. Two statements, no outage — instead of one statement that locks the table for the length of a full scan.</span></div>
</div>
<div class="note-ct">An honest note about one measurement in this lesson: an attempt to show <code>CREATE INDEX</code> blocking writes found nothing — 25 of 25 writes succeeded under both the plain and the <code>CONCURRENTLY</code> form. The index built in about 600 ms, faster than the probe could sample meaningfully, so the test proved only that the operation was short. The blocking measurement above uses the 2.6-second <code>ALTER</code> instead, where the effect is large enough to see. A benchmark that finds nothing because the operation was too fast is not evidence that nothing happens.</div>

<h3>CREATE INDEX at five million rows — the measurement that found nothing, repeated</h3>
${slide('dv-05', 16, 'CREATE INDEX chặn ghi, CONCURRENTLY thì không — đo ở 5 triệu dòng')}
<p>The honest note above reported that a 600 ms index build was too short to show anything. At five million rows the build takes long enough, and the same probe shows the difference clearly:</p>
<div class="out">══ D) CREATE INDEX (thuong) — request GHI ══
  migration: bat dau 2007 ms, xong 7625 ms (5618 ms) OK
  request: 56 cai · cham hon 500 ms: 20 · loi: 0 · trung binh 1165 ms · lau nhat 5596 ms
══ E) CREATE INDEX (thuong) — request DOC ══
  migration: bat dau 2005 ms, xong 11789 ms (9784 ms) OK
  request: 56 cai · cham hon 500 ms: 2 · loi: 0 · trung binh 116 ms · lau nhat 819 ms
══ F) CREATE INDEX CONCURRENTLY — request GHI ══
  migration: bat dau 2005 ms, xong 9305 ms (7300 ms) OK
  request: 56 cai · cham hon 500 ms: 0 · loi: 0 · trung binh 49 ms · lau nhat 204 ms</div>
<div class="out">  create index idx_m1 on nd5m(tao)        ShareLock
  create index concurrently idx_m2 on nd5mShareUpdateExclusiveLock
  alter table nd5m add column ma9 uuid defAccessExclusiveLock</div>
<ul>
<li><strong>Plain <code>CREATE INDEX</code> takes <code>SHARE</code>:</strong> writes queued for the whole build (20 of 56 over half a second, the longest 5.6 s); reads carried on. The two slow reads in E are CPU and disk contention on a laptop running both the build and the probe, not lock waits — the longest was 0.8 s against a 9.8 s build.</li>
<li><strong><code>CONCURRENTLY</code> takes <code>SHARE UPDATE EXCLUSIVE</code>:</strong> no write waited more than 204 ms. The price: the build took 30% longer (it scans the table twice and waits for older transactions), and it cannot run inside a transaction — Lesson 5.4 shows what that means for a migration file.</li>
</ul>

<h3>Constraints in two steps: <code>NOT VALID</code>, then <code>VALIDATE</code></h3>
${slide('dv-05', 17, 'Ràng buộc hai bước: NOT VALID rồi VALIDATE, SET NOT NULL bỏ qua quét')}
<p>Adding a constraint normally scans every row under <code>ACCESS EXCLUSIVE</code>. Splitting it moves that scan under a lock that lets reads and writes continue. Measured on <code>nd5m</code>:</p>
<div class="out">-- A) SET NOT NULL thang (quet 5 trieu dong duoi ACCESS EXCLUSIVE)
Time: 1745.241 ms (00:01.745)
-- B1) CHECK ... NOT VALID (tuc thi)
Time: 10.699 ms
-- B2) VALIDATE (quet, nhung chi SHARE UPDATE EXCLUSIVE)
Time: 855.735 ms
-- B3) SET NOT NULL — da co CHECK hop le nen BO QUA buoc quet
Time: 1.206 ms</div>
<pre><code class="language-sql">alter table nd5m add constraint ck_ten_nn check (ten is not null) not valid;  -- dong MOI bi kiem ngay
alter table nd5m validate constraint ck_ten_nn;   -- quet dong CU, khong chan ghi
alter table nd5m alter column ten set not null;   -- thay CHECK hop le ⇒ bo qua quet
alter table nd5m drop constraint ck_ten_nn;       -- CHECK da het viec</code></pre>
<p>The PostgreSQL documentation states both halves: validation "acquires only a <code>SHARE UPDATE EXCLUSIVE</code> lock", and for <code>SET NOT NULL</code> "if a valid <code>CHECK</code> constraint exists … which proves no <code>NULL</code> can exist, then the table scan is skipped". The same pattern works for foreign keys. For <code>UNIQUE</code> there is no <code>NOT VALID</code>; build the index with <code>CREATE UNIQUE INDEX CONCURRENTLY</code> and then attach it with <code>ADD CONSTRAINT … UNIQUE USING INDEX</code>.</p>

<h3>The checklist before running a migration on production</h3>
<pre><code><span class="tok-comment">-- 1. co giao dich nao dang chay lau khong? (chung se CHAN migration)</span>
select pid, now()-xact_start as lau, left(query,60)
from pg_stat_activity
where xact_start is not null and now()-xact_start &gt; interval '30 seconds'
order by lau desc;

<span class="tok-comment">-- 2. bang to co nao? (quyet dinh giua "tuc thi" va "vai phut")</span>
select relname, n_live_tup, pg_size_pretty(pg_total_relation_size(relid))
from pg_stat_user_tables order by n_live_tup desc limit 5;

<span class="tok-comment">-- 3. trong luc migration chay: ai dang cho ai?</span>
select pid, wait_event_type, wait_event, left(query,50)
from pg_stat_activity where wait_event_type = 'Lock';</code></pre>
<div class="note-ct">Query 1 is the one to run <em>before</em> every migration. A transaction that has been open for twenty minutes — an idle-in-transaction connection from a crashed job, a report someone is running — will block your <code>ALTER TABLE</code>, and your <code>ALTER TABLE</code> will block the entire application. Finding it first turns a potential outage into a thirty-second wait for someone to close a laptop.</div>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate's migration adds <code>ma uuid default gen_random_uuid()</code> to the biggest table, and someone is running a long report during the deploy. Prove on the lab what each of those does to the site, and write the migration header that makes it safe.</p>
<ol>
<li>On the lab VPS, create <code>nd1m</code> with a million rows: <code>create table nd1m(id bigserial primary key, ten text, email text); insert into nd1m(ten,email) select 'nd'||g, 'nd'||g||'@x.com' from generate_series(1,1000000) g;</code> Time <code>add column c1 text</code> and <code>add column c2 uuid default gen_random_uuid()</code> with <code>\\timing on</code>.</li>
<li>In one terminal, open <code>psql</code> and run <code>begin; select count(*) from nd1m;</code> — leave it open. In a second, run <code>alter table nd1m add column c3 text;</code>. In a third, <code>select ten from nd1m where id = 42;</code>. Both hang.</li>
<li>From a fourth, run the <code>pg_stat_activity</code> query of this lesson and write the chain of <code>bi_chan_boi</code> pids. Then <code>commit;</code> in the first terminal and watch both finish.</li>
<li>Repeat step 2 with <code>set lock_timeout = '2s';</code> before the <code>ALTER</code>.</li>
</ol>
<p><strong>Done when:</strong> you have the two timings (a few ms vs well over a second), the blocking chain reads "request ← migration ← report", and with <code>lock_timeout</code> the migration prints <code>canceling statement due to lock timeout</code> while the request returns within about two seconds.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Lock mode</span><span class="v">The strength of a lock; PostgreSQL has eight table-level modes and a table of which conflict.</span></div>
  <div class="kv"><span class="k"><code>ACCESS EXCLUSIVE</code></span><span class="v">The strongest mode; conflicts with everything, including <code>SELECT</code>. Most <code>ALTER TABLE</code> forms take it.</span></div>
  <div class="kv"><span class="k">Table rewrite</span><span class="v">An operation that writes every row again; its duration grows with the table.</span></div>
  <div class="kv"><span class="k">Lock queue</span><span class="v">Waiting lock requests, granted roughly in order — a waiting exclusive lock blocks everything behind it.</span></div>
  <div class="kv"><span class="k"><code>lock_timeout</code></span><span class="v">Maximum time to wait for a lock before the statement is cancelled.</span></div>
  <div class="kv"><span class="k"><code>statement_timeout</code></span><span class="v">Maximum time a statement may run.</span></div>
  <div class="kv"><span class="k"><code>pg_stat_activity</code> / <code>pg_locks</code></span><span class="v">Views of every session and every lock; <code>pg_blocking_pids(pid)</code> says who blocks whom.</span></div>
  <div class="kv"><span class="k"><code>NOT VALID</code> / <code>VALIDATE</code></span><span class="v">Add a constraint for new rows now, check the old rows later under a weaker lock.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A constant default and a nullable column are instant at any size; a volatile default or a type change rewrites the table — 8.1 s and 6.7 s on five million rows.</li>
<li>While <code>ALTER TABLE</code> holds <code>ACCESS EXCLUSIVE</code>, reads wait as well as writes: a one-row <code>SELECT</code> waited 9.6 s, with no error to show for it.</li>
<li>Even an instant migration waits behind a long transaction, and everything that arrives after it waits behind the migration — read the chain in <code>pg_stat_activity</code> with <code>pg_blocking_pids</code>.</li>
<li>Start every production migration with <code>lock_timeout</code>: failing after two seconds is better than freezing the table.</li>
<li><code>CREATE INDEX</code> blocks writes; <code>CREATE INDEX CONCURRENTLY</code> does not, at the cost of a slower build and no transaction.</li>
<li>Split constraints: <code>NOT VALID</code> now, <code>VALIDATE</code> later — then <code>SET NOT NULL</code> skips its scan (1.2 ms instead of 1,745 ms).</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — Explicit Locking, the conflict matrix</span><span class="lc-sub">postgresql.org/docs/current/explicit-locking.html — the table showing which lock modes conflict, which is the reference for everything above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL 11 release notes — ADD COLUMN with a default</span><span class="lc-sub">postgresql.org/docs/11/release-11.html — the change that made half the old advice obsolete.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">strong_migrations — the list of unsafe operations</span><span class="lc-sub">github.com/ankane/strong_migrations — a Rails gem whose README is the best plain-language catalogue of dangerous migrations and their safe replacements, regardless of language.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — locks, MVCC and pg_stat_activity</span><span class="lc-sub">/courses/postgresql/learn${REF} — why a reader does not block a writer, and why <code>ALTER TABLE</code> is the exception that blocks both.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Khoá: cái migration kéo cả cái bảng đi theo</h2>
<p class="lead">Một migration <em>AN TOÀN</em> theo nghĩa của Bài 5.1 vẫn có thể làm sập một cơ sở dữ liệu production, vì một lý do hoàn toàn khác: nó GIỮ MỘT CÁI KHOÁ, và mọi thứ khác xếp hàng phía sau. Khác biệt giữa một migration vô hại và một sự cố thường chỉ là MỘT TỪ trong câu lệnh.</p>

<h3>Ba câu lệnh <code>ADD COLUMN</code>, một cái bảng</h3>
${slide('dv-05', 12, 'ADD COLUMN trên 1 và 5 triệu dòng: hằng số tức thì, hàm ghi lại bảng')}
<p>Một bảng 400.000 dòng, 101 MB trên đĩa:</p>
<div class="out">════ 1) ALTER TABLE ... ADD COLUMN (khong mac dinh) ════
    53 ms
════ 2) ADD COLUMN ... DEFAULT (hang so) — Postgres 11+ ════
    37 ms
════ 3) ADD COLUMN ... DEFAULT (HAM BIEN THIEN) ════
    2606 ms</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hai cái đầu chỉ đụng SIÊU DỮ LIỆU</span><span class="v">53 ms và 37 ms trên một bảng 101 MB — kích thước KHÔNG liên quan vì chẳng dòng nào bị đụng tới. Từ PostgreSQL 11, một giá trị mặc định HẰNG SỐ được ghi vào danh mục và áp dụng lúc ĐỌC.</span></div>
  <div class="kv"><span class="k">Cái thứ ba ghi lại MỌI dòng</span><span class="v">2.606 ms — chậm hơn bốn mươi chín lần. <code>gen_random_uuid()</code> là hàm biến thiên, nên mỗi dòng cần giá trị riêng, nên mỗi dòng đều bị ghi.</span></div>
  <div class="kv"><span class="k">Hai câu lệnh trông GẦN NHƯ giống hệt</span><span class="v"><code>DEFAULT 'mac-dinh'</code> so với <code>DEFAULT gen_random_uuid()</code>. Một cái tức thì trên mọi cỡ bảng; cái kia thì tăng theo dữ liệu của bạn.</span></div>
  <div class="kv"><span class="k">Và 400.000 dòng là NHỎ</span><span class="v">Nhân hai mươi lăm lần cho mười triệu dòng: khoảng một PHÚT mà cái bảng không dùng được. Đó chính là hình dạng của sự cố.</span></div>
</div>
<div class="callout warn"><strong>Cái thay đổi ở Postgres 11 là lý do lời khuyên cũ giờ SAI.</strong> Hướng dẫn viết trước 2018 nói đừng bao giờ thêm cột kèm giá trị mặc định vì nó ghi lại cả bảng — ĐÚNG hồi đó, SAI bây giờ với giá trị mặc định <em>HẰNG SỐ</em>. Vẫn đúng với hàm biến thiên. Hãy kiểm phiên bản của bạn và kiểm xem giá trị mặc định có phải hằng số không, thay vì đi theo một cái luật mà lý do của nó đã hết hạn.</div>

<h3>Cùng những câu lệnh đó trên một và năm triệu dòng</h3>
<p>Đo lại ngày 29/09/2026 trên PostgreSQL 16.14 (container thí nghiệm, 1 GB bộ nhớ, đĩa của Mac M1): hai bảng, <code>nd1m</code> có 1.000.000 dòng (87 MB) và <code>nd5m</code> có 5.000.000 dòng (464 MB), lấp bằng <code>generate_series</code>, mỗi câu lệnh bấm giờ bằng <code>\\timing on</code>:</p>
<table>
<tr><th>Câu lệnh</th><th>1 triệu dòng</th><th>5 triệu dòng</th></tr>
<tr><td><code>ADD COLUMN ghi_chu text</code></td><td>4,3 ms</td><td>0,7 ms</td></tr>
<tr><td><code>ADD COLUMN trang_thai text NOT NULL DEFAULT 'moi'</code></td><td>1,8 ms</td><td>0,7 ms</td></tr>
<tr><td><code>ADD COLUMN ma uuid DEFAULT gen_random_uuid()</code></td><td>1.674 ms</td><td>8.106 ms</td></tr>
<tr><td><code>ALTER COLUMN ten TYPE varchar(80)</code></td><td>927 ms</td><td>6.726 ms</td></tr>
<tr><td><code>ALTER COLUMN email SET NOT NULL</code></td><td>106 ms</td><td>853 ms</td></tr>
</table>
<ul>
<li><strong>Hai câu đầu chẳng phụ thuộc gì vào kích thước</strong> — bảng năm triệu dòng còn nhanh hơn, mà đó chỉ là nhiễu ở cỡ dưới một mili giây. Không dòng nào bị đọc hay ghi.</li>
<li><strong>Mặc định biến thiên lớn theo dữ liệu:</strong> gấp năm lần số dòng, xấp xỉ gấp năm lần thời gian. Bảng phình từ 464 MB lên 582 MB qua cả loạt lệnh, vì mọi dòng bị ghi lại.</li>
<li><strong>Đổi kiểu cũng có thể ghi lại.</strong> <code>text</code> → <code>varchar(80)</code> phải kiểm từng giá trị với giới hạn mới. Có những cú đổi kiểu chỉ chạm siêu dữ liệu (ví dụ nới <code>varchar(50)</code> thành <code>varchar(100)</code>); có những cú thì không, và cách chắc chắn duy nhất để biết là bấm giờ nó trên một bản sao.</li>
<li><strong><code>SET NOT NULL</code> đọc cả bảng</strong> để chứng minh không có ô rỗng nào — dưới khoá độc quyền. Mục "Ràng buộc hai bước" ở dưới làm cho lượt quét đó biến mất.</li>
</ul>

<h3>"Giữ một cái khoá" nghĩa là gì với người dùng của bạn</h3>
${slide('dv-05', 13, 'Trong 9,4 giây ALTER chạy, cả đọc lẫn ghi đều đứng')}
<p>Vẫn cái migration 2,6 giây đó, với các lệnh ghi chạy vào bảng suốt thời gian ấy:</p>
<div class="out">════ A) khong co migration nao chay — moc doi chieu ════
    ghi OK: 60   bi CHAN/het gio:  0   (trong 2179 ms)

════ B) trong luc ALTER TABLE ADD COLUMN DEFAULT gen_random_uuid() ════
    ghi OK: 55   bi CHAN/het gio:  5   (trong 4742 ms)</div>
<p>Năm lệnh ghi chạm hạn nửa giây và HỎNG. Cái lô mất 2.179 ms khi không có migration thì mất 4.742 ms khi có một cái — hơn GẤP ĐÔI, vì các lệnh ghi đang XẾP HÀNG sau cái khoá chứ không được thực thi.</p>
<div class="pitfall"><strong>Bẫy — <code>ALTER TABLE</code> lấy khoá <code>ACCESS EXCLUSIVE</code>, thứ xung đột với <em>MỌI THỨ</em>, kể cả <code>SELECT</code>.</strong> Không chỉ lệnh ghi — cả lệnh đọc. Và cái khoá được lấy ngay ở ĐẦU câu lệnh rồi giữ tới khi nó được ghi nhận, nên một lần ghi lại bảng mất hai giây là hai giây mà cái bảng KHÔNG TỒN TẠI dưới góc nhìn của ứng dụng bạn. Tệ hơn: lệnh <code>ALTER</code> trước hết phải <em>CHỜ</em> các giao dịch đang có trên bảng kết thúc, và TRONG LÚC NÓ CHỜ thì mọi truy vấn mới đều xếp hàng phía sau nó. Một lệnh <code>SELECT</code> chạy lâu có thể biến một migration nhanh thành một cú nghẽn toàn tập — migration chờ cái truy vấn, và mọi thứ khác chờ migration.</div>
<pre><code><span class="tok-comment">-- chan viec cho khoa VO HAN: tha hong nhanh con hon lam nghen ca bang</span>
SET lock_timeout = '3s';
ALTER TABLE lon ADD COLUMN moi text;

<span class="tok-comment">-- va gioi han thoi gian chay cua chinh lenh do</span>
SET statement_timeout = '30s';</code></pre>
<div class="callout ok"><strong><code>lock_timeout</code> là dòng giá trị nhất trong một tệp migration.</strong> Thiếu nó, một migration không lấy được khoá sẽ chờ VÔ HẠN <em>trong lúc chặn mọi truy vấn phía sau nó</em> — đúng cái sự cố kinh điển "website sập mà migration còn chưa kịp bắt đầu". Có nó, migration hỏng sau ba giây, không thứ gì bị chặn lâu hơn chừng đó, và bạn thử lại khi cái giao dịch dài kia đã xong.</div>
<h3>Đo thật: <code>lock_timeout</code> và <code>statement_timeout</code></h3>
${slide('dv-05', 15, 'lock_timeout: thua sau 2 s thay vì làm nghẽn cả bảng')}
<p>Cùng ba phiên đó, với <code>lock_timeout</code> của B đặt là <code>2s</code>:</p>
<div class="out">[B migration] bat dau 1015 ms, xong 3048 ms: ERROR:  canceling statement due to lock timeout
[C request ] bat dau 2025 ms, xong 3048 ms: nd42</div>
<p>B bỏ cuộc sau hai giây và C xong trong ĐÚNG mili giây đó — request web chờ một giây thay vì mười. Migration hỏng, và đó là kết cục ĐÚNG: không có gì thay đổi, script deploy dừng trước bước tráo (Bài 5.5), và bạn chạy lại khi bản báo cáo đã xong. <code>statement_timeout</code> là nửa còn lại — nó giới hạn một câu lệnh được <em>CHẠY</em> bao lâu sau khi đã có khoá:</p>
<div class="out">── statement_timeout: gioi han thoi gian CHAY ──
ERROR:  canceling statement due to statement timeout
Time: 3028.498 ms (00:03.028)
 cot_ma4_ton_tai
-----------------
               0</div>
<table>
<tr><th>Tham số</th><th>Giới hạn cái gì</th><th>Giá trị hay dùng trong migration</th></tr>
<tr><td><code>lock_timeout</code></td><td>Thời gian <em>CHỜ</em> để lấy được khoá</td><td><code>'2s'</code>–<code>'5s'</code> — ít hơn thời gian người dùng chịu nổi một trang đơ</td></tr>
<tr><td><code>statement_timeout</code></td><td>Tổng thời gian một câu lệnh được chạy</td><td>Rộng tay (<code>'60s'</code> trở lên) cho migration; bạn muốn nó XONG, chỉ là đừng chạy mãi</td></tr>
<tr><td><code>idle_in_transaction_session_timeout</code></td><td>Một phiên được ngồi không trong giao dịch đang mở bao lâu</td><td>Đặt trên role CSDL của ứng dụng, không đặt trong migration — nó dọn chính những giao dịch bỏ quên vốn là thứ chặn migration</td></tr>
</table>
<p>Cả ba đều là thiết lập bình thường: <code>SET</code> ở đầu tệp migration chỉ áp cho phiên đó; <code>ALTER ROLE … SET</code> biến nó thành mặc định của một role; còn với một lệnh shell một-lần, <code>PGOPTIONS="-c lock_timeout=2s"</code> đặt nó cho mọi <code>psql</code> khởi động từ shell đó (đã đo: <code>show lock_timeout</code> in ra <code>2s</code>). Mọi câu lệnh bị huỷ đều lùi sạch — cột <code>ma4</code> ở trên không tồn tại.</p>


<h3>Cùng phép thử ở năm triệu dòng: đọc cũng đứng</h3>
<p>Bộ dò dùng cho các con số ở trên, chạy lại trên <code>nd5m</code>: 56 request, cứ 250 ms một cái, mỗi cái là một kết nối <code>psql</code> mới từ VPS thí nghiệm; migration bắt đầu ở giây thứ 2.</p>
<div class="out">══ A) khong co migration — moc doi chieu ══
  request: 56 cai · cham hon 500 ms: 0 · loi: 0 · trung binh 32 ms · lau nhat 68 ms
══ B) ADD COLUMN ... DEFAULT gen_random_uuid() tren nd5m ══
  migration: bat dau 2002 ms, xong 11450 ms (9448 ms) OK
  request: 56 cai · cham hon 500 ms: 35 · loi: 0 · trung binh 3180 ms · lau nhat 9374 ms
══ C) doc (SELECT) trong luc ADD COLUMN ... gen_random_uuid() ══
  migration: bat dau 2020 ms, xong 11711 ms (9691 ms) OK
  request: 56 cai · cham hon 500 ms: 36 · loi: 0 · trung binh 3327 ms · lau nhat 9607 ms</div>
<p>Để ý <code>loi: 0</code>: không có gì HỎNG. Các request chỉ ĐỨNG CHỜ — tới 9,6 giây cho một câu <code>SELECT</code> một dòng theo khoá chính. Từ trình duyệt của người dùng thì đó là một trang đơ cứng, và sau nginx — nơi <code>proxy_read_timeout</code> mặc định là 60 giây — một bảng lớn hơn vài lần sẽ biến cái chờ đó thành <code>504</code>. Bộ dò nửa giây trước đó cho thấy hiệu ứng dưới dạng lỗi vì nó CÓ giới hạn chờ; bộ này cho thấy chuyện gì xảy ra khi KHÔNG có.</p>

<h3>Hàng đợi khoá, đọc từ <code>pg_stat_activity</code></h3>
${slide('dv-05', 14, 'Hàng đợi khoá: một SELECT dài làm cả bảng đứng')}
<p>Cái bẫy ở trên nói rằng một giao dịch dài có thể biến một migration tức thì thành một cú đứng toàn phần. Đây là nó, đo thật. Ba phiên làm việc trên <code>nd1m</code>: A là một "báo cáo" mở giao dịch, đọc bảng rồi giữ giao dịch mở suốt 12 giây; B là migration, một <code>ADD COLUMN</code> chỉ chạm siêu dữ liệu; C là một request web bình thường tới sau B một giây.</p>
<pre><code class="language-bash"># queue.sh (rút gọn) — chạy trên VPS thí nghiệm
psql -qAt -c "begin; select count(*) from nd1m where id &lt; 10; select pg_sleep(12); commit;" &amp;   # A
sleep 1; psql -qAt -c "set lock_timeout='0'; alter table nd1m add column thu_1 text;" &amp;         # B
sleep 1; psql -qAt -c "select ten from nd1m where id = 42;" &amp;                                    # C
sleep 1; psql -c "select pid, state, wait_event_type as cho, wait_event,
                  pg_blocking_pids(pid) as bi_chan_boi, left(query,44) as query
                  from pg_stat_activity where datname='postgres' and pid &lt;&gt; pg_backend_pid()
                  and backend_type='client backend' order by backend_start;"
psql -c "select l.pid, l.mode, l.granted from pg_locks l where l.relation='nd1m'::regclass order by l.granted desc, l.pid;"</code></pre>
<div class="out">── pg_stat_activity luc 3026 ms ──
 pid | state  |   cho   | wait_event | bi_chan_boi |                    query
-----+--------+---------+------------+-------------+----------------------------------------------
  84 | active | Timeout | PgSleep    | {}          | begin; select count(*) from nd1m where id &lt;
  85 | active | Lock    | relation   | {84}        | set lock_timeout='0'; alter table nd1m add c
  86 | active | Lock    | relation   | {85}        | select ten from nd1m where id = 42;

── pg_locks tren nd1m ──
 pid |        mode         | granted
-----+---------------------+---------
  84 | AccessShareLock     | t
  85 | AccessExclusiveLock | f
  86 | AccessShareLock     | f

[B migration] bat dau 1008 ms, xong 12070 ms: OK
[C request ] bat dau 2020 ms, xong 12071 ms: nd42</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Đọc <code>bi_chan_boi</code> (<code>pg_blocking_pids</code>) như những mũi tên</span><span class="v">86 bị 85 chặn, và 85 bị 84 chặn. Lần theo chuỗi tới cái pid có danh sách rỗng: đó là GỐC, và nó không phải migration.</span></div>
  <div class="kv"><span class="k">C chẳng xung đột với thứ gì ĐÃ ĐƯỢC CẤP</span><span class="v">C muốn <code>AccessShareLock</code>, đúng thứ A đang giữ — hai cái tương thích. C chờ vì nó xếp hàng <em>SAU</em> lời xin <code>AccessExclusiveLock</code> của B. PostgreSQL cấp khoá gần như theo thứ tự tới, nên một khoá độc quyền đang chờ sẽ chặn mọi người tới sau nó.</span></div>
  <div class="kv"><span class="k"><code>granted = f</code></span><span class="v">Trong <code>pg_locks</code>, đó là khoá đã xin mà chưa nhận được. Hai dòng <code>f</code> trên một bảng giữa lúc deploy nghĩa là, với bảng đó, website đang SẬP.</span></div>
  <div class="kv"><span class="k">Cách sửa nằm ở B, không ở C</span><span class="v">Có <code>lock_timeout</code> thì B bỏ cuộc và C chạy ngay — mục kế tiếp. Cách kia, giết A, đôi khi cũng đúng: <code>select pg_cancel_backend(84);</code> huỷ câu truy vấn của nó, <code>pg_terminate_backend(84)</code> đóng hẳn kết nối. Tìm hiểu A là gì TRƯỚC khi làm cái nào.</span></div>
</div>

<h3>Những thao tác đáng biết mức khoá của chúng</h3>
${slide('dv-05', 18, 'Bảng mức khoá: thao tác nào chặn đọc, chặn ghi')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Chỉ siêu dữ liệu — tức thì ở mọi cỡ</span><span class="lz-lnote"><code>ADD COLUMN</code> không kèm mặc định, hoặc kèm mặc định hằng số (PG 11+). <code>DROP COLUMN</code> — dữ liệu vẫn nằm trên đĩa nhưng cột thì biến mất về mặt logic. Đổi tên. Tất cả VẪN lấy <code>ACCESS EXCLUSIVE</code>, nên vẫn cần <code>lock_timeout</code> — chỉ là chúng giữ nó rất ngắn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Ghi lại cả bảng — tăng theo số dòng</span><span class="lz-lnote"><code>ADD COLUMN</code> kèm mặc định biến thiên (đo được: 2.606 ms), phần lớn <code>ALTER COLUMN TYPE</code>, <code>SET NOT NULL</code> trên bảng lớn. Hãy tính bằng PHÚT chứ không phải giây, trên dữ liệu thật.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chặn GHI nhưng không chặn ĐỌC</span><span class="lz-lnote"><code>CREATE INDEX</code> lấy khoá <code>SHARE</code>: <code>SELECT</code> chạy tiếp, còn <code>INSERT</code>/<code>UPDATE</code>/<code>DELETE</code> thì chờ. <code>CREATE INDEX CONCURRENTLY</code> né được chuyện đó, đổi lại là hai lượt quét bảng và không chạy được bên trong một giao dịch.</span></div>
  <div class="lz-layer"><span class="lz-lname">Rẻ nếu chia làm hai bước</span><span class="lz-lnote">Thêm một ràng buộc: <code>ADD CONSTRAINT ... NOT VALID</code> là tức thì và áp cho dòng MỚI, rồi <code>VALIDATE CONSTRAINT</code> quét các dòng đang có dưới một cái khoá YẾU HƠN. Hai câu lệnh, không gián đoạn — thay vì một câu lệnh khoá cả bảng suốt độ dài một lượt quét toàn bảng.</span></div>
</div>
<div class="note-ct">Một ghi chú trung thực về một phép đo trong bài này: một nỗ lực chứng minh <code>CREATE INDEX</code> chặn lệnh ghi đã KHÔNG tìm thấy gì — 25 trên 25 lệnh ghi đều thành công ở cả dạng thường lẫn dạng <code>CONCURRENTLY</code>. Cái chỉ mục dựng xong trong khoảng 600 ms, nhanh hơn khả năng lấy mẫu có ý nghĩa của phép thử, nên phép thử chỉ chứng minh được rằng thao tác đó NGẮN. Phép đo chặn ở trên dùng lệnh <code>ALTER</code> 2,6 giây thay thế, chỗ mà hiệu ứng đủ lớn để nhìn thấy. Một phép đo không tìm ra gì vì thao tác quá nhanh thì KHÔNG phải bằng chứng rằng không có gì xảy ra.</div>

<h3>CREATE INDEX ở năm triệu dòng — phép đo "không thấy gì", làm lại</h3>
${slide('dv-05', 16, 'CREATE INDEX chặn ghi, CONCURRENTLY thì không — đo ở 5 triệu dòng')}
<p>Ghi chú trung thực ở trên kể rằng một lần dựng chỉ mục 600 ms quá ngắn để thấy được gì. Ở năm triệu dòng việc dựng đủ lâu, và cùng bộ dò đó cho thấy khác biệt rõ ràng:</p>
<div class="out">══ D) CREATE INDEX (thuong) — request GHI ══
  migration: bat dau 2007 ms, xong 7625 ms (5618 ms) OK
  request: 56 cai · cham hon 500 ms: 20 · loi: 0 · trung binh 1165 ms · lau nhat 5596 ms
══ E) CREATE INDEX (thuong) — request DOC ══
  migration: bat dau 2005 ms, xong 11789 ms (9784 ms) OK
  request: 56 cai · cham hon 500 ms: 2 · loi: 0 · trung binh 116 ms · lau nhat 819 ms
══ F) CREATE INDEX CONCURRENTLY — request GHI ══
  migration: bat dau 2005 ms, xong 9305 ms (7300 ms) OK
  request: 56 cai · cham hon 500 ms: 0 · loi: 0 · trung binh 49 ms · lau nhat 204 ms</div>
<div class="out">  create index idx_m1 on nd5m(tao)        ShareLock
  create index concurrently idx_m2 on nd5mShareUpdateExclusiveLock
  alter table nd5m add column ma9 uuid defAccessExclusiveLock</div>
<ul>
<li><strong><code>CREATE INDEX</code> thường lấy <code>SHARE</code>:</strong> lệnh ghi xếp hàng suốt thời gian dựng (20 trên 56 cái quá nửa giây, lâu nhất 5,6 s); lệnh đọc vẫn chạy. Hai lệnh đọc chậm ở E là do tranh CPU và đĩa trên một cái laptop đang chạy cả việc dựng lẫn bộ dò, không phải chờ khoá — lâu nhất 0,8 s so với 9,8 s dựng chỉ mục.</li>
<li><strong><code>CONCURRENTLY</code> lấy <code>SHARE UPDATE EXCLUSIVE</code>:</strong> không lệnh ghi nào chờ quá 204 ms. Cái giá: dựng lâu hơn 30% (nó quét bảng hai lần và chờ các giao dịch cũ hơn), và nó không chạy được trong một giao dịch — Bài 5.4 cho thấy điều đó nghĩa là gì với một tệp migration.</li>
</ul>

<h3>Ràng buộc hai bước: <code>NOT VALID</code>, rồi <code>VALIDATE</code></h3>
${slide('dv-05', 17, 'Ràng buộc hai bước: NOT VALID rồi VALIDATE, SET NOT NULL bỏ qua quét')}
<p>Thêm một ràng buộc bình thường sẽ quét mọi dòng dưới <code>ACCESS EXCLUSIVE</code>. Tách nó ra thì lượt quét chuyển sang một khoá cho phép đọc và ghi tiếp tục. Đo trên <code>nd5m</code>:</p>
<div class="out">-- A) SET NOT NULL thang (quet 5 trieu dong duoi ACCESS EXCLUSIVE)
Time: 1745.241 ms (00:01.745)
-- B1) CHECK ... NOT VALID (tuc thi)
Time: 10.699 ms
-- B2) VALIDATE (quet, nhung chi SHARE UPDATE EXCLUSIVE)
Time: 855.735 ms
-- B3) SET NOT NULL — da co CHECK hop le nen BO QUA buoc quet
Time: 1.206 ms</div>
<pre><code class="language-sql">alter table nd5m add constraint ck_ten_nn check (ten is not null) not valid;  -- dong MOI bi kiem ngay
alter table nd5m validate constraint ck_ten_nn;   -- quet dong CU, khong chan ghi
alter table nd5m alter column ten set not null;   -- thay CHECK hop le ⇒ bo qua quet
alter table nd5m drop constraint ck_ten_nn;       -- CHECK da het viec</code></pre>
<p>Tài liệu PostgreSQL nói rõ cả hai nửa: bước xác thực "chỉ lấy khoá <code>SHARE UPDATE EXCLUSIVE</code>", và với <code>SET NOT NULL</code> "nếu có một ràng buộc <code>CHECK</code> hợp lệ … chứng minh không thể có <code>NULL</code>, thì bỏ qua việc quét bảng". Cùng khuôn đó dùng được cho khoá ngoại. Với <code>UNIQUE</code> thì không có <code>NOT VALID</code>; hãy dựng chỉ mục bằng <code>CREATE UNIQUE INDEX CONCURRENTLY</code> rồi gắn nó vào bằng <code>ADD CONSTRAINT … UNIQUE USING INDEX</code>.</p>

<h3>Danh mục kiểm trước khi chạy một migration trên production</h3>
<pre><code><span class="tok-comment">-- 1. co giao dich nao dang chay lau khong? (chung se CHAN migration)</span>
select pid, now()-xact_start as lau, left(query,60)
from pg_stat_activity
where xact_start is not null and now()-xact_start &gt; interval '30 seconds'
order by lau desc;

<span class="tok-comment">-- 2. bang to co nao? (quyet dinh giua "tuc thi" va "vai phut")</span>
select relname, n_live_tup, pg_size_pretty(pg_total_relation_size(relid))
from pg_stat_user_tables order by n_live_tup desc limit 5;

<span class="tok-comment">-- 3. trong luc migration chay: ai dang cho ai?</span>
select pid, wait_event_type, wait_event, left(query,50)
from pg_stat_activity where wait_event_type = 'Lock';</code></pre>
<div class="note-ct">Truy vấn 1 là truy vấn nên chạy <em>TRƯỚC</em> mọi migration. Một giao dịch đã mở suốt hai mươi phút — một kết nối idle-in-transaction từ một job đã chết, một bản báo cáo ai đó đang chạy — sẽ CHẶN lệnh <code>ALTER TABLE</code> của bạn, và lệnh <code>ALTER TABLE</code> của bạn sẽ chặn TOÀN BỘ ứng dụng. Tìm ra nó trước sẽ biến một sự cố tiềm tàng thành ba mươi giây chờ ai đó gập laptop lại.</div>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> migration của một bạn trong nhóm thêm <code>ma uuid default gen_random_uuid()</code> vào bảng lớn nhất, và ai đó đang chạy một bản báo cáo dài đúng lúc deploy. Chứng minh trên phòng thí nghiệm mỗi thứ đó làm gì với website, rồi viết phần đầu migration để nó an toàn.</p>
<ol>
<li>Trên VPS thí nghiệm, tạo <code>nd1m</code> một triệu dòng: <code>create table nd1m(id bigserial primary key, ten text, email text); insert into nd1m(ten,email) select 'nd'||g, 'nd'||g||'@x.com' from generate_series(1,1000000) g;</code> Bấm giờ <code>add column c1 text</code> và <code>add column c2 uuid default gen_random_uuid()</code> bằng <code>\\timing on</code>.</li>
<li>Ở terminal thứ nhất, mở <code>psql</code> và chạy <code>begin; select count(*) from nd1m;</code> — để nguyên đó. Ở terminal thứ hai chạy <code>alter table nd1m add column c3 text;</code>. Ở terminal thứ ba, <code>select ten from nd1m where id = 42;</code>. Cả hai đều treo.</li>
<li>Từ terminal thứ tư, chạy câu truy vấn <code>pg_stat_activity</code> của bài và ghi lại chuỗi pid <code>bi_chan_boi</code>. Rồi <code>commit;</code> ở terminal thứ nhất và nhìn cả hai cùng xong.</li>
<li>Làm lại bước 2 với <code>set lock_timeout = '2s';</code> trước câu <code>ALTER</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có hai con số thời gian (vài ms so với hơn một giây), chuỗi chặn đọc thành "request ← migration ← báo cáo", và với <code>lock_timeout</code> thì migration in <code>canceling statement due to lock timeout</code> trong khi request trả về trong khoảng hai giây.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Lock mode (mức khoá)</span><span class="v">Độ mạnh của một khoá; PostgreSQL có tám mức ở cấp bảng và một bảng cho biết mức nào xung đột với mức nào.</span></div>
  <div class="kv"><span class="k"><code>ACCESS EXCLUSIVE</code> (độc quyền truy cập)</span><span class="v">Mức mạnh nhất; xung đột với mọi thứ, kể cả <code>SELECT</code>. Phần lớn các dạng <code>ALTER TABLE</code> lấy nó.</span></div>
  <div class="kv"><span class="k">Table rewrite (ghi lại bảng)</span><span class="v">Thao tác ghi lại mọi dòng; thời gian của nó lớn theo cỡ bảng.</span></div>
  <div class="kv"><span class="k">Lock queue (hàng đợi khoá)</span><span class="v">Các lời xin khoá đang chờ, được cấp gần như theo thứ tự — một khoá độc quyền đang chờ chặn mọi thứ phía sau nó.</span></div>
  <div class="kv"><span class="k"><code>lock_timeout</code> (giới hạn chờ khoá)</span><span class="v">Thời gian tối đa được chờ khoá trước khi câu lệnh bị huỷ.</span></div>
  <div class="kv"><span class="k"><code>statement_timeout</code> (giới hạn chạy)</span><span class="v">Thời gian tối đa một câu lệnh được chạy.</span></div>
  <div class="kv"><span class="k"><code>pg_stat_activity</code> / <code>pg_locks</code></span><span class="v">Các view liệt kê mọi phiên và mọi khoá; <code>pg_blocking_pids(pid)</code> cho biết ai chặn ai.</span></div>
  <div class="kv"><span class="k"><code>NOT VALID</code> / <code>VALIDATE</code> (chưa xác thực / xác thực)</span><span class="v">Thêm ràng buộc cho dòng mới ngay bây giờ, kiểm dòng cũ sau dưới một khoá yếu hơn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mặc định hằng số và cột cho NULL là tức thì ở mọi cỡ bảng; mặc định biến thiên hay đổi kiểu thì ghi lại bảng — 8,1 s và 6,7 s trên năm triệu dòng.</li>
<li>Trong lúc <code>ALTER TABLE</code> giữ <code>ACCESS EXCLUSIVE</code>, lệnh đọc cũng chờ như lệnh ghi: một câu <code>SELECT</code> một dòng chờ 9,6 s, mà không có lỗi nào để thấy.</li>
<li>Kể cả một migration tức thì cũng phải chờ sau một giao dịch dài, và mọi thứ tới sau nó chờ sau migration — đọc chuỗi đó trong <code>pg_stat_activity</code> bằng <code>pg_blocking_pids</code>.</li>
<li>Mở đầu mọi migration production bằng <code>lock_timeout</code>: hỏng sau hai giây tốt hơn làm đơ cả bảng.</li>
<li><code>CREATE INDEX</code> chặn ghi; <code>CREATE INDEX CONCURRENTLY</code> thì không, đổi lại dựng chậm hơn và không nằm trong giao dịch được.</li>
<li>Tách ràng buộc: <code>NOT VALID</code> bây giờ, <code>VALIDATE</code> sau — rồi <code>SET NOT NULL</code> bỏ qua lượt quét (1,2 ms thay vì 1.745 ms).</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — Explicit Locking, bảng ma trận xung đột</span><span class="lc-sub">postgresql.org/docs/current/explicit-locking.html — cái bảng cho thấy mức khoá nào xung đột với mức nào, và đó là nguồn tra cứu cho mọi thứ ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Ghi chú phát hành PostgreSQL 11 — ADD COLUMN kèm mặc định</span><span class="lc-sub">postgresql.org/docs/11/release-11.html — cái thay đổi đã làm cho một nửa lời khuyên cũ trở nên lỗi thời.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">strong_migrations — danh sách các thao tác không an toàn</span><span class="lc-sub">github.com/ankane/strong_migrations — một gem của Rails mà tệp README của nó là bản danh mục dễ hiểu nhất về migration nguy hiểm và cách thay thế an toàn, bất kể bạn dùng ngôn ngữ nào.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — khoá, MVCC và pg_stat_activity</span><span class="lc-sub">/courses/postgresql/learn${REF} — vì sao người đọc không chặn người ghi, và vì sao <code>ALTER TABLE</code> là ngoại lệ chặn cả hai.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.4 ─────────────────────────── */
    {
      title: '5.4 — The migration that half-applied|||5.4 — Cái migration áp dụng NỬA CHỪNG',
      slug: 'deploy-5-4-migration-nua-chung',
      type: 'LESSON',
      description: 'Một migration ba câu lệnh, câu thứ ba hỏng. Đo trạng thái còn lại: bảng TỒN TẠI, dữ liệu ĐÃ CHÈN, ràng buộc KHÔNG CÓ, sổ theo dõi ghi "chưa xong" — và chạy lại thì hỏng ở câu ĐẦU TIÊN.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>The migration that half-applied</h2>
<p class="lead">This is the state the project instructions warn about in capital letters. A migration fails partway, the tracking table says it started and did not finish, and every subsequent deploy refuses to run. This lesson reproduces it deliberately, so the recovery is a decision rather than a guess.</p>

<h3>Producing the state</h3>
${slide('dv-05', 19, 'P3018 rồi P3009: mọi deploy sau bị chặn')}
<p>A three-statement migration whose third statement fails on data that already exists:</p>
<pre><code>create table don_hang(id serial primary key, ma text);
insert into don_hang(ma) values ('A'),('B'),('A');
alter table don_hang add constraint uq_ma unique (ma);   <span class="tok-comment">-- SE HONG: co 'A' trung</span></code></pre>
<div class="out">    ERROR:  could not create unique index "uq_ma"
    DETAIL:  Key (ma)=(A) is duplicated.

  --- migration hong. Trang thai con lai la gi? ---
    bang don_hang co ton tai khong: 1
    so dong da chen:                3
    rang buoc unique co khong:      0
    _migrations ghi gi:             m001 xong=false

    psql: ERROR:  relation "don_hang" already exists</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Two of three statements applied</span><span class="v">The table exists with three rows. The constraint does not. The database is in a shape that no version of the schema ever intended.</span></div>
  <div class="kv"><span class="k">The ledger says "started, not finished"</span><span class="v"><code>xong=false</code>. Most migration tools treat that as a hard stop: they will not run the next migration, and they will not re-run this one, because they cannot know how much of it happened.</span></div>
  <div class="kv"><span class="k">Re-running fails at statement one</span><span class="v"><code>relation "don_hang" already exists</code>. The obvious recovery — "just run it again" — fails immediately, and fails on a <em>different</em> error than the original, which sends the investigation somewhere unhelpful.</span></div>
  <div class="kv"><span class="k">And every deploy is now blocked</span><span class="v">Not just this migration. The tool refuses to proceed at all, so an unrelated urgent fix cannot ship either. That is what turns a schema problem into an outage.</span></div>
</div>
<div class="callout warn"><strong>This repository has been here.</strong> A migration failed on a production deploy and left the tracking table in exactly this condition — the <code>P3009</code> state. The instructions written afterwards say: <strong>stop, do not auto-fix</strong>. Do not run <code>migrate resolve --rolled-back</code> or <code>--applied</code> reflexively, and do not rewrite the migration with <code>CREATE TABLE IF NOT EXISTS</code> to force it through. Both make the immediate error go away and can leave the schema permanently inconsistent with the migration history, which is a much harder problem than the one you started with.</div>

<h3>The same failure through Prisma itself: P3018, then P3009</h3>
<p>The measurement above ran the three statements through <code>psql</code>, which sends them one at a time. Reproduced with Prisma 5.22 — the version this project uses — against PostgreSQL 16 in the lab: a first migration creates <code>don_hang</code>, the "application" inserts <code>'A'</code>, <code>'B'</code>, <code>'A'</code>, and a second migration adds a column, a table and a <code>UNIQUE</code> constraint:</p>
<pre><code class="language-sql">-- prisma/migrations/20260902000000_them_unique/migration.sql
ALTER TABLE "don_hang" ADD COLUMN "ghi_chu" TEXT;
CREATE TABLE "nhat_ky" ("id" SERIAL PRIMARY KEY, "noi" TEXT);
ALTER TABLE "don_hang" ADD CONSTRAINT "uq_ma" UNIQUE ("ma");</code></pre>
<div class="out">$ npx prisma migrate deploy
Applying migration &#96;20260902000000_them_unique&#96;
Error: P3018

A migration failed to apply. New migrations cannot be applied before the error is recovered from. …
Migration name: 20260902000000_them_unique
Database error code: 23505
Database error:
ERROR: could not create unique index "uq_ma"
DETAIL: Key (ma)=(A) is duplicated.

$ npx prisma migrate deploy
Error: P3009

migrate found failed migrations in the target database, new migrations will not be applied. …
The &#96;20260902000000_them_unique&#96; migration started at 2026-09-29 01:57:28.971662 UTC failed</div>
<div class="out">       migration_name       | xong_luc | buoc
----------------------------+----------+------
 20260901000000_init        | 02:15:37 |    1
 20260902000000_them_unique |          |    0</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>P3018</code> is the failure itself</span><span class="v">Printed once, by the deploy that ran the broken file, with the real SQL error underneath. Copy it somewhere: the next deploy will not show it again.</span></div>
  <div class="kv"><span class="k"><code>P3009</code> is the ledger refusing to continue</span><span class="v">Every later <code>migrate deploy</code> prints this instead — including the deploy of an unrelated urgent fix. The row with an empty <code>finished_at</code> is the cause.</span></div>
  <div class="kv"><span class="k">What actually happened to the database — measured</span><span class="v">Nothing. Column <code>ghi_chu</code> absent, table <code>nhat_ky</code> absent. Prisma sends the whole file in one request, and PostgreSQL runs a multi-statement request as one implicit transaction, so the first two statements rolled back with the third. The <code>psql</code> run above, statement by statement, left two of three applied. <em>Which</em> of those you get depends on the tool — which is exactly why step 1 below is "look", not "assume".</span></div>
  <div class="kv"><span class="k">The real incident in this project was the other shape</span><span class="v">On 29/06 production had six migrations whose objects <em>existed</em> but whose ledger rows were missing or unfinished — drift left by earlier manual work — so <code>migrate deploy</code> failed with <code>P3009</code>/<code>P3018</code>. The fix checked every table and column with <code>psql</code> first, marked only those six <code>--applied</code>, and then let <code>migrate deploy</code> run the one genuinely new migration.</span></div>
</div>

<h3>The prevention: one transaction</h3>
${slide('dv-05', 23, 'CONCURRENTLY phải đứng một mình một tệp; hỏng thì để lại chỉ mục INVALID')}
<p>The identical migration, wrapped in <code>BEGIN</code>/<code>COMMIT</code>:</p>
<div class="out">════ CUNG migration do, boc trong BEGIN/COMMIT ════
    ERROR:  could not create unique index "uq_ma"
  --- trang thai sau khi hong ---
    bang don_hang co ton tai khong: 0
    → KHONG con dau vet nao. Chay lai duoc ngay sau khi sua du lieu.</div>
<div class="callout ok"><strong>Same error, no wreckage.</strong> PostgreSQL supports transactional DDL — <code>CREATE TABLE</code> and <code>ALTER TABLE</code> roll back like any other statement. The table does not exist, the rows were never inserted, and the migration can be corrected and re-run immediately. This is a genuine advantage over MySQL, where most DDL commits implicitly and the half-applied state is unavoidable.</div>
<div class="pitfall"><strong>Trap — not everything can go inside a transaction, and the two exceptions are ones migrations use.</strong> Measured:
<br>· <code>ERROR: CREATE INDEX CONCURRENTLY cannot run inside a transaction block</code>
<br>· <code>ERROR: CREATE DATABASE cannot run inside a transaction block</code>
<br>So the very statement recommended in Lesson 5.3 for avoiding write locks is the one that cannot be made atomic. Put it in its own migration file, alone, and make that file idempotent — <code>CREATE INDEX CONCURRENTLY IF NOT EXISTS</code>, plus a check for the <code>INVALID</code> index a failed concurrent build leaves behind.</div>
<pre><code><span class="tok-comment">-- mot lan CREATE INDEX CONCURRENTLY hong de lai mot chi muc INVALID</span>
<span class="tok-comment">-- no KHONG duoc dung, va no VAN chiem cho. Tim va don:</span>
select indexrelid::regclass as ten
from pg_index where not indisvalid;

drop index concurrently if exists idx_hong;</code></pre>
<h3>Measured with Prisma: CONCURRENTLY must be alone in its file</h3>
<p>Because Prisma sends a migration file as one implicit transaction, a <code>CREATE INDEX CONCURRENTLY</code> next to any other statement cannot run at all:</p>
<div class="out"># migration.sql: ADD COLUMN "tao" + CREATE INDEX CONCURRENTLY "idx_tao"
Applying migration &#96;20260903000000_cic_kem&#96;
Error: P3018
ERROR: CREATE INDEX CONCURRENTLY cannot run inside a transaction block

# tệp mới CHỈ có một câu CREATE INDEX CONCURRENTLY
Applying migration &#96;20260903000000_cic_rieng&#96;
All migrations have been successfully applied.</div>
<p>The first file also produced a <code>P3009</code> for the next deploy, and the column it tried to add was not there (implicit transaction again). One statement per file, <code>IF NOT EXISTS</code> on it, and a check for a leftover invalid index before any retry — measured on the lab table, a failed <code>CREATE UNIQUE INDEX CONCURRENTLY</code> left exactly that:</p>
<div class="out">ERROR:  could not create unique index "uq_ten"
DETAIL:  Key (ten)=(moi) is duplicated.
   chi_muc   | indisvalid
-------------+------------
 nd5m_pkey   | t
 idx_email_a | t
 idx_email_b | t
 idx_email_c | t
 uq_ten      | f</div>


<h3>Getting out of the stuck state</h3>
${slide('dv-05', 21, 'Thoát kẹt: DỪNG → soi → sửa → resolve → diff')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Find out exactly how far it got</span><span class="lz-d">Read the migration file statement by statement and check each one against the live schema — does the table exist, does the column exist, does the constraint exist, is the index valid. This is the step people skip, and it is the only one that makes the rest safe.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Decide: finish it, or undo it</span><span class="lz-d">If most of it applied and the remainder is safe, apply the remaining statements by hand and mark the migration applied. If little applied, undo those few statements by hand and mark it rolled back. Either is fine; guessing which state you are in is not.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Make the ledger match reality — deliberately</span><span class="lz-d"><code>migrate resolve --applied</code> or <code>--rolled-back</code> is the right tool <em>after</em> steps 1 and 2, because now you know which one is true. The instruction against auto-resolving is against running it <em>before</em> you know.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Verify against the schema, not the ledger</span><span class="lz-d"><code>prisma migrate diff --from-migrations ./prisma/migrations --to-url "\$DATABASE_URL" --shadow-database-url "\$SHADOW_DATABASE_URL" --script</code> prints the difference between what the history says and what the database is. Output that is only <code>-- This is an empty migration.</code> means they agree. Anything else is drift you have not resolved yet. (Corrected 29/09/2026: with Prisma 5.22, the version this project uses, <code>--to-database-url</code> does not exist — it fails with <code>unknown or unexpected option</code> — and <code>--from-migrations</code> refuses to run without a shadow database: <code>You must pass the --shadow-database-url if you want to diff a migrations directory.</code> Point the shadow URL at an empty scratch database, never at production.)</span></div>
</div>
<div class="note-ct">Step 4 is the one that catches an incomplete recovery. A ledger that says "applied" and a schema that is missing a constraint will deploy cleanly today and fail in three weeks, when a later migration assumes the constraint exists. The diff is cheap, it is non-destructive, and it is the only mechanical check that the two halves agree.</div>

<h3>Measured: the five steps, and the shortcut that looks like them</h3>
<p>The recovery, run on the stuck lab database. Step 2 found the cause in one query, the data was fixed deliberately, and only then was the ledger touched:</p>
<div class="out">$ psql -c "select ma, count(*) from don_hang group by ma having count(*) &gt; 1"
 ma | count
----+-------
 A  |     2
$ psql -c "update don_hang set ma = 'A-3' where id = 3"
UPDATE 1
$ npx prisma migrate resolve --rolled-back 20260902000000_them_unique
Migration 20260902000000_them_unique marked as rolled back.
$ npx prisma migrate deploy
Applying migration &#96;20260902000000_them_unique&#96;
All migrations have been successfully applied.
$ npx prisma migrate diff --from-migrations prisma/migrations --to-url "$DATABASE_URL" \\
    --shadow-database-url "$SHADOW" --script
-- This is an empty migration.</div>
${slide('dv-05', 20, 'resolve --applied bừa: status xanh, CSDL thiếu 3 thứ')}
<p>And the shortcut, on a second copy of the same stuck database: skip the looking and mark it applied.</p>
<div class="out">$ npx prisma migrate resolve --applied 20260902000000_them_unique
Migration 20260902000000_them_unique marked as applied.
$ npx prisma migrate deploy
No pending migrations to apply.
$ npx prisma migrate status
Database schema is up to date!
$ psql -c "select id, ma, ghi_chu from don_hang limit 1"
ERROR:  column "ghi_chu" does not exist
$ npx prisma migrate diff --from-migrations prisma/migrations --to-url "$DATABASE_URL" \\
    --shadow-database-url "$SHADOW" --script
-- DropIndex
DROP INDEX "uq_ma";

-- AlterTable
ALTER TABLE "don_hang" DROP COLUMN "ghi_chu";

-- DropTable
DROP TABLE "nhat_ky";</div>
<div class="pitfall co-tieu-de"><strong>Trap — <code>--applied</code> edits the ledger and runs no SQL.</strong> Every tool now says green: <code>deploy</code> has nothing to do, <code>status</code> says up to date. The database is missing a column, a table and a constraint, and the first request that needs any of them fails — days later, looking unrelated to any deploy. Read the <code>diff</code> output as "the SQL that would turn the history's schema into the real database's schema": here it would <em>drop</em> three things, which means the database lacks them. The rule in this project's own instructions — stop, do not auto-resolve — exists because of exactly this.</div>
<table>
<tr><th>Command</th><th>Changes the database?</th><th>Changes the ledger?</th><th>Use when</th></tr>
<tr><td><code>migrate deploy</code></td><td>yes — runs pending files</td><td>yes</td><td>every deploy</td></tr>
<tr><td><code>migrate status</code></td><td>no</td><td>no</td><td>to read the ledger vs the folder</td></tr>
<tr><td><code>migrate resolve --rolled-back X</code></td><td>no</td><td>marks X rolled back, so it can run again</td><td>you checked and X left <em>nothing</em> behind (or you removed it)</td></tr>
<tr><td><code>migrate resolve --applied X</code></td><td>no</td><td>marks X done, so it never runs</td><td>you checked and <em>everything</em> in X exists (or you finished it by hand)</td></tr>
<tr><td><code>migrate diff … --script</code></td><td>no</td><td>no</td><td>after every resolve, to prove the two agree</td></tr>
</table>

<h3>Writing migrations that cannot get stuck</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">One logical change per file</span><span class="lz-lnote">The three-statement migration above failed because it did three things. Split across files, the failure would have been isolated to the constraint, with the table and data already committed and recorded.</span></div>
  <div class="lz-layer"><span class="lz-lname">Wrap in a transaction unless you cannot</span><span class="lz-lnote">Most tools do this by default; check yours rather than assuming. And when a statement cannot be wrapped, that file gets nothing else in it.</span></div>
  <div class="lz-layer"><span class="lz-lname">Check the data before adding a constraint</span><span class="lz-lnote">The measured failure was a duplicate <code>'A'</code> that already existed. Run the equivalent <code>select … group by … having count(*) &gt; 1</code> against production first. A constraint migration should never be the thing that discovers your data is inconsistent.</span></div>
  <div class="lz-layer"><span class="lz-lname">Run migrations against a copy of production first</span><span class="lz-lnote">Not against an empty test database. The failure above only exists because of the data — an empty database would have applied that migration perfectly and told you nothing.</span></div>
</div>
<div class="callout warn"><strong>This project cannot use <code>prisma migrate dev</code> at all.</strong> One deployed migration creates a unique constraint and then a plain index with the same name, so it can never replay on a shadow database — <code>P3006</code>, permanently. The instructions accept that: new migrations are hand-written SQL under <code>prisma/migrations/&lt;timestamp&gt;_&lt;name&gt;/migration.sql</code> and applied with <code>migrate deploy</code>, which does not use a shadow database. The migration cannot be edited because it is already deployed. It is a good example of the rule that migration history is append-only in practice, whatever the tooling claims.</div>
<h3>Reproducing P3006, and the hand-written migration workflow</h3>
${slide('dv-05', 22, 'migrate dev hỏng vì shadow DB: viết SQL tay rồi migrate deploy')}
<p>The callout above describes this project's migration <code>20260706130000_add_music_and_profile</code>. Its two offending lines, copied into a lab project exactly as they are:</p>
<pre><code class="language-sql">ALTER TABLE "post_music" ADD CONSTRAINT "post_music_post_id_key" UNIQUE ("post_id");
CREATE INDEX "post_music_post_id_key" ON "post_music"("post_id");</code></pre>
<p>A <code>UNIQUE</code> constraint is implemented by an index <em>with the constraint's name</em>, so the second line asks for a name that already exists. On production that migration is marked applied (its objects were created and checked by hand), so <code>migrate deploy</code> never runs it again. <code>migrate dev</code>, however, rebuilds the whole history on an empty shadow database every time — and fails on it, every time:</p>
<div class="out">$ npx prisma migrate dev --name them_cot_thu
Error: P3006
Migration &#96;20260706130000_add_music_and_profile&#96; failed to apply cleanly to the shadow database.
Error:
ERROR: relation "post_music_post_id_key" already exists</div>
<p>Editing the old file would "fix" it and is forbidden: the file has run on production, and (as measured in Lesson 5.1) <code>migrate deploy</code> would not even notice the edit. The workflow the project uses instead, measured on the lab copy:</p>
<ol>
<li><strong>Let Prisma compute the SQL</strong> from the live database to the edited schema file — no shadow database needed:
<pre><code class="language-bash">npx prisma migrate diff --from-schema-datasource prisma/schema.prisma \\
  --to-schema-datamodel prisma/schema.prisma --script</code></pre>
<div class="out">-- AlterTable
ALTER TABLE "post_music" ADD COLUMN     "thu" TEXT;</div></li>
<li><strong>Save it by hand</strong> as <code>prisma/migrations/&lt;UTC timestamp&gt;_&lt;name&gt;/migration.sql</code>, and <em>read it</em> — this is where a <code>DROP COLUMN</code> from a rename (Lesson 5.2) gets caught.</li>
<li><strong>Apply with <code>migrate deploy</code></strong>, which never touches a shadow database:
<div class="out">Applying migration &#96;20260929090000_them_cot_thu&#96;
All migrations have been successfully applied.</div></li>
<li><strong>Verify</strong> by running the diff from step 1 again: <code>-- This is an empty migration.</code></li>
</ol>
<div class="callout warn"><strong>The two dangerous "fixes" for P3006 are the ones the tool suggests nearby.</strong> <code>prisma migrate reset</code> drops and recreates the database — every row gone. <code>prisma db push</code> changes the schema without writing a migration, so the next <code>migrate deploy</code> or the next new database no longer matches. Both are banned against anything but a throw-away local database in this project's instructions, for these reasons.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the morning after a deploy, every <code>migrate deploy</code> prints <code>P3009</code> and an urgent fix cannot ship. Reproduce the state with Prisma on the lab database, get out of it without guessing, and prove the result. You need Node on your machine and the lab Postgres from Lesson 5.1 (published on <code>127.0.0.1:15432</code>).</p>
<ol>
<li><code>npm init -y &amp;&amp; npm i -D prisma@5.22.0</code> in a new folder; write a <code>schema.prisma</code> with <code>url = env("DATABASE_URL")</code>, and create databases <code>shop</code> and <code>shop_shadow</code> (<code>docker exec pg-thu psql -U postgres -c "create database shop"</code>, same for the shadow).</li>
<li>Migration 1 creates <code>don_hang(id serial primary key, ma text)</code>; <code>npx prisma migrate deploy</code>. Insert <code>'A','B','A'</code> with <code>psql</code>. Migration 2 is the three-statement file from this lesson; deploy it twice and save both error codes.</li>
<li>Look before touching anything: query <code>_prisma_migrations</code>, check whether <code>ghi_chu</code> and <code>nhat_ky</code> exist, find the duplicate.</li>
<li>Fix the data, <code>migrate resolve --rolled-back</code>, <code>migrate deploy</code>, then <code>migrate diff --from-migrations … --to-url … --shadow-database-url … --script</code>.</li>
</ol>
<p><strong>Done when:</strong> you saved <code>P3018</code> and <code>P3009</code>, you can say which statements of migration 2 had applied (none — and why), and the final diff prints only <code>-- This is an empty migration.</code></p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Half-applied migration</span><span class="v">Some statements ran, others did not; the database matches no version of the schema.</span></div>
  <div class="kv"><span class="k"><code>P3018</code></span><span class="v">Prisma: a migration just failed while being applied.</span></div>
  <div class="kv"><span class="k"><code>P3009</code></span><span class="v">Prisma: the ledger contains a failed migration, so nothing new will be applied.</span></div>
  <div class="kv"><span class="k"><code>P3006</code></span><span class="v">Prisma: the migration history cannot be replayed on the shadow database.</span></div>
  <div class="kv"><span class="k">Drift</span><span class="v">The real schema differs from what the migration history says it should be.</span></div>
  <div class="kv"><span class="k">Transactional DDL</span><span class="v">Schema changes that roll back with the transaction — PostgreSQL has it, most databases do not.</span></div>
  <div class="kv"><span class="k"><code>migrate resolve</code></span><span class="v">Edits the ledger only: <code>--applied</code> or <code>--rolled-back</code>; runs no SQL.</span></div>
  <div class="kv"><span class="k">Invalid index</span><span class="v">What a failed <code>CONCURRENTLY</code> build leaves: unused, still maintained, must be dropped.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A failed migration blocks every later deploy (<code>P3009</code>), including unrelated fixes — a schema problem becomes an outage.</li>
<li>Prisma on PostgreSQL rolls the whole file back (one implicit transaction); statement-by-statement tools leave it half-applied — find out which by looking, never by assuming.</li>
<li>Recovery order: stop, inspect each statement against the live schema, fix the cause (often data), resolve the ledger to match, then prove it with <code>migrate diff</code>.</li>
<li><code>resolve --applied</code> without inspecting turns every tool green and leaves the database missing objects that fail days later.</li>
<li><code>CREATE INDEX CONCURRENTLY</code> must be alone in its migration file, and a failed one leaves an invalid index to drop.</li>
<li>When <code>migrate dev</code> cannot replay history (<code>P3006</code>), hand-write the SQL from <code>migrate diff</code>, apply with <code>migrate deploy</code>, never edit the deployed file.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — transactional DDL</span><span class="lc-sub">postgresql.org/docs/current/sql-begin.html — the property that makes the clean-rollback measurement above possible, and which most other databases do not have.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — migrate resolve and the P3009 state</span><span class="lc-sub">prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing — the official recovery, including the warning about resolving before you have inspected.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_index and invalid indexes</span><span class="lc-sub">postgresql.org/docs/current/catalog-pg-index.html — <code>indisvalid</code>, and what a failed CONCURRENTLY build leaves behind.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Prisma ORM — the migrations table and migrate diff</span><span class="lc-sub">/courses/prisma-orm/learn${REF} — what each column of the ledger means, and how to read a drift diff.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Cái migration áp dụng NỬA CHỪNG</h2>
<p class="lead">Đây là cái trạng thái mà hướng dẫn của dự án cảnh báo bằng chữ in hoa. Một migration hỏng nửa chừng, bảng theo dõi ghi rằng nó đã bắt đầu và chưa xong, và MỌI lần deploy sau đó đều từ chối chạy. Bài này tái hiện nó một cách CÓ CHỦ Ý, để việc khôi phục là một QUYẾT ĐỊNH chứ không phải một phỏng đoán.</p>

<h3>Tạo ra cái trạng thái đó</h3>
${slide('dv-05', 19, 'P3018 rồi P3009: mọi deploy sau bị chặn')}
<p>Một migration ba câu lệnh mà câu thứ ba hỏng vì dữ liệu vốn đã có sẵn:</p>
<pre><code>create table don_hang(id serial primary key, ma text);
insert into don_hang(ma) values ('A'),('B'),('A');
alter table don_hang add constraint uq_ma unique (ma);   <span class="tok-comment">-- SE HONG: co 'A' trung</span></code></pre>
<div class="out">    ERROR:  could not create unique index "uq_ma"
    DETAIL:  Key (ma)=(A) is duplicated.

  --- migration hong. Trang thai con lai la gi? ---
    bang don_hang co ton tai khong: 1
    so dong da chen:                3
    rang buoc unique co khong:      0
    _migrations ghi gi:             m001 xong=false

    psql: ERROR:  relation "don_hang" already exists</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hai trên ba câu lệnh ĐÃ áp dụng</span><span class="v">Cái bảng tồn tại với ba dòng. Cái ràng buộc thì không. Cơ sở dữ liệu đang ở một hình dạng mà KHÔNG phiên bản lược đồ nào từng dự tính tới.</span></div>
  <div class="kv"><span class="k">Cuốn sổ ghi "đã bắt đầu, chưa xong"</span><span class="v"><code>xong=false</code>. Phần lớn công cụ migration coi đó là một cú DỪNG CỨNG: chúng sẽ không chạy migration kế tiếp, và cũng sẽ không chạy lại cái này, vì chúng KHÔNG BIẾT được bao nhiêu phần của nó đã xảy ra.</span></div>
  <div class="kv"><span class="k">Chạy lại thì hỏng ở câu lệnh SỐ MỘT</span><span class="v"><code>relation "don_hang" already exists</code>. Cách khôi phục hiển nhiên — "cứ chạy lại thôi" — hỏng ngay lập tức, và hỏng ở một lỗi KHÁC với lỗi ban đầu, thứ đẩy cuộc điều tra đi về một hướng vô ích.</span></div>
  <div class="kv"><span class="k">Và giờ MỌI lần deploy đều bị chặn</span><span class="v">Không chỉ cái migration này. Công cụ từ chối đi tiếp hoàn toàn, nên một bản vá khẩn chẳng liên quan gì cũng không ship được. Đó chính là thứ biến một vấn đề lược đồ thành một SỰ CỐ.</span></div>
</div>
<div class="callout warn"><strong>Kho mã này đã từng ở đây.</strong> Một migration hỏng trên một lần deploy production và để lại bảng theo dõi ở đúng cái tình trạng này — trạng thái <code>P3009</code>. Hướng dẫn viết ra sau đó nói: <strong>DỪNG, ĐỪNG tự động sửa</strong>. Đừng chạy <code>migrate resolve --rolled-back</code> hay <code>--applied</code> theo phản xạ, và đừng viết lại migration bằng <code>CREATE TABLE IF NOT EXISTS</code> để ép nó đi qua. Cả hai đều làm cái lỗi trước mắt biến mất và có thể để lược đồ mâu thuẫn VĨNH VIỄN với lịch sử migration, mà đó là một bài toán khó hơn hẳn cái bạn khởi đầu.</div>

<h3>Cùng cú hỏng đó qua chính Prisma: P3018, rồi P3009</h3>
<p>Phép đo ở trên chạy ba câu lệnh qua <code>psql</code>, vốn gửi TỪNG câu một. Tái hiện bằng Prisma 5.22 — đúng phiên bản dự án này dùng — vào PostgreSQL 16 của phòng thí nghiệm: migration thứ nhất tạo <code>don_hang</code>, "ứng dụng" chèn <code>'A'</code>, <code>'B'</code>, <code>'A'</code>, và migration thứ hai thêm một cột, một bảng và một ràng buộc <code>UNIQUE</code>:</p>
<pre><code class="language-sql">-- prisma/migrations/20260902000000_them_unique/migration.sql
ALTER TABLE "don_hang" ADD COLUMN "ghi_chu" TEXT;
CREATE TABLE "nhat_ky" ("id" SERIAL PRIMARY KEY, "noi" TEXT);
ALTER TABLE "don_hang" ADD CONSTRAINT "uq_ma" UNIQUE ("ma");</code></pre>
<div class="out">$ npx prisma migrate deploy
Applying migration &#96;20260902000000_them_unique&#96;
Error: P3018

A migration failed to apply. New migrations cannot be applied before the error is recovered from. …
Migration name: 20260902000000_them_unique
Database error code: 23505
Database error:
ERROR: could not create unique index "uq_ma"
DETAIL: Key (ma)=(A) is duplicated.

$ npx prisma migrate deploy
Error: P3009

migrate found failed migrations in the target database, new migrations will not be applied. …
The &#96;20260902000000_them_unique&#96; migration started at 2026-09-29 01:57:28.971662 UTC failed</div>
<div class="out">       migration_name       | xong_luc | buoc
----------------------------+----------+------
 20260901000000_init        | 02:15:37 |    1
 20260902000000_them_unique |          |    0</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>P3018</code> là chính cú hỏng</span><span class="v">In ra MỘT lần, bởi lần deploy chạy cái tệp hỏng, kèm lỗi SQL thật ở dưới. Chép nó lại ở đâu đó: lần deploy sau sẽ không cho bạn thấy nó nữa.</span></div>
  <div class="kv"><span class="k"><code>P3009</code> là cuốn sổ từ chối đi tiếp</span><span class="v">Mọi lần <code>migrate deploy</code> về sau đều in cái này — kể cả lần deploy một bản sửa gấp chẳng liên quan. Nguyên nhân là cái dòng có <code>finished_at</code> rỗng.</span></div>
  <div class="kv"><span class="k">CSDL thật sự đã ra sao — đo được</span><span class="v">Chẳng sao cả. Cột <code>ghi_chu</code> không có, bảng <code>nhat_ky</code> không có. Prisma gửi cả tệp trong MỘT yêu cầu, và PostgreSQL chạy một yêu cầu nhiều câu lệnh như một giao dịch ngầm, nên hai câu đầu lùi theo câu thứ ba. Lần chạy <code>psql</code> ở trên, từng câu một, để lại hai trên ba câu đã áp dụng. Bạn gặp kiểu <em>NÀO</em> thì tuỳ công cụ — và đó chính là lý do bước 1 dưới đây là "NHÌN", không phải "đoán".</span></div>
  <div class="kv"><span class="k">Sự cố thật của dự án này là hình dạng NGƯỢC LẠI</span><span class="v">Ngày 29/06, production có sáu migration mà đối tượng của chúng ĐÃ TỒN TẠI nhưng dòng sổ thì thiếu hoặc chưa xong — trôi dạt do những thao tác tay trước đó — nên <code>migrate deploy</code> hỏng với <code>P3009</code>/<code>P3018</code>. Cách sửa: kiểm TỪNG bảng, từng cột bằng <code>psql</code> trước, chỉ đánh dấu đúng sáu cái đó <code>--applied</code>, rồi mới để <code>migrate deploy</code> chạy cái migration thật sự mới duy nhất.</span></div>
</div>

<h3>Cách phòng: MỘT giao dịch</h3>
${slide('dv-05', 23, 'CONCURRENTLY phải đứng một mình một tệp; hỏng thì để lại chỉ mục INVALID')}
<p>Vẫn migration ấy, bọc trong <code>BEGIN</code>/<code>COMMIT</code>:</p>
<div class="out">════ CUNG migration do, boc trong BEGIN/COMMIT ════
    ERROR:  could not create unique index "uq_ma"
  --- trang thai sau khi hong ---
    bang don_hang co ton tai khong: 0
    → KHONG con dau vet nao. Chay lai duoc ngay sau khi sua du lieu.</div>
<div class="callout ok"><strong>Cùng cái lỗi, KHÔNG có đống đổ nát.</strong> PostgreSQL hỗ trợ DDL có giao dịch — <code>CREATE TABLE</code> và <code>ALTER TABLE</code> lùi lại được y như mọi câu lệnh khác. Cái bảng không tồn tại, mấy dòng kia chưa từng được chèn, và migration có thể sửa rồi chạy lại NGAY. Đây là một lợi thế THẬT so với MySQL, nơi phần lớn DDL tự động ghi nhận và cái trạng thái nửa chừng là KHÔNG TRÁNH ĐƯỢC.</div>
<div class="pitfall"><strong>Bẫy — KHÔNG phải thứ gì cũng nhét vào giao dịch được, và hai ngoại lệ lại đúng là thứ migration hay dùng.</strong> Đo thật:
<br>· <code>ERROR: CREATE INDEX CONCURRENTLY cannot run inside a transaction block</code>
<br>· <code>ERROR: CREATE DATABASE cannot run inside a transaction block</code>
<br>Nghĩa là chính cái câu lệnh được khuyên dùng ở Bài 5.3 để né khoá ghi lại là cái KHÔNG làm cho nguyên tử được. Hãy đặt nó vào một tệp migration RIÊNG, một mình, và làm cho tệp đó bất biến khi lặp lại — <code>CREATE INDEX CONCURRENTLY IF NOT EXISTS</code>, cộng thêm một phép kiểm cái chỉ mục <code>INVALID</code> mà một lần dựng concurrently hỏng để lại.</div>
<pre><code><span class="tok-comment">-- mot lan CREATE INDEX CONCURRENTLY hong de lai mot chi muc INVALID</span>
<span class="tok-comment">-- no KHONG duoc dung, va no VAN chiem cho. Tim va don:</span>
select indexrelid::regclass as ten
from pg_index where not indisvalid;

drop index concurrently if exists idx_hong;</code></pre>
<h3>Đo với Prisma: CONCURRENTLY phải đứng MỘT MÌNH một tệp</h3>
<p>Vì Prisma gửi một tệp migration như một giao dịch ngầm, một câu <code>CREATE INDEX CONCURRENTLY</code> đứng cạnh bất kỳ câu nào khác thì không chạy nổi:</p>
<div class="out"># migration.sql: ADD COLUMN "tao" + CREATE INDEX CONCURRENTLY "idx_tao"
Applying migration &#96;20260903000000_cic_kem&#96;
Error: P3018
ERROR: CREATE INDEX CONCURRENTLY cannot run inside a transaction block

# tệp mới CHỈ có một câu CREATE INDEX CONCURRENTLY
Applying migration &#96;20260903000000_cic_rieng&#96;
All migrations have been successfully applied.</div>
<p>Tệp thứ nhất còn để lại một <code>P3009</code> cho lần deploy sau, và cái cột nó định thêm thì không có (lại là giao dịch ngầm). Mỗi tệp một câu, kèm <code>IF NOT EXISTS</code>, và kiểm chỉ mục không hợp lệ còn sót trước mọi lần thử lại — đo trên bảng thí nghiệm, một lần <code>CREATE UNIQUE INDEX CONCURRENTLY</code> hỏng đã để lại đúng thứ đó:</p>
<div class="out">ERROR:  could not create unique index "uq_ten"
DETAIL:  Key (ten)=(moi) is duplicated.
   chi_muc   | indisvalid
-------------+------------
 nd5m_pkey   | t
 idx_email_a | t
 idx_email_b | t
 idx_email_c | t
 uq_ten      | f</div>


<h3>Thoát ra khỏi trạng thái kẹt</h3>
${slide('dv-05', 21, 'Thoát kẹt: DỪNG → soi → sửa → resolve → diff')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tìm ra CHÍNH XÁC nó đã đi được tới đâu</span><span class="lz-d">Đọc tệp migration từng câu lệnh một và đối chiếu từng cái với lược đồ đang sống — bảng có tồn tại không, cột có không, ràng buộc có không, chỉ mục có hợp lệ không. Đây là bước người ta bỏ qua, và nó là bước DUY NHẤT làm cho phần còn lại an toàn.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Quyết định: LÀM NỐT, hay HOÀN TÁC</span><span class="lz-d">Nếu phần lớn đã áp dụng và phần còn lại an toàn thì chạy nốt các câu lệnh còn lại bằng tay rồi đánh dấu migration là đã áp dụng. Nếu mới áp dụng được ít thì hoàn tác vài câu đó bằng tay rồi đánh dấu là đã lùi. Cách nào cũng được; ĐOÁN xem mình đang ở trạng thái nào thì không được.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Làm cho cuốn sổ khớp thực tế — MỘT CÁCH CÓ CHỦ Ý</span><span class="lz-d"><code>migrate resolve --applied</code> hay <code>--rolled-back</code> là công cụ ĐÚNG <em>SAU</em> bước 1 và 2, vì lúc đó bạn ĐÃ BIẾT cái nào là đúng. Cái chỉ dẫn cấm tự-động-gỡ là cấm chạy nó TRƯỚC khi bạn biết.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Kiểm lại bằng LƯỢC ĐỒ, đừng kiểm bằng cuốn sổ</span><span class="lz-d"><code>prisma migrate diff --from-migrations ./prisma/migrations --to-url "\$DATABASE_URL" --shadow-database-url "\$SHADOW_DATABASE_URL" --script</code> in ra khác biệt giữa thứ lịch sử NÓI và thứ cơ sở dữ liệu ĐANG LÀ. Kết quả chỉ có dòng <code>-- This is an empty migration.</code> nghĩa là hai bên đồng ý. Bất cứ thứ gì khác là trôi dạt mà bạn chưa xử lý xong. (Đã sửa 29/09/2026: với Prisma 5.22, phiên bản dự án này dùng, cờ <code>--to-database-url</code> không tồn tại — nó hỏng với <code>unknown or unexpected option</code> — và <code>--from-migrations</code> từ chối chạy nếu thiếu CSDL bóng: <code>You must pass the --shadow-database-url if you want to diff a migrations directory.</code> Trỏ URL bóng vào một CSDL nháp rỗng, KHÔNG BAO GIỜ trỏ vào production.)</span></div>
</div>
<div class="note-ct">Bước 4 là bước bắt được một cuộc khôi phục LÀM DỞ. Một cuốn sổ ghi "đã áp dụng" trong khi lược đồ thiếu một ràng buộc thì hôm nay deploy sạch sẽ và ba tuần nữa mới hỏng, khi một migration về sau giả định rằng cái ràng buộc đó tồn tại. Lệnh diff thì rẻ, nó không phá gì, và nó là phép kiểm MÁY MÓC duy nhất cho việc hai nửa có đồng ý với nhau không.</div>

<h3>Đo thật: năm bước, và con đường tắt trông giống hệt chúng</h3>
<p>Cuộc khôi phục, chạy trên CSDL thí nghiệm đang kẹt. Bước 2 tìm ra nguyên nhân bằng một câu truy vấn, dữ liệu được sửa CÓ CHỦ ĐÍCH, và chỉ sau đó mới đụng vào cuốn sổ:</p>
<div class="out">$ psql -c "select ma, count(*) from don_hang group by ma having count(*) &gt; 1"
 ma | count
----+-------
 A  |     2
$ psql -c "update don_hang set ma = 'A-3' where id = 3"
UPDATE 1
$ npx prisma migrate resolve --rolled-back 20260902000000_them_unique
Migration 20260902000000_them_unique marked as rolled back.
$ npx prisma migrate deploy
Applying migration &#96;20260902000000_them_unique&#96;
All migrations have been successfully applied.
$ npx prisma migrate diff --from-migrations prisma/migrations --to-url "$DATABASE_URL" \\
    --shadow-database-url "$SHADOW" --script
-- This is an empty migration.</div>
${slide('dv-05', 20, 'resolve --applied bừa: status xanh, CSDL thiếu 3 thứ')}
<p>Và con đường tắt, trên một bản sao thứ hai của cùng CSDL đang kẹt: bỏ qua bước nhìn, đánh dấu luôn là đã áp dụng.</p>
<div class="out">$ npx prisma migrate resolve --applied 20260902000000_them_unique
Migration 20260902000000_them_unique marked as applied.
$ npx prisma migrate deploy
No pending migrations to apply.
$ npx prisma migrate status
Database schema is up to date!
$ psql -c "select id, ma, ghi_chu from don_hang limit 1"
ERROR:  column "ghi_chu" does not exist
$ npx prisma migrate diff --from-migrations prisma/migrations --to-url "$DATABASE_URL" \\
    --shadow-database-url "$SHADOW" --script
-- DropIndex
DROP INDEX "uq_ma";

-- AlterTable
ALTER TABLE "don_hang" DROP COLUMN "ghi_chu";

-- DropTable
DROP TABLE "nhat_ky";</div>
<div class="pitfall co-tieu-de"><strong>Bẫy — <code>--applied</code> sửa cuốn sổ và KHÔNG chạy câu SQL nào.</strong> Mọi công cụ giờ đều xanh: <code>deploy</code> không còn gì để làm, <code>status</code> báo đã cập nhật. CSDL thì thiếu một cột, một bảng và một ràng buộc, và request đầu tiên cần tới một trong số đó sẽ hỏng — vài ngày sau, trông chẳng dính dáng gì tới lần deploy nào. Đọc output của <code>diff</code> như là "câu SQL biến lược đồ theo lịch sử thành lược đồ của CSDL thật": ở đây nó sẽ <em>XOÁ</em> ba thứ, nghĩa là CSDL đang THIẾU chúng. Luật trong chính hướng dẫn của dự án — dừng lại, đừng tự resolve — tồn tại vì đúng chuyện này.</div>
<table>
<tr><th>Lệnh</th><th>Đổi CSDL?</th><th>Đổi cuốn sổ?</th><th>Dùng khi</th></tr>
<tr><td><code>migrate deploy</code></td><td>có — chạy các tệp đang chờ</td><td>có</td><td>mọi lần deploy</td></tr>
<tr><td><code>migrate status</code></td><td>không</td><td>không</td><td>đối chiếu sổ với thư mục</td></tr>
<tr><td><code>migrate resolve --rolled-back X</code></td><td>không</td><td>đánh dấu X đã lùi, để nó chạy lại được</td><td>bạn đã kiểm và X KHÔNG để lại gì (hoặc bạn đã gỡ nó)</td></tr>
<tr><td><code>migrate resolve --applied X</code></td><td>không</td><td>đánh dấu X đã xong, nên nó không bao giờ chạy</td><td>bạn đã kiểm và MỌI THỨ trong X đều tồn tại (hoặc bạn đã làm nốt bằng tay)</td></tr>
<tr><td><code>migrate diff … --script</code></td><td>không</td><td>không</td><td>sau mọi lần resolve, để chứng minh hai bên khớp</td></tr>
</table>

<h3>Viết migration sao cho KHÔNG kẹt được</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Một thay đổi LOGIC cho mỗi tệp</span><span class="lz-lnote">Cái migration ba câu lệnh ở trên hỏng vì nó làm BA việc. Tách ra thành nhiều tệp thì cú hỏng đã cô lập được ở cái ràng buộc, với bảng và dữ liệu đã được ghi nhận và ghi sổ xong.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bọc trong giao dịch, trừ khi không bọc được</span><span class="lz-lnote">Phần lớn công cụ làm sẵn chuyện này; hãy KIỂM công cụ của bạn chứ đừng giả định. Và khi một câu lệnh không bọc được thì tệp đó không chứa thứ gì khác nữa.</span></div>
  <div class="lz-layer"><span class="lz-lname">Kiểm DỮ LIỆU trước khi thêm một ràng buộc</span><span class="lz-lnote">Cú hỏng đo được là một giá trị <code>'A'</code> trùng vốn đã tồn tại sẵn. Hãy chạy câu <code>select … group by … having count(*) &gt; 1</code> tương ứng trên production TRƯỚC. Một migration thêm ràng buộc KHÔNG BAO GIỜ nên là thứ phát hiện ra rằng dữ liệu của bạn không nhất quán.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chạy migration trên một BẢN SAO của production trước</span><span class="lz-lnote">Đừng chạy trên một cơ sở dữ liệu thử RỖNG. Cú hỏng ở trên chỉ tồn tại VÌ CÓ DỮ LIỆU — một cơ sở dữ liệu rỗng sẽ áp dụng migration đó hoàn hảo và chẳng nói cho bạn biết gì.</span></div>
</div>
<div class="callout warn"><strong>Dự án này hoàn toàn KHÔNG dùng được <code>prisma migrate dev</code>.</strong> Một migration đã deploy tạo một ràng buộc unique rồi tạo tiếp một chỉ mục thường TRÙNG TÊN, nên nó không bao giờ phát lại được trên cơ sở dữ liệu bóng — <code>P3006</code>, vĩnh viễn. Hướng dẫn chấp nhận điều đó: migration mới là SQL viết tay đặt dưới <code>prisma/migrations/&lt;timestamp&gt;_&lt;name&gt;/migration.sql</code> rồi áp bằng <code>migrate deploy</code>, lệnh không dùng cơ sở dữ liệu bóng. Cái migration kia KHÔNG sửa được vì nó đã deploy rồi. Đó là một ví dụ tốt cho cái luật rằng lịch sử migration trên thực tế là CHỈ-THÊM, bất kể công cụ tuyên bố gì.</div>
<h3>Tái hiện P3006, và quy trình migration viết tay</h3>
${slide('dv-05', 22, 'migrate dev hỏng vì shadow DB: viết SQL tay rồi migrate deploy')}
<p>Callout ở trên nói về migration <code>20260706130000_add_music_and_profile</code> của dự án này. Hai dòng gây chuyện của nó, chép nguyên văn vào một dự án thí nghiệm:</p>
<pre><code class="language-sql">ALTER TABLE "post_music" ADD CONSTRAINT "post_music_post_id_key" UNIQUE ("post_id");
CREATE INDEX "post_music_post_id_key" ON "post_music"("post_id");</code></pre>
<p>Một ràng buộc <code>UNIQUE</code> được hiện thực bằng một chỉ mục <em>MANG TÊN của ràng buộc</em>, nên dòng thứ hai xin một cái tên đã tồn tại. Trên production, migration đó được đánh dấu là đã áp dụng (đối tượng của nó được tạo và kiểm bằng tay), nên <code>migrate deploy</code> không bao giờ chạy lại nó. Còn <code>migrate dev</code> thì dựng lại TOÀN BỘ lịch sử trên một CSDL bóng rỗng mỗi lần chạy — và hỏng ở đó, mỗi lần:</p>
<div class="out">$ npx prisma migrate dev --name them_cot_thu
Error: P3006
Migration &#96;20260706130000_add_music_and_profile&#96; failed to apply cleanly to the shadow database.
Error:
ERROR: relation "post_music_post_id_key" already exists</div>
<p>Sửa tệp cũ thì "hết lỗi", và bị CẤM: tệp đó đã chạy trên production, và (như đã đo ở Bài 5.1) <code>migrate deploy</code> còn chẳng nhận ra chỗ sửa. Quy trình dự án dùng thay thế, đo trên bản sao thí nghiệm:</p>
<ol>
<li><strong>Để Prisma TÍNH câu SQL</strong> từ CSDL đang chạy tới tệp lược đồ đã sửa — không cần CSDL bóng:
<pre><code class="language-bash">npx prisma migrate diff --from-schema-datasource prisma/schema.prisma \\
  --to-schema-datamodel prisma/schema.prisma --script</code></pre>
<div class="out">-- AlterTable
ALTER TABLE "post_music" ADD COLUMN     "thu" TEXT;</div></li>
<li><strong>Lưu nó bằng tay</strong> thành <code>prisma/migrations/&lt;mốc giờ UTC&gt;_&lt;tên&gt;/migration.sql</code>, và <em>ĐỌC nó</em> — đây là chỗ bắt được một <code>DROP COLUMN</code> sinh ra từ cú đổi tên (Bài 5.2).</li>
<li><strong>Áp bằng <code>migrate deploy</code></strong>, thứ không bao giờ đụng tới CSDL bóng:
<div class="out">Applying migration &#96;20260929090000_them_cot_thu&#96;
All migrations have been successfully applied.</div></li>
<li><strong>Kiểm lại</strong> bằng cách chạy lại lệnh diff ở bước 1: <code>-- This is an empty migration.</code></li>
</ol>
<div class="callout warn"><strong>Hai cách "sửa" P3006 nguy hiểm nhất lại chính là những cách công cụ gợi ý ở gần đó.</strong> <code>prisma migrate reset</code> xoá rồi dựng lại CSDL — mất sạch mọi dòng. <code>prisma db push</code> đổi lược đồ mà không viết migration, nên lần <code>migrate deploy</code> tiếp theo hay CSDL mới tiếp theo sẽ không còn khớp. Hướng dẫn của dự án cấm cả hai với bất cứ thứ gì ngoài một CSDL nháp trên máy, vì đúng những lý do này.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> sáng hôm sau một lần deploy, mọi lệnh <code>migrate deploy</code> đều in <code>P3009</code> và một bản sửa gấp không đẩy lên được. Tái hiện trạng thái đó bằng Prisma trên CSDL thí nghiệm, thoát ra mà không đoán mò, và chứng minh kết quả. Bạn cần Node trên máy và Postgres thí nghiệm của Bài 5.1 (mở ở <code>127.0.0.1:15432</code>).</p>
<ol>
<li><code>npm init -y &amp;&amp; npm i -D prisma@5.22.0</code> trong một thư mục mới; viết <code>schema.prisma</code> với <code>url = env("DATABASE_URL")</code>, và tạo hai CSDL <code>shop</code> và <code>shop_shadow</code> (<code>docker exec pg-thu psql -U postgres -c "create database shop"</code>, tương tự cho CSDL bóng).</li>
<li>Migration 1 tạo <code>don_hang(id serial primary key, ma text)</code>; <code>npx prisma migrate deploy</code>. Chèn <code>'A','B','A'</code> bằng <code>psql</code>. Migration 2 là tệp ba câu lệnh của bài này; deploy nó hai lần và lưu lại cả hai mã lỗi.</li>
<li>Nhìn trước khi đụng vào bất cứ thứ gì: truy vấn <code>_prisma_migrations</code>, kiểm <code>ghi_chu</code> và <code>nhat_ky</code> có tồn tại không, tìm giá trị trùng.</li>
<li>Sửa dữ liệu, <code>migrate resolve --rolled-back</code>, <code>migrate deploy</code>, rồi <code>migrate diff --from-migrations … --to-url … --shadow-database-url … --script</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã lưu <code>P3018</code> và <code>P3009</code>, nói được câu lệnh nào của migration 2 đã áp dụng (không câu nào — và vì sao), và lệnh diff cuối chỉ in <code>-- This is an empty migration.</code></p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Half-applied migration (migration áp dụng nửa chừng)</span><span class="v">Vài câu lệnh đã chạy, vài câu thì chưa; CSDL không khớp phiên bản lược đồ nào.</span></div>
  <div class="kv"><span class="k"><code>P3018</code></span><span class="v">Prisma: một migration vừa hỏng trong lúc được áp dụng.</span></div>
  <div class="kv"><span class="k"><code>P3009</code></span><span class="v">Prisma: cuốn sổ có một migration hỏng, nên không gì mới được áp dụng.</span></div>
  <div class="kv"><span class="k"><code>P3006</code></span><span class="v">Prisma: lịch sử migration không dựng lại được trên CSDL bóng.</span></div>
  <div class="kv"><span class="k">Drift (trôi dạt lược đồ)</span><span class="v">Lược đồ thật khác với thứ lịch sử migration nói nó phải là.</span></div>
  <div class="kv"><span class="k">Transactional DDL (DDL có giao dịch)</span><span class="v">Thay đổi lược đồ lùi được cùng giao dịch — PostgreSQL có, phần lớn CSDL khác thì không.</span></div>
  <div class="kv"><span class="k"><code>migrate resolve</code> (gỡ trạng thái sổ)</span><span class="v">Chỉ sửa cuốn sổ: <code>--applied</code> hoặc <code>--rolled-back</code>; không chạy câu SQL nào.</span></div>
  <div class="kv"><span class="k">Invalid index (chỉ mục không hợp lệ)</span><span class="v">Thứ một lần dựng <code>CONCURRENTLY</code> hỏng để lại: không được dùng, vẫn phải cập nhật, phải xoá đi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một migration hỏng chặn mọi lần deploy sau (<code>P3009</code>), kể cả bản sửa không liên quan — một vấn đề lược đồ thành một sự cố.</li>
<li>Prisma trên PostgreSQL lùi cả tệp (một giao dịch ngầm); công cụ chạy từng câu thì để lại trạng thái nửa chừng — biết là kiểu nào bằng cách NHÌN, đừng bao giờ bằng cách đoán.</li>
<li>Thứ tự khôi phục: dừng, soi từng câu lệnh với lược đồ thật, sửa nguyên nhân (thường là dữ liệu), resolve cho sổ khớp, rồi chứng minh bằng <code>migrate diff</code>.</li>
<li><code>resolve --applied</code> mà không soi sẽ làm mọi công cụ xanh và để CSDL thiếu những thứ sẽ làm hỏng request vài ngày sau.</li>
<li><code>CREATE INDEX CONCURRENTLY</code> phải đứng một mình trong tệp migration, và một lần hỏng để lại một chỉ mục không hợp lệ cần xoá.</li>
<li>Khi <code>migrate dev</code> không dựng lại được lịch sử (<code>P3006</code>), viết SQL tay từ <code>migrate diff</code>, áp bằng <code>migrate deploy</code>, và không bao giờ sửa tệp đã deploy.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — DDL có giao dịch</span><span class="lc-sub">postgresql.org/docs/current/sql-begin.html — cái tính chất làm cho phép đo lùi-sạch ở trên khả thi, mà phần lớn cơ sở dữ liệu khác không có.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — migrate resolve và trạng thái P3009</span><span class="lc-sub">prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing — quy trình khôi phục chính thức, kèm lời cảnh báo về việc gỡ trạng thái TRƯỚC khi bạn đã soi kỹ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_index và chỉ mục không hợp lệ</span><span class="lc-sub">postgresql.org/docs/current/catalog-pg-index.html — <code>indisvalid</code>, và một lần dựng CONCURRENTLY hỏng để lại cái gì.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Prisma ORM — bảng migrations và lệnh migrate diff</span><span class="lc-sub">/courses/prisma-orm/learn${REF} — mỗi cột của cuốn sổ nghĩa là gì, và đọc một bản diff trôi dạt thế nào.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.5 ─────────────────────────── */
    {
      title: '5.5 — Backfills, and where the migration goes in the script|||5.5 — Lấp dữ liệu, và migration nằm ở đâu trong script',
      slug: 'deploy-5-5-lap-du-lieu-va-vi-tri',
      type: 'LESSON',
      description: 'Lấp 300.000 dòng một phát mất 1.218 ms; chia thành 30 lô mất 3.065 ms. Cách chậm hơn 2,5 lần lại là cách đúng — bài này đo vì sao, rồi ráp migration vào đúng chỗ trong script deploy ở Chương 3.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Backfills, and where the migration goes in the script</h2>
<p class="lead">Phase 2 of expand–contract copies data from the old column to the new one. On a small table that is one statement. On a real table it is the single most dangerous line in the migration, and the fix makes it slower on purpose.</p>

<h3>One statement against thirty, measured</h3>
${slide('dv-05', 24, 'Lấp một phát giữ khoá 3,8 s; theo lô lâu nhất 0,15 s')}
<p>300,000 rows to backfill:</p>
<div class="out">════ A) lap MOT PHAT ════
    1218 ms, mot giao dich duy nhat
    bang phinh len: 41 MB

════ B) lap theo LO 10.000 dong ════
    3065 ms, 30 lo
    → moi lo ~102 ms, moi cai la mot giao dich RIENG</div>
<div class="callout warn"><strong>Batching is two and a half times slower in total, and it is the correct choice.</strong> The number that matters is not 1,218 against 3,065 — it is <strong>1,218 against 102</strong>. The single statement holds row locks and an open transaction for its entire duration; the batched version holds them for a tenth of a second at a time, and between batches the database is completely free. Total time is what you pay; longest lock is what your users feel.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">A long transaction blocks more than you think</span><span class="v">It holds locks on every row it has touched, and it prevents <code>VACUUM</code> from cleaning up anywhere in the database — so a twenty-minute backfill degrades tables it never mentions.</span></div>
  <div class="kv"><span class="k">The table grew to 41 MB</span><span class="v">An <code>UPDATE</code> in PostgreSQL writes a new row version and marks the old one dead. Backfilling 300,000 rows doubled the live data. That space is reclaimed by <code>VACUUM</code>, eventually — not immediately, and not while a long transaction is open.</span></div>
  <div class="kv"><span class="k">A batch can be interrupted safely</span><span class="v">Kill the single statement at 90% and all of it rolls back. Kill the batched version and 90% is committed — restart it and it picks up where it stopped, because it selects rows that are still null.</span></div>
  <div class="kv"><span class="k">And it can be paused</span><span class="v">Add a <code>sleep</code> between batches and the backfill becomes something you can run during business hours. The single statement offers no such control.</span></div>
</div>
<pre><code><span class="tok-comment">-- mot lo: chon dong CHUA lap, khoa chung, cap nhat, tra ve so dong</span>
with c as (
  select id from bf
  where moi is null
  limit 10000
  for update skip locked          <span class="tok-comment">-- bo qua dong dang bi giao dich khac giu</span>
)
update bf set moi = cu
from c where bf.id = c.id
returning 1;</code></pre>
<div class="note-ct"><code>for update skip locked</code> is what makes the loop safe to run while the application is writing. Without it, a batch that hits a row locked by a user's transaction waits for that transaction — and the backfill stalls behind ordinary traffic. With it, the batch skips that row and picks it up on a later pass. The loop ends when a batch returns zero rows, which also makes it naturally resumable.</div>

<h3>Re-measured at a million rows, with traffic running</h3>
${slide('dv-05', 25, 'Vòng lặp lấp theo lô, chạy lại được — và cái bẫy psql -q')}
<p>The numbers above were measured with no one else using the table. Re-run on 29/09/2026 on <code>nd1m</code> (1,000,000 rows, 89 MB before the update), with the probe from Lesson 5.3 sending an update of one random row every 250 ms:</p>
<div class="out">══ UPDATE mot phat 1 trieu dong + request sua 1 dong ngau nhien ══
  migration: bat dau 2007 ms, xong 5839 ms (3832 ms) OK
  request: 56 cai · cham hon 500 ms: 5 · loi: 0 · trung binh 232 ms · lau nhat 3000 ms
══ lap theo lo (khoang id) + cung request ══
  [khoang] 51 lo · tong 5243 ms · lo dau 106 ms · lo lau nhat 147 ms · lo cuoi 26 ms
  request: 56 cai · cham hon 500 ms: 0 · loi: 0 · trung binh 43 ms · lau nhat 322 ms</div>
<ul>
<li><strong>Only the users who touched an already-updated row waited</strong> — five of them, one for 3 seconds — because an <code>UPDATE</code> holds row locks, not a table lock, until it commits. With batches no request waited more than a third of a second.</li>
<li><strong>The single update grew the table from 89 MB to 200 MB:</strong> a new version of each of the million rows, the old versions left for <code>VACUUM</code>.</li>
<li><strong>How you pick the batch matters.</strong> Two ways, same million rows, 51 batches of 20,000:</li>
</ul>
<table>
<tr><th>Batch selection</th><th>First batch</th><th>Last batch</th><th>Good for</th></tr>
<tr><td><code>where id &gt; $a and id &lt;= $a + 20000 and email_lo is null</code></td><td>106 ms</td><td>26 ms</td><td>one worker; walks the primary key, each batch reads only its range</td></tr>
<tr><td><code>where email_lo is null limit 20000 for update skip locked</code></td><td>121 ms</td><td>296 ms</td><td>several workers at once; but each batch re-scans past rows already filled, so it slows down (×2.4 here, worse on bigger tables)</td></tr>
</table>
<p>The script used for the first row, run as a separate job after the deploy:</p>
<pre><code class="language-bash">#!/bin/bash — lap-email.sh (chạy RIÊNG, sau deploy)
set -euo pipefail
export PGOPTIONS="-c lock_timeout=2s -c statement_timeout=30s"
a=0; MAX=$(psql -qAt -c "select max(id) from nd1m")
while [ "$a" -lt "$MAX" ]; do
  psql -qAt -c "update nd1m set email_lo = email
    where id &gt; $a and id &lt;= $a + 20000
      and email_lo is null"
  a=$((a + 20000))
  sleep 0.1
done</code></pre>
<div class="out">$ time bash lap-email.sh
real	0m9.938s
$ psql -qAt -c "select count(*) from nd1m where email_lo is null"
0</div>
<table>
<tr><th>psql option</th><th>Meaning</th><th>Why it is in the script</th></tr>
<tr><td><code>-c "…"</code></td><td>run this one command and exit</td><td>one batch = one command = one transaction</td></tr>
<tr><td><code>-q</code></td><td>quiet: no command tags</td><td>clean output — but see the trap below</td></tr>
<tr><td><code>-A</code> <code>-t</code></td><td>unaligned, tuples only</td><td><code>$(…)</code> gets a bare number, not a table</td></tr>
<tr><td><code>PGOPTIONS="-c k=v"</code></td><td>set a server setting for every session started</td><td>each batch gets <code>lock_timeout</code> and <code>statement_timeout</code></td></tr>
<tr><td><code>PGHOST</code> <code>PGUSER</code> + <code>~/.pgpass</code></td><td>where and as whom, and the password</td><td>no password on the command line or in <code>ps</code></td></tr>
</table>
<div class="pitfall co-tieu-de"><strong>Trap — <code>psql -q</code> hides <code>UPDATE 0</code>, so a loop waiting for it never ends.</strong> The first version of the batched loop measured for this lesson stopped when a batch printed <code>UPDATE 0</code>. With <code>-q</code> that tag is never printed, the output is empty, the condition is never true, and the loop ran for five minutes after the last row was filled, until it was killed. Loop over a key range as above, or count with <code>RETURNING</code> (<code>with u as (update … returning 1) select count(*) from u</code>) and test that number.</div>

<h3>Where the migration runs in the deploy</h3>
${slide('dv-05', 26, 'Migration nằm TRƯỚC bước tráo, và có trần thời gian')}
<pre><code><span class="tok-comment">#!/bin/bash — trao.sh, ban co migration</span>
set -euo pipefail
exec 9&gt;/var/lock/trao.lock; flock -w 30 9

<span class="tok-comment"># 0. MIGRATION TRUOC — va no phai AN TOAN voi ma CU (Bai 5.1)</span>
cd "\$BAN_MOI"
if ! timeout 300 npx prisma migrate deploy; then
  echo "migration HONG — khong trao, ma cu van dang chay" &gt;&amp;2
  exit 1                       <span class="tok-comment"># dung TRUOC khi doi bat cu thu gi</span>
fi

<span class="tok-comment"># 1..5. phan con lai y nhu Bai 3.5</span>
&lt;khoi dong ban moi&gt; &amp;&amp; &lt;cho san sang&gt; &amp;&amp; &lt;chuyen luu luong&gt; &amp;&amp; &lt;kiem&gt; &amp;&amp; &lt;dung ban cu&gt;</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Migration first, and it must fail loudly</span><span class="lz-d">If the migration fails, nothing has been swapped — the old version is still serving from the old schema, which is a consistent state. Exiting here is the cheapest possible failure.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">With a timeout on the whole thing</span><span class="lz-d"><code>timeout 300</code>. A migration waiting forever on a lock (Lesson 5.3) hangs the deploy, which holds the lock from Lesson 2.5, which blocks every other deploy. Bound it.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Backfills do not belong here</span><span class="lz-d">A thirty-minute backfill inside a deploy script is a thirty-minute deploy holding a lock. Run it as a separate job, after the deploy, at your own pace — it is idempotent and resumable, so it does not need to be part of an atomic sequence.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Run it once, not once per server</span><span class="lz-d">With several servers, every one running <code>migrate deploy</code> at the same time is a race. Most tools take an advisory lock so only one wins, but check yours — and a dedicated migration step in the pipeline is clearer than relying on that.</span></div>
</div>

<h3>The seed script problem</h3>
<div class="callout warn"><strong>A seed script is code that runs against the schema and is usually excluded from every type check.</strong> This project has the incident: renaming an enum value from <code>CODE</code> to <code>CODE_REVIEW</code> passed the entire pre-push checklist — <code>tsc --noEmit</code>, the frontend build, the migration — and broke the seed on production. The reason: <code>tsconfig.json</code> has <code>rootDir: "./src"</code>, so <code>prisma/**</code> could not be in its <code>include</code> and sat in <code>exclude</code> instead. Nothing type-checked it. And <code>seed.ts</code> carried its own hand-written copy of the enum union, so it type-checked <em>against itself</em> and agreed.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Never hand-copy a type that the schema generates</span><span class="lz-lnote">Import it: <code>import type { ContentType } from '@prisma/client'</code>. A hand-written union is a second source of truth that drifts silently, and the drift only appears at runtime.</span></div>
  <div class="lz-layer"><span class="lz-lname">Type-check the seed separately</span><span class="lz-lnote">A second config — <code>tsconfig.seed.json</code> — plus a script that runs it. This project added exactly that afterwards, because the main config structurally cannot cover both.</span></div>
  <div class="lz-layer"><span class="lz-lname">Run the seed as part of the schema checklist</span><span class="lz-lnote">Type-checking is not enough on its own: the failure was runtime behaviour. Actually running <code>prisma db seed</code> against a scratch database is the only check that catches it.</span></div>
  <div class="lz-layer"><span class="lz-lname">And treat the seed as production code</span><span class="lz-lnote">It writes to the database. It deserves the same review, the same type coverage and the same testing as anything in <code>src/</code> — it just does not look like it does, because it lives in a different directory.</span></div>
</div>
<div class="note-ct">The general lesson is broader than seeds: <em>a checklist only covers the files it can see</em>. Any directory excluded from the type checker, the linter or the test runner is a place where a schema change can hide. Worth spending ten minutes once on: list the <code>exclude</code> entries in every config and ask what checks those paths get instead.</div>
<h3>The seed that says OK: measured</h3>
${slide('dv-05', 27, 'Seed báo OK khi backend đã bị tráo — kiểm mã thoát')}
<p>A second seed incident in this project, of a different kind. On 20/09 and again on 22/09, another session swapped the backend container while a deploy was halfway through its seed steps. Eleven steps then printed <code>service "backend" is not running</code> — and each one still printed <code>[✅ OK] … complete</code>, and the deploy exited 0. Only a final check ("is production running the image we just swapped in?") complained, and it complained about the swap, not about the empty seeds. Reproduced in the lab with a container stopped halfway through three steps:</p>
<pre><code class="language-bash"># seed-sai.sh
buoc() {
  echo "→ $1"
  docker exec dv05-app sh -c "$2"
  echo "[✅ OK] $1 complete"
}
buoc "Seed khoa hoc"   "sleep 1; echo '  12 bai da ghi'"
( sleep 0.3; docker stop -t 0 dv05-app &gt;/dev/null ) &amp;   # phien KHAC trao de backend
buoc "Seed de thi"     "sleep 1; echo '  40 cau da ghi'"
buoc "Seed lo trinh"   "echo '  9 muc da ghi'"
wait
echo "Tong ket: khong buoc nao bao loi"</code></pre>
<div class="out">$ bash seed-sai.sh; echo "exit=$?"
→ Seed khoa hoc
  12 bai da ghi
[✅ OK] Seed khoa hoc complete
→ Seed de thi
[✅ OK] Seed de thi complete
→ Seed lo trinh
Error response from daemon: container 7087c7a57701ef152f4b61ec11a864896f785290b7625aecf225666b341e2ec5 is not running
[✅ OK] Seed lo trinh complete
Tong ket: khong buoc nao bao loi
exit=0</div>
<p>Look at "Seed de thi": the container was stopped while that step ran, <code>docker exec</code> returned non-zero without printing a word, and the step still claimed success. The fix is four lines — check the exit status before printing anything:</p>
<pre><code class="language-bash">buoc() {
  echo "→ $1"
  if ! docker exec dv05-app sh -c "$2"; then
    echo "[❌ HONG] $1 — dung toan bo loat seed" &gt;&amp;2; exit 1
  fi
  echo "[✅ OK] $1 complete"
}</code></pre>
<div class="out">$ bash seed-dung.sh; echo "exit=$?"
→ Seed khoa hoc
  12 bai da ghi
[✅ OK] Seed khoa hoc complete
→ Seed de thi
[❌ HONG] Seed de thi — dung toan bo loat seed
exit=1</div>
<div class="note-ct">How to read a deploy log after the fact: search for the <em>first</em> <code>not running</code> line. Every step before it really ran; every step after it ran against nothing, whatever it printed. The two-deploys-at-once story from Chapter 2 is the root cause; a lock on the server (<code>flock</code>) prevents the swap from happening mid-seed at all.</div>

<h3>Where a migration belongs in the deploy sequence</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Before the new code, if it only adds</span><span class="lz-lnote">A nullable column, a new table, a new index. Old code ignores what it does not know about, so both versions run happily side by side.</span></div>
  <div class="lz-layer"><span class="lz-lname">Never in the same step as a destructive change</span><span class="lz-lnote">Dropping a column while the old process is still reading it is an outage with a stack trace. Split it across two deploys: stop reading, then drop.</span></div>
  <div class="lz-layer"><span class="lz-lname">Backfill separately, in batches</span><span class="lz-lnote">One statement over a million rows takes a lock for its whole duration. A batched job takes longer in wall-clock and blocks nothing.</span></div>
  <div class="lz-layer"><span class="lz-lname">And never let the seed run on production by habit</span><span class="lz-lnote">A seed that upserts is a data change nobody reviewed. Keep it out of the deploy path and run it deliberately.</span></div>
</div>
<div class="pitfall"><strong>Trap — a backfill that runs inside the deploy and holds a lock while the new code starts.</strong> Putting <code>UPDATE … SET x = …</code> over a million rows in the deploy script means the migration step takes eleven minutes, holds a lock for all of it, and the health check times out — so the orchestrator kills the deploy halfway and you now have a partially backfilled table and a half-swapped release. The deploy log blames the health check. Ship the schema change in the deploy, run the backfill afterwards as its own batched job, and let the new code handle both the filled and the unfilled shape until it finishes.</div>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> phase 2 of your rename has shipped and <code>dia_chi_email</code> must be filled on a million-row table during the day, while the site is in use — and the deploy script's seed step must stop lying. Use the lab from Lesson 5.1.</p>
<ol>
<li>On the lab VPS create <code>nd1m</code> (Lesson 5.3's practice) and <code>alter table nd1m add column email_lo text</code>.</li>
<li>Save <code>lap-email.sh</code> from this lesson, run it with <code>time</code>, and check <code>select count(*) from nd1m where email_lo is null</code>.</li>
<li>Reset the column (<code>update nd1m set email_lo = null</code>) and interrupt the script with Ctrl-C halfway. Count the nulls, then run it again — it must finish the rest without redoing anything.</li>
<li>On your laptop, start <code>docker run -d --name lab-app ubuntu:24.04 sleep infinity</code>, copy <code>seed-sai.sh</code> (with <code>lab-app</code>), run it, then fix it as shown and run again.</li>
</ol>
<p><strong>Done when:</strong> the count is <code>0</code> after both runs, the interrupted run left a number of nulls that is a multiple of 20,000 (whole batches), and the fixed seed script exits <code>1</code> at the step whose container disappeared.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Batch</span><span class="v">A slice of rows updated in its own short transaction.</span></div>
  <div class="kv"><span class="k">Keyset / range batching</span><span class="v">Choosing each batch by a primary-key range, so no batch re-reads earlier rows.</span></div>
  <div class="kv"><span class="k"><code>FOR UPDATE SKIP LOCKED</code></span><span class="v">Take row locks, skipping rows someone else holds — lets several workers share one backfill.</span></div>
  <div class="kv"><span class="k">Dead tuple</span><span class="v">The old version of an updated row, kept until <code>VACUUM</code> removes it.</span></div>
  <div class="kv"><span class="k">Idempotent job</span><span class="v">Safe to run twice: the second run only does what the first did not.</span></div>
  <div class="kv"><span class="k">Seed</span><span class="v">A script that writes base data; production code, whatever directory it lives in.</span></div>
  <div class="kv"><span class="k">Exit status</span><span class="v">The number a command returns; 0 means success, and the only honest signal a script has.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A one-statement backfill of a million rows locked touched rows for 3.8 s and doubled the table; batches of 20,000 took longer in total and never made a request wait more than a third of a second.</li>
<li>Pick batches by key range; <code>limit … skip locked</code> is for several workers and slows down as the table fills.</li>
<li>Give every batch <code>lock_timeout</code> and <code>statement_timeout</code> (<code>PGOPTIONS</code>), and never stop a loop on output that <code>-q</code> hides.</li>
<li>Run the migration before the swap, with a time limit, and stop the deploy if it fails; run the backfill as its own job afterwards.</li>
<li>A seed step that ignores exit status reports success on a container that no longer exists — check <code>$?</code>, and read logs from the first <code>not running</code>.</li>
<li>Seeds are production code: type-check them, run them against a scratch database, and keep them out of the automatic deploy path.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — SELECT ... FOR UPDATE SKIP LOCKED</span><span class="lc-sub">postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE — the clause that lets a backfill run alongside live traffic without waiting on it.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — VACUUM and dead tuples</span><span class="lc-sub">postgresql.org/docs/current/routine-vacuuming.html — why an UPDATE grows the table, and why a long transaction stops the cleanup everywhere.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — migrate deploy in production</span><span class="lc-sub">prisma.io/docs/orm/prisma-migrate/workflows/production-and-testing — why <code>deploy</code> and not <code>dev</code>, and the advisory lock it takes.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — batching large updates</span><span class="lc-sub">/courses/postgresql/learn${REF} — the CTE-plus-limit pattern above, and how to choose a batch size for your own table.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Lấp dữ liệu, và migration nằm ở đâu trong script</h2>
<p class="lead">Giai đoạn 2 của mở-rộng–thu-hẹp chép dữ liệu từ cột cũ sang cột mới. Trên một bảng nhỏ thì đó là một câu lệnh. Trên một bảng THẬT thì nó là dòng NGUY HIỂM NHẤT trong cả migration, và cách sửa lại làm nó CHẬM ĐI một cách có chủ ý.</p>

<h3>Một câu lệnh đấu với ba mươi, đo thật</h3>
${slide('dv-05', 24, 'Lấp một phát giữ khoá 3,8 s; theo lô lâu nhất 0,15 s')}
<p>300.000 dòng cần lấp:</p>
<div class="out">════ A) lap MOT PHAT ════
    1218 ms, mot giao dich duy nhat
    bang phinh len: 41 MB

════ B) lap theo LO 10.000 dong ════
    3065 ms, 30 lo
    → moi lo ~102 ms, moi cai la mot giao dich RIENG</div>
<div class="callout warn"><strong>Chia lô CHẬM HƠN hai lần rưỡi về tổng thời gian, và nó là lựa chọn ĐÚNG.</strong> Con số quan trọng KHÔNG phải 1.218 so với 3.065 — mà là <strong>1.218 so với 102</strong>. Câu lệnh đơn giữ khoá trên từng dòng và giữ một giao dịch mở suốt cả quãng thời gian của nó; bản chia lô giữ chúng mỗi lần một phần mười giây, và GIỮA các lô thì cơ sở dữ liệu hoàn toàn rảnh. Tổng thời gian là thứ BẠN trả; khoá dài nhất là thứ NGƯỜI DÙNG cảm thấy.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Một giao dịch dài chặn nhiều hơn bạn tưởng</span><span class="v">Nó giữ khoá trên mọi dòng nó đã đụng tới, và nó NGĂN <code>VACUUM</code> dọn dẹp ở BẤT KỲ ĐÂU trong cơ sở dữ liệu — nên một cuộc lấp dữ liệu hai mươi phút làm xuống cấp cả những bảng nó chẳng hề nhắc tới.</span></div>
  <div class="kv"><span class="k">Cái bảng phình lên 41 MB</span><span class="v">Một lệnh <code>UPDATE</code> trong PostgreSQL ghi ra một PHIÊN BẢN DÒNG MỚI rồi đánh dấu cái cũ là chết. Lấp 300.000 dòng đã làm dữ liệu sống tăng gấp đôi. Chỗ đó được <code>VACUUM</code> thu hồi, RỒI SẼ — không phải ngay, và không phải trong lúc một giao dịch dài đang mở.</span></div>
  <div class="kv"><span class="k">Một lô có thể bị cắt ngang một cách AN TOÀN</span><span class="v">Giết câu lệnh đơn ở mốc 90% thì TOÀN BỘ lùi lại. Giết bản chia lô thì 90% ĐÃ ĐƯỢC GHI NHẬN — chạy lại thì nó tiếp tục từ chỗ dừng, vì nó chọn những dòng vẫn còn null.</span></div>
  <div class="kv"><span class="k">Và nó TẠM DỪNG được</span><span class="v">Thêm một lệnh <code>sleep</code> giữa các lô là cuộc lấp dữ liệu thành thứ bạn chạy được ngay trong giờ làm việc. Câu lệnh đơn không cho bạn khả năng kiểm soát nào như vậy.</span></div>
</div>
<pre><code><span class="tok-comment">-- mot lo: chon dong CHUA lap, khoa chung, cap nhat, tra ve so dong</span>
with c as (
  select id from bf
  where moi is null
  limit 10000
  for update skip locked          <span class="tok-comment">-- bo qua dong dang bi giao dich khac giu</span>
)
update bf set moi = cu
from c where bf.id = c.id
returning 1;</code></pre>
<div class="note-ct"><code>for update skip locked</code> là thứ làm cho vòng lặp an toàn khi chạy trong lúc ứng dụng đang ghi. Thiếu nó, một lô đụng phải một dòng đang bị giao dịch của người dùng khoá sẽ CHỜ cái giao dịch đó — và cuộc lấp dữ liệu nghẽn lại phía sau lưu lượng bình thường. Có nó, cái lô bỏ qua dòng ấy và nhặt lại ở lượt sau. Vòng lặp kết thúc khi một lô trả về không dòng nào, và điều đó cũng làm nó tự nhiên có thể chạy tiếp được.</div>

<h3>Đo lại ở một triệu dòng, khi đang có lưu lượng</h3>
${slide('dv-05', 25, 'Vòng lặp lấp theo lô, chạy lại được — và cái bẫy psql -q')}
<p>Các con số ở trên đo khi không ai khác dùng bảng. Chạy lại ngày 29/09/2026 trên <code>nd1m</code> (1.000.000 dòng, 89 MB trước khi cập nhật), với bộ dò của Bài 5.3 gửi một lệnh sửa MỘT dòng ngẫu nhiên mỗi 250 ms:</p>
<div class="out">══ UPDATE mot phat 1 trieu dong + request sua 1 dong ngau nhien ══
  migration: bat dau 2007 ms, xong 5839 ms (3832 ms) OK
  request: 56 cai · cham hon 500 ms: 5 · loi: 0 · trung binh 232 ms · lau nhat 3000 ms
══ lap theo lo (khoang id) + cung request ══
  [khoang] 51 lo · tong 5243 ms · lo dau 106 ms · lo lau nhat 147 ms · lo cuoi 26 ms
  request: 56 cai · cham hon 500 ms: 0 · loi: 0 · trung binh 43 ms · lau nhat 322 ms</div>
<ul>
<li><strong>Chỉ những người chạm vào một dòng ĐÃ được cập nhật mới phải chờ</strong> — năm người, một người chờ 3 giây — vì một lệnh <code>UPDATE</code> giữ khoá DÒNG, không phải khoá bảng, cho tới khi commit. Theo lô thì không request nào chờ quá một phần ba giây.</li>
<li><strong>Lệnh cập nhật một phát làm bảng phình từ 89 MB lên 200 MB:</strong> một phiên bản mới cho mỗi dòng trong một triệu dòng, phiên bản cũ để lại cho <code>VACUUM</code>.</li>
<li><strong>Cách chọn lô quan trọng.</strong> Hai cách, cùng một triệu dòng, 51 lô 20.000:</li>
</ul>
<table>
<tr><th>Cách chọn lô</th><th>Lô đầu</th><th>Lô cuối</th><th>Hợp với</th></tr>
<tr><td><code>where id &gt; $a and id &lt;= $a + 20000 and email_lo is null</code></td><td>106 ms</td><td>26 ms</td><td>một tiến trình; đi theo khoá chính, mỗi lô chỉ đọc khoảng của nó</td></tr>
<tr><td><code>where email_lo is null limit 20000 for update skip locked</code></td><td>121 ms</td><td>296 ms</td><td>nhiều tiến trình cùng lúc; nhưng mỗi lô phải lướt lại qua những dòng ĐÃ lấp, nên chậm dần (×2,4 ở đây, bảng lớn hơn thì tệ hơn)</td></tr>
</table>
<p>Script dùng cho hàng thứ nhất, chạy như một job RIÊNG sau khi deploy:</p>
<pre><code class="language-bash">#!/bin/bash — lap-email.sh (chạy RIÊNG, sau deploy)
set -euo pipefail
export PGOPTIONS="-c lock_timeout=2s -c statement_timeout=30s"
a=0; MAX=$(psql -qAt -c "select max(id) from nd1m")
while [ "$a" -lt "$MAX" ]; do
  psql -qAt -c "update nd1m set email_lo = email
    where id &gt; $a and id &lt;= $a + 20000
      and email_lo is null"
  a=$((a + 20000))
  sleep 0.1
done</code></pre>
<div class="out">$ time bash lap-email.sh
real	0m9.938s
$ psql -qAt -c "select count(*) from nd1m where email_lo is null"
0</div>
<table>
<tr><th>Tuỳ chọn psql</th><th>Nghĩa</th><th>Vì sao có trong script</th></tr>
<tr><td><code>-c "…"</code></td><td>chạy đúng một lệnh rồi thoát</td><td>một lô = một lệnh = một giao dịch</td></tr>
<tr><td><code>-q</code></td><td>im lặng: không in thẻ lệnh</td><td>output sạch — nhưng xem cái bẫy bên dưới</td></tr>
<tr><td><code>-A</code> <code>-t</code></td><td>không căn cột, chỉ in dữ liệu</td><td><code>$(…)</code> nhận một con số trần, không phải một cái bảng</td></tr>
<tr><td><code>PGOPTIONS="-c k=v"</code></td><td>đặt một thiết lập máy chủ cho mọi phiên được mở</td><td>mỗi lô đều có <code>lock_timeout</code> và <code>statement_timeout</code></td></tr>
<tr><td><code>PGHOST</code> <code>PGUSER</code> + <code>~/.pgpass</code></td><td>kết nối tới đâu, với tư cách ai, và mật khẩu</td><td>không lộ mật khẩu trên dòng lệnh hay trong <code>ps</code></td></tr>
</table>
<div class="pitfall co-tieu-de"><strong>Bẫy — <code>psql -q</code> giấu dòng <code>UPDATE 0</code>, nên một vòng lặp chờ dòng đó sẽ không bao giờ dừng.</strong> Phiên bản đầu tiên của vòng lặp theo lô được đo cho bài này dừng khi một lô in ra <code>UPDATE 0</code>. Có <code>-q</code> thì thẻ đó không bao giờ được in, output rỗng, điều kiện không bao giờ đúng, và vòng lặp chạy thêm năm phút sau khi dòng cuối cùng đã được lấp, cho tới khi bị giết. Hãy lặp theo khoảng khoá như ở trên, hoặc đếm bằng <code>RETURNING</code> (<code>with u as (update … returning 1) select count(*) from u</code>) rồi kiểm con số đó.</div>

<h3>Migration chạy ở đâu trong quy trình deploy</h3>
${slide('dv-05', 26, 'Migration nằm TRƯỚC bước tráo, và có trần thời gian')}
<pre><code><span class="tok-comment">#!/bin/bash — trao.sh, ban co migration</span>
set -euo pipefail
exec 9&gt;/var/lock/trao.lock; flock -w 30 9

<span class="tok-comment"># 0. MIGRATION TRUOC — va no phai AN TOAN voi ma CU (Bai 5.1)</span>
cd "\$BAN_MOI"
if ! timeout 300 npx prisma migrate deploy; then
  echo "migration HONG — khong trao, ma cu van dang chay" &gt;&amp;2
  exit 1                       <span class="tok-comment"># dung TRUOC khi doi bat cu thu gi</span>
fi

<span class="tok-comment"># 1..5. phan con lai y nhu Bai 3.5</span>
&lt;khoi dong ban moi&gt; &amp;&amp; &lt;cho san sang&gt; &amp;&amp; &lt;chuyen luu luong&gt; &amp;&amp; &lt;kiem&gt; &amp;&amp; &lt;dung ban cu&gt;</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Migration TRƯỚC, và nó phải hỏng một cách ỒN ÀO</span><span class="lz-d">Nếu migration hỏng thì chưa có gì bị tráo cả — bản cũ vẫn đang phục vụ trên lược đồ cũ, và đó là một trạng thái NHẤT QUÁN. Thoát ra ở đây là kiểu hỏng RẺ NHẤT có thể có.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Kèm một HẠN GIỜ cho toàn bộ việc đó</span><span class="lz-d"><code>timeout 300</code>. Một migration chờ vô hạn trên một cái khoá (Bài 5.3) sẽ treo lần deploy, mà lần deploy đang giữ cái khoá ở Bài 2.5, thứ chặn mọi lần deploy khác. Hãy chặn nó lại.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Lấp dữ liệu KHÔNG thuộc về chỗ này</span><span class="lz-d">Một cuộc lấp ba mươi phút nằm trong script deploy là một lần deploy ba mươi phút đang giữ một cái khoá. Hãy chạy nó như một job RIÊNG, sau khi deploy, theo nhịp của bạn — nó bất biến khi lặp lại và chạy tiếp được, nên nó KHÔNG cần là một phần của một chuỗi nguyên tử.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Chạy nó MỘT lần, không phải mỗi máy chủ một lần</span><span class="lz-d">Với nhiều máy chủ, việc máy nào cũng chạy <code>migrate deploy</code> cùng lúc là một cuộc đua. Phần lớn công cụ lấy một khoá tư vấn để chỉ một cái thắng, nhưng hãy KIỂM công cụ của bạn — và một bước migration riêng trong đường ống thì rõ ràng hơn là trông cậy vào chuyện đó.</span></div>
</div>

<h3>Vấn đề của script seed</h3>
<div class="callout warn"><strong>Một script seed là MÃ chạy trên lược đồ và thường bị loại khỏi MỌI phép kiểm kiểu.</strong> Dự án này có sự cố đó: đổi tên một giá trị enum từ <code>CODE</code> thành <code>CODE_REVIEW</code> qua sạch TOÀN BỘ danh mục kiểm trước khi push — <code>tsc --noEmit</code>, bản dựng frontend, cả migration — rồi làm vỡ seed TRÊN PRODUCTION. Lý do: <code>tsconfig.json</code> có <code>rootDir: "./src"</code>, nên <code>prisma/**</code> không thể nằm trong <code>include</code> của nó và rơi vào <code>exclude</code>. Chẳng có gì kiểm kiểu nó. Và <code>seed.ts</code> lại tự mang theo một bản chép tay của cái union enum, nên nó tự kiểm kiểu <em>VỚI CHÍNH NÓ</em> và tự đồng ý với mình.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">ĐỪNG BAO GIỜ chép tay một kiểu mà lược đồ sinh ra</span><span class="lz-lnote">Hãy import nó: <code>import type { ContentType } from '@prisma/client'</code>. Một union viết tay là một NGUỒN SỰ THẬT THỨ HAI, nó trôi dạt trong im lặng, và sự trôi dạt ấy chỉ lộ ra lúc CHẠY.</span></div>
  <div class="lz-layer"><span class="lz-lname">Kiểm kiểu cho seed RIÊNG</span><span class="lz-lnote">Một cấu hình thứ hai — <code>tsconfig.seed.json</code> — cộng một script chạy nó. Dự án này đã thêm đúng thứ đó sau sự cố, vì cấu hình chính về mặt cấu trúc KHÔNG phủ được cả hai.</span></div>
  <div class="lz-layer"><span class="lz-lname">CHẠY seed như một phần của danh mục kiểm lược đồ</span><span class="lz-lnote">Kiểm kiểu tự nó KHÔNG đủ: cú hỏng đó là hành vi LÚC CHẠY. Thật sự chạy <code>prisma db seed</code> trên một cơ sở dữ liệu nháp là phép kiểm DUY NHẤT bắt được nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Và hãy coi seed là mã PRODUCTION</span><span class="lz-lnote">Nó GHI vào cơ sở dữ liệu. Nó xứng đáng được review, được phủ kiểu và được kiểm thử y như mọi thứ trong <code>src/</code> — nó chỉ TRÔNG như không xứng đáng, vì nó nằm ở một thư mục khác.</span></div>
</div>
<div class="note-ct">Bài học tổng quát rộng hơn chuyện seed: <em>một danh mục kiểm chỉ phủ được những tệp nó NHÌN THẤY</em>. Bất kỳ thư mục nào bị loại khỏi bộ kiểm kiểu, bộ lint hay bộ chạy test đều là một chỗ mà một thay đổi lược đồ có thể ẩn nấp. Đáng bỏ mười phút làm một lần: liệt kê các mục <code>exclude</code> trong mọi tệp cấu hình rồi tự hỏi những đường dẫn đó được kiểm bằng gì thay thế.</div>
<h3>Bước seed báo OK: đo thật</h3>
${slide('dv-05', 27, 'Seed báo OK khi backend đã bị tráo — kiểm mã thoát')}
<p>Một sự cố seed thứ hai của dự án này, thuộc kiểu khác. Ngày 20/09 và lại ngày 22/09, một phiên làm việc khác tráo đè container backend đúng lúc một lần deploy đang chạy dở loạt bước seed. Mười một bước sau đó in <code>service "backend" is not running</code> — và bước nào cũng VẪN in <code>[✅ OK] … complete</code>, còn lần deploy thì thoát 0. Chỉ có một phép kiểm cuối ("production có đang chạy đúng cái ảnh vừa tráo không?") là kêu, và nó kêu về chuyện tráo đè, không kêu về những bước seed rỗng. Tái hiện trong phòng thí nghiệm bằng một container bị dừng giữa chừng ba bước:</p>
<pre><code class="language-bash"># seed-sai.sh
buoc() {
  echo "→ $1"
  docker exec dv05-app sh -c "$2"
  echo "[✅ OK] $1 complete"
}
buoc "Seed khoa hoc"   "sleep 1; echo '  12 bai da ghi'"
( sleep 0.3; docker stop -t 0 dv05-app &gt;/dev/null ) &amp;   # phien KHAC trao de backend
buoc "Seed de thi"     "sleep 1; echo '  40 cau da ghi'"
buoc "Seed lo trinh"   "echo '  9 muc da ghi'"
wait
echo "Tong ket: khong buoc nao bao loi"</code></pre>
<div class="out">$ bash seed-sai.sh; echo "exit=$?"
→ Seed khoa hoc
  12 bai da ghi
[✅ OK] Seed khoa hoc complete
→ Seed de thi
[✅ OK] Seed de thi complete
→ Seed lo trinh
Error response from daemon: container 7087c7a57701ef152f4b61ec11a864896f785290b7625aecf225666b341e2ec5 is not running
[✅ OK] Seed lo trinh complete
Tong ket: khong buoc nao bao loi
exit=0</div>
<p>Nhìn "Seed de thi": container bị dừng ĐÚNG lúc bước đó đang chạy, <code>docker exec</code> trả mã khác 0 mà không in một chữ nào, và bước đó vẫn nhận là thành công. Cách sửa là bốn dòng — kiểm mã thoát trước khi in bất cứ thứ gì:</p>
<pre><code class="language-bash">buoc() {
  echo "→ $1"
  if ! docker exec dv05-app sh -c "$2"; then
    echo "[❌ HONG] $1 — dung toan bo loat seed" &gt;&amp;2; exit 1
  fi
  echo "[✅ OK] $1 complete"
}</code></pre>
<div class="out">$ bash seed-dung.sh; echo "exit=$?"
→ Seed khoa hoc
  12 bai da ghi
[✅ OK] Seed khoa hoc complete
→ Seed de thi
[❌ HONG] Seed de thi — dung toan bo loat seed
exit=1</div>
<div class="note-ct">Cách đọc một log deploy sau sự việc: tìm dòng <code>not running</code> <em>ĐẦU TIÊN</em>. Mọi bước trước nó đã chạy thật; mọi bước sau nó chạy vào khoảng không, dù nó in ra gì đi nữa. Chuyện hai lần deploy chồng nhau ở Chương 2 là nguyên nhân gốc; một cái khoá trên máy chủ (<code>flock</code>) ngăn hẳn việc tráo xảy ra giữa lúc đang seed.</div>

<h3>Migration thuộc về chỗ nào trong trình tự deploy</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Trước mã mới, nếu nó chỉ THÊM</span><span class="lz-lnote">Một cột nhận null, một bảng mới, một chỉ mục mới. Mã cũ lờ đi thứ nó không biết, nên cả hai phiên bản chạy song song vui vẻ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đừng bao giờ cùng bước với một thay đổi phá huỷ</span><span class="lz-lnote">Xoá một cột trong lúc tiến trình cũ vẫn đang đọc nó là một cú gián đoạn kèm vệt stack. Hãy tách ra làm hai lần deploy: thôi đọc trước, rồi mới xoá.</span></div>
  <div class="lz-layer"><span class="lz-lname">Lấp dữ liệu riêng, theo từng lô</span><span class="lz-lnote">Một câu lệnh chạy trên một triệu dòng sẽ giữ khoá suốt cả thời gian đó. Một việc chạy theo lô thì lâu hơn theo đồng hồ mà chẳng chặn cái gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">Và đừng để seed chạy trên production theo thói quen</span><span class="lz-lnote">Một seed có upsert là một thay đổi dữ liệu chẳng ai duyệt. Hãy giữ nó ngoài đường deploy và chạy nó một cách có chủ đích.</span></div>
</div>
<div class="pitfall"><strong>Bẫy — một lần lấp dữ liệu chạy BÊN TRONG lần deploy và giữ khoá trong lúc mã mới đang khởi động.</strong> Đặt <code>UPDATE … SET x = …</code> trên một triệu dòng vào script deploy nghĩa là bước migration mất mười một phút, giữ khoá suốt ngần ấy, và phép kiểm sức khoẻ hết giờ — nên bộ điều phối giết lần deploy giữa chừng và giờ bạn có một cái bảng lấp dở cùng một bản phát hành tráo dở. Log deploy thì đổ lỗi cho phép kiểm sức khoẻ. Hãy ship phần đổi lược đồ trong lần deploy, chạy phần lấp dữ liệu sau đó như một công việc chạy theo lô riêng, và để mã mới xử lý được cả dáng đã lấp lẫn dáng chưa lấp cho tới khi nó xong.</div>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> giai đoạn 2 của cú đổi tên đã lên, và <code>dia_chi_email</code> phải được lấp trên một bảng một triệu dòng ngay giữa ban ngày, lúc website đang có người dùng — đồng thời bước seed của script deploy phải thôi nói dối. Dùng phòng thí nghiệm của Bài 5.1.</p>
<ol>
<li>Trên VPS thí nghiệm tạo <code>nd1m</code> (như phần thực hành của Bài 5.3) và <code>alter table nd1m add column email_lo text</code>.</li>
<li>Lưu <code>lap-email.sh</code> của bài này, chạy nó với <code>time</code>, rồi kiểm <code>select count(*) from nd1m where email_lo is null</code>.</li>
<li>Đặt lại cột (<code>update nd1m set email_lo = null</code>) rồi ngắt script bằng Ctrl-C giữa chừng. Đếm số ô rỗng, rồi chạy lại — nó phải làm nốt phần còn lại mà không làm lại gì.</li>
<li>Trên laptop, chạy <code>docker run -d --name lab-app ubuntu:24.04 sleep infinity</code>, chép <code>seed-sai.sh</code> (đổi tên thành <code>lab-app</code>), chạy nó, rồi sửa như trong bài và chạy lại.</li>
</ol>
<p><strong>Đạt khi:</strong> phép đếm ra <code>0</code> sau cả hai lần chạy, lần bị ngắt để lại số ô rỗng là bội số của 20.000 (trọn lô), và script seed đã sửa thoát <code>1</code> đúng ở bước mà container biến mất.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Batch (lô)</span><span class="v">Một lát dòng được cập nhật trong giao dịch ngắn của riêng nó.</span></div>
  <div class="kv"><span class="k">Keyset / range batching (chia lô theo khoảng khoá)</span><span class="v">Chọn mỗi lô bằng một khoảng khoá chính, để không lô nào đọc lại những dòng trước đó.</span></div>
  <div class="kv"><span class="k"><code>FOR UPDATE SKIP LOCKED</code> (khoá dòng, bỏ qua dòng đang bị giữ)</span><span class="v">Lấy khoá dòng và bỏ qua những dòng người khác đang giữ — cho nhiều tiến trình cùng chia một cuộc lấp dữ liệu.</span></div>
  <div class="kv"><span class="k">Dead tuple (phiên bản dòng chết)</span><span class="v">Bản cũ của một dòng đã được cập nhật, nằm lại tới khi <code>VACUUM</code> dọn.</span></div>
  <div class="kv"><span class="k">Idempotent job (việc chạy lại an toàn)</span><span class="v">Chạy hai lần vẫn an toàn: lần hai chỉ làm phần lần một chưa làm.</span></div>
  <div class="kv"><span class="k">Seed (dữ liệu gieo)</span><span class="v">Script ghi dữ liệu nền; là mã production, dù nó nằm ở thư mục nào.</span></div>
  <div class="kv"><span class="k">Exit status (mã thoát)</span><span class="v">Con số một lệnh trả về; 0 là thành công, và là tín hiệu trung thực duy nhất một script có.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lấp một triệu dòng bằng một câu lệnh giữ khoá các dòng đã chạm suốt 3,8 s và làm bảng phình gấp đôi; lô 20.000 dòng tốn tổng thời gian nhiều hơn nhưng không bao giờ bắt request chờ quá một phần ba giây.</li>
<li>Chọn lô theo khoảng khoá; <code>limit … skip locked</code> dành cho nhiều tiến trình và chậm dần khi bảng được lấp đầy.</li>
<li>Cho mỗi lô <code>lock_timeout</code> và <code>statement_timeout</code> (<code>PGOPTIONS</code>), và đừng bao giờ dừng vòng lặp dựa trên output mà <code>-q</code> giấu đi.</li>
<li>Chạy migration trước bước tráo, có giới hạn thời gian, và dừng deploy nếu nó hỏng; chạy việc lấp dữ liệu thành một job riêng ngay sau đó.</li>
<li>Một bước seed bỏ qua mã thoát sẽ báo thành công trên một container không còn tồn tại — kiểm <code>$?</code>, và đọc log từ dòng <code>not running</code> đầu tiên.</li>
<li>Seed là mã production: kiểm kiểu nó, chạy nó trên một CSDL nháp, và để nó ngoài đường deploy tự động.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — SELECT ... FOR UPDATE SKIP LOCKED</span><span class="lc-sub">postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE — mệnh đề cho phép một cuộc lấp dữ liệu chạy song song với lưu lượng thật mà không phải chờ nó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — VACUUM và tuple chết</span><span class="lc-sub">postgresql.org/docs/current/routine-vacuuming.html — vì sao một lệnh UPDATE làm bảng phình ra, và vì sao một giao dịch dài chặn việc dọn dẹp ở khắp nơi.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — migrate deploy trên production</span><span class="lc-sub">prisma.io/docs/orm/prisma-migrate/workflows/production-and-testing — vì sao là <code>deploy</code> chứ không phải <code>dev</code>, và cái khoá tư vấn mà nó lấy.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — chia lô cho các lệnh cập nhật lớn</span><span class="lc-sub">/courses/postgresql/learn${REF} — khuôn CTE-cộng-limit ở trên, và chọn cỡ lô cho chính bảng của bạn thế nào.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.6 ─────────────────────────── */
    {
      title: '5.6 — Quiz: the database|||5.6 — Quiz: cơ sở dữ liệu',
      slug: 'deploy-5-6-quiz',
      type: 'QUIZ',
      description: 'Mười câu tình huống: cú đổi tên cột làm mã cũ lỗi dù migration báo xanh, trigger đồng bộ bỏ sót lệnh sửa, Prisma sinh DROP + ADD cho một cú đổi tên, ADD COLUMN 0,7 ms và 8,1 s, đọc hàng đợi khoá trong pg_stat_activity, CREATE INDEX CONCURRENTLY, P3018 → P3009, resolve --applied mù, P3006 shadow DB và bước seed báo OK giả.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.6</span>
<h2>Quiz: the database</h2>
<p class="lead">Ten questions from the chapter where the better deploy makes the problem worse, and the slower backfill is the right one. Every output quoted in them was recorded on 29/09/2026 on PostgreSQL 16.14 and Prisma 5.22 in the lab.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain why a column rename that took 3 ms broke the old code for as long as the swap took.</li>
<li>I can write the four phases of expand–contract and a sync trigger that handles both INSERT and UPDATE.</li>
<li>I can tell which <code>ALTER TABLE</code> forms are instant and which rewrite the table, and why reads stop too.</li>
<li>I can read a lock queue from <code>pg_stat_activity</code> and <code>pg_blocking_pids</code>, and I start migrations with <code>lock_timeout</code>.</li>
<li>I can get out of <code>P3009</code> in five steps and prove it with <code>migrate diff</code> — without a blind <code>--applied</code>.</li>
<li>I can place a migration and a backfill in a deploy script so that a failure stops the deploy before the swap.</li>
</ul>
${slide('dv-05', 29, 'Bảng tra nhanh Chương 5')}

<div class="callout">
<p><strong>What this chapter established.</strong> Renaming a column succeeded in milliseconds and broke every request the old code was serving — and blue-green deploys make that <em>worse</em>, because their whole technique is running both versions at once (5.1). Expand–contract fixes it in four phases, measured: after phase 2 a row written by <em>old</em> code was immediately readable by <em>new</em> code, because a <code>BEFORE</code> trigger kept both columns in sync (5.2). On a 400,000-row table, <code>ADD COLUMN</code> took 53 ms, with a constant default 37 ms, and with <code>gen_random_uuid()</code> <strong>2,606 ms</strong> — forty-nine times slower because a volatile default rewrites every row; and during that rewrite, 5 of 60 writes hit their timeout and the batch took 2.2× longer (5.3). A three-statement migration whose third statement failed left the table existing, the rows inserted, the constraint absent, and the ledger saying <code>xong=false</code> — with a re-run failing at statement one; wrapped in a transaction, the identical failure left <em>no trace at all</em>, though <code>CREATE INDEX CONCURRENTLY</code> and <code>CREATE DATABASE</code> both refuse to run inside one (5.4). And backfilling 300,000 rows took 1,218 ms in one statement or 3,065 ms in thirty batches — slower in total, with the longest lock down from 1,218 ms to 102 ms (5.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.6</span>
<h2>Quiz: cơ sở dữ liệu</h2>
<p class="lead">Mười câu ra từ cái chương mà lần deploy TỐT HƠN lại làm vấn đề TỆ HƠN, và cách lấp dữ liệu CHẬM HƠN mới là cách đúng. Mọi output trích trong câu hỏi đều ghi ngày 29/09/2026 trên PostgreSQL 16.14 và Prisma 5.22 trong phòng thí nghiệm.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được vì sao một cú đổi tên cột chạy 3 ms lại làm mã cũ hỏng suốt thời gian tráo.</li>
<li>Tôi viết được bốn giai đoạn mở rộng–thu hẹp và một trigger đồng bộ xử lý được cả INSERT lẫn UPDATE.</li>
<li>Tôi phân biệt được dạng <code>ALTER TABLE</code> nào tức thì, dạng nào ghi lại cả bảng, và vì sao lệnh đọc cũng đứng.</li>
<li>Tôi đọc được hàng đợi khoá từ <code>pg_stat_activity</code> và <code>pg_blocking_pids</code>, và tôi mở đầu migration bằng <code>lock_timeout</code>.</li>
<li>Tôi thoát được <code>P3009</code> bằng năm bước và chứng minh bằng <code>migrate diff</code> — không dùng <code>--applied</code> mù.</li>
<li>Tôi đặt được migration và việc lấp dữ liệu vào script deploy sao cho hỏng thì dừng TRƯỚC bước tráo.</li>
</ul>
${slide('dv-05', 29, 'Bảng tra nhanh Chương 5')}

<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Đổi tên một cột thành công trong vài mili giây và làm vỡ MỌI request mà mã cũ đang phục vụ — và deploy xanh-lam làm chuyện đó <em>TỆ HƠN</em>, vì toàn bộ kỹ thuật của nó là chạy cả hai phiên bản cùng lúc (5.1). Mở-rộng–thu-hẹp sửa được bằng bốn giai đoạn, đo thật: sau giai đoạn 2, một dòng do mã <em>CŨ</em> ghi ra thì mã <em>MỚI</em> đọc được NGAY, vì một trigger <code>BEFORE</code> giữ hai cột đồng bộ (5.2). Trên một bảng 400.000 dòng, <code>ADD COLUMN</code> mất 53 ms, kèm mặc định hằng số 37 ms, và kèm <code>gen_random_uuid()</code> thì <strong>2.606 ms</strong> — chậm hơn bốn mươi chín lần vì mặc định biến thiên ghi lại MỌI dòng; và trong lúc ghi lại đó, 5 trên 60 lệnh ghi chạm hạn giờ còn cả lô thì mất gấp 2,2 lần (5.3). Một migration ba câu lệnh mà câu thứ ba hỏng đã để lại bảng TỒN TẠI, dòng ĐÃ CHÈN, ràng buộc KHÔNG CÓ, và cuốn sổ ghi <code>xong=false</code> — chạy lại thì hỏng ở câu lệnh SỐ MỘT; bọc trong một giao dịch thì đúng cú hỏng ấy KHÔNG để lại dấu vết nào, dù <code>CREATE INDEX CONCURRENTLY</code> và <code>CREATE DATABASE</code> đều TỪ CHỐI chạy bên trong giao dịch (5.4). Và lấp 300.000 dòng mất 1.218 ms nếu một câu lệnh hoặc 3.065 ms nếu ba mươi lô — chậm hơn về tổng, nhưng khoá dài nhất giảm từ 1.218 ms xuống 102 ms (5.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'A migration renames users.email to dia_chi_email. Its log says "Time: 3.381 ms" and exits 0, yet for the next two seconds the site logs ERROR: column "email" does not exist on every request, then recovers by itself. What happened?|||Một migration đổi tên users.email thành dia_chi_email. Log của nó in "Time: 3.381 ms" và thoát 0, vậy mà suốt hai giây sau đó website ghi ERROR: column "email" does not exist trên MỌI request, rồi tự hết. Chuyện gì đã xảy ra?',
            options: [
              'The rename was only half-applied and PostgreSQL finished it two seconds later|||Cú đổi tên mới áp dụng một nửa và PostgreSQL làm nốt hai giây sau',
              'Each connection caches the old schema, so the app must be restarted after every migration|||Mỗi kết nối nhớ đệm lược đồ cũ, nên phải khởi động lại app sau mọi migration',
              'The old code kept running between the migration commit and the swap, and it still asked for the old column|||Mã cũ vẫn chạy trong khoảng từ lúc migration được ghi nhận tới lúc tráo, và nó vẫn hỏi cột cũ',
              'The psql client on the server was older than PostgreSQL 16 and reported the wrong status|||Trình khách psql trên máy chủ cũ hơn PostgreSQL 16 nên báo sai trạng thái',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: The window runs from "migration committed" to "old code gone"; the migration’s own 3 ms is irrelevant. In the lab, 8 of 8 old-code requests failed between 1,240 and 3,001 ms and all new-code requests succeeded. A restart would only have hidden it by ending the old code — it is not a cache: the rename was complete and atomic, which is exactly why the old query fails.|||VI: Cửa sổ chạy từ "migration được ghi nhận" tới "mã cũ biến mất"; 3 ms của chính migration chẳng liên quan. Trong phòng thí nghiệm, 8/8 request của mã cũ hỏng từ 1.240 tới 3.001 ms và mọi request của mã mới đều ổn. Khởi động lại chỉ che nó đi bằng cách kết thúc mã cũ — đây không phải bộ nhớ đệm: cú đổi tên đã xong trọn và nguyên tử, và chính vì thế câu truy vấn cũ mới hỏng.',
          },
          {
            question: 'Phase 2 of a rename uses a BEFORE trigger that copies email into dia_chi_email only when dia_chi_email IS NULL (and vice versa). Old code runs UPDATE ... SET email = ’doi@x.com’; new code keeps showing the old address. Why?|||Giai đoạn 2 của một cú đổi tên dùng một trigger BEFORE chỉ chép email sang dia_chi_email khi dia_chi_email IS NULL (và ngược lại). Mã cũ chạy UPDATE ... SET email = ’doi@x.com’; mã mới cứ hiện địa chỉ cũ. Vì sao?',
            options: [
              'On UPDATE, NEW starts as a copy of the existing row, so dia_chi_email is not NULL and nothing is copied — compare NEW with OLD instead|||Với UPDATE, NEW khởi đầu là bản chép dòng đang có, nên dia_chi_email không NULL và chẳng gì được chép — phải so NEW với OLD',
              'BEFORE triggers cannot modify the row; the trigger must be AFTER UPDATE|||Trigger BEFORE không sửa được dòng; phải dùng AFTER UPDATE',
              'Row triggers do not fire on UPDATE unless declared FOR EACH STATEMENT|||Trigger theo dòng không chạy khi UPDATE trừ khi khai FOR EACH STATEMENT',
              'The backfill UPDATE has to be re-run after every write from the old code|||Phải chạy lại lệnh UPDATE lấp dữ liệu sau mỗi lần mã cũ ghi',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Measured: after the old code’s update the row read email=doi@x.com, dia_chi_email=nd1@x.com. The fix branches on TG_OP and uses IS DISTINCT FROM against OLD to see which column changed. AFTER is the tempting wrong answer: an AFTER trigger is too late to change the row being written — BEFORE is required for that.|||VI: Đo được: sau lệnh sửa của mã cũ, dòng đó có email=doi@x.com, dia_chi_email=nd1@x.com. Cách sửa rẽ nhánh theo TG_OP và dùng IS DISTINCT FROM so với OLD để biết cột nào vừa đổi. AFTER là đáp án sai hấp dẫn: trigger AFTER đã quá muộn để sửa dòng đang được ghi — muốn sửa thì bắt buộc là BEFORE.',
          },
          {
            question: 'You rename a field in schema.prisma by changing @map("thu") to @map("ghi_chu") and ask Prisma for the SQL. It prints ALTER TABLE "post_music" DROP COLUMN "thu", ADD COLUMN "ghi_chu" TEXT. What is the right move?|||Bạn đổi tên một trường trong schema.prisma bằng cách đổi @map("thu") thành @map("ghi_chu") rồi hỏi Prisma câu SQL. Nó in ALTER TABLE "post_music" DROP COLUMN "thu", ADD COLUMN "ghi_chu" TEXT. Nước đi đúng là gì?',
            options: [
              'Deploy it at night, when nobody is using the table|||Deploy nó vào ban đêm, khi không ai dùng bảng',
              'Use prisma db push instead, which renames in place|||Dùng prisma db push thay thế, vì nó đổi tên tại chỗ',
              'Deploy it and restore the column from last night’s backup afterwards|||Deploy nó rồi phục hồi cột từ bản sao lưu đêm qua',
              'Hand-write expand–contract: a migration adding ghi_chu plus a sync trigger and backfill, and a later one dropping thu|||Tự viết mở rộng–thu hẹp: một migration thêm ghi_chu kèm trigger đồng bộ và lấp dữ liệu, và một migration sau đó mới xoá thu',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: The diff tool sees one column vanish and another appear, so the generated file deletes the data — at night or not, the contents of thu are gone. With Prisma, phases 2 and 4 are migrations you write and read yourself. db push is the dangerous shortcut: it changes the schema without writing any migration, so history and databases stop matching.|||VI: Công cụ so khác biệt thấy một cột biến mất và một cột xuất hiện, nên tệp sinh ra xoá dữ liệu — đêm hay ngày thì nội dung của thu cũng mất. Với Prisma, giai đoạn 2 và 4 là những migration bạn tự viết và tự đọc. db push là lối tắt nguy hiểm: nó đổi lược đồ mà không viết migration nào, nên lịch sử và các CSDL thôi khớp nhau.',
          },
          {
            question: 'On a 5-million-row table, ADD COLUMN s text NOT NULL DEFAULT ’moi’ took 0.7 ms and ADD COLUMN ma uuid DEFAULT gen_random_uuid() took 8,106 ms. Why the difference?|||Trên một bảng 5 triệu dòng, ADD COLUMN s text NOT NULL DEFAULT ’moi’ mất 0,7 ms còn ADD COLUMN ma uuid DEFAULT gen_random_uuid() mất 8.106 ms. Vì sao chênh nhau?',
            options: [
              'NOT NULL columns are checked lazily, so the first one skipped validation|||Cột NOT NULL được kiểm lười, nên câu đầu bỏ qua bước kiểm',
              'A constant default is stored once in the catalogue and applied on read; a volatile function needs a value per row, so every row is rewritten|||Mặc định hằng số lưu một lần trong danh mục và áp lúc đọc; hàm biến thiên cần giá trị riêng mỗi dòng, nên mọi dòng bị ghi lại',
              'uuid values are 16 bytes and text values are smaller|||Giá trị uuid dài 16 byte còn text thì nhỏ hơn',
              'gen_random_uuid() needs the pgcrypto extension, which is slow|||gen_random_uuid() cần extension pgcrypto, vốn chậm',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Since PostgreSQL 11 a constant default is metadata only — no row is touched, so size does not matter (1.8 ms at one million rows, 0.7 ms at five). The volatile default scaled with the data (1,674 ms → 8,106 ms) and grew the table. Value size is the tempting distractor, but 16 bytes per row cannot explain four orders of magnitude; writing every row can.|||VI: Từ PostgreSQL 11, mặc định hằng số chỉ chạm siêu dữ liệu — không dòng nào bị đụng, nên cỡ bảng không quan trọng (1,8 ms ở một triệu dòng, 0,7 ms ở năm triệu). Mặc định biến thiên lớn theo dữ liệu (1.674 ms → 8.106 ms) và làm bảng phình. Cỡ giá trị là phương án gây nhiễu hấp dẫn, nhưng 16 byte mỗi dòng không giải thích nổi chênh lệch cả chục nghìn lần; ghi lại mọi dòng thì giải thích được.',
          },
          {
            question: 'During a deploy the site freezes. pg_stat_activity shows: pid 84 "begin; select count(*) from nd1m…" waiting on PgSleep, blocked by {}; pid 85 ALTER TABLE nd1m ADD COLUMN… waiting on Lock, blocked by {84}; pid 86 SELECT … WHERE id = 42 waiting on Lock, blocked by {85}. What is going on?|||Giữa lúc deploy, website đơ. pg_stat_activity cho thấy: pid 84 "begin; select count(*) from nd1m…" chờ PgSleep, bị chặn bởi {}; pid 85 ALTER TABLE nd1m ADD COLUMN… chờ Lock, bị chặn bởi {84}; pid 86 SELECT … WHERE id = 42 chờ Lock, bị chặn bởi {85}. Chuyện gì đang xảy ra?',
            options: [
              'A long transaction (84) blocks the migration’s exclusive lock request, and every new query queues behind that request; lock_timeout on the migration would have let it fail after seconds|||Một giao dịch dài (84) chặn lời xin khoá độc quyền của migration, và mọi truy vấn mới xếp hàng sau lời xin đó; lock_timeout trên migration lẽ ra đã cho nó hỏng sau vài giây',
              'The SELECT in 86 conflicts with the report in 84 — two readers cannot share a table|||Câu SELECT ở 86 xung đột với báo cáo ở 84 — hai lệnh đọc không dùng chung một bảng được',
              'The migration is slow because ADD COLUMN rewrites the table; wait for it|||Migration chậm vì ADD COLUMN ghi lại cả bảng; cứ chờ nó',
              'The connection pool is exhausted; raise max_connections|||Bể kết nối đã cạn; tăng max_connections',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Follow pg_blocking_pids to the pid with an empty list — 84, not the migration. 86 wants AccessShareLock, which is compatible with 84’s; it waits only because it is queued behind 85’s AccessExclusiveLock request (granted=f in pg_locks). The ADD COLUMN had not even started: it was a metadata-only one. Measured: with lock_timeout=2s the migration failed at 3,048 ms and the request finished in the same millisecond instead of at 12,071 ms.|||VI: Lần theo pg_blocking_pids tới pid có danh sách rỗng — là 84, không phải migration. 86 muốn AccessShareLock, tương thích với khoá của 84; nó chờ chỉ vì xếp hàng sau lời xin AccessExclusiveLock của 85 (granted=f trong pg_locks). Câu ADD COLUMN còn chưa kịp bắt đầu: nó thuộc loại chỉ chạm siêu dữ liệu. Đo được: với lock_timeout=2s migration hỏng ở 3.048 ms và request xong trong đúng mili giây đó thay vì ở 12.071 ms.',
          },
          {
            question: 'Adding an index to a 5-million-row table with CREATE INDEX made 20 of 56 write requests take over half a second (longest 5.6 s); reads were fine. What should the migration use, and where?|||Thêm một chỉ mục vào bảng 5 triệu dòng bằng CREATE INDEX làm 20 trên 56 request ghi mất hơn nửa giây (lâu nhất 5,6 s); lệnh đọc thì ổn. Migration nên dùng gì, và đặt ở đâu?',
            options: [
              'CREATE INDEX wrapped in BEGIN/COMMIT so it is atomic|||CREATE INDEX bọc trong BEGIN/COMMIT cho nguyên tử',
              'CREATE INDEX with statement_timeout = ’1s’ so writes never wait long|||CREATE INDEX với statement_timeout = ’1s’ để lệnh ghi không bao giờ chờ lâu',
              'CREATE INDEX CONCURRENTLY, alone in its own migration file, with IF NOT EXISTS and a check for an invalid index before retrying|||CREATE INDEX CONCURRENTLY, một mình trong tệp migration riêng, kèm IF NOT EXISTS và kiểm chỉ mục không hợp lệ trước khi thử lại',
              'CREATE INDEX run in the evening, since SHARE locks do not affect users|||CREATE INDEX chạy vào buổi tối, vì khoá SHARE không ảnh hưởng người dùng',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Plain CREATE INDEX takes SHARE, which blocks writes for the whole build; CONCURRENTLY takes SHARE UPDATE EXCLUSIVE — no write waited more than 204 ms. It cannot run in a transaction, and Prisma sends a file as one implicit transaction, so next to any other statement it fails with P3018 "cannot run inside a transaction block". A 1 s statement_timeout would just cancel the index build.|||VI: CREATE INDEX thường lấy SHARE, chặn ghi suốt thời gian dựng; CONCURRENTLY lấy SHARE UPDATE EXCLUSIVE — không lệnh ghi nào chờ quá 204 ms. Nó không chạy được trong giao dịch, mà Prisma gửi một tệp như một giao dịch ngầm, nên đứng cạnh bất kỳ câu nào khác là hỏng với P3018 "cannot run inside a transaction block". statement_timeout 1 s thì chỉ huỷ luôn việc dựng chỉ mục.',
          },
          {
            question: 'Yesterday’s deploy printed P3018 (duplicate key while adding a UNIQUE constraint). Today every prisma migrate deploy prints P3009 and an urgent fix cannot ship. What is the right FIRST move?|||Lần deploy hôm qua in P3018 (trùng khoá khi thêm ràng buộc UNIQUE). Hôm nay mọi lệnh prisma migrate deploy đều in P3009 và một bản sửa gấp không đẩy lên được. Nước đi ĐẦU TIÊN đúng là gì?',
            options: [
              'Run prisma migrate resolve --applied on the failed migration so deploys continue|||Chạy prisma migrate resolve --applied cho migration hỏng để deploy chạy tiếp',
              'Delete the failed row from _prisma_migrations by hand|||Tự tay xoá dòng hỏng khỏi _prisma_migrations',
              'Rewrite the migration with IF NOT EXISTS everywhere and deploy again|||Viết lại migration với IF NOT EXISTS ở mọi chỗ rồi deploy lại',
              'Stop and inspect: which of its statements exist in the live schema, and which data caused the failure|||Dừng lại và soi: câu lệnh nào của nó đã có trong lược đồ thật, và dữ liệu nào gây ra lỗi',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: resolve only edits the ledger; which flag is right depends on what actually applied, and you only know that by looking. Here, measured with Prisma 5.22, nothing had applied (one implicit transaction), and the cause was the duplicate "A" — fix the data, resolve --rolled-back, deploy, then migrate diff. --applied is the tempting answer and the one the project’s instructions forbid doing blindly.|||VI: resolve chỉ sửa cuốn sổ; cờ nào đúng tuỳ vào thứ thật sự đã áp dụng, và chỉ biết được bằng cách nhìn. Ở đây, đo bằng Prisma 5.22, chẳng câu nào đã áp dụng (một giao dịch ngầm), và nguyên nhân là giá trị "A" trùng — sửa dữ liệu, resolve --rolled-back, deploy, rồi migrate diff. --applied là đáp án hấp dẫn và là thứ hướng dẫn của dự án cấm làm mù.',
          },
          {
            question: 'After prisma migrate resolve --applied, migrate deploy says "No pending migrations to apply." and migrate status says "Database schema is up to date!" — but the app fails with column "ghi_chu" does not exist. How would you have caught this?|||Sau prisma migrate resolve --applied, migrate deploy báo "No pending migrations to apply." và migrate status báo "Database schema is up to date!" — nhưng app hỏng với column "ghi_chu" does not exist. Lẽ ra bắt được chuyện này bằng cách nào?',
            options: [
              'migrate status with --verbose shows the missing column|||migrate status với --verbose sẽ chỉ ra cột bị thiếu',
              'migrate diff --from-migrations … --to-url "$DATABASE_URL" --shadow-database-url … --script, which printed DROP COLUMN "ghi_chu" and two more lines — the database lacked them|||migrate diff --from-migrations … --to-url "$DATABASE_URL" --shadow-database-url … --script, lệnh in ra DROP COLUMN "ghi_chu" và hai dòng nữa — tức CSDL đang thiếu chúng',
              'Running migrate deploy a second time re-applies the migration|||Chạy migrate deploy lần hai sẽ áp lại migration',
              'The ledger’s applied_steps_count shows how many statements really ran|||Cột applied_steps_count trong sổ cho biết bao nhiêu câu thật sự đã chạy',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: --applied runs no SQL, so every ledger-based tool turns green. Only a comparison between the history and the real schema shows the gap: the diff printed DROP INDEX "uq_ma", DROP COLUMN "ghi_chu", DROP TABLE "nhat_ky" — the SQL that would turn the history’s schema into the real one, i.e. what is missing. A second deploy does nothing: the ledger says done. (With Prisma 5.22 --from-migrations needs --shadow-database-url, and --to-database-url does not exist.)|||VI: --applied không chạy câu SQL nào, nên mọi công cụ dựa trên sổ đều xanh. Chỉ phép so giữa lịch sử và lược đồ thật mới thấy chỗ hổng: lệnh diff in DROP INDEX "uq_ma", DROP COLUMN "ghi_chu", DROP TABLE "nhat_ky" — câu SQL biến lược đồ theo lịch sử thành lược đồ thật, tức là những gì đang THIẾU. Deploy lần hai chẳng làm gì: sổ đã ghi xong. (Với Prisma 5.22, --from-migrations cần --shadow-database-url, và cờ --to-database-url không tồn tại.)',
          },
          {
            question: 'npx prisma migrate dev fails with P3006: migration 20260706130000_add_music_and_profile failed to apply cleanly to the shadow database — relation "post_music_post_id_key" already exists. That migration is already on production. What do you do to add a new column?|||npx prisma migrate dev hỏng với P3006: migration 20260706130000_add_music_and_profile failed to apply cleanly to the shadow database — relation "post_music_post_id_key" already exists. Migration đó đã có trên production. Bạn làm gì để thêm một cột mới?',
            options: [
              'Generate the SQL with migrate diff --from-schema-datasource … --to-schema-datamodel … --script, save it as a new migration folder by hand, apply with migrate deploy, verify with the same diff|||Sinh câu SQL bằng migrate diff --from-schema-datasource … --to-schema-datamodel … --script, tự lưu thành một thư mục migration mới, áp bằng migrate deploy, kiểm lại bằng chính lệnh diff đó',
              'Delete the duplicate CREATE INDEX line from the old migration file so it replays|||Xoá dòng CREATE INDEX trùng khỏi tệp migration cũ để nó dựng lại được',
              'Run prisma migrate reset, then migrate dev again|||Chạy prisma migrate reset, rồi migrate dev lại',
              'Run prisma db push against production|||Chạy prisma db push vào production',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: A UNIQUE constraint creates an index with its own name, so the next line can never run on an empty shadow database; migrate deploy never uses a shadow database, so hand-written SQL plus deploy works (measured: "All migrations have been successfully applied", then "-- This is an empty migration."). Editing the old file is forbidden — it ran on production, and migrate deploy does not even compare checksums, so the edit would silently split production from every new database. reset wipes data; db push bypasses history.|||VI: Ràng buộc UNIQUE tạo một chỉ mục mang chính tên nó, nên dòng kế tiếp không bao giờ chạy được trên CSDL bóng rỗng; migrate deploy không bao giờ dùng CSDL bóng, nên SQL viết tay cộng deploy là chạy (đo được: "All migrations have been successfully applied", rồi "-- This is an empty migration."). Sửa tệp cũ là bị cấm — nó đã chạy trên production, và migrate deploy còn không so checksum, nên chỗ sửa sẽ lặng lẽ tách production khỏi mọi CSDL mới. reset xoá sạch dữ liệu; db push đi vòng qua lịch sử.',
          },
          {
            question: 'A deploy’s seed section prints "Error response from daemon: container … is not running" and then "[✅ OK] Seed lo trinh complete", and the deploy exits 0. What is the root cause in the script?|||Phần seed của một lần deploy in "Error response from daemon: container … is not running" rồi "[✅ OK] Seed lo trinh complete", và deploy thoát 0. Nguyên nhân gốc trong script là gì?',
            options: [
              'docker exec buffers its output, so the error line is printed late|||docker exec đệm output, nên dòng lỗi bị in muộn',
              'Seeds are idempotent, so a missed run does not matter|||Seed chạy lại an toàn, nên bỏ lỡ một lần cũng chẳng sao',
              'Each step prints OK without checking docker exec’s exit status; wrap it in if ! …; then exit 1 — and prevent the concurrent swap with a lock|||Mỗi bước in OK mà không kiểm mã thoát của docker exec; bọc nó trong if ! …; then exit 1 — và ngăn cú tráo chồng bằng một cái khoá',
              'The container needs a longer stop timeout (docker stop -t 30)|||Container cần thời gian dừng dài hơn (docker stop -t 30)',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured: when the container was stopped mid-step, docker exec returned non-zero without printing anything, and the step still said OK; the fixed function stopped at that step with exit=1. The output order is not the problem, and "idempotent" does not help a step that never ran. In this project, 11 seed steps ran empty on 20/09 while printing OK — read such logs from the first "not running" line.|||VI: Đo được: khi container bị dừng giữa một bước, docker exec trả mã khác 0 mà không in gì, và bước đó vẫn báo OK; hàm đã sửa dừng đúng ở bước đó với exit=1. Thứ tự output không phải vấn đề, và "chạy lại an toàn" chẳng giúp gì cho một bước chưa hề chạy. Ở dự án này, ngày 20/09 có 11 bước seed chạy rỗng mà vẫn in OK — đọc những log như thế từ dòng "not running" đầu tiên.',
          },
        ],
      },
    },
  ],
};
