/**
 * Docker — Chương 10: một stack thật (Next.js + Node API + Postgres + Redis + nginx).
 * Bản vẽ · tầng dữ liệu · API & migration · frontend · nginx đứng trước · quiz.
 * Output cũ chạy Docker Compose v2.29 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ (compose/shell) → &#36;{;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 *
 * Nâng cấp 09/2026: bài 10.0 slide (deck dk-10, 32 slide) + slide/🧪/🗂/📌 + phần đào sâu trong 10.1–10.5; quiz 10 câu.
 * Output MỚI chạy thật 24/09/2026 trên một stack dựng thật (project dk10-blog: nginx 1.27 · Next.js 15.5 standalone ·
 * API Express + Prisma 5.22 · worker · migrate · seed · postgres:16.4-alpine · redis:7.4-alpine), Mac M1,
 * Docker Desktop 4.91 / Engine 29.8, Compose v5.5.1; thí nghiệm bind mount thêm trên Linux (Engine 29.6).
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 10 — Compose in real life|||Chương 10 — Compose trong đời thật',
  description: 'Dựng trọn vẹn một stack năm dịch vụ chạy được thật: Next.js, một API Node, PostgreSQL, Redis và nginx — kèm migration, seed, healthcheck, tách mạng công khai/nội bộ, và cách chạy đúng file đó ở cả máy phát triển lẫn máy chủ.',
  lessons: [
    /* ─────────────────────────── 10.0 ─────────────────────────── */
    {
      title: '10.0 — Chapter 10 slides: a real stack in pictures|||10.0 — Slide Chương 10: một stack thật bằng hình',
      slug: 'dk-10-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 10: bản vẽ bảy dịch vụ hai mạng, dòng thời gian khởi động đo thật, Postgres và Redis, migration làm cổng chặn và chuyện gì xảy ra khi nó hỏng, Next.js standalone, nginx đứng trước, bẫy bind mount một file, deploy và smoke test.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">This chapter was built for real before it was written. A small copy of the stack behind a student project like this site — nginx, a Next.js frontend, an Express + Prisma API, a worker, a migration job, Postgres and Redis — was brought up with <code>docker compose up</code> on a Mac M1 and then broken on purpose in every way the lessons describe: a changed database password, a migration that fails, a seed that cannot find its runner, a Next.js server listening on the wrong address, a slash too many in <code>proxy_pass</code>, a config file edited with <code>sed -i</code>. Every terminal on these slides is output from that stack.</p>
<p>Slides 3–7 belong to Lesson 10.1 (the drawing, the two networks, the start order measured), 8–12 to 10.2 (Postgres and Redis), 13–18 to 10.3 (one image with four roles, and what a failed migration really does to a running site), 19–23 to 10.4 (Next.js in a container), and 24–29 to 10.5 (nginx, the bind-mount trap, the deploy, and cutting start-up from 22.5 s to 5.4 s). The last three are the chapter's common mistakes, a cheat sheet and a 45-minute practice session. Recorded on 24 September 2026 with Docker Desktop 4.91 / Engine 29.8 and Compose v5.5; one experiment also ran on a Linux machine with Engine 29.6. The slides are in Vietnamese; the diagrams read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Chương này được DỰNG THẬT trước khi được viết. Một bản thu nhỏ của đúng kiểu stack mà một dự án sinh viên như trang này đang chạy — nginx, frontend Next.js, API Express + Prisma, một worker, một việc migration, Postgres và Redis — được bật bằng <code>docker compose up</code> trên máy Mac M1, rồi bị cố ý làm hỏng theo đúng từng kiểu mà các bài giảng mô tả: đổi mật khẩu cơ sở dữ liệu, một migration hỏng, một lệnh seed không tìm thấy trình chạy của nó, một máy chủ Next.js nghe nhầm địa chỉ, thừa một dấu gạch chéo trong <code>proxy_pass</code>, một file cấu hình bị sửa bằng <code>sed -i</code>. Mọi terminal trên slide là output của chính stack đó.</p>
<p>Slide 3–7 thuộc Bài 10.1 (bản vẽ, hai mạng, thứ tự khởi động đo bằng số), 8–12 thuộc 10.2 (Postgres và Redis), 13–18 thuộc 10.3 (một ảnh bốn vai, và một migration hỏng thật sự làm gì với trang đang chạy), 19–23 thuộc 10.4 (Next.js trong container), 24–29 thuộc 10.5 (nginx, cái bẫy bind mount, lượt deploy, và rút thời gian khởi động từ 22,5 giây xuống 5,4 giây). Ba slide cuối là những sai lầm hay gặp của chương, bảng tra nhanh và một buổi thực hành 45 phút. Ghi ngày 24/09/2026 trên Docker Desktop 4.91 / Engine 29.8, Compose v5.5; một thí nghiệm chạy thêm trên máy Linux (Engine 29.6). Con số trên máy bạn sẽ khác — thứ tự và quy luật thì không.</p>
</div>
${gallery('dk-10', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Bảy dịch vụ, hai mạng — chỉ nginx mở cổng'], [4, 'Hai mạng là một chính sách truy cập'], [5, 'compose.yaml đọc như một bản vẽ'],
  [6, 'Dòng thời gian khởi động đo thật'], [7, 'Cây thư mục và bốn quyết định'],
  [8, 'Dịch vụ db từng dòng'], [9, 'initdb.d chạy đúng một lần'], [10, 'Đổi POSTGRES_PASSWORD: site 502'],
  [11, 'Redis: lưu lâu dài và maxmemory'], [12, 'Nâng Postgres 16 → 17'],
  [13, 'Dockerfile.backend ba tầng'], [14, 'Một ảnh, bốn vai'], [15, 'Engine Prisma khớp libc và kiến trúc'],
  [16, 'Migration hỏng: giữ schema, không giữ site'], [17, 'P3018 rồi P3009'], [18, 'Seed và cái bẫy tsx bị prune'],
  [19, 'frontend/Dockerfile standalone'], [20, 'standalone nhỏ hơn ba lần'], [21, 'NEXT_PUBLIC_* nướng lúc build'],
  [22, 'Hai URL cho một API'], [23, 'HOSTNAME và Next.js'],
  [24, 'nginx.conf từng dòng'], [25, 'Dấu / cuối proxy_pass'], [26, 'sed -i và bind mount một file'],
  [27, 'Một request qua ba ranh giới'], [28, 'Deploy: migrate riêng, smoke test'], [29, 'Khởi động 22,5 s → 5,4 s'],
  [30, 'Sai lầm hay gặp'], [31, 'Bảng tra nhanh'], [32, 'Thực hành chương 10'],
])}
`,
    },
    /* ─────────────────────────── 10.1 ─────────────────────────── */
    {
      title: '10.1 — The stack, drawn|||10.1 — Bản vẽ của stack',
      slug: 'dk-10-1-ban-ve',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Năm dịch vụ và ba việc chạy một lần, ai nói chuyện với ai, hai mạng và ai nằm trên mạng nào, cây thư mục, và bốn quyết định định hình mọi thứ còn lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>The stack, drawn</h2>
<p class="lead">Nine chapters of pieces; this one assembles them. We are building the shape almost every small production application has — a browser-facing frontend, an API, a database, a cache, and a reverse proxy in front — and doing it with the network split, healthchecks and migration ordering from the previous chapters rather than bolting them on later.</p>

<h3>What we are building</h3>
${slide('dk-10', 3, 'Bảy dịch vụ, hai mạng — chỉ nginx mở cổng')}
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">public network</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">nginx</span><span class="lz-nsub">The only service with published ports — 80 and 443. TLS, static caching, routing /api to the backend.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">web · Next.js</span><span class="lz-nsub">Server-rendered frontend on 3000. No published port; nginx reaches it by name.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">api · Node/Express</span><span class="lz-nsub">On BOTH networks: reachable from nginx, and able to reach the database.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">private · internal</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">db · PostgreSQL 16</span><span class="lz-nsub">No published port, no route to the internet. Named volume for the data.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">cache · Redis 7</span><span class="lz-nsub">Sessions and rate limits. Also invisible from outside.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">worker</span><span class="lz-nsub">Same image as the API, different command. Background jobs, no HTTP.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">run once, then exit</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">migrate</span><span class="lz-nsub">prisma migrate deploy. Must finish before api and worker start.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">seed · profile</span><span class="lz-nsub">Only on request. Never on a production deploy.</span></div></div>
  </div>
</div>

<h3>Who may talk to whom</h3>
${slide('dk-10', 4, 'Hai mạng là một chính sách: nginx không phân giải nổi db')}
<div class="kv-grid">
  <div class="kv"><span class="k">Browser → nginx</span><span class="v">The only path in. Ports 80 and 443 published on all interfaces; everything else is invisible from outside the host.</span></div>
  <div class="kv"><span class="k">nginx → web, api</span><span class="v">By service name on the public network. <code>/</code> and <code>/_next</code> to <code>web:3000</code>, <code>/api</code> to <code>api:3000</code>.</span></div>
  <div class="kv"><span class="k">api, worker → db, cache</span><span class="v">By service name on the private network. No ports published anywhere in this path.</span></div>
  <div class="kv"><span class="k">nginx → db</span><span class="v"><strong>Impossible.</strong> nginx has no interface on the private network — it cannot even resolve the name (Lesson 8.3). A compromised proxy gains nothing.</span></div>
  <div class="kv"><span class="k">web → api</span><span class="v">Server-side rendering calls <code>http://api:3000</code> internally; the browser calls <code>/api</code> through nginx. Two different URLs for the same API, and Lesson 10.4 is largely about that distinction.</span></div>
  <div class="kv"><span class="k">db, cache → internet</span><span class="v"><strong>No route.</strong> The private network is <code>internal: true</code>, so even a compromised database container cannot exfiltrate outward.</span></div>
</div>

<h3>Check it yourself: the policy is enforced, not just written</h3>
<p>The table above is a claim. Here is the evidence, from the course's own copy of this stack (project <code>dk10-blog</code>, the same seven services, on a Mac M1 with Docker Desktop). <code>getent hosts db</code> asks the container's resolver for the name <code>db</code> — exactly the lookup your application performs before it opens a connection. <code>wget -T 3</code> tries to fetch a page from the internet with a three-second timeout.</p>
<pre><code class="language-bash">for s in nginx web api worker; do
  docker compose exec $s getent hosts db || echo "$s: không phân giải được"
done
docker compose exec db wget -T 3 -qO- http://example.com
docker compose exec api wget -T 3 -qO- http://example.com &gt;/dev/null &amp;&amp; echo "api ra được Internet"</code></pre>
<div class="out">nginx: không phân giải được
web: không phân giải được
172.22.0.2        db  db
172.22.0.2        db  db
wget: bad address 'example.com'
api ra được Internet</div>
<table>
<tr><th>Line</th><th>What it proves</th></tr>
<tr><td><code>nginx: không phân giải được</code></td><td>nginx has no interface on <code>private</code>, so Docker's embedded DNS (<code>127.0.0.11</code> inside every container) has no record of <code>db</code> to give it. Not "blocked" — the name simply does not exist from where nginx stands.</td></tr>
<tr><td><code>172.22.0.2 db db</code> (twice)</td><td><code>api</code> and <code>worker</code> are both on <code>private</code> and get the database's address on that network. The IP changes between runs; the name does not, which is why you always connect by name.</td></tr>
<tr><td><code>wget: bad address 'example.com'</code></td><td>The database cannot even resolve an outside name: <code>internal: true</code> gives the network no gateway and no external DNS. A compromised database has nowhere to send your data.</td></tr>
<tr><td><code>api ra được Internet</code></td><td><code>api</code> reaches the internet through <code>public</code>, an ordinary bridge. Being on an internal network takes nothing away from a container that is also on a normal one.</td></tr>
</table>
<div class="callout warn"><strong>The consequence nobody mentions: the worker cannot reach the internet either.</strong> It sits only on <code>private</code>, which is <code>internal: true</code>. That is right for a worker that only reads Redis and writes Postgres. The day it must send email through an SMTP provider or call a payment API, every call fails with a name-resolution error that looks exactly like the provider being down. The fix is a decision, not a hack: add a third ordinary network (call it <code>egress</code>) and put only the worker on it. Do not move the worker onto <code>public</code> — that would make it reachable from nginx for no reason.</div>

<h3>The file tree</h3>
<pre><code>blog/
├── compose.yaml               <span class="tok-comment"># base: images, networks, volumes, healthchecks</span>
├── compose.override.yaml      <span class="tok-comment"># dev: builds, bind mounts, ports, hot reload</span>
├── compose.prod.yaml          <span class="tok-comment"># prod: limits, restart, log rotation, loopback</span>
├── .env.example               <span class="tok-comment"># committed, every key, no values</span>
├── Dockerfile.backend         <span class="tok-comment"># the API and the worker (Lesson 10.3)</span>
├── frontend/
│   ├── Dockerfile             <span class="tok-comment"># Next.js standalone (Lesson 10.4)</span>
│   └── next.config.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── ops/
│   ├── nginx.conf             <span class="tok-comment"># the reverse proxy (Lesson 10.5)</span>
│   └── postgres-init/         <span class="tok-comment"># extensions, run once at initdb</span>
└── src/                       <span class="tok-comment"># the API source</span></code></pre>

<h3>Four decisions that shape everything else</h3>
${slide('dk-10', 7, 'Cây thư mục và bốn quyết định')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Exactly one service publishes ports</span><span class="lz-t">nginx, and nothing else</span><span class="lz-d">Every other service is reachable only over a container network. This removes the entire class of accidents from Lesson 8.2 — there is no database port to forget about, because there never was one.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Migrations are a service, not an entrypoint hack</span><span class="lz-t">a container that runs and exits 0</span><span class="lz-d">With <code>service_completed_successfully</code> the API cannot start against an un-migrated schema, and a failed migration aborts the deploy instead of producing a half-working app.</span></div>
  <div class="lz-step"><span class="lz-k">3 · One image, three commands</span><span class="lz-t">api, worker and migrate share Dockerfile.backend</span><span class="lz-d">One build, one thing to scan and patch, and no chance of the worker running different code from the API. Only <code>command</code> differs.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Base file is production; the override is development</span><span class="lz-t">the server never sees compose.override.yaml</span><span class="lz-d">The default <code>docker compose up</code> gives a developer bind mounts and hot reload, while the deploy script passes <code>-f</code> explicitly and gets the plain base (Lesson 9.5).</span></div>
</div>

<h3>The skeleton, before we fill it in</h3>
${slide('dk-10', 5, 'compose.yaml đọc như một bản vẽ: mạng trước, dịch vụ sau')}
<pre><code>name: blog

services:
  nginx:   { depends_on: [web, api], networks: [public] }
  web:     { depends_on: [api],      networks: [public] }
  api:     { networks: [public, private] }
  worker:  { networks: [private] }
  db:      { networks: [private] }
  cache:   { networks: [private] }
  migrate: { networks: [private], restart: "no" }
  seed:    { networks: [private], profiles: [seed], restart: "no" }

networks:
  public:
  private:
    internal: true

volumes:
  pgdata:
  redisdata:</code></pre>
<div class="callout ok"><strong>Read the <code>networks</code> lines as an access-control policy, because that is what they are.</strong> <code>api</code> appears on both lists and is the only service that does; that single fact is what lets a request cross from the outside world to the database, and nothing else can make that crossing. Deciding this <em>before</em> writing the services is much easier than retrofitting it — and it is the part of a compose file that a reviewer should read first.</div>

<h3>Run it step by step: bring the stack up and watch who waits for whom</h3>
${slide('dk-10', 6, 'depends_on + healthcheck = thứ tự khởi động có điều kiện, số đo thật')}
<p>A <code>depends_on</code> with a <code>condition</code> turns compose from "start everything at once" into a graph that it walks: start what depends on nothing, wait until each condition is met, then start the next layer. You cannot see that graph in the YAML. You can see it in the timestamps Docker records for every container — so bring the real stack up and read them.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Step 1 · start</span><span class="lz-t">docker compose up -d</span><span class="lz-d">Compose creates the two networks and the named volumes first, then starts the services that depend on nothing: <code>db</code> and <code>cache</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Step 2 · look</span><span class="lz-t">docker compose ps -a</span><span class="lz-d"><code>-a</code> includes stopped containers. Without it you would not see <code>migrate</code> at all, because it has already finished.</span></div>
  <div class="lz-step"><span class="lz-k">Step 3 · measure</span><span class="lz-t">docker inspect -f '{{.State.StartedAt}}' …</span><span class="lz-d">The moment the process started and, for containers that exited, the moment it finished. Times are UTC (the trailing <code>Z</code>).</span></div>
  <div class="lz-step"><span class="lz-k">Step 4 · subtract</span><span class="lz-t">who started right after whom?</span><span class="lz-d">A service that starts a fraction of a second after another became healthy or exited is waiting on it — that is the graph, measured.</span></div>
</div>
<pre><code class="language-bash">docker compose up -d
docker compose ps -a --format 'table {{.Service}}\\t{{.Status}}\\t{{.Ports}}'</code></pre>
<div class="out"> Network dk10-blog_private Created
 Volume dk10-blog_pgdata Created
 …
 Container dk10-blog-db-1 Started
 Container dk10-blog-db-1 Healthy
 Container dk10-blog-migrate-1 Started
 Container dk10-blog-migrate-1 Exited
 Container dk10-blog-api-1 Started
 Container dk10-blog-api-1 Healthy
 Container dk10-blog-web-1 Started
 Container dk10-blog-web-1 Healthy
 Container dk10-blog-nginx-1 Started
SERVICE   STATUS                                     PORTS
api       Up 11 seconds (healthy)                    3000/tcp
cache     Up 22 seconds (healthy)                    6379/tcp
db        Up 22 seconds (healthy)                    5432/tcp
migrate   Exited (0) 11 seconds ago
nginx     Up Less than a second (health: starting)   127.0.0.1:18100-&gt;80/tcp
web       Up 5 seconds (healthy)                     3000/tcp
worker    Up 11 seconds                              3000/tcp</div>
<pre><code class="language-bash">for s in db cache migrate api worker web nginx; do c=dk10-blog-$s-1
  printf '%-8s start=%s fin=%s exit=%s\\n' $s "$(docker inspect -f '{{.State.StartedAt}}' $c)" \\
    "$(docker inspect -f '{{.State.FinishedAt}}' $c)" "$(docker inspect -f '{{.State.ExitCode}}' $c)"
done</code></pre>
<div class="out">db       start=2026-09-23T19:16:31.46503692Z fin=0001-01-01T00:00:00Z exit=0
cache    start=2026-09-23T19:16:31.373140836Z fin=0001-01-01T00:00:00Z exit=0
migrate  start=2026-09-23T19:16:37.050843047Z fin=2026-09-23T19:16:42.444331133Z exit=0
api      start=2026-09-23T19:16:42.689577258Z fin=0001-01-01T00:00:00Z exit=0
worker   start=2026-09-23T19:16:42.621878175Z fin=0001-01-01T00:00:00Z exit=0
web      start=2026-09-23T19:16:48.281061511Z fin=0001-01-01T00:00:00Z exit=0
nginx    start=2026-09-23T19:16:53.856507083Z fin=0001-01-01T00:00:00Z exit=0</div>
<p>Real output from the course's stack (Compose v5.5.1; when output goes to a pipe or a script rather than a terminal, Compose prints one plain line per state change instead of the animated progress view). How to read it:</p>
<table>
<tr><th>Observation</th><th>Meaning</th></tr>
<tr><td><code>fin=0001-01-01T00:00:00Z</code></td><td>Go's "zero time": the container has never finished — it is still running. Only <code>migrate</code> has a real finish time.</td></tr>
<tr><td><code>migrate</code> starts 5.6 s after <code>db</code></td><td>Postgres was ready in about one second, but the healthcheck runs every <code>interval: 5s</code>, so the first "healthy" verdict — the thing <code>migrate</code> waits for — arrived about five seconds later.</td></tr>
<tr><td><code>migrate</code> runs 5.4 s, <code>exit=0</code></td><td>The gate opened. <code>api</code> and <code>worker</code> start 0.2 s after <code>migrate</code> finished: that is <code>service_completed_successfully</code> at work.</td></tr>
<tr><td><code>web</code> 5.6 s after <code>api</code>, <code>nginx</code> 5.6 s after <code>web</code></td><td>Each "wait until healthy" costs roughly one healthcheck interval. Seven services, four waits, 22.5 seconds in total — Lesson 10.5 measures how to cut that to 5.4.</td></tr>
<tr><td><code>Exited (0)</code> for <code>migrate</code></td><td>Success, not a crash. A one-shot job is supposed to end; <code>restart: "no"</code> makes sure nobody restarts it.</td></tr>
</table>
<div class="callout"><strong>Mac, Linux, Windows.</strong> The same file behaves the same on all three, because every container runs on a Linux kernel (on Mac and Windows, the one inside Docker Desktop's VM). Two differences are worth knowing. The course publishes nginx on <code>127.0.0.1:18100</code> — loopback only — because it is a laptop; on the VPS the same line becomes <code>"80:80"</code> and <code>"443:443"</code>. And on a teammate's Windows machine the project must live inside the WSL2 filesystem (<code>\\\\wsl$\\…</code>), not on <code>C:\\</code>, or the bind mounts for <code>ops/</code> become slow (Chapter 7).</div>

<h3>What each of the remaining lessons adds</h3>
<pre><code>10.2  db + cache        <span class="tok-comment"># healthchecks, init scripts, tuning, persistence</span>
10.3  api + worker      <span class="tok-comment"># Dockerfile.backend, migrate as a job, seeds</span>
10.4  web               <span class="tok-comment"># Next.js standalone, build-time vs runtime env</span>
10.5  nginx + assembly  <span class="tok-comment"># proxy config, TLS, the complete file, deploy</span></code></pre>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate on your SWP391 project wants to publish Postgres on port 5432 "to make debugging easier" and keep every service on one network. Before you argue, build a three-service miniature and show what the network split actually buys you.</p><ol>
<li>Create a folder in your practice area: <code>mkdir -p ~/thu-docker/stack-thu &amp;&amp; cd ~/thu-docker/stack-thu</code>, and save the file below as <code>compose.yaml</code>. <code>api</code> is a stand-in (an Alpine container that sleeps) — what matters is which networks it joins.</li>
<li>Start it and list the ports: <code>docker compose up -d</code>, then <code>docker compose ps --format 'table {{.Service}}\\t{{.Ports}}'</code>. Only one line should contain an arrow <code>-&gt;</code>.</li>
<li>Ask two containers for the database's address: <code>docker compose exec proxy getent hosts db || echo "proxy: không thấy db"</code>, then the same from <code>api</code>.</li>
<li>Try to reach the internet from both sides: <code>docker compose exec db sh -c 'wget -T 3 -qO- http://example.com || echo "db: exit $?"'</code> and <code>docker compose exec api sh -c 'wget -T 3 -qO /dev/null http://example.com &amp;&amp; echo "api: ra được Internet"'</code>.</li>
<li>Clean up: <code>docker compose down -v</code>.</li></ol>
<pre><code class="language-yaml">name: thu-stack
services:
  proxy:
    image: nginx:1.27-alpine
    ports: ["127.0.0.1:18101:80"]
    networks: [public]
  api:
    image: alpine:3.20
    command: ["sleep", "3600"]
    networks: [public, private]
  db:
    image: postgres:16.4-alpine
    environment:
      POSTGRES_PASSWORD: thu
    volumes: [pgdata:/var/lib/postgresql/data]
    networks: [private]
networks:
  public:
  private:
    internal: true
volumes:
  pgdata:</code></pre>
<div class="out">SERVICE   PORTS
api
db        5432/tcp
proxy     127.0.0.1:18101-&gt;80/tcp
proxy: không thấy db
172.26.0.3        db  db
wget: bad address 'example.com'
db: exit 1
api: ra được Internet</div>
<p>Output recorded on the course's Mac (there the project was named <code>dk10-thu1</code>; your IP will differ).</p>
<p><strong>Done when:</strong> <code>proxy</code> is the only service with an arrow in its port column, <code>proxy</code> cannot resolve <code>db</code> while <code>api</code> gets an IP, <code>db</code> answers <code>bad address</code>, <code>api</code> prints <code>ra được Internet</code> — and you can explain to your teammate, in one sentence each, why 5432 never needs to be published.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Service</span><span class="v">One entry under <code>services:</code> — a recipe for one or more identical containers, reachable by its name on every network it joins.</span></div>
  <div class="kv"><span class="k">Internal network</span><span class="v">A network with <code>internal: true</code>: containers on it talk to each other, but it has no gateway to the outside and no external DNS.</span></div>
  <div class="kv"><span class="k">Publish a port</span><span class="v">The <code>ports:</code> line: open a port on the host and forward it into a container. Without it, a port is reachable only from other containers.</span></div>
  <div class="kv"><span class="k">Embedded DNS</span><span class="v">Docker's resolver at <code>127.0.0.11</code> inside each container; it answers service names only for networks that container is on.</span></div>
  <div class="kv"><span class="k"><code>depends_on</code> condition</span><span class="v"><code>service_started</code>, <code>service_healthy</code> or <code>service_completed_successfully</code> — what compose waits for before starting the dependent service.</span></div>
  <div class="kv"><span class="k">Reverse proxy</span><span class="v">The server that faces the internet and forwards each request to the right internal service — nginx here.</span></div>
  <div class="kv"><span class="k">One-shot job</span><span class="v">A container meant to run once and exit (<code>migrate</code>, <code>seed</code>); <code>Exited (0)</code> is its success state.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Seven services, two networks, one published port: nginx is the only way in.</li>
<li><code>api</code> is the only service on both networks — it is the one bridge between the outside world and the data.</li>
<li><code>internal: true</code> removes the gateway and outside DNS; prove it with <code>getent hosts</code> and <code>wget</code>, do not assume it.</li>
<li>A worker on an internal-only network cannot call external APIs; give it its own <code>egress</code> network when it must.</li>
<li><code>depends_on</code> with conditions is a graph compose walks; read it from <code>docker inspect</code> timestamps.</li>
<li>Every "wait until healthy" costs about one healthcheck interval — 22.5 s for this stack before tuning.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/compose/how-tos/production/" target="_blank" rel="noopener">
  <span class="lc-ico">🏭</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Compose in production</span><span class="lc-sub">The official checklist for moving a compose stack from a laptop to a server: removing bind mounts, binding to different ports, restart policies, and building at deploy time versus pulling.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/compose/how-tos/networking/" target="_blank" rel="noopener">
  <span class="lc-ico">🕸️</span>
  <span class="lc-body"><span class="lc-title">Compose — networking</span><span class="lc-sub">How compose creates a default network, how service names resolve, and the multi-network setup this chapter uses to separate a public tier from a private one.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: plan a stack</span><span class="lc-sub">Graded exercises: given six services, decide which networks each joins and which publishes ports, then justify why the proxy must not be able to resolve the database name.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> designing the stack by adding services one at a time and letting compose's default network hold everything. It works immediately, which is the trap — every service can reach every other service, so a vulnerability in the image-resizing worker is one <code>psql</code> away from your users table, and nobody notices because nothing is broken. Decide the network split first, while there are three services and it takes two minutes, rather than after there are nine and separating them means testing every path again. The rule that survives contact with reality: a service joins a network only if it must <em>initiate</em> a connection on it, and only the reverse proxy publishes ports.</div>
<p class="note-ct"><strong>Three things to remember.</strong> One service publishes ports and everything else is reachable only by container name — that single decision eliminates most of Chapter 8's accidents. Migrations belong in their own service gated by <code>service_completed_successfully</code>, so a failed migration stops the deploy instead of producing a half-working app. And the <code>networks:</code> lines are an access-control policy: write them before the services, not after.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Bản vẽ của stack</h2>
<p class="lead">Chín chương toàn những mảnh rời; chương này lắp chúng lại. Chúng ta dựng đúng hình dạng mà gần như mọi ứng dụng production nhỏ đều có — một frontend hướng ra trình duyệt, một API, một cơ sở dữ liệu, một cache, và một reverse proxy đứng trước — và làm ngay bằng cách tách mạng, healthcheck và thứ tự migration của các chương trước, thay vì gắn thêm vào sau.</p>

<h3>Chúng ta dựng cái gì</h3>
${slide('dk-10', 3, 'Bảy dịch vụ, hai mạng — chỉ nginx mở cổng')}
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">mạng công khai</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">nginx</span><span class="lz-nsub">Dịch vụ DUY NHẤT có cổng công bố — 80 và 443. TLS, cache tĩnh, định tuyến /api về backend.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">web · Next.js</span><span class="lz-nsub">Frontend kết xuất phía máy chủ ở cổng 3000. Không công bố cổng nào; nginx gọi nó bằng tên.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">api · Node/Express</span><span class="lz-nsub">Nằm trên CẢ HAI mạng: nginx với tới được, và nó với tới được cơ sở dữ liệu.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">riêng · internal</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">db · PostgreSQL 16</span><span class="lz-nsub">Không công bố cổng, không có đường ra Internet. Volume có tên để chứa dữ liệu.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">cache · Redis 7</span><span class="lz-nsub">Phiên đăng nhập và giới hạn tần suất. Cũng vô hình từ bên ngoài.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">worker</span><span class="lz-nsub">Cùng cái ảnh với API, khác câu lệnh. Việc chạy nền, không có HTTP.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">chạy một lần rồi thoát</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">migrate</span><span class="lz-nsub">prisma migrate deploy. Phải xong TRƯỚC khi api và worker khởi động.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">seed · profile</span><span class="lz-nsub">Chỉ chạy khi được gọi. Không bao giờ trong một lượt deploy production.</span></div></div>
  </div>
</div>

<h3>Ai được nói chuyện với ai</h3>
${slide('dk-10', 4, 'Hai mạng là một chính sách: nginx không phân giải nổi db')}
<div class="kv-grid">
  <div class="kv"><span class="k">Trình duyệt → nginx</span><span class="v">Đường vào duy nhất. Cổng 80 và 443 công bố trên mọi giao diện; mọi thứ khác vô hình từ bên ngoài máy chủ.</span></div>
  <div class="kv"><span class="k">nginx → web, api</span><span class="v">Gọi bằng tên dịch vụ trên mạng công khai. <code>/</code> và <code>/_next</code> về <code>web:3000</code>, <code>/api</code> về <code>api:3000</code>.</span></div>
  <div class="kv"><span class="k">api, worker → db, cache</span><span class="v">Gọi bằng tên dịch vụ trên mạng riêng. Không có cổng nào được công bố ở bất kỳ đâu trên đường này.</span></div>
  <div class="kv"><span class="k">nginx → db</span><span class="v"><strong>Bất khả.</strong> nginx không có giao diện nào trên mạng riêng — nó thậm chí không phân giải nổi cái tên (Bài 8.3). Một proxy bị chiếm chẳng được gì.</span></div>
  <div class="kv"><span class="k">web → api</span><span class="v">Kết xuất phía máy chủ gọi <code>http://api:3000</code> ở nội bộ; trình duyệt gọi <code>/api</code> qua nginx. Hai URL khác nhau cho cùng một API, và Bài 10.4 chủ yếu nói về phân biệt đó.</span></div>
  <div class="kv"><span class="k">db, cache → Internet</span><span class="v"><strong>Không có đường.</strong> Mạng riêng đặt <code>internal: true</code>, nên kể cả một container cơ sở dữ liệu bị chiếm cũng không tuồn dữ liệu ra ngoài được.</span></div>
</div>

<h3>Tự kiểm: chính sách được THI HÀNH, không chỉ được viết ra</h3>
<p>Cái bảng ở trên là một lời khẳng định. Đây là bằng chứng, lấy từ chính bản stack của khoá (project <code>dk10-blog</code>, đúng bảy dịch vụ này, trên máy Mac M1 chạy Docker Desktop). <code>getent hosts db</code> hỏi bộ phân giải tên (resolver) của container xem cái tên <code>db</code> là địa chỉ nào — đúng phép tra mà ứng dụng của bạn làm trước khi mở kết nối. <code>wget -T 3</code> thử tải một trang trên Internet, chờ tối đa ba giây.</p>
<pre><code class="language-bash">for s in nginx web api worker; do
  docker compose exec $s getent hosts db || echo "$s: không phân giải được"
done
docker compose exec db wget -T 3 -qO- http://example.com
docker compose exec api wget -T 3 -qO- http://example.com &gt;/dev/null &amp;&amp; echo "api ra được Internet"</code></pre>
<div class="out">nginx: không phân giải được
web: không phân giải được
172.22.0.2        db  db
172.22.0.2        db  db
wget: bad address 'example.com'
api ra được Internet</div>
<table>
<tr><th>Dòng</th><th>Chứng minh điều gì</th></tr>
<tr><td><code>nginx: không phân giải được</code></td><td>nginx không có giao diện mạng nào trên <code>private</code>, nên DNS nhúng của Docker (địa chỉ <code>127.0.0.11</code> trong mọi container) không có bản ghi <code>db</code> nào để trả cho nó. Không phải "bị chặn" — đứng ở chỗ nginx thì cái tên đó đơn giản là không tồn tại.</td></tr>
<tr><td><code>172.22.0.2 db db</code> (hai lần)</td><td><code>api</code> và <code>worker</code> cùng ở <code>private</code> nên nhận được địa chỉ của cơ sở dữ liệu trên mạng đó. IP đổi giữa các lần chạy; cái tên thì không — đó là lý do luôn kết nối bằng tên.</td></tr>
<tr><td><code>wget: bad address 'example.com'</code></td><td>Cơ sở dữ liệu thậm chí không phân giải nổi một tên bên ngoài: <code>internal: true</code> không cho mạng đó cổng ra (gateway) lẫn DNS bên ngoài. Một DB bị chiếm cũng không có chỗ nào để gửi dữ liệu của bạn đi.</td></tr>
<tr><td><code>api ra được Internet</code></td><td><code>api</code> ra Internet qua <code>public</code>, một mạng bridge bình thường. Nằm thêm trên một mạng internal không lấy đi gì của container đang có một mạng thường.</td></tr>
</table>
<div class="callout warn"><strong>Hệ quả không ai nhắc: worker cũng KHÔNG ra được Internet.</strong> Nó chỉ nằm trên <code>private</code>, mà mạng đó là <code>internal: true</code>. Thế là đúng với một worker chỉ đọc Redis và ghi Postgres. Nhưng cái ngày nó phải gửi email qua một nhà cung cấp SMTP hay gọi API thanh toán, mọi lời gọi chết với lỗi phân giải tên — trông y hệt như nhà cung cấp đang sập. Cách sửa là một QUYẾT ĐỊNH, không phải một mẹo: thêm mạng thường thứ ba (gọi là <code>egress</code> — "đường ra") và chỉ cho worker vào đó. Đừng chuyển worker sang <code>public</code> — làm vậy là để nginx với tới nó mà chẳng vì lý do gì.</div>

<h3>Cây thư mục</h3>
<pre><code>blog/
├── compose.yaml               <span class="tok-comment"># nền: ảnh, mạng, volume, healthcheck</span>
├── compose.override.yaml      <span class="tok-comment"># dev: build, bind mount, cổng, nạp nóng</span>
├── compose.prod.yaml          <span class="tok-comment"># prod: hạn mức, restart, xoay log, loopback</span>
├── .env.example               <span class="tok-comment"># có commit, đủ khoá, không giá trị</span>
├── Dockerfile.backend         <span class="tok-comment"># API và worker (Bài 10.3)</span>
├── frontend/
│   ├── Dockerfile             <span class="tok-comment"># Next.js standalone (Bài 10.4)</span>
│   └── next.config.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── ops/
│   ├── nginx.conf             <span class="tok-comment"># reverse proxy (Bài 10.5)</span>
│   └── postgres-init/         <span class="tok-comment"># extension, chạy một lần lúc initdb</span>
└── src/                       <span class="tok-comment"># mã nguồn API</span></code></pre>

<h3>Bốn quyết định định hình mọi thứ còn lại</h3>
${slide('dk-10', 7, 'Cây thư mục và bốn quyết định')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · ĐÚNG MỘT dịch vụ công bố cổng</span><span class="lz-t">nginx, và không gì khác</span><span class="lz-d">Mọi dịch vụ khác chỉ với tới được qua mạng container. Điều này xoá bỏ nguyên nhóm tai nạn ở Bài 8.2 — không có cổng cơ sở dữ liệu nào để mà quên, vì chưa từng có cái nào.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Migration là một DỊCH VỤ, không phải một mẹo trong entrypoint</span><span class="lz-t">một container chạy rồi thoát 0</span><span class="lz-d">Với <code>service_completed_successfully</code>, API không thể khởi động trên một schema chưa migrate, và một lần migration hỏng sẽ huỷ cả lượt deploy thay vì đẻ ra một ứng dụng chạy được nửa vời.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Một cái ảnh, ba câu lệnh</span><span class="lz-t">api, worker và migrate dùng chung Dockerfile.backend</span><span class="lz-d">Một lượt dựng, một thứ để quét và vá, và không có cơ hội nào để worker chạy mã khác với API. Chỉ <code>command</code> là khác.</span></div>
  <div class="lz-step"><span class="lz-k">4 · File nền là production; file ghi đè là phát triển</span><span class="lz-t">máy chủ không bao giờ thấy compose.override.yaml</span><span class="lz-d">Lệnh <code>docker compose up</code> mặc định cho lập trình viên bind mount và nạp nóng, còn script deploy truyền <code>-f</code> tường minh và nhận đúng phần nền trơn (Bài 9.5).</span></div>
</div>

<h3>Bộ khung, trước khi chúng ta điền vào</h3>
${slide('dk-10', 5, 'compose.yaml đọc như một bản vẽ: mạng trước, dịch vụ sau')}
<pre><code>name: blog

services:
  nginx:   { depends_on: [web, api], networks: [public] }
  web:     { depends_on: [api],      networks: [public] }
  api:     { networks: [public, private] }
  worker:  { networks: [private] }
  db:      { networks: [private] }
  cache:   { networks: [private] }
  migrate: { networks: [private], restart: "no" }
  seed:    { networks: [private], profiles: [seed], restart: "no" }

networks:
  public:
  private:
    internal: true

volumes:
  pgdata:
  redisdata:</code></pre>
<div class="callout ok"><strong>Hãy đọc mấy dòng <code>networks</code> như một chính sách kiểm soát truy cập, vì đúng là như vậy.</strong> <code>api</code> xuất hiện ở cả hai danh sách và là dịch vụ duy nhất làm thế; riêng chi tiết đó là thứ cho phép một yêu cầu đi từ thế giới bên ngoài tới cơ sở dữ liệu, và không gì khác vượt qua được ranh giới ấy. Quyết chuyện này TRƯỚC khi viết các dịch vụ dễ hơn nhiều so với gắn vào sau — và đó là phần của một file compose mà người review nên đọc đầu tiên.</div>

<h3>Chạy thử từng bước: dựng stack lên và nhìn xem ai chờ ai</h3>
${slide('dk-10', 6, 'depends_on + healthcheck = thứ tự khởi động có điều kiện, số đo thật')}
<p>Một <code>depends_on</code> có <code>condition</code> biến compose từ "bật tất cả cùng lúc" thành một đồ thị phụ thuộc mà nó đi lần lượt: bật những gì không phụ thuộc ai, chờ từng điều kiện được thoả, rồi mới bật tầng kế tiếp. Nhìn file YAML thì không thấy đồ thị đó. Nhưng nhìn các mốc thời gian Docker ghi cho từng container thì thấy — nên hãy dựng stack thật lên rồi đọc chúng.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bước 1 · bật</span><span class="lz-t">docker compose up -d</span><span class="lz-d">Compose tạo hai mạng và các volume có tên TRƯỚC, rồi bật những dịch vụ không phụ thuộc ai: <code>db</code> và <code>cache</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 2 · nhìn</span><span class="lz-t">docker compose ps -a</span><span class="lz-d"><code>-a</code> liệt kê cả container đã dừng. Thiếu nó bạn sẽ không thấy <code>migrate</code> đâu cả, vì nó đã chạy xong rồi.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 3 · đo</span><span class="lz-t">docker inspect -f '{{.State.StartedAt}}' …</span><span class="lz-d">Thời điểm tiến trình bắt đầu và — với container đã thoát — thời điểm nó kết thúc. Giờ tính theo UTC (chữ <code>Z</code> ở cuối).</span></div>
  <div class="lz-step"><span class="lz-k">Bước 4 · trừ</span><span class="lz-t">ai bật ngay sau ai?</span><span class="lz-d">Một dịch vụ bật chỉ một phần giây sau khi dịch vụ khác vừa healthy hay vừa thoát là đang CHỜ dịch vụ đó — đó chính là đồ thị, đo bằng số.</span></div>
</div>
<pre><code class="language-bash">docker compose up -d
docker compose ps -a --format 'table {{.Service}}\\t{{.Status}}\\t{{.Ports}}'</code></pre>
<div class="out"> Network dk10-blog_private Created
 Volume dk10-blog_pgdata Created
 …
 Container dk10-blog-db-1 Started
 Container dk10-blog-db-1 Healthy
 Container dk10-blog-migrate-1 Started
 Container dk10-blog-migrate-1 Exited
 Container dk10-blog-api-1 Started
 Container dk10-blog-api-1 Healthy
 Container dk10-blog-web-1 Started
 Container dk10-blog-web-1 Healthy
 Container dk10-blog-nginx-1 Started
SERVICE   STATUS                                     PORTS
api       Up 11 seconds (healthy)                    3000/tcp
cache     Up 22 seconds (healthy)                    6379/tcp
db        Up 22 seconds (healthy)                    5432/tcp
migrate   Exited (0) 11 seconds ago
nginx     Up Less than a second (health: starting)   127.0.0.1:18100-&gt;80/tcp
web       Up 5 seconds (healthy)                     3000/tcp
worker    Up 11 seconds                              3000/tcp</div>
<pre><code class="language-bash">for s in db cache migrate api worker web nginx; do c=dk10-blog-$s-1
  printf '%-8s start=%s fin=%s exit=%s\\n' $s "$(docker inspect -f '{{.State.StartedAt}}' $c)" \\
    "$(docker inspect -f '{{.State.FinishedAt}}' $c)" "$(docker inspect -f '{{.State.ExitCode}}' $c)"
done</code></pre>
<div class="out">db       start=2026-09-23T19:16:31.46503692Z fin=0001-01-01T00:00:00Z exit=0
cache    start=2026-09-23T19:16:31.373140836Z fin=0001-01-01T00:00:00Z exit=0
migrate  start=2026-09-23T19:16:37.050843047Z fin=2026-09-23T19:16:42.444331133Z exit=0
api      start=2026-09-23T19:16:42.689577258Z fin=0001-01-01T00:00:00Z exit=0
worker   start=2026-09-23T19:16:42.621878175Z fin=0001-01-01T00:00:00Z exit=0
web      start=2026-09-23T19:16:48.281061511Z fin=0001-01-01T00:00:00Z exit=0
nginx    start=2026-09-23T19:16:53.856507083Z fin=0001-01-01T00:00:00Z exit=0</div>
<p>Output thật của stack khoá dựng (Compose v5.5.1; khi output đi vào một pipe hay một script chứ không phải terminal, Compose in mỗi lần đổi trạng thái thành một dòng trơn thay vì khung tiến độ chạy động). Cách đọc:</p>
<table>
<tr><th>Nhìn thấy</th><th>Nghĩa là</th></tr>
<tr><td><code>fin=0001-01-01T00:00:00Z</code></td><td>"Thời điểm số không" của Go: container CHƯA từng kết thúc — nó vẫn đang chạy. Chỉ <code>migrate</code> có giờ kết thúc thật.</td></tr>
<tr><td><code>migrate</code> bật sau <code>db</code> 5,6 giây</td><td>Postgres sẵn sàng sau khoảng một giây, nhưng healthcheck chỉ chạy mỗi <code>interval: 5s</code>, nên phán quyết "healthy" đầu tiên — thứ <code>migrate</code> đang chờ — tới muộn khoảng năm giây.</td></tr>
<tr><td><code>migrate</code> chạy 5,4 giây, <code>exit=0</code></td><td>Cổng mở. <code>api</code> và <code>worker</code> bật 0,2 giây sau khi <code>migrate</code> kết thúc: đó chính là <code>service_completed_successfully</code> đang làm việc.</td></tr>
<tr><td><code>web</code> sau <code>api</code> 5,6 giây, <code>nginx</code> sau <code>web</code> 5,6 giây</td><td>Mỗi lần "chờ tới khi healthy" tốn chừng một khoảng interval. Bảy dịch vụ, bốn lần chờ, tổng 22,5 giây — Bài 10.5 đo cách rút xuống 5,4 giây.</td></tr>
<tr><td><code>Exited (0)</code> ở <code>migrate</code></td><td>Là THÀNH CÔNG, không phải sập. Một việc chạy-một-lần vốn phải kết thúc; <code>restart: "no"</code> bảo đảm không ai bật lại nó.</td></tr>
</table>
<div class="callout"><strong>Mac, Linux, Windows.</strong> Cùng một file chạy giống nhau ở cả ba, vì mọi container đều chạy trên nhân Linux (trên Mac và Windows là nhân nằm trong máy ảo của Docker Desktop). Có hai khác biệt nên biết. Khoá công bố nginx ở <code>127.0.0.1:18100</code> — chỉ loopback (địa chỉ nội bộ của máy) — vì đây là máy cá nhân; trên VPS dòng đó thành <code>"80:80"</code> và <code>"443:443"</code>. Và trên máy Windows của bạn cùng nhóm, thư mục dự án phải nằm TRONG hệ thống file của WSL2 (<code>\\\\wsl$\\…</code>), không phải trên <code>C:\\</code>, không thì các bind mount của <code>ops/</code> chậm hẳn đi (Chương 7).</div>

<h3>Mỗi bài còn lại thêm gì</h3>
<pre><code>10.2  db + cache        <span class="tok-comment"># healthcheck, script khởi tạo, tinh chỉnh, lưu lâu dài</span>
10.3  api + worker      <span class="tok-comment"># Dockerfile.backend, migrate thành một việc, seed</span>
10.4  web               <span class="tok-comment"># Next.js standalone, biến lúc dựng với lúc chạy</span>
10.5  nginx + lắp ráp   <span class="tok-comment"># cấu hình proxy, TLS, file hoàn chỉnh, deploy</span></code></pre>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn trong nhóm SWP391 muốn công bố Postgres ở cổng 5432 "cho tiện debug" và để mọi dịch vụ chung một mạng. Trước khi tranh luận, hãy dựng một bản thu nhỏ ba dịch vụ và cho bạn ấy thấy việc tách mạng thật sự mua được gì.</p><ol>
<li>Tạo thư mục trong sân tập: <code>mkdir -p ~/thu-docker/stack-thu &amp;&amp; cd ~/thu-docker/stack-thu</code>, rồi lưu file bên dưới thành <code>compose.yaml</code>. <code>api</code> chỉ là vai đóng thế (một container Alpine ngủ) — điều quan trọng là nó vào những mạng nào.</li>
<li>Bật lên và liệt kê cổng: <code>docker compose up -d</code>, rồi <code>docker compose ps --format 'table {{.Service}}\\t{{.Ports}}'</code>. Chỉ đúng MỘT dòng được có mũi tên <code>-&gt;</code>.</li>
<li>Hỏi hai container địa chỉ của cơ sở dữ liệu: <code>docker compose exec proxy getent hosts db || echo "proxy: không thấy db"</code>, rồi hỏi y như vậy từ <code>api</code>.</li>
<li>Thử ra Internet từ hai phía: <code>docker compose exec db sh -c 'wget -T 3 -qO- http://example.com || echo "db: exit $?"'</code> và <code>docker compose exec api sh -c 'wget -T 3 -qO /dev/null http://example.com &amp;&amp; echo "api: ra được Internet"'</code>.</li>
<li>Dọn dẹp: <code>docker compose down -v</code>.</li></ol>
<pre><code class="language-yaml">name: thu-stack
services:
  proxy:
    image: nginx:1.27-alpine
    ports: ["127.0.0.1:18101:80"]
    networks: [public]
  api:
    image: alpine:3.20
    command: ["sleep", "3600"]
    networks: [public, private]
  db:
    image: postgres:16.4-alpine
    environment:
      POSTGRES_PASSWORD: thu
    volumes: [pgdata:/var/lib/postgresql/data]
    networks: [private]
networks:
  public:
  private:
    internal: true
volumes:
  pgdata:</code></pre>
<div class="out">SERVICE   PORTS
api
db        5432/tcp
proxy     127.0.0.1:18101-&gt;80/tcp
proxy: không thấy db
172.26.0.3        db  db
wget: bad address 'example.com'
db: exit 1
api: ra được Internet</div>
<p>Output ghi trên máy Mac của khoá (ở đó project tên <code>dk10-thu1</code>; IP trên máy bạn sẽ khác).</p>
<p><strong>Đạt khi:</strong> <code>proxy</code> là dịch vụ duy nhất có mũi tên ở cột cổng, <code>proxy</code> không phân giải nổi <code>db</code> trong khi <code>api</code> nhận được IP, <code>db</code> trả <code>bad address</code>, <code>api</code> in <code>ra được Internet</code> — và bạn giải thích được cho bạn cùng nhóm, mỗi ý một câu, vì sao 5432 không bao giờ cần công bố.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Service (dịch vụ)</span><span class="v">Một mục dưới <code>services:</code> — công thức cho một hay nhiều container giống nhau, gọi được bằng tên trên mọi mạng nó tham gia.</span></div>
  <div class="kv"><span class="k">Internal network (mạng nội bộ)</span><span class="v">Mạng đặt <code>internal: true</code>: container trên đó nói chuyện được với nhau, nhưng không có cổng ra bên ngoài và không có DNS bên ngoài.</span></div>
  <div class="kv"><span class="k">Publish a port (công bố cổng)</span><span class="v">Dòng <code>ports:</code>: mở một cổng trên máy chủ và chuyển tiếp vào container. Không có nó, cổng chỉ với tới được từ các container khác.</span></div>
  <div class="kv"><span class="k">Embedded DNS (DNS nhúng)</span><span class="v">Bộ phân giải tên của Docker ở <code>127.0.0.11</code> trong mỗi container; nó chỉ trả lời tên dịch vụ của những mạng mà container đó đang ở.</span></div>
  <div class="kv"><span class="k"><code>depends_on</code> condition (điều kiện phụ thuộc)</span><span class="v"><code>service_started</code>, <code>service_healthy</code> hoặc <code>service_completed_successfully</code> — thứ compose chờ trước khi bật dịch vụ phụ thuộc.</span></div>
  <div class="kv"><span class="k">Reverse proxy (proxy ngược)</span><span class="v">Máy chủ đứng mặt ra Internet và chuyển mỗi yêu cầu tới đúng dịch vụ bên trong — ở đây là nginx.</span></div>
  <div class="kv"><span class="k">One-shot job (việc chạy một lần)</span><span class="v">Container sinh ra để chạy một lần rồi thoát (<code>migrate</code>, <code>seed</code>); <code>Exited (0)</code> là trạng thái THÀNH CÔNG của nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bảy dịch vụ, hai mạng, một cổng công bố: nginx là đường vào duy nhất.</li>
<li><code>api</code> là dịch vụ duy nhất ở cả hai mạng — cây cầu duy nhất giữa thế giới bên ngoài và dữ liệu.</li>
<li><code>internal: true</code> bỏ cổng ra và DNS bên ngoài; hãy chứng minh bằng <code>getent hosts</code> và <code>wget</code>, đừng đoán.</li>
<li>Worker chỉ ở mạng internal thì không gọi được API bên ngoài; cần thì cho nó một mạng <code>egress</code> riêng.</li>
<li><code>depends_on</code> có điều kiện là một đồ thị compose đi lần lượt; đọc nó từ mốc thời gian của <code>docker inspect</code>.</li>
<li>Mỗi lần "chờ tới khi healthy" tốn chừng một interval healthcheck — stack này mất 22,5 giây trước khi tinh chỉnh.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/compose/how-tos/production/" target="_blank" rel="noopener">
  <span class="lc-ico">🏭</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Compose trên production</span><span class="lc-sub">Danh sách kiểm chính thức để đưa một stack compose từ máy cá nhân lên máy chủ: bỏ bind mount, gắn cổng khác đi, chính sách restart, và dựng lúc deploy so với kéo ảnh về.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/compose/how-tos/networking/" target="_blank" rel="noopener">
  <span class="lc-ico">🕸️</span>
  <span class="lc-body"><span class="lc-title">Compose — mạng</span><span class="lc-sub">Compose tạo mạng mặc định ra sao, tên dịch vụ phân giải thế nào, và cấu hình nhiều mạng mà chương này dùng để tách tầng công khai khỏi tầng riêng.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: lên bản vẽ cho một stack</span><span class="lc-sub">Bài chấm điểm: cho sáu dịch vụ, quyết định mỗi cái vào mạng nào và cái nào công bố cổng, rồi biện luận vì sao proxy không được phép phân giải nổi tên cơ sở dữ liệu.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> thiết kế stack bằng cách thêm dần từng dịch vụ rồi để mạng mặc định của compose ôm hết. Nó chạy được ngay, và đó chính là cái bẫy — mọi dịch vụ với tới được mọi dịch vụ khác, nên một lỗ hổng trong con worker thay đổi kích thước ảnh chỉ cách bảng người dùng của bạn đúng một lệnh <code>psql</code>, mà chẳng ai để ý vì có gì hỏng đâu. Hãy quyết cách tách mạng ngay từ đầu, khi mới có ba dịch vụ và việc đó tốn hai phút, thay vì đợi tới lúc có chín cái và tách chúng ra nghĩa là phải kiểm lại mọi đường đi. Cái luật sống sót được khi va vào thực tế: một dịch vụ chỉ vào một mạng nếu nó phải <em>chủ động mở</em> kết nối trên đó, và chỉ reverse proxy mới công bố cổng.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Một dịch vụ công bố cổng còn mọi thứ khác chỉ với tới được bằng tên container — riêng quyết định đó loại bỏ phần lớn tai nạn ở Chương 8. Migration thuộc về một dịch vụ riêng có <code>service_completed_successfully</code> canh cửa, để một lần migration hỏng dừng cả lượt deploy thay vì đẻ ra ứng dụng chạy nửa vời. Và mấy dòng <code>networks:</code> là một chính sách kiểm soát truy cập: hãy viết chúng trước các dịch vụ, đừng viết sau.</p>
</div>
`,
    },
    /* ─────────────────────────── 10.2 ─────────────────────────── */
    {
      title: '10.2 — The data tier: Postgres and Redis|||10.2 — Tầng dữ liệu: Postgres và Redis',
      slug: 'dk-10-2-tang-du-lieu',
      type: 'LESSON',
      description: 'Dịch vụ Postgres đầy đủ với healthcheck và script khởi tạo, vì sao POSTGRES_PASSWORD chỉ được đọc một lần, Redis có persistence và maxmemory, biến môi trường quan trọng, và cách nâng phiên bản chính.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>The data tier: Postgres and Redis</h2>
<p class="lead">These two services carry everything that matters and are the two you least want to get wrong. Both are simple to declare and both have a handful of behaviours — one-time initialisation, persistence modes, memory policy — that are invisible until the day they surprise you.</p>

<h3>PostgreSQL, completely</h3>
${slide('dk-10', 8, 'Dịch vụ db: mỗi dòng trả lời một câu hỏi')}
<pre><code>  db:
    image: postgres:16.4-alpine
    environment:
      POSTGRES_USER: &#36;{POSTGRES_USER:-blog}
      POSTGRES_PASSWORD: &#36;{POSTGRES_PASSWORD:?set POSTGRES_PASSWORD in .env}
      POSTGRES_DB: &#36;{POSTGRES_DB:-blog}
      PGDATA: /var/lib/postgresql/data/pgdata     <span class="tok-comment"># subdir: lost+found does not break initdb</span>
      TZ: Asia/Ho_Chi_Minh
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./ops/postgres-init:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U &#36;{POSTGRES_USER:-blog} -d &#36;{POSTGRES_DB:-blog}"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 30s
    command:
      - "postgres"
      - "-c" 
      - "max_connections=100"
      - "-c"
      - "shared_buffers=256MB"
      - "-c"
      - "log_min_duration_statement=500"          <span class="tok-comment"># log queries over 500ms</span>
    networks: [private]
    restart: unless-stopped</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Pin the minor version</span><span class="v"><code>16.4-alpine</code>, not <code>16-alpine</code> and certainly not <code>latest</code>. A silent jump to Postgres 17 on a rebuild will refuse to start on a version-16 data directory, and the error arrives during a deploy.</span></div>
  <div class="kv"><span class="k"><code>PGDATA</code> in a subdirectory</span><span class="v">Some volume drivers create a <code>lost+found</code> at the mount root, and <code>initdb</code> refuses a non-empty directory. Pointing <code>PGDATA</code> one level deeper avoids an initialisation failure that is baffling the first time.</span></div>
  <div class="kv"><span class="k"><code>:?</code> on the password</span><span class="v">A missing password should stop the deploy with a clear message, not start a database whose superuser has an empty password (Lesson 9.4).</span></div>
  <div class="kv"><span class="k">Tuning via <code>command</code></span><span class="v">The official image runs <code>postgres</code> as its command, so appending <code>-c key=value</code> pairs is the supported way to set parameters without a custom <code>postgresql.conf</code>.</span></div>
  <div class="kv"><span class="k"><code>log_min_duration_statement</code></span><span class="v">One line that turns "the app feels slow" into a log of exactly which queries took over half a second. Cheap, and the first thing you will want when something is slow.</span></div>
</div>

<h3>The initialisation directory runs exactly once</h3>
${slide('dk-10', 9, 'initdb.d chạy đúng một lần — lúc thư mục dữ liệu còn rỗng')}
<pre><code><span class="tok-comment"># ops/postgres-init/01-extensions.sql</span>
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;          <span class="tok-comment"># trigram search</span>
CREATE EXTENSION IF NOT EXISTS unaccent;         <span class="tok-comment"># Vietnamese search without diacritics</span></code></pre>
<pre><code>docker compose up -d db &amp;&amp; docker compose logs db --no-log-prefix | grep -E 'initdb.d|EXTENSION|init process|ready to accept'</code></pre>
<div class="out">2026-09-24 02:16:32.157 +07 [42] LOG:  database system is ready to accept connections
/usr/local/bin/docker-entrypoint.sh: running /docker-entrypoint-initdb.d/01-extensions.sql
CREATE EXTENSION
CREATE EXTENSION
CREATE EXTENSION
PostgreSQL init process complete; ready for start up.
2026-09-24 02:16:32.418 +07 [1] LOG:  database system is ready to accept connections</div>
<p>Real output from the course's stack (postgres:16.4-alpine, Compose v5.5). An earlier version of this lesson filtered with <code>'init|ready' | head -4</code> and still showed a <code>CREATE EXTENSION</code> line — a line containing neither word cannot pass that filter, and a script with three <code>CREATE EXTENSION</code> statements prints three lines, not one. The command above is the one that was actually run.</p>
<div class="callout warn"><strong>Scripts in <code>/docker-entrypoint-initdb.d</code> run only when the data directory is empty.</strong> On the second and every subsequent start they are skipped entirely, silently. That surprises people twice: a new extension added to the script never appears on an existing database, and — more dangerously — <code>POSTGRES_PASSWORD</code> is also only read at initialisation, so changing it in <code>.env</code> and redeploying does <em>not</em> change the password. Use <code>ALTER USER … PASSWORD</code>, or a migration, for anything that must apply to an existing database.</div>

<h3>Why "ready to accept connections" appears twice</h3>
<p>Read the timestamps in the output above: the first "ready" line comes from process <code>[42]</code>, the second from process <code>[1]</code>. On first start the image's entrypoint runs <code>initdb</code>, then starts a <em>temporary</em> Postgres server just to run your scripts, stops it, and only then starts the real server as PID 1. The temporary server deliberately listens on the Unix socket only — line 270 of <code>/usr/local/bin/docker-entrypoint.sh</code> in this image adds <code>-c listen_addresses=''</code>. Two practical consequences:</p>
<ul>
<li>Nothing on the network can connect during initialisation. If your API started in that window it would get "connection refused", which is exactly what <code>condition: service_healthy</code> protects you from.</li>
<li><code>pg_isready</code> without <code>-h</code> also talks over the socket, so in principle it can report "ready" while only the temporary server is up. On this stack initialisation took well under a second and the first healthcheck ran five seconds later, so it never mattered; if your init scripts are slow (a big seed in <code>initdb.d</code>), use <code>pg_isready -h 127.0.0.1 -U blog -d blog</code>, which only the real, TCP-listening server can answer.</li>
</ul>
<p>And here is the second start of the same container — the proof that the init directory is skipped:</p>
<pre><code class="language-bash">docker compose restart db
docker compose logs db --no-log-prefix --since 20s | grep -E 'Skipping|starting'</code></pre>
<div class="out">PostgreSQL Database directory appears to contain a database; Skipping initialization
2026-09-24 02:19:20.518 +07 [1] LOG:  starting PostgreSQL 16.4 on aarch64-unknown-linux-musl, compiled by gcc (Alpine 13.2.1_git20240309) 13.2.1 20240309, 64-bit</div>

<h3>Run it step by step: change the password the wrong way, then the right way</h3>
${slide('dk-10', 10, 'Đổi POSTGRES_PASSWORD trong .env: DB phớt lờ, migrate chết, site 502')}
<p>The callout above says <code>POSTGRES_PASSWORD</code> is read once. Here is what that looks like on the real seven-service stack when someone changes it in <code>.env</code> — say, because the old password was accidentally committed to GitHub. <code>.env</code> holds both <code>POSTGRES_PASSWORD</code> (read by the database image) and <code>DATABASE_URL</code> (read by the API, worker and migration), and both were changed together, as you would.</p>
<pre><code class="language-bash">sed -i '' 's/dk10-mat-khau-thu/dk10-mat-khau-MOI/g' .env     <span class="tok-comment"># Linux: sed -i 's/…/…/g' .env</span>
docker compose up -d
docker compose logs migrate --no-log-prefix | grep P1000
docker compose ps -a --format 'table {{.Service}}\\t{{.Status}}'
curl -s -o /dev/null -w '%{http_code}\\n' localhost:18100/api/v1/posts</code></pre>
<div class="out"> Container dk10-blog-db-1 Recreate
 Container dk10-blog-migrate-1 Recreate
 Container dk10-blog-api-1 Recreate
 Container dk10-blog-worker-1 Recreate
 …
 Container dk10-blog-migrate-1 Error service "migrate" didn't complete successfully: exit 1
service "migrate" didn't complete successfully: exit 1
Error: P1000: Authentication failed against database server at &#96;db&#96;, the provided database credentials for &#96;blog&#96; are not valid.
SERVICE   STATUS
api       Created
cache     Up 3 minutes (healthy)
db        Up 11 seconds (healthy)
migrate   Exited (1) Less than a second ago
nginx     Up 3 minutes (healthy)
web       Up 3 minutes (healthy)
worker    Created
502</div>
<p>Four things happened, in this order. Compose saw that the environment of <code>db</code>, <code>migrate</code>, <code>api</code> and <code>worker</code> had changed and recreated all four. The new <code>db</code> container found an existing data directory in the volume, skipped initialisation — and with it the new password. <code>migrate</code> tried the new password and got <code>P1000</code>. The new <code>api</code> and <code>worker</code> therefore never started: they sit in <code>Created</code>. But the <em>old</em> API container had already been removed by the recreate, so nginx now has nothing behind <code>/api</code> and answers <code>502</code>. A few seconds later <code>web</code> turned <code>unhealthy</code> too, because its healthcheck requests <code>/</code>, and the home page renders by calling the API.</p>
<p>The fix is one SQL statement, run through the socket inside the container — which the official image trusts, so it needs no password:</p>
<pre><code class="language-bash">docker compose exec db psql -U blog -c "ALTER USER blog PASSWORD 'dk10-mat-khau-MOI'"
docker compose up -d
curl -s -o /dev/null -w '%{http_code}\\n' localhost:18100/api/v1/posts</code></pre>
<div class="out">ALTER ROLE
 …
 Container dk10-blog-migrate-1 Exited
 Container dk10-blog-api-1 Started
 Container dk10-blog-api-1 Healthy
200</div>
<table>
<tr><th>Tempting fix</th><th>What it really does</th></tr>
<tr><td>Restart everything</td><td>Nothing. The volume still holds the old password hash.</td></tr>
<tr><td><code>docker compose down -v</code> "to start clean"</td><td>Deletes the database. Initialisation then runs with the new password — on an empty database.</td></tr>
<tr><td>Change <code>.env</code> back</td><td>Works, and puts the leaked password back in service. Only acceptable as a stop-gap while you run the <code>ALTER USER</code>.</td></tr>
<tr><td><code>ALTER USER … PASSWORD</code> + <code>up -d</code></td><td>Changes the password where it actually lives. The data stays.</td></tr>
</table>

<h3>Redis, with the two decisions that matter</h3>
${slide('dk-10', 11, 'Redis: lưu lâu dài + maxmemory')}
<pre><code>  cache:
    image: redis:7.4-alpine
    command:
      - "redis-server"
      - "--appendonly"
      - "yes"                                     <span class="tok-comment"># AOF: durable, survives restarts</span>
      - "--maxmemory"
      - "256mb"
      - "--maxmemory-policy"
      - "allkeys-lru"                             <span class="tok-comment"># evict, never OOM</span>
      - "--save"
      - "300 10"
    volumes:
      - redisdata:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks: [private]
    restart: unless-stopped</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Persistence: none</span><span class="lz-t">pure cache, everything lost on restart</span><span class="lz-d">Correct if Redis holds only derived data you can recompute. Wrong if it holds sessions — every user is logged out on a deploy.</span></div>
  <div class="lz-step"><span class="lz-k">Persistence: RDB snapshots</span><span class="lz-t">--save "300 10"</span><span class="lz-d">Point-in-time dumps. Fast, compact, and you lose everything written since the last snapshot. Fine for a cache you would rather not lose entirely.</span></div>
  <div class="lz-step"><span class="lz-k">Persistence: AOF</span><span class="lz-t">--appendonly yes</span><span class="lz-d">Every write appended to a log. Slightly slower, much less data lost. The right choice when sessions or queues live in Redis.</span></div>
  <div class="lz-step"><span class="lz-k">maxmemory + a policy</span><span class="lz-t">--maxmemory 256mb --maxmemory-policy allkeys-lru</span><span class="lz-d">Without both, Redis grows until the container hits its memory limit and the OOM killer takes it. With them it evicts the least-recently-used keys and keeps serving — a degraded cache instead of a dead one.</span></div>
</div>
<pre><code>docker compose exec cache redis-cli info memory | grep -E 'used_memory_human|maxmemory_policy'
docker compose exec cache redis-cli config get appendonly</code></pre>
<div class="out">used_memory_human:1.42M
maxmemory_policy:allkeys-lru
1) "appendonly"
2) "yes"</div>
<p><strong>What the two settings do separately — measured.</strong> The sentence "without both, Redis grows until the OOM killer takes it" is true when <code>maxmemory</code> is missing: its default is <code>0</code>, meaning no limit, so only the container's memory limit stops it. With <code>maxmemory</code> set but no policy, the default policy is <code>noeviction</code>, and Redis refuses writes instead. Both behaviours, on a 2 MB Redis receiving sixty 20 kB values:</p>
<pre><code class="language-bash">docker run -d --name rd redis:7.4-alpine redis-server --maxmemory 2mb          <span class="tok-comment"># chính sách mặc định</span>
docker exec rd sh -c 'V=$(head -c 20000 /dev/zero | tr "\\0" x); for i in $(seq 1 60); do redis-cli set k$i $V; done | sort | uniq -c'
<span class="tok-comment"># làm lại với --maxmemory-policy allkeys-lru</span></code></pre>
<div class="out">noeviction:
     49 OK
     11 OOM command not allowed when used memory &gt; 'maxmemory'.
