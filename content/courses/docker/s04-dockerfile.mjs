/**
 * Docker — Chương 4: Dockerfile từ cơ bản tới trôi chảy.
 * Dockerfile đầu tiên · bảng chỉ thị · CMD với ENTRYPOINT · ARG với ENV ·
 * công thức theo ngôn ngữ · quiz.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → &#36;{;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 *
 * Nâng cấp 09/2026: bài 4.0 slide (deck dk-04, 32 slide) + slide/🧪/🗂/📌 + phần đào sâu trong 4.1–4.5;
 * quiz 10 câu. Output MỚI chạy thật 23/09/2026 trên Docker Desktop 4.91 / Engine 29.8 (Mac M1, arm64,
 * BuildKit) và Docker Engine 29.6 (Fedora 44, amd64 — mọi phép đo thời gian dừng). Năm công thức của 4.5
 * đều được DỰNG và CHẠY thật. Dạng thoát cũ của ${VAR} trong nội dung đã đổi thành &#36;{VAR} (luật của bộ kiểm dk-ghep-chuong).
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 4 — Dockerfile, from basics to fluent|||Chương 4 — Dockerfile, từ cơ bản tới trôi chảy',
  description: 'Viết một Dockerfile bạn hiểu từng dòng: ngữ cảnh dựng và .dockerignore, mọi chỉ thị kèm hành vi thật của nó, khác biệt CMD với ENTRYPOINT, ARG với ENV, và công thức chuẩn cho Node, Python, Go và trang tĩnh.',
  lessons: [
    /* ─────────────────────────── 4.0 ─────────────────────────── */
    {
      title: '4.0 — Chapter 4 slides: every Dockerfile line, explained in pictures|||4.0 — Slide Chương 4: từng dòng Dockerfile, giải thích bằng hình',
      slug: 'dk-4-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 4: Dockerfile đầu tiên đọc từng dòng, ngữ cảnh dựng đo bằng MB thật, 18 chỉ thị và cái giá của chúng, bảng ENTRYPOINT × CMD, ARG so với ENV, và năm công thức Node/Next.js/Python/Go/trang tĩnh đã dựng và chạy thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">This is the chapter you will come back to most: every Dockerfile you write later is built from the pieces on these slides. Skim them before the lessons, then use them as a revision sheet — most of the Dockerfiles here carry a note in the margin of every single line saying what that line does and why it sits where it does.</p>
<p>Slides 3–7 belong to Lesson 4.1 (the first Dockerfile, and the build context measured in real megabytes), 8–13 to 4.2 (the instructions and what each one costs), 14–18 to 4.3 (ENTRYPOINT + CMD, shell versus exec form, entrypoint scripts), 19–23 to 4.4 (ARG versus ENV, stage scope, secrets) and 24–29 to 4.5 (five recipes that were really built and run). The last three are the chapter's common mistakes, a cheat sheet and a 45-minute practice session. Every terminal and every number is real output, recorded in September 2026 on Docker Desktop 4.91 (Mac M1) and Docker Engine 29.6 (Linux) — several of them contradict things the older version of this chapter claimed, and the lessons say so where it matters.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Đây là chương bạn sẽ quay lại nhiều nhất: mọi Dockerfile bạn viết về sau đều ghép từ những mảnh trên các slide này. Lướt qua trước khi vào bài, rồi dùng làm tờ ôn tập — phần lớn Dockerfile ở đây có ghi chú bên lề cho TỪNG dòng: dòng đó làm gì và vì sao nó đứng ở chỗ đó.</p>
<p>Slide 3–7 thuộc Bài 4.1 (Dockerfile đầu tiên, và ngữ cảnh dựng đo bằng megabyte thật), 8–13 thuộc 4.2 (các chỉ thị và cái giá của từng cái), 14–18 thuộc 4.3 (ENTRYPOINT + CMD, dạng shell so với dạng exec, script entrypoint), 19–23 thuộc 4.4 (ARG so với ENV, phạm vi stage, bí mật) và 24–29 thuộc 4.5 (năm công thức đã DỰNG và CHẠY thật). Ba slide cuối là những sai lầm hay gặp của chương, bảng tra nhanh và một buổi thực hành 45 phút. Mọi terminal và mọi con số là output THẬT, ghi tháng 9/2026 trên Docker Desktop 4.91 (Mac M1) và Docker Engine 29.6 (Linux) — vài con số trong đó ngược với điều bản cũ của chương này từng khẳng định, và bài giảng nói rõ ở chỗ cần nói.</p>
</div>
${gallery('dk-04', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Dockerfile đầu tiên, đọc từng dòng'], [4, 'Dấu chấm là ngữ cảnh dựng'], [5, 'Không có .dockerignore: 398 MB bị gửi'],
  [6, '.dockerignore'], [7, 'BuildKit chỉ gửi thứ COPY cần'],
  [8, '18 chỉ thị theo cái giá'], [9, 'RUN: shell mới, lỗi bị nuốt'], [10, 'COPY so với ADD'],
  [11, 'RUN chown -R nhân đôi ảnh'], [12, 'VOLUME và volume vô danh'], [13, 'Chỉ thị siêu dữ liệu'],
  [14, 'ENTRYPOINT + CMD = lệnh cuối'], [15, 'Bảng CMD × ENTRYPOINT'], [16, 'Dạng shell: Alpine khác Debian'],
  [17, 'Nháy đơn không phải JSON'], [18, 'Script entrypoint và exec "$@"'],
  [19, 'ARG lúc dựng, ENV lúc chạy'], [20, 'ARG trước FROM'], [21, 'Bí mật: secret mount'],
  [22, 'Bẫy NODE_ENV'], [23, 'ARG có sẵn và --build-arg gõ sai'],
  [24, 'Năm công thức: kích thước thật'], [25, 'Công thức Node + TypeScript'], [26, 'Công thức Next.js standalone'],
  [27, 'Ba cái bẫy Next.js'], [28, 'Công thức Python'], [29, 'Công thức Go và trang tĩnh'],
  [30, 'Sai lầm hay gặp'], [31, 'Bảng tra nhanh'], [32, 'Thực hành chương 4'],
])}
`,
    },
    /* ─────────────────────────── 4.1 ─────────────────────────── */
    {
      title: '4.1 — Your first Dockerfile, and the build context|||4.1 — Dockerfile đầu tiên, và ngữ cảnh dựng',
      slug: 'dk-4-1-dockerfile-dau-tien',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Dựng một ứng dụng Node thật từ đầu, hiểu dấu chấm ở cuối docker build, vì sao ngữ cảnh dựng làm bản dựng của bạn chậm, và .dockerignore sửa nó ra sao.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Your first Dockerfile, and the build context</h2>
<p class="lead">A Dockerfile is a script that produces an image. Every instruction runs in order, most of them create a layer (Lesson 1.2), and the result is a filesystem plus the metadata to start a process in it. This lesson builds a real application and then explains the part of <code>docker build</code> that nobody explains: the dot at the end.</p>

<h3>A real application</h3>
${slide('dk-04', 3, 'Dockerfile đầu tiên — mỗi dòng một bước, ghi chú bên lề từng dòng')}
<pre><code>mkdir -p demo/src &amp;&amp; cd demo
cat &gt; package.json &lt;&lt;'EOF'
{ "name": "demo", "version": "1.0.0", "type": "module",
  "scripts": { "start": "node src/server.js" },
  "dependencies": { "express": "^4.21.1" } }
EOF
cat &gt; src/server.js &lt;&lt;'EOF'
import express from 'express';
const app = express();
app.get('/health', (_, res) =&gt; res.json({ ok: true, node: process.version }));
app.listen(3000, () =&gt; console.log('listening on 3000'));
EOF
npm install --package-lock-only --silent
ls</code></pre>
<div class="out">package-lock.json  package.json  src</div>
<p class="note-ct">Real output on the course's Mac (npm 10.9). An earlier version of this lesson showed a <code>node_modules</code> folder in this listing — but <code>--package-lock-only</code> writes the lockfile and installs <em>nothing</em>, which is exactly why it is used here: the image installs its own dependencies with <code>npm ci</code>. If you also run the app outside Docker with <code>npm install</code>, you will have a <code>node_modules</code> as well, and the build-context section below is about what that costs.</p>
<pre><code>cat &gt; Dockerfile &lt;&lt;'EOF'
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

EXPOSE 3000
CMD ["node", "src/server.js"]
EOF

docker build -t demo:1.0 .</code></pre>
<div class="out">[+] Building 6.4s (10/10) FINISHED
 =&gt; [internal] load build definition from Dockerfile                       0.0s
 =&gt; [internal] load metadata for docker.io/library/node:22-alpine          0.8s
 =&gt; [internal] load .dockerignore                                          0.0s
 =&gt; [internal] load build context                                          0.1s
 =&gt; =&gt; transferring context: 4.21kB                                        0.0s
 =&gt; [1/5] FROM docker.io/library/node:22-alpine@sha256:b8f2c1a4e9d3…       0.0s
 =&gt; [2/5] WORKDIR /app                                                     0.0s
 =&gt; [3/5] COPY package.json package-lock.json ./                           0.0s
 =&gt; [4/5] RUN npm ci --omit=dev                                            4.9s
 =&gt; [5/5] COPY src ./src                                                   0.0s
 =&gt; exporting to image                                                     0.4s
 =&gt; =&gt; naming to docker.io/library/demo:1.0                                0.0s</div>
<pre><code>docker run -d --name demo -p 3000:3000 demo:1.0
curl -s localhost:3000/health; echo
docker images demo --format '{{.Repository}}:{{.Tag}} {{.Size}}'</code></pre>
<div class="out">{"ok":true,"node":"v22.11.0"}
demo:1.0 190MB</div>
<p class="note-ct">The build log above was recorded on Docker Engine 27. On Docker 29 (the course's Mac, September 2026) the same build prints the same steps with fresh digests, the health check answers <code>{"ok":true,"node":"v22.23.2"}</code>, and <code>docker images</code> has two size columns instead of one (Lesson 1.2 explains them):</p>
<div class="out">IMAGE           ID             DISK USAGE   CONTENT SIZE   EXTRA
demo:1.0        b2e6c98cd711        240MB         60.1MB</div>

<h3>Line by line</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">FROM node:22-alpine</span><span class="lz-lnote">The starting filesystem. Every Dockerfile begins with one (or <code>FROM scratch</code> for an empty one). Pin at least the minor version — <code>FROM node</code> means "whatever <code>latest</code> is today", which is Lesson 3.2's outage.</span></div>
  <div class="lz-layer"><span class="lz-lname">WORKDIR /app</span><span class="lz-lnote">Sets the working directory for every later <code>RUN</code>, <code>CMD</code>, <code>COPY</code> and <code>ENTRYPOINT</code>, and creates it if missing. Always use this rather than <code>RUN cd /app</code> — each <code>RUN</code> is a separate shell, so a <code>cd</code> does not survive to the next line.</span></div>
  <div class="lz-layer"><span class="lz-lname">COPY package.json package-lock.json ./</span><span class="lz-lnote">Copies only the dependency manifests first. This ordering is the single most valuable thing in the file, and Chapter 5 is entirely about why.</span></div>
  <div class="lz-layer"><span class="lz-lname">RUN npm ci --omit=dev</span><span class="lz-lnote">Executes at <em>build</em> time and its filesystem changes become a layer. <code>npm ci</code> rather than <code>npm install</code>: it installs exactly the lockfile and fails if the lockfile and <code>package.json</code> disagree — which is what you want in a build.</span></div>
  <div class="lz-layer"><span class="lz-lname">COPY src ./src</span><span class="lz-lnote">The code, copied after dependencies because it changes far more often. Note <code>./src</code>, not <code>.</code>: copying only what you need keeps the layer small and the cache stable.</span></div>
  <div class="lz-layer"><span class="lz-lname">EXPOSE 3000</span><span class="lz-lnote">Pure documentation plus a hint for <code>-P</code>. It publishes nothing and opens no firewall — a common misconception. You still need <code>-p 3000:3000</code> at run time (Chapter 8).</span></div>
  <div class="lz-layer"><span class="lz-lname">CMD ["node", "src/server.js"]</span><span class="lz-lnote">The default command, in <strong>exec form</strong> — a JSON array, so your process becomes PID 1 and receives SIGTERM (Lesson 1.3). Never write it as a bare string unless you have read Lesson 4.3 and decided you want a shell.</span></div>
</div>

<h3>Run it step by step: from an empty folder to a running container</h3>
<p>If this is your first Dockerfile, here is the whole loop again as a sequence you can follow without thinking, with what to check after each step. Every later chapter repeats this same loop — only the Dockerfile gets more interesting.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Step 1 · the app runs WITHOUT Docker first (optional but wise)</span><span class="lz-t">npm install &amp;&amp; node src/server.js</span><span class="lz-d">If it does not run on your machine, Docker will not fix it. Stop it with <code>Ctrl+C</code> afterwards.</span></div>
  <div class="lz-step"><span class="lz-k">Step 2 · write .dockerignore, then the Dockerfile</span><span class="lz-t">.dockerignore · Dockerfile (no extension, capital D)</span><span class="lz-d">Both live in the project root, next to <code>package.json</code>. The order matters for your habits, not for Docker: ignore file first.</span></div>
  <div class="lz-step"><span class="lz-k">Step 3 · build and give the image a name</span><span class="lz-t">docker build -t demo:1.0 .</span><span class="lz-d">Check: the last lines say <code>naming to docker.io/library/demo:1.0</code> and no line starts with <code>ERROR</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Step 4 · look at what you built</span><span class="lz-t">docker images demo · docker history demo:1.0</span><span class="lz-d">One row per Dockerfile line in <code>history</code>, newest on top: the <code>RUN npm ci</code> row is the heavy one (9.64MB here), <code>COPY src</code> is 16.4kB.</span></div>
  <div class="lz-step"><span class="lz-k">Step 5 · run it and publish the port</span><span class="lz-t">docker run -d --name demo -p 3000:3000 demo:1.0</span><span class="lz-d">Check: <code>docker ps</code> shows it <code>Up</code>; <code>docker logs demo</code> shows <code>listening on 3000</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Step 6 · call it from the host</span><span class="lz-t">curl -s localhost:3000/health</span><span class="lz-d">JSON back = the whole chain works. Nothing back = go to Chapter 2's "container runs but I cannot reach it" checklist.</span></div>
  <div class="lz-step"><span class="lz-k">Step 7 · change code, rebuild, replace</span><span class="lz-t">docker build -t demo:1.1 . &amp;&amp; docker rm -f demo &amp;&amp; docker run -d --name demo -p 3000:3000 demo:1.1</span><span class="lz-d">A running container never picks up a new image by itself — you always create a new container from the new image.</span></div>
</div>
<table>
<tr><th>Piece of the command</th><th>What it means</th></tr>
<tr><td><code>docker build</code></td><td>Read a Dockerfile and produce an image. The work is done by the builder (BuildKit) inside the Docker daemon, not by the CLI.</td></tr>
<tr><td><code>-t demo:1.0</code></td><td>"tag": the name (<code>demo</code>) and version label (<code>1.0</code>) of the result. Without it you get an image known only by its ID.</td></tr>
<tr><td><code>-f path</code></td><td>Which Dockerfile to read. Default: the file called <code>Dockerfile</code> in the context directory.</td></tr>
<tr><td><code>.</code> (last argument)</td><td>The build context: the directory whose files <code>COPY</code> can see. Explained in the next section.</td></tr>
<tr><td><code>docker run -d</code></td><td>Create and start a container in the background.</td></tr>
<tr><td><code>-p 3000:3000</code></td><td>Host port 3000 → container port 3000. <code>EXPOSE</code> in the Dockerfile does NOT do this for you.</td></tr>
</table>
<div class="callout"><strong>Mac, Linux and Windows differ only in where the daemon lives.</strong> On Linux the CLI talks to <code>dockerd</code> on the same machine; on a Mac or on Windows with WSL2, <code>dockerd</code> runs inside Docker Desktop's Linux VM. Every command in this lesson is identical on all three. The one thing to watch on Windows is line endings: a Dockerfile or a <code>.sh</code> file saved with CRLF endings breaks in confusing ways (Lesson 4.3) — set your editor to LF for these files.</div>

<h3>The dot at the end: the build context</h3>
${slide('dk-04', 4, 'Dấu chấm cuối lệnh là ngữ cảnh — không phải Dockerfile')}
<pre><code><span class="tok-comment"># These are three different things, and only one is the Dockerfile</span>
docker build -t demo:1.0 .
<span class="tok-comment">#                        ^ the BUILD CONTEXT — a directory that gets uploaded</span>

docker build -t demo:1.0 -f docker/Dockerfile.api .
<span class="tok-comment">#                        ^^^^^^^^^^^^^^^^^^^^^^^ the Dockerfile   ^ still the context</span></code></pre>
<p>Before any instruction runs, the CLI packages up that directory and sends it to the daemon — because the daemon might be on another machine and cannot read your disk. Every <code>COPY</code> and <code>ADD</code> then reads from that uploaded copy, which is why <code>COPY ../shared /app</code> fails: the parent directory is not in the context, and no path outside it can ever be.</p>
<pre><code><span class="tok-comment"># Watch the cost when node_modules is sitting in the directory</span>
du -sh node_modules
docker build -t demo:1.0 . 2&gt;&amp;1 | grep -E 'transferring context|FINISHED'</code></pre>
<pre><code>docker build -t demo:1.0 .</code></pre>
<div class="out">3.9M	node_modules
 =&gt; =&gt; transferring context: 29.59kB                                       0.0s
[+] Building 0.2s (10/10) FINISHED                         docker:desktop-linux</div>
<p class="note-ct">Real output on the course's Mac (Docker 29.8, BuildKit), after running <code>npm install</code> outside Docker so that a <code>node_modules</code> really sits in the folder. An earlier version of this lesson showed <code>61M node_modules</code> and <code>transferring context: 61.44MB</code> here. Both were wrong: Express and its dependencies are 3.9MB, and — more importantly — BuildKit, the default builder since Engine 23, does not upload the whole directory. It asks only for the paths that the Dockerfile's <code>COPY</code> and <code>ADD</code> lines name, and on a rebuild only for what changed.</p>
<p>So with <em>this</em> Dockerfile (which copies <code>package.json</code>, <code>package-lock.json</code> and <code>src</code> by name), the <code>node_modules</code> on your disk is never sent: 29.59kB is the lockfile plus the source. The cost appears the moment a Dockerfile says <code>COPY . .</code> — which most real Dockerfiles do, including several later in this chapter. Then everything in the directory is sent, and everything that is sent ends up <strong>inside the image</strong>: your host's <code>node_modules</code>, your <code>.env</code>, your <code>.git</code>. The next section measures exactly that on a real project.</p>

<h3>Measure your build context: what is really being sent</h3>
${slide('dk-04', 5, 'Không có .dockerignore: 398 MB bị gửi đi — kèm cả .env và .git')}
${slide('dk-04', 7, 'BuildKit chỉ gửi thứ COPY cần — và chỉ gửi phần đã đổi')}
<p>You cannot see the build context directly — it lives inside the builder. But you can build a throwaway image whose only job is to copy the whole context and list it. The Dockerfile comes from standard input (<code>-f-</code>), so nothing is written to your project:</p>
<pre><code class="language-bash">docker build --no-cache --progress=plain -t ctx-check -f- . &lt;&lt;'EOF'
FROM busybox
COPY . /ctx
RUN du -sh /ctx &amp;&amp; find /ctx -type f | wc -l &amp;&amp; ls -A /ctx
EOF</code></pre>
<p>Run in the folder of a small but real Next.js project — one where you have already run <code>npm install</code> and <code>next build</code> on your machine, with a <code>.git</code> and a <code>.env.local</code>, exactly like a real repository — and <em>without</em> a <code>.dockerignore</code>:</p>
<div class="out">#5 transferring context: 397.69MB 4.2s done
#7 0.174 414.0M	/ctx
#7 0.174 11582
.env.local
.git
.gitignore
.next
app
next.config.js
node_modules
package-lock.json
package.json
public</div>
<p>Real output on the course's Mac, from a fresh copy of the folder so that nothing was cached. 397.69MB and 11,582 files were sent to the builder; the whole build took 21.1 seconds, because the <code>COPY . /ctx</code> then wrote 414MB into a layer. The same folder with the <code>.dockerignore</code> from the next section:</p>
<div class="out">#5 transferring context: 32.25kB done
#7 0.089 72.0K	/ctx
#7 0.089 8</div>
<p>32.25kB, eight files, 2.2 seconds end to end. Two things about how BuildKit sends the context are worth knowing, because they explain why your own measurements may look better than this on your machine and worse in CI:</p>
<table>
<tr><th>Situation (course's Mac, the small Express demo)</th><th>transferring context</th><th>Why</th></tr>
<tr><td>Dockerfile copies <code>package*.json</code> and <code>src</code> by name; a 3.9MB <code>node_modules</code> sits in the folder</td><td>29.59kB</td><td>BuildKit only requests paths that a <code>COPY</code> names</td></tr>
<tr><td>Dockerfile says <code>COPY . .</code>, first build in this folder</td><td>2.39MB</td><td>everything is requested, <code>node_modules</code> included</td></tr>
<tr><td><code>COPY . .</code>, rebuilt with no change</td><td>41.03kB</td><td>BuildKit keeps the last upload and sends only file metadata and changes</td></tr>
<tr><td><code>COPY . .</code> on a fresh CI runner</td><td>like the first build, every time</td><td>a new machine has nothing from last time</td></tr>
</table>
<div class="callout warn"><strong>"It is fast on my machine" does not mean the context is fine.</strong> The incremental upload hides the size from you after the first build, but CI starts from nothing on every run, and — much worse — whatever <code>COPY . .</code> sends is inside the image you push. The quick test above is the honest one: if <code>ls -A /ctx</code> shows <code>.env</code>, <code>.git</code> or <code>node_modules</code>, your image contains them too.</div>

<h3>.dockerignore fixes it</h3>
${slide('dk-04', 6, '.dockerignore — danh sách những thứ không được lên xe')}
<pre><code>cat &gt; .dockerignore &lt;&lt;'EOF'
# Never send these to the daemon
node_modules
.git
.env
.env.*
dist
build
coverage
*.log
.DS_Store
.vscode
.idea
Dockerfile*
docker-compose*.yml
README.md
EOF

docker build -t demo:1.0 . 2&gt;&amp;1 | grep -E 'transferring context|FINISHED'</code></pre>
<div class="out"> =&gt; =&gt; transferring context: 4.21kB                                        0.0s
[+] Building 0.9s (10/10) FINISHED</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Speed</span><span class="v">Measured on the Next.js project above: 397.69MB and 21 seconds down to 32.25kB and 2 seconds. On a repository with a <code>.git</code> directory full of history, this alone can turn a thirty-second build into a two-second one.</span></div>
  <div class="kv"><span class="k">Security</span><span class="v">Excluding <code>.env</code> and <code>.git</code> means a careless <code>COPY . .</code> cannot bake your credentials or your entire commit history into a published image. This is the reason <code>.dockerignore</code> is not optional.</span></div>
  <div class="kv"><span class="k">Cache stability</span><span class="v">Files in the context that change constantly — logs, editor state, build output — invalidate the <code>COPY</code> layer even when your source did not change. Excluding them keeps the cache warm (Chapter 5).</span></div>
  <div class="kv"><span class="k">Correctness</span><span class="v">A host <code>node_modules</code> built on macOS contains macOS-native binaries. If it leaked into a Linux image, you would get the <code>sharp</code> error from Lesson 0.1 — inside the container this time.</span></div>
  <div class="kv"><span class="k">Syntax</span><span class="v">Same pattern rules as <code>.gitignore</code>, with one addition: <code>!pattern</code> re-includes something excluded by an earlier line, so <code>*</code> then <code>!src</code> is a valid allow-list strategy.</span></div>
</div>
<div class="callout ok"><strong>Write <code>.dockerignore</code> before you write the Dockerfile.</strong> It is a two-minute file that speeds up every build you will ever run in that repository and closes the most common accidental-secret leak. Start from your <code>.gitignore</code> and add <code>.git</code> itself — which <code>.gitignore</code> obviously never mentions and which is often the biggest single directory in the context.</div>

<h3>Reading the build output</h3>
<pre><code>docker build -t demo:1.1 --progress=plain . 2&gt;&amp;1 | head -14</code></pre>
<div class="out">#1 [internal] load build definition from Dockerfile
#1 transferring dockerfile: 231B done
#2 [internal] load metadata for docker.io/library/node:22-alpine
#3 [internal] load .dockerignore
#3 transferring context: 195B done
#5 [1/5] FROM docker.io/library/node:22-alpine@sha256:b8f2c1a4e9d3…
#5 CACHED
#6 [internal] load build context
#6 transferring context: 4.21kB done
#7 [3/5] COPY package.json package-lock.json ./
#7 CACHED
#8 [4/5] RUN npm ci --omit=dev
#8 CACHED
#9 [5/5] COPY src ./src</div>
<div class="kv-grid">
  <div class="kv"><span class="k">CACHED</span><span class="v">That step was not re-run; its result came from a previous build. The whole of Chapter 5 is about maximising how many of these you see.</span></div>
  <div class="kv"><span class="k">--progress=plain</span><span class="v">Turns off the collapsing live display and prints every line of every command's output. This is what you use when a <code>RUN</code> fails and you need to see what it actually said.</span></div>
  <div class="kv"><span class="k">--no-cache</span><span class="v">Rebuild everything from scratch. Use it to prove a build is reproducible, and when a cached layer has gone stale in a way Docker cannot detect (Chapter 5's <code>apt-get update</code> problem).</span></div>
  <div class="kv"><span class="k">--pull</span><span class="v">Re-check the registry for a newer base image even if you have one locally. Belongs in scheduled CI builds so security patches actually arrive.</span></div>
  <div class="kv"><span class="k">-f path/to/Dockerfile</span><span class="v">A Dockerfile anywhere, with the context still chosen separately. This is how a monorepo keeps <code>docker/api.Dockerfile</code> and <code>docker/web.Dockerfile</code> next to each other.</span></div>
</div>
<pre><code>docker rm -f demo &gt;/dev/null; cd ..; rm -rf demo</code></pre>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your SWP391 team's API image takes a minute to build in GitHub Actions, and someone noticed a teammate's <code>.env</code> with the database password inside the published image. You are asked to find out what the build is sending and fix it — measured, not guessed.</p><ol>
<li>In <code>~/thu-docker</code>, recreate the demo app from the top of this lesson, run <code>npm install</code> once (so a <code>node_modules</code> exists, as on everyone's laptop) and add a fake secret: <code>echo 'DATABASE_URL=postgres://u:matkhau@db/app' &gt; .env</code>.</li>
<li>Change the Dockerfile's <code>COPY src ./src</code> to <code>COPY . .</code> (what most team Dockerfiles do), build it as <code>demo:leaky</code>, and prove the secret is inside: <code>docker run --rm demo:leaky cat /app/.env</code>.</li>
<li>Run the context check from the "Measure your build context" section and write down the size, the file count and the <code>ls -A</code> list.</li>
<li>Write the <code>.dockerignore</code> from this lesson, rebuild as <code>demo:clean</code>, and repeat both checks.</li>
<li>Clean up: <code>docker rmi demo:leaky demo:clean ctx-check</code>.</li></ol>
<pre><code class="language-bash">docker run --rm demo:clean cat /app/.env
docker run --rm demo:clean ls /app</code></pre>
<div class="out">cat: can't open '/app/.env': No such file or directory
node_modules
package-lock.json
package.json
src</div>
<p><strong>Done when:</strong> <code>demo:leaky</code> prints the password and <code>demo:clean</code> does not; the context check goes from megabytes and hundreds of files down to kilobytes and a handful of files; and you can explain why the <code>node_modules</code> listed in <code>demo:clean</code> is the one <code>npm ci</code> built inside the image, not yours.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dockerfile</span><span class="v">A text file of instructions, read top to bottom, that describes how to build an image.</span></div>
  <div class="kv"><span class="k">Instruction</span><span class="v">One line keyword such as <code>FROM</code>, <code>RUN</code>, <code>COPY</code>; the file-changing ones produce a layer.</span></div>
  <div class="kv"><span class="k">Build context</span><span class="v">The directory given as the last argument of <code>docker build</code>; the only files <code>COPY</code> and <code>ADD</code> can read.</span></div>
  <div class="kv"><span class="k">.dockerignore</span><span class="v">Patterns of files that are never sent to the builder, with the same syntax as <code>.gitignore</code>.</span></div>
  <div class="kv"><span class="k">BuildKit</span><span class="v">The builder inside Docker that runs the steps, caches them and requests context files; the default since Engine 23.</span></div>
  <div class="kv"><span class="k">Tag</span><span class="v">The human name of an image, <code>name:version</code>, set with <code>-t</code>.</span></div>
  <div class="kv"><span class="k">Base image</span><span class="v">The image named in <code>FROM</code>: the starting filesystem your instructions build on.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A Dockerfile runs top to bottom; <code>RUN</code>, <code>COPY</code> and <code>ADD</code> create layers, the rest only set configuration.</li>
<li>The dot at the end of <code>docker build</code> is the build context, and <code>COPY</code> can never reach outside it.</li>
<li>BuildKit only sends what <code>COPY</code> asks for, and only the changes — but <code>COPY . .</code> sends and bakes in everything.</li>
<li><code>.dockerignore</code> keeps <code>node_modules</code>, <code>.git</code> and <code>.env</code> out of both the upload and the image.</li>
<li>Prove it instead of trusting it: the busybox context check shows exactly what the builder receives.</li>
<li><code>WORKDIR</code> and <code>ENV</code> persist between lines; <code>cd</code> and <code>export</code> inside a <code>RUN</code> do not.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/dockerfile/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Dockerfile reference</span><span class="lc-sub">The authoritative page for every instruction. Keep it open while you write your first few Dockerfiles — the exact semantics of <code>COPY</code> and <code>WORKDIR</code> repay a careful read.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/concepts/context/" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Build context</span><span class="lc-sub">What actually gets sent to the builder, named contexts, remote contexts (a Git URL works as a context), and the full <code>.dockerignore</code> pattern syntax.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/best-practices/" target="_blank" rel="noopener">
  <span class="lc-ico">⭐</span>
  <span class="lc-body"><span class="lc-title">Dockerfile best practices</span><span class="lc-sub">Docker's own list, and it is genuinely good. Much of Chapters 4–6 is this document with the reasoning filled in and the outputs shown.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: write and build</span><span class="lc-sub">Graded exercises: build a working image for a small app, cut the build context by 99% with <code>.dockerignore</code>, explain why <code>COPY ../file</code> cannot work, and read a build log to say which steps were cached.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> <code>RUN cd /app</code> followed by a <code>RUN</code> that expects to be there. Every <code>RUN</code> is a fresh shell in a fresh layer, so the directory change is discarded the moment that instruction finishes. The next line runs in the previous working directory and either fails or — worse — succeeds in the wrong place, silently producing an image with files under <code>/</code>. Use <code>WORKDIR</code>, which is stateful across instructions, and combine commands that genuinely belong together into one <code>RUN</code> with <code>&amp;&amp;</code>. The same applies to <code>RUN export VAR=x</code>: use <code>ENV</code> instead.</div>
<p class="note-ct"><strong>Three things to remember.</strong> The dot at the end of <code>docker build .</code> is the <em>context</em>, not the Dockerfile — it is uploaded to the daemon, which is why <code>COPY</code> can never reach outside it and why a stray <code>node_modules</code> costs you seconds on every build. Write <code>.dockerignore</code> first: it makes builds fast and stops <code>.env</code> and <code>.git</code> from being baked into a published image. And each <code>RUN</code> is its own shell and its own layer, so <code>cd</code> and <code>export</code> do not carry over — that is what <code>WORKDIR</code> and <code>ENV</code> are for.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Dockerfile đầu tiên, và ngữ cảnh dựng</h2>
<p class="lead">Một Dockerfile là một script sinh ra một cái ảnh. Mọi chỉ thị chạy theo thứ tự, phần lớn chúng tạo ra một tầng (Bài 1.2), và kết quả là một hệ thống file cộng phần siêu dữ liệu để khởi chạy một tiến trình bên trong nó. Bài này dựng một ứng dụng THẬT rồi giải thích cái phần của <code>docker build</code> mà chẳng ai giải thích: dấu chấm ở cuối.</p>

<h3>Một ứng dụng thật</h3>
${slide('dk-04', 3, 'Dockerfile đầu tiên — mỗi dòng một bước, ghi chú bên lề từng dòng')}
<pre><code>mkdir -p demo/src &amp;&amp; cd demo
cat &gt; package.json &lt;&lt;'EOF'
{ "name": "demo", "version": "1.0.0", "type": "module",
  "scripts": { "start": "node src/server.js" },
  "dependencies": { "express": "^4.21.1" } }
EOF
cat &gt; src/server.js &lt;&lt;'EOF'
import express from 'express';
const app = express();
app.get('/health', (_, res) =&gt; res.json({ ok: true, node: process.version }));
app.listen(3000, () =&gt; console.log('listening on 3000'));
EOF
npm install --package-lock-only --silent
ls</code></pre>
<div class="out">package-lock.json  package.json  src</div>
<p class="note-ct">Output thật trên máy Mac của khoá (npm 10.9). Bản cũ của bài in ra thêm một thư mục <code>node_modules</code> ở đây — nhưng <code>--package-lock-only</code> chỉ ghi file khoá và KHÔNG cài gì cả, và đó chính là lý do dùng nó: cái ảnh tự cài thư viện của nó bằng <code>npm ci</code>. Nếu bạn còn chạy app ngoài Docker bằng <code>npm install</code> thì máy bạn sẽ có thêm <code>node_modules</code>, và mục ngữ cảnh dựng bên dưới nói về cái giá của nó.</p>
<pre><code>cat &gt; Dockerfile &lt;&lt;'EOF'
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

EXPOSE 3000
CMD ["node", "src/server.js"]
EOF

docker build -t demo:1.0 .</code></pre>
<div class="out">[+] Building 6.4s (10/10) FINISHED
 =&gt; [internal] load build definition from Dockerfile                       0.0s
 =&gt; [internal] load metadata for docker.io/library/node:22-alpine          0.8s
 =&gt; [internal] load .dockerignore                                          0.0s
 =&gt; [internal] load build context                                          0.1s
 =&gt; =&gt; transferring context: 4.21kB                                        0.0s
 =&gt; [1/5] FROM docker.io/library/node:22-alpine@sha256:b8f2c1a4e9d3…       0.0s
 =&gt; [2/5] WORKDIR /app                                                     0.0s
 =&gt; [3/5] COPY package.json package-lock.json ./                           0.0s
 =&gt; [4/5] RUN npm ci --omit=dev                                            4.9s
 =&gt; [5/5] COPY src ./src                                                   0.0s
 =&gt; exporting to image                                                     0.4s
 =&gt; =&gt; naming to docker.io/library/demo:1.0                                0.0s</div>
<pre><code>docker run -d --name demo -p 3000:3000 demo:1.0
curl -s localhost:3000/health; echo
docker images demo --format '{{.Repository}}:{{.Tag}} {{.Size}}'</code></pre>
<div class="out">{"ok":true,"node":"v22.11.0"}
demo:1.0 190MB</div>
<p class="note-ct">Log dựng phía trên ghi trên Docker Engine 27. Trên Docker 29 (máy Mac của khoá, tháng 9/2026) cùng lượt dựng in đúng các bước đó với mã băm mới, lệnh kiểm sức khoẻ trả <code>{"ok":true,"node":"v22.23.2"}</code>, và <code>docker images</code> có HAI cột kích thước thay vì một (Bài 1.2 giải thích):</p>
<div class="out">IMAGE           ID             DISK USAGE   CONTENT SIZE   EXTRA
demo:1.0        b2e6c98cd711        240MB         60.1MB</div>

<h3>Từng dòng một</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">FROM node:22-alpine</span><span class="lz-lnote">Hệ thống file khởi điểm. Mọi Dockerfile đều bắt đầu bằng một cái (hoặc <code>FROM scratch</code> cho một cái rỗng). Hãy ghim ít nhất tới bản phụ — <code>FROM node</code> nghĩa là "bất cứ thứ gì <code>latest</code> đang là hôm nay", và đó là cú sự cố của Bài 3.2.</span></div>
  <div class="lz-layer"><span class="lz-lname">WORKDIR /app</span><span class="lz-lnote">Đặt thư mục làm việc cho MỌI <code>RUN</code>, <code>CMD</code>, <code>COPY</code> và <code>ENTRYPOINT</code> phía sau, và tạo nó nếu chưa có. Hãy luôn dùng cái này thay cho <code>RUN cd /app</code> — mỗi <code>RUN</code> là một shell riêng, nên một lệnh <code>cd</code> không sống tới dòng kế tiếp.</span></div>
  <div class="lz-layer"><span class="lz-lname">COPY package.json package-lock.json ./</span><span class="lz-lnote">Chỉ chép các file khai báo thư viện TRƯỚC. Thứ tự này là thứ giá trị nhất trong cả file, và Chương 5 hoàn toàn nói về lý do.</span></div>
  <div class="lz-layer"><span class="lz-lname">RUN npm ci --omit=dev</span><span class="lz-lnote">Chạy lúc <em>DỰNG</em> và những thay đổi hệ thống file của nó trở thành một tầng. Dùng <code>npm ci</code> chứ không phải <code>npm install</code>: nó cài đúng theo lockfile và BÁO LỖI nếu lockfile với <code>package.json</code> bất đồng — và đó là thứ bạn muốn trong một lượt dựng.</span></div>
  <div class="lz-layer"><span class="lz-lname">COPY src ./src</span><span class="lz-lnote">Mã nguồn, chép SAU thư viện vì nó đổi thường xuyên hơn nhiều. Chú ý <code>./src</code>, không phải <code>.</code>: chỉ chép thứ bạn cần giữ cho tầng nhỏ và cache ổn định.</span></div>
  <div class="lz-layer"><span class="lz-lname">EXPOSE 3000</span><span class="lz-lnote">Thuần TÀI LIỆU cộng một gợi ý cho <code>-P</code>. Nó KHÔNG publish gì và không mở tường lửa nào — một hiểu lầm phổ biến. Bạn vẫn cần <code>-p 3000:3000</code> lúc chạy (Chương 8).</span></div>
  <div class="lz-layer"><span class="lz-lname">CMD ["node", "src/server.js"]</span><span class="lz-lnote">Câu lệnh mặc định, ở <strong>DẠNG EXEC</strong> — một mảng JSON, nên tiến trình của bạn thành PID 1 và nhận được SIGTERM (Bài 1.3). Đừng bao giờ viết nó thành một chuỗi trần trừ khi bạn đã đọc Bài 4.3 và quyết định là mình MUỐN một cái shell.</span></div>
</div>

<h3>Chạy thử từng bước: từ thư mục rỗng tới container đang chạy</h3>
<p>Nếu đây là Dockerfile đầu tiên của bạn, dưới đây là cả vòng lặp một lần nữa, thành một chuỗi bước làm theo được mà không cần nghĩ, kèm thứ cần kiểm sau mỗi bước. Mọi chương sau lặp lại đúng vòng này — chỉ có cái Dockerfile là ngày càng thú vị hơn.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bước 1 · app chạy được KHÔNG cần Docker trước (tuỳ chọn nhưng khôn ngoan)</span><span class="lz-t">npm install &amp;&amp; node src/server.js</span><span class="lz-d">Không chạy được trên máy bạn thì Docker cũng không chữa được. Xong thì dừng bằng <code>Ctrl+C</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 2 · viết .dockerignore, rồi mới tới Dockerfile</span><span class="lz-t">.dockerignore · Dockerfile (không đuôi, chữ D hoa)</span><span class="lz-d">Cả hai nằm ở thư mục gốc dự án, cạnh <code>package.json</code>. Thứ tự này quan trọng cho THÓI QUEN của bạn chứ không cho Docker: file ignore trước.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 3 · dựng và đặt tên cho ảnh</span><span class="lz-t">docker build -t demo:1.0 .</span><span class="lz-d">Kiểm: mấy dòng cuối ghi <code>naming to docker.io/library/demo:1.0</code> và không dòng nào bắt đầu bằng <code>ERROR</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 4 · nhìn thứ mình vừa dựng</span><span class="lz-t">docker images demo · docker history demo:1.0</span><span class="lz-d">Trong <code>history</code> mỗi dòng Dockerfile là một hàng, mới nhất ở trên: hàng <code>RUN npm ci</code> là hàng nặng (9.64MB ở đây), <code>COPY src</code> là 16.4kB.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 5 · chạy và mở cổng</span><span class="lz-t">docker run -d --name demo -p 3000:3000 demo:1.0</span><span class="lz-d">Kiểm: <code>docker ps</code> báo <code>Up</code>; <code>docker logs demo</code> in <code>listening on 3000</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 6 · gọi nó từ máy chủ</span><span class="lz-t">curl -s localhost:3000/health</span><span class="lz-d">Có JSON trả về = cả chuỗi chạy. Không có gì = mở danh sách kiểm "container chạy mà không vào được" của Chương 2.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 7 · sửa mã, dựng lại, thay container</span><span class="lz-t">docker build -t demo:1.1 . &amp;&amp; docker rm -f demo &amp;&amp; docker run -d --name demo -p 3000:3000 demo:1.1</span><span class="lz-d">Container đang chạy KHÔNG BAO GIỜ tự nhận ảnh mới — bạn luôn tạo một container mới từ ảnh mới.</span></div>
</div>
<table>
<tr><th>Mảnh của câu lệnh</th><th>Nghĩa là</th></tr>
<tr><td><code>docker build</code></td><td>Đọc một Dockerfile và tạo ra một ảnh. Việc nặng do bộ dựng (BuildKit) bên trong tiến trình nền Docker làm, không phải CLI.</td></tr>
<tr><td><code>-t demo:1.0</code></td><td>"tag" (nhãn): tên (<code>demo</code>) và nhãn phiên bản (<code>1.0</code>) của kết quả. Không có nó thì ảnh chỉ được biết tới bằng ID.</td></tr>
<tr><td><code>-f đường/dẫn</code></td><td>Đọc Dockerfile nào. Mặc định: file tên <code>Dockerfile</code> trong thư mục ngữ cảnh.</td></tr>
<tr><td><code>.</code> (tham số cuối)</td><td>Ngữ cảnh dựng (build context): thư mục mà <code>COPY</code> nhìn thấy được. Mục kế tiếp giải thích.</td></tr>
<tr><td><code>docker run -d</code></td><td>Tạo và chạy một container ở chế độ nền.</td></tr>
<tr><td><code>-p 3000:3000</code></td><td>Cổng 3000 của máy chủ → cổng 3000 của container. <code>EXPOSE</code> trong Dockerfile KHÔNG làm việc này thay bạn.</td></tr>
</table>
<div class="callout"><strong>Mac, Linux và Windows chỉ khác nhau ở chỗ tiến trình nền nằm đâu.</strong> Trên Linux, CLI nói chuyện với <code>dockerd</code> trên chính máy đó; trên Mac hoặc Windows với WSL2 thì <code>dockerd</code> chạy trong máy ảo Linux của Docker Desktop. Mọi lệnh trong bài này giống hệt nhau trên cả ba. Thứ duy nhất cần để ý trên Windows là ký tự xuống dòng: một Dockerfile hay file <code>.sh</code> lưu kiểu CRLF sẽ hỏng theo những cách khó hiểu (Bài 4.3) — hãy chỉnh trình soạn thảo dùng LF cho các file này. Bạn cùng nhóm SWP391 dùng Windows mà <code>docker build</code> báo lỗi lạ ở script thì kiểm cái này trước tiên.</div>

<h3>Dấu chấm ở cuối: ngữ cảnh dựng</h3>
${slide('dk-04', 4, 'Dấu chấm cuối lệnh là ngữ cảnh — không phải Dockerfile')}
<pre><code><span class="tok-comment"># Đây là ba thứ khác nhau, và chỉ MỘT trong số đó là Dockerfile</span>
docker build -t demo:1.0 .
<span class="tok-comment">#                        ^ NGỮ CẢNH DỰNG — một thư mục sẽ được TẢI LÊN</span>

docker build -t demo:1.0 -f docker/Dockerfile.api .
<span class="tok-comment">#                        ^^^^^^^^^^^^^^^^^^^^^^^ cái Dockerfile   ^ vẫn là ngữ cảnh</span></code></pre>
<p>Trước khi bất kỳ chỉ thị nào chạy, CLI đóng gói cái thư mục đó lại và gửi nó cho tiến trình nền — vì tiến trình nền có thể nằm trên một cái máy khác và không đọc được đĩa của bạn. Mọi <code>COPY</code> và <code>ADD</code> sau đó đọc từ bản đã tải lên ấy, và đó là lý do <code>COPY ../shared /app</code> hỏng: thư mục cha không nằm trong ngữ cảnh, và không đường dẫn nào ngoài nó có thể tới được.</p>
<pre><code><span class="tok-comment"># Nhìn cái giá khi node_modules đang nằm trong thư mục</span>
du -sh node_modules
docker build -t demo:1.0 . 2&gt;&amp;1 | grep -E 'transferring context|FINISHED'</code></pre>
<pre><code>docker build -t demo:1.0 .</code></pre>
<div class="out">3.9M	node_modules
 =&gt; =&gt; transferring context: 29.59kB                                       0.0s
[+] Building 0.2s (10/10) FINISHED                         docker:desktop-linux</div>
<p class="note-ct">Output thật trên máy Mac của khoá (Docker 29.8, BuildKit), sau khi chạy <code>npm install</code> ở ngoài Docker để thư mục THẬT SỰ có <code>node_modules</code>. Bản cũ của bài in ở đây <code>61M node_modules</code> và <code>transferring context: 61.44MB</code>. Cả hai đều sai: Express cùng các thư viện của nó chỉ 3.9MB, và — quan trọng hơn — BuildKit, bộ dựng mặc định từ Engine 23, KHÔNG tải lên cả thư mục. Nó chỉ xin đúng những đường dẫn mà các dòng <code>COPY</code> và <code>ADD</code> của Dockerfile nêu tên, và ở lượt dựng lại thì chỉ xin phần đã đổi.</p>
<p>Nên với CHÍNH Dockerfile này (chép <code>package.json</code>, <code>package-lock.json</code> và <code>src</code> theo tên), thư mục <code>node_modules</code> trên đĩa bạn không bao giờ bị gửi: 29.59kB là file khoá cộng mã nguồn. Cái giá xuất hiện ngay khi một Dockerfile viết <code>COPY . .</code> — thứ mà phần lớn Dockerfile thật đều viết, kể cả vài cái ở cuối chương này. Khi đó MỌI thứ trong thư mục bị gửi đi, và mọi thứ bị gửi đi đều nằm <strong>BÊN TRONG ẢNH</strong>: <code>node_modules</code> của máy bạn, <code>.env</code> của bạn, <code>.git</code> của bạn. Mục kế tiếp đo đúng chuyện đó trên một dự án thật.</p>

<h3>Đo ngữ cảnh dựng của bạn: thứ gì THẬT SỰ bị gửi đi</h3>
${slide('dk-04', 5, 'Không có .dockerignore: 398 MB bị gửi đi — kèm cả .env và .git')}
${slide('dk-04', 7, 'BuildKit chỉ gửi thứ COPY cần — và chỉ gửi phần đã đổi')}
<p>Bạn không nhìn thẳng vào ngữ cảnh dựng được — nó nằm bên trong bộ dựng. Nhưng bạn có thể dựng một cái ảnh dùng-một-lần mà việc duy nhất của nó là chép cả ngữ cảnh vào rồi liệt kê ra. Dockerfile được đưa qua đầu vào chuẩn (<code>-f-</code>), nên không có file nào bị ghi vào dự án của bạn:</p>
<pre><code class="language-bash">docker build --no-cache --progress=plain -t ctx-check -f- . &lt;&lt;'EOF'
FROM busybox
COPY . /ctx
RUN du -sh /ctx &amp;&amp; find /ctx -type f | wc -l &amp;&amp; ls -A /ctx
EOF</code></pre>
<p>Chạy trong thư mục của một dự án Next.js nhỏ nhưng THẬT — đã chạy <code>npm install</code> và <code>next build</code> trên máy, có <code>.git</code> và <code>.env.local</code>, y như một kho mã thật — và <em>chưa có</em> <code>.dockerignore</code>:</p>
<div class="out">#5 transferring context: 397.69MB 4.2s done
#7 0.174 414.0M	/ctx
#7 0.174 11582
.env.local
.git
.gitignore
.next
app
next.config.js
node_modules
package-lock.json
package.json
public</div>
<p>Output thật trên máy Mac của khoá, chạy trên một bản chép MỚI của thư mục để không có gì được lưu đệm. 397.69MB và 11.582 file bị gửi tới bộ dựng; cả lượt dựng mất 21,1 giây, vì sau đó <code>COPY . /ctx</code> còn ghi 414MB vào một tầng. Cùng thư mục đó với file <code>.dockerignore</code> của mục kế tiếp:</p>
<div class="out">#5 transferring context: 32.25kB done
#7 0.089 72.0K	/ctx
#7 0.089 8</div>
<p>32.25kB, tám file, 2,2 giây từ đầu tới cuối. Có hai điều về cách BuildKit gửi ngữ cảnh đáng biết, vì chúng giải thích tại sao số đo trên máy bạn có thể trông đẹp hơn thế này, còn trong CI thì tệ hơn:</p>
<table>
<tr><th>Tình huống (máy Mac của khoá, demo Express nhỏ)</th><th>transferring context</th><th>Vì sao</th></tr>
<tr><td>Dockerfile chép <code>package*.json</code> và <code>src</code> theo tên; có một <code>node_modules</code> 3.9MB nằm trong thư mục</td><td>29.59kB</td><td>BuildKit chỉ xin những đường dẫn mà một dòng <code>COPY</code> nêu tên</td></tr>
<tr><td>Dockerfile viết <code>COPY . .</code>, lần dựng đầu trong thư mục này</td><td>2.39MB</td><td>xin tất cả, gồm cả <code>node_modules</code></td></tr>
<tr><td><code>COPY . .</code>, dựng lại mà không đổi gì</td><td>41.03kB</td><td>BuildKit giữ lại lần tải trước, chỉ gửi siêu dữ liệu file và phần thay đổi</td></tr>
<tr><td><code>COPY . .</code> trên một máy CI mới tinh</td><td>như lần dựng đầu, lần nào cũng vậy</td><td>máy mới chẳng có gì từ lần trước</td></tr>
</table>
<div class="callout warn"><strong>"Trên máy tôi nhanh mà" KHÔNG có nghĩa là ngữ cảnh ổn.</strong> Việc tải lên từng phần giấu mất kích thước khỏi mắt bạn sau lần dựng đầu, nhưng CI thì lần nào cũng bắt đầu từ con số không, và — tệ hơn nhiều — thứ gì <code>COPY . .</code> gửi đi thì nằm TRONG cái ảnh bạn đẩy lên registry. Phép thử nhanh ở trên mới là phép thử trung thực: nếu <code>ls -A /ctx</code> hiện ra <code>.env</code>, <code>.git</code> hay <code>node_modules</code> thì ảnh của bạn cũng chứa chúng.</div>

<h3>.dockerignore chữa được</h3>
${slide('dk-04', 6, '.dockerignore — danh sách những thứ không được lên xe')}
<pre><code>cat &gt; .dockerignore &lt;&lt;'EOF'
# Đừng bao giờ gửi mấy thứ này cho tiến trình nền
node_modules
.git
.env
.env.*
dist
build
coverage
*.log
.DS_Store
.vscode
.idea
Dockerfile*
docker-compose*.yml
README.md
EOF

docker build -t demo:1.0 . 2&gt;&amp;1 | grep -E 'transferring context|FINISHED'</code></pre>
<div class="out"> =&gt; =&gt; transferring context: 4.21kB                                        0.0s
[+] Building 0.9s (10/10) FINISHED</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Tốc độ</span><span class="v">Đo trên dự án Next.js ở trên: 397.69MB và 21 giây tụt xuống 32.25kB và 2 giây. Trên một kho mã có thư mục <code>.git</code> đầy lịch sử, riêng chuyện này biến một lượt dựng ba mươi giây thành hai giây.</span></div>
  <div class="kv"><span class="k">An ninh</span><span class="v">Loại trừ <code>.env</code> và <code>.git</code> nghĩa là một lệnh <code>COPY . .</code> cẩu thả KHÔNG THỂ nướng thông tin đăng nhập hay toàn bộ lịch sử commit của bạn vào một cái ảnh đã công bố. Đây là lý do <code>.dockerignore</code> không phải tuỳ chọn.</span></div>
  <div class="kv"><span class="k">Cache ổn định</span><span class="v">Những file trong ngữ cảnh mà đổi liên tục — log, trạng thái trình soạn thảo, kết quả build — sẽ vô hiệu hoá tầng <code>COPY</code> ngay cả khi mã nguồn không đổi. Loại chúng ra giữ cho cache còn ấm (Chương 5).</span></div>
  <div class="kv"><span class="k">Tính đúng đắn</span><span class="v">Một <code>node_modules</code> của máy chủ được dựng trên macOS thì chứa các chương trình native của macOS. Nếu nó rò vào một cái ảnh Linux thì bạn sẽ nhận đúng cái lỗi <code>sharp</code> của Bài 0.1 — lần này là BÊN TRONG container.</span></div>
  <div class="kv"><span class="k">Cú pháp</span><span class="v">Cùng luật mẫu với <code>.gitignore</code>, cộng một điểm: <code>!mẫu</code> nhận lại thứ đã bị một dòng trước loại ra, nên <code>*</code> rồi <code>!src</code> là một chiến lược danh-sách-cho-phép hợp lệ.</span></div>
</div>
<div class="callout ok"><strong>Hãy viết <code>.dockerignore</code> TRƯỚC khi viết Dockerfile.</strong> Nó là một cái file hai phút, làm nhanh mọi lượt dựng bạn sẽ chạy trong kho mã đó và bịt lại chỗ rò bí mật vô tình phổ biến nhất. Hãy bắt đầu từ <code>.gitignore</code> của bạn rồi thêm chính <code>.git</code> vào — thứ mà <code>.gitignore</code> hiển nhiên không bao giờ nhắc tới và thường là thư mục đơn lẻ lớn nhất trong ngữ cảnh.</div>

<h3>Đọc output lúc dựng</h3>
<pre><code>docker build -t demo:1.1 --progress=plain . 2&gt;&amp;1 | head -14</code></pre>
<div class="out">#1 [internal] load build definition from Dockerfile
#1 transferring dockerfile: 231B done
#2 [internal] load metadata for docker.io/library/node:22-alpine
#3 [internal] load .dockerignore
#3 transferring context: 195B done
#5 [1/5] FROM docker.io/library/node:22-alpine@sha256:b8f2c1a4e9d3…
#5 CACHED
#6 [internal] load build context
#6 transferring context: 4.21kB done
#7 [3/5] COPY package.json package-lock.json ./
#7 CACHED
#8 [4/5] RUN npm ci --omit=dev
#8 CACHED
#9 [5/5] COPY src ./src</div>
<div class="kv-grid">
  <div class="kv"><span class="k">CACHED</span><span class="v">Bước đó KHÔNG chạy lại; kết quả của nó lấy từ một lượt dựng trước. Cả Chương 5 nói về việc làm sao thấy được càng nhiều dòng này càng tốt.</span></div>
  <div class="kv"><span class="k">--progress=plain</span><span class="v">Tắt phần hiển thị trực tiếp có gấp gọn và in ra MỌI dòng output của MỌI câu lệnh. Đây là thứ bạn dùng khi một lệnh <code>RUN</code> hỏng và bạn cần thấy nó thật sự nói gì.</span></div>
  <div class="kv"><span class="k">--no-cache</span><span class="v">Dựng lại tất cả từ đầu. Hãy dùng nó để chứng minh một lượt dựng là tái lập được, và khi một tầng đã lưu đệm trở nên lỗi thời theo cách Docker không phát hiện ra (bài toán <code>apt-get update</code> của Chương 5).</span></div>
  <div class="kv"><span class="k">--pull</span><span class="v">Kiểm lại registry xem có ảnh nền mới hơn không, kể cả khi bạn đã có một bản ở máy. Nó thuộc về những lượt dựng CI theo lịch để bản vá an ninh thật sự tới nơi.</span></div>
  <div class="kv"><span class="k">-f đường/dẫn/tới/Dockerfile</span><span class="v">Một Dockerfile nằm ở đâu cũng được, với ngữ cảnh vẫn chọn riêng. Đây là cách một monorepo giữ <code>docker/api.Dockerfile</code> và <code>docker/web.Dockerfile</code> cạnh nhau.</span></div>
</div>
<pre><code>docker rm -f demo &gt;/dev/null; cd ..; rm -rf demo</code></pre>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> ảnh API của nhóm SWP391 mất cả phút để dựng trong GitHub Actions, và có người phát hiện file <code>.env</code> chứa mật khẩu CSDL của một bạn nằm trong cái ảnh đã công bố. Bạn được giao tìm xem lượt dựng đang gửi đi những gì và sửa nó — bằng số đo, không phải đoán.</p><ol>
<li>Trong <code>~/thu-docker</code>, dựng lại app demo ở đầu bài, chạy <code>npm install</code> một lần (để có <code>node_modules</code>, như trên laptop của mọi người) và thêm một bí mật giả: <code>echo 'DATABASE_URL=postgres://u:matkhau@db/app' &gt; .env</code>.</li>
<li>Đổi dòng <code>COPY src ./src</code> của Dockerfile thành <code>COPY . .</code> (thứ phần lớn Dockerfile của các nhóm vẫn viết), dựng thành <code>demo:leaky</code>, rồi chứng minh bí mật nằm bên trong: <code>docker run --rm demo:leaky cat /app/.env</code>.</li>
<li>Chạy phép soi ngữ cảnh ở mục "Đo ngữ cảnh dựng của bạn" và ghi lại kích thước, số file và danh sách <code>ls -A</code>.</li>
<li>Viết file <code>.dockerignore</code> của bài này, dựng lại thành <code>demo:clean</code>, rồi làm lại cả hai phép kiểm.</li>
<li>Dọn dẹp: <code>docker rmi demo:leaky demo:clean ctx-check</code>.</li></ol>
<pre><code class="language-bash">docker run --rm demo:clean cat /app/.env
docker run --rm demo:clean ls /app</code></pre>
<div class="out">cat: can't open '/app/.env': No such file or directory
node_modules
package-lock.json
package.json
src</div>
<p><strong>Đạt khi:</strong> <code>demo:leaky</code> in ra mật khẩu còn <code>demo:clean</code> thì không; phép soi ngữ cảnh tụt từ vài megabyte và hàng trăm file xuống vài kilobyte và một nắm file; và bạn giải thích được vì sao <code>node_modules</code> liệt kê trong <code>demo:clean</code> là cái do <code>npm ci</code> dựng BÊN TRONG ảnh, không phải cái của máy bạn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dockerfile (công thức dựng ảnh)</span><span class="v">File chữ chứa các chỉ thị, đọc từ trên xuống, mô tả cách dựng ra một ảnh.</span></div>
  <div class="kv"><span class="k">Instruction (chỉ thị)</span><span class="v">Từ khoá đầu dòng như <code>FROM</code>, <code>RUN</code>, <code>COPY</code>; những cái làm đổi file thì sinh ra một tầng.</span></div>
  <div class="kv"><span class="k">Build context (ngữ cảnh dựng)</span><span class="v">Thư mục ở tham số cuối của <code>docker build</code>; là những file DUY NHẤT mà <code>COPY</code> và <code>ADD</code> đọc được.</span></div>
  <div class="kv"><span class="k">.dockerignore (danh sách bỏ qua)</span><span class="v">Các mẫu file không bao giờ được gửi tới bộ dựng, cú pháp giống <code>.gitignore</code>.</span></div>
  <div class="kv"><span class="k">BuildKit (bộ dựng)</span><span class="v">Phần bên trong Docker chạy các bước, lưu đệm chúng và xin file ngữ cảnh; mặc định từ Engine 23.</span></div>
  <div class="kv"><span class="k">Tag (nhãn ảnh)</span><span class="v">Tên người đọc được của một ảnh, dạng <code>tên:phiên-bản</code>, đặt bằng <code>-t</code>.</span></div>
  <div class="kv"><span class="k">Base image (ảnh nền)</span><span class="v">Ảnh ghi ở dòng <code>FROM</code>: hệ thống file khởi điểm mà các chỉ thị của bạn xây lên trên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dockerfile chạy từ trên xuống; <code>RUN</code>, <code>COPY</code>, <code>ADD</code> tạo tầng, các chỉ thị còn lại chỉ đặt cấu hình.</li>
<li>Dấu chấm cuối <code>docker build</code> là ngữ cảnh dựng, và <code>COPY</code> không bao giờ với ra ngoài nó được.</li>
<li>BuildKit chỉ gửi thứ <code>COPY</code> xin, và chỉ gửi phần đổi — nhưng <code>COPY . .</code> thì gửi và nướng MỌI thứ vào ảnh.</li>
<li><code>.dockerignore</code> giữ <code>node_modules</code>, <code>.git</code>, <code>.env</code> ở ngoài cả lượt gửi lẫn cái ảnh.</li>
<li>Chứng minh chứ đừng tin: phép soi ngữ cảnh bằng busybox cho thấy đúng thứ bộ dựng nhận được.</li>
<li><code>WORKDIR</code> và <code>ENV</code> sống qua các dòng; <code>cd</code> và <code>export</code> trong một <code>RUN</code> thì không.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/dockerfile/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Tài liệu tra cứu Dockerfile</span><span class="lc-sub">Trang chuẩn cho mọi chỉ thị. Hãy mở sẵn nó trong lúc viết vài Dockerfile đầu tiên — ngữ nghĩa chính xác của <code>COPY</code> và <code>WORKDIR</code> xứng đáng một lượt đọc cẩn thận.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/concepts/context/" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Ngữ cảnh dựng</span><span class="lc-sub">Thứ gì thật sự được gửi tới bộ dựng, ngữ cảnh có tên, ngữ cảnh từ xa (một URL Git dùng làm ngữ cảnh được), và cú pháp mẫu <code>.dockerignore</code> đầy đủ.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/best-practices/" target="_blank" rel="noopener">
  <span class="lc-ico">⭐</span>
  <span class="lc-body"><span class="lc-title">Thực hành tốt cho Dockerfile</span><span class="lc-sub">Danh sách của chính Docker, và nó thật sự tốt. Phần lớn Chương 4–6 là tài liệu này với phần lý lẽ được điền vào và output được bày ra.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: viết rồi dựng</span><span class="lc-sub">Bài chấm điểm: dựng một cái ảnh chạy được cho một ứng dụng nhỏ, cắt ngữ cảnh dựng đi 99% bằng <code>.dockerignore</code>, giải thích vì sao <code>COPY ../file</code> không thể chạy, và đọc một log dựng để nói bước nào đã được lưu đệm.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>RUN cd /app</code> rồi tới một lệnh <code>RUN</code> khác tưởng mình đang ở đó. Mỗi <code>RUN</code> là một shell MỚI trong một tầng MỚI, nên việc đổi thư mục bị vứt đi ngay khoảnh khắc chỉ thị đó kết thúc. Dòng kế tiếp chạy ở thư mục làm việc cũ và hoặc là hỏng, hoặc — tệ hơn — thành công NHẦM CHỖ, âm thầm tạo ra một cái ảnh có file nằm dưới <code>/</code>. Hãy dùng <code>WORKDIR</code>, thứ có trạng thái xuyên qua các chỉ thị, và gộp những câu lệnh thật sự thuộc về nhau vào MỘT <code>RUN</code> bằng <code>&amp;&amp;</code>. Điều tương tự áp cho <code>RUN export VAR=x</code>: hãy dùng <code>ENV</code>.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Dấu chấm ở cuối <code>docker build .</code> là NGỮ CẢNH, không phải Dockerfile — nó được tải lên tiến trình nền, và đó là lý do <code>COPY</code> không bao giờ với ra ngoài nó được, và là lý do một thư mục <code>node_modules</code> lạc chỗ tốn của bạn vài giây ở mọi lượt dựng. Hãy viết <code>.dockerignore</code> trước: nó làm bản dựng nhanh và ngăn <code>.env</code> với <code>.git</code> bị nướng vào một cái ảnh đã công bố. Và mỗi <code>RUN</code> là một shell riêng và một tầng riêng, nên <code>cd</code> với <code>export</code> không mang sang được — đó chính là việc của <code>WORKDIR</code> và <code>ENV</code>.</p>
</div>
`,
    },
    /* ─────────────────────────── 4.2 ─────────────────────────── */
    {
      title: '4.2 — Every instruction, and what it really does|||4.2 — Mọi chỉ thị, và nó thật sự làm gì',
      slug: 'dk-4-2-cac-chi-thi',
      type: 'LESSON',
      description: 'FROM, RUN, COPY với ADD, WORKDIR, EXPOSE, VOLUME, USER, LABEL, STOPSIGNAL, HEALTHCHECK, SHELL, ONBUILD — kèm hành vi thật, cờ ít ai biết, và dòng syntax ở đầu file mà bạn nên luôn viết.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Every instruction, and what it really does</h2>
<p class="lead">There are eighteen Dockerfile instructions (seventeen if you skip the deprecated <code>MAINTAINER</code> — an earlier version of this lesson said seventeen). You will use nine of them constantly, four occasionally, and the rest almost never — but several of the ones you use daily have behaviour that is not obvious, and two of them are actively dangerous in your own images.</p>

<h3>Start with the syntax line</h3>
${slide('dk-04', 8, '18 chỉ thị — nhóm theo cái giá mỗi chỉ thị phải trả')}
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine
…</code></pre>
<div class="callout ok"><strong>That comment is a parser directive, and it should be the first line of every Dockerfile you write.</strong> It tells BuildKit to fetch the current stable frontend, which unlocks features that are otherwise unavailable: <code>RUN --mount=type=cache</code> (Chapter 5), <code>RUN --mount=type=secret</code> (Chapter 6), <code>COPY --link</code>, and heredoc syntax. Version <code>1</code> means "latest 1.x", so it keeps improving without you doing anything. It must be a comment on the very first line — after any instruction it is just a comment.</div>

<h3>FROM — the base</h3>
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine                    <span class="tok-comment"># the normal case, pinned</span>
FROM node:22-alpine AS build           <span class="tok-comment"># a NAMED stage (Chapter 6)</span>
FROM --platform=\$BUILDPLATFORM golang:1.23 AS cross   <span class="tok-comment"># Lesson 3.4</span>
FROM scratch                           <span class="tok-comment"># completely empty — for static binaries</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">One Dockerfile, many FROMs</span><span class="v">Each <code>FROM</code> starts a new stage. Only the last one produces the final image unless you pass <code>--target</code>. This is multi-stage building, and Chapter 6 is built on it.</span></div>
  <div class="kv"><span class="k">AS name</span><span class="v">Names a stage so <code>COPY --from=build</code> can reach into it. Names beat indexes (<code>--from=0</code>) because inserting a stage does not renumber anything.</span></div>
  <div class="kv"><span class="k">FROM scratch</span><span class="v">Zero bytes: no shell, no libc, no <code>/etc/passwd</code>. Only for fully static binaries — Go, Rust with musl. Every debugging technique needs the sidecar approach from Lesson 2.3.</span></div>
  <div class="kv"><span class="k">ARG before FROM</span><span class="v">The one place an <code>ARG</code> may appear before the first <code>FROM</code>, so you can parameterise the base: <code>ARG NODE_VERSION=22</code> then <code>FROM node:&#36;{NODE_VERSION}-alpine</code>. Note it is then out of scope inside the stage (Lesson 4.4).</span></div>
</div>

<h3>RUN — the one that costs money</h3>
${slide('dk-04', 9, 'RUN: mỗi dòng một shell mới — và lỗi giữa ống dẫn bị nuốt')}
<pre><code><span class="tok-comment"># Shell form: runs via /bin/sh -c, so &amp;&amp; || | \$VAR all work</span>
RUN apk add --no-cache curl &amp;&amp; rm -rf /var/cache/apk/*

<span class="tok-comment"># Exec form: no shell at all, no &amp;&amp;, no variable expansion</span>
RUN ["/usr/bin/apk", "add", "--no-cache", "curl"]

<span class="tok-comment"># Heredoc: multi-line without backslashes (needs the syntax line)</span>
RUN &lt;&lt;EOF
set -eux
apk add --no-cache curl jq
rm -rf /var/cache/apk/*
EOF</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">One RUN = one layer</span><span class="v">So combine what belongs together. Installing in one <code>RUN</code> and cleaning up in the next leaves the full weight of the install in the image plus a whiteout (Lesson 1.2).</span></div>
  <div class="kv"><span class="k">set -eux in heredocs</span><span class="v">Without <code>-e</code>, a failure mid-script is ignored and the build succeeds with a broken image. The shell form's <code>&amp;&amp;</code> chain gets this for free; a heredoc does not, so add it.</span></div>
  <div class="kv"><span class="k">--mount=type=cache</span><span class="v">A persistent directory across builds — for <code>~/.npm</code>, <code>/var/cache/apt</code>, the Go module cache. Chapter 5's biggest single speed-up.</span></div>
  <div class="kv"><span class="k">--network=none</span><span class="v">Runs the step with no network. Useful to prove a build step is hermetic, and to make a supply-chain reviewer happy.</span></div>
</div>

<h3>Run it step by step: three ways a RUN line lies to you</h3>
<p>A green build does not mean every command in it succeeded. Each of these three was built for real on the course's Mac (Docker 29.8); all three are mistakes that ship broken images from real repositories.</p>
<pre><code class="language-dockerfile">FROM alpine
RUN mkdir /app &amp;&amp; cd /app
RUN pwd
WORKDIR /app
RUN pwd</code></pre>
<div class="out">#6 0.076 /
#8 0.079 /app</div>
<p><strong>① <code>cd</code> dies with its RUN.</strong> Each <code>RUN</code> starts a brand-new shell, so the second <code>pwd</code> runs in <code>/</code>. <code>WORKDIR</code> is the only way to move for good.</p>
<pre><code class="language-dockerfile"># syntax=docker/dockerfile:1
FROM alpine
RUN &lt;&lt;SCRIPT
apk add --no-cache goi-khong-ton-tai
echo "dòng sau vẫn chạy — bước này XANH"
SCRIPT</code></pre>
<div class="out">#7 3.489 ERROR: unable to select packages:
#7 3.489   goi-khong-ton-tai (no such package):
#7 3.489     required by: world[goi-khong-ton-tai]
#7 3.502 dòng sau vẫn chạy — bước này XANH
#7 DONE 3.5s</div>
<p><strong>② A heredoc without <code>set -e</code> ignores failures.</strong> The script's exit code is that of its <em>last</em> line, and <code>echo</code> succeeded. Put <code>set -eux</code> first: then the same step stops at <code>apk</code>, prints each command before running it (<code>+ apk add …</code>) and fails the build with <code>exit code: 1</code>. (Checked in passing: Docker 29’s built-in Dockerfile frontend runs heredocs even without the <code># syntax</code> line; keep the line anyway for the newer features it unlocks.)</p>
<pre><code class="language-dockerfile">FROM alpine
RUN wget -qO- http://host.docker.internal:18041/install.sh | sh
RUN echo "đã tới bước 3 — ảnh vẫn dựng được"
SHELL ["/bin/sh", "-eo", "pipefail", "-c"]
RUN wget -qO- http://host.docker.internal:18041/install.sh | sh</code></pre>
<div class="out">#5 [2/4] RUN wget -qO- http://host.docker.internal:18041/install.sh | sh
#5 0.093 wget: server returned error: HTTP/1.1 404 Not Found
#5 DONE 0.1s
#6 [3/4] RUN echo "đã tới bước 3 — ảnh vẫn dựng được"
#7 [4/4] RUN wget -qO- http://host.docker.internal:18041/install.sh | sh
#7 0.108 wget: server returned error: HTTP/1.1 404 Not Found
#7 ERROR: process "/bin/sh -eo pipefail -c wget -qO- http://host.docker.internal:18041/install.sh | sh" did not complete successfully: exit code: 1</div>
<p><strong>③ The failure at the start of a pipe is swallowed.</strong> The install script URL returned 404 (a local test server stood in for a real one), <code>sh</code> received empty input, executed nothing and exited 0 — so the step is green and nothing was installed. The exit status of a pipe is that of its last command. <code>SHELL [… "-o", "pipefail" …]</code> makes the whole pipe fail if any part fails, for every <code>RUN</code> after it. Alpine's busybox <code>sh</code> supports it, so you do not need bash for this.</p>

<h3>COPY versus ADD</h3>
${slide('dk-04', 10, 'COPY làm đúng điều bạn nói — ADD làm thêm hai việc bất ngờ')}
<pre><code>COPY package.json ./                        <span class="tok-comment"># the one you want, 95% of the time</span>
COPY --chown=node:node src ./src            <span class="tok-comment"># set ownership as you copy</span>
COPY --chmod=755 entrypoint.sh /usr/local/bin/
COPY --from=build /app/dist ./dist          <span class="tok-comment"># from another stage</span>
COPY --link ./static /www                   <span class="tok-comment"># independent layer, better caching</span>

ADD https://example.com/file.tar.gz /tmp/   <span class="tok-comment"># ADD can fetch URLs…</span>
ADD archive.tar.gz /opt/                    <span class="tok-comment"># …and auto-extracts local tarballs</span></code></pre>
<div class="callout warn"><strong>Use <code>COPY</code> unless you specifically need one of <code>ADD</code>'s two extra behaviours</strong> — and both of them are traps. <code>ADD</code> auto-extracts local tar archives, so <code>ADD data.tar.gz /opt/</code> silently unpacks rather than copying, which is surprising if you wanted the file. And <code>ADD &lt;url&gt;</code> downloads without checksum verification and — measured on BuildKit, see below — it re-checks the URL on every build, so when the server changes the file the layer is simply rebuilt with the new bytes and nothing warns you: the same Dockerfile silently ships different content. (An earlier version of this lesson said the cache was <em>not</em> invalidated; on BuildKit it is, which is the opposite trap.) <code>ADD --checksum=sha256:…</code> pins the bytes and fails loudly when they differ. For remote files, <code>RUN curl -fsSL url -o file &amp;&amp; echo "sha256 file" | sha256sum -c</code> is explicit and verifiable.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">--chown / --chmod</span><span class="v">Set ownership and mode during the copy instead of a following <code>RUN chown</code> — which would duplicate every copied file into a new layer, doubling that part of the image.</span></div>
  <div class="kv"><span class="k">--from=stage</span><span class="v">Copy out of an earlier stage, or even out of another image: <code>COPY --from=nginx:alpine /etc/nginx/nginx.conf ./</code> works and is a neat way to grab one file from an image.</span></div>
  <div class="kv"><span class="k">--link</span><span class="v">Creates the layer independently of the previous filesystem state, so an earlier layer changing does not invalidate it. Cheap win for large static assets; requires the syntax line.</span></div>
  <div class="kv"><span class="k">Trailing slash matters</span><span class="v"><code>COPY file /dest</code> makes <code>/dest</code> a file; <code>COPY file /dest/</code> puts it inside a directory. With multiple sources the destination <em>must</em> end in a slash.</span></div>
  <div class="kv"><span class="k">Directory semantics differ from cp</span><span class="v"><code>COPY src ./src</code> copies the <em>contents</em> of <code>src</code> into <code>./src</code>. There is no way to copy a directory itself preserving its name at the top level — you name the destination instead.</span></div>
</div>

<h3>Seen for real: ADD unpacks, and ADD &lt;url&gt; changes under you</h3>
<pre><code class="language-dockerfile">FROM busybox
COPY data.tar.gz /copy/
ADD  data.tar.gz /add/
RUN find /copy /add</code></pre>
<div class="out">/copy
/copy/data.tar.gz
/add
/add/data
/add/data/a.txt
/add/data/b.txt</div>
<p>Same file, two instructions, two results: <code>COPY</code> kept the archive, <code>ADD</code> extracted it. Then the URL form, against a small local web server whose file we changed between two builds:</p>
<pre><code class="language-dockerfile">FROM alpine
ADD http://host.docker.internal:18041/v.txt /v.txt
RUN cat /v.txt</code></pre>
<div class="out"># first build
#7 0.074 phien ban 1
# the server's file is edited, same Dockerfile, rebuild
#7 0.073 phien ban 2
# pinned with ADD --checksum=sha256:… of a file that has since changed
#5 ERROR: digest mismatch sha256:d839b4a2a119349a145a4177d99d4147c0c8beb212f25e42a03420239de6e0a8: sha256:e4c33b5c4c90f29812fafd5a6407de683d9740be96d3b78282a7a37a24d63f11</div>
<table>
<tr><th>You need to…</th><th>Use</th><th>Why</th></tr>
<tr><td>Copy files from the context</td><td><code>COPY</code></td><td>Does exactly what it says, nothing else.</td></tr>
<tr><td>Copy from another stage or image</td><td><code>COPY --from=build</code> / <code>COPY --from=nginx:1.27-alpine</code></td><td>Multi-stage builds, Chapter 6.</td></tr>
<tr><td>Download a file during the build</td><td><code>ADD --checksum=sha256:…</code> or <code>RUN curl -fsSL … &amp;&amp; sha256sum -c</code></td><td>Reproducible: different bytes fail the build instead of shipping.</td></tr>
<tr><td>Unpack a tarball on purpose</td><td><code>ADD file.tar.gz /opt/</code></td><td>The one legitimate use of the auto-extract — write a comment so nobody "fixes" it to <code>COPY</code>.</td></tr>
<tr><td>Ship a tarball as a file</td><td><code>COPY</code></td><td><code>ADD</code> would extract it.</td></tr>
</table>

<h3>The metadata instructions</h3>
${slide('dk-04', 13, 'Chỉ thị siêu dữ liệu: 0 byte nhưng quyết định lúc chạy')}
<pre><code>WORKDIR /app                              <span class="tok-comment"># stateful; creates the dir; use absolute paths</span>
ENV NODE_ENV=production PORT=3000         <span class="tok-comment"># available at build AND run time</span>
EXPOSE 3000/tcp                           <span class="tok-comment"># documentation + a hint for -P</span>
LABEL org.opencontainers.image.source="https://github.com/me/app"
STOPSIGNAL SIGQUIT                        <span class="tok-comment"># what docker stop sends first</span>
USER node                                 <span class="tok-comment"># everything after this runs as node</span>
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \\
  CMD wget -qO- http://localhost:3000/health || exit 1
SHELL ["/bin/bash", "-eo", "pipefail", "-c"]   <span class="tok-comment"># change the shell RUN uses</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">EXPOSE publishes nothing</span><span class="v">It records a port in the image metadata. <code>docker run -P</code> reads it to pick random host ports, and Compose uses it for documentation. You still need <code>-p</code> or a <code>ports:</code> entry.</span></div>
  <div class="kv"><span class="k">USER should come late</span><span class="v">Put it after the <code>RUN</code>s that need root, just before <code>CMD</code>. And prefer a numeric UID (<code>USER 1000:1000</code>) so it works when the image is run with a different <code>--user</code> or under Kubernetes' <code>runAsNonRoot</code>.</span></div>
  <div class="kv"><span class="k">STOPSIGNAL matters for databases</span><span class="v">PostgreSQL treats SIGTERM as "smart shutdown" (wait for every client to disconnect), SIGINT as "fast shutdown" (roll back open transactions, stop cleanly) and SIGQUIT as "immediate shutdown" (exit without a checkpoint, recover on next start) — which is why the official image sets <code>STOPSIGNAL SIGINT</code>: <code>docker image inspect postgres:16-alpine --format '{{.Config.StopSignal}}'</code> prints <code>SIGINT</code>, while <code>nginx:1.27-alpine</code> prints <code>SIGQUIT</code>, nginx's graceful stop. (An earlier version of this lesson called SIGQUIT Postgres's fast shutdown; it is the crash-like one.) Getting this wrong is the difference between a clean stop and a ten-second timeout followed by SIGKILL (Lesson 1.3).</span></div>
  <div class="kv"><span class="k">SHELL with pipefail</span><span class="v">The default <code>sh -c</code> ignores failures in the middle of a pipe, so <code>RUN curl … | tar x</code> succeeds even when curl fails. Setting <code>SHELL ["/bin/bash","-eo","pipefail","-c"]</code> fixes that for every later <code>RUN</code> — worth it in any image with bash.</span></div>
  <div class="kv"><span class="k">LABEL is free and searchable</span><span class="v">Zero bytes in the image, and <code>docker image ls --filter "label=…"</code> can find them. Use the <code>org.opencontainers.image.*</code> names (Lesson 3.1).</span></div>
</div>

<h3>When to use each metadata instruction — and when not to</h3>
<table>
<tr><th>Instruction</th><th>Use it when</th><th>Do NOT use it for</th></tr>
<tr><td><code>EXPOSE</code></td><td>Documenting which port the app listens on; <code>-P</code> reads it. Checked: <code>docker run -d -P nginx:1.27-alpine</code> then <code>docker port</code> printed <code>80/tcp -&gt; 0.0.0.0:55001</code>; without <code>-P</code>, <code>docker ps</code> just shows <code>80/tcp</code> with no host port.</td><td>Opening a port. It never does.</td></tr>
<tr><td><code>ENV</code></td><td>Settings the app needs at run time and that are safe to be public (<code>NODE_ENV</code>, <code>PORT</code>, <code>PYTHONUNBUFFERED</code>).</td><td>Secrets — <code>docker inspect</code> shows every <code>ENV</code> to anyone with the image.</td></tr>
<tr><td><code>USER</code></td><td>Always, late in the file, before <code>CMD</code>. Numeric UIDs are the most portable.</td><td>Before <code>RUN apk add</code> or <code>apt-get</code> — those need root.</td></tr>
<tr><td><code>HEALTHCHECK</code></td><td>Any long-running server; Compose's <code>depends_on: condition: service_healthy</code> waits for it (Chapter 9).</td><td>Commands the image does not contain — <code>curl</code> is absent from most slim images; Alpine has busybox <code>wget</code>.</td></tr>
<tr><td><code>STOPSIGNAL</code></td><td>The program's graceful-stop signal is not SIGTERM (nginx: SIGQUIT, Postgres: SIGINT).</td><td>Fixing a slow stop caused by a shell as PID 1 — that is Lesson 4.3.</td></tr>
<tr><td><code>LABEL</code></td><td>Source repo, version, authors (<code>org.opencontainers.image.*</code>) — free and filterable.</td><td>Anything that should change behaviour.</td></tr>
</table>

<h3>Measured: what RUN chown -R really costs</h3>
${slide('dk-04', 11, 'RUN chown -R sau COPY = nhân đôi 160 MB chỉ để đổi quyền')}
<p>The pitfall at the end of this lesson says <code>RUN chown -R</code> duplicates files. Here is the measurement, on the course's Mac: a <code>node_modules</code> of 4,467 files (TypeScript and Prisma), copied into <code>node:22-alpine</code> two ways.</p>
<pre><code class="language-dockerfile"># A — copy, then change the owner
COPY --from=deps /app/node_modules ./node_modules
RUN chown -R node:node /app

# B — set the owner while copying
COPY --from=deps --chown=node:node /app/node_modules ./node_modules</code></pre>
<pre><code class="language-bash">docker history chown:a --format '{{.Size}}\\t{{.CreatedBy}}' | head -2
docker images chown</code></pre>
<div class="out">160MB	RUN /bin/sh -c chown -R node:node /app # bui…
160MB	COPY /app/node_modules ./node_modules # buil…
IMAGE      ID             DISK USAGE   CONTENT SIZE
chown:a    f9e24a18ef52        638MB          147MB
chown:b    a15c96f73d3e        433MB          103MB</div>
<p>The <code>chown</code> layer is exactly as big as the <code>COPY</code> layer, because changing a file's owner is a write and every written file is copied up whole into the new layer (Lesson 1.2). Version B is 205MB lighter on disk and 44MB lighter to download, for the same result.</p>

<h3>VOLUME — usually a mistake in your own image</h3>
${slide('dk-04', 12, 'VOLUME trong ảnh: mỗi lần run đẻ một volume vô danh')}
<pre><code>docker build -t voltest - &lt;&lt;'EOF'
FROM alpine
VOLUME /data
RUN echo hello &gt; /data/file.txt
CMD ["cat", "/data/file.txt"]
EOF</code></pre>
<div class="out">#5 0.075 /bin/sh: can't create /data/file.txt: nonexistent directory
ERROR: failed to build: failed to solve: process "/bin/sh -c echo hello &gt; /data/file.txt" did not complete successfully: exit code: 1</div>
<p>First surprise, on Docker 29 with BuildKit (Mac and Linux alike): <code>VOLUME</code> does not even create the directory during the build, so the <code>RUN</code> fails. Create it yourself and run the result <em>without</em> <code>--rm</code>, so we can look at the container afterwards:</p>
<pre><code>docker build -q -t voltest - &lt;&lt;'EOF'
FROM alpine
VOLUME /data
RUN mkdir -p /data &amp;&amp; echo hello &gt; /data/file.txt
CMD ["cat", "/data/file.txt"]
EOF
docker volume ls -q | wc -l
docker run --name vt1 voltest
docker inspect vt1 --format '{{range .Mounts}}{{.Type}} {{.Name}} -&gt; {{.Destination}}{{end}}'
docker volume ls -q | wc -l</code></pre>
<div class="out">      74
hello
volume 6fb8fab50e078a21308a967271fab7ecd6813b625a9eddaece85168e52345b60 -&gt; /data
      75</div>
<div class="callout warn"><strong>What really happens with BuildKit.</strong> The file written in the later <code>RUN</code> is <em>kept</em> — it is copied into the new volume when the container starts, so <code>cat</code> prints <code>hello</code>. An earlier version of this lesson said such files are discarded; that is the behaviour of the legacy builder, and the Dockerfile reference still documents both ("discarded when using the legacy builder… with BuildKit the changes will instead be kept"). The second surprise has not changed: every <code>docker run</code> of this image creates a new anonymous volume with a random name (74 → 75 above) that nothing cleans up unless you remove the container with <code>docker rm -v</code> or run it with <code>--rm</code> (Lesson 3.5). <code>VOLUME</code> is appropriate in a database image published for other people. In your application image it takes control away from whoever runs it, and they can express the same thing with <code>-v</code> when they actually want it.</div>

<h3>The rare ones</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ONBUILD</span><span class="v">Registers an instruction that runs when someone else builds <code>FROM</code> your image. Powerful and confusing — the child's build does things that are not in the child's Dockerfile. Multi-stage builds have made it mostly obsolete.</span></div>
  <div class="kv"><span class="k">ARG</span><span class="v">Build-time only, and visible in <code>docker history</code>. Lesson 4.4 covers it properly, including why it must never hold a secret.</span></div>
  <div class="kv"><span class="k">MAINTAINER</span><span class="v">Deprecated. Use <code>LABEL org.opencontainers.image.authors="…"</code>.</span></div>
  <div class="kv"><span class="k">CMD / ENTRYPOINT</span><span class="v">The two that decide what actually runs, and the pair people get wrong most often. That is the whole of Lesson 4.3.</span></div>
</div>
<pre><code>docker rm -v vt1 &gt;/dev/null 2&gt;&amp;1; docker rmi voltest &gt;/dev/null 2&gt;&amp;1</code></pre>

<h3>The instructions, grouped by what they cost</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Creates a layer</span><span class="lz-t"><code>RUN</code>, <code>COPY</code>, <code>ADD</code></span><span class="lz-d">Each one adds bytes to the image and a cache entry. Order them so the ones that change least often come first.</span></div>
  <div class="lz-node"><span class="lz-k">Metadata only</span><span class="lz-t"><code>ENV</code>, <code>WORKDIR</code>, <code>EXPOSE</code>, <code>LABEL</code></span><span class="lz-d">Free in size, and they still invalidate the cache for everything below them when they change.</span></div>
  <div class="lz-node"><span class="lz-k">Runtime behaviour</span><span class="lz-t"><code>CMD</code>, <code>ENTRYPOINT</code>, <code>USER</code>, <code>HEALTHCHECK</code></span><span class="lz-d">Nothing happens at build time. They are recorded in the config and read when a container starts.</span></div>
  <div class="lz-node"><span class="lz-k">Build-time only</span><span class="lz-t"><code>ARG</code>, <code>FROM … AS</code></span><span class="lz-d"><code>ARG</code> is not available at runtime, which is the difference from <code>ENV</code> that catches everyone once.</span></div>
</div>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate's Dockerfile for the SWP391 API "works", but the image is twice the size it should be, the build stayed green on the day the install script's URL was broken, and <code>docker stop</code> on the database container was once followed by a long recovery. Review it instruction by instruction.</p><ol>
<li>In <code>~/thu-docker/review</code>, write a Dockerfile that copies any folder with many files (for example a <code>node_modules</code>) into <code>node:22-alpine</code> and then runs <code>RUN chown -R node:node /app</code>. Build it as <code>review:a</code>.</li>
<li>Replace the <code>RUN chown</code> with <code>COPY --chown=node:node</code>, build <code>review:b</code>, and compare with <code>docker history</code> and <code>docker images review</code>.</li>
<li>Add <code>RUN wget -qO- https://example.invalid/install.sh | sh</code>, build, and note that it is green. Then add <code>SHELL ["/bin/sh", "-eo", "pipefail", "-c"]</code> above it and build again.</li>
<li>Print the stop signal of the two official images you use most: <code>docker image inspect postgres:16-alpine nginx:1.27-alpine --format '{{.Config.StopSignal}}'</code>, and write one sentence about what each one means for that program.</li>
<li>Clean up: <code>docker rmi review:a review:b</code>.</li></ol>
<p><strong>Done when:</strong> <code>docker history review:a</code> shows a <code>chown</code> layer as large as the <code>COPY</code> layer and <code>review:b</code> has no such layer; the pipe build fails only after you add <code>pipefail</code>; and you can say why Postgres uses SIGINT and nginx SIGQUIT.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Parser directive</span><span class="v">A special comment on line 1, such as <code># syntax=docker/dockerfile:1</code>, that changes how the file is read.</span></div>
  <div class="kv"><span class="k">Heredoc</span><span class="v">A multi-line block <code>RUN &lt;&lt;EOF … EOF</code>; it needs <code>set -e</code> to stop on errors.</span></div>
  <div class="kv"><span class="k">pipefail</span><span class="v">A shell option that makes a pipe fail when any command in it fails, not just the last one.</span></div>
  <div class="kv"><span class="k">Copy-up</span><span class="v">Writing to a file from a lower layer copies the whole file into the new layer — why <code>chown -R</code> doubles size.</span></div>
  <div class="kv"><span class="k">Anonymous volume</span><span class="v">A volume with a random name, created by <code>VOLUME</code> in an image on every run.</span></div>
  <div class="kv"><span class="k">Stop signal</span><span class="v">The signal <code>docker stop</code> sends first; set per image with <code>STOPSIGNAL</code>.</span></div>
  <div class="kv"><span class="k">Checksum</span><span class="v">A hash of the expected bytes; <code>ADD --checksum</code> refuses anything else.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Eighteen instructions, but only <code>RUN</code>, <code>COPY</code> and <code>ADD</code> add bytes; the rest are configuration.</li>
<li>Every <code>RUN</code> is a new shell: use <code>WORKDIR</code>, <code>set -eux</code> in heredocs and <code>pipefail</code> for pipes.</li>
<li>Use <code>COPY</code>; <code>ADD</code> unpacks tarballs and re-downloads URLs silently unless pinned with <code>--checksum</code>.</li>
<li><code>COPY --chown</code> sets ownership for free; <code>RUN chown -R</code> duplicates every file.</li>
<li>With BuildKit, <code>VOLUME</code> keeps files but still creates an anonymous volume per run — leave it out of app images.</li>
<li>Metadata instructions cost zero bytes but decide run-time behaviour: <code>USER</code> late, <code>STOPSIGNAL</code> per program, <code>EXPOSE</code> opens nothing.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/dockerfile/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Dockerfile reference</span><span class="lc-sub">Every instruction with exact semantics and edge cases. The <code>COPY</code> and <code>ADD</code> sections in particular are worth reading in full — most of the surprises in this lesson are documented there.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/buildkit/dockerfile-release-notes/" target="_blank" rel="noopener">
  <span class="lc-ico">🆕</span>
  <span class="lc-body"><span class="lc-title">Dockerfile frontend release notes</span><span class="lc-sub">What each <code># syntax=docker/dockerfile:1.x</code> version added — heredocs, <code>COPY --link</code>, cache and secret mounts. Useful for knowing what you can rely on.</span></span>
</a>
<a class="link-card" href="https://github.com/hadolint/hadolint" target="_blank" rel="noopener">
  <span class="lc-ico">🔎</span>
  <span class="lc-body"><span class="lc-title">hadolint — a Dockerfile linter</span><span class="lc-sub"><code>docker run --rm -i hadolint/hadolint &lt; Dockerfile</code> catches unpinned versions, <code>ADD</code> misuse, missing <code>--no-install-recommends</code> and more. Add it to CI; it pays for itself immediately.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: the instruction set</span><span class="lc-sub">Graded exercises: replace an <code>ADD</code> with a verifiable <code>RUN curl</code>, fix an image that loses files to a <code>VOLUME</code>, add a healthcheck and labels, and explain why <code>USER</code> is placed where it is.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> <code>RUN chown -R node:node /app</code> after copying. It looks harmless and it duplicates every file in <code>/app</code> into a new layer, because changing a file's metadata is a write and writes copy up (Lesson 1.2). On a <code>node_modules</code> with 40,000 files that is hundreds of megabytes added to the image for a permission change. Use <code>COPY --chown=node:node</code> instead, which sets ownership as the files are written and costs nothing. The same applies to <code>RUN chmod -R</code>: prefer <code>COPY --chmod</code>.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Put <code># syntax=docker/dockerfile:1</code> on the first line of every Dockerfile — it unlocks cache mounts, secret mounts and heredocs at no cost. Use <code>COPY</code>, not <code>ADD</code>: <code>ADD</code>'s auto-extract and URL download are both surprising, and the URL form does not verify anything. And do not put <code>VOLUME</code> in your own application image — it discards files written afterwards and leaks an anonymous volume on every run.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Mọi chỉ thị, và nó thật sự làm gì</h2>
<p class="lead">Dockerfile có mười tám chỉ thị (mười bảy nếu bỏ <code>MAINTAINER</code> đã lỗi thời — bản cũ của bài ghi mười bảy). Bạn sẽ dùng chín cái liên tục, bốn cái thi thoảng, và số còn lại gần như không bao giờ — nhưng vài cái bạn dùng hằng ngày lại có hành vi KHÔNG hiển nhiên, và hai trong số đó thật sự nguy hiểm trong ảnh của chính bạn.</p>

<h3>Bắt đầu bằng dòng syntax</h3>
${slide('dk-04', 8, '18 chỉ thị — nhóm theo cái giá mỗi chỉ thị phải trả')}
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine
…</code></pre>
<div class="callout ok"><strong>Cái chú thích đó là một chỉ thị cho bộ phân tích, và nó nên là dòng ĐẦU TIÊN của mọi Dockerfile bạn viết.</strong> Nó bảo BuildKit lấy về bộ frontend ổn định hiện hành, và điều đó mở khoá những tính năng mà nếu không thì không có: <code>RUN --mount=type=cache</code> (Chương 5), <code>RUN --mount=type=secret</code> (Chương 6), <code>COPY --link</code>, và cú pháp heredoc. Phiên bản <code>1</code> nghĩa là "bản 1.x mới nhất", nên nó tự tốt lên mà bạn không phải làm gì. Nó BẮT BUỘC phải là một chú thích ở đúng dòng đầu tiên — nằm sau bất kỳ chỉ thị nào thì nó chỉ là một chú thích thường.</div>

<h3>FROM — cái nền</h3>
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine                    <span class="tok-comment"># trường hợp bình thường, có ghim</span>
FROM node:22-alpine AS build           <span class="tok-comment"># một stage CÓ TÊN (Chương 6)</span>
FROM --platform=\$BUILDPLATFORM golang:1.23 AS cross   <span class="tok-comment"># Bài 3.4</span>
FROM scratch                           <span class="tok-comment"># rỗng hoàn toàn — cho chương trình tĩnh</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Một Dockerfile, nhiều FROM</span><span class="v">Mỗi <code>FROM</code> bắt đầu một stage mới. Chỉ cái CUỐI CÙNG tạo ra ảnh cuối, trừ khi bạn truyền <code>--target</code>. Đây là dựng nhiều tầng, và Chương 6 dựng trên nền đó.</span></div>
  <div class="kv"><span class="k">AS tên</span><span class="v">Đặt tên cho một stage để <code>COPY --from=build</code> với vào được. Tên hơn chỉ số (<code>--from=0</code>) vì chèn thêm một stage không làm đánh số lại thứ gì.</span></div>
  <div class="kv"><span class="k">FROM scratch</span><span class="v">Không byte nào: không shell, không libc, không <code>/etc/passwd</code>. Chỉ dành cho chương trình tĩnh hoàn toàn — Go, Rust với musl. Mọi kỹ thuật gỡ lỗi đều cần cách dùng container phụ ở Bài 2.3.</span></div>
  <div class="kv"><span class="k">ARG trước FROM</span><span class="v">Đây là chỗ DUY NHẤT một <code>ARG</code> được đứng trước <code>FROM</code> đầu tiên, để bạn tham số hoá cái nền: <code>ARG NODE_VERSION=22</code> rồi <code>FROM node:&#36;{NODE_VERSION}-alpine</code>. Lưu ý sau đó nó nằm ngoài phạm vi bên trong stage (Bài 4.4).</span></div>
</div>

<h3>RUN — cái tốn tiền</h3>
${slide('dk-04', 9, 'RUN: mỗi dòng một shell mới — và lỗi giữa ống dẫn bị nuốt')}
<pre><code><span class="tok-comment"># Dạng shell: chạy qua /bin/sh -c, nên &amp;&amp; || | \$VAR đều hoạt động</span>
RUN apk add --no-cache curl &amp;&amp; rm -rf /var/cache/apk/*

<span class="tok-comment"># Dạng exec: không có shell nào, không &amp;&amp;, không khai triển biến</span>
RUN ["/usr/bin/apk", "add", "--no-cache", "curl"]

<span class="tok-comment"># Heredoc: nhiều dòng mà không cần gạch chéo ngược (cần dòng syntax)</span>
RUN &lt;&lt;EOF
set -eux
apk add --no-cache curl jq
rm -rf /var/cache/apk/*
EOF</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Một RUN = một tầng</span><span class="v">Nên hãy gộp những thứ thuộc về nhau. Cài ở một <code>RUN</code> rồi dọn dẹp ở <code>RUN</code> kế tiếp là để lại TRỌN sức nặng của lượt cài trong ảnh cộng thêm một whiteout (Bài 1.2).</span></div>
  <div class="kv"><span class="k">set -eux trong heredoc</span><span class="v">Không có <code>-e</code> thì một cú hỏng giữa script bị bỏ qua và lượt dựng THÀNH CÔNG với một cái ảnh hỏng. Chuỗi <code>&amp;&amp;</code> của dạng shell có sẵn điều này; heredoc thì không, nên hãy thêm vào.</span></div>
  <div class="kv"><span class="k">--mount=type=cache</span><span class="v">Một thư mục bền vững xuyên các lượt dựng — cho <code>~/.npm</code>, <code>/var/cache/apt</code>, bộ đệm mô-đun Go. Cú tăng tốc đơn lẻ lớn nhất của Chương 5.</span></div>
  <div class="kv"><span class="k">--network=none</span><span class="v">Chạy bước đó không có mạng. Hữu ích để chứng minh một bước dựng là khép kín, và để làm hài lòng người soát chuỗi cung ứng.</span></div>
</div>

<h3>Chạy thử từng bước: ba cách một dòng RUN nói dối bạn</h3>
<p>Một lượt dựng xanh KHÔNG có nghĩa là mọi lệnh trong đó đã thành công. Cả ba ví dụ dưới đây đều được dựng thật trên máy Mac của khoá (Docker 29.8); cả ba đều là những lỗi đã đem ảnh hỏng lên production từ những kho mã thật.</p>
<pre><code class="language-dockerfile">FROM alpine
RUN mkdir /app &amp;&amp; cd /app
RUN pwd
WORKDIR /app
RUN pwd</code></pre>
<div class="out">#6 0.076 /
#8 0.079 /app</div>
<p><strong>① <code>cd</code> chết cùng với lệnh RUN của nó.</strong> Mỗi <code>RUN</code> mở một shell mới tinh, nên lệnh <code>pwd</code> thứ hai chạy ở <code>/</code>. <code>WORKDIR</code> là cách duy nhất để chuyển thư mục một cách bền vững.</p>
<pre><code class="language-dockerfile"># syntax=docker/dockerfile:1
FROM alpine
RUN &lt;&lt;SCRIPT
apk add --no-cache goi-khong-ton-tai
echo "dòng sau vẫn chạy — bước này XANH"
SCRIPT</code></pre>
<div class="out">#7 3.489 ERROR: unable to select packages:
#7 3.489   goi-khong-ton-tai (no such package):
#7 3.489     required by: world[goi-khong-ton-tai]
#7 3.502 dòng sau vẫn chạy — bước này XANH
#7 DONE 3.5s</div>
<p><strong>② Heredoc (khối nhiều dòng) không có <code>set -e</code> thì bỏ qua lỗi.</strong> Mã thoát của script là mã của dòng CUỐI, mà <code>echo</code> thì thành công. Hãy đặt <code>set -eux</code> lên đầu: khi đó chính bước này dừng ở <code>apk</code>, in từng lệnh trước khi chạy (<code>+ apk add …</code>) và làm hỏng lượt dựng với <code>exit code: 1</code>. (Kiểm tiện thể: bộ đọc Dockerfile có sẵn của Docker 29 chạy heredoc cả khi không có dòng <code># syntax</code>; cứ giữ dòng đó vì những tính năng mới hơn mà nó mở khoá.)</p>
<pre><code class="language-dockerfile">FROM alpine
RUN wget -qO- http://host.docker.internal:18041/install.sh | sh
RUN echo "đã tới bước 3 — ảnh vẫn dựng được"
SHELL ["/bin/sh", "-eo", "pipefail", "-c"]
RUN wget -qO- http://host.docker.internal:18041/install.sh | sh</code></pre>
<div class="out">#5 [2/4] RUN wget -qO- http://host.docker.internal:18041/install.sh | sh
#5 0.093 wget: server returned error: HTTP/1.1 404 Not Found
#5 DONE 0.1s
#6 [3/4] RUN echo "đã tới bước 3 — ảnh vẫn dựng được"
#7 [4/4] RUN wget -qO- http://host.docker.internal:18041/install.sh | sh
#7 0.108 wget: server returned error: HTTP/1.1 404 Not Found
#7 ERROR: process "/bin/sh -eo pipefail -c wget -qO- http://host.docker.internal:18041/install.sh | sh" did not complete successfully: exit code: 1</div>
<p><strong>③ Lỗi ở ĐẦU ống dẫn (pipe) bị nuốt mất.</strong> URL của script cài đặt trả 404 (một máy chủ thử cục bộ đóng vai máy chủ thật), <code>sh</code> nhận đầu vào rỗng, chẳng chạy gì và thoát 0 — nên bước đó xanh và KHÔNG có gì được cài. Mã thoát của một ống dẫn là mã của lệnh CUỐI. <code>SHELL [… "-o", "pipefail" …]</code> làm cả ống dẫn hỏng nếu bất kỳ phần nào hỏng, cho mọi <code>RUN</code> sau nó. <code>sh</code> của busybox trên Alpine hỗ trợ cờ này, nên bạn không cần bash.</p>

<h3>COPY so với ADD</h3>
${slide('dk-04', 10, 'COPY làm đúng điều bạn nói — ADD làm thêm hai việc bất ngờ')}
<pre><code>COPY package.json ./                        <span class="tok-comment"># cái bạn muốn, 95% số lần</span>
COPY --chown=node:node src ./src            <span class="tok-comment"># đặt quyền sở hữu ngay lúc chép</span>
COPY --chmod=755 entrypoint.sh /usr/local/bin/
COPY --from=build /app/dist ./dist          <span class="tok-comment"># từ một stage khác</span>
COPY --link ./static /www                   <span class="tok-comment"># tầng độc lập, cache tốt hơn</span>

ADD https://example.com/file.tar.gz /tmp/   <span class="tok-comment"># ADD tải được URL…</span>
ADD archive.tar.gz /opt/                    <span class="tok-comment"># …và TỰ GIẢI NÉN tar ở máy</span></code></pre>
<div class="callout warn"><strong>Hãy dùng <code>COPY</code> trừ khi bạn thật sự cần một trong hai hành vi phụ của <code>ADD</code></strong> — và cả hai đều là cái bẫy. <code>ADD</code> tự giải nén kho tar ở máy, nên <code>ADD data.tar.gz /opt/</code> âm thầm bung nó ra thay vì chép, và điều đó gây bất ngờ nếu bạn muốn cái FILE. Còn <code>ADD &lt;url&gt;</code> thì tải về mà KHÔNG kiểm tổng và — đo trên BuildKit, xem bên dưới — nó kiểm lại URL ở MỖI lượt dựng, nên khi máy chủ đổi file thì tầng đó cứ thế được dựng lại với byte mới mà chẳng có gì cảnh báo: cùng một Dockerfile lặng lẽ đem đi nội dung khác. (Bản cũ của bài nói cache KHÔNG bị vô hiệu hoá; trên BuildKit thì có, và đó là cái bẫy theo chiều ngược lại.) <code>ADD --checksum=sha256:…</code> ghim chặt các byte và báo lỗi to rõ khi chúng khác. Với file ở xa thì <code>RUN curl -fsSL url -o file &amp;&amp; echo "sha256 file" | sha256sum -c</code> là tường minh và kiểm chứng được.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">--chown / --chmod</span><span class="v">Đặt quyền sở hữu và chế độ NGAY LÚC chép thay vì một lệnh <code>RUN chown</code> theo sau — cái đó sẽ nhân đôi mọi file vừa chép vào một tầng mới, làm phình gấp đôi phần đó của ảnh.</span></div>
  <div class="kv"><span class="k">--from=stage</span><span class="v">Chép ra từ một stage trước đó, hoặc thậm chí từ một ảnh khác: <code>COPY --from=nginx:alpine /etc/nginx/nginx.conf ./</code> chạy được và là một cách gọn để lấy một file ra khỏi một cái ảnh.</span></div>
  <div class="kv"><span class="k">--link</span><span class="v">Tạo tầng đó ĐỘC LẬP với trạng thái hệ thống file trước đó, nên một tầng trước thay đổi không vô hiệu hoá nó. Một thắng lợi rẻ với tài nguyên tĩnh lớn; cần dòng syntax.</span></div>
  <div class="kv"><span class="k">Dấu gạch chéo cuối CÓ ý nghĩa</span><span class="v"><code>COPY file /dest</code> làm <code>/dest</code> thành một FILE; <code>COPY file /dest/</code> đặt nó vào bên trong một thư mục. Với nhiều nguồn thì đích BẮT BUỘC phải kết thúc bằng dấu gạch chéo.</span></div>
  <div class="kv"><span class="k">Ngữ nghĩa thư mục khác cp</span><span class="v"><code>COPY src ./src</code> chép <em>NỘI DUNG</em> của <code>src</code> vào <code>./src</code>. Không có cách nào chép chính cái thư mục mà vẫn giữ tên nó ở cấp trên — bạn đặt tên cho ĐÍCH thay vào đó.</span></div>
</div>

<h3>Nhìn tận mắt: ADD tự bung nén, và ADD &lt;url&gt; đổi dưới chân bạn</h3>
<pre><code class="language-dockerfile">FROM busybox
COPY data.tar.gz /copy/
ADD  data.tar.gz /add/
RUN find /copy /add</code></pre>
<div class="out">/copy
/copy/data.tar.gz
/add
/add/data
/add/data/a.txt
/add/data/b.txt</div>
<p>Cùng một file, hai chỉ thị, hai kết quả: <code>COPY</code> giữ nguyên file nén, <code>ADD</code> bung nó ra. Tiếp theo là dạng URL, nhắm vào một máy chủ web nhỏ chạy cục bộ mà ta sửa file của nó giữa hai lượt dựng:</p>
<pre><code class="language-dockerfile">FROM alpine
ADD http://host.docker.internal:18041/v.txt /v.txt
RUN cat /v.txt</code></pre>
<div class="out"># lượt dựng đầu
#7 0.074 phien ban 1
# sửa file trên máy chủ, giữ nguyên Dockerfile, dựng lại
#7 0.073 phien ban 2
# ghim bằng ADD --checksum=sha256:… của một file mà sau đó đã bị đổi
#5 ERROR: digest mismatch sha256:d839b4a2a119349a145a4177d99d4147c0c8beb212f25e42a03420239de6e0a8: sha256:e4c33b5c4c90f29812fafd5a6407de683d9740be96d3b78282a7a37a24d63f11</div>
<table>
<tr><th>Bạn cần…</th><th>Dùng</th><th>Vì sao</th></tr>
<tr><td>Chép file từ ngữ cảnh</td><td><code>COPY</code></td><td>Làm đúng điều nó nói, không hơn.</td></tr>
<tr><td>Chép từ stage khác hoặc từ một ảnh</td><td><code>COPY --from=build</code> / <code>COPY --from=nginx:1.27-alpine</code></td><td>Dựng nhiều stage, Chương 6.</td></tr>
<tr><td>Tải một file trong lúc dựng</td><td><code>ADD --checksum=sha256:…</code> hoặc <code>RUN curl -fsSL … &amp;&amp; sha256sum -c</code></td><td>Tái lập được: byte khác thì lượt dựng hỏng thay vì lặng lẽ đem đi.</td></tr>
<tr><td>Cố ý bung một file tar</td><td><code>ADD file.tar.gz /opt/</code></td><td>Cách dùng chính đáng duy nhất của việc tự bung — ghi chú lại để không ai "sửa" nó thành <code>COPY</code>.</td></tr>
<tr><td>Đem theo file tar nguyên vẹn</td><td><code>COPY</code></td><td><code>ADD</code> sẽ bung nó ra.</td></tr>
</table>

<h3>Các chỉ thị siêu dữ liệu</h3>
${slide('dk-04', 13, 'Chỉ thị siêu dữ liệu: 0 byte nhưng quyết định lúc chạy')}
<pre><code>WORKDIR /app                              <span class="tok-comment"># có trạng thái; tự tạo thư mục; dùng đường dẫn tuyệt đối</span>
ENV NODE_ENV=production PORT=3000         <span class="tok-comment"># có mặt lúc DỰNG VÀ lúc CHẠY</span>
EXPOSE 3000/tcp                           <span class="tok-comment"># tài liệu + gợi ý cho -P</span>
LABEL org.opencontainers.image.source="https://github.com/me/app"
STOPSIGNAL SIGQUIT                        <span class="tok-comment"># tín hiệu docker stop gửi đầu tiên</span>
USER node                                 <span class="tok-comment"># mọi thứ sau dòng này chạy dưới quyền node</span>
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \\
  CMD wget -qO- http://localhost:3000/health || exit 1
SHELL ["/bin/bash", "-eo", "pipefail", "-c"]   <span class="tok-comment"># đổi shell mà RUN dùng</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">EXPOSE KHÔNG publish gì</span><span class="v">Nó ghi một cái cổng vào siêu dữ liệu của ảnh. <code>docker run -P</code> đọc nó để chọn cổng ngẫu nhiên trên máy chủ, còn Compose dùng nó làm tài liệu. Bạn vẫn cần <code>-p</code> hoặc một mục <code>ports:</code>.</span></div>
  <div class="kv"><span class="k">USER nên đứng MUỘN</span><span class="v">Hãy đặt nó sau những lệnh <code>RUN</code> cần quyền root, ngay trước <code>CMD</code>. Và nên dùng UID dạng số (<code>USER 1000:1000</code>) để nó vẫn đúng khi ảnh được chạy với một <code>--user</code> khác hoặc dưới <code>runAsNonRoot</code> của Kubernetes.</span></div>
  <div class="kv"><span class="k">STOPSIGNAL quan trọng với cơ sở dữ liệu</span><span class="v">PostgreSQL coi SIGTERM là "smart shutdown" (chờ MỌI máy khách tự ngắt), SIGINT là "fast shutdown" (huỷ các giao dịch dở dang, dừng sạch sẽ) và SIGQUIT là "immediate shutdown" (thoát không checkpoint, lần khởi động sau phải phục hồi) — đó là lý do ảnh chính thức đặt <code>STOPSIGNAL SIGINT</code>: <code>docker image inspect postgres:16-alpine --format '{{.Config.StopSignal}}'</code> in ra <code>SIGINT</code>, còn <code>nginx:1.27-alpine</code> in <code>SIGQUIT</code> — cách dừng êm của nginx. (Bản cũ của bài gọi SIGQUIT là "tắt nhanh" của Postgres; thật ra nó là kiểu dừng giống sập máy.) Sai chỗ này là khác biệt giữa một cú dừng sạch sẽ với mười giây hết giờ rồi SIGKILL (Bài 1.3).</span></div>
  <div class="kv"><span class="k">SHELL với pipefail</span><span class="v"><code>sh -c</code> mặc định BỎ QUA lỗi ở giữa một ống dẫn, nên <code>RUN curl … | tar x</code> vẫn thành công kể cả khi curl hỏng. Đặt <code>SHELL ["/bin/bash","-eo","pipefail","-c"]</code> sửa chuyện đó cho mọi <code>RUN</code> phía sau — đáng làm trong bất kỳ ảnh nào có bash.</span></div>
  <div class="kv"><span class="k">LABEL thì miễn phí và tìm được</span><span class="v">Không tốn byte nào trong ảnh, và <code>docker image ls --filter "label=…"</code> tìm ra chúng. Hãy dùng những cái tên <code>org.opencontainers.image.*</code> (Bài 3.1).</span></div>
</div>

<h3>Khi nào dùng từng chỉ thị siêu dữ liệu — và khi nào KHÔNG</h3>
<table>
<tr><th>Chỉ thị</th><th>Dùng khi</th><th>KHÔNG dùng để</th></tr>
<tr><td><code>EXPOSE</code></td><td>Ghi lại app nghe ở cổng nào; <code>-P</code> đọc nó. Đã kiểm: <code>docker run -d -P nginx:1.27-alpine</code> rồi <code>docker port</code> in <code>80/tcp -&gt; 0.0.0.0:55001</code>; không có <code>-P</code> thì <code>docker ps</code> chỉ ghi <code>80/tcp</code>, không có cổng máy chủ nào.</td><td>Mở cổng. Nó KHÔNG BAO GIỜ mở.</td></tr>
<tr><td><code>ENV</code></td><td>Thiết lập app cần lúc chạy và công khai được (<code>NODE_ENV</code>, <code>PORT</code>, <code>PYTHONUNBUFFERED</code>).</td><td>Bí mật — <code>docker inspect</code> cho bất kỳ ai có ảnh thấy mọi <code>ENV</code>.</td></tr>
<tr><td><code>USER</code></td><td>Luôn luôn, ở cuối file, trước <code>CMD</code>. UID dạng số là dễ mang đi nhất.</td><td>Đặt trước <code>RUN apk add</code> hay <code>apt-get</code> — mấy lệnh đó cần root.</td></tr>
<tr><td><code>HEALTHCHECK</code></td><td>Mọi máy chủ chạy lâu; <code>depends_on: condition: service_healthy</code> của Compose chờ nó (Chương 9).</td><td>Gọi lệnh mà ảnh không có — phần lớn ảnh slim không có <code>curl</code>; Alpine có <code>wget</code> của busybox.</td></tr>
<tr><td><code>STOPSIGNAL</code></td><td>Tín hiệu dừng êm của chương trình không phải SIGTERM (nginx: SIGQUIT, Postgres: SIGINT).</td><td>Chữa một cú dừng chậm do shell làm PID 1 — đó là việc của Bài 4.3.</td></tr>
<tr><td><code>LABEL</code></td><td>Kho mã nguồn, phiên bản, tác giả (<code>org.opencontainers.image.*</code>) — miễn phí và lọc được.</td><td>Bất cứ thứ gì định thay đổi hành vi.</td></tr>
</table>

<h3>Đo thật: RUN chown -R tốn bao nhiêu</h3>
${slide('dk-04', 11, 'RUN chown -R sau COPY = nhân đôi 160 MB chỉ để đổi quyền')}
<p>Cái bẫy ở cuối bài nói <code>RUN chown -R</code> nhân đôi file. Đây là số đo, trên máy Mac của khoá: một <code>node_modules</code> 4.467 file (TypeScript và Prisma), chép vào <code>node:22-alpine</code> theo hai cách.</p>
<pre><code class="language-dockerfile"># A — chép, rồi đổi chủ sở hữu
COPY --from=deps /app/node_modules ./node_modules
RUN chown -R node:node /app

# B — đặt chủ sở hữu ngay lúc chép
COPY --from=deps --chown=node:node /app/node_modules ./node_modules</code></pre>
<pre><code class="language-bash">docker history chown:a --format '{{.Size}}\\t{{.CreatedBy}}' | head -2
docker images chown</code></pre>
<div class="out">160MB	RUN /bin/sh -c chown -R node:node /app # bui…
160MB	COPY /app/node_modules ./node_modules # buil…
IMAGE      ID             DISK USAGE   CONTENT SIZE
chown:a    f9e24a18ef52        638MB          147MB
chown:b    a15c96f73d3e        433MB          103MB</div>
<p>Tầng <code>chown</code> nặng ĐÚNG bằng tầng <code>COPY</code>, vì đổi chủ sở hữu một file cũng là GHI, và mọi file bị ghi đều được chép nguyên vẹn lên tầng mới (Bài 1.2). Bản B nhẹ hơn 205MB trên đĩa và nhẹ hơn 44MB khi tải về, cho cùng một kết quả.</p>

<h3>VOLUME — thường là một sai lầm trong ảnh của chính bạn</h3>
${slide('dk-04', 12, 'VOLUME trong ảnh: mỗi lần run đẻ một volume vô danh')}
<pre><code>docker build -t voltest - &lt;&lt;'EOF'
FROM alpine
VOLUME /data
RUN echo hello &gt; /data/file.txt
CMD ["cat", "/data/file.txt"]
EOF</code></pre>
<div class="out">#5 0.075 /bin/sh: can't create /data/file.txt: nonexistent directory
ERROR: failed to build: failed to solve: process "/bin/sh -c echo hello &gt; /data/file.txt" did not complete successfully: exit code: 1</div>
<p>Bất ngờ thứ nhất, trên Docker 29 với BuildKit (Mac và Linux như nhau): <code>VOLUME</code> thậm chí KHÔNG tạo thư mục lúc dựng, nên lệnh <code>RUN</code> hỏng. Tự tạo nó, rồi chạy kết quả mà KHÔNG có <code>--rm</code> để còn nhìn lại container sau đó:</p>
<pre><code>docker build -q -t voltest - &lt;&lt;'EOF'
FROM alpine
VOLUME /data
RUN mkdir -p /data &amp;&amp; echo hello &gt; /data/file.txt
CMD ["cat", "/data/file.txt"]
EOF
docker volume ls -q | wc -l
docker run --name vt1 voltest
docker inspect vt1 --format '{{range .Mounts}}{{.Type}} {{.Name}} -&gt; {{.Destination}}{{end}}'
docker volume ls -q | wc -l</code></pre>
<div class="out">      74
hello
volume 6fb8fab50e078a21308a967271fab7ecd6813b625a9eddaece85168e52345b60 -&gt; /data
      75</div>
<div class="callout warn"><strong>Chuyện thật sự xảy ra với BuildKit.</strong> File được ghi ở lệnh <code>RUN</code> phía sau được GIỮ LẠI — nó được chép vào volume mới lúc container khởi động, nên <code>cat</code> in ra <code>hello</code>. Bản cũ của bài nói những file đó bị vứt; đó là hành vi của bộ dựng cũ (legacy builder), và tài liệu Dockerfile vẫn ghi cả hai ("bị vứt khi dùng legacy builder… với BuildKit thì thay đổi được giữ lại"). Bất ngờ thứ hai thì vẫn y nguyên: MỌI lệnh <code>docker run</code> của ảnh này tạo một volume vô danh mới với tên ngẫu nhiên (74 → 75 ở trên) mà chẳng có gì dọn, trừ khi bạn xoá container bằng <code>docker rm -v</code> hoặc chạy nó với <code>--rm</code> (Bài 3.5). <code>VOLUME</code> thì phù hợp trong một ảnh cơ sở dữ liệu công bố cho người khác dùng. Trong ảnh ứng dụng của bạn, nó lấy mất quyền kiểm soát của người chạy, và họ hoàn toàn diễn đạt được cùng ý đó bằng <code>-v</code> khi họ thật sự muốn.</div>

<h3>Những cái hiếm gặp</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ONBUILD</span><span class="v">Đăng ký một chỉ thị sẽ chạy khi NGƯỜI KHÁC dựng <code>FROM</code> ảnh của bạn. Mạnh và khó hiểu — lượt dựng của con làm những việc không nằm trong Dockerfile của con. Dựng nhiều tầng đã khiến nó gần như lỗi thời.</span></div>
  <div class="kv"><span class="k">ARG</span><span class="v">Chỉ có lúc dựng, và nhìn thấy được trong <code>docker history</code>. Bài 4.4 nói tử tế về nó, gồm cả lý do nó KHÔNG BAO GIỜ được giữ một bí mật.</span></div>
  <div class="kv"><span class="k">MAINTAINER</span><span class="v">Đã ngừng dùng. Hãy dùng <code>LABEL org.opencontainers.image.authors="…"</code>.</span></div>
  <div class="kv"><span class="k">CMD / ENTRYPOINT</span><span class="v">Hai chỉ thị quyết định thứ THẬT SỰ chạy, và là cặp mà người ta hiểu sai nhiều nhất. Đó là toàn bộ Bài 4.3.</span></div>
</div>
<pre><code>docker rm -v vt1 &gt;/dev/null 2&gt;&amp;1; docker rmi voltest &gt;/dev/null 2&gt;&amp;1</code></pre>

<h3>Các chỉ thị, nhóm theo thứ chúng tốn</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Tạo ra một tầng</span><span class="lz-t"><code>RUN</code>, <code>COPY</code>, <code>ADD</code></span><span class="lz-d">Mỗi cái thêm byte vào ảnh và thêm một mục trong bộ nhớ đệm. Hãy sắp thứ tự để những cái ít đổi nhất đứng trước.</span></div>
  <div class="lz-node"><span class="lz-k">Chỉ là siêu dữ liệu</span><span class="lz-t"><code>ENV</code>, <code>WORKDIR</code>, <code>EXPOSE</code>, <code>LABEL</code></span><span class="lz-d">Miễn phí về kích thước, mà khi đổi thì vẫn vô hiệu hoá bộ đệm cho mọi thứ bên dưới chúng.</span></div>
  <div class="lz-node"><span class="lz-k">Hành vi lúc chạy</span><span class="lz-t"><code>CMD</code>, <code>ENTRYPOINT</code>, <code>USER</code>, <code>HEALTHCHECK</code></span><span class="lz-d">Lúc build chẳng có gì xảy ra. Chúng được ghi vào phần cấu hình và được đọc khi một container khởi động.</span></div>
  <div class="lz-node"><span class="lz-k">Chỉ có lúc build</span><span class="lz-t"><code>ARG</code>, <code>FROM … AS</code></span><span class="lz-d"><code>ARG</code> KHÔNG có mặt lúc chạy, và đó là khác biệt với <code>ENV</code> mà ai cũng vấp một lần.</span></div>
</div>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> Dockerfile của một bạn cùng nhóm cho API SWP391 "chạy được", nhưng ảnh nặng gấp đôi mức đáng có, lượt dựng vẫn xanh đúng hôm URL script cài đặt bị hỏng, và có lần <code>docker stop</code> container CSDL xong thì lần khởi động sau phải phục hồi rất lâu. Hãy duyệt nó từng chỉ thị một.</p><ol>
<li>Trong <code>~/thu-docker/review</code>, viết một Dockerfile chép một thư mục nhiều file bất kỳ (ví dụ một <code>node_modules</code>) vào <code>node:22-alpine</code> rồi chạy <code>RUN chown -R node:node /app</code>. Dựng thành <code>review:a</code>.</li>
<li>Thay <code>RUN chown</code> bằng <code>COPY --chown=node:node</code>, dựng <code>review:b</code>, rồi so bằng <code>docker history</code> và <code>docker images review</code>.</li>
<li>Thêm <code>RUN wget -qO- https://example.invalid/install.sh | sh</code>, dựng, và để ý là nó xanh. Rồi thêm <code>SHELL ["/bin/sh", "-eo", "pipefail", "-c"]</code> phía trên và dựng lại.</li>
<li>In tín hiệu dừng của hai ảnh chính thức bạn dùng nhiều nhất: <code>docker image inspect postgres:16-alpine nginx:1.27-alpine --format '{{.Config.StopSignal}}'</code>, và viết một câu về ý nghĩa của từng cái với chương trình đó.</li>
<li>Dọn dẹp: <code>docker rmi review:a review:b</code>.</li></ol>
<p><strong>Đạt khi:</strong> <code>docker history review:a</code> có một tầng <code>chown</code> nặng bằng tầng <code>COPY</code> còn <code>review:b</code> không có tầng đó; lượt dựng có ống dẫn chỉ hỏng sau khi bạn thêm <code>pipefail</code>; và bạn nói được vì sao Postgres dùng SIGINT còn nginx dùng SIGQUIT.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Parser directive (chỉ dẫn cho bộ đọc)</span><span class="v">Dòng chú thích đặc biệt ở dòng 1, như <code># syntax=docker/dockerfile:1</code>, đổi cách file được đọc.</span></div>
  <div class="kv"><span class="k">Heredoc (khối nhiều dòng)</span><span class="v">Khối <code>RUN &lt;&lt;EOF … EOF</code>; cần <code>set -e</code> để dừng khi có lỗi.</span></div>
  <div class="kv"><span class="k">pipefail (hỏng cả ống)</span><span class="v">Tuỳ chọn của shell làm cả ống dẫn hỏng khi BẤT KỲ lệnh nào trong đó hỏng, không chỉ lệnh cuối.</span></div>
  <div class="kv"><span class="k">Copy-up (chép lên)</span><span class="v">Ghi vào một file của tầng dưới thì cả file bị chép lên tầng mới — lý do <code>chown -R</code> nhân đôi dung lượng.</span></div>
  <div class="kv"><span class="k">Anonymous volume (volume vô danh)</span><span class="v">Volume tên ngẫu nhiên, sinh ra ở MỖI lần chạy khi ảnh có <code>VOLUME</code>.</span></div>
  <div class="kv"><span class="k">Stop signal (tín hiệu dừng)</span><span class="v">Tín hiệu <code>docker stop</code> gửi đầu tiên; mỗi ảnh đặt bằng <code>STOPSIGNAL</code>.</span></div>
  <div class="kv"><span class="k">Checksum (mã kiểm tổng)</span><span class="v">Mã băm của các byte mong đợi; <code>ADD --checksum</code> từ chối mọi thứ khác.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mười tám chỉ thị, nhưng chỉ <code>RUN</code>, <code>COPY</code>, <code>ADD</code> thêm byte; phần còn lại là cấu hình.</li>
<li>Mỗi <code>RUN</code> là một shell mới: dùng <code>WORKDIR</code>, <code>set -eux</code> trong heredoc và <code>pipefail</code> cho ống dẫn.</li>
<li>Dùng <code>COPY</code>; <code>ADD</code> tự bung file tar và âm thầm tải lại URL nếu không ghim bằng <code>--checksum</code>.</li>
<li><code>COPY --chown</code> đặt quyền miễn phí; <code>RUN chown -R</code> nhân đôi mọi file.</li>
<li>Với BuildKit, <code>VOLUME</code> giữ file nhưng vẫn đẻ một volume vô danh mỗi lần chạy — bỏ nó khỏi ảnh ứng dụng.</li>
<li>Chỉ thị siêu dữ liệu tốn 0 byte nhưng quyết định lúc chạy: <code>USER</code> đặt muộn, <code>STOPSIGNAL</code> theo từng chương trình, <code>EXPOSE</code> chẳng mở gì.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/dockerfile/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Tài liệu tra cứu Dockerfile</span><span class="lc-sub">Mọi chỉ thị kèm ngữ nghĩa chính xác và các trường hợp biên. Riêng phần <code>COPY</code> và <code>ADD</code> đáng đọc trọn vẹn — phần lớn bất ngờ trong bài này đều được ghi ở đó.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/buildkit/dockerfile-release-notes/" target="_blank" rel="noopener">
  <span class="lc-ico">🆕</span>
  <span class="lc-body"><span class="lc-title">Ghi chú phát hành của frontend Dockerfile</span><span class="lc-sub">Mỗi phiên bản <code># syntax=docker/dockerfile:1.x</code> thêm cái gì — heredoc, <code>COPY --link</code>, cache và secret mount. Hữu ích để biết bạn trông cậy được vào cái gì.</span></span>
</a>
<a class="link-card" href="https://github.com/hadolint/hadolint" target="_blank" rel="noopener">
  <span class="lc-ico">🔎</span>
  <span class="lc-body"><span class="lc-title">hadolint — bộ soát lỗi Dockerfile</span><span class="lc-sub"><code>docker run --rm -i hadolint/hadolint &lt; Dockerfile</code> bắt được phiên bản không ghim, việc dùng sai <code>ADD</code>, thiếu <code>--no-install-recommends</code> và hơn thế. Hãy thêm nó vào CI; nó hoàn vốn ngay lập tức.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: bộ chỉ thị</span><span class="lc-sub">Bài chấm điểm: thay một lệnh <code>ADD</code> bằng một <code>RUN curl</code> kiểm chứng được, sửa một cái ảnh làm mất file vì <code>VOLUME</code>, thêm healthcheck và nhãn, và giải thích vì sao <code>USER</code> lại đặt ở đúng chỗ đó.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>RUN chown -R node:node /app</code> sau khi chép. Nó trông vô hại và nó NHÂN ĐÔI mọi file trong <code>/app</code> vào một tầng mới, vì đổi siêu dữ liệu của một file cũng là một lần GHI, và ghi thì chép-lên (Bài 1.2). Trên một <code>node_modules</code> có 40.000 file thì đó là hàng trăm megabyte thêm vào ảnh chỉ để đổi quyền. Hãy dùng <code>COPY --chown=node:node</code>, nó đặt quyền sở hữu ngay lúc file được ghi ra và không tốn gì. Điều tương tự áp cho <code>RUN chmod -R</code>: hãy ưu tiên <code>COPY --chmod</code>.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Hãy đặt <code># syntax=docker/dockerfile:1</code> ở dòng đầu tiên của mọi Dockerfile — nó mở khoá cache mount, secret mount và heredoc mà không tốn gì. Hãy dùng <code>COPY</code>, đừng dùng <code>ADD</code>: việc tự giải nén và tải URL của <code>ADD</code> đều gây bất ngờ, và dạng URL thì chẳng kiểm chứng gì cả. Và đừng đặt <code>VOLUME</code> trong ảnh ứng dụng của chính bạn — nó vứt đi những file ghi sau đó và rò một volume vô danh ở mọi lượt chạy.</p>
</div>
`,
    },
    /* ─────────────────────────── 4.3 ─────────────────────────── */
    {
      title: '4.3 — CMD, ENTRYPOINT and entrypoint scripts|||4.3 — CMD, ENTRYPOINT và script entrypoint',
      slug: 'dk-4-3-cmd-entrypoint',
      type: 'LESSON',
      description: 'Bảng chân trị đầy đủ của sáu tổ hợp, vì sao dạng exec quan trọng, mẫu exec "\\$@" trong script entrypoint, một entrypoint thật chờ cơ sở dữ liệu rồi chạy migration, và vì sao CMD npm start làm mọi lần dừng mất mười giây.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>CMD, ENTRYPOINT and entrypoint scripts</h2>
<p class="lead">These two instructions decide what actually runs, and the relationship between them is the single most misunderstood thing in a Dockerfile. The rule is one sentence: <strong>ENTRYPOINT is the program, CMD is its default arguments, and the final command is the two concatenated.</strong> Everything else follows.</p>

<h3>The truth table</h3>
${slide('dk-04', 14, 'Lệnh cuối = ENTRYPOINT + CMD — tham số gõ thêm thay CMD')}
<pre><code>demo() { docker build -q -t tt - &gt;/dev/null; docker run --rm tt \$@; }

<span class="tok-comment"># 1. CMD alone, exec form</span>
printf 'FROM alpine\\nCMD ["echo","hello"]\\n' | demo
<span class="tok-comment"># 2. CMD alone, overridden at run time</span>
printf 'FROM alpine\\nCMD ["echo","hello"]\\n' | demo echo goodbye
<span class="tok-comment"># 3. ENTRYPOINT + CMD</span>
printf 'FROM alpine\\nENTRYPOINT ["echo"]\\nCMD ["hello"]\\n' | demo
<span class="tok-comment"># 4. ENTRYPOINT + CMD, argument replaced</span>
printf 'FROM alpine\\nENTRYPOINT ["echo"]\\nCMD ["hello"]\\n' | demo goodbye</code></pre>
<div class="out">hello
goodbye
hello
goodbye</div>
<div class="lz-map">
  <div class="lz-stage">CMD only</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Fully replaceable default</span><span class="lz-nsub"><code>CMD ["node","server.js"]</code> → runs that. <code>docker run img sh</code> → runs a shell instead. Right for a general-purpose image where the user may want something else entirely.</span></div></div>
  <div class="lz-stage">ENTRYPOINT only</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A fixed program, arguments from the CLI</span><span class="lz-nsub"><code>ENTRYPOINT ["jq"]</code> → <code>docker run img -S .</code> runs <code>jq -S .</code>. The image behaves like a single command. Right for a CLI tool.</span></div></div>
  <div class="lz-stage">ENTRYPOINT + CMD</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A program with sensible defaults</span><span class="lz-nsub">The most useful combination and what official images use: <code>ENTRYPOINT ["docker-entrypoint.sh"]</code> plus <code>CMD ["postgres"]</code>. Users override just the arguments.</span></div></div>
  <div class="lz-stage">Neither</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nothing to run</span><span class="lz-nsub">The image is unusable without a command on the CLI. Legal, and almost never what you want.</span></div></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Arguments after the image name</span><span class="v">Replace <code>CMD</code> entirely and are appended to <code>ENTRYPOINT</code>. They never replace <code>ENTRYPOINT</code>.</span></div>
  <div class="kv"><span class="k">--entrypoint on the CLI</span><span class="v">Replaces <code>ENTRYPOINT</code> and <strong>clears <code>CMD</code></strong>. So <code>docker run --entrypoint sh img -c 'echo hi'</code> needs the <code>-c 'echo hi'</code> spelled out — it becomes the new CMD.</span></div>
  <div class="kv"><span class="k">ENTRYPOINT in shell form</span><span class="v">Poisons the combination: <code>ENTRYPOINT node server.js</code> becomes <code>/bin/sh -c "node server.js"</code> and <strong>CMD is ignored entirely</strong>. If your CMD seems to have no effect, this is why.</span></div>
  <div class="kv"><span class="k">A later CMD or ENTRYPOINT wins</span><span class="v">Only the last of each in a Dockerfile counts. And <code>ENTRYPOINT</code> in a base image persists into yours unless you reset it with <code>ENTRYPOINT []</code>.</span></div>
</div>

<h3>The full grid: what actually runs</h3>
${slide('dk-04', 15, 'Bảng CMD × ENTRYPOINT: lệnh nào thật sự chạy')}
<p>The Dockerfile reference has a table of every combination. Read each cell as "the command line that PID 1 is started with":</p>
<table>
<tr><th></th><th>No ENTRYPOINT</th><th><code>ENTRYPOINT exec_entry p1_entry</code> (shell form)</th><th><code>ENTRYPOINT ["exec_entry", "p1_entry"]</code> (exec form)</th></tr>
<tr><td><strong>No CMD</strong></td><td>error: <code>no command specified</code></td><td><code>/bin/sh -c exec_entry p1_entry</code></td><td><code>exec_entry p1_entry</code></td></tr>
<tr><td><strong><code>CMD ["exec_cmd", "p1_cmd"]</code></strong></td><td><code>exec_cmd p1_cmd</code></td><td><code>/bin/sh -c exec_entry p1_entry</code> — CMD ignored</td><td><code>exec_entry p1_entry exec_cmd p1_cmd</code></td></tr>
<tr><td><strong><code>CMD exec_cmd p1_cmd</code></strong></td><td><code>/bin/sh -c exec_cmd p1_cmd</code></td><td><code>/bin/sh -c exec_entry p1_entry</code> — CMD ignored</td><td><code>exec_entry p1_entry /bin/sh -c exec_cmd p1_cmd</code></td></tr>
</table>
<p>Three rows of that table, checked on the course's Mac:</p>
<pre><code class="language-bash"><span class="tok-comment"># Shell-form ENTRYPOINT: CMD and the argument "goodbye" are both ignored</span>
printf 'FROM alpine\\nENTRYPOINT echo from-entrypoint\\nCMD ["hello"]\\n' | demo goodbye
<span class="tok-comment"># Neither ENTRYPOINT nor CMD (an image FROM scratch with only a busybox binary)</span>
printf 'FROM scratch\\nCOPY --from=alpine /bin/busybox /busybox\\n' | docker build -q -t tt - &gt;/dev/null
docker run --rm tt
<span class="tok-comment"># Setting ENTRYPOINT in your Dockerfile resets the CMD inherited from the base image</span>
printf 'FROM node:22-alpine\\nENTRYPOINT ["echo","E:"]\\n' | docker build -q -t rs - &gt;/dev/null
docker image inspect rs --format 'E={{json .Config.Entrypoint}} C={{json .Config.Cmd}}'</code></pre>
<div class="out">from-entrypoint
docker: Error response from daemon: no command specified
E=["echo","E:"] C=null</div>
<p>The last line is a trap worth remembering: <code>node:22-alpine</code> itself has <code>CMD ["node"]</code>, but the moment your Dockerfile declares its own <code>ENTRYPOINT</code>, the inherited <code>CMD</code> is reset to nothing. If your image needs default arguments, write <code>CMD</code> again after <code>ENTRYPOINT</code>.</p>
<table>
<tr><th>At run time you type…</th><th>Effect</th></tr>
<tr><td><code>docker run img</code></td><td>ENTRYPOINT + CMD, as written in the image</td></tr>
<tr><td><code>docker run img a b</code></td><td>ENTRYPOINT + <code>a b</code> (CMD replaced)</td></tr>
<tr><td><code>docker run --entrypoint sh img</code></td><td><code>sh</code> alone — CMD is cleared too, so this is how you get a shell into an image whose ENTRYPOINT is a program</td></tr>
<tr><td><code>docker run -it --entrypoint sh img -c 'ls /app'</code></td><td><code>sh -c 'ls /app'</code> — the arguments become the new CMD</td></tr>
</table>

<h3>Shell form versus exec form, again</h3>
${slide('dk-04', 16, 'Dạng shell: Alpine tự exec giùm — Debian thì KHÔNG')}
<pre><code>docker build -q -t sf - &lt;&lt;'EOF' &gt;/dev/null
FROM alpine
CMD sleep 600
EOF
docker build -q -t ef - &lt;&lt;'EOF' &gt;/dev/null
FROM alpine
CMD ["sleep", "600"]
EOF
docker run -d --name sf sf &gt;/dev/null; docker run -d --name ef ef &gt;/dev/null
docker exec sf ps -o pid,args | head -2; docker exec ef ps -o pid,args | head -2
time docker stop sf &gt;/dev/null; time docker stop ef &gt;/dev/null</code></pre>
<div class="out">PID   COMMAND
    1 sleep 600
PID   COMMAND
    1 sleep 600
real	0m10.19s
real	0m10.17s</div>
<p class="note-ct">Real output, re-measured on the course's Linux machine (Docker 29.6; the Mac's Docker Desktop stops containers after about 3 s, so stop timings in this course come from Linux). An earlier version of this lesson showed <code>1 /bin/sh -c sleep 600</code> for the shell-form image and a 0.27 s stop for the exec-form one. Neither is true on Alpine: busybox <code>sh -c</code> <em>replaces itself</em> with a single command (Lesson 1.3), so both containers have <code>sleep</code> as PID 1 — and <code>sleep</code> installs no SIGTERM handler, so both wait the full ten seconds and die with exit 137. This pair of images simply cannot show the difference. The next block uses a real server that does handle SIGTERM.</p>
<div class="callout warn"><strong>Whether shell form hurts depends on the base image's shell — which is exactly why you should never rely on it.</strong> A small Node server that catches SIGTERM, six different <code>CMD</code> lines, each stopped with <code>docker stop</code> on the Linux machine:</div>
<table>
<tr><th>CMD line</th><th>Base image</th><th>PID 1</th><th>docker stop</th></tr>
<tr><td><code>CMD ["node", "server.js"]</code></td><td><code>node:22-alpine</code></td><td><code>node server.js</code></td><td>0.15 s, exit 0</td></tr>
<tr><td><code>CMD node server.js</code></td><td><code>node:22-alpine</code> (busybox sh)</td><td><code>node server.js</code> — busybox exec'd it</td><td>0.12 s, exit 0</td></tr>
<tr><td><code>CMD echo "starting…" &amp;&amp; node server.js</code></td><td><code>node:22-alpine</code></td><td><code>node server.js</code> — busybox exec's the last command of an <code>&amp;&amp;</code> list too</td><td>0.20 s, exit 0</td></tr>
<tr><td><code>CMD node server.js; echo "server exited"</code></td><td><code>node:22-alpine</code></td><td><code>/bin/sh -c …</code>, node is PID 8</td><td>10.18 s, exit 137</td></tr>
<tr><td><code>CMD node server.js</code></td><td><code>node:22-slim</code> (Debian dash)</td><td><code>/bin/sh -c node server.js</code>, node is PID 8</td><td>10.19 s, exit 137</td></tr>
<tr><td><code>CMD echo "starting…" &amp;&amp; node server.js</code></td><td><code>node:22-slim</code></td><td><code>/bin/sh -c …</code></td><td>10.19 s, exit 137</td></tr>
</table>
<div class="out"># node:22-slim, CMD node server.js — read from /proc because slim has no ps
1 /bin/sh -c node server.js
8 node server.js</div>
<p>So the same <code>CMD</code> line stops in a tenth of a second on Alpine and in ten seconds on Debian, and adding a harmless-looking <code>; echo</code> breaks Alpine too. In shell form, whether your process is PID 1 is an accident of which shell the base image ships. <strong>Always write <code>CMD</code> in exec form</strong> — as a JSON array, with double quotes, because single quotes are not valid JSON and Docker will treat the whole thing as shell form.</p>
<pre><code><span class="tok-comment"># The one thing exec form cannot do: expand variables</span>
docker run --rm -e NAME=cuong alpine sh -c 'echo hi \$NAME'   <span class="tok-comment"># works</span>
docker build -q -t noexp - &lt;&lt;'EOF' &gt;/dev/null
FROM alpine
ENV NAME=cuong
CMD ["echo", "hi \$NAME"]
EOF
docker run --rm noexp</code></pre>
<div class="out">hi cuong
hi \$NAME</div>
<p>Exec form does not invoke a shell, so there is nothing to expand <code>\$NAME</code>. When you genuinely need shell features — a variable, a pipe, a conditional — be explicit about it: <code>CMD ["sh", "-c", "exec node server.js --port \$PORT"]</code>. Note the <code>exec</code>: it replaces the shell with your process, so you get variable expansion <em>and</em> correct signal handling.</p>

<h3>Proof: single quotes quietly turn exec form into shell form</h3>
${slide('dk-04', 17, 'Nháy đơn không phải JSON ⇒ lặng lẽ thành dạng shell')}
<pre><code class="language-bash">printf "FROM alpine\\nCMD ['echo', 'hi']\\n" | docker build -t sq -
docker run --rm sq; echo "exit=\$?"
docker image inspect sq --format '{{json .Config.Cmd}}'</code></pre>
<div class="out">#1 WARN: JSONArgsRecommended: JSON arguments recommended for CMD to prevent unintended behavior related to OS signals (line 2)
/bin/sh: [echo,: not found
exit=127
["/bin/sh","-c","['echo', 'hi']"]</div>
<p>Real output on the course's Mac. Read the three lines together: the builder warns (in yellow, once), the container runs <code>/bin/sh -c "['echo', 'hi']"</code>, the shell looks for a program literally called <code>[echo,</code>, and exit code 127 means "command not found" (Lesson 1.3). <code>docker image inspect … {{json .Config.Cmd}}</code> is the ten-second check that settles any doubt: an exec-form image shows <code>["echo","hi"]</code>.</p>

<h3>The entrypoint script pattern</h3>
${slide('dk-04', 18, 'Entrypoint: chuẩn bị xong, exec "$@" — app thành PID 1')}
<pre><code>cat &gt; entrypoint.sh &lt;&lt;'EOF'
#!/bin/sh
set -e

<span class="tok-comment"># 1. Wait for dependencies (Chapter 9 does this better with healthchecks)</span>
if [ -n "&#36;{DB_HOST:-}" ]; then   <span class="tok-comment"># only if we were told where the database is</span>
  until nc -z "&#36;DB_HOST" "&#36;{DB_PORT:-5432}"; do
    echo "waiting for database…" &gt;&amp;2
    sleep 1
  done
fi

<span class="tok-comment"># 2. One-time setup — migrations, permissions, generated config</span>
if [ "&#36;{RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "running migrations…" &gt;&amp;2
  npx prisma migrate deploy
fi

<span class="tok-comment"># 3. Hand over to whatever CMD says, AS PID 1</span>
exec "\$@"
EOF
chmod +x entrypoint.sh</code></pre>
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine
RUN apk add --no-cache netcat-openbsd
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
COPY --chmod=755 entrypoint.sh /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["node", "src/server.js"]</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">exec "\$@" is the whole pattern</span><span class="lz-t">it replaces the shell with CMD</span><span class="lz-d">Without <code>exec</code>, the shell stays as PID 1 with your app as a child — and you are back to ten-second stops and unreaped zombies. With it, your app <em>is</em> PID 1 and the script has vanished.</span></div>
  <div class="lz-step"><span class="lz-k">"\$@" keeps CMD overridable</span><span class="lz-t">docker run img node --version</span><span class="lz-d">The setup still runs, then whatever the user asked for. Hard-coding <code>exec node src/server.js</code> instead would break every debugging and one-off use of the image.</span></div>
  <div class="lz-step"><span class="lz-k">Quote it</span><span class="lz-t">"\$@" not \$@</span><span class="lz-d">Unquoted, an argument containing a space is split into two. This is the same bug shell scripts have everywhere, and it shows up as a mysterious "unknown option" from your own program.</span></div>
  <div class="lz-step"><span class="lz-k">set -e at the top</span><span class="lz-t">so a failed migration stops the container</span><span class="lz-d">Without it the script carries on and starts an application against a half-migrated database — much worse than not starting at all.</span></div>
  <div class="lz-step"><span class="lz-k">Log to stderr</span><span class="lz-t">echo "…" &gt;&amp;2</span><span class="lz-d">Keeps the setup chatter out of your application's stdout, which matters when something downstream is parsing it (Lesson 2.2).</span></div>
</div>
<pre><code><span class="tok-comment"># Prove exec did its job</span>
docker build -q -t ep . &gt;/dev/null
docker run -d --name ep -e RUN_MIGRATIONS=false ep sleep 600 &gt;/dev/null
docker exec ep ps -o pid,args | head -3</code></pre>
<div class="out">PID   COMMAND
    1 sleep 600
    7 ps -o pid,args</div>
<p>PID 1 is <code>sleep</code>, not the script and not a shell. The entrypoint ran, did its work, and replaced itself — which is exactly what you want, and what a missing <code>exec</code> silently costs you.</p>

<p class="note-ct">Re-run on the course's Mac. An earlier version of this script waited on <code>&#36;{DB_HOST:-db}</code> unconditionally, and the proof above passed <code>-e DB_HOST=127.0.0.1</code>: with nothing listening on port 5432 inside the container, the loop never ended — measured, PID 1 stayed <code>/bin/sh /usr/local/bin/entrypoint.sh sleep 600</code> printing <code>waiting for database…</code> every second, and the printed <code>1 sleep 600</code> could not have happened. The script now waits only when <code>DB_HOST</code> is set.</p>

<h3>Run it step by step: watch the entrypoint wait, hand over, and fail</h3>
<pre><code class="language-bash"><span class="tok-comment"># 1. Waiting for a port that opens three seconds later (a throwaway nginx stands in for the database)</span>
docker run --rm -e RUN_MIGRATIONS=false -e DB_HOST=host.docker.internal -e DB_PORT=18049 ep echo "past the wait" &amp;
sleep 3; docker run -d --name fakedb -p 18049:80 nginx:1.27-alpine; wait

<span class="tok-comment"># 2. The default CMD, and who is PID 1</span>
docker run -d --name ep2 -e RUN_MIGRATIONS=false -p 3000:3000 ep
docker exec ep2 ps -o pid,args | head -3

<span class="tok-comment"># 3. CMD is still replaceable</span>
docker run --rm -e RUN_MIGRATIONS=false ep node --version</code></pre>
<div class="out">waiting for database…
waiting for database…
waiting for database…
Connection to host.docker.internal (192.168.65.254) 18049 port [tcp/*] succeeded!
past the wait
PID   COMMAND
    1 node src/server.js
   13 ps -o pid,args
v22.23.2</div>
<p>And the same image built with the last line of the script written as <code>"\$@"</code> instead of <code>exec "\$@"</code>:</p>
<div class="out">PID   COMMAND
    1 {entrypoint.sh} /bin/sh /usr/local/bin/entrypoint.sh node src/server.js
    7 node src/server.js
   14 ps -o pid,args</div>
<p>Without <code>exec</code>, the shell stays as PID 1 and node is its child — SIGTERM from <code>docker stop</code> goes to the shell, which does not pass it on. One word is the difference.</p>
<div class="callout warn"><strong>The Windows trap: CRLF line endings.</strong> A script saved with Windows line endings has an invisible <code>\\r</code> after <code>#!/bin/sh</code>, so the kernel looks for an interpreter called <code>/bin/sh\\r</code>. Reproduced on the course's Mac by writing the script with <code>\\r\\n</code>:
<div class="out">exec /usr/local/bin/entrypoint.sh: no such file or directory</div>
The file clearly exists, which is what makes this so confusing (the exit code was 255). Check with <code>file entrypoint.sh</code> ("with CRLF line terminators"), fix with your editor's LF setting or <code>dos2unix</code>, and add <code>*.sh text eol=lf</code> to <code>.gitattributes</code> so Git on a Windows teammate's machine stops converting it.</div>
<table>
<tr><th>Piece of the script</th><th>Why it is there</th></tr>
<tr><td><code>#!/bin/sh</code></td><td>Alpine has no bash; <code>sh</code> exists in every image that has a shell at all.</td></tr>
<tr><td><code>set -e</code></td><td>A failed migration stops the container instead of starting the app on a half-migrated database.</td></tr>
<tr><td><code>&#36;{DB_PORT:-5432}</code></td><td>Shell default: use <code>DB_PORT</code> if set, otherwise 5432.</td></tr>
<tr><td><code>nc -z host port</code></td><td>Only tries to open a TCP connection ("zero-I/O mode"). Needs <code>netcat-openbsd</code> on Alpine, hence the <code>apk add</code>.</td></tr>
<tr><td><code>&gt;&amp;2</code></td><td>Send the message to stderr so stdout stays the app's.</td></tr>
<tr><td><code>exec "\$@"</code></td><td>Replace this shell with the CMD, keeping every argument intact.</td></tr>
</table>

<h3>The npm problem</h3>
<pre><code><span class="tok-comment"># Extremely common, and wrong for two separate reasons</span>
CMD ["npm", "start"]

<span class="tok-comment"># Right</span>
CMD ["node", "src/server.js"]</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">npm used to swallow signals — check yours</span><span class="v">npm runs your script as a child process. Older npm versions did not pass SIGTERM through, which gave the ten-second stop even with an exec-form <code>CMD</code>. Measured on npm 10.9 in <code>node:22-alpine</code> (Linux, Docker 29.6): it now forwards SIGTERM — the server logged <code>got SIGTERM, closing</code> and the container stopped in 0.18 s with exit 0. An earlier version of this lesson presented the old behaviour as current; yarn, pnpm and older base images still deserve a measurement before you trust them.</span></div>
  <div class="kv"><span class="k">npm adds a process and its memory</span><span class="v">Measured: <code>npm start</code> as PID 1 held 68MB of resident memory on top of the 50MB of <code>node server.js</code> itself (<code>docker exec c ps -o pid,rss,args</code>) — an earlier version said ~40MB. For no benefit at run time. In production the package manager has nothing left to do.</span></div>
  <div class="kv"><span class="k">It hides the real command</span><span class="v"><code>docker ps</code> shows <code>npm start</code>, and finding out what actually runs means reading <code>package.json</code> inside the image.</span></div>
  <div class="kv"><span class="k">The same applies to yarn, pnpm, and to python -m</span><span class="v">Any wrapper that forks rather than execs. If you must use one, check that it forwards signals, or add <code>--init</code> (Lesson 1.3).</span></div>
</div>
<pre><code>docker rm -f sf ef ep &gt;/dev/null 2&gt;&amp;1
docker rmi sf ef ep noexp tt &gt;/dev/null 2&gt;&amp;1; rm -f entrypoint.sh</code></pre>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> every deploy of your team's API hangs for ten seconds on "Stopping…", and the Dockerfile's last line is <code>CMD npm run migrate &amp;&amp; node dist/index.js</code> on <code>node:22-slim</code>. Prove the cause, then fix it the way official images do.</p><ol>
<li>In <code>~/thu-docker/stop</code>, write a <code>server.js</code> that listens on 3000 and closes on SIGTERM (the three lines in Lesson 1.3), and a Dockerfile <code>FROM node:22-slim</code> with <code>CMD echo "starting…" &amp;&amp; node server.js</code>.</li>
<li>Build, run, and time <code>docker stop</code> (on a Mac the wait is ~3 s rather than 10 s, but the exit code tells the story). Look at the exit code with <code>docker inspect -f '{{.State.ExitCode}}'</code>.</li>
<li>Move the setup into an <code>entrypoint.sh</code> that ends in <code>exec "\$@"</code>, set <code>ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]</code> and <code>CMD ["node", "server.js"]</code>, rebuild.</li>
<li>Verify with <code>docker exec … cat /proc/1/cmdline | tr '\\0' ' '</code> (slim has no <code>ps</code>) that PID 1 is <code>node</code>, stop it again, and override the CMD once with <code>docker run --rm img node --version</code>.</li>
<li>Clean up the containers and the image.</li></ol>
<p><strong>Done when:</strong> the first version stops with exit 137 and the second with exit 0 in well under a second; <code>/proc/1/cmdline</code> reads <code>node server.js</code>; and <code>docker run --rm img node --version</code> prints a version, proving the entrypoint still honours CMD.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ENTRYPOINT</span><span class="v">The fixed program of an image; run-time arguments are appended to it.</span></div>
  <div class="kv"><span class="k">CMD</span><span class="v">The default arguments (or default command); replaced by anything typed after the image name.</span></div>
  <div class="kv"><span class="k">Exec form</span><span class="v">A JSON array with double quotes, <code>["node","server.js"]</code>: no shell, your program is PID 1.</span></div>
  <div class="kv"><span class="k">Shell form</span><span class="v">A plain string, run as <code>/bin/sh -c "…"</code>; whether the shell stays PID 1 depends on the shell.</span></div>
  <div class="kv"><span class="k">exec "$@"</span><span class="v">The last line of an entrypoint script: replace the shell with the CMD, keeping arguments intact.</span></div>
  <div class="kv"><span class="k">PID 1</span><span class="v">The first process of the container; it receives <code>docker stop</code>'s signal.</span></div>
  <div class="kv"><span class="k">CRLF</span><span class="v">Windows line endings; in a script's first line they make "no such file or directory".</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The command that runs is ENTRYPOINT + CMD; arguments after the image name replace CMD only.</li>
<li><code>--entrypoint</code> replaces ENTRYPOINT and clears CMD; a new ENTRYPOINT in a Dockerfile resets the inherited CMD.</li>
<li>Shell form is PID-1-safe only by accident (busybox yes, Debian dash no) — always use exec form.</li>
<li>Single quotes are not JSON: the line silently becomes shell form; read the <code>JSONArgsRecommended</code> warning.</li>
<li>Entrypoint scripts do setup, then <code>exec "\$@"</code>; without <code>exec</code> the shell keeps PID 1.</li>
<li>Save <code>.sh</code> files with LF endings, or the container fails with a baffling "no such file or directory".</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/dockerfile/#understand-how-cmd-and-entrypoint-interact" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">How CMD and ENTRYPOINT interact</span><span class="lc-sub">The official six-row truth table. Read it once carefully and this stops being confusing forever.</span></span>
</a>
<a class="link-card" href="https://github.com/docker-library/postgres/blob/master/docker-entrypoint.sh" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">The postgres image's entrypoint script</span><span class="lc-sub">A production-grade example of everything in this lesson: the <code>_FILE</code> secret convention, first-run initialisation, and <code>exec "\$@"</code> at the end. Worth reading in full.</span></span>
</a>
<a class="link-card" href="https://github.com/Yelp/dumb-init" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">dumb-init</span><span class="lc-sub">A minimal init for when your process genuinely spawns children. Its README explains signal forwarding and process groups more clearly than most operating-systems textbooks.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: make it start and stop cleanly</span><span class="lc-sub">Graded exercises: predict the output of six ENTRYPOINT/CMD combinations, fix an image that takes ten seconds to stop, write an entrypoint that keeps <code>CMD</code> overridable, and explain why a variable did not expand.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> writing the JSON array with single quotes — <code>CMD ['node', 'server.js']</code>. That is not valid JSON, so Docker falls back to treating the entire line as <em>shell form</em> and runs <code>/bin/sh -c "['node', 'server.js']"</code>, which fails with something baffling like <code>[node,: not found</code>. An earlier version of this lesson said there is no warning at build time; current BuildKit does print one — <code>WARN: JSONArgsRecommended</code> — but it is one yellow line among many and easy to miss. Double quotes, always — and if you want to be sure, check afterwards with <code>docker image inspect img --format '{{.Config.Cmd}}'</code>: exec form shows the array intact, shell form shows <code>[/bin/sh -c …]</code>.</div>
<p class="note-ct"><strong>Three things to remember.</strong> ENTRYPOINT is the program and CMD is its default arguments; command-line arguments replace CMD and are appended to ENTRYPOINT. Always use exec form (a JSON array with double quotes) so your process is PID 1 and stops in milliseconds rather than ten seconds. And an entrypoint script must end in <code>exec "\$@"</code> — that one line is what makes the setup work disappear and hands PID 1 to your application.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>CMD, ENTRYPOINT và script entrypoint</h2>
<p class="lead">Hai chỉ thị này quyết định thứ THẬT SỰ chạy, và quan hệ giữa chúng là thứ bị hiểu sai nhiều nhất trong một Dockerfile. Cái luật gói trong một câu: <strong>ENTRYPOINT là CHƯƠNG TRÌNH, CMD là THAM SỐ MẶC ĐỊNH của nó, và câu lệnh cuối cùng là hai thứ đó nối lại.</strong> Mọi thứ khác đều suy ra từ đó.</p>

<h3>Bảng chân trị</h3>
${slide('dk-04', 14, 'Lệnh cuối = ENTRYPOINT + CMD — tham số gõ thêm thay CMD')}
<pre><code>demo() { docker build -q -t tt - &gt;/dev/null; docker run --rm tt \$@; }

<span class="tok-comment"># 1. Chỉ CMD, dạng exec</span>
printf 'FROM alpine\\nCMD ["echo","hello"]\\n' | demo
<span class="tok-comment"># 2. Chỉ CMD, bị ghi đè lúc chạy</span>
printf 'FROM alpine\\nCMD ["echo","hello"]\\n' | demo echo goodbye
<span class="tok-comment"># 3. ENTRYPOINT + CMD</span>
printf 'FROM alpine\\nENTRYPOINT ["echo"]\\nCMD ["hello"]\\n' | demo
<span class="tok-comment"># 4. ENTRYPOINT + CMD, tham số bị thay</span>
printf 'FROM alpine\\nENTRYPOINT ["echo"]\\nCMD ["hello"]\\n' | demo goodbye</code></pre>
<div class="out">hello
goodbye
hello
goodbye</div>
<div class="lz-map">
  <div class="lz-stage">Chỉ CMD</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một mặc định thay thế được hoàn toàn</span><span class="lz-nsub"><code>CMD ["node","server.js"]</code> → chạy cái đó. <code>docker run img sh</code> → chạy một cái shell thay vào. Đúng cho một ảnh đa dụng mà người dùng có thể muốn một thứ hoàn toàn khác.</span></div></div>
  <div class="lz-stage">Chỉ ENTRYPOINT</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một chương trình cố định, tham số lấy từ dòng lệnh</span><span class="lz-nsub"><code>ENTRYPOINT ["jq"]</code> → <code>docker run img -S .</code> chạy <code>jq -S .</code>. Cái ảnh hành xử như MỘT câu lệnh. Đúng cho một công cụ dòng lệnh.</span></div></div>
  <div class="lz-stage">ENTRYPOINT + CMD</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một chương trình kèm mặc định hợp lý</span><span class="lz-nsub">Tổ hợp hữu ích nhất và là thứ ảnh chính thức dùng: <code>ENTRYPOINT ["docker-entrypoint.sh"]</code> cộng <code>CMD ["postgres"]</code>. Người dùng chỉ ghi đè phần tham số.</span></div></div>
  <div class="lz-stage">Không cái nào</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Không có gì để chạy</span><span class="lz-nsub">Ảnh không dùng được nếu không kèm câu lệnh trên dòng lệnh. Hợp lệ, và gần như không bao giờ là thứ bạn muốn.</span></div></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Tham số đứng sau tên ảnh</span><span class="v">THAY THẾ hoàn toàn <code>CMD</code> và được NỐI vào sau <code>ENTRYPOINT</code>. Chúng KHÔNG BAO GIỜ thay được <code>ENTRYPOINT</code>.</span></div>
  <div class="kv"><span class="k">--entrypoint trên dòng lệnh</span><span class="v">Thay thế <code>ENTRYPOINT</code> và <strong>XOÁ TRẮNG <code>CMD</code></strong>. Nên <code>docker run --entrypoint sh img -c 'echo hi'</code> cần ghi rõ cái <code>-c 'echo hi'</code> — nó trở thành CMD mới.</span></div>
  <div class="kv"><span class="k">ENTRYPOINT ở dạng shell</span><span class="v">Đầu độc cả tổ hợp: <code>ENTRYPOINT node server.js</code> thành <code>/bin/sh -c "node server.js"</code> và <strong>CMD bị bỏ qua hoàn toàn</strong>. Nếu CMD của bạn có vẻ chẳng có tác dụng gì thì đây là lý do.</span></div>
  <div class="kv"><span class="k">Cái đứng SAU thắng</span><span class="v">Chỉ cái CUỐI CÙNG của mỗi loại trong một Dockerfile có hiệu lực. Và <code>ENTRYPOINT</code> trong ảnh nền vẫn tồn tại trong ảnh của bạn trừ khi bạn đặt lại nó bằng <code>ENTRYPOINT []</code>.</span></div>
</div>

<h3>Bảng đầy đủ: lệnh nào THẬT SỰ chạy</h3>
${slide('dk-04', 15, 'Bảng CMD × ENTRYPOINT: lệnh nào thật sự chạy')}
<p>Tài liệu Dockerfile có một bảng cho mọi tổ hợp. Đọc mỗi ô là "dòng lệnh mà PID 1 được khởi chạy với":</p>
<table>
<tr><th></th><th>Không có ENTRYPOINT</th><th><code>ENTRYPOINT exec_entry p1_entry</code> (dạng shell)</th><th><code>ENTRYPOINT ["exec_entry", "p1_entry"]</code> (dạng exec)</th></tr>
<tr><td><strong>Không có CMD</strong></td><td>lỗi: <code>no command specified</code></td><td><code>/bin/sh -c exec_entry p1_entry</code></td><td><code>exec_entry p1_entry</code></td></tr>
<tr><td><strong><code>CMD ["exec_cmd", "p1_cmd"]</code></strong></td><td><code>exec_cmd p1_cmd</code></td><td><code>/bin/sh -c exec_entry p1_entry</code> — CMD bị BỎ</td><td><code>exec_entry p1_entry exec_cmd p1_cmd</code></td></tr>
<tr><td><strong><code>CMD exec_cmd p1_cmd</code></strong></td><td><code>/bin/sh -c exec_cmd p1_cmd</code></td><td><code>/bin/sh -c exec_entry p1_entry</code> — CMD bị BỎ</td><td><code>exec_entry p1_entry /bin/sh -c exec_cmd p1_cmd</code></td></tr>
</table>
<p>Ba ô của bảng đó, kiểm thật trên máy Mac của khoá:</p>
<pre><code class="language-bash"><span class="tok-comment"># ENTRYPOINT dạng shell: CMD lẫn tham số "goodbye" đều bị bỏ</span>
printf 'FROM alpine\\nENTRYPOINT echo from-entrypoint\\nCMD ["hello"]\\n' | demo goodbye
<span class="tok-comment"># Không có ENTRYPOINT lẫn CMD (ảnh FROM scratch chỉ chứa chương trình busybox)</span>
printf 'FROM scratch\\nCOPY --from=alpine /bin/busybox /busybox\\n' | docker build -q -t tt - &gt;/dev/null
docker run --rm tt
<span class="tok-comment"># Khai ENTRYPOINT trong Dockerfile của bạn là XOÁ CMD thừa hưởng từ ảnh nền</span>
printf 'FROM node:22-alpine\\nENTRYPOINT ["echo","E:"]\\n' | docker build -q -t rs - &gt;/dev/null
docker image inspect rs --format 'E={{json .Config.Entrypoint}} C={{json .Config.Cmd}}'</code></pre>
<div class="out">from-entrypoint
docker: Error response from daemon: no command specified
E=["echo","E:"] C=null</div>
<p>Dòng cuối là cái bẫy đáng nhớ: bản thân <code>node:22-alpine</code> có <code>CMD ["node"]</code>, nhưng ngay khi Dockerfile của bạn khai <code>ENTRYPOINT</code> của riêng nó thì <code>CMD</code> thừa hưởng bị đặt về rỗng. Ảnh của bạn cần tham số mặc định thì hãy viết lại <code>CMD</code> sau <code>ENTRYPOINT</code>.</p>
<table>
<tr><th>Lúc chạy bạn gõ…</th><th>Kết quả</th></tr>
<tr><td><code>docker run img</code></td><td>ENTRYPOINT + CMD, như ghi trong ảnh</td></tr>
<tr><td><code>docker run img a b</code></td><td>ENTRYPOINT + <code>a b</code> (CMD bị thay)</td></tr>
<tr><td><code>docker run --entrypoint sh img</code></td><td>chỉ <code>sh</code> — CMD cũng bị xoá, nên đây là cách vào shell của một ảnh mà ENTRYPOINT là một chương trình</td></tr>
<tr><td><code>docker run -it --entrypoint sh img -c 'ls /app'</code></td><td><code>sh -c 'ls /app'</code> — tham số thành CMD mới</td></tr>
</table>

<h3>Dạng shell so với dạng exec, một lần nữa</h3>
${slide('dk-04', 16, 'Dạng shell: Alpine tự exec giùm — Debian thì KHÔNG')}
<pre><code>docker build -q -t sf - &lt;&lt;'EOF' &gt;/dev/null
FROM alpine
CMD sleep 600
EOF
docker build -q -t ef - &lt;&lt;'EOF' &gt;/dev/null
FROM alpine
CMD ["sleep", "600"]
EOF
docker run -d --name sf sf &gt;/dev/null; docker run -d --name ef ef &gt;/dev/null
docker exec sf ps -o pid,args | head -2; docker exec ef ps -o pid,args | head -2
time docker stop sf &gt;/dev/null; time docker stop ef &gt;/dev/null</code></pre>
<div class="out">PID   COMMAND
    1 sleep 600
PID   COMMAND
    1 sleep 600
real	0m10.19s
real	0m10.17s</div>
<p class="note-ct">Output thật, đo lại trên máy Linux của khoá (Docker 29.6; Docker Desktop trên Mac dừng container sau khoảng 3 s, nên mọi con số thời gian dừng trong khoá lấy từ Linux). Bản cũ của bài in <code>1 /bin/sh -c sleep 600</code> cho ảnh dạng shell và cú dừng 0,27 s cho ảnh dạng exec. Cả hai đều KHÔNG đúng trên Alpine: <code>sh -c</code> của busybox TỰ THAY MÌNH bằng lệnh duy nhất (Bài 1.3), nên cả hai container đều có <code>sleep</code> làm PID 1 — mà <code>sleep</code> không cài hàm xử lý SIGTERM, nên cả hai đều chờ trọn mười giây rồi chết với mã 137. Cặp ảnh này đơn giản là KHÔNG thể cho thấy khác biệt. Khối kế tiếp dùng một máy chủ thật có bắt SIGTERM.</p>
<div class="callout warn"><strong>Dạng shell có gây hại hay không tuỳ vào shell của ảnh nền — và chính vì thế đừng bao giờ dựa vào nó.</strong> Một máy chủ Node nhỏ có bắt SIGTERM, sáu dòng <code>CMD</code> khác nhau, mỗi cái dừng bằng <code>docker stop</code> trên máy Linux:</div>
<table>
<tr><th>Dòng CMD</th><th>Ảnh nền</th><th>PID 1</th><th>docker stop</th></tr>
<tr><td><code>CMD ["node", "server.js"]</code></td><td><code>node:22-alpine</code></td><td><code>node server.js</code></td><td>0,15 s, exit 0</td></tr>
<tr><td><code>CMD node server.js</code></td><td><code>node:22-alpine</code> (sh của busybox)</td><td><code>node server.js</code> — busybox đã exec giùm</td><td>0,12 s, exit 0</td></tr>
<tr><td><code>CMD echo "starting…" &amp;&amp; node server.js</code></td><td><code>node:22-alpine</code></td><td><code>node server.js</code> — busybox exec cả lệnh cuối của chuỗi <code>&amp;&amp;</code></td><td>0,20 s, exit 0</td></tr>
<tr><td><code>CMD node server.js; echo "server exited"</code></td><td><code>node:22-alpine</code></td><td><code>/bin/sh -c …</code>, node là PID 8</td><td>10,18 s, exit 137</td></tr>
<tr><td><code>CMD node server.js</code></td><td><code>node:22-slim</code> (dash của Debian)</td><td><code>/bin/sh -c node server.js</code>, node là PID 8</td><td>10,19 s, exit 137</td></tr>
<tr><td><code>CMD echo "starting…" &amp;&amp; node server.js</code></td><td><code>node:22-slim</code></td><td><code>/bin/sh -c …</code></td><td>10,19 s, exit 137</td></tr>
</table>
<div class="out"># node:22-slim, CMD node server.js — đọc từ /proc vì bản slim không có ps
1 /bin/sh -c node server.js
8 node server.js</div>
<p>Vậy là cùng MỘT dòng <code>CMD</code> dừng trong một phần mười giây trên Alpine và mười giây trên Debian, còn thêm một <code>; echo</code> trông vô hại là làm hỏng luôn cả Alpine. Ở dạng shell, tiến trình của bạn có là PID 1 hay không là chuyện TÌNH CỜ, tuỳ ảnh nền đem theo shell nào. <strong>Hãy LUÔN viết <code>CMD</code> ở dạng exec</strong> — một mảng JSON, với dấu nháy KÉP, bởi vì nháy đơn không phải JSON hợp lệ và Docker sẽ coi cả dòng là dạng shell.</p>
<pre><code><span class="tok-comment"># Điều duy nhất dạng exec KHÔNG làm được: khai triển biến</span>
docker run --rm -e NAME=cuong alpine sh -c 'echo hi \$NAME'   <span class="tok-comment"># chạy được</span>
docker build -q -t noexp - &lt;&lt;'EOF' &gt;/dev/null
FROM alpine
ENV NAME=cuong
CMD ["echo", "hi \$NAME"]
EOF
docker run --rm noexp</code></pre>
<div class="out">hi cuong
hi \$NAME</div>
<p>Dạng exec KHÔNG gọi shell nào, nên chẳng có gì để khai triển <code>\$NAME</code>. Khi bạn thật sự cần tính năng của shell — một biến, một ống dẫn, một điều kiện — hãy nói thẳng ra: <code>CMD ["sh", "-c", "exec node server.js --port \$PORT"]</code>. Chú ý chữ <code>exec</code>: nó THAY THẾ cái shell bằng tiến trình của bạn, nên bạn được cả khai triển biến <em>LẪN</em> xử lý tín hiệu đúng đắn.</p>

<h3>Chứng minh: nháy đơn lặng lẽ biến dạng exec thành dạng shell</h3>
${slide('dk-04', 17, 'Nháy đơn không phải JSON ⇒ lặng lẽ thành dạng shell')}
<pre><code class="language-bash">printf "FROM alpine\\nCMD ['echo', 'hi']\\n" | docker build -t sq -
docker run --rm sq; echo "exit=\$?"
docker image inspect sq --format '{{json .Config.Cmd}}'</code></pre>
<div class="out">#1 WARN: JSONArgsRecommended: JSON arguments recommended for CMD to prevent unintended behavior related to OS signals (line 2)
/bin/sh: [echo,: not found
exit=127
["/bin/sh","-c","['echo', 'hi']"]</div>
<p>Output thật trên máy Mac của khoá. Đọc ba dòng cùng nhau: bộ dựng cảnh báo (màu vàng, một lần), container chạy <code>/bin/sh -c "['echo', 'hi']"</code>, shell đi tìm một chương trình có tên đúng là <code>[echo,</code>, và mã thoát 127 nghĩa là "không tìm thấy lệnh" (Bài 1.3). <code>docker image inspect … {{json .Config.Cmd}}</code> là phép kiểm mười giây dập tắt mọi nghi ngờ: ảnh dạng exec hiện ra <code>["echo","hi"]</code>.</p>

<h3>Mẫu script entrypoint</h3>
${slide('dk-04', 18, 'Entrypoint: chuẩn bị xong, exec "$@" — app thành PID 1')}
<pre><code>cat &gt; entrypoint.sh &lt;&lt;'EOF'
#!/bin/sh
set -e

<span class="tok-comment"># 1. Chờ những thứ phụ thuộc (Chương 9 làm việc này tốt hơn bằng healthcheck)</span>
if [ -n "&#36;{DB_HOST:-}" ]; then   <span class="tok-comment"># chỉ khi được chỉ chỗ CSDL</span>
  until nc -z "&#36;DB_HOST" "&#36;{DB_PORT:-5432}"; do
    echo "đang chờ cơ sở dữ liệu…" &gt;&amp;2
    sleep 1
  done
fi

<span class="tok-comment"># 2. Thiết lập một lần — migration, quyền, cấu hình được sinh ra</span>
if [ "&#36;{RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "đang chạy migration…" &gt;&amp;2
  npx prisma migrate deploy
fi

<span class="tok-comment"># 3. Bàn giao cho bất cứ thứ gì CMD nói, VỚI TƯ CÁCH PID 1</span>
exec "\$@"
EOF
chmod +x entrypoint.sh</code></pre>
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine
RUN apk add --no-cache netcat-openbsd
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
COPY --chmod=755 entrypoint.sh /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["node", "src/server.js"]</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">exec "\$@" chính là toàn bộ cái mẫu</span><span class="lz-t">nó thay thế cái shell bằng CMD</span><span class="lz-d">Không có <code>exec</code> thì cái shell nằm lại làm PID 1 với ứng dụng của bạn là con — và bạn quay lại với những cú dừng mười giây cùng đám tiến trình xác không được thu dọn. Có nó thì ứng dụng của bạn CHÍNH LÀ PID 1 còn cái script đã biến mất.</span></div>
  <div class="lz-step"><span class="lz-k">"\$@" giữ cho CMD vẫn ghi đè được</span><span class="lz-t">docker run img node --version</span><span class="lz-d">Phần thiết lập vẫn chạy, rồi tới bất cứ thứ gì người dùng yêu cầu. Viết cứng <code>exec node src/server.js</code> thay vào đó sẽ phá hỏng mọi cách dùng ảnh để gỡ lỗi hay chạy một lần.</span></div>
  <div class="lz-step"><span class="lz-k">Hãy bọc nháy nó</span><span class="lz-t">"\$@" chứ không phải \$@</span><span class="lz-d">Không bọc nháy thì một tham số chứa dấu cách bị chẻ thành hai. Đây vẫn là con bọ mà script shell ở đâu cũng có, và nó hiện ra dưới dạng một câu "unknown option" bí hiểm từ chính chương trình của bạn.</span></div>
  <div class="lz-step"><span class="lz-k">set -e ở đầu</span><span class="lz-t">để một migration hỏng thì dừng luôn container</span><span class="lz-d">Không có nó thì script chạy tiếp và khởi động ứng dụng lên một cơ sở dữ liệu migration dở dang — tệ hơn hẳn việc không khởi động gì cả.</span></div>
  <div class="lz-step"><span class="lz-k">Ghi log ra stderr</span><span class="lz-t">echo "…" &gt;&amp;2</span><span class="lz-d">Giữ cho những dòng lải nhải lúc thiết lập nằm ngoài stdout của ứng dụng, và điều đó quan trọng khi có thứ gì đó phía sau đang phân tích nó (Bài 2.2).</span></div>
</div>
<pre><code><span class="tok-comment"># Chứng minh exec đã làm đúng việc của nó</span>
docker build -q -t ep . &gt;/dev/null
docker run -d --name ep -e RUN_MIGRATIONS=false ep sleep 600 &gt;/dev/null
docker exec ep ps -o pid,args | head -3</code></pre>
<div class="out">PID   COMMAND
    1 sleep 600
    7 ps -o pid,args</div>
<p>PID 1 là <code>sleep</code>, không phải cái script và cũng không phải một cái shell. Entrypoint đã chạy, làm xong việc của nó, rồi TỰ THAY THẾ MÌNH — và đó chính xác là thứ bạn muốn, và là thứ mà một chữ <code>exec</code> bị quên sẽ âm thầm lấy đi.</p>

<p class="note-ct">Chạy lại trên máy Mac của khoá. Bản cũ của script này chờ <code>&#36;{DB_HOST:-db}</code> VÔ ĐIỀU KIỆN, còn phép chứng minh ở trên truyền <code>-e DB_HOST=127.0.0.1</code>: trong container không có gì nghe ở cổng 5432, nên vòng lặp không bao giờ dừng — đo thật, PID 1 vẫn là <code>/bin/sh /usr/local/bin/entrypoint.sh sleep 600</code> và cứ mỗi giây in <code>waiting for database…</code>, nên dòng <code>1 sleep 600</code> được in ra ở bản cũ là không thể xảy ra. Script giờ chỉ chờ khi <code>DB_HOST</code> được đặt.</p>

<h3>Chạy thử từng bước: nhìn entrypoint chờ, trao quyền, và hỏng</h3>
<pre><code class="language-bash"><span class="tok-comment"># 1. Chờ một cổng mở ra ba giây sau (một nginx dùng-một-lần đóng vai CSDL)</span>
docker run --rm -e RUN_MIGRATIONS=false -e DB_HOST=host.docker.internal -e DB_PORT=18049 ep echo "past the wait" &amp;
sleep 3; docker run -d --name fakedb -p 18049:80 nginx:1.27-alpine; wait

<span class="tok-comment"># 2. CMD mặc định, và ai là PID 1</span>
docker run -d --name ep2 -e RUN_MIGRATIONS=false -p 3000:3000 ep
docker exec ep2 ps -o pid,args | head -3

<span class="tok-comment"># 3. CMD vẫn thay được</span>
docker run --rm -e RUN_MIGRATIONS=false ep node --version</code></pre>
<div class="out">waiting for database…
waiting for database…
waiting for database…
Connection to host.docker.internal (192.168.65.254) 18049 port [tcp/*] succeeded!
past the wait
PID   COMMAND
    1 node src/server.js
   13 ps -o pid,args
v22.23.2</div>
<p>Và cũng cái ảnh đó nhưng dòng cuối script viết là <code>"\$@"</code> thay vì <code>exec "\$@"</code>:</p>
<div class="out">PID   COMMAND
    1 {entrypoint.sh} /bin/sh /usr/local/bin/entrypoint.sh node src/server.js
    7 node src/server.js
   14 ps -o pid,args</div>
<p>Thiếu <code>exec</code>, shell ở lại làm PID 1 còn node là con của nó — SIGTERM của <code>docker stop</code> tới shell, và shell không chuyển tiếp. Một chữ là toàn bộ khác biệt.</p>
<div class="callout warn"><strong>Cái bẫy Windows: ký tự xuống dòng CRLF.</strong> Script lưu kiểu xuống dòng của Windows có một ký tự <code>\\r</code> vô hình sau <code>#!/bin/sh</code>, nên nhân đi tìm trình thông dịch tên là <code>/bin/sh\\r</code>. Tái hiện trên máy Mac của khoá bằng cách ghi script với <code>\\r\\n</code>:
<div class="out">exec /usr/local/bin/entrypoint.sh: no such file or directory</div>
File rõ ràng CÓ tồn tại, và đó là thứ làm lỗi này khó hiểu tới vậy (mã thoát là 255). Kiểm bằng <code>file entrypoint.sh</code> ("with CRLF line terminators"), sửa bằng tuỳ chọn LF của trình soạn thảo hoặc <code>dos2unix</code>, và thêm <code>*.sh text eol=lf</code> vào <code>.gitattributes</code> để Git trên máy Windows của bạn cùng nhóm thôi tự đổi nó.</div>
<table>
<tr><th>Mảnh của script</th><th>Vì sao có nó</th></tr>
<tr><td><code>#!/bin/sh</code></td><td>Alpine không có bash; <code>sh</code> có mặt ở mọi ảnh có shell.</td></tr>
<tr><td><code>set -e</code></td><td>Migration hỏng thì container dừng, thay vì khởi động app trên một CSDL migrate dở.</td></tr>
<tr><td><code>&#36;{DB_PORT:-5432}</code></td><td>Giá trị mặc định của shell: dùng <code>DB_PORT</code> nếu có, không thì 5432.</td></tr>
<tr><td><code>nc -z host port</code></td><td>Chỉ thử mở một kết nối TCP ("chế độ không vào/ra"). Trên Alpine cần gói <code>netcat-openbsd</code>, nên mới có <code>apk add</code>.</td></tr>
<tr><td><code>&gt;&amp;2</code></td><td>Đưa thông báo ra stderr để stdout là của riêng app.</td></tr>
<tr><td><code>exec "\$@"</code></td><td>Thay shell này bằng CMD, giữ nguyên từng tham số.</td></tr>
</table>

<h3>Bài toán npm</h3>
<pre><code><span class="tok-comment"># Cực kỳ phổ biến, và sai vì hai lý do riêng biệt</span>
CMD ["npm", "start"]

<span class="tok-comment"># Đúng</span>
CMD ["node", "src/server.js"]</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">npm từng nuốt tín hiệu — hãy kiểm bản của bạn</span><span class="v">npm chạy script của bạn thành một tiến trình con. Các bản npm cũ không chuyển SIGTERM qua, nên dù <code>CMD</code> viết dạng exec vẫn dính cú dừng mười giây. Đo trên npm 10.9 trong <code>node:22-alpine</code> (Linux, Docker 29.6): giờ nó CÓ chuyển SIGTERM — máy chủ in <code>got SIGTERM, closing</code> và container dừng trong 0,18 s với mã thoát 0. Bản cũ của bài trình bày hành vi cũ như thể hiện tại; yarn, pnpm và các ảnh nền cũ vẫn đáng được đo trước khi tin.</span></div>
  <div class="kv"><span class="k">npm thêm một tiến trình và bộ nhớ của nó</span><span class="v">Đo thật: <code>npm start</code> làm PID 1 giữ 68MB bộ nhớ thường trú, chưa kể 50MB của chính <code>node server.js</code> (<code>docker exec c ps -o pid,rss,args</code>) — bản cũ ghi ~40MB. Mà chẳng đem lại lợi ích gì lúc chạy. Trên production thì trình quản lý gói chẳng còn việc gì để làm.</span></div>
  <div class="kv"><span class="k">Nó CHE MẤT câu lệnh thật</span><span class="v"><code>docker ps</code> hiện ra <code>npm start</code>, và muốn biết thứ gì thật sự chạy thì phải đi đọc <code>package.json</code> bên trong ảnh.</span></div>
  <div class="kv"><span class="k">Điều tương tự áp cho yarn, pnpm, và python -m</span><span class="v">Mọi lớp bọc rẽ nhánh thay vì exec. Nếu buộc phải dùng một cái thì hãy kiểm xem nó có chuyển tiếp tín hiệu không, hoặc thêm <code>--init</code> (Bài 1.3).</span></div>
</div>
<pre><code>docker rm -f sf ef ep &gt;/dev/null 2&gt;&amp;1
docker rmi sf ef ep noexp tt &gt;/dev/null 2&gt;&amp;1; rm -f entrypoint.sh</code></pre>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> mỗi lần deploy, API của nhóm treo mười giây ở dòng "Stopping…", và dòng cuối Dockerfile là <code>CMD npm run migrate &amp;&amp; node dist/index.js</code> trên <code>node:22-slim</code>. Hãy chứng minh nguyên nhân, rồi sửa theo cách các ảnh chính thức vẫn làm.</p><ol>
<li>Trong <code>~/thu-docker/stop</code>, viết một <code>server.js</code> nghe cổng 3000 và đóng lại khi nhận SIGTERM (ba dòng ở Bài 1.3), và một Dockerfile <code>FROM node:22-slim</code> với <code>CMD echo "starting…" &amp;&amp; node server.js</code>.</li>
<li>Dựng, chạy, và bấm giờ <code>docker stop</code> (trên Mac chỉ chờ ~3 s thay vì 10 s, nhưng mã thoát kể đủ chuyện). Xem mã thoát bằng <code>docker inspect -f '{{.State.ExitCode}}'</code>.</li>
<li>Chuyển phần chuẩn bị vào một <code>entrypoint.sh</code> kết thúc bằng <code>exec "\$@"</code>, đặt <code>ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]</code> và <code>CMD ["node", "server.js"]</code>, dựng lại.</li>
<li>Kiểm bằng <code>docker exec … cat /proc/1/cmdline | tr '\\0' ' '</code> (bản slim không có <code>ps</code>) rằng PID 1 là <code>node</code>, dừng lại lần nữa, và đổi CMD một lần bằng <code>docker run --rm img node --version</code>.</li>
<li>Dọn các container và cái ảnh.</li></ol>
<p><strong>Đạt khi:</strong> bản đầu dừng với mã 137 còn bản sau dừng với mã 0 trong chưa tới một giây; <code>/proc/1/cmdline</code> đọc ra <code>node server.js</code>; và <code>docker run --rm img node --version</code> in ra một phiên bản, chứng minh entrypoint vẫn tôn trọng CMD.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ENTRYPOINT (điểm vào)</span><span class="v">Chương trình cố định của ảnh; tham số lúc chạy được nối vào sau nó.</span></div>
  <div class="kv"><span class="k">CMD (lệnh mặc định)</span><span class="v">Tham số mặc định (hoặc lệnh mặc định); bị thay bởi bất cứ thứ gì gõ sau tên ảnh.</span></div>
  <div class="kv"><span class="k">Exec form (dạng exec)</span><span class="v">Mảng JSON nháy kép, <code>["node","server.js"]</code>: không có shell, chương trình của bạn là PID 1.</span></div>
  <div class="kv"><span class="k">Shell form (dạng shell)</span><span class="v">Một chuỗi thường, chạy bằng <code>/bin/sh -c "…"</code>; shell có ở lại làm PID 1 hay không tuỳ loại shell.</span></div>
  <div class="kv"><span class="k">exec "$@" (thay mình bằng lệnh)</span><span class="v">Dòng cuối của script entrypoint: thay shell bằng CMD, giữ nguyên các tham số.</span></div>
  <div class="kv"><span class="k">PID 1 (tiến trình số 1)</span><span class="v">Tiến trình đầu tiên của container; nó nhận tín hiệu của <code>docker stop</code>.</span></div>
  <div class="kv"><span class="k">CRLF (xuống dòng kiểu Windows)</span><span class="v">Ký tự xuống dòng của Windows; nằm ở dòng đầu script thì gây lỗi "no such file or directory".</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lệnh thật chạy là ENTRYPOINT + CMD; tham số sau tên ảnh chỉ thay CMD.</li>
<li><code>--entrypoint</code> thay ENTRYPOINT và xoá CMD; khai ENTRYPOINT mới trong Dockerfile là đặt lại CMD thừa hưởng về rỗng.</li>
<li>Dạng shell chỉ an toàn cho PID 1 một cách tình cờ (busybox có, dash của Debian không) — luôn dùng dạng exec.</li>
<li>Nháy đơn không phải JSON: dòng đó lặng lẽ thành dạng shell; hãy đọc cảnh báo <code>JSONArgsRecommended</code>.</li>
<li>Script entrypoint làm phần chuẩn bị rồi <code>exec "\$@"</code>; thiếu <code>exec</code> thì shell giữ PID 1.</li>
<li>Lưu file <code>.sh</code> với xuống dòng LF, không thì container hỏng với câu "no such file or directory" khó hiểu.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/dockerfile/#understand-how-cmd-and-entrypoint-interact" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">CMD và ENTRYPOINT tương tác thế nào</span><span class="lc-sub">Bảng chân trị sáu dòng chính thức. Đọc một lần cho cẩn thận là chuyện này thôi rối rắm mãi mãi.</span></span>
</a>
<a class="link-card" href="https://github.com/docker-library/postgres/blob/master/docker-entrypoint.sh" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">Script entrypoint của ảnh postgres</span><span class="lc-sub">Một ví dụ cấp production cho mọi thứ trong bài này: quy ước bí mật <code>_FILE</code>, khởi tạo lần đầu, và <code>exec "\$@"</code> ở cuối. Đáng đọc trọn vẹn.</span></span>
</a>
<a class="link-card" href="https://github.com/Yelp/dumb-init" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">dumb-init</span><span class="lc-sub">Một init tối giản cho khi tiến trình của bạn thật sự sinh con. README của nó giải thích việc chuyển tiếp tín hiệu và nhóm tiến trình rõ ràng hơn phần lớn giáo trình hệ điều hành.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: khởi động và dừng cho sạch</span><span class="lc-sub">Bài chấm điểm: đoán output của sáu tổ hợp ENTRYPOINT/CMD, sửa một cái ảnh mất mười giây để dừng, viết một entrypoint giữ cho <code>CMD</code> vẫn ghi đè được, và giải thích vì sao một biến không được khai triển.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> viết mảng JSON bằng dấu nháy ĐƠN — <code>CMD ['node', 'server.js']</code>. Đó không phải JSON hợp lệ, nên Docker lùi về coi cả dòng là <em>DẠNG SHELL</em> rồi chạy <code>/bin/sh -c "['node', 'server.js']"</code>, và nó hỏng với một thông báo khó hiểu kiểu <code>[node,: not found</code>. Bản cũ của bài nói lúc dựng không có cảnh báo nào; BuildKit bây giờ CÓ in một dòng — <code>WARN: JSONArgsRecommended</code> — nhưng nó chỉ là một dòng vàng giữa rất nhiều dòng, rất dễ bỏ sót. Hãy dùng nháy KÉP, luôn luôn — và nếu muốn chắc chắn thì kiểm lại sau bằng <code>docker image inspect img --format '{{.Config.Cmd}}'</code>: dạng exec hiện ra cái mảng còn nguyên, dạng shell hiện ra <code>[/bin/sh -c …]</code>.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> ENTRYPOINT là chương trình còn CMD là tham số mặc định của nó; tham số trên dòng lệnh THAY THẾ CMD và được NỐI vào sau ENTRYPOINT. Hãy luôn dùng dạng exec (một mảng JSON với nháy kép) để tiến trình của bạn là PID 1 và dừng trong vài mili giây thay vì mười giây. Và một script entrypoint phải kết thúc bằng <code>exec "\$@"</code> — riêng dòng đó là thứ khiến phần thiết lập biến mất và trao PID 1 cho ứng dụng của bạn.</p>
</div>
`,
    },
    /* ─────────────────────────── 4.4 ─────────────────────────── */
    {
      title: '4.4 — ARG and ENV: build time versus run time|||4.4 — ARG và ENV: lúc dựng so với lúc chạy',
      slug: 'dk-4-4-arg-env',
      type: 'LESSON',
      description: 'ARG chỉ sống lúc dựng còn ENV đi theo cả cái ảnh, phạm vi của ARG qua các stage, các ARG dựng sẵn, vì sao ARG lộ ra trong docker history, và bẫy NODE_ENV=production làm npm ci bỏ devDependencies.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>ARG and ENV: build time versus run time</h2>
<p class="lead">Both set a variable. One exists only while the image is being built and then vanishes; the other is baked into the image and is there for every container that ever runs it. Confusing them produces two very specific failures: a variable that is mysteriously empty at run time, and a secret published to everyone who pulls your image.</p>

<h3>The difference, demonstrated</h3>
${slide('dk-04', 19, 'ARG chỉ sống lúc dựng — ENV đi theo ảnh tới mọi container')}
<pre><code>docker build -q -t argenv - &lt;&lt;'EOF' &gt;/dev/null
FROM alpine
ARG BUILD_ONLY=from-arg
ENV RUNTIME_TOO=from-env
RUN echo "at build: ARG=\$BUILD_ONLY ENV=\$RUNTIME_TOO"
CMD ["sh", "-c", "echo \\"at run:   ARG=\$BUILD_ONLY ENV=\$RUNTIME_TOO\\""]
EOF
docker build --progress=plain --no-cache -t argenv - &lt;&lt;'EOF' 2&gt;&amp;1 | grep 'at build'
FROM alpine
ARG BUILD_ONLY=from-arg
ENV RUNTIME_TOO=from-env
RUN echo "at build: ARG=\$BUILD_ONLY ENV=\$RUNTIME_TOO"
CMD ["sh", "-c", "echo \\"at run:   ARG=\$BUILD_ONLY ENV=\$RUNTIME_TOO\\""]
EOF
docker run --rm argenv</code></pre>
<div class="out">#7 0.184 at build: ARG=from-arg ENV=from-env
at run:   ARG= ENV=from-env</div>
<div class="lz-map">
  <div class="lz-stage">ARG</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Build time only</span><span class="lz-nsub">Set with <code>--build-arg</code>, usable in <code>RUN</code> and in other instructions during the build, and <strong>completely gone</strong> in the finished image. Its value <em>is</em> recorded in <code>docker history</code>.</span></div></div>
  <div class="lz-stage">ENV</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Build time AND run time</span><span class="lz-nsub">Available to every later <code>RUN</code>, stored in the image config, present in every container, visible in <code>docker inspect</code>, and overridable at run time with <code>-e</code>.</span></div></div>
  <div class="lz-stage">Both are visible</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Neither is private</span><span class="lz-nsub"><code>ARG</code> shows up in <code>docker history</code>; <code>ENV</code> shows up in <code>docker inspect</code>. Anyone with the image has both. Neither is a place for a secret.</span></div></div>
</div>
<pre><code>docker history argenv --no-trunc --format '{{.CreatedBy}}' | grep -i build_only | head -2
docker image inspect argenv --format '{{json .Config.Env}}'</code></pre>
<div class="out">ARG BUILD_ONLY=from-arg
["PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin","RUNTIME_TOO=from-env"]</div>

<h3>Where each value lives: a map for when you are confused</h3>
<p>Most "why is this empty?" questions are answered by asking <em>at which moment</em> the value is read. This table covers every way a value gets into a container, from the Dockerfile to the command line:</p>
<table>
<tr><th>You write…</th><th>Exists during <code>docker build</code>?</th><th>Exists in the running container?</th><th>Who can read it later</th></tr>
<tr><td><code>ARG X=1</code> in the Dockerfile</td><td>yes, from that line on, in that stage</td><td>no</td><td><code>docker history</code></td></tr>
<tr><td><code>--build-arg X=2</code></td><td>yes, overrides the <code>ARG</code> default — only if <code>ARG X</code> is declared</td><td>no</td><td><code>docker history</code> (the <code>RUN |1 X=2</code> lines)</td></tr>
<tr><td><code>ENV X=1</code> in the Dockerfile</td><td>yes, from that line on</td><td>yes</td><td><code>docker inspect</code>, anyone with the image</td></tr>
<tr><td><code>ARG X</code> + <code>ENV X=&#36;{X}</code></td><td>yes</td><td>yes, frozen at build time</td><td><code>docker inspect</code></td></tr>
<tr><td><code>docker run -e X=3</code> / Compose <code>environment:</code></td><td>no</td><td>yes, overrides the image's <code>ENV</code></td><td><code>docker inspect</code> of that container</td></tr>
<tr><td><code>--secret id=x</code> + <code>RUN --mount=type=secret,id=x</code></td><td>only inside that one <code>RUN</code></td><td>no</td><td>nobody</td></tr>
</table>
<div class="callout"><strong>When to use which.</strong> A value the <em>build</em> needs and that is not secret (a version to download, a base-image tag): <code>ARG</code>. A value the <em>app</em> needs at run time with a sensible default (<code>PORT</code>, <code>NODE_ENV</code>): <code>ENV</code>, overridden with <code>-e</code> per environment. Anything secret, at build time: a secret mount; at run time: an environment variable or file supplied when the container starts, never baked into the image (Chapter 11). And a value a bundler inlines into JavaScript (<code>NEXT_PUBLIC_*</code>): an <code>ARG</code> plus a rebuild per environment — see the pitfall below and the Next.js recipe in Lesson 4.5, where this was checked for real.</div>

<h3>Passing values in</h3>
<pre><code>docker build --build-arg BUILD_ONLY=from-cli -t argenv2 - &lt;&lt;'EOF' &gt;/dev/null
FROM alpine
ARG BUILD_ONLY=default-value
RUN echo "\$BUILD_ONLY" &gt; /value
CMD ["cat", "/value"]
EOF
docker run --rm argenv2

<span class="tok-comment"># Passing through from your shell, like docker run -e</span>
export API_URL=https://api.example.com
docker build --build-arg API_URL -t argenv3 - &lt;&lt;'EOF' &gt;/dev/null
FROM alpine
ARG API_URL
RUN echo "\$API_URL" &gt; /value
CMD ["cat", "/value"]
EOF
docker run --rm argenv3</code></pre>
<div class="out">from-cli
https://api.example.com</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Undeclared build args are ignored</span><span class="v"><code>--build-arg FOO=bar</code> without a matching <code>ARG FOO</code> does nothing. With the legacy builder it printed a warning; with BuildKit there is none at all — checked on Docker 29: <code>--build-arg API_ULR=…</code> (a typo) against <code>ARG API_URL</code> left the variable empty and the word <code>API_ULR</code> appeared nowhere in the build output (an earlier version of this lesson said to look for the warning line). A typo therefore fails completely silently; the only defence is to print the value in a <code>RUN</code> while developing, or to fail on empty with <code>RUN test -n "&#36;API_URL"</code>.</span></div>
  <div class="kv"><span class="k">ARG has a default; ENV needs a value</span><span class="v"><code>ARG PORT=3000</code> gives a fallback used when nothing is passed. <code>ARG PORT</code> alone is legal and yields an empty string, which is the source of most "why is this blank" confusion.</span></div>
  <div class="kv"><span class="k">ENV can be seeded from ARG</span><span class="v"><code>ARG VERSION=1.0</code> then <code>ENV APP_VERSION=&#36;{VERSION}</code> is the standard way to turn a build-time value into a run-time one.</span></div>
  <div class="kv"><span class="k">ENV wins over ARG</span><span class="v">If both have the same name, <code>ENV</code> takes precedence for the rest of the build. Avoid using the same name for both; it makes the file impossible to read.</span></div>
</div>

<h3>Scope: the rule that catches everyone</h3>
${slide('dk-04', 20, 'ARG trước FROM chỉ dùng được trong dòng FROM')}
<pre><code># syntax=docker/dockerfile:1
ARG NODE_VERSION=22                      <span class="tok-comment"># before FROM: only usable IN FROM lines</span>

FROM node:&#36;{NODE_VERSION}-alpine AS build
ARG NODE_VERSION                         <span class="tok-comment"># must RE-DECLARE to use it in this stage</span>
RUN echo "building on node &#36;{NODE_VERSION}"

FROM node:&#36;{NODE_VERSION}-alpine
RUN echo "NODE_VERSION here is: '&#36;{NODE_VERSION}'"   <span class="tok-comment"># EMPTY — not re-declared</span></code></pre>
<div class="out">#7 0.069 NODE_VERSION here is: '22.23.2'</div>
<p class="note-ct">That is the real output on Docker 29 (course's Mac) — and it is not what an earlier version of this lesson showed (<code>building on node 22</code> then <code>''</code>). Two separate things happened, and both are worth knowing. First, BuildKit builds only the stages the final stage actually needs; nothing copies from <code>build</code>, so that stage was skipped and its <code>echo</code> never ran. Second, the final stage is not empty because the <code>node</code> image itself sets <code>ENV NODE_VERSION=22.23.2</code> — your undeclared <code>ARG</code> is shadowed by the base image's environment. So this example cannot demonstrate the rule. Here is one that does, with a name no base image uses and a <code>COPY --from</code> so both stages run:</p>
<pre><code class="language-dockerfile"># syntax=docker/dockerfile:1
ARG ALPINE_VERSION=3.22

FROM alpine:&#36;{ALPINE_VERSION} AS build
ARG ALPINE_VERSION
RUN echo "stage build thấy: '&#36;{ALPINE_VERSION}'" | tee /msg

FROM alpine:&#36;{ALPINE_VERSION}
COPY --from=build /msg /msg
RUN echo "stage cuối thấy: '&#36;{ALPINE_VERSION}'"</code></pre>
<div class="out">#7 0.074 stage build thấy: '3.22'
#9 0.080 stage cuối thấy: ''</div>
<div class="callout warn"><strong>An <code>ARG</code> declared before the first <code>FROM</code> is outside every stage.</strong> It can be used in <code>FROM</code> lines and nowhere else. To use it inside a stage you must write <code>ARG NAME</code> again in that stage — with no value, which inherits the outer one. This is documented and still surprises everyone once, because the symptom is a silently empty variable rather than an error. The same applies per stage in a multi-stage build: each stage needs its own re-declaration.</div>

<h3>The build args Docker gives you for free</h3>
${slide('dk-04', 23, 'ARG có sẵn miễn phí — và --build-arg gõ sai thì BuildKit im lặng')}
<pre><code># syntax=docker/dockerfile:1
FROM --platform=\$BUILDPLATFORM alpine
ARG TARGETPLATFORM TARGETOS TARGETARCH BUILDPLATFORM
RUN echo "building on \$BUILDPLATFORM for \$TARGETPLATFORM (\$TARGETOS/\$TARGETARCH)"</code></pre>
<div class="out">building on linux/amd64 for linux/arm64 (linux/arm64)</div>
<p class="note-ct">That line comes from an amd64 machine building with <code>--platform linux/arm64</code>; the command as written, with no <code>--platform</code>, builds for the machine you are on. On the course's Mac M1 (Docker 29.8), first without and then with <code>--platform linux/amd64</code>:</p>
<div class="out">building on linux/arm64 for linux/arm64 (linux/arm64)
building on linux/arm64 for linux/amd64 (linux/amd64)</div>
<p>Because of <code>FROM --platform=$BUILDPLATFORM</code>, the <code>RUN</code> runs natively on arm64 even when the target is amd64 — which is exactly what the Go recipe in Lesson 4.5 relies on to cross-compile in seconds instead of emulating a whole toolchain.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">TARGETPLATFORM / TARGETOS / TARGETARCH</span><span class="v">What you are building <em>for</em>. The basis of cross-compilation (Lesson 3.4) — pass them straight to <code>GOOS</code>/<code>GOARCH</code>, or use them to pick the right prebuilt binary.</span></div>
  <div class="kv"><span class="k">BUILDPLATFORM / BUILDOS / BUILDARCH</span><span class="v">What you are building <em>on</em>. Used with <code>FROM --platform=\$BUILDPLATFORM</code> to keep the compiler stage native and fast.</span></div>
  <div class="kv"><span class="k">HTTP_PROXY, HTTPS_PROXY, NO_PROXY, FTP_PROXY</span><span class="v">Predefined and, unusually, excluded from <code>docker history</code>. Docker passes them through so builds work behind a corporate proxy without you declaring anything.</span></div>
  <div class="kv"><span class="k">BUILDKIT_SYNTAX and friends</span><span class="v">Internal knobs you will rarely touch, but worth knowing they exist when a build behaves oddly and something in CI is setting them.</span></div>
</div>

<h3>ARG is not a secret</h3>
${slide('dk-04', 21, 'Bí mật qua --build-arg ở lại trong ảnh — dùng secret mount')}
<pre><code>docker build --build-arg NPM_TOKEN=npm_SuperSecret123 -q -t leaky - &lt;&lt;'EOF' &gt;/dev/null
FROM alpine
ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=&#36;{NPM_TOKEN}" &gt; /root/.npmrc \\
 &amp;&amp; echo "pretending to install" \\
 &amp;&amp; rm /root/.npmrc
EOF
docker history leaky --no-trunc --format '{{.CreatedBy}}' | grep -i token</code></pre>
<div class="out">RUN |1 NPM_TOKEN=npm_SuperSecret123 /bin/sh -c echo "//registry.npmjs.org/:_authToken=&#36;{NPM_TOKEN}" &gt; /root/.npmrc  &amp;&amp; echo "pretending to install"  &amp;&amp; rm /root/.npmrc # buildkit
ARG NPM_TOKEN=npm_SuperSecret123</div>
<div class="callout warn"><strong>The token is in the image metadata, in plain text, forever.</strong> Deleting the <code>.npmrc</code> in the same <code>RUN</code> removed the file but not the argument — and even if it had not been in <code>history</code>, the file would still be in that layer's tar (Lesson 1.2). Anyone who pulls this image can read the token with one command. The correct mechanism is a BuildKit secret mount, which makes the value available to one <code>RUN</code> and writes it into no layer at all:
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci --omit=dev
COPY . .
CMD ["node", "src/server.js"]</code></pre>
<pre><code>docker build --secret id=npmrc,src=\$HOME/.npmrc -t safe .
docker history safe --no-trunc --format '{{.CreatedBy}}' | grep -ci token</code></pre>
<div class="out">0</div></div>
<p class="note-ct">The leak above is re-run on Docker 29 (course's Mac). An earlier version showed a single line; the full picture is worse. Build it without <code>-q</code> and BuildKit warns — <code>WARN: SecretsUsedInArgOrEnv: Do not use ARG or ENV instructions for sensitive data (ARG "NPM_TOKEN")</code> — but still builds, and the step line of the log prints the command with the token already substituted (<code>RUN echo "//registry.npmjs.org/:_authToken=npm_SuperSecret123" …</code>), in a log CI keeps for months. And <code>docker history</code> records it twice: in the <code>ARG</code> line and in the <code>RUN |1 NPM_TOKEN=…</code> line, because BuildKit writes every build argument a <code>RUN</code> used into that step's history. With the secret mount, checked the same way: <code>grep -ci token</code> prints <code>0</code>, and <code>docker run --rm safe ls /root/.npmrc</code> answers <code>No such file or directory</code> — the file existed only during that one <code>RUN</code>.</p>

<h3>The NODE_ENV trap</h3>
${slide('dk-04', 22, 'ENV NODE_ENV=production đặt quá sớm ⇒ tsc: not found')}
<pre><code><span class="tok-comment"># Looks reasonable, breaks the build</span>
FROM node:22-alpine
ENV NODE_ENV=production          <span class="tok-comment"># ← set too early</span>
WORKDIR /app
COPY package*.json ./
RUN npm ci                        <span class="tok-comment"># silently skips devDependencies…</span>
COPY . .
RUN npm run build                 <span class="tok-comment"># …so typescript/vite/webpack is missing</span></code></pre>
<div class="out">> demo@1.0.0 build
> tsc -p tsconfig.json

sh: tsc: not found
ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 127</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Why it happens</span><span class="v"><code>npm ci</code> reads <code>NODE_ENV</code> and omits <code>devDependencies</code> when it is <code>production</code>. Your build tools live there, so the install succeeds and the build step fails with <code>127</code>.</span></div>
  <div class="kv"><span class="k">The fix</span><span class="v">Set <code>ENV NODE_ENV=production</code> <strong>after</strong> the build, or only in the final stage of a multi-stage build (Chapter 6). Build with dev dependencies; ship without them.</span></div>
  <div class="kv"><span class="k">The same shape elsewhere</span><span class="v">Python's <code>PIP_NO_DEPS</code>, Ruby's <code>BUNDLE_WITHOUT</code>, and any <code>ENV</code> a package manager reads. An <code>ENV</code> line changes the behaviour of every <code>RUN</code> after it, which is easy to forget.</span></div>
  <div class="kv"><span class="k">The ENV lines worth setting early</span><span class="v"><code>PYTHONUNBUFFERED=1</code> (Lesson 2.2), <code>PYTHONDONTWRITEBYTECODE=1</code>, <code>NPM_CONFIG_UPDATE_NOTIFIER=false</code>, <code>CI=true</code>. These make builds quieter and logs work; none of them change dependency resolution.</span></div>
</div>
<pre><code>docker rmi argenv argenv2 argenv3 leaky safe &gt;/dev/null 2&gt;&amp;1</code></pre>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your team's CI passes the private-registry token with <code>--build-arg NPM_TOKEN</code>, the image sets <code>ENV NODE_ENV=production</code> on its second line, and the staging build shows the wrong API URL. Take all three apart on your own machine.</p><ol>
<li>In <code>~/thu-docker/vars</code>, reproduce the leak from "ARG is not a secret" with a fake token and find it with <code>docker history --no-trunc</code>. Count how many lines contain it.</li>
<li>Rewrite it with <code>RUN --mount=type=secret,id=npmrc,target=/root/.npmrc</code> and <code>--secret id=npmrc,src=…</code>; check that <code>docker history … | grep -ci token</code> prints <code>0</code>.</li>
<li>Reproduce <code>sh: tsc: not found</code> with the NODE_ENV trap Dockerfile on any TypeScript project, then fix it by moving <code>ENV NODE_ENV=production</code> to a final stage.</li>
<li>Build the <code>ALPINE_VERSION</code> scope example, confirm the empty value, then add <code>ARG ALPINE_VERSION</code> to the final stage and build again.</li>
<li>Clean up every image you built.</li></ol>
<p><strong>Done when:</strong> you can show the token in the first image's history (in both the <code>ARG</code> and the <code>RUN |1</code> line) and in neither of the second; the TypeScript build passes with <code>NODE_ENV=production</code> only in the final stage; and the scope example prints <code>'3.22'</code> in both stages after your fix.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ARG</span><span class="v">A build-time variable; gone from the finished image but recorded in <code>docker history</code>.</span></div>
  <div class="kv"><span class="k">ENV</span><span class="v">An environment variable stored in the image config and present in every container.</span></div>
  <div class="kv"><span class="k">--build-arg</span><span class="v">Sets an <code>ARG</code> from the command line; silently ignored if no matching <code>ARG</code> exists.</span></div>
  <div class="kv"><span class="k">Stage</span><span class="v">The part of a Dockerfile from one <code>FROM</code> to the next; variables must be declared per stage.</span></div>
  <div class="kv"><span class="k">Global ARG</span><span class="v">An <code>ARG</code> before the first <code>FROM</code>; usable only in <code>FROM</code> lines unless re-declared.</span></div>
  <div class="kv"><span class="k">Secret mount</span><span class="v"><code>RUN --mount=type=secret</code>: a file available to one <code>RUN</code> and written into no layer.</span></div>
  <div class="kv"><span class="k">devDependencies</span><span class="v">Packages needed only to build or test (TypeScript, bundlers); skipped when <code>NODE_ENV=production</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>ARG</code> lives during the build, <code>ENV</code> lives in every container — and both are readable from the image.</li>
<li>A global <code>ARG</code> needs re-declaring in each stage; BuildKit skips stages the final one does not use.</li>
<li>A base image's <code>ENV</code> can mask your empty <code>ARG</code> (<code>node</code> sets <code>NODE_VERSION</code>) — test with unique names.</li>
<li>BuildKit ignores a misspelled <code>--build-arg</code> without a word; guard important values with <code>test -n</code>.</li>
<li>Secrets go through <code>--secret</code> and <code>RUN --mount=type=secret</code>, never <code>--build-arg</code> or <code>ENV</code>.</li>
<li>Set <code>NODE_ENV=production</code> only in the final stage, after the build tools have run.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/build/building/variables/" target="_blank" rel="noopener">
  <span class="lc-ico">🔤</span>
  <span class="lc-body"><span class="lc-title">Build variables — ARG and ENV</span><span class="lc-sub">Scoping rules, the predefined args, precedence, and the explicit warning that build args are not suitable for secrets. The reference for everything in this lesson.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/secrets/" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Build secrets</span><span class="lc-sub"><code>RUN --mount=type=secret</code>, SSH agent forwarding for private Git dependencies, and how to pass secrets from GitHub Actions. The correct answer whenever you were reaching for <code>ARG</code>.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/variables/#pre-defined-build-arguments" target="_blank" rel="noopener">
  <span class="lc-ico">🌍</span>
  <span class="lc-body"><span class="lc-title">Predefined build arguments</span><span class="lc-sub">The full <code>TARGET*</code> / <code>BUILD*</code> table and the proxy variables. Bookmark it for the day you write your first cross-compiling Dockerfile.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build time or run time</span><span class="lc-sub">Graded exercises: predict which variables are empty at run time, fix an <code>ARG</code> that is blank inside a stage, extract a leaked token from an image's history, and repair a build broken by an early <code>NODE_ENV</code>.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> using <code>ARG</code> to inject a frontend API URL, then wondering why changing it does not change the built site. Two separate problems hide here. First, <code>ARG</code> vanishes at run time, so a Next.js server reading <code>process.env.NEXT_PUBLIC_API_URL</code> finds nothing unless you also set an <code>ENV</code>. Second, values that a bundler inlines are baked in at <strong>build</strong> time, so changing the environment variable on the server and restarting does nothing at all — the string is already inside the JavaScript. Those need a rebuild, per environment, and it is worth writing that fact in a comment next to the <code>ARG</code> so the next person does not lose an afternoon to it.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>ARG</code> exists only during the build and disappears; <code>ENV</code> is stored in the image and is present in every container — and both are readable by anyone who has the image. An <code>ARG</code> declared before <code>FROM</code> is usable only in <code>FROM</code> lines and must be re-declared inside each stage that needs it. And never pass a secret with <code>--build-arg</code>: use <code>RUN --mount=type=secret</code>, which leaves nothing in any layer or in <code>docker history</code>.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>ARG và ENV: lúc dựng so với lúc chạy</h2>
<p class="lead">Cả hai đều đặt một biến. Một cái chỉ tồn tại trong lúc ảnh đang được dựng rồi biến mất; cái kia được nướng vào ảnh và có mặt ở mọi container từng chạy nó. Nhầm lẫn hai thứ đó sinh ra hai kiểu hỏng rất cụ thể: một biến rỗng một cách bí hiểm lúc chạy, và một bí mật được công bố cho mọi người kéo ảnh của bạn về.</p>

<h3>Khác biệt, chứng minh tận mắt</h3>
${slide('dk-04', 19, 'ARG chỉ sống lúc dựng — ENV đi theo ảnh tới mọi container')}
<pre><code>docker build -q -t argenv - &lt;&lt;'EOF' &gt;/dev/null
FROM alpine
ARG BUILD_ONLY=from-arg
ENV RUNTIME_TOO=from-env
RUN echo "at build: ARG=\$BUILD_ONLY ENV=\$RUNTIME_TOO"
CMD ["sh", "-c", "echo \\"at run:   ARG=\$BUILD_ONLY ENV=\$RUNTIME_TOO\\""]
EOF
docker build --progress=plain --no-cache -t argenv - &lt;&lt;'EOF' 2&gt;&amp;1 | grep 'at build'
FROM alpine
ARG BUILD_ONLY=from-arg
ENV RUNTIME_TOO=from-env
RUN echo "at build: ARG=\$BUILD_ONLY ENV=\$RUNTIME_TOO"
CMD ["sh", "-c", "echo \\"at run:   ARG=\$BUILD_ONLY ENV=\$RUNTIME_TOO\\""]
EOF
docker run --rm argenv</code></pre>
<div class="out">#7 0.184 at build: ARG=from-arg ENV=from-env
at run:   ARG= ENV=from-env</div>
<div class="lz-map">
  <div class="lz-stage">ARG</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chỉ lúc dựng</span><span class="lz-nsub">Đặt bằng <code>--build-arg</code>, dùng được trong <code>RUN</code> và các chỉ thị khác trong lúc dựng, và <strong>BIẾN MẤT HOÀN TOÀN</strong> trong ảnh thành phẩm. Nhưng giá trị của nó thì CÓ được ghi lại trong <code>docker history</code>.</span></div></div>
  <div class="lz-stage">ENV</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Cả lúc dựng LẪN lúc chạy</span><span class="lz-nsub">Có mặt với mọi <code>RUN</code> phía sau, được lưu trong cấu hình ảnh, có mặt trong mọi container, nhìn thấy được trong <code>docker inspect</code>, và ghi đè được lúc chạy bằng <code>-e</code>.</span></div></div>
  <div class="lz-stage">Cả hai đều LỘ</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Không cái nào riêng tư</span><span class="lz-nsub"><code>ARG</code> hiện ra trong <code>docker history</code>; <code>ENV</code> hiện ra trong <code>docker inspect</code>. Bất cứ ai có cái ảnh đều có cả hai. Không cái nào là chỗ để đặt bí mật.</span></div></div>
</div>
<pre><code>docker history argenv --no-trunc --format '{{.CreatedBy}}' | grep -i build_only | head -2
docker image inspect argenv --format '{{json .Config.Env}}'</code></pre>
<div class="out">ARG BUILD_ONLY=from-arg
["PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin","RUNTIME_TOO=from-env"]</div>

<h3>Mỗi giá trị sống ở đâu: tấm bản đồ cho lúc bạn rối</h3>
<p>Phần lớn câu hỏi "sao cái này rỗng?" được trả lời bằng cách hỏi giá trị đó được đọc vào <em>THỜI ĐIỂM nào</em>. Bảng này gồm mọi đường một giá trị đi vào container, từ Dockerfile tới dòng lệnh:</p>
<table>
<tr><th>Bạn viết…</th><th>Có mặt lúc <code>docker build</code>?</th><th>Có trong container đang chạy?</th><th>Ai đọc được về sau</th></tr>
<tr><td><code>ARG X=1</code> trong Dockerfile</td><td>có, từ dòng đó trở đi, trong stage đó</td><td>không</td><td><code>docker history</code></td></tr>
<tr><td><code>--build-arg X=2</code></td><td>có, đè giá trị mặc định của <code>ARG</code> — chỉ khi đã khai <code>ARG X</code></td><td>không</td><td><code>docker history</code> (các dòng <code>RUN |1 X=2</code>)</td></tr>
<tr><td><code>ENV X=1</code> trong Dockerfile</td><td>có, từ dòng đó trở đi</td><td>có</td><td><code>docker inspect</code>, bất cứ ai có ảnh</td></tr>
<tr><td><code>ARG X</code> + <code>ENV X=&#36;{X}</code></td><td>có</td><td>có, đông cứng từ lúc dựng</td><td><code>docker inspect</code></td></tr>
<tr><td><code>docker run -e X=3</code> / <code>environment:</code> của Compose</td><td>không</td><td>có, đè <code>ENV</code> của ảnh</td><td><code>docker inspect</code> của container đó</td></tr>
<tr><td><code>--secret id=x</code> + <code>RUN --mount=type=secret,id=x</code></td><td>chỉ bên trong đúng một <code>RUN</code> đó</td><td>không</td><td>không ai</td></tr>
</table>
<div class="callout"><strong>Khi nào dùng cái nào.</strong> Giá trị mà LƯỢT DỰNG cần và không bí mật (phiên bản cần tải, tag của ảnh nền): <code>ARG</code>. Giá trị APP cần lúc chạy và có mặc định hợp lý (<code>PORT</code>, <code>NODE_ENV</code>): <code>ENV</code>, đè bằng <code>-e</code> theo từng môi trường. Mọi thứ bí mật, lúc dựng: secret mount; lúc chạy: biến môi trường hoặc file đưa vào khi container khởi động, KHÔNG BAO GIỜ nướng vào ảnh (Chương 11). Còn giá trị bị bộ đóng gói nhúng thẳng vào JavaScript (<code>NEXT_PUBLIC_*</code>): một <code>ARG</code> cộng dựng lại cho mỗi môi trường — xem cái bẫy bên dưới và công thức Next.js ở Bài 4.5, nơi chuyện này được kiểm thật.</div>

<h3>Truyền giá trị vào</h3>
<pre><code>docker build --build-arg BUILD_ONLY=from-cli -t argenv2 - &lt;&lt;'EOF' &gt;/dev/null
FROM alpine
ARG BUILD_ONLY=default-value
RUN echo "\$BUILD_ONLY" &gt; /value
CMD ["cat", "/value"]
EOF
docker run --rm argenv2

<span class="tok-comment"># Truyền xuyên từ shell của bạn, giống docker run -e</span>
export API_URL=https://api.example.com
docker build --build-arg API_URL -t argenv3 - &lt;&lt;'EOF' &gt;/dev/null
FROM alpine
ARG API_URL
RUN echo "\$API_URL" &gt; /value
CMD ["cat", "/value"]
EOF
docker run --rm argenv3</code></pre>
<div class="out">from-cli
https://api.example.com</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Build arg không khai báo thì bị BỎ QUA</span><span class="v"><code>--build-arg FOO=bar</code> mà không có <code>ARG FOO</code> tương ứng thì chẳng làm gì. Bộ dựng cũ còn in một cảnh báo; BuildKit thì KHÔNG in gì cả — đã kiểm trên Docker 29: <code>--build-arg API_ULR=…</code> (gõ nhầm) với <code>ARG API_URL</code> để biến rỗng và chữ <code>API_ULR</code> không xuất hiện ở đâu trong output lúc dựng (bản cũ của bài bảo hãy tìm dòng cảnh báo). Nên một lỗi gõ hỏng HOÀN TOÀN trong im lặng; cách phòng duy nhất là in giá trị ra trong một <code>RUN</code> lúc phát triển, hoặc bắt lỗi khi rỗng bằng <code>RUN test -n "&#36;API_URL"</code>.</span></div>
  <div class="kv"><span class="k">ARG có giá trị mặc định; ENV thì cần một giá trị</span><span class="v"><code>ARG PORT=3000</code> cho một giá trị dự phòng dùng khi không truyền gì. Riêng <code>ARG PORT</code> thì hợp lệ và cho ra chuỗi RỖNG, và đó là nguồn của phần lớn sự bối rối kiểu "sao cái này trống trơn".</span></div>
  <div class="kv"><span class="k">ENV nhận giá trị được từ ARG</span><span class="v"><code>ARG VERSION=1.0</code> rồi <code>ENV APP_VERSION=&#36;{VERSION}</code> là cách tiêu chuẩn để biến một giá trị lúc dựng thành một giá trị lúc chạy.</span></div>
  <div class="kv"><span class="k">ENV thắng ARG</span><span class="v">Nếu cả hai cùng tên thì <code>ENV</code> được ưu tiên cho phần còn lại của lượt dựng. Hãy tránh dùng cùng một cái tên cho cả hai; nó khiến file không đọc nổi.</span></div>
</div>

<h3>Phạm vi: cái luật bẫy tất cả mọi người</h3>
${slide('dk-04', 20, 'ARG trước FROM chỉ dùng được trong dòng FROM')}
<pre><code># syntax=docker/dockerfile:1
ARG NODE_VERSION=22                      <span class="tok-comment"># trước FROM: CHỈ dùng được TRONG các dòng FROM</span>

FROM node:&#36;{NODE_VERSION}-alpine AS build
ARG NODE_VERSION                         <span class="tok-comment"># phải KHAI BÁO LẠI mới dùng được trong stage này</span>
RUN echo "đang dựng trên node &#36;{NODE_VERSION}"

FROM node:&#36;{NODE_VERSION}-alpine
RUN echo "NODE_VERSION ở đây là: '&#36;{NODE_VERSION}'"   <span class="tok-comment"># RỖNG — chưa khai báo lại</span></code></pre>
<div class="out">#7 0.069 NODE_VERSION ở đây là: '22.23.2'</div>
<p class="note-ct">Đó là output thật trên Docker 29 (máy Mac của khoá) — và nó KHÔNG giống điều bản cũ của bài in ra (<code>đang dựng trên node 22</code> rồi <code>''</code>). Có HAI chuyện riêng biệt đã xảy ra, và cả hai đều đáng biết. Thứ nhất, BuildKit chỉ dựng những stage mà stage cuối thật sự cần; không có gì chép từ <code>build</code>, nên stage đó bị BỎ QUA và lệnh <code>echo</code> của nó không bao giờ chạy. Thứ hai, stage cuối không rỗng vì chính ảnh <code>node</code> đã đặt <code>ENV NODE_VERSION=22.23.2</code> — cái <code>ARG</code> không được khai lại của bạn bị môi trường của ảnh nền che mất. Nên ví dụ này KHÔNG chứng minh được luật. Đây là một ví dụ chứng minh được, dùng một cái tên mà không ảnh nền nào dùng, và có <code>COPY --from</code> để cả hai stage đều chạy:</p>
<pre><code class="language-dockerfile"># syntax=docker/dockerfile:1
ARG ALPINE_VERSION=3.22

FROM alpine:&#36;{ALPINE_VERSION} AS build
ARG ALPINE_VERSION
RUN echo "stage build thấy: '&#36;{ALPINE_VERSION}'" | tee /msg

FROM alpine:&#36;{ALPINE_VERSION}
COPY --from=build /msg /msg
RUN echo "stage cuối thấy: '&#36;{ALPINE_VERSION}'"</code></pre>
<div class="out">#7 0.074 stage build thấy: '3.22'
#9 0.080 stage cuối thấy: ''</div>
<div class="callout warn"><strong>Một <code>ARG</code> khai báo trước <code>FROM</code> đầu tiên thì nằm NGOÀI mọi stage.</strong> Nó dùng được trong các dòng <code>FROM</code> và không ở đâu khác. Muốn dùng nó BÊN TRONG một stage thì bạn phải viết <code>ARG TÊN</code> lần nữa trong stage đó — không kèm giá trị, và nó thừa hưởng giá trị bên ngoài. Chuyện này có ghi trong tài liệu và vẫn làm mọi người bất ngờ đúng một lần, vì triệu chứng là một biến RỖNG trong im lặng chứ không phải một cái lỗi. Điều tương tự áp cho từng stage trong một lượt dựng nhiều tầng: mỗi stage cần khai báo lại của riêng nó.</div>

<h3>Những build arg Docker cho bạn miễn phí</h3>
${slide('dk-04', 23, 'ARG có sẵn miễn phí — và --build-arg gõ sai thì BuildKit im lặng')}
<pre><code># syntax=docker/dockerfile:1
FROM --platform=\$BUILDPLATFORM alpine
ARG TARGETPLATFORM TARGETOS TARGETARCH BUILDPLATFORM
RUN echo "đang dựng trên \$BUILDPLATFORM cho \$TARGETPLATFORM (\$TARGETOS/\$TARGETARCH)"</code></pre>
<div class="out">đang dựng trên linux/amd64 cho linux/arm64 (linux/arm64)</div>
<p class="note-ct">Dòng đó đến từ một máy amd64 dựng với <code>--platform linux/arm64</code>; còn câu lệnh như đang viết, không có <code>--platform</code>, thì dựng cho chính cái máy bạn đang ngồi. Trên máy Mac M1 của khoá (Docker 29.8), lần đầu không có và lần sau có <code>--platform linux/amd64</code>:</p>
<div class="out">đang dựng trên linux/arm64 cho linux/arm64 (linux/arm64)
đang dựng trên linux/arm64 cho linux/amd64 (linux/amd64)</div>
<p>Nhờ <code>FROM --platform=$BUILDPLATFORM</code>, lệnh <code>RUN</code> chạy tự nhiên trên arm64 ngay cả khi đích là amd64 — đúng thứ mà công thức Go ở Bài 4.5 dựa vào để biên dịch chéo trong vài giây thay vì giả lập cả một bộ công cụ.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">TARGETPLATFORM / TARGETOS / TARGETARCH</span><span class="v">Thứ bạn đang dựng <em>CHO</em>. Nền tảng của biên dịch chéo (Bài 3.4) — hãy truyền thẳng chúng vào <code>GOOS</code>/<code>GOARCH</code>, hoặc dùng chúng để chọn đúng chương trình dựng sẵn.</span></div>
  <div class="kv"><span class="k">BUILDPLATFORM / BUILDOS / BUILDARCH</span><span class="v">Thứ bạn đang dựng <em>TRÊN</em>. Dùng với <code>FROM --platform=\$BUILDPLATFORM</code> để giữ cho stage biên dịch chạy native và nhanh.</span></div>
  <div class="kv"><span class="k">HTTP_PROXY, HTTPS_PROXY, NO_PROXY, FTP_PROXY</span><span class="v">Được định nghĩa sẵn và, khác thường thay, bị LOẠI khỏi <code>docker history</code>. Docker truyền chúng xuyên qua để bản dựng chạy được sau một proxy doanh nghiệp mà bạn không phải khai báo gì.</span></div>
  <div class="kv"><span class="k">BUILDKIT_SYNTAX và họ hàng</span><span class="v">Những núm vặn nội bộ mà bạn hiếm khi đụng tới, nhưng đáng biết là chúng tồn tại khi một lượt dựng hành xử lạ và có thứ gì đó trong CI đang đặt chúng.</span></div>
</div>

<h3>ARG KHÔNG phải một bí mật</h3>
${slide('dk-04', 21, 'Bí mật qua --build-arg ở lại trong ảnh — dùng secret mount')}
<pre><code>docker build --build-arg NPM_TOKEN=npm_SuperSecret123 -q -t leaky - &lt;&lt;'EOF' &gt;/dev/null
FROM alpine
ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=&#36;{NPM_TOKEN}" &gt; /root/.npmrc \\
 &amp;&amp; echo "giả vờ cài đặt" \\
 &amp;&amp; rm /root/.npmrc
EOF
docker history leaky --no-trunc --format '{{.CreatedBy}}' | grep -i token</code></pre>
<div class="out">RUN |1 NPM_TOKEN=npm_SuperSecret123 /bin/sh -c echo "//registry.npmjs.org/:_authToken=&#36;{NPM_TOKEN}" &gt; /root/.npmrc  &amp;&amp; echo "pretending to install"  &amp;&amp; rm /root/.npmrc # buildkit
ARG NPM_TOKEN=npm_SuperSecret123</div>
<div class="callout warn"><strong>Cái token nằm trong siêu dữ liệu của ảnh, bằng chữ thường, mãi mãi.</strong> Xoá <code>.npmrc</code> trong CÙNG một lệnh <code>RUN</code> đã gỡ được cái file nhưng KHÔNG gỡ được cái tham số — và kể cả nếu nó không nằm trong <code>history</code> thì cái file vẫn nằm trong file tar của tầng đó (Bài 1.2). Bất cứ ai kéo ảnh này về đều đọc được cái token bằng một câu lệnh. Cơ chế ĐÚNG là một secret mount của BuildKit, nó khiến giá trị có mặt cho ĐÚNG MỘT lệnh <code>RUN</code> và không ghi vào tầng nào cả:
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci --omit=dev
COPY . .
CMD ["node", "src/server.js"]</code></pre>
<pre><code>docker build --secret id=npmrc,src=\$HOME/.npmrc -t safe .
docker history safe --no-trunc --format '{{.CreatedBy}}' | grep -ci token</code></pre>
<div class="out">0</div></div>
<p class="note-ct">Vụ rò ở trên được chạy lại trên Docker 29 (máy Mac của khoá). Bản cũ in đúng một dòng; bức tranh đầy đủ còn tệ hơn. Dựng mà không có <code>-q</code> thì BuildKit cảnh báo — <code>WARN: SecretsUsedInArgOrEnv: Do not use ARG or ENV instructions for sensitive data (ARG "NPM_TOKEN")</code> — nhưng VẪN dựng, và dòng tên bước trong log in ra câu lệnh với token đã được thay sẵn vào (<code>RUN echo "//registry.npmjs.org/:_authToken=npm_SuperSecret123" …</code>), trong một cái log mà CI giữ hàng tháng trời. Và <code>docker history</code> ghi nó HAI lần: ở dòng <code>ARG</code> và ở dòng <code>RUN |1 NPM_TOKEN=…</code>, vì BuildKit ghi mọi build arg mà một <code>RUN</code> đã dùng vào lịch sử của bước đó. Với secret mount, kiểm y như vậy: <code>grep -ci token</code> in <code>0</code>, và <code>docker run --rm safe ls /root/.npmrc</code> trả lời <code>No such file or directory</code> — file đó chỉ tồn tại trong đúng MỘT lệnh <code>RUN</code>.</p>

<h3>Cái bẫy NODE_ENV</h3>
${slide('dk-04', 22, 'ENV NODE_ENV=production đặt quá sớm ⇒ tsc: not found')}
<pre><code><span class="tok-comment"># Trông có vẻ hợp lý, phá hỏng lượt dựng</span>
FROM node:22-alpine
ENV NODE_ENV=production          <span class="tok-comment"># ← đặt quá sớm</span>
WORKDIR /app
COPY package*.json ./
RUN npm ci                        <span class="tok-comment"># âm thầm bỏ qua devDependencies…</span>
COPY . .
RUN npm run build                 <span class="tok-comment"># …nên typescript/vite/webpack không có</span></code></pre>
<div class="out">> demo@1.0.0 build
> tsc -p tsconfig.json

sh: tsc: not found
ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 127</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Vì sao nó xảy ra</span><span class="v"><code>npm ci</code> ĐỌC <code>NODE_ENV</code> và bỏ qua <code>devDependencies</code> khi nó là <code>production</code>. Công cụ dựng của bạn nằm ở đó, nên lượt cài thành công còn bước dựng thì hỏng với mã <code>127</code>.</span></div>
  <div class="kv"><span class="k">Cách chữa</span><span class="v">Hãy đặt <code>ENV NODE_ENV=production</code> <strong>SAU</strong> bước dựng, hoặc chỉ trong stage cuối của một lượt dựng nhiều tầng (Chương 6). Dựng thì có thư viện dev; đem đi thì không.</span></div>
  <div class="kv"><span class="k">Hình hài tương tự ở chỗ khác</span><span class="v"><code>PIP_NO_DEPS</code> của Python, <code>BUNDLE_WITHOUT</code> của Ruby, và mọi <code>ENV</code> mà một trình quản lý gói đọc. Một dòng <code>ENV</code> đổi hành vi của MỌI <code>RUN</code> phía sau nó, và điều đó rất dễ quên.</span></div>
  <div class="kv"><span class="k">Những dòng ENV đáng đặt sớm</span><span class="v"><code>PYTHONUNBUFFERED=1</code> (Bài 2.2), <code>PYTHONDONTWRITEBYTECODE=1</code>, <code>NPM_CONFIG_UPDATE_NOTIFIER=false</code>, <code>CI=true</code>. Chúng làm bản dựng bớt ồn và log hoạt động đúng; không cái nào đổi cách giải quyết thư viện phụ thuộc.</span></div>
</div>
<pre><code>docker rmi argenv argenv2 argenv3 leaky safe &gt;/dev/null 2&gt;&amp;1</code></pre>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> CI của nhóm truyền token của registry riêng bằng <code>--build-arg NPM_TOKEN</code>, ảnh đặt <code>ENV NODE_ENV=production</code> ngay dòng thứ hai, và bản dựng staging hiện sai URL API. Hãy mổ xẻ cả ba trên máy của bạn.</p><ol>
<li>Trong <code>~/thu-docker/vars</code>, tái hiện vụ rò ở mục "ARG KHÔNG phải một bí mật" với một token giả, rồi tìm nó bằng <code>docker history --no-trunc</code>. Đếm xem có bao nhiêu dòng chứa nó.</li>
<li>Viết lại bằng <code>RUN --mount=type=secret,id=npmrc,target=/root/.npmrc</code> và <code>--secret id=npmrc,src=…</code>; kiểm rằng <code>docker history … | grep -ci token</code> in ra <code>0</code>.</li>
<li>Tái hiện <code>sh: tsc: not found</code> bằng Dockerfile của cái bẫy NODE_ENV trên một dự án TypeScript bất kỳ, rồi sửa bằng cách dời <code>ENV NODE_ENV=production</code> xuống stage cuối.</li>
<li>Dựng ví dụ phạm vi <code>ALPINE_VERSION</code>, xác nhận giá trị rỗng, rồi thêm <code>ARG ALPINE_VERSION</code> vào stage cuối và dựng lại.</li>
<li>Dọn mọi ảnh bạn đã dựng.</li></ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được token trong lịch sử của ảnh thứ nhất (ở cả dòng <code>ARG</code> lẫn dòng <code>RUN |1</code>) và không ở đâu trong ảnh thứ hai; bản dựng TypeScript qua được khi <code>NODE_ENV=production</code> chỉ nằm ở stage cuối; và ví dụ phạm vi in <code>'3.22'</code> ở cả hai stage sau khi bạn sửa.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ARG (biến lúc dựng)</span><span class="v">Biến chỉ có trong lúc dựng; biến mất khỏi ảnh đã xong nhưng vẫn được ghi trong <code>docker history</code>.</span></div>
  <div class="kv"><span class="k">ENV (biến môi trường)</span><span class="v">Biến môi trường lưu trong cấu hình ảnh và có mặt trong mọi container.</span></div>
  <div class="kv"><span class="k">--build-arg (truyền biến lúc dựng)</span><span class="v">Đặt một <code>ARG</code> từ dòng lệnh; bị bỏ qua trong im lặng nếu không có <code>ARG</code> trùng tên.</span></div>
  <div class="kv"><span class="k">Stage (giai đoạn dựng)</span><span class="v">Phần Dockerfile từ một <code>FROM</code> tới <code>FROM</code> kế tiếp; biến phải khai báo theo từng stage.</span></div>
  <div class="kv"><span class="k">Global ARG (ARG toàn cục)</span><span class="v"><code>ARG</code> đứng trước <code>FROM</code> đầu tiên; chỉ dùng được ở dòng <code>FROM</code> trừ khi khai lại.</span></div>
  <div class="kv"><span class="k">Secret mount (gắn bí mật)</span><span class="v"><code>RUN --mount=type=secret</code>: một file chỉ có trong một <code>RUN</code> và không ghi vào tầng nào.</span></div>
  <div class="kv"><span class="k">devDependencies (thư viện lúc phát triển)</span><span class="v">Gói chỉ cần để dựng hay kiểm thử (TypeScript, bộ đóng gói); bị bỏ khi <code>NODE_ENV=production</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>ARG</code> sống trong lúc dựng, <code>ENV</code> sống trong mọi container — và cả hai đều đọc được từ ảnh.</li>
<li><code>ARG</code> toàn cục phải khai lại trong từng stage; BuildKit bỏ qua stage mà stage cuối không dùng.</li>
<li><code>ENV</code> của ảnh nền có thể che mất <code>ARG</code> rỗng của bạn (<code>node</code> đặt sẵn <code>NODE_VERSION</code>) — thử bằng tên riêng.</li>
<li>BuildKit bỏ qua một <code>--build-arg</code> gõ sai mà không nói một lời; canh giá trị quan trọng bằng <code>test -n</code>.</li>
<li>Bí mật đi qua <code>--secret</code> và <code>RUN --mount=type=secret</code>, không bao giờ qua <code>--build-arg</code> hay <code>ENV</code>.</li>
<li>Chỉ đặt <code>NODE_ENV=production</code> ở stage cuối, sau khi công cụ dựng đã chạy xong.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/build/building/variables/" target="_blank" rel="noopener">
  <span class="lc-ico">🔤</span>
  <span class="lc-body"><span class="lc-title">Biến lúc dựng — ARG và ENV</span><span class="lc-sub">Luật phạm vi, các build arg định sẵn, thứ tự ưu tiên, và lời cảnh báo tường minh rằng build arg KHÔNG phù hợp cho bí mật. Tài liệu tham chiếu cho mọi thứ trong bài này.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/secrets/" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Bí mật lúc dựng</span><span class="lc-sub"><code>RUN --mount=type=secret</code>, chuyển tiếp SSH agent cho thư viện Git riêng tư, và cách truyền bí mật từ GitHub Actions. Câu trả lời ĐÚNG mỗi khi bạn định với tay tới <code>ARG</code>.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/variables/#pre-defined-build-arguments" target="_blank" rel="noopener">
  <span class="lc-ico">🌍</span>
  <span class="lc-body"><span class="lc-title">Các build argument định sẵn</span><span class="lc-sub">Bảng <code>TARGET*</code> / <code>BUILD*</code> đầy đủ và các biến proxy. Hãy đánh dấu trang cho cái ngày bạn viết Dockerfile biên dịch chéo đầu tiên.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: lúc dựng hay lúc chạy</span><span class="lc-sub">Bài chấm điểm: đoán biến nào rỗng lúc chạy, sửa một <code>ARG</code> trống trơn bên trong một stage, moi một token bị rò ra từ history của một cái ảnh, và chữa một lượt dựng hỏng vì <code>NODE_ENV</code> đặt sớm.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> dùng <code>ARG</code> để tiêm một URL API cho frontend, rồi tự hỏi vì sao đổi nó mà trang đã dựng không đổi theo. Có HAI vấn đề riêng biệt ẩn ở đây. Thứ nhất, <code>ARG</code> biến mất lúc chạy, nên một máy chủ Next.js đọc <code>process.env.NEXT_PUBLIC_API_URL</code> sẽ chẳng thấy gì trừ khi bạn cũng đặt một <code>ENV</code>. Thứ hai, những giá trị mà bộ đóng gói NHÚNG THẲNG vào mã thì được nướng vào lúc <strong>DỰNG</strong>, nên đổi biến môi trường trên máy chủ rồi khởi động lại hoàn toàn chẳng làm gì — cái chuỗi đó đã nằm sẵn trong JavaScript rồi. Những thứ đó cần DỰNG LẠI, cho mỗi môi trường, và đáng viết sự thật đó vào một dòng chú thích cạnh cái <code>ARG</code> để người sau không mất trắng một buổi chiều vì nó.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> <code>ARG</code> chỉ tồn tại trong lúc dựng rồi biến mất; <code>ENV</code> được lưu trong ảnh và có mặt trong mọi container — và CẢ HAI đều đọc được bởi bất cứ ai có cái ảnh. Một <code>ARG</code> khai báo trước <code>FROM</code> chỉ dùng được trong các dòng <code>FROM</code> và phải được khai báo lại bên trong mỗi stage cần nó. Và đừng bao giờ truyền bí mật bằng <code>--build-arg</code>: hãy dùng <code>RUN --mount=type=secret</code>, nó không để lại gì trong tầng nào lẫn trong <code>docker history</code>.</p>
</div>
`,
    },
    /* ─────────────────────────── 4.5 ─────────────────────────── */
    {
      title: '4.5 — Recipes: Node, Next.js, Python, Go, static|||4.5 — Công thức: Node, Next.js, Python, Go, trang tĩnh',
      slug: 'dk-4-5-cong-thuc',
      type: 'LESSON',
      description: 'Năm Dockerfile hoàn chỉnh cho năm loại ứng dụng thật, mỗi cái kèm lý do cho từng quyết định — và cái quyết định riêng của từng hệ sinh thái mà nếu bỏ qua là bạn trả giá.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>Recipes: Node, Next.js, Python, Go, static</h2>
<p class="lead">Five Dockerfiles you can copy and adapt today. Each is the shape the ecosystem has converged on, with the reasoning next to each decision — and each has one trap that is specific to that language and that costs an afternoon if you meet it fresh.</p>

<h3>1 · A Node API (Express, Fastify, NestJS)</h3>
${slide('dk-04', 25, 'Công thức 1 · API Node + TypeScript — đọc từng dòng')}
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci                                  <span class="tok-comment"># WITH devDependencies — needs tsc</span>
COPY . .
RUN npm run build                           <span class="tok-comment"># → dist/</span>

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps  --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s \\
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1
CMD ["node", "dist/index.js"]</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Two dependency installs, deliberately</span><span class="v"><code>deps</code> installs production dependencies only; <code>build</code> installs everything because <code>tsc</code> lives in <code>devDependencies</code>. The final image copies only the production tree — the compiler never ships.</span></div>
  <div class="kv"><span class="k">NODE_ENV set in the final stage only</span><span class="v">Setting it earlier makes <code>npm ci</code> silently skip <code>devDependencies</code> and the build fails with <code>tsc: not found</code> (Lesson 4.4).</span></div>
  <div class="kv"><span class="k">USER node</span><span class="v">The official Node image already contains a <code>node</code> user with UID 1000. Free, and it means a container escape does not land on root (Chapter 6).</span></div>
  <div class="kv"><span class="k">The Prisma trap</span><span class="v">If you use Prisma, <code>npx prisma generate</code> must run in the stage that produces <code>node_modules</code> — the generated client is written <em>into</em> <code>node_modules/.prisma</code>. And the engine binary is platform-specific: an image built on Alpine (musl) needs <code>binaryTargets = ["linux-musl-openssl-3.0.x"]</code>, which is exactly the mismatch that took an API down for seven minutes in this project's own history.</span></div>
  <div class="kv"><span class="k">Native modules</span><span class="v"><code>sharp</code>, <code>bcrypt</code>, <code>better-sqlite3</code> compile against the platform. Install them in the same base image you ship, never copy a host <code>node_modules</code> in, and if the build needs a compiler add <code>RUN apk add --no-cache python3 make g++</code> to the build stage only.</span></div>
</div>

<h3>Built and run for real: the Node recipe</h3>
<p>Every recipe in this lesson was built and started on the course's Mac (Docker 29.8, arm64) in September 2026, and the outputs below are from those runs. The Node one used a small Express + TypeScript app (<code>src/index.ts</code> with a <code>/health</code> route listening on <code>0.0.0.0:3000</code>, <code>typescript</code> and <code>@types/*</code> in <code>devDependencies</code>):</p>
<pre><code class="language-bash">docker build --no-cache -t api:1.0 .          <span class="tok-comment"># 12.3 s from a warm base image</span>
docker images api:1.0
docker run -d --name api -p 3000:3000 api:1.0
curl -s localhost:3000/health; echo
docker exec api ps -o pid,user,args | head -2
docker ps --filter name=api --format '{{.Names}} {{.Status}}'   <span class="tok-comment"># a while later</span></code></pre>
<div class="out">IMAGE     ID             DISK USAGE   CONTENT SIZE
api:1.0   3115f0ce8d52        240MB         61.9MB
{"ok":true,"node":"v22.23.2"}
PID   USER     COMMAND
    1 node     node dist/index.js
api Up 3 hours (healthy)</div>
<p>Four things to read in that output: the image is 240MB, of which 229MB is <code>node:22-alpine</code> — the recipe added 11MB of production dependencies and compiled JavaScript, and no TypeScript; PID 1 is <code>node</code> itself (exec form), running as the <code>node</code> user, not root; and the <code>HEALTHCHECK</code> turned the status into <code>(healthy)</code> once its first check passed. The first image the old <code>ENV NODE_ENV=production</code> version of this app produced never got that far — it failed at <code>tsc: not found</code> (Lesson 4.4).</p>

<h3>2 · Next.js, with standalone output</h3>
${slide('dk-04', 26, 'Công thức 2 · Next.js với output: standalone')}
<pre><code><span class="tok-comment">// next.config.js — this line is what makes the image small</span>
module.exports = { output: 'standalone' };</code></pre>
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_URL                     <span class="tok-comment"># baked in at BUILD time — see the pitfall</span>
ENV NEXT_PUBLIC_API_URL=&#36;{NEXT_PUBLIC_API_URL}
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
WORKDIR /app
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">output: 'standalone'</span><span class="v">Next traces exactly which files from <code>node_modules</code> the server actually needs and writes a self-contained tree. Measured on Next.js 16.3.6 (course's Mac): the build stage with the full <code>node_modules</code> and <code>.next</code> is 979MB, the standalone image 328MB — of which 229MB is <code>node:22-alpine</code> itself — and the traced <code>node_modules</code> inside it is 64.5MB against 328MB on the laptop. One line of config. (An earlier version said "1.2GB into roughly 200MB"; your numbers depend on your dependencies.)</span></div>
  <div class="kv"><span class="k">HOSTNAME=0.0.0.0</span><span class="v">The generated <code>server.js</code> reads <code>const hostname = process.env.HOSTNAME || '0.0.0.0'</code> — and Docker sets <code>HOSTNAME</code> in every container to the container's ID. So without this line the server listens only on the container's own network address: <code>-p</code> from the host still works, but anything inside the container that calls <code>127.0.0.1:3000</code> — a <code>HEALTHCHECK</code>, a sidecar, a script — gets connection refused. Checked for real below. (An earlier version of this lesson said it binds to <code>localhost</code> and is unreachable from outside; the real failure is the reverse, and quieter.)</span></div>
  <div class="kv"><span class="k">static and public are copied separately</span><span class="v">The standalone output deliberately excludes them, expecting a CDN. Copy them in or every stylesheet and image 404s.</span></div>
  <div class="kv"><span class="k">NEXT_PUBLIC_* is build-time</span><span class="v">Inlined into the JavaScript bundle during <code>npm run build</code>. Changing it on the server and restarting does nothing — you need a rebuild per environment (Lesson 4.4).</span></div>
  <div class="kv"><span class="k">Anything under public/ is fixed at server start</span><span class="v">Next indexes <code>public/</code> when the process starts, so regenerating assets while it runs gives 404s for files that visibly exist. In a container this is invisible because every deploy is a new process — which is one of the quieter reasons containers make this class of bug go away.</span></div>
</div>

<h3>Built and run for real: three Next.js traps, reproduced</h3>
${slide('dk-04', 27, 'Ba cái bẫy Next.js trong container — đã thử tận tay')}
<p>A minimal App Router project on Next.js 16.3.6 (one page that prints <code>process.env.NEXT_PUBLIC_API_URL</code>, a stylesheet, and <code>public/logo.svg</code>), built with the recipe above in 68 seconds:</p>
<pre><code class="language-bash">docker build --build-arg NEXT_PUBLIC_API_URL=https://api.vidu.vn -t web:1.0 .
docker build --target build --build-arg NEXT_PUBLIC_API_URL=https://api.vidu.vn -t web:fat .
docker images web</code></pre>
<div class="out">IMAGE     ID             DISK USAGE   CONTENT SIZE
web:1.0   726c4a7dad98        328MB         85.7MB
web:fat   6b87e9a381aa        979MB          243MB</div>
<p><strong>Trap 1 — forgetting <code>HOSTNAME=0.0.0.0</code>.</strong> The same Dockerfile with only <code>PORT=3000</code> in the last <code>ENV</code>:</p>
<div class="out">$ docker logs web
▲ Next.js 16.3.6
- Local:         http://d3f8c095b712:3000
- Network:       http://d3f8c095b712:3000
$ docker exec web netstat -tln | grep 3000
tcp        0      0 172.17.0.8:3000         0.0.0.0:*               LISTEN
$ curl -s -o /dev/null -w '%{http_code}\\n' localhost:18045/        # from the Mac, through -p
200
$ docker exec web wget -qO- http://127.0.0.1:3000/
wget: can't connect to remote host (127.0.0.1): Connection refused</div>
<p>The page works from the host, so nobody notices — until a <code>HEALTHCHECK</code> that calls <code>127.0.0.1</code> marks the container unhealthy forever, and Compose never starts whatever depends on it. With the recipe's <code>HOSTNAME=0.0.0.0</code>, the log reads <code>Network: http://0.0.0.0:3000</code> and <code>netstat</code> shows <code>0.0.0.0:3000</code>.</p>
<p><strong>Trap 2 — forgetting <code>.next/static</code> and <code>public</code>.</strong> The recipe without its two extra <code>COPY</code> lines:</p>
<div class="out">trang /: 200
/_next/static/chunks/1r9pxrlejbj15.css: 404
/logo.svg: 404</div>
<p>The HTML is served, so the page "loads" — unstyled, with broken images. <code>.next/standalone</code> deliberately contains neither folder.</p>
<p><strong>Trap 3 — expecting <code>NEXT_PUBLIC_*</code> to change at run time.</strong> Built with <code>https://api.vidu.vn</code>, then run with <code>-e NEXT_PUBLIC_API_URL=https://DOI-LUC-CHAY.vn</code>:</p>
<div class="out">$ curl -s localhost:18044/ | grep -oE 'API: .{0,60}'
API: &lt;!-- --&gt;https://api.vidu.vn&lt;/p&gt;&lt;img src="/logo.svg" alt="log
…</div>
<p>The build-time value wins, even though the page is server-rendered on every request (<code>dynamic = 'force-dynamic'</code>): Next replaces <code>process.env.NEXT_PUBLIC_*</code> with a string literal at build time in server code too. One image per environment, or read a non-<code>NEXT_PUBLIC_</code> variable on the server.</p>

<h3>3 · Python (FastAPI, Django)</h3>
${slide('dk-04', 28, 'Công thức 3 · Python: slim, hai stage, PYTHONUNBUFFERED')}
<pre><code># syntax=docker/dockerfile:1
FROM python:3.12-slim AS build
ENV PIP_DISABLE_PIP_VERSION_CHECK=1 PIP_NO_CACHE_DIR=1
WORKDIR /app
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends \\
      build-essential libpq-dev \\
 &amp;&amp; rm -rf /var/lib/apt/lists/*
COPY requirements.txt ./
RUN pip install --prefix=/install -r requirements.txt

FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends libpq5 \\
 &amp;&amp; rm -rf /var/lib/apt/lists/* \\
 &amp;&amp; useradd -u 1000 -m app
WORKDIR /app
COPY --from=build /install /usr/local
COPY --chown=app:app . .
USER app
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">PYTHONUNBUFFERED=1</span><span class="v">Without it, <code>print()</code> output sits in a buffer and <code>docker logs</code> looks empty (Lesson 2.2). This is the single most important line in a Python Dockerfile.</span></div>
  <div class="kv"><span class="k">slim, not alpine</span><span class="v">Alpine uses musl, and for years Python wheels were built for glibc only — so <code>pip install</code> fell back to compiling from source, turning a 20-second install into 10 minutes. That is less true today: many popular packages now publish <code>musllinux</code> wheels (checked: <code>pip download --only-binary=:all: numpy==2.2.1 psycopg2-binary==2.9.10</code> on <code>python:3.12-alpine</code> fetched <code>…musllinux_1_2_x86_64.whl</code> files). But any package without one still compiles, and native-extension bugs on musl are rarer to find help for. <code>-slim</code> is Debian-based, only slightly larger, and every wheel works.</span></div>
  <div class="kv"><span class="k">build-essential in the build stage only</span><span class="v">Compilers are needed to build wheels and are dead weight at run time. The final stage installs only <code>libpq5</code>, the runtime library.</span></div>
  <div class="kv"><span class="k">--host 0.0.0.0</span><span class="v">Same trap as Next.js: uvicorn, Flask and Django's dev server all default to <code>127.0.0.1</code>, which is unreachable from outside the container.</span></div>
  <div class="kv"><span class="k">--no-install-recommends</span><span class="v">Debian pulls in a surprising amount of extra software without it. Always pair it with <code>rm -rf /var/lib/apt/lists/*</code> in the same <code>RUN</code> (Lesson 1.2).</span></div>
</div>

<h3>Built and run for real: the Python recipe</h3>
<p>A FastAPI app (<code>main.py</code> with a <code>/health</code> route that also reports the libpq version, plus one <code>print()</code> at start-up) and a <code>requirements.txt</code> of <code>fastapi==0.115.6</code>, <code>uvicorn==0.34.0</code> and <code>psycopg2==2.9.10</code> — the source-only package that needs a compiler, which is the whole reason for the two stages:</p>
<div class="out">#10 [build 3/5] RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends       build-essential libpq-dev  &amp;&amp; rm -rf /var/lib/apt/lists/*
#10 DONE 268.1s
#13 [build 5/5] RUN pip install --prefix=/install -r requirements.txt
#13 36.71 Successfully installed annotated-types-0.8.0 anyio-4.15.1 click-8.5.0 fastapi-0.115.6 h11-0.16.0 idna-3.20 psycopg2-2.9.10 pydantic-2.13.5 pydantic-core-2.46.5 starlette-0.41.3 typing-extensions-4.16.0 typing-inspection-0.4.4 uvicorn-0.34.0
IMAGE          ID             DISK USAGE   CONTENT SIZE
py:1.0         1a2de39ab976        232MB         50.3MB
py:build       fb582b38b387        675MB          157MB
{"ok":true,"python":"3.12.14","libpq":170011}
uid=1000(app) gid=1000(app) groups=1000(app)</div>
<p>The whole first build took 332 seconds, 268 of them downloading the compiler toolchain from Debian's mirror — which is exactly the step the cache (Chapter 5) saves you from repeating. The final image carries <code>libpq5</code> but no <code>gcc</code>: 232MB against the 675MB build stage. (Note that <code>python:3.12-slim</code> is now based on Debian 13 "trixie"; the apt package names in the recipe are unchanged.)</p>
<p>And <code>PYTHONUNBUFFERED</code>, checked by running the same image with the variable emptied (<code>-e PYTHONUNBUFFERED=</code>):</p>
<div class="out">$ docker logs py            # the recipe as written
app đang khởi động
INFO:     Started server process [1]
…
$ docker logs py2           # PYTHONUNBUFFERED emptied
INFO:     Started server process [1]
…</div>
<p>The <code>print()</code> line is simply missing in the second container — it is sitting in stdout's buffer, while uvicorn's own log lines (written to stderr) still appear. That half-working state is what makes the bug so confusing.</p>

<h3>4 · Go (or Rust) — a static binary</h3>
${slide('dk-04', 29, 'Công thức 4 &amp; 5 · Go 13,6 MB và trang tĩnh sau nginx')}
<pre><code># syntax=docker/dockerfile:1
FROM --platform=\$BUILDPLATFORM golang:1.23-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
ARG TARGETOS TARGETARCH
RUN CGO_ENABLED=0 GOOS=\$TARGETOS GOARCH=\$TARGETARCH \\
    go build -ldflags="-s -w" -o /out/server ./cmd/server

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/server /server
EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/server"]</code></pre>
<pre><code>docker images --format '{{.Repository}}:{{.Tag}} {{.Size}}' | head -2</code></pre>
<div class="out">IMAGE                ID             DISK USAGE   CONTENT SIZE
goapp:1.0            7b41a95d4f74       13.6MB         2.93MB
golang:1.23-alpine   383395b794df        365MB         75.4MB</div>
<p class="note-ct">Real output on the course's Mac (arm64), for a small <code>chi</code> router app built in 11 seconds; an earlier version of this lesson showed 12.4MB and 265MB. <code>curl localhost:8080/health</code> answered <code>{"arch":"arm64","go":"go1.23.12","ok":true}</code>, <code>docker inspect</code> reported <code>User: nonroot:nonroot</code>, and <code>docker exec goapp sh</code> failed with <code>exec: "sh": executable file not found in &#36;PATH</code> — there is no shell to break into. Two more measurements: the same program built without <code>-ldflags="-s -w"</code> is 7,713,557 bytes, with it 5,243,032 (32% smaller); and <code>docker build --platform linux/amd64</code> produced an amd64 image in 7 seconds on the arm64 Mac, because the compiler ran natively and only the output targeted amd64.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">CGO_ENABLED=0</span><span class="v">Produces a truly static binary with no libc dependency, which is what makes <code>distroless/static</code> or even <code>FROM scratch</code> possible. Leave CGO on and the binary needs glibc and will not start.</span></div>
  <div class="kv"><span class="k">-ldflags="-s -w"</span><span class="v">Strips the symbol table and DWARF debug info — typically 25–30% off the binary for no functional change.</span></div>
  <div class="kv"><span class="k">FROM --platform=\$BUILDPLATFORM</span><span class="v">Compile natively and cross-compile to the target, rather than emulating the whole toolchain. Minutes versus tens of minutes (Lesson 3.4).</span></div>
  <div class="kv"><span class="k">distroless:nonroot</span><span class="v">No shell, no package manager, and it already runs as UID 65532. Debug it with the sidecar technique from Lesson 2.3 — and if you need TLS, use <code>distroless/static</code>, which includes CA certificates, not <code>scratch</code>, which does not.</span></div>
  <div class="kv"><span class="k">13.6MB total</span><span class="v">Measured: 13.6MB on disk, 2.93MB to download — twenty-seven times smaller than the 365MB toolchain image it was built with (an earlier version said 12MB and 265MB). This is the clearest demonstration of why multi-stage exists, and Chapter 6 generalises it.</span></div>
</div>

<h3>5 · A static site behind nginx</h3>
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build                           <span class="tok-comment"># → dist/</span>

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s CMD wget -qO- http://127.0.0.1/ &gt;/dev/null || exit 1</code></pre>
<pre><code><span class="tok-comment"># nginx.conf — the SPA fallback everyone forgets</span>
server {
  listen 80;
  root /usr/share/nginx/html;
  location / { try_files \$uri \$uri/ /index.html; }
  location ~* \\.(js|css|png|jpg|svg|woff2)\$ {
    expires 1y; add_header Cache-Control "public, immutable";
  }
}</code></pre>
<div class="callout ok"><strong>No <code>CMD</code> in that last stage, and that is correct.</strong> The <code>nginx</code> base image already sets an <code>ENTRYPOINT</code> and <code>CMD</code> that work, so overriding them adds nothing. Inheriting the base image's start-up configuration is normal — check with <code>docker image inspect nginx:1.27-alpine --format '{{.Config.Entrypoint}} {{.Config.Cmd}}'</code> before writing your own.</div>

<h3>Built and run for real: the static site</h3>
<p>A Vite project (an <code>index.html</code>, one module and one stylesheet) with the <code>nginx.conf</code> above, built in 11 seconds:</p>
<pre><code class="language-bash">docker images site:1.0
curl -s -o /dev/null -w '/ : %{http_code}\\n' localhost:8080/
curl -s -o /dev/null -w '/dang-nhap : %{http_code}\\n' localhost:8080/dang-nhap
curl -sI localhost:8080/assets/index-AxA_Pi8B.js | grep -iE 'cache-control|expires'</code></pre>
<div class="out">IMAGE      ID             DISK USAGE   CONTENT SIZE
site:1.0   d92fae016871         76MB         21.8MB
/ : 200
/dang-nhap : 200
Expires: Thu, 23 Sep 2027 15:05:08 GMT
Cache-Control: max-age=31536000
Cache-Control: public, immutable</div>
<p><code>/dang-nhap</code> is not a file — it returns 200 because <code>try_files … /index.html</code> hands every unknown path to the single-page app, whose router then shows the right screen. The hashed asset gets a one-year cache, which is safe precisely because its name changes whenever its content does. And the container reported <code>(healthy)</code> without any <code>CMD</code> of our own: the base image's <code>/docker-entrypoint.sh</code> and <code>nginx -g daemon off;</code> did the work.</p>
<table>
<tr><th>Recipe</th><th>Final image (DISK USAGE)</th><th>Build stage / toolchain</th><th>First build</th><th>Runs as</th></tr>
<tr><td>Node API + TypeScript</td><td>240MB</td><td>—</td><td>12 s</td><td><code>node</code> (1000)</td></tr>
<tr><td>Next.js standalone</td><td>328MB</td><td>979MB</td><td>68 s</td><td><code>node</code> (1000)</td></tr>
<tr><td>Python FastAPI</td><td>232MB</td><td>675MB</td><td>332 s</td><td><code>app</code> (1000)</td></tr>
<tr><td>Go + distroless</td><td>13.6MB</td><td>365MB</td><td>11 s</td><td><code>nonroot</code> (65532)</td></tr>
<tr><td>Static site + nginx</td><td>76MB</td><td>—</td><td>11 s</td><td>nginx workers as <code>nginx</code></td></tr>
</table>

<h3>What all five have in common</h3>
${slide('dk-04', 24, '5 công thức dựng thật: ảnh cuối nhẹ hơn stage dựng 3–27 lần')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Dependencies before source</span><span class="lz-t">COPY package.json → install → COPY .</span><span class="lz-d">The single most valuable ordering decision. Chapter 5 measures exactly what it saves.</span></div>
  <div class="lz-step"><span class="lz-k">Build tools stay in the build stage</span><span class="lz-t">compilers, dev dependencies, source</span><span class="lz-d">Nothing that only the build needed appears in the final image. Chapter 6 pushes this further.</span></div>
  <div class="lz-step"><span class="lz-k">Bind to 0.0.0.0</span><span class="lz-t">not 127.0.0.1</span><span class="lz-d">Several servers default to loopback (uvicorn, Vite, Flask's dev server), and Next.js in a container binds to the container's hostname unless told otherwise — each unreachable from somewhere. It is the most common "the container runs but I cannot connect" cause.</span></div>
  <div class="lz-step"><span class="lz-k">A non-root USER, late</span><span class="lz-t">after the RUNs that need root</span><span class="lz-d">Free in every ecosystem, and it is the cheapest security improvement available.</span></div>
  <div class="lz-step"><span class="lz-k">Exec-form CMD, and a healthcheck</span><span class="lz-t">["node","dist/index.js"]</span><span class="lz-d">Stops cleanly in milliseconds, and Compose can wait for it to be ready (Chapters 1.3 and 9).</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your SWP391 team has a Next.js frontend and an Express API, and the demo in front of the review board is next week. The images must be small, run as non-root, and pass their healthchecks on the first try. Containerise the frontend with recipe 2 and prove each trap is closed.</p><ol>
<li>In <code>~/thu-docker/web</code>, create a Next.js app (<code>npx create-next-app@latest</code>, or any existing one), add <code>output: 'standalone'</code> to <code>next.config</code>, and write the <code>.dockerignore</code> from Lesson 4.1.</li>
<li>Build it with recipe 2 and <code>--build-arg NEXT_PUBLIC_API_URL=https://api.example.com</code>; also build <code>--target build</code> and compare the two sizes in <code>docker images</code>.</li>
<li>Run it with <code>-p 3000:3000</code> and check all three traps: <code>docker exec … wget -qO- http://127.0.0.1:3000/ &gt;/dev/null &amp;&amp; echo ok</code>, one <code>/_next/static/…css</code> URL and one file from <code>public/</code> return 200, and the page shows the build-time API URL.</li>
<li>Add a <code>HEALTHCHECK</code> like recipe 1's (calling <code>127.0.0.1:3000/</code>), rebuild, and wait for <code>(healthy)</code> in <code>docker ps</code>. Then remove <code>HOSTNAME=0.0.0.0</code>, rebuild, and watch it turn <code>(unhealthy)</code>.</li>
<li>Put <code>HOSTNAME=0.0.0.0</code> back, and clean up the containers and the extra images.</li></ol>
<p><strong>Done when:</strong> the standalone image is less than half the size of the build stage; <code>docker exec … id</code> prints <code>uid=1000(node)</code>; the container is <code>(healthy)</code> with <code>HOSTNAME=0.0.0.0</code> and <code>(unhealthy)</code> without it; and you can explain which of the three traps each check proved closed.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Multi-stage build</span><span class="v">Several <code>FROM</code> stages in one Dockerfile; only what you copy into the last one ships.</span></div>
  <div class="kv"><span class="k">Standalone output</span><span class="v">Next.js's traced, self-contained server folder: <code>server.js</code> plus only the <code>node_modules</code> it uses.</span></div>
  <div class="kv"><span class="k">Distroless</span><span class="v">Base images with no shell or package manager, only what a program needs to run.</span></div>
  <div class="kv"><span class="k">Static binary</span><span class="v">A program with no dependency on a system C library (<code>CGO_ENABLED=0</code> in Go).</span></div>
  <div class="kv"><span class="k">Wheel</span><span class="v">A prebuilt Python package; <code>manylinux</code> wheels are for glibc, <code>musllinux</code> for Alpine.</span></div>
  <div class="kv"><span class="k">SPA fallback</span><span class="v">Serving <code>index.html</code> for unknown paths so a single-page app's router can handle them.</span></div>
  <div class="kv"><span class="k">Bind address</span><span class="v">The IP a server listens on; <code>0.0.0.0</code> means every interface, <code>127.0.0.1</code> only the container itself.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Every recipe installs dependencies before copying source and keeps build tools out of the final stage.</li>
<li>Measured: final images from 13.6MB (Go) to 328MB (Next.js), 3 to 27 times smaller than what built them.</li>
<li>Next.js needs <code>output: 'standalone'</code>, <code>HOSTNAME=0.0.0.0</code>, and its <code>.next/static</code> and <code>public</code> copied in.</li>
<li><code>NEXT_PUBLIC_*</code> is frozen at build time — one image per environment.</li>
<li>Python: <code>slim</code>, two stages for compiled packages, and <code>PYTHONUNBUFFERED=1</code> or your prints vanish.</li>
<li>Go: <code>CGO_ENABLED=0</code>, build on <code>$BUILDPLATFORM</code>, ship on distroless as a non-root user.</li>
</ul>

<a class="link-card" href="https://github.com/docker/awesome-compose" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">awesome-compose</span><span class="lc-sub">Docker's official collection of working stacks — React+Node+Mongo, Django+Postgres, Go+nginx and dozens more. Real Dockerfiles and Compose files you can read and adapt.</span></span>
</a>
<a class="link-card" href="https://nextjs.org/docs/app/building-your-application/deploying#docker-image" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Next.js — deploying with Docker</span><span class="lc-sub">The official <code>output: 'standalone'</code> Dockerfile, kept current with each release. Start from theirs rather than a blog post from two majors ago.</span></span>
</a>
<a class="link-card" href="https://github.com/GoogleContainerTools/distroless" target="_blank" rel="noopener">
  <span class="lc-ico">🪶</span>
  <span class="lc-body"><span class="lc-title">distroless base images</span><span class="lc-sub">The variants (static, base, cc, nodejs, python), what each includes, and the <code>:debug</code> tags that add a busybox shell for when you need one.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: write the five</span><span class="lc-sub">Graded exercises: containerise a Node API, fix a Next.js image that 404s its own CSS, diagnose a Python container with empty logs, and get a Go binary into an image under 15MB.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> a server bound to <code>127.0.0.1</code> inside the container. <code>docker run -p 3000:3000</code> succeeds, <code>docker ps</code> shows the port mapped, the logs say "listening on 127.0.0.1:3000" — and <code>curl localhost:3000</code> from the host gets connection refused. Inside the container, <code>127.0.0.1</code> is the container's own loopback and nothing outside its network namespace can reach it (Lesson 1.1). The fix is per-framework and always the same idea: <code>HOSTNAME=0.0.0.0</code> for Next.js, <code>--host 0.0.0.0</code> for uvicorn and Vite, <code>app.listen(3000, '0.0.0.0')</code> for Express, <code>0.0.0.0:8080</code> for Go. Confirm with <code>docker exec c netstat -tln</code>, or check the Address column in <code>ss -tlnp</code> from a sidecar.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Every recipe here installs dependencies before copying source, and keeps compilers and dev dependencies out of the final stage — those two habits carry across every language. Bind to <code>0.0.0.0</code>, not <code>127.0.0.1</code>: a server that listens on the wrong address produces a container that runs perfectly and answers nobody — or answers the host and not its own healthcheck, as Next.js did above. And each ecosystem has one specific trap — Prisma's engine target, Next's <code>HOSTNAME</code>, Python's buffering and musl wheels, Go's <code>CGO_ENABLED</code> — worth checking before you spend an afternoon on it.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Công thức: Node, Next.js, Python, Go, trang tĩnh</h2>
<p class="lead">Năm Dockerfile bạn chép về và chỉnh lại được ngay hôm nay. Mỗi cái là hình hài mà hệ sinh thái đó đã hội tụ về, với phần lý lẽ đặt ngay cạnh từng quyết định — và mỗi cái có một cái bẫy riêng của ngôn ngữ ấy, thứ ngốn của bạn một buổi chiều nếu gặp lần đầu.</p>

<h3>1 · Một API Node (Express, Fastify, NestJS)</h3>
${slide('dk-04', 25, 'Công thức 1 · API Node + TypeScript — đọc từng dòng')}
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci                                  <span class="tok-comment"># CÓ devDependencies — cần tsc</span>
COPY . .
RUN npm run build                           <span class="tok-comment"># → dist/</span>

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps  --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s \\
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1
CMD ["node", "dist/index.js"]</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Hai lượt cài thư viện, một cách CÓ CHỦ Ý</span><span class="v"><code>deps</code> chỉ cài thư viện production; <code>build</code> cài tất cả vì <code>tsc</code> nằm trong <code>devDependencies</code>. Ảnh cuối chỉ chép cây production sang — trình biên dịch không bao giờ đi theo.</span></div>
  <div class="kv"><span class="k">NODE_ENV chỉ đặt ở stage CUỐI</span><span class="v">Đặt sớm hơn thì <code>npm ci</code> âm thầm bỏ qua <code>devDependencies</code> và lượt dựng hỏng với <code>tsc: not found</code> (Bài 4.4).</span></div>
  <div class="kv"><span class="k">USER node</span><span class="v">Ảnh Node chính thức đã có sẵn một người dùng <code>node</code> với UID 1000. Miễn phí, và nó nghĩa là một cú thoát container không đáp xuống quyền root (Chương 6).</span></div>
  <div class="kv"><span class="k">Cái bẫy Prisma</span><span class="v">Nếu bạn dùng Prisma thì <code>npx prisma generate</code> PHẢI chạy trong cái stage tạo ra <code>node_modules</code> — client được sinh ra ghi THẲNG vào <code>node_modules/.prisma</code>. Và engine thì gắn với nền tảng: một ảnh dựng trên Alpine (musl) cần <code>binaryTargets = ["linux-musl-openssl-3.0.x"]</code>, và đó chính là cái lệch đã làm một API chết bảy phút trong lịch sử của chính dự án này.</span></div>
  <div class="kv"><span class="k">Mô-đun native</span><span class="v"><code>sharp</code>, <code>bcrypt</code>, <code>better-sqlite3</code> biên dịch theo nền tảng. Hãy cài chúng trong ĐÚNG cái ảnh nền bạn đem đi, đừng bao giờ chép một <code>node_modules</code> của máy chủ vào, và nếu lượt dựng cần trình biên dịch thì thêm <code>RUN apk add --no-cache python3 make g++</code> vào RIÊNG stage dựng.</span></div>
</div>

<h3>Dựng và chạy thật: công thức Node</h3>
<p>Mọi công thức trong bài này đều được dựng và khởi chạy trên máy Mac của khoá (Docker 29.8, arm64) tháng 9/2026, và output bên dưới là của những lượt chạy đó. Công thức Node dùng một app Express + TypeScript nhỏ (<code>src/index.ts</code> có route <code>/health</code>, nghe ở <code>0.0.0.0:3000</code>, <code>typescript</code> và <code>@types/*</code> nằm trong <code>devDependencies</code>):</p>
<pre><code class="language-bash">docker build --no-cache -t api:1.0 .          <span class="tok-comment"># 12,3 s khi ảnh nền đã có sẵn</span>
docker images api:1.0
docker run -d --name api -p 3000:3000 api:1.0
curl -s localhost:3000/health; echo
docker exec api ps -o pid,user,args | head -2
docker ps --filter name=api --format '{{.Names}} {{.Status}}'   <span class="tok-comment"># một lúc sau</span></code></pre>
<div class="out">IMAGE     ID             DISK USAGE   CONTENT SIZE
api:1.0   3115f0ce8d52        240MB         61.9MB
{"ok":true,"node":"v22.23.2"}
PID   USER     COMMAND
    1 node     node dist/index.js
api Up 3 hours (healthy)</div>
<p>Bốn điều cần đọc trong output đó: ảnh nặng 240MB, trong đó 229MB là <code>node:22-alpine</code> — công thức chỉ thêm 11MB thư viện chạy và JavaScript đã biên dịch, không có TypeScript; PID 1 là chính <code>node</code> (dạng exec), chạy bằng user <code>node</code> chứ không phải root; và <code>HEALTHCHECK</code> đổi trạng thái thành <code>(healthy)</code> khi lượt kiểm đầu tiên qua. Cái ảnh mà phiên bản cũ đặt <code>ENV NODE_ENV=production</code> sớm của app này sinh ra thì chưa bao giờ đi tới đó — nó hỏng ở <code>tsc: not found</code> (Bài 4.4).</p>

<h3>2 · Next.js, với output standalone</h3>
${slide('dk-04', 26, 'Công thức 2 · Next.js với output: standalone')}
<pre><code><span class="tok-comment">// next.config.js — dòng này mới là thứ làm cái ảnh nhỏ đi</span>
module.exports = { output: 'standalone' };</code></pre>
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_URL                     <span class="tok-comment"># nướng vào lúc DỰNG — xem phần bẫy</span>
ENV NEXT_PUBLIC_API_URL=&#36;{NEXT_PUBLIC_API_URL}
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
WORKDIR /app
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">output: 'standalone'</span><span class="v">Next lần theo chính xác những file nào trong <code>node_modules</code> mà máy chủ thật sự cần rồi ghi ra một cây khép kín. Đo trên Next.js 16.3.6 (máy Mac của khoá): stage dựng với đủ <code>node_modules</code> và <code>.next</code> nặng 979MB, ảnh standalone 328MB — trong đó 229MB là chính <code>node:22-alpine</code> — và <code>node_modules</code> đã tỉa bên trong chỉ còn 64.5MB so với 328MB trên laptop. MỘT dòng cấu hình. (Bản cũ ghi "1,2GB thành khoảng 200MB"; con số của bạn tuỳ thư viện bạn dùng.)</span></div>
  <div class="kv"><span class="k">HOSTNAME=0.0.0.0</span><span class="v">File <code>server.js</code> được sinh ra đọc <code>const hostname = process.env.HOSTNAME || '0.0.0.0'</code> — mà Docker lại đặt <code>HOSTNAME</code> trong MỌI container bằng ID của container. Nên thiếu dòng này thì máy chủ chỉ nghe trên địa chỉ mạng riêng của container: <code>-p</code> từ máy chủ vẫn chạy, nhưng bất cứ thứ gì BÊN TRONG container gọi <code>127.0.0.1:3000</code> — một <code>HEALTHCHECK</code>, một container phụ, một script — đều nhận connection refused. Kiểm thật ở bên dưới. (Bản cũ của bài nói nó gắn vào <code>localhost</code> và không vào được từ ngoài; lỗi thật thì NGƯỢC lại, và âm thầm hơn.)</span></div>
  <div class="kv"><span class="k">static và public được chép RIÊNG</span><span class="v">Output standalone cố ý loại chúng ra, vì nó cho rằng bạn dùng CDN. Không chép vào thì mọi stylesheet và hình ảnh đều 404.</span></div>
  <div class="kv"><span class="k">NEXT_PUBLIC_* là lúc DỰNG</span><span class="v">Được nhúng thẳng vào gói JavaScript trong lúc <code>npm run build</code>. Đổi nó trên máy chủ rồi khởi động lại thì chẳng làm gì cả — bạn cần DỰNG LẠI cho mỗi môi trường (Bài 4.4).</span></div>
  <div class="kv"><span class="k">Mọi thứ dưới public/ bị chốt lúc server khởi động</span><span class="v">Next đánh chỉ mục <code>public/</code> khi tiến trình khởi động, nên sinh lại tài nguyên trong lúc nó đang chạy sẽ cho 404 với những file nằm sờ sờ ở đó. Trong container thì chuyện này vô hình vì mọi lần deploy là một tiến trình mới — và đó là một trong những lý do ít ai nhắc tới về việc container làm lớp bọ này biến mất.</span></div>
</div>

<h3>Dựng và chạy thật: ba cái bẫy Next.js, tái hiện tận tay</h3>
${slide('dk-04', 27, 'Ba cái bẫy Next.js trong container — đã thử tận tay')}
<p>Một dự án App Router tối giản trên Next.js 16.3.6 (một trang in ra <code>process.env.NEXT_PUBLIC_API_URL</code>, một file CSS, và <code>public/logo.svg</code>), dựng bằng công thức ở trên trong 68 giây:</p>
<pre><code class="language-bash">docker build --build-arg NEXT_PUBLIC_API_URL=https://api.vidu.vn -t web:1.0 .
docker build --target build --build-arg NEXT_PUBLIC_API_URL=https://api.vidu.vn -t web:fat .
docker images web</code></pre>
<div class="out">IMAGE     ID             DISK USAGE   CONTENT SIZE
web:1.0   726c4a7dad98        328MB         85.7MB
web:fat   6b87e9a381aa        979MB          243MB</div>
<p><strong>Bẫy 1 — quên <code>HOSTNAME=0.0.0.0</code>.</strong> Cùng Dockerfile đó nhưng dòng <code>ENV</code> cuối chỉ có <code>PORT=3000</code>:</p>
<div class="out">$ docker logs web
▲ Next.js 16.3.6
- Local:         http://d3f8c095b712:3000
- Network:       http://d3f8c095b712:3000
$ docker exec web netstat -tln | grep 3000
tcp        0      0 172.17.0.8:3000         0.0.0.0:*               LISTEN
$ curl -s -o /dev/null -w '%{http_code}\\n' localhost:18045/        # từ máy Mac, qua -p
200
$ docker exec web wget -qO- http://127.0.0.1:3000/
wget: can't connect to remote host (127.0.0.1): Connection refused</div>
<p>Trang vẫn mở được từ máy chủ, nên chẳng ai để ý — cho tới khi một <code>HEALTHCHECK</code> gọi <code>127.0.0.1</code> đánh dấu container "unhealthy" mãi mãi, và Compose không bao giờ khởi động thứ phụ thuộc vào nó. Với <code>HOSTNAME=0.0.0.0</code> của công thức, log ghi <code>Network: http://0.0.0.0:3000</code> và <code>netstat</code> hiện <code>0.0.0.0:3000</code>.</p>
<p><strong>Bẫy 2 — quên <code>.next/static</code> và <code>public</code>.</strong> Công thức bỏ đi hai dòng <code>COPY</code> phụ:</p>
<div class="out">trang /: 200
/_next/static/chunks/1r9pxrlejbj15.css: 404
/logo.svg: 404</div>
<p>HTML vẫn được trả về nên trang "có lên" — nhưng trơn tuột, ảnh vỡ hết. <code>.next/standalone</code> cố ý không chứa hai thư mục đó.</p>
<p><strong>Bẫy 3 — tưởng <code>NEXT_PUBLIC_*</code> đổi được lúc chạy.</strong> Dựng với <code>https://api.vidu.vn</code>, rồi chạy với <code>-e NEXT_PUBLIC_API_URL=https://DOI-LUC-CHAY.vn</code>:</p>
<div class="out">$ curl -s localhost:18044/ | grep -oE 'API: .{0,60}'
API: &lt;!-- --&gt;https://api.vidu.vn&lt;/p&gt;&lt;img src="/logo.svg" alt="log
…</div>
<p>Giá trị lúc dựng thắng, dù trang được dựng ở máy chủ cho MỌI request (<code>dynamic = 'force-dynamic'</code>): Next thay <code>process.env.NEXT_PUBLIC_*</code> bằng một chuỗi cố định ngay lúc dựng, cả trong mã phía máy chủ. Mỗi môi trường một ảnh, hoặc đọc một biến KHÔNG có tiền tố <code>NEXT_PUBLIC_</code> ở phía máy chủ.</p>

<h3>3 · Python (FastAPI, Django)</h3>
${slide('dk-04', 28, 'Công thức 3 · Python: slim, hai stage, PYTHONUNBUFFERED')}
<pre><code># syntax=docker/dockerfile:1
FROM python:3.12-slim AS build
ENV PIP_DISABLE_PIP_VERSION_CHECK=1 PIP_NO_CACHE_DIR=1
WORKDIR /app
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends \\
      build-essential libpq-dev \\
 &amp;&amp; rm -rf /var/lib/apt/lists/*
COPY requirements.txt ./
RUN pip install --prefix=/install -r requirements.txt

FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends libpq5 \\
 &amp;&amp; rm -rf /var/lib/apt/lists/* \\
 &amp;&amp; useradd -u 1000 -m app
WORKDIR /app
COPY --from=build /install /usr/local
COPY --chown=app:app . .
USER app
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">PYTHONUNBUFFERED=1</span><span class="v">Không có nó thì output của <code>print()</code> nằm im trong bộ đệm và <code>docker logs</code> trông như rỗng (Bài 2.2). Đây là dòng quan trọng nhất trong một Dockerfile Python.</span></div>
  <div class="kv"><span class="k">slim, đừng alpine</span><span class="v">Alpine dùng musl, và nhiều năm liền wheel của Python chỉ được dựng cho glibc — nên <code>pip install</code> lùi về biên dịch từ mã nguồn, biến một lượt cài 20 giây thành 10 phút. Ngày nay chuyện đó bớt đúng: nhiều gói phổ biến đã phát hành wheel <code>musllinux</code> (đã kiểm: <code>pip download --only-binary=:all: numpy==2.2.1 psycopg2-binary==2.9.10</code> trên <code>python:3.12-alpine</code> tải về các file <code>…musllinux_1_2_x86_64.whl</code>). Nhưng gói nào chưa có thì vẫn phải biên dịch, và lỗi phần mở rộng native trên musl thì khó tìm người giúp hơn. <code>-slim</code> dựa trên Debian, chỉ lớn hơn một chút, và wheel nào cũng chạy.</span></div>
  <div class="kv"><span class="k">build-essential CHỈ ở stage dựng</span><span class="v">Trình biên dịch cần để dựng wheel và là gánh nặng chết ở lúc chạy. Stage cuối chỉ cài <code>libpq5</code>, tức thư viện lúc chạy.</span></div>
  <div class="kv"><span class="k">--host 0.0.0.0</span><span class="v">Vẫn cái bẫy của Next.js: uvicorn, Flask và máy chủ dev của Django đều mặc định <code>127.0.0.1</code>, chỗ không với tới được từ bên ngoài container.</span></div>
  <div class="kv"><span class="k">--no-install-recommends</span><span class="v">Debian kéo về một lượng phần mềm phụ đáng ngạc nhiên nếu không có nó. Hãy luôn ghép nó với <code>rm -rf /var/lib/apt/lists/*</code> trong CÙNG một <code>RUN</code> (Bài 1.2).</span></div>
</div>

<h3>Dựng và chạy thật: công thức Python</h3>
<p>Một app FastAPI (<code>main.py</code> có route <code>/health</code> báo luôn phiên bản libpq, cộng một lệnh <code>print()</code> lúc khởi động) và một <code>requirements.txt</code> gồm <code>fastapi==0.115.6</code>, <code>uvicorn==0.34.0</code> và <code>psycopg2==2.9.10</code> — gói chỉ phát hành mã nguồn, cần trình biên dịch, và đó là toàn bộ lý do có hai stage:</p>
<div class="out">#10 [build 3/5] RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends       build-essential libpq-dev  &amp;&amp; rm -rf /var/lib/apt/lists/*
#10 DONE 268.1s
#13 [build 5/5] RUN pip install --prefix=/install -r requirements.txt
#13 36.71 Successfully installed annotated-types-0.8.0 anyio-4.15.1 click-8.5.0 fastapi-0.115.6 h11-0.16.0 idna-3.20 psycopg2-2.9.10 pydantic-2.13.5 pydantic-core-2.46.5 starlette-0.41.3 typing-extensions-4.16.0 typing-inspection-0.4.4 uvicorn-0.34.0
IMAGE          ID             DISK USAGE   CONTENT SIZE
py:1.0         1a2de39ab976        232MB         50.3MB
py:build       fb582b38b387        675MB          157MB
{"ok":true,"python":"3.12.14","libpq":170011}
uid=1000(app) gid=1000(app) groups=1000(app)</div>
<p>Lượt dựng đầu mất tổng cộng 332 giây, 268 giây trong đó là tải bộ công cụ biên dịch từ máy chủ gói của Debian — đúng cái bước mà cache (Chương 5) giúp bạn khỏi phải lặp lại. Ảnh cuối mang <code>libpq5</code> nhưng không có <code>gcc</code>: 232MB so với 675MB của stage dựng. (Để ý là <code>python:3.12-slim</code> giờ dựa trên Debian 13 "trixie"; tên gói apt trong công thức không đổi.)</p>
<p>Còn <code>PYTHONUNBUFFERED</code> thì kiểm bằng cách chạy cùng ảnh đó với biến bị làm rỗng (<code>-e PYTHONUNBUFFERED=</code>):</p>
<div class="out">$ docker logs py            # công thức như đã viết
app đang khởi động
INFO:     Started server process [1]
…
$ docker logs py2           # PYTHONUNBUFFERED bị làm rỗng
INFO:     Started server process [1]
…</div>
<p>Dòng <code>print()</code> đơn giản là BIẾN MẤT ở container thứ hai — nó đang nằm trong bộ đệm của stdout, trong khi các dòng log của chính uvicorn (ghi ra stderr) vẫn hiện. Chính trạng thái chạy-được-một-nửa đó làm lỗi này khó hiểu tới vậy.</p>

<h3>4 · Go (hoặc Rust) — một chương trình tĩnh</h3>
${slide('dk-04', 29, 'Công thức 4 &amp; 5 · Go 13,6 MB và trang tĩnh sau nginx')}
<pre><code># syntax=docker/dockerfile:1
FROM --platform=\$BUILDPLATFORM golang:1.23-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
ARG TARGETOS TARGETARCH
RUN CGO_ENABLED=0 GOOS=\$TARGETOS GOARCH=\$TARGETARCH \\
    go build -ldflags="-s -w" -o /out/server ./cmd/server

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/server /server
EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/server"]</code></pre>
<pre><code>docker images --format '{{.Repository}}:{{.Tag}} {{.Size}}' | head -2</code></pre>
<div class="out">IMAGE                ID             DISK USAGE   CONTENT SIZE
goapp:1.0            7b41a95d4f74       13.6MB         2.93MB
golang:1.23-alpine   383395b794df        365MB         75.4MB</div>
<p class="note-ct">Output thật trên máy Mac của khoá (arm64), cho một app nhỏ dùng router <code>chi</code>, dựng trong 11 giây; bản cũ của bài ghi 12.4MB và 265MB. <code>curl localhost:8080/health</code> trả <code>{"arch":"arm64","go":"go1.23.12","ok":true}</code>, <code>docker inspect</code> báo <code>User: nonroot:nonroot</code>, và <code>docker exec goapp sh</code> hỏng với <code>exec: "sh": executable file not found in &#36;PATH</code> — không có shell nào để đột nhập. Thêm hai phép đo: cùng chương trình dựng không có <code>-ldflags="-s -w"</code> nặng 7.713.557 byte, có nó thì 5.243.032 (nhỏ hơn 32%); và <code>docker build --platform linux/amd64</code> ra ảnh amd64 trong 7 giây trên máy Mac arm64, vì trình biên dịch chạy tự nhiên và chỉ có đầu ra là nhắm tới amd64.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">CGO_ENABLED=0</span><span class="v">Tạo ra một chương trình TĨNH thật sự, không phụ thuộc libc, và đó là thứ khiến <code>distroless/static</code> hay thậm chí <code>FROM scratch</code> khả thi. Để CGO bật thì chương trình cần glibc và sẽ không khởi động được.</span></div>
  <div class="kv"><span class="k">-ldflags="-s -w"</span><span class="v">Cắt bảng ký hiệu và thông tin gỡ lỗi DWARF — thường bớt 25–30% kích thước chương trình mà không đổi chức năng gì.</span></div>
  <div class="kv"><span class="k">FROM --platform=\$BUILDPLATFORM</span><span class="v">Biên dịch NATIVE rồi biên dịch chéo sang đích, thay vì mô phỏng cả bộ công cụ. Vài phút so với vài chục phút (Bài 3.4).</span></div>
  <div class="kv"><span class="k">distroless:nonroot</span><span class="v">Không shell, không trình quản lý gói, và nó đã chạy sẵn dưới UID 65532. Hãy gỡ lỗi nó bằng kỹ thuật container phụ ở Bài 2.3 — và nếu bạn cần TLS thì dùng <code>distroless/static</code>, cái này có sẵn chứng chỉ CA, chứ đừng dùng <code>scratch</code>, cái đó thì không.</span></div>
  <div class="kv"><span class="k">Tổng cộng 13.6MB</span><span class="v">Đo thật: 13.6MB trên đĩa, 2.93MB khi tải — nhỏ hơn hai mươi bảy lần cái ảnh bộ công cụ 365MB đã dựng ra nó (bản cũ ghi 12MB và 265MB). Đây là minh hoạ rõ ràng nhất cho lý do dựng nhiều tầng tồn tại, và Chương 6 tổng quát hoá nó.</span></div>
</div>

<h3>5 · Một trang tĩnh sau nginx</h3>
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build                           <span class="tok-comment"># → dist/</span>

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s CMD wget -qO- http://127.0.0.1/ &gt;/dev/null || exit 1</code></pre>
<pre><code><span class="tok-comment"># nginx.conf — cái fallback cho SPA mà ai cũng quên</span>
server {
  listen 80;
  root /usr/share/nginx/html;
  location / { try_files \$uri \$uri/ /index.html; }
  location ~* \\.(js|css|png|jpg|svg|woff2)\$ {
    expires 1y; add_header Cache-Control "public, immutable";
  }
}</code></pre>
<div class="callout ok"><strong>Không có <code>CMD</code> nào trong cái stage cuối đó, và như thế là ĐÚNG.</strong> Ảnh nền <code>nginx</code> đã đặt sẵn một <code>ENTRYPOINT</code> và <code>CMD</code> chạy tốt, nên ghi đè chúng chẳng thêm được gì. Thừa hưởng cấu hình khởi động của ảnh nền là chuyện bình thường — hãy kiểm bằng <code>docker image inspect nginx:1.27-alpine --format '{{.Config.Entrypoint}} {{.Config.Cmd}}'</code> trước khi tự viết cái của mình.</div>

<h3>Dựng và chạy thật: trang tĩnh</h3>
<p>Một dự án Vite (một <code>index.html</code>, một module và một file CSS) với <code>nginx.conf</code> ở trên, dựng trong 11 giây:</p>
<pre><code class="language-bash">docker images site:1.0
curl -s -o /dev/null -w '/ : %{http_code}\\n' localhost:8080/
curl -s -o /dev/null -w '/dang-nhap : %{http_code}\\n' localhost:8080/dang-nhap
curl -sI localhost:8080/assets/index-AxA_Pi8B.js | grep -iE 'cache-control|expires'</code></pre>
<div class="out">IMAGE      ID             DISK USAGE   CONTENT SIZE
site:1.0   d92fae016871         76MB         21.8MB
/ : 200
/dang-nhap : 200
Expires: Thu, 23 Sep 2027 15:05:08 GMT
Cache-Control: max-age=31536000
Cache-Control: public, immutable</div>
<p><code>/dang-nhap</code> không phải một file — nó trả 200 vì <code>try_files … /index.html</code> trao mọi đường dẫn lạ cho ứng dụng một-trang, và bộ định tuyến của nó hiện đúng màn hình. File tài nguyên có mã băm trong tên được cache một năm, và điều đó an toàn chính vì tên của nó đổi mỗi khi nội dung đổi. Còn container báo <code>(healthy)</code> mà không cần <code>CMD</code> nào của chúng ta: <code>/docker-entrypoint.sh</code> và <code>nginx -g daemon off;</code> của ảnh nền đã làm việc đó.</p>
<table>
<tr><th>Công thức</th><th>Ảnh cuối (DISK USAGE)</th><th>Stage dựng / bộ công cụ</th><th>Lượt dựng đầu</th><th>Chạy bằng</th></tr>
<tr><td>API Node + TypeScript</td><td>240MB</td><td>—</td><td>12 s</td><td><code>node</code> (1000)</td></tr>
<tr><td>Next.js standalone</td><td>328MB</td><td>979MB</td><td>68 s</td><td><code>node</code> (1000)</td></tr>
<tr><td>Python FastAPI</td><td>232MB</td><td>675MB</td><td>332 s</td><td><code>app</code> (1000)</td></tr>
<tr><td>Go + distroless</td><td>13.6MB</td><td>365MB</td><td>11 s</td><td><code>nonroot</code> (65532)</td></tr>
<tr><td>Trang tĩnh + nginx</td><td>76MB</td><td>—</td><td>11 s</td><td>worker nginx chạy bằng <code>nginx</code></td></tr>
</table>

<h3>Năm cái đó có gì chung</h3>
${slide('dk-04', 24, '5 công thức dựng thật: ảnh cuối nhẹ hơn stage dựng 3–27 lần')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Thư viện trước, mã nguồn sau</span><span class="lz-t">COPY package.json → cài → COPY .</span><span class="lz-d">Quyết định về thứ tự có giá trị nhất. Chương 5 ĐO chính xác nó tiết kiệm được bao nhiêu.</span></div>
  <div class="lz-step"><span class="lz-k">Công cụ dựng ở lại stage dựng</span><span class="lz-t">trình biên dịch, thư viện dev, mã nguồn</span><span class="lz-d">Không thứ gì chỉ cần cho lúc dựng lại có mặt trong ảnh cuối. Chương 6 đẩy chuyện này đi xa hơn.</span></div>
  <div class="lz-step"><span class="lz-k">Gắn vào 0.0.0.0</span><span class="lz-t">không phải 127.0.0.1</span><span class="lz-d">Nhiều máy chủ mặc định gắn vào loopback (uvicorn, Vite, máy chủ dev của Flask), còn Next.js trong container thì gắn vào tên máy của container nếu không được bảo khác — cái nào cũng có chỗ không với tới được. Đó là nguyên nhân phổ biến nhất của "container chạy mà tôi không kết nối được".</span></div>
  <div class="lz-step"><span class="lz-k">Một USER không phải root, đặt MUỘN</span><span class="lz-t">sau những lệnh RUN cần quyền root</span><span class="lz-d">Miễn phí trong mọi hệ sinh thái, và là cải thiện an ninh rẻ nhất có sẵn.</span></div>
  <div class="lz-step"><span class="lz-k">CMD dạng exec, và một healthcheck</span><span class="lz-t">["node","dist/index.js"]</span><span class="lz-d">Dừng sạch sẽ trong vài mili giây, và Compose chờ được tới lúc nó sẵn sàng (Bài 1.3 và Chương 9).</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm SWP391 của bạn có frontend Next.js và API Express, và buổi demo trước hội đồng là tuần sau. Các ảnh phải nhỏ, chạy bằng user không phải root, và qua healthcheck ngay lần đầu. Hãy đóng gói frontend bằng công thức 2 và chứng minh từng cái bẫy đã được bịt.</p><ol>
<li>Trong <code>~/thu-docker/web</code>, tạo một app Next.js (<code>npx create-next-app@latest</code>, hoặc app có sẵn), thêm <code>output: 'standalone'</code> vào <code>next.config</code>, và viết file <code>.dockerignore</code> của Bài 4.1.</li>
<li>Dựng bằng công thức 2 với <code>--build-arg NEXT_PUBLIC_API_URL=https://api.example.com</code>; dựng thêm <code>--target build</code> và so hai kích thước trong <code>docker images</code>.</li>
<li>Chạy với <code>-p 3000:3000</code> và kiểm cả ba cái bẫy: <code>docker exec … wget -qO- http://127.0.0.1:3000/ &gt;/dev/null &amp;&amp; echo ok</code>, một URL <code>/_next/static/…css</code> và một file trong <code>public/</code> trả 200, và trang hiện URL API lúc dựng.</li>
<li>Thêm một <code>HEALTHCHECK</code> giống của công thức 1 (gọi <code>127.0.0.1:3000/</code>), dựng lại, và chờ <code>(healthy)</code> trong <code>docker ps</code>. Rồi bỏ <code>HOSTNAME=0.0.0.0</code>, dựng lại, và nhìn nó chuyển sang <code>(unhealthy)</code>.</li>
<li>Trả <code>HOSTNAME=0.0.0.0</code> về chỗ cũ, dọn các container và những ảnh thừa.</li></ol>
<p><strong>Đạt khi:</strong> ảnh standalone nhẹ chưa tới một nửa stage dựng; <code>docker exec … id</code> in <code>uid=1000(node)</code>; container <code>(healthy)</code> khi có <code>HOSTNAME=0.0.0.0</code> và <code>(unhealthy)</code> khi thiếu; và bạn giải thích được mỗi phép kiểm đã chứng minh cái bẫy nào được bịt.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Multi-stage build (dựng nhiều stage)</span><span class="v">Nhiều stage <code>FROM</code> trong một Dockerfile; chỉ thứ bạn chép vào stage cuối mới được đem đi.</span></div>
  <div class="kv"><span class="k">Standalone output (bản dựng khép kín)</span><span class="v">Thư mục máy chủ khép kín của Next.js: <code>server.js</code> cộng đúng những <code>node_modules</code> nó dùng.</span></div>
  <div class="kv"><span class="k">Distroless (ảnh không bản phân phối)</span><span class="v">Ảnh nền không có shell hay trình quản lý gói, chỉ có thứ chương trình cần để chạy.</span></div>
  <div class="kv"><span class="k">Static binary (chương trình tĩnh)</span><span class="v">Chương trình không phụ thuộc thư viện C của hệ thống (<code>CGO_ENABLED=0</code> trong Go).</span></div>
  <div class="kv"><span class="k">Wheel (gói Python dựng sẵn)</span><span class="v">Gói Python đã dựng sẵn; wheel <code>manylinux</code> cho glibc, <code>musllinux</code> cho Alpine.</span></div>
  <div class="kv"><span class="k">SPA fallback (lùi về trang chính)</span><span class="v">Trả <code>index.html</code> cho mọi đường dẫn lạ để bộ định tuyến của ứng dụng một-trang xử lý.</span></div>
  <div class="kv"><span class="k">Bind address (địa chỉ lắng nghe)</span><span class="v">IP mà máy chủ nghe; <code>0.0.0.0</code> là mọi card mạng, <code>127.0.0.1</code> là chỉ riêng container.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi công thức cài thư viện trước khi chép mã nguồn và giữ công cụ dựng ngoài stage cuối.</li>
<li>Đo thật: ảnh cuối từ 13.6MB (Go) tới 328MB (Next.js), nhẹ hơn thứ dựng ra chúng 3 tới 27 lần.</li>
<li>Next.js cần <code>output: 'standalone'</code>, <code>HOSTNAME=0.0.0.0</code>, và chép thêm <code>.next/static</code> với <code>public</code>.</li>
<li><code>NEXT_PUBLIC_*</code> đông cứng lúc dựng — mỗi môi trường một ảnh.</li>
<li>Python: dùng <code>slim</code>, hai stage cho gói phải biên dịch, và <code>PYTHONUNBUFFERED=1</code> không thì print biến mất.</li>
<li>Go: <code>CGO_ENABLED=0</code>, biên dịch trên <code>$BUILDPLATFORM</code>, đóng gói bằng distroless với user không phải root.</li>
</ul>

<a class="link-card" href="https://github.com/docker/awesome-compose" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">awesome-compose</span><span class="lc-sub">Bộ sưu tập chính thức của Docker gồm những hệ thống chạy được — React+Node+Mongo, Django+Postgres, Go+nginx và hàng chục cái khác. Dockerfile và file Compose THẬT để bạn đọc và chỉnh lại.</span></span>
</a>
<a class="link-card" href="https://nextjs.org/docs/app/building-your-application/deploying#docker-image" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Next.js — triển khai bằng Docker</span><span class="lc-sub">Dockerfile <code>output: 'standalone'</code> chính thức, cập nhật theo từng bản phát hành. Hãy bắt đầu từ của họ thay vì một bài blog từ hai phiên bản lớn trước.</span></span>
</a>
<a class="link-card" href="https://github.com/GoogleContainerTools/distroless" target="_blank" rel="noopener">
  <span class="lc-ico">🪶</span>
  <span class="lc-body"><span class="lc-title">Ảnh nền distroless</span><span class="lc-sub">Các biến thể (static, base, cc, nodejs, python), mỗi cái gồm những gì, và những tag <code>:debug</code> có thêm một cái shell busybox cho lúc bạn cần.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: viết cả năm cái</span><span class="lc-sub">Bài chấm điểm: đóng gói một API Node, sửa một ảnh Next.js 404 chính CSS của nó, chẩn đoán một container Python có log rỗng, và đưa một chương trình Go vào một cái ảnh dưới 15MB.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> một máy chủ gắn vào <code>127.0.0.1</code> bên trong container. <code>docker run -p 3000:3000</code> thành công, <code>docker ps</code> hiện cổng đã ánh xạ, log ghi "listening on 127.0.0.1:3000" — và <code>curl localhost:3000</code> từ máy chủ thì nhận connection refused. Bên trong container, <code>127.0.0.1</code> là loopback của CHÍNH container đó và không gì ngoài namespace mạng của nó với tới được (Bài 1.1). Cách chữa tuỳ framework và luôn cùng một ý: <code>HOSTNAME=0.0.0.0</code> cho Next.js, <code>--host 0.0.0.0</code> cho uvicorn và Vite, <code>app.listen(3000, '0.0.0.0')</code> cho Express, <code>0.0.0.0:8080</code> cho Go. Hãy xác nhận bằng <code>docker exec c netstat -tln</code>, hoặc nhìn cột Address trong <code>ss -tlnp</code> từ một container phụ.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Mọi công thức ở đây đều cài thư viện TRƯỚC khi chép mã nguồn, và giữ trình biên dịch với thư viện dev nằm ngoài stage cuối — hai thói quen đó mang đi được qua mọi ngôn ngữ. Hãy gắn vào <code>0.0.0.0</code>, đừng <code>127.0.0.1</code>: một máy chủ nghe sai địa chỉ tạo ra một container chạy hoàn hảo mà chẳng trả lời ai — hoặc trả lời máy chủ mà không trả lời chính healthcheck của nó, như Next.js ở trên. Và mỗi hệ sinh thái có một cái bẫy riêng — engine target của Prisma, <code>HOSTNAME</code> của Next, bộ đệm với wheel musl của Python, <code>CGO_ENABLED</code> của Go — đáng kiểm trước khi bạn ném một buổi chiều vào nó.</p>
</div>
`,
    },
    /* ─────────────────────────── 4.6 ─────────────────────────── */
    {
      title: '4.6 — Quiz: writing Dockerfiles|||4.6 — Kiểm tra: viết Dockerfile',
      slug: 'dk-4-6-quiz',
      type: 'QUIZ',
      description: 'Mười tình huống thật: ngữ cảnh 398 MB, COPY ../ bị kẹp, heredoc xanh mà thiếu gói, chown -R nhân đôi ảnh, dạng shell trên Debian dừng 10 giây, entrypoint thiếu exec, CMD nháy đơn, token trong docker history, ARG rỗng trong stage, và healthcheck Next.js đỏ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from real repositories — every one of them was reproduced for this chapter, and every wrong option is a fix someone actually tried. Read the explanations after submitting, especially for the questions you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can measure what my build context sends (the busybox <code>COPY . /ctx</code> check) and cut it with <code>.dockerignore</code>.</li>
<li>I can explain every line of the Node recipe, including why <code>NODE_ENV=production</code> sits in the final stage only.</li>
<li>I can predict the command a container runs from its ENTRYPOINT, CMD and the arguments after the image name.</li>
<li>I know why shell form stops in 0.1 s on Alpine and 10 s on Debian, and why I write exec form anyway.</li>
<li>I can tell which values live at build time (<code>ARG</code>) and which at run time (<code>ENV</code>, <code>-e</code>), and pass a secret without leaving it in <code>docker history</code>.</li>
<li>I can containerise a Next.js app with <code>output: 'standalone'</code> and avoid its three traps.</li>
</ul>
${slide('dk-04', 31, 'Bảng tra nhanh Chương 4')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống từ những kho mã thật — cái nào cũng đã được tái hiện cho chương này, và mỗi phương án sai là một cách sửa đã từng có người thử. Đọc phần giải thích sau khi nộp, nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đo được ngữ cảnh dựng của mình gửi đi những gì (phép soi <code>COPY . /ctx</code> bằng busybox) và cắt nó bằng <code>.dockerignore</code>.</li>
<li>Tôi giải thích được từng dòng của công thức Node, kể cả vì sao <code>NODE_ENV=production</code> chỉ nằm ở stage cuối.</li>
<li>Tôi đoán trước được lệnh một container sẽ chạy từ ENTRYPOINT, CMD và các tham số sau tên ảnh.</li>
<li>Tôi biết vì sao dạng shell dừng trong 0,1 s trên Alpine và 10 s trên Debian, và vì sao tôi vẫn viết dạng exec.</li>
<li>Tôi phân biệt được giá trị nào sống lúc dựng (<code>ARG</code>) và lúc chạy (<code>ENV</code>, <code>-e</code>), và truyền được bí mật mà không để lại trong <code>docker history</code>.</li>
<li>Tôi đóng gói được một app Next.js bằng <code>output: 'standalone'</code> và tránh được ba cái bẫy của nó.</li>
</ul>
${slide('dk-04', 31, 'Bảng tra nhanh Chương 4')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'The CI build of your Next.js app spends most of its time before the first step, and the log shows "transferring context: 397.69MB". The Dockerfile uses COPY . . and the repo has no .dockerignore. What is the right fix?|||Lượt dựng app Next.js trong CI tốn phần lớn thời gian TRƯỚC bước đầu tiên, và log ghi "transferring context: 397.69MB". Dockerfile dùng COPY . . và kho mã không có .dockerignore. Cách sửa đúng là gì?',
            options: [
              'Move the Dockerfile into a docker/ subfolder so the builder no longer scans the whole repository|||Dời Dockerfile vào thư mục con docker/ để bộ dựng thôi quét cả kho mã',
              'Add a .dockerignore excluding node_modules, .next, .git and .env* — they are sent, and COPY . . also puts them in the image|||Thêm .dockerignore loại node_modules, .next, .git và .env* — chúng bị gửi đi, và COPY . . còn nhét chúng vào ảnh',
              'Build with --no-cache so BuildKit stops keeping the old context between builds|||Dựng với --no-cache để BuildKit thôi giữ ngữ cảnh cũ giữa các lượt dựng',
              'Replace COPY . . with ADD . ., which streams the files instead of uploading them first|||Thay COPY . . bằng ADD . ., thứ truyền file từ từ thay vì tải lên trước',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: The context is the directory given as the last argument, not the Dockerfile’s folder, so moving the Dockerfile changes nothing. Measured in Lesson 4.1: 397.69MB and 21 s without .dockerignore, 32.25kB and 2 s with it — and without it .env.local and .git ended up inside the image. --no-cache affects layers, not what is sent; ADD sends exactly the same context.|||VI: Ngữ cảnh là thư mục ở tham số cuối, không phải thư mục chứa Dockerfile, nên dời Dockerfile chẳng đổi gì. Đo ở Bài 4.1: 397.69MB và 21 s khi không có .dockerignore, 32.25kB và 2 s khi có — và khi không có thì .env.local với .git nằm luôn trong ảnh. --no-cache tác động tới các tầng, không tới thứ bị gửi; ADD gửi đúng cùng một ngữ cảnh.',
          },
          {
            question: 'A monorepo has api/Dockerfile with COPY ../shared/utils.js ./ and you run docker build -t api ./api. The build fails with "/shared/utils.js": not found. Why, and what works?|||Một monorepo có api/Dockerfile chứa COPY ../shared/utils.js ./ và bạn chạy docker build -t api ./api. Lượt dựng hỏng với "/shared/utils.js": not found. Vì sao, và cách nào chạy được?',
            options: [
              'Relative paths are not allowed in COPY; write the absolute host path /home/you/repo/shared/utils.js instead|||COPY không cho đường dẫn tương đối; hãy viết đường dẫn tuyệt đối của máy /home/you/repo/shared/utils.js',
              'The file must be committed to Git first, because BuildKit reads the context from the Git index|||File phải được commit vào Git trước, vì BuildKit đọc ngữ cảnh từ chỉ mục Git',
              'Use ADD instead of COPY, because ADD is allowed to reach files outside the context directory|||Dùng ADD thay COPY, vì ADD được phép với tới file ngoài thư mục ngữ cảnh',
              'The context is ./api and ".." is clamped to its root; build from the repo root with -f api/Dockerfile and COPY shared/utils.js|||Ngữ cảnh là ./api và ".." bị kẹp về gốc của nó; dựng từ gốc kho mã với -f api/Dockerfile và COPY shared/utils.js',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: The builder only has the uploaded context; "../shared" is resolved inside it and becomes "/shared", which is exactly the error text measured in Lesson 4.1. No path outside the context exists for the builder — absolute host paths neither. ADD has the same limit, and the context is not read from Git. Widen the context and point -f at the Dockerfile.|||VI: Bộ dựng chỉ có ngữ cảnh đã tải lên; "../shared" được phân giải bên trong nó và thành "/shared", đúng câu báo lỗi đã đo ở Bài 4.1. Với bộ dựng thì không có đường dẫn nào ngoài ngữ cảnh — đường dẫn tuyệt đối của máy cũng vậy. ADD cùng giới hạn, và ngữ cảnh không đọc từ Git. Hãy mở rộng ngữ cảnh rồi trỏ -f vào Dockerfile.',
          },
          {
            question: 'A RUN <<SCRIPT heredoc installs three packages and then prints a message; the build is green, but none of the packages is in the image. The log shows "ERROR: unable to select packages" in the middle of that step. What happened?|||Một khối RUN <<SCRIPT cài ba gói rồi in một dòng thông báo; lượt dựng xanh, nhưng không gói nào có trong ảnh. Log hiện "ERROR: unable to select packages" giữa bước đó. Chuyện gì đã xảy ra?',
            options: [
              'The script has no set -e, so its exit code was that of its last line, which succeeded — start heredocs with set -eux|||Script không có set -e, nên mã thoát là của dòng cuối, mà dòng đó thành công — hãy mở đầu heredoc bằng set -eux',
              'Without the # syntax line, BuildKit runs heredocs in a sandbox where errors are ignored|||Thiếu dòng # syntax thì BuildKit chạy heredoc trong một hộp cát nơi lỗi bị bỏ qua',
              'apk only reports errors on its second run, so the step must be repeated with --no-cache to fail properly|||apk chỉ báo lỗi ở lần chạy thứ hai, nên phải chạy lại bước đó với --no-cache mới hỏng đúng',
              'The cached layer from an earlier successful build was reused, hiding the new failure from the log|||Tầng cache từ một lượt dựng thành công trước được dùng lại, giấu lỗi mới khỏi log',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Reproduced in Lesson 4.2: the ERROR line printed, the echo after it printed, and the step ended DONE. A shell script’s exit status is its last command’s. The syntax-line option is tempting, but Docker 29’s built-in Dockerfile frontend runs heredocs even without it (checked), and no frontend ignores errors on purpose. A cached step would show CACHED and no apk output at all.|||VI: Đã tái hiện ở Bài 4.2: dòng ERROR được in, lệnh echo sau đó cũng in, và bước đó kết thúc DONE. Mã thoát của một script là mã của lệnh cuối. Phương án dòng syntax nghe hợp lý, nhưng bộ đọc Dockerfile có sẵn của Docker 29 chạy heredoc cả khi không có dòng đó (đã kiểm), và chẳng bộ đọc nào cố ý bỏ qua lỗi. Một bước dùng cache sẽ ghi CACHED và chẳng có output nào của apk.',
          },
          {
            question: 'docker history shows two 160MB layers in a row: "COPY /app/node_modules ./node_modules" and "RUN chown -R node:node /app". The image is 638MB instead of about 430MB. What fixes it?|||docker history hiện hai tầng 160MB liền nhau: "COPY /app/node_modules ./node_modules" và "RUN chown -R node:node /app". Ảnh nặng 638MB thay vì khoảng 430MB. Cách nào sửa được?',
            options: [
              'Add RUN rm -rf /app/node_modules/.cache after the chown to delete the duplicated files|||Thêm RUN rm -rf /app/node_modules/.cache sau chown để xoá các file bị nhân đôi',
              'Keep root and drop USER node, because non-root users always double the size of copied files|||Giữ root và bỏ USER node, vì user không phải root luôn nhân đôi dung lượng file được chép',
              'Use COPY --chown=node:node and delete the RUN chown; changing owners after the fact copies every file up|||Dùng COPY --chown=node:node và bỏ RUN chown; đổi chủ sở hữu về sau là chép lên mọi file',
              'Run chown -R in the same RUN as npm ci in the deps stage, so both layers merge into one|||Chạy chown -R trong cùng RUN với npm ci ở stage deps, để hai tầng gộp làm một',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Measured in Lesson 4.2: 638MB with RUN chown, 433MB with COPY --chown. A metadata change is a write, and a write copies the whole file into the new layer. Deleting files later only adds whiteouts and cannot shrink a lower layer. Chowning in the deps stage does not help: the COPY into the final stage resets ownership to root unless you pass --chown.|||VI: Đo ở Bài 4.2: 638MB với RUN chown, 433MB với COPY --chown. Đổi siêu dữ liệu là GHI, và ghi thì chép nguyên file lên tầng mới. Xoá file về sau chỉ thêm dấu whiteout, không làm nhỏ được tầng dưới. chown ở stage deps cũng không giúp: COPY vào stage cuối đặt lại chủ sở hữu thành root trừ khi bạn truyền --chown.',
          },
          {
            question: 'The same Dockerfile line, CMD node server.js, stops in 0.12 s on node:22-alpine but takes 10.19 s and exits 137 after you switch to node:22-slim. server.js does handle SIGTERM. Why?|||Cùng một dòng CMD node server.js dừng trong 0,12 s trên node:22-alpine nhưng mất 10,19 s và thoát 137 khi bạn đổi sang node:22-slim. server.js CÓ bắt SIGTERM. Vì sao?',
            options: [
              'Debian images set a default STOPSIGNAL of SIGKILL, so node never receives a SIGTERM to handle|||Ảnh Debian đặt STOPSIGNAL mặc định là SIGKILL, nên node không bao giờ nhận được SIGTERM để xử lý',
              'node:22-slim ships an older Node release that cannot register signal handlers when it runs as PID 1|||node:22-slim mang bản Node cũ hơn, không cài được hàm xử lý tín hiệu khi chạy làm PID 1',
              'Busybox sh execs a single command so node is PID 1; Debian’s dash stays as PID 1 and does not forward SIGTERM|||sh của busybox exec lệnh duy nhất nên node là PID 1; dash của Debian ở lại làm PID 1 và không chuyển SIGTERM',
              'Shell form always costs exactly ten seconds, and the Alpine measurement was too fast because of caching|||Dạng shell luôn tốn đúng mười giây, và số đo trên Alpine nhanh quá là do cache',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Measured in Lesson 4.3 on Linux: on slim, /proc showed "1 /bin/sh -c node server.js" with node as PID 8; on Alpine, PID 1 was node. Both images use the same Node 22 and neither sets STOPSIGNAL. The "always ten seconds" option is the myth this chapter corrects — shell form is safe or unsafe by accident, which is why exec form is the rule.|||VI: Đo ở Bài 4.3 trên Linux: với slim, /proc hiện "1 /bin/sh -c node server.js" còn node là PID 8; với Alpine, PID 1 là node. Hai ảnh dùng cùng Node 22 và không cái nào đặt STOPSIGNAL. Phương án "luôn mười giây" chính là ngộ nhận mà chương này sửa — dạng shell an toàn hay không là do tình cờ, nên dạng exec mới là luật.',
          },
          {
            question: 'Your entrypoint.sh waits for the database, runs migrations, and ends with the line "$@". docker exec api ps shows "1 /bin/sh /usr/local/bin/entrypoint.sh node src/server.js" and "7 node src/server.js". What do you change?|||entrypoint.sh của bạn chờ CSDL, chạy migration, và kết thúc bằng dòng "$@". docker exec api ps hiện "1 /bin/sh /usr/local/bin/entrypoint.sh node src/server.js" và "7 node src/server.js". Bạn đổi gì?',
            options: [
              'Make the last line exec "$@", so the shell is replaced by the CMD and node becomes PID 1|||Đổi dòng cuối thành exec "$@", để shell bị thay bằng CMD và node thành PID 1',
              'Move node src/server.js into ENTRYPOINT and delete CMD, so the script is no longer needed|||Dời node src/server.js vào ENTRYPOINT và xoá CMD, để khỏi cần script nữa',
              'Change "$@" to $@ without quotes, so the arguments reach node as separate words|||Đổi "$@" thành $@ không có nháy, để các tham số tới node thành những từ riêng',
              'Add STOPSIGNAL SIGKILL so docker stop no longer waits for the shell to react|||Thêm STOPSIGNAL SIGKILL để docker stop thôi chờ shell phản ứng',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: That exact ps output was reproduced in Lesson 4.3 with the exec removed; with it, PID 1 was "node src/server.js". Moving node into ENTRYPOINT loses the setup steps. Removing the quotes breaks arguments containing spaces and changes nothing about PID 1. SIGKILL skips graceful shutdown entirely — the app would lose in-flight requests every deploy.|||VI: Đúng output ps đó đã được tái hiện ở Bài 4.3 khi bỏ exec; có exec thì PID 1 là "node src/server.js". Dời node vào ENTRYPOINT là mất phần chuẩn bị. Bỏ nháy làm hỏng tham số có dấu cách và chẳng đổi gì về PID 1. SIGKILL bỏ qua hẳn việc dừng êm — app sẽ mất các request đang xử lý ở mỗi lần deploy.',
          },
          {
            question: 'A container exits immediately with "/bin/sh: [node,: not found" and exit code 127. The build printed a yellow WARN you ignored. What is in the Dockerfile?|||Một container thoát ngay với "/bin/sh: [node,: not found" và mã thoát 127. Lượt dựng có in một dòng WARN màu vàng mà bạn bỏ qua. Trong Dockerfile có gì?',
            options: [
              'CMD ["node", "server.js"] placed before WORKDIR, so the relative path server.js is not found|||CMD ["node", "server.js"] đặt trước WORKDIR, nên đường dẫn tương đối server.js không tìm thấy',
              'An ENTRYPOINT in shell form, which swallows the CMD and passes the brackets on to sh|||Một ENTRYPOINT dạng shell, thứ nuốt CMD và chuyển nguyên dấu ngoặc cho sh',
              'A base image without Node installed, so the shell cannot find any program called node|||Một ảnh nền không cài Node, nên shell không tìm thấy chương trình nào tên node',
              "CMD ['node', 'server.js'] with single quotes: not valid JSON, so it became shell form|||CMD ['node', 'server.js'] với nháy đơn: không phải JSON hợp lệ, nên thành dạng shell",
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: Reproduced in Lesson 4.3: Config.Cmd became a /bin/sh -c wrapper around the literal text [’echo’, ’hi’], sh looked for a program literally named "[echo," and exit 127 means command not found; BuildKit’s JSONArgsRecommended warning was the only hint. A missing node would say "node: not found", without the bracket and comma. WORKDIR order changes where the file is looked up, not the program name.|||VI: Đã tái hiện ở Bài 4.3: Config.Cmd thành một lớp /bin/sh -c bọc quanh đúng dòng chữ [’echo’, ’hi’], sh đi tìm chương trình tên đúng là "[echo," và exit 127 nghĩa là không tìm thấy lệnh; cảnh báo JSONArgsRecommended của BuildKit là gợi ý duy nhất. Thiếu node thì câu báo sẽ là "node: not found", không có dấu ngoặc và dấu phẩy. Thứ tự WORKDIR đổi chỗ tìm file, không đổi tên chương trình.',
          },
          {
            question: 'CI builds with --build-arg NPM_TOKEN=… and the RUN that writes .npmrc deletes it at the end of the same line. Who can read the token from the pushed image?|||CI dựng với --build-arg NPM_TOKEN=… và lệnh RUN ghi .npmrc xoá nó ở cuối cùng dòng đó. Ai đọc được token từ cái ảnh đã đẩy lên?',
            options: [
              'Nobody — the file was created and deleted in one layer, so it never reached the image|||Không ai — file được tạo và xoá trong một tầng, nên nó chưa bao giờ vào ảnh',
              'Anyone who can pull it: docker history shows the ARG line and "RUN |1 NPM_TOKEN=…"; use a secret mount instead|||Bất kỳ ai kéo được ảnh: docker history hiện dòng ARG và "RUN |1 NPM_TOKEN=…"; hãy dùng secret mount',
              'Only people with push rights to the registry, because build arguments are encrypted in the manifest|||Chỉ người có quyền đẩy lên registry, vì build argument được mã hoá trong manifest',
              'Only someone who runs the container, because ARG values become environment variables at run time|||Chỉ ai chạy container, vì giá trị ARG trở thành biến môi trường lúc chạy',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Checked in Lesson 4.4: docker history --no-trunc printed the token twice, and the build log printed it too, behind a SecretsUsedInArgOrEnv warning. The "same layer" option is right about the file and wrong about the argument. ARG does not become an environment variable at run time — which is why it is not visible with docker inspect, but it is still in the history. With RUN --mount=type=secret, grep -ci token printed 0.|||VI: Đã kiểm ở Bài 4.4: docker history --no-trunc in token HAI lần, và log dựng cũng in nó, sau một cảnh báo SecretsUsedInArgOrEnv. Phương án "cùng tầng" đúng về cái file nhưng sai về cái tham số. ARG không thành biến môi trường lúc chạy — nên docker inspect không thấy nó, nhưng nó vẫn nằm trong history. Với RUN --mount=type=secret thì grep -ci token in ra 0.',
          },
          {
            question: 'ARG ALPINE_VERSION=3.22 sits above the first FROM. FROM alpine:${ALPINE_VERSION} works in both stages, but RUN echo "${ALPINE_VERSION}" in the final stage prints an empty string. What is the fix?|||ARG ALPINE_VERSION=3.22 đứng trên FROM đầu tiên. FROM alpine:${ALPINE_VERSION} chạy được ở cả hai stage, nhưng RUN echo "${ALPINE_VERSION}" ở stage cuối in chuỗi rỗng. Sửa thế nào?',
            options: [
              'Add ARG ALPINE_VERSION (no value) inside the final stage; a global ARG is only visible in FROM lines|||Thêm ARG ALPINE_VERSION (không giá trị) bên trong stage cuối; ARG toàn cục chỉ thấy được ở dòng FROM',
              'Pass --build-arg ALPINE_VERSION=3.22 on the command line, which makes the value global to every stage|||Truyền --build-arg ALPINE_VERSION=3.22 trên dòng lệnh, thứ làm giá trị thành toàn cục cho mọi stage',
              'Replace the ARG with ENV ALPINE_VERSION=3.22 above the first FROM so that all stages inherit it|||Thay ARG bằng ENV ALPINE_VERSION=3.22 phía trên FROM đầu tiên để mọi stage thừa hưởng',
              'Rename it to NODE_VERSION, a name BuildKit treats as predefined and forwards into every stage|||Đổi tên thành NODE_VERSION, cái tên BuildKit coi là có sẵn và chuyển vào mọi stage',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Measured in Lesson 4.4: the build stage printed "3.22" after re-declaring, the final stage printed an empty string. --build-arg only overrides a declared ARG and does not change its scope. ENV cannot appear before FROM. NODE_VERSION only looked like it worked because the node image itself sets ENV NODE_VERSION=22.23.2 — it is not a BuildKit feature, and on alpine it would be empty too.|||VI: Đo ở Bài 4.4: stage build in "3.22" sau khi khai lại, stage cuối in chuỗi rỗng. --build-arg chỉ đè một ARG đã khai và không đổi phạm vi của nó. ENV không được đứng trước FROM. NODE_VERSION chỉ TRÔNG như chạy được vì chính ảnh node đặt ENV NODE_VERSION=22.23.2 — đó không phải tính năng của BuildKit, và trên alpine nó cũng sẽ rỗng.',
          },
          {
            question: 'Your Next.js standalone container answers curl localhost:3000 from the host with 200, yet its HEALTHCHECK (wget http://127.0.0.1:3000/) marks it unhealthy forever. The logs say "Network: http://d3f8c095b712:3000". What is missing?|||Container Next.js standalone của bạn trả 200 cho curl localhost:3000 từ máy chủ, vậy mà HEALTHCHECK (wget http://127.0.0.1:3000/) đánh dấu nó unhealthy mãi mãi. Log ghi "Network: http://d3f8c095b712:3000". Thiếu gì?',
            options: [
              'EXPOSE 3000, without which the port is published to the host but not to the container itself|||EXPOSE 3000, thiếu nó thì cổng được mở ra máy chủ nhưng không mở cho chính container',
              'The COPY of .next/static, because the health check page needs its stylesheet to render|||Dòng COPY .next/static, vì trang kiểm sức khoẻ cần file CSS mới hiển thị được',
              'ENV HOSTNAME=0.0.0.0 — Docker sets HOSTNAME to the container ID, so server.js listens only on the container’s IP|||ENV HOSTNAME=0.0.0.0 — Docker đặt HOSTNAME bằng ID container, nên server.js chỉ nghe trên IP của container',
              'A longer --start-period, because Next.js needs about a minute before it accepts local connections|||Một --start-period dài hơn, vì Next.js cần khoảng một phút mới nhận kết nối cục bộ',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Reproduced in Lesson 4.5: netstat showed 172.17.0.8:3000, curl through -p returned 200 and wget to 127.0.0.1 got "Connection refused". server.js uses process.env.HOSTNAME || "0.0.0.0", and Docker always sets HOSTNAME. EXPOSE opens nothing anywhere. Missing static files give 404s for CSS, not a refused connection, and the logs said Ready in 0ms.|||VI: Đã tái hiện ở Bài 4.5: netstat hiện 172.17.0.8:3000, curl qua -p trả 200 còn wget tới 127.0.0.1 nhận "Connection refused". server.js dùng process.env.HOSTNAME || "0.0.0.0", mà Docker luôn đặt HOSTNAME. EXPOSE chẳng mở gì ở đâu cả. Thiếu file tĩnh thì CSS trả 404, không phải từ chối kết nối, và log ghi Ready in 0ms.',
          },
        ],
      },
    },
  ],
};
