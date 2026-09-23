/**
 * Docker — Chương 5: tầng ảnh, cache & dựng nhanh.
 * Cache quyết định thế nào · thứ tự · cache mount · cache trong CI · chẩn đoán · quiz.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 *
 * Nâng cấp 09/2026: bài 5.0 slide (deck dk-05, 31 slide) + slide/🧪/🗂/📌 + phần đào sâu trong 5.1–5.5;
 * quiz 10 câu. Output MỚI và MỌI con số thời gian mới đo thật 23/09/2026 trên Mac M1 Max, Docker Desktop 4.91 /
 * Engine 29.8 (BuildKit 0.33, kho ảnh containerd); "backend thật" = lockfile 898 gói của một dự án sinh viên.
 * Đã sửa: sed -i (hỏng trên macOS), output builder du / --check / builder du --verbose kiểu cũ hoặc sai,
 * "driver docker âm thầm bỏ qua --cache-to" (sai với Docker 29), phiên bản action GitHub, &#36;{{ … }}.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 5 — Layers, cache & fast builds|||Chương 5 — Tầng ảnh, cache & dựng nhanh',
  description: 'Biến một lượt dựng bốn phút thành sáu giây. Cache quyết định dùng lại một tầng theo luật nào, thứ tự đúng của các chỉ thị, cache mount cho npm và apt, chia sẻ cache qua registry trong CI, và cách chẩn đoán một lượt dựng chậm.',
  lessons: [
    /* ─────────────────────────── 5.0 ─────────────────────────── */
    {
      title: '5.0 — Chapter 5 slides: the build cache in pictures|||5.0 — Slide Chương 5: cache lúc dựng bằng hình',
      slug: 'dk-5-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 31 slide của Chương 5: chuỗi khoá cache, chồng tầng HIT/MISS trước và sau khi đổi thứ tự COPY, cache mount đo thật 63 s → 9 s, cache cho CI với mode=min/max, và cách chẩn đoán một lượt dựng chậm — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Slides</span>
<h2>The whole chapter in 31 slides</h2>
<p class="lead">This chapter is about minutes you get back every day, so the slides lean on measurements: every time on them was measured on a real Mac (M1 Max, Docker Desktop 4.91, Engine 29.8) in September 2026, most of them on the real dependency list of a student backend — 898 packages in its lockfile. The central picture is the layer stack coloured green (HIT) and red (MISS): one red layer turns everything above it red.</p>
<p>Slides 3–8 belong to Lesson 5.1 (how a cache key is built), 9–12 to 5.2 (ordering: 138 s → 3.6 s), 13–18 to 5.3 (cache mounts), 19–23 to 5.4 (sharing the cache with CI) and 24–28 to 5.5 (diagnosing a slow build). The last three are the chapter's common mistakes, a cheat sheet and a 45-minute practice session. The slides are in Vietnamese; the diagrams and terminals read the same in any language. Network-bound numbers (anything with <code>npm ci</code>) vary a lot from run to run — measure your own machine, the ratios are what carry over.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Slide</span>
<h2>Cả chương trong 31 slide</h2>
<p class="lead">Chương này là về những phút bạn lấy lại MỖI NGÀY, nên bộ slide dựa vào số đo: mọi con số thời gian trên đó được đo thật trên một máy Mac (M1 Max, Docker Desktop 4.91, Engine 29.8) tháng 9/2026, phần lớn trên chính danh sách thư viện của một backend sinh viên — 898 gói trong lockfile. Hình trung tâm là chồng tầng tô xanh (HIT — trúng cache) và đỏ (MISS — trượt cache): một tầng đỏ là mọi tầng phía trên nó đỏ theo.</p>
<p>Slide 3–8 thuộc Bài 5.1 (khoá cache được tính thế nào), 9–12 thuộc 5.2 (thứ tự: 138 s → 3,6 s), 13–18 thuộc 5.3 (cache mount), 19–23 thuộc 5.4 (chia sẻ cache với CI) và 24–28 thuộc 5.5 (chẩn đoán lượt dựng chậm). Ba slide cuối là sai lầm hay gặp, bảng tra nhanh và một buổi thực hành 45 phút. Những con số phụ thuộc mạng (mọi thứ có <code>npm ci</code>) dao động mạnh giữa các lần chạy — hãy đo máy của bạn; cái mang sang được là TỈ LỆ, không phải số giây.</p>
</div>
${gallery('dk-05', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Mỗi bước có một khoá — khoá sau chứa khoá trước'], [4, 'RUN nhìn chuỗi lệnh, COPY nhìn nội dung file'], [5, 'Đổi package.json: một MISS kéo cả phần trên'],
  [6, 'ARG đổi ⇒ mọi RUN sau nó chạy lại'], [7, 'apt-get update đứng riêng một RUN'], [8, 'Sáu thứ âm thầm phá cache'],
  [9, 'Chồng tầng HIT/MISS trước và sau khi đổi thứ tự COPY'], [10, 'Đo thật: 138,6 s so với 4,8 s'], [11, 'Luật xếp theo tần suất thay đổi'], [12, 'Gộp RUN hay tách'],
  [13, 'Tầng cache khác cache mount thế nào'], [14, 'Thêm một thư viện: 63 s so với 9 s'], [15, 'Thư mục đích cho từng trình quản lý gói'],
  [16, 'apt: docker-clean và sharing=locked'], [17, 'Hai cú hỏng im lặng của cache mount'], [18, 'Cache mount phình mãi: buildx du'],
  [19, 'Máy CI mới tinh có cache rỗng'], [20, 'mode=min so với mode=max, đo thật'], [21, 'Bốn kho cache'], [22, 'Workflow GitHub Actions'], [23, 'Phép thử trung thực: builder mới'],
  [24, 'Ba phép đo trước khi kết luận'], [25, 'Sắp dòng DONE theo giây'], [26, 'Bảy nguyên nhân dựng chậm'], [27, 'Ngữ cảnh 515 MB và giả lập amd64'], [28, 'build --check và stage song song'],
  [29, 'Sai lầm hay gặp'], [30, 'Bảng tra nhanh'], [31, 'Thực hành chương 5'],
])}
`,
    },
    /* ─────────────────────────── 5.1 ─────────────────────────── */
    {
      title: '5.1 — How the build cache decides|||5.1 — Cache lúc dựng quyết định thế nào',
      slug: 'dk-5-1-cache-quyet-dinh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Khoá cache của từng loại chỉ thị, chuỗi vô hiệu hoá lan xuống dưới, vì sao COPY nhìn nội dung còn RUN chỉ nhìn chuỗi lệnh, và những thứ âm thầm phá cache mà bạn không thấy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>How the build cache decides</h2>
<p class="lead">Every instruction in a Dockerfile is a step with a <strong>cache key</strong>. Before running a step, BuildKit computes that key and looks for a previous result with the same one. If it finds it, the step is skipped and you see <code>CACHED</code>. Understanding how each key is computed is the whole of build performance — and it is four rules.</p>

<h3>The four rules</h3>
${slide('dk-05', 3, 'Mỗi bước có một khoá — khoá sau chứa khoá trước')}
${slide('dk-05', 4, 'RUN nhìn chuỗi lệnh, COPY nhìn nội dung file')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">RUN — the key is the command STRING</span><span class="lz-lnote">BuildKit does not know or care what the command does. <code>RUN apt-get update</code> has the same key today and next month, so a cached result from six weeks ago is reused with a stale package index. Change one character and the key changes.</span></div>
  <div class="lz-layer"><span class="lz-lname">COPY and ADD — the key includes the file CONTENTS</span><span class="lz-lnote">A checksum of every file being copied, plus its path and mode. Edit one byte of one file and the key changes; touch a file without changing it and the key does not (BuildKit ignores mtime, unlike the old builder).</span></div>
  <div class="lz-layer"><span class="lz-lname">Every step depends on the one before it</span><span class="lz-lnote">The key of step N includes the key of step N−1. So a miss at step 3 forces steps 4, 5, 6 to rerun even if nothing about them changed. This chain is why ORDER matters more than anything else.</span></div>
  <div class="lz-layer"><span class="lz-lname">ARG and the base image are inputs too</span><span class="lz-lnote">A different <code>--build-arg</code> value invalidates from the <code>ARG</code> line down. A new digest for <code>FROM</code> (after <code>docker build --pull</code>) invalidates everything.</span></div>
</div>

<h3>Watch it happen</h3>
${slide('dk-05', 5, 'Đổi package.json: một MISS kéo cả phần trên')}
<pre><code>mkdir -p cachedemo &amp;&amp; cd cachedemo
printf 'node_modules\\n.git\\n' &gt; .dockerignore
cat &gt; package.json &lt;&lt;'EOF'
{ "name": "c", "version": "1.0.0", "dependencies": { "express": "^4.21.1" } }
EOF
npm install --package-lock-only --silent
echo 'console.log("v1");' &gt; app.js
cat &gt; Dockerfile &lt;&lt;'EOF'
# syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY app.js ./
CMD ["node", "app.js"]
EOF

time docker build -q -t c:1 . &gt;/dev/null      <span class="tok-comment"># cold</span>
time docker build -q -t c:1 . &gt;/dev/null      <span class="tok-comment"># everything cached</span>
echo 'console.log("v2");' &gt; app.js
time docker build -q -t c:2 . &gt;/dev/null      <span class="tok-comment"># only the last COPY changed</span></code></pre>
<div class="out">real	0m5.902s
real	0m0.318s
real	0m0.641s</div>
<p>Five point nine seconds, then a third of a second, then two thirds of a second. The source change re-ran only <code>COPY app.js</code> and the metadata step after it — <code>npm ci</code> was untouched because the files it depends on did not change. That is the whole point of the ordering.</p>
<pre><code><span class="tok-comment"># Now break the chain: change the dependency manifest instead</span>
npm install --package-lock-only --silent helmet@^8.0.0   <span class="tok-comment"># writes package.json AND the lockfile</span>
docker build --progress=plain -t c:3 . 2&gt;&amp;1 | grep -E '^#[0-9]+ (\\[|CACHED|DONE)' | grep -v internal</code></pre>
<div class="out">…
#6 [1/5] FROM docker.io/library/node:22-alpine@sha256:b6f26b36c8ff49624cfdac716b8ea1138d606df02586a77d364bb5536a634f85
#6 DONE 0.0s
#8 [2/5] WORKDIR /app
#8 CACHED
#9 [3/5] COPY package.json package-lock.json ./
#9 DONE 0.0s
#10 [4/5] RUN npm ci --omit=dev
#10 DONE 1.2s
#11 [5/5] COPY app.js ./
#11 DONE 0.0s</div>
<p>Step 3's key changed, so steps 4 and 5 rebuilt too — even though <code>app.js</code> is byte-identical to the previous build. That cascade is rule three, and it is the mechanism behind every "why is my build slow" question in this chapter.</p>
<div class="callout warn"><strong>Why this lesson no longer uses <code>sed -i</code>.</strong> An earlier version edited <code>package.json</code> with <code>sed -i 's/…/…/' package.json</code>. That is GNU sed syntax: on macOS, BSD sed reads the next word as a backup-file suffix and fails with <code>sed: 1: "package.json": extra characters at the end of p command</code> (tried on the course Mac), so the rest of the demo silently ran against the unchanged file. <code>npm install --package-lock-only &lt;package&gt;</code> works the same on Mac, Linux and Windows, and it updates the lockfile too — which is what <code>npm ci</code> reads.</div>
<p>Output above is real, from the course Mac (Docker Desktop 4.91, Engine 29.8). Two differences from older Docker engines are worth knowing so they do not confuse you: the <code>FROM</code> step now prints <code>DONE 0.0s</code> instead of <code>CACHED</code> (the base image is simply already there), and the step numbers after <code>#</code> are job numbers, not Dockerfile line numbers — they can even appear out of order, because BuildKit starts independent jobs in parallel.</p>

<h3>Run it step by step: read --progress=plain like a table</h3>
<p>Every chapter from here on asks you to read this output, so here is what each piece means. The default display collapses finished steps into one line; <code>--progress=plain</code> prints every event as a line of text you can <code>grep</code>.</p>
<table>
<tr><th>You see</th><th>It means</th></tr>
<tr><td><code>#9</code></td><td>Job number 9 in this build. Only an ID for matching lines together — <code>#9 [3/5] …</code> starts a job, <code>#9 DONE 0.0s</code> ends the same job.</td></tr>
<tr><td><code>[3/5]</code></td><td>Instruction 3 of the 5 instructions of this stage (<code>FROM</code> counts as 1). In a multi-stage build it becomes <code>[build 4/6]</code> — the stage name first.</td></tr>
<tr><td><code>CACHED</code></td><td>A cache HIT: the key was found, nothing ran, the old layer is reused.</td></tr>
<tr><td><code>DONE 1.2s</code></td><td>The step really ran (a MISS), and this is how long it took. Sorting these numbers is the whole of Lesson 5.5.</td></tr>
<tr><td><code>[internal] load …</code></td><td>BuildKit's own housekeeping: reading the Dockerfile, <code>.dockerignore</code> and the build context, asking the registry for image metadata. Not steps of yours.</td></tr>
<tr><td><code>#3 CACHED</code> with no <code>[n/m]</code></td><td>The <code>docker/dockerfile:1</code> frontend image named by the <code># syntax</code> line. It shows up as one extra <code>CACHED</code> when you count with <code>grep -c</code> — the "5" in the mtime test below is 4 steps plus this line.</td></tr>
</table>
<pre><code class="language-bash"><span class="tok-comment"># the three timings of the demo above, on the course Mac, in zsh</span>
time docker build -q -t c:1 . &gt;/dev/null      <span class="tok-comment"># first build: npm ci really runs</span>
time docker build -q -t c:1 . &gt;/dev/null      <span class="tok-comment"># nothing changed</span>
echo 'console.log("v2");' &gt; app.js
time docker build -q -t c:2 . &gt;/dev/null      <span class="tok-comment"># only app.js changed</span></code></pre>
<div class="out">docker build -q -t c:1 . &gt; /dev/null  0.10s user 0.09s system 6% cpu 3.025 total
docker build -q -t c:1 . &gt; /dev/null  0.10s user 0.08s system 16% cpu 1.125 total
docker build -q -t c:2 . &gt; /dev/null  0.09s user 0.08s system 14% cpu 1.163 total</div>
<div class="kv-grid">
  <div class="kv"><span class="k">zsh prints time differently</span><span class="v">On a Mac the shell is zsh, and its <code>time</code> prints one line ending in <code>… total</code> — that last number is the wall-clock time, the same thing bash calls <code>real</code>. Linux and WSL (bash) print <code>real 0m3.025s</code> on its own line.</span></div>
  <div class="kv"><span class="k">-q</span><span class="v"><code>--quiet</code>: print only the image ID at the end. Used here so the timing is not buried under progress output.</span></div>
  <div class="kv"><span class="k">&gt;/dev/null</span><span class="v">Throw away normal output. <code>2&gt;&amp;1</code> (used with <code>--progress=plain</code>) does the opposite job: BuildKit writes progress to stderr, and this sends it into the pipe so <code>grep</code> can see it.</span></div>
  <div class="kv"><span class="k">Why a warm build is still ~1 s</span><span class="v">Nothing is rebuilt, but BuildKit still asks Docker Hub for the current digest of <code>node:22-alpine</code> and of the <code>docker/dockerfile:1</code> frontend. On the course Mac, removing the <code># syntax</code> line brought the warm build down to 0.31 s. Network, not cache.</span></div>
  <div class="kv"><span class="k">The cache is by content, not by folder</span><span class="v">Copying the same <code>package.json</code> and lockfile into a <em>different</em> directory and building there gave <code>CACHED</code> for <code>npm ci</code> straight away: the key is made of file contents, so any project with identical inputs reuses the same layer.</span></div>
</div>

<h3>What silently breaks the cache</h3>
${slide('dk-05', 8, 'Sáu thứ âm thầm phá cache')}
<div class="kv-grid">
  <div class="kv"><span class="k">COPY . . near the top</span><span class="v">The single biggest cause. Every file in the context is part of the key, so editing a README invalidates it and everything below — including the dependency install. Lesson 5.2 measures the cost.</span></div>
  <div class="kv"><span class="k">A file that changes every build</span><span class="v">A generated <code>version.json</code>, a build timestamp, a <code>.env</code> written by CI. Copy those <em>last</em>, after the expensive steps, or exclude them from the context.</span></div>
  <div class="kv"><span class="k">The .git directory</span><span class="v">Its contents change on every commit and every <code>git status</code>. If it is not in <code>.dockerignore</code>, every commit invalidates every <code>COPY .</code> — and it is usually the largest thing in the context anyway (Lesson 4.1).</span></div>
  <div class="kv"><span class="k">A changed ARG</span><span class="v">Invalidates from its declaration downward. Passing <code>--build-arg BUILD_DATE=\$(date)</code> at the top of a Dockerfile disables the cache for the entire file — a surprisingly common accident.</span></div>
  <div class="kv"><span class="k">A different builder</span><span class="v">Each buildx builder has its own cache. Switching between the <code>default</code> driver and a <code>docker-container</code> one, or running in CI on a fresh runner, means starting cold — which Lesson 5.4 solves.</span></div>
  <div class="kv"><span class="k">A pulled base image</span><span class="v"><code>--pull</code> or a moved tag gives a new digest, which invalidates everything. Correct and necessary; just do not be surprised when a scheduled rebuild takes four minutes.</span></div>
</div>
<pre><code><span class="tok-comment"># Prove BuildKit ignores mtime — this does NOT invalidate</span>
touch app.js
docker build --progress=plain -t c:4 . 2&gt;&amp;1 | grep -cE 'CACHED'
<span class="tok-comment"># But changing content by one byte does</span>
printf '\\n' &gt;&gt; app.js
docker build --progress=plain -t c:5 . 2&gt;&amp;1 | grep -cE 'CACHED'</code></pre>
<div class="out">5
4</div>
<p>Four steps plus the frontend line gives 5 after <code>touch</code>; after the one-byte edit, <code>COPY app.js</code> misses and the count drops to 4. Real result on the course Mac.</p>

<h3>ARG, precisely: which steps a changed value really invalidates</h3>
${slide('dk-05', 6, 'ARG đổi ⇒ mọi RUN sau nó chạy lại')}
<p>"A changed ARG invalidates from its declaration downward" is close but not exact, and the exact version tells you where to put it. BuildKit passes every declared <code>ARG</code> into the environment of every <code>RUN</code> that follows it — so each later <code>RUN</code> has a different key even if its command never mentions the variable. <code>COPY</code>, <code>WORKDIR</code> and the other steps are not affected unless they use the variable.</p>
<pre><code class="language-dockerfile"># syntax=docker/dockerfile:1
FROM node:22-alpine
ARG BUILD_DATE                 <span class="tok-comment"># declared at the TOP</span>
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev          <span class="tok-comment"># never mentions BUILD_DATE</span>
COPY app.js ./
LABEL built=$BUILD_DATE        <span class="tok-comment"># the only line that uses it</span></code></pre>
<pre><code class="language-bash">docker build -q -f Dockerfile.arg --build-arg BUILD_DATE=1 -t c:arg . &gt;/dev/null
docker build -f Dockerfile.arg --build-arg BUILD_DATE=2 --progress=plain -t c:arg . 2&gt;&amp;1 \\
  | grep -E '^#[0-9]+ (\\[|CACHED|DONE)' | grep -v internal</code></pre>
<div class="out">…
#8 [2/5] WORKDIR /app
#8 CACHED
#9 [3/5] COPY package.json package-lock.json ./
#9 CACHED
#10 [4/5] RUN npm ci --omit=dev
#10 DONE 1.1s
#11 [5/5] COPY app.js ./
#11 DONE 0.0s</div>
<p><code>WORKDIR</code> and the first <code>COPY</code> stayed cached; <code>npm ci</code> ran again although it does not use the variable, and <code>COPY app.js</code> followed it by the cascade rule. The fix is one line moved: declare <code>ARG BUILD_DATE</code> immediately above the <code>LABEL</code> that uses it, and only that last, free step changes. The same applies to <code>ARG GIT_SHA</code>, <code>ARG VERSION</code> and anything else your CI passes with a different value on every run.</p>

<h3>The apt-get problem</h3>
${slide('dk-05', 7, 'apt-get update đứng riêng một RUN = danh mục cũ mãi')}
<pre><code><span class="tok-comment"># WRONG — two RUNs, and the update result gets cached forever</span>
RUN apt-get update
RUN apt-get install -y curl

<span class="tok-comment"># RIGHT — one RUN, so they invalidate together</span>
RUN apt-get update \\
 &amp;&amp; apt-get install -y --no-install-recommends curl ca-certificates \\
 &amp;&amp; rm -rf /var/lib/apt/lists/*</code></pre>
<div class="callout warn"><strong>This is the classic, and it produces a genuinely confusing failure.</strong> With two separate <code>RUN</code>s, adding a package to the second line changes only that line's key — so <code>apt-get update</code> stays cached with a package index from weeks ago, and the install fails with <code>404 Not Found</code> on a version that has since been superseded. It looks like a network problem and is a cache problem. Keeping <code>update</code> and <code>install</code> in one <code>RUN</code> means changing the package list re-runs both. The same shape applies to <code>apk update</code>, <code>dnf makecache</code> and any "refresh the index, then use it" pair.</div>

<h3>Reading cache state precisely</h3>
<pre><code>docker build --progress=plain --no-cache -t c:6 . 2&gt;&amp;1 | grep -E 'DONE' | tail -6
docker builder du | tail -3
docker system df --format 'table {{.Type}}\\t{{.Size}}\\t{{.Reclaimable}}' | grep -i cache</code></pre>
<div class="out">#9 DONE 0.0s
#10 DONE 1.7s
#11 DONE 0.0s
#12 DONE 0.4s
Private:	21.27GB
Reclaimable:	41.06GB
Total:		41.06GB
Build Cache     41.06GB   21.27GB</div>
<p>Real output from the course Mac, and a useful shock: 41 GB of build cache on a laptop that builds a handful of projects. The last lines of <code>docker builder du</code> are a summary — <code>Private</code> is cache used by one build only, <code>Reclaimable</code> is what a prune could free, <code>Total</code> is everything (an earlier version of this lesson showed a <code>Reclaimed</code> line; the command has no such line). Do <em>not</em> answer that number with a bare <code>docker builder prune</code> on a machine shared with other projects: it deletes every project's cache, and the next build of each one starts cold. Lesson 5.3 shows the targeted ways.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">--progress=plain</span><span class="v">Shows every step with its duration and whether it was <code>CACHED</code>. This is the primary tool for build performance work — the default collapsing display hides exactly what you need.</span></div>
  <div class="kv"><span class="k">docker builder du</span><span class="v">How much the cache is holding and how much is shared between builds. A useful sanity check before wondering where disk went (Lesson 3.5).</span></div>
  <div class="kv"><span class="k">--no-cache</span><span class="v">Forces everything to rebuild. Use it to measure the true cold-build time and to prove a Dockerfile is reproducible — a build that only works with a warm cache is a build that will fail in CI.</span></div>
  <div class="kv"><span class="k">--no-cache-filter=stage</span><span class="v">Rebuild one named stage while caching the rest. Useful when you suspect one stage has a stale cached result but do not want to pay for a full rebuild.</span></div>
</div>
<pre><code>cd ..; rm -rf cachedemo; docker rmi c:1 c:2 c:3 c:4 c:5 c:6 &gt;/dev/null 2&gt;&amp;1</code></pre>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate on your SWP391 project complains that "Docker is random — sometimes the build takes two seconds, sometimes a minute". Prove it is not random: predict each result before you see it.</p><ol>
<li>In <code>~/thu-docker/cache51</code>, recreate the <code>cachedemo</code> project from "Watch it happen" (the <code>.dockerignore</code>, <code>package.json</code>, <code>app.js</code> and the five-line Dockerfile) and build it once.</li>
<li>For each of the four edits below, first write down which of the five steps will say <code>CACHED</code>, then build with <code>--progress=plain</code> and compare: (a) <code>touch app.js</code>; (b) change the text inside <code>app.js</code>; (c) <code>npm install --package-lock-only helmet@^8.0.0</code>; (d) add <code>ARG BUILD_DATE</code> right under <code>FROM</code> and build twice with different <code>--build-arg BUILD_DATE=…</code> values.</li>
<li>Move the <code>ARG</code> to just above a new last line <code>LABEL built=$BUILD_DATE</code> and repeat (d).</li>
<li>Clean up: <code>docker rmi c:1 c:2 c:3 c:arg</code> (ignore "No such image" for tags you did not create).</li></ol>
<pre><code class="language-bash">docker build --progress=plain -t c:x . 2&gt;&amp;1 | grep -E '^#[0-9]+ \\[|CACHED$|DONE [0-9.]+s$' | grep -v internal</code></pre>
<p><strong>Done when:</strong> all four predictions match what BuildKit printed, you can say for each one which rule decided it (content vs command string vs cascade vs ARG), and after moving the <code>ARG</code> down, changing <code>BUILD_DATE</code> leaves <code>npm ci</code> as <code>CACHED</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Build cache</span><span class="v">The store of results from previous builds that BuildKit can reuse instead of running a step again.</span></div>
  <div class="kv"><span class="k">Cache key</span><span class="v">The fingerprint of one step: the previous step's key plus the command string (RUN) or the file contents (COPY).</span></div>
  <div class="kv"><span class="k">Cache hit / miss</span><span class="v">Hit: the key was found and the step printed <code>CACHED</code>. Miss: not found, the step ran and printed <code>DONE x.xs</code>.</span></div>
  <div class="kv"><span class="k">Invalidation</span><span class="v">A change that makes a key different. It cascades: every step after the first miss misses too.</span></div>
  <div class="kv"><span class="k">BuildKit</span><span class="v">The engine that actually executes <code>docker build</code> since Docker 23; it computes keys and runs independent steps in parallel.</span></div>
  <div class="kv"><span class="k">Checksum</span><span class="v">A short number computed from a file's bytes. Same bytes, same checksum — which is why <code>touch</code> changes nothing.</span></div>
  <div class="kv"><span class="k">Build argument (ARG)</span><span class="v">A value passed with <code>--build-arg</code>. Every <code>RUN</code> after its declaration sees it, so a changing value misses all of them.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Every instruction is a step with a key; the key of a step contains the key of the step before it.</li>
<li><code>RUN</code> is keyed on its command string, <code>COPY</code>/<code>ADD</code> on the bytes of the files — modification time does not count.</li>
<li>The first miss makes every later step miss: that cascade is why order matters.</li>
<li>A changing <code>ARG</code> re-runs every <code>RUN</code> after its declaration — declare it just above the line that uses it.</li>
<li><code>apt-get update</code> must share one <code>RUN</code> with <code>apt-get install</code>, or a weeks-old package index stays cached.</li>
<li>Read builds with <code>--progress=plain</code>: <code>CACHED</code> is a hit, <code>DONE x.xs</code> is a step that really ran.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/build/cache/" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">Docker build cache</span><span class="lc-sub">How cache keys are computed per instruction, what invalidates them, and the official list of optimisation techniques. The reference for this whole chapter.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/cache/invalidation/" target="_blank" rel="noopener">
  <span class="lc-ico">💥</span>
  <span class="lc-body"><span class="lc-title">Cache invalidation</span><span class="lc-sub">The precise rules, including the difference between <code>RUN</code> (command string) and <code>COPY</code> (file contents) and why the chain propagates downward.</span></span>
</a>
<a class="link-card" href="https://github.com/moby/buildkit" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">BuildKit</span><span class="lc-sub">The builder itself. Worth knowing it parallelises independent stages automatically — one of the reasons multi-stage builds are often faster, not slower, than single-stage ones.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: predict the cache</span><span class="lc-sub">Graded exercises: say which steps rebuild after four different edits, fix a Dockerfile where a README change triggers a dependency install, and explain a 404 from a cached <code>apt-get update</code>.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> a cached layer that is <em>correct</em> by Docker's rules and <em>wrong</em> in reality. <code>RUN git clone https://github.com/me/lib.git</code> has a fixed command string, so BuildKit reuses the result forever — your image keeps shipping the commit from the day you first built it, and no amount of pushing to that repository changes anything. The same applies to <code>RUN curl -O https://example.com/latest.tar.gz</code> and to <code>RUN npm install -g some-cli</code> without a version. The fix is to make the changing thing part of the key: pin the version in the command (<code>git clone --branch v1.4.2</code>), or add a cheap invalidator such as <code>ADD https://api.github.com/repos/me/lib/commits/main /tmp/commit.json</code> before the clone.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>RUN</code> is keyed on the command <em>string</em> and <code>COPY</code> on the file <em>contents</em> — which is why <code>apt-get update</code> in its own <code>RUN</code> is a trap and why touching a file without editing it costs nothing. Invalidation cascades downward: a miss at step 3 rebuilds everything after it, so ordering is the whole game. And <code>--progress=plain</code> plus <code>--no-cache</code> are the two flags you need to measure any of this honestly.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Cache lúc dựng quyết định thế nào</h2>
<p class="lead">Mọi chỉ thị trong một Dockerfile đều là một bước có một <strong>KHOÁ CACHE</strong>. Trước khi chạy một bước, BuildKit tính cái khoá đó rồi đi tìm một kết quả trước đó có cùng khoá. Tìm thấy thì bước đó được bỏ qua và bạn thấy chữ <code>CACHED</code>. Hiểu cách tính khoá của từng loại là hiểu toàn bộ chuyện hiệu năng lúc dựng — và nó gói trong BỐN luật.</p>

<h3>Bốn cái luật</h3>
${slide('dk-05', 3, 'Mỗi bước có một khoá — khoá sau chứa khoá trước')}
${slide('dk-05', 4, 'RUN nhìn chuỗi lệnh, COPY nhìn nội dung file')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">RUN — khoá là CHUỖI câu lệnh</span><span class="lz-lnote">BuildKit không biết và không quan tâm câu lệnh đó LÀM gì. <code>RUN apt-get update</code> có cùng khoá hôm nay và tháng sau, nên một kết quả lưu đệm từ sáu tuần trước được dùng lại với một danh mục gói đã cũ. Đổi một ký tự là khoá đổi.</span></div>
  <div class="lz-layer"><span class="lz-lname">COPY và ADD — khoá bao gồm NỘI DUNG file</span><span class="lz-lnote">Một tổng kiểm tra của mọi file được chép, cộng đường dẫn và chế độ của nó. Sửa một byte của một file là khoá đổi; <code>touch</code> một file mà không đổi nội dung thì khoá KHÔNG đổi (BuildKit bỏ qua mtime, khác bộ dựng cũ).</span></div>
  <div class="lz-layer"><span class="lz-lname">Mọi bước phụ thuộc vào bước TRƯỚC nó</span><span class="lz-lnote">Khoá của bước N bao gồm khoá của bước N−1. Nên một cú trượt ở bước 3 buộc các bước 4, 5, 6 chạy lại dù chẳng có gì về chúng thay đổi. Chuỗi đó chính là lý do THỨ TỰ quan trọng hơn mọi thứ khác.</span></div>
  <div class="lz-layer"><span class="lz-lname">ARG và ảnh nền cũng là đầu vào</span><span class="lz-lnote">Một giá trị <code>--build-arg</code> khác đi thì vô hiệu hoá từ dòng <code>ARG</code> trở xuống. Một digest mới cho <code>FROM</code> (sau <code>docker build --pull</code>) thì vô hiệu hoá tất cả.</span></div>
</div>

<h3>Nhìn tận mắt</h3>
${slide('dk-05', 5, 'Đổi package.json: một MISS kéo cả phần trên')}
<pre><code>mkdir -p cachedemo &amp;&amp; cd cachedemo
printf 'node_modules\\n.git\\n' &gt; .dockerignore
cat &gt; package.json &lt;&lt;'EOF'
{ "name": "c", "version": "1.0.0", "dependencies": { "express": "^4.21.1" } }
EOF
npm install --package-lock-only --silent
echo 'console.log("v1");' &gt; app.js
cat &gt; Dockerfile &lt;&lt;'EOF'
# syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY app.js ./
CMD ["node", "app.js"]
EOF

time docker build -q -t c:1 . &gt;/dev/null      <span class="tok-comment"># nguội</span>
time docker build -q -t c:1 . &gt;/dev/null      <span class="tok-comment"># mọi thứ đều có cache</span>
echo 'console.log("v2");' &gt; app.js
time docker build -q -t c:2 . &gt;/dev/null      <span class="tok-comment"># chỉ COPY cuối đổi</span></code></pre>
<div class="out">real	0m5.902s
real	0m0.318s
real	0m0.641s</div>
<p>Năm phẩy chín giây, rồi một phần ba giây, rồi hai phần ba giây. Việc đổi mã nguồn chỉ chạy lại <code>COPY app.js</code> và bước siêu dữ liệu sau nó — <code>npm ci</code> không bị đụng tới vì những file nó phụ thuộc vào không đổi. Đó chính là toàn bộ điểm mấu chốt của thứ tự.</p>
<pre><code><span class="tok-comment"># Giờ phá cái chuỗi: đổi file khai báo thư viện thay vì mã nguồn</span>
npm install --package-lock-only --silent helmet@^8.0.0   <span class="tok-comment"># ghi CẢ package.json lẫn lockfile</span>
docker build --progress=plain -t c:3 . 2&gt;&amp;1 | grep -E '^#[0-9]+ (\\[|CACHED|DONE)' | grep -v internal</code></pre>
<div class="out">…
#6 [1/5] FROM docker.io/library/node:22-alpine@sha256:b6f26b36c8ff49624cfdac716b8ea1138d606df02586a77d364bb5536a634f85
#6 DONE 0.0s
#8 [2/5] WORKDIR /app
#8 CACHED
#9 [3/5] COPY package.json package-lock.json ./
#9 DONE 0.0s
#10 [4/5] RUN npm ci --omit=dev
#10 DONE 1.2s
#11 [5/5] COPY app.js ./
#11 DONE 0.0s</div>
<p>Khoá của bước 3 đổi, nên bước 4 và 5 cũng dựng lại — mặc dù <code>app.js</code> giống hệt tới từng byte so với lượt dựng trước. Cú lan xuống đó là luật thứ ba, và nó là cơ chế đứng sau mọi câu hỏi "sao bản dựng của tôi chậm thế" trong chương này.</p>
<div class="callout warn"><strong>Vì sao bài này thôi dùng <code>sed -i</code>.</strong> Bản cũ sửa <code>package.json</code> bằng <code>sed -i 's/…/…/' package.json</code>. Đó là cú pháp của sed bản GNU (Linux): trên macOS, sed bản BSD đọc chữ tiếp theo làm đuôi file sao lưu và hỏng với <code>sed: 1: "package.json": extra characters at the end of p command</code> (đã thử trên máy Mac của khoá) — thế là phần còn lại của bài chạy trên một file KHÔNG hề đổi mà bạn không biết. <code>npm install --package-lock-only &lt;gói&gt;</code> chạy y hệt trên Mac, Linux và Windows, lại cập nhật luôn lockfile — đúng thứ mà <code>npm ci</code> đọc.</div>
<p>Output ở trên là thật, từ máy Mac của khoá (Docker Desktop 4.91, Engine 29.8). Có hai khác biệt so với Docker bản cũ cần biết để khỏi rối: bước <code>FROM</code> giờ in <code>DONE 0.0s</code> thay vì <code>CACHED</code> (ảnh nền đơn giản là đã có sẵn), và con số sau dấu <code>#</code> là số thứ tự VIỆC, không phải số dòng Dockerfile — chúng còn có thể lộn thứ tự, vì BuildKit khởi động song song những việc không phụ thuộc nhau.</p>

<h3>Chạy thử từng bước: đọc --progress=plain như đọc một cái bảng</h3>
<p>Từ đây tới hết khoá bạn sẽ phải đọc loại output này rất nhiều, nên đây là nghĩa của từng mẩu. Kiểu hiển thị mặc định gấp các bước đã xong lại thành một dòng; <code>--progress=plain</code> (tiến trình dạng chữ thường) in MỌI sự kiện thành một dòng chữ để bạn <code>grep</code> được.</p>
<table>
<tr><th>Bạn thấy</th><th>Nghĩa là</th></tr>
<tr><td><code>#9</code></td><td>Việc số 9 trong lượt dựng này. Chỉ là mã để ghép các dòng với nhau — <code>#9 [3/5] …</code> mở đầu một việc, <code>#9 DONE 0.0s</code> kết thúc CHÍNH việc đó.</td></tr>
<tr><td><code>[3/5]</code></td><td>Chỉ thị thứ 3 trong 5 chỉ thị của stage này (<code>FROM</code> tính là 1). Trong lượt dựng nhiều stage nó thành <code>[build 4/6]</code> — tên stage đứng trước.</td></tr>
<tr><td><code>CACHED</code></td><td>TRÚNG cache (HIT): tìm thấy khoá, không chạy gì, dùng lại tầng cũ.</td></tr>
<tr><td><code>DONE 1.2s</code></td><td>Bước đó CHẠY THẬT (TRƯỢT — MISS), và mất chừng này thời gian. Sắp xếp các con số này chính là toàn bộ Bài 5.5.</td></tr>
<tr><td><code>[internal] load …</code></td><td>Việc nội bộ của BuildKit: đọc Dockerfile, <code>.dockerignore</code> và ngữ cảnh dựng, hỏi registry siêu dữ liệu của ảnh. Không phải bước của bạn.</td></tr>
<tr><td><code>#3 CACHED</code> không có <code>[n/m]</code></td><td>Ảnh "frontend" (bộ đọc Dockerfile) <code>docker/dockerfile:1</code> mà dòng <code># syntax</code> gọi tới. Nó thành thêm MỘT dòng <code>CACHED</code> khi bạn đếm bằng <code>grep -c</code> — con số "5" ở phép thử mtime bên dưới là 4 bước + dòng này.</td></tr>
</table>
<pre><code class="language-bash"><span class="tok-comment"># ba lần bấm giờ của ví dụ trên, máy Mac của khoá, trong zsh</span>
time docker build -q -t c:1 . &gt;/dev/null      <span class="tok-comment"># lần đầu: npm ci chạy thật</span>
time docker build -q -t c:1 . &gt;/dev/null      <span class="tok-comment"># không đổi gì</span>
echo 'console.log("v2");' &gt; app.js
time docker build -q -t c:2 . &gt;/dev/null      <span class="tok-comment"># chỉ app.js đổi</span></code></pre>
<div class="out">docker build -q -t c:1 . &gt; /dev/null  0.10s user 0.09s system 6% cpu 3.025 total
docker build -q -t c:1 . &gt; /dev/null  0.10s user 0.08s system 16% cpu 1.125 total
docker build -q -t c:2 . &gt; /dev/null  0.09s user 0.08s system 14% cpu 1.163 total</div>
<div class="kv-grid">
  <div class="kv"><span class="k">zsh in thời gian khác bash</span><span class="v">Trên Mac, shell là zsh, và <code>time</code> của nó in MỘT dòng kết thúc bằng <code>… total</code> — con số cuối là thời gian thực trôi qua, cũng chính là thứ bash gọi là <code>real</code>. Linux và WSL (bash) in <code>real 0m3.025s</code> trên một dòng riêng.</span></div>
  <div class="kv"><span class="k">-q</span><span class="v"><code>--quiet</code> (im lặng): chỉ in ID ảnh ở cuối. Dùng ở đây để con số thời gian không bị chôn dưới đống tiến trình.</span></div>
  <div class="kv"><span class="k">&gt;/dev/null</span><span class="v">Vứt output thường đi. <code>2&gt;&amp;1</code> (đi cùng <code>--progress=plain</code>) làm việc ngược lại: BuildKit ghi tiến trình ra stderr (luồng lỗi), và cái này dồn nó vào đường ống để <code>grep</code> nhìn thấy.</span></div>
  <div class="kv"><span class="k">Vì sao dựng ấm vẫn ~1 giây</span><span class="v">Không có gì dựng lại, nhưng BuildKit vẫn hỏi Docker Hub digest hiện tại của <code>node:22-alpine</code> và của frontend <code>docker/dockerfile:1</code>. Trên máy Mac của khoá, bỏ dòng <code># syntax</code> đi là lượt dựng ấm còn 0,31 giây. Đó là MẠNG, không phải cache.</span></div>
  <div class="kv"><span class="k">Cache theo NỘI DUNG, không theo thư mục</span><span class="v">Chép đúng <code>package.json</code> và lockfile đó sang một thư mục KHÁC rồi dựng ở đó: <code>npm ci</code> ra <code>CACHED</code> ngay lần đầu. Khoá được làm từ nội dung file, nên mọi dự án có đầu vào giống hệt đều dùng lại cùng một tầng.</span></div>
</div>

<h3>Những thứ ÂM THẦM phá cache</h3>
${slide('dk-05', 8, 'Sáu thứ âm thầm phá cache')}
<div class="kv-grid">
  <div class="kv"><span class="k">COPY . . đặt gần đầu</span><span class="v">Nguyên nhân lớn nhất. Mọi file trong ngữ cảnh đều là một phần của khoá, nên sửa một cái README là vô hiệu hoá nó và mọi thứ bên dưới — kể cả lượt cài thư viện. Bài 5.2 ĐO cái giá đó.</span></div>
  <div class="kv"><span class="k">Một file đổi ở mọi lượt dựng</span><span class="v">Một <code>version.json</code> được sinh ra, một mốc thời gian build, một <code>.env</code> do CI ghi. Hãy chép chúng SAU CÙNG, sau những bước đắt tiền, hoặc loại chúng khỏi ngữ cảnh.</span></div>
  <div class="kv"><span class="k">Thư mục .git</span><span class="v">Nội dung của nó đổi ở mỗi commit và mỗi lệnh <code>git status</code>. Không có nó trong <code>.dockerignore</code> thì mọi commit đều vô hiệu hoá mọi <code>COPY .</code> — và đằng nào nó cũng thường là thứ lớn nhất trong ngữ cảnh (Bài 4.1).</span></div>
  <div class="kv"><span class="k">Một ARG thay đổi</span><span class="v">Vô hiệu hoá từ chỗ khai báo trở xuống. Truyền <code>--build-arg BUILD_DATE=\$(date)</code> ở đầu một Dockerfile là TẮT cache cho toàn bộ file — một tai nạn phổ biến đến bất ngờ.</span></div>
  <div class="kv"><span class="k">Một bộ dựng khác</span><span class="v">Mỗi bộ dựng buildx có cache riêng của nó. Chuyển qua lại giữa trình <code>default</code> và một trình <code>docker-container</code>, hoặc chạy trong CI trên một máy mới tinh, nghĩa là bắt đầu từ trạng thái nguội — và Bài 5.4 giải quyết chuyện đó.</span></div>
  <div class="kv"><span class="k">Một ảnh nền vừa kéo về</span><span class="v"><code>--pull</code> hoặc một cái tag vừa dịch đi cho ra một digest mới, và nó vô hiệu hoá tất cả. Đúng đắn và cần thiết; chỉ là đừng ngạc nhiên khi một lượt dựng lại theo lịch mất bốn phút.</span></div>
</div>
<pre><code><span class="tok-comment"># Chứng minh BuildKit bỏ qua mtime — cái này KHÔNG vô hiệu hoá gì</span>
touch app.js
docker build --progress=plain -t c:4 . 2&gt;&amp;1 | grep -cE 'CACHED'
<span class="tok-comment"># Nhưng đổi nội dung một byte thì có</span>
printf '\\n' &gt;&gt; app.js
docker build --progress=plain -t c:5 . 2&gt;&amp;1 | grep -cE 'CACHED'</code></pre>
<div class="out">5
4</div>
<p>Bốn bước cộng dòng frontend cho ra 5 sau khi <code>touch</code>; sau cú sửa một byte, <code>COPY app.js</code> trượt và con số tụt xuống 4. Kết quả thật trên máy Mac của khoá.</p>

<h3>ARG, nói cho chính xác: một giá trị đổi làm hỏng đúng những bước nào</h3>
${slide('dk-05', 6, 'ARG đổi ⇒ mọi RUN sau nó chạy lại')}
<p>"Một ARG đổi thì vô hiệu hoá từ chỗ khai báo trở xuống" là GẦN đúng chứ chưa chính xác, và bản chính xác mới cho bạn biết nên đặt nó ở đâu. BuildKit đưa mọi <code>ARG</code> đã khai báo vào biến môi trường của MỌI lệnh <code>RUN</code> đứng sau nó — nên từng <code>RUN</code> phía sau có khoá khác đi dù câu lệnh chẳng hề nhắc tới biến đó. <code>COPY</code>, <code>WORKDIR</code> và các bước còn lại thì không bị ảnh hưởng trừ khi chúng dùng biến.</p>
<pre><code class="language-dockerfile"># syntax=docker/dockerfile:1
FROM node:22-alpine
ARG BUILD_DATE                 <span class="tok-comment"># khai báo ở ĐẦU</span>
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev          <span class="tok-comment"># chẳng nhắc gì tới BUILD_DATE</span>
COPY app.js ./
LABEL built=$BUILD_DATE        <span class="tok-comment"># dòng DUY NHẤT dùng nó</span></code></pre>
<pre><code class="language-bash">docker build -q -f Dockerfile.arg --build-arg BUILD_DATE=1 -t c:arg . &gt;/dev/null
docker build -f Dockerfile.arg --build-arg BUILD_DATE=2 --progress=plain -t c:arg . 2&gt;&amp;1 \\
  | grep -E '^#[0-9]+ (\\[|CACHED|DONE)' | grep -v internal</code></pre>
<div class="out">…
#8 [2/5] WORKDIR /app
#8 CACHED
#9 [3/5] COPY package.json package-lock.json ./
#9 CACHED
#10 [4/5] RUN npm ci --omit=dev
#10 DONE 1.1s
#11 [5/5] COPY app.js ./
#11 DONE 0.0s</div>
<p><code>WORKDIR</code> và lệnh <code>COPY</code> đầu vẫn nằm trong cache; <code>npm ci</code> chạy lại dù không dùng biến đó, và <code>COPY app.js</code> chạy theo vì luật lan xuống. Cách chữa là dời MỘT dòng: khai <code>ARG BUILD_DATE</code> ngay phía trên dòng <code>LABEL</code> dùng nó, thế là chỉ cái bước cuối, không tốn gì, bị đổi. Áp y hệt cho <code>ARG GIT_SHA</code>, <code>ARG VERSION</code> và mọi thứ CI truyền vào với giá trị khác nhau ở mỗi lượt chạy.</p>

<h3>Bài toán apt-get</h3>
${slide('dk-05', 7, 'apt-get update đứng riêng một RUN = danh mục cũ mãi')}
<pre><code><span class="tok-comment"># SAI — hai lệnh RUN, và kết quả update bị lưu đệm mãi mãi</span>
RUN apt-get update
RUN apt-get install -y curl

<span class="tok-comment"># ĐÚNG — một lệnh RUN, nên chúng cùng bị vô hiệu hoá</span>
RUN apt-get update \\
 &amp;&amp; apt-get install -y --no-install-recommends curl ca-certificates \\
 &amp;&amp; rm -rf /var/lib/apt/lists/*</code></pre>
<div class="callout warn"><strong>Đây là cái kinh điển, và nó tạo ra một cú hỏng thật sự khó hiểu.</strong> Với hai lệnh <code>RUN</code> riêng, thêm một gói vào dòng thứ hai chỉ đổi khoá của DÒNG ĐÓ — nên <code>apt-get update</code> vẫn nằm trong cache với một danh mục gói từ mấy tuần trước, và lượt cài hỏng với <code>404 Not Found</code> trên một phiên bản từ đó tới nay đã bị thay. Nó TRÔNG như một vấn đề mạng và là một vấn đề CACHE. Giữ <code>update</code> với <code>install</code> trong CÙNG một <code>RUN</code> nghĩa là đổi danh sách gói sẽ chạy lại cả hai. Hình hài tương tự áp cho <code>apk update</code>, <code>dnf makecache</code> và mọi cặp "làm mới danh mục, rồi dùng nó".</div>

<h3>Đọc trạng thái cache cho chính xác</h3>
<pre><code>docker build --progress=plain --no-cache -t c:6 . 2&gt;&amp;1 | grep -E 'DONE' | tail -6
docker builder du | tail -3
docker system df --format 'table {{.Type}}\\t{{.Size}}\\t{{.Reclaimable}}' | grep -i cache</code></pre>
<div class="out">#9 DONE 0.0s
#10 DONE 1.7s
#11 DONE 0.0s
#12 DONE 0.4s
Private:	21.27GB
Reclaimable:	41.06GB
Total:		41.06GB
Build Cache     41.06GB   21.27GB</div>
<p>Output thật từ máy Mac của khoá, và là một cú giật mình có ích: 41 GB cache dựng trên một cái laptop chỉ dựng vài dự án. Mấy dòng cuối của <code>docker builder du</code> là phần tổng — <code>Private</code> là cache chỉ một lượt dựng dùng, <code>Reclaimable</code> là phần một lượt tỉa có thể giải phóng, <code>Total</code> là tất cả (bản cũ của bài này in một dòng <code>Reclaimed</code>; lệnh này không có dòng đó). Đừng đáp con số đó bằng một lệnh <code>docker builder prune</code> trần trên máy dùng chung với dự án khác: nó xoá cache của MỌI dự án, và lượt dựng kế tiếp của từng dự án đều bắt đầu nguội. Bài 5.3 chỉ những cách nhắm trúng hơn.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">--progress=plain</span><span class="v">Cho thấy mọi bước kèm thời lượng và việc nó có <code>CACHED</code> hay không. Đây là công cụ chính cho việc tối ưu hiệu năng dựng — bản hiển thị gấp gọn mặc định giấu đi đúng cái bạn cần.</span></div>
  <div class="kv"><span class="k">docker builder du</span><span class="v">Cache đang giữ bao nhiêu và bao nhiêu được dùng chung giữa các lượt dựng. Một phép kiểm tỉnh táo hữu ích trước khi tự hỏi đĩa đi đâu (Bài 3.5).</span></div>
  <div class="kv"><span class="k">--no-cache</span><span class="v">Ép mọi thứ dựng lại. Hãy dùng nó để ĐO thời gian dựng nguội thật và để chứng minh một Dockerfile là tái lập được — một lượt dựng chỉ chạy được khi cache còn ấm là một lượt dựng sẽ hỏng trong CI.</span></div>
  <div class="kv"><span class="k">--no-cache-filter=stage</span><span class="v">Dựng lại MỘT stage có tên trong khi vẫn dùng cache cho phần còn lại. Hữu ích khi bạn nghi một stage có kết quả lưu đệm đã cũ mà không muốn trả giá cho một lượt dựng lại toàn bộ.</span></div>
</div>
<pre><code>cd ..; rm -rf cachedemo; docker rmi c:1 c:2 c:3 c:4 c:5 c:6 &gt;/dev/null 2&gt;&amp;1</code></pre>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn trong nhóm SWP391 than "Docker dựng hên xui lắm — lúc 2 giây, lúc cả phút". Chứng minh là nó KHÔNG hên xui: đoán trước từng kết quả rồi mới nhìn.</p><ol>
<li>Trong <code>~/thu-docker/cache51</code>, dựng lại dự án <code>cachedemo</code> của mục "Nhìn tận mắt" (file <code>.dockerignore</code>, <code>package.json</code>, <code>app.js</code> và Dockerfile năm dòng) và dựng nó một lần.</li>
<li>Với từng cú sửa dưới đây, GHI RA GIẤY trước xem bước nào trong năm bước sẽ in <code>CACHED</code>, rồi dựng với <code>--progress=plain</code> và so: (a) <code>touch app.js</code>; (b) đổi chữ bên trong <code>app.js</code>; (c) <code>npm install --package-lock-only helmet@^8.0.0</code>; (d) thêm <code>ARG BUILD_DATE</code> ngay dưới <code>FROM</code> rồi dựng hai lần với hai giá trị <code>--build-arg BUILD_DATE=…</code> khác nhau.</li>
<li>Dời <code>ARG</code> xuống ngay trên một dòng cuối mới <code>LABEL built=$BUILD_DATE</code> rồi làm lại (d).</li>
<li>Dọn: <code>docker rmi c:1 c:2 c:3 c:arg</code> (tag nào bạn không tạo thì bỏ qua lỗi "No such image").</li></ol>
<pre><code class="language-bash">docker build --progress=plain -t c:x . 2&gt;&amp;1 | grep -E '^#[0-9]+ \\[|CACHED$|DONE [0-9.]+s$' | grep -v internal</code></pre>
<p><strong>Đạt khi:</strong> cả bốn dự đoán khớp với thứ BuildKit in ra, với từng cái bạn nói được LUẬT nào quyết định nó (nội dung file / chuỗi lệnh / lan xuống / ARG), và sau khi dời <code>ARG</code> xuống, đổi <code>BUILD_DATE</code> vẫn để <code>npm ci</code> là <code>CACHED</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Build cache (bộ đệm dựng)</span><span class="v">Kho kết quả của những lượt dựng trước mà BuildKit dùng lại thay vì chạy lại một bước.</span></div>
  <div class="kv"><span class="k">Cache key (khoá cache)</span><span class="v">"Dấu vân tay" của một bước: khoá của bước trước + chuỗi lệnh (RUN) hoặc nội dung file (COPY).</span></div>
  <div class="kv"><span class="k">Cache hit / miss (trúng / trượt)</span><span class="v">Trúng: tìm thấy khoá, bước in <code>CACHED</code>. Trượt: không thấy, bước chạy thật và in <code>DONE x.xs</code>.</span></div>
  <div class="kv"><span class="k">Invalidation (vô hiệu hoá)</span><span class="v">Một thay đổi làm khoá khác đi. Nó lan xuống: mọi bước sau cú trượt đầu tiên đều trượt theo.</span></div>
  <div class="kv"><span class="k">BuildKit (bộ dựng)</span><span class="v">Cỗ máy thật sự chạy <code>docker build</code> từ Docker 23; nó tính khoá và chạy song song các bước không phụ thuộc nhau.</span></div>
  <div class="kv"><span class="k">Checksum (mã băm / tổng kiểm)</span><span class="v">Một con số ngắn tính từ các byte của file. Cùng byte thì cùng mã — vì thế <code>touch</code> không đổi được gì.</span></div>
  <div class="kv"><span class="k">Build argument — ARG (tham số dựng)</span><span class="v">Giá trị truyền bằng <code>--build-arg</code>. Mọi <code>RUN</code> sau chỗ khai báo đều thấy nó, nên giá trị đổi là tất cả chúng trượt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mỗi chỉ thị là một bước có khoá; khoá của một bước chứa khoá của bước ngay trước nó.</li>
<li><code>RUN</code> khoá theo CHUỖI lệnh, <code>COPY</code>/<code>ADD</code> theo BYTE của file — giờ sửa file không tính.</li>
<li>Cú trượt đầu tiên kéo mọi bước sau trượt theo: đó là lý do thứ tự quan trọng.</li>
<li><code>ARG</code> đổi giá trị thì mọi <code>RUN</code> sau chỗ khai báo chạy lại — hãy khai nó ngay trên dòng dùng nó.</li>
<li><code>apt-get update</code> phải chung một <code>RUN</code> với <code>apt-get install</code>, không thì danh mục gói cũ hàng tuần cứ nằm trong cache.</li>
<li>Đọc lượt dựng bằng <code>--progress=plain</code>: <code>CACHED</code> là trúng, <code>DONE x.xs</code> là bước đã chạy thật.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/build/cache/" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">Bộ đệm dựng của Docker</span><span class="lc-sub">Khoá cache được tính thế nào cho từng chỉ thị, thứ gì vô hiệu hoá chúng, và danh sách chính thức các kỹ thuật tối ưu. Tài liệu tham chiếu cho cả chương này.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/cache/invalidation/" target="_blank" rel="noopener">
  <span class="lc-ico">💥</span>
  <span class="lc-body"><span class="lc-title">Vô hiệu hoá cache</span><span class="lc-sub">Luật chính xác, gồm cả khác biệt giữa <code>RUN</code> (chuỗi câu lệnh) với <code>COPY</code> (nội dung file) và vì sao cái chuỗi lan xuống dưới.</span></span>
</a>
<a class="link-card" href="https://github.com/moby/buildkit" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">BuildKit</span><span class="lc-sub">Chính cái bộ dựng. Đáng biết rằng nó TỰ ĐỘNG chạy song song các stage độc lập — một trong những lý do khiến dựng nhiều tầng thường NHANH HƠN chứ không chậm hơn dựng một tầng.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: đoán trước cái cache</span><span class="lc-sub">Bài chấm điểm: nói xem bước nào dựng lại sau bốn kiểu sửa khác nhau, sửa một Dockerfile mà đổi README lại kích hoạt cài thư viện, và giải thích một cú 404 đến từ <code>apt-get update</code> đã bị lưu đệm.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> một tầng lưu đệm <em>ĐÚNG</em> theo luật của Docker và <em>SAI</em> trong thực tế. <code>RUN git clone https://github.com/me/lib.git</code> có một chuỗi câu lệnh cố định, nên BuildKit dùng lại kết quả đó MÃI MÃI — ảnh của bạn cứ đem theo cái commit của cái ngày bạn dựng lần đầu, và đẩy bao nhiêu lên kho đó cũng chẳng đổi được gì. Điều tương tự áp cho <code>RUN curl -O https://example.com/latest.tar.gz</code> và cho <code>RUN npm install -g some-cli</code> không ghim phiên bản. Cách chữa là làm cho thứ đang thay đổi trở thành một phần của cái khoá: ghim phiên bản ngay trong câu lệnh (<code>git clone --branch v1.4.2</code>), hoặc thêm một thứ vô hiệu hoá rẻ tiền như <code>ADD https://api.github.com/repos/me/lib/commits/main /tmp/commit.json</code> đứng trước lệnh clone.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> <code>RUN</code> được khoá theo CHUỖI câu lệnh còn <code>COPY</code> theo NỘI DUNG file — đó là lý do <code>apt-get update</code> đứng riêng một <code>RUN</code> là cái bẫy, và là lý do <code>touch</code> một file mà không sửa nó thì không tốn gì. Việc vô hiệu hoá LAN XUỐNG DƯỚI: trượt ở bước 3 là dựng lại mọi thứ sau nó, nên thứ tự là toàn bộ cuộc chơi. Và <code>--progress=plain</code> cùng <code>--no-cache</code> là hai cái cờ bạn cần để đo mọi thứ đó một cách trung thực.</p>
</div>
`,
    },
    /* ─────────────────────────── 5.2 ─────────────────────────── */
    {
      title: '5.2 — Ordering: the four-minute rebuild made six seconds|||5.2 — Thứ tự: biến bốn phút dựng lại thành sáu giây',
      slug: 'dk-5-2-thu-tu',
      type: 'LESSON',
      description: 'Đo thật hai Dockerfile chỉ khác nhau về thứ tự, nguyên tắc sắp theo tần suất thay đổi, chép có chọn lọc trong monorepo, và cuộc đánh đổi giữa gộp RUN cho ảnh nhỏ với tách RUN cho cache tốt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Ordering: the four-minute rebuild made six seconds</h2>
<p class="lead">Two Dockerfiles, identical instructions, different order. One rebuilds in four seconds when you edit a source file; the other takes ninety. This lesson measures both, states the principle in one sentence, and then applies it to the cases that are less obvious than <code>package.json</code>.</p>

<h3>The measurement</h3>
${slide('dk-05', 9, 'Chồng tầng HIT/MISS trước và sau khi đổi thứ tự COPY')}
<pre><code>mkdir -p ord/src &amp;&amp; cd ord
printf 'node_modules\\n.git\\n' &gt; .dockerignore
cat &gt; package.json &lt;&lt;'EOF'
{ "name": "o", "version": "1.0.0",
  "dependencies": { "express": "^4.21.1", "pg": "^8.13.1", "zod": "^3.23.8" } }
EOF
npm install --package-lock-only --silent
echo 'console.log(1);' &gt; src/index.js
echo '# docs' &gt; README.md

cat &gt; Dockerfile.slow &lt;&lt;'EOF'
# syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm ci --omit=dev
CMD ["node", "src/index.js"]
EOF

cat &gt; Dockerfile.fast &lt;&lt;'EOF'
# syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY src ./src
CMD ["node", "src/index.js"]
EOF

docker build -qf Dockerfile.slow -t o:slow . &gt;/dev/null
docker build -qf Dockerfile.fast -t o:fast . &gt;/dev/null
echo 'console.log(2);' &gt; src/index.js
echo '## more docs' &gt;&gt; README.md

echo '--- slow, after editing source ---'; time docker build -qf Dockerfile.slow -t o:slow . &gt;/dev/null
echo '--- fast, after editing source ---'; time docker build -qf Dockerfile.fast -t o:fast . &gt;/dev/null</code></pre>
<div class="out">--- slow, after editing source ---
real	0m8.412s
--- fast, after editing source ---
real	0m0.594s</div>
<div class="kv-grid">
  <div class="kv"><span class="k">14× on a toy project</span><span class="v">Three dependencies and one source file. The ratio holds as the project grows — and the absolute numbers grow with it.</span></div>
  <div class="kv"><span class="k">On a real backend</span><span class="v">A <code>npm ci</code> with 900 packages takes 90–180 seconds. Times every commit, every developer, every CI run. This is hours per week.</span></div>
  <div class="kv"><span class="k">The README also broke it</span><span class="v">In the slow version, editing documentation reinstalls every dependency, because <code>COPY . .</code> hashes the whole context including files the build never uses.</span></div>
  <div class="kv"><span class="k">Nothing else differs</span><span class="v">Same base image, same commands, same result. The only change is which files are copied when — which is why this is the highest-value edit in most Dockerfiles.</span></div>
</div>

<h3>Measured again, on a real backend: 138 seconds versus 4.8</h3>
${slide('dk-05', 10, 'Đo thật: 138,6 s so với 4,8 s')}
<p>The toy above has three dependencies. To see what ordering is worth on a real project, the same two Dockerfiles were built on the course Mac (Docker Desktop 4.91, Engine 29.8) with the <code>package.json</code> and lockfile of a real student backend — Express, Prisma, Redis client, AWS SDK and friends: <strong>898 packages</strong> in the lockfile. Install command <code>npm ci --omit=dev --ignore-scripts</code> (scripts off so Prisma's postinstall does not need the schema). Then one line of <code>src/index.js</code> was edited and each file rebuilt, three times in a row:</p>
<table>
<tr><th>After editing one source line</th><th>Run 1</th><th>Run 2</th><th>Run 3</th></tr>
<tr><td><code>COPY . .</code> above <code>npm ci</code> ("slow")</td><td>138.6 s</td><td>237.5 s</td><td>110.7 s</td></tr>
<tr><td>manifests first ("fast")</td><td>3.6 s</td><td>4.8 s</td><td>5.4 s</td></tr>
</table>
<p>Roughly <strong>29 times faster</strong>, for moving one line. The toy project on the same Mac gave a median of 6.3 s against 1.8 s (five runs each) — a smaller ratio, because the floor of a "fast" build on a Mac is about one second of asking Docker Hub for image metadata (Lesson 5.1), and a three-package <code>npm ci</code> is only a few seconds anyway. The bigger the dependency tree, the bigger the win.</p>
<div class="callout"><strong>Why the slow column jumps between 110 and 237 seconds.</strong> Nothing in Docker changed between those runs: <code>npm ci</code> downloads from the npm registry, and download time depends on the network and on the registry that minute. The same lockfile took anywhere from 29 to 150 seconds to install across this chapter's measurements. This is why every measurement here is repeated, and why the fix that matters is making the install <em>not run at all</em> — a step that does not run has no variance.</div>

<h3>Run it step by step: reorder a real Node + Prisma Dockerfile</h3>
<p>Here is the shape a student backend usually starts with, and the reordered version, line by line. Prisma matters because <code>prisma generate</code> reads the schema, and the schema changes far less often than your routes and services.</p>
<pre><code class="language-dockerfile"><span class="tok-comment"># BEFORE — every edit to src/ reinstalls 898 packages and regenerates the client</span>
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm ci
RUN npx prisma generate
RUN npm run build
CMD ["node", "dist/index.js"]</code></pre>
<pre><code class="language-dockerfile"><span class="tok-comment"># AFTER — each group only reruns when ITS inputs change</span>
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./      <span class="tok-comment"># 1 · changes when you add a library</span>
RUN npm ci
COPY prisma ./prisma                         <span class="tok-comment"># 2 · changes when you edit the schema</span>
RUN npx prisma generate
COPY tsconfig.json ./                        <span class="tok-comment"># 3 · changes rarely</span>
COPY src ./src                               <span class="tok-comment"># 4 · changes every few minutes</span>
RUN npm run build
CMD ["node", "dist/index.js"]</code></pre>
<table>
<tr><th>You edit…</th><th>BEFORE reruns</th><th>AFTER reruns</th></tr>
<tr><td>a file in <code>src/</code></td><td>npm ci + prisma generate + build</td><td>build only</td></tr>
<tr><td><code>schema.prisma</code></td><td>npm ci + prisma generate + build</td><td>prisma generate + build</td></tr>
<tr><td><code>package.json</code></td><td>everything</td><td>everything (correct — the libraries changed)</td></tr>
<tr><td><code>README.md</code></td><td>npm ci + prisma generate + build</td><td>nothing — README is never copied</td></tr>
</table>
<p>Two things to check after reordering. First, that nothing the later steps need was forgotten: if <code>npm run build</code> fails with "Cannot find module" or a missing <code>tsconfig.json</code>, a <code>COPY</code> line is missing, not the cache misbehaving. Second, the result: build twice, edit one file in <code>src/</code>, build again with <code>--progress=plain</code> and confirm <code>npm ci</code> and <code>prisma generate</code> both say <code>CACHED</code>.</p>

<h3>When to use the bind-mount trick, and when not to</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Use it</span><span class="v">In a workspace/monorepo with many <code>package.json</code> files, where listing each one in a <code>COPY</code> is long and goes stale the day someone adds a package. <code>RUN --mount=type=bind,source=.,target=/src …</code> lets a step read files that never become a layer.</span></div>
  <div class="kv"><span class="k">Do not use it</span><span class="v">For a plain single-package project: two <code>COPY</code> lines are simpler, and everyone on the team can read them. Also not for files the final image needs — a bind mount, like a cache mount, leaves nothing behind in the layer.</span></div>
  <div class="kv"><span class="k">The catch</span><span class="v">A bind-mounted directory is still part of the step's cache key (by content), so mounting the whole repository re-runs the step on every edit. Mount only the manifests, or use the mount for the install and <code>COPY</code> for the source.</span></div>
</div>

<h3>The principle</h3>
${slide('dk-05', 11, 'Luật xếp: ít đổi ở dưới, hay đổi ở trên')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Order instructions by how often their inputs change</span><span class="lz-t">rarest at the top, most volatile at the bottom</span><span class="lz-d">Because invalidation cascades downward (Lesson 5.1), anything above a change is preserved and everything below it is thrown away. Sorting by change frequency minimises what gets thrown away.</span></div>
  <div class="lz-step"><span class="lz-k">1 · Base image and system packages</span><span class="lz-t">FROM · apk add · apt-get install</span><span class="lz-d">Changes monthly at most. Should almost never be invalidated by your work.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Dependency manifests, then install</span><span class="lz-t">COPY package*.json → RUN npm ci</span><span class="lz-d">Changes when you add a library — weekly at most. The expensive step, protected by copying only the two files it actually reads.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Source code</span><span class="lz-t">COPY src ./src</span><span class="lz-d">Changes many times an hour. Everything below this line will rerun on every edit, so keep what is below it cheap.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Build, then metadata</span><span class="lz-t">RUN npm run build · ENV · USER · CMD</span><span class="lz-d">Metadata instructions cost nothing, so their position barely matters. Put them last for readability.</span></div>
</div>

<h3>The cases that are less obvious</h3>
<pre><code><span class="tok-comment"># A monorepo / npm workspace — copy only the manifests, from everywhere</span>
COPY package.json package-lock.json ./
COPY packages/api/package.json      packages/api/
COPY packages/web/package.json      packages/web/
COPY packages/shared/package.json   packages/shared/
RUN npm ci
COPY . .</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Workspaces need every package.json</span><span class="v"><code>npm ci</code> in a workspace root reads the manifest of every workspace member. Copying only the root one fails; copying everything defeats the purpose. Enumerating them is verbose and correct.</span></div>
  <div class="kv"><span class="k">Or use a bind mount</span><span class="v"><code>RUN --mount=type=bind,source=.,target=/src npm ci</code> reads files without copying them into a layer, so nothing about the source becomes part of that step's output. Advanced but very clean.</span></div>
  <div class="kv"><span class="k">Generated files go last</span><span class="v">A <code>version.json</code> or a build stamp written by CI changes every single build. Copy it after the expensive steps, or generate it in the final stage.</span></div>
  <div class="kv"><span class="k">Static assets can go early</span><span class="v">Fonts, images and vendored libraries change rarely. Copying them in their own <code>COPY --link</code> before the source keeps them out of the volatile part of the chain.</span></div>
  <div class="kv"><span class="k">Prisma and codegen</span><span class="v"><code>COPY prisma ./prisma</code> then <code>RUN npx prisma generate</code> belongs with the dependency step, not the source step — the schema changes far less often than application code.</span></div>
</div>
<pre><code><span class="tok-comment"># Python — the same shape</span>
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .

<span class="tok-comment"># Go — go.mod/go.sum first, then download, then source</span>
COPY go.mod go.sum ./
RUN go mod download
COPY . .

<span class="tok-comment"># Rust — the cargo trick: build a dummy main to cache dependencies</span>
COPY Cargo.toml Cargo.lock ./
RUN mkdir src &amp;&amp; echo 'fn main(){}' &gt; src/main.rs &amp;&amp; cargo build --release &amp;&amp; rm -rf src
COPY src ./src
RUN touch src/main.rs &amp;&amp; cargo build --release</code></pre>

<h3>Grouping RUN steps: the real trade-off</h3>
${slide('dk-05', 12, 'Gộp RUN theo tần suất đổi, không phải càng ít tầng càng tốt')}
<pre><code><span class="tok-comment"># A: one layer — smallest image, worst cache granularity</span>
RUN apk add --no-cache python3 make g++ \\
 &amp;&amp; npm ci --omit=dev \\
 &amp;&amp; apk del python3 make g++

<span class="tok-comment"># B: two layers — build tools cached separately from dependencies</span>
RUN apk add --no-cache --virtual .build python3 make g++
RUN npm ci --omit=dev
RUN apk del .build</code></pre>
<div class="callout"><strong>The rule is not "fewer layers"; it is "group by change frequency".</strong> Version A produces a smaller image because the tools are removed within the same layer (Lesson 1.2) — but adding one dependency reinstalls the compilers too. Version B keeps the compiler layer cached across dependency changes, at the cost of the tools remaining in the image. In a <em>multi-stage</em> build the trade-off disappears: use B in the build stage, where size does not matter, and copy only the result into a clean final stage (Chapter 6). That is the honest answer, and it is why multi-stage and cache optimisation are usually done together.</div>

<h3>Measuring your own Dockerfile</h3>
<pre><code><span class="tok-comment"># Where does the time actually go? Sorted, cold build.</span>
docker build --no-cache --progress=plain -f Dockerfile.fast -t o:m . 2&gt;&amp;1 \\
  | grep -oE '^#[0-9]+ DONE [0-9.]+s' | sort -k3 -hr | head -5

<span class="tok-comment"># And which steps survive a source edit?</span>
echo 'console.log(3);' &gt; src/index.js
docker build --progress=plain -f Dockerfile.fast -t o:m . 2&gt;&amp;1 \\
  | grep -cE 'CACHED'</code></pre>
<div class="out">#9 DONE 5.4s
#11 DONE 0.4s
#8 DONE 0.1s
#7 DONE 0.0s
#5 DONE 0.0s
3</div>
<p>One step is 5.4 seconds and everything else is noise. That is the step to protect, and protecting it means making sure nothing above it changes when your source does. Every optimisation in this chapter is a variation on that sentence.</p>
<p class="note-ct">On Docker Engine 29 the same count prints <strong>4</strong>, not 3: the <code># syntax=docker/dockerfile:1</code> line adds one <code>CACHED</code> for the frontend image (Lesson 5.1). Count only lines of your own steps with <code>grep -cE '^#[0-9]+ CACHED' </code> after filtering <code>[internal]</code>, or simply read the list. And on a Mac, <code>sort -h</code> works: macOS <code>sort</code> understands human-readable numbers like <code>29.2s</code>.</p>
<pre><code>cd ..; rm -rf ord; docker rmi o:slow o:fast o:m &gt;/dev/null 2&gt;&amp;1</code></pre>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your group's Express + Prisma backend has the "BEFORE" Dockerfile above, and every teammate loses a couple of minutes per edit. Fix it and bring numbers to the next meeting.</p><ol>
<li>In <code>~/thu-docker/order52</code>, copy your own project's <code>package.json</code>, <code>package-lock.json</code>, <code>prisma/</code>, <code>tsconfig.json</code> and <code>src/</code> (or the <code>ord</code> demo from this lesson if you have no project yet), plus a <code>.dockerignore</code> with <code>node_modules</code> and <code>.git</code>.</li>
<li>Write the BEFORE Dockerfile, build it once, then edit one line in <code>src/</code> and time the rebuild with <code>time docker build -q -t team:before .</code>. Repeat the edit + build twice more.</li>
<li>Write the AFTER Dockerfile (<code>-f Dockerfile.after</code>), build it once, and time the same three edits.</li>
<li>Build AFTER once more with <code>--progress=plain</code> after a source edit and check which steps say <code>CACHED</code>.</li></ol>
<p><strong>Done when:</strong> you have a small table of six timings, the AFTER rebuilds are a fraction of the BEFORE ones, and the <code>--progress=plain</code> output shows <code>RUN npm ci</code> (and <code>prisma generate</code> if you have it) as <code>CACHED</code> after a source edit.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Build context</span><span class="v">The folder you pass to <code>docker build</code> (the final <code>.</code>); <code>COPY . .</code> means "everything in it that <code>.dockerignore</code> lets through".</span></div>
  <div class="kv"><span class="k">Manifest / lockfile</span><span class="v"><code>package.json</code> lists what you want; <code>package-lock.json</code> pins the exact versions. <code>npm ci</code> reads both — so they are the only files the install step needs.</span></div>
  <div class="kv"><span class="k">npm ci</span><span class="v">"Clean install": deletes <code>node_modules</code> and installs exactly what the lockfile says. Reproducible, which is what an image build wants.</span></div>
  <div class="kv"><span class="k">Change frequency</span><span class="v">How often an input changes: base image (monthly), libraries (weekly), source (hourly). Order Dockerfile lines by it.</span></div>
  <div class="kv"><span class="k">Monorepo / workspace</span><span class="v">One repository holding several packages, each with its own <code>package.json</code>; the root <code>npm ci</code> reads all of them.</span></div>
  <div class="kv"><span class="k">Cache granularity</span><span class="v">How finely the work is split into cacheable steps. Split along change frequency; merging unrelated work makes misses more expensive.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Order instructions from rarely-changing (base, system packages) to often-changing (source, build).</li>
<li>Copy the manifest and lockfile, install, and only then copy the source — on a real 898-package backend that turned 138 s into 4.8 s.</li>
<li>Group codegen with what it reads: <code>prisma generate</code> belongs after <code>COPY prisma</code>, before <code>COPY src</code>.</li>
<li>Network-bound steps vary wildly between runs; the robust win is a step that does not run at all.</li>
<li>Fewer layers is not the goal: group <code>RUN</code> steps by change frequency and let multi-stage handle image size.</li>
<li>Verify with <code>--progress=plain</code> after a source edit: the install step must say <code>CACHED</code>.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/build/cache/optimize/" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Optimizing builds with cache</span><span class="lc-sub">Docker's own guide to ordering, selective copying and mount types, with the same reasoning and different examples. A good second pass on this lesson.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/dockerfile/#run---mounttypebind" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">RUN --mount=type=bind</span><span class="lc-sub">Reading files during a build without copying them into a layer. The clean solution to the monorepo manifest problem, and it keeps the image smaller too.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: reorder for speed</span><span class="lc-sub">Graded exercises: measure a slow Dockerfile, reorder it and measure again, fix a workspace build that misses the cache on every commit, and decide whether to group or split a pair of <code>RUN</code>s.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> <code>COPY . .</code> immediately followed by the dependency install, in a repository where CI writes a file into the working directory before building. A coverage report, a <code>build-info.json</code>, a <code>.env</code> rendered from secrets — any of them changes the context hash on every run, so the cache misses on <em>every single CI build</em> even though the ordering looks correct locally. The symptom is "the cache works on my machine and never in CI". Check what is in the context at build time (<code>docker build --progress=plain</code> shows the transferred size) and add the generated files to <code>.dockerignore</code>, or write them after the build instead of before.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Order instructions by how often their inputs change — rarest at the top — because invalidation only ever cascades downward. Copy dependency manifests and install <em>before</em> copying source; in a monorepo that means enumerating every workspace <code>package.json</code>, which is verbose and worth it. And "fewer layers" is not the goal: group <code>RUN</code> steps by change frequency, and let a multi-stage build handle the size question separately.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Thứ tự: biến bốn phút dựng lại thành sáu giây</h2>
<p class="lead">Hai Dockerfile, chỉ thị giống hệt nhau, thứ tự khác nhau. Một cái dựng lại trong bốn giây khi bạn sửa một file mã nguồn; cái kia mất chín mươi giây. Bài này ĐO cả hai, phát biểu nguyên tắc trong một câu, rồi áp nó vào những trường hợp ít hiển nhiên hơn <code>package.json</code>.</p>

<h3>Phép đo</h3>
${slide('dk-05', 9, 'Chồng tầng HIT/MISS trước và sau khi đổi thứ tự COPY')}
<pre><code>mkdir -p ord/src &amp;&amp; cd ord
printf 'node_modules\\n.git\\n' &gt; .dockerignore
cat &gt; package.json &lt;&lt;'EOF'
{ "name": "o", "version": "1.0.0",
  "dependencies": { "express": "^4.21.1", "pg": "^8.13.1", "zod": "^3.23.8" } }
EOF
npm install --package-lock-only --silent
echo 'console.log(1);' &gt; src/index.js
echo '# tài liệu' &gt; README.md

cat &gt; Dockerfile.slow &lt;&lt;'EOF'
# syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm ci --omit=dev
CMD ["node", "src/index.js"]
EOF

cat &gt; Dockerfile.fast &lt;&lt;'EOF'
# syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY src ./src
CMD ["node", "src/index.js"]
EOF

docker build -qf Dockerfile.slow -t o:slow . &gt;/dev/null
docker build -qf Dockerfile.fast -t o:fast . &gt;/dev/null
echo 'console.log(2);' &gt; src/index.js
echo '## thêm tài liệu' &gt;&gt; README.md

echo '--- chậm, sau khi sửa mã nguồn ---'; time docker build -qf Dockerfile.slow -t o:slow . &gt;/dev/null
echo '--- nhanh, sau khi sửa mã nguồn ---'; time docker build -qf Dockerfile.fast -t o:fast . &gt;/dev/null</code></pre>
<div class="out">--- chậm, sau khi sửa mã nguồn ---
real	0m8.412s
--- nhanh, sau khi sửa mã nguồn ---
real	0m0.594s</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Gấp 14 lần trên một dự án đồ chơi</span><span class="v">Ba thư viện và một file mã nguồn. Tỷ lệ đó giữ nguyên khi dự án lớn lên — và những con số tuyệt đối thì lớn lên theo.</span></div>
  <div class="kv"><span class="k">Trên một backend thật</span><span class="v">Một lệnh <code>npm ci</code> với 900 gói mất 90–180 giây. Nhân với mọi commit, mọi lập trình viên, mọi lượt chạy CI. Đó là hàng giờ mỗi tuần.</span></div>
  <div class="kv"><span class="k">Cái README cũng phá nó</span><span class="v">Ở bản chậm, sửa TÀI LIỆU cũng cài lại mọi thư viện, vì <code>COPY . .</code> băm cả cái ngữ cảnh, gồm cả những file mà lượt dựng không bao giờ dùng.</span></div>
  <div class="kv"><span class="k">Không có gì khác biệt nữa</span><span class="v">Cùng ảnh nền, cùng câu lệnh, cùng kết quả. Thay đổi duy nhất là file nào được chép vào lúc nào — và đó là lý do đây là chỗ sửa có giá trị cao nhất trong phần lớn Dockerfile.</span></div>
</div>

<h3>Đo lại trên một backend THẬT: 138 giây so với 4,8</h3>
${slide('dk-05', 10, 'Đo thật: 138,6 s so với 4,8 s')}
<p>Ví dụ đồ chơi ở trên có ba thư viện. Để thấy thứ tự đáng giá bao nhiêu trên một dự án thật, hai Dockerfile y như trên được dựng trên máy Mac của khoá (Docker Desktop 4.91, Engine 29.8) với <code>package.json</code> và lockfile của một backend sinh viên thật — Express, Prisma, client Redis, AWS SDK và đồng bọn: <strong>898 gói</strong> trong lockfile. Lệnh cài là <code>npm ci --omit=dev --ignore-scripts</code> (tắt script để postinstall của Prisma khỏi đòi schema). Rồi sửa một dòng trong <code>src/index.js</code> và dựng lại từng bản, ba lần liên tiếp:</p>
<table>
<tr><th>Sau khi sửa một dòng mã</th><th>Lần 1</th><th>Lần 2</th><th>Lần 3</th></tr>
<tr><td><code>COPY . .</code> đứng trên <code>npm ci</code> (bản "chậm")</td><td>138,6 s</td><td>237,5 s</td><td>110,7 s</td></tr>
<tr><td>chép file khai báo trước (bản "nhanh")</td><td>3,6 s</td><td>4,8 s</td><td>5,4 s</td></tr>
</table>
<p>Nhanh hơn chừng <strong>29 lần</strong>, chỉ nhờ dời một dòng. Dự án đồ chơi trên cùng máy Mac cho trung vị 6,3 s so với 1,8 s (năm lần mỗi bên) — tỉ lệ nhỏ hơn, vì "đáy" của một lượt dựng nhanh trên Mac là khoảng một giây hỏi Docker Hub siêu dữ liệu ảnh (Bài 5.1), còn <code>npm ci</code> ba gói thì vốn chỉ vài giây. Cây thư viện càng to, lời càng lớn.</p>
<div class="callout"><strong>Vì sao cột "chậm" nhảy từ 110 lên 237 giây.</strong> Giữa các lần đó Docker chẳng đổi gì: <code>npm ci</code> tải từ registry npm, và thời gian tải phụ thuộc mạng và registry ở đúng phút đó. Cùng một lockfile mà trong các phép đo của chương này lúc cài mất 29 giây, lúc 150 giây. Đó là lý do mọi phép đo ở đây đều lặp lại, và là lý do cách sửa đáng giá là làm cho bước cài <em>KHÔNG CHẠY</em> — một bước không chạy thì không có dao động.</div>

<h3>Chạy thử từng bước: sắp lại một Dockerfile Node + Prisma thật</h3>
<p>Đây là hình dạng một backend sinh viên hay bắt đầu, và bản đã sắp lại, từng dòng. Prisma đáng chú ý vì <code>prisma generate</code> đọc schema, mà schema thì đổi ít hơn hẳn route với service của bạn.</p>
<pre><code class="language-dockerfile"><span class="tok-comment"># TRƯỚC — mỗi lần sửa src/ là cài lại 898 gói và sinh lại client</span>
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm ci
RUN npx prisma generate
RUN npm run build
CMD ["node", "dist/index.js"]</code></pre>
<pre><code class="language-dockerfile"><span class="tok-comment"># SAU — mỗi nhóm chỉ chạy lại khi ĐẦU VÀO CỦA NÓ đổi</span>
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./      <span class="tok-comment"># 1 · đổi khi thêm thư viện</span>
RUN npm ci
COPY prisma ./prisma                         <span class="tok-comment"># 2 · đổi khi sửa schema</span>
RUN npx prisma generate
COPY tsconfig.json ./                        <span class="tok-comment"># 3 · hiếm khi đổi</span>
COPY src ./src                               <span class="tok-comment"># 4 · đổi vài phút một lần</span>
RUN npm run build
CMD ["node", "dist/index.js"]</code></pre>
<table>
<tr><th>Bạn sửa…</th><th>TRƯỚC chạy lại</th><th>SAU chạy lại</th></tr>
<tr><td>một file trong <code>src/</code></td><td>npm ci + prisma generate + build</td><td>chỉ build</td></tr>
<tr><td><code>schema.prisma</code></td><td>npm ci + prisma generate + build</td><td>prisma generate + build</td></tr>
<tr><td><code>package.json</code></td><td>tất cả</td><td>tất cả (đúng thôi — thư viện đã đổi)</td></tr>
<tr><td><code>README.md</code></td><td>npm ci + prisma generate + build</td><td>không gì cả — README không bao giờ được chép</td></tr>
</table>
<p>Sắp lại xong kiểm hai điều. Một: không quên thứ mà các bước sau cần — nếu <code>npm run build</code> hỏng với "Cannot find module" hay thiếu <code>tsconfig.json</code> thì là thiếu một dòng <code>COPY</code>, không phải cache làm bậy. Hai: kết quả — dựng hai lần, sửa một file trong <code>src/</code>, dựng lại với <code>--progress=plain</code> và xác nhận cả <code>npm ci</code> lẫn <code>prisma generate</code> đều in <code>CACHED</code>.</p>

<h3>Khi nào dùng mẹo bind mount, khi nào KHÔNG</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Nên dùng</span><span class="v">Trong workspace/monorepo có nhiều <code>package.json</code>, nơi liệt kê từng cái trong <code>COPY</code> vừa dài vừa lỗi thời ngay hôm có người thêm gói. <code>RUN --mount=type=bind,source=.,target=/src …</code> cho một bước ĐỌC file mà file đó không bao giờ thành tầng.</span></div>
  <div class="kv"><span class="k">Đừng dùng</span><span class="v">Cho dự án một gói bình thường: hai dòng <code>COPY</code> đơn giản hơn, và cả nhóm đọc hiểu được. Cũng đừng dùng cho file mà ảnh cuối cần — bind mount, giống cache mount, không để lại gì trong tầng.</span></div>
  <div class="kv"><span class="k">Cái bẫy</span><span class="v">Thư mục được bind mount VẪN là một phần khoá cache của bước đó (theo nội dung), nên gắn cả kho mã vào là bước đó chạy lại ở mọi lần sửa. Chỉ gắn file khai báo, hoặc dùng mount cho bước cài và <code>COPY</code> cho mã nguồn.</span></div>
</div>

<h3>Cái nguyên tắc</h3>
${slide('dk-05', 11, 'Luật xếp: ít đổi ở dưới, hay đổi ở trên')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Sắp các chỉ thị theo TẦN SUẤT THAY ĐỔI của đầu vào</span><span class="lz-t">ít đổi nhất lên trên, hay đổi nhất xuống dưới</span><span class="lz-d">Vì việc vô hiệu hoá lan XUỐNG DƯỚI (Bài 5.1), mọi thứ NẰM TRÊN một thay đổi thì được giữ lại còn mọi thứ dưới nó thì bị vứt đi. Sắp theo tần suất thay đổi là giảm tối đa phần bị vứt.</span></div>
  <div class="lz-step"><span class="lz-k">1 · Ảnh nền và gói hệ thống</span><span class="lz-t">FROM · apk add · apt-get install</span><span class="lz-d">Nhiều lắm thì đổi hằng tháng. Gần như không bao giờ nên bị vô hiệu hoá bởi công việc của bạn.</span></div>
  <div class="lz-step"><span class="lz-k">2 · File khai báo thư viện, rồi cài</span><span class="lz-t">COPY package*.json → RUN npm ci</span><span class="lz-d">Đổi khi bạn thêm một thư viện — nhiều lắm là hằng tuần. Đây là bước ĐẮT, được bảo vệ bằng cách chỉ chép đúng hai file mà nó thật sự đọc.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Mã nguồn</span><span class="lz-t">COPY src ./src</span><span class="lz-d">Đổi nhiều lần mỗi giờ. Mọi thứ dưới dòng này sẽ chạy lại ở MỌI lần sửa, nên hãy giữ cho phần dưới nó rẻ.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Bước dựng, rồi siêu dữ liệu</span><span class="lz-t">RUN npm run build · ENV · USER · CMD</span><span class="lz-d">Chỉ thị siêu dữ liệu không tốn gì, nên vị trí của chúng gần như không quan trọng. Hãy đặt cuối cho dễ đọc.</span></div>
</div>

<h3>Những trường hợp ít hiển nhiên hơn</h3>
<pre><code><span class="tok-comment"># Một monorepo / npm workspace — chỉ chép các file khai báo, từ mọi nơi</span>
COPY package.json package-lock.json ./
COPY packages/api/package.json      packages/api/
COPY packages/web/package.json      packages/web/
COPY packages/shared/package.json   packages/shared/
RUN npm ci
COPY . .</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Workspace cần MỌI package.json</span><span class="v"><code>npm ci</code> ở gốc một workspace đọc file khai báo của MỌI thành viên. Chỉ chép cái gốc thì hỏng; chép tất cả thì phá luôn mục đích. Liệt kê ra thì dài dòng và đúng.</span></div>
  <div class="kv"><span class="k">Hoặc dùng một bind mount</span><span class="v"><code>RUN --mount=type=bind,source=.,target=/src npm ci</code> đọc file mà KHÔNG chép chúng vào một tầng, nên không có gì về mã nguồn trở thành một phần output của bước đó. Nâng cao nhưng rất sạch.</span></div>
  <div class="kv"><span class="k">File được sinh ra thì để CUỐI</span><span class="v">Một <code>version.json</code> hay một dấu thời gian build do CI ghi thì đổi ở MỌI lượt dựng. Hãy chép nó SAU những bước đắt tiền, hoặc sinh nó ra trong stage cuối.</span></div>
  <div class="kv"><span class="k">Tài nguyên tĩnh thì để SỚM</span><span class="v">Font, hình ảnh và thư viện đóng gói sẵn thì hiếm đổi. Chép chúng bằng một <code>COPY --link</code> riêng, đặt trước mã nguồn, giữ chúng nằm ngoài phần hay biến động của cái chuỗi.</span></div>
  <div class="kv"><span class="k">Prisma và sinh mã</span><span class="v"><code>COPY prisma ./prisma</code> rồi <code>RUN npx prisma generate</code> thuộc về bước THƯ VIỆN, không phải bước mã nguồn — lược đồ đổi ít hơn hẳn mã ứng dụng.</span></div>
</div>
<pre><code><span class="tok-comment"># Python — cùng một hình hài</span>
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .

<span class="tok-comment"># Go — go.mod/go.sum trước, rồi tải, rồi tới mã nguồn</span>
COPY go.mod go.sum ./
RUN go mod download
COPY . .

<span class="tok-comment"># Rust — mẹo của cargo: dựng một main giả để lưu đệm thư viện</span>
COPY Cargo.toml Cargo.lock ./
RUN mkdir src &amp;&amp; echo 'fn main(){}' &gt; src/main.rs &amp;&amp; cargo build --release &amp;&amp; rm -rf src
COPY src ./src
RUN touch src/main.rs &amp;&amp; cargo build --release</code></pre>

<h3>Gộp các bước RUN: cuộc đánh đổi thật</h3>
${slide('dk-05', 12, 'Gộp RUN theo tần suất đổi, không phải càng ít tầng càng tốt')}
<pre><code><span class="tok-comment"># A: một tầng — ảnh nhỏ nhất, cache thô nhất</span>
RUN apk add --no-cache python3 make g++ \\
 &amp;&amp; npm ci --omit=dev \\
 &amp;&amp; apk del python3 make g++

<span class="tok-comment"># B: hai tầng — công cụ dựng được lưu đệm riêng khỏi thư viện</span>
RUN apk add --no-cache --virtual .build python3 make g++
RUN npm ci --omit=dev
RUN apk del .build</code></pre>
<div class="callout"><strong>Cái luật KHÔNG phải là "ít tầng hơn"; nó là "gộp theo tần suất thay đổi".</strong> Bản A cho ảnh nhỏ hơn vì công cụ bị gỡ NGAY TRONG cùng cái tầng đó (Bài 1.2) — nhưng thêm một thư viện là cài lại luôn cả đám trình biên dịch. Bản B giữ tầng trình biên dịch nằm trong cache xuyên qua các thay đổi thư viện, đổi lại là công cụ nằm lại trong ảnh. Trong một lượt dựng <em>NHIỀU TẦNG</em> thì cuộc đánh đổi đó BIẾN MẤT: hãy dùng B trong stage dựng, nơi kích thước không quan trọng, rồi chỉ chép kết quả sang một stage cuối sạch sẽ (Chương 6). Đó là câu trả lời trung thực, và là lý do dựng nhiều tầng với tối ưu cache thường được làm cùng nhau.</div>

<h3>Đo chính cái Dockerfile của bạn</h3>
<pre><code><span class="tok-comment"># Thời gian thật ra đi đâu? Sắp xếp lại, dựng nguội.</span>
docker build --no-cache --progress=plain -f Dockerfile.fast -t o:m . 2&gt;&amp;1 \\
  | grep -oE '^#[0-9]+ DONE [0-9.]+s' | sort -k3 -hr | head -5

<span class="tok-comment"># Và bước nào sống sót qua một lần sửa mã nguồn?</span>
echo 'console.log(3);' &gt; src/index.js
docker build --progress=plain -f Dockerfile.fast -t o:m . 2&gt;&amp;1 \\
  | grep -cE 'CACHED'</code></pre>
<div class="out">#9 DONE 5.4s
#11 DONE 0.4s
#8 DONE 0.1s
#7 DONE 0.0s
#5 DONE 0.0s
3</div>
<p>MỘT bước tốn 5,4 giây còn mọi thứ khác là nhiễu. Đó là cái bước cần bảo vệ, và bảo vệ nó nghĩa là đảm bảo không có gì NẰM TRÊN nó thay đổi khi mã nguồn của bạn thay đổi. Mọi tối ưu trong chương này đều là một biến thể của câu đó.</p>
<p class="note-ct">Trên Docker Engine 29, cùng phép đếm đó in <strong>4</strong> chứ không phải 3: dòng <code># syntax=docker/dockerfile:1</code> thêm một <code>CACHED</code> cho ảnh frontend (Bài 5.1). Muốn chỉ đếm bước của bạn thì lọc bỏ dòng <code>[internal]</code> và frontend trước, hoặc đơn giản là đọc cả danh sách. Và trên Mac, <code>sort -h</code> chạy được: <code>sort</code> của macOS hiểu số dạng dễ đọc như <code>29.2s</code>.</p>
<pre><code>cd ..; rm -rf ord; docker rmi o:slow o:fast o:m &gt;/dev/null 2&gt;&amp;1</code></pre>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> backend Express + Prisma của nhóm bạn đang dùng Dockerfile "TRƯỚC" ở trên, và mỗi người mất vài phút cho mỗi lần sửa. Sửa nó và mang SỐ ĐO tới buổi họp nhóm sau.</p><ol>
<li>Trong <code>~/thu-docker/order52</code>, chép <code>package.json</code>, <code>package-lock.json</code>, <code>prisma/</code>, <code>tsconfig.json</code> và <code>src/</code> của chính dự án bạn (hoặc ví dụ <code>ord</code> của bài này nếu chưa có dự án), cộng một <code>.dockerignore</code> có <code>node_modules</code> và <code>.git</code>.</li>
<li>Viết Dockerfile TRƯỚC, dựng một lần, rồi sửa một dòng trong <code>src/</code> và bấm giờ lượt dựng lại bằng <code>time docker build -q -t team:before .</code>. Lặp lại sửa + dựng thêm hai lần.</li>
<li>Viết Dockerfile SAU (<code>-f Dockerfile.after</code>), dựng một lần, rồi bấm giờ cùng ba lần sửa như thế.</li>
<li>Dựng bản SAU thêm một lần với <code>--progress=plain</code> sau một lần sửa mã và xem bước nào in <code>CACHED</code>.</li></ol>
<p><strong>Đạt khi:</strong> bạn có một bảng nhỏ sáu con số, lượt dựng lại của bản SAU chỉ bằng một phần nhỏ bản TRƯỚC, và output <code>--progress=plain</code> cho thấy <code>RUN npm ci</code> (và <code>prisma generate</code> nếu có) là <code>CACHED</code> sau khi sửa mã.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Build context (ngữ cảnh dựng)</span><span class="v">Thư mục bạn đưa cho <code>docker build</code> (dấu <code>.</code> cuối lệnh); <code>COPY . .</code> nghĩa là "mọi thứ trong đó mà <code>.dockerignore</code> cho qua".</span></div>
  <div class="kv"><span class="k">Manifest / lockfile (file khai báo / file khoá phiên bản)</span><span class="v"><code>package.json</code> ghi bạn muốn gì; <code>package-lock.json</code> ghim đúng phiên bản. <code>npm ci</code> đọc cả hai — nên đó là hai file DUY NHẤT bước cài cần.</span></div>
  <div class="kv"><span class="k">npm ci (cài sạch)</span><span class="v">Xoá <code>node_modules</code> rồi cài đúng y lockfile. Tái lập được — đúng thứ một lượt dựng ảnh cần.</span></div>
  <div class="kv"><span class="k">Change frequency (tần suất thay đổi)</span><span class="v">Một đầu vào đổi thường cỡ nào: ảnh nền (tháng), thư viện (tuần), mã (giờ). Sắp dòng Dockerfile theo nó.</span></div>
  <div class="kv"><span class="k">Monorepo / workspace (kho nhiều gói)</span><span class="v">Một kho mã chứa nhiều gói, mỗi gói một <code>package.json</code>; <code>npm ci</code> ở gốc đọc tất cả.</span></div>
  <div class="kv"><span class="k">Cache granularity (độ mịn của cache)</span><span class="v">Công việc được chia thành các bước lưu đệm được mịn tới đâu. Chia theo tần suất đổi; gộp việc không liên quan làm cú trượt đắt hơn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Sắp chỉ thị từ thứ ít đổi (ảnh nền, gói hệ thống) tới thứ hay đổi (mã nguồn, bước build).</li>
<li>Chép file khai báo và lockfile, cài, rồi MỚI chép mã — trên backend thật 898 gói, việc đó biến 138 s thành 4,8 s.</li>
<li>Đặt bước sinh mã cạnh thứ nó đọc: <code>prisma generate</code> nằm sau <code>COPY prisma</code>, trước <code>COPY src</code>.</li>
<li>Bước phụ thuộc mạng dao động rất mạnh giữa các lần; cái lời chắc chắn là một bước KHÔNG chạy.</li>
<li>Ít tầng không phải mục tiêu: gộp <code>RUN</code> theo tần suất đổi, để multi-stage lo kích thước ảnh.</li>
<li>Kiểm bằng <code>--progress=plain</code> sau một lần sửa mã: bước cài phải in <code>CACHED</code>.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/build/cache/optimize/" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Tối ưu bản dựng bằng cache</span><span class="lc-sub">Hướng dẫn của chính Docker về thứ tự, chép có chọn lọc và các loại mount, với cùng lý lẽ và ví dụ khác. Một lượt đọc thứ hai tốt cho bài này.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/dockerfile/#run---mounttypebind" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">RUN --mount=type=bind</span><span class="lc-sub">Đọc file trong lúc dựng mà không chép chúng vào một tầng. Giải pháp sạch cho bài toán file khai báo trong monorepo, và nó còn giữ cho ảnh nhỏ hơn.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: sắp lại cho nhanh</span><span class="lc-sub">Bài chấm điểm: đo một Dockerfile chậm, sắp lại rồi đo lần nữa, sửa một lượt dựng workspace trượt cache ở mọi commit, và quyết định nên gộp hay tách một cặp <code>RUN</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>COPY . .</code> đứng ngay trước lượt cài thư viện, trong một kho mã mà CI ghi một file vào thư mục làm việc TRƯỚC khi dựng. Một báo cáo độ phủ, một <code>build-info.json</code>, một <code>.env</code> được dựng ra từ bí mật — cái nào cũng làm đổi mã băm của ngữ cảnh ở mọi lượt chạy, nên cache TRƯỢT ở <em>MỌI LƯỢT DỰNG CI</em> dù thứ tự nhìn ở máy thì có vẻ đúng. Triệu chứng là "cache chạy trên máy tôi và không bao giờ chạy trong CI". Hãy kiểm xem trong ngữ cảnh có gì lúc dựng (<code>docker build --progress=plain</code> hiện ra kích thước đã truyền) rồi thêm những file được sinh ra vào <code>.dockerignore</code>, hoặc ghi chúng SAU lượt dựng thay vì trước.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Hãy sắp các chỉ thị theo tần suất thay đổi của đầu vào — ít đổi nhất lên trên — vì việc vô hiệu hoá chỉ lan xuống dưới. Hãy chép file khai báo thư viện rồi cài TRƯỚC khi chép mã nguồn; trong một monorepo thì điều đó nghĩa là liệt kê MỌI <code>package.json</code> của workspace, dài dòng nhưng đáng. Và "ít tầng hơn" KHÔNG phải mục tiêu: hãy gộp các bước <code>RUN</code> theo tần suất thay đổi, và để một lượt dựng nhiều tầng lo riêng chuyện kích thước.</p>
</div>
`,
    },
    /* ─────────────────────────── 5.3 ─────────────────────────── */
    {
      title: '5.3 — Cache mounts: keep the downloads between builds|||5.3 — Cache mount: giữ lại phần đã tải giữa các lượt dựng',
      slug: 'dk-5-3-cache-mount',
      type: 'LESSON',
      description: 'RUN --mount=type=cache giữ thư mục tải về của npm, pip, apt và Go xuyên qua các lượt dựng, đo thật trước và sau, mục tiêu đúng cho từng hệ sinh thái, và điệu nhảy keep-cache mà apt bắt buộc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Cache mounts: keep the downloads between builds</h2>
<p class="lead">Ordering protects a cached layer from being invalidated. But when it <em>is</em> invalidated — you added one dependency — <code>npm ci</code> starts from nothing and re-downloads all nine hundred packages. A cache mount fixes exactly that: a directory that survives across builds, lives outside any layer, and makes the miss cheap.</p>

<h3>The measurement</h3>
<pre><code>mkdir -p cm &amp;&amp; cd cm
printf 'node_modules\\n.git\\n' &gt; .dockerignore
cat &gt; package.json &lt;&lt;'EOF'
{ "name": "cm", "version": "1.0.0",
  "dependencies": { "express": "^4.21.1", "pg": "^8.13.1", "zod": "^3.23.8",
                    "pino": "^9.5.0", "dayjs": "^1.11.13" } }
EOF
npm install --package-lock-only --silent

cat &gt; Dockerfile.plain &lt;&lt;'EOF'
# syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
EOF

cat &gt; Dockerfile.cached &lt;&lt;'EOF'
# syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev
EOF

docker build -qf Dockerfile.plain  -t cm:p . &gt;/dev/null   <span class="tok-comment"># warm the registry side</span>
docker build -qf Dockerfile.cached -t cm:c . &gt;/dev/null   <span class="tok-comment"># warm the mount</span>
npm install --package-lock-only --silent --save cors &gt;/dev/null 2&gt;&amp;1

echo '--- no cache mount, one dependency added ---'
time docker build -qf Dockerfile.plain  -t cm:p . &gt;/dev/null
echo '--- with cache mount, same change ---'
time docker build -qf Dockerfile.cached -t cm:c . &gt;/dev/null</code></pre>
<div class="out">--- no cache mount, one dependency added ---
real	0m6.219s
--- with cache mount, same change ---
real	0m1.884s</div>
<p>Three times faster, on five dependencies. On a real project with several hundred packages the ratio is similar and the absolute saving is a minute or two per build — and it applies precisely on the builds where the layer cache could not help you.</p>

<h3>Measured on the real backend: one new library, 63 s versus 9 s</h3>
${slide('dk-05', 14, 'Thêm một thư viện: 63 s so với 9 s')}
<p>The measurement above uses five libraries. Repeated on the course Mac with the real 898-package lockfile from Lesson 5.2, on a separate builder (<code>docker buildx create --name dk05-builder --driver docker-container</code>) so that no other project's npm cache could help:</p>
<table>
<tr><th>Build</th><th>No cache mount</th><th>With <code>--mount=type=cache,target=/root/.npm</code></th></tr>
<tr><td>First build, empty builder</td><td>81.4 s</td><td>103.6 s</td></tr>
<tr><td>After adding <code>is-odd</code></td><td>63.4 s</td><td><strong>9.3 s</strong></td></tr>
<tr><td>After also adding <code>is-even</code></td><td>56.9 s</td><td><strong>10.3 s</strong></td></tr>
</table>
<p>Two things to read from it. The cold build with the mount is <em>slower</em> — the first run pays to fill a 165.5 MB npm cache it has not used yet; that cost is paid once. And every later dependency change is six times cheaper, because <code>npm ci</code> still runs — it still deletes and rebuilds <code>node_modules</code> — but it copies 898 tarballs from a local folder instead of downloading them. That is exactly the case ordering cannot help with: when <code>package.json</code> really changed.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">--mount</span><span class="v">An option of one <code>RUN</code> line only. It exists while that command runs and is gone after it — the next <code>RUN</code> does not see it unless it mounts it again.</span></div>
  <div class="kv"><span class="k">type=cache</span><span class="v">A directory BuildKit keeps between builds (other types: <code>bind</code> reads from the context, <code>secret</code> passes a secret file, <code>ssh</code> an SSH agent — Chapter 6).</span></div>
  <div class="kv"><span class="k">target=/root/.npm</span><span class="v">Where the directory appears inside the step. It must be the folder the tool <em>already</em> uses as its download cache — npm running as root uses <code>/root/.npm</code>. Wrong path = a mount nobody writes to.</span></div>
  <div class="kv"><span class="k">Needs BuildKit syntax</span><span class="v">Works with the default builder of any current Docker. The <code># syntax=docker/dockerfile:1</code> first line guarantees the newest Dockerfile features whatever engine version builds it.</span></div>
</div>

<h3>How it differs from a layer</h3>
${slide('dk-05', 13, 'Tầng cache: được ăn cả ngã về không — cache mount: MISS vẫn rẻ')}
<div class="lz-map">
  <div class="lz-stage">A cached layer</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Skips the step entirely</span><span class="lz-nsub">Nothing runs. All-or-nothing: any input change and you pay the full cost again.</span></div></div>
  <div class="lz-stage">A cache mount</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">The step runs, with its downloads already there</span><span class="lz-nsub">Incremental. <code>npm ci</code> still executes, resolves and links — but fetches only what is genuinely new. This is what makes a cache <em>miss</em> cheap.</span></div></div>
  <div class="lz-stage">They compose</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Layer cache for the common case, mount for the miss</span><span class="lz-nsub">Correct ordering (Lesson 5.2) means the step usually does not run at all; the cache mount means that when it does, it is fast. Use both.</span></div></div>
  <div class="lz-stage">Nothing lands in the image</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">The mounted directory is not part of any layer</span><span class="lz-nsub">So a 400MB npm cache costs zero image bytes — but also means anything the step writes <em>there</em> is gone afterwards. See the pitfall.</span></div></div>
</div>

<h3>The right target for each ecosystem</h3>
${slide('dk-05', 15, 'Thư mục đích đúng cho từng trình quản lý gói')}
<pre><code># syntax=docker/dockerfile:1
<span class="tok-comment"># npm — the download cache, not node_modules</span>
RUN --mount=type=cache,target=/root/.npm npm ci

<span class="tok-comment"># pnpm — the content-addressed store</span>
RUN --mount=type=cache,target=/pnpm/store pnpm install --frozen-lockfile

<span class="tok-comment"># yarn (berry)</span>
RUN --mount=type=cache,target=/root/.yarn/berry/cache yarn install --immutable

<span class="tok-comment"># pip</span>
RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt

<span class="tok-comment"># Go — modules AND the compiler cache; the second one matters most</span>
RUN --mount=type=cache,target=/go/pkg/mod \\
    --mount=type=cache,target=/root/.cache/go-build \\
    go build -o /out/server ./cmd/server

<span class="tok-comment"># Cargo</span>
RUN --mount=type=cache,target=/usr/local/cargo/registry \\
    --mount=type=cache,target=/app/target \\
    cargo build --release

<span class="tok-comment"># Maven / Gradle</span>
RUN --mount=type=cache,target=/root/.m2 mvn -B package -DskipTests
RUN --mount=type=cache,target=/root/.gradle ./gradlew build --no-daemon</code></pre>
<div class="callout warn"><strong>Cache the download directory, never <code>node_modules</code> itself.</strong> <code>--mount=type=cache,target=/app/node_modules</code> looks tempting and is wrong twice over: the directory is not in the image afterwards, so the final image has no dependencies at all; and concurrent builds would share a mutable tree that npm assumes it owns. Cache <code>~/.npm</code> — the tarball store — and let <code>npm ci</code> write a fresh <code>node_modules</code> into the layer as usual.</div>

<h3>apt needs one extra line</h3>
${slide('dk-05', 16, 'apt: gỡ docker-clean, khoá sharing=locked')}
<pre><code># syntax=docker/dockerfile:1
FROM debian:bookworm-slim
RUN rm -f /etc/apt/apt.conf.d/docker-clean \\
 &amp;&amp; echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' \\
      &gt; /etc/apt/apt.conf.d/keep-cache
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \\
    --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \\
    apt-get update &amp;&amp; apt-get install -y --no-install-recommends curl ca-certificates</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Why the first RUN is needed</span><span class="v">Debian-based images ship <code>/etc/apt/apt.conf.d/docker-clean</code>, which deletes downloaded <code>.deb</code> files immediately. With it in place your cache mount stays empty. Removing it and setting <code>Keep-Downloaded-Packages</code> is the documented dance.</span></div>
  <div class="kv"><span class="k">No rm -rf /var/lib/apt/lists</span><span class="v">Since the lists are on a cache mount and not in a layer, cleaning them up is both unnecessary and counterproductive — you would be deleting your own cache.</span></div>
  <div class="kv"><span class="k">sharing=locked</span><span class="v">apt is not safe to run twice against the same cache directory. <code>locked</code> makes a second concurrent build wait; the default <code>shared</code> would let them corrupt each other.</span></div>
  <div class="kv"><span class="k">Alpine is simpler</span><span class="v"><code>--mount=type=cache,target=/var/cache/apk apk add --no-cache …</code> works with no preparation, though the saving is smaller because apk packages are tiny.</span></div>
</div>

<h3>sharing and id</h3>
<pre><code><span class="tok-comment"># sharing=shared (default) — concurrent builds use it at the same time</span>
RUN --mount=type=cache,target=/root/.npm,sharing=shared npm ci

<span class="tok-comment"># sharing=locked — one at a time; the others wait</span>
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked apt-get update

<span class="tok-comment"># sharing=private — each concurrent build gets its own copy</span>
RUN --mount=type=cache,target=/tmp/work,sharing=private ./do-something

<span class="tok-comment"># id= — separate caches for separate purposes at the same path</span>
RUN --mount=type=cache,id=npm-api,target=/root/.npm npm ci
RUN --mount=type=cache,id=npm-web,target=/root/.npm npm ci

<span class="tok-comment"># uid/gid — when the step runs as a non-root user</span>
USER node
RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000 npm ci</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">shared</span><span class="v">The default and right for package managers designed for a shared read-mostly store: npm, pip, Go modules, Cargo registry.</span></div>
  <div class="kv"><span class="k">locked</span><span class="v">For anything that takes a lock or writes a database: apt, dnf, and some Gradle configurations. The cost is serialisation; the alternative is corruption.</span></div>
  <div class="kv"><span class="k">private</span><span class="v">When two builds must not see each other's files at all. Rare, and usually a sign the directory should not be a cache.</span></div>
  <div class="kv"><span class="k">id defaults to the target path</span><span class="v">So two different projects building on the same machine share <code>/root/.npm</code> — usually fine and occasionally not. Give them explicit ids when isolation matters.</span></div>
  <div class="kv"><span class="k">uid/gid for non-root steps</span><span class="v">The mount is created owned by root by default, so a <code>USER node</code> step gets permission denied. This is the most common reason a cache mount "does nothing".</span></div>
</div>

<h3>Run it step by step: the two silent failures, reproduced</h3>
${slide('dk-05', 17, 'Hai cú hỏng im lặng: dist/ biến mất và Permission denied')}
<p>Both failures in this lesson's pitfall and in the <code>uid/gid</code> row above are easy to believe and easy to forget. Reproducing them once makes them stick. First, build output written into a cache mount:</p>
<pre><code class="language-dockerfile"># syntax=docker/dockerfile:1
FROM alpine:3.20
WORKDIR /app
RUN --mount=type=cache,target=/app/dist sh -c 'echo built &gt; /app/dist/index.js &amp;&amp; ls /app/dist'
RUN ls -la /app/dist || echo "=&gt; /app/dist KHÔNG có trong tầng"</code></pre>
<div class="out">#8 [stage-0 3/4] RUN --mount=type=cache,target=/app/dist sh -c 'echo built &gt; /app/dist/index.js &amp;&amp; ls /app/dist'
#8 0.039 index.js
#9 [stage-0 4/4] RUN ls -la /app/dist || echo "=&gt; /app/dist KHÔNG có trong tầng"
#9 0.038 ls: /app/dist: No such file or directory
#9 0.038 =&gt; /app/dist KHÔNG có trong tầng</div>
<p>Inside step 3 the file exists (<code>index.js</code> is listed). One step later the directory does not exist at all. The build is green; the image is broken. Second, a non-root step with a mount owned by root:</p>
<pre><code class="language-dockerfile"># syntax=docker/dockerfile:1
FROM node:22-alpine
USER node
WORKDIR /home/node/app
RUN --mount=type=cache,target=/home/node/.npm sh -c 'touch /home/node/.npm/x &amp;&amp; echo ok'</code></pre>
<div class="out">#8 0.045 touch: /home/node/.npm/x: Permission denied
ERROR: failed to build: failed to solve: process "/bin/sh -c sh -c 'touch /home/node/.npm/x &amp;&amp; echo ok'" did not complete successfully: exit code: 1</div>
<p>Change the mount to <code>--mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000</code> and the same step prints <code>ok</code>. (With a real <code>npm ci</code> as <code>USER node</code> the same mistake prints <code>npm error code EACCES</code> … <code>Your cache folder contains root-owned files, due to a bug in previous versions of npm</code> and suggests <code>sudo chown</code> — npm blames an old npm bug, which sends people chasing the wrong fix. The cause is the mount's owner; <code>uid=1000,gid=1000</code> is the fix.) Both outputs are real, from the course Mac.</p>

<h3>Managing the cache itself</h3>
${slide('dk-05', 18, 'Cache mount phình mãi: xem bằng buildx du')}
<pre><code>docker buildx du --filter type=exec.cachemount                <span class="tok-comment"># list only cache mounts</span>
docker buildx du --verbose --filter type=exec.cachemount | grep -E 'Description|Size'
docker builder prune --filter type=exec.cachemount -f         <span class="tok-comment"># ⚠ ALL projects' mounts on this builder</span>
docker builder prune -f --reserved-space 5GB                   <span class="tok-comment"># was --keep-storage (deprecated)</span></code></pre>
<div class="out">ID                           RECLAIMABLE   SIZE      LAST ACCESSED
wqn0dcd5booh54o9rmt5ssf7n*   true          165.5MB   3 hours ago
…
Size:         165.5MB
Description:  cached mount /root/.npm from exec /bin/sh -c npm ci --omit=dev --ignore-scripts with id "//root/.npm"</div>
<p>Real output of the first two lines on the course's own builder (<code>--builder dk05-builder</code> added). Two corrections to an earlier version of this lesson: BuildKit describes the entry as <code>cached mount …</code>, so the old <code>grep 'cache mount'</code> matched nothing — filter by <code>type=exec.cachemount</code> instead; and <code>--keep-storage</code> now prints <code>Flag --keep-storage has been deprecated, keep-storage flag has been changed to reserved-space</code>. The two <code>prune</code> lines were deliberately <strong>not</strong> run on the course Mac: on a machine that builds several projects they delete everyone's cache. To experiment safely, create your own builder, fill it, and remove the whole builder with <code>docker buildx rm</code> when you are done.</p>
<div class="callout ok"><strong>Cache mounts grow forever unless you bound them.</strong> They are not part of any image, so <code>docker image prune</code> never touches them, and a machine that builds several projects can quietly accumulate several gigabytes of npm and Go caches. Either prune periodically (Lesson 3.5's timer is the right place) or set a ceiling in <code>/etc/docker/daemon.json</code> with BuildKit's garbage-collection policy, so the builder keeps the cache under a size you chose.</div>
<pre><code>cd ..; rm -rf cm; docker rmi cm:p cm:c &gt;/dev/null 2&gt;&amp;1</code></pre>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your team adds a library almost every day during SWP391 sprints, and each time the Docker build downloads everything again. Measure what a cache mount saves — on a builder of your own, so you never have to prune a shared cache.</p><ol>
<li>Create a private builder: <code>docker buildx create --name thu-cache --driver docker-container</code>.</li>
<li>In <code>~/thu-docker/mount53</code>, write <code>Dockerfile.plain</code> and <code>Dockerfile.cached</code> from "The measurement" (use your project's <code>package.json</code> + lockfile if you have one).</li>
<li>Build each once, add a library with <code>npm install --package-lock-only is-odd@3</code>, then time both again with the command below.</li>
<li>Look at the mount: <code>docker buildx du --builder thu-cache --filter type=exec.cachemount</code>.</li>
<li>Remove the whole builder and its cache: <code>docker buildx rm thu-cache</code>.</li></ol>
<pre><code class="language-bash">time docker buildx build --builder thu-cache --output type=cacheonly -q -f Dockerfile.cached .</code></pre>
<p><strong>Done when:</strong> after adding the library, the cached version is several times faster than the plain one, <code>buildx du</code> shows one <code>exec.cachemount</code> entry of tens or hundreds of MB, and <code>docker buildx ls</code> no longer lists <code>thu-cache</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cache mount</span><span class="v">A directory kept between builds and mounted into one <code>RUN</code> step; its contents never become part of the image.</span></div>
  <div class="kv"><span class="k">Download cache</span><span class="v">Where a package manager keeps what it downloaded (<code>~/.npm</code>, <code>~/.cache/pip</code>, <code>/go/pkg/mod</code>). The right thing to mount.</span></div>
  <div class="kv"><span class="k">Builder</span><span class="v">One BuildKit instance with its own cache. <code>docker buildx create</code> makes a new one; <code>docker buildx rm</code> deletes it with everything it cached.</span></div>
  <div class="kv"><span class="k">sharing (shared / locked / private)</span><span class="v">What happens when two builds use the same mount at once: share it, take turns, or each get a copy.</span></div>
  <div class="kv"><span class="k">uid / gid</span><span class="v">The numeric owner of the mount. Must match the <code>USER</code> of the step (1000 for <code>node</code>) or writes fail.</span></div>
  <div class="kv"><span class="k">Garbage collection (GC)</span><span class="v">BuildKit's automatic clean-up of old cache when it passes a size limit you configure.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Ordering makes misses rare; a cache mount makes a miss cheap — on the real backend, adding a library went from 63 s to 9 s.</li>
<li>Mount the tool's download cache, never <code>node_modules</code> or build output: nothing in a mount reaches the image.</li>
<li>The first build with a new mount is slower — it fills the cache once.</li>
<li>apt needs <code>docker-clean</code> removed and <code>sharing=locked</code>; a <code>USER node</code> step needs <code>uid=1000,gid=1000</code>.</li>
<li>Find mounts with <code>docker buildx du --filter type=exec.cachemount</code>; prune only on a builder that is yours.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/dockerfile/#run---mounttypecache" target="_blank" rel="noopener">
  <span class="lc-ico">💾</span>
  <span class="lc-body"><span class="lc-title">RUN --mount=type=cache</span><span class="lc-sub">Every option — <code>id</code>, <code>sharing</code>, <code>uid</code>, <code>gid</code>, <code>mode</code>, <code>from</code> — with the exact semantics. Short page, worth reading in full before you scatter cache mounts through a Dockerfile.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/cache/optimize/#use-cache-mounts" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Using cache mounts</span><span class="lc-sub">Docker's guide with the correct target directory for each major package manager, including the apt <code>keep-cache</code> configuration this lesson uses.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/cache/garbage-collection/" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">BuildKit garbage collection</span><span class="lc-sub">Setting size ceilings and retention policies in <code>daemon.json</code> so cache mounts cannot fill a disk. Better than remembering to prune.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: mount the cache</span><span class="lc-sub">Graded exercises: add a cache mount and measure the difference, fix an apt cache mount that stays empty, repair a mount that fails with permission denied under <code>USER node</code>, and find the cache mounts eating disk.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> writing build output into a cache mount. <code>RUN --mount=type=cache,target=/app/dist npm run build</code> succeeds, and <code>/app/dist</code> is <strong>empty in the resulting image</strong> — the mount is unmounted when the step ends and nothing it contains becomes a layer. The container then starts and immediately exits with <code>Cannot find module '/app/dist/index.js'</code>, with a completely green build behind it. Cache mounts are for <em>inputs</em> you would otherwise re-download: package caches, compiler caches, module stores. Anything the final image must contain has to be written to a normal path — or copied out of the mount in the same <code>RUN</code>.</div>
<p class="note-ct"><strong>Three things to remember.</strong> A cache mount makes a cache <em>miss</em> cheap, while layer ordering makes misses rare — they solve different halves of the problem and you want both. Cache the package manager's download directory (<code>~/.npm</code>, <code>~/.cache/pip</code>, <code>/go/pkg/mod</code>), never the installed tree itself. And nothing in a cache mount ends up in the image, so build output written there vanishes and the container fails at start with a green build behind it.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Cache mount: giữ lại phần đã tải giữa các lượt dựng</h2>
<p class="lead">Thứ tự bảo vệ một tầng đã lưu đệm khỏi bị vô hiệu hoá. Nhưng khi nó <em>BỊ</em> vô hiệu hoá — bạn vừa thêm một thư viện — thì <code>npm ci</code> bắt đầu từ con số không và tải lại cả chín trăm gói. Một cache mount chữa đúng chuyện đó: một thư mục sống sót xuyên các lượt dựng, nằm NGOÀI mọi tầng, và làm cho cú trượt cache trở nên rẻ.</p>

<h3>Phép đo</h3>
<pre><code>mkdir -p cm &amp;&amp; cd cm
printf 'node_modules\\n.git\\n' &gt; .dockerignore
cat &gt; package.json &lt;&lt;'EOF'
{ "name": "cm", "version": "1.0.0",
  "dependencies": { "express": "^4.21.1", "pg": "^8.13.1", "zod": "^3.23.8",
                    "pino": "^9.5.0", "dayjs": "^1.11.13" } }
EOF
npm install --package-lock-only --silent

cat &gt; Dockerfile.plain &lt;&lt;'EOF'
# syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
EOF

cat &gt; Dockerfile.cached &lt;&lt;'EOF'
# syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev
EOF

docker build -qf Dockerfile.plain  -t cm:p . &gt;/dev/null   <span class="tok-comment"># làm ấm phía registry</span>
docker build -qf Dockerfile.cached -t cm:c . &gt;/dev/null   <span class="tok-comment"># làm ấm cái mount</span>
npm install --package-lock-only --silent --save cors &gt;/dev/null 2&gt;&amp;1

echo '--- không cache mount, vừa thêm một thư viện ---'
time docker build -qf Dockerfile.plain  -t cm:p . &gt;/dev/null
echo '--- có cache mount, cùng một thay đổi ---'
time docker build -qf Dockerfile.cached -t cm:c . &gt;/dev/null</code></pre>
<div class="out">--- không cache mount, vừa thêm một thư viện ---
real	0m6.219s
--- có cache mount, cùng một thay đổi ---
real	0m1.884s</div>
<p>Nhanh gấp ba, trên năm thư viện. Trên một dự án thật với vài trăm gói thì tỷ lệ tương tự còn khoản tiết kiệm tuyệt đối là một hai phút mỗi lượt dựng — và nó áp dụng ĐÚNG vào những lượt dựng mà cache theo tầng không giúp được gì cho bạn.</p>

<h3>Đo trên backend thật: thêm MỘT thư viện, 63 giây so với 9 giây</h3>
${slide('dk-05', 14, 'Thêm một thư viện: 63 s so với 9 s')}
<p>Phép đo ở trên dùng năm thư viện. Làm lại trên máy Mac của khoá với lockfile 898 gói thật của Bài 5.2, trên một builder RIÊNG (<code>docker buildx create --name dk05-builder --driver docker-container</code>) để không có cache npm của dự án nào khác giúp sức:</p>
<table>
<tr><th>Lượt dựng</th><th>Không cache mount</th><th>Có <code>--mount=type=cache,target=/root/.npm</code></th></tr>
<tr><td>Lần đầu, builder rỗng</td><td>81,4 s</td><td>103,6 s</td></tr>
<tr><td>Sau khi thêm <code>is-odd</code></td><td>63,4 s</td><td><strong>9,3 s</strong></td></tr>
<tr><td>Sau khi thêm tiếp <code>is-even</code></td><td>56,9 s</td><td><strong>10,3 s</strong></td></tr>
</table>
<p>Đọc ra hai điều. Lượt nguội có mount lại <em>CHẬM hơn</em> — lần đầu phải trả công đổ đầy một bộ đệm npm 165,5 MB chưa ai dùng; cái giá đó chỉ trả một lần. Và mọi lần đổi thư viện sau đó rẻ hơn sáu lần, vì <code>npm ci</code> VẪN chạy — vẫn xoá rồi dựng lại <code>node_modules</code> — nhưng chép 898 gói tar từ một thư mục cục bộ thay vì tải về. Đó đúng là trường hợp mà thứ tự không cứu được: khi <code>package.json</code> đổi THẬT.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">--mount</span><span class="v">Tuỳ chọn của RIÊNG một dòng <code>RUN</code>. Nó tồn tại trong lúc lệnh đó chạy và biến mất sau đó — lệnh <code>RUN</code> kế tiếp không thấy nó trừ khi cũng tự gắn lại.</span></div>
  <div class="kv"><span class="k">type=cache</span><span class="v">Một thư mục BuildKit giữ lại giữa các lượt dựng (các loại khác: <code>bind</code> đọc từ ngữ cảnh, <code>secret</code> đưa vào một file bí mật, <code>ssh</code> một SSH agent — Chương 6).</span></div>
  <div class="kv"><span class="k">target=/root/.npm</span><span class="v">Thư mục đó hiện ra ở đâu bên trong bước. Nó PHẢI là thư mục công cụ vốn ĐÃ dùng làm bộ đệm tải về — npm chạy bằng root dùng <code>/root/.npm</code>. Sai đường dẫn = một cái mount không ai ghi vào.</span></div>
  <div class="kv"><span class="k">Cần cú pháp BuildKit</span><span class="v">Chạy với builder mặc định của mọi bản Docker hiện hành. Dòng đầu <code># syntax=docker/dockerfile:1</code> bảo đảm có tính năng Dockerfile mới nhất dù engine nào đang dựng.</span></div>
</div>

<h3>Nó khác một cái tầng ở chỗ nào</h3>
${slide('dk-05', 13, 'Tầng cache: được ăn cả ngã về không — cache mount: MISS vẫn rẻ')}
<div class="lz-map">
  <div class="lz-stage">Một tầng đã lưu đệm</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bỏ qua bước đó HOÀN TOÀN</span><span class="lz-nsub">Không có gì chạy. Được ăn cả ngã về không: bất kỳ đầu vào nào đổi là bạn trả lại trọn cái giá.</span></div></div>
  <div class="lz-stage">Một cache mount</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bước đó VẪN CHẠY, với phần tải về đã có sẵn</span><span class="lz-nsub">Tăng dần. <code>npm ci</code> vẫn thực thi, vẫn giải quyết và liên kết — nhưng chỉ TẢI những gì thật sự mới. Đây là thứ khiến một cú TRƯỢT cache trở nên rẻ.</span></div></div>
  <div class="lz-stage">Chúng ghép với nhau</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Cache tầng cho trường hợp thường, mount cho cú trượt</span><span class="lz-nsub">Thứ tự đúng (Bài 5.2) nghĩa là bước đó thường KHÔNG chạy; cache mount nghĩa là khi nó có chạy thì nhanh. Hãy dùng cả hai.</span></div></div>
  <div class="lz-stage">Không gì rơi vào ảnh</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Thư mục được gắn KHÔNG thuộc tầng nào</span><span class="lz-nsub">Nên một bộ đệm npm 400MB tốn KHÔNG byte ảnh nào — nhưng cũng nghĩa là bất cứ thứ gì bước đó ghi VÀO ĐÓ đều biến mất sau đấy. Xem phần bẫy.</span></div></div>
</div>

<h3>Mục tiêu đúng cho từng hệ sinh thái</h3>
${slide('dk-05', 15, 'Thư mục đích đúng cho từng trình quản lý gói')}
<pre><code># syntax=docker/dockerfile:1
<span class="tok-comment"># npm — bộ đệm TẢI VỀ, không phải node_modules</span>
RUN --mount=type=cache,target=/root/.npm npm ci

<span class="tok-comment"># pnpm — kho lưu theo nội dung</span>
RUN --mount=type=cache,target=/pnpm/store pnpm install --frozen-lockfile

<span class="tok-comment"># yarn (berry)</span>
RUN --mount=type=cache,target=/root/.yarn/berry/cache yarn install --immutable

<span class="tok-comment"># pip</span>
RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt

<span class="tok-comment"># Go — mô-đun VÀ bộ đệm trình biên dịch; cái thứ hai mới quan trọng nhất</span>
RUN --mount=type=cache,target=/go/pkg/mod \\
    --mount=type=cache,target=/root/.cache/go-build \\
    go build -o /out/server ./cmd/server

<span class="tok-comment"># Cargo</span>
RUN --mount=type=cache,target=/usr/local/cargo/registry \\
    --mount=type=cache,target=/app/target \\
    cargo build --release

<span class="tok-comment"># Maven / Gradle</span>
RUN --mount=type=cache,target=/root/.m2 mvn -B package -DskipTests
RUN --mount=type=cache,target=/root/.gradle ./gradlew build --no-daemon</code></pre>
<div class="callout warn"><strong>Hãy lưu đệm thư mục TẢI VỀ, đừng bao giờ lưu đệm chính <code>node_modules</code>.</strong> <code>--mount=type=cache,target=/app/node_modules</code> nhìn thì hấp dẫn và sai theo HAI cách: thư mục đó không có mặt trong ảnh sau đó, nên ảnh cuối hoàn toàn KHÔNG có thư viện nào; và các lượt dựng song song sẽ dùng chung một cây thay đổi được mà npm thì cho rằng nó sở hữu riêng. Hãy lưu đệm <code>~/.npm</code> — kho chứa các gói tar — và để <code>npm ci</code> ghi ra một <code>node_modules</code> mới vào tầng như bình thường.</div>

<h3>apt cần thêm một dòng</h3>
${slide('dk-05', 16, 'apt: gỡ docker-clean, khoá sharing=locked')}
<pre><code># syntax=docker/dockerfile:1
FROM debian:bookworm-slim
RUN rm -f /etc/apt/apt.conf.d/docker-clean \\
 &amp;&amp; echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' \\
      &gt; /etc/apt/apt.conf.d/keep-cache
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \\
    --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \\
    apt-get update &amp;&amp; apt-get install -y --no-install-recommends curl ca-certificates</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Vì sao cần lệnh RUN đầu tiên</span><span class="v">Ảnh nền Debian có sẵn <code>/etc/apt/apt.conf.d/docker-clean</code>, thứ này XOÁ NGAY các file <code>.deb</code> vừa tải. Nó còn nằm đó thì cache mount của bạn cứ rỗng. Gỡ nó đi và đặt <code>Keep-Downloaded-Packages</code> là điệu nhảy có ghi trong tài liệu.</span></div>
  <div class="kv"><span class="k">ĐỪNG rm -rf /var/lib/apt/lists</span><span class="v">Vì mấy cái danh mục đó nằm trên một cache mount chứ không nằm trong tầng, dọn chúng vừa không cần thiết vừa phản tác dụng — bạn đang xoá chính cái cache của mình.</span></div>
  <div class="kv"><span class="k">sharing=locked</span><span class="v">apt không an toàn khi chạy hai lượt lên cùng một thư mục cache. <code>locked</code> khiến lượt dựng song song thứ hai phải CHỜ; giá trị mặc định <code>shared</code> sẽ để chúng phá lẫn nhau.</span></div>
  <div class="kv"><span class="k">Alpine thì đơn giản hơn</span><span class="v"><code>--mount=type=cache,target=/var/cache/apk apk add --no-cache …</code> chạy được mà không cần chuẩn bị gì, dù khoản tiết kiệm nhỏ hơn vì gói của apk vốn tí hon.</span></div>
</div>

<h3>sharing và id</h3>
<pre><code><span class="tok-comment"># sharing=shared (mặc định) — các lượt dựng song song dùng nó cùng lúc</span>
RUN --mount=type=cache,target=/root/.npm,sharing=shared npm ci

<span class="tok-comment"># sharing=locked — mỗi lúc một cái; những cái khác chờ</span>
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked apt-get update

<span class="tok-comment"># sharing=private — mỗi lượt dựng song song có bản riêng</span>
RUN --mount=type=cache,target=/tmp/work,sharing=private ./do-something

<span class="tok-comment"># id= — tách cache cho các mục đích khác nhau ở cùng một đường dẫn</span>
RUN --mount=type=cache,id=npm-api,target=/root/.npm npm ci
RUN --mount=type=cache,id=npm-web,target=/root/.npm npm ci

<span class="tok-comment"># uid/gid — khi bước đó chạy dưới một người dùng không phải root</span>
USER node
RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000 npm ci</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">shared</span><span class="v">Mặc định và đúng cho những trình quản lý gói vốn thiết kế cho một kho dùng chung chủ yếu để đọc: npm, pip, mô-đun Go, registry của Cargo.</span></div>
  <div class="kv"><span class="k">locked</span><span class="v">Cho mọi thứ có lấy khoá hoặc ghi vào một cơ sở dữ liệu: apt, dnf, và vài cấu hình Gradle. Cái giá là phải chạy tuần tự; lựa chọn còn lại là hỏng dữ liệu.</span></div>
  <div class="kv"><span class="k">private</span><span class="v">Khi hai lượt dựng hoàn toàn không được thấy file của nhau. Hiếm, và thường là dấu hiệu rằng thư mục đó không nên là một cache.</span></div>
  <div class="kv"><span class="k">id mặc định là đường dẫn đích</span><span class="v">Nên hai dự án khác nhau dựng trên cùng một máy sẽ dùng chung <code>/root/.npm</code> — thường thì ổn và thi thoảng thì không. Hãy cho chúng id tường minh khi sự cô lập có ý nghĩa.</span></div>
  <div class="kv"><span class="k">uid/gid cho bước không phải root</span><span class="v">Điểm gắn được tạo ra thuộc sở hữu root theo mặc định, nên một bước có <code>USER node</code> sẽ nhận permission denied. Đây là lý do phổ biến nhất khiến một cache mount "chẳng làm gì cả".</span></div>
</div>

<h3>Chạy thử từng bước: tái hiện hai cú hỏng im lặng</h3>
${slide('dk-05', 17, 'Hai cú hỏng im lặng: dist/ biến mất và Permission denied')}
<p>Cả hai cú hỏng — trong phần bẫy của bài và ở dòng <code>uid/gid</code> phía trên — dễ tin và dễ quên. Tự tái hiện một lần là nhớ luôn. Thứ nhất, ghi kết quả dựng vào một cache mount:</p>
<pre><code class="language-dockerfile"># syntax=docker/dockerfile:1
FROM alpine:3.20
WORKDIR /app
RUN --mount=type=cache,target=/app/dist sh -c 'echo built &gt; /app/dist/index.js &amp;&amp; ls /app/dist'
RUN ls -la /app/dist || echo "=&gt; /app/dist KHÔNG có trong tầng"</code></pre>
<div class="out">#8 [stage-0 3/4] RUN --mount=type=cache,target=/app/dist sh -c 'echo built &gt; /app/dist/index.js &amp;&amp; ls /app/dist'
#8 0.039 index.js
#9 [stage-0 4/4] RUN ls -la /app/dist || echo "=&gt; /app/dist KHÔNG có trong tầng"
#9 0.038 ls: /app/dist: No such file or directory
#9 0.038 =&gt; /app/dist KHÔNG có trong tầng</div>
<p>Bên trong bước 3, file có thật (<code>index.js</code> được liệt kê). Sang bước sau, thư mục đó không hề tồn tại. Lượt dựng xanh; cái ảnh thì hỏng. Thứ hai, một bước không phải root với mount thuộc root:</p>
<pre><code class="language-dockerfile"># syntax=docker/dockerfile:1
FROM node:22-alpine
USER node
WORKDIR /home/node/app
RUN --mount=type=cache,target=/home/node/.npm sh -c 'touch /home/node/.npm/x &amp;&amp; echo ok'</code></pre>
<div class="out">#8 0.045 touch: /home/node/.npm/x: Permission denied
ERROR: failed to build: failed to solve: process "/bin/sh -c sh -c 'touch /home/node/.npm/x &amp;&amp; echo ok'" did not complete successfully: exit code: 1</div>
<p>Đổi mount thành <code>--mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000</code> là cùng bước đó in <code>ok</code>. (Với <code>npm ci</code> thật chạy bằng <code>USER node</code>, cùng lỗi đó in <code>npm error code EACCES</code> … <code>Your cache folder contains root-owned files, due to a bug in previous versions of npm</code> và bảo bạn <code>sudo chown</code> — npm đổ cho một con bọ npm cũ, làm người ta đi sửa sai chỗ. Nguyên nhân là CHỦ của cái mount; cách chữa là <code>uid=1000,gid=1000</code>.) Cả hai output là thật, từ máy Mac của khoá.</p>

<h3>Quản lý chính cái cache đó</h3>
${slide('dk-05', 18, 'Cache mount phình mãi: xem bằng buildx du')}
<pre><code>docker buildx du --filter type=exec.cachemount                <span class="tok-comment"># chỉ liệt kê cache mount</span>
docker buildx du --verbose --filter type=exec.cachemount | grep -E 'Description|Size'
docker builder prune --filter type=exec.cachemount -f         <span class="tok-comment"># ⚠ mount của MỌI dự án trên builder này</span>
docker builder prune -f --reserved-space 5GB                   <span class="tok-comment"># tên cũ --keep-storage (đã bỏ)</span></code></pre>
<div class="out">ID                           RECLAIMABLE   SIZE      LAST ACCESSED
wqn0dcd5booh54o9rmt5ssf7n*   true          165.5MB   3 hours ago
…
Size:         165.5MB
Description:  cached mount /root/.npm from exec /bin/sh -c npm ci --omit=dev --ignore-scripts with id "//root/.npm"</div>
<p>Output thật của hai dòng đầu trên builder riêng của khoá (thêm <code>--builder dk05-builder</code>). Hai chỗ sửa so với bản cũ của bài: BuildKit mô tả mục đó là <code>cached mount …</code>, nên lệnh cũ <code>grep 'cache mount'</code> không khớp dòng nào — hãy lọc bằng <code>type=exec.cachemount</code>; và <code>--keep-storage</code> giờ in <code>Flag --keep-storage has been deprecated, keep-storage flag has been changed to reserved-space</code>. Hai dòng <code>prune</code> được cố ý KHÔNG chạy trên máy Mac của khoá: trên một máy dựng nhiều dự án, chúng xoá cache của tất cả mọi người. Muốn thử cho an toàn: tạo builder riêng, đổ đầy nó, rồi xoá nguyên builder bằng <code>docker buildx rm</code> khi xong.</p>
<div class="callout ok"><strong>Cache mount phình lên MÃI MÃI nếu bạn không chặn trần cho chúng.</strong> Chúng không thuộc bất kỳ ảnh nào, nên <code>docker image prune</code> chẳng bao giờ đụng tới, và một cái máy dựng nhiều dự án có thể lặng lẽ tích lại vài gigabyte cache npm với Go. Hoặc là tỉa định kỳ (cái timer ở Bài 3.5 là chỗ đúng cho việc đó), hoặc đặt một cái trần trong <code>/etc/docker/daemon.json</code> bằng chính sách thu gom rác của BuildKit, để bộ dựng giữ cache dưới một mức bạn chọn.</div>
<pre><code>cd ..; rm -rf cm; docker rmi cm:p cm:c &gt;/dev/null 2&gt;&amp;1</code></pre>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> trong các sprint SWP391, gần như ngày nào nhóm bạn cũng thêm một thư viện, và lần nào Docker cũng tải lại tất cả. Hãy ĐO xem cache mount tiết kiệm được bao nhiêu — trên builder của riêng bạn, để không bao giờ phải tỉa cache dùng chung.</p><ol>
<li>Tạo builder riêng: <code>docker buildx create --name thu-cache --driver docker-container</code>.</li>
<li>Trong <code>~/thu-docker/mount53</code>, viết <code>Dockerfile.plain</code> và <code>Dockerfile.cached</code> theo mục "Phép đo" (dùng <code>package.json</code> + lockfile của dự án bạn nếu có).</li>
<li>Dựng mỗi file một lần, thêm một thư viện bằng <code>npm install --package-lock-only is-odd@3</code>, rồi bấm giờ lại cả hai bằng lệnh bên dưới.</li>
<li>Nhìn cái mount: <code>docker buildx du --builder thu-cache --filter type=exec.cachemount</code>.</li>
<li>Xoá nguyên builder cùng cache của nó: <code>docker buildx rm thu-cache</code>.</li></ol>
<pre><code class="language-bash">time docker buildx build --builder thu-cache --output type=cacheonly -q -f Dockerfile.cached .</code></pre>
<p><strong>Đạt khi:</strong> sau khi thêm thư viện, bản có mount nhanh hơn bản thường vài lần, <code>buildx du</code> hiện một mục <code>exec.cachemount</code> cỡ chục tới trăm MB, và <code>docker buildx ls</code> không còn <code>thu-cache</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cache mount (thư mục đệm gắn vào)</span><span class="v">Một thư mục được giữ giữa các lượt dựng và gắn vào một bước <code>RUN</code>; thứ bên trong không bao giờ thành một phần của ảnh.</span></div>
  <div class="kv"><span class="k">Download cache (bộ đệm tải về)</span><span class="v">Chỗ trình quản lý gói cất thứ nó đã tải (<code>~/.npm</code>, <code>~/.cache/pip</code>, <code>/go/pkg/mod</code>). Đúng thứ nên gắn.</span></div>
  <div class="kv"><span class="k">Builder (bộ dựng)</span><span class="v">Một phiên bản BuildKit có cache riêng. <code>docker buildx create</code> tạo cái mới; <code>docker buildx rm</code> xoá nó cùng mọi thứ nó đã lưu.</span></div>
  <div class="kv"><span class="k">sharing (dùng chung / khoá / riêng)</span><span class="v">Chuyện gì xảy ra khi hai lượt dựng dùng cùng một mount cùng lúc: dùng chung, lần lượt, hay mỗi lượt một bản.</span></div>
  <div class="kv"><span class="k">uid / gid (mã người dùng / nhóm)</span><span class="v">Chủ sở hữu dạng số của mount. Phải khớp <code>USER</code> của bước (1000 với <code>node</code>) không thì ghi hỏng.</span></div>
  <div class="kv"><span class="k">Garbage collection — GC (thu gom rác)</span><span class="v">BuildKit tự dọn cache cũ khi vượt một ngưỡng dung lượng bạn cấu hình.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Thứ tự làm cú trượt hiếm; cache mount làm cú trượt rẻ — trên backend thật, thêm một thư viện từ 63 s còn 9 s.</li>
<li>Gắn bộ đệm tải về của công cụ, đừng bao giờ gắn <code>node_modules</code> hay kết quả dựng: không gì trong mount tới được ảnh.</li>
<li>Lượt dựng đầu với một mount mới thì chậm hơn — nó đổ đầy cache một lần.</li>
<li>apt cần gỡ <code>docker-clean</code> và dùng <code>sharing=locked</code>; bước chạy bằng <code>USER node</code> cần <code>uid=1000,gid=1000</code>.</li>
<li>Tìm mount bằng <code>docker buildx du --filter type=exec.cachemount</code>; chỉ tỉa trên builder của riêng mình.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/dockerfile/#run---mounttypecache" target="_blank" rel="noopener">
  <span class="lc-ico">💾</span>
  <span class="lc-body"><span class="lc-title">RUN --mount=type=cache</span><span class="lc-sub">Mọi tuỳ chọn — <code>id</code>, <code>sharing</code>, <code>uid</code>, <code>gid</code>, <code>mode</code>, <code>from</code> — kèm ngữ nghĩa chính xác. Trang ngắn, đáng đọc trọn vẹn trước khi bạn rải cache mount khắp một Dockerfile.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/cache/optimize/#use-cache-mounts" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Dùng cache mount</span><span class="lc-sub">Hướng dẫn của Docker kèm thư mục đích ĐÚNG cho từng trình quản lý gói lớn, gồm cả phần cấu hình <code>keep-cache</code> của apt mà bài này dùng.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/cache/garbage-collection/" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">Thu gom rác của BuildKit</span><span class="lc-sub">Đặt trần dung lượng và chính sách giữ lại trong <code>daemon.json</code> để cache mount không thể làm đầy một cái đĩa. Tốt hơn việc nhớ đi tỉa.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: gắn cái cache vào</span><span class="lc-sub">Bài chấm điểm: thêm một cache mount rồi đo khác biệt, sửa một cache mount apt cứ rỗng mãi, chữa một mount hỏng với permission denied dưới <code>USER node</code>, và tìm ra những cache mount đang ăn đĩa.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> ghi KẾT QUẢ DỰNG vào một cache mount. <code>RUN --mount=type=cache,target=/app/dist npm run build</code> thành công, và <code>/app/dist</code> <strong>RỖNG trong cái ảnh kết quả</strong> — điểm gắn bị gỡ khi bước đó kết thúc và không gì nằm trong nó trở thành một tầng. Container sau đó khởi động rồi thoát ngay với <code>Cannot find module '/app/dist/index.js'</code>, với một lượt dựng xanh mướt phía sau. Cache mount là dành cho <em>ĐẦU VÀO</em> mà nếu không thì bạn phải tải lại: bộ đệm gói, bộ đệm trình biên dịch, kho mô-đun. Bất cứ thứ gì ảnh cuối PHẢI chứa thì đều phải được ghi vào một đường dẫn bình thường — hoặc chép ra khỏi cái mount trong CÙNG lệnh <code>RUN</code>.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Cache mount làm cho một cú TRƯỢT cache trở nên rẻ, còn thứ tự các tầng làm cho cú trượt trở nên HIẾM — chúng giải hai nửa khác nhau của bài toán và bạn muốn cả hai. Hãy lưu đệm thư mục TẢI VỀ của trình quản lý gói (<code>~/.npm</code>, <code>~/.cache/pip</code>, <code>/go/pkg/mod</code>), đừng bao giờ lưu đệm chính cái cây đã cài. Và KHÔNG gì trong một cache mount kết thúc trong cái ảnh, nên kết quả dựng ghi vào đó sẽ biến mất và container hỏng lúc khởi động với một lượt dựng xanh phía sau.</p>
</div>
`,
    },
    /* ─────────────────────────── 5.4 ─────────────────────────── */
    {
      title: '5.4 — Sharing the cache with CI|||5.4 — Chia sẻ cache với CI',
      slug: 'dk-5-4-cache-ci',
      type: 'LESSON',
      description: 'Máy chạy CI mới tinh thì cache luôn nguội. --cache-from và --cache-to, bốn kiểu backend, mode=min so với mode=max, một workflow GitHub Actions hoàn chỉnh, và cách kiểm xem cache có thật sự trúng không.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Sharing the cache with CI</h2>
<p class="lead">Everything in this chapter so far makes your <em>local</em> builds fast. CI runners are fresh machines with an empty cache, so none of it helps there — and CI is where build time costs the most, because it is on the path between a commit and a deploy. The fix is to store the cache somewhere both runs can reach.</p>

<h3>The two flags</h3>
${slide('dk-05', 19, 'Máy CI mới tinh có cache rỗng — cất cache ra ngoài máy')}
<pre><code>docker buildx build \\
  --cache-from type=registry,ref=ghcr.io/me/app:buildcache \\
  --cache-to   type=registry,ref=ghcr.io/me/app:buildcache,mode=max \\
  -t ghcr.io/me/app:1.4.2 --push .</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">--cache-from</span><span class="v">Where to look for previously built layers before running a step. Can be given several times; BuildKit tries each in order. Harmless if it does not exist — the build just starts cold.</span></div>
  <div class="kv"><span class="k">--cache-to</span><span class="v">Where to write the cache after the build. Needs write access to that location, and it costs some upload time — which is why it usually runs only on the main branch.</span></div>
  <div class="kv"><span class="k">mode=min (default)</span><span class="v">Exports only the layers in the final image. Small and fast, and useless for multi-stage builds, because the expensive build stage is not in the final image.</span></div>
  <div class="kv"><span class="k">mode=max</span><span class="v">Exports every layer of every stage. Bigger and slower to upload, and the only useful setting when you have a build stage worth caching — which is almost always.</span></div>
  <div class="kv"><span class="k">A separate tag, not your image tag</span><span class="v"><code>:buildcache</code> holds cache manifests, not a runnable image. Do not point it at <code>:latest</code> — anyone pulling that would get something that is not an image.</span></div>
</div>

<h3>The four backends</h3>
${slide('dk-05', 21, 'Bốn kho cache và builder mặc định của Docker 29')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">type=registry</span><span class="lz-lnote">Cache lives in a registry as a separate tag. Works everywhere, survives runner restarts, shared between every machine that can reach the registry — including your laptop. The default choice for most projects, and the only one that works across CI providers.</span></div>
  <div class="lz-layer"><span class="lz-lname">type=gha</span><span class="lz-lnote">GitHub Actions' own cache service. Fast, free within the workflow's quota, and automatically scoped per branch with fallback to the default branch. The right answer if you are on GitHub Actions and nothing else needs the cache.</span></div>
  <div class="lz-layer"><span class="lz-lname">type=local</span><span class="lz-lnote">A directory on disk. Right for self-hosted runners with persistent storage, and for combining with an <code>actions/cache</code> step. Needs manual management or it grows without limit.</span></div>
  <div class="lz-layer"><span class="lz-lname">type=inline</span><span class="lz-lnote">Cache metadata embedded in the image itself, so <code>--cache-from</code> against your normal tag works with no extra storage. Simple and limited: it is <code>mode=min</code> only, so it cannot cache a build stage. Fine for single-stage images.</span></div>
</div>
<pre><code><span class="tok-comment"># inline — the simplest possible version, no extra tag</span>
docker buildx build --cache-to type=inline \\
  --cache-from ghcr.io/me/app:latest -t ghcr.io/me/app:latest --push .

<span class="tok-comment"># local — for a self-hosted runner with a persistent disk</span>
docker buildx build \\
  --cache-from type=local,src=/var/cache/buildkit \\
  --cache-to   type=local,dest=/var/cache/buildkit,mode=max \\
  -t app:1.0 --load .</code></pre>

<h3>A complete GitHub Actions workflow</h3>
${slide('dk-05', 22, 'Workflow GitHub Actions, phiên bản action tính đến 09/2026')}
<pre><code>name: build
on:
  push: { branches: [main] }
  pull_request:

jobs:
  docker:
    runs-on: ubuntu-latest
    permissions: { contents: read, packages: write }
    steps:
      - uses: actions/checkout@v7

      - uses: docker/setup-buildx-action@v4

      - uses: docker/login-action@v4
        with:
          registry: ghcr.io
          username: &#36;{{ github.actor }}
          password: &#36;{{ secrets.GITHUB_TOKEN }}

      - uses: docker/metadata-action@v6
        id: meta
        with:
          images: ghcr.io/&#36;{{ github.repository }}
          tags: |
            type=sha,format=long
            type=ref,event=branch
            type=semver,pattern={{version}}

      - uses: docker/build-push-action@v7
        with:
          context: .
          push: &#36;{{ github.event_name != 'pull_request' }}
          tags: &#36;{{ steps.meta.outputs.tags }}
          labels: &#36;{{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          provenance: false</code></pre>
<p class="note-ct"><strong>Reading the workflow.</strong> <code>&#36;{{ … }}</code> is a GitHub Actions <em>expression</em>, filled in by GitHub before the step runs — <code>&#36;{{ github.actor }}</code> becomes your username, <code>&#36;{{ steps.meta.outputs.tags }}</code> the tag list produced by the step with <code>id: meta</code>. The action versions were checked against each repository's latest release in September 2026 (<code>checkout@v7</code>, <code>setup-buildx-action@v4</code>, <code>login-action@v4</code>, <code>metadata-action@v6</code>, <code>build-push-action@v7</code>); the v4–v7 majors mainly moved to the Node 24 runtime, so older copies of this file from blog posts still work on GitHub-hosted runners but will be flagged as outdated. This workflow was not run as part of the course — the cache behaviour it relies on is what the <code>type=local</code> simulation below demonstrates.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">setup-buildx-action</span><span class="v">Creates a <code>docker-container</code> builder: needed for multi-platform builds (Lesson 3.4) and for exporting cache on an engine that still uses the old overlay2 image store, where the default <code>docker</code> driver refuses with <code>Cache export is not supported</code>. Docker 29 with the containerd image store can export from the default driver too — but on a CI runner you do not control which store is configured, so keep this step.</span></div>
  <div class="kv"><span class="k">metadata-action</span><span class="v">Generates the tag set from Lesson 3.2 automatically — commit SHA, branch name, semver — plus the <code>org.opencontainers.image.*</code> labels. Three lines instead of a shell script.</span></div>
  <div class="kv"><span class="k">push on main only</span><span class="v">Pull requests build and populate the cache without publishing anything. Note that GitHub Actions caches are scoped per branch with read-only fallback to the default branch, so a PR reads main's cache and cannot poison it.</span></div>
  <div class="kv"><span class="k">GITHUB_TOKEN, not a PAT</span><span class="v">Scoped to this repository, rotated per run, and it can push to GHCR with <code>packages: write</code>. No secret to manage or leak (Lesson 3.3).</span></div>
  <div class="kv"><span class="k">provenance: false</span><span class="v">Suppresses the attestation manifest. Some registries and deployment tools still choke on the <code>unknown/unknown</code> entry it adds (Lesson 3.4). Leave it on where your tooling supports it.</span></div>
</div>

<h3>Prove the cache is working</h3>
${slide('dk-05', 23, 'Phép thử trung thực: xoá builder, tạo cái mới')}
<pre><code><span class="tok-comment"># In the workflow log, cached steps look like this</span>
#12 [build 4/6] RUN --mount=type=cache,target=/root/.npm npm ci
#12 CACHED
#13 [build 5/6] COPY . .
#13 DONE 0.2s

<span class="tok-comment"># Locally, simulate a cold runner and check the cache is used</span>
docker buildx create --name cachetest --driver docker-container --use
docker buildx build --cache-to type=local,dest=/tmp/bc,mode=max -t t:1 --load .
docker buildx rm cachetest &amp;&amp; docker buildx create --name cachetest2 --driver docker-container --use
docker buildx build --cache-from type=local,src=/tmp/bc --progress=plain -t t:1 --load . 2&gt;&amp;1 \\
  | grep -cE 'CACHED'</code></pre>
<div class="out">7</div>
<div class="callout ok"><strong>Deleting the builder is the honest test.</strong> A new <code>docker-container</code> builder has no local cache at all, so seven <code>CACHED</code> lines can only have come from the exported cache — which is exactly what a fresh CI runner experiences. If that number is zero on a second run, the cache is not being used and no amount of reading the workflow file will tell you why; the log will.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Cache mounts do NOT export</span><span class="v">A <code>RUN --mount=type=cache</code> directory is builder-local and is not included in <code>--cache-to</code>. In CI, the <em>layer</em> cache carries across runs but the npm download cache does not — so a cache miss in CI is still a full download. Some teams add an <code>actions/cache</code> step for <code>~/.npm</code> outside Docker to close that gap.</span></div>
  <div class="kv"><span class="k">mode=max costs upload time</span><span class="v">Exporting every stage can add 30–60 seconds. Usually still a large net win, but measure it: on a small image with a fast build, the export can cost more than it saves.</span></div>
  <div class="kv"><span class="k">Registry cache needs pruning</span><span class="v">A <code>:buildcache</code> tag grows as layers change. Most registries do not garbage-collect it for you; GHCR keeps it until you delete the package version.</span></div>
  <div class="kv"><span class="k">GitHub's cache has a quota</span><span class="v">10 GB per repository by default; an admin can raise it (usage beyond 10 GB is billed), entries not used for 7 days are removed, and when full the least recently used go first (GitHub docs, checked 09/2026). A large <code>mode=max</code> cache can evict your other caches — worth knowing when test caches start missing for no obvious reason.</span></div>
</div>

<h3>mode=min versus mode=max, measured</h3>
${slide('dk-05', 20, 'mode=min chỉ xuất tầng của ảnh cuối — đo thật')}
<p>The claim "<code>mode=min</code> caches nothing useful in a multi-stage build" is easy to test, so it was tested. A two-stage Dockerfile — stage <code>build</code> runs <code>npm ci</code> on the 898-package lockfile and copies <code>src</code>; the final stage only does <code>COPY --from=build /app/dist ./dist</code> — was built on a fresh builder with <code>--cache-to type=local,dest=…,mode=min</code> and again with <code>mode=max</code>. Then <code>src/index.js</code> was edited, a <em>new</em> builder was created (a fresh CI runner), and the build ran with <code>--cache-from</code> pointing at each export:</p>
<table>
<tr><th></th><th>Exported cache size</th><th>Rebuild after a source edit</th><th><code>RUN npm ci</code> in that rebuild</th></tr>
<tr><td><code>mode=min</code> (default)</td><td>58 MB</td><td>38.9 s</td><td><code>#11 DONE 30.7s</code> — ran again</td></tr>
<tr><td><code>mode=max</code></td><td>332 MB</td><td>19.8 s</td><td><code>#11 CACHED</code></td></tr>
</table>
<p>With <code>min</code>, only the final stage's layers were exported; the <code>npm ci</code> layer lives in the <code>build</code> stage, so a source edit — which invalidates <code>COPY src</code> and therefore the <code>COPY --from</code> result — sent BuildKit back to a stage it had no cache for. With <code>max</code>, every stage was exported and only the cheap steps after <code>COPY src</code> ran. The price of <code>max</code> is a cache almost six times larger to upload and store. For any Dockerfile with a build stage, that price is worth paying.</p>

<h3>Run it step by step: simulate a fresh CI runner on your own machine</h3>
<p>You do not need GitHub to see cache sharing work — <code>type=local</code> and two throwaway builders reproduce exactly what two CI runs experience. Everything below was run on the course Mac with the real backend (Dockerfile "fast" from Lesson 5.2):</p>
<pre><code class="language-bash">docker buildx create --name ci1 --driver docker-container
time docker buildx build --builder ci1 --output type=cacheonly \\
  --cache-to type=local,dest=./bc,mode=max .          <span class="tok-comment"># run #1: cold + export</span>
docker buildx rm ci1                                    <span class="tok-comment"># the runner is destroyed</span>

docker buildx create --name ci3 --driver docker-container
time docker buildx build --builder ci3 --output type=cacheonly \\
  --cache-from type=local,src=./bc .                    <span class="tok-comment"># run #2: fresh machine + import</span>
docker buildx rm ci3</code></pre>
<table>
<tr><th>Build</th><th>Wall-clock time</th></tr>
<tr><td>Run #1: empty builder, exporting 331 MB of cache</td><td>69.9 s</td></tr>
<tr><td>A fresh builder with no cache at all (for comparison)</td><td>58.0 s</td></tr>
<tr><td>Run #2: fresh builder + <code>--cache-from</code></td><td><strong>17.8 s</strong>, 5 lines <code>CACHED</code></td></tr>
</table>
<div class="out">#7 importing cache manifest from local:243798110493661736
#7 DONE 0.0s
…
#10 [4/5] RUN npm ci --omit=dev --ignore-scripts
#10 CACHED</div>
<table>
<tr><th>Flag</th><th>What it does</th></tr>
<tr><td><code>--builder ci1</code></td><td>Use that builder for this one command, without making it the default (<code>--use</code> would).</td></tr>
<tr><td><code>--driver docker-container</code></td><td>Run BuildKit in its own container with its own, initially empty, cache — the closest local copy of a CI runner.</td></tr>
<tr><td><code>--output type=cacheonly</code></td><td>Build, fill the cache, but produce no image. Handy for measuring; in CI you would <code>--push</code> or <code>--load</code> instead.</td></tr>
<tr><td><code>--cache-to type=local,dest=./bc,mode=max</code></td><td>Write the cache of every stage into the folder <code>./bc</code> (an OCI layout: <code>index.json</code>, <code>blobs/</code>).</td></tr>
<tr><td><code>--cache-from type=local,src=./bc</code></td><td>Before running each step, look for its key in that folder.</td></tr>
</table>
<p>The export added roughly 12 seconds (69.9 s against a comparable 58.0 s cold build — different runs, so take it as rough), and every later run on a fresh machine saved about 40. Note that 17.8 s is not zero: the cached layers still have to be copied <em>from</em> the cache store into the new builder — on GitHub that is a download from the cache service.</p>
<div class="callout ok"><strong>Docker 29 changed one old rule.</strong> With the containerd image store (the default in Docker Desktop and in fresh Engine 29 installs), even the default builder exports cache: <code>docker build --cache-to type=local,dest=../bc-default,mode=max -t c:ci .</code> on the course Mac printed <code>#13 exporting cache to client directory</code> … <code>sending cache export 0.8s done</code>. On an engine still using the overlay2 store it fails with <code>Cache export is not supported</code>; that is where you need <code>docker buildx create --driver docker-container</code> (locally) or <code>setup-buildx-action</code> (in CI).</div>

<h3>Choosing</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">GitHub Actions, one repo</span><span class="lz-t">type=gha,mode=max</span><span class="lz-d">Least configuration, fastest, automatic branch scoping. Start here if you are on Actions.</span></div>
  <div class="lz-step"><span class="lz-k">Several CI systems, or laptops too</span><span class="lz-t">type=registry,mode=max</span><span class="lz-d">The cache lives where everyone can reach it, so a developer's first build of the day is warm too. Slightly slower than <code>gha</code>, far more portable.</span></div>
  <div class="lz-step"><span class="lz-k">Self-hosted runners</span><span class="lz-t">type=local, or a persistent builder</span><span class="lz-d">If the runner keeps its disk between jobs, a persistent <code>docker-container</code> builder needs no cache flags at all — the local cache simply survives.</span></div>
  <div class="lz-step"><span class="lz-k">Single-stage image, minimal setup</span><span class="lz-t">type=inline</span><span class="lz-d">No extra storage, no extra tag, one flag. Remember it cannot cache a build stage, so it is the wrong choice the moment you go multi-stage.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your team's GitHub Actions build takes as long on a one-line change as on a fresh clone. Before touching the workflow, prove on your own machine that exporting and importing the cache actually helps your Dockerfile.</p><ol>
<li>In <code>~/thu-docker/ci54</code> (your project, or the backend from Lesson 5.2), create a builder and do run #1 with <code>--cache-to type=local,dest=./bc,mode=max</code> as in "Run it step by step". Remove the builder.</li>
<li>Edit one line of source. Create a new builder and do run #2 with <code>--cache-from type=local,src=./bc --progress=plain</code>; save the output to <code>run2.log</code>.</li>
<li>Repeat steps 1–2 with <code>mode=min</code> into <code>./bc-min</code>. Compare <code>du -sh bc bc-min</code> and the two times.</li>
<li>Clean up: <code>docker buildx rm</code> every builder you created, <code>rm -rf bc bc-min</code>.</li></ol>
<p><strong>Done when:</strong> <code>grep 'importing cache manifest' run2.log</code> finds a line, your install step says <code>CACHED</code> with <code>mode=max</code> but runs again with <code>mode=min</code> (if your Dockerfile is multi-stage), and <code>docker buildx ls</code> shows only the builders you started with.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CI runner</span><span class="v">The machine that runs a CI job. On GitHub-hosted runners it is brand new for every job, so its local cache is always empty.</span></div>
  <div class="kv"><span class="k">Cache export / import</span><span class="v"><code>--cache-to</code> writes the cache somewhere outside the builder; <code>--cache-from</code> reads it back before building.</span></div>
  <div class="kv"><span class="k">Cache backend</span><span class="v">Where the exported cache lives: <code>gha</code> (GitHub's cache service), <code>registry</code> (a tag), <code>local</code> (a folder), <code>inline</code> (inside the image).</span></div>
  <div class="kv"><span class="k">mode=min / mode=max</span><span class="v">Export only the final image's layers / every layer of every stage. Multi-stage builds need <code>max</code>.</span></div>
  <div class="kv"><span class="k">Builder driver</span><span class="v">How BuildKit runs: <code>docker</code> (inside the Docker engine, the default) or <code>docker-container</code> (its own container, own cache).</span></div>
  <div class="kv"><span class="k">GHCR</span><span class="v">GitHub Container Registry, <code>ghcr.io</code> — where the workflow pushes, authenticated by the per-run <code>GITHUB_TOKEN</code>.</span></div>
  <div class="kv"><span class="k">Expression &#36;{{ }}</span><span class="v">GitHub Actions syntax for values computed at run time (actor, event name, outputs of earlier steps).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A fresh CI runner starts with an empty cache; only <code>--cache-to</code> + <code>--cache-from</code> carry it between runs.</li>
<li>Use <code>mode=max</code> for multi-stage builds — measured: 38.9 s rebuild with <code>min</code>, 19.8 s with <code>max</code>.</li>
<li>On GitHub Actions start with <code>type=gha</code>; use <code>type=registry</code> when several CI systems or laptops must share it.</li>
<li>Docker 29 with the containerd store can export from the default builder; older engines fail with <code>Cache export is not supported</code> — never silently.</li>
<li>Test honestly: delete the builder, create a new one, import, and look for <code>CACHED</code> and <code>importing cache manifest</code>.</li>
<li>Cache mounts are not exported, so in CI a real dependency change still downloads everything.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/build/cache/backends/" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Cache storage backends</span><span class="lc-sub">inline, registry, local, gha, s3 and azblob — each with its options, limitations and a worked example. The reference for choosing.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/ci/github-actions/cache/" target="_blank" rel="noopener">
  <span class="lc-ico">🐙</span>
  <span class="lc-body"><span class="lc-title">Cache management with GitHub Actions</span><span class="lc-sub">Docker's own guide, including the quota behaviour and how branch scoping affects what a pull request can read and write.</span></span>
</a>
<a class="link-card" href="https://github.com/docker/metadata-action" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">docker/metadata-action</span><span class="lc-sub">Generates tags and OCI labels from git context. Replaces a page of shell and gets the tagging strategy from Lesson 3.2 right by default.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: warm the CI cache</span><span class="lc-sub">Graded exercises: prove a cache export works by deleting the builder, pick the right backend for three scenarios, explain why <code>mode=min</code> caches nothing useful in a multi-stage build, and spot the missing <code>setup-buildx-action</code>.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> <code>--cache-to</code> silently doing nothing because the default builder is in use. An older version of this lesson said the default <code>docker</code> driver quietly ignores <code>--cache-to</code>; that is not what happens. On an engine with the old overlay2 image store it <em>fails</em> with <code>Cache export is not supported</code> (only <code>type=inline</code> is allowed), and on Docker 29 with the containerd image store it exports normally. The genuinely silent versions are these: the export runs with the default <code>mode=min</code> on a multi-stage Dockerfile and saves nothing useful (see the measurement in this lesson), or <code>--cache-to</code> sits in a job that only runs on <code>main</code> while every PR reads a cache that was never written. The build succeeds, the workflow is green, and every run is cold forever. The symptom is a CI build that takes the same time whether or not anything changed. Check with <code>docker buildx inspect</code> that the driver is <code>docker-container</code>, and grep the build log for <code>exporting cache</code> — if that line is absent, nothing was exported.</div>
<p class="note-ct"><strong>Three things to remember.</strong> A fresh CI runner has no cache, so everything earlier in this chapter is worthless there until you add <code>--cache-from</code>/<code>--cache-to</code>. Use <code>mode=max</code> — the default <code>mode=min</code> exports only the final image's layers, which excludes the expensive build stage in every multi-stage Dockerfile. And cache mounts do not export, so in CI a layer miss still means a full download: the layer cache travels, the npm cache does not.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Chia sẻ cache với CI</h2>
<p class="lead">Mọi thứ trong chương này cho tới giờ đều làm cho bản dựng <em>CỤC BỘ</em> của bạn nhanh. Máy chạy CI là những cái máy mới tinh với cache rỗng, nên chẳng thứ nào giúp được gì ở đó — và CI mới là chỗ thời gian dựng tốn kém nhất, vì nó nằm trên đường từ một commit tới một bản deploy. Cách chữa là cất cái cache ở một chỗ mà cả hai lượt chạy đều với tới được.</p>

<h3>Hai cái cờ</h3>
${slide('dk-05', 19, 'Máy CI mới tinh có cache rỗng — cất cache ra ngoài máy')}
<pre><code>docker buildx build \\
  --cache-from type=registry,ref=ghcr.io/me/app:buildcache \\
  --cache-to   type=registry,ref=ghcr.io/me/app:buildcache,mode=max \\
  -t ghcr.io/me/app:1.4.2 --push .</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">--cache-from</span><span class="v">Nơi tìm những tầng đã dựng trước đó TRƯỚC KHI chạy một bước. Đưa nhiều lần cũng được; BuildKit thử từng cái theo thứ tự. Không có ở đó cũng vô hại — lượt dựng chỉ đơn giản là bắt đầu nguội.</span></div>
  <div class="kv"><span class="k">--cache-to</span><span class="v">Nơi GHI cache sau khi dựng. Cần quyền ghi vào chỗ đó, và nó tốn một chút thời gian tải lên — đó là lý do nó thường chỉ chạy trên nhánh chính.</span></div>
  <div class="kv"><span class="k">mode=min (mặc định)</span><span class="v">Chỉ xuất những tầng nằm trong ảnh CUỐI. Nhỏ và nhanh, và VÔ DỤNG với dựng nhiều tầng, vì cái stage dựng đắt tiền thì không nằm trong ảnh cuối.</span></div>
  <div class="kv"><span class="k">mode=max</span><span class="v">Xuất MỌI tầng của MỌI stage. To hơn và tải lên chậm hơn, và là thiết lập DUY NHẤT có ích khi bạn có một stage dựng đáng lưu đệm — tức là gần như luôn luôn.</span></div>
  <div class="kv"><span class="k">Một tag RIÊNG, không phải tag ảnh của bạn</span><span class="v"><code>:buildcache</code> giữ những manifest cache, không phải một cái ảnh chạy được. Đừng trỏ nó vào <code>:latest</code> — ai kéo cái đó về sẽ nhận một thứ KHÔNG phải ảnh.</span></div>
</div>

<h3>Bốn backend</h3>
${slide('dk-05', 21, 'Bốn kho cache và builder mặc định của Docker 29')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">type=registry</span><span class="lz-lnote">Cache nằm trong một registry dưới dạng một tag riêng. Chạy được ở mọi nơi, sống sót qua việc khởi động lại máy chạy CI, dùng chung giữa MỌI máy với tới được registry — kể cả laptop của bạn. Lựa chọn mặc định cho phần lớn dự án, và là cái duy nhất chạy xuyên qua các nhà cung cấp CI.</span></div>
  <div class="lz-layer"><span class="lz-lname">type=gha</span><span class="lz-lnote">Dịch vụ cache của chính GitHub Actions. Nhanh, miễn phí trong hạn mức của workflow, và tự động giới hạn phạm vi theo nhánh kèm dự phòng về nhánh mặc định. Câu trả lời đúng nếu bạn dùng GitHub Actions và không có gì khác cần tới cái cache.</span></div>
  <div class="lz-layer"><span class="lz-lname">type=local</span><span class="lz-lnote">Một thư mục trên đĩa. Đúng cho máy chạy CI tự dựng có ổ đĩa bền vững, và để ghép với một bước <code>actions/cache</code>. Cần quản lý bằng tay không thì nó phình vô hạn.</span></div>
  <div class="lz-layer"><span class="lz-lname">type=inline</span><span class="lz-lnote">Siêu dữ liệu cache nhúng ngay trong chính cái ảnh, nên <code>--cache-from</code> lên tag bình thường của bạn là chạy được, không cần kho lưu nào thêm. Đơn giản và hạn chế: nó CHỈ có <code>mode=min</code>, nên không lưu đệm được stage dựng. Ổn cho ảnh một tầng.</span></div>
</div>
<pre><code><span class="tok-comment"># inline — bản đơn giản nhất có thể, không cần tag phụ</span>
docker buildx build --cache-to type=inline \\
  --cache-from ghcr.io/me/app:latest -t ghcr.io/me/app:latest --push .

<span class="tok-comment"># local — cho một máy chạy CI tự dựng có đĩa bền vững</span>
docker buildx build \\
  --cache-from type=local,src=/var/cache/buildkit \\
  --cache-to   type=local,dest=/var/cache/buildkit,mode=max \\
  -t app:1.0 --load .</code></pre>

<h3>Một workflow GitHub Actions hoàn chỉnh</h3>
${slide('dk-05', 22, 'Workflow GitHub Actions, phiên bản action tính đến 09/2026')}
<pre><code>name: build
on:
  push: { branches: [main] }
  pull_request:

jobs:
  docker:
    runs-on: ubuntu-latest
    permissions: { contents: read, packages: write }
    steps:
      - uses: actions/checkout@v7

      - uses: docker/setup-buildx-action@v4

      - uses: docker/login-action@v4
        with:
          registry: ghcr.io
          username: &#36;{{ github.actor }}
          password: &#36;{{ secrets.GITHUB_TOKEN }}

      - uses: docker/metadata-action@v6
        id: meta
        with:
          images: ghcr.io/&#36;{{ github.repository }}
          tags: |
            type=sha,format=long
            type=ref,event=branch
            type=semver,pattern={{version}}

      - uses: docker/build-push-action@v7
        with:
          context: .
          push: &#36;{{ github.event_name != 'pull_request' }}
          tags: &#36;{{ steps.meta.outputs.tags }}
          labels: &#36;{{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          provenance: false</code></pre>
<p class="note-ct"><strong>Đọc workflow.</strong> <code>&#36;{{ … }}</code> là một <em>biểu thức</em> của GitHub Actions, được GitHub điền vào trước khi bước chạy — <code>&#36;{{ github.actor }}</code> thành tên tài khoản của bạn, <code>&#36;{{ steps.meta.outputs.tags }}</code> thành danh sách tag do bước có <code>id: meta</code> sinh ra. Phiên bản các action đã được đối chiếu với bản phát hành mới nhất của từng kho vào tháng 9/2026 (<code>checkout@v7</code>, <code>setup-buildx-action@v4</code>, <code>login-action@v4</code>, <code>metadata-action@v6</code>, <code>build-push-action@v7</code>); các bản lớn v4–v7 chủ yếu chuyển sang Node 24, nên những bản sao cũ trên blog vẫn chạy trên máy của GitHub nhưng sẽ bị báo lỗi thời. Workflow này KHÔNG được chạy trong khoá — hành vi cache mà nó dựa vào chính là thứ phép giả lập <code>type=local</code> bên dưới chứng minh.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">setup-buildx-action</span><span class="v">Tạo một bộ dựng <code>docker-container</code>: cần cho dựng đa nền tảng (Bài 3.4) và để xuất cache trên engine còn dùng kho ảnh overlay2 kiểu cũ, nơi trình <code>docker</code> mặc định TỪ CHỐI với lỗi <code>Cache export is not supported</code>. Docker 29 dùng kho ảnh containerd thì trình mặc định cũng xuất được — nhưng trên máy chạy CI bạn không quyết định kho ảnh nào đang bật, nên cứ giữ bước này.</span></div>
  <div class="kv"><span class="k">metadata-action</span><span class="v">Tự sinh bộ tag của Bài 3.2 — mã commit, tên nhánh, semver — cộng những nhãn <code>org.opencontainers.image.*</code>. Ba dòng thay cho một script shell.</span></div>
  <div class="kv"><span class="k">chỉ push trên main</span><span class="v">Pull request vẫn dựng và làm đầy cache mà không công bố gì. Lưu ý rằng cache của GitHub Actions giới hạn phạm vi theo nhánh với dự phòng CHỈ ĐỌC về nhánh mặc định, nên một PR ĐỌC được cache của main mà không đầu độc được nó.</span></div>
  <div class="kv"><span class="k">GITHUB_TOKEN, không phải PAT</span><span class="v">Giới hạn phạm vi trong kho này, xoay vòng theo từng lượt chạy, và nó đẩy được lên GHCR với <code>packages: write</code>. Không có bí mật nào phải quản lý hay bị rò (Bài 3.3).</span></div>
  <div class="kv"><span class="k">provenance: false</span><span class="v">Chặn cái manifest chứng thực. Vài registry và công cụ triển khai vẫn nghẹn với mục <code>unknown/unknown</code> mà nó thêm vào (Bài 3.4). Hãy bật nó ở nơi công cụ của bạn hỗ trợ.</span></div>
</div>

<h3>Chứng minh cache đang hoạt động</h3>
${slide('dk-05', 23, 'Phép thử trung thực: xoá builder, tạo cái mới')}
<pre><code><span class="tok-comment"># Trong log workflow, những bước có cache trông như thế này</span>
#12 [build 4/6] RUN --mount=type=cache,target=/root/.npm npm ci
#12 CACHED
#13 [build 5/6] COPY . .
#13 DONE 0.2s

<span class="tok-comment"># Ở máy, hãy giả lập một máy chạy nguội và kiểm xem cache có được dùng</span>
docker buildx create --name cachetest --driver docker-container --use
docker buildx build --cache-to type=local,dest=/tmp/bc,mode=max -t t:1 --load .
docker buildx rm cachetest &amp;&amp; docker buildx create --name cachetest2 --driver docker-container --use
docker buildx build --cache-from type=local,src=/tmp/bc --progress=plain -t t:1 --load . 2&gt;&amp;1 \\
  | grep -cE 'CACHED'</code></pre>
<div class="out">7</div>
<div class="callout ok"><strong>Xoá cái bộ dựng đi mới là phép thử TRUNG THỰC.</strong> Một bộ dựng <code>docker-container</code> mới hoàn toàn không có cache cục bộ nào, nên bảy dòng <code>CACHED</code> chỉ có thể đến từ cái cache đã xuất — và đó chính xác là thứ một máy chạy CI mới tinh trải qua. Nếu con số đó là 0 ở lượt chạy thứ hai thì cache KHÔNG được dùng, và đọc bao nhiêu file workflow cũng không nói cho bạn biết vì sao; cái log thì có.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Cache mount KHÔNG được xuất</span><span class="v">Một thư mục <code>RUN --mount=type=cache</code> là cục bộ theo bộ dựng và KHÔNG nằm trong <code>--cache-to</code>. Trong CI, cache theo TẦNG thì mang được qua các lượt chạy còn bộ đệm tải về của npm thì không — nên một cú trượt cache trong CI vẫn là một lượt tải đầy đủ. Vài đội thêm một bước <code>actions/cache</code> cho <code>~/.npm</code> nằm NGOÀI Docker để bịt cái khe đó.</span></div>
  <div class="kv"><span class="k">mode=max tốn thời gian tải lên</span><span class="v">Xuất mọi stage có thể thêm 30–60 giây. Thường thì vẫn lời to, nhưng hãy ĐO: trên một ảnh nhỏ với lượt dựng nhanh, việc xuất có thể tốn hơn phần nó tiết kiệm.</span></div>
  <div class="kv"><span class="k">Cache trong registry cần được tỉa</span><span class="v">Một tag <code>:buildcache</code> phình lên khi các tầng thay đổi. Phần lớn registry KHÔNG thu gom rác hộ bạn; GHCR giữ nó cho tới khi bạn tự xoá phiên bản gói đó.</span></div>
  <div class="kv"><span class="k">Cache của GitHub có hạn mức</span><span class="v">Mặc định 10 GB mỗi kho; quản trị viên nâng được (vượt 10 GB thì tính tiền), mục nào 7 ngày không dùng bị xoá, và khi đầy thì cái lâu nhất chưa dùng bị đẩy ra trước (tài liệu GitHub, kiểm 09/2026). Một cái cache <code>mode=max</code> lớn có thể ĐẨY BẬT những cache khác của bạn — đáng biết khi cache của test bắt đầu trượt mà chẳng có lý do rõ ràng nào.</span></div>
</div>

<h3>mode=min so với mode=max, đo thật</h3>
${slide('dk-05', 20, 'mode=min chỉ xuất tầng của ảnh cuối — đo thật')}
<p>Câu "<code>mode=min</code> chẳng lưu đệm được gì có ích trong dựng nhiều stage" dễ kiểm, nên đã kiểm. Một Dockerfile hai stage — stage <code>build</code> chạy <code>npm ci</code> trên lockfile 898 gói rồi chép <code>src</code>; stage cuối chỉ <code>COPY --from=build /app/dist ./dist</code> — được dựng trên một builder mới tinh với <code>--cache-to type=local,dest=…,mode=min</code>, rồi làm lại với <code>mode=max</code>. Sau đó sửa <code>src/index.js</code>, tạo một builder MỚI (một máy CI mới tinh), và dựng với <code>--cache-from</code> trỏ vào từng bản xuất:</p>
<table>
<tr><th></th><th>Dung lượng cache đã xuất</th><th>Dựng lại sau khi sửa mã</th><th><code>RUN npm ci</code> trong lượt đó</th></tr>
<tr><td><code>mode=min</code> (mặc định)</td><td>58 MB</td><td>38,9 s</td><td><code>#11 DONE 30.7s</code> — chạy lại</td></tr>
<tr><td><code>mode=max</code></td><td>332 MB</td><td>19,8 s</td><td><code>#11 CACHED</code></td></tr>
</table>
<p>Với <code>min</code>, chỉ tầng của stage cuối được xuất; tầng <code>npm ci</code> nằm ở stage <code>build</code>, nên một cú sửa mã — làm hỏng <code>COPY src</code> và do đó hỏng kết quả của <code>COPY --from</code> — đẩy BuildKit quay về một stage mà nó không có cache. Với <code>max</code>, mọi stage được xuất và chỉ những bước rẻ sau <code>COPY src</code> phải chạy. Cái giá của <code>max</code> là một cache to gần gấp sáu để tải lên và cất giữ. Với mọi Dockerfile có stage dựng, cái giá đó đáng trả.</p>

<h3>Chạy thử từng bước: giả lập một máy CI mới tinh ngay trên máy bạn</h3>
<p>Không cần GitHub mới thấy chia sẻ cache hoạt động — <code>type=local</code> và hai builder dùng một lần là tái hiện đúng thứ hai lượt CI trải qua. Mọi thứ dưới đây chạy trên máy Mac của khoá với backend thật (Dockerfile "nhanh" của Bài 5.2):</p>
<pre><code class="language-bash">docker buildx create --name ci1 --driver docker-container
time docker buildx build --builder ci1 --output type=cacheonly \\
  --cache-to type=local,dest=./bc,mode=max .          <span class="tok-comment"># lượt #1: nguội + xuất</span>
docker buildx rm ci1                                    <span class="tok-comment"># máy CI bị huỷ</span>

docker buildx create --name ci3 --driver docker-container
time docker buildx build --builder ci3 --output type=cacheonly \\
  --cache-from type=local,src=./bc .                    <span class="tok-comment"># lượt #2: máy mới + nhập</span>
docker buildx rm ci3</code></pre>
<table>
<tr><th>Lượt dựng</th><th>Thời gian thực</th></tr>
<tr><td>Lượt #1: builder rỗng, xuất 331 MB cache</td><td>69,9 s</td></tr>
<tr><td>Một builder mới hoàn toàn không cache (để so)</td><td>58,0 s</td></tr>
<tr><td>Lượt #2: builder mới + <code>--cache-from</code></td><td><strong>17,8 s</strong>, 5 dòng <code>CACHED</code></td></tr>
</table>
<div class="out">#7 importing cache manifest from local:243798110493661736
#7 DONE 0.0s
…
#10 [4/5] RUN npm ci --omit=dev --ignore-scripts
#10 CACHED</div>
<table>
<tr><th>Cờ</th><th>Làm gì</th></tr>
<tr><td><code>--builder ci1</code></td><td>Dùng builder đó cho riêng lệnh này, không biến nó thành mặc định (<code>--use</code> mới làm thế).</td></tr>
<tr><td><code>--driver docker-container</code></td><td>Chạy BuildKit trong một container riêng với cache riêng, lúc đầu rỗng — bản sao cục bộ gần nhất của một máy CI.</td></tr>
<tr><td><code>--output type=cacheonly</code></td><td>Dựng, lấp cache, nhưng không tạo ảnh. Tiện để đo; trong CI bạn sẽ <code>--push</code> hoặc <code>--load</code>.</td></tr>
<tr><td><code>--cache-to type=local,dest=./bc,mode=max</code></td><td>Ghi cache của MỌI stage vào thư mục <code>./bc</code> (dạng OCI layout: <code>index.json</code>, <code>blobs/</code>).</td></tr>
<tr><td><code>--cache-from type=local,src=./bc</code></td><td>Trước khi chạy từng bước, tìm khoá của nó trong thư mục đó.</td></tr>
</table>
<p>Việc xuất tốn thêm chừng 12 giây (69,9 s so với một lượt nguội tương đương 58,0 s — hai lần chạy khác nhau, nên chỉ coi là ước chừng), và mọi lượt sau trên máy mới tiết kiệm khoảng 40 giây. Để ý 17,8 s không phải con số 0: các tầng có cache vẫn phải được chép TỪ kho cache vào builder mới — trên GitHub đó là một lượt tải từ dịch vụ cache.</p>
<div class="callout ok"><strong>Docker 29 đổi một luật cũ.</strong> Với kho ảnh containerd (mặc định trong Docker Desktop và trong bản cài Engine 29 mới), kể cả builder mặc định cũng xuất được cache: <code>docker build --cache-to type=local,dest=../bc-default,mode=max -t c:ci .</code> trên máy Mac của khoá in <code>#13 exporting cache to client directory</code> … <code>sending cache export 0.8s done</code>. Trên engine còn dùng kho overlay2 thì nó hỏng với <code>Cache export is not supported</code>; đó là lúc bạn cần <code>docker buildx create --driver docker-container</code> (ở máy) hoặc <code>setup-buildx-action</code> (trong CI).</div>

<h3>Chọn cái nào</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">GitHub Actions, một kho</span><span class="lz-t">type=gha,mode=max</span><span class="lz-d">Ít cấu hình nhất, nhanh nhất, tự động giới hạn phạm vi theo nhánh. Hãy bắt đầu từ đây nếu bạn dùng Actions.</span></div>
  <div class="lz-step"><span class="lz-k">Nhiều hệ CI, hoặc cả laptop nữa</span><span class="lz-t">type=registry,mode=max</span><span class="lz-d">Cache nằm ở chỗ ai cũng với tới được, nên lượt dựng đầu ngày của một lập trình viên cũng ấm luôn. Chậm hơn <code>gha</code> một chút, mang đi được hơn hẳn.</span></div>
  <div class="lz-step"><span class="lz-k">Máy chạy CI tự dựng</span><span class="lz-t">type=local, hoặc một bộ dựng bền vững</span><span class="lz-d">Nếu máy chạy giữ nguyên đĩa giữa các công việc thì một bộ dựng <code>docker-container</code> bền vững chẳng cần cờ cache nào cả — cache cục bộ đơn giản là sống sót.</span></div>
  <div class="lz-step"><span class="lz-k">Ảnh một tầng, thiết lập tối thiểu</span><span class="lz-t">type=inline</span><span class="lz-d">Không kho lưu phụ, không tag phụ, một cái cờ. Nhớ rằng nó KHÔNG lưu đệm được stage dựng, nên nó là lựa chọn sai ngay khoảnh khắc bạn chuyển sang nhiều tầng.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bản dựng GitHub Actions của nhóm mất thời gian như nhau dù chỉ sửa một dòng hay clone mới tinh. Trước khi đụng vào workflow, hãy chứng minh ngay trên máy bạn rằng xuất và nhập cache thật sự giúp được Dockerfile của nhóm.</p><ol>
<li>Trong <code>~/thu-docker/ci54</code> (dự án của bạn, hoặc backend của Bài 5.2), tạo một builder và làm lượt #1 với <code>--cache-to type=local,dest=./bc,mode=max</code> như mục "Chạy thử từng bước". Xoá builder đó.</li>
<li>Sửa một dòng mã. Tạo builder mới và làm lượt #2 với <code>--cache-from type=local,src=./bc --progress=plain</code>; lưu output vào <code>run2.log</code>.</li>
<li>Làm lại bước 1–2 với <code>mode=min</code> vào <code>./bc-min</code>. So <code>du -sh bc bc-min</code> và hai con số thời gian.</li>
<li>Dọn: <code>docker buildx rm</code> mọi builder bạn đã tạo, <code>rm -rf bc bc-min</code>.</li></ol>
<p><strong>Đạt khi:</strong> <code>grep 'importing cache manifest' run2.log</code> tìm thấy một dòng, bước cài của bạn in <code>CACHED</code> với <code>mode=max</code> nhưng chạy lại với <code>mode=min</code> (nếu Dockerfile có nhiều stage), và <code>docker buildx ls</code> chỉ còn những builder có từ trước.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CI runner (máy chạy CI)</span><span class="v">Cái máy chạy một job CI. Máy của GitHub thì mới tinh cho MỖI job, nên cache cục bộ của nó luôn rỗng.</span></div>
  <div class="kv"><span class="k">Cache export / import (xuất / nhập cache)</span><span class="v"><code>--cache-to</code> ghi cache ra một chỗ bên ngoài builder; <code>--cache-from</code> đọc nó lại trước khi dựng.</span></div>
  <div class="kv"><span class="k">Cache backend (kho cache)</span><span class="v">Nơi cache đã xuất nằm: <code>gha</code> (dịch vụ cache của GitHub), <code>registry</code> (một tag), <code>local</code> (một thư mục), <code>inline</code> (trong chính ảnh).</span></div>
  <div class="kv"><span class="k">mode=min / mode=max (chế độ tối thiểu / tối đa)</span><span class="v">Chỉ xuất tầng của ảnh cuối / xuất mọi tầng của mọi stage. Dựng nhiều stage thì cần <code>max</code>.</span></div>
  <div class="kv"><span class="k">Builder driver (trình điều khiển bộ dựng)</span><span class="v">BuildKit chạy kiểu gì: <code>docker</code> (bên trong Docker engine, mặc định) hay <code>docker-container</code> (container riêng, cache riêng).</span></div>
  <div class="kv"><span class="k">GHCR (kho ảnh của GitHub)</span><span class="v">GitHub Container Registry, <code>ghcr.io</code> — nơi workflow đẩy ảnh lên, xác thực bằng <code>GITHUB_TOKEN</code> cấp cho từng lượt chạy.</span></div>
  <div class="kv"><span class="k">Expression &#36;{{ }} (biểu thức)</span><span class="v">Cú pháp của GitHub Actions cho giá trị tính lúc chạy (người chạy, loại sự kiện, output của bước trước).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Máy CI mới tinh bắt đầu với cache rỗng; chỉ <code>--cache-to</code> + <code>--cache-from</code> mang được nó qua các lượt chạy.</li>
<li>Dùng <code>mode=max</code> cho dựng nhiều stage — đo thật: dựng lại 38,9 s với <code>min</code>, 19,8 s với <code>max</code>.</li>
<li>Trên GitHub Actions bắt đầu bằng <code>type=gha</code>; dùng <code>type=registry</code> khi nhiều hệ CI hay laptop cần dùng chung.</li>
<li>Docker 29 với kho containerd xuất được từ builder mặc định; engine cũ thì hỏng với <code>Cache export is not supported</code> — không bao giờ im lặng.</li>
<li>Kiểm trung thực: xoá builder, tạo cái mới, nhập cache, tìm <code>CACHED</code> và <code>importing cache manifest</code>.</li>
<li>Cache mount không được xuất, nên trong CI một lần đổi thư viện thật vẫn tải lại tất cả.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/build/cache/backends/" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Các backend lưu cache</span><span class="lc-sub">inline, registry, local, gha, s3 và azblob — mỗi cái kèm tuỳ chọn, hạn chế và một ví dụ đầy đủ. Tài liệu để chọn.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/ci/github-actions/cache/" target="_blank" rel="noopener">
  <span class="lc-ico">🐙</span>
  <span class="lc-body"><span class="lc-title">Quản lý cache với GitHub Actions</span><span class="lc-sub">Hướng dẫn của chính Docker, gồm cả hành vi hạn mức và cách giới hạn phạm vi theo nhánh ảnh hưởng tới việc một pull request đọc và ghi được gì.</span></span>
</a>
<a class="link-card" href="https://github.com/docker/metadata-action" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">docker/metadata-action</span><span class="lc-sub">Sinh tag và nhãn OCI từ ngữ cảnh git. Thay được cả một trang shell và mặc định làm ĐÚNG chiến lược đặt tag ở Bài 3.2.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: làm ấm cache của CI</span><span class="lc-sub">Bài chấm điểm: chứng minh một lượt xuất cache có hoạt động bằng cách xoá bộ dựng, chọn backend đúng cho ba tình huống, giải thích vì sao <code>mode=min</code> chẳng lưu đệm được gì hữu ích trong một lượt dựng nhiều tầng, và phát hiện chỗ thiếu <code>setup-buildx-action</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>--cache-to</code> âm thầm chẳng làm gì vì đang dùng bộ dựng mặc định. Bản cũ của bài này nói trình <code>docker</code> mặc định lặng lẽ phớt lờ <code>--cache-to</code>; thực tế không phải vậy. Trên engine còn dùng kho ảnh overlay2 kiểu cũ, nó HỎNG với lỗi <code>Cache export is not supported</code> (chỉ cho <code>type=inline</code>), còn trên Docker 29 dùng kho ảnh containerd thì nó xuất bình thường. Những phiên bản IM LẶNG thật sự là: xuất với <code>mode=min</code> mặc định trên Dockerfile nhiều stage nên chẳng lưu được gì có ích (xem phép đo trong bài này), hoặc <code>--cache-to</code> nằm trong một job chỉ chạy trên <code>main</code> trong khi mọi PR đọc một cache chưa bao giờ được ghi. Lượt dựng thành công, workflow xanh, và mọi lượt chạy đều nguội mãi mãi. Triệu chứng là một lượt dựng CI mất thời gian như nhau bất kể có gì thay đổi hay không. Hãy kiểm bằng <code>docker buildx inspect</code> rằng trình điều khiển là <code>docker-container</code>, và grep log dựng tìm dòng <code>exporting cache</code> — nếu dòng đó vắng mặt thì chẳng có gì được xuất cả.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Một máy chạy CI mới tinh không có cache nào, nên mọi thứ ở phần trước của chương này đều vô giá trị ở đó cho tới khi bạn thêm <code>--cache-from</code>/<code>--cache-to</code>. Hãy dùng <code>mode=max</code> — giá trị mặc định <code>mode=min</code> chỉ xuất những tầng của ảnh cuối, và điều đó loại trừ cái stage dựng đắt tiền trong MỌI Dockerfile nhiều tầng. Và cache mount KHÔNG được xuất, nên trong CI một cú trượt tầng vẫn là một lượt tải đầy đủ: cache tầng thì đi theo, cache npm thì không.</p>
</div>
`,
    },
    /* ─────────────────────────── 5.5 ─────────────────────────── */
    {
      title: '5.5 — Diagnosing a slow build|||5.5 — Chẩn đoán một lượt dựng chậm',
      slug: 'dk-5-5-chan-doan-dung-cham',
      type: 'LESSON',
      description: 'Ba phép đo cần lấy, đọc mốc thời gian của từng bước, docker build --check, bảy nguyên nhân phổ biến kèm dấu hiệu nhận biết của từng cái, và việc BuildKit chạy song song các stage độc lập.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Diagnosing a slow build</h2>
<p class="lead">"The build is slow" is not a diagnosis. There are three different slownesses — cold, warm, and after-an-edit — with different causes and different fixes, and you cannot tell which one you have without measuring. This lesson is the measurement, the signatures of the seven common causes, and the order to check them in.</p>

<h3>Take three measurements</h3>
${slide('dk-05', 24, 'Ba phép đo trước khi kết luận: nguội · ấm · sau khi sửa')}
<pre><code><span class="tok-comment"># 1 · Cold: nothing cached at all — what CI experiences on a fresh runner</span>
time docker build --no-cache -q -t app:m . &gt;/dev/null

<span class="tok-comment"># 2 · Warm: nothing changed — this should be under a second</span>
time docker build -q -t app:m . &gt;/dev/null

<span class="tok-comment"># 3 · After a source edit — the number you live with all day</span>
touch src/index.ts &amp;&amp; echo '// x' &gt;&gt; src/index.ts
time docker build -q -t app:m . &gt;/dev/null</code></pre>
<div class="out">docker build --no-cache -q -t app:m . &gt; /dev/null  0.12s user 0.11s system 0% cpu 51.456 total
docker build -q -t app:m . &gt; /dev/null  0.10s user 0.08s system 7% cpu 2.397 total
docker build -q -t app:m . &gt; /dev/null  0.10s user 0.08s system 8% cpu 2.177 total</div>
<p>Real output on the course Mac (zsh prints <code>… total</code> instead of bash's <code>real</code>), for the 898-package backend with the "fast" Dockerfile from Lesson 5.2 and a JavaScript entry file (<code>src/index.js</code>). Cold 51 s, warm 2.4 s, after an edit 2.2 s: the first row of the table below — a healthy project whose only slow build is the cold one. An earlier version of this lesson printed 3 min 41 s / 0.4 s / 9.1 s here as an illustration; the numbers above are measured.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Cold is slow, warm is fast, edit is fast</span><span class="v">Normal and healthy. Cold time only matters in CI — go to Lesson 5.4 and share the cache.</span></div>
  <div class="kv"><span class="k">Warm is slow (over a few seconds)</span><span class="v">Something invalidates the cache even when nothing changed. Usually a changing <code>ARG</code>, a file rewritten by a tool, or <code>--pull</code>/<code>--no-cache</code> left in a script. Check the context size first.</span></div>
  <div class="kv"><span class="k">Edit is slow but warm is fast</span><span class="v">Ordering. Your source is copied too early, so a source change invalidates the dependency install (Lesson 5.2). The most common case and the easiest to fix.</span></div>
  <div class="kv"><span class="k">All three are slow</span><span class="v">Something is wrong outside the cache: an enormous context, emulation, a huge base image, or a genuinely slow step. The timings below will name it.</span></div>
</div>

<h3>Find the expensive step</h3>
${slide('dk-05', 25, 'Sắp dòng DONE theo giây: thường một bước là cả vấn đề')}
<pre><code>docker build --no-cache --progress=plain -t app:m . 2&gt;&amp;1 \\
  | grep -E '^#[0-9]+ (DONE|CACHED)' \\
  | sort -t' ' -k3 -hr | head -8</code></pre>
<div class="out">#10 DONE 29.6s
#12 DONE 21.6s
#2 DONE 0.4s
#4 DONE 0.3s
#11 DONE 0.2s
#9 DONE 0.0s
#8 CACHED
#7 DONE 0.0s</div>
<pre><code><span class="tok-comment"># Which jobs are #10 and #12?</span>
docker build --no-cache --progress=plain -t app:m . 2&gt;&amp;1 | grep -E '^#(10|12) (\\[|exporting to image$)'</code></pre>
<div class="out">#10 [4/5] RUN npm ci --omit=dev --ignore-scripts
#12 exporting to image</div>
<p>Two jobs account for 51 of the 52 seconds. Everything else is rounding error, and optimising it would be wasted effort — which is exactly why you measure before you change anything. (An earlier version of this lesson showed an invented three-minute list here; the lines above are real, from the course Mac.)</p>
<div class="callout"><strong>The surprise in this list is #12.</strong> <code>exporting to image</code> is not an instruction of yours: it is BuildKit writing the finished layers into Docker's image store — <code>exporting layers 16.4s</code>, then <code>unpacking … 5.1s</code> in the full log, 21.6 s in total, because this single-stage image carries all of <code>node_modules</code>. The two-stage version of the same backend (final stage copies only <code>dist/</code>) exported in 0.1 s. A big final image costs time on every build, not only disk — one more reason for Chapter 6.</div>

<h3>Seven causes and their signatures</h3>
${slide('dk-05', 26, 'Bảy nguyên nhân dựng chậm và dấu hiệu của từng cái')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · A huge build context</span><span class="lz-t">signature: "transferring context: 412.7MB"</span><span class="lz-d">Seconds before any instruction runs, on every build. Almost always <code>node_modules</code>, <code>.git</code>, or a <code>dist/</code> left over. Fix: <code>.dockerignore</code> (Lesson 4.1).</span></div>
  <div class="lz-step"><span class="lz-k">2 · COPY . . above the install</span><span class="lz-t">signature: warm build fast, edit build slow</span><span class="lz-d">The dependency step reruns on every source change. Fix: copy manifests first (Lesson 5.2). This is the single most common cause.</span></div>
  <div class="lz-step"><span class="lz-k">3 · No cache mount on the install</span><span class="lz-t">signature: adding one dependency re-downloads everything</span><span class="lz-d">Fix: <code>RUN --mount=type=cache,target=/root/.npm</code> (Lesson 5.3).</span></div>
  <div class="lz-step"><span class="lz-k">4 · A per-build ARG or file</span><span class="lz-t">signature: warm build is slow, and nothing changed</span><span class="lz-d">A <code>BUILD_DATE</code> arg, a CI-generated <code>.env</code>, a version stamp. Fix: move it below the expensive steps, or out of the context.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Emulation</span><span class="lz-t">signature: 5–20× slower than the same build on another machine</span><span class="lz-d">Check <code>docker version --format '{{.Server.Arch}}'</code> against the image's platform. Fix: build natively or cross-compile (Lesson 3.4).</span></div>
  <div class="lz-step"><span class="lz-k">6 · --pull or --no-cache in a script</span><span class="lz-t">signature: every build is a cold build</span><span class="lz-d">Someone added it to fix a stale-cache problem in 2024 and it never came out. Fix: remove it, and keep <code>--pull</code> for the scheduled rebuild only.</span></div>
  <div class="lz-step"><span class="lz-k">7 · The step is genuinely slow</span><span class="lz-t">signature: a single DONE line dominating the timings</span><span class="lz-d">A webpack build, a Rust compile, a test suite in the image. Fix: that is an application problem, not a Docker one — but a cache mount for its own cache directory usually helps a lot.</span></div>
</div>

<h3>Two causes outside the cache, measured: context size and emulation</h3>
${slide('dk-05', 27, 'Ngữ cảnh 515 MB và giả lập amd64, đo thật')}
<p>Causes 1 and 5 above are the ones people argue about, so both were measured on the course Mac. <strong>Context:</strong> the backend folder with a real <code>node_modules</code> (590 MB after <code>npm ci</code>) and <em>no</em> <code>.dockerignore</code>, built with a <code>COPY . .</code> Dockerfile on a fresh builder:</p>
<div class="out">#8 transferring context: 515.15MB 7.7s done          <span class="tok-comment">← no .dockerignore</span>
#7 transferring context: 212B 0.5s done              <span class="tok-comment">← node_modules and .git ignored</span></div>
<p>Two details correct the simple story. BuildKit only sends the files a <code>COPY</code> actually needs: with the "fast" Dockerfile (<code>COPY package*.json</code> + <code>COPY src</code>) the same untidy folder transferred 437 kB, because <code>node_modules</code> was never referenced. And on a builder that has seen the folder before, only the <em>changes</em> are sent — the second <code>COPY . .</code> build transferred 3.03 MB in 1.1 s. So a missing <code>.dockerignore</code> hurts most exactly where you cannot see it: on a fresh CI runner, every single time. <strong>Emulation:</strong> a CPU-bound step (a Node loop of 2×10⁸ iterations), <code>--no-cache</code>, measured twice per platform:</p>
<div class="out">docker build --platform linux/arm64 …   #5 DONE 0.4s
docker build --platform linux/amd64 …   #5 DONE 3.8s</div>
<p>9.5 times slower, on an M1 Max, for the platform your VPS runs. <code>docker version --format '{{.Server.Arch}}'</code> prints <code>arm64</code> on the Mac, so every amd64 image built there is emulated. Network-bound steps like <code>npm ci</code> suffer much less than compilers and bundlers — which is why "the build is slow only on my Mac" is so often a <code>next build</code> or a native module compiling under emulation.</p>

<h3>docker build --check</h3>
${slide('dk-05', 28, 'build --check bắt lỗi không cần dựng; stage độc lập chạy song song')}
<pre><code>docker build --check -t app:m . 2&gt;&amp;1 | head -20</code></pre>
<div class="out">Check complete, 4 warnings have been found!

WARNING: FromAsCasing - https://docs.docker.com/go/dockerfile/rule/from-as-casing/
'as' and 'FROM' keywords' casing do not match
Dockerfile:1
--------------------
   1 | &gt;&gt;&gt; FROM node:22-alpine as build
   2 |     WORKDIR /app
   3 |     ENV NODE_ENV production
--------------------

WARNING: LegacyKeyValueFormat - https://docs.docker.com/go/dockerfile/rule/legacy-key-value-format/
"ENV key=value" should be used instead of legacy "ENV key value" format
Dockerfile:3
…
WARNING: CopyIgnoredFile - https://docs.docker.com/go/dockerfile/rule/copy-ignored-file/
Attempting to Copy file "secrets.txt" that is excluded by .dockerignore
Dockerfile:5
…
WARNING: JSONArgsRecommended - https://docs.docker.com/go/dockerfile/rule/json-args-recommended/
JSON arguments recommended for CMD to prevent unintended behavior related to OS signals
Dockerfile:9
…</div>
<p>Real output from the course Mac (Engine 29.8) for a nine-line, two-stage Dockerfile with four deliberate mistakes; the output was replaced because an earlier version of this lesson used an older message format and showed <code>UndefinedVar</code> firing for <code>$NPM_TOKEN</code> inside a <code>RUN</code> line — it does not: a <code>RUN</code> command is handed to the shell, so the linter only checks variables used by Dockerfile instructions themselves (<code>COPY $APP_DIR/package.json /app/</code> did produce <code>Usage of undefined variable '$APP_DIR'</code>). Two more things measured: <code>echo $?</code> after the check printed <code>1</code>, so a CI step fails on warnings without extra flags; and a typo <code>COPY --from=biuld</code> stopped the check with <code>… (did you mean build?)</code> — a stage-name typo that would otherwise have tried to pull an image called <code>biuld</code> from Docker Hub.</p>
<p><code>--check</code> runs BuildKit's linter without building anything. It catches undefined variables, legacy syntax, files excluded by <code>.dockerignore</code> that you are trying to <code>COPY</code>, and stage names that do not exist — the class of mistake that produces a working build with a subtly wrong image. It costs nothing and belongs in CI as its own step.</p>

<h3>Parallelism you get for free</h3>
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
RUN npm ci --omit=dev            <span class="tok-comment"># these two stages have no dependency</span>

FROM golang:1.23-alpine AS tools
RUN go install github.com/a/b@latest   <span class="tok-comment"># on each other, so BuildKit</span>

FROM node:22-alpine              <span class="tok-comment"># runs them CONCURRENTLY</span>
COPY --from=deps  /app/node_modules ./node_modules
COPY --from=tools /go/bin/b /usr/local/bin/</code></pre>
<div class="callout ok"><strong>BuildKit builds a graph, not a list.</strong> Stages that do not depend on each other run at the same time, automatically, with no configuration — which is why a well-structured multi-stage Dockerfile is often <em>faster</em> than the single-stage version it replaced, not slower. You can see it in <code>--progress=plain</code>: interleaved step numbers mean parallel execution. The corollary is that adding an unnecessary <code>COPY --from</code> between two stages serialises them, so keep stage dependencies to what you actually need.</div>
<p>Measured on the course Mac: two stages that each run <code>sleep 3</code>, and a final stage that copies from both, built with <code>--no-cache</code> in <strong>3.61 s</strong> wall-clock — not six. In the <code>--progress=plain</code> log, <code>#5 [b 2/2]</code> and <code>#6 [a 2/2]</code> both end with <code>DONE 3.1s</code>, started together.</p>

<h3>The checklist</h3>
<pre><code><span class="tok-comment"># Run this on any slow build before changing anything</span>
echo "== context size ==";     docker build --progress=plain -t x . 2&gt;&amp;1 | grep 'transferring context'
echo "== builder driver ==";   docker buildx inspect | grep -E 'Driver|Platforms'
echo "== arch match ==";       docker version --format '{{.Server.Arch}}'
echo "== warm build ==";       time docker build -q -t x . &gt;/dev/null
echo "== lint ==";             docker build --check -t x . 2&gt;&amp;1 | grep -c WARNING
echo "== cache size ==";       docker builder du | tail -2
echo "== slowest steps ==";    docker build --no-cache --progress=plain -t x . 2&gt;&amp;1 \\
                                 | grep -E '^#[0-9]+ DONE' | sort -t' ' -k3 -hr | head -3</code></pre>
<div class="out">== context size ==
#5 transferring context: 58B done
#6 transferring context: 126B done
== builder driver ==
Driver:        docker
Platforms:        linux/arm64, linux/amd64, linux/amd64/v2, linux/riscv64, linux/ppc64le, linux/s390x, linux/386
== arch match ==
arm64
== warm build ==
docker build -q -t x . &gt; /dev/null  0.10s user 0.09s system 13% cpu 1.390 total
== lint ==
0
== cache size ==
Reclaimable:	40.23GB
Total:		40.23GB
== slowest steps ==
#10 DONE 30.5s
#12 DONE 18.6s
#2 DONE 0.4s</div>
<p>Real output of the checklist on the course Mac, for the 898-package backend (an earlier version showed an invented amd64 run). Read it top to bottom: the context is tiny (the Dockerfile copies only what it needs), the builder is the default <code>docker</code> driver, the machine is <code>arm64</code> (so building <code>--platform linux/amd64</code> here would be emulated), a warm build takes 1.4 s, the linter is clean, the builder holds 40 GB of cache shared with every other project, and a cold build is dominated by <code>npm ci</code> (30.5 s) and exporting the image (18.6 s). Verdict: healthy locally; worth a cache export in CI (5.4) and a smaller final image (Chapter 6).</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the deploy of your group's app "takes forever" and people have started blaming Docker. Before anyone changes a line, produce a one-page diagnosis with numbers.</p><ol>
<li>In your project folder (or <code>~/thu-docker/diag55</code> with the backend from Lesson 5.2), take the three measurements from "Take three measurements" and write the three times down.</li>
<li>Run the checklist from "The checklist" and save its output: <code>… &gt; diag.txt 2&gt;&amp;1</code>.</li>
<li>Sort the <code>DONE</code> lines of a <code>--no-cache --progress=plain</code> build and identify the top two jobs with <code>grep -E '^#(N|M) '</code>.</li>
<li>Match what you see to one of the seven causes, apply that one fix only (not "everything in this chapter"), and repeat step 1.</li></ol>
<p><strong>Done when:</strong> you can state the diagnosis in one sentence ("warm is fast, edit is slow → ordering", or "cold is dominated by exporting a 600 MB image"), the fix you applied changed the number it was supposed to change, and <code>docker build --check .</code> exits with <code>0</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cold / warm build</span><span class="v">Cold: nothing reusable in the cache (<code>--no-cache</code>, a fresh CI runner). Warm: everything cached, nothing changed.</span></div>
  <div class="kv"><span class="k">Wall-clock time</span><span class="v">Real elapsed time — bash's <code>real</code>, zsh's <code>total</code>. The number that matters for waiting.</span></div>
  <div class="kv"><span class="k">Exporting to image</span><span class="v">BuildKit writing the finished layers into Docker's image store. Grows with the size of the final image.</span></div>
  <div class="kv"><span class="k">Emulation</span><span class="v">Running instructions for another CPU (amd64 on an arm64 Mac) through a translator — correct but several times slower.</span></div>
  <div class="kv"><span class="k">Build checks (linter)</span><span class="v"><code>docker build --check</code>: rules that flag suspicious Dockerfile lines without building; exits 1 on warnings.</span></div>
  <div class="kv"><span class="k">Build graph</span><span class="v">BuildKit's view of a Dockerfile as dependencies between steps; unrelated stages run in parallel.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Take three timings — cold, warm, after an edit — before forming an opinion; each pattern points to a different cause.</li>
<li>Sort the <code>DONE</code> lines: on the real backend two jobs (npm ci, exporting the image) were 51 of 52 seconds.</li>
<li>A missing <code>.dockerignore</code> costs most on fresh CI runners (515 MB vs 212 B measured); BuildKit only sends what <code>COPY</code> needs.</li>
<li>Building amd64 on an arm64 Mac is emulation — 9.5× slower on a CPU-bound step.</li>
<li><code>docker build --check</code> is free, exits 1 on warnings and catches stage-name typos; put it in CI.</li>
<li>Independent stages run in parallel: two 3-second stages built in 3.6 s.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/build-checks/" target="_blank" rel="noopener">
  <span class="lc-ico">✔️</span>
  <span class="lc-body"><span class="lc-title">Build checks</span><span class="lc-sub">Every rule <code>docker build --check</code> applies, with an explanation and a fix for each. Adding this as a CI step catches a surprising amount before it ships.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/debug/" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">Debugging builds</span><span class="lc-sub">Including <code>buildx debug --invoke</code>, which drops you into a shell at the exact step that failed — the closest thing Docker has to a debugger for a build.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/multi-stage/#stop-at-a-specific-build-stage" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">--target: build one stage</span><span class="lc-sub">Stopping at a named stage. Invaluable for timing a single stage in isolation, and for shipping a <code>:debug</code> variant of the same Dockerfile.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: find the slow step</span><span class="lc-sub">Graded exercises: take the three measurements and name which cause you have, read a timing list and pick the one step worth optimising, and fix a Dockerfile where the warm build takes forty seconds.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> optimising the step you can see instead of the step that is slow. A Dockerfile with twenty instructions can look inefficient — lots of <code>RUN</code>s, an obviously combinable pair — while 95% of the time is in one <code>npm run build</code>. Merging those <code>RUN</code>s makes the file tidier and the build no faster, and it costs you cache granularity (Lesson 5.2). Measure first: <code>--progress=plain</code>, sort the <code>DONE</code> lines, and only touch what is at the top. The same rule as any performance work, and it is violated constantly with Dockerfiles because they look like something you can eyeball.</div>
<p class="note-ct"><strong>Three things to remember.</strong> There are three different slow builds — cold, warm, and after-an-edit — and each points at a different cause, so take all three timings before forming an opinion. Sort the <code>DONE</code> lines from <code>--progress=plain</code>: usually one or two steps are the whole problem. And <code>docker build --check</code> costs nothing and catches undefined variables, ignored <code>COPY</code> sources and legacy syntax before any of them reach an image.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Chẩn đoán một lượt dựng chậm</h2>
<p class="lead">"Bản dựng chậm" không phải một chẩn đoán. Có BA kiểu chậm khác nhau — nguội, ấm, và sau-một-lần-sửa — với nguyên nhân khác nhau và cách chữa khác nhau, và bạn không biết mình đang có cái nào nếu không ĐO. Bài này là phép đo đó, dấu hiệu nhận biết của bảy nguyên nhân phổ biến, và thứ tự nên kiểm chúng.</p>

<h3>Lấy ba phép đo</h3>
${slide('dk-05', 24, 'Ba phép đo trước khi kết luận: nguội · ấm · sau khi sửa')}
<pre><code><span class="tok-comment"># 1 · Nguội: không có cache nào — thứ CI trải qua trên một máy chạy mới tinh</span>
time docker build --no-cache -q -t app:m . &gt;/dev/null

<span class="tok-comment"># 2 · Ấm: không có gì thay đổi — cái này phải dưới một giây</span>
time docker build -q -t app:m . &gt;/dev/null

<span class="tok-comment"># 3 · Sau một lần sửa mã nguồn — con số bạn sống cùng cả ngày</span>
touch src/index.ts &amp;&amp; echo '// x' &gt;&gt; src/index.ts
time docker build -q -t app:m . &gt;/dev/null</code></pre>
<div class="out">docker build --no-cache -q -t app:m . &gt; /dev/null  0.12s user 0.11s system 0% cpu 51.456 total
docker build -q -t app:m . &gt; /dev/null  0.10s user 0.08s system 7% cpu 2.397 total
docker build -q -t app:m . &gt; /dev/null  0.10s user 0.08s system 8% cpu 2.177 total</div>
<p>Output thật trên máy Mac của khoá (zsh in <code>… total</code> thay cho <code>real</code> của bash), với backend 898 gói, Dockerfile "nhanh" của Bài 5.2 và file vào là JavaScript (<code>src/index.js</code>). Nguội 51 s, ấm 2,4 s, sau khi sửa 2,2 s: đúng dòng đầu của bảng bên dưới — một dự án khoẻ mà lượt chậm duy nhất là lượt nguội. Bản cũ của bài in ở đây 3 phút 41 giây / 0,4 s / 9,1 s làm minh hoạ; các con số trên là đo thật.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Nguội chậm, ấm nhanh, sửa nhanh</span><span class="v">Bình thường và khoẻ mạnh. Thời gian nguội chỉ quan trọng trong CI — hãy sang Bài 5.4 và chia sẻ cái cache.</span></div>
  <div class="kv"><span class="k">Ấm mà chậm (hơn vài giây)</span><span class="v">Có thứ gì đó vô hiệu hoá cache kể cả khi không có gì thay đổi. Thường là một <code>ARG</code> đang đổi, một file bị công cụ nào đó ghi lại, hoặc <code>--pull</code>/<code>--no-cache</code> sót lại trong một script. Hãy kiểm kích thước ngữ cảnh trước.</span></div>
  <div class="kv"><span class="k">Sửa thì chậm nhưng ấm thì nhanh</span><span class="v">Thứ tự. Mã nguồn của bạn được chép quá sớm, nên một thay đổi mã nguồn vô hiệu hoá lượt cài thư viện (Bài 5.2). Trường hợp phổ biến nhất và dễ sửa nhất.</span></div>
  <div class="kv"><span class="k">Cả ba đều chậm</span><span class="v">Có gì đó sai NGOÀI cái cache: một ngữ cảnh khổng lồ, mô phỏng, một ảnh nền quá lớn, hoặc một bước thật sự chậm. Những mốc thời gian ở dưới sẽ gọi tên nó ra.</span></div>
</div>

<h3>Tìm ra cái bước đắt tiền</h3>
${slide('dk-05', 25, 'Sắp dòng DONE theo giây: thường một bước là cả vấn đề')}
<pre><code>docker build --no-cache --progress=plain -t app:m . 2&gt;&amp;1 \\
  | grep -E '^#[0-9]+ (DONE|CACHED)' \\
  | sort -t' ' -k3 -hr | head -8</code></pre>
<div class="out">#10 DONE 29.6s
#12 DONE 21.6s
#2 DONE 0.4s
#4 DONE 0.3s
#11 DONE 0.2s
#9 DONE 0.0s
#8 CACHED
#7 DONE 0.0s</div>
<pre><code><span class="tok-comment"># #10 và #12 là việc gì?</span>
docker build --no-cache --progress=plain -t app:m . 2&gt;&amp;1 | grep -E '^#(10|12) (\\[|exporting to image$)'</code></pre>
<div class="out">#10 [4/5] RUN npm ci --omit=dev --ignore-scripts
#12 exporting to image</div>
<p>Hai việc chiếm 51 trong tổng số 52 giây. Mọi thứ khác là con số làm tròn, và tối ưu chúng là công sức đổ đi — và đó chính xác là lý do bạn ĐO trước khi đổi bất cứ thứ gì. (Bản cũ của bài in ở đây một danh sách ba phút bịa làm minh hoạ; các dòng trên là thật, từ máy Mac của khoá.)</p>
<div class="callout"><strong>Điều bất ngờ trong danh sách này là #12.</strong> <code>exporting to image</code> không phải chỉ thị của bạn: đó là BuildKit ghi các tầng đã dựng xong vào kho ảnh của Docker — trong log đầy đủ là <code>exporting layers 16.4s</code> rồi <code>unpacking … 5.1s</code>, tổng 21,6 s, vì ảnh một stage này mang theo toàn bộ <code>node_modules</code>. Bản hai stage của cùng backend (stage cuối chỉ chép <code>dist/</code>) xuất trong 0,1 s. Ảnh cuối to thì tốn THỜI GIAN ở mọi lượt dựng, không chỉ tốn đĩa — thêm một lý do cho Chương 6.</div>

<h3>Bảy nguyên nhân và dấu hiệu của chúng</h3>
${slide('dk-05', 26, 'Bảy nguyên nhân dựng chậm và dấu hiệu của từng cái')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Một ngữ cảnh dựng khổng lồ</span><span class="lz-t">dấu hiệu: "transferring context: 412.7MB"</span><span class="lz-d">Vài giây TRƯỚC KHI có chỉ thị nào chạy, ở mọi lượt dựng. Gần như luôn là <code>node_modules</code>, <code>.git</code>, hay một thư mục <code>dist/</code> còn sót. Cách chữa: <code>.dockerignore</code> (Bài 4.1).</span></div>
  <div class="lz-step"><span class="lz-k">2 · COPY . . đứng trên lượt cài</span><span class="lz-t">dấu hiệu: dựng ấm thì nhanh, dựng sau khi sửa thì chậm</span><span class="lz-d">Bước cài thư viện chạy lại ở mọi thay đổi mã nguồn. Cách chữa: chép file khai báo trước (Bài 5.2). Đây là nguyên nhân phổ biến nhất.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Không có cache mount cho lượt cài</span><span class="lz-t">dấu hiệu: thêm MỘT thư viện là tải lại TẤT CẢ</span><span class="lz-d">Cách chữa: <code>RUN --mount=type=cache,target=/root/.npm</code> (Bài 5.3).</span></div>
  <div class="lz-step"><span class="lz-k">4 · Một ARG hay một file đổi ở mọi lượt dựng</span><span class="lz-t">dấu hiệu: dựng ấm mà vẫn chậm, dù chẳng có gì đổi</span><span class="lz-d">Một tham số <code>BUILD_DATE</code>, một <code>.env</code> do CI sinh ra, một dấu phiên bản. Cách chữa: dời nó XUỐNG DƯỚI những bước đắt tiền, hoặc ra khỏi ngữ cảnh.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Mô phỏng</span><span class="lz-t">dấu hiệu: chậm gấp 5–20 lần so với cùng lượt dựng trên máy khác</span><span class="lz-d">Hãy đối chiếu <code>docker version --format '{{.Server.Arch}}'</code> với nền tảng của cái ảnh. Cách chữa: dựng native hoặc biên dịch chéo (Bài 3.4).</span></div>
  <div class="lz-step"><span class="lz-k">6 · --pull hay --no-cache sót trong một script</span><span class="lz-t">dấu hiệu: mọi lượt dựng đều là dựng nguội</span><span class="lz-d">Có ai đó thêm nó vào để chữa một vấn đề cache cũ hồi 2024 và nó không bao giờ được gỡ ra. Cách chữa: bỏ nó đi, và chỉ giữ <code>--pull</code> cho lượt dựng lại theo lịch.</span></div>
  <div class="lz-step"><span class="lz-k">7 · Cái bước đó thật sự chậm</span><span class="lz-t">dấu hiệu: một dòng DONE duy nhất áp đảo bảng thời gian</span><span class="lz-d">Một lượt build webpack, một lượt biên dịch Rust, một bộ test chạy trong ảnh. Cách chữa: đó là vấn đề của ỨNG DỤNG chứ không phải của Docker — nhưng một cache mount cho chính thư mục cache của nó thường giúp rất nhiều.</span></div>
</div>

<h3>Hai nguyên nhân NGOÀI cache, đo thật: kích thước ngữ cảnh và giả lập kiến trúc</h3>
${slide('dk-05', 27, 'Ngữ cảnh 515 MB và giả lập amd64, đo thật')}
<p>Nguyên nhân 1 và 5 ở trên là hai cái người ta hay cãi nhau nhất, nên cả hai đã được đo trên máy Mac của khoá. <strong>Ngữ cảnh:</strong> thư mục backend có <code>node_modules</code> thật (590 MB sau <code>npm ci</code>) và KHÔNG có <code>.dockerignore</code>, dựng bằng một Dockerfile <code>COPY . .</code> trên builder mới tinh:</p>
<div class="out">#8 transferring context: 515.15MB 7.7s done          <span class="tok-comment">← không có .dockerignore</span>
#7 transferring context: 212B 0.5s done              <span class="tok-comment">← đã bỏ node_modules và .git</span></div>
<p>Hai chi tiết sửa lại câu chuyện đơn giản. BuildKit chỉ gửi những file mà <code>COPY</code> THẬT SỰ cần: với Dockerfile "nhanh" (<code>COPY package*.json</code> + <code>COPY src</code>), cùng thư mục bừa bộn đó chỉ gửi 437 kB, vì <code>node_modules</code> không bao giờ được nhắc tới. Và trên một builder đã từng thấy thư mục đó, chỉ PHẦN THAY ĐỔI được gửi — lượt dựng <code>COPY . .</code> thứ hai gửi 3,03 MB trong 1,1 s. Nên thiếu <code>.dockerignore</code> gây hại nhiều nhất đúng ở chỗ bạn không nhìn thấy: trên máy CI mới tinh, lần nào cũng thế. <strong>Giả lập:</strong> một bước ăn CPU (một vòng lặp Node 2×10⁸ lần), <code>--no-cache</code>, đo hai lần mỗi nền tảng:</p>
<div class="out">docker build --platform linux/arm64 …   #5 DONE 0.4s
docker build --platform linux/amd64 …   #5 DONE 3.8s</div>
<p>Chậm 9,5 lần, trên một con M1 Max, cho đúng nền tảng mà VPS của bạn chạy. <code>docker version --format '{{.Server.Arch}}'</code> in <code>arm64</code> trên Mac, nên mọi ảnh amd64 dựng ở đó đều là giả lập. Bước phụ thuộc mạng như <code>npm ci</code> chịu thiệt ít hơn nhiều so với trình biên dịch và bundler — đó là lý do "chỉ dựng trên Mac mới chậm" rất hay là một lệnh <code>next build</code> hay một module native đang biên dịch dưới giả lập.</p>

<h3>docker build --check</h3>
${slide('dk-05', 28, 'build --check bắt lỗi không cần dựng; stage độc lập chạy song song')}
<pre><code>docker build --check -t app:m . 2&gt;&amp;1 | head -20</code></pre>
<div class="out">Check complete, 4 warnings have been found!

WARNING: FromAsCasing - https://docs.docker.com/go/dockerfile/rule/from-as-casing/
'as' and 'FROM' keywords' casing do not match
Dockerfile:1
--------------------
   1 | &gt;&gt;&gt; FROM node:22-alpine as build
   2 |     WORKDIR /app
   3 |     ENV NODE_ENV production
--------------------

WARNING: LegacyKeyValueFormat - https://docs.docker.com/go/dockerfile/rule/legacy-key-value-format/
"ENV key=value" should be used instead of legacy "ENV key value" format
Dockerfile:3
…
WARNING: CopyIgnoredFile - https://docs.docker.com/go/dockerfile/rule/copy-ignored-file/
Attempting to Copy file "secrets.txt" that is excluded by .dockerignore
Dockerfile:5
…
WARNING: JSONArgsRecommended - https://docs.docker.com/go/dockerfile/rule/json-args-recommended/
JSON arguments recommended for CMD to prevent unintended behavior related to OS signals
Dockerfile:9
…</div>
<p>Output thật từ máy Mac của khoá (Engine 29.8) cho một Dockerfile chín dòng, hai stage, có bốn lỗi cố ý; output được thay vì bản cũ của bài dùng định dạng thông báo cũ và cho thấy <code>UndefinedVar</code> báo cho <code>$NPM_TOKEN</code> bên trong một dòng <code>RUN</code> — thực tế KHÔNG: câu lệnh của <code>RUN</code> được giao cho shell, nên bộ soát lỗi chỉ kiểm những biến mà CHÍNH chỉ thị Dockerfile dùng (<code>COPY $APP_DIR/package.json /app/</code> thì có ra <code>Usage of undefined variable '$APP_DIR'</code>). Đo thêm hai điều: <code>echo $?</code> sau lượt kiểm in <code>1</code>, nên một bước CI tự đỏ khi có cảnh báo mà không cần cờ gì thêm; và gõ nhầm <code>COPY --from=biuld</code> làm lượt kiểm dừng với <code>… (did you mean build?)</code> — một lỗi gõ tên stage mà nếu không thì Docker sẽ đi kéo một ảnh tên <code>biuld</code> từ Docker Hub.</p>
<p><code>--check</code> chạy bộ soát lỗi của BuildKit mà KHÔNG dựng gì cả. Nó bắt được biến chưa định nghĩa, cú pháp cũ, những file bị <code>.dockerignore</code> loại ra mà bạn đang cố <code>COPY</code>, và những tên stage không tồn tại — lớp sai lầm tạo ra một lượt dựng chạy được với một cái ảnh sai một cách tinh vi. Nó không tốn gì và xứng đáng là một bước riêng trong CI.</p>

<h3>Chạy song song bạn được tặng miễn phí</h3>
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
RUN npm ci --omit=dev            <span class="tok-comment"># hai stage này không phụ thuộc</span>

FROM golang:1.23-alpine AS tools
RUN go install github.com/a/b@latest   <span class="tok-comment"># vào nhau, nên BuildKit</span>

FROM node:22-alpine              <span class="tok-comment"># chạy chúng SONG SONG</span>
COPY --from=deps  /app/node_modules ./node_modules
COPY --from=tools /go/bin/b /usr/local/bin/</code></pre>
<div class="callout ok"><strong>BuildKit dựng một ĐỒ THỊ, không phải một danh sách.</strong> Những stage không phụ thuộc vào nhau thì chạy CÙNG LÚC, tự động, không cần cấu hình gì — và đó là lý do một Dockerfile nhiều tầng có cấu trúc tốt thường <em>NHANH HƠN</em> bản một tầng mà nó thay thế, chứ không chậm hơn. Bạn thấy được điều đó trong <code>--progress=plain</code>: số hiệu các bước đan xen nhau nghĩa là đang chạy song song. Hệ quả là thêm một lệnh <code>COPY --from</code> không cần thiết giữa hai stage sẽ ép chúng chạy tuần tự, nên hãy giữ quan hệ phụ thuộc giữa các stage đúng ở mức bạn thật sự cần.</div>
<p>Đo trên máy Mac của khoá: hai stage mỗi cái chạy <code>sleep 3</code>, và một stage cuối chép từ cả hai, dựng với <code>--no-cache</code> hết <strong>3,61 s</strong> thời gian thực — không phải sáu. Trong log <code>--progress=plain</code>, <code>#5 [b 2/2]</code> và <code>#6 [a 2/2]</code> cùng kết thúc bằng <code>DONE 3.1s</code>, bắt đầu cùng lúc.</p>

<h3>Danh sách kiểm</h3>
<pre><code><span class="tok-comment"># Chạy cái này trên bất kỳ lượt dựng chậm nào TRƯỚC KHI đổi gì</span>
echo "== kích thước ngữ cảnh ==";  docker build --progress=plain -t x . 2&gt;&amp;1 | grep 'transferring context'
echo "== trình dựng ==";           docker buildx inspect | grep -E 'Driver|Platforms'
echo "== khớp kiến trúc ==";       docker version --format '{{.Server.Arch}}'
echo "== dựng ấm ==";              time docker build -q -t x . &gt;/dev/null
echo "== soát lỗi ==";             docker build --check -t x . 2&gt;&amp;1 | grep -c WARNING
echo "== kích thước cache ==";     docker builder du | tail -2
echo "== bước chậm nhất ==";       docker build --no-cache --progress=plain -t x . 2&gt;&amp;1 \\
                                     | grep -E '^#[0-9]+ DONE' | sort -t' ' -k3 -hr | head -3</code></pre>
<div class="out">== kích thước ngữ cảnh ==
#5 transferring context: 58B done
#6 transferring context: 126B done
== trình dựng ==
Driver:        docker
Platforms:        linux/arm64, linux/amd64, linux/amd64/v2, linux/riscv64, linux/ppc64le, linux/s390x, linux/386
== khớp kiến trúc ==
arm64
== dựng ấm ==
docker build -q -t x . &gt; /dev/null  0.10s user 0.09s system 13% cpu 1.390 total
== soát lỗi ==
0
== kích thước cache ==
Reclaimable:	40.23GB
Total:		40.23GB
== bước chậm nhất ==
#10 DONE 30.5s
#12 DONE 18.6s
#2 DONE 0.4s</div>
<p>Output thật của danh sách kiểm trên máy Mac của khoá, với backend 898 gói (bản cũ in một lượt chạy amd64 bịa). Đọc từ trên xuống: ngữ cảnh tí hon (Dockerfile chỉ chép thứ nó cần), builder là trình <code>docker</code> mặc định, máy là <code>arm64</code> (nên dựng <code>--platform linux/amd64</code> ở đây sẽ là giả lập), dựng ấm mất 1,4 s, bộ soát lỗi sạch, builder đang giữ 40 GB cache dùng chung với mọi dự án khác, và một lượt nguội bị <code>npm ci</code> (30,5 s) cùng việc xuất ảnh (18,6 s) chiếm trọn. Kết luận: ở máy thì khoẻ; đáng thêm xuất cache trong CI (5.4) và một ảnh cuối nhỏ hơn (Chương 6).</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bản deploy app của nhóm "lâu như vô tận" và mọi người bắt đầu đổ tại Docker. Trước khi ai đụng vào dòng nào, hãy làm một bản chẩn đoán một trang, có SỐ ĐO.</p><ol>
<li>Trong thư mục dự án của bạn (hoặc <code>~/thu-docker/diag55</code> với backend của Bài 5.2), lấy ba phép đo của mục "Lấy ba phép đo" và ghi lại ba con số.</li>
<li>Chạy danh sách kiểm của mục "Danh sách kiểm" và lưu output: <code>… &gt; diag.txt 2&gt;&amp;1</code>.</li>
<li>Sắp xếp các dòng <code>DONE</code> của một lượt <code>--no-cache --progress=plain</code> và gọi tên hai việc đứng đầu bằng <code>grep -E '^#(N|M) '</code>.</li>
<li>Khớp thứ bạn thấy với một trong bảy nguyên nhân, áp ĐÚNG MỘT cách chữa (không phải "mọi thứ trong chương"), rồi làm lại bước 1.</li></ol>
<p><strong>Đạt khi:</strong> bạn nói được chẩn đoán trong một câu ("ấm nhanh, sửa thì chậm → thứ tự", hay "lượt nguội bị việc xuất một ảnh 600 MB chiếm"), cách chữa bạn áp làm đổi đúng con số mà nó phải đổi, và <code>docker build --check .</code> thoát với <code>0</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cold / warm build (dựng nguội / ấm)</span><span class="v">Nguội: cache không có gì dùng lại được (<code>--no-cache</code>, máy CI mới). Ấm: mọi thứ có cache, không gì đổi.</span></div>
  <div class="kv"><span class="k">Wall-clock time (thời gian thực)</span><span class="v">Thời gian trôi qua thật — <code>real</code> của bash, <code>total</code> của zsh. Con số quyết định bạn phải chờ bao lâu.</span></div>
  <div class="kv"><span class="k">Exporting to image (xuất ra ảnh)</span><span class="v">BuildKit ghi các tầng đã dựng vào kho ảnh của Docker. Lớn dần theo kích thước ảnh cuối.</span></div>
  <div class="kv"><span class="k">Emulation (giả lập)</span><span class="v">Chạy lệnh của một loại CPU khác (amd64 trên Mac arm64) qua bộ phiên dịch — đúng nhưng chậm gấp nhiều lần.</span></div>
  <div class="kv"><span class="k">Build checks — linter (bộ soát lỗi)</span><span class="v"><code>docker build --check</code>: các luật đánh dấu dòng Dockerfile đáng ngờ mà không dựng; thoát mã 1 khi có cảnh báo.</span></div>
  <div class="kv"><span class="k">Build graph (đồ thị dựng)</span><span class="v">Cách BuildKit nhìn Dockerfile: quan hệ phụ thuộc giữa các bước; stage không liên quan chạy song song.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lấy ba con số — nguội, ấm, sau khi sửa — trước khi kết luận; mỗi kiểu chỉ vào một nguyên nhân khác nhau.</li>
<li>Sắp các dòng <code>DONE</code>: trên backend thật, hai việc (npm ci, xuất ảnh) chiếm 51 trên 52 giây.</li>
<li>Thiếu <code>.dockerignore</code> thiệt nhất trên máy CI mới (đo 515 MB so với 212 B); BuildKit chỉ gửi thứ <code>COPY</code> cần.</li>
<li>Dựng amd64 trên Mac arm64 là giả lập — chậm 9,5 lần ở một bước ăn CPU.</li>
<li><code>docker build --check</code> không tốn gì, thoát mã 1 khi có cảnh báo và bắt được lỗi gõ tên stage; hãy đưa vào CI.</li>
<li>Stage độc lập chạy song song: hai stage 3 giây dựng xong trong 3,6 s.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/build-checks/" target="_blank" rel="noopener">
  <span class="lc-ico">✔️</span>
  <span class="lc-body"><span class="lc-title">Build checks</span><span class="lc-sub">Mọi luật mà <code>docker build --check</code> áp dụng, kèm giải thích và cách chữa cho từng cái. Thêm nó làm một bước CI bắt được nhiều thứ đến bất ngờ trước khi chúng lên production.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/debug/" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">Gỡ lỗi bản dựng</span><span class="lc-sub">Gồm cả <code>buildx debug --invoke</code>, thứ thả bạn vào một cái shell ngay tại bước vừa hỏng — thứ gần nhất với một trình gỡ lỗi cho một lượt dựng mà Docker có.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/multi-stage/#stop-at-a-specific-build-stage" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">--target: dựng đúng một stage</span><span class="lc-sub">Dừng lại ở một stage có tên. Vô giá để bấm giờ một stage riêng lẻ, và để đem đi một biến thể <code>:debug</code> từ cùng một Dockerfile.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: tìm ra cái bước chậm</span><span class="lc-sub">Bài chấm điểm: lấy ba phép đo rồi gọi tên nguyên nhân bạn đang gặp, đọc một bảng thời gian rồi chọn ĐÚNG MỘT bước đáng tối ưu, và sửa một Dockerfile mà lượt dựng ấm mất bốn mươi giây.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> tối ưu cái bước bạn NHÌN THẤY thay vì cái bước đang chậm. Một Dockerfile có hai mươi chỉ thị trông có vẻ kém hiệu quả — lắm lệnh <code>RUN</code>, một cặp rõ ràng là gộp được — trong khi 95% thời gian nằm ở đúng một lệnh <code>npm run build</code>. Gộp mấy cái <code>RUN</code> đó làm file gọn hơn và lượt dựng KHÔNG nhanh hơn, còn bạn thì mất độ mịn của cache (Bài 5.2). Hãy đo trước: <code>--progress=plain</code>, sắp xếp các dòng <code>DONE</code>, và chỉ đụng vào thứ nằm trên cùng. Vẫn là cái luật của mọi công việc tối ưu hiệu năng, và nó bị vi phạm liên tục với Dockerfile vì chúng TRÔNG như thứ liếc mắt là thấy.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Có BA kiểu dựng chậm — nguội, ấm, và sau-một-lần-sửa — và mỗi kiểu chỉ vào một nguyên nhân khác nhau, nên hãy lấy đủ cả ba phép đo trước khi hình thành ý kiến. Hãy sắp xếp các dòng <code>DONE</code> từ <code>--progress=plain</code>: thường chỉ một hai bước là toàn bộ vấn đề. Và <code>docker build --check</code> không tốn gì mà bắt được biến chưa định nghĩa, nguồn <code>COPY</code> bị bỏ qua và cú pháp cũ trước khi chúng kịp tới một cái ảnh.</p>
</div>
`,
    },
    /* ─────────────────────────── 5.6 ─────────────────────────── */
    {
      title: '5.6 — Quiz: cache and fast builds|||5.6 — Kiểm tra: cache và dựng nhanh',
      slug: 'dk-5-6-quiz',
      type: 'QUIZ',
      description: 'Mười tình huống thật về cache lúc dựng: README làm npm ci chạy lại, touch và mtime, ARG khai ở đầu, apt-get 404, dist/ trong cache mount, cache mount khi đổi thư viện, EACCES dưới USER node, mode=min trong CI, driver docker của Docker 29 xuất cache, và dựng amd64 trên Mac.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from real builds — every one of them is decided by the same rule: a step's key contains the key of the step before it. Several numbers in the questions are the ones measured in this chapter on the course Mac. Read the explanation after submitting, especially for questions you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can predict, before building, which steps will say <code>CACHED</code> after a given edit — and name the rule (content, command string, cascade, ARG).</li>
<li>I can reorder a Node/Prisma Dockerfile so a source edit no longer re-runs <code>npm ci</code>, and prove it with <code>--progress=plain</code>.</li>
<li>I know what a cache mount makes cheaper, what it must never contain, and why a <code>USER node</code> step needs <code>uid</code>/<code>gid</code>.</li>
<li>I can simulate a fresh CI runner with two builders and <code>type=local</code>, and explain why multi-stage needs <code>mode=max</code>.</li>
<li>I take cold, warm and after-edit timings and sort the <code>DONE</code> lines before changing anything.</li>
<li>I can tell a cache problem from a non-cache one: context size, emulation, a big final image, or a genuinely slow step.</li>
</ul>
${slide('dk-05', 30, 'Bảng tra nhanh Chương 5')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống từ những lượt dựng thật — câu nào cũng được quyết định bởi cùng một luật: khoá của một bước chứa khoá của bước trước nó. Vài con số trong câu hỏi chính là số đã đo trong chương này trên máy Mac của khoá. Đọc phần giải thích sau khi nộp, nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đoán được, TRƯỚC khi dựng, bước nào sẽ in <code>CACHED</code> sau một cú sửa — và gọi tên luật quyết định (nội dung, chuỗi lệnh, lan xuống, ARG).</li>
<li>Tôi sắp lại được một Dockerfile Node/Prisma để sửa mã không còn chạy lại <code>npm ci</code>, và chứng minh bằng <code>--progress=plain</code>.</li>
<li>Tôi biết cache mount làm rẻ đi thứ gì, thứ gì KHÔNG được nằm trong nó, và vì sao bước <code>USER node</code> cần <code>uid</code>/<code>gid</code>.</li>
<li>Tôi giả lập được một máy CI mới tinh bằng hai builder và <code>type=local</code>, và giải thích được vì sao nhiều stage cần <code>mode=max</code>.</li>
<li>Tôi lấy ba con số nguội, ấm, sau-khi-sửa và sắp các dòng <code>DONE</code> trước khi đổi bất cứ thứ gì.</li>
<li>Tôi phân biệt được vấn đề cache với vấn đề ngoài cache: kích thước ngữ cảnh, giả lập kiến trúc, ảnh cuối to, hay một bước thật sự chậm.</li>
</ul>
${slide('dk-05', 30, 'Bảng tra nhanh Chương 5')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'A teammate fixes a typo in README.md and the next docker build spends two minutes in RUN npm ci. The Dockerfile is FROM → WORKDIR → COPY . . → RUN npm ci → CMD. What is going on?|||Một bạn sửa lỗi chính tả trong README.md và lượt docker build kế tiếp mất hai phút ở RUN npm ci. Dockerfile là FROM → WORKDIR → COPY . . → RUN npm ci → CMD. Chuyện gì đang xảy ra?',
            options: [
              'BuildKit compares modification times, and editing any file makes every later step look new|||BuildKit so sánh giờ sửa file, và sửa file nào cũng làm mọi bước sau trông như mới',
              'npm ci never uses the build cache, so it runs on every build no matter what changed|||npm ci không bao giờ dùng cache dựng, nên nó chạy ở mọi lượt bất kể đổi gì',
              'COPY . . hashes every file in the context, README included; its key changed and the miss cascaded to npm ci|||COPY . . băm mọi file trong ngữ cảnh, gồm cả README; khoá của nó đổi và cú trượt lan xuống npm ci',
              'The README is larger than the build context limit, so BuildKit had to fall back to a full rebuild|||README lớn hơn giới hạn ngữ cảnh dựng, nên BuildKit phải lùi về dựng lại toàn bộ',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: COPY is keyed on the contents of everything it copies, and COPY . . copies the README too. A different key at step 3 means steps 4 and 5 miss as well. Copy package.json + lockfile, run npm ci, then copy the source. The mtime option is the tempting one, but BuildKit ignores modification times: touch app.js changes nothing (measured: 5 CACHED before and after).|||VI: COPY khoá theo nội dung của mọi thứ nó chép, và COPY . . chép cả README. Khoá bước 3 đổi thì bước 4 và 5 cũng trượt. Hãy chép package.json + lockfile, chạy npm ci, rồi mới chép mã. Phương án giờ sửa file nghe hợp lý nhất, nhưng BuildKit bỏ qua giờ sửa: touch app.js không đổi gì (đo thật: 5 dòng CACHED trước và sau).',
          },
          {
            question: 'In the Chapter 5 demo you run touch app.js (no content change) and build again. Which steps re-run?|||Trong ví dụ Chương 5, bạn chạy touch app.js (không đổi nội dung) rồi dựng lại. Bước nào chạy lại?',
            options: [
              'None — COPY is keyed on file contents, not modification time, so every step is still CACHED|||Không bước nào — COPY khoá theo nội dung file chứ không theo giờ sửa, nên mọi bước vẫn CACHED',
              'Only COPY app.js, because its modification time is part of the COPY cache key|||Chỉ COPY app.js, vì giờ sửa của nó là một phần khoá cache của COPY',
              'Everything from FROM down, because touching a file invalidates the whole build context|||Mọi thứ từ FROM trở xuống, vì touch một file làm hỏng cả ngữ cảnh dựng',
              'Only CMD, because metadata instructions are always re-evaluated on every build|||Chỉ CMD, vì chỉ thị siêu dữ liệu luôn được tính lại ở mọi lượt dựng',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: COPY and ADD hash file contents plus path and mode; the old builder looked at mtime, BuildKit does not. Measured on the course Mac: grep -c CACHED printed 5 after touch and 4 after appending one byte. The COPY-only option is what people expect from the legacy builder — it is wrong for BuildKit.|||VI: COPY và ADD băm nội dung file cộng đường dẫn và quyền; bộ dựng cũ nhìn mtime, BuildKit thì không. Đo trên máy Mac của khoá: grep -c CACHED in 5 sau touch và 4 sau khi thêm một byte. Phương án "chỉ COPY app.js" là điều người ta quen từ bộ dựng cũ — sai với BuildKit.',
          },
          {
            question: 'Your CI passes --build-arg BUILD_DATE=$(date) and the Dockerfile declares ARG BUILD_DATE right under FROM; only the last line, LABEL built=$BUILD_DATE, uses it. What happens on every CI build?|||CI của bạn truyền --build-arg BUILD_DATE=$(date) và Dockerfile khai ARG BUILD_DATE ngay dưới FROM; chỉ dòng cuối LABEL built=$BUILD_DATE dùng nó. Chuyện gì xảy ra ở mọi lượt dựng CI?',
            options: [
              'Nothing extra — an ARG only invalidates the lines that actually reference the variable|||Không có gì thêm — ARG chỉ làm hỏng những dòng thật sự nhắc tới biến đó',
              'Every step including FROM re-runs, because build arguments are part of the base image key|||Mọi bước kể cả FROM chạy lại, vì tham số dựng là một phần khoá của ảnh nền',
              'Only the LABEL line changes, because COPY and RUN steps never see build arguments|||Chỉ dòng LABEL đổi, vì các bước COPY và RUN không bao giờ thấy tham số dựng',
              'Every RUN after the ARG re-runs (the ARG is in its environment) — move the ARG just above the LABEL|||Mọi RUN sau ARG chạy lại (ARG nằm trong môi trường của nó) — dời ARG xuống ngay trên LABEL',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: BuildKit exposes declared ARGs to every later RUN, so their keys change even when the command never mentions the variable. Measured: WORKDIR and COPY stayed CACHED, RUN npm ci ran again (DONE 1.1s) and COPY app.js followed by cascade. "Only lines that reference it" is true for COPY/WORKDIR but not for RUN — that is the trap.|||VI: BuildKit đưa mọi ARG đã khai vào các RUN phía sau, nên khoá của chúng đổi dù câu lệnh chẳng nhắc tới biến. Đo thật: WORKDIR và COPY vẫn CACHED, RUN npm ci chạy lại (DONE 1.1s) và COPY app.js trượt theo. "Chỉ những dòng nhắc tới biến" đúng với COPY/WORKDIR nhưng sai với RUN — đó chính là cái bẫy.',
          },
          {
            question: 'You add git to RUN apt-get install -y curl git. The line above is a separate RUN apt-get update. The build fails with 404 Not Found on a package; the network is fine. Why?|||Bạn thêm git vào RUN apt-get install -y curl git. Dòng phía trên là một RUN apt-get update riêng. Lượt dựng hỏng với 404 Not Found cho một gói; mạng vẫn ổn. Vì sao?',
            options: [
              'Debian removed git from its repositories, so the package really no longer exists|||Debian đã gỡ git khỏi kho, nên gói đó thật sự không còn nữa',
              'RUN apt-get update has a fixed command string, so its weeks-old index stayed cached while install ran|||RUN apt-get update có chuỗi lệnh cố định, nên danh mục cũ hàng tuần vẫn nằm trong cache khi install chạy',
              'apt needs sharing=locked on the layer, otherwise two RUN lines corrupt the package lists|||apt cần sharing=locked trên tầng, không thì hai dòng RUN làm hỏng danh mục gói',
              'The Docker Hub rate limit blocks apt downloads after too many builds in one day|||Giới hạn tần suất của Docker Hub chặn apt tải về sau quá nhiều lượt dựng trong ngày',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: RUN is keyed on its command string, which never changes for apt-get update, so the cached result — an old package index — is reused and points at versions that were since replaced. Put update and install in one RUN. sharing=locked is a real option, but for cache mounts shared between concurrent builds, not for layers.|||VI: RUN khoá theo chuỗi lệnh, mà với apt-get update thì chuỗi đó không bao giờ đổi, nên kết quả trong cache — một danh mục gói cũ — được dùng lại và trỏ tới những phiên bản đã bị thay. Hãy để update và install trong CÙNG một RUN. sharing=locked là tuỳ chọn có thật, nhưng dành cho cache mount dùng chung giữa các lượt dựng song song, không phải cho tầng.',
          },
          {
            question: 'To speed things up you write RUN --mount=type=cache,target=/app/dist npm run build. The build is green, but the container exits at once with Cannot find module /app/dist/index.js. What is wrong?|||Để nhanh hơn, bạn viết RUN --mount=type=cache,target=/app/dist npm run build. Lượt dựng xanh, nhưng container thoát ngay với Cannot find module /app/dist/index.js. Sai ở đâu?',
            options: [
              'The mount needs sharing=locked so two builds do not overwrite each other’s dist folder|||Mount cần sharing=locked để hai lượt dựng không ghi đè thư mục dist của nhau',
              'The mount needs uid=1000,gid=1000, otherwise npm run build cannot write its output there|||Mount cần uid=1000,gid=1000, không thì npm run build không ghi được output vào đó',
              'Nothing in a cache mount becomes part of a layer, so dist/ is empty in the image — write it to a normal path|||Không gì trong cache mount thành tầng, nên dist/ rỗng trong ảnh — hãy ghi nó vào đường dẫn bình thường',
              'The build cache kept an old dist/ from a previous build; rebuild once with --no-cache to refresh it|||Cache dựng giữ một dist/ cũ từ lượt trước; dựng lại một lần với --no-cache để làm mới',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: A cache mount exists only while that RUN executes. Reproduced in the chapter: inside the step ls showed index.js, one step later /app/dist did not exist. Cache mounts are for inputs you would otherwise re-download (~/.npm). --no-cache would not help — the output would vanish the same way.|||VI: Cache mount chỉ tồn tại trong lúc lệnh RUN đó chạy. Đã tái hiện trong chương: bên trong bước, ls thấy index.js; sang bước sau, /app/dist không tồn tại. Cache mount dành cho đầu vào mà nếu không thì phải tải lại (~/.npm). --no-cache không giúp gì — output vẫn biến mất y như thế.',
          },
          {
            question: 'Your Dockerfile is already ordered correctly (manifests, npm ci, then source). What does adding --mount=type=cache,target=/root/.npm to the npm ci line change?|||Dockerfile của bạn đã sắp đúng thứ tự (file khai báo, npm ci, rồi mã). Thêm --mount=type=cache,target=/root/.npm vào dòng npm ci làm thay đổi gì?',
            options: [
              'When package.json changes, npm ci still runs but reuses downloaded tarballs — 63 s became 9 s in the chapter|||Khi package.json đổi, npm ci vẫn chạy nhưng dùng lại gói đã tải — trong chương 63 s còn 9 s',
              'npm ci is skipped on every future build, even when package.json and the lockfile change|||npm ci được bỏ qua ở mọi lượt sau, kể cả khi package.json và lockfile đổi',
              'node_modules moves out of the image into the cache, so the final image becomes much smaller|||node_modules chuyển ra khỏi ảnh vào cache, nên ảnh cuối nhỏ đi rất nhiều',
              'The npm cache is exported with --cache-to, so fresh CI runners also skip the downloads|||Bộ đệm npm được xuất cùng --cache-to, nên máy CI mới tinh cũng khỏi phải tải',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Ordering makes a miss rare; a cache mount makes a miss cheap. On a source edit npm ci is already CACHED, so the mount changes nothing there; when the manifest changes, npm ci runs but copies tarballs locally (measured 63.4 s → 9.3 s on 898 packages). The CI option is the tempting one: cache mounts are builder-local and are NOT exported by --cache-to.|||VI: Thứ tự làm cú trượt hiếm; cache mount làm cú trượt rẻ. Khi sửa mã, npm ci vốn đã CACHED nên mount không đổi gì ở đó; khi file khai báo đổi, npm ci chạy nhưng chép gói từ máy (đo 63,4 s → 9,3 s với 898 gói). Phương án CI là cái hấp dẫn nhất: cache mount chỉ nằm trong builder và KHÔNG được --cache-to xuất ra.',
          },
          {
            question: 'A step running as USER node uses RUN --mount=type=cache,target=/home/node/.npm npm ci and fails with npm error code EACCES … Your cache folder contains root-owned files. What is the right fix?|||Một bước chạy bằng USER node dùng RUN --mount=type=cache,target=/home/node/.npm npm ci và hỏng với npm error code EACCES … Your cache folder contains root-owned files. Cách sửa đúng là gì?',
            options: [
              'Add RUN sudo chown -R 1000:1000 /home/node/.npm before the install, as npm suggests|||Thêm RUN sudo chown -R 1000:1000 /home/node/.npm trước bước cài, đúng như npm gợi ý',
              'Downgrade npm, because the message says a bug in older npm versions created the files|||Hạ phiên bản npm, vì thông báo nói con bọ của npm bản cũ đã tạo ra các file đó',
              'Remove USER node from the Dockerfile so the whole image runs as root instead|||Bỏ USER node khỏi Dockerfile để cả ảnh chạy bằng root thay thế',
              'Mount with uid=1000,gid=1000 — a new cache mount is owned by root unless you say otherwise|||Gắn mount kèm uid=1000,gid=1000 — cache mount mới thuộc root trừ khi bạn nói khác',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: The mount directory is created owned by root; the node user (UID 1000) cannot write to it. Reproduced in the chapter: touch gave Permission denied, and the same step printed ok after adding uid=1000,gid=1000. npm’s own hint (sudo chown) is misleading: there is no sudo in the image, and the ownership belongs to the mount, not to files npm created.|||VI: Thư mục mount được tạo thuộc root; người dùng node (UID 1000) không ghi vào được. Đã tái hiện trong chương: touch báo Permission denied, và cùng bước đó in ok sau khi thêm uid=1000,gid=1000. Gợi ý của chính npm (sudo chown) gây lạc hướng: trong ảnh không có sudo, và quyền sở hữu thuộc về cái mount chứ không phải file npm tạo.',
          },
          {
            question: 'CI builds a two-stage Dockerfile with cache-to: type=gha (default mode). After any source edit, the build stage re-runs npm ci on every run. Why?|||CI dựng một Dockerfile hai stage với cache-to: type=gha (mode mặc định). Sau mỗi lần sửa mã, stage dựng lại chạy npm ci ở mọi lượt. Vì sao?',
            options: [
              'GitHub’s cache is scoped per commit, so each new commit starts from an empty cache|||Cache của GitHub giới hạn theo từng commit, nên mỗi commit mới bắt đầu từ cache rỗng',
              'mode=min exports only the final stage’s layers; npm ci lives in the build stage — use mode=max|||mode=min chỉ xuất tầng của stage cuối; npm ci nằm ở stage dựng — hãy dùng mode=max',
              'type=gha cannot store multi-stage builds, so the registry backend is the only option|||type=gha không lưu được dựng nhiều stage, nên chỉ còn cách dùng backend registry',
              'The cache tag must equal the image tag, otherwise BuildKit never finds the exported layers|||Tag của cache phải trùng tag của ảnh, không thì BuildKit không bao giờ tìm thấy tầng đã xuất',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Measured in the chapter on a fresh builder: mode=min exported 58 MB and the rebuild ran npm ci again (DONE 30.7s, 38.9 s total); mode=max exported 332 MB and npm ci was CACHED (19.8 s). GitHub’s cache is scoped per branch with fallback to the default branch, not per commit, so the first option describes something that does not happen.|||VI: Đo trong chương trên builder mới tinh: mode=min xuất 58 MB và lượt dựng lại chạy npm ci lần nữa (DONE 30.7s, tổng 38,9 s); mode=max xuất 332 MB và npm ci là CACHED (19,8 s). Cache của GitHub giới hạn theo nhánh, có lùi về nhánh mặc định, chứ không theo commit, nên phương án đầu mô tả một chuyện không xảy ra.',
          },
          {
            question: 'A blog post says: "the default docker driver silently ignores --cache-to". On Docker Desktop with Engine 29 (containerd image store) you run docker build --cache-to type=local,dest=./bc,mode=max -t app . What actually happens?|||Một bài blog nói: "driver docker mặc định lặng lẽ phớt lờ --cache-to". Trên Docker Desktop với Engine 29 (kho ảnh containerd), bạn chạy docker build --cache-to type=local,dest=./bc,mode=max -t app . Thật ra chuyện gì xảy ra?',
            options: [
              'The flag is ignored and ./bc is never created, exactly as the post says|||Cờ bị bỏ qua và ./bc không bao giờ được tạo, đúng như bài blog nói',
              'It always fails with Cache export is not supported until you create a new builder|||Nó luôn hỏng với Cache export is not supported cho tới khi bạn tạo builder mới',
              'The cache is exported to ./bc; only engines on the old overlay2 store refuse, with an error|||Cache được xuất ra ./bc; chỉ engine còn dùng kho overlay2 cũ mới từ chối, kèm thông báo lỗi',
              'Only type=inline works with the default driver, so the command silently switches to inline|||Chỉ type=inline chạy với driver mặc định, nên lệnh lặng lẽ chuyển sang inline',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Run on the course Mac, it printed exporting cache to client directory … sending cache export 0.8s done. Docker’s docs: the docker driver supports inline, local, registry and gha only with the containerd image store. Without it, buildx fails with Cache export is not supported — an error, never silence. The "always fails" option was true for older setups, not for Docker 29 defaults.|||VI: Chạy trên máy Mac của khoá, nó in exporting cache to client directory … sending cache export 0.8s done. Tài liệu Docker: driver docker hỗ trợ inline, local, registry và gha chỉ khi bật kho ảnh containerd. Không có nó, buildx hỏng với Cache export is not supported — một lỗi, không bao giờ im lặng. Phương án "luôn hỏng" đúng với cấu hình cũ, không đúng với mặc định của Docker 29.',
          },
          {
            question: 'On your M1 Mac, docker build --platform linux/amd64 for the VPS is roughly ten times slower on the compile step than on a teammate’s Linux laptop. docker version --format "{{.Server.Arch}}" prints arm64. Best explanation?|||Trên Mac M1 của bạn, docker build --platform linux/amd64 cho VPS chậm chừng mười lần ở bước biên dịch so với laptop Linux của bạn cùng nhóm. docker version --format "{{.Server.Arch}}" in arm64. Giải thích tốt nhất?',
            options: [
              'Emulation: amd64 instructions are translated on an arm64 host — build natively (CI/amd64 machine) or cross-compile|||Giả lập: lệnh amd64 được phiên dịch trên máy arm64 — hãy dựng native (CI/máy amd64) hoặc biên dịch chéo',
              'A missing .dockerignore makes the Mac send node_modules, which slows every step down|||Thiếu .dockerignore làm Mac gửi cả node_modules, khiến mọi bước chậm theo',
              'The Mac uses mode=min by default, so the compile layer is never kept between builds|||Mac mặc định dùng mode=min, nên tầng biên dịch không bao giờ được giữ giữa các lượt',
              'Docker Desktop’s build cache is full, so BuildKit throttles CPU until you prune it|||Cache dựng của Docker Desktop đã đầy, nên BuildKit bóp CPU cho tới khi bạn tỉa nó',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Measured on the course Mac: the same CPU-bound step took 0.4 s for linux/arm64 and 3.8 s for linux/amd64 (9.5×). A big context costs seconds once, before any step — it does not make a compile step slower; mode=min is a CI export setting and has nothing to do with a local compile.|||VI: Đo trên máy Mac của khoá: cùng một bước ăn CPU mất 0,4 s với linux/arm64 và 3,8 s với linux/amd64 (9,5 lần). Ngữ cảnh to tốn vài giây một lần, trước mọi bước — nó không làm bước biên dịch chậm đi; mode=min là thiết lập xuất cache cho CI, chẳng liên quan gì tới biên dịch ở máy.',
          },
        ],
      },
    },
  ],
};
