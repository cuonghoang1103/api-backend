const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';
/**
 * Deploy VPS — Chương 13 (MỚI, 29/09/2026): Deploy bằng container, registry và CI.
 * Nối tiếp Ch2 (ảnh là tạo tác, digest), Ch3 (tráo, xanh/lam bằng tiến trình), Ch6 (lùi bằng ảnh cũ), Ch8 (build trên
 * VPS nhỏ: OOM 137, cache 7,6 GB) — không dạy lại; trỏ /courses/docker và /courses/github-actions cho cú pháp.
 * Mọi số đo là ĐO THẬT (hợp đồng mục 7b) trên Docker Desktop (Mac M1): VPS thí nghiệm dv13-vps = ubuntu:24.04 + sshd +
 * Docker Engine 29.1.3 + Compose 2.40.3 chạy BÊN TRONG (Docker-in-Docker, --privileged, volume cho /var/lib/docker),
 * SSH qua 127.0.0.1:19132 bằng khoá trong thư mục nháp; registry:2 cục bộ dv13-reg (Mac đẩy tới localhost:19135, VPS
 * kéo từ dv13-reg:5000). Dự án compose "dat-lich": api Node (khởi động 1,5 s) + postgres:16-alpine + nginx:1.27-alpine.
 * Đo: TAG bắt buộc; :latest không được kéo ⇒ route mới 404; ENV/ARG lộ trong docker history; restart no/unless-stopped/
 * always sau khi dockerd khởi động lại; log json-file 215 MB/4 s vs xoay vòng; mem_limit; bind-mount tệp đơn theo inode
 * (mv ⇒ container mù) vs gắn thư mục; down -v xoá CSDL; Prisma 5.22.0 thật: engine glibc chép sang Alpine musl ⇒
 * Restarting (1), 8 lần/25 s; chốt kiểm ảnh (tên engine + NẠP engine), ldd trên tệp .node thoát 127 với CẢ engine sai lẫn đúng (vô dụng);
 * --platform linux/amd64 không có giả lập (exec format error) và mẹo $BUILDPLATFORM ra ảnh amd64 mang engine arm64;
 * dọn ảnh theo sổ da-len.log; lùi --pull never khi registry sập; khoá CI command=…,restrict (một OK, bốn từ chối);
 * known_hosts ghim; hai `compose up` cùng lúc ⇒ Conflict / sai bản, flock ⇒ 75; up -d rơi 83–134 request (4 lần đo),
 * --wait không cứu request, start_interval mặc định 5 s; xanh/lam 940/940 và 1653/1653 kể cả khi bản mới hỏng;
 * nginx giữ IP cũ ⇒ 502 tới khi reload, resolver 127.0.0.11 + biến. Không có `act` ⇒ workflow KHÔNG chạy trên GitHub
 * thật: YAML kiểm bằng js-yaml, khối run: của bước deploy chạy nguyên văn với HOME giả.
 * LUẬT: backtick → &#96;; ${ của bash/GitHub → \${; < > & trong code → &lt; &gt; &amp;; gạch chéo ngược viết đôi.
 */
import { gallery, slide } from './_slides.mjs';