allkeys-lru:
     60 OK
evicted_keys:12</div>
<p>With <code>noeviction</code> the 50th write fails with an error your application must handle — right for a job queue, where silently dropping a job is worse than an error. With <code>allkeys-lru</code> every write succeeds and Redis quietly drops the twelve least recently used keys — right for a cache. Pick per use; if one Redis instance does both, give the queue its own instance.</p>

<h3>Connecting from the application</h3>
<pre><code><span class="tok-comment"># .env — note the HOSTNAMES are service names, not localhost</span>
POSTGRES_USER=blog
POSTGRES_PASSWORD=change-me-in-production
POSTGRES_DB=blog
DATABASE_URL=postgresql://blog:change-me-in-production@db:5432/blog?schema=public&amp;connection_limit=10
REDIS_URL=redis://cache:6379</code></pre>
<div class="callout"><strong><code>connection_limit</code> is not optional advice on a small server.</strong> Prisma opens a pool per process; with an API, a worker and a migration container all connecting, three pools of the default size can exhaust <code>max_connections=100</code> on their own — and then every request fails with "too many clients". Set it explicitly, and set it low: <code>10</code> per service is generous for a small application, and leaves headroom for <code>psql</code> when you need to look at something.</div>

<h3>Upgrading a major version</h3>
${slide('dk-10', 12, 'Nâng 16 → 17: đổ ra, đổ lại')}
<pre><code><span class="tok-comment"># Postgres does NOT migrate a data directory across major versions. Dump, upgrade, restore.</span>
docker compose exec -T db pg_dumpall -U blog &gt; dump-before-17.sql
docker compose down
docker volume rm blog_pgdata                    <span class="tok-comment"># after the dump, and after checking it</span>
sed -i 's/postgres:16.4-alpine/postgres:17.0-alpine/' compose.yaml
docker compose up -d db
docker compose exec -T db psql -U blog -d postgres &lt; dump-before-17.sql</code></pre>
<div class="out">ERROR:  role "blog" already exists
ALTER ROLE
…
ERROR:  database "blog" already exists
ALTER DATABASE
…
CREATE TABLE
ALTER TABLE
…</div>
<p>This is the real output of the restore step when the course ran this procedure (on two plain containers, <code>docker exec -i dk10-pg16 pg_dumpall -U blog &gt; dump.sql</code> and <code>docker exec -i dk10-pg17 psql -U blog -d postgres &lt; dump.sql</code>; a table of 1284 rows came back complete, checked with <code>select count(*)</code>). An earlier version of this lesson printed <code>pg_dumpall: 84MB written</code> and a clean <code>CREATE ROLE</code> / <code>CREATE DATABASE</code>; neither is real. <code>pg_dumpall</code> prints nothing when it succeeds (the dump here was 19,695 bytes), and the two <code>ERROR</code> lines are expected: the new container already created the role and the database from <code>POSTGRES_USER</code> and <code>POSTGRES_DB</code> at initialisation, and the dump tries to create them again. Harmless — but you only know that if you check the row counts rather than scanning for the word ERROR.</p>
<p>The failure mode if you skip this is unambiguous and happens at start-up: <code>FATAL:  database files are incompatible with server</code> followed by <code>DETAIL:  The data directory was initialized by PostgreSQL version 16, which is not compatible with this version 17.6.</code> (the exact text, from running <code>postgres:17.6-alpine</code> on a version-16 volume; the container exits with code 1). Nothing is damaged, but the service will not start until you either revert the tag or do the dump-and-restore properly, which is a bad time to be reading about it. This is the reason to pin the minor version.</p>
<div class="callout warn"><strong>Postgres 18 moved the data directory — check before you copy an old compose file.</strong> From the 18 images on, <code>PGDATA</code> defaults to <code>/var/lib/postgresql/18/docker</code> and the image's <code>VOLUME</code> is <code>/var/lib/postgresql</code>, so that a future <code>pg_upgrade</code> can keep two versions side by side. Measured: <code>postgres:18-alpine</code> prints <code>PGDATA=/var/lib/postgresql/18/docker</code>, and starting it with a volume mounted at the old path <code>/var/lib/postgresql/data</code> — the line every tutorial written for 16 contains — makes the container refuse to start with <code>Error: in 18+, these Docker images are configured to store database data in a format which is compatible with "pg_ctlcluster"…</code> and exit 1. For 18, mount the volume at <code>/var/lib/postgresql</code> and drop the <code>PGDATA</code> override. The stack in this chapter stays on 16.4, pinned, exactly so that such a change arrives when you choose it.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your group accidentally pushed <code>.env</code> with the database password to GitHub. You change it in <code>.env</code>, redeploy — and the app can no longer log in to its own database. Reproduce it on a tiny stack, then fix it without losing a row.</p><ol>
<li><code>mkdir -p ~/thu-docker/doi-mk &amp;&amp; cd ~/thu-docker/doi-mk</code>, save the file below as <code>compose.yaml</code>, and create the old password: <code>echo 'POSTGRES_PASSWORD=cu' &gt; .env</code>.</li>
<li>Start the database and connect over the network the way an app does: <code>docker compose up -d --wait</code>, then <code>docker compose run --rm app</code>. <code>app</code> is a one-shot psql client that uses the password from <code>.env</code>.</li>
<li>"Rotate" the password the tempting way: <code>sed -i '' 's/=cu/=moi/' .env</code> (Linux: <code>sed -i 's/=cu/=moi/' .env</code>), <code>docker compose up -d --wait</code>, and run <code>docker compose run --rm app</code> again.</li>
<li>Fix it where the password really lives: <code>docker compose exec db psql -U blog -c "ALTER USER blog PASSWORD 'moi'"</code>, then <code>docker compose run --rm app</code> once more.</li>
<li>Clean up: <code>docker compose down -v</code>.</li></ol>
<pre><code class="language-yaml">name: doi-mk
services:
  db:
    image: postgres:16.4-alpine
    environment:
      POSTGRES_USER: blog
      POSTGRES_PASSWORD: &#36;{POSTGRES_PASSWORD:?đặt POSTGRES_PASSWORD trong .env}
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U blog"]
      interval: 2s
  app:
    image: postgres:16.4-alpine
    command: ["psql", "postgresql://blog:&#36;{POSTGRES_PASSWORD}@db/blog", "-tAc", "select 'ket noi OK'"]
    profiles: [thu]
volumes:
  pgdata:</code></pre>
<div class="out">ket noi OK
 Container dk10-thu2-db-1 Recreate
 Container dk10-thu2-db-1 Healthy
psql: error: connection to server at "db" (172.27.0.2), port 5432 failed: FATAL:  password authentication failed for user "blog"
ALTER ROLE
ket noi OK</div>
<p>Output recorded on the course's Mac (project named <code>dk10-thu2</code> there). Note that <code>app</code> connects to <code>db</code> over the network on purpose: a <code>psql</code> inside the <code>db</code> container over <code>127.0.0.1</code> is trusted by the image's default <code>pg_hba.conf</code> and would "work" with any password — a test that passes for the wrong reason.</p>
<p><strong>Done when:</strong> you saw <code>ket noi OK</code>, then <code>password authentication failed</code> after the <code>.env</code> change although <code>db</code> reported <code>Healthy</code>, then <code>ket noi OK</code> again after <code>ALTER ROLE</code> — and at no point did you run <code>down -v</code> before the last step.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">initdb</span><span class="v">The one-time creation of a Postgres data directory. The image runs it — and your <code>initdb.d</code> scripts — only when the directory is empty.</span></div>
  <div class="kv"><span class="k"><code>PGDATA</code></span><span class="v">The directory Postgres keeps its data in. Point it at a subfolder of the volume; in the 18 images its default moved to <code>/var/lib/postgresql/18/docker</code>.</span></div>
  <div class="kv"><span class="k"><code>pg_isready</code></span><span class="v">A tiny client that asks "are you accepting connections?". The usual healthcheck for Postgres; add <code>-h 127.0.0.1</code> to test over TCP.</span></div>
  <div class="kv"><span class="k">AOF / RDB</span><span class="v">Redis's two ways to persist: an append-only log of every write, or periodic snapshots. AOF loses about a second on a crash, RDB everything since the last snapshot.</span></div>
  <div class="kv"><span class="k">Eviction policy</span><span class="v">What Redis does at <code>maxmemory</code>: <code>noeviction</code> refuses writes, <code>allkeys-lru</code> drops the least recently used keys.</span></div>
  <div class="kv"><span class="k">Major version</span><span class="v">The first number of Postgres (16, 17, 18). Data directories are not compatible across it; you dump and restore, or use <code>pg_upgrade</code>.</span></div>
  <div class="kv"><span class="k"><code>pg_dumpall</code></span><span class="v">Dumps every database plus roles as SQL. Prints nothing on success; check the file size and, after restoring, the row counts.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Everything the image does at initialisation — <code>POSTGRES_PASSWORD</code>, <code>POSTGRES_USER</code>, <code>POSTGRES_DB</code>, <code>initdb.d</code> — happens once, on an empty data directory.</li>
<li>Changing the password in <code>.env</code> recreates the containers, breaks the migration with <code>P1000</code>, and leaves the site on 502; fix it with <code>ALTER USER</code>, never with <code>down -v</code>.</li>
<li>The first "ready" line in the log is a temporary socket-only server; the healthcheck gate is what keeps your API from racing it.</li>
<li><code>maxmemory</code> alone makes Redis refuse writes (<code>noeviction</code>); add <code>allkeys-lru</code> for a cache, keep <code>noeviction</code> for a queue.</li>
<li>A major Postgres upgrade is dump → new volume → restore; the two <code>already exists</code> errors are expected, the row counts are the proof.</li>
<li>Pin the minor version: Postgres 17 refuses a 16 directory, and Postgres 18 even moved where the data lives.</li>
</ul>

