/**
 * Deploy lên VPS — Chương 14 (MỚI, 29/09/2026): Nhiều môi trường, và vượt khỏi một máy chủ.
 * 14.0 slide (deck dv-14, 31 slide) · 14.1 dev/staging/production và preview · 14.2 hai máy sau cân bằng tải ·
 * 14.3 chọn nền tảng: VPS, PaaS, serverless, Kubernetes · 14.4 chi phí và chuyển sang VPS mới · 14.5 quiz 10 câu.
 * Không dạy lại: tráo xanh/lam và dừng êm (→ Ch3), cấu hình build-time/run-time (→ Ch4), TTL và DNS (→ Ch12),
 * Kubernetes (→ /courses/kubernetes), Redis (→ /courses/redis), replica Postgres (→ /courses/postgresql).
 * MỌI lệnh và output MỚI chạy thật 29/09/2026: Docker Desktop trên Mac M1 (ảnh dv14-app Python 3.12, dv14-fe
 * nginx 1.27, Postgres 16, Redis 7); "VPS thí nghiệm" = container ubuntu:24.04 có sshd (ảnh tự build dv14-img):
 * dv14-lb (nginx 1.24.0 + HAProxy 2.8.16), dv14-vps1/2, dv14-old/new (Postgres 16, rsync), dv14-dns (bind9) +
 * dv14-res (unbound); độ trễ tới trung tâm dữ liệu đo từ máy Fedora ở nhà. Giá: trang giá chính thức, đọc 29/09/2026.
 * File này SINH từ nguồn thô bằng generator (thoát ký tự tự động). LUẬT vẫn như mọi chương: backtick → &#96;;
 * ${ → \${; < > & trong code → &lt; &gt; &amp;; gạch chéo ngược viết đôi.
 */

import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';