export default {
  title: 'Chapter 13 — Deploying with containers, a registry and CI|||Chương 13 — Deploy bằng container, registry và CI',
  slug: 'deploy-ch13-container-ci',
  description: 'Dự án này deploy bằng ảnh: dựng ở máy nhà, đẩy registry, VPS chỉ kéo về và tráo. Chương này dựng đúng đường ống đó trên một VPS thí nghiệm có Docker bên trong, rồi đo những chỗ nó hỏng mà không ai thấy: :latest không được kéo, ảnh dựng xanh mà chạy chết, khoá CI mở cả shell, hai lần deploy đua nhau, và 83–134 request rơi mỗi lần docker compose up -d.',
  sortOrder: 14,
  lessons: [

    /* ─────────────────────────── 13.0 ─────────────────────────── */
    {
      title: '13.0 — Chapter 13 slides: containers, a registry and CI in pictures|||13.0 — Slide Chương 13: container, registry và CI bằng hình',
      slug: 'deploy-13-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 31 slide của Chương 13: compose.yaml trên VPS từng dòng, :latest không được kéo, bí mật trong ảnh, restart sau reboot, bẫy inode của bind-mount, ảnh glibc chép sang musl và chốt kiểm trước khi đẩy, khoá CI một-lệnh, concurrency chỉ xếp hàng, và 83–134 request rơi mỗi lần docker compose up -d so với 0 của xanh/lam.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Slides</span>
<h2>The whole chapter in 31 slides</h2>
<p class="lead">This project deploys with images: build at home, push to a registry, and the VPS only pulls and swaps. These slides build that pipeline on a lab VPS with Docker running inside it and show, as measurements, the places it breaks silently — a <code>:latest</code> that is never pulled, an image that builds green and dies on start, a CI key that opens a whole shell, two deploys racing, and the requests dropped by every <code>docker compose up -d</code>.</p>
<p>Slides 3–10 belong to Lesson 13.1 (the pipeline, compose.yaml line by line, commit tags, secrets outside the image, restart policies, log and RAM ceilings, the bind-mount inode trap, <code>down -v</code>), 11–16 to 13.2 (building elsewhere, glibc copied onto musl, the restart loop, the pre-push image check, arm64 to amd64, pruning images while keeping a rollback path), 17–22 to 13.3 (the workflow in two pages, a one-command CI key, a pinned known_hosts, what <code>concurrency</code> does and does not do, why this project dropped push-to-deploy) and 23–27 to 13.4 (requests dropped by <code>up -d</code>, <code>--wait</code> and <code>start_interval</code>, blue/green behind nginx, a broken release that never gets traffic, nginx holding an old IP). The last four are the common mistakes, a two-page cheat sheet and a 45-minute practice session. Every terminal is real output recorded on 29/09/2026 in the lab (Docker Desktop on a Mac M1); no workflow was run on the real GitHub.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Slide</span>
<h2>Cả chương trong 31 slide</h2>
<p class="lead">Dự án này deploy bằng ảnh: dựng ở máy nhà, đẩy lên registry, VPS chỉ kéo về và tráo. Bộ slide dựng đúng đường ống đó trên một VPS thí nghiệm có Docker chạy bên trong, rồi cho thấy — dưới dạng phép đo — những chỗ nó hỏng mà không ai thấy: một <code>:latest</code> không bao giờ được kéo, một cái ảnh dựng xanh mà khởi động là chết, một khoá CI mở cả shell, hai lần deploy đua nhau, và số request rơi sau mỗi lần <code>docker compose up -d</code>.</p>
<p>Slide 3–10 thuộc Bài 13.1 (đường ống, compose.yaml từng dòng, tag theo commit, bí mật ngoài ảnh, chính sách restart, trần log và RAM, bẫy inode của bind-mount, <code>down -v</code>), 11–16 thuộc 13.2 (dựng ở máy khác, glibc chép sang musl, vòng restart, chốt kiểm ảnh trước khi đẩy, arm64 sang amd64, dọn ảnh mà vẫn giữ đường lùi), 17–22 thuộc 13.3 (workflow hai trang, khoá CI một-lệnh, known_hosts ghim, <code>concurrency</code> làm gì và không làm gì, vì sao dự án bỏ push-to-deploy) và 23–27 thuộc 13.4 (request rơi khi <code>up -d</code>, <code>--wait</code> và <code>start_interval</code>, xanh/lam sau nginx, bản hỏng không bao giờ nhận request, nginx giữ IP cũ). Bốn slide cuối là những sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Mọi terminal là output THẬT ghi ngày 29/09/2026 trong phòng thí nghiệm (Docker Desktop trên Mac M1); không workflow nào được chạy trên GitHub thật.</p>
</div>
${gallery('dv-13', [
  [1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Một đường ống: build một lần, VPS chỉ tráo'],
  [4, 'compose.yaml của một VPS, từng dòng'], [5, ':latest trỏ bản mới, VPS vẫn chạy bản cũ'], [6, 'Bí mật nằm ngoài ảnh'],
  [7, 'Sau reboot: ai tự dậy, ai nằm im'], [8, 'Log và RAM phải có trần'], [9, 'Sửa nginx.conf bằng mv: container không thấy'],
  [10, 'down giữ dữ liệu; down -v xoá sạch'], [11, 'Build ở máy mạnh, VPS chỉ kéo về'], [12, 'Build xanh, ảnh chết: glibc chép sang musl'],
  [13, 'Restarting (1): cái vòng không ai thấy'], [14, 'Chốt kiểm ảnh: chạy engine trước khi đẩy'], [15, 'Mac arm64 tới VPS amd64'],
  [16, 'Dọn ảnh cũ mà vẫn còn đường lùi'], [17, 'Workflow (1/2): build, chốt kiểm, push'], [18, 'Workflow (2/2): một khoá, một lệnh'],
  [19, 'Khoá CI chỉ chạy được một lệnh'], [20, 'known_hosts ghim'], [21, 'concurrency chỉ xếp hàng trong một nhóm'],
  [22, 'Vì sao dự án bỏ push-to-deploy'], [23, 'docker compose up -d rơi 83–134 request'], [24, '--wait sửa script, không sửa request'],
  [25, 'Xanh/lam sau nginx: 940/940'], [26, 'Bản hỏng không bao giờ nhận request'], [27, 'nginx nhớ IP cũ tới khi reload'],
  [28, 'Sai lầm hay gặp'], [29, 'Bảng tra nhanh (1/2)'], [30, 'Bảng tra nhanh (2/2)'],
  [31, 'Thực hành chương 13'],
])}

`,
    },

    /* ─────────────────────────── 13.1 ─────────────────────────── */
    {
      title: '13.1 — Compose on the VPS: one file that describes the whole machine|||13.1 — Compose trên VPS: một tệp mô tả cả cái máy',
      slug: 'deploy-13-1-compose-tren-vps',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Dựng đúng cái VPS chạy bằng ảnh của dự án — một compose.yaml — rồi đo từng dòng bảo vệ bạn khỏi gì: :latest không được kéo, bí mật lọt vào ảnh, reboot mà web nằm im, log 215 MB trong 4 giây, nginx.conf sửa bằng mv mà container không thấy, và down -v xoá CSDL.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.1</span>
<h2>Compose on the VPS: one file that describes the whole machine</h2>
<p class="lead">Twelve chapters put CODE on the machine with rsync, git and ssh, then swapped a process. This course's own repository no longer works that way: it builds IMAGES at home, pushes them to a registry, and the VPS only pulls and swaps containers. This lesson builds that VPS — one <code>compose.yaml</code> — and measures what each line protects you from: a tag that never moves, a secret baked into an image, a 3 a.m. reboot, a 215 MB log in four seconds, a config file the container cannot see, and a flag that deletes the database.</p>

<h3>From rsync to images: why this chapter exists</h3>
${slide('dv-13', 3, 'Một đường ống: build một lần, VPS chỉ tráo')}
<p>The four steps of Section 0 are unchanged — build the artifact, transport it, swap, verify — only renamed. The artifact is now a <strong>container image</strong>; transport is <code>docker push</code>/<code>docker pull</code> through a <strong>registry</strong>; the swap is <code>docker compose up -d</code>; verification is still an HTTP request to a real route. Chapter 2 (Lesson 2.3) measured the transport: shared layers do not travel again, and the second push was 27 KB. Chapter 6 (Lesson 6.1) measured rolling back to an old image. Chapter 8 measured the cost of building on the VPS itself: parallel <code>next build</code> killed by the OOM killer with exit code 137, and a 7.6 GB build cache on the very disk holding Postgres. This chapter joins those pieces into ONE pipeline you run daily, and measures the places where it breaks without anyone noticing.</p>
<p>A little history so you know what you are using. Docker appeared in 2013 (Section 0). <strong>Compose v1</strong> shipped in 2014, written in Python and invoked as <code>docker-compose</code> with a hyphen. <strong>Compose v2</strong> was announced in 2020, rewritten in Go and invoked as <code>docker compose</code> — a plugin of the <code>docker</code> command itself. File formats 2.x and 3.x were merged into the <strong>Compose Specification</strong>, so the <code>version: "3.8"</code> line at the top is now optional and you can drop it. In 08/2019 GitHub Actions gained CI/CD, and on 01/09/2020 GitHub opened <strong>GHCR</strong> (GitHub Container Registry) — the two pieces this repository uses in 13.2 and 13.3. The lab VPS here runs Docker Engine 29.1.3 and Compose 2.40.3 (Ubuntu 24.04's <code>docker.io</code> + <code>docker-compose-v2</code> packages, as of 09/2026).</p>
<div class="callout">
<p><strong>This chapter does NOT re-teach Dockerfiles or Compose syntax.</strong> Layers, multi-stage builds, networks and volumes at the fundamentals level live in <code>/courses/docker</code>. Here we ask one question: <em>which lines in compose.yaml decide whether a production deploy works or fails?</em></p>
</div>

<h3>A VPS's compose.yaml, line by line</h3>
${slide('dv-13', 4, 'compose.yaml của một VPS, từng dòng')}
<p>This is the file running on the lab VPS for the whole chapter. Three services: <code>api</code> (Node, needs ~1.5 s to connect to the database and open its port), <code>db</code> (PostgreSQL 16) and <code>web</code> (nginx in front). Read it like a shipping manifest: every line is a promise about how this machine behaves when something goes wrong.</p>
<pre><code class="language-yaml">name: dat-lich
services:
  api:
    image: dv13-reg:5000/dat-lich:\${TAG:?chua dat TAG - ghi vao .env}
    env_file: [/home/deploy/bi-mat/api.env]
    restart: unless-stopped
    mem_limit: 256m
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:3000/api/health"]
      interval: 2s
      timeout: 2s
      retries: 3
      start_period: 10s
    logging:
      driver: json-file
      options: { max-size: "1m", max-file: "3" }
    depends_on:
      db: { condition: service_healthy }
  db:
    image: postgres:16-alpine
    env_file: [/home/deploy/bi-mat/db.env]
    restart: unless-stopped
    mem_limit: 512m
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 2s
      retries: 10
  web:
    image: nginx:1.27-alpine
    restart: unless-stopped
    ports: ["127.0.0.1:8080:80"]
    volumes: ["./nginx.conf:/etc/nginx/nginx.conf:ro"]
    depends_on:
      api: { condition: service_healthy }
volumes:
  pgdata:</code></pre>
<table>
<tr><th>Line</th><th>What it does</th><th>Without it (measured below)</th></tr>
<tr><td><code>image: …:\${TAG:?…}</code></td><td>image named after the commit; missing variable ⇒ Compose refuses</td><td>an old <code>:latest</code> is used, new route 404s</td></tr>
<tr><td><code>env_file:</code></td><td>loads secrets at RUN time from a file outside git and outside the image</td><td>secrets in the image history, readable by anyone who can pull it</td></tr>
<tr><td><code>restart: unless-stopped</code></td><td>comes back when dockerd restarts</td><td>default <code>no</code>: after a reboot the site stays down</td></tr>
<tr><td><code>mem_limit</code></td><td>RAM ceiling per service (cgroup, Ch8)</td><td>the ceiling is the whole machine (7.7 GiB here)</td></tr>
<tr><td><code>healthcheck</code></td><td>a command run INSIDE the container that says "I am healthy"</td><td><code>--wait</code> and <code>depends_on</code> cannot tell when it is safe</td></tr>
<tr><td><code>logging.options</code></td><td>rotates the <code>json-file</code> driver's log</td><td>215 MB in 4 s, never cleaned up</td></tr>
<tr><td><code>depends_on: condition: service_healthy</code></td><td>wait until the other service is HEALTHY before starting</td><td>api starts before db, first connection fails</td></tr>
<tr><td><code>volumes: [pgdata:…]</code></td><td>a NAMED volume that survives container re-creation</td><td>data lives in the container's writable layer and dies with it</td></tr>
<tr><td><code>ports: ["127.0.0.1:8080:80"]</code></td><td>loopback only — the host's nginx faces the Internet</td><td><code>0.0.0.0</code>: port exposed, and Docker bypasses ufw (Ch12.3)</td></tr>
<tr><td><code>./nginx.conf:…:ro</code></td><td>config file mounted from the host, read-only</td><td>— (but see the inode trap below)</td></tr>
</table>


<p>Put together, a container on the VPS is assembled from four things living in four places — and each is updated in a different way:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Image</span><span class="lz-lnote">code + runtime, immutable, from the registry; changed via TAG in <code>.env</code> + <code>up -d</code></span></div>
<div class="lz-layer"><span class="lz-lname">env_file</span><span class="lz-lnote">per-machine secrets and config, a file on the VPS; changing it requires re-creating the container</span></div>
<div class="lz-layer"><span class="lz-lname">Bind mount</span><span class="lz-lnote">host config files (nginx.conf); changed by overwriting in place and reloading — pushing an image never touches it</span></div>
<div class="lz-layer"><span class="lz-lname">Named volume</span><span class="lz-lnote">data (Postgres); survives every swap; only <code>down -v</code> deletes it</span></div>
</div>

<h3>Run it step by step on the lab VPS</h3>
<p>The chapter's lab VPS is an Ubuntu 24.04 container with sshd <em>and Docker running inside it</em> (Docker-in-Docker), so you SSH in and type <code>docker compose</code> exactly as on a rented VPS. The local registry is <code>registry:2</code>. Everything sits on a private network <code>dv13-net</code>, labelled <code>dvhoc=13</code>, listening only on the Mac's loopback:</p>
<pre><code class="language-bash"># tren may dev (Mac): anh "VPS" = ubuntu:24.04 + openssh-server + docker.io + docker-compose-v2
docker network create --label dvhoc=13 dv13-net
docker run -d --name dv13-reg --label dvhoc=13 --network dv13-net \\
  -p 127.0.0.1:19135:5000 registry:2
docker volume create --label dvhoc=13 dv13-vps-docker
docker run -d --name dv13-vps --hostname vps --label dvhoc=13 --network dv13-net \\
  --privileged --memory 2g -v dv13-vps-docker:/var/lib/docker \\
  -p 127.0.0.1:19132:22 dv13-img
ssh -i khoa -o UserKnownHostsFile=./known_hosts -p 19132 deploy@127.0.0.1</code></pre>
<p>The first two attempts failed — and both errors are worth knowing if you rebuild this lab yourself:</p>
<div class="out"># lan 1 — /var/lib/docker nam tren overlay cua chinh container:
Error response from daemon: failed to mount /tmp/containerd-mount3278531432: mount source: "overlay", … err: invalid argument
# lan 2 — da gan volume cho /var/lib/docker, nhung cgroup v2 long nhau chua chia:
Error response from daemon: … unable to apply cgroup configuration: cannot enter cgroupv2 "/sys/fs/cgroup/docker" with domain controllers -- it is in an invalid state</div>
<p>First error: the inner Docker's data directory sat on the outer container's overlayfs, and the kernel does not stack overlay on overlay. The fix is a volume on <code>/var/lib/docker</code> (volumes live on the VM's ext4). Second error: with cgroup v2, the inner dockerd must move existing processes into a child group before it can enable controllers — exactly what the entrypoint of the official <code>docker:dind</code> image does. Copy those three lines into the start script and it works:</p>
<div class="out">$ time docker compose up -d
 Network dat-lich_default  Created
 Container dat-lich-db-1  Created
 Container dat-lich-api-1  Created
 Container dat-lich-web-1  Created
 Container dat-lich-db-1  Started
 Container dat-lich-db-1  Waiting
 Container dat-lich-db-1  Healthy
 Container dat-lich-api-1  Started
 Container dat-lich-api-1  Waiting
 Container dat-lich-api-1  Healthy
 Container dat-lich-web-1  Started
real	0m8.939s
$ docker compose ps
NAME             IMAGE                            SERVICE   STATUS
dat-lich-api-1   dv13-reg:5000/dat-lich:2374533   api       Up 5 seconds (healthy)
dat-lich-db-1    postgres:16-alpine               db        Up 8 seconds (healthy)
dat-lich-web-1   nginx:1.27-alpine                web       Up Less than a second</div>
<p>Nine seconds from nothing to three running services, and the order in the output is <code>depends_on</code> at work: <code>db</code> Healthy before <code>api</code> Started; <code>api</code> Healthy before <code>web</code> Started.</p>

<h3>Pin the tag to a commit, never :latest</h3>
${slide('dv-13', 5, ':latest trỏ bản mới, VPS vẫn chạy bản cũ')}
<p>The <code>image:</code> line contains a variable, and the variable is mandatory. Compose's <code>\${TAG:?message}</code> is the same as bash's: empty or unset means stop with that message. Measured:</p>
<div class="out">$ mv .env .env.bak &amp;&amp; docker compose up -d
error while interpolating services.api.image: required variable TAG is missing a value: chua dat TAG - ghi vao .env
ma thoat 1
$ docker compose config --images
nginx:1.27-alpine
dv13-reg:5000/dat-lich:2374533
postgres:16-alpine</div>
<p>Why be this strict? Because the alternative — <code>image: …:latest</code> — fails in the quietest possible way. On the lab VPS, <code>dat-lich:latest</code> already existed (it was v1). The build machine pushed a NEW <code>:latest</code> (v5, with a <code>/api/phong-kham</code> route) to the registry. Deploy as usual:</p>
<div class="out"># may dung vua day dat-lich:latest = v5 (co /api/phong-kham)
$ docker compose up -d --wait api      # TAG=latest
 Container dat-lich-api-1  Healthy
$ curl …/api/ban
v1
$ smoke-test
  /api/lich        -&gt; 401
  /api/phong-kham  -&gt; 404
$ docker compose pull api &amp;&amp; docker compose up -d --wait api
 api Pulling
 api Pulled
 Container dat-lich-api-1  Healthy
$ curl …/api/ban
v5
$ smoke-test
  /api/lich        -&gt; 401
  /api/phong-kham  -&gt; 401</div>
<p><code>docker compose up -d</code> saw that <code>:latest</code> was already on disk and <strong>did not pull</strong>. The container is healthy, the command is green, and the machine is running v1. Only the smoke test — calling a route that ONLY the new version has — exposes it: <code>404</code>. This is exactly the project's 02/07 incident (a <code>--no-build</code> deploy that rsynced but did not rebuild, new route 404), this time with containers. When the tag is the commit ID, the name in <code>.env</code> changes on every deploy, Compose MUST have exactly that image (pull it, or fail loudly), and <code>docker ps</code> tells you which commit is running.</p>
<div class="callout warn">
<p><strong>Tags can still move.</strong> A commit tag is a convention, not a guarantee: anyone with push rights can overwrite <code>:2bed0bb</code>. Chapter 2 (Lesson 2.3) measured that and concluded: tags for humans, <strong>digests</strong> (content hashes) for machines. Lesson 13.2 records the digest of every image that goes live.</p>
</div>

<h3>Secrets live outside the image: env_file, .env and ARG</h3>
${slide('dv-13', 6, 'Bí mật nằm NGOÀI ảnh, không trong Dockerfile')}
<p>Beginners write the password into the Dockerfile "for convenience". Here is the price, measured on a four-line image:</p>
<pre><code class="language-dockerfile">FROM alpine:3.20
ARG DB_PASS
ENV JWT_SECRET=xxxx
RUN echo "ket noi bang $DB_PASS" &gt; /dev/null
CMD ["true"]</code></pre>
<div class="out">$ docker build --build-arg DB_PASS=12345 -t dv13-ro .
$ docker history --no-trunc --format "{{.CreatedBy}}" dv13-ro | head -3
CMD ["true"]
RUN |1 DB_PASS=12345 /bin/sh -c echo "ket noi bang $DB_PASS" &gt; /dev/null # buildkit
ENV JWT_SECRET=xxxx
$ docker inspect -f "{{.Config.Env}}" dv13-ro
[PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin JWT_SECRET=xxxx]</div>
<p><code>ENV</code> sits in the image configuration; an <code>ARG</code> used in a <code>RUN</code> sits verbatim in the layer history. Anyone who can pull the image — a teammate, a CI runner, a leaked registry token — reads both with one command. Changing the password afterwards does not erase it: the old layer is still in the registry. (BuildKit has <code>RUN --mount=type=secret</code> for secrets needed at BUILD time; see <code>/courses/docker</code>.)</p>
<p>The place for RUN-time secrets is <code>env_file:</code> — a file on the VPS, <code>chmod 600</code>, outside git, loaded into the container at start. Do not confuse it with the <code>.env</code> file next to <code>compose.yaml</code>:</p>
<table>
<tr><th></th><th><code>.env</code> next to compose.yaml</th><th><code>env_file:</code> inside a service</th></tr>
<tr><td>who reads it</td><td>Compose itself, to SUBSTITUTE variables in the file (<code>\${TAG}</code>)</td><td>the container, as the process's environment</td></tr>
<tr><td>enters the container?</td><td>NO</td><td>yes</td></tr>
<tr><td>should hold</td><td>tag, project name, ports — nothing secret</td><td>DB password, JWT key, API keys</td></tr>
</table>
<div class="out">$ docker compose config | grep -A3 "environment:"
    environment:
      DATABASE_URL: postgres://app:12345@db:5432/app
      JWT_SECRET: xxxx
    healthcheck:</div>
<div class="pitfall co-tieu-de">
<p><strong>Trap — <code>docker compose config</code> prints secrets.</strong> It is handy for seeing the file after substitution, and it prints every value from <code>env_file</code> too. Running it in a CI step with public logs publishes your password. To see which images will run, use <code>docker compose config --images</code>, which prints only image names.</p>
</div>

<h3>restart: who comes back after a reboot</h3>
${slide('dv-13', 7, 'Sau reboot: ai tự dậy, ai nằm im')}
<p>The VPS provider does hardware maintenance at 3 a.m. and the machine reboots. Which containers come back? Measured with five containers and a dockerd restart (for containers, that is what a reboot does):</p>
<div class="out"># 5 container alpine: restart no / unless-stopped / always, cong hai cai da "docker stop" bang tay
# roi khoi dong lai dockerd (nhu VPS vua reboot)
$ docker ps -a --filter name=r- --format "table {{.Names}}\\t{{.Status}}"
NAMES              STATUS
r-al-dung          Up 4 seconds
r-us-dung          Exited (137) 2 minutes ago
r-always           Up 4 seconds
r-unless-stopped   Up 4 seconds
r-no               Exited (137) 2 minutes ago
$ docker compose ps --format "{{.Service}} {{.Status}}"
api Up 5 seconds (health: starting)
db Up 5 seconds (healthy)
web Up 5 seconds</div>
<table>
<tr><th><code>restart:</code></th><th>running at reboot</th><th>previously stopped by hand</th></tr>
<tr><td><code>no</code> — DEFAULT</td><td>stays down</td><td>stays down</td></tr>
<tr><td><code>unless-stopped</code></td><td>comes back</td><td>stays down — respects your decision</td></tr>
<tr><td><code>always</code></td><td>comes back</td><td><strong>comes back</strong> even though you stopped it</td></tr>
<tr><td><code>on-failure</code></td><td>only if the process exited non-zero</td><td>stays down</td></tr>
</table>
<p>The default is <code>no</code>. Forget one line and after the first reboot the site is dead until you wake up — no error, no log, just <code>Exited (137)</code>. <code>unless-stopped</code> suits nearly every service on a VPS: it returns after a reboot, but if you deliberately stop a service to fix it, it does not restart behind your back the way <code>always</code> does.</p>
<p>Note the last lines: after dockerd restarted, all three services came up <strong>at the same time</strong> (Up 5 seconds each). The <code>depends_on</code> order applies only when <em>you</em> run <code>docker compose up</code>; dockerd restarting containers does not read compose.yaml. So the app must still retry its database connection a few times at start instead of dying on the first attempt.</p>

<h3>Logs and RAM need a ceiling</h3>
${slide('dv-13', 8, 'Log và RAM phải có trần')}
<div class="out"># "yes" in log dung 4 giay; on-co chay voi --log-opt max-size=1m --log-opt max-file=3
== on-khong
215M 6f35abdfc1d50db06b17e63c9b4e052033376a05b5f5dcde186379d78e1c6360-json.log
== on-co
655K 91c1da6ca62080a879df8415fdad9424f63fa818fd92a2f188f141043707a1df-json.log
977K 91c1da6ca62080a879df8415fdad9424f63fa818fd92a2f188f141043707a1df-json.log.1
977K 91c1da6ca62080a879df8415fdad9424f63fa818fd92a2f188f141043707a1df-json.log.2
$ docker stats --no-stream --format "table {{.Name}}\\t{{.MemUsage}}"
NAME             MEM USAGE / LIMIT
dat-lich-api-1   20.5MiB / 256MiB
dat-lich-web-1   2.281MiB / 7.748GiB
dat-lich-db-1    31.11MiB / 512MiB</div>
<p>Docker's default log driver, <code>json-file</code>, writes every stdout/stderr line of the container to a file and <strong>never rotates it</strong> unless told to. An error loop that logs — very common when the database is down and the app retries constantly — wrote 215 MB in four seconds here. Chapter 8 (Lesson 8.4) measured exactly this file filling Postgres's disk. <code>max-size</code> + <code>max-file</code> keep it under 3 MB per container; <code>docker compose logs</code> still reads the rotated files.</p>
<p>And RAM: the <code>web</code> service declares no <code>mem_limit</code>, so its ceiling is the whole machine — 7.748 GiB (the Docker Desktop VM the lab VPS sees). On the project's 6 GB VPS, a leaking service without a ceiling drags the OOM killer into other services, sometimes Postgres itself (Ch8.2). With <code>mem_limit</code>, the kill stays inside that service's cgroup, and <code>docker inspect</code> records <code>OOMKilled: true</code> on exactly that container.</p>
<div class="callout">
<p><strong>Both can be set machine-wide</strong> in <code>/etc/docker/daemon.json</code> (<code>"log-opts": {"max-size": "10m", "max-file": "3"}</code>), but that applies only to containers CREATED after dockerd restarts. In compose.yaml it travels with the project and is there on a new machine.</p>
</div>

<h3>Bind-mounted config lives OUTSIDE the image — and the inode trap</h3>
${slide('dv-13', 9, 'Sửa nginx.conf bằng mv: container không thấy')}
<p><code>nginx.conf</code> is in no image: it is <strong>bind-mounted</strong> (a host file mounted into the container). That has two consequences, and each cost the project an evening. First: pushing a new image <strong>does not touch it</strong>. In 08/2026 it turned out <code>deploy-nha.sh</code> had never deployed a single nginx change — everything "deployed successfully" while the new config sat on the build machine — because the script only pushed images, and bind-mounted files need their own sync. The second consequence is subtler, and here is the measurement:</p>
<div class="out">$ (so van tay: tren may chu va trong container)
  may chu : 594c96609a32  inode 169253
  web     : 594c96609a32
$ cp /tmp/nginx.moi nginx.conf.tam &amp;&amp; mv nginx.conf.tam nginx.conf
  may chu : 2531e4327f82  inode 169336
  web     : 594c96609a32
$ docker compose exec web nginx -t &amp;&amp; docker compose exec web nginx -s reload
nginx: configuration file /etc/nginx/nginx.conf test is successful
2026/09/29 08:03:27 [notice] 48#48: signal process started
$ curl -s -o /dev/null -w "%{http_code}" 127.0.0.1:8080/conf
404
$ docker compose up -d web
 Container dat-lich-web-1  Running
$ curl … /conf
404
# --- cach dung: ghi DE TAI CHO, giu inode ---
$ docker compose restart web
 Container dat-lich-web-1  Started
$ sed -i s/conf-moi/conf-moi-2/ /tmp/nginx.moi &amp;&amp; cat /tmp/nginx.moi &gt; nginx.conf
  may chu : e7b1e23f3cd5  inode 169336
  web     : e7b1e23f3cd5
$ docker compose exec web nginx -s reload
2026/09/29 08:03:30 [notice] 28#28: signal process started
$ sleep 1; curl -s 127.0.0.1:8080/conf
conf-moi-2</div>
<p>Docker mounts a <em>single file</em> by its <strong>inode</strong> (the file's number in the filesystem) at container start, not by its path. <code>mv</code> does not modify the old file; it points the name <code>nginx.conf</code> at a NEW inode (169253 → 169336). The container still holds the old one. So <code>nginx -t</code> checks the OLD file (valid!), <code>reload</code> reloads the OLD file, and <code>docker compose up -d web</code> sees an unchanged compose.yaml, answers "Running" and does nothing. Every command reports success. That is exactly the 25/08 incident: the nginx sync step reported OK on two deploys in a row while HTTP/2 stayed off.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — every "safe" tool replaces the inode.</strong> <code>mv</code>, <code>sed -i</code>, <code>rsync</code>, vim's <code>:w</code>, copy-to-temp-then-rename — all write a new file and rename, because that is safer if power fails midway. With a single-file bind mount, that very safety blinds the container. Overwrite IN PLACE (<code>cat new &gt; nginx.conf</code> keeps the inode), and verify with sha256 <strong>from inside</strong> the container, not with <code>cat</code> on the host.</p>
</div>
<p>The sturdier fix is not to mount a single file: mount a <strong>directory</strong>. Measured on Lesson 13.4's blue/green project (<code>./nginx</code> mounted on <code>/etc/nginx/conf.d</code>):</p>
<div class="out"># thu muc ./nginx gan vao /etc/nginx/conf.d — thay tep bang mv:
$ mv /tmp/x.inc nginx/dang-chay.inc.tam &amp;&amp; mv nginx/dang-chay.inc.tam nginx/dang-chay.inc
$ sha256sum nginx/dang-chay.inc | cut -c1-12
c13ebee9d1d0
$ docker compose exec -T web sha256sum /etc/nginx/conf.d/dang-chay.inc | cut -c1-12
c13ebee9d1d0</div>
<p>With a directory, the container sees names inside it, so <code>mv</code> shows up immediately. <code>docker compose restart web</code> also fixes it (it re-mounts by path) — but restarting nginx drops requests, which Lesson 13.4 is trying to avoid.</p>

<h3>Named volumes, and the -v flag</h3>
${slide('dv-13', 10, 'down giữ dữ liệu; down -v xoá sạch')}
<div class="out">$ docker compose exec db psql -U app -Atc "select count(*) from lich"
1
$ docker compose down
 Container dat-lich-db-1  Removed
 Network dat-lich_default  Removing
 Network dat-lich_default  Removed
$ docker volume ls --format "{{.Name}}"
dat-lich_pgdata
$ docker compose up -d --wait
  (ma thoat 0)
$ … select count(*) from lich
1
$ docker compose down -v
 Volume dat-lich_pgdata  Removing
 Volume dat-lich_pgdata  Removed
$ docker compose up -d --wait &amp;&amp; … select count(*) from lich
ERROR:  relation "lich" does not exist</div>
<p>Postgres data lives in the NAMED volume <code>dat-lich_pgdata</code>. It survives <code>down</code>, container re-creation, and upgrading the Postgres image to a new patch release. But <code>docker compose down -v</code> deletes every named volume of the project without asking. One "clean up properly" line in a deploy script and the database is gone. And remember: the volume sits on the SAME VPS disk, so it is not a backup — backups are Chapter 10.</p>
<table>
<tr><th>Command</th><th>Containers</th><th>Network</th><th>Named volumes</th><th>Images</th></tr>
<tr><td><code>docker compose stop</code></td><td>stopped, kept</td><td>kept</td><td>kept</td><td>kept</td></tr>
<tr><td><code>docker compose down</code></td><td>removed</td><td>removed</td><td>kept</td><td>kept</td></tr>
<tr><td><code>docker compose down -v</code></td><td>removed</td><td>removed</td><td><strong>REMOVED</strong></td><td>kept</td></tr>
<tr><td><code>docker compose down --rmi all</code></td><td>removed</td><td>removed</td><td>kept</td><td>removed — no rollback path (13.2)</td></tr>
</table>

<h3>docker compose up -d --no-build &lt;service&gt;: swap ONE service</h3>
<p>The daily deploy command touches only the service that changes. <code>--no-build</code> tells Compose never to build by itself (the VPS has no source and no build tools — images must come from the registry). The service name at the end limits re-creation to it:</p>
<div class="out">$ sed -i "s/^TAG=.*/TAG=241f233/" .env
$ docker compose up -d --no-build api
 api Pulled
 Container dat-lich-db-1  Running
 Container dat-lich-api-1  Recreate
 Container dat-lich-api-1  Recreated
 Container dat-lich-db-1  Healthy
 Container dat-lich-api-1  Started
(1163 ms)
$ docker compose ps --format "table {{.Service}}\\t{{.Image}}\\t{{.Status}}"
SERVICE   IMAGE                            STATUS
api       dv13-reg:5000/dat-lich:241f233   Up Less than a second (health: starting)
db        postgres:16-alpine               Up 34 seconds (healthy)
web       nginx:1.27-alpine                Up 25 seconds
$ curl -s -o /dev/null -w '%{http_code}\\n' 127.0.0.1:8080/api/ban
502</div>
<p><code>db</code> is "Running" — untouched. Only <code>api</code> is "Recreate"d. But look at the last line: the command returned after 1.2 s, and right after it nginx answered <strong>502</strong> because the new api was not listening yet. Compose re-creates a container in the order <em>stop the old one, then create the new one</em>. Lesson 13.4 measures how many requests that gap swallows, and how to close it.</p>

<h3>What differs on Windows/WSL and macOS</h3>
<ul>
<li><strong>CRLF in <code>.env</code> and <code>env_file</code>: Compose strips <code>\\r</code>.</strong> Measured (a teammate saved the file from Notepad):
<div class="out">$ printf "TAG=72f5fb8\\r\\n" &gt; .env
$ docker compose config --images | cat -A
dv13-reg:5000/dat-lich:72f5fb8$
postgres:16-alpine$
nginx:1.27-alpine$
$ printf "…\\r\\nJWT_SECRET=xxxx\\r\\n" &gt; ~/bi-mat/api.env &amp;&amp; docker compose up -d --wait api
$ docker compose exec -T api sh -c 'printf %s "$JWT_SECRET" | od -c | head -1'
0000000   x   x   x   x</div>
<code>.env</code>, <code>env_file</code> and <code>docker run --env-file</code> all yield exactly 4 characters. A deploy <em>script</em> saved with CRLF still breaks on the VPS as Chapter 7 measured — keep <code>* text=auto eol=lf</code> in <code>.gitattributes</code>.</li>
<li><strong>Docker Desktop on Mac and Windows is a Linux VM.</strong> Containers on your laptop do not use the VPS's disk, network or CPU; timings here are only for relative comparison. And bind mounts on Mac/Windows go through a file-sharing layer — measure the inode trap on Linux (here: inside the lab VPS), not on the laptop.</li>
<li><strong>An old VPS may only have <code>docker-compose</code> (v1, Python).</strong> It does not understand everything in the Compose Specification and is no longer developed. On Ubuntu 24.04 install <code>docker-compose-v2</code> (or the plugin from Docker's repository) and type <code>docker compose</code>, no hyphen.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the night before your SWP391 defence, your team deploys with <code>image: …:latest</code>, <code>docker compose up -d</code> is green, and the committee clicks the new feature and gets 404. A teammate also just edited <code>nginx.conf</code> with <code>sed -i</code> and "it had no effect". Reproduce both on the lab VPS and fix them properly.</p>
<ol>
<li>Build the lab VPS with Docker (commands above) and run the <code>dat-lich</code> project with <code>TAG=</code> a commit ID. Record <code>docker compose ps</code>.</li>
<li>Switch to <code>TAG=latest</code> with an old <code>:latest</code> on disk, push a new <code>:latest</code> to the registry, run <code>up -d</code>, and call a route only the new version has. Record the status code, then fix it with a commit tag.</li>
<li>Edit <code>nginx.conf</code> with <code>sed -i</code> and compare sha256 on the host with <code>docker compose exec web sha256sum /etc/nginx/nginx.conf</code>. Redo it with <code>cat … &gt; nginx.conf</code> and compare again.</li>
<li>Add <code>restart: unless-stopped</code>, <code>mem_limit</code> and <code>logging.options</code> to all three services; restart dockerd and see which services return.</li>
</ol>
<p><strong>Done when:</strong> you can show a green <code>up -d</code> whose new route 404s (and the fixed run that returns 401/200), two sha256 values that DIFFER and then MATCH between host and container, and a <code>docker compose ps</code> after the dockerd restart showing all three services Up without you typing anything.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Compose file</span><span class="v">A YAML file describing a project’s services, networks and volumes; <code>docker compose</code> turns it into containers.</span></div>
  <div class="kv"><span class="k">Image tag</span><span class="v">A readable name for an image such as <code>:2bed0bb</code>; it can move, so it is only a convention.</span></div>
  <div class="kv"><span class="k">Interpolation</span><span class="v">Compose replaces <code>\${TAG}</code> with values from <code>.env</code>/the environment before running; <code>\${TAG:?}</code> makes it mandatory.</span></div>
  <div class="kv"><span class="k">env_file</span><span class="v">A file loaded into the container at run time — the place for secrets, outside git and outside the image.</span></div>
  <div class="kv"><span class="k">Restart policy</span><span class="v">The rule dockerd uses to bring containers back: <code>no</code>, <code>on-failure</code>, <code>unless-stopped</code>, <code>always</code>.</span></div>
  <div class="kv"><span class="k">Log rotation</span><span class="v">Cutting the log file at a size limit and keeping only the last few files.</span></div>
  <div class="kv"><span class="k">Bind mount</span><span class="v">A host file or directory mounted into a container; it lives OUTSIDE the image, and a single file is mounted by inode.</span></div>
  <div class="kv"><span class="k">Named volume</span><span class="v">Docker-managed storage that survives container re-creation; <code>down -v</code> deletes it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A VPS’s <code>compose.yaml</code> is a manifest of how the machine behaves under trouble: tag, secrets, restart, RAM/log ceilings, healthcheck, volumes.</li>
<li>Commit tags + <code>\${TAG:?}</code>: a missing tag is refused; a <code>:latest</code> already on disk is not pulled and the machine runs the old version (new route 404).</li>
<li>Secrets in <code>ENV</code>/<code>ARG</code> stay in the image forever; they belong in an <code>env_file</code> outside git — and <code>compose config</code> prints them.</li>
<li><code>restart</code> defaults to <code>no</code>: after a reboot the site stays down; <code>unless-stopped</code> returns after reboot but respects a manual stop.</li>
<li>Without ceilings, logs grow 215 MB in four seconds and one service’s RAM limit is the whole machine.</li>
<li>Bind-mounted files live outside the image and a single file is mounted by inode: <code>mv</code>/<code>sed -i</code> blind the container; overwrite in place or mount a directory; <code>down -v</code> deletes the database.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — History and development of Docker Compose</span><span class="lc-sub">docs.docker.com/compose/intro/history/ — v1 (Python, 2014), v2 (Go, announced 2020), the Compose Specification and why <code>version</code> is now optional.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Compose file reference — services</span><span class="lc-sub">docs.docker.com/reference/compose-file/services/ — <code>restart</code>, <code>healthcheck</code>, <code>depends_on</code>, <code>env_file</code>, <code>logging</code>, <code>mem_limit</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — Start containers automatically</span><span class="lc-sub">docs.docker.com/engine/containers/start-containers-automatically/ — the four restart policies and how each treats a container you stopped by hand.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — JSON File logging driver</span><span class="lc-sub">docs.docker.com/engine/logging/drivers/json-file/ — <code>max-size</code>, <code>max-file</code>, and no rotation by default.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — Bind mounts</span><span class="lc-sub">docs.docker.com/engine/storage/bind-mounts/ — host files and directories mounted into containers.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — III. Config</span><span class="lc-sub">12factor.net/config — configuration lives in the environment, not in code or images.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — the full course</span><span class="lc-sub">/courses/docker/learn${REF} — Dockerfiles, Compose, networks and volumes at the fundamentals level. This lesson is only its "running on a VPS" slice.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.1</span>
<h2>Compose trên VPS: một tệp mô tả cả cái máy</h2>
<p class="lead">Mười hai chương trước đưa MÃ lên máy bằng rsync, git và ssh, rồi tráo một tiến trình. Kho mã của chính khoá này thì không làm vậy nữa: nó dựng ẢNH ở máy nhà, đẩy lên registry, và VPS chỉ kéo về rồi tráo container. Bài này dựng đúng cái VPS đó — một tệp <code>compose.yaml</code> — rồi đo từng dòng trong nó bảo vệ bạn khỏi cái gì: một tag đứng yên, một bí mật lọt vào ảnh, một lần khởi động lại lúc 3 giờ sáng, một tệp log 215 MB trong 4 giây, một tệp cấu hình mà container không nhìn thấy, và một cái cờ xoá sạch cơ sở dữ liệu.</p>

<h3>Từ rsync tới ảnh: vì sao chương này tồn tại</h3>
${slide('dv-13', 3, 'Một đường ống: build một lần, VPS chỉ tráo')}
<p>Bốn bước của Mục 0 vẫn y nguyên — làm tạo tác, vận chuyển, tráo, kiểm — chỉ đổi tên. Tạo tác (artifact — thứ được gửi đi) giờ là một <strong>ảnh container</strong>; vận chuyển là <code>docker push</code>/<code>docker pull</code> qua một <strong>registry</strong> (kho ảnh); tráo là <code>docker compose up -d</code>; kiểm vẫn là một request HTTP vào một route thật. Chương 2 (Bài 2.3) đã đo phần vận chuyển: lớp trùng không đi lại, lần đẩy thứ hai chỉ 27 KB. Chương 6 (Bài 6.1) đã đo cú lùi bằng ảnh cũ. Chương 8 đã đo cái giá của việc dựng ngay trên VPS: <code>next build</code> song song bị kẻ giết OOM kết liễu với mã 137, và cache build phình 7,6 GB trên chính cái đĩa chứa Postgres. Chương này nối những mảnh đó thành MỘT đường ống chạy hằng ngày, và đo những chỗ đường ống ấy hỏng mà không ai thấy.</p>
<p>Một chút lịch sử để biết mình đang dùng cái gì. Docker ra đời năm 2013 (Mục 0 đã kể). <strong>Compose v1</strong> ra năm 2014, viết bằng Python, gọi bằng lệnh <code>docker-compose</code> có gạch nối. <strong>Compose v2</strong> được công bố năm 2020, viết lại bằng Go và gọi bằng <code>docker compose</code> — một plugin của chính lệnh <code>docker</code>. Các định dạng tệp 2.x và 3.x được gộp thành <strong>Compose Specification</strong>, nên dòng <code>version: "3.8"</code> ở đầu tệp giờ là tuỳ chọn, bạn có thể bỏ. Tháng 08/2019 GitHub Actions thêm CI/CD, và ngày 01/09/2020 GitHub mở <strong>GHCR</strong> (GitHub Container Registry) — hai mảnh mà kho mã này dùng cho bài 13.2 và 13.3. VPS thí nghiệm của bài chạy Docker Engine 29.1.3 và Compose 2.40.3 (gói <code>docker.io</code> + <code>docker-compose-v2</code> của Ubuntu 24.04, tính đến 09/2026).</p>
<div class="callout">
<p><strong>Chương này KHÔNG dạy lại Dockerfile hay cú pháp Compose.</strong> Lớp, bản dựng nhiều tầng, mạng và volume ở mức nền tảng nằm ở <code>/courses/docker</code>. Ở đây ta chỉ hỏi một câu: <em>những dòng nào trong compose.yaml quyết định chuyện một lần deploy lên production thành hay hỏng?</em></p>
</div>

<h3>Tệp compose.yaml của một VPS, từng dòng</h3>
${slide('dv-13', 4, 'compose.yaml của một VPS, từng dòng')}
<p>Đây là tệp đang chạy trên VPS thí nghiệm của cả chương. Ba dịch vụ: <code>api</code> (Node, cần ~1,5 giây để nối cơ sở dữ liệu và mở cổng), <code>db</code> (PostgreSQL 16) và <code>web</code> (nginx đứng trước). Đọc nó như một bản kê hàng hoá: mỗi dòng là một lời hứa về cách máy này cư xử khi có chuyện.</p>
<pre><code class="language-yaml">name: dat-lich
services:
  api:
    image: dv13-reg:5000/dat-lich:\${TAG:?chua dat TAG - ghi vao .env}
    env_file: [/home/deploy/bi-mat/api.env]
    restart: unless-stopped
    mem_limit: 256m
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:3000/api/health"]
      interval: 2s
      timeout: 2s
      retries: 3
      start_period: 10s
    logging:
      driver: json-file
      options: { max-size: "1m", max-file: "3" }
    depends_on:
      db: { condition: service_healthy }
  db:
    image: postgres:16-alpine
    env_file: [/home/deploy/bi-mat/db.env]
    restart: unless-stopped
    mem_limit: 512m
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 2s
      retries: 10
  web:
    image: nginx:1.27-alpine
    restart: unless-stopped
    ports: ["127.0.0.1:8080:80"]
    volumes: ["./nginx.conf:/etc/nginx/nginx.conf:ro"]
    depends_on:
      api: { condition: service_healthy }
volumes:
  pgdata:</code></pre>
<table>
<tr><th>Dòng</th><th>Làm gì</th><th>Thiếu nó thì (đo ở dưới)</th></tr>
<tr><td><code>image: …:\${TAG:?…}</code></td><td>ảnh mang tên là mã commit; thiếu biến thì compose từ chối</td><td>kéo nhầm <code>:latest</code> cũ, route mới 404</td></tr>
<tr><td><code>env_file:</code></td><td>nạp bí mật lúc CHẠY từ một tệp ngoài git, ngoài ảnh</td><td>bí mật nằm trong lịch sử ảnh, ai kéo được ảnh là đọc được</td></tr>
<tr><td><code>restart: unless-stopped</code></td><td>tự dậy khi dockerd khởi động lại</td><td>mặc định <code>no</code>: VPS reboot là web nằm im</td></tr>
<tr><td><code>mem_limit</code></td><td>trần RAM cho TỪNG dịch vụ (cgroup, Ch8)</td><td>giới hạn = cả máy (7,7 GiB ở đây)</td></tr>
<tr><td><code>healthcheck</code></td><td>lệnh chạy BÊN TRONG container để nói "tôi khoẻ"</td><td><code>--wait</code> và <code>depends_on</code> không biết lúc nào an toàn</td></tr>
<tr><td><code>logging.options</code></td><td>xoay vòng log của driver <code>json-file</code></td><td>215 MB trong 4 giây, không bao giờ dọn</td></tr>
<tr><td><code>depends_on: condition: service_healthy</code></td><td>đợi dịch vụ kia KHOẺ rồi mới khởi động</td><td>api lên trước db, lần kết nối đầu tiên hỏng</td></tr>
<tr><td><code>volumes: [pgdata:…]</code></td><td>volume CÓ TÊN, sống qua việc tạo lại container</td><td>dữ liệu nằm trong lớp ghi của container, mất khi tạo lại</td></tr>
<tr><td><code>ports: ["127.0.0.1:8080:80"]</code></td><td>chỉ nghe loopback — nginx trên máy mới ra Internet</td><td><code>0.0.0.0</code>: cổng lộ ra ngoài, và Docker vượt mặt ufw (Ch12.3)</td></tr>
<tr><td><code>./nginx.conf:…:ro</code></td><td>tệp cấu hình gắn từ máy chủ vào, chỉ đọc</td><td>— (nhưng xem bẫy inode ở dưới)</td></tr>
</table>


<p>Gom lại, một container trên VPS được ghép từ bốn thứ sống ở bốn nơi khác nhau — và mỗi nơi được cập nhật bằng một cách khác nhau:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Ảnh (image)</span><span class="lz-lnote">mã + runtime, bất biến, tới từ registry; đổi bằng TAG trong <code>.env</code> + <code>up -d</code></span></div>
<div class="lz-layer"><span class="lz-lname">env_file</span><span class="lz-lnote">bí mật và cấu hình theo máy, tệp trên VPS; đổi thì phải tạo lại container</span></div>
<div class="lz-layer"><span class="lz-lname">Bind-mount</span><span class="lz-lnote">tệp cấu hình của máy chủ (nginx.conf); đổi bằng cách ghi ĐÈ tại chỗ rồi reload — đẩy ảnh không đụng tới</span></div>
<div class="lz-layer"><span class="lz-lname">Volume có tên</span><span class="lz-lnote">dữ liệu (Postgres); sống qua mọi lần tráo; chỉ <code>down -v</code> mới xoá</span></div>
</div>

<h3>Chạy thử từng bước trên VPS thí nghiệm</h3>
<p>VPS thí nghiệm của chương là một container Ubuntu 24.04 có sshd <em>và Docker chạy bên trong nó</em> (Docker-in-Docker), để bạn SSH vào rồi gõ <code>docker compose</code> y như trên một VPS thuê. Registry cục bộ là <code>registry:2</code>. Mọi thứ nằm trên mạng riêng <code>dv13-net</code>, nhãn <code>dvhoc=13</code>, và chỉ nghe loopback của Mac:</p>
<pre><code class="language-bash"># tren may dev (Mac): anh "VPS" = ubuntu:24.04 + openssh-server + docker.io + docker-compose-v2
docker network create --label dvhoc=13 dv13-net
docker run -d --name dv13-reg --label dvhoc=13 --network dv13-net \\
  -p 127.0.0.1:19135:5000 registry:2
docker volume create --label dvhoc=13 dv13-vps-docker
docker run -d --name dv13-vps --hostname vps --label dvhoc=13 --network dv13-net \\
  --privileged --memory 2g -v dv13-vps-docker:/var/lib/docker \\
  -p 127.0.0.1:19132:22 dv13-img
ssh -i khoa -o UserKnownHostsFile=./known_hosts -p 19132 deploy@127.0.0.1</code></pre>
<p>Hai lần đầu dựng, nó hỏng — và cả hai lỗi đáng biết nếu bạn tự làm lại phòng thí nghiệm này:</p>
<div class="out"># lan 1 — /var/lib/docker nam tren overlay cua chinh container:
Error response from daemon: failed to mount /tmp/containerd-mount3278531432: mount source: "overlay", … err: invalid argument
# lan 2 — da gan volume cho /var/lib/docker, nhung cgroup v2 long nhau chua chia:
Error response from daemon: … unable to apply cgroup configuration: cannot enter cgroupv2 "/sys/fs/cgroup/docker" with domain controllers -- it is in an invalid state</div>
<p>Lỗi đầu: thư mục dữ liệu của Docker bên trong nằm trên overlayfs của chính container ngoài, và nhân không cho chồng overlay lên overlay. Cách chữa là gắn một volume vào <code>/var/lib/docker</code> (volume nằm trên ext4 của máy ảo). Lỗi thứ hai: với cgroup v2, dockerd bên trong phải dời các tiến trình sẵn có sang một nhóm con rồi mới được bật bộ điều khiển — đúng việc mà entrypoint của ảnh <code>docker:dind</code> chính thức làm. Chép ba dòng đó vào script khởi động là chạy:</p>
<div class="out">$ time docker compose up -d
 Network dat-lich_default  Created
 Container dat-lich-db-1  Created
 Container dat-lich-api-1  Created
 Container dat-lich-web-1  Created
 Container dat-lich-db-1  Started
 Container dat-lich-db-1  Waiting
 Container dat-lich-db-1  Healthy
 Container dat-lich-api-1  Started
 Container dat-lich-api-1  Waiting
 Container dat-lich-api-1  Healthy
 Container dat-lich-web-1  Started
real	0m8.939s
$ docker compose ps
NAME             IMAGE                            SERVICE   STATUS
dat-lich-api-1   dv13-reg:5000/dat-lich:2374533   api       Up 5 seconds (healthy)
dat-lich-db-1    postgres:16-alpine               db        Up 8 seconds (healthy)
dat-lich-web-1   nginx:1.27-alpine                web       Up Less than a second</div>
<p>9 giây từ con số không tới ba dịch vụ đang chạy, và thứ tự trong output chính là <code>depends_on</code>: <code>db</code> Healthy rồi <code>api</code> mới Started; <code>api</code> Healthy rồi <code>web</code> mới Started.</p>

<h3>Ghim tag theo commit, không dùng :latest</h3>
${slide('dv-13', 5, ':latest trỏ bản mới, VPS vẫn chạy bản cũ')}
<p>Dòng <code>image:</code> chứa một biến, và biến đó bắt buộc. Cú pháp <code>\${TAG:?thông báo}</code> của Compose giống hệt của bash: biến rỗng hoặc chưa đặt thì dừng với đúng thông báo đó. Đo:</p>
<div class="out">$ mv .env .env.bak &amp;&amp; docker compose up -d
error while interpolating services.api.image: required variable TAG is missing a value: chua dat TAG - ghi vao .env
ma thoat 1
$ docker compose config --images
nginx:1.27-alpine
dv13-reg:5000/dat-lich:2374533
postgres:16-alpine</div>
<p>Vì sao phải khó tính vậy? Vì cái thay thế — <code>image: …:latest</code> — hỏng theo cách êm nhất có thể. Trên VPS thí nghiệm, ảnh <code>dat-lich:latest</code> đã có sẵn (là v1). Máy dựng đẩy một <code>:latest</code> MỚI (v5, có route <code>/api/phong-kham</code>) lên registry. Deploy như mọi ngày:</p>
<div class="out"># may dung vua day dat-lich:latest = v5 (co /api/phong-kham)
$ docker compose up -d --wait api      # TAG=latest
 Container dat-lich-api-1  Healthy
$ curl …/api/ban
v1
$ smoke-test
  /api/lich        -&gt; 401
  /api/phong-kham  -&gt; 404
$ docker compose pull api &amp;&amp; docker compose up -d --wait api
 api Pulling
 api Pulled
 Container dat-lich-api-1  Healthy
$ curl …/api/ban
v5
$ smoke-test
  /api/lich        -&gt; 401
  /api/phong-kham  -&gt; 401</div>
<p><code>docker compose up -d</code> thấy ảnh <code>:latest</code> đã có trên đĩa nên <strong>không kéo</strong>. Container Healthy, lệnh xanh, và máy đang chạy v1. Chỉ có smoke-test — gọi một route mà CHỈ bản mới có — mới lộ ra: <code>404</code>. Đây đúng là hình dạng sự cố 02/07 của dự án (deploy <code>--no-build</code> chỉ rsync mà không dựng lại, route mới 404), lần này bằng container. Khi tag là mã commit, cái tên trong <code>.env</code> đổi ở mỗi lần deploy, compose BUỘC phải có đúng ảnh đó (không có thì kéo, kéo không được thì báo lỗi), và <code>docker ps</code> cho bạn biết ngay máy đang chạy commit nào.</p>
<div class="callout warn">
<p><strong>Tag vẫn dời được.</strong> Một tag theo commit là một quy ước, không phải một bảo đảm: ai có quyền đẩy vẫn đẩy đè được <code>:2bed0bb</code>. Chương 2 (Bài 2.3) đã đo điều đó và kết luận: tag cho người đọc, <strong>digest</strong> (mã băm nội dung) cho máy. Bài 13.2 ghi lại digest của mỗi ảnh đã lên.</p>
</div>

<h3>Bí mật nằm ngoài ảnh: env_file, .env và ARG</h3>
${slide('dv-13', 6, 'Bí mật nằm NGOÀI ảnh, không trong Dockerfile')}
<p>Người mới hay "cho tiện" mà viết mật khẩu vào Dockerfile. Đây là cái giá, đo trên một ảnh bốn dòng:</p>
<pre><code class="language-dockerfile">FROM alpine:3.20
ARG DB_PASS
ENV JWT_SECRET=xxxx
RUN echo "ket noi bang $DB_PASS" &gt; /dev/null
CMD ["true"]</code></pre>
<div class="out">$ docker build --build-arg DB_PASS=12345 -t dv13-ro .
$ docker history --no-trunc --format "{{.CreatedBy}}" dv13-ro | head -3
CMD ["true"]
RUN |1 DB_PASS=12345 /bin/sh -c echo "ket noi bang $DB_PASS" &gt; /dev/null # buildkit
ENV JWT_SECRET=xxxx
$ docker inspect -f "{{.Config.Env}}" dv13-ro
[PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin JWT_SECRET=xxxx]</div>
<p><code>ENV</code> nằm trong cấu hình của ảnh; <code>ARG</code> được dùng trong một lệnh <code>RUN</code> thì nằm nguyên văn trong lịch sử lớp. Ai kéo được ảnh — bạn cùng nhóm, runner CI, một token registry bị lộ — là đọc được cả hai bằng một lệnh. Đổi mật khẩu sau đó cũng không xoá được: lớp cũ vẫn nằm trong registry. (BuildKit có <code>RUN --mount=type=secret</code> cho bí mật cần lúc DỰNG, xem <code>/courses/docker</code>.)</p>
<p>Chỗ của bí mật lúc CHẠY là <code>env_file:</code> — một tệp trên VPS, <code>chmod 600</code>, ngoài git, được nạp vào container lúc khởi động. Đừng nhầm nó với tệp <code>.env</code> nằm cạnh <code>compose.yaml</code>:</p>
<table>
<tr><th></th><th><code>.env</code> cạnh compose.yaml</th><th><code>env_file:</code> trong một dịch vụ</th></tr>
<tr><td>ai đọc</td><td>chính Compose, để THAY BIẾN trong tệp (<code>\${TAG}</code>)</td><td>container, thành biến môi trường của tiến trình</td></tr>
<tr><td>tự vào container?</td><td>KHÔNG</td><td>có</td></tr>
<tr><td>nên chứa</td><td>tag, tên dự án, cổng — thứ không bí mật</td><td>mật khẩu CSDL, khoá JWT, khoá API</td></tr>
</table>
<div class="out">$ docker compose config | grep -A3 "environment:"
    environment:
      DATABASE_URL: postgres://app:12345@db:5432/app
      JWT_SECRET: xxxx
    healthcheck:</div>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — <code>docker compose config</code> in bí mật ra màn hình.</strong> Lệnh này rất tiện để xem tệp sau khi thay biến, và nó in luôn mọi giá trị từ <code>env_file</code>. Chạy nó trong một bước CI có log công khai là đăng mật khẩu lên mạng. Muốn xem ảnh nào sẽ chạy thì dùng <code>docker compose config --images</code>, chỉ in tên ảnh.</p>
</div>

<h3>restart: ai tự dậy sau khi máy khởi động lại</h3>
${slide('dv-13', 7, 'Sau reboot: ai tự dậy, ai nằm im')}
<p>Nhà cung cấp VPS bảo trì phần cứng lúc 3 giờ sáng, máy khởi động lại. Container nào sẽ chạy lại? Đo bằng năm container và một lần khởi động lại dockerd (với container, đó chính là thứ một lần reboot làm):</p>
<div class="out"># 5 container alpine: restart no / unless-stopped / always, cong hai cai da "docker stop" bang tay
# roi khoi dong lai dockerd (nhu VPS vua reboot)
$ docker ps -a --filter name=r- --format "table {{.Names}}\\t{{.Status}}"
NAMES              STATUS
r-al-dung          Up 4 seconds
r-us-dung          Exited (137) 2 minutes ago
r-always           Up 4 seconds
r-unless-stopped   Up 4 seconds
r-no               Exited (137) 2 minutes ago
$ docker compose ps --format "{{.Service}} {{.Status}}"
api Up 5 seconds (health: starting)
db Up 5 seconds (healthy)
web Up 5 seconds</div>
<table>
<tr><th><code>restart:</code></th><th>đang chạy lúc reboot</th><th>đã <code>docker stop</code> bằng tay trước đó</th></tr>
<tr><td><code>no</code> — MẶC ĐỊNH</td><td>nằm im</td><td>nằm im</td></tr>
<tr><td><code>unless-stopped</code></td><td>dậy</td><td>nằm im — tôn trọng quyết định của bạn</td></tr>
<tr><td><code>always</code></td><td>dậy</td><td><strong>dậy lại</strong> dù bạn đã dừng nó</td></tr>
<tr><td><code>on-failure</code></td><td>chỉ khi tiến trình thoát với mã ≠ 0</td><td>nằm im</td></tr>
</table>
<p>Mặc định là <code>no</code>. Quên một dòng là sau lần reboot đầu tiên web chết tới khi bạn thức dậy — không lỗi, không log, chỉ <code>Exited (137)</code>. <code>unless-stopped</code> là lựa chọn hợp cho gần như mọi dịch vụ trên VPS: nó dậy sau reboot, nhưng nếu bạn chủ động dừng một dịch vụ để sửa thì nó không tự bật lại sau lưng bạn như <code>always</code>.</p>
<p>Để ý dòng cuối: sau khi dockerd khởi động lại, cả ba dịch vụ lên <strong>cùng lúc</strong> (Up 5 seconds cả ba). Thứ tự <code>depends_on</code> chỉ áp khi <em>bạn</em> chạy <code>docker compose up</code>; dockerd tự bật container lại thì không đọc compose.yaml. Nên ứng dụng vẫn phải tự thử kết nối lại CSDL vài lần khi khởi động, chứ đừng chết ngay ở lần đầu.</p>

<h3>Log và RAM phải có trần</h3>
${slide('dv-13', 8, 'Log và RAM phải có trần')}
<div class="out"># "yes" in log dung 4 giay; on-co chay voi --log-opt max-size=1m --log-opt max-file=3
== on-khong
215M 6f35abdfc1d50db06b17e63c9b4e052033376a05b5f5dcde186379d78e1c6360-json.log
== on-co
655K 91c1da6ca62080a879df8415fdad9424f63fa818fd92a2f188f141043707a1df-json.log
977K 91c1da6ca62080a879df8415fdad9424f63fa818fd92a2f188f141043707a1df-json.log.1
977K 91c1da6ca62080a879df8415fdad9424f63fa818fd92a2f188f141043707a1df-json.log.2
$ docker stats --no-stream --format "table {{.Name}}\\t{{.MemUsage}}"
NAME             MEM USAGE / LIMIT
dat-lich-api-1   20.5MiB / 256MiB
dat-lich-web-1   2.281MiB / 7.748GiB
dat-lich-db-1    31.11MiB / 512MiB</div>
<p>Driver log mặc định của Docker, <code>json-file</code>, ghi mọi dòng stdout/stderr của container vào một tệp và <strong>không bao giờ xoay vòng</strong> nếu bạn không bảo nó. Một vòng lặp lỗi in log — chuyện rất thường khi CSDL sập và app thử kết nối lại liên tục — viết 215 MB trong 4 giây ở đây. Chương 8 (Bài 8.4) đã đo đúng chuyện tệp log này làm đầy đĩa của Postgres. Hai tuỳ chọn <code>max-size</code> + <code>max-file</code> giữ nó dưới 3 MB mỗi container; <code>docker compose logs</code> vẫn đọc được các tệp đã xoay.</p>
<p>Còn RAM: dịch vụ <code>web</code> không khai <code>mem_limit</code>, nên giới hạn của nó là cả máy — 7,748 GiB (bộ nhớ của máy ảo Docker Desktop mà VPS thí nghiệm đang thấy). Trên VPS 6 GB của dự án, một dịch vụ rò bộ nhớ không có trần sẽ kéo kẻ giết OOM vào những dịch vụ khác, có khi vào chính Postgres (Ch8.2). Có <code>mem_limit</code>, cú giết nằm gọn trong cgroup của dịch vụ đó, và <code>docker inspect</code> ghi <code>OOMKilled: true</code> cho đúng nó.</p>
<div class="callout">
<p><strong>Hai tuỳ chọn này đặt được cho cả máy</strong> trong <code>/etc/docker/daemon.json</code> (<code>"log-opts": {"max-size": "10m", "max-file": "3"}</code>), nhưng chỉ áp cho container TẠO SAU khi dockerd khởi động lại. Ghi trong compose.yaml thì nó đi theo dự án, lên máy mới là có.</p>
</div>

<h3>Tệp cấu hình bind-mount nằm NGOÀI ảnh — và bẫy inode</h3>
${slide('dv-13', 9, 'Sửa nginx.conf bằng mv: container không thấy')}
<p><code>nginx.conf</code> không nằm trong ảnh nào: nó được <strong>bind-mount</strong> (gắn nguyên một tệp của máy chủ vào container). Điều đó có hai hệ quả, cả hai đều từng làm dự án mất một buổi tối. Hệ quả thứ nhất: đẩy ảnh mới <strong>không đụng tới nó</strong>. Tháng 08/2026 người ta phát hiện <code>deploy-nha.sh</code> chưa bao giờ deploy một thay đổi nginx nào — mọi thứ "deploy thành công" mà config mới nằm im trên máy dựng — vì script chỉ đẩy ảnh, còn tệp bind-mount phải được đồng bộ riêng. Hệ quả thứ hai tinh vi hơn, và đây là phép đo:</p>
<div class="out">$ (so van tay: tren may chu va trong container)
  may chu : 594c96609a32  inode 169253
  web     : 594c96609a32
$ cp /tmp/nginx.moi nginx.conf.tam &amp;&amp; mv nginx.conf.tam nginx.conf
  may chu : 2531e4327f82  inode 169336
  web     : 594c96609a32
$ docker compose exec web nginx -t &amp;&amp; docker compose exec web nginx -s reload
nginx: configuration file /etc/nginx/nginx.conf test is successful
2026/09/29 08:03:27 [notice] 48#48: signal process started
$ curl -s -o /dev/null -w "%{http_code}" 127.0.0.1:8080/conf
404
$ docker compose up -d web
 Container dat-lich-web-1  Running
$ curl … /conf
404
# --- cach dung: ghi DE TAI CHO, giu inode ---
$ docker compose restart web
 Container dat-lich-web-1  Started
$ sed -i s/conf-moi/conf-moi-2/ /tmp/nginx.moi &amp;&amp; cat /tmp/nginx.moi &gt; nginx.conf
  may chu : e7b1e23f3cd5  inode 169336
  web     : e7b1e23f3cd5
$ docker compose exec web nginx -s reload
2026/09/29 08:03:30 [notice] 28#28: signal process started
$ sleep 1; curl -s 127.0.0.1:8080/conf
conf-moi-2</div>
<p>Docker gắn một <em>tệp đơn</em> theo <strong>inode</strong> (số hiệu của tệp trong hệ tệp) tại lúc container khởi động, không theo đường dẫn. <code>mv</code> không sửa tệp cũ; nó trỏ cái tên <code>nginx.conf</code> sang một inode MỚI (169253 → 169336). Container vẫn cầm inode cũ. Nên <code>nginx -t</code> kiểm bản CŨ (hợp lệ!), <code>reload</code> nạp lại bản CŨ, và <code>docker compose up -d web</code> thấy compose.yaml không đổi nên trả lời "Running" và không làm gì. Mọi lệnh đều báo thành công. Đó chính xác là sự cố 25/08: bước đồng bộ nginx báo OK hai lần deploy liền mà HTTP/2 vẫn tắt.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — mọi công cụ "an toàn" đều thay inode.</strong> <code>mv</code>, <code>sed -i</code>, <code>rsync</code>, lệnh <code>:w</code> của vim, <code>cp</code> sang tệp tạm rồi đổi tên — tất cả ghi ra tệp mới rồi đổi tên, vì như vậy an toàn hơn khi mất điện giữa chừng. Với một bind-mount tệp đơn, chính sự an toàn đó làm container mù. Ghi ĐÈ TẠI CHỖ (<code>cat mới &gt; nginx.conf</code>, giữ inode), và kiểm bằng sha256 <strong>từ bên trong</strong> container, không bằng <code>cat</code> tệp trên máy chủ.</p>
</div>
<p>Cách bền hơn là đừng gắn tệp đơn: gắn cả <strong>thư mục</strong>. Đo trên dự án xanh/lam của Bài 13.4 (thư mục <code>./nginx</code> gắn vào <code>/etc/nginx/conf.d</code>):</p>
<div class="out"># thu muc ./nginx gan vao /etc/nginx/conf.d — thay tep bang mv:
$ mv /tmp/x.inc nginx/dang-chay.inc.tam &amp;&amp; mv nginx/dang-chay.inc.tam nginx/dang-chay.inc
$ sha256sum nginx/dang-chay.inc | cut -c1-12
c13ebee9d1d0
$ docker compose exec -T web sha256sum /etc/nginx/conf.d/dang-chay.inc | cut -c1-12
c13ebee9d1d0</div>
<p>Với thư mục, container nhìn thấy tên tệp trong thư mục đó, nên <code>mv</code> vẫn hiện ra ngay. <code>docker compose restart web</code> cũng chữa được (nó gắn lại theo đường dẫn) — nhưng restart nginx là một cú rơi request, thứ Bài 13.4 đang cố tránh.</p>

<h3>Volume có tên, và cái cờ -v</h3>
${slide('dv-13', 10, 'down giữ dữ liệu; down -v xoá sạch')}
<div class="out">$ docker compose exec db psql -U app -Atc "select count(*) from lich"
1
$ docker compose down
 Container dat-lich-db-1  Removed
 Network dat-lich_default  Removing
 Network dat-lich_default  Removed
$ docker volume ls --format "{{.Name}}"
dat-lich_pgdata
$ docker compose up -d --wait
  (ma thoat 0)
$ … select count(*) from lich
1
$ docker compose down -v
 Volume dat-lich_pgdata  Removing
 Volume dat-lich_pgdata  Removed
$ docker compose up -d --wait &amp;&amp; … select count(*) from lich
ERROR:  relation "lich" does not exist</div>
<p>Dữ liệu Postgres nằm trong volume CÓ TÊN <code>dat-lich_pgdata</code>. Nó sống qua <code>down</code>, qua việc tạo lại container, qua đổi ảnh Postgres lên bản vá mới. Nhưng <code>docker compose down -v</code> xoá luôn mọi volume có tên của dự án, không hỏi lại. Một dòng "dọn dẹp cho sạch" trong script deploy là mất trắng CSDL. Và nhớ: volume nằm trên CÙNG cái đĩa của VPS, nên nó không phải bản sao lưu — sao lưu là Chương 10.</p>
<table>
<tr><th>Lệnh</th><th>Container</th><th>Mạng</th><th>Volume có tên</th><th>Ảnh</th></tr>
<tr><td><code>docker compose stop</code></td><td>dừng, giữ</td><td>giữ</td><td>giữ</td><td>giữ</td></tr>
<tr><td><code>docker compose down</code></td><td>xoá</td><td>xoá</td><td>giữ</td><td>giữ</td></tr>
<tr><td><code>docker compose down -v</code></td><td>xoá</td><td>xoá</td><td><strong>XOÁ</strong></td><td>giữ</td></tr>
<tr><td><code>docker compose down --rmi all</code></td><td>xoá</td><td>xoá</td><td>giữ</td><td>xoá — mất đường lùi (13.2)</td></tr>
</table>

<h3>docker compose up -d --no-build &lt;dịch vụ&gt;: tráo MỘT dịch vụ</h3>
<p>Lệnh deploy hằng ngày chỉ đụng đúng dịch vụ cần đổi. <code>--no-build</code> bảo compose đừng bao giờ tự dựng (trên VPS không có mã nguồn, không có công cụ dựng — ảnh phải tới từ registry). Tên dịch vụ ở cuối giới hạn việc tạo lại vào đúng nó:</p>
<div class="out">$ sed -i "s/^TAG=.*/TAG=241f233/" .env
$ docker compose up -d --no-build api
 api Pulled
 Container dat-lich-db-1  Running
 Container dat-lich-api-1  Recreate
 Container dat-lich-api-1  Recreated
 Container dat-lich-db-1  Healthy
 Container dat-lich-api-1  Started
(1163 ms)
$ docker compose ps --format "table {{.Service}}\\t{{.Image}}\\t{{.Status}}"
SERVICE   IMAGE                            STATUS
api       dv13-reg:5000/dat-lich:241f233   Up Less than a second (health: starting)
db        postgres:16-alpine               Up 34 seconds (healthy)
web       nginx:1.27-alpine                Up 25 seconds
$ curl -s -o /dev/null -w '%{http_code}\\n' 127.0.0.1:8080/api/ban
502</div>
<p><code>db</code> "Running" — không bị động tới. Chỉ <code>api</code> được "Recreate". Nhưng nhìn dòng cuối: lệnh trả về sau 1,2 giây, và ngay sau đó nginx trả <strong>502</strong> vì api mới chưa kịp nghe cổng. Compose tạo lại container theo thứ tự <em>dừng cũ, rồi tạo mới</em>. Bài 13.4 đo xem khoảng trống đó nuốt bao nhiêu request, và cách lấp nó.</p>

<h3>Trên Windows/WSL và macOS khác gì</h3>
<ul>
<li><strong>CRLF trong <code>.env</code> và <code>env_file</code>: Compose tự bỏ <code>\\r</code>.</strong> Đo (bạn cùng nhóm lưu tệp từ Notepad):
<div class="out">$ printf "TAG=72f5fb8\\r\\n" &gt; .env
$ docker compose config --images | cat -A
dv13-reg:5000/dat-lich:72f5fb8$
postgres:16-alpine$
nginx:1.27-alpine$
$ printf "…\\r\\nJWT_SECRET=xxxx\\r\\n" &gt; ~/bi-mat/api.env &amp;&amp; docker compose up -d --wait api
$ docker compose exec -T api sh -c 'printf %s "$JWT_SECRET" | od -c | head -1'
0000000   x   x   x   x</div>
Cả <code>.env</code>, <code>env_file</code> và <code>docker run --env-file</code> đều ra đúng 4 ký tự. Nhưng một <em>script</em> deploy lưu với CRLF thì vẫn hỏng trên VPS như Chương 7 đã đo — giữ <code>* text=auto eol=lf</code> trong <code>.gitattributes</code>.</li>
<li><strong>Docker Desktop trên Mac và Windows là một máy ảo Linux.</strong> Container trên laptop của bạn không dùng đĩa, mạng, CPU của VPS; số đo thời gian ở đây chỉ để so tương đối. Và bind-mount trên Mac/Windows đi qua một lớp chia sẻ tệp — bẫy inode ở trên phải đo trên Linux (ở đây: bên trong VPS thí nghiệm), đừng kết luận từ laptop.</li>
<li><strong>VPS cũ có thể chỉ có <code>docker-compose</code> (v1, Python).</strong> Nó không hiểu mọi thứ của Compose Specification và đã ngừng phát triển. Trên Ubuntu 24.04 cài gói <code>docker-compose-v2</code> (hoặc plugin từ kho của Docker) và gõ <code>docker compose</code>, không gạch nối.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tối trước hôm bảo vệ SWP391, nhóm bạn deploy bản mới lên VPS bằng <code>image: …:latest</code>, <code>docker compose up -d</code> báo xanh, và hội đồng bấm vào tính năng mới thì 404. Một bạn còn vừa sửa <code>nginx.conf</code> bằng <code>sed -i</code> mà "không thấy tác dụng". Hãy tái hiện cả hai trên VPS thí nghiệm và sửa cho đúng.</p>
<ol>
<li>Dựng VPS thí nghiệm có Docker (khối lệnh ở trên) và chạy compose <code>dat-lich</code> với <code>TAG=</code> một mã commit. Ghi lại <code>docker compose ps</code>.</li>
<li>Đổi sang <code>TAG=latest</code> với một <code>:latest</code> cũ trên đĩa, đẩy một <code>:latest</code> mới lên registry, chạy <code>up -d</code> rồi gọi một route chỉ bản mới có. Ghi mã trả về, rồi sửa bằng tag theo commit.</li>
<li>Sửa <code>nginx.conf</code> bằng <code>sed -i</code>, so sha256 trên máy chủ và <code>docker compose exec web sha256sum /etc/nginx/nginx.conf</code>. Sửa lại bằng <code>cat … &gt; nginx.conf</code> và so lần nữa.</li>
<li>Thêm <code>restart: unless-stopped</code>, <code>mem_limit</code> và <code>logging.options</code> cho cả ba dịch vụ; khởi động lại dockerd và xem dịch vụ nào tự dậy.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được một lần <code>up -d</code> xanh mà route mới 404 (và lần sửa trả 401/200), hai sha256 LỆCH rồi KHỚP giữa máy chủ và container, và <code>docker compose ps</code> sau khi khởi động lại dockerd cho thấy cả ba dịch vụ Up mà không cần gõ gì.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Compose file (tệp compose)</span><span class="v">Tệp YAML mô tả các dịch vụ, mạng, volume của một dự án; <code>docker compose</code> biến nó thành container.</span></div>
  <div class="kv"><span class="k">Image tag (nhãn ảnh)</span><span class="v">Tên dễ đọc gắn cho một ảnh, như <code>:2bed0bb</code>; dời được, nên chỉ là quy ước.</span></div>
  <div class="kv"><span class="k">Interpolation (thay biến)</span><span class="v">Compose thay <code>\${TAG}</code> bằng giá trị trong <code>.env</code>/môi trường trước khi chạy; <code>\${TAG:?}</code> bắt buộc phải có.</span></div>
  <div class="kv"><span class="k">env_file (tệp biến môi trường)</span><span class="v">Tệp nạp vào container lúc chạy — chỗ của bí mật, ngoài git và ngoài ảnh.</span></div>
  <div class="kv"><span class="k">Restart policy (chính sách khởi động lại)</span><span class="v">Luật dockerd dùng để bật lại container: <code>no</code>, <code>on-failure</code>, <code>unless-stopped</code>, <code>always</code>.</span></div>
  <div class="kv"><span class="k">Log rotation (xoay vòng log)</span><span class="v">Cắt tệp log khi tới cỡ nhất định và chỉ giữ vài tệp gần nhất.</span></div>
  <div class="kv"><span class="k">Bind mount (gắn từ máy chủ)</span><span class="v">Gắn một tệp/thư mục của máy chủ vào container; nằm NGOÀI ảnh, tệp đơn thì gắn theo inode.</span></div>
  <div class="kv"><span class="k">Named volume (volume có tên)</span><span class="v">Vùng lưu trữ do Docker quản lý, sống qua việc tạo lại container; <code>down -v</code> xoá nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một <code>compose.yaml</code> trên VPS là bản kê cách máy cư xử khi có chuyện: tag, bí mật, restart, trần RAM/log, healthcheck, volume.</li>
<li>Tag theo commit + <code>\${TAG:?}</code>: thiếu tag thì từ chối; <code>:latest</code> đã có trên đĩa thì <code>up -d</code> không kéo và máy chạy bản cũ (route mới 404).</li>
<li>Bí mật trong <code>ENV</code>/<code>ARG</code> nằm vĩnh viễn trong ảnh; chỗ của nó là <code>env_file</code> ngoài git — và <code>compose config</code> in nó ra.</li>
<li><code>restart</code> mặc định là <code>no</code>: reboot là web nằm im; <code>unless-stopped</code> dậy sau reboot mà vẫn tôn trọng lần dừng tay.</li>
<li>Không trần thì log viết 215 MB trong 4 giây và RAM của một dịch vụ là cả máy.</li>
<li>Tệp bind-mount nằm ngoài ảnh và gắn theo inode: <code>mv</code>/<code>sed -i</code> làm container mù; ghi đè tại chỗ hoặc gắn thư mục; <code>down -v</code> xoá CSDL.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — History and development of Docker Compose</span><span class="lc-sub">docs.docker.com/compose/intro/history/ — v1 (Python, 2014), v2 (Go, công bố 2020), Compose Specification và dòng <code>version</code> thành tuỳ chọn.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Compose file reference — services</span><span class="lc-sub">docs.docker.com/reference/compose-file/services/ — <code>restart</code>, <code>healthcheck</code>, <code>depends_on</code>, <code>env_file</code>, <code>logging</code>, <code>mem_limit</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — Start containers automatically</span><span class="lc-sub">docs.docker.com/engine/containers/start-containers-automatically/ — bốn chính sách restart và cách mỗi cái đối xử với container bạn dừng tay.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — JSON File logging driver</span><span class="lc-sub">docs.docker.com/engine/logging/drivers/json-file/ — <code>max-size</code>, <code>max-file</code> và việc mặc định không xoay vòng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — Bind mounts</span><span class="lc-sub">docs.docker.com/engine/storage/bind-mounts/ — tệp và thư mục của máy chủ gắn vào container.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — III. Config</span><span class="lc-sub">12factor.net/config — cấu hình nằm trong môi trường, không nằm trong mã hay ảnh.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — khoá đầy đủ</span><span class="lc-sub">/courses/docker/learn${REF} — Dockerfile, Compose, mạng và volume ở mức nền tảng. Bài này chỉ là lát cắt "chạy trên VPS" của nó.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 13.2 ─────────────────────────── */
    {
      title: '13.2 — A registry, and building somewhere else: proving the image runs before you push it|||13.2 — Registry và dựng ở máy khác: chứng minh ảnh chạy được trước khi đẩy',
      slug: 'deploy-13-2-registry-build-o-may-khac',
      type: 'LESSON',
      isFreePreview: true,
      description: 'VPS nhỏ không nên dựng ảnh, nên ta dựng ở máy mạnh và đẩy qua registry — rồi tái hiện đúng sự cố 502 bảy phút: engine Prisma glibc chép sang nền Alpine musl, dựng xanh, đẩy xanh, Restarting (1). Viết chốt kiểm ảnh NẠP engine trước khi đẩy, đo --platform từ Mac arm64, và dọn ảnh cũ mà vẫn giữ đường lùi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.2</span>
<h2>A registry, and building somewhere else: proving the image runs before you push it</h2>
<p class="lead">Building images on a 6 GB VPS is shooting yourself in the foot: Chapter 8 measured the OOM kill (137) and the 7.6 GB cache that filled Postgres's disk. The obvious fix — build on a strong machine, push through a registry, let the VPS only pull — opens a new failure: the image is built in one place and RUN in another. On 18/08/2026 that failure made the project's API return 502 for seven minutes. This lesson reproduces it with real Prisma, writes the check that stops it BEFORE the push, measures the similar trap when an arm64 Mac builds for an amd64 VPS, and prunes old images without cutting the rollback path.</p>

<h3>Why not build on the VPS</h3>
${slide('dv-13', 11, 'Build ở máy mạnh, VPS chỉ kéo về')}
<p>One project, two build locations — figures from this repository's own records (Chapter 2.4 and Chapter 8 tell them in full):</p>
<table>
<tr><th></th><th>build ON the VPS (<code>deploy.sh</code>)</th><th>build at HOME (<code>deploy-nha.sh</code>)</th></tr>
<tr><td>time</td><td>~15 min, forced to be sequential</td><td>3–6 min, in parallel</td></tr>
<tr><td>RAM</td><td>parallel ⇒ <code>next build</code> OOM-killed, exit 137 (06/07)</td><td>31 GB machine, VPS untouched</td></tr>
<tr><td>VPS disk</td><td>7.6 GB build cache ⇒ <code>no space left on device</code> (18/08)</td><td>no build cache on the VPS at all</td></tr>
<tr><td>what reaches production</td><td>the working tree — including a file mid-edit</td><td>committed work only (git push into a bare repo at home)</td></tr>
<tr><td>when the build machine is off</td><td>still works</td><td>fall back to <code>deploy.sh</code> — a fallback actually exercised</td></tr>
</table>
<p>The common skeleton of every "build elsewhere" path, whether elsewhere is a home machine or a GitHub Actions runner (Lesson 13.3):</p>
<pre><code class="language-bash"># may dung (may nha / runner CI) — KHONG phai VPS
TAG=$(git rev-parse --short HEAD)                 # tag = ma commit
docker build -f Dockerfile.backend -t "$KHO/api:$TAG" .   # GHI RO Dockerfile
./chot-kiem-anh.sh "$KHO/api:$TAG"                # TRUOC khi day (o duoi)
docker push "$KHO/api:$TAG"
docker inspect -f '{{index .RepoDigests 0}}' "$KHO/api:$TAG"   # ghi digest vao so
ssh vps "deploy $TAG"                             # VPS: pull + trao (13.3, 13.4)</code></pre>
<p>A <strong>registry</strong> is an HTTP server that stores layers by hash and manifests by tag. Chapter 2.3 measured the push protocol: layers the registry already has do not travel again. The lab uses <code>registry:2</code> — open-source software speaking the same protocol as GHCR and Docker Hub. The build machine (Mac) pushes to <code>localhost:19135</code>; the lab VPS pulls from <code>dv13-reg:5000</code> — one registry, two addresses, because the two machines see it from different networks:</p>
<div class="out">$ docker inspect -f "{{index .RepoDigests 0}}" dv13-reg:5000/dat-lich:2bed0bb
dv13-reg:5000/dat-lich@sha256:3ee454488204cb6627094b9d113908811c522d437868cf43d52934875fa0b9a4
$ curl -s dv13-reg:5000/v2/dat-lich/tags/list
{"name":"dat-lich","tags":["latest","241f233","72f5fb8","2bed0bb","02f98c0","19efddb","2374533"]}
$ cat /etc/docker/daemon.json
{"insecure-registries":["dv13-reg:5000"],"log-driver":"json-file"}</div>
<p>Three things in that output. One: <code>RepoDigests</code> is the image's digest (content hash) — record it on every deploy, because a tag can be overwritten and a digest cannot (Chapter 2.3). Two: the registry's <code>/v2/…/tags/list</code> API lists tags without needing <code>docker</code>. Three: the lab registry speaks plain HTTP, so the VPS's dockerd must list it under <code>insecure-registries</code> — acceptable inside a private Docker network, NEVER in real life. The real GHCR speaks HTTPS and requires a login; this lesson only prints the commands and logs in to no real registry:</p>
<pre><code class="language-bash"># GHCR that — CHI IN RA, khong chay trong bai (khong dang nhap registry that)
echo "$CR_PAT" | docker login ghcr.io -u TEN_GITHUB --password-stdin   # PAT classic: write:packages
docker push ghcr.io/ten-github/dat-lich-api:$TAG
# tren VPS: token CHI DOC (read:packages), khong dung token cua may dung
echo "$CR_PAT_DOC" | docker login ghcr.io -u TEN_GITHUB --password-stdin</code></pre>
<div class="callout">
<p><strong>Two tokens, two permissions.</strong> The build machine needs <code>write:packages</code>; the VPS only needs <code>read:packages</code>. If the VPS is compromised with a read-only token, the attacker can pull images (already on the machine) but cannot overwrite production images. Per GitHub's documentation (09/2026), GHCR accepts only <em>classic</em> personal access tokens; inside a workflow use <code>GITHUB_TOKEN</code> with <code>permissions: packages: write</code> (Lesson 13.3).</p>
</div>

<h3>Green build, dead image: reproducing the 18/08 incident</h3>
${slide('dv-13', 12, 'Build xanh, ảnh chết: glibc chép sang musl')}
<p>The real story again. The repository had two Dockerfiles: <code>Dockerfile.backend</code> (base <code>node:22-slim</code> — Debian, whose C library is <strong>glibc</strong>) used by compose, and an old bare <code>Dockerfile</code> ending in <code>node:22-alpine</code> — Alpine, whose C library is <strong>musl</strong>. The home build script typed <code>docker build .</code>, which takes the default file. The image ended in Alpine but carried a Prisma engine compiled for glibc. Green build, green push, green swap — then the backend restarted forever and the API returned 502 for seven minutes.</p>
<p><strong>glibc and musl</strong> are two implementations of the standard C library — the layer almost every compiled program depends on. A binary compiled for one usually cannot load on the other. Plain JavaScript does not care; but Prisma's engine is a native library (<code>.so.node</code>), and Prisma downloads the variant matching the base where <code>prisma generate</code> runs. Build on one base, copy <code>node_modules</code> onto the other, and you copy the wrong engine. The exact failure, rebuilt with Prisma 5.22.0 like the repository:</p>
<pre><code class="language-dockerfile"># SAI: dung o glibc, chay o musl
FROM node:22-slim AS dung
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends openssl &amp;&amp; rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY prisma ./prisma
RUN npx prisma generate
FROM node:22-alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=dung /app/node_modules ./node_modules
COPY prisma ./prisma
COPY kiem.js ./
CMD ["node", "kiem.js"]</code></pre>
<p>And the CORRECT version — both stages on <code>node:22-alpine</code>, so <code>prisma generate</code> downloads the musl engine. Run both with a <code>DATABASE_URL</code> pointing at a host that does not exist:</p>
<div class="out">$ docker run --rm -e DATABASE_URL=postgres://app:12345@khong-co:5432/app localhost:19135/dat-lich-api:sai
PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-arm64-openssl-3.0.x". | This happened because Prisma Client was generated for "linux-arm64-openssl-3.0.x", but the actual deployment required "linux-musl-arm64-openssl-3.0.x". | Add "linux-musl-arm64-openssl-3.0.x" to &#96;binaryTargets&#96; in the "schema.prisma" file and run &#96;prisma generate&#96; after saving it:
ma thoat 1
$ docker run --rm -e DATABASE_URL=postgres://app:12345@khong-co:5432/app localhost:19135/dat-lich-api:dung
PrismaClientInitializationError: Can't reach database server at &#96;khong-co:5432&#96; | Please make sure your database server is running at &#96;khong-co:5432&#96;.
ma thoat 1
$ docker image ls --format '{{.Tag}} {{.Size}}' localhost:19135/dat-lich-api
dung 358MB
sai 358MB</div>
<p>Read carefully, because this is where a hurried eye skips: <strong>both exit 1</strong>, and both images are 358 MB. Only the CONTENT of the error tells them apart. Wrong image: "could not locate the Query Engine … generated for linux-arm64 … required linux-musl-arm64" — the engine cannot load, the image is dead. Correct image: "Can't reach database server" — the engine loaded and only the database is missing, so the image is healthy. That is the basis of the check below.</p>
<p>A side failure from the first build is worth recording too, because it is very common when moving to Alpine: Alpine images have no OpenSSL by default, and Prisma guesses a version:</p>
<div class="out"># lan dung dau tien — anh Alpine CHUA co openssl:
prisma:warn Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-1.1.x".
PrismaClientInitializationError: Unable to require(&#96;/app/node_modules/.prisma/client/libquery_engine-linux-musl-arm64-openssl-1.1.x.so.node&#96;). … Details: Error loading shared library libssl.so.1.1: No such file or directory</div>
<p>The fix is <code>apk add openssl</code> in BOTH the build and the run stage (as in the file above). It shows that images that "look alike" are not enough: one missing system library and the engine does not load.</p>

<h3>Restarting (1): the loop no step can see</h3>
${slide('dv-13', 13, 'Restarting (1): cái vòng không ai nhìn thấy')}
<p>Put the wrong image on the lab VPS, with exactly the restart policy Lesson 13.1 recommends:</p>
<div class="out">$ docker run -d --name api-sai --restart unless-stopped -e DATABASE_URL=… dv13-reg:5000/dat-lich-api:sai
$ sleep 25
$ docker ps --filter name=api-sai --format "{{.Names}}  {{.Status}}"
api-sai  Restarting (1) 8 seconds ago
$ docker inspect -f "{{.RestartCount}}" api-sai
8
$ docker logs --tail 1 api-sai
PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-arm64-openssl-3.0.x". | …</div>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">docker build — green</span><span class="lz-d">the Dockerfile never RUNS the engine; copying the wrong file is still a successful copy.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">docker push — green</span><span class="lz-d">the registry receives bytes and checks hashes, runs nothing.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">docker compose up -d — green</span><span class="lz-d">the container is "Started" before it dies; the command has returned.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">restart: unless-stopped — doing its job</span><span class="lz-d">start, die, start; <code>RestartCount</code> keeps rising.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">nginx — 502</span><span class="lz-d">until someone reads the log and rolls back. The check must sit BETWEEN step 1 and step 2.</span></div>
</div>
<p>Eight restarts in 25 seconds, and nothing in the whole pipeline turned red. Walk the steps to see why: <code>docker build</code> is green because the Dockerfile never RUNS the engine; <code>docker push</code> is green because the registry only receives bytes; <code>docker compose up -d</code> is green because the container is "Started" before it dies; <code>restart: unless-stopped</code> does its job of restarting it, forever; and nginx returns 502 until someone reads the log. That is the course's recurring lesson: <strong>no step asks "does this image run"</strong>, so that question needs its own place — before <code>docker push</code>, while production is untouched.</p>
<div class="callout warn">
<p><strong>Reading <code>Restarting (1)</code>.</strong> The number in brackets is the exit code of the last death. <code>RestartCount</code> keeps rising; Docker doubles the delay between attempts (starting at 100 ms), so a long loop gets sparser. Seeing this right after a deploy: read <code>docker logs --tail 20</code> FIRST, then roll back — do not restart it again.</p>
</div>

<h3>The image check: run the engine before you push</h3>
${slide('dv-13', 14, 'Chốt kiểm ảnh: chạy engine trước khi đẩy')}
<p>The check has two tiers. Tier one is cheap and mirrors the real check in <code>deploy-nha.sh</code>: read the image's libc (<code>/lib/ld-musl-*</code> present means musl) and the engine name in <code>node_modules/.prisma/client/</code>, and compare. Tier two decides: <strong>actually load</strong> the engine with <code>$connect()</code> to a database that does not exist, and accept only the error "Can't reach database server".</p>
<pre><code class="language-bash">#!/bin/bash
# chot-kiem-anh.sh ANH — tu choi day mot anh khong chay noi (chay TRUOC docker push)
set -Eeuo pipefail
ANH=\${1:?can ten anh}
# 1) libc cua anh vs engine Prisma nam trong anh (nhu deploy-nha.sh)
read -r LIBC ENGINE &lt; &lt;(docker run --rm --entrypoint sh "$ANH" -c '
  if ls /lib/ld-musl-* &gt;/dev/null 2&gt;&amp;1; then printf "musl "; else printf "glibc "; fi
  ls node_modules/.prisma/client/ | grep -o "libquery_engine-[^ ]*" | head -1')
case "$ENGINE" in *musl*) E=musl ;; libquery_engine-*) E=glibc ;; *) E=khong-thay ;; esac
echo "anh: $LIBC · engine: $E ($ENGINE)"
[ "$LIBC" = "$E" ] || { echo "HONG: nen $LIBC mang engine $E"; exit 1; }
# 2) NAP THAT engine: tro vao mot CSDL khong ton tai — loi mong doi la "khong noi duoc"
OUT=$(docker run --rm -e DATABASE_URL=postgres://x:x@127.0.0.1:1/x "$ANH" \\
      node -e "new (require('@prisma/client').PrismaClient)().\\$connect().catch(e=&gt;{console.log(e.message);process.exit(1)})" 2&gt;&amp;1 || true)
case "$OUT" in
  *"Can't reach database server"*) echo "OK: engine nap duoc (loi con lai chi la khong co CSDL)" ;;
  *) echo "HONG: engine khong nap duoc:"; echo "$OUT" | head -3; exit 1 ;;
esac</code></pre>
<div class="out">$ ./chot-kiem-anh.sh localhost:19135/dat-lich-api:sai
anh: musl · engine: glibc (libquery_engine-linux-arm64-openssl-3.0.x.so.node)
HONG: nen musl mang engine glibc
ma thoat 1
$ ./chot-kiem-anh.sh localhost:19135/dat-lich-api:dung
anh: musl · engine: musl (libquery_engine-linux-musl-arm64-openssl-3.0.x.so.node)
OK: engine nap duoc (loi con lai chi la khong co CSDL)
ma thoat 0</div>
<p>Why tier two when tier one already caught it? Because tier one knows exactly ONE failure (musl/glibc). A missing <code>libssl</code> (the side failure above), a wrong CPU architecture (next section), a wrong OpenSSL version — tier one passes them all, tier two catches them all. The general principle: <strong>the best check does exactly what production will do, at the smallest scale</strong>. For an app without Prisma, "what production does" may be <code>node -e "require('./dist/index.js')"</code> with an init-only flag, or running the image and calling <code>/api/health</code> for ten seconds.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — <code>ldd</code> on a <code>.node</code> file cannot tell wrong from right.</strong> The natural idea is "check the linked libraries with <code>ldd</code>". Measured on the two images:</p>
<div class="out">$ for t in sai dung; do docker run --rm --entrypoint sh …:$t -c '
    ldd node_modules/.prisma/client/*.so.node &gt; /tmp/l.txt 2&gt;&amp;1; echo "ldd ma thoat $?"
    grep -c "symbol not found" /tmp/l.txt; grep -v "symbol not found" /tmp/l.txt | head -3'; done
== sai
ldd ma thoat 127
65
	/lib/ld-musl-aarch64.so.1 (0xffff9eaf0000)
	libssl.so.3 =&gt; /usr/lib/libssl.so.3 (0xffff9dc7d000)
	libcrypto.so.3 =&gt; /usr/lib/libcrypto.so.3 (0xffff9d817000)
== dung
ldd ma thoat 127
62
	/lib/ld-musl-aarch64.so.1 (0xffffa7080000)
	libssl.so.3 =&gt; /usr/lib/libssl.so.3 (0xffffa61f7000)
	libcrypto.so.3 =&gt; /usr/lib/libcrypto.so.3 (0xffffa5d91000)</div>
<p>Two engines, one result: <code>ldd</code> exits <strong>127</strong> for BOTH, prints 65 and 62 <code>symbol not found</code> lines, and "finds" every library for both (musl's <code>ldd</code> maps glibc's <code>libc.so.6</code> onto itself). The reason: the <code>napi_*</code> functions are provided by the <code>node</code> process when it loads the addon and live in no library, so <code>ldd</code> alone always finds them missing. A check that is always red either blocks every deploy or gets ignored — useless both ways. (My first measurement read "ldd exited 0" — that was the exit code of <code>tail</code> at the end of the pipe, not of <code>ldd</code>. Check the checker.) Check by doing the real thing (tier two).</p>
</div>

<h3>An arm64 Mac building for an amd64 VPS</h3>
${slide('dv-13', 15, 'Mac arm64 → VPS amd64: build xanh vẫn sai')}
<p>Chapter 2.4 measured it: on this Mac M1, Docker Desktop has no amd64 emulation enabled, so a <code>--platform linux/amd64</code> build fails at the first <code>RUN</code>. Measured again today, unchanged (the lesson does NOT change Docker Desktop settings to enable emulation):</p>
<div class="out">$ uname -m
arm64
$ docker build --platform linux/amd64 -f Dockerfile.run .      # Dockerfile.run: FROM alpine:3.20 / RUN uname -m &gt; /kien-truc
#5 0.329 exec /bin/sh: exec format error
#5 ERROR: process "/bin/sh -c uname -m &gt; /kien-truc" did not complete successfully: exit code: 255</div>
<p>That is the good outcome — fail loud, fail early. There is a popular trick for "building amd64 without emulation": run the build stage on the build machine's architecture with <code>--platform=$BUILDPLATFORM</code>, then copy the result into a final stage (target architecture) that has no <code>RUN</code>:</p>
<pre><code class="language-dockerfile"># Dung o kien truc cua MAY DUNG, anh cuoi cho kien truc DICH — tang cuoi KHONG co RUN
FROM --platform=$BUILDPLATFORM node:22-alpine AS dung
RUN apk add --no-cache openssl
WORKDIR /app
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY prisma ./prisma
RUN npx prisma generate
FROM node:22-alpine
WORKDIR /app
COPY --from=dung /app/node_modules ./node_modules
COPY prisma ./prisma
COPY kiem.js ./
CMD ["node", "kiem.js"]</code></pre>
<div class="out">$ docker build --platform linux/amd64 -f Dockerfile.cheo -t localhost:19135/dat-lich-api:cheo .
#18 naming to localhost:19135/dat-lich-api:cheo done
#18 DONE 2.8s
ma thoat 0
$ docker image inspect -f "{{.Os}}/{{.Architecture}}" localhost:19135/dat-lich-api:cheo
linux/amd64
$ docker create …:cheo &amp;&amp; docker cp &lt;id&gt;:/app/node_modules/.prisma/client - | tar -t | grep node$
client/libquery_engine-linux-musl-arm64-openssl-3.0.x.so.node
# schema.prisma: binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
$ … | tar -t | grep node$
client/libquery_engine-linux-musl-arm64-openssl-3.0.x.so.node
client/libquery_engine-linux-musl-openssl-3.0.x.so.node</div>
<p>2.8 seconds, green, and <code>docker image inspect</code> says <code>linux/amd64</code>. But the engine inside is <strong>arm64</strong> — because <code>prisma generate</code> ran in the arm64 stage. Push this to an x86 VPS and you repeat slide 13 with different words in the log. The <code>$BUILDPLATFORM</code> trick is safe only when EVERYTHING the build stage produces is CPU-independent (bundled JavaScript, static files, a Go binary cross-compiled with <code>GOARCH=$TARGETARCH</code>). With native libraries you must name the target — for Prisma, <code>binaryTargets</code>, and the last output shows the <code>linux-musl-openssl-3.0.x</code> (x86-64) engine now present. The image check above runs the container, so it catches every such mismatch — if it runs on a machine of the SAME architecture as the VPS (GitHub's <code>ubuntu-24.04</code> runner is x86-64; Lesson 13.3).</p>
<table>
<tr><th>Building amd64 from an arm64 Mac</th><th>Fast</th><th>Correct with native libraries</th><th>When</th></tr>
<tr><td>QEMU emulation (enabled in Docker Desktop)</td><td>much slower (emulates every CPU instruction)</td><td>yes</td><td>occasionally, small projects</td></tr>
<tr><td><code>$BUILDPLATFORM</code> + final stage without RUN</td><td>fast</td><td><strong>no</strong>, unless you name the target</td><td>pure JS/static/Go artifacts only</td></tr>
<tr><td>build on a real x86 machine (home Fedora, CI runner)</td><td>fast</td><td>yes</td><td>the project's standard path</td></tr>
</table>

<h3>Pruning old images while keeping a rollback path</h3>
${slide('dv-13', 16, 'Dọn ảnh cũ mà vẫn còn đường lùi')}
<p>Every deploy leaves an image on the VPS disk. Never prune and the disk fills (Chapter 8.4); prune with <code>docker image prune -a</code> and every image without a running container is gone — including the rollback path Chapter 6.1 relies on. My first prune script kept the 3 newest images by CREATION DATE:</p>
<div class="out"># ban DAU: giu 3 anh MOI NHAT theo ngay tao
$ ~/bin/don-anh.sh 3
xoa dv13-reg:5000/dat-lich:02f98c0
xoa dv13-reg:5000/dat-lich:241f233
xoa dv13-reg:5000/dat-lich:2374533
$ docker images dv13-reg:5000/dat-lich --format "{{.Tag}}  {{.CreatedSince}}"
19efddb  7 minutes ago
2bed0bb  12 minutes ago
latest  12 minutes ago
72f5fb8  12 minutes ago</div>
<p>Look at what it kept: <code>19efddb</code> is the broken v6 (Lesson 13.4 measures it dying at start) — the newest, so it was kept as a "rollback". Meanwhile <code>241f233</code>, a version that ran fine, was deleted. An image's age says nothing about whether it is good. What does is the <code>da-len.log</code> ledger, which the deploy script writes only AFTER the smoke test passes (Lesson 13.3). The fixed version keeps by ledger:</p>
<pre><code class="language-bash">#!/bin/bash
# don-anh.sh [GIU=3] — giu anh dang chay + cac ban DA LEN TOT gan nhat (theo da-len.log), xoa phan con lai
set -Eeuo pipefail
KHO=dv13-reg:5000/dat-lich; GIU=\${1:-3}
GIU_LAI=$(tac ~/dat-lich/da-len.log | awk '{print $2}' | awk '!thay[$0]++' | head -n "$GIU")
DANG=$(docker inspect -f '{{.Config.Image}}' dat-lich-api-1); DANG=\${DANG##*:}
for T in $(docker images "$KHO" --format '{{.Tag}}'); do
  [ "$T" = "$DANG" ] &amp;&amp; continue
  grep -qx "$T" &lt;&lt;&lt; "$GIU_LAI" &amp;&amp; { echo "giu $T"; continue; }
  echo "xoa $T"; docker rmi "$KHO:$T" &gt;/dev/null
done</code></pre>
<div class="out">$ tail -4 ~/dat-lich/da-len.log
2026-09-29T08:23:54+00:00 02f98c0
2026-09-29T08:24:01+00:00 241f233
2026-09-29T08:24:08+00:00 2bed0bb
2026-09-29T08:24:15+00:00 72f5fb8
$ docker images dv13-reg:5000/dat-lich --format "{{.Tag}}" | tr "\\n" " "
19efddb 2bed0bb 02f98c0 72f5fb8 241f233 2374533
$ ~/bin/don-anh.sh 3
xoa 19efddb
giu 2bed0bb
xoa 02f98c0
giu 241f233
xoa 2374533
$ docker images … --format "{{.Tag}}"
2bed0bb 72f5fb8 241f233</div>
<p>Now the rollback path consists of versions that actually served traffic, and <code>docker rmi</code> names each image — no unfiltered <code>prune</code> anywhere. And this is why they must stay ON DISK, not only in the registry:</p>
<div class="out"># registry dang SAP (docker stop dv13-reg)
$ docker pull dv13-reg:5000/dat-lich:2bed0bb
Error response from daemon: failed to resolve reference "dv13-reg:5000/dat-lich:2bed0bb": failed to do request: Head "ht…
$ sed -i s/^TAG=.*/TAG=2bed0bb/ .env &amp;&amp; docker compose up -d --pull never --wait api
 Container dat-lich-api-1  Healthy
  (6734 ms) — v5
$ sed -i s/^TAG=.*/TAG=02f98c0/ .env &amp;&amp; docker compose up -d --pull never --wait api
Error response from daemon: No such image: dv13-reg:5000/dat-lich:02f98c0
  ma thoat 1</div>
<p>The registry down (or a GHCR incident, or an expired token) exactly when you need to roll back: with the image still on disk, <code>--pull never</code> gets you back in 6.7 seconds; with it pruned, you wait.</p>

<h3>When to use a registry — and when NOT</h3>
<ul>
<li><strong>Use it:</strong> apps whose runtime must be pinned (Node, Python with native libraries), a small VPS, more than one server, or CI. This project's path.</li>
<li><strong>Not needed:</strong> a static site (rsync the <code>out/</code> directory — Chapter 2.1), a single Go binary, or a project that lives two weeks. A registry is one more part that can be down.</li>
<li><strong>Without a registry:</strong> <code>docker save image | ssh vps docker load</code> ships the whole image every time (no layer deduplication as in Chapter 2.3) — useful when the VPS cannot reach the Internet.</li>
</ul>

<h3>What differs on Windows/WSL and macOS</h3>
<ul>
<li><strong>Mac M1/M2/M3 and Windows on ARM are arm64</strong>; most VPSes are x86-64. Always check <code>docker image inspect -f '{{.Architecture}}'</code> before pushing, and run the image check on a machine of the SAME architecture as the VPS.</li>
<li><strong>Windows + WSL2:</strong> building inside WSL (Linux x86-64) matches the VPS architecture; but code under <code>/mnt/c/…</code> makes <code>COPY</code> and <code>npm install</code> much slower — keep the code in WSL's own filesystem.</li>
<li><strong>Logging in to a registry on a shared machine</strong>: <code>docker login</code> writes the token to <code>~/.docker/config.json</code> (on a Mac, into the Keychain via a credential helper). Never log in with your write token on a school lab computer.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate "optimises the size" by switching the Dockerfile's final stage to <code>node:22-alpine</code> while keeping the build stage on <code>node:22-slim</code>. The build is green. Prove that image must never reach the VPS.</p>
<ol>
<li>Create a small Prisma project (one model, <code>prisma@5.22.0</code>) and the WRONG/CORRECT Dockerfiles above; build both and push them to <code>registry:2</code> on <code>127.0.0.1:19135</code>.</li>
<li>Run both with a <code>DATABASE_URL</code> pointing at a non-existent host; record each exit code and first error line.</li>
<li>Write the two-tier <code>chot-kiem-anh.sh</code> and run it on both; then try <code>ldd</code> on both engines and write down why it cannot be used.</li>
<li>On the lab VPS, create a <code>da-len.log</code> ledger and run <code>don-anh.sh 3</code>; stop the registry and roll back to an on-disk version with <code>--pull never</code>.</li>
</ol>
<p><strong>Done when:</strong> the check exits 1 for the wrong image and 0 for the correct one, you can explain why "both exit 1" when run plainly, and the <code>--pull never</code> rollback succeeds while the registry is off.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Registry</span><span class="v">A server storing image layers and manifests: GHCR, Docker Hub, or a self-hosted <code>registry:2</code>.</span></div>
  <div class="kv"><span class="k">Digest</span><span class="v">The sha256 of a manifest — names exactly one set of bytes forever, unlike a movable tag.</span></div>
  <div class="kv"><span class="k">glibc / musl</span><span class="v">The standard C libraries of Debian/Ubuntu and of Alpine; binaries for one usually do not run on the other.</span></div>
  <div class="kv"><span class="k">Native addon</span><span class="v">A <code>.node</code> file precompiled for a specific OS, libc and CPU — like the Prisma engine.</span></div>
  <div class="kv"><span class="k">Pre-push check</span><span class="v">Running the image at the smallest scale before <code>docker push</code>, so failures stop on the build machine.</span></div>
  <div class="kv"><span class="k">$BUILDPLATFORM / --platform</span><span class="v">The build machine’s platform and the platform the image will run on; a mismatch with native libraries breaks.</span></div>
  <div class="kv"><span class="k">Restart loop</span><span class="v"><code>Restarting (1)</code>: the container dies as it starts and the restart policy brings it back forever.</span></div>
  <div class="kv"><span class="k">Rollback image</span><span class="v">An image of a known-good version, kept ON the VPS disk so you can roll back even when the registry is down.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Building on a small VPS costs 15 minutes, OOM 137 and 7.6 GB of disk; build on a strong machine, push to a registry, let the VPS only pull.</li>
<li>Built in one place, run in another: a glibc engine copied onto Alpine musl builds green, pushes green, then <code>Restarting (1)</code> — 8 times in 25 seconds.</li>
<li>The image check must actually LOAD the engine before <code>docker push</code>; tell "engine not found" from "database unreachable" by content, not exit code.</li>
<li><code>ldd</code> on a <code>.node</code> file exits 127 for both the wrong and the right engine — check by doing what production does.</li>
<li><code>--platform linux/amd64</code> on a Mac without emulation fails early; the <code>$BUILDPLATFORM</code> trick yields an amd64 image carrying an arm64 engine unless you name the target.</li>
<li>Prune images by the ledger of good deploys, not by creation date, and keep them on disk so you can roll back while the registry is down.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Working with the Container registry</span><span class="lc-sub">docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry — GHCR login, <code>read:packages</code>/<code>write:packages</code>, <code>GITHUB_TOKEN</code> in workflows.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Blog — Introducing GitHub Container Registry (01/09/2020)</span><span class="lc-sub">github.blog/news-insights/product-news/introducing-github-container-registry/ — when GHCR launched and why it split from the old GitHub Packages.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Distribution — registry:2</span><span class="lc-sub">distribution.github.io/distribution/ — the open-source registry used in the lab, speaking the same OCI protocol as GHCR.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — Multi-platform builds</span><span class="lc-sub">docs.docker.com/build/building/multi-platform/ — QEMU emulation, cross-compilation and the <code>BUILDPLATFORM</code>/<code>TARGETPLATFORM</code> variables.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — Prisma schema reference (binaryTargets)</span><span class="lc-sub">www.prisma.io/docs/orm/reference/prisma-schema-reference — the <code>binaryTargets</code> list and naming a target other than the build machine.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — the full course: multi-stage builds</span><span class="lc-sub">/courses/docker/learn${REF} — multi-stage builds, keeping build tools out of the runtime image.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.2</span>
<h2>Registry và dựng ở máy khác: chứng minh ảnh chạy được trước khi đẩy</h2>
<p class="lead">Dựng ảnh ngay trên một VPS 6 GB là tự bắn vào chân: Chương 8 đã đo cú giết OOM 137 và cái cache 7,6 GB làm đầy đĩa của Postgres. Cách chữa hiển nhiên — dựng ở máy mạnh, đẩy qua registry, VPS chỉ kéo về — mở ra một cửa hỏng mới: ảnh được dựng ở một nơi và CHẠY ở nơi khác. Ngày 18/08/2026 cửa đó làm API của dự án trả 502 suốt bảy phút. Bài này tái hiện đúng lỗi ấy bằng Prisma thật, viết cái chốt chặn nó TRƯỚC khi đẩy, đo cái bẫy tương tự khi Mac arm64 dựng cho VPS amd64, rồi dọn ảnh cũ mà không cắt mất đường lùi.</p>

<h3>Vì sao không dựng trên VPS</h3>
${slide('dv-13', 11, 'Build ở máy mạnh, VPS chỉ kéo về')}
<p>Cùng một dự án, hai nơi dựng — số liệu lấy từ hồ sơ của chính kho mã này (Chương 2.4 và Chương 8 đã kể chi tiết):</p>
<table>
<tr><th></th><th>dựng TRÊN VPS (<code>deploy.sh</code>)</th><th>dựng ở MÁY NHÀ (<code>deploy-nha.sh</code>)</th></tr>
<tr><td>thời gian</td><td>~15 phút, buộc phải lần lượt</td><td>3–6 phút, song song</td></tr>
<tr><td>RAM</td><td>dựng song song ⇒ <code>next build</code> bị OOM giết, mã 137 (06/07)</td><td>máy 31 GB, không đụng VPS</td></tr>
<tr><td>đĩa VPS</td><td>cache dựng 7,6 GB ⇒ <code>no space left on device</code> (18/08)</td><td>VPS không có cache dựng nào</td></tr>
<tr><td>thứ lên production</td><td>cây làm việc — kể cả tệp đang gõ dở</td><td>chỉ thứ đã commit (git push vào kho trần ở nhà)</td></tr>
<tr><td>khi máy dựng tắt</td><td>vẫn chạy</td><td>lùi về <code>deploy.sh</code> — đường lùi đã chạy thật</td></tr>
</table>
<p>Khung chung của mọi đường "dựng ở nơi khác", dù nơi đó là máy nhà hay một runner của GitHub Actions (Bài 13.3):</p>
<pre><code class="language-bash"># may dung (may nha / runner CI) — KHONG phai VPS
TAG=$(git rev-parse --short HEAD)                 # tag = ma commit
docker build -f Dockerfile.backend -t "$KHO/api:$TAG" .   # GHI RO Dockerfile
./chot-kiem-anh.sh "$KHO/api:$TAG"                # TRUOC khi day (o duoi)
docker push "$KHO/api:$TAG"
docker inspect -f '{{index .RepoDigests 0}}' "$KHO/api:$TAG"   # ghi digest vao so
ssh vps "deploy $TAG"                             # VPS: pull + trao (13.3, 13.4)</code></pre>
<p><strong>Registry</strong> (kho ảnh) là máy chủ HTTP lưu các lớp theo mã băm và các manifest (bản kê) theo tag. Chương 2.3 đã đo giao thức đẩy: lớp nào registry có rồi thì không đi lại. Trong phòng thí nghiệm dùng <code>registry:2</code> — phần mềm mã nguồn mở, cùng giao thức với GHCR và Docker Hub. Máy dựng (Mac) đẩy tới <code>localhost:19135</code>; VPS thí nghiệm kéo từ <code>dv13-reg:5000</code> — cùng một kho, hai địa chỉ, vì hai máy nhìn nó từ hai mạng khác nhau:</p>
<div class="out">$ docker inspect -f "{{index .RepoDigests 0}}" dv13-reg:5000/dat-lich:2bed0bb
dv13-reg:5000/dat-lich@sha256:3ee454488204cb6627094b9d113908811c522d437868cf43d52934875fa0b9a4
$ curl -s dv13-reg:5000/v2/dat-lich/tags/list
{"name":"dat-lich","tags":["latest","241f233","72f5fb8","2bed0bb","02f98c0","19efddb","2374533"]}
$ cat /etc/docker/daemon.json
{"insecure-registries":["dv13-reg:5000"],"log-driver":"json-file"}</div>
<p>Ba điều trong output đó. Một: <code>RepoDigests</code> là digest (mã băm nội dung) của ảnh — ghi nó vào sổ mỗi lần deploy, vì tag có thể bị đẩy đè còn digest thì không (Chương 2.3). Hai: API <code>/v2/…/tags/list</code> của registry cho bạn danh sách tag mà không cần <code>docker</code>. Ba: registry thí nghiệm nói HTTP trơn, nên dockerd của VPS phải khai nó là <code>insecure-registries</code> — chấp nhận được trong một mạng Docker riêng, KHÔNG BAO GIỜ ở ngoài đời. GHCR thật nói HTTPS và đòi đăng nhập; bài này chỉ in lệnh, không đăng nhập registry thật nào:</p>
<pre><code class="language-bash"># GHCR that — CHI IN RA, khong chay trong bai (khong dang nhap registry that)
echo "$CR_PAT" | docker login ghcr.io -u TEN_GITHUB --password-stdin   # PAT classic: write:packages
docker push ghcr.io/ten-github/dat-lich-api:$TAG
# tren VPS: token CHI DOC (read:packages), khong dung token cua may dung
echo "$CR_PAT_DOC" | docker login ghcr.io -u TEN_GITHUB --password-stdin</code></pre>
<div class="callout">
<p><strong>Hai token, hai quyền.</strong> Máy dựng cần <code>write:packages</code>; VPS chỉ cần <code>read:packages</code>. VPS bị chiếm với một token chỉ-đọc thì kẻ xâm nhập kéo được ảnh (vốn đã nằm trên máy) chứ không đẩy đè được ảnh production. Theo tài liệu GitHub (09/2026), GHCR chỉ nhận personal access token loại <em>classic</em>; trong workflow thì dùng <code>GITHUB_TOKEN</code> với <code>permissions: packages: write</code> (Bài 13.3).</p>
</div>

<h3>Build xanh, ảnh chết: tái hiện sự cố 18/08</h3>
${slide('dv-13', 12, 'Build xanh, ảnh chết: glibc chép sang musl')}
<p>Nhắc lại chuyện thật. Kho mã có hai Dockerfile: <code>Dockerfile.backend</code> (nền <code>node:22-slim</code> — Debian, thư viện C là <strong>glibc</strong>) mà compose dùng, và một <code>Dockerfile</code> trần cũ kết thúc ở <code>node:22-alpine</code> — Alpine, thư viện C là <strong>musl</strong>. Script dựng ở nhà gõ <code>docker build .</code>, tức lấy tệp mặc định. Ảnh ra kết thúc ở Alpine nhưng mang theo engine Prisma biên dịch cho glibc. Dựng xanh, đẩy xanh, tráo xanh — rồi backend khởi động lại vô tận và API 502 bảy phút.</p>
<p><strong>glibc và musl</strong> là hai bản thư viện C chuẩn — tầng mà gần như mọi chương trình biên dịch đều dựa vào. Một tệp nhị phân biên dịch cho cái này thường không nạp được trên cái kia. JavaScript thuần thì không quan tâm; nhưng engine của Prisma là một thư viện gốc (<code>.so.node</code>), và Prisma tải đúng bản theo nền của máy chạy <code>prisma generate</code>. Dựng ở nền này rồi chép <code>node_modules</code> sang nền kia là chép nhầm engine. Dựng lại đúng lỗi, với Prisma 5.22.0 như kho mã:</p>
<pre><code class="language-dockerfile"># SAI: dung o glibc, chay o musl
FROM node:22-slim AS dung
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends openssl &amp;&amp; rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY prisma ./prisma
RUN npx prisma generate
FROM node:22-alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=dung /app/node_modules ./node_modules
COPY prisma ./prisma
COPY kiem.js ./
CMD ["node", "kiem.js"]</code></pre>
<p>Và bản ĐÚNG — cả hai tầng cùng <code>node:22-alpine</code>, nên <code>prisma generate</code> tải engine musl. Chạy cả hai với một <code>DATABASE_URL</code> trỏ vào máy không tồn tại:</p>
<div class="out">$ docker run --rm -e DATABASE_URL=postgres://app:12345@khong-co:5432/app localhost:19135/dat-lich-api:sai
PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-arm64-openssl-3.0.x". | This happened because Prisma Client was generated for "linux-arm64-openssl-3.0.x", but the actual deployment required "linux-musl-arm64-openssl-3.0.x". | Add "linux-musl-arm64-openssl-3.0.x" to &#96;binaryTargets&#96; in the "schema.prisma" file and run &#96;prisma generate&#96; after saving it:
ma thoat 1
$ docker run --rm -e DATABASE_URL=postgres://app:12345@khong-co:5432/app localhost:19135/dat-lich-api:dung
PrismaClientInitializationError: Can't reach database server at &#96;khong-co:5432&#96; | Please make sure your database server is running at &#96;khong-co:5432&#96;.
ma thoat 1
$ docker image ls --format '{{.Tag}} {{.Size}}' localhost:19135/dat-lich-api
dung 358MB
sai 358MB</div>
<p>Đọc kỹ, vì đây là chỗ mà mắt vội sẽ bỏ qua: <strong>cả hai đều thoát 1</strong>, và hai ảnh cùng 358 MB. Chỉ NỘI DUNG lỗi mới phân biệt được. Ảnh sai: "could not locate the Query Engine … generated for linux-arm64 … required linux-musl-arm64" — engine không nạp được, ảnh hỏng hẳn. Ảnh đúng: "Can't reach database server" — engine đã nạp xong và chỉ còn thiếu cơ sở dữ liệu, tức ảnh lành. Đó sẽ là nền của cái chốt kiểm ở dưới.</p>
<p>Một lỗi phụ lần dựng đầu cũng đáng ghi, vì nó rất hay gặp khi chuyển sang Alpine: ảnh Alpine không có sẵn OpenSSL, và Prisma đoán bừa phiên bản:</p>
<div class="out"># lan dung dau tien — anh Alpine CHUA co openssl:
prisma:warn Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-1.1.x".
PrismaClientInitializationError: Unable to require(&#96;/app/node_modules/.prisma/client/libquery_engine-linux-musl-arm64-openssl-1.1.x.so.node&#96;). … Details: Error loading shared library libssl.so.1.1: No such file or directory</div>
<p>Cách chữa là <code>apk add openssl</code> ở CẢ tầng dựng lẫn tầng chạy (như tệp ở trên). Lỗi này cho thấy chuyện ảnh "na ná nhau" không đủ: một thư viện hệ thống thiếu là engine không nạp.</p>

<h3>Restarting (1): cái vòng mà không bước nào thấy</h3>
${slide('dv-13', 13, 'Restarting (1): cái vòng không ai nhìn thấy')}
<p>Đưa ảnh sai lên VPS thí nghiệm, với chính sách restart đúng như Bài 13.1 khuyên:</p>
<div class="out">$ docker run -d --name api-sai --restart unless-stopped -e DATABASE_URL=… dv13-reg:5000/dat-lich-api:sai
$ sleep 25
$ docker ps --filter name=api-sai --format "{{.Names}}  {{.Status}}"
api-sai  Restarting (1) 8 seconds ago
$ docker inspect -f "{{.RestartCount}}" api-sai
8
$ docker logs --tail 1 api-sai
PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-arm64-openssl-3.0.x". | …</div>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">docker build — xanh</span><span class="lz-d">Dockerfile không có bước nào CHẠY engine; chép tệp sai vẫn là chép thành công.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">docker push — xanh</span><span class="lz-d">registry nhận byte và kiểm mã băm, không chạy gì.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">docker compose up -d — xanh</span><span class="lz-d">container "Started" rồi mới chết; lệnh đã trả về.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">restart: unless-stopped — làm đúng việc</span><span class="lz-d">bật lại, chết, bật lại; <code>RestartCount</code> tăng dần.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">nginx — 502</span><span class="lz-d">tới khi có người đọc log và lùi bản. Chốt kiểm phải chen vào GIỮA bước 1 và bước 2.</span></div>
</div>
<p>8 lần khởi động lại trong 25 giây, và không có con số nào trong toàn bộ đường ống chuyển sang đỏ. Đi lại từng bước để thấy vì sao: <code>docker build</code> xanh vì Dockerfile không có bước nào CHẠY engine; <code>docker push</code> xanh vì registry chỉ nhận byte; <code>docker compose up -d</code> xanh vì container đã "Started" trước khi nó chết; <code>restart: unless-stopped</code> làm đúng việc của nó là bật lại, mãi mãi; và nginx trả 502 tới khi có người đọc log. Đó là lý do chung của cả khoá: <strong>không bước nào hỏi "ảnh này chạy được không"</strong>, nên câu hỏi đó phải có chỗ đứng riêng — trước <code>docker push</code>, khi production chưa bị đụng tới.</p>
<div class="callout warn">
<p><strong><code>Restarting (1)</code> đọc thế nào.</strong> Số trong ngoặc là mã thoát của lần chết gần nhất. <code>RestartCount</code> tăng dần; Docker giãn khoảng chờ giữa các lần (gấp đôi dần, bắt đầu từ 100 ms) nên một vòng lặp càng lâu càng thưa. Thấy trạng thái này ngay sau deploy thì đọc <code>docker logs --tail 20</code> TRƯỚC, rồi lùi bản — đừng khởi động lại thêm.</p>
</div>

<h3>Chốt kiểm ảnh: chạy engine trước khi đẩy</h3>
${slide('dv-13', 14, 'Chốt kiểm ảnh: chạy engine trước khi đẩy')}
<p>Chốt này có hai tầng. Tầng một rẻ và giống chốt thật trong <code>deploy-nha.sh</code>: đọc libc của ảnh (có <code>/lib/ld-musl-*</code> là musl) và tên engine trong <code>node_modules/.prisma/client/</code>, rồi so. Tầng hai là tầng quyết định: <strong>nạp thật</strong> engine bằng <code>$connect()</code> tới một cơ sở dữ liệu không tồn tại, và chỉ chấp nhận đúng câu lỗi "Can't reach database server".</p>
<pre><code class="language-bash">#!/bin/bash
# chot-kiem-anh.sh ANH — tu choi day mot anh khong chay noi (chay TRUOC docker push)
set -Eeuo pipefail
ANH=\${1:?can ten anh}
# 1) libc cua anh vs engine Prisma nam trong anh (nhu deploy-nha.sh)
read -r LIBC ENGINE &lt; &lt;(docker run --rm --entrypoint sh "$ANH" -c '
  if ls /lib/ld-musl-* &gt;/dev/null 2&gt;&amp;1; then printf "musl "; else printf "glibc "; fi
  ls node_modules/.prisma/client/ | grep -o "libquery_engine-[^ ]*" | head -1')
case "$ENGINE" in *musl*) E=musl ;; libquery_engine-*) E=glibc ;; *) E=khong-thay ;; esac
echo "anh: $LIBC · engine: $E ($ENGINE)"
[ "$LIBC" = "$E" ] || { echo "HONG: nen $LIBC mang engine $E"; exit 1; }
# 2) NAP THAT engine: tro vao mot CSDL khong ton tai — loi mong doi la "khong noi duoc"
OUT=$(docker run --rm -e DATABASE_URL=postgres://x:x@127.0.0.1:1/x "$ANH" \\
      node -e "new (require('@prisma/client').PrismaClient)().\\$connect().catch(e=&gt;{console.log(e.message);process.exit(1)})" 2&gt;&amp;1 || true)
case "$OUT" in
  *"Can't reach database server"*) echo "OK: engine nap duoc (loi con lai chi la khong co CSDL)" ;;
  *) echo "HONG: engine khong nap duoc:"; echo "$OUT" | head -3; exit 1 ;;
esac</code></pre>
<div class="out">$ ./chot-kiem-anh.sh localhost:19135/dat-lich-api:sai
anh: musl · engine: glibc (libquery_engine-linux-arm64-openssl-3.0.x.so.node)
HONG: nen musl mang engine glibc
ma thoat 1
$ ./chot-kiem-anh.sh localhost:19135/dat-lich-api:dung
anh: musl · engine: musl (libquery_engine-linux-musl-arm64-openssl-3.0.x.so.node)
OK: engine nap duoc (loi con lai chi la khong co CSDL)
ma thoat 0</div>
<p>Vì sao cần tầng hai khi tầng một đã bắt được? Vì tầng một chỉ biết đúng MỘT kiểu hỏng (musl/glibc). Thiếu <code>libssl</code> (lỗi phụ ở trên), sai kiến trúc CPU (mục dưới), sai phiên bản OpenSSL — tầng một đều cho qua, tầng hai đều bắt. Nguyên tắc chung: <strong>phép kiểm tốt nhất là làm đúng việc mà production sẽ làm, ở quy mô nhỏ nhất</strong>. Với ứng dụng không dùng Prisma, "việc production làm" có thể là <code>node -e "require('./dist/index.js')"</code> với cờ chỉ khởi tạo, hoặc chạy ảnh và gọi <code>/api/health</code> trong mười giây.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — <code>ldd</code> trên tệp <code>.node</code> không phân biệt được sai với đúng.</strong> Ý nghĩ tự nhiên là "kiểm thư viện liên kết bằng <code>ldd</code>". Đo trên hai ảnh:</p>
<div class="out">$ for t in sai dung; do docker run --rm --entrypoint sh …:$t -c '
    ldd node_modules/.prisma/client/*.so.node &gt; /tmp/l.txt 2&gt;&amp;1; echo "ldd ma thoat $?"
    grep -c "symbol not found" /tmp/l.txt; grep -v "symbol not found" /tmp/l.txt | head -3'; done
== sai
ldd ma thoat 127
65
	/lib/ld-musl-aarch64.so.1 (0xffff9eaf0000)
	libssl.so.3 =&gt; /usr/lib/libssl.so.3 (0xffff9dc7d000)
	libcrypto.so.3 =&gt; /usr/lib/libcrypto.so.3 (0xffff9d817000)
== dung
ldd ma thoat 127
62
	/lib/ld-musl-aarch64.so.1 (0xffffa7080000)
	libssl.so.3 =&gt; /usr/lib/libssl.so.3 (0xffffa61f7000)
	libcrypto.so.3 =&gt; /usr/lib/libcrypto.so.3 (0xffffa5d91000)</div>
<p>Hai engine, một kết quả: <code>ldd</code> thoát <strong>127</strong> với CẢ HAI, in 65 và 62 dòng <code>symbol not found</code>, và phần thư viện thì "tìm thấy" đủ ở cả hai (<code>ldd</code> của musl ánh xạ luôn <code>libc.so.6</code> của glibc sang chính nó). Lý do: các hàm <code>napi_*</code> do tiến trình <code>node</code> cung cấp lúc nạp addon, không nằm trong thư viện nào, nên <code>ldd</code> đứng một mình luôn thấy thiếu. Một bộ kiểm luôn đỏ thì hoặc chặn mọi lần deploy, hoặc bị người ta bỏ qua — cả hai đều vô dụng. (Lần đo đầu tôi đọc được "ldd thoát 0" — đó là mã thoát của <code>tail</code> ở cuối ống dẫn, không phải của <code>ldd</code>. Kiểm lại bộ kiểm.) Hãy kiểm bằng việc thật (tầng hai).</p>
</div>

<h3>Mac arm64 dựng cho VPS amd64</h3>
${slide('dv-13', 15, 'Mac arm64 → VPS amd64: build xanh vẫn sai')}
<p>Chương 2.4 đã đo: trên chiếc Mac M1 này Docker Desktop chưa bật giả lập amd64, nên một lần dựng <code>--platform linux/amd64</code> hỏng ngay ở lệnh <code>RUN</code> đầu tiên. Đo lại hôm nay, vẫn vậy (bài KHÔNG đổi cấu hình Docker Desktop để bật giả lập):</p>
<div class="out">$ uname -m
arm64
$ docker build --platform linux/amd64 -f Dockerfile.run .      # Dockerfile.run: FROM alpine:3.20 / RUN uname -m &gt; /kien-truc
#5 0.329 exec /bin/sh: exec format error
#5 ERROR: process "/bin/sh -c uname -m &gt; /kien-truc" did not complete successfully: exit code: 255</div>
<p>Đó là kết cục tốt — hỏng to, hỏng sớm. Có một mẹo phổ biến để "dựng cho amd64 mà không cần giả lập": chạy tầng dựng ở kiến trúc của máy dựng bằng <code>--platform=$BUILDPLATFORM</code>, rồi chép kết quả sang tầng cuối (kiến trúc đích) không có <code>RUN</code> nào:</p>
<pre><code class="language-dockerfile"># Dung o kien truc cua MAY DUNG, anh cuoi cho kien truc DICH — tang cuoi KHONG co RUN
FROM --platform=$BUILDPLATFORM node:22-alpine AS dung
RUN apk add --no-cache openssl
WORKDIR /app
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY prisma ./prisma
RUN npx prisma generate
FROM node:22-alpine
WORKDIR /app
COPY --from=dung /app/node_modules ./node_modules
COPY prisma ./prisma
COPY kiem.js ./
CMD ["node", "kiem.js"]</code></pre>
<div class="out">$ docker build --platform linux/amd64 -f Dockerfile.cheo -t localhost:19135/dat-lich-api:cheo .
#18 naming to localhost:19135/dat-lich-api:cheo done
#18 DONE 2.8s
ma thoat 0
$ docker image inspect -f "{{.Os}}/{{.Architecture}}" localhost:19135/dat-lich-api:cheo
linux/amd64
$ docker create …:cheo &amp;&amp; docker cp &lt;id&gt;:/app/node_modules/.prisma/client - | tar -t | grep node$
client/libquery_engine-linux-musl-arm64-openssl-3.0.x.so.node
# schema.prisma: binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
$ … | tar -t | grep node$
client/libquery_engine-linux-musl-arm64-openssl-3.0.x.so.node
client/libquery_engine-linux-musl-openssl-3.0.x.so.node</div>
<p>2,8 giây, xanh, và <code>docker image inspect</code> nói <code>linux/amd64</code>. Nhưng engine bên trong là bản <strong>arm64</strong> — vì <code>prisma generate</code> chạy ở tầng arm64. Đẩy ảnh này lên VPS x86 là lặp lại đúng slide 13, chỉ khác chữ trong log. Mẹo <code>$BUILDPLATFORM</code> chỉ an toàn khi MỌI thứ tầng dựng tạo ra không phụ thuộc CPU (JavaScript đã đóng gói, tệp tĩnh, một nhị phân Go biên dịch chéo với <code>GOARCH=$TARGETARCH</code>). Có thư viện gốc thì phải khai rõ đích — với Prisma là <code>binaryTargets</code>, và output cuối cho thấy engine <code>linux-musl-openssl-3.0.x</code> (x86-64) đã có mặt. Chốt kiểm ảnh ở trên chạy container nên bắt được mọi kiểu lệch này — nếu chạy trên máy CÙNG kiến trúc với VPS (runner <code>ubuntu-24.04</code> của GitHub là x86-64; Bài 13.3).</p>
<table>
<tr><th>Cách dựng cho amd64 từ Mac arm64</th><th>Nhanh</th><th>Đúng với thư viện gốc</th><th>Khi nào dùng</th></tr>
<tr><td>giả lập QEMU (bật trong Docker Desktop)</td><td>chậm hơn nhiều (giả lập từng lệnh CPU)</td><td>có</td><td>thỉnh thoảng, dự án nhỏ</td></tr>
<tr><td><code>$BUILDPLATFORM</code> + tầng cuối không RUN</td><td>nhanh</td><td><strong>không</strong>, trừ khi khai đích</td><td>chỉ tạo tác thuần JS/tĩnh/Go</td></tr>
<tr><td>dựng trên máy x86 thật (máy nhà Fedora, runner CI)</td><td>nhanh</td><td>có</td><td>đường chuẩn của dự án</td></tr>
</table>

<h3>Dọn ảnh cũ mà vẫn còn đường lùi</h3>
${slide('dv-13', 16, 'Dọn ảnh cũ mà vẫn còn đường lùi')}
<p>Mỗi lần deploy để lại một ảnh trên đĩa VPS. Không dọn thì đĩa đầy (Chương 8.4); dọn bằng <code>docker image prune -a</code> thì xoá luôn mọi ảnh không có container đang chạy — tức xoá đường lùi mà Chương 6.1 dựa vào. Bản dọn đầu tiên tôi viết giữ 3 ảnh mới nhất theo NGÀY TẠO:</p>
<div class="out"># ban DAU: giu 3 anh MOI NHAT theo ngay tao
$ ~/bin/don-anh.sh 3
xoa dv13-reg:5000/dat-lich:02f98c0
xoa dv13-reg:5000/dat-lich:241f233
xoa dv13-reg:5000/dat-lich:2374533
$ docker images dv13-reg:5000/dat-lich --format "{{.Tag}}  {{.CreatedSince}}"
19efddb  7 minutes ago
2bed0bb  12 minutes ago
latest  12 minutes ago
72f5fb8  12 minutes ago</div>
<p>Nhìn lại danh sách giữ: <code>19efddb</code> là bản v6 hỏng (Bài 13.4 đo nó chết lúc khởi động) — mới nhất, nên được giữ làm "đường lùi". Trong khi <code>241f233</code>, một bản đã chạy tốt, bị xoá. Tuổi của ảnh không nói ảnh có tốt không. Thứ nói được là sổ <code>da-len.log</code>, mà script deploy chỉ ghi SAU khi smoke-test đạt (Bài 13.3). Bản sửa giữ theo sổ:</p>
<pre><code class="language-bash">#!/bin/bash
# don-anh.sh [GIU=3] — giu anh dang chay + cac ban DA LEN TOT gan nhat (theo da-len.log), xoa phan con lai
set -Eeuo pipefail
KHO=dv13-reg:5000/dat-lich; GIU=\${1:-3}
GIU_LAI=$(tac ~/dat-lich/da-len.log | awk '{print $2}' | awk '!thay[$0]++' | head -n "$GIU")
DANG=$(docker inspect -f '{{.Config.Image}}' dat-lich-api-1); DANG=\${DANG##*:}
for T in $(docker images "$KHO" --format '{{.Tag}}'); do
  [ "$T" = "$DANG" ] &amp;&amp; continue
  grep -qx "$T" &lt;&lt;&lt; "$GIU_LAI" &amp;&amp; { echo "giu $T"; continue; }
  echo "xoa $T"; docker rmi "$KHO:$T" &gt;/dev/null
done</code></pre>
<div class="out">$ tail -4 ~/dat-lich/da-len.log
2026-09-29T08:23:54+00:00 02f98c0
2026-09-29T08:24:01+00:00 241f233
2026-09-29T08:24:08+00:00 2bed0bb
2026-09-29T08:24:15+00:00 72f5fb8
$ docker images dv13-reg:5000/dat-lich --format "{{.Tag}}" | tr "\\n" " "
19efddb 2bed0bb 02f98c0 72f5fb8 241f233 2374533
$ ~/bin/don-anh.sh 3
xoa 19efddb
giu 2bed0bb
xoa 02f98c0
giu 241f233
xoa 2374533
$ docker images … --format "{{.Tag}}"
2bed0bb 72f5fb8 241f233</div>
<p>Giờ đường lùi là những bản đã từng phục vụ thật, và <code>docker rmi</code> gọi đúng tên từng ảnh — không có lệnh <code>prune</code> nào không có bộ lọc. Và đây là lý do phải giữ chúng TRÊN ĐĨA, không chỉ trên registry:</p>
<div class="out"># registry dang SAP (docker stop dv13-reg)
$ docker pull dv13-reg:5000/dat-lich:2bed0bb
Error response from daemon: failed to resolve reference "dv13-reg:5000/dat-lich:2bed0bb": failed to do request: Head "ht…
$ sed -i s/^TAG=.*/TAG=2bed0bb/ .env &amp;&amp; docker compose up -d --pull never --wait api
 Container dat-lich-api-1  Healthy
  (6734 ms) — v5
$ sed -i s/^TAG=.*/TAG=02f98c0/ .env &amp;&amp; docker compose up -d --pull never --wait api
Error response from daemon: No such image: dv13-reg:5000/dat-lich:02f98c0
  ma thoat 1</div>
<p>Registry sập (hay GHCR có sự cố, hay token hết hạn) đúng lúc bạn cần lùi: ảnh còn trên đĩa thì <code>--pull never</code> đưa bạn về trong 6,7 giây; ảnh đã bị dọn thì chỉ còn ngồi chờ.</p>

<h3>Khi nào dùng registry / khi nào KHÔNG</h3>
<ul>
<li><strong>Nên:</strong> ứng dụng có runtime cần ghim (Node, Python có thư viện gốc), VPS nhỏ, nhiều hơn một máy chạy, hoặc có CI. Đây là đường của dự án.</li>
<li><strong>Không cần:</strong> trang tĩnh (rsync thư mục <code>out/</code> là đủ — Chương 2.1), một nhị phân Go duy nhất, hay đồ án chỉ sống hai tuần. Registry là thêm một bộ phận có thể sập.</li>
<li><strong>Thay thế không registry:</strong> <code>docker save anh | ssh vps docker load</code> chở cả ảnh mỗi lần (không khử trùng lặp lớp như Chương 2.3) — hợp khi VPS không được ra Internet.</li>
</ul>

<h3>Trên Windows/WSL và macOS khác gì</h3>
<ul>
<li><strong>Mac M1/M2/M3 và Windows ARM là arm64</strong>; hầu hết VPS là x86-64. Luôn kiểm <code>docker image inspect -f '{{.Architecture}}'</code> trước khi đẩy, và chạy chốt kiểm ảnh trên một máy CÙNG kiến trúc với VPS.</li>
<li><strong>Windows + WSL2:</strong> dựng trong WSL (Linux x86-64) thì cùng kiến trúc với VPS; nhưng mã nằm ở <code>/mnt/c/…</code> làm bước <code>COPY</code> và <code>npm install</code> chậm hẳn — để mã trong hệ tệp của WSL.</li>
<li><strong>Đăng nhập registry trên máy dùng chung</strong>: <code>docker login</code> ghi token vào <code>~/.docker/config.json</code> (trên Mac thì vào Keychain qua credential helper). Đừng đăng nhập bằng token ghi của bạn trên máy phòng lab của trường.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn cùng nhóm "tối ưu kích thước" bằng cách đổi tầng cuối của Dockerfile sang <code>node:22-alpine</code> nhưng giữ tầng dựng là <code>node:22-slim</code>. Dựng xanh. Hãy chứng minh ảnh đó không bao giờ được phép tới VPS.</p>
<ol>
<li>Tạo dự án Prisma nhỏ (một model, <code>prisma@5.22.0</code>) và hai Dockerfile SAI/ĐÚNG như trên; dựng cả hai, đẩy lên <code>registry:2</code> ở <code>127.0.0.1:19135</code>.</li>
<li>Chạy cả hai với <code>DATABASE_URL</code> trỏ vào máy không tồn tại; ghi mã thoát và dòng lỗi đầu tiên của mỗi cái.</li>
<li>Viết <code>chot-kiem-anh.sh</code> hai tầng và chạy trên cả hai; rồi thử <code>ldd</code> trên engine của cả hai và ghi lại vì sao nó không dùng được.</li>
<li>Trên VPS thí nghiệm, tạo sổ <code>da-len.log</code> và chạy <code>don-anh.sh 3</code>; dừng registry rồi lùi về một bản còn trên đĩa bằng <code>--pull never</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> chốt kiểm thoát 1 với ảnh sai và 0 với ảnh đúng, bạn giải thích được vì sao "cả hai đều thoát 1" khi chạy trơn, và cú lùi <code>--pull never</code> thành công trong lúc registry đang tắt.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Registry (kho ảnh)</span><span class="v">Máy chủ lưu lớp và manifest của ảnh: GHCR, Docker Hub, hay <code>registry:2</code> tự chạy.</span></div>
  <div class="kv"><span class="k">Digest (mã băm nội dung)</span><span class="v">sha256 của manifest — gọi tên đúng một bộ byte mãi mãi, khác với tag dời được.</span></div>
  <div class="kv"><span class="k">glibc / musl (thư viện C)</span><span class="v">Hai bản thư viện C chuẩn của Debian/Ubuntu và của Alpine; nhị phân của bên này thường không chạy ở bên kia.</span></div>
  <div class="kv"><span class="k">Native addon (thư viện gốc của Node)</span><span class="v">Tệp <code>.node</code> biên dịch sẵn cho một hệ điều hành, libc và CPU cụ thể — như engine Prisma.</span></div>
  <div class="kv"><span class="k">Pre-push check (chốt kiểm trước khi đẩy)</span><span class="v">Chạy thử ảnh ở quy mô nhỏ nhất trước <code>docker push</code>, để lỗi dừng ở máy dựng.</span></div>
  <div class="kv"><span class="k">$BUILDPLATFORM / --platform (kiến trúc dựng/đích)</span><span class="v">Nền của máy đang dựng và nền ảnh sẽ chạy; lệch mà có thư viện gốc là hỏng.</span></div>
  <div class="kv"><span class="k">Restart loop (vòng khởi động lại)</span><span class="v"><code>Restarting (1)</code>: container chết ngay khi lên, restart policy bật lại mãi.</span></div>
  <div class="kv"><span class="k">Rollback image (ảnh để lùi)</span><span class="v">Ảnh của bản đã chạy tốt, giữ TRÊN ĐĨA VPS để lùi được cả khi registry sập.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dựng trên VPS nhỏ tốn 15 phút, OOM 137 và 7,6 GB đĩa; dựng ở máy mạnh rồi đẩy registry, VPS chỉ kéo về.</li>
<li>Dựng ở nơi này, chạy ở nơi khác: engine glibc chép sang Alpine musl dựng xanh, đẩy xanh, rồi <code>Restarting (1)</code> — 8 lần trong 25 giây.</li>
<li>Chốt kiểm ảnh phải NẠP thật engine trước <code>docker push</code>; phân biệt "không tìm thấy engine" với "không với tới CSDL" bằng nội dung, không bằng mã thoát.</li>
<li><code>ldd</code> trên tệp <code>.node</code> thoát 127 với cả engine sai lẫn đúng — kiểm bằng việc production sẽ làm.</li>
<li><code>--platform linux/amd64</code> từ Mac không giả lập thì hỏng sớm; mẹo <code>$BUILDPLATFORM</code> ra ảnh amd64 mang engine arm64 nếu không khai đích.</li>
<li>Dọn ảnh theo sổ bản đã lên tốt, không theo ngày tạo, và giữ chúng trên đĩa để lùi được cả khi registry sập.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Working with the Container registry</span><span class="lc-sub">docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry — đăng nhập GHCR, quyền <code>read:packages</code>/<code>write:packages</code>, <code>GITHUB_TOKEN</code> trong workflow.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Blog — Introducing GitHub Container Registry (01/09/2020)</span><span class="lc-sub">github.blog/news-insights/product-news/introducing-github-container-registry/ — ngày GHCR ra mắt và vì sao nó tách khỏi GitHub Packages cũ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Distribution — registry:2</span><span class="lc-sub">distribution.github.io/distribution/ — phần mềm registry mã nguồn mở dùng trong phòng thí nghiệm, cùng giao thức OCI với GHCR.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — Multi-platform builds</span><span class="lc-sub">docs.docker.com/build/building/multi-platform/ — giả lập QEMU, biên dịch chéo và các biến <code>BUILDPLATFORM</code>/<code>TARGETPLATFORM</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — Prisma schema reference (binaryTargets)</span><span class="lc-sub">www.prisma.io/docs/orm/reference/prisma-schema-reference — danh sách <code>binaryTargets</code> và cách khai đích khác máy dựng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — khoá đầy đủ: bản dựng nhiều tầng</span><span class="lc-sub">/courses/docker/learn${REF} — multi-stage build, giữ công cụ dựng ngoài ảnh chạy.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 13.3 ─────────────────────────── */
    {
      title: '13.3 — Deploying from GitHub Actions over SSH: one key, one command, one deploy at a time|||13.3 — Deploy từ GitHub Actions qua SSH: một khoá, một lệnh, mỗi lần một deploy',
      slug: 'deploy-13-3-github-actions-deploy',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một workflow đầy đủ build → chốt kiểm → push GHCR → ssh tráo, rồi ba thứ quyết định nó an toàn hay không: khoá CI chỉ chạy được MỘT lệnh (đo: một OK, bốn từ chối), known_hosts ghim sẵn, và concurrency — thứ chỉ xếp hàng trong một nhóm, nên hai workflow vẫn đua nhau như chuyện 03/07 và 06/07 của dự án.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.3</span>
<h2>Deploying from GitHub Actions over SSH: one key, one command, one deploy at a time</h2>
<p class="lead">Lesson 13.2 built and checked the image at home. Doing the same on a GitHub Actions runner means a deploy no longer depends on whose laptop is open — but now SOMEONE ELSE's machine holds an SSH key to your VPS, and there may be two such machines running at once. This lesson writes the complete build → check → push → ssh-swap workflow, then measures the three things that decide whether it is safe: a CI key that can run only ONE command, a pinned known_hosts, and <code>concurrency</code> — which this project once believed "prevents overlapping runs", and it does not.</p>

<h3>A little history, and why this lesson does not run on the real GitHub</h3>
<p>GitHub Actions gained CI/CD on 08/08/2019; the <code>ubuntu-24.04</code> runner is an x86-64 machine GitHub gives each job and wipes afterwards. Workflow syntax — <code>on</code>, <code>jobs</code>, <code>steps</code>, <code>uses</code>, the <code>\${{ … }}</code> expressions — belongs to <code>/courses/github-actions</code>; here we only discuss the lines that decide the deploy.</p>
<p>Per the course contract, this lesson creates no repository, no secret, and runs no workflow on the real GitHub. The <code>act</code> tool (runs workflows locally in Docker) was not installed on the machine used to write it, and nothing was installed. Instead: the YAML is syntax-checked with js-yaml, and the deploy step's <code>run:</code> block — the only part that actually touches the VPS — is run for real from the Mac against the lab VPS:</p>
<div class="out">$ node -e "const y=require('js-yaml'); const d=y.load(fs.readFileSync('deploy.yml','utf8')); …"
YAML hop le · jobs: build, deploy · buoc: 7+1 · on: [ 'workflow_dispatch' ]
$ command -v act || echo "khong co act"
khong co act</div>

<h3>The complete workflow, block by block</h3>
${slide('dv-13', 17, 'Workflow (1/2): build, chốt kiểm rồi mới push')}
${slide('dv-13', 18, 'Workflow (2/2): một khoá, một lệnh, một máy')}
<pre><code class="language-yaml">name: deploy
on:
  workflow_dispatch:            # bam tay — KHONG deploy khi push
permissions:
  contents: read
  packages: write               # de GITHUB_TOKEN day duoc len GHCR
concurrency:
  group: deploy-production      # moi workflow deploy dung CHUNG ten nay
  cancel-in-progress: false     # dang chay thi de chay xong
jobs:
  build:
    runs-on: ubuntu-24.04
    env:
      IMG: ghcr.io/\${{ github.repository }}/api
    outputs:
      tag: \${{ steps.tag.outputs.tag }}
    steps:
      - uses: actions/checkout@v7
      - id: tag
        run: |
          echo "tag=\${GITHUB_SHA::7}" &gt;&gt; "$GITHUB_OUTPUT"
          echo "TAG=\${GITHUB_SHA::7}" &gt;&gt; "$GITHUB_ENV"
      - uses: docker/setup-buildx-action@v4
      - uses: docker/login-action@v4
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v7
        with:
          context: .
          file: Dockerfile.backend
          platforms: linux/amd64
          load: true
          tags: \${{ env.IMG }}:\${{ env.TAG }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
      - name: Chot kiem anh truoc khi day
        run: ./scripts/chot-kiem-anh.sh "$IMG:$TAG"
      - name: Day anh
        run: docker push "$IMG:$TAG"
  deploy:
    needs: build
    runs-on: ubuntu-24.04
    environment: production     # duyet tay + secret chi mo sau khi duyet
    timeout-minutes: 10
    steps:
      - name: Tra anh tren VPS qua SSH
        env:
          KHOA: \${{ secrets.VPS_CI_KEY }}
          KNOWN_HOSTS: \${{ secrets.VPS_KNOWN_HOSTS }}
          VPS: \${{ vars.VPS_HOST }}
          TAG: \${{ needs.build.outputs.tag }}
        run: |
          install -m 700 -d ~/.ssh
          printf '%s\\n' "$KHOA" &gt; ~/.ssh/ci &amp;&amp; chmod 600 ~/.ssh/ci
          printf '%s\\n' "$KNOWN_HOSTS" &gt; ~/.ssh/known_hosts
          ssh -i ~/.ssh/ci -o StrictHostKeyChecking=yes -o BatchMode=yes \\
              "deploy@$VPS" "deploy $TAG"</code></pre>
<table>
<tr><th>Block</th><th>Why it is there</th></tr>
<tr><td><code>on: workflow_dispatch</code></td><td>runs only when someone clicks (or <code>gh workflow run deploy</code>). A push to <code>main</code> does NOT deploy — why, at the end of the lesson.</td></tr>
<tr><td><code>permissions: packages: write</code></td><td>the <code>GITHUB_TOKEN</code> generated for each run can push to GHCR; no PAT needed. <code>contents: read</code> keeps it from holding anything else.</td></tr>
<tr><td><code>concurrency: group: deploy-production</code></td><td>within THIS group there are never two runs at once — see the <code>concurrency</code> section for what it does NOT do.</td></tr>
<tr><td><code>cancel-in-progress: false</code></td><td>a run that is swapping gets to finish; cancelling a swap midway leaves the machine half done.</td></tr>
<tr><td><code>runs-on: ubuntu-24.04</code></td><td>x86-64 like the VPS ⇒ the image check runs on the right architecture (13.2).</td></tr>
<tr><td><code>file: Dockerfile.backend</code></td><td>names the file EXPLICITLY — the exact line the 18/08 incident lacked.</td></tr>
<tr><td><code>load: true</code>, then <code>docker push</code></td><td>build into the runner, run the check, push ONLY if it passes. <code>push: true</code> would push before anyone checked anything.</td></tr>
<tr><td><code>cache-from/to: type=gha</code></td><td>layer cache stored at GitHub between runs — the runner is brand new every time.</td></tr>
<tr><td><code>environment: production</code></td><td>the swap job waits for a reviewer; the environment's secrets open only AFTER approval.</td></tr>
<tr><td><code>timeout-minutes: 10</code></td><td>a hung ssh must not hold the concurrency group for hours (the default is 360 minutes).</td></tr>
</table>
<div class="callout">
<p><strong>Action versions (as of 09/2026, read from their release pages):</strong> <code>actions/checkout</code> v7, <code>docker/setup-buildx-action</code> v4, <code>docker/login-action</code> v4, <code>docker/build-push-action</code> v7. Pinning to the major version (<code>@v7</code>) is the minimum; careful repositories pin to the action's commit SHA so no one can overwrite code that runs with your GHCR write permission.</p>
</div>
<p>Running the only part that touches the VPS — the deploy step's <code>run:</code> block — with exactly the variables GitHub would pass, in a fake HOME so the Mac's real <code>~/.ssh</code> is untouched:</p>
<div class="out"># khoi run: cua buoc deploy, chay tren Mac voi HOME gia trong thu muc nhap (khong dung ~/.ssh that);
# chi them -p 19132 va UserKnownHostsFile="$HOME/…" vi VPS thi nghiem nghe cong 19132
$ HOME=… KHOA="$(cat khoa-ci)" KNOWN_HOSTS="$(ssh-keyscan …)" VPS=127.0.0.1 TAG=72f5fb8 bash -e buoc-deploy.sh
[08:26:36] 2bed0bb -&gt; 72f5fb8
[08:26:44] OK: dang chay 72f5fb8
ma thoat 0</div>

<h3>Secrets: what lives where</h3>
<table>
<tr><th>Name</th><th>Kind</th><th>Content</th></tr>
<tr><td><code>GITHUB_TOKEN</code></td><td>generated, lives for one run</td><td>pushes to GHCR (via <code>permissions</code>)</td></tr>
<tr><td><code>VPS_CI_KEY</code></td><td>secret of the <code>production</code> environment</td><td>a PRIVATE ed25519 key used only by CI</td></tr>
<tr><td><code>VPS_KNOWN_HOSTS</code></td><td>secret (or variable — it can be public)</td><td>one verified host-key line</td></tr>
<tr><td><code>VPS_HOST</code></td><td>variable</td><td>the VPS address</td></tr>
</table>
<p>GitHub masks secret values in logs (printed as <code>***</code>), but only when the string appears VERBATIM — a base64-encoded or split secret leaks. Environment secrets are released only to jobs that name that environment, after its rules (reviewers) pass. Create the key once on your machine:</p>
<pre><code class="language-bash"># tren may CUA BAN, mot lan: khoa rieng cho CI, khong mat khau (CI khong go duoc)
ssh-keygen -t ed25519 -N '' -C deploy-ci -f ./khoa-ci
# khoa CONG KHAI -&gt; VPS, kem command=…,restrict
# khoa BI MAT   -&gt; GitHub: Settings › Secrets › Actions › VPS_CI_KEY  (roi XOA tep khoa-ci)
ssh-keyscan -t ed25519 -p 22 IP_VPS    # doc van tay, DOI CHIEU voi /etc/ssh/*.pub tren VPS
# dong do -&gt; secret VPS_KNOWN_HOSTS</code></pre>

<h3>A CI key that can run ONE command</h3>
${slide('dv-13', 19, 'Khoá CI chỉ chạy được MỘT lệnh')}
<p>If the CI key's line in <code>authorized_keys</code> is as bare as your own, then anyone who reads the <code>VPS_CI_KEY</code> secret — a compromised action, a teammate who can edit workflows, a log that printed too much — has a shell on production. <code>sshd</code> lets you attach options to EACH key:</p>
<pre><code class="language-bash"># /home/deploy/.ssh/authorized_keys tren VPS — dong thu hai la khoa cua CI
ssh-ed25519 AAAA… dv13-hoc
command="/home/deploy/bin/trien-khai-ci",restrict ssh-ed25519 AAAA… dv13-ci</code></pre>
<p><code>command="…"</code> forces every login with this key to run exactly that program, whatever the other side asked for — the request is placed in the <code>SSH_ORIGINAL_COMMAND</code> variable. <code>restrict</code> turns off everything else: terminal allocation, port forwarding, agent and X11 forwarding. The forced program is a small script that reads the requested command, accepts only the form <code>deploy &lt;commit-id&gt;</code>, and then performs the whole locked swap with a smoke test:</p>
<pre><code class="language-bash">#!/bin/bash
# Lenh DUY NHAT ma khoa CI duoc chay (authorized_keys: command="…",restrict)
set -Eeuo pipefail
read -r VIEC TAG THUA &lt;&lt;&lt; "\${SSH_ORIGINAL_COMMAND:-}"
[ "$VIEC" = deploy ] &amp;&amp; [ -z "\${THUA:-}" ] || { echo "tu choi: \${SSH_ORIGINAL_COMMAND:-(shell)}" &gt;&amp;2; exit 2; }
[[ "$TAG" =~ ^[0-9a-f]{7,40}$ ]] || { echo "tu choi: tag '$TAG' khong phai ma commit" &gt;&amp;2; exit 2; }
exec 9&gt; /tmp/trien-khai.khoa
flock -n 9 || { echo "dang co mot lan deploy khac chay — thoat, khong chen ngang" &gt;&amp;2; exit 75; }
cd ~/dat-lich
CU=$(sed -n 's/^TAG=//p' .env)
echo "[$(date +%T)] $CU -&gt; $TAG"
docker pull -q "dv13-reg:5000/dat-lich:$TAG" &gt;/dev/null
sed -i "s/^TAG=.*/TAG=$TAG/" .env
if ! docker compose up -d --no-build --wait --wait-timeout 30 api &gt;/dev/null 2&gt;&amp;1 \\
   || [ "$(curl -s -o /dev/null -w '%{http_code}' 127.0.0.1:8080/api/lich)" != 401 ]; then
  echo "[$(date +%T)] HONG — lui ve $CU" &gt;&amp;2
  sed -i "s/^TAG=.*/TAG=$CU/" .env
  docker compose up -d --no-build --wait api &gt;/dev/null 2&gt;&amp;1
  exit 1
fi
echo "$(date -Is) $TAG" &gt;&gt; ~/dat-lich/da-len.log
echo "[$(date +%T)] OK: dang chay $TAG"</code></pre>
<div class="out">$ ssh -i ci_key deploy@vps deploy 241f233
[08:22:39] 2bed0bb -&gt; 241f233
[08:22:47] OK: dang chay 241f233
ma thoat 0
$ ssh -i ci_key deploy@vps "deploy 241f233; rm -rf ~"
tu choi: deploy 241f233; rm -rf ~
ma thoat 2
$ ssh -i ci_key deploy@vps "deploy latest"
tu choi: tag 'latest' khong phai ma commit
ma thoat 2
$ ssh -i ci_key deploy@vps          (xin shell)
Pseudo-terminal will not be allocated because stdin is not a terminal.
tu choi: (shell)
ma thoat 2
$ ssh -i ci_key -N -L 19139:db:5432 deploy@vps
channel 2: open failed: administratively prohibited: open failed</div>
<p>One OK, four refusals. The most interesting is the second: <code>deploy 241f233; rm -rf ~</code> is NOT split at the <code>;</code> by a shell — with <code>command=</code> the whole string is just a value in <code>SSH_ORIGINAL_COMMAND</code>, and the script refuses because of the extra part. The last line shows <code>restrict</code> also blocking a tunnel to Postgres. Result: a leaked CI secret lets the holder do exactly one thing — redeploy a commit already in the registry.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The runner connects with the CI key</span><span class="lz-d"><code>ssh … "deploy 72f5fb8"</code>; the host key must match the pinned known_hosts.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">sshd sees command= on the key line</span><span class="lz-d">ignores the requested command, puts it in <code>SSH_ORIGINAL_COMMAND</code>, runs <code>trien-khai-ci</code>; <code>restrict</code> disables terminals and tunnels.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The script validates the string</span><span class="lz-d">exactly two words, the first <code>deploy</code>, the second a 7–40 hex commit ID; otherwise exit 2.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">flock -n</span><span class="lz-d">another deploy in progress ⇒ exit 75, no cutting in.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Pull, swap, smoke-test, record</span><span class="lz-d">failure ⇒ back to the old TAG, exit 1; success ⇒ one more line in <code>da-len.log</code>.</span></div>
</div>
<div class="pitfall co-tieu-de">
<p><strong>Trap — reading <code>SSH_ORIGINAL_COMMAND</code> and then <code>eval</code>-ing or running it.</strong> The entire protection rests on the script NEVER handing that string to a shell: it splits it with <code>read</code>, checks each part against a pattern (<code>^[0-9a-f]{7,40}$</code>), and uses only checked parts. A <code>bash -c "$SSH_ORIGINAL_COMMAND"</code> gives back the whole shell that <code>command=</code> just took away.</p>
</div>

<h3>A pinned known_hosts</h3>
${slide('dv-13', 20, 'known_hosts ghim: máy lạ thì không nói chuyện')}
<p>A GitHub runner is brand new every run, so it has never "met" your VPS. There are three ways to make it accept the VPS's host key, and only one is right:</p>
<div class="out">$ ssh-keyscan -p 19132 -t ed25519 127.0.0.1
# 127.0.0.1:19132 SSH-2.0-OpenSSH_9.6p1 Ubuntu-3ubuntu13.19
[127.0.0.1]:19132 ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDyKEPXTBtrxF48V…
$ ssh -o StrictHostKeyChecking=yes -o UserKnownHostsFile=/dev/null … deploy 72f5fb8   # known_hosts RONG
No ED25519 host key is known for [127.0.0.1]:19132 and you have requested strict checking.
Host key verification failed.
ma thoat 255
$ ssh -o UserKnownHostsFile=kh-gia …   # khoa ghim KHONG khop (may bi thay / bi gia)
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
ma thoat 255</div>
<ul>
<li><strong><code>StrictHostKeyChecking=no</code></strong> — trust whoever answers at that address. A changed DNS record, an IP reassigned to someone else, and your CI sends images and deploy commands to a stranger.</li>
<li><strong><code>ssh-keyscan</code> INSIDE the workflow</strong> — the same as above, only looking more careful: it records exactly the key of whoever is in the middle.</li>
<li><strong>Pin in advance</strong>: scan once from a machine you trust, VERIFY it against <code>/etc/ssh/ssh_host_ed25519_key.pub</code> viewed directly on the VPS (via the provider's console if needed), then paste it into the <code>VPS_KNOWN_HOSTS</code> secret. With <code>StrictHostKeyChecking=yes</code>, a strange machine ⇒ exit 255 and the deploy stops, as in the output above.</li>
</ul>
<p>Rebuild the VPS and its host key changes, and CI deploys stop with that red warning. That is the intent: updating the secret is a deliberate act, not something silently absorbed.</p>

<h3>concurrency: queuing within ONE group, nothing more</h3>
${slide('dv-13', 21, 'concurrency chỉ xếp hàng trong MỘT nhóm')}
<p>GitHub's documentation (09/2026) states the semantics: within a concurrency group there is at most ONE running and ONE pending run; when a new one arrives, the PENDING one is cancelled and the new one takes its place. <code>cancel-in-progress: true</code> also cancels the running one. <code>queue: max</code> keeps up to 100 pending runs instead of cancelling (and cannot be combined with <code>cancel-in-progress: true</code>). All of it applies only to runs with the SAME GROUP NAME.</p>
<p>Two consequences people miss. One: click deploy three times quickly and the middle run is silently cancelled — usually what you want, but you should know. Two, more important: <strong>two workflows in different groups, or a workflow with no <code>concurrency</code>, run fully in parallel</strong>. And every other way into the VPS — a manual script, <code>deploy-nha.sh</code>, a teammate hot-fixing over SSH — is outside GitHub, invisible to concurrency. This is what happens when two swaps meet on one VPS, measured three times:</p>
<div class="out">$ ( TAG=72f5fb8 docker compose up -d --no-build api ) &amp; ( TAG=02f98c0 docker compose up -d --no-build api ) &amp; wait
== lan 1
A (72f5fb8) ma thoat 1
B (02f98c0) ma thoat 0
Error response from daemon: Conflict. The container name "/f5573b04ffbf_dat-lich-api-1" is already in use by container "3adc266fbdc3a4af923d8237b0a594…
dat-lich-api-1  dv13-reg:5000/dat-lich:02f98c0  Up Less than a second (health: starting)
== lan 2
B (02f98c0) ma thoat 0
A (72f5fb8) ma thoat 0
dat-lich-api-1  dv13-reg:5000/dat-lich:72f5fb8  Up Less than a second (health: starting)
== lan 3
A (72f5fb8) ma thoat 0
B (02f98c0) ma thoat 0
dat-lich-api-1  dv13-reg:5000/dat-lich:02f98c0  Up Less than a second (health: starting)</div>
<p>Run 1: one side wins and the other dies with <code>Conflict … container name … already in use</code> — Compose renames the old container to <code>&lt;id&gt;_dat-lich-api-1</code> while re-creating it, and the second side steps on that temporary name. Runs 2 and 3: both "succeed", and the version running is whichever arrived LAST — not necessarily the deploy CI reported last. That is the shape of the 06/07 incident (<code>Exited (137)</code> and orphan containers). The fix has to live where the contention is: on the VPS. The <code>trien-khai-ci</code> script above has <code>flock -n</code>:</p>
<div class="out"># cung viec do, qua trien-khai-ci (flock tren VPS), B bat dau sau A 0,3 giay
B: dang co mot lan deploy khac chay — thoat, khong chen ngang
B: ma thoat 75
A: [08:22:59] 241f233 -&gt; 72f5fb8
A: [08:23:06] OK: dang chay 72f5fb8</div>
<p>The late arrival is refused with exit 75 (<code>EX_TEMPFAIL</code> — "try again later", as Chapter 7 uses), and does not cut in. Every deploy path must go through that same lock.</p>

<h3>Why this project dropped push-to-deploy</h3>
${slide('dv-13', 22, 'Vì sao dự án bỏ push-to-deploy')}
<p>In 07/2026, both of this repository's deploy workflows (<code>deploy-ghcr.yml</code> and <code>backend-vps.yml</code>) ran on every push to <code>main</code>. 03/07: they raced, and the feed returned 500 because the database schema did not match the image. 06/07: two container swaps raced ⇒ <code>Exited (137)</code> and orphan containers; recovered with a manual <code>docker start</code>. Two workflows = two concurrency groups, so neither saw the other. Since then both are <code>workflow_dispatch</code> only, deploying is <code>deploy-nha.sh</code> run by hand, and a push to <code>main</code> only runs lint + type-check. Verify that with one command rather than memory:</p>
<div class="out">$ grep -A4 '^on:' .github/workflows/deploy-ghcr.yml .github/workflows/backend-vps.yml
.github/workflows/deploy-ghcr.yml:on:
.github/workflows/deploy-ghcr.yml-  workflow_dispatch:
…
.github/workflows/backend-vps.yml:on:
.github/workflows/backend-vps.yml-  workflow_dispatch:</div>
<table>
<tr><th>Push-to-deploy fits when</th><th>It does not fit when</th></tr>
<tr><td>exactly ONE workflow touches production, with a shared <code>concurrency</code> group</td><td>several workflows / several people have a path into the VPS</td></tr>
<tr><td>a <code>flock</code> on the server catches every deploy path</td><td>migrations run in a separate job/workflow</td></tr>
<tr><td>migrations live INSIDE the deploy step, expand/contract (Ch5)</td><td>there is no smoke test + automatic rollback yet</td></tr>
<tr><td>smoke test + automatic rollback were tried with a deliberately broken release</td><td>a group project where everyone can push to <code>main</code></td></tr>
</table>
<p>The middle ground is often best for a group project: build and check automatically on every push, while the <strong>swap</strong> job declares <code>environment: production</code> with a reviewer. Per GitHub's documentation (09/2026): up to 6 reviewers/teams, only one needs to approve, "Prevent self-review" can be enabled; for private repositories reviewers need GitHub Pro/Team — the Free plan can configure environments only for public repositories.</p>

<h3>What differs on Windows/WSL and macOS</h3>
<ul>
<li><strong>Creating the CI key on Windows:</strong> OpenSSH for Windows' <code>ssh-keygen</code> produces the same format. When pasting the private key into the secret box, keep the line breaks; a key pasted without its final newline fails on the runner with <code>error in libcrypto</code>. The workflow above uses <code>printf '%s
'</code> to guarantee the trailing newline.</li>
<li><strong>A YAML file saved with CRLF</strong> is still read by GitHub, but a <code>run: |</code> block carrying <code></code> into shell commands on a Linux runner breaks like Chapter 7's CRLF script — keep <code>.gitattributes</code> with <code>eol=lf</code>.</li>
<li><strong>To run a workflow locally</strong>: <code>act</code> (nektos/act) runs workflows in Docker containers — on an arm64 Mac you need an amd64 runner image and emulation, so it is slow and not identical to the real runner. This lesson does not use it; splitting the VPS-touching part into a script that also runs outside CI, as above, is a cheaper way to test.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your SWP391 team pasted the team lead's personal SSH key into a secret so CI can deploy, with <code>StrictHostKeyChecking=no</code> "to stop the errors". Replace it with a deploy-only key, on the lab VPS.</p>
<ol>
<li>Create a dedicated ed25519 key for CI in a scratch folder; add its public half to the lab VPS's <code>authorized_keys</code> with <code>command="…/trien-khai-ci",restrict</code>.</li>
<li>Run four times: <code>deploy &lt;sha&gt;</code>, <code>"deploy &lt;sha&gt;; id"</code>, <code>deploy latest</code>, and ask for a shell; record each exit code. Also try <code>-N -L</code> to the Postgres port.</li>
<li>Scan the VPS host key once into a known_hosts file; run the <code>run:</code> block with <code>StrictHostKeyChecking=yes</code>, then with a wrong known_hosts file.</li>
<li>Run two deploys 0.3 s apart, once WITHOUT <code>flock</code> (two parallel <code>docker compose up -d</code>) and once through the script.</li>
</ol>
<p><strong>Done when:</strong> one deploy is OK and every other request is refused with exit 2 (the tunnel "administratively prohibited"), the wrong known_hosts gives 255, and you have output of two parallel swaps (Conflict or the wrong version winning) next to one refused by <code>flock</code> with exit 75.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Workflow</span><span class="v">A YAML file in <code>.github/workflows/</code> describing jobs GitHub runs on events.</span></div>
  <div class="kv"><span class="k">Runner</span><span class="v">The VM GitHub provides for each job, brand new every time — <code>ubuntu-24.04</code> is x86-64.</span></div>
  <div class="kv"><span class="k">Secret</span><span class="v">An encrypted value a workflow can read; masked in logs when it appears verbatim.</span></div>
  <div class="kv"><span class="k">Environment</span><span class="v">A set of rules + secrets for a target such as <code>production</code>: reviewers, allowed branches.</span></div>
  <div class="kv"><span class="k">Forced command</span><span class="v"><code>command="…"</code> in <code>authorized_keys</code>: that key can run only that program.</span></div>
  <div class="kv"><span class="k">restrict</span><span class="v">An SSH key option that disables terminals, port forwarding, agent and X11 forwarding.</span></div>
  <div class="kv"><span class="k">Host key pinning</span><span class="v">Supplying a verified host key in known_hosts and requiring <code>StrictHostKeyChecking=yes</code>.</span></div>
  <div class="kv"><span class="k">Concurrency group</span><span class="v">Within one group, at most one running + one pending run; different groups run in parallel.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A deploy workflow: build with an explicit Dockerfile → check the image → push → ssh swap; <code>load: true</code> so nothing is pushed before it is checked.</li>
<li><code>GITHUB_TOKEN</code> + <code>permissions: packages: write</code> push to GHCR; a dedicated CI SSH key lives in the <code>production</code> environment’s secrets.</li>
<li><code>command="…",restrict</code>: the CI key can only run <code>deploy &lt;sha&gt;</code> — measured: one OK, four refusals, no tunnel.</li>
<li>Pin known_hosts in advance with <code>StrictHostKeyChecking=yes</code>; keyscan inside the workflow is <code>=no</code> in disguise.</li>
<li><code>concurrency</code> only queues within ONE group; two deploy paths meeting ⇒ Conflict or the wrong version wins — the <code>flock</code> must live on the VPS.</li>
<li>This project dropped push-to-deploy after two racing incidents; the middle ground for group projects is automatic builds with an approved swap.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Control the concurrency of workflows and jobs</span><span class="lc-sub">docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/control-the-concurrency-of-workflows-and-jobs — one running + one pending, <code>cancel-in-progress</code>, <code>queue: max</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Managing environments for deployment</span><span class="lc-sub">docs.github.com/en/actions/deployment/targeting-different-environments/managing-environments-for-deployment — reviewers, "Prevent self-review", environment secrets, plan limits.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using secrets in GitHub Actions</span><span class="lc-sub">docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions — how secrets are masked in logs and the limits of masking.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Blog — GitHub Actions now supports CI/CD (08/08/2019)</span><span class="lc-sub">github.blog/news-insights/product-news/github-actions-now-supports-ci-cd/ — when Actions became a CI/CD tool.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">sshd(8) — AUTHORIZED_KEYS FILE FORMAT</span><span class="lc-sub">man7.org/linux/man-pages/man8/sshd.8.html — <code>command=</code>, <code>restrict</code> and the <code>SSH_ORIGINAL_COMMAND</code> variable.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nektos/act</span><span class="lc-sub">github.com/nektos/act — runs GitHub Actions workflows locally in Docker; not used here, listed for you to try.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">GitHub Actions — the full course</span><span class="lc-sub">/courses/github-actions/learn${REF} — workflow syntax, expressions, matrices, caching and action security.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.3</span>
<h2>Deploy từ GitHub Actions qua SSH: một khoá, một lệnh, mỗi lần một deploy</h2>
<p class="lead">Bài 13.2 dựng và kiểm ảnh ở máy nhà. Làm y hệt trên một runner của GitHub Actions thì mỗi lần deploy không còn phụ thuộc laptop của ai đang mở — nhưng giờ có một cái máy của NGƯỜI KHÁC cầm khoá SSH vào VPS của bạn, và có thể có hai cái máy như vậy chạy cùng lúc. Bài này viết đầy đủ workflow build → chốt kiểm → push → ssh tráo, rồi đo ba thứ quyết định nó an toàn hay không: khoá CI chỉ chạy được MỘT lệnh, known_hosts ghim sẵn, và <code>concurrency</code> — thứ mà dự án này từng tin là "chống chạy chồng", và nó không phải.</p>

<h3>Lịch sử ngắn, và vì sao bài này không chạy trên GitHub thật</h3>
<p>GitHub Actions ra mắt tính năng CI/CD ngày 08/08/2019; runner <code>ubuntu-24.04</code> là máy x86-64 do GitHub cấp cho mỗi job, xoá sạch sau khi xong. Cú pháp workflow — <code>on</code>, <code>jobs</code>, <code>steps</code>, <code>uses</code>, biểu thức <code>\${{ … }}</code> — là việc của <code>/courses/github-actions</code>; ở đây chỉ bàn những dòng quyết định chuyện deploy.</p>
<p>Theo hợp đồng của khoá, bài KHÔNG tạo repo, không tạo secret và không chạy workflow trên GitHub thật. Công cụ <code>act</code> (chạy workflow cục bộ trong Docker) không có sẵn trên máy dùng để viết bài, và bài không cài thêm gì. Thay vào đó: YAML được kiểm cú pháp bằng thư viện js-yaml, và khối lệnh <code>run:</code> của bước deploy — phần duy nhất thật sự đụng VPS — được chạy thật từ Mac vào VPS thí nghiệm:</p>
<div class="out">$ node -e "const y=require('js-yaml'); const d=y.load(fs.readFileSync('deploy.yml','utf8')); …"
YAML hop le · jobs: build, deploy · buoc: 7+1 · on: [ 'workflow_dispatch' ]
$ command -v act || echo "khong co act"
khong co act</div>

<h3>Workflow đầy đủ, từng khối</h3>
${slide('dv-13', 17, 'Workflow (1/2): build, chốt kiểm rồi mới push')}
${slide('dv-13', 18, 'Workflow (2/2): một khoá, một lệnh, một máy')}
<pre><code class="language-yaml">name: deploy
on:
  workflow_dispatch:            # bam tay — KHONG deploy khi push
permissions:
  contents: read
  packages: write               # de GITHUB_TOKEN day duoc len GHCR
concurrency:
  group: deploy-production      # moi workflow deploy dung CHUNG ten nay
  cancel-in-progress: false     # dang chay thi de chay xong
jobs:
  build:
    runs-on: ubuntu-24.04
    env:
      IMG: ghcr.io/\${{ github.repository }}/api
    outputs:
      tag: \${{ steps.tag.outputs.tag }}
    steps:
      - uses: actions/checkout@v7
      - id: tag
        run: |
          echo "tag=\${GITHUB_SHA::7}" &gt;&gt; "$GITHUB_OUTPUT"
          echo "TAG=\${GITHUB_SHA::7}" &gt;&gt; "$GITHUB_ENV"
      - uses: docker/setup-buildx-action@v4
      - uses: docker/login-action@v4
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v7
        with:
          context: .
          file: Dockerfile.backend
          platforms: linux/amd64
          load: true
          tags: \${{ env.IMG }}:\${{ env.TAG }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
      - name: Chot kiem anh truoc khi day
        run: ./scripts/chot-kiem-anh.sh "$IMG:$TAG"
      - name: Day anh
        run: docker push "$IMG:$TAG"
  deploy:
    needs: build
    runs-on: ubuntu-24.04
    environment: production     # duyet tay + secret chi mo sau khi duyet
    timeout-minutes: 10
    steps:
      - name: Tra anh tren VPS qua SSH
        env:
          KHOA: \${{ secrets.VPS_CI_KEY }}
          KNOWN_HOSTS: \${{ secrets.VPS_KNOWN_HOSTS }}
          VPS: \${{ vars.VPS_HOST }}
          TAG: \${{ needs.build.outputs.tag }}
        run: |
          install -m 700 -d ~/.ssh
          printf '%s\\n' "$KHOA" &gt; ~/.ssh/ci &amp;&amp; chmod 600 ~/.ssh/ci
          printf '%s\\n' "$KNOWN_HOSTS" &gt; ~/.ssh/known_hosts
          ssh -i ~/.ssh/ci -o StrictHostKeyChecking=yes -o BatchMode=yes \\
              "deploy@$VPS" "deploy $TAG"</code></pre>
<table>
<tr><th>Khối</th><th>Vì sao nó ở đó</th></tr>
<tr><td><code>on: workflow_dispatch</code></td><td>chỉ chạy khi có người bấm (hoặc <code>gh workflow run deploy</code>). Push lên <code>main</code> KHÔNG deploy — lý do ở cuối bài.</td></tr>
<tr><td><code>permissions: packages: write</code></td><td><code>GITHUB_TOKEN</code> tự sinh cho mỗi lần chạy đủ quyền đẩy GHCR; không cần tạo PAT. Khai <code>contents: read</code> để token không có quyền nào khác.</td></tr>
<tr><td><code>concurrency: group: deploy-production</code></td><td>trong NHÓM này, không bao giờ có hai lần chạy cùng lúc — xem phần <code>concurrency</code> để biết nó KHÔNG làm gì.</td></tr>
<tr><td><code>cancel-in-progress: false</code></td><td>lần đang tráo thì để tráo xong; huỷ giữa chừng một cú tráo là để máy ở trạng thái nửa vời.</td></tr>
<tr><td><code>runs-on: ubuntu-24.04</code></td><td>x86-64 như VPS ⇒ chốt kiểm ảnh chạy trên đúng kiến trúc (13.2).</td></tr>
<tr><td><code>file: Dockerfile.backend</code></td><td>ghi RÕ tệp — chính cái dòng mà sự cố 18/08 thiếu.</td></tr>
<tr><td><code>load: true</code> rồi mới <code>docker push</code></td><td>dựng vào máy runner, chạy chốt kiểm, CHỈ đẩy khi đạt. <code>push: true</code> thì đẩy luôn trước khi ai kiểm gì.</td></tr>
<tr><td><code>cache-from/to: type=gha</code></td><td>cache lớp lưu ở GitHub giữa các lần chạy — runner mới tinh mỗi lần.</td></tr>
<tr><td><code>environment: production</code></td><td>job tráo chờ người duyệt; secret của môi trường chỉ mở SAU khi duyệt.</td></tr>
<tr><td><code>timeout-minutes: 10</code></td><td>một ssh treo không được giữ nhóm concurrency cả tiếng (mặc định là 360 phút).</td></tr>
</table>
<div class="callout">
<p><strong>Phiên bản action (tính đến 09/2026, đọc từ trang phát hành):</strong> <code>actions/checkout</code> v7, <code>docker/setup-buildx-action</code> v4, <code>docker/login-action</code> v4, <code>docker/build-push-action</code> v7. Ghim tới số lớn (<code>@v7</code>) là tối thiểu; kho cẩn thận ghim tới mã commit của action để không ai đẩy đè được thứ đang chạy với quyền ghi GHCR của bạn.</p>
</div>
<p>Chạy thử phần duy nhất đụng VPS — khối <code>run:</code> của bước deploy — với các biến y như GitHub sẽ đưa vào, trong một HOME giả để không đụng <code>~/.ssh</code> thật của Mac:</p>
<div class="out"># khoi run: cua buoc deploy, chay tren Mac voi HOME gia trong thu muc nhap (khong dung ~/.ssh that);
# chi them -p 19132 va UserKnownHostsFile="$HOME/…" vi VPS thi nghiem nghe cong 19132
$ HOME=… KHOA="$(cat khoa-ci)" KNOWN_HOSTS="$(ssh-keyscan …)" VPS=127.0.0.1 TAG=72f5fb8 bash -e buoc-deploy.sh
[08:26:36] 2bed0bb -&gt; 72f5fb8
[08:26:44] OK: dang chay 72f5fb8
ma thoat 0</div>

<h3>Secrets: cái gì nằm ở đâu</h3>
<table>
<tr><th>Tên</th><th>Loại</th><th>Nội dung</th></tr>
<tr><td><code>GITHUB_TOKEN</code></td><td>tự sinh, sống một lần chạy</td><td>đẩy GHCR (nhờ <code>permissions</code>)</td></tr>
<tr><td><code>VPS_CI_KEY</code></td><td>secret của môi trường <code>production</code></td><td>khoá BÍ MẬT ed25519 riêng cho CI</td></tr>
<tr><td><code>VPS_KNOWN_HOSTS</code></td><td>secret (hoặc variable — nó công khai được)</td><td>một dòng vân tay máy chủ, đã đối chiếu</td></tr>
<tr><td><code>VPS_HOST</code></td><td>variable</td><td>địa chỉ VPS</td></tr>
</table>
<p>GitHub che giá trị secret trong log (in ra thành <code>***</code>), nhưng chỉ khi chuỗi xuất hiện NGUYÊN VĂN — một secret bị mã hoá base64 hay cắt đôi thì lọt. Và secret của môi trường chỉ được mở cho job khai đúng môi trường đó, sau khi luật của môi trường (người duyệt) đạt. Tạo khoá một lần trên máy của bạn:</p>
<pre><code class="language-bash"># tren may CUA BAN, mot lan: khoa rieng cho CI, khong mat khau (CI khong go duoc)
ssh-keygen -t ed25519 -N '' -C deploy-ci -f ./khoa-ci
# khoa CONG KHAI -&gt; VPS, kem command=…,restrict
# khoa BI MAT   -&gt; GitHub: Settings › Secrets › Actions › VPS_CI_KEY  (roi XOA tep khoa-ci)
ssh-keyscan -t ed25519 -p 22 IP_VPS    # doc van tay, DOI CHIEU voi /etc/ssh/*.pub tren VPS
# dong do -&gt; secret VPS_KNOWN_HOSTS</code></pre>

<h3>Khoá CI chỉ chạy được MỘT lệnh</h3>
${slide('dv-13', 19, 'Khoá CI chỉ chạy được MỘT lệnh')}
<p>Nếu dòng khoá của CI trong <code>authorized_keys</code> để trống như khoá của bạn, thì ai đọc được secret <code>VPS_CI_KEY</code> — một action bị chiếm, một bạn trong nhóm có quyền sửa workflow, một log lỡ in — là có shell trên production. <code>sshd</code> cho phép gắn tuỳ chọn vào TỪNG khoá:</p>
<pre><code class="language-bash"># /home/deploy/.ssh/authorized_keys tren VPS — dong thu hai la khoa cua CI
ssh-ed25519 AAAA… dv13-hoc
command="/home/deploy/bin/trien-khai-ci",restrict ssh-ed25519 AAAA… dv13-ci</code></pre>
<p><code>command="…"</code> ép mọi lần đăng nhập bằng khoá này chạy đúng chương trình đó, bất kể phía kia xin chạy gì — thứ phía kia xin được đặt vào biến <code>SSH_ORIGINAL_COMMAND</code>. <code>restrict</code> tắt mọi thứ còn lại: cấp terminal, chuyển tiếp cổng, chuyển tiếp agent và X11. Chương trình ép đó là một script nhỏ đọc lệnh xin chạy, chỉ nhận đúng một dạng <code>deploy &lt;mã-commit&gt;</code>, rồi làm cả cú tráo có khoá và smoke-test:</p>
<pre><code class="language-bash">#!/bin/bash
# Lenh DUY NHAT ma khoa CI duoc chay (authorized_keys: command="…",restrict)
set -Eeuo pipefail
read -r VIEC TAG THUA &lt;&lt;&lt; "\${SSH_ORIGINAL_COMMAND:-}"
[ "$VIEC" = deploy ] &amp;&amp; [ -z "\${THUA:-}" ] || { echo "tu choi: \${SSH_ORIGINAL_COMMAND:-(shell)}" &gt;&amp;2; exit 2; }
[[ "$TAG" =~ ^[0-9a-f]{7,40}$ ]] || { echo "tu choi: tag '$TAG' khong phai ma commit" &gt;&amp;2; exit 2; }
exec 9&gt; /tmp/trien-khai.khoa
flock -n 9 || { echo "dang co mot lan deploy khac chay — thoat, khong chen ngang" &gt;&amp;2; exit 75; }
cd ~/dat-lich
CU=$(sed -n 's/^TAG=//p' .env)
echo "[$(date +%T)] $CU -&gt; $TAG"
docker pull -q "dv13-reg:5000/dat-lich:$TAG" &gt;/dev/null
sed -i "s/^TAG=.*/TAG=$TAG/" .env
if ! docker compose up -d --no-build --wait --wait-timeout 30 api &gt;/dev/null 2&gt;&amp;1 \\
   || [ "$(curl -s -o /dev/null -w '%{http_code}' 127.0.0.1:8080/api/lich)" != 401 ]; then
  echo "[$(date +%T)] HONG — lui ve $CU" &gt;&amp;2
  sed -i "s/^TAG=.*/TAG=$CU/" .env
  docker compose up -d --no-build --wait api &gt;/dev/null 2&gt;&amp;1
  exit 1
fi
echo "$(date -Is) $TAG" &gt;&gt; ~/dat-lich/da-len.log
echo "[$(date +%T)] OK: dang chay $TAG"</code></pre>
<div class="out">$ ssh -i ci_key deploy@vps deploy 241f233
[08:22:39] 2bed0bb -&gt; 241f233
[08:22:47] OK: dang chay 241f233
ma thoat 0
$ ssh -i ci_key deploy@vps "deploy 241f233; rm -rf ~"
tu choi: deploy 241f233; rm -rf ~
ma thoat 2
$ ssh -i ci_key deploy@vps "deploy latest"
tu choi: tag 'latest' khong phai ma commit
ma thoat 2
$ ssh -i ci_key deploy@vps          (xin shell)
Pseudo-terminal will not be allocated because stdin is not a terminal.
tu choi: (shell)
ma thoat 2
$ ssh -i ci_key -N -L 19139:db:5432 deploy@vps
channel 2: open failed: administratively prohibited: open failed</div>
<p>Một OK, bốn từ chối. Đáng chú ý nhất là lệnh thứ hai: <code>deploy 241f233; rm -rf ~</code> KHÔNG bị shell tách ở dấu <code>;</code> — với <code>command=</code>, cả chuỗi chỉ là một giá trị trong <code>SSH_ORIGINAL_COMMAND</code>, và script từ chối vì còn phần thừa. Dòng cuối cho thấy <code>restrict</code> chặn luôn đường hầm tới Postgres. Kết quả: secret CI bị lộ thì kẻ lấy được chỉ làm được đúng một việc — deploy lại một commit có sẵn trong registry.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Runner kết nối với khoá CI</span><span class="lz-d"><code>ssh … "deploy 72f5fb8"</code>; vân tay máy chủ phải khớp known_hosts đã ghim.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">sshd thấy command= trên dòng khoá</span><span class="lz-d">bỏ qua lệnh được xin, đặt nó vào <code>SSH_ORIGINAL_COMMAND</code>, chạy <code>trien-khai-ci</code>; <code>restrict</code> tắt terminal và đường hầm.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Script kiểm chuỗi</span><span class="lz-d">đúng hai từ, từ đầu là <code>deploy</code>, từ sau là mã commit hex 7–40 ký tự; sai ⇒ mã 2.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">flock -n</span><span class="lz-d">đang có lần deploy khác ⇒ mã 75, không chen ngang.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Kéo, tráo, smoke-test, ghi sổ</span><span class="lz-d">hỏng ⇒ lùi về TAG cũ, mã 1; đạt ⇒ thêm một dòng vào <code>da-len.log</code>.</span></div>
</div>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — đọc <code>SSH_ORIGINAL_COMMAND</code> rồi <code>eval</code> hay chạy thẳng nó.</strong> Cả lớp bảo vệ nằm ở chỗ script KHÔNG bao giờ đưa chuỗi đó cho shell: nó tách bằng <code>read</code>, kiểm từng phần bằng mẫu (<code>^[0-9a-f]{7,40}$</code>), và chỉ dùng phần đã kiểm. Một <code>bash -c "$SSH_ORIGINAL_COMMAND"</code> là trả lại toàn bộ shell mà <code>command=</code> vừa lấy đi.</p>
</div>

<h3>known_hosts ghim sẵn</h3>
${slide('dv-13', 20, 'known_hosts ghim: máy lạ thì không nói chuyện')}
<p>Runner của GitHub là máy mới tinh ở mỗi lần chạy, nên nó chưa bao giờ "gặp" VPS của bạn. Có ba cách để nó chấp nhận vân tay của VPS, và chỉ một cách đúng:</p>
<div class="out">$ ssh-keyscan -p 19132 -t ed25519 127.0.0.1
# 127.0.0.1:19132 SSH-2.0-OpenSSH_9.6p1 Ubuntu-3ubuntu13.19
[127.0.0.1]:19132 ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDyKEPXTBtrxF48V…
$ ssh -o StrictHostKeyChecking=yes -o UserKnownHostsFile=/dev/null … deploy 72f5fb8   # known_hosts RONG
No ED25519 host key is known for [127.0.0.1]:19132 and you have requested strict checking.
Host key verification failed.
ma thoat 255
$ ssh -o UserKnownHostsFile=kh-gia …   # khoa ghim KHONG khop (may bi thay / bi gia)
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
ma thoat 255</div>
<ul>
<li><strong><code>StrictHostKeyChecking=no</code></strong> — tin bất cứ ai trả lời ở địa chỉ đó. Một DNS bị đổi, một IP bị cấp lại cho người khác, và CI của bạn gửi ảnh cùng lệnh deploy cho máy lạ.</li>
<li><strong><code>ssh-keyscan</code> NGAY TRONG workflow</strong> — y hệt cách trên, chỉ trông có vẻ cẩn thận hơn: nó ghi lại đúng khoá của kẻ đang đứng giữa.</li>
<li><strong>Ghim trước</strong>: quét một lần từ máy bạn tin, ĐỐI CHIẾU với tệp <code>/etc/ssh/ssh_host_ed25519_key.pub</code> xem trực tiếp trên VPS (qua bảng điều khiển của nhà cung cấp nếu cần), rồi dán vào secret <code>VPS_KNOWN_HOSTS</code>. Với <code>StrictHostKeyChecking=yes</code>, máy lạ ⇒ mã thoát 255 và deploy dừng, như output ở trên.</li>
</ul>
<p>Dựng lại VPS thì khoá máy chủ đổi và deploy từ CI dừng với cảnh báo đỏ ấy. Đó là đúng ý: cập nhật secret là một việc có chủ đích, không phải thứ tự động nuốt.</p>

<h3>concurrency: xếp hàng trong MỘT nhóm, không hơn</h3>
${slide('dv-13', 21, 'concurrency chỉ xếp hàng trong MỘT nhóm')}
<p>Tài liệu GitHub (09/2026) nói rõ ngữ nghĩa: trong một nhóm concurrency, tối đa MỘT lần chạy đang chạy và MỘT lần đang chờ; một lần mới tới thì lần đang CHỜ bị huỷ và lần mới thế chỗ. <code>cancel-in-progress: true</code> thì huỷ luôn lần đang chạy. Có thêm <code>queue: max</code> để giữ tới 100 lần chờ thay vì huỷ (và không được đi cùng <code>cancel-in-progress: true</code>). Tất cả chỉ áp cho những lần chạy CÙNG TÊN NHÓM.</p>
<p>Hai hệ quả mà người ta hay bỏ qua. Một: bấm deploy ba lần liên tiếp thì lần giữa bị huỷ lặng lẽ — thường là điều bạn muốn, nhưng phải biết. Hai, quan trọng hơn: <strong>hai workflow khác nhóm, hay một workflow không khai <code>concurrency</code>, chạy song song hoàn toàn</strong>. Và mọi đường khác vào VPS — script tay, <code>deploy-nha.sh</code>, một bạn SSH vào sửa nóng — nằm ngoài GitHub, concurrency không thấy chúng. Đây là điều xảy ra khi hai lần tráo gặp nhau trên cùng một VPS, đo ba lần:</p>
<div class="out">$ ( TAG=72f5fb8 docker compose up -d --no-build api ) &amp; ( TAG=02f98c0 docker compose up -d --no-build api ) &amp; wait
== lan 1
A (72f5fb8) ma thoat 1
B (02f98c0) ma thoat 0
Error response from daemon: Conflict. The container name "/f5573b04ffbf_dat-lich-api-1" is already in use by container "3adc266fbdc3a4af923d8237b0a594…
dat-lich-api-1  dv13-reg:5000/dat-lich:02f98c0  Up Less than a second (health: starting)
== lan 2
B (02f98c0) ma thoat 0
A (72f5fb8) ma thoat 0
dat-lich-api-1  dv13-reg:5000/dat-lich:72f5fb8  Up Less than a second (health: starting)
== lan 3
A (72f5fb8) ma thoat 0
B (02f98c0) ma thoat 0
dat-lich-api-1  dv13-reg:5000/dat-lich:02f98c0  Up Less than a second (health: starting)</div>
<p>Lần 1: một bên thắng, bên kia chết với <code>Conflict … container name … already in use</code> — Compose đổi tên container cũ thành <code>&lt;id&gt;_dat-lich-api-1</code> trong lúc tạo lại, và bên thứ hai giẫm vào đúng cái tên tạm đó. Lần 2 và 3: cả hai "thành công", và bản đang chạy là bản của ai về SAU — không phải bản của lần deploy mà CI báo cuối cùng. Đó là hình dạng của sự cố 06/07 (<code>Exited (137)</code> và container mồ côi). Cách chữa phải nằm ở chỗ bị tranh: trên VPS. Script <code>trien-khai-ci</code> ở trên có <code>flock -n</code>:</p>
<div class="out"># cung viec do, qua trien-khai-ci (flock tren VPS), B bat dau sau A 0,3 giay
B: dang co mot lan deploy khac chay — thoat, khong chen ngang
B: ma thoat 75
A: [08:22:59] 241f233 -&gt; 72f5fb8
A: [08:23:06] OK: dang chay 72f5fb8</div>
<p>Bên đến sau bị từ chối với mã 75 (<code>EX_TEMPFAIL</code> — "thử lại sau", như Chương 7 dùng), không chen ngang. Mọi đường deploy đều phải đi qua cùng cái khoá đó.</p>

<h3>Vì sao dự án bỏ push-to-deploy</h3>
${slide('dv-13', 22, 'Vì sao dự án bỏ push-to-deploy')}
<p>Tháng 07/2026, hai workflow deploy của kho mã này (<code>deploy-ghcr.yml</code> và <code>backend-vps.yml</code>) cùng chạy mỗi khi push lên <code>main</code>. 03/07: chúng đua nhau, feed trả 500 vì schema cơ sở dữ liệu lệch với ảnh. 06/07: hai lần tráo container đua nhau ⇒ <code>Exited (137)</code> và container mồ côi; cứu bằng <code>docker start</code> tay. Hai workflow = hai nhóm concurrency, nên không cái nào thấy cái kia. Từ đó cả hai chỉ còn <code>workflow_dispatch</code>, deploy là <code>deploy-nha.sh</code> chạy tay, và push lên <code>main</code> chỉ chạy lint + type-check. Kiểm lại điều đó bằng một lệnh, đừng tin trí nhớ:</p>
<div class="out">$ grep -A4 '^on:' .github/workflows/deploy-ghcr.yml .github/workflows/backend-vps.yml
.github/workflows/deploy-ghcr.yml:on:
.github/workflows/deploy-ghcr.yml-  workflow_dispatch:
…
.github/workflows/backend-vps.yml:on:
.github/workflows/backend-vps.yml-  workflow_dispatch:</div>
<table>
<tr><th>Push-to-deploy hợp khi</th><th>Không hợp khi</th></tr>
<tr><td>MỘT workflow duy nhất đụng production, có <code>concurrency</code> chung</td><td>nhiều workflow / nhiều người cùng có đường vào VPS</td></tr>
<tr><td>khoá <code>flock</code> trên máy chủ bắt mọi đường deploy</td><td>migration chạy ở một job/workflow riêng</td></tr>
<tr><td>migration nằm trong CHÍNH bước deploy, mở rộng/thu hẹp (Ch5)</td><td>chưa có smoke-test + lùi tự động</td></tr>
<tr><td>smoke-test + lùi tự động đã được thử bằng một bản cố tình hỏng</td><td>đồ án nhóm mà ai cũng có quyền push <code>main</code></td></tr>
</table>
<p>Điểm ở giữa thường là tốt nhất cho một đồ án nhóm: build và chốt kiểm tự động mỗi lần push, còn job <strong>tráo</strong> khai <code>environment: production</code> có người duyệt. Theo tài liệu GitHub (09/2026): tối đa 6 người/nhóm duyệt, chỉ cần một người đồng ý, có thể bật "Prevent self-review"; với repo riêng tư, người duyệt cần gói GitHub Pro/Team — gói Free chỉ cấu hình được môi trường cho repo công khai.</p>

<h3>Trên Windows/WSL và macOS khác gì</h3>
<ul>
<li><strong>Tạo khoá CI trên Windows:</strong> <code>ssh-keygen</code> của OpenSSH cho Windows cho ra cùng định dạng. Khi dán khoá bí mật vào ô secret, giữ nguyên các dòng; một khoá bị dán mất dòng cuối sẽ báo <code>error in libcrypto</code> trên runner. Workflow ở trên dùng <code>printf '%s
'</code> để chắc chắn có dấu xuống dòng cuối.</li>
<li><strong>Tệp YAML lưu với CRLF</strong> vẫn được GitHub đọc, nhưng một khối <code>run: |</code> mang <code></code> vào lệnh shell trên runner Linux thì hỏng như script CRLF ở Chương 7 — giữ <code>.gitattributes</code> với <code>eol=lf</code>.</li>
<li><strong>Muốn chạy workflow cục bộ</strong>: <code>act</code> (nektos/act) chạy workflow trong container Docker — trên Mac arm64 cần chọn ảnh runner amd64 và giả lập, nên chậm và không giống hệt runner thật. Bài này không dùng nó; tách phần đụng VPS ra một script chạy được cả ngoài CI như trên là cách thử rẻ hơn.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm SWP391 của bạn dán khoá SSH cá nhân của trưởng nhóm vào secret để CI deploy, với <code>StrictHostKeyChecking=no</code> "cho khỏi lỗi". Thay nó bằng một khoá chỉ-deploy, trên VPS thí nghiệm.</p>
<ol>
<li>Tạo khoá ed25519 riêng cho CI trong thư mục nháp; thêm khoá công khai vào <code>authorized_keys</code> của VPS thí nghiệm với <code>command="…/trien-khai-ci",restrict</code>.</li>
<li>Chạy bốn lần: <code>deploy &lt;sha&gt;</code>, <code>"deploy &lt;sha&gt;; id"</code>, <code>deploy latest</code>, và xin shell; ghi mã thoát từng lần. Thử thêm <code>-N -L</code> tới cổng Postgres.</li>
<li>Quét vân tay VPS một lần vào một tệp known_hosts; chạy khối <code>run:</code> với <code>StrictHostKeyChecking=yes</code>, rồi với một tệp known_hosts sai.</li>
<li>Chạy hai lần deploy cách nhau 0,3 giây, một lần KHÔNG có <code>flock</code> (hai <code>docker compose up -d</code> song song) và một lần qua script.</li>
</ol>
<p><strong>Đạt khi:</strong> một lần deploy OK và mọi yêu cầu khác bị từ chối với mã 2 (đường hầm bị "administratively prohibited"), known_hosts sai cho mã 255, và bạn có output hai lần tráo song song (Conflict hoặc bản sai thắng) so với một lần bị <code>flock</code> từ chối mã 75.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Workflow (quy trình tự động)</span><span class="v">Tệp YAML trong <code>.github/workflows/</code> mô tả các job GitHub chạy khi có sự kiện.</span></div>
  <div class="kv"><span class="k">Runner (máy chạy)</span><span class="v">Máy ảo GitHub cấp cho mỗi job, mới tinh mỗi lần — <code>ubuntu-24.04</code> là x86-64.</span></div>
  <div class="kv"><span class="k">Secret (bí mật của repo/môi trường)</span><span class="v">Giá trị mã hoá mà workflow đọc được; bị che trong log khi xuất hiện nguyên văn.</span></div>
  <div class="kv"><span class="k">Environment (môi trường triển khai)</span><span class="v">Nhóm luật + secret cho một đích như <code>production</code>: người duyệt, nhánh được phép.</span></div>
  <div class="kv"><span class="k">Forced command (lệnh bị ép)</span><span class="v"><code>command="…"</code> trong <code>authorized_keys</code>: khoá đó chỉ chạy được đúng chương trình ấy.</span></div>
  <div class="kv"><span class="k">restrict (tắt mọi thứ khác)</span><span class="v">Tuỳ chọn khoá SSH tắt terminal, chuyển tiếp cổng, agent và X11.</span></div>
  <div class="kv"><span class="k">Host key pinning (ghim vân tay máy chủ)</span><span class="v">Đưa sẵn vân tay đã đối chiếu vào known_hosts và đòi <code>StrictHostKeyChecking=yes</code>.</span></div>
  <div class="kv"><span class="k">Concurrency group (nhóm chống chạy chồng)</span><span class="v">Trong một nhóm, tối đa một lần chạy + một lần chờ; khác nhóm thì chạy song song.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Workflow deploy: build với Dockerfile ghi rõ → chốt kiểm ảnh → push → ssh tráo; <code>load: true</code> để không ảnh nào được đẩy trước khi kiểm.</li>
<li><code>GITHUB_TOKEN</code> + <code>permissions: packages: write</code> đẩy GHCR; khoá SSH riêng cho CI nằm trong secret của môi trường <code>production</code>.</li>
<li><code>command="…",restrict</code>: khoá CI chỉ chạy được <code>deploy &lt;sha&gt;</code> — đo: một OK, bốn từ chối, không đường hầm.</li>
<li>known_hosts ghim sẵn và <code>StrictHostKeyChecking=yes</code>; keyscan trong workflow chỉ là <code>=no</code> đội lốt.</li>
<li><code>concurrency</code> chỉ xếp hàng trong MỘT nhóm; hai đường deploy gặp nhau ⇒ Conflict hoặc sai bản thắng — khoá <code>flock</code> phải nằm trên VPS.</li>
<li>Dự án bỏ push-to-deploy sau hai sự cố đua nhau; điểm giữa hợp đồ án nhóm là build tự động, tráo chờ duyệt.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Control the concurrency of workflows and jobs</span><span class="lc-sub">docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/control-the-concurrency-of-workflows-and-jobs — một đang chạy + một đang chờ, <code>cancel-in-progress</code>, <code>queue: max</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Managing environments for deployment</span><span class="lc-sub">docs.github.com/en/actions/deployment/targeting-different-environments/managing-environments-for-deployment — người duyệt, "Prevent self-review", secret của môi trường, giới hạn theo gói.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using secrets in GitHub Actions</span><span class="lc-sub">docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions — cách secret được che trong log và giới hạn của việc che.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Blog — GitHub Actions now supports CI/CD (08/08/2019)</span><span class="lc-sub">github.blog/news-insights/product-news/github-actions-now-supports-ci-cd/ — mốc Actions thành công cụ CI/CD.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">sshd(8) — AUTHORIZED_KEYS FILE FORMAT</span><span class="lc-sub">man7.org/linux/man-pages/man8/sshd.8.html — <code>command=</code>, <code>restrict</code> và biến <code>SSH_ORIGINAL_COMMAND</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nektos/act</span><span class="lc-sub">github.com/nektos/act — chạy workflow GitHub Actions cục bộ trong Docker; bài không dùng, ghi lại để bạn tự thử.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">GitHub Actions — khoá đầy đủ</span><span class="lc-sub">/courses/github-actions/learn${REF} — cú pháp workflow, biểu thức, matrix, cache và bảo mật action.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 13.4 ─────────────────────────── */
    {
      title: '13.4 — Swapping containers without dropping requests|||13.4 — Tráo container mà không rơi request',
      slug: 'deploy-13-4-khong-rot-request-voi-container',
      type: 'LESSON',
      isFreePreview: true,
      description: 'docker compose up -d dừng bản cũ trước khi bản mới sẵn sàng: đo 83–134 request 502 mỗi lần tráo. --wait chỉ sửa script, start_interval rút thời gian chờ khoẻ từ 6 s xuống 2,6 s, còn xanh/lam sau nginx cho 940/940 request 200 — kể cả khi bản mới hỏng. Thêm: nginx giữ IP cũ tới khi reload, và smoke-test 401/404 sau tráo.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.4</span>
<h2>Swapping containers without dropping requests</h2>
<p class="lead">Chapter 3 measured three windows in which requests drop while swapping a PROCESS, and built blue/green behind nginx to close them. Containers do not escape those windows; they only move them. The most habitual deploy command — <code>docker compose up -d</code> — stops the old version BEFORE the new one is ready: 83–134 requests returned 502 each time. This lesson measures them, shows why <code>--wait</code> does not help, builds blue/green with two services in one compose file (940/940 requests 200, even when the new version is broken), and fixes the trap of nginx holding an old IP.</p>

<h3>The measurement: an app that needs 1.5 s, and a request gun</h3>
${slide('dv-13', 23, 'docker compose up -d rơi 83–134 request')}
<p>The test app resembles a real API in the one way that matters: it needs time before listening (connecting to the database, loading config — simulated here as 1.5 s), and its <code>/api/health</code> returns 503 until ready, and 503 again once it receives SIGTERM:</p>
<pre><code class="language-javascript">// app.mjs (rut gon) — gia lap mot API that: 1,5 s noi CSDL + nap cau hinh roi moi nghe cong
const BAN = 'v1';
let sanSang = false, dangTat = false;
const sv = http.createServer((req, res) =&gt; {
  if (req.url === '/api/health') { res.writeHead(sanSang &amp;&amp; !dangTat ? 200 : 503); return res.end(); }
  if (req.url === '/api/ban') { res.writeHead(200); return res.end(BAN + '\\n'); }
  if (req.url === '/api/lich') { res.writeHead(401); return res.end('can dang nhap'); }
  res.writeHead(404); res.end('khong co');
});
setTimeout(() =&gt; sv.listen(3000, () =&gt; { sanSang = true; }), 1500);
process.on('SIGTERM', () =&gt; { dangTat = true; sv.close(() =&gt; process.exit(0)); });</code></pre>
<p>The measuring tool is a Node container on the SAME compose network, firing one request every ~10 ms through nginx, each on a new connection (like a fresh browser), and printing the longest failure window:</p>
<pre><code class="language-javascript">// do.mjs URL MS — ban mot request moi ~10 ms, moi request mot ket noi moi; in tong ket + cua so hong dai nhat
import http from 'node:http';
const [url, ms = '8000'] = process.argv.slice(2);
const t0 = Date.now(), kq = [];
const mot = () =&gt; new Promise((ok) =&gt; {
  const t = Date.now() - t0;
  const r = http.get(url, { agent: false, timeout: 3000 }, (res) =&gt; { res.resume(); res.on('end', () =&gt; ok([t, res.statusCode])); });
  r.on('error', (e) =&gt; ok([t, e.code || 'ERR'])); r.on('timeout', () =&gt; r.destroy(new Error('timeout')));
});
while (Date.now() - t0 &lt; +ms) { kq.push(await mot()); await new Promise((r) =&gt; setTimeout(r, 10)); }
const dem = {}; kq.forEach(([, c]) =&gt; (dem[c] = (dem[c] || 0) + 1));
let dai = 0, bd = null, cs = [0, 0];
kq.forEach(([t, c]) =&gt; { if (c !== 200) { if (bd === null) bd = t; if (t - bd &gt; dai) { dai = t - bd; cs = [bd, t]; } } else bd = null; });
const hong = kq.filter(([, c]) =&gt; c !== 200);
console.log(&#96;tong \${kq.length} request · \${Object.entries(dem).map(([c, n]) =&gt; &#96;\${c}: \${n}&#96;).join(' · ')}&#96;);
if (hong.length) console.log(&#96;hong tu \${hong[0][0]} ms toi \${hong.at(-1)[0]} ms · cua so dai nhat \${dai} ms (\${cs[0]}–\${cs[1]})&#96;);
else console.log('khong rot request nao');</code></pre>
<p>Swapping <code>api</code> to a new tag with Lesson 13.1's exact command, four times:</p>
<div class="out"># doA.sh: may do ban request vao http://web/api/ban tu 2 s truoc khi trao, trong 9 s
$ bash doA.sh 72f5fb8
 Container dat-lich-api-1  Recreate
 Container dat-lich-api-1  Recreated
 Container dat-lich-api-1  Starting
 Container dat-lich-api-1  Started
(up -d tra ve sau 4431 ms)
tong 363 request · 200: 229 · 502: 134
hong tu 4079 ms toi 7184 ms · cua so dai nhat 3105 ms (4079–7184)
# ba lan nua, chi dong ket qua:
(up -d tra ve sau 2017 ms)
tong 470 request · 200: 367 · 502: 103
hong tu 2786 ms toi 5244 ms · cua so dai nhat 2458 ms (2786–5244)
(up -d tra ve sau 1200 ms)
tong 515 request · 200: 432 · 502: 83
hong tu 2126 ms toi 4451 ms · cua so dai nhat 2325 ms (2126–4451)
(up -d tra ve sau 1033 ms)
tong 514 request · 200: 425 · 502: 89
hong tu 2033 ms toi 4407 ms · cua so dai nhat 2374 ms (2033–4407)</div>
<table>
<tr><th>Run</th><th>502 / total</th><th>Failure window</th><th><code>up -d</code> returned after</th></tr>
<tr><td>1</td><td>134 / 363</td><td>3,105 ms</td><td>4,431 ms</td></tr>
<tr><td>2</td><td>103 / 470</td><td>2,458 ms</td><td>2,017 ms</td></tr>
<tr><td>3</td><td>83 / 515</td><td>2,325 ms</td><td>1,200 ms</td></tr>
<tr><td>4</td><td>89 / 514</td><td>2,374 ms</td><td>1,033 ms</td></tr>
</table>
<p>Every swap: 2.3–3.1 seconds of pure 502. (Run 1 was longer because the VPS also had to pull the image.) This is a lab machine on a laptop; on a real VPS, a Next/Express app loading Prisma usually takes much longer than 1.5 s to start — and the window scales with it.</p>

<h3>Why: up -d stops the old one FIRST, then creates the new one</h3>
<p>Docker's event log shows the exact sequence when Compose re-creates a container:</p>
<div class="out">$ docker events --since 30s --until 0s --filter container=xl-api_xanh-1 --format "{{.Time}} {{.Action}}"
1790669654 exec_start: wget -qO- http://127.0.0.1:3000/api/health
1790669654 exec_die
1790669654 kill
1790669654 stop
1790669654 die
1790669674 destroy
1790669674 rename
1790669674 start</div>
<p><code>kill</code> → <code>stop</code> → <code>die</code> of the old container, then <code>rename</code> (the <code>&lt;id&gt;_…</code> name Lesson 13.3 saw in the Conflict error), then <code>start</code> of the new one. Between <code>die</code> and the new app listening, nobody is on port 3000 — nginx gets "Connection refused" and returns 502. Compose has no "start new first, stop old after" mode for a container with a fixed name: two containers cannot share a name, and a <code>container_name</code> or a host-published port cannot be shared either. (The spec's <code>deploy.update_config.order: start-first</code> belongs to Docker Swarm.)</p>
<div class="callout">
<p><strong>Note the fourth column:</strong> <code>up -d</code> returns after 1.0–4.4 s — usually BEFORE the 502 window ends. A script that smoke-tests right after that line meets a 502 and wrongly concludes the new version is broken, or worse, checks nothing and reports success.</p>
</div>

<h3>--wait and start_interval: fixing the script, not the requests</h3>
${slide('dv-13', 24, '--wait sửa script, không sửa request')}
<div class="out">$ docker compose up -d --no-build --wait api
 Container dat-lich-api-1  Recreate
 Container dat-lich-api-1  Recreated
 Container dat-lich-api-1  Starting
 Container dat-lich-api-1  Started
 Container dat-lich-api-1  Waiting
 Container dat-lich-api-1  Healthy
(up -d tra ve sau 7009 ms)
tong 470 request · 200: 373 · 502: 97
hong tu 1896 ms toi 4357 ms · cua so dai nhat 2461 ms (1896–4357)</div>
<p><code>--wait</code> makes Compose wait until the service is Healthy (per its <code>healthcheck</code>) before returning. The script now knows exactly when it is safe to smoke-test. But 97 requests still dropped — the old version was stopped before <code>--wait</code> started waiting. <code>--wait</code> is mandatory in every compose deploy script; it just is not the answer for requests.</p>
<p>One detail made that <code>--wait</code> take 7 seconds while the app was ready at 1.5. During <code>start_period</code>, Docker probes at <code>start_interval</code> — which the Dockerfile reference documents as <strong>5 s by default</strong>, not your <code>interval</code>. The first probe happens at second 5. Lower it:</p>
<div class="out"># thoi gian "docker compose up -d --no-build --wait api_xanh" toi Healthy, app san sang sau 1,5 s
khong start_interval: 6161 ms
khong start_interval: 5995 ms
start_interval 500ms: 2685 ms
start_interval 500ms: 2553 ms</div>
<table>
<tr><th>Healthcheck setting</th><th>Default</th><th>Meaning</th></tr>
<tr><td><code>test</code></td><td>—</td><td>command run INSIDE the container; exit 0 = healthy. The image must have the tool (<code>wget</code> ships in Alpine's busybox; Debian slim images have neither curl nor wget — use <code>node -e</code>).</td></tr>
<tr><td><code>interval</code></td><td>30s</td><td>time between probes AFTER the start phase</td></tr>
<tr><td><code>timeout</code></td><td>30s</td><td>a probe longer than this fails</td></tr>
<tr><td><code>retries</code></td><td>3</td><td>consecutive failures before <code>unhealthy</code></td></tr>
<tr><td><code>start_period</code></td><td>0s</td><td>grace period: failures in it do not count toward <code>retries</code></td></tr>
<tr><td><code>start_interval</code></td><td>5s</td><td>probe interval DURING <code>start_period</code> (Docker Engine 25+)</td></tr>
</table>
<p>A good health check tests what the app really needs (a live database connection, loaded config), but not things outside its control — a health check that calls a third-party service will mark your container "unhealthy" whenever that service flickers.</p>

<h3>Blue/green in one compose file</h3>
${slide('dv-13', 25, 'Xanh/lam sau nginx: 940/940 request 200')}
<p>Chapter 3.3's answer applies to containers unchanged: run TWO versions, switch nginx to the new one once it is healthy, give the old one time to finish in-flight requests, then stop it. With compose, the two "colours" are two differently named services sharing one configuration block (the YAML anchor <code>&amp;api</code> / <code>&lt;&lt;: *api</code>):</p>
<pre><code class="language-yaml">name: xl
x-api: &amp;api                     # khoi dung chung cho hai mau
  env_file: [/home/deploy/bi-mat/api.env]
  restart: unless-stopped
  mem_limit: 256m
  healthcheck:
    test: ["CMD", "wget", "-qO-", "http://127.0.0.1:3000/api/health"]
    interval: 1s
    timeout: 2s
    retries: 3
    start_period: 10s
    start_interval: 500ms
  stop_grace_period: 20s
services:
  api_xanh:
    &lt;&lt;: *api
    image: dv13-reg:5000/dat-lich:\${TAG_XANH:?}
  api_lam:
    &lt;&lt;: *api
    image: dv13-reg:5000/dat-lich:\${TAG_LAM:?}
  web:
    image: nginx:1.27-alpine
    restart: unless-stopped
    ports: ["127.0.0.1:8080:80"]
    volumes: ["./nginx:/etc/nginx/conf.d:ro"]   # THU MUC, khong phai tep don (13.1)</code></pre>
<p>nginx reads its upstream from a small file inside the mounted directory (not a single file — Lesson 13.1), and that is the only file the swap script changes:</p>
<pre><code class="language-nginx"># nginx/app.conf
include /etc/nginx/conf.d/dang-chay.inc;
server {
  listen 80;
  location / { proxy_pass http://api; proxy_next_upstream error timeout http_502; }
}
# nginx/dang-chay.inc — tep DUY NHAT script tra doi
upstream api { server api_xanh:3000; }</code></pre>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Start the IDLE colour with the new tag</span><span class="lz-d"><code>up -d --no-build --wait</code>; the live colour is untouched. Failure ⇒ <code>stop</code> it, exit 1.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Smoke-test the new colour directly</span><span class="lz-d">over the internal network, before any user reaches it: 401 passes, anything else stops.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Write dang-chay.inc, nginx -t, reload</span><span class="lz-d">overwrite in place; reload keeps old workers until in-flight requests finish.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Drain</span><span class="lz-d">a few seconds for requests still on the old colour to complete.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Stop the old colour</span><span class="lz-d">SIGTERM, a clean port close; the stopped colour remains the fastest rollback.</span></div>
</div>
<p>The swap script, one job per line:</p>
<pre><code class="language-bash">#!/bin/bash
# tra-xanh-lam.sh TAG — dung mau dang NGHI voi TAG moi, kiem, doi nginx, xa mau cu
set -Eeuo pipefail
TAG=\${1:?can TAG}; cd ~/xl
CU=$(grep -o 'api_[a-z]*' nginx/dang-chay.inc)
[ "$CU" = api_xanh ] &amp;&amp; MOI=api_lam || MOI=api_xanh
BIEN=TAG_\${MOI#api_}; BIEN=\${BIEN^^}
t() { echo "[$(( ($(date +%s%N)-T0)/1000000 )) ms] $*"; }; T0=$(date +%s%N)
t "dang chay: $CU · se len: $MOI ($TAG)"
sed -i "s/^$BIEN=.*/$BIEN=$TAG/" .env
docker compose up -d --no-build --wait --wait-timeout 20 "$MOI" &gt;/dev/null 2&gt;&amp;1 || { t "HONG: $MOI khong khoe — giu $CU"; docker compose stop "$MOI" &gt;/dev/null 2&gt;&amp;1; exit 1; }
t "$MOI khoe (healthcheck)"
MA=$(docker compose exec -T web curl -s -o /dev/null -w '%{http_code}' "http://$MOI:3000/api/lich" &lt;/dev/null)
[ "$MA" = 401 ] || { t "HONG: smoke $MOI /api/lich -&gt; $MA"; docker compose stop "$MOI" &gt;/dev/null 2&gt;&amp;1; exit 1; }
t "smoke $MOI /api/lich -&gt; $MA"
echo "upstream api { server $MOI:3000; }" &gt; nginx/dang-chay.inc.tam
cat nginx/dang-chay.inc.tam &gt; nginx/dang-chay.inc &amp;&amp; rm nginx/dang-chay.inc.tam   # ghi DE, giu inode
docker compose exec -T web nginx -t &lt;/dev/null &gt;/dev/null 2&gt;&amp;1 || { t "HONG: nginx -t"; exit 1; }
docker compose exec -T web nginx -s reload &lt;/dev/null &gt;/dev/null 2&gt;&amp;1
t "nginx da tro sang $MOI"
sleep 5   # drain: de request dang do tren mau cu chay xong
docker compose stop "$CU" &gt;/dev/null 2&gt;&amp;1
t "da dung $CU"</code></pre>
<div class="out">$ bash doB.sh 241f233        # may do ban suot 14 s, lan tra dau: xanh (v1) -&gt; lam
[2 ms] dang chay: api_xanh · se len: api_lam (241f233)
[9852 ms] api_lam khoe (healthcheck)
[10142 ms] smoke api_lam /api/lich -&gt; 401
[10459 ms] nginx da tro sang api_lam
[15724 ms] da dung api_xanh
tong 710 request · 200: 710
khong rot request nao
$ bash doB.sh 2bed0bb        # them start_interval 500ms, lam -&gt; xanh
[1 ms] dang chay: api_lam · se len: api_xanh (2bed0bb)
[2861 ms] api_xanh khoe (healthcheck)
[3054 ms] smoke api_xanh /api/lich -&gt; 401
[3505 ms] nginx da tro sang api_xanh
[9025 ms] da dung api_lam
tong 940 request · 200: 940
khong rot request nao
$ curl -s 127.0.0.1:8080/api/ban
v5</div>
<p>Two swaps, <strong>710/710 and 940/940</strong> requests returned 200. Not a single 502. The new version was started, waited for until healthy, and smoke-tested directly over the internal network — all while the old version kept serving. Only then was nginx pointed at it (<code>nginx -t</code> first, then <code>reload</code> — reload keeps the old worker processes until they finish their in-flight requests). Five seconds of drain, then <code>stop</code> on the old colour; <code>stop</code> sends SIGTERM and the app closes its port cleanly (Chapter 3.2), with <code>stop_grace_period: 20s</code> giving it time before SIGKILL. The second swap was much faster (2.9 s to healthy instead of 9.9 s) thanks to <code>start_interval</code>.</p>
<table>
<tr><th>Swap method</th><th>Requests dropped (measured)</th><th>Cost</th><th>When</th></tr>
<tr><td>plain <code>up -d</code></td><td>83–134 per swap</td><td>nothing</td><td>coursework, quiet hours, 2–3 s of errors acceptable</td></tr>
<tr><td><code>up -d --wait</code></td><td>97</td><td>script knows when healthy</td><td>always — even alongside the next row</td></tr>
<tr><td>blue/green behind nginx</td><td>0 / 710 and 0 / 940</td><td>2× api RAM for seconds, ~20-line script, migrations compatible with both</td><td>services with real users; this project's production</td></tr>
<tr><td>Swarm/Kubernetes rolling update</td><td>—</td><td>an orchestrator to learn and run</td><td>several machines (Chapter 14)</td></tr>
</table>

<h3>A broken release never receives a request</h3>
${slide('dv-13', 26, 'Bản hỏng không bao giờ nhận request')}
<p>Blue/green's real value is not the smooth swap but the BROKEN one. Release <code>19efddb</code> (v6) adds one line requiring an environment variable nobody has added to <code>api.env</code> yet — very real when code and config live in two places. It dies on start:</p>
<div class="out"># 19efddb = v6: code moi doi mot bien moi truong chua ai them vao api.env -&gt; sap luc khoi dong
$ bash doB.sh 19efddb
[0 ms] dang chay: api_xanh · se len: api_lam (19efddb)
[1698 ms] HONG: api_lam khong khoe
tong 1653 request · 200: 1653
khong rot request nao
$ curl -s 127.0.0.1:8080/api/ban
v5
$ docker compose ps -a --format '{{.Service}} {{.Status}}'
api_lam Restarting (1) 8 seconds ago
api_xanh Up 55 seconds (healthy)
web Up 2 minutes
# ban sua: that bai thi "docker compose stop" mau moi
$ bash tra-xanh-lam.sh 19efddb; echo "ma thoat $?"
[0 ms] dang chay: api_xanh · se len: api_lam (19efddb)
[887 ms] HONG: api_lam khong khoe — giu api_xanh
ma thoat 1
api_lam Exited (1) Less than a second ago
api_xanh Up About a minute (healthy)</div>
<p>1,653/1,653 requests still 200, users saw nothing, and the script exits 1 with an explanation. The first run left <code>api_lam</code> in a <code>Restarting (1)</code> loop — harmless because nginx never pointed at it, but it burns CPU and spams logs — so the fixed script adds <code>docker compose stop "$MOI"</code> to every failure branch. Compared with 18/08: an image that cannot load the Prisma engine dies at exactly this <code>--wait</code> step, and nginx never points at it. Lesson 13.2's check stops it on the build machine; blue/green is the second net on the VPS.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — blue/green does not save you from a breaking migration.</strong> For a few seconds two versions run side by side on the SAME database. A migration that renames a column breaks the old version the moment it runs — before nginx is even switched. Migrations must follow Chapter 5's expand/contract: add first, remove later, each step compatible with both old and new versions.</p>
</div>

<h3>nginx holds the old IP until reloaded</h3>
${slide('dv-13', 27, 'nginx nhớ IP cũ tới khi được reload')}
<p>In Lesson 13.1 the <code>up -d</code> swap dropped requests but then healed, because the new container happened to receive the old IP again (Docker hands out the lowest free address). That is not guaranteed. Force the bad case by letting another container take the old IP during the swap:</p>
<div class="out">$ (IP cua api) 172.18.0.3
$ docker compose rm -sf api &amp;&amp; docker run -d --name chiem --network dat-lich_default alpine:3.20 sleep 1d
  chiem lay IP 172.18.0.3
$ docker compose up -d --wait api
  api moi: 172.18.0.5
$ curl -s -o /dev/null -w "%{http_code}" 127.0.0.1:8080/api/ban
502 502 502
$ docker compose logs web | grep -m1 connect
[error] 30#30: *1 connect() failed (111: Connection refused) while connecting to upstream, client: 172.18.0.1, server: , request: "GET /api/ban HTTP/1.1", upstream: "http://172.18.0.3:3000/api/ban"
$ docker compose exec web nginx -s reload
$ curl …
200</div>
<p>Endless 502, and the log says why: nginx still knocks on <code>172.18.0.3</code> — now owned by a different container. The reason: with <code>proxy_pass http://api:3000;</code>, nginx resolves the name <code>api</code> <strong>once</strong> at start (or reload) and keeps that IP forever. Chapter 3.3 met exactly this with a host name. Two fixes: <code>nginx -s reload</code> after every re-creation of a backend container (blue/green does it already), or make nginx resolve at run time:</p>
<pre><code class="language-nginx">events {}
http {
  resolver 127.0.0.11 valid=5s;        # DNS noi bo cua Docker, nho toi da 5 s
  server {
    listen 80;
    location / {
      set $api http://api:3000;        # co BIEN =&gt; nginx phan giai luc CHAY
      proxy_pass $api;
    }
  }
}</code></pre>
<div class="out"># nginx.conf: resolver 127.0.0.11 valid=5s;  set $api http://api:3000;  proxy_pass $api;
$ (IP cua api) 172.18.0.5
  chiem2 lay IP 172.18.0.5
  api moi: 172.18.0.6
$ (moi giay mot curl, KHONG reload nginx)
200 200 200 200 200 200 200</div>
<p><code>127.0.0.11</code> is the embedded DNS server Docker gives every container on a user-defined network. When <code>proxy_pass</code> contains a variable, nginx resolves the name through <code>resolver</code> while handling the request and caches it for at most <code>valid=5s</code>. The cost: you lose <code>upstream</code> features (several servers, <code>keepalive</code>), and within the 5-second cache the old IP may still be used.</p>

<h3>Smoke test after the swap: 401/200 pass, 404 means an old image</h3>
<p>Every swap ends with the question Chapter 3.5 asked: <em>is the running version really the one I just deployed?</em> A health check cannot answer it (the old version is healthy too). The cheapest answer is to call a route that ONLY this version has:</p>
<pre><code class="language-bash"># sau MOI lan trao, hoi mot route MA CHI BAN NAY CO
$ curl -s -o /dev/null -w '%{http_code}' 127.0.0.1:8080/api/phong-kham
401      # co route (can dang nhap) =&gt; anh moi dang chay
404      # route khong ton tai =&gt; anh CU (hoac ban khac) dang chay
000      # khong ai tra loi =&gt; nginx/api chet</code></pre>
<p>Lesson 13.1 saw it catch an unpulled <code>:latest</code> (404). In <code>tra-xanh-lam.sh</code> the smoke test calls the NEW colour directly over the internal network (<code>http://api_lam:3000</code>) before nginx is switched — so it checks exactly the container about to receive traffic, not "whoever answers on port 80". The real project reads the list of routes to check from <code>deploy.sh</code> AT THE COMMIT BEING DEPLOYED (<code>git show "$SHA:deploy.sh"</code>, Chapter 7.4), so the list always matches the image.</p>

<h3>depends_on: service_healthy — only for the first up</h3>
<p><code>depends_on: { db: { condition: service_healthy } }</code> tells Compose to start <code>api</code> after <code>db</code> is healthy — useful when first building the machine (Lesson 13.1 saw <code>db Healthy</code> before <code>api Started</code>). It does NOTHING for the daily swap (db is untouched), and NOTHING when dockerd restarts containers after a reboot. The app must still retry its connection.</p>

<h3>What differs on Windows/WSL and macOS</h3>
<ul>
<li><strong>Measuring dropped requests on a laptop</strong> gives relative, not absolute, numbers: Docker Desktop is a VM, and networking between its containers is faster than a real network to a VPS. Run the measuring tool INSIDE the compose network as here; do not fire from a browser.</li>
<li><strong>A bash measuring loop on a Mac</strong>: macOS <code>date +%s%N</code> has no nanoseconds (Chapter 7) — use the Node tool above, running in a container.</li>
<li><strong>Windows:</strong> <code>host.docker.internal</code> and host-published ports go through Docker Desktop's forwarding layer; do not use them to draw conclusions about VPS latency.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> during demo week, your project's users complain that "every time the team updates, the site errors for a few seconds". Prove it with numbers, then make the next update go unnoticed.</p>
<ol>
<li>On the lab VPS, run <code>do.mjs</code> inside the compose network while <code>docker compose up -d --no-build api</code> switches to a new tag; record the 502 count and failure window, three times.</li>
<li>Add <code>start_interval: 500ms</code>; measure <code>up -d --wait</code> time-to-healthy before and after.</li>
<li>Build the two-colour <code>xl</code> project and run <code>tra-xanh-lam.sh</code> under load; then swap to a deliberately broken release (missing environment variable).</li>
<li>Force the new container onto a different IP (let another container take the old one); observe the 502s, fix with <code>nginx -s reload</code>, then with <code>resolver</code> + a variable.</li>
</ol>
<p><strong>Done when:</strong> you have a three-run table of "502s with <code>up -d</code>", two blue/green swaps with zero dropped requests (one where the new release is broken and the script exits 1 while the old one keeps serving), and 502s from a stale IP that vanish after a reload.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Zero-downtime deploy</span><span class="v">Swapping versions without any request getting an error — measurable with a request gun.</span></div>
  <div class="kv"><span class="k">Recreate</span><span class="v">Compose stops the old container, renames it, then creates and starts the new one — in that order.</span></div>
  <div class="kv"><span class="k">--wait</span><span class="v">A <code>docker compose up</code> flag: return only when services are Healthy (or fail).</span></div>
  <div class="kv"><span class="k">start_interval</span><span class="v">The probe interval during <code>start_period</code>; 5 s by default.</span></div>
  <div class="kv"><span class="k">Blue/green</span><span class="v">Two versions run side by side; the entry point switches to the new one once healthy, and the old one is stopped after.</span></div>
  <div class="kv"><span class="k">Drain</span><span class="v">Giving the old version time to finish in-flight requests before stopping it.</span></div>
  <div class="kv"><span class="k">Embedded DNS 127.0.0.11</span><span class="v">The DNS server Docker gives containers on user-defined networks; resolves service names to current IPs.</span></div>
  <div class="kv"><span class="k">Smoke test</span><span class="v">A few requests to real routes after a swap: 401/200 means the route exists, 404 an old image, 000 dead.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>docker compose up -d</code> stops the old version before the new one listens: measured 83–134 requests with 502, a 2.3–3.1 s window each time.</li>
<li><code>--wait</code> tells the script when things are healthy (always use it) but does not save requests; <code>start_interval</code> defaults to 5 s — 500 ms cut 6 s down to 2.6 s.</li>
<li>Blue/green in one compose file: two services, nginx picks a colour via a file in a mounted directory, smoke-test the new colour then reload — 710/710 and 940/940 requests 200.</li>
<li>A broken release dies at the <code>--wait</code> step and never gets a request (1,653/1,653 still 200); remember to <code>stop</code> it to avoid a restart loop.</li>
<li>nginx resolves upstream names once: a container changing IP ⇒ 502 until reload; or use <code>resolver 127.0.0.11</code> + a variable.</li>
<li>Smoke-test a route only the new version has: 401/200 pass, 404 means an old image — a health check cannot answer that.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — docker compose up</span><span class="lc-sub">docs.docker.com/reference/cli/docker/compose/up/ — <code>--wait</code>, <code>--wait-timeout</code>, <code>--no-build</code>, <code>--pull</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Dockerfile reference — HEALTHCHECK</span><span class="lc-sub">docs.docker.com/reference/dockerfile/ — <code>interval</code>, <code>timeout</code>, <code>start_period</code>, <code>start_interval</code> (5 s default) and <code>retries</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Compose file reference — services</span><span class="lc-sub">docs.docker.com/reference/compose-file/services/ — <code>healthcheck</code>, <code>depends_on</code> with <code>condition: service_healthy</code>, <code>stop_grace_period</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — ngx_http_core_module: resolver</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_core_module.html — <code>resolver</code>, <code>valid=</code>, and resolution when <code>proxy_pass</code> contains a variable.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — ngx_http_upstream_module</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_upstream_module.html — the <code>upstream</code> block and <code>proxy_next_upstream</code>.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — the full course</span><span class="lc-sub">/courses/nginx/learn${REF} — proxying, upstreams, reloads without dropped connections.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.4</span>
<h2>Tráo container mà không rơi request</h2>
<p class="lead">Chương 3 đã đo ba cửa sổ rơi request khi tráo một TIẾN TRÌNH và dựng xanh/lam sau nginx để lấp chúng. Container không thoát được những cửa sổ đó; nó chỉ đổi chỗ chúng nằm. Lệnh deploy quen tay nhất — <code>docker compose up -d</code> — dừng bản cũ TRƯỚC khi bản mới sẵn sàng: đo được 83–134 request 502 mỗi lần. Bài này đo chúng, cho thấy vì sao <code>--wait</code> không cứu được, dựng xanh/lam bằng hai dịch vụ trong một tệp compose (940/940 request 200, kể cả khi bản mới hỏng), rồi sửa cái bẫy nginx giữ IP cũ.</p>

<h3>Phép đo: một ứng dụng cần 1,5 giây, và một máy bắn request</h3>
${slide('dv-13', 23, 'docker compose up -d rơi 83–134 request')}
<p>Ứng dụng thử giống một API thật ở đúng một điểm quan trọng: nó cần thời gian trước khi nghe cổng (nối cơ sở dữ liệu, nạp cấu hình — ở đây giả lập 1,5 giây), và nó có <code>/api/health</code> trả 503 cho tới khi sẵn sàng, rồi 503 trở lại khi nhận SIGTERM:</p>
<pre><code class="language-javascript">// app.mjs (rut gon) — gia lap mot API that: 1,5 s noi CSDL + nap cau hinh roi moi nghe cong
const BAN = 'v1';
let sanSang = false, dangTat = false;
const sv = http.createServer((req, res) =&gt; {
  if (req.url === '/api/health') { res.writeHead(sanSang &amp;&amp; !dangTat ? 200 : 503); return res.end(); }
  if (req.url === '/api/ban') { res.writeHead(200); return res.end(BAN + '\\n'); }
  if (req.url === '/api/lich') { res.writeHead(401); return res.end('can dang nhap'); }
  res.writeHead(404); res.end('khong co');
});
setTimeout(() =&gt; sv.listen(3000, () =&gt; { sanSang = true; }), 1500);
process.on('SIGTERM', () =&gt; { dangTat = true; sv.close(() =&gt; process.exit(0)); });</code></pre>
<p>Máy đo là một container Node trên CÙNG mạng compose, bắn một request mỗi ~10 ms qua nginx, mỗi request một kết nối mới (như một trình duyệt mới), và in cửa sổ hỏng dài nhất:</p>
<pre><code class="language-javascript">// do.mjs URL MS — ban mot request moi ~10 ms, moi request mot ket noi moi; in tong ket + cua so hong dai nhat
import http from 'node:http';
const [url, ms = '8000'] = process.argv.slice(2);
const t0 = Date.now(), kq = [];
const mot = () =&gt; new Promise((ok) =&gt; {
  const t = Date.now() - t0;
  const r = http.get(url, { agent: false, timeout: 3000 }, (res) =&gt; { res.resume(); res.on('end', () =&gt; ok([t, res.statusCode])); });
  r.on('error', (e) =&gt; ok([t, e.code || 'ERR'])); r.on('timeout', () =&gt; r.destroy(new Error('timeout')));
});
while (Date.now() - t0 &lt; +ms) { kq.push(await mot()); await new Promise((r) =&gt; setTimeout(r, 10)); }
const dem = {}; kq.forEach(([, c]) =&gt; (dem[c] = (dem[c] || 0) + 1));
let dai = 0, bd = null, cs = [0, 0];
kq.forEach(([t, c]) =&gt; { if (c !== 200) { if (bd === null) bd = t; if (t - bd &gt; dai) { dai = t - bd; cs = [bd, t]; } } else bd = null; });
const hong = kq.filter(([, c]) =&gt; c !== 200);
console.log(&#96;tong \${kq.length} request · \${Object.entries(dem).map(([c, n]) =&gt; &#96;\${c}: \${n}&#96;).join(' · ')}&#96;);
if (hong.length) console.log(&#96;hong tu \${hong[0][0]} ms toi \${hong.at(-1)[0]} ms · cua so dai nhat \${dai} ms (\${cs[0]}–\${cs[1]})&#96;);
else console.log('khong rot request nao');</code></pre>
<p>Tráo <code>api</code> sang tag mới bằng đúng lệnh của Bài 13.1, bốn lần:</p>
<div class="out"># doA.sh: may do ban request vao http://web/api/ban tu 2 s truoc khi trao, trong 9 s
$ bash doA.sh 72f5fb8
 Container dat-lich-api-1  Recreate
 Container dat-lich-api-1  Recreated
 Container dat-lich-api-1  Starting
 Container dat-lich-api-1  Started
(up -d tra ve sau 4431 ms)
tong 363 request · 200: 229 · 502: 134
hong tu 4079 ms toi 7184 ms · cua so dai nhat 3105 ms (4079–7184)
# ba lan nua, chi dong ket qua:
(up -d tra ve sau 2017 ms)
tong 470 request · 200: 367 · 502: 103
hong tu 2786 ms toi 5244 ms · cua so dai nhat 2458 ms (2786–5244)
(up -d tra ve sau 1200 ms)
tong 515 request · 200: 432 · 502: 83
hong tu 2126 ms toi 4451 ms · cua so dai nhat 2325 ms (2126–4451)
(up -d tra ve sau 1033 ms)
tong 514 request · 200: 425 · 502: 89
hong tu 2033 ms toi 4407 ms · cua so dai nhat 2374 ms (2033–4407)</div>
<table>
<tr><th>Lần</th><th>502 / tổng</th><th>Cửa sổ hỏng</th><th><code>up -d</code> trả về sau</th></tr>
<tr><td>1</td><td>134 / 363</td><td>3.105 ms</td><td>4.431 ms</td></tr>
<tr><td>2</td><td>103 / 470</td><td>2.458 ms</td><td>2.017 ms</td></tr>
<tr><td>3</td><td>83 / 515</td><td>2.325 ms</td><td>1.200 ms</td></tr>
<tr><td>4</td><td>89 / 514</td><td>2.374 ms</td><td>1.033 ms</td></tr>
</table>
<p>Mỗi lần tráo: 2,3–3,1 giây toàn 502. (Lần 1 dài hơn vì VPS còn phải kéo ảnh.) Đây là máy thí nghiệm trên laptop; trên VPS thật, với một app Next/Express nạp Prisma, khoảng khởi động thường lâu hơn 1,5 giây nhiều — cửa sổ tỉ lệ thuận với nó.</p>

<h3>Vì sao: up -d dừng cũ TRƯỚC, rồi mới tạo mới</h3>
<p>Nhật ký sự kiện của Docker cho thấy đúng trình tự khi Compose tạo lại một container:</p>
<div class="out">$ docker events --since 30s --until 0s --filter container=xl-api_xanh-1 --format "{{.Time}} {{.Action}}"
1790669654 exec_start: wget -qO- http://127.0.0.1:3000/api/health
1790669654 exec_die
1790669654 kill
1790669654 stop
1790669654 die
1790669674 destroy
1790669674 rename
1790669674 start</div>
<p><code>kill</code> → <code>stop</code> → <code>die</code> của container cũ, rồi <code>rename</code> (cái tên <code>&lt;id&gt;_…</code> mà Bài 13.3 thấy trong lỗi Conflict), rồi <code>start</code> container mới. Giữa <code>die</code> và lúc app mới nghe cổng, không có ai ở cổng 3000 — nginx nhận "Connection refused" và trả 502. Compose không có chế độ "khởi động mới trước, dừng cũ sau" cho một container mang tên cố định: hai container không thể cùng tên, và <code>container_name</code>/cổng xuất ra máy chủ cũng không thể dùng chung. (Khoá <code>deploy.update_config.order: start-first</code> trong đặc tả là của Docker Swarm.)</p>
<div class="callout">
<p><strong>Để ý cột thứ tư:</strong> <code>up -d</code> trả về sau 1,0–4,4 giây — thường là TRƯỚC khi cửa sổ 502 kết thúc. Script nào chạy smoke-test ngay sau dòng đó sẽ gặp 502 và kết luận sai là bản mới hỏng, hoặc tệ hơn, không kiểm gì và báo xong.</p>
</div>

<h3>--wait và start_interval: sửa script, không sửa request</h3>
${slide('dv-13', 24, '--wait sửa script, không sửa request')}
<div class="out">$ docker compose up -d --no-build --wait api
 Container dat-lich-api-1  Recreate
 Container dat-lich-api-1  Recreated
 Container dat-lich-api-1  Starting
 Container dat-lich-api-1  Started
 Container dat-lich-api-1  Waiting
 Container dat-lich-api-1  Healthy
(up -d tra ve sau 7009 ms)
tong 470 request · 200: 373 · 502: 97
hong tu 1896 ms toi 4357 ms · cua so dai nhat 2461 ms (1896–4357)</div>
<p><code>--wait</code> bắt Compose chờ tới khi dịch vụ Healthy (theo <code>healthcheck</code>) mới trả về. Script giờ biết đúng lúc nào an toàn để smoke-test. Nhưng request thì vẫn rơi 97 cái — bản cũ đã bị dừng từ trước khi <code>--wait</code> bắt đầu chờ. <code>--wait</code> là bắt buộc trong mọi script deploy bằng compose; nó chỉ không phải lời giải cho request.</p>
<p>Có một chi tiết làm lần <code>--wait</code> trên chậm tới 7 giây trong khi app sẵn sàng sau 1,5 giây. Trong <code>start_period</code>, Docker thăm dò theo <code>start_interval</code> — và tài liệu Dockerfile ghi <strong>mặc định 5 s</strong>, không phải theo <code>interval</code> bạn đặt. Tức lần thăm dò đầu tiên ở giây thứ 5. Đặt nó thấp xuống:</p>
<div class="out"># thoi gian "docker compose up -d --no-build --wait api_xanh" toi Healthy, app san sang sau 1,5 s
khong start_interval: 6161 ms
khong start_interval: 5995 ms
start_interval 500ms: 2685 ms
start_interval 500ms: 2553 ms</div>
<table>
<tr><th>Chỉ thị healthcheck</th><th>Mặc định</th><th>Nghĩa</th></tr>
<tr><td><code>test</code></td><td>—</td><td>lệnh chạy TRONG container; thoát 0 = khoẻ. Ảnh phải có công cụ đó (<code>wget</code> có sẵn trong busybox của Alpine; ảnh slim của Debian thì không có cả curl lẫn wget — dùng <code>node -e</code>).</td></tr>
<tr><td><code>interval</code></td><td>30s</td><td>khoảng giữa hai lần thăm dò SAU giai đoạn khởi động</td></tr>
<tr><td><code>timeout</code></td><td>30s</td><td>một lần thăm dò lâu hơn thế là hỏng</td></tr>
<tr><td><code>retries</code></td><td>3</td><td>bao nhiêu lần hỏng liên tiếp thì thành <code>unhealthy</code></td></tr>
<tr><td><code>start_period</code></td><td>0s</td><td>thời gian ân hạn: hỏng trong khoảng này không tính vào <code>retries</code></td></tr>
<tr><td><code>start_interval</code></td><td>5s</td><td>khoảng thăm dò TRONG <code>start_period</code> (Docker Engine 25+)</td></tr>
</table>
<p>Health tốt kiểm thứ app thật sự cần (kết nối cơ sở dữ liệu còn sống, cấu hình đã nạp), nhưng không kiểm thứ nằm ngoài quyền của nó — một healthcheck gọi sang dịch vụ bên thứ ba sẽ làm container của bạn "unhealthy" mỗi khi bên kia chập chờn.</p>

<h3>Xanh/lam trong một tệp compose</h3>
${slide('dv-13', 25, 'Xanh/lam sau nginx: 940/940 request 200')}
<p>Lời giải của Chương 3.3 áp nguyên cho container: chạy HAI bản, chuyển nginx sang bản mới khi nó đã khoẻ, cho bản cũ thời gian trả nốt request đang dở, rồi mới dừng nó. Với compose, hai "màu" là hai dịch vụ có tên khác nhau dùng chung một khối cấu hình (neo YAML <code>&amp;api</code> / <code>&lt;&lt;: *api</code>):</p>
<pre><code class="language-yaml">name: xl
x-api: &amp;api                     # khoi dung chung cho hai mau
  env_file: [/home/deploy/bi-mat/api.env]
  restart: unless-stopped
  mem_limit: 256m
  healthcheck:
    test: ["CMD", "wget", "-qO-", "http://127.0.0.1:3000/api/health"]
    interval: 1s
    timeout: 2s
    retries: 3
    start_period: 10s
    start_interval: 500ms
  stop_grace_period: 20s
services:
  api_xanh:
    &lt;&lt;: *api
    image: dv13-reg:5000/dat-lich:\${TAG_XANH:?}
  api_lam:
    &lt;&lt;: *api
    image: dv13-reg:5000/dat-lich:\${TAG_LAM:?}
  web:
    image: nginx:1.27-alpine
    restart: unless-stopped
    ports: ["127.0.0.1:8080:80"]
    volumes: ["./nginx:/etc/nginx/conf.d:ro"]   # THU MUC, khong phai tep don (13.1)</code></pre>
<p>nginx đọc upstream từ một tệp nhỏ nằm trong thư mục được gắn (không phải tệp đơn — Bài 13.1), và đó là tệp duy nhất mà script tráo đổi:</p>
<pre><code class="language-nginx"># nginx/app.conf
include /etc/nginx/conf.d/dang-chay.inc;
server {
  listen 80;
  location / { proxy_pass http://api; proxy_next_upstream error timeout http_502; }
}
# nginx/dang-chay.inc — tep DUY NHAT script tra doi
upstream api { server api_xanh:3000; }</code></pre>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Lên màu ĐANG NGHỈ với tag mới</span><span class="lz-d"><code>up -d --no-build --wait</code>; màu đang chạy không bị đụng tới. Hỏng ⇒ <code>stop</code> nó, thoát 1.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Smoke-test thẳng vào màu mới</span><span class="lz-d">qua mạng nội bộ, trước khi có người dùng nào tới: 401 đạt, khác ⇒ dừng.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Ghi dang-chay.inc, nginx -t, reload</span><span class="lz-d">ghi đè tại chỗ; reload giữ worker cũ tới khi trả xong request đang dở.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Drain</span><span class="lz-d">vài giây để request đang ở màu cũ chạy xong.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Stop màu cũ</span><span class="lz-d">SIGTERM, đóng cổng tử tế; màu cũ nằm đó làm đường lùi nhanh nhất.</span></div>
</div>
<p>Script tráo, mỗi dòng một việc:</p>
<pre><code class="language-bash">#!/bin/bash
# tra-xanh-lam.sh TAG — dung mau dang NGHI voi TAG moi, kiem, doi nginx, xa mau cu
set -Eeuo pipefail
TAG=\${1:?can TAG}; cd ~/xl
CU=$(grep -o 'api_[a-z]*' nginx/dang-chay.inc)
[ "$CU" = api_xanh ] &amp;&amp; MOI=api_lam || MOI=api_xanh
BIEN=TAG_\${MOI#api_}; BIEN=\${BIEN^^}
t() { echo "[$(( ($(date +%s%N)-T0)/1000000 )) ms] $*"; }; T0=$(date +%s%N)
t "dang chay: $CU · se len: $MOI ($TAG)"
sed -i "s/^$BIEN=.*/$BIEN=$TAG/" .env
docker compose up -d --no-build --wait --wait-timeout 20 "$MOI" &gt;/dev/null 2&gt;&amp;1 || { t "HONG: $MOI khong khoe — giu $CU"; docker compose stop "$MOI" &gt;/dev/null 2&gt;&amp;1; exit 1; }
t "$MOI khoe (healthcheck)"
MA=$(docker compose exec -T web curl -s -o /dev/null -w '%{http_code}' "http://$MOI:3000/api/lich" &lt;/dev/null)
[ "$MA" = 401 ] || { t "HONG: smoke $MOI /api/lich -&gt; $MA"; docker compose stop "$MOI" &gt;/dev/null 2&gt;&amp;1; exit 1; }
t "smoke $MOI /api/lich -&gt; $MA"
echo "upstream api { server $MOI:3000; }" &gt; nginx/dang-chay.inc.tam
cat nginx/dang-chay.inc.tam &gt; nginx/dang-chay.inc &amp;&amp; rm nginx/dang-chay.inc.tam   # ghi DE, giu inode
docker compose exec -T web nginx -t &lt;/dev/null &gt;/dev/null 2&gt;&amp;1 || { t "HONG: nginx -t"; exit 1; }
docker compose exec -T web nginx -s reload &lt;/dev/null &gt;/dev/null 2&gt;&amp;1
t "nginx da tro sang $MOI"
sleep 5   # drain: de request dang do tren mau cu chay xong
docker compose stop "$CU" &gt;/dev/null 2&gt;&amp;1
t "da dung $CU"</code></pre>
<div class="out">$ bash doB.sh 241f233        # may do ban suot 14 s, lan tra dau: xanh (v1) -&gt; lam
[2 ms] dang chay: api_xanh · se len: api_lam (241f233)
[9852 ms] api_lam khoe (healthcheck)
[10142 ms] smoke api_lam /api/lich -&gt; 401
[10459 ms] nginx da tro sang api_lam
[15724 ms] da dung api_xanh
tong 710 request · 200: 710
khong rot request nao
$ bash doB.sh 2bed0bb        # them start_interval 500ms, lam -&gt; xanh
[1 ms] dang chay: api_lam · se len: api_xanh (2bed0bb)
[2861 ms] api_xanh khoe (healthcheck)
[3054 ms] smoke api_xanh /api/lich -&gt; 401
[3505 ms] nginx da tro sang api_xanh
[9025 ms] da dung api_lam
tong 940 request · 200: 940
khong rot request nao
$ curl -s 127.0.0.1:8080/api/ban
v5</div>
<p>Hai lần tráo, <strong>710/710 và 940/940</strong> request trả 200. Không một cái 502. Bản mới được khởi động, chờ khoẻ, qua smoke-test gọi thẳng vào nó qua mạng nội bộ — tất cả trong khi bản cũ vẫn phục vụ. Chỉ sau đó nginx mới được trỏ sang (<code>nginx -t</code> trước, <code>reload</code> sau — reload giữ các tiến trình worker cũ tới khi chúng trả xong request đang dở). Năm giây drain rồi mới <code>stop</code> màu cũ; <code>stop</code> gửi SIGTERM và app đóng cổng tử tế (Chương 3.2), <code>stop_grace_period: 20s</code> cho nó đủ thời gian trước SIGKILL. Lần thứ hai nhanh hơn hẳn (2,9 s tới khoẻ thay vì 9,9 s) nhờ <code>start_interval</code>.</p>
<table>
<tr><th>Cách tráo</th><th>Request rơi (đo)</th><th>Giá</th><th>Khi nào dùng</th></tr>
<tr><td><code>up -d</code> trơn</td><td>83–134 / lần</td><td>không gì</td><td>đồ án, giờ ít người, chấp nhận 2–3 s lỗi</td></tr>
<tr><td><code>up -d --wait</code></td><td>97</td><td>script biết lúc khoẻ</td><td>luôn luôn — kể cả khi dùng cách dưới</td></tr>
<tr><td>xanh/lam sau nginx</td><td>0 / 710 và 0 / 940</td><td>2× RAM của api vài giây, script ~20 dòng, migration hợp cả hai bản</td><td>dịch vụ có người dùng thật; production của dự án</td></tr>
<tr><td>Swarm/Kubernetes (rolling update)</td><td>—</td><td>một bộ điều phối cần học và vận hành</td><td>nhiều máy (Chương 14)</td></tr>
</table>

<h3>Bản hỏng không bao giờ nhận request</h3>
${slide('dv-13', 26, 'Bản hỏng không bao giờ nhận request')}
<p>Giá trị thật của xanh/lam không phải ở lần tráo trơn tru, mà ở lần tráo HỎNG. Bản <code>19efddb</code> (v6) thêm một dòng đòi một biến môi trường mà chưa ai thêm vào <code>api.env</code> — chuyện rất thật khi code và cấu hình sống ở hai nơi. Nó chết ngay khi khởi động:</p>
<div class="out"># 19efddb = v6: code moi doi mot bien moi truong chua ai them vao api.env -&gt; sap luc khoi dong
$ bash doB.sh 19efddb
[0 ms] dang chay: api_xanh · se len: api_lam (19efddb)
[1698 ms] HONG: api_lam khong khoe
tong 1653 request · 200: 1653
khong rot request nao
$ curl -s 127.0.0.1:8080/api/ban
v5
$ docker compose ps -a --format '{{.Service}} {{.Status}}'
api_lam Restarting (1) 8 seconds ago
api_xanh Up 55 seconds (healthy)
web Up 2 minutes
# ban sua: that bai thi "docker compose stop" mau moi
$ bash tra-xanh-lam.sh 19efddb; echo "ma thoat $?"
[0 ms] dang chay: api_xanh · se len: api_lam (19efddb)
[887 ms] HONG: api_lam khong khoe — giu api_xanh
ma thoat 1
api_lam Exited (1) Less than a second ago
api_xanh Up About a minute (healthy)</div>
<p>1.653/1.653 request vẫn 200, người dùng không thấy gì, và script thoát 1 với lời giải thích. Lần chạy đầu để lại <code>api_lam</code> trong vòng <code>Restarting (1)</code> — vô hại vì nginx không trỏ tới nó, nhưng tốn CPU và rác log — nên bản sửa thêm <code>docker compose stop "$MOI"</code> vào mọi nhánh hỏng. So với sự cố 18/08: ảnh không nạp nổi engine Prisma sẽ chết ở đúng bước <code>--wait</code> này, và nginx chưa từng trỏ sang nó. Chốt kiểm ở Bài 13.2 chặn nó từ máy dựng; xanh/lam là lưới thứ hai ở VPS.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — xanh/lam không cứu được migration phá vỡ.</strong> Trong vài giây hai bản chạy song song trên CÙNG cơ sở dữ liệu. Một migration đổi tên cột làm bản cũ hỏng ngay khi nó chạy — trước cả lúc nginx được trỏ sang bản mới. Migration phải theo kiểu mở rộng/thu hẹp của Chương 5: thêm trước, bỏ sau, mỗi bước hợp với cả bản cũ lẫn bản mới.</p>
</div>

<h3>nginx giữ IP cũ tới khi được reload</h3>
${slide('dv-13', 27, 'nginx nhớ IP cũ tới khi được reload')}
<p>Ở Bài 13.1 lần tráo <code>up -d</code> rơi request nhưng rồi tự lành, vì container mới tình cờ nhận lại đúng IP cũ (Docker cấp IP trống nhỏ nhất). Điều đó không được bảo đảm. Ép tình huống xấu bằng một container khác chiếm IP cũ trong lúc tráo:</p>
<div class="out">$ (IP cua api) 172.18.0.3
$ docker compose rm -sf api &amp;&amp; docker run -d --name chiem --network dat-lich_default alpine:3.20 sleep 1d
  chiem lay IP 172.18.0.3
$ docker compose up -d --wait api
  api moi: 172.18.0.5
$ curl -s -o /dev/null -w "%{http_code}" 127.0.0.1:8080/api/ban
502 502 502
$ docker compose logs web | grep -m1 connect
[error] 30#30: *1 connect() failed (111: Connection refused) while connecting to upstream, client: 172.18.0.1, server: , request: "GET /api/ban HTTP/1.1", upstream: "http://172.18.0.3:3000/api/ban"
$ docker compose exec web nginx -s reload
$ curl …
200</div>
<p>502 không dứt, và log nói rõ: nginx vẫn gõ cửa <code>172.18.0.3</code> — giờ là của một container khác. Lý do: với <code>proxy_pass http://api:3000;</code>, nginx phân giải tên <code>api</code> <strong>một lần</strong> lúc khởi động (hoặc reload) và giữ IP đó mãi. Chương 3.3 gặp đúng hành vi này với một tên máy. Hai cách chữa: <code>nginx -s reload</code> sau mỗi lần tạo lại container phía sau (xanh/lam làm sẵn), hoặc bắt nginx phân giải lúc chạy:</p>
<pre><code class="language-nginx">events {}
http {
  resolver 127.0.0.11 valid=5s;        # DNS noi bo cua Docker, nho toi da 5 s
  server {
    listen 80;
    location / {
      set $api http://api:3000;        # co BIEN =&gt; nginx phan giai luc CHAY
      proxy_pass $api;
    }
  }
}</code></pre>
<div class="out"># nginx.conf: resolver 127.0.0.11 valid=5s;  set $api http://api:3000;  proxy_pass $api;
$ (IP cua api) 172.18.0.5
  chiem2 lay IP 172.18.0.5
  api moi: 172.18.0.6
$ (moi giay mot curl, KHONG reload nginx)
200 200 200 200 200 200 200</div>
<p><code>127.0.0.11</code> là máy chủ DNS nhúng mà Docker cấp cho mọi container trên mạng do người dùng tạo. Khi <code>proxy_pass</code> chứa một biến, nginx phân giải tên qua <code>resolver</code> lúc xử lý request và nhớ kết quả tối đa <code>valid=5s</code>. Cái giá: mất tính năng <code>upstream</code> (nhiều máy chủ, <code>keepalive</code>), và trong 5 giây nhớ đệm thì IP cũ vẫn có thể được dùng.</p>

<h3>Smoke-test sau tráo: 401/200 đạt, 404 là ảnh cũ</h3>
<p>Mọi lần tráo đều kết thúc bằng câu hỏi Chương 3.5 đặt ra: <em>bản đang chạy có đúng là bản tôi vừa deploy không?</em> Healthcheck không trả lời được (bản cũ cũng khoẻ). Câu trả lời rẻ nhất là gọi một route mà CHỈ bản này có:</p>
<pre><code class="language-bash"># sau MOI lan trao, hoi mot route MA CHI BAN NAY CO
$ curl -s -o /dev/null -w '%{http_code}' 127.0.0.1:8080/api/phong-kham
401      # co route (can dang nhap) =&gt; anh moi dang chay
404      # route khong ton tai =&gt; anh CU (hoac ban khac) dang chay
000      # khong ai tra loi =&gt; nginx/api chet</code></pre>
<p>Bài 13.1 đã thấy nó bắt được <code>:latest</code> không được kéo (404). Trong <code>tra-xanh-lam.sh</code>, smoke-test gọi thẳng vào màu MỚI qua mạng nội bộ (<code>http://api_lam:3000</code>) trước khi nginx trỏ sang — nên nó kiểm đúng container sắp nhận request, không phải "ai đó đang trả lời ở cổng 80". Dự án thật đọc danh sách route cần kiểm từ <code>deploy.sh</code> CỦA ĐÚNG COMMIT đang deploy (<code>git show "$SHA:deploy.sh"</code>, Chương 7.4), để danh sách luôn khớp với ảnh.</p>

<h3>depends_on: service_healthy — chỉ cho lần up đầu</h3>
<p><code>depends_on: { db: { condition: service_healthy } }</code> bảo Compose khởi động <code>api</code> sau khi <code>db</code> khoẻ — hữu ích lần đầu dựng máy (Bài 13.1 thấy <code>db Healthy</code> trước <code>api Started</code>). Nó KHÔNG làm gì cho lần tráo hằng ngày (db không bị động tới), và KHÔNG làm gì khi dockerd tự bật lại container sau reboot. App vẫn phải tự thử kết nối lại.</p>

<h3>Trên Windows/WSL và macOS khác gì</h3>
<ul>
<li><strong>Đo request rơi trên laptop</strong> cho con số tương đối, không tuyệt đối: Docker Desktop là một máy ảo; mạng giữa container trong đó nhanh hơn mạng thật tới VPS. Hãy chạy máy đo TRONG cùng mạng compose như ở đây, đừng bắn từ trình duyệt.</li>
<li><strong>Vòng lặp đo bằng bash trên Mac</strong>: <code>date +%s%N</code> của macOS không có nano giây (Chương 7) — dùng máy đo Node như trên, chạy trong container.</li>
<li><strong>Windows:</strong> <code>host.docker.internal</code> và cổng xuất ra máy chủ đi qua lớp chuyển tiếp của Docker Desktop; đừng dùng chúng để kết luận về độ trễ trên VPS.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tuần demo, người dùng của đồ án than "cứ mỗi lần nhóm cập nhật là trang lỗi vài giây". Chứng minh bằng số, rồi làm cho lần cập nhật tiếp theo không ai nhận ra.</p>
<ol>
<li>Trên VPS thí nghiệm, chạy <code>do.mjs</code> trong mạng compose trong lúc <code>docker compose up -d --no-build api</code> sang một tag mới; ghi số 502 và cửa sổ hỏng, ba lần.</li>
<li>Thêm <code>start_interval: 500ms</code>; đo thời gian <code>up -d --wait</code> tới Healthy trước và sau.</li>
<li>Dựng dự án <code>xl</code> hai màu, chạy <code>tra-xanh-lam.sh</code> dưới tải; rồi tráo sang một bản cố tình hỏng (thiếu biến môi trường).</li>
<li>Ép container mới đổi IP (cho một container khác chiếm IP cũ); xem 502, sửa bằng <code>nginx -s reload</code>, rồi bằng <code>resolver</code> + biến.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có bảng "502 khi <code>up -d</code>" ba lần, hai lần xanh/lam với 0 request rơi (một lần bản mới hỏng và script thoát 1 trong khi bản cũ vẫn phục vụ), và 502 do IP cũ biến mất sau reload.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Zero-downtime deploy (deploy không gián đoạn)</span><span class="v">Tráo phiên bản mà không request nào nhận lỗi — đo được bằng một máy bắn request.</span></div>
  <div class="kv"><span class="k">Recreate (tạo lại container)</span><span class="v">Compose dừng container cũ, đổi tên, rồi tạo và khởi động container mới — theo đúng thứ tự đó.</span></div>
  <div class="kv"><span class="k">--wait (chờ khoẻ)</span><span class="v">Cờ của <code>docker compose up</code>: chỉ trả về khi dịch vụ Healthy (hoặc báo lỗi).</span></div>
  <div class="kv"><span class="k">start_interval (nhịp thăm dò lúc khởi động)</span><span class="v">Khoảng thăm dò trong <code>start_period</code>; mặc định 5 s.</span></div>
  <div class="kv"><span class="k">Blue/green (xanh/lam)</span><span class="v">Hai bản chạy song song; lối vào chuyển sang bản mới khi nó đã khoẻ, bản cũ được dừng sau.</span></div>
  <div class="kv"><span class="k">Drain (rút cạn)</span><span class="v">Cho bản cũ thời gian trả nốt request đang dở trước khi dừng.</span></div>
  <div class="kv"><span class="k">Embedded DNS 127.0.0.11 (DNS nhúng của Docker)</span><span class="v">Máy chủ DNS Docker cấp cho container trên mạng tự tạo; phân giải tên dịch vụ ra IP hiện tại.</span></div>
  <div class="kv"><span class="k">Smoke test (phép kiểm khói)</span><span class="v">Vài request tới route thật sau khi tráo: 401/200 là có route, 404 là ảnh cũ, 000 là chết.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>docker compose up -d</code> dừng bản cũ trước khi bản mới nghe cổng: đo 83–134 request 502, cửa sổ 2,3–3,1 s mỗi lần.</li>
<li><code>--wait</code> cho script biết lúc khoẻ (luôn dùng) nhưng không cứu request; <code>start_interval</code> mặc định 5 s — đặt 500 ms rút từ 6 s xuống 2,6 s.</li>
<li>Xanh/lam trong một compose: hai dịch vụ, nginx trỏ màu qua một tệp trong thư mục gắn, smoke-test màu mới rồi mới reload — 710/710 và 940/940 request 200.</li>
<li>Bản hỏng chết ở bước <code>--wait</code> và không bao giờ nhận request (1.653/1.653 vẫn 200); nhớ <code>stop</code> nó để khỏi vòng restart.</li>
<li>nginx phân giải tên upstream một lần: container đổi IP ⇒ 502 tới khi reload; hoặc <code>resolver 127.0.0.11</code> + biến.</li>
<li>Smoke-test gọi một route chỉ bản mới có: 401/200 đạt, 404 là ảnh cũ — healthcheck không trả lời được câu đó.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — docker compose up</span><span class="lc-sub">docs.docker.com/reference/cli/docker/compose/up/ — <code>--wait</code>, <code>--wait-timeout</code>, <code>--no-build</code>, <code>--pull</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Dockerfile reference — HEALTHCHECK</span><span class="lc-sub">docs.docker.com/reference/dockerfile/ — <code>interval</code>, <code>timeout</code>, <code>start_period</code>, <code>start_interval</code> (mặc định 5 s) và <code>retries</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Compose file reference — services</span><span class="lc-sub">docs.docker.com/reference/compose-file/services/ — <code>healthcheck</code>, <code>depends_on</code> với <code>condition: service_healthy</code>, <code>stop_grace_period</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — ngx_http_core_module: resolver</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_core_module.html — <code>resolver</code>, <code>valid=</code>, và việc phân giải khi <code>proxy_pass</code> có biến.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — ngx_http_upstream_module</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_upstream_module.html — khối <code>upstream</code> và <code>proxy_next_upstream</code>.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — khoá đầy đủ</span><span class="lc-sub">/courses/nginx/learn${REF} — proxy, upstream, reload không rơi kết nối.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 13.5 ─────────────────────────── */
    {
      title: '13.5 — Chapter 13 quiz|||13.5 — Kiểm tra Chương 13',
      slug: 'deploy-13-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười tình huống thật về compose trên VPS, ảnh dựng xanh mà chạy chết, khoá CI, concurrency và request rơi khi tráo container — mỗi câu có giải thích.',
      content: `<div class="ml-en">
<span class="eyebrow">Chapter 13 · Quiz</span>
<h2>Chapter 13 — deploying with containers, a registry and CI</h2>
<p class="lead">Ten situations from the lab and from this project's own incidents: an unpulled :latest, a green build that dies on start, a CI key, racing workflows, and requests dropped during a swap. Each answer comes with why it is right and why the most tempting alternative is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain every line of a VPS compose.yaml: commit tag, env_file, restart, mem_limit, logging, healthcheck, named volume.</li>
<li>I can say why a single-file bind mount ignores an edit made with mv or sed -i, and how to verify from inside the container.</li>
<li>I can reproduce a glibc engine in a musl image and write a check that loads the engine before pushing.</li>
<li>I can write a deploy workflow whose SSH key can only run one validated command, with a pinned known_hosts.</li>
<li>I know what concurrency does and does not do, and where the lock for deploys must live.</li>
<li>I can measure requests dropped by docker compose up -d and remove them with blue/green behind nginx.</li>
</ul>
${slide('dv-13', 29, 'Bảng tra nhanh Chương 13')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Kiểm tra</span>
<h2>Chương 13 — deploy bằng container, registry và CI</h2>
<p class="lead">Mười tình huống lấy từ phòng thí nghiệm và từ chính những sự cố của dự án: một :latest không được kéo, một bản dựng xanh mà khởi động là chết, một khoá CI, hai workflow đua nhau, và request rơi trong lúc tráo. Mỗi đáp án kèm lý do vì sao đúng và vì sao phương án hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được từng dòng của compose.yaml trên VPS: tag theo commit, env_file, restart, mem_limit, logging, healthcheck, volume có tên.</li>
<li>Tôi nói được vì sao bind-mount tệp đơn bỏ qua lần sửa bằng mv hay sed -i, và kiểm lại từ bên trong container thế nào.</li>
<li>Tôi tái hiện được engine glibc trong ảnh musl và viết được chốt kiểm NẠP engine trước khi đẩy.</li>
<li>Tôi viết được workflow deploy mà khoá SSH chỉ chạy được một lệnh đã kiểm, với known_hosts ghim sẵn.</li>
<li>Tôi biết concurrency làm gì và không làm gì, và khoá chống deploy chồng phải nằm ở đâu.</li>
<li>Tôi đo được số request rơi khi docker compose up -d và bỏ được chúng bằng xanh/lam sau nginx.</li>
</ul>
${slide('dv-13', 29, 'Bảng tra nhanh Chương 13')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'compose.yaml says <code>image: ghcr.io/team/api:latest</code>. The build machine pushed a new <code>:latest</code>, you run <code>docker compose up -d</code> on the VPS, it reports Healthy, and the new route returns 404. Most likely cause?|||compose.yaml ghi <code>image: ghcr.io/team/api:latest</code>. Máy dựng đã đẩy <code>:latest</code> mới, bạn chạy <code>docker compose up -d</code> trên VPS, báo Healthy, mà route mới trả 404. Nguyên nhân khả dĩ nhất?',
            options: [
              'nginx caches the old response for the route|||nginx đệm câu trả lời cũ của route đó',
              'The old :latest was already on disk, so up -d did not pull and the old image is running|||:latest cũ đã có trên đĩa nên up -d không kéo, và ảnh cũ đang chạy',
              'The healthcheck is checking the wrong port|||healthcheck đang kiểm nhầm cổng',
              'The registry has not finished processing the push|||registry chưa xử lý xong lần đẩy',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: With an image already present, up -d does not pull; the container is healthy and runs the old code — measured: v1 served, /api/phong-kham 404, until docker compose pull. Tags = commit IDs make the name change on every deploy. An nginx cache is tempting but proxy responses are not cached unless configured, and the 404 came from the API itself.|||VI: Ảnh đã có trên đĩa thì up -d không kéo; container khoẻ và chạy mã cũ — đo được: v1 phục vụ, /api/phong-kham 404, tới khi docker compose pull. Tag theo commit làm tên đổi ở mỗi lần deploy. Đệm của nginx nghe hợp lý nhưng nginx không đệm proxy nếu không cấu hình, và 404 do chính API trả.',
          },
          {
            question: 'After a deploy, <code>docker ps</code> shows <code>Restarting (1)</code> and the log says Prisma "could not locate the Query Engine for runtime linux-musl…, generated for linux-…". Build and push were green. What went wrong?|||Sau deploy, <code>docker ps</code> báo <code>Restarting (1)</code> và log nói Prisma "could not locate the Query Engine for runtime linux-musl…, generated for linux-…". Build và push đều xanh. Sai ở đâu?',
            options: [
              'The database is down, so Prisma cannot connect|||CSDL đang sập nên Prisma không kết nối được',
              'The restart policy should be always instead of unless-stopped|||chính sách restart phải là always thay vì unless-stopped',
              'node_modules generated on a glibc base was copied into an Alpine (musl) runtime image|||node_modules sinh trên nền glibc bị chép vào ảnh chạy Alpine (musl)',
              'The image was pushed without a digest|||ảnh được đẩy mà không có digest',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: The engine was generated for glibc (Debian) and the runtime is musl (Alpine) — exactly the 18/08 incident. Nothing in build or push runs the engine, so both stay green. "Database down" is the attractive wrong answer: that error reads "Can’t reach database server", which actually proves the engine loaded.|||VI: Engine sinh cho glibc (Debian) còn nền chạy là musl (Alpine) — đúng sự cố 18/08. Build và push không bước nào chạy engine nên đều xanh. "CSDL sập" là phương án hấp dẫn nhưng sai: lỗi đó có dạng "Can’t reach database server", và nó lại chứng minh engine đã nạp được.',
          },
          {
            question: 'Which pre-push check reliably catches the image from the previous question AND an image built for the wrong CPU?|||Chốt kiểm trước khi đẩy nào bắt chắc được ảnh ở câu trước VÀ một ảnh dựng sai kiến trúc CPU?',
            options: [
              'Run the image and call PrismaClient.$connect() on an unreachable DB; accept only "Can’t reach database server"|||Chạy ảnh và gọi PrismaClient.$connect() tới một CSDL không tồn tại; chỉ chấp nhận "Can’t reach database server"',
              'Run ldd on the .so.node engine and require exit code 0|||Chạy ldd trên engine .so.node và đòi mã thoát 0',
              'Compare the image size with the previous release|||So kích thước ảnh với bản trước',
              'Check that docker build exited 0 and the tag exists in the registry|||Kiểm docker build thoát 0 và tag có trên registry',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Actually loading the engine does what production does, so it catches wrong libc, missing libssl and wrong architecture alike. ldd is the attractive trap: measured, it exits 127 for BOTH the wrong and the right engine (napi_* symbols come from the node process), so it cannot tell them apart. Size was identical (358 MB) for both images.|||VI: Nạp thật engine là làm đúng việc production làm, nên bắt được cả sai libc, thiếu libssl lẫn sai kiến trúc. ldd là cái bẫy: đo được nó thoát 127 với CẢ engine sai lẫn đúng (các ký hiệu napi_* do tiến trình node cấp), nên không phân biệt được. Kích thước thì y hệt (358 MB) ở cả hai ảnh.',
          },
          {
            question: 'On an M1 Mac without emulation, a Dockerfile uses <code>FROM --platform=$BUILDPLATFORM</code> for the build stage (npm install + prisma generate) and a final stage with no RUN. <code>docker build --platform linux/amd64</code> succeeds and inspect shows linux/amd64. What will happen on an x86 VPS?|||Trên Mac M1 không giả lập, Dockerfile dùng <code>FROM --platform=$BUILDPLATFORM</code> cho tầng dựng (npm install + prisma generate) và tầng cuối không có RUN. <code>docker build --platform linux/amd64</code> thành công, inspect báo linux/amd64. Trên VPS x86 sẽ thế nào?',
            options: [
              'It runs fine: the image architecture is amd64|||Chạy tốt: kiến trúc ảnh là amd64',
              'It fails with exec format error on node itself|||Hỏng với exec format error ngay ở node',
              'It runs, but slowly, through emulation on the VPS|||Chạy được nhưng chậm, qua giả lập trên VPS',
              'Node starts, but the Prisma engine inside is arm64 and cannot load|||Node khởi động, nhưng engine Prisma bên trong là bản arm64 và không nạp được',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: The final stage’s node is amd64, but prisma generate ran in the arm64 stage — measured: only libquery_engine-linux-musl-arm64 inside, until binaryTargets named the x86 target. "Runs fine" is the trap: inspect reports the image platform, not what the files inside were built for.|||VI: node ở tầng cuối là amd64, nhưng prisma generate chạy ở tầng arm64 — đo được: bên trong chỉ có libquery_engine-linux-musl-arm64, tới khi binaryTargets khai đích x86. "Chạy tốt" là cái bẫy: inspect báo nền của ảnh, không báo các tệp bên trong được dựng cho CPU nào.',
          },
          {
            question: 'You edit the bind-mounted <code>nginx.conf</code> with <code>sed -i</code>, run <code>nginx -t</code> (OK) and <code>nginx -s reload</code> (OK), but nothing changes. Why, and what fixes it?|||Bạn sửa <code>nginx.conf</code> đang bind-mount bằng <code>sed -i</code>, chạy <code>nginx -t</code> (OK) và <code>nginx -s reload</code> (OK) mà không có gì đổi. Vì sao, và sửa thế nào?',
            options: [
              'reload does not re-read files; run docker compose up -d web|||reload không đọc lại tệp; chạy docker compose up -d web',
              'sed -i wrote a new inode and the single-file mount still points at the old one; overwrite in place (cat new > nginx.conf) or mount the directory|||sed -i ghi ra inode mới còn mount tệp đơn vẫn trỏ inode cũ; ghi đè tại chỗ (cat mới > nginx.conf) hoặc gắn cả thư mục',
              'The file needs chmod 644 before nginx can read it|||Tệp cần chmod 644 thì nginx mới đọc được',
              'nginx -t checks a cached copy; add -c to force a re-read|||nginx -t kiểm bản đệm; thêm -c để ép đọc lại',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: A single-file bind mount is attached by inode at container start; sed -i/mv/rsync replace the inode, so nginx -t and reload work on the OLD file — measured sha256 differed between host and container. "docker compose up -d web" is the attractive answer, but measured it just says Running and does nothing because compose.yaml did not change.|||VI: Bind-mount tệp đơn gắn theo inode lúc container khởi động; sed -i/mv/rsync thay inode, nên nginx -t và reload làm việc trên tệp CŨ — đo được sha256 lệch giữa máy chủ và container. "docker compose up -d web" là phương án hấp dẫn, nhưng đo được nó chỉ báo Running và không làm gì vì compose.yaml không đổi.',
          },
          {
            question: 'A GitHub Actions secret holding the CI SSH key leaks. Which setup limits the damage to "redeploy a commit that is already in the registry"?|||Secret GitHub Actions chứa khoá SSH của CI bị lộ. Cách cài nào giới hạn thiệt hại ở mức "deploy lại một commit đã có trên registry"?',
            options: [
              'command="/home/deploy/bin/trien-khai-ci",restrict on that key, with the script validating SSH_ORIGINAL_COMMAND|||command="/home/deploy/bin/trien-khai-ci",restrict trên khoá đó, script kiểm SSH_ORIGINAL_COMMAND',
              'A passphrase on the key stored in another secret|||Đặt mật khẩu cho khoá và cất mật khẩu ở secret khác',
              'StrictHostKeyChecking=yes in the workflow|||StrictHostKeyChecking=yes trong workflow',
              'Using the deploy user instead of root|||Dùng người dùng deploy thay vì root',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The forced command makes the key run only that script, and restrict disables shells, tunnels and forwarding — measured: one deploy OK, four refusals including "administratively prohibited" for -L. A passphrase is useless when it sits next to the key in the same place. StrictHostKeyChecking protects against the wrong SERVER, not a stolen key. The deploy user is in the docker group, which is effectively root.|||VI: Lệnh bị ép làm khoá chỉ chạy được script đó, restrict tắt shell, đường hầm và chuyển tiếp — đo được: một lần deploy OK, bốn lần từ chối, kể cả "administratively prohibited" cho -L. Mật khẩu vô dụng khi nó nằm cạnh khoá ở cùng một nơi. StrictHostKeyChecking chống MÁY CHỦ giả, không chống khoá bị lấy. Người dùng deploy nằm trong nhóm docker, tức gần như root.',
          },
          {
            question: 'Two workflows, <code>deploy-ghcr.yml</code> (concurrency group "ghcr") and <code>backend-vps.yml</code> (no concurrency), both trigger on push to main. What happens on one push?|||Hai workflow, <code>deploy-ghcr.yml</code> (nhóm concurrency "ghcr") và <code>backend-vps.yml</code> (không khai concurrency), cùng chạy khi push main. Một lần push thì sao?',
            options: [
              'GitHub queues the second workflow until the first finishes|||GitHub xếp workflow thứ hai chờ tới khi cái đầu xong',
              'The second workflow is cancelled because a run is in progress|||Workflow thứ hai bị huỷ vì đang có một lần chạy',
              'Both run in parallel against the same VPS; concurrency only coordinates runs in the same group|||Cả hai chạy song song vào cùng VPS; concurrency chỉ điều phối các lần chạy cùng nhóm',
              'GitHub refuses to run workflows with overlapping triggers|||GitHub từ chối chạy các workflow có trigger trùng nhau',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Concurrency is per group name; different groups (or none) run fully in parallel. That is how the project’s 03/07 and 06/07 incidents happened, and measured on the lab VPS two simultaneous compose up -d gave a Conflict error or the wrong version winning. "Queued" is the attractive answer — it is what people assume concurrency does globally. The fix is a flock on the VPS.|||VI: Concurrency tính theo tên nhóm; khác nhóm (hay không khai) thì chạy song song hoàn toàn. Đó là cách sự cố 03/07 và 06/07 của dự án xảy ra, và đo trên VPS thí nghiệm hai lệnh compose up -d cùng lúc cho lỗi Conflict hoặc bản sai thắng. "Xếp hàng" là phương án hấp dẫn — người ta tưởng concurrency làm vậy trên toàn cục. Cách chữa là flock trên VPS.',
          },
          {
            question: 'Behind nginx, <code>docker compose up -d --no-build --wait api</code> swaps to a new tag. The app needs 1.5 s to listen. What did the lab measure?|||Sau nginx, <code>docker compose up -d --no-build --wait api</code> tráo sang tag mới. App cần 1,5 s mới nghe cổng. Phòng thí nghiệm đo được gì?',
            options: [
              '0 dropped requests, because --wait waits for healthy before switching|||0 request rơi, vì --wait chờ khoẻ rồi mới chuyển',
              'Requests drop only if the healthcheck is missing|||Chỉ rơi request khi thiếu healthcheck',
              'A few timeouts but no 502s, since nginx retries|||Vài timeout nhưng không 502, vì nginx thử lại',
              '97 × 502 over ~2.5 s: the old container is stopped before the new one is ready; --wait only tells the script when it is healthy|||97 lần 502 trong ~2,5 s: container cũ bị dừng trước khi bản mới sẵn sàng; --wait chỉ cho script biết lúc khoẻ',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Compose stops, renames, then starts (docker events: kill → stop → die → rename → start). Plain up -d dropped 83–134, with --wait 97. "0 because --wait" is the trap: --wait begins waiting after the old container is already gone. Zero drops needed blue/green (940/940).|||VI: Compose dừng, đổi tên, rồi mới khởi động (docker events: kill → stop → die → rename → start). up -d trơn rơi 83–134, có --wait rơi 97. "0 vì --wait" là cái bẫy: --wait bắt đầu chờ khi container cũ đã biến mất. Muốn 0 thì cần xanh/lam (940/940).',
          },
          {
            question: 'Your healthcheck has <code>interval: 1s</code> and <code>start_period: 10s</code>, the app is ready after 1.5 s, yet <code>up -d --wait</code> takes ~6 s. Why?|||Healthcheck có <code>interval: 1s</code> và <code>start_period: 10s</code>, app sẵn sàng sau 1,5 s, vậy mà <code>up -d --wait</code> mất ~6 s. Vì sao?',
            options: [
              'During start_period Docker probes at start_interval, 5 s by default; set start_interval: 500ms|||Trong start_period Docker thăm dò theo start_interval, mặc định 5 s; đặt start_interval: 500ms',
              'start_period forces a fixed 10 s wait; lower it|||start_period ép chờ cố định 10 s; hạ nó xuống',
              'wget is slow inside Alpine; switch to curl|||wget chậm trong Alpine; đổi sang curl',
              'retries: 3 means three successes are required|||retries: 3 nghĩa là cần ba lần thành công',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The Dockerfile reference: --start-interval defaults to 5s and is used during the start period instead of interval. Measured 6.2/6.0 s without it and 2.7/2.6 s with 500ms. start_period is a grace period, not a fixed wait — a success during it marks the container healthy immediately; retries counts consecutive FAILURES.|||VI: Tài liệu Dockerfile: --start-interval mặc định 5s và được dùng trong giai đoạn khởi động thay cho interval. Đo: 6,2/6,0 s khi không đặt và 2,7/2,6 s với 500ms. start_period là thời gian ân hạn, không phải chờ cố định — thành công trong đó là khoẻ ngay; retries đếm số lần HỎNG liên tiếp.',
          },
          {
            question: 'A backend container was re-created and received a new IP. nginx uses <code>proxy_pass http://api:3000;</code>. Users get 502 and the error log shows <code>upstream: "http://172.18.0.3:3000/…"</code>, the old IP. Best immediate fix?|||Container backend được tạo lại và nhận IP mới. nginx dùng <code>proxy_pass http://api:3000;</code>. Người dùng gặp 502 và error log ghi <code>upstream: "http://172.18.0.3:3000/…"</code>, IP cũ. Cách chữa ngay tốt nhất?',
            options: [
              'Restart the backend container again so it gets the old IP back|||Khởi động lại container backend lần nữa để lấy lại IP cũ',
              'Add proxy_next_upstream error to retry|||Thêm proxy_next_upstream error để thử lại',
              'nginx -t then nginx -s reload, so nginx resolves "api" again (long term: resolver 127.0.0.11 + a variable, or reload in every swap)|||nginx -t rồi nginx -s reload để nginx phân giải lại "api" (lâu dài: resolver 127.0.0.11 + biến, hoặc reload trong mỗi lần tráo)',
              'Publish the backend port on the host and proxy to 127.0.0.1|||Xuất cổng backend ra máy chủ và proxy tới 127.0.0.1',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: nginx resolved "api" once at start and keeps the IP; measured 502 502 502 until reload, then 200, and with resolver + variable 200 throughout without reload. Retrying with proxy_next_upstream is tempting but retries the same stale address. Restarting the backend does not guarantee the old IP — in the lab another container had taken it.|||VI: nginx phân giải "api" một lần lúc khởi động và giữ IP; đo được 502 502 502 tới khi reload thì 200, còn với resolver + biến thì 200 suốt mà không cần reload. Thử lại bằng proxy_next_upstream nghe hợp lý nhưng vẫn gõ đúng địa chỉ cũ. Khởi động lại backend không bảo đảm lấy lại IP cũ — trong phòng thí nghiệm một container khác đã chiếm nó.',
          },
        ],
      },
    },
  ],
};