<a class="link-card" href="https://hub.docker.com/_/postgres" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">postgres — official image docs</span><span class="lc-sub">Every environment variable, the <code>_FILE</code> suffix for reading secrets from files, the initialisation directory rules, and the caveats about <code>PGDATA</code> and bind mounts.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">Redis persistence</span><span class="lc-sub">RDB versus AOF explained properly, including what each loses on a crash and why running both is a reasonable default for anything that is not purely a cache.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/reference/eviction/" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">Redis eviction policies</span><span class="lc-sub">All eight policies with the case for each. <code>allkeys-lru</code> for a cache, <code>noeviction</code> for a queue where losing data is worse than an error.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build the data tier</span><span class="lc-sub">Graded exercises: write the db service with a working healthcheck, prove that the init directory is skipped on the second start, and choose a Redis persistence and eviction policy for three scenarios.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> changing <code>POSTGRES_PASSWORD</code> in <code>.env</code> and expecting a redeploy to apply it. That variable is read exactly once, when the data directory is initialised; on an existing volume it is ignored completely. The application then fails to authenticate with the new password while the database still holds the old one, and the obvious-looking fix — <code>docker compose down -v</code> to "start fresh" — deletes the database. The actual fix is one SQL statement: <code>docker compose exec db psql -U blog -c "ALTER USER blog PASSWORD 'new'"</code>, then update <code>.env</code> and <code>DATABASE_URL</code> to match and recreate the API. The same one-time-only rule applies to <code>POSTGRES_DB</code>, <code>POSTGRES_USER</code> and everything in <code>/docker-entrypoint-initdb.d</code>.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>/docker-entrypoint-initdb.d</code> and <code>POSTGRES_PASSWORD</code> apply only when the data directory is empty — on an existing volume both are silently ignored. Give Redis both <code>maxmemory</code> and a <code>maxmemory-policy</code>, or it grows until the OOM killer takes it instead of evicting. And pin the minor version of your database image: a major-version jump refuses to start on an existing data directory, and it will happen during a deploy.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Tầng dữ liệu: Postgres và Redis</h2>
<p class="lead">Hai dịch vụ này gánh mọi thứ quan trọng và cũng là hai thứ bạn ít muốn làm sai nhất. Cả hai đều dễ khai báo và cả hai đều có dăm ba hành vi — khởi tạo một lần, chế độ lưu lâu dài, chính sách bộ nhớ — vô hình cho tới đúng ngày chúng làm bạn bất ngờ.</p>

<h3>PostgreSQL, viết đủ</h3>
${slide('dk-10', 8, 'Dịch vụ db: mỗi dòng trả lời một câu hỏi')}
<pre><code>  db:
    image: postgres:16.4-alpine
    environment:
      POSTGRES_USER: &#36;{POSTGRES_USER:-blog}
      POSTGRES_PASSWORD: &#36;{POSTGRES_PASSWORD:?set POSTGRES_PASSWORD in .env}
      POSTGRES_DB: &#36;{POSTGRES_DB:-blog}
      PGDATA: /var/lib/postgresql/data/pgdata     <span class="tok-comment"># thư mục con: lost+found không phá initdb</span>
      TZ: Asia/Ho_Chi_Minh
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./ops/postgres-init:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U &#36;{POSTGRES_USER:-blog} -d &#36;{POSTGRES_DB:-blog}"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 30s
    command:
      - "postgres"
      - "-c" 
      - "max_connections=100"
      - "-c"
      - "shared_buffers=256MB"
      - "-c"
      - "log_min_duration_statement=500"          <span class="tok-comment"># ghi log truy vấn quá 500ms</span>
    networks: [private]
    restart: unless-stopped</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Ghim cả số hiệu phụ</span><span class="v"><code>16.4-alpine</code>, không phải <code>16-alpine</code> và chắc chắn không phải <code>latest</code>. Một cú nhảy lặng lẽ sang Postgres 17 trong một lượt dựng lại sẽ không chịu khởi động trên thư mục dữ liệu của bản 16, và cái lỗi đó tới ngay giữa lúc deploy.</span></div>
  <div class="kv"><span class="k"><code>PGDATA</code> nằm trong thư mục con</span><span class="v">Vài driver volume tạo ra một thư mục <code>lost+found</code> ở gốc chỗ gắn, và <code>initdb</code> từ chối một thư mục không rỗng. Trỏ <code>PGDATA</code> sâu thêm một tầng là tránh được một lỗi khởi tạo mà lần đầu gặp thì rất khó hiểu.</span></div>
  <div class="kv"><span class="k"><code>:?</code> ở mật khẩu</span><span class="v">Một mật khẩu bị thiếu nên dừng lượt deploy với thông báo rõ ràng, chứ không nên khởi động một cơ sở dữ liệu mà siêu người dùng có mật khẩu rỗng (Bài 9.4).</span></div>
  <div class="kv"><span class="k">Tinh chỉnh qua <code>command</code></span><span class="v">Ảnh chính thức chạy <code>postgres</code> làm câu lệnh của nó, nên nối thêm các cặp <code>-c khoá=giá trị</code> là cách được hỗ trợ để đặt tham số mà không cần một file <code>postgresql.conf</code> riêng.</span></div>
  <div class="kv"><span class="k"><code>log_min_duration_statement</code></span><span class="v">Một dòng biến câu "ứng dụng thấy chậm" thành một cuốn log ghi rõ truy vấn nào vượt nửa giây. Rẻ, và là thứ đầu tiên bạn sẽ cần khi có gì đó chậm.</span></div>
</div>

<h3>Thư mục khởi tạo chạy đúng MỘT lần</h3>
${slide('dk-10', 9, 'initdb.d chạy đúng một lần — lúc thư mục dữ liệu còn rỗng')}
<pre><code><span class="tok-comment"># ops/postgres-init/01-extensions.sql</span>
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;          <span class="tok-comment"># tìm kiếm theo trigram</span>
CREATE EXTENSION IF NOT EXISTS unaccent;         <span class="tok-comment"># tìm tiếng Việt không dấu</span></code></pre>
<pre><code>docker compose up -d db &amp;&amp; docker compose logs db --no-log-prefix | grep -E 'initdb.d|EXTENSION|init process|ready to accept'</code></pre>
<div class="out">2026-09-24 02:16:32.157 +07 [42] LOG:  database system is ready to accept connections
/usr/local/bin/docker-entrypoint.sh: running /docker-entrypoint-initdb.d/01-extensions.sql
CREATE EXTENSION
CREATE EXTENSION
CREATE EXTENSION
PostgreSQL init process complete; ready for start up.
2026-09-24 02:16:32.418 +07 [1] LOG:  database system is ready to accept connections</div>
<p>Output thật của stack khoá dựng (postgres:16.4-alpine, Compose v5.5). Bản cũ của bài lọc bằng <code>'init|ready' | head -4</code> mà vẫn in ra một dòng <code>CREATE EXTENSION</code> — một dòng không chứa chữ nào trong hai chữ đó thì không thể lọt qua bộ lọc ấy, và một script có ba câu <code>CREATE EXTENSION</code> in ba dòng chứ không phải một. Lệnh ở trên là lệnh đã thật sự chạy.</p>
<div class="callout warn"><strong>Script trong <code>/docker-entrypoint-initdb.d</code> chỉ chạy khi thư mục dữ liệu còn RỖNG.</strong> Từ lần khởi động thứ hai trở đi chúng bị bỏ qua hoàn toàn, trong im lặng. Chuyện đó làm người ta bất ngờ hai lần: một extension mới thêm vào script không bao giờ xuất hiện trên cơ sở dữ liệu đang có, và — nguy hiểm hơn — <code>POSTGRES_PASSWORD</code> cũng chỉ được đọc lúc khởi tạo, nên đổi nó trong <code>.env</code> rồi deploy lại <em>KHÔNG</em> đổi mật khẩu. Hãy dùng <code>ALTER USER … PASSWORD</code>, hoặc một migration, cho mọi thứ phải áp lên một cơ sở dữ liệu đã tồn tại.</div>

<h3>Vì sao "ready to accept connections" xuất hiện HAI lần</h3>
<p>Đọc mã tiến trình trong output ở trên: dòng "ready" đầu đến từ tiến trình <code>[42]</code>, dòng sau từ tiến trình <code>[1]</code>. Lần khởi động đầu, entrypoint của ảnh chạy <code>initdb</code> (tạo thư mục dữ liệu), rồi bật một máy chủ Postgres TẠM chỉ để chạy các script của bạn, tắt nó đi, và chỉ khi đó mới bật máy chủ thật làm PID 1. Máy chủ tạm cố ý chỉ nghe qua Unix socket (cổng giao tiếp dạng file trong máy) — dòng 270 của <code>/usr/local/bin/docker-entrypoint.sh</code> trong ảnh này thêm <code>-c listen_addresses=''</code>. Hai hệ quả thực tế:</p>
<ul>
<li>Trong lúc khởi tạo, không gì trên mạng kết nối vào được. Nếu API bật đúng lúc đó nó sẽ nhận "connection refused" — chính là thứ <code>condition: service_healthy</code> che chắn cho bạn.</li>
<li><code>pg_isready</code> không có <code>-h</code> cũng nói chuyện qua socket, nên về nguyên tắc nó có thể báo "ready" khi mới chỉ có máy chủ tạm. Trên stack này việc khởi tạo mất chưa tới một giây còn healthcheck đầu tiên chạy sau năm giây, nên chưa bao giờ thành chuyện; nếu script khởi tạo của bạn chậm (một bộ seed lớn trong <code>initdb.d</code>), hãy dùng <code>pg_isready -h 127.0.0.1 -U blog -d blog</code> — chỉ máy chủ thật, cái nghe TCP, mới trả lời được.</li>
</ul>
<p>Và đây là lần khởi động thứ hai của chính container đó — bằng chứng thư mục khởi tạo bị bỏ qua:</p>
<pre><code class="language-bash">docker compose restart db
docker compose logs db --no-log-prefix --since 20s | grep -E 'Skipping|starting'</code></pre>
<div class="out">PostgreSQL Database directory appears to contain a database; Skipping initialization
2026-09-24 02:19:20.518 +07 [1] LOG:  starting PostgreSQL 16.4 on aarch64-unknown-linux-musl, compiled by gcc (Alpine 13.2.1_git20240309) 13.2.1 20240309, 64-bit</div>

<h3>Chạy thử từng bước: đổi mật khẩu SAI cách, rồi ĐÚNG cách</h3>
${slide('dk-10', 10, 'Đổi POSTGRES_PASSWORD trong .env: DB phớt lờ, migrate chết, site 502')}
<p>Ô cảnh báo ở trên nói <code>POSTGRES_PASSWORD</code> chỉ được đọc một lần. Đây là hình dạng thật của chuyện đó trên stack bảy dịch vụ khi ai đó đổi nó trong <code>.env</code> — chẳng hạn vì lỡ commit mật khẩu cũ lên GitHub. <code>.env</code> chứa cả <code>POSTGRES_PASSWORD</code> (ảnh cơ sở dữ liệu đọc) lẫn <code>DATABASE_URL</code> (API, worker và migration đọc), và cả hai được đổi cùng lúc, đúng như bạn sẽ làm.</p>
<pre><code class="language-bash">sed -i '' 's/dk10-mat-khau-thu/dk10-mat-khau-MOI/g' .env     <span class="tok-comment"># Linux: sed -i 's/…/…/g' .env</span>
docker compose up -d
docker compose logs migrate --no-log-prefix | grep P1000
docker compose ps -a --format 'table {{.Service}}\\t{{.Status}}'
curl -s -o /dev/null -w '%{http_code}\\n' localhost:18100/api/v1/posts</code></pre>
<div class="out"> Container dk10-blog-db-1 Recreate
 Container dk10-blog-migrate-1 Recreate
 Container dk10-blog-api-1 Recreate
 Container dk10-blog-worker-1 Recreate
 …
 Container dk10-blog-migrate-1 Error service "migrate" didn't complete successfully: exit 1
service "migrate" didn't complete successfully: exit 1
Error: P1000: Authentication failed against database server at &#96;db&#96;, the provided database credentials for &#96;blog&#96; are not valid.
SERVICE   STATUS
api       Created
cache     Up 3 minutes (healthy)
db        Up 11 seconds (healthy)
migrate   Exited (1) Less than a second ago
nginx     Up 3 minutes (healthy)
web       Up 3 minutes (healthy)
worker    Created
502</div>
<p>Bốn chuyện đã xảy ra, theo đúng thứ tự này. Compose thấy môi trường của <code>db</code>, <code>migrate</code>, <code>api</code> và <code>worker</code> đã đổi nên tạo lại (recreate) cả bốn. Container <code>db</code> mới thấy thư mục dữ liệu đã có sẵn trong volume, bỏ qua khởi tạo — và bỏ qua luôn mật khẩu mới. <code>migrate</code> thử mật khẩu mới và nhận <code>P1000</code>. Thế là <code>api</code> và <code>worker</code> mới không bao giờ được bật: chúng nằm ở trạng thái <code>Created</code>. Nhưng container API <em>cũ</em> đã bị lượt recreate xoá mất rồi, nên nginx không còn gì phía sau <code>/api</code> và trả <code>502</code>. Vài giây sau <code>web</code> cũng chuyển <code>unhealthy</code>, vì healthcheck của nó gọi <code>/</code>, mà trang chủ lại kết xuất bằng cách gọi API.</p>
<p>Cách chữa là một câu SQL, chạy qua socket bên trong container — thứ mà ảnh chính thức tin cậy, nên không cần mật khẩu:</p>
<pre><code class="language-bash">docker compose exec db psql -U blog -c "ALTER USER blog PASSWORD 'dk10-mat-khau-MOI'"
docker compose up -d
curl -s -o /dev/null -w '%{http_code}\\n' localhost:18100/api/v1/posts</code></pre>
<div class="out">ALTER ROLE
 …
 Container dk10-blog-migrate-1 Exited
 Container dk10-blog-api-1 Started
 Container dk10-blog-api-1 Healthy
200</div>
<table>
<tr><th>Cách chữa hấp dẫn</th><th>Thật ra nó làm gì</th></tr>
<tr><td>Khởi động lại tất cả</td><td>Không gì cả. Volume vẫn giữ mã băm của mật khẩu cũ.</td></tr>
<tr><td><code>docker compose down -v</code> "cho sạch"</td><td>XOÁ cơ sở dữ liệu. Rồi khởi tạo chạy với mật khẩu mới — trên một DB rỗng.</td></tr>
<tr><td>Đổi <code>.env</code> về như cũ</td><td>Chạy được, và đưa cái mật khẩu đã lộ trở lại làm việc. Chỉ chấp nhận làm tạm trong lúc bạn chạy <code>ALTER USER</code>.</td></tr>
<tr><td><code>ALTER USER … PASSWORD</code> + <code>up -d</code></td><td>Đổi mật khẩu ở đúng nơi nó thật sự nằm. Dữ liệu còn nguyên.</td></tr>
</table>

<h3>Redis, với hai quyết định quan trọng</h3>
${slide('dk-10', 11, 'Redis: lưu lâu dài + maxmemory')}
<pre><code>  cache:
    image: redis:7.4-alpine
    command:
      - "redis-server"
      - "--appendonly"
      - "yes"                                     <span class="tok-comment"># AOF: bền, sống qua khởi động lại</span>
      - "--maxmemory"
      - "256mb"
      - "--maxmemory-policy"
      - "allkeys-lru"                             <span class="tok-comment"># đẩy bớt khoá, không bao giờ OOM</span>
      - "--save"
      - "300 10"
    volumes:
      - redisdata:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks: [private]
    restart: unless-stopped</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Lưu lâu dài: không</span><span class="lz-t">cache thuần, mất sạch khi khởi động lại</span><span class="lz-d">Đúng nếu Redis chỉ giữ dữ liệu suy ra được và tính lại được. Sai nếu nó giữ phiên đăng nhập — mọi người dùng bị đăng xuất mỗi lần deploy.</span></div>
  <div class="lz-step"><span class="lz-k">Lưu lâu dài: ảnh chụp RDB</span><span class="lz-t">--save "300 10"</span><span class="lz-d">Đổ dữ liệu theo thời điểm. Nhanh, gọn, và bạn mất mọi thứ ghi từ ảnh chụp gần nhất. Ổn với một cái cache mà bạn không muốn mất sạch.</span></div>
  <div class="lz-step"><span class="lz-k">Lưu lâu dài: AOF</span><span class="lz-t">--appendonly yes</span><span class="lz-d">Mọi lệnh ghi được nối vào một cuốn nhật ký. Chậm hơn chút, mất ít dữ liệu hơn nhiều. Lựa chọn đúng khi phiên đăng nhập hay hàng đợi nằm trong Redis.</span></div>
  <div class="lz-step"><span class="lz-k">maxmemory kèm một chính sách</span><span class="lz-t">--maxmemory 256mb --maxmemory-policy allkeys-lru</span><span class="lz-d">Không có đủ cả hai thì Redis phình tới khi container chạm hạn mức bộ nhớ và bộ giết OOM lấy nó đi. Có cả hai thì nó đẩy bớt những khoá lâu không dùng và tiếp tục phục vụ — một cái cache suy giảm thay vì một cái cache đã chết.</span></div>
</div>
<pre><code>docker compose exec cache redis-cli info memory | grep -E 'used_memory_human|maxmemory_policy'
docker compose exec cache redis-cli config get appendonly</code></pre>
<div class="out">used_memory_human:1.42M
maxmemory_policy:allkeys-lru
1) "appendonly"
2) "yes"</div>
<p><strong>Hai thiết lập đó làm gì khi đứng riêng — đo thật.</strong> Câu "không có đủ cả hai thì Redis phình tới khi bộ giết OOM lấy nó đi" đúng khi THIẾU <code>maxmemory</code>: mặc định của nó là <code>0</code>, tức không giới hạn, nên chỉ hạn mức bộ nhớ của container chặn được nó. Còn có <code>maxmemory</code> mà không có chính sách, thì chính sách mặc định là <code>noeviction</code> (không đẩy khoá nào) và Redis TỪ CHỐI lệnh ghi. Cả hai hành vi, trên một Redis 2 MB nhận sáu mươi giá trị 20 kB:</p>
<pre><code class="language-bash">docker run -d --name rd redis:7.4-alpine redis-server --maxmemory 2mb          <span class="tok-comment"># chính sách mặc định</span>
docker exec rd sh -c 'V=$(head -c 20000 /dev/zero | tr "\\0" x); for i in $(seq 1 60); do redis-cli set k$i $V; done | sort | uniq -c'
<span class="tok-comment"># làm lại với --maxmemory-policy allkeys-lru</span></code></pre>
<div class="out">noeviction:
     49 OK
     11 OOM command not allowed when used memory &gt; 'maxmemory'.
allkeys-lru:
     60 OK
evicted_keys:12</div>
<p>Với <code>noeviction</code>, lệnh ghi thứ 50 hỏng với một lỗi mà ứng dụng của bạn phải tự xử lý — đúng cho hàng đợi việc, nơi lặng lẽ đánh rơi một việc còn tệ hơn báo lỗi. Với <code>allkeys-lru</code>, mọi lệnh ghi đều thành công và Redis lặng lẽ bỏ mười hai khoá lâu không dùng nhất — đúng cho cache. Chọn theo mục đích; nếu một Redis làm cả hai việc, hãy cho hàng đợi một Redis riêng.</p>

<h3>Kết nối từ phía ứng dụng</h3>
<pre><code><span class="tok-comment"># .env — để ý TÊN MÁY là tên dịch vụ, không phải localhost</span>
POSTGRES_USER=blog
POSTGRES_PASSWORD=change-me-in-production
POSTGRES_DB=blog
DATABASE_URL=postgresql://blog:change-me-in-production@db:5432/blog?schema=public&amp;connection_limit=10
REDIS_URL=redis://cache:6379</code></pre>
<div class="callout"><strong><code>connection_limit</code> không phải lời khuyên tuỳ chọn trên một máy chủ nhỏ.</strong> Prisma mở một bể kết nối cho mỗi tiến trình; với một API, một worker và một container migration cùng kết nối, ba cái bể ở kích thước mặc định có thể một mình ăn hết <code>max_connections=100</code> — và rồi mọi yêu cầu chết với thông báo "too many clients". Hãy đặt nó tường minh, và đặt thấp: <code>10</code> cho mỗi dịch vụ đã là rộng rãi với một ứng dụng nhỏ, và còn chừa chỗ cho <code>psql</code> khi bạn cần vào xem gì đó.</div>

<h3>Nâng một phiên bản chính</h3>
${slide('dk-10', 12, 'Nâng 16 → 17: đổ ra, đổ lại')}
<pre><code><span class="tok-comment"># Postgres KHÔNG tự chuyển thư mục dữ liệu qua các phiên bản chính. Đổ ra, nâng, đổ lại.</span>
docker compose exec -T db pg_dumpall -U blog &gt; dump-before-17.sql
docker compose down
docker volume rm blog_pgdata                    <span class="tok-comment"># sau khi đã đổ ra, và sau khi đã KIỂM bản đổ đó</span>
sed -i 's/postgres:16.4-alpine/postgres:17.0-alpine/' compose.yaml
docker compose up -d db
docker compose exec -T db psql -U blog -d postgres &lt; dump-before-17.sql</code></pre>
<div class="out">ERROR:  role "blog" already exists
ALTER ROLE
…
ERROR:  database "blog" already exists
ALTER DATABASE
…
CREATE TABLE
ALTER TABLE
…</div>
<p>Đây là output thật của bước đổ lại khi khoá chạy đúng quy trình này (trên hai container thường, <code>docker exec -i dk10-pg16 pg_dumpall -U blog &gt; dump.sql</code> và <code>docker exec -i dk10-pg17 psql -U blog -d postgres &lt; dump.sql</code>; một bảng 1284 dòng trở về đầy đủ, kiểm bằng <code>select count(*)</code>). Bản cũ của bài in <code>pg_dumpall: 84MB written</code> và một cặp <code>CREATE ROLE</code> / <code>CREATE DATABASE</code> sạch sẽ; cả hai đều không có thật. <code>pg_dumpall</code> không in gì khi thành công (bản đổ ở đây nặng 19.695 byte), còn hai dòng <code>ERROR</code> là chuyện ĐƯỢC ĐOÁN TRƯỚC: container mới đã tự tạo role và cơ sở dữ liệu từ <code>POSTGRES_USER</code> và <code>POSTGRES_DB</code> lúc khởi tạo, và bản đổ cố tạo chúng lần nữa. Vô hại — nhưng bạn chỉ biết thế nếu đếm số dòng, chứ không phải lướt tìm chữ ERROR.</p>
<p>Nếu bỏ qua bước này thì kiểu hỏng rất rõ ràng và xảy ra ngay lúc khởi động: <code>FATAL:  database files are incompatible with server</code> kèm <code>DETAIL:  The data directory was initialized by PostgreSQL version 16, which is not compatible with this version 17.6.</code> (nguyên văn, khi chạy <code>postgres:17.6-alpine</code> trên một volume của bản 16; container thoát với mã 1). Không có gì bị hư hại, nhưng dịch vụ sẽ không khởi động cho tới khi bạn hoặc quay lại nhãn cũ, hoặc làm cho tử tế cái quy trình đổ-ra-đổ-lại, và đó là thời điểm rất tệ để mới ngồi đọc về nó. Đây chính là lý do phải ghim cả số hiệu phụ.</p>
<div class="callout warn"><strong>Postgres 18 đã DỜI chỗ cất dữ liệu — kiểm trước khi chép một file compose cũ.</strong> Từ các ảnh bản 18, <code>PGDATA</code> mặc định là <code>/var/lib/postgresql/18/docker</code> và <code>VOLUME</code> của ảnh là <code>/var/lib/postgresql</code>, để một lần <code>pg_upgrade</code> sau này giữ được hai bản cạnh nhau. Đo thật: <code>postgres:18-alpine</code> in <code>PGDATA=/var/lib/postgresql/18/docker</code>, và bật nó với volume gắn ở đường dẫn cũ <code>/var/lib/postgresql/data</code> — dòng mà mọi bài hướng dẫn viết cho bản 16 đều có — thì container từ chối khởi động với <code>Error: in 18+, these Docker images are configured to store database data in a format which is compatible with "pg_ctlcluster"…</code> và thoát mã 1. Với bản 18, gắn volume ở <code>/var/lib/postgresql</code> và bỏ dòng ghi đè <code>PGDATA</code>. Stack của chương này ở lại 16.4, có ghim, chính là để một thay đổi như thế chỉ tới khi bạn chọn nó.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm bạn lỡ đẩy file <code>.env</code> có mật khẩu cơ sở dữ liệu lên GitHub. Bạn đổi mật khẩu trong <code>.env</code>, deploy lại — và ứng dụng không đăng nhập nổi vào chính cơ sở dữ liệu của nó. Tái hiện chuyện đó trên một stack tí hon, rồi sửa mà không mất một dòng dữ liệu nào.</p><ol>
<li><code>mkdir -p ~/thu-docker/doi-mk &amp;&amp; cd ~/thu-docker/doi-mk</code>, lưu file bên dưới thành <code>compose.yaml</code>, và tạo mật khẩu cũ: <code>echo 'POSTGRES_PASSWORD=cu' &gt; .env</code>.</li>
<li>Bật cơ sở dữ liệu và kết nối QUA MẠNG như một ứng dụng: <code>docker compose up -d --wait</code>, rồi <code>docker compose run --rm app</code>. <code>app</code> là một trình khách psql chạy một lần, dùng mật khẩu lấy từ <code>.env</code>.</li>
<li>"Đổi" mật khẩu theo cách hấp dẫn: <code>sed -i '' 's/=cu/=moi/' .env</code> (Linux: <code>sed -i 's/=cu/=moi/' .env</code>), <code>docker compose up -d --wait</code>, rồi chạy lại <code>docker compose run --rm app</code>.</li>
<li>Sửa ở đúng nơi mật khẩu thật sự nằm: <code>docker compose exec db psql -U blog -c "ALTER USER blog PASSWORD 'moi'"</code>, rồi <code>docker compose run --rm app</code> thêm lần nữa.</li>
<li>Dọn dẹp: <code>docker compose down -v</code>.</li></ol>
<pre><code class="language-yaml">name: doi-mk
services:
  db:
    image: postgres:16.4-alpine
    environment:
      POSTGRES_USER: blog
      POSTGRES_PASSWORD: &#36;{POSTGRES_PASSWORD:?đặt POSTGRES_PASSWORD trong .env}
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U blog"]
      interval: 2s
  app:
    image: postgres:16.4-alpine
    command: ["psql", "postgresql://blog:&#36;{POSTGRES_PASSWORD}@db/blog", "-tAc", "select 'ket noi OK'"]
    profiles: [thu]
volumes:
  pgdata:</code></pre>
<div class="out">ket noi OK
 Container dk10-thu2-db-1 Recreate
 Container dk10-thu2-db-1 Healthy
psql: error: connection to server at "db" (172.27.0.2), port 5432 failed: FATAL:  password authentication failed for user "blog"
ALTER ROLE
ket noi OK</div>
<p>Output ghi trên máy Mac của khoá (ở đó project tên <code>dk10-thu2</code>). Để ý <code>app</code> CỐ Ý kết nối tới <code>db</code> qua mạng: một lệnh <code>psql</code> bên trong container <code>db</code> qua <code>127.0.0.1</code> được file <code>pg_hba.conf</code> mặc định của ảnh tin cậy và sẽ "chạy được" với bất kỳ mật khẩu nào — một phép thử đạt vì lý do sai.</p>
<p><strong>Đạt khi:</strong> bạn thấy <code>ket noi OK</code>, rồi <code>password authentication failed</code> sau khi đổi <code>.env</code> dù <code>db</code> vẫn báo <code>Healthy</code>, rồi lại <code>ket noi OK</code> sau <code>ALTER ROLE</code> — và không lúc nào bạn chạy <code>down -v</code> trước bước cuối.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">initdb (khởi tạo cơ sở dữ liệu)</span><span class="v">Lần tạo thư mục dữ liệu Postgres duy nhất. Ảnh chạy nó — cùng các script trong <code>initdb.d</code> — chỉ khi thư mục còn rỗng.</span></div>
  <div class="kv"><span class="k"><code>PGDATA</code> (thư mục dữ liệu)</span><span class="v">Nơi Postgres cất dữ liệu. Trỏ nó vào một thư mục con của volume; ở ảnh bản 18 mặc định đã dời sang <code>/var/lib/postgresql/18/docker</code>.</span></div>
  <div class="kv"><span class="k"><code>pg_isready</code> (hỏi sẵn sàng)</span><span class="v">Trình khách tí hon hỏi "đã nhận kết nối chưa?". Healthcheck quen thuộc của Postgres; thêm <code>-h 127.0.0.1</code> để thử qua TCP.</span></div>
  <div class="kv"><span class="k">AOF / RDB (nhật ký ghi / ảnh chụp)</span><span class="v">Hai cách Redis lưu xuống đĩa: ghi nối từng lệnh, hoặc chụp định kỳ. AOF mất chừng một giây khi sập, RDB mất mọi thứ từ lần chụp cuối.</span></div>
  <div class="kv"><span class="k">Eviction policy (chính sách đẩy khoá)</span><span class="v">Redis làm gì khi chạm <code>maxmemory</code>: <code>noeviction</code> từ chối ghi, <code>allkeys-lru</code> bỏ khoá lâu không dùng nhất.</span></div>
  <div class="kv"><span class="k">Major version (phiên bản chính)</span><span class="v">Số đầu tiên của Postgres (16, 17, 18). Thư mục dữ liệu không dùng chung qua các bản chính; phải đổ ra rồi đổ lại, hoặc dùng <code>pg_upgrade</code>.</span></div>
  <div class="kv"><span class="k"><code>pg_dumpall</code> (đổ toàn bộ)</span><span class="v">Xuất mọi cơ sở dữ liệu kèm role thành SQL. Thành công thì không in gì; hãy kiểm dung lượng file và, sau khi đổ lại, số dòng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi thứ ảnh làm lúc khởi tạo — <code>POSTGRES_PASSWORD</code>, <code>POSTGRES_USER</code>, <code>POSTGRES_DB</code>, <code>initdb.d</code> — chỉ xảy ra MỘT lần, trên thư mục dữ liệu rỗng.</li>
<li>Đổi mật khẩu trong <code>.env</code> làm compose tạo lại container, migration chết với <code>P1000</code>, và trang đứng ở 502; chữa bằng <code>ALTER USER</code>, không bao giờ bằng <code>down -v</code>.</li>
<li>Dòng "ready" đầu tiên trong log là máy chủ tạm chỉ nghe socket; cổng healthcheck là thứ giữ API khỏi đua với nó.</li>
<li>Chỉ có <code>maxmemory</code> thì Redis từ chối ghi (<code>noeviction</code>); thêm <code>allkeys-lru</code> cho cache, giữ <code>noeviction</code> cho hàng đợi.</li>
<li>Nâng bản chính Postgres là đổ ra → volume mới → đổ lại; hai lỗi <code>already exists</code> là bình thường, số dòng mới là bằng chứng.</li>
<li>Ghim số hiệu phụ: Postgres 17 từ chối thư mục của 16, còn Postgres 18 dời luôn chỗ cất dữ liệu.</li>
</ul>

