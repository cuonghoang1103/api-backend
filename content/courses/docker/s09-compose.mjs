/**
 * Docker — Chương 9: Docker Compose.
 * File đầu tiên · tra cứu dịch vụ · depends_on & healthcheck · biến & profile · nhiều file · quiz.
 * Output CHẠY THẬT Docker Compose v2.29 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → &#36;{ (bộ kiểm
 * dk-ghep-chuong chặn cả dạng có gạch chéo ngược); < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 *
 * Nâng cấp 09/2026: bài 9.0 slide (deck dk-09, 32 slide) + slide/🧪/🗂/📌 + phần "Chạy thử từng bước" trong 9.1–9.5;
 * quiz 10 câu. Output MỚI chạy thật 24/09/2026 trên Docker Desktop 4.91 / Engine 29.8 / Compose v5.5.1 (Mac M1).
 * Đã sửa 6 chỗ nói SAI so với Compose hiện hành: 22:22 hệ 60 (9.2), lệnh docker compose chạy BÊN TRONG container (9.4),
 * cổng trùng "báo lỗi" + volume cùng đích "che nhau" (9.5), khối "append rule" gọi nhầm tổ hợp file (9.5),
 * extends "không mang depends_on" (9.5), output config dạng flow bịa (9.5).
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 9 — Docker Compose|||Chương 9 — Docker Compose',
  description: 'Một file YAML mô tả cả stack, và một lệnh dựng nó lên. Chương này đi từ file compose đầu tiên tới healthcheck quyết định thứ tự khởi động, nội suy biến, profile, và cách xếp chồng nhiều file cho dev với prod.',
  lessons: [
    /* ─────────────────────────── 9.0 ─────────────────────────── */
    {
      title: '9.0 — Chapter 9 slides: Compose in pictures|||9.0 — Slide Chương 9: Compose bằng hình',
      slug: 'dk-9-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 9: giải phẫu một file compose, thứ Compose tạo ra thật, tên dự án, dòng thời gian cuộc đua depends_on đo bằng mili giây, healthcheck và job migrate, hai cái .env và thứ tự ưu tiên biến, profile, luật hợp nhất nhiều file.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">Skim these before the lessons to see the shape of Compose, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: one compose file annotated line by line, the networks, volume and containers a single <code>up</code> really creates, the millisecond timeline of the <code>depends_on</code> race, the two <code>.env</code> files and who reads each, and the merge table for stacked files.</p>
<p>Slides 3–7 belong to Lesson 9.1, 8–12 to 9.2, 13–18 to 9.3, 19–24 to 9.4 and 25–29 to 9.5. The last three are the chapter's common mistakes, a cheat sheet, and a 45-minute practice session. Every terminal on the slides is real output, recorded on 24 September 2026 on Docker Desktop 4.91 / Engine 29.8 with Docker Compose v5.5.1 (Mac M1); project names carry the course's <code>dk09-</code> prefix. The slides are in Vietnamese; the diagrams and terminals read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để thấy hình dạng của Compose, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại trong bài giảng giải thích nó: một file compose chú thích từng dòng, những mạng, volume, container mà MỘT lệnh <code>up</code> thật sự tạo ra, dòng thời gian tính bằng mili giây của cuộc đua <code>depends_on</code>, hai cái file <code>.env</code> và ai đọc cái nào, và bảng luật hợp nhất khi xếp chồng nhiều file.</p>
<p>Slide 3–7 thuộc Bài 9.1, 8–12 thuộc 9.2, 13–18 thuộc 9.3, 19–24 thuộc 9.4 và 25–29 thuộc 9.5. Ba slide cuối là những sai lầm hay gặp của chương, bảng tra nhanh và một buổi thực hành 45 phút. Mọi terminal trên slide là output THẬT, ghi ngày 24/09/2026 trên Docker Desktop 4.91 / Engine 29.8 với Docker Compose v5.5.1 (Mac M1); tên dự án mang tiền tố <code>dk09-</code> của khoá. Con số thời gian trên máy bạn sẽ khác — quy luật thì không.</p>
</div>
${gallery('dk-09', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Giải phẫu compose.yaml'], [4, 'Một lệnh up tạo ra những gì'], [5, 'Đổi tên thư mục ⇒ stack thứ hai'],
  [6, '✔ Started không có nghĩa là đang chạy'], [7, 'Lệnh hằng ngày và down -v'],
  [8, 'Cờ docker run ⇒ khoá YAML'], [9, 'image, build hay cả hai'], [10, 'YAML tự đổi kiểu dữ liệu'],
  [11, 'deploy.resources và restart'], [12, 'docker compose config'],
  [13, 'Cuộc đua depends_on tính bằng mili giây'], [14, 'healthcheck + service_healthy, có và không có start_interval'],
  [15, 'Năm con số của healthcheck'], [16, 'pg_isready qua socket báo sẵn sàng quá sớm'],
  [17, 'Job migrate và service_completed_successfully'], [18, 'Ứng dụng vẫn phải tự thử lại'],
  [19, 'Hai cái .env'], [20, 'Sáu dạng nội suy'], [21, 'Thứ tự ưu tiên của nội suy'],
  [22, 'Năm tầng biến vào container'], [23, 'Profile và cái bẫy của down'], [24, 'secrets là file, không lộ ra inspect'],
  [25, 'override tự nạp, -f tắt nó'], [26, 'Luật hợp nhất'], [27, '!reset và !override'],
  [28, 'include và extends'], [29, 'Bố cục nền + dev + prod'],
  [30, 'Sai lầm hay gặp'], [31, 'Bảng tra nhanh'], [32, 'Thực hành chương 9'],
])}
`,
    },
    /* ─────────────────────────── 9.1 ─────────────────────────── */
    {
      title: '9.1 — Your first compose file|||9.1 — File compose đầu tiên của bạn',
      slug: 'dk-9-1-file-dau-tien',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Compose giải quyết vấn đề gì, một file ba dịch vụ chạy thật, tên dự án và cách nó đặt tên mọi thứ, up/down/ps/logs/exec, và vì sao khoá version: đã chết.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Your first compose file</h2>
<p class="lead">Everything in the last three chapters was one <code>docker run</code> at a time: a network here, a volume there, five flags to remember. Compose is the file that holds all of it — the services, their networks, their volumes, their environment — so that starting the whole stack is one command, and so that the command is the same on your machine, on a colleague's, and on the server.</p>

<h3>The problem, stated honestly</h3>
<pre><code><span class="tok-comment"># What a three-service stack costs without compose</span>
docker network create --internal private
docker network create public
docker volume create pgdata
docker run -d --name db --network private -v pgdata:/var/lib/postgresql/data \\
  -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=blog postgres:16-alpine
docker run -d --name api --network private -e DATABASE_URL=postgres://... api:1.4.2
docker network connect public api
docker run -d --name proxy --network public -p 80:80 -v ./nginx.conf:/etc/nginx/nginx.conf:ro nginx:alpine</code></pre>
<p>Seven commands, and none of them is written down anywhere. The next person — including you in three months — has to reconstruct the flags from shell history, and one forgotten <code>--network</code> produces a stack that starts cleanly and does not work. The file below is the same thing, in a form you can commit.</p>

<h3>The same stack, as compose.yaml</h3>
${slide('dk-09', 3, 'Giải phẫu compose.yaml: mỗi dòng là một cờ docker run')}
${slide('dk-09', 4, 'Một lệnh up tạo 2 mạng, 1 volume, 3 container — đều mang tiền tố dự án')}
<pre><code>services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: blog
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks: [private]

  api:
    build: .
    environment:
      DATABASE_URL: postgres://postgres:secret@db:5432/blog
    networks: [private, public]
    depends_on: [db]

  proxy:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    networks: [public]

volumes:
  pgdata:

networks:
  private:
    internal: true
  public:</code></pre>
<pre><code>docker compose up -d</code></pre>
<div class="out">[+] Running 6/6
 ✔ Network blog_public      Created                          0.1s
 ✔ Network blog_private     Created                          0.1s
 ✔ Volume "blog_pgdata"     Created                          0.0s
 ✔ Container blog-db-1      Started                          0.6s
 ✔ Container blog-api-1     Started                          0.9s
 ✔ Container blog-proxy-1   Started                          1.1s</div>
<div class="callout ok"><strong>Read that output carefully — it tells you what compose did for you.</strong> It created both networks, created the volume, and started the containers in dependency order. It also <em>named</em> everything with a <code>blog_</code> / <code>blog-</code> prefix: that is the project name, and it is what makes two stacks on one machine not collide.</div>

<h3>The project name decides everything's name</h3>
${slide('dk-09', 5, 'Đổi tên thư mục ⇒ tên dự án đổi ⇒ stack thứ hai, volume rỗng')}
<pre><code>docker compose ls
docker compose ps --format 'table {{.Name}}\\t{{.Service}}\\t{{.Status}}'</code></pre>
<div class="out">NAME    STATUS      CONFIG FILES
blog    running(3)  /home/cuong/blog/compose.yaml

NAME           SERVICE   STATUS
blog-api-1     api       Up 2 minutes
blog-db-1      db        Up 2 minutes
blog-proxy-1   proxy     Up 2 minutes</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Where the name comes from</span><span class="v">The directory name, by default. Override with <code>-p myname</code>, the <code>COMPOSE_PROJECT_NAME</code> environment variable, or a top-level <code>name:</code> key in the file.</span></div>
  <div class="kv"><span class="k">Why it matters</span><span class="v">Everything is namespaced by it: containers, networks, volumes, labels. Two copies of the same stack with different project names run side by side without touching each other.</span></div>
  <div class="kv"><span class="k">The trap</span><span class="v">Rename or move the directory and compose no longer recognises the running stack — it will happily start a <em>second</em> copy, with a second set of volumes, and your data appears to have vanished. Set <code>name:</code> explicitly in any file that matters.</span></div>
  <div class="kv"><span class="k">Service name = DNS name</span><span class="v">Inside the stack, <code>db</code> resolves to the db container (Lesson 8.3). Not <code>blog-db-1</code> — although that works too. Use the short one in configuration.</span></div>
</div>

<h3>The commands you will use every day</h3>
${slide('dk-09', 7, 'Lệnh hằng ngày — và một chữ -v là mất cơ sở dữ liệu')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">up -d --build</span><span class="lz-t">create or update everything, rebuild images that changed</span><span class="lz-d">Compose diffs the running state against the file and only recreates what differs. Running it twice in a row does almost nothing the second time — that idempotence is the point.</span></div>
  <div class="lz-step"><span class="lz-k">ps · logs -f · logs --tail 50 api</span><span class="lz-t">what is running, and what is it saying</span><span class="lz-d"><code>logs -f</code> with no service follows every service at once, colour-coded. Add a service name to narrow it. This is where you live during development.</span></div>
  <div class="lz-step"><span class="lz-k">exec api sh · run --rm api npm test</span><span class="lz-t">into a running container, or a fresh throwaway one</span><span class="lz-d"><code>exec</code> needs the service up; <code>run</code> starts a new container from the same definition, which is how you run migrations and one-off tasks.</span></div>
  <div class="lz-step"><span class="lz-k">down · down -v</span><span class="lz-t">stop and remove — and the second one deletes your data</span><span class="lz-d"><code>down</code> removes containers and networks but keeps named volumes. <code>-v</code> deletes them. One character between "restart the stack" and "the development database is gone".</span></div>
</div>
<pre><code>docker compose logs --tail 3 db
docker compose exec db psql -U postgres -d blog -c '\\dt' | head -4</code></pre>
<div class="out">blog-db-1  | 2026-08-22 11:03:14.882 UTC [1] LOG:  database system is ready to accept connections
blog-db-1  | 2026-08-22 11:03:15.001 UTC [67] LOG:  checkpoint starting: time
blog-db-1  | 2026-08-22 11:03:15.114 UTC [67] LOG:  checkpoint complete
        List of relations
 Schema |   Name   | Type  |  Owner
--------+----------+-------+----------
 public | Post     | table | postgres</div>

<h3>Reading the file line by line: what each key really becomes</h3>
<p>A compose file is easier to read once you know that almost every line is a <code>docker run</code> flag you have already met, moved into YAML. Slide 3 annotates every line of the file above; the table below is the same idea in words, for the lines a beginner usually skips over.</p>
<table>
<tr><th>Line in compose.yaml</th><th>What Compose does with it</th><th>The <code>docker run</code> you no longer type</th></tr>
<tr><td><code>services:</code> → <code>db:</code></td><td>Each key under <code>services</code> becomes one container (or several, if you scale it). The key is also the DNS name other services use.</td><td><code>--name</code> (Compose builds the real name itself: <code>&lt;project&gt;-db-1</code>)</td></tr>
<tr><td><code>image: postgres:16-alpine</code></td><td>Pull if missing, then create the container from it.</td><td><code>docker run … postgres:16-alpine</code></td></tr>
<tr><td><code>build: .</code></td><td>Run <code>docker build</code> on the current folder first, then use the result. The image is named <code>&lt;project&gt;-&lt;service&gt;</code> — measured: <code>dk09-blog-api</code>.</td><td><code>docker build -t … .</code></td></tr>
<tr><td><code>environment:</code></td><td>Environment variables inside the container.</td><td><code>-e KEY=value</code></td></tr>
<tr><td><code>volumes: - pgdata:/var/lib/…</code></td><td>Mount the named volume. Compose creates it if the top-level <code>volumes:</code> declares it.</td><td><code>docker volume create</code> + <code>-v</code></td></tr>
<tr><td><code>networks: [private, public]</code></td><td>Attach to both networks at creation time.</td><td><code>--network</code> + <code>docker network connect</code></td></tr>
<tr><td><code>ports: - "80:80"</code></td><td>Publish a port on the host (Chapter 8).</td><td><code>-p 80:80</code></td></tr>
<tr><td><code>depends_on: [db]</code></td><td>Start <code>db</code> before <code>api</code>. Only the start — not "wait until ready" (see below and Lesson 9.3).</td><td>(nothing: you used to do this by typing commands in the right order)</td></tr>
<tr><td>top-level <code>volumes:</code> / <code>networks:</code></td><td>The list of shared resources Compose must create before any container.</td><td><code>docker volume create</code> / <code>docker network create</code></td></tr>
</table>

<h3>Run it step by step: bring the stack up, then check what REALLY happened</h3>
${slide('dk-09', 6, '“✔ Started” chỉ nghĩa là đã khởi động — không phải đang chạy')}
<p>This is the file above, run for real on the course Mac (Docker Desktop 4.91, Compose v5.5.1) with <code>name: dk09-blog</code> and the proxy moved to port 18090 so it cannot clash with anything else. The API is a twelve-line Node server that connects to <code>db:5432</code> once at startup. Type along in <code>~/thu-docker</code>; your project name and timings will differ, the pattern will not.</p>
<pre><code class="language-bash">docker compose up -d
docker compose ps -a --format 'table {{.Name}}\\t{{.Status}}'</code></pre>
<div class="out">[+] up 6/6
 ✔ Network dk09-blog_private   Created                                      0.0s
 ✔ Volume dk09-blog_pgdata     Created                                      0.0s
 ✔ Network dk09-blog_public    Created                                      0.0s
 ✔ Container dk09-blog-db-1    Started                                      0.3s
 ✔ Container dk09-blog-api-1   Started                                      0.4s
 ✔ Container dk09-blog-proxy-1 Started                                      0.4s
NAME                STATUS
dk09-blog-api-1     Exited (1) 2 seconds ago
dk09-blog-db-1      Up 2 seconds
dk09-blog-proxy-1   Exited (1) 2 seconds ago</div>
<p>Six green ticks — and two of the three containers are already dead. That is the most important thing to learn about the <code>up</code> output: <strong>"Started" means Docker accepted the start command, nothing more</strong>. Whether the process inside is still alive two seconds later is a separate question, and only <code>ps -a</code> answers it (without <code>-a</code>, dead containers simply vanish from the list, which is how people end up saying "the api service disappeared").</p>
<pre><code class="language-bash">docker compose logs api proxy | grep -E "Error|nginx: \\[emerg"</code></pre>
<div class="out">api-1  | Error: connect ECONNREFUSED 172.22.0.2:5432
proxy-1  | nginx: [emerg] host not found in upstream "api" in /etc/nginx/nginx.conf:2</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · api died</span><span class="lz-t">ECONNREFUSED: nobody listening on db:5432 yet</span><span class="lz-d"><code>depends_on: [db]</code> only made sure the db container was started first. Postgres needed about 0.87 s more to initialise; the API gave up after 0.17 s. Lesson 9.3 measures this race to the millisecond and fixes it.</span></div>
  <div class="lz-step"><span class="lz-k">2 · proxy died</span><span class="lz-t">nginx could not resolve "api"</span><span class="lz-d">The DNS name <code>api</code> exists only while the api container exists and is on the network. nginx resolves its upstreams once at startup, found nothing, and exited. One failure caused the other — read logs from the bottom of the dependency chain up.</span></div>
  <div class="lz-step"><span class="lz-k">3 · db lived</span><span class="lz-t">and is ready a moment later</span><span class="lz-d">Running <code>docker compose up -d</code> a second time now starts api and proxy successfully, because db is ready by then. That "it works the second time" is the classic symptom of a startup race.</span></div>
</div>
<p>Now look at what Compose actually created, without Compose — straight from Docker. Every object carries the project name, and every container carries labels that let Compose find it again later:</p>
<pre><code class="language-bash">docker network ls --filter name=dk09
docker volume ls --filter name=dk09
docker inspect dk09-blog-db-1 -f '{{range $n,$e := .NetworkSettings.Networks}}{{$n}} {{$e.DNSNames}}{{end}}'
docker inspect dk09-blog-db-1 --format '{{index .Config.Labels "com.docker.compose.project"}} {{index .Config.Labels "com.docker.compose.service"}}'</code></pre>
<div class="out">NETWORK ID     NAME                DRIVER    SCOPE
ea313eb6e2ac   dk09-blog_private   bridge    local
8989d601743c   dk09-blog_public    bridge    local
DRIVER    VOLUME NAME
local     dk09-blog_pgdata
dk09-blog_private [dk09-blog-db-1 db 9b60dcdf69ab]
dk09-blog db</div>
<table>
<tr><th>What you see</th><th>How to read it</th></tr>
<tr><td><code>dk09-blog_private</code></td><td>Networks and volumes: <code>&lt;project&gt;_&lt;name&gt;</code>, joined with an underscore.</td></tr>
<tr><td><code>dk09-blog-db-1</code></td><td>Containers: <code>&lt;project&gt;-&lt;service&gt;-&lt;number&gt;</code>, joined with hyphens. The <code>-1</code> is the replica number; <code>docker compose up --scale api=3</code> would add <code>-2</code> and <code>-3</code>.</td></tr>
<tr><td><code>[dk09-blog-db-1 db 9b60dcdf69ab]</code></td><td>The three DNS names this container answers to on that network: its full name, the service name, and its short ID. Use the service name (<code>db</code>) in configuration.</td></tr>
<tr><td><code>com.docker.compose.project</code> label</td><td>This is how Compose knows which containers belong to which project. <code>docker compose ps</code>, <code>down</code> and <code>logs</code> all filter on it — which is why a renamed folder "loses" its stack (next section).</td></tr>
</table>
<p>Finally, the difference between <code>exec</code> and <code>run</code>, measured (on the same stack after the Lesson 9.3 fix, hence <code>(healthy)</code>). <code>exec</code> enters the container that is already running; <code>run</code> creates a brand-new container from the same service definition, named <code>&lt;project&gt;-&lt;service&gt;-run-&lt;id&gt;</code>:</p>
<pre><code class="language-bash">docker compose run -d --no-deps api sleep 30
docker compose ps -a --format 'table {{.Name}}\\t{{.Service}}\\t{{.Status}}'</code></pre>
<div class="out">NAME                             SERVICE   STATUS
dk09-blog-api-1                  api       Up 4 minutes
dk09-blog-api-run-27a926fde727   api       Up Less than a second
dk09-blog-db-1                   db        Up 4 minutes (healthy)
…</div>
<div class="callout warn"><strong>Clean up only what is yours.</strong> <code>docker compose down</code> removes this project's containers and networks and nothing else; it cannot touch other projects, because it filters on the project label. That is also why you should never "clean up" with <code>docker rm -f $(docker ps -aq)</code> on a machine that runs anything else — it removes every container of every project.</div>

<h3>Two spellings, one tool — and a dead key</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>docker compose</code> (v2)</span><span class="v">A Go plugin built into the Docker CLI. This is the current tool and the one everything below assumes.</span></div>
  <div class="kv"><span class="k"><code>docker-compose</code> (v1)</span><span class="v">The old Python script, end-of-life since 2023. If a machine only has this, its behaviour differs in small annoying ways — install the plugin instead of working around it.</span></div>
  <div class="kv"><span class="k"><code>version: "3.8"</code></span><span class="v"><strong>Obsolete.</strong> The Compose Specification dropped it; v2 ignores it and prints a warning. Delete the line — it does nothing except make people think it does something.</span></div>
  <div class="kv"><span class="k">File name</span><span class="v"><code>compose.yaml</code> is the current preferred name. <code>docker-compose.yml</code> still works and is everywhere; both are found automatically.</span></div>
</div>
<pre><code>docker compose config &gt;/dev/null</code></pre>
<div class="out">WARN[0000] /home/cuong/blog/compose.yaml: the attribute &#96;version&#96; is obsolete,
it will be ignored, please remove it to avoid potential confusion</div>
<div class="callout"><strong>What Compose v5 prints (measured, Compose v5.5.1).</strong> The warning above is the older format. The current one reads <code>time="2026-09-24T01:39:30+07:00" level=warning msg="…/compose.yaml: the attribute &#96;version&#96; is obsolete, it will be ignored, please remove it to avoid potential confusion"</code> — same message, different wrapper, and the file still works. Two more format changes you will notice if you compare with older tutorials: the progress header is now <code>[+] up 6/6</code> / <code>[+] down 3/3</code> instead of <code>[+] Running 6/6</code>, and log lines are prefixed with the short <code>db-1  |</code> rather than the full <code>blog-db-1  |</code>. Same tool, same behaviour — only the printing changed.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your SWP391 teammate cloned the group repo into a folder called <code>swp391-be</code> instead of <code>backend</code>, ran <code>docker compose up -d</code>, and says "all the seed data is gone". You will reproduce that exact bug on your own machine, prove where the data really is, and make it impossible to happen again.</p><ol>
<li><code>mkdir -p ~/thu-docker/thu-shop &amp;&amp; cd ~/thu-docker/thu-shop</code>, then write a <code>compose.yaml</code> with <strong>no</strong> <code>name:</code> key: one service <code>db</code> using <code>alpine</code>, <code>command: ["sleep", "600"]</code>, and a named volume <code>data</code> mounted at <code>/data</code> (declare it in a top-level <code>volumes:</code>).</li>
<li>Before running anything, write down the names you expect for the network, the volume and the container. Then <code>docker compose up -d</code> and compare with the output.</li>
<li>Save some "data": <code>docker compose exec db sh -c 'echo "don hang 42" &gt; /data/note.txt'</code>.</li>
<li>Rename the folder like your teammate did: <code>cd .. &amp;&amp; mv thu-shop thu-shop-be &amp;&amp; cd thu-shop-be</code>, run <code>docker compose up -d</code> again, and try to read <code>/data/note.txt</code>. Then run <code>docker compose ls</code> and <code>docker volume ls --filter name=thu-shop</code>.</li>
<li>Fix it for good: add <code>name: thu-shop</code> as the first line, remove the accidental second stack with <code>docker compose -p thu-shop-be down -v</code> (that project only), run <code>docker compose up -d</code> and read the note again. Finish with <code>docker compose down -v</code>.</li></ol>
<p><strong>Done when:</strong> in step 4 you saw <code>No such file or directory</code> and two projects in <code>docker compose ls</code>; in step 5 <code>cat /data/note.txt</code> prints <code>don hang 42</code> again; and at the end <code>docker volume ls --filter name=thu-shop</code> is empty.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Docker Compose</span><span class="v">The tool that reads a YAML file describing several containers and creates all of them — plus their networks and volumes — with one command.</span></div>
  <div class="kv"><span class="k">Service</span><span class="v">One entry under <code>services:</code>. A template for one kind of container; its key is also its DNS name.</span></div>
  <div class="kv"><span class="k">Project name</span><span class="v">The prefix Compose puts on every container, network and volume. Folder name by default; set it with <code>name:</code>.</span></div>
  <div class="kv"><span class="k">Stack</span><span class="v">Informal word for "all the services of one project running together".</span></div>
  <div class="kv"><span class="k">Idempotent</span><span class="v">Running it again changes nothing if nothing changed. <code>up -d</code> twice in a row recreates nothing the second time.</span></div>
  <div class="kv"><span class="k">Label</span><span class="v">A key=value tag on a Docker object. Compose finds "its" containers through labels like <code>com.docker.compose.project</code>.</span></div>
  <div class="kv"><span class="k"><code>down</code> vs <code>down -v</code></span><span class="v">Both remove containers and networks; only <code>-v</code> also deletes the named volumes — your data.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A compose file is the written-down form of the <code>docker run</code>, <code>network create</code> and <code>volume create</code> commands you used to type by hand.</li>
<li>Every object is named after the project: <code>&lt;project&gt;_&lt;name&gt;</code> for networks/volumes, <code>&lt;project&gt;-&lt;service&gt;-1</code> for containers.</li>
<li>The project name defaults to the folder name — set <code>name:</code> so a renamed or re-cloned folder does not start a second, empty stack.</li>
<li>"✔ Started" in the <code>up</code> output only means the start command succeeded; always follow with <code>docker compose ps -a</code>.</li>
<li><code>exec</code> enters the running container; <code>run --rm</code> creates a fresh one-off container from the same service.</li>
<li><code>down</code> keeps named volumes, <code>down -v</code> deletes them — one character, no confirmation, no undo.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/compose/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Compose</span><span class="lc-sub">The overview, the CLI reference and the migration notes from v1 to v2. Start here, then keep the file reference (next lesson) open in a tab.</span></span>
</a>
<a class="link-card" href="https://github.com/compose-spec/compose-spec/blob/main/spec.md" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">The Compose Specification</span><span class="lc-sub">The actual standard, not vendor documentation: every key, its type, and its exact semantics. The authority when the docs and reality disagree.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: write your first compose file</span><span class="lc-sub">Graded exercises: turn four <code>docker run</code> commands into a compose file, predict the names compose will generate, and explain the difference between <code>down</code> and <code>down -v</code>.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> typing <code>docker compose down -v</code> out of habit when you meant <code>down</code>. The <code>-v</code> deletes every named volume in the project, which on a development machine is the database you spent an afternoon seeding, and on a server is production data. There is no confirmation prompt and no undo. Two habits protect you: never put <code>-v</code> in a shell alias or a script that is not specifically named something like <code>reset-dev-db</code>, and on any machine with data worth keeping, back up first (Lesson 7.5). If you only want to restart the stack, <code>docker compose restart</code> or <code>up -d --force-recreate</code> does what you meant, and cannot delete anything.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Compose is the file that records what seven <code>docker run</code> commands would have been, so the stack is reproducible and reviewable. The project name — the directory name unless you set <code>name:</code> — namespaces every container, network and volume, and renaming the directory silently orphans the old stack. And <code>down</code> keeps your named volumes while <code>down -v</code> deletes them; the difference is one character and there is no undo.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>File compose đầu tiên của bạn</h2>
<p class="lead">Mọi thứ trong ba chương vừa rồi đều là từng lệnh <code>docker run</code> một: một cái mạng ở đây, một cái volume ở kia, năm cái cờ phải nhớ. Compose là cái file giữ hết chỗ đó — các dịch vụ, mạng của chúng, volume của chúng, môi trường của chúng — để dựng cả stack lên chỉ còn một câu lệnh, và để câu lệnh ấy giống hệt nhau trên máy bạn, trên máy đồng nghiệp, và trên máy chủ.</p>

<h3>Vấn đề, nói cho thật</h3>
<pre><code><span class="tok-comment"># Một stack ba dịch vụ tốn bao nhiêu khi không có compose</span>
docker network create --internal private
docker network create public
docker volume create pgdata
docker run -d --name db --network private -v pgdata:/var/lib/postgresql/data \\
  -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=blog postgres:16-alpine
docker run -d --name api --network private -e DATABASE_URL=postgres://... api:1.4.2
docker network connect public api
docker run -d --name proxy --network public -p 80:80 -v ./nginx.conf:/etc/nginx/nginx.conf:ro nginx:alpine</code></pre>
<p>Bảy câu lệnh, và không câu nào được ghi lại ở đâu cả. Người tiếp theo — kể cả chính bạn ba tháng sau — phải dựng lại đám cờ đó từ lịch sử shell, và một cái <code>--network</code> bị quên sinh ra một stack khởi động sạch sẽ mà không chạy. Cái file dưới đây là đúng thứ đó, ở dạng bạn commit được.</p>

<h3>Cũng stack đó, viết thành compose.yaml</h3>
${slide('dk-09', 3, 'Giải phẫu compose.yaml: mỗi dòng là một cờ docker run')}
${slide('dk-09', 4, 'Một lệnh up tạo 2 mạng, 1 volume, 3 container — đều mang tiền tố dự án')}
<pre><code>services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: blog
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks: [private]

  api:
    build: .
    environment:
      DATABASE_URL: postgres://postgres:secret@db:5432/blog
    networks: [private, public]
    depends_on: [db]

  proxy:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    networks: [public]

volumes:
  pgdata:

networks:
  private:
    internal: true
  public:</code></pre>
<pre><code>docker compose up -d</code></pre>
<div class="out">[+] Running 6/6
 ✔ Network blog_public      Created                          0.1s
 ✔ Network blog_private     Created                          0.1s
 ✔ Volume "blog_pgdata"     Created                          0.0s
 ✔ Container blog-db-1      Started                          0.6s
 ✔ Container blog-api-1     Started                          0.9s
 ✔ Container blog-proxy-1   Started                          1.1s</div>
<div class="callout ok"><strong>Hãy đọc kỹ kết quả đó — nó nói cho bạn biết compose đã làm hộ những gì.</strong> Nó tạo cả hai mạng, tạo volume, và khởi động các container theo thứ tự phụ thuộc. Nó cũng ĐẶT TÊN cho mọi thứ với tiền tố <code>blog_</code> / <code>blog-</code>: đó là tên dự án, và chính nó khiến hai stack trên cùng một máy không giẫm lên nhau.</div>

<h3>Tên dự án quyết định tên của mọi thứ</h3>
${slide('dk-09', 5, 'Đổi tên thư mục ⇒ tên dự án đổi ⇒ stack thứ hai, volume rỗng')}
<pre><code>docker compose ls
docker compose ps --format 'table {{.Name}}\\t{{.Service}}\\t{{.Status}}'</code></pre>
<div class="out">NAME    STATUS      CONFIG FILES
blog    running(3)  /home/cuong/blog/compose.yaml

NAME           SERVICE   STATUS
blog-api-1     api       Up 2 minutes
blog-db-1      db        Up 2 minutes
blog-proxy-1   proxy     Up 2 minutes</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Cái tên đó từ đâu ra</span><span class="v">Mặc định là tên thư mục. Ghi đè bằng <code>-p tênkhác</code>, bằng biến môi trường <code>COMPOSE_PROJECT_NAME</code>, hoặc bằng khoá <code>name:</code> ở mức cao nhất trong file.</span></div>
  <div class="kv"><span class="k">Vì sao nó quan trọng</span><span class="v">Mọi thứ được đặt tên theo nó: container, mạng, volume, nhãn. Hai bản sao của cùng một stack với tên dự án khác nhau chạy song song mà không đụng nhau.</span></div>
  <div class="kv"><span class="k">Cái bẫy</span><span class="v">Đổi tên hay di chuyển thư mục là compose không nhận ra cái stack đang chạy nữa — nó sẽ vui vẻ dựng lên bản sao THỨ HAI, với một bộ volume thứ hai, và dữ liệu của bạn trông như đã bốc hơi. Hãy đặt <code>name:</code> tường minh trong mọi file quan trọng.</span></div>
  <div class="kv"><span class="k">Tên dịch vụ = tên DNS</span><span class="v">Bên trong stack, <code>db</code> phân giải ra container db (Bài 8.3). Không phải <code>blog-db-1</code> — dù cái đó cũng chạy. Hãy dùng cái ngắn trong cấu hình.</span></div>
</div>

<h3>Những câu lệnh bạn dùng mỗi ngày</h3>
${slide('dk-09', 7, 'Lệnh hằng ngày — và một chữ -v là mất cơ sở dữ liệu')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">up -d --build</span><span class="lz-t">tạo hoặc cập nhật mọi thứ, dựng lại những ảnh đã đổi</span><span class="lz-d">Compose so trạng thái đang chạy với cái file rồi chỉ dựng lại phần khác nhau. Chạy hai lần liên tiếp thì lần thứ hai gần như không làm gì — tính bất biến đó chính là điểm mấu chốt.</span></div>
  <div class="lz-step"><span class="lz-k">ps · logs -f · logs --tail 50 api</span><span class="lz-t">cái gì đang chạy, và nó đang nói gì</span><span class="lz-d"><code>logs -f</code> không kèm tên dịch vụ sẽ theo dõi mọi dịch vụ cùng lúc, phân màu. Thêm tên dịch vụ để thu hẹp lại. Đây là chỗ bạn sống lúc phát triển.</span></div>
  <div class="lz-step"><span class="lz-k">exec api sh · run --rm api npm test</span><span class="lz-t">vào một container đang chạy, hoặc một container mới dùng xong vứt</span><span class="lz-d"><code>exec</code> cần dịch vụ đang lên; <code>run</code> khởi động một container mới từ cùng định nghĩa, và đó là cách bạn chạy migration với các việc một lần.</span></div>
  <div class="lz-step"><span class="lz-k">down · down -v</span><span class="lz-t">dừng và xoá — và cái thứ hai xoá luôn dữ liệu của bạn</span><span class="lz-d"><code>down</code> xoá container và mạng nhưng GIỮ volume có tên. Thêm <code>-v</code> là xoá chúng. Một ký tự nằm giữa "khởi động lại stack" và "cơ sở dữ liệu phát triển đi mất rồi".</span></div>
</div>
<pre><code>docker compose logs --tail 3 db
docker compose exec db psql -U postgres -d blog -c '\\dt' | head -4</code></pre>
<div class="out">blog-db-1  | 2026-08-22 11:03:14.882 UTC [1] LOG:  database system is ready to accept connections
blog-db-1  | 2026-08-22 11:03:15.001 UTC [67] LOG:  checkpoint starting: time
blog-db-1  | 2026-08-22 11:03:15.114 UTC [67] LOG:  checkpoint complete
        List of relations
 Schema |   Name   | Type  |  Owner
--------+----------+-------+----------
 public | Post     | table | postgres</div>

<h3>Đọc file từng dòng: mỗi khoá thật ra biến thành cái gì</h3>
<p>File compose dễ đọc hơn hẳn khi bạn biết gần như MỌI dòng là một cái cờ <code>docker run</code> bạn đã gặp, chỉ được dời vào YAML. Slide 3 chú thích từng dòng của file ở trên; bảng dưới đây nói lại cùng ý đó bằng lời, cho những dòng người mới hay đọc lướt qua.</p>
<table>
<tr><th>Dòng trong compose.yaml</th><th>Compose làm gì với nó</th><th>Lệnh <code>docker run</code> bạn khỏi phải gõ</th></tr>
<tr><td><code>services:</code> → <code>db:</code></td><td>Mỗi khoá dưới <code>services</code> (dịch vụ) thành một container (hoặc vài cái, nếu bạn scale). Tên khoá cũng là tên DNS mà các dịch vụ khác dùng để gọi nó.</td><td><code>--name</code> (Compose tự dựng tên thật: <code>&lt;dựán&gt;-db-1</code>)</td></tr>
<tr><td><code>image: postgres:16-alpine</code></td><td>Chưa có thì kéo về, rồi tạo container từ ảnh đó.</td><td><code>docker run … postgres:16-alpine</code></td></tr>
<tr><td><code>build: .</code></td><td>Chạy <code>docker build</code> trên thư mục hiện tại trước, rồi dùng kết quả. Ảnh được đặt tên <code>&lt;dựán&gt;-&lt;dịchvụ&gt;</code> — đo thật: <code>dk09-blog-api</code>.</td><td><code>docker build -t … .</code></td></tr>
<tr><td><code>environment:</code></td><td>Biến môi trường bên trong container.</td><td><code>-e KHOÁ=giátrị</code></td></tr>
<tr><td><code>volumes: - pgdata:/var/lib/…</code></td><td>Gắn volume có tên. Compose tự tạo nó nếu khối <code>volumes:</code> ở cấp cao nhất có khai báo.</td><td><code>docker volume create</code> + <code>-v</code></td></tr>
<tr><td><code>networks: [private, public]</code></td><td>Gắn vào cả hai mạng ngay lúc tạo.</td><td><code>--network</code> + <code>docker network connect</code></td></tr>
<tr><td><code>ports: - "80:80"</code></td><td>Công bố (publish) một cổng ra máy chủ (Chương 8).</td><td><code>-p 80:80</code></td></tr>
<tr><td><code>depends_on: [db]</code></td><td>Khởi động <code>db</code> trước <code>api</code>. CHỈ lệnh khởi động — không phải "chờ tới khi sẵn sàng" (xem ngay dưới và Bài 9.3).</td><td>(không có gì: trước đây bạn làm việc này bằng cách gõ lệnh đúng thứ tự)</td></tr>
<tr><td><code>volumes:</code> / <code>networks:</code> ở cấp cao nhất</td><td>Danh sách tài nguyên dùng chung mà Compose phải tạo TRƯỚC mọi container.</td><td><code>docker volume create</code> / <code>docker network create</code></td></tr>
</table>

<h3>Chạy thử từng bước: dựng stack lên, rồi kiểm xem THẬT SỰ chuyện gì đã xảy ra</h3>
${slide('dk-09', 6, '“✔ Started” chỉ nghĩa là đã khởi động — không phải đang chạy')}
<p>Đây là đúng file ở trên, chạy thật trên máy Mac của khoá (Docker Desktop 4.91, Compose v5.5.1) với <code>name: dk09-blog</code> và proxy dời sang cổng 18090 để không đụng thứ gì khác. API là một máy chủ Node mười hai dòng, kết nối tới <code>db:5432</code> đúng một lần lúc khởi động. Gõ theo trong <code>~/thu-docker</code>; tên dự án và thời gian của bạn sẽ khác, quy luật thì không.</p>
<pre><code class="language-bash">docker compose up -d
docker compose ps -a --format 'table {{.Name}}\\t{{.Status}}'</code></pre>
<div class="out">[+] up 6/6
 ✔ Network dk09-blog_private   Created                                      0.0s
 ✔ Volume dk09-blog_pgdata     Created                                      0.0s
 ✔ Network dk09-blog_public    Created                                      0.0s
 ✔ Container dk09-blog-db-1    Started                                      0.3s
 ✔ Container dk09-blog-api-1   Started                                      0.4s
 ✔ Container dk09-blog-proxy-1 Started                                      0.4s
NAME                STATUS
dk09-blog-api-1     Exited (1) 2 seconds ago
dk09-blog-db-1      Up 2 seconds
dk09-blog-proxy-1   Exited (1) 2 seconds ago</div>
<p>Sáu dấu tích xanh — và hai trong ba container đã chết. Đó là điều quan trọng nhất cần học về output của <code>up</code>: <strong>"Started" chỉ nghĩa là Docker đã NHẬN lệnh khởi động, không hơn</strong>. Tiến trình bên trong hai giây sau còn sống hay không là một câu hỏi khác, và chỉ <code>ps -a</code> trả lời được (không có <code>-a</code> thì container đã chết đơn giản là biến khỏi danh sách — đó là lý do người ta hay kêu "dịch vụ api tự dưng biến mất").</p>
<pre><code class="language-bash">docker compose logs api proxy | grep -E "Error|nginx: \\[emerg"</code></pre>
<div class="out">api-1  | Error: connect ECONNREFUSED 172.22.0.2:5432
proxy-1  | nginx: [emerg] host not found in upstream "api" in /etc/nginx/nginx.conf:2</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · api chết</span><span class="lz-t">ECONNREFUSED (kết nối bị từ chối): chưa ai nghe ở db:5432</span><span class="lz-d"><code>depends_on: [db]</code> chỉ bảo đảm container db được khởi động trước. Postgres còn cần thêm khoảng 0,87 giây để khởi tạo; API bỏ cuộc sau 0,17 giây. Bài 9.3 đo cuộc đua này tới từng mili giây và chữa nó.</span></div>
  <div class="lz-step"><span class="lz-k">2 · proxy chết</span><span class="lz-t">nginx không phân giải được tên "api"</span><span class="lz-d">Tên DNS <code>api</code> chỉ tồn tại khi container api còn tồn tại và đang ở trong mạng. nginx phân giải upstream (máy phía sau) đúng một lần lúc khởi động, không thấy gì, và thoát. Hỏng cái này kéo theo cái kia — hãy đọc log từ đáy chuỗi phụ thuộc đi lên.</span></div>
  <div class="lz-step"><span class="lz-k">3 · db sống</span><span class="lz-t">và sẵn sàng ngay sau đó</span><span class="lz-d">Chạy <code>docker compose up -d</code> lần thứ hai thì api và proxy lên được, vì lúc đó db đã sẵn sàng. Kiểu "chạy lần hai thì được" chính là triệu chứng kinh điển của một cuộc đua lúc khởi động (race condition).</span></div>
</div>
<p>Giờ hãy nhìn xem Compose thật sự đã tạo ra những gì, không qua Compose — hỏi thẳng Docker. Mọi đối tượng đều mang tên dự án, và mọi container đều mang nhãn (label) để về sau Compose tìm lại được nó:</p>
<pre><code class="language-bash">docker network ls --filter name=dk09
docker volume ls --filter name=dk09
docker inspect dk09-blog-db-1 -f '{{range $n,$e := .NetworkSettings.Networks}}{{$n}} {{$e.DNSNames}}{{end}}'
docker inspect dk09-blog-db-1 --format '{{index .Config.Labels "com.docker.compose.project"}} {{index .Config.Labels "com.docker.compose.service"}}'</code></pre>
<div class="out">NETWORK ID     NAME                DRIVER    SCOPE
ea313eb6e2ac   dk09-blog_private   bridge    local
8989d601743c   dk09-blog_public    bridge    local
DRIVER    VOLUME NAME
local     dk09-blog_pgdata
dk09-blog_private [dk09-blog-db-1 db 9b60dcdf69ab]
dk09-blog db</div>
<table>
<tr><th>Bạn thấy</th><th>Đọc thế nào</th></tr>
<tr><td><code>dk09-blog_private</code></td><td>Mạng và volume: <code>&lt;dựán&gt;_&lt;tên&gt;</code>, nối bằng dấu gạch dưới.</td></tr>
<tr><td><code>dk09-blog-db-1</code></td><td>Container: <code>&lt;dựán&gt;-&lt;dịchvụ&gt;-&lt;số&gt;</code>, nối bằng gạch ngang. <code>-1</code> là số thứ tự bản sao; <code>docker compose up --scale api=3</code> sẽ thêm <code>-2</code> và <code>-3</code>.</td></tr>
<tr><td><code>[dk09-blog-db-1 db 9b60dcdf69ab]</code></td><td>Ba tên DNS mà container này trả lời trong mạng đó: tên đầy đủ, tên dịch vụ, và ID ngắn. Trong cấu hình hãy dùng tên dịch vụ (<code>db</code>).</td></tr>
<tr><td>nhãn <code>com.docker.compose.project</code></td><td>Đây là cách Compose biết container nào thuộc dự án nào. <code>docker compose ps</code>, <code>down</code> và <code>logs</code> đều lọc theo nó — và đó là lý do một thư mục bị đổi tên thì "mất" stack của nó (mục kế tiếp).</td></tr>
</table>
<p>Cuối cùng, khác biệt giữa <code>exec</code> và <code>run</code>, đo thật (trên chính stack này sau khi đã sửa ở Bài 9.3, nên mới có <code>(healthy)</code>). <code>exec</code> chui vào container ĐANG chạy; <code>run</code> tạo một container MỚI TINH từ cùng định nghĩa dịch vụ, tên là <code>&lt;dựán&gt;-&lt;dịchvụ&gt;-run-&lt;id&gt;</code>:</p>
<pre><code class="language-bash">docker compose run -d --no-deps api sleep 30
docker compose ps -a --format 'table {{.Name}}\\t{{.Service}}\\t{{.Status}}'</code></pre>
<div class="out">NAME                             SERVICE   STATUS
dk09-blog-api-1                  api       Up 4 minutes
dk09-blog-api-run-27a926fde727   api       Up Less than a second
dk09-blog-db-1                   db        Up 4 minutes (healthy)
…</div>
<div class="callout warn"><strong>Chỉ dọn những gì của mình.</strong> <code>docker compose down</code> xoá container và mạng của ĐÚNG dự án này, không gì khác; nó không đụng được dự án khác vì nó lọc theo nhãn dự án. Cũng vì thế mà đừng bao giờ "dọn dẹp" bằng <code>docker rm -f $(docker ps -aq)</code> trên một máy còn chạy thứ khác — lệnh đó xoá mọi container của mọi dự án.</div>

<h3>Hai cách viết, một công cụ — và một cái khoá đã chết</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>docker compose</code> (v2)</span><span class="v">Một plugin viết bằng Go nằm sẵn trong CLI của Docker. Đây là công cụ hiện hành và là thứ mọi phần bên dưới giả định.</span></div>
  <div class="kv"><span class="k"><code>docker-compose</code> (v1)</span><span class="v">Script Python đời cũ, đã hết vòng đời từ 2023. Nếu một cái máy chỉ có nó, hành vi sẽ lệch theo những cách nhỏ mà gây bực — hãy cài plugin thay vì đi vòng.</span></div>
  <div class="kv"><span class="k"><code>version: "3.8"</code></span><span class="v"><strong>Đã lỗi thời.</strong> Compose Specification bỏ nó rồi; v2 phớt lờ nó và in cảnh báo. Hãy xoá dòng đó — nó không làm gì ngoài việc khiến người ta tưởng nó có làm gì.</span></div>
  <div class="kv"><span class="k">Tên file</span><span class="v"><code>compose.yaml</code> là tên được ưa dùng hiện nay. <code>docker-compose.yml</code> vẫn chạy và có ở khắp nơi; cả hai đều được tìm thấy tự động.</span></div>
</div>
<pre><code>docker compose config &gt;/dev/null</code></pre>
<div class="out">WARN[0000] /home/cuong/blog/compose.yaml: the attribute &#96;version&#96; is obsolete,
it will be ignored, please remove it to avoid potential confusion</div>
<div class="callout"><strong>Compose v5 in ra thế nào (đo thật, Compose v5.5.1).</strong> Cảnh báo ở trên là định dạng cũ. Bản hiện hành in <code>time="2026-09-24T01:39:30+07:00" level=warning msg="…/compose.yaml: the attribute &#96;version&#96; is obsolete, it will be ignored, please remove it to avoid potential confusion"</code> — cùng thông điệp, khác lớp vỏ, và file vẫn chạy bình thường. Thêm hai chỗ đổi định dạng bạn sẽ gặp khi so với hướng dẫn cũ: dòng tiêu đề tiến trình giờ là <code>[+] up 6/6</code> / <code>[+] down 3/3</code> thay vì <code>[+] Running 6/6</code>, và mỗi dòng log mang tiền tố ngắn <code>db-1  |</code> thay vì đầy đủ <code>blog-db-1  |</code>. Vẫn công cụ đó, vẫn hành vi đó — chỉ cách in là đổi.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn cùng nhóm SWP391 clone repo của nhóm vào thư mục tên <code>swp391-be</code> thay vì <code>backend</code>, chạy <code>docker compose up -d</code>, rồi nhắn "dữ liệu mẫu mất sạch rồi". Bạn sẽ tái hiện đúng lỗi đó trên máy mình, chứng minh dữ liệu thật ra đang nằm ở đâu, và làm cho nó không bao giờ xảy ra nữa.</p><ol>
<li><code>mkdir -p ~/thu-docker/thu-shop &amp;&amp; cd ~/thu-docker/thu-shop</code>, rồi viết <code>compose.yaml</code> KHÔNG có khoá <code>name:</code>: một dịch vụ <code>db</code> dùng <code>alpine</code>, <code>command: ["sleep", "600"]</code>, và một volume có tên <code>data</code> gắn ở <code>/data</code> (khai báo trong khối <code>volumes:</code> cấp cao nhất).</li>
<li>Trước khi chạy gì, hãy ghi ra giấy cái tên bạn đoán cho mạng, volume và container. Rồi <code>docker compose up -d</code> và so với output.</li>
<li>Lưu một ít "dữ liệu": <code>docker compose exec db sh -c 'echo "don hang 42" &gt; /data/note.txt'</code>.</li>
<li>Đổi tên thư mục giống bạn kia: <code>cd .. &amp;&amp; mv thu-shop thu-shop-be &amp;&amp; cd thu-shop-be</code>, chạy lại <code>docker compose up -d</code>, và thử đọc <code>/data/note.txt</code>. Rồi chạy <code>docker compose ls</code> và <code>docker volume ls --filter name=thu-shop</code>.</li>
<li>Chữa dứt điểm: thêm <code>name: thu-shop</code> làm dòng đầu tiên, xoá cái stack thứ hai lỡ tạo bằng <code>docker compose -p thu-shop-be down -v</code> (chỉ dự án đó), chạy <code>docker compose up -d</code> rồi đọc lại file. Kết thúc bằng <code>docker compose down -v</code>.</li></ol>
<p><strong>Đạt khi:</strong> ở bước 4 bạn thấy <code>No such file or directory</code> và HAI dự án trong <code>docker compose ls</code>; ở bước 5 <code>cat /data/note.txt</code> in lại <code>don hang 42</code>; và cuối cùng <code>docker volume ls --filter name=thu-shop</code> trống trơn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Docker Compose (công cụ dựng nhiều container)</span><span class="v">Công cụ đọc một file YAML mô tả nhiều container rồi tạo tất cả — cùng mạng và volume của chúng — chỉ bằng một lệnh.</span></div>
  <div class="kv"><span class="k">Service (dịch vụ)</span><span class="v">Một mục dưới <code>services:</code>. Là khuôn cho một loại container; tên khoá cũng là tên DNS của nó.</span></div>
  <div class="kv"><span class="k">Project name (tên dự án)</span><span class="v">Tiền tố Compose gắn vào mọi container, mạng và volume. Mặc định là tên thư mục; đặt cố định bằng <code>name:</code>.</span></div>
  <div class="kv"><span class="k">Stack (cụm dịch vụ)</span><span class="v">Cách gọi thân mật cho "mọi dịch vụ của một dự án đang chạy cùng nhau".</span></div>
  <div class="kv"><span class="k">Idempotent (chạy lại không đổi gì)</span><span class="v">Chạy lần nữa mà không có gì thay đổi thì không làm gì. <code>up -d</code> hai lần liền: lần hai không tạo lại container nào.</span></div>
  <div class="kv"><span class="k">Label (nhãn)</span><span class="v">Một thẻ khoá=giá trị gắn lên đối tượng Docker. Compose tìm container "của mình" qua nhãn như <code>com.docker.compose.project</code>.</span></div>
  <div class="kv"><span class="k"><code>down</code> với <code>down -v</code></span><span class="v">Cả hai xoá container và mạng; chỉ <code>-v</code> xoá thêm volume có tên — tức dữ liệu của bạn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>File compose là dạng GHI RA GIẤY của những lệnh <code>docker run</code>, <code>network create</code>, <code>volume create</code> mà trước đây bạn gõ tay.</li>
<li>Mọi đối tượng mang tên dự án: <code>&lt;dựán&gt;_&lt;tên&gt;</code> cho mạng/volume, <code>&lt;dựán&gt;-&lt;dịchvụ&gt;-1</code> cho container.</li>
<li>Tên dự án mặc định là tên thư mục — hãy đặt <code>name:</code> để thư mục bị đổi tên hay clone lại không dựng ra một stack thứ hai rỗng ruột.</li>
<li>"✔ Started" trong output của <code>up</code> chỉ nghĩa là lệnh khởi động đã thành công; luôn kiểm tiếp bằng <code>docker compose ps -a</code>.</li>
<li><code>exec</code> chui vào container đang chạy; <code>run --rm</code> tạo một container dùng-một-lần mới từ cùng dịch vụ.</li>
<li><code>down</code> giữ volume có tên, <code>down -v</code> xoá chúng — một ký tự, không hỏi lại, không hoàn tác.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/compose/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Compose</span><span class="lc-sub">Phần tổng quan, tra cứu CLI và ghi chú chuyển từ v1 sang v2. Bắt đầu ở đây, rồi mở sẵn trang tra cứu file (bài kế tiếp) trong một tab.</span></span>
</a>
<a class="link-card" href="https://github.com/compose-spec/compose-spec/blob/main/spec.md" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Compose Specification</span><span class="lc-sub">Bản chuẩn thật sự, không phải tài liệu của một hãng: mọi khoá, kiểu dữ liệu, và ngữ nghĩa chính xác. Là bên có thẩm quyền khi tài liệu và thực tế nói khác nhau.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: viết file compose đầu tiên</span><span class="lc-sub">Bài chấm điểm: biến bốn câu lệnh <code>docker run</code> thành một file compose, đoán trước những cái tên compose sẽ sinh ra, và giải thích khác biệt giữa <code>down</code> với <code>down -v</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> gõ <code>docker compose down -v</code> theo quán tính trong khi ý bạn là <code>down</code>. Cái <code>-v</code> xoá mọi volume có tên trong dự án, mà trên máy phát triển đó là cơ sở dữ liệu bạn mất cả buổi chiều để nạp dữ liệu mẫu, còn trên máy chủ đó là dữ liệu production. Không có hộp xác nhận nào và không hoàn tác được. Hai thói quen bảo vệ bạn: đừng bao giờ đặt <code>-v</code> vào một alias shell hay một script không được đặt tên rõ ràng kiểu <code>reset-dev-db</code>, và trên bất cứ máy nào có dữ liệu đáng giữ thì hãy sao lưu trước (Bài 7.5). Nếu bạn chỉ muốn khởi động lại stack thì <code>docker compose restart</code> hoặc <code>up -d --force-recreate</code> làm đúng ý bạn, và không xoá được gì.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Compose là cái file ghi lại bảy câu lệnh <code>docker run</code> lẽ ra bạn phải gõ, nên stack trở nên tái lập được và review được. Tên dự án — mặc định là tên thư mục nếu bạn không đặt <code>name:</code> — gắn vào tên mọi container, mạng và volume, và đổi tên thư mục là lặng lẽ bỏ rơi cái stack cũ. Và <code>down</code> giữ volume có tên còn <code>down -v</code> xoá chúng; khác biệt là một ký tự và không có hoàn tác.</p>
</div>
`,
    },
    /* ─────────────────────────── 9.2 ─────────────────────────── */
    {
      title: '9.2 — The service reference|||9.2 — Tra cứu một dịch vụ',
      slug: 'dk-9-2-tra-cuu-dich-vu',
      type: 'LESSON',
      description: 'image với build, ports/expose, environment/env_file, volumes ba dạng, networks và alias, command/entrypoint, restart, deploy.resources, và docker compose config để xem file sau khi hợp nhất.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>The service reference</h2>
<p class="lead">Almost every key under a service is a <code>docker run</code> flag you already know, spelled in YAML. This lesson is the mapping, organised by what you are trying to do — and the handful of keys that have no CLI equivalent and are worth knowing exist.</p>

<h3>Where the image comes from</h3>
${slide('dk-09', 8, 'Hầu hết khoá dịch vụ = một cờ docker run viết bằng YAML')}
${slide('dk-09', 9, 'image, build hay cả hai — và luôn ghi rõ dockerfile:')}
<pre><code>services:
  api:
    build:
      context: .
      dockerfile: Dockerfile.backend      <span class="tok-comment"># NOT the default Dockerfile</span>
      target: production                  <span class="tok-comment"># stop at this stage (Lesson 6.1)</span>
      args:
        NODE_VERSION: "22"
      cache_from:
        - ghcr.io/me/api:cache
    image: ghcr.io/me/api:1.4.2           <span class="tok-comment"># tag the result of the build</span>
    pull_policy: missing</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>image</code> alone</span><span class="v">Pull and run. The normal case for databases, caches, proxies — anything you do not build.</span></div>
  <div class="kv"><span class="k"><code>build</code> alone</span><span class="v">Build from a Dockerfile and give the result a generated name (<code>&lt;project&gt;-&lt;service&gt;</code>). Fine locally, awkward to push.</span></div>
  <div class="kv"><span class="k">Both together</span><span class="v">Build, then tag as <code>image</code>. This is what you want for anything you will push to a registry — <code>compose build &amp;&amp; compose push</code> then works.</span></div>
  <div class="kv"><span class="k"><code>dockerfile:</code> matters more than it looks</span><span class="v">This repository's own history has an outage caused by a build that used the default <code>Dockerfile</code> instead of the <code>Dockerfile.backend</code> that compose uses — a musl image carrying glibc Prisma engines, green all the way to a 502 (Lesson 6.2).</span></div>
  <div class="kv"><span class="k"><code>pull_policy</code></span><span class="v"><code>missing</code> (default), <code>always</code>, <code>never</code>, <code>build</code>. Set <code>always</code> for a service pinned to a moving tag on a server, so a redeploy actually picks up the new image.</span></div>
</div>

<h3>Ports, environment, and the two spellings of each</h3>
${slide('dk-09', 10, 'YAML tự đổi kiểu dữ liệu: 0755 thành 493, 1.10 thành 1.1')}
<pre><code>services:
  api:
    ports:
      - "3000:3000"                       <span class="tok-comment"># short: HOST:CONTAINER</span>
      - "127.0.0.1:9229:9229"             <span class="tok-comment"># debugger, loopback only</span>
      - target: 8080                      <span class="tok-comment"># long syntax, explicit</span>
        published: "8080"
        protocol: tcp
        mode: host
    expose:
      - "3000"                            <span class="tok-comment"># documentation only — see Lesson 8.2</span>
    environment:
      NODE_ENV: production                <span class="tok-comment"># map form — prefer this</span>
      PORT: "3000"                        <span class="tok-comment"># quote numbers, or YAML makes them ints</span>
      DATABASE_URL: &#36;{DATABASE_URL:?set it in .env}
    env_file:
      - path: .env
        required: false</code></pre>
<div class="callout warn"><strong>Quote your port numbers — and every value that looks like a number.</strong> The famous trap is that YAML 1.1 reads an unquoted <code>22:22</code> as a sexagesimal (base-60) number, 1342, instead of a string. That bit users of the old Python <code>docker-compose</code> v1. Compose v2 and later parse YAML 1.2 and read <code>22:22</code> correctly — measured on Compose v5.5.1, <code>ports: [22:22]</code> becomes target 22, published 22. The trap that is still alive is in <code>environment</code>: YAML turns anything that <em>looks</em> numeric into a number first, and Compose then writes that number back as text. <code>PORT: 3000</code> survives as <code>"3000"</code>, but <code>APP_VERSION: 1.10</code> arrives in the container as <code>1.1</code> and <code>UMASK: 0755</code> as <code>493</code> (read as octal). Quoting — <code>"22:22"</code>, <code>"1.10"</code>, <code>"0755"</code> — is correct in every version and costs nothing; see "Run it step by step" below.</div>

<h3>Run it step by step: watch YAML rewrite your values</h3>
<p>Do not take the quoting rule on faith — see it. Put this file in <code>~/thu-docker/thu-yaml/compose.yaml</code> (ports moved into the course range so nothing clashes):</p>
<pre><code class="language-yaml">name: thu-yaml
services:
  web:
    image: nginx:alpine
    environment:
      A_YES: yes
      B_OFF: off
      C_HEX: 0x1F
      D_EXP: 1e3
      E_OCT: 0755
      H_VER: 1.10
      I_Q: "012"
    ports:
      - 18094:22
      - 18095:80</code></pre>
<pre><code class="language-bash">docker compose config | sed -n '/environment/,/image/p'
docker compose up -d
docker compose exec web env | grep -E "^[CDEHI]_" | sort</code></pre>
<div class="out">    environment:
      A_YES: 'yes'
      B_OFF: 'off'
      C_HEX: "31"
      D_EXP: "1000"
      E_OCT: "493"
      H_VER: "1.1"
      I_Q: "012"
    image: nginx:alpine
C_HEX=31
D_EXP=1000
E_OCT=493
H_VER=1.1
I_Q=012</div>
<table>
<tr><th>You wrote</th><th>The container got</th><th>Why</th></tr>
<tr><td><code>0x1F</code></td><td><code>31</code></td><td>Hexadecimal number, converted to decimal.</td></tr>
<tr><td><code>1e3</code></td><td><code>1000</code></td><td>Scientific notation.</td></tr>
<tr><td><code>0755</code></td><td><code>493</code></td><td>A leading zero is read as octal: 7×64 + 5×8 + 5 = 493. A file-mode or ZIP-code variable silently becomes a different number.</td></tr>
<tr><td><code>1.10</code></td><td><code>1.1</code></td><td>A float loses its trailing zero. Version "1.10" and version "1.1" are different releases.</td></tr>
<tr><td><code>yes</code> / <code>off</code></td><td><code>yes</code> / <code>off</code></td><td>Good news: YAML 1.2 no longer turns these into booleans (YAML 1.1 did). They stay words.</td></tr>
<tr><td><code>"012"</code></td><td><code>012</code></td><td>Quoted, so it is a string from the start and nothing touches it.</td></tr>
</table>
<p>The rule that never fails: <strong>quote every value in <code>environment</code> and every port mapping</strong>. It is the same idea as quoting variables in a shell script — you are telling the parser "this is text, do not be clever". Finish with <code>docker compose down</code>.</p>

<h3>Volumes, three ways</h3>
<pre><code>services:
  api:
    volumes:
      - pgdata:/var/lib/postgresql/data   <span class="tok-comment"># named volume (Lesson 7.2)</span>
      - ./src:/app/src                    <span class="tok-comment"># bind mount, relative to the FILE</span>
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - /app/node_modules                 <span class="tok-comment"># anonymous — the trap-fix from 7.3</span>
      - type: tmpfs                       <span class="tok-comment"># long syntax</span>
        target: /run/secrets
        tmpfs: { size: 1048576, mode: 0700 }
volumes:
  pgdata:
    name: blog-pgdata-prod                <span class="tok-comment"># exact name, no project prefix</span></code></pre>
<p>Relative bind paths resolve against the directory of the compose file, not your shell's working directory — so <code>docker compose -f ops/compose.yaml up</code> from the repository root still mounts the right thing. That is one of compose's quiet conveniences and one of the reasons paths in a compose file behave differently from the same paths in a <code>docker run</code>.</p>

<h3>What runs, and what happens when it stops</h3>
${slide('dk-09', 11, 'deploy.resources và restart có hiệu lực thật với compose up')}
<pre><code>services:
  worker:
    image: ghcr.io/me/api:1.4.2
    command: ["node", "dist/worker.js"]   <span class="tok-comment"># overrides CMD</span>
    entrypoint: ["/usr/bin/tini", "--"]   <span class="tok-comment"># overrides ENTRYPOINT</span>
    working_dir: /app
    user: "1000:1000"
    restart: unless-stopped
    stop_grace_period: 30s
    stop_signal: SIGTERM
    init: true                            <span class="tok-comment"># PID 1 reaper (Lesson 1.3)</span>
    deploy:
      resources:
        limits:   { cpus: "1.5", memory: 512M }
        reservations: { memory: 256M }</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">restart: no</span><span class="lz-t">the default — never restarted</span><span class="lz-d">Correct for one-off jobs and migration containers. Wrong for anything that should survive a crash.</span></div>
  <div class="lz-step"><span class="lz-k">restart: on-failure</span><span class="lz-t">only on a non-zero exit</span><span class="lz-d">A clean exit is respected. Good for workers that finish legitimately, bad for servers that should never exit at all.</span></div>
  <div class="lz-step"><span class="lz-k">restart: unless-stopped</span><span class="lz-t">always, except after an explicit stop</span><span class="lz-d">The right default for a service on a server: it comes back after a crash and after a reboot, but respects <code>compose stop</code> when you are working on it.</span></div>
  <div class="lz-step"><span class="lz-k">restart: always</span><span class="lz-t">always, even after you stopped it</span><span class="lz-d">Restarts on daemon start regardless of the state you left it in. Occasionally what you want; usually <code>unless-stopped</code> is closer.</span></div>
</div>
<div class="callout"><strong><code>deploy.resources</code> is not Swarm-only any more.</strong> Compose v2 honours <code>limits</code> on a plain <code>docker compose up</code> — it is the compose spelling of <code>--memory</code> and <code>--cpus</code>. A memory limit on every service is what turns "the server froze" into "one container was killed and restarted", which is the difference discussed in Chapter 11.</div>

<h3>Prove the limits are real: read them back from Docker</h3>
<p>"<code>deploy.resources</code> works with plain <code>up</code>" is a claim you can check in ten seconds, and checking it teaches you where limits actually live (Chapter 1: a cgroup file). With <code>limits: { cpus: "0.5", memory: 128M }</code> on a service:</p>
<pre><code class="language-bash">docker compose up -d
docker inspect dk09-ref-web-1 -f 'Memory={{.HostConfig.Memory}} NanoCpus={{.HostConfig.NanoCpus}}'</code></pre>
<div class="out">Memory=134217728 NanoCpus=500000000</div>
<p>134217728 bytes is exactly 128 × 1024 × 1024; 500000000 nano-CPUs is half a core. These are the same fields <code>docker run --memory 128m --cpus 0.5</code> would set. If you ever see <code>Memory=0</code>, the limit is not applied — usually because it was written under the wrong key (for example <code>mem_limit</code> in one file and <code>deploy.resources</code> in another, with the merge not doing what you thought).</p>
<table>
<tr><th>Which <code>restart</code>?</th><th>Use it for</th><th>Do NOT use it for</th></tr>
<tr><td><code>"no"</code> (Compose v5.5.1 also accepts a bare <code>no</code> — measured; YAML 1.1 tools read it as <code>false</code>, so quoting is the portable habit)</td><td>Migrations, seeds, test runs — jobs that are supposed to exit</td><td>Anything users depend on</td></tr>
<tr><td><code>on-failure</code></td><td>Workers that finish legitimately but should retry a crash</td><td>Web servers — a clean exit 0 would leave them down</td></tr>
<tr><td><code>unless-stopped</code></td><td>Every long-running service on a server: api, db, proxy</td><td>One-off jobs (they would run again at every boot)</td></tr>
<tr><td><code>always</code></td><td>The rare service that must come back even after someone stopped it by hand</td><td>Day-to-day development (it fights you when you stop it to debug)</td></tr>
</table>

<h3>Read the file the way compose reads it</h3>
${slide('dk-09', 12, 'docker compose config: xem file đúng như compose sẽ làm')}
<pre><code>docker compose config --services
docker compose config | head -18</code></pre>
<div class="out">db
api
proxy
name: blog
services:
  api:
    build:
      context: /home/cuong/blog
      dockerfile: Dockerfile.backend
    depends_on:
      db:
        condition: service_healthy
        required: true
    environment:
      DATABASE_URL: postgres://postgres:secret@db:5432/blog
      NODE_ENV: production
    networks:
      private: null
      public: null</div>
<div class="callout ok"><strong><code>docker compose config</code> is the most underused command in the tool.</strong> It shows the fully merged, fully interpolated file: every override applied, every <code>&#36;{VAR}</code> substituted, every short syntax expanded to long. When a variable is not what you expected, or an override file is not doing what you think, this answers it in one command — and it validates the YAML while it is at it. Add <code>--no-interpolate</code> to see the file before substitution, and remember it prints secrets in full.</div>
<h3>Reading compose config output: the long syntax, field by field</h3>
<p><code>config</code> always prints the <em>long</em> form of everything, which looks alarming the first time. Here is one short port line and what it became (Compose v5.5.1):</p>
<pre><code class="language-bash">docker compose config | sed -n '/ports:/,/protocol/p'   <span class="tok-comment"># for ports: ["127.0.0.1:18093:80"]</span></code></pre>
<div class="out">    ports:
      - mode: ingress
        host_ip: 127.0.0.1
        target: 80
        published: "18093"
        protocol: tcp</div>
<table>
<tr><th>Field</th><th>Meaning</th></tr>
<tr><td><code>target</code></td><td>The port <em>inside</em> the container — the right-hand number of <code>"18093:80"</code>.</td></tr>
<tr><td><code>published</code></td><td>The port on the host — the left-hand number. Missing entirely = Docker picks a random free port.</td></tr>
<tr><td><code>host_ip</code></td><td>Which host address to listen on. Absent = every interface (0.0.0.0); <code>127.0.0.1</code> = only this machine (Chapter 8).</td></tr>
<tr><td><code>protocol</code></td><td><code>tcp</code> unless you wrote <code>/udp</code>.</td></tr>
<tr><td><code>mode: ingress</code></td><td>A Swarm term that plain Compose fills in by default; for a single host you can ignore it.</td></tr>
</table>
<p>Two more things <code>config</code> resolved for you in the same run: relative paths became absolute (<code>./nginx.conf</code> → <code>…/ch09/blog/nginx.conf</code>, even when you run <code>docker compose -f blog/compose.yaml config</code> from another folder), and short <code>depends_on: [db]</code> became the long form with <code>condition: service_started</code> and <code>required: true</code>. <code>docker compose config -q</code> prints nothing and only sets the exit code — the right thing to put at the start of a deploy script.</p>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the backend of your group project reports <code>version 1.1</code> on its health page although the compose file clearly says <code>APP_VERSION: 1.10</code>, and a teammate insists the memory limit "does nothing". Find both truths with <code>config</code> and <code>inspect</code>, not by reading the file.</p><ol>
<li>In <code>~/thu-docker/thu-ref</code>, write a compose file with <code>name: thu-ref</code> and one <code>nginx:alpine</code> service with <code>environment: { APP_VERSION: 1.10, UMASK: 0755, PORT: 3000 }</code>, <code>ports: ["18092:80"]</code>, and <code>deploy.resources.limits: { cpus: "0.5", memory: 128M }</code>.</li>
<li>Predict what the container will receive for the three variables, then check with <code>docker compose config</code>.</li>
<li><code>docker compose up -d</code>, then read the real values: <code>docker compose exec web env | grep -E "APP_VERSION|UMASK|PORT"</code>.</li>
<li>Prove the limit: <code>docker inspect thu-ref-web-1 -f '{{.HostConfig.Memory}} {{.HostConfig.NanoCpus}}'</code>.</li>
<li>Fix the file by quoting the values, run <code>docker compose up -d</code> again (only the changed service is recreated) and re-check. Finish with <code>docker compose down</code>.</li></ol>
<p><strong>Done when:</strong> before the fix you saw <code>APP_VERSION=1.1</code> and <code>UMASK=493</code>; after it <code>1.10</code> and <code>0755</code>; and <code>inspect</code> printed <code>134217728 500000000</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Short vs long syntax</span><span class="v">Two ways to write the same key: <code>"18092:80"</code> or a map with <code>target</code>/<code>published</code>. <code>config</code> always shows the long one.</span></div>
  <div class="kv"><span class="k">Build context</span><span class="v">The folder sent to the builder; every <code>COPY</code> path is relative to it.</span></div>
  <div class="kv"><span class="k"><code>pull_policy</code></span><span class="v">When Compose pulls an image: <code>missing</code>, <code>always</code>, <code>never</code>, <code>build</code>.</span></div>
  <div class="kv"><span class="k">Restart policy</span><span class="v">What Docker does when the container's process exits: nothing, retry on failure, or always bring it back.</span></div>
  <div class="kv"><span class="k"><code>deploy.resources.limits</code></span><span class="v">Compose's spelling of <code>--memory</code>/<code>--cpus</code>: a cgroup ceiling, visible in <code>docker inspect</code>.</span></div>
  <div class="kv"><span class="k">Interpolation</span><span class="v">Replacing <code>&#36;{VAR}</code> in the YAML with a value before anything runs.</span></div>
  <div class="kv"><span class="k"><code>docker compose config</code></span><span class="v">Prints the final, merged, interpolated model Compose will act on; <code>-q</code> only validates.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Nearly every service key is a <code>docker run</code> flag in YAML; <code>depends_on</code>, <code>profiles</code>, <code>extends</code> and <code>build</code> are what Compose adds.</li>
<li>Use <code>image</code> and <code>build</code> together for anything you push, and always name the <code>dockerfile:</code> when a project has more than one.</li>
<li>Compose v2+ reads <code>22:22</code> correctly, but YAML still rewrites number-like values: <code>1.10</code> → <code>1.1</code>, <code>0755</code> → <code>493</code>. Quote them.</li>
<li><code>deploy.resources.limits</code> and <code>restart</code> take effect on a plain <code>up</code> — verify with <code>docker inspect</code>.</li>
<li>Choose <code>unless-stopped</code> for long-running services and <code>"no"</code> for jobs that are meant to exit.</li>
<li><code>docker compose config</code> shows the file exactly as Compose will run it: absolute paths, long syntax, variables substituted.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/compose-file/services/" target="_blank" rel="noopener">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">Compose file reference — services</span><span class="lc-sub">Every key a service accepts, alphabetically, with types and examples. Bookmark it; nobody remembers <code>stop_grace_period</code> or the long <code>ports</code> syntax from memory.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/compose/config/" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">docker compose config</span><span class="lc-sub">The flags that make it useful: <code>--services</code>, <code>--volumes</code>, <code>--profiles</code>, <code>--no-interpolate</code>, and <code>--format json</code> for scripting against the merged model.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: translate flags into YAML</span><span class="lc-sub">Graded exercises: convert a long <code>docker run</code> into a service block, pick the right <code>restart</code> policy for four services, and use <code>compose config</code> to find why a variable is empty.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> assuming <code>build:</code> uses the <code>Dockerfile</code> in the context directory when the project has several. It does — and that is the problem, because the one you meant may be <code>Dockerfile.backend</code>. Compose is explicit about this and any script that builds outside compose must be too: this project shipped a backend image built from the wrong Dockerfile, so a musl-based Alpine image received Prisma engines compiled for glibc. The build was green, the push was green, the swap was green, and the API returned 502 for seven minutes while the container restarted in a loop. The lesson generalises: whenever you build outside <code>docker compose build</code>, pass <code>-f</code> with the exact Dockerfile that compose would have used, and verify the resulting image actually starts before you promote it.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Most service keys are a <code>docker run</code> flag in YAML; the ones without a CLI equivalent — <code>depends_on</code>, <code>profiles</code>, <code>extends</code> — are what compose adds. Quote anything numeric, because YAML turns <code>22:22</code> into a number and <code>PORT: 3000</code> into an integer. And <code>docker compose config</code> shows the merged, interpolated file that compose will actually act on — run it whenever reality disagrees with the file you are reading.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Tra cứu một dịch vụ</h2>
<p class="lead">Gần như mọi khoá dưới một dịch vụ đều là một cái cờ của <code>docker run</code> mà bạn đã biết, viết bằng YAML. Bài này là bảng ánh xạ đó, sắp theo việc bạn đang muốn làm — cộng với dăm ba cái khoá không có tương đương ở CLI mà đáng biết là chúng tồn tại.</p>

<h3>Cái ảnh đến từ đâu</h3>
${slide('dk-09', 8, 'Hầu hết khoá dịch vụ = một cờ docker run viết bằng YAML')}
${slide('dk-09', 9, 'image, build hay cả hai — và luôn ghi rõ dockerfile:')}
<pre><code>services:
  api:
    build:
      context: .
      dockerfile: Dockerfile.backend      <span class="tok-comment"># KHÔNG phải Dockerfile mặc định</span>
      target: production                  <span class="tok-comment"># dừng ở tầng này (Bài 6.1)</span>
      args:
        NODE_VERSION: "22"
      cache_from:
        - ghcr.io/me/api:cache
    image: ghcr.io/me/api:1.4.2           <span class="tok-comment"># gắn nhãn cho kết quả dựng</span>
    pull_policy: missing</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Chỉ có <code>image</code></span><span class="v">Kéo về rồi chạy. Trường hợp bình thường với cơ sở dữ liệu, cache, proxy — mọi thứ bạn không tự dựng.</span></div>
  <div class="kv"><span class="k">Chỉ có <code>build</code></span><span class="v">Dựng từ một Dockerfile rồi đặt cho kết quả một cái tên tự sinh (<code>&lt;dựán&gt;-&lt;dịchvụ&gt;</code>). Ổn khi làm cục bộ, vướng khi cần đẩy lên.</span></div>
  <div class="kv"><span class="k">Cả hai cùng lúc</span><span class="v">Dựng, rồi gắn nhãn thành <code>image</code>. Đây là thứ bạn muốn cho mọi thứ sẽ đẩy lên registry — khi đó <code>compose build &amp;&amp; compose push</code> chạy được.</span></div>
  <div class="kv"><span class="k"><code>dockerfile:</code> quan trọng hơn vẻ ngoài</span><span class="v">Lịch sử của chính kho này có một sự cố do một lượt dựng dùng <code>Dockerfile</code> mặc định thay vì <code>Dockerfile.backend</code> mà compose dùng — một cái ảnh nền musl mang engine Prisma bản glibc, xanh suốt đường tới lúc trả 502 (Bài 6.2).</span></div>
  <div class="kv"><span class="k"><code>pull_policy</code></span><span class="v"><code>missing</code> (mặc định), <code>always</code>, <code>never</code>, <code>build</code>. Đặt <code>always</code> cho một dịch vụ ghim vào một cái nhãn hay đổi trên máy chủ, để một lượt deploy thật sự lấy được ảnh mới.</span></div>
</div>

<h3>Cổng, môi trường, và hai cách viết cho mỗi thứ</h3>
${slide('dk-09', 10, 'YAML tự đổi kiểu dữ liệu: 0755 thành 493, 1.10 thành 1.1')}
<pre><code>services:
  api:
    ports:
      - "3000:3000"                       <span class="tok-comment"># dạng ngắn: MÁYCHỦ:CONTAINER</span>
      - "127.0.0.1:9229:9229"             <span class="tok-comment"># bộ gỡ lỗi, chỉ loopback</span>
      - target: 8080                      <span class="tok-comment"># dạng dài, tường minh</span>
        published: "8080"
        protocol: tcp
        mode: host
    expose:
      - "3000"                            <span class="tok-comment"># chỉ là tài liệu — xem Bài 8.2</span>
    environment:
      NODE_ENV: production                <span class="tok-comment"># dạng map — nên dùng cái này</span>
      PORT: "3000"                        <span class="tok-comment"># bọc nháy cho số, không thì YAML biến thành int</span>
      DATABASE_URL: &#36;{DATABASE_URL:?set it in .env}
    env_file:
      - path: .env
        required: false</code></pre>
<div class="callout warn"><strong>Hãy bọc nháy cho số cổng — và cho mọi giá trị trông giống số.</strong> Cái bẫy nổi tiếng là YAML 1.1 đọc <code>22:22</code> không bọc nháy thành một con số hệ sáu mươi (1342) chứ không phải chuỗi. Nó từng cắn người dùng <code>docker-compose</code> v1 viết bằng Python. Compose v2 trở lên phân tích theo YAML 1.2 và đọc <code>22:22</code> đúng — đo trên Compose v5.5.1, <code>ports: [22:22]</code> thành target 22, published 22. Cái bẫy CÒN SỐNG nằm ở <code>environment</code>: YAML biến mọi thứ <em>trông như</em> số thành số trước, rồi Compose mới viết con số đó lại thành chữ. <code>PORT: 3000</code> vẫn thành <code>"3000"</code>, nhưng <code>APP_VERSION: 1.10</code> tới container thành <code>1.1</code> và <code>UMASK: 0755</code> thành <code>493</code> (bị đọc như số bát phân). Bọc nháy — <code>"22:22"</code>, <code>"1.10"</code>, <code>"0755"</code> — đúng ở mọi phiên bản và chẳng tốn gì; xem phần "Chạy thử từng bước" ngay dưới.</div>

<h3>Chạy thử từng bước: nhìn YAML tự viết lại giá trị của bạn</h3>
<p>Đừng tin luật bọc nháy suông — hãy nhìn tận mắt. Đặt file này ở <code>~/thu-docker/thu-yaml/compose.yaml</code> (cổng dời vào dải của khoá để khỏi đụng gì):</p>
<pre><code class="language-yaml">name: thu-yaml
services:
  web:
    image: nginx:alpine
    environment:
      A_YES: yes
      B_OFF: off
      C_HEX: 0x1F
      D_EXP: 1e3
      E_OCT: 0755
      H_VER: 1.10
      I_Q: "012"
    ports:
      - 18094:22
      - 18095:80</code></pre>
<pre><code class="language-bash">docker compose config | sed -n '/environment/,/image/p'
docker compose up -d
docker compose exec web env | grep -E "^[CDEHI]_" | sort</code></pre>
<div class="out">    environment:
      A_YES: 'yes'
      B_OFF: 'off'
      C_HEX: "31"
      D_EXP: "1000"
      E_OCT: "493"
      H_VER: "1.1"
      I_Q: "012"
    image: nginx:alpine
C_HEX=31
D_EXP=1000
E_OCT=493
H_VER=1.1
I_Q=012</div>
<table>
<tr><th>Bạn viết</th><th>Container nhận</th><th>Vì sao</th></tr>
<tr><td><code>0x1F</code></td><td><code>31</code></td><td>Số hệ mười sáu, bị đổi sang thập phân.</td></tr>
<tr><td><code>1e3</code></td><td><code>1000</code></td><td>Ký hiệu khoa học (số mũ).</td></tr>
<tr><td><code>0755</code></td><td><code>493</code></td><td>Số 0 đứng đầu bị đọc như hệ tám (bát phân): 7×64 + 5×8 + 5 = 493. Một biến quyền file hay mã bưu chính lặng lẽ thành con số khác.</td></tr>
<tr><td><code>1.10</code></td><td><code>1.1</code></td><td>Số thực mất số 0 ở cuối. Phiên bản "1.10" và "1.1" là hai bản phát hành khác nhau.</td></tr>
<tr><td><code>yes</code> / <code>off</code></td><td><code>yes</code> / <code>off</code></td><td>Tin vui: YAML 1.2 không còn biến chúng thành true/false nữa (YAML 1.1 thì có). Chúng vẫn là chữ.</td></tr>
<tr><td><code>"012"</code></td><td><code>012</code></td><td>Có bọc nháy nên là chuỗi ngay từ đầu, không ai đụng vào.</td></tr>
</table>
<p>Luật không bao giờ sai: <strong>bọc nháy mọi giá trị trong <code>environment</code> và mọi ánh xạ cổng</strong>. Cùng ý với việc bọc nháy biến trong script shell — bạn đang bảo bộ phân tích "đây là chữ, đừng tự thông minh". Xong thì <code>docker compose down</code>.</p>

<h3>Volume, ba kiểu</h3>
<pre><code>services:
  api:
    volumes:
      - pgdata:/var/lib/postgresql/data   <span class="tok-comment"># volume có tên (Bài 7.2)</span>
      - ./src:/app/src                    <span class="tok-comment"># bind mount, tương đối so với FILE</span>
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - /app/node_modules                 <span class="tok-comment"># vô danh — cách vá bẫy ở 7.3</span>
      - type: tmpfs                       <span class="tok-comment"># cú pháp dài</span>
        target: /run/secrets
        tmpfs: { size: 1048576, mode: 0700 }
volumes:
  pgdata:
    name: blog-pgdata-prod                <span class="tok-comment"># tên chính xác, không thêm tiền tố dự án</span></code></pre>
<p>Đường dẫn bind tương đối được tính từ thư mục chứa FILE compose, chứ không phải từ thư mục làm việc của shell — nên chạy <code>docker compose -f ops/compose.yaml up</code> từ gốc kho vẫn gắn đúng thứ cần gắn. Đó là một trong những tiện lợi thầm lặng của compose và cũng là lý do đường dẫn trong file compose hành xử khác với chính đường dẫn đó trong một lệnh <code>docker run</code>.</p>

<h3>Cái gì chạy, và chuyện gì xảy ra khi nó dừng</h3>
${slide('dk-09', 11, 'deploy.resources và restart có hiệu lực thật với compose up')}
<pre><code>services:
  worker:
    image: ghcr.io/me/api:1.4.2
    command: ["node", "dist/worker.js"]   <span class="tok-comment"># ghi đè CMD</span>
    entrypoint: ["/usr/bin/tini", "--"]   <span class="tok-comment"># ghi đè ENTRYPOINT</span>
    working_dir: /app
    user: "1000:1000"
    restart: unless-stopped
    stop_grace_period: 30s
    stop_signal: SIGTERM
    init: true                            <span class="tok-comment"># bộ thu dọn PID 1 (Bài 1.3)</span>
    deploy:
      resources:
        limits:   { cpus: "1.5", memory: 512M }
        reservations: { memory: 256M }</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">restart: no</span><span class="lz-t">mặc định — không bao giờ khởi động lại</span><span class="lz-d">Đúng cho việc chạy một lần và container migration. Sai cho mọi thứ đáng lẽ phải sống sót qua một cú sập.</span></div>
  <div class="lz-step"><span class="lz-k">restart: on-failure</span><span class="lz-t">chỉ khi thoát với mã khác 0</span><span class="lz-d">Một lần thoát sạch được tôn trọng. Tốt cho worker kết thúc một cách chính đáng, tệ cho máy chủ đáng lẽ không bao giờ được thoát.</span></div>
  <div class="lz-step"><span class="lz-k">restart: unless-stopped</span><span class="lz-t">luôn luôn, trừ khi bạn dừng nó một cách tường minh</span><span class="lz-d">Mặc định đúng cho một dịch vụ trên máy chủ: nó quay lại sau một cú sập và sau một lần khởi động lại máy, nhưng tôn trọng lệnh <code>compose stop</code> khi bạn đang làm việc với nó.</span></div>
  <div class="lz-step"><span class="lz-k">restart: always</span><span class="lz-t">luôn luôn, kể cả sau khi bạn đã dừng nó</span><span class="lz-d">Khởi động lại lúc daemon lên bất kể bạn để nó ở trạng thái nào. Thỉnh thoảng đúng ý bạn; thường thì <code>unless-stopped</code> gần hơn.</span></div>
</div>
<div class="callout"><strong><code>deploy.resources</code> không còn chỉ dành cho Swarm nữa.</strong> Compose v2 tôn trọng <code>limits</code> ngay trong một lệnh <code>docker compose up</code> thường — nó là cách viết compose của <code>--memory</code> và <code>--cpus</code>. Đặt hạn mức bộ nhớ cho mọi dịch vụ chính là thứ biến "máy chủ đơ rồi" thành "một container bị giết rồi khởi động lại", và đó là khác biệt bàn tới ở Chương 11.</div>

<h3>Chứng minh hạn mức là thật: đọc ngược lại từ Docker</h3>
<p>"<code>deploy.resources</code> có hiệu lực với <code>up</code> thường" là một khẳng định bạn kiểm được trong mười giây, và việc kiểm dạy bạn hạn mức thật ra nằm ở đâu (Chương 1: một file cgroup). Với <code>limits: { cpus: "0.5", memory: 128M }</code> trên một dịch vụ:</p>
<pre><code class="language-bash">docker compose up -d
docker inspect dk09-ref-web-1 -f 'Memory={{.HostConfig.Memory}} NanoCpus={{.HostConfig.NanoCpus}}'</code></pre>
<div class="out">Memory=134217728 NanoCpus=500000000</div>
<p>134217728 byte đúng bằng 128 × 1024 × 1024; 500000000 nano-CPU là nửa nhân. Đây chính là những trường mà <code>docker run --memory 128m --cpus 0.5</code> sẽ đặt. Nếu có lúc bạn thấy <code>Memory=0</code> thì hạn mức KHÔNG được áp — thường vì viết nhầm khoá (ví dụ <code>mem_limit</code> ở một file và <code>deploy.resources</code> ở file khác, rồi phép hợp nhất không làm như bạn nghĩ).</p>
<table>
<tr><th>Chọn <code>restart</code> nào?</th><th>Dùng cho</th><th>ĐỪNG dùng cho</th></tr>
<tr><td><code>"no"</code> (Compose v5.5.1 nhận cả <code>no</code> không bọc nháy — đã đo; công cụ theo YAML 1.1 đọc nó thành <code>false</code>, nên bọc nháy là thói quen an toàn)</td><td>Migration, nạp dữ liệu mẫu, chạy test — những việc ĐƯỢC PHÉP thoát</td><td>Bất cứ thứ gì người dùng đang dựa vào</td></tr>
<tr><td><code>on-failure</code></td><td>Worker kết thúc một cách chính đáng nhưng cần thử lại khi sập</td><td>Máy chủ web — thoát sạch với mã 0 là nằm im luôn</td></tr>
<tr><td><code>unless-stopped</code></td><td>Mọi dịch vụ chạy lâu dài trên máy chủ: api, db, proxy</td><td>Việc chạy một lần (nó sẽ chạy lại mỗi lần khởi động máy)</td></tr>
<tr><td><code>always</code></td><td>Dịch vụ hiếm hoi phải sống lại kể cả khi ai đó dừng tay</td><td>Lúc phát triển hằng ngày (nó chống lại bạn khi bạn dừng để gỡ lỗi)</td></tr>
</table>

<h3>Đọc cái file theo đúng cách compose đọc nó</h3>
${slide('dk-09', 12, 'docker compose config: xem file đúng như compose sẽ làm')}
<pre><code>docker compose config --services
docker compose config | head -18</code></pre>
<div class="out">db
api
proxy
name: blog
services:
  api:
    build:
      context: /home/cuong/blog
      dockerfile: Dockerfile.backend
    depends_on:
      db:
        condition: service_healthy
        required: true
    environment:
      DATABASE_URL: postgres://postgres:secret@db:5432/blog
      NODE_ENV: production
    networks:
      private: null
      public: null</div>
<div class="callout ok"><strong><code>docker compose config</code> là câu lệnh ít được dùng nhất so với giá trị của nó.</strong> Nó hiện ra cái file đã hợp nhất và nội suy đầy đủ: mọi lớp ghi đè đã áp, mọi <code>&#36;{VAR}</code> đã thay, mọi cú pháp ngắn đã bung thành dài. Khi một biến không đúng như bạn nghĩ, hoặc một file ghi đè không làm điều bạn tưởng, lệnh này trả lời trong một nhát — và nhân tiện nó kiểm luôn cú pháp YAML. Thêm <code>--no-interpolate</code> để xem file TRƯỚC khi thay biến, và nhớ rằng nó in bí mật ra nguyên vẹn.</div>
<h3>Đọc output của compose config: cú pháp dài, từng trường một</h3>
<p><code>config</code> luôn in dạng <em>dài</em> của mọi thứ, nhìn lần đầu hơi hoảng. Đây là một dòng cổng dạng ngắn và thứ nó trở thành (Compose v5.5.1):</p>
<pre><code class="language-bash">docker compose config | sed -n '/ports:/,/protocol/p'   <span class="tok-comment"># với ports: ["127.0.0.1:18093:80"]</span></code></pre>
<div class="out">    ports:
      - mode: ingress
        host_ip: 127.0.0.1
        target: 80
        published: "18093"
        protocol: tcp</div>
<table>
<tr><th>Trường</th><th>Nghĩa</th></tr>
<tr><td><code>target</code></td><td>Cổng BÊN TRONG container — con số bên phải của <code>"18093:80"</code>.</td></tr>
<tr><td><code>published</code></td><td>Cổng trên máy chủ — con số bên trái. Vắng hẳn = Docker chọn một cổng trống ngẫu nhiên.</td></tr>
<tr><td><code>host_ip</code></td><td>Nghe trên địa chỉ nào của máy chủ. Không có = mọi card mạng (0.0.0.0); <code>127.0.0.1</code> = chỉ máy này (Chương 8).</td></tr>
<tr><td><code>protocol</code></td><td><code>tcp</code>, trừ khi bạn viết <code>/udp</code>.</td></tr>
<tr><td><code>mode: ingress</code></td><td>Thuật ngữ của Swarm mà Compose thường tự điền mặc định; chạy một máy thì bỏ qua được.</td></tr>
</table>
<p>Cùng lượt chạy đó <code>config</code> còn giải quyết hộ hai thứ: đường dẫn tương đối thành tuyệt đối (<code>./nginx.conf</code> → <code>…/ch09/blog/nginx.conf</code>, kể cả khi bạn chạy <code>docker compose -f blog/compose.yaml config</code> từ thư mục khác), và <code>depends_on: [db]</code> dạng ngắn thành dạng dài có <code>condition: service_started</code> và <code>required: true</code>. <code>docker compose config -q</code> không in gì, chỉ đặt mã thoát — đúng thứ nên đặt ở đầu một script deploy.</p>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> backend của đồ án nhóm báo <code>version 1.1</code> ở trang health trong khi file compose ghi rõ <code>APP_VERSION: 1.10</code>, còn một bạn khăng khăng giới hạn bộ nhớ "chẳng có tác dụng gì". Hãy tìm ra sự thật của cả hai bằng <code>config</code> và <code>inspect</code>, không phải bằng cách đọc file.</p><ol>
<li>Trong <code>~/thu-docker/thu-ref</code>, viết file compose có <code>name: thu-ref</code> và một dịch vụ <code>nginx:alpine</code> với <code>environment: { APP_VERSION: 1.10, UMASK: 0755, PORT: 3000 }</code>, <code>ports: ["18092:80"]</code>, và <code>deploy.resources.limits: { cpus: "0.5", memory: 128M }</code>.</li>
<li>Đoán trước container sẽ nhận gì cho ba biến, rồi kiểm bằng <code>docker compose config</code>.</li>
<li><code>docker compose up -d</code>, rồi đọc giá trị thật: <code>docker compose exec web env | grep -E "APP_VERSION|UMASK|PORT"</code>.</li>
<li>Chứng minh hạn mức: <code>docker inspect thu-ref-web-1 -f '{{.HostConfig.Memory}} {{.HostConfig.NanoCpus}}'</code>.</li>
<li>Sửa file bằng cách bọc nháy các giá trị, chạy lại <code>docker compose up -d</code> (chỉ dịch vụ bị đổi được tạo lại) và kiểm lần nữa. Kết thúc bằng <code>docker compose down</code>.</li></ol>
<p><strong>Đạt khi:</strong> trước khi sửa bạn thấy <code>APP_VERSION=1.1</code> và <code>UMASK=493</code>; sau khi sửa là <code>1.10</code> và <code>0755</code>; và <code>inspect</code> in ra <code>134217728 500000000</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Short / long syntax (cú pháp ngắn / dài)</span><span class="v">Hai cách viết cùng một khoá: <code>"18092:80"</code> hoặc một map có <code>target</code>/<code>published</code>. <code>config</code> luôn in dạng dài.</span></div>
  <div class="kv"><span class="k">Build context (ngữ cảnh dựng)</span><span class="v">Thư mục được gửi cho bộ dựng; mọi đường dẫn <code>COPY</code> tính từ đó.</span></div>
  <div class="kv"><span class="k"><code>pull_policy</code> (chính sách kéo ảnh)</span><span class="v">Khi nào Compose kéo ảnh: <code>missing</code>, <code>always</code>, <code>never</code>, <code>build</code>.</span></div>
  <div class="kv"><span class="k">Restart policy (chính sách khởi động lại)</span><span class="v">Docker làm gì khi tiến trình của container thoát: không làm gì, thử lại khi lỗi, hay luôn kéo lên.</span></div>
  <div class="kv"><span class="k"><code>deploy.resources.limits</code> (hạn mức tài nguyên)</span><span class="v">Cách Compose viết <code>--memory</code>/<code>--cpus</code>: một trần cgroup, nhìn thấy được trong <code>docker inspect</code>.</span></div>
  <div class="kv"><span class="k">Interpolation (nội suy biến)</span><span class="v">Thay <code>&#36;{VAR}</code> trong YAML bằng giá trị trước khi chạy bất cứ thứ gì.</span></div>
  <div class="kv"><span class="k"><code>docker compose config</code></span><span class="v">In ra mô hình cuối cùng — đã hợp nhất, đã thay biến — mà Compose sẽ hành động theo; <code>-q</code> chỉ kiểm hợp lệ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Gần như mọi khoá dịch vụ là một cờ <code>docker run</code> viết bằng YAML; <code>depends_on</code>, <code>profiles</code>, <code>extends</code> và <code>build</code> là phần Compose thêm vào.</li>
<li>Dùng <code>image</code> cùng <code>build</code> cho mọi thứ sẽ đẩy lên registry, và luôn ghi rõ <code>dockerfile:</code> khi dự án có hơn một Dockerfile.</li>
<li>Compose v2+ đọc <code>22:22</code> đúng, nhưng YAML vẫn viết lại giá trị trông như số: <code>1.10</code> → <code>1.1</code>, <code>0755</code> → <code>493</code>. Hãy bọc nháy.</li>
<li><code>deploy.resources.limits</code> và <code>restart</code> có hiệu lực với <code>up</code> thường — kiểm bằng <code>docker inspect</code>.</li>
<li>Chọn <code>unless-stopped</code> cho dịch vụ chạy lâu dài và <code>"no"</code> cho việc được phép thoát.</li>
<li><code>docker compose config</code> cho thấy file đúng như Compose sẽ chạy: đường dẫn tuyệt đối, cú pháp dài, biến đã thay.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/compose-file/services/" target="_blank" rel="noopener">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">Tra cứu file compose — services</span><span class="lc-sub">Mọi khoá một dịch vụ nhận, xếp theo bảng chữ cái, kèm kiểu và ví dụ. Hãy đánh dấu trang; không ai nhớ nổi <code>stop_grace_period</code> hay cú pháp <code>ports</code> dạng dài trong đầu.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/compose/config/" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">docker compose config</span><span class="lc-sub">Những cái cờ khiến nó hữu ích: <code>--services</code>, <code>--volumes</code>, <code>--profiles</code>, <code>--no-interpolate</code>, và <code>--format json</code> để viết script dựa trên mô hình đã hợp nhất.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dịch cờ dòng lệnh sang YAML</span><span class="lc-sub">Bài chấm điểm: chuyển một lệnh <code>docker run</code> dài thành một khối dịch vụ, chọn đúng chính sách <code>restart</code> cho bốn dịch vụ, và dùng <code>compose config</code> để tìm ra vì sao một biến bị rỗng.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> mặc định rằng <code>build:</code> sẽ dùng cái <code>Dockerfile</code> nằm trong thư mục ngữ cảnh khi dự án có nhiều file. Nó dùng thật — và đó chính là vấn đề, vì cái bạn muốn có thể là <code>Dockerfile.backend</code>. Compose nói rõ chuyện này và mọi script dựng ảnh ngoài compose cũng phải nói rõ như vậy: chính dự án này từng đẩy lên một ảnh backend dựng từ nhầm Dockerfile, nên một cái ảnh Alpine nền musl nhận được engine Prisma biên dịch cho glibc. Dựng xanh, đẩy xanh, tráo xanh, rồi API trả 502 suốt bảy phút trong khi container restart thành vòng lặp. Bài học tổng quát ra: mỗi khi bạn dựng ngoài <code>docker compose build</code>, hãy truyền <code>-f</code> trỏ đúng cái Dockerfile mà compose sẽ dùng, và kiểm cái ảnh vừa dựng có khởi động được thật không trước khi đưa nó lên.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Phần lớn khoá của dịch vụ là một cờ <code>docker run</code> viết bằng YAML; những cái không có tương đương ở CLI — <code>depends_on</code>, <code>profiles</code>, <code>extends</code> — mới là phần compose thêm vào. Hãy bọc nháy mọi thứ trông giống số, vì YAML biến <code>22:22</code> thành một con số và <code>PORT: 3000</code> thành số nguyên. Và <code>docker compose config</code> hiện ra cái file đã hợp nhất và nội suy mà compose thật sự sẽ hành động theo — hãy chạy nó mỗi khi thực tế không khớp với file bạn đang đọc.</p>
</div>
`,
    },
    /* ─────────────────────────── 9.3 ─────────────────────────── */
    {
      title: '9.3 — depends_on, healthchecks, start order|||9.3 — depends_on, healthcheck, thứ tự khởi động',
      slug: 'dk-9-3-thu-tu-khoi-dong',
      type: 'LESSON',
      description: 'Vì sao depends_on trần không đủ, viết healthcheck cho Postgres/Redis/HTTP, condition service_healthy và service_completed_successfully, start_period, và vì sao ứng dụng vẫn phải tự thử lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>depends_on, healthchecks, start order</h2>
<p class="lead">The classic compose failure: <code>depends_on: [db]</code> is set, the stack starts, and the API crashes immediately because Postgres is not accepting connections yet. Plain <code>depends_on</code> orders the <em>starts</em>, not the readiness — and the gap between "container started" and "service ready" is where this lesson lives.</p>

<h3>The failure, reproduced</h3>
${slide('dk-09', 13, 'depends_on trần: api chết trước khi Postgres sẵn sàng (đo bằng mili giây)')}
<pre><code>services:
  db:
    image: postgres:16-alpine
    environment: { POSTGRES_PASSWORD: secret }
  api:
    build: .
    depends_on: [db]          <span class="tok-comment"># started, NOT ready</span></code></pre>
<pre><code>docker compose up 2&gt;&amp;1 | tail -5</code></pre>
<div class="out">blog-db-1   | The files belonging to this database system will be owned by "postgres".
blog-api-1  | Error: connect ECONNREFUSED 172.19.0.2:5432
blog-api-1  |     at TCPConnectWrap.afterConnect [as oncomplete]
blog-api-1 exited with code 1
blog-db-1   | 2026-08-22 11:20:41.113 UTC [1] LOG:  database system is ready to accept connections</div>
<p>Look at the last two lines and their order: the API had already given up before Postgres finished initialising. Postgres takes two to eight seconds to be ready on first run, because it creates the data directory, runs initdb, and restarts itself once. Nothing about container startup waits for any of that.</p>

<h3>Run it step by step: measure the race to the millisecond</h3>
<p>"The API starts too early" is vague. <code>docker compose events</code> turns it into numbers. Open a second terminal on the project folder, start recording, then bring the stack up from an empty volume in the first terminal (<code>docker compose down -v</code> first — on YOUR practice project only):</p>
<pre><code class="language-bash"><span class="tok-comment"># terminal 2 — records every container event with a timestamp</span>
docker compose events --json &gt; events.json
<span class="tok-comment"># terminal 1</span>
docker compose up -d
<span class="tok-comment"># then stop terminal 2 with Ctrl+C and read the file</span></code></pre>
<div class="out">01:38:14.540 db   start
01:38:14.648 api  start
01:38:14.814 api  die    exitCode=1</div>
<pre><code class="language-bash">docker compose logs -t db | grep -E "ready to accept|init process"</code></pre>
<div class="out">db-1  | 2026-09-23T18:38:15.163926843Z … database system is ready to accept connections
db-1  | 2026-09-23T18:38:15.383967427Z PostgreSQL init process complete; ready for start up.
db-1  | 2026-09-23T18:38:15.406250593Z … database system is ready to accept connections</div>
<p>(The event lines above are the JSON shortened to time · service · action. <code>logs -t</code> prints UTC, so 18:38 UTC is 01:38 in Vietnam, +07 — the same clock.) Put the numbers on one line, counting from the moment db started:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">0 ms</span><span class="lz-t">db container starts</span><span class="lz-d">The Postgres entrypoint begins <code>initdb</code> on the empty volume.</span></div>
  <div class="lz-step"><span class="lz-k">108 ms</span><span class="lz-t">api container starts</span><span class="lz-d"><code>depends_on</code> is satisfied: db has been <em>started</em>. That is all it ever checks.</span></div>
  <div class="lz-step"><span class="lz-k">274 ms</span><span class="lz-t">api dies with exit code 1</span><span class="lz-d">It tried <code>db:5432</code> once, got ECONNREFUSED, and exited.</span></div>
  <div class="lz-step"><span class="lz-k">624 ms</span><span class="lz-t">"ready to accept connections" — the first time</span><span class="lz-d">This is a <em>temporary</em> server that initdb starts to run setup scripts. It listens only on a Unix socket, not on TCP port 5432, and is shut down again moments later. Remember this line — it is the trap of the next-but-one section.</span></div>
  <div class="lz-step"><span class="lz-k">866 ms</span><span class="lz-t">"ready to accept connections" — the real one</span><span class="lz-d">The final server is up and listening on 5432. The API has been dead for 0.6 s.</span></div>
</div>
<p>On the course Mac, a fresh Postgres was ready in under a second. On a small VPS or a busy CI runner the same steps take several seconds (the original text of this lesson said two to eight). The exact number does not matter: any non-zero gap is a race, and "start" is never "ready".</p>

<h3>A healthcheck turns "started" into "ready"</h3>
${slide('dk-09', 14, 'healthcheck + service_healthy: có và không có start_interval')}
<pre><code>services:
  db:
    image: postgres:16-alpine
    environment: { POSTGRES_PASSWORD: secret, POSTGRES_DB: blog }
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d blog"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 30s
  api:
    build: .
    depends_on:
      db:
        condition: service_healthy      <span class="tok-comment"># wait for the CHECK, not the start</span></code></pre>
<pre><code>docker compose up -d 2&gt;&amp;1 | tail -4
docker compose ps --format 'table {{.Service}}\\t{{.Status}}'</code></pre>
<div class="out"> ✔ Container blog-db-1   Healthy                          6.4s
 ✔ Container blog-api-1  Started                          6.6s

SERVICE   STATUS
api       Up 12 seconds
db        Up 18 seconds (healthy)</div>
<div class="callout ok"><strong>Note the word "Healthy" in the progress line.</strong> Compose waited 6.4 seconds — not a fixed sleep, but until <code>pg_isready</code> actually succeeded — and only then started the API. On a fast machine that is two seconds; on a loaded CI runner it might be twenty. The condition adapts; a <code>sleep 10</code> does not.</div>

<h3>Where did the 6.4 seconds go? Mostly waiting for the first check</h3>
<p>The output above says Compose waited 6.4 s for db to become healthy. The race we just measured says Postgres is ready in under one second. The difference is not Postgres — it is <code>interval</code>. Docker runs the <strong>first</strong> check only after one full interval, so with <code>interval: 5s</code> nothing can be declared healthy before second five. Measured on the course Mac with the same stack and an empty volume each time:</p>
<table>
<tr><th>Healthcheck settings</th><th>First check at</th><th>db healthy at</th><th>api started at</th></tr>
<tr><td><code>interval: 5s</code>, <code>start_period: 30s</code></td><td>5.00 s</td><td>5.03 s</td><td>5.59 s</td></tr>
<tr><td>same + <code>start_interval: 1s</code></td><td>1.00 s</td><td>1.03 s</td><td>1.58 s</td></tr>
</table>
<p><code>start_interval</code> (Docker Engine 25 and later) is how often to check <em>during</em> <code>start_period</code>. It lets you poll quickly while the service is booting without hammering it every second for the rest of its life. On any recent Docker, set it:</p>
<pre><code class="language-yaml">    healthcheck:
      test: ["CMD-SHELL", "pg_isready -h 127.0.0.1 -U postgres -d blog"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 30s
      start_interval: 1s</code></pre>
<div class="out">[+] up 6/6
 ✔ Network dk09-blog_private   Created                                      0.0s
 ✔ Volume dk09-blog_pgdata     Created                                      0.0s
 ✔ Network dk09-blog_public    Created                                      0.0s
 ✔ Container dk09-blog-db-1    Healthy                                      1.8s
 ✔ Container dk09-blog-api-1   Started                                      1.8s
 ✔ Container dk09-blog-proxy-1 Started                                      1.9s</div>
<p>Notice the <code>-h 127.0.0.1</code> in the test. It is not decoration; the section after next explains why the lesson's original <code>pg_isready -U postgres -d blog</code> can lie.</p>

<h3>The four fields, and the one people get wrong</h3>
${slide('dk-09', 15, 'Năm con số của healthcheck — hay quên nhất là start_period')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">interval</span><span class="lz-t">how often to run the check</span><span class="lz-d">5–30s. Too frequent wastes CPU on a check that runs forever; too slow means a dead service stays "healthy" for a minute.</span></div>
  <div class="lz-step"><span class="lz-k">timeout</span><span class="lz-t">how long one check may take before counting as a failure</span><span class="lz-d">Must be shorter than <code>interval</code>. A check that can hang without a timeout is worse than no check.</span></div>
  <div class="lz-step"><span class="lz-k">retries</span><span class="lz-t">consecutive failures before the container is marked unhealthy</span><span class="lz-d">3–10. This is your tolerance for a transient blip; one failed check should not condemn a service.</span></div>
  <div class="lz-step"><span class="lz-k">start_period</span><span class="lz-t">a grace window where failures do NOT count</span><span class="lz-d">The one people omit. During it the container can fail every check without being marked unhealthy or restarted — which is exactly what a slow-starting JVM, a database running migrations, or a Next.js server needs.</span></div>
</div>
<pre><code><span class="tok-comment"># Watch the state machine directly</span>
docker inspect -f '{{ .State.Health.Status }}' blog-db-1
docker inspect -f '{{ range .State.Health.Log }}{{ .ExitCode }} {{ .Output }}{{ end }}' blog-db-1 | head -2</code></pre>
<div class="out">healthy
1 /var/run/postgresql:5432 - no response
0 /var/run/postgresql:5432 - accepting connections</div>

<h3>Healthchecks for the services you actually run</h3>
${slide('dk-09', 16, 'pg_isready qua socket báo “sẵn sàng” khi còn đang initdb')}
<pre><code>  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U &#36;{POSTGRES_USER} -d &#36;{POSTGRES_DB}"]

  redis:
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]

  api:                       <span class="tok-comment"># no curl in a distroless/slim image — use the runtime</span>
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://127.0.0.1:3000/health').then(r=&gt;process.exit(r.ok?0:1)).catch(()=&gt;process.exit(1))"]
      interval: 10s
      start_period: 40s

  nginx:
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost/healthz || exit 1"]</code></pre>
<div class="callout warn"><strong>Check that the check can run.</strong> A healthcheck calling <code>curl</code> in an image without <code>curl</code> fails forever, and the container is marked unhealthy while the application is perfectly fine. This project hit exactly that: a frontend check in <code>deploy.sh</code> called <code>wget</code> inside a container whose Dockerfile deliberately installs neither <code>wget</code> nor <code>curl</code>, so the loop burned all six retries and ~25 seconds on every deploy while checking nothing. Inside a Node image use <code>node -e</code>; inside distroless use the application's own binary; and verify with <code>docker exec</code> before you trust the result.</div>

<h3>Run it step by step: catch pg_isready saying "ready" too early</h3>
<p>Remember the <em>temporary</em> server from the race timeline? It accepts connections on the Unix socket inside the container while <code>initdb</code> runs, then shuts down, and only then does the real server open TCP port 5432. <code>pg_isready</code> with no <code>-h</code> checks the socket — so it can answer "accepting connections" during a window in which your API, which connects over the network, would still be refused. Ask both ways, forty times in a row, on a brand-new container:</p>
<pre><code class="language-bash">docker run -d --name thu-pgt --rm -e POSTGRES_PASSWORD=x -e POSTGRES_DB=blog postgres:16-alpine
for i in $(seq 1 40); do
  a=$(docker exec thu-pgt pg_isready -U postgres -d blog 2&gt;&amp;1 | sed 's/.*- //')
  b=$(docker exec thu-pgt pg_isready -h 127.0.0.1 -U postgres -d blog 2&gt;&amp;1 | sed 's/.*- //')
  echo "$(date +%T.%N | cut -c1-12) sock=[$a] tcp=[$b]"
done | uniq -f1 -c
docker rm -f thu-pgt</code></pre>
<div class="out">   6 01:38:36.778 sock=[no response] tcp=[no response]
   2 01:38:37.341 sock=[accepting connections] tcp=[no response]
   1 01:38:37.538 sock=[no response] tcp=[accepting connections]
  31 01:38:37.633 sock=[accepting connections] tcp=[accepting connections]</div>
<p>Line two is the bug: for two consecutive checks the socket said "accepting" while TCP said "no response". A healthcheck that happened to run in that window would mark db healthy, Compose would start the API, and the API would get ECONNREFUSED — exactly the failure the healthcheck was added to prevent, just rarer and therefore harder to debug. The fix is one flag: <strong>check the same path the application uses</strong>, <code>pg_isready -h 127.0.0.1</code>. (On the Mac, <code>date +%N</code> needs GNU coreutils' <code>gdate</code> on some setups; on Linux it works as written.)</p>
<p>Two more checks worth running once for any healthcheck you write:</p>
<pre><code class="language-bash"><span class="tok-comment"># 1. Does the command even exist in this image, and what does it return?</span>
docker compose exec db pg_isready -h 127.0.0.1 -U postgres -d blog; echo "exit=$?"
<span class="tok-comment"># 2. What has the check been saying? (last few results, newest last)</span>
docker inspect -f '{{range .State.Health.Log}}{{.ExitCode}} {{.Output}}{{end}}' dk09-blog-db-1 | tail -3</code></pre>
<div class="out">127.0.0.1:5432 - accepting connections
exit=0
0 127.0.0.1:5432 - accepting connections</div>
<p>(Right after <code>up</code> the health log holds only one result; Docker keeps the last five.) And if you forget the healthcheck entirely but keep <code>condition: service_healthy</code>, Compose v5.5.1 refuses instead of waiting forever:</p>
<div class="out">dependency failed to start: container dk09-nohc-db-1 has no healthcheck configured</div>

<h3>Waiting for a job to finish, not a service to be ready</h3>
${slide('dk-09', 17, 'Job migrate phải thoát 0 thì api mới được start')}
<pre><code>services:
  migrate:
    image: ghcr.io/me/api:1.4.2
    command: ["npx", "prisma", "migrate", "deploy"]
    depends_on:
      db: { condition: service_healthy }
    restart: "no"                         <span class="tok-comment"># it is SUPPOSED to exit</span>

  api:
    image: ghcr.io/me/api:1.4.2
    depends_on:
      db:      { condition: service_healthy }
      migrate: { condition: service_completed_successfully }</code></pre>
<div class="out">[+] Running 4/4
 ✔ Container blog-db-1       Healthy                       6.2s
 ✔ Container blog-migrate-1  Exited (0)                    9.8s
 ✔ Container blog-api-1      Started                      10.1s</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>service_started</code></span><span class="v">The default. The container has been created and started. Says nothing about the process inside.</span></div>
  <div class="kv"><span class="k"><code>service_healthy</code></span><span class="v">Waits for the healthcheck to pass. Requires the dependency to actually define one — without a healthcheck, compose errors out rather than waiting forever.</span></div>
  <div class="kv"><span class="k"><code>service_completed_successfully</code></span><span class="v">Waits for the container to exit 0. This is how migrations, seeds and one-off setup jobs slot into a stack correctly.</span></div>
  <div class="kv"><span class="k"><code>required: false</code></span><span class="v">Start anyway if the dependency is missing from the current profile. Useful when an optional service is behind a profile (Lesson 9.4).</span></div>
  <div class="kv"><span class="k">A failed dependency aborts the up</span><span class="v">If <code>migrate</code> exits non-zero, compose stops and reports it instead of starting an API against a half-migrated schema. That is the behaviour you want on a deploy.</span></div>
</div>

<h3>Run it step by step: a migration that succeeds, one that fails, and one that runs again</h3>
<p>The migration job above, made runnable without Prisma: a <code>psql</code> container that creates a table. <code>ON_ERROR_STOP=1</code> makes psql exit non-zero on any SQL error, which is what turns a failed migration into a failed dependency:</p>
<pre><code class="language-yaml">  migrate:
    image: postgres:16-alpine
    command: ["psql", "-h", "db", "-U", "postgres", "-d", "blog", "-v", "ON_ERROR_STOP=1",
              "-c", "CREATE TABLE IF NOT EXISTS post (id serial PRIMARY KEY, title text)"]
    environment: { PGPASSWORD: secret }
    networks: [private]
    depends_on:
      db: { condition: service_healthy }
    restart: "no"</code></pre>
<pre><code class="language-bash">docker compose up -d
docker compose ps -a --format 'table {{.Service}}\\t{{.Status}}'</code></pre>
<div class="out">[+] up 7/7
 ✔ Network dk09-blog_private     Created                                    0.0s
 ✔ Network dk09-blog_public      Created                                    0.0s
 ✔ Volume dk09-blog_pgdata       Created                                    0.0s
 ✔ Container dk09-blog-db-1      Healthy                                    2.5s
 ✔ Container dk09-blog-migrate-1 Exited                                     2.4s
 ✔ Container dk09-blog-api-1     Started                                    2.4s
 ✔ Container dk09-blog-proxy-1   Started                                    2.5s
SERVICE   STATUS
api       Up Less than a second
db        Up 2 seconds (healthy)
migrate   Exited (0) Less than a second ago
proxy     Up Less than a second</div>
<p>Now break the migration on purpose — an <code>ALTER TABLE</code> on a table that does not exist — and watch what happens to the API:</p>
<div class="out">…
 ✘ Container dk09-blog-migrate-1 Error service "migrate" didn't comple...   2.4s
 ✔ Container dk09-blog-api-1     Created                                    0.1s
service "migrate" didn't complete successfully: exit 1</div>
<pre><code class="language-bash">echo $?                              <span class="tok-comment"># exit code of docker compose up</span>
docker compose ps -a --format 'table {{.Service}}\\t{{.Status}}'
docker compose logs migrate | tail -1</code></pre>
<div class="out">1
SERVICE   STATUS
api       Created
db        Up 3 seconds (healthy)
migrate   Exited (1) Less than a second ago
proxy     Created
migrate-1  | ERROR:  relation "posts" does not exist</div>
<p>The API is <strong>Created but never started</strong> — it did not get to run against a half-migrated schema — and <code>docker compose up</code> itself exited with 1, so a deploy script with <code>set -e</code> stops right there. That is the behaviour you want.</p>
<p>One surprise worth knowing before you put real migrations in a job: <strong>the job runs again on every <code>up</code></strong>, because Compose starts every service whose container is not running, and a finished job is not running. After three <code>up</code> commands the logs read:</p>
<pre><code class="language-bash">docker compose logs -t migrate | cut -c1-110</code></pre>
<div class="out">migrate-1  | 2026-09-23T18:39:29.106831044Z CREATE TABLE
migrate-1  | 2026-09-23T18:39:29.106870877Z NOTICE:  relation "post" already exists, skipping
migrate-1  | 2026-09-23T18:40:12.378886800Z NOTICE:  relation "post" already exists, skipping
migrate-1  | 2026-09-23T18:40:12.378905009Z CREATE TABLE
migrate-1  | 2026-09-23T18:40:13.980078509Z NOTICE:  relation "post" already exists, skipping
migrate-1  | 2026-09-23T18:40:13.980091051Z CREATE TABLE</div>
<p>So migrations must be safe to repeat — <code>CREATE TABLE IF NOT EXISTS</code>, or a tool like <code>prisma migrate deploy</code> that records what it already applied and does nothing the second time.</p>

<h3>And the application still has to retry</h3>
${slide('dk-09', 18, 'Thứ tự khởi động chỉ đúng một lần — app vẫn phải tự thử lại')}
<p>Healthchecks fix start-up ordering. They do not fix the database restarting at 3am, a network blip, or a failover — at which point your API has been running for three days and its connection pool suddenly fails. Compose's ordering guarantees apply once, at start; resilience is the application's job for the rest of the time.</p>
<pre><code><span class="tok-comment"># The five lines that make ordering a convenience rather than a requirement</span>
async function connectWithRetry(attempt = 1) {
  try { return await prisma.\$connect(); }
  catch (err) {
    if (attempt &gt;= 10) throw err;
    const wait = Math.min(2 ** attempt * 100, 5000);   <span class="tok-comment"># exponential, capped</span>
    console.warn(&#96;db not ready (&#36;{err.code}), retry &#36;{attempt} in &#36;{wait}ms&#96;);
    await new Promise(r =&gt; setTimeout(r, wait));
    return connectWithRetry(attempt + 1);
  }
}</code></pre>
<div class="out">db not ready (P1001), retry 1 in 200ms
db not ready (P1001), retry 2 in 400ms
✓ connected to postgres://db:5432/blog</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your group's demo runs <code>docker compose up -d</code> on a freshly cloned laptop in front of the lecturers, and the backend dies with ECONNREFUSED — "it works the second time" is not an answer you want to give in a defence. Reproduce it, measure it, and fix it so the first <code>up</code> always works.</p><ol>
<li>In <code>~/thu-docker/thu-race</code>, write a compose file (<code>name: thu-race</code>) with <code>db</code> (<code>postgres:16-alpine</code>, <code>POSTGRES_PASSWORD: secret</code>, a named volume) and <code>api</code> — for the api use <code>postgres:16-alpine</code> too, with <code>command: ["psql", "-h", "db", "-U", "postgres", "-c", "select 1"]</code>, <code>environment: { PGPASSWORD: secret }</code> and plain <code>depends_on: [db]</code>.</li>
<li>From an empty volume (<code>docker compose down -v</code>), record <code>docker compose events --json</code> in a second terminal and run <code>docker compose up</code>. Note the api's exit code and the time between <code>db start</code> and <code>api die</code>.</li>
<li>Add a healthcheck to db with <code>pg_isready -h 127.0.0.1</code>, <code>interval: 5s</code>, <code>start_period: 30s</code>, and change the dependency to <code>condition: service_healthy</code>. Run again from an empty volume and note how long db took to become Healthy.</li>
<li>Add <code>start_interval: 1s</code> and repeat. Then add a <code>migrate</code> job with <code>ON_ERROR_STOP=1</code> and a deliberately broken SQL statement, and make api depend on it with <code>service_completed_successfully</code>.</li>
<li>Clean up: <code>docker compose down -v</code>.</li></ol>
<p><strong>Done when:</strong> step 2 shows api exiting non-zero; step 3 reaches Healthy after about one <code>interval</code>; step 4 reaches it in about a second; with the broken migration <code>docker compose ps -a</code> shows api as <code>Created</code> and <code>echo $?</code> after <code>up</code> prints 1.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Race condition</span><span class="v">A bug that depends on which of two things happens first — here, api connecting before db listens.</span></div>
  <div class="kv"><span class="k">Healthcheck</span><span class="v">A command Docker runs inside the container on a schedule; exit 0 = healthy, anything else = a failed check.</span></div>
  <div class="kv"><span class="k"><code>start_period</code> / <code>start_interval</code></span><span class="v">A boot-time grace window where failures do not count, and how often to check inside it.</span></div>
  <div class="kv"><span class="k"><code>service_healthy</code></span><span class="v">Dependency condition: wait until the dependency's healthcheck passes.</span></div>
  <div class="kv"><span class="k"><code>service_completed_successfully</code></span><span class="v">Dependency condition: wait until the dependency's container exits 0 — for migrations and seeds.</span></div>
  <div class="kv"><span class="k">Idempotent migration</span><span class="v">A migration that is harmless to run twice; required, because the job runs on every <code>up</code>.</span></div>
  <div class="kv"><span class="k">Exponential backoff</span><span class="v">Retrying with growing waits (200 ms, 400 ms, 800 ms…) up to a cap, so a restarting dependency is not flooded.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Plain <code>depends_on</code> only orders container starts; measured, the API started 108 ms after db and died 0.6 s before Postgres was ready.</li>
<li>A healthcheck plus <code>condition: service_healthy</code> waits for real readiness; the first check comes after one <code>interval</code>, so add <code>start_interval</code>.</li>
<li>Check the same path the app uses: <code>pg_isready -h 127.0.0.1</code>, because the socket check can say "ready" during <code>initdb</code>.</li>
<li>Make sure the check's command exists in the image; a missing <code>curl</code> means unhealthy forever.</li>
<li><code>service_completed_successfully</code> keeps the API in <code>Created</code> when a migration fails, and <code>up</code> exits 1 — but the job re-runs on every <code>up</code>, so migrations must be idempotent.</li>
<li>Startup ordering happens once; the application still needs retries with backoff for the rest of its life.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/compose-file/services/#healthcheck" target="_blank" rel="noopener">
  <span class="lc-ico">❤️</span>
  <span class="lc-body"><span class="lc-title">Compose reference — healthcheck</span><span class="lc-sub">Every field, the <code>CMD</code> versus <code>CMD-SHELL</code> distinction, how to disable an inherited healthcheck with <code>disable: true</code>, and the interaction with <code>start_interval</code>.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/compose/how-tos/startup-order/" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Control startup order</span><span class="lc-sub">The official position, which is worth reading in full: compose can order starts, but your application should still handle a dependency being temporarily unavailable.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: fix a race at startup</span><span class="lc-sub">Graded exercises: reproduce the ECONNREFUSED race, fix it with a healthcheck and <code>service_healthy</code>, add a migration job with <code>service_completed_successfully</code>, and write a healthcheck for an image with no curl.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> replacing a healthcheck with <code>sleep 15</code> in the entrypoint. It works on the machine where you tuned it and fails everywhere else: too short on a loaded CI runner, where the database takes twenty seconds and the API crashes anyway; and pure waste on every subsequent start where the database was ready in one second, since you pay the full fifteen every single time. A healthcheck is the same idea done properly — it polls, so it returns as soon as the service is genuinely ready and keeps waiting when it is not. And unlike a sleep, it keeps reporting after start-up: <code>docker compose ps</code> shows <code>(unhealthy)</code> the moment a service stops answering, which is the signal Chapter 11 builds restart policies and monitoring on top of.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Plain <code>depends_on</code> orders starts, not readiness — pair it with a healthcheck and <code>condition: service_healthy</code>. Always set <code>start_period</code>, so a slow-starting service is not marked unhealthy while it is still legitimately booting. And verify the check can actually run inside that image: a healthcheck calling a binary the image does not ship fails forever and tells you nothing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>depends_on, healthcheck, thứ tự khởi động</h2>
<p class="lead">Cái hỏng kinh điển của compose: đã đặt <code>depends_on: [db]</code>, stack dựng lên, và API chết ngay lập tức vì Postgres chưa nhận kết nối. <code>depends_on</code> trần chỉ sắp thứ tự KHỞI ĐỘNG, không sắp mức SẴN SÀNG — và khoảng trống giữa "container đã khởi động" với "dịch vụ đã sẵn sàng" chính là chỗ bài này sống.</p>

<h3>Tái hiện cái hỏng</h3>
${slide('dk-09', 13, 'depends_on trần: api chết trước khi Postgres sẵn sàng (đo bằng mili giây)')}
<pre><code>services:
  db:
    image: postgres:16-alpine
    environment: { POSTGRES_PASSWORD: secret }
  api:
    build: .
    depends_on: [db]          <span class="tok-comment"># đã khởi động, CHƯA sẵn sàng</span></code></pre>
<pre><code>docker compose up 2&gt;&amp;1 | tail -5</code></pre>
<div class="out">blog-db-1   | The files belonging to this database system will be owned by "postgres".
blog-api-1  | Error: connect ECONNREFUSED 172.19.0.2:5432
blog-api-1  |     at TCPConnectWrap.afterConnect [as oncomplete]
blog-api-1 exited with code 1
blog-db-1   | 2026-08-22 11:20:41.113 UTC [1] LOG:  database system is ready to accept connections</div>
<p>Hãy nhìn hai dòng cuối và thứ tự của chúng: API đã bỏ cuộc TRƯỚC khi Postgres khởi tạo xong. Postgres mất từ hai tới tám giây mới sẵn sàng ở lần chạy đầu, vì nó tạo thư mục dữ liệu, chạy initdb, rồi tự khởi động lại một lần. Không có gì trong việc khởi động container chờ bất kỳ bước nào trong số đó.</p>

<h3>Chạy thử từng bước: đo cuộc đua tới từng mili giây</h3>
<p>"API khởi động sớm quá" là một câu mơ hồ. <code>docker compose events</code> biến nó thành con số. Mở một terminal thứ hai ở thư mục dự án, bắt đầu ghi, rồi ở terminal thứ nhất dựng stack lên từ một volume rỗng (chạy <code>docker compose down -v</code> trước — CHỈ trên dự án tập của BẠN):</p>
<pre><code class="language-bash"><span class="tok-comment"># terminal 2 — ghi lại mọi sự kiện container kèm mốc giờ</span>
docker compose events --json &gt; events.json
<span class="tok-comment"># terminal 1</span>
docker compose up -d
<span class="tok-comment"># rồi dừng terminal 2 bằng Ctrl+C và đọc file</span></code></pre>
<div class="out">01:38:14.540 db   start
01:38:14.648 api  start
01:38:14.814 api  die    exitCode=1</div>
<pre><code class="language-bash">docker compose logs -t db | grep -E "ready to accept|init process"</code></pre>
<div class="out">db-1  | 2026-09-23T18:38:15.163926843Z … database system is ready to accept connections
db-1  | 2026-09-23T18:38:15.383967427Z PostgreSQL init process complete; ready for start up.
db-1  | 2026-09-23T18:38:15.406250593Z … database system is ready to accept connections</div>
<p>(Các dòng sự kiện ở trên là JSON rút gọn thành giờ · dịch vụ · hành động. <code>logs -t</code> in giờ UTC, nên 18:38 UTC chính là 01:38 giờ Việt Nam, +07 — cùng một đồng hồ.) Xếp các con số lên một trục, tính từ lúc db khởi động:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">0 ms</span><span class="lz-t">container db khởi động</span><span class="lz-d">Entrypoint của Postgres bắt đầu chạy <code>initdb</code> (khởi tạo cụm CSDL) trên volume rỗng.</span></div>
  <div class="lz-step"><span class="lz-k">108 ms</span><span class="lz-t">container api khởi động</span><span class="lz-d"><code>depends_on</code> đã thoả: db đã được <em>khởi động</em>. Nó chỉ kiểm đúng có vậy.</span></div>
  <div class="lz-step"><span class="lz-k">274 ms</span><span class="lz-t">api chết với mã thoát 1</span><span class="lz-d">Nó thử <code>db:5432</code> một lần, bị ECONNREFUSED, rồi thoát.</span></div>
  <div class="lz-step"><span class="lz-k">624 ms</span><span class="lz-t">"ready to accept connections" — lần thứ nhất</span><span class="lz-d">Đây là một máy chủ TẠM mà initdb bật lên để chạy script thiết lập. Nó chỉ nghe trên unix socket (ổ cắm nội bộ), KHÔNG nghe cổng TCP 5432, và bị tắt ngay sau đó. Hãy nhớ dòng này — nó là cái bẫy của mục kế tiếp nữa.</span></div>
  <div class="lz-step"><span class="lz-k">866 ms</span><span class="lz-t">"ready to accept connections" — lần thật</span><span class="lz-d">Máy chủ cuối cùng đã lên và nghe cổng 5432. API đã chết được 0,6 giây.</span></div>
</div>
<p>Trên máy Mac của khoá, một Postgres mới tinh sẵn sàng trong chưa tới một giây. Trên một VPS nhỏ hay một runner CI đang bận, cùng các bước đó mất vài giây (bản gốc của bài này ghi hai tới tám giây). Con số chính xác không quan trọng: khoảng hở nào lớn hơn 0 cũng là một cuộc đua, và "đã khởi động" không bao giờ là "đã sẵn sàng".</p>

<h3>Healthcheck biến "đã khởi động" thành "đã sẵn sàng"</h3>
${slide('dk-09', 14, 'healthcheck + service_healthy: có và không có start_interval')}
<pre><code>services:
  db:
    image: postgres:16-alpine
    environment: { POSTGRES_PASSWORD: secret, POSTGRES_DB: blog }
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d blog"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 30s
  api:
    build: .
    depends_on:
      db:
        condition: service_healthy      <span class="tok-comment"># chờ PHÉP KIỂM, không chờ lúc khởi động</span></code></pre>
<pre><code>docker compose up -d 2&gt;&amp;1 | tail -4
docker compose ps --format 'table {{.Service}}\\t{{.Status}}'</code></pre>
<div class="out"> ✔ Container blog-db-1   Healthy                          6.4s
 ✔ Container blog-api-1  Started                          6.6s

SERVICE   STATUS
api       Up 12 seconds
db        Up 18 seconds (healthy)</div>
<div class="callout ok"><strong>Để ý chữ "Healthy" trong dòng tiến trình.</strong> Compose đã chờ 6,4 giây — không phải một lệnh sleep cố định, mà chờ tới lúc <code>pg_isready</code> thật sự thành công — rồi mới khởi động API. Trên máy nhanh thì con số đó là hai giây; trên một runner CI đang tải nặng có thể là hai mươi. Điều kiện thì thích ứng được; một lệnh <code>sleep 10</code> thì không.</div>

<h3>6,4 giây đó đi đâu? Phần lớn là chờ lần kiểm ĐẦU TIÊN</h3>
<p>Output ở trên nói Compose đã chờ 6,4 giây cho db thành healthy. Cuộc đua vừa đo lại nói Postgres sẵn sàng trong chưa tới một giây. Khoảng chênh không nằm ở Postgres — nó nằm ở <code>interval</code>. Docker chỉ chạy lần kiểm <strong>đầu tiên</strong> sau trọn một interval, nên với <code>interval: 5s</code> thì trước giây thứ năm không gì được tuyên bố healthy cả. Đo trên máy Mac của khoá, cùng stack, mỗi lần một volume rỗng:</p>
<table>
<tr><th>Cấu hình healthcheck</th><th>Lần kiểm đầu lúc</th><th>db healthy lúc</th><th>api khởi động lúc</th></tr>
<tr><td><code>interval: 5s</code>, <code>start_period: 30s</code></td><td>5,00 s</td><td>5,03 s</td><td>5,59 s</td></tr>
<tr><td>như trên + <code>start_interval: 1s</code></td><td>1,00 s</td><td>1,03 s</td><td>1,58 s</td></tr>
</table>
<p><code>start_interval</code> (Docker Engine 25 trở lên) là nhịp kiểm <em>trong</em> <code>start_period</code>. Nó cho phép thăm dò dày trong lúc dịch vụ đang khởi động mà không phải gõ cửa mỗi giây suốt phần đời còn lại của nó. Trên mọi bản Docker gần đây, hãy đặt nó:</p>
<pre><code class="language-yaml">    healthcheck:
      test: ["CMD-SHELL", "pg_isready -h 127.0.0.1 -U postgres -d blog"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 30s
      start_interval: 1s</code></pre>
<div class="out">[+] up 6/6
 ✔ Network dk09-blog_private   Created                                      0.0s
 ✔ Volume dk09-blog_pgdata     Created                                      0.0s
 ✔ Network dk09-blog_public    Created                                      0.0s
 ✔ Container dk09-blog-db-1    Healthy                                      1.8s
 ✔ Container dk09-blog-api-1   Started                                      1.8s
 ✔ Container dk09-blog-proxy-1 Started                                      1.9s</div>
<p>Để ý <code>-h 127.0.0.1</code> trong lệnh kiểm. Nó không phải để trang trí; mục sau nữa giải thích vì sao lệnh gốc của bài <code>pg_isready -U postgres -d blog</code> có thể nói dối.</p>

<h3>Bốn trường, và cái người ta hay bỏ sót</h3>
${slide('dk-09', 15, 'Năm con số của healthcheck — hay quên nhất là start_period')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">interval</span><span class="lz-t">bao lâu chạy phép kiểm một lần</span><span class="lz-d">5–30s. Quá dày thì phí CPU cho một phép kiểm chạy mãi mãi; quá thưa thì một dịch vụ đã chết vẫn còn "khoẻ mạnh" cả phút.</span></div>
  <div class="lz-step"><span class="lz-k">timeout</span><span class="lz-t">một lần kiểm được phép chạy bao lâu trước khi tính là thất bại</span><span class="lz-d">Phải ngắn hơn <code>interval</code>. Một phép kiểm có thể treo mà không có timeout thì còn tệ hơn không kiểm.</span></div>
  <div class="lz-step"><span class="lz-k">retries</span><span class="lz-t">bao nhiêu lần thất bại LIÊN TIẾP thì container bị đánh dấu không khoẻ</span><span class="lz-d">3–10. Đây là mức chịu đựng của bạn với một trục trặc thoáng qua; một lần kiểm hỏng không nên kết án cả dịch vụ.</span></div>
  <div class="lz-step"><span class="lz-k">start_period</span><span class="lz-t">một cửa sổ ân hạn trong đó thất bại KHÔNG bị tính</span><span class="lz-d">Cái người ta hay bỏ. Trong khoảng đó container có thể hỏng mọi lần kiểm mà không bị đánh dấu không khoẻ hay bị khởi động lại — và đó đúng là thứ một JVM khởi động chậm, một cơ sở dữ liệu đang chạy migration, hay một máy chủ Next.js cần.</span></div>
</div>
<pre><code><span class="tok-comment"># Xem thẳng cái máy trạng thái</span>
docker inspect -f '{{ .State.Health.Status }}' blog-db-1
docker inspect -f '{{ range .State.Health.Log }}{{ .ExitCode }} {{ .Output }}{{ end }}' blog-db-1 | head -2</code></pre>
<div class="out">healthy
1 /var/run/postgresql:5432 - no response
0 /var/run/postgresql:5432 - accepting connections</div>

<h3>Healthcheck cho những dịch vụ bạn thật sự chạy</h3>
${slide('dk-09', 16, 'pg_isready qua socket báo “sẵn sàng” khi còn đang initdb')}
<pre><code>  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U &#36;{POSTGRES_USER} -d &#36;{POSTGRES_DB}"]

  redis:
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]

  api:                       <span class="tok-comment"># ảnh distroless/slim không có curl — dùng chính bộ chạy</span>
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://127.0.0.1:3000/health').then(r=&gt;process.exit(r.ok?0:1)).catch(()=&gt;process.exit(1))"]
      interval: 10s
      start_period: 40s

  nginx:
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost/healthz || exit 1"]</code></pre>
<div class="callout warn"><strong>Hãy kiểm xem phép kiểm có chạy được không.</strong> Một healthcheck gọi <code>curl</code> trong một cái ảnh không có <code>curl</code> sẽ hỏng mãi mãi, và container bị đánh dấu không khoẻ trong khi ứng dụng hoàn toàn bình thường. Chính dự án này đã dính đúng chuyện đó: một phép kiểm frontend trong <code>deploy.sh</code> gọi <code>wget</code> bên trong một container mà Dockerfile của nó cố ý không cài cả <code>wget</code> lẫn <code>curl</code>, nên vòng lặp đốt hết sáu lượt thử và khoảng 25 giây ở mỗi lần deploy mà chẳng kiểm được gì. Trong ảnh Node thì dùng <code>node -e</code>; trong distroless thì dùng chính tệp nhị phân của ứng dụng; và hãy xác minh bằng <code>docker exec</code> trước khi tin vào kết quả.</div>

<h3>Chạy thử từng bước: bắt quả tang pg_isready báo "sẵn sàng" quá sớm</h3>
<p>Nhớ cái máy chủ TẠM trên dòng thời gian cuộc đua chứ? Nó nhận kết nối qua unix socket bên trong container trong lúc <code>initdb</code> chạy, rồi tắt đi, và chỉ sau đó máy chủ thật mới mở cổng TCP 5432. <code>pg_isready</code> không có <code>-h</code> thì kiểm qua socket — nên nó có thể trả lời "accepting connections" trong một khoảng thời gian mà API của bạn, vốn kết nối qua mạng, vẫn bị từ chối. Hỏi theo cả hai cách, bốn mươi lần liền, trên một container mới tinh:</p>
<pre><code class="language-bash">docker run -d --name thu-pgt --rm -e POSTGRES_PASSWORD=x -e POSTGRES_DB=blog postgres:16-alpine
for i in $(seq 1 40); do
  a=$(docker exec thu-pgt pg_isready -U postgres -d blog 2&gt;&amp;1 | sed 's/.*- //')
  b=$(docker exec thu-pgt pg_isready -h 127.0.0.1 -U postgres -d blog 2&gt;&amp;1 | sed 's/.*- //')
  echo "$(date +%T.%N | cut -c1-12) sock=[$a] tcp=[$b]"
done | uniq -f1 -c
docker rm -f thu-pgt</code></pre>
<div class="out">   6 01:38:36.778 sock=[no response] tcp=[no response]
   2 01:38:37.341 sock=[accepting connections] tcp=[no response]
   1 01:38:37.538 sock=[no response] tcp=[accepting connections]
  31 01:38:37.633 sock=[accepting connections] tcp=[accepting connections]</div>
<p>Dòng thứ hai chính là lỗi: hai lần kiểm liên tiếp socket nói "accepting" trong khi TCP nói "no response". Một healthcheck tình cờ chạy đúng khoảng đó sẽ đánh dấu db healthy, Compose khởi động API, và API ăn ECONNREFUSED — đúng cái hỏng mà healthcheck được thêm vào để ngăn, chỉ là hiếm hơn nên khó gỡ hơn. Cách chữa là một cái cờ: <strong>kiểm đúng con đường mà ứng dụng đi</strong>, <code>pg_isready -h 127.0.0.1</code>. (Trên Mac, <code>date +%N</code> ở vài máy cần <code>gdate</code> của GNU coreutils; trên Linux chạy y như viết.)</p>
<p>Thêm hai phép kiểm nên chạy một lần cho mọi healthcheck bạn viết:</p>
<pre><code class="language-bash"><span class="tok-comment"># 1. Lệnh có tồn tại trong ảnh này không, và nó trả về gì?</span>
docker compose exec db pg_isready -h 127.0.0.1 -U postgres -d blog; echo "exit=$?"
<span class="tok-comment"># 2. Phép kiểm dạo này nói gì? (vài kết quả gần nhất, mới nhất ở cuối)</span>
docker inspect -f '{{range .State.Health.Log}}{{.ExitCode}} {{.Output}}{{end}}' dk09-blog-db-1 | tail -3</code></pre>
<div class="out">127.0.0.1:5432 - accepting connections
exit=0
0 127.0.0.1:5432 - accepting connections</div>
<p>(Ngay sau <code>up</code> nhật ký sức khoẻ mới có một kết quả; Docker giữ tối đa năm kết quả gần nhất.) Còn nếu bạn quên hẳn healthcheck mà vẫn giữ <code>condition: service_healthy</code>, Compose v5.5.1 từ chối luôn chứ không chờ vô tận:</p>
<div class="out">dependency failed to start: container dk09-nohc-db-1 has no healthcheck configured</div>

<h3>Chờ một việc CHẠY XONG, không phải chờ một dịch vụ sẵn sàng</h3>
${slide('dk-09', 17, 'Job migrate phải thoát 0 thì api mới được start')}
<pre><code>services:
  migrate:
    image: ghcr.io/me/api:1.4.2
    command: ["npx", "prisma", "migrate", "deploy"]
    depends_on:
      db: { condition: service_healthy }
    restart: "no"                         <span class="tok-comment"># nó ĐƯỢC PHÉP thoát</span>

  api:
    image: ghcr.io/me/api:1.4.2
    depends_on:
      db:      { condition: service_healthy }
      migrate: { condition: service_completed_successfully }</code></pre>
<div class="out">[+] Running 4/4
 ✔ Container blog-db-1       Healthy                       6.2s
 ✔ Container blog-migrate-1  Exited (0)                    9.8s
 ✔ Container blog-api-1      Started                      10.1s</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>service_started</code></span><span class="v">Mặc định. Container đã được tạo và đã khởi động. Không nói gì về tiến trình bên trong.</span></div>
  <div class="kv"><span class="k"><code>service_healthy</code></span><span class="v">Chờ healthcheck qua. Đòi hỏi bên phụ thuộc phải thật sự có định nghĩa một cái — không có healthcheck thì compose báo lỗi chứ không chờ vô tận.</span></div>
  <div class="kv"><span class="k"><code>service_completed_successfully</code></span><span class="v">Chờ container thoát với mã 0. Đây là cách migration, seed và các việc thiết lập một lần lắp vào một stack cho đúng.</span></div>
  <div class="kv"><span class="k"><code>required: false</code></span><span class="v">Cứ khởi động kể cả khi bên phụ thuộc vắng mặt trong profile hiện tại. Hữu ích khi một dịch vụ tuỳ chọn nằm sau một profile (Bài 9.4).</span></div>
  <div class="kv"><span class="k">Một phụ thuộc hỏng thì huỷ cả lượt up</span><span class="v">Nếu <code>migrate</code> thoát khác 0, compose dừng lại và báo cáo thay vì khởi động một API trên một schema mới migrate được nửa chừng. Đó đúng là hành vi bạn muốn khi deploy.</span></div>
</div>

<h3>Chạy thử từng bước: một migration thành công, một cái thất bại, và một cái chạy lại</h3>
<p>Job migration ở trên, làm cho chạy được mà không cần Prisma: một container <code>psql</code> tạo một bảng. <code>ON_ERROR_STOP=1</code> khiến psql thoát với mã khác 0 khi gặp bất kỳ lỗi SQL nào, và chính điều đó biến một migration hỏng thành một phụ thuộc hỏng:</p>
<pre><code class="language-yaml">  migrate:
    image: postgres:16-alpine
    command: ["psql", "-h", "db", "-U", "postgres", "-d", "blog", "-v", "ON_ERROR_STOP=1",
              "-c", "CREATE TABLE IF NOT EXISTS post (id serial PRIMARY KEY, title text)"]
    environment: { PGPASSWORD: secret }
    networks: [private]
    depends_on:
      db: { condition: service_healthy }
    restart: "no"</code></pre>
<pre><code class="language-bash">docker compose up -d
docker compose ps -a --format 'table {{.Service}}\\t{{.Status}}'</code></pre>
<div class="out">[+] up 7/7
 ✔ Network dk09-blog_private     Created                                    0.0s
 ✔ Network dk09-blog_public      Created                                    0.0s
 ✔ Volume dk09-blog_pgdata       Created                                    0.0s
 ✔ Container dk09-blog-db-1      Healthy                                    2.5s
 ✔ Container dk09-blog-migrate-1 Exited                                     2.4s
 ✔ Container dk09-blog-api-1     Started                                    2.4s
 ✔ Container dk09-blog-proxy-1   Started                                    2.5s
SERVICE   STATUS
api       Up Less than a second
db        Up 2 seconds (healthy)
migrate   Exited (0) Less than a second ago
proxy     Up Less than a second</div>
<p>Giờ cố tình làm hỏng migration — một câu <code>ALTER TABLE</code> vào bảng không tồn tại — và xem chuyện gì xảy ra với API:</p>
<div class="out">…
 ✘ Container dk09-blog-migrate-1 Error service "migrate" didn't comple...   2.4s
 ✔ Container dk09-blog-api-1     Created                                    0.1s
service "migrate" didn't complete successfully: exit 1</div>
<pre><code class="language-bash">echo $?                              <span class="tok-comment"># mã thoát của chính docker compose up</span>
docker compose ps -a --format 'table {{.Service}}\\t{{.Status}}'
docker compose logs migrate | tail -1</code></pre>
<div class="out">1
SERVICE   STATUS
api       Created
db        Up 3 seconds (healthy)
migrate   Exited (1) Less than a second ago
proxy     Created
migrate-1  | ERROR:  relation "posts" does not exist</div>
<p>API ở trạng thái <strong>Created nhưng không bao giờ được khởi động</strong> — nó không phải chạy trên một schema migrate dở dang — và bản thân <code>docker compose up</code> thoát với mã 1, nên một script deploy có <code>set -e</code> dừng ngay tại đó. Đó đúng là hành vi bạn muốn.</p>
<p>Một điều bất ngờ nên biết trước khi đặt migration thật vào job: <strong>job chạy lại ở MỌI lần <code>up</code></strong>, vì Compose khởi động mọi dịch vụ có container không đang chạy, mà một job đã xong thì không đang chạy. Sau ba lệnh <code>up</code>, log ghi:</p>
<pre><code class="language-bash">docker compose logs -t migrate | cut -c1-110</code></pre>
<div class="out">migrate-1  | 2026-09-23T18:39:29.106831044Z CREATE TABLE
migrate-1  | 2026-09-23T18:39:29.106870877Z NOTICE:  relation "post" already exists, skipping
migrate-1  | 2026-09-23T18:40:12.378886800Z NOTICE:  relation "post" already exists, skipping
migrate-1  | 2026-09-23T18:40:12.378905009Z CREATE TABLE
migrate-1  | 2026-09-23T18:40:13.980078509Z NOTICE:  relation "post" already exists, skipping
migrate-1  | 2026-09-23T18:40:13.980091051Z CREATE TABLE</div>
<p>Vậy migration phải chạy lặp lại được mà vô hại — <code>CREATE TABLE IF NOT EXISTS</code>, hoặc một công cụ như <code>prisma migrate deploy</code> ghi nhớ những gì đã áp dụng và lần thứ hai không làm gì.</p>

<h3>Và ứng dụng thì vẫn phải tự thử lại</h3>
${slide('dk-09', 18, 'Thứ tự khởi động chỉ đúng một lần — app vẫn phải tự thử lại')}
<p>Healthcheck chữa được thứ tự lúc khởi động. Nó KHÔNG chữa được chuyện cơ sở dữ liệu khởi động lại lúc 3 giờ sáng, một trục trặc mạng, hay một lần chuyển dự phòng — lúc đó API của bạn đã chạy ba ngày rồi và bể kết nối của nó đột nhiên hỏng. Bảo đảm về thứ tự của compose chỉ áp dụng MỘT lần, lúc khởi động; sức chịu đựng ở mọi thời điểm còn lại là việc của ứng dụng.</p>
<pre><code><span class="tok-comment"># Năm dòng biến thứ tự khởi động thành một tiện lợi thay vì một đòi hỏi</span>
async function connectWithRetry(attempt = 1) {
  try { return await prisma.\$connect(); }
  catch (err) {
    if (attempt &gt;= 10) throw err;
    const wait = Math.min(2 ** attempt * 100, 5000);   <span class="tok-comment"># tăng theo hàm mũ, có trần</span>
    console.warn(&#96;db not ready (&#36;{err.code}), retry &#36;{attempt} in &#36;{wait}ms&#96;);
    await new Promise(r =&gt; setTimeout(r, wait));
    return connectWithRetry(attempt + 1);
  }
}</code></pre>
<div class="out">db not ready (P1001), retry 1 in 200ms
db not ready (P1001), retry 2 in 400ms
✓ connected to postgres://db:5432/blog</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> buổi demo của nhóm chạy <code>docker compose up -d</code> trên một laptop vừa clone repo ngay trước mặt hội đồng, và backend chết với ECONNREFUSED — "chạy lần hai thì được ạ" không phải câu bạn muốn nói lúc bảo vệ. Hãy tái hiện, đo, và chữa để lệnh <code>up</code> ĐẦU TIÊN lúc nào cũng chạy.</p><ol>
<li>Trong <code>~/thu-docker/thu-race</code>, viết file compose (<code>name: thu-race</code>) có <code>db</code> (<code>postgres:16-alpine</code>, <code>POSTGRES_PASSWORD: secret</code>, một volume có tên) và <code>api</code> — với api cũng dùng <code>postgres:16-alpine</code>, <code>command: ["psql", "-h", "db", "-U", "postgres", "-c", "select 1"]</code>, <code>environment: { PGPASSWORD: secret }</code> và <code>depends_on: [db]</code> trần.</li>
<li>Từ volume rỗng (<code>docker compose down -v</code>), ghi <code>docker compose events --json</code> ở terminal thứ hai rồi chạy <code>docker compose up</code>. Ghi lại mã thoát của api và khoảng thời gian giữa <code>db start</code> với <code>api die</code>.</li>
<li>Thêm healthcheck cho db bằng <code>pg_isready -h 127.0.0.1</code>, <code>interval: 5s</code>, <code>start_period: 30s</code>, và đổi phụ thuộc thành <code>condition: service_healthy</code>. Chạy lại từ volume rỗng và ghi xem db mất bao lâu mới Healthy.</li>
<li>Thêm <code>start_interval: 1s</code> rồi làm lại. Sau đó thêm job <code>migrate</code> có <code>ON_ERROR_STOP=1</code> với một câu SQL cố tình sai, và cho api phụ thuộc nó bằng <code>service_completed_successfully</code>.</li>
<li>Dọn: <code>docker compose down -v</code>.</li></ol>
<p><strong>Đạt khi:</strong> bước 2 cho thấy api thoát với mã khác 0; bước 3 Healthy sau chừng một <code>interval</code>; bước 4 Healthy trong khoảng một giây; với migration hỏng thì <code>docker compose ps -a</code> cho api ở <code>Created</code> và <code>echo $?</code> sau <code>up</code> in ra 1.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Race condition (cuộc đua)</span><span class="v">Lỗi phụ thuộc vào việc cái nào xảy ra trước — ở đây là api kết nối trước khi db kịp nghe cổng.</span></div>
  <div class="kv"><span class="k">Healthcheck (phép kiểm sức khoẻ)</span><span class="v">Một lệnh Docker chạy định kỳ bên trong container; thoát 0 = khoẻ, còn lại = một lần kiểm hỏng.</span></div>
  <div class="kv"><span class="k"><code>start_period</code> / <code>start_interval</code> (thời gian ân hạn / nhịp kiểm lúc khởi động)</span><span class="v">Cửa sổ lúc khởi động mà lần hỏng không bị tính, và nhịp kiểm bên trong cửa sổ đó.</span></div>
  <div class="kv"><span class="k"><code>service_healthy</code></span><span class="v">Điều kiện phụ thuộc: chờ tới khi healthcheck của bên kia đạt.</span></div>
  <div class="kv"><span class="k"><code>service_completed_successfully</code></span><span class="v">Điều kiện phụ thuộc: chờ container bên kia thoát với mã 0 — dành cho migration và nạp dữ liệu mẫu.</span></div>
  <div class="kv"><span class="k">Idempotent migration (migration chạy lặp vô hại)</span><span class="v">Migration chạy hai lần cũng không sao; bắt buộc, vì job chạy lại ở mọi lần <code>up</code>.</span></div>
  <div class="kv"><span class="k">Exponential backoff (lùi dần theo cấp số nhân)</span><span class="v">Thử lại với thời gian chờ tăng dần (200 ms, 400 ms, 800 ms…) tới một trần, để không dồn dập một phụ thuộc đang khởi động lại.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>depends_on</code> trần chỉ xếp thứ tự khởi động container; đo thật, API khởi động sau db 108 ms và chết trước khi Postgres sẵn sàng 0,6 giây.</li>
<li>Healthcheck cộng <code>condition: service_healthy</code> chờ đến khi sẵn sàng thật; lần kiểm đầu tới sau một <code>interval</code>, nên hãy thêm <code>start_interval</code>.</li>
<li>Kiểm đúng đường ứng dụng đi: <code>pg_isready -h 127.0.0.1</code>, vì kiểm qua socket có thể báo "sẵn sàng" giữa lúc <code>initdb</code>.</li>
<li>Bảo đảm lệnh kiểm có mặt trong ảnh; thiếu <code>curl</code> là unhealthy mãi mãi.</li>
<li><code>service_completed_successfully</code> giữ API ở <code>Created</code> khi migration hỏng và <code>up</code> thoát mã 1 — nhưng job chạy lại mỗi lần <code>up</code>, nên migration phải chạy lặp vô hại.</li>
<li>Thứ tự khởi động chỉ xảy ra một lần; ứng dụng vẫn cần thử lại có lùi dần trong suốt phần đời còn lại.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/compose-file/services/#healthcheck" target="_blank" rel="noopener">
  <span class="lc-ico">❤️</span>
  <span class="lc-body"><span class="lc-title">Tra cứu compose — healthcheck</span><span class="lc-sub">Mọi trường, phân biệt <code>CMD</code> với <code>CMD-SHELL</code>, cách tắt một healthcheck thừa kế bằng <code>disable: true</code>, và tương tác với <code>start_interval</code>.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/compose/how-tos/startup-order/" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Điều khiển thứ tự khởi động</span><span class="lc-sub">Quan điểm chính thức, đáng đọc trọn vẹn: compose sắp được thứ tự khởi động, nhưng ứng dụng của bạn vẫn phải xử lý được việc một phụ thuộc tạm thời không sẵn sàng.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: chữa một cuộc đua lúc khởi động</span><span class="lc-sub">Bài chấm điểm: tái hiện cuộc đua ECONNREFUSED, chữa bằng healthcheck với <code>service_healthy</code>, thêm một việc migration bằng <code>service_completed_successfully</code>, và viết healthcheck cho một cái ảnh không có curl.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> thay healthcheck bằng <code>sleep 15</code> trong entrypoint. Nó chạy được trên đúng cái máy bạn chỉnh nó và hỏng ở mọi chỗ khác: quá ngắn trên một runner CI đang tải nặng, nơi cơ sở dữ liệu mất hai mươi giây và API vẫn chết; và phí hoàn toàn ở mọi lần khởi động sau đó khi cơ sở dữ liệu đã sẵn sàng trong một giây, vì bạn vẫn trả đủ mười lăm giây mỗi lần. Healthcheck là đúng ý tưởng đó nhưng làm cho tử tế — nó thăm dò, nên nó trả về ngay khi dịch vụ thật sự sẵn sàng và vẫn tiếp tục chờ khi chưa. Và khác với sleep, nó tiếp tục báo cáo sau khi khởi động xong: <code>docker compose ps</code> hiện <code>(unhealthy)</code> ngay khi một dịch vụ ngừng trả lời, và đó là tín hiệu mà Chương 11 dựng chính sách khởi động lại với giám sát lên trên.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> <code>depends_on</code> trần sắp thứ tự khởi động chứ không sắp mức sẵn sàng — hãy ghép nó với một healthcheck và <code>condition: service_healthy</code>. Luôn đặt <code>start_period</code>, để một dịch vụ khởi động chậm không bị đánh dấu không khoẻ trong lúc nó vẫn đang khởi động một cách chính đáng. Và hãy xác minh phép kiểm chạy được thật bên trong cái ảnh đó: một healthcheck gọi một tệp nhị phân mà ảnh không có sẽ hỏng mãi mãi và chẳng nói cho bạn điều gì.</p>
</div>
`,
    },
    /* ─────────────────────────── 9.4 ─────────────────────────── */
    {
      title: '9.4 — Variables, .env, and profiles|||9.4 — Biến, .env, và profile',
      slug: 'dk-9-4-bien-profile',
      type: 'LESSON',
      description: 'Hai cái .env hoàn toàn khác nhau, cú pháp nội suy đầy đủ với giá trị mặc định và lỗi bắt buộc, thứ tự ưu tiên, profile để bật/tắt dịch vụ, và bí mật trong compose.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Variables, .env, and profiles</h2>
<p class="lead">There are two completely different things called <code>.env</code> in compose, and confusing them is the source of most "the variable is empty" reports. One is read by compose itself to substitute <code>&#36;{VAR}</code> in the YAML; the other is handed to the container as environment. This lesson separates them, then covers profiles — the switch that turns services on and off without editing the file.</p>

<h3>The two .env files</h3>
${slide('dk-09', 19, 'Hai cái .env, hai người đọc khác nhau')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">The project .env</span><span class="lz-lnote">Sits next to the compose file, read <strong>by compose</strong>, and its values are substituted into <code>&#36;{...}</code> anywhere in the YAML — image tags, ports, paths, anything. The container never sees these unless you also pass them through <code>environment:</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">A service's env_file</span><span class="lz-lnote">Named explicitly under a service, read <strong>by the container</strong>. Its values become environment variables inside that container and are <em>not</em> available for <code>&#36;{...}</code> substitution in the YAML.</span></div>
</div>
<pre><code><span class="tok-comment"># .env — used by compose to build the file</span>
TAG=1.4.2
HTTP_PORT=8080
POSTGRES_PASSWORD=secret</code></pre>
<pre><code>services:
  api:
    image: ghcr.io/me/api:&#36;{TAG}          <span class="tok-comment"># from the project .env</span>
    ports: ["&#36;{HTTP_PORT}:3000"]
    env_file: [./api.env]                <span class="tok-comment"># goes INTO the container</span>
    environment:
      DB_PASSWORD: &#36;{POSTGRES_PASSWORD}   <span class="tok-comment"># explicitly forwarded</span></code></pre>
<pre><code>docker compose config | grep -E 'image:|published|DB_PASSWORD'</code></pre>
<div class="out">    image: ghcr.io/me/api:1.4.2
      published: "8080"
      DB_PASSWORD: secret</div>
<div class="callout warn"><strong>A variable used in the YAML but only present in <code>env_file</code> resolves to an empty string.</strong> Compose warns once and carries on, so <code>image: ghcr.io/me/api:</code> becomes an invalid reference and <code>ports: [":3000"]</code> silently publishes on a random port. <code>docker compose config</code> shows you the truth in one command — run it whenever a value is not what you expected.</div>

<h3>Run it step by step: a variable that lives only in env_file</h3>
<p>The warning above is easy to nod along to and hard to believe until you see it. Put the port in <code>api.env</code> — the <em>service's</em> env file — and use it in the YAML:</p>
<pre><code class="language-yaml">name: thu-syn
services:
  api:
    image: nginx:alpine
    env_file: [./api.env]
    ports: ["&#36;{HTTP_PORT}:80"]</code></pre>
<pre><code class="language-bash">cat api.env
docker compose config | grep -E "level|published|HTTP_PORT"
docker compose up -d &amp;&amp; docker compose ps --format '{{.Ports}}'</code></pre>
<div class="out">HTTP_PORT=18096
time="2026-09-24T01:41:20+07:00" level=warning msg="The \\"HTTP_PORT\\" variable is not set. Defaulting to a blank string."
      HTTP_PORT: "18096"
time="2026-09-24T01:41:27+07:00" level=warning msg="The \\"HTTP_PORT\\" variable is not set. Defaulting to a blank string."
0.0.0.0:58721-&gt;80/tcp, [::]:58721-&gt;80/tcp</div>
<p>Three facts in five lines. Compose warns that <code>HTTP_PORT</code> is not set — even though the file is right there — because <code>env_file</code> is not a source for interpolation. The value <em>did</em> reach the container (<code>HTTP_PORT: "18096"</code> sits in its environment). And the port mapping collapsed to <code>":80"</code>, which Docker reads as "any free host port": 58721 this time, something else next time. Nothing failed; the service is simply not where anyone will look for it. The fix is to move <code>HTTP_PORT</code> into the project <code>.env</code> — or to write <code>&#36;{HTTP_PORT:?set HTTP_PORT in .env}</code> so the mistake stops <code>up</code> instead.</p>

<h3>The full interpolation syntax</h3>
${slide('dk-09', 20, 'Sáu dạng nội suy — :- và - khác nhau đúng ở biến rỗng')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>&#36;{VAR}</code></span><span class="v">Substitute, or empty string with a warning if unset. Fine for optional values, dangerous for required ones.</span></div>
  <div class="kv"><span class="k"><code>&#36;{VAR:-default}</code></span><span class="v">Use <code>default</code> if unset <em>or empty</em>. The one you want most of the time — <code>&#36;{TAG:-latest}</code>, <code>&#36;{HTTP_PORT:-8080}</code>.</span></div>
  <div class="kv"><span class="k"><code>&#36;{VAR-default}</code></span><span class="v">Use <code>default</code> only if <em>unset</em>. An explicitly empty variable stays empty. Rarely what you mean; know it exists so you read files correctly.</span></div>
  <div class="kv"><span class="k"><code>&#36;{VAR:?message}</code></span><span class="v"><strong>Fail loudly</strong> with your message if unset or empty. This is the right treatment for a database password: better a clear error at <code>up</code> than a container that starts with an empty secret.</span></div>
  <div class="kv"><span class="k"><code>&#36;{VAR:+alt}</code></span><span class="v">Use <code>alt</code> only if VAR <em>is</em> set. Useful for conditionally adding a flag.</span></div>
  <div class="kv"><span class="k"><code>$$</code></span><span class="v">A literal <code>$</code>. Needed whenever a command inside the file uses shell variables — <code>$$HOSTNAME</code> reaches the container as <code>$HOSTNAME</code>.</span></div>
</div>
<pre><code>docker compose config 2&gt;&amp;1 | tail -2</code></pre>
<div class="out">error: required variable POSTGRES_PASSWORD is missing a value:
set it in .env or export it before running compose</div>

<h3>Run it step by step: every form, with its real result</h3>
<p>The difference between <code>:-</code> and <code>-</code> only shows up when a variable is set <em>but empty</em>, which is exactly the case people forget. Test every form at once:</p>
<pre><code class="language-yaml">services:
  api:
    image: alpine
    environment:
      A: &#36;{EMPTY:-mac-dinh}
      B: &#36;{EMPTY-mac-dinh}
      C: &#36;{UNSET-mac-dinh}
      D: &#36;{SET:+--verbose}
      E: &#36;{UNSET:+--verbose}
    command: ["sh", "-c", "echo host=$$HOSTNAME"]</code></pre>
<pre><code class="language-bash">EMPTY= SET=1 docker compose config | sed -n '/command/,/image/p'
docker compose run --rm api</code></pre>
<div class="out">    command:
      - sh
      - -c
      - echo host=$$HOSTNAME
    environment:
      A: mac-dinh
      B: ""
      C: mac-dinh
      D: --verbose
      E: ""
    image: alpine
host=55a5ac83d5db</div>
<table>
<tr><th>Line</th><th>Result</th><th>Why</th></tr>
<tr><td><code>A: &#36;{EMPTY:-mac-dinh}</code></td><td><code>mac-dinh</code></td><td><code>:-</code> treats "empty" like "unset".</td></tr>
<tr><td><code>B: &#36;{EMPTY-mac-dinh}</code></td><td>empty</td><td><code>-</code> only replaces an <em>unset</em> variable; <code>EMPTY=</code> is set.</td></tr>
<tr><td><code>C: &#36;{UNSET-mac-dinh}</code></td><td><code>mac-dinh</code></td><td>Truly unset, so both forms give the default.</td></tr>
<tr><td><code>D</code> / <code>E</code> with <code>:+</code></td><td><code>--verbose</code> / empty</td><td>The alternative value appears only when the variable has a value.</td></tr>
<tr><td><code>$$HOSTNAME</code></td><td><code>host=55a5ac83d5db</code></td><td><code>config</code> still shows <code>$$</code>; the container's shell received <code>$HOSTNAME</code> and expanded it to its own ID.</td></tr>
</table>
<p>And the required form, with the exact wording Compose v5.5.1 prints (older versions phrased it as the shorter <code>error: required variable …</code> shown above):</p>
<pre><code class="language-bash">docker compose config; echo "exit=$?"     <span class="tok-comment"># POSTGRES_PASSWORD: &#36;{DB_PASS:?dat DB_PASS trong .env truoc da}</span></code></pre>
<div class="out">error while interpolating services.db.environment.POSTGRES_PASSWORD: required variable DB_PASS is missing a value: dat DB_PASS trong .env truoc da
exit=1</div>
<p><code>DB_PASS=</code> (set but empty) gives the same error, because <code>:?</code> — like <code>:-</code> — counts empty as missing.</p>

<h3>Precedence, from strongest to weakest</h3>
${slide('dk-09', 21, 'Nội suy: shell > --env-file > .env > mặc định trong YAML')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Shell environment</span><span class="lz-t">TAG=1.5.0 docker compose up -d</span><span class="lz-d">Beats everything. This is how CI passes a commit SHA as the image tag without touching any file, and how you override one value for one command.</span></div>
  <div class="lz-step"><span class="lz-k">2 · --env-file on the CLI</span><span class="lz-t">docker compose --env-file .env.prod up -d</span><span class="lz-d">Replaces the default <code>.env</code> entirely — it is not merged with it. The clean way to keep <code>.env.dev</code> and <code>.env.prod</code> side by side.</span></div>
  <div class="lz-step"><span class="lz-k">3 · The project .env</span><span class="lz-t">the file next to compose.yaml</span><span class="lz-d">The default source. Commit a <code>.env.example</code> with every key and no real values; never commit <code>.env</code> itself.</span></div>
  <div class="lz-step"><span class="lz-k">4 · The default in the YAML</span><span class="lz-t">&#36;{TAG:-latest}</span><span class="lz-d">Last resort, and where sensible fallbacks live so a fresh clone runs with no setup at all.</span></div>
</div>
<pre><code><span class="tok-comment"># Prove the order</span>
echo 'TAG=1.4.2' &gt; .env
docker compose config | grep 'image: ghcr'
TAG=1.5.0-rc1 docker compose config | grep 'image: ghcr'</code></pre>
<div class="out">    image: ghcr.io/me/api:1.4.2
    image: ghcr.io/me/api:1.5.0-rc1</div>

<h3>Run it step by step: prove every layer, then the five layers inside the container</h3>
<p>The "prove the order" block above checks two layers. Here are all four for interpolation, on one file whose only line of interest is <code>image: dk09-api:&#36;{TAG:-latest}</code> plus <code>GREETING: &#36;{GREETING:-xin chao tu YAML}</code>:</p>
<pre><code class="language-bash">docker compose config | grep -E "image:|GREETING"                          <span class="tok-comment"># 4. no .env yet</span>
printf 'TAG=1.4.2\\nGREETING=xin chao tu .env\\n' &gt; .env
docker compose config | grep -E "image:|GREETING"                          <span class="tok-comment"># 3. .env</span>
printf 'TAG=2.0.0\\n' &gt; .env.prod
docker compose --env-file .env.prod config | grep -E "image:|GREETING"     <span class="tok-comment"># 2. --env-file</span>
TAG=9.9.9 docker compose --env-file .env.prod config | grep -E "image:|GREETING"   <span class="tok-comment"># 1. shell</span></code></pre>
<div class="out">      GREETING: xin chao tu YAML
    image: dk09-api:latest
      GREETING: xin chao tu .env
    image: dk09-api:1.4.2
      GREETING: xin chao tu YAML
    image: dk09-api:2.0.0
      GREETING: xin chao tu YAML
    image: dk09-api:9.9.9</div>
<p>Look at <code>GREETING</code> in the third result: it fell back to the YAML default. <code>.env.prod</code> does not define it, and <code>--env-file</code> <strong>replaced</strong> <code>.env</code> instead of adding to it — the documented behaviour, now seen. If you want both, list both; later files win: <code>docker compose --env-file .env --env-file .env.prod config</code> gives <code>GREETING: xin chao tu .env</code> and <code>image: dk09-api:2.0.0</code>.</p>
<p>That order is for <em>interpolation</em> — filling in <code>&#36;{…}</code>. What finally lands in the container's environment has its own order, documented as five levels. One variable, <code>LEVEL</code>, set at each level in turn (the image was built with <code>ENV LEVEL=5-anh-ENV</code>; the service runs <code>echo LEVEL=$$LEVEL</code>):</p>
<pre><code class="language-bash">docker compose run --rm a                                  <span class="tok-comment"># image ENV only</span>
<span class="tok-comment"># + env_file: [app.env] containing LEVEL=4-env_file</span>
docker compose run --rm a
<span class="tok-comment"># + environment: { LEVEL: &#36;{LEVEL:-3-environment} }</span>
docker compose run --rm a
LEVEL=2-shell docker compose run --rm a
LEVEL=2-shell docker compose run --rm -e LEVEL=1-run-e a</code></pre>
<div class="out">LEVEL=5-anh-ENV
LEVEL=4-env_file
LEVEL=3-environment
LEVEL=2-shell
LEVEL=1-run-e</div>
<table>
<tr><th>Level (strongest first)</th><th>Where it is set</th></tr>
<tr><td>1</td><td><code>docker compose run -e</code> on the command line</td></tr>
<tr><td>2</td><td><code>environment:</code> (or <code>env_file</code>) whose value is interpolated from the shell or a <code>.env</code></td></tr>
<tr><td>3</td><td><code>environment:</code> with a literal value</td></tr>
<tr><td>4</td><td><code>env_file:</code></td></tr>
<tr><td>5</td><td><code>ENV</code> in the image's Dockerfile</td></tr>
</table>
<div class="callout"><strong>The practical rule.</strong> Put defaults in the image (<code>ENV</code>), per-service settings in <code>environment</code> or <code>env_file</code>, anything that differs per machine as <code>&#36;{VAR}</code> fed from <code>.env</code>, and one-off experiments on the command line. When a value surprises you, <code>docker compose config</code> answers levels 2–4 and <code>docker compose exec api env</code> answers what the process really sees.</div>

<h3>Profiles: services that are off unless asked for</h3>
${slide('dk-09', 23, 'Profile: tắt cho tới khi được gọi — down cũng phải gọi nó')}
<pre><code>services:
  api:   { build: ., ports: ["3000:3000"] }
  db:    { image: postgres:16-alpine }

  adminer:
    image: adminer:latest
    ports: ["8081:8080"]
    profiles: [tools]              <span class="tok-comment"># not started by default</span>

  seed:
    image: ghcr.io/me/api:&#36;{TAG:-latest}
    command: ["npm", "run", "seed"]
    profiles: [seed]
    restart: "no"</code></pre>
<pre><code>docker compose up -d                       <span class="tok-comment"># api + db only</span>
docker compose --profile tools up -d       <span class="tok-comment"># + adminer</span>
docker compose run --rm seed               <span class="tok-comment"># run a profiled service directly</span>
docker compose config --profiles</code></pre>
<div class="out">[+] Running 2/2
 ✔ Container blog-db-1   Started
 ✔ Container blog-api-1  Started
[+] Running 1/1
 ✔ Container blog-adminer-1  Started
seeded 42 posts, 8 users
seed
tools</div>
<div class="kv-grid">
  <div class="kv"><span class="k">One file, several shapes</span><span class="v">Debug tools, a mail catcher, a metrics stack, a seed job — all in the same file, none of them running unless asked for. Better than a second file that drifts out of sync.</span></div>
  <div class="kv"><span class="k">Several profiles per service</span><span class="v"><code>profiles: [debug, ci]</code> starts the service under either. Enable several at once with repeated <code>--profile</code> flags or <code>COMPOSE_PROFILES=tools,debug</code>.</span></div>
  <div class="kv"><span class="k">No profile = always on</span><span class="v">A service with no <code>profiles</code> key runs under every profile. That is the core of your stack; profiles are for the optional extras around it.</span></div>
  <div class="kv"><span class="k"><code>run</code> ignores profiles</span><span class="v"><code>docker compose run --rm seed</code> starts a profiled service without enabling the profile — the natural way to invoke one-off jobs.</span></div>
  <div class="kv"><span class="k">Dependencies must be reachable</span><span class="v">A non-profiled service that <code>depends_on</code> a profiled one fails unless the profile is on, or the dependency is marked <code>required: false</code>.</span></div>
</div>

<h3>Run it step by step: the profile trap in down</h3>
<p>Profiles make <code>up</code> easy and <code>down</code> subtle: a command without <code>--profile</code> only sees the services that are active without it. Measured with <code>db</code> (no profile), <code>adminer</code> (<code>tools</code>) and <code>seed</code> (<code>seed</code>):</p>
<pre><code class="language-bash">docker compose config --services           <span class="tok-comment"># no profile enabled</span>
docker compose --profile tools up -d
docker compose down                        <span class="tok-comment"># forgot --profile</span>
docker ps --filter name=dk09-prof --format '{{.Names}} {{.Status}}'</code></pre>
<div class="out">db
[+] up 20/20
 ✔ Image adminer:latest          Pulled                                    11.8s
 ✔ Container dk09-prof-db-1      Running                                    0.0s
 ✔ Container dk09-prof-adminer-1 Started                                    0.3s
[+] down 2/2
 ✔ Container dk09-prof-db-1  Removed                                        0.1s
 ! Network dk09-prof_default Resource is still in use                       0.0s
dk09-prof-adminer-1 Up 7 seconds</div>
<p>(<code>up 20/20</code> counts the image layers being pulled as well as the containers.) The core service went away, the adminer container kept running, and the network could not be removed because adminer still sits on it. The cure is to name the profiles when tearing down — all of them at once with <code>*</code>:</p>
<pre><code class="language-bash">docker compose --profile "*" down -v</code></pre>
<div class="out">[+] down 3/3
 ✔ Container dk09-prof-adminer-1 Removed                                    0.1s
 ✔ Volume dk09-prof_pgdata       Removed                                    0.0s
 ✔ Network dk09-prof_default     Removed                                    0.1s</div>
<p>And the dependency rule from the list above, measured: a service without a profile that <code>depends_on</code> a service that is only in the <code>tools</code> profile makes the whole project invalid — <code>service "api" depends on undefined service "mail": invalid compose project</code> — until you write <code>mail: { condition: service_started, required: false }</code>, after which <code>up</code> starts api alone.</p>

<h3>Secrets: what compose can and cannot do</h3>
${slide('dk-09', 24, 'secrets: bí mật là file, không lộ ra docker inspect')}
<pre><code>services:
  api:
    secrets: [jwt_key]                     <span class="tok-comment"># appears at /run/secrets/jwt_key</span>
    environment:
      JWT_KEY_FILE: /run/secrets/jwt_key   <span class="tok-comment"># pass the PATH, not the value</span>
secrets:
  jwt_key:
    file: /opt/app/jwt.key                 <span class="tok-comment"># mode 600 on the host</span></code></pre>
<pre><code><span class="tok-comment"># corrected: the original put "docker compose config" INSIDE the container, where there is no docker at all</span>
docker compose exec api ls -l /run/secrets/
docker inspect dk09-sec-api-1 -f '{{range .Config.Env}}{{println .}}{{end}}' | grep JWT
docker inspect dk09-sec-api-1 -f '{{range .Mounts}}{{.Type}} {{.Destination}} RW={{.RW}}{{end}}'
docker compose config | grep -c "\$(cat jwt.key)"</code></pre>
<div class="out">total 4
-rw-------    1 root     root            65 Sep 23 18:42 jwt_key
JWT_KEY_FILE=/run/secrets/jwt_key
JWT_KEY_LO=dan-thang-vao-env
bind /run/secrets/jwt_key RW=false
0</div>
<p>Read it line by line (Compose v5.5.1 on the course Mac, with a deliberately leaky <code>JWT_KEY_LO</code> environment variable added for comparison): the secret is a read-only bind mount (<code>RW=false</code>) that keeps the host file's mode — 600 here, hence <code>-rw-------</code>; <code>docker inspect</code> shows the <em>path</em> but never the key, while the variable passed through <code>environment</code> is printed in clear text for anyone who can run <code>inspect</code>; and <code>config</code> contains the key's value zero times.</p>
<p>The value is a file inside the container rather than an environment variable, so it does not appear in <code>docker inspect</code>, in <code>docker compose config</code>, or in a process listing (Lesson 7.4). On a single host, compose secrets are bind-mounted files — real protection against the <code>inspect</code> leak, not against someone with root on the host. That is usually the threat you are actually defending against.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate committed the database password straight into <code>compose.yaml</code>, and the CI job needs to deploy a different image tag from the one on developers' laptops. Move the secret out, make a missing password fail loudly, and prove which value wins where.</p><ol>
<li>In <code>~/thu-docker/thu-bien</code>, write <code>compose.yaml</code> (<code>name: thu-bien</code>) with one service <code>api</code>: <code>image: alpine:&#36;{TAG:-3.20}</code>, <code>command: ["sh", "-c", "echo pass=$$DB_PASS mode=$$MODE"]</code>, and <code>environment: { DB_PASS: "&#36;{DB_PASS:?dat DB_PASS trong .env}", MODE: "&#36;{MODE:-dev}" }</code> (quoted: the values contain a colon).</li>
<li>Run <code>docker compose config</code> with no <code>.env</code> and confirm it refuses with your message and exit code 1.</li>
<li>Create <code>.env</code> with <code>DB_PASS=bimat</code> and <code>TAG=3.20</code>, and <code>.env.ci</code> with <code>DB_PASS=ci-pass</code> and <code>MODE=ci</code>. Run <code>docker compose run --rm api</code>, then <code>docker compose --env-file .env.ci run --rm api</code>, then <code>MODE=shell docker compose --env-file .env.ci run --rm api</code>.</li>
<li>Add <code>.env</code> and <code>.env.ci</code> to <code>.gitignore</code> and write a <code>.env.example</code> containing only the key names.</li>
<li>Clean up: <code>docker compose down</code>.</li></ol>
<p><strong>Done when:</strong> step 2 prints your message and <code>exit=1</code>; step 3 prints <code>pass=bimat mode=dev</code>, then <code>pass=ci-pass mode=ci</code>, then <code>pass=ci-pass mode=shell</code> — and you can explain each line with the precedence table.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Interpolation</span><span class="v">Compose replacing <code>&#36;{VAR}</code> in the YAML with a value, before creating anything.</span></div>
  <div class="kv"><span class="k">Project <code>.env</code></span><span class="v">The file next to <code>compose.yaml</code> that feeds interpolation. Not seen by containers unless forwarded.</span></div>
  <div class="kv"><span class="k"><code>env_file</code></span><span class="v">A per-service list of files whose variables go INTO that container. Not usable in <code>&#36;{…}</code>.</span></div>
  <div class="kv"><span class="k"><code>--env-file</code></span><span class="v">CLI flag that replaces the project <code>.env</code>; can be repeated, later files win.</span></div>
  <div class="kv"><span class="k">Profile</span><span class="v">A label on a service that keeps it off unless <code>--profile</code> or <code>COMPOSE_PROFILES</code> enables it.</span></div>
  <div class="kv"><span class="k">Secret</span><span class="v">A file mounted read-only at <code>/run/secrets/&lt;name&gt;</code>; the app reads the file, so the value never appears in <code>inspect</code>.</span></div>
  <div class="kv"><span class="k"><code>$$</code></span><span class="v">A literal dollar sign, so the container's shell — not Compose — expands the variable.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The project <code>.env</code> feeds <code>&#36;{…}</code> in the YAML; <code>env_file</code> feeds the container. A variable only in <code>env_file</code> is empty in the YAML — measured: a random host port.</li>
<li><code>:-</code> and <code>:?</code> treat empty as missing; <code>-</code> and <code>?</code> only react to unset. Use <code>&#36;{VAR:?message}</code> for anything required.</li>
<li>Interpolation order: shell &gt; <code>--env-file</code> (which replaces <code>.env</code>) &gt; <code>.env</code> &gt; the default in the YAML.</li>
<li>Inside the container: <code>run -e</code> &gt; interpolated <code>environment</code> &gt; literal <code>environment</code> &gt; <code>env_file</code> &gt; image <code>ENV</code>.</li>
<li>Profiles keep optional services off; tear down with <code>--profile "*" down</code>, or they keep running.</li>
<li>Compose secrets are read-only files: the path shows in <code>inspect</code>, the value does not.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/" target="_blank" rel="noopener">
  <span class="lc-ico">🔤</span>
  <span class="lc-body"><span class="lc-title">Compose — variable interpolation</span><span class="lc-sub">Every form of <code>&#36;{...}</code>, the precedence table, and the difference between the project <code>.env</code> and a service's <code>env_file</code> stated explicitly.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/compose/how-tos/profiles/" target="_blank" rel="noopener">
  <span class="lc-ico">🎚️</span>
  <span class="lc-body"><span class="lc-title">Compose — profiles</span><span class="lc-sub">How profiles interact with <code>depends_on</code>, <code>run</code> and <code>COMPOSE_PROFILES</code>, with worked examples for dev tooling and one-off jobs.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: variables and profiles</span><span class="lc-sub">Graded exercises: explain why a variable from <code>env_file</code> is empty in the YAML, make a missing password fail loudly, and put a debug tool behind a profile without breaking the default <code>up</code>.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> committing <code>.env</code>. It ends up in the repository, in every clone, in every fork, and in the Git history where deleting the file later does not remove it (Chapter 13 of the Git course covers extracting a leaked key from history — it is not a five-minute job). Commit <code>.env.example</code> with every key present and every value blank or obviously fake, add <code>.env</code> to <code>.gitignore</code> on the first commit of the project, and keep production values on the server only. This project does exactly that: production runtime environment lives in <code>/opt/cuonghoangdev/.env</code>, which the deploy script loads and rsync excludes, so values there survive every deploy and never travel through Git. If you do leak one, rotating the credential at the provider is the fix — removing the file is not.</div>
<p class="note-ct"><strong>Three things to remember.</strong> The project <code>.env</code> feeds <code>&#36;{...}</code> substitution in the YAML; a service's <code>env_file</code> feeds the container — they are different files with different audiences. Use <code>&#36;{VAR:?message}</code> for anything required, so a missing password is a clear error at <code>up</code> rather than a container running with an empty secret. And profiles let one file describe dev tools, seed jobs and the core stack at once, with only the core running by default.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Biến, .env, và profile</h2>
<p class="lead">Có hai thứ hoàn toàn khác nhau cùng tên <code>.env</code> trong compose, và lẫn lộn hai cái đó là nguồn gốc của phần lớn những báo cáo "biến bị rỗng". Một cái do CHÍNH compose đọc để thay <code>&#36;{VAR}</code> trong YAML; cái kia được trao cho container làm biến môi trường. Bài này tách bạch hai thứ đó, rồi nói tới profile — cái công tắc bật tắt dịch vụ mà không phải sửa file.</p>

<h3>Hai file .env</h3>
${slide('dk-09', 19, 'Hai cái .env, hai người đọc khác nhau')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">File .env của dự án</span><span class="lz-lnote">Nằm cạnh file compose, do <strong>compose</strong> đọc, và giá trị của nó được thay vào <code>&#36;{...}</code> ở bất cứ đâu trong YAML — nhãn ảnh, cổng, đường dẫn, mọi thứ. Container KHÔNG bao giờ thấy chúng trừ khi bạn cũng chuyển tiếp qua <code>environment:</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">env_file của một dịch vụ</span><span class="lz-lnote">Được nêu tên tường minh dưới một dịch vụ, do <strong>container</strong> đọc. Giá trị của nó thành biến môi trường bên trong container đó và <em>không</em> dùng được để thay <code>&#36;{...}</code> trong YAML.</span></div>
</div>
<pre><code><span class="tok-comment"># .env — compose dùng nó để dựng ra cái file</span>
TAG=1.4.2
HTTP_PORT=8080
POSTGRES_PASSWORD=secret</code></pre>
<pre><code>services:
  api:
    image: ghcr.io/me/api:&#36;{TAG}          <span class="tok-comment"># lấy từ .env của dự án</span>
    ports: ["&#36;{HTTP_PORT}:3000"]
    env_file: [./api.env]                <span class="tok-comment"># đi VÀO TRONG container</span>
    environment:
      DB_PASSWORD: &#36;{POSTGRES_PASSWORD}   <span class="tok-comment"># chuyển tiếp tường minh</span></code></pre>
<pre><code>docker compose config | grep -E 'image:|published|DB_PASSWORD'</code></pre>
<div class="out">    image: ghcr.io/me/api:1.4.2
      published: "8080"
      DB_PASSWORD: secret</div>
<div class="callout warn"><strong>Một biến dùng trong YAML nhưng chỉ có mặt trong <code>env_file</code> sẽ ra chuỗi rỗng.</strong> Compose cảnh báo một lần rồi đi tiếp, nên <code>image: ghcr.io/me/api:</code> trở thành một tham chiếu không hợp lệ và <code>ports: [":3000"]</code> lặng lẽ công bố ở một cổng ngẫu nhiên. <code>docker compose config</code> cho bạn thấy sự thật trong một câu lệnh — hãy chạy nó mỗi khi một giá trị không đúng như bạn nghĩ.</div>

<h3>Chạy thử từng bước: một biến chỉ sống trong env_file</h3>
<p>Lời cảnh báo ở trên dễ gật gù cho qua mà khó tin cho tới khi tận mắt thấy. Đặt cổng trong <code>api.env</code> — file env CỦA DỊCH VỤ — rồi dùng nó trong YAML:</p>
<pre><code class="language-yaml">name: thu-syn
services:
  api:
    image: nginx:alpine
    env_file: [./api.env]
    ports: ["&#36;{HTTP_PORT}:80"]</code></pre>
<pre><code class="language-bash">cat api.env
docker compose config | grep -E "level|published|HTTP_PORT"
docker compose up -d &amp;&amp; docker compose ps --format '{{.Ports}}'</code></pre>
<div class="out">HTTP_PORT=18096
time="2026-09-24T01:41:20+07:00" level=warning msg="The \\"HTTP_PORT\\" variable is not set. Defaulting to a blank string."
      HTTP_PORT: "18096"
time="2026-09-24T01:41:27+07:00" level=warning msg="The \\"HTTP_PORT\\" variable is not set. Defaulting to a blank string."
0.0.0.0:58721-&gt;80/tcp, [::]:58721-&gt;80/tcp</div>
<p>Ba sự thật trong năm dòng. Compose cảnh báo <code>HTTP_PORT</code> chưa được đặt — dù file nằm ngay đó — vì <code>env_file</code> không phải nguồn cho phép nội suy. Giá trị VẪN tới được container (<code>HTTP_PORT: "18096"</code> nằm trong môi trường của nó). Và ánh xạ cổng co lại thành <code>":80"</code>, mà Docker hiểu là "cổng trống nào cũng được": lần này là 58721, lần sau là số khác. Không có gì báo lỗi; dịch vụ chỉ đơn giản là không nằm ở chỗ ai cũng sẽ tìm. Cách chữa là dời <code>HTTP_PORT</code> sang file <code>.env</code> của dự án — hoặc viết <code>&#36;{HTTP_PORT:?đặt HTTP_PORT trong .env}</code> để sai lầm này chặn luôn lệnh <code>up</code>.</p>

<h3>Toàn bộ cú pháp nội suy</h3>
${slide('dk-09', 20, 'Sáu dạng nội suy — :- và - khác nhau đúng ở biến rỗng')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>&#36;{VAR}</code></span><span class="v">Thay vào, hoặc ra chuỗi rỗng kèm một cảnh báo nếu chưa đặt. Ổn với giá trị tuỳ chọn, nguy hiểm với giá trị bắt buộc.</span></div>
  <div class="kv"><span class="k"><code>&#36;{VAR:-mặcđịnh}</code></span><span class="v">Dùng <code>mặcđịnh</code> nếu chưa đặt <em>hoặc rỗng</em>. Đây là dạng bạn cần trong phần lớn trường hợp — <code>&#36;{TAG:-latest}</code>, <code>&#36;{HTTP_PORT:-8080}</code>.</span></div>
  <div class="kv"><span class="k"><code>&#36;{VAR-mặcđịnh}</code></span><span class="v">Chỉ dùng <code>mặcđịnh</code> nếu <em>chưa đặt</em>. Một biến được đặt rỗng một cách tường minh thì vẫn rỗng. Hiếm khi là ý bạn; biết nó tồn tại để đọc file cho đúng.</span></div>
  <div class="kv"><span class="k"><code>&#36;{VAR:?thông báo}</code></span><span class="v"><strong>Chết to tiếng</strong> kèm thông báo của bạn nếu chưa đặt hoặc rỗng. Đây là cách đối xử đúng với mật khẩu cơ sở dữ liệu: một lỗi rõ ràng lúc <code>up</code> tốt hơn một container khởi động với một bí mật rỗng.</span></div>
  <div class="kv"><span class="k"><code>&#36;{VAR:+thaythế}</code></span><span class="v">Chỉ dùng <code>thaythế</code> nếu VAR ĐÃ được đặt. Hữu ích khi cần thêm một cái cờ có điều kiện.</span></div>
  <div class="kv"><span class="k"><code>$$</code></span><span class="v">Một dấu <code>$</code> theo nghĩa đen. Cần dùng mỗi khi một câu lệnh trong file dùng biến của shell — <code>$$HOSTNAME</code> tới container thành <code>$HOSTNAME</code>.</span></div>
</div>
<pre><code>docker compose config 2&gt;&amp;1 | tail -2</code></pre>
<div class="out">error: required variable POSTGRES_PASSWORD is missing a value:
set it in .env or export it before running compose</div>

<h3>Chạy thử từng bước: mọi dạng, kèm kết quả thật</h3>
<p>Khác biệt giữa <code>:-</code> và <code>-</code> chỉ lộ ra khi một biến ĐÃ đặt <em>nhưng rỗng</em> — đúng cái trường hợp người ta hay quên. Thử mọi dạng cùng lúc:</p>
<pre><code class="language-yaml">services:
  api:
    image: alpine
    environment:
      A: &#36;{EMPTY:-mac-dinh}
      B: &#36;{EMPTY-mac-dinh}
      C: &#36;{UNSET-mac-dinh}
      D: &#36;{SET:+--verbose}
      E: &#36;{UNSET:+--verbose}
    command: ["sh", "-c", "echo host=$$HOSTNAME"]</code></pre>
<pre><code class="language-bash">EMPTY= SET=1 docker compose config | sed -n '/command/,/image/p'
docker compose run --rm api</code></pre>
<div class="out">    command:
      - sh
      - -c
      - echo host=$$HOSTNAME
    environment:
      A: mac-dinh
      B: ""
      C: mac-dinh
      D: --verbose
      E: ""
    image: alpine
host=55a5ac83d5db</div>
<table>
<tr><th>Dòng</th><th>Kết quả</th><th>Vì sao</th></tr>
<tr><td><code>A: &#36;{EMPTY:-mac-dinh}</code></td><td><code>mac-dinh</code></td><td><code>:-</code> coi "rỗng" như "chưa đặt".</td></tr>
<tr><td><code>B: &#36;{EMPTY-mac-dinh}</code></td><td>rỗng</td><td><code>-</code> chỉ thay biến <em>chưa đặt</em>; <code>EMPTY=</code> là đã đặt.</td></tr>
<tr><td><code>C: &#36;{UNSET-mac-dinh}</code></td><td><code>mac-dinh</code></td><td>Thật sự chưa đặt, nên cả hai dạng đều ra mặc định.</td></tr>
<tr><td><code>D</code> / <code>E</code> với <code>:+</code></td><td><code>--verbose</code> / rỗng</td><td>Giá trị thay thế chỉ xuất hiện khi biến có giá trị.</td></tr>
<tr><td><code>$$HOSTNAME</code></td><td><code>host=55a5ac83d5db</code></td><td><code>config</code> vẫn in <code>$$</code>; shell trong container nhận <code>$HOSTNAME</code> và tự thay bằng ID của chính nó.</td></tr>
</table>
<p>Và dạng bắt buộc, với đúng câu chữ Compose v5.5.1 in ra (bản cũ hơn viết ngắn kiểu <code>error: required variable …</code> như ở trên):</p>
<pre><code class="language-bash">docker compose config; echo "exit=$?"     <span class="tok-comment"># POSTGRES_PASSWORD: &#36;{DB_PASS:?dat DB_PASS trong .env truoc da}</span></code></pre>
<div class="out">error while interpolating services.db.environment.POSTGRES_PASSWORD: required variable DB_PASS is missing a value: dat DB_PASS trong .env truoc da
exit=1</div>
<p><code>DB_PASS=</code> (đặt nhưng rỗng) cũng ra đúng lỗi đó, vì <code>:?</code> — giống <code>:-</code> — tính rỗng là thiếu.</p>

<h3>Thứ tự ưu tiên, từ mạnh nhất xuống yếu nhất</h3>
${slide('dk-09', 21, 'Nội suy: shell > --env-file > .env > mặc định trong YAML')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Môi trường của shell</span><span class="lz-t">TAG=1.5.0 docker compose up -d</span><span class="lz-d">Thắng tất cả. Đây là cách CI truyền mã SHA của commit làm nhãn ảnh mà không đụng vào file nào, và là cách bạn ghi đè một giá trị cho đúng một câu lệnh.</span></div>
  <div class="lz-step"><span class="lz-k">2 · --env-file trên dòng lệnh</span><span class="lz-t">docker compose --env-file .env.prod up -d</span><span class="lz-d">THAY THẾ hẳn file <code>.env</code> mặc định — nó không hợp nhất với file đó. Cách sạch sẽ để giữ <code>.env.dev</code> và <code>.env.prod</code> cạnh nhau.</span></div>
  <div class="lz-step"><span class="lz-k">3 · File .env của dự án</span><span class="lz-t">cái file nằm cạnh compose.yaml</span><span class="lz-d">Nguồn mặc định. Hãy commit một file <code>.env.example</code> có đủ mọi khoá và không có giá trị thật; đừng bao giờ commit chính <code>.env</code>.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Giá trị mặc định trong YAML</span><span class="lz-t">&#36;{TAG:-latest}</span><span class="lz-d">Chỗ cuối cùng, và là nơi những giá trị dự phòng hợp lý nằm để một bản clone mới tinh chạy được mà không cần thiết lập gì.</span></div>
</div>
<pre><code><span class="tok-comment"># Chứng minh thứ tự</span>
echo 'TAG=1.4.2' &gt; .env
docker compose config | grep 'image: ghcr'
TAG=1.5.0-rc1 docker compose config | grep 'image: ghcr'</code></pre>
<div class="out">    image: ghcr.io/me/api:1.4.2
    image: ghcr.io/me/api:1.5.0-rc1</div>

<h3>Chạy thử từng bước: chứng minh từng tầng, rồi năm tầng bên trong container</h3>
<p>Khối "chứng minh thứ tự" ở trên mới kiểm hai tầng. Đây là đủ bốn tầng của phép nội suy, trên một file mà dòng đáng chú ý duy nhất là <code>image: dk09-api:&#36;{TAG:-latest}</code> cộng <code>GREETING: &#36;{GREETING:-xin chao tu YAML}</code>:</p>
<pre><code class="language-bash">docker compose config | grep -E "image:|GREETING"                          <span class="tok-comment"># 4. chưa có .env</span>
printf 'TAG=1.4.2\\nGREETING=xin chao tu .env\\n' &gt; .env
docker compose config | grep -E "image:|GREETING"                          <span class="tok-comment"># 3. .env</span>
printf 'TAG=2.0.0\\n' &gt; .env.prod
docker compose --env-file .env.prod config | grep -E "image:|GREETING"     <span class="tok-comment"># 2. --env-file</span>
TAG=9.9.9 docker compose --env-file .env.prod config | grep -E "image:|GREETING"   <span class="tok-comment"># 1. shell</span></code></pre>
<div class="out">      GREETING: xin chao tu YAML
    image: dk09-api:latest
      GREETING: xin chao tu .env
    image: dk09-api:1.4.2
      GREETING: xin chao tu YAML
    image: dk09-api:2.0.0
      GREETING: xin chao tu YAML
    image: dk09-api:9.9.9</div>
<p>Nhìn <code>GREETING</code> ở kết quả thứ ba: nó rơi về giá trị mặc định trong YAML. <code>.env.prod</code> không khai nó, và <code>--env-file</code> đã <strong>THAY THẾ</strong> <code>.env</code> chứ không cộng thêm — đúng như tài liệu nói, giờ thì thấy tận mắt. Muốn cả hai thì liệt kê cả hai; file sau thắng: <code>docker compose --env-file .env --env-file .env.prod config</code> cho <code>GREETING: xin chao tu .env</code> và <code>image: dk09-api:2.0.0</code>.</p>
<p>Thứ tự đó là của phép <em>nội suy</em> — điền vào chỗ <code>&#36;{…}</code>. Thứ cuối cùng rơi vào môi trường của container thì có thứ tự riêng, được tài liệu ghi thành năm tầng. Một biến <code>LEVEL</code>, lần lượt đặt ở từng tầng (ảnh được dựng với <code>ENV LEVEL=5-anh-ENV</code>; dịch vụ chạy <code>echo LEVEL=$$LEVEL</code>):</p>
<pre><code class="language-bash">docker compose run --rm a                                  <span class="tok-comment"># chỉ có ENV của ảnh</span>
<span class="tok-comment"># + env_file: [app.env] chứa LEVEL=4-env_file</span>
docker compose run --rm a
<span class="tok-comment"># + environment: { LEVEL: &#36;{LEVEL:-3-environment} }</span>
docker compose run --rm a
LEVEL=2-shell docker compose run --rm a
LEVEL=2-shell docker compose run --rm -e LEVEL=1-run-e a</code></pre>
<div class="out">LEVEL=5-anh-ENV
LEVEL=4-env_file
LEVEL=3-environment
LEVEL=2-shell
LEVEL=1-run-e</div>
<table>
<tr><th>Tầng (mạnh nhất trước)</th><th>Đặt ở đâu</th></tr>
<tr><td>1</td><td><code>docker compose run -e</code> trên dòng lệnh</td></tr>
<tr><td>2</td><td><code>environment:</code> (hoặc <code>env_file</code>) có giá trị nội suy từ shell hoặc một file <code>.env</code></td></tr>
<tr><td>3</td><td><code>environment:</code> ghi giá trị thẳng</td></tr>
<tr><td>4</td><td><code>env_file:</code></td></tr>
<tr><td>5</td><td><code>ENV</code> trong Dockerfile của ảnh</td></tr>
</table>
<div class="callout"><strong>Luật dùng hằng ngày.</strong> Giá trị mặc định để trong ảnh (<code>ENV</code>), cấu hình theo dịch vụ để trong <code>environment</code> hoặc <code>env_file</code>, thứ gì khác nhau giữa các máy thì viết <code>&#36;{VAR}</code> và nạp từ <code>.env</code>, còn thử nghiệm một lần thì gõ trên dòng lệnh. Khi một giá trị làm bạn bất ngờ, <code>docker compose config</code> trả lời tầng 2–4 và <code>docker compose exec api env</code> trả lời tiến trình thật sự thấy gì.</div>

<h3>Profile: những dịch vụ tắt cho tới khi được gọi</h3>
${slide('dk-09', 23, 'Profile: tắt cho tới khi được gọi — down cũng phải gọi nó')}
<pre><code>services:
  api:   { build: ., ports: ["3000:3000"] }
  db:    { image: postgres:16-alpine }

  adminer:
    image: adminer:latest
    ports: ["8081:8080"]
    profiles: [tools]              <span class="tok-comment"># mặc định không khởi động</span>

  seed:
    image: ghcr.io/me/api:&#36;{TAG:-latest}
    command: ["npm", "run", "seed"]
    profiles: [seed]
    restart: "no"</code></pre>
<pre><code>docker compose up -d                       <span class="tok-comment"># chỉ api + db</span>
docker compose --profile tools up -d       <span class="tok-comment"># thêm adminer</span>
docker compose run --rm seed               <span class="tok-comment"># chạy thẳng một dịch vụ có profile</span>
docker compose config --profiles</code></pre>
<div class="out">[+] Running 2/2
 ✔ Container blog-db-1   Started
 ✔ Container blog-api-1  Started
[+] Running 1/1
 ✔ Container blog-adminer-1  Started
seeded 42 posts, 8 users
seed
tools</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Một file, nhiều hình dạng</span><span class="v">Công cụ gỡ lỗi, một bộ bắt email, một stack số liệu, một việc nạp dữ liệu mẫu — đều nằm trong cùng file, không cái nào chạy trừ khi được gọi. Tốt hơn một file thứ hai rồi lệch nhịp dần.</span></div>
  <div class="kv"><span class="k">Nhiều profile cho một dịch vụ</span><span class="v"><code>profiles: [debug, ci]</code> khởi động dịch vụ dưới cả hai. Bật nhiều cái cùng lúc bằng cách lặp cờ <code>--profile</code> hoặc dùng <code>COMPOSE_PROFILES=tools,debug</code>.</span></div>
  <div class="kv"><span class="k">Không có profile = luôn bật</span><span class="v">Một dịch vụ không có khoá <code>profiles</code> sẽ chạy dưới mọi profile. Đó là lõi của stack; profile dành cho những thứ tuỳ chọn xung quanh nó.</span></div>
  <div class="kv"><span class="k"><code>run</code> phớt lờ profile</span><span class="v"><code>docker compose run --rm seed</code> khởi động một dịch vụ có profile mà không cần bật profile — cách tự nhiên để gọi những việc chạy một lần.</span></div>
  <div class="kv"><span class="k">Phụ thuộc phải với tới được</span><span class="v">Một dịch vụ không có profile mà <code>depends_on</code> một dịch vụ có profile sẽ hỏng, trừ khi profile đó đang bật, hoặc phụ thuộc được đánh dấu <code>required: false</code>.</span></div>
</div>

<h3>Chạy thử từng bước: cái bẫy profile trong lệnh down</h3>
<p>Profile làm cho <code>up</code> dễ còn <code>down</code> thì tinh vi: một lệnh không kèm <code>--profile</code> chỉ nhìn thấy những dịch vụ đang bật khi KHÔNG có profile. Đo thật với <code>db</code> (không profile), <code>adminer</code> (<code>tools</code>) và <code>seed</code> (<code>seed</code>):</p>
<pre><code class="language-bash">docker compose config --services           <span class="tok-comment"># chưa bật profile nào</span>
docker compose --profile tools up -d
docker compose down                        <span class="tok-comment"># quên --profile</span>
docker ps --filter name=dk09-prof --format '{{.Names}} {{.Status}}'</code></pre>
<div class="out">db
[+] up 20/20
 ✔ Image adminer:latest          Pulled                                    11.8s
 ✔ Container dk09-prof-db-1      Running                                    0.0s
 ✔ Container dk09-prof-adminer-1 Started                                    0.3s
[+] down 2/2
 ✔ Container dk09-prof-db-1  Removed                                        0.1s
 ! Network dk09-prof_default Resource is still in use                       0.0s
dk09-prof-adminer-1 Up 7 seconds</div>
<p>(<code>up 20/20</code> đếm cả các tầng ảnh đang kéo về lẫn container.) Dịch vụ lõi đã đi, container adminer vẫn chạy, và mạng không xoá được vì adminer còn ngồi trên đó. Cách chữa là gọi tên profile lúc dọn — tất cả cùng lúc bằng <code>*</code>:</p>
<pre><code class="language-bash">docker compose --profile "*" down -v</code></pre>
<div class="out">[+] down 3/3
 ✔ Container dk09-prof-adminer-1 Removed                                    0.1s
 ✔ Volume dk09-prof_pgdata       Removed                                    0.0s
 ✔ Network dk09-prof_default     Removed                                    0.1s</div>
<p>Và luật phụ thuộc trong danh sách ở trên, đo thật: một dịch vụ không có profile mà <code>depends_on</code> một dịch vụ chỉ nằm trong profile <code>tools</code> làm cả dự án không hợp lệ — <code>service "api" depends on undefined service "mail": invalid compose project</code> — cho tới khi bạn viết <code>mail: { condition: service_started, required: false }</code>, lúc đó <code>up</code> khởi động mình api.</p>

<h3>Bí mật: compose làm được gì và không làm được gì</h3>
${slide('dk-09', 24, 'secrets: bí mật là file, không lộ ra docker inspect')}
<pre><code>services:
  api:
    secrets: [jwt_key]                     <span class="tok-comment"># hiện ra ở /run/secrets/jwt_key</span>
    environment:
      JWT_KEY_FILE: /run/secrets/jwt_key   <span class="tok-comment"># truyền ĐƯỜNG DẪN, không truyền giá trị</span>
secrets:
  jwt_key:
    file: /opt/app/jwt.key                 <span class="tok-comment"># quyền 600 trên máy chủ</span></code></pre>
<pre><code><span class="tok-comment"># đã sửa: bản gốc chạy "docker compose config" BÊN TRONG container, nơi làm gì có docker</span>
docker compose exec api ls -l /run/secrets/
docker inspect dk09-sec-api-1 -f '{{range .Config.Env}}{{println .}}{{end}}' | grep JWT
docker inspect dk09-sec-api-1 -f '{{range .Mounts}}{{.Type}} {{.Destination}} RW={{.RW}}{{end}}'
docker compose config | grep -c "\$(cat jwt.key)"</code></pre>
<div class="out">total 4
-rw-------    1 root     root            65 Sep 23 18:42 jwt_key
JWT_KEY_FILE=/run/secrets/jwt_key
JWT_KEY_LO=dan-thang-vao-env
bind /run/secrets/jwt_key RW=false
0</div>
<p>Đọc từng dòng (Compose v5.5.1 trên máy Mac của khoá, có thêm một biến <code>JWT_KEY_LO</code> cố tình để lộ để so sánh): bí mật là một bind mount chỉ-đọc (<code>RW=false</code>) giữ nguyên quyền của file trên máy — ở đây là 600, nên thấy <code>-rw-------</code>; <code>docker inspect</code> cho thấy ĐƯỜNG DẪN chứ không bao giờ cho thấy khoá, còn biến truyền qua <code>environment</code> thì in ra nguyên văn cho bất kỳ ai chạy được <code>inspect</code>; và <code>config</code> chứa giá trị của khoá đúng không lần nào.</p>
<p>Giá trị nằm ở một FILE bên trong container chứ không phải một biến môi trường, nên nó không hiện trong <code>docker inspect</code>, không hiện trong <code>docker compose config</code>, và không hiện trong danh sách tiến trình (Bài 7.4). Trên một máy chủ đơn, secret của compose là những file bind-mount — bảo vệ thật trước cái rò rỉ qua <code>inspect</code>, chứ không bảo vệ trước người có quyền root trên máy chủ. Và đó thường đúng là mối đe doạ bạn đang phòng.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn trong nhóm commit thẳng mật khẩu CSDL vào <code>compose.yaml</code>, còn job CI cần deploy một nhãn ảnh khác với nhãn trên laptop của mọi người. Hãy dời bí mật ra ngoài, làm cho thiếu mật khẩu là chết to tiếng, và chứng minh giá trị nào thắng ở đâu.</p><ol>
<li>Trong <code>~/thu-docker/thu-bien</code>, viết <code>compose.yaml</code> (<code>name: thu-bien</code>) có một dịch vụ <code>api</code>: <code>image: alpine:&#36;{TAG:-3.20}</code>, <code>command: ["sh", "-c", "echo pass=$$DB_PASS mode=$$MODE"]</code>, và <code>environment: { DB_PASS: "&#36;{DB_PASS:?dat DB_PASS trong .env}", MODE: "&#36;{MODE:-dev}" }</code> (bọc nháy vì giá trị chứa dấu hai chấm).</li>
<li>Chạy <code>docker compose config</code> khi chưa có <code>.env</code> và xác nhận nó từ chối kèm thông báo của bạn và mã thoát 1.</li>
<li>Tạo <code>.env</code> với <code>DB_PASS=bimat</code> và <code>TAG=3.20</code>, và <code>.env.ci</code> với <code>DB_PASS=ci-pass</code> và <code>MODE=ci</code>. Chạy <code>docker compose run --rm api</code>, rồi <code>docker compose --env-file .env.ci run --rm api</code>, rồi <code>MODE=shell docker compose --env-file .env.ci run --rm api</code>.</li>
<li>Thêm <code>.env</code> và <code>.env.ci</code> vào <code>.gitignore</code> và viết một <code>.env.example</code> chỉ có tên khoá.</li>
<li>Dọn: <code>docker compose down</code>.</li></ol>
<p><strong>Đạt khi:</strong> bước 2 in thông báo của bạn và <code>exit=1</code>; bước 3 in lần lượt <code>pass=bimat mode=dev</code>, <code>pass=ci-pass mode=ci</code>, <code>pass=ci-pass mode=shell</code> — và bạn giải thích được từng dòng bằng bảng thứ tự ưu tiên.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Interpolation (nội suy biến)</span><span class="v">Compose thay <code>&#36;{VAR}</code> trong YAML bằng giá trị, trước khi tạo bất cứ thứ gì.</span></div>
  <div class="kv"><span class="k"><code>.env</code> của dự án</span><span class="v">File nằm cạnh <code>compose.yaml</code>, nuôi phép nội suy. Container không thấy nó trừ khi được chuyển tiếp.</span></div>
  <div class="kv"><span class="k"><code>env_file</code> (file biến của dịch vụ)</span><span class="v">Danh sách file theo từng dịch vụ, biến trong đó đi VÀO container đó. Không dùng được trong <code>&#36;{…}</code>.</span></div>
  <div class="kv"><span class="k"><code>--env-file</code></span><span class="v">Cờ dòng lệnh THAY THẾ <code>.env</code> của dự án; lặp được nhiều lần, file sau thắng.</span></div>
  <div class="kv"><span class="k">Profile (hồ sơ bật/tắt)</span><span class="v">Nhãn trên một dịch vụ giữ nó ở trạng thái tắt cho tới khi <code>--profile</code> hoặc <code>COMPOSE_PROFILES</code> bật nó.</span></div>
  <div class="kv"><span class="k">Secret (bí mật)</span><span class="v">Một file gắn chỉ-đọc ở <code>/run/secrets/&lt;tên&gt;</code>; ứng dụng đọc file nên giá trị không bao giờ hiện trong <code>inspect</code>.</span></div>
  <div class="kv"><span class="k"><code>$$</code></span><span class="v">Một dấu đô-la theo nghĩa đen, để shell trong container — chứ không phải Compose — thay biến.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>.env</code> của dự án nuôi <code>&#36;{…}</code> trong YAML; <code>env_file</code> nuôi container. Biến chỉ có trong <code>env_file</code> thì rỗng trong YAML — đo thật: cổng ngẫu nhiên.</li>
<li><code>:-</code> và <code>:?</code> tính rỗng là thiếu; <code>-</code> và <code>?</code> chỉ phản ứng khi chưa đặt. Dùng <code>&#36;{VAR:?thông báo}</code> cho mọi thứ bắt buộc.</li>
<li>Thứ tự nội suy: shell &gt; <code>--env-file</code> (thay hẳn <code>.env</code>) &gt; <code>.env</code> &gt; mặc định trong YAML.</li>
<li>Bên trong container: <code>run -e</code> &gt; <code>environment</code> có nội suy &gt; <code>environment</code> ghi thẳng &gt; <code>env_file</code> &gt; <code>ENV</code> của ảnh.</li>
<li>Profile giữ dịch vụ tuỳ chọn ở trạng thái tắt; dọn bằng <code>--profile "*" down</code>, không thì chúng vẫn chạy.</li>
<li>Secret của Compose là file chỉ-đọc: đường dẫn hiện trong <code>inspect</code>, giá trị thì không.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/" target="_blank" rel="noopener">
  <span class="lc-ico">🔤</span>
  <span class="lc-body"><span class="lc-title">Compose — nội suy biến</span><span class="lc-sub">Mọi dạng của <code>&#36;{...}</code>, bảng thứ tự ưu tiên, và khác biệt giữa <code>.env</code> của dự án với <code>env_file</code> của một dịch vụ được nói rõ ra.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/compose/how-tos/profiles/" target="_blank" rel="noopener">
  <span class="lc-ico">🎚️</span>
  <span class="lc-body"><span class="lc-title">Compose — profiles</span><span class="lc-sub">Profile tương tác thế nào với <code>depends_on</code>, <code>run</code> và <code>COMPOSE_PROFILES</code>, kèm ví dụ đã làm sẵn cho công cụ phát triển và việc chạy một lần.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: biến và profile</span><span class="lc-sub">Bài chấm điểm: giải thích vì sao một biến từ <code>env_file</code> lại rỗng trong YAML, làm cho một mật khẩu thiếu chết to tiếng, và đặt một công cụ gỡ lỗi sau một profile mà không làm hỏng lệnh <code>up</code> mặc định.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> commit file <code>.env</code>. Nó nằm lại trong kho, trong mọi bản clone, trong mọi bản fork, và trong lịch sử Git nơi việc xoá file về sau KHÔNG gỡ được nó ra (Chương 13 khoá Git nói về việc bóc một cái khoá bị lộ khỏi lịch sử — đó không phải việc năm phút). Hãy commit một file <code>.env.example</code> có đủ mọi khoá và mọi giá trị để trống hoặc giả rõ ràng, thêm <code>.env</code> vào <code>.gitignore</code> ngay ở commit đầu tiên của dự án, và giữ giá trị production chỉ trên máy chủ. Chính dự án này làm đúng như vậy: môi trường chạy của production nằm ở <code>/opt/cuonghoangdev/.env</code>, script deploy nạp nó và rsync loại nó ra, nên giá trị ở đó sống sót qua mọi lần deploy và không bao giờ đi qua Git. Nếu bạn lỡ để lộ một cái, thì cách chữa là XOAY thông tin đăng nhập ở phía nhà cung cấp — xoá file thì không phải.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> File <code>.env</code> của dự án nuôi phép thay <code>&#36;{...}</code> trong YAML; <code>env_file</code> của một dịch vụ nuôi container — hai file khác nhau cho hai đối tượng khác nhau. Hãy dùng <code>&#36;{VAR:?thông báo}</code> cho mọi thứ bắt buộc, để một mật khẩu thiếu là một lỗi rõ ràng lúc <code>up</code> chứ không phải một container chạy với bí mật rỗng. Và profile cho phép một file mô tả cùng lúc công cụ phát triển, việc nạp dữ liệu mẫu và stack lõi, với chỉ phần lõi chạy theo mặc định.</p>
</div>
`,
    },
    /* ─────────────────────────── 9.5 ─────────────────────────── */
    {
      title: '9.5 — Multiple files: dev versus prod|||9.5 — Nhiều file: dev với prod',
      slug: 'dk-9-5-nhieu-file',
      type: 'LESSON',
      description: 'compose.override.yaml tự nạp, -f xếp chồng theo thứ tự, luật hợp nhất (cái gì thay thế cái gì được nối), include và extends, COMPOSE_FILE, và một bố cục dev/prod thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>Multiple files: dev versus prod</h2>
<p class="lead">Development wants source bind-mounted, ports exposed and a debugger attached. Production wants none of that. The wrong answer is two files that slowly drift apart; the right one is a base file plus a small override that says only what differs.</p>

<h3>The automatic override</h3>
${slide('dk-09', 25, 'compose.override.yaml tự nạp — viết -f là tắt nó')}
<pre><code><span class="tok-comment"># compose.yaml — the base, and what production runs</span>
services:
  api:
    image: ghcr.io/me/api:&#36;{TAG:-latest}
    restart: unless-stopped
    environment:
      NODE_ENV: production</code></pre>
<pre><code><span class="tok-comment"># compose.override.yaml — picked up AUTOMATICALLY, dev only</span>
services:
  api:
    build: .
    command: ["npm", "run", "dev"]
    environment:
      NODE_ENV: development
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
      - "127.0.0.1:9229:9229"</code></pre>
<pre><code>docker compose config | grep -E 'NODE_ENV|command|published' </code></pre>
<div class="out">    command: [npm, run, dev]
      NODE_ENV: development
      published: "3000"
      published: "9229"</div>
<div class="callout ok"><strong><code>compose.override.yaml</code> is read automatically when it exists, and merged on top of <code>compose.yaml</code>.</strong> That gives you the ideal split with no flags at all: <code>docker compose up</code> on a developer's machine gets the dev experience, and the server — which does not have the override file, or explicitly passes <code>-f compose.yaml</code> — gets the plain base. Add the override to <code>.gitignore</code> only if it is personal; a shared team override belongs in the repository.</div>

<h3>Run it step by step: watch the override load, and unload</h3>
<p>The course's practice project <code>dk09-multi</code> has exactly the pair above (plus <code>LOG_LEVEL: info</code> and <code>DB_ADDR: db:5432</code> in the base, and the dev ports moved into the course range). Ask Compose what it will run with and without the override:</p>
<pre><code class="language-bash">docker compose config | grep -E "NODE_ENV|LOG_LEVEL|published|restart"
docker compose -f compose.yaml config | grep -E "NODE_ENV|LOG_LEVEL|published|restart"</code></pre>
<div class="out">      LOG_LEVEL: info
      NODE_ENV: development
        published: "18098"
        published: "18099"
    restart: unless-stopped
      LOG_LEVEL: info
      NODE_ENV: production
        published: "18098"
    restart: unless-stopped</div>
<table>
<tr><th>Line</th><th>What it proves</th></tr>
<tr><td><code>NODE_ENV: development</code> vs <code>production</code></td><td>The override was loaded in the first command and not in the second — just because <code>-f</code> appeared.</td></tr>
<tr><td><code>LOG_LEVEL: info</code> in both</td><td><code>environment</code> is a map, merged key by key: the override changed one key and the other survived.</td></tr>
<tr><td>two <code>published</code> lines, then one</td><td>The override <em>added</em> a port to the base's list rather than replacing it.</td></tr>
<tr><td><code>restart: unless-stopped</code> in both</td><td>A key only in the base is inherited untouched.</td></tr>
</table>

<h3>Stacking files explicitly</h3>
<pre><code><span class="tok-comment"># Order matters: later files win</span>
docker compose -f compose.yaml -f compose.prod.yaml up -d
docker compose -f compose.yaml -f compose.ci.yaml run --rm test

<span class="tok-comment"># Or set it once for the shell / the deploy script</span>
export COMPOSE_FILE=compose.yaml:compose.prod.yaml
docker compose up -d</code></pre>
<div class="callout warn"><strong>Passing <code>-f</code> disables the automatic override.</strong> The moment you write <code>-f compose.yaml</code>, <code>compose.override.yaml</code> is no longer loaded — you now list every file you want, explicitly. This is exactly what you want in a deploy script: no chance of a developer's local override reaching the server.</div>

<h3>The merge rules, which are not obvious</h3>
${slide('dk-09', 26, 'Luật hợp nhất: THAY, GỘP theo khoá, hay NỐI thêm')}
${slide('dk-09', 27, '!reset xoá cái thừa kế, !override thay trọn')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Scalars: replaced</span><span class="lz-t">image, command, restart, user, working_dir</span><span class="lz-d">The later file's value wins outright. A <code>command</code> in an override completely replaces the base one; there is no appending.</span></div>
  <div class="lz-step"><span class="lz-k">Maps: merged key by key</span><span class="lz-t">environment, labels, extra_hosts</span><span class="lz-d">Keys present in both take the later value; keys present in only one survive. This is why an override can change <code>NODE_ENV</code> without repeating every other variable.</span></div>
  <div class="lz-step"><span class="lz-k">Sequences: appended</span><span class="lz-t">ports, volumes, dns, expose</span><span class="lz-d">The lists are concatenated, <em>not</em> replaced — with an important refinement measured on Compose v5.5.1 and stated in the merge reference: <code>ports</code>, <code>volumes</code>, <code>secrets</code> and <code>configs</code> are merged by a unique key. An override repeating the exact same <code>"3000:3000"</code> produces ONE mapping (no error); a <em>different</em> host port for the same container port produces TWO; a volume with the same target path replaces the earlier one. See "Run it step by step" below.</span></div>
  <div class="lz-step"><span class="lz-k">Resetting a list</span><span class="lz-t">!reset and !override tags</span><span class="lz-d"><code>ports: !reset []</code> clears an inherited list; <code>!override</code> replaces instead of appending. The escape hatch for when appending is wrong.</span></div>
</div>
<pre><code><span class="tok-comment"># The append rule, demonstrated</span>
docker compose config | grep -A8 '    volumes:'   <span class="tok-comment"># corrected: base + automatic override; with -f compose.prod.yaml the dev mounts would not be loaded at all</span></code></pre>
<div class="out">    volumes:
      - type: bind
        source: …/ch09/multi
        target: /app
        bind: {}
      - type: volume
        target: /app/node_modules
        volume: {}</div>
<pre><code><span class="tok-comment"># compose.prod.yaml — clear the dev mounts instead of adding to them</span>
services:
  api:
    volumes: !reset []
    ports: !override ["127.0.0.1:3000:3000"]</code></pre>

<h3>Run it step by step: test every merge rule in two minutes</h3>
<p>Merge rules are easy to misremember and trivial to test: write a tiny override, run <code>config</code>, read. Each row below is one real run against the same base (<code>command</code> absent, <code>ports: ["18098:3000"]</code>, <code>environment</code> with three keys):</p>
<pre><code class="language-bash">docker compose -f compose.yaml -f c1.yaml -f c2.yaml config | grep -A2 command    <span class="tok-comment"># c1: command a.js · c2: command b.js</span>
docker compose -f compose.yaml -f dup.yaml config | grep published                <span class="tok-comment"># dup: "18098:3000" and "18097:3000"</span>
docker compose -f compose.yaml -f v1.yaml -f v2.yaml config | grep -E "source|target: /data"   <span class="tok-comment"># ./a:/data then ./b:/data</span></code></pre>
<div class="out">    command:
      - node
      - b.js
        published: "18098"
        published: "18097"
        source: …/ch09/multi/b
        target: /data</div>
<table>
<tr><th>Rule</th><th>Measured result</th><th>What it means for you</th></tr>
<tr><td>Scalars and <code>command</code> are replaced</td><td>only <code>b.js</code></td><td>The last file wins outright; nothing is appended to a command.</td></tr>
<tr><td>Ports merge on (ip, target, published, protocol)</td><td>the repeated <code>18098</code> appears once; <code>18097</code> is added</td><td>Repeating a mapping is harmless; changing the host port does NOT remove the old one.</td></tr>
<tr><td>Volumes merge on target</td><td>only <code>./b</code> mounted at <code>/data</code></td><td>A later file can re-point a mount without <code>!override</code>.</td></tr>
</table>
<p>And the two escape hatches, run the same way:</p>
<pre><code class="language-bash">docker compose -f compose.yaml -f compose.prod.yaml config | grep -E "host_ip|published"   <span class="tok-comment"># ports: !override ["127.0.0.1:18098:3000"]</span>
docker compose -f compose.yaml -f r.yaml config | grep -E "published|LOG_LEVEL|NODE_ENV|DB_ADDR"   <span class="tok-comment"># ports: !reset [] · LOG_LEVEL: !reset null</span>
docker compose -f compose.yaml -f o.yaml config | grep -E "LOG_LEVEL|NODE_ENV|DB_ADDR"   <span class="tok-comment"># environment: !override { NODE_ENV: staging }</span></code></pre>
<div class="out">        host_ip: 127.0.0.1
        published: "18098"
      DB_ADDR: db:5432
      NODE_ENV: production
      NODE_ENV: staging</div>
<p><code>!override</code> on <code>ports</code> left exactly one, loopback-only mapping; <code>!reset</code> removed every port and one environment key while the other keys stayed; <code>!override</code> on <code>environment</code> threw away <em>all</em> inherited keys, leaving only <code>NODE_ENV: staging</code> — powerful, and easy to overdo. <code>COMPOSE_FILE</code> behaves exactly like the <code>-f</code> list: <code>COMPOSE_FILE=compose.yaml:compose.prod.yaml docker compose config</code> printed <code>NODE_ENV: production</code> and <code>host_ip: 127.0.0.1</code> (on Windows the separator is <code>;</code>).</p>

<h3>include and extends</h3>
${slide('dk-09', 28, 'include ghép nguyên file, extends thừa kế một dịch vụ')}
<pre><code><span class="tok-comment"># include: pull in a whole other compose file as-is (Compose 2.20+)</span>
include:
  - path: ./monitoring/compose.yaml
    env_file: ./monitoring/.env
services:
  api: { build: . }</code></pre>
<pre><code><span class="tok-comment"># extends: inherit one service definition, from this file or another</span>
services:
  api-base:
    image: ghcr.io/me/api:&#36;{TAG:-latest}
    environment: { LOG_LEVEL: info }
    networks: [private]

  worker:
    extends:
      service: api-base
    command: ["node", "dist/worker.js"]

  scheduler:
    extends:
      file: ./common.yaml
      service: api-base
    command: ["node", "dist/cron.js"]</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>include</code></span><span class="v">Composes whole files. Good for bolting a monitoring or logging stack onto an application stack without copying it. Each included file keeps its own relative paths and <code>.env</code>.</span></div>
  <div class="kv"><span class="k"><code>extends</code></span><span class="v">Inherits one service. Good for three services from one image differing only in <code>command</code> — API, worker, scheduler.</span></div>
  <div class="kv"><span class="k"><code>extends</code> brings dependencies too</span><span class="v">Older Compose versions dropped <code>depends_on</code> and <code>volumes_from</code> when extending. Compose v5.5.1 does not: measured, a <code>worker</code> extending a service with <code>depends_on: [db]</code> gets that dependency — and when extending from another file whose <code>db</code> is not defined here, the project fails with <code>service "worker" depends on undefined service "db"</code>.</span></div>
  <div class="kv"><span class="k">YAML anchors still work</span><span class="v"><code>&amp;base</code> / <code>&lt;&lt;: *base</code> is the plain-YAML alternative, and often simpler within a single file. Note it merges maps only, and cannot cross files.</span></div>
  <div class="kv"><span class="k">Do not build a framework</span><span class="v">Three files is fine. Nine files with two levels of <code>extends</code> and an <code>include</code> means nobody can tell what runs — and <code>docker compose config</code> becomes the only way to know.</span></div>
</div>

<h3>Run it step by step: include and extends, as Compose sees them</h3>
<p>A project <code>dk09-inc</code> includes <code>./monitoring/compose.yaml</code> (one service <code>uptime</code> whose <code>TARGET: &#36;{TARGET}</code> comes from <code>./monitoring/.env</code>) and defines <code>worker</code> and <code>scheduler</code>, both extending <code>api-base</code> from <code>./common.yaml</code>; <code>scheduler</code> overrides <code>LOG_LEVEL</code>:</p>
<pre><code class="language-bash">docker compose config --services
docker compose config | grep -E "^  [a-z]|js|LOG_LEVEL|TARGET|image"</code></pre>
<div class="out">scheduler
uptime
worker
  scheduler:
      - cron.js
      LOG_LEVEL: debug
    image: dk09-multi-api:latest
  uptime:
      TARGET: http://api:3000
    image: alpine
  worker:
      - worker.js
      LOG_LEVEL: info
    image: dk09-multi-api:latest
  default:</div>
<p>(The last line is the project's <code>default</code> network, caught by the <code>^  [a-z]</code> pattern.) Three things are visible: <code>uptime</code> joined the project as if it had been written here; its <code>TARGET</code> was filled from the <em>included</em> file's own <code>.env</code>, not from this project's; and both extended services got the base's image and environment, with <code>scheduler</code>'s own <code>LOG_LEVEL</code> winning — the same map-merge rule as between files. Now the dependency check that corrected this lesson's older claim:</p>
<pre><code class="language-bash"><span class="tok-comment"># common.yaml: api-base has depends_on: [db]; this file defines only worker (extends it)</span>
docker compose -f c2.yaml config</code></pre>
<div class="out">service "worker" depends on undefined service "db": invalid compose project</div>

<h3>A layout that holds up</h3>
${slide('dk-09', 29, 'Nền + dev + prod, và đọc config trước khi deploy')}
<pre><code>blog/
├── compose.yaml              <span class="tok-comment"># base: images, networks, volumes, healthchecks</span>
├── compose.override.yaml     <span class="tok-comment"># dev: build, bind mounts, ports, hot reload</span>
├── compose.prod.yaml         <span class="tok-comment"># prod: restart, limits, loopback ports, log rotation</span>
├── .env.example              <span class="tok-comment"># committed, no real values</span>
└── .env                      <span class="tok-comment"># gitignored, local only</span></code></pre>
<pre><code><span class="tok-comment"># Developer</span>
docker compose up -d                                          <span class="tok-comment"># base + override</span>

<span class="tok-comment"># Server, in the deploy script</span>
docker compose -f compose.yaml -f compose.prod.yaml pull
docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build

<span class="tok-comment"># Verify what the server will actually run, BEFORE deploying</span>
docker compose -f compose.yaml -f compose.prod.yaml config | head -20</code></pre>
<div class="out">name: dk09-multi
services:
  api:
    deploy:
      resources:
        limits:
          cpus: 1.5
          memory: "536870912"
    environment:
      DB_ADDR: db:5432
      LOG_LEVEL: info
      NODE_ENV: production
    image: dk09-multi-api:latest
    logging:
      driver: json-file
      options:
        max-file: "3"
        max-size: 10m
    networks:
      default: null</div>
<p class="note-ct">Real output (the course's practice project <code>dk09-multi</code>, Compose v5.5.1), replacing an earlier hand-written version: <code>config</code> sorts keys alphabetically, prints nested maps in block style, and <code>restart: unless-stopped</code> appears further down, past line 20.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your group deploys the same repository to a small VPS. On laptops you want hot reload and a debugger port; on the server the API must listen only on loopback (nginx sits in front) and must never pick up a teammate's local override. Build that split and prove it with <code>config</code> before anything runs.</p><ol>
<li>In <code>~/thu-docker/thu-multi</code>, write <code>compose.yaml</code> (<code>name: thu-multi</code>) with one service <code>api</code>: <code>image: nginx:alpine</code>, <code>restart: unless-stopped</code>, <code>environment: { NODE_ENV: production, LOG_LEVEL: info }</code>, <code>ports: ["18098:80"]</code>.</li>
<li>Write <code>compose.override.yaml</code> setting <code>NODE_ENV: development</code> and adding <code>"127.0.0.1:18099:80"</code>. Predict the output of <code>docker compose config | grep -E "NODE_ENV|LOG_LEVEL|published"</code>, then run it.</li>
<li>Write <code>compose.prod.yaml</code> that makes the only port <code>"127.0.0.1:18098:80"</code> using <code>!override</code>, and adds <code>deploy.resources.limits.memory: 256M</code>. Check <code>docker compose -f compose.yaml -f compose.prod.yaml config</code>.</li>
<li>Now "change" the port the naive way: in a file <code>bad.yaml</code> put <code>ports: ["18097:80"]</code> without any tag, and check how many ports <code>-f compose.yaml -f bad.yaml config</code> publishes.</li>
<li>Bring up the production combination with <code>docker compose -f compose.yaml -f compose.prod.yaml up -d --wait</code>, <code>curl -s -o /dev/null -w "%{http_code}\\n" localhost:18098</code>, then <code>docker compose -f compose.yaml -f compose.prod.yaml down</code>.</li></ol>
<p><strong>Done when:</strong> step 2 shows <code>development</code> with two published ports; step 3 shows a single <code>host_ip: 127.0.0.1</code> port and <code>memory: "268435456"</code>; step 4 shows two published ports; step 5 prints <code>200</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Base file</span><span class="v"><code>compose.yaml</code>: everything every environment shares — and what production runs.</span></div>
  <div class="kv"><span class="k">Override file</span><span class="v">A file layered on top that states only the differences. <code>compose.override.yaml</code> is loaded automatically.</span></div>
  <div class="kv"><span class="k">Merge</span><span class="v">How Compose combines layered files: scalars replaced, maps merged by key, lists appended (ports/volumes by a unique key).</span></div>
  <div class="kv"><span class="k"><code>!reset</code> / <code>!override</code></span><span class="v">YAML tags in an override file: clear an inherited value / replace it wholesale instead of merging.</span></div>
  <div class="kv"><span class="k"><code>COMPOSE_FILE</code></span><span class="v">Environment variable holding the file list, like repeated <code>-f</code>; separator <code>:</code> (<code>;</code> on Windows).</span></div>
  <div class="kv"><span class="k"><code>include</code></span><span class="v">Pulls a whole compose file (with its own paths and <code>.env</code>) into the project.</span></div>
  <div class="kv"><span class="k"><code>extends</code></span><span class="v">Copies one service's definition into another, which then overrides what differs.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>compose.override.yaml</code> loads automatically; any <code>-f</code> (or <code>COMPOSE_FILE</code>) turns that off — which is what a deploy script wants.</li>
<li>Scalars and <code>command</code> are replaced; maps like <code>environment</code> merge key by key.</li>
<li>Lists append, but <code>ports</code> merge on (ip, target, published, protocol) and <code>volumes</code> on target: a repeated port is harmless, a changed host port leaves the old one open.</li>
<li><code>!override</code> replaces a whole value, <code>!reset</code> clears it — measured on <code>ports</code> and <code>environment</code>.</li>
<li><code>include</code> composes whole files; <code>extends</code> copies one service — including its <code>depends_on</code> in Compose v5.</li>
<li>Run <code>config</code> on the exact file combination the server will use before every deploy.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/compose/how-tos/multiple-compose-files/merge/" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">Compose — merge and override</span><span class="lc-sub">The exact rule for every field type, with the list of which keys append and which replace, plus the <code>!reset</code> and <code>!override</code> tags.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/compose/how-tos/multiple-compose-files/include/" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Compose — include</span><span class="lc-sub">Composing several independent stacks, how relative paths and env files resolve inside an included file, and when <code>include</code> beats <code>-f</code> stacking.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: split dev from prod</span><span class="lc-sub">Graded exercises: predict the merged result of a base plus an override, fix a duplicate-port error caused by list appending, and write the two commands a deploy script should run.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> expecting an override to <em>replace</em> a list. Ports, volumes, and every other sequence are <strong>appended</strong>, so an override that "changes" the port from <code>"18098:3000"</code> to <code>"18097:3000"</code> actually publishes <em>both</em> — the old port stays open on the server although nobody asked for it. (Measured on Compose v5.5.1: an exactly repeated mapping is merged into one, and a volume with the same target replaces the earlier one; older versions and other tools were less forgiving.) The fix is either to keep lists in exactly one layer (the base has no <code>ports</code>, each environment's file supplies them) or to use <code>!override</code> and <code>!reset</code> where you genuinely mean replacement. When a merged file surprises you, do not reason about it — run <code>docker compose -f a.yaml -f b.yaml config</code> and read what compose actually produced.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>compose.override.yaml</code> is loaded automatically and is the natural home for the development experience, while passing any <code>-f</code> disables it — which is exactly what a deploy script wants. Merging is not uniform: scalars are replaced, maps merge key by key, and lists <em>append</em>. And run <code>config</code> on the exact file combination the server will use before you deploy it; it costs a second and it shows you what will really run.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>Nhiều file: dev với prod</h2>
<p class="lead">Lúc phát triển thì muốn mã nguồn bind-mount, cổng mở ra và có bộ gỡ lỗi cắm vào. Production thì không muốn thứ nào trong đó. Câu trả lời SAI là hai file rồi từ từ lệch nhau; câu đúng là một file nền cộng một file ghi đè nhỏ chỉ nói đúng những chỗ khác nhau.</p>

<h3>File ghi đè tự động</h3>
${slide('dk-09', 25, 'compose.override.yaml tự nạp — viết -f là tắt nó')}
<pre><code><span class="tok-comment"># compose.yaml — phần nền, và cũng là thứ production chạy</span>
services:
  api:
    image: ghcr.io/me/api:&#36;{TAG:-latest}
    restart: unless-stopped
    environment:
      NODE_ENV: production</code></pre>
<pre><code><span class="tok-comment"># compose.override.yaml — được nạp TỰ ĐỘNG, chỉ dành cho dev</span>
services:
  api:
    build: .
    command: ["npm", "run", "dev"]
    environment:
      NODE_ENV: development
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
      - "127.0.0.1:9229:9229"</code></pre>
<pre><code>docker compose config | grep -E 'NODE_ENV|command|published' </code></pre>
<div class="out">    command: [npm, run, dev]
      NODE_ENV: development
      published: "3000"
      published: "9229"</div>
<div class="callout ok"><strong><code>compose.override.yaml</code> được đọc tự động khi nó tồn tại, và hợp nhất chồng lên <code>compose.yaml</code>.</strong> Điều đó cho bạn cách tách lý tưởng mà không cần một cái cờ nào: <code>docker compose up</code> trên máy lập trình viên cho trải nghiệm dev, còn máy chủ — vốn không có file ghi đè đó, hoặc truyền tường minh <code>-f compose.yaml</code> — nhận đúng phần nền trơn. Chỉ nên thêm file ghi đè vào <code>.gitignore</code> nếu nó mang tính cá nhân; một file ghi đè dùng chung cho cả nhóm thì thuộc về kho mã.</div>

<h3>Chạy thử từng bước: nhìn file ghi đè được nạp, rồi bị bỏ</h3>
<p>Dự án tập <code>dk09-multi</code> của khoá có đúng cặp file ở trên (cộng thêm <code>LOG_LEVEL: info</code> và <code>DB_ADDR: db:5432</code> ở file nền, và cổng dev dời vào dải của khoá). Hỏi Compose xem nó sẽ chạy gì khi có và khi không có file ghi đè:</p>
<pre><code class="language-bash">docker compose config | grep -E "NODE_ENV|LOG_LEVEL|published|restart"
docker compose -f compose.yaml config | grep -E "NODE_ENV|LOG_LEVEL|published|restart"</code></pre>
<div class="out">      LOG_LEVEL: info
      NODE_ENV: development
        published: "18098"
        published: "18099"
    restart: unless-stopped
      LOG_LEVEL: info
      NODE_ENV: production
        published: "18098"
    restart: unless-stopped</div>
<table>
<tr><th>Dòng</th><th>Chứng minh điều gì</th></tr>
<tr><td><code>NODE_ENV: development</code> với <code>production</code></td><td>File ghi đè được nạp ở lệnh đầu và KHÔNG được nạp ở lệnh sau — chỉ vì có mặt <code>-f</code>.</td></tr>
<tr><td><code>LOG_LEVEL: info</code> ở cả hai</td><td><code>environment</code> là map, gộp theo từng khoá: file ghi đè đổi một khoá, khoá kia vẫn sống.</td></tr>
<tr><td>hai dòng <code>published</code>, rồi một</td><td>File ghi đè <em>thêm</em> một cổng vào danh sách của file nền chứ không thay nó.</td></tr>
<tr><td><code>restart: unless-stopped</code> ở cả hai</td><td>Khoá chỉ có ở file nền thì được thừa kế nguyên vẹn.</td></tr>
</table>

<h3>Xếp chồng file một cách tường minh</h3>
<pre><code><span class="tok-comment"># Thứ tự có ý nghĩa: file sau thắng</span>
docker compose -f compose.yaml -f compose.prod.yaml up -d
docker compose -f compose.yaml -f compose.ci.yaml run --rm test

<span class="tok-comment"># Hoặc đặt một lần cho cả shell / cho script deploy</span>
export COMPOSE_FILE=compose.yaml:compose.prod.yaml
docker compose up -d</code></pre>
<div class="callout warn"><strong>Truyền <code>-f</code> là TẮT luôn file ghi đè tự động.</strong> Ngay khoảnh khắc bạn viết <code>-f compose.yaml</code>, file <code>compose.override.yaml</code> không còn được nạp nữa — từ đó bạn liệt kê tường minh mọi file mình muốn. Đây đúng là thứ bạn cần trong một script deploy: không có cơ hội nào để file ghi đè cục bộ của một lập trình viên lọt lên máy chủ.</div>

<h3>Luật hợp nhất, vốn không hiển nhiên</h3>
${slide('dk-09', 26, 'Luật hợp nhất: THAY, GỘP theo khoá, hay NỐI thêm')}
${slide('dk-09', 27, '!reset xoá cái thừa kế, !override thay trọn')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Giá trị đơn: bị THAY THẾ</span><span class="lz-t">image, command, restart, user, working_dir</span><span class="lz-d">Giá trị của file sau thắng hoàn toàn. Một dòng <code>command</code> trong file ghi đè thay hẳn cái của file nền; không có chuyện nối thêm.</span></div>
  <div class="lz-step"><span class="lz-k">Map: hợp nhất theo từng khoá</span><span class="lz-t">environment, labels, extra_hosts</span><span class="lz-d">Khoá có ở cả hai thì lấy giá trị của file sau; khoá chỉ có ở một bên thì giữ nguyên. Đó là lý do một file ghi đè đổi được <code>NODE_ENV</code> mà không phải chép lại mọi biến khác.</span></div>
  <div class="lz-step"><span class="lz-k">Danh sách: bị NỐI THÊM</span><span class="lz-t">ports, volumes, dns, expose</span><span class="lz-d">Các danh sách được ghép lại, <em>không</em> bị thay thế — kèm một chi tiết quan trọng, đo trên Compose v5.5.1 và ghi rõ trong tài liệu hợp nhất: <code>ports</code>, <code>volumes</code>, <code>secrets</code> và <code>configs</code> được gộp theo một khoá riêng. File ghi đè lặp lại y hệt <code>"3000:3000"</code> thì ra MỘT ánh xạ (không lỗi); một cổng máy chủ KHÁC cho cùng cổng container thì ra HAI; volume trùng đường dẫn đích thì cái sau thay cái trước. Xem "Chạy thử từng bước" ngay dưới.</span></div>
  <div class="lz-step"><span class="lz-k">Xoá sạch một danh sách</span><span class="lz-t">thẻ !reset và !override</span><span class="lz-d"><code>ports: !reset []</code> xoá một danh sách thừa kế; <code>!override</code> thay thế thay vì nối thêm. Cửa thoát hiểm cho lúc nối thêm là sai.</span></div>
</div>
<pre><code><span class="tok-comment"># Luật nối thêm, chứng minh tận mắt</span>
docker compose config | grep -A8 '    volumes:'   <span class="tok-comment"># đã sửa: nền + override tự động; với -f compose.prod.yaml thì các phép gắn của dev đâu có được nạp</span></code></pre>
<div class="out">    volumes:
      - type: bind
        source: …/ch09/multi
        target: /app
        bind: {}
      - type: volume
        target: /app/node_modules
        volume: {}</div>
<pre><code><span class="tok-comment"># compose.prod.yaml — xoá các phép gắn của dev thay vì cộng thêm vào</span>
services:
  api:
    volumes: !reset []
    ports: !override ["127.0.0.1:3000:3000"]</code></pre>

<h3>Chạy thử từng bước: kiểm mọi luật hợp nhất trong hai phút</h3>
<p>Luật hợp nhất dễ nhớ nhầm mà kiểm thì dễ ợt: viết một file ghi đè tí hon, chạy <code>config</code>, đọc. Mỗi dòng dưới đây là một lần chạy thật trên cùng một file nền (không có <code>command</code>, <code>ports: ["18098:3000"]</code>, <code>environment</code> có ba khoá):</p>
<pre><code class="language-bash">docker compose -f compose.yaml -f c1.yaml -f c2.yaml config | grep -A2 command    <span class="tok-comment"># c1: command a.js · c2: command b.js</span>
docker compose -f compose.yaml -f dup.yaml config | grep published                <span class="tok-comment"># dup: "18098:3000" và "18097:3000"</span>
docker compose -f compose.yaml -f v1.yaml -f v2.yaml config | grep -E "source|target: /data"   <span class="tok-comment"># ./a:/data rồi ./b:/data</span></code></pre>
<div class="out">    command:
      - node
      - b.js
        published: "18098"
        published: "18097"
        source: …/ch09/multi/b
        target: /data</div>
<table>
<tr><th>Luật</th><th>Kết quả đo được</th><th>Nghĩa là gì với bạn</th></tr>
<tr><td>Giá trị đơn và <code>command</code> bị thay</td><td>chỉ còn <code>b.js</code></td><td>File sau thắng hoàn toàn; không có chuyện nối thêm vào command.</td></tr>
<tr><td>Cổng gộp theo (ip, target, published, protocol)</td><td><code>18098</code> lặp lại chỉ còn một; <code>18097</code> được thêm</td><td>Lặp một ánh xạ thì vô hại; đổi cổng máy chủ thì KHÔNG xoá cổng cũ.</td></tr>
<tr><td>Volume gộp theo đích</td><td>chỉ <code>./b</code> được gắn ở <code>/data</code></td><td>File sau trỏ lại được một phép gắn mà không cần <code>!override</code>.</td></tr>
</table>
<p>Và hai lối thoát hiểm, chạy y như vậy:</p>
<pre><code class="language-bash">docker compose -f compose.yaml -f compose.prod.yaml config | grep -E "host_ip|published"   <span class="tok-comment"># ports: !override ["127.0.0.1:18098:3000"]</span>
docker compose -f compose.yaml -f r.yaml config | grep -E "published|LOG_LEVEL|NODE_ENV|DB_ADDR"   <span class="tok-comment"># ports: !reset [] · LOG_LEVEL: !reset null</span>
docker compose -f compose.yaml -f o.yaml config | grep -E "LOG_LEVEL|NODE_ENV|DB_ADDR"   <span class="tok-comment"># environment: !override { NODE_ENV: staging }</span></code></pre>
<div class="out">        host_ip: 127.0.0.1
        published: "18098"
      DB_ADDR: db:5432
      NODE_ENV: production
      NODE_ENV: staging</div>
<p><code>!override</code> trên <code>ports</code> để lại đúng một ánh xạ chỉ-loopback; <code>!reset</code> xoá mọi cổng và một khoá môi trường trong khi các khoá khác vẫn còn; <code>!override</code> trên <code>environment</code> vứt <em>toàn bộ</em> khoá thừa kế, chỉ còn <code>NODE_ENV: staging</code> — mạnh, và dễ tay quá đà. <code>COMPOSE_FILE</code> hành xử y như danh sách <code>-f</code>: <code>COMPOSE_FILE=compose.yaml:compose.prod.yaml docker compose config</code> in ra <code>NODE_ENV: production</code> và <code>host_ip: 127.0.0.1</code> (trên Windows dấu phân cách là <code>;</code>).</p>

<h3>include và extends</h3>
${slide('dk-09', 28, 'include ghép nguyên file, extends thừa kế một dịch vụ')}
<pre><code><span class="tok-comment"># include: kéo nguyên một file compose khác vào (Compose 2.20 trở lên)</span>
include:
  - path: ./monitoring/compose.yaml
    env_file: ./monitoring/.env
services:
  api: { build: . }</code></pre>
<pre><code><span class="tok-comment"># extends: thừa kế một định nghĩa dịch vụ, từ chính file này hoặc file khác</span>
services:
  api-base:
    image: ghcr.io/me/api:&#36;{TAG:-latest}
    environment: { LOG_LEVEL: info }
    networks: [private]

  worker:
    extends:
      service: api-base
    command: ["node", "dist/worker.js"]

  scheduler:
    extends:
      file: ./common.yaml
      service: api-base
    command: ["node", "dist/cron.js"]</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>include</code></span><span class="v">Ghép nguyên cả file. Tốt để gắn một stack giám sát hay ghi log lên trên một stack ứng dụng mà không phải chép nó. Mỗi file được include giữ đường dẫn tương đối và <code>.env</code> của riêng nó.</span></div>
  <div class="kv"><span class="k"><code>extends</code></span><span class="v">Thừa kế MỘT dịch vụ. Tốt cho ba dịch vụ cùng một cái ảnh chỉ khác nhau ở <code>command</code> — API, worker, scheduler.</span></div>
  <div class="kv"><span class="k"><code>extends</code> mang theo cả phụ thuộc</span><span class="v">Compose bản cũ bỏ <code>depends_on</code> và <code>volumes_from</code> khi extends. Compose v5.5.1 thì không: đo thật, một <code>worker</code> extends dịch vụ có <code>depends_on: [db]</code> nhận luôn phụ thuộc đó — và khi extends từ file khác mà <code>db</code> không được định nghĩa ở đây, dự án hỏng với <code>service "worker" depends on undefined service "db"</code>.</span></div>
  <div class="kv"><span class="k">Anchor của YAML vẫn dùng được</span><span class="v"><code>&amp;base</code> / <code>&lt;&lt;: *base</code> là phương án YAML thuần, và thường đơn giản hơn khi nằm trong cùng một file. Lưu ý nó chỉ hợp nhất map, và không vượt được sang file khác.</span></div>
  <div class="kv"><span class="k">Đừng dựng ra một framework</span><span class="v">Ba file là ổn. Chín file với hai tầng <code>extends</code> và một <code>include</code> thì không ai biết cái gì đang chạy — và <code>docker compose config</code> trở thành cách duy nhất để biết.</span></div>
</div>

<h3>Chạy thử từng bước: include và extends, dưới con mắt của Compose</h3>
<p>Dự án <code>dk09-inc</code> include <code>./monitoring/compose.yaml</code> (một dịch vụ <code>uptime</code> có <code>TARGET: &#36;{TARGET}</code> lấy từ <code>./monitoring/.env</code>) và định nghĩa <code>worker</code> với <code>scheduler</code>, cả hai extends <code>api-base</code> từ <code>./common.yaml</code>; <code>scheduler</code> ghi đè <code>LOG_LEVEL</code>:</p>
<pre><code class="language-bash">docker compose config --services
docker compose config | grep -E "^  [a-z]|js|LOG_LEVEL|TARGET|image"</code></pre>
<div class="out">scheduler
uptime
worker
  scheduler:
      - cron.js
      LOG_LEVEL: debug
    image: dk09-multi-api:latest
  uptime:
      TARGET: http://api:3000
    image: alpine
  worker:
      - worker.js
      LOG_LEVEL: info
    image: dk09-multi-api:latest
  default:</div>
<p>(Dòng cuối là mạng <code>default</code> của dự án, bị mẫu <code>^  [a-z]</code> bắt dính.) Thấy được ba điều: <code>uptime</code> nhập vào dự án như thể được viết ngay tại đây; <code>TARGET</code> của nó được điền từ <code>.env</code> RIÊNG của file được include, không phải của dự án này; và cả hai dịch vụ extends đều nhận ảnh và biến môi trường của bản gốc, với <code>LOG_LEVEL</code> riêng của <code>scheduler</code> thắng — đúng luật gộp map như giữa các file. Giờ là phép kiểm phụ thuộc đã giúp sửa lại một khẳng định cũ của bài này:</p>
<pre><code class="language-bash"><span class="tok-comment"># common.yaml: api-base có depends_on: [db]; file này chỉ định nghĩa worker (extends nó)</span>
docker compose -f c2.yaml config</code></pre>
<div class="out">service "worker" depends on undefined service "db": invalid compose project</div>

<h3>Một bố cục đứng vững được</h3>
${slide('dk-09', 29, 'Nền + dev + prod, và đọc config trước khi deploy')}
<pre><code>blog/
├── compose.yaml              <span class="tok-comment"># nền: ảnh, mạng, volume, healthcheck</span>
├── compose.override.yaml     <span class="tok-comment"># dev: build, bind mount, cổng, nạp nóng</span>
├── compose.prod.yaml         <span class="tok-comment"># prod: restart, hạn mức, cổng loopback, xoay log</span>
├── .env.example              <span class="tok-comment"># có commit, không giá trị thật</span>
└── .env                      <span class="tok-comment"># gitignore, chỉ nằm cục bộ</span></code></pre>
<pre><code><span class="tok-comment"># Lập trình viên</span>
docker compose up -d                                          <span class="tok-comment"># nền + ghi đè</span>

<span class="tok-comment"># Máy chủ, trong script deploy</span>
docker compose -f compose.yaml -f compose.prod.yaml pull
docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build

<span class="tok-comment"># Kiểm xem máy chủ thật sự sẽ chạy gì, TRƯỚC khi deploy</span>
docker compose -f compose.yaml -f compose.prod.yaml config | head -20</code></pre>
<div class="out">name: dk09-multi
services:
  api:
    deploy:
      resources:
        limits:
          cpus: 1.5
          memory: "536870912"
    environment:
      DB_ADDR: db:5432
      LOG_LEVEL: info
      NODE_ENV: production
    image: dk09-multi-api:latest
    logging:
      driver: json-file
      options:
        max-file: "3"
        max-size: 10m
    networks:
      default: null</div>
<p class="note-ct">Output thật (dự án tập <code>dk09-multi</code> của khoá, Compose v5.5.1), thay cho một bản viết tay trước đây: <code>config</code> xếp khoá theo bảng chữ cái, in map lồng nhau theo dạng khối, và <code>restart: unless-stopped</code> nằm xa hơn, quá dòng 20.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm bạn deploy cùng một repo lên một VPS nhỏ. Trên laptop cần nạp nóng và cổng gỡ lỗi; trên máy chủ API chỉ được nghe ở loopback (nginx đứng trước) và không bao giờ được vớ phải file ghi đè cục bộ của bạn nào. Dựng cách tách đó và chứng minh bằng <code>config</code> trước khi chạy bất cứ thứ gì.</p><ol>
<li>Trong <code>~/thu-docker/thu-multi</code>, viết <code>compose.yaml</code> (<code>name: thu-multi</code>) có một dịch vụ <code>api</code>: <code>image: nginx:alpine</code>, <code>restart: unless-stopped</code>, <code>environment: { NODE_ENV: production, LOG_LEVEL: info }</code>, <code>ports: ["18098:80"]</code>.</li>
<li>Viết <code>compose.override.yaml</code> đặt <code>NODE_ENV: development</code> và thêm <code>"127.0.0.1:18099:80"</code>. Đoán trước output của <code>docker compose config | grep -E "NODE_ENV|LOG_LEVEL|published"</code>, rồi chạy.</li>
<li>Viết <code>compose.prod.yaml</code> dùng <code>!override</code> để cổng duy nhất là <code>"127.0.0.1:18098:80"</code>, và thêm <code>deploy.resources.limits.memory: 256M</code>. Kiểm bằng <code>docker compose -f compose.yaml -f compose.prod.yaml config</code>.</li>
<li>Giờ "đổi" cổng theo kiểu ngây thơ: trong file <code>bad.yaml</code> ghi <code>ports: ["18097:80"]</code> không kèm thẻ nào, rồi xem <code>-f compose.yaml -f bad.yaml config</code> công bố bao nhiêu cổng.</li>
<li>Dựng tổ hợp production bằng <code>docker compose -f compose.yaml -f compose.prod.yaml up -d --wait</code>, <code>curl -s -o /dev/null -w "%{http_code}\\n" localhost:18098</code>, rồi <code>docker compose -f compose.yaml -f compose.prod.yaml down</code>.</li></ol>
<p><strong>Đạt khi:</strong> bước 2 thấy <code>development</code> với hai cổng published; bước 3 thấy đúng một cổng có <code>host_ip: 127.0.0.1</code> và <code>memory: "268435456"</code>; bước 4 thấy hai cổng published; bước 5 in <code>200</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Base file (file nền)</span><span class="v"><code>compose.yaml</code>: mọi thứ các môi trường dùng chung — và là thứ production chạy.</span></div>
  <div class="kv"><span class="k">Override file (file ghi đè)</span><span class="v">File xếp chồng lên trên, chỉ nói những chỗ khác. <code>compose.override.yaml</code> được nạp tự động.</span></div>
  <div class="kv"><span class="k">Merge (hợp nhất)</span><span class="v">Cách Compose ghép các file xếp chồng: giá trị đơn bị thay, map gộp theo khoá, danh sách nối thêm (cổng/volume gộp theo khoá riêng).</span></div>
  <div class="kv"><span class="k"><code>!reset</code> / <code>!override</code></span><span class="v">Thẻ YAML trong file ghi đè: xoá giá trị thừa kế / thay trọn thay vì gộp.</span></div>
  <div class="kv"><span class="k"><code>COMPOSE_FILE</code></span><span class="v">Biến môi trường chứa danh sách file, như lặp <code>-f</code>; phân cách bằng <code>:</code> (<code>;</code> trên Windows).</span></div>
  <div class="kv"><span class="k"><code>include</code> (nhúng file)</span><span class="v">Kéo nguyên một file compose (cùng đường dẫn và <code>.env</code> riêng của nó) vào dự án.</span></div>
  <div class="kv"><span class="k"><code>extends</code> (thừa kế dịch vụ)</span><span class="v">Chép định nghĩa của một dịch vụ sang dịch vụ khác, rồi dịch vụ đó ghi đè phần khác biệt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>compose.override.yaml</code> tự được nạp; bất kỳ <code>-f</code> nào (hay <code>COMPOSE_FILE</code>) tắt điều đó — đúng thứ script deploy cần.</li>
<li>Giá trị đơn và <code>command</code> bị thay; map như <code>environment</code> gộp theo từng khoá.</li>
<li>Danh sách được nối, nhưng <code>ports</code> gộp theo (ip, target, published, protocol) và <code>volumes</code> theo đích: lặp cổng thì vô hại, đổi cổng máy chủ thì cổng cũ vẫn mở.</li>
<li><code>!override</code> thay trọn một giá trị, <code>!reset</code> xoá nó — đã đo trên <code>ports</code> và <code>environment</code>.</li>
<li><code>include</code> ghép nguyên file; <code>extends</code> chép một dịch vụ — gồm cả <code>depends_on</code> của nó ở Compose v5.</li>
<li>Chạy <code>config</code> trên đúng tổ hợp file máy chủ sẽ dùng trước mỗi lần deploy.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/compose/how-tos/multiple-compose-files/merge/" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">Compose — hợp nhất và ghi đè</span><span class="lc-sub">Luật chính xác cho từng kiểu trường, kèm danh sách khoá nào nối thêm và khoá nào thay thế, cộng với hai thẻ <code>!reset</code> và <code>!override</code>.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/compose/how-tos/multiple-compose-files/include/" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Compose — include</span><span class="lc-sub">Ghép nhiều stack độc lập, cách đường dẫn tương đối và file env được phân giải bên trong một file được include, và khi nào <code>include</code> hơn cách xếp chồng <code>-f</code>.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: tách dev khỏi prod</span><span class="lc-sub">Bài chấm điểm: đoán trước kết quả hợp nhất của một file nền cộng một file ghi đè, chữa lỗi trùng cổng do danh sách bị nối thêm, và viết hai câu lệnh mà một script deploy nên chạy.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> trông đợi một file ghi đè sẽ <em>thay thế</em> một danh sách. Cổng, volume, và mọi dãy khác đều bị <strong>NỐI THÊM</strong>, nên một file ghi đè "đổi" cổng từ <code>"18098:3000"</code> sang <code>"18097:3000"</code> thật ra công bố <em>cả hai</em> — cổng cũ vẫn mở trên máy chủ dù chẳng ai yêu cầu. (Đo trên Compose v5.5.1: một ánh xạ lặp y hệt được gộp thành một, và volume trùng đích thì cái sau thay cái trước; các bản cũ và công cụ khác thì không dễ dãi như vậy.) Cách chữa là hoặc giữ danh sách ở đúng MỘT tầng (file nền không có <code>ports</code>, file của từng môi trường cung cấp chúng), hoặc dùng <code>!override</code> với <code>!reset</code> ở đúng chỗ bạn thật sự muốn thay thế. Khi một file đã hợp nhất làm bạn bất ngờ thì đừng ngồi suy luận — hãy chạy <code>docker compose -f a.yaml -f b.yaml config</code> và đọc thứ compose thật sự sinh ra.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> <code>compose.override.yaml</code> được nạp tự động và là chỗ ở tự nhiên cho trải nghiệm phát triển, trong khi truyền bất kỳ <code>-f</code> nào cũng tắt nó đi — và đó đúng là thứ một script deploy cần. Hợp nhất không đồng nhất: giá trị đơn bị thay thế, map hợp nhất theo từng khoá, còn danh sách thì <em>nối thêm</em>. Và hãy chạy <code>config</code> trên đúng tổ hợp file mà máy chủ sẽ dùng trước khi deploy; nó tốn một giây và nó cho bạn thấy thứ thật sự sẽ chạy.</p>
</div>
`,
    },
    /* ─────────────────────────── 9.6 ─────────────────────────── */
    {
      title: '9.6 — Quiz: Compose|||9.6 — Trắc nghiệm: Compose',
      slug: 'dk-9-6-quiz',
      type: 'QUIZ',
      description: 'Mười câu tình huống về Compose: ✔ Started mà container đã chết, đổi tên thư mục, healthcheck và start_interval, pg_isready nói dối, job migrate, hai cái .env, --env-file, YAML đổi kiểu số, luật hợp nhất cổng, và profile khi down.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, all taken from things that really happened on the course machine while this chapter was written. Each one is a moment where the file said one thing and the running stack did another — knowing which key or rule was responsible is what turns that from a mystery into a one-line fix.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can predict the names of every network, volume and container a compose file will create, and I set <code>name:</code> on purpose.</li>
<li>I check <code>docker compose ps -a</code> after <code>up</code>, because "✔ Started" does not mean "still running".</li>
<li>I can write a healthcheck that runs in the image, uses the same path as the app, and has <code>start_period</code> and <code>start_interval</code>.</li>
<li>I know which <code>.env</code> feeds <code>&#36;{…}</code> in the YAML and which one feeds the container, and the order in which values win.</li>
<li>I can predict what a base file plus an override produces — and I verify it with <code>docker compose config</code> anyway.</li>
<li>I tear down profiled services with <code>--profile "*" down</code> and never type <code>down -v</code> out of habit.</li>
</ul>
${slide('dk-09', 31, 'Bảng tra nhanh Chương 9')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Trắc nghiệm</span>
<h2>Kiểm lại xem đọng được gì</h2>
<p class="lead">Mười tình huống, tất cả lấy từ những chuyện đã xảy ra thật trên máy của khoá trong lúc viết chương này. Mỗi câu là một khoảnh khắc cái file nói một đằng còn stack đang chạy làm một nẻo — biết khoá hay luật nào chịu trách nhiệm là thứ biến chuyện đó từ một bí ẩn thành một dòng sửa.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đoán trước được tên của mọi mạng, volume và container mà một file compose sẽ tạo, và tôi đặt <code>name:</code> một cách có chủ ý.</li>
<li>Tôi kiểm <code>docker compose ps -a</code> sau mỗi lần <code>up</code>, vì "✔ Started" không có nghĩa là "vẫn đang chạy".</li>
<li>Tôi viết được healthcheck chạy được trong ảnh, đi đúng đường của ứng dụng, có <code>start_period</code> và <code>start_interval</code>.</li>
<li>Tôi biết file <code>.env</code> nào nuôi <code>&#36;{…}</code> trong YAML và file nào nuôi container, và thứ tự giá trị nào thắng.</li>
<li>Tôi đoán được file nền cộng file ghi đè sinh ra gì — và vẫn kiểm lại bằng <code>docker compose config</code>.</li>
<li>Tôi dọn dịch vụ có profile bằng <code>--profile "*" down</code> và không bao giờ gõ <code>down -v</code> theo quán tính.</li>
</ul>
${slide('dk-09', 31, 'Bảng tra nhanh Chương 9')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'docker compose up -d prints six green ticks, including "✔ Container blog-api-1 Started", yet the site returns 502 and docker compose ps does not list api at all. What is going on?|||docker compose up -d in ra sáu dấu tích xanh, có cả "✔ Container blog-api-1 Started", vậy mà trang web trả 502 và docker compose ps không hề liệt kê api. Chuyện gì đang xảy ra?',
            options: [
              'Compose still starts api in the background after up returns, so it will show up in ps a little later|||Compose vẫn đang khởi động api ngầm sau khi up trả về, nên lát nữa nó sẽ hiện trong ps',
              '"Started" only means the start command succeeded; api has since exited — ps -a and logs api show why|||"Started" chỉ nghĩa là lệnh khởi động thành công; api đã thoát sau đó — ps -a và logs api cho biết vì sao',
              'The api container was created on a network that ps cannot see, because it is marked as internal: true|||Container api được tạo trên một mạng mà ps không nhìn thấy, vì mạng đó được đánh dấu internal: true',
              'ps lists only services with published ports, and api publishes none, so it is hidden by design|||ps chỉ liệt kê dịch vụ có công bố cổng, mà api không công bố cổng nào, nên nó bị ẩn theo thiết kế',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Measured on the course Mac: all ticks green, then ps -a showed api "Exited (1) 2 seconds ago" with ECONNREFUSED in its logs. ps without -a hides dead containers. up does not keep working in the background, and neither networks nor ports decide what ps lists.|||VI: Đo trên máy Mac của khoá: dấu tích xanh hết, rồi ps -a cho api "Exited (1) 2 seconds ago" với ECONNREFUSED trong log. ps không có -a thì giấu container đã chết. up không làm tiếp ngầm, và mạng hay cổng đều không quyết định ps liệt kê gì.',
          },
          {
            question: 'A teammate clones the repo into swp391-be instead of backend and runs docker compose up -d. The seeded rows are gone. The file has no name: key. What is true?|||Một bạn clone repo vào thư mục swp391-be thay vì backend rồi chạy docker compose up -d. Dữ liệu mẫu biến mất. File không có khoá name:. Điều gì đúng?',
            options: [
              'Compose noticed the new folder and wiped the old volume to avoid two copies of the same database|||Compose nhận ra thư mục mới và xoá volume cũ để tránh hai bản sao của cùng một cơ sở dữ liệu',
              'The volume path is stored relative to the folder, so the old data is now unreachable and lost|||Đường dẫn volume được lưu tương đối theo thư mục, nên dữ liệu cũ giờ không với tới được và đã mất',
              'Postgres refuses to reuse a volume created by another project, so it re-initialised the old one|||Postgres từ chối dùng lại volume do dự án khác tạo, nên nó khởi tạo lại chính volume cũ',
              'The project name changed, so a new empty volume was created; the old one still exists under the old name|||Tên dự án đổi nên một volume rỗng mới được tạo; volume cũ vẫn còn nguyên dưới tên cũ',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: Project name = folder name by default, and every volume is prefixed with it: dk09-shop_data and dk09-shop-api_data existed side by side after the rename. Nothing deletes volumes except down -v or volume rm. Adding name: dk09-shop re-attached the old volume and the note came back.|||VI: Tên dự án = tên thư mục theo mặc định, và mọi volume mang tiền tố đó: sau khi đổi tên, dk09-shop_data và dk09-shop-api_data nằm cạnh nhau. Không gì xoá volume ngoài down -v hay volume rm. Thêm name: dk09-shop là gắn lại volume cũ và dữ liệu quay về.',
          },
          {
            question: 'db has healthcheck interval: 5s and start_period: 30s. Its logs say Postgres is ready 0.9 s after start, but Compose reports "Healthy 5.8s" every time. Why, and what fixes it?|||db có healthcheck interval: 5s và start_period: 30s. Log nói Postgres sẵn sàng 0,9 giây sau khi khởi động, nhưng lần nào Compose cũng báo "Healthy 5.8s". Vì sao, và sửa thế nào?',
            options: [
              'The first check only runs after one interval; start_interval: 1s checks often during start_period|||Lần kiểm đầu chỉ chạy sau một interval; start_interval: 1s cho kiểm dày trong start_period',
              'start_period forces Compose to wait at least that long; lowering it to 5s would make it faster|||start_period ép Compose chờ ít nhất khoảng đó; hạ xuống 5s sẽ làm nó nhanh hơn',
              'pg_isready itself needs about five seconds to connect, so a faster check command is needed|||Bản thân pg_isready cần khoảng năm giây để kết nối, nên cần một lệnh kiểm nhanh hơn',
              'Compose adds a fixed five-second safety delay after any container that declares a healthcheck|||Compose thêm một khoảng chờ an toàn cố định năm giây sau mọi container có khai healthcheck',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Measured: with interval 5s the first check ran at 5.00 s and db was healthy at 5.03 s; adding start_interval: 1s moved both to about 1 s. start_period is a grace window, not a minimum wait (a passing check ends it early), pg_isready answers in milliseconds, and there is no fixed delay.|||VI: Đo thật: với interval 5s, lần kiểm đầu chạy lúc 5,00 s và db healthy lúc 5,03 s; thêm start_interval: 1s kéo cả hai về khoảng 1 s. start_period là cửa sổ ân hạn chứ không phải thời gian chờ tối thiểu (kiểm đạt là kết thúc sớm), pg_isready trả lời trong vài mili giây, và không có khoảng chờ cố định nào.',
          },
          {
            question: 'Your db healthcheck is pg_isready -U postgres -d blog. On fresh volumes the API very occasionally still gets ECONNREFUSED right after db turns healthy. Most likely cause?|||Healthcheck của db là pg_isready -U postgres -d blog. Với volume mới, thỉnh thoảng API vẫn ăn ECONNREFUSED ngay sau khi db chuyển healthy. Nguyên nhân khả dĩ nhất?',
            options: [
              'The API resolves db to a stale IP address cached from the previous run of the same stack|||API phân giải db ra một địa chỉ IP cũ được cache từ lần chạy trước của cùng stack',
              'retries is too low, so one lucky check is enough to mark the container as healthy too early|||retries quá thấp, nên chỉ một lần kiểm may mắn là đủ đánh dấu container healthy quá sớm',
              'initdb runs a temporary server that answers on the Unix socket only; check TCP with -h 127.0.0.1|||initdb chạy một máy chủ tạm chỉ trả lời qua unix socket; hãy kiểm TCP bằng -h 127.0.0.1',
              'service_healthy is ignored when the dependency also has a restart policy set to unless-stopped|||service_healthy bị bỏ qua khi bên phụ thuộc cũng có chính sách restart là unless-stopped',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Polling both ways on a new container showed two checks where the socket said "accepting connections" while 127.0.0.1 said "no response". retries counts failures before unhealthy, not successes; DNS is not cached that way; restart policies do not disable conditions.|||VI: Hỏi cả hai cách trên một container mới cho thấy hai lần kiểm mà socket nói "accepting connections" trong khi 127.0.0.1 nói "no response". retries đếm số lần hỏng trước khi unhealthy, không đếm lần đạt; DNS không cache kiểu đó; chính sách restart không tắt điều kiện phụ thuộc.',
          },
          {
            question: 'api depends on migrate with condition: service_completed_successfully. The migration SQL fails. What does the stack look like afterwards?|||api phụ thuộc migrate với condition: service_completed_successfully. Câu SQL migration bị lỗi. Sau đó stack trông thế nào?',
            options: [
              'api starts anyway after a timeout, because a failed dependency only produces a warning line|||api vẫn khởi động sau một khoảng chờ, vì phụ thuộc hỏng chỉ sinh ra một dòng cảnh báo',
              'Compose retries migrate forever until it succeeds, keeping up blocked in the foreground|||Compose thử lại migrate mãi cho tới khi thành công, giữ lệnh up treo ở tiền cảnh',
              'migrate is Exited (1), api stays Created and never runs, and docker compose up exits with code 1|||migrate ở Exited (1), api nằm ở Created và không chạy, còn docker compose up thoát với mã 1',
              'Compose rolls back the database to the state before migrate ran and then starts api normally|||Compose quay cơ sở dữ liệu về trạng thái trước khi migrate chạy rồi khởi động api bình thường',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Exactly what the course run printed: service "migrate" didn’t complete successfully: exit 1, ps -a showed api Created, and echo $? gave 1 — so set -e in a deploy script stops there. Compose has no rollback and does not retry a job with restart: "no".|||VI: Đúng như lượt chạy của khoá in ra: service "migrate" didn’t complete successfully: exit 1, ps -a cho api ở Created, và echo $? ra 1 — nên set -e trong script deploy dừng ngay đó. Compose không có quay lui và không thử lại một job có restart: "no".',
          },
          {
            question: 'HTTP_PORT=18096 lives only in api.env (the service’s env_file), and the YAML says ports: ["${HTTP_PORT}:80"]. What happens on up?|||HTTP_PORT=18096 chỉ nằm trong api.env (env_file của dịch vụ), còn YAML ghi ports: ["${HTTP_PORT}:80"]. Chuyện gì xảy ra khi up?',
            options: [
              'A warning that HTTP_PORT is not set; the mapping becomes ":80", so Docker picks a random host port|||Một cảnh báo rằng HTTP_PORT chưa đặt; ánh xạ thành ":80", nên Docker chọn một cổng máy ngẫu nhiên',
              'Compose reads api.env for interpolation as well, so the service is published on port 18096|||Compose cũng đọc api.env để nội suy, nên dịch vụ được công bố ở cổng 18096',
              'Compose refuses to start with an error, because ports may never contain an empty variable|||Compose từ chối khởi động kèm lỗi, vì ports không bao giờ được chứa biến rỗng',
              'The port falls back to the EXPOSE line of the image, so nginx is published on port 80|||Cổng rơi về dòng EXPOSE của ảnh, nên nginx được công bố ở cổng 80',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Measured: level=warning msg="The \\"HTTP_PORT\\" variable is not set", then ps showed 0.0.0.0:58721->80/tcp while the container still had HTTP_PORT=18096 in its environment. Only the shell, --env-file or the project .env feed interpolation; use ${HTTP_PORT:?…} to make it an error.|||VI: Đo thật: level=warning msg="The \\"HTTP_PORT\\" variable is not set", rồi ps cho 0.0.0.0:58721->80/tcp trong khi container vẫn có HTTP_PORT=18096 trong môi trường. Chỉ shell, --env-file hoặc .env của dự án nuôi phép nội suy; dùng ${HTTP_PORT:?…} để biến nó thành lỗi.',
          },
          {
            question: '.env sets TAG=1.4.2 and GREETING=hello; .env.prod sets only TAG=2.0.0. The YAML uses ${TAG:-latest} and ${GREETING:-from-yaml}. What does docker compose --env-file .env.prod config show?|||.env đặt TAG=1.4.2 và GREETING=hello; .env.prod chỉ đặt TAG=2.0.0. YAML dùng ${TAG:-latest} và ${GREETING:-from-yaml}. docker compose --env-file .env.prod config cho ra gì?',
            options: [
              'TAG 2.0.0 and GREETING hello, because --env-file is merged on top of the default .env file|||TAG 2.0.0 và GREETING hello, vì --env-file được gộp chồng lên file .env mặc định',
              'TAG 1.4.2 and GREETING hello, because the default .env always has the final word here|||TAG 1.4.2 và GREETING hello, vì .env mặc định luôn là tiếng nói cuối cùng ở đây',
              'An error, because the two env files disagree about the value of TAG and Compose cannot choose|||Một lỗi, vì hai file env mâu thuẫn về giá trị của TAG và Compose không chọn được',
              'TAG 2.0.0 and GREETING from-yaml, because --env-file replaces .env instead of adding to it|||TAG 2.0.0 và GREETING from-yaml, vì --env-file thay thế .env chứ không cộng thêm vào nó',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: Measured with the same shape: --env-file .env.prod gave image …:2.0.0 and GREETING from the YAML default. To combine, pass both: --env-file .env --env-file .env.prod (later wins). The shell would beat both files.|||VI: Đo với đúng dạng này: --env-file .env.prod cho image …:2.0.0 và GREETING lấy mặc định trong YAML. Muốn kết hợp thì truyền cả hai: --env-file .env --env-file .env.prod (file sau thắng). Shell thì thắng cả hai file.',
          },
          {
            question: 'The compose file has environment: { APP_VERSION: 1.10, UMASK: 0755 } without quotes. What does the container actually receive with Compose v5?|||File compose có environment: { APP_VERSION: 1.10, UMASK: 0755 } không bọc nháy. Với Compose v5 container thật sự nhận gì?',
            options: [
              'Exactly 1.10 and 0755, because every environment value is always passed through as raw text|||Đúng 1.10 và 0755, vì mọi giá trị environment luôn được chuyển nguyên văn dạng chữ',
              'APP_VERSION=1.1 and UMASK=493: YAML parsed them as numbers, 0755 as octal, before Compose stringified them|||APP_VERSION=1.1 và UMASK=493: YAML đọc chúng thành số, 0755 là bát phân, trước khi Compose đổi lại thành chữ',
              'Nothing: Compose rejects the file, because environment values are not allowed to be numbers|||Không gì cả: Compose từ chối file, vì giá trị environment không được phép là số',
              'APP_VERSION=1.10 but UMASK=755, because only a leading zero is stripped from integer values|||APP_VERSION=1.10 nhưng UMASK=755, vì chỉ số 0 đứng đầu bị bỏ khỏi giá trị số nguyên',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Measured with docker compose exec web env: H_VER=1.1 and E_OCT=493 (7×64 + 5×8 + 5). Numbers are accepted, not rejected — they are converted. Quote such values: "1.10", "0755". The famous 22:22 base-60 trap, on the other hand, no longer happens in Compose v2+.|||VI: Đo bằng docker compose exec web env: H_VER=1.1 và E_OCT=493 (7×64 + 5×8 + 5). Số được chấp nhận chứ không bị từ chối — chúng bị chuyển đổi. Hãy bọc nháy: "1.10", "0755". Còn cái bẫy 22:22 hệ 60 nổi tiếng thì không còn xảy ra ở Compose v2+.',
          },
          {
            question: 'compose.yaml publishes "18098:3000". compose.prod.yaml, meant to move the API to another port, says ports: ["18097:3000"]. After deploying with both files, which host ports are open?|||compose.yaml công bố "18098:3000". compose.prod.yaml, định dời API sang cổng khác, ghi ports: ["18097:3000"]. Sau khi deploy với cả hai file, cổng máy chủ nào đang mở?',
            options: [
              'Both 18098 and 18097 — ports merge by (ip, target, published, protocol); use ports: !override to replace|||Cả 18098 và 18097 — cổng được gộp theo (ip, target, published, protocol); dùng ports: !override để thay',
              'Only 18097, because a list in a later file always replaces the whole list from the base file|||Chỉ 18097, vì danh sách trong file sau luôn thay trọn danh sách của file nền',
              'Neither: up fails with a duplicate-port error because two mappings share container port 3000|||Không cổng nào: up hỏng với lỗi trùng cổng vì hai ánh xạ dùng chung cổng container 3000',
              'Only 18098, because the base file always wins for ports and the override is silently ignored|||Chỉ 18098, vì file nền luôn thắng với ports và file ghi đè bị lặng lẽ bỏ qua',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Measured on Compose v5.5.1: config printed published "18098" and "18097". An identical repeated mapping merges into one with no error; only a different key adds a second. Lists are not replaced unless you write !override (or clear them with !reset []).|||VI: Đo trên Compose v5.5.1: config in published "18098" và "18097". Một ánh xạ lặp y hệt được gộp thành một, không lỗi; chỉ khoá khác mới thêm cái thứ hai. Danh sách không bị thay trừ khi bạn viết !override (hoặc xoá bằng !reset []).',
          },
          {
            question: 'You started the stack with docker compose --profile tools up -d (db + adminer). Later you run plain docker compose down. What do you see?|||Bạn dựng stack bằng docker compose --profile tools up -d (db + adminer). Sau đó bạn chạy docker compose down trơn. Bạn thấy gì?',
            options: [
              'Everything is removed, because down always removes every container that carries the project label|||Mọi thứ bị xoá, vì down luôn xoá mọi container mang nhãn dự án',
              'Nothing is removed until you also pass --profile tools, because down refuses to run partially|||Không gì bị xoá cho tới khi bạn truyền thêm --profile tools, vì down từ chối chạy một phần',
              'db is removed, adminer keeps running, and the network reports "Resource is still in use"|||db bị xoá, adminer vẫn chạy, và mạng báo "Resource is still in use"',
              'adminer is removed first and db is kept, because profiled services are always torn down first|||adminer bị xoá trước còn db được giữ, vì dịch vụ có profile luôn bị dọn trước',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Exactly the course run: "✔ Container dk09-prof-db-1 Removed", "! Network dk09-prof_default Resource is still in use", and docker ps still listed dk09-prof-adminer-1. A command without --profile only sees the services active without it; docker compose --profile "*" down removes all of them.|||VI: Đúng như lượt chạy của khoá: "✔ Container dk09-prof-db-1 Removed", "! Network dk09-prof_default Resource is still in use", và docker ps vẫn liệt kê dk09-prof-adminer-1. Lệnh không kèm --profile chỉ thấy dịch vụ đang bật khi không có profile; docker compose --profile "*" down xoá tất cả.',
          },
        ],
      },
    },
  ],
};
