/**
 * Docker — Chương 4: Dockerfile từ cơ bản tới trôi chảy.
 * Dockerfile đầu tiên · bảng chỉ thị · CMD với ENTRYPOINT · ARG với ENV ·
 * công thức theo ngôn ngữ · quiz.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 4 — Dockerfile, from basics to fluent|||Chương 4 — Dockerfile, từ cơ bản tới trôi chảy',
  description: 'Viết một Dockerfile bạn hiểu từng dòng: ngữ cảnh dựng và .dockerignore, mọi chỉ thị kèm hành vi thật của nó, khác biệt CMD với ENTRYPOINT, ARG với ENV, và công thức chuẩn cho Node, Python, Go và trang tĩnh.',
  lessons: [
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
<div class="out">node_modules  package-lock.json  package.json  src</div>
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

<h3>The dot at the end: the build context</h3>
<pre><code><span class="tok-comment"># These are three different things, and only one is the Dockerfile</span>
docker build -t demo:1.0 .
<span class="tok-comment">#                        ^ the BUILD CONTEXT — a directory that gets uploaded</span>

docker build -t demo:1.0 -f docker/Dockerfile.api .
<span class="tok-comment">#                        ^^^^^^^^^^^^^^^^^^^^^^^ the Dockerfile   ^ still the context</span></code></pre>
<p>Before any instruction runs, the CLI packages up that directory and sends it to the daemon — because the daemon might be on another machine and cannot read your disk. Every <code>COPY</code> and <code>ADD</code> then reads from that uploaded copy, which is why <code>COPY ../shared /app</code> fails: the parent directory is not in the context, and no path outside it can ever be.</p>
<pre><code><span class="tok-comment"># Watch the cost when node_modules is sitting in the directory</span>
du -sh node_modules
docker build -t demo:1.0 . 2&gt;&amp;1 | grep -E 'transferring context|FINISHED'</code></pre>
<div class="out">61M	node_modules
 =&gt; =&gt; transferring context: 61.44MB                                       3.1s
[+] Building 4.9s (10/10) FINISHED</div>
<p>61MB uploaded on every single build, to produce an image that never uses any of it — <code>npm ci</code> creates its own <code>node_modules</code> inside the container. Three seconds per build, forever, plus the same waste in CI. And on a slow machine with a large repository it is far worse than three seconds.</p>

<h3>.dockerignore fixes it</h3>
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
  <div class="kv"><span class="k">Speed</span><span class="v">61MB down to 4KB. On a repository with a <code>.git</code> directory full of history, this alone can turn a thirty-second build into a two-second one.</span></div>
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
<a class="link-card codelab" href="/code-lab/docker\${REF}" target="_blank" rel="noopener">
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
<div class="out">node_modules  package-lock.json  package.json  src</div>
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

<h3>Dấu chấm ở cuối: ngữ cảnh dựng</h3>
<pre><code><span class="tok-comment"># Đây là ba thứ khác nhau, và chỉ MỘT trong số đó là Dockerfile</span>
docker build -t demo:1.0 .
<span class="tok-comment">#                        ^ NGỮ CẢNH DỰNG — một thư mục sẽ được TẢI LÊN</span>

docker build -t demo:1.0 -f docker/Dockerfile.api .
<span class="tok-comment">#                        ^^^^^^^^^^^^^^^^^^^^^^^ cái Dockerfile   ^ vẫn là ngữ cảnh</span></code></pre>
<p>Trước khi bất kỳ chỉ thị nào chạy, CLI đóng gói cái thư mục đó lại và gửi nó cho tiến trình nền — vì tiến trình nền có thể nằm trên một cái máy khác và không đọc được đĩa của bạn. Mọi <code>COPY</code> và <code>ADD</code> sau đó đọc từ bản đã tải lên ấy, và đó là lý do <code>COPY ../shared /app</code> hỏng: thư mục cha không nằm trong ngữ cảnh, và không đường dẫn nào ngoài nó có thể tới được.</p>
<pre><code><span class="tok-comment"># Nhìn cái giá khi node_modules đang nằm trong thư mục</span>
du -sh node_modules
docker build -t demo:1.0 . 2&gt;&amp;1 | grep -E 'transferring context|FINISHED'</code></pre>
<div class="out">61M	node_modules
 =&gt; =&gt; transferring context: 61.44MB                                       3.1s
[+] Building 4.9s (10/10) FINISHED</div>
<p>61MB được tải lên ở MỌI lượt dựng, để tạo ra một cái ảnh chẳng bao giờ dùng tới nó — <code>npm ci</code> tự tạo <code>node_modules</code> của riêng nó bên trong container. Ba giây mỗi lượt dựng, mãi mãi, cộng đúng khoản lãng phí ấy trong CI. Và trên một cái máy chậm với một kho mã lớn thì nó tệ hơn ba giây rất nhiều.</p>

<h3>.dockerignore chữa được</h3>
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
  <div class="kv"><span class="k">Tốc độ</span><span class="v">61MB tụt xuống 4KB. Trên một kho mã có thư mục <code>.git</code> đầy lịch sử, riêng chuyện này biến một lượt dựng ba mươi giây thành hai giây.</span></div>
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
<a class="link-card codelab" href="/code-lab/docker\${REF}" target="_blank" rel="noopener">
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
<p class="lead">There are seventeen Dockerfile instructions. You will use nine of them constantly, four occasionally, and four almost never — but several of the ones you use daily have behaviour that is not obvious, and two of them are actively dangerous in your own images.</p>

<h3>Start with the syntax line</h3>
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
  <div class="kv"><span class="k">ARG before FROM</span><span class="v">The one place an <code>ARG</code> may appear before the first <code>FROM</code>, so you can parameterise the base: <code>ARG NODE_VERSION=22</code> then <code>FROM node:\${NODE_VERSION}-alpine</code>. Note it is then out of scope inside the stage (Lesson 4.4).</span></div>
</div>

<h3>RUN — the one that costs money</h3>
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

<h3>COPY versus ADD</h3>
<pre><code>COPY package.json ./                        <span class="tok-comment"># the one you want, 95% of the time</span>
COPY --chown=node:node src ./src            <span class="tok-comment"># set ownership as you copy</span>
COPY --chmod=755 entrypoint.sh /usr/local/bin/
COPY --from=build /app/dist ./dist          <span class="tok-comment"># from another stage</span>
COPY --link ./static /www                   <span class="tok-comment"># independent layer, better caching</span>

ADD https://example.com/file.tar.gz /tmp/   <span class="tok-comment"># ADD can fetch URLs…</span>
ADD archive.tar.gz /opt/                    <span class="tok-comment"># …and auto-extracts local tarballs</span></code></pre>
<div class="callout warn"><strong>Use <code>COPY</code> unless you specifically need one of <code>ADD</code>'s two extra behaviours</strong> — and both of them are traps. <code>ADD</code> auto-extracts local tar archives, so <code>ADD data.tar.gz /opt/</code> silently unpacks rather than copying, which is surprising if you wanted the file. And <code>ADD &lt;url&gt;</code> downloads without checksum verification and without cache invalidation when the remote content changes, so a build can silently ship different bytes. For remote files, <code>RUN curl -fsSL url -o file &amp;&amp; echo "sha256 file" | sha256sum -c</code> is explicit and verifiable.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">--chown / --chmod</span><span class="v">Set ownership and mode during the copy instead of a following <code>RUN chown</code> — which would duplicate every copied file into a new layer, doubling that part of the image.</span></div>
  <div class="kv"><span class="k">--from=stage</span><span class="v">Copy out of an earlier stage, or even out of another image: <code>COPY --from=nginx:alpine /etc/nginx/nginx.conf ./</code> works and is a neat way to grab one file from an image.</span></div>
  <div class="kv"><span class="k">--link</span><span class="v">Creates the layer independently of the previous filesystem state, so an earlier layer changing does not invalidate it. Cheap win for large static assets; requires the syntax line.</span></div>
  <div class="kv"><span class="k">Trailing slash matters</span><span class="v"><code>COPY file /dest</code> makes <code>/dest</code> a file; <code>COPY file /dest/</code> puts it inside a directory. With multiple sources the destination <em>must</em> end in a slash.</span></div>
  <div class="kv"><span class="k">Directory semantics differ from cp</span><span class="v"><code>COPY src ./src</code> copies the <em>contents</em> of <code>src</code> into <code>./src</code>. There is no way to copy a directory itself preserving its name at the top level — you name the destination instead.</span></div>
</div>

<h3>The metadata instructions</h3>
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
  <div class="kv"><span class="k">STOPSIGNAL matters for databases</span><span class="v">PostgreSQL treats SIGQUIT as "fast shutdown" and SIGTERM as "wait for clients". Getting this wrong is the difference between a clean stop and a ten-second timeout followed by SIGKILL (Lesson 1.3).</span></div>
  <div class="kv"><span class="k">SHELL with pipefail</span><span class="v">The default <code>sh -c</code> ignores failures in the middle of a pipe, so <code>RUN curl … | tar x</code> succeeds even when curl fails. Setting <code>SHELL ["/bin/bash","-eo","pipefail","-c"]</code> fixes that for every later <code>RUN</code> — worth it in any image with bash.</span></div>
  <div class="kv"><span class="k">LABEL is free and searchable</span><span class="v">Zero bytes in the image, and <code>docker image ls --filter "label=…"</code> can find them. Use the <code>org.opencontainers.image.*</code> names (Lesson 3.1).</span></div>
</div>

<h3>VOLUME — usually a mistake in your own image</h3>
<pre><code>docker build -q -t voltest - &lt;&lt;'EOF'
FROM alpine
VOLUME /data
RUN echo hello &gt; /data/file.txt
CMD ["cat", "/data/file.txt"]
EOF
docker run --rm voltest 2&gt;&amp;1 | head -2
docker volume ls -f dangling=true --format '{{.Name}}' | head -2</code></pre>
<div class="out">cat: can't open '/data/file.txt': No such file or directory
7c3a9f2e1d8b4a5c6f7e8d9c0b1a2938475665748392a1b0c9d8e7f6a5b4c3d2</div>
<div class="callout warn"><strong>Two surprises in five lines.</strong> First, files written to a <code>VOLUME</code> path in a <em>later</em> <code>RUN</code> are discarded — the volume is created fresh at container start and shadows whatever the image had there. Second, every <code>docker run</code> of this image silently creates a new anonymous volume with a random name, which nothing ever cleans up (Lesson 3.5). <code>VOLUME</code> is appropriate in a database image published for other people. In your application image it takes control away from whoever runs it, and they can express the same thing with <code>-v</code> when they actually want it.</div>

<h3>The rare ones</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ONBUILD</span><span class="v">Registers an instruction that runs when someone else builds <code>FROM</code> your image. Powerful and confusing — the child's build does things that are not in the child's Dockerfile. Multi-stage builds have made it mostly obsolete.</span></div>
  <div class="kv"><span class="k">ARG</span><span class="v">Build-time only, and visible in <code>docker history</code>. Lesson 4.4 covers it properly, including why it must never hold a secret.</span></div>
  <div class="kv"><span class="k">MAINTAINER</span><span class="v">Deprecated. Use <code>LABEL org.opencontainers.image.authors="…"</code>.</span></div>
  <div class="kv"><span class="k">CMD / ENTRYPOINT</span><span class="v">The two that decide what actually runs, and the pair people get wrong most often. That is the whole of Lesson 4.3.</span></div>
</div>
<pre><code>docker rmi voltest &gt;/dev/null 2&gt;&amp;1; docker volume prune -f &gt;/dev/null</code></pre>

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
<a class="link-card codelab" href="/code-lab/docker\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: the instruction set</span><span class="lc-sub">Graded exercises: replace an <code>ADD</code> with a verifiable <code>RUN curl</code>, fix an image that loses files to a <code>VOLUME</code>, add a healthcheck and labels, and explain why <code>USER</code> is placed where it is.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> <code>RUN chown -R node:node /app</code> after copying. It looks harmless and it duplicates every file in <code>/app</code> into a new layer, because changing a file's metadata is a write and writes copy up (Lesson 1.2). On a <code>node_modules</code> with 40,000 files that is hundreds of megabytes added to the image for a permission change. Use <code>COPY --chown=node:node</code> instead, which sets ownership as the files are written and costs nothing. The same applies to <code>RUN chmod -R</code>: prefer <code>COPY --chmod</code>.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Put <code># syntax=docker/dockerfile:1</code> on the first line of every Dockerfile — it unlocks cache mounts, secret mounts and heredocs at no cost. Use <code>COPY</code>, not <code>ADD</code>: <code>ADD</code>'s auto-extract and URL download are both surprising, and the URL form does not verify anything. And do not put <code>VOLUME</code> in your own application image — it discards files written afterwards and leaks an anonymous volume on every run.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Mọi chỉ thị, và nó thật sự làm gì</h2>
<p class="lead">Dockerfile có mười bảy chỉ thị. Bạn sẽ dùng chín cái liên tục, bốn cái thi thoảng, và bốn cái gần như không bao giờ — nhưng vài cái bạn dùng hằng ngày lại có hành vi KHÔNG hiển nhiên, và hai trong số đó thật sự nguy hiểm trong ảnh của chính bạn.</p>

<h3>Bắt đầu bằng dòng syntax</h3>
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
  <div class="kv"><span class="k">ARG trước FROM</span><span class="v">Đây là chỗ DUY NHẤT một <code>ARG</code> được đứng trước <code>FROM</code> đầu tiên, để bạn tham số hoá cái nền: <code>ARG NODE_VERSION=22</code> rồi <code>FROM node:\${NODE_VERSION}-alpine</code>. Lưu ý sau đó nó nằm ngoài phạm vi bên trong stage (Bài 4.4).</span></div>
</div>

<h3>RUN — cái tốn tiền</h3>
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

<h3>COPY so với ADD</h3>
<pre><code>COPY package.json ./                        <span class="tok-comment"># cái bạn muốn, 95% số lần</span>
COPY --chown=node:node src ./src            <span class="tok-comment"># đặt quyền sở hữu ngay lúc chép</span>
COPY --chmod=755 entrypoint.sh /usr/local/bin/
COPY --from=build /app/dist ./dist          <span class="tok-comment"># từ một stage khác</span>
COPY --link ./static /www                   <span class="tok-comment"># tầng độc lập, cache tốt hơn</span>

ADD https://example.com/file.tar.gz /tmp/   <span class="tok-comment"># ADD tải được URL…</span>
ADD archive.tar.gz /opt/                    <span class="tok-comment"># …và TỰ GIẢI NÉN tar ở máy</span></code></pre>
<div class="callout warn"><strong>Hãy dùng <code>COPY</code> trừ khi bạn thật sự cần một trong hai hành vi phụ của <code>ADD</code></strong> — và cả hai đều là cái bẫy. <code>ADD</code> tự giải nén kho tar ở máy, nên <code>ADD data.tar.gz /opt/</code> âm thầm bung nó ra thay vì chép, và điều đó gây bất ngờ nếu bạn muốn cái FILE. Còn <code>ADD &lt;url&gt;</code> thì tải về mà KHÔNG kiểm tổng và không vô hiệu hoá cache khi nội dung ở xa đổi, nên một lượt dựng có thể âm thầm đem đi những byte khác. Với file ở xa thì <code>RUN curl -fsSL url -o file &amp;&amp; echo "sha256 file" | sha256sum -c</code> là tường minh và kiểm chứng được.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">--chown / --chmod</span><span class="v">Đặt quyền sở hữu và chế độ NGAY LÚC chép thay vì một lệnh <code>RUN chown</code> theo sau — cái đó sẽ nhân đôi mọi file vừa chép vào một tầng mới, làm phình gấp đôi phần đó của ảnh.</span></div>
  <div class="kv"><span class="k">--from=stage</span><span class="v">Chép ra từ một stage trước đó, hoặc thậm chí từ một ảnh khác: <code>COPY --from=nginx:alpine /etc/nginx/nginx.conf ./</code> chạy được và là một cách gọn để lấy một file ra khỏi một cái ảnh.</span></div>
  <div class="kv"><span class="k">--link</span><span class="v">Tạo tầng đó ĐỘC LẬP với trạng thái hệ thống file trước đó, nên một tầng trước thay đổi không vô hiệu hoá nó. Một thắng lợi rẻ với tài nguyên tĩnh lớn; cần dòng syntax.</span></div>
  <div class="kv"><span class="k">Dấu gạch chéo cuối CÓ ý nghĩa</span><span class="v"><code>COPY file /dest</code> làm <code>/dest</code> thành một FILE; <code>COPY file /dest/</code> đặt nó vào bên trong một thư mục. Với nhiều nguồn thì đích BẮT BUỘC phải kết thúc bằng dấu gạch chéo.</span></div>
  <div class="kv"><span class="k">Ngữ nghĩa thư mục khác cp</span><span class="v"><code>COPY src ./src</code> chép <em>NỘI DUNG</em> của <code>src</code> vào <code>./src</code>. Không có cách nào chép chính cái thư mục mà vẫn giữ tên nó ở cấp trên — bạn đặt tên cho ĐÍCH thay vào đó.</span></div>
</div>

<h3>Các chỉ thị siêu dữ liệu</h3>
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
  <div class="kv"><span class="k">STOPSIGNAL quan trọng với cơ sở dữ liệu</span><span class="v">PostgreSQL coi SIGQUIT là "tắt nhanh" còn SIGTERM là "chờ máy khách xong". Sai chỗ này là khác biệt giữa một cú dừng sạch sẽ với mười giây hết giờ rồi SIGKILL (Bài 1.3).</span></div>
  <div class="kv"><span class="k">SHELL với pipefail</span><span class="v"><code>sh -c</code> mặc định BỎ QUA lỗi ở giữa một ống dẫn, nên <code>RUN curl … | tar x</code> vẫn thành công kể cả khi curl hỏng. Đặt <code>SHELL ["/bin/bash","-eo","pipefail","-c"]</code> sửa chuyện đó cho mọi <code>RUN</code> phía sau — đáng làm trong bất kỳ ảnh nào có bash.</span></div>
  <div class="kv"><span class="k">LABEL thì miễn phí và tìm được</span><span class="v">Không tốn byte nào trong ảnh, và <code>docker image ls --filter "label=…"</code> tìm ra chúng. Hãy dùng những cái tên <code>org.opencontainers.image.*</code> (Bài 3.1).</span></div>
</div>

<h3>VOLUME — thường là một sai lầm trong ảnh của chính bạn</h3>
<pre><code>docker build -q -t voltest - &lt;&lt;'EOF'
FROM alpine
VOLUME /data
RUN echo hello &gt; /data/file.txt
CMD ["cat", "/data/file.txt"]
EOF
docker run --rm voltest 2&gt;&amp;1 | head -2
docker volume ls -f dangling=true --format '{{.Name}}' | head -2</code></pre>
<div class="out">cat: can't open '/data/file.txt': No such file or directory
7c3a9f2e1d8b4a5c6f7e8d9c0b1a2938475665748392a1b0c9d8e7f6a5b4c3d2</div>
<div class="callout warn"><strong>Hai bất ngờ trong năm dòng.</strong> Thứ nhất, những file được ghi vào một đường dẫn <code>VOLUME</code> ở một lệnh <code>RUN</code> <em>SAU ĐÓ</em> đều bị VỨT — volume được tạo mới lúc container khởi động và che khuất bất cứ thứ gì ảnh có ở đó. Thứ hai, MỌI lệnh <code>docker run</code> của cái ảnh này âm thầm tạo một volume vô danh mới với tên ngẫu nhiên, và chẳng có gì dọn nó (Bài 3.5). <code>VOLUME</code> thì phù hợp trong một ảnh cơ sở dữ liệu công bố cho người khác dùng. Trong ảnh ứng dụng của bạn, nó lấy mất quyền kiểm soát của người chạy, và họ hoàn toàn diễn đạt được cùng ý đó bằng <code>-v</code> khi họ thật sự muốn.</div>

<h3>Những cái hiếm gặp</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ONBUILD</span><span class="v">Đăng ký một chỉ thị sẽ chạy khi NGƯỜI KHÁC dựng <code>FROM</code> ảnh của bạn. Mạnh và khó hiểu — lượt dựng của con làm những việc không nằm trong Dockerfile của con. Dựng nhiều tầng đã khiến nó gần như lỗi thời.</span></div>
  <div class="kv"><span class="k">ARG</span><span class="v">Chỉ có lúc dựng, và nhìn thấy được trong <code>docker history</code>. Bài 4.4 nói tử tế về nó, gồm cả lý do nó KHÔNG BAO GIỜ được giữ một bí mật.</span></div>
  <div class="kv"><span class="k">MAINTAINER</span><span class="v">Đã ngừng dùng. Hãy dùng <code>LABEL org.opencontainers.image.authors="…"</code>.</span></div>
  <div class="kv"><span class="k">CMD / ENTRYPOINT</span><span class="v">Hai chỉ thị quyết định thứ THẬT SỰ chạy, và là cặp mà người ta hiểu sai nhiều nhất. Đó là toàn bộ Bài 4.3.</span></div>
</div>
<pre><code>docker rmi voltest &gt;/dev/null 2&gt;&amp;1; docker volume prune -f &gt;/dev/null</code></pre>

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
<a class="link-card codelab" href="/code-lab/docker\${REF}" target="_blank" rel="noopener">
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

<h3>Shell form versus exec form, again</h3>
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
    1 /bin/sh -c sleep 600
PID   COMMAND
    1 sleep 600
real	0m10.31s
real	0m0.27s</div>
<div class="callout warn"><strong>Ten seconds versus a quarter of a second, on every single stop.</strong> In shell form, PID 1 is <code>/bin/sh</code>, which does not forward SIGTERM to its child and does not exit itself, so Docker waits out the grace period and SIGKILLs everything (Lesson 1.3). Multiply by every deploy, every restart, every <code>compose down</code>. <strong>Always write <code>CMD</code> in exec form</strong> — as a JSON array, with double quotes, because single quotes are not valid JSON and Docker will treat the whole thing as shell form without telling you.</div>
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

<h3>The entrypoint script pattern</h3>
<pre><code>cat &gt; entrypoint.sh &lt;&lt;'EOF'
#!/bin/sh
set -e

<span class="tok-comment"># 1. Wait for dependencies (Chapter 9 does this better with healthchecks)</span>
until nc -z "\${DB_HOST:-db}" "\${DB_PORT:-5432}"; do
  echo "waiting for database…" &gt;&amp;2
  sleep 1
done

<span class="tok-comment"># 2. One-time setup — migrations, permissions, generated config</span>
if [ "\${RUN_MIGRATIONS:-true}" = "true" ]; then
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
docker run -d --name ep -e RUN_MIGRATIONS=false -e DB_HOST=127.0.0.1 ep sleep 600 &gt;/dev/null
docker exec ep ps -o pid,args | head -3</code></pre>
<div class="out">PID   COMMAND
    1 sleep 600
    9 ps -o pid,args</div>
<p>PID 1 is <code>sleep</code>, not the script and not a shell. The entrypoint ran, did its work, and replaced itself — which is exactly what you want, and what a missing <code>exec</code> silently costs you.</p>

<h3>The npm problem</h3>
<pre><code><span class="tok-comment"># Extremely common, and wrong for two separate reasons</span>
CMD ["npm", "start"]

<span class="tok-comment"># Right</span>
CMD ["node", "src/server.js"]</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">npm does not forward signals reliably</span><span class="v">It spawns your script as a child and historically has not passed SIGTERM through. Result: the ten-second stop again, even though your <code>CMD</code> is in exec form.</span></div>
  <div class="kv"><span class="k">npm adds a process and ~40MB of resident memory</span><span class="v">For no benefit at run time. In production the package manager has nothing left to do.</span></div>
  <div class="kv"><span class="k">It hides the real command</span><span class="v"><code>docker ps</code> shows <code>npm start</code>, and finding out what actually runs means reading <code>package.json</code> inside the image.</span></div>
  <div class="kv"><span class="k">The same applies to yarn, pnpm, and to python -m</span><span class="v">Any wrapper that forks rather than execs. If you must use one, check that it forwards signals, or add <code>--init</code> (Lesson 1.3).</span></div>
</div>
<pre><code>docker rm -f sf ef ep &gt;/dev/null 2&gt;&amp;1
docker rmi sf ef ep noexp tt &gt;/dev/null 2&gt;&amp;1; rm -f entrypoint.sh</code></pre>

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
<a class="link-card codelab" href="/code-lab/docker\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: make it start and stop cleanly</span><span class="lc-sub">Graded exercises: predict the output of six ENTRYPOINT/CMD combinations, fix an image that takes ten seconds to stop, write an entrypoint that keeps <code>CMD</code> overridable, and explain why a variable did not expand.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> writing the JSON array with single quotes — <code>CMD ['node', 'server.js']</code>. That is not valid JSON, so Docker falls back to treating the entire line as <em>shell form</em> and runs <code>/bin/sh -c "['node', 'server.js']"</code>, which fails with something baffling like <code>[node,: not found</code>. There is no warning at build time. Double quotes, always — and if you want to be sure, check afterwards with <code>docker image inspect img --format '{{.Config.Cmd}}'</code>: exec form shows the array intact, shell form shows <code>[/bin/sh -c …]</code>.</div>
<p class="note-ct"><strong>Three things to remember.</strong> ENTRYPOINT is the program and CMD is its default arguments; command-line arguments replace CMD and are appended to ENTRYPOINT. Always use exec form (a JSON array with double quotes) so your process is PID 1 and stops in milliseconds rather than ten seconds. And an entrypoint script must end in <code>exec "\$@"</code> — that one line is what makes the setup work disappear and hands PID 1 to your application.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>CMD, ENTRYPOINT và script entrypoint</h2>
<p class="lead">Hai chỉ thị này quyết định thứ THẬT SỰ chạy, và quan hệ giữa chúng là thứ bị hiểu sai nhiều nhất trong một Dockerfile. Cái luật gói trong một câu: <strong>ENTRYPOINT là CHƯƠNG TRÌNH, CMD là THAM SỐ MẶC ĐỊNH của nó, và câu lệnh cuối cùng là hai thứ đó nối lại.</strong> Mọi thứ khác đều suy ra từ đó.</p>

<h3>Bảng chân trị</h3>
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

<h3>Dạng shell so với dạng exec, một lần nữa</h3>
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
    1 /bin/sh -c sleep 600
PID   COMMAND
    1 sleep 600
real	0m10.31s
real	0m0.27s</div>
<div class="callout warn"><strong>Mười giây so với một phần tư giây, ở MỌI lần dừng.</strong> Ở dạng shell, PID 1 là <code>/bin/sh</code>, thứ này không chuyển tiếp SIGTERM cho con và cũng không tự thoát, nên Docker chờ hết thời gian ân hạn rồi SIGKILL tất cả (Bài 1.3). Nhân với mọi lần deploy, mọi lần khởi động lại, mọi lệnh <code>compose down</code>. <strong>Hãy LUÔN viết <code>CMD</code> ở dạng exec</strong> — một mảng JSON, với dấu nháy KÉP, bởi vì nháy đơn không phải JSON hợp lệ và Docker sẽ coi cả dòng là dạng shell mà không nói cho bạn biết.</div>
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

<h3>Mẫu script entrypoint</h3>
<pre><code>cat &gt; entrypoint.sh &lt;&lt;'EOF'
#!/bin/sh
set -e

<span class="tok-comment"># 1. Chờ những thứ phụ thuộc (Chương 9 làm việc này tốt hơn bằng healthcheck)</span>
until nc -z "\${DB_HOST:-db}" "\${DB_PORT:-5432}"; do
  echo "đang chờ cơ sở dữ liệu…" &gt;&amp;2
  sleep 1
done

<span class="tok-comment"># 2. Thiết lập một lần — migration, quyền, cấu hình được sinh ra</span>
if [ "\${RUN_MIGRATIONS:-true}" = "true" ]; then
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
docker run -d --name ep -e RUN_MIGRATIONS=false -e DB_HOST=127.0.0.1 ep sleep 600 &gt;/dev/null
docker exec ep ps -o pid,args | head -3</code></pre>
<div class="out">PID   COMMAND
    1 sleep 600
    9 ps -o pid,args</div>
<p>PID 1 là <code>sleep</code>, không phải cái script và cũng không phải một cái shell. Entrypoint đã chạy, làm xong việc của nó, rồi TỰ THAY THẾ MÌNH — và đó chính xác là thứ bạn muốn, và là thứ mà một chữ <code>exec</code> bị quên sẽ âm thầm lấy đi.</p>

<h3>Bài toán npm</h3>
<pre><code><span class="tok-comment"># Cực kỳ phổ biến, và sai vì hai lý do riêng biệt</span>
CMD ["npm", "start"]

<span class="tok-comment"># Đúng</span>
CMD ["node", "src/server.js"]</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">npm không chuyển tiếp tín hiệu một cách đáng tin</span><span class="v">Nó sinh script của bạn ra làm tiến trình con và trong lịch sử vẫn không chuyển SIGTERM qua. Kết quả: lại là cú dừng mười giây, dù <code>CMD</code> của bạn viết ở dạng exec.</span></div>
  <div class="kv"><span class="k">npm thêm một tiến trình và ~40MB bộ nhớ thường trú</span><span class="v">Mà chẳng đem lại lợi ích gì lúc chạy. Trên production thì trình quản lý gói chẳng còn việc gì để làm.</span></div>
  <div class="kv"><span class="k">Nó CHE MẤT câu lệnh thật</span><span class="v"><code>docker ps</code> hiện ra <code>npm start</code>, và muốn biết thứ gì thật sự chạy thì phải đi đọc <code>package.json</code> bên trong ảnh.</span></div>
  <div class="kv"><span class="k">Điều tương tự áp cho yarn, pnpm, và python -m</span><span class="v">Mọi lớp bọc rẽ nhánh thay vì exec. Nếu buộc phải dùng một cái thì hãy kiểm xem nó có chuyển tiếp tín hiệu không, hoặc thêm <code>--init</code> (Bài 1.3).</span></div>
</div>
<pre><code>docker rm -f sf ef ep &gt;/dev/null 2&gt;&amp;1
docker rmi sf ef ep noexp tt &gt;/dev/null 2&gt;&amp;1; rm -f entrypoint.sh</code></pre>

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
<a class="link-card codelab" href="/code-lab/docker\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: khởi động và dừng cho sạch</span><span class="lc-sub">Bài chấm điểm: đoán output của sáu tổ hợp ENTRYPOINT/CMD, sửa một cái ảnh mất mười giây để dừng, viết một entrypoint giữ cho <code>CMD</code> vẫn ghi đè được, và giải thích vì sao một biến không được khai triển.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> viết mảng JSON bằng dấu nháy ĐƠN — <code>CMD ['node', 'server.js']</code>. Đó không phải JSON hợp lệ, nên Docker lùi về coi cả dòng là <em>DẠNG SHELL</em> rồi chạy <code>/bin/sh -c "['node', 'server.js']"</code>, và nó hỏng với một thông báo khó hiểu kiểu <code>[node,: not found</code>. Không có cảnh báo nào lúc dựng. Hãy dùng nháy KÉP, luôn luôn — và nếu muốn chắc chắn thì kiểm lại sau bằng <code>docker image inspect img --format '{{.Config.Cmd}}'</code>: dạng exec hiện ra cái mảng còn nguyên, dạng shell hiện ra <code>[/bin/sh -c …]</code>.</div>
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
  <div class="kv"><span class="k">Undeclared build args are ignored</span><span class="v"><code>--build-arg FOO=bar</code> without a matching <code>ARG FOO</code> prints a warning and does nothing. A typo therefore fails silently — check the warning line in the build output.</span></div>
  <div class="kv"><span class="k">ARG has a default; ENV needs a value</span><span class="v"><code>ARG PORT=3000</code> gives a fallback used when nothing is passed. <code>ARG PORT</code> alone is legal and yields an empty string, which is the source of most "why is this blank" confusion.</span></div>
  <div class="kv"><span class="k">ENV can be seeded from ARG</span><span class="v"><code>ARG VERSION=1.0</code> then <code>ENV APP_VERSION=\${VERSION}</code> is the standard way to turn a build-time value into a run-time one.</span></div>
  <div class="kv"><span class="k">ENV wins over ARG</span><span class="v">If both have the same name, <code>ENV</code> takes precedence for the rest of the build. Avoid using the same name for both; it makes the file impossible to read.</span></div>
</div>

<h3>Scope: the rule that catches everyone</h3>
<pre><code># syntax=docker/dockerfile:1
ARG NODE_VERSION=22                      <span class="tok-comment"># before FROM: only usable IN FROM lines</span>

FROM node:\${NODE_VERSION}-alpine AS build
ARG NODE_VERSION                         <span class="tok-comment"># must RE-DECLARE to use it in this stage</span>
RUN echo "building on node \${NODE_VERSION}"

FROM node:\${NODE_VERSION}-alpine
RUN echo "NODE_VERSION here is: '\${NODE_VERSION}'"   <span class="tok-comment"># EMPTY — not re-declared</span></code></pre>
<div class="out">building on node 22
NODE_VERSION here is: ''</div>
<div class="callout warn"><strong>An <code>ARG</code> declared before the first <code>FROM</code> is outside every stage.</strong> It can be used in <code>FROM</code> lines and nowhere else. To use it inside a stage you must write <code>ARG NAME</code> again in that stage — with no value, which inherits the outer one. This is documented and still surprises everyone once, because the symptom is a silently empty variable rather than an error. The same applies per stage in a multi-stage build: each stage needs its own re-declaration.</div>

<h3>The build args Docker gives you for free</h3>
<pre><code># syntax=docker/dockerfile:1
FROM --platform=\$BUILDPLATFORM alpine
ARG TARGETPLATFORM TARGETOS TARGETARCH BUILDPLATFORM
RUN echo "building on \$BUILDPLATFORM for \$TARGETPLATFORM (\$TARGETOS/\$TARGETARCH)"</code></pre>
<div class="out">building on linux/amd64 for linux/arm64 (linux/arm64)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">TARGETPLATFORM / TARGETOS / TARGETARCH</span><span class="v">What you are building <em>for</em>. The basis of cross-compilation (Lesson 3.4) — pass them straight to <code>GOOS</code>/<code>GOARCH</code>, or use them to pick the right prebuilt binary.</span></div>
  <div class="kv"><span class="k">BUILDPLATFORM / BUILDOS / BUILDARCH</span><span class="v">What you are building <em>on</em>. Used with <code>FROM --platform=\$BUILDPLATFORM</code> to keep the compiler stage native and fast.</span></div>
  <div class="kv"><span class="k">HTTP_PROXY, HTTPS_PROXY, NO_PROXY, FTP_PROXY</span><span class="v">Predefined and, unusually, excluded from <code>docker history</code>. Docker passes them through so builds work behind a corporate proxy without you declaring anything.</span></div>
  <div class="kv"><span class="k">BUILDKIT_SYNTAX and friends</span><span class="v">Internal knobs you will rarely touch, but worth knowing they exist when a build behaves oddly and something in CI is setting them.</span></div>
</div>

<h3>ARG is not a secret</h3>
<pre><code>docker build --build-arg NPM_TOKEN=npm_SuperSecret123 -q -t leaky - &lt;&lt;'EOF' &gt;/dev/null
FROM alpine
ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" &gt; /root/.npmrc \\
 &amp;&amp; echo "pretending to install" \\
 &amp;&amp; rm /root/.npmrc
EOF
docker history leaky --no-trunc --format '{{.CreatedBy}}' | grep -i token | head -1</code></pre>
<div class="out">ARG NPM_TOKEN=npm_SuperSecret123</div>
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

<h3>The NODE_ENV trap</h3>
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
<a class="link-card codelab" href="/code-lab/docker\${REF}" target="_blank" rel="noopener">
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
  <div class="kv"><span class="k">Build arg không khai báo thì bị BỎ QUA</span><span class="v"><code>--build-arg FOO=bar</code> mà không có <code>ARG FOO</code> tương ứng thì in một cảnh báo rồi chẳng làm gì. Nên một lỗi gõ sẽ hỏng trong im lặng — hãy để ý dòng cảnh báo trong output lúc dựng.</span></div>
  <div class="kv"><span class="k">ARG có giá trị mặc định; ENV thì cần một giá trị</span><span class="v"><code>ARG PORT=3000</code> cho một giá trị dự phòng dùng khi không truyền gì. Riêng <code>ARG PORT</code> thì hợp lệ và cho ra chuỗi RỖNG, và đó là nguồn của phần lớn sự bối rối kiểu "sao cái này trống trơn".</span></div>
  <div class="kv"><span class="k">ENV nhận giá trị được từ ARG</span><span class="v"><code>ARG VERSION=1.0</code> rồi <code>ENV APP_VERSION=\${VERSION}</code> là cách tiêu chuẩn để biến một giá trị lúc dựng thành một giá trị lúc chạy.</span></div>
  <div class="kv"><span class="k">ENV thắng ARG</span><span class="v">Nếu cả hai cùng tên thì <code>ENV</code> được ưu tiên cho phần còn lại của lượt dựng. Hãy tránh dùng cùng một cái tên cho cả hai; nó khiến file không đọc nổi.</span></div>
</div>

<h3>Phạm vi: cái luật bẫy tất cả mọi người</h3>
<pre><code># syntax=docker/dockerfile:1
ARG NODE_VERSION=22                      <span class="tok-comment"># trước FROM: CHỈ dùng được TRONG các dòng FROM</span>

FROM node:\${NODE_VERSION}-alpine AS build
ARG NODE_VERSION                         <span class="tok-comment"># phải KHAI BÁO LẠI mới dùng được trong stage này</span>
RUN echo "đang dựng trên node \${NODE_VERSION}"

FROM node:\${NODE_VERSION}-alpine
RUN echo "NODE_VERSION ở đây là: '\${NODE_VERSION}'"   <span class="tok-comment"># RỖNG — chưa khai báo lại</span></code></pre>
<div class="out">đang dựng trên node 22
NODE_VERSION ở đây là: ''</div>
<div class="callout warn"><strong>Một <code>ARG</code> khai báo trước <code>FROM</code> đầu tiên thì nằm NGOÀI mọi stage.</strong> Nó dùng được trong các dòng <code>FROM</code> và không ở đâu khác. Muốn dùng nó BÊN TRONG một stage thì bạn phải viết <code>ARG TÊN</code> lần nữa trong stage đó — không kèm giá trị, và nó thừa hưởng giá trị bên ngoài. Chuyện này có ghi trong tài liệu và vẫn làm mọi người bất ngờ đúng một lần, vì triệu chứng là một biến RỖNG trong im lặng chứ không phải một cái lỗi. Điều tương tự áp cho từng stage trong một lượt dựng nhiều tầng: mỗi stage cần khai báo lại của riêng nó.</div>

<h3>Những build arg Docker cho bạn miễn phí</h3>
<pre><code># syntax=docker/dockerfile:1
FROM --platform=\$BUILDPLATFORM alpine
ARG TARGETPLATFORM TARGETOS TARGETARCH BUILDPLATFORM
RUN echo "đang dựng trên \$BUILDPLATFORM cho \$TARGETPLATFORM (\$TARGETOS/\$TARGETARCH)"</code></pre>
<div class="out">đang dựng trên linux/amd64 cho linux/arm64 (linux/arm64)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">TARGETPLATFORM / TARGETOS / TARGETARCH</span><span class="v">Thứ bạn đang dựng <em>CHO</em>. Nền tảng của biên dịch chéo (Bài 3.4) — hãy truyền thẳng chúng vào <code>GOOS</code>/<code>GOARCH</code>, hoặc dùng chúng để chọn đúng chương trình dựng sẵn.</span></div>
  <div class="kv"><span class="k">BUILDPLATFORM / BUILDOS / BUILDARCH</span><span class="v">Thứ bạn đang dựng <em>TRÊN</em>. Dùng với <code>FROM --platform=\$BUILDPLATFORM</code> để giữ cho stage biên dịch chạy native và nhanh.</span></div>
  <div class="kv"><span class="k">HTTP_PROXY, HTTPS_PROXY, NO_PROXY, FTP_PROXY</span><span class="v">Được định nghĩa sẵn và, khác thường thay, bị LOẠI khỏi <code>docker history</code>. Docker truyền chúng xuyên qua để bản dựng chạy được sau một proxy doanh nghiệp mà bạn không phải khai báo gì.</span></div>
  <div class="kv"><span class="k">BUILDKIT_SYNTAX và họ hàng</span><span class="v">Những núm vặn nội bộ mà bạn hiếm khi đụng tới, nhưng đáng biết là chúng tồn tại khi một lượt dựng hành xử lạ và có thứ gì đó trong CI đang đặt chúng.</span></div>
</div>

<h3>ARG KHÔNG phải một bí mật</h3>
<pre><code>docker build --build-arg NPM_TOKEN=npm_SuperSecret123 -q -t leaky - &lt;&lt;'EOF' &gt;/dev/null
FROM alpine
ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" &gt; /root/.npmrc \\
 &amp;&amp; echo "giả vờ cài đặt" \\
 &amp;&amp; rm /root/.npmrc
EOF
docker history leaky --no-trunc --format '{{.CreatedBy}}' | grep -i token | head -1</code></pre>
<div class="out">ARG NPM_TOKEN=npm_SuperSecret123</div>
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

<h3>Cái bẫy NODE_ENV</h3>
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
<a class="link-card codelab" href="/code-lab/docker\${REF}" target="_blank" rel="noopener">
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

<h3>2 · Next.js, with standalone output</h3>
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
ENV NEXT_PUBLIC_API_URL=\${NEXT_PUBLIC_API_URL}
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
  <div class="kv"><span class="k">output: 'standalone'</span><span class="v">Next traces exactly which files from <code>node_modules</code> the server actually needs and writes a self-contained tree. It turns a 1.2GB image into roughly 200MB, and it is one line of config.</span></div>
  <div class="kv"><span class="k">HOSTNAME=0.0.0.0</span><span class="v">The standalone server binds to <code>localhost</code> by default, which is unreachable from outside the container. This single variable is the difference between a working container and a mysterious connection-refused (Lesson 2.2).</span></div>
  <div class="kv"><span class="k">static and public are copied separately</span><span class="v">The standalone output deliberately excludes them, expecting a CDN. Copy them in or every stylesheet and image 404s.</span></div>
  <div class="kv"><span class="k">NEXT_PUBLIC_* is build-time</span><span class="v">Inlined into the JavaScript bundle during <code>npm run build</code>. Changing it on the server and restarting does nothing — you need a rebuild per environment (Lesson 4.4).</span></div>
  <div class="kv"><span class="k">Anything under public/ is fixed at server start</span><span class="v">Next indexes <code>public/</code> when the process starts, so regenerating assets while it runs gives 404s for files that visibly exist. In a container this is invisible because every deploy is a new process — which is one of the quieter reasons containers make this class of bug go away.</span></div>
</div>

<h3>3 · Python (FastAPI, Django)</h3>
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
  <div class="kv"><span class="k">slim, not alpine</span><span class="v">Alpine uses musl, and Python wheels are built for glibc — so <code>pip install</code> falls back to compiling from source, turning a 20-second install into 10 minutes and sometimes failing outright. <code>-slim</code> is Debian-based and only slightly larger.</span></div>
  <div class="kv"><span class="k">build-essential in the build stage only</span><span class="v">Compilers are needed to build wheels and are dead weight at run time. The final stage installs only <code>libpq5</code>, the runtime library.</span></div>
  <div class="kv"><span class="k">--host 0.0.0.0</span><span class="v">Same trap as Next.js: uvicorn, Flask and Django's dev server all default to <code>127.0.0.1</code>, which is unreachable from outside the container.</span></div>
  <div class="kv"><span class="k">--no-install-recommends</span><span class="v">Debian pulls in a surprising amount of extra software without it. Always pair it with <code>rm -rf /var/lib/apt/lists/*</code> in the same <code>RUN</code> (Lesson 1.2).</span></div>
</div>

<h3>4 · Go (or Rust) — a static binary</h3>
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
<div class="out">goapp:1.0 12.4MB
golang:1.23-alpine 265MB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">CGO_ENABLED=0</span><span class="v">Produces a truly static binary with no libc dependency, which is what makes <code>distroless/static</code> or even <code>FROM scratch</code> possible. Leave CGO on and the binary needs glibc and will not start.</span></div>
  <div class="kv"><span class="k">-ldflags="-s -w"</span><span class="v">Strips the symbol table and DWARF debug info — typically 25–30% off the binary for no functional change.</span></div>
  <div class="kv"><span class="k">FROM --platform=\$BUILDPLATFORM</span><span class="v">Compile natively and cross-compile to the target, rather than emulating the whole toolchain. Minutes versus tens of minutes (Lesson 3.4).</span></div>
  <div class="kv"><span class="k">distroless:nonroot</span><span class="v">No shell, no package manager, and it already runs as UID 65532. Debug it with the sidecar technique from Lesson 2.3 — and if you need TLS, use <code>distroless/static</code>, which includes CA certificates, not <code>scratch</code>, which does not.</span></div>
  <div class="kv"><span class="k">12MB total</span><span class="v">Twenty times smaller than the toolchain image it was built with. This is the clearest demonstration of why multi-stage exists, and Chapter 6 generalises it.</span></div>
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

<h3>What all five have in common</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Dependencies before source</span><span class="lz-t">COPY package.json → install → COPY .</span><span class="lz-d">The single most valuable ordering decision. Chapter 5 measures exactly what it saves.</span></div>
  <div class="lz-step"><span class="lz-k">Build tools stay in the build stage</span><span class="lz-t">compilers, dev dependencies, source</span><span class="lz-d">Nothing that only the build needed appears in the final image. Chapter 6 pushes this further.</span></div>
  <div class="lz-step"><span class="lz-k">Bind to 0.0.0.0</span><span class="lz-t">not 127.0.0.1</span><span class="lz-d">Three of the five frameworks default to loopback, which is unreachable from outside the container. It is the most common "the container runs but I cannot connect" cause.</span></div>
  <div class="lz-step"><span class="lz-k">A non-root USER, late</span><span class="lz-t">after the RUNs that need root</span><span class="lz-d">Free in every ecosystem, and it is the cheapest security improvement available.</span></div>
  <div class="lz-step"><span class="lz-k">Exec-form CMD, and a healthcheck</span><span class="lz-t">["node","dist/index.js"]</span><span class="lz-d">Stops cleanly in milliseconds, and Compose can wait for it to be ready (Chapters 1.3 and 9).</span></div>
</div>

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
<a class="link-card codelab" href="/code-lab/docker\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: write the five</span><span class="lc-sub">Graded exercises: containerise a Node API, fix a Next.js image that 404s its own CSS, diagnose a Python container with empty logs, and get a Go binary into an image under 15MB.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> a server bound to <code>127.0.0.1</code> inside the container. <code>docker run -p 3000:3000</code> succeeds, <code>docker ps</code> shows the port mapped, the logs say "listening on 127.0.0.1:3000" — and <code>curl localhost:3000</code> from the host gets connection refused. Inside the container, <code>127.0.0.1</code> is the container's own loopback and nothing outside its network namespace can reach it (Lesson 1.1). The fix is per-framework and always the same idea: <code>HOSTNAME=0.0.0.0</code> for Next.js, <code>--host 0.0.0.0</code> for uvicorn and Vite, <code>app.listen(3000, '0.0.0.0')</code> for Express, <code>0.0.0.0:8080</code> for Go. Confirm with <code>docker exec c netstat -tln</code>, or check the Address column in <code>ss -tlnp</code> from a sidecar.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Every recipe here installs dependencies before copying source, and keeps compilers and dev dependencies out of the final stage — those two habits carry across every language. Bind to <code>0.0.0.0</code>, not <code>127.0.0.1</code>: three of these five frameworks default to loopback and produce a container that runs perfectly and answers nobody. And each ecosystem has one specific trap — Prisma's engine target, Next's <code>HOSTNAME</code>, Python's buffering and musl wheels, Go's <code>CGO_ENABLED</code> — worth checking before you spend an afternoon on it.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Công thức: Node, Next.js, Python, Go, trang tĩnh</h2>
<p class="lead">Năm Dockerfile bạn chép về và chỉnh lại được ngay hôm nay. Mỗi cái là hình hài mà hệ sinh thái đó đã hội tụ về, với phần lý lẽ đặt ngay cạnh từng quyết định — và mỗi cái có một cái bẫy riêng của ngôn ngữ ấy, thứ ngốn của bạn một buổi chiều nếu gặp lần đầu.</p>

<h3>1 · Một API Node (Express, Fastify, NestJS)</h3>
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

<h3>2 · Next.js, với output standalone</h3>
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
ENV NEXT_PUBLIC_API_URL=\${NEXT_PUBLIC_API_URL}
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
  <div class="kv"><span class="k">output: 'standalone'</span><span class="v">Next lần theo chính xác những file nào trong <code>node_modules</code> mà máy chủ thật sự cần rồi ghi ra một cây khép kín. Nó biến một ảnh 1,2GB thành khoảng 200MB, và nó là MỘT dòng cấu hình.</span></div>
  <div class="kv"><span class="k">HOSTNAME=0.0.0.0</span><span class="v">Máy chủ standalone mặc định gắn vào <code>localhost</code>, và chỗ đó không với tới được từ bên ngoài container. Riêng cái biến này là khác biệt giữa một container chạy được và một cú connection-refused bí hiểm (Bài 2.2).</span></div>
  <div class="kv"><span class="k">static và public được chép RIÊNG</span><span class="v">Output standalone cố ý loại chúng ra, vì nó cho rằng bạn dùng CDN. Không chép vào thì mọi stylesheet và hình ảnh đều 404.</span></div>
  <div class="kv"><span class="k">NEXT_PUBLIC_* là lúc DỰNG</span><span class="v">Được nhúng thẳng vào gói JavaScript trong lúc <code>npm run build</code>. Đổi nó trên máy chủ rồi khởi động lại thì chẳng làm gì cả — bạn cần DỰNG LẠI cho mỗi môi trường (Bài 4.4).</span></div>
  <div class="kv"><span class="k">Mọi thứ dưới public/ bị chốt lúc server khởi động</span><span class="v">Next đánh chỉ mục <code>public/</code> khi tiến trình khởi động, nên sinh lại tài nguyên trong lúc nó đang chạy sẽ cho 404 với những file nằm sờ sờ ở đó. Trong container thì chuyện này vô hình vì mọi lần deploy là một tiến trình mới — và đó là một trong những lý do ít ai nhắc tới về việc container làm lớp bọ này biến mất.</span></div>
</div>

<h3>3 · Python (FastAPI, Django)</h3>
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
  <div class="kv"><span class="k">slim, đừng alpine</span><span class="v">Alpine dùng musl, còn wheel của Python thì dựng cho glibc — nên <code>pip install</code> lùi về biên dịch từ mã nguồn, biến một lượt cài 20 giây thành 10 phút và đôi khi hỏng hẳn. <code>-slim</code> dựa trên Debian và chỉ lớn hơn một chút.</span></div>
  <div class="kv"><span class="k">build-essential CHỈ ở stage dựng</span><span class="v">Trình biên dịch cần để dựng wheel và là gánh nặng chết ở lúc chạy. Stage cuối chỉ cài <code>libpq5</code>, tức thư viện lúc chạy.</span></div>
  <div class="kv"><span class="k">--host 0.0.0.0</span><span class="v">Vẫn cái bẫy của Next.js: uvicorn, Flask và máy chủ dev của Django đều mặc định <code>127.0.0.1</code>, chỗ không với tới được từ bên ngoài container.</span></div>
  <div class="kv"><span class="k">--no-install-recommends</span><span class="v">Debian kéo về một lượng phần mềm phụ đáng ngạc nhiên nếu không có nó. Hãy luôn ghép nó với <code>rm -rf /var/lib/apt/lists/*</code> trong CÙNG một <code>RUN</code> (Bài 1.2).</span></div>
</div>

<h3>4 · Go (hoặc Rust) — một chương trình tĩnh</h3>
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
<div class="out">goapp:1.0 12.4MB
golang:1.23-alpine 265MB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">CGO_ENABLED=0</span><span class="v">Tạo ra một chương trình TĨNH thật sự, không phụ thuộc libc, và đó là thứ khiến <code>distroless/static</code> hay thậm chí <code>FROM scratch</code> khả thi. Để CGO bật thì chương trình cần glibc và sẽ không khởi động được.</span></div>
  <div class="kv"><span class="k">-ldflags="-s -w"</span><span class="v">Cắt bảng ký hiệu và thông tin gỡ lỗi DWARF — thường bớt 25–30% kích thước chương trình mà không đổi chức năng gì.</span></div>
  <div class="kv"><span class="k">FROM --platform=\$BUILDPLATFORM</span><span class="v">Biên dịch NATIVE rồi biên dịch chéo sang đích, thay vì mô phỏng cả bộ công cụ. Vài phút so với vài chục phút (Bài 3.4).</span></div>
  <div class="kv"><span class="k">distroless:nonroot</span><span class="v">Không shell, không trình quản lý gói, và nó đã chạy sẵn dưới UID 65532. Hãy gỡ lỗi nó bằng kỹ thuật container phụ ở Bài 2.3 — và nếu bạn cần TLS thì dùng <code>distroless/static</code>, cái này có sẵn chứng chỉ CA, chứ đừng dùng <code>scratch</code>, cái đó thì không.</span></div>
  <div class="kv"><span class="k">Tổng cộng 12MB</span><span class="v">Nhỏ hơn hai mươi lần cái ảnh bộ công cụ đã dựng ra nó. Đây là minh hoạ rõ ràng nhất cho lý do dựng nhiều tầng tồn tại, và Chương 6 tổng quát hoá nó.</span></div>
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

<h3>Năm cái đó có gì chung</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Thư viện trước, mã nguồn sau</span><span class="lz-t">COPY package.json → cài → COPY .</span><span class="lz-d">Quyết định về thứ tự có giá trị nhất. Chương 5 ĐO chính xác nó tiết kiệm được bao nhiêu.</span></div>
  <div class="lz-step"><span class="lz-k">Công cụ dựng ở lại stage dựng</span><span class="lz-t">trình biên dịch, thư viện dev, mã nguồn</span><span class="lz-d">Không thứ gì chỉ cần cho lúc dựng lại có mặt trong ảnh cuối. Chương 6 đẩy chuyện này đi xa hơn.</span></div>
  <div class="lz-step"><span class="lz-k">Gắn vào 0.0.0.0</span><span class="lz-t">không phải 127.0.0.1</span><span class="lz-d">Ba trong năm framework này mặc định gắn vào loopback, chỗ không với tới được từ ngoài container. Đó là nguyên nhân phổ biến nhất của "container chạy mà tôi không kết nối được".</span></div>
  <div class="lz-step"><span class="lz-k">Một USER không phải root, đặt MUỘN</span><span class="lz-t">sau những lệnh RUN cần quyền root</span><span class="lz-d">Miễn phí trong mọi hệ sinh thái, và là cải thiện an ninh rẻ nhất có sẵn.</span></div>
  <div class="lz-step"><span class="lz-k">CMD dạng exec, và một healthcheck</span><span class="lz-t">["node","dist/index.js"]</span><span class="lz-d">Dừng sạch sẽ trong vài mili giây, và Compose chờ được tới lúc nó sẵn sàng (Bài 1.3 và Chương 9).</span></div>
</div>

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
<a class="link-card codelab" href="/code-lab/docker\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: viết cả năm cái</span><span class="lc-sub">Bài chấm điểm: đóng gói một API Node, sửa một ảnh Next.js 404 chính CSS của nó, chẩn đoán một container Python có log rỗng, và đưa một chương trình Go vào một cái ảnh dưới 15MB.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> một máy chủ gắn vào <code>127.0.0.1</code> bên trong container. <code>docker run -p 3000:3000</code> thành công, <code>docker ps</code> hiện cổng đã ánh xạ, log ghi "listening on 127.0.0.1:3000" — và <code>curl localhost:3000</code> từ máy chủ thì nhận connection refused. Bên trong container, <code>127.0.0.1</code> là loopback của CHÍNH container đó và không gì ngoài namespace mạng của nó với tới được (Bài 1.1). Cách chữa tuỳ framework và luôn cùng một ý: <code>HOSTNAME=0.0.0.0</code> cho Next.js, <code>--host 0.0.0.0</code> cho uvicorn và Vite, <code>app.listen(3000, '0.0.0.0')</code> cho Express, <code>0.0.0.0:8080</code> cho Go. Hãy xác nhận bằng <code>docker exec c netstat -tln</code>, hoặc nhìn cột Address trong <code>ss -tlnp</code> từ một container phụ.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Mọi công thức ở đây đều cài thư viện TRƯỚC khi chép mã nguồn, và giữ trình biên dịch với thư viện dev nằm ngoài stage cuối — hai thói quen đó mang đi được qua mọi ngôn ngữ. Hãy gắn vào <code>0.0.0.0</code>, đừng <code>127.0.0.1</code>: ba trong năm framework này mặc định gắn vào loopback và tạo ra một container chạy hoàn hảo mà chẳng trả lời ai. Và mỗi hệ sinh thái có một cái bẫy riêng — engine target của Prisma, <code>HOSTNAME</code> của Next, bộ đệm với wheel musl của Python, <code>CGO_ENABLED</code> của Go — đáng kiểm trước khi bạn ném một buổi chiều vào nó.</p>
</div>
`,
    },
    /* ─────────────────────────── 4.6 ─────────────────────────── */
    {
      title: '4.6 — Quiz: writing Dockerfiles|||4.6 — Kiểm tra: viết Dockerfile',
      slug: 'dk-4-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về ngữ cảnh dựng, .dockerignore, RUN cd, COPY với ADD, dạng exec, exec "$@", ARG so với ENV, và bẫy NODE_ENV.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on writing Dockerfiles. Every one of them is a mistake that appears in real repositories, usually more than once.</p>
<div class="callout ok">Aim for 7/8. The three that matter most: why exec form is not optional (4.3), what <code>exec "\$@"</code> does at the end of an entrypoint (4.3), and why a build arg is never a secret (4.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về việc viết Dockerfile. Câu nào cũng là một lỗi có mặt trong những kho mã thật, và thường là hơn một lần.</p>
<div class="callout ok">Hãy nhắm 7/8. Ba câu quan trọng nhất: vì sao dạng exec không phải tuỳ chọn (bài 4.3), <code>exec "\$@"</code> làm gì ở cuối một entrypoint (bài 4.3), và vì sao một build arg KHÔNG BAO GIỜ là chỗ cho bí mật (bài 4.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What is the dot at the end of docker build -t app .?|||Dấu chấm ở cuối docker build -t app . là gì?',
            options: [
              'The path to the Dockerfile|||Đường dẫn tới Dockerfile',
              'The BUILD CONTEXT — a directory packaged and sent to the daemon, and the only place COPY and ADD can read from|||NGỮ CẢNH DỰNG — một thư mục được đóng gói rồi gửi tới tiến trình nền, và là nơi DUY NHẤT mà COPY với ADD đọc được',
              'The output directory for the image|||Thư mục đầu ra cho cái ảnh',
              'A placeholder for the default tag|||Một chỗ giữ chỗ cho tag mặc định',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does RUN cd /app followed by RUN npm install fail to install in /app?|||Vì sao RUN cd /app rồi tới RUN npm install lại không cài vào /app?',
            options: [
              'npm ignores the working directory|||npm bỏ qua thư mục làm việc',
              'Each RUN is a separate shell in a separate layer, so the directory change is discarded when that instruction ends — use WORKDIR, which is stateful|||Mỗi RUN là một shell riêng trong một tầng riêng, nên việc đổi thư mục bị vứt khi chỉ thị đó kết thúc — hãy dùng WORKDIR, thứ có trạng thái',
              '/app must be created with mkdir first|||Phải mkdir tạo /app trước đã',
              'cd only works in exec form|||cd chỉ chạy ở dạng exec',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'When should you use ADD instead of COPY?|||Khi nào nên dùng ADD thay cho COPY?',
            options: [
              'Whenever the source is a directory|||Bất cứ khi nào nguồn là một thư mục',
              'Almost never — its two extra behaviours (auto-extracting local tarballs and downloading URLs without checksum verification) are both surprising; use COPY, and RUN curl with a sha256 check for remote files|||Gần như không bao giờ — hai hành vi phụ của nó (tự giải nén tar ở máy và tải URL mà không kiểm tổng) đều gây bất ngờ; hãy dùng COPY, và RUN curl kèm kiểm sha256 cho file ở xa',
              'When copying from another build stage|||Khi chép từ một stage dựng khác',
              'When you need --chown|||Khi bạn cần --chown',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your image takes exactly ten seconds to stop, every time. What is in the Dockerfile?|||Ảnh của bạn mất đúng mười giây để dừng, lần nào cũng vậy. Trong Dockerfile có gì?',
            options: [
              'A HEALTHCHECK with a long interval|||Một HEALTHCHECK với chu kỳ dài',
              'CMD in shell form (or CMD ["npm","start"]) — PID 1 becomes /bin/sh (or npm), which does not forward SIGTERM, so Docker waits out the grace period and SIGKILLs|||CMD ở dạng shell (hoặc CMD ["npm","start"]) — PID 1 thành /bin/sh (hoặc npm), thứ này không chuyển tiếp SIGTERM, nên Docker chờ hết ân hạn rồi SIGKILL',
              'A missing STOPSIGNAL instruction|||Thiếu chỉ thị STOPSIGNAL',
              'Too many layers to unmount|||Quá nhiều tầng phải gỡ gắn kết',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does exec "$@" at the end of an entrypoint script accomplish?|||exec "$@" ở cuối một script entrypoint đạt được điều gì?',
            options: [
              'It runs the script again with the same arguments|||Nó chạy lại cái script với cùng tham số',
              'It REPLACES the shell with the CMD command, so your application becomes PID 1 and receives signals — and passing "$@" keeps CMD overridable at run time|||Nó THAY THẾ cái shell bằng câu lệnh CMD, nên ứng dụng của bạn thành PID 1 và nhận được tín hiệu — còn truyền "$@" giữ cho CMD vẫn ghi đè được lúc chạy',
              'It exports all environment variables to child processes|||Nó export mọi biến môi trường cho tiến trình con',
              'It waits for all background jobs to finish|||Nó chờ mọi công việc nền chạy xong',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You pass a token with --build-arg NPM_TOKEN=... and delete the .npmrc in the same RUN. Is the token safe?|||Bạn truyền một token bằng --build-arg NPM_TOKEN=... rồi xoá .npmrc trong cùng lệnh RUN. Cái token có an toàn không?',
            options: [
              'Yes — deleting it in the same layer removes it completely|||Có — xoá trong cùng một tầng là gỡ nó đi hoàn toàn',
              'No — the value is recorded in docker history in plain text; use RUN --mount=type=secret, which writes it into no layer at all|||KHÔNG — giá trị đó được ghi vào docker history bằng chữ thường; hãy dùng RUN --mount=type=secret, nó không ghi vào tầng nào cả',
              'Only if the image is private|||Chỉ khi cái ảnh là riêng tư',
              'Yes, as long as you also add --no-cache|||Có, miễn là bạn thêm cả --no-cache',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'ARG NODE_VERSION=22 is declared before the first FROM. Why is ${NODE_VERSION} empty inside a stage?|||ARG NODE_VERSION=22 được khai báo trước FROM đầu tiên. Vì sao ${NODE_VERSION} lại rỗng bên trong một stage?',
            options: [
              'Values before FROM must be uppercase|||Giá trị trước FROM phải viết hoa',
              'An ARG before FROM is outside every stage and usable only in FROM lines — each stage that needs it must re-declare ARG NODE_VERSION with no value|||Một ARG trước FROM nằm NGOÀI mọi stage và chỉ dùng được trong các dòng FROM — mỗi stage cần nó phải khai báo lại ARG NODE_VERSION mà không kèm giá trị',
              'You must pass --build-arg for it to have any value|||Bạn phải truyền --build-arg thì nó mới có giá trị',
              'ARG cannot have a default value|||ARG không có giá trị mặc định được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A build fails at npm run build with "sh: tsc: not found", even though typescript is in devDependencies. Why?|||Một lượt dựng hỏng ở npm run build với "sh: tsc: not found", dù typescript nằm trong devDependencies. Vì sao?',
            options: [
              'typescript must be a production dependency in Docker|||Trong Docker thì typescript phải là thư viện production',
              'ENV NODE_ENV=production was set before npm ci, so npm omitted devDependencies — set NODE_ENV in the final stage, after the build|||ENV NODE_ENV=production được đặt TRƯỚC npm ci, nên npm bỏ qua devDependencies — hãy đặt NODE_ENV ở stage cuối, sau khi dựng xong',
              'The node_modules directory was excluded by .dockerignore|||Thư mục node_modules bị .dockerignore loại ra',
              'npm ci does not install binaries into node_modules/.bin|||npm ci không cài chương trình vào node_modules/.bin',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