<a class="link-card" href="https://hub.docker.com/_/postgres" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">postgres — tài liệu ảnh chính thức</span><span class="lc-sub">Mọi biến môi trường, hậu tố <code>_FILE</code> để đọc bí mật từ file, luật của thư mục khởi tạo, và những lưu ý về <code>PGDATA</code> với bind mount.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">Redis persistence</span><span class="lc-sub">RDB so với AOF giải thích cho tử tế, gồm cả việc mỗi cái mất gì khi sập và vì sao chạy cả hai là mặc định hợp lý cho mọi thứ không phải cache thuần.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/reference/eviction/" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">Chính sách đẩy khoá của Redis</span><span class="lc-sub">Cả tám chính sách kèm lý lẽ cho từng cái. <code>allkeys-lru</code> cho cache, <code>noeviction</code> cho hàng đợi nơi mất dữ liệu còn tệ hơn một cái lỗi.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng tầng dữ liệu</span><span class="lc-sub">Bài chấm điểm: viết dịch vụ db với healthcheck chạy được, chứng minh thư mục khởi tạo bị bỏ qua ở lần khởi động thứ hai, và chọn chính sách lưu lâu dài với chính sách đẩy khoá của Redis cho ba tình huống.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> đổi <code>POSTGRES_PASSWORD</code> trong <code>.env</code> rồi trông đợi một lượt deploy sẽ áp nó. Biến đó được đọc đúng một lần, lúc thư mục dữ liệu được khởi tạo; trên một volume đã có sẵn nó bị phớt lờ hoàn toàn. Ứng dụng khi đó xác thực hỏng với mật khẩu mới trong khi cơ sở dữ liệu vẫn giữ mật khẩu cũ, và cách chữa trông có vẻ hiển nhiên — <code>docker compose down -v</code> để "làm lại từ đầu" — thì XOÁ MẤT cơ sở dữ liệu. Cách chữa thật là một câu SQL: <code>docker compose exec db psql -U blog -c "ALTER USER blog PASSWORD 'mới'"</code>, rồi cập nhật <code>.env</code> với <code>DATABASE_URL</code> cho khớp và dựng lại API. Cũng luật chỉ-chạy-một-lần đó áp cho <code>POSTGRES_DB</code>, <code>POSTGRES_USER</code> và mọi thứ trong <code>/docker-entrypoint-initdb.d</code>.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> <code>/docker-entrypoint-initdb.d</code> và <code>POSTGRES_PASSWORD</code> chỉ có tác dụng khi thư mục dữ liệu còn rỗng — trên một volume đã có sẵn thì cả hai bị lặng lẽ phớt lờ. Hãy cho Redis cả <code>maxmemory</code> lẫn một <code>maxmemory-policy</code>, không thì nó phình tới khi bộ giết OOM lấy nó đi thay vì đẩy bớt khoá. Và hãy ghim số hiệu phụ của ảnh cơ sở dữ liệu: một cú nhảy phiên bản chính sẽ không chịu khởi động trên thư mục dữ liệu đang có, và nó sẽ xảy ra giữa lúc deploy.</p>
</div>
`,
    },
    /* ─────────────────────────── 10.3 ─────────────────────────── */
    {
      title: '10.3 — The API, the worker, the migration|||10.3 — API, worker, và migration',
      slug: 'dk-10-3-api-migration',
      type: 'LESSON',
      description: 'Dockerfile.backend nhiều tầng cho Node + Prisma, một ảnh ba câu lệnh, migration là một dịch vụ có cổng chặn, seed nằm sau profile, healthcheck không cần curl, và bẫy engine Prisma.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>The API, the worker, the migration</h2>
<p class="lead">One image, three roles. The API serves HTTP, the worker processes jobs, and the migration container runs once and exits — all from the same build, differing only in <code>command</code>. That is not a saving of disk space; it is a guarantee that the worker cannot be running last week's code.</p>

<h3>Dockerfile.backend</h3>
${slide('dk-10', 13, 'Dockerfile.backend: ba tầng, chỉ tầng cuối được ship')}
<pre><code><span class="tok-comment"># syntax=docker/dockerfile:1</span>
FROM node:22.11-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN --mount=type=cache,target=/root/.npm \\
    npm ci                                      <span class="tok-comment"># postinstall runs prisma generate</span>

FROM node:22.11-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build                                <span class="tok-comment"># tsc → dist/</span>
RUN npm prune --omit=dev                         <span class="tok-comment"># drop devDependencies from node_modules</span>

FROM node:22.11-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
RUN apk add --no-cache tini
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/prisma ./prisma
COPY --from=build --chown=node:node /app/package.json ./
USER node
EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/index.js"]</code></pre>
<pre><code>docker compose build api &amp;&amp; docker images ghcr.io/me/api --format '{{.Tag}}\\t{{.Size}}'</code></pre>
<div class="out">1.4.2	214MB</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>COPY prisma</code> before <code>npm ci</code></span><span class="v">Prisma's postinstall reads <code>schema.prisma</code> to generate the client. Without the schema present, <code>npm ci</code> succeeds and the client is missing at runtime — an error that only appears when the first query runs.</span></div>
  <div class="kv"><span class="k">Pin the Node minor version</span><span class="v"><code>node:22.11-alpine</code>. A silent jump to a new minor can change a native module's ABI, and you find out in production rather than in CI.</span></div>
  <div class="kv"><span class="k"><code>npm prune --omit=dev</code></span><span class="v">Cheaper than a second <code>npm ci --omit=dev</code> and it keeps the cached layer. TypeScript, eslint and the test runner do not belong in the shipped image.</span></div>
  <div class="kv"><span class="k"><code>tini</code> as ENTRYPOINT</span><span class="v">Node as PID 1 does not reap zombies and handles signals oddly (Lesson 1.3). <code>tini</code> is 10KB and makes <code>docker stop</code> behave.</span></div>
  <div class="kv"><span class="k"><code>USER node</code> last</span><span class="v">After every <code>COPY --chown=node:node</code>, so the files are owned correctly and the process still cannot write outside them (Lesson 6.4).</span></div>
</div>
<div class="callout warn"><strong>The Prisma engine has to match the base image's libc.</strong> Alpine is musl, Debian-based images are glibc, and a prebuilt engine for one does not load on the other. This is the exact failure this project shipped: a build that used the default <code>Dockerfile</code> instead of <code>Dockerfile.backend</code> put a <code>debian-openssl-3.0.x</code> engine into an Alpine image, the build was green, the push was green, and the API returned 502 for seven minutes while the container restarted in a loop. Declare it explicitly and verify it starts:
<pre><code><span class="tok-comment"># prisma/schema.prisma</span>
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
}</code></pre>
<pre><code>docker run --rm ghcr.io/me/api:1.4.2 sh -c 'ls node_modules/.prisma/client/*.node; node -e "require(\\"@prisma/client\\"); console.log(\\"client loads\\")"'</code></pre>
<div class="out">node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node
client loads</div></div>

<h3>Run it step by step: build the image and look inside before you trust it</h3>
${slide('dk-10', 15, 'Engine Prisma phải khớp libc VÀ kiến trúc của ảnh chạy')}
<p>The course built exactly this Dockerfile for a small Express + Prisma 5.22 API (TypeScript, one <code>Post</code> and one <code>Job</code> model) on a Mac M1. Four commands tell you whether the image is what you think it is — run them after every change to the Dockerfile, not after the deploy fails.</p>
<pre><code class="language-bash">docker compose build api
docker images dk10-api
docker compose exec api sh -c 'ls node_modules/.prisma/client/*.node; uname -m; ls node_modules/.bin'
docker compose exec api ps -o pid,user,args</code></pre>
<div class="out">IMAGE            ID             DISK USAGE   CONTENT SIZE   EXTRA
dk10-api:1.0.0   763bef269d4d        392MB          107MB
node_modules/.prisma/client/libquery_engine-linux-musl-arm64-openssl-3.0.x.so.node
node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node
aarch64
mime
prisma
PID   USER     COMMAND
    1 node     /sbin/tini -- node dist/index.js
    7 node     node dist/index.js</div>
<table>
<tr><th>Line</th><th>What to conclude</th></tr>
<tr><td><code>392MB</code> / <code>107MB</code></td><td>Disk usage versus compressed download (Chapter 1, Docker 29 columns). 121 MB of that is <code>node_modules</code> — <code>docker history dk10-api:1.0.0</code> shows it as the biggest layer.</td></tr>
<tr><td>Two engine files</td><td><code>native</code> in <code>binaryTargets</code> means "the platform <code>npm ci</code> ran on": here Alpine on arm64, hence <code>linux-musl-arm64-…</code>. The second file, <code>linux-musl-openssl-3.0.x</code>, is the <strong>amd64</strong> Alpine engine — the one an amd64 VPS needs. The earlier sample output with only that file is what an amd64 machine prints.</td></tr>
<tr><td><code>ls node_modules/.bin</code> still lists <code>prisma</code></td><td>The Prisma CLI is a <code>devDependency</code>, yet <code>npm prune --omit=dev</code> kept it, because <code>@prisma/client</code> declares it as a peer dependency. Without that, <code>npx prisma migrate deploy</code> in the <code>migrate</code> service would try to download Prisma from npm — from a network with no internet. Check it; if your CLI is missing, move <code>prisma</code> to <code>dependencies</code>.</td></tr>
<tr><td>PID 1 is <code>tini</code></td><td>The <code>ENTRYPOINT</code> worked: tini is PID 1 and forwards <code>SIGTERM</code> to node (PID 7), so <code>docker stop</code> takes milliseconds, not ten seconds (Lesson 1.3).</td></tr>
</table>
<p>Now reproduce the libc incident on purpose. The only change is the base of the first two stages: <code>FROM node:22.11-bookworm-slim AS deps</code> and <code>… AS build</code> (Debian, glibc), while <code>production</code> stays on Alpine (musl) — the same shape as a build that picked up the wrong Dockerfile.</p>
<pre><code class="language-bash">docker build -f Dockerfile.sai -t dk10-api:sai .
docker run --rm dk10-api:sai sh -c 'ls node_modules/.prisma/client/*.node; node -e "…new PrismaClient().\$connect()…"'</code></pre>
<div class="out">node_modules/.prisma/client/libquery_engine-linux-arm64-openssl-1.1.x.so.node
node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node
Prisma Client could not locate the Query Engine for runtime "linux-musl-arm64-openssl-3.0.x".

This happened because Prisma Client was generated for "linux-arm64-openssl-1.1.x", but the actual deployment required "linux-musl-arm64-openssl-3.0.x".
Add "linux-musl-arm64-openssl-3.0.x" to &#96;binaryTargets&#96; in the "schema.prisma" file and run &#96;prisma generate&#96; after saving it:</div>
<p>The build was green. Two separate mistakes are visible in the output. The engine was generated for Debian (glibc) while the image runs Alpine (musl). And it was generated for <code>openssl-1.1.x</code> because the slim Debian image has no OpenSSL installed, so Prisma could not detect the version and fell back to a guess. The fix is the one the lesson already gives — all three stages on the same base — and the check is the one above: list the <code>.node</code> files and make one real query inside the image before you push it.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">api · node dist/index.js</span><span class="lz-lnote">The default CMD. Serves HTTP on 3000, on both networks, with a healthcheck that touches Postgres and Redis.</span></div>
  <div class="lz-layer"><span class="lz-lname">worker · node dist/worker.js</span><span class="lz-lnote">Same image, different command. Private network only — it has no HTTP surface and nothing needs to reach it.</span></div>
  <div class="lz-layer"><span class="lz-lname">migrate · npx prisma migrate deploy</span><span class="lz-lnote">Same image again. Runs once, exits 0, and is the gate the other two wait on. <code>restart: "no"</code>, because exiting is its job.</span></div>
  <div class="lz-layer"><span class="lz-lname">seed · npx prisma db seed</span><span class="lz-lnote">Same image, behind a profile. Never runs on a production deploy; invoked deliberately with <code>compose run --rm seed</code>.</span></div>
</div>
<h3>Three services from one image</h3>
${slide('dk-10', 14, 'Một ảnh, bốn vai — khác nhau đúng một dòng command')}
<pre><code>  api:
    image: ghcr.io/me/api:&#36;{TAG:-latest}
    build: { context: ., dockerfile: Dockerfile.backend, target: production }
    env_file: [.env]
    environment:
      NODE_ENV: production
      PORT: "3000"
    depends_on:
      db:      { condition: service_healthy }
      cache:   { condition: service_healthy }
      migrate: { condition: service_completed_successfully }
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://127.0.0.1:3000/health').then(r=&gt;process.exit(r.ok?0:1)).catch(()=&gt;process.exit(1))"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 40s
    networks: [public, private]
    restart: unless-stopped

  worker:
    image: ghcr.io/me/api:&#36;{TAG:-latest}
    command: ["node", "dist/worker.js"]
    env_file: [.env]
    depends_on:
      migrate: { condition: service_completed_successfully }
    networks: [private]
    restart: unless-stopped

  migrate:
    image: ghcr.io/me/api:&#36;{TAG:-latest}
    command: ["npx", "prisma", "migrate", "deploy"]
    env_file: [.env]
    depends_on:
      db: { condition: service_healthy }
    networks: [private]
    restart: "no"</code></pre>
<pre><code>docker compose up -d 2&gt;&amp;1 | grep -E 'Started|Healthy|Exited'</code></pre>
<div class="out"> Container dk10-blog-cache-1 Started
 Container dk10-blog-db-1 Started
 Container dk10-blog-db-1 Healthy
 Container dk10-blog-migrate-1 Started
 Container dk10-blog-cache-1 Healthy
 Container dk10-blog-cache-1 Healthy
 Container dk10-blog-db-1 Healthy
 Container dk10-blog-migrate-1 Exited
 Container dk10-blog-migrate-1 Exited
 Container dk10-blog-api-1 Started
 Container dk10-blog-worker-1 Started
 Container dk10-blog-api-1 Healthy
 Container dk10-blog-web-1 Started
 Container dk10-blog-api-1 Healthy
 Container dk10-blog-web-1 Healthy
 Container dk10-blog-nginx-1 Started</div>
<p>Real output from the course's stack with Compose v5.5.1. An earlier version of this lesson showed six tidy lines with a check mark and a duration each; Compose v5 printing to a pipe does not produce that. What it does print is every state change, and some appear twice (<code>Healthy</code>, <code>Exited</code>) because two dependants were each waiting for the same service. Read the order, not the count: <code>db Healthy</code> → <code>migrate Started</code> → <code>migrate Exited</code> → <code>api</code> and <code>worker Started</code>.</p>
<div class="callout ok"><strong>That ordering is the whole point of the chapter's third decision.</strong> The database becomes healthy, the migration runs to completion and exits 0, and only then do the API and worker start — against a schema they can rely on. If <code>prisma migrate deploy</code> exits non-zero, compose stops and reports it; nothing starts against a half-migrated database.</div>

<h3>When the migration fails: what the gate protects, and what it does not</h3>
${slide('dk-10', 16, 'Migration hỏng: cổng chặn giữ schema, KHÔNG giữ site')}
<p>The callout above is true, and it is easy to read more into it than it says. The course broke the migration on purpose (Lesson 10.2 showed the same shape with a wrong password) and watched what <code>docker compose up -d</code> did. Compose works in two phases: first it <em>recreates</em> every container whose image or configuration changed — which removes the old container — and only then starts them in dependency order. So when <code>migrate</code> exits non-zero:</p>
<ul>
<li>the new <code>api</code> is never started (<code>Created</code>): nothing runs against a half-migrated schema — the promise holds;</li>
<li>the <em>old</em> <code>api</code> is already gone: nginx answers <strong>502</strong> until someone intervenes — the promise never covered that.</li>
</ul>
<p>The fix is to split the deploy: run the migration as its own step, <em>before</em> <code>up</code> touches the running containers. If it fails, the old version keeps serving. Measured on a miniature of the same stack (a Postgres, a one-shot <code>psql</code> migration and an nginx standing in for the API, <code>depends_on: migrate: service_completed_successfully</code>), adding a <code>NOT NULL</code> column to a table that already has rows:</p>
<pre><code class="language-bash"><span class="tok-comment"># cách 1: up thẳng</span>
docker compose up -d
docker compose ps -a --format 'table {{.Service}}\\t{{.Status}}'; curl -s -o /dev/null -w 'api: %{http_code}\\n' localhost:18102
<span class="tok-comment"># cách 2: migrate riêng trước</span>
docker compose run --rm migrate; curl -s -o /dev/null -w 'api: %{http_code}\\n' localhost:18102</code></pre>
<div class="out"> Container dk10-thu3-api-1 Recreate
 Container dk10-thu3-api-1 Recreated
 Container dk10-thu3-migrate-1 Started
 Container dk10-thu3-migrate-1 Error service "migrate" didn't complete successfully: exit 3
psql:/m/all.sql:3: ERROR:  column "slug" of relation "post" contains null values
SERVICE   STATUS
api       Created
db        Up 12 seconds (healthy)
migrate   Exited (3) Less than a second ago
api: 000
…
psql:/m/all.sql:3: ERROR:  column "slug" of relation "post" contains null values
api: 200</div>
<p><code>000</code> is curl's way of saying "no HTTP answer at all" — nothing listens on the port any more. After the same failure through <code>run --rm migrate</code>, the running API was never touched and still answered <code>200</code>. (psql exits with code 3 when a script stops on an error under <code>ON_ERROR_STOP=1</code>; Prisma exits with 1.)</p>

<h3>P3018, then P3009: a failed Prisma migration blocks every later deploy</h3>
${slide('dk-10', 17, 'P3018 rồi P3009: một migration hỏng chặn mọi lần deploy sau')}
<p>With Prisma there is a second consequence. <code>prisma migrate deploy</code> records every migration it starts in a table called <code>_prisma_migrations</code>. When one fails, the row stays there with no finish time, and from then on Prisma refuses to apply anything. On the course's stack, with a migration that adds <code>"slug" TEXT NOT NULL</code> to a table with three rows:</p>
<pre><code class="language-bash">TAG=1.0.1 docker compose run --rm migrate          <span class="tok-comment"># lần 1</span>
TAG=1.0.1 docker compose run --rm migrate          <span class="tok-comment"># lần 2, không sửa gì</span>
docker compose exec db psql -U blog -c 'select migration_name, finished_at is not null as xong, rolled_back_at is not null as da_lui from _prisma_migrations order by started_at'</code></pre>
<div class="out">Applying migration &#96;20260924100000_add_slug&#96;
Error: P3018

A migration failed to apply. New migrations cannot be applied before the error is recovered from. …
Migration name: 20260924100000_add_slug
Database error code: 23502
Database error:
ERROR: column "slug" of relation "Post" contains null values
…
Error: P3009
migrate found failed migrations in the target database, new migrations will not be applied. …
The &#96;20260924100000_add_slug&#96; migration started at 2026-09-23 19:22:04.129831 UTC failed
     migration_name      | xong | da_lui
-------------------------+------+--------
 20260924090000_init     | t    | f
 20260924100000_add_slug | f    | f</div>
<p>The recovery the course used, in order — and on a production database, step 1 is "stop and tell whoever owns it", not "type faster":</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Find out how far it got</span><span class="lz-t">\\d "Post" in psql, _prisma_migrations</span><span class="lz-d">Here the very first statement failed, so nothing was applied. If a migration died halfway, marking it rolled back would lie to Prisma about the schema.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Tell Prisma it was rolled back</span><span class="lz-t">… run --rm migrate npx prisma migrate resolve --rolled-back 20260924100000_add_slug</span><span class="lz-d">Output: <code>Migration 20260924100000_add_slug marked as rolled back.</code> Only after step 1 says nothing was applied.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Write a migration that can succeed</span><span class="lz-t">add nullable → UPDATE → SET NOT NULL</span><span class="lz-d"><code>ALTER TABLE "Post" ADD COLUMN "slug" TEXT;</code>, <code>UPDATE "Post" SET "slug" = 'bai-' || "id";</code>, <code>ALTER TABLE "Post" ALTER COLUMN "slug" SET NOT NULL;</code>, then the unique index. New folder name, never edit the failed one.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Build, migrate, then up</span><span class="lz-t">TAG=1.0.2 … build api → run --rm migrate → up -d</span><span class="lz-d"><code>All migrations have been successfully applied.</code> Then <code>up -d</code> recreates api, worker and web on the new image.</span></div>
</div>

<h3>The healthcheck that works in a slim image</h3>
<pre><code><span class="tok-comment"># The endpoint it calls — cheap, and it actually checks the dependencies</span>
app.get('/health', async (_req, res) =&gt; {
  try {
    await prisma.\$queryRaw&#96;SELECT 1&#96;;
    await redis.ping();
    res.json({ ok: true, version: process.env.TAG ?? 'dev' });
  } catch (err) {
    res.status(503).json({ ok: false, error: String(err) });
  }
});</code></pre>
<pre><code>docker compose exec api node -e "fetch('http://127.0.0.1:3000/health').then(r=&gt;r.json()).then(console.log)"</code></pre>
<div class="out">{ ok: true, version: '1.4.2' }</div>
<p>Two design points. The image has no <code>curl</code> and does not need one — <code>node -e</code> is already there. And the endpoint touches Postgres and Redis, so an <code>(unhealthy)</code> status means "this instance cannot serve requests", not merely "the process is alive". A health endpoint that returns 200 unconditionally tells you nothing you did not already know from the container being up.</p>

<h3>Seeds, behind a profile</h3>
${slide('dk-10', 18, 'Seed sau profile — và cái bẫy tsx đã bị prune')}
<pre><code>  seed:
    image: ghcr.io/me/api:&#36;{TAG:-latest}
    command: ["npx", "prisma", "db", "seed"]
    env_file: [.env]
    depends_on:
      migrate: { condition: service_completed_successfully }
    profiles: [seed]
    networks: [private]
    restart: "no"</code></pre>
<pre><code>docker compose run --rm seed</code></pre>
<div class="out">Running seed command &#96;tsx prisma/seed.ts&#96; ...

An error occurred while running the seed command:
Error: Command failed with ENOENT: tsx prisma/seed.ts
spawn tsx ENOENT</div>
<p>That is what this exact setup really prints — the course ran it. An earlier version of this lesson showed a successful seed here, which cannot happen: <code>package.json</code> says <code>"prisma": { "seed": "tsx prisma/seed.ts" }</code>, <code>tsx</code> is a <code>devDependency</code>, and <code>npm prune --omit=dev</code> in the Dockerfile removed it. Two ways out: install <code>tsx</code> as a normal dependency (the image grows), or — better — move the seed into <code>src/seed.ts</code> so that <code>tsc</code> compiles it into <code>dist/seed.js</code>, and set <code>"seed": "node dist/seed.js"</code>:</p>
<pre><code class="language-bash">docker compose build api &amp;&amp; docker compose run --rm seed</code></pre>
<div class="out">Running seed command &#96;node dist/seed.js&#96; ...
seeded 3 posts

🌱  The seed command has been executed.</div>
<p>The move has a bonus that answers the callout below directly. Once the seed lives in <code>src/</code>, the main <code>tsconfig.json</code> type-checks it. When the course then added a required <code>slug</code> column to the schema, the <em>build</em> stopped — on the laptop, not in production:</p>
<div class="out">src/seed.ts(5,5): error TS2741: Property 'slug' is missing in type '{ title: string; }' but required in type 'PostCreateManyInput'.</div>

<div class="callout warn"><strong>Seeds are the one place a type error can pass every check and still break production.</strong> The main <code>tsconfig.json</code> has <code>rootDir: "./src"</code>, so <code>prisma/**</code> cannot be in its <code>include</code> — which means <code>tsc --noEmit</code> never looks at <code>seed.ts</code>. This project renamed a <code>ContentType</code> enum value, passed the entire pre-push checklist, and still broke the seed in production, because <code>seed.ts</code> carried a hand-written copy of the union and type-checked against itself. Import enums from <code>@prisma/client</code> rather than re-declaring them, keep a separate <code>tsconfig.seed.json</code>, and run the seed for real whenever the schema changes — reading it is not enough.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate adds a required column to a table that already has data and deploys with a plain <code>docker compose up -d</code>. The migration fails and the whole site goes down. Rebuild that failure on a miniature — no Prisma needed, just Postgres and <code>psql</code> — then deploy the same change the safe way.</p><ol>
<li><code>mkdir -p ~/thu-docker/mig/migrations &amp;&amp; cd ~/thu-docker/mig</code>, save the file below as <code>compose.yaml</code>, and create <code>migrations/all.sql</code> with two lines: <code>CREATE TABLE IF NOT EXISTS post (id serial PRIMARY KEY, title text NOT NULL);</code> and <code>INSERT INTO post (title) SELECT 'bai dau tien' WHERE NOT EXISTS (SELECT 1 FROM post);</code>. Run <code>docker compose up -d</code> and <code>curl -s -o /dev/null -w 'api: %{http_code}\\n' localhost:18102</code>.</li>
<li>Break it the teammate's way: append <code>ALTER TABLE post ADD COLUMN IF NOT EXISTS slug text NOT NULL;</code> to <code>all.sql</code>, change <code>VERSION: "1"</code> to <code>"2"</code> (a "new release"), <code>docker compose up -d</code>, then <code>docker compose ps -a</code> and the same <code>curl</code>.</li>
<li>Restore service: delete the <code>slug</code> line, <code>docker compose up -d</code>, check <code>api: 200</code>.</li>
<li>Now the safe way: add the bad line again, bump <code>VERSION</code> to <code>"3"</code>, and run ONLY <code>docker compose run --rm migrate</code>, then the <code>curl</code>.</li>
<li>Fix the migration (replace the bad line with the three below), <code>docker compose run --rm migrate</code>, then <code>docker compose up -d</code>. Clean up with <code>docker compose down -v</code>.</li></ol>
<pre><code class="language-yaml">name: mig
services:
  db:
    image: postgres:16.4-alpine
    environment: { POSTGRES_USER: blog, POSTGRES_PASSWORD: thu }
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck: { test: ["CMD-SHELL", "pg_isready -U blog"], interval: 2s }
  migrate:
    image: postgres:16.4-alpine
    environment: { PGPASSWORD: thu }
    command: ["psql", "-v", "ON_ERROR_STOP=1", "-h", "db", "-U", "blog", "-d", "blog", "-f", "/m/all.sql"]
    volumes: ["./migrations:/m:ro"]
    depends_on: { db: { condition: service_healthy } }
    restart: "no"
  api:
    image: nginx:1.27-alpine
    environment: { VERSION: "1" }
    ports: ["127.0.0.1:18102:80"]
    depends_on: { migrate: { condition: service_completed_successfully } }
volumes:
  pgdata:</code></pre>
<pre><code class="language-sql">ALTER TABLE post ADD COLUMN IF NOT EXISTS slug text;
UPDATE post SET slug = 'bai-' || id WHERE slug IS NULL;
ALTER TABLE post ALTER COLUMN slug SET NOT NULL;</code></pre>
<div class="out">api: 200
 Container dk10-thu3-migrate-1 Error service "migrate" didn't complete successfully: exit 3
api       Created
api: 000
…
psql:/m/all.sql:3: ERROR:  column "slug" of relation "post" contains null values
api: 200
…
ALTER TABLE
UPDATE 1
ALTER TABLE
api: 200</div>
<p>Output recorded on the course's Mac (project <code>dk10-thu3</code>). The <code>api</code> is an nginx stand-in on purpose: the lesson is about the order compose does things in, which is the same for any image.</p>
<p><strong>Done when:</strong> step 2 gives you <code>api Created</code> and <code>api: 000</code>, step 4 fails the migration while <code>curl</code> still answers <code>200</code>, and step 5 ends with <code>UPDATE 1</code> and <code>api: 200</code> — and you can say why step 2 took the site down although "nothing started against a half-migrated database".</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Multi-stage build</span><span class="v">A Dockerfile with several <code>FROM</code>s; only the last stage is shipped, the others just produce files for it.</span></div>
  <div class="kv"><span class="k">Query engine / <code>binaryTargets</code></span><span class="v">Prisma's native library, built per OS, libc and CPU. <code>binaryTargets</code> lists which ones to download at generate time.</span></div>
  <div class="kv"><span class="k">musl / glibc</span><span class="v">The two C libraries of Linux: Alpine uses musl, Debian and Ubuntu use glibc. Native modules built for one do not load on the other.</span></div>
  <div class="kv"><span class="k">Migration gate</span><span class="v">A one-shot <code>migrate</code> service plus <code>service_completed_successfully</code>: dependants start only after it exits 0.</span></div>
  <div class="kv"><span class="k">Recreate</span><span class="v">What compose does when a service's image or config changed: remove the old container, create a new one — before any dependency check.</span></div>
  <div class="kv"><span class="k"><code>_prisma_migrations</code></span><span class="v">Prisma's bookkeeping table; a row without <code>finished_at</code> is a failed migration and blocks the next deploy with P3009.</span></div>
  <div class="kv"><span class="k"><code>npm prune --omit=dev</code></span><span class="v">Removes devDependencies from <code>node_modules</code> — including tools such as <code>tsx</code> your runtime commands may still call.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>One image with several commands guarantees api, worker, migrate and seed run the same code.</li>
<li>Look inside every new image: the <code>.node</code> engine files, <code>node_modules/.bin</code>, and who is PID 1.</li>
<li>Build and run stages must share a base: a glibc-built Prisma engine in an Alpine image fails at the first query while the build stays green.</li>
<li><code>service_completed_successfully</code> keeps the schema safe, not the site: <code>up -d</code> removes the old api before the migration runs.</li>
<li>Deploy as <code>run --rm migrate</code> first, then <code>up -d</code>; a failed Prisma migration must be investigated and resolved before P3009 lets anything through.</li>
<li>Anything a runtime command needs must survive <code>npm prune</code>; compiling the seed into <code>dist/</code> also makes <code>tsc</code> check it.</li>
</ul>

<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/deployment/deploy-prisma" target="_blank" rel="noopener">
  <span class="lc-ico">🔺</span>
  <span class="lc-body"><span class="lc-title">Prisma — deployment and binary targets</span><span class="lc-sub">Why the query engine is platform-specific, the complete list of <code>binaryTargets</code>, and the musl versus glibc distinction that decides whether your container starts.</span></span>
</a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">prisma migrate deploy versus dev</span><span class="lc-sub"><code>deploy</code> applies pending migrations and never creates or resets anything — the only one that belongs in a container. <code>dev</code> needs a shadow database and is a developer command.</span></span>
</a>
<a class="link-card" href="https://github.com/krallin/tini" target="_blank" rel="noopener">
  <span class="lc-ico">🧷</span>
  <span class="lc-body"><span class="lc-title">tini</span><span class="lc-sub">The 10KB init that reaps zombies and forwards signals. The README explains the PID 1 problem better than most, and <code>--init</code> ships a copy of it with Docker itself.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build the application tier</span><span class="lc-sub">Graded exercises: write a multi-stage Dockerfile for a Node API, run three services from one image, gate the API behind a migration, and write a healthcheck for an image with no curl.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> running migrations from the API's entrypoint instead of a separate service. It looks tidier and it fails in two ways that a migration service does not. First, if you ever run more than one API replica, every replica races to apply the same migration — Prisma's advisory lock usually saves you, and "usually" is doing real work in that sentence. Second, a failed migration becomes a crash-looping API rather than a clear stop: the container restarts, retries the migration, fails again, and your logs fill with the same error while the deploy reports success. A dedicated <code>migrate</code> service with <code>restart: "no"</code> and <code>service_completed_successfully</code> gives you one run, one clear exit code, and a deploy that stops when the schema change fails.</div>
<p class="note-ct"><strong>Three things to remember.</strong> One image with three commands guarantees the API, worker and migration are the same code — build once, differ only in <code>command</code>. Migrations belong in their own service with <code>restart: "no"</code>, gated by <code>service_completed_successfully</code>, never in an entrypoint. And native modules bind to the base image's libc: declare Prisma's <code>binaryTargets</code>, and verify the image actually starts before you promote it — a green build is not a running container.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>API, worker, và migration</h2>
<p class="lead">Một cái ảnh, ba vai. API phục vụ HTTP, worker xử lý việc chạy nền, và container migration chạy một lần rồi thoát — tất cả từ cùng một lượt dựng, chỉ khác nhau ở <code>command</code>. Đó không phải là tiết kiệm dung lượng đĩa; đó là bảo đảm rằng worker không thể đang chạy mã của tuần trước.</p>

<h3>Dockerfile.backend</h3>
${slide('dk-10', 13, 'Dockerfile.backend: ba tầng, chỉ tầng cuối được ship')}
<pre><code><span class="tok-comment"># syntax=docker/dockerfile:1</span>
FROM node:22.11-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN --mount=type=cache,target=/root/.npm \\
    npm ci                                      <span class="tok-comment"># postinstall chạy prisma generate</span>

FROM node:22.11-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build                                <span class="tok-comment"># tsc → dist/</span>
RUN npm prune --omit=dev                         <span class="tok-comment"># bỏ devDependencies khỏi node_modules</span>

FROM node:22.11-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
RUN apk add --no-cache tini
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/prisma ./prisma
COPY --from=build --chown=node:node /app/package.json ./
USER node
EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/index.js"]</code></pre>
<pre><code>docker compose build api &amp;&amp; docker images ghcr.io/me/api --format '{{.Tag}}\\t{{.Size}}'</code></pre>
<div class="out">1.4.2	214MB</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>COPY prisma</code> TRƯỚC <code>npm ci</code></span><span class="v">Postinstall của Prisma đọc <code>schema.prisma</code> để sinh ra client. Không có schema thì <code>npm ci</code> vẫn thành công còn client thì thiếu lúc chạy — một lỗi chỉ lộ ra khi truy vấn đầu tiên chạy.</span></div>
  <div class="kv"><span class="k">Ghim số hiệu phụ của Node</span><span class="v"><code>node:22.11-alpine</code>. Một cú nhảy lặng lẽ sang bản phụ mới có thể đổi ABI của một module gốc, và bạn biết chuyện đó trên production chứ không phải trong CI.</span></div>
  <div class="kv"><span class="k"><code>npm prune --omit=dev</code></span><span class="v">Rẻ hơn chạy thêm một lượt <code>npm ci --omit=dev</code> và nó giữ được lớp đã lưu đệm. TypeScript, eslint và bộ chạy kiểm thử không thuộc về cái ảnh đem đi.</span></div>
  <div class="kv"><span class="k"><code>tini</code> làm ENTRYPOINT</span><span class="v">Node ở vị trí PID 1 không thu dọn tiến trình mồ côi và xử lý tín hiệu một cách kỳ lạ (Bài 1.3). <code>tini</code> nặng 10KB và làm cho <code>docker stop</code> hành xử đúng.</span></div>
  <div class="kv"><span class="k"><code>USER node</code> đặt cuối</span><span class="v">Sau mọi lệnh <code>COPY --chown=node:node</code>, để file thuộc quyền sở hữu đúng mà tiến trình vẫn không ghi được ra ngoài chúng (Bài 6.4).</span></div>
</div>
<div class="callout warn"><strong>Engine của Prisma phải KHỚP với libc của ảnh nền.</strong> Alpine là musl, ảnh nền Debian là glibc, và một engine dựng sẵn cho bên này không nạp được ở bên kia. Đây đúng là sự cố mà dự án này từng đẩy lên: một lượt dựng dùng <code>Dockerfile</code> mặc định thay vì <code>Dockerfile.backend</code> đã nhét một engine <code>debian-openssl-3.0.x</code> vào một cái ảnh Alpine, dựng xanh, đẩy xanh, rồi API trả 502 suốt bảy phút trong khi container restart thành vòng lặp. Hãy khai báo nó tường minh và kiểm nó khởi động được:
<pre><code><span class="tok-comment"># prisma/schema.prisma</span>
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
}</code></pre>
<pre><code>docker run --rm ghcr.io/me/api:1.4.2 sh -c 'ls node_modules/.prisma/client/*.node; node -e "require(\\"@prisma/client\\"); console.log(\\"client loads\\")"'</code></pre>
<div class="out">node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node
client loads</div></div>

<h3>Chạy thử từng bước: dựng ảnh và nhìn vào bên trong trước khi tin nó</h3>
${slide('dk-10', 15, 'Engine Prisma phải khớp libc VÀ kiến trúc của ảnh chạy')}
<p>Khoá đã dựng đúng Dockerfile này cho một API Express + Prisma 5.22 nhỏ (TypeScript, một model <code>Post</code> và một model <code>Job</code>) trên máy Mac M1. Bốn lệnh cho bạn biết cái ảnh có đúng như bạn nghĩ không — chạy chúng sau MỖI lần sửa Dockerfile, đừng đợi tới khi deploy hỏng.</p>
<pre><code class="language-bash">docker compose build api
docker images dk10-api
docker compose exec api sh -c 'ls node_modules/.prisma/client/*.node; uname -m; ls node_modules/.bin'
docker compose exec api ps -o pid,user,args</code></pre>
<div class="out">IMAGE            ID             DISK USAGE   CONTENT SIZE   EXTRA
dk10-api:1.0.0   763bef269d4d        392MB          107MB
node_modules/.prisma/client/libquery_engine-linux-musl-arm64-openssl-3.0.x.so.node
node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node
aarch64
mime
prisma
PID   USER     COMMAND
    1 node     /sbin/tini -- node dist/index.js
    7 node     node dist/index.js</div>
<table>
<tr><th>Dòng</th><th>Kết luận được gì</th></tr>
<tr><td><code>392MB</code> / <code>107MB</code></td><td>Dung lượng trên đĩa so với bản nén phải tải (Chương 1, các cột của Docker 29). 121 MB trong đó là <code>node_modules</code> — <code>docker history dk10-api:1.0.0</code> cho thấy đó là tầng lớn nhất.</td></tr>
<tr><td>Hai file engine</td><td><code>native</code> trong <code>binaryTargets</code> nghĩa là "nền tảng nơi <code>npm ci</code> đã chạy": ở đây là Alpine trên arm64, nên có <code>linux-musl-arm64-…</code>. File thứ hai, <code>linux-musl-openssl-3.0.x</code>, là engine Alpine cho <strong>amd64</strong> — thứ một VPS amd64 cần. Output mẫu ở trên chỉ có file đó là output của một máy amd64.</td></tr>
<tr><td><code>ls node_modules/.bin</code> vẫn còn <code>prisma</code></td><td>Prisma CLI là một <code>devDependency</code>, vậy mà <code>npm prune --omit=dev</code> vẫn giữ nó, vì <code>@prisma/client</code> khai nó là peer dependency (phụ thuộc ngang hàng). Nếu không có điều đó, <code>npx prisma migrate deploy</code> trong dịch vụ <code>migrate</code> sẽ đi tải Prisma từ npm — từ một mạng không có Internet. Hãy kiểm; thiếu CLI thì chuyển <code>prisma</code> sang <code>dependencies</code>.</td></tr>
<tr><td>PID 1 là <code>tini</code></td><td><code>ENTRYPOINT</code> đã có tác dụng: tini làm PID 1 và chuyển <code>SIGTERM</code> tới node (PID 7), nên <code>docker stop</code> mất vài mili giây chứ không phải mười giây (Bài 1.3).</td></tr>
</table>
<p>Giờ cố ý tái hiện sự cố libc. Thay đổi duy nhất là ảnh nền của hai tầng đầu: <code>FROM node:22.11-bookworm-slim AS deps</code> và <code>… AS build</code> (Debian, glibc), còn <code>production</code> vẫn là Alpine (musl) — đúng hình dạng của một lượt dựng lấy nhầm Dockerfile.</p>
<pre><code class="language-bash">docker build -f Dockerfile.sai -t dk10-api:sai .
docker run --rm dk10-api:sai sh -c 'ls node_modules/.prisma/client/*.node; node -e "…new PrismaClient().\$connect()…"'</code></pre>
<div class="out">node_modules/.prisma/client/libquery_engine-linux-arm64-openssl-1.1.x.so.node
node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node
Prisma Client could not locate the Query Engine for runtime "linux-musl-arm64-openssl-3.0.x".

This happened because Prisma Client was generated for "linux-arm64-openssl-1.1.x", but the actual deployment required "linux-musl-arm64-openssl-3.0.x".
Add "linux-musl-arm64-openssl-3.0.x" to &#96;binaryTargets&#96; in the "schema.prisma" file and run &#96;prisma generate&#96; after saving it:</div>
<p>Lượt dựng xanh. Output cho thấy HAI lỗi tách biệt. Engine được sinh cho Debian (glibc) trong khi ảnh chạy Alpine (musl). Và nó được sinh cho <code>openssl-1.1.x</code> vì ảnh Debian slim không cài OpenSSL, nên Prisma không dò được phiên bản và đành đoán. Cách sửa là cách bài đã nói — cả ba tầng cùng một ảnh nền — còn cách kiểm là mấy lệnh ở trên: liệt kê các file <code>.node</code> và chạy một truy vấn thật bên trong ảnh TRƯỚC khi đẩy nó đi.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">api · node dist/index.js</span><span class="lz-lnote">CMD mặc định. Phục vụ HTTP ở cổng 3000, nằm trên cả hai mạng, có healthcheck chạm tới Postgres và Redis.</span></div>
  <div class="lz-layer"><span class="lz-lname">worker · node dist/worker.js</span><span class="lz-lnote">Cùng cái ảnh, khác câu lệnh. Chỉ ở mạng riêng — nó không có mặt tiền HTTP nào và không ai cần với tới nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">migrate · npx prisma migrate deploy</span><span class="lz-lnote">Vẫn cái ảnh đó. Chạy một lần, thoát 0, và là cái cổng mà hai cái kia chờ. <code>restart: "no"</code>, vì thoát chính là việc của nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">seed · npx prisma db seed</span><span class="lz-lnote">Cùng cái ảnh, nằm sau một profile. Không bao giờ chạy trong một lượt deploy production; được gọi có chủ đích bằng <code>compose run --rm seed</code>.</span></div>
</div>
<h3>Ba dịch vụ từ một cái ảnh</h3>
${slide('dk-10', 14, 'Một ảnh, bốn vai — khác nhau đúng một dòng command')}
<pre><code>  api:
    image: ghcr.io/me/api:&#36;{TAG:-latest}
    build: { context: ., dockerfile: Dockerfile.backend, target: production }
    env_file: [.env]
    environment:
      NODE_ENV: production
      PORT: "3000"
    depends_on:
      db:      { condition: service_healthy }
      cache:   { condition: service_healthy }
      migrate: { condition: service_completed_successfully }
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://127.0.0.1:3000/health').then(r=&gt;process.exit(r.ok?0:1)).catch(()=&gt;process.exit(1))"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 40s
    networks: [public, private]
    restart: unless-stopped

  worker:
    image: ghcr.io/me/api:&#36;{TAG:-latest}
    command: ["node", "dist/worker.js"]
    env_file: [.env]
    depends_on:
      migrate: { condition: service_completed_successfully }
    networks: [private]
    restart: unless-stopped

  migrate:
    image: ghcr.io/me/api:&#36;{TAG:-latest}
    command: ["npx", "prisma", "migrate", "deploy"]
    env_file: [.env]
    depends_on:
      db: { condition: service_healthy }
    networks: [private]
    restart: "no"</code></pre>
<pre><code>docker compose up -d 2&gt;&amp;1 | grep -E 'Started|Healthy|Exited'</code></pre>
<div class="out"> Container dk10-blog-cache-1 Started
 Container dk10-blog-db-1 Started
 Container dk10-blog-db-1 Healthy
 Container dk10-blog-migrate-1 Started
 Container dk10-blog-cache-1 Healthy
 Container dk10-blog-cache-1 Healthy
 Container dk10-blog-db-1 Healthy
 Container dk10-blog-migrate-1 Exited
 Container dk10-blog-migrate-1 Exited
 Container dk10-blog-api-1 Started
 Container dk10-blog-worker-1 Started
 Container dk10-blog-api-1 Healthy
 Container dk10-blog-web-1 Started
 Container dk10-blog-api-1 Healthy
 Container dk10-blog-web-1 Healthy
 Container dk10-blog-nginx-1 Started</div>
<p>Output thật của stack khoá dựng, Compose v5.5.1. Bản cũ của bài in sáu dòng gọn gàng, mỗi dòng một dấu tích và một khoảng thời gian; Compose v5 khi in vào pipe không cho ra như thế. Thứ nó in là MỌI lần đổi trạng thái, và vài dòng xuất hiện hai lần (<code>Healthy</code>, <code>Exited</code>) vì có hai dịch vụ cùng đang chờ một dịch vụ. Hãy đọc THỨ TỰ, đừng đếm dòng: <code>db Healthy</code> → <code>migrate Started</code> → <code>migrate Exited</code> → <code>api</code> và <code>worker Started</code>.</p>
<div class="callout ok"><strong>Cái thứ tự đó chính là toàn bộ ý nghĩa của quyết định thứ ba trong chương.</strong> Cơ sở dữ liệu trở nên khoẻ mạnh, migration chạy tới hết rồi thoát 0, và chỉ khi ấy API với worker mới khởi động — trên một schema chúng tin cậy được. Nếu <code>prisma migrate deploy</code> thoát khác 0, compose dừng lại và báo cáo; không có gì khởi động trên một cơ sở dữ liệu migrate được nửa chừng.</div>

<h3>Khi migration hỏng: cổng chặn bảo vệ được gì, và KHÔNG bảo vệ được gì</h3>
${slide('dk-10', 16, 'Migration hỏng: cổng chặn giữ schema, KHÔNG giữ site')}
<p>Ô ở trên nói đúng, và rất dễ đọc ra nhiều hơn điều nó nói. Khoá đã cố ý làm hỏng migration (Bài 10.2 cho thấy cùng hình dạng đó với một mật khẩu sai) và nhìn xem <code>docker compose up -d</code> làm gì. Compose làm theo hai pha: trước hết nó TẠO LẠI mọi container có ảnh hay cấu hình đã đổi — tức là XOÁ container cũ — và chỉ sau đó mới bật chúng theo thứ tự phụ thuộc. Nên khi <code>migrate</code> thoát khác 0:</p>
<ul>
<li><code>api</code> mới không bao giờ được bật (<code>Created</code>): không gì chạy trên một schema migrate dở dang — lời hứa được giữ;</li>
<li><code>api</code> CŨ thì đã mất: nginx trả <strong>502</strong> cho tới khi có người can thiệp — lời hứa chưa bao giờ bao trùm chuyện đó.</li>
</ul>
<p>Cách sửa là tách lượt deploy: chạy migration thành một bước riêng, TRƯỚC khi <code>up</code> đụng vào các container đang chạy. Nó hỏng thì bản cũ vẫn phục vụ. Đo trên một bản thu nhỏ của đúng stack này (một Postgres, một việc migration bằng <code>psql</code> chạy một lần, và một nginx đóng thế cho API, <code>depends_on: migrate: service_completed_successfully</code>), thêm một cột <code>NOT NULL</code> vào một bảng đã có dữ liệu:</p>
<pre><code class="language-bash"><span class="tok-comment"># cách 1: up thẳng</span>
docker compose up -d
docker compose ps -a --format 'table {{.Service}}\\t{{.Status}}'; curl -s -o /dev/null -w 'api: %{http_code}\\n' localhost:18102
<span class="tok-comment"># cách 2: migrate riêng trước</span>
docker compose run --rm migrate; curl -s -o /dev/null -w 'api: %{http_code}\\n' localhost:18102</code></pre>
<div class="out"> Container dk10-thu3-api-1 Recreate
 Container dk10-thu3-api-1 Recreated
 Container dk10-thu3-migrate-1 Started
 Container dk10-thu3-migrate-1 Error service "migrate" didn't complete successfully: exit 3
psql:/m/all.sql:3: ERROR:  column "slug" of relation "post" contains null values
SERVICE   STATUS
api       Created
db        Up 12 seconds (healthy)
migrate   Exited (3) Less than a second ago
api: 000
…
psql:/m/all.sql:3: ERROR:  column "slug" of relation "post" contains null values
api: 200</div>
<p><code>000</code> là cách curl nói "không có câu trả lời HTTP nào cả" — không còn gì nghe ở cổng đó. Sau cùng một lỗi nhưng đi qua <code>run --rm migrate</code>, API đang chạy không hề bị đụng tới và vẫn trả <code>200</code>. (psql thoát mã 3 khi một script dừng vì lỗi dưới <code>ON_ERROR_STOP=1</code>; Prisma thoát mã 1.)</p>

<h3>P3018 rồi P3009: một migration Prisma hỏng chặn MỌI lần deploy sau</h3>
${slide('dk-10', 17, 'P3018 rồi P3009: một migration hỏng chặn mọi lần deploy sau')}
<p>Với Prisma còn một hệ quả thứ hai. <code>prisma migrate deploy</code> ghi mọi migration nó bắt đầu vào một bảng tên <code>_prisma_migrations</code>. Khi một cái hỏng, dòng đó nằm lại mà không có giờ kết thúc, và từ đó Prisma từ chối áp bất cứ thứ gì. Trên stack của khoá, với một migration thêm <code>"slug" TEXT NOT NULL</code> vào bảng đã có ba dòng:</p>
<pre><code class="language-bash">TAG=1.0.1 docker compose run --rm migrate          <span class="tok-comment"># lần 1</span>
TAG=1.0.1 docker compose run --rm migrate          <span class="tok-comment"># lần 2, không sửa gì</span>
docker compose exec db psql -U blog -c 'select migration_name, finished_at is not null as xong, rolled_back_at is not null as da_lui from _prisma_migrations order by started_at'</code></pre>
<div class="out">Applying migration &#96;20260924100000_add_slug&#96;
Error: P3018

A migration failed to apply. New migrations cannot be applied before the error is recovered from. …
Migration name: 20260924100000_add_slug
Database error code: 23502
Database error:
ERROR: column "slug" of relation "Post" contains null values
…
Error: P3009
migrate found failed migrations in the target database, new migrations will not be applied. …
The &#96;20260924100000_add_slug&#96; migration started at 2026-09-23 19:22:04.129831 UTC failed
     migration_name      | xong | da_lui
-------------------------+------+--------
 20260924090000_init     | t    | f
 20260924100000_add_slug | f    | f</div>
<p>Cách cứu khoá đã dùng, theo thứ tự — và trên cơ sở dữ liệu production, bước 1 là "dừng lại và báo người phụ trách", không phải "gõ nhanh hơn":</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Tìm xem nó đã chạy tới đâu</span><span class="lz-t">\\d "Post" trong psql, bảng _prisma_migrations</span><span class="lz-d">Ở đây ngay câu lệnh đầu đã hỏng, nên chưa có gì được áp. Nếu migration chết giữa chừng mà bạn đánh dấu "đã lùi", bạn đang nói dối Prisma về schema.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Báo Prisma là nó đã được lùi</span><span class="lz-t">… run --rm migrate npx prisma migrate resolve --rolled-back 20260924100000_add_slug</span><span class="lz-d">Output: <code>Migration 20260924100000_add_slug marked as rolled back.</code> Chỉ làm sau khi bước 1 cho thấy chưa có gì được áp.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Viết một migration CÓ THỂ thành công</span><span class="lz-t">thêm cột cho phép NULL → UPDATE → SET NOT NULL</span><span class="lz-d"><code>ALTER TABLE "Post" ADD COLUMN "slug" TEXT;</code>, <code>UPDATE "Post" SET "slug" = 'bai-' || "id";</code>, <code>ALTER TABLE "Post" ALTER COLUMN "slug" SET NOT NULL;</code>, rồi chỉ mục unique. Thư mục tên MỚI, không bao giờ sửa cái đã hỏng.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Build, migrate, rồi mới up</span><span class="lz-t">TAG=1.0.2 … build api → run --rm migrate → up -d</span><span class="lz-d"><code>All migrations have been successfully applied.</code> Rồi <code>up -d</code> tạo lại api, worker và web trên ảnh mới.</span></div>
</div>

<h3>Healthcheck chạy được trong một cái ảnh gọn</h3>
<pre><code><span class="tok-comment"># Điểm cuối mà nó gọi — rẻ, và nó kiểm thật các phụ thuộc</span>
app.get('/health', async (_req, res) =&gt; {
  try {
    await prisma.\$queryRaw&#96;SELECT 1&#96;;
    await redis.ping();
    res.json({ ok: true, version: process.env.TAG ?? 'dev' });
  } catch (err) {
    res.status(503).json({ ok: false, error: String(err) });
  }
});</code></pre>
<pre><code>docker compose exec api node -e "fetch('http://127.0.0.1:3000/health').then(r=&gt;r.json()).then(console.log)"</code></pre>
<div class="out">{ ok: true, version: '1.4.2' }</div>
<p>Hai điểm thiết kế. Cái ảnh không có <code>curl</code> và cũng không cần — <code>node -e</code> vốn đã sẵn ở đó. Và điểm cuối này chạm tới cả Postgres lẫn Redis, nên trạng thái <code>(unhealthy)</code> có nghĩa là "instance này không phục vụ được yêu cầu", chứ không chỉ là "tiến trình còn sống". Một điểm cuối sức khoẻ trả 200 vô điều kiện chẳng nói cho bạn thêm điều gì so với việc nhìn thấy container đang chạy.</p>

<h3>Seed, nằm sau một profile</h3>
${slide('dk-10', 18, 'Seed sau profile — và cái bẫy tsx đã bị prune')}
<pre><code>  seed:
    image: ghcr.io/me/api:&#36;{TAG:-latest}
    command: ["npx", "prisma", "db", "seed"]
    env_file: [.env]
    depends_on:
      migrate: { condition: service_completed_successfully }
    profiles: [seed]
    networks: [private]
    restart: "no"</code></pre>
<pre><code>docker compose run --rm seed</code></pre>
<div class="out">Running seed command &#96;tsx prisma/seed.ts&#96; ...

An error occurred while running the seed command:
Error: Command failed with ENOENT: tsx prisma/seed.ts
spawn tsx ENOENT</div>
<p>Đó là thứ mà đúng cấu hình này thật sự in ra — khoá đã chạy nó. Bản cũ của bài in một lượt seed thành công ở đây, điều không thể xảy ra: <code>package.json</code> ghi <code>"prisma": { "seed": "tsx prisma/seed.ts" }</code>, <code>tsx</code> là một <code>devDependency</code>, và <code>npm prune --omit=dev</code> trong Dockerfile đã xoá nó đi. Hai lối ra: cài <code>tsx</code> thành phụ thuộc thường (ảnh to thêm), hoặc — tốt hơn — chuyển seed vào <code>src/seed.ts</code> để <code>tsc</code> biên dịch nó thành <code>dist/seed.js</code>, rồi đặt <code>"seed": "node dist/seed.js"</code>:</p>
<pre><code class="language-bash">docker compose build api &amp;&amp; docker compose run --rm seed</code></pre>
<div class="out">Running seed command &#96;node dist/seed.js&#96; ...
seeded 3 posts

🌱  The seed command has been executed.</div>
<p>Việc chuyển chỗ còn một phần thưởng trả lời thẳng ô cảnh báo bên dưới. Khi seed nằm trong <code>src/</code>, file <code>tsconfig.json</code> chính kiểm kiểu luôn cho nó. Lúc khoá thêm cột <code>slug</code> bắt buộc vào schema, chính lượt BUILD dừng lại — ở máy cá nhân, không phải trên production:</p>
<div class="out">src/seed.ts(5,5): error TS2741: Property 'slug' is missing in type '{ title: string; }' but required in type 'PostCreateManyInput'.</div>

<div class="callout warn"><strong>Seed là chỗ DUY NHẤT mà một lỗi kiểu dữ liệu có thể qua sạch mọi phép kiểm rồi vẫn làm vỡ production.</strong> File <code>tsconfig.json</code> chính có <code>rootDir: "./src"</code>, nên <code>prisma/**</code> không nằm được trong <code>include</code> của nó — nghĩa là <code>tsc --noEmit</code> không bao giờ nhìn tới <code>seed.ts</code>. Dự án này từng đổi tên một giá trị enum <code>ContentType</code>, qua sạch toàn bộ danh sách kiểm trước khi push, mà vẫn vỡ seed trên production, vì <code>seed.ts</code> mang theo một bản chép tay của cái union và nó tự kiểm với chính nó. Hãy import enum từ <code>@prisma/client</code> thay vì khai lại, giữ một file <code>tsconfig.seed.json</code> riêng, và chạy seed cho THẬT mỗi khi schema đổi — đọc thôi thì không đủ.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn trong nhóm thêm một cột bắt buộc vào bảng đã có dữ liệu rồi deploy bằng một lệnh <code>docker compose up -d</code> trơn. Migration hỏng và cả trang chết. Dựng lại sự cố đó trên một bản thu nhỏ — không cần Prisma, chỉ Postgres và <code>psql</code> — rồi deploy cùng thay đổi đó theo cách an toàn.</p><ol>
<li><code>mkdir -p ~/thu-docker/mig/migrations &amp;&amp; cd ~/thu-docker/mig</code>, lưu file bên dưới thành <code>compose.yaml</code>, và tạo <code>migrations/all.sql</code> với hai dòng: <code>CREATE TABLE IF NOT EXISTS post (id serial PRIMARY KEY, title text NOT NULL);</code> và <code>INSERT INTO post (title) SELECT 'bai dau tien' WHERE NOT EXISTS (SELECT 1 FROM post);</code>. Chạy <code>docker compose up -d</code> và <code>curl -s -o /dev/null -w 'api: %{http_code}\\n' localhost:18102</code>.</li>
<li>Làm hỏng theo cách của bạn cùng nhóm: thêm dòng <code>ALTER TABLE post ADD COLUMN IF NOT EXISTS slug text NOT NULL;</code> vào cuối <code>all.sql</code>, đổi <code>VERSION: "1"</code> thành <code>"2"</code> (một "bản phát hành mới"), <code>docker compose up -d</code>, rồi <code>docker compose ps -a</code> và cùng lệnh <code>curl</code>.</li>
<li>Khôi phục dịch vụ: xoá dòng <code>slug</code>, <code>docker compose up -d</code>, kiểm <code>api: 200</code>.</li>
<li>Giờ theo cách an toàn: thêm lại dòng hỏng, tăng <code>VERSION</code> lên <code>"3"</code>, và CHỈ chạy <code>docker compose run --rm migrate</code>, rồi <code>curl</code>.</li>
<li>Sửa migration (thay dòng hỏng bằng ba dòng bên dưới), <code>docker compose run --rm migrate</code>, rồi <code>docker compose up -d</code>. Dọn bằng <code>docker compose down -v</code>.</li></ol>
<pre><code class="language-yaml">name: mig
services:
  db:
    image: postgres:16.4-alpine
    environment: { POSTGRES_USER: blog, POSTGRES_PASSWORD: thu }
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck: { test: ["CMD-SHELL", "pg_isready -U blog"], interval: 2s }
  migrate:
    image: postgres:16.4-alpine
    environment: { PGPASSWORD: thu }
    command: ["psql", "-v", "ON_ERROR_STOP=1", "-h", "db", "-U", "blog", "-d", "blog", "-f", "/m/all.sql"]
    volumes: ["./migrations:/m:ro"]
    depends_on: { db: { condition: service_healthy } }
    restart: "no"
  api:
    image: nginx:1.27-alpine
    environment: { VERSION: "1" }
    ports: ["127.0.0.1:18102:80"]
    depends_on: { migrate: { condition: service_completed_successfully } }
volumes:
  pgdata:</code></pre>
<pre><code class="language-sql">ALTER TABLE post ADD COLUMN IF NOT EXISTS slug text;
UPDATE post SET slug = 'bai-' || id WHERE slug IS NULL;
ALTER TABLE post ALTER COLUMN slug SET NOT NULL;</code></pre>
<div class="out">api: 200
 Container dk10-thu3-migrate-1 Error service "migrate" didn't complete successfully: exit 3
api       Created
api: 000
…
psql:/m/all.sql:3: ERROR:  column "slug" of relation "post" contains null values
api: 200
…
ALTER TABLE
UPDATE 1
ALTER TABLE
api: 200</div>
<p>Output ghi trên máy Mac của khoá (project <code>dk10-thu3</code>). <code>api</code> cố ý là một nginx đóng thế: bài này nói về THỨ TỰ compose làm việc, thứ giống hệt nhau với mọi ảnh.</p>
<p><strong>Đạt khi:</strong> bước 2 cho bạn <code>api Created</code> và <code>api: 000</code>, bước 4 làm migration hỏng trong khi <code>curl</code> vẫn trả <code>200</code>, và bước 5 kết thúc bằng <code>UPDATE 1</code> với <code>api: 200</code> — và bạn nói được vì sao bước 2 làm sập trang dù "không có gì khởi động trên một schema migrate dở dang".</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Multi-stage build (dựng nhiều tầng)</span><span class="v">Dockerfile có nhiều <code>FROM</code>; chỉ tầng cuối được ship, các tầng khác chỉ làm ra file cho nó.</span></div>
  <div class="kv"><span class="k">Query engine / <code>binaryTargets</code> (bộ máy truy vấn / đích nhị phân)</span><span class="v">Thư viện gốc của Prisma, dựng riêng cho từng hệ điều hành, libc và CPU. <code>binaryTargets</code> liệt kê những bản cần tải lúc generate.</span></div>
  <div class="kv"><span class="k">musl / glibc (thư viện C)</span><span class="v">Hai thư viện C của Linux: Alpine dùng musl, Debian và Ubuntu dùng glibc. Module gốc dựng cho bên này không nạp được ở bên kia.</span></div>
  <div class="kv"><span class="k">Migration gate (cổng chặn migration)</span><span class="v">Dịch vụ <code>migrate</code> chạy một lần cộng <code>service_completed_successfully</code>: dịch vụ phụ thuộc chỉ bật sau khi nó thoát 0.</span></div>
  <div class="kv"><span class="k">Recreate (tạo lại)</span><span class="v">Việc compose làm khi ảnh hay cấu hình của một dịch vụ đổi: xoá container cũ, tạo cái mới — TRƯỚC mọi phép kiểm phụ thuộc.</span></div>
  <div class="kv"><span class="k"><code>_prisma_migrations</code> (sổ migration)</span><span class="v">Bảng ghi sổ của Prisma; một dòng thiếu <code>finished_at</code> là migration hỏng và chặn lượt deploy sau bằng P3009.</span></div>
  <div class="kv"><span class="k"><code>npm prune --omit=dev</code> (tỉa phụ thuộc dev)</span><span class="v">Xoá devDependencies khỏi <code>node_modules</code> — kể cả công cụ như <code>tsx</code> mà lệnh lúc chạy của bạn có thể vẫn gọi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một ảnh nhiều câu lệnh bảo đảm api, worker, migrate và seed chạy cùng một mã.</li>
<li>Nhìn vào mọi ảnh mới: các file engine <code>.node</code>, <code>node_modules/.bin</code>, và ai là PID 1.</li>
<li>Tầng dựng và tầng chạy phải cùng ảnh nền: engine Prisma dựng bằng glibc trong ảnh Alpine chết ở truy vấn đầu tiên trong khi build vẫn xanh.</li>
<li><code>service_completed_successfully</code> giữ an toàn cho schema, không cho trang web: <code>up -d</code> xoá api cũ trước khi migration chạy.</li>
<li>Deploy bằng <code>run --rm migrate</code> trước, <code>up -d</code> sau; migration Prisma hỏng phải được điều tra và xử lý trước khi P3009 cho gì đi qua.</li>
<li>Thứ gì lệnh lúc chạy cần phải sống sót qua <code>npm prune</code>; biên dịch seed vào <code>dist/</code> còn khiến <code>tsc</code> kiểm nó.</li>
</ul>

<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/deployment/deploy-prisma" target="_blank" rel="noopener">
  <span class="lc-ico">🔺</span>
  <span class="lc-body"><span class="lc-title">Prisma — triển khai và binary targets</span><span class="lc-sub">Vì sao query engine phụ thuộc nền tảng, danh sách đầy đủ <code>binaryTargets</code>, và phân biệt musl với glibc vốn quyết định container của bạn có khởi động được không.</span></span>
</a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">prisma migrate deploy so với dev</span><span class="lc-sub"><code>deploy</code> áp các migration đang chờ và không bao giờ tạo hay xoá gì — cái duy nhất thuộc về một container. <code>dev</code> cần cơ sở dữ liệu bóng và là lệnh dành cho lập trình viên.</span></span>
</a>
<a class="link-card" href="https://github.com/krallin/tini" target="_blank" rel="noopener">
  <span class="lc-ico">🧷</span>
  <span class="lc-body"><span class="lc-title">tini</span><span class="lc-sub">Bộ init 10KB thu dọn tiến trình mồ côi và chuyển tiếp tín hiệu. Phần README giải thích vấn đề PID 1 rõ hơn phần lớn tài liệu, và cờ <code>--init</code> của Docker cũng kèm sẵn một bản của nó.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng tầng ứng dụng</span><span class="lc-sub">Bài chấm điểm: viết một Dockerfile nhiều tầng cho API Node, chạy ba dịch vụ từ một cái ảnh, đặt cổng chặn migration trước API, và viết healthcheck cho một cái ảnh không có curl.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> chạy migration từ entrypoint của API thay vì từ một dịch vụ riêng. Nhìn thì gọn hơn và nó hỏng theo hai kiểu mà một dịch vụ migration không hỏng. Thứ nhất, nếu có lúc nào đó bạn chạy nhiều hơn một bản sao API, mọi bản sao sẽ đua nhau áp cùng một migration — khoá cố vấn của Prisma thường thì cứu được bạn, và chữ "thường thì" ở đây đang gánh việc thật. Thứ hai, một lần migration hỏng biến thành một API sập-rồi-restart-vòng-lặp chứ không phải một cú dừng rõ ràng: container khởi động lại, thử migration lại, hỏng tiếp, và log của bạn đầy cùng một lỗi trong khi lượt deploy báo thành công. Một dịch vụ <code>migrate</code> riêng với <code>restart: "no"</code> và <code>service_completed_successfully</code> cho bạn một lượt chạy, một mã thoát rõ ràng, và một lượt deploy biết dừng khi thay đổi schema hỏng.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Một cái ảnh với ba câu lệnh bảo đảm API, worker và migration là cùng một mã — dựng một lần, chỉ khác ở <code>command</code>. Migration thuộc về dịch vụ riêng của nó với <code>restart: "no"</code>, có <code>service_completed_successfully</code> canh cửa, không bao giờ nằm trong entrypoint. Và module gốc gắn với libc của ảnh nền: hãy khai <code>binaryTargets</code> của Prisma, và kiểm cái ảnh khởi động được thật trước khi đưa nó lên — build xanh không phải là một container đang chạy.</p>
</div>
`,
    },
    /* ─────────────────────────── 10.4 ─────────────────────────── */
    {
      title: '10.4 — The frontend: Next.js in a container|||10.4 — Frontend: Next.js trong container',
      slug: 'dk-10-4-frontend',
      type: 'LESSON',
      description: 'Bản dựng standalone và vì sao nó nhỏ hơn mười lần, cái bẫy NEXT_PUBLIC nướng vào lúc dựng, hai URL cho cùng một API, ảnh với font, và bind mount lúc phát triển.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>The frontend: Next.js in a container</h2>
<p class="lead">A Next.js container is where two Docker ideas collide with a framework that has strong opinions about both: what happens at build time versus run time, and what "the API URL" means when the same code runs on a server and in a browser. Get those two right and the rest is an ordinary multi-stage build.</p>

<h3>The standalone build</h3>
${slide('dk-10', 19, 'frontend/Dockerfile: standalone chỉ cần chép ba thứ')}
<pre><code><span class="tok-comment">// next.config.js</span>
module.exports = {
  output: 'standalone',              <span class="tok-comment">// trace exactly the files needed to run</span>
  compress: false,                   <span class="tok-comment">// nginx does gzip/brotli better</span>
  poweredByHeader: false,
};</code></pre>
<pre><code><span class="tok-comment"># frontend/Dockerfile</span>
FROM node:22.11-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM node:22.11-alpine AS build
WORKDIR /app
ARG NEXT_PUBLIC_API_URL              <span class="tok-comment"># baked into the bundle HERE</span>
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=&#36;{NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=&#36;{NEXT_PUBLIC_SITE_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22.11-alpine AS production
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000
WORKDIR /app
COPY --from=build /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]</code></pre>
<pre><code>docker build -t web:1.4.2 ./frontend
docker images --format '{{.Repository}}:{{.Tag}}\\t{{.Size}}' | grep -E '^web|^web-full'</code></pre>
<div class="out">web:1.4.2	187MB
web-full:1.4.2	1.31GB</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>output: 'standalone'</code></span><span class="v">Next traces which files the server actually needs and writes a minimal <code>server.js</code> plus a pruned <code>node_modules</code>. 187MB instead of 1.31GB, for the same site.</span></div>
  <div class="kv"><span class="k">Copy <code>.next/static</code> and <code>public</code> separately</span><span class="v">The standalone output deliberately excludes them. Forgetting either gives you a site that renders with no CSS and no images — a very recognisable symptom.</span></div>
  <div class="kv"><span class="k"><code>HOSTNAME=0.0.0.0</code></span><span class="v">The standalone <code>server.js</code> listens on whatever address <code>HOSTNAME</code> names, falling back to <code>0.0.0.0</code> only if it is empty — and Docker sets <code>HOSTNAME</code> in every container to the container ID. Without this line Next listens on one IP of one network, <code>127.0.0.1</code> is refused, and the healthcheck fails (measured below; an earlier version of this row said Next binds to <code>localhost</code> by default, which is not what the code does).</span></div>
  <div class="kv"><span class="k"><code>compress: false</code></span><span class="v">nginx compresses better and cheaper. Compressing twice wastes CPU on every request for no benefit.</span></div>
  <div class="kv"><span class="k">Do not bind-mount <code>.next</code></span><span class="v">In development, mount the source but keep <code>/app/.next</code> and <code>/app/node_modules</code> as anonymous volumes (Lesson 7.3), or the host's stale build shadows the container's.</span></div>