export default {
  title: "Chapter 14 — Environments, and growing beyond one server|||Chương 14 — Nhiều môi trường, và vượt khỏi một máy chủ",
  description: "Một ảnh chạy ở ba nơi với ba bộ cấu hình, hai máy đứng sau một bộ cân bằng tải, bốn loại nền tảng với giá thật, và một lần chuyển sang VPS mới không mất một lịch hẹn nào. Chương này dựng lại từng việc trên VPS thí nghiệm và đo nó.",
  lessons: [
    /* ─────────────────────────── 14.0 ─────────────────────────── */
    {
      title: "14.0 — Chapter 14 slides: environments and more than one server, in pictures|||14.0 — Slide Chương 14: nhiều môi trường và nhiều máy, bằng hình",
      slug: "deploy-14-0-slides",
      type: "DOCUMENT",
      isFreePreview: true,
      description: "Bộ 31 slide của Chương 14: một ảnh nhiều env, cấu hình nướng vào ảnh, dữ liệu ẩn danh, preview theo PR, feature flag, nginx và HAProxy trước hai máy, trạng thái ra khỏi máy, rolling và canary, bảng trách nhiệm và giá thật của VPS/PaaS/serverless, Kubernetes, chọn và đo máy, hạ TTL, chuyển nhà không mất dữ liệu, hoá đơn bất ngờ.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Slides</span>
<h2>The whole chapter in 31 slides</h2>
<p class="lead">Until now there was one server and one copy of the app. This chapter adds the other copies real projects end up with — a staging copy, a copy per pull request, a second server behind a load balancer, a new server you are moving to — and the bill that comes with each. Skim the slides first to see its shape, and come back to the two cheat sheets after the quiz.</p>
<p>Slides 3–8 belong to Lesson 14.1 (one image in several environments, a URL baked into an image that sent production to the staging API, anonymising staging data with one SQL statement, a preview address per pull request, a feature flag moving from 0% to 100% and back without a restart, what staging must and must not share with production), 9–16 to 14.2 (a load balancer in front of two lab servers, an nginx <code>upstream</code> that sent ten out of ten requests to one machine until it got a <code>zone</code>, pulling the network cable of one server under load with nginx and with HAProxy, sessions and uploads kept inside one machine, an old process that kept serving through keep-alive connections, a rolling deploy with 0 errors against a simultaneous one with 325, a 10% canary), 17–21 to 14.3 (who looks after which layer, real VPS and PaaS prices as of 09/2026, one student project priced four ways, Kubernetes next to the scripts of 14.2) and 22–27 to 14.4 (latency from Vietnam to five data centres, measuring a new server, lowering a TTL ahead of time, a migration script with a three-second write freeze, the nineteen appointments lost without that freeze, where surprise bills come from). The last four are the chapter's common mistakes, a two-page cheat sheet and a 45-minute practice session. Every terminal is real output recorded on 29/09/2026 — on Docker Desktop, on the "lab VPSes" (Ubuntu 24.04 containers the Mac reaches over SSH) and, for latency, on a Fedora machine at home in Vietnam.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Slide</span>
<h2>Cả chương trong 31 slide</h2>
<p class="lead">Tới giờ chỉ có một máy chủ và một bản app. Chương này thêm những bản sao mà dự án thật nào rồi cũng có — một bản staging, một bản cho mỗi pull request, một máy thứ hai đứng sau bộ cân bằng tải, một máy mới mà bạn sắp dọn sang — cùng hoá đơn đi kèm mỗi thứ. Lướt bộ slide trước để thấy hình dạng của chương, rồi quay lại hai trang bảng tra nhanh sau bài kiểm tra.</p>
<p>Slide 3–8 thuộc Bài 14.1 (một ảnh chạy ở nhiều môi trường, một URL nướng vào ảnh khiến production gọi API của staging, ẩn danh dữ liệu staging bằng một câu SQL, mỗi pull request một địa chỉ preview, một feature flag đi từ 0% lên 100% rồi về 0 mà không restart lần nào, staging phải và không được giống production ở đâu), 9–16 thuộc 14.2 (bộ cân bằng tải trước hai máy thí nghiệm, một <code>upstream</code> nginx dồn mười trên mười request vào một máy cho tới khi có <code>zone</code>, rút dây mạng một máy lúc đang có tải với nginx và với HAProxy, phiên đăng nhập và tệp tải lên nằm trong một máy, một tiến trình cũ vẫn phục vụ qua kết nối keep-alive, deploy lần lượt 0 lỗi so với tráo cùng lúc 325 lỗi, canary 10%), 17–21 thuộc 14.3 (ai lo tầng nào, giá VPS và PaaS thật tính đến 09/2026, một đồ án sinh viên tính giá bốn cách, Kubernetes đặt cạnh các script của 14.2) và 22–27 thuộc 14.4 (độ trễ từ Việt Nam tới năm trung tâm dữ liệu, đo một máy mới, hạ TTL từ trước, một script chuyển nhà đóng băng ghi ba giây, mười chín lịch hẹn mất khi bỏ bước đóng băng, hoá đơn bất ngờ đến từ đâu). Bốn slide cuối là những sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Mọi terminal là output THẬT, ghi ngày 29/09/2026 — trên Docker Desktop, trên các "VPS thí nghiệm" (container Ubuntu 24.04 mà máy Mac SSH vào như máy chủ thuê) và, riêng phần độ trễ, trên một máy Fedora ở nhà tại Việt Nam.</p>
</div>
${gallery('dv-14', [[1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Một ảnh, nhiều môi trường'], [4, 'Cấu hình nướng vào ảnh'], [5, 'Dữ liệu staging ẩn danh'], [6, 'Preview theo PR'], [7, 'Feature flag: deploy khác phát hành'], [8, 'Staging giống production ở đâu'], [9, 'Một máy là một điểm chết'], [10, 'nginx upstream và zone'], [11, 'Tắt một máy giữa lúc có tải'], [12, 'HAProxy kiểm sức khoẻ chủ động'], [13, 'Trạng thái trong máy'], [14, 'Dừng êm và keep-alive'], [15, 'Rolling từng máy'], [16, 'Canary 10%'], [17, 'Ai lo tầng nào'], [18, 'Giá VPS 09/2026'], [19, 'Giá PaaS và serverless 09/2026'], [20, 'Cùng một đồ án, bốn hoá đơn'], [21, 'Kubernetes và bài 14.2'], [22, 'Chọn VPS: độ trễ tới người dùng'], [23, 'Đo máy mới'], [24, 'Hạ TTL trước'], [25, 'Chuyển nhà từng bước'], [26, 'Chép khi web còn ghi'], [27, 'Hoá đơn bất ngờ'], [28, 'Sai lầm hay gặp'], [29, 'Bảng tra nhanh (1/2)'], [30, 'Bảng tra nhanh (2/2)'], [31, 'Thực hành chương 14']])}
`,
    },
    /* ─────────────────────────── 14.1 ─────────────────────────── */
    {
      title: "14.1 — Dev, staging and production: one image, many configs, and feature flags|||14.1 — Dev, staging và production: một ảnh, nhiều cấu hình, và cờ tính năng",
      slug: "deploy-14-1-staging-preview",
      type: "LESSON",
      isFreePreview: true,
      description: "Build một lần chạy ba nơi, cấu hình nướng vào ảnh làm production gọi API staging (đo thật), dữ liệu staging ẩn danh bằng SQL, preview theo PR bằng một nginx, và feature flag trong Redis bật 10% rồi tắt trong một giây.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.1</span>
<h2>Dev, staging and production: one image, different configuration, and flags that separate deploying from releasing</h2>
<p class="lead">A SWP391 team has exactly one server. The evening before the defence, one member wants to try a migration "just to see", another wants to show the lecturer a half-finished screen, and the demo for tomorrow runs on that same machine. Every experiment is an experiment on production. This lesson builds the copies that let a team try things without touching what users see — a staging copy, a copy per pull request — and the one rule that makes them worth having: the thing you tested must be the thing you ship.</p>

<h3>Three environments, one image</h3>
${slide('dv-14', 3, 'Build một lần, chạy staging và production từ CÙNG một ảnh, chỉ khác tệp env')}
<p>An <em>environment</em> (môi trường) is one complete running copy of the system: app, database, cache, domain, secrets. Most projects need three:</p>
<table>
<tr><th>Environment</th><th>Who uses it</th><th>Data</th><th>Typical address</th></tr>
<tr><td><strong>dev</strong> (development)</td><td>one developer, on a laptop</td><td>tiny seed data, throwaway</td><td><code>localhost:3000</code></td></tr>
<tr><td><strong>staging</strong></td><td>the team and testers, before every release</td><td>realistic in shape and size, <em>anonymised</em></td><td><code>staging.vidu.test</code>, behind a password</td></tr>
<tr><td><strong>production</strong></td><td>real users</td><td>real data</td><td><code>vidu.test</code></td></tr>
</table>
<p>The rule that holds this together comes from Chapter 1 (know exactly which artifact is live) and Chapter 4 (configuration lives outside the artifact): <strong>build once, and promote the same image</strong> from staging to production, changing only the environment variables. If you build a separate image for production, the thing users run was never tested — the build could have picked up a different dependency, a different base image, a different commit.</p>
<p>In the lab, one image was built and started twice with two env files:</p>
<pre><code class="language-bash">docker build --build-arg GIT_SHA=a1b2c3d -t dv14-app:a1b2c3d .      <span class="tok-comment"># MỘT lần</span>
docker run -d --name dv14-staging    --env-file env/staging.env    -p 127.0.0.1:19146:8000 dv14-app:a1b2c3d
docker run -d --name dv14-production --env-file env/production.env -p 127.0.0.1:19147:8000 dv14-app:a1b2c3d</code></pre>
<pre><code class="language-ini"><span class="tok-comment"># env/staging.env</span>
APP_ENV=staging
DATABASE_URL=postgresql://app:xxxx@dv14-pgstg:5432/datlich_stg
FLAG_NEW_CHECKOUT=100

<span class="tok-comment"># env/production.env</span>
APP_ENV=production
DATABASE_URL=postgresql://app:xxxx@dv14-pgprod:5432/datlich
FLAG_NEW_CHECKOUT=0</code></pre>
<div class="out">$ docker inspect -f "{{.Name}}  {{.Image}}" dv14-staging dv14-production
/dv14-staging  sha256:20097786e6d6448aa1575bc2930b92ce63c8a05a9adedcb8e3edd840f19c33cf
/dv14-production  sha256:20097786e6d6448aa1575bc2930b92ce63c8a05a9adedcb8e3edd840f19c33cf
$ curl -s 127.0.0.1:19146/ ; curl -s 127.0.0.1:19147/
{"may": "4f4a754676c4", "ban": "a1b2c3d", "env": "staging", "db": "dv14-pgstg:5432/datlich_stg"}
{"may": "3cd6cb0c39c6", "ban": "a1b2c3d", "env": "production", "db": "dv14-pgprod:5432/datlich"}</div>
<p>Read it the way you will read it after every release: the same <code>sha256</code> on both lines means the bytes are identical; the same <code>ban</code> (version) means the same commit; only <code>env</code> and <code>db</code> differ, and they differ because the <em>env file</em> differs. That is the whole contract. Chapter 13 pins image tags to commits; here you add the check that staging and production point at the same digest.</p>

<h3>Configuration baked into the image cannot be promoted</h3>
${slide('dv-14', 4, 'Cấu hình nướng vào ảnh lúc build: production gọi API của staging; sửa bằng đọc env lúc chạy')}
<p>Chapter 4.2 showed that build time and run time are different moments. Here is what that costs when you have two environments. Frontend frameworks read some variables <em>at build time</em> and copy their values into the JavaScript files — Next.js does this for every <code>NEXT_PUBLIC_*</code> variable. The lab reproduces it with a two-line Dockerfile:</p>
<pre><code class="language-dockerfile">FROM nginx:1.27-alpine
ARG NEXT_PUBLIC_API_URL                                    <span class="tok-comment"># chỉ có lúc BUILD</span>
RUN echo "&lt;script&gt;const API='\${NEXT_PUBLIC_API_URL}'&lt;/script&gt;" &gt; /usr/share/nginx/html/index.html</code></pre>
<div class="out">$ docker build --build-arg NEXT_PUBLIC_API_URL=https://api.staging.vidu.test -t dv14-fe:a1b2c3d .
# staging tested fine; "promote the same image" to production with production's env:
$ docker run -d -e NEXT_PUBLIC_API_URL=https://api.vidu.test -p 127.0.0.1:19148:80 dv14-fe:a1b2c3d
$ curl -s 127.0.0.1:19148/
&lt;script&gt;const API='https://api.staging.vidu.test'&lt;/script&gt;</div>
<p>The <code>-e</code> did nothing: the value had already been written into a file inside the image. Production would now send every user's requests to the staging API, with staging's (fake) data — and nothing would error. There are only two honest ways out:</p>
<ol>
<li><strong>Read configuration when the container starts.</strong> A small script writes a <code>config.js</code> from the environment each time the container starts, and the page loads it. The nginx image runs every script in <code>/docker-entrypoint.d/</code> before starting; that is where it goes.</li>
<li><strong>Build one image per environment, on purpose,</strong> and accept that the production image is tested only by a smoke test. Some teams choose this; they should know they chose it.</li>
</ol>
<pre><code class="language-bash">#!/bin/sh
<span class="tok-comment"># /docker-entrypoint.d/40-config.sh — chạy MỖI LẦN container khởi động</span>
echo "window.CONFIG={API:'\${API_URL:?thieu API_URL}'}" &gt; /usr/share/nginx/html/config.js</code></pre>
<div class="out">$ curl -s 127.0.0.1:19148/config.js; curl -s 127.0.0.1:19149/config.js
window.CONFIG={API:'https://api.staging.vidu.test'}
window.CONFIG={API:'https://api.vidu.test'}
$ docker run dv14-fe:b7e9f01        # forgot API_URL
/docker-entrypoint.d/40-config.sh: line 3: API_URL: thieu API_URL
$ docker inspect -f '{{.State.ExitCode}}' dv14-fe-thieu
2</div>
<p>Same image (<code>b7e9f01</code>), two containers, two APIs. The <code>\${API_URL:?message}</code> form makes the shell stop with an error if the variable is missing, so a forgotten variable is a container that refuses to start — loud — instead of a page that silently calls <code>undefined</code>. Chapter 4.2 has the full list of what is really build-time; the test here is simple: <strong>if a value differs between staging and production, it must not be read at build time.</strong></p>

<h3>Staging data: realistic, and anonymised</h3>
${slide('dv-14', 5, 'Dữ liệu staging: dump rồi ẩn danh bằng một câu UPDATE, kiểm lại không còn email thật')}
<p>Staging with ten test rows hides every bug that appears at 5,000 rows: the slow query, the page that assumes one appointment per patient, the export that times out. So teams copy production. A raw copy, though, puts real names, phone numbers and — for a clinic booking app — health notes on a machine that is less protected, that more people can log into, and whose backups nobody watches. It also lets staging send real emails and SMS to real people. In Vietnam personal data is regulated (Decree 13/2023/ND-CP on personal data protection); outside any law, it is simply the patients' data, not the team's.</p>
<p>The lab database has 5,000 patients and 20,000 appointments. The anonymising step replaces every column that identifies a person and keeps everything else — ids, foreign keys, dates, statuses — so the data still behaves like production:</p>
<pre><code class="language-sql">BEGIN;
UPDATE benh_nhan SET
  ho_ten    = 'Bệnh nhân #' || id,
  email     = 'bn' || id || '@example.invalid',            <span class="tok-comment">-- .invalid: tên miền dành riêng, thư không bao giờ tới ai</span>
  sdt       = '0900' || lpad((id % 1000000)::text, 6, '0'),
  ngay_sinh = date_trunc('year', ngay_sinh)::date,         <span class="tok-comment">-- giữ tuổi, bỏ ngày sinh chính xác</span>
  ghi_chu   = CASE WHEN ghi_chu IS NULL THEN NULL ELSE '(đã xoá)' END;
COMMIT;</code></pre>
<div class="out">$ docker exec dv14-pgprod pg_dump -U app -Fc datlich &gt; prod.dump
$ docker exec -i dv14-pgstg pg_restore -U app -d datlich_stg --no-owner &lt; prod.dump
$ psql … -c "SELECT id, ho_ten, email, sdt, ngay_sinh, ghi_chu FROM benh_nhan ORDER BY id LIMIT 3"
 id |     ho_ten     |        email        |    sdt     | ngay_sinh  |      ghi_chu
----+----------------+---------------------+------------+------------+-------------------
  1 | Nguyễn Văn An  | an.nguyen@gmail.com | 0912345678 | 1990-03-14 | dị ứng penicillin
  2 | Trần Thị Bình  | binh.tran@yahoo.com | 0987654321 | 1985-11-02 | tái khám tim mạch
  3 | Lê Hoàng Cường | cuong.le@fpt.edu.vn | 0901122334 | 2003-07-21 |
$ psql … -f an-danh.sql
BEGIN
UPDATE 5000
COMMIT
  1 | Bệnh nhân #1 | bn1@example.invalid | 0900000001 | 1990-01-01 | (đã xoá)
  2 | Bệnh nhân #2 | bn2@example.invalid | 0900000002 | 1985-01-01 | (đã xoá)
  3 | Bệnh nhân #3 | bn3@example.invalid | 0900000003 | 2003-01-01 |
$ psql … -c "SELECT count(*) FILTER (WHERE email NOT LIKE '%@example.invalid') AS con_that, count(*) AS tong FROM benh_nhan"
 con_that | tong
----------+------
        0 | 5000
$ psql … -c "SELECT count(*) AS lich_hen, count(DISTINCT benh_nhan_id) AS bn FROM lich_hen"
 lich_hen |  bn
----------+------
    20000 | 5000</div>
<p>(The sample names are invented for the lab.) Two checks close it: a query that counts real-looking emails left (must be <code>0</code>), and a query showing that relationships survived (20,000 appointments still point at 5,000 patients). Write both into the script; an anonymiser that silently skips a new column added next month is the usual way this fails.</p>
<table>
<tr><th>Approach</th><th>Good for</th><th>Watch out</th></tr>
<tr><td>Synthetic seed data (a script generates it)</td><td>dev, previews, CI</td><td>never has the odd shapes real data has</td></tr>
<tr><td>Anonymised copy of production</td><td>staging before a release, performance tests</td><td>anonymise <strong>on the production side</strong> — the dump file itself is real data; delete it after use</td></tr>
<tr><td>Raw copy of production</td><td>—</td><td>real people's data on a weaker machine; real emails sent from staging</td></tr>
</table>

<h3>A preview address per pull request</h3>
${slide('dv-14', 6, 'Preview theo PR: một nginx bắt số PR trong tên miền, chuyển tới container cùng số')}
<p>Staging holds one version at a time; a team of five with three open pull requests queues up for it. A <em>preview environment</em> gives each pull request its own address — <code>pr-12.preview.vidu.test</code> — so a reviewer (or the lecturer) clicks and sees exactly that branch. Vercel and Render do this automatically; on your own server it is one nginx rule and one container per PR:</p>
<pre><code class="language-nginx">server {
    listen 80;
    server_name ~^pr-(?&lt;pr&gt;\\d+)\\.preview\\.vidu\\.test$;   <span class="tok-comment"># bắt số PR vào biến $pr</span>
    resolver 127.0.0.11 valid=10s;                       <span class="tok-comment"># DNS nhúng của Docker: tên container → IP</span>
    location / {
        proxy_pass http://dv14-pr-$pr:8000;              <span class="tok-comment"># có biến ⇒ nginx hỏi DNS lúc có request</span>
        proxy_set_header Host $host;
    }
}</code></pre>
<div class="out">$ curl -s -H 'Host: pr-12.preview.vidu.test' 127.0.0.1:19145/
{"may": "3581e4f9071a", "ban": "pr12-9c1e2aa", "env": "preview-pr-12", "db": ""}
$ curl -s -H 'Host: pr-15.preview.vidu.test' 127.0.0.1:19145/
{"may": "483c0155e577", "ban": "pr15-4d5e6f7", "env": "preview-pr-15", "db": ""}
$ curl -s -H 'Host: pr-16.preview.vidu.test' 127.0.0.1:19145/
&lt;html&gt;
&lt;head&gt;&lt;title&gt;502 Bad Gateway&lt;/title&gt;&lt;/head&gt;
…
$ docker logs dv14-preview 2&gt;&amp;1 | grep error
2026/09/29 09:16:29 [error] 23#23: *7 dv14-pr-16 could not be resolved (3: Host not found), client: 172.30.14.1, …</div>
<p>Two details make it work. Because <code>proxy_pass</code> contains a variable, nginx resolves the name at request time instead of once at start-up — which needs the <code>resolver</code> line, here Docker's embedded DNS at <code>127.0.0.11</code> (Chapter 12.1). And a PR without a container gives a clean 502 with a readable log line rather than a crash. In real use you add a wildcard DNS record <code>*.preview.vidu.test</code> and a wildcard certificate, which needs the DNS-01 challenge (Chapter 12.2), and a password in front (previews are not for the public).</p>
<p>The lifecycle is a CI job, written here in full but <strong>not run</strong> in this chapter (Chapter 13.3 and <code>/courses/github-actions</code> cover running it):</p>
<pre><code class="language-yaml">on:
  pull_request:
    types: [opened, synchronize, reopened, closed]
jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - name: Lên hoặc gỡ bản preview trên VPS
        run: |
          N=\${{ github.event.pull_request.number }}
          if [ "\${{ github.event.action }}" = closed ]; then
            ssh deploy@vps "docker rm -f dv14-pr-$N"                 <span class="tok-comment"># đóng PR ⇒ gỡ, không để mồ côi</span>
          else
            ssh deploy@vps "docker run -d --rm --name dv14-pr-$N --network dv14-net \\
              -e APP_ENV=preview-pr-$N ghcr.io/nhom/app:\${{ github.sha }}"
          fi</code></pre>
<p>The line people forget is the <code>closed</code> branch. Without it, every PR ever opened leaves a container running on a 2 GB server; after a month the machine is out of memory for reasons nobody can see in <code>git log</code>.</p>

<h3>Feature flags: deploying is not releasing</h3>
${slide('dv-14', 7, 'Feature flag: mã mới đã lên máy nhưng người dùng chỉ thấy khi bật cờ, 10% → 100% → tắt')}
<p>Everything so far ties "the code is on the server" to "users see it". A <em>feature flag</em> (cờ tính năng) cuts that tie: the new checkout is deployed but hidden behind an <code>if</code>, and a value you can change at run time decides who sees it. The lab app reads the percentage from Redis on every request and gives each user a fixed bucket 0–99:</p>
<pre><code class="language-python">def bucket(user):
    return zlib.crc32(user.encode()) % 100      <span class="tok-comment"># cùng một người ⇒ luôn cùng một số</span>

p = int(R.get('flag:new_checkout') or 0)        <span class="tok-comment"># đọc MỖI request, không cần restart</span>
checkout = 'v2' if bucket(user) &lt; p else 'v1'</code></pre>
<div class="out">$ docker exec dv14-redis redis-cli SET flag:new_checkout 10
OK
# 1000 different users ask /checkout → how many see v2?
90
$ docker exec dv14-redis redis-cli SET flag:new_checkout 50
495
$ docker exec dv14-redis redis-cli SET flag:new_checkout 100
1000
$ docker exec dv14-redis redis-cli SET flag:new_checkout 0
0
$ docker inspect -f "{{.State.StartedAt}}" dv14-flag
2026-09-29T09:16:40.387386923Z
$ curl -s "127.0.0.1:19141/checkout?u=cuong"
{"u": "cuong", "bucket": 69, "phan_tram": 0, "checkout": "v1"}</div>
<p>(The <code>OK</code> after each <code>SET</code> is omitted after the first.) 10% gave 90 of 1,000 users, 50% gave 495 — close to the target, because the hash spreads users roughly evenly. The container's start time did not change through all five steps: no build, no swap, no restart. Turning the feature off took one command and applied on the next request. Because the bucket is fixed per user, "cuong" (bucket 69) sees v1 until the flag reaches 70% and then stays on v2 — a user does not flip between versions on every click.</p>
<table>
<tr><th>Kind of flag</th><th>Lives for</th><th>Example</th></tr>
<tr><td>Release flag</td><td>days to weeks</td><td>the new checkout, turned up 10% → 100%, then deleted</td></tr>
<tr><td>Ops flag / kill switch</td><td>long</td><td>turn off the expensive AI summary when the bill spikes</td></tr>
<tr><td>Experiment (A/B)</td><td>one experiment</td><td>two button texts, measure which converts</td></tr>
<tr><td>Permission flag</td><td>long</td><td>a feature only for Pro accounts or for the lecturer's demo account</td></tr>
</table>
<div class="callout warn"><strong>A flag is debt.</strong> Each flag doubles the paths through that code. When a release flag reaches 100%, remove the flag and the old branch in one pull request. A project with thirty forgotten flags has code paths that no one has run in a year — and the day someone flips one back, it breaks.</div>

<h3>What staging must share with production — and what it must not</h3>
${slide('dv-14', 8, 'Staging giống production ở mã, phần mềm, tên biến, migration; khác ở dữ liệu, bên thứ ba, quyền vào')}
<table>
<tr><th></th><th>The same as production</th><th>Different on purpose</th></tr>
<tr><td>Code</td><td>the same image digest</td><td>new versions arrive here first</td></tr>
<tr><td>Software</td><td>the same Postgres 16, Redis 7, nginx, Ubuntu</td><td>—</td></tr>
<tr><td>Configuration</td><td>the same variable <em>names</em>, loaded the same way</td><td>the values: URLs, keys, flags</td></tr>
<tr><td>Migrations</td><td>the exact command production will run (Chapter 5)</td><td>—</td></tr>
<tr><td>Data</td><td>shape and volume close to real</td><td>anonymised</td></tr>
<tr><td>Third parties</td><td>—</td><td>email, SMS, payment in sandbox mode</td></tr>
<tr><td>Size</td><td>—</td><td>a smaller machine; can be switched off at night</td></tr>
<tr><td>Access</td><td>—</td><td>not public: password, IP allow-list or VPN</td></tr>
</table>
<p>The Twelve-Factor App calls the first column <em>dev/prod parity</em>: keep the gaps in time, people and tools small. A staging on Postgres 14 while production is on 16, or on SQLite "because it is only staging", passes tests that production will fail. The second column is not a failure of parity — it is safety.</p>

<h3>Try it step by step</h3>
<ol>
<li><code>docker network create dv14-net</code>; two Postgres containers (<code>dv14-pgprod</code>, <code>dv14-pgstg</code>); fill the first with sample rows.</li>
<li>Build the app image once; write <code>staging.env</code> and <code>production.env</code>; start two containers; compare <code>docker inspect</code> and <code>curl /</code>.</li>
<li>Dump, restore into staging, run the anonymiser, run both checks.</li>
<li>Start <code>redis:7-alpine</code>, point the flag at it, change the percentage while a loop of <code>curl</code> runs.</li>
</ol>

<div class="pitfall co-tieu-de"><strong>Trap — "it passed on staging" when staging was not what shipped.</strong> A green staging proves something only about the image and configuration that staging ran. Build a second image for production, bake a URL into the bundle, run staging on a different database version, or let staging's data be ten rows — and the green light is about a different system. Before trusting it, compare the two digests and read the env files side by side.</div>

<h3>On Windows and macOS: line endings in env files</h3>
<p>A teammate on Windows edits <code>staging.env</code> in Notepad and it is saved with CRLF line endings. Docker's <code>--env-file</code> copes (Docker 29.8 in this lab stripped the <code>\\r</code>), but a shell that <em>sources</em> the file — like the <code>app-restart</code> script in 14.2 — does not:</p>
<div class="out">$ file env/staging-crlf.env
env/staging-crlf.env: ASCII text, with CRLF line terminators
$ docker run --rm --env-file env/staging-crlf.env dv14-app:a1b2c3d python3 -c "import os; print(repr(os.environ[\\"APP_ENV\\"]))"
'staging'
$ set -a; . /tmp/staging-crlf.env; set +a; printf %q\\\\n "$APP_ENV"
$'staging\\r'
$ sed -i "s/\\r$//" /tmp/staging-crlf.env   # or dos2unix
staging</div>
<p><code>staging\\r</code> is not <code>staging</code>: a comparison <code>[ "$APP_ENV" = staging ]</code> fails, and a database URL ending in <code>\\r</code> fails to connect with a confusing error. Add <code>*.env text eol=lf</code> to <code>.gitattributes</code>, and have the deploy script run <code>file</code> on env files. On macOS, <code>sed -i</code> needs an empty argument (<code>sed -i '' …</code>) — or run the fix on the Linux server as above.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the team's frontend image is built with <code>NEXT_PUBLIC_API_URL</code> and there are two Dockerfiles, one per environment. Before the defence you must show that staging and production run the same bytes and that staging holds no real patient data.</p>
<ol>
<li>Rebuild the lab frontend so that the API address is written to <code>config.js</code> at start-up. Run it twice with two <code>API_URL</code>s from one image; confirm with <code>curl /config.js</code>.</li>
<li>Start it once without <code>API_URL</code>; record the exit code.</li>
<li>Dump the lab "production" database into staging, anonymise, and run the two checks.</li>
<li>Add a flag for one visible feature; move it 0 → 10 → 100 → 0 while a <code>curl</code> loop runs, and count how many users saw it at each step.</li>
</ol>
<p><strong>Done when:</strong> <code>docker inspect</code> shows one digest for both containers, the missing-variable start exits non-zero, the real-email count on staging is <code>0</code> with appointment counts unchanged, and your notes have the four counts from the flag loop.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Environment</span><span class="v">One complete running copy of the system: app, database, domain, secrets.</span></div>
  <div class="kv"><span class="k">Staging</span><span class="v">The production-like copy where a release is tried before users see it.</span></div>
  <div class="kv"><span class="k">Promote</span><span class="v">Move the same, already-tested image to the next environment — not rebuild it.</span></div>
  <div class="kv"><span class="k">Build-time vs run-time configuration</span><span class="v">Values copied into the image while building vs read from the environment when the container starts.</span></div>
  <div class="kv"><span class="k">Anonymisation</span><span class="v">Replacing everything that identifies a person while keeping the data's shape and relationships.</span></div>
  <div class="kv"><span class="k">Preview environment</span><span class="v">A short-lived copy per pull request, at its own address.</span></div>
  <div class="kv"><span class="k">Feature flag</span><span class="v">A run-time switch that decides who sees a feature that is already deployed.</span></div>
  <div class="kv"><span class="k">Dev/prod parity</span><span class="v">Keeping dev, staging and production as alike as possible in code, software and tools.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Build one image and promote it; staging and production differ only in their env files — prove it by comparing digests.</li>
<li>A value that differs between environments must not be read at build time; in the lab a baked URL sent production to the staging API.</li>
<li>Read configuration when the container starts, and make a missing variable stop the start loudly.</li>
<li>Staging data should be realistic and anonymised on the production side, with a check that no real identifiers remain.</li>
<li>Preview environments give each pull request an address; removing them when the PR closes is part of the design.</li>
<li>A feature flag separates deploying from releasing; turn it up gradually, keep it as a kill switch, and delete it when done.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — III. Config</span><span class="lc-sub">12factor.net/config — configuration that varies between deploys belongs in the environment.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — X. Dev/prod parity</span><span class="lc-sub">12factor.net/dev-prod-parity — the time, personnel and tools gaps.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — Feature Toggles</span><span class="lc-sub">martinfowler.com/articles/feature-toggles.html — release, ops, experiment and permission toggles, and their cost.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_dump</span><span class="lc-sub">postgresql.org/docs/current/app-pgdump.html — the custom format used here.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">GitHub Actions — pull_request events</span><span class="lc-sub">/courses/github-actions/learn${REF} — running the preview workflow for real.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.1</span>
<h2>Dev, staging và production: một ảnh, cấu hình khác nhau, và cờ tách deploy khỏi phát hành</h2>
<p class="lead">Một nhóm SWP391 có đúng một máy chủ. Tối trước hôm bảo vệ, một bạn muốn chạy thử migration "cho biết", một bạn muốn cho thầy xem màn hình đang làm dở, còn bản demo ngày mai chạy trên chính cái máy đó. Mọi thử nghiệm đều là thử nghiệm trên production. Bài này dựng những bản sao giúp cả nhóm thử mà không đụng vào thứ người dùng đang thấy — một bản staging, một bản cho mỗi pull request — cùng một luật duy nhất làm chúng có giá trị: thứ bạn đã kiểm phải chính là thứ bạn đưa lên.</p>

<h3>Ba môi trường, một ảnh</h3>
${slide('dv-14', 3, 'Build một lần, chạy staging và production từ CÙNG một ảnh, chỉ khác tệp env')}
<p>Một <em>environment</em> (môi trường) là một bản chạy trọn vẹn của hệ thống: app, cơ sở dữ liệu, bộ đệm, tên miền, bí mật. Hầu hết dự án cần ba:</p>
<table>
<tr><th>Môi trường</th><th>Ai dùng</th><th>Dữ liệu</th><th>Địa chỉ thường gặp</th></tr>
<tr><td><strong>dev</strong> (phát triển)</td><td>một lập trình viên, trên laptop</td><td>vài dòng seed, xoá lúc nào cũng được</td><td><code>localhost:3000</code></td></tr>
<tr><td><strong>staging</strong> (dàn dựng)</td><td>cả nhóm và người kiểm thử, trước mỗi lần phát hành</td><td>giống thật về hình dạng và khối lượng, <em>đã ẩn danh</em></td><td><code>staging.vidu.test</code>, có mật khẩu</td></tr>
<tr><td><strong>production</strong> (sản xuất)</td><td>người dùng thật</td><td>dữ liệu thật</td><td><code>vidu.test</code></td></tr>
</table>
<p>Luật giữ tất cả lại với nhau đến từ Chương 1 (biết chính xác tạo tác nào đang sống) và Chương 4 (cấu hình nằm ngoài tạo tác): <strong>build một lần, và <em>promote</em> (đẩy tiếp) chính ảnh đó</strong> từ staging lên production, chỉ đổi biến môi trường. Nếu bạn build riêng một ảnh cho production, thứ người dùng chạy chưa từng được kiểm — lần build đó có thể lấy một thư viện khác, một ảnh nền khác, một commit khác.</p>
<p>Trong phòng thí nghiệm, một ảnh được build rồi chạy hai lần với hai tệp env:</p>
<pre><code class="language-bash">docker build --build-arg GIT_SHA=a1b2c3d -t dv14-app:a1b2c3d .      <span class="tok-comment"># MỘT lần</span>
docker run -d --name dv14-staging    --env-file env/staging.env    -p 127.0.0.1:19146:8000 dv14-app:a1b2c3d
docker run -d --name dv14-production --env-file env/production.env -p 127.0.0.1:19147:8000 dv14-app:a1b2c3d</code></pre>
<pre><code class="language-ini"><span class="tok-comment"># env/staging.env</span>
APP_ENV=staging
DATABASE_URL=postgresql://app:xxxx@dv14-pgstg:5432/datlich_stg
FLAG_NEW_CHECKOUT=100

<span class="tok-comment"># env/production.env</span>
APP_ENV=production
DATABASE_URL=postgresql://app:xxxx@dv14-pgprod:5432/datlich
FLAG_NEW_CHECKOUT=0</code></pre>
<div class="out">$ docker inspect -f "{{.Name}}  {{.Image}}" dv14-staging dv14-production
/dv14-staging  sha256:20097786e6d6448aa1575bc2930b92ce63c8a05a9adedcb8e3edd840f19c33cf
/dv14-production  sha256:20097786e6d6448aa1575bc2930b92ce63c8a05a9adedcb8e3edd840f19c33cf
$ curl -s 127.0.0.1:19146/ ; curl -s 127.0.0.1:19147/
{"may": "4f4a754676c4", "ban": "a1b2c3d", "env": "staging", "db": "dv14-pgstg:5432/datlich_stg"}
{"may": "3cd6cb0c39c6", "ban": "a1b2c3d", "env": "production", "db": "dv14-pgprod:5432/datlich"}</div>
<p>Đọc nó theo đúng cách bạn sẽ đọc sau mỗi lần phát hành: cùng <code>sha256</code> ở hai dòng nghĩa là từng byte giống hệt; cùng <code>ban</code> (phiên bản) nghĩa là cùng commit; chỉ <code>env</code> và <code>db</code> khác, và chúng khác vì <em>tệp env</em> khác. Toàn bộ giao kèo chỉ có vậy. Chương 13 ghim tag ảnh theo commit; ở đây bạn thêm phép kiểm staging và production trỏ vào cùng một digest (mã băm của ảnh).</p>

<h3>Cấu hình nướng vào ảnh thì không đẩy tiếp được</h3>
${slide('dv-14', 4, 'Cấu hình nướng vào ảnh lúc build: production gọi API của staging; sửa bằng đọc env lúc chạy')}
<p>Chương 4.2 đã cho thấy lúc build và lúc chạy là hai thời điểm khác nhau. Đây là cái giá của chuyện đó khi bạn có hai môi trường. Các framework frontend đọc một số biến <em>lúc build</em> rồi chép giá trị của chúng vào các tệp JavaScript — Next.js làm vậy với mọi biến <code>NEXT_PUBLIC_*</code>. Phòng thí nghiệm dựng lại chuyện này bằng một Dockerfile hai dòng:</p>
<pre><code class="language-dockerfile">FROM nginx:1.27-alpine
ARG NEXT_PUBLIC_API_URL                                    <span class="tok-comment"># chỉ có lúc BUILD</span>
RUN echo "&lt;script&gt;const API='\${NEXT_PUBLIC_API_URL}'&lt;/script&gt;" &gt; /usr/share/nginx/html/index.html</code></pre>
<div class="out">$ docker build --build-arg NEXT_PUBLIC_API_URL=https://api.staging.vidu.test -t dv14-fe:a1b2c3d .
# staging kiểm xong, "đẩy nguyên ảnh" lên production với env của production:
$ docker run -d -e NEXT_PUBLIC_API_URL=https://api.vidu.test -p 127.0.0.1:19148:80 dv14-fe:a1b2c3d
$ curl -s 127.0.0.1:19148/
&lt;script&gt;const API='https://api.staging.vidu.test'&lt;/script&gt;</div>
<p>Cái <code>-e</code> chẳng làm gì cả: giá trị đã bị ghi vào một tệp nằm trong ảnh. Production giờ sẽ gửi mọi request của người dùng tới API của staging, với dữ liệu (giả) của staging — và không có lỗi nào hiện ra. Chỉ có hai lối ra thành thật:</p>
<ol>
<li><strong>Đọc cấu hình lúc container khởi động.</strong> Một script nhỏ ghi <code>config.js</code> từ biến môi trường mỗi lần container khởi động, và trang web nạp tệp đó. Ảnh nginx chạy mọi script trong <code>/docker-entrypoint.d/</code> trước khi khởi động; nó nằm ở đó.</li>
<li><strong>Build mỗi môi trường một ảnh, một cách có chủ đích,</strong> và chấp nhận rằng ảnh production chỉ được kiểm bằng một smoke-test. Có nhóm chọn cách này; họ nên biết là mình đã chọn.</li>
</ol>
<pre><code class="language-bash">#!/bin/sh
<span class="tok-comment"># /docker-entrypoint.d/40-config.sh — chạy MỖI LẦN container khởi động</span>
echo "window.CONFIG={API:'\${API_URL:?thieu API_URL}'}" &gt; /usr/share/nginx/html/config.js</code></pre>
<div class="out">$ curl -s 127.0.0.1:19148/config.js; curl -s 127.0.0.1:19149/config.js
window.CONFIG={API:'https://api.staging.vidu.test'}
window.CONFIG={API:'https://api.vidu.test'}
$ docker run dv14-fe:b7e9f01        # quên API_URL
/docker-entrypoint.d/40-config.sh: line 3: API_URL: thieu API_URL
$ docker inspect -f '{{.State.ExitCode}}' dv14-fe-thieu
2</div>
<p>Cùng một ảnh (<code>b7e9f01</code>), hai container, hai API. Dạng <code>\${API_URL:?thông báo}</code> bắt shell dừng kèm lỗi nếu thiếu biến, nên một biến bị quên thành một container không chịu khởi động — ồn ào — thay vì một trang lặng lẽ gọi tới <code>undefined</code>. Chương 4.2 có danh sách đầy đủ những gì thật sự thuộc về lúc build; phép thử ở đây đơn giản: <strong>giá trị nào khác nhau giữa staging và production thì không được đọc lúc build.</strong></p>

<h3>Dữ liệu staging: giống thật, và đã ẩn danh</h3>
${slide('dv-14', 5, 'Dữ liệu staging: dump rồi ẩn danh bằng một câu UPDATE, kiểm lại không còn email thật')}
<p>Staging chỉ có mười dòng thử thì giấu mọi lỗi xuất hiện ở 5.000 dòng: câu truy vấn chậm, màn hình ngầm cho rằng mỗi bệnh nhân một lịch hẹn, tính năng xuất tệp bị hết giờ. Nên các nhóm chép production sang. Nhưng một bản chép thô đưa tên thật, số điện thoại thật và — với app đặt lịch phòng khám — cả ghi chú bệnh lên một máy được bảo vệ kém hơn, nhiều người đăng nhập hơn, và bản sao lưu của nó chẳng ai canh. Nó còn cho staging gửi email và SMS thật tới người thật. Ở Việt Nam dữ liệu cá nhân có luật điều chỉnh (Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân); không cần nói tới luật, đó đơn giản là dữ liệu của bệnh nhân, không phải của nhóm.</p>
<p>Cơ sở dữ liệu thí nghiệm có 5.000 bệnh nhân và 20.000 lịch hẹn. Bước ẩn danh (anonymise) thay mọi cột nhận ra được một người và giữ nguyên mọi thứ khác — id, khoá ngoại, ngày giờ, trạng thái — để dữ liệu vẫn cư xử như production:</p>
<pre><code class="language-sql">BEGIN;
UPDATE benh_nhan SET
  ho_ten    = 'Bệnh nhân #' || id,
  email     = 'bn' || id || '@example.invalid',            <span class="tok-comment">-- .invalid: tên miền dành riêng, thư không bao giờ tới ai</span>
  sdt       = '0900' || lpad((id % 1000000)::text, 6, '0'),
  ngay_sinh = date_trunc('year', ngay_sinh)::date,         <span class="tok-comment">-- giữ tuổi, bỏ ngày sinh chính xác</span>
  ghi_chu   = CASE WHEN ghi_chu IS NULL THEN NULL ELSE '(đã xoá)' END;
COMMIT;</code></pre>
<div class="out">$ docker exec dv14-pgprod pg_dump -U app -Fc datlich &gt; prod.dump
$ docker exec -i dv14-pgstg pg_restore -U app -d datlich_stg --no-owner &lt; prod.dump
$ psql … -c "SELECT id, ho_ten, email, sdt, ngay_sinh, ghi_chu FROM benh_nhan ORDER BY id LIMIT 3"
 id |     ho_ten     |        email        |    sdt     | ngay_sinh  |      ghi_chu
----+----------------+---------------------+------------+------------+-------------------
  1 | Nguyễn Văn An  | an.nguyen@gmail.com | 0912345678 | 1990-03-14 | dị ứng penicillin
  2 | Trần Thị Bình  | binh.tran@yahoo.com | 0987654321 | 1985-11-02 | tái khám tim mạch
  3 | Lê Hoàng Cường | cuong.le@fpt.edu.vn | 0901122334 | 2003-07-21 |
$ psql … -f an-danh.sql
BEGIN
UPDATE 5000
COMMIT
  1 | Bệnh nhân #1 | bn1@example.invalid | 0900000001 | 1990-01-01 | (đã xoá)
  2 | Bệnh nhân #2 | bn2@example.invalid | 0900000002 | 1985-01-01 | (đã xoá)
  3 | Bệnh nhân #3 | bn3@example.invalid | 0900000003 | 2003-01-01 |
$ psql … -c "SELECT count(*) FILTER (WHERE email NOT LIKE '%@example.invalid') AS con_that, count(*) AS tong FROM benh_nhan"
 con_that | tong
----------+------
        0 | 5000
$ psql … -c "SELECT count(*) AS lich_hen, count(DISTINCT benh_nhan_id) AS bn FROM lich_hen"
 lich_hen |  bn
----------+------
    20000 | 5000</div>
<p>(Tên trong dữ liệu mẫu là tên bịa cho phòng thí nghiệm.) Hai phép kiểm khép lại việc này: một truy vấn đếm số email trông như thật còn sót (phải là <code>0</code>), và một truy vấn cho thấy các quan hệ vẫn còn (20.000 lịch hẹn vẫn trỏ tới 5.000 bệnh nhân). Viết cả hai vào script; kiểu hỏng thường gặp là một bộ ẩn danh lặng lẽ bỏ sót một cột mới thêm vào tháng sau.</p>
<table>
<tr><th>Cách</th><th>Hợp cho</th><th>Cẩn thận</th></tr>
<tr><td>Dữ liệu seed tổng hợp (script sinh ra)</td><td>dev, preview, CI</td><td>không bao giờ có những hình thù lạ mà dữ liệu thật có</td></tr>
<tr><td>Bản chép production đã ẩn danh</td><td>staging trước khi phát hành, đo hiệu năng</td><td>ẩn danh <strong>ngay phía production</strong> — bản thân tệp dump là dữ liệu thật; dùng xong xoá</td></tr>
<tr><td>Bản chép production thô</td><td>—</td><td>dữ liệu người thật trên một máy yếu hơn; staging gửi email thật</td></tr>
</table>

<h3>Mỗi pull request một địa chỉ preview</h3>
${slide('dv-14', 6, 'Preview theo PR: một nginx bắt số PR trong tên miền, chuyển tới container cùng số')}
<p>Staging mỗi lúc chỉ giữ một phiên bản; một nhóm năm người có ba pull request đang mở sẽ phải xếp hàng. Một <em>preview environment</em> (môi trường xem trước) cho mỗi pull request một địa chỉ riêng — <code>pr-12.preview.vidu.test</code> — để người review (hoặc thầy) bấm vào là thấy đúng nhánh đó. Vercel và Render làm việc này tự động; trên máy của bạn thì đó là một luật nginx và mỗi PR một container:</p>
<pre><code class="language-nginx">server {
    listen 80;
    server_name ~^pr-(?&lt;pr&gt;\\d+)\\.preview\\.vidu\\.test$;   <span class="tok-comment"># bắt số PR vào biến $pr</span>
    resolver 127.0.0.11 valid=10s;                       <span class="tok-comment"># DNS nhúng của Docker: tên container → IP</span>
    location / {
        proxy_pass http://dv14-pr-$pr:8000;              <span class="tok-comment"># có biến ⇒ nginx hỏi DNS lúc có request</span>
        proxy_set_header Host $host;
    }
}</code></pre>
<div class="out">$ curl -s -H 'Host: pr-12.preview.vidu.test' 127.0.0.1:19145/
{"may": "3581e4f9071a", "ban": "pr12-9c1e2aa", "env": "preview-pr-12", "db": ""}
$ curl -s -H 'Host: pr-15.preview.vidu.test' 127.0.0.1:19145/
{"may": "483c0155e577", "ban": "pr15-4d5e6f7", "env": "preview-pr-15", "db": ""}
$ curl -s -H 'Host: pr-16.preview.vidu.test' 127.0.0.1:19145/
&lt;html&gt;
&lt;head&gt;&lt;title&gt;502 Bad Gateway&lt;/title&gt;&lt;/head&gt;
…
$ docker logs dv14-preview 2&gt;&amp;1 | grep error
2026/09/29 09:16:29 [error] 23#23: *7 dv14-pr-16 could not be resolved (3: Host not found), client: 172.30.14.1, …</div>
<p>Hai chi tiết làm nó chạy được. Vì <code>proxy_pass</code> chứa biến, nginx phân giải tên lúc có request thay vì một lần lúc khởi động — việc này cần dòng <code>resolver</code>, ở đây là DNS nhúng của Docker tại <code>127.0.0.11</code> (Chương 12.1). Và một PR không có container thì nhận một lỗi 502 sạch sẽ kèm một dòng log đọc được, chứ không làm sập gì. Khi dùng thật, bạn thêm bản ghi DNS wildcard <code>*.preview.vidu.test</code> và một chứng chỉ wildcard, thứ cần thử thách DNS-01 (Chương 12.2), cộng một lớp mật khẩu đứng trước (preview không dành cho công chúng).</p>
<p>Vòng đời của nó là một job CI, viết đầy đủ ở đây nhưng <strong>không chạy</strong> trong chương này (Chương 13.3 và <code>/courses/github-actions</code> dạy chạy nó):</p>
<pre><code class="language-yaml">on:
  pull_request:
    types: [opened, synchronize, reopened, closed]
jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - name: Lên hoặc gỡ bản preview trên VPS
        run: |
          N=\${{ github.event.pull_request.number }}
          if [ "\${{ github.event.action }}" = closed ]; then
            ssh deploy@vps "docker rm -f dv14-pr-$N"                 <span class="tok-comment"># đóng PR ⇒ gỡ, không để mồ côi</span>
          else
            ssh deploy@vps "docker run -d --rm --name dv14-pr-$N --network dv14-net \\
              -e APP_ENV=preview-pr-$N ghcr.io/nhom/app:\${{ github.sha }}"
          fi</code></pre>
<p>Dòng mà người ta hay quên là nhánh <code>closed</code>. Thiếu nó, mọi PR từng mở để lại một container chạy trên một máy 2 GB; sau một tháng máy hết RAM vì những lý do không ai thấy được trong <code>git log</code>.</p>

<h3>Feature flag: deploy không phải là phát hành</h3>
${slide('dv-14', 7, 'Feature flag: mã mới đã lên máy nhưng người dùng chỉ thấy khi bật cờ, 10% → 100% → tắt')}
<p>Mọi thứ tới giờ đều buộc "mã đã lên máy chủ" với "người dùng thấy nó". Một <em>feature flag</em> (cờ tính năng) cắt sợi dây đó: trang thanh toán mới đã được deploy nhưng nằm sau một câu <code>if</code>, và một giá trị đổi được lúc chạy quyết định ai thấy nó. App thí nghiệm đọc phần trăm từ Redis ở mỗi request và cho mỗi người dùng một "ô" (bucket) cố định từ 0 tới 99:</p>
<pre><code class="language-python">def bucket(user):
    return zlib.crc32(user.encode()) % 100      <span class="tok-comment"># cùng một người ⇒ luôn cùng một số</span>

p = int(R.get('flag:new_checkout') or 0)        <span class="tok-comment"># đọc MỖI request, không cần restart</span>
checkout = 'v2' if bucket(user) &lt; p else 'v1'</code></pre>
<div class="out">$ docker exec dv14-redis redis-cli SET flag:new_checkout 10
OK
# 1000 người dùng khác nhau hỏi /checkout → bao nhiêu người thấy v2?
90
$ docker exec dv14-redis redis-cli SET flag:new_checkout 50
495
$ docker exec dv14-redis redis-cli SET flag:new_checkout 100
1000
$ docker exec dv14-redis redis-cli SET flag:new_checkout 0
0
$ docker inspect -f "{{.State.StartedAt}}" dv14-flag
2026-09-29T09:16:40.387386923Z
$ curl -s "127.0.0.1:19141/checkout?u=cuong"
{"u": "cuong", "bucket": 69, "phan_tram": 0, "checkout": "v1"}</div>
<p>(Dòng <code>OK</code> sau mỗi <code>SET</code> được lược từ lần thứ hai.) 10% cho 90 trên 1.000 người dùng, 50% cho 495 — sát mục tiêu, vì hàm băm rải người dùng khá đều. Thời điểm khởi động của container không đổi suốt năm bước: không build, không tráo, không restart. Tắt tính năng mất một lệnh và có hiệu lực ngay request kế tiếp. Vì ô của mỗi người cố định, "cuong" (ô 69) thấy v1 cho tới khi cờ lên 70% rồi ở luôn bên v2 — một người dùng không bị lật qua lật lại giữa hai phiên bản mỗi lần bấm.</p>
<table>
<tr><th>Loại cờ</th><th>Sống bao lâu</th><th>Ví dụ</th></tr>
<tr><td>Cờ phát hành (release)</td><td>vài ngày tới vài tuần</td><td>trang thanh toán mới, tăng 10% → 100% rồi xoá</td></tr>
<tr><td>Cờ vận hành / công tắc khẩn (kill switch)</td><td>lâu dài</td><td>tắt tính năng tóm tắt bằng AI tốn tiền khi hoá đơn vọt</td></tr>
<tr><td>Thí nghiệm (A/B)</td><td>một đợt thí nghiệm</td><td>hai câu chữ trên nút, đo câu nào nhiều người bấm hơn</td></tr>
<tr><td>Cờ phân quyền</td><td>lâu dài</td><td>tính năng chỉ cho tài khoản Pro, hoặc cho tài khoản demo của thầy</td></tr>
</table>
<div class="callout warn"><strong>Cờ là một khoản nợ.</strong> Mỗi cờ nhân đôi số đường đi qua đoạn mã đó. Khi một cờ phát hành đã lên 100%, gỡ cờ và nhánh cũ trong cùng một pull request. Một dự án có ba mươi cờ bị quên là một dự án có những đường mã không ai chạy suốt một năm — và cái ngày có người gạt một cờ về lại, nó hỏng.</div>

<h3>Staging phải giống production ở đâu — và không được giống ở đâu</h3>
${slide('dv-14', 8, 'Staging giống production ở mã, phần mềm, tên biến, migration; khác ở dữ liệu, bên thứ ba, quyền vào')}
<table>
<tr><th></th><th>Giống production</th><th>Khác production (cố ý)</th></tr>
<tr><td>Mã</td><td>cùng digest của ảnh</td><td>phiên bản mới tới đây trước</td></tr>
<tr><td>Phần mềm</td><td>cùng Postgres 16, Redis 7, nginx, Ubuntu</td><td>—</td></tr>
<tr><td>Cấu hình</td><td>cùng <em>tên</em> biến, nạp theo cùng một cách</td><td>giá trị: URL, khoá, cờ</td></tr>
<tr><td>Migration</td><td>đúng lệnh production sẽ chạy (Chương 5)</td><td>—</td></tr>
<tr><td>Dữ liệu</td><td>hình dạng và khối lượng gần thật</td><td>đã ẩn danh</td></tr>
<tr><td>Bên thứ ba</td><td>—</td><td>email, SMS, thanh toán ở chế độ sandbox (hộp cát)</td></tr>
<tr><td>Kích cỡ</td><td>—</td><td>máy nhỏ hơn; tắt được ban đêm</td></tr>
<tr><td>Ai vào được</td><td>—</td><td>không công khai: mật khẩu, danh sách IP hoặc VPN</td></tr>
</table>
<p>The Twelve-Factor App gọi cột thứ nhất là <em>dev/prod parity</em> (tương đồng giữa dev và prod): giữ khoảng cách về thời gian, con người và công cụ thật nhỏ. Một staging chạy Postgres 14 trong khi production chạy 16, hay chạy SQLite "vì chỉ là staging thôi", sẽ qua những phép kiểm mà production trượt. Cột thứ hai không phải là thiếu tương đồng — đó là an toàn.</p>

<h3>Chạy thử từng bước</h3>
<ol>
<li><code>docker network create dv14-net</code>; hai container Postgres (<code>dv14-pgprod</code>, <code>dv14-pgstg</code>); đổ dữ liệu mẫu vào cái đầu.</li>
<li>Build ảnh app một lần; viết <code>staging.env</code> và <code>production.env</code>; chạy hai container; so <code>docker inspect</code> và <code>curl /</code>.</li>
<li>Dump, restore vào staging, chạy bộ ẩn danh, chạy cả hai phép kiểm.</li>
<li>Chạy <code>redis:7-alpine</code>, trỏ cờ vào đó, đổi phần trăm trong lúc một vòng <code>curl</code> đang chạy.</li>
</ol>

<div class="pitfall co-tieu-de"><strong>Bẫy — "staging qua rồi mà" trong khi staging không phải thứ được đưa lên.</strong> Staging xanh chỉ chứng minh điều gì đó về đúng cái ảnh và cấu hình staging đã chạy. Build một ảnh thứ hai cho production, nướng một URL vào bundle, cho staging chạy một phiên bản cơ sở dữ liệu khác, hay để dữ liệu staging chỉ mười dòng — thì đèn xanh đó nói về một hệ thống khác. Trước khi tin nó, so hai digest và đọc hai tệp env cạnh nhau.</div>

<h3>Trên Windows và macOS: ký tự xuống dòng trong tệp env</h3>
<p>Một bạn dùng Windows sửa <code>staging.env</code> bằng Notepad và tệp được lưu với ký tự xuống dòng CRLF. <code>--env-file</code> của Docker chịu được (Docker 29.8 trong phòng thí nghiệm này bỏ <code>\\r</code> đi), nhưng một shell <em>source</em> (nạp) tệp đó — như script <code>app-restart</code> ở bài 14.2 — thì không:</p>
<div class="out">$ file env/staging-crlf.env
env/staging-crlf.env: ASCII text, with CRLF line terminators
$ docker run --rm --env-file env/staging-crlf.env dv14-app:a1b2c3d python3 -c "import os; print(repr(os.environ[\\"APP_ENV\\"]))"
'staging'
$ set -a; . /tmp/staging-crlf.env; set +a; printf %q\\\\n "$APP_ENV"
$'staging\\r'
$ sed -i "s/\\r$//" /tmp/staging-crlf.env   # hoặc dos2unix
staging</div>
<p><code>staging\\r</code> không phải là <code>staging</code>: phép so <code>[ "$APP_ENV" = staging ]</code> trượt, và một URL cơ sở dữ liệu có <code>\\r</code> ở cuối sẽ không kết nối được với một thông báo lỗi khó hiểu. Thêm <code>*.env text eol=lf</code> vào <code>.gitattributes</code>, và cho script deploy chạy <code>file</code> trên các tệp env. Trên macOS, <code>sed -i</code> cần thêm một đối số rỗng (<code>sed -i '' …</code>) — hoặc sửa ngay trên máy chủ Linux như ở trên.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> ảnh frontend của nhóm được build với <code>NEXT_PUBLIC_API_URL</code> và có hai Dockerfile, mỗi môi trường một cái. Trước buổi bảo vệ bạn phải chứng minh staging và production chạy cùng những byte đó, và staging không chứa dữ liệu bệnh nhân thật nào.</p>
<ol>
<li>Build lại frontend thí nghiệm để địa chỉ API được ghi vào <code>config.js</code> lúc khởi động. Chạy hai lần với hai <code>API_URL</code> từ một ảnh; xác nhận bằng <code>curl /config.js</code>.</li>
<li>Chạy nó một lần không có <code>API_URL</code>; ghi lại mã thoát.</li>
<li>Dump cơ sở dữ liệu "production" thí nghiệm sang staging, ẩn danh, và chạy hai phép kiểm.</li>
<li>Thêm một cờ cho một tính năng nhìn thấy được; gạt nó 0 → 10 → 100 → 0 trong lúc một vòng <code>curl</code> đang chạy, và đếm bao nhiêu người dùng thấy nó ở mỗi nấc.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>docker inspect</code> cho thấy một digest cho cả hai container, lần chạy thiếu biến thoát với mã khác 0, số email thật trên staging là <code>0</code> mà số lịch hẹn không đổi, và sổ ghi của bạn có bốn con số từ vòng lặp cờ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Environment (môi trường)</span><span class="v">Một bản chạy trọn vẹn của hệ thống: app, cơ sở dữ liệu, tên miền, bí mật.</span></div>
  <div class="kv"><span class="k">Staging (bản dàn dựng)</span><span class="v">Bản giống production, nơi một bản phát hành được thử trước khi người dùng thấy.</span></div>
  <div class="kv"><span class="k">Promote (đẩy tiếp)</span><span class="v">Đưa chính cái ảnh đã kiểm sang môi trường kế tiếp — không build lại.</span></div>
  <div class="kv"><span class="k">Build-time / run-time config (cấu hình lúc build / lúc chạy)</span><span class="v">Giá trị bị chép vào ảnh khi build, so với giá trị đọc từ môi trường khi container khởi động.</span></div>
  <div class="kv"><span class="k">Anonymisation (ẩn danh hoá)</span><span class="v">Thay mọi thứ nhận ra được một người mà giữ nguyên hình dạng và quan hệ của dữ liệu.</span></div>
  <div class="kv"><span class="k">Preview environment (môi trường xem trước)</span><span class="v">Một bản sống ngắn cho mỗi pull request, ở địa chỉ riêng.</span></div>
  <div class="kv"><span class="k">Feature flag (cờ tính năng)</span><span class="v">Công tắc lúc chạy quyết định ai thấy một tính năng đã được deploy.</span></div>
  <div class="kv"><span class="k">Dev/prod parity (tương đồng dev–prod)</span><span class="v">Giữ dev, staging và production giống nhau nhất có thể về mã, phần mềm và công cụ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Build một ảnh rồi đẩy tiếp nó; staging và production chỉ khác tệp env — chứng minh bằng cách so digest.</li>
<li>Giá trị nào khác nhau giữa các môi trường thì không được đọc lúc build; trong phòng thí nghiệm một URL nướng sẵn đã đưa production sang API của staging.</li>
<li>Đọc cấu hình lúc container khởi động, và để một biến bị thiếu làm việc khởi động dừng lại thật ồn ào.</li>
<li>Dữ liệu staging nên giống thật và được ẩn danh ngay phía production, kèm phép kiểm không còn định danh thật nào.</li>
<li>Môi trường preview cho mỗi pull request một địa chỉ; gỡ nó khi PR đóng là một phần của thiết kế.</li>
<li>Feature flag tách deploy khỏi phát hành; tăng dần, giữ làm công tắc khẩn, và xoá khi xong.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — III. Config</span><span class="lc-sub">12factor.net/config — cấu hình khác nhau giữa các lần deploy thuộc về biến môi trường.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — X. Dev/prod parity</span><span class="lc-sub">12factor.net/dev-prod-parity — ba khoảng cách: thời gian, con người, công cụ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — Feature Toggles</span><span class="lc-sub">martinfowler.com/articles/feature-toggles.html — cờ phát hành, vận hành, thí nghiệm, phân quyền, và cái giá của chúng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_dump</span><span class="lc-sub">postgresql.org/docs/current/app-pgdump.html — định dạng custom dùng ở đây.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">GitHub Actions — sự kiện pull_request</span><span class="lc-sub">/courses/github-actions/learn${REF} — chạy thật workflow preview.</span></span></div>
</div>
`,
    },
    /* ─────────────────────────── 14.2 ─────────────────────────── */
    {
      title: "14.2 — Two servers behind a load balancer: health checks, state, rolling deploys|||14.2 — Hai máy sau bộ cân bằng tải: kiểm sức khoẻ, trạng thái, deploy lần lượt",
      slug: "deploy-14-2-hai-may-can-bang-tai",
      type: "LESSON",
      isFreePreview: true,
      description: "nginx upstream và HAProxy trước hai VPS thí nghiệm, đo khi rút mạng một máy, zone làm chia đều, phiên trong bộ nhớ và ảnh trên đĩa làm hỏng gì, một tiến trình cũ âm thầm phục vụ qua keep-alive, rolling 0 lỗi so với tráo cùng lúc 325 lỗi, và canary 10%.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.2</span>
<h2>Two servers behind a load balancer: health checks, state that leaves the machine, rolling deploys</h2>
<p class="lead">Every chapter so far had one machine, so every problem with that machine — a kernel update that needs a reboot, a full disk, a provider's maintenance window, an OOM kill — was a problem for every user at once. The usual next step is a second server and a <em>load balancer</em> (bộ cân bằng tải) in front of both. This lesson builds exactly that from three lab VPSes, pulls the network cable of one under load, and finds out what breaks: the obvious things (sessions, uploads) and one that was not obvious at all.</p>

<h3>What a load balancer adds, and what it does not</h3>
${slide('dv-14', 9, 'Một bộ cân bằng tải trước hai máy app; Redis và Postgres dùng chung; LB và DB vẫn là điểm chết')}
<p>The lab is three Ubuntu 24.04 containers with sshd on one Docker network, reached from the Mac over SSH like rented servers:</p>
<table>
<tr><th>Machine</th><th>Address</th><th>SSH from the Mac</th><th>Runs</th></tr>
<tr><td><code>dv14-lb</code></td><td>172.30.14.100</td><td><code>127.0.0.1:19142</code></td><td>nginx 1.24.0 on :80, HAProxy 2.8.16 on :81</td></tr>
<tr><td><code>dv14-vps1</code></td><td>172.30.14.101</td><td><code>127.0.0.1:19143</code></td><td>the app on :8000 (Python, one process)</td></tr>
<tr><td><code>dv14-vps2</code></td><td>172.30.14.102</td><td><code>127.0.0.1:19144</code></td><td>the same app</td></tr>
<tr><td><code>dv14-redis</code></td><td>(Docker DNS name)</td><td>—</td><td>Redis 7, shared by both app servers</td></tr>
</table>
<p>Each app server keeps releases the way Chapter 1 taught: <code>/srv/app/releases/&lt;version&gt;</code>, a <code>current</code> symlink, configuration in <code>/etc/app.env</code>, and a small <code>app-restart</code> script that stops the old process with SIGTERM, waits for it, starts the new one and checks <code>/health</code>.</p>
<p>A load balancer gives you three things: users keep being served when one app server dies; you can deploy one server at a time; and you can add capacity by adding servers. It does <strong>not</strong> remove every single point of failure. The balancer itself is now one machine, and the database is one machine. Providers sell a managed load balancer (several machines behind one address) and managed databases with replicas precisely for that; a student project can accept both, as long as it knows it did.</p>

<h3>nginx as a load balancer, and the <code>zone</code> it needs</h3>
${slide('dv-14', 10, 'nginx upstream: thiếu zone thì mười worker mỗi cái tự đếm, mười request mới đều về vps1')}
<p>An <code>upstream</code> block lists the servers; <code>proxy_pass</code> sends requests to the group (cú pháp đầy đủ: <code>/courses/nginx</code>):</p>
<pre><code class="language-nginx">upstream app {
    zone app 64k;                                             <span class="tok-comment"># trạng thái CHUNG cho mọi worker</span>
    server 172.30.14.101:8000 max_fails=1 fail_timeout=10s;   <span class="tok-comment"># dv14-vps1</span>
    server 172.30.14.102:8000 max_fails=1 fail_timeout=10s;   <span class="tok-comment"># dv14-vps2</span>
    keepalive 16;                                             <span class="tok-comment"># giữ sẵn kết nối tới app</span>
}
server {
    listen 80 default_server;
    location / {
        proxy_pass http://app;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_connect_timeout 2s;
        proxy_next_upstream error timeout;    <span class="tok-comment"># mặc định: máy này không trả lời thì thử máy kia</span>
        add_header X-Upstream $upstream_addr always;
    }
}</code></pre>
<table>
<tr><th>Directive</th><th>What it does</th></tr>
<tr><td><code>server … max_fails=1 fail_timeout=10s</code></td><td>After 1 failed attempt, treat the server as unavailable for 10 seconds, then try it again with a real request.</td></tr>
<tr><td><code>weight=9</code> / <code>backup</code> / <code>down</code></td><td>Send 9× the share / only when all others are down / never.</td></tr>
<tr><td><code>least_conn;</code> / <code>ip_hash;</code></td><td>Balancing method: fewest active connections / same client IP → same server (a crude "sticky session").</td></tr>
<tr><td><code>zone app 64k;</code></td><td>Keep the group's state in shared memory so all worker processes see the same counters and failures.</td></tr>
<tr><td><code>keepalive 16;</code> + <code>proxy_http_version 1.1</code> + empty <code>Connection</code></td><td>Reuse connections to the app instead of opening one per request.</td></tr>
<tr><td><code>proxy_connect_timeout 2s</code></td><td>A server that does not accept the connection within 2 s counts as failed (default 60 s).</td></tr>
<tr><td><code>proxy_next_upstream error timeout</code></td><td>The default: on a connection error or timeout, retry on the next server — but a non-idempotent request (POST) is not retried once it has been sent.</td></tr>
</table>
<p>The first version in the lab had no <code>zone</code>, and the first ten requests told a strange story:</p>
<div class="out">$ nproc ; grep worker_processes /etc/nginx/nginx.conf
10
worker_processes auto;
# upstream WITHOUT zone — nginx just started
$ for i in $(seq 1 10); do curl -s localhost/; done | sort | uniq -c
     10 {"may": "dv14-vps1", "ban": "v1", "env": "production", "db": ""}
# added "zone app 64k;", restarted
$ for i in $(seq 1 10); do curl -s localhost/; done | sort | uniq -c
      5 {"may": "dv14-vps1", "ban": "v1", "env": "production", "db": ""}
      5 {"may": "dv14-vps2", "ban": "v1", "env": "production", "db": ""}</div>
<p><code>worker_processes auto</code> started ten workers (one per CPU the container sees). Without a zone, each worker keeps its own round-robin position, starting at the first server. Ten new connections landed on ten different workers, and each worker's "first turn" was vps1. With real traffic it evens out over time, but the per-worker state also means one worker can keep sending to a server another worker already knows is dead. The <code>zone</code> is one line; put it in every upstream.</p>

<h3>Pull the network cable of one server under load</h3>
${slide('dv-14', 11, 'Rút mạng một máy lúc có tải: nginx để một request treo, HAProxy chỉ chậm hai request rồi đánh dấu DOWN')}
<p>A small load script on <code>dv14-lb</code> sends requests back to back and writes one line per request — second, status, time, which server answered:</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># tai.sh &lt;giây&gt; &lt;url&gt; — bắn request liên tục; mỗi dòng: giây-thứ  mã  thời-gian  máy-trả-lời</span>
D=$1; URL=$2; t0=\${EPOCHREALTIME/./}
while :; do
  el=$(( (\${EPOCHREALTIME/./} - t0) / 100000 ))          <span class="tok-comment"># đơn vị 0,1 giây</span>
  (( el &gt;= D * 10 )) &amp;&amp; break
  r=$(curl -s -o /dev/null -m 10 -w '%{http_code} %{time_total} %header{x-upstream}' "$URL")
  printf '%d.%d %s\\n' $((el / 10)) $((el % 10)) "$r"
done</code></pre>
<p>First, the gentle failure: the app process on vps2 is killed with <code>kill -9</code> at second 3 (the machine is still up, the port is closed):</p>
<div class="out">$ bash tai.sh 8 http://localhost/     # 352 requests
352 × 200
3.7 200 0.000983 172.30.14.102:8000, 172.30.14.101:8000
$ sudo tail -1 /var/log/nginx/error.log
… connect() failed (111: Connection refused) while connecting to upstream, … upstream: "http://172.30.14.102:8000/", …</div>
<p>(The count line summarises the 352 lines the script printed.) A refused connection is instant, so nginx retried on vps1 inside the same request; the <code>X-Upstream</code> header lists both addresses. No user saw an error.</p>
<p>Then the hard failure: the whole machine disappears from the network (<code>docker network disconnect</code>, which is what a crashed VPS or a broken switch looks like from outside — packets go unanswered):</p>
<div class="out">$ bash tai.sh 25 http://localhost/     # nginx :80, vps2 unplugged at second 3
3.0 200 0.000711 172.30.14.101:8000
3.0 000 10.001892
13.0 200 2.006872 172.30.14.102:8000, 172.30.14.101:8000
# count: 485 × 200 · 1 × 000
$ sudo cat /var/log/nginx/error.log
… upstream timed out (110: Connection timed out) while connecting to upstream, …</div>
<p>One request hung: it had already been sent on a kept-alive connection to vps2 when the cable was pulled, so nginx was waiting for a reply that would never come. <code>curl -m 10</code> gave up at 10 s; a browser would have waited for nginx's <code>proxy_read_timeout</code>, 60 s by default. The next request that tried vps2 paid the 2-second <code>proxy_connect_timeout</code> and was retried on vps1; then vps2 was skipped for <code>fail_timeout</code>. That is <em>passive</em> health checking: nginx (the free version) learns that a server is dead only when a real user's request fails on it.</p>

<h3>HAProxy asks each server every second</h3>
${slide('dv-14', 12, 'HAProxy kiểm sức khoẻ chủ động: GET /health mỗi giây, hai lần hỏng là DOWN, xem bằng show stat')}
<p>HAProxy is a dedicated load balancer. Its main advantage here is <em>active</em> health checks: it calls <code>/health</code> on each server on its own schedule, with no user involved.</p>
<pre><code class="language-ini">global
    stats socket /run/haproxy.sock mode 660 level admin   <span class="tok-comment"># cổng điều khiển lúc chạy</span>
defaults
    mode http
    timeout connect 2s
    timeout client  30s
    timeout server  5s            <span class="tok-comment"># app im 5 s ⇒ trả 504, không treo 60 s</span>
    retries 2
    option redispatch             <span class="tok-comment"># thử lại thì chuyển sang máy KHÁC</span>
frontend web
    bind :81
    http-response set-header X-Upstream %s
    default_backend app
backend app
    balance roundrobin
    option httpchk GET /health
    http-check expect status 200
    default-server inter 1s fall 2 rise 2     <span class="tok-comment"># hỏi mỗi 1 s; 2 lần hỏng = DOWN; 2 lần tốt = UP</span>
    server vps1 172.30.14.101:8000 check
    server vps2 172.30.14.102:8000 check</code></pre>
<p>The same experiment — vps2 unplugged at second 3, plugged back in at second 9:</p>
<div class="out">$ bash tai.sh 14 http://localhost:81/
3.1 200 2.007538 vps1
5.1 200 2.008790 vps1
10.4 200 0.000728 vps2
# count: 1527 × 200 · 0 errors
$ echo "show stat" | sudo socat stdio /run/haproxy.sock | grep "^app," | cut -d, -f1,2,18,22,23,24,37
app,vps1,UP,0,0,43,L7OK
app,vps2,UP,2,1,24,L7OK
app,BACKEND,UP,,0,43,</div>
<p>Two requests were slowed by 2 s (a connect timeout, then <code>redispatch</code> to vps1); after two failed checks vps2 was marked DOWN and every request went to vps1; 1.4 s after the cable went back, two good checks put it back in rotation. The <code>show stat</code> columns chosen with <code>cut</code> are name, status, <code>chkfail</code> (2 failed checks), <code>chkdown</code> (went DOWN once), seconds since the last change, and the last check result. In this run no request happened to be in flight on vps2 at the moment of the cut; if one had been, <code>timeout server 5s</code> would have ended it with a 504 after 5 s instead of 60.</p>
<table>
<tr><th></th><th>nginx (open source)</th><th>HAProxy</th></tr>
<tr><td>Notices a dead server</td><td>when a real request fails on it</td><td>its own check, every <code>inter</code></td></tr>
<tr><td>Take one server out for a deploy</td><td>edit the file, <code>nginx -s reload</code></td><td><code>set server app/vps1 state drain</code> on the socket</td></tr>
<tr><td>See the state</td><td>error log</td><td><code>show stat</code>, a stats page</td></tr>
<tr><td>Also serves files, TLS, caching</td><td>yes</td><td>TLS yes; it is not a web server</td></tr>
</table>
<p>Many setups use both: nginx for TLS and static files, HAProxy (or a cloud load balancer) to spread requests. For two servers, either is fine as long as the timeouts are set on purpose.</p>

<h3>State has to leave the machine</h3>
${slide('dv-14', 13, 'Phiên trong bộ nhớ: đăng nhập ở vps1, sang vps2 thành chưa đăng nhập; ảnh lưu ở vps1 thì vps2 404; phiên ra Redis thì hết')}
<p>With one server, "store the session in memory" and "save the upload to <code>/srv/uploads</code>" both work. With two, they become random failures:</p>
<div class="out">$ curl -s -c jar -X POST "localhost/login?u=cuong"
{"dang_nhap": "cuong", "may": "dv14-vps1"}
$ for i in 1 2 3 4 5 6; do curl -s -b jar localhost/me; done
{"user": "cuong", "may": "dv14-vps1"}
{"loi": "chua dang nhap", "may": "dv14-vps2"}
{"user": "cuong", "may": "dv14-vps1"}
{"loi": "chua dang nhap", "may": "dv14-vps2"}
{"user": "cuong", "may": "dv14-vps1"}
{"loi": "chua dang nhap", "may": "dv14-vps2"}
$ head -c 300000 /dev/urandom | curl -s -X POST --data-binary @- "localhost/upload?name=anh-dai-dien.jpg"
{"luu": "anh-dai-dien.jpg", "byte": 300000, "may": "dv14-vps1"}
$ for i in 1 2 3 4; do curl -s localhost/files/anh-dai-dien.jpg; done
{"loi": "khong co tep", "may": "dv14-vps2"}
{"tep": "anh-dai-dien.jpg", "byte": 300000, "may": "dv14-vps1"}
{"loi": "khong co tep", "may": "dv14-vps2"}
{"tep": "anh-dai-dien.jpg", "byte": 300000, "may": "dv14-vps1"}</div>
<p>Every other click logs the user out; every other avatar is a broken image. Moving the sessions to Redis — one line in <code>/etc/app.env</code> on both machines — fixes the first:</p>
<div class="out">$ grep SESSION /etc/app.env      # dv14-vps1
SESSION_STORE=redis://dv14-redis:6379/1
$ grep SESSION /etc/app.env      # dv14-vps2
SESSION_STORE=redis://dv14-redis:6379/1
$ curl -s -c jar -X POST "localhost/login?u=cuong"
{"dang_nhap": "cuong", "may": "dv14-vps2"}
$ for i in 1 2 3 4; do curl -s -b jar localhost/me; done
{"user": "cuong", "may": "dv14-vps1"}
{"user": "cuong", "may": "dv14-vps2"}
{"user": "cuong", "may": "dv14-vps1"}
{"user": "cuong", "may": "dv14-vps2"}
$ docker exec dv14-redis redis-cli -n 1 --scan --pattern "sess:*"
sess:aa3d78235bbd0d3f
$ docker exec dv14-redis redis-cli -n 1 TTL sess:aa3d78235bbd0d3f
3591</div>
<table>
<tr><th>State</th><th>Where it goes</th><th>Course</th></tr>
<tr><td>Login sessions</td><td>Redis or the database — or a signed token (JWT) that needs no server-side store</td><td><code>/courses/redis</code></td></tr>
<tr><td>Uploaded files</td><td>object storage (R2/S3), served through a CDN (Chapter 12.4)</td><td><code>/courses/object-storage</code></td></tr>
<tr><td>Scheduled jobs (cron), the daily news post</td><td>exactly one machine, or a queue — otherwise two servers send the email twice</td><td>—</td></tr>
<tr><td>In-process caches</td><td>fine, as long as a stale copy on one machine is acceptable</td><td>—</td></tr>
</table>
<p><em>Sticky sessions</em> (<code>ip_hash</code>, or a cookie the balancer reads) are the band-aid: each user stays on one server. It hides the problem until that server dies or is taken out for a deploy — at which point its users are logged out anyway — and it spreads load unevenly when many users share one IP (a whole university behind one NAT). Use it only as a bridge while moving state out.</p>

<h3>A graceful stop that wasn't: the old process kept serving</h3>
${slide('dv-14', 14, 'Tiến trình cũ đã thôi nghe cổng nhưng giữ kết nối keep-alive của nginx nên vẫn phục vụ; sửa bằng Connection close + timeout')}
<p>The Redis switch above did not work the first time. After <code>app-restart</code> on both machines, half the requests still said "not logged in" — from vps1, which had the new setting. The machine told the story:</p>
<div class="out">$ pgrep -af app.py
231 python3 /srv/app/current/app.py
1446 python3 /srv/app/current/app.py
$ sudo ss -tnp state established "( sport = :8000 )"
Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
0      0      172.30.14.101:8000 172.30.14.100:53606 users:(("python3",pid=231,fd=5))
$ sudo ss -tlnp "( sport = :8000 )"
State  Recv-Q Send-Q Local Address:Port Peer Address:PortProcess
LISTEN 0      5            0.0.0.0:8000      0.0.0.0:*    users:(("python3",pid=1446,fd=3))</div>
<p>Two app processes. The new one (1446) owns the listening socket. The old one (231) had received SIGTERM, stopped accepting new connections and closed its listening socket — and was still waiting for its open connections to finish. But those were nginx's <code>keepalive</code> connections, which never "finish": nginx kept sending new requests down them, and the old process, with its old in-memory sessions, kept answering. <code>app-restart</code> waited 10 s, gave up waiting and started the new process anyway, so both ran. No error anywhere, only "not logged in" half the time.</p>
<p>This is Chapter 3.2's drain problem in a new form: a graceful stop must close <em>idle</em> keep-alive connections and tell the proxy not to reuse the busy ones. The fix in the app:</p>
<pre><code class="language-python">DUNG = threading.Event()                  <span class="tok-comment"># bật khi nhận SIGTERM</span>

class H(http.server.BaseHTTPRequestHandler):
    timeout = 5                           <span class="tok-comment"># kết nối keep-alive ngồi không quá 5 s thì đóng</span>
    def send(self, code, obj, headers=()):
        ...
        if DUNG.is_set():                 <span class="tok-comment"># đang dừng: báo proxy đừng dùng lại kết nối này</span>
            self.send_header('Connection', 'close'); self.close_connection = True

def tat(*_):
    DUNG.set()
    threading.Thread(target=srv.shutdown).start()</code></pre>
<div class="out">$ time sudo app-restart
dv14-vps1: v1 len
real    0m5.268s
$ pgrep -af "^python3"
1700 python3 /srv/app/current/app.py</div>
<p>One process, and the restart takes about 5 s — the idle timeout. Node, Gunicorn and most servers have the same two settings (<code>server.keepAliveTimeout</code> and closing connections on shutdown in Node; <code>--keep-alive</code> in Gunicorn). The lesson for deploy scripts is broader: after a restart, <strong>check that exactly one process is serving</strong> (<code>pgrep</code>, or the version in <code>/health</code> from several requests), not just that a new one started.</p>

<h3>Rolling deploys: one server at a time</h3>
${slide('dv-14', 15, 'Rolling: rút từng máy khỏi HAProxy, tráo, kiểm, trả về — 0 lỗi; tráo cả hai cùng lúc — 325 lỗi trong 3,5 giây')}
<p>With two servers you can deploy without users noticing: take one out of the balancer, wait for its requests to finish, swap it, check it, put it back, then do the other. HAProxy's socket makes each step one command:</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># rolling.sh &lt;bản&gt; — deploy lần lượt từng máy sau HAProxy: rút khỏi LB → tráo → kiểm → trả về LB</span>
set -euo pipefail
BAN=$1
LB=19142
cong() { case $1 in vps1) echo 19143;; vps2) echo 19144;; esac; }   <span class="tok-comment"># bash 3.2 của macOS không có mảng kết hợp</span>
hap() { ./ssh.sh $LB "echo '$1' | sudo socat stdio /run/haproxy.sock"; }
for m in vps1 vps2; do
  echo "== $(date +%T) $m: drain (không nhận request MỚI)"
  hap "set server app/$m state drain" &gt;/dev/null
  until [ "$(hap "show stat" | awk -F, -v m=$m '$1=="app" &amp;&amp; $2==m {print $5}')" = 0 ]; do sleep 0.2; done   <span class="tok-comment"># cột 5 = scur</span>
  echo "   $(date +%T) $m: hết request dở, tráo sang $BAN"
  ./ssh.sh $(cong $m) "sudo mkdir -p /srv/app/releases/$BAN &amp;&amp; sudo cp /tmp/app.py /srv/app/releases/$BAN/ \\
     &amp;&amp; sudo ln -sfn /srv/app/releases/$BAN /srv/app/current &amp;&amp; sudo app-restart"
  ./ssh.sh $(cong $m) "curl -fs 127.0.0.1:8000/health" | grep -q "\\"ban\\": \\"$BAN\\"" \\
     || { echo "!! $m không lên $BAN — DỪNG, máy kia vẫn phục vụ bản cũ"; exit 1; }
  hap "set server app/$m state ready" &gt;/dev/null
  until [ "$(hap "show stat" | awk -F, -v m=$m '$1=="app" &amp;&amp; $2==m {print $18}')" = UP ]; do sleep 0.2; done   <span class="tok-comment"># cột 18 = status</span>
  echo "   $(date +%T) $m: UP trở lại trong LB"
done
echo "== xong: cả hai máy chạy $BAN"</code></pre>
<p>Under a load of <code>/slow?s=0.2</code> requests through HAProxy:</p>
<div class="out">$ ./rolling.sh v3
== 16:25:54 vps1: drain (không nhận request MỚI)
   16:25:54 vps1: hết request dở, tráo sang v3
dv14-vps1: v3 len
   16:25:59 vps1: UP trở lại trong LB
== 16:25:59 vps2: drain (không nhận request MỚI)
   16:26:00 vps2: hết request dở, tráo sang v3
dv14-vps2: v3 len
   16:26:04 vps2: UP trở lại trong LB
== xong: cả hai máy chạy v3
# load: 91 requests, 91 × 200</div>
<p>Zero errors. For comparison, the "just restart both" version — the same swap, sent to both servers at the same moment:</p>
<div class="out"># both swapped at once, same load through HAProxy
3.0 200 v3
3.2 502
3.2 502
3.2 503
# … 321 more lines of 503 …
6.7 503
6.7 200 v4
# count: 60 × 200 · 2 × 502 · 323 × 503</div>
<p>For 3.5 s no server passed its health check, and HAProxy answered 503 "no server available" as fast as the load script could ask — 325 failures. On a real site each of those is a user.</p>
<table>
<tr><th>Strategy</th><th>How</th><th>Needs</th><th>Mixed versions?</th></tr>
<tr><td>All at once</td><td>restart everything</td><td>nothing</td><td>no — but there is a gap</td></tr>
<tr><td>Rolling</td><td>one server at a time behind the balancer</td><td>≥ 2 servers, a drain step</td><td><strong>yes</strong>, for a few seconds</td></tr>
<tr><td>Blue-green (Chapter 3.3)</td><td>a full second copy, switch the proxy</td><td>2× resources during the deploy</td><td>no</td></tr>
<tr><td>Canary</td><td>a small share first, watch, then the rest</td><td>weights or flags, and metrics</td><td>yes, on purpose</td></tr>
</table>
<p>The "mixed versions" column is the catch of rolling deploys: for a few seconds v2 and v3 serve at once, so v3 must work with v2's data and v2 must survive v3's database changes. That is exactly the expand/contract migration rule of Chapter 5 — with two servers it stops being optional.</p>

<h3>Canary: let 10% try it first</h3>
${slide('dv-14', 16, 'Canary: đặt trọng số 9:1 trên HAProxy lúc chạy, 100 trên 1000 request tới bản mới')}
<div class="out"># dv14-vps2 runs v5 (the canary), dv14-vps1 still v4
$ echo "set weight app/vps1 9" | sudo socat stdio /run/haproxy.sock
$ echo "set weight app/vps2 1" | sudo socat stdio /run/haproxy.sock
$ for i in $(seq 1 1000); do curl -s localhost:81/ | grep -o "\\"ban\\": \\"v[0-9]\\""; done | sort | uniq -c
    900 "ban": "v4"
    100 "ban": "v5"</div>
<p>Exactly 100 of 1,000 requests reached v5, with no reload. Then you <em>compare numbers</em> — the canary's 5xx rate and p95 latency against the old server's (Chapter 9 has the tools) — before moving to 50% and 100%. Backing out is <code>set weight app/vps2 0</code>. Weighting by server means one user can bounce between v4 and v5 from click to click; if that matters, split by user instead — a cookie the balancer reads, or the feature flag of 14.1.</p>

<h3>The database stays one — for now</h3>
<p>Two app servers share one Postgres. That is the right shape for a student project and for most small products: app servers are easy to duplicate because they hold no state; the database is hard because it is the state. When it becomes the thing that must not die, the options are a managed database with automatic failover, or your own streaming replica promoted by hand — both in <code>/courses/postgresql</code>. Put the database on its own machine (or managed service) <em>before</em> you need replicas; it is also what makes the migration in 14.4 simpler.</p>

<h3>Try it step by step</h3>
<ol>
<li>Build an Ubuntu 24.04 image with <code>openssh-server nginx haproxy python3 python3-redis socat</code>; start <code>dv14-lb</code>, <code>dv14-vps1</code>, <code>dv14-vps2</code> on one network with fixed IPs; add your lab key.</li>
<li>Copy the app and <code>app-restart</code> to both app servers; start them; <code>curl</code> each directly.</li>
<li>Configure the nginx upstream <em>without</em> <code>zone</code>, run ten requests, then add it and run ten again.</li>
<li>Run <code>tai.sh</code> and, from the Mac, <code>docker network disconnect dv14-net dv14-vps2</code>; reconnect with <code>--ip 172.30.14.102</code>. Repeat through HAProxy.</li>
<li>Log in through the balancer, loop <code>/me</code>; switch to Redis; loop again; check <code>pgrep</code> on both servers.</li>
<li>Run <code>rolling.sh</code> under load, then the all-at-once version, and count the non-200 lines.</li>
</ol>

<div class="pitfall co-tieu-de"><strong>Trap — "the restart succeeded" when the old process is still serving.</strong> A deploy script that checks <code>/health</code> once after starting the new process can pass while an old process still holds keep-alive connections from the proxy and answers part of the traffic with old code and old in-memory state. The symptom is intermittent and has no error message. Check that exactly one process runs, and ask <code>/health</code> through the balancer several times to see only the new version.</div>

<h3>On macOS and Windows: the deploy script runs on your laptop</h3>
<p><code>rolling.sh</code> runs on the Mac and SSHes into each server. Its first version used a Bash associative array (<code>declare -A CONG=([vps1]=19143 …)</code>) and failed at once:</p>
<div class="out">$ /bin/bash --version | head -1
GNU bash, version 3.2.57(1)-release (arm64-apple-darwin26)
$ ./rolling.sh v2
./rolling.sh: line 5: vps1: unbound variable</div>
<p>macOS ships Bash 3.2 (2007) for licensing reasons; associative arrays arrived in Bash 4. Either write the script for 3.2 (a <code>case</code> function, as above), or run it on a Linux machine, or install a newer Bash and call it explicitly. On Windows, run deploy scripts inside WSL, where Bash is current and <code>ssh</code>, <code>socat</code> and <code>awk</code> behave as on the server — Git Bash lacks <code>socat</code> and handles paths differently. Also check that the script file has LF line endings (14.1): <code>bash\\r: No such file or directory</code> is the CRLF version of this failure.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the group's VPS provider announces a maintenance reboot during the week of the defence. You add a second server behind a balancer and must show the lecturer, live, that one server can disappear and a deploy can happen without anyone being logged out.</p>
<ol>
<li>Build the three-machine lab; configure HAProxy with <code>httpchk GET /health</code>, <code>inter 1s fall 2 rise 2</code>.</li>
<li>Run a load loop and unplug one server's network; record the number of non-200 responses and the slowest request.</li>
<li>Log in, loop <code>/me</code> through the balancer; move sessions to Redis on both servers; loop again; confirm with <code>pgrep</code> that each server runs one app process.</li>
<li>Run <code>rolling.sh</code> to a new version under load.</li>
</ol>
<p><strong>Done when:</strong> your notes show the unplug result (errors, slowest time), <code>/me</code> answers "cuong" from both servers, each server has exactly one app process, and the rolling deploy finished with 0 non-200 responses and both servers reporting the new version.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Load balancer</span><span class="v">A proxy that spreads requests over several servers and skips the ones that are down.</span></div>
  <div class="kv"><span class="k">Upstream / backend</span><span class="v">The group of servers behind the balancer (nginx / HAProxy word).</span></div>
  <div class="kv"><span class="k">Passive vs active health check</span><span class="v">Learning a server is dead from failed user requests vs asking it on a schedule.</span></div>
  <div class="kv"><span class="k">Drain</span><span class="v">Stop sending new requests to a server and let its current ones finish.</span></div>
  <div class="kv"><span class="k">Stateless server</span><span class="v">A server that keeps nothing between requests, so any copy can answer any request.</span></div>
  <div class="kv"><span class="k">Sticky session</span><span class="v">Pinning each user to one server — a workaround for state, not a fix.</span></div>
  <div class="kv"><span class="k">Rolling deploy</span><span class="v">Updating servers one at a time while the others keep serving.</span></div>
  <div class="kv"><span class="k">Canary</span><span class="v">Sending a small share of traffic to the new version first and comparing its numbers.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A balancer in front of two servers survives one server's death and allows deploys without downtime; the balancer and the database remain single points.</li>
<li>Give every nginx upstream a <code>zone</code>; without it, ten workers sent ten of ten new requests to one server.</li>
<li>nginx notices a dead server only through failed requests (one request hung 10 s in the lab); HAProxy's active checks marked it DOWN with no errors.</li>
<li>Sessions, uploads and scheduled jobs must leave the app servers — in memory they became "logged out" and 404 on every other click.</li>
<li>A graceful stop must close keep-alive connections; otherwise an old process silently keeps serving old code.</li>
<li>Rolling one server at a time gave 0 errors; restarting both at once gave 325 in 3.5 s; a 9:1 weight sent exactly 10% to a canary.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — ngx_http_upstream_module</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_upstream_module.html — server parameters, zone, keepalive, balancing methods.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">HAProxy 2.8 — Configuration Manual</span><span class="lc-sub">docs.haproxy.org/2.8/configuration.html — httpchk, inter/fall/rise, redispatch, timeouts.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — reverse proxy and load balancing</span><span class="lc-sub">/courses/nginx/learn${REF} — the upstream syntax in depth.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Redis — sessions and caching</span><span class="lc-sub">/courses/redis/learn${REF} — where the sessions went.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Object storage — R2 and S3</span><span class="lc-sub">/courses/object-storage/learn${REF} — where the uploads go.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.2</span>
<h2>Hai máy sau bộ cân bằng tải: kiểm sức khoẻ, trạng thái ra khỏi máy, deploy lần lượt</h2>
<p class="lead">Mọi chương tới giờ chỉ có một máy, nên mọi sự cố của máy đó — một bản cập nhật nhân cần khởi động lại, đĩa đầy, nhà cung cấp bảo trì, OOM giết tiến trình — là sự cố của mọi người dùng cùng một lúc. Bước tiếp theo thường gặp là một máy chủ thứ hai và một <em>load balancer</em> (bộ cân bằng tải) đứng trước cả hai. Bài này dựng đúng như vậy từ ba VPS thí nghiệm, rút dây mạng một máy lúc đang có tải, và tìm xem cái gì hỏng: những thứ ai cũng đoán được (phiên đăng nhập, tệp tải lên) và một thứ không hề dễ đoán.</p>

<h3>Bộ cân bằng tải thêm được gì, và không thêm được gì</h3>
${slide('dv-14', 9, 'Một bộ cân bằng tải trước hai máy app; Redis và Postgres dùng chung; LB và DB vẫn là điểm chết')}
<p>Phòng thí nghiệm là ba container Ubuntu 24.04 có sshd trên cùng một mạng Docker, máy Mac SSH vào như vào máy chủ thuê:</p>
<table>
<tr><th>Máy</th><th>Địa chỉ</th><th>SSH từ Mac</th><th>Chạy gì</th></tr>
<tr><td><code>dv14-lb</code></td><td>172.30.14.100</td><td><code>127.0.0.1:19142</code></td><td>nginx 1.24.0 ở :80, HAProxy 2.8.16 ở :81</td></tr>
<tr><td><code>dv14-vps1</code></td><td>172.30.14.101</td><td><code>127.0.0.1:19143</code></td><td>app ở :8000 (Python, một tiến trình)</td></tr>
<tr><td><code>dv14-vps2</code></td><td>172.30.14.102</td><td><code>127.0.0.1:19144</code></td><td>cùng app đó</td></tr>
<tr><td><code>dv14-redis</code></td><td>(tên DNS của Docker)</td><td>—</td><td>Redis 7, hai máy app dùng chung</td></tr>
</table>
<p>Mỗi máy app giữ các bản phát hành theo đúng cách Chương 1 dạy: <code>/srv/app/releases/&lt;phiên-bản&gt;</code>, một symlink <code>current</code>, cấu hình ở <code>/etc/app.env</code>, và một script nhỏ <code>app-restart</code> dừng tiến trình cũ bằng SIGTERM, chờ nó, chạy tiến trình mới rồi kiểm <code>/health</code>.</p>
<p>Bộ cân bằng tải cho bạn ba thứ: người dùng vẫn được phục vụ khi một máy app chết; bạn deploy được từng máy một; và bạn thêm sức chứa bằng cách thêm máy. Nó <strong>không</strong> xoá hết mọi điểm chết. Bản thân bộ cân bằng giờ là một máy, và cơ sở dữ liệu là một máy. Các nhà cung cấp bán load balancer có quản lý (nhiều máy sau một địa chỉ) và cơ sở dữ liệu có quản lý kèm bản sao chính vì thế; một đồ án sinh viên chấp nhận cả hai được, miễn là biết mình đang chấp nhận.</p>

<h3>nginx làm bộ cân bằng tải, và cái <code>zone</code> nó cần</h3>
${slide('dv-14', 10, 'nginx upstream: thiếu zone thì mười worker mỗi cái tự đếm, mười request mới đều về vps1')}
<p>Khối <code>upstream</code> liệt kê các máy; <code>proxy_pass</code> gửi request tới cả nhóm (cú pháp đầy đủ: <code>/courses/nginx</code>):</p>
<pre><code class="language-nginx">upstream app {
    zone app 64k;                                             <span class="tok-comment"># trạng thái CHUNG cho mọi worker</span>
    server 172.30.14.101:8000 max_fails=1 fail_timeout=10s;   <span class="tok-comment"># dv14-vps1</span>
    server 172.30.14.102:8000 max_fails=1 fail_timeout=10s;   <span class="tok-comment"># dv14-vps2</span>
    keepalive 16;                                             <span class="tok-comment"># giữ sẵn kết nối tới app</span>
}
server {
    listen 80 default_server;
    location / {
        proxy_pass http://app;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_connect_timeout 2s;
        proxy_next_upstream error timeout;    <span class="tok-comment"># mặc định: máy này không trả lời thì thử máy kia</span>
        add_header X-Upstream $upstream_addr always;
    }
}</code></pre>
<table>
<tr><th>Chỉ thị</th><th>Làm gì</th></tr>
<tr><td><code>server … max_fails=1 fail_timeout=10s</code></td><td>Sau 1 lần hỏng, coi máy đó là không dùng được trong 10 giây, rồi thử lại bằng một request thật.</td></tr>
<tr><td><code>weight=9</code> / <code>backup</code> / <code>down</code></td><td>Nhận gấp 9 phần / chỉ nhận khi mọi máy khác chết / không bao giờ nhận.</td></tr>
<tr><td><code>least_conn;</code> / <code>ip_hash;</code></td><td>Cách chia: máy ít kết nối nhất / cùng IP khách → cùng máy (một kiểu "phiên dính" thô sơ).</td></tr>
<tr><td><code>zone app 64k;</code></td><td>Giữ trạng thái của nhóm trong bộ nhớ dùng chung, để mọi tiến trình worker thấy cùng bộ đếm và cùng những lần hỏng.</td></tr>
<tr><td><code>keepalive 16;</code> + <code>proxy_http_version 1.1</code> + <code>Connection</code> rỗng</td><td>Dùng lại kết nối tới app thay vì mỗi request mở một kết nối.</td></tr>
<tr><td><code>proxy_connect_timeout 2s</code></td><td>Máy không nhận kết nối trong 2 giây thì tính là hỏng (mặc định 60 giây).</td></tr>
<tr><td><code>proxy_next_upstream error timeout</code></td><td>Mặc định: lỗi kết nối hay hết giờ thì thử lại ở máy kế — nhưng request không idempotent (POST) đã gửi đi rồi thì không thử lại.</td></tr>
</table>
<p>Bản đầu tiên trong phòng thí nghiệm không có <code>zone</code>, và mười request đầu kể một câu chuyện lạ:</p>
<div class="out">$ nproc ; grep worker_processes /etc/nginx/nginx.conf
10
worker_processes auto;
# upstream KHÔNG có zone — nginx vừa khởi động
$ for i in $(seq 1 10); do curl -s localhost/; done | sort | uniq -c
     10 {"may": "dv14-vps1", "ban": "v1", "env": "production", "db": ""}
# thêm "zone app 64k;", khởi động lại
$ for i in $(seq 1 10); do curl -s localhost/; done | sort | uniq -c
      5 {"may": "dv14-vps1", "ban": "v1", "env": "production", "db": ""}
      5 {"may": "dv14-vps2", "ban": "v1", "env": "production", "db": ""}</div>
<p><code>worker_processes auto</code> chạy mười worker (mỗi CPU container thấy được một worker). Không có zone, mỗi worker tự giữ vị trí vòng tròn của riêng nó, bắt đầu từ máy đầu tiên. Mười kết nối mới rơi vào mười worker khác nhau, và "lượt đầu" của worker nào cũng là vps1. Với lưu lượng thật thì lâu dần nó đều ra, nhưng trạng thái riêng từng worker còn nghĩa là một worker có thể cứ gửi vào một máy mà worker khác đã biết là chết. <code>zone</code> chỉ một dòng; đặt nó vào mọi upstream.</p>

<h3>Rút dây mạng một máy lúc đang có tải</h3>
${slide('dv-14', 11, 'Rút mạng một máy lúc có tải: nginx để một request treo, HAProxy chỉ chậm hai request rồi đánh dấu DOWN')}
<p>Một script tạo tải nhỏ trên <code>dv14-lb</code> bắn request liên tục và ghi mỗi request một dòng — giây thứ mấy, mã trạng thái, thời gian, máy nào trả lời:</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># tai.sh &lt;giây&gt; &lt;url&gt; — bắn request liên tục; mỗi dòng: giây-thứ  mã  thời-gian  máy-trả-lời</span>
D=$1; URL=$2; t0=\${EPOCHREALTIME/./}
while :; do
  el=$(( (\${EPOCHREALTIME/./} - t0) / 100000 ))          <span class="tok-comment"># đơn vị 0,1 giây</span>
  (( el &gt;= D * 10 )) &amp;&amp; break
  r=$(curl -s -o /dev/null -m 10 -w '%{http_code} %{time_total} %header{x-upstream}' "$URL")
  printf '%d.%d %s\\n' $((el / 10)) $((el % 10)) "$r"
done</code></pre>
<p>Trước hết, kiểu hỏng nhẹ: tiến trình app trên vps2 bị <code>kill -9</code> ở giây thứ 3 (máy vẫn sống, cổng đã đóng):</p>
<div class="out">$ bash tai.sh 8 http://localhost/     # 352 request
352 × 200
3.7 200 0.000983 172.30.14.102:8000, 172.30.14.101:8000
$ sudo tail -1 /var/log/nginx/error.log
… connect() failed (111: Connection refused) while connecting to upstream, … upstream: "http://172.30.14.102:8000/", …</div>
<p>(Dòng đếm là tóm tắt của 352 dòng script in ra.) Kết nối bị từ chối là tức thì, nên nginx thử lại ở vps1 ngay trong cùng request đó; header <code>X-Upstream</code> liệt kê cả hai địa chỉ. Không người dùng nào thấy lỗi.</p>
<p>Rồi kiểu hỏng nặng: cả cái máy biến khỏi mạng (<code>docker network disconnect</code> — nhìn từ bên ngoài, một VPS bị treo hay một switch hỏng cũng y như vậy: gói tin đi mà không ai trả lời):</p>
<div class="out">$ bash tai.sh 25 http://localhost/     # nginx :80, rút mạng vps2 ở giây 3
3.0 200 0.000711 172.30.14.101:8000
3.0 000 10.001892
13.0 200 2.006872 172.30.14.102:8000, 172.30.14.101:8000
# đếm: 485 × 200 · 1 × 000
$ sudo cat /var/log/nginx/error.log
… upstream timed out (110: Connection timed out) while connecting to upstream, …</div>
<p>Một request bị treo: nó đã được gửi đi trên một kết nối keep-alive tới vps2 đúng lúc rút dây, nên nginx ngồi chờ một câu trả lời không bao giờ tới. <code>curl -m 10</code> bỏ cuộc sau 10 giây; một trình duyệt sẽ chờ tới <code>proxy_read_timeout</code> của nginx, mặc định 60 giây. Request tiếp theo thử vps2 phải trả 2 giây <code>proxy_connect_timeout</code> rồi được thử lại ở vps1; sau đó vps2 bị bỏ qua trong <code>fail_timeout</code>. Đó là kiểm sức khoẻ <em>thụ động</em>: nginx (bản miễn phí) chỉ biết một máy đã chết khi request của một người dùng thật hỏng trên máy đó.</p>

<h3>HAProxy tự hỏi thăm từng máy mỗi giây</h3>
${slide('dv-14', 12, 'HAProxy kiểm sức khoẻ chủ động: GET /health mỗi giây, hai lần hỏng là DOWN, xem bằng show stat')}
<p>HAProxy là một bộ cân bằng tải chuyên dụng. Ưu điểm chính của nó ở đây là kiểm sức khoẻ <em>chủ động</em>: nó tự gọi <code>/health</code> trên từng máy theo lịch riêng, không cần người dùng nào.</p>
<pre><code class="language-ini">global
    stats socket /run/haproxy.sock mode 660 level admin   <span class="tok-comment"># cổng điều khiển lúc chạy</span>
defaults
    mode http
    timeout connect 2s
    timeout client  30s
    timeout server  5s            <span class="tok-comment"># app im 5 s ⇒ trả 504, không treo 60 s</span>
    retries 2
    option redispatch             <span class="tok-comment"># thử lại thì chuyển sang máy KHÁC</span>
frontend web
    bind :81
    http-response set-header X-Upstream %s
    default_backend app
backend app
    balance roundrobin
    option httpchk GET /health
    http-check expect status 200
    default-server inter 1s fall 2 rise 2     <span class="tok-comment"># hỏi mỗi 1 s; 2 lần hỏng = DOWN; 2 lần tốt = UP</span>
    server vps1 172.30.14.101:8000 check
    server vps2 172.30.14.102:8000 check</code></pre>
<p>Cùng phép thử — rút mạng vps2 ở giây 3, cắm lại ở giây 9:</p>
<div class="out">$ bash tai.sh 14 http://localhost:81/
3.1 200 2.007538 vps1
5.1 200 2.008790 vps1
10.4 200 0.000728 vps2
# đếm: 1527 × 200 · 0 lỗi
$ echo "show stat" | sudo socat stdio /run/haproxy.sock | grep "^app," | cut -d, -f1,2,18,22,23,24,37
app,vps1,UP,0,0,43,L7OK
app,vps2,UP,2,1,24,L7OK
app,BACKEND,UP,,0,43,</div>
<p>Hai request bị chậm 2 giây (hết giờ kết nối, rồi <code>redispatch</code> sang vps1); sau hai lần kiểm hỏng, vps2 bị đánh dấu DOWN và mọi request đi sang vps1; 1,4 giây sau khi cắm dây lại, hai lần kiểm tốt đưa nó trở lại vòng. Các cột của <code>show stat</code> được <code>cut</code> chọn ra là tên, trạng thái, <code>chkfail</code> (2 lần kiểm hỏng), <code>chkdown</code> (đã DOWN một lần), số giây từ lần đổi trạng thái gần nhất, và kết quả kiểm cuối. Trong lần chạy này tình cờ không có request nào đang dở trên vps2 đúng lúc rút dây; nếu có, <code>timeout server 5s</code> sẽ kết thúc nó bằng một lỗi 504 sau 5 giây chứ không phải 60.</p>
<table>
<tr><th></th><th>nginx (mã nguồn mở)</th><th>HAProxy</th></tr>
<tr><td>Phát hiện máy chết</td><td>khi một request thật hỏng trên máy đó</td><td>tự kiểm, mỗi <code>inter</code></td></tr>
<tr><td>Rút một máy ra để deploy</td><td>sửa tệp, <code>nginx -s reload</code></td><td><code>set server app/vps1 state drain</code> qua socket</td></tr>
<tr><td>Xem trạng thái</td><td>log lỗi</td><td><code>show stat</code>, trang thống kê</td></tr>
<tr><td>Còn phục vụ tệp, TLS, cache</td><td>có</td><td>TLS có; nó không phải web server</td></tr>
</table>
<p>Nhiều hệ thống dùng cả hai: nginx lo TLS và tệp tĩnh, HAProxy (hoặc load balancer của cloud) lo chia request. Với hai máy, cái nào cũng được, miễn là các mốc thời gian chờ được đặt có chủ đích.</p>

<h3>Trạng thái phải ra khỏi máy</h3>
${slide('dv-14', 13, 'Phiên trong bộ nhớ: đăng nhập ở vps1, sang vps2 thành chưa đăng nhập; ảnh lưu ở vps1 thì vps2 404; phiên ra Redis thì hết')}
<p>Với một máy, "giữ phiên đăng nhập trong bộ nhớ" và "lưu ảnh tải lên vào <code>/srv/uploads</code>" đều chạy. Với hai máy, chúng thành những lỗi ngẫu nhiên:</p>
<div class="out">$ curl -s -c jar -X POST "localhost/login?u=cuong"
{"dang_nhap": "cuong", "may": "dv14-vps1"}
$ for i in 1 2 3 4 5 6; do curl -s -b jar localhost/me; done
{"user": "cuong", "may": "dv14-vps1"}
{"loi": "chua dang nhap", "may": "dv14-vps2"}
{"user": "cuong", "may": "dv14-vps1"}
{"loi": "chua dang nhap", "may": "dv14-vps2"}
{"user": "cuong", "may": "dv14-vps1"}
{"loi": "chua dang nhap", "may": "dv14-vps2"}
$ head -c 300000 /dev/urandom | curl -s -X POST --data-binary @- "localhost/upload?name=anh-dai-dien.jpg"
{"luu": "anh-dai-dien.jpg", "byte": 300000, "may": "dv14-vps1"}
$ for i in 1 2 3 4; do curl -s localhost/files/anh-dai-dien.jpg; done
{"loi": "khong co tep", "may": "dv14-vps2"}
{"tep": "anh-dai-dien.jpg", "byte": 300000, "may": "dv14-vps1"}
{"loi": "khong co tep", "may": "dv14-vps2"}
{"tep": "anh-dai-dien.jpg", "byte": 300000, "may": "dv14-vps1"}</div>
<p>Cứ cách một lần bấm là người dùng bị đăng xuất; cứ cách một lần là ảnh đại diện vỡ. Chuyển phiên sang Redis — một dòng trong <code>/etc/app.env</code> trên cả hai máy — sửa được cái đầu:</p>
<div class="out">$ grep SESSION /etc/app.env      # dv14-vps1
SESSION_STORE=redis://dv14-redis:6379/1
$ grep SESSION /etc/app.env      # dv14-vps2
SESSION_STORE=redis://dv14-redis:6379/1
$ curl -s -c jar -X POST "localhost/login?u=cuong"
{"dang_nhap": "cuong", "may": "dv14-vps2"}
$ for i in 1 2 3 4; do curl -s -b jar localhost/me; done
{"user": "cuong", "may": "dv14-vps1"}
{"user": "cuong", "may": "dv14-vps2"}
{"user": "cuong", "may": "dv14-vps1"}
{"user": "cuong", "may": "dv14-vps2"}
$ docker exec dv14-redis redis-cli -n 1 --scan --pattern "sess:*"
sess:aa3d78235bbd0d3f
$ docker exec dv14-redis redis-cli -n 1 TTL sess:aa3d78235bbd0d3f
3591</div>
<table>
<tr><th>Trạng thái</th><th>Chuyển ra đâu</th><th>Khoá học</th></tr>
<tr><td>Phiên đăng nhập</td><td>Redis hoặc cơ sở dữ liệu — hoặc một token có chữ ký (JWT) không cần kho phía máy chủ</td><td><code>/courses/redis</code></td></tr>
<tr><td>Tệp tải lên</td><td>kho object (R2/S3), phục vụ qua CDN (Chương 12.4)</td><td><code>/courses/object-storage</code></td></tr>
<tr><td>Việc hẹn giờ (cron), bài bản tin hằng ngày</td><td>đúng MỘT máy, hoặc một hàng đợi — không thì hai máy gửi email hai lần</td><td>—</td></tr>
<tr><td>Bộ đệm trong tiến trình</td><td>được, miễn chấp nhận một bản cũ trên một máy</td><td>—</td></tr>
</table>
<p><em>Sticky session</em> (phiên dính — <code>ip_hash</code>, hoặc một cookie mà bộ cân bằng đọc) là miếng băng dán: mỗi người dùng ở yên trên một máy. Nó giấu vấn đề cho tới khi máy đó chết hoặc bị rút ra để deploy — lúc ấy người dùng của nó vẫn bị đăng xuất — và nó chia tải lệch khi nhiều người dùng chung một IP (cả trường đại học sau một NAT). Chỉ dùng nó làm cầu tạm trong lúc chuyển trạng thái ra ngoài.</p>

<h3>Một lần dừng êm mà không êm: tiến trình cũ vẫn phục vụ</h3>
${slide('dv-14', 14, 'Tiến trình cũ đã thôi nghe cổng nhưng giữ kết nối keep-alive của nginx nên vẫn phục vụ; sửa bằng Connection close + timeout')}
<p>Lần chuyển sang Redis ở trên không chạy ngay lần đầu. Sau <code>app-restart</code> trên cả hai máy, một nửa số request vẫn báo "chưa đăng nhập" — từ vps1, máy đã có cấu hình mới. Cái máy tự kể chuyện:</p>
<div class="out">$ pgrep -af app.py
231 python3 /srv/app/current/app.py
1446 python3 /srv/app/current/app.py
$ sudo ss -tnp state established "( sport = :8000 )"
Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
0      0      172.30.14.101:8000 172.30.14.100:53606 users:(("python3",pid=231,fd=5))
$ sudo ss -tlnp "( sport = :8000 )"
State  Recv-Q Send-Q Local Address:Port Peer Address:PortProcess
LISTEN 0      5            0.0.0.0:8000      0.0.0.0:*    users:(("python3",pid=1446,fd=3))</div>
<p>Hai tiến trình app. Tiến trình mới (1446) giữ socket đang nghe. Tiến trình cũ (231) đã nhận SIGTERM, thôi nhận kết nối mới và đóng socket nghe — rồi ngồi chờ các kết nối đang mở kết thúc. Nhưng đó là các kết nối <code>keepalive</code> của nginx, thứ không bao giờ "kết thúc": nginx cứ gửi request mới xuống chúng, và tiến trình cũ, với phiên cũ trong bộ nhớ, cứ trả lời. <code>app-restart</code> chờ 10 giây, thôi chờ và vẫn chạy tiến trình mới, nên cả hai cùng chạy. Không có lỗi nào ở đâu cả, chỉ có "chưa đăng nhập" một nửa số lần.</p>
<p>Đây là bài toán drain (rút cạn) của Chương 3.2 dưới một hình dạng mới: một lần dừng êm phải đóng các kết nối keep-alive đang <em>rảnh</em> và bảo proxy đừng dùng lại những cái đang bận. Bản sửa trong app:</p>
<pre><code class="language-python">DUNG = threading.Event()                  <span class="tok-comment"># bật khi nhận SIGTERM</span>

class H(http.server.BaseHTTPRequestHandler):
    timeout = 5                           <span class="tok-comment"># kết nối keep-alive ngồi không quá 5 s thì đóng</span>
    def send(self, code, obj, headers=()):
        ...
        if DUNG.is_set():                 <span class="tok-comment"># đang dừng: báo proxy đừng dùng lại kết nối này</span>
            self.send_header('Connection', 'close'); self.close_connection = True

def tat(*_):
    DUNG.set()
    threading.Thread(target=srv.shutdown).start()</code></pre>
<div class="out">$ time sudo app-restart
dv14-vps1: v1 len
real    0m5.268s
$ pgrep -af "^python3"
1700 python3 /srv/app/current/app.py</div>
<p>Một tiến trình, và việc khởi động lại mất khoảng 5 giây — đúng bằng thời gian chờ khi rảnh. Node, Gunicorn và hầu hết máy chủ đều có hai thiết lập tương tự (<code>server.keepAliveTimeout</code> và đóng kết nối khi tắt trong Node; <code>--keep-alive</code> trong Gunicorn). Bài học cho script deploy thì rộng hơn: sau khi khởi động lại, <strong>kiểm rằng đúng MỘT tiến trình đang phục vụ</strong> (<code>pgrep</code>, hoặc phiên bản trong <code>/health</code> qua nhiều request), chứ không chỉ kiểm rằng một tiến trình mới đã chạy.</p>

<h3>Deploy lần lượt (rolling): từng máy một</h3>
${slide('dv-14', 15, 'Rolling: rút từng máy khỏi HAProxy, tráo, kiểm, trả về — 0 lỗi; tráo cả hai cùng lúc — 325 lỗi trong 3,5 giây')}
<p>Có hai máy thì bạn deploy được mà người dùng không hay biết: rút một máy khỏi bộ cân bằng, chờ các request của nó xong, tráo, kiểm, trả nó về, rồi làm máy kia. Socket của HAProxy biến mỗi bước thành một lệnh:</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># rolling.sh &lt;bản&gt; — deploy lần lượt từng máy sau HAProxy: rút khỏi LB → tráo → kiểm → trả về LB</span>
set -euo pipefail
BAN=$1
LB=19142
cong() { case $1 in vps1) echo 19143;; vps2) echo 19144;; esac; }   <span class="tok-comment"># bash 3.2 của macOS không có mảng kết hợp</span>
hap() { ./ssh.sh $LB "echo '$1' | sudo socat stdio /run/haproxy.sock"; }
for m in vps1 vps2; do
  echo "== $(date +%T) $m: drain (không nhận request MỚI)"
  hap "set server app/$m state drain" &gt;/dev/null
  until [ "$(hap "show stat" | awk -F, -v m=$m '$1=="app" &amp;&amp; $2==m {print $5}')" = 0 ]; do sleep 0.2; done   <span class="tok-comment"># cột 5 = scur</span>
  echo "   $(date +%T) $m: hết request dở, tráo sang $BAN"
  ./ssh.sh $(cong $m) "sudo mkdir -p /srv/app/releases/$BAN &amp;&amp; sudo cp /tmp/app.py /srv/app/releases/$BAN/ \\
     &amp;&amp; sudo ln -sfn /srv/app/releases/$BAN /srv/app/current &amp;&amp; sudo app-restart"
  ./ssh.sh $(cong $m) "curl -fs 127.0.0.1:8000/health" | grep -q "\\"ban\\": \\"$BAN\\"" \\
     || { echo "!! $m không lên $BAN — DỪNG, máy kia vẫn phục vụ bản cũ"; exit 1; }
  hap "set server app/$m state ready" &gt;/dev/null
  until [ "$(hap "show stat" | awk -F, -v m=$m '$1=="app" &amp;&amp; $2==m {print $18}')" = UP ]; do sleep 0.2; done   <span class="tok-comment"># cột 18 = status</span>
  echo "   $(date +%T) $m: UP trở lại trong LB"
done
echo "== xong: cả hai máy chạy $BAN"</code></pre>
<p>Dưới tải của các request <code>/slow?s=0.2</code> đi qua HAProxy:</p>
<div class="out">$ ./rolling.sh v3
== 16:25:54 vps1: drain (không nhận request MỚI)
   16:25:54 vps1: hết request dở, tráo sang v3
dv14-vps1: v3 len
   16:25:59 vps1: UP trở lại trong LB
== 16:25:59 vps2: drain (không nhận request MỚI)
   16:26:00 vps2: hết request dở, tráo sang v3
dv14-vps2: v3 len
   16:26:04 vps2: UP trở lại trong LB
== xong: cả hai máy chạy v3
# tải: 91 request, 91 × 200</div>
<p>Không lỗi nào. Để so sánh, bản "cứ khởi động lại cả hai" — đúng thao tác tráo đó, gửi tới cả hai máy cùng một lúc:</p>
<div class="out"># tráo cả hai cùng lúc, cùng tải qua HAProxy
3.0 200 v3
3.2 502
3.2 502
3.2 503
# … 321 dòng 503 nữa …
6.7 503
6.7 200 v4
# đếm: 60 × 200 · 2 × 502 · 323 × 503</div>
<p>Suốt 3,5 giây không máy nào qua được phép kiểm sức khoẻ, và HAProxy trả 503 "không có máy nào" nhanh đúng bằng tốc độ script tạo tải hỏi — 325 lần hỏng. Trên một web thật, mỗi lần là một người dùng.</p>
<table>
<tr><th>Chiến lược</th><th>Cách làm</th><th>Cần gì</th><th>Có lẫn phiên bản?</th></tr>
<tr><td>Tất cả cùng lúc</td><td>khởi động lại mọi thứ</td><td>không gì</td><td>không — nhưng có một khoảng trống</td></tr>
<tr><td>Rolling (lần lượt)</td><td>từng máy một sau bộ cân bằng</td><td>≥ 2 máy, một bước drain</td><td><strong>có</strong>, vài giây</td></tr>
<tr><td>Xanh–lam (Chương 3.3)</td><td>một bản sao đầy đủ thứ hai, gạt proxy</td><td>gấp đôi tài nguyên lúc deploy</td><td>không</td></tr>
<tr><td>Canary</td><td>một phần nhỏ trước, theo dõi, rồi phần còn lại</td><td>trọng số hoặc cờ, và số đo</td><td>có, có chủ đích</td></tr>
</table>
<p>Cột "có lẫn phiên bản" là cái giá của rolling: trong vài giây v2 và v3 cùng phục vụ, nên v3 phải chạy được với dữ liệu của v2 và v2 phải sống sót qua những thay đổi cơ sở dữ liệu của v3. Đó chính là luật migration mở rộng/thu hẹp (expand/contract) của Chương 5 — có hai máy thì nó hết còn là tuỳ chọn.</p>

<h3>Canary: để 10% thử trước</h3>
${slide('dv-14', 16, 'Canary: đặt trọng số 9:1 trên HAProxy lúc chạy, 100 trên 1000 request tới bản mới')}
<div class="out"># dv14-vps2 chạy v5 (canary), dv14-vps1 vẫn v4
$ echo "set weight app/vps1 9" | sudo socat stdio /run/haproxy.sock
$ echo "set weight app/vps2 1" | sudo socat stdio /run/haproxy.sock
$ for i in $(seq 1 1000); do curl -s localhost:81/ | grep -o "\\"ban\\": \\"v[0-9]\\""; done | sort | uniq -c
    900 "ban": "v4"
    100 "ban": "v5"</div>
<p>Đúng 100 trên 1.000 request tới v5, không reload gì. Rồi bạn <em>so con số</em> — tỉ lệ 5xx và độ trễ p95 của máy canary so với máy cũ (Chương 9 có công cụ) — trước khi nâng lên 50% và 100%. Lùi lại là <code>set weight app/vps2 0</code>. Chia theo trọng số máy nghĩa là một người dùng có thể nhảy qua lại giữa v4 và v5 mỗi lần bấm; nếu điều đó quan trọng, chia theo người dùng — một cookie mà bộ cân bằng đọc, hoặc feature flag của bài 14.1.</p>

<h3>Cơ sở dữ liệu vẫn là một — tạm thời</h3>
<p>Hai máy app dùng chung một Postgres. Đó là hình dạng đúng cho một đồ án sinh viên và cho phần lớn sản phẩm nhỏ: máy app dễ nhân bản vì chúng không giữ trạng thái; cơ sở dữ liệu thì khó vì nó CHÍNH LÀ trạng thái. Khi nó trở thành thứ không được phép chết, lựa chọn là một cơ sở dữ liệu có quản lý với chuyển đổi dự phòng tự động, hoặc một bản sao streaming (replica) của riêng bạn và tự promote bằng tay — cả hai đều ở <code>/courses/postgresql</code>. Đặt cơ sở dữ liệu lên máy riêng (hoặc dịch vụ có quản lý) <em>trước khi</em> bạn cần bản sao; đó cũng là thứ làm cho việc chuyển nhà ở 14.4 đơn giản hơn.</p>

<h3>Chạy thử từng bước</h3>
<ol>
<li>Build một ảnh Ubuntu 24.04 có <code>openssh-server nginx haproxy python3 python3-redis socat</code>; chạy <code>dv14-lb</code>, <code>dv14-vps1</code>, <code>dv14-vps2</code> trên một mạng với IP cố định; nạp khoá thí nghiệm.</li>
<li>Chép app và <code>app-restart</code> lên hai máy app; chạy; <code>curl</code> thẳng từng máy.</li>
<li>Cấu hình upstream nginx <em>không</em> có <code>zone</code>, chạy mười request, rồi thêm zone và chạy lại mười cái.</li>
<li>Chạy <code>tai.sh</code> và, từ Mac, <code>docker network disconnect dv14-net dv14-vps2</code>; cắm lại bằng <code>--ip 172.30.14.102</code>. Làm lại qua HAProxy.</li>
<li>Đăng nhập qua bộ cân bằng, lặp <code>/me</code>; chuyển sang Redis; lặp lại; kiểm <code>pgrep</code> trên cả hai máy.</li>
<li>Chạy <code>rolling.sh</code> dưới tải, rồi bản tráo cùng lúc, và đếm số dòng khác 200.</li>
</ol>

<div class="pitfall co-tieu-de"><strong>Bẫy — "khởi động lại thành công" trong khi tiến trình cũ vẫn đang phục vụ.</strong> Một script deploy kiểm <code>/health</code> một lần sau khi chạy tiến trình mới có thể qua, trong lúc một tiến trình cũ vẫn giữ các kết nối keep-alive từ proxy và trả lời một phần lưu lượng bằng mã cũ, trạng thái cũ trong bộ nhớ. Triệu chứng chập chờn và không có thông báo lỗi. Kiểm rằng đúng một tiến trình đang chạy, và hỏi <code>/health</code> qua bộ cân bằng nhiều lần để chỉ thấy phiên bản mới.</div>

<h3>Trên macOS và Windows: script deploy chạy trên laptop của bạn</h3>
<p><code>rolling.sh</code> chạy trên Mac và SSH vào từng máy. Bản đầu tiên của nó dùng mảng kết hợp của Bash (<code>declare -A CONG=([vps1]=19143 …)</code>) và hỏng ngay:</p>
<div class="out">$ /bin/bash --version | head -1
GNU bash, version 3.2.57(1)-release (arm64-apple-darwin26)
$ ./rolling.sh v2
./rolling.sh: line 5: vps1: unbound variable</div>
<p>macOS đi kèm Bash 3.2 (2007) vì lý do giấy phép; mảng kết hợp chỉ có từ Bash 4. Hoặc viết script cho 3.2 (một hàm <code>case</code>, như ở trên), hoặc chạy nó trên một máy Linux, hoặc cài Bash mới rồi gọi đích danh. Trên Windows, chạy script deploy trong WSL, nơi Bash là bản mới và <code>ssh</code>, <code>socat</code>, <code>awk</code> cư xử y như trên máy chủ — Git Bash thiếu <code>socat</code> và xử lý đường dẫn khác. Kiểm cả chuyện tệp script có ký tự xuống dòng LF (14.1): <code>bash\\r: No such file or directory</code> là phiên bản CRLF của đúng kiểu hỏng này.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhà cung cấp VPS của nhóm báo sẽ khởi động lại máy để bảo trì đúng tuần bảo vệ. Bạn thêm một máy thứ hai sau một bộ cân bằng tải và phải cho thầy xem, trực tiếp, rằng một máy biến mất được và deploy được mà không ai bị đăng xuất.</p>
<ol>
<li>Dựng phòng thí nghiệm ba máy; cấu hình HAProxy với <code>httpchk GET /health</code>, <code>inter 1s fall 2 rise 2</code>.</li>
<li>Chạy một vòng tạo tải rồi rút mạng một máy; ghi lại số phản hồi khác 200 và request chậm nhất.</li>
<li>Đăng nhập, lặp <code>/me</code> qua bộ cân bằng; chuyển phiên sang Redis trên cả hai máy; lặp lại; xác nhận bằng <code>pgrep</code> rằng mỗi máy chạy đúng một tiến trình app.</li>
<li>Chạy <code>rolling.sh</code> sang một phiên bản mới dưới tải.</li>
</ol>
<p><strong>Đạt khi:</strong> sổ ghi của bạn có kết quả rút mạng (số lỗi, thời gian chậm nhất), <code>/me</code> trả "cuong" từ cả hai máy, mỗi máy có đúng một tiến trình app, và lần deploy lần lượt kết thúc với 0 phản hồi khác 200, cả hai máy báo phiên bản mới.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Load balancer (bộ cân bằng tải)</span><span class="v">Proxy chia request cho nhiều máy và bỏ qua những máy đang chết.</span></div>
  <div class="kv"><span class="k">Upstream / backend (nhóm máy phía sau)</span><span class="v">Nhóm máy đứng sau bộ cân bằng (từ của nginx / HAProxy).</span></div>
  <div class="kv"><span class="k">Passive / active health check (kiểm sức khoẻ thụ động / chủ động)</span><span class="v">Biết máy chết qua request người dùng bị hỏng, so với tự hỏi máy theo lịch.</span></div>
  <div class="kv"><span class="k">Drain (rút cạn)</span><span class="v">Thôi gửi request mới vào một máy và để các request đang dở của nó chạy xong.</span></div>
  <div class="kv"><span class="k">Stateless (không trạng thái)</span><span class="v">Máy không giữ gì giữa các request, nên bản nào cũng trả lời được request nào.</span></div>
  <div class="kv"><span class="k">Sticky session (phiên dính)</span><span class="v">Ghim mỗi người dùng vào một máy — cách lách chuyện trạng thái, không phải cách sửa.</span></div>
  <div class="kv"><span class="k">Rolling deploy (deploy lần lượt)</span><span class="v">Cập nhật từng máy một trong khi các máy khác vẫn phục vụ.</span></div>
  <div class="kv"><span class="k">Canary (chim hoàng yến — bản thử trước)</span><span class="v">Gửi một phần nhỏ lưu lượng tới bản mới trước và so số đo của nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một bộ cân bằng trước hai máy sống sót qua cái chết của một máy và cho deploy không gián đoạn; bộ cân bằng và cơ sở dữ liệu vẫn là điểm chết.</li>
<li>Cho mọi upstream nginx một <code>zone</code>; thiếu nó, mười worker dồn mười trên mười request mới vào một máy.</li>
<li>nginx chỉ biết máy chết qua request hỏng (một request treo 10 giây trong phòng thí nghiệm); kiểm chủ động của HAProxy đánh dấu DOWN mà không có lỗi nào.</li>
<li>Phiên đăng nhập, tệp tải lên và việc hẹn giờ phải ra khỏi máy app — để trong máy thì cứ cách một lần bấm lại "đăng xuất" và 404.</li>
<li>Dừng êm phải đóng kết nối keep-alive; không thì một tiến trình cũ lặng lẽ tiếp tục phục vụ mã cũ.</li>
<li>Deploy lần lượt từng máy: 0 lỗi; khởi động lại cả hai cùng lúc: 325 lỗi trong 3,5 giây; trọng số 9:1 đưa đúng 10% tới canary.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — ngx_http_upstream_module</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_upstream_module.html — tham số server, zone, keepalive, cách chia tải.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">HAProxy 2.8 — Configuration Manual</span><span class="lc-sub">docs.haproxy.org/2.8/configuration.html — httpchk, inter/fall/rise, redispatch, các mốc timeout.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — reverse proxy và cân bằng tải</span><span class="lc-sub">/courses/nginx/learn${REF} — cú pháp upstream chi tiết.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Redis — phiên đăng nhập và bộ đệm</span><span class="lc-sub">/courses/redis/learn${REF} — phiên đăng nhập đã đi đâu.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Object storage — R2 và S3</span><span class="lc-sub">/courses/object-storage/learn${REF} — ảnh tải lên đi đâu.</span></span></div>
</div>
`,
    },
    /* ─────────────────────────── 14.3 ─────────────────────────── */
    {
      title: "14.3 — Choosing a platform: VPS, PaaS, serverless or Kubernetes, with real prices|||14.3 — Chọn nền tảng: VPS, PaaS, serverless hay Kubernetes, với giá thật",
      slug: "deploy-14-3-paas-vps-kubernetes",
      type: "LESSON",
      isFreePreview: true,
      description: "Ai lo tầng nào trên mỗi nền tảng, giá thật của DigitalOcean, Hetzner, Vercel, Render, Railway, Fly.io và Lambda tính đến 09/2026, cùng một đồ án thành bốn hoá đơn, hai cái bẫy \"miễn phí\" của đồ án sinh viên, và Kubernetes làm tự động đúng những việc của bài 14.2.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.3</span>
<h2>Choosing a platform: VPS, PaaS, serverless or Kubernetes, with real prices</h2>
<p class="lead">"Where do we deploy?" is usually settled by whoever has used something before. This lesson settles it with two questions instead: <em>which layers do you still have to look after</em>, and <em>what will it cost this month and in the month the project gets popular</em>. The prices are read from each provider's official page on 29/09/2026 — they will change, so the method matters more than the numbers.</p>

<h3>Who looks after which layer</h3>
${slide('dv-14', 17, 'Bảng trách nhiệm: VPS bạn lo mọi tầng từ hệ điều hành; PaaS lo build, tráo, HTTPS; serverless lo cả mở rộng')}
<p>Section 0 introduced seven places a website can run. Here the four that matter for a real project are compared layer by layer:</p>
<table>
<tr><th>Layer</th><th>VPS (Chapters 1–13)</th><th>PaaS (Render, Railway, Fly.io)</th><th>Serverless (Vercel Functions, AWS Lambda)</th><th>Kubernetes</th></tr>
<tr><td>Hardware, power, network</td><td>provider</td><td>provider</td><td>provider</td><td>provider (managed cluster)</td></tr>
<tr><td>Operating system, security patches</td><td><strong>you</strong></td><td>provider</td><td>provider</td><td>provider (nodes) / you (images)</td></tr>
<tr><td>Build, swap, rollback</td><td><strong>you</strong> (scripts)</td><td>provider — <code>git push</code></td><td>provider</td><td>you write manifests; the cluster runs them</td></tr>
<tr><td>Load balancing, HTTPS</td><td><strong>you</strong> (nginx, certbot)</td><td>provider</td><td>provider</td><td>Ingress + cert-manager</td></tr>
<tr><td>More machines</td><td><strong>you</strong> (Lesson 14.2)</td><td>a slider</td><td>automatic, per request</td><td>autoscaling</td></tr>
<tr><td>Postgres, Redis</td><td><strong>you</strong></td><td>paid add-ons</td><td>elsewhere</td><td>you, or managed</td></tr>
<tr><td>Seeing inside</td><td>everything (ssh)</td><td>logs, a limited shell</td><td>logs</td><td><code>kubectl</code></td></tr>
<tr><td>Predictable bill</td><td>fixed per month</td><td>plan + usage</td><td>per invocation — can spike</td><td>cluster + nodes, even when idle</td></tr>
</table>
<ul>
<li><strong>PaaS</strong> (platform as a service): you give it a repository or an image, it builds, runs, swaps and puts HTTPS in front. Chapters 1–3 and 12 are done for you. What you lose is access: when something is wrong there is no machine to <code>ssh</code> into.</li>
<li><strong>Serverless</strong>: you give it functions; each request may start a fresh copy. There is no server to look after and nothing to pay when idle. The costs are cold starts, time limits per request (Vercel Hobby: 300 s maximum function duration, as of 09/2026), no local disk or memory between requests, and databases that dislike thousands of short-lived connections (you need a pooler).</li>
<li><strong>Kubernetes</strong>: a system that runs containers across many machines from a description of the desired state. It automates Lesson 14.2 — and asks you to learn a large new set of concepts first.</li>
</ul>

<h3>Real VPS prices (as of 09/2026)</h3>
${slide('dv-14', 18, 'Giá VPS thật tính đến 09/2026: DigitalOcean theo RAM, Hetzner rẻ ở châu Âu nhưng xa Việt Nam')}
<table>
<tr><th>DigitalOcean Basic (Regular)</th><th>RAM · vCPU · SSD</th><th>Outbound transfer</th><th>$/month</th></tr>
<tr><td>smallest</td><td>512 MiB · 1 · 10 GB</td><td>500 GiB</td><td>4</td></tr>
<tr><td></td><td>1 GiB · 1 · 25 GB</td><td>1,000 GiB</td><td>6</td></tr>
<tr><td>group project with Postgres</td><td>2 GiB · 1 · 50 GB</td><td>2,000 GiB</td><td>12</td></tr>
<tr><td></td><td>4 GiB · 2 · 80 GB</td><td>4,000 GiB</td><td>24</td></tr>
<tr><td></td><td>8 GiB · 4 · 160 GB</td><td>5,000 GiB</td><td>48</td></tr>
</table>
<p>Extras on the same pages: outbound transfer beyond the allowance is $0.01/GiB, pooled across all Droplets of the team; snapshots $0.06/GB per month; automatic backups add 20% (weekly) or 30% (daily) of the Droplet price; inbound transfer is free. DigitalOcean has a Singapore region (SGP1); the pricing page does not list per-region prices, so check the price shown when you create the machine.</p>
<table>
<tr><th>Hetzner Cloud (new prices from 15/06/2026)</th><th>€/month, excl. VAT, excl. IPv4</th></tr>
<tr><td>CX23 · 2 vCPU · 4 GB RAM · 40 GB (Germany/Finland)</td><td>5.49</td></tr>
<tr><td>CX33 (Germany/Finland)</td><td>8.49</td></tr>
<tr><td>CAX11, ARM (Germany/Finland)</td><td>5.99</td></tr>
<tr><td>CPX12 (<strong>Singapore</strong>)</td><td>15.49</td></tr>
<tr><td>Traffic</td><td>20 TB included in the EU; 0.5–5 TB in Singapore depending on plan; €1/TB beyond</td></tr>
</table>
<p>The same money buys very different machines depending on where they are: a 4 GB Hetzner server in Germany costs about a third of a smaller one in Singapore. Lesson 14.4 measures what that distance costs a user in Vietnam — about 200 ms per round trip.</p>

<h3>Real PaaS and serverless prices (as of 09/2026)</h3>
${slide('dv-14', 19, 'Giá PaaS và serverless 09/2026 kèm bẫy: Vercel Hobby phi thương mại, Render free ngủ 15 phút, Postgres free 30 ngày')}
<table>
<tr><th>Platform</th><th>Free</th><th>Smallest paid</th><th>Catch</th></tr>
<tr><td><strong>Vercel</strong></td><td>Hobby $0: 100 GB Fast Data Transfer, 1M function invocations, 4 h Active CPU per month; usage is capped, no overage</td><td>Pro $20 per developer seat per month: 1 TB then $0.15/GB</td><td>Hobby is for <strong>non-commercial, personal use only</strong> (Vercel's fair-use guidelines)</td></tr>
<tr><td><strong>Render</strong></td><td>web service 512 MB; <strong>spins down after 15 minutes</strong> without traffic, ~1 minute to spin up; 750 free instance hours per workspace per month; free Postgres <strong>expires 30 days after creation</strong></td><td>web Starter $7 (512 MB) · Postgres Basic 256 MB $6 · 1 GB $19 · Key Value 256 MB $10; Hobby workspace $0 + compute</td><td>Hobby bandwidth 5 GB included, then $0.15/GB</td></tr>
<tr><td><strong>Railway</strong></td><td>one-time $5 trial credit (30 days)</td><td>Hobby $5/month including $5 of usage; memory $10/GB·month, CPU $20/vCPU·month, egress $0.05/GB, volumes $0.15/GB</td><td>metered per second — a forgotten service keeps costing</td></tr>
<tr><td><strong>Fly.io</strong></td><td>—</td><td>shared-cpu-1x 512 MB ≈ $3.46/month (US East; varies by region); volumes $0.15/GB; Managed Postgres Basic $38</td><td>dedicated IPv4 $2/month; Asia-Pacific egress $0.04/GB</td></tr>
<tr><td><strong>AWS Lambda</strong></td><td>1M requests + 400,000 GB-seconds per month</td><td>$0.20 per 1M requests + $0.0000166667 per GB-second (x86)</td><td>short-lived; database connections need a pooler/proxy</td></tr>
</table>

<h3>One project, four bills</h3>
${slide('dv-14', 20, 'Cùng đồ án đặt lịch phòng khám: VPS 14,4 $, Render 30 $, Railway ~8 $, Fly ~45 $ mỗi tháng')}
<p>Take the capstone project of Chapter 15 — a clinic booking app: a Next.js frontend, a small API, PostgreSQL, Redis. Before pricing it, measure what it actually uses. The lab stack at rest:</p>
<div class="out">$ docker stats --no-stream --format "table {{.Name}}\\t{{.MemUsage}}\\t{{.CPUPerc}}" dv14-pgprod dv14-redis dv14-vps1
NAME          MEM USAGE / LIMIT   CPU %
dv14-pgprod   77.81MiB / 256MiB   0.00%
dv14-redis    6.281MiB / 64MiB    0.43%
dv14-vps1     46.93MiB / 512MiB   0.07%
$ ps -o rss=,cmd= -C python3    # inside dv14-vps1
27912 python3 /srv/app/current/app.py</div>
<p>A Python toy app uses 28 MB; a real Node API and a Next.js server use several times that. Assume about 0.6 GB of RAM in total and 0.1 vCPU on average for a student project:</p>
<table>
<tr><th>How it runs</th><th>Arithmetic</th><th>$/month</th></tr>
<tr><td><strong>VPS</strong>: DigitalOcean 2 GiB, SGP1, + weekly backups</td><td>12 + 20%</td><td><strong>14.40</strong></td></tr>
<tr><td><strong>Render</strong>: web + API Starter, Postgres 256 MB, Key Value</td><td>7 + 7 + 6 + 10</td><td><strong>30</strong></td></tr>
<tr><td><strong>Railway</strong> Hobby: ~0.6 GB RAM, ~0.1 vCPU average</td><td>5 + (6 + 2 − 5)</td><td><strong>~8</strong> (estimate)</td></tr>
<tr><td><strong>Fly.io</strong>: two 512 MB machines + Managed Postgres Basic</td><td>2 × 3.46 + 38</td><td><strong>~45</strong></td></tr>
<tr><td><strong>Vercel</strong> Hobby for the frontend + the API somewhere else</td><td>0 + …</td><td>0 for the frontend — if non-commercial</td></tr>
</table>
<p>Three things stand out. A managed database is often the most expensive line (Fly's smallest managed Postgres costs three times the whole VPS). Metered platforms (Railway) are cheapest when idle and least predictable when busy. And the VPS is cheap in money and expensive in time — every chapter of this course is time you spend instead of a provider.</p>

<h3>The two "free" traps of a student project</h3>
<div class="callout danger"><p><strong>Render's free web service sleeps.</strong> After 15 minutes with no traffic it spins down; the next request waits about a minute while it starts. The lecturer clicks the link at the start of the defence and watches a spinner.</p>
<p><strong>Render's free Postgres expires 30 days after creation.</strong> A database created at the start of the project is gone before the defence. Neither is a bug; both are on the provider's page. A few dollars for the smallest paid plan, for the month of the defence, is the cheapest insurance in this course.</p></div>
<p>Vercel Hobby has a different catch: it is restricted to non-commercial, personal use. A class project is fine; the startup the group launches afterwards is not.</p>

<h3>When to choose what</h3>
<table>
<tr><th>Situation</th><th>Choose</th><th>Not</th></tr>
<tr><td>Group project, one semester, needs a stable link for the defence</td><td>PaaS on a small paid plan, or a 2 GB VPS</td><td>any free tier that sleeps or expires</td></tr>
<tr><td>Static frontend / Next.js, non-commercial</td><td>Vercel Hobby</td><td>a VPS just for static files</td></tr>
<tr><td>You want to learn operations; several services; a fixed budget</td><td>VPS in Singapore</td><td>Kubernetes</td></tr>
<tr><td>Occasional, event-driven work (a webhook, a nightly job)</td><td>serverless</td><td>a VPS running idle all month</td></tr>
<tr><td>Many services, many machines, several teams</td><td>Kubernetes (managed)</td><td>hand-written scripts per server</td></tr>
</table>
<p>Whatever you choose, keep the way out open: a Dockerfile, configuration in environment variables (14.1), a standard PostgreSQL rather than a provider-only database API, uploads in S3-compatible storage. Then moving from PaaS to a VPS (or back) is a weekend, not a rewrite — Lesson 14.4 does exactly such a move.</p>

<h3>Kubernetes, next to what you already built</h3>
${slide('dv-14', 21, 'Manifest Deployment của Kubernetes ánh xạ đúng từng việc của bài 14.2: replicas, readinessProbe, rollingUpdate')}
<p>Kubernetes is easier to understand once you have done its job by hand. The Deployment below (shown for comparison, <strong>not run</strong> in this course) describes what Lesson 14.2 built with two servers, HAProxy and <code>rolling.sh</code>:</p>
<pre><code class="language-yaml">apiVersion: apps/v1
kind: Deployment
metadata: { name: app }
spec:
  replicas: 2                                    <span class="tok-comment"># hai "vps"</span>
  strategy:
    rollingUpdate: { maxUnavailable: 0, maxSurge: 1 }   <span class="tok-comment"># rolling.sh: không bao giờ bớt máy đang phục vụ</span>
  template:
    spec:
      containers:
      - name: app
        image: ghcr.io/nhom/app:a1b2c3d          <span class="tok-comment"># ghim tag theo commit (Ch13)</span>
        envFrom: [{ secretRef: { name: app-env } }]   <span class="tok-comment"># /etc/app.env</span>
        readinessProbe:                          <span class="tok-comment"># option httpchk GET /health</span>
          httpGet: { path: /health, port: 8000 }</code></pre>
<table>
<tr><th>In Lesson 14.2</th><th>In Kubernetes</th></tr>
<tr><td>two servers running the same image</td><td><code>replicas: 2</code></td></tr>
<tr><td>HAProxy + <code>/health</code> check</td><td>a Service + <code>readinessProbe</code></td></tr>
<tr><td><code>rolling.sh</code>, draining one server at a time</td><td><code>strategy.rollingUpdate</code></td></tr>
<tr><td><code>/etc/app.env</code></td><td>a Secret / ConfigMap</td></tr>
<tr><td>a dead server ⇒ traffic moves</td><td>a new pod is started on another node</td></tr>
</table>
<p>It is not needed for one app, one team of four or five, one semester: the cluster costs money even when idle, and debugging it requires concepts (pods, services, ingress, controllers) that have nothing to do with your app. It becomes worth it when there are many services and many machines. The course for that is <strong><code>/courses/kubernetes</code></strong>.</p>

<h3>Try it step by step</h3>
<ol>
<li>Run your stack locally with Docker Compose and read <code>docker stats --no-stream</code> after clicking through the main pages.</li>
<li>Open the pricing pages linked below; write down, with today's date, the price of the smallest plan that fits your RAM on each platform.</li>
<li>Fill in the table "one project, four bills" for your own project, including the database line.</li>
<li>Circle every "free" line that sleeps, expires or is non-commercial.</li>
</ol>

<div class="pitfall co-tieu-de"><strong>Trap — choosing by the free tier.</strong> Free tiers are designed for trying things, and each has a limit that shows up at the worst moment: sleeping instances, databases that expire, capped usage that pauses the site for the rest of the month (Vercel Hobby: no overage, you wait). Price the plan you would need on the day of the defence, not the plan that costs nothing today.</div>

<h3>On macOS and Windows: the image you build is not the image they run</h3>
<p>Platforms that build from your repository (Render, Railway, Vercel) build on their own machines, usually x86-64. If instead you push a ready-made image from a Mac with Apple Silicon:</p>
<div class="out">$ docker image inspect -f "{{.Os}}/{{.Architecture}}" dv14-app:a1b2c3d
linux/arm64
$ uname -m
arm64</div>
<p>An <code>arm64</code> image does not start on an x86-64 machine (<code>exec format error</code>). Build with <code>docker buildx build --platform linux/amd64</code> for such targets (Chapter 13.2). On Windows the platform CLIs (<code>vercel</code>, <code>flyctl</code>, <code>railway</code>) all run natively; keep line endings LF in anything that runs on Linux.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your team has 400,000 VND a month for hosting (about $15) and a defence in eight weeks. Write the one-page recommendation the team lead will send to the lecturer.</p>
<ol>
<li>Measure your stack's RAM with <code>docker stats</code>.</li>
<li>From the official pages, today, price three options that fit: a VPS in Singapore, a PaaS on paid plans, a mixed setup (Vercel Hobby frontend + something for the API and database).</li>
<li>For each, list which chapters of this course you would still have to do yourself.</li>
<li>Pick one and state the one risk you accept.</li>
</ol>
<p><strong>Done when:</strong> the page has three priced options with sources and the date, a measured RAM figure, no plan that sleeps or expires during the defence week, and one sentence naming the accepted risk.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">PaaS</span><span class="v">A platform that builds, runs and swaps your app from a repository or image.</span></div>
  <div class="kv"><span class="k">Serverless / function</span><span class="v">Code run per request by the provider, with no server for you to manage and nothing billed when idle.</span></div>
  <div class="kv"><span class="k">Cold start</span><span class="v">The delay while a sleeping instance or function starts before it can answer.</span></div>
  <div class="kv"><span class="k">Managed database</span><span class="v">A database the provider runs, backs up and patches for you — often the most expensive line.</span></div>
  <div class="kv"><span class="k">Egress</span><span class="v">Data sent out of the provider's network to users; usually the metered part of bandwidth.</span></div>
  <div class="kv"><span class="k">Metered billing</span><span class="v">Paying per second of RAM/CPU actually used instead of a fixed monthly plan.</span></div>
  <div class="kv"><span class="k">Kubernetes Deployment</span><span class="v">A description of how many copies of which image should run and how to replace them.</span></div>
  <div class="kv"><span class="k">Vendor lock-in</span><span class="v">Depending on features only one provider offers, so leaving means rewriting.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Compare platforms by which layers you still look after and what they cost, not by brand.</li>
<li>As of 09/2026 a 2 GiB DigitalOcean VPS is $12; Hetzner is far cheaper in Europe but far from Vietnam.</li>
<li>PaaS removes Chapters 1–3 and 12 from your work; a managed database is often the most expensive item.</li>
<li>Render's free web service sleeps after 15 minutes and its free Postgres expires after 30 days; Vercel Hobby is non-commercial.</li>
<li>Measure RAM before choosing a plan; the same project priced out at $8–45 a month depending on the platform.</li>
<li>Kubernetes automates exactly what Lesson 14.2 did by hand; it is not needed for one app and one semester.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">DigitalOcean — Droplet pricing</span><span class="lc-sub">digitalocean.com/pricing/droplets — plans, transfer, backups and snapshots.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Hetzner — price adjustment (15 June 2026)</span><span class="lc-sub">docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/ — current cloud prices per location.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Vercel — Hobby plan</span><span class="lc-sub">vercel.com/docs/plans/hobby — included usage and the non-commercial restriction.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Render — Deploy for free</span><span class="lc-sub">render.com/docs/free — spin-down after 15 minutes, 30-day free Postgres.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Railway — Pricing</span><span class="lc-sub">railway.com/pricing — plans and per-resource prices.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Fly.io — Pricing</span><span class="lc-sub">docs.fly.io/about/pricing/ — machines, volumes, IPv4, data transfer by region.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS Lambda — Pricing</span><span class="lc-sub">aws.amazon.com/lambda/pricing/ — free tier and per-request prices.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Kubernetes</span><span class="lc-sub">/courses/kubernetes/learn${REF} — Deployments, Services and rollouts, properly.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.3</span>
<h2>Chọn nền tảng: VPS, PaaS, serverless hay Kubernetes, với giá thật</h2>
<p class="lead">"Deploy lên đâu?" thường được quyết bởi người nào từng dùng một thứ gì đó trước đây. Bài này quyết nó bằng hai câu hỏi: <em>bạn còn phải tự lo những tầng nào</em>, và <em>tháng này tốn bao nhiêu, và tháng dự án nổi lên tốn bao nhiêu</em>. Giá được đọc từ trang chính thức của từng hãng ngày 29/09/2026 — chúng sẽ đổi, nên cách làm quan trọng hơn con số.</p>

<h3>Ai lo tầng nào</h3>
${slide('dv-14', 17, 'Bảng trách nhiệm: VPS bạn lo mọi tầng từ hệ điều hành; PaaS lo build, tráo, HTTPS; serverless lo cả mở rộng')}
<p>Mục 0 đã giới thiệu bảy chỗ một trang web có thể chạy. Ở đây bốn chỗ quan trọng với một dự án thật được so từng tầng:</p>
<table>
<tr><th>Tầng</th><th>VPS (Chương 1–13)</th><th>PaaS (Render, Railway, Fly.io)</th><th>Serverless (Vercel Functions, AWS Lambda)</th><th>Kubernetes</th></tr>
<tr><td>Phần cứng, điện, mạng</td><td>nhà cung cấp</td><td>nhà cung cấp</td><td>nhà cung cấp</td><td>nhà cung cấp (cụm có quản lý)</td></tr>
<tr><td>Hệ điều hành, bản vá bảo mật</td><td><strong>bạn</strong></td><td>nhà cung cấp</td><td>nhà cung cấp</td><td>nhà cung cấp (node) / bạn (ảnh)</td></tr>
<tr><td>Build, tráo, lùi bản</td><td><strong>bạn</strong> (script)</td><td>nhà cung cấp — <code>git push</code></td><td>nhà cung cấp</td><td>bạn viết manifest; cụm chạy theo</td></tr>
<tr><td>Cân bằng tải, HTTPS</td><td><strong>bạn</strong> (nginx, certbot)</td><td>nhà cung cấp</td><td>nhà cung cấp</td><td>Ingress + cert-manager</td></tr>
<tr><td>Thêm máy</td><td><strong>bạn</strong> (Bài 14.2)</td><td>kéo một thanh trượt</td><td>tự động, theo từng request</td><td>tự co giãn (autoscaling)</td></tr>
<tr><td>Postgres, Redis</td><td><strong>bạn</strong></td><td>dịch vụ thêm, trả tiền</td><td>ở chỗ khác</td><td>bạn, hoặc dịch vụ có quản lý</td></tr>
<tr><td>Nhìn vào bên trong</td><td>mọi thứ (ssh)</td><td>log, shell hạn chế</td><td>log</td><td><code>kubectl</code></td></tr>
<tr><td>Hoá đơn đoán trước được</td><td>cố định mỗi tháng</td><td>gói + phần dùng thêm</td><td>theo lượt gọi — có thể vọt</td><td>cụm + node, cả khi rảnh</td></tr>
</table>
<ul>
<li><strong>PaaS</strong> (platform as a service — nền tảng như một dịch vụ): bạn đưa nó một kho mã hay một ảnh, nó build, chạy, tráo và đặt HTTPS phía trước. Chương 1–3 và 12 được làm hộ. Cái mất là quyền nhìn vào: khi có gì sai, chẳng có cái máy nào để <code>ssh</code>.</li>
<li><strong>Serverless</strong> (không máy chủ): bạn đưa nó các hàm; mỗi request có thể khởi động một bản mới. Không có máy để trông, không tốn gì lúc rảnh. Cái giá là khởi động lạnh (cold start), giới hạn thời gian mỗi request (Vercel Hobby: tối đa 300 giây mỗi lần chạy hàm, tính đến 09/2026), không có đĩa hay bộ nhớ giữ lại giữa các request, và cơ sở dữ liệu không ưa hàng nghìn kết nối sống ngắn (bạn cần một bộ gom kết nối — pooler).</li>
<li><strong>Kubernetes</strong>: một hệ thống chạy container trên nhiều máy theo một bản mô tả trạng thái mong muốn. Nó tự động hoá Bài 14.2 — và đòi bạn học trước một bộ khái niệm mới rất lớn.</li>
</ul>

<h3>Giá VPS thật (tính đến 09/2026)</h3>
${slide('dv-14', 18, 'Giá VPS thật tính đến 09/2026: DigitalOcean theo RAM, Hetzner rẻ ở châu Âu nhưng xa Việt Nam')}
<table>
<tr><th>DigitalOcean Basic (Regular)</th><th>RAM · vCPU · SSD</th><th>Truyền ra</th><th>$/tháng</th></tr>
<tr><td>nhỏ nhất</td><td>512 MiB · 1 · 10 GB</td><td>500 GiB</td><td>4</td></tr>
<tr><td></td><td>1 GiB · 1 · 25 GB</td><td>1.000 GiB</td><td>6</td></tr>
<tr><td>đồ án nhóm có Postgres</td><td>2 GiB · 1 · 50 GB</td><td>2.000 GiB</td><td>12</td></tr>
<tr><td></td><td>4 GiB · 2 · 80 GB</td><td>4.000 GiB</td><td>24</td></tr>
<tr><td></td><td>8 GiB · 4 · 160 GB</td><td>5.000 GiB</td><td>48</td></tr>
</table>
<p>Các khoản thêm trên cùng các trang đó: lưu lượng ra vượt hạn mức tính $0,01/GiB, gộp chung cho mọi Droplet của cả nhóm (team); snapshot $0,06/GB mỗi tháng; sao lưu tự động cộng thêm 20% (hằng tuần) hoặc 30% (hằng ngày) giá máy; lưu lượng vào miễn phí. DigitalOcean có vùng Singapore (SGP1); trang giá không ghi giá theo từng vùng, nên hãy xem giá hiện ra lúc tạo máy.</p>
<table>
<tr><th>Hetzner Cloud (giá mới từ 15/06/2026)</th><th>€/tháng, chưa VAT, chưa IPv4</th></tr>
<tr><td>CX23 · 2 vCPU · 4 GB RAM · 40 GB (Đức/Phần Lan)</td><td>5,49</td></tr>
<tr><td>CX33 (Đức/Phần Lan)</td><td>8,49</td></tr>
<tr><td>CAX11, ARM (Đức/Phần Lan)</td><td>5,99</td></tr>
<tr><td>CPX12 (<strong>Singapore</strong>)</td><td>15,49</td></tr>
<tr><td>Lưu lượng</td><td>EU có sẵn 20 TB; Singapore 0,5–5 TB tuỳ gói; vượt thì €1/TB</td></tr>
</table>
<p>Cùng một số tiền mua được những cái máy rất khác nhau tuỳ chúng đặt ở đâu: một máy Hetzner 4 GB ở Đức chỉ tốn chừng một phần ba một máy nhỏ hơn ở Singapore. Bài 14.4 đo khoảng cách đó làm người dùng ở Việt Nam mất gì — khoảng 200 ms mỗi vòng đi-về.</p>

<h3>Giá PaaS và serverless thật (tính đến 09/2026)</h3>
${slide('dv-14', 19, 'Giá PaaS và serverless 09/2026 kèm bẫy: Vercel Hobby phi thương mại, Render free ngủ 15 phút, Postgres free 30 ngày')}
<table>
<tr><th>Nền tảng</th><th>Miễn phí</th><th>Gói trả tiền nhỏ nhất</th><th>Bẫy</th></tr>
<tr><td><strong>Vercel</strong></td><td>Hobby $0: 100 GB Fast Data Transfer, 1 triệu lượt gọi hàm, 4 giờ Active CPU mỗi tháng; dùng hết là bị chặn, không có trả thêm</td><td>Pro $20 mỗi ghế lập trình viên mỗi tháng: 1 TB rồi $0,15/GB</td><td>Hobby <strong>chỉ cho dùng cá nhân, phi thương mại</strong> (quy định sử dụng hợp lý của Vercel)</td></tr>
<tr><td><strong>Render</strong></td><td>web service 512 MB; <strong>ngủ sau 15 phút</strong> không có truy cập, dậy mất ~1 phút; 750 giờ chạy miễn phí mỗi workspace mỗi tháng; Postgres free <strong>hết hạn 30 ngày sau khi tạo</strong></td><td>web Starter $7 (512 MB) · Postgres Basic 256 MB $6 · 1 GB $19 · Key Value 256 MB $10; workspace Hobby $0 + tiền máy</td><td>băng thông Hobby có 5 GB, rồi $0,15/GB</td></tr>
<tr><td><strong>Railway</strong></td><td>tín dụng dùng thử $5 một lần (30 ngày)</td><td>Hobby $5/tháng gồm $5 tiền dùng; RAM $10/GB·tháng, CPU $20/vCPU·tháng, lưu lượng ra $0,05/GB, ổ đĩa $0,15/GB</td><td>tính theo giây — một dịch vụ bị quên vẫn tốn tiền</td></tr>
<tr><td><strong>Fly.io</strong></td><td>—</td><td>shared-cpu-1x 512 MB ≈ $3,46/tháng (US East; tuỳ vùng); ổ đĩa $0,15/GB; Managed Postgres Basic $38</td><td>IPv4 riêng $2/tháng; lưu lượng ra châu Á–Thái Bình Dương $0,04/GB</td></tr>
<tr><td><strong>AWS Lambda</strong></td><td>1 triệu request + 400.000 GB-giây mỗi tháng</td><td>$0,20 mỗi triệu request + $0,0000166667 mỗi GB-giây (x86)</td><td>sống ngắn; kết nối cơ sở dữ liệu cần pooler/proxy</td></tr>
</table>

<h3>Một đồ án, bốn hoá đơn</h3>
${slide('dv-14', 20, 'Cùng đồ án đặt lịch phòng khám: VPS 14,4 $, Render 30 $, Railway ~8 $, Fly ~45 $ mỗi tháng')}
<p>Lấy dự án cuối khoá của Chương 15 — app đặt lịch phòng khám: frontend Next.js, một API nhỏ, PostgreSQL, Redis. Trước khi tính giá, đo xem nó thật sự dùng bao nhiêu. Bộ máy thí nghiệm lúc nghỉ:</p>
<div class="out">$ docker stats --no-stream --format "table {{.Name}}\\t{{.MemUsage}}\\t{{.CPUPerc}}" dv14-pgprod dv14-redis dv14-vps1
NAME          MEM USAGE / LIMIT   CPU %
dv14-pgprod   77.81MiB / 256MiB   0.00%
dv14-redis    6.281MiB / 64MiB    0.43%
dv14-vps1     46.93MiB / 512MiB   0.07%
$ ps -o rss=,cmd= -C python3    # trong dv14-vps1
27912 python3 /srv/app/current/app.py</div>
<p>App đồ chơi bằng Python dùng 28 MB; một API Node thật và một máy chủ Next.js dùng gấp vài lần. Giả sử tổng cộng khoảng 0,6 GB RAM và trung bình 0,1 vCPU cho một đồ án sinh viên:</p>
<table>
<tr><th>Chạy thế nào</th><th>Phép tính</th><th>$/tháng</th></tr>
<tr><td><strong>VPS</strong>: DigitalOcean 2 GiB, SGP1, + sao lưu hằng tuần</td><td>12 + 20%</td><td><strong>14,40</strong></td></tr>
<tr><td><strong>Render</strong>: web + API Starter, Postgres 256 MB, Key Value</td><td>7 + 7 + 6 + 10</td><td><strong>30</strong></td></tr>
<tr><td><strong>Railway</strong> Hobby: ~0,6 GB RAM, ~0,1 vCPU trung bình</td><td>5 + (6 + 2 − 5)</td><td><strong>~8</strong> (ước tính)</td></tr>
<tr><td><strong>Fly.io</strong>: hai máy 512 MB + Managed Postgres Basic</td><td>2 × 3,46 + 38</td><td><strong>~45</strong></td></tr>
<tr><td><strong>Vercel</strong> Hobby cho frontend + API ở chỗ khác</td><td>0 + …</td><td>0 cho frontend — nếu phi thương mại</td></tr>
</table>
<p>Ba điều nổi lên. Cơ sở dữ liệu có quản lý thường là dòng đắt nhất (Postgres có quản lý nhỏ nhất của Fly đắt gấp ba cả cái VPS). Nền tảng tính theo đồng hồ (Railway) rẻ nhất lúc rảnh và khó đoán nhất lúc bận. Và VPS rẻ về tiền nhưng đắt về thời gian — mỗi chương của khoá này là thời gian bạn bỏ ra thay cho một nhà cung cấp.</p>

<h3>Hai cái bẫy "miễn phí" của đồ án sinh viên</h3>
<div class="callout danger"><p><strong>Web service miễn phí của Render đi ngủ.</strong> Sau 15 phút không có truy cập nó tắt; request kế tiếp chờ khoảng một phút để nó khởi động. Thầy bấm link lúc bắt đầu buổi bảo vệ và ngồi nhìn vòng xoay.</p>
<p><strong>Postgres miễn phí của Render hết hạn 30 ngày sau khi tạo.</strong> Cơ sở dữ liệu tạo từ đầu dự án đã biến mất trước buổi bảo vệ. Không cái nào là lỗi; cả hai đều ghi trên trang của nhà cung cấp. Vài đô cho gói trả tiền nhỏ nhất, trong tháng bảo vệ, là tấm bảo hiểm rẻ nhất của cả khoá này.</p></div>
<p>Vercel Hobby có một cái bẫy khác: nó giới hạn cho dùng cá nhân, phi thương mại. Một đồ án trên lớp thì được; công ty khởi nghiệp nhóm lập ra sau đó thì không.</p>

<h3>Khi nào chọn cái gì</h3>
<table>
<tr><th>Tình huống</th><th>Chọn</th><th>Đừng</th></tr>
<tr><td>Đồ án nhóm, một học kỳ, cần link ổn định cho buổi bảo vệ</td><td>PaaS gói trả tiền nhỏ, hoặc một VPS 2 GB</td><td>gói miễn phí nào đi ngủ hoặc hết hạn</td></tr>
<tr><td>Frontend tĩnh / Next.js, phi thương mại</td><td>Vercel Hobby</td><td>một VPS chỉ để phục vụ tệp tĩnh</td></tr>
<tr><td>Muốn học vận hành; nhiều dịch vụ; ngân sách cố định</td><td>VPS ở Singapore</td><td>Kubernetes</td></tr>
<tr><td>Việc thỉnh thoảng, theo sự kiện (webhook, việc chạy ban đêm)</td><td>serverless</td><td>một VPS ngồi không cả tháng</td></tr>
<tr><td>Nhiều dịch vụ, nhiều máy, nhiều nhóm</td><td>Kubernetes (có quản lý)</td><td>script viết tay cho từng máy</td></tr>
</table>
<p>Chọn gì thì cũng giữ lối ra: một Dockerfile, cấu hình trong biến môi trường (14.1), PostgreSQL chuẩn thay vì API cơ sở dữ liệu riêng của một hãng, tệp tải lên ở kho tương thích S3. Khi đó chuyển từ PaaS sang VPS (hay ngược lại) là việc một cuối tuần, không phải viết lại — Bài 14.4 làm đúng một lần chuyển như vậy.</p>

<h3>Kubernetes, đặt cạnh thứ bạn đã dựng</h3>
${slide('dv-14', 21, 'Manifest Deployment của Kubernetes ánh xạ đúng từng việc của bài 14.2: replicas, readinessProbe, rollingUpdate')}
<p>Kubernetes dễ hiểu hơn nhiều khi bạn đã tự tay làm công việc của nó. Deployment dưới đây (chỉ để so sánh, <strong>không chạy</strong> trong khoá này) mô tả đúng thứ Bài 14.2 đã dựng bằng hai máy, HAProxy và <code>rolling.sh</code>:</p>
<pre><code class="language-yaml">apiVersion: apps/v1
kind: Deployment
metadata: { name: app }
spec:
  replicas: 2                                    <span class="tok-comment"># hai "vps"</span>
  strategy:
    rollingUpdate: { maxUnavailable: 0, maxSurge: 1 }   <span class="tok-comment"># rolling.sh: không bao giờ bớt máy đang phục vụ</span>
  template:
    spec:
      containers:
      - name: app
        image: ghcr.io/nhom/app:a1b2c3d          <span class="tok-comment"># ghim tag theo commit (Ch13)</span>
        envFrom: [{ secretRef: { name: app-env } }]   <span class="tok-comment"># /etc/app.env</span>
        readinessProbe:                          <span class="tok-comment"># option httpchk GET /health</span>
          httpGet: { path: /health, port: 8000 }</code></pre>
<table>
<tr><th>Ở Bài 14.2</th><th>Trong Kubernetes</th></tr>
<tr><td>hai máy chạy cùng một ảnh</td><td><code>replicas: 2</code></td></tr>
<tr><td>HAProxy + phép kiểm <code>/health</code></td><td>một Service + <code>readinessProbe</code></td></tr>
<tr><td><code>rolling.sh</code>, rút từng máy một</td><td><code>strategy.rollingUpdate</code></td></tr>
<tr><td><code>/etc/app.env</code></td><td>một Secret / ConfigMap</td></tr>
<tr><td>một máy chết ⇒ lưu lượng chuyển đi</td><td>một pod mới được khởi động ở node khác</td></tr>
</table>
<p>Nó không cần thiết cho một app, một nhóm bốn năm người, một học kỳ: cụm máy tốn tiền cả lúc rảnh, và gỡ lỗi nó đòi những khái niệm (pod, service, ingress, controller) chẳng liên quan gì tới app của bạn. Nó bắt đầu đáng giá khi có nhiều dịch vụ và nhiều máy. Khoá dành cho nó là <strong><code>/courses/kubernetes</code></strong>.</p>

<h3>Chạy thử từng bước</h3>
<ol>
<li>Chạy bộ máy của bạn trên máy cá nhân bằng Docker Compose, bấm qua các trang chính rồi đọc <code>docker stats --no-stream</code>.</li>
<li>Mở các trang giá ở cuối bài; ghi lại, kèm ngày hôm nay, giá của gói nhỏ nhất vừa đủ RAM của bạn trên từng nền tảng.</li>
<li>Điền bảng "một đồ án, bốn hoá đơn" cho dự án của chính bạn, kể cả dòng cơ sở dữ liệu.</li>
<li>Khoanh mọi dòng "miễn phí" có đi ngủ, hết hạn hoặc phi thương mại.</li>
</ol>

<div class="pitfall co-tieu-de"><strong>Bẫy — chọn theo gói miễn phí.</strong> Gói miễn phí được thiết kế để thử, và gói nào cũng có một giới hạn lộ ra vào lúc tệ nhất: máy đi ngủ, cơ sở dữ liệu hết hạn, hạn mức bị chặn làm web ngừng tới hết tháng (Vercel Hobby: không trả thêm được, bạn phải chờ). Tính giá cho gói bạn sẽ cần vào đúng ngày bảo vệ, không phải gói hôm nay không mất tiền.</div>

<h3>Trên macOS và Windows: ảnh bạn build không phải ảnh họ chạy</h3>
<p>Những nền tảng build từ kho mã của bạn (Render, Railway, Vercel) build trên máy của họ, thường là x86-64. Còn nếu bạn đẩy một ảnh build sẵn từ Mac chip Apple:</p>
<div class="out">$ docker image inspect -f "{{.Os}}/{{.Architecture}}" dv14-app:a1b2c3d
linux/arm64
$ uname -m
arm64</div>
<p>Một ảnh <code>arm64</code> không chạy được trên máy x86-64 (<code>exec format error</code>). Build bằng <code>docker buildx build --platform linux/amd64</code> cho những nơi như vậy (Chương 13.2). Trên Windows, CLI của các nền tảng (<code>vercel</code>, <code>flyctl</code>, <code>railway</code>) đều chạy trực tiếp; giữ ký tự xuống dòng LF cho mọi thứ sẽ chạy trên Linux.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm có 400.000 đồng mỗi tháng cho máy chủ (khoảng $15) và buổi bảo vệ sau tám tuần. Viết bản đề xuất một trang mà trưởng nhóm sẽ gửi thầy.</p>
<ol>
<li>Đo RAM bộ máy của bạn bằng <code>docker stats</code>.</li>
<li>Từ trang chính thức, ngay hôm nay, tính giá ba phương án vừa túi: một VPS ở Singapore, một PaaS gói trả tiền, một kiểu kết hợp (frontend Vercel Hobby + một chỗ cho API và cơ sở dữ liệu).</li>
<li>Với mỗi phương án, liệt kê những chương của khoá này bạn vẫn phải tự làm.</li>
<li>Chọn một và nói rõ một rủi ro bạn chấp nhận.</li>
</ol>
<p><strong>Đạt khi:</strong> trang có ba phương án có giá kèm nguồn và ngày, một con số RAM đo thật, không gói nào ngủ hay hết hạn trong tuần bảo vệ, và một câu gọi tên rủi ro được chấp nhận.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">PaaS (nền tảng như dịch vụ)</span><span class="v">Nền tảng build, chạy và tráo app của bạn từ một kho mã hoặc một ảnh.</span></div>
  <div class="kv"><span class="k">Serverless / function (không máy chủ / hàm)</span><span class="v">Mã được nhà cung cấp chạy theo từng request, không có máy để bạn quản, không tính tiền lúc rảnh.</span></div>
  <div class="kv"><span class="k">Cold start (khởi động lạnh)</span><span class="v">Khoảng chờ trong lúc một bản đang ngủ hoặc một hàm khởi động trước khi trả lời được.</span></div>
  <div class="kv"><span class="k">Managed database (cơ sở dữ liệu có quản lý)</span><span class="v">Cơ sở dữ liệu nhà cung cấp chạy, sao lưu và vá hộ — thường là dòng đắt nhất.</span></div>
  <div class="kv"><span class="k">Egress (lưu lượng ra)</span><span class="v">Dữ liệu gửi ra khỏi mạng nhà cung cấp tới người dùng; thường là phần băng thông bị tính tiền.</span></div>
  <div class="kv"><span class="k">Metered billing (tính theo đồng hồ)</span><span class="v">Trả theo từng giây RAM/CPU thật sự dùng thay vì một gói cố định mỗi tháng.</span></div>
  <div class="kv"><span class="k">Kubernetes Deployment</span><span class="v">Bản mô tả cần chạy bao nhiêu bản của ảnh nào và thay chúng thế nào.</span></div>
  <div class="kv"><span class="k">Vendor lock-in (bị trói vào nhà cung cấp)</span><span class="v">Phụ thuộc vào tính năng chỉ một hãng có, nên muốn rời đi là phải viết lại.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>So nền tảng bằng việc bạn còn lo những tầng nào và chúng tốn bao nhiêu, không bằng thương hiệu.</li>
<li>Tính đến 09/2026, một VPS DigitalOcean 2 GiB giá $12; Hetzner rẻ hơn nhiều ở châu Âu nhưng xa Việt Nam.</li>
<li>PaaS gỡ Chương 1–3 và 12 khỏi việc của bạn; cơ sở dữ liệu có quản lý thường là khoản đắt nhất.</li>
<li>Web service miễn phí của Render ngủ sau 15 phút và Postgres miễn phí hết hạn sau 30 ngày; Vercel Hobby là phi thương mại.</li>
<li>Đo RAM trước khi chọn gói; cùng một đồ án tính ra từ $8 tới $45 mỗi tháng tuỳ nền tảng.</li>
<li>Kubernetes tự động hoá đúng những gì Bài 14.2 làm bằng tay; nó không cần cho một app và một học kỳ.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">DigitalOcean — Giá Droplet</span><span class="lc-sub">digitalocean.com/pricing/droplets — các gói, lưu lượng, sao lưu và snapshot.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Hetzner — Điều chỉnh giá (15/06/2026)</span><span class="lc-sub">docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/ — giá cloud hiện hành theo vị trí.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Vercel — Gói Hobby</span><span class="lc-sub">vercel.com/docs/plans/hobby — mức dùng kèm theo và giới hạn phi thương mại.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Render — Deploy miễn phí</span><span class="lc-sub">render.com/docs/free — ngủ sau 15 phút, Postgres miễn phí 30 ngày.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Railway — Bảng giá</span><span class="lc-sub">railway.com/pricing — các gói và giá theo từng tài nguyên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Fly.io — Bảng giá</span><span class="lc-sub">docs.fly.io/about/pricing/ — máy, ổ đĩa, IPv4, lưu lượng theo vùng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS Lambda — Bảng giá</span><span class="lc-sub">aws.amazon.com/lambda/pricing/ — gói miễn phí và giá theo request.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Kubernetes</span><span class="lc-sub">/courses/kubernetes/learn${REF} — Deployment, Service và rollout, học cho đàng hoàng.</span></span></div>
</div>
`,
    },
    /* ─────────────────────────── 14.4 ─────────────────────────── */
    {
      title: "14.4 — Costs, and moving to a new server without losing data|||14.4 — Chi phí, và chuyển sang máy chủ mới mà không mất dữ liệu",
      slug: "deploy-14-4-chi-phi-doi-nha-cung-cap",
      type: "LESSON",
      isFreePreview: true,
      description: "Chọn VPS theo bốn con số và độ trễ đo thật tới Singapore, châu Âu, Mỹ; đo máy mới bằng fio và iperf3; hạ TTL trước; chuyển nhà bằng đóng băng ghi, dump/restore, rsync hai lượt, so, đổi A — và đo 19 lịch hẹn mất khi bỏ bước đóng băng; hoá đơn bất ngờ.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.4</span>
<h2>Costs, and moving to a new server without losing data</h2>
<p class="lead">Sooner or later every project moves: the trial credit runs out, a cheaper provider appears, the machine is too small, or it is on the wrong continent. Moving a website is easy. Moving it <em>without losing the bookings made during the move</em> is the part people get wrong — and nobody notices until a patient arrives for an appointment the new server has never heard of. This lesson chooses a new server by measuring, moves a live database and its uploads between two lab VPSes, and measures what the shortcut costs.</p>

<h3>Choosing a VPS: four numbers, and where it is</h3>
${slide('dv-14', 22, 'Độ trễ đo từ Việt Nam: Singapore 37 ms, châu Âu và Mỹ 180–235 ms mỗi vòng đi-về')}
<p>Four numbers decide whether a plan fits: <strong>RAM</strong> (a group project with Postgres, an API and a Next.js server needs about 2 GB; cuongthai.com runs on 6 GB), <strong>vCPU</strong> (1–2 is plenty until you build on the server — Chapter 8 says don't), <strong>disk</strong> (at least 40 GB: images, logs and Docker's build cache filled cuongthai.com's disk once) and <strong>outbound transfer</strong> per month. The fifth thing is not on the plan: the distance to your users. It was measured from a Fedora machine at home in Vietnam, against the public speed-test hosts Hetzner runs in each location:</p>
<pre><code class="language-bash">for h in sin fsn1 hel1 ash hil; do
  printf "%-24s" $h-speed.hetzner.com
  for i in $(seq 1 7); do
    curl -s -o /dev/null -m 8 -w "%{time_connect}\\n" http://$h-speed.hetzner.com/   <span class="tok-comment"># thời gian tới khi TCP nối xong</span>
  done | sort -n | head -1                                                         <span class="tok-comment"># lấy lần nhanh nhất trong 7</span>
done</code></pre>
<div class="out">sin-speed.hetzner.com   0.036925
fsn1-speed.hetzner.com  0.212615
hel1-speed.hetzner.com  0.235182
ash-speed.hetzner.com   0.222542
hil-speed.hetzner.com   0.180569</div>
<p><code>time_connect</code> is the time for the TCP handshake, which is about one round trip (RTT). Taking the minimum of seven removes the noise of a busy home network (run from the Mac on another network, three tries to Singapore gave 85, 138 and 326 ms, so measure somewhere quiet). Singapore is 37 ms away; Falkenstein in Germany 213 ms, Helsinki 235 ms, Virginia 223 ms, Oregon 181 ms. Opening a new HTTPS page costs roughly three to four round trips (TCP, TLS, the request) before the first byte, so the German server adds about 0.5–0.7 s to every first page load for a user in Vietnam — more than any code optimisation will win back. That is why the cheap CX23 in Germany (14.3) is the wrong machine for a Vietnamese audience, and the right one for a European one.</p>

<h3>Measure the new machine before moving in</h3>
${slide('dv-14', 23, 'Đo máy mới: nproc, free, memory.max, fio 4k ngẫu nhiên, iperf3 — trong container chỉ là minh hoạ')}
<p>A plan's description is a promise; measure it on the day you get the machine, with commands you will run the same way on the next provider. On the lab VPS:</p>
<div class="out">$ nproc; free -h | head -2; df -h / | tail -1
10
               total        used        free      shared  buff/cache   available
Mem:           7.7Gi       3.2Gi       1.0Gi        62Mi       3.8Gi       4.6Gi
overlay         911G   38G  827G   5% /
$ cat /sys/fs/cgroup/memory.max
536870912
$ fio --name=randrw --rw=randrw --bs=4k --size=256M --runtime=20 --time_based --direct=1 --ioengine=libaio --iodepth=16 --group_reporting
fio-3.36
  read: IOPS=51.6k, BW=202MiB/s (212MB/s)(4035MiB/20001msec)
    clat percentiles (usec):
     | 99.00th=[  433], 99.50th=[  644], 99.90th=[ 1516], 99.95th=[ 2089],
  write: IOPS=51.6k, BW=201MiB/s (211MB/s)(4030MiB/20001msec); 0 zone resets
$ iperf3 -c 172.30.14.102 -t 5
[ ID] Interval           Transfer     Bitrate         Retr
[  5]   0.00-5.00   sec  27.9 GBytes  47.8 Gbits/sec  4732             sender
[  5]   0.00-5.00   sec  27.9 GBytes  47.8 Gbits/sec                  receiver</div>
<p><strong>These numbers are the Mac's, not a VPS's</strong>, and that is itself the first lesson in reading them. Inside a container, <code>nproc</code> and <code>free</code> report the whole Docker virtual machine (10 CPUs, 7.7 GiB), while the real limit is in the cgroup file (<code>536870912</code> bytes = the 512 MiB given with <code>--memory</code>). 47.8 Gbit/s is two containers on the same bridge — memory copies, not a network. On a real VPS these commands tell the truth, and they are the ones to run.</p>
<table>
<tr><th>fio flag</th><th>Meaning</th></tr>
<tr><td><code>--rw=randrw --bs=4k</code></td><td>Random reads and writes of 4 KiB — the pattern of a database, not of copying a large file.</td></tr>
<tr><td><code>--direct=1</code></td><td>Bypass the page cache, so you measure the disk, not RAM.</td></tr>
<tr><td><code>--iodepth=16 --ioengine=libaio</code></td><td>Keep 16 requests in flight, like a busy database.</td></tr>
<tr><td><code>--size=256M --runtime=20 --time_based</code></td><td>A 256 MB test file; run for 20 s regardless. Delete the file afterwards.</td></tr>
<tr><td>output <code>IOPS</code>, <code>99.00th</code></td><td>Operations per second, and the latency that 99% of operations beat — the tail is what users feel.</td></tr>
</table>
<p><code>iperf3 -s</code> on one machine and <code>iperf3 -c &lt;ip&gt;</code> on the other measure the network between an app server and a database server (14.2). Run each test on the old and the new server; the comparison, not the absolute number, is what you are buying.</p>

<h3>Lower the TTL first — it only works after the old TTL</h3>
${slide('dv-14', 24, 'Hạ TTL trong zone nhưng resolver vẫn giữ số cũ 110 giây; lịch chuyển nhà T trừ một ngày tới T cộng vài ngày')}
<p>Chapter 12.1 showed that a resolver keeps an answer until its TTL runs out. The consequence for a move is easy to get wrong: lowering the TTL does not take effect immediately either. In the lab, the record had a TTL of 120 s; a resolver had just cached it; the zone was then changed to 20 s:</p>
<pre><code class="language-ini">$TTL 120                                   <span class="tok-comment"># trước khi hạ</span>
@   IN SOA ns1.vidu.test. admin.vidu.test. ( 2026092901 3600 600 86400 30 )
@   IN NS  ns1.vidu.test.
ns1 IN A   172.30.14.53
@   IN A   172.30.14.201                   <span class="tok-comment"># dv14-old</span></code></pre>
<div class="out">== 16:30:38 hạ TTL 120 → 20 trong zone (serial +1), rndc reload
máy thẩm quyền : vidu.test. 20 IN A 172.30.14.201
resolver đệm   : vidu.test. 110 IN A 172.30.14.201
== 16:30:43
máy thẩm quyền : vidu.test. 20 IN A 172.30.14.201
resolver đệm   : vidu.test. 104 IN A 172.30.14.201
16:32:13 vidu.test. 15 IN A 172.30.14.201
16:32:18 vidu.test. 10 IN A 172.30.14.201
16:32:23 vidu.test. 5 IN A 172.30.14.201
16:32:28 vidu.test. 0 IN A 172.30.14.201
16:32:33 vidu.test. 20 IN A 172.30.14.201</div>
<p>The authoritative server (<code>máy thẩm quyền</code>) answered 20 at once; the caching resolver (<code>resolver đệm</code>) kept counting down from 120 and only fetched the new, short TTL after about two minutes. With a real TTL of 3600 or 86400, that "two minutes" is an hour or a day. Hence the schedule:</p>
<table>
<tr><th>When</th><th>What</th></tr>
<tr><td>T − (old TTL), e.g. a day before</td><td>Lower the TTL to 60–300 s. Nothing else changes.</td></tr>
<tr><td>T − a few hours</td><td>Set up the new server; first rsync pass; a test restore; measure it; try it with <code>curl --resolve</code> (Chapter 12.1).</td></tr>
<tr><td>T</td><td>Freeze writes → dump/restore → second rsync pass → compare → old server forwards to new → change the A record.</td></tr>
<tr><td>T + a few days</td><td>Watch the old server's access log fall to zero; switch it off; raise the TTL again.</td></tr>
</table>

<h3>The move, in one script</h3>
${slide('dv-14', 25, 'Script cắt chuyển: đóng băng ghi, dump sang máy mới qua SSH, rsync lượt 2, so số dòng và md5, máy cũ chuyển tiếp, đổi A')}
<p>The lab has an "old" server <code>dv14-old</code> (172.30.14.201) with Postgres 16 holding the clinic database (20,000 appointments) and 400 uploaded images (60 MB), and a small writer that keeps adding an appointment and an image every half second — the live site. The "new" server <code>dv14-new</code> (172.30.14.202) has Postgres installed and an empty database. First, while the site is still live, copy the bulk of the files:</p>
<div class="out">$ time rsync -aH --stats deploy@172.30.14.201:/srv/uploads/ /srv/uploads/    # pass 1: old site STILL running
Number of files: 412 (reg: 411, dir: 1)
Number of regular files transferred: 411
Total transferred file size: 61,951,520 bytes
real	0m0.496s</div>
<p>Then the cut-over, as a script run from the laptop — every step printed with the elapsed time, and a comparison <em>before</em> anything points at the new server:</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># cat-chuyen.sh — cắt chuyển dv14-old → dv14-new (chạy từ máy dev). Web đóng băng ghi từ bước 1 tới bước 5.</span>
set -euo pipefail
OLD=19140; NEW=19141; t0=$(date +%s)
buoc() { echo "[$(( $(date +%s) - t0 ))s] $*"; }
buoc "1. đóng băng ghi trên máy cũ (bảo trì)"
./ssh.sh $OLD 'touch /tmp/dong-bang; sleep 1'
buoc "2. dump máy cũ → restore máy mới (qua SSH, không qua đĩa)"
./ssh.sh $NEW 'ssh deploy@172.30.14.201 "sudo -u postgres pg_dump -Fc datlich" | sudo -u postgres pg_restore -d datlich --no-owner --role=app --clean --if-exists'
buoc "3. rsync lượt 2: chỉ phần mới từ lượt 1"
./ssh.sh $NEW 'rsync -aH --delete --stats deploy@172.30.14.201:/srv/uploads/ /srv/uploads/ | grep -E "Number of regular files transferred|Total transferred file size"'
buoc "4. so hai bên"
for p in $OLD $NEW; do
  ./ssh.sh $p 'printf "%-9s lich_hen=%s  tep=%s  tong-md5=%s\\n" $(hostname) \\
    $(sudo -u postgres psql -tAd datlich -c "select count(*) from lich_hen") \\
    $(ls /srv/uploads | wc -l) \\
    $(cd /srv/uploads &amp;&amp; ls | sort | xargs cat | md5sum | cut -c1-12)'
done
buoc "5. máy mới nhận ghi; máy cũ chuyển tiếp mọi request sang máy mới"
./ssh.sh $OLD 'echo "server { listen 80 default_server; location / { proxy_pass http://172.30.14.202; } }" | sudo tee /etc/nginx/sites-enabled/default &gt;/dev/null &amp;&amp; sudo nginx -s reload'
buoc "6. đổi bản ghi A sang IP mới"
docker exec dv14-dns sh -c 'sed -i "s/172.30.14.201/172.30.14.202/; s/2026092902/2026092903/" /var/cache/bind/db.vidu.test &amp;&amp; rndc reload vidu.test &gt;/dev/null'
buoc "xong — thời gian đóng băng ghi ≈ tới bước 5"</code></pre>
<div class="out">$ ./cat-chuyen.sh
[0s] 1. đóng băng ghi trên máy cũ (bảo trì)
[1s] 2. dump máy cũ → restore máy mới (qua SSH, không qua đĩa)
[2s] 3. rsync lượt 2: chỉ phần mới từ lượt 1
Number of regular files transferred: 208
Total transferred file size: 12,480,000 bytes
[2s] 4. so hai bên
dv14-old  lich_hen=20219  tep=619  tong-md5=68a3fdeea1c9
dv14-new  lich_hen=20219  tep=619  tong-md5=68a3fdeea1c9
[3s] 5. máy mới nhận ghi; máy cũ chuyển tiếp mọi request sang máy mới
2026/09/29 09:33:01 [notice] 1964#1964: signal process started
[3s] 6. đổi bản ghi A sang IP mới
[4s] xong — thời gian đóng băng ghi ≈ tới bước 5</div>
<p>Writes were frozen for about three seconds. The second rsync pass moved only the 208 images added since the first pass. Step 4 is the one that lets you sleep: the same number of appointments on both sides, the same number of files, and the same checksum over all file contents. Only then does anything point at the new server.</p>
<table>
<tr><th>Piece</th><th>Why it is there</th></tr>
<tr><td><code>pg_dump -Fc … | pg_restore</code> over SSH</td><td>No dump file left lying on either disk; the custom format lets <code>pg_restore</code> run in parallel on large databases (<code>-j</code>).</td></tr>
<tr><td><code>--clean --if-exists</code></td><td>The script can be re-run after a failed attempt without "already exists" errors.</td></tr>
<tr><td><code>rsync -aH --delete</code>, two passes</td><td>Pass 1 while live moves the bulk; pass 2 during the freeze moves only the difference; <code>--delete</code> removes files deleted in between.</td></tr>
<tr><td>count + md5 on both sides</td><td>A mismatch stops the move before DNS changes.</td></tr>
<tr><td>old nginx → <code>proxy_pass</code> to the new IP</td><td>Anyone whose resolver still has the old IP reaches the new server anyway — no waiting for TTLs, no split writes.</td></tr>
</table>
<div class="out">$ curl -s --resolve vidu.test:80:172.30.14.201 http://vidu.test/    # someone still holding the OLD IP
may: dv14-new
$ curl -s --resolve vidu.test:80:172.30.14.202 http://vidu.test/    # the NEW IP
may: dv14-new
16:33:02 vidu.test. 20 IN A 172.30.14.202 → may: dv14-new</div>
<p>In this run the resolver's cached answer happened to expire right at the switch, so it picked up the new IP immediately; the worst case would have been the 20 s TTL set earlier. Either way, the old server forwards, so no user reaches a database that is no longer the real one.</p>
<p><strong>The freeze in a real app</strong> is a maintenance flag: the API returns 503 with <code>Retry-After</code> for writes (or the whole site shows a maintenance page) while reads may continue. Announce it; three seconds in the lab becomes a few minutes with a real database, which is why it is scheduled at night.</p>

<h3>Copying while the site still writes loses data</h3>
${slide('dv-14', 26, 'Dump lúc web cũ vẫn ghi rồi đổi ngay: 19 lịch hẹn chỉ nằm trên máy cũ; làm đúng thì đóng băng khoảng 3 giây')}
<p>The tempting shortcut skips the freeze: dump, restore, switch DNS, done. The lab ran exactly that with the writer still going, and compared ten seconds later:</p>
<div class="out"># dump taken while the old site was STILL writing; DNS switched at once; 10 seconds later:
dv14-old lich_hen=20239
dv14-new lich_hen=20220</div>
<p>Nineteen appointments were booked on the old server after the dump started — each user saw "booked successfully" — and they exist only there. Nothing errors. The new server is missing them forever, and the old server keeps receiving more from everyone whose DNS has not changed yet. The fix is the rule the script follows: <strong>at any moment, exactly one server accepts writes.</strong> For a database of tens of gigabytes, where a dump takes an hour, the freeze would be too long; the tool then is a streaming replica on the new server, kept in sync while the old one runs, and promoted at the cut-over — the same rule, a shorter freeze (<code>/courses/postgresql</code>).</p>

<h3>Where surprise bills come from</h3>
${slide('dv-14', 27, 'Hoá đơn bất ngờ: băng thông ra, snapshot tích mãi, máy quên tắt, IPv4, serverless vọt, DB có quản lý')}
<table>
<tr><th>Item</th><th>Why it surprises</th><th>Figures (as of 09/2026)</th><th>Prevent</th></tr>
<tr><td>Outbound bandwidth</td><td>video/images served straight from the VPS; a scraper downloads everything</td><td>DigitalOcean $0.01/GiB beyond the pool; Vercel Pro and Render $0.15/GB</td><td>media through a CDN / R2 (Chapter 12.4); a billing alert</td></tr>
<tr><td>Snapshots, backups</td><td>billed per GB per month, and they pile up</td><td>DigitalOcean snapshots $0.06/GB; backups +20–30% of the Droplet price</td><td>keep N, delete older ones automatically (Chapter 10)</td></tr>
<tr><td>Forgotten machines</td><td>staging, previews, the test server from this lesson</td><td>a 2 GiB Droplet is $12 whether anyone uses it or not</td><td>labels + a monthly clean-up; PaaS bills per second</td></tr>
<tr><td>IPv4 addresses</td><td>the plan price says "excl. IPv4"</td><td>Hetzner prices exclude the primary IPv4; Fly.io dedicated IPv4 $2/month</td><td>read the small print</td></tr>
<tr><td>Serverless spikes</td><td>a loop calling a function, a bot</td><td>Lambda $0.20/1M requests + GB-seconds</td><td>a spend cap</td></tr>
<tr><td>Managed database</td><td>the smallest is already more than a VPS</td><td>Fly Managed Postgres Basic $38; Render 1 GB $19</td><td>for a project: Postgres on the VPS + tested backups</td></tr>
</table>
<p>Bandwidth is the one you can measure yourself before the bill does. The tenth field of nginx's default <code>combined</code> log is <code>$body_bytes_sent</code>:</p>
<div class="out">$ sudo tail -1 /var/log/nginx/access.log
127.0.0.1 - - [29/Sep/2026:09:24:10 +0000] "GET /me HTTP/1.1" 200 38 "-" "curl/8.5.0"
$ sudo awk '{n++; b+=$10} END {printf "%d request, %.1f MB gửi đi, TB %.0f byte/request\\n", n, b/1e6, b/n}' /var/log/nginx/access.log
1137 request, 0.1 MB gửi đi, TB 64 byte/request</div>
<p>On the lab balancer that is 1,137 tiny JSON answers. On a real site, run it on a day's log, multiply by thirty, and compare with the plan's allowance — a single 5 MB image on a popular page can be most of the total.</p>

<h3>Try it step by step</h3>
<ol>
<li>Two lab servers with Postgres (<code>dv14-old</code>, <code>dv14-new</code>), SSH between them with the lab key; bind9 + unbound for <code>vidu.test</code> with TTL 120.</li>
<li>Fill the old database and uploads; start a writer loop.</li>
<li>Query the resolver, lower the TTL to 20, query again every few seconds until it shows 20.</li>
<li>First rsync pass; then <code>cat-chuyen.sh</code>; read the comparison lines.</li>
<li>Restart the writer, do a dump-and-switch <em>without</em> the freeze into a second database, and count the difference after ten seconds.</li>
</ol>

<div class="pitfall co-tieu-de"><strong>Trap — the old server keeps working after the move.</strong> Stopping writes through the web is not the same as stopping writes. A cron job on the old server still sends appointment reminders (twice, now that the new one does too), a queue worker still processes jobs into the old database, a teammate's script still points at the old IP. Before the cut-over, list everything that runs on the old machine — <code>systemctl list-timers</code>, <code>crontab -l</code> for each user, <code>docker ps</code> — and stop what writes.</div>

<h3>On macOS and Windows: which rsync is running</h3>
<p>The script above runs rsync <em>between the two servers</em>, not from the laptop, on purpose. The rsync that comes with macOS is not the one on Linux:</p>
<div class="out">$ rsync --version | head -2
openrsync: protocol version 29
rsync version 2.6.9 compatible
$ which rsync
/usr/bin/rsync</div>
<p>Apple ships openrsync, compatible with rsync 2.6.9 (2006); some flags used on Linux are missing or behave differently. Copying server to server avoids it and also avoids pulling 60 MB down to a laptop on a café connection and up again. On Windows use rsync inside WSL. And remember the trailing slash: <code>/srv/uploads/</code> copies the contents; <code>/srv/uploads</code> copies the directory itself into the target, giving <code>/srv/uploads/uploads</code>.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the group's free-trial VPS expires on Friday; the defence is next Tuesday. Move the clinic app to a new server on Thursday night without losing a single booking, and prove it.</p>
<ol>
<li>Measure the new lab server (<code>nproc</code>, <code>memory.max</code>, <code>fio</code>) and the latency to your chosen location.</li>
<li>Lower the TTL; record when the resolver shows the new TTL.</li>
<li>First rsync pass while the writer runs; then run the cut-over script.</li>
<li>From a client, request the site through the old IP and the new IP.</li>
</ol>
<p><strong>Done when:</strong> the comparison lines show identical appointment counts, file counts and checksums; both IPs answer from <code>dv14-new</code>; and your notes give the length of the write freeze and the time the resolver needed to show the short TTL.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">RTT (round-trip time)</span><span class="v">Time for a packet to reach a server and the answer to come back; distance sets its floor.</span></div>
  <div class="kv"><span class="k">IOPS</span><span class="v">Disk operations per second — what a database lives on.</span></div>
  <div class="kv"><span class="k">cgroup memory.max</span><span class="v">The real memory limit of a container, which <code>free</code> inside it does not show.</span></div>
  <div class="kv"><span class="k">Cut-over</span><span class="v">The moment traffic and writes switch from the old system to the new one.</span></div>
  <div class="kv"><span class="k">Write freeze / maintenance mode</span><span class="v">A short period when the site refuses writes so the copy can be complete.</span></div>
  <div class="kv"><span class="k">Delta sync</span><span class="v">Copying only what changed since the last copy — rsync's second pass.</span></div>
  <div class="kv"><span class="k">Split-brain</span><span class="v">Two servers both accepting writes, so each has data the other lacks.</span></div>
  <div class="kv"><span class="k">Egress bill</span><span class="v">The charge for data sent out beyond the plan's allowance.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Choose a server by RAM, CPU, disk, transfer — and measured distance: Singapore was 37 ms from Vietnam, Europe and the US 180–235 ms.</li>
<li>Measure a new machine with <code>nproc</code>, <code>memory.max</code>, <code>fio</code> and <code>iperf3</code>; numbers inside a container on a laptop are illustrations only.</li>
<li>Lower the TTL at least one old-TTL before the move; the lab resolver kept the old TTL for another 110 s.</li>
<li>Move with one rule: freeze writes, dump/restore, second rsync pass, compare counts and checksums, then forward the old server and change DNS.</li>
<li>Skipping the freeze lost 19 appointments in 10 seconds, silently.</li>
<li>Surprise bills come from bandwidth, snapshots, forgotten machines, IPv4 and managed databases — measure bandwidth from your own logs.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_dump</span><span class="lc-sub">postgresql.org/docs/current/app-pgdump.html — custom format, parallel restore.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">DigitalOcean — Bandwidth billing</span><span class="lc-sub">docs.digitalocean.com/platform/billing/bandwidth/ — $0.01/GiB overage, pooled per team.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Hetzner — Traffic</span><span class="lc-sub">docs.hetzner.com/robot/general/traffic/ — included traffic per location and the price per extra TB.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — replication</span><span class="lc-sub">/courses/postgresql/learn${REF} — streaming replicas for databases too big to dump during a freeze.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — rsync, SSH, systemd timers</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the tools this move is made of.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.4</span>
<h2>Chi phí, và chuyển sang máy chủ mới mà không mất dữ liệu</h2>
<p class="lead">Sớm muộn gì dự án nào cũng dọn nhà: hết tín dụng dùng thử, có nhà cung cấp rẻ hơn, máy quá nhỏ, hoặc đặt nhầm châu lục. Chuyển một trang web thì dễ. Chuyển nó <em>mà không mất những lịch hẹn được đặt trong lúc chuyển</em> mới là phần người ta hay làm sai — và không ai biết cho tới khi một bệnh nhân tới khám theo một lịch hẹn mà máy mới chưa từng nghe tới. Bài này chọn máy mới bằng cách đo, chuyển một cơ sở dữ liệu đang sống cùng tệp tải lên của nó giữa hai VPS thí nghiệm, và đo cái giá của lối tắt.</p>

<h3>Chọn VPS: bốn con số, và nó đặt ở đâu</h3>
${slide('dv-14', 22, 'Độ trễ đo từ Việt Nam: Singapore 37 ms, châu Âu và Mỹ 180–235 ms mỗi vòng đi-về')}
<p>Bốn con số quyết định một gói có vừa hay không: <strong>RAM</strong> (đồ án nhóm có Postgres, một API và một máy chủ Next.js cần khoảng 2 GB; cuongthai.com chạy trên 6 GB), <strong>vCPU</strong> (1–2 là thừa, trừ khi bạn build trên máy chủ — Chương 8 bảo đừng), <strong>đĩa</strong> (ít nhất 40 GB: ảnh, log và cache build của Docker từng làm đầy đĩa cuongthai.com) và <strong>lưu lượng ra</strong> mỗi tháng. Thứ năm không có trên gói: khoảng cách tới người dùng của bạn. Nó được đo từ một máy Fedora ở nhà tại Việt Nam, tới các máy thử tốc độ công khai mà Hetzner đặt ở từng vị trí:</p>
<pre><code class="language-bash">for h in sin fsn1 hel1 ash hil; do
  printf "%-24s" $h-speed.hetzner.com
  for i in $(seq 1 7); do
    curl -s -o /dev/null -m 8 -w "%{time_connect}\\n" http://$h-speed.hetzner.com/   <span class="tok-comment"># thời gian tới khi TCP nối xong</span>
  done | sort -n | head -1                                                         <span class="tok-comment"># lấy lần nhanh nhất trong 7</span>
done</code></pre>
<div class="out">sin-speed.hetzner.com   0.036925
fsn1-speed.hetzner.com  0.212615
hel1-speed.hetzner.com  0.235182
ash-speed.hetzner.com   0.222542
hil-speed.hetzner.com   0.180569</div>
<p><code>time_connect</code> là thời gian bắt tay TCP, xấp xỉ một vòng đi-về (RTT). Lấy lần nhỏ nhất trong bảy lần để gạt nhiễu của mạng gia đình đang bận (chạy từ máy Mac ở một mạng khác, ba lần đo tới Singapore ra 85, 138 và 326 ms, nên hãy đo ở chỗ yên tĩnh). Singapore cách 37 ms; Falkenstein ở Đức 213 ms, Helsinki 235 ms, Virginia 223 ms, Oregon 181 ms. Mở một trang HTTPS mới tốn chừng ba tới bốn vòng đi-về (TCP, TLS, request) trước byte đầu tiên, nên máy ở Đức cộng thêm khoảng 0,5–0,7 giây vào mọi lần tải trang đầu tiên của một người dùng ở Việt Nam — nhiều hơn mọi thứ tối ưu mã giành lại được. Đó là lý do máy CX23 rẻ ở Đức (14.3) là cái máy sai cho người dùng Việt Nam, và là cái máy đúng cho người dùng châu Âu.</p>

<h3>Đo máy mới trước khi dọn nhà vào</h3>
${slide('dv-14', 23, 'Đo máy mới: nproc, free, memory.max, fio 4k ngẫu nhiên, iperf3 — trong container chỉ là minh hoạ')}
<p>Mô tả của một gói là một lời hứa; đo nó ngay ngày nhận máy, bằng những lệnh bạn sẽ chạy y hệt ở nhà cung cấp kế tiếp. Trên VPS thí nghiệm:</p>
<div class="out">$ nproc; free -h | head -2; df -h / | tail -1
10
               total        used        free      shared  buff/cache   available
Mem:           7.7Gi       3.2Gi       1.0Gi        62Mi       3.8Gi       4.6Gi
overlay         911G   38G  827G   5% /
$ cat /sys/fs/cgroup/memory.max
536870912
$ fio --name=randrw --rw=randrw --bs=4k --size=256M --runtime=20 --time_based --direct=1 --ioengine=libaio --iodepth=16 --group_reporting
fio-3.36
  read: IOPS=51.6k, BW=202MiB/s (212MB/s)(4035MiB/20001msec)
    clat percentiles (usec):
     | 99.00th=[  433], 99.50th=[  644], 99.90th=[ 1516], 99.95th=[ 2089],
  write: IOPS=51.6k, BW=201MiB/s (211MB/s)(4030MiB/20001msec); 0 zone resets
$ iperf3 -c 172.30.14.102 -t 5
[ ID] Interval           Transfer     Bitrate         Retr
[  5]   0.00-5.00   sec  27.9 GBytes  47.8 Gbits/sec  4732             sender
[  5]   0.00-5.00   sec  27.9 GBytes  47.8 Gbits/sec                  receiver</div>
<p><strong>Đây là số của máy Mac, không phải của một VPS</strong>, và đó chính là bài học đầu tiên khi đọc chúng. Trong container, <code>nproc</code> và <code>free</code> báo cả máy ảo Docker (10 CPU, 7,7 GiB), còn giới hạn thật nằm trong tệp cgroup (<code>536870912</code> byte = 512 MiB cấp bằng <code>--memory</code>). 47,8 Gbit/s là hai container trên cùng một cầu nối mạng — chép bộ nhớ, không phải mạng. Trên một VPS thật các lệnh này nói thật, và chúng chính là những lệnh cần chạy.</p>
<table>
<tr><th>Cờ fio</th><th>Nghĩa</th></tr>
<tr><td><code>--rw=randrw --bs=4k</code></td><td>Đọc và ghi ngẫu nhiên từng khối 4 KiB — kiểu truy cập của cơ sở dữ liệu, không phải kiểu chép một tệp lớn.</td></tr>
<tr><td><code>--direct=1</code></td><td>Bỏ qua bộ đệm trang, để đo đĩa chứ không đo RAM.</td></tr>
<tr><td><code>--iodepth=16 --ioengine=libaio</code></td><td>Giữ 16 yêu cầu đang bay cùng lúc, giống một cơ sở dữ liệu đang bận.</td></tr>
<tr><td><code>--size=256M --runtime=20 --time_based</code></td><td>Tệp thử 256 MB; chạy đủ 20 giây. Xong thì xoá tệp.</td></tr>
<tr><td>output <code>IOPS</code>, <code>99.00th</code></td><td>Số thao tác mỗi giây, và độ trễ mà 99% thao tác nhanh hơn — cái đuôi mới là thứ người dùng cảm thấy.</td></tr>
</table>
<p><code>iperf3 -s</code> trên một máy và <code>iperf3 -c &lt;ip&gt;</code> trên máy kia đo mạng giữa máy app và máy cơ sở dữ liệu (14.2). Chạy từng phép đo trên máy cũ lẫn máy mới; thứ bạn mua là phần so sánh, không phải con số tuyệt đối.</p>

<h3>Hạ TTL trước — nó chỉ có tác dụng sau khi TTL cũ hết</h3>
${slide('dv-14', 24, 'Hạ TTL trong zone nhưng resolver vẫn giữ số cũ 110 giây; lịch chuyển nhà T trừ một ngày tới T cộng vài ngày')}
<p>Chương 12.1 đã cho thấy resolver giữ một câu trả lời tới khi TTL hết. Hệ quả của chuyện đó với việc chuyển nhà rất dễ hiểu sai: hạ TTL cũng không có tác dụng ngay. Trong phòng thí nghiệm, bản ghi có TTL 120 giây; một resolver vừa đệm nó; rồi zone được sửa xuống 20 giây:</p>
<pre><code class="language-ini">$TTL 120                                   <span class="tok-comment"># trước khi hạ</span>
@   IN SOA ns1.vidu.test. admin.vidu.test. ( 2026092901 3600 600 86400 30 )
@   IN NS  ns1.vidu.test.
ns1 IN A   172.30.14.53
@   IN A   172.30.14.201                   <span class="tok-comment"># dv14-old</span></code></pre>
<div class="out">== 16:30:38 hạ TTL 120 → 20 trong zone (serial +1), rndc reload
máy thẩm quyền : vidu.test. 20 IN A 172.30.14.201
resolver đệm   : vidu.test. 110 IN A 172.30.14.201
== 16:30:43
máy thẩm quyền : vidu.test. 20 IN A 172.30.14.201
resolver đệm   : vidu.test. 104 IN A 172.30.14.201
16:32:13 vidu.test. 15 IN A 172.30.14.201
16:32:18 vidu.test. 10 IN A 172.30.14.201
16:32:23 vidu.test. 5 IN A 172.30.14.201
16:32:28 vidu.test. 0 IN A 172.30.14.201
16:32:33 vidu.test. 20 IN A 172.30.14.201</div>
<p>Máy có thẩm quyền trả 20 ngay lập tức; resolver đệm cứ đếm ngược từ 120 và chỉ lấy TTL mới, ngắn hơn, sau khoảng hai phút. Với TTL thật là 3600 hay 86400, "hai phút" đó là một giờ hoặc một ngày. Vì thế mới có lịch:</p>
<table>
<tr><th>Khi nào</th><th>Làm gì</th></tr>
<tr><td>T − (TTL cũ), vd trước một ngày</td><td>Hạ TTL xuống 60–300 giây. Không đổi gì khác.</td></tr>
<tr><td>T − vài giờ</td><td>Dựng máy mới; rsync lượt 1; restore thử; đo máy; thử bằng <code>curl --resolve</code> (Chương 12.1).</td></tr>
<tr><td>T</td><td>Đóng băng ghi → dump/restore → rsync lượt 2 → so → máy cũ chuyển tiếp sang máy mới → đổi bản ghi A.</td></tr>
<tr><td>T + vài ngày</td><td>Nhìn log truy cập của máy cũ giảm về 0; tắt nó; nâng TTL trở lại.</td></tr>
</table>

<h3>Chuyển nhà, gói trong một script</h3>
${slide('dv-14', 25, 'Script cắt chuyển: đóng băng ghi, dump sang máy mới qua SSH, rsync lượt 2, so số dòng và md5, máy cũ chuyển tiếp, đổi A')}
<p>Phòng thí nghiệm có một máy "cũ" <code>dv14-old</code> (172.30.14.201) chạy Postgres 16 chứa cơ sở dữ liệu phòng khám (20.000 lịch hẹn) và 400 ảnh tải lên (60 MB), cùng một vòng ghi nhỏ cứ nửa giây thêm một lịch hẹn và một ảnh — đó là web đang sống. Máy "mới" <code>dv14-new</code> (172.30.14.202) đã cài Postgres và có một cơ sở dữ liệu trống. Trước hết, trong lúc web vẫn sống, chép phần lớn các tệp:</p>
<div class="out">$ time rsync -aH --stats deploy@172.30.14.201:/srv/uploads/ /srv/uploads/    # lượt 1: web cũ VẪN chạy
Number of files: 412 (reg: 411, dir: 1)
Number of regular files transferred: 411
Total transferred file size: 61,951,520 bytes
real	0m0.496s</div>
<p>Rồi tới lúc cắt chuyển (cut-over), bằng một script chạy từ laptop — mỗi bước in kèm thời gian đã trôi, và một bước so sánh <em>trước khi</em> bất cứ thứ gì trỏ sang máy mới:</p>
<pre><code class="language-bash">#!/bin/bash
<span class="tok-comment"># cat-chuyen.sh — cắt chuyển dv14-old → dv14-new (chạy từ máy dev). Web đóng băng ghi từ bước 1 tới bước 5.</span>
set -euo pipefail
OLD=19140; NEW=19141; t0=$(date +%s)
buoc() { echo "[$(( $(date +%s) - t0 ))s] $*"; }
buoc "1. đóng băng ghi trên máy cũ (bảo trì)"
./ssh.sh $OLD 'touch /tmp/dong-bang; sleep 1'
buoc "2. dump máy cũ → restore máy mới (qua SSH, không qua đĩa)"
./ssh.sh $NEW 'ssh deploy@172.30.14.201 "sudo -u postgres pg_dump -Fc datlich" | sudo -u postgres pg_restore -d datlich --no-owner --role=app --clean --if-exists'
buoc "3. rsync lượt 2: chỉ phần mới từ lượt 1"
./ssh.sh $NEW 'rsync -aH --delete --stats deploy@172.30.14.201:/srv/uploads/ /srv/uploads/ | grep -E "Number of regular files transferred|Total transferred file size"'
buoc "4. so hai bên"
for p in $OLD $NEW; do
  ./ssh.sh $p 'printf "%-9s lich_hen=%s  tep=%s  tong-md5=%s\\n" $(hostname) \\
    $(sudo -u postgres psql -tAd datlich -c "select count(*) from lich_hen") \\
    $(ls /srv/uploads | wc -l) \\
    $(cd /srv/uploads &amp;&amp; ls | sort | xargs cat | md5sum | cut -c1-12)'
done
buoc "5. máy mới nhận ghi; máy cũ chuyển tiếp mọi request sang máy mới"
./ssh.sh $OLD 'echo "server { listen 80 default_server; location / { proxy_pass http://172.30.14.202; } }" | sudo tee /etc/nginx/sites-enabled/default &gt;/dev/null &amp;&amp; sudo nginx -s reload'
buoc "6. đổi bản ghi A sang IP mới"
docker exec dv14-dns sh -c 'sed -i "s/172.30.14.201/172.30.14.202/; s/2026092902/2026092903/" /var/cache/bind/db.vidu.test &amp;&amp; rndc reload vidu.test &gt;/dev/null'
buoc "xong — thời gian đóng băng ghi ≈ tới bước 5"</code></pre>
<div class="out">$ ./cat-chuyen.sh
[0s] 1. đóng băng ghi trên máy cũ (bảo trì)
[1s] 2. dump máy cũ → restore máy mới (qua SSH, không qua đĩa)
[2s] 3. rsync lượt 2: chỉ phần mới từ lượt 1
Number of regular files transferred: 208
Total transferred file size: 12,480,000 bytes
[2s] 4. so hai bên
dv14-old  lich_hen=20219  tep=619  tong-md5=68a3fdeea1c9
dv14-new  lich_hen=20219  tep=619  tong-md5=68a3fdeea1c9
[3s] 5. máy mới nhận ghi; máy cũ chuyển tiếp mọi request sang máy mới
2026/09/29 09:33:01 [notice] 1964#1964: signal process started
[3s] 6. đổi bản ghi A sang IP mới
[4s] xong — thời gian đóng băng ghi ≈ tới bước 5</div>
<p>Việc ghi bị đóng băng khoảng ba giây. Lượt rsync thứ hai chỉ chuyển 208 ảnh được thêm từ sau lượt một. Bước 4 là bước cho bạn ngủ yên: cùng số lịch hẹn ở hai bên, cùng số tệp, và cùng mã băm trên toàn bộ nội dung tệp. Chỉ sau đó mới có thứ gì trỏ sang máy mới.</p>
<table>
<tr><th>Mảnh</th><th>Vì sao có nó</th></tr>
<tr><td><code>pg_dump -Fc … | pg_restore</code> qua SSH</td><td>Không để lại tệp dump nằm trên đĩa nào; định dạng custom cho <code>pg_restore</code> chạy song song với cơ sở dữ liệu lớn (<code>-j</code>).</td></tr>
<tr><td><code>--clean --if-exists</code></td><td>Script chạy lại được sau một lần thử hỏng mà không gặp lỗi "already exists".</td></tr>
<tr><td><code>rsync -aH --delete</code>, hai lượt</td><td>Lượt 1 lúc web còn sống chuyển phần lớn; lượt 2 lúc đóng băng chỉ chuyển phần chênh; <code>--delete</code> xoá những tệp đã bị xoá ở giữa hai lượt.</td></tr>
<tr><td>đếm + md5 ở hai bên</td><td>Lệch là dừng việc chuyển trước khi DNS đổi.</td></tr>
<tr><td>nginx máy cũ → <code>proxy_pass</code> sang IP mới</td><td>Ai mà resolver vẫn còn IP cũ thì cũng tới máy mới — không phải chờ TTL, không ghi chia đôi.</td></tr>
</table>
<div class="out">$ curl -s --resolve vidu.test:80:172.30.14.201 http://vidu.test/    # ai còn giữ IP CŨ
may: dv14-new
$ curl -s --resolve vidu.test:80:172.30.14.202 http://vidu.test/    # IP MỚI
may: dv14-new
16:33:02 vidu.test. 20 IN A 172.30.14.202 → may: dv14-new</div>
<p>Trong lần chạy này, câu trả lời đệm của resolver tình cờ hết hạn đúng lúc đổi, nên nó nhận IP mới ngay; trường hợp tệ nhất là 20 giây TTL đã đặt từ trước. Đằng nào thì máy cũ cũng chuyển tiếp, nên không người dùng nào chạm vào một cơ sở dữ liệu không còn là bản thật.</p>
<p><strong>Đóng băng trong một app thật</strong> là một cờ bảo trì: API trả 503 kèm <code>Retry-After</code> cho các thao tác ghi (hoặc cả trang hiện trang bảo trì) trong khi việc đọc vẫn có thể tiếp tục. Báo trước; ba giây trong phòng thí nghiệm thành vài phút với một cơ sở dữ liệu thật, vì thế nó được xếp lịch vào ban đêm.</p>

<h3>Chép khi web vẫn còn ghi là mất dữ liệu</h3>
${slide('dv-14', 26, 'Dump lúc web cũ vẫn ghi rồi đổi ngay: 19 lịch hẹn chỉ nằm trên máy cũ; làm đúng thì đóng băng khoảng 3 giây')}
<p>Lối tắt hấp dẫn là bỏ bước đóng băng: dump, restore, đổi DNS, xong. Phòng thí nghiệm chạy đúng như vậy trong lúc vòng ghi vẫn chạy, rồi so sau mười giây:</p>
<div class="out"># dump lúc web cũ VẪN ghi, đổi DNS ngay, 10 giây sau:
dv14-old lich_hen=20239
dv14-new lich_hen=20220</div>
<p>Mười chín lịch hẹn được đặt trên máy cũ sau khi dump bắt đầu — mỗi người dùng đều thấy "đặt lịch thành công" — và chúng chỉ tồn tại ở đó. Không có lỗi nào. Máy mới thiếu chúng mãi mãi, còn máy cũ vẫn tiếp tục nhận thêm từ tất cả những ai DNS chưa đổi. Cách sửa là cái luật script ở trên tuân theo: <strong>ở mọi thời điểm, đúng MỘT máy nhận ghi.</strong> Với cơ sở dữ liệu vài chục gigabyte, nơi một lần dump mất cả giờ, khoảng đóng băng sẽ quá dài; công cụ lúc đó là một bản sao streaming (replica) trên máy mới, được giữ đồng bộ trong khi máy cũ vẫn chạy, và được promote (nâng lên làm chính) lúc cắt chuyển — cùng một luật, khoảng đóng băng ngắn hơn (<code>/courses/postgresql</code>).</p>

<h3>Hoá đơn bất ngờ đến từ đâu</h3>
${slide('dv-14', 27, 'Hoá đơn bất ngờ: băng thông ra, snapshot tích mãi, máy quên tắt, IPv4, serverless vọt, DB có quản lý')}
<table>
<tr><th>Khoản</th><th>Vì sao bất ngờ</th><th>Con số (tính đến 09/2026)</th><th>Phòng</th></tr>
<tr><td>Băng thông ra</td><td>video/ảnh phục vụ thẳng từ VPS; một con bot cào tải hết mọi thứ</td><td>DigitalOcean $0,01/GiB vượt hạn mức chung; Vercel Pro và Render $0,15/GB</td><td>đưa media qua CDN / R2 (Chương 12.4); đặt cảnh báo hoá đơn</td></tr>
<tr><td>Snapshot, sao lưu</td><td>tính theo GB mỗi tháng, và chúng tích lại</td><td>snapshot DigitalOcean $0,06/GB; sao lưu +20–30% giá máy</td><td>giữ N bản, tự động xoá bản cũ hơn (Chương 10)</td></tr>
<tr><td>Máy bị quên</td><td>staging, preview, cái máy thử của chính bài này</td><td>một Droplet 2 GiB vẫn $12 dù có ai dùng hay không</td><td>gắn nhãn + dọn hằng tháng; PaaS tính theo giây</td></tr>
<tr><td>Địa chỉ IPv4</td><td>giá gói ghi "chưa gồm IPv4"</td><td>giá Hetzner chưa gồm IPv4 chính; IPv4 riêng của Fly.io $2/tháng</td><td>đọc chữ nhỏ</td></tr>
<tr><td>Serverless vọt</td><td>một vòng lặp gọi hàm, một con bot</td><td>Lambda $0,20/triệu request + GB-giây</td><td>trần chi tiêu (spend cap)</td></tr>
<tr><td>Cơ sở dữ liệu có quản lý</td><td>gói nhỏ nhất đã đắt hơn cả một VPS</td><td>Fly Managed Postgres Basic $38; Render 1 GB $19</td><td>với đồ án: Postgres trên VPS + sao lưu đã thử phục hồi</td></tr>
</table>
<p>Băng thông là thứ bạn tự đo được trước khi hoá đơn đo hộ. Trường thứ mười trong log <code>combined</code> mặc định của nginx là <code>$body_bytes_sent</code>:</p>
<div class="out">$ sudo tail -1 /var/log/nginx/access.log
127.0.0.1 - - [29/Sep/2026:09:24:10 +0000] "GET /me HTTP/1.1" 200 38 "-" "curl/8.5.0"
$ sudo awk '{n++; b+=$10} END {printf "%d request, %.1f MB gửi đi, TB %.0f byte/request\\n", n, b/1e6, b/n}' /var/log/nginx/access.log
1137 request, 0.1 MB gửi đi, TB 64 byte/request</div>
<p>Trên bộ cân bằng thí nghiệm đó là 1.137 câu trả lời JSON bé xíu. Trên một web thật, chạy nó trên log một ngày, nhân ba mươi, rồi so với hạn mức của gói — một tấm ảnh 5 MB trên một trang đông người xem có thể chiếm gần hết tổng số.</p>

<h3>Chạy thử từng bước</h3>
<ol>
<li>Hai máy thí nghiệm có Postgres (<code>dv14-old</code>, <code>dv14-new</code>), SSH giữa chúng bằng khoá thí nghiệm; bind9 + unbound cho <code>vidu.test</code> với TTL 120.</li>
<li>Đổ dữ liệu vào cơ sở dữ liệu cũ và thư mục ảnh; chạy một vòng ghi.</li>
<li>Hỏi resolver, hạ TTL xuống 20, hỏi lại vài giây một lần tới khi nó hiện 20.</li>
<li>rsync lượt 1; rồi <code>cat-chuyen.sh</code>; đọc hai dòng so sánh.</li>
<li>Chạy lại vòng ghi, làm một lần dump-rồi-đổi <em>không</em> đóng băng vào một cơ sở dữ liệu thứ hai, và đếm chênh lệch sau mười giây.</li>
</ol>

<div class="pitfall co-tieu-de"><strong>Bẫy — máy cũ vẫn làm việc sau khi đã chuyển.</strong> Chặn ghi qua web không phải là chặn ghi. Một cron trên máy cũ vẫn gửi nhắc lịch hẹn (giờ thành hai lần, vì máy mới cũng gửi), một worker hàng đợi vẫn xử lý việc vào cơ sở dữ liệu cũ, script của một bạn cùng nhóm vẫn trỏ vào IP cũ. Trước khi cắt chuyển, liệt kê mọi thứ chạy trên máy cũ — <code>systemctl list-timers</code>, <code>crontab -l</code> của từng người dùng, <code>docker ps</code> — và dừng những thứ có ghi.</div>

<h3>Trên macOS và Windows: rsync nào đang chạy</h3>
<p>Script ở trên cố ý chạy rsync <em>giữa hai máy chủ</em>, không chạy từ laptop. rsync đi kèm macOS không phải rsync trên Linux:</p>
<div class="out">$ rsync --version | head -2
openrsync: protocol version 29
rsync version 2.6.9 compatible
$ which rsync
/usr/bin/rsync</div>
<p>Apple kèm openrsync, tương thích rsync 2.6.9 (2006); vài cờ dùng trên Linux bị thiếu hoặc cư xử khác. Chép từ máy chủ sang máy chủ tránh được chuyện đó, và còn tránh kéo 60 MB về laptop qua mạng quán cà phê rồi lại đẩy lên. Trên Windows, dùng rsync trong WSL. Và nhớ dấu gạch chéo ở cuối: <code>/srv/uploads/</code> chép phần bên trong; <code>/srv/uploads</code> chép cả thư mục vào đích, thành <code>/srv/uploads/uploads</code>.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> VPS dùng thử miễn phí của nhóm hết hạn vào thứ Sáu; buổi bảo vệ là thứ Ba tuần sau. Chuyển app phòng khám sang một máy mới vào tối thứ Năm mà không mất một lịch hẹn nào, và chứng minh điều đó.</p>
<ol>
<li>Đo máy thí nghiệm mới (<code>nproc</code>, <code>memory.max</code>, <code>fio</code>) và độ trễ tới vị trí bạn chọn.</li>
<li>Hạ TTL; ghi lại lúc resolver hiện TTL mới.</li>
<li>rsync lượt 1 trong lúc vòng ghi đang chạy; rồi chạy script cắt chuyển.</li>
<li>Từ một máy khách, gọi web qua IP cũ và IP mới.</li>
</ol>
<p><strong>Đạt khi:</strong> các dòng so sánh cho thấy số lịch hẹn, số tệp và mã băm giống hệt nhau; cả hai IP đều trả lời từ <code>dv14-new</code>; và sổ ghi của bạn có độ dài khoảng đóng băng ghi cùng thời gian resolver cần để hiện TTL ngắn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">RTT (round-trip time — thời gian đi-về)</span><span class="v">Thời gian một gói tới máy chủ và câu trả lời quay về; khoảng cách đặt mức sàn của nó.</span></div>
  <div class="kv"><span class="k">IOPS (thao tác vào/ra mỗi giây)</span><span class="v">Số thao tác đĩa mỗi giây — thứ cơ sở dữ liệu sống nhờ.</span></div>
  <div class="kv"><span class="k">cgroup memory.max (giới hạn bộ nhớ của cgroup)</span><span class="v">Giới hạn bộ nhớ thật của một container, thứ <code>free</code> bên trong nó không cho thấy.</span></div>
  <div class="kv"><span class="k">Cut-over (cắt chuyển)</span><span class="v">Khoảnh khắc lưu lượng và việc ghi chuyển từ hệ thống cũ sang hệ thống mới.</span></div>
  <div class="kv"><span class="k">Write freeze / maintenance mode (đóng băng ghi / chế độ bảo trì)</span><span class="v">Một khoảng ngắn web từ chối ghi để bản chép được trọn vẹn.</span></div>
  <div class="kv"><span class="k">Delta sync (đồng bộ phần chênh)</span><span class="v">Chỉ chép những gì đổi từ lần chép trước — lượt rsync thứ hai.</span></div>
  <div class="kv"><span class="k">Split-brain (não chia đôi)</span><span class="v">Hai máy cùng nhận ghi, nên mỗi máy có dữ liệu máy kia không có.</span></div>
  <div class="kv"><span class="k">Egress bill (hoá đơn lưu lượng ra)</span><span class="v">Khoản tiền cho dữ liệu gửi ra vượt hạn mức của gói.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chọn máy theo RAM, CPU, đĩa, lưu lượng — và khoảng cách đo được: Singapore cách Việt Nam 37 ms, châu Âu và Mỹ 180–235 ms.</li>
<li>Đo máy mới bằng <code>nproc</code>, <code>memory.max</code>, <code>fio</code> và <code>iperf3</code>; số đo trong container trên laptop chỉ là minh hoạ.</li>
<li>Hạ TTL ít nhất một khoảng bằng TTL cũ trước khi chuyển; resolver thí nghiệm vẫn giữ TTL cũ thêm 110 giây.</li>
<li>Chuyển theo một luật: đóng băng ghi, dump/restore, rsync lượt 2, so số đếm và mã băm, rồi cho máy cũ chuyển tiếp và đổi DNS.</li>
<li>Bỏ bước đóng băng làm mất 19 lịch hẹn trong 10 giây, không một tiếng động.</li>
<li>Hoá đơn bất ngờ đến từ băng thông, snapshot, máy bị quên, IPv4 và cơ sở dữ liệu có quản lý — tự đo băng thông từ log của mình.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — pg_dump</span><span class="lc-sub">postgresql.org/docs/current/app-pgdump.html — định dạng custom, restore song song.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">DigitalOcean — Tính tiền băng thông</span><span class="lc-sub">docs.digitalocean.com/platform/billing/bandwidth/ — vượt hạn mức $0,01/GiB, gộp chung cả nhóm.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Hetzner — Lưu lượng</span><span class="lc-sub">docs.hetzner.com/robot/general/traffic/ — lưu lượng có sẵn theo vị trí và giá mỗi TB vượt.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — bản sao (replication)</span><span class="lc-sub">/courses/postgresql/learn${REF} — replica streaming cho cơ sở dữ liệu quá lớn để dump trong lúc đóng băng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — rsync, SSH, bộ hẹn giờ systemd</span><span class="lc-sub">/courses/linux-bash/learn${REF} — những công cụ làm nên lần chuyển nhà này.</span></span></div>
</div>
`,
    },
    /* ─────────────────────────── 14.5 ─────────────────────────── */
    {
      title: "14.5 — Quiz: environments and more than one server|||14.5 — Quiz: nhiều môi trường và nhiều máy",
      slug: "deploy-14-5-quiz",
      type: "QUIZ",
      isFreePreview: true,
      description: "Mười câu tình huống: production gọi API staging, dữ liệu thật trên staging, upstream chia lệch, đăng xuất ngẫu nhiên, bản cũ phục vụ qua keep-alive, tráo mọi máy cùng lúc, canary, Postgres free hết hạn, hạ TTL, và dump khi web vẫn ghi.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.5</span>
<h2>Quiz: environments and more than one server</h2>
<p class="lead">Ten situations from a chapter in which almost every failure was silent: a production site calling the staging API, an old process answering half the requests, a load balancer favouring one server, nineteen bookings that existed only on a machine about to be switched off. None of them printed an error; each was found by comparing two things that should have been equal.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can promote one image from staging to production and prove, by digest, that they run the same bytes; I know which configuration must not be read at build time.</li>
<li>I can anonymise a production copy for staging and check that no real identifier is left.</li>
<li>I can put two servers behind nginx or HAProxy, explain passive and active health checks, and measure what happens when one disappears.</li>
<li>I can move sessions and uploads out of the app servers, and check after a restart that exactly one process serves.</li>
<li>I can deploy one server at a time, run a canary, and compare VPS, PaaS, serverless and Kubernetes by responsibilities and real prices.</li>
<li>I can move to a new server: lower the TTL in time, freeze writes, dump/restore, rsync twice, compare, forward, and switch DNS.</li>
</ul>
${slide('dv-14', 29, 'Bảng tra nhanh Chương 14 (1/2): môi trường và nhiều máy')}
${slide('dv-14', 30, 'Bảng tra nhanh Chương 14 (2/2): nền tảng, chi phí, chuyển nhà')}
<div class="callout">
<p><strong>What this chapter established.</strong> One image started twice with two env files gave identical digests and different databases, while a URL baked in at build time made "production" call the staging API; writing <code>config.js</code> at start-up fixed it, and a missing variable stopped the container with exit code 2. An anonymising <code>UPDATE</code> left 0 real emails and all 20,000 appointments linked; a Redis flag moved a feature from 0% to 90, 495 and 1,000 of 1,000 users and back to 0 without a restart (14.1). Behind a balancer, an nginx upstream without <code>zone</code> sent 10 of 10 new requests to one server; pulling a server's network left one request hanging behind nginx and none failing behind HAProxy's active checks; sessions in memory logged users out on every other click; an old process kept serving through keep-alive connections until shutdown closed them; a rolling deploy had 0 errors where restarting both servers had 325 (14.2). Real prices put the same student project between about $8 and $45 a month, with two free tiers that sleep or expire (14.3). And a scripted move froze writes for about three seconds and matched counts and checksums on both sides, while skipping the freeze lost 19 appointments in ten seconds (14.4).</p>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.5</span>
<h2>Quiz: nhiều môi trường và nhiều máy</h2>
<p class="lead">Mười tình huống từ một chương mà gần như mọi kiểu hỏng đều im lặng: một trang production gọi API của staging, một tiến trình cũ trả lời một nửa số request, một bộ cân bằng tải thiên vị một máy, mười chín lịch hẹn chỉ tồn tại trên một cái máy sắp bị tắt. Không cái nào in ra lỗi; cái nào cũng được tìm thấy bằng cách so hai thứ lẽ ra phải bằng nhau.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đẩy tiếp được một ảnh từ staging lên production và chứng minh, bằng digest, rằng chúng chạy cùng những byte đó; tôi biết cấu hình nào không được đọc lúc build.</li>
<li>Tôi ẩn danh được một bản chép production cho staging và kiểm được không còn định danh thật nào.</li>
<li>Tôi đặt được hai máy sau nginx hoặc HAProxy, giải thích được kiểm sức khoẻ thụ động và chủ động, và đo được chuyện gì xảy ra khi một máy biến mất.</li>
<li>Tôi chuyển được phiên đăng nhập và tệp tải lên ra khỏi máy app, và kiểm được sau khi khởi động lại rằng đúng một tiến trình đang phục vụ.</li>
<li>Tôi deploy được từng máy một, chạy được canary, và so được VPS, PaaS, serverless và Kubernetes theo trách nhiệm và giá thật.</li>
<li>Tôi chuyển được sang máy mới: hạ TTL kịp lúc, đóng băng ghi, dump/restore, rsync hai lượt, so, chuyển tiếp, và đổi DNS.</li>
</ul>
${slide('dv-14', 29, 'Bảng tra nhanh Chương 14 (1/2): môi trường và nhiều máy')}
${slide('dv-14', 30, 'Bảng tra nhanh Chương 14 (2/2): nền tảng, chi phí, chuyển nhà')}
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Một ảnh chạy hai lần với hai tệp env cho ra hai digest giống hệt và hai cơ sở dữ liệu khác nhau, trong khi một URL nướng vào lúc build khiến "production" gọi API của staging; ghi <code>config.js</code> lúc khởi động sửa được nó, và một biến bị thiếu làm container dừng với mã thoát 2. Một câu <code>UPDATE</code> ẩn danh để lại 0 email thật và giữ nguyên 20.000 lịch hẹn nối đúng; một cờ trong Redis đưa một tính năng từ 0% lên 90, 495 rồi 1.000 trên 1.000 người dùng và về lại 0 mà không khởi động lại lần nào (14.1). Sau bộ cân bằng tải, một upstream nginx thiếu <code>zone</code> dồn 10 trên 10 request mới vào một máy; rút mạng một máy thì sau nginx có một request treo còn sau kiểm tra chủ động của HAProxy không request nào hỏng; phiên trong bộ nhớ đăng xuất người dùng cứ cách một lần bấm; một tiến trình cũ tiếp tục phục vụ qua kết nối keep-alive cho tới khi việc tắt đóng chúng lại; deploy lần lượt 0 lỗi trong khi khởi động lại cả hai máy có 325 lỗi (14.2). Giá thật đặt cùng một đồ án sinh viên vào khoảng $8 tới $45 mỗi tháng, với hai gói miễn phí biết ngủ hoặc hết hạn (14.3). Và một lần chuyển nhà bằng script đóng băng ghi khoảng ba giây, hai bên khớp số đếm và mã băm, trong khi bỏ bước đóng băng làm mất 19 lịch hẹn trong mười giây (14.4).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: "Staging passed every test. You start the SAME frontend image on production with -e NEXT_PUBLIC_API_URL=https://api.vidu.test, but the browser’s network tab shows every call going to api.staging.vidu.test. What is happening?|||Staging qua mọi phép kiểm. Bạn chạy CÙNG ảnh frontend đó lên production với -e NEXT_PUBLIC_API_URL=https://api.vidu.test, nhưng tab Network của trình duyệt cho thấy mọi lời gọi đều tới api.staging.vidu.test. Chuyện gì đang xảy ra?",
            options: [
              "Docker ignores -e for variables whose names start with NEXT_; use --env-file instead|||Docker bỏ qua -e với biến có tên bắt đầu bằng NEXT_; phải dùng --env-file",
              "The URL was copied into the JavaScript files when the image was built; changing the environment at run time cannot change it — read it at start-up (e.g. a config.js written by an entrypoint script) or build per environment on purpose|||URL đã bị chép vào các tệp JavaScript lúc build ảnh; đổi biến môi trường lúc chạy không đổi được nó — đọc nó lúc khởi động (vd config.js do script entrypoint ghi) hoặc chủ động build mỗi môi trường một ảnh",
              "The browser cached the staging URL; a hard refresh on production fixes it|||Trình duyệt đã đệm URL của staging; tải lại cứng trên production là hết",
              "nginx on production still proxies to the staging container; reload nginx|||nginx trên production vẫn proxy sang container staging; reload nginx là xong",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: NEXT_PUBLIC_* values are inlined at build time. In the lab, dv14-fe built with the staging URL and started with -e NEXT_PUBLIC_API_URL=https://api.vidu.test still served const API='https://api.staging.vidu.test'. The -e did reach the container; nothing reads it any more. Writing config.js at start-up from API_URL gave two different APIs from one image. A browser cache or nginx would not put the staging URL inside the served file.|||VI: Giá trị NEXT_PUBLIC_* được chèn thẳng vào mã lúc build. Trong phòng thí nghiệm, dv14-fe build với URL staging rồi chạy với -e NEXT_PUBLIC_API_URL=https://api.vidu.test vẫn trả const API='https://api.staging.vidu.test'. Biến -e có tới container; chỉ là không còn gì đọc nó nữa. Ghi config.js lúc khởi động từ API_URL cho ra hai API khác nhau từ một ảnh. Bộ đệm trình duyệt hay nginx không thể đặt URL staging vào bên trong tệp được phục vụ.",
          },
          {
            question: "To make staging realistic, a teammate restores last night’s production dump into it. The next morning, fifty real patients receive \"your appointment is cancelled\" emails from a staging test. What is the right fix?|||Để staging giống thật, một bạn restore bản dump production đêm qua vào đó. Sáng hôm sau, năm mươi bệnh nhân thật nhận email \"lịch hẹn của bạn đã bị huỷ\" từ một phép thử trên staging. Cách sửa đúng là gì?",
            options: [
              "Keep the copy but add a banner \"STAGING\" to every email template|||Giữ bản chép nhưng thêm dòng \"STAGING\" vào mọi mẫu email",
              "Stop using production data at all; ten hand-written test rows are enough for staging|||Thôi hẳn dữ liệu production; mười dòng thử viết tay là đủ cho staging",
              "Restrict staging to the team’s IP addresses so no one outside can trigger emails|||Chỉ cho IP của nhóm vào staging để không ai bên ngoài kích hoạt được email",
              "Anonymise the copy on the production side (emails to @example.invalid, phones, names, notes), put email/SMS in sandbox mode on staging, delete the dump file after use, and check that no real identifier is left|||Ẩn danh bản chép ngay phía production (email về @example.invalid, số điện thoại, tên, ghi chú), để email/SMS của staging ở chế độ sandbox, xoá tệp dump sau khi dùng, và kiểm không còn định danh thật nào",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: The emails went out because staging held real addresses. Anonymising kept all 20,000 appointments linked to 5,000 patients while the check \"real emails left\" returned 0 — realistic data without real people. Ten hand-written rows hide the bugs that appear at scale; an IP allow-list does not stop the team’s own tests from emailing real patients; a \"STAGING\" banner still sends the email.|||VI: Email được gửi đi vì staging giữ địa chỉ thật. Ẩn danh giữ nguyên 20.000 lịch hẹn nối với 5.000 bệnh nhân trong khi phép kiểm \"còn email thật\" trả 0 — dữ liệu giống thật mà không có người thật. Mười dòng viết tay giấu những lỗi chỉ hiện ở khối lượng lớn; danh sách IP không ngăn chính phép thử của nhóm gửi thư cho bệnh nhân thật; dòng chữ \"STAGING\" thì thư vẫn đi.",
          },
          {
            question: "You put two app servers behind nginx with a plain upstream (no extra directives). Right after nginx starts, ten requests in a row all go to the first server. nginx runs worker_processes auto on a 10-CPU machine. Why?|||Bạn đặt hai máy app sau nginx bằng một upstream trơn (không chỉ thị gì thêm). Ngay sau khi nginx khởi động, mười request liên tiếp đều vào máy thứ nhất. nginx chạy worker_processes auto trên máy 10 CPU. Vì sao?",
            options: [
              "Without a zone, each worker keeps its own round-robin position starting at the first server, and ten new connections landed on ten different workers; add zone app 64k; to share the state|||Không có zone thì mỗi worker tự giữ vị trí vòng tròn riêng, bắt đầu từ máy đầu, và mười kết nối mới rơi vào mười worker khác nhau; thêm zone app 64k; để dùng chung trạng thái",
              "The second server failed its health check; nginx checks /health every second by default|||Máy thứ hai trượt phép kiểm sức khoẻ; mặc định nginx kiểm /health mỗi giây",
              "Round robin in nginx sends the first 10 requests to the first server before switching|||Vòng tròn của nginx gửi 10 request đầu vào máy đầu rồi mới đổi",
              "keepalive 16 pins every client to the server it first reached|||keepalive 16 ghim mỗi khách vào máy mà nó tới đầu tiên",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Measured on dv14-lb: 10/0 without a zone, 5/5 with zone app 64k; after a restart. Open-source nginx has no active health checks — it learns a server is down only from failed requests — and round robin alternates per worker, not in blocks of ten. keepalive affects connections from nginx to the upstreams, not which client goes where.|||VI: Đo trên dv14-lb: 10/0 khi không có zone, 5/5 với zone app 64k; sau khi khởi động lại. nginx mã nguồn mở không có kiểm sức khoẻ chủ động — nó chỉ biết máy chết qua request hỏng — và vòng tròn luân phiên theo từng worker, không theo khối mười. keepalive ảnh hưởng kết nối từ nginx tới các máy phía sau, không quyết định khách nào đi đâu.",
          },
          {
            question: "After adding a second server, users complain that they get logged out \"randomly\", and some avatars show as broken images while others load. Both servers run the same image. What is the cause?|||Sau khi thêm máy thứ hai, người dùng phàn nàn bị đăng xuất \"ngẫu nhiên\", và có ảnh đại diện hiện vỡ trong khi ảnh khác vẫn lên. Hai máy chạy cùng một ảnh. Nguyên nhân là gì?",
            options: [
              "The two servers have different JWT secrets in their env files|||Hai máy có JWT secret khác nhau trong tệp env",
              "The load balancer drops cookies on every second request|||Bộ cân bằng tải làm rơi cookie ở mỗi request thứ hai",
              "Sessions are kept in each server’s memory and uploads on each server’s disk, so a request that lands on the other server finds neither; move sessions to Redis/DB and uploads to object storage|||Phiên được giữ trong bộ nhớ của từng máy và ảnh trên đĩa của từng máy, nên request rơi vào máy kia không thấy cả hai; chuyển phiên ra Redis/DB và ảnh ra kho object",
              "The CDN cached a logged-out version of the page|||CDN đã đệm một phiên bản trang lúc chưa đăng nhập",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: In the lab, a login on vps1 answered \"cuong\" on vps1 and \"not logged in\" on vps2, alternating; an upload saved on vps1 was 404 on vps2. With SESSION_STORE=redis://… on both servers every /me answered \"cuong\". Different JWT secrets would be a real bug too, but the lab used no JWT and the image and env were identical — and it would not explain the images.|||VI: Trong phòng thí nghiệm, đăng nhập ở vps1 thì vps1 trả \"cuong\" còn vps2 trả \"chưa đăng nhập\", luân phiên; ảnh lưu ở vps1 thì vps2 báo 404. Với SESSION_STORE=redis://… trên cả hai máy, mọi lần /me đều trả \"cuong\". JWT secret khác nhau cũng là một lỗi thật, nhưng phòng thí nghiệm không dùng JWT, ảnh và env giống hệt — và nó không giải thích được chuyện ảnh vỡ.",
          },
          {
            question: "You change /etc/app.env on a server and run the restart script; /health answers with the new version. Yet half of the requests through nginx still behave like the old configuration. pgrep shows two app processes, and ss shows the older one holding an established connection from the nginx machine. What went wrong?|||Bạn sửa /etc/app.env trên một máy rồi chạy script khởi động lại; /health trả phiên bản mới. Vậy mà một nửa số request qua nginx vẫn cư xử theo cấu hình cũ. pgrep cho thấy hai tiến trình app, và ss cho thấy tiến trình cũ đang giữ một kết nối established từ máy nginx. Hỏng ở đâu?",
            options: [
              "The new process failed to bind port 8000, so all traffic still goes to the old one|||Tiến trình mới không bind được cổng 8000, nên mọi lưu lượng vẫn vào tiến trình cũ",
              "The old process stopped listening but kept nginx’s keep-alive connections open, and nginx kept sending requests down them; close idle keep-alive connections on shutdown (timeout, Connection: close) and check that exactly one process serves|||Tiến trình cũ thôi nghe cổng nhưng vẫn giữ các kết nối keep-alive của nginx, và nginx cứ gửi request xuống đó; khi tắt phải đóng kết nối keep-alive rảnh (timeout, Connection: close) và kiểm đúng một tiến trình đang phục vụ",
              "nginx caches upstream responses for 60 seconds by default|||Mặc định nginx đệm phản hồi từ upstream 60 giây",
              "env files are only read at boot; the server must be rebooted|||Tệp env chỉ được đọc lúc khởi động máy; phải reboot máy chủ",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: This happened in the lab: pid 231 (old) held 172.30.14.100:53606 while pid 1446 (new) owned the LISTEN socket — so the new process did bind the port. After adding a 5 s idle timeout and Connection: close during shutdown, a restart took 5.3 s and left one process. nginx does not cache proxied responses unless proxy_cache is configured, and a new process reads the env file when it starts.|||VI: Chuyện này xảy ra trong phòng thí nghiệm: pid 231 (cũ) giữ 172.30.14.100:53606 trong khi pid 1446 (mới) giữ socket LISTEN — tức là tiến trình mới đã bind được cổng. Sau khi thêm thời gian chờ rảnh 5 giây và Connection: close lúc tắt, một lần khởi động lại mất 5,3 giây và chỉ còn một tiến trình. nginx không đệm phản hồi proxy nếu không cấu hình proxy_cache, và tiến trình mới đọc tệp env lúc nó khởi động.",
          },
          {
            question: "Two servers sit behind HAProxy with health checks. To deploy faster, your script restarts the app on both at the same moment. What should you expect, and what is the better way?|||Hai máy đứng sau HAProxy có kiểm sức khoẻ. Để deploy nhanh hơn, script của bạn khởi động lại app trên cả hai cùng một lúc. Nên chờ đợi điều gì, và cách tốt hơn là gì?",
            options: [
              "A few seconds with no healthy server, answered with 502/503 errors; drain and swap one server at a time, checking /health before putting it back|||Vài giây không có máy khoẻ nào, người dùng nhận lỗi 502/503; rút và tráo từng máy một, kiểm /health trước khi trả nó về",
              "No errors: HAProxy queues requests until a server comes back|||Không lỗi nào: HAProxy xếp hàng request chờ tới khi có máy trở lại",
              "No errors, because each app finishes its in-flight requests before stopping|||Không lỗi nào, vì mỗi app làm xong request đang dở trước khi dừng",
              "Errors only for POST requests; GET requests are retried automatically|||Chỉ lỗi với request POST; request GET được tự động thử lại",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Measured: restarting both at once gave 2 × 502 and 323 × 503 over 3.5 s while no server passed its check; rolling.sh (drain → swap → check → ready, one at a time) gave 0 errors out of 91. Finishing in-flight requests does not help when there is no server to accept new ones, and with every server DOWN HAProxy answers 503 immediately rather than queueing.|||VI: Đo được: khởi động lại cả hai cùng lúc cho 2 × 502 và 323 × 503 trong 3,5 giây khi không máy nào qua phép kiểm; rolling.sh (drain → tráo → kiểm → ready, từng máy một) cho 0 lỗi trên 91. Làm xong request đang dở không giúp gì khi không còn máy nào nhận request mới, và khi mọi máy đều DOWN thì HAProxy trả 503 ngay chứ không xếp hàng.",
          },
          {
            question: "You run a canary by giving HAProxy weights 9 and 1 (v4 and v5). Exactly 10% of requests reach v5, but testers complain that the page layout flips between old and new while they click around. What would fix that?|||Bạn chạy canary bằng cách đặt trọng số HAProxy 9 và 1 (v4 và v5). Đúng 10% request tới v5, nhưng người thử phàn nàn giao diện cứ lật qua lại giữa cũ và mới khi họ bấm. Cách nào sửa được?",
            options: [
              "Set the weights to 90 and 10 instead of 9 and 1|||Đặt trọng số 90 và 10 thay cho 9 và 1",
              "Use leastconn instead of roundrobin|||Dùng leastconn thay cho roundrobin",
              "Restart HAProxy after changing weights so they apply to existing users|||Khởi động lại HAProxy sau khi đổi trọng số để áp dụng cho người dùng hiện có",
              "Split by user instead of by request — a cookie the balancer uses to keep each user on one version, or a feature flag with a fixed bucket per user|||Chia theo người dùng thay vì theo request — một cookie bộ cân bằng dùng để giữ mỗi người ở một phiên bản, hoặc feature flag với ô cố định cho từng người",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Weights split requests, not people: each click is a new draw, so one user sees 10% v5 pages. The feature flag in 14.1 gave each user a fixed bucket (crc32 % 100): \"cuong\" stayed on v1 below 70% and on v2 above. 90/10 is the same ratio; leastconn still balances per request; weights set on the runtime socket apply immediately (1,000 requests gave 900/100 without any restart).|||VI: Trọng số chia request, không chia người: mỗi cú bấm là một lần bốc thăm mới, nên một người dùng thấy 10% số trang là v5. Feature flag ở 14.1 cho mỗi người một ô cố định (crc32 % 100): \"cuong\" ở v1 khi dưới 70% và ở v2 khi trên. 90/10 là cùng tỉ lệ; leastconn vẫn chia theo request; trọng số đặt qua socket lúc chạy có hiệu lực ngay (1.000 request ra 900/100 mà không khởi động lại gì).",
          },
          {
            question: "A group deployed its API and database on Render’s free plans at the start of the semester. On the day of the defence, the first click takes about a minute, and then the app reports that the database does not exist. Which explanation matches the provider’s own documentation (as of 09/2026)?|||Một nhóm deploy API và cơ sở dữ liệu lên các gói miễn phí của Render từ đầu học kỳ. Đúng ngày bảo vệ, cú bấm đầu tiên mất khoảng một phút, rồi app báo cơ sở dữ liệu không tồn tại. Giải thích nào khớp với chính tài liệu của nhà cung cấp (tính đến 09/2026)?",
            options: [
              "Render deletes free services that exceed 5 GB of bandwidth|||Render xoá các dịch vụ miễn phí vượt 5 GB băng thông",
              "The free database was rate-limited because of too many connections|||Cơ sở dữ liệu miễn phí bị giới hạn vì quá nhiều kết nối",
              "The free web service spins down after 15 minutes without traffic (about a minute to start), and free Postgres expires 30 days after creation — use a small paid plan for the defence period|||Web service miễn phí ngủ sau 15 phút không có truy cập (mất khoảng một phút để khởi động), và Postgres miễn phí hết hạn 30 ngày sau khi tạo — dùng gói trả tiền nhỏ cho giai đoạn bảo vệ",
              "Render moved the service to another region, which changes the database URL|||Render chuyển dịch vụ sang vùng khác, làm đổi URL cơ sở dữ liệu",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: render.com/docs/free (read 29/09/2026): free web services spin down after 15 minutes without inbound traffic and take about a minute to spin up; free Postgres databases expire 30 days after creation. Bandwidth beyond the workspace allowance is billed or the service suspended — not deleted; the other two options are not in the documentation.|||VI: render.com/docs/free (đọc ngày 29/09/2026): web service miễn phí ngủ sau 15 phút không có truy cập và mất khoảng một phút để dậy; cơ sở dữ liệu Postgres miễn phí hết hạn 30 ngày sau khi tạo. Băng thông vượt hạn mức workspace thì bị tính tiền hoặc dịch vụ bị tạm dừng — không bị xoá; hai phương án còn lại không có trong tài liệu.",
          },
          {
            question: "Moving to a new VPS, you lower the A record’s TTL from 86400 to 300 one hour before switching the IP, then switch and turn the old server off. Many users reach the dead old IP for most of the day. Why, and what would have prevented it?|||Khi chuyển sang VPS mới, bạn hạ TTL của bản ghi A từ 86400 xuống 300 một giờ trước khi đổi IP, rồi đổi và tắt máy cũ. Nhiều người dùng tới IP cũ đã chết gần cả ngày. Vì sao, và điều gì đã ngăn được chuyện này?",
            options: [
              "Resolvers that cached the record before the change keep it for the rest of the OLD TTL (up to a day) — lower the TTL at least one old-TTL ahead, and keep the old server forwarding to the new one until its traffic stops|||Resolver đã đệm bản ghi trước khi sửa sẽ giữ nó tới hết TTL CŨ (tới một ngày) — hạ TTL trước ít nhất một khoảng bằng TTL cũ, và giữ máy cũ chuyển tiếp sang máy mới tới khi hết lưu lượng",
              "A TTL of 300 is below the minimum most resolvers accept, so they ignored it|||TTL 300 thấp hơn mức tối thiểu đa số resolver chấp nhận, nên chúng bỏ qua",
              "DNS changes always take 24–48 hours to propagate, whatever the TTL|||Thay đổi DNS luôn mất 24–48 giờ để lan truyền, bất kể TTL",
              "The registrar must also be told about the new IP|||Phải báo IP mới cho cả registrar",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: In the lab the zone TTL was changed from 120 to 20 while a resolver held the record: the authoritative server said 20 at once, the resolver kept counting 110, 104… and only fetched the short TTL after the old one ran out. With 86400 that is a day. \"48-hour propagation\" is not how caches work, 300 s is an ordinary TTL, and the registrar only holds NS records (Chapter 12.1).|||VI: Trong phòng thí nghiệm TTL của zone được đổi từ 120 xuống 20 trong lúc một resolver đang giữ bản ghi: máy có thẩm quyền trả 20 ngay, resolver vẫn đếm 110, 104… và chỉ lấy TTL ngắn sau khi TTL cũ hết. Với 86400 thì đó là một ngày. \"Lan truyền 48 giờ\" không phải cách bộ đệm vận hành, 300 giây là một TTL bình thường, và registrar chỉ giữ bản ghi NS (Chương 12.1).",
          },
          {
            question: "To keep downtime at zero, you dump the old database while the site keeps taking bookings, restore it on the new server and switch DNS right away. Everything looks fine. What have you most likely done?|||Để thời gian ngừng bằng 0, bạn dump cơ sở dữ liệu cũ trong lúc web vẫn nhận đặt lịch, restore sang máy mới và đổi DNS ngay. Mọi thứ trông vẫn ổn. Nhiều khả năng bạn đã làm gì?",
            options: [
              "Nothing wrong: pg_dump takes a consistent snapshot, so all bookings are included|||Không sai gì: pg_dump chụp một ảnh nhất quán, nên mọi lịch hẹn đều có",
              "Lost every booking made after the dump started — they exist only on the old server, and users there saw \"booked successfully\"; freeze writes (one writer at a time), dump/restore, compare counts, then switch|||Mất mọi lịch hẹn được đặt sau khi bắt đầu dump — chúng chỉ nằm trên máy cũ, và người đặt ở đó đã thấy \"đặt thành công\"; đóng băng ghi (mỗi lúc một máy ghi), dump/restore, so số đếm, rồi mới đổi",
              "Created duplicate bookings on both servers|||Tạo ra lịch hẹn trùng trên cả hai máy",
              "Corrupted the new database, because pg_restore cannot load a dump taken during writes|||Làm hỏng cơ sở dữ liệu mới, vì pg_restore không nạp được bản dump lấy trong lúc có ghi",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: pg_dump is consistent — as of the moment it started. Everything written afterwards is not in it. Measured: ten seconds after such a switch, dv14-old had 20,239 appointments and dv14-new 20,220 — 19 bookings lost silently. With the freeze in cat-chuyen.sh, both sides showed 20,219 appointments and the same file checksum after about three seconds of frozen writes. The restore itself worked fine; nothing was duplicated.|||VI: pg_dump nhất quán — tính tại thời điểm nó bắt đầu. Mọi thứ ghi sau đó không có trong nó. Đo được: mười giây sau một lần đổi như vậy, dv14-old có 20.239 lịch hẹn còn dv14-new 20.220 — 19 lịch hẹn mất không một tiếng động. Với bước đóng băng trong cat-chuyen.sh, hai bên cùng 20.219 lịch hẹn và cùng mã băm tệp sau khoảng ba giây đóng băng ghi. Bản thân việc restore chạy tốt; không có gì bị trùng.",
          },
        ],
      },
    },
  ],
};
