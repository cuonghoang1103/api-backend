/**
 * Docker — Chương 13 (MỚI, 09/2026): Docker trong vòng lặp phát triển hằng ngày.
 * Dev Containers · sửa mã thấy ngay + debugger · CSDL thật cho test · Docker trên Mac & Windows · quiz.
 * LUẬT: backtick → &#96;; ${ → &#36;{; < > & trong code → &lt; &gt; &amp;. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi, xem scripts/course-content-check.mjs.
 *
 * Output CHẠY THẬT 24/09/2026 trên Docker Desktop 4.91 / Engine 29.8.0 (Mac M1, arm64, Compose v5.5.1,
 * Node 22, @devcontainers/cli 0.89.0, testcontainers 12.1.0) và Docker Engine 29.6.2 (Fedora 44, amd64).
 * Tên đối tượng trong output mang tiền tố dk13- (luật an toàn của khoá). Deck: scripts/slides-src/dk-13.mjs (29 slide).
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 13 — Docker in your daily dev loop|||Chương 13 — Docker trong vòng lặp phát triển hằng ngày',
  description: 'Docker không chỉ để deploy. Chương này đưa nó vào vòng lặp sửa → chạy → test hằng ngày: Dev Containers cho cả nhóm một môi trường, sửa mã thấy ngay và gắn debugger vào container, Postgres thật dùng-một-lần cho test tích hợp, và sự thật về Docker trên Mac và Windows — một máy ảo Linux với những cái giá riêng của nó.',
  lessons: [
    /* ─────────────────────────── 13.0 ─────────────────────────── */
    {
      title: '13.0 — Chapter 13 slides: Docker in your daily dev loop|||13.0 — Slide Chương 13: Docker trong vòng lặp phát triển',
      slug: 'dk-13-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 29 slide của Chương 13: dev container và devcontainer.json, bind mount vs compose watch và bẫy node_modules, debugger qua cổng 9229, Postgres dùng-một-lần với tmpfs và Testcontainers, Docker trên Mac/Windows là một máy ảo — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Slides</span>
<h2>The whole chapter in 29 slides</h2>
<p class="lead">Until now the course used Docker to ship and run things. This chapter turns it towards the other 90% of your day: editing code, seeing the change, debugging it and testing it against a real database. The slides carry the measurements — how many milliseconds from pressing Save to seeing the new text, how many transactions per second a throwaway Postgres manages on tmpfs, how much slower a bind mount is on a Mac — so skim them first to know which numbers to look for.</p>
<p>Slides 3–8 belong to Lesson 13.1 (Dev Containers), 9–14 to 13.2 (hot reload and debugging), 15–20 to 13.3 (real databases for tests) and 21–26 to 13.4 (Docker on Mac and Windows). The last three are the chapter's common mistakes, a cheat sheet and a 45-minute practice session. Every terminal is real output recorded on 24 September 2026 on Docker Desktop 4.91 (Mac M1) and Docker Engine 29.6 (Linux). The slides are in Vietnamese; the diagrams and numbers read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Slide</span>
<h2>Cả chương trong 29 slide</h2>
<p class="lead">Tới giờ khoá học dùng Docker để đóng gói và chạy thứ đã xong. Chương này quay nó về phía 90% còn lại của một ngày làm việc: sửa mã, nhìn thấy thay đổi, gỡ lỗi và kiểm thử trên một cơ sở dữ liệu thật. Bộ slide mang theo các con số đo thật — bao nhiêu mili giây từ lúc bấm Lưu tới lúc thấy chữ mới, một Postgres dùng-một-lần trên tmpfs chạy được bao nhiêu giao dịch mỗi giây, bind mount trên Mac chậm hơn bao nhiêu lần — nên hãy lướt nó trước để biết cần để ý con số nào.</p>
<p>Slide 3–8 thuộc Bài 13.1 (Dev Containers), 9–14 thuộc 13.2 (sửa mã thấy ngay và gỡ lỗi), 15–20 thuộc 13.3 (CSDL thật cho test) và 21–26 thuộc 13.4 (Docker trên Mac và Windows). Ba slide cuối là những sai lầm hay gặp, bảng tra nhanh và một buổi thực hành 45 phút. Mọi terminal là output THẬT ghi ngày 24/09/2026 trên Docker Desktop 4.91 (Mac M1) và Docker Engine 29.6 (Linux) — con số trên máy bạn sẽ khác, quy luật thì không.</p>
</div>
${gallery('dk-13', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Dev Container: mã ở máy bạn, công cụ ở trong container'], [4, 'devcontainer.json từng dòng'], [5, 'Chạy thật bằng @devcontainers/cli'],
  [6, 'image, Dockerfile, compose hay features'], [7, 'postCreateCommand chạy trước khi Postgres sẵn sàng'], [8, 'Khi nào đáng dùng, và Codespaces'],
  [9, 'Hai đường đưa mã mới vào container'], [10, 'Bẫy node_modules bị bind mount che'], [11, 'node_modules của Mac không chạy trong Linux'],
  [12, 'compose watch: sync, sync+restart, rebuild'], [13, 'Đo thật: từ lúc Lưu tới lúc thấy chữ mới'], [14, 'Debugger: 0.0.0.0 bên trong, 127.0.0.1 bên ngoài'],
  [15, 'Postgres thật dùng một lần cho test'], [16, 'Postgres khởi động hai lần'], [17, 'tmpfs: nhanh 15× trên Linux'],
  [18, 'compose.test.yaml + node --test'], [19, 'Testcontainers'], [20, 'Service container trong CI'],
  [21, 'Docker trên Mac/Windows là một máy ảo'], [22, 'Bind mount qua VirtioFS chậm với file nhỏ'], [23, 'WSL2: mã trong hệ file Linux'],
  [24, 'host.docker.internal'], [25, 'arm64, amd64 và Rosetta'], [26, 'Docker Desktop, OrbStack hay Colima'],
  [27, 'Sai lầm hay gặp'], [28, 'Bảng tra nhanh'], [29, 'Thực hành chương 13'],
])}
`,
    },
    /* ─────────────────────────── 13.1 ─────────────────────────── */
    {
      title: '13.1 — Dev Containers: one environment for the whole team|||13.1 — Dev Containers: cả nhóm một môi trường',
      slug: 'dk-13-1-dev-containers',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Đưa môi trường phát triển vào một file devcontainer.json trong repo: image, Dockerfile hay compose, features, postCreateCommand, forwardPorts — dựng thật bằng @devcontainers/cli, bẫy postCreate chạy trước khi Postgres sẵn sàng, và khi nào không đáng dùng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.1</span>
<h2>Dev Containers: one environment for the whole team</h2>
<p class="lead">Your SWP391 team has five laptops: two Macs with Apple chips, two Windows machines and one old Intel MacBook. On the first day each person installs Node, then PostgreSQL, then the Prisma CLI, and by Friday there are three Node versions, two npm lockfile formats and one teammate whose <code>psql</code> is version 12. Docker already solved this for the <em>running</em> app. A dev container solves it for the <em>editing</em> environment: the tools you type into all day live inside a container, and the recipe for that container is a file committed to the repository.</p>
<p>This lesson builds that file line by line, starts it for real with the official command-line tool (no VS Code needed, so every output here is reproducible), and hits the one trap that catches almost every team that adds a database to it.</p>

<h3>The idea: your code stays on your machine, your tools move into a container</h3>
${slide('dk-13', 3, 'Dev Container: mã ở máy bạn, công cụ ở trong container')}
<p>Three things happen when VS Code opens a folder "in a container". It reads <code>.devcontainer/devcontainer.json</code> and creates a container from the image (or Dockerfile, or compose file) it names. It bind-mounts your project folder into that container, by default at <code>/workspaces/&lt;folder-name&gt;</code> — so the files are still the real files on your disk, and <code>git</code> on your machine still sees every change. And it installs a small server inside the container and connects the VS Code window to it: the window is only a screen and a keyboard, while the terminal, the language server, ESLint and the debugger all run <strong>inside</strong>.</p>
<p>The payoff is that "which Node do you have?" stops being a question. Everyone runs the Node that is in the image. A new teammate clones the repo, opens it, clicks <em>Reopen in Container</em>, and ten minutes later runs the same <code>npm test</code> as everyone else. The recipe is versioned with the code, so checking out last month's commit also checks out last month's toolchain.</p>
<div class="callout warn"><strong>It is not a VM and not a deployment image.</strong> A dev container is an ordinary container (Chapter 1), usually fatter than your production image because it carries compilers, git, a shell and debuggers. Keep the two separate: the production image comes from your multi-stage Dockerfile (Chapter 6); the dev container is for typing in.</div>

<h3>devcontainer.json, line by line</h3>
${slide('dk-13', 4, 'devcontainer.json: vài dòng là cả nhóm chung một môi trường')}
<p>The smallest useful file names an image and nothing else. This is the one used for the measurements in this lesson, plus two lines — a name for our safety rule and a label — that you would not normally need:</p>
<pre><code class="language-json">{
  "name": "swp391-api",
  "image": "node:22-bookworm-slim",
  "runArgs": ["--name", "dk13-devc", "--label", "dkhoc=13"],
  "forwardPorts": [3000],
  "postCreateCommand": "node -v &amp;&amp; npm -v &amp;&amp; echo 'postCreate xong' &gt; /tmp/pc.txt",
  "customizations": { "vscode": { "extensions": ["dbaeumer.vscode-eslint"] } }
}</code></pre>
<table>
<tr><th>Property</th><th>What it does</th><th>Beginner note</th></tr>
<tr><td><code>name</code></td><td>Label shown in VS Code's status bar</td><td>Cosmetic</td></tr>
<tr><td><code>image</code></td><td>The environment is this image</td><td>Pick a <em>Debian-based</em> tag (<code>-bookworm</code>, <code>-slim</code>) rather than Alpine: VS Code Server and many extensions expect glibc</td></tr>
<tr><td><code>build.dockerfile</code></td><td>Build the environment from a Dockerfile instead</td><td>Path is relative to <code>devcontainer.json</code></td></tr>
<tr><td><code>dockerComposeFile</code> + <code>service</code></td><td>Start a compose project; attach to one service</td><td>For apps that need Postgres/Redis alongside</td></tr>
<tr><td><code>features</code></td><td>Layer ready-made tool installers on top (git, GitHub CLI, docker-in-docker…)</td><td>Each one triggers an image build — see the cost below</td></tr>
<tr><td><code>forwardPorts</code></td><td>The <em>tool</em> (VS Code) forwards these container ports to your <code>localhost</code></td><td>Not a Docker <code>-p</code>: the CLI ignores it</td></tr>
<tr><td><code>postCreateCommand</code></td><td>Runs once, inside the container, right after it is created</td><td>Typical: <code>npm ci</code>, <code>npx prisma generate</code></td></tr>
<tr><td><code>runArgs</code></td><td>Extra <code>docker run</code> flags</td><td>Escape hatch: <code>--name</code>, <code>-p</code>, <code>--memory</code></td></tr>
<tr><td><code>customizations.vscode.extensions</code></td><td>Extensions installed <em>inside</em> the container</td><td>Everyone gets the same ESLint and Prettier</td></tr>
</table>
<p>The lifecycle commands run in a fixed order, and knowing it saves a lot of confusion: <code>initializeCommand</code> (on your <em>host</em>, before anything) → <code>onCreateCommand</code> → <code>updateContentCommand</code> → <code>postCreateCommand</code> (these three once, when the container is created) → <code>postStartCommand</code> (every time the container starts) → <code>postAttachCommand</code> (every time a tool attaches). Put installation in <code>postCreateCommand</code>; put "start the dev server" in <code>postStartCommand</code> if you want it at all.</p>

<h3>Run it step by step with the official CLI</h3>
${slide('dk-13', 5, 'Chạy thật bằng CLI: 2,4 s lần đầu, 0,95 s lần sau')}
<p>VS Code's button is a wrapper around an open-source reference tool, <code>@devcontainers/cli</code>. Running that tool directly shows exactly what the button does, works in CI, and needs nothing but Node:</p>
<div class="lz-flow">
<div class="lz-step"><strong>1.</strong> <code>mkdir -p ~/thu-docker/devc/.devcontainer &amp;&amp; cd ~/thu-docker/devc</code> — a tiny project.</div>
<div class="lz-step"><strong>2.</strong> Save the JSON above as <code>.devcontainer/devcontainer.json</code> and one line of code as <code>index.js</code>.</div>
<div class="lz-step"><strong>3.</strong> <code>npx @devcontainers/cli up --workspace-folder .</code> — create and start the container.</div>
<div class="lz-step"><strong>4.</strong> <code>npx @devcontainers/cli exec --workspace-folder . &lt;command&gt;</code> — run things inside it.</div>
</div>
<pre><code class="language-bash">echo 'console.log("hello from", process.cwd())' &gt; index.js
npx @devcontainers/cli up --workspace-folder .</code></pre>
<div class="out">[2026-09-24T00:18:20.357Z] @devcontainers/cli 0.89.0. Node.js v22.21.0. darwin 27.0.0 arm64.
[2026-09-24T00:18:20.957Z] Start: Run: docker run --sig-proxy=false -a STDOUT -a STDERR --mount type=bind,source=…/devc,target=/workspaces/devc,consistency=cached -l devcontainer.local_folder=…/devc -l devcontainer.config_file=…/devc/.devcontainer/devcontainer.json --name dk13-devc --label dkhoc=13 --entrypoint /bin/sh … node:22-bookworm-slim -c echo Container started
[2026-09-24T00:18:21.147Z] Container started
[2026-09-24T00:18:21.310Z] Running the postCreateCommand from devcontainer.json...
[2026-09-24T00:18:21.459Z] v22.23.2
[2026-09-24T00:18:21.589Z] 10.9.8
{"outcome":"success","containerId":"690b31b6a88c…","remoteUser":"root","remoteWorkspaceFolder":"/workspaces/devc",…}
real 2.43</div>
<p>Read the long <code>docker run</code> line slowly — it is the whole mechanism. <code>--mount type=bind,source=…/devc,target=/workspaces/devc</code> is the bind mount of your folder. The two <code>-l devcontainer.…</code> labels are how the tool finds this container again next time (it looks it up by label, not by name). <code>--entrypoint /bin/sh … -c echo Container started</code> replaces the image's own command with a shell that just stays alive. Then <code>postCreateCommand</code> ran and printed the Node and npm versions <em>of the image</em> — 22.23.2, not the 22.21.0 on the Mac.</p>
<pre><code class="language-bash">npx @devcontainers/cli exec --workspace-folder . sh -c 'pwd; ls; cat /tmp/pc.txt; node index.js'
docker ps --filter name=dk13-devc --format '{{.Names}}\\t{{.Image}}\\t{{.Status}}\\t{{.Ports}}'</code></pre>
<div class="out">/workspaces/devc
index.js
postCreate xong
hello from /workspaces/devc
dk13-devc	node:22-bookworm-slim	Up 8 seconds	</div>
<p>Two facts hide in that output. The file you wrote on the Mac is there, because of the bind mount. And the <code>Ports</code> column is <strong>empty</strong> even though the file says <code>"forwardPorts": [3000]</code>: forwarding is something VS Code does through its own connection, not a Docker port mapping. If you use the CLI (or another editor) and need the port, add <code>"appPort": [3000]</code> or <code>"runArgs": ["-p", "3000:3000"]</code>. Running <code>up</code> a second time took 0.95 s: the container already existed, so the tool found it by label and reused it.</p>

<h3>Four ways to describe the environment</h3>
${slide('dk-13', 6, 'Ba cách khai môi trường: image, Dockerfile, compose')}
<p>An image is the fastest start, but sooner or later the project needs something the image lacks. There are three ways up the ladder:</p>
<ul>
<li><strong>Dockerfile</strong> — <code>"build": { "dockerfile": "Dockerfile" }</code>. You write <code>FROM node:22-bookworm-slim</code> plus <code>RUN apt-get install -y openssl postgresql-client</code>. Everything you learned in Chapters 4–6 applies; the first open builds the image, later opens reuse the cache.</li>
<li><strong>features</strong> — packaged installers published as OCI artifacts (e.g. <code>ghcr.io/devcontainers/features/common-utils:2</code>). You list them; the tool generates a Dockerfile behind your back and builds it.</li>
<li><strong>compose</strong> — <code>"dockerComposeFile": "compose.yaml"</code> and <code>"service": "app"</code>. The tool runs <code>docker compose up</code> and attaches to one service. This is the realistic shape for a web app with a database.</li>
</ul>
<p>Features are convenient, but it is worth seeing their price once. Adding the single <code>common-utils</code> feature to the same file:</p>
<pre><code class="language-bash">npx @devcontainers/cli up --workspace-folder .      <span class="tok-comment"># with "features": { "ghcr.io/devcontainers/features/common-utils:2": {…} }</span>
docker images | grep -E 'vsc-devc2|bookworm-slim'</code></pre>
<div class="out">#13 [dev_containers_target_stage 5/5] RUN --mount=type=bind,from=dev_containers_feature_content_source,source=common-utils_0,…
…
#14 naming to docker.io/library/vsc-devc2-914dfa02dce5…-features:latest done
real 56.48
node:22-bookworm-slim                                          83f487e0a634        349MB         82.6MB   U
vsc-devc2-914dfa02dce51fc6f09fcf0df61b12109d4b951aae53c964ab7e3663e9c0d57d-features:latest   9810256e6487        641MB          153MB   U</div>
<p>56 seconds the first time (it ran <code>apt-get</code> for 70-odd packages), 4.9 seconds on the next start with a warm cache, and an image that grew from 349 MB to 641 MB on disk. Note the generated name <code>vsc-&lt;folder&gt;-&lt;hash&gt;-features</code>: those images pile up, one per project, and <code>docker images</code> is where you find and delete them. Rule of thumb: start with <code>image</code>, move to a Dockerfile when you need system packages, add compose when the app needs services.</p>

<h3>The compose version, and the trap everyone hits</h3>
${slide('dk-13', 7, 'postCreateCommand chạy TRƯỚC khi Postgres sẵn sàng')}
<p>Here is a realistic two-service setup: an <code>app</code> container you work in, and a Postgres that lives only as long as the dev session (<code>tmpfs</code>, Lesson 13.3). The <code>postCreateCommand</code> checks that the database is reachable — a stand-in for the <code>npx prisma migrate dev</code> a real project would run there.</p>
<pre><code class="language-yaml"><span class="tok-comment"># .devcontainer/compose.yaml — first attempt</span>
name: swp391-dev
services:
  app:
    image: node:22-bookworm-slim
    command: sleep infinity
    volumes:
      - ..:/workspaces/app:cached
    environment:
      DATABASE_URL: postgres://postgres:dev@db:5432/app
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: app
    tmpfs: [/var/lib/postgresql/data]</code></pre>
<pre><code class="language-json">{
  "name": "swp391-api + db",
  "dockerComposeFile": "compose.yaml",
  "service": "app",
  "workspaceFolder": "/workspaces/app",
  "shutdownAction": "stopCompose",
  "postCreateCommand": "node -e \\"require('net').connect(5432,'db').on('connect',()=&gt;{console.log('db:5432 mở');process.exit(0)}).on('error',e=&gt;{console.log(e.code);process.exit(1)})\\""
}</code></pre>
<div class="out">[2026-09-24T00:20:20.596Z] Running the postCreateCommand from devcontainer.json...
[2026-09-24T00:20:20.724Z] ECONNREFUSED
[2026-09-24T00:20:20.734Z] postCreateCommand from devcontainer.json failed with exit code 1. Skipping any further user-provided commands.</div>
<p>Both containers were <code>Up</code>. The command still failed, because "container started" is not "Postgres accepts connections" — Postgres was still running <code>initdb</code>. <code>command: sleep infinity</code> is needed because a dev container's main process must stay alive while you work; the <code>..</code> in <code>volumes</code> is relative to the compose file, i.e. the project root. The fix is the one Chapter 9 taught for any app: a healthcheck on the database and <code>depends_on: condition: service_healthy</code> on the app.</p>
<pre><code class="language-yaml">  app:
    …
    depends_on:
      db: { condition: service_healthy }
  db:
    …
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]
      interval: 1s
      retries: 30</code></pre>
<div class="out">[2026-09-24T00:20:37.365Z] Running the postCreateCommand from devcontainer.json...
[2026-09-24T00:20:37.485Z] db:5432 mở
real 3.84</div>
<div class="pitfall co-tieu-de"><strong>"It works on my machine" moves into the devcontainer.</strong> On a fast Mac the race above can go your way by luck, so the author never sees it; on a teammate's slower Windows laptop the database needs two more seconds and <code>postCreateCommand</code> fails every time — and because the tool then <em>skips every later command</em>, <code>npm ci</code> never runs either and the teammate sees a sea of red imports. Any lifecycle command that touches another service needs a healthcheck gate. Lesson 13.3 shows why <code>pg_isready</code> should also get <code>-h 127.0.0.1</code>.</div>

<h3>When it is worth it — and when it is not</h3>
${slide('dk-13', 8, 'Dev Container đáng dùng khi nào — và khi nào KHÔNG')}
<table>
<tr><th>Situation</th><th>Dev container?</th><th>Why</th></tr>
<tr><td>Team project, mixed Mac/Windows laptops</td><td>Yes</td><td>One toolchain, versioned in git; onboarding in minutes</td></tr>
<tr><td>Needs tools that are painful on Windows (make, openssl, psql, native builds)</td><td>Yes</td><td>They install in Linux the normal way</td></tr>
<tr><td>A one-file exercise for class</td><td>No</td><td>The container costs more time than it saves</td></tr>
<tr><td>8 GB laptop already struggling</td><td>Think twice</td><td>Docker's VM and VS Code Server compete for the same RAM (Lesson 13.4)</td></tr>
<tr><td>Mobile, desktop GUI or GPU work</td><td>Usually no</td><td>Simulators, displays and GPUs do not live comfortably in a container on a Mac</td></tr>
</table>
<p><strong>GitHub Codespaces</strong> reads the very same <code>.devcontainer/</code> folder but runs the container on GitHub's machines, so you need only a browser. Personal accounts get a free monthly allowance measured in core-hours — 120 on GitHub Free and 180 on Pro, plus 15 and 20 GB-months of storage (as of 09/2026); a 2-core machine uses two core-hours per hour. That is enough for a demo day or a lab on a school computer, not for daily full-time use. The nice part is that you do not choose: a correct devcontainer folder serves both.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your SWP391 teammate on Windows says "npm install fails on my machine, it works for you". Give the team one environment they can all start with a single command.</p><ol>
<li>In <code>~/thu-docker/devc</code> create <code>.devcontainer/devcontainer.json</code> with <code>"image": "node:22-bookworm-slim"</code>, a <code>postCreateCommand</code> that prints <code>node -v</code>, and <code>"runArgs": ["--name", "thu-devc"]</code>.</li>
<li>Run <code>npx @devcontainers/cli up --workspace-folder .</code>. In the log, find the <code>--mount type=bind</code> part and write down its <code>target</code>.</li>
<li>Run <code>npx @devcontainers/cli exec --workspace-folder . node -v</code> and compare it with <code>node -v</code> on your own machine.</li>
<li>Add <code>"forwardPorts": [3000]</code>, recreate (<code>docker rm -f thu-devc</code>, then <code>up</code> again) and check the <code>Ports</code> column of <code>docker ps</code>. Then replace it with <code>"appPort": [3000]</code> and check again.</li>
<li>Clean up: <code>docker rm -f thu-devc</code>.</li></ol>
<p><strong>Done when:</strong> you can name the folder your code appears in inside the container, show two different Node versions (host vs container), and explain why <code>forwardPorts</code> left the Ports column empty while <code>appPort</code> filled it.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dev container</span><span class="v">A container you develop <em>inside</em>: your tools run in it, your code is bind-mounted into it.</span></div>
  <div class="kv"><span class="k">devcontainer.json</span><span class="v">The recipe file in <code>.devcontainer/</code>, committed to git, read by VS Code, Codespaces and the CLI.</span></div>
  <div class="kv"><span class="k">Feature</span><span class="v">A packaged installer (git, gh, docker-in-docker…) layered on your image; costs a build.</span></div>
  <div class="kv"><span class="k">Lifecycle command</span><span class="v"><code>onCreate</code> → <code>updateContent</code> → <code>postCreate</code> (once) → <code>postStart</code> (every start) → <code>postAttach</code>.</span></div>
  <div class="kv"><span class="k">forwardPorts vs appPort</span><span class="v">Forwarding is done by the editor; publishing (<code>appPort</code>, <code>-p</code>) is done by Docker.</span></div>
  <div class="kv"><span class="k">Codespaces</span><span class="v">GitHub-hosted dev containers built from the same folder; billed in core-hours.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A dev container moves the <em>tools</em> into a container and keeps the <em>code</em> on your disk through a bind mount at <code>/workspaces/&lt;folder&gt;</code>.</li>
<li>The recipe is <code>.devcontainer/devcontainer.json</code>, committed with the code, so every commit carries its toolchain.</li>
<li><code>@devcontainers/cli up</code> does what VS Code's button does: 2.4 s on first start with a local image, under a second on reuse.</li>
<li>Climb from <code>image</code> to Dockerfile to compose only when needed; features are convenient but cost a build and hundreds of MB.</li>
<li>Any lifecycle command that talks to a database needs a healthcheck plus <code>service_healthy</code>, or it fails on slower machines.</li>
<li><code>forwardPorts</code> is an editor feature; for plain Docker publishing use <code>appPort</code> or <code>runArgs</code>.</li>
</ul>

<a class="link-card" href="https://containers.dev/implementors/json_reference/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">devcontainer.json reference</span><span class="lc-sub">Every property, the lifecycle order and the forwarding-vs-publishing distinction, from the open specification itself.</span></span>
</a>
<a class="link-card" href="https://code.visualstudio.com/docs/devcontainers/containers" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Developing inside a Container — VS Code</span><span class="lc-sub">How the extension connects, Reopen/Rebuild Container, and the Windows/WSL notes.</span></span>
</a>
<a class="link-card" href="https://github.com/devcontainers/cli" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">devcontainers/cli</span><span class="lc-sub">The reference command-line tool used in this lesson: <code>up</code>, <code>exec</code>, <code>build</code> — handy in CI too.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/billing/concepts/product-billing/github-codespaces" target="_blank" rel="noopener">
  <span class="lc-ico">☁️</span>
  <span class="lc-body"><span class="lc-title">GitHub Codespaces billing</span><span class="lc-sub">The current free core-hours and storage for personal accounts — check it before relying on it for a demo.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practise in Code Lab: Docker</span><span class="lc-sub">Graded Docker exercises to keep your hands on the commands.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> The code stays on your disk and the toolchain moves into a container whose recipe is committed next to the code. The CLI shows you exactly what the editor does — a bind mount, two labels and a shell that stays alive. And "container started" is never "database ready": gate lifecycle commands with a healthcheck.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.1</span>
<h2>Dev Containers: cả nhóm một môi trường</h2>
<p class="lead">Nhóm SWP391 của bạn có năm cái laptop: hai Mac chip Apple, hai máy Windows và một MacBook Intel đời cũ. Ngày đầu tiên mỗi người tự cài Node, rồi PostgreSQL, rồi Prisma CLI, và tới thứ Sáu thì cả nhóm có ba phiên bản Node, hai định dạng file khoá của npm và một bạn có <code>psql</code> bản 12. Docker đã giải bài toán này cho cái app <em>đang chạy</em>. Dev container (container phát triển) giải nó cho cái môi trường <em>bạn gõ mã</em>: mọi công cụ bạn dùng cả ngày nằm bên trong một container, và công thức của container đó là một file được commit vào repo.</p>
<p>Bài này dựng file đó từng dòng, khởi động nó thật bằng công cụ dòng lệnh chính thức (không cần VS Code, nên mọi output ở đây bạn làm lại được), và đâm đúng vào cái bẫy mà gần như nhóm nào gắn thêm cơ sở dữ liệu vào cũng dính.</p>

<h3>Ý tưởng: mã ở lại máy bạn, công cụ dọn vào container</h3>
${slide('dk-13', 3, 'Dev Container: mã ở máy bạn, công cụ ở trong container')}
<p>Có ba việc xảy ra khi VS Code mở một thư mục "trong container". Nó đọc <code>.devcontainer/devcontainer.json</code> và tạo một container từ image (hoặc Dockerfile, hoặc file compose) mà file đó chỉ định. Nó bind mount (gắn thư mục máy chủ) thư mục dự án của bạn vào container, mặc định ở <code>/workspaces/&lt;tên-thư-mục&gt;</code> — nên file vẫn là file thật trên ổ đĩa của bạn, và <code>git</code> trên máy bạn vẫn thấy mọi thay đổi. Và nó cài một server nhỏ bên trong container rồi nối cửa sổ VS Code vào đó: cửa sổ chỉ còn là màn hình và bàn phím, còn terminal, language server (máy chủ hiểu ngôn ngữ), ESLint và debugger (trình gỡ lỗi) đều chạy <strong>bên trong</strong>.</p>
<p>Cái lợi là câu hỏi "máy bạn Node bản mấy?" biến mất. Ai cũng chạy đúng cái Node nằm trong image. Một bạn mới vào nhóm clone repo, mở ra, bấm <em>Reopen in Container</em>, và mười phút sau chạy đúng lệnh <code>npm test</code> như mọi người. Công thức được quản lý phiên bản cùng với mã, nên checkout một commit tháng trước thì cũng lấy lại luôn bộ công cụ của tháng trước.</p>
<div class="callout warn"><strong>Nó không phải máy ảo, cũng không phải image để deploy.</strong> Dev container là một container bình thường (Chương 1), thường béo hơn image production vì mang theo trình biên dịch, git, shell và debugger. Hãy tách hai thứ: image production đến từ Dockerfile nhiều giai đoạn (Chương 6); dev container là chỗ để gõ mã.</div>

<h3>devcontainer.json, từng dòng</h3>
${slide('dk-13', 4, 'devcontainer.json: vài dòng là cả nhóm chung một môi trường')}
<p>File nhỏ nhất mà dùng được chỉ cần nêu một image. Đây là đúng file đã dùng để đo trong bài, cộng thêm hai dòng — tên và nhãn cho luật an toàn của khoá — mà bình thường bạn không cần:</p>
<pre><code class="language-json">{
  "name": "swp391-api",
  "image": "node:22-bookworm-slim",
  "runArgs": ["--name", "dk13-devc", "--label", "dkhoc=13"],
  "forwardPorts": [3000],
  "postCreateCommand": "node -v &amp;&amp; npm -v &amp;&amp; echo 'postCreate xong' &gt; /tmp/pc.txt",
  "customizations": { "vscode": { "extensions": ["dbaeumer.vscode-eslint"] } }
}</code></pre>
<table>
<tr><th>Thuộc tính</th><th>Làm gì</th><th>Ghi chú cho người mới</th></tr>
<tr><td><code>name</code></td><td>Tên hiện ở thanh trạng thái VS Code</td><td>Chỉ để nhìn</td></tr>
<tr><td><code>image</code></td><td>Môi trường chính là image này</td><td>Chọn tag <em>gốc Debian</em> (<code>-bookworm</code>, <code>-slim</code>) thay vì Alpine: VS Code Server và nhiều extension cần glibc</td></tr>
<tr><td><code>build.dockerfile</code></td><td>Dựng môi trường từ một Dockerfile</td><td>Đường dẫn tính từ chỗ đặt <code>devcontainer.json</code></td></tr>
<tr><td><code>dockerComposeFile</code> + <code>service</code></td><td>Bật một dự án compose; gắn vào một service</td><td>Cho app cần Postgres/Redis đi kèm</td></tr>
<tr><td><code>features</code></td><td>Ghép thêm bộ cài công cụ làm sẵn (git, GitHub CLI, docker-in-docker…)</td><td>Mỗi cái kéo theo một lần build image — xem cái giá bên dưới</td></tr>
<tr><td><code>forwardPorts</code></td><td><em>Công cụ</em> (VS Code) chuyển các cổng này của container ra <code>localhost</code> của bạn</td><td>Không phải <code>-p</code> của Docker: CLI bỏ qua nó</td></tr>
<tr><td><code>postCreateCommand</code></td><td>Chạy MỘT lần, bên trong container, ngay sau khi tạo</td><td>Thường là <code>npm ci</code>, <code>npx prisma generate</code></td></tr>
<tr><td><code>runArgs</code></td><td>Cờ bổ sung cho <code>docker run</code></td><td>Lối thoát hiểm: <code>--name</code>, <code>-p</code>, <code>--memory</code></td></tr>
<tr><td><code>customizations.vscode.extensions</code></td><td>Extension được cài <em>bên trong</em> container</td><td>Cả nhóm cùng một ESLint, một Prettier</td></tr>
</table>
<p>Các lệnh vòng đời (lifecycle command) chạy theo một thứ tự cố định, biết nó đỡ rất nhiều bối rối: <code>initializeCommand</code> (trên <em>máy bạn</em>, trước mọi thứ) → <code>onCreateCommand</code> → <code>updateContentCommand</code> → <code>postCreateCommand</code> (ba cái này chạy một lần khi container được tạo) → <code>postStartCommand</code> (mỗi lần container khởi động) → <code>postAttachCommand</code> (mỗi lần công cụ gắn vào). Việc cài đặt đặt ở <code>postCreateCommand</code>; còn "bật dev server" thì đặt ở <code>postStartCommand</code> nếu bạn thật sự muốn.</p>

<h3>Chạy thử từng bước bằng CLI chính thức</h3>
${slide('dk-13', 5, 'Chạy thật bằng CLI: 2,4 s lần đầu, 0,95 s lần sau')}
<p>Cái nút của VS Code thật ra bọc quanh một công cụ tham chiếu mã nguồn mở, <code>@devcontainers/cli</code>. Chạy thẳng công cụ đó cho bạn thấy chính xác cái nút làm gì, chạy được trong CI, và chỉ cần có Node:</p>
<div class="lz-flow">
<div class="lz-step"><strong>1.</strong> <code>mkdir -p ~/thu-docker/devc/.devcontainer &amp;&amp; cd ~/thu-docker/devc</code> — một dự án tí hon.</div>
<div class="lz-step"><strong>2.</strong> Lưu đoạn JSON ở trên thành <code>.devcontainer/devcontainer.json</code> và một dòng mã thành <code>index.js</code>.</div>
<div class="lz-step"><strong>3.</strong> <code>npx @devcontainers/cli up --workspace-folder .</code> — tạo và khởi động container.</div>
<div class="lz-step"><strong>4.</strong> <code>npx @devcontainers/cli exec --workspace-folder . &lt;lệnh&gt;</code> — chạy lệnh bên trong nó.</div>
</div>
<pre><code class="language-bash">echo 'console.log("hello from", process.cwd())' &gt; index.js
npx @devcontainers/cli up --workspace-folder .</code></pre>
<div class="out">[2026-09-24T00:18:20.357Z] @devcontainers/cli 0.89.0. Node.js v22.21.0. darwin 27.0.0 arm64.
[2026-09-24T00:18:20.957Z] Start: Run: docker run --sig-proxy=false -a STDOUT -a STDERR --mount type=bind,source=…/devc,target=/workspaces/devc,consistency=cached -l devcontainer.local_folder=…/devc -l devcontainer.config_file=…/devc/.devcontainer/devcontainer.json --name dk13-devc --label dkhoc=13 --entrypoint /bin/sh … node:22-bookworm-slim -c echo Container started
[2026-09-24T00:18:21.147Z] Container started
[2026-09-24T00:18:21.310Z] Running the postCreateCommand from devcontainer.json...
[2026-09-24T00:18:21.459Z] v22.23.2
[2026-09-24T00:18:21.589Z] 10.9.8
{"outcome":"success","containerId":"690b31b6a88c…","remoteUser":"root","remoteWorkspaceFolder":"/workspaces/devc",…}
real 2.43</div>
<p>Đọc chậm cái dòng <code>docker run</code> dài kia — nó là toàn bộ cơ chế. <code>--mount type=bind,source=…/devc,target=/workspaces/devc</code> là bind mount thư mục của bạn. Hai nhãn <code>-l devcontainer.…</code> là cách công cụ tìm lại container này ở lần sau (nó tìm theo nhãn, không theo tên). <code>--entrypoint /bin/sh … -c echo Container started</code> thay lệnh gốc của image bằng một shell chỉ việc sống. Sau đó <code>postCreateCommand</code> chạy và in phiên bản Node, npm <em>của image</em> — 22.23.2, không phải 22.21.0 đang cài trên Mac.</p>
<pre><code class="language-bash">npx @devcontainers/cli exec --workspace-folder . sh -c 'pwd; ls; cat /tmp/pc.txt; node index.js'
docker ps --filter name=dk13-devc --format '{{.Names}}\\t{{.Image}}\\t{{.Status}}\\t{{.Ports}}'</code></pre>
<div class="out">/workspaces/devc
index.js
postCreate xong
hello from /workspaces/devc
dk13-devc	node:22-bookworm-slim	Up 8 seconds	</div>
<p>Hai sự thật nấp trong output đó. File bạn viết trên Mac có mặt trong container, nhờ bind mount. Và cột <code>Ports</code> <strong>rỗng</strong> dù file ghi <code>"forwardPorts": [3000]</code>: chuyển cổng (port forwarding) là việc VS Code tự làm qua kết nối riêng của nó, không phải ánh xạ cổng của Docker. Nếu bạn dùng CLI (hay một trình soạn thảo khác) mà cần cổng, hãy thêm <code>"appPort": [3000]</code> hoặc <code>"runArgs": ["-p", "3000:3000"]</code>. Chạy <code>up</code> lần hai chỉ mất 0,95 s: container đã có sẵn, công cụ tìm ra nó theo nhãn và dùng lại.</p>

<h3>Bốn cách mô tả môi trường</h3>
${slide('dk-13', 6, 'Ba cách khai môi trường: image, Dockerfile, compose')}
<p>Image là cách khởi đầu nhanh nhất, nhưng sớm muộn dự án sẽ cần thứ image không có. Có ba nấc để leo:</p>
<ul>
<li><strong>Dockerfile</strong> — <code>"build": { "dockerfile": "Dockerfile" }</code>. Bạn viết <code>FROM node:22-bookworm-slim</code> cộng <code>RUN apt-get install -y openssl postgresql-client</code>. Mọi thứ học ở Chương 4–6 đều áp dụng; lần mở đầu tiên dựng image, các lần sau dùng lại cache.</li>
<li><strong>features</strong> (tính năng ghép thêm) — các bộ cài đóng gói sẵn, phát hành dưới dạng artifact OCI (vd <code>ghcr.io/devcontainers/features/common-utils:2</code>). Bạn liệt kê chúng; công cụ tự sinh một Dockerfile sau lưng bạn rồi build.</li>
<li><strong>compose</strong> — <code>"dockerComposeFile": "compose.yaml"</code> và <code>"service": "app"</code>. Công cụ chạy <code>docker compose up</code> và gắn vào một service. Đây là hình dạng thực tế của một web app có cơ sở dữ liệu.</li>
</ul>
<p>Features tiện, nhưng nên nhìn cái giá của nó một lần. Thêm đúng một feature <code>common-utils</code> vào cùng file đó:</p>
<pre><code class="language-bash">npx @devcontainers/cli up --workspace-folder .      <span class="tok-comment"># có "features": { "ghcr.io/devcontainers/features/common-utils:2": {…} }</span>
docker images | grep -E 'vsc-devc2|bookworm-slim'</code></pre>
<div class="out">#13 [dev_containers_target_stage 5/5] RUN --mount=type=bind,from=dev_containers_feature_content_source,source=common-utils_0,…
…
#14 naming to docker.io/library/vsc-devc2-914dfa02dce5…-features:latest done
real 56.48
node:22-bookworm-slim                                          83f487e0a634        349MB         82.6MB   U
vsc-devc2-914dfa02dce51fc6f09fcf0df61b12109d4b951aae53c964ab7e3663e9c0d57d-features:latest   9810256e6487        641MB          153MB   U</div>
<p>56 giây ở lần đầu (nó chạy <code>apt-get</code> cho hơn 70 gói), 4,9 giây ở lần khởi động sau khi cache đã ấm, và một image phình từ 349 MB lên 641 MB trên đĩa. Để ý cái tên tự sinh <code>vsc-&lt;thư-mục&gt;-&lt;mã-băm&gt;-features</code>: những image này chất đống, mỗi dự án một cái, và <code>docker images</code> là chỗ để tìm và xoá chúng. Quy tắc ngón tay cái: bắt đầu bằng <code>image</code>, chuyển sang Dockerfile khi cần gói hệ thống, thêm compose khi app cần dịch vụ đi kèm.</p>

<h3>Bản compose, và cái bẫy ai cũng dính</h3>
${slide('dk-13', 7, 'postCreateCommand chạy TRƯỚC khi Postgres sẵn sàng')}
<p>Đây là một cấu hình hai service thực tế: container <code>app</code> để bạn làm việc, và một Postgres chỉ sống bằng thời gian của phiên dev (<code>tmpfs</code> — ổ đĩa trong RAM, Bài 13.3). <code>postCreateCommand</code> kiểm xem có nối được tới cơ sở dữ liệu không — đứng thay cho lệnh <code>npx prisma migrate dev</code> mà một dự án thật sẽ chạy ở đó.</p>
<pre><code class="language-yaml"><span class="tok-comment"># .devcontainer/compose.yaml — thử lần đầu</span>
name: swp391-dev
services:
  app:
    image: node:22-bookworm-slim
    command: sleep infinity
    volumes:
      - ..:/workspaces/app:cached
    environment:
      DATABASE_URL: postgres://postgres:dev@db:5432/app
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: app
    tmpfs: [/var/lib/postgresql/data]</code></pre>
<pre><code class="language-json">{
  "name": "swp391-api + db",
  "dockerComposeFile": "compose.yaml",
  "service": "app",
  "workspaceFolder": "/workspaces/app",
  "shutdownAction": "stopCompose",
  "postCreateCommand": "node -e \\"require('net').connect(5432,'db').on('connect',()=&gt;{console.log('db:5432 mở');process.exit(0)}).on('error',e=&gt;{console.log(e.code);process.exit(1)})\\""
}</code></pre>
<div class="out">[2026-09-24T00:20:20.596Z] Running the postCreateCommand from devcontainer.json...
[2026-09-24T00:20:20.724Z] ECONNREFUSED
[2026-09-24T00:20:20.734Z] postCreateCommand from devcontainer.json failed with exit code 1. Skipping any further user-provided commands.</div>
<p>Cả hai container đều <code>Up</code>. Lệnh vẫn hỏng, vì "container đã khởi động" không phải là "Postgres nhận kết nối" — lúc đó Postgres vẫn đang chạy <code>initdb</code> (khởi tạo thư mục dữ liệu). <code>command: sleep infinity</code> là cần thiết vì tiến trình chính của dev container phải sống suốt lúc bạn làm việc; dấu <code>..</code> trong <code>volumes</code> tính từ file compose, tức là thư mục gốc dự án. Cách sửa chính là cách Chương 9 đã dạy cho mọi app: healthcheck (kiểm tra sức khoẻ) cho cơ sở dữ liệu và <code>depends_on: condition: service_healthy</code> cho app.</p>
<pre><code class="language-yaml">  app:
    …
    depends_on:
      db: { condition: service_healthy }
  db:
    …
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]
      interval: 1s
      retries: 30</code></pre>
<div class="out">[2026-09-24T00:20:37.365Z] Running the postCreateCommand from devcontainer.json...
[2026-09-24T00:20:37.485Z] db:5432 mở
real 3.84</div>
<div class="pitfall co-tieu-de"><strong>"Máy tôi chạy được" dọn vào ở trong devcontainer.</strong> Trên một máy Mac nhanh, cuộc chạy đua ở trên có thể thắng nhờ may mắn nên người viết file không bao giờ thấy lỗi; trên laptop Windows chậm hơn của bạn cùng nhóm, cơ sở dữ liệu cần thêm hai giây và <code>postCreateCommand</code> hỏng lần nào cũng như lần nào — và vì công cụ sau đó <em>bỏ qua mọi lệnh phía sau</em>, <code>npm ci</code> cũng không bao giờ chạy, bạn ấy nhìn thấy cả biển import đỏ lòm. Lệnh vòng đời nào đụng tới service khác cũng cần một cửa chặn bằng healthcheck. Bài 13.3 giải thích vì sao <code>pg_isready</code> nên có thêm <code>-h 127.0.0.1</code>.</div>

<h3>Khi nào đáng dùng — và khi nào KHÔNG</h3>
${slide('dk-13', 8, 'Dev Container đáng dùng khi nào — và khi nào KHÔNG')}
<table>
<tr><th>Tình huống</th><th>Dùng dev container?</th><th>Vì sao</th></tr>
<tr><td>Đồ án nhóm, laptop Mac/Windows lẫn lộn</td><td>Có</td><td>Một bộ công cụ, quản lý trong git; người mới vào làm được sau vài phút</td></tr>
<tr><td>Cần công cụ khó cài trên Windows (make, openssl, psql, build mã native)</td><td>Có</td><td>Trong Linux chúng cài theo cách bình thường</td></tr>
<tr><td>Bài tập một file trên lớp</td><td>Không</td><td>Container tốn thời gian hơn phần nó tiết kiệm</td></tr>
<tr><td>Laptop 8 GB đã ì ạch</td><td>Cân nhắc</td><td>Máy ảo của Docker và VS Code Server giành nhau cùng một chỗ RAM (Bài 13.4)</td></tr>
<tr><td>App di động, app desktop có giao diện, việc cần GPU</td><td>Thường là không</td><td>Máy giả lập, màn hình và GPU không sống thoải mái trong container trên Mac</td></tr>
</table>
<p><strong>GitHub Codespaces</strong> đọc đúng thư mục <code>.devcontainer/</code> đó nhưng chạy container trên máy của GitHub, nên bạn chỉ cần trình duyệt. Tài khoản cá nhân có một hạn mức miễn phí mỗi tháng tính bằng giờ-lõi (core-hour) — 120 với GitHub Free và 180 với Pro, cộng 15 và 20 GB-tháng lưu trữ (tính đến 09/2026); máy 2 lõi tiêu hai giờ-lõi cho mỗi giờ chạy. Đủ cho một buổi demo hay một buổi lab trên máy của trường, không đủ để dùng cả ngày. Điểm hay là bạn không phải chọn: một thư mục devcontainer đúng phục vụ được cả hai.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn cùng nhóm SWP391 dùng Windows than "npm install trên máy mình lỗi, máy bạn thì chạy". Hãy cho cả nhóm một môi trường mà ai cũng bật được bằng đúng một lệnh.</p><ol>
<li>Trong <code>~/thu-docker/devc</code>, tạo <code>.devcontainer/devcontainer.json</code> với <code>"image": "node:22-bookworm-slim"</code>, một <code>postCreateCommand</code> in <code>node -v</code>, và <code>"runArgs": ["--name", "thu-devc"]</code>.</li>
<li>Chạy <code>npx @devcontainers/cli up --workspace-folder .</code>. Trong log, tìm đoạn <code>--mount type=bind</code> và ghi lại <code>target</code> của nó.</li>
<li>Chạy <code>npx @devcontainers/cli exec --workspace-folder . node -v</code> và so với <code>node -v</code> trên chính máy bạn.</li>
<li>Thêm <code>"forwardPorts": [3000]</code>, tạo lại (<code>docker rm -f thu-devc</code> rồi <code>up</code> lần nữa) và xem cột <code>Ports</code> của <code>docker ps</code>. Sau đó thay bằng <code>"appPort": [3000]</code> và xem lại.</li>
<li>Dọn dẹp: <code>docker rm -f thu-devc</code>.</li></ol>
<p><strong>Đạt khi:</strong> bạn nói được mã của mình xuất hiện ở thư mục nào trong container, chỉ ra được hai phiên bản Node khác nhau (máy bạn và container), và giải thích được vì sao <code>forwardPorts</code> để cột Ports rỗng còn <code>appPort</code> thì làm nó có dữ liệu.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dev container (container phát triển)</span><span class="v">Container bạn làm việc <em>bên trong</em>: công cụ chạy trong nó, mã được gắn vào nó.</span></div>
  <div class="kv"><span class="k">devcontainer.json (file công thức)</span><span class="v">File trong <code>.devcontainer/</code>, commit vào git, được VS Code, Codespaces và CLI đọc.</span></div>
  <div class="kv"><span class="k">Feature (tính năng ghép thêm)</span><span class="v">Bộ cài đóng gói sẵn (git, gh, docker-in-docker…) chồng lên image; đổi lại một lần build.</span></div>
  <div class="kv"><span class="k">Lifecycle command (lệnh vòng đời)</span><span class="v"><code>onCreate</code> → <code>updateContent</code> → <code>postCreate</code> (một lần) → <code>postStart</code> (mỗi lần bật) → <code>postAttach</code>.</span></div>
  <div class="kv"><span class="k">Forward (chuyển cổng) vs publish (mở cổng)</span><span class="v">Chuyển cổng do trình soạn thảo làm; mở cổng (<code>appPort</code>, <code>-p</code>) do Docker làm.</span></div>
  <div class="kv"><span class="k">Codespaces</span><span class="v">Dev container chạy trên máy của GitHub, dựng từ cùng thư mục; tính tiền theo giờ-lõi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dev container dọn <em>công cụ</em> vào container và giữ <em>mã</em> trên ổ đĩa của bạn qua bind mount ở <code>/workspaces/&lt;thư-mục&gt;</code>.</li>
<li>Công thức là <code>.devcontainer/devcontainer.json</code>, commit cùng mã, nên mỗi commit mang theo bộ công cụ của nó.</li>
<li><code>@devcontainers/cli up</code> làm đúng việc cái nút của VS Code làm: 2,4 s lần đầu khi image có sẵn, dưới một giây khi dùng lại.</li>
<li>Chỉ leo từ <code>image</code> lên Dockerfile rồi compose khi cần; features tiện nhưng tốn một lần build và hàng trăm MB.</li>
<li>Lệnh vòng đời nào nói chuyện với cơ sở dữ liệu cũng cần healthcheck cộng <code>service_healthy</code>, không thì hỏng trên máy chậm.</li>
<li><code>forwardPorts</code> là tính năng của trình soạn thảo; muốn Docker mở cổng thì dùng <code>appPort</code> hoặc <code>runArgs</code>.</li>
</ul>

<a class="link-card" href="https://containers.dev/implementors/json_reference/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Tham chiếu devcontainer.json</span><span class="lc-sub">Mọi thuộc tính, thứ tự các lệnh vòng đời và chỗ khác nhau giữa chuyển cổng với mở cổng — từ chính bản đặc tả mở.</span></span>
</a>
<a class="link-card" href="https://code.visualstudio.com/docs/devcontainers/containers" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Developing inside a Container — VS Code</span><span class="lc-sub">Extension kết nối ra sao, Reopen/Rebuild Container, và các lưu ý cho Windows/WSL.</span></span>
</a>
<a class="link-card" href="https://github.com/devcontainers/cli" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">devcontainers/cli</span><span class="lc-sub">Công cụ dòng lệnh tham chiếu dùng trong bài: <code>up</code>, <code>exec</code>, <code>build</code> — dùng được cả trong CI.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/billing/concepts/product-billing/github-codespaces" target="_blank" rel="noopener">
  <span class="lc-ico">☁️</span>
  <span class="lc-body"><span class="lc-title">Bảng giá GitHub Codespaces</span><span class="lc-sub">Số giờ-lõi và dung lượng miễn phí hiện hành của tài khoản cá nhân — kiểm trước khi trông vào nó cho buổi demo.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trong Code Lab: Docker</span><span class="lc-sub">Các bài tập Docker có chấm điểm để tay luôn quen lệnh.</span></span>
</a>

<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Mã ở lại trên ổ đĩa của bạn, còn bộ công cụ dọn vào một container có công thức commit ngay cạnh mã. CLI cho bạn thấy chính xác trình soạn thảo làm gì — một bind mount, hai cái nhãn và một shell cứ thế sống. Và "container đã khởi động" không bao giờ là "cơ sở dữ liệu đã sẵn sàng": chặn các lệnh vòng đời bằng healthcheck.</p>
</div>
`,
    },
    /* ─────────────────────────── 13.2 ─────────────────────────── */
    {
      title: '13.2 — Edit and see it: hot reload, compose watch and a debugger in the container|||13.2 — Sửa mã thấy ngay: hot reload, compose watch và debugger trong container',
      slug: 'dk-13-2-hot-reload-debug',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Hai đường đưa mã mới vào container — bind mount và docker compose watch (sync, sync+restart, rebuild) — đo thật từ lúc Lưu tới lúc thấy chữ mới; bẫy node_modules bị che và node_modules của Mac trong Linux; gắn debugger Node qua cổng 9229 an toàn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.2</span>
<h2>Edit and see it: hot reload, compose watch and a debugger in the container</h2>
<p class="lead">If every code change means <code>docker compose up --build</code> and a 30-second wait, you will stop using Docker for development within a week — and you would be right to. The goal of this lesson is a loop where you press Save and the running container shows the change in under a second, where adding a library rebuilds by itself, and where you can stop on a breakpoint inside the container exactly as you would on your own machine.</p>
<p>Everything here was measured on one small Express app (one route that prints a message from <code>src/msg.js</code> plus the time the process started), so you can see <em>when</em> the process restarted, not just whether the text changed.</p>

<h3>Two ways to get new code into a container</h3>
${slide('dk-13', 9, 'Hai đường đưa mã mới vào container')}
<p>The image contains a copy of your code taken at build time. To see an edit without rebuilding, the container needs the new file by some other route. There are exactly two:</p>
<ul>
<li><strong>Bind mount</strong> (<code>-v .:/app</code>, Chapter 7): the container reads your folder directly. Nothing is copied; a save on your side is instantly a changed file on its side.</li>
<li><strong><code>docker compose watch</code></strong>: Compose watches your folder and <em>copies</em> each changed file into the container (or rebuilds the image, depending on the rule). Inside, <code>/app</code> is the container's own filesystem.</li>
</ul>
<p>Either way, the file changing is only half the job. Something inside the container has to notice and reload: <code>node --watch</code>, <code>nodemon</code>, <code>next dev</code>, <code>vite</code>. Those watchers rely on file-change notifications from the kernel (<em>inotify</em> on Linux). Whether those notifications arrive — and they do not always — is the thread that runs through this lesson and the next one.</p>

<h3>The node_modules trap</h3>
${slide('dk-13', 10, 'Bẫy node_modules: bind mount PHỦ lên thư mục của ảnh')}
<p>The Dockerfile is the usual one: <code>COPY package*.json ./</code>, <code>RUN npm ci</code>, <code>COPY . .</code>. The image therefore has <code>/app/node_modules</code> with Express in it. Your project folder does not — you never ran <code>npm install</code> on the Mac, which is the whole point. Now mount the folder over <code>/app</code>:</p>
<pre><code class="language-yaml"><span class="tok-comment"># compose.bind.yaml — first attempt</span>
services:
  api:
    image: dk13-watch-api:dev
    command: ["node", "--watch", "src/server.js"]
    init: true
    ports: ["18131:3000"]
    volumes:
      - .:/app</code></pre>
<pre><code class="language-bash">docker compose -f compose.bind.yaml up -d
docker compose -f compose.bind.yaml logs api --no-log-prefix</code></pre>
<div class="out">node:internal/modules/cjs/loader:1433
  throw err;
  ^

Error: Cannot find module 'express'
Require stack:
- /app/src/server.js
…
Node.js v22.23.2
Failed running 'src/server.js'. Waiting for file changes before restarting...</div>
<p>A bind mount does not merge with what is underneath; it <strong>covers</strong> it. <code>/app</code> is now your folder and nothing else, so the image's <code>node_modules</code> is still on disk but invisible. Notice also that <code>docker compose ps</code> said <code>Up</code>: <code>node --watch</code> stays alive waiting for a change, so the container looks healthy while the app is dead — read the logs, not the status.</p>
<p>The fix is a second, more specific mount that covers the first one at exactly <code>/app/node_modules</code>:</p>
<pre><code class="language-yaml">    volumes:
      - .:/app
      - /app/node_modules      <span class="tok-comment"># anonymous volume: longer path wins</span></code></pre>
<pre><code class="language-bash">docker compose -f compose.bind.yaml up -d
docker inspect dk13-bind-api-1 --format '{{range .Mounts}}{{.Type}} {{.Name}} {{.Destination}}{{"\\n"}}{{end}}'
curl -s localhost:18131/</code></pre>
<div class="out">bind  /app
volume 0eff2713cecefdb9fd94196f62579a272a31597dd2f28b8422dc88cda88bebc1 /app/node_modules

phiên bản 44 (tiến trình bật lúc 00:27:29.061)</div>
<p>Why does a brand-new, empty volume suddenly contain Express? Because of a rule from Chapter 7: when an <em>empty</em> volume is mounted over a path that has content in the image, Docker copies the image's content into the volume first. The volume starts as a copy of the image's <code>node_modules</code>. Two consequences: after you add a dependency and rebuild, the old volume still holds the old copy — recreate it with <code>docker compose down -v</code> (the <code>-v</code> removes the project's anonymous volumes too); and if you ever see a mysteriously stale library, that volume is the first suspect.</p>

<h3>node_modules from your Mac does not run in Linux</h3>
${slide('dk-13', 11, 'node_modules cài trên Mac KHÔNG chạy được trong Linux')}
<p>The opposite mistake is to run <code>npm install</code> on the Mac "so the editor has autocompletion" and let the bind mount carry that folder into the container. Pure JavaScript packages survive this. Packages with compiled code do not, because npm downloads a binary for the machine that ran the install:</p>
<pre><code class="language-bash">npm i esbuild                 <span class="tok-comment"># on the Mac</span>
ls node_modules/@esbuild/
docker run --rm -v "$PWD":/app -w /app node:22-alpine \\
  node -e "require('esbuild').buildSync({stdin:{contents:'let a=1'},write:false})"</code></pre>
<div class="out">darwin-arm64
/app/node_modules/esbuild/lib/main.js:2440
      throw reject;
      ^

Error:
You installed esbuild for another platform than the one you're currently using.
This won't work because esbuild is written with native code and needs to
install a platform-specific binary executable.

Specifically the "@esbuild/darwin-arm64" package is present but this platform
needs the "@esbuild/linux-arm64" package instead. People often get into this
situation by installing esbuild on Windows or macOS and copying "node_modules"
…</div>
<p>esbuild is polite and explains itself. <code>bcrypt</code>, <code>sharp</code> or a Prisma query engine often just crash with <code>invalid ELF header</code> or "cannot open shared object file" — the same root cause as the course's 502 story, where an Alpine (musl) image carried a Prisma engine built for glibc. The rule: <strong>the container's <code>node_modules</code> is installed inside the container</strong> — at build time, or with <code>docker compose exec api npm ci</code> — and lives in its own volume. If your editor wants types, install a second copy on the host; the two never meet.</p>

<h3>docker compose watch: three actions for three kinds of change</h3>
${slide('dk-13', 12, 'compose watch: ba hành động cho ba loại thay đổi')}
<pre><code class="language-yaml">name: dk13-watch
services:
  api:
    build: .
    image: dk13-watch-api:dev
    ports: ["18130:3000"]
    init: true
    develop:
      watch:
        - action: sync+restart
          path: ./src
          target: /app/src
        - action: rebuild
          path: package.json</code></pre>
<table>
<tr><th>Key</th><th>Meaning</th></tr>
<tr><td><code>develop.watch</code></td><td>A list of rules, read only by <code>docker compose watch</code> (plain <code>up</code> ignores it)</td></tr>
<tr><td><code>path</code></td><td>What to watch on your machine, relative to the compose file</td></tr>
<tr><td><code>target</code></td><td>Where to put it in the container (for <code>sync</code> actions)</td></tr>
<tr><td><code>action: sync</code></td><td>Copy changed files in; your in-container watcher reloads</td></tr>
<tr><td><code>action: sync+restart</code></td><td>Copy, then restart the container — for code or config nothing inside reloads</td></tr>
<tr><td><code>action: rebuild</code></td><td>Build a new image with BuildKit and replace the container — for <code>package.json</code>, the Dockerfile</td></tr>
<tr><td><code>ignore</code></td><td>Patterns to skip, <code>.dockerignore</code> syntax, relative to <code>path</code></td></tr>
</table>
<p>Two requirements from the documentation matter in practice: the service must have a <code>build:</code> section, and the container needs <code>stat</code>, <code>mkdir</code> and <code>rmdir</code> and a <code>USER</code> that can write to <code>target</code>. A hardened image that runs as a non-root user with a read-only <code>/app</code> (Chapter 6) will silently fail to sync — use a dev stage for watch.</p>
<pre><code class="language-bash">docker compose watch</code></pre>
<div class="out"> Image dk13-watch-api:dev Building
…
 Container dk13-watch-api-1 Started
Watch enabled
Syncing service "api" after 1 changes were detected
 Container dk13-watch-api-1 Restarting
 Container dk13-watch-api-1 Started
service(s) ["api"] restarted</div>

<h3>Measured: from Save to seeing the new text</h3>
${slide('dk-13', 13, 'Đo thật: từ lúc Lưu tới lúc thấy chữ mới')}
<p>A small script wrote a new version into <code>src/msg.js</code>, then polled the endpoint every 20 ms until the new text appeared, five times per setup. The numbers:</p>
<table>
<tr><th>Setup</th><th>Save → new text</th><th>What is going on</th></tr>
<tr><td>watch <code>sync+restart</code>, no <code>init</code></td><td>4.7 s</td><td>Node as PID 1 ignores SIGTERM, so every restart waits for Docker's stop timeout</td></tr>
<tr><td>watch <code>sync+restart</code>, <code>init: true</code></td><td>1.67 s</td><td>tini forwards SIGTERM; the restart itself is the cost</td></tr>
<tr><td>watch <code>sync</code> + nodemon</td><td>0.65 s</td><td>No container restart; nodemon restarts only the Node process</td></tr>
<tr><td>bind mount + <code>node --watch</code></td><td>0.31 s</td><td>No copy at all; Docker Desktop delivers the change event</td></tr>
<tr><td>watch <code>rebuild</code> (added <code>dayjs</code>)</td><td>6.5 s</td><td><code>npm ci</code> in a fresh layer, then recreate</td></tr>
</table>
<div class="out">phiên bản 2: 4729 ms  → phiên bản 2 (tiến trình bật lúc 00:21:35.607)
phiên bản 3: 4681 ms  → phiên bản 3 (tiến trình bật lúc 00:21:41.790)
…
phiên bản 10: 1677 ms  → phiên bản 10 (tiến trình bật lúc 00:22:19.020)
phiên bản 11: 1682 ms  → phiên bản 11 (tiến trình bật lúc 00:22:22.201)
…
phiên bản 41: 665 ms  → phiên bản 41 (tiến trình bật lúc 00:27:03.287)
phiên bản 42: 630 ms  → phiên bản 42 (tiến trình bật lúc 00:27:05.411)
…
phiên bản 51: 326 ms  → phiên bản 51 (tiến trình bật lúc 00:27:33.198)
phiên bản 52: 320 ms  → phiên bản 52 (tiến trình bật lúc 00:27:35.011)</div>
<p>The first row is Chapter 1's lesson about PID 1 showing up in your daily loop: a restart is a stop, a stop sends SIGTERM, and Node running as PID 1 without a handler ignores it — so Docker waits (about three seconds on Docker Desktop) and then kills. One line, <code>init: true</code>, took almost three seconds off every save.</p>
<p>Then came the surprise. Switching to <code>action: sync</code> with <code>command: ["node", "--watch", "src/server.js"]</code> worked once — 894 ms — and then never again:</p>
<div class="out">phiên bản 20: 894 ms  → phiên bản 20 (tiến trình bật lúc 00:22:48.000)
phiên bản 21: 20021 ms  → TIMEOUT
phiên bản 22: 20022 ms  → TIMEOUT
phiên bản 23: 20004 ms  → TIMEOUT
phiên bản 24: 20005 ms  → TIMEOUT</div>
<p>The file inside the container <em>was</em> updated each time (<code>docker compose exec api cat src/msg.js</code> showed version 24). A tiny watcher inside the container explained why: each sync arrives as a <em>rename</em> — Compose writes a new file and swaps it in — and a watcher attached to one specific file loses track of it after the first swap, while a watcher on the <em>directory</em> keeps seeing events.</p>
<div class="out">1790209486588 file change msg.js
1790209486595 file rename msg.js
1790209486595 file rename msg.js
1790209486596 dir rename msg.js
1790209486596 dir rename msg.js
1790209486596 dir change msg.js
1790209486596 dir change msg.js
1790209488383 dir rename msg.js
1790209488384 dir rename msg.js
1790209488384 dir change msg.js
1790209488384 dir change msg.js
1790209490396 dir rename msg.js
1790209490397 dir rename msg.js
1790209490397 dir change msg.js
1790209490397 dir change msg.js</div>
<p>After the first sync only <code>dir</code> events arrive. <code>node --watch</code> (and <code>--watch-path</code>, tested too) follows individual files, so it went deaf; <code>nodemon</code> watches directories and reloaded every time in about 0.65 s. This is exactly the kind of thing that works in a tutorial and then "randomly stops working" in your project.</p>
<div class="pitfall co-tieu-de"><strong>Reload worked once, then never again.</strong> With <code>docker compose watch</code> + <code>action: sync</code>, pair it with a directory-based watcher (nodemon, <code>next dev</code>, <code>vite</code>) — not <code>node --watch</code>, which in our test (Compose v5.5.1, Node 22.23, Docker Desktop 4.91) picked up only the first change. With a plain bind mount on Docker Desktop, <code>node --watch</code> worked every time. When a reload silently stops, check the file inside the container first (<code>docker compose exec api cat …</code>): if the file is new and the process is old, the watcher is the problem, not the sync.</div>
<p><strong>Which one should you use?</strong> On Linux (your home machine, a VPS), a bind mount is simplest and fastest. On Mac and Windows it is also fine for a project of a few hundred source files, as long as <code>node_modules</code> lives in a volume. <code>compose watch</code> earns its place when you want the container's filesystem to be its own (no host <code>node_modules</code> confusion, no permission clashes) and when you want <code>rebuild</code> on <code>package.json</code> for free.</p>

<h3>A debugger inside the container</h3>
${slide('dk-13', 14, 'Debugger: 0.0.0.0 bên trong, 127.0.0.1 bên ngoài')}
<p>Node's inspector listens on port 9229. The trap is the default address: <code>--inspect</code> means <code>127.0.0.1:9229</code>, and inside a container 127.0.0.1 is the container itself (Chapter 8). Port publishing delivers traffic to the container's network interface, where nobody is listening:</p>
<pre><code class="language-bash">docker run -d --rm --name dk13-dbg-sai -p 127.0.0.1:18132:9229 -p 18133:3000 \\
  dk13-watch-api:dev node --inspect src/server.js
docker logs dk13-dbg-sai 2&gt;&amp;1 | head -1
curl -sS localhost:18132/json/list</code></pre>
<div class="out">Debugger listening on ws://127.0.0.1:9229/c9d3dbf6-4740-4b39-8c85-cce24e28dea7
curl: (52) Empty reply from server</div>
<p>Bind the inspector to all interfaces <em>inside</em> the container, and restrict it to loopback <em>outside</em>:</p>
<pre><code class="language-bash">docker run -d --rm --name dk13-dbg -p 127.0.0.1:18132:9229 -p 18133:3000 \\
  -v "$PWD":/app -w /app node:22-alpine node --inspect=0.0.0.0:9229 server.js
curl -sS localhost:18132/json/list
docker port dk13-dbg</code></pre>
<div class="out">[ {
  "description": "node.js instance",
  …
  "title": "server.js",
  "type": "node",
  "url": "file:///app/server.js",
  "webSocketDebuggerUrl": "ws://localhost:18132/5806d3ee-a4d3-46ff-9903-4e06fe2c18d9"
} ]

3000/tcp -&gt; 0.0.0.0:18133
3000/tcp -&gt; [::]:18133
9229/tcp -&gt; 127.0.0.1:18132</div>
<table>
<tr><th>Piece</th><th>Why</th></tr>
<tr><td><code>--inspect=0.0.0.0:9229</code></td><td>Listen on the container's network interface, so published traffic reaches it</td></tr>
<tr><td><code>-p 127.0.0.1:18132:9229</code></td><td>Publish only on your machine's loopback — never to the LAN</td></tr>
<tr><td><code>--inspect-brk</code> (variant)</td><td>Pause on the first line until a debugger attaches — for bugs at startup</td></tr>
</table>
<p>Now attach. VS Code's <em>Attach</em> configuration needs two path settings so a breakpoint in <code>src/server.js</code> on your disk maps to <code>/app/src/server.js</code> in the container:</p>
<pre><code class="language-json">{
  "type": "node",
  "request": "attach",
  "name": "Gắn vào container",
  "address": "localhost",
  "port": 9229,
  "localRoot": "&#36;{workspaceFolder}",
  "remoteRoot": "/app"
}</code></pre>
<p>Without VS Code, Node's built-in command-line debugger proves the same thing. Here with a two-line handler, a breakpoint on line 4, and one request sent from another terminal:</p>
<pre><code class="language-bash">node inspect localhost:18132
debug&gt; setBreakpoint('/app/server.js', 4)
<span class="tok-comment"># another terminal: curl localhost:18133/</span></code></pre>
<div class="out">debug&gt; break in /app/server.js:4
  2 http.createServer((req, res) =&gt; {
  3   const tong = [1, 2, 3].reduce((a, b) =&gt; a + b, 0);
&gt; 4   res.end(&#96;tong = &#36;{tong}\\n&#96;);
  5 }).listen(3000, () =&gt; console.log('API nghe cổng 3000'));
  6
debug&gt; 6
debug&gt; 'GET /'
debug&gt; 1</div>
<p>The three answers are <code>exec tong</code>, <code>exec req.method + ' ' + req.url</code> and <code>exec process.pid</code>. The last one is a small reminder: the app is PID 1 in its container — which is why the earlier restart waited for SIGTERM.</p>
<div class="callout danger"><strong>Never publish 9229 to the network.</strong> The inspector protocol can evaluate any JavaScript in your process. <code>-p 9229:9229</code> (without <code>127.0.0.1:</code>) on a laptop in a café or a school Wi-Fi hands everyone on that network a remote shell into your app — and on a VPS, to the whole Internet. The same goes for leaving <code>--inspect</code> in a production compose file.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the team's API container shows <code>Up</code> but every request fails, and each code change takes five seconds to appear. Reproduce both problems and fix them.</p><ol>
<li>In <code>~/thu-docker/watch</code> create a tiny Express app (a <code>package.json</code> with <code>express</code>, <code>src/server.js</code>, <code>src/msg.js</code>) and the three-line Dockerfile from this lesson. Do <em>not</em> run <code>npm install</code> on your machine.</li>
<li>Run it with <code>-v .:/app</code> only and read the logs; then add <code>- /app/node_modules</code> and confirm the endpoint answers.</li>
<li>Switch to <code>docker compose watch</code> with <code>sync+restart</code> and no <code>init</code>. Time three saves (a stopwatch is fine). Add <code>init: true</code> and time again.</li>
<li>Change the rule to <code>action: sync</code> with <code>node --watch</code>, save twice, and see what happens on the second save. Replace the command with <code>npx nodemon --watch src src/server.js</code> and try again.</li>
<li>Clean up: <code>docker compose down -v</code>.</li></ol>
<p><strong>Done when:</strong> you have the <code>Cannot find module</code> error and its fix in your notes, a before/after time for <code>init: true</code>, and a sentence explaining why <code>node --watch</code> stopped reloading while nodemon did not.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hot reload</span><span class="v">Seeing a code change in the running app without rebuilding the image.</span></div>
  <div class="kv"><span class="k">Bind mount shadowing</span><span class="v">A mount hides whatever the image had at that path; a longer, more specific mount can cover it again.</span></div>
  <div class="kv"><span class="k">compose watch</span><span class="v"><code>docker compose watch</code> + <code>develop.watch</code>: sync, sync+restart or rebuild on file changes.</span></div>
  <div class="kv"><span class="k">inotify</span><span class="v">The Linux kernel's file-change notifications that nodemon, <code>next dev</code> and friends depend on.</span></div>
  <div class="kv"><span class="k">Native module</span><span class="v">An npm package with compiled code for one OS + CPU (esbuild, bcrypt, sharp, Prisma engines).</span></div>
  <div class="kv"><span class="k">Inspector / attach</span><span class="v">Node's debugging port (9229); a debugger <em>attaches</em> to a running process through it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>New code reaches a container by bind mount (direct, instant) or by <code>compose watch</code> (copied); a watcher inside must then reload.</li>
<li>A bind mount over <code>/app</code> hides the image's <code>node_modules</code>; add the anonymous volume <code>/app/node_modules</code>.</li>
<li><code>node_modules</code> installed on a Mac or Windows host breaks native packages in Linux — install inside the container.</li>
<li>For <code>sync+restart</code>, <code>init: true</code> cut each save from 4.7 s to 1.67 s; for <code>sync</code>, use a directory watcher such as nodemon.</li>
<li>Debug with <code>--inspect=0.0.0.0:9229</code> inside and <code>-p 127.0.0.1:9229:9229</code> outside, plus <code>localRoot</code>/<code>remoteRoot</code> in VS Code.</li>
<li>Never expose 9229 beyond loopback: the inspector runs arbitrary code.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/compose/how-tos/file-watch/" target="_blank" rel="noopener">
  <span class="lc-ico">👀</span>
  <span class="lc-body"><span class="lc-title">Use Compose Watch</span><span class="lc-sub">The three actions, the container requirements (<code>stat</code>, <code>mkdir</code>, writable target) and <code>ignore</code> rules.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/compose-file/develop/" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">Compose Develop Specification</span><span class="lc-sub">The exact schema of <code>develop.watch</code>, including <code>initial_sync</code> and <code>exec</code> hooks.</span></span>
</a>
<a class="link-card" href="https://nodejs.org/en/learn/getting-started/debugging" target="_blank" rel="noopener">
  <span class="lc-ico">🐞</span>
  <span class="lc-body"><span class="lc-title">Debugging Node.js</span><span class="lc-sub">The inspector flags, why binding to a public address is dangerous, and which clients can attach.</span></span>
</a>
<a class="link-card" href="https://code.visualstudio.com/docs/nodejs/nodejs-debugging" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Node.js debugging in VS Code</span><span class="lc-sub">Attach configurations, <code>localRoot</code>/<code>remoteRoot</code> and remote debugging.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practise in Code Lab: Docker</span><span class="lc-sub">Graded Docker exercises to keep your hands on the commands.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Changing the file is half the job; something inside must notice, and how the file arrives (bind mount vs copy-and-rename) decides which watchers notice. A bind mount covers the image's <code>node_modules</code>, and a host's <code>node_modules</code> breaks in Linux — keep the container's in a volume. And a debugger needs 0.0.0.0 inside, 127.0.0.1 outside.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.2</span>
<h2>Sửa mã thấy ngay: hot reload, compose watch và debugger trong container</h2>
<p class="lead">Nếu mỗi lần sửa mã là một lần <code>docker compose up --build</code> và chờ 30 giây, chỉ một tuần là bạn thôi dùng Docker để phát triển — và bạn sẽ có lý. Mục tiêu của bài này là một vòng lặp mà bạn bấm Lưu thì container đang chạy hiện thay đổi trong chưa tới một giây, thêm một thư viện thì nó tự build lại, và bạn dừng được ở một breakpoint (điểm dừng) bên trong container y như trên máy mình.</p>
<p>Mọi thứ ở đây được đo trên một app Express nhỏ (một route in câu chữ lấy từ <code>src/msg.js</code> kèm giờ tiến trình khởi động), nên bạn thấy được tiến trình khởi động lại <em>lúc nào</em>, chứ không chỉ biết chữ có đổi hay không.</p>

<h3>Hai đường đưa mã mới vào container</h3>
${slide('dk-13', 9, 'Hai đường đưa mã mới vào container')}
<p>Image chứa một bản sao mã của bạn chụp lúc build. Muốn thấy chỗ vừa sửa mà không build lại, container phải nhận file mới qua một đường khác. Có đúng hai đường:</p>
<ul>
<li><strong>Bind mount</strong> (gắn thư mục máy chủ — <code>-v .:/app</code>, Chương 7): container đọc thẳng thư mục của bạn. Không chép gì cả; bạn lưu bên này là bên kia có ngay file đã đổi.</li>
<li><strong><code>docker compose watch</code></strong>: Compose theo dõi thư mục của bạn và <em>chép</em> từng file vừa đổi vào container (hoặc build lại image, tuỳ luật). Bên trong, <code>/app</code> là hệ thống file riêng của container.</li>
</ul>
<p>Đường nào thì file đổi cũng mới là một nửa công việc. Phải có thứ gì bên trong container nhận ra và nạp lại: <code>node --watch</code>, <code>nodemon</code>, <code>next dev</code>, <code>vite</code>. Những trình theo dõi đó dựa vào thông báo thay đổi file từ nhân (<em>inotify</em> trên Linux). Thông báo ấy có tới hay không — và không phải lúc nào cũng tới — là sợi chỉ xuyên suốt bài này và bài sau.</p>

<h3>Bẫy node_modules</h3>
${slide('dk-13', 10, 'Bẫy node_modules: bind mount PHỦ lên thư mục của ảnh')}
<p>Dockerfile là loại quen thuộc: <code>COPY package*.json ./</code>, <code>RUN npm ci</code>, <code>COPY . .</code>. Vì thế image có <code>/app/node_modules</code> chứa Express. Thư mục dự án của bạn thì không — bạn chưa từng chạy <code>npm install</code> trên Mac, và đó chính là mục đích. Giờ gắn thư mục đó đè lên <code>/app</code>:</p>
<pre><code class="language-yaml"><span class="tok-comment"># compose.bind.yaml — thử lần đầu</span>
services:
  api:
    image: dk13-watch-api:dev
    command: ["node", "--watch", "src/server.js"]
    init: true
    ports: ["18131:3000"]
    volumes:
      - .:/app</code></pre>
<pre><code class="language-bash">docker compose -f compose.bind.yaml up -d
docker compose -f compose.bind.yaml logs api --no-log-prefix</code></pre>
<div class="out">node:internal/modules/cjs/loader:1433
  throw err;
  ^

Error: Cannot find module 'express'
Require stack:
- /app/src/server.js
…
Node.js v22.23.2
Failed running 'src/server.js'. Waiting for file changes before restarting...</div>
<p>Bind mount không trộn với thứ nằm bên dưới; nó <strong>PHỦ</strong> lên. <code>/app</code> giờ là thư mục của bạn và không gì khác, nên <code>node_modules</code> của image vẫn nằm trên đĩa nhưng vô hình. Để ý thêm là <code>docker compose ps</code> báo <code>Up</code>: <code>node --watch</code> cứ sống để chờ file đổi, nên container trông khoẻ mạnh trong khi app đã chết — hãy đọc log, đừng đọc trạng thái.</p>
<p>Cách sửa là một mount thứ hai, cụ thể hơn, phủ lại mount thứ nhất đúng ở <code>/app/node_modules</code>:</p>
<pre><code class="language-yaml">    volumes:
      - .:/app
      - /app/node_modules      <span class="tok-comment"># volume ẩn danh: đường dẫn dài hơn thắng</span></code></pre>
<pre><code class="language-bash">docker compose -f compose.bind.yaml up -d
docker inspect dk13-bind-api-1 --format '{{range .Mounts}}{{.Type}} {{.Name}} {{.Destination}}{{"\\n"}}{{end}}'
curl -s localhost:18131/</code></pre>
<div class="out">bind  /app
volume 0eff2713cecefdb9fd94196f62579a272a31597dd2f28b8422dc88cda88bebc1 /app/node_modules

phiên bản 44 (tiến trình bật lúc 00:27:29.061)</div>
<p>Vì sao một volume mới tinh, rỗng không, lại bỗng có Express? Vì một luật ở Chương 7: khi một volume <em>rỗng</em> được gắn vào một đường dẫn mà trong image có nội dung, Docker chép nội dung của image vào volume trước. Volume khởi đầu là bản sao <code>node_modules</code> của image. Hai hệ quả: sau khi bạn thêm thư viện và build lại, volume cũ vẫn giữ bản sao cũ — tạo lại nó bằng <code>docker compose down -v</code> (<code>-v</code> xoá luôn các volume ẩn danh của dự án); và nếu có lúc bạn thấy một thư viện cũ một cách khó hiểu, cái volume đó là nghi phạm số một.</p>

<h3>node_modules của Mac không chạy trong Linux</h3>
${slide('dk-13', 11, 'node_modules cài trên Mac KHÔNG chạy được trong Linux')}
<p>Sai lầm ngược lại là chạy <code>npm install</code> trên Mac "cho trình soạn thảo có gợi ý code" rồi để bind mount mang luôn thư mục đó vào container. Gói JavaScript thuần thì sống sót. Gói có mã đã biên dịch thì không, vì npm tải bản nhị phân cho đúng cái máy đã chạy lệnh cài:</p>
<pre><code class="language-bash">npm i esbuild                 <span class="tok-comment"># trên Mac</span>
ls node_modules/@esbuild/
docker run --rm -v "$PWD":/app -w /app node:22-alpine \\
  node -e "require('esbuild').buildSync({stdin:{contents:'let a=1'},write:false})"</code></pre>
<div class="out">darwin-arm64
/app/node_modules/esbuild/lib/main.js:2440
      throw reject;
      ^

Error:
You installed esbuild for another platform than the one you're currently using.
This won't work because esbuild is written with native code and needs to
install a platform-specific binary executable.

Specifically the "@esbuild/darwin-arm64" package is present but this platform
needs the "@esbuild/linux-arm64" package instead. People often get into this
situation by installing esbuild on Windows or macOS and copying "node_modules"
…</div>
<p>esbuild lịch sự, tự giải thích. <code>bcrypt</code>, <code>sharp</code> hay engine truy vấn của Prisma thì thường chỉ sập với <code>invalid ELF header</code> hoặc "cannot open shared object file" — cùng một gốc rễ với câu chuyện 502 của khoá, khi một image Alpine (musl) mang engine Prisma dựng cho glibc. Luật: <strong><code>node_modules</code> của container được cài bên trong container</strong> — lúc build, hoặc bằng <code>docker compose exec api npm ci</code> — và nằm trong volume riêng của nó. Nếu trình soạn thảo cần kiểu dữ liệu để gợi ý, cài thêm một bản trên máy; hai bản không bao giờ gặp nhau.</p>

<h3>docker compose watch: ba hành động cho ba loại thay đổi</h3>
${slide('dk-13', 12, 'compose watch: ba hành động cho ba loại thay đổi')}
<pre><code class="language-yaml">name: dk13-watch
services:
  api:
    build: .
    image: dk13-watch-api:dev
    ports: ["18130:3000"]
    init: true
    develop:
      watch:
        - action: sync+restart
          path: ./src
          target: /app/src
        - action: rebuild
          path: package.json</code></pre>
<table>
<tr><th>Khoá</th><th>Nghĩa</th></tr>
<tr><td><code>develop.watch</code></td><td>Danh sách luật, chỉ <code>docker compose watch</code> đọc (<code>up</code> thường bỏ qua)</td></tr>
<tr><td><code>path</code></td><td>Theo dõi cái gì trên máy bạn, tính từ file compose</td></tr>
<tr><td><code>target</code></td><td>Đặt nó vào đâu trong container (với các action <code>sync</code>)</td></tr>
<tr><td><code>action: sync</code></td><td>Chép file đổi vào; trình theo dõi trong container tự nạp lại</td></tr>
<tr><td><code>action: sync+restart</code></td><td>Chép rồi khởi động lại container — cho mã hay cấu hình mà bên trong không có gì tự nạp</td></tr>
<tr><td><code>action: rebuild</code></td><td>Build image mới bằng BuildKit rồi thay container — cho <code>package.json</code>, Dockerfile</td></tr>
<tr><td><code>ignore</code></td><td>Mẫu bỏ qua, cú pháp như <code>.dockerignore</code>, tính từ <code>path</code></td></tr>
</table>
<p>Hai yêu cầu trong tài liệu quan trọng trên thực tế: service phải có mục <code>build:</code>, và container cần có <code>stat</code>, <code>mkdir</code>, <code>rmdir</code> cùng một <code>USER</code> ghi được vào <code>target</code>. Một image đã siết chặt, chạy bằng user thường với <code>/app</code> chỉ đọc (Chương 6), sẽ đồng bộ hỏng mà không kêu — hãy dùng một giai đoạn dev riêng cho watch.</p>
<pre><code class="language-bash">docker compose watch</code></pre>
<div class="out"> Image dk13-watch-api:dev Building
…
 Container dk13-watch-api-1 Started
Watch enabled
Syncing service "api" after 1 changes were detected
 Container dk13-watch-api-1 Restarting
 Container dk13-watch-api-1 Started
service(s) ["api"] restarted</div>

<h3>Đo thật: từ lúc Lưu tới lúc thấy chữ mới</h3>
${slide('dk-13', 13, 'Đo thật: từ lúc Lưu tới lúc thấy chữ mới')}
<p>Một script nhỏ ghi phiên bản mới vào <code>src/msg.js</code>, rồi cứ 20 ms gọi endpoint một lần cho tới khi chữ mới hiện ra, năm lần cho mỗi cách. Kết quả:</p>
<table>
<tr><th>Cách</th><th>Lưu → chữ mới</th><th>Chuyện gì đang xảy ra</th></tr>
<tr><td>watch <code>sync+restart</code>, không <code>init</code></td><td>4,7 s</td><td>Node làm PID 1 phớt lờ SIGTERM, nên mỗi lần restart đều chờ hết hạn dừng của Docker</td></tr>
<tr><td>watch <code>sync+restart</code>, <code>init: true</code></td><td>1,67 s</td><td>tini chuyển SIGTERM; cái giá còn lại là chính cú restart</td></tr>
<tr><td>watch <code>sync</code> + nodemon</td><td>0,65 s</td><td>Không restart container; nodemon chỉ khởi động lại tiến trình Node</td></tr>
<tr><td>bind mount + <code>node --watch</code></td><td>0,31 s</td><td>Không chép gì; Docker Desktop chuyển sự kiện thay đổi file vào</td></tr>
<tr><td>watch <code>rebuild</code> (thêm <code>dayjs</code>)</td><td>6,5 s</td><td><code>npm ci</code> ở một tầng mới, rồi tạo lại container</td></tr>
</table>
<div class="out">phiên bản 2: 4729 ms  → phiên bản 2 (tiến trình bật lúc 00:21:35.607)
phiên bản 3: 4681 ms  → phiên bản 3 (tiến trình bật lúc 00:21:41.790)
…
phiên bản 10: 1677 ms  → phiên bản 10 (tiến trình bật lúc 00:22:19.020)
phiên bản 11: 1682 ms  → phiên bản 11 (tiến trình bật lúc 00:22:22.201)
…
phiên bản 41: 665 ms  → phiên bản 41 (tiến trình bật lúc 00:27:03.287)
phiên bản 42: 630 ms  → phiên bản 42 (tiến trình bật lúc 00:27:05.411)
…
phiên bản 51: 326 ms  → phiên bản 51 (tiến trình bật lúc 00:27:33.198)
phiên bản 52: 320 ms  → phiên bản 52 (tiến trình bật lúc 00:27:35.011)</div>
<p>Dòng đầu tiên là bài học về PID 1 của Chương 1 hiện ra trong vòng lặp hằng ngày của bạn: restart là một lần dừng, dừng thì gửi SIGTERM, và Node làm PID 1 mà không có hàm xử lý thì phớt lờ nó — nên Docker chờ (khoảng ba giây trên Docker Desktop) rồi mới giết. Đúng một dòng, <code>init: true</code>, cắt gần ba giây khỏi mỗi lần lưu.</p>
<p>Rồi tới chuyện bất ngờ. Đổi sang <code>action: sync</code> với <code>command: ["node", "--watch", "src/server.js"]</code> thì chạy đúng một lần — 894 ms — rồi không bao giờ nữa:</p>
<div class="out">phiên bản 20: 894 ms  → phiên bản 20 (tiến trình bật lúc 00:22:48.000)
phiên bản 21: 20021 ms  → TIMEOUT
phiên bản 22: 20022 ms  → TIMEOUT
phiên bản 23: 20004 ms  → TIMEOUT
phiên bản 24: 20005 ms  → TIMEOUT</div>
<p>File bên trong container <em>có</em> được cập nhật mỗi lần (<code>docker compose exec api cat src/msg.js</code> in ra phiên bản 24). Một trình theo dõi tí hon đặt trong container giải thích lý do: mỗi lần đồng bộ tới dưới dạng một cú <em>đổi tên</em> (rename) — Compose ghi một file mới rồi tráo vào — và trình theo dõi bám vào một file cụ thể thì mất dấu nó sau cú tráo đầu tiên, còn trình theo dõi bám vào <em>thư mục</em> thì vẫn thấy sự kiện.</p>
<div class="out">1790209486588 file change msg.js
1790209486595 file rename msg.js
1790209486595 file rename msg.js
1790209486596 dir rename msg.js
1790209486596 dir rename msg.js
1790209486596 dir change msg.js
1790209486596 dir change msg.js
1790209488383 dir rename msg.js
1790209488384 dir rename msg.js
1790209488384 dir change msg.js
1790209488384 dir change msg.js
1790209490396 dir rename msg.js
1790209490397 dir rename msg.js
1790209490397 dir change msg.js
1790209490397 dir change msg.js</div>
<p>Sau lần đồng bộ đầu chỉ còn sự kiện <code>dir</code>. <code>node --watch</code> (và cả <code>--watch-path</code>, đã thử) bám theo từng file nên bị điếc; <code>nodemon</code> theo dõi thư mục và lần nào cũng nạp lại, khoảng 0,65 s. Đây đúng là loại chuyện chạy ngon trong bài hướng dẫn rồi "tự nhiên hết chạy" trong dự án của bạn.</p>
<div class="pitfall co-tieu-de"><strong>Nạp lại được một lần, rồi không bao giờ nữa.</strong> Với <code>docker compose watch</code> + <code>action: sync</code>, hãy ghép với một trình theo dõi dựa trên thư mục (nodemon, <code>next dev</code>, <code>vite</code>) — đừng dùng <code>node --watch</code>, vì trong phép thử của khoá (Compose v5.5.1, Node 22.23, Docker Desktop 4.91) nó chỉ bắt được lần sửa đầu tiên. Với bind mount thường trên Docker Desktop thì <code>node --watch</code> lần nào cũng chạy. Khi việc nạp lại im lặng ngừng, hãy kiểm file bên trong container trước (<code>docker compose exec api cat …</code>): file mới mà tiến trình cũ thì lỗi nằm ở trình theo dõi, không phải ở khâu đồng bộ.</div>
<p><strong>Nên dùng cách nào?</strong> Trên Linux (máy nhà, VPS), bind mount đơn giản và nhanh nhất. Trên Mac và Windows nó cũng ổn cho dự án vài trăm file nguồn, miễn là <code>node_modules</code> nằm trong volume. <code>compose watch</code> xứng đáng khi bạn muốn hệ thống file của container là của riêng nó (không lẫn <code>node_modules</code> của máy, không đụng quyền file) và khi bạn muốn được <code>rebuild</code> miễn phí mỗi lần đổi <code>package.json</code>.</p>

<h3>Debugger bên trong container</h3>
${slide('dk-13', 14, 'Debugger: 0.0.0.0 bên trong, 127.0.0.1 bên ngoài')}
<p>Inspector (bộ gỡ lỗi tích hợp) của Node nghe ở cổng 9229. Cái bẫy là địa chỉ mặc định: <code>--inspect</code> nghĩa là <code>127.0.0.1:9229</code>, mà bên trong container thì 127.0.0.1 là chính container đó (Chương 8). Mở cổng thì đưa lưu lượng tới card mạng của container, nơi chẳng ai nghe:</p>
<pre><code class="language-bash">docker run -d --rm --name dk13-dbg-sai -p 127.0.0.1:18132:9229 -p 18133:3000 \\
  dk13-watch-api:dev node --inspect src/server.js
docker logs dk13-dbg-sai 2&gt;&amp;1 | head -1
curl -sS localhost:18132/json/list</code></pre>
<div class="out">Debugger listening on ws://127.0.0.1:9229/c9d3dbf6-4740-4b39-8c85-cce24e28dea7
curl: (52) Empty reply from server</div>
<p>Cho inspector nghe mọi card mạng <em>bên trong</em> container, và giới hạn nó ở loopback <em>bên ngoài</em>:</p>
<pre><code class="language-bash">docker run -d --rm --name dk13-dbg -p 127.0.0.1:18132:9229 -p 18133:3000 \\
  -v "$PWD":/app -w /app node:22-alpine node --inspect=0.0.0.0:9229 server.js
curl -sS localhost:18132/json/list
docker port dk13-dbg</code></pre>
<div class="out">[ {
  "description": "node.js instance",
  …
  "title": "server.js",
  "type": "node",
  "url": "file:///app/server.js",
  "webSocketDebuggerUrl": "ws://localhost:18132/5806d3ee-a4d3-46ff-9903-4e06fe2c18d9"
} ]

3000/tcp -&gt; 0.0.0.0:18133
3000/tcp -&gt; [::]:18133
9229/tcp -&gt; 127.0.0.1:18132</div>
<table>
<tr><th>Mảnh ghép</th><th>Vì sao</th></tr>
<tr><td><code>--inspect=0.0.0.0:9229</code></td><td>Nghe trên card mạng của container, để lưu lượng từ cổng đã mở tới được</td></tr>
<tr><td><code>-p 127.0.0.1:18132:9229</code></td><td>Chỉ mở trên loopback của máy bạn — không bao giờ ra mạng LAN</td></tr>
<tr><td><code>--inspect-brk</code> (biến thể)</td><td>Dừng ở dòng đầu tiên cho tới khi debugger gắn vào — cho lỗi xảy ra lúc khởi động</td></tr>
</table>
<p>Giờ gắn vào (attach). Cấu hình <em>Attach</em> của VS Code cần hai thiết lập đường dẫn để một breakpoint trong <code>src/server.js</code> trên đĩa của bạn khớp với <code>/app/src/server.js</code> trong container:</p>
<pre><code class="language-json">{
  "type": "node",
  "request": "attach",
  "name": "Gắn vào container",
  "address": "localhost",
  "port": 9229,
  "localRoot": "&#36;{workspaceFolder}",
  "remoteRoot": "/app"
}</code></pre>
<p>Không có VS Code thì debugger dòng lệnh có sẵn của Node cũng chứng minh được y như vậy. Ở đây với một handler hai dòng, breakpoint ở dòng 4, và một request gửi từ terminal khác:</p>
<pre><code class="language-bash">node inspect localhost:18132
debug&gt; setBreakpoint('/app/server.js', 4)
<span class="tok-comment"># terminal khác: curl localhost:18133/</span></code></pre>
<div class="out">debug&gt; break in /app/server.js:4
  2 http.createServer((req, res) =&gt; {
  3   const tong = [1, 2, 3].reduce((a, b) =&gt; a + b, 0);
&gt; 4   res.end(&#96;tong = &#36;{tong}\\n&#96;);
  5 }).listen(3000, () =&gt; console.log('API nghe cổng 3000'));
  6
debug&gt; 6
debug&gt; 'GET /'
debug&gt; 1</div>
<p>Ba câu trả lời là của <code>exec tong</code>, <code>exec req.method + ' ' + req.url</code> và <code>exec process.pid</code>. Câu cuối là một lời nhắc nhỏ: app là PID 1 trong container của nó — đó là lý do cú restart lúc nãy phải chờ SIGTERM.</p>
<div class="callout danger"><strong>Không bao giờ mở 9229 ra mạng.</strong> Giao thức inspector chạy được bất kỳ đoạn JavaScript nào trong tiến trình của bạn. <code>-p 9229:9229</code> (thiếu <code>127.0.0.1:</code>) trên laptop ở quán cà phê hay Wi-Fi của trường là trao cho mọi người trong mạng đó một cái shell từ xa vào app của bạn — còn trên VPS thì là cho cả Internet. Để quên <code>--inspect</code> trong file compose production cũng vậy.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> container API của nhóm báo <code>Up</code> nhưng request nào cũng lỗi, và mỗi lần sửa mã phải năm giây mới thấy. Hãy tái hiện cả hai vấn đề rồi sửa.</p><ol>
<li>Trong <code>~/thu-docker/watch</code>, tạo một app Express tí hon (<code>package.json</code> có <code>express</code>, <code>src/server.js</code>, <code>src/msg.js</code>) và Dockerfile ba dòng như trong bài. KHÔNG chạy <code>npm install</code> trên máy bạn.</li>
<li>Chạy nó chỉ với <code>-v .:/app</code> và đọc log; sau đó thêm <code>- /app/node_modules</code> và xác nhận endpoint trả lời.</li>
<li>Chuyển sang <code>docker compose watch</code> với <code>sync+restart</code>, không <code>init</code>. Bấm giờ ba lần lưu (đồng hồ bấm giờ là đủ). Thêm <code>init: true</code> rồi bấm giờ lại.</li>
<li>Đổi luật thành <code>action: sync</code> với <code>node --watch</code>, lưu hai lần, xem lần lưu thứ hai ra sao. Thay lệnh bằng <code>npx nodemon --watch src src/server.js</code> rồi thử lại.</li>
<li>Dọn dẹp: <code>docker compose down -v</code>.</li></ol>
<p><strong>Đạt khi:</strong> sổ ghi của bạn có lỗi <code>Cannot find module</code> và cách sửa, thời gian trước/sau khi thêm <code>init: true</code>, và một câu giải thích vì sao <code>node --watch</code> ngừng nạp lại còn nodemon thì không.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hot reload (nạp lại nóng)</span><span class="v">Thấy thay đổi mã trong app đang chạy mà không phải build lại image.</span></div>
  <div class="kv"><span class="k">Bind mount shadowing (bị mount che)</span><span class="v">Một mount giấu mọi thứ image có ở đường dẫn đó; mount dài hơn, cụ thể hơn thì phủ lại được.</span></div>
  <div class="kv"><span class="k">compose watch (theo dõi của Compose)</span><span class="v"><code>docker compose watch</code> + <code>develop.watch</code>: sync, sync+restart hoặc rebuild khi file đổi.</span></div>
  <div class="kv"><span class="k">inotify (thông báo đổi file)</span><span class="v">Cơ chế của nhân Linux báo file vừa đổi — nodemon, <code>next dev</code> và các trình tương tự dựa vào nó.</span></div>
  <div class="kv"><span class="k">Native module (gói có mã máy)</span><span class="v">Gói npm chứa mã đã biên dịch cho một hệ điều hành + CPU (esbuild, bcrypt, sharp, engine Prisma).</span></div>
  <div class="kv"><span class="k">Inspector / attach (gắn debugger)</span><span class="v">Cổng gỡ lỗi của Node (9229); debugger <em>gắn</em> vào tiến trình đang chạy qua cổng này.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mã mới tới container bằng bind mount (trực tiếp, tức thì) hoặc bằng <code>compose watch</code> (chép vào); sau đó phải có trình theo dõi bên trong nạp lại.</li>
<li>Bind mount đè lên <code>/app</code> giấu mất <code>node_modules</code> của image; thêm volume ẩn danh <code>/app/node_modules</code>.</li>
<li><code>node_modules</code> cài trên máy Mac hay Windows làm hỏng gói native trong Linux — hãy cài bên trong container.</li>
<li>Với <code>sync+restart</code>, <code>init: true</code> cắt mỗi lần lưu từ 4,7 s còn 1,67 s; với <code>sync</code>, dùng trình theo dõi thư mục như nodemon.</li>
<li>Gỡ lỗi bằng <code>--inspect=0.0.0.0:9229</code> bên trong và <code>-p 127.0.0.1:9229:9229</code> bên ngoài, cộng <code>localRoot</code>/<code>remoteRoot</code> trong VS Code.</li>
<li>Không bao giờ để 9229 lộ ra ngoài loopback: inspector chạy được mã tuỳ ý.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/compose/how-tos/file-watch/" target="_blank" rel="noopener">
  <span class="lc-ico">👀</span>
  <span class="lc-body"><span class="lc-title">Use Compose Watch</span><span class="lc-sub">Ba hành động, các yêu cầu với container (<code>stat</code>, <code>mkdir</code>, thư mục đích ghi được) và luật <code>ignore</code>.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/compose-file/develop/" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">Compose Develop Specification</span><span class="lc-sub">Cấu trúc chính xác của <code>develop.watch</code>, gồm cả <code>initial_sync</code> và móc <code>exec</code>.</span></span>
</a>
<a class="link-card" href="https://nodejs.org/en/learn/getting-started/debugging" target="_blank" rel="noopener">
  <span class="lc-ico">🐞</span>
  <span class="lc-body"><span class="lc-title">Debugging Node.js</span><span class="lc-sub">Các cờ inspector, vì sao nghe trên địa chỉ công khai là nguy hiểm, và những trình nào gắn vào được.</span></span>
</a>
<a class="link-card" href="https://code.visualstudio.com/docs/nodejs/nodejs-debugging" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Node.js debugging in VS Code</span><span class="lc-sub">Cấu hình Attach, <code>localRoot</code>/<code>remoteRoot</code> và gỡ lỗi từ xa.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trong Code Lab: Docker</span><span class="lc-sub">Các bài tập Docker có chấm điểm để tay luôn quen lệnh.</span></span>
</a>

<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> File đổi mới là một nửa; phải có thứ bên trong nhận ra, và file tới bằng đường nào (bind mount hay chép-rồi-đổi-tên) quyết định trình theo dõi nào nhận ra. Bind mount che <code>node_modules</code> của image, còn <code>node_modules</code> của máy bạn thì hỏng trong Linux — giữ bản của container trong volume. Và debugger cần 0.0.0.0 bên trong, 127.0.0.1 bên ngoài.</p>
</div>
`,
    },
    /* ─────────────────────────── 13.3 ─────────────────────────── */
    {
      title: '13.3 — Real services for tests: throwaway Postgres, Testcontainers and CI|||13.3 — Dịch vụ thật cho test: Postgres dùng-một-lần, Testcontainers và CI',
      slug: 'dk-13-3-db-that-cho-test',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Chạy test tích hợp trên Postgres/Redis thật dùng-một-lần: --rm, tmpfs (đo thật: nhanh 15,7× trên Linux, không hơn trên Mac), healthcheck chờ đúng lần khởi động thứ hai, seed qua /docker-entrypoint-initdb.d, compose up --wait, Testcontainers cho Node và service container trong GitHub Actions.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.3</span>
<h2>Real services for tests: throwaway Postgres, Testcontainers and CI</h2>
<p class="lead">The clinic-booking app your team builds has one rule that matters more than any other: a doctor cannot have two appointments at the same time. In the database that rule is a <code>UNIQUE (bac_si, bat_dau)</code> constraint. A unit test with a mocked database cannot check it — the mock returns whatever you told it to. Only a real PostgreSQL can say <code>23505 unique_violation</code>. Before Docker, "a real PostgreSQL for tests" meant a shared server everyone polluted, or an install on each laptop. Now it means a container that lives for thirty seconds.</p>
<p>This lesson builds that container three ways — by hand, with a compose file, and from inside the test code with Testcontainers — measures what <code>tmpfs</code> really buys you, and fixes the startup race that makes integration tests "flaky".</p>

<h3>The shape of a throwaway test database</h3>
${slide('dk-13', 15, 'Test tích hợp cần Postgres THẬT — dùng một lần rồi vứt')}
<p>Every good setup has the same four steps: <strong>start</strong> a fresh database and wait until it really accepts connections; <strong>seed</strong> it with the schema and a little known data; <strong>run</strong> the tests against it; <strong>throw it away</strong> so the next run starts clean. The single command version:</p>
<pre><code class="language-bash">docker run -d --rm --name pg-test \\
  -e POSTGRES_PASSWORD=test \\
  -p 127.0.0.1:5433:5432 \\
  --tmpfs /var/lib/postgresql/data \\
  postgres:16-alpine</code></pre>
<table>
<tr><th>Flag</th><th>Why it is there</th></tr>
<tr><td><code>--rm</code></td><td>Delete the container (and its anonymous volumes) the moment it stops — nothing left behind</td></tr>
<tr><td><code>-e POSTGRES_PASSWORD=test</code></td><td>The official image refuses to initialise without a password</td></tr>
<tr><td><code>-p 127.0.0.1:5433:5432</code></td><td>Loopback only, and 5433 so it never collides with your dev database on 5432</td></tr>
<tr><td><code>--tmpfs /var/lib/postgresql/data</code></td><td>The data directory lives in RAM: no disk writes, and no anonymous volume for the image's <code>VOLUME</code></td></tr>
<tr><td><code>postgres:16-alpine</code></td><td>Pin the <strong>same major version</strong> as production — a test on 17 proves little about 16</td></tr>
</table>
<p>The <code>--tmpfs</code> line has a bonus you can verify: the postgres image declares <code>VOLUME /var/lib/postgresql/data</code>, which normally creates an anonymous volume (the "lost data" of Chapter 1). With a tmpfs mounted at that exact path, Docker creates none:</p>
<pre><code class="language-bash">docker inspect dk13-itest-db-1 --format '{{range .Mounts}}{{.Type}} {{.Destination}}{{"\\n"}}{{end}}{{json .HostConfig.Tmpfs}}'</code></pre>
<div class="out">bind /docker-entrypoint-initdb.d
{"/var/lib/postgresql/data":""}</div>
<p>How long does a fresh one take? Measured three times each on the Mac, from <code>docker run</code> until <code>pg_isready</code> said yes over the Unix socket and over TCP:</p>
<div class="out">tmpfs: socket sẵn sàng sau 0.78s · TCP sẵn sàng sau 0.98s
tmpfs: socket sẵn sàng sau 0.65s · TCP sẵn sàng sau 0.90s
tmpfs: socket sẵn sàng sau 0.67s · TCP sẵn sàng sau 0.86s
vol: socket sẵn sàng sau 0.80s · TCP sẵn sàng sau 0.99s
vol: socket sẵn sàng sau 0.82s · TCP sẵn sàng sau 1.01s
vol: socket sẵn sàng sau 0.81s · TCP sẵn sàng sau 1.01s</div>
<p>Under a second either way, which kills the old excuse that "spinning up a database per test run is too slow". Look closely, though: the socket was "ready" about 0.2 s <em>before</em> TCP. That gap is the next section.</p>

<h3>Postgres starts twice — wait for the second one</h3>
${slide('dk-13', 16, 'Postgres khởi động HAI lần — hãy chờ lần thứ hai')}
<pre><code class="language-bash">docker logs dk13-pglog 2&gt;&amp;1 | grep -nE "ready to accept|shutting down|listening on|PostgreSQL init process complete|shut down"</code></pre>
<div class="out">31:2026-09-24 00:31:21.660 UTC [42] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
32:2026-09-24 00:31:21.661 UTC [45] LOG:  database system was shut down at 2026-09-24 00:31:21 UTC
33:2026-09-24 00:31:21.663 UTC [42] LOG:  database system is ready to accept connections
39:waiting for server to shut down....2026-09-24 00:31:21.766 UTC [42] LOG:  received fast shutdown request
42:2026-09-24 00:31:21.768 UTC [43] LOG:  shutting down
45:2026-09-24 00:31:21.772 UTC [42] LOG:  database system is shut down
49:PostgreSQL init process complete; ready for start up.
52:2026-09-24 00:31:21.879 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
53:2026-09-24 00:31:21.879 UTC [1] LOG:  listening on IPv6 address "::", port 5432
54:2026-09-24 00:31:21.881 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
55:2026-09-24 00:31:21.882 UTC [56] LOG:  database system was shut down at 2026-09-24 00:31:21 UTC
56:2026-09-24 00:31:21.884 UTC [1] LOG:  database system is ready to accept connections</div>
<p>Read the process IDs in square brackets. On first start the image's entrypoint runs a <strong>temporary</strong> server (PID 42) that listens only on the Unix socket, runs your seed scripts against it, shuts it down, and then starts the <strong>real</strong> server (PID 1) on port 5432. "Ready to accept connections" appears twice, 220 ms apart. A healthcheck of <code>pg_isready -U postgres</code> talks over the socket, so it can say "ready" during the temporary phase — and your test, which connects over TCP, gets <code>ECONNREFUSED</code> or finds the seed half-applied. Forcing TCP makes the check honest:</p>
<pre><code class="language-yaml">healthcheck:
  test: ["CMD", "pg_isready", "-h", "127.0.0.1", "-U", "postgres", "-d", "phongkham"]
  interval: 1s
  timeout: 2s
  retries: 30</code></pre>
<p>The short <code>interval</code> matters too: the default is 30 s, which means Compose would not even look for the first half-minute. For tests, poll every second.</p>

<h3>How much does tmpfs really help?</h3>
${slide('dk-13', 17, 'tmpfs: nhanh 15× trên Linux — không khác gì trên Mac')}
<p>Every blog says "put the test database on tmpfs, it is much faster". Measured with <code>pgbench</code> — 8 seconds, one client, the default TPC-B-like workload where every transaction ends with a <code>COMMIT</code> — on three setups per machine:</p>
<pre><code class="language-bash">docker exec pgb pgbench -U postgres -h 127.0.0.1 -i -s 5 -q postgres
docker exec pgb pgbench -U postgres -h 127.0.0.1 -n -c 1 -T 8 postgres</code></pre>
<div class="out"><span class="tok-comment"># Linux (Fedora, NVMe, Docker Engine 29.6)</span>
== tmpfs
latency average = 0.136 ms
tps = 7327.571657 (without initial connection time)
== vol
latency average = 2.139 ms
tps = 467.508824 (without initial connection time)
== nofsync
latency average = 0.139 ms
tps = 7214.002746 (without initial connection time)
<span class="tok-comment"># Mac (Docker Desktop 4.91)</span>
== tmpfs
latency average = 0.472 ms
tps = 2119.902707 (without initial connection time)
== vol
latency average = 0.364 ms
tps = 2744.686405 (without initial connection time)
== nofsync
latency average = 0.475 ms
tps = 2103.108054 (without initial connection time)</div>
<p>On Linux, tmpfs is <strong>15.7 times</strong> faster than a volume on an NVMe drive: each <code>COMMIT</code> waits for the disk to confirm the write (<code>fsync</code>), and RAM has nothing to wait for. The third row proves that fsync is the whole story — keeping the volume but starting Postgres with <code>-c fsync=off -c synchronous_commit=off -c full_page_writes=off</code> gives the same speed as tmpfs. On the Mac, there is <strong>no</strong> gain: the Docker Desktop VM's virtual disk answers fsync quickly, so the volume was even a little faster. The honest conclusion: tmpfs matters where your tests run most — CI runners are Linux — and hardly at all on your MacBook. Either trick is for tests only; the PostgreSQL manual lists these settings under "non-durable" for a reason.</p>

<h3>Run it step by step: compose file, seed, test, tear down</h3>
${slide('dk-13', 18, 'compose.test.yaml + node --test: từ số 0 tới test xanh')}
<p>A team needs this in a file, not in someone's shell history. The seed goes in a folder mounted at <code>/docker-entrypoint-initdb.d</code>: the image runs every <code>.sql</code> and <code>.sh</code> there, in name order, <strong>only when the data directory is empty</strong> — which with tmpfs is every time.</p>
<pre><code class="language-sql"><span class="tok-comment">-- seed/01-schema.sql</span>
CREATE TABLE lich_hen (
  id        serial PRIMARY KEY,
  bac_si    text NOT NULL,
  bat_dau   timestamptz NOT NULL,
  UNIQUE (bac_si, bat_dau)
);
INSERT INTO lich_hen (bac_si, bat_dau) VALUES ('bs-an', '2026-10-01 09:00+07');</code></pre>
<pre><code class="language-yaml"><span class="tok-comment"># compose.test.yaml</span>
name: dk13-itest
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: test
      POSTGRES_DB: phongkham
    ports: ["127.0.0.1:18135:5432"]
    tmpfs: [/var/lib/postgresql/data]
    volumes:
      - ./seed:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD", "pg_isready", "-h", "127.0.0.1", "-U", "postgres", "-d", "phongkham"]
      interval: 1s
      timeout: 2s
      retries: 30</code></pre>
<pre><code class="language-js">// test/lichhen.test.mjs — Node's built-in test runner, no framework
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';

const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
before(() =&gt; db.connect());
after(() =&gt; db.end());

test('dữ liệu seed có mặt', async () =&gt; {
  const { rows } = await db.query('SELECT count(*)::int AS n FROM lich_hen');
  assert.equal(rows[0].n, 1);
});

test('không cho đặt trùng giờ cùng bác sĩ', async () =&gt; {
  await assert.rejects(
    db.query("INSERT INTO lich_hen (bac_si, bat_dau) VALUES ('bs-an', '2026-10-01 09:00+07')"),
    { code: '23505' },   // unique_violation — a real Postgres constraint
  );
});</code></pre>
<pre><code class="language-bash">time (docker compose -f compose.test.yaml up -d --wait 2&gt;&amp;1)
DATABASE_URL=postgres://postgres:test@127.0.0.1:18135/phongkham \\
  node --test --test-reporter=spec test/lichhen.test.mjs
docker compose -f compose.test.yaml down</code></pre>
<div class="out"> Network dk13-itest_default Creating
 Network dk13-itest_default Creating
 Network dk13-itest_default Created
 Network dk13-itest_default Created
 Container dk13-itest-db-1 Creating
 Container dk13-itest-db-1 Created
 Container dk13-itest-db-1 Starting
 Container dk13-itest-db-1 Started
 Container dk13-itest-db-1 Waiting
 Container dk13-itest-db-1 Healthy
( docker compose -f compose.test.yaml up -d --wait 2&gt;&amp;1; )  0.06s user 0.04s system 5% cpu 1.794 total
✔ dữ liệu seed có mặt (12.106875ms)
✔ không cho đặt trùng giờ cùng bác sĩ (1.327125ms)
ℹ tests 2
ℹ suites 0
ℹ pass 2
ℹ fail 0
…
 Container dk13-itest-db-1 Removed
 Network dk13-itest_default Removed </div>
<p><code>up -d --wait</code> is the key flag: it returns only when every service with a healthcheck reports <em>healthy</em> (and fails if one never does), so the test command on the next line can trust the database. From nothing to green tests took 1.8 seconds plus 71 ms of tests. Put the three lines in <code>package.json</code> as <code>"test:int"</code> and the whole team runs the same thing.</p>
<p>Redis works the same way. Two server flags turn off both persistence mechanisms, so it never writes a byte to disk:</p>
<pre><code class="language-bash">docker run --rm -d --name redis-test -p 127.0.0.1:6380:6379 redis:7-alpine redis-server --save '' --appendonly no
docker exec redis-test redis-cli ping
docker exec redis-test redis-cli config get save</code></pre>
<div class="out">PONG
save
</div>
<p>(An empty value after <code>save</code> means "never snapshot". The image still declares a <code>/data</code> volume; <code>--rm</code> deletes it when the container stops — checked on the course's Mac.)</p>
<div class="pitfall co-tieu-de"><strong>"I changed the seed file and nothing happened."</strong> Init scripts in <code>/docker-entrypoint-initdb.d</code> run only when the data directory is <em>empty</em>. If your test database uses a named volume — often copied from the dev compose file — the second run finds an initialised database and silently skips every seed script, so tests run against last week's schema. Use tmpfs (or <code>down -v</code>) for test databases, and never "fix" a test database by hand: if it needs fixing, the seed is wrong.</div>

<h3>Testcontainers: the test starts its own database</h3>
${slide('dk-13', 19, 'Testcontainers: bộ test tự bật và tự dọn Postgres')}
<p>A compose file relies on someone (or a script) running <code>up</code> before the tests. Testcontainers moves that into the test code: a library that talks to the Docker API, starts a container before your tests, waits for it, hands you the connection string, and removes it afterwards. It exists for Java, Go, .NET, Python and Node.</p>
<pre><code class="language-bash">npm i -D pg testcontainers @testcontainers/postgresql</code></pre>
<pre><code class="language-js">import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import pg from 'pg';

let container, db;
before(async () =&gt; {
  const t0 = Date.now();
  container = await new PostgreSqlContainer('postgres:16-alpine')
    .withTmpFs({ '/var/lib/postgresql/data': 'rw' })
    .withCopyDirectoriesToContainer([{ source: './seed', target: '/docker-entrypoint-initdb.d' }])
    .start();
  console.log(&#96;Postgres sẵn sàng sau &#36;{Date.now() - t0} ms ở &#36;{container.getHost()}:&#36;{container.getPort()}&#96;);
  db = new pg.Client({ connectionString: container.getConnectionUri() });
  await db.connect();
});
after(async () =&gt; { await db?.end(); await container?.stop(); });
<span class="tok-comment">// …the same two tests as before…</span></code></pre>
<div class="out">Postgres sẵn sàng sau 1052 ms ở localhost:18136
✔ dữ liệu seed có mặt (1073.407833ms)
✔ không cho đặt trùng giờ cùng bác sĩ (2.594583ms)</div>
<p>Three details matter. First, the host port is <strong>random</strong> by default (our first run got <code>localhost:55003</code>); the course pinned it to 18136 with <code>.withExposedPorts({ container: 5432, host: 18136 })</code> plus <code>.withName()</code> and <code>.withLabels()</code> for its safety rules — in your own tests, keep it random so parallel test files never collide, and always read the port from <code>getPort()</code>. Second, it waits properly: the PostgreSQL module (version 12.1.0) uses a healthcheck running <code>pg_isready --host localhost</code> — TCP, the lesson above — combined with a check that the port is listening. Third, cleanup: besides your <code>stop()</code>, Testcontainers normally starts a helper container called <strong>Ryuk</strong> (<code>testcontainers/ryuk</code>) that deletes everything the test session created if the test process crashes. The course's runs turned it off with <code>TESTCONTAINERS_RYUK_DISABLED=true</code> to keep every container name under its own prefix; leave it on in your projects.</p>
<table>
<tr><th>Approach</th><th>Who starts the DB</th><th>Best when</th></tr>
<tr><td><code>compose.test.yaml</code> + <code>up --wait</code></td><td>You, or an npm script</td><td>One shared test DB, simple setup, same file as teammates</td></tr>
<tr><td>Testcontainers</td><td>The test code itself</td><td>Each test file gets its own DB; parallel runs; no "did you start the DB?"</td></tr>
<tr><td>CI service container</td><td>GitHub Actions</td><td>Inside CI only — next section</td></tr>
</table>

<h3>In CI: service containers</h3>
${slide('dk-13', 20, 'Trong CI: service container thay cho compose')}
<p>GitHub Actions has the same idea built in. Under a job's <code>services:</code>, the runner starts containers before the steps, waits for their healthchecks, and removes them when the job ends:</p>
<pre><code class="language-yaml">jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: phongkham
        ports: ["5432:5432"]
        options: &gt;-
          --health-cmd "pg_isready -h 127.0.0.1 -U postgres"
          --health-interval 2s
          --health-retries 20
          --tmpfs /var/lib/postgresql/data
    env:
      DATABASE_URL: postgres://postgres:test@localhost:5432/phongkham
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: psql "&#36;DATABASE_URL" -f seed/01-schema.sql
      - run: npm test</code></pre>
<p><code>options</code> is passed straight to <code>docker create</code>, which is how the health flags and <code>--tmpfs</code> get in. A service container cannot mount files from your repository before the checkout step runs, so the seed is applied by a step instead of <code>/docker-entrypoint-initdb.d</code>. This workflow was written for the lesson and not run on GitHub here; runners, caching and matrices are the subject of the <a href="/courses/github-actions">GitHub Actions course</a>. What makes it valuable is that the same seed and the same image run on your laptop through <code>compose.test.yaml</code>.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a teammate's pull request lets two patients book the same doctor at the same minute, and every unit test passed because the repository layer was mocked. Build a real-database test that would have caught it.</p><ol>
<li>In <code>~/thu-docker/itest</code>, create <code>seed/01-schema.sql</code> with the <code>lich_hen</code> table and its <code>UNIQUE</code> constraint, and <code>compose.test.yaml</code> using tmpfs, the seed folder and a <code>pg_isready -h 127.0.0.1</code> healthcheck (use port 5433 on loopback).</li>
<li><code>npm init -y &amp;&amp; npm i -D pg</code>, then write the two tests from this lesson.</li>
<li>Run <code>docker compose -f compose.test.yaml up -d --wait</code>, then the tests with <code>DATABASE_URL</code> set. Both must pass.</li>
<li>Remove the <code>UNIQUE</code> line from the seed, run <code>down</code> then <code>up -d --wait</code> again, and run the tests: the second one must now <em>fail</em>. Put the line back.</li>
<li>Clean up: <code>docker compose -f compose.test.yaml down</code> and check <code>docker volume ls -f dangling=true</code> shows nothing new.</li></ol>
<p><strong>Done when:</strong> the test goes red without the constraint and green with it, and you can explain why editing the seed took effect immediately (tmpfs: the data directory is empty on every start).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Integration test</span><span class="v">A test that runs your code against real dependencies (database, cache), not mocks.</span></div>
  <div class="kv"><span class="k">tmpfs</span><span class="v">A filesystem in RAM; mounted over the data directory it makes a database fast and disposable.</span></div>
  <div class="kv"><span class="k">fsync</span><span class="v">The call that waits until data is physically on disk; the cost tmpfs removes.</span></div>
  <div class="kv"><span class="k">/docker-entrypoint-initdb.d</span><span class="v">Folder whose <code>.sql</code>/<code>.sh</code> files run once, only when the data directory is empty.</span></div>
  <div class="kv"><span class="k">up --wait</span><span class="v">Compose returns only when every service with a healthcheck is healthy.</span></div>
  <div class="kv"><span class="k">Testcontainers / Ryuk</span><span class="v">A library that starts containers from test code; Ryuk is its cleanup helper for crashed runs.</span></div>
  <div class="kv"><span class="k">Service container</span><span class="v">A container GitHub Actions runs alongside a job, declared under <code>services:</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Constraints, types and migrations can only be tested against a real database; a container makes one in under a second.</li>
<li><code>--rm</code> + <code>--tmpfs /var/lib/postgresql/data</code> + a loopback port gives a clean, leak-free database every run.</li>
<li>Postgres starts twice on first boot; check readiness over TCP (<code>pg_isready -h 127.0.0.1</code>) and poll every second.</li>
<li>tmpfs was 15.7× faster on Linux (fsync) and no faster on the Mac — it pays off in CI.</li>
<li>Seed scripts run only on an empty data directory; <code>up -d --wait</code> makes the next command safe.</li>
<li>Testcontainers starts a database per test file on a random port; GitHub Actions does the same with <code>services:</code>.</li>
</ul>

<a class="link-card" href="https://hub.docker.com/_/postgres" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">postgres — Docker Official Image</span><span class="lc-sub">Environment variables, the initdb scripts folder and the "runs only on an empty data directory" rule.</span></span>
</a>
<a class="link-card" href="https://node.testcontainers.org/modules/postgresql/" target="_blank" rel="noopener">
  <span class="lc-ico">🧫</span>
  <span class="lc-body"><span class="lc-title">Testcontainers for Node — PostgreSQL module</span><span class="lc-sub">Starting, configuring and connecting to a disposable Postgres from test code.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Creating PostgreSQL service containers — GitHub Docs</span><span class="lc-sub">The official walkthrough of <code>services:</code>, health options and ports.</span></span>
</a>
<a class="link-card" href="https://www.postgresql.org/docs/current/non-durability.html" target="_blank" rel="noopener">
  <span class="lc-ico">⚠️</span>
  <span class="lc-body"><span class="lc-title">Non-Durable Settings — PostgreSQL manual</span><span class="lc-sub">What <code>fsync=off</code> and friends trade away, and why only for throwaway data.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practise in Code Lab: Docker</span><span class="lc-sub">Graded Docker exercises to keep your hands on the commands.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> A real database in a container costs about a second, so there is no excuse to test constraints against a mock. Wait for the second start — readiness over TCP, polled every second, and <code>up --wait</code>. And tmpfs is a Linux/CI speed-up, not a Mac one: measure before you believe a blog.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.3</span>
<h2>Dịch vụ thật cho test: Postgres dùng-một-lần, Testcontainers và CI</h2>
<p class="lead">App đặt lịch phòng khám mà nhóm bạn làm có một luật quan trọng hơn mọi luật khác: một bác sĩ không thể có hai lịch hẹn cùng một lúc. Trong cơ sở dữ liệu, luật đó là ràng buộc <code>UNIQUE (bac_si, bat_dau)</code>. Một unit test với cơ sở dữ liệu giả (mock) không kiểm được nó — đồ giả trả về đúng thứ bạn bảo nó trả. Chỉ một PostgreSQL thật mới nói được <code>23505 unique_violation</code>. Trước Docker, "một PostgreSQL thật cho test" nghĩa là một server dùng chung mà ai cũng làm bẩn, hoặc cài một bản trên từng laptop. Giờ nó nghĩa là một container sống ba mươi giây.</p>
<p>Bài này dựng container đó theo ba cách — bằng tay, bằng file compose, và từ chính mã test với Testcontainers — đo xem <code>tmpfs</code> thật ra mua được gì, và sửa cuộc chạy đua lúc khởi động làm test tích hợp (integration test) "lúc được lúc không".</p>

<h3>Hình dạng của một cơ sở dữ liệu test dùng-một-lần</h3>
${slide('dk-13', 15, 'Test tích hợp cần Postgres THẬT — dùng một lần rồi vứt')}
<p>Mọi cách làm tốt đều có đúng bốn bước: <strong>bật</strong> một cơ sở dữ liệu mới tinh và chờ tới khi nó thật sự nhận kết nối; <strong>seed</strong> (nạp dữ liệu mẫu) — schema và một ít dữ liệu biết trước; <strong>chạy</strong> test trên nó; <strong>vứt đi</strong> để lần sau bắt đầu sạch. Bản một lệnh:</p>
<pre><code class="language-bash">docker run -d --rm --name pg-test \\
  -e POSTGRES_PASSWORD=test \\
  -p 127.0.0.1:5433:5432 \\
  --tmpfs /var/lib/postgresql/data \\
  postgres:16-alpine</code></pre>
<table>
<tr><th>Cờ</th><th>Vì sao có nó</th></tr>
<tr><td><code>--rm</code></td><td>Xoá container (cùng volume ẩn danh của nó) ngay khi nó dừng — không để lại gì</td></tr>
<tr><td><code>-e POSTGRES_PASSWORD=test</code></td><td>Image chính thức từ chối khởi tạo nếu không có mật khẩu</td></tr>
<tr><td><code>-p 127.0.0.1:5433:5432</code></td><td>Chỉ trên loopback, và cổng 5433 để không bao giờ đụng CSDL dev ở 5432</td></tr>
<tr><td><code>--tmpfs /var/lib/postgresql/data</code></td><td>Thư mục dữ liệu nằm trong RAM: không ghi đĩa, và không có volume ẩn danh cho chỉ thị <code>VOLUME</code> của image</td></tr>
<tr><td><code>postgres:16-alpine</code></td><td>Ghim <strong>cùng phiên bản chính</strong> với production — test trên 17 chẳng chứng minh được mấy về 16</td></tr>
</table>
<p>Dòng <code>--tmpfs</code> có một phần thưởng kiểm được: image postgres khai <code>VOLUME /var/lib/postgresql/data</code>, bình thường sẽ tạo một volume ẩn danh (cái "dữ liệu biến mất" của Chương 1). Khi một tmpfs được gắn đúng vào đường dẫn đó, Docker không tạo volume nào:</p>
<pre><code class="language-bash">docker inspect dk13-itest-db-1 --format '{{range .Mounts}}{{.Type}} {{.Destination}}{{"\\n"}}{{end}}{{json .HostConfig.Tmpfs}}'</code></pre>
<div class="out">bind /docker-entrypoint-initdb.d
{"/var/lib/postgresql/data":""}</div>
<p>Một bản mới tinh mất bao lâu? Đo ba lần mỗi kiểu trên Mac, từ lúc <code>docker run</code> tới khi <code>pg_isready</code> báo có qua Unix socket và qua TCP:</p>
<div class="out">tmpfs: socket sẵn sàng sau 0.78s · TCP sẵn sàng sau 0.98s
tmpfs: socket sẵn sàng sau 0.65s · TCP sẵn sàng sau 0.90s
tmpfs: socket sẵn sàng sau 0.67s · TCP sẵn sàng sau 0.86s
vol: socket sẵn sàng sau 0.80s · TCP sẵn sàng sau 0.99s
vol: socket sẵn sàng sau 0.82s · TCP sẵn sàng sau 1.01s
vol: socket sẵn sàng sau 0.81s · TCP sẵn sàng sau 1.01s</div>
<p>Dưới một giây với cả hai kiểu, và thế là hết lý do cũ "mỗi lần chạy test bật một cơ sở dữ liệu thì chậm quá". Nhưng nhìn kỹ: socket "sẵn sàng" sớm hơn TCP khoảng 0,2 s. Khoảng hở đó là mục tiếp theo.</p>

<h3>Postgres khởi động HAI lần — hãy chờ lần thứ hai</h3>
${slide('dk-13', 16, 'Postgres khởi động HAI lần — hãy chờ lần thứ hai')}
<pre><code class="language-bash">docker logs dk13-pglog 2&gt;&amp;1 | grep -nE "ready to accept|shutting down|listening on|PostgreSQL init process complete|shut down"</code></pre>
<div class="out">31:2026-09-24 00:31:21.660 UTC [42] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
32:2026-09-24 00:31:21.661 UTC [45] LOG:  database system was shut down at 2026-09-24 00:31:21 UTC
33:2026-09-24 00:31:21.663 UTC [42] LOG:  database system is ready to accept connections
39:waiting for server to shut down....2026-09-24 00:31:21.766 UTC [42] LOG:  received fast shutdown request
42:2026-09-24 00:31:21.768 UTC [43] LOG:  shutting down
45:2026-09-24 00:31:21.772 UTC [42] LOG:  database system is shut down
49:PostgreSQL init process complete; ready for start up.
52:2026-09-24 00:31:21.879 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
53:2026-09-24 00:31:21.879 UTC [1] LOG:  listening on IPv6 address "::", port 5432
54:2026-09-24 00:31:21.881 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
55:2026-09-24 00:31:21.882 UTC [56] LOG:  database system was shut down at 2026-09-24 00:31:21 UTC
56:2026-09-24 00:31:21.884 UTC [1] LOG:  database system is ready to accept connections</div>
<p>Đọc các mã tiến trình trong ngoặc vuông. Ở lần khởi động đầu, entrypoint của image chạy một server <strong>TẠM</strong> (PID 42) chỉ nghe trên Unix socket, chạy các script seed của bạn trên nó, tắt nó đi, rồi mới bật server <strong>THẬT</strong> (PID 1) ở cổng 5432. "Ready to accept connections" xuất hiện hai lần, cách nhau 220 ms. Một healthcheck <code>pg_isready -U postgres</code> nói chuyện qua socket, nên nó có thể báo "sẵn sàng" ngay trong giai đoạn tạm — và test của bạn, vốn nối qua TCP, nhận <code>ECONNREFUSED</code> hoặc thấy seed mới chạy được một nửa. Ép đi TCP làm phép kiểm trung thực:</p>
<pre><code class="language-yaml">healthcheck:
  test: ["CMD", "pg_isready", "-h", "127.0.0.1", "-U", "postgres", "-d", "phongkham"]
  interval: 1s
  timeout: 2s
  retries: 30</code></pre>
<p><code>interval</code> ngắn cũng quan trọng: mặc định là 30 s, nghĩa là suốt nửa phút đầu Compose còn chưa thèm nhìn. Với test, hỏi mỗi giây một lần.</p>

<h3>tmpfs thật ra giúp được bao nhiêu?</h3>
${slide('dk-13', 17, 'tmpfs: nhanh 15× trên Linux — không khác gì trên Mac')}
<p>Blog nào cũng bảo "đặt CSDL test lên tmpfs, nhanh hơn nhiều". Đo bằng <code>pgbench</code> (công cụ đo tải có sẵn của Postgres) — 8 giây, một client, tải mặc định kiểu TPC-B mà giao dịch nào cũng kết thúc bằng <code>COMMIT</code> — trên ba cấu hình mỗi máy:</p>
<pre><code class="language-bash">docker exec pgb pgbench -U postgres -h 127.0.0.1 -i -s 5 -q postgres
docker exec pgb pgbench -U postgres -h 127.0.0.1 -n -c 1 -T 8 postgres</code></pre>
<div class="out"><span class="tok-comment"># Linux (Fedora, NVMe, Docker Engine 29.6)</span>
== tmpfs
latency average = 0.136 ms
tps = 7327.571657 (without initial connection time)
== vol
latency average = 2.139 ms
tps = 467.508824 (without initial connection time)
== nofsync
latency average = 0.139 ms
tps = 7214.002746 (without initial connection time)
<span class="tok-comment"># Mac (Docker Desktop 4.91)</span>
== tmpfs
latency average = 0.472 ms
tps = 2119.902707 (without initial connection time)
== vol
latency average = 0.364 ms
tps = 2744.686405 (without initial connection time)
== nofsync
latency average = 0.475 ms
tps = 2103.108054 (without initial connection time)</div>
<p>Trên Linux, tmpfs nhanh hơn volume trên ổ NVMe <strong>15,7 lần</strong>: mỗi <code>COMMIT</code> chờ đĩa xác nhận đã ghi (<code>fsync</code> — lệnh ép dữ liệu xuống đĩa), còn RAM thì chẳng có gì để chờ. Dòng thứ ba chứng minh fsync là toàn bộ câu chuyện — giữ nguyên volume nhưng bật Postgres với <code>-c fsync=off -c synchronous_commit=off -c full_page_writes=off</code> thì nhanh y như tmpfs. Trên Mac thì <strong>không</strong> hơn gì: đĩa ảo của máy ảo Docker Desktop trả lời fsync rất nhanh, nên volume còn nhỉnh hơn một chút. Kết luận trung thực: tmpfs có giá trị ở nơi bộ test của bạn chạy nhiều nhất — runner CI là Linux — và gần như vô nghĩa trên MacBook của bạn. Mẹo nào cũng chỉ dành cho test; sách hướng dẫn PostgreSQL xếp những thiết lập này vào mục "non-durable" (không bền) là có lý do.</p>

<h3>Chạy thử từng bước: file compose, seed, test, dọn</h3>
${slide('dk-13', 18, 'compose.test.yaml + node --test: từ số 0 tới test xanh')}
<p>Nhóm cần cái này nằm trong một file, không phải trong lịch sử shell của ai đó. Seed nằm trong một thư mục gắn vào <code>/docker-entrypoint-initdb.d</code>: image chạy mọi file <code>.sql</code> và <code>.sh</code> ở đó theo thứ tự tên, <strong>chỉ khi thư mục dữ liệu còn trống</strong> — mà với tmpfs thì lần nào cũng trống.</p>
<pre><code class="language-sql"><span class="tok-comment">-- seed/01-schema.sql</span>
CREATE TABLE lich_hen (
  id        serial PRIMARY KEY,
  bac_si    text NOT NULL,
  bat_dau   timestamptz NOT NULL,
  UNIQUE (bac_si, bat_dau)
);
INSERT INTO lich_hen (bac_si, bat_dau) VALUES ('bs-an', '2026-10-01 09:00+07');</code></pre>
<pre><code class="language-yaml"><span class="tok-comment"># compose.test.yaml</span>
name: dk13-itest
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: test
      POSTGRES_DB: phongkham
    ports: ["127.0.0.1:18135:5432"]
    tmpfs: [/var/lib/postgresql/data]
    volumes:
      - ./seed:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD", "pg_isready", "-h", "127.0.0.1", "-U", "postgres", "-d", "phongkham"]
      interval: 1s
      timeout: 2s
      retries: 30</code></pre>
<pre><code class="language-js">// test/lichhen.test.mjs — bộ chạy test có sẵn của Node, không cần framework
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';

const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
before(() =&gt; db.connect());
after(() =&gt; db.end());

test('dữ liệu seed có mặt', async () =&gt; {
  const { rows } = await db.query('SELECT count(*)::int AS n FROM lich_hen');
  assert.equal(rows[0].n, 1);
});

test('không cho đặt trùng giờ cùng bác sĩ', async () =&gt; {
  await assert.rejects(
    db.query("INSERT INTO lich_hen (bac_si, bat_dau) VALUES ('bs-an', '2026-10-01 09:00+07')"),
    { code: '23505' },   // unique_violation — ràng buộc thật của Postgres
  );
});</code></pre>
<pre><code class="language-bash">time (docker compose -f compose.test.yaml up -d --wait 2&gt;&amp;1)
DATABASE_URL=postgres://postgres:test@127.0.0.1:18135/phongkham \\
  node --test --test-reporter=spec test/lichhen.test.mjs
docker compose -f compose.test.yaml down</code></pre>
<div class="out"> Network dk13-itest_default Creating
 Network dk13-itest_default Creating
 Network dk13-itest_default Created
 Network dk13-itest_default Created
 Container dk13-itest-db-1 Creating
 Container dk13-itest-db-1 Created
 Container dk13-itest-db-1 Starting
 Container dk13-itest-db-1 Started
 Container dk13-itest-db-1 Waiting
 Container dk13-itest-db-1 Healthy
( docker compose -f compose.test.yaml up -d --wait 2&gt;&amp;1; )  0.06s user 0.04s system 5% cpu 1.794 total
✔ dữ liệu seed có mặt (12.106875ms)
✔ không cho đặt trùng giờ cùng bác sĩ (1.327125ms)
ℹ tests 2
ℹ suites 0
ℹ pass 2
ℹ fail 0
…
 Container dk13-itest-db-1 Removed
 Network dk13-itest_default Removed </div>
<p><code>up -d --wait</code> là cờ then chốt: nó chỉ trả về khi mọi service có healthcheck đều báo <em>healthy</em> (và báo lỗi nếu có service không bao giờ khoẻ), nên lệnh test ở dòng sau tin được cơ sở dữ liệu. Từ con số 0 tới test xanh mất 1,8 giây cộng 71 ms chạy test. Đặt ba dòng đó vào <code>package.json</code> thành <code>"test:int"</code> là cả nhóm chạy cùng một thứ.</p>
<p>Redis cũng làm y như vậy. Hai cờ của server tắt cả hai cơ chế lưu bền, nên nó không bao giờ ghi một byte nào xuống đĩa:</p>
<pre><code class="language-bash">docker run --rm -d --name redis-test -p 127.0.0.1:6380:6379 redis:7-alpine redis-server --save '' --appendonly no
docker exec redis-test redis-cli ping
docker exec redis-test redis-cli config get save</code></pre>
<div class="out">PONG
save
</div>
<p>(Giá trị rỗng sau <code>save</code> nghĩa là "không bao giờ chụp snapshot". Image vẫn khai một volume <code>/data</code>; <code>--rm</code> xoá nó khi container dừng — đã kiểm trên máy Mac của khoá.)</p>
<div class="pitfall co-tieu-de"><strong>"Mình đã sửa file seed mà chẳng có gì thay đổi."</strong> Script khởi tạo trong <code>/docker-entrypoint-initdb.d</code> chỉ chạy khi thư mục dữ liệu <em>trống</em>. Nếu CSDL test của bạn dùng một named volume (volume có tên) — thường là chép từ file compose dev sang — thì lần chạy thứ hai gặp một CSDL đã khởi tạo và lặng lẽ bỏ qua mọi script seed, thế là test chạy trên schema của tuần trước. Hãy dùng tmpfs (hoặc <code>down -v</code>) cho CSDL test, và đừng bao giờ "sửa tay" một CSDL test: nếu nó cần sửa thì seed đang sai.</div>

<h3>Testcontainers: chính bộ test tự bật cơ sở dữ liệu</h3>
${slide('dk-13', 19, 'Testcontainers: bộ test tự bật và tự dọn Postgres')}
<p>File compose phụ thuộc vào việc ai đó (hoặc một script) chạy <code>up</code> trước khi test. Testcontainers dời việc đó vào trong mã test: một thư viện nói chuyện với Docker API, bật một container trước các test, chờ nó, đưa bạn chuỗi kết nối, rồi xoá nó sau cùng. Nó có cho Java, Go, .NET, Python và Node.</p>
<pre><code class="language-bash">npm i -D pg testcontainers @testcontainers/postgresql</code></pre>
<pre><code class="language-js">import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import pg from 'pg';

let container, db;
before(async () =&gt; {
  const t0 = Date.now();
  container = await new PostgreSqlContainer('postgres:16-alpine')
    .withTmpFs({ '/var/lib/postgresql/data': 'rw' })
    .withCopyDirectoriesToContainer([{ source: './seed', target: '/docker-entrypoint-initdb.d' }])
    .start();
  console.log(&#96;Postgres sẵn sàng sau &#36;{Date.now() - t0} ms ở &#36;{container.getHost()}:&#36;{container.getPort()}&#96;);
  db = new pg.Client({ connectionString: container.getConnectionUri() });
  await db.connect();
});
after(async () =&gt; { await db?.end(); await container?.stop(); });
<span class="tok-comment">// …hai test y như trước…</span></code></pre>
<div class="out">Postgres sẵn sàng sau 1052 ms ở localhost:18136
✔ dữ liệu seed có mặt (1073.407833ms)
✔ không cho đặt trùng giờ cùng bác sĩ (2.594583ms)</div>
<p>Ba chi tiết đáng nhớ. Một, cổng trên máy mặc định là <strong>ngẫu nhiên</strong> (lần chạy đầu của khoá nhận <code>localhost:55003</code>); khoá ghim nó ở 18136 bằng <code>.withExposedPorts({ container: 5432, host: 18136 })</code> cùng <code>.withName()</code> và <code>.withLabels()</code> cho luật an toàn của mình — trong dự án của bạn, cứ để ngẫu nhiên để các file test chạy song song không bao giờ đụng nhau, và luôn đọc cổng từ <code>getPort()</code>. Hai, nó chờ đúng cách: module PostgreSQL (phiên bản 12.1.0) dùng một healthcheck chạy <code>pg_isready --host localhost</code> — tức là đi TCP, đúng bài học ở trên — kèm một phép kiểm cổng đã mở. Ba, dọn dẹp: ngoài <code>stop()</code> của bạn, Testcontainers bình thường bật thêm một container trợ thủ tên <strong>Ryuk</strong> (<code>testcontainers/ryuk</code>), nó xoá mọi thứ phiên test đã tạo nếu tiến trình test bị sập giữa chừng. Các lần chạy của khoá tắt nó bằng <code>TESTCONTAINERS_RYUK_DISABLED=true</code> để mọi tên container đều mang tiền tố riêng của khoá; trong dự án của bạn thì cứ để nó bật.</p>
<table>
<tr><th>Cách</th><th>Ai bật CSDL</th><th>Hợp nhất khi</th></tr>
<tr><td><code>compose.test.yaml</code> + <code>up --wait</code></td><td>Bạn, hoặc một script npm</td><td>Một CSDL test dùng chung, cài đặt đơn giản, cùng file với bạn cùng nhóm</td></tr>
<tr><td>Testcontainers</td><td>Chính mã test</td><td>Mỗi file test một CSDL riêng; chạy song song; hết cảnh "bạn đã bật DB chưa?"</td></tr>
<tr><td>Service container trong CI</td><td>GitHub Actions</td><td>Chỉ trong CI — mục tiếp theo</td></tr>
</table>

<h3>Trong CI: service container</h3>
${slide('dk-13', 20, 'Trong CI: service container thay cho compose')}
<p>GitHub Actions có sẵn đúng ý tưởng này. Dưới mục <code>services:</code> của một job, runner bật container trước các bước, chờ healthcheck của chúng, và xoá chúng khi job kết thúc:</p>
<pre><code class="language-yaml">jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: phongkham
        ports: ["5432:5432"]
        options: &gt;-
          --health-cmd "pg_isready -h 127.0.0.1 -U postgres"
          --health-interval 2s
          --health-retries 20
          --tmpfs /var/lib/postgresql/data
    env:
      DATABASE_URL: postgres://postgres:test@localhost:5432/phongkham
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: psql "&#36;DATABASE_URL" -f seed/01-schema.sql
      - run: npm test</code></pre>
<p><code>options</code> được chuyển thẳng cho <code>docker create</code>, đó là cách các cờ health và <code>--tmpfs</code> lọt vào. Service container không gắn được file trong repo của bạn trước khi bước checkout chạy, nên seed được nạp bằng một bước thay vì qua <code>/docker-entrypoint-initdb.d</code>. Workflow này viết cho bài học và chưa chạy lên GitHub ở đây; runner, cache và matrix là chủ đề của <a href="/courses/github-actions">khoá GitHub Actions</a>. Giá trị của nó nằm ở chỗ cùng một file seed, cùng một image chạy được trên laptop của bạn qua <code>compose.test.yaml</code>.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> pull request của một bạn cùng nhóm cho phép hai bệnh nhân đặt cùng một bác sĩ vào cùng một phút, và mọi unit test đều qua vì tầng repository đã bị giả lập. Hãy dựng một test trên CSDL thật lẽ ra đã bắt được lỗi đó.</p><ol>
<li>Trong <code>~/thu-docker/itest</code>, tạo <code>seed/01-schema.sql</code> với bảng <code>lich_hen</code> và ràng buộc <code>UNIQUE</code> của nó, và <code>compose.test.yaml</code> dùng tmpfs, thư mục seed và healthcheck <code>pg_isready -h 127.0.0.1</code> (dùng cổng 5433 trên loopback).</li>
<li><code>npm init -y &amp;&amp; npm i -D pg</code>, rồi viết hai test như trong bài.</li>
<li>Chạy <code>docker compose -f compose.test.yaml up -d --wait</code>, rồi chạy test có đặt <code>DATABASE_URL</code>. Cả hai phải qua.</li>
<li>Xoá dòng <code>UNIQUE</code> khỏi seed, chạy <code>down</code> rồi <code>up -d --wait</code> lần nữa, và chạy test: test thứ hai giờ phải <em>hỏng</em>. Trả dòng đó về.</li>
<li>Dọn dẹp: <code>docker compose -f compose.test.yaml down</code> và kiểm <code>docker volume ls -f dangling=true</code> không có gì mới.</li></ol>
<p><strong>Đạt khi:</strong> test đỏ khi không có ràng buộc và xanh khi có, và bạn giải thích được vì sao sửa seed có tác dụng ngay (tmpfs: thư mục dữ liệu trống ở mỗi lần khởi động).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Integration test (test tích hợp)</span><span class="v">Test chạy mã của bạn với phụ thuộc thật (CSDL, cache), không phải đồ giả.</span></div>
  <div class="kv"><span class="k">tmpfs (ổ đĩa trong RAM)</span><span class="v">Hệ thống file nằm trong bộ nhớ; gắn đè thư mục dữ liệu thì CSDL vừa nhanh vừa dùng-xong-vứt.</span></div>
  <div class="kv"><span class="k">fsync (ép ghi xuống đĩa)</span><span class="v">Lời gọi chờ tới khi dữ liệu thật sự nằm trên đĩa; đúng cái giá mà tmpfs xoá đi.</span></div>
  <div class="kv"><span class="k">/docker-entrypoint-initdb.d (thư mục khởi tạo)</span><span class="v">Thư mục mà file <code>.sql</code>/<code>.sh</code> trong đó chạy một lần, chỉ khi thư mục dữ liệu trống.</span></div>
  <div class="kv"><span class="k">up --wait (bật và chờ)</span><span class="v">Compose chỉ trả về khi mọi service có healthcheck đều khoẻ.</span></div>
  <div class="kv"><span class="k">Testcontainers / Ryuk</span><span class="v">Thư viện bật container từ mã test; Ryuk là trợ thủ dọn dẹp khi phiên test bị sập.</span></div>
  <div class="kv"><span class="k">Service container (container dịch vụ)</span><span class="v">Container mà GitHub Actions chạy kèm một job, khai dưới <code>services:</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ràng buộc, kiểu dữ liệu và migration chỉ kiểm được trên CSDL thật; container dựng một cái trong chưa tới một giây.</li>
<li><code>--rm</code> + <code>--tmpfs /var/lib/postgresql/data</code> + cổng loopback cho một CSDL sạch, không rò rỉ gì, ở mỗi lần chạy.</li>
<li>Postgres khởi động hai lần ở lần đầu; kiểm sẵn sàng qua TCP (<code>pg_isready -h 127.0.0.1</code>) và hỏi mỗi giây.</li>
<li>tmpfs nhanh hơn 15,7× trên Linux (vì fsync) và không nhanh hơn trên Mac — nó đáng giá ở CI.</li>
<li>Script seed chỉ chạy khi thư mục dữ liệu trống; <code>up -d --wait</code> làm lệnh kế tiếp an toàn.</li>
<li>Testcontainers bật một CSDL cho mỗi file test ở cổng ngẫu nhiên; GitHub Actions làm điều tương tự bằng <code>services:</code>.</li>
</ul>

<a class="link-card" href="https://hub.docker.com/_/postgres" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">postgres — Docker Official Image</span><span class="lc-sub">Biến môi trường, thư mục script initdb và luật "chỉ chạy khi thư mục dữ liệu trống".</span></span>
</a>
<a class="link-card" href="https://node.testcontainers.org/modules/postgresql/" target="_blank" rel="noopener">
  <span class="lc-ico">🧫</span>
  <span class="lc-body"><span class="lc-title">Testcontainers cho Node — module PostgreSQL</span><span class="lc-sub">Bật, cấu hình và nối tới một Postgres dùng-một-lần từ mã test.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Creating PostgreSQL service containers — GitHub Docs</span><span class="lc-sub">Hướng dẫn chính thức về <code>services:</code>, tuỳ chọn health và cổng.</span></span>
</a>
<a class="link-card" href="https://www.postgresql.org/docs/current/non-durability.html" target="_blank" rel="noopener">
  <span class="lc-ico">⚠️</span>
  <span class="lc-body"><span class="lc-title">Non-Durable Settings — sách hướng dẫn PostgreSQL</span><span class="lc-sub"><code>fsync=off</code> và các anh em của nó đánh đổi cái gì, và vì sao chỉ dùng cho dữ liệu vứt đi.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trong Code Lab: Docker</span><span class="lc-sub">Các bài tập Docker có chấm điểm để tay luôn quen lệnh.</span></span>
</a>

<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Một CSDL thật trong container tốn khoảng một giây, nên không còn lý do gì để kiểm ràng buộc trên đồ giả. Hãy chờ lần khởi động thứ hai — kiểm sẵn sàng qua TCP, hỏi mỗi giây, và <code>up --wait</code>. Và tmpfs là thứ tăng tốc cho Linux/CI, không phải cho Mac: đo trước rồi hãy tin một bài blog.</p>
</div>
`,
    },
    /* ─────────────────────────── 13.4 ─────────────────────────── */
    {
      title: '13.4 — Docker on Mac and Windows is really a Linux VM|||13.4 — Docker trên Mac & Windows thật ra là một máy ảo Linux',
      slug: 'dk-13-4-mac-windows',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao Docker trên Mac/Windows chạy trong một máy ảo và hệ quả của nó: RAM/CPU/đĩa của máy ảo (Docker.raw thưa), bind mount qua VirtioFS chậm tới 15 lần với file nhỏ, WSL2 và luật để mã trong hệ file Linux, host.docker.internal, arm64 vs amd64 và Rosetta, giấy phép Docker Desktop và các lựa chọn OrbStack/Colima (tính đến 09/2026).',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.4</span>
<h2>Docker on Mac and Windows is really a Linux VM</h2>
<p class="lead">Chapter 1 showed that a container is a Linux process sharing the host's Linux kernel. macOS has no Linux kernel, and neither does Windows. So when you type <code>docker run</code> on either, the container runs inside a small Linux virtual machine that Docker Desktop starts for you and hides very well. Almost every "Docker behaves strangely on my laptop" story — the RAM that is less than the Mac has, the bind mount that is slow, the hot reload that works on one teammate's machine and not another's, the image that runs on your M1 and crashes on the VPS — is that VM showing through.</p>
<p>This lesson makes the VM visible, measures what it costs, and gives the rules that make a Mac, a Windows laptop and a Linux server behave the same for your team.</p>

<h3>The VM behind the curtain</h3>
${slide('dk-13', 21, 'Trên Mac và Windows, Docker chạy trong một MÁY ẢO Linux')}
<pre><code class="language-bash">docker info | grep -E "Operating System|Kernel|Architecture|CPUs|Total Memory|Docker Root|Storage Driver|driver-type"
uname -r</code></pre>
<div class="out"> Storage Driver: overlayfs
  driver-type: io.containerd.snapshotter.v1
 Kernel Version: 7.0.12-linuxkit
 Operating System: Docker Desktop
 Architecture: aarch64
 CPUs: 10
 Total Memory: 7.748GiB
 Docker Root Dir: /var/lib/docker
27.0.0</div>
<p>The Mac's own kernel is Darwin 27. The Docker daemon reports a Linux kernel <code>7.0.12-linuxkit</code> — the kernel of Docker Desktop's VM — and <strong>7.7 GiB</strong> of memory on a Mac with 32 GB. Every container shares that VM's memory, not the Mac's. Docker's documentation says the default memory limit is 50% of the host; this Mac reports less, so never assume: <code>docker info</code> is the truth, and <em>Settings → Resources</em> is where you change it. This is how a <code>next build</code> can be killed with exit 137 on a laptop "with plenty of RAM": the VM hit its ceiling, not the Mac (Chapter 11).</p>
<p>The VM also has a disk, a single file:</p>
<pre><code class="language-bash">ls -lsh ~/Library/Containers/com.docker.docker/Data/vms/0/data/Docker.raw
du -sh ~/Library/Containers/com.docker.docker/Data/vms/0/data/Docker.raw</code></pre>
<div class="out">156823088 -rw-r--r--@ 1 admin  staff   926G Sep 24 07:34 /Users/admin/Library/Containers/com.docker.docker/Data/vms/0/data/Docker.raw
 75G	/Users/admin/Library/Containers/com.docker.docker/Data/vms/0/data/Docker.raw</div>
<p>926 GB! Do not panic: it is a <em>sparse</em> file. <code>ls</code> shows the size it may grow to, <code>du</code> the space it really occupies — 75 GB here, all images, volumes and build cache of every project on the machine. Deleting things inside Docker (Chapter 11's careful prune, <code>docker system df</code> first) is what shrinks it; deleting the file deletes everything Docker has. On Windows the equivalent is the virtual disk of the <code>docker-desktop</code> WSL distribution.</p>

<h3>File sharing: why a bind mount is slow with many small files</h3>
${slide('dk-13', 22, 'Bind mount đi qua VirtioFS: file nhỏ chậm tới 15 lần')}
<p>A named volume lives on the VM's own ext4 disk. A bind mount of a Mac folder has to cross the VM wall: every open, stat, read and write becomes a request to macOS through a shared-filesystem protocol. Docker Desktop's default is VirtioFS, which the documentation says cut filesystem operation time by up to 98% compared with the older methods — but "much better" is not "free":</p>
<pre><code class="language-bash">docker run --rm -v "$PWD":/w -v data:/v alpine:3 sh -c 'grep -E " /w | /v " /proc/mounts'</code></pre>
<div class="out">/dev/vda1 /v ext4 rw,relatime,discard 0 0
virtiofs2 /w virtiofs rw,nosuid,nodev,relatime,ignore_atime,no_xattr 0 0</div>
<p>A small Node script wrote 3,000 tiny <code>.js</code> files, stat-ed them, read them and deleted them — roughly what <code>npm ci</code> or <code>next build</code> does to <code>node_modules</code> and <code>.next</code> — in three places inside the same container, and once natively on the Mac for comparison:</p>
<pre><code class="language-bash">docker run --rm -v "$PWD":/w node:22-alpine node /w/bench.mjs /w                         <span class="tok-comment"># bind mount</span>
docker run --rm -v data:/w -v "$PWD/bench.mjs":/b.mjs:ro node:22-alpine node /b.mjs /w   <span class="tok-comment"># named volume</span>
docker run --rm -v "$PWD/bench.mjs":/b.mjs:ro node:22-alpine node /b.mjs /tmp/w          <span class="tok-comment"># writable layer</span>
node bench.mjs ./native                                                                 <span class="tok-comment"># the Mac itself</span></code></pre>
<div class="out">bind    : ghi 3000 file: 810 ms · stat: 160 ms · đọc: 340 ms · xoá: 451 ms
volume  : ghi 3000 file: 53 ms · stat: 9 ms · đọc: 19 ms · xoá: 34 ms
tầng ghi: ghi 3000 file: 79 ms · stat: 9 ms · đọc: 20 ms · xoá: 39 ms
bind    : ghi 3000 file: 805 ms · stat: 151 ms · đọc: 296 ms · xoá: 425 ms
volume  : ghi 3000 file: 52 ms · stat: 8 ms · đọc: 19 ms · xoá: 33 ms
tầng ghi: ghi 3000 file: 75 ms · stat: 11 ms · đọc: 21 ms · xoá: 39 ms
bind    : ghi 3000 file: 809 ms · stat: 139 ms · đọc: 287 ms · xoá: 450 ms
volume  : ghi 3000 file: 55 ms · stat: 10 ms · đọc: 21 ms · xoá: 34 ms
tầng ghi: ghi 3000 file: 80 ms · stat: 9 ms · đọc: 20 ms · xoá: 36 ms
Mac gốc : ghi 3000 file: 218 ms · stat: 8 ms · đọc: 54 ms · xoá: 152 ms</div>
<p>(<em>ghi</em> = write, <em>đọc</em> = read, <em>xoá</em> = delete.) Through the bind mount, writing is 15 times slower than a volume and stat 16 times — and even slower than the Mac's own disk. The volume inside the VM beats the native Mac filesystem. That is the whole argument for the pattern from Lesson 13.2: <strong>source code through a bind mount</strong> (a few hundred files you edit, where the delay is invisible), <strong>dependency and build folders in volumes</strong> (<code>- /app/node_modules</code>, <code>- /app/.next</code>), where thousands of files are written at once. On a Linux machine none of this applies: a bind mount there is just the same disk.</p>

<h3>Windows: WSL2, and where your code must live</h3>
${slide('dk-13', 23, 'Windows + WSL2: để mã trong hệ file Linux, không ở /mnt/c')}
<p>On Windows, Docker Desktop uses WSL2 — a real Linux kernel in a lightweight VM — as its backend. That adds a second wall: files on the Windows drive (<code>C:\\Users\\an\\swp391</code>) appear inside Linux as <code>/mnt/c/Users/an/swp391</code>, served across the VM boundary, while files inside the Linux distribution's own home directory (<code>~/swp391</code>, i.e. <code>\\\\wsl$\\Ubuntu\\home\\an\\swp391</code> seen from Windows) are on a native Linux filesystem. Docker's WSL best-practice page is blunt about the consequences: bind mounts are much faster from the Linux filesystem, and <strong>Linux containers only receive file change events (inotify) when the original files are stored in the Linux filesystem</strong>. Code on <code>C:</code> means slow <code>npm ci</code> <em>and</em> a nodemon or <code>next dev</code> that never reloads.</p>
<p>The course had no Windows machine to measure on, so here are the steps from the official documentation for the teammate on Windows, not a transcript:</p>
<div class="lz-flow">
<div class="lz-step"><strong>1.</strong> Install WSL and a distribution (<code>wsl --install</code> in an administrator PowerShell installs Ubuntu by default), then enable the WSL 2 backend and that distribution under Docker Desktop's <em>Resources → WSL integration</em>.</div>
<div class="lz-step"><strong>2.</strong> Open the Ubuntu terminal and clone the repository <strong>there</strong>: <code>cd ~ &amp;&amp; git clone …/swp391.git</code>. Do not copy the folder from <code>C:</code>.</div>
<div class="lz-step"><strong>3.</strong> From that terminal run <code>code .</code> — VS Code opens connected to WSL, and its terminal, git and Docker commands all run in Linux.</div>
<div class="lz-step"><strong>4.</strong> Run <code>docker compose up</code> from the same terminal. Relative bind mounts like <code>./src:/app/src</code> now point into the Linux filesystem.</div>
</div>
<p>Two more Windows traps that look like Docker bugs. Git on Windows may convert line endings to CRLF, and a shell script with CRLF fails inside a Linux container with <code>/bin/sh^M: bad interpreter</code>-style errors; a <code>.gitattributes</code> line <code>*.sh text eol=lf</code> in the repo fixes it for everyone. And paths: write compose paths relative (<code>./data</code>) — never <code>C:\\…</code> — so the same file works on every machine.</p>

<h3>Reaching your own machine: host.docker.internal</h3>
${slide('dk-13', 24, 'host.docker.internal: Mac có sẵn, Linux phải xin thêm')}
<p>Sometimes a container must call something running directly on your laptop — a Postgres you installed with Homebrew, a mock server, the dev server of another project. <code>localhost</code> will not work: inside the container it is the container (Chapter 8). Docker Desktop provides a special name instead. With a tiny web server on the Mac listening <em>only</em> on 127.0.0.1:</p>
<pre><code class="language-bash">python3 -m http.server 18137 --bind 127.0.0.1 -d hostsrv &amp;
docker run --rm alpine:3 sh -c 'getent hosts host.docker.internal; wget -qO- http://host.docker.internal:18137/; echo "---localhost:"; wget -qO- -T 2 http://localhost:18137/ || echo "localhost THẤT BẠI"'</code></pre>
<div class="out">192.168.65.254    host.docker.internal  host.docker.internal
xin chào từ máy Mac
---localhost:
wget: can't connect to remote host: Connection refused
localhost THẤT BẠI</div>
<p><code>host.docker.internal</code> resolves to an address inside the VM (192.168.65.254) that Docker Desktop forwards to the Mac — and it reached a server bound only to the Mac's loopback. On Linux there is no VM, so there is no such name unless you ask for it:</p>
<pre><code class="language-bash">docker run --rm alpine:3 sh -c "getent hosts host.docker.internal || echo KHÔNG phân giải được"
docker run --rm --add-host=host.docker.internal:host-gateway alpine:3 getent hosts host.docker.internal</code></pre>
<div class="out">KHÔNG phân giải được
172.17.0.1        host.docker.internal  host.docker.internal</div>
<p><code>host-gateway</code> is a magic value meaning "the host's address on the Docker bridge". Two consequences for a team: put <code>extra_hosts: ["host.docker.internal:host-gateway"]</code> in the compose file so it works on Linux too (it is harmless on Desktop), and on Linux the service on the host must listen on the bridge address (or 0.0.0.0, firewalled), because 127.0.0.1 on a Linux host is <em>not</em> reachable from containers the way Docker Desktop made it look.</p>

<h3>arm64 and amd64: the chip under the image</h3>
${slide('dk-13', 25, 'arm64 và amd64: --platform, và Rosetta dịch giùm')}
<p>An M1/M2/M3 Mac is arm64. Most school PCs, Windows laptops and VPSs are amd64 (x86-64). An image contains machine code for one CPU architecture; multi-platform images carry several variants and Docker picks yours:</p>
<pre><code class="language-bash">docker run --rm alpine:3 uname -m
docker run --rm --platform linux/amd64 alpine:3 uname -m
docker run --rm --platform linux/amd64 alpine:3 sh -c 'head -2 /proc/cpuinfo | tail -1'
docker image ls alpine:3 --tree</code></pre>
<div class="out">aarch64
x86_64
vendor_id	: VirtualApple
IMAGE                   ID             DISK USAGE   CONTENT SIZE   EXTRA
alpine:3                294b683cb724       26.5MB         8.13MB
├─ linux/amd64          d56c381f961d       12.9MB         3.85MB
├─ linux/arm/v6         d3c3fda3e4d3           0B             0B
├─ linux/arm/v7         0a13654ecd9b           0B             0B
├─ linux/arm64/v8       260479a1cfaf       13.5MB         4.19MB
…</div>
<p><code>--platform linux/amd64</code> ran the x86-64 variant on an arm64 Mac, and the CPU it saw is "VirtualApple": Apple's Rosetta 2 translating x86 instructions, which Docker Desktop can use instead of the slower QEMU emulator (there is a setting for it under the Apple Virtualization framework). The containerd image store keeps both variants side by side under one tag — hence <code>--tree</code>. Translation is not free, but on this Mac it was cheap: hashing 500 MB took 3.05 s natively and 3.40 s under emulation.</p>
<table>
<tr><th>Situation</th><th>What to do</th></tr>
<tr><td>An image exists only for amd64 (old or internal images)</td><td><code>--platform linux/amd64</code> (compose: <code>platform: linux/amd64</code>) — runs through Rosetta</td></tr>
<tr><td>You build on an M1 and deploy to an amd64 VPS</td><td>Build for the target: <code>docker buildx build --platform linux/amd64</code>, or build in CI (Chapter 15). An arm64-only image on the VPS fails with <code>exec format error</code></td></tr>
<tr><td>Teammate on an Intel/AMD Windows laptop</td><td>Official images are multi-platform — nothing to do</td></tr>
<tr><td>Native modules in <code>node_modules</code></td><td>Install inside the container for the right platform (Lesson 13.2)</td></tr>
</table>
<p>Check any image's architecture before shipping it: <code>docker image inspect -f '{{.Architecture}}' &lt;image&gt;</code>. It is the same family of bug as the course's 502 outage — a binary built for the wrong target (there: glibc vs musl; here: arm64 vs amd64) — and the same lesson: <em>a green build does not mean the image runs where it is going.</em></p>

<h3>Docker Desktop, OrbStack or Colima?</h3>
${slide('dk-13', 26, 'Docker Desktop, OrbStack hay Colima?')}
<p>Docker Desktop is not the only way to get that Linux VM on a Mac. The facts that decide it, checked on the vendors' own pages (as of 09/2026):</p>
<table>
<tr><th></th><th>Docker Desktop</th><th>OrbStack (Mac only)</th><th>Colima (Mac and Linux)</th></tr>
<tr><td>Price</td><td>Free for personal use, education, non-commercial open source and small businesses (fewer than 250 employees <em>and</em> less than 10 million USD annual revenue); paid subscription otherwise</td><td>Free for personal, non-commercial use; Pro 8 USD per user per month for commercial use</td><td>Open source (MIT), free</td></tr>
<tr><td>Interface</td><td>GUI + CLI</td><td>GUI + CLI</td><td>CLI only</td></tr>
<tr><td>Windows</td><td>Yes (WSL2)</td><td>No</td><td>No</td></tr>
<tr><td>x86 images on Apple chips</td><td>QEMU or Rosetta (setting)</td><td>Rosetta</td><td><code>colima start --vm-type=vz --vz-rosetta</code></td></tr>
<tr><td>Resources</td><td>Settings → Resources</td><td>App settings</td><td><code>colima start --cpu 4 --memory 6 --disk 60</code></td></tr>
</table>
<p>For a student using Docker for coursework and a school project, Docker Desktop is free. When you start an internship, ask whether the company has a Docker subscription before installing it on a work laptop — that is exactly the case the license targets. All three speak the same <code>docker</code> CLI and run the same compose files; each registers a <em>context</em>, and <code>docker context ls</code> / <code>docker context use &lt;name&gt;</code> switch between them. On this Mac the list shows <code>default</code> and <code>desktop-linux *</code> (the active one).</p>
<div class="pitfall co-tieu-de"><strong>"The build works on my Mac, dies on my teammate's."</strong> Three differences hide behind that sentence, and all three are the VM: <em>memory</em> (their Docker VM has 4 GB and <code>next build</code> gets exit 137 — raise the limit, or cap Node's heap), <em>files</em> (their code lives on <code>C:</code>, so installs crawl and hot reload never fires — move it into WSL), and <em>architecture</em> (you pushed an arm64-only image from your M1 and their amd64 machine or the VPS says <code>exec format error</code> — build for the right platform). Before debugging the app, compare <code>docker info</code> on both machines.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your team lead asks you to write the "Docker setup" section of the SWP391 README, with numbers from <em>your</em> machine so teammates can compare theirs.</p><ol>
<li>Run <code>docker info</code> and record the kernel version, architecture, CPUs and total memory of your Docker VM. Compare the memory with your laptop's real RAM.</li>
<li>Find the size of your Docker VM's disk (on a Mac: <code>ls -lsh</code> and <code>du -sh</code> on <code>Docker.raw</code>) and run <code>docker system df</code>. Explain in one line why the two sizes differ.</li>
<li>Write the small-file benchmark from this lesson (or copy it) into <code>~/thu-docker/perf/bench.mjs</code> and run it on a bind mount and on a named volume. Delete the volume afterwards.</li>
<li>Start <code>python3 -m http.server 8000 --bind 127.0.0.1</code> on your machine and fetch it from a container through <code>host.docker.internal</code>.</li>
<li>Run <code>docker run --rm --platform linux/amd64 alpine:3 uname -m</code> and note whether your machine emulated it.</li></ol>
<p><strong>Done when:</strong> the README section lists your VM's memory and CPUs, your bind-vs-volume numbers, a working <code>host.docker.internal</code> example, and one sentence of advice for a teammate on Windows (where to put the code).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Docker Desktop VM</span><span class="v">The hidden Linux virtual machine that runs the daemon and all containers on Mac and Windows.</span></div>
  <div class="kv"><span class="k">Sparse file</span><span class="v">A file whose declared size (926 GB) is larger than the space it uses (75 GB); <code>Docker.raw</code> is one.</span></div>
  <div class="kv"><span class="k">VirtioFS</span><span class="v">The protocol that shares Mac folders into the VM for bind mounts; fast for big files, costly per small operation.</span></div>
  <div class="kv"><span class="k">WSL2</span><span class="v">Windows Subsystem for Linux: a real Linux kernel in a light VM; Docker Desktop's backend on Windows.</span></div>
  <div class="kv"><span class="k">host.docker.internal / host-gateway</span><span class="v">Name for "my own machine" from inside a container; on Linux add it with <code>--add-host=…:host-gateway</code>.</span></div>
  <div class="kv"><span class="k">Platform (arm64 / amd64)</span><span class="v">The CPU architecture an image's binaries are built for; choose with <code>--platform</code>.</span></div>
  <div class="kv"><span class="k">Rosetta 2</span><span class="v">Apple's x86-to-arm translator; runs amd64 images on Apple chips faster than QEMU.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>On Mac and Windows every container runs in a Linux VM; its RAM, CPUs and disk — not your laptop's — are the limits.</li>
<li><code>Docker.raw</code> is sparse: judge its size with <code>du</code>, shrink it with careful pruning inside Docker.</li>
<li>Bind mounts cross the VM wall: 15× slower for small files here, so keep <code>node_modules</code> and build output in volumes.</li>
<li>On Windows, keep code in the WSL Linux filesystem, or both performance and inotify-based reload suffer.</li>
<li><code>host.docker.internal</code> exists on Docker Desktop; on Linux add <code>host-gateway</code> via <code>extra_hosts</code>.</li>
<li>Match the image's architecture to where it runs; Rosetta makes amd64 bearable on a Mac, but ship images built for the server.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/subscription/desktop-license/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Docker Desktop license agreement</span><span class="lc-sub">Who may use it free and who needs a subscription — check again before you use it at a company.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/desktop/features/wsl/best-practices/" target="_blank" rel="noopener">
  <span class="lc-ico">🪟</span>
  <span class="lc-body"><span class="lc-title">WSL 2 best practices — Docker Docs</span><span class="lc-sub">Why code belongs in the Linux filesystem, including the inotify rule.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/desktop/settings-and-maintenance/settings/" target="_blank" rel="noopener">
  <span class="lc-ico">🎛️</span>
  <span class="lc-body"><span class="lc-title">Docker Desktop settings</span><span class="lc-sub">Memory, CPU, swap and disk limits, file sharing implementation and the Rosetta option.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/desktop/features/networking/" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Docker Desktop networking</span><span class="lc-sub"><code>host.docker.internal</code> and how Desktop's network differs from Linux.</span></span>
</a>
<a class="link-card" href="https://github.com/abiosoft/colima" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Colima</span><span class="lc-sub">Open-source container runtime VM for macOS and Linux, with the Rosetta and resource flags.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practise in Code Lab: Docker</span><span class="lc-sub">Graded Docker exercises to keep your hands on the commands.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> On a laptop, Docker is a Linux VM: its limits are your limits, and <code>docker info</code> tells you what they are. Everything that crosses the VM wall — bind mounts, file events, <code>localhost</code> — costs something or behaves differently, so keep heavy folders in volumes and code inside WSL. And the chip matters: build images for the machine that will run them.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.4</span>
<h2>Docker trên Mac & Windows thật ra là một máy ảo Linux</h2>
<p class="lead">Chương 1 đã cho thấy container là một tiến trình Linux dùng chung nhân Linux của máy chủ. macOS không có nhân Linux, Windows cũng vậy. Nên khi bạn gõ <code>docker run</code> trên hai hệ đó, container chạy bên trong một máy ảo (virtual machine) Linux nhỏ mà Docker Desktop bật giùm bạn và giấu rất kỹ. Gần như mọi chuyện "Docker trên laptop mình kỳ lắm" — RAM ít hơn máy thật, bind mount chậm, hot reload chạy trên máy bạn này mà không chạy trên máy bạn kia, image chạy trên M1 của bạn mà sập trên VPS — đều là cái máy ảo đó lộ ra.</p>
<p>Bài này làm cho máy ảo hiện hình, đo xem nó tốn gì, và đưa ra những luật để một máy Mac, một laptop Windows và một server Linux cư xử giống nhau với cả nhóm.</p>

<h3>Cái máy ảo sau tấm màn</h3>
${slide('dk-13', 21, 'Trên Mac và Windows, Docker chạy trong một MÁY ẢO Linux')}
<pre><code class="language-bash">docker info | grep -E "Operating System|Kernel|Architecture|CPUs|Total Memory|Docker Root|Storage Driver|driver-type"
uname -r</code></pre>
<div class="out"> Storage Driver: overlayfs
  driver-type: io.containerd.snapshotter.v1
 Kernel Version: 7.0.12-linuxkit
 Operating System: Docker Desktop
 Architecture: aarch64
 CPUs: 10
 Total Memory: 7.748GiB
 Docker Root Dir: /var/lib/docker
27.0.0</div>
<p>Nhân của chính máy Mac là Darwin 27. Daemon Docker thì báo một nhân Linux <code>7.0.12-linuxkit</code> — nhân của máy ảo Docker Desktop — và <strong>7,7 GiB</strong> bộ nhớ trên một máy Mac có 32 GB. Mọi container dùng chung bộ nhớ của máy ảo đó, không phải của Mac. Tài liệu Docker nói giới hạn bộ nhớ mặc định là 50% của máy; máy Mac này báo ít hơn, nên đừng bao giờ đoán: <code>docker info</code> là sự thật, và <em>Settings → Resources</em> là chỗ để đổi nó. Đây là cách một lần <code>next build</code> bị giết với mã thoát 137 trên một laptop "dư RAM": máy ảo chạm trần, không phải máy Mac (Chương 11).</p>
<p>Máy ảo còn có một cái đĩa, gói gọn trong một file:</p>
<pre><code class="language-bash">ls -lsh ~/Library/Containers/com.docker.docker/Data/vms/0/data/Docker.raw
du -sh ~/Library/Containers/com.docker.docker/Data/vms/0/data/Docker.raw</code></pre>
<div class="out">156823088 -rw-r--r--@ 1 admin  staff   926G Sep 24 07:34 /Users/admin/Library/Containers/com.docker.docker/Data/vms/0/data/Docker.raw
 75G	/Users/admin/Library/Containers/com.docker.docker/Data/vms/0/data/Docker.raw</div>
<p>926 GB! Đừng hoảng: đây là một file <em>thưa</em> (sparse file). <code>ls</code> cho thấy cỡ tối đa nó có thể phình tới, <code>du</code> cho thấy chỗ nó thật sự chiếm — ở đây 75 GB, là toàn bộ image, volume và cache build của mọi dự án trên máy. Xoá bớt thứ bên trong Docker (prune cẩn thận như Chương 11, luôn xem <code>docker system df</code> trước) mới làm nó nhỏ lại; xoá cái file là xoá sạch mọi thứ Docker có. Trên Windows, thứ tương đương là đĩa ảo của bản phân phối WSL <code>docker-desktop</code>.</p>

<h3>Chia sẻ file: vì sao bind mount chậm khi có nhiều file nhỏ</h3>
${slide('dk-13', 22, 'Bind mount đi qua VirtioFS: file nhỏ chậm tới 15 lần')}
<p>Một named volume nằm trên đĩa ext4 riêng của máy ảo. Một bind mount thư mục của Mac thì phải vượt qua bức vách máy ảo: mỗi lần mở, stat (hỏi thông tin file), đọc, ghi đều thành một yêu cầu gửi sang macOS qua một giao thức chia sẻ hệ thống file. Mặc định của Docker Desktop là VirtioFS, mà tài liệu nói đã cắt thời gian thao tác file tới 98% so với các cách cũ — nhưng "tốt hơn nhiều" không có nghĩa là "miễn phí":</p>
<pre><code class="language-bash">docker run --rm -v "$PWD":/w -v data:/v alpine:3 sh -c 'grep -E " /w | /v " /proc/mounts'</code></pre>
<div class="out">/dev/vda1 /v ext4 rw,relatime,discard 0 0
virtiofs2 /w virtiofs rw,nosuid,nodev,relatime,ignore_atime,no_xattr 0 0</div>
<p>Một script Node nhỏ ghi 3.000 file <code>.js</code> tí hon, stat chúng, đọc chúng rồi xoá chúng — gần đúng việc <code>npm ci</code> hay <code>next build</code> làm với <code>node_modules</code> và <code>.next</code> — ở ba chỗ trong cùng một container, và một lần chạy thẳng trên Mac để so:</p>
<pre><code class="language-bash">docker run --rm -v "$PWD":/w node:22-alpine node /w/bench.mjs /w                         <span class="tok-comment"># bind mount</span>
docker run --rm -v data:/w -v "$PWD/bench.mjs":/b.mjs:ro node:22-alpine node /b.mjs /w   <span class="tok-comment"># named volume</span>
docker run --rm -v "$PWD/bench.mjs":/b.mjs:ro node:22-alpine node /b.mjs /tmp/w          <span class="tok-comment"># tầng ghi của container</span>
node bench.mjs ./native                                                                 <span class="tok-comment"># chính máy Mac</span></code></pre>
<div class="out">bind    : ghi 3000 file: 810 ms · stat: 160 ms · đọc: 340 ms · xoá: 451 ms
volume  : ghi 3000 file: 53 ms · stat: 9 ms · đọc: 19 ms · xoá: 34 ms
tầng ghi: ghi 3000 file: 79 ms · stat: 9 ms · đọc: 20 ms · xoá: 39 ms
bind    : ghi 3000 file: 805 ms · stat: 151 ms · đọc: 296 ms · xoá: 425 ms
volume  : ghi 3000 file: 52 ms · stat: 8 ms · đọc: 19 ms · xoá: 33 ms
tầng ghi: ghi 3000 file: 75 ms · stat: 11 ms · đọc: 21 ms · xoá: 39 ms
bind    : ghi 3000 file: 809 ms · stat: 139 ms · đọc: 287 ms · xoá: 450 ms
volume  : ghi 3000 file: 55 ms · stat: 10 ms · đọc: 21 ms · xoá: 34 ms
tầng ghi: ghi 3000 file: 80 ms · stat: 9 ms · đọc: 20 ms · xoá: 36 ms
Mac gốc : ghi 3000 file: 218 ms · stat: 8 ms · đọc: 54 ms · xoá: 152 ms</div>
<p>Qua bind mount, ghi chậm hơn volume 15 lần và stat 16 lần — còn chậm hơn cả ổ đĩa của chính máy Mac. Volume trong máy ảo thì thắng cả hệ thống file gốc của Mac. Đó là toàn bộ lý lẽ cho khuôn mẫu ở Bài 13.2: <strong>mã nguồn đi qua bind mount</strong> (vài trăm file bạn sửa, độ trễ không thấy được), <strong>thư mục thư viện và kết quả build nằm trong volume</strong> (<code>- /app/node_modules</code>, <code>- /app/.next</code>), nơi hàng nghìn file bị ghi cùng lúc. Trên máy Linux thì chuyện này không áp dụng: bind mount ở đó chỉ là cùng một cái đĩa.</p>

<h3>Windows: WSL2, và mã của bạn phải nằm ở đâu</h3>
${slide('dk-13', 23, 'Windows + WSL2: để mã trong hệ file Linux, không ở /mnt/c')}
<p>Trên Windows, Docker Desktop dùng WSL2 — một nhân Linux thật trong một máy ảo nhẹ — làm nền. Điều đó thêm một bức vách thứ hai: file trên ổ Windows (<code>C:\\Users\\an\\swp391</code>) hiện ra bên trong Linux là <code>/mnt/c/Users/an/swp391</code>, được phục vụ xuyên qua ranh giới máy ảo, còn file trong thư mục nhà của chính bản phân phối Linux (<code>~/swp391</code>, tức là <code>\\\\wsl$\\Ubuntu\\home\\an\\swp391</code> khi nhìn từ Windows) nằm trên một hệ thống file Linux thật. Trang best practice về WSL của Docker nói thẳng hệ quả: bind mount từ hệ file Linux nhanh hơn nhiều, và <strong>container Linux chỉ nhận được sự kiện thay đổi file (inotify) khi file gốc nằm trong hệ file Linux</strong>. Mã để ở <code>C:</code> nghĩa là <code>npm ci</code> chậm <em>và</em> nodemon hay <code>next dev</code> không bao giờ nạp lại.</p>
<p>Khoá không có máy Windows để đo, nên dưới đây là các bước theo tài liệu chính thức dành cho bạn cùng nhóm dùng Windows, không phải bản ghi terminal:</p>
<div class="lz-flow">
<div class="lz-step"><strong>1.</strong> Cài WSL và một bản phân phối (<code>wsl --install</code> trong PowerShell quyền quản trị, mặc định cài Ubuntu), rồi bật nền WSL 2 và bản phân phối đó trong <em>Resources → WSL integration</em> của Docker Desktop.</div>
<div class="lz-step"><strong>2.</strong> Mở terminal Ubuntu và clone repo <strong>ở đó</strong>: <code>cd ~ &amp;&amp; git clone …/swp391.git</code>. Đừng chép thư mục từ ổ <code>C:</code> sang.</div>
<div class="lz-step"><strong>3.</strong> Từ terminal đó chạy <code>code .</code> — VS Code mở ra đã nối vào WSL, và terminal, git, lệnh Docker của nó đều chạy trong Linux.</div>
<div class="lz-step"><strong>4.</strong> Chạy <code>docker compose up</code> từ cùng terminal. Các bind mount tương đối như <code>./src:/app/src</code> giờ trỏ vào hệ file Linux.</div>
</div>
<p>Thêm hai cái bẫy Windows trông như lỗi của Docker. Git trên Windows có thể đổi ký tự xuống dòng thành CRLF, và một script shell mang CRLF sẽ hỏng trong container Linux với lỗi kiểu <code>/bin/sh^M: bad interpreter</code>; một dòng <code>*.sh text eol=lf</code> trong <code>.gitattributes</code> của repo sửa cho cả nhóm. Và đường dẫn: viết đường dẫn trong compose dạng tương đối (<code>./data</code>) — không bao giờ <code>C:\\…</code> — để cùng một file chạy được trên mọi máy.</p>

<h3>Gọi về chính máy mình: host.docker.internal</h3>
${slide('dk-13', 24, 'host.docker.internal: Mac có sẵn, Linux phải xin thêm')}
<p>Đôi khi một container phải gọi một thứ đang chạy thẳng trên laptop của bạn — một Postgres cài bằng Homebrew, một mock server, dev server của một dự án khác. <code>localhost</code> sẽ không được: bên trong container nó là chính container (Chương 8). Docker Desktop cho sẵn một cái tên đặc biệt. Với một web server tí hon trên Mac CHỈ nghe ở 127.0.0.1:</p>
<pre><code class="language-bash">python3 -m http.server 18137 --bind 127.0.0.1 -d hostsrv &amp;
docker run --rm alpine:3 sh -c 'getent hosts host.docker.internal; wget -qO- http://host.docker.internal:18137/; echo "---localhost:"; wget -qO- -T 2 http://localhost:18137/ || echo "localhost THẤT BẠI"'</code></pre>
<div class="out">192.168.65.254    host.docker.internal  host.docker.internal
xin chào từ máy Mac
---localhost:
wget: can't connect to remote host: Connection refused
localhost THẤT BẠI</div>
<p><code>host.docker.internal</code> phân giải ra một địa chỉ bên trong máy ảo (192.168.65.254) mà Docker Desktop chuyển tiếp về Mac — và nó với tới được cả một server chỉ nghe trên loopback của Mac. Trên Linux không có máy ảo, nên không có cái tên đó trừ khi bạn xin:</p>
<pre><code class="language-bash">docker run --rm alpine:3 sh -c "getent hosts host.docker.internal || echo KHÔNG phân giải được"
docker run --rm --add-host=host.docker.internal:host-gateway alpine:3 getent hosts host.docker.internal</code></pre>
<div class="out">KHÔNG phân giải được
172.17.0.1        host.docker.internal  host.docker.internal</div>
<p><code>host-gateway</code> là một giá trị đặc biệt nghĩa là "địa chỉ của máy chủ trên cầu mạng Docker". Hai hệ quả cho cả nhóm: ghi <code>extra_hosts: ["host.docker.internal:host-gateway"]</code> vào file compose để nó chạy cả trên Linux (trên Desktop thì vô hại), và trên Linux, dịch vụ trên máy chủ phải nghe ở địa chỉ cầu (hoặc 0.0.0.0, có tường lửa), vì 127.0.0.1 trên một máy Linux <em>không</em> với tới được từ container theo kiểu Docker Desktop làm ta tưởng.</p>

<h3>arm64 và amd64: con chip nằm dưới image</h3>
${slide('dk-13', 25, 'arm64 và amd64: --platform, và Rosetta dịch giùm')}
<p>Mac M1/M2/M3 là arm64. Phần lớn máy tính ở trường, laptop Windows và VPS là amd64 (x86-64). Một image chứa mã máy cho một kiến trúc CPU; image đa nền tảng (multi-platform) mang nhiều biến thể và Docker chọn đúng cái của bạn:</p>
<pre><code class="language-bash">docker run --rm alpine:3 uname -m
docker run --rm --platform linux/amd64 alpine:3 uname -m
docker run --rm --platform linux/amd64 alpine:3 sh -c 'head -2 /proc/cpuinfo | tail -1'
docker image ls alpine:3 --tree</code></pre>
<div class="out">aarch64
x86_64
vendor_id	: VirtualApple
IMAGE                   ID             DISK USAGE   CONTENT SIZE   EXTRA
alpine:3                294b683cb724       26.5MB         8.13MB
├─ linux/amd64          d56c381f961d       12.9MB         3.85MB
├─ linux/arm/v6         d3c3fda3e4d3           0B             0B
├─ linux/arm/v7         0a13654ecd9b           0B             0B
├─ linux/arm64/v8       260479a1cfaf       13.5MB         4.19MB
…</div>
<p><code>--platform linux/amd64</code> chạy biến thể x86-64 trên một Mac arm64, và CPU mà nó nhìn thấy là "VirtualApple": Rosetta 2 của Apple đang dịch lệnh x86, thứ mà Docker Desktop dùng được thay cho trình giả lập QEMU chậm hơn (có một thiết lập cho nó dưới Apple Virtualization framework). Kho image containerd giữ cả hai biến thể cạnh nhau dưới cùng một tag — vì thế mới có <code>--tree</code>. Dịch thì không miễn phí, nhưng trên máy Mac này rẻ: băm 500 MB mất 3,05 s khi chạy gốc và 3,40 s khi giả lập.</p>
<table>
<tr><th>Tình huống</th><th>Làm gì</th></tr>
<tr><td>Image chỉ có bản amd64 (image cũ, image nội bộ)</td><td><code>--platform linux/amd64</code> (compose: <code>platform: linux/amd64</code>) — chạy qua Rosetta</td></tr>
<tr><td>Bạn build trên M1 và deploy lên VPS amd64</td><td>Build cho đúng đích: <code>docker buildx build --platform linux/amd64</code>, hoặc build trong CI (Chương 15). Image chỉ có arm64 lên VPS sẽ hỏng với <code>exec format error</code></td></tr>
<tr><td>Bạn cùng nhóm dùng laptop Windows Intel/AMD</td><td>Image chính thức là đa nền tảng — không cần làm gì</td></tr>
<tr><td>Gói native trong <code>node_modules</code></td><td>Cài bên trong container cho đúng nền tảng (Bài 13.2)</td></tr>
</table>
<p>Kiểm kiến trúc của bất kỳ image nào trước khi đem đi: <code>docker image inspect -f '{{.Architecture}}' &lt;image&gt;</code>. Nó cùng họ lỗi với sự cố 502 của khoá — một file nhị phân dựng cho sai đích (ở đó: glibc vs musl; ở đây: arm64 vs amd64) — và cùng một bài học: <em>build xanh không có nghĩa là image chạy được ở nơi nó sắp tới.</em></p>

<h3>Docker Desktop, OrbStack hay Colima?</h3>
${slide('dk-13', 26, 'Docker Desktop, OrbStack hay Colima?')}
<p>Docker Desktop không phải cách duy nhất để có cái máy ảo Linux đó trên Mac. Những điều quyết định lựa chọn, đã kiểm trên trang chính thức của từng bên (tính đến 09/2026):</p>
<table>
<tr><th></th><th>Docker Desktop</th><th>OrbStack (chỉ Mac)</th><th>Colima (Mac và Linux)</th></tr>
<tr><td>Giá</td><td>Miễn phí cho dùng cá nhân, học tập, mã nguồn mở phi thương mại và doanh nghiệp nhỏ (dưới 250 nhân viên <em>và</em> doanh thu năm dưới 10 triệu USD); ngoài ra phải mua gói</td><td>Miễn phí cho cá nhân, phi thương mại; Pro 8 USD/người/tháng cho dùng thương mại</td><td>Mã nguồn mở (MIT), miễn phí</td></tr>
<tr><td>Giao diện</td><td>Có GUI + CLI</td><td>Có GUI + CLI</td><td>Chỉ CLI</td></tr>
<tr><td>Windows</td><td>Có (WSL2)</td><td>Không</td><td>Không</td></tr>
<tr><td>Image x86 trên chip Apple</td><td>QEMU hoặc Rosetta (thiết lập)</td><td>Rosetta</td><td><code>colima start --vm-type=vz --vz-rosetta</code></td></tr>
<tr><td>Tài nguyên</td><td>Settings → Resources</td><td>Thiết lập của app</td><td><code>colima start --cpu 4 --memory 6 --disk 60</code></td></tr>
</table>
<p>Với sinh viên dùng Docker cho môn học và đồ án ở trường, Docker Desktop miễn phí. Khi bắt đầu đi thực tập, hãy hỏi công ty đã có gói Docker chưa trước khi cài nó lên máy công ty — đó đúng là trường hợp giấy phép nhắm tới. Cả ba đều nói cùng một <code>docker</code> CLI và chạy cùng file compose; mỗi cái đăng ký một <em>context</em> (ngữ cảnh), và <code>docker context ls</code> / <code>docker context use &lt;tên&gt;</code> chuyển qua lại giữa chúng. Trên máy Mac này danh sách có <code>default</code> và <code>desktop-linux *</code> (cái đang dùng).</p>
<div class="pitfall co-tieu-de"><strong>"Build chạy trên Mac mình, chết trên máy bạn cùng nhóm."</strong> Ba khác biệt nấp sau câu đó, và cả ba đều là cái máy ảo: <em>bộ nhớ</em> (máy ảo Docker của bạn ấy chỉ có 4 GB và <code>next build</code> ăn mã thoát 137 — nâng trần lên, hoặc giới hạn heap của Node), <em>file</em> (mã của bạn ấy để ở <code>C:</code>, nên cài thư viện bò như rùa và hot reload không bao giờ chạy — dời nó vào WSL), và <em>kiến trúc</em> (bạn đẩy một image chỉ có arm64 từ M1 lên và máy amd64 của bạn ấy hay VPS báo <code>exec format error</code> — build cho đúng nền tảng). Trước khi gỡ lỗi app, hãy so <code>docker info</code> của hai máy.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> trưởng nhóm nhờ bạn viết mục "Cài Docker" trong README của đồ án SWP391, kèm con số từ <em>máy bạn</em> để các bạn khác so với máy mình.</p><ol>
<li>Chạy <code>docker info</code> và ghi lại phiên bản nhân, kiến trúc, số CPU và tổng bộ nhớ của máy ảo Docker. So bộ nhớ đó với RAM thật của laptop.</li>
<li>Tìm cỡ đĩa của máy ảo Docker (trên Mac: <code>ls -lsh</code> và <code>du -sh</code> với <code>Docker.raw</code>) và chạy <code>docker system df</code>. Giải thích trong một dòng vì sao hai con số khác nhau.</li>
<li>Viết (hoặc chép) script đo file nhỏ của bài vào <code>~/thu-docker/perf/bench.mjs</code> và chạy nó trên một bind mount và trên một named volume. Xoá volume sau khi xong.</li>
<li>Bật <code>python3 -m http.server 8000 --bind 127.0.0.1</code> trên máy bạn và lấy trang đó từ một container qua <code>host.docker.internal</code>.</li>
<li>Chạy <code>docker run --rm --platform linux/amd64 alpine:3 uname -m</code> và ghi lại máy bạn có phải giả lập hay không.</li></ol>
<p><strong>Đạt khi:</strong> mục README ghi được bộ nhớ và CPU của máy ảo, con số bind mount so với volume của bạn, một ví dụ <code>host.docker.internal</code> chạy được, và một câu khuyên cho bạn dùng Windows (để mã ở đâu).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Docker Desktop VM (máy ảo của Docker Desktop)</span><span class="v">Máy ảo Linux ẩn chạy daemon và mọi container trên Mac và Windows.</span></div>
  <div class="kv"><span class="k">Sparse file (file thưa)</span><span class="v">File có cỡ khai báo (926 GB) lớn hơn chỗ thật sự chiếm (75 GB); <code>Docker.raw</code> là một file như thế.</span></div>
  <div class="kv"><span class="k">VirtioFS (giao thức chia sẻ file)</span><span class="v">Cách chia thư mục của Mac vào máy ảo cho bind mount; nhanh với file lớn, tốn kém cho từng thao tác nhỏ.</span></div>
  <div class="kv"><span class="k">WSL2 (Linux bên trong Windows)</span><span class="v">Windows Subsystem for Linux: một nhân Linux thật trong máy ảo nhẹ; nền của Docker Desktop trên Windows.</span></div>
  <div class="kv"><span class="k">host.docker.internal / host-gateway</span><span class="v">Tên chỉ "chính máy của tôi" khi đứng trong container; trên Linux thêm bằng <code>--add-host=…:host-gateway</code>.</span></div>
  <div class="kv"><span class="k">Platform (nền tảng: arm64 / amd64)</span><span class="v">Kiến trúc CPU mà file nhị phân trong image được dựng cho; chọn bằng <code>--platform</code>.</span></div>
  <div class="kv"><span class="k">Rosetta 2 (bộ dịch của Apple)</span><span class="v">Trình dịch x86 sang arm của Apple; chạy image amd64 trên chip Apple nhanh hơn QEMU.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Trên Mac và Windows mọi container chạy trong một máy ảo Linux; RAM, CPU và đĩa của nó — không phải của laptop — mới là giới hạn.</li>
<li><code>Docker.raw</code> là file thưa: đánh giá cỡ của nó bằng <code>du</code>, thu nhỏ nó bằng prune cẩn thận bên trong Docker.</li>
<li>Bind mount vượt vách máy ảo: chậm 15× với file nhỏ ở đây, nên giữ <code>node_modules</code> và kết quả build trong volume.</li>
<li>Trên Windows, để mã trong hệ file Linux của WSL, không thì cả tốc độ lẫn việc nạp lại dựa trên inotify đều hỏng.</li>
<li><code>host.docker.internal</code> có sẵn trên Docker Desktop; trên Linux thêm <code>host-gateway</code> qua <code>extra_hosts</code>.</li>
<li>Khớp kiến trúc của image với nơi nó chạy; Rosetta giúp amd64 chạy tạm được trên Mac, nhưng hãy đem đi image dựng cho server.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/subscription/desktop-license/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Giấy phép Docker Desktop</span><span class="lc-sub">Ai được dùng miễn phí và ai phải mua gói — kiểm lại trước khi dùng ở công ty.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/desktop/features/wsl/best-practices/" target="_blank" rel="noopener">
  <span class="lc-ico">🪟</span>
  <span class="lc-body"><span class="lc-title">WSL 2 best practices — Docker Docs</span><span class="lc-sub">Vì sao mã phải nằm trong hệ file Linux, gồm cả luật về inotify.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/desktop/settings-and-maintenance/settings/" target="_blank" rel="noopener">
  <span class="lc-ico">🎛️</span>
  <span class="lc-body"><span class="lc-title">Thiết lập của Docker Desktop</span><span class="lc-sub">Giới hạn bộ nhớ, CPU, swap và đĩa, cách chia sẻ file và tuỳ chọn Rosetta.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/desktop/features/networking/" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Mạng của Docker Desktop</span><span class="lc-sub"><code>host.docker.internal</code> và chỗ mạng của Desktop khác với Linux.</span></span>
</a>
<a class="link-card" href="https://github.com/abiosoft/colima" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Colima</span><span class="lc-sub">Máy ảo chạy container mã nguồn mở cho macOS và Linux, với các cờ Rosetta và tài nguyên.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trong Code Lab: Docker</span><span class="lc-sub">Các bài tập Docker có chấm điểm để tay luôn quen lệnh.</span></span>
</a>

<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Trên laptop, Docker là một máy ảo Linux: giới hạn của nó là giới hạn của bạn, và <code>docker info</code> cho bạn biết giới hạn đó. Mọi thứ vượt qua vách máy ảo — bind mount, sự kiện file, <code>localhost</code> — đều tốn một cái giá hoặc cư xử khác đi, nên giữ thư mục nặng trong volume và mã trong WSL. Và con chip quan trọng: dựng image cho đúng cái máy sẽ chạy nó.</p>
</div>
`,
    },
    /* ─────────────────────────── 13.5 ─────────────────────────── */
    {
      title: '13.5 — Quiz: Docker in your daily dev loop|||13.5 — Trắc nghiệm: Docker trong vòng lặp phát triển',
      slug: 'dk-13-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười tình huống thật của vòng lặp phát triển: node_modules bị bind mount che, restart chậm vì PID 1, node --watch mất dấu sau khi compose sync, debugger không gắn được, healthcheck báo sẵn sàng quá sớm, tmpfs trên Linux và Mac, seed không chạy lại, forwardPorts với CLI, mã trên ổ C: của Windows, và exec format error.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from a team's ordinary week: a teammate's container that will not start, a reload that stopped working, a flaky test, a Windows laptop that behaves differently. Each answer is something you can prove on your own machine with the commands from this chapter. Read every explanation after submitting — especially for the questions you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write a <code>devcontainer.json</code>, start it with <code>@devcontainers/cli up</code>, and explain the bind mount and labels in its <code>docker run</code> line.</li>
<li>I can explain why <code>-v .:/app</code> hides <code>node_modules</code> and fix it with an anonymous volume.</li>
<li>I can choose between a bind mount and <code>compose watch</code>, and pick a watcher that keeps reloading.</li>
<li>I can attach a debugger to Node in a container without exposing port 9229 to the network.</li>
<li>I can start a throwaway Postgres on tmpfs, wait for it correctly, seed it and run tests against it.</li>
<li>I can explain what Docker Desktop's VM changes: memory, bind mount speed, WSL paths, <code>host.docker.internal</code> and CPU architecture.</li>
</ul>
${slide('dk-13', 28, 'Bảng tra nhanh Chương 13')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Trắc nghiệm</span>
<h2>Kiểm lại xem đọng được gì</h2>
<p class="lead">Mười tình huống trong một tuần bình thường của một nhóm: container của bạn cùng nhóm không chịu lên, việc nạp lại tự nhiên ngừng chạy, một bộ test lúc được lúc không, một laptop Windows cư xử khác hẳn. Câu trả lời nào cũng chứng minh được trên chính máy bạn bằng các lệnh của chương này. Đọc mọi lời giải thích sau khi nộp — nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được một <code>devcontainer.json</code>, bật nó bằng <code>@devcontainers/cli up</code>, và giải thích được bind mount cùng các nhãn trong dòng <code>docker run</code> của nó.</li>
<li>Tôi giải thích được vì sao <code>-v .:/app</code> che mất <code>node_modules</code> và sửa được bằng một volume ẩn danh.</li>
<li>Tôi chọn được giữa bind mount và <code>compose watch</code>, và chọn được trình theo dõi nạp lại đều đặn.</li>
<li>Tôi gắn được debugger vào Node trong container mà không để lộ cổng 9229 ra mạng.</li>
<li>Tôi bật được một Postgres dùng-một-lần trên tmpfs, chờ nó đúng cách, seed nó và chạy test trên nó.</li>
<li>Tôi giải thích được máy ảo của Docker Desktop làm thay đổi những gì: bộ nhớ, tốc độ bind mount, đường dẫn WSL, <code>host.docker.internal</code> và kiến trúc CPU.</li>
</ul>
${slide('dk-13', 28, 'Bảng tra nhanh Chương 13')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'The API Dockerfile runs npm ci and the image works with docker run. A teammate adds volumes: [".:/app"] to compose for hot reload, and now the logs say Error: Cannot find module "express". What happened?|||Dockerfile của API có chạy npm ci và image chạy tốt bằng docker run. Một bạn thêm volumes: [".:/app"] vào compose để hot reload, và giờ log báo Error: Cannot find module "express". Chuyện gì đã xảy ra?',
            options: [
              'npm ci failed silently during the build because the lockfile was out of date, so the image never contained express|||npm ci đã hỏng âm thầm lúc build vì file khoá lỗi thời, nên image chưa bao giờ có express',
              'The bind mount covers /app completely, hiding the image’s node_modules; add an anonymous volume - /app/node_modules|||Bind mount phủ kín /app, giấu node_modules của image; thêm volume ẩn danh - /app/node_modules',
              'express must be moved to devDependencies, because compose starts containers in development mode|||Phải chuyển express sang devDependencies, vì compose khởi động container ở chế độ development',
              '.dockerignore excluded node_modules, so it was deleted from the image when the container started|||.dockerignore đã loại node_modules, nên nó bị xoá khỏi image khi container khởi động',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: A bind mount does not merge with the image; it covers the whole path, so the node_modules built by npm ci is still in the image but invisible. A more specific anonymous volume at /app/node_modules covers it again and starts as a copy of the image’s folder. The .dockerignore answer is tempting, but .dockerignore only controls what is sent to the build — it cannot delete anything from an image at run time, and the same image worked without the mount.|||VI: Bind mount không trộn với image; nó phủ kín cả đường dẫn, nên node_modules do npm ci tạo vẫn nằm trong image nhưng vô hình. Một volume ẩn danh cụ thể hơn ở /app/node_modules phủ lại lần nữa và khởi đầu là bản sao thư mục của image. Đáp án .dockerignore rất hấp dẫn, nhưng .dockerignore chỉ quyết định thứ gì được gửi đi build — nó không xoá được gì khỏi image lúc chạy, và chính image đó chạy tốt khi không có mount.',
          },
          {
            question: 'With docker compose watch and action: sync+restart, every save on your Mac takes almost 5 seconds to show up. The log shows "Container … Restarting" then "Started". The API is plain node src/server.js without a SIGTERM handler. What is the cheapest fix?|||Dùng docker compose watch với action: sync+restart, mỗi lần lưu trên Mac mất gần 5 giây mới thấy. Log hiện "Container … Restarting" rồi "Started". API chạy node src/server.js trần, không có hàm xử lý SIGTERM. Cách sửa rẻ nhất là gì?',
            options: [
              'Switch file sharing from VirtioFS to gRPC FUSE, because VirtioFS delays the sync of each changed file|||Đổi chia sẻ file từ VirtioFS sang gRPC FUSE, vì VirtioFS làm chậm việc đồng bộ từng file',
              'Lower the watch debounce in develop.watch, since Compose waits five seconds before syncing by default|||Giảm độ trễ gom sự kiện trong develop.watch, vì mặc định Compose chờ năm giây rồi mới đồng bộ',
              'Change the rule to action: rebuild, so Compose replaces the container instead of restarting it|||Đổi luật thành action: rebuild, để Compose thay container thay vì khởi động lại nó',
              'Add init: true (or handle SIGTERM), because Node as PID 1 ignores SIGTERM and every restart waits for the stop timeout|||Thêm init: true (hoặc bắt SIGTERM), vì Node làm PID 1 phớt lờ SIGTERM và mỗi lần restart đều chờ hết hạn dừng',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: A restart is a stop plus a start, and a stop sends SIGTERM. Node running as PID 1 with no handler ignores it, so Docker waits for its timeout (about 3 s on Docker Desktop) before killing. In the lesson, init: true cut each save from 4.7 s to 1.67 s. rebuild would be slower still — it runs a build and recreates the container — and the file sync itself was not the slow part.|||VI: Restart là dừng cộng bật, và dừng thì gửi SIGTERM. Node làm PID 1 không có hàm xử lý thì phớt lờ nó, nên Docker chờ hết hạn (khoảng 3 s trên Docker Desktop) rồi mới giết. Trong bài, init: true cắt mỗi lần lưu từ 4,7 s còn 1,67 s. rebuild còn chậm hơn nữa — nó chạy build và tạo lại container — và chính khâu đồng bộ file không phải phần chậm.',
          },
          {
            question: 'You use compose watch with action: sync and command node --watch src/server.js. The first edit reloads; after that, edits never show up, although docker compose exec api cat src/msg.js prints the new content. Why?|||Bạn dùng compose watch với action: sync và lệnh node --watch src/server.js. Lần sửa đầu có nạp lại; sau đó không lần sửa nào hiện ra, dù docker compose exec api cat src/msg.js in đúng nội dung mới. Vì sao?',
            options: [
              'Sync replaces the file by writing a new one and renaming it; node --watch follows individual files and loses track, while a directory watcher such as nodemon keeps working|||Sync thay file bằng cách ghi file mới rồi đổi tên; node --watch bám theo từng file nên mất dấu, còn trình theo dõi thư mục như nodemon vẫn chạy',
              'Compose stops watching after the first sync until you run docker compose watch again with the --no-up flag|||Compose ngừng theo dõi sau lần đồng bộ đầu cho tới khi bạn chạy lại docker compose watch với cờ --no-up',
              'The container ran out of inotify watches, which are limited to one per file on Docker Desktop|||Container đã cạn số lượt theo dõi inotify, vốn bị giới hạn một lượt cho mỗi file trên Docker Desktop',
              'node --watch only reloads when package.json changes, so source edits require action: sync+restart|||node --watch chỉ nạp lại khi package.json đổi, nên sửa mã nguồn thì phải dùng action: sync+restart',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: A watcher inside the container showed a file rename event on the first sync and only directory events afterwards: the synced file arrives as a new file swapped into place. node --watch (and --watch-path) tracked the original file and went deaf; nodemon, which watches directories, reloaded every time in about 0.65 s. Compose kept syncing — its log printed "Syncing service" for every edit — so the watcher, not the sync, was the problem.|||VI: Một trình theo dõi đặt trong container cho thấy một sự kiện đổi tên file ở lần đồng bộ đầu và từ đó chỉ còn sự kiện của thư mục: file được đồng bộ tới dưới dạng một file mới tráo vào chỗ cũ. node --watch (cả --watch-path) bám file ban đầu nên bị điếc; nodemon theo dõi thư mục nên lần nào cũng nạp lại, khoảng 0,65 s. Compose vẫn đồng bộ đều — log in "Syncing service" mỗi lần sửa — nên lỗi nằm ở trình theo dõi chứ không ở khâu đồng bộ.',
          },
          {
            question: 'You start the API with docker run -p 127.0.0.1:9229:9229 … node --inspect src/server.js. The log says "Debugger listening on ws://127.0.0.1:9229/…", but VS Code cannot attach and curl localhost:9229/json/list prints "Empty reply from server". What is wrong?|||Bạn bật API bằng docker run -p 127.0.0.1:9229:9229 … node --inspect src/server.js. Log báo "Debugger listening on ws://127.0.0.1:9229/…", nhưng VS Code không gắn vào được và curl localhost:9229/json/list in "Empty reply from server". Sai ở đâu?',
            options: [
              'The -p flag must be 0.0.0.0:9229:9229, because Docker Desktop cannot forward ports bound to the Mac’s loopback|||Cờ -p phải là 0.0.0.0:9229:9229, vì Docker Desktop không chuyển tiếp được cổng gắn vào loopback của Mac',
              'Node’s inspector refuses connections from outside the process unless --inspect-brk is used instead of --inspect|||Inspector của Node từ chối kết nối từ bên ngoài tiến trình trừ khi dùng --inspect-brk thay cho --inspect',
              'Inside the container 127.0.0.1 is the container itself; the inspector must listen on --inspect=0.0.0.0:9229 so published traffic reaches it|||Bên trong container, 127.0.0.1 là chính container; inspector phải nghe ở --inspect=0.0.0.0:9229 thì lưu lượng từ cổng đã mở mới tới được',
              'VS Code needs the remoteRoot setting first; without it the inspector closes connections it cannot map to files|||VS Code cần thiết lập remoteRoot trước; thiếu nó thì inspector đóng các kết nối không ánh xạ được sang file',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Published ports deliver traffic to the container’s network interface, but --inspect listens only on the container’s own loopback, so nobody answers — exactly the "Empty reply" measured in the lesson. --inspect=0.0.0.0:9229 fixes the inside; keeping -p 127.0.0.1:… on the outside is correct and important, because 0.0.0.0 on the host would expose a code-execution port to the network. remoteRoot only maps breakpoints to files; it does not affect whether the connection opens.|||VI: Cổng đã mở đưa lưu lượng tới card mạng của container, nhưng --inspect chỉ nghe trên loopback của chính container, nên chẳng ai trả lời — đúng cái "Empty reply" đo được trong bài. --inspect=0.0.0.0:9229 sửa phía trong; giữ -p 127.0.0.1:… ở phía ngoài là đúng và quan trọng, vì 0.0.0.0 trên máy chủ sẽ để lộ một cổng chạy-mã-tuỳ-ý ra mạng. remoteRoot chỉ ánh xạ breakpoint sang file; nó không quyết định kết nối có mở được hay không.',
          },
          {
            question: 'Your compose.test.yaml uses healthcheck pg_isready -U postgres and up -d --wait. Most runs pass, but sometimes the first test fails with ECONNREFUSED or finds tables missing. What should change?|||compose.test.yaml của bạn dùng healthcheck pg_isready -U postgres và up -d --wait. Phần lớn các lần chạy đều qua, nhưng thỉnh thoảng test đầu tiên hỏng với ECONNREFUSED hoặc thấy thiếu bảng. Nên đổi gì?',
            options: [
              'Replace --wait with sleep 10, because --wait returns as soon as the container is running, not when it is healthy|||Thay --wait bằng sleep 10, vì --wait trả về ngay khi container chạy, không phải khi nó khoẻ',
              'Make the healthcheck use TCP (pg_isready -h 127.0.0.1), because on first boot a temporary server answers on the Unix socket while the seed is still running|||Cho healthcheck đi TCP (pg_isready -h 127.0.0.1), vì ở lần khởi động đầu một server tạm trả lời trên Unix socket trong lúc seed còn đang chạy',
              'Move the data directory from tmpfs to a named volume, because tmpfs is erased between healthcheck probes|||Chuyển thư mục dữ liệu từ tmpfs sang named volume, vì tmpfs bị xoá giữa các lần hỏi healthcheck',
              'Increase the healthcheck interval to 30 s so Postgres has time to finish before the first probe|||Tăng interval của healthcheck lên 30 s để Postgres kịp xong trước lần hỏi đầu tiên',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: The postgres image initialises with a temporary server that listens only on the Unix socket, runs the init scripts, shuts down, then starts the real server on 5432 — "ready to accept connections" appears twice, 220 ms apart in the lesson’s log. pg_isready without -h uses the socket and can pass during the temporary phase. --wait does wait for healthy; the problem is that "healthy" was measured the wrong way. A 30 s interval only makes every run slower, and a sleep is a guess.|||VI: Image postgres khởi tạo bằng một server tạm chỉ nghe trên Unix socket, chạy các script khởi tạo, tắt đi, rồi mới bật server thật ở 5432 — "ready to accept connections" xuất hiện hai lần, cách nhau 220 ms trong log của bài. pg_isready không có -h thì đi socket và có thể qua ngay trong giai đoạn tạm. --wait có chờ tới khi khoẻ; vấn đề là "khoẻ" bị đo sai cách. Interval 30 s chỉ làm lần nào cũng chậm hơn, còn sleep là đoán mò.',
          },
          {
            question: 'A classmate moved the CI test database to tmpfs and the integration suite became about 15 times faster on GitHub Actions. On her MacBook the same change made no difference. Why?|||Một bạn cùng lớp chuyển CSDL test trong CI sang tmpfs và bộ test tích hợp nhanh hơn khoảng 15 lần trên GitHub Actions. Trên MacBook của bạn ấy, cùng thay đổi đó chẳng khác gì. Vì sao?',
            options: [
              'On Linux every COMMIT waits for fsync on a real disk and RAM removes that wait; Docker Desktop’s virtual disk already answers fsync quickly|||Trên Linux mỗi COMMIT chờ fsync trên đĩa thật và RAM xoá khoản chờ đó; đĩa ảo của Docker Desktop vốn đã trả lời fsync rất nhanh',
              'Docker Desktop ignores --tmpfs on macOS and silently mounts a normal volume instead|||Docker Desktop bỏ qua --tmpfs trên macOS và lặng lẽ gắn một volume thường thay vào',
              'GitHub runners have more RAM, and tmpfs speed depends on how much free memory the machine has|||Runner GitHub có nhiều RAM hơn, và tốc độ của tmpfs phụ thuộc vào máy còn bao nhiêu bộ nhớ trống',
              'Apple chips run PostgreSQL through Rosetta, which hides the difference between disk and memory|||Chip Apple chạy PostgreSQL qua Rosetta, và Rosetta che mất khác biệt giữa đĩa và bộ nhớ',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Measured with pgbench: on Linux, tmpfs gave 7,328 tps against 468 on a volume, and a volume with fsync=off matched tmpfs — proving fsync is the whole difference. On the Mac, volume and tmpfs were within noise (2,745 vs 2,120 tps). The tmpfs mount is real on Docker Desktop (docker inspect shows it), and the arm64 postgres image runs natively, not through Rosetta.|||VI: Đo bằng pgbench: trên Linux, tmpfs đạt 7.328 tps so với 468 trên volume, và volume với fsync=off bằng tmpfs — chứng minh fsync là toàn bộ khác biệt. Trên Mac, volume và tmpfs chênh nhau trong mức nhiễu (2.745 và 2.120 tps). Mount tmpfs trên Docker Desktop là thật (docker inspect cho thấy nó), và image postgres arm64 chạy gốc chứ không qua Rosetta.',
          },
          {
            question: 'You added a new column to seed/01-schema.sql, ran docker compose -f compose.test.yaml up -d --wait again, and the tests still see the old table. The test DB mounts a named volume pgtest at /var/lib/postgresql/data. What explains it?|||Bạn thêm một cột vào seed/01-schema.sql, chạy lại docker compose -f compose.test.yaml up -d --wait, và test vẫn thấy bảng cũ. CSDL test gắn một named volume pgtest vào /var/lib/postgresql/data. Điều gì giải thích chuyện này?',
            options: [
              'Compose caches files mounted read-only (:ro), so the seed folder must be mounted read-write to see changes|||Compose lưu đệm các file gắn chỉ-đọc (:ro), nên phải gắn thư mục seed ở chế độ đọc-ghi mới thấy thay đổi',
              'Seed files must be named with a number higher than the last one that ran, or Postgres skips them|||File seed phải được đặt tên với số lớn hơn file đã chạy lần trước, không thì Postgres bỏ qua',
              'up -d reuses the running container, and init scripts run only when a container is created, so docker restart is needed|||up -d dùng lại container đang chạy, và script khởi tạo chỉ chạy khi container được tạo, nên cần docker restart',
              'Init scripts run only when the data directory is empty; the named volume already holds an initialised database, so they are skipped|||Script khởi tạo chỉ chạy khi thư mục dữ liệu trống; named volume đã chứa một CSDL được khởi tạo, nên chúng bị bỏ qua',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: The postgres entrypoint runs /docker-entrypoint-initdb.d only for an empty data directory. A named volume survives down and up, so from the second run on every seed script is silently skipped. Use tmpfs for test databases (empty on every start) or down -v. Restarting the container would not help either: the data directory would still be initialised.|||VI: Entrypoint của postgres chỉ chạy /docker-entrypoint-initdb.d khi thư mục dữ liệu trống. Named volume sống qua down và up, nên từ lần chạy thứ hai mọi script seed đều lặng lẽ bị bỏ qua. Hãy dùng tmpfs cho CSDL test (trống ở mỗi lần khởi động) hoặc down -v. Restart container cũng không giúp gì: thư mục dữ liệu vẫn là thư mục đã khởi tạo.',
          },
          {
            question: 'Your devcontainer.json has "forwardPorts": [3000]. You start it with npx @devcontainers/cli up, run the dev server inside, and localhost:3000 on your Mac does not answer. docker ps shows an empty Ports column. Why?|||devcontainer.json của bạn có "forwardPorts": [3000]. Bạn bật nó bằng npx @devcontainers/cli up, chạy dev server bên trong, và localhost:3000 trên Mac không trả lời. docker ps hiện cột Ports rỗng. Vì sao?',
            options: [
              'forwardPorts only accepts ports above 1024 on macOS, so 3000 must be written as "3000:3000"|||forwardPorts trên macOS chỉ nhận cổng trên 1024, nên 3000 phải viết thành "3000:3000"',
              'The dev server must listen on 127.0.0.1 inside the container for forwarding to find it|||Dev server phải nghe ở 127.0.0.1 bên trong container thì việc chuyển cổng mới tìm thấy nó',
              'forwardPorts is performed by the editor (VS Code), not by Docker; with the CLI use appPort or runArgs with -p|||forwardPorts do trình soạn thảo (VS Code) thực hiện, không phải Docker; dùng CLI thì phải dùng appPort hoặc runArgs với -p',
              'The CLI publishes forwarded ports only after postStartCommand succeeds, and none was defined|||CLI chỉ mở các cổng chuyển tiếp sau khi postStartCommand thành công, mà file không khai lệnh đó',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: The devcontainer specification distinguishes forwarding (done by the tool over its own connection, appearing as localhost) from publishing (appPort, a Docker port mapping). The CLI ignores forwardPorts — the lesson’s docker ps showed an empty Ports column — so add "appPort": [3000] or "runArgs": ["-p", "3000:3000"]. Listening on 127.0.0.1 inside would make publishing fail, not succeed.|||VI: Đặc tả devcontainer phân biệt chuyển cổng (do công cụ làm qua kết nối riêng, hiện ra như localhost) với mở cổng (appPort, một ánh xạ cổng của Docker). CLI bỏ qua forwardPorts — docker ps trong bài hiện cột Ports rỗng — nên hãy thêm "appPort": [3000] hoặc "runArgs": ["-p", "3000:3000"]. Nghe ở 127.0.0.1 bên trong còn làm việc mở cổng hỏng, chứ không làm nó chạy.',
          },
          {
            question: 'A teammate on Windows keeps the project in C:\\Users\\an\\swp391 and runs docker compose up from PowerShell. npm ci takes minutes and nodemon never reloads after edits; on your Mac both are fine. What is the right fix?|||Một bạn dùng Windows để dự án ở C:\\Users\\an\\swp391 và chạy docker compose up từ PowerShell. npm ci mất vài phút và nodemon không bao giờ nạp lại sau khi sửa; trên Mac của bạn thì cả hai đều ổn. Cách sửa đúng là gì?',
            options: [
              'Clone the repo inside the WSL distribution (e.g. ~/swp391) and work from there; containers only get inotify events and fast I/O for files in the Linux filesystem|||Clone repo vào trong bản phân phối WSL (vd ~/swp391) và làm việc từ đó; container chỉ nhận sự kiện inotify và I/O nhanh với file trong hệ file Linux',
              'Switch Docker Desktop from the WSL 2 backend to Hyper-V, which shares Windows folders natively|||Chuyển Docker Desktop từ nền WSL 2 sang Hyper-V, vốn chia sẻ thư mục Windows một cách tự nhiên',
              'Add CHOKIDAR_USEPOLLING=true and increase the VM memory, because Windows limits containers to 2 GB|||Thêm CHOKIDAR_USEPOLLING=true và tăng bộ nhớ máy ảo, vì Windows giới hạn container ở 2 GB',
              'Write the bind mount with a Windows path (C:\\Users\\an\\swp391:/app) instead of ./ so Docker uses the fast path|||Viết bind mount bằng đường dẫn Windows (C:\\Users\\an\\swp391:/app) thay cho ./ để Docker đi đường nhanh',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Docker’s WSL best-practice page says bind mounts are much faster from the Linux filesystem and that Linux containers receive inotify events only when the files are stored there. Code on C: crosses the VM boundary for every file operation. Polling can make a watcher work but burns CPU and leaves npm ci slow; a hard-coded Windows path is worse still, because the compose file then breaks on every other machine.|||VI: Trang best practice WSL của Docker nói bind mount từ hệ file Linux nhanh hơn nhiều và container Linux chỉ nhận sự kiện inotify khi file nằm ở đó. Mã để trên ổ C: phải vượt ranh giới máy ảo cho mọi thao tác file. Polling (hỏi vòng) có thể làm trình theo dõi chạy được nhưng đốt CPU và npm ci vẫn chậm; ghi cứng đường dẫn Windows còn tệ hơn, vì file compose sẽ hỏng trên mọi máy khác.',
          },
          {
            question: 'You build the API image on your M1 Mac with docker build -t ghcr.io/team/api:1 . and push it. On the amd64 VPS the container exits immediately with "exec format error". What went wrong and how do you fix it?|||Bạn build image API trên Mac M1 bằng docker build -t ghcr.io/team/api:1 . rồi đẩy lên. Trên VPS amd64, container thoát ngay với "exec format error". Sai ở đâu và sửa thế nào?',
            options: [
              'The VPS is missing Rosetta 2; install the binfmt handler on the server so it can run arm64 binaries|||VPS thiếu Rosetta 2; cài bộ xử lý binfmt trên server để nó chạy được file nhị phân arm64',
              'The image contains only arm64 binaries; build for the target with docker buildx build --platform linux/amd64 (or build in CI)|||Image chỉ chứa file nhị phân arm64; build cho đúng đích bằng docker buildx build --platform linux/amd64 (hoặc build trong CI)',
              'The base image uses musl and the VPS uses glibc; switch the base image from Alpine to Debian|||Image nền dùng musl còn VPS dùng glibc; đổi image nền từ Alpine sang Debian',
              'GHCR converted the image to OCI format during the push; pull it with --platform linux/arm64 on the VPS|||GHCR đã đổi image sang định dạng OCI lúc đẩy; kéo về trên VPS bằng --platform linux/arm64',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: A plain docker build on an Apple chip produces an arm64 image, and an amd64 kernel cannot execute arm64 machine code — that is what "exec format error" means. Build for the machine that will run it (--platform linux/amd64, or a multi-platform build) and check with docker image inspect -f "{{.Architecture}}". The musl/glibc answer is the course’s other famous outage, but it shows up as missing libraries or crashes of one binary, not as exec format error on the entrypoint; Rosetta exists only on Macs.|||VI: docker build trần trên chip Apple cho ra image arm64, mà nhân amd64 không chạy được mã máy arm64 — đó chính là nghĩa của "exec format error". Hãy build cho đúng máy sẽ chạy nó (--platform linux/amd64, hoặc build đa nền tảng) và kiểm bằng docker image inspect -f "{{.Architecture}}". Đáp án musl/glibc là sự cố nổi tiếng khác của khoá, nhưng nó hiện ra dưới dạng thiếu thư viện hoặc một file nhị phân sập, không phải exec format error ngay ở entrypoint; còn Rosetta chỉ có trên Mac.',
          },
        ],
      },
    },
  ],
};