</div>

<h3>Run it step by step: build the frontend and measure what standalone saves</h3>
${slide('dk-10', 20, 'standalone: cùng trang web, ảnh nhỏ đi hơn ba lần')}
<p>The course built this exact Dockerfile for a small Next.js 15.5 app (one server-rendered page that fetches posts from the API, one client component, one logo in <code>public/</code>). To compare with a non-standalone image, the <code>build</code> stage itself was tagged — that is everything <code>next build</code> needs, the same thing a one-stage Dockerfile would ship.</p>
<pre><code class="language-bash">docker compose build web                                      <span class="tok-comment"># ~1 phút trên Mac M1</span>
docker build --target build -t dk10-web-full:1.0.2 ./frontend
docker images --filter reference='dk10-web*'
docker run --rm dk10-web:1.0.2 du -sh /app
docker run --rm dk10-web-full:1.0.2 du -sh /app/node_modules /app/.next</code></pre>
<div class="out">IMAGE                 ID             DISK USAGE   CONTENT SIZE   EXTRA
dk10-web-full:1.0.2   050f7a053c70       1.01GB          228MB
dk10-web:1.0.0        67e0e04205b0        318MB         78.2MB   U
dk10-web:1.0.2        362bb21e989f        318MB         78.2MB   U
72.7M	/app
477.1M	/app/node_modules
114.6M	/app/.next</div>
<p>The whole application in the standalone image is 72.7 MB; the rest of the 318 MB is the <code>node:22.11-alpine</code> base. The build stage carries 477 MB of <code>node_modules</code> and 115 MB of build cache in <code>.next</code>, none of which a running server needs. Your ratio depends on your dependencies — the example numbers earlier in the lesson (187 MB against 1.31 GB) come from a bigger app; this is a small one, measured.</p>
<p>Two things the build taught along the way. First, <code>COPY --from=build /app/public ./public</code> fails the whole build if the project has no <code>public/</code> folder — <code>"/app/public": not found</code> — so keep one, even empty. Second, the build stage does all the heavy work: <code>next build</code> is the step that runs out of memory on a small server, which is why this chapter builds the backend and the frontend one after the other.</p>

