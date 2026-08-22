/**
 * Docker — Chương 5: tầng ảnh, cache & dựng nhanh.
 * Cache quyết định thế nào · thứ tự · cache mount · cache trong CI · chẩn đoán · quiz.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 5 — Layers, cache & fast builds|||Chương 5 — Tầng ảnh, cache & dựng nhanh',
  description: 'Biến một lượt dựng bốn phút thành sáu giây. Cache quyết định dùng lại một tầng theo luật nào, thứ tự đúng của các chỉ thị, cache mount cho npm và apt, chia sẻ cache qua registry trong CI, và cách chẩn đoán một lượt dựng chậm.',
  lessons: [
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
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">RUN — the key is the command STRING</span><span class="lz-lnote">BuildKit does not know or care what the command does. <code>RUN apt-get update</code> has the same key today and next month, so a cached result from six weeks ago is reused with a stale package index. Change one character and the key changes.</span></div>
  <div class="lz-layer"><span class="lz-lname">COPY and ADD — the key includes the file CONTENTS</span><span class="lz-lnote">A checksum of every file being copied, plus its path and mode. Edit one byte of one file and the key changes; touch a file without changing it and the key does not (BuildKit ignores mtime, unlike the old builder).</span></div>
  <div class="lz-layer"><span class="lz-lname">Every step depends on the one before it</span><span class="lz-lnote">The key of step N includes the key of step N−1. So a miss at step 3 forces steps 4, 5, 6 to rerun even if nothing about them changed. This chain is why ORDER matters more than anything else.</span></div>
  <div class="lz-layer"><span class="lz-lname">ARG and the base image are inputs too</span><span class="lz-lnote">A different <code>--build-arg</code> value invalidates from the <code>ARG</code> line down. A new digest for <code>FROM</code> (after <code>docker build --pull</code>) invalidates everything.</span></div>
</div>

<h3>Watch it happen</h3>
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
sed -i 's/"express"/"cors": "^2.8.5", "express"/' package.json
npm install --package-lock-only --silent
docker build --progress=plain -t c:3 . 2&gt;&amp;1 | grep -E '^#[0-9]+ (\\[|CACHED|DONE)' | head -8</code></pre>
<div class="out">#5 [1/5] FROM docker.io/library/node:22-alpine@sha256:b8f2c1a4e9d3…
#5 CACHED
#7 [2/5] WORKDIR /app
#7 CACHED
#8 [3/5] COPY package.json package-lock.json ./
#8 DONE 0.1s
#9 [4/5] RUN npm ci --omit=dev
#9 DONE 5.4s
#10 [5/5] COPY app.js ./</div>
<p>Step 3's key changed, so steps 4 and 5 rebuilt too — even though <code>app.js</code> is byte-identical to the previous build. That cascade is rule three, and it is the mechanism behind every "why is my build slow" question in this chapter.</p>

<h3>What silently breaks the cache</h3>
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

<h3>The apt-get problem</h3>
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
<div class="out">#8 DONE 0.1s
#9 DONE 5.6s
#10 DONE 0.0s
#11 exporting to image DONE 0.3s
Shared:		0B
Private:	412.4MB
Reclaimed:	0B
Build Cache	412.4MB	412.4MB (100%)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">--progress=plain</span><span class="v">Shows every step with its duration and whether it was <code>CACHED</code>. This is the primary tool for build performance work — the default collapsing display hides exactly what you need.</span></div>
  <div class="kv"><span class="k">docker builder du</span><span class="v">How much the cache is holding and how much is shared between builds. A useful sanity check before wondering where disk went (Lesson 3.5).</span></div>
  <div class="kv"><span class="k">--no-cache</span><span class="v">Forces everything to rebuild. Use it to measure the true cold-build time and to prove a Dockerfile is reproducible — a build that only works with a warm cache is a build that will fail in CI.</span></div>
  <div class="kv"><span class="k">--no-cache-filter=stage</span><span class="v">Rebuild one named stage while caching the rest. Useful when you suspect one stage has a stale cached result but do not want to pay for a full rebuild.</span></div>
</div>
<pre><code>cd ..; rm -rf cachedemo; docker rmi c:1 c:2 c:3 c:4 c:5 c:6 &gt;/dev/null 2&gt;&amp;1</code></pre>

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
<a class="link-card codelab" href="/code-lab/docker\${REF}" target="_blank" rel="noopener">
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
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">RUN — khoá là CHUỖI câu lệnh</span><span class="lz-lnote">BuildKit không biết và không quan tâm câu lệnh đó LÀM gì. <code>RUN apt-get update</code> có cùng khoá hôm nay và tháng sau, nên một kết quả lưu đệm từ sáu tuần trước được dùng lại với một danh mục gói đã cũ. Đổi một ký tự là khoá đổi.</span></div>
  <div class="lz-layer"><span class="lz-lname">COPY và ADD — khoá bao gồm NỘI DUNG file</span><span class="lz-lnote">Một tổng kiểm tra của mọi file được chép, cộng đường dẫn và chế độ của nó. Sửa một byte của một file là khoá đổi; <code>touch</code> một file mà không đổi nội dung thì khoá KHÔNG đổi (BuildKit bỏ qua mtime, khác bộ dựng cũ).</span></div>
  <div class="lz-layer"><span class="lz-lname">Mọi bước phụ thuộc vào bước TRƯỚC nó</span><span class="lz-lnote">Khoá của bước N bao gồm khoá của bước N−1. Nên một cú trượt ở bước 3 buộc các bước 4, 5, 6 chạy lại dù chẳng có gì về chúng thay đổi. Chuỗi đó chính là lý do THỨ TỰ quan trọng hơn mọi thứ khác.</span></div>
  <div class="lz-layer"><span class="lz-lname">ARG và ảnh nền cũng là đầu vào</span><span class="lz-lnote">Một giá trị <code>--build-arg</code> khác đi thì vô hiệu hoá từ dòng <code>ARG</code> trở xuống. Một digest mới cho <code>FROM</code> (sau <code>docker build --pull</code>) thì vô hiệu hoá tất cả.</span></div>
</div>

<h3>Nhìn tận mắt</h3>
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
sed -i 's/"express"/"cors": "^2.8.5", "express"/' package.json
npm install --package-lock-only --silent
docker build --progress=plain -t c:3 . 2&gt;&amp;1 | grep -E '^#[0-9]+ (\\[|CACHED|DONE)' | head -8</code></pre>
<div class="out">#5 [1/5] FROM docker.io/library/node:22-alpine@sha256:b8f2c1a4e9d3…
#5 CACHED
#7 [2/5] WORKDIR /app
#7 CACHED
#8 [3/5] COPY package.json package-lock.json ./
#8 DONE 0.1s
#9 [4/5] RUN npm ci --omit=dev
#9 DONE 5.4s
#10 [5/5] COPY app.js ./</div>
<p>Khoá của bước 3 đổi, nên bước 4 và 5 cũng dựng lại — mặc dù <code>app.js</code> giống hệt tới từng byte so với lượt dựng trước. Cú lan xuống đó là luật thứ ba, và nó là cơ chế đứng sau mọi câu hỏi "sao bản dựng của tôi chậm thế" trong chương này.</p>

<h3>Những thứ ÂM THẦM phá cache</h3>
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

<h3>Bài toán apt-get</h3>
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
<div class="out">#8 DONE 0.1s
#9 DONE 5.6s
#10 DONE 0.0s
#11 exporting to image DONE 0.3s
Shared:		0B
Private:	412.4MB
Reclaimed:	0B
Build Cache	412.4MB	412.4MB (100%)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">--progress=plain</span><span class="v">Cho thấy mọi bước kèm thời lượng và việc nó có <code>CACHED</code> hay không. Đây là công cụ chính cho việc tối ưu hiệu năng dựng — bản hiển thị gấp gọn mặc định giấu đi đúng cái bạn cần.</span></div>
  <div class="kv"><span class="k">docker builder du</span><span class="v">Cache đang giữ bao nhiêu và bao nhiêu được dùng chung giữa các lượt dựng. Một phép kiểm tỉnh táo hữu ích trước khi tự hỏi đĩa đi đâu (Bài 3.5).</span></div>
  <div class="kv"><span class="k">--no-cache</span><span class="v">Ép mọi thứ dựng lại. Hãy dùng nó để ĐO thời gian dựng nguội thật và để chứng minh một Dockerfile là tái lập được — một lượt dựng chỉ chạy được khi cache còn ấm là một lượt dựng sẽ hỏng trong CI.</span></div>
  <div class="kv"><span class="k">--no-cache-filter=stage</span><span class="v">Dựng lại MỘT stage có tên trong khi vẫn dùng cache cho phần còn lại. Hữu ích khi bạn nghi một stage có kết quả lưu đệm đã cũ mà không muốn trả giá cho một lượt dựng lại toàn bộ.</span></div>
</div>
<pre><code>cd ..; rm -rf cachedemo; docker rmi c:1 c:2 c:3 c:4 c:5 c:6 &gt;/dev/null 2&gt;&amp;1</code></pre>

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
<a class="link-card codelab" href="/code-lab/docker\${REF}" target="_blank" rel="noopener">
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

<h3>The principle</h3>
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
<pre><code>cd ..; rm -rf ord; docker rmi o:slow o:fast o:m &gt;/dev/null 2&gt;&amp;1</code></pre>

<a class="link-card" href="https://docs.docker.com/build/cache/optimize/" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Optimizing builds with cache</span><span class="lc-sub">Docker's own guide to ordering, selective copying and mount types, with the same reasoning and different examples. A good second pass on this lesson.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/dockerfile/#run---mounttypebind" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">RUN --mount=type=bind</span><span class="lc-sub">Reading files during a build without copying them into a layer. The clean solution to the monorepo manifest problem, and it keeps the image smaller too.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker\${REF}" target="_blank" rel="noopener">
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

<h3>Cái nguyên tắc</h3>
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
<pre><code>cd ..; rm -rf ord; docker rmi o:slow o:fast o:m &gt;/dev/null 2&gt;&amp;1</code></pre>

<a class="link-card" href="https://docs.docker.com/build/cache/optimize/" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Tối ưu bản dựng bằng cache</span><span class="lc-sub">Hướng dẫn của chính Docker về thứ tự, chép có chọn lọc và các loại mount, với cùng lý lẽ và ví dụ khác. Một lượt đọc thứ hai tốt cho bài này.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/dockerfile/#run---mounttypebind" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">RUN --mount=type=bind</span><span class="lc-sub">Đọc file trong lúc dựng mà không chép chúng vào một tầng. Giải pháp sạch cho bài toán file khai báo trong monorepo, và nó còn giữ cho ảnh nhỏ hơn.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker\${REF}" target="_blank" rel="noopener">
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

<h3>How it differs from a layer</h3>
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

<h3>Managing the cache itself</h3>
<pre><code>docker builder du --verbose | grep -A2 'cache mount' | head -6
docker builder prune --filter type=exec.cachemount -f
docker builder prune -f --keep-storage 5GB</code></pre>
<div class="out">ID:		x8a2f1c9d3e7b
Description:	cache mount /root/.npm
Size:		318.4MB
Total:		318.4MB
Total reclaimed space: 318.4MB</div>
<div class="callout ok"><strong>Cache mounts grow forever unless you bound them.</strong> They are not part of any image, so <code>docker image prune</code> never touches them, and a machine that builds several projects can quietly accumulate several gigabytes of npm and Go caches. Either prune periodically (Lesson 3.5's timer is the right place) or set a ceiling in <code>/etc/docker/daemon.json</code> with BuildKit's garbage-collection policy, so the builder keeps the cache under a size you chose.</div>
<pre><code>cd ..; rm -rf cm; docker rmi cm:p cm:c &gt;/dev/null 2&gt;&amp;1</code></pre>

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
<a class="link-card codelab" href="/code-lab/docker\${REF}" target="_blank" rel="noopener">
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

<h3>Nó khác một cái tầng ở chỗ nào</h3>
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

<h3>Quản lý chính cái cache đó</h3>
<pre><code>docker builder du --verbose | grep -A2 'cache mount' | head -6
docker builder prune --filter type=exec.cachemount -f
docker builder prune -f --keep-storage 5GB</code></pre>
<div class="out">ID:		x8a2f1c9d3e7b
Description:	cache mount /root/.npm
Size:		318.4MB
Total:		318.4MB
Total reclaimed space: 318.4MB</div>
<div class="callout ok"><strong>Cache mount phình lên MÃI MÃI nếu bạn không chặn trần cho chúng.</strong> Chúng không thuộc bất kỳ ảnh nào, nên <code>docker image prune</code> chẳng bao giờ đụng tới, và một cái máy dựng nhiều dự án có thể lặng lẽ tích lại vài gigabyte cache npm với Go. Hoặc là tỉa định kỳ (cái timer ở Bài 3.5 là chỗ đúng cho việc đó), hoặc đặt một cái trần trong <code>/etc/docker/daemon.json</code> bằng chính sách thu gom rác của BuildKit, để bộ dựng giữ cache dưới một mức bạn chọn.</div>
<pre><code>cd ..; rm -rf cm; docker rmi cm:p cm:c &gt;/dev/null 2&gt;&amp;1</code></pre>

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
<a class="link-card codelab" href="/code-lab/docker\${REF}" target="_blank" rel="noopener">
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
<pre><code>name: build
on:
  push: { branches: [main] }
  pull_request:

jobs:
  docker:
    runs-on: ubuntu-latest
    permissions: { contents: read, packages: write }
    steps:
      - uses: actions/checkout@v4

      - uses: docker/setup-buildx-action@v3

      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - uses: docker/metadata-action@v5
        id: meta
        with:
          images: ghcr.io/\${{ github.repository }}
          tags: |
            type=sha,format=long
            type=ref,event=branch
            type=semver,pattern={{version}}

      - uses: docker/build-push-action@v6
        with:
          context: .
          push: \${{ github.event_name != 'pull_request' }}
          tags: \${{ steps.meta.outputs.tags }}
          labels: \${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          provenance: false</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">setup-buildx-action</span><span class="v">Creates a <code>docker-container</code> builder, which is required for cache export and multi-platform (Lesson 3.4). Without it the default driver silently ignores <code>--cache-to</code>.</span></div>
  <div class="kv"><span class="k">metadata-action</span><span class="v">Generates the tag set from Lesson 3.2 automatically — commit SHA, branch name, semver — plus the <code>org.opencontainers.image.*</code> labels. Three lines instead of a shell script.</span></div>
  <div class="kv"><span class="k">push on main only</span><span class="v">Pull requests build and populate the cache without publishing anything. Note that GitHub Actions caches are scoped per branch with read-only fallback to the default branch, so a PR reads main's cache and cannot poison it.</span></div>
  <div class="kv"><span class="k">GITHUB_TOKEN, not a PAT</span><span class="v">Scoped to this repository, rotated per run, and it can push to GHCR with <code>packages: write</code>. No secret to manage or leak (Lesson 3.3).</span></div>
  <div class="kv"><span class="k">provenance: false</span><span class="v">Suppresses the attestation manifest. Some registries and deployment tools still choke on the <code>unknown/unknown</code> entry it adds (Lesson 3.4). Leave it on where your tooling supports it.</span></div>
</div>

<h3>Prove the cache is working</h3>
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
  <div class="kv"><span class="k">GitHub's cache has a quota</span><span class="v">10GB per repository, evicted least-recently-used. A large <code>mode=max</code> cache can evict your other caches — worth knowing when test caches start missing for no obvious reason.</span></div>
</div>

<h3>Choosing</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">GitHub Actions, one repo</span><span class="lz-t">type=gha,mode=max</span><span class="lz-d">Least configuration, fastest, automatic branch scoping. Start here if you are on Actions.</span></div>
  <div class="lz-step"><span class="lz-k">Several CI systems, or laptops too</span><span class="lz-t">type=registry,mode=max</span><span class="lz-d">The cache lives where everyone can reach it, so a developer's first build of the day is warm too. Slightly slower than <code>gha</code>, far more portable.</span></div>
  <div class="lz-step"><span class="lz-k">Self-hosted runners</span><span class="lz-t">type=local, or a persistent builder</span><span class="lz-d">If the runner keeps its disk between jobs, a persistent <code>docker-container</code> builder needs no cache flags at all — the local cache simply survives.</span></div>
  <div class="lz-step"><span class="lz-k">Single-stage image, minimal setup</span><span class="lz-t">type=inline</span><span class="lz-d">No extra storage, no extra tag, one flag. Remember it cannot cache a build stage, so it is the wrong choice the moment you go multi-stage.</span></div>
</div>

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
<a class="link-card codelab" href="/code-lab/docker\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: warm the CI cache</span><span class="lc-sub">Graded exercises: prove a cache export works by deleting the builder, pick the right backend for three scenarios, explain why <code>mode=min</code> caches nothing useful in a multi-stage build, and spot the missing <code>setup-buildx-action</code>.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> <code>--cache-to</code> silently doing nothing because the default builder is in use. The <code>docker</code> driver — what you get without <code>docker buildx create</code> or <code>setup-buildx-action</code> — cannot export cache, and depending on the version it either warns quietly or ignores the flag entirely. The build succeeds, the workflow is green, and every run is cold forever. The symptom is a CI build that takes the same time whether or not anything changed. Check with <code>docker buildx inspect</code> that the driver is <code>docker-container</code>, and grep the build log for <code>exporting cache</code> — if that line is absent, nothing was exported.</div>
<p class="note-ct"><strong>Three things to remember.</strong> A fresh CI runner has no cache, so everything earlier in this chapter is worthless there until you add <code>--cache-from</code>/<code>--cache-to</code>. Use <code>mode=max</code> — the default <code>mode=min</code> exports only the final image's layers, which excludes the expensive build stage in every multi-stage Dockerfile. And cache mounts do not export, so in CI a layer miss still means a full download: the layer cache travels, the npm cache does not.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Chia sẻ cache với CI</h2>
<p class="lead">Mọi thứ trong chương này cho tới giờ đều làm cho bản dựng <em>CỤC BỘ</em> của bạn nhanh. Máy chạy CI là những cái máy mới tinh với cache rỗng, nên chẳng thứ nào giúp được gì ở đó — và CI mới là chỗ thời gian dựng tốn kém nhất, vì nó nằm trên đường từ một commit tới một bản deploy. Cách chữa là cất cái cache ở một chỗ mà cả hai lượt chạy đều với tới được.</p>

<h3>Hai cái cờ</h3>
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
<pre><code>name: build
on:
  push: { branches: [main] }
  pull_request:

jobs:
  docker:
    runs-on: ubuntu-latest
    permissions: { contents: read, packages: write }
    steps:
      - uses: actions/checkout@v4

      - uses: docker/setup-buildx-action@v3

      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - uses: docker/metadata-action@v5
        id: meta
        with:
          images: ghcr.io/\${{ github.repository }}
          tags: |
            type=sha,format=long
            type=ref,event=branch
            type=semver,pattern={{version}}

      - uses: docker/build-push-action@v6
        with:
          context: .
          push: \${{ github.event_name != 'pull_request' }}
          tags: \${{ steps.meta.outputs.tags }}
          labels: \${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          provenance: false</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">setup-buildx-action</span><span class="v">Tạo một bộ dựng <code>docker-container</code>, thứ BẮT BUỘC để xuất cache và để dựng đa nền tảng (Bài 3.4). Không có nó thì trình mặc định âm thầm PHỚT LỜ <code>--cache-to</code>.</span></div>
  <div class="kv"><span class="k">metadata-action</span><span class="v">Tự sinh bộ tag của Bài 3.2 — mã commit, tên nhánh, semver — cộng những nhãn <code>org.opencontainers.image.*</code>. Ba dòng thay cho một script shell.</span></div>
  <div class="kv"><span class="k">chỉ push trên main</span><span class="v">Pull request vẫn dựng và làm đầy cache mà không công bố gì. Lưu ý rằng cache của GitHub Actions giới hạn phạm vi theo nhánh với dự phòng CHỈ ĐỌC về nhánh mặc định, nên một PR ĐỌC được cache của main mà không đầu độc được nó.</span></div>
  <div class="kv"><span class="k">GITHUB_TOKEN, không phải PAT</span><span class="v">Giới hạn phạm vi trong kho này, xoay vòng theo từng lượt chạy, và nó đẩy được lên GHCR với <code>packages: write</code>. Không có bí mật nào phải quản lý hay bị rò (Bài 3.3).</span></div>
  <div class="kv"><span class="k">provenance: false</span><span class="v">Chặn cái manifest chứng thực. Vài registry và công cụ triển khai vẫn nghẹn với mục <code>unknown/unknown</code> mà nó thêm vào (Bài 3.4). Hãy bật nó ở nơi công cụ của bạn hỗ trợ.</span></div>
</div>

<h3>Chứng minh cache đang hoạt động</h3>
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
  <div class="kv"><span class="k">Cache của GitHub có hạn mức</span><span class="v">10GB mỗi kho, loại bỏ theo kiểu ít-dùng-gần-đây-nhất. Một cái cache <code>mode=max</code> lớn có thể ĐẨY BẬT những cache khác của bạn — đáng biết khi cache của test bắt đầu trượt mà chẳng có lý do rõ ràng nào.</span></div>
</div>

<h3>Chọn cái nào</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">GitHub Actions, một kho</span><span class="lz-t">type=gha,mode=max</span><span class="lz-d">Ít cấu hình nhất, nhanh nhất, tự động giới hạn phạm vi theo nhánh. Hãy bắt đầu từ đây nếu bạn dùng Actions.</span></div>
  <div class="lz-step"><span class="lz-k">Nhiều hệ CI, hoặc cả laptop nữa</span><span class="lz-t">type=registry,mode=max</span><span class="lz-d">Cache nằm ở chỗ ai cũng với tới được, nên lượt dựng đầu ngày của một lập trình viên cũng ấm luôn. Chậm hơn <code>gha</code> một chút, mang đi được hơn hẳn.</span></div>
  <div class="lz-step"><span class="lz-k">Máy chạy CI tự dựng</span><span class="lz-t">type=local, hoặc một bộ dựng bền vững</span><span class="lz-d">Nếu máy chạy giữ nguyên đĩa giữa các công việc thì một bộ dựng <code>docker-container</code> bền vững chẳng cần cờ cache nào cả — cache cục bộ đơn giản là sống sót.</span></div>
  <div class="lz-step"><span class="lz-k">Ảnh một tầng, thiết lập tối thiểu</span><span class="lz-t">type=inline</span><span class="lz-d">Không kho lưu phụ, không tag phụ, một cái cờ. Nhớ rằng nó KHÔNG lưu đệm được stage dựng, nên nó là lựa chọn sai ngay khoảnh khắc bạn chuyển sang nhiều tầng.</span></div>
</div>

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
<a class="link-card codelab" href="/code-lab/docker\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: làm ấm cache của CI</span><span class="lc-sub">Bài chấm điểm: chứng minh một lượt xuất cache có hoạt động bằng cách xoá bộ dựng, chọn backend đúng cho ba tình huống, giải thích vì sao <code>mode=min</code> chẳng lưu đệm được gì hữu ích trong một lượt dựng nhiều tầng, và phát hiện chỗ thiếu <code>setup-buildx-action</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>--cache-to</code> âm thầm chẳng làm gì vì đang dùng bộ dựng mặc định. Trình <code>docker</code> — thứ bạn có khi không chạy <code>docker buildx create</code> hay <code>setup-buildx-action</code> — KHÔNG xuất được cache, và tuỳ phiên bản mà nó hoặc cảnh báo khe khẽ hoặc phớt lờ cái cờ hoàn toàn. Lượt dựng thành công, workflow xanh, và mọi lượt chạy đều nguội mãi mãi. Triệu chứng là một lượt dựng CI mất thời gian như nhau bất kể có gì thay đổi hay không. Hãy kiểm bằng <code>docker buildx inspect</code> rằng trình điều khiển là <code>docker-container</code>, và grep log dựng tìm dòng <code>exporting cache</code> — nếu dòng đó vắng mặt thì chẳng có gì được xuất cả.</div>
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
<pre><code><span class="tok-comment"># 1 · Cold: nothing cached at all — what CI experiences on a fresh runner</span>
time docker build --no-cache -q -t app:m . &gt;/dev/null

<span class="tok-comment"># 2 · Warm: nothing changed — this should be under a second</span>
time docker build -q -t app:m . &gt;/dev/null

<span class="tok-comment"># 3 · After a source edit — the number you live with all day</span>
touch src/index.ts &amp;&amp; echo '// x' &gt;&gt; src/index.ts
time docker build -q -t app:m . &gt;/dev/null</code></pre>
<div class="out">real	3m41.902s
real	0m0.412s
real	0m9.118s</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Cold is slow, warm is fast, edit is fast</span><span class="v">Normal and healthy. Cold time only matters in CI — go to Lesson 5.4 and share the cache.</span></div>
  <div class="kv"><span class="k">Warm is slow (over a few seconds)</span><span class="v">Something invalidates the cache even when nothing changed. Usually a changing <code>ARG</code>, a file rewritten by a tool, or <code>--pull</code>/<code>--no-cache</code> left in a script. Check the context size first.</span></div>
  <div class="kv"><span class="k">Edit is slow but warm is fast</span><span class="v">Ordering. Your source is copied too early, so a source change invalidates the dependency install (Lesson 5.2). The most common case and the easiest to fix.</span></div>
  <div class="kv"><span class="k">All three are slow</span><span class="v">Something is wrong outside the cache: an enormous context, emulation, a huge base image, or a genuinely slow step. The timings below will name it.</span></div>
</div>

<h3>Find the expensive step</h3>
<pre><code>docker build --no-cache --progress=plain -t app:m . 2&gt;&amp;1 \\
  | grep -E '^#[0-9]+ (DONE|CACHED)' \\
  | sort -t' ' -k3 -hr | head -8</code></pre>
<div class="out">#14 DONE 118.4s
#9 DONE 42.7s
#17 DONE 11.2s
#7 DONE 3.9s
#12 DONE 0.4s
#6 DONE 0.2s
#5 CACHED
#4 CACHED</div>
<pre><code><span class="tok-comment"># Which instruction is #14?</span>
docker build --no-cache --progress=plain -t app:m . 2&gt;&amp;1 | grep -E '^#(14|9|17) \\['</code></pre>
<div class="out">#14 [build 6/8] RUN npm run build
#9 [deps 4/8] RUN npm ci
#17 [stage-2 3/4] COPY --from=build /app/dist ./dist</div>
<p>Two steps account for 160 of the 180 seconds. Everything else is rounding error, and optimising it would be wasted effort — which is exactly why you measure before you change anything.</p>

<h3>Seven causes and their signatures</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · A huge build context</span><span class="lz-t">signature: "transferring context: 412.7MB"</span><span class="lz-d">Seconds before any instruction runs, on every build. Almost always <code>node_modules</code>, <code>.git</code>, or a <code>dist/</code> left over. Fix: <code>.dockerignore</code> (Lesson 4.1).</span></div>
  <div class="lz-step"><span class="lz-k">2 · COPY . . above the install</span><span class="lz-t">signature: warm build fast, edit build slow</span><span class="lz-d">The dependency step reruns on every source change. Fix: copy manifests first (Lesson 5.2). This is the single most common cause.</span></div>
  <div class="lz-step"><span class="lz-k">3 · No cache mount on the install</span><span class="lz-t">signature: adding one dependency re-downloads everything</span><span class="lz-d">Fix: <code>RUN --mount=type=cache,target=/root/.npm</code> (Lesson 5.3).</span></div>
  <div class="lz-step"><span class="lz-k">4 · A per-build ARG or file</span><span class="lz-t">signature: warm build is slow, and nothing changed</span><span class="lz-d">A <code>BUILD_DATE</code> arg, a CI-generated <code>.env</code>, a version stamp. Fix: move it below the expensive steps, or out of the context.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Emulation</span><span class="lz-t">signature: 5–20× slower than the same build on another machine</span><span class="lz-d">Check <code>docker version --format '{{.Server.Arch}}'</code> against the image's platform. Fix: build natively or cross-compile (Lesson 3.4).</span></div>
  <div class="lz-step"><span class="lz-k">6 · --pull or --no-cache in a script</span><span class="lz-t">signature: every build is a cold build</span><span class="lz-d">Someone added it to fix a stale-cache problem in 2024 and it never came out. Fix: remove it, and keep <code>--pull</code> for the scheduled rebuild only.</span></div>
  <div class="lz-step"><span class="lz-k">7 · The step is genuinely slow</span><span class="lz-t">signature: a single DONE line dominating the timings</span><span class="lz-d">A webpack build, a Rust compile, a test suite in the image. Fix: that is an application problem, not a Docker one — but a cache mount for its own cache directory usually helps a lot.</span></div>
</div>

<h3>docker build --check</h3>
<pre><code>docker build --check -t app:m . 2&gt;&amp;1 | head -20</code></pre>
<div class="out">WARNING: LegacyKeyValueFormat - Legacy key/value format with whitespace separator should not be used
Dockerfile:5
--------------------
   4 |     WORKDIR /app
   5 | &gt;&gt;&gt; ENV NODE_ENV production
   6 |     COPY . .
--------------------

WARNING: UndefinedVar - Usage of undefined variable '\$NPM_TOKEN'
Dockerfile:9

WARNING: CopyIgnoredFile - Attempting to Copy file that is excluded by .dockerignore
Dockerfile:6</div>
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
 =&gt; =&gt; transferring context: 4.21kB                                        0.0s
== builder driver ==
Driver:  docker-container
Platforms: linux/amd64, linux/arm64
== arch match ==
amd64
== warm build ==
real	0m0.412s
== lint ==
0
== cache size ==
Private:	1.204GB
== slowest steps ==
#14 DONE 118.4s
#9 DONE 42.7s
#17 DONE 11.2s</div>

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
<a class="link-card codelab" href="/code-lab/docker\${REF}" target="_blank" rel="noopener">
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
<pre><code><span class="tok-comment"># 1 · Nguội: không có cache nào — thứ CI trải qua trên một máy chạy mới tinh</span>
time docker build --no-cache -q -t app:m . &gt;/dev/null

<span class="tok-comment"># 2 · Ấm: không có gì thay đổi — cái này phải dưới một giây</span>
time docker build -q -t app:m . &gt;/dev/null

<span class="tok-comment"># 3 · Sau một lần sửa mã nguồn — con số bạn sống cùng cả ngày</span>
touch src/index.ts &amp;&amp; echo '// x' &gt;&gt; src/index.ts
time docker build -q -t app:m . &gt;/dev/null</code></pre>
<div class="out">real	3m41.902s
real	0m0.412s
real	0m9.118s</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Nguội chậm, ấm nhanh, sửa nhanh</span><span class="v">Bình thường và khoẻ mạnh. Thời gian nguội chỉ quan trọng trong CI — hãy sang Bài 5.4 và chia sẻ cái cache.</span></div>
  <div class="kv"><span class="k">Ấm mà chậm (hơn vài giây)</span><span class="v">Có thứ gì đó vô hiệu hoá cache kể cả khi không có gì thay đổi. Thường là một <code>ARG</code> đang đổi, một file bị công cụ nào đó ghi lại, hoặc <code>--pull</code>/<code>--no-cache</code> sót lại trong một script. Hãy kiểm kích thước ngữ cảnh trước.</span></div>
  <div class="kv"><span class="k">Sửa thì chậm nhưng ấm thì nhanh</span><span class="v">Thứ tự. Mã nguồn của bạn được chép quá sớm, nên một thay đổi mã nguồn vô hiệu hoá lượt cài thư viện (Bài 5.2). Trường hợp phổ biến nhất và dễ sửa nhất.</span></div>
  <div class="kv"><span class="k">Cả ba đều chậm</span><span class="v">Có gì đó sai NGOÀI cái cache: một ngữ cảnh khổng lồ, mô phỏng, một ảnh nền quá lớn, hoặc một bước thật sự chậm. Những mốc thời gian ở dưới sẽ gọi tên nó ra.</span></div>
</div>

<h3>Tìm ra cái bước đắt tiền</h3>
<pre><code>docker build --no-cache --progress=plain -t app:m . 2&gt;&amp;1 \\
  | grep -E '^#[0-9]+ (DONE|CACHED)' \\
  | sort -t' ' -k3 -hr | head -8</code></pre>
<div class="out">#14 DONE 118.4s
#9 DONE 42.7s
#17 DONE 11.2s
#7 DONE 3.9s
#12 DONE 0.4s
#6 DONE 0.2s
#5 CACHED
#4 CACHED</div>
<pre><code><span class="tok-comment"># #14 là chỉ thị nào?</span>
docker build --no-cache --progress=plain -t app:m . 2&gt;&amp;1 | grep -E '^#(14|9|17) \\['</code></pre>
<div class="out">#14 [build 6/8] RUN npm run build
#9 [deps 4/8] RUN npm ci
#17 [stage-2 3/4] COPY --from=build /app/dist ./dist</div>
<p>Hai bước chiếm 160 trong tổng số 180 giây. Mọi thứ khác là con số làm tròn, và tối ưu chúng là công sức đổ đi — và đó chính xác là lý do bạn ĐO trước khi đổi bất cứ thứ gì.</p>

<h3>Bảy nguyên nhân và dấu hiệu của chúng</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Một ngữ cảnh dựng khổng lồ</span><span class="lz-t">dấu hiệu: "transferring context: 412.7MB"</span><span class="lz-d">Vài giây TRƯỚC KHI có chỉ thị nào chạy, ở mọi lượt dựng. Gần như luôn là <code>node_modules</code>, <code>.git</code>, hay một thư mục <code>dist/</code> còn sót. Cách chữa: <code>.dockerignore</code> (Bài 4.1).</span></div>
  <div class="lz-step"><span class="lz-k">2 · COPY . . đứng trên lượt cài</span><span class="lz-t">dấu hiệu: dựng ấm thì nhanh, dựng sau khi sửa thì chậm</span><span class="lz-d">Bước cài thư viện chạy lại ở mọi thay đổi mã nguồn. Cách chữa: chép file khai báo trước (Bài 5.2). Đây là nguyên nhân phổ biến nhất.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Không có cache mount cho lượt cài</span><span class="lz-t">dấu hiệu: thêm MỘT thư viện là tải lại TẤT CẢ</span><span class="lz-d">Cách chữa: <code>RUN --mount=type=cache,target=/root/.npm</code> (Bài 5.3).</span></div>
  <div class="lz-step"><span class="lz-k">4 · Một ARG hay một file đổi ở mọi lượt dựng</span><span class="lz-t">dấu hiệu: dựng ấm mà vẫn chậm, dù chẳng có gì đổi</span><span class="lz-d">Một tham số <code>BUILD_DATE</code>, một <code>.env</code> do CI sinh ra, một dấu phiên bản. Cách chữa: dời nó XUỐNG DƯỚI những bước đắt tiền, hoặc ra khỏi ngữ cảnh.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Mô phỏng</span><span class="lz-t">dấu hiệu: chậm gấp 5–20 lần so với cùng lượt dựng trên máy khác</span><span class="lz-d">Hãy đối chiếu <code>docker version --format '{{.Server.Arch}}'</code> với nền tảng của cái ảnh. Cách chữa: dựng native hoặc biên dịch chéo (Bài 3.4).</span></div>
  <div class="lz-step"><span class="lz-k">6 · --pull hay --no-cache sót trong một script</span><span class="lz-t">dấu hiệu: mọi lượt dựng đều là dựng nguội</span><span class="lz-d">Có ai đó thêm nó vào để chữa một vấn đề cache cũ hồi 2024 và nó không bao giờ được gỡ ra. Cách chữa: bỏ nó đi, và chỉ giữ <code>--pull</code> cho lượt dựng lại theo lịch.</span></div>
  <div class="lz-step"><span class="lz-k">7 · Cái bước đó thật sự chậm</span><span class="lz-t">dấu hiệu: một dòng DONE duy nhất áp đảo bảng thời gian</span><span class="lz-d">Một lượt build webpack, một lượt biên dịch Rust, một bộ test chạy trong ảnh. Cách chữa: đó là vấn đề của ỨNG DỤNG chứ không phải của Docker — nhưng một cache mount cho chính thư mục cache của nó thường giúp rất nhiều.</span></div>
</div>

<h3>docker build --check</h3>
<pre><code>docker build --check -t app:m . 2&gt;&amp;1 | head -20</code></pre>
<div class="out">WARNING: LegacyKeyValueFormat - Legacy key/value format with whitespace separator should not be used
Dockerfile:5
--------------------
   4 |     WORKDIR /app
   5 | &gt;&gt;&gt; ENV NODE_ENV production
   6 |     COPY . .
--------------------

WARNING: UndefinedVar - Usage of undefined variable '\$NPM_TOKEN'
Dockerfile:9

WARNING: CopyIgnoredFile - Attempting to Copy file that is excluded by .dockerignore
Dockerfile:6</div>
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
 =&gt; =&gt; transferring context: 4.21kB                                        0.0s
== trình dựng ==
Driver:  docker-container
Platforms: linux/amd64, linux/arm64
== khớp kiến trúc ==
amd64
== dựng ấm ==
real	0m0.412s
== soát lỗi ==
0
== kích thước cache ==
Private:	1.204GB
== bước chậm nhất ==
#14 DONE 118.4s
#9 DONE 42.7s
#17 DONE 11.2s</div>

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
<a class="link-card codelab" href="/code-lab/docker\${REF}" target="_blank" rel="noopener">
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
      description: 'Tám câu về khoá cache của RUN với COPY, apt-get update, thứ tự, cache mount, mode=max, cache mount không xuất được, và cách đo trước khi tối ưu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on build performance. These are worth real minutes every day, so being precise here pays back quickly.</p>
<div class="callout ok">Aim for 7/8. The three that matter most: why <code>apt-get update</code> alone in a <code>RUN</code> is a trap (5.1), why ordering beats every other optimisation (5.2), and why <code>mode=min</code> caches nothing useful in a multi-stage build (5.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về hiệu năng lúc dựng. Chúng đáng giá vài phút thật mỗi ngày, nên chính xác ở đây thì hoàn vốn nhanh.</p>
<div class="callout ok">Hãy nhắm 7/8. Ba câu quan trọng nhất: vì sao <code>apt-get update</code> đứng một mình trong một <code>RUN</code> là cái bẫy (bài 5.1), vì sao thứ tự thắng mọi tối ưu khác (bài 5.2), và vì sao <code>mode=min</code> chẳng lưu đệm được gì hữu ích trong một lượt dựng nhiều tầng (bài 5.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What does BuildKit use as the cache key for a RUN instruction?|||BuildKit dùng gì làm khoá cache cho một chỉ thị RUN?',
            options: [
              'A checksum of the files the command touches|||Một tổng kiểm tra của những file mà câu lệnh đó đụng tới',
              'The command STRING itself (plus the previous step\\u2019s key) — BuildKit has no idea what the command does, which is why a cached apt-get update stays stale forever|||Chính CHUỖI câu lệnh (cộng khoá của bước trước) — BuildKit hoàn toàn không biết câu lệnh đó làm gì, và đó là lý do một apt-get update đã lưu đệm cứ cũ mãi',
              'The exit code of the command|||Mã thoát của câu lệnh',
              'The timestamp of the last build|||Mốc thời gian của lượt dựng gần nhất',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why must apt-get update and apt-get install be in the same RUN?|||Vì sao apt-get update và apt-get install phải nằm trong CÙNG một RUN?',
            options: [
              'Because apt locks its database between commands|||Vì apt khoá cơ sở dữ liệu của nó giữa các câu lệnh',
              'Because separate RUNs get separate cache keys — adding a package changes only the install line, so a weeks-old package index stays cached and the install fails with a 404|||Vì các lệnh RUN riêng có khoá cache riêng — thêm một gói chỉ đổi dòng install, nên một danh mục gói cũ hàng tuần vẫn nằm trong cache và lượt cài hỏng với lỗi 404',
              'To reduce the number of layers|||Để giảm số tầng',
              'Because update writes to /tmp, which is cleared between layers|||Vì update ghi vào /tmp, và /tmp bị xoá giữa các tầng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Editing a README triggers a full npm ci. What is wrong with the Dockerfile?|||Sửa một cái README lại kích hoạt npm ci chạy lại toàn bộ. Dockerfile sai ở đâu?',
            options: [
              'The base image is not pinned|||Ảnh nền chưa được ghim',
              'COPY . . appears before the install step, so every file in the context is part of that step\\u2019s key and invalidation cascades downward — copy package.json and the lockfile first|||COPY . . đứng TRƯỚC bước cài, nên mọi file trong ngữ cảnh đều là một phần của khoá bước đó và việc vô hiệu hoá lan xuống dưới — hãy chép package.json với lockfile trước',
              'npm ci always ignores the cache|||npm ci luôn bỏ qua cache',
              'The README is too large|||File README quá lớn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the difference between a cached layer and a cache mount?|||Khác biệt giữa một tầng đã lưu đệm và một cache mount là gì?',
            options: [
              'They are the same mechanism with different syntax|||Chúng là cùng một cơ chế với cú pháp khác nhau',
              'A cached layer SKIPS the step entirely (all-or-nothing); a cache mount lets the step run with its downloads already present, making a cache MISS cheap — use both|||Một tầng đã lưu đệm thì BỎ QUA hẳn cái bước (được ăn cả ngã về không); một cache mount để bước đó CHẠY với phần tải về đã có sẵn, khiến một cú TRƯỢT cache trở nên rẻ — hãy dùng cả hai',
              'A cache mount is stored inside the final image|||Cache mount được lưu bên trong ảnh cuối',
              'A cached layer only works with COPY|||Tầng lưu đệm chỉ hoạt động với COPY',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Should you cache /app/node_modules with --mount=type=cache?|||Có nên lưu đệm /app/node_modules bằng --mount=type=cache không?',
            options: [
              'Yes — it is the biggest directory, so it saves the most|||Có — nó là thư mục lớn nhất nên tiết kiệm được nhiều nhất',
              'No — a cache mount is not part of any layer, so the final image would have NO dependencies at all; cache the download directory (~/.npm) instead|||KHÔNG — cache mount không thuộc tầng nào, nên ảnh cuối sẽ HOÀN TOÀN không có thư viện; hãy lưu đệm thư mục tải về (~/.npm) thay vào đó',
              'Yes, but only with sharing=locked|||Có, nhưng chỉ với sharing=locked',
              'Only for pnpm, not npm|||Chỉ với pnpm, không phải npm',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your CI uses --cache-to type=gha with the default mode on a multi-stage Dockerfile. Why is the build still cold every time?|||CI của bạn dùng --cache-to type=gha với mode mặc định trên một Dockerfile nhiều tầng. Vì sao lượt dựng vẫn nguội mỗi lần?',
            options: [
              'GitHub Actions caches expire after one hour|||Cache của GitHub Actions hết hạn sau một giờ',
              'The default mode=min exports only the FINAL image\\u2019s layers, and the expensive build stage is not in the final image — use mode=max|||mode=min mặc định chỉ xuất những tầng của ảnh CUỐI, mà cái stage dựng đắt tiền thì không nằm trong ảnh cuối — hãy dùng mode=max',
              'type=gha does not support multi-stage builds|||type=gha không hỗ trợ dựng nhiều tầng',
              'The cache must be named the same as the image tag|||Cache phải đặt tên giống hệt tag của ảnh',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You add --cache-to but the log never says "exporting cache". What is the most likely cause?|||Bạn thêm --cache-to nhưng log không bao giờ ghi "exporting cache". Nguyên nhân khả dĩ nhất là gì?',
            options: [
              'The registry rejected the push|||Registry từ chối lượt đẩy',
              'The default docker driver is in use, which cannot export cache — create a docker-container builder (or add setup-buildx-action in CI)|||Đang dùng trình docker mặc định, thứ này KHÔNG xuất cache được — hãy tạo một bộ dựng docker-container (hoặc thêm setup-buildx-action trong CI)',
              'The Dockerfile has no named stages|||Dockerfile không có stage nào được đặt tên',
              'You must also pass --no-cache|||Bạn phải truyền thêm --no-cache',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A build with twenty RUN instructions takes three minutes. What do you do first?|||Một lượt dựng có hai mươi chỉ thị RUN mất ba phút. Bạn làm gì ĐẦU TIÊN?',
            options: [
              'Merge the RUN instructions to reduce layers|||Gộp các chỉ thị RUN lại để giảm số tầng',
              'Measure: --progress=plain, sort the DONE lines by duration, and only optimise the one or two steps that dominate — merging RUNs usually changes nothing except cache granularity|||ĐO: --progress=plain, sắp xếp các dòng DONE theo thời lượng, và chỉ tối ưu một hai bước áp đảo — gộp RUN thường chẳng đổi gì ngoài việc làm cache thô đi',
              'Switch to a smaller base image|||Đổi sang một ảnh nền nhỏ hơn',
              'Add --no-cache to get a clean baseline for every build|||Thêm --no-cache để mọi lượt dựng có một mốc sạch',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