<h3>The NEXT_PUBLIC trap</h3>
${slide('dk-10', 21, 'NEXT_PUBLIC_* nướng vào JS lúc build — env lúc chạy vô ích')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Server-side variables</span><span class="lz-t">read at RUN time, from the container's environment</span><span class="lz-d">Anything used only in <code>getServerSideProps</code>, a route handler, or a server component. Change it and restart the container — no rebuild.</span></div>
  <div class="lz-step"><span class="lz-k">NEXT_PUBLIC_* variables</span><span class="lz-t">substituted into the JS bundle at BUILD time</span><span class="lz-d">They become string literals in the files the browser downloads. Setting one in <code>environment:</code> has no effect whatsoever — the value was fixed when <code>npm run build</code> ran.</span></div>
  <div class="lz-step"><span class="lz-k">So they must be build args</span><span class="lz-t">ARG + ENV in the build stage, args: in compose</span><span class="lz-d">Which also means one image per environment: the staging build and the production build are genuinely different artifacts if their public URLs differ.</span></div>
  <div class="lz-step"><span class="lz-k">The better answer: relative URLs</span><span class="lz-t">fetch('/api/posts')</span><span class="lz-d">If the browser talks to the same origin, there is no URL to bake in — nginx routes <code>/api</code> to the backend, and the same image runs in every environment.</span></div>
</div>
<pre><code><span class="tok-comment"># Prove it: the value is IN the bundle</span>
docker run --rm web:1.4.2 sh -c 'grep -ro "https://api\\.cuongthai\\.com" .next/static/chunks | head -2'
<span class="tok-comment"># And an environment variable at run time changes nothing</span>
docker run --rm -e NEXT_PUBLIC_API_URL=https://other.example web:1.4.2 \\
  sh -c 'grep -ro "other\\.example" .next/static/chunks | wc -l'</code></pre>
<div class="out">.next/static/chunks/app/page-4f1c8a.js:https://api.cuongthai.com
.next/static/chunks/main-9b2e11.js:https://api.cuongthai.com
0</div>
<pre><code class="language-bash">docker compose exec web sh -c 'grep -rl "http://localhost:18100" .next/static/chunks'
docker run --rm -e NEXT_PUBLIC_SITE_URL=https://khac.example dk10-web:1.0.2 \\
  sh -c 'grep -rl "khac.example" .next/static/chunks | wc -l'</code></pre>
<div class="out">.next/static/chunks/app/page-112490d1d7e185aa.js
0</div>
<p>That is the same proof run for real on the course's stack, where the build arg is <code>NEXT_PUBLIC_SITE_URL=http://localhost:18100</code>: the value sits in one client chunk, and an environment variable with a different value at run time appears nowhere. (An earlier version of this lesson printed chunk names like <code>page-4f1c8a.js</code>; Next names chunks with a 16-character hash, as above, and the value lands only in chunks of client components that use it.)</p>
<div class="callout warn"><strong>This is also a security rule, not just an operational one.</strong> Because <code>NEXT_PUBLIC_*</code> values are literally shipped to every visitor's browser, a third-party API key with that prefix is a published secret. This project learned it the hard way: a GIF picker called GIPHY directly from the client with <code>NEXT_PUBLIC_GIPHY_API_KEY</code>, the variable was missing at build time, the client silently fell back to GIPHY's revoked public beta key, and the feature returned 403 for everyone. The fix was a small authenticated backend proxy — the key stays server-side as runtime env, responses get cached, and rotating it is a container restart rather than a rebuild.</div>

<h3>Two URLs for the same API</h3>
${slide('dk-10', 22, 'SSR gọi api:3000, trình duyệt gọi /api — hai URL, một API')}
<pre><code><span class="tok-comment">// lib/api.ts — the same file runs in both places</span>
const BASE = typeof window === 'undefined'
  ? process.env.INTERNAL_API_URL       <span class="tok-comment">// http://api:3000  — container network</span>
  : '';                                <span class="tok-comment">// same-origin, nginx routes /api</span>

export async function getPosts() {
  const res = await fetch(&#96;&#36;{BASE}/api/v1/posts&#96;, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(&#96;posts: &#36;{res.status}&#96;);
  return res.json();
}</code></pre>
<pre><code>  web:
    image: ghcr.io/me/web:&#36;{TAG:-latest}
    build:
      context: ./frontend
      args:
        NEXT_PUBLIC_SITE_URL: &#36;{SITE_URL:-https://cuongthai.com}
    environment:
      INTERNAL_API_URL: http://api:3000    <span class="tok-comment"># runtime, server-side only</span>
      HOSTNAME: 0.0.0.0
    depends_on:
      api: { condition: service_healthy }
    networks: [public]
    restart: unless-stopped</code></pre>
<div class="callout ok"><strong>Server-side rendering goes over the container network; the browser goes through nginx.</strong> They are different paths and they need different addresses — <code>http://api:3000</code> does not resolve in a browser, and <code>https://cuongthai.com/api</code> from inside the container would leave the host, cross the public internet and come back, adding latency and a dependency on DNS and TLS for a call between two containers on the same machine.</div>

<h3>Images, fonts, and the sharp dependency</h3>
<pre><code><span class="tok-comment"># next/image needs sharp; the alpine build sometimes needs help finding it</span>
FROM node:22.11-alpine AS production
RUN apk add --no-cache vips-dev fontconfig ttf-dejavu
ENV NEXT_SHARP_PATH=/app/node_modules/sharp</code></pre>
<pre><code>docker compose exec web node -e "console.log(require('sharp').format.jpeg.output ? 'sharp ok' : 'broken')"
docker compose exec web sh -c 'ls .next/static/media | head -3'</code></pre>
<div class="out">sharp ok
inter-latin-400-normal-c8a1f2.woff2
inter-latin-700-normal-9d3e4b.woff2
logo-2f8c91.svg</div>
<p>Two practical notes. If <code>npm ci</code> fails in the Docker build while fetching sharp's prebuilt binaries, it is usually a transient network problem and a retry succeeds using the cached layers. And if a deploy on a small VPS dies during <code>next build</code> with exit code 137, that is the OOM killer: building the frontend and backend in parallel on a 6GB machine has done exactly that here, which is why builds run sequentially on the server and in parallel only on a machine with the memory for it.</p>
<div class="callout"><strong>Update for Next.js 15 (09/2026).</strong> The <code>apk add vips-dev</code> and <code>NEXT_SHARP_PATH</code> lines above come from older Next versions, where production image optimisation needed <code>sharp</code> installed by hand. In Next 15, <code>sharp</code> is installed with Next and traced into the standalone output: the course's image contains <code>node_modules/sharp</code> plus prebuilt <code>@img/sharp-linuxmusl-arm64</code>, and <code>docker compose exec web node -e "const s=require('sharp'); console.log('sharp', s.versions.sharp, 'libvips', s.versions.vips)"</code> printed <code>sharp 0.35.4 libvips 8.18.6</code> with no extra packages. Check your own version the same way before adding system libraries.</div>

<h3>HOSTNAME, precisely: why Next "starts fine" and still cannot be reached</h3>
${slide('dk-10', 23, 'HOSTNAME: Docker tự đặt nó = ID container, Next nghe theo nó')}
<p>The standalone server decides where to listen with one line, and Docker quietly fills in the variable it reads. Measured:</p>
<pre><code class="language-bash">docker run --rm alpine printenv HOSTNAME                       <span class="tok-comment"># ảnh KHÔNG khai HOSTNAME</span>
docker run --rm dk10-web:1.0.2 grep -n HOSTNAME server.js
<span class="tok-comment"># chạy web với HOSTNAME = tên container, như khi ảnh không có ENV HOSTNAME</span>
docker run -d --name dk10-webtest --network dk10-blog_public --hostname dk10-webtest -e HOSTNAME=dk10-webtest dk10-web:1.0.2
docker logs dk10-webtest
docker exec dk10-webtest netstat -tln | grep 3000
docker exec dk10-webtest node -e "fetch('http://127.0.0.1:3000/').then(r=&gt;console.log(r.status)).catch(e=&gt;console.log('127.0.0.1 →', e.cause?.code))"
docker exec dk10-blog-web-1 netstat -tln | grep 3000            <span class="tok-comment"># ảnh của khoá: ENV HOSTNAME=0.0.0.0</span></code></pre>
<div class="out">f21c25392e1e
9:const hostname = process.env.HOSTNAME || '0.0.0.0'
   ▲ Next.js 15.5.26
   - Local:        http://dk10-webtest:3000
   - Network:      http://dk10-webtest:3000

 ✓ Starting...
 ✓ Ready in 105ms
tcp        0      0 172.22.0.5:3000         0.0.0.0:*               LISTEN
127.0.0.1 → ECONNREFUSED
tcp        0      0 0.0.0.0:3000            0.0.0.0:*               LISTEN</div>
<table>
<tr><th>Line</th><th>Meaning</th></tr>
<tr><td><code>f21c25392e1e</code></td><td>An image that does not set <code>HOSTNAME</code> gets the container ID in it — Docker does this for every container.</td></tr>
<tr><td><code>process.env.HOSTNAME || '0.0.0.0'</code></td><td>Next uses that value as the listen address; <code>0.0.0.0</code> is only the fallback for an empty variable.</td></tr>
<tr><td><code>172.22.0.5:3000 … LISTEN</code></td><td>The name resolves to the container's IP on its first network, so the server listens there and nowhere else. <code>Ready</code> is printed and <code>docker ps</code> says <em>Up</em>.</td></tr>
<tr><td><code>127.0.0.1 → ECONNREFUSED</code></td><td>Anything that checks via loopback — the healthcheck in our compose file — fails; <code>web</code> becomes <code>unhealthy</code>, and nginx, which waits for <code>service_healthy</code>, never starts. On a container attached to two networks, only one of them could reach it.</td></tr>
<tr><td><code>0.0.0.0:3000</code></td><td>With <code>ENV HOSTNAME=0.0.0.0</code> in the image, the server listens on every interface. One line, set in the image so nobody can forget it in compose.</td></tr>
</table>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> for the demo to your SWP391 lecturer you need a staging build that shows <code>https://staging.example</code>, but a teammate "fixed" it by setting the variable in <code>docker run -e</code> and the page still shows the old value. Build a three-file Next.js app and prove, with commands, where the value lives and how the server listens.</p><ol>
<li><code>mkdir -p ~/thu-docker/next-thu/app ~/thu-docker/next-thu/public &amp;&amp; cd ~/thu-docker/next-thu</code>. Create the files below, run <code>npm install --package-lock-only</code> (the Dockerfile's <code>npm ci</code> needs a lock file), and copy the <code>frontend/Dockerfile</code> from this lesson. Keep <code>public/</code> even though it is empty.</li>
<li>Build with the staging value: <code>docker build --build-arg NEXT_PUBLIC_SITE_URL=https://staging.example -t thu-web:1 .</code></li>
<li>Find the value in the bundle, then try to override it at run time: <code>docker run --rm thu-web:1 sh -c 'grep -rl "staging.example" .next/static/chunks'</code> and <code>docker run --rm -e NEXT_PUBLIC_SITE_URL=https://prod.example thu-web:1 sh -c 'grep -rl "prod.example" .next/static/chunks | wc -l'</code>.</li>
<li>Reproduce the HOSTNAME trap: <code>docker run -d --name thu-web -e HOSTNAME=thu-web --hostname thu-web thu-web:1</code>, then <code>docker exec thu-web node -e "fetch('http://127.0.0.1:3000/').then(r=&gt;console.log('127.0.0.1 →', r.status)).catch(e=&gt;console.log('127.0.0.1 →', e.cause?.code))"</code>. Remove it and repeat without the two HOSTNAME flags.</li>
<li>Clean up: <code>docker rm -f thu-web; docker rmi thu-web:1</code>.</li></ol>
<pre><code class="language-bash"><span class="tok-comment"># package.json</span>
{ "private": true, "scripts": { "build": "next build" },
  "dependencies": { "next": "15.5.26", "react": "19.1.1", "react-dom": "19.1.1" } }
<span class="tok-comment"># next.config.js</span>
module.exports = { output: 'standalone' };
<span class="tok-comment"># app/layout.js</span>
export default function RootLayout({ children }) { return &lt;html&gt;&lt;body&gt;{children}&lt;/body&gt;&lt;/html&gt;; }
<span class="tok-comment"># app/page.js</span>
'use client';
export default function Home() { return &lt;p&gt;site: {process.env.NEXT_PUBLIC_SITE_URL}&lt;/p&gt;; }</code></pre>
<div class="out">.next/static/chunks/app/page-a6c38407addea0ef.js
0
127.0.0.1 → ECONNREFUSED
127.0.0.1 → 200</div>
<p>Output recorded on the course's Mac (image named <code>dk10-thu4-web:1</code> there; your chunk hash will differ). If the build stops with <code>"/app/public": not found</code>, you skipped the empty <code>public/</code> folder.</p>
<p><strong>Done when:</strong> the staging value is found in exactly one chunk, the run-time override is found in zero, the loopback check is refused with <code>HOSTNAME=thu-web</code> and answers <code>200</code> without it — and you can tell your teammate which of the two fixes needs a rebuild.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Standalone output</span><span class="v"><code>output: 'standalone'</code>: Next traces the files the server needs and writes <code>server.js</code> plus a pruned <code>node_modules</code>.</span></div>
  <div class="kv"><span class="k">Build time vs run time</span><span class="v">Build time is <code>next build</code> inside <code>docker build</code>; run time is the container. Anything decided at build time is inside the image.</span></div>
  <div class="kv"><span class="k"><code>NEXT_PUBLIC_*</code></span><span class="v">Variables substituted into the browser JavaScript during the build — fixed, public, and changeable only by rebuilding.</span></div>
  <div class="kv"><span class="k">Build arg</span><span class="v"><code>ARG</code> in the Dockerfile, <code>build.args</code> in compose, <code>--build-arg</code> on the CLI: a value available only while building.</span></div>
  <div class="kv"><span class="k">SSR</span><span class="v">Server-side rendering: the page's HTML is produced in the container, so its API calls travel over the container network.</span></div>
  <div class="kv"><span class="k">Listen address</span><span class="v">The IP a server accepts connections on: <code>0.0.0.0</code> means every interface, a specific IP means only that one.</span></div>
  <div class="kv"><span class="k">Chunk</span><span class="v">One of the JavaScript files Next splits the client code into, named with a content hash under <code>.next/static/chunks</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Standalone ships <code>server.js</code>, a traced <code>node_modules</code>, <code>.next/static</code> and <code>public/</code> — measured here as 318 MB against 1.01 GB for the build stage.</li>
<li>Keep a <code>public/</code> folder, even empty, or the <code>COPY</code> fails the build.</li>
<li><code>NEXT_PUBLIC_*</code> is baked into client chunks at build time; prove it with <code>grep -rl</code>, change it only by rebuilding.</li>
<li>Server-side code calls <code>http://api:3000</code>; the browser calls a relative <code>/api</code> through nginx.</li>
<li>Docker sets <code>HOSTNAME</code> to the container ID, and Next listens on it; bake <code>ENV HOSTNAME=0.0.0.0</code> into the image.</li>
<li>In Next 15, <code>sharp</code> arrives with Next in the standalone output — check before adding system packages.</li>
</ul>

<a class="link-card" href="https://nextjs.org/docs/app/api-reference/config/next-config-js/output" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Next.js — output: standalone</span><span class="lc-sub">What the file tracer includes, the exact <code>COPY</code> lines a Dockerfile needs, and the caveats about <code>public/</code> and <code>.next/static</code> that catch everyone once.</span></span>
</a>
<a class="link-card" href="https://nextjs.org/docs/app/guides/environment-variables" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">Next.js — environment variables</span><span class="lc-sub">The bundling rules for <code>NEXT_PUBLIC_*</code> spelled out, why the value is fixed at build time, and the runtime-config alternatives when you genuinely need one image per environment.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: containerise a Next.js app</span><span class="lc-sub">Graded exercises: write the standalone Dockerfile, prove a <code>NEXT_PUBLIC_*</code> value is in the bundle and cannot be changed at run time, and pick the right API base URL for server and browser.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> changing a <code>NEXT_PUBLIC_*</code> variable on the server, restarting the container, and finding the site unchanged. Nothing is broken — the value was substituted into the JavaScript when the image was built, and restarting a container cannot alter files inside an image. The symptom is worse than confusing when the variable was <em>missing</em> at build time: the bundle then contains <code>undefined</code>, and the code either falls back to a default nobody remembers writing or requests <code>undefined/api/posts</code>, which 404s in a way that looks like a routing bug. Two habits: prefer same-origin relative URLs so there is nothing to bake, and when you genuinely need a public build variable, pass it as a build <code>arg</code> and grep the built bundle for the value before deploying.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>output: 'standalone'</code> turns a 1.3GB image into ~190MB, but you must copy <code>public/</code> and <code>.next/static</code> yourself. <code>NEXT_PUBLIC_*</code> is fixed at build time and shipped to every browser — it is a build arg, never a runtime variable, and never a place for a third-party key. And set <code>HOSTNAME=0.0.0.0</code>, or Next listens only on the address Docker put in <code>HOSTNAME</code> — the container ID — and every check against <code>127.0.0.1</code> is refused.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Frontend: Next.js trong container</h2>
<p class="lead">Container Next.js là nơi hai ý tưởng của Docker va vào một framework có quan điểm rất mạnh về cả hai: chuyện gì xảy ra lúc DỰNG so với lúc CHẠY, và "URL của API" nghĩa là gì khi cùng một đoạn mã chạy trên máy chủ lẫn trong trình duyệt. Làm đúng hai thứ đó thì phần còn lại chỉ là một bản dựng nhiều tầng bình thường.</p>

<h3>Bản dựng standalone</h3>
${slide('dk-10', 19, 'frontend/Dockerfile: standalone chỉ cần chép ba thứ')}
<pre><code><span class="tok-comment">// next.config.js</span>
module.exports = {
  output: 'standalone',              <span class="tok-comment">// truy vết đúng những file cần để chạy</span>
  compress: false,                   <span class="tok-comment">// nginx nén gzip/brotli tốt hơn</span>
  poweredByHeader: false,
};</code></pre>
<pre><code><span class="tok-comment"># frontend/Dockerfile</span>
FROM node:22.11-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM node:22.11-alpine AS build
WORKDIR /app
ARG NEXT_PUBLIC_API_URL              <span class="tok-comment"># được nướng vào gói JS Ở ĐÂY</span>
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=&#36;{NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=&#36;{NEXT_PUBLIC_SITE_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22.11-alpine AS production
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000
WORKDIR /app
COPY --from=build /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]</code></pre>
<pre><code>docker build -t web:1.4.2 ./frontend
docker images --format '{{.Repository}}:{{.Tag}}\\t{{.Size}}' | grep -E '^web|^web-full'</code></pre>
<div class="out">web:1.4.2	187MB
web-full:1.4.2	1.31GB</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>output: 'standalone'</code></span><span class="v">Next truy vết xem máy chủ thật sự cần những file nào rồi ghi ra một <code>server.js</code> tối giản cộng một <code>node_modules</code> đã tỉa. 187MB thay vì 1,31GB, cho cùng một trang.</span></div>
  <div class="kv"><span class="k">Chép <code>.next/static</code> và <code>public</code> riêng</span><span class="v">Bản standalone cố ý loại chúng ra. Quên một trong hai là bạn có một trang web kết xuất ra mà không có CSS và không có ảnh — một triệu chứng rất dễ nhận ra.</span></div>
  <div class="kv"><span class="k"><code>HOSTNAME=0.0.0.0</code></span><span class="v"><code>server.js</code> của bản standalone nghe ở đúng địa chỉ mà <code>HOSTNAME</code> ghi, chỉ rơi về <code>0.0.0.0</code> khi biến đó rỗng — mà Docker lại đặt <code>HOSTNAME</code> trong MỌI container bằng ID của container. Thiếu dòng này, Next chỉ nghe một IP của một mạng, <code>127.0.0.1</code> bị từ chối, và healthcheck hỏng (đo thật ở bên dưới; bản cũ của dòng này nói Next mặc định gắn vào <code>localhost</code>, không đúng với mã của nó).</span></div>
  <div class="kv"><span class="k"><code>compress: false</code></span><span class="v">nginx nén tốt hơn và rẻ hơn. Nén hai lần là phí CPU ở mọi yêu cầu mà chẳng được gì.</span></div>
  <div class="kv"><span class="k">Đừng bind-mount <code>.next</code></span><span class="v">Lúc phát triển, hãy gắn mã nguồn nhưng giữ <code>/app/.next</code> và <code>/app/node_modules</code> làm volume vô danh (Bài 7.3), không thì bản dựng cũ trên máy chủ sẽ che mất bản của container.</span></div>
</div>

<h3>Chạy thử từng bước: dựng frontend và đo xem standalone tiết kiệm được gì</h3>
${slide('dk-10', 20, 'standalone: cùng trang web, ảnh nhỏ đi hơn ba lần')}
<p>Khoá đã dựng đúng Dockerfile này cho một ứng dụng Next.js 15.5 nhỏ (một trang kết xuất phía máy chủ lấy bài viết từ API, một component phía client, một logo trong <code>public/</code>). Để so với một ảnh không-standalone, khoá gắn tên cho chính tầng <code>build</code> — tầng đó chứa mọi thứ <code>next build</code> cần, đúng thứ mà một Dockerfile một tầng sẽ ship đi.</p>
<pre><code class="language-bash">docker compose build web                                      <span class="tok-comment"># ~1 phút trên Mac M1</span>
docker build --target build -t dk10-web-full:1.0.2 ./frontend
docker images --filter reference='dk10-web*'
docker run --rm dk10-web:1.0.2 du -sh /app
docker run --rm dk10-web-full:1.0.2 du -sh /app/node_modules /app/.next</code></pre>
<div class="out">IMAGE                 ID             DISK USAGE   CONTENT SIZE   EXTRA
dk10-web-full:1.0.2   050f7a053c70       1.01GB          228MB
dk10-web:1.0.0        67e0e04205b0        318MB         78.2MB   U
dk10-web:1.0.2        362bb21e989f        318MB         78.2MB   U
72.7M	/app
477.1M	/app/node_modules
114.6M	/app/.next</div>
<p>Toàn bộ ứng dụng trong ảnh standalone là 72,7 MB; phần còn lại của 318 MB là ảnh nền <code>node:22.11-alpine</code>. Tầng build mang 477 MB <code>node_modules</code> và 115 MB bộ đệm dựng trong <code>.next</code>, không thứ nào một máy chủ đang chạy cần tới. Tỉ lệ của bạn tuỳ vào thư viện bạn dùng — con số ví dụ ở trên (187 MB so với 1,31 GB) là của một ứng dụng lớn hơn; đây là một ứng dụng nhỏ, đo thật.</p>
<p>Lượt dựng còn dạy hai điều. Một, <code>COPY --from=build /app/public ./public</code> làm hỏng CẢ lượt dựng nếu dự án không có thư mục <code>public/</code> — <code>"/app/public": not found</code> — nên hãy giữ một thư mục, rỗng cũng được. Hai, tầng build làm mọi việc nặng: <code>next build</code> là bước hết bộ nhớ trên máy chủ nhỏ, và đó là lý do chương này dựng backend với frontend lần lượt từng cái.</p>

<h3>Cái bẫy NEXT_PUBLIC</h3>
${slide('dk-10', 21, 'NEXT_PUBLIC_* nướng vào JS lúc build — env lúc chạy vô ích')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Biến phía máy chủ</span><span class="lz-t">đọc lúc CHẠY, từ môi trường của container</span><span class="lz-d">Mọi thứ chỉ dùng trong <code>getServerSideProps</code>, một route handler, hay một server component. Đổi nó rồi khởi động lại container — không cần dựng lại.</span></div>
  <div class="lz-step"><span class="lz-k">Biến NEXT_PUBLIC_*</span><span class="lz-t">bị thay thẳng vào gói JS lúc DỰNG</span><span class="lz-d">Chúng trở thành chuỗi hằng nằm trong những file trình duyệt tải về. Đặt một cái trong <code>environment:</code> hoàn toàn không có tác dụng gì — giá trị đã bị đóng đinh khi <code>npm run build</code> chạy.</span></div>
  <div class="lz-step"><span class="lz-k">Nên chúng phải là build arg</span><span class="lz-t">ARG + ENV trong tầng dựng, args: trong compose</span><span class="lz-d">Điều đó cũng nghĩa là mỗi môi trường một cái ảnh: bản dựng staging và bản dựng production đúng là hai hiện vật khác nhau nếu URL công khai của chúng khác nhau.</span></div>
  <div class="lz-step"><span class="lz-k">Câu trả lời tốt hơn: URL tương đối</span><span class="lz-t">fetch('/api/posts')</span><span class="lz-d">Nếu trình duyệt nói chuyện với cùng một gốc thì chẳng có URL nào để nướng vào cả — nginx định tuyến <code>/api</code> về backend, và cùng một cái ảnh chạy ở mọi môi trường.</span></div>
</div>
<pre><code><span class="tok-comment"># Chứng minh: cái giá trị đó nằm TRONG gói JS</span>
docker run --rm web:1.4.2 sh -c 'grep -ro "https://api\\.cuongthai\\.com" .next/static/chunks | head -2'
<span class="tok-comment"># Và một biến môi trường lúc chạy chẳng đổi được gì</span>
docker run --rm -e NEXT_PUBLIC_API_URL=https://other.example web:1.4.2 \\
  sh -c 'grep -ro "other\\.example" .next/static/chunks | wc -l'</code></pre>
<div class="out">.next/static/chunks/app/page-4f1c8a.js:https://api.cuongthai.com
.next/static/chunks/main-9b2e11.js:https://api.cuongthai.com
0</div>
<pre><code class="language-bash">docker compose exec web sh -c 'grep -rl "http://localhost:18100" .next/static/chunks'
docker run --rm -e NEXT_PUBLIC_SITE_URL=https://khac.example dk10-web:1.0.2 \\
  sh -c 'grep -rl "khac.example" .next/static/chunks | wc -l'</code></pre>
<div class="out">.next/static/chunks/app/page-112490d1d7e185aa.js
0</div>
<p>Đó là cùng phép chứng minh, chạy thật trên stack của khoá, nơi build arg là <code>NEXT_PUBLIC_SITE_URL=http://localhost:18100</code>: giá trị nằm trong một chunk phía client, còn một biến môi trường mang giá trị khác lúc chạy thì không xuất hiện ở đâu cả. (Bản cũ của bài in tên chunk kiểu <code>page-4f1c8a.js</code>; Next đặt tên chunk bằng mã băm 16 ký tự như trên, và giá trị chỉ rơi vào chunk của những component phía client có dùng nó.)</p>
<div class="callout warn"><strong>Đây cũng là một luật AN TOÀN, không chỉ là chuyện vận hành.</strong> Vì giá trị <code>NEXT_PUBLIC_*</code> được gửi thẳng tới trình duyệt của mọi khách truy cập, một khoá API của bên thứ ba mang tiền tố đó là một bí mật đã công bố. Dự án này học bài đó theo cách khó: một bộ chọn GIF gọi thẳng GIPHY từ phía client bằng <code>NEXT_PUBLIC_GIPHY_API_KEY</code>, biến ấy bị thiếu lúc dựng, client lặng lẽ rơi về cái khoá beta công khai đã bị GIPHY thu hồi, và tính năng trả 403 cho tất cả mọi người. Cách chữa là một proxy backend nhỏ có xác thực — khoá nằm lại phía máy chủ dưới dạng biến lúc chạy, phản hồi được lưu đệm, và xoay khoá chỉ là khởi động lại container chứ không phải dựng lại ảnh.</div>

<h3>Hai URL cho cùng một API</h3>
${slide('dk-10', 22, 'SSR gọi api:3000, trình duyệt gọi /api — hai URL, một API')}
<pre><code><span class="tok-comment">// lib/api.ts — cùng một file chạy ở cả hai nơi</span>
const BASE = typeof window === 'undefined'
  ? process.env.INTERNAL_API_URL       <span class="tok-comment">// http://api:3000  — mạng container</span>
  : '';                                <span class="tok-comment">// cùng gốc, nginx định tuyến /api</span>

export async function getPosts() {
  const res = await fetch(&#96;&#36;{BASE}/api/v1/posts&#96;, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(&#96;posts: &#36;{res.status}&#96;);
  return res.json();
}</code></pre>
<pre><code>  web:
    image: ghcr.io/me/web:&#36;{TAG:-latest}
    build:
      context: ./frontend
      args:
        NEXT_PUBLIC_SITE_URL: &#36;{SITE_URL:-https://cuongthai.com}
    environment:
      INTERNAL_API_URL: http://api:3000    <span class="tok-comment"># lúc chạy, chỉ phía máy chủ</span>
      HOSTNAME: 0.0.0.0
    depends_on:
      api: { condition: service_healthy }
    networks: [public]
    restart: unless-stopped</code></pre>
<div class="callout ok"><strong>Kết xuất phía máy chủ đi qua mạng container; trình duyệt đi qua nginx.</strong> Đó là hai đường khác nhau và chúng cần hai địa chỉ khác nhau — <code>http://api:3000</code> không phân giải được trong trình duyệt, còn gọi <code>https://cuongthai.com/api</code> từ bên trong container thì phải đi ra khỏi máy chủ, vòng qua Internet công cộng rồi quay lại, cộng thêm độ trễ và một sự phụ thuộc vào DNS với TLS cho một cuộc gọi giữa hai container nằm trên cùng một cái máy.</div>

<h3>Ảnh, font, và cái phụ thuộc sharp</h3>
<pre><code><span class="tok-comment"># next/image cần sharp; bản dựng alpine đôi khi cần được chỉ đường</span>
FROM node:22.11-alpine AS production
RUN apk add --no-cache vips-dev fontconfig ttf-dejavu
ENV NEXT_SHARP_PATH=/app/node_modules/sharp</code></pre>
<pre><code>docker compose exec web node -e "console.log(require('sharp').format.jpeg.output ? 'sharp ok' : 'broken')"
docker compose exec web sh -c 'ls .next/static/media | head -3'</code></pre>
<div class="out">sharp ok
inter-latin-400-normal-c8a1f2.woff2
inter-latin-700-normal-9d3e4b.woff2
logo-2f8c91.svg</div>
<p>Hai ghi chú thực tế. Nếu <code>npm ci</code> chết trong lúc dựng Docker khi đang tải các tệp nhị phân dựng sẵn của sharp thì thường là trục trặc mạng thoáng qua, và thử lại sẽ thành công nhờ dùng lại các lớp đã lưu đệm. Còn nếu một lượt deploy trên con VPS nhỏ chết giữa <code>next build</code> với mã thoát 137 thì đó là bộ giết OOM: dựng frontend và backend song song trên một cái máy 6GB đã gây ra đúng chuyện đó ở đây, và đó là lý do trên máy chủ thì các lượt dựng chạy tuần tự, còn song song chỉ dành cho cái máy có đủ bộ nhớ.</p>
<div class="callout"><strong>Cập nhật cho Next.js 15 (09/2026).</strong> Mấy dòng <code>apk add vips-dev</code> và <code>NEXT_SHARP_PATH</code> ở trên đến từ các bản Next cũ, khi tối ưu ảnh lúc chạy production cần tự cài <code>sharp</code>. Ở Next 15, <code>sharp</code> được cài cùng Next và được truy vết vào bản standalone: ảnh của khoá có sẵn <code>node_modules/sharp</code> cùng bản dựng sẵn <code>@img/sharp-linuxmusl-arm64</code>, và lệnh <code>docker compose exec web node -e "const s=require('sharp'); console.log('sharp', s.versions.sharp, 'libvips', s.versions.vips)"</code> in <code>sharp 0.35.4 libvips 8.18.6</code> mà không cần gói nào thêm. Hãy kiểm phiên bản của bạn theo đúng cách đó trước khi thêm thư viện hệ thống.</div>

<h3>HOSTNAME, nói cho chính xác: vì sao Next "khởi động ngon" mà vẫn không ai gọi tới được</h3>
${slide('dk-10', 23, 'HOSTNAME: Docker tự đặt nó = ID container, Next nghe theo nó')}
<p>Máy chủ standalone quyết định nghe ở đâu bằng đúng một dòng, và Docker lặng lẽ điền sẵn cái biến mà dòng đó đọc. Đo thật:</p>
<pre><code class="language-bash">docker run --rm alpine printenv HOSTNAME                       <span class="tok-comment"># ảnh KHÔNG khai HOSTNAME</span>
docker run --rm dk10-web:1.0.2 grep -n HOSTNAME server.js
<span class="tok-comment"># chạy web với HOSTNAME = tên container, như khi ảnh không có ENV HOSTNAME</span>
docker run -d --name dk10-webtest --network dk10-blog_public --hostname dk10-webtest -e HOSTNAME=dk10-webtest dk10-web:1.0.2
docker logs dk10-webtest
docker exec dk10-webtest netstat -tln | grep 3000
docker exec dk10-webtest node -e "fetch('http://127.0.0.1:3000/').then(r=&gt;console.log(r.status)).catch(e=&gt;console.log('127.0.0.1 →', e.cause?.code))"
docker exec dk10-blog-web-1 netstat -tln | grep 3000            <span class="tok-comment"># ảnh của khoá: ENV HOSTNAME=0.0.0.0</span></code></pre>
<div class="out">f21c25392e1e
9:const hostname = process.env.HOSTNAME || '0.0.0.0'
   ▲ Next.js 15.5.26
   - Local:        http://dk10-webtest:3000
   - Network:      http://dk10-webtest:3000

 ✓ Starting...
 ✓ Ready in 105ms
tcp        0      0 172.22.0.5:3000         0.0.0.0:*               LISTEN
127.0.0.1 → ECONNREFUSED
tcp        0      0 0.0.0.0:3000            0.0.0.0:*               LISTEN</div>
<table>
<tr><th>Dòng</th><th>Nghĩa là</th></tr>
<tr><td><code>f21c25392e1e</code></td><td>Một ảnh không khai <code>HOSTNAME</code> sẽ nhận ID container trong biến đó — Docker làm vậy với mọi container.</td></tr>
<tr><td><code>process.env.HOSTNAME || '0.0.0.0'</code></td><td>Next dùng giá trị đó làm địa chỉ nghe; <code>0.0.0.0</code> chỉ là dự phòng khi biến rỗng.</td></tr>
<tr><td><code>172.22.0.5:3000 … LISTEN</code></td><td>Cái tên phân giải ra IP của container trên mạng đầu tiên của nó, nên máy chủ nghe ở đó và KHÔNG ở đâu khác. Nó vẫn in <code>Ready</code> và <code>docker ps</code> vẫn báo <em>Up</em>.</td></tr>
<tr><td><code>127.0.0.1 → ECONNREFUSED</code></td><td>Mọi thứ kiểm qua loopback — healthcheck trong file compose của ta — đều hỏng; <code>web</code> thành <code>unhealthy</code>, và nginx, vốn chờ <code>service_healthy</code>, không bao giờ được bật. Với container nằm trên hai mạng, chỉ một mạng gọi tới được.</td></tr>
<tr><td><code>0.0.0.0:3000</code></td><td>Có <code>ENV HOSTNAME=0.0.0.0</code> trong ảnh, máy chủ nghe mọi giao diện. Một dòng, đặt trong ẢNH để không ai quên nó trong compose.</td></tr>
</table>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> để demo cho giảng viên SWP391, bạn cần một bản staging hiện <code>https://staging.example</code>, nhưng một bạn cùng nhóm đã "sửa" bằng cách đặt biến qua <code>docker run -e</code> và trang vẫn hiện giá trị cũ. Dựng một ứng dụng Next.js ba file và chứng minh bằng lệnh xem giá trị đó nằm ở đâu và máy chủ nghe ở đâu.</p><ol>
<li><code>mkdir -p ~/thu-docker/next-thu/app ~/thu-docker/next-thu/public &amp;&amp; cd ~/thu-docker/next-thu</code>. Tạo các file bên dưới, chạy <code>npm install --package-lock-only</code> (lệnh <code>npm ci</code> trong Dockerfile cần file khoá phiên bản), rồi chép <code>frontend/Dockerfile</code> của bài này vào. Giữ thư mục <code>public/</code> dù nó rỗng.</li>
<li>Dựng với giá trị staging: <code>docker build --build-arg NEXT_PUBLIC_SITE_URL=https://staging.example -t thu-web:1 .</code></li>
<li>Tìm giá trị trong gói JS, rồi thử ghi đè lúc chạy: <code>docker run --rm thu-web:1 sh -c 'grep -rl "staging.example" .next/static/chunks'</code> và <code>docker run --rm -e NEXT_PUBLIC_SITE_URL=https://prod.example thu-web:1 sh -c 'grep -rl "prod.example" .next/static/chunks | wc -l'</code>.</li>
<li>Tái hiện cái bẫy HOSTNAME: <code>docker run -d --name thu-web -e HOSTNAME=thu-web --hostname thu-web thu-web:1</code>, rồi <code>docker exec thu-web node -e "fetch('http://127.0.0.1:3000/').then(r=&gt;console.log('127.0.0.1 →', r.status)).catch(e=&gt;console.log('127.0.0.1 →', e.cause?.code))"</code>. Xoá nó rồi làm lại mà không có hai cờ HOSTNAME.</li>
<li>Dọn dẹp: <code>docker rm -f thu-web; docker rmi thu-web:1</code>.</li></ol>
<pre><code class="language-bash"><span class="tok-comment"># package.json</span>
{ "private": true, "scripts": { "build": "next build" },
  "dependencies": { "next": "15.5.26", "react": "19.1.1", "react-dom": "19.1.1" } }
<span class="tok-comment"># next.config.js</span>
module.exports = { output: 'standalone' };
<span class="tok-comment"># app/layout.js</span>
export default function RootLayout({ children }) { return &lt;html&gt;&lt;body&gt;{children}&lt;/body&gt;&lt;/html&gt;; }
<span class="tok-comment"># app/page.js</span>
'use client';
export default function Home() { return &lt;p&gt;site: {process.env.NEXT_PUBLIC_SITE_URL}&lt;/p&gt;; }</code></pre>
<div class="out">.next/static/chunks/app/page-a6c38407addea0ef.js
0
127.0.0.1 → ECONNREFUSED
127.0.0.1 → 200</div>
<p>Output ghi trên máy Mac của khoá (ở đó ảnh tên <code>dk10-thu4-web:1</code>; mã băm chunk của bạn sẽ khác). Nếu lượt dựng dừng với <code>"/app/public": not found</code> là bạn đã bỏ qua thư mục <code>public/</code> rỗng.</p>
<p><strong>Đạt khi:</strong> giá trị staging nằm trong đúng một chunk, giá trị ghi đè lúc chạy nằm trong không chunk nào, phép kiểm loopback bị từ chối khi có <code>HOSTNAME=thu-web</code> và trả <code>200</code> khi không có — và bạn nói được cho bạn cùng nhóm cách sửa nào cần dựng lại ảnh.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Standalone output (bản dựng độc lập)</span><span class="v"><code>output: 'standalone'</code>: Next truy vết những file máy chủ cần và ghi ra <code>server.js</code> cùng một <code>node_modules</code> đã tỉa.</span></div>
  <div class="kv"><span class="k">Build time / run time (lúc dựng / lúc chạy)</span><span class="v">Lúc dựng là <code>next build</code> bên trong <code>docker build</code>; lúc chạy là container. Thứ gì quyết lúc dựng thì nằm TRONG ảnh.</span></div>
  <div class="kv"><span class="k"><code>NEXT_PUBLIC_*</code> (biến công khai)</span><span class="v">Biến được thay thẳng vào JavaScript của trình duyệt khi dựng — cố định, công khai, chỉ đổi được bằng cách dựng lại.</span></div>
  <div class="kv"><span class="k">Build arg (tham số lúc dựng)</span><span class="v"><code>ARG</code> trong Dockerfile, <code>build.args</code> trong compose, <code>--build-arg</code> ở dòng lệnh: một giá trị chỉ tồn tại trong lúc dựng.</span></div>
  <div class="kv"><span class="k">SSR (kết xuất phía máy chủ)</span><span class="v">HTML của trang được làm ra trong container, nên lời gọi API của nó đi qua mạng container.</span></div>
  <div class="kv"><span class="k">Listen address (địa chỉ nghe)</span><span class="v">IP mà máy chủ nhận kết nối: <code>0.0.0.0</code> là mọi giao diện, một IP cụ thể là chỉ đúng cái đó.</span></div>
  <div class="kv"><span class="k">Chunk (mảnh JS)</span><span class="v">Một trong các file JavaScript mà Next chia mã phía client ra, đặt tên bằng mã băm nội dung dưới <code>.next/static/chunks</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Standalone ship <code>server.js</code>, một <code>node_modules</code> đã truy vết, <code>.next/static</code> và <code>public/</code> — đo ở đây 318 MB so với 1,01 GB của tầng build.</li>
<li>Giữ một thư mục <code>public/</code>, rỗng cũng được, không thì lệnh <code>COPY</code> làm hỏng lượt dựng.</li>
<li><code>NEXT_PUBLIC_*</code> bị nướng vào các chunk phía client lúc dựng; chứng minh bằng <code>grep -rl</code>, chỉ đổi được bằng cách dựng lại.</li>
<li>Mã phía máy chủ gọi <code>http://api:3000</code>; trình duyệt gọi <code>/api</code> tương đối qua nginx.</li>
<li>Docker đặt <code>HOSTNAME</code> bằng ID container, và Next nghe theo nó; hãy nướng <code>ENV HOSTNAME=0.0.0.0</code> vào ảnh.</li>
<li>Ở Next 15, <code>sharp</code> đi cùng Next vào bản standalone — kiểm trước khi thêm gói hệ thống.</li>
</ul>

<a class="link-card" href="https://nextjs.org/docs/app/api-reference/config/next-config-js/output" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Next.js — output: standalone</span><span class="lc-sub">Bộ truy vết file gồm những gì, chính xác những dòng <code>COPY</code> mà một Dockerfile cần, và những lưu ý về <code>public/</code> với <code>.next/static</code> mà ai cũng vấp một lần.</span></span>
</a>
<a class="link-card" href="https://nextjs.org/docs/app/guides/environment-variables" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">Next.js — biến môi trường</span><span class="lc-sub">Luật đóng gói của <code>NEXT_PUBLIC_*</code> viết rõ ra, vì sao giá trị bị đóng đinh lúc dựng, và các phương án cấu hình lúc chạy khi bạn thật sự cần mỗi môi trường một cái ảnh.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: đóng gói một ứng dụng Next.js</span><span class="lc-sub">Bài chấm điểm: viết Dockerfile standalone, chứng minh một giá trị <code>NEXT_PUBLIC_*</code> nằm trong gói JS và không đổi được lúc chạy, và chọn đúng URL gốc của API cho phía máy chủ với phía trình duyệt.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> đổi một biến <code>NEXT_PUBLIC_*</code> trên máy chủ, khởi động lại container, rồi thấy trang web y nguyên. Chẳng có gì hỏng cả — giá trị đó đã bị thay vào JavaScript lúc cái ảnh được dựng, và khởi động lại một container thì không sửa được file nằm bên trong ảnh. Triệu chứng còn tệ hơn cả khó hiểu khi biến đó bị <em>thiếu</em> lúc dựng: gói JS khi ấy chứa <code>undefined</code>, và mã hoặc rơi về một giá trị mặc định không ai nhớ là mình đã viết, hoặc gọi tới <code>undefined/api/posts</code> rồi trả 404 theo kiểu trông hệt như một lỗi định tuyến. Hai thói quen: ưu tiên URL tương đối cùng gốc để không có gì phải nướng vào, và khi bạn thật sự cần một biến công khai lúc dựng thì hãy truyền nó dưới dạng <code>arg</code> rồi grep gói JS đã dựng tìm giá trị đó trước khi deploy.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> <code>output: 'standalone'</code> biến một cái ảnh 1,3GB thành khoảng 190MB, nhưng bạn phải tự chép <code>public/</code> và <code>.next/static</code>. <code>NEXT_PUBLIC_*</code> bị đóng đinh lúc dựng và được gửi tới mọi trình duyệt — nó là build arg, không bao giờ là biến lúc chạy, và không bao giờ là chỗ để khoá của bên thứ ba. Và hãy đặt <code>HOSTNAME=0.0.0.0</code>, không thì Next chỉ nghe ở địa chỉ Docker đã nhét vào <code>HOSTNAME</code> — ID của container — và mọi phép kiểm tới <code>127.0.0.1</code> đều bị từ chối.</p>
</div>
`,
    },
    /* ─────────────────────────── 10.5 ─────────────────────────── */
    {
      title: '10.5 — nginx in front, and the whole file|||10.5 — nginx đứng trước, và cả cái file',
      slug: 'dk-10-5-nginx-lap-rap',
      type: 'LESSON',
      description: 'Cấu hình reverse proxy đầy đủ, header chuyển tiếp, WebSocket, cache tài sản tĩnh, TLS bằng Let’s Encrypt, file compose hoàn chỉnh năm dịch vụ, và một lượt deploy chạy thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.5</span>
<h2>nginx in front, and the whole file</h2>
<p class="lead">The last service, and then the assembled result. nginx does four jobs here: it terminates TLS, routes <code>/api</code> to the backend and everything else to Next.js, serves static assets with long cache headers, and is the only container with a published port.</p>

<h3>The proxy configuration</h3>
${slide('dk-10', 24, 'ops/nginx.conf: từng dòng làm một việc')}
<pre><code><span class="tok-comment"># ops/nginx.conf</span>
upstream web { server web:3000; keepalive 32; }
upstream api { server api:3000; keepalive 32; }

map $http_upgrade $connection_upgrade {      <span class="tok-comment"># websocket support</span>
  default upgrade;
  ''      close;
}

server {
  listen 80;
  server_name cuongthai.com www.cuongthai.com;
  location = /healthz { access_log off; return 200 "ok\\n"; }   <span class="tok-comment"># for the container healthcheck</span>
  location /.well-known/acme-challenge/ { root /var/www/certbot; }   <span class="tok-comment"># certbot webroot renewals</span>
  location / { return 301 https://cuongthai.com$request_uri; }  <span class="tok-comment"># NOT at server level</span>
}

server {
  listen 443 ssl;
  http2 on;
  server_name cuongthai.com;

  ssl_certificate     /etc/letsencrypt/live/cuongthai.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/cuongthai.com/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;

  client_max_body_size 25m;                  <span class="tok-comment"># uploads; default 1m rejects them</span>
  gzip on;
  gzip_types text/css application/javascript application/json image/svg+xml;

  location /api/ {
    proxy_pass http://api;
    proxy_http_version 1.1;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade           $http_upgrade;
    proxy_set_header Connection        $connection_upgrade;
    proxy_read_timeout 300s;                 <span class="tok-comment"># streamed AI responses</span>
  }

  location /_next/static/ {                  <span class="tok-comment"># content-hashed: cache forever</span>
    proxy_pass http://web;
    proxy_cache_valid 200 365d;
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location / {
    proxy_pass http://web;
    proxy_http_version 1.1;
    proxy_set_header Host              $host;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>X-Forwarded-Proto</code></span><span class="v">Without it the app believes every request is plain HTTP, so redirects downgrade to <code>http://</code> and secure cookies are never set. Pair it with <code>app.set('trust proxy', 1)</code> in Express.</span></div>
  <div class="kv"><span class="k"><code>X-Forwarded-For</code></span><span class="v">Otherwise every client IP in your logs and rate limiter is the proxy container's address, and one abusive user rate-limits everybody.</span></div>
  <div class="kv"><span class="k"><code>client_max_body_size</code></span><span class="v">nginx's default is 1MB and it rejects larger uploads with a 413 before your app sees them. A confusing failure, because the app's own limit was set correctly.</span></div>
  <div class="kv"><span class="k"><code>proxy_read_timeout</code></span><span class="v">Default 60s. Streamed responses — an AI completion, a long export — get cut off mid-stream, which the browser reports as a network error rather than a timeout.</span></div>
  <div class="kv"><span class="k"><code>upstream</code> plus <code>keepalive</code></span><span class="v">Reuses connections instead of a new TCP handshake per request. Requires <code>proxy_http_version 1.1</code> to take effect.</span></div>
</div>
<div class="callout warn"><strong>The trailing slash in <code>proxy_pass</code> changes the path.</strong> <code>proxy_pass http://api;</code> passes <code>/api/v1/posts</code> through unchanged; <code>proxy_pass http://api/;</code> strips the <code>/api/</code> prefix and sends <code>/v1/posts</code>. Both are legitimate, and picking the wrong one gives you a 404 from a backend that is working perfectly. Decide once, then verify with <code>curl -s -o /dev/null -w "%{http_code}"</code> against a route you know exists.</div>

<h3>Run it step by step: break the path with one slash, and edit the config safely</h3>
${slide('dk-10', 25, 'Dấu / cuối proxy_pass cắt mất /api — backend khoẻ vẫn 404')}
<p>On the course's stack the proxy block is the one above (plain HTTP on port 80, published on <code>127.0.0.1:18100</code>). Add the slash, check, reload, call a route that exists:</p>
<pre><code class="language-bash">sed 's#proxy_pass http://api;#proxy_pass http://api/;#' nginx.conf.goc &gt; ops/nginx.conf   <span class="tok-comment"># ghi ĐÈ tại chỗ</span>
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload
curl -s localhost:18100/api/v1/posts</code></pre>
<div class="out">nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
…
&lt;pre&gt;Cannot GET /v1/posts&lt;/pre&gt;
…</div>
<p><code>Cannot GET /v1/posts</code> is Express's own 404 page: the request reached a perfectly healthy API with <code>/api</code> cut off. <code>nginx -t</code> was green because the syntax is fine — it cannot know what paths your backend expects. Writing the original back with <code>cat nginx.conf.goc &gt; ops/nginx.conf</code>, <code>nginx -t</code>, reload: <code>posts 200</code>.</p>
<p>Notice <em>how</em> the file was changed: <code>… &gt; ops/nginx.conf</code> writes into the existing file. That is not a style choice.</p>

<h3>Why <code>sed -i</code> on a bind-mounted config file does nothing (Linux) or breaks it (Mac)</h3>
${slide('dk-10', 26, 'sed -i + bind mount một file: Linux đọc bản CŨ, Mac mất file')}
<p>The compose file mounts a single file: <code>./ops/nginx.conf:/etc/nginx/conf.d/default.conf:ro</code>. Docker binds that file by its <em>inode</em> — the file's identity on disk — when the container starts, not by its path. <code>sed -i</code>, <code>mv</code>, <code>rsync</code> and many editors save by writing a new file and renaming it over the old one, which gives the path a new inode. Measured on both machines:</p>
<pre><code class="language-bash"><span class="tok-comment"># máy Linux nhà (Engine 29.6): nginx gắn a.conf, rồi sửa bằng sed -i</span>
ls -i a.conf; sed -i s/ban-cu/ban-moi/ a.conf; ls -i a.conf
<span class="tok-comment"># so sha256 (16 ký tự đầu) + nội dung ở hai phía</span>
docker exec dk10-ngx nginx -t</code></pre>
<div class="out">5496092 a.conf
5496093 a.conf
host:      736431d512879281  ban-moi
container: 5bebcdeea2e4cda0  ban-cu
nginx: configuration file /etc/nginx/nginx.conf test is successful</div>
<pre><code class="language-bash"><span class="tok-comment"># máy Mac (Docker Desktop): cùng thao tác trên ops/nginx.conf của stack</span>
sed -i '' 's#proxy_pass http://api;#proxy_pass http://api/;#' ops/nginx.conf
docker compose exec nginx nginx -t
docker compose exec nginx ls -la /etc/nginx/conf.d/
curl -s -o /dev/null -w '%{http_code}\\n' localhost:18100/api/v1/posts</code></pre>
<div class="out">nginx: [emerg] open() "/etc/nginx/conf.d/default.conf" failed (2: No such file or directory) in /etc/nginx/nginx.conf:31
nginx: configuration file /etc/nginx/nginx.conf test failed
-rw-r--r--    0 root     root          1196 Sep 23 19:13 default.conf
200</div>
<table>
<tr><th>Machine</th><th>What the container sees after <code>sed -i</code></th><th>Why it is dangerous</th></tr>
<tr><td>Linux</td><td>The OLD file, still — its inode lives on inside the mount. <code>nginx -t</code> checks the old config and says <em>successful</em>; <code>reload</code> reloads the old config.</td><td>Every step reports success and nothing changes. You debug the wrong thing for an hour.</td></tr>
<tr><td>Mac (Docker Desktop)</td><td>A file with link count <code>0</code> that cannot be opened. <code>nginx -t</code> fails; the running nginx keeps serving from memory (<code>200</code>).</td><td>The site works until the next restart of the container — then nginx cannot start at all.</td></tr>
</table>
<p>Three safe ways, in order of preference: mount the whole <em>directory</em> (<code>./ops/nginx:/etc/nginx/conf.d:ro</code>), which follows renames; or overwrite in place with <code>cat new.conf &gt; ops/nginx.conf</code>, which keeps the inode; or recreate the container after editing (<code>docker compose up -d --force-recreate nginx</code>). Whichever you choose, verify from inside: compare <code>sha256sum ops/nginx.conf</code> with <code>docker compose exec nginx sha256sum /etc/nginx/conf.d/default.conf</code> before you reload.</p>

<h3>TLS without a manual step</h3>
<pre><code>  nginx:
    image: nginx:1.27-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ops/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - certs:/etc/letsencrypt
      - ./ops/certbot-www:/var/www/certbot:ro
    depends_on:
      web: { condition: service_started }
      api: { condition: service_healthy }
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://127.0.0.1/healthz || exit 1"]
      interval: 30s
    networks: [public]
    restart: unless-stopped

  certbot:
    image: certbot/certbot:latest
    volumes:
      - certs:/etc/letsencrypt
      - ./ops/certbot-www:/var/www/certbot
    entrypoint: ["sh", "-c", "trap exit TERM; while :; do certbot renew --webroot -w /var/www/certbot --quiet; sleep 12h; done"]
    profiles: [tls]
    restart: unless-stopped</code></pre>
<pre><code>docker compose --profile tls up -d certbot
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload      <span class="tok-comment"># zero-downtime config reload</span></code></pre>
<div class="out">nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
2026/09/23 19:26:52 [notice] 492#492: signal process started</div>
<div class="callout warn"><strong>Three corrections to earlier versions of this lesson, each measured.</strong> (1) The port-80 server used to be <code>return 301 …</code> at server level. A <code>return</code> there runs before any <code>location</code> is chosen, so it answered every path with a redirect — including <code>/healthz</code> (tested: <code>HTTP/1.1 301 Moved Permanently</code> even with a <code>location = /healthz</code> present; <code>200 OK</code> once the redirect moved into <code>location /</code>) and the ACME challenge path that <code>certbot renew --webroot</code> needs to serve over plain HTTP. (2) The healthcheck said <code>http://localhost/healthz</code>. In an Alpine container <code>localhost</code> resolves to <code>::1</code> first, and this config listens on IPv4 only, so BusyBox <code>wget</code> got <code>Connection refused</code>; use <code>127.0.0.1</code>. (3) The reload notice printed <code>1#1</code>; it comes from the new signalling process, not PID 1 — the real run printed <code>492#492</code>.</div>
<div class="callout ok"><strong><code>nginx -s reload</code> is not a restart.</strong> The master process loads the new configuration, starts new workers with it, and lets the old workers finish the requests they are serving before exiting. No connection is dropped. Always run <code>nginx -t</code> first — a reload with a syntax error is refused and the old configuration keeps serving, but only if you find out before you have also restarted the container.</div>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Browser → nginx:443</span><span class="lz-t">the only published port on the host</span><span class="lz-d">TLS terminates here. Everything past this point is plain HTTP over a private container network that nothing outside the host can reach.</span></div>
  <div class="lz-step"><span class="lz-k">2 · nginx routes by path</span><span class="lz-t">/api → api:3000 · everything else → web:3000</span><span class="lz-d">By service name over the public network. <code>/_next/static/</code> gets a one-year immutable cache header because those filenames carry a content hash.</span></div>
  <div class="lz-step"><span class="lz-k">3 · web renders, calling api:3000</span><span class="lz-t">server-side, over the container network</span><span class="lz-d">The same request from the browser would go back out through nginx. Two paths, two addresses, one API.</span></div>
  <div class="lz-step"><span class="lz-k">4 · api → db:5432, cache:6379</span><span class="lz-t">the private, internal network</span><span class="lz-d">No published ports, no route to the internet, and no interface that nginx or web can see. The request has crossed three boundaries and only <code>api</code> could make the last one.</span></div>
</div>
<h3>One request, three boundaries — what the headers really do</h3>
${slide('dk-10', 27, 'Một request qua ba ranh giới — header nào đi theo')}
<p>The course's API has a small <code>/api/v1/whoami</code> route that echoes <code>req.ip</code>, <code>req.protocol</code> and the <code>X-Forwarded-For</code> header it received, with <code>app.set('trust proxy', 1)</code>. Three measurements through nginx:</p>
<pre><code class="language-bash">curl -s -H 'X-Forwarded-For: 1.2.3.4' localhost:18100/api/v1/whoami
head -c 30000000 /dev/zero | curl -s -o /dev/null -w 'POST 30MB: %{http_code}\\n' --data-binary @- localhost:18100/api/v1/jobs
curl -sI localhost:18100/_next/static/chunks/main-7e3ee5f404cf2956.js | grep -i cache-control</code></pre>
<div class="out">{"ip":"172.22.0.1","protocol":"http","xff":"1.2.3.4, 172.22.0.1"}
POST 30MB: 413
Cache-Control: public, max-age=31536000, immutable
Cache-Control: public, max-age=31536000, immutable</div>
<table>
<tr><th>Result</th><th>What it teaches</th></tr>
<tr><td><code>"xff":"1.2.3.4, 172.22.0.1"</code> but <code>"ip":"172.22.0.1"</code></td><td><code>$proxy_add_x_forwarded_for</code> <em>appends</em> the address nginx saw to whatever the client sent. With <code>trust proxy</code> set to <code>1</code>, Express trusts exactly one hop — the last entry — so a client cannot fake its IP by sending the header itself. <code>trust proxy: true</code> would have believed <code>1.2.3.4</code>. (On Docker Desktop the address nginx sees is the network gateway, <code>172.22.0.1</code>, because the Mac's port forwarding sits in between.)</td></tr>
<tr><td><code>POST 30MB: 413</code></td><td><code>client_max_body_size 25m</code> stops the upload at nginx; the API never sees it. A 1 KB body on the same route returned <code>202</code>.</td></tr>
<tr><td>Two <code>Cache-Control</code> lines</td><td>Next already sends <code>public, max-age=31536000, immutable</code> for <code>/_next/static</code>; the <code>add_header</code> in that location sends it a second time. Harmless here, but it is the sign that the line is redundant — remove it. The <code>proxy_cache_valid</code> line next to it does nothing at all without a <code>proxy_cache</code> zone.</td></tr>
</table>

<h3>The complete compose.yaml</h3>
<pre><code>name: blog

services:
  nginx:   { image: nginx:1.27-alpine, ports: ["80:80","443:443"], networks: [public],
             depends_on: { web: {condition: service_started}, api: {condition: service_healthy} },
             volumes: ["./ops/nginx.conf:/etc/nginx/conf.d/default.conf:ro", "certs:/etc/letsencrypt"],
             restart: unless-stopped }

  web:     { image: "ghcr.io/me/web:&#36;{TAG:-latest}", networks: [public],
             environment: { INTERNAL_API_URL: "http://api:3000", HOSTNAME: "0.0.0.0" },
             depends_on: { api: {condition: service_healthy} }, restart: unless-stopped }

  api:     { image: "ghcr.io/me/api:&#36;{TAG:-latest}", networks: [public, private],
             env_file: [.env],
             depends_on: { db: {condition: service_healthy}, cache: {condition: service_healthy},
                           migrate: {condition: service_completed_successfully} },
             restart: unless-stopped }

  worker:  { image: "ghcr.io/me/api:&#36;{TAG:-latest}", command: ["node","dist/worker.js"],
             networks: [private], env_file: [.env],
             depends_on: { migrate: {condition: service_completed_successfully} },
             restart: unless-stopped }

  migrate: { image: "ghcr.io/me/api:&#36;{TAG:-latest}", command: ["npx","prisma","migrate","deploy"],
             networks: [private], env_file: [.env],
             depends_on: { db: {condition: service_healthy} }, restart: "no" }

  db:      { image: postgres:16.4-alpine, networks: [private],
             volumes: ["pgdata:/var/lib/postgresql/data"], restart: unless-stopped }

  cache:   { image: redis:7.4-alpine, networks: [private],
             volumes: ["redisdata:/data"], restart: unless-stopped }

networks:
  public:
  private: { internal: true }

volumes:
  pgdata:
  redisdata:
  certs:</code></pre>
<p>Written inline to fit on a page; in the repository each service is the full block from Lessons 10.2 to 10.4, with healthchecks, environment and tuning. What matters is the shape: seven services, two networks, three volumes, exactly one service publishing ports, and a migration gate the API cannot start without.</p>

<h3>A deploy, end to end</h3>
${slide('dk-10', 28, 'Deploy: build → migrate riêng → up → smoke test')}
<pre><code><span class="tok-comment"># On the build machine — tag by commit, never :latest on a server</span>
export TAG=$(git rev-parse --short HEAD)
docker compose -f compose.yaml -f compose.prod.yaml build
docker compose -f compose.yaml -f compose.prod.yaml push

<span class="tok-comment"># On the server</span>
export TAG=&lt;the same sha&gt;
docker compose -f compose.yaml -f compose.prod.yaml pull
docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build
docker compose ps --format 'table {{.Service}}\\t{{.Status}}'</code></pre>
<div class="out">SERVICE   STATUS
api       Up 40 seconds (healthy)
cache     Up 52 seconds (healthy)
db        Up 52 seconds (healthy)
nginx     Up 38 seconds (healthy)
web       Up 39 seconds
worker    Up 40 seconds</div>
<pre><code><span class="tok-comment"># Smoke test: 401 or 200 means mounted, 404 means a stale or partial build</span>
for r in health posts auth/me gifs/search; do
  printf '%-16s %s\\n' "$r" "$(curl -s -o /dev/null -w '%{http_code}' https://cuongthai.com/api/v1/$r)"
done</code></pre>
<div class="out">health           200
posts            200
auth/me          401
gifs/search      401</div>
<div class="callout ok"><strong>That loop is worth putting in your deploy script.</strong> A 404 on a route you know exists means the running container is not the image you just built — a stale or partial deploy. This project's deploy script fails the deploy on any 404 for exactly that reason, after an incident where a <code>--no-build</code> deploy left production running an old <code>dist/</code> that never mounted the GIF router: the feature was dead, the container was healthy, and nothing in the logs said so. Add one param-less unauthenticated GET route per feature module to the list — and only routes that return non-404 on a bare GET, or every deploy false-fails.</div>

<h3>The same deploy on the course's stack, and a start-up cut from 22.5 s to 5.4 s</h3>
${slide('dk-10', 29, 'Khởi động 22,5 s → 5,4 s: đo, đừng đoán')}
<p>Put Lessons 10.3 and 10.5 together and the deploy that survives a bad migration is four commands. This is the order the course used for release <code>1.0.2</code>, ending with the smoke test through nginx:</p>
<pre><code class="language-bash">TAG=1.0.2 docker compose build api web             <span class="tok-comment"># tuần tự: next build tốn RAM</span>
TAG=1.0.2 docker compose run --rm migrate           <span class="tok-comment"># hỏng ở đây ⇒ bản cũ vẫn phục vụ</span>
TAG=1.0.2 docker compose up -d
for r in posts auth/me whoami nope; do
  printf '%-8s %s\\n' $r "$(curl -s -o /dev/null -w '%{http_code}' localhost:18100/api/v1/$r)"
done</code></pre>
<div class="out">All migrations have been successfully applied.
…
posts    200
auth/me  401
whoami   200
nope     404</div>
<p><code>nope</code> is a deliberate route that does not exist: a smoke test should prove it can tell a missing route from a present one. Then the start-up time. Three runs of <code>docker compose down</code> + <code>up -d</code>, measured from the first container's start to nginx's start with <code>docker inspect</code>:</p>
<table>
<tr><th>Run</th><th>Change</th><th>nginx started after</th></tr>
<tr><td>1</td><td>The file as written (<code>interval: 5s</code>, <code>npx prisma migrate deploy</code>)</td><td>22.5 s</td></tr>
<tr><td>2</td><td>+ <code>start_interval: 1s</code> on every healthcheck (Lesson 9.3): check every second while starting</td><td>10.5 s</td></tr>
<tr><td>3</td><td>+ <code>command: ["./node_modules/.bin/prisma", "migrate", "deploy"]</code> instead of <code>npx</code></td><td>5.4 s</td></tr>
</table>
<p>The second change surprised the course. With nothing to apply, the migration still took 5.4 s — and all of it was <code>npx</code>:</p>
<pre><code class="language-bash">for n in dk10-blog_private dk10-blog_public none; do
  docker run --rm --network $n dk10-api:1.0.2 node -e "…đo npx prisma --version và ./node_modules/.bin/prisma --version…"
done</code></pre>
<div class="out">dk10-blog_private    npx: 5323 ms · .bin/prisma: 266 ms
dk10-blog_public     npx: 606 ms · .bin/prisma: 262 ms
none                 npx: 5333 ms · .bin/prisma: 256 ms</div>
<p>Before running a package, <code>npx</code> tries to reach the npm registry. On the <code>internal</code> network — or with no network at all — that attempt waits about five seconds for a timeout, on every deploy, in the one container that sits on the critical path. Calling the binary directly skips the question. The general lesson is the title of the slide: every second in that timeline had a cause you could measure, and none of them was the one you would have guessed.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate edits <code>nginx.conf</code> on the server with <code>sed -i</code>, runs <code>nginx -s reload</code>, sees no error — and the site behaves exactly as before. Rebuild the trap on your machine and learn the edit that always works.</p><ol>
<li><code>mkdir -p ~/thu-docker/ngx-thu &amp;&amp; cd ~/thu-docker/ngx-thu</code>, then create a one-line site: <code>printf 'server {\\n  listen 80;\\n  location / { return 200 "ban-cu\\\\n"; }\\n}\\n' &gt; site.conf</code>.</li>
<li>Run nginx with that single file mounted: <code>docker run -d --name ngx-thu -p 127.0.0.1:18103:80 -v "$PWD/site.conf:/etc/nginx/conf.d/default.conf:ro" nginx:1.27-alpine</code>, then <code>curl -s localhost:18103</code>.</li>
<li>Edit the teammate's way: <code>sed -i 's/ban-cu/ban-moi/' site.conf</code> (Mac: <code>sed -i ''</code>), then <code>docker exec ngx-thu nginx -t</code>, <code>docker exec ngx-thu nginx -s reload</code>, <code>curl -s localhost:18103</code>.</li>
<li>Recreate the container (<code>docker rm -f ngx-thu</code> and step 2 again), then edit the safe way: <code>sed 's/ban-moi/ban-moi-2/' site.conf &gt; site.new &amp;&amp; cat site.new &gt; site.conf</code>, check <code>ls -i site.conf</code> before and after, <code>nginx -t</code>, reload, <code>curl</code>.</li>
<li>Clean up: <code>docker rm -f ngx-thu</code>.</li></ol>
<div class="out">ban-cu
nginx: configuration file /etc/nginx/nginx.conf test failed
ban-cu
…
ban-moi
58981145 site.conf
58981145 site.conf
nginx: configuration file /etc/nginx/nginx.conf test is successful
ban-moi-2</div>
<p>Output recorded on the course's Mac (container <code>dk10-thu5</code>). On Mac, step 3's <code>nginx -t</code> fails because the mounted file vanished; on Linux it passes and the reload silently keeps <code>ban-cu</code> — either way the site did not change.</p>
<p><strong>Done when:</strong> step 3 still answers <code>ban-cu</code>, step 4 shows the same inode number twice and answers <code>ban-moi-2</code> after the reload — and you can explain to your teammate why "the reload succeeded" proved nothing.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>proxy_pass</code></span><span class="v">Where nginx forwards a request. With a URI part (even just <code>/</code>) it replaces the matched location prefix; without one it passes the path unchanged.</span></div>
  <div class="kv"><span class="k"><code>X-Forwarded-For</code> / <code>-Proto</code></span><span class="v">Headers the proxy adds so the app knows the original client IP and whether the request came over HTTPS.</span></div>
  <div class="kv"><span class="k"><code>trust proxy</code></span><span class="v">Express setting: how many proxy hops to believe when reading those headers. <code>1</code> means exactly nginx.</span></div>
  <div class="kv"><span class="k">Reload</span><span class="v"><code>nginx -s reload</code>: new workers with the new config, old ones finish their requests. No dropped connections — but only after <code>nginx -t</code>.</span></div>
  <div class="kv"><span class="k">Inode</span><span class="v">A file's identity on disk. A single-file bind mount follows the inode, so replacing the file by rename is invisible (Linux) or breaks the mount (Mac).</span></div>
  <div class="kv"><span class="k">Smoke test</span><span class="v">A handful of cheap requests after a deploy — 200/401 means mounted, 404 means missing — that fail the deploy loudly.</span></div>
  <div class="kv"><span class="k"><code>start_interval</code></span><span class="v">How often a healthcheck runs during <code>start_period</code>; one second instead of the normal interval cuts every "wait until healthy".</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>nginx is the only published service: TLS, routing by path, upload limits, long timeouts for streams.</li>
<li>A trailing slash in <code>proxy_pass</code> cut <code>/api</code> and a healthy API answered <code>Cannot GET /v1/posts</code>; <code>nginx -t</code> only checks syntax.</li>
<li>Never replace a single bind-mounted file by rename: overwrite in place, mount the directory, or recreate — and compare checksums from inside.</li>
<li><code>trust proxy 1</code> plus <code>$proxy_add_x_forwarded_for</code> gives the real client IP without letting clients forge it.</li>
<li>Deploy as build → <code>run --rm migrate</code> → <code>up -d</code> → smoke test with one route that must 404.</li>
<li>Measure start-up: <code>start_interval</code> and calling <code>prisma</code> without <code>npx</code> took this stack from 22.5 s to 5.4 s.</li>
</ul>

<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">nginx — ngx_http_proxy_module</span><span class="lc-sub">The authority on <code>proxy_pass</code>, including the trailing-slash rule, buffering, timeouts and header handling. Dense, and the only place the URI-rewriting behaviour is stated exactly.</span></span>
</a>
<a class="link-card" href="https://ssl-config.mozilla.org/" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Mozilla SSL Configuration Generator</span><span class="lc-sub">Pick nginx and a compatibility level and it emits a correct, current TLS block. Better than copying cipher suites from a blog post written four years ago.</span></span>
</a>
<a class="link-card" href="https://eff-certbot.readthedocs.io/en/stable/using.html#webroot" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">certbot — the webroot plugin</span><span class="lc-sub">How the HTTP-01 challenge works with a running nginx, why the challenge directory must be shared, and the renewal hooks that reload nginx after a successful renewal.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: finish the stack</span><span class="lc-sub">Graded exercises: write the nginx block that routes <code>/api</code> and <code>/</code> correctly, explain what the trailing slash in <code>proxy_pass</code> changes, and write the smoke test a deploy script should run.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> deploying with <code>--no-build</code> after changing code, or otherwise letting the running container be an older image than you think. The stack comes up, every container reports healthy, and the site mostly works — while one router that only exists in the new code is simply absent, returning 404 on every call. Users see one broken feature; your logs show a clean start; and because <code>docker compose ps</code> says everything is up, the deploy looks successful. This exact shape has happened here twice, and the fix is mechanical rather than clever: tag images by commit SHA so the running version is a fact you can check, and end every deploy with an unauthenticated <code>curl</code> against one route per feature module, failing on 404. A deploy is not finished when the containers start; it is finished when the routes answer.</div>
<p class="note-ct"><strong>Three things to remember.</strong> The proxy must forward <code>X-Forwarded-Proto</code> and <code>X-Forwarded-For</code>, or your app gets HTTP redirects, unset secure cookies and the proxy's IP in every log line. The trailing slash in <code>proxy_pass</code> silently rewrites the path — decide it once and verify with curl. And end every deploy with a smoke test that fails on 404: containers being healthy is not the same as the routes being mounted.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.5</span>
<h2>nginx đứng trước, và cả cái file</h2>
<p class="lead">Dịch vụ cuối cùng, rồi tới kết quả đã lắp ráp. Ở đây nginx làm bốn việc: kết thúc TLS, định tuyến <code>/api</code> về backend còn mọi thứ khác về Next.js, phục vụ tài sản tĩnh với header cache dài, và là container DUY NHẤT có cổng công bố.</p>

<h3>Cấu hình proxy</h3>
${slide('dk-10', 24, 'ops/nginx.conf: từng dòng làm một việc')}
<pre><code><span class="tok-comment"># ops/nginx.conf</span>
upstream web { server web:3000; keepalive 32; }
upstream api { server api:3000; keepalive 32; }

map $http_upgrade $connection_upgrade {      <span class="tok-comment"># hỗ trợ websocket</span>
  default upgrade;
  ''      close;
}

server {
  listen 80;
  server_name cuongthai.com www.cuongthai.com;
  location = /healthz { access_log off; return 200 "ok\\n"; }   <span class="tok-comment"># cho healthcheck của container</span>
  location /.well-known/acme-challenge/ { root /var/www/certbot; }   <span class="tok-comment"># certbot gia hạn qua webroot</span>
  location / { return 301 https://cuongthai.com$request_uri; }  <span class="tok-comment"># KHÔNG đặt ở cấp server</span>
}

server {
  listen 443 ssl;
  http2 on;
  server_name cuongthai.com;

  ssl_certificate     /etc/letsencrypt/live/cuongthai.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/cuongthai.com/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;

  client_max_body_size 25m;                  <span class="tok-comment"># tải file lên; mặc định 1m sẽ từ chối</span>
  gzip on;
  gzip_types text/css application/javascript application/json image/svg+xml;

  location /api/ {
    proxy_pass http://api;
    proxy_http_version 1.1;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade           $http_upgrade;
    proxy_set_header Connection        $connection_upgrade;
    proxy_read_timeout 300s;                 <span class="tok-comment"># phản hồi AI chảy dần</span>
  }

  location /_next/static/ {                  <span class="tok-comment"># tên có băm nội dung: cache mãi mãi</span>
    proxy_pass http://web;
    proxy_cache_valid 200 365d;
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location / {
    proxy_pass http://web;
    proxy_http_version 1.1;
    proxy_set_header Host              $host;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>X-Forwarded-Proto</code></span><span class="v">Không có nó thì ứng dụng tin rằng mọi yêu cầu đều là HTTP trần, nên chuyển hướng tụt về <code>http://</code> và cookie secure không bao giờ được đặt. Hãy ghép với <code>app.set('trust proxy', 1)</code> trong Express.</span></div>
  <div class="kv"><span class="k"><code>X-Forwarded-For</code></span><span class="v">Không thì mọi IP khách trong log và trong bộ giới hạn tần suất của bạn đều là địa chỉ của container proxy, và một người dùng phá phách sẽ khoá tần suất của tất cả mọi người.</span></div>
  <div class="kv"><span class="k"><code>client_max_body_size</code></span><span class="v">Mặc định của nginx là 1MB và nó từ chối file lớn hơn bằng mã 413 TRƯỚC khi ứng dụng của bạn nhìn thấy. Một kiểu hỏng khó hiểu, vì giới hạn của chính ứng dụng đã được đặt đúng.</span></div>
  <div class="kv"><span class="k"><code>proxy_read_timeout</code></span><span class="v">Mặc định 60s. Phản hồi chảy dần — một câu trả lời AI, một lượt xuất dữ liệu dài — bị cắt giữa dòng, và trình duyệt báo cáo thành lỗi mạng chứ không phải hết giờ.</span></div>
  <div class="kv"><span class="k"><code>upstream</code> kèm <code>keepalive</code></span><span class="v">Dùng lại kết nối thay vì bắt tay TCP mới cho mỗi yêu cầu. Cần <code>proxy_http_version 1.1</code> mới có tác dụng.</span></div>
</div>
<div class="callout warn"><strong>Dấu gạch chéo cuối trong <code>proxy_pass</code> làm ĐỔI đường dẫn.</strong> <code>proxy_pass http://api;</code> chuyển <code>/api/v1/posts</code> đi nguyên vẹn; <code>proxy_pass http://api/;</code> cắt bỏ tiền tố <code>/api/</code> rồi gửi đi <code>/v1/posts</code>. Cả hai đều hợp lệ, và chọn nhầm cái cho bạn một cú 404 từ một backend đang chạy hoàn hảo. Hãy quyết một lần, rồi kiểm bằng <code>curl -s -o /dev/null -w "%{http_code}"</code> trên một tuyến bạn biết chắc là có.</div>

<h3>Chạy thử từng bước: làm hỏng đường dẫn bằng một dấu gạch chéo, và sửa file cấu hình cho an toàn</h3>
${slide('dk-10', 25, 'Dấu / cuối proxy_pass cắt mất /api — backend khoẻ vẫn 404')}
<p>Trên stack của khoá, khối proxy chính là khối ở trên (HTTP trần ở cổng 80, công bố ra <code>127.0.0.1:18100</code>). Thêm dấu gạch chéo, kiểm, nạp lại, gọi một tuyến có thật:</p>
<pre><code class="language-bash">sed 's#proxy_pass http://api;#proxy_pass http://api/;#' nginx.conf.goc &gt; ops/nginx.conf   <span class="tok-comment"># ghi ĐÈ tại chỗ</span>
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload
curl -s localhost:18100/api/v1/posts</code></pre>
<div class="out">nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
…
&lt;pre&gt;Cannot GET /v1/posts&lt;/pre&gt;
…</div>
<p><code>Cannot GET /v1/posts</code> là trang 404 của chính Express: yêu cầu đã tới một API hoàn toàn khoẻ mạnh nhưng bị cắt mất <code>/api</code>. <code>nginx -t</code> xanh vì cú pháp đúng — nó không thể biết backend của bạn chờ những đường dẫn nào. Ghi bản gốc trở lại bằng <code>cat nginx.conf.goc &gt; ops/nginx.conf</code>, <code>nginx -t</code>, reload: <code>posts 200</code>.</p>
<p>Để ý CÁCH file được sửa: <code>… &gt; ops/nginx.conf</code> ghi vào chính file đang có. Đó không phải chuyện sở thích.</p>

<h3>Vì sao <code>sed -i</code> trên file cấu hình bind mount chẳng có tác dụng (Linux) hoặc làm hỏng nó (Mac)</h3>
${slide('dk-10', 26, 'sed -i + bind mount một file: Linux đọc bản CŨ, Mac mất file')}
<p>File compose gắn một FILE ĐƠN: <code>./ops/nginx.conf:/etc/nginx/conf.d/default.conf:ro</code>. Docker gắn file đó theo <em>inode</em> — danh tính của file trên đĩa — vào lúc container khởi động, chứ không theo đường dẫn. <code>sed -i</code>, <code>mv</code>, <code>rsync</code> và nhiều trình soạn thảo lưu bằng cách ghi ra một file mới rồi đổi tên đè lên file cũ, khiến đường dẫn trỏ sang một inode mới. Đo trên cả hai máy:</p>
<pre><code class="language-bash"><span class="tok-comment"># máy Linux nhà (Engine 29.6): nginx gắn a.conf, rồi sửa bằng sed -i</span>
ls -i a.conf; sed -i s/ban-cu/ban-moi/ a.conf; ls -i a.conf
<span class="tok-comment"># so sha256 (16 ký tự đầu) + nội dung ở hai phía</span>
docker exec dk10-ngx nginx -t</code></pre>
<div class="out">5496092 a.conf
5496093 a.conf
host:      736431d512879281  ban-moi
container: 5bebcdeea2e4cda0  ban-cu
nginx: configuration file /etc/nginx/nginx.conf test is successful</div>
<pre><code class="language-bash"><span class="tok-comment"># máy Mac (Docker Desktop): cùng thao tác trên ops/nginx.conf của stack</span>
sed -i '' 's#proxy_pass http://api;#proxy_pass http://api/;#' ops/nginx.conf
docker compose exec nginx nginx -t
docker compose exec nginx ls -la /etc/nginx/conf.d/
curl -s -o /dev/null -w '%{http_code}\\n' localhost:18100/api/v1/posts</code></pre>
<div class="out">nginx: [emerg] open() "/etc/nginx/conf.d/default.conf" failed (2: No such file or directory) in /etc/nginx/nginx.conf:31
nginx: configuration file /etc/nginx/nginx.conf test failed
-rw-r--r--    0 root     root          1196 Sep 23 19:13 default.conf
200</div>
<table>
<tr><th>Máy</th><th>Container thấy gì sau <code>sed -i</code></th><th>Vì sao nguy hiểm</th></tr>
<tr><td>Linux</td><td>Vẫn là file CŨ — inode cũ sống tiếp bên trong mount. <code>nginx -t</code> kiểm cấu hình cũ và báo <em>successful</em>; <code>reload</code> nạp lại cấu hình cũ.</td><td>Mọi bước đều báo thành công mà chẳng gì thay đổi. Bạn mất một tiếng gỡ nhầm chỗ.</td></tr>
<tr><td>Mac (Docker Desktop)</td><td>Một file có số liên kết <code>0</code> và không mở được. <code>nginx -t</code> hỏng; nginx đang chạy vẫn phục vụ từ bộ nhớ (<code>200</code>).</td><td>Trang vẫn chạy cho tới lần khởi động lại container kế tiếp — khi đó nginx không lên nổi nữa.</td></tr>
</table>
<p>Ba cách an toàn, theo thứ tự nên chọn: gắn cả THƯ MỤC (<code>./ops/nginx:/etc/nginx/conf.d:ro</code>), thứ đi theo được việc đổi tên; hoặc ghi đè tại chỗ bằng <code>cat new.conf &gt; ops/nginx.conf</code>, giữ nguyên inode; hoặc tạo lại container sau khi sửa (<code>docker compose up -d --force-recreate nginx</code>). Chọn cách nào cũng phải kiểm TỪ BÊN TRONG: so <code>sha256sum ops/nginx.conf</code> với <code>docker compose exec nginx sha256sum /etc/nginx/conf.d/default.conf</code> trước khi reload.</p>

<h3>TLS mà không cần bước làm tay</h3>
<pre><code>  nginx:
    image: nginx:1.27-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ops/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - certs:/etc/letsencrypt
      - ./ops/certbot-www:/var/www/certbot:ro
    depends_on:
      web: { condition: service_started }
      api: { condition: service_healthy }
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://127.0.0.1/healthz || exit 1"]
      interval: 30s
    networks: [public]
    restart: unless-stopped

  certbot:
    image: certbot/certbot:latest
    volumes:
      - certs:/etc/letsencrypt
      - ./ops/certbot-www:/var/www/certbot
    entrypoint: ["sh", "-c", "trap exit TERM; while :; do certbot renew --webroot -w /var/www/certbot --quiet; sleep 12h; done"]
    profiles: [tls]
    restart: unless-stopped</code></pre>
<pre><code>docker compose --profile tls up -d certbot
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload      <span class="tok-comment"># nạp lại cấu hình không gián đoạn</span></code></pre>
<div class="out">nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
2026/09/23 19:26:52 [notice] 492#492: signal process started</div>
<div class="callout warn"><strong>Ba chỗ sửa so với bản cũ của bài, chỗ nào cũng đã đo.</strong> (1) Server cổng 80 trước đây đặt <code>return 301 …</code> ở cấp server. Một <code>return</code> ở đó chạy TRƯỚC khi nginx chọn <code>location</code>, nên nó trả chuyển hướng cho mọi đường dẫn — kể cả <code>/healthz</code> (đã thử: <code>HTTP/1.1 301 Moved Permanently</code> dù có <code>location = /healthz</code>; ra <code>200 OK</code> khi dời lệnh chuyển hướng vào <code>location /</code>) và cả đường dẫn thử thách ACME mà <code>certbot renew --webroot</code> cần phục vụ qua HTTP trần. (2) Healthcheck ghi <code>http://localhost/healthz</code>. Trong container Alpine, <code>localhost</code> phân giải ra <code>::1</code> (IPv6) trước, mà cấu hình này chỉ nghe IPv4, nên <code>wget</code> của BusyBox nhận <code>Connection refused</code>; hãy dùng <code>127.0.0.1</code>. (3) Dòng thông báo reload từng in <code>1#1</code>; nó đến từ tiến trình gửi tín hiệu mới sinh, không phải PID 1 — lần chạy thật in <code>492#492</code>.</div>
<div class="callout ok"><strong><code>nginx -s reload</code> không phải là khởi động lại.</strong> Tiến trình chủ nạp cấu hình mới, dựng các tiến trình con mới với cấu hình đó, và để các tiến trình con cũ phục vụ nốt những yêu cầu đang dở rồi mới thoát. Không kết nối nào bị rớt. Luôn chạy <code>nginx -t</code> trước — một lần nạp lại có lỗi cú pháp sẽ bị từ chối và cấu hình cũ tiếp tục phục vụ, nhưng chỉ khi bạn phát hiện ra TRƯỚC lúc lỡ tay khởi động lại luôn cái container.</div>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Trình duyệt → nginx:443</span><span class="lz-t">cổng công bố duy nhất trên máy chủ</span><span class="lz-d">TLS kết thúc ở đây. Mọi thứ sau điểm này là HTTP trần trên một mạng container riêng mà không gì ngoài máy chủ với tới được.</span></div>
  <div class="lz-step"><span class="lz-k">2 · nginx định tuyến theo đường dẫn</span><span class="lz-t">/api → api:3000 · còn lại → web:3000</span><span class="lz-d">Gọi bằng tên dịch vụ trên mạng công khai. <code>/_next/static/</code> nhận header cache một năm bất biến vì tên file ở đó mang mã băm nội dung.</span></div>
  <div class="lz-step"><span class="lz-k">3 · web kết xuất, gọi api:3000</span><span class="lz-t">phía máy chủ, qua mạng container</span><span class="lz-d">Cũng yêu cầu đó từ trình duyệt thì sẽ đi vòng ra ngoài qua nginx. Hai đường, hai địa chỉ, một API.</span></div>
  <div class="lz-step"><span class="lz-k">4 · api → db:5432, cache:6379</span><span class="lz-t">mạng riêng, internal</span><span class="lz-d">Không cổng công bố, không đường ra Internet, và không có giao diện nào mà nginx hay web nhìn thấy. Yêu cầu đã vượt ba ranh giới và chỉ <code>api</code> vượt được cái cuối.</span></div>
</div>
<h3>Một request qua ba ranh giới — header thật ra làm gì</h3>
${slide('dk-10', 27, 'Một request qua ba ranh giới — header nào đi theo')}
<p>API của khoá có một tuyến nhỏ <code>/api/v1/whoami</code> trả lại <code>req.ip</code>, <code>req.protocol</code> và header <code>X-Forwarded-For</code> mà nó nhận được, với <code>app.set('trust proxy', 1)</code>. Ba phép đo qua nginx:</p>
<pre><code class="language-bash">curl -s -H 'X-Forwarded-For: 1.2.3.4' localhost:18100/api/v1/whoami
head -c 30000000 /dev/zero | curl -s -o /dev/null -w 'POST 30MB: %{http_code}\\n' --data-binary @- localhost:18100/api/v1/jobs
curl -sI localhost:18100/_next/static/chunks/main-7e3ee5f404cf2956.js | grep -i cache-control</code></pre>
<div class="out">{"ip":"172.22.0.1","protocol":"http","xff":"1.2.3.4, 172.22.0.1"}
POST 30MB: 413
Cache-Control: public, max-age=31536000, immutable
Cache-Control: public, max-age=31536000, immutable</div>
<table>
<tr><th>Kết quả</th><th>Dạy điều gì</th></tr>
<tr><td><code>"xff":"1.2.3.4, 172.22.0.1"</code> nhưng <code>"ip":"172.22.0.1"</code></td><td><code>$proxy_add_x_forwarded_for</code> NỐI THÊM địa chỉ nginx nhìn thấy vào sau thứ khách gửi. Với <code>trust proxy</code> đặt <code>1</code>, Express tin đúng một chặng — mục cuối — nên khách không thể giả IP bằng cách tự gửi header. <code>trust proxy: true</code> thì đã tin <code>1.2.3.4</code>. (Trên Docker Desktop, địa chỉ nginx thấy là cổng mạng <code>172.22.0.1</code>, vì cơ chế chuyển cổng của máy Mac đứng ở giữa.)</td></tr>
<tr><td><code>POST 30MB: 413</code></td><td><code>client_max_body_size 25m</code> chặn lượt tải lên ngay ở nginx; API không bao giờ thấy nó. Một thân 1 KB gửi cùng tuyến trả <code>202</code>.</td></tr>
<tr><td>Hai dòng <code>Cache-Control</code></td><td>Next vốn đã gửi <code>public, max-age=31536000, immutable</code> cho <code>/_next/static</code>; <code>add_header</code> trong location đó gửi thêm lần hai. Ở đây vô hại, nhưng là dấu hiệu dòng đó thừa — bỏ nó đi. Dòng <code>proxy_cache_valid</code> cạnh nó thì chẳng làm gì cả khi không có vùng <code>proxy_cache</code>.</td></tr>
</table>

<h3>File compose.yaml hoàn chỉnh</h3>
<pre><code>name: blog

services:
  nginx:   { image: nginx:1.27-alpine, ports: ["80:80","443:443"], networks: [public],
             depends_on: { web: {condition: service_started}, api: {condition: service_healthy} },
             volumes: ["./ops/nginx.conf:/etc/nginx/conf.d/default.conf:ro", "certs:/etc/letsencrypt"],
             restart: unless-stopped }

  web:     { image: "ghcr.io/me/web:&#36;{TAG:-latest}", networks: [public],
             environment: { INTERNAL_API_URL: "http://api:3000", HOSTNAME: "0.0.0.0" },
             depends_on: { api: {condition: service_healthy} }, restart: unless-stopped }

  api:     { image: "ghcr.io/me/api:&#36;{TAG:-latest}", networks: [public, private],
             env_file: [.env],
             depends_on: { db: {condition: service_healthy}, cache: {condition: service_healthy},
                           migrate: {condition: service_completed_successfully} },
             restart: unless-stopped }

  worker:  { image: "ghcr.io/me/api:&#36;{TAG:-latest}", command: ["node","dist/worker.js"],
             networks: [private], env_file: [.env],
             depends_on: { migrate: {condition: service_completed_successfully} },
             restart: unless-stopped }

  migrate: { image: "ghcr.io/me/api:&#36;{TAG:-latest}", command: ["npx","prisma","migrate","deploy"],
             networks: [private], env_file: [.env],
             depends_on: { db: {condition: service_healthy} }, restart: "no" }

  db:      { image: postgres:16.4-alpine, networks: [private],
             volumes: ["pgdata:/var/lib/postgresql/data"], restart: unless-stopped }

  cache:   { image: redis:7.4-alpine, networks: [private],
             volumes: ["redisdata:/data"], restart: unless-stopped }

networks:
  public:
  private: { internal: true }

volumes:
  pgdata:
  redisdata:
  certs:</code></pre>
<p>Viết dồn một dòng cho vừa trang; trong kho mã thì mỗi dịch vụ là khối đầy đủ từ Bài 10.2 tới 10.4, có healthcheck, môi trường và phần tinh chỉnh. Thứ quan trọng là HÌNH DẠNG: bảy dịch vụ, hai mạng, ba volume, đúng một dịch vụ công bố cổng, và một cổng chặn migration mà API không thể khởi động nếu chưa qua.</p>

<h3>Một lượt deploy, từ đầu tới cuối</h3>
${slide('dk-10', 28, 'Deploy: build → migrate riêng → up → smoke test')}
<pre><code><span class="tok-comment"># Trên máy dựng — gắn nhãn theo commit, đừng bao giờ dùng :latest trên máy chủ</span>
export TAG=$(git rev-parse --short HEAD)
docker compose -f compose.yaml -f compose.prod.yaml build
docker compose -f compose.yaml -f compose.prod.yaml push

<span class="tok-comment"># Trên máy chủ</span>
export TAG=&lt;đúng cái sha đó&gt;
docker compose -f compose.yaml -f compose.prod.yaml pull
docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build
docker compose ps --format 'table {{.Service}}\\t{{.Status}}'</code></pre>
<div class="out">SERVICE   STATUS
api       Up 40 seconds (healthy)
cache     Up 52 seconds (healthy)
db        Up 52 seconds (healthy)
nginx     Up 38 seconds (healthy)
web       Up 39 seconds
worker    Up 40 seconds</div>
<pre><code><span class="tok-comment"># Chốt kiểm: 401 hoặc 200 là đã gắn, 404 là bản dựng cũ hoặc dựng dở</span>
for r in health posts auth/me gifs/search; do
  printf '%-16s %s\\n' "$r" "$(curl -s -o /dev/null -w '%{http_code}' https://cuongthai.com/api/v1/$r)"
done</code></pre>
<div class="out">health           200
posts            200
auth/me          401
gifs/search      401</div>
<div class="callout ok"><strong>Cái vòng lặp đó đáng đưa vào script deploy của bạn.</strong> Một cú 404 trên một tuyến bạn biết chắc là có nghĩa là container đang chạy KHÔNG phải cái ảnh bạn vừa dựng — một lượt deploy cũ hoặc dở dang. Script deploy của chính dự án này cho deploy THẤT BẠI khi có bất kỳ mã 404 nào, đúng vì lý do đó, sau một sự cố mà một lượt deploy <code>--no-build</code> để production chạy một thư mục <code>dist/</code> cũ vốn không bao giờ gắn router GIF: tính năng chết, container khoẻ mạnh, và trong log không có dòng nào nói ra chuyện đó. Hãy thêm một tuyến GET không tham số, không cần xác thực cho mỗi module tính năng vào danh sách — và chỉ thêm những tuyến trả về khác 404 với một lệnh GET trần, không thì mọi lượt deploy sẽ báo hỏng oan.</div>

<h3>Cùng lượt deploy đó trên stack của khoá, và thời gian khởi động rút từ 22,5 s xuống 5,4 s</h3>
${slide('dk-10', 29, 'Khởi động 22,5 s → 5,4 s: đo, đừng đoán')}
<p>Ghép Bài 10.3 với Bài 10.5 lại, lượt deploy sống sót được một migration hỏng gồm bốn lệnh. Đây là thứ tự khoá đã dùng cho bản <code>1.0.2</code>, kết thúc bằng smoke test qua nginx:</p>
<pre><code class="language-bash">TAG=1.0.2 docker compose build api web             <span class="tok-comment"># tuần tự: next build tốn RAM</span>
TAG=1.0.2 docker compose run --rm migrate           <span class="tok-comment"># hỏng ở đây ⇒ bản cũ vẫn phục vụ</span>
TAG=1.0.2 docker compose up -d
for r in posts auth/me whoami nope; do
  printf '%-8s %s\\n' $r "$(curl -s -o /dev/null -w '%{http_code}' localhost:18100/api/v1/$r)"
done</code></pre>
<div class="out">All migrations have been successfully applied.
…
posts    200
auth/me  401
whoami   200
nope     404</div>
<p><code>nope</code> là một tuyến cố ý không tồn tại: một smoke test phải chứng minh được nó phân biệt được tuyến thiếu với tuyến có. Rồi tới thời gian khởi động. Ba lần <code>docker compose down</code> + <code>up -d</code>, đo từ lúc container đầu tiên bật tới lúc nginx bật bằng <code>docker inspect</code>:</p>
<table>
<tr><th>Lần</th><th>Thay đổi</th><th>nginx bật sau</th></tr>
<tr><td>1</td><td>File như đã viết (<code>interval: 5s</code>, <code>npx prisma migrate deploy</code>)</td><td>22,5 s</td></tr>
<tr><td>2</td><td>+ <code>start_interval: 1s</code> cho mọi healthcheck (Bài 9.3): kiểm mỗi giây trong lúc khởi động</td><td>10,5 s</td></tr>
<tr><td>3</td><td>+ <code>command: ["./node_modules/.bin/prisma", "migrate", "deploy"]</code> thay cho <code>npx</code></td><td>5,4 s</td></tr>
</table>
<p>Thay đổi thứ hai làm chính khoá bất ngờ. Không có gì để áp, vậy mà migration vẫn tốn 5,4 giây — và toàn bộ số đó là của <code>npx</code>:</p>
<pre><code class="language-bash">for n in dk10-blog_private dk10-blog_public none; do
  docker run --rm --network $n dk10-api:1.0.2 node -e "…đo npx prisma --version và ./node_modules/.bin/prisma --version…"
done</code></pre>
<div class="out">dk10-blog_private    npx: 5323 ms · .bin/prisma: 266 ms
dk10-blog_public     npx: 606 ms · .bin/prisma: 262 ms
none                 npx: 5333 ms · .bin/prisma: 256 ms</div>
<p>Trước khi chạy một gói, <code>npx</code> thử liên lạc với kho npm. Trên mạng <code>internal</code> — hay khi không có mạng nào — lần thử đó chờ khoảng năm giây cho tới khi hết giờ, ở MỌI lượt deploy, trong đúng cái container nằm trên đường găng. Gọi thẳng tệp chạy là bỏ qua câu hỏi đó. Bài học chung chính là tiêu đề của slide: mỗi giây trong dòng thời gian ấy có một nguyên nhân đo được, và chẳng cái nào là cái bạn sẽ đoán.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn cùng nhóm sửa <code>nginx.conf</code> trên máy chủ bằng <code>sed -i</code>, chạy <code>nginx -s reload</code>, không thấy lỗi nào — và trang web vẫn y như cũ. Dựng lại cái bẫy trên máy bạn và học cách sửa luôn có tác dụng.</p><ol>
<li><code>mkdir -p ~/thu-docker/ngx-thu &amp;&amp; cd ~/thu-docker/ngx-thu</code>, rồi tạo một site một dòng: <code>printf 'server {\\n  listen 80;\\n  location / { return 200 "ban-cu\\\\n"; }\\n}\\n' &gt; site.conf</code>.</li>
<li>Chạy nginx gắn đúng file đơn đó: <code>docker run -d --name ngx-thu -p 127.0.0.1:18103:80 -v "$PWD/site.conf:/etc/nginx/conf.d/default.conf:ro" nginx:1.27-alpine</code>, rồi <code>curl -s localhost:18103</code>.</li>
<li>Sửa theo cách của bạn cùng nhóm: <code>sed -i 's/ban-cu/ban-moi/' site.conf</code> (Mac: <code>sed -i ''</code>), rồi <code>docker exec ngx-thu nginx -t</code>, <code>docker exec ngx-thu nginx -s reload</code>, <code>curl -s localhost:18103</code>.</li>
<li>Tạo lại container (<code>docker rm -f ngx-thu</code> rồi làm lại bước 2), rồi sửa theo cách an toàn: <code>sed 's/ban-moi/ban-moi-2/' site.conf &gt; site.new &amp;&amp; cat site.new &gt; site.conf</code>, xem <code>ls -i site.conf</code> trước và sau, <code>nginx -t</code>, reload, <code>curl</code>.</li>
<li>Dọn dẹp: <code>docker rm -f ngx-thu</code>.</li></ol>
<div class="out">ban-cu
nginx: configuration file /etc/nginx/nginx.conf test failed
ban-cu
…
ban-moi
58981145 site.conf
58981145 site.conf
nginx: configuration file /etc/nginx/nginx.conf test is successful
ban-moi-2</div>
<p>Output ghi trên máy Mac của khoá (container <code>dk10-thu5</code>). Trên Mac, <code>nginx -t</code> ở bước 3 hỏng vì file được gắn đã biến mất; trên Linux nó qua và lượt reload lặng lẽ giữ nguyên <code>ban-cu</code> — kiểu nào thì trang cũng chẳng đổi.</p>
<p><strong>Đạt khi:</strong> bước 3 vẫn trả <code>ban-cu</code>, bước 4 cho cùng một số inode hai lần và trả <code>ban-moi-2</code> sau khi reload — và bạn giải thích được cho bạn cùng nhóm vì sao "reload thành công" chẳng chứng minh được gì.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>proxy_pass</code> (chuyển tiếp)</span><span class="v">Nơi nginx chuyển yêu cầu tới. Có phần URI (dù chỉ là <code>/</code>) thì nó thay tiền tố location đã khớp; không có thì đường dẫn đi nguyên vẹn.</span></div>
  <div class="kv"><span class="k"><code>X-Forwarded-For</code> / <code>-Proto</code> (header chuyển tiếp)</span><span class="v">Header proxy thêm vào để ứng dụng biết IP gốc của khách và yêu cầu có đi qua HTTPS không.</span></div>
  <div class="kv"><span class="k"><code>trust proxy</code> (tin proxy)</span><span class="v">Thiết lập của Express: tin bao nhiêu chặng proxy khi đọc các header đó. <code>1</code> nghĩa là đúng nginx.</span></div>
  <div class="kv"><span class="k">Reload (nạp lại)</span><span class="v"><code>nginx -s reload</code>: tiến trình con mới với cấu hình mới, tiến trình cũ làm nốt yêu cầu dở. Không rớt kết nối — nhưng chỉ sau <code>nginx -t</code>.</span></div>
  <div class="kv"><span class="k">Inode (danh tính file)</span><span class="v">Danh tính của file trên đĩa. Bind mount một file bám theo inode, nên thay file bằng cách đổi tên thì vô hình (Linux) hoặc làm hỏng mount (Mac).</span></div>
  <div class="kv"><span class="k">Smoke test (thử khói)</span><span class="v">Dăm yêu cầu rẻ sau lượt deploy — 200/401 là đã gắn, 404 là thiếu — làm lượt deploy hỏng thật to.</span></div>
  <div class="kv"><span class="k"><code>start_interval</code> (nhịp lúc khởi động)</span><span class="v">Healthcheck chạy dày thế nào trong <code>start_period</code>; một giây thay vì interval thường rút ngắn mọi lần "chờ tới khi healthy".</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>nginx là dịch vụ duy nhất công bố cổng: TLS, định tuyến theo đường dẫn, giới hạn tải lên, hết giờ dài cho luồng chảy dần.</li>
<li>Một dấu gạch chéo cuối trong <code>proxy_pass</code> cắt mất <code>/api</code> và một API khoẻ mạnh trả <code>Cannot GET /v1/posts</code>; <code>nginx -t</code> chỉ kiểm cú pháp.</li>
<li>Không bao giờ thay một file bind mount đơn bằng cách đổi tên: ghi đè tại chỗ, gắn cả thư mục, hoặc tạo lại container — và so checksum từ bên trong.</li>
<li><code>trust proxy 1</code> cộng <code>$proxy_add_x_forwarded_for</code> cho IP thật của khách mà không để khách giả mạo.</li>
<li>Deploy theo build → <code>run --rm migrate</code> → <code>up -d</code> → smoke test có một tuyến phải ra 404.</li>
<li>Đo thời gian khởi động: <code>start_interval</code> và gọi <code>prisma</code> không qua <code>npx</code> đưa stack này từ 22,5 s xuống 5,4 s.</li>
</ul>

<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">nginx — ngx_http_proxy_module</span><span class="lc-sub">Bên có thẩm quyền về <code>proxy_pass</code>, gồm cả luật dấu gạch chéo cuối, đệm, hết giờ và xử lý header. Đặc, và là chỗ duy nhất nói chính xác hành vi viết lại URI.</span></span>
</a>
<a class="link-card" href="https://ssl-config.mozilla.org/" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Mozilla SSL Configuration Generator</span><span class="lc-sub">Chọn nginx và một mức tương thích rồi nó sinh ra một khối TLS đúng và cập nhật. Tốt hơn chép bộ mã hoá từ một bài blog viết bốn năm trước.</span></span>
</a>
<a class="link-card" href="https://eff-certbot.readthedocs.io/en/stable/using.html#webroot" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">certbot — plugin webroot</span><span class="lc-sub">Thử thách HTTP-01 hoạt động ra sao với một nginx đang chạy, vì sao thư mục thử thách phải dùng chung, và các hook gia hạn giúp nạp lại nginx sau một lần gia hạn thành công.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: hoàn thiện stack</span><span class="lc-sub">Bài chấm điểm: viết khối nginx định tuyến đúng <code>/api</code> với <code>/</code>, giải thích dấu gạch chéo cuối trong <code>proxy_pass</code> đổi cái gì, và viết chốt kiểm mà một script deploy nên chạy.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> deploy bằng <code>--no-build</code> sau khi đã đổi mã, hoặc bằng cách nào đó để container đang chạy là một cái ảnh cũ hơn bạn tưởng. Stack lên, mọi container báo khoẻ mạnh, và trang web phần lớn vẫn chạy — trong khi một cái router chỉ tồn tại trong mã mới thì đơn giản là vắng mặt, trả 404 ở mọi lời gọi. Người dùng thấy một tính năng hỏng; log của bạn cho thấy một lượt khởi động sạch sẽ; và vì <code>docker compose ps</code> nói mọi thứ đang lên, lượt deploy trông như thành công. Đúng hình dạng đó đã xảy ra ở đây hai lần, và cách chữa mang tính máy móc chứ không cần thông minh: gắn nhãn ảnh theo mã SHA của commit để phiên bản đang chạy là một sự thật kiểm được, và kết thúc mọi lượt deploy bằng một lệnh <code>curl</code> không xác thực trên một tuyến của mỗi module tính năng, thất bại nếu gặp 404. Một lượt deploy chưa xong khi container khởi động; nó xong khi các tuyến trả lời.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Proxy phải chuyển tiếp <code>X-Forwarded-Proto</code> và <code>X-Forwarded-For</code>, không thì ứng dụng của bạn nhận chuyển hướng HTTP, cookie secure không được đặt, và mọi dòng log đều mang IP của proxy. Dấu gạch chéo cuối trong <code>proxy_pass</code> lặng lẽ viết lại đường dẫn — hãy quyết một lần rồi kiểm bằng curl. Và hãy kết thúc mọi lượt deploy bằng một chốt kiểm thất bại khi gặp 404: container khoẻ mạnh không đồng nghĩa với các tuyến đã được gắn.</p>
</div>
`,
    },
    /* ─────────────────────────── 10.6 ─────────────────────────── */
    {
      title: '10.6 — Quiz: a real stack|||10.6 — Trắc nghiệm: một stack thật',
      slug: 'dk-10-6-quiz',
      type: 'QUIZ',
      description: 'Mười tình huống đo thật trên stack dk10-blog: nginx không thấy db, đổi POSTGRES_PASSWORD ra P1000, migration hỏng làm sập site, P3009, seed spawn tsx ENOENT, HOSTNAME của Next, NEXT_PUBLIC nướng lúc build, dấu / cuối proxy_pass, sed -i trên bind mount, và npx chờ mạng 5 giây.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, every one of them reproduced on the chapter's real stack — the outputs in the questions are what the terminal actually printed. Read the explanation after submitting, especially for the ones you got right by elimination.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can draw the stack's two networks and prove with <code>getent hosts</code> and <code>wget</code> which service can reach which, and which can reach the internet.</li>
<li>I can read the start order of a compose stack from <code>docker inspect</code> timestamps and say what each wait is waiting for.</li>
<li>I can explain why changing <code>POSTGRES_PASSWORD</code> in <code>.env</code> breaks the app, and fix it with <code>ALTER USER</code> without losing data.</li>
<li>I can deploy so that a failed migration leaves the old version serving, and recover from P3018/P3009 in the right order.</li>
<li>I can prove where a <code>NEXT_PUBLIC_*</code> value lives, and why a Next container needs <code>HOSTNAME=0.0.0.0</code>.</li>
<li>I can change an nginx config on a running stack without the trailing-slash and bind-mount traps, and finish a deploy with a smoke test.</li>
</ul>
${slide('dk-10', 31, 'Bảng tra nhanh Chương 10')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Trắc nghiệm</span>
<h2>Kiểm lại xem đọng được gì</h2>
<p class="lead">Mười tình huống, câu nào cũng đã được tái hiện trên stack thật của chương — output trong câu hỏi là thứ terminal đã thật sự in ra. Đọc phần giải thích sau khi nộp, nhất là những câu bạn đúng nhờ loại trừ.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi vẽ được hai mạng của stack và chứng minh bằng <code>getent hosts</code> và <code>wget</code> dịch vụ nào với tới dịch vụ nào, và cái nào ra được Internet.</li>
<li>Tôi đọc được thứ tự khởi động của một stack compose từ mốc thời gian của <code>docker inspect</code> và nói được mỗi lần chờ là chờ cái gì.</li>
<li>Tôi giải thích được vì sao đổi <code>POSTGRES_PASSWORD</code> trong <code>.env</code> làm hỏng ứng dụng, và sửa được bằng <code>ALTER USER</code> mà không mất dữ liệu.</li>
<li>Tôi deploy được sao cho một migration hỏng vẫn để bản cũ phục vụ, và cứu được P3018/P3009 theo đúng thứ tự.</li>
<li>Tôi chứng minh được một giá trị <code>NEXT_PUBLIC_*</code> nằm ở đâu, và vì sao container Next cần <code>HOSTNAME=0.0.0.0</code>.</li>
<li>Tôi đổi được cấu hình nginx trên stack đang chạy mà không dính bẫy dấu gạch chéo cuối lẫn bẫy bind mount, và kết thúc lượt deploy bằng smoke test.</li>
</ul>
${slide('dk-10', 31, 'Bảng tra nhanh Chương 10')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'In the stack, nginx is on `public` and db is on `private` (`internal: true`). `docker compose exec nginx getent hosts db` prints nothing. What does that mean?|||Trong stack, nginx ở `public` còn db ở `private` (`internal: true`). `docker compose exec nginx getent hosts db` không in gì. Điều đó nghĩa là gì?',
            options: [
              'Docker DNS is broken inside nginx; restarting the container will make the name resolve again|||DNS của Docker trong nginx bị hỏng; khởi động lại container sẽ làm cái tên phân giải được',
              'nginx has no interface on `private`, so the name does not exist for it — the isolation working as designed|||nginx không có giao diện nào trên `private`, nên với nó cái tên không tồn tại — cô lập đang chạy đúng thiết kế',
              'db has not published port 5432, and names only resolve for services that publish a port|||db chưa công bố cổng 5432, mà tên chỉ phân giải được cho dịch vụ có công bố cổng',
              'nginx must reach db through `api`, so the lookup has to be written as `api.db` instead|||nginx phải đi qua `api` để tới db, nên phép tra phải viết thành `api.db`',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Docker’s embedded DNS answers a service name only on networks the asking container is on; nginx is only on public, so db simply does not exist for it. Names never depend on published ports (db has none and api resolves it fine), and restarting changes nothing — it is the policy, not a fault.|||VI: DNS nhúng của Docker chỉ trả lời tên dịch vụ trên những mạng mà container đang hỏi có mặt; nginx chỉ ở public, nên với nó db đơn giản là không tồn tại. Tên không bao giờ phụ thuộc cổng công bố (db không công bố gì mà api vẫn phân giải được), và khởi động lại chẳng đổi gì — đây là chính sách, không phải lỗi.',
          },
          {
            question: 'You change the password in `.env` (both `POSTGRES_PASSWORD` and `DATABASE_URL`) and run `docker compose up -d`. migrate fails with `P1000: Authentication failed`, api stays `Created`, the site returns 502. What is the right fix?|||Bạn đổi mật khẩu trong `.env` (cả `POSTGRES_PASSWORD` lẫn `DATABASE_URL`) rồi chạy `docker compose up -d`. migrate hỏng với `P1000: Authentication failed`, api nằm ở `Created`, trang trả 502. Cách sửa đúng là gì?',
            options: [
              '`docker compose down -v` and `up -d` again, so the database is initialised with the new password|||`docker compose down -v` rồi `up -d` lại, để cơ sở dữ liệu được khởi tạo với mật khẩu mới',
              'Restart only the db container so that it re-reads `POSTGRES_PASSWORD` from the new `.env`|||Chỉ khởi động lại container db để nó đọc lại `POSTGRES_PASSWORD` từ `.env` mới',
              'Put the old password back into `DATABASE_URL` only, and keep the new one in `POSTGRES_PASSWORD`|||Chỉ trả mật khẩu cũ về `DATABASE_URL`, còn giữ mật khẩu mới trong `POSTGRES_PASSWORD`',
              'Run `ALTER USER blog PASSWORD …` through `docker compose exec db psql -U blog`, then `up -d`|||Chạy `ALTER USER blog PASSWORD …` qua `docker compose exec db psql -U blog`, rồi `up -d`',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: POSTGRES_PASSWORD is read only when the data directory is empty; the volume still holds the old hash, so the password must be changed where it lives, with ALTER USER (the course got ALTER ROLE, then 200). down -v would "work" by deleting the database; restarting db re-reads nothing; the mixed-password option keeps the leaked password in use.|||VI: POSTGRES_PASSWORD chỉ được đọc khi thư mục dữ liệu rỗng; volume vẫn giữ mã băm cũ, nên phải đổi mật khẩu ở đúng nơi nó nằm, bằng ALTER USER (khoá nhận ALTER ROLE, rồi 200). down -v "chạy được" bằng cách xoá cơ sở dữ liệu; khởi động lại db chẳng đọc lại gì; phương án trộn mật khẩu thì giữ nguyên mật khẩu đã lộ.',
          },
          {
            question: 'A release adds a NOT NULL column to a table with rows. With a plain `docker compose up -d`, migrate exits non-zero, `docker compose ps` shows api `Created`, and curl gets no answer at all. Why did the site go down if `service_completed_successfully` "stops the deploy"?|||Một bản phát hành thêm một cột NOT NULL vào bảng đã có dữ liệu. Với lệnh `docker compose up -d` trơn, migrate thoát khác 0, `docker compose ps` cho api `Created`, và curl không nhận được trả lời nào. Nếu `service_completed_successfully` "dừng lượt deploy" thì vì sao trang vẫn sập?',
            options: [
              'Compose recreated api — removing the old container — before the migration ran; the gate only kept the new one from starting|||Compose đã tạo lại api — tức xoá container cũ — trước khi migration chạy; cổng chặn chỉ ngăn cái mới khởi động',
              'The failed migration left the schema half-applied and the old api crashed on its next query|||Migration hỏng để lại schema áp dở dang và api cũ sập ở truy vấn kế tiếp',
              'nginx noticed the unhealthy migrate container and stopped routing traffic to the whole stack|||nginx thấy container migrate không khoẻ nên ngừng định tuyến cho cả stack',
              'service_completed_successfully also stops every running service whenever the gated job fails|||service_completed_successfully còn dừng mọi dịch vụ đang chạy mỗi khi việc được canh cửa hỏng',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: up -d first recreates every changed container (Recreate → Recreated), then starts them in dependency order; when migrate failed, the new api stayed Created and the old one was already gone — curl 000. Nothing crashed: Postgres rolled back the failing statement. The fix is running `docker compose run --rm migrate` before `up -d`; the old api then kept answering 200.|||VI: up -d trước hết tạo lại mọi container có thay đổi (Recreate → Recreated), rồi mới bật theo thứ tự phụ thuộc; khi migrate hỏng, api mới nằm ở Created còn api cũ đã mất — curl 000. Không có gì sập cả: Postgres lùi câu lệnh hỏng. Cách sửa là chạy `docker compose run --rm migrate` trước `up -d`; khi đó api cũ vẫn trả 200.',
          },
          {
            question: 'After a failed Prisma migration, every later `migrate deploy` prints `P3009: migrate found failed migrations in the target database`. What is the correct order of work?|||Sau một migration Prisma hỏng, mọi lần `migrate deploy` sau đều in `P3009: migrate found failed migrations in the target database`. Thứ tự làm việc đúng là gì?',
            options: [
              'Delete the failed row from `_prisma_migrations` by hand, then deploy the same migration again|||Xoá tay dòng hỏng trong `_prisma_migrations`, rồi deploy lại đúng migration đó',
              'Run `prisma migrate reset` so that the history is rebuilt cleanly from all migration files|||Chạy `prisma migrate reset` để lịch sử được dựng lại sạch sẽ từ mọi file migration',
              'Check how far it got, `migrate resolve --rolled-back` only if nothing applied, then ship a new corrected migration|||Kiểm xem nó đã chạy tới đâu, chỉ `migrate resolve --rolled-back` khi chưa có gì được áp, rồi ship một migration mới đã sửa',
              'Edit the failed migration.sql in place so that it succeeds, rebuild the image and redeploy|||Sửa ngay file migration.sql đã hỏng cho nó chạy được, dựng lại ảnh rồi deploy lại',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: The failed row (finished_at empty) blocks everything until it is resolved, and marking it rolled back is only honest if nothing was applied — here the first statement failed. Then a new migration (nullable column → UPDATE → SET NOT NULL) applied cleanly. Deleting rows by hand or editing a migration that already ran corrupts the history; reset wipes all data.|||VI: Dòng hỏng (finished_at rỗng) chặn mọi thứ cho tới khi được xử lý, và đánh dấu "đã lùi" chỉ trung thực khi chưa có gì được áp — ở đây câu lệnh đầu đã hỏng. Rồi một migration mới (cột cho phép NULL → UPDATE → SET NOT NULL) áp sạch sẽ. Xoá dòng bằng tay hay sửa một migration đã chạy làm hỏng lịch sử; reset thì xoá sạch dữ liệu.',
          },
          {
            question: '`docker compose run --rm seed` prints `Running seed command tsx prisma/seed.ts ...` and then `spawn tsx ENOENT`. The Dockerfile ends its build stage with `npm prune --omit=dev`. What happened?|||`docker compose run --rm seed` in `Running seed command tsx prisma/seed.ts ...` rồi `spawn tsx ENOENT`. Tầng build của Dockerfile kết thúc bằng `npm prune --omit=dev`. Chuyện gì đã xảy ra?',
            options: [
              '`tsx` is a devDependency and the prune removed it; compile the seed into dist/ and run it with node|||`tsx` là devDependency và lệnh prune đã xoá nó; hãy biên dịch seed vào dist/ và chạy bằng node',
              'The seed service is on the internal network, so npx could not download `tsx` from the registry|||Dịch vụ seed ở mạng internal, nên npx không tải được `tsx` từ kho npm',
              'The seed file was never copied into the image because `prisma/` is listed in .dockerignore|||File seed chưa bao giờ được chép vào ảnh vì `prisma/` nằm trong .dockerignore',
              'ENOENT means the database has no tables yet; the seed must wait for the migration to finish|||ENOENT nghĩa là cơ sở dữ liệu chưa có bảng; seed phải chờ migration chạy xong',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: ENOENT from spawn means the program itself was not found: prune deleted tsx along with the other devDependencies. Moving the seed to src/seed.ts and setting "seed": "node dist/seed.js" fixed it — and made tsc check the seed. The network story is attractive but the seed command is not run through npx; prisma/ is in the image (migrations work), and a missing table would be a Prisma error, not ENOENT.|||VI: ENOENT từ spawn nghĩa là chính chương trình không tìm thấy: prune đã xoá tsx cùng các devDependency khác. Chuyển seed vào src/seed.ts và đặt "seed": "node dist/seed.js" là sửa được — lại còn khiến tsc kiểm seed. Chuyện mạng nghe hợp lý nhưng lệnh seed không chạy qua npx; prisma/ có trong ảnh (migration vẫn chạy), còn thiếu bảng thì là lỗi của Prisma, không phải ENOENT.',
          },
          {
            question: 'A Next.js standalone container logs `Ready`, but its healthcheck on `127.0.0.1:3000` fails and `netstat -tln` shows `172.22.0.5:3000 LISTEN`. The image has no `ENV HOSTNAME`. Why?|||Một container Next.js standalone in `Ready`, nhưng healthcheck tới `127.0.0.1:3000` hỏng và `netstat -tln` cho `172.22.0.5:3000 LISTEN`. Ảnh không có `ENV HOSTNAME`. Vì sao?',
            options: [
              'Next binds to localhost by default, and inside a container localhost is unreachable from anywhere|||Next mặc định gắn vào localhost, và bên trong container localhost không ai với tới được',
              'The port 3000 is not published, so even processes inside the container cannot connect to it|||Cổng 3000 chưa được công bố, nên kể cả tiến trình trong container cũng không kết nối được',
              'The healthcheck runs before `next build` has finished, so nothing is listening at that moment yet|||Healthcheck chạy trước khi `next build` xong, nên lúc đó chưa có gì nghe ở cổng',
              'Docker sets HOSTNAME to the container ID and server.js listens on that address; set HOSTNAME=0.0.0.0|||Docker đặt HOSTNAME bằng ID container và server.js nghe ở địa chỉ đó; hãy đặt HOSTNAME=0.0.0.0',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: server.js line 9 is `process.env.HOSTNAME || "0.0.0.0"`, and Docker fills HOSTNAME with the container ID, which resolves to the container’s IP — so it listens there only and 127.0.0.1 is refused (measured: ECONNREFUSED; with the ENV, 0.0.0.0:3000). The "localhost by default" story is the attractive myth — the netstat line shows a non-loopback IP. Publishing is irrelevant inside the container, and next build ran long before, at image build time.|||VI: Dòng 9 của server.js là `process.env.HOSTNAME || "0.0.0.0"`, và Docker điền ID container vào HOSTNAME, ID đó phân giải ra IP của container — nên nó chỉ nghe ở đó và 127.0.0.1 bị từ chối (đo: ECONNREFUSED; có ENV thì 0.0.0.0:3000). Chuyện "mặc định localhost" là huyền thoại hấp dẫn — dòng netstat cho thấy một IP không phải loopback. Công bố cổng chẳng liên quan gì bên trong container, còn next build đã chạy từ lâu, lúc dựng ảnh.',
          },
          {
            question: 'You run the web image with `-e NEXT_PUBLIC_SITE_URL=https://prod.example`, but the page still shows the staging URL; `grep -rl "prod.example" .next/static/chunks | wc -l` prints 0. What must you do?|||Bạn chạy ảnh web với `-e NEXT_PUBLIC_SITE_URL=https://prod.example`, nhưng trang vẫn hiện URL staging; `grep -rl "prod.example" .next/static/chunks | wc -l` in 0. Bạn phải làm gì?',
            options: [
              'Clear the browser cache; the old bundle is cached and the new value will appear afterwards|||Xoá bộ đệm trình duyệt; gói JS cũ đang được lưu đệm và giá trị mới sẽ hiện ra sau đó',
              'Rebuild the image with `--build-arg NEXT_PUBLIC_SITE_URL=…`, or switch to a relative URL|||Dựng lại ảnh với `--build-arg NEXT_PUBLIC_SITE_URL=…`, hoặc chuyển sang URL tương đối',
              'Move the variable into `env_file:` in compose, which Next reads again at every start|||Chuyển biến vào `env_file:` trong compose, thứ Next đọc lại ở mỗi lần khởi động',
              'Rename it to a variable without the prefix so that Next reads it at run time in the browser|||Đổi tên nó thành biến không có tiền tố để Next đọc lúc chạy trong trình duyệt',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: NEXT_PUBLIC_* values are substituted into client chunks during next build — the staging value was in page-….js and the run-time value in zero files. Only a rebuild changes them (or a same-origin URL removes the need). env_file is still run-time environment; the browser cache is not the cause since the file inside the image never changed; unprefixed variables never reach the browser at all.|||VI: Giá trị NEXT_PUBLIC_* được thay vào các chunk phía client trong lúc next build — giá trị staging nằm trong page-….js còn giá trị lúc chạy thì không nằm trong file nào. Chỉ dựng lại mới đổi được (hoặc URL cùng gốc thì khỏi cần). env_file vẫn là môi trường lúc chạy; bộ đệm trình duyệt không phải nguyên nhân vì chính file trong ảnh chưa hề đổi; biến không tiền tố thì không bao giờ tới được trình duyệt.',
          },
          {
            question: 'After changing `proxy_pass http://api;` to `proxy_pass http://api/;`, `nginx -t` passes, the reload succeeds, and `curl …/api/v1/posts` returns `Cannot GET /v1/posts`. What is going on?|||Sau khi đổi `proxy_pass http://api;` thành `proxy_pass http://api/;`, `nginx -t` qua, reload thành công, và `curl …/api/v1/posts` trả `Cannot GET /v1/posts`. Chuyện gì đang xảy ra?',
            options: [
              'The api container is unhealthy and Express is serving its fallback error page|||Container api không khoẻ và Express đang phục vụ trang lỗi dự phòng',
              'The reload has not reached the worker processes yet, so wait a minute and retry the request|||Lượt reload chưa tới các tiến trình con, hãy chờ một phút rồi thử lại',
              'The URI part `/` replaces the matched `/api/` prefix, so the healthy API receives `/v1/posts`|||Phần URI `/` thay cho tiền tố `/api/` đã khớp, nên API khoẻ mạnh nhận `/v1/posts`',
              'nginx needs `proxy_http_version 1.1` for upstream blocks, otherwise it rewrites the path|||nginx cần `proxy_http_version 1.1` cho khối upstream, không thì nó viết lại đường dẫn',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: With any URI in proxy_pass, nginx replaces the location prefix with it — /api/v1/posts became /v1/posts, and "Cannot GET /v1/posts" is Express’s own 404, proof the request reached a healthy API. nginx -t only checks syntax. Reloads take effect immediately for new requests, and proxy_http_version affects keepalive, not paths.|||VI: Có URI bất kỳ trong proxy_pass thì nginx thay tiền tố location bằng nó — /api/v1/posts thành /v1/posts, và "Cannot GET /v1/posts" là trang 404 của chính Express, bằng chứng yêu cầu đã tới một API khoẻ mạnh. nginx -t chỉ kiểm cú pháp. Reload có hiệu lực ngay với yêu cầu mới, còn proxy_http_version liên quan tới keepalive, không phải đường dẫn.',
          },
          {
            question: 'On a Linux server, a teammate edits the bind-mounted `ops/nginx.conf` with `sed -i`, runs `nginx -t` (successful) and `nginx -s reload` (no error). Nothing changes. Why?|||Trên máy chủ Linux, một bạn cùng nhóm sửa `ops/nginx.conf` được bind mount bằng `sed -i`, chạy `nginx -t` (thành công) và `nginx -s reload` (không lỗi). Chẳng có gì thay đổi. Vì sao?',
            options: [
              'sed -i wrote a new file with a new inode; the single-file mount still shows the old one, so nginx tested and reloaded the old config|||sed -i ghi ra một file mới với inode mới; mount một file vẫn cho thấy file cũ, nên nginx kiểm và nạp lại cấu hình cũ',
              'The `:ro` flag on the mount blocks every change made on the host from reaching the container|||Cờ `:ro` trên mount chặn mọi thay đổi trên máy chủ đi vào container',
              'nginx caches its configuration in memory and needs a full container restart instead of a reload|||nginx lưu cấu hình trong bộ nhớ và cần khởi động lại cả container thay vì reload',
              'sed -i corrupts files with Windows line endings, so nginx silently ignored the edited lines|||sed -i làm hỏng file có kết thúc dòng kiểu Windows, nên nginx lặng lẽ bỏ qua những dòng đã sửa',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Measured on Linux: inode 5496092 → 5496093 on the host, and inside the container the checksum and content were still the old ones, so nginx -t and reload both acted on the old file. :ro only stops the container writing; reload normally does apply new config — the problem is which file it sees. Fix: overwrite in place (cat new > file), mount the directory, or recreate.|||VI: Đo trên Linux: inode 5496092 → 5496093 trên máy chủ, còn bên trong container checksum và nội dung vẫn là cái cũ, nên nginx -t và reload đều làm việc với file cũ. :ro chỉ chặn container ghi; reload bình thường vẫn áp cấu hình mới — vấn đề là nó nhìn thấy file nào. Sửa: ghi đè tại chỗ (cat mới > file), gắn cả thư mục, hoặc tạo lại container.',
          },
          {
            question: 'Every deploy, the `migrate` service (on the `internal: true` network) takes about 5.3 s even when there is nothing to apply; the same command on the public network takes 0.6 s. What is the cause and the fix?|||Ở mọi lượt deploy, dịch vụ `migrate` (trên mạng `internal: true`) mất khoảng 5,3 giây kể cả khi chẳng có gì để áp; cùng lệnh đó trên mạng public mất 0,6 giây. Nguyên nhân và cách sửa là gì?',
            options: [
              'Postgres needs five seconds to accept connections on internal networks; raise the healthcheck retries|||Postgres cần năm giây để nhận kết nối trên mạng internal; hãy tăng số lần thử của healthcheck',
              'Prisma downloads its query engine at every start; add the engine to binaryTargets to cache it|||Prisma tải engine truy vấn ở mỗi lần khởi động; thêm engine vào binaryTargets để lưu đệm',
              'The migration table is locked by the api container; start api only after migrate has finished|||Bảng migration bị container api khoá; chỉ bật api sau khi migrate xong',
              '`npx` first tries the npm registry and waits for a timeout; call `./node_modules/.bin/prisma` directly|||`npx` thử liên lạc kho npm trước và chờ hết giờ; hãy gọi thẳng `./node_modules/.bin/prisma`',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: Measured in the same image: npx prisma --version took 5323 ms on the internal network and 5333 ms with no network, 606 ms with internet; ./node_modules/.bin/prisma took ~260 ms everywhere. Switching the command cut the stack’s start-up from 10.5 s to 5.4 s. The database was already healthy, the engine is in the image, and api is already gated behind migrate.|||VI: Đo trong cùng một ảnh: npx prisma --version mất 5323 ms trên mạng internal và 5333 ms khi không có mạng, 606 ms khi có Internet; ./node_modules/.bin/prisma mất khoảng 260 ms ở mọi nơi. Đổi lệnh đã rút thời gian khởi động của stack từ 10,5 s xuống 5,4 s. Cơ sở dữ liệu đã healthy từ trước, engine có sẵn trong ảnh, và api vốn đã đứng sau cổng migrate.',
          },
        ],
      },
    },
  ],
};
